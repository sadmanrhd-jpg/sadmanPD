import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { DesignProject, MobileShowcaseBlock } from "../data/portfolio";
import {
  formatCount,
  getAdjacentItemId,
  getCaseStudySections,
  getNextSlideIndex,
  splitParagraphs,
} from "../utils/portfolioLogic";
import { CaseStudySectionTabs } from "./CaseStudySectionNav";
import { Arrow, ChevronIcon } from "./Characters";
import { EditorialPdfReader } from "./EditorialPdfReader";
import { KeyDesignAreasCarousel } from "./KeyDesignAreasCarousel";
import { MobileDeviceMockupShowcase } from "./MobileDeviceMockupShowcase";

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
  | {
      mode: "kda-intro";
      index: number;
    }
  | {
      mode: "process-visuals";
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
  "rounded-2xl border border-[#171716]/16 bg-[#fffdf6] p-5 sm:p-6 md:p-7 lg:p-8 shadow-[0_2px_10px_rgba(23,23,22,0.04)]";
const OVERVIEW_PROSE_WRAPPER = "w-full max-w-[680px] text-left md:mx-auto";
const EDITORIAL_PROSE_WRAPPER = "w-full max-w-[680px] text-left";
const EDITORIAL_BODY_CLASS =
  "text-[17px] sm:text-[18px] md:text-[20px] lg:text-[21px] leading-[1.95] md:leading-[1.85] text-[#171716]/76 m-0";
const CARD_TAG_CLASS =
  "text-[14px] md:text-[15px] font-medium leading-[1.4] tabular-nums text-[#d9442e] m-0";
const CARD_TITLE_CLASS =
  "font-display text-[19px] md:text-[22px] font-medium tracking-[-0.015em] leading-[1.32] m-0";
const CARD_BODY_CLASS =
  "mt-3 md:mt-3.5 text-[16px] md:text-[18px] leading-[1.82] md:leading-[1.72] text-[#171716]/74 m-0";
const CAPTION_TITLE_CLASS =
  "font-display text-[16px] md:text-[16.5px] font-medium tracking-[-0.01em] leading-[1.4] text-[#171716]/88 m-0";
const CAPTION_BODY_CLASS =
  "text-[15px] md:text-[15px] font-normal leading-[1.75] text-[#171716]/64 m-0";

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

function KeyDesignAreaIcon({ title }: { title: string }) {
  const key = title.toLowerCase();

  if (key.includes("dashboard")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="w-[20px] h-[20px]"
      >
        <rect x="3" y="3" width="18" height="18" rx="3.5" />
        <line x1="3" y1="8.5" x2="21" y2="8.5" />
        <line x1="8" y1="17" x2="8" y2="13" className="kda-bar-1 stroke-[#d9442e]" />
        <line x1="12" y1="17" x2="12" y2="11.5" className="kda-bar-2" />
        <line x1="16" y1="17" x2="16" y2="14" className="kda-bar-3 stroke-[#d9442e]" />
      </svg>
    );
  }

  if (key.includes("color") || key.includes("brand") || key.includes("palette")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="w-[20px] h-[20px]"
      >
        <rect x="3.5" y="4" width="6.5" height="16" rx="2" className="stroke-[#0f7644]" />
        <rect x="10" y="6.5" width="5.5" height="13.5" rx="1.8" className="stroke-[#d9442e]" />
        <rect x="15.5" y="9" width="5" height="11" rx="1.6" />
      </svg>
    );
  }

  if (key.includes("financial") || key.includes("money") || key.includes("taka")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="w-[20px] h-[20px]"
      >
        <rect x="3" y="6" width="18" height="12" rx="2.5" />
        <circle cx="12" cy="12" r="2.6" className="stroke-[#d9442e]" />
        <path d="M6.5 9.5v5M17.5 9.5v5" />
      </svg>
    );
  }

  if (key.includes("humour") || key.includes("tone") || key.includes("personality")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="w-[20px] h-[20px]"
      >
        <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.6-4.7A8.5 8.5 0 1 1 21 11.5Z" />
        <path d="M9.2 12.8c.7 1.1 1.7 1.7 2.8 1.7s2.1-.6 2.8-1.7" className="stroke-[#d9442e]" />
        <circle cx="9.6" cy="9.6" r="0.7" fill="currentColor" stroke="none" />
        <circle cx="14.4" cy="9.6" r="0.7" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (key.includes("concise") || key.includes("update") || key.includes("delivery")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="w-[20px] h-[20px]"
      >
        <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
        <line x1="6.5" y1="9.5" x2="14.5" y2="9.5" className="stroke-[#d9442e]" />
        <line x1="6.5" y1="13.5" x2="11.5" y2="13.5" />
        <circle cx="17" cy="12" r="1.4" fill="#d9442e" stroke="none" />
      </svg>
    );
  }

  if (key.includes("mrt") || key.includes("transit") || key.includes("route")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="w-[20px] h-[20px]"
      >
        <line x1="8" y1="5" x2="8" y2="19" />
        <circle cx="8" cy="6" r="2" fill="#d9442e" className="stroke-[#d9442e]" />
        <circle cx="8" cy="12" r="2.2" fill="#f2efe6" />
        <circle cx="8" cy="18" r="2" fill="#171716" />
        <line x1="13" y1="6" x2="19" y2="6" />
        <line x1="13" y1="12" x2="20" y2="12" className="stroke-[#d9442e]" />
        <line x1="13" y1="18" x2="18" y2="18" />
      </svg>
    );
  }

  if (key.includes("explore") || key.includes("discover")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="w-[20px] h-[20px]"
      >
        <circle cx="11" cy="11" r="6.5" />
        <path d="m20 20-4.2-4.2" className="stroke-[#d9442e]" />
        <path d="M11 8v6M8 11h6" className="stroke-[#d9442e]" />
      </svg>
    );
  }

  if (key.includes("order") || key.includes("review") || key.includes("cart")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="w-[20px] h-[20px]"
      >
        <path d="M5 7h14l-1.2 12.5a1.8 1.8 0 0 1-1.8 1.5H8a1.8 1.8 0 0 1-1.8-1.5L5 7Z" />
        <path d="M9 7V5.8a3 3 0 0 1 6 0V7" />
        <path d="m9.5 13.5 1.8 1.8 3.5-3.6" className="stroke-[#d9442e]" />
      </svg>
    );
  }

  if (key.includes("checkout") || key.includes("delivery") || key.includes("supporting")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="w-[20px] h-[20px]"
      >
        <path d="M12 20s6-5.2 6-10.2a6 6 0 1 0-12 0C6 14.8 12 20 12 20Z" />
        <circle cx="12" cy="9.8" r="2.2" className="stroke-[#d9442e]" />
      </svg>
    );
  }

  if (key.includes("profile") || key.includes("gis") || key.includes("map")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="w-[20px] h-[20px]"
      >
        <path d="M3.5 20.5h17" />
        <path d="M5.5 20.5v-8.5l4-2v10.5" />
        <path d="M14.5 20.5v-6h4v6" />
        <g className="kda-bob text-[#d9442e]">
          <path d="M14 9.5c0 2-2.5 4.2-2.5 4.2S9 11.5 9 9.5a2.5 2.5 0 1 1 5 0Z" />
          <circle cx="11.5" cy="9.5" r="0.8" fill="currentColor" stroke="none" />
        </g>
      </svg>
    );
  }

  if (
    key.includes("comparison") ||
    key.includes("intersection") ||
    key.includes("spatial")
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="w-[20px] h-[20px]"
      >
        <rect x="3" y="4.5" width="6.5" height="15" rx="1.8" />
        <rect x="14.5" y="4.5" width="6.5" height="15" rx="1.8" />
        <path d="M10.5 9.5h3.5m-1.4-1.4 1.4 1.4-1.4 1.4" className="kda-slide-right stroke-[#d9442e]" />
        <path d="M13.5 14.5H10m1.4-1.4L10 14.5l1.4 1.4" className="kda-slide-left stroke-[#d9442e]" />
      </svg>
    );
  }

  if (
    key.includes("chart") ||
    key.includes("export") ||
    key.includes("pdf") ||
    key.includes("reporting")
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="w-[20px] h-[20px]"
      >
        <path d="M4 19.5h15.5" />
        <line x1="6.5" y1="19.5" x2="6.5" y2="14" className="kda-bar-1" />
        <line x1="11" y1="19.5" x2="11" y2="11" className="kda-bar-2" />
        <line x1="15.5" y1="19.5" x2="15.5" y2="13" className="kda-bar-3" />
        <g className="kda-export text-[#d9442e]">
          <path d="M14.5 4.5h5v5" />
          <path d="m19.5 4.5-6 6" />
        </g>
      </svg>
    );
  }

  if (key.includes("survey")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="w-[20px] h-[20px]"
      >
        <rect x="4.5" y="4" width="15" height="17" rx="2.5" />
        <path d="M9 4.5V3.2h6v1.3" />
        <path d="m8.2 11.4 1.6 1.6 3.2-3.4" className="kda-check stroke-[#d9442e]" />
        <line x1="8.5" y1="16.2" x2="15.5" y2="16.2" />
      </svg>
    );
  }

  if (key.includes("access") || key.includes("multilevel")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="w-[20px] h-[20px]"
      >
        <rect x="4.5" y="11" width="15" height="9.5" rx="2.5" />
        <path d="M8 11V8.2a4 4 0 0 1 8 0V11" className="kda-shackle stroke-[#d9442e]" />
        <circle cx="12" cy="15.6" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (key.includes("bangla") || key.includes("english")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="w-[20px] h-[20px]"
      >
        <g className="kda-lang-a">
          <rect x="3" y="3.5" width="10.5" height="10.5" rx="2.2" />
          <path d="M6.4 10.8 8.2 6.5l1.8 4.3" />
          <line x1="6.9" y1="9.6" x2="9.5" y2="9.6" />
        </g>
        <g className="kda-lang-b text-[#d9442e]">
          <rect x="10.5" y="10" width="10.5" height="10.5" rx="2.2" fill="#f2efe6" />
          <path d="M13.5 13.4h4.5" />
          <path d="M15.8 13.4v4.4" />
          <path d="M14 15.8c.9 0 2.4-.7 3.4-2.1" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.85}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="w-[20px] h-[20px]"
    >
      <g className="kda-tooltip">
        <path d="M4.5 6.5A3 3 0 0 1 7.5 3.5h9a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-5.2L7 20.2v-3.7h-.5a2 2 0 0 1-2-2v-8Z" />
        <line x1="12" y1="10" x2="12" y2="13.5" className="stroke-[#d9442e]" />
        <circle cx="12" cy="7.5" r="0.9" fill="#d9442e" stroke="none" />
      </g>
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

  if (showcase.variant === "device-mockup") {
    return (
      <MobileDeviceMockupShowcase
        showcase={showcase}
        onOpenFullscreen={onOpenFullscreen}
        sectionContainerClass={SECTION_CONTAINER}
      />
    );
  }

  const scrollStrip = (direction: -1 | 1) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 304, behavior: "smooth" });
  };

  return (
    <section
      id="section-mobile"
      data-testid="mobile-experience-section"
      className="bg-[#f8f6ef] border-b border-[#171716]/12"
    >
      <div className={`${SECTION_CONTAINER} py-20 md:py-28 flex flex-col gap-9 md:gap-11`}>
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-[30px] sm:text-[36px] md:text-[40px] font-medium tracking-[-0.02em] leading-[1.18] text-balance m-0">
            {showcase.heading}
          </h2>
          <span className="md:hidden text-[14px] font-medium uppercase tracking-[0.07em] text-[#d9442e] shrink-0 whitespace-nowrap leading-[1.5]">
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

              <figcaption className="px-0.5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-[16px] md:text-[16.5px] font-medium tracking-[-0.01em] leading-[1.4] text-[#171716]/88 m-0">
                    {screen.title}
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenFullscreen(idx)}
                    aria-label={`Expand ${screen.title}`}
                    className="inline-flex items-center gap-1 text-[13.5px] font-normal text-[#171716]/55 hover:text-[#d9442e] transition-colors shrink-0 cursor-zoom-in"
                  >
                    <ExpandIcon className="w-3.5 h-3.5" />
                    <span className="md:hidden">Tap</span>
                  </button>
                </div>
                <p className="text-[15px] md:text-[15px] font-normal leading-[1.75] text-[#171716]/64 m-0">
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
  const [editorialFullscreen, setEditorialFullscreen] = useState(false);
  const interfaceSwipeStartXRef = useRef<number | null>(null);
  const interfaceSwipedRef = useRef(false);

  const sections = useMemo(() => getCaseStudySections(project), [project]);
  const [activeSectionId, setActiveSectionId] = useState<string>(
    () => sections[0]?.id ?? "",
  );

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
  const kdaIntroVisuals = useMemo(
    () =>
      project.keyDesignAreasIntroVisuals?.length
        ? project.keyDesignAreasIntroVisuals
        : project.keyDesignAreasIntroVisual
          ? [project.keyDesignAreasIntroVisual]
          : [],
    [project.keyDesignAreasIntroVisuals, project.keyDesignAreasIntroVisual],
  );
  const processVisuals = useMemo(
    () =>
      project.processVisuals?.length
        ? project.processVisuals
        : project.processVisual
          ? [project.processVisual]
          : [],
    [project.processVisuals, project.processVisual],
  );
  const safeScreenIndex =
    galleryItems.length > 0 ? activeScreenIndex % galleryItems.length : 0;
  const activeMobileScreen = galleryItems[safeScreenIndex] ?? null;

  useEffect(() => {
    setActiveScreenIndex(0);
    setFullscreen(null);
    setActiveSectionId(sections[0]?.id ?? "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [project.id, sections]);

  useEffect(() => {
    if (sections.length === 0) return;
    let rafId = 0;

    const updateActiveSection = () => {
      rafId = 0;
      const threshold = 210;
      let current = sections[0].id;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) {
          current = section.id;
        } else {
          break;
        }
      }

      setActiveSectionId((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== 0) window.cancelAnimationFrame(rafId);
    };
  }, [sections]);

  const jumpToSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    const el = document.getElementById(sectionId);
    if (!el) return;
    const offset = 136;
    const targetTop = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
  };

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
        } else if (
          fullscreen.mode === "kda-intro" &&
          kdaIntroVisuals.length > 1 &&
          event.key === "ArrowLeft"
        ) {
          event.preventDefault();
          const nextIdx =
            (fullscreen.index - 1 + kdaIntroVisuals.length) %
            kdaIntroVisuals.length;
          setFullscreen({ mode: "kda-intro", index: nextIdx });
        } else if (
          fullscreen.mode === "kda-intro" &&
          kdaIntroVisuals.length > 1 &&
          event.key === "ArrowRight"
        ) {
          event.preventDefault();
          const nextIdx = (fullscreen.index + 1) % kdaIntroVisuals.length;
          setFullscreen({ mode: "kda-intro", index: nextIdx });
        } else if (
          fullscreen.mode === "process-visuals" &&
          processVisuals.length > 1 &&
          event.key === "ArrowLeft"
        ) {
          event.preventDefault();
          const nextIdx =
            (fullscreen.index - 1 + processVisuals.length) %
            processVisuals.length;
          setFullscreen({ mode: "process-visuals", index: nextIdx });
        } else if (
          fullscreen.mode === "process-visuals" &&
          processVisuals.length > 1 &&
          event.key === "ArrowRight"
        ) {
          event.preventDefault();
          const nextIdx = (fullscreen.index + 1) % processVisuals.length;
          setFullscreen({ mode: "process-visuals", index: nextIdx });
        }
        return;
      }

      if (!project.editorialDocument) {
        if (event.key === "ArrowLeft" && prevId) {
          onSelectProject(prevId);
        } else if (event.key === "ArrowRight" && nextId) {
          onSelectProject(nextId);
        } else if (event.key === "Escape") {
          onBack();
        }
      } else if (event.key === "Escape" && !editorialFullscreen) {
        onBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    disableKeyboardNav,
    fullscreen,
    editorialFullscreen,
    project.editorialDocument,
    galleryItems.length,
    mobileItems.length,
    kdaIntroVisuals.length,
    processVisuals.length,
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
                caption: galleryItems[fullscreen.index].caption,
                lightBg: false,
              }
            : null
          : fullscreen.mode === "kda-intro"
            ? kdaIntroVisuals[fullscreen.index]
              ? {
                  src: kdaIntroVisuals[fullscreen.index].src,
                  title: kdaIntroVisuals[fullscreen.index].title,
                  caption: kdaIntroVisuals[fullscreen.index].caption,
                  lightBg: true,
                }
              : null
            : fullscreen.mode === "process-visuals"
              ? processVisuals[fullscreen.index]
                ? {
                    src: processVisuals[fullscreen.index].src,
                    title: processVisuals[fullscreen.index].title,
                    caption: processVisuals[fullscreen.index].caption,
                    lightBg: true,
                  }
                : null
              : mobileItems[fullscreen.index]
                ? {
                    src: mobileItems[fullscreen.index].src,
                    title: mobileItems[fullscreen.index].title,
                    caption: mobileItems[fullscreen.index].caption,
                    lightBg: false,
                    scrollable: Boolean(mobileItems[fullscreen.index].scrollable),
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
      {/* Subtle side chevrons on tablet & desktop (hidden when editorial reader owns flanking arrows) */}
      {!project.editorialDocument && prevProject && (
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

      {!project.editorialDocument && nextProject && (
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
      <section className="bg-[#f2efe6] border-b border-[#171716]/14">
        <div className={`${SECTION_CONTAINER} pt-8 pb-14 md:pt-12 md:pb-16`}>
          <div className="w-fit max-w-full mx-auto text-left">
            <p
              data-testid="study-page-eyebrow"
              className={`text-[17px] md:text-[18px] font-medium text-[#d9442e] tabular-nums leading-[1.5] m-0 ${
                project.title.length > 42 ? "text-center" : "text-left"
              }`}
            >
              {project.subtitle} · {project.year}
            </p>
            <h1
              data-testid="study-page-title"
              className={`mt-2.5 font-display text-[35px] sm:text-[40px] lg:text-[clamp(36px,3.35vw,45px)] leading-[1.08] tracking-[-0.025em] font-medium text-center m-0 ${
                project.title.length > 42 ? "text-balance" : "lg:whitespace-nowrap"
              }`}
            >
              {project.title}
            </h1>
          </div>

          {project.editorialDocument ? (
            <EditorialPdfReader
              title={project.title}
              document={project.editorialDocument}
              disableKeyboardNav={disableKeyboardNav}
              onFullscreenChange={setEditorialFullscreen}
            />
          ) : project.heroSurface === "screen-frame" ||
          project.heroSurface === "canvas-frame" ? (
            <div
              data-testid="study-hero-cover"
              className="mt-7 md:mt-10 w-full bg-[#f2efe6] py-1 md:py-2 flex justify-center"
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
                className={`group relative block w-fit max-w-full cursor-zoom-in overflow-hidden rounded-2xl ${
                  project.heroSurface === "screen-frame" ? "bg-white" : "bg-[#f2efe6]"
                } focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]`}
              >
                <img
                  src={project.image}
                  alt={`${project.title}, ${project.subtitle}`}
                  referrerPolicy="no-referrer"
                  className="max-w-full h-auto max-h-[580px] w-auto object-contain mx-auto block transition-transform duration-200 group-hover:scale-[1.01]"
                />
                <span className="pointer-events-none absolute right-2 bottom-2 md:right-3 md:bottom-3 inline-flex items-center gap-1.5 rounded-lg border-2 border-[#171716] bg-[#fffdf6]/95 px-2.5 py-1.5 text-xs sm:text-sm font-medium text-[#171716] shadow-[2px_2px_0_#171716] opacity-80 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 transition-opacity">
                  <ExpandIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Full screen</span>
                </span>
              </button>
            </div>
          ) : project.imageFit === "contain" ? (
            <div
              data-testid="study-hero-cover"
              className="mt-7 md:mt-10 w-full bg-[#f2efe6] py-1 md:py-2 flex justify-center"
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
                className="group relative block w-fit max-w-full cursor-zoom-in rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
              >
                <img
                  src={project.image}
                  alt={`${project.title}, ${project.subtitle}`}
                  referrerPolicy="no-referrer"
                  className={`w-full h-auto max-h-[560px] object-contain mx-auto block transition-transform duration-200 group-hover:scale-[1.01] ${
                    project.heroSurface === "blend-canvas"
                      ? "mix-blend-multiply brightness-[1.015]"
                      : project.heroSurface === "soft-feather"
                        ? "cover-edge-feather"
                        : ""
                  }`}
                />
                <span className="pointer-events-none absolute right-2 bottom-2 md:right-3 md:bottom-3 inline-flex items-center gap-1.5 rounded-lg border-2 border-[#171716] bg-[#fffdf6]/95 px-2.5 py-1.5 text-xs sm:text-sm font-medium text-[#171716] shadow-[2px_2px_0_#171716] opacity-80 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 transition-opacity">
                  <ExpandIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Full screen</span>
                </span>
              </button>
            </div>
          ) : (
            <div
              data-testid="study-hero-cover"
              className="mt-7 md:mt-10 overflow-hidden rounded-2xl bg-[#f2efe6] aspect-[16/10] md:aspect-[16/9] max-h-[540px] w-full"
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
                  alt={`${project.title}, ${project.subtitle}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-lg border-2 border-[#171716] bg-[#fffdf6]/95 px-2.5 py-1.5 text-xs sm:text-sm font-medium text-[#171716] shadow-[2px_2px_0_#171716] opacity-85 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 transition-opacity">
                  <ExpandIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Full screen</span>
                </span>
              </button>
            </div>
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
                <p
                  data-testid="study-live-url-title"
                  className="mt-1 text-[18px] md:text-[18px] leading-[1.5] font-medium text-[#171716]/85 truncate m-0"
                >
                  {project.liveUrlLabel ?? project.liveUrl.replace(/^https?:\/\//, "")}
                </p>
              </div>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={project.liveUrlLabel ?? "Live Site"}
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

      <CaseStudySectionTabs
        sections={sections}
        activeSectionId={activeSectionId}
        onJump={jumpToSection}
        containerClassName={SECTION_CONTAINER}
      />

      {project.editorialDocument ? (
        <section
          id="section-overview"
          data-testid="editorial-details-section"
          className="bg-[#f8f6ef] border-b border-[#171716]/12"
        >
          <div className={`${SECTION_CONTAINER} py-16 md:py-24 flex flex-col gap-10 md:gap-12`}>
            <div
              data-testid="overview-prose-block"
              className={`${OVERVIEW_PROSE_WRAPPER} flex flex-col gap-4 md:gap-5`}
            >
              <h2 className="font-display text-[30px] sm:text-[36px] md:text-[40px] font-medium tracking-[-0.02em] leading-[1.16] text-balance m-0">
                About the Publication
              </h2>
              {project.overview && (
                <div className="flex flex-col gap-5">
                  {splitParagraphs(project.overview).map((paragraph) => (
                    <p key={paragraph} className={EDITORIAL_BODY_CLASS}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {project.keyDesignAreas && project.keyDesignAreas.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {project.keyDesignAreas.map((area, idx) => (
                  <FloatCard key={area.title} className={EDITORIAL_CARD_CLASS}>
                    <p className={CARD_TAG_CLASS}>{formatCount(idx + 1)}</p>
                    <h3 className={`mt-2 ${CARD_TITLE_CLASS}`}>{area.title}</h3>
                    <p className={CARD_BODY_CLASS}>{area.detail}</p>
                  </FloatCard>
                ))}
              </div>
            )}

            <FloatCard className="rounded-2xl border border-[#171716]/16 bg-[#fffdf6] p-6 sm:p-8 shadow-[0_2px_12px_rgba(23,23,22,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <p className="text-[17px] leading-[1.6] text-[#171716]/74 m-0">
                Need editorial layout, booklet, or menu design for your brand?
              </p>
              <button
                type="button"
                onClick={() =>
                  onInquire(
                    "Product Design",
                    `Hi Sadman, I viewed ${project.title} in your Editorial portfolio and would love to discuss a similar publication project.`,
                  )
                }
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 border-[#171716] bg-[#171716] text-[#f2efe6] text-[16px] leading-[1.4] font-medium shadow-[3px_3px_0_#ff5b44] hover:-translate-y-0.5 hover:bg-[#ff5b44] hover:text-[#171716] hover:shadow-[3px_3px_0_#171716] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-150 whitespace-nowrap shrink-0 self-start sm:self-auto"
              >
                Inquire About Editorial Work <Arrow className="w-4 h-4" />
              </button>
            </FloatCard>
          </div>
        </section>
      ) : isRichStudy ? (
        <>
          {/* Project Overview + Full-Width Dashboard Portal + Editorial Quote + 4-Color Metrics */}
          <section
            id="section-overview"
            data-testid="project-overview-section"
            className="bg-[#f8f6ef] border-b border-[#171716]/12"
          >
            <div className={`${SECTION_CONTAINER} py-20 md:py-28 flex flex-col gap-10 md:gap-14`}>
              <div
                data-testid="overview-prose-block"
                className={`${OVERVIEW_PROSE_WRAPPER} flex flex-col gap-5 md:gap-6`}
              >
                <h2 className="font-display text-[30px] sm:text-[36px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.16] text-balance m-0">
                  Project Overview
                </h2>
                {project.overview && (
                  <div
                    data-testid="overview-details-text"
                    className="flex flex-col gap-6 md:gap-7"
                  >
                    {splitParagraphs(project.overview).map((paragraph) => (
                      <p key={paragraph} className={EDITORIAL_BODY_CLASS}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {project.overviewVisual && (
                <figure
                  data-testid="overview-portal-figure"
                  className="m-0 w-full flex flex-col gap-3.5"
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
                  <figcaption className="px-0.5 flex flex-col gap-1.5 w-full">
                    <p
                      data-testid="overview-portal-title"
                      className={CAPTION_TITLE_CLASS}
                    >
                      {project.overviewVisual.title}
                    </p>
                  </figcaption>
                </figure>
              )}

              {project.overviewVideo && (
                <figure
                  data-testid="overview-video-figure"
                  className="m-0 w-full flex flex-col gap-3.5"
                >
                  <FloatCard className="overflow-hidden rounded-xl md:rounded-2xl border-2 border-[#171716] shadow-[5px_5px_0_#171716] md:shadow-[7px_7px_0_#171716] bg-white">
                    <video
                      src={project.overviewVideo.src}
                      poster={project.overviewVideo.poster}
                      controls
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      aria-label={project.overviewVideo.title}
                      className="w-full h-auto block"
                    />
                  </FloatCard>
                  <figcaption className="px-0.5 flex flex-col gap-1.5 max-w-[64ch]">
                    <p className={CAPTION_TITLE_CLASS}>
                      {project.overviewVideo.title}
                    </p>
                    <p className={CAPTION_BODY_CLASS}>
                      {project.overviewVideo.caption}
                    </p>
                  </figcaption>
                </figure>
              )}

              {project.quote && (
                <FloatCard className="my-2 md:my-4 rounded-2xl border-2 border-[#171716] bg-[#fffdf6] shadow-[5px_5px_0_#d9442e] md:shadow-[7px_7px_0_#d9442e] px-6 py-8 sm:px-9 sm:py-10 md:px-14 md:py-14">
                  <blockquote
                    data-testid="overview-quote"
                    className="w-full max-w-[780px] text-left md:mx-auto m-0"
                  >
                    <span
                      aria-hidden="true"
                      className="block font-display text-[56px] md:text-[72px] leading-[0.65] text-[#d9442e] select-none mb-4 md:mb-5"
                    >
                      “
                    </span>
                    <p className="font-display text-[23px] sm:text-[27px] md:text-[33px] lg:text-[36px] font-medium leading-[1.42] md:leading-[1.35] tracking-[-0.02em] text-[#171716] m-0">
                      {project.quote}”
                    </p>
                    <footer className="mt-6 pt-5 md:mt-8 md:pt-6 border-t border-[#171716]/12 flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="w-7 h-[2.5px] rounded-full bg-[#d9442e] shrink-0"
                      />
                      <span className="text-[14.5px] md:text-[15.5px] font-medium text-[#171716]/68">
                        Sadman · Product Design Perspective
                      </span>
                    </footer>
                  </blockquote>
                </FloatCard>
              )}

              {project.metrics && project.metrics.length > 0 && (
                <div
                  data-testid="overview-metrics-grid"
                  className="pt-2 md:pt-3 grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-6"
                >
                  {project.metrics.map((metric, idx) => (
                    <FloatCard
                      key={metric.label}
                      className={`rounded-xl md:rounded-2xl border-2 border-[#171716] p-4 sm:p-5 md:p-7 shadow-[3px_3px_0_#171716] md:shadow-[4px_4px_0_#171716] ${
                        OVERVIEW_METRIC_COLORS[idx % OVERVIEW_METRIC_COLORS.length]
                      }`}
                    >
                      <p className="font-display text-[34px] sm:text-4xl md:text-[44px] font-semibold tracking-[-0.02em] tabular-nums text-[#171716] leading-none m-0">
                        {metric.value}
                      </p>
                      <p className="mt-2.5 md:mt-3.5 text-[16px] md:text-[17px] leading-[1.6] text-[#171716]/82 m-0">
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
              id="section-background"
              data-testid="background-section"
              className="bg-[#f2efe6] border-b border-[#171716]/12"
            >
              <div className={`${SECTION_CONTAINER} py-20 md:py-28 flex flex-col gap-9 md:gap-11`}>
                <div className="flex items-end justify-between gap-4 md:block">
                  <div className={`${EDITORIAL_PROSE_WRAPPER} flex flex-col gap-3.5`}>
                    <h2 className="font-display text-[30px] sm:text-[36px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.16] text-balance m-0">
                      Background
                    </h2>
                    {project.backgroundIntro && (
                      <p className={EDITORIAL_BODY_CLASS}>
                        {project.backgroundIntro}
                      </p>
                    )}
                  </div>
                  <span className="md:hidden text-[14px] font-medium uppercase tracking-[0.07em] leading-[1.5] text-[#d9442e] shrink-0 whitespace-nowrap">
                    Swipe →
                  </span>
                </div>

                {/* Horizontal snap-scroll cards on mobile, spacious 2-col grid on tablet & desktop */}
                <div
                  data-testid="background-cards-strip"
                  className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pt-2 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 no-scrollbar md:mx-0 md:px-0 md:pt-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-2 md:gap-6"
                >
                  {project.backgroundMilestones.map((item) => (
                    <FloatCard
                      key={item.tag}
                      className={`w-[82vw] max-w-[310px] shrink-0 snap-start md:w-auto md:max-w-none ${EDITORIAL_CARD_CLASS}`}
                    >
                      <p className={CARD_TAG_CLASS}>{item.tag}</p>
                      <h3 className={`mt-2 ${CARD_TITLE_CLASS}`}>
                        {item.title}
                      </h3>
                      <p className={CARD_BODY_CLASS}>{item.detail}</p>
                    </FloatCard>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* The Challenge + Initial Architecture Planning Sketch */}
          {project.challengePoints && project.challengePoints.length > 0 && (
            <section
              id="section-challenge"
              data-testid="challenge-section"
              className="bg-[#f8f6ef] border-b border-[#171716]/12"
            >
              <div className={`${SECTION_CONTAINER} py-20 md:py-28 flex flex-col gap-9 md:gap-11`}>
                <div className="flex items-end justify-between gap-4 md:block">
                  <div className={`${EDITORIAL_PROSE_WRAPPER} flex flex-col gap-3.5`}>
                    <h2 className="font-display text-[30px] sm:text-[36px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.16] text-balance m-0">
                      The Challenge
                    </h2>
                    {project.challengeIntro && (
                      <p className={EDITORIAL_BODY_CLASS}>
                        {project.challengeIntro}
                      </p>
                    )}
                  </div>
                  <span className="md:hidden text-[14px] font-medium uppercase tracking-[0.07em] leading-[1.5] text-[#d9442e] shrink-0 whitespace-nowrap">
                    Swipe →
                  </span>
                </div>

                {/* Horizontal snap-scroll cards on mobile, balanced 2x2 for 4 cards or 3-col grid on tablet & desktop */}
                <div
                  data-testid="challenge-cards-strip"
                  className={`flex overflow-x-auto snap-x snap-mandatory gap-3.5 pt-2 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 no-scrollbar md:mx-0 md:px-0 md:pt-0 md:pb-0 md:overflow-visible md:grid md:gap-6 ${
                    project.challengePoints.length === 4
                      ? "md:grid-cols-2"
                      : "md:grid-cols-3"
                  }`}
                >
                  {project.challengePoints.map((point) => (
                    <FloatCard
                      key={point.title}
                      className={`w-[82vw] max-w-[310px] shrink-0 snap-start md:w-auto md:max-w-none ${EDITORIAL_CARD_CLASS}`}
                    >
                      <h3 className={CARD_TITLE_CLASS}>{point.title}</h3>
                      <p className={CARD_BODY_CLASS}>{point.detail}</p>
                    </FloatCard>
                  ))}
                </div>

                {/* Initial Architecture Planning Sketch — Clear inner separation below cards */}
                {project.challengeVisual && (
                  <div className="mt-2 pt-10 md:mt-4 md:pt-12 border-t border-[#171716]/10">
                    <figure
                      data-testid="challenge-architecture-figure"
                      className="m-0 w-full flex flex-col gap-3.5"
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

                      <figcaption className="px-0.5 flex flex-col gap-1.5 w-full">
                        <div className="flex items-center justify-between gap-3">
                          <p className={CAPTION_TITLE_CLASS}>
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
                            className="inline-flex items-center gap-1.5 text-[13.5px] font-normal text-[#171716]/55 hover:text-[#d9442e] transition-colors shrink-0 cursor-zoom-in"
                          >
                            <ExpandIcon className="w-3.5 h-3.5" />
                            <span>Full screen</span>
                          </button>
                        </div>
                        <p className={`max-w-[64ch] ${CAPTION_BODY_CLASS}`}>
                          {project.challengeVisual.caption}
                        </p>
                      </figcaption>
                    </figure>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* My Contribution + Full-Width Selected Interfaces Gallery */}
          {project.contributions && project.contributions.length > 0 && (
            <section
              id="section-contribution"
              data-testid="contributions-section"
              className="bg-[#f2efe6] border-b border-[#171716]/12"
            >
              <div className={`${SECTION_CONTAINER} py-20 md:py-28 flex flex-col gap-10 md:gap-12`}>
                <div className={`${EDITORIAL_PROSE_WRAPPER} flex flex-col gap-3.5`}>
                  <h2 className="font-display text-[30px] sm:text-[36px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.16] text-balance m-0">
                    My Contribution
                  </h2>
                  {project.contributionsIntro && (
                    <p className={EDITORIAL_BODY_CLASS}>
                      {project.contributionsIntro}
                    </p>
                  )}
                </div>

                {/* Full-Width Horizontal UI Showcase — Matches Key Design Areas button & caption layout */}
                {galleryItems.length > 0 && activeMobileScreen && (
                  <div
                    data-testid="contribution-interface-gallery"
                    className="w-full flex flex-col gap-4 md:gap-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-[13.5px] md:text-[13px] font-medium uppercase tracking-[0.09em] leading-[1.4] text-[#171716]/55 m-0">
                        {project.contributionGalleryHeading ?? "Selected Interfaces"}
                      </h3>

                      <div className="flex items-center gap-2.5">
                        <span
                          data-testid="screen-counter"
                          className="text-sm md:text-[15px] font-medium tabular-nums text-[#171716]/60 mr-0.5 whitespace-nowrap"
                        >
                          {formatCount(safeScreenIndex + 1)} / {formatCount(galleryItems.length)}
                        </span>
                        <span className="md:hidden text-[13.5px] font-medium uppercase tracking-[0.07em] text-[#d9442e] whitespace-nowrap">
                          Swipe →
                        </span>
                        <div className="hidden md:flex items-center gap-2">
                          <button
                            type="button"
                            data-testid="interface-prev-btn"
                            onClick={() =>
                              setActiveScreenIndex((prev) =>
                                getNextSlideIndex(prev, -1, galleryItems.length),
                              )
                            }
                            aria-label="Previous interface screen"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-[#171716] bg-[#fffdf6] text-[15px] font-medium text-[#171716] shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 hover:bg-[#171716] hover:text-[#f2efe6] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150"
                          >
                            <ChevronIcon direction="left" className="w-4 h-4" />
                            <span>Prev</span>
                          </button>
                          <button
                            type="button"
                            data-testid="interface-next-btn"
                            onClick={() =>
                              setActiveScreenIndex((prev) =>
                                getNextSlideIndex(prev, 1, galleryItems.length),
                              )
                            }
                            aria-label="Next interface screen"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-[#171716] bg-[#fffdf6] text-[15px] font-medium text-[#171716] shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 hover:bg-[#ff5b44] hover:text-[#171716] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150"
                          >
                            <span>Next</span>
                            <ChevronIcon direction="right" className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Full-width swipeable & clickable active UI screenshot + inline caption & Full screen action */}
                    <figure
                      data-testid="active-interface-figure"
                      className="m-0 flex flex-col gap-3.5"
                    >
                      <FloatCard className="overflow-hidden rounded-xl md:rounded-2xl border-2 border-[#171716] shadow-[5px_5px_0_#171716] md:shadow-[6px_6px_0_#171716] bg-[#1a3353]">
                        <button
                          type="button"
                          data-testid="active-interface-open-btn"
                          onTouchStart={(event) => {
                            if (event.touches.length !== 1) return;
                            interfaceSwipeStartXRef.current = event.touches[0].clientX;
                            interfaceSwipedRef.current = false;
                          }}
                          onTouchMove={(event) => {
                            if (
                              interfaceSwipeStartXRef.current === null ||
                              event.touches.length !== 1
                            ) {
                              return;
                            }
                            if (
                              Math.abs(
                                event.touches[0].clientX - interfaceSwipeStartXRef.current,
                              ) > 12
                            ) {
                              interfaceSwipedRef.current = true;
                            }
                          }}
                          onTouchEnd={(event) => {
                            if (
                              interfaceSwipeStartXRef.current === null ||
                              event.changedTouches.length === 0
                            ) {
                              return;
                            }
                            const deltaX =
                              event.changedTouches[0].clientX -
                              interfaceSwipeStartXRef.current;
                            interfaceSwipeStartXRef.current = null;
                            if (galleryItems.length > 1 && Math.abs(deltaX) > 44) {
                              setActiveScreenIndex((prev) =>
                                getNextSlideIndex(
                                  prev,
                                  deltaX < 0 ? 1 : -1,
                                  galleryItems.length,
                                ),
                              );
                            }
                          }}
                          onPointerDown={(event) => {
                            if (event.pointerType === "touch") return;
                            interfaceSwipeStartXRef.current = event.clientX;
                            interfaceSwipedRef.current = false;
                          }}
                          onPointerMove={(event) => {
                            if (event.pointerType === "touch") return;
                            if (interfaceSwipeStartXRef.current === null) return;
                            if (Math.abs(event.clientX - interfaceSwipeStartXRef.current) > 12) {
                              interfaceSwipedRef.current = true;
                            }
                          }}
                          onPointerUp={(event) => {
                            if (event.pointerType === "touch") return;
                            if (interfaceSwipeStartXRef.current === null) return;
                            const deltaX = event.clientX - interfaceSwipeStartXRef.current;
                            interfaceSwipeStartXRef.current = null;
                            if (galleryItems.length > 1 && Math.abs(deltaX) > 48) {
                              setActiveScreenIndex((prev) =>
                                getNextSlideIndex(prev, deltaX < 0 ? 1 : -1, galleryItems.length),
                              );
                            }
                          }}
                          onPointerCancel={() => {
                            interfaceSwipeStartXRef.current = null;
                          }}
                          onClick={() => {
                            if (interfaceSwipedRef.current) {
                              interfaceSwipedRef.current = false;
                              return;
                            }
                            setFullscreen({ mode: "gallery", index: safeScreenIndex });
                          }}
                          aria-label={`View full screen: ${activeMobileScreen.title}`}
                          className="group relative block w-full cursor-zoom-in text-left touch-pan-y focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
                        >
                          <img
                            src={activeMobileScreen.src}
                            alt={activeMobileScreen.title}
                            draggable={false}
                            referrerPolicy="no-referrer"
                            className="w-full h-auto block select-none"
                          />
                        </button>
                      </FloatCard>

                      <figcaption className="px-0.5 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-3">
                          <p
                            data-testid="active-interface-caption"
                            className={CAPTION_TITLE_CLASS}
                          >
                            {activeMobileScreen.title}
                          </p>
                          <button
                            type="button"
                            data-testid="active-interface-fullscreen-btn"
                            onClick={() =>
                              setFullscreen({ mode: "gallery", index: safeScreenIndex })
                            }
                            aria-label={`Expand ${activeMobileScreen.title}`}
                            className="inline-flex items-center gap-1.5 text-[13.5px] font-normal text-[#171716]/55 hover:text-[#d9442e] transition-colors shrink-0 cursor-zoom-in"
                          >
                            <ExpandIcon className="w-3.5 h-3.5" />
                            <span>Full screen</span>
                          </button>
                        </div>
                      </figcaption>
                    </figure>

                    {/* Horizontal screen selector strip — generous breathing room below caption */}
                    <div
                      data-testid="interface-thumbnails-strip"
                      className="mt-2 md:mt-3 flex overflow-x-auto snap-x snap-mandatory gap-2.5 pt-1 pb-1 no-scrollbar md:grid md:grid-flow-col md:auto-cols-fr md:gap-3.5 md:overflow-visible md:pb-0"
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
                              className={`hidden md:block mt-2.5 text-[12.5px] font-normal truncate transition-colors ${
                                isSelected ? "text-[#d9442e] font-medium" : "text-[#171716]/62"
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

                {/* Contribution Detail Cards — Clean inner sub-section break below gallery */}
                <div className="mt-2 pt-10 md:mt-4 md:pt-12 border-t border-[#171716]/10 space-y-5 md:space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[13.5px] md:text-[13px] font-medium uppercase tracking-[0.09em] leading-[1.4] text-[#171716]/55 m-0">
                      Key Areas Delivered
                    </h3>
                    <span className="md:hidden text-[14px] font-medium uppercase tracking-[0.07em] leading-[1.5] text-[#d9442e] shrink-0 whitespace-nowrap">
                      Swipe →
                    </span>
                  </div>

                  <div
                    data-testid="contributions-cards-strip"
                    className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pt-1 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 no-scrollbar md:mx-0 md:px-0 md:pt-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-2 md:gap-6"
                  >
                    {project.contributions.map((item) => (
                      <FloatCard
                        key={item.title}
                        className={`w-[86vw] max-w-[338px] shrink-0 snap-start md:w-auto md:max-w-none ${EDITORIAL_CARD_CLASS}`}
                      >
                        <h4 className={CARD_TITLE_CLASS}>{item.title}</h4>
                        <p className={CARD_BODY_CLASS}>{item.detail}</p>
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

          {/* Design Process / Exploration */}
          {((project.processSteps && project.processSteps.length > 0) ||
            processVisuals.length > 0) && (
            <section
              id="section-process"
              data-testid="design-process-section"
              className="bg-[#f2efe6] border-b border-[#171716]/12"
            >
              <div className={`${SECTION_CONTAINER} py-20 md:py-28 flex flex-col gap-9 md:gap-11`}>
                <div className={`${EDITORIAL_PROSE_WRAPPER} flex flex-col gap-3.5`}>
                  <h2 className="font-display text-[30px] sm:text-[36px] md:text-[40px] font-medium tracking-[-0.02em] leading-[1.18] text-balance m-0">
                    {project.processHeading ?? "Design Process"}
                  </h2>
                  {project.processIntro && (
                    <p className={EDITORIAL_BODY_CLASS}>{project.processIntro}</p>
                  )}
                </div>

                {processVisuals.length > 1 ? (
                  <KeyDesignAreasCarousel
                    visuals={processVisuals}
                    testIdPrefix="process"
                    eyebrow={project.processEyebrow ?? "UX Sketches & Flows"}
                    onOpenFullscreen={(index) =>
                      setFullscreen({ mode: "process-visuals", index })
                    }
                  />
                ) : processVisuals.length === 1 ? (
                  <figure
                    data-testid="design-process-figure"
                    className="m-0 w-full flex flex-col gap-3.5"
                  >
                    <FloatCard className="overflow-hidden rounded-xl md:rounded-2xl border-2 border-[#171716] bg-white p-2 sm:p-3 md:p-5 shadow-[4px_4px_0_#171716] md:shadow-[6px_6px_0_#171716]">
                      <button
                        type="button"
                        data-testid="design-process-open-btn"
                        onClick={() =>
                          setFullscreen({
                            mode: "single",
                            src: processVisuals[0].src,
                            title: processVisuals[0].title,
                            caption: processVisuals[0].caption,
                            lightBg: true,
                          })
                        }
                        aria-label={`View full screen: ${processVisuals[0].title}`}
                        className="group relative block w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
                      >
                        <img
                          src={processVisuals[0].src}
                          alt={processVisuals[0].title}
                          referrerPolicy="no-referrer"
                          className="w-full h-auto block rounded-lg"
                        />
                      </button>
                    </FloatCard>

                    <figcaption className="px-0.5 flex flex-col gap-1.5 w-full">
                      <div className="flex items-center justify-between gap-3">
                        <p className={CAPTION_TITLE_CLASS}>
                          {processVisuals[0].title}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setFullscreen({
                              mode: "single",
                              src: processVisuals[0].src,
                              title: processVisuals[0].title,
                              caption: processVisuals[0].caption,
                              lightBg: true,
                            })
                          }
                          aria-label={`Expand ${processVisuals[0].title}`}
                          className="inline-flex items-center gap-1.5 text-[13.5px] font-normal text-[#171716]/55 hover:text-[#d9442e] transition-colors shrink-0 cursor-zoom-in"
                        >
                          <ExpandIcon className="w-3.5 h-3.5" />
                          <span>Full screen</span>
                        </button>
                      </div>
                      {processVisuals[0].caption && (
                        <p className={`max-w-[64ch] ${CAPTION_BODY_CLASS}`}>
                          {processVisuals[0].caption}
                        </p>
                      )}
                    </figcaption>
                  </figure>
                ) : null}

                {/* Clean inner sub-section break between workflow visual and stage cards */}
                {project.processSteps && project.processSteps.length > 0 && (
                  <div
                    className={
                      processVisuals.length > 0
                        ? "mt-2 pt-10 md:mt-4 md:pt-12 border-t border-[#171716]/10 space-y-5 md:space-y-6"
                        : "space-y-5 md:space-y-6"
                    }
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-[13.5px] md:text-[13px] font-medium uppercase tracking-[0.09em] leading-[1.4] text-[#171716]/55 m-0">
                        Workflow Stages
                      </h3>
                      <span className="md:hidden text-[14px] font-medium uppercase tracking-[0.07em] leading-[1.5] text-[#d9442e] shrink-0 whitespace-nowrap">
                        Swipe →
                      </span>
                    </div>

                    <div
                      data-testid="design-process-cards-strip"
                      className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pt-1 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 no-scrollbar md:mx-0 md:px-0 md:pt-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-2 md:gap-6"
                    >
                      {project.processSteps.map((step) => (
                        <FloatCard
                          key={step.phase}
                          className={`w-[84vw] max-w-[328px] shrink-0 snap-start md:w-auto md:max-w-none ${EDITORIAL_CARD_CLASS}`}
                        >
                          <p className={CARD_TAG_CLASS}>{step.phase}</p>
                          <h4 className={`mt-2 ${CARD_TITLE_CLASS}`}>
                            {step.title}
                          </h4>
                          <p className={CARD_BODY_CLASS}>{step.detail}</p>
                        </FloatCard>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Key Design Areas + Full-Width Multi-Module System Visual */}
          {project.keyDesignAreas && project.keyDesignAreas.length > 0 && (
            <section
              id="section-key-areas"
              data-testid="key-design-areas-section"
              className="bg-[#f8f6ef] border-b border-[#171716]/12"
            >
              <div className={`${SECTION_CONTAINER} py-20 md:py-28 flex flex-col gap-9 md:gap-11`}>
                <div className={`${EDITORIAL_PROSE_WRAPPER} flex flex-col gap-3.5`}>
                  <h2 className="font-display text-[30px] sm:text-[36px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.16] text-balance m-0">
                    {project.keyDesignAreasHeading ?? "Key Design Areas"}
                  </h2>
                  {project.keyDesignAreasIntro && (
                    <p className={EDITORIAL_BODY_CLASS}>
                      {project.keyDesignAreasIntro}
                    </p>
                  )}
                </div>

                {kdaIntroVisuals.length > 0 && (
                  <KeyDesignAreasCarousel
                    visuals={kdaIntroVisuals}
                    onOpenFullscreen={(index) =>
                      setFullscreen({ mode: "kda-intro", index })
                    }
                  />
                )}

                {/* Clean inner sub-section break between workflow visual and module cards */}
                <div
                  className={
                    kdaIntroVisuals.length > 0
                      ? "mt-2 pt-10 md:mt-4 md:pt-12 border-t border-[#171716]/10 space-y-5 md:space-y-6"
                      : "space-y-5 md:space-y-6"
                  }
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-[13.5px] md:text-[13px] font-medium uppercase tracking-[0.09em] leading-[1.4] text-[#171716]/55 m-0">
                      {project.keyDesignAreasSubheading ?? "Core Modules"}
                    </h3>
                    <span className="md:hidden text-[14px] font-medium uppercase tracking-[0.07em] leading-[1.5] text-[#d9442e] shrink-0 whitespace-nowrap">
                      Swipe →
                    </span>
                  </div>

                  <div
                    data-testid="key-design-areas-cards"
                    className={`flex overflow-x-auto snap-x snap-mandatory gap-3.5 pt-1 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 no-scrollbar md:mx-0 md:px-0 md:pt-0 md:pb-0 md:overflow-visible md:grid md:gap-6 ${
                      project.keyDesignAreas.length === 3
                        ? "md:grid-cols-3"
                        : "md:grid-cols-2"
                    }`}
                  >
                    {project.keyDesignAreas.map((area) => (
                      <FloatCard
                        key={area.title}
                        className={`w-[86vw] max-w-[338px] shrink-0 snap-start md:w-auto md:max-w-none ${EDITORIAL_CARD_CLASS}`}
                      >
                        <div className="flex items-start justify-between gap-3.5">
                          <h4 className={CARD_TITLE_CLASS}>{area.title}</h4>
                          <span
                            data-testid="kda-animated-icon"
                            className="w-9 h-9 md:w-10 md:h-10 rounded-xl border border-[#171716]/14 bg-[#f2efe6] text-[#171716] grid place-items-center shrink-0"
                          >
                            <KeyDesignAreaIcon title={area.title} />
                          </span>
                        </div>
                        <p className={CARD_BODY_CLASS}>{area.detail}</p>
                      </FloatCard>
                    ))}
                  </div>
                </div>

                {project.keyDesignAreasVisual && (
                  <div className="mt-2 pt-10 md:mt-4 md:pt-12 border-t border-[#171716]/10">
                    <figure
                      data-testid="key-design-areas-figure"
                      className="m-0 w-full flex flex-col gap-3.5"
                    >
                      {project.heroSurface === "screen-frame" ? (
                        <FloatCard className="overflow-hidden rounded-xl md:rounded-2xl border-2 border-[#171716] bg-white shadow-[5px_5px_0_#171716] md:shadow-[6px_6px_0_#171716]">
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
                            className="group relative block w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
                          >
                            <img
                              src={project.keyDesignAreasVisual.src}
                              alt={project.keyDesignAreasVisual.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-auto block transition-transform duration-200 group-hover:scale-[1.008]"
                            />
                            <span className="pointer-events-none absolute right-3 top-3 md:right-4 md:top-4 inline-flex items-center gap-1.5 rounded-lg border-2 border-[#171716] bg-[#fffdf6]/95 px-2.5 py-1.5 text-[13px] font-medium text-[#171716] shadow-[2px_2px_0_#171716] opacity-80 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 transition-opacity">
                              <ExpandIcon className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Full screen</span>
                            </span>
                          </button>
                        </FloatCard>
                      ) : (
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
                      )}
                      <figcaption className="px-0.5 flex flex-col gap-1.5 max-w-[64ch]">
                        <p className={CAPTION_TITLE_CLASS}>
                          {project.keyDesignAreasVisual.title}
                        </p>
                        <p className={CAPTION_BODY_CLASS}>
                          {project.keyDesignAreasVisual.caption}
                        </p>
                      </figcaption>
                    </figure>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* From Old System to Upscaled Product */}
          {project.beforeAfter && project.beforeAfter.length > 0 && (
            <section
              id="section-before-after"
              data-testid="before-after-section"
              className="bg-[#f2efe6] border-b border-[#171716]/12"
            >
              <div className={`${SECTION_CONTAINER} py-20 md:py-28 flex flex-col gap-9 md:gap-11`}>
                <h2 className="font-display text-[30px] sm:text-[36px] md:text-[40px] font-medium tracking-[-0.02em] leading-[1.18] text-balance m-0">
                  From Old System to Upscaled Product
                </h2>

                <FloatCard className="overflow-hidden rounded-2xl border-2 border-[#171716] bg-[#fffdf6] shadow-[4px_4px_0_#171716]">
                  <div className="grid grid-cols-2 border-b-2 border-[#171716] bg-[#171716] text-[#f2efe6] text-[14px] md:text-[14.5px] font-medium uppercase tracking-[0.08em] leading-[1.5]">
                    <div className="px-4 py-3.5 md:px-8 md:py-4.5 border-r border-[#f2efe6]/20">
                      Before
                    </div>
                    <div className="px-4 py-3.5 md:px-8 md:py-4.5 text-[#c7ef45]">
                      After
                    </div>
                  </div>
                  <div className="divide-y divide-[#171716]/12">
                    {project.beforeAfter.map((row) => (
                      <div
                        key={row.before}
                        className="grid grid-cols-2 text-[16px] sm:text-[16.5px] md:text-[18px]"
                      >
                        <div className="px-4 py-4 md:px-8 md:py-6 border-r border-[#171716]/12 text-[#171716]/72 leading-[1.7] md:leading-[1.72]">
                          {row.before}
                        </div>
                        <div className="px-4 py-4 md:px-8 md:py-6 font-medium text-[#171716] leading-[1.7] md:leading-[1.72] bg-[#c7ef45]/15">
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
            id="section-outcomes"
            data-testid="scale-outcomes-section"
            className="bg-[#f8f6ef] border-b border-[#171716]/12"
          >
            <div className={`${SECTION_CONTAINER} py-20 md:py-28 flex flex-col gap-10 md:gap-12`}>
              {(project.scaleIntro ||
                (project.scaleMetrics && project.scaleMetrics.length > 0) ||
                project.outcomeVisual) && (
                <div className={`${EDITORIAL_PROSE_WRAPPER} flex flex-col gap-3.5`}>
                  <h2 className="font-display text-[30px] sm:text-[36px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.16] text-balance m-0">
                    Project Scale &amp; Outcomes
                  </h2>
                  {project.scaleIntro && (
                    <p className={EDITORIAL_BODY_CLASS}>
                      {project.scaleIntro}
                    </p>
                  )}
                </div>
              )}

              {project.scaleMetrics && project.scaleMetrics.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-6">
                  {project.scaleMetrics.map((metric, idx) => (
                    <FloatCard
                      key={metric.label}
                      className={`rounded-xl md:rounded-2xl border-2 border-[#171716] p-4 sm:p-5 md:p-7 shadow-[3px_3px_0_#171716] md:shadow-[4px_4px_0_#171716] ${
                        OVERVIEW_METRIC_COLORS[idx % OVERVIEW_METRIC_COLORS.length]
                      }`}
                    >
                      <p className="font-display text-[34px] sm:text-4xl md:text-[44px] font-semibold tracking-[-0.02em] tabular-nums text-[#171716] leading-none m-0">
                        {metric.value}
                      </p>
                      <p className="mt-2.5 md:mt-3.5 text-[16px] md:text-[17px] leading-[1.6] text-[#171716]/82 m-0">
                        {metric.label}
                      </p>
                    </FloatCard>
                  ))}
                </div>
              )}

              {project.outcomeVisual && (
                <div className="mt-2 pt-10 md:mt-4 md:pt-12 border-t border-[#171716]/10">
                  <figure
                    data-testid="scale-outcomes-figure"
                    className="m-0 w-full flex flex-col gap-3.5"
                  >
                    <button
                      type="button"
                      data-testid="scale-outcomes-open-btn"
                      onClick={() =>
                        setFullscreen({
                          mode: "single",
                          src: project.outcomeVisual!.src,
                          title: project.outcomeVisual!.title,
                          caption: project.outcomeVisual!.caption,
                          lightBg: true,
                        })
                      }
                      aria-label={`View full screen: ${project.outcomeVisual.title}`}
                      className="group relative block w-full cursor-zoom-in rounded-2xl bg-[#f2efe6] p-3 sm:p-5 md:p-7 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
                    >
                      <img
                        src={project.outcomeVisual.src}
                        alt={project.outcomeVisual.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-auto max-h-[600px] object-contain mx-auto block transition-transform duration-200 group-hover:scale-[1.01]"
                      />
                      <span className="pointer-events-none absolute right-3 bottom-3 md:right-4 md:bottom-4 inline-flex items-center gap-1.5 rounded-lg border-2 border-[#171716] bg-[#fffdf6]/95 px-2.5 py-1.5 text-[13px] font-medium text-[#171716] shadow-[2px_2px_0_#171716] opacity-80 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 transition-opacity">
                        <ExpandIcon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Full screen</span>
                      </span>
                    </button>
                    <figcaption className="px-0.5 flex flex-col gap-1.5 max-w-[64ch]">
                      <div className="flex items-center justify-between gap-3">
                        <p className={CAPTION_TITLE_CLASS}>
                          {project.outcomeVisual.title}
                        </p>
                      </div>
                      {project.outcomeVisual.caption && (
                        <p className={CAPTION_BODY_CLASS}>
                          {project.outcomeVisual.caption}
                        </p>
                      )}
                    </figcaption>
                  </figure>
                </div>
              )}

              {/* Calm, easy-on-the-eyes Reflection Panel */}
              <div className="pt-2 md:pt-4">
                <FloatCard
                  testId="reflection-section"
                  className="rounded-2xl border border-[#171716]/16 bg-[#fffdf6] p-6 sm:p-8 md:p-11 shadow-[0_2px_12px_rgba(23,23,22,0.04)]"
                >
                  <div className={EDITORIAL_PROSE_WRAPPER}>
                    <p className="text-[13.5px] md:text-[13px] font-medium uppercase tracking-[0.09em] leading-[1.4] text-[#d9442e] m-0">
                      Reflection
                    </p>
                    {project.reflection && (
                      <div className="mt-5 md:mt-6 flex flex-col gap-6 md:gap-7">
                        {splitParagraphs(project.reflection).map((paragraph) => (
                          <p
                            key={paragraph}
                            className="font-display text-[19px] sm:text-[20px] md:text-[22px] lg:text-[23px] font-normal leading-[1.9] md:leading-[1.78] tracking-[-0.01em] text-[#171716]/86 m-0"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-9 pt-7 md:mt-10 md:pt-8 border-t border-[#171716]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <p className="max-w-[44ch] text-[16px] md:text-[16px] leading-[1.75] text-[#171716]/68 m-0">
                      {project.liveUrl
                        ? "Explore the live platform or get in touch about similar product systems."
                        : "Get in touch to discuss research-led product design for complex public systems."}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-[#171716] bg-[#f2efe6] text-[#171716] text-[15.5px] md:text-[15.5px] leading-[1.4] font-medium shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 hover:bg-[#171716] hover:text-[#f2efe6] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-150 whitespace-nowrap"
                        >
                          Visit {project.liveUrlLabel ?? "Live Site"}{" "}
                          <Arrow className="w-4 h-4 -rotate-45" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          onInquire(
                            "Product Design",
                            `Hi Sadman, I read your case study for ${project.title} and would love to discuss a similar product project.`,
                          )
                        }
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-[#171716] bg-[#171716] text-[#f2efe6] text-[15.5px] md:text-[15.5px] leading-[1.4] font-medium shadow-[3px_3px_0_#ff5b44] hover:-translate-y-0.5 hover:bg-[#ff5b44] hover:text-[#171716] hover:shadow-[3px_3px_0_#171716] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-150 whitespace-nowrap"
                      >
                        Inquire About Similar Work <Arrow className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </FloatCard>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Standard Case Study Layout */}
          {project.metrics && project.metrics.length > 0 && (
            <section className="bg-[#f8f6ef] border-b border-[#171716]/12">
              <div className={`${SECTION_CONTAINER} py-16 md:py-20`}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 md:gap-6">
                  {project.metrics.map((metric, idx) => (
                    <FloatCard
                      key={metric.label}
                      className={`rounded-xl md:rounded-2xl border-2 border-[#171716] p-5 md:p-7 shadow-[3px_3px_0_#171716] md:shadow-[4px_4px_0_#171716] ${
                        OVERVIEW_METRIC_COLORS[idx % OVERVIEW_METRIC_COLORS.length]
                      } ${idx === 0 ? "col-span-2 md:col-span-1" : ""} ${
                        project.metrics!.length === 4 && idx === 3
                          ? "md:col-start-2"
                          : ""
                      }`}
                    >
                      <p className="font-display text-[34px] sm:text-4xl md:text-[44px] font-semibold tracking-[-0.02em] tabular-nums leading-none m-0">
                        {metric.value}
                      </p>
                      <p className="mt-2.5 md:mt-3.5 text-[16px] md:text-[17px] leading-[1.6] text-[#171716]/82 m-0">
                        {metric.label}
                      </p>
                    </FloatCard>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Challenge & Research Insights */}
          <section
            id="section-challenge"
            className="bg-[#f2efe6] border-b border-[#171716]/12"
          >
            <div className={`${SECTION_CONTAINER} py-20 md:py-28 flex flex-col gap-9 md:gap-11`}>
              <div className={`${EDITORIAL_PROSE_WRAPPER} flex flex-col gap-4`}>
                <h2 className="font-display text-[30px] sm:text-[36px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.16] text-balance m-0">
                  The Challenge
                </h2>
                <p className={EDITORIAL_BODY_CLASS}>{project.challenge}</p>
              </div>

              {project.researchInsights && project.researchInsights.length > 0 && (
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pt-2 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 no-scrollbar md:mx-0 md:px-0 md:pt-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-3 md:gap-6">
                  {project.researchInsights.map((insight, idx) => (
                    <FloatCard
                      key={insight}
                      className={`w-[86vw] max-w-[338px] shrink-0 snap-start md:w-auto md:max-w-none ${EDITORIAL_CARD_CLASS} ${
                        project.researchInsights!.length === 4 && idx === 3
                          ? "md:col-start-2"
                          : ""
                      }`}
                    >
                      <span className={CARD_TAG_CLASS}>
                        Insight {formatCount(idx + 1)}
                      </span>
                      <p className={CARD_BODY_CLASS}>{insight}</p>
                    </FloatCard>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Approach & Process */}
          <section
            id="section-approach"
            className="bg-[#f8f6ef] border-b border-[#171716]/12"
          >
            <div className={`${SECTION_CONTAINER} py-20 md:py-28 flex flex-col gap-9 md:gap-11`}>
              <div className={`${EDITORIAL_PROSE_WRAPPER} flex flex-col gap-4`}>
                <h2 className="font-display text-[30px] sm:text-[36px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.16] text-balance m-0">
                  Design Approach
                </h2>
                <p className={EDITORIAL_BODY_CLASS}>{project.approach}</p>
              </div>

              {project.processSteps && project.processSteps.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {project.processSteps.map((step) => (
                    <FloatCard key={step.phase} className={EDITORIAL_CARD_CLASS}>
                      <p className={CARD_TAG_CLASS}>{step.phase}</p>
                      <h3 className={`mt-2 ${CARD_TITLE_CLASS}`}>
                        {step.title}
                      </h3>
                      <p className={CARD_BODY_CLASS}>{step.detail}</p>
                    </FloatCard>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Key Decisions & Calm Outcome/Reflection */}
          <section
            id={project.keyDecisions && project.keyDecisions.length > 0 ? "section-decisions" : undefined}
            className="bg-[#f2efe6] border-b border-[#171716]/12"
          >
            <div className={`${SECTION_CONTAINER} py-20 md:py-28 flex flex-col gap-10 md:gap-12`}>
              {project.keyDecisions && project.keyDecisions.length > 0 && (
                <div className="flex flex-col gap-8 md:gap-9">
                  <h2 className="font-display text-[30px] sm:text-[36px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.16] text-balance m-0">
                    Key Decisions
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {project.keyDecisions.map((decision) => (
                      <FloatCard key={decision.title} className={EDITORIAL_CARD_CLASS}>
                        <h3 className={CARD_TITLE_CLASS}>{decision.title}</h3>
                        <p className={CARD_BODY_CLASS}>{decision.rationale}</p>
                      </FloatCard>
                    ))}
                  </div>
                </div>
              )}

              <div id="section-outcomes" className="pt-2 md:pt-4">
                <FloatCard
                  testId="reflection-section"
                  className="rounded-2xl border border-[#171716]/16 bg-[#fffdf6] p-6 sm:p-8 md:p-11 shadow-[0_2px_12px_rgba(23,23,22,0.04)]"
                >
                <div className={EDITORIAL_PROSE_WRAPPER}>
                  <p className="text-[13.5px] md:text-[13px] font-medium uppercase tracking-[0.09em] leading-[1.4] text-[#d9442e] m-0">
                    Outcome &amp; Reflection
                  </p>
                  <p className="mt-4 font-display text-[21px] md:text-[25px] font-normal leading-[1.6] md:leading-[1.52] tracking-[-0.015em] text-[#171716] m-0">
                    {project.outcome}
                  </p>
                  {project.reflection && (
                    <div className="mt-7 flex flex-col gap-6 md:gap-7">
                      {splitParagraphs(project.reflection).map((paragraph) => (
                        <p key={paragraph} className={EDITORIAL_BODY_CLASS}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
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
                        `Hi Sadman, I read your detailed case study for ${project.title} and would love to discuss a similar product project.`,
                      )
                    }
                    className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 border-[#171716] bg-[#171716] text-[#f2efe6] text-[16px] md:text-[16px] leading-[1.4] font-medium shadow-[3px_3px_0_#ff5b44] hover:-translate-y-0.5 hover:bg-[#ff5b44] hover:text-[#171716] hover:shadow-[3px_3px_0_#171716] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-150 whitespace-nowrap shrink-0 self-start sm:self-auto"
                  >
                    Inquire About Similar Work <Arrow className="w-4 h-4" />
                  </button>
                </div>
                </FloatCard>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Bottom Project Switcher */}
      {(prevProject || nextProject) && (
        <section aria-label="Adjacent projects" className="bg-[#f2efe6]">
          <div className={`${SECTION_CONTAINER} py-14 md:py-16`}>
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
              {fullscreen.mode === "kda-intro" && kdaIntroVisuals.length > 1 && (
                <p className="text-xs sm:text-sm text-[#f2efe6]/65 tabular-nums m-0">
                  {formatCount(fullscreen.index + 1)} / {formatCount(kdaIntroVisuals.length)}
                </p>
              )}
              {fullscreen.mode === "process-visuals" && processVisuals.length > 1 && (
                <p className="text-xs sm:text-sm text-[#f2efe6]/65 tabular-nums m-0">
                  {formatCount(fullscreen.index + 1)} / {formatCount(processVisuals.length)}
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
              (fullscreen.mode === "mobile" && mobileItems.length > 1) ||
              (fullscreen.mode === "kda-intro" && kdaIntroVisuals.length > 1) ||
              (fullscreen.mode === "process-visuals" && processVisuals.length > 1)) && (
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
                  } else if (fullscreen.mode === "kda-intro") {
                    const nextIdx =
                      (fullscreen.index - 1 + kdaIntroVisuals.length) %
                      kdaIntroVisuals.length;
                    setFullscreen({ mode: "kda-intro", index: nextIdx });
                  } else if (fullscreen.mode === "process-visuals") {
                    const nextIdx =
                      (fullscreen.index - 1 + processVisuals.length) %
                      processVisuals.length;
                    setFullscreen({ mode: "process-visuals", index: nextIdx });
                  }
                }}
                aria-label="Previous full screen image"
                className="absolute left-0 sm:left-2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#f2efe6]/35 bg-[#171716]/85 text-[#f2efe6] grid place-items-center hover:bg-[#f2efe6] hover:text-[#171716] transition-colors"
              >
                <ChevronIcon direction="left" className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            )}

            {"scrollable" in activeFullscreenImage &&
            activeFullscreenImage.scrollable ? (
              <div
                onClick={(event) => event.stopPropagation()}
                className="max-h-[74vh] md:max-h-[78vh] w-[min(86vw,410px)] overflow-y-auto overscroll-y-contain phone-screen-scroll rounded-2xl bg-white p-1.5 shadow-2xl"
              >
                <img
                  src={activeFullscreenImage.src}
                  alt={activeFullscreenImage.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto block rounded-xl"
                />
              </div>
            ) : (
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
            )}

            {((fullscreen.mode === "gallery" && galleryItems.length > 1) ||
              (fullscreen.mode === "mobile" && mobileItems.length > 1) ||
              (fullscreen.mode === "kda-intro" && kdaIntroVisuals.length > 1) ||
              (fullscreen.mode === "process-visuals" && processVisuals.length > 1)) && (
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
                  } else if (fullscreen.mode === "kda-intro") {
                    const nextIdx =
                      (fullscreen.index + 1) % kdaIntroVisuals.length;
                    setFullscreen({ mode: "kda-intro", index: nextIdx });
                  } else if (fullscreen.mode === "process-visuals") {
                    const nextIdx =
                      (fullscreen.index + 1) % processVisuals.length;
                    setFullscreen({ mode: "process-visuals", index: nextIdx });
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
