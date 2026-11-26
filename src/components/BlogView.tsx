import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  LogOut,
  Mail,
  PenLine,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { isQuotaExceededError } from "../lib/firebase";
import {
  deleteBlogPost,
  subscribeAuthorPosts,
  subscribePublishedPosts,
  subscribeWriters,
} from "../services/blogService";
import {
  BLOG_TOPICS,
  filterBlogPosts,
  formatEditorialDate,
  sanitizeMediaUrl,
  type BlogPost,
  type BlogPostStatus,
  type BlogTopic,
  type WriterRecord,
} from "../utils/blogLogic";
import { BlogArticleView } from "./BlogArticleView";
import { BlogEditor } from "./BlogEditor";
import { InquiriesModal } from "./InquiriesModal";
import { WritersModal } from "./WritersModal";
import {
  subscribeInquiries,
  type InquiryRecord,
} from "../services/contactService";

type BlogMode = "index" | "article" | "editor";
type FeedTab = "published" | "drafts";

interface BlogViewProps {
  initialPostId?: string | null;
}

function isLoginHash(): boolean {
  const hash = window.location.hash.toLowerCase();
  return hash === "#blog/login" || hash === "#studio";
}

function parseHashPostId(): string | null {
  const hash = window.location.hash;
  if (!hash.startsWith("#blog/")) return null;
  const raw = hash.slice("#blog/".length).trim();
  if (!raw || raw.toLowerCase() === "login") return null;
  return decodeURIComponent(raw);
}

export function BlogView({ initialPostId = null }: BlogViewProps) {
  const {
    user,
    authReady,
    signingIn,
    accessRole,
    writerProfile,
    authError,
    clearAuthError,
    signInWithGoogle,
    logout,
  } = useAuth();

  const canWrite = accessRole === "admin" || accessRole === "writer";
  const isAdmin = accessRole === "admin";

  const [mode, setMode] = useState<BlogMode>("index");
  const [feedTab, setFeedTab] = useState<FeedTab>("published");
  const [selectedTopic, setSelectedTopic] = useState<BlogTopic>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [publishedPosts, setPublishedPosts] = useState<BlogPost[]>([]);
  const [authorPosts, setAuthorPosts] = useState<BlogPost[]>([]);
  const [writers, setWriters] = useState<WriterRecord[]>([]);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [activePostId, setActivePostId] = useState<string | null>(
    initialPostId ?? parseHashPostId(),
  );
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [writersModalOpen, setWritersModalOpen] = useState(false);
  const [inquiriesModalOpen, setInquiriesModalOpen] = useState(false);

  // Public subscription: every visitor can read published blog posts without signing in
  useEffect(() => {
    setLoadingPosts(true);
    const unsub = subscribePublishedPosts(
      (posts) => {
        setPublishedPosts(posts);
        setLoadingPosts(false);
        setFeedError(null);
      },
      (message) => {
        setLoadingPosts(false);
        setFeedError(
          isQuotaExceededError(message)
            ? "The blog database has reached its free daily limit. Stories will appear again shortly."
            : "Could not load published stories right now.",
        );
      },
    );
    return unsub;
  }, []);

  // Private author drafts & management subscription (only for signed-in owner or approved writers)
  useEffect(() => {
    if (!user || !canWrite) {
      setAuthorPosts([]);
      setFeedTab("published");
      return;
    }
    const unsub = subscribeAuthorPosts(
      user.uid,
      isAdmin,
      (posts) => setAuthorPosts(posts),
      () => {
        // Non-fatal fallback to published feed
      },
    );
    return unsub;
  }, [user, canWrite, isAdmin]);

  // Owner-only writers registry subscription
  useEffect(() => {
    if (!user || !isAdmin) {
      setWriters([]);
      return;
    }
    const unsub = subscribeWriters(
      (list) => setWriters(list),
      () => {
        // Handled via error boundary / toast
      },
    );
    return unsub;
  }, [user, isAdmin]);

  // Owner-only inquiries backup inbox subscription
  useEffect(() => {
    if (!user || !isAdmin) {
      setInquiries([]);
      return;
    }
    const unsub = subscribeInquiries(
      (list) => setInquiries(list),
      () => {
        // Non-fatal fallback
      },
    );
    return unsub;
  }, [user, isAdmin]);

  const unreadInquiriesCount = useMemo(
    () => inquiries.filter((item) => item.status === "new").length,
    [inquiries],
  );

  const openLoginModal = useCallback(() => {
    clearAuthError();
    setLoginModalOpen(true);
  }, [clearAuthError]);

  const closeLoginModal = useCallback(() => {
    setLoginModalOpen(false);
    if (isLoginHash()) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  // Close login modal automatically once a user completes sign-in
  useEffect(() => {
    if (user && loginModalOpen) {
      closeLoginModal();
    }
  }, [user, loginModalOpen, closeLoginModal]);

  // Open minimal sign-in dialog automatically on #blog/login or #studio when signed out
  useEffect(() => {
    if (authReady && !user && isLoginHash()) {
      openLoginModal();
    }
  }, [authReady, user, openLoginModal]);

  // Keyboard shortcut (Cmd/Ctrl + Shift + L) to open discreet sign-in dialog
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.shiftKey &&
        event.key.toLowerCase() === "l"
      ) {
        if (!user) {
          event.preventDefault();
          openLoginModal();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [user, openLoginModal]);

  // Sync URL hash deep links (#blog/{postId} and #blog/login)
  useEffect(() => {
    const onHashChange = () => {
      if (isLoginHash()) {
        if (!user) {
          openLoginModal();
        }
        return;
      }
      const hashId = parseHashPostId();
      if (hashId) {
        setActivePostId(hashId);
        setMode("article");
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [user, openLoginModal]);

  const allKnownPosts = useMemo(() => {
    const map = new Map<string, BlogPost>();
    for (const post of publishedPosts) map.set(post.id, post);
    for (const post of authorPosts) map.set(post.id, post);
    return Array.from(map.values());
  }, [publishedPosts, authorPosts]);

  // If deep-linked via #blog/{id}, open article mode once loaded
  useEffect(() => {
    if (activePostId && mode === "index") {
      const found = allKnownPosts.find((p) => p.id === activePostId);
      if (found) {
        setMode("article");
      }
    }
  }, [activePostId, allKnownPosts, mode]);

  const draftPosts = useMemo(
    () => authorPosts.filter((p) => p.status === "draft"),
    [authorPosts],
  );

  const activeSourcePosts = feedTab === "drafts" ? draftPosts : publishedPosts;

  const visiblePosts = useMemo(
    () => filterBlogPosts(activeSourcePosts, selectedTopic, searchQuery),
    [activeSourcePosts, selectedTopic, searchQuery],
  );

  const activePost = useMemo(
    () => allKnownPosts.find((p) => p.id === activePostId) ?? null,
    [allKnownPosts, activePostId],
  );

  const authorIdentity = useMemo(
    () => ({
      uid: user?.uid ?? "",
      name: writerProfile?.displayName || user?.displayName || "Sadman Rahman",
      role: writerProfile?.title || (isAdmin ? "Product Designer & Photographer" : "Guest Writer"),
      photoUrl: user?.photoURL || "",
    }),
    [user, writerProfile, isAdmin],
  );

  const openArticle = (postId: string) => {
    setActivePostId(postId);
    setMode("article");
    if (window.location.hash !== `#blog/${postId}`) {
      window.history.replaceState(null, "", `#blog/${postId}`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backToIndex = () => {
    setMode("index");
    setActivePostId(null);
    setEditingPost(null);
    if (window.location.hash.startsWith("#blog/")) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  const startNewStory = () => {
    setEditingPost(null);
    setMode("editor");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const startEditStory = (post: BlogPost) => {
    setEditingPost(post);
    setMode("editor");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleSavedPost = (postId: string, status: BlogPostStatus) => {
    setEditingPost(null);
    if (status === "published") {
      setFeedTab("published");
      openArticle(postId);
    } else {
      setFeedTab("drafts");
      setActivePostId(null);
      setMode("index");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDeletePost = async (postId: string) => {
    await deleteBlogPost(postId);
    backToIndex();
  };

  if (mode === "editor" && user && canWrite) {
    return (
      <BlogEditor
        initialPost={editingPost}
        author={authorIdentity}
        onClose={backToIndex}
        onSaved={handleSavedPost}
      />
    );
  }

  if (mode === "article" && activePost) {
    const canManagePost =
      Boolean(user) && (isAdmin || activePost.authorUid === user?.uid);
    return (
      <BlogArticleView
        post={activePost}
        canManage={canManagePost}
        onBack={backToIndex}
        onEdit={() => startEditStory(activePost)}
        onDelete={() => handleDeletePost(activePost.id)}
      />
    );
  }

  const featuredPost =
    feedTab === "published" &&
    selectedTopic === "All" &&
    !searchQuery.trim() &&
    visiblePosts.length > 0
      ? visiblePosts[0]
      : null;

  const listPosts = featuredPost ? visiblePosts.slice(1) : visiblePosts;

  return (
    <main className="gallery bg-[#f2efe6] text-[#171716] min-h-[calc(100vh-5rem)] pb-24">
      <div className="max-w-[1160px] mx-auto px-5 md:px-10 pt-10 md:pt-14">
        {/* Editorial Masthead + Writer Studio Controls */}
        <header className="pb-8 border-b-2 border-[#171716] flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-medium text-[#d9442e] mb-2">
              Journal &amp; Field Notes
            </p>
            <h1 className="font-display text-[clamp(36px,5vw,60px)] leading-[1.06] tracking-[-0.025em] font-semibold text-[#171716] m-0">
              Writing on systems, craft &amp; light.
            </h1>
            <p className="mt-3 text-[16px] sm:text-[17px] leading-[1.65] text-[#171716]/72 m-0">
              Essays, product teardowns, and stories behind the lens. Open for everyone to read.
            </p>
          </div>

          {/* Authenticated Publishing Controls (completely hidden from public visitors) */}
          {user && canWrite && (
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                data-testid="blog-write-story-btn"
                onClick={startNewStory}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#171716] bg-[#ff5b44] text-sm font-semibold text-[#171716] shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 transition-all whitespace-nowrap shrink-0"
              >
                <PenLine className="w-4 h-4" />
                <span>Write Story</span>
              </button>

              {isAdmin && (
                <>
                  <button
                    type="button"
                    data-testid="blog-inquiries-btn"
                    onClick={() => setInquiriesModalOpen(true)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border-2 border-[#171716] text-sm font-medium text-[#171716] transition-colors whitespace-nowrap shrink-0 ${
                      unreadInquiriesCount > 0
                        ? "bg-[#c7ef45] hover:bg-[#f5d837]"
                        : "bg-[#fffdf6] hover:bg-[#f5d837]"
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span>
                      {unreadInquiriesCount > 0
                        ? `Inquiries (${unreadInquiriesCount} new)`
                        : `Inquiries (${inquiries.length})`}
                    </span>
                  </button>

                  <button
                    type="button"
                    data-testid="blog-manage-writers-btn"
                    onClick={() => setWritersModalOpen(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border-2 border-[#171716] bg-[#fffdf6] text-sm font-medium text-[#171716] hover:bg-[#f5d837] transition-colors whitespace-nowrap shrink-0"
                  >
                    <Users className="w-4 h-4" />
                    <span>Writers ({writers.length + 1})</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => logout()}
                aria-label="Sign out"
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#171716]/25 text-xs font-medium text-[#171716]/75 hover:border-[#171716] hover:text-[#171716] transition-colors whitespace-nowrap shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </header>

        {/* Signed-in status notices (visible only to authorized signed-in authors) */}
        {user && canWrite && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#171716]/70">
            <div className="inline-flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#d9442e] shrink-0" />
              <span>
                Signed in as <strong className="font-semibold text-[#171716]">{authorIdentity.name}</strong> ({isAdmin ? "Owner" : "Invited Writer"})
              </span>
            </div>

            <div
              role="tablist"
              aria-label="Article status view"
              className="inline-flex items-center rounded-xl border border-[#171716]/20 bg-[#fffdf6] p-0.5"
            >
              <button
                type="button"
                role="tab"
                aria-selected={feedTab === "published"}
                onClick={() => setFeedTab("published")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  feedTab === "published"
                    ? "bg-[#171716] text-[#f2efe6]"
                    : "text-[#171716]/70 hover:text-[#171716]"
                }`}
              >
                Published ({publishedPosts.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={feedTab === "drafts"}
                onClick={() => setFeedTab("drafts")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  feedTab === "drafts"
                    ? "bg-[#171716] text-[#f2efe6]"
                    : "text-[#171716]/70 hover:text-[#171716]"
                }`}
              >
                Drafts ({draftPosts.length})
              </button>
            </div>
          </div>
        )}

        {/* Topic Filters & Search */}
        <div className="mt-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Filter stories by topic"
            className="flex flex-wrap items-center gap-1.5"
          >
            {BLOG_TOPICS.map((topic) => {
              const active = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                    active
                      ? "bg-[#171716] text-[#f2efe6] border-[#171716]"
                      : "bg-[#fffdf6] text-[#171716]/80 border-[#171716]/20 hover:border-[#171716]"
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 text-[#171716]/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories..."
              aria-label="Search blog stories"
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[#171716]/20 bg-[#fffdf6] text-sm text-[#171716] placeholder:text-[#171716]/45 outline-none focus:border-[#171716]"
            />
          </div>
        </div>

        {/* Error Notice */}
        {feedError && (
          <div
            role="alert"
            className="mt-8 p-5 rounded-2xl border border-[#d9442e]/35 bg-[#fffdf6] text-sm text-[#171716]"
          >
            {feedError}
          </div>
        )}

        {/* Loading State */}
        {loadingPosts ? (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[0, 1].map((idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#171716]/12 bg-[#fffdf6] p-6 space-y-4 animate-pulse"
              >
                <div className="h-4 w-32 rounded bg-[#171716]/10" />
                <div className="h-7 w-4/5 rounded bg-[#171716]/12" />
                <div className="h-4 w-full rounded bg-[#171716]/8" />
                <div className="h-4 w-2/3 rounded bg-[#171716]/8" />
              </div>
            ))}
          </div>
        ) : visiblePosts.length === 0 ? (
          /* Editorial Empty State */
          <section
            data-testid="blog-empty-state"
            className="mt-10 rounded-2xl border-2 border-[#171716]/15 bg-[#fffdf6] px-6 py-14 sm:px-12 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#f2efe6] border border-[#171716]/15 text-[#171716] grid place-items-center mx-auto mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="font-display text-2xl sm:text-[28px] font-semibold tracking-[-0.02em] text-[#171716] m-0">
              {feedTab === "drafts"
                ? "No drafts saved yet"
                : searchQuery.trim() || selectedTopic !== "All"
                  ? "No matching stories found"
                  : "The first story is on its way"}
            </h2>
            <p className="mt-2.5 max-w-md mx-auto text-[15px] leading-relaxed text-[#171716]/68">
              {feedTab === "drafts"
                ? "Start writing in the Medium-style studio and save drafts privately until they are ready to publish."
                : searchQuery.trim() || selectedTopic !== "All"
                  ? "Try clearing your search or switching back to all topics."
                  : canWrite
                    ? "Open the writing studio to publish your first article with formatted text, quotes, images, links, and attachments."
                    : "Sadman is setting up the journal. New essays on product design, field systems, and photography will appear here as soon as they are published."}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {canWrite ? (
                <button
                  type="button"
                  onClick={startNewStory}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#171716] bg-[#ff5b44] text-sm font-semibold text-[#171716] shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 transition-all"
                >
                  <PenLine className="w-4 h-4" />
                  <span>Write First Story</span>
                </button>
              ) : (searchQuery.trim() || selectedTopic !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTopic("All");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 rounded-xl border border-[#171716] text-sm font-medium text-[#171716] hover:bg-[#171716] hover:text-[#f2efe6] transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </section>
        ) : (
          <div className="mt-10 space-y-10">
            {/* Featured Lead Story */}
            {featuredPost && (() => {
              const featuredCover = sanitizeMediaUrl(featuredPost.coverImage);
              return (
              <article
                data-testid="blog-featured-card"
                onClick={() => openArticle(featuredPost.id)}
                className="group cursor-pointer rounded-2xl border-2 border-[#171716] bg-[#fffdf6] overflow-hidden shadow-[6px_6px_0_#171716] hover:-translate-y-1 hover:shadow-[8px_8px_0_#ff5b44] transition-all duration-200 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]"
              >
                {featuredCover ? (
                  <div className="aspect-[16/10] lg:aspect-auto lg:min-h-[340px] bg-[#e7e2d4] overflow-hidden">
                    <img
                      src={featuredCover}
                      alt={featuredPost.coverAlt || featuredPost.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="min-h-[220px] lg:min-h-[320px] bg-[#171716] text-[#f2efe6] p-8 flex flex-col justify-between">
                    <span className="text-xs font-medium text-[#ff5b44]">
                      Latest Story
                    </span>
                    <p className="font-editorial italic text-2xl sm:text-3xl leading-snug text-[#f2efe6]/90 m-0">
                      “{featuredPost.subtitle || featuredPost.excerpt || featuredPost.title}”
                    </p>
                    <span className="text-xs text-[#f2efe6]/55">
                      {featuredPost.topic}
                    </span>
                  </div>
                )}

                <div className="p-6 sm:p-8 lg:p-9 flex flex-col justify-between gap-6">
                  <div>
                    <p className="text-[13px] text-[#171716]/60 m-0">
                      <span className="font-medium text-[#d9442e]">
                        {featuredPost.topic}
                      </span>
                      {" · "}
                      {formatEditorialDate(
                        featuredPost.publishedAt ?? featuredPost.updatedAt,
                      )}
                      {" · "}
                      <span className="tabular-nums">
                        {featuredPost.readTimeMinutes} min read
                      </span>
                    </p>
                    <h2 className="mt-3 font-display text-[26px] sm:text-[32px] leading-[1.16] tracking-[-0.02em] font-semibold text-[#171716] group-hover:text-[#d9442e] transition-colors m-0">
                      {featuredPost.title}
                    </h2>
                    {(featuredPost.subtitle || featuredPost.excerpt) && (
                      <p className="mt-3 font-editorial text-[17px] leading-[1.65] text-[#171716]/75 line-clamp-3 m-0">
                        {featuredPost.subtitle || featuredPost.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#171716]/10">
                    <span className="text-sm font-medium text-[#171716]">
                      {featuredPost.authorName}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#171716] group-hover:text-[#d9442e] transition-colors">
                      <span>Read story</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </article>
              );
            })()}

            {/* Editorial Story Grid */}
            {listPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {listPosts.map((post) => {
                  const safeCover = sanitizeMediaUrl(post.coverImage);
                  const canManage =
                    Boolean(user) && (isAdmin || post.authorUid === user?.uid);
                  return (
                    <article
                      key={post.id}
                      onClick={() =>
                        post.status === "draft" && canManage
                          ? startEditStory(post)
                          : openArticle(post.id)
                      }
                      className="group cursor-pointer rounded-2xl border-2 border-[#171716] bg-[#fffdf6] overflow-hidden shadow-[5px_5px_0_#171716] hover:-translate-y-1 hover:shadow-[7px_7px_0_#171716] transition-all duration-200 flex flex-col"
                    >
                      {safeCover && (
                        <div className="aspect-[16/9] w-full bg-[#e7e2d4] overflow-hidden border-b-2 border-[#171716]">
                          <img
                            src={safeCover}
                            alt={post.coverAlt || post.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          />
                        </div>
                      )}

                      <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                        <div>
                          <p className="text-[13px] text-[#171716]/58 m-0">
                            <span className="font-medium text-[#d9442e]">
                              {post.status === "draft" ? "Draft" : post.topic}
                            </span>
                            {" · "}
                            {formatEditorialDate(post.publishedAt ?? post.updatedAt)}
                            {" · "}
                            <span className="tabular-nums">
                              {post.readTimeMinutes} min read
                            </span>
                          </p>
                          <h3 className="mt-2.5 font-display text-[22px] sm:text-[24px] leading-[1.22] tracking-[-0.015em] font-semibold text-[#171716] group-hover:text-[#d9442e] transition-colors m-0">
                            {post.title || "Untitled Story"}
                          </h3>
                          {(post.subtitle || post.excerpt) && (
                            <p className="mt-2.5 font-editorial text-[16px] leading-[1.6] text-[#171716]/72 line-clamp-3 m-0">
                              {post.subtitle || post.excerpt}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#171716]/10 text-xs sm:text-sm">
                          <span className="font-medium text-[#171716]/85">
                            {post.authorName}
                          </span>
                          <span className="inline-flex items-center gap-1 font-medium text-[#171716] group-hover:text-[#d9442e] transition-colors">
                            <span>
                              {post.status === "draft" ? "Continue Draft" : "Read"}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {/* Discreet footer sign-in link (no mention of writer accounts or self-signup) */}
        {authReady && !user && (
          <div className="mt-16 pt-6 border-t border-[#171716]/10 flex justify-end">
            <button
              type="button"
              data-testid="blog-discreet-signin-btn"
              onClick={openLoginModal}
              className="text-xs text-[#171716]/35 hover:text-[#171716]/75 transition-colors cursor-pointer"
            >
              Sign in
            </button>
          </div>
        )}
      </div>

      {/* Minimal Sign-In Modal */}
      {loginModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="blog-signin-title"
          data-testid="blog-login-modal"
          className="fixed inset-0 z-50 bg-[#171716]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLoginModal();
          }}
        >
          <div className="bg-[#fffdf6] text-[#171716] border-2 border-[#171716] rounded-2xl shadow-[8px_8px_0_#171716] max-w-md w-full p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <h2
                id="blog-signin-title"
                className="font-display text-2xl font-semibold text-[#171716] m-0"
              >
                Sign In
              </h2>
              <button
                type="button"
                onClick={closeLoginModal}
                aria-label="Close sign-in dialog"
                className="w-9 h-9 rounded-xl border border-[#171716]/20 flex items-center justify-center text-[#171716]/75 hover:border-[#171716] hover:text-[#171716]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-[#171716]/72">
              Sign in with an authorized Google account to continue.
            </p>

            {authError && (
              <div
                role="alert"
                className="mt-4 p-3 rounded-xl border border-[#d9442e]/35 bg-[#ff5b44]/10 text-xs text-[#171716]"
              >
                {authError}
              </div>
            )}

            <button
              type="button"
              data-testid="blog-google-signin-btn"
              disabled={signingIn}
              onClick={() => signInWithGoogle()}
              className="mt-6 w-full inline-flex items-center justify-center gap-3 px-5 py-3 rounded-xl border-2 border-[#171716] bg-[#171716] text-[#f2efe6] text-sm font-medium shadow-[4px_4px_0_#ff5b44] hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12s4.3 9.5 9.5 9.5c5.5 0 9.1-3.8 9.1-9.2 0-.6-.1-1.1-.2-1.6H12z"
                />
              </svg>
              <span>{signingIn ? "Connecting to Google..." : "Continue with Google"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Owner-only Manage Writers & Private Inquiries Modals */}
      {user && isAdmin && (
        <>
          <WritersModal
            isOpen={writersModalOpen}
            adminUid={user.uid}
            writers={writers}
            onClose={() => setWritersModalOpen(false)}
          />
          <InquiriesModal
            isOpen={inquiriesModalOpen}
            inquiries={inquiries}
            onClose={() => setInquiriesModalOpen(false)}
          />
        </>
      )}
    </main>
  );
}
