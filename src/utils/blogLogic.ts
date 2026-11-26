export const OWNER_EMAIL = "sadmanrhd@gmail.com";

export const BLOG_TOPICS = [
  "All",
  "Product Design",
  "Photography",
  "Design Systems",
  "Process",
  "Field Notes",
  "Essay",
] as const;

export type BlogTopic = (typeof BLOG_TOPICS)[number];
export type SelectableBlogTopic = Exclude<BlogTopic, "All">;

export const BLOG_LIMITS = {
  slugMax: 140,
  titleMax: 180,
  subtitleMax: 320,
  excerptMax: 500,
  coverImageMax: 260000,
  coverAltMax: 200,
  topicMax: 60,
  maxTags: 6,
  tagMax: 36,
  maxBlocks: 80,
  authorNameMax: 100,
  authorRoleMax: 100,
  authorPhotoUrlMax: 500,
  writerEmailMax: 160,
  writerNameMax: 100,
  writerTitleMax: 100,
  writerBioMax: 360,
  maxPostPayloadBytes: 850000,
  maxAttachmentDataBytes: 220000,
} as const;

export type BlogBlockType =
  | "paragraph"
  | "heading"
  | "subheading"
  | "quote"
  | "image"
  | "link"
  | "attachment"
  | "divider"
  | "code";

export type QuoteStyle = "editorial" | "pullquote";
export type ImageLayout = "standard" | "wide";

export interface BlogBlock {
  id: string;
  type: BlogBlockType;
  html?: string;
  quoteStyle?: QuoteStyle;
  attribution?: string;
  imageUrl?: string;
  imageAlt?: string;
  caption?: string;
  layout?: ImageLayout;
  linkUrl?: string;
  linkTitle?: string;
  linkDescription?: string;
  attachmentName?: string;
  attachmentUrl?: string;
  attachmentSize?: string;
  attachmentMime?: string;
  codeText?: string;
  codeLanguage?: string;
}

export type BlogPostStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  coverImage: string;
  coverAlt: string;
  topic: string;
  tags: string[];
  blocks: BlogBlock[];
  status: BlogPostStatus;
  authorUid: string;
  authorName: string;
  authorRole: string;
  authorPhotoUrl: string;
  readTimeMinutes: number;
  publishedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface WriterRecord {
  id: string;
  email: string;
  displayName: string;
  role: "admin" | "writer";
  title: string;
  bio: string;
  status: "active" | "paused";
  addedByUid: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export type AuthAccessRole = "guest" | "admin" | "writer" | "unauthorized";

export function emailToDocId(email: string): string {
  return email.trim().toLowerCase().replace(/[^a-z0-9]/g, "_");
}

export function isOwnerEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === OWNER_EMAIL;
}

export function slugifyTitle(title: string): string {
  const cleaned = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, BLOG_LIMITS.slugMax)
    .replace(/-$/g, "");
  return cleaned || "untitled-story";
}

export function generatePostId(title: string): string {
  const slugPart = slugifyTitle(title).slice(0, 48);
  const rand = Math.random().toString(36).slice(2, 8);
  const ts = Date.now().toString(36);
  return `${slugPart}-${ts}${rand}`.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 128);
}

export function createBlockId(): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `blk_${Date.now().toString(36)}_${rand}`;
}

export function createEmptyBlock(
  type: BlogBlockType = "paragraph",
  extra: Partial<BlogBlock> = {},
): BlogBlock {
  const base: BlogBlock = {
    id: createBlockId(),
    type,
  };
  if (type === "paragraph" || type === "heading" || type === "subheading") {
    base.html = "";
  } else if (type === "quote") {
    base.html = "";
    base.quoteStyle = "editorial";
    base.attribution = "";
  } else if (type === "image") {
    base.imageUrl = "";
    base.imageAlt = "";
    base.caption = "";
    base.layout = "standard";
  } else if (type === "link") {
    base.linkUrl = "";
    base.linkTitle = "";
    base.linkDescription = "";
  } else if (type === "attachment") {
    base.attachmentName = "";
    base.attachmentUrl = "";
    base.attachmentSize = "";
    base.attachmentMime = "";
  } else if (type === "code") {
    base.codeText = "";
    base.codeLanguage = "note";
  }
  return { ...base, ...extra };
}

export function sanitizeUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^(javascript|vbscript|data):/i.test(trimmed)) {
    return null;
  }
  const candidate =
    /^(https?:|mailto:)/i.test(trimmed) || trimmed.startsWith("/")
      ? trimmed
      : `https://${trimmed}`;
  try {
    if (candidate.startsWith("/")) return candidate;
    const parsed = new URL(candidate);
    if (
      parsed.protocol === "https:" ||
      parsed.protocol === "http:" ||
      parsed.protocol === "mailto:"
    ) {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

export function sanitizeMediaUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^data:image\/(jpeg|jpg|png|webp|gif);base64,[a-zA-Z0-9+/=]+$/i.test(trimmed)) {
    return trimmed;
  }
  return sanitizeUrl(trimmed);
}

export function sanitizeAttachmentUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (
    /^data:(application\/pdf|text\/plain|text\/csv|application\/json|application\/zip|image\/(jpeg|jpg|png|webp));base64,[a-zA-Z0-9+/=]+$/i.test(
      trimmed,
    )
  ) {
    return trimmed;
  }
  return sanitizeUrl(trimmed);
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Strictly sanitizes inline editorial HTML so only safe text formatting tags
 * (<strong>, <b>, <em>, <i>, <mark>, <code>, <br>, and safe <a href>) survive.
 */
export function sanitizeInlineHtml(raw: string): string {
  if (!raw) return "";
  // Drop script/style/iframe contents completely
  let cleaned = raw
    .replace(/<\s*(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  // Normalize spans with font-weight / font-style if produced by browser execCommand
  cleaned = cleaned.replace(
    /<\/?([a-zA-Z0-9]+)([^>]*)>/g,
    (match, tagName: string, attrs: string) => {
      const lower = tagName.toLowerCase();
      const isClosing = match.startsWith("</");

      if (lower === "br") {
        return isClosing ? "" : "<br />";
      }

      if (["strong", "b", "em", "i", "mark", "code", "u"].includes(lower)) {
        const normalized =
          lower === "b" ? "strong" : lower === "i" ? "em" : lower;
        return isClosing ? `</${normalized}>` : `<${normalized}>`;
      }

      if (lower === "a") {
        if (isClosing) return "</a>";
        const hrefMatch = attrs.match(/href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
        const rawHref = hrefMatch ? hrefMatch[1] || hrefMatch[2] || hrefMatch[3] || "" : "";
        const safeHref = sanitizeUrl(rawHref);
        if (!safeHref) return "";
        return `<a href="${escapeHtmlAttr(safeHref)}" target="_blank" rel="noopener noreferrer">`;
      }

      // Strip all other tags while preserving inner text
      return "";
    },
  );

  return cleaned.trim();
}

export function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function countBlogWords(
  blocks: BlogBlock[],
  title = "",
  subtitle = "",
): number {
  const parts: string[] = [title, subtitle];
  for (const block of blocks) {
    if (block.html) parts.push(stripHtml(block.html));
    if (block.attribution) parts.push(block.attribution);
    if (block.caption) parts.push(block.caption);
    if (block.linkTitle) parts.push(block.linkTitle);
    if (block.linkDescription) parts.push(block.linkDescription);
    if (block.codeText) parts.push(block.codeText);
  }
  const joined = parts.join(" ").trim();
  if (!joined) return 0;
  return joined.split(/\s+/).filter(Boolean).length;
}

export function estimateReadTimeMinutes(
  blocks: BlogBlock[],
  title = "",
  subtitle = "",
): number {
  const words = countBlogWords(blocks, title, subtitle);
  return Math.max(1, Math.min(120, Math.ceil(words / 220)));
}

export function deriveExcerpt(blocks: BlogBlock[], subtitle = ""): string {
  const trimmedSubtitle = subtitle.trim();
  if (trimmedSubtitle.length >= 24) {
    return trimmedSubtitle.slice(0, BLOG_LIMITS.excerptMax);
  }
  for (const block of blocks) {
    if (block.type === "paragraph" || block.type === "quote") {
      const plain = stripHtml(block.html ?? "");
      if (plain.length > 0) {
        return plain.length > 220 ? `${plain.slice(0, 217).trim()}...` : plain;
      }
    }
  }
  return trimmedSubtitle.slice(0, BLOG_LIMITS.excerptMax);
}

export interface DraftValidationResult {
  valid: boolean;
  errors: string[];
  sanitizedBlocks: BlogBlock[];
  sanitizedTags: string[];
  slug: string;
  excerpt: string;
  readTimeMinutes: number;
}

export function validateBlogPostPayload(input: {
  title: string;
  subtitle: string;
  coverImage: string;
  coverAlt: string;
  topic: string;
  tags: string[];
  blocks: BlogBlock[];
  status: BlogPostStatus;
}): DraftValidationResult {
  const errors: string[] = [];
  const title = input.title.trim();
  const subtitle = input.subtitle.trim();
  const topic = input.topic.trim() || "Essay";

  if (!title) {
    errors.push("Add a headline before saving your story.");
  } else if (title.length > BLOG_LIMITS.titleMax) {
    errors.push(`Headline must be ${BLOG_LIMITS.titleMax} characters or fewer.`);
  }

  if (subtitle.length > BLOG_LIMITS.subtitleMax) {
    errors.push(`Subtitle must be ${BLOG_LIMITS.subtitleMax} characters or fewer.`);
  }

  let coverImage = input.coverImage.trim();
  if (coverImage) {
    const safeCover = sanitizeMediaUrl(coverImage);
    if (!safeCover) {
      errors.push("Cover image must be a valid image upload or https:// URL.");
    } else if (safeCover.length > BLOG_LIMITS.coverImageMax) {
      errors.push("Cover image is too large. Please choose a smaller image.");
    } else {
      coverImage = safeCover;
    }
  }

  const sanitizedTags = Array.from(
    new Set(
      input.tags
        .map((t) => t.trim().slice(0, BLOG_LIMITS.tagMax))
        .filter(Boolean),
    ),
  ).slice(0, BLOG_LIMITS.maxTags);

  const sanitizedBlocks: BlogBlock[] = input.blocks
    .slice(0, BLOG_LIMITS.maxBlocks)
    .map((block) => {
      const cleanId =
        block.id && /^[a-zA-Z0-9_-]{1,64}$/.test(block.id)
          ? block.id
          : createBlockId();
      if (
        block.type === "paragraph" ||
        block.type === "heading" ||
        block.type === "subheading"
      ) {
        return {
          id: cleanId,
          type: block.type,
          html: sanitizeInlineHtml(block.html ?? ""),
        };
      }
      if (block.type === "quote") {
        return {
          id: cleanId,
          type: "quote",
          html: sanitizeInlineHtml(block.html ?? ""),
          quoteStyle: block.quoteStyle === "pullquote" ? "pullquote" : "editorial",
          attribution: (block.attribution ?? "").trim().slice(0, 140),
        };
      }
      if (block.type === "image") {
        const safeImg = sanitizeMediaUrl(block.imageUrl ?? "") ?? "";
        return {
          id: cleanId,
          type: "image",
          imageUrl: safeImg,
          imageAlt: (block.imageAlt ?? "").trim().slice(0, 200),
          caption: (block.caption ?? "").trim().slice(0, 240),
          layout: block.layout === "wide" ? "wide" : "standard",
        };
      }
      if (block.type === "link") {
        return {
          id: cleanId,
          type: "link",
          linkUrl: sanitizeUrl(block.linkUrl ?? "") ?? "",
          linkTitle: (block.linkTitle ?? "").trim().slice(0, 160),
          linkDescription: (block.linkDescription ?? "").trim().slice(0, 280),
        };
      }
      if (block.type === "attachment") {
        return {
          id: cleanId,
          type: "attachment",
          attachmentName: (block.attachmentName ?? "").trim().slice(0, 140),
          attachmentUrl: sanitizeAttachmentUrl(block.attachmentUrl ?? "") ?? "",
          attachmentSize: (block.attachmentSize ?? "").trim().slice(0, 40),
          attachmentMime: (block.attachmentMime ?? "").trim().slice(0, 80),
        };
      }
      if (block.type === "code") {
        return {
          id: cleanId,
          type: "code",
          codeText: (block.codeText ?? "").slice(0, 6000),
          codeLanguage: (block.codeLanguage ?? "note").trim().slice(0, 32),
        };
      }
      return { id: cleanId, type: "divider" };
    });

  const nonEmptyBlocks = sanitizedBlocks.filter((block) => {
    if (block.type === "divider") return true;
    if (block.type === "image") return Boolean(block.imageUrl);
    if (block.type === "link") return Boolean(block.linkUrl);
    if (block.type === "attachment") return Boolean(block.attachmentUrl);
    if (block.type === "code") return Boolean(block.codeText?.trim());
    return stripHtml(block.html ?? "").length > 0;
  });

  if (input.status === "published" && nonEmptyBlocks.length === 0) {
    errors.push("Write at least one paragraph, image, or quote before publishing.");
  }

  const finalBlocks =
    nonEmptyBlocks.length > 0
      ? nonEmptyBlocks
      : [createEmptyBlock("paragraph", { html: "" })];

  const approxBytes = new TextEncoder().encode(
    JSON.stringify({
      title,
      subtitle,
      coverImage,
      blocks: finalBlocks,
      tags: sanitizedTags,
    }),
  ).length;

  if (approxBytes > BLOG_LIMITS.maxPostPayloadBytes) {
    errors.push(
      "This article exceeds the free database document size limit (~850 KB). Try using fewer or smaller embedded images/attachments, or paste image/file links.",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitizedBlocks: finalBlocks,
    sanitizedTags,
    slug: slugifyTitle(title),
    excerpt: deriveExcerpt(finalBlocks, subtitle),
    readTimeMinutes: estimateReadTimeMinutes(finalBlocks, title, subtitle),
  };
}

export function validateWriterInput(input: {
  email: string;
  displayName: string;
  title: string;
  bio: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const email = input.email.trim().toLowerCase();
  const displayName = input.displayName.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid Google account email address.";
  } else if (email.length > BLOG_LIMITS.writerEmailMax) {
    errors.email = `Email must be ${BLOG_LIMITS.writerEmailMax} characters or fewer.`;
  } else if (email === OWNER_EMAIL) {
    errors.email = "You already have full owner access with this email.";
  }

  if (!displayName) {
    errors.displayName = "Enter the writer's display name.";
  } else if (displayName.length > BLOG_LIMITS.writerNameMax) {
    errors.displayName = `Name must be ${BLOG_LIMITS.writerNameMax} characters or fewer.`;
  }

  if (input.title.trim().length > BLOG_LIMITS.writerTitleMax) {
    errors.title = `Role must be ${BLOG_LIMITS.writerTitleMax} characters or fewer.`;
  }

  if (input.bio.trim().length > BLOG_LIMITS.writerBioMax) {
    errors.bio = `Bio must be ${BLOG_LIMITS.writerBioMax} characters or fewer.`;
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function filterBlogPosts(
  posts: BlogPost[],
  topic: BlogTopic,
  query: string,
): BlogPost[] {
  const normalizedQuery = query.trim().toLowerCase();
  return posts.filter((post) => {
    const topicMatch = topic === "All" || post.topic === topic;
    if (!topicMatch) return false;
    if (!normalizedQuery) return true;
    const haystack = [
      post.title,
      post.subtitle,
      post.excerpt,
      post.topic,
      post.authorName,
      ...post.tags,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

export function formatEditorialDate(date: Date | null): string {
  if (!date) return "Draft";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
