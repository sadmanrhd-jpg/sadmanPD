import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Bold,
  Check,
  Code2,
  Eye,
  Heading2,
  Heading3,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link2,
  Minus,
  Paperclip,
  Plus,
  Quote,
  Sparkles,
  Trash2,
  Type,
  Upload,
  X,
} from "lucide-react";
import {
  compressImageToDataUrl,
  readSmallAttachmentToDataUrl,
  saveBlogPost,
} from "../services/blogService";
import {
  BLOG_LIMITS,
  BLOG_TOPICS,
  countBlogWords,
  createEmptyBlock,
  deriveExcerpt,
  estimateReadTimeMinutes,
  formatFileSize,
  sanitizeInlineHtml,
  sanitizeUrl,
  slugifyTitle,
  type BlogBlock,
  type BlogBlockType,
  type BlogPost,
  type BlogPostStatus,
  type QuoteStyle,
} from "../utils/blogLogic";
import { BlogArticleView } from "./BlogArticleView";

interface BlogEditorProps {
  initialPost: BlogPost | null;
  author: {
    uid: string;
    name: string;
    role: string;
    photoUrl: string;
  };
  onClose: () => void;
  onSaved: (postId: string, status: BlogPostStatus) => void;
}

interface FloatingToolbarState {
  visible: boolean;
  top: number;
  left: number;
  blockId: string;
  linkMode: boolean;
  linkInput: string;
}

const SELECTABLE_TOPICS = BLOG_TOPICS.filter((t) => t !== "All");

interface EditableTextBlockProps {
  block: BlogBlock;
  isFocused: boolean;
  placeholder: string;
  className: string;
  onRegisterRef: (el: HTMLDivElement | null) => void;
  onFocus: () => void;
  onChangeHtml: (html: string) => void;
  onEnterKey: () => void;
  onBackspaceEmpty: () => void;
  onSelectionCheck: () => void;
}

function EditableTextBlock({
  block,
  placeholder,
  className,
  onRegisterRef,
  onFocus,
  onChangeHtml,
  onEnterKey,
  onBackspaceEmpty,
  onSelectionCheck,
}: EditableTextBlockProps) {
  const localRef = useRef<HTMLDivElement | null>(null);
  const lastHtmlRef = useRef<string>(block.html ?? "");

  // Sync external state changes (like undo, initial mount, or block type change) without resetting cursor during normal typing
  useEffect(() => {
    const el = localRef.current;
    if (!el) return;
    const incoming = block.html ?? "";
    if (el.innerHTML !== incoming && incoming !== lastHtmlRef.current) {
      el.innerHTML = incoming;
      lastHtmlRef.current = incoming;
    }
  }, [block.html, block.type, block.quoteStyle]);

  useEffect(() => {
    const el = localRef.current;
    if (el && el.innerHTML === "" && block.html) {
      el.innerHTML = block.html;
      lastHtmlRef.current = block.html;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onEnterKey();
      return;
    }
    if (e.key === "Backspace") {
      const plain = (localRef.current?.textContent ?? "").trim();
      if (plain.length === 0) {
        e.preventDefault();
        onBackspaceEmpty();
      }
    }
  };

  return (
    <div
      ref={(node) => {
        localRef.current = node;
        onRegisterRef(node);
      }}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-multiline="true"
      data-placeholder={placeholder}
      onFocus={onFocus}
      onInput={(e) => {
        const next = e.currentTarget.innerHTML;
        lastHtmlRef.current = next;
        onChangeHtml(next);
      }}
      onKeyDown={handleKeyDown}
      onMouseUp={onSelectionCheck}
      onKeyUp={onSelectionCheck}
      className={`blog-editable blog-prose outline-none break-words ${className}`}
    />
  );
}

export function BlogEditor({
  initialPost,
  author,
  onClose,
  onSaved,
}: BlogEditorProps) {
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [subtitle, setSubtitle] = useState(initialPost?.subtitle ?? "");
  const [coverImage, setCoverImage] = useState(initialPost?.coverImage ?? "");
  const [coverAlt, setCoverAlt] = useState(initialPost?.coverAlt ?? "");
  const [coverUrlDraft, setCoverUrlDraft] = useState("");
  const [showCoverPanel, setShowCoverPanel] = useState(
    Boolean(initialPost?.coverImage),
  );
  const [topic, setTopic] = useState(initialPost?.topic ?? "Product Design");
  const [tags, setTags] = useState<string[]>(initialPost?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [blocks, setBlocks] = useState<BlogBlock[]>(
    initialPost?.blocks && initialPost.blocks.length > 0
      ? initialPost.blocks
      : [createEmptyBlock("paragraph")],
  );

  const [focusedBlockId, setFocusedBlockId] = useState<string>(
    initialPost?.blocks?.[0]?.id ?? blocks[0]?.id ?? "",
  );
  const [plusMenuBlockId, setPlusMenuBlockId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [savingStatus, setSavingStatus] = useState<BlogPostStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);

  const [toolbar, setToolbar] = useState<FloatingToolbarState>({
    visible: false,
    top: 0,
    left: 0,
    blockId: "",
    linkMode: false,
    linkInput: "",
  });

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const editableRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const savedRangeRef = useRef<Range | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement | null>(null);

  const wordCount = useMemo(
    () => countBlogWords(blocks, title, subtitle),
    [blocks, title, subtitle],
  );
  const readTimeMinutes = useMemo(
    () => estimateReadTimeMinutes(blocks, title, subtitle),
    [blocks, title, subtitle],
  );

  const focusBlockDom = useCallback((blockId: string, atEnd = true) => {
    window.requestAnimationFrame(() => {
      const el = editableRefs.current[blockId];
      if (!el) return;
      el.focus();
      if (atEnd) {
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    });
  }, []);

  const updateBlock = useCallback(
    (blockId: string, patch: Partial<BlogBlock>) => {
      setBlocks((prev) =>
        prev.map((blk) => (blk.id === blockId ? { ...blk, ...patch } : blk)),
      );
    },
    [],
  );

  const insertBlockAfter = useCallback(
    (
      afterId: string,
      type: BlogBlockType,
      extra: Partial<BlogBlock> = {},
      replaceIfEmpty = false,
    ) => {
      const newBlock = createEmptyBlock(type, extra);
      setBlocks((prev) => {
        if (prev.length >= BLOG_LIMITS.maxBlocks) {
          setErrorMessage(
            `Articles can have up to ${BLOG_LIMITS.maxBlocks} content blocks.`,
          );
          return prev;
        }
        const idx = prev.findIndex((b) => b.id === afterId);
        if (idx === -1) return [...prev, newBlock];

        const current = prev[idx];
        const currentText = (current.html ?? "").replace(/<[^>]+>/g, "").trim();
        if (
          replaceIfEmpty &&
          current.type === "paragraph" &&
          currentText.length === 0
        ) {
          const copy = [...prev];
          copy[idx] = { ...newBlock, id: current.id };
          return copy;
        }

        const copy = [...prev];
        copy.splice(idx + 1, 0, newBlock);
        return copy;
      });

      const targetId = replaceIfEmpty ? afterId : newBlock.id;
      setFocusedBlockId(targetId);
      setPlusMenuBlockId(null);
      if (
        type === "paragraph" ||
        type === "heading" ||
        type === "subheading" ||
        type === "quote"
      ) {
        focusBlockDom(targetId);
      }
    },
    [focusBlockDom],
  );

  const removeBlock = useCallback(
    (blockId: string) => {
      setBlocks((prev) => {
        if (prev.length <= 1) {
          const fresh = createEmptyBlock("paragraph");
          setFocusedBlockId(fresh.id);
          return [fresh];
        }
        const idx = prev.findIndex((b) => b.id === blockId);
        const next = prev.filter((b) => b.id !== blockId);
        const prevNeighbor = next[Math.max(0, idx - 1)];
        if (prevNeighbor) {
          setFocusedBlockId(prevNeighbor.id);
          focusBlockDom(prevNeighbor.id, true);
        }
        return next;
      });
    },
    [focusBlockDom],
  );

  const moveBlock = useCallback((blockId: string, direction: -1 | 1) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === blockId);
      const target = idx + direction;
      if (idx === -1 || target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(target, 0, item);
      return copy;
    });
  }, []);

  // Floating Medium-style selection toolbar positioning
  const checkTextSelection = useCallback((blockId: string) => {
    const sel = window.getSelection();
    const canvasEl = canvasRef.current;
    const blockEl = editableRefs.current[blockId];
    if (
      !sel ||
      sel.isCollapsed ||
      !sel.toString().trim() ||
      !canvasEl ||
      !blockEl ||
      !blockEl.contains(sel.anchorNode)
    ) {
      setToolbar((prev) =>
        prev.visible && !prev.linkMode ? { ...prev, visible: false } : prev,
      );
      return;
    }

    const range = sel.getRangeAt(0);
    savedRangeRef.current = range.cloneRange();
    const rect = range.getBoundingClientRect();
    const canvasRect = canvasEl.getBoundingClientRect();

    const rawLeft = rect.left - canvasRect.left + rect.width / 2;
    const clampedLeft = Math.max(150, Math.min(canvasRect.width - 150, rawLeft));
    const top = Math.max(8, rect.top - canvasRect.top - 54);

    setToolbar({
      visible: true,
      top,
      left: clampedLeft,
      blockId,
      linkMode: false,
      linkInput: "",
    });
  }, []);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-selection-toolbar='true']")) return;
      if (!target?.closest(".blog-editable")) {
        setToolbar((prev) => (prev.visible ? { ...prev, visible: false, linkMode: false } : prev));
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && savedRangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };

  const syncDomToBlock = (blockId: string) => {
    const el = editableRefs.current[blockId];
    if (el) {
      updateBlock(blockId, { html: el.innerHTML });
    }
  };

  const applyInlineCommand = (command: "bold" | "italic" | "highlight") => {
    const blockId = toolbar.blockId;
    restoreSelection();
    if (command === "highlight") {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
        const range = sel.getRangeAt(0);
        const parentMark =
          sel.anchorNode?.parentElement?.closest("mark") ?? null;
        if (parentMark && editableRefs.current[blockId]?.contains(parentMark)) {
          const textNode = document.createTextNode(parentMark.textContent ?? "");
          parentMark.replaceWith(textNode);
        } else {
          const mark = document.createElement("mark");
          try {
            range.surroundContents(mark);
          } catch {
            document.execCommand(
              "insertHTML",
              false,
              `<mark>${sel.toString()}</mark>`,
            );
          }
        }
      }
    } else {
      document.execCommand(command, false);
    }
    syncDomToBlock(blockId);
  };

  const applyInlineLink = () => {
    const safeUrl = sanitizeUrl(toolbar.linkInput);
    if (!safeUrl) {
      setErrorMessage("Enter a valid https:// or mailto: URL for the hyperlink.");
      return;
    }
    setErrorMessage(null);
    restoreSelection();
    document.execCommand("createLink", false, safeUrl);
    const el = editableRefs.current[toolbar.blockId];
    if (el) {
      // Ensure every link opens safely in a new tab
      el.querySelectorAll("a").forEach((anchor) => {
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noopener noreferrer");
      });
      updateBlock(toolbar.blockId, { html: el.innerHTML });
    }
    setToolbar((prev) => ({
      ...prev,
      visible: false,
      linkMode: false,
      linkInput: "",
    }));
  };

  const convertBlockFormat = (
    blockId: string,
    targetType: "paragraph" | "heading" | "subheading" | "quote",
    quoteStyle?: QuoteStyle,
  ) => {
    setBlocks((prev) =>
      prev.map((blk) => {
        if (blk.id !== blockId) return blk;
        const toggleBackToParagraph =
          blk.type === targetType &&
          (targetType !== "quote" || blk.quoteStyle === quoteStyle);
        if (toggleBackToParagraph) {
          return { id: blk.id, type: "paragraph", html: blk.html ?? "" };
        }
        if (targetType === "quote") {
          return {
            id: blk.id,
            type: "quote",
            html: blk.html ?? "",
            quoteStyle: quoteStyle ?? "editorial",
            attribution: blk.attribution ?? "",
          };
        }
        return { id: blk.id, type: targetType, html: blk.html ?? "" };
      }),
    );
    setToolbar((prev) => ({ ...prev, visible: false, linkMode: false }));
    focusBlockDom(blockId);
  };

  const handleCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage(null);
    setUploadingBlockId("cover");
    try {
      const dataUrl = await compressImageToDataUrl(file, 1360, 190000);
      setCoverImage(dataUrl);
      setShowCoverPanel(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not process cover photo.",
      );
    } finally {
      setUploadingBlockId(null);
      e.target.value = "";
    }
  };

  const handleBlockImageUpload = async (
    blockId: string,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage(null);
    setUploadingBlockId(blockId);
    try {
      const dataUrl = await compressImageToDataUrl(file, 1200, 145000);
      updateBlock(blockId, {
        imageUrl: dataUrl,
        imageAlt: file.name.replace(/\.[^.]+$/, ""),
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not upload image.",
      );
    } finally {
      setUploadingBlockId(null);
      e.target.value = "";
    }
  };

  const handleAttachmentUpload = async (
    blockId: string,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage(null);
    setUploadingBlockId(blockId);
    try {
      const dataUrl = await readSmallAttachmentToDataUrl(file);
      updateBlock(blockId, {
        attachmentName: file.name,
        attachmentUrl: dataUrl,
        attachmentSize: formatFileSize(file.size),
        attachmentMime: file.type,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not attach file.",
      );
    } finally {
      setUploadingBlockId(null);
      e.target.value = "";
    }
  };

  const handleAddTag = () => {
    const cleaned = tagInput.trim().slice(0, BLOG_LIMITS.tagMax);
    if (!cleaned || tags.includes(cleaned) || tags.length >= BLOG_LIMITS.maxTags) {
      setTagInput("");
      return;
    }
    setTags((prev) => [...prev, cleaned]);
    setTagInput("");
  };

  const handleSave = async (nextStatus: BlogPostStatus) => {
    setErrorMessage(null);
    setSavingStatus(nextStatus);
    try {
      const savedId = await saveBlogPost(
        {
          title,
          subtitle,
          coverImage,
          coverAlt,
          topic,
          tags,
          blocks,
          status: nextStatus,
        },
        author,
        initialPost,
      );
      onSaved(savedId, nextStatus);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not save your story.",
      );
    } finally {
      setSavingStatus(null);
    }
  };

  const previewPost: BlogPost = useMemo(
    () => ({
      id: initialPost?.id ?? "preview",
      slug: slugifyTitle(title),
      title: title || "Untitled Story",
      subtitle,
      excerpt: deriveExcerpt(blocks, subtitle),
      coverImage,
      coverAlt,
      topic,
      tags,
      blocks: blocks.map((b) =>
        b.html ? { ...b, html: sanitizeInlineHtml(b.html) } : b,
      ),
      status: initialPost?.status ?? "draft",
      authorUid: author.uid,
      authorName: author.name,
      authorRole: author.role,
      authorPhotoUrl: author.photoUrl,
      readTimeMinutes,
      publishedAt: initialPost?.publishedAt ?? new Date(),
      createdAt: initialPost?.createdAt ?? new Date(),
      updatedAt: new Date(),
    }),
    [
      author,
      blocks,
      coverAlt,
      coverImage,
      initialPost,
      readTimeMinutes,
      subtitle,
      tags,
      title,
      topic,
    ],
  );

  if (previewMode) {
    return (
      <BlogArticleView
        post={previewPost}
        canManage={false}
        isPreview
        onBack={() => setPreviewMode(false)}
      />
    );
  }

  const activeToolbarBlock = blocks.find((b) => b.id === toolbar.blockId);

  return (
    <section className="gallery bg-[#fffdf6] text-[#171716] min-h-[calc(100vh-5rem)] pb-28">
      {/* Sticky Medium-Style Studio Toolbar */}
      <div className="sticky top-20 z-20 bg-[#fffdf6]/95 backdrop-blur-sm border-b border-[#171716]/12">
        <div className="max-w-[1040px] mx-auto px-5 md:px-10 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#171716]/75 hover:text-[#171716] transition-colors whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Blog</span>
            </button>
            <span className="text-xs text-[#171716]/50 truncate tabular-nums">
              {initialPost?.status === "published" ? "Published" : "Draft"} ·{" "}
              {wordCount} words · {readTimeMinutes} min read
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setPreviewMode(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#171716]/20 text-xs font-medium text-[#171716]/85 hover:border-[#171716] transition-colors whitespace-nowrap shrink-0"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              disabled={savingStatus !== null}
              onClick={() => handleSave("draft")}
              className="px-3.5 py-1.5 rounded-lg border border-[#171716]/25 bg-[#f2efe6] text-xs font-medium text-[#171716] hover:border-[#171716] transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
            >
              {savingStatus === "draft" ? "Saving..." : "Save Draft"}
            </button>

            <button
              type="button"
              disabled={savingStatus !== null}
              onClick={() => handleSave("published")}
              className="px-4 py-1.5 rounded-lg border-2 border-[#171716] bg-[#ff5b44] text-[#171716] text-xs font-semibold shadow-[2px_2px_0_#171716] hover:-translate-y-0.5 transition-all whitespace-nowrap shrink-0 disabled:opacity-50"
            >
              {savingStatus === "published"
                ? "Publishing..."
                : initialPost?.status === "published"
                  ? "Update Story"
                  : "Publish"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Medium-Inspired Canvas */}
      <div
        ref={canvasRef}
        className="relative max-w-[780px] mx-auto px-5 md:px-10 pt-10"
      >
        {/* Error Banner */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 px-4 py-3 rounded-xl border border-[#d9442e]/40 bg-[#ff5b44]/10 text-sm text-[#171716] flex items-center justify-between gap-3"
          >
            <span>{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              aria-label="Dismiss error"
              className="text-[#171716]/65 hover:text-[#171716]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Floating Dark Selection Toolbar (Medium-Style + Dual Quote Styles) */}
        {toolbar.visible && (
          <div
            data-selection-toolbar="true"
            style={{ top: toolbar.top, left: toolbar.left }}
            className="absolute z-30 -translate-x-1/2 bg-[#171716] text-[#f2efe6] rounded-xl shadow-[0_12px_30px_rgba(23,23,22,0.28)] px-2 py-1.5 flex items-center gap-1 border border-[#f2efe6]/15"
          >
            {toolbar.linkMode ? (
              <div className="flex items-center gap-1.5 px-1">
                <input
                  type="url"
                  autoFocus
                  value={toolbar.linkInput}
                  onChange={(e) =>
                    setToolbar((prev) => ({
                      ...prev,
                      linkInput: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyInlineLink();
                    }
                    if (e.key === "Escape") {
                      setToolbar((prev) => ({ ...prev, linkMode: false }));
                    }
                  }}
                  placeholder="Paste or type a URL..."
                  className="bg-transparent text-xs text-[#f2efe6] placeholder:text-[#f2efe6]/45 outline-none w-52 px-1.5 py-1"
                />
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyInlineLink();
                  }}
                  aria-label="Apply hyperlink"
                  className="p-1.5 rounded-lg bg-[#ff5b44] text-[#171716] hover:opacity-90"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setToolbar((prev) => ({ ...prev, linkMode: false }));
                  }}
                  aria-label="Cancel hyperlink"
                  className="p-1.5 rounded-lg text-[#f2efe6]/70 hover:text-[#f2efe6]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  title="Bold"
                  aria-label="Bold"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyInlineCommand("bold");
                  }}
                  className="p-1.5 rounded-lg hover:bg-[#f2efe6]/15 transition-colors"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Italic"
                  aria-label="Italic"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyInlineCommand("italic");
                  }}
                  className="p-1.5 rounded-lg hover:bg-[#f2efe6]/15 transition-colors"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Highlight"
                  aria-label="Highlight"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyInlineCommand("highlight");
                  }}
                  className="p-1.5 rounded-lg hover:bg-[#f2efe6]/15 transition-colors"
                >
                  <Highlighter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Add Hyperlink"
                  aria-label="Add Hyperlink"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setToolbar((prev) => ({
                      ...prev,
                      linkMode: true,
                      linkInput: "",
                    }));
                  }}
                  className="p-1.5 rounded-lg hover:bg-[#f2efe6]/15 transition-colors"
                >
                  <Link2 className="w-4 h-4" />
                </button>

                <span className="w-px h-4 bg-[#f2efe6]/20 mx-0.5" />

                <button
                  type="button"
                  title="Heading"
                  aria-label="Toggle Heading"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    convertBlockFormat(toolbar.blockId, "heading");
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${
                    activeToolbarBlock?.type === "heading"
                      ? "bg-[#ff5b44] text-[#171716]"
                      : "hover:bg-[#f2efe6]/15"
                  }`}
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Subheading"
                  aria-label="Toggle Subheading"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    convertBlockFormat(toolbar.blockId, "subheading");
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${
                    activeToolbarBlock?.type === "subheading"
                      ? "bg-[#ff5b44] text-[#171716]"
                      : "hover:bg-[#f2efe6]/15"
                  }`}
                >
                  <Heading3 className="w-4 h-4" />
                </button>

                <span className="w-px h-4 bg-[#f2efe6]/20 mx-0.5" />

                <button
                  type="button"
                  title="Editorial Quotation"
                  aria-label="Editorial Quotation"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    convertBlockFormat(toolbar.blockId, "quote", "editorial");
                  }}
                  className={`px-2 py-1 rounded-lg text-xs font-medium inline-flex items-center gap-1 transition-colors ${
                    activeToolbarBlock?.type === "quote" &&
                    activeToolbarBlock.quoteStyle === "editorial"
                      ? "bg-[#ff5b44] text-[#171716]"
                      : "hover:bg-[#f2efe6]/15"
                  }`}
                >
                  <Quote className="w-3.5 h-3.5" />
                  <span>Quote</span>
                </button>
                <button
                  type="button"
                  title="Centered Pull-Quote"
                  aria-label="Centered Pull-Quote"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    convertBlockFormat(toolbar.blockId, "quote", "pullquote");
                  }}
                  className={`px-2 py-1 rounded-lg text-xs font-medium inline-flex items-center gap-1 transition-colors ${
                    activeToolbarBlock?.type === "quote" &&
                    activeToolbarBlock.quoteStyle === "pullquote"
                      ? "bg-[#ff5b44] text-[#171716]"
                      : "hover:bg-[#f2efe6]/15"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pull Quote</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Top Story Controls: Cover Image + Topic + Tags */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => setShowCoverPanel((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-[#171716]/65 hover:text-[#171716] transition-colors font-medium"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{coverImage ? "Edit cover image" : "Add cover image"}</span>
            </button>

            <span className="text-[#171716]/25">·</span>

            <label className="inline-flex items-center gap-1.5 text-[#171716]/65">
              <span>Topic:</span>
              <select
                aria-label="Article topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-transparent font-medium text-[#171716] outline-none cursor-pointer"
              >
                {SELECTABLE_TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {showCoverPanel && (
            <div className="p-4 rounded-xl border border-[#171716]/15 bg-[#f2efe6]/55 space-y-3">
              {coverImage ? (
                <div className="space-y-3">
                  <div className="relative">
                    <img
                      src={coverImage}
                      alt={coverAlt || "Cover preview"}
                      referrerPolicy="no-referrer"
                      className="w-full max-h-72 object-cover rounded-lg bg-[#fffdf6]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverImage("");
                        setCoverAlt("");
                      }}
                      aria-label="Remove cover image"
                      className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-[#171716]/85 text-[#f2efe6] text-xs font-medium hover:bg-[#d9442e]"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={coverAlt}
                    onChange={(e) => setCoverAlt(e.target.value)}
                    placeholder="Add a caption or alt description for the cover image..."
                    className="w-full px-3 py-2 rounded-lg border border-[#171716]/15 bg-[#fffdf6] text-xs text-[#171716] outline-none focus:border-[#171716]"
                  />
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={uploadingBlockId === "cover"}
                    onClick={() => coverFileInputRef.current?.click()}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-[#171716] bg-[#fffdf6] text-xs font-medium text-[#171716] hover:bg-[#171716] hover:text-[#fffdf6] transition-colors shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>
                      {uploadingBlockId === "cover"
                        ? "Optimizing..."
                        : "Upload Photo"}
                    </span>
                  </button>
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="url"
                      value={coverUrlDraft}
                      onChange={(e) => setCoverUrlDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const safe = sanitizeUrl(coverUrlDraft);
                          if (safe) {
                            setCoverImage(safe);
                            setCoverUrlDraft("");
                          }
                        }
                      }}
                      placeholder="Or paste an image URL and press Enter..."
                      className="flex-1 px-3 py-2 rounded-lg border border-[#171716]/20 bg-[#fffdf6] text-xs text-[#171716] outline-none focus:border-[#171716]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const safe = sanitizeUrl(coverUrlDraft);
                        if (safe) {
                          setCoverImage(safe);
                          setCoverUrlDraft("");
                        }
                      }}
                      className="px-3 py-2 rounded-lg bg-[#171716] text-[#fffdf6] text-xs font-medium"
                    >
                      Use URL
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#f2efe6] text-xs text-[#171716]/85"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                  aria-label={`Remove tag ${tag}`}
                  className="text-[#171716]/50 hover:text-[#171716]"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {tags.length < BLOG_LIMITS.maxTags && (
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                onBlur={handleAddTag}
                placeholder={
                  tags.length === 0 ? "Add up to 6 tags (press Enter)..." : "+ tag"
                }
                className="bg-transparent text-xs text-[#171716]/75 placeholder:text-[#171716]/40 outline-none min-w-[160px] py-1"
              />
            )}
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-8 space-y-3 pl-0 sm:pl-12">
          <textarea
            rows={1}
            value={title}
            maxLength={BLOG_LIMITS.titleMax}
            onChange={(e) => {
              setTitle(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            placeholder="Title"
            aria-label="Story title"
            className="w-full resize-none overflow-hidden bg-transparent font-display text-[32px] sm:text-[44px] leading-[1.12] tracking-[-0.025em] font-semibold text-[#171716] placeholder:text-[#171716]/25 outline-none"
          />
          <textarea
            rows={1}
            value={subtitle}
            maxLength={BLOG_LIMITS.subtitleMax}
            onChange={(e) => {
              setSubtitle(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            placeholder="Add a short subtitle or opening thought..."
            aria-label="Story subtitle"
            className="w-full resize-none overflow-hidden bg-transparent font-editorial text-[19px] sm:text-[22px] leading-[1.45] text-[#171716]/68 placeholder:text-[#171716]/28 outline-none"
          />
        </div>

        {/* Subtle Author Formatting Hint */}
        <p className="pl-0 sm:pl-12 mb-6 text-xs text-[#171716]/45">
          Click <strong className="font-semibold text-[#171716]/70">+</strong> to add text, quotes, images, links, or attachments. Highlight any text for bold, italic, links, headings, or quote styles.
        </p>

        {/* Rich Block Stack */}
        <div className="space-y-5">
          {blocks.map((block, index) => {
            const isFocused = focusedBlockId === block.id;
            const isPlusOpen = plusMenuBlockId === block.id;

            return (
              <div
                key={block.id}
                onClick={() => setFocusedBlockId(block.id)}
                className="group relative pl-10 sm:pl-12 pr-0 sm:pr-10"
              >
                {/* Left Margin Medium `+` Insert Button */}
                <div className="absolute left-0 top-1 flex items-center">
                  <button
                    type="button"
                    data-testid={`plus-block-${index}`}
                    aria-label={isPlusOpen ? "Close block menu" : "Insert content block"}
                    aria-expanded={isPlusOpen}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFocusedBlockId(block.id);
                      setPlusMenuBlockId((prev) =>
                        prev === block.id ? null : block.id,
                      );
                    }}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-150 ${
                      isPlusOpen
                        ? "border-[#171716] bg-[#171716] text-[#fffdf6] rotate-45"
                        : isFocused
                          ? "border-[#171716]/45 text-[#171716]/80 hover:border-[#171716] hover:text-[#171716]"
                          : "border-[#171716]/20 text-[#171716]/35 opacity-60 group-hover:opacity-100 hover:border-[#171716]/60"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Medium-Style Inline Expanding `+` Insert Drawer */}
                {isPlusOpen && (
                  <div
                    role="menu"
                    aria-label="Insert block options"
                    className="mb-3 p-2 rounded-xl border border-[#171716]/18 bg-[#f2efe6] flex flex-wrap items-center gap-1.5 shadow-[0_6px_18px_rgba(23,23,22,0.08)]"
                  >
                    {(
                      [
                        {
                          type: "paragraph",
                          label: "Text",
                          icon: Type,
                        },
                        {
                          type: "heading",
                          label: "Heading",
                          icon: Heading2,
                        },
                        {
                          type: "quote",
                          label: "Quote",
                          icon: Quote,
                        },
                        {
                          type: "image",
                          label: "Image",
                          icon: ImageIcon,
                        },
                        {
                          type: "link",
                          label: "Hyperlink",
                          icon: Link2,
                        },
                        {
                          type: "attachment",
                          label: "Attachment",
                          icon: Paperclip,
                        },
                        {
                          type: "code",
                          label: "Code / Note",
                          icon: Code2,
                        },
                        {
                          type: "divider",
                          label: "Divider",
                          icon: Minus,
                        },
                      ] as const
                    ).map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.type}
                          type="button"
                          role="menuitem"
                          onClick={(e) => {
                            e.stopPropagation();
                            insertBlockAfter(block.id, item.type, {}, true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fffdf6] border border-[#171716]/15 text-xs font-medium text-[#171716] hover:border-[#171716] hover:bg-[#171716] hover:text-[#fffdf6] transition-colors whitespace-nowrap"
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Block Body Renderer */}
                {block.type === "paragraph" && (
                  <EditableTextBlock
                    block={block}
                    isFocused={isFocused}
                    placeholder={
                      index === 0 ? "Tell your story..." : "Continue writing..."
                    }
                    className="font-editorial text-[18.5px] sm:text-[20px] leading-[1.82] text-[#171716]/92 min-h-[34px]"
                    onRegisterRef={(el) => {
                      editableRefs.current[block.id] = el;
                    }}
                    onFocus={() => setFocusedBlockId(block.id)}
                    onChangeHtml={(html) => updateBlock(block.id, { html })}
                    onEnterKey={() => insertBlockAfter(block.id, "paragraph")}
                    onBackspaceEmpty={() => removeBlock(block.id)}
                    onSelectionCheck={() => checkTextSelection(block.id)}
                  />
                )}

                {block.type === "heading" && (
                  <EditableTextBlock
                    block={block}
                    isFocused={isFocused}
                    placeholder="Section heading..."
                    className="font-display text-[26px] sm:text-[30px] leading-[1.24] tracking-[-0.02em] font-semibold text-[#171716] pt-2 min-h-[40px]"
                    onRegisterRef={(el) => {
                      editableRefs.current[block.id] = el;
                    }}
                    onFocus={() => setFocusedBlockId(block.id)}
                    onChangeHtml={(html) => updateBlock(block.id, { html })}
                    onEnterKey={() => insertBlockAfter(block.id, "paragraph")}
                    onBackspaceEmpty={() => removeBlock(block.id)}
                    onSelectionCheck={() => checkTextSelection(block.id)}
                  />
                )}

                {block.type === "subheading" && (
                  <EditableTextBlock
                    block={block}
                    isFocused={isFocused}
                    placeholder="Subheading..."
                    className="font-display text-[20px] sm:text-[23px] leading-[1.32] tracking-[-0.015em] font-semibold text-[#171716] pt-1 min-h-[34px]"
                    onRegisterRef={(el) => {
                      editableRefs.current[block.id] = el;
                    }}
                    onFocus={() => setFocusedBlockId(block.id)}
                    onChangeHtml={(html) => updateBlock(block.id, { html })}
                    onEnterKey={() => insertBlockAfter(block.id, "paragraph")}
                    onBackspaceEmpty={() => removeBlock(block.id)}
                    onSelectionCheck={() => checkTextSelection(block.id)}
                  />
                )}

                {block.type === "quote" && (
                  <div
                    className={
                      block.quoteStyle === "pullquote"
                        ? "my-4 py-6 px-4 sm:px-8 border-y border-[#171716]/18 text-center"
                        : "my-3 py-5 px-5 sm:px-7 rounded-xl bg-[#f2efe6]/75"
                    }
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-medium text-[#171716]/50">
                        {block.quoteStyle === "pullquote"
                          ? "Pull Quote"
                          : "Editorial Quotation"}
                      </span>
                      <div className="inline-flex items-center gap-1 bg-[#fffdf6] p-0.5 rounded-lg border border-[#171716]/15">
                        <button
                          type="button"
                          onClick={() =>
                            updateBlock(block.id, { quoteStyle: "editorial" })
                          }
                          className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                            block.quoteStyle !== "pullquote"
                              ? "bg-[#171716] text-[#fffdf6]"
                              : "text-[#171716]/65 hover:text-[#171716]"
                          }`}
                        >
                          Editorial
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateBlock(block.id, { quoteStyle: "pullquote" })
                          }
                          className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                            block.quoteStyle === "pullquote"
                              ? "bg-[#171716] text-[#fffdf6]"
                              : "text-[#171716]/65 hover:text-[#171716]"
                          }`}
                        >
                          Pull Quote
                        </button>
                      </div>
                    </div>

                    <EditableTextBlock
                      block={block}
                      isFocused={isFocused}
                      placeholder="Write a memorable quotation..."
                      className={
                        block.quoteStyle === "pullquote"
                          ? "font-editorial italic text-[23px] sm:text-[27px] leading-[1.45] text-[#171716] text-center min-h-[38px]"
                          : "font-editorial italic text-[19px] sm:text-[21px] leading-[1.68] text-[#171716]/88 min-h-[34px]"
                      }
                      onRegisterRef={(el) => {
                        editableRefs.current[block.id] = el;
                      }}
                      onFocus={() => setFocusedBlockId(block.id)}
                      onChangeHtml={(html) => updateBlock(block.id, { html })}
                      onEnterKey={() => insertBlockAfter(block.id, "paragraph")}
                      onBackspaceEmpty={() => removeBlock(block.id)}
                      onSelectionCheck={() => checkTextSelection(block.id)}
                    />

                    <input
                      type="text"
                      value={block.attribution ?? ""}
                      onChange={(e) =>
                        updateBlock(block.id, { attribution: e.target.value })
                      }
                      placeholder="Attribution or source (optional)"
                      className={`mt-3 w-full bg-transparent text-xs text-[#171716]/60 placeholder:text-[#171716]/35 outline-none ${
                        block.quoteStyle === "pullquote" ? "text-center" : ""
                      }`}
                    />
                  </div>
                )}

                {block.type === "image" && (
                  <div className="my-4 p-4 rounded-xl border border-[#171716]/15 bg-[#f2efe6]/50 space-y-3">
                    {block.imageUrl ? (
                      <>
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <div className="inline-flex items-center gap-1 bg-[#fffdf6] p-0.5 rounded-lg border border-[#171716]/15">
                            <button
                              type="button"
                              onClick={() =>
                                updateBlock(block.id, { layout: "standard" })
                              }
                              className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                                block.layout !== "wide"
                                  ? "bg-[#171716] text-[#fffdf6]"
                                  : "text-[#171716]/65"
                              }`}
                            >
                              Standard
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateBlock(block.id, { layout: "wide" })
                              }
                              className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                                block.layout === "wide"
                                  ? "bg-[#171716] text-[#fffdf6]"
                                  : "text-[#171716]/65"
                              }`}
                            >
                              Wide
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              updateBlock(block.id, { imageUrl: "" })
                            }
                            className="text-[#d9442e] hover:underline font-medium"
                          >
                            Replace image
                          </button>
                        </div>
                        <img
                          src={block.imageUrl}
                          alt={block.imageAlt || "Embedded visual"}
                          referrerPolicy="no-referrer"
                          className="w-full max-h-[460px] object-contain rounded-lg bg-[#fffdf6]"
                        />
                        <input
                          type="text"
                          value={block.caption ?? ""}
                          onChange={(e) =>
                            updateBlock(block.id, { caption: e.target.value })
                          }
                          placeholder="Type caption for image (optional)"
                          className="w-full bg-transparent text-center text-xs text-[#171716]/65 placeholder:text-[#171716]/35 outline-none"
                        />
                      </>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#171716] bg-[#fffdf6] text-xs font-medium text-[#171716] hover:bg-[#171716] hover:text-[#fffdf6] transition-colors cursor-pointer">
                            <Upload className="w-3.5 h-3.5" />
                            <span>
                              {uploadingBlockId === block.id
                                ? "Optimizing..."
                                : "Upload Image"}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleBlockImageUpload(block.id, e)
                              }
                              className="hidden"
                            />
                          </label>
                          <input
                            type="url"
                            placeholder="Or paste image URL (https://...)"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const safe = sanitizeUrl(e.currentTarget.value);
                                if (safe) {
                                  updateBlock(block.id, { imageUrl: safe });
                                }
                              }
                            }}
                            onBlur={(e) => {
                              const safe = sanitizeUrl(e.currentTarget.value);
                              if (safe) {
                                updateBlock(block.id, { imageUrl: safe });
                              }
                            }}
                            className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-[#171716]/20 bg-[#fffdf6] text-xs text-[#171716] outline-none focus:border-[#171716]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {block.type === "link" && (
                  <div className="my-4 p-4 rounded-xl border border-[#171716]/18 bg-[#f2efe6]/50 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#171716]/60">
                      <Link2 className="w-3.5 h-3.5 text-[#d9442e]" />
                      <span>Hyperlink Card</span>
                    </div>
                    <input
                      type="url"
                      value={block.linkUrl ?? ""}
                      onChange={(e) =>
                        updateBlock(block.id, { linkUrl: e.target.value })
                      }
                      placeholder="https://example.com/reference"
                      className="w-full px-3 py-2 rounded-lg border border-[#171716]/18 bg-[#fffdf6] text-xs text-[#171716] outline-none focus:border-[#171716]"
                    />
                    <input
                      type="text"
                      value={block.linkTitle ?? ""}
                      onChange={(e) =>
                        updateBlock(block.id, { linkTitle: e.target.value })
                      }
                      placeholder="Link title (e.g., National Sanitation Dashboard)"
                      className="w-full px-3 py-2 rounded-lg border border-[#171716]/18 bg-[#fffdf6] text-sm font-medium text-[#171716] outline-none focus:border-[#171716]"
                    />
                    <input
                      type="text"
                      value={block.linkDescription ?? ""}
                      onChange={(e) =>
                        updateBlock(block.id, { linkDescription: e.target.value })
                      }
                      placeholder="Short note explaining why readers should visit (optional)"
                      className="w-full px-3 py-2 rounded-lg border border-[#171716]/18 bg-[#fffdf6] text-xs text-[#171716]/80 outline-none focus:border-[#171716]"
                    />
                  </div>
                )}

                {block.type === "attachment" && (
                  <div className="my-4 p-4 rounded-xl border border-[#171716]/18 bg-[#f2efe6]/50 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#171716]/65">
                        <Paperclip className="w-3.5 h-3.5 text-[#d9442e]" />
                        <span>File Attachment</span>
                      </span>
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#171716] bg-[#fffdf6] text-xs font-medium text-[#171716] hover:bg-[#171716] hover:text-[#fffdf6] transition-colors cursor-pointer">
                        <Upload className="w-3 h-3" />
                        <span>
                          {uploadingBlockId === block.id
                            ? "Reading..."
                            : "Upload File (<=150 KB)"}
                        </span>
                        <input
                          type="file"
                          onChange={(e) => handleAttachmentUpload(block.id, e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        value={block.attachmentName ?? ""}
                        onChange={(e) =>
                          updateBlock(block.id, {
                            attachmentName: e.target.value,
                          })
                        }
                        placeholder="File title (e.g., UX Research Deck.pdf)"
                        className="px-3 py-2 rounded-lg border border-[#171716]/18 bg-[#fffdf6] text-xs font-medium text-[#171716] outline-none focus:border-[#171716]"
                      />
                      <input
                        type="url"
                        value={
                          block.attachmentUrl?.startsWith("data:")
                            ? ""
                            : (block.attachmentUrl ?? "")
                        }
                        onChange={(e) =>
                          updateBlock(block.id, {
                            attachmentUrl: e.target.value,
                            attachmentSize: block.attachmentSize || "External file",
                          })
                        }
                        placeholder={
                          block.attachmentUrl?.startsWith("data:")
                            ? `Embedded (${block.attachmentSize || "Ready"})`
                            : "Or paste Google Drive / Dropbox / PDF link..."
                        }
                        className="px-3 py-2 rounded-lg border border-[#171716]/18 bg-[#fffdf6] text-xs text-[#171716] outline-none focus:border-[#171716]"
                      />
                    </div>
                  </div>
                )}

                {block.type === "code" && (
                  <div className="my-4 rounded-xl bg-[#171716] text-[#f2efe6] p-4 space-y-2">
                    <input
                      type="text"
                      value={block.codeLanguage ?? ""}
                      onChange={(e) =>
                        updateBlock(block.id, { codeLanguage: e.target.value })
                      }
                      placeholder="Label (e.g., note, css, ts)"
                      className="bg-transparent text-[11px] font-mono text-[#f2efe6]/60 outline-none"
                    />
                    <textarea
                      rows={4}
                      value={block.codeText ?? ""}
                      onChange={(e) =>
                        updateBlock(block.id, { codeText: e.target.value })
                      }
                      placeholder="Paste code snippet or structured field note..."
                      className="w-full bg-transparent text-[13.5px] font-mono leading-relaxed text-[#f2efe6] placeholder:text-[#f2efe6]/35 outline-none resize-y"
                    />
                  </div>
                )}

                {block.type === "divider" && (
                  <div className="py-4 flex items-center justify-center gap-4 text-[#171716]/45 text-xl select-none">
                    <span>·</span>
                    <span>·</span>
                    <span>·</span>
                  </div>
                )}

                {/* Subtle Right-Edge Block Reorder / Delete Controls */}
                <div className="hidden sm:flex flex-col gap-1 absolute right-0 top-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveBlock(block.id, -1);
                    }}
                    aria-label="Move block up"
                    className="p-1 rounded text-[#171716]/45 hover:text-[#171716] disabled:opacity-20"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === blocks.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveBlock(block.id, 1);
                    }}
                    aria-label="Move block down"
                    className="p-1 rounded text-[#171716]/45 hover:text-[#171716] disabled:opacity-20"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBlock(block.id);
                    }}
                    aria-label="Remove block"
                    className="p-1 rounded text-[#171716]/45 hover:text-[#d9442e]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom quick-add paragraph affordance */}
        <div className="pl-10 sm:pl-12 pt-8">
          <button
            type="button"
            onClick={() => {
              const last = blocks[blocks.length - 1];
              if (last) insertBlockAfter(last.id, "paragraph");
            }}
            className="text-xs font-medium text-[#171716]/45 hover:text-[#171716] transition-colors"
          >
            + Add new paragraph
          </button>
        </div>
      </div>
    </section>
  );
}
