import { useEffect, useRef, useState, type ReactNode } from "react";
import type { DesignProject, MobileShowcaseBlock } from "../data/portfolio";
import { formatCount, getAdjacentItemId } from "../utils/portfolioLogic";
import { Arrow, ChevronIcon } from "./Characters";

interface DesignCaseStudyViewProps {
  project: DesignProject;
  projects: DesignProject[];
  disableKeyboardNav?: boolean;
  onBack: () => void;
  onSelectProject: (projectId: string) => void;
  onInquire: (topic: "Product Design", note: string) => void;
}

type FullscreenState =
  | {
      mode: "single";
      src: string;
      title: string;
      caption?: string;
      lightBg?: boolean;
    }
  | {
      mode: "gallery";
      index: number;
    }
  | {
      mode: "mobile";
      index: number;
    }
  | null;

const OVERVIEW_METRIC_COLORS = [
  "bg-[#c7ef45]",
  "bg-[#f5d837]",
  "bg-[#ffb5a8]",
  "bg-[#a9beff]",
] as const;

const SECTION_CONTAINER = "max-w-[1120px] mx-auto px-4 sm:px-6 md:px-14 lg:px-20";
const EDITORIAL_CARD_CLASS =
  "rounded-2xl border border-[#171716]/16 bg-[#fffdf6] p-5 md:p-6 shadow-[0_2px_10px_rgba(23,23,22,0.04)]";

function ExpandIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M15 3h6v6" />
      <path d="M9 21H3v-6" />
      <path d="M21 3l-7 7" />
      <path d="M3 21l7-7" />
    </svg>
  );
}

function CloseIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

interface FloatCardProps {
  className?: string;
  children: ReactNode;
  testId?: string;
}

function FloatCard({ className = "", children, testId }: FloatCardProps) {
  const [touched, setTouched] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const clearReleaseTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div
      data-testid={testId}
      data-touched={touched ? "true" : undefined}
      onPointerDown={(event) => {
        if (event.pointerType !== "mouse") {
          clearReleaseTimer();
          setTouched(true);
        }
      }}
      onPointerUp={(event) => {
        if (event.pointerType !== "mouse") {
          clearReleaseTimer();
          timerRef.current = window.setTimeout(() => setTouched(false), 180);
        }
      }}
      onPointerCancel={() => {
        clearReleaseTimer();
        setTouched(false);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") {
          clearReleaseTimer();
          setTouched(false);
        }
      }}
      className={`float-card ${className}`}
    >
      {children}
    </div>
  );
}

interface MobileShowcaseSectionProps {
  showcase: MobileShowcaseBlock;
  onOpenFullscreen: (index: number) => void;
}

function MobileShowcaseSection({
  showcase,
  onOpenFullscreen,
}: MobileShowcaseSectionProps) {
  const stripRef = useRef<HTMLDivElement | null>(null);

  const scrollStrip = (direction: -1 | 1) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 304, behavior: "smooth" });
  };

  return (
    <section
      data-testid="mobile-experience-section"
      className="bg-[#f8f6ef] border-b border-[#171716]/12"
    >
      <div className={`${SECTION_CONTAINER} py-12 md:py-20 flex flex-col gap-7 md:gap-9`}>
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-[30px] sm:text-[36px] md:text-[40px] font-medium tracking-[-0.02em] leading-[1.18] text-balance m-0">
            {showcase.heading}
          </h2>
          <span className="md:hidden text-[15px] font-semibold uppercase tracking-[0.06em] text-[#d9442e] shrink-0 whitespace-nowrap leading-[1.5]">
            Swipe →
          </span>
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              data-testid="mobile-strip-prev"
              onClick={() => scrollStrip(-1)}
              aria-label="Scroll mobile screens left"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-[#171716] bg-[#fffdf6] text-[15px] font-medium text-[#171716] shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 hover:bg-[#171716] hover:text-[#f2efe6] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150"
            >
              <ChevronIcon direction="left" className="w-4 h-4" />
              <span>Prev</span>
            </button>
            <button
              type="button"
              data-testid="mobile-strip-next"
              onClick={() => scrollStrip(1)}
              aria-label="Scroll mobile screens right"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-[#171716] bg-[#fffdf6] text-[15px] font-medium text-[#171716] shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 hover:bg-[#ff5b44] hover:text-[#171716] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150"
            >
              <span>Next</span>
              <ChevronIcon direction="right" className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={stripRef}
          data-testid="mobile-experience-strip"
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pt-2 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 no-scrollbar"
        >
          {showcase.screens.map((screen, idx) => (
            <figure
              key={screen.src}
              className="w-[70vw] max-w-[252px] md:w-[272px] lg:w-[280px] md:max-w-none shrink-0 snap-start m-0 flex flex-col gap-3.5"
            >
              <FloatCard className="overflow-hidden rounded-[22px] md:rounded-[26px] border-2 border-[#171716] bg-white shadow-[4px_4px_0_#171716] md:shadow-[5px_5px_0_#171716]">
                <button
                  type="button"
                  onClick={() => onOpenFullscreen(idx)}
                  aria-label={`View full screen: ${screen.title}`}
                  className="group relative block w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
                >
                  <img
                    src={screen.src}
                    alt={screen.title}
                    width={1260}
                    height={2436}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto aspect-[1260/2436] block"
                  />
                </button>
              </FloatCard>

              <figcaption className="px-0.5 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-[19px] md:text-[19px] font-semibold tracking-[-0.01em] leading-[1.35] text-[#171716] m-0">
                    {screen.title}
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenFullscreen(idx)}
                    aria-label={`Expand ${screen.title}`}
                    className="inline-flex items-center gap-1 text-[14px] font-medium text-[#171716]/55 hover:text-[#d9442e] transition-colors shrink-0 cursor-zoom-in"
                  >
                    <ExpandIcon className="w-3.5 h-3.5" />
                    <span className="md:hidden">Tap</span>
                  </button>
                </div>
                <p className="text-[17px] md:text-[16px] leading-[1.5] md:leading-[1.55] text-[#171716]/72 m-0">
                  {screen.caption}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DesignCaseStudyView({
  project,
  projects,
  disableKeyboardNav = false,
  onBack,
  onSelectProject,
  onInquire,
}: DesignCaseStudyViewProps) {
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState<FullscreenState>(null);

  const prevId = getAdjacentItemId(projects, project.id, "prev");
  const nextId = getAdjacentItemId(projects, project.id, "next");
  const prevProject = projects.find((item) => item.id === prevId) ?? null;
  const nextProject = projects.find((item) => item.id === nextId) ?? null;

  const isRichStudy = Boolean(
    project.overview ||
      project.backgroundMilestones?.length ||
      project.contributions?.length ||
      project.keyDesignAreas?.length,
  );

  const galleryItems = project.contributionGallery ?? [];
  const mobileItems = project.mobileShowcase?.screens ?? [];
  const safeScreenIndex =
    galleryItems.length > 0 ? activeScreenIndex % galleryItems.length : 0;
  const activeMobileScreen = galleryItems[safeScreenIndex] ?? null;

  useEffect(() => {
    setActiveScreenIndex(0);
    setFullscreen(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [project.id]);

  // Lock body scroll while fullscreen image viewer is open
  useEffect(() => {
    if (!fullscreen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [fullscreen]);

  // Keyboard navigation: prioritizes fullscreen viewer when open
  useEffect(() => {
    if (disableKeyboardNav) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (fullscreen) {
        if (event.key === "Escape") {
          event.preventDefault();
          setFullscreen(null);
        } else if (
          fullscreen.mode === "gallery" &&
          galleryItems.length > 1 &&
          event.key === "ArrowLeft"
        ) {
          event.preventDefault();
          const nextIdx =
            (fullscreen.index - 1 + galleryItems.length) % galleryItems.length;
          setFullscreen({ mode: "gallery", index: nextIdx });
          setActiveScreenIndex(nextIdx);
        } else if (
          fullscreen.mode === "gallery" &&
          galleryItems.length > 1 &&
          event.key === "ArrowRight"
        ) {
          event.preventDefault();
          const nextIdx = (fullscreen.index + 1) % galleryItems.length;
          setFullscreen({ mode: "gallery", index: nextIdx });
          setActiveScreenIndex(nextIdx);
        } else if (
          fullscreen.mode === "mobile" &&
          mobileItems.length > 1 &&
          event.key === "ArrowLeft"
        ) {
          event.preventDefault();
          const nextIdx =
            (fullscreen.index - 1 + mobileItems.length) % mobileItems.length;
          setFullscreen({ mode: "mobile", index: nextIdx });
        } else if (
          fullscreen.mode === "mobile" &&
          mobileItems.length > 1 &&
          event.key === "ArrowRight"
        ) {
          event.preventDefault();
          const nextIdx = (fullscreen.index + 1) % mobileItems.length;
          setFullscreen({ mode: "mobile", index: nextIdx });
        }
        return;
      }

      if (event.key === "ArrowLeft" && prevId) {
        onSelectProject(prevId);
      } else if (event.key === "ArrowRight" && nextId) {
        onSelectProject(nextId);
      } else if (event.key === "Escape") {
        onBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    disableKeyboardNav,
    fullscreen,
    galleryItems.length,
    mobileItems.length,
    prevId,
    nextId,
    onSelectProject,
    onBack,
  ]);

  const activeFullscreenImage =
    fullscreen === null
      ? null
      : fullscreen.mode === "single"
        ? fullscreen
        : fullscreen.mode === "gallery"
          ? galleryItems[fullscreen.index]
            ? {
                src: galleryItems[fullscreen.index].src,
                title: galleryItems[fullscreen.index].title,
                caption: undefined,
                lightBg: false,
              }
            : null
          : mobileItems[fullscreen.index]
            ? {
                src: mobileItems[fullscreen.index].src,
                title: mobileItems[fullscreen.index].title,
                caption: mobileItems[fullscreen.index].caption,
                lightBg: false,
              }
            : null;

  const metadataCards = [
    { label: "Role", value: project.role, accent: false },
    { label: "Client", value: project.client, accent: false },
    project.partner
      ? { label: "Partner", value: project.partner, accent: false }
      : { label: "Timeline", value: project.timeline ?? project.year, accent: false },
    project.budget
      ? { label: "Budget", value: project.budget, accent: true }
      : {
          label: "Deliverables",
          value: project.deliverables.join(" · "),
          accent: false,
        },
  ];

  return (
    <main
      data-testid="design-case-study-page"
      className="relative bg-[#f2efe6] text-[#171716] min-h-screen"
    >
      {/* Subtle side chevrons on tablet & desktop */}
      {prevProject && (
        <button
          type="button"
          data-testid="study-prev-chevron"
          onClick={() => onSelectProject(prevProject.id)}
          aria-label={`Previous project: ${prevProject.title}`}
          title={`Previous: ${prevProject.title}`}
          className="hidden md:grid fixed left-2.5 lg:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-[#171716]/20 bg-[#f2efe6]/85 backdrop-blur-sm text-[#171716]/55 place-items-center transition-all duration-150 hover:bg-[#fffdf6] hover:text-[#171716] hover:border-2 hover:border-[#171716] hover:shadow-[3px_3px_0_#171716] hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
        >
          <ChevronIcon direction="left" className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
      )}

      {nextProject && (
        <button
          type="button"
          data-testid="study-next-chevron"
          onClick={() => onSelectProject(nextProject.id)}
          aria-label={`Next project: ${nextProject.title}`}
          title={`Next: ${nextProject.title}`}
          className="hidden md:grid fixed right-2.5 lg:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-[#171716]/20 bg-[#f2efe6]/85 backdrop-blur-sm text-[#171716]/55 place-items-center transition-all duration-150 hover:bg-[#fffdf6] hover:text-[#171716] hover:border-2 hover:border-[#171716] hover:shadow-[3px_3px_0_#171716] hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
        >
          <ChevronIcon direction="right" className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
      )}

      {/* Top Hero Section */}
      <section className="bg-[#f2efe6] border-b-2 border-[#171716]">
        <div className={`${SECTION_CONTAINER} pt-7 pb-12 md:pt-12 md:pb-16`}>
          <div className="max-w-4xl">
            <p className="text-[17px] md:text-[18px] font-medium text-[#d9442e] tabular-nums leading-[1.5] m-0">
              {project.subtitle} · {project.year}
            </p>
            <h1 className="mt-2.5 font-display text-[clamp(36px,4.8vw,60px)] leading-[1.06] tracking-[-0.025em] font-medium text-balance m-0">
              {project.title}
            </h1>
          </div>

          {project.imageFit === "contain" ? (
            <div
              data-testid="study-hero-cover"
              className="mt-7 md:mt-10 w-full bg-[#f2efe6] py-1 md:py-2"
            >
              <button
                type="button"
                onClick={() =>
                  setFullscreen({
                    mode: "single",
                    src: project.image,
                    title: project.title,
                    caption: `${project.subtitle} · ${project.year}`,
                    lightBg: true,
                  })
                }
                aria-label={`View full screen: ${project.title} cover`}
                className="group relative block w-full cursor-zoom-in rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
              >
                <img
                  src={project.image}
                  alt={`${project.title} — ${project.subtitle}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-[560px] object-contain mx-auto block transition-transform duration-200 group-hover:scale-[1.01]"
                />
                <span className="pointer-events-none absolute right-2 bottom-2 md:right-3 md:bottom-3 inline-flex items-center gap-1.5 rounded-lg border-2 border-[#171716] bg-[#fffdf6]/95 px-2.5 py-1.5 text-xs sm:text-sm font-medium text-[#171716] shadow-[2px_2px_0_#171716] opacity-80 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 transition-opacity">
                  <ExpandIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Full screen</span>
                </span>
              </button>
            </div>
          ) : (
            <FloatCard
              testId="study-hero-cover"
              className="mt-7 md:mt-10 overflow-hidden rounded-2xl border-2 border-[#171716] bg-[#ddd] shadow-[5px_5px_0_#171716] md:shadow-[7px_7px_0_#171716] aspect-[16/10] md:aspect-[16/9] max-h-[540px] w-full"
            >
              <button
                type="button"
                onClick={() =>
                  setFullscreen({
                    mode: "single",
                    src: project.image,
                    title: project.title,
                    caption: `${project.subtitle} · ${project.year}`,
                  })
                }
                aria-label={`View full screen: ${project.title} cover`}
                className="group relative block w-full h-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
              >
                <img
                  src={project.image}
                  alt={`${project.title} — ${project.subtitle}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-lg border-2 border-[#171716] bg-[#fffdf6]/95 px-2.5 py-1.5 text-xs sm:text-sm font-medium text-[#171716] shadow-[2px_2px_0_#171716] opacity-85 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 transition-opacity">
                  <ExpandIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Full screen</span>
                </span>
              </button>
            </FloatCard>
          )}

          {/* Boxed Project Info Cards — 2x2 on mobile/tablet, 4-col on desktop */}
          <dl
            data-testid="study-metadata-boxes"
            className="mt-7 md:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-5"
          >
            {metadataCards.map((item) => (
              <FloatCard
                key={item.label}
                className={`rounded-xl md:rounded-2xl border-2 border-[#171716] p-4 sm:p-5 md:p-5.5 shadow-[3px_3px_0_#171716] ${
                  item.accent ? "bg-[#f5d837]" : "bg-[#fffdf6]"
                }`}
              >
                <dt
                  className={`text-[15px] md:text-[13px] font-semibold uppercase tracking-[0.07em] leading-[1.4] ${
                    item.accent ? "text-[#171716]/75" : "text-[#d9442e]"
                  }`}
                >
                  {item.label}
                </dt>
                <dd className="mt-2 text-[17px] sm:text-[18px] md:text-[18px] leading-[1.45] font-semibold text-[#171716] tabular-nums m-0">
                  {item.value}
                </dd>
              </FloatCard>
            ))}
          </dl>

          {/* Live Platform URL placed directly after cover & 4 metadata boxes */}
          {project.liveUrl && (
            <FloatCard className="mt-5 md:mt-6 rounded-xl md:rounded-2xl border-2 border-[#171716] bg-[#fffdf6] px-5 py-4 md:px-6 md:py-5 shadow-[3px_3px_0_#171716] flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
              <div className="min-w-0">
                <p className="text-[15px] md:text-[13px] font-semibold uppercase tracking-[0.07em] leading-[1.4] text-[#d9442e] m-0">
                  Live Platform
                </p>
                <p className="mt-1 text-[18px] md:text-[18px] leading-[1.5] font-medium text-[#171716]/85 truncate m-0">
                  {project.liveUrl.replace(/^https?:\/\//, "")}
                </p>
              </div>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="study-live-url"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-xl border-2 border-[#171716] bg-[#c7ef45] text-[#171716] text-[17px] md:text-[17px] leading-[1.4] font-semibold shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 hover:bg-[#ff5b44] hover:shadow-[4px_5px_0_#171716] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-150 whitespace-nowrap shrink-0 self-start sm:self-center"
              >
                <span>Visit {project.liveUrlLabel ?? "Live Site"}</span>
                <Arrow className="w-4 h-4 -rotate-45" />
              </a>
            </FloatCard>
          )}
        </div>
      </section>

      {isRichStudy ? (
        <>
          {/* Project Overview + Full-Width Dashboard Portal + Editorial Quote + 4-Color Metrics */}
          <section
            data-testid="project-overview-section"
            className="bg-[#f8f6ef] border-b border-[#171716]/12"
          >
            <div className={`${SECTION_CONTAINER} py-12 md:py-20 flex flex-col gap-8 md:gap-11`}>
              <div className="w-full flex flex-col gap-3.5">
                <h2 className="font-display text-[30px] sm:text-[36px] md:text-[40px] font-medium tracking-[-0.02em] leading-[1.18] text-balance m-0">
                  Project Overview
                </h2>
                {project.overview && (
                  <p
                    data-testid="overview-details-text"
                    className="w-full text-[18px] sm:text-[19px] md:text-[19px] leading-[1.95] md:leading-[1.78] text-[#171716]/72 m-0"
                  >
                    {project.overview}
                  </p>
                )}
              </div>

              {project.overviewVisual && (
                <figure
                  data-testid="overview-portal-figure"
                  className="m-0 w-full space-y-3.5 md:space-y-4"
                >
                  <FloatCard className="overflow-hidden rounded-xl md:rounded-2xl border-2 border-[#171716] shadow-[5px_5px_0_#171716] md:shadow-[7px_7px_0_#171716] bg-[#1a3353]">
                    <button
                      type="button"
                      data-testid="overview-portal-open-btn"
                      onClick={() =>
                        setFullscreen({
                          mode: "single",
                          src: project.overviewVisual!.src,
                          title: project.overviewVisual!.title,
                        })
                      }
                      aria-label={`View full screen: ${project.overviewVisual.title}`}
                      className="group relative block w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
                    >
                      <img
                        src={project.overviewVisual.src}
                        alt={project.overviewVisual.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-auto block"
                      />
                      <span className="pointer-events-none absolute right-2.5 bottom-2.5 md:right-4 md:bottom-4 inline-flex items-center gap-1.5 rounded-lg border-2 border-[#171716] bg-[#fffdf6]/95 px-2.5 py-1.5 text-[14px] font-medium text-[#171716] shadow-[2px_2px_0_#171716] opacity-85 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 transition-opacity">
                        <ExpandIcon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Full screen</span>
                      </span>
                    </button>
                  </FloatCard>
                  <figcaption>
                    <p className="font-display text-[20px] md:text-[21px] font-semibold leading-[1.4] text-[#171716] m-0">
                      {project.overviewVisual.title}
                    </p>
                  </figcaption>
                </figure>
              )}

              {project.quote && (
                <blockquote
                  data-testid="overview-quote"
                  className="w-full border-t border-b border-[#171716]/12 py-6 md:py-8 m-0"
                >
                  <p className="w-full font-display text-[21px] sm:text-[24px] md:text-[26px] font-normal leading-[1.7] md:leading-[1.5] tracking-[-0.015em] text-[#171716] m-0">
                    “{project.quote}”
                  </p>
                </blockquote>
              )}

              {project.metrics && project.metrics.length > 0 && (
                <div
                  data-testid="overview-metrics-grid"
                  className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-5"
                >
                  {project.metrics.map((metric, idx) => (
                    <FloatCard
                      key={metric.label}
                      className={`rounded-xl md:rounded-2xl border-2 border-[#171716] p-4 sm:p-5 md:p-6 shadow-[3px_3px_0_#171716] md:shadow-[4px_4px_0_#171716] ${
                        OVERVIEW_METRIC_COLORS[idx % OVERVIEW_METRIC_COLORS.length]
                      }`}
                    >
                      <p className="font-display text-[34px] sm:text-4xl md:text-[42px] font-semibold tracking-[-0.02em] tabular-nums text-[#171716] leading-none m-0">
                        {metric.value}
                      </p>
                      <p className="mt-2.5 md:mt-3 text-[17px] md:text-[16px] leading-[1.5] text-[#171716]/80 m-0">
                        {metric.label}
                      </p>
                    </FloatCard>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Background */}
          {project.backgroundMilestones && project.backgroundMilestones.length > 0 && (
            <section
              data-testid="background-section"
              className="bg-[#f2efe6] border-b border-[#171716]/12"
            >
              <div className={`${SECTION_CONTAINER} py-12 md:py-20 flex flex-col gap-7 md:gap-9`}>
                <div className="flex items-end justify-between gap-4">
                  <div className="flex flex-col gap-2.5 max-w-2xl">
                    <h2 className="font-display text-[30px] sm:text-[36px] md:text-[40px] font-medium tracking-[-0.02em] leading-[1.18] text-balance m-0">
                      Background
                    </h2>
                    {project.backgroundIntro && (
                      <p className="text-[18px] md:text-[18px] leading-[1.6] md:leading-[1.65] text-[#171716]/72 m-0">
                        {project.backgroundIntro}
                      </p>
                    )}
                  </div>
                  <span className="md:hidden text-[15px] font-semibold uppercase tracking-[0.06em] leading-[1.5] text-[#d9442e] shrink-0 whitespace-nowrap">
                    Swipe →
                  </span>
                </div>

                {/* Horizontal snap-scroll cards on mobile, 2/4-col grid on tablet & desktop */}
                <div
                  data-testid="background-cards-strip"
                  className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pt-2 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 no-scrollbar md:mx-0 md:px-0 md:pt-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-5"
                >
                  {project.backgroundMilestones.map((item) => (
                    <FloatCard
                      key={item.tag}
                      className={`w-[82vw] max-w-[310px] shrink-0 snap-start md:w-auto md:max-w-none ${EDITORIAL_CARD_CLASS}`}
                    >
                      <p className="text-[15px] md:text-[14px] font-semibold leading-[1.4] tabular-nums text-[#d9442e] m-0">
                        {item.tag}
                      </p>
                      <h3 className="mt-2 font-display text-[21px] md:text-[21px] font-semibold tracking-[-0.015em] leading-[1.32] m-0">
                        {item.title}
                      </h3>
                      <p className="mt-2.5 text-[18px] md:text-[16.5px] leading-[1.6] md:leading-[1.65] text-[#171716]/72 m-0">
                        {item.detail}
                      </p>
                    </FloatCard>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* The Challenge + Initial Architecture Planning Sketch */}
          {project.challengePoints && project.challengePoints.length > 0 && (
            <section
              data-testid="challenge-section"
              className="bg-[#f8f6ef] border-b border-[#171716]/12"
            >
              <div className={`${SECTION_CONTAINER} py-12 md:py-20 flex flex-col gap-7 md:gap-10`}>
                <div className="flex items-end justify-between gap-4">
                  <div className="flex flex-col gap-2.5 max-w-2xl">
                    <h2 className="font-display text-[30px] sm:text-[36px] md:text-[40px] font-medium tracking-[-0.02em] leading-[1.18] text-balance m-0">
                      The Challenge
                    </h2>
                    {project.challengeIntro && (
                      <p className="text-[18px] md:text-[18px] leading-[1.6] md:leading-[1.65] text-[#171716]/72 m-0">
                        {project.challengeIntro}
                      </p>
                    )}
                  </div>
                  <span className="md:hidden text-[15px] font-semibold uppercase tracking-[0.06em] leading-[1.5] text-[#d9442e] shrink-0 whitespace-nowrap">
                    Swipe →
                  </span>
                </div>

                {/* Horizontal snap-scroll cards on mobile, 3-col grid on tablet & desktop */}
                <div
                  data-testid="challenge-cards-strip"
                  className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pt-2 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 no-scrollbar md:mx-0 md:px-0 md:pt-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-3 md:gap-5"
                >
                  {project.challengePoints.map((point) => (
                    <FloatCard
                      key={point.title}
                      className={`w-[82vw] max-w-[310px] shrink-0 snap-start md:w-auto md:max-w-none ${EDITORIAL_CARD_CLASS}`}
                    >
                      <h3 className="font-display text-[21px] md:text-[21px] font-semibold tracking-[-0.015em] leading-[1.32] m-0">
                        {point.title}
                      </h3>
                      <p className="mt-2.5 text-[18px] md:text-[16.5px] leading-[1.6] md:leading-[1.65] text-[#171716]/72 m-0">
                        {point.detail}
                      </p>
                    </FloatCard>
                  ))}
                </div>

                {/* Initial Architecture Planning Sketch — Full-width aligned */}
                {project.challengeVisual && (
                  <figure
                    data-testid="challenge-architecture-figure"
                    className="m-0 pt-2 md:pt-3 w-full space-y-3.5 md:space-y-4"
                  >
                    <FloatCard className="overflow-hidden rounded-xl md:rounded-2xl border-2 border-[#171716] bg-[#f7f7f7] p-2 sm:p-3 md:p-5 shadow-[4px_4px_0_#171716] md:shadow-[6px_6px_0_#171716]">
                      <button
                        type="button"
                        data-testid="challenge-architecture-open-btn"
                        onClick={() =>
                          setFullscreen({
                            mode: "single",
                            src: project.challengeVisual!.src,
                            title: project.challengeVisual!.title,
                            caption: project.challengeVisual!.caption,
                            lightBg: true,
                          })
                        }
                        aria-label={`View full screen: ${project.challengeVisual.title}`}
                        className="group relative block w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
                      >
                        <img
                          src={project.challengeVisual.src}
                          alt={project.challengeVisual.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-auto block rounded-lg"
                        />
                      </button>
                    </FloatCard>

                    <figcaption className="flex flex-col gap-1.5 w-full">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-display text-[20px] md:text-[21px] font-semibold leading-[1.4] text-[#171716] m-0">
                          {project.challengeVisual.title}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setFullscreen({
                              mode: "single",
                              src: project.challengeVisual!.src,
                              title: project.challengeVisual!.title,
                              caption: project.challengeVisual!.caption,
                              lightBg: true,
                            })
                          }
                          aria-label={`Expand ${project.challengeVisual.title}`}
                          className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#171716]/60 hover:text-[#d9442e] transition-colors shrink-0 cursor-zoom-in"
                        >
                          <ExpandIcon className="w-3.5 h-3.5" />
                          <span>Full screen</span>
                        </button>
                      </div>
                      <p className="max-w-2xl text-[17px] md:text-[17px] leading-[1.6] md:leading-[1.65] text-[#171716]/72 m-0">
                        {project.challengeVisual.caption}
                      </p>
                    </figcaption>
                  </figure>
                )}
              </div>
            </section>
          )}

          {/* My Contribution + Full-Width Selected Interfaces Gallery */}
          {project.contributions && project.contributions.length > 0 && (
            <section
              data-testid="contributions-section"
              className="bg-[#f2efe6] border-b border-[#171716]/12"
            >
              <div className={`${SECTION_CONTAINER} py-12 md:py-20 flex flex-col gap-8 md:gap-11`}>
                <div className="flex flex-col gap-2.5 max-w-2xl">
                  <h2 className="font-display text-[30px] sm:text-[36px] md:text-[40px] font-medium tracking-[-0.02em] leading-[1.18] text-balance m-0">
                    My Contribution
                  </h2>
                  {project.contributionsIntro && (
                    <p className="text-[18px] md:text-[18px] leading-[1.6] md:leading-[1.65] text-[#171716]/72 m-0">
                      {project.contributionsIntro}
                    </p>
                  )}
                </div>

                {/* Full-Width Horizontal UI Showcase — Aligned flush with section title & grid (Headings only) */}
                {galleryItems.length > 0 && activeMobileScreen && (
                  <div
                    data-testid="contribution-interface-gallery"
                    className="w-full space-y-5 md:space-y-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-display text-[22px] md:text-[25px] font-medium tracking-[-0.015em] leading-snug m-0">
                        Selected Interfaces &amp; IMIS Integration
                      </h3>

                      <div className="flex items-center gap-2.5">
                        <span
                          data-testid="screen-counter"
                          className="text-sm md:text-[15px] font-medium tabular-nums text-[#171716]/65 mr-1 whitespace-nowrap"
                        >
                          {formatCount(safeScreenIndex + 1)} / {formatCount(galleryItems.length)}
                        </span>
                        <button
                          type="button"
                          data-testid="interface-prev-btn"
                          onClick={() =>
                            setActiveScreenIndex(
                              (prev) => (prev - 1 + galleryItems.length) % galleryItems.length,
                            )
                          }
                          aria-label="Previous interface screen"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-[#171716] bg-[#fffdf6] text-[15px] font-medium text-[#171716] shadow-[2px_2px_0_#171716] md:shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 hover:bg-[#171716] hover:text-[#f2efe6] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150"
                        >
                          <ChevronIcon direction="left" className="w-4 h-4" />
                          <span>Prev</span>
                        </button>
                        <button
                          type="button"
                          data-testid="interface-next-btn"
                          onClick={() =>
                            setActiveScreenIndex((prev) => (prev + 1) % galleryItems.length)
                          }
                          aria-label="Next interface screen"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-[#171716] bg-[#fffdf6] text-[15px] font-medium text-[#171716] shadow-[2px_2px_0_#171716] md:shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 hover:bg-[#ff5b44] hover:text-[#171716] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150"
                        >
                          <span>Next</span>
                          <ChevronIcon direction="right" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Full-width clickable active UI screenshot (Heading only) */}
                    <figure
                      data-testid="active-interface-figure"
                      className="m-0 space-y-3.5 md:space-y-4"
                    >
                      <FloatCard className="overflow-hidden rounded-xl md:rounded-2xl border-2 border-[#171716] shadow-[5px_5px_0_#171716] md:shadow-[6px_6px_0_#171716] bg-[#1a3353]">
                        <button
                          type="button"
                          data-testid="active-interface-open-btn"
                          onClick={() =>
                            setFullscreen({ mode: "gallery", index: safeScreenIndex })
                          }
                          aria-label={`View full screen: ${activeMobileScreen.title}`}
                          className="group relative block w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
                        >
                          <img
                            src={activeMobileScreen.src}
                            alt={activeMobileScreen.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-auto block"
                          />
                          <span className="pointer-events-none absolute right-2.5 bottom-2.5 md:right-4 md:bottom-4 inline-flex items-center gap-1.5 rounded-lg border-2 border-[#171716] bg-[#fffdf6]/95 px-2.5 py-1.5 text-xs sm:text-sm font-medium text-[#171716] shadow-[2px_2px_0_#171716] opacity-85 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 transition-opacity">
                            <ExpandIcon className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Full screen</span>
                          </span>
                        </button>
                      </FloatCard>

                      <figcaption>
                        <p className="font-display text-[20px] md:text-[21px] font-semibold tracking-[-0.015em] leading-[1.4] text-[#171716] m-0">
                          {activeMobileScreen.title}
                        </p>
                      </figcaption>
                    </figure>

                    {/* Horizontal screen selector strip */}
                    <div
                      className="flex overflow-x-auto snap-x snap-mandatory gap-2.5 pt-1 pb-1 no-scrollbar md:grid md:grid-flow-col md:auto-cols-fr md:gap-3 md:overflow-visible md:pb-0"
                      role="tablist"
                      aria-label="Select interface screenshot"
                    >
                      {galleryItems.map((screen, idx) => {
                        const isSelected = idx === safeScreenIndex;
                        return (
                          <button
                            key={screen.src}
                            type="button"
                            role="tab"
                            aria-selected={isSelected}
                            aria-label={`View screen ${idx + 1}: ${screen.title}`}
                            onClick={() => setActiveScreenIndex(idx)}
                            className={`group w-[24vw] max-w-[98px] shrink-0 snap-start md:w-auto md:max-w-none min-w-0 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5b44] ${
                              isSelected ? "opacity-100" : "opacity-65 hover:opacity-100"
                            }`}
                          >
                            <div
                              className={`overflow-hidden rounded-lg md:rounded-xl border-2 aspect-[16/9] transition-all duration-150 ${
                                isSelected
                                  ? "border-[#ff5b44] shadow-[2px_2px_0_#171716] md:shadow-[3px_3px_0_#171716] -translate-y-0.5"
                                  : "border-[#171716]/35 group-hover:border-[#171716] group-hover:-translate-y-0.5 group-active:-translate-y-0.5"
                              }`}
                            >
                              <img
                                src={screen.src}
                                alt=""
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover object-top"
                              />
                            </div>
                            <span
                              className={`hidden md:block mt-2 text-[13px] font-medium truncate transition-colors ${
                                isSelected ? "text-[#d9442e]" : "text-[#171716]/70"
                              }`}
                            >
                              {screen.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Contribution Detail Cards — Sleek low-chrome grid that floats on hover/touch */}
                <div className="pt-2 md:pt-4 space-y-3 md:space-y-0">
                  <div className="flex items-center justify-between md:hidden">
                    <p className="text-[15px] font-semibold uppercase tracking-[0.07em] leading-[1.5] text-[#171716]/70 m-0">
                      Key Areas Delivered
                    </p>
                    <span className="text-[15px] font-semibold uppercase tracking-[0.06em] leading-[1.5] text-[#d9442e] shrink-0 whitespace-nowrap">
                      Swipe →
                    </span>
                  </div>

                  <div
                    data-testid="contributions-cards-strip"
                    className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pt-1 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 no-scrollbar md:mx-0 md:px-0 md:pt-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5"
                  >
                    {project.contributions.map((item) => (
                      <FloatCard
                        key={item.title}
                        className={`w-[86vw] max-w-[338px] shrink-0 snap-start md:w-auto md:max-w-none ${EDITORIAL_CARD_CLASS}`}
                      >
                        <h3 className="font-display text-[21px] md:text-[21px] font-semibold tracking-[-0.015em] leading-[1.35] m-0">
                          {item.title}
                        </h3>
                        <p className="mt-2.5 text-[18px] md:text-[16.5px] leading-[1.9] md:leading-[1.68] text-[#171716]/72 m-0">
                          {item.detail}
                        </p>
                      </FloatCard>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Dedicated Unified Mobile Experience Section */}
          {project.mobileShowcase && project.mobileShowcase.screens.length > 0 && (
            <MobileShowcaseSection
              showcase={project.mobileShowcase}
              onOpenFullscreen={(index) => setFullscreen({ mode: "mobile", index })}
            />
          )}

          {/* Design Process */}
          {project.processSteps && project.processSteps.length > 0 && (
            <section
              data-testid="design-process-section"
              className="bg-[#f2efe6] border-b border-[#171716]/12"
            >
              <div className={`${SECTION_CONTAINER} py-12 md:py-20 flex flex-col gap-7 md:gap-10`}>
                <h2 className="font-display text-[30px] sm:text-[36px] md:text-[40px] font-medium tracking-[-0.02em] leading-[1.18] text-balance m-0">
                  Design Process
                </h2>

                {project.processVisual && (
                  <figure
                    data-testid="design-process-figure"
                    className="m-0 w-full space-y-3.5 md:space-y-4"
                  >
                    <FloatCard className="overflow-hidden rounded-xl md:rounded-2xl border-2 border-[#171716] bg-white p-2 sm:p-3 md:p-5 shadow-[4px_4px_0_#171716] md:shadow-[6px_6px_0_#171716]">
                      <button
                        type="button"
                        data-testid="design-process-open-btn"
                        onClick={() =>
                          setFullscreen({
                            mode: "single",
                            src: project.processVisual!.src,
                            title: project.processVisual!.title,
                            caption: project.processVisual!.caption,
                            lightBg: true,
                          })
                        }
                        aria-label={`View full screen: ${project.processVisual.title}`}
                        className="group relative block w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
                      >
                        <img
                          src={project.processVisual.src}
                          alt={project.processVisual.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-auto block rounded-lg"
                        />
                      </button>
                    </FloatCard>

                    <figcaption className="flex flex-col gap-1.5 w-full">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-display text-[20px] md:text-[21px] font-semibold leading-[1.4] text-[#171716] m-0">
                          {project.processVisual.title}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setFullscreen({
                              mode: "single",
                              src: project.processVisual!.src,
                              title: project.processVisual!.title,
                              caption: project.processVisual!.caption,
                              lightBg: true,
                            })
                          }
                          aria-label={`Expand ${project.processVisual.title}`}
                          className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#171716]/60 hover:text-[#d9442e] transition-colors shrink-0 cursor-zoom-in"
                        >
                          <ExpandIcon className="w-3.5 h-3.5" />
                          <span>Full screen</span>
                        </button>
                      </div>
                    </figcaption>
                  </figure>
                )}

                <div className="space-y-3 md:space-y-0">
                  <div className="flex items-center justify-between md:hidden">
                    <p className="text-[15px] font-semibold uppercase tracking-[0.07em] leading-[1.5] text-[#171716]/70 m-0">
                      Workflow Stages
                    </p>
                    <span className="text-[15px] font-semibold uppercase tracking-[0.06em] leading-[1.5] text-[#d9442e] shrink-0 whitespace-nowrap">
                      Swipe →
                    </span>
                  </div>

                  <div
                    data-testid="design-process-cards-strip"
                    className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pt-2 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 no-scrollbar md:mx-0 md:px-0 md:pt-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-5"
                  >
                    {project.processSteps.map((step) => (
                      <FloatCard
                        key={step.phase}
                        className={`w-[84vw] max-w-[328px] shrink-0 snap-start md:w-auto md:max-w-none ${EDITORIAL_CARD_CLASS}`}
                      >
                        <p className="text-[15px] md:text-[14px] font-semibold leading-[1.4] text-[#d9442e] m-0">
                          {step.phase}
                        </p>
                        <h3 className="mt-2 font-display text-[21px] md:text-[21px] font-semibold tracking-[-0.015em] leading-[1.35] m-0">
                          {step.title}
                        </h3>
                        <p className="mt-2.5 text-[18px] md:text-[16.5px] leading-[1.9] md:leading-[1.68] text-[#171716]/72 m-0">
                          {step.detail}
                        </p>
                      </FloatCard>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Key Design Areas + Full-Width Multi-Module System Visual */}
          {project.keyDesignAreas && project.keyDesignAreas.length > 0 && (
            <section
              data-testid="key-design-areas-section"
              className="bg-[#f8f6ef] border-b border-[#171716]/12"
            >
              <div className={`${SECTION_CONTAINER} py-12 md:py-20 flex flex-col gap-7 md:gap-10`}>
                <div className="flex items-end justify-between gap-4">
                  <h2 className="font-display text-[30px] sm:text-[36px] md:text-[40px] font-medium tracking-[-0.02em] leading-[1.18] text-balance m-0">
                    Key Design Areas
                  </h2>
                  <span className="md:hidden text-[15px] font-semibold uppercase tracking-[0.06em] leading-[1.5] text-[#d9442e] shrink-0 whitespace-nowrap">
                    Swipe →
                  </span>
                </div>

                {/* Horizontal snap-scroll cards on mobile, sleek 2/4-col editorial grid on desktop */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pt-2 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 no-scrollbar md:mx-0 md:px-0 md:pt-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-5">
                  {project.keyDesignAreas.map((area) => (
                    <FloatCard
                      key={area.title}
                      className={`w-[86vw] max-w-[338px] shrink-0 snap-start md:w-auto md:max-w-none ${EDITORIAL_CARD_CLASS}`}
                    >
                      <h3 className="font-display text-[21px] md:text-[21px] font-semibold tracking-[-0.015em] leading-[1.35] m-0">
                        {area.title}
                      </h3>
                      <p className="mt-2.5 text-[18px] md:text-[16.5px] leading-[1.9] md:leading-[1.68] text-[#171716]/72 m-0">
                        {area.detail}
                      </p>
                    </FloatCard>
                  ))}
                </div>

                {project.keyDesignAreasVisual && (
                  <figure
                    data-testid="key-design-areas-figure"
                    className="m-0 pt-2 md:pt-4 w-full"
                  >
                    <button
                      type="button"
                      data-testid="key-areas-open-btn"
                      onClick={() =>
                        setFullscreen({
                          mode: "single",
                          src: project.keyDesignAreasVisual!.src,
                          title: project.keyDesignAreasVisual!.title,
                          caption: project.keyDesignAreasVisual!.caption,
                          lightBg: true,
                        })
                      }
                      aria-label={`View full screen: ${project.keyDesignAreasVisual.title}`}
                      className="group relative block w-full cursor-zoom-in rounded-2xl bg-[#f2efe6] p-3 sm:p-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
                    >
                      <img
                        src={project.keyDesignAreasVisual.src}
                        alt={project.keyDesignAreasVisual.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-auto max-h-[560px] object-contain mx-auto block transition-transform duration-200 group-hover:scale-[1.01]"
                      />
                      <span className="pointer-events-none absolute right-3 bottom-3 md:right-4 md:bottom-4 inline-flex items-center gap-1.5 rounded-lg border-2 border-[#171716] bg-[#fffdf6]/95 px-2.5 py-1.5 text-[13px] font-medium text-[#171716] shadow-[2px_2px_0_#171716] opacity-80 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 transition-opacity">
                        <ExpandIcon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Full screen</span>
                      </span>
                    </button>
                    <figcaption className="mt-4 pt-4 border-t border-[#171716]/12 flex flex-col gap-1.5 max-w-2xl">
                      <p className="font-display text-[20px] md:text-[21px] font-semibold leading-[1.4] text-[#d9442e] m-0">
                        {project.keyDesignAreasVisual.title}
                      </p>
                      <p className="text-[17px] md:text-[17px] leading-[1.7] md:leading-[1.68] text-[#171716]/72 m-0">
                        {project.keyDesignAreasVisual.caption}
                      </p>
                    </figcaption>
                  </figure>
                )}
              </div>
            </section>
          )}

          {/* From Old System to Upscaled Product */}
          {project.beforeAfter && project.beforeAfter.length > 0 && (
            <section
              data-testid="before-after-section"
              className="bg-[#f2efe6] border-b border-[#171716]/12"
            >
              <div className={`${SECTION_CONTAINER} py-12 md:py-20 flex flex-col gap-7 md:gap-9`}>
                <h2 className="font-display text-[30px] sm:text-[36px] md:text-[40px] font-medium tracking-[-0.02em] leading-[1.18] text-balance m-0">
                  From Old System to Upscaled Product
                </h2>

                <FloatCard className="overflow-hidden rounded-2xl border-2 border-[#171716] bg-[#fffdf6] shadow-[4px_4px_0_#171716]">
                  <div className="grid grid-cols-2 border-b-2 border-[#171716] bg-[#171716] text-[#f2efe6] text-[15px] md:text-[14px] font-semibold uppercase tracking-[0.08em] leading-[1.5]">
                    <div className="px-4 py-3.5 md:px-7 md:py-4 border-r border-[#f2efe6]/20">
                      Before
                    </div>
                    <div className="px-4 py-3.5 md:px-7 md:py-4 text-[#c7ef45]">
                      After
                    </div>
                  </div>
                  <div className="divide-y divide-[#171716]/12">
                    {project.beforeAfter.map((row) => (
                      <div
                        key={row.before}
                        className="grid grid-cols-2 text-[17px] sm:text-[18px] md:text-[17px]"
                      >
                        <div className="px-4 py-4 md:px-7 md:py-5 border-r border-[#171716]/12 text-[#171716]/72 leading-[1.5] md:leading-[1.65]">
                          {row.before}
                        </div>
                        <div className="px-4 py-4 md:px-7 md:py-5 font-medium text-[#171716] leading-[1.5] md:leading-[1.65] bg-[#c7ef45]/15">
                          {row.after}
                        </div>
                      </div>
                    ))}
                  </div>
                </FloatCard>
              </div>
            </section>
          )}

          {/* Project Scale & Outcomes + Calm Editorial Reflection */}
          <section
            data-testid="scale-outcomes-section"
            className="bg-[#f8f6ef] border-b border-[#171716]/12"
          >
            <div className={`${SECTION_CONTAINER} py-12 md:py-20 flex flex-col gap-8 md:gap-11`}>
              <div className="flex flex-col gap-2.5 max-w-2xl">
                <h2 className="font-display text-[30px] sm:text-[36px] md:text-[40px] font-medium tracking-[-0.02em] leading-[1.18] text-balance m-0">
                  Project Scale &amp; Outcomes
                </h2>
                {project.scaleIntro && (
                  <p className="text-[18px] md:text-[18px] leading-[1.6] md:leading-[1.65] text-[#171716]/72 m-0">
                    {project.scaleIntro}
                  </p>
                )}
              </div>

              {project.scaleMetrics && project.scaleMetrics.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-5">
                  {project.scaleMetrics.map((metric, idx) => (
                    <FloatCard
                      key={metric.label}
                      className={`rounded-xl md:rounded-2xl border-2 border-[#171716] p-4 sm:p-5 md:p-6 shadow-[3px_3px_0_#171716] md:shadow-[4px_4px_0_#171716] ${
                        OVERVIEW_METRIC_COLORS[idx % OVERVIEW_METRIC_COLORS.length]
                      }`}
                    >
                      <p className="font-display text-[34px] sm:text-4xl md:text-[42px] font-semibold tracking-[-0.02em] tabular-nums text-[#171716] leading-none m-0">
                        {metric.value}
                      </p>
                      <p className="mt-2.5 md:mt-3 text-[17px] md:text-[16px] leading-[1.5] text-[#171716]/80 m-0">
                        {metric.label}
                      </p>
                    </FloatCard>
                  ))}
                </div>
              )}

              {/* Calm, easy-on-the-eyes Reflection Panel */}
              <FloatCard
                testId="reflection-section"
                className="rounded-2xl border border-[#171716]/16 bg-[#fffdf6] p-6 sm:p-8 md:p-11 shadow-[0_2px_12px_rgba(23,23,22,0.04)]"
              >
                <div className="max-w-[64ch]">
                  <p className="text-[15px] md:text-[14px] font-semibold uppercase tracking-[0.08em] leading-[1.4] text-[#d9442e] m-0">
                    Reflection
                  </p>
                  {project.reflection && (
                    <p className="mt-4 md:mt-5 font-display text-[20px] sm:text-[22px] md:text-[24px] font-normal leading-[1.9] md:leading-[1.68] tracking-[-0.01em] text-[#171716]/88 m-0">
                      {project.reflection}
                    </p>
                  )}
                </div>

                <div className="mt-7 pt-7 md:mt-9 md:pt-8 border-t border-[#171716]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <p className="text-[17px] md:text-[17px] leading-[1.5] md:leading-[1.6] text-[#171716]/70 m-0">
                    Explore the live platform or get in touch about similar product systems.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-[#171716] bg-[#f2efe6] text-[#171716] text-[16px] md:text-[16px] leading-[1.4] font-medium shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 hover:bg-[#171716] hover:text-[#f2efe6] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-150 whitespace-nowrap"
                      >
                        Visit sanboard.gov.bd <Arrow className="w-4 h-4 -rotate-45" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        onInquire(
                          "Product Design",
                          `Hi Sadman — I read your case study for ${project.title} and would love to discuss a similar product project.`,
                        )
                      }
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-[#171716] bg-[#171716] text-[#f2efe6] text-[16px] md:text-[16px] leading-[1.4] font-medium shadow-[3px_3px_0_#ff5b44] hover:-translate-y-0.5 hover:bg-[#ff5b44] hover:text-[#171716] hover:shadow-[3px_3px_0_#171716] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-150 whitespace-nowrap"
                    >
                      Inquire About Similar Work <Arrow className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </FloatCard>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Standard Case Study Layout (Pico, Oral Lab, After Eight) */}
          {project.metrics && project.metrics.length > 0 && (
            <section className="bg-[#f8f6ef] border-b border-[#171716]/12">
              <div className={`${SECTION_CONTAINER} py-12 md:py-16`}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 md:gap-5">
                  {project.metrics.map((metric, idx) => (
                    <FloatCard
                      key={metric.label}
                      className={`rounded-xl md:rounded-2xl border-2 border-[#171716] p-5 md:p-6 shadow-[3px_3px_0_#171716] md:shadow-[4px_4px_0_#171716] ${
                        OVERVIEW_METRIC_COLORS[idx % OVERVIEW_METRIC_COLORS.length]
                      } ${idx === 0 ? "col-span-2 md:col-span-1" : ""}`}
                    >
                      <p className="font-display text-[34px] sm:text-4xl md:text-[42px] font-semibold tracking-[-0.02em] tabular-nums leading-none m-0">
                        {metric.value}
                      </p>
                      <p className="mt-2.5 text-[17px] md:text-[16px] leading-[1.5] text-[#171716]/80 m-0">
                        {metric.label}
                      </p>
                    </FloatCard>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Challenge & Research Insights */}
          <section className="bg-[#f2efe6] border-b border-[#171716]/12">
            <div className={`${SECTION_CONTAINER} py-12 md:py-20 flex flex-col gap-7 md:gap-9`}>
              <div className="flex flex-col gap-3 max-w-[64ch]">
                <h2 className="font-display text-[30px] sm:text-[36px] md:text-[40px] font-medium tracking-[-0.02em] leading-[1.18] text-balance m-0">
                  The Challenge
                </h2>
                <p className="text-[18px] sm:text-[19px] md:text-[19px] leading-[1.95] md:leading-[1.78] text-[#171716]/72 m-0">
                  {project.challenge}
                </p>
              </div>

              {project.researchInsights && project.researchInsights.length > 0 && (
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pt-2 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 no-scrollbar md:mx-0 md:px-0 md:pt-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-3 md:gap-5">
                  {project.researchInsights.map((insight, idx) => (
                    <FloatCard
                      key={insight}
                      className={`w-[86vw] max-w-[338px] shrink-0 snap-start md:w-auto md:max-w-none ${EDITORIAL_CARD_CLASS}`}
                    >
                      <span className="text-[15px] md:text-[14px] font-semibold leading-[1.4] tabular-nums text-[#d9442e]">
                        Insight {formatCount(idx + 1)}
                      </span>
                      <p className="mt-2.5 text-[18px] md:text-[16.5px] leading-[1.9] md:leading-[1.68] text-[#171716]/72 m-0">
                        {insight}
                      </p>
                    </FloatCard>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Approach & Process */}
          <section className="bg-[#f8f6ef] border-b border-[#171716]/12">
            <div className={`${SECTION_CONTAINER} py-12 md:py-20 flex flex-col gap-7 md:gap-9`}>
              <div className="flex flex-col gap-3 max-w-[64ch]">
                <h2 className="font-display text-[30px] sm:text-[36px] md:text-[40px] font-medium tracking-[-0.02em] leading-[1.18] text-balance m-0">
                  Design Approach
                </h2>
                <p className="text-[18px] sm:text-[19px] md:text-[19px] leading-[1.95] md:leading-[1.78] text-[#171716]/72 m-0">
                  {project.approach}
                </p>
              </div>

              {project.processSteps && project.processSteps.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  {project.processSteps.map((step) => (
                    <FloatCard key={step.phase} className={EDITORIAL_CARD_CLASS}>
                      <p className="text-[15px] md:text-[14px] font-semibold leading-[1.4] text-[#d9442e] m-0">
                        {step.phase}
                      </p>
                      <h3 className="mt-2 font-display text-[21px] md:text-[21px] font-semibold tracking-[-0.015em] leading-[1.35] m-0">
                        {step.title}
                      </h3>
                      <p className="mt-2.5 text-[18px] md:text-[16.5px] leading-[1.9] md:leading-[1.68] text-[#171716]/72 m-0">
                        {step.detail}
                      </p>
                    </FloatCard>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Key Decisions & Calm Outcome/Reflection */}
          <section className="bg-[#f2efe6] border-b border-[#171716]/12">
            <div className={`${SECTION_CONTAINER} py-12 md:py-20 flex flex-col gap-8 md:gap-11`}>
              {project.keyDecisions && project.keyDecisions.length > 0 && (
                <div className="flex flex-col gap-7 md:gap-9">
                  <h2 className="font-display text-[30px] sm:text-[36px] md:text-[40px] font-medium tracking-[-0.02em] leading-[1.18] text-balance m-0">
                    Key Decisions
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {project.keyDecisions.map((decision) => (
                      <FloatCard key={decision.title} className={EDITORIAL_CARD_CLASS}>
                        <h3 className="font-display text-[21px] md:text-[21px] font-semibold tracking-[-0.015em] leading-[1.35] m-0">
                          {decision.title}
                        </h3>
                        <p className="mt-2.5 text-[18px] md:text-[16.5px] leading-[1.9] md:leading-[1.68] text-[#171716]/72 m-0">
                          {decision.rationale}
                        </p>
                      </FloatCard>
                    ))}
                  </div>
                </div>
              )}

              <FloatCard
                testId="reflection-section"
                className="rounded-2xl border border-[#171716]/16 bg-[#fffdf6] p-6 sm:p-8 md:p-11 shadow-[0_2px_12px_rgba(23,23,22,0.04)]"
              >
                <div className="max-w-[64ch]">
                  <p className="text-[15px] md:text-[14px] font-semibold uppercase tracking-[0.08em] leading-[1.4] text-[#d9442e] m-0">
                    Outcome &amp; Reflection
                  </p>
                  <p className="mt-3.5 font-display text-[22px] md:text-[26px] font-medium leading-[1.45] md:leading-[1.38] tracking-[-0.015em] text-[#171716] m-0">
                    {project.outcome}
                  </p>
                  {project.reflection && (
                    <p className="mt-4 text-[18px] md:text-[18px] leading-[1.9] md:leading-[1.72] text-[#171716]/75 m-0">
                      {project.reflection}
                    </p>
                  )}
                </div>

                <div className="mt-7 pt-7 border-t border-[#171716]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <p className="text-[17px] md:text-[17px] leading-[1.5] md:leading-[1.6] text-[#171716]/70 m-0">
                    Have a similar product challenge in mind?
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      onInquire(
                        "Product Design",
                        `Hi Sadman — I read your detailed case study for ${project.title} and would love to discuss a similar product project.`,
                      )
                    }
                    className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 border-[#171716] bg-[#171716] text-[#f2efe6] text-[16px] md:text-[16px] leading-[1.4] font-medium shadow-[3px_3px_0_#ff5b44] hover:-translate-y-0.5 hover:bg-[#ff5b44] hover:text-[#171716] hover:shadow-[3px_3px_0_#171716] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-150 whitespace-nowrap shrink-0 self-start sm:self-auto"
                  >
                    Inquire About Similar Work <Arrow className="w-4 h-4" />
                  </button>
                </div>
              </FloatCard>
            </div>
          </section>
        </>
      )}

      {/* Bottom Project Switcher */}
      {(prevProject || nextProject) && (
        <section aria-label="Adjacent projects" className="bg-[#f2efe6]">
          <div className={`${SECTION_CONTAINER} py-10 md:py-14`}>
            <div className="grid grid-cols-2 gap-3.5 md:gap-5">
              {prevProject ? (
                <button
                  type="button"
                  onClick={() => onSelectProject(prevProject.id)}
                  className="group text-left rounded-xl md:rounded-2xl border-2 border-[#171716] bg-[#fffdf6] p-4 md:p-6 shadow-[3px_3px_0_#171716] md:shadow-[4px_4px_0_#171716] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#ff5b44] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44] flex items-center gap-3 md:gap-4"
                >
                  <span className="w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl border-2 border-[#171716] bg-[#f2efe6] grid place-items-center shrink-0 transition-colors group-hover:bg-[#ff5b44]">
                    <ChevronIcon direction="left" className="w-4 h-4 md:w-5 md:h-5" />
                  </span>
                  <div className="min-w-0">
                    <span className="block text-xs sm:text-sm font-medium text-[#171716]/65">
                      Previous
                    </span>
                    <span className="mt-0.5 block font-display text-[17px] md:text-[21px] font-medium truncate group-hover:text-[#d9442e] transition-colors">
                      {prevProject.title}
                    </span>
                  </div>
                </button>
              ) : (
                <div />
              )}

              {nextProject && (
                <button
                  type="button"
                  onClick={() => onSelectProject(nextProject.id)}
                  className="group text-right rounded-xl md:rounded-2xl border-2 border-[#171716] bg-[#fffdf6] p-4 md:p-6 shadow-[3px_3px_0_#171716] md:shadow-[4px_4px_0_#171716] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#ff5b44] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44] flex items-center justify-end gap-3 md:gap-4"
                >
                  <div className="min-w-0">
                    <span className="block text-xs sm:text-sm font-medium text-[#171716]/65">
                      Next
                    </span>
                    <span className="mt-0.5 block font-display text-[17px] md:text-[21px] font-medium truncate group-hover:text-[#d9442e] transition-colors">
                      {nextProject.title}
                    </span>
                  </div>
                  <span className="w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl border-2 border-[#171716] bg-[#f2efe6] grid place-items-center shrink-0 transition-colors group-hover:bg-[#ff5b44]">
                    <ChevronIcon direction="right" className="w-4 h-4 md:w-5 md:h-5" />
                  </span>
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Fullscreen Image Viewer (Lightbox) */}
      {fullscreen && activeFullscreenImage && (
        <div
          data-testid="fullscreen-image-viewer"
          role="dialog"
          aria-modal="true"
          aria-label={`Full screen view: ${activeFullscreenImage.title}`}
          onClick={() => setFullscreen(null)}
          className="fixed inset-0 z-50 bg-[#171716]/95 backdrop-blur-sm text-[#f2efe6] flex flex-col p-3 sm:p-5 md:p-8"
        >
          {/* Top toolbar */}
          <div
            onClick={(event) => event.stopPropagation()}
            className="flex items-center justify-between gap-4 shrink-0"
          >
            <div className="min-w-0">
              <p className="font-display text-base md:text-lg font-medium text-[#f2efe6] truncate m-0">
                {activeFullscreenImage.title}
              </p>
              {fullscreen.mode === "gallery" && galleryItems.length > 1 && (
                <p className="text-xs sm:text-sm text-[#f2efe6]/65 tabular-nums m-0">
                  {formatCount(fullscreen.index + 1)} / {formatCount(galleryItems.length)}
                </p>
              )}
              {fullscreen.mode === "mobile" && mobileItems.length > 1 && (
                <p className="text-xs sm:text-sm text-[#f2efe6]/65 tabular-nums m-0">
                  {formatCount(fullscreen.index + 1)} / {formatCount(mobileItems.length)}
                </p>
              )}
            </div>

            <button
              type="button"
              data-testid="fullscreen-close-btn"
              onClick={() => setFullscreen(null)}
              aria-label="Close full screen image"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-[#f2efe6]/35 bg-[#171716] text-sm font-medium text-[#f2efe6] hover:bg-[#ff5b44] hover:border-[#ff5b44] hover:text-[#171716] transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c7ef45]"
            >
              <CloseIcon className="w-4 h-4" />
              <span>Close</span>
            </button>
          </div>

          {/* Center image viewport */}
          <div className="relative flex-1 min-h-0 flex items-center justify-center my-3 md:my-5">
            {((fullscreen.mode === "gallery" && galleryItems.length > 1) ||
              (fullscreen.mode === "mobile" && mobileItems.length > 1)) && (
              <button
                type="button"
                data-testid="fullscreen-prev-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  if (fullscreen.mode === "gallery") {
                    const nextIdx =
                      (fullscreen.index - 1 + galleryItems.length) %
                      galleryItems.length;
                    setFullscreen({ mode: "gallery", index: nextIdx });
                    setActiveScreenIndex(nextIdx);
                  } else if (fullscreen.mode === "mobile") {
                    const nextIdx =
                      (fullscreen.index - 1 + mobileItems.length) %
                      mobileItems.length;
                    setFullscreen({ mode: "mobile", index: nextIdx });
                  }
                }}
                aria-label="Previous full screen image"
                className="absolute left-0 sm:left-2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#f2efe6]/35 bg-[#171716]/85 text-[#f2efe6] grid place-items-center hover:bg-[#f2efe6] hover:text-[#171716] transition-colors"
              >
                <ChevronIcon direction="left" className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            )}

            <div
              onClick={(event) => event.stopPropagation()}
              className={`max-w-full max-h-full flex items-center justify-center ${
                activeFullscreenImage.lightBg
                  ? "bg-[#f7f7f7] rounded-2xl p-3 sm:p-5"
                  : ""
              }`}
            >
              <img
                src={activeFullscreenImage.src}
                alt={activeFullscreenImage.title}
                referrerPolicy="no-referrer"
                className="max-w-[92vw] max-h-[74vh] md:max-h-[78vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
              />
            </div>

            {((fullscreen.mode === "gallery" && galleryItems.length > 1) ||
              (fullscreen.mode === "mobile" && mobileItems.length > 1)) && (
              <button
                type="button"
                data-testid="fullscreen-next-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  if (fullscreen.mode === "gallery") {
                    const nextIdx = (fullscreen.index + 1) % galleryItems.length;
                    setFullscreen({ mode: "gallery", index: nextIdx });
                    setActiveScreenIndex(nextIdx);
                  } else if (fullscreen.mode === "mobile") {
                    const nextIdx = (fullscreen.index + 1) % mobileItems.length;
                    setFullscreen({ mode: "mobile", index: nextIdx });
                  }
                }}
                aria-label="Next full screen image"
                className="absolute right-0 sm:right-2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#f2efe6]/35 bg-[#171716]/85 text-[#f2efe6] grid place-items-center hover:bg-[#f2efe6] hover:text-[#171716] transition-colors"
              >
                <ChevronIcon direction="right" className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            )}
          </div>

          {/* Bottom caption */}
          {activeFullscreenImage.caption && (
            <p
              onClick={(event) => event.stopPropagation()}
              className="text-center text-base md:text-[17px] leading-[1.65] text-[#f2efe6]/85 max-w-3xl mx-auto shrink-0 m-0"
            >
              {activeFullscreenImage.caption}
            </p>
          )}
        </div>
      )}
    </main>
  );
}
