import { useEffect, useRef, useState, type ReactNode } from "react";
import type { DesignProject } from "../data/portfolio";
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
  | null;

const OVERVIEW_METRIC_COLORS = [
  "bg-[#c7ef45]",
  "bg-[#f5d837]",
  "bg-[#ffb5a8]",
  "bg-[#a9beff]",
] as const;

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
        : galleryItems[fullscreen.index]
          ? {
              src: galleryItems[fullscreen.index].src,
              title: `${formatCount(fullscreen.index + 1)} · ${galleryItems[fullscreen.index].title}`,
              caption: galleryItems[fullscreen.index].caption,
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
      {/* Subtle side chevrons on tablet & desktop (hidden on mobile to avoid clutter) */}
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
      <section className="border-b-2 border-[#171716]">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 md:px-16 lg:px-24 pt-6 pb-10 md:pt-10 md:pb-14">
          <div className="max-w-5xl">
            <p className="text-base md:text-[17px] font-medium text-[#d9442e] tabular-nums m-0">
              {project.subtitle} · {project.year}
            </p>
            <h1 className="mt-2 md:mt-2.5 font-display text-[clamp(34px,4.8vw,60px)] leading-[1.08] tracking-[-0.025em] font-medium m-0">
              {project.title}
            </h1>
          </div>

          {project.imageFit === "contain" ? (
            <div
              data-testid="study-hero-cover"
              className="mt-6 md:mt-9 w-full bg-[#f2efe6] py-1 md:py-2"
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
                  className="w-full h-auto max-h-[540px] object-contain mx-auto block transition-transform duration-200 group-hover:scale-[1.01]"
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
              className="mt-6 md:mt-9 overflow-hidden rounded-2xl border-2 border-[#171716] bg-[#ddd] shadow-[5px_5px_0_#171716] md:shadow-[8px_8px_0_#171716] aspect-[16/10] md:aspect-[16/9] max-h-[520px] w-full"
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
            className="mt-6 md:mt-9 grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-5"
          >
            {metadataCards.map((item) => (
              <FloatCard
                key={item.label}
                className={`rounded-xl md:rounded-2xl border-2 border-[#171716] p-4 sm:p-5 md:p-6 shadow-[3px_3px_0_#171716] md:shadow-[4px_4px_0_#171716] ${
                  item.accent ? "bg-[#f5d837]" : "bg-[#fffdf6]"
                }`}
              >
                <dt
                  className={`text-xs sm:text-[13px] font-semibold uppercase tracking-[0.07em] ${
                    item.accent ? "text-[#171716]/75" : "text-[#d9442e]"
                  }`}
                >
                  {item.label}
                </dt>
                <dd className="mt-2 md:mt-2.5 text-base md:text-[18px] leading-[1.45] font-semibold text-[#171716] tabular-nums m-0">
                  {item.value}
                </dd>
              </FloatCard>
            ))}
          </dl>

          {/* Live Platform URL placed directly after cover & 4 metadata boxes */}
          {project.liveUrl && (
            <FloatCard className="mt-5 md:mt-6 rounded-xl md:rounded-2xl border-2 border-[#171716] bg-[#fffdf6] px-5 py-4 md:px-6 md:py-5 shadow-[3px_3px_0_#171716] md:shadow-[4px_4px_0_#171716] flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
              <div className="min-w-0">
                <p className="text-xs sm:text-[13px] font-semibold uppercase tracking-[0.07em] text-[#d9442e] m-0">
                  Live Platform
                </p>
                <p className="mt-1 text-base md:text-[18px] font-medium text-[#171716]/85 truncate m-0">
                  {project.liveUrl.replace(/^https?:\/\//, "")}
                </p>
              </div>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="study-live-url"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-xl border-2 border-[#171716] bg-[#c7ef45] text-[#171716] text-base md:text-[17px] font-semibold shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 hover:bg-[#ff5b44] hover:shadow-[4px_5px_0_#171716] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-150 whitespace-nowrap shrink-0 self-start sm:self-center"
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
          {/* 01 · Project Overview + Editorial Pull-Quote + 4-Color Key Metrics + Overview Portal Visual */}
          <section data-testid="project-overview-section" className="border-b-2 border-[#171716]">
            <div className="max-w-[1160px] mx-auto px-4 sm:px-6 md:px-16 lg:px-24 py-10 md:py-16 flex flex-col gap-7 md:gap-10">
              <div className="max-w-3xl flex flex-col gap-4 md:gap-5">
                <div>
                  <p className="text-sm md:text-[15px] font-semibold tabular-nums text-[#d9442e] m-0">
                    01 · Overview
                  </p>
                  <h2 className="mt-1.5 font-display text-[28px] sm:text-[34px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.14] m-0">
                    Project Overview
                  </h2>
                </div>
                {project.overview && (
                  <p className="text-[17px] sm:text-lg md:text-[20px] leading-[1.8] text-[#171716]/85 m-0">
                    {project.overview}
                  </p>
                )}
              </div>

              {project.quote && (
                <blockquote
                  data-testid="overview-quote"
                  className="max-w-3xl border-l-[3px] border-[#ff5b44] pl-5 md:pl-7 py-1.5"
                >
                  <p className="font-display text-xl sm:text-[23px] md:text-[27px] font-medium leading-[1.52] tracking-[-0.015em] text-[#171716] m-0">
                    “{project.quote}”
                  </p>
                </blockquote>
              )}

              {project.metrics && project.metrics.length > 0 && (
                <div
                  data-testid="overview-metrics-grid"
                  className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-5 pt-1"
                >
                  {project.metrics.map((metric, idx) => (
                    <FloatCard
                      key={metric.label}
                      className={`rounded-xl md:rounded-2xl border-2 border-[#171716] p-4 sm:p-5 md:p-6 shadow-[3px_3px_0_#171716] md:shadow-[4px_4px_0_#171716] ${
                        OVERVIEW_METRIC_COLORS[idx % OVERVIEW_METRIC_COLORS.length]
                      }`}
                    >
                      <p className="font-display text-[32px] sm:text-4xl md:text-[44px] font-semibold tracking-[-0.02em] tabular-nums text-[#171716] leading-none m-0">
                        {metric.value}
                      </p>
                      <p className="mt-2.5 md:mt-3 text-[15px] md:text-[17px] leading-[1.45] text-[#171716]/85 m-0">
                        {metric.label}
                      </p>
                    </FloatCard>
                  ))}
                </div>
              )}

              {project.overviewVisual && (
                <figure
                  data-testid="overview-portal-figure"
                  className="m-0 pt-2 md:pt-4 max-w-[900px] w-full mx-auto space-y-4 md:space-y-5"
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
                          caption: project.overviewVisual!.caption,
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
                      <span className="pointer-events-none absolute right-2.5 bottom-2.5 md:right-3.5 md:bottom-3.5 inline-flex items-center gap-1.5 rounded-lg border-2 border-[#171716] bg-[#fffdf6]/95 px-2.5 py-1.5 text-xs sm:text-sm font-medium text-[#171716] shadow-[2px_2px_0_#171716] opacity-85 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 transition-opacity">
                        <ExpandIcon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Full screen</span>
                      </span>
                    </button>
                  </FloatCard>
                  <figcaption className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 md:gap-8 px-0.5">
                    <p className="font-display text-lg md:text-[21px] font-semibold text-[#d9442e] m-0 shrink-0">
                      {project.overviewVisual.title}
                    </p>
                    <p className="text-base md:text-[17px] leading-[1.72] text-[#171716]/82 max-w-2xl m-0">
                      {project.overviewVisual.caption}
                    </p>
                  </figcaption>
                </figure>
              )}
            </div>
          </section>

          {/* 02 · Background */}
          {project.backgroundMilestones && project.backgroundMilestones.length > 0 && (
            <section className="border-b-2 border-[#171716]">
              <div className="max-w-[1160px] mx-auto px-4 sm:px-6 md:px-16 lg:px-24 py-10 md:py-16 space-y-6 md:space-y-9">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-8">
                  <div>
                    <p className="text-sm md:text-[15px] font-semibold tabular-nums text-[#d9442e] m-0">
                      02 · Evolution
                    </p>
                    <h2 className="mt-1.5 font-display text-[28px] sm:text-[34px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.14] m-0">
                      Background
                    </h2>
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    {project.backgroundIntro && (
                      <p className="text-base md:text-[18px] leading-[1.7] text-[#171716]/80 max-w-lg m-0">
                        {project.backgroundIntro}
                      </p>
                    )}
                    <span className="md:hidden text-xs font-semibold uppercase tracking-[0.06em] text-[#d9442e] shrink-0 whitespace-nowrap">
                      Swipe →
                    </span>
                  </div>
                </div>

                {/* Horizontal snap-scroll cards on mobile, 2/4-col grid on tablet & desktop */}
                <div
                  data-testid="background-cards-strip"
                  className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pt-2 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 no-scrollbar md:mx-0 md:px-0 md:pt-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-5"
                >
                  {project.backgroundMilestones.map((item) => (
                    <FloatCard
                      key={item.tag}
                      className="w-[85vw] max-w-[332px] shrink-0 snap-start md:w-auto md:max-w-none rounded-2xl border-2 border-[#171716] bg-[#fffdf6] p-5 md:p-6 shadow-[3px_3px_0_#171716] md:shadow-[4px_4px_0_#171716]"
                    >
                      <p className="text-sm md:text-[15px] font-semibold tabular-nums text-[#d9442e] m-0">
                        {item.tag}
                      </p>
                      <h3 className="mt-2 font-display text-[19px] sm:text-xl md:text-[22px] font-semibold tracking-[-0.015em] leading-[1.3] m-0">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-base md:text-[17px] leading-[1.75] text-[#171716]/82 m-0">
                        {item.detail}
                      </p>
                    </FloatCard>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 03 · The Challenge */}
          {project.challengePoints && project.challengePoints.length > 0 && (
            <section className="border-b-2 border-[#171716]">
              <div className="max-w-[1160px] mx-auto px-4 sm:px-6 md:px-16 lg:px-24 py-10 md:py-16 space-y-6 md:space-y-9">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-8">
                  <div>
                    <p className="text-sm md:text-[15px] font-semibold tabular-nums text-[#d9442e] m-0">
                      03 · Problem Space
                    </p>
                    <h2 className="mt-1.5 font-display text-[28px] sm:text-[34px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.14] m-0">
                      The Challenge
                    </h2>
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    {project.challengeIntro && (
                      <p className="text-base md:text-[18px] leading-[1.7] text-[#171716]/80 max-w-lg m-0">
                        {project.challengeIntro}
                      </p>
                    )}
                    <span className="md:hidden text-xs font-semibold uppercase tracking-[0.06em] text-[#d9442e] shrink-0 whitespace-nowrap">
                      Swipe →
                    </span>
                  </div>
                </div>

                {/* Horizontal snap-scroll cards on mobile, 3-col grid on tablet & desktop */}
                <div
                  data-testid="challenge-cards-strip"
                  className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pt-2 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 no-scrollbar md:mx-0 md:px-0 md:pt-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-3 md:gap-6"
                >
                  {project.challengePoints.map((point, idx) => (
                    <FloatCard
                      key={point.title}
                      className="w-[85vw] max-w-[332px] shrink-0 snap-start md:w-auto md:max-w-none rounded-2xl border-2 border-[#171716] bg-[#fffdf6] p-5 md:p-7 shadow-[3px_3px_0_#171716] md:shadow-[4px_4px_0_#171716]"
                    >
                      <span className="text-sm md:text-[15px] font-semibold tabular-nums text-[#d9442e]">
                        {formatCount(idx + 1)}
                      </span>
                      <h3 className="mt-2 font-display text-[19px] sm:text-xl md:text-[22px] font-semibold tracking-[-0.015em] leading-[1.3] m-0">
                        {point.title}
                      </h3>
                      <p className="mt-3 text-base md:text-[17px] leading-[1.75] text-[#171716]/82 m-0">
                        {point.detail}
                      </p>
                    </FloatCard>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 04 · My Contribution + UI Screens & IMIS Integration */}
          {project.contributions && project.contributions.length > 0 && (
            <section className="border-b-2 border-[#171716]">
              <div className="max-w-[1160px] mx-auto px-4 sm:px-6 md:px-16 lg:px-24 py-10 md:py-16 space-y-7 md:space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-8">
                  <div>
                    <p className="text-sm md:text-[15px] font-semibold tabular-nums text-[#d9442e] m-0">
                      04 · Scope &amp; Craft
                    </p>
                    <h2 className="mt-1.5 font-display text-[28px] sm:text-[34px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.14] m-0">
                      My Contribution
                    </h2>
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    {project.contributionsIntro && (
                      <p className="text-base md:text-[18px] leading-[1.7] text-[#171716]/80 max-w-lg m-0">
                        {project.contributionsIntro}
                      </p>
                    )}
                    <span className="md:hidden text-xs font-semibold uppercase tracking-[0.06em] text-[#d9442e] shrink-0 whitespace-nowrap">
                      Swipe →
                    </span>
                  </div>
                </div>

                {/* Horizontal snap-scroll cards on mobile, 2/3-col grid on tablet & desktop */}
                <div
                  data-testid="contributions-cards-strip"
                  className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pt-2 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 no-scrollbar md:mx-0 md:px-0 md:pt-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5"
                >
                  {project.contributions.map((item, idx) => (
                    <FloatCard
                      key={item.title}
                      className="w-[85vw] max-w-[332px] shrink-0 snap-start md:w-auto md:max-w-none rounded-2xl border-2 border-[#171716] bg-[#fffdf6] p-5 md:p-6 shadow-[3px_3px_0_#171716] md:shadow-[4px_4px_0_#171716]"
                    >
                      <span className="text-sm md:text-[15px] font-semibold tabular-nums text-[#d9442e]">
                        {item.num ?? formatCount(idx + 1)}
                      </span>
                      <h3 className="mt-2 font-display text-[19px] sm:text-xl md:text-[22px] font-semibold tracking-[-0.015em] leading-[1.3] m-0">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-base md:text-[17px] leading-[1.75] text-[#171716]/82 m-0">
                        {item.detail}
                      </p>
                    </FloatCard>
                  ))}
                </div>

                {/* Balanced Horizontal UI Showcase (Click to open full screen) */}
                {galleryItems.length > 0 && activeMobileScreen && (
                  <div
                    data-testid="contribution-interface-gallery"
                    className="pt-4 md:pt-6 max-w-[780px] w-full mx-auto space-y-5 md:space-y-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-display text-[22px] md:text-[26px] font-medium tracking-[-0.015em] leading-snug m-0">
                          Selected Interfaces &amp; IMIS Integration
                        </h3>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span
                          data-testid="screen-counter"
                          className="text-sm md:text-[15px] font-medium tabular-nums text-[#171716]/70 mr-1 whitespace-nowrap"
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
                          className="inline-flex items-center gap-1.5 px-4 py-2 md:px-4.5 rounded-xl border-2 border-[#171716] bg-[#fffdf6] text-[15px] md:text-base font-medium text-[#171716] shadow-[2px_2px_0_#171716] md:shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 hover:bg-[#171716] hover:text-[#f2efe6] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150"
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
                          className="inline-flex items-center gap-1.5 px-4 py-2 md:px-4.5 rounded-xl border-2 border-[#171716] bg-[#fffdf6] text-[15px] md:text-base font-medium text-[#171716] shadow-[2px_2px_0_#171716] md:shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 hover:bg-[#ff5b44] hover:text-[#171716] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150"
                        >
                          <span>Next</span>
                          <ChevronIcon direction="right" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Compact, crisp clickable active UI screenshot */}
                    <figure
                      data-testid="active-interface-figure"
                      className="m-0 space-y-4 md:space-y-5"
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
                          <span className="pointer-events-none absolute right-2.5 bottom-2.5 md:right-3.5 md:bottom-3.5 inline-flex items-center gap-1.5 rounded-lg border-2 border-[#171716] bg-[#fffdf6]/95 px-2.5 py-1.5 text-xs sm:text-sm font-medium text-[#171716] shadow-[2px_2px_0_#171716] opacity-85 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 transition-opacity">
                            <ExpandIcon className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Full screen</span>
                          </span>
                        </button>
                      </FloatCard>

                      <figcaption className="flex flex-col gap-2 px-0.5">
                        <p className="font-display text-lg md:text-[22px] font-semibold tracking-[-0.015em] leading-snug text-[#171716] m-0">
                          <span className="text-[#d9442e] tabular-nums mr-1.5">
                            {formatCount(safeScreenIndex + 1)} ·
                          </span>
                          {activeMobileScreen.title}
                        </p>
                        <p className="text-base md:text-[17px] leading-[1.74] text-[#171716]/82 m-0">
                          {activeMobileScreen.caption}
                        </p>
                      </figcaption>
                    </figure>

                    {/* Horizontal 5-screen selector strip directly on canvas */}
                    <div
                      className="grid grid-cols-5 gap-2.5 md:gap-3.5 pt-1"
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
                            className={`group text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5b44] ${
                              isSelected ? "opacity-100" : "opacity-65 hover:opacity-100"
                            }`}
                          >
                            <div
                              className={`overflow-hidden rounded-lg md:rounded-xl border-2 aspect-[16/9] transition-all duration-150 ${
                                isSelected
                                  ? "border-[#ff5b44] shadow-[2px_2px_0_#171716] md:shadow-[3px_3px_0_#171716] -translate-y-0.5"
                                  : "border-[#171716]/40 group-hover:border-[#171716] group-hover:-translate-y-0.5 group-active:-translate-y-0.5"
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
                                isSelected ? "text-[#d9442e]" : "text-[#171716]/75"
                              }`}
                            >
                              {formatCount(idx + 1)} · {screen.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 05 · Design Process */}
          {project.processSteps && project.processSteps.length > 0 && (
            <section className="border-b-2 border-[#171716]">
              <div className="max-w-[1160px] mx-auto px-4 sm:px-6 md:px-16 lg:px-24 py-10 md:py-16 space-y-6 md:space-y-9">
                <div>
                  <p className="text-sm md:text-[15px] font-semibold tabular-nums text-[#d9442e] m-0">
                    05 · Workflow
                  </p>
                  <h2 className="mt-1.5 font-display text-[28px] sm:text-[34px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.14] m-0">
                    Design Process
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                  {project.processSteps.map((step) => (
                    <FloatCard
                      key={step.phase}
                      className="rounded-xl md:rounded-2xl border-2 border-[#171716] bg-[#fffdf6] p-5 md:p-6 shadow-[3px_3px_0_#171716] md:shadow-[4px_4px_0_#171716]"
                    >
                      <p className="text-sm md:text-[15px] font-semibold tabular-nums text-[#d9442e] m-0">
                        {step.phase}
                      </p>
                      <h3 className="mt-2 font-display text-[19px] sm:text-xl md:text-[22px] font-semibold tracking-[-0.015em] leading-[1.3] m-0">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-base md:text-[17px] leading-[1.75] text-[#171716]/82 m-0">
                        {step.detail}
                      </p>
                    </FloatCard>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 06 · Key Design Areas + Multi-Module System Showcase */}
          {project.keyDesignAreas && project.keyDesignAreas.length > 0 && (
            <section className="border-b-2 border-[#171716]">
              <div className="max-w-[1160px] mx-auto px-4 sm:px-6 md:px-16 lg:px-24 py-10 md:py-16 space-y-6 md:space-y-9">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm md:text-[15px] font-semibold tabular-nums text-[#d9442e] m-0">
                      06 · System Architecture
                    </p>
                    <h2 className="mt-1.5 font-display text-[28px] sm:text-[34px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.14] m-0">
                      Key Design Areas
                    </h2>
                  </div>
                  <span className="md:hidden text-xs font-semibold uppercase tracking-[0.06em] text-[#d9442e] shrink-0 whitespace-nowrap">
                    Swipe →
                  </span>
                </div>

                {/* Horizontal snap-scroll cards on mobile so large copy breathes cleanly without long scroll */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pt-2 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 no-scrollbar md:mx-0 md:px-0 md:pt-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-5">
                  {project.keyDesignAreas.map((area) => (
                    <FloatCard
                      key={area.title}
                      className="w-[85vw] max-w-[332px] shrink-0 snap-start md:w-auto md:max-w-none rounded-xl md:rounded-2xl border-2 border-[#171716] bg-[#fffdf6] p-5 md:p-6 shadow-[3px_3px_0_#171716] md:shadow-[4px_4px_0_#171716]"
                    >
                      <h3 className="font-display text-[19px] sm:text-xl md:text-[22px] font-semibold tracking-[-0.015em] leading-[1.3] m-0">
                        {area.title}
                      </h3>
                      <p className="mt-3 text-base md:text-[17px] leading-[1.75] text-[#171716]/82 m-0">
                        {area.detail}
                      </p>
                    </FloatCard>
                  ))}
                </div>

                {project.keyDesignAreasVisual && (
                  <figure
                    data-testid="key-design-areas-figure"
                    className="m-0 pt-2 md:pt-4 bg-[#f2efe6]"
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
                      className="group relative block w-full cursor-zoom-in rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
                    >
                      <img
                        src={project.keyDesignAreasVisual.src}
                        alt={project.keyDesignAreasVisual.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-auto max-h-[540px] object-contain mx-auto block transition-transform duration-200 group-hover:scale-[1.01]"
                      />
                      <span className="pointer-events-none absolute right-2 bottom-2 md:right-3 md:bottom-3 inline-flex items-center gap-1.5 rounded-lg border-2 border-[#171716] bg-[#fffdf6]/95 px-2.5 py-1.5 text-xs sm:text-sm font-medium text-[#171716] shadow-[2px_2px_0_#171716] opacity-80 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 transition-opacity">
                        <ExpandIcon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Full screen</span>
                      </span>
                    </button>
                    <figcaption className="mt-5 pt-4 border-t border-[#171716]/20 flex flex-col md:flex-row md:items-baseline justify-between gap-2 md:gap-8">
                      <p className="font-display text-lg md:text-[21px] font-semibold text-[#d9442e] m-0 shrink-0">
                        {project.keyDesignAreasVisual.title}
                      </p>
                      <p className="text-base md:text-[17px] leading-[1.72] text-[#171716]/82 max-w-2xl m-0">
                        {project.keyDesignAreasVisual.caption}
                      </p>
                    </figcaption>
                  </figure>
                )}
              </div>
            </section>
          )}

          {/* 07 · From Old System to Upscaled Product */}
          {project.beforeAfter && project.beforeAfter.length > 0 && (
            <section className="border-b-2 border-[#171716]">
              <div className="max-w-[1160px] mx-auto px-4 sm:px-6 md:px-16 lg:px-24 py-10 md:py-16 space-y-6 md:space-y-8">
                <div>
                  <p className="text-sm md:text-[15px] font-semibold tabular-nums text-[#d9442e] m-0">
                    07 · Product Transformation
                  </p>
                  <h2 className="mt-1.5 font-display text-[28px] sm:text-[34px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.14] m-0">
                    From Old System to Upscaled Product
                  </h2>
                </div>

                <FloatCard className="overflow-hidden rounded-2xl border-2 border-[#171716] bg-[#fffdf6] shadow-[4px_4px_0_#171716]">
                  <div className="grid grid-cols-2 border-b-2 border-[#171716] bg-[#171716] text-[#f2efe6] text-xs sm:text-sm md:text-[15px] font-semibold uppercase tracking-[0.08em]">
                    <div className="px-4 py-3.5 md:px-7 md:py-4.5 border-r border-[#f2efe6]/20">
                      Before
                    </div>
                    <div className="px-4 py-3.5 md:px-7 md:py-4.5 text-[#c7ef45]">
                      After
                    </div>
                  </div>
                  <div className="divide-y divide-[#171716]/15">
                    {project.beforeAfter.map((row) => (
                      <div key={row.before} className="grid grid-cols-2 text-[15px] sm:text-base md:text-[17px]">
                        <div className="px-4 py-4 md:px-7 md:py-5 border-r border-[#171716]/15 text-[#171716]/78 leading-[1.68]">
                          {row.before}
                        </div>
                        <div className="px-4 py-4 md:px-7 md:py-5 font-medium text-[#171716] leading-[1.68] bg-[#c7ef45]/15">
                          {row.after}
                        </div>
                      </div>
                    ))}
                  </div>
                </FloatCard>
              </div>
            </section>
          )}

          {/* 08 · Project Scale & Outcomes + Calm Editorial Reflection (NO IMIS image here) */}
          <section data-testid="scale-outcomes-section" className="border-b-2 border-[#171716]">
            <div className="max-w-[1160px] mx-auto px-4 sm:px-6 md:px-16 lg:px-24 py-10 md:py-16 space-y-7 md:space-y-11">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-8">
                <div>
                  <p className="text-sm md:text-[15px] font-semibold tabular-nums text-[#d9442e] m-0">
                    08 · Impact
                  </p>
                  <h2 className="mt-1.5 font-display text-[28px] sm:text-[34px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.14] m-0">
                    Project Scale &amp; Outcomes
                  </h2>
                </div>
                {project.scaleIntro && (
                  <p className="text-base md:text-[18px] leading-[1.7] text-[#171716]/82 max-w-lg m-0">
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
                      <p className="font-display text-[32px] sm:text-4xl md:text-[44px] font-semibold tracking-[-0.02em] tabular-nums text-[#171716] leading-none m-0">
                        {metric.value}
                      </p>
                      <p className="mt-2.5 md:mt-3 text-[15px] md:text-[17px] leading-[1.45] text-[#171716]/85 m-0">
                        {metric.label}
                      </p>
                    </FloatCard>
                  ))}
                </div>
              )}

              {/* Calm, easy-on-the-eyes Reflection Panel */}
              <FloatCard
                testId="reflection-section"
                className="rounded-2xl border-2 border-[#171716] bg-[#fffdf6] p-6 sm:p-8 md:p-12 shadow-[4px_4px_0_#171716] md:shadow-[5px_5px_0_#171716]"
              >
                <div className="max-w-3xl">
                  <p className="text-sm md:text-[15px] font-semibold uppercase tracking-[0.08em] text-[#d9442e] m-0">
                    09 · Reflection
                  </p>
                  {project.reflection && (
                    <blockquote className="mt-5 md:mt-6 border-l-[3px] border-[#ff5b44] pl-5 md:pl-7 py-1">
                      <p className="font-display text-xl sm:text-[22px] md:text-[25px] font-normal leading-[1.72] tracking-[-0.01em] text-[#171716]/90 m-0">
                        {project.reflection}
                      </p>
                    </blockquote>
                  )}
                </div>

                <div className="mt-7 pt-7 md:mt-9 md:pt-8 border-t border-[#171716]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <p className="text-base md:text-[17px] leading-[1.65] text-[#171716]/72 m-0">
                    Explore the live platform or get in touch about similar product systems.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-[#171716] bg-[#f2efe6] text-[#171716] text-[15px] md:text-base font-medium shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 hover:bg-[#171716] hover:text-[#f2efe6] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-150 whitespace-nowrap"
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
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-[#171716] bg-[#171716] text-[#f2efe6] text-[15px] md:text-base font-medium shadow-[3px_3px_0_#ff5b44] hover:-translate-y-0.5 hover:bg-[#ff5b44] hover:text-[#171716] hover:shadow-[3px_3px_0_#171716] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-150 whitespace-nowrap"
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
            <section className="border-b-2 border-[#171716]">
              <div className="max-w-[1160px] mx-auto px-4 sm:px-6 md:px-16 lg:px-24 py-10 md:py-14">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 md:gap-5">
                  {project.metrics.map((metric, idx) => (
                    <FloatCard
                      key={metric.label}
                      className={`rounded-xl md:rounded-2xl border-2 border-[#171716] p-5 md:p-6 shadow-[3px_3px_0_#171716] md:shadow-[4px_4px_0_#171716] ${
                        OVERVIEW_METRIC_COLORS[idx % OVERVIEW_METRIC_COLORS.length]
                      } ${idx === 0 ? "col-span-2 md:col-span-1" : ""}`}
                    >
                      <p className="font-display text-[32px] sm:text-4xl md:text-[42px] font-semibold tracking-[-0.02em] tabular-nums leading-none m-0">
                        {metric.value}
                      </p>
                      <p className="mt-2.5 text-[15px] md:text-[17px] leading-[1.5] text-[#171716]/85 m-0">
                        {metric.label}
                      </p>
                    </FloatCard>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 01 · Challenge & Research Insights */}
          <section className="border-b-2 border-[#171716]">
            <div className="max-w-[1160px] mx-auto px-4 sm:px-6 md:px-16 lg:px-24 py-10 md:py-16 space-y-7 md:space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-5 lg:gap-12 items-start">
                <div>
                  <p className="text-sm md:text-[15px] font-semibold tabular-nums text-[#d9442e] m-0">
                    01 · Context &amp; Problem
                  </p>
                  <h2 className="mt-1.5 font-display text-[28px] sm:text-[34px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.14] m-0">
                    The Challenge
                  </h2>
                </div>
                <p className="text-[17px] sm:text-lg md:text-[20px] leading-[1.8] text-[#171716]/85 m-0">
                  {project.challenge}
                </p>
              </div>

              {project.researchInsights && project.researchInsights.length > 0 && (
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pt-2 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 no-scrollbar md:mx-0 md:px-0 md:pt-1 md:pb-0 md:overflow-visible md:grid md:grid-cols-3 md:gap-6">
                  {project.researchInsights.map((insight, idx) => (
                    <FloatCard
                      key={insight}
                      className="w-[85vw] max-w-[332px] shrink-0 snap-start md:w-auto md:max-w-none rounded-xl md:rounded-2xl border-2 border-[#171716] bg-[#fffdf6] p-5 md:p-6 shadow-[3px_3px_0_#171716]"
                    >
                      <span className="text-sm md:text-[15px] font-semibold tabular-nums text-[#d9442e]">
                        Insight {formatCount(idx + 1)}
                      </span>
                      <p className="mt-2.5 text-base md:text-[17px] leading-[1.75] text-[#171716]/85 m-0">
                        {insight}
                      </p>
                    </FloatCard>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 02 · Approach & Process */}
          <section className="border-b-2 border-[#171716]">
            <div className="max-w-[1160px] mx-auto px-4 sm:px-6 md:px-16 lg:px-24 py-10 md:py-16 space-y-7 md:space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-5 lg:gap-12 items-start">
                <div>
                  <p className="text-sm md:text-[15px] font-semibold tabular-nums text-[#d9442e] m-0">
                    02 · Execution
                  </p>
                  <h2 className="mt-1.5 font-display text-[28px] sm:text-[34px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.14] m-0">
                    Design Approach
                  </h2>
                </div>
                <p className="text-[17px] sm:text-lg md:text-[20px] leading-[1.8] text-[#171716]/85 m-0">
                  {project.approach}
                </p>
              </div>

              {project.processSteps && project.processSteps.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-1">
                  {project.processSteps.map((step) => (
                    <FloatCard
                      key={step.phase}
                      className="rounded-xl md:rounded-2xl border-2 border-[#171716] bg-[#fffdf6] p-5 md:p-7 shadow-[3px_3px_0_#171716] md:shadow-[4px_4px_0_#171716]"
                    >
                      <p className="text-sm md:text-[15px] font-semibold tabular-nums text-[#d9442e] m-0">
                        {step.phase}
                      </p>
                      <h3 className="mt-2 font-display text-[19px] sm:text-xl md:text-[22px] font-semibold tracking-[-0.015em] leading-[1.3] m-0">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-base md:text-[17px] leading-[1.75] text-[#171716]/82 m-0">
                        {step.detail}
                      </p>
                    </FloatCard>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 03 · Key Decisions & Calm Outcome/Reflection */}
          <section className="border-b-2 border-[#171716]">
            <div className="max-w-[1160px] mx-auto px-4 sm:px-6 md:px-16 lg:px-24 py-10 md:py-16 space-y-7 md:space-y-10">
              {project.keyDecisions && project.keyDecisions.length > 0 && (
                <div>
                  <p className="text-sm md:text-[15px] font-semibold tabular-nums text-[#d9442e] m-0">
                    03 · Craft &amp; Trade-Offs
                  </p>
                  <h2 className="mt-1.5 font-display text-[28px] sm:text-[34px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.14] m-0">
                    Key Decisions
                  </h2>

                  <div className="mt-5 md:mt-7 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {project.keyDecisions.map((decision) => (
                      <FloatCard
                        key={decision.title}
                        className="rounded-xl md:rounded-2xl border-2 border-[#171716] bg-[#fffdf6] p-5 md:p-7 shadow-[3px_3px_0_#171716]"
                      >
                        <h3 className="font-display text-[19px] sm:text-xl md:text-[22px] font-semibold tracking-[-0.015em] leading-[1.3] m-0">
                          {decision.title}
                        </h3>
                        <p className="mt-3 text-base md:text-[17px] leading-[1.75] text-[#171716]/82 m-0">
                          {decision.rationale}
                        </p>
                      </FloatCard>
                    ))}
                  </div>
                </div>
              )}

              <FloatCard
                testId="reflection-section"
                className="rounded-2xl border-2 border-[#171716] bg-[#fffdf6] p-6 sm:p-8 md:p-12 shadow-[4px_4px_0_#171716] md:shadow-[5px_5px_0_#171716]"
              >
                <div className="max-w-3xl">
                  <p className="text-sm md:text-[15px] font-semibold uppercase tracking-[0.08em] text-[#d9442e] m-0">
                    Outcome &amp; Reflection
                  </p>
                  <p className="mt-3.5 font-display text-[22px] md:text-[28px] font-medium leading-[1.38] tracking-[-0.015em] text-[#171716] m-0">
                    {project.outcome}
                  </p>
                  {project.reflection && (
                    <blockquote className="mt-5 border-l-[3px] border-[#ff5b44] pl-5 md:pl-7 py-1">
                      <p className="text-[17px] md:text-[20px] leading-[1.75] text-[#171716]/85 m-0">
                        {project.reflection}
                      </p>
                    </blockquote>
                  )}
                </div>

                <div className="mt-7 pt-7 border-t border-[#171716]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <p className="text-base md:text-[17px] leading-[1.6] text-[#171716]/72 m-0">
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
                    className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 border-[#171716] bg-[#171716] text-[#f2efe6] text-[15px] md:text-base font-medium shadow-[3px_3px_0_#ff5b44] hover:-translate-y-0.5 hover:bg-[#ff5b44] hover:text-[#171716] hover:shadow-[3px_3px_0_#171716] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-150 whitespace-nowrap shrink-0 self-start sm:self-auto"
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
        <section aria-label="Adjacent projects">
          <div className="max-w-[1160px] mx-auto px-4 sm:px-6 md:px-16 lg:px-24 py-10 md:py-14">
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
                    <span className="mt-0.5 block font-display text-[17px] md:text-[22px] font-medium truncate group-hover:text-[#d9442e] transition-colors">
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
                    <span className="mt-0.5 block font-display text-[17px] md:text-[22px] font-medium truncate group-hover:text-[#d9442e] transition-colors">
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
            {fullscreen.mode === "gallery" && galleryItems.length > 1 && (
              <button
                type="button"
                data-testid="fullscreen-prev-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  const nextIdx =
                    (fullscreen.index - 1 + galleryItems.length) %
                    galleryItems.length;
                  setFullscreen({ mode: "gallery", index: nextIdx });
                  setActiveScreenIndex(nextIdx);
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
                  ? "bg-[#f2efe6] rounded-2xl p-3 sm:p-5"
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

            {fullscreen.mode === "gallery" && galleryItems.length > 1 && (
              <button
                type="button"
                data-testid="fullscreen-next-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  const nextIdx = (fullscreen.index + 1) % galleryItems.length;
                  setFullscreen({ mode: "gallery", index: nextIdx });
                  setActiveScreenIndex(nextIdx);
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
