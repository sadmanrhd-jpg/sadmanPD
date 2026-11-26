import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Download,
  Edit3,
  FileText,
  Link2,
  Paperclip,
  Trash2,
} from "lucide-react";
import {
  formatEditorialDate,
  sanitizeAttachmentUrl,
  sanitizeInlineHtml,
  sanitizeMediaUrl,
  sanitizeUrl,
  type BlogPost,
} from "../utils/blogLogic";

interface BlogArticleViewProps {
  post: BlogPost;
  canManage: boolean;
  isPreview?: boolean;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => Promise<void>;
}

export function BlogArticleView({
  post,
  canManage,
  isPreview = false,
  onBack,
  onEdit,
  onDelete,
}: BlogArticleViewProps) {
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const safeCover = sanitizeMediaUrl(post.coverImage);
  const safeAuthorPhoto = sanitizeMediaUrl(post.authorPhotoUrl);
  const authorInitials = post.authorName
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleCopyLink = async () => {
    try {
      const shareUrl = `${window.location.origin}${window.location.pathname}#blog/${post.id}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete();
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <article className="gallery bg-[#fffdf6] text-[#171716] min-h-[calc(100vh-5rem)] pb-24">
      <div className="max-w-[960px] mx-auto px-5 md:px-10 pt-8 md:pt-12">
        {/* Top utility bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-[#171716]/10">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#171716]/75 hover:text-[#171716] transition-colors whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isPreview ? "Back to Editor" : "All Stories"}</span>
          </button>

          <div className="flex flex-wrap items-center gap-3">
            {!isPreview && (
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#171716]/15 text-xs font-medium text-[#171716]/80 hover:border-[#171716]/40 hover:text-[#171716] transition-colors whitespace-nowrap shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#171716]" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            )}

            {canManage && !isPreview && onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#171716] bg-[#171716] text-[#fffdf6] text-xs font-medium hover:bg-[#ff5b44] hover:text-[#171716] transition-colors whitespace-nowrap shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Story</span>
              </button>
            )}

            {canManage && !isPreview && onDelete && !confirmDelete && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#171716]/15 text-xs font-medium text-[#d9442e] hover:border-[#d9442e] transition-colors whitespace-nowrap shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}

            {confirmDelete && (
              <div className="inline-flex items-center gap-2 text-xs">
                <span className="text-[#171716]/75">Delete permanently?</span>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleConfirmDelete}
                  className="px-3 py-1.5 rounded-lg bg-[#d9442e] text-white font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Confirm"}
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setConfirmDelete(false)}
                  className="px-2.5 py-1.5 rounded-lg border border-[#171716]/20 text-[#171716]/80 hover:text-[#171716]"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Editorial Header */}
        <header className="max-w-[700px] mx-auto pt-10 md:pt-14 pb-8">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-[#171716]/60 mb-5">
            <span className="font-medium text-[#d9442e]">{post.topic}</span>
            <span aria-hidden="true">·</span>
            <span>
              {post.status === "draft"
                ? "Unpublished Draft"
                : formatEditorialDate(post.publishedAt ?? post.updatedAt)}
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{post.readTimeMinutes} min read</span>
          </div>

          <h1 className="font-display text-[clamp(32px,4.8vw,50px)] leading-[1.12] tracking-[-0.025em] font-semibold text-[#171716] mb-4 text-balance">
            {post.title || "Untitled Story"}
          </h1>

          {post.subtitle && (
            <p className="font-editorial text-[20px] sm:text-[23px] leading-[1.48] text-[#171716]/68 mb-8">
              {post.subtitle}
            </p>
          )}

          {/* Author Byline */}
          <div className="flex items-center gap-3.5 pt-2">
            {safeAuthorPhoto ? (
              <img
                src={safeAuthorPhoto}
                alt={post.authorName}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full object-cover border border-[#171716]/15 shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#171716] text-[#f2efe6] text-xs font-semibold flex items-center justify-center shrink-0">
                {authorInitials || "SR"}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[15px] font-medium text-[#171716] leading-tight">
                {post.authorName}
              </p>
              {post.authorRole && (
                <p className="text-[13px] text-[#171716]/58 mt-0.5 truncate">
                  {post.authorRole}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Optional Cover Image */}
        {safeCover && (
          <figure className="max-w-[900px] mx-auto mb-12">
            <img
              src={safeCover}
              alt={post.coverAlt || post.title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[560px] object-cover rounded-xl bg-[#f2efe6]"
            />
            {post.coverAlt && (
              <figcaption className="text-center text-[13px] text-[#171716]/55 mt-3">
                {post.coverAlt}
              </figcaption>
            )}
          </figure>
        )}

        {/* Editorial Body Blocks */}
        <div className="max-w-[700px] mx-auto space-y-7">
          {post.blocks.map((block) => {
            if (block.type === "paragraph") {
              const html = sanitizeInlineHtml(block.html ?? "");
              if (!html) return null;
              return (
                <p
                  key={block.id}
                  className="blog-prose font-editorial text-[18.5px] sm:text-[20px] leading-[1.82] text-[#171716]/92"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              );
            }

            if (block.type === "heading") {
              const html = sanitizeInlineHtml(block.html ?? "");
              if (!html) return null;
              return (
                <h2
                  key={block.id}
                  className="blog-prose font-display text-[26px] sm:text-[31px] leading-[1.24] tracking-[-0.02em] font-semibold text-[#171716] pt-5"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              );
            }

            if (block.type === "subheading") {
              const html = sanitizeInlineHtml(block.html ?? "");
              if (!html) return null;
              return (
                <h3
                  key={block.id}
                  className="blog-prose font-display text-[20px] sm:text-[23px] leading-[1.3] tracking-[-0.015em] font-semibold text-[#171716] pt-3"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              );
            }

            if (block.type === "quote") {
              const html = sanitizeInlineHtml(block.html ?? "");
              if (!html) return null;

              if (block.quoteStyle === "pullquote") {
                return (
                  <blockquote
                    key={block.id}
                    className="my-10 py-8 px-4 sm:px-8 border-y border-[#171716]/15 text-center"
                  >
                    <p
                      className="blog-prose font-editorial italic text-[24px] sm:text-[28px] leading-[1.45] text-[#171716]"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                    {block.attribution && (
                      <footer className="mt-4 text-[13px] tracking-wide text-[#171716]/58 font-sans">
                        {block.attribution}
                      </footer>
                    )}
                  </blockquote>
                );
              }

              return (
                <blockquote
                  key={block.id}
                  className="my-8 py-6 px-6 sm:px-8 rounded-xl bg-[#f2efe6]/75"
                >
                  <span
                    aria-hidden="true"
                    className="block font-editorial text-4xl leading-none text-[#d9442e]/65 mb-2 select-none"
                  >
                    “
                  </span>
                  <p
                    className="blog-prose font-editorial italic text-[19px] sm:text-[21px] leading-[1.68] text-[#171716]/88"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                  {block.attribution && (
                    <footer className="mt-3 text-[13px] text-[#171716]/58 font-sans">
                      {block.attribution}
                    </footer>
                  )}
                </blockquote>
              );
            }

            if (block.type === "image") {
              const safeImg = sanitizeMediaUrl(block.imageUrl ?? "");
              if (!safeImg) return null;
              return (
                <figure
                  key={block.id}
                  className={`my-9 ${
                    block.layout === "wide" ? "md:-mx-20" : ""
                  }`}
                >
                  <img
                    src={safeImg}
                    alt={block.imageAlt || block.caption || "Article illustration"}
                    referrerPolicy="no-referrer"
                    className="w-full rounded-xl object-contain bg-[#f2efe6]"
                  />
                  {block.caption && (
                    <figcaption className="text-center text-[13px] text-[#171716]/55 mt-3">
                      {block.caption}
                    </figcaption>
                  )}
                </figure>
              );
            }

            if (block.type === "link") {
              const safeHref = sanitizeUrl(block.linkUrl ?? "");
              if (!safeHref) return null;
              let hostname = safeHref;
              try {
                hostname = new URL(safeHref).hostname.replace(/^www\./, "");
              } catch {
                // Keep raw
              }
              return (
                <a
                  key={block.id}
                  href={safeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block my-7 p-5 rounded-xl border border-[#171716]/15 bg-[#f2efe6]/45 hover:border-[#171716]/40 hover:bg-[#f2efe6]/80 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[12px] text-[#171716]/55 mb-1 truncate">
                        {hostname}
                      </p>
                      <p className="font-display text-[17px] font-semibold text-[#171716] group-hover:text-[#d9442e] transition-colors">
                        {block.linkTitle || safeHref}
                      </p>
                      {block.linkDescription && (
                        <p className="text-[14px] text-[#171716]/68 mt-1.5 leading-relaxed">
                          {block.linkDescription}
                        </p>
                      )}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#171716]/50 group-hover:text-[#d9442e] shrink-0 mt-1" />
                  </div>
                </a>
              );
            }

            if (block.type === "attachment") {
              const safeAttachment = sanitizeAttachmentUrl(
                block.attachmentUrl ?? "",
              );
              if (!safeAttachment) return null;
              const isDataUrl = safeAttachment.startsWith("data:");
              return (
                <div
                  key={block.id}
                  className="my-7 p-4 sm:p-5 rounded-xl border border-[#171716]/15 bg-[#f2efe6]/55 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[#171716] text-[#fffdf6] flex items-center justify-center shrink-0">
                      {block.attachmentMime?.includes("pdf") ? (
                        <FileText className="w-5 h-5" />
                      ) : (
                        <Paperclip className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium text-[#171716] truncate">
                        {block.attachmentName || "Attached File"}
                      </p>
                      <p className="text-[12px] text-[#171716]/58 mt-0.5">
                        {[block.attachmentSize, isDataUrl ? "Embedded file" : "External attachment"]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                  </div>
                  <a
                    href={safeAttachment}
                    download={isDataUrl ? block.attachmentName || "attachment" : undefined}
                    target={isDataUrl ? undefined : "_blank"}
                    rel={isDataUrl ? undefined : "noopener noreferrer"}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#171716] bg-[#fffdf6] text-xs font-medium text-[#171716] hover:bg-[#171716] hover:text-[#fffdf6] transition-colors whitespace-nowrap shrink-0"
                  >
                    {isDataUrl ? (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>Open Attachment</span>
                      </>
                    )}
                  </a>
                </div>
              );
            }

            if (block.type === "code") {
              if (!block.codeText?.trim()) return null;
              return (
                <div
                  key={block.id}
                  className="my-7 rounded-xl bg-[#171716] text-[#f2efe6] p-5 overflow-x-auto"
                >
                  {block.codeLanguage && (
                    <p className="text-[11px] text-[#f2efe6]/55 mb-2 font-mono">
                      {block.codeLanguage}
                    </p>
                  )}
                  <pre className="text-[13.5px] leading-[1.65] font-mono whitespace-pre-wrap break-words m-0">
                    <code>{block.codeText}</code>
                  </pre>
                </div>
              );
            }

            if (block.type === "divider") {
              return (
                <div
                  key={block.id}
                  role="separator"
                  className="py-6 flex items-center justify-center gap-4 text-[#171716]/45 text-xl select-none"
                >
                  <span>·</span>
                  <span>·</span>
                  <span>·</span>
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* Tags & Footer */}
        {post.tags.length > 0 && (
          <div className="max-w-[700px] mx-auto mt-12 pt-6 border-t border-[#171716]/10 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[#171716]/60">
            <span className="font-medium text-[#171716]/80">Filed under</span>
            {post.tags.map((tag, index) => (
              <span key={tag} className="inline-flex items-center gap-3">
                {index > 0 && <span aria-hidden="true">/</span>}
                <span>{tag}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
