import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import {
  CONTACT_API_ENDPOINT,
  buildContactEmailSubject,
  buildContactSubmissionPayload,
  type CanonicalInquiryTopic,
  type ContactFormValues,
} from "../utils/portfolioLogic";

export type InquiryStatus = "new" | "read" | "archived";

export interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  topic: CanonicalInquiryTopic;
  subject: string;
  message: string;
  emailDelivered: boolean;
  status: InquiryStatus;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface ContactDeliveryResult {
  ok: boolean;
  emailSent: boolean;
  backupSaved: boolean;
  smtpConfigured: boolean;
  error?: string;
}

function generateInquiryId(): string {
  const rand =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 14)
      : Math.random().toString(36).slice(2, 14);
  return `inq_${Date.now().toString(36)}_${rand}`;
}

function toDateOrNull(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === "object" && value !== null && "toDate" in value) {
    const fn = (value as { toDate?: () => Date }).toDate;
    return typeof fn === "function" ? fn() : null;
  }
  return null;
}

async function saveInquiryBackup(
  values: ContactFormValues,
  emailDelivered: boolean,
): Promise<boolean> {
  const payload = buildContactSubmissionPayload(values);
  const subject = buildContactEmailSubject(values);
  const inquiryId = generateInquiryId();
  const path = `inquiries/${inquiryId}`;

  let timeoutId: number | undefined;
  try {
    const writePromise = setDoc(doc(db, "inquiries", inquiryId), {
      name: payload.name,
      email: payload.email,
      topic: payload.topic,
      subject,
      message: payload.message,
      emailDelivered,
      status: "new",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
      .then(() => true)
      .catch((error) => {
        try {
          handleFirestoreError(error, OperationType.CREATE, path);
        } catch {
          // Swallowed intentionally so caller can inspect backupSaved=false cleanly
        }
        return false;
      });

    const timeoutPromise = new Promise<boolean>((resolve) => {
      timeoutId = window.setTimeout(() => resolve(false), 4500);
    });

    return await Promise.race([writePromise, timeoutPromise]);
  } finally {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
    }
  }
}

export async function sendContactInquiry(
  values: ContactFormValues,
): Promise<ContactDeliveryResult> {
  const payload = buildContactSubmissionPayload(values);
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 15000);

  let emailSent = false;
  let smtpConfigured = true;
  let serverError: string | undefined;

  try {
    const response = await fetch(CONTACT_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    let data: {
      ok?: boolean;
      emailSent?: boolean;
      configured?: boolean;
      error?: string;
    } = {};

    try {
      data = (await response.json()) as typeof data;
    } catch {
      // Non-JSON response
    }

    smtpConfigured = data.configured !== false;
    emailSent = response.ok && Boolean(data.emailSent);
    if (!emailSent && data.error) {
      serverError = data.error;
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      serverError = "Direct Gmail delivery timed out.";
    } else {
      serverError = "Could not reach the mail server right now.";
    }
  } finally {
    window.clearTimeout(timeoutId);
  }

  const backupSaved = await saveInquiryBackup(values, emailSent);

  if (emailSent || backupSaved) {
    return {
      ok: true,
      emailSent,
      backupSaved,
      smtpConfigured,
      error: emailSent ? undefined : serverError,
    };
  }

  return {
    ok: false,
    emailSent: false,
    backupSaved: false,
    smtpConfigured,
    error:
      serverError ||
      "We could not deliver your inquiry right now. Please try again or send directly in Gmail below.",
  };
}

function mapDocToInquiry(id: string, data: DocumentData): InquiryRecord {
  const rawTopic = String(data.topic || "Product Design");
  const topic: CanonicalInquiryTopic =
    rawTopic === "Photography" || rawTopic === "Product Design & Photography"
      ? rawTopic
      : "Product Design";
  const rawStatus = String(data.status || "new");
  const status: InquiryStatus =
    rawStatus === "read" || rawStatus === "archived" ? rawStatus : "new";

  return {
    id,
    name: String(data.name || ""),
    email: String(data.email || ""),
    topic,
    subject: String(data.subject || ""),
    message: String(data.message || ""),
    emailDelivered: Boolean(data.emailDelivered),
    status,
    createdAt: toDateOrNull(data.createdAt),
    updatedAt: toDateOrNull(data.updatedAt),
  };
}

export function subscribeInquiries(
  onData: (inquiries: InquiryRecord[]) => void,
  onError?: (message: string) => void,
): Unsubscribe {
  return onSnapshot(
    collection(db, "inquiries"),
    (snapshot) => {
      const items = snapshot.docs
        .map((docSnap) => mapDocToInquiry(docSnap.id, docSnap.data()))
        .sort(
          (a, b) =>
            (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
        );
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, "inquiries");
      } catch (err) {
        onError?.(err instanceof Error ? err.message : "Could not load inquiries.");
      }
    },
  );
}

export async function updateInquiryStatus(
  inquiryId: string,
  status: InquiryStatus,
): Promise<void> {
  const path = `inquiries/${inquiryId}`;
  try {
    await updateDoc(doc(db, "inquiries", inquiryId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteInquiry(inquiryId: string): Promise<void> {
  const path = `inquiries/${inquiryId}`;
  try {
    await deleteDoc(doc(db, "inquiries", inquiryId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
