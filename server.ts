import express from "express";
import nodemailer from "nodemailer";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const RECIPIENT_EMAIL = "sadmanrhd@gmail.com";

interface ContactBody {
  name?: unknown;
  email?: unknown;
  topic?: unknown;
  message?: unknown;
}

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 8;
const rateBuckets = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateBuckets.get(ip) || []).filter(
    (ts) => now - ts < RATE_WINDOW_MS,
  );
  if (timestamps.length >= RATE_MAX_REQUESTS) {
    rateBuckets.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  rateBuckets.set(ip, timestamps);

  // Keep memory bounded if many unique IPs hit the endpoint
  if (rateBuckets.size > 500) {
    for (const [key, list] of rateBuckets.entries()) {
      const fresh = list.filter((ts) => now - ts < RATE_WINDOW_MS);
      if (fresh.length === 0) {
        rateBuckets.delete(key);
      } else {
        rateBuckets.set(key, fresh);
      }
    }
  }
  return false;
}

function stripHeaderLineBreaks(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function normalizeTopic(rawTopic: unknown): string | null {
  if (typeof rawTopic !== "string") return null;
  const trimmed = rawTopic.trim();
  if (trimmed === "Product Design") return "Product Design";
  if (trimmed === "Photography" || trimmed === "Street Photography") {
    return "Photography";
  }
  if (trimmed === "Both" || trimmed === "Product Design & Photography") {
    return "Product Design & Photography";
  }
  return null;
}

function buildPlainTextEmail(params: {
  name: string;
  email: string;
  topic: string;
  message: string;
}): string {
  return [
    "Hi Sadman,",
    "",
    params.message,
    "",
    "--",
    `From: ${params.name} <${params.email}>`,
    `Topic: ${params.topic}`,
    `Reply directly to this email to respond to ${params.name}.`,
  ].join("\n");
}

async function startServer() {
  const app = express();
  app.set("trust proxy", 1);
  app.use(express.json({ limit: "16kb" }));

  // Direct Gmail SMTP inquiry route (no third-party form wrapper)
  app.post("/api/contact", async (req, res) => {
    const clientIp = req.ip || "unknown";
    if (isRateLimited(clientIp)) {
      res.status(429).json({
        ok: false,
        emailSent: false,
        configured: true,
        error: "Too many messages sent recently. Please wait a few minutes and try again.",
      });
      return;
    }

    const body = (req.body || {}) as ContactBody;
    const rawName = typeof body.name === "string" ? stripHeaderLineBreaks(body.name) : "";
    const rawEmail = typeof body.email === "string" ? stripHeaderLineBreaks(body.email) : "";
    const rawMessage = typeof body.message === "string" ? body.message.trim() : "";
    const topic = normalizeTopic(body.topic);

    if (rawName.length < 2 || rawName.length > 100) {
      res.status(400).json({
        ok: false,
        emailSent: false,
        configured: true,
        error: "Please enter a valid name (2 to 100 characters).",
      });
      return;
    }

    if (
      rawEmail.length < 5 ||
      rawEmail.length > 160 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)
    ) {
      res.status(400).json({
        ok: false,
        emailSent: false,
        configured: true,
        error: "Please enter a valid email address.",
      });
      return;
    }

    if (!topic) {
      res.status(400).json({
        ok: false,
        emailSent: false,
        configured: true,
        error: "Please choose a valid inquiry topic.",
      });
      return;
    }

    if (rawMessage.length < 10 || rawMessage.length > 3000) {
      res.status(400).json({
        ok: false,
        emailSent: false,
        configured: true,
        error: "Please share a brief message (10 to 3,000 characters).",
      });
      return;
    }

    const gmailUser = (process.env.GMAIL_USER || RECIPIENT_EMAIL).trim();
    const gmailAppPassword = (process.env.GMAIL_APP_PASSWORD || "")
      .replace(/\s+/g, "")
      .trim();

    if (!gmailAppPassword) {
      res.status(200).json({
        ok: true,
        emailSent: false,
        configured: false,
      });
      return;
    }

    const safeDisplayName = rawName.replace(/["<>]/g, "");
    const subject = `[${topic}] Inquiry from ${rawName}`;
    const text = buildPlainTextEmail({
      name: rawName,
      email: rawEmail,
      topic,
      message: rawMessage,
    });

    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: gmailUser,
          pass: gmailAppPassword,
        },
      });

      await transporter.sendMail({
        from: `"Sadman Portfolio" <${gmailUser}>`,
        to: RECIPIENT_EMAIL,
        replyTo: `"${safeDisplayName}" <${rawEmail}>`,
        subject,
        text,
      });

      res.status(200).json({
        ok: true,
        emailSent: true,
        configured: true,
      });
    } catch (error) {
      const code =
        error && typeof error === "object" && "code" in error
          ? String((error as { code?: unknown }).code)
          : "SMTP_ERROR";
      console.error(`Gmail SMTP delivery failed (${code})`);
      res.status(502).json({
        ok: false,
        emailSent: false,
        configured: true,
        error:
          "Gmail delivery could not complete right now. Your inquiry is still backed up, or you can send via Gmail below.",
      });
    }
  });

  const isProduction = process.env.NODE_ENV === "production";
  const distDir = path.resolve(rootDir, "dist");

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    app.get("/{*splat}", (_req, res) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Portfolio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
