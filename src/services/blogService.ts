import type { User } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import {
  BLOG_LIMITS,
  emailToDocId,
  generatePostId,
  isOwnerEmail,
  validateBlogPostPayload,
  validateWriterInput,
  type AuthAccessRole,
  type BlogBlock,
  type BlogPost,
  type BlogPostStatus,
  type WriterRecord,
} from "../utils/blogLogic";

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

function mapDocToPost(id: string, data: DocumentData): BlogPost {
  return {
    id,
    slug: typeof data.slug === "string" ? data.slug : id,
    title: typeof data.title === "string" ? data.title : "Untitled",
    subtitle: typeof data.subtitle === "string" ? data.subtitle : "",
    excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
    coverImage: typeof data.coverImage === "string" ? data.coverImage : "",
    coverAlt: typeof data.coverAlt === "string" ? data.coverAlt : "",
    topic: typeof data.topic === "string" ? data.topic : "Essay",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    blocks: Array.isArray(data.blocks) ? (data.blocks as BlogBlock[]) : [],
    status: data.status === "published" ? "published" : "draft",
    authorUid: typeof data.authorUid === "string" ? data.authorUid : "",
    authorName: typeof data.authorName === "string" ? data.authorName : "Author",
    authorRole: typeof data.authorRole === "string" ? data.authorRole : "",
    authorPhotoUrl:
      typeof data.authorPhotoUrl === "string" ? data.authorPhotoUrl : "",
    readTimeMinutes:
      typeof data.readTimeMinutes === "number" ? data.readTimeMinutes : 1,
    publishedAt: toDateOrNull(data.publishedAt),
    createdAt: toDateOrNull(data.createdAt),
    updatedAt: toDateOrNull(data.updatedAt),
  };
}

function mapDocToWriter(id: string, data: DocumentData): WriterRecord {
  return {
    id,
    email: typeof data.email === "string" ? data.email : "",
    displayName: typeof data.displayName === "string" ? data.displayName : "",
    role: data.role === "admin" ? "admin" : "writer",
    title: typeof data.title === "string" ? data.title : "Guest Writer",
    bio: typeof data.bio === "string" ? data.bio : "",
    status: data.status === "paused" ? "paused" : "active",
    addedByUid: typeof data.addedByUid === "string" ? data.addedByUid : "",
    createdAt: toDateOrNull(data.createdAt),
    updatedAt: toDateOrNull(data.updatedAt),
  };
}

function sortPostsByRecency(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => {
    const aTime = (a.publishedAt ?? a.updatedAt ?? a.createdAt)?.getTime() ?? 0;
    const bTime = (b.publishedAt ?? b.updatedAt ?? b.createdAt)?.getTime() ?? 0;
    return bTime - aTime;
  });
}

export async function checkWriterAuthorization(user: User): Promise<{
  role: AuthAccessRole;
  writerRecord: WriterRecord | null;
}> {
  if (!user.email || !user.emailVerified) {
    return { role: "unauthorized", writerRecord: null };
  }

  if (isOwnerEmail(user.email)) {
    return {
      role: "admin",
      writerRecord: {
        id: emailToDocId(user.email),
        email: user.email.toLowerCase(),
        displayName: user.displayName || "Sadman Rahman",
        role: "admin",
        title: "Product Designer & Photographer",
        bio: "Dhaka-based product designer and photographer writing about public systems, interfaces, and light.",
        status: "active",
        addedByUid: user.uid,
        createdAt: null,
        updatedAt: null,
      },
    };
  }

  const writerKey = emailToDocId(user.email);
  const path = `writers/${writerKey}`;
  try {
    const snap = await getDoc(doc(db, "writers", writerKey));
    if (!snap.exists()) {
      return { role: "unauthorized", writerRecord: null };
    }
    const record = mapDocToWriter(snap.id, snap.data());
    if (
      record.status === "active" &&
      record.email === user.email.trim().toLowerCase()
    ) {
      return { role: "writer", writerRecord: record };
    }
    return { role: "unauthorized", writerRecord: record };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export function subscribePublishedPosts(
  onPosts: (posts: BlogPost[]) => void,
  onError: (message: string) => void,
): Unsubscribe {
  const path = "posts";
  const publishedQuery = query(
    collection(db, path),
    where("status", "==", "published"),
  );

  return onSnapshot(
    publishedQuery,
    (snapshot) => {
      const mapped = snapshot.docs.map((docSnap) =>
        mapDocToPost(docSnap.id, docSnap.data()),
      );
      onPosts(sortPostsByRecency(mapped));
    },
    (error) => {
      onError(error.message);
      handleFirestoreError(error, OperationType.LIST, path);
    },
  );
}

export function subscribeAuthorPosts(
  uid: string,
  isAdmin: boolean,
  onPosts: (posts: BlogPost[]) => void,
  onError: (message: string) => void,
): Unsubscribe {
  const path = "posts";
  const authorQuery = isAdmin
    ? collection(db, path)
    : query(collection(db, path), where("authorUid", "==", uid));

  return onSnapshot(
    authorQuery,
    (snapshot) => {
      const mapped = snapshot.docs.map((docSnap) =>
        mapDocToPost(docSnap.id, docSnap.data()),
      );
      const sorted = [...mapped].sort((a, b) => {
        const aTime = (a.updatedAt ?? a.createdAt)?.getTime() ?? 0;
        const bTime = (b.updatedAt ?? b.createdAt)?.getTime() ?? 0;
        return bTime - aTime;
      });
      onPosts(sorted);
    },
    (error) => {
      onError(error.message);
      handleFirestoreError(error, OperationType.LIST, path);
    },
  );
}

export function subscribeWriters(
  onWriters: (writers: WriterRecord[]) => void,
  onError: (message: string) => void,
): Unsubscribe {
  const path = "writers";
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const mapped = snapshot.docs
        .map((docSnap) => mapDocToWriter(docSnap.id, docSnap.data()))
        .sort((a, b) => a.displayName.localeCompare(b.displayName));
      onWriters(mapped);
    },
    (error) => {
      onError(error.message);
      handleFirestoreError(error, OperationType.LIST, path);
    },
  );
}

export async function addOrUpdateWriter(
  input: {
    email: string;
    displayName: string;
    title: string;
    bio: string;
  },
  adminUid: string,
): Promise<void> {
  const validation = validateWriterInput(input);
  if (!validation.valid) {
    const firstError = Object.values(validation.errors)[0];
    throw new Error(firstError || "Invalid writer details.");
  }

  const normalizedEmail = input.email.trim().toLowerCase();
  const writerId = emailToDocId(normalizedEmail);
  const path = `writers/${writerId}`;
  const ref = doc(db, "writers", writerId);

  try {
    const existing = await getDoc(ref);
    if (existing.exists()) {
      await updateDoc(ref, {
        displayName: input.displayName.trim().slice(0, BLOG_LIMITS.writerNameMax),
        role: "writer",
        title:
          input.title.trim().slice(0, BLOG_LIMITS.writerTitleMax) ||
          "Guest Writer",
        bio: input.bio.trim().slice(0, BLOG_LIMITS.writerBioMax),
        status: "active",
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(ref, {
        email: normalizedEmail,
        displayName: input.displayName.trim().slice(0, BLOG_LIMITS.writerNameMax),
        role: "writer",
        title:
          input.title.trim().slice(0, BLOG_LIMITS.writerTitleMax) ||
          "Guest Writer",
        bio: input.bio.trim().slice(0, BLOG_LIMITS.writerBioMax),
        status: "active",
        addedByUid: adminUid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function toggleWriterStatus(writer: WriterRecord): Promise<void> {
  const path = `writers/${writer.id}`;
  try {
    await updateDoc(doc(db, "writers", writer.id), {
      status: writer.status === "active" ? "paused" : "active",
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteWriter(writerId: string): Promise<void> {
  const path = `writers/${writerId}`;
  try {
    await deleteDoc(doc(db, "writers", writerId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export interface SaveBlogPostInput {
  title: string;
  subtitle: string;
  coverImage: string;
  coverAlt: string;
  topic: string;
  tags: string[];
  blocks: BlogBlock[];
  status: BlogPostStatus;
}

export async function saveBlogPost(
  input: SaveBlogPostInput,
  author: {
    uid: string;
    name: string;
    role: string;
    photoUrl: string;
  },
  existingPost?: BlogPost | null,
): Promise<string> {
  const check = validateBlogPostPayload(input);
  if (!check.valid) {
    throw new Error(check.errors[0]);
  }

  const postId = existingPost?.id || generatePostId(input.title);
  const path = `posts/${postId}`;
  const ref = doc(db, "posts", postId);

  const safeAuthorName =
    (existingPost?.authorName || author.name || "Author")
      .trim()
      .slice(0, BLOG_LIMITS.authorNameMax) || "Author";
  const safeAuthorRole = (existingPost?.authorRole || author.role || "")
    .trim()
    .slice(0, BLOG_LIMITS.authorRoleMax);
  const safeAuthorPhotoUrl = (existingPost?.authorPhotoUrl || author.photoUrl || "")
    .trim()
    .slice(0, BLOG_LIMITS.authorPhotoUrlMax);

  try {
    if (existingPost) {
      const nextPublishedAt =
        input.status === "published"
          ? existingPost.publishedAt
            ? Timestamp.fromDate(existingPost.publishedAt)
            : serverTimestamp()
          : existingPost.publishedAt
            ? Timestamp.fromDate(existingPost.publishedAt)
            : null;

      await updateDoc(ref, {
        slug: check.slug,
        title: input.title.trim().slice(0, BLOG_LIMITS.titleMax),
        subtitle: input.subtitle.trim().slice(0, BLOG_LIMITS.subtitleMax),
        excerpt: check.excerpt,
        coverImage: input.coverImage.trim().slice(0, BLOG_LIMITS.coverImageMax),
        coverAlt: input.coverAlt.trim().slice(0, BLOG_LIMITS.coverAltMax),
        topic: input.topic.trim().slice(0, BLOG_LIMITS.topicMax) || "Essay",
        tags: check.sanitizedTags,
        blocks: check.sanitizedBlocks,
        status: input.status,
        authorName: safeAuthorName,
        authorRole: safeAuthorRole,
        authorPhotoUrl: safeAuthorPhotoUrl,
        readTimeMinutes: check.readTimeMinutes,
        publishedAt: nextPublishedAt,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(ref, {
        slug: check.slug,
        title: input.title.trim().slice(0, BLOG_LIMITS.titleMax),
        subtitle: input.subtitle.trim().slice(0, BLOG_LIMITS.subtitleMax),
        excerpt: check.excerpt,
        coverImage: input.coverImage.trim().slice(0, BLOG_LIMITS.coverImageMax),
        coverAlt: input.coverAlt.trim().slice(0, BLOG_LIMITS.coverAltMax),
        topic: input.topic.trim().slice(0, BLOG_LIMITS.topicMax) || "Essay",
        tags: check.sanitizedTags,
        blocks: check.sanitizedBlocks,
        status: input.status,
        authorUid: author.uid,
        authorName: safeAuthorName,
        authorRole: safeAuthorRole,
        authorPhotoUrl: safeAuthorPhotoUrl,
        readTimeMinutes: check.readTimeMinutes,
        publishedAt: input.status === "published" ? serverTimestamp() : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    return postId;
  } catch (error) {
    handleFirestoreError(
      error,
      existingPost ? OperationType.UPDATE : OperationType.CREATE,
      path,
    );
  }
}

export async function deleteBlogPost(postId: string): Promise<void> {
  const path = `posts/${postId}`;
  try {
    await deleteDoc(doc(db, "posts", postId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Compresses a picked image file on an offscreen canvas so it stays sharp
 * while fitting comfortably inside Firestore's free document size budget.
 */
export async function compressImageToDataUrl(
  file: File,
  maxWidth = 1280,
  maxBytes = 180000,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select a valid image file (JPG, PNG, or WebP).");
  }

  const bitmapUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not decode the selected image."));
      el.src = bitmapUrl;
    });

    const scale = Math.min(1, maxWidth / Math.max(1, img.naturalWidth));
    const width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = Math.max(1, Math.round(img.naturalHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas image compression is unavailable in this browser.");
    }
    ctx.drawImage(img, 0, 0, width, height);

    let quality = 0.82;
    let dataUrl = canvas.toDataURL("image/jpeg", quality);
    while (dataUrl.length > maxBytes && quality > 0.35) {
      quality -= 0.1;
      dataUrl = canvas.toDataURL("image/jpeg", quality);
    }

    if (dataUrl.length > maxBytes) {
      // Scale down one more step if still large
      canvas.width = Math.round(width * 0.72);
      canvas.height = Math.round(height * 0.72);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      dataUrl = canvas.toDataURL("image/jpeg", 0.68);
    }

    if (dataUrl.length > BLOG_LIMITS.coverImageMax) {
      throw new Error(
        "Image is still too large after compression. Try a smaller photo or paste an image URL.",
      );
    }

    return dataUrl;
  } finally {
    URL.revokeObjectURL(bitmapUrl);
  }
}

export async function readSmallAttachmentToDataUrl(file: File): Promise<string> {
  const allowedMimes = [
    "application/pdf",
    "text/plain",
    "text/csv",
    "application/json",
    "application/zip",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];
  if (!allowedMimes.includes(file.type)) {
    throw new Error(
      "Direct upload supports PDF, TXT, CSV, JSON, ZIP, or images up to 150 KB. For larger files, paste a Google Drive, Dropbox, or web link.",
    );
  }
  if (file.size > 155000) {
    throw new Error(
      "Direct attachments must be 150 KB or smaller. For larger files, paste a share link (Google Drive, Dropbox, GitHub, etc.).",
    );
  }

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read attachment."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}
