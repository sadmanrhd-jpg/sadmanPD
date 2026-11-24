import { useRef, useState } from "react";
import { DESIGN_PROJECTS, PHOTO_ITEMS, type View } from "../data/portfolio";
import {
  buildFeaturedHighlights,
  filterHighlights,
  type FeaturedHighlight,
  type HighlightFilter,
} from "../utils/portfolioLogic";
import { Arrow } from "./Characters";

interface HomeViewProps {
  onNavigate: (view: View) => void;
  onOpenContact: () => void;
  onOpenProject: (kind: "design" | "photo", id: string) => void;
}

const HIGHLIGHT_FILTERS: HighlightFilter[] = ["All", "Product Design", "Photography"];

function CurvedArrow({
  direction,
  active = false,
}: {
  direction: "right" | "left" | "mobile-down-right" | "mobile-left";
  active?: boolean;
}) {
  if (direction === "mobile-down-right") {
    return (
      <svg
        viewBox="0 0 44 36"
        aria-hidden="true"
        className={`w-9 h-7 sm:w-10 sm:h-8 md:w-14 md:h-11 fill-none stroke-[#171716] stroke-[1.9] shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:translate-y-1 group-active:translate-x-1 group-active:translate-y-1 ${
          active ? "translate-x-1 translate-y-1" : ""
        }`}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 7 C 19 6, 31 14, 35 28" />
        <path d="M28 24 L 35.5 29.5 L 38.5 20.5" />
      </svg>
    );
  }

  if (direction === "mobile-left") {
    return (
      <svg
        viewBox="0 0 46 30"
        aria-hidden="true"
        className={`w-9 h-6 sm:w-10 sm:h-7 md:w-14 md:h-9 fill-none stroke-[#171716] stroke-[1.9] shrink-0 transition-transform duration-200 group-hover:-translate-x-1 group-active:-translate-x-1 ${
          active ? "-translate-x-1" : ""
        }`}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M42 22 C 30 11, 18 10, 6 15" />
        <path d="M13 19 L 5 15.5 L 11 9.5" />
      </svg>
    );
  }

  if (direction === "left") {
    return (
      <svg
        viewBox="0 0 68 38"
        aria-hidden="true"
        className="w-11 h-7 xl:w-14 xl:h-8 fill-none stroke-[#171716] stroke-[2.2] shrink-0 transition-transform duration-200 group-hover:-translate-x-1 group-active:-translate-x-1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M63 14 C 46 6, 23 7, 7 21" />
        <path d="M17 24 L 6 22 L 11 12" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 68 38"
      aria-hidden="true"
      className="w-11 h-7 xl:w-14 xl:h-8 fill-none stroke-[#171716] stroke-[2.2] shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-active:translate-x-1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 21 C 22 6, 45 7, 61 20" />
      <path d="M51 11 L 62 20.5 L 50 23" />
    </svg>
  );
}

export function HomeView({
  onNavigate,
  onOpenContact,
  onOpenProject,
}: HomeViewProps) {
  const [highlightFilter, setHighlightFilter] = useState<HighlightFilter>("All");
  const [activeMobileRole, setActiveMobileRole] = useState<"design" | "photo" | null>(null);
  const standoutsRef = useRef<HTMLElement | null>(null);
  const allHighlights: FeaturedHighlight[] = buildFeaturedHighlights(
    DESIGN_PROJECTS,
    PHOTO_ITEMS,
  );
  const visibleHighlights = filterHighlights(allHighlights, highlightFilter);

  const handleScrollToStandouts = () => {
    const target = standoutsRef.current;
    if (!target) return;
    const header = document.querySelector("header");
    const headerHeight = header ? header.getBoundingClientRect().height : 80;
    const top = Math.max(
      0,
      target.getBoundingClientRect().top + window.scrollY - headerHeight,
    );
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <main className="bg-[#f2efe6] text-[#171716]">
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-10 min-h-[calc(100svh-82px)] pt-7 pb-10 sm:pt-8 sm:pb-12 md:pt-5 md:pb-8 lg:py-8 flex flex-col items-center justify-start gap-[120px] md:justify-start md:gap-9 lg:justify-center lg:gap-[34px] overflow-x-clip">
        <h1 className="sr-only">Sadman, Product Designer and Freelance Photographer</h1>

        <div className="w-full flex items-center justify-center">
          {/* Mobile & Tablet diagonal staggered hero */}
          <div
            data-testid="mobile-hero"
            className="lg:hidden relative w-full max-w-[372px] sm:max-w-[430px] md:max-w-[660px] h-[324px] sm:h-[364px] md:h-[468px] mx-auto"
          >
            <button
              type="button"
              onClick={() => onNavigate("design")}
              onPointerEnter={() => setActiveMobileRole("design")}
              onPointerLeave={() => setActiveMobileRole(null)}
              onPointerDown={() => setActiveMobileRole("design")}
              onPointerUp={() => setActiveMobileRole(null)}
              onPointerCancel={() => setActiveMobileRole(null)}
              onFocus={() => setActiveMobileRole("design")}
              onBlur={() => setActiveMobileRole(null)}
              aria-label="Product Designer: Explore Product Design work"
              className="group absolute top-0 md:top-0 left-[21%] sm:left-[23%] md:left-[15%] flex items-start gap-1 md:gap-2 p-1 rounded-xl cursor-pointer transition-transform duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5b44]"
            >
              <span className="text-left leading-none">
                <span className="block font-display text-[25px] sm:text-[28px] md:text-[38px] font-semibold leading-[1.03] tracking-[-0.025em] text-[#e84c35]">
                  Product
                </span>
                <span
                  className={`block font-display text-[25px] sm:text-[28px] md:text-[38px] font-semibold leading-[1.03] tracking-[-0.025em] transition-colors duration-200 group-hover:text-[#e84c35] group-active:text-[#e84c35] ${
                    activeMobileRole === "design" ? "text-[#e84c35]" : "text-[#171716]"
                  }`}
                >
                  Designer
                </span>
              </span>
              <span className="mt-2 sm:mt-2.5 md:mt-4 -ml-1 pointer-events-none">
                <CurvedArrow
                  direction="mobile-down-right"
                  active={activeMobileRole === "design"}
                />
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("design")}
              onPointerEnter={() => setActiveMobileRole("design")}
              onPointerLeave={() => setActiveMobileRole(null)}
              onPointerDown={() => setActiveMobileRole("design")}
              onPointerUp={() => setActiveMobileRole(null)}
              onPointerCancel={() => setActiveMobileRole(null)}
              onFocus={() => setActiveMobileRole("design")}
              onBlur={() => setActiveMobileRole(null)}
              aria-label="Explore Product Design work"
              className="group absolute top-[38px] sm:top-[44px] md:top-[38px] right-0 p-1 rounded-2xl cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5b44]"
            >
              <div
                className={`h-[192px] sm:h-[214px] md:h-[272px] aspect-[78/100] overflow-hidden transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-[1.03] group-active:-translate-y-1 group-active:scale-[0.98] designer-float ${
                  activeMobileRole === "design" ? "-translate-y-2 scale-[1.03]" : ""
                }`}
              >
                <img
                  src="/assets/aistudio/Giant-headed_product_designer_with_stylus-1_ac847ac5.png"
                  alt="Sadman as a product designer holding a stylus and tablet"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center select-none pointer-events-none"
                />
              </div>
            </button>

            <div
              data-testid="mobile-vs-badge"
              aria-hidden="true"
              className="absolute top-[126px] sm:top-[142px] md:top-[196px] left-[45%] md:left-[47%] -translate-x-1/2 z-10 cursor-default select-none"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-[#171716] text-[#f2efe6] border-[3px] border-[#f2efe6] shadow-[0_0_0_2px_#171716] grid place-items-center font-display font-semibold text-sm sm:text-base md:text-xl tracking-tight">
                VS
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate("photo")}
              onPointerEnter={() => setActiveMobileRole("photo")}
              onPointerLeave={() => setActiveMobileRole(null)}
              onPointerDown={() => setActiveMobileRole("photo")}
              onPointerUp={() => setActiveMobileRole(null)}
              onPointerCancel={() => setActiveMobileRole(null)}
              onFocus={() => setActiveMobileRole("photo")}
              onBlur={() => setActiveMobileRole(null)}
              aria-label="Explore Freelance Photography work"
              className="group absolute bottom-0 left-0 px-1 pt-1 pb-0 rounded-2xl cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169ed]"
            >
              <div
                className={`h-[192px] sm:h-[214px] md:h-[272px] aspect-[62/100] overflow-hidden transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-[1.03] group-active:-translate-y-1 group-active:scale-[0.98] photographer-float ${
                  activeMobileRole === "photo" ? "-translate-y-2 scale-[1.03]" : ""
                }`}
              >
                <img
                  src="/assets/aistudio/Big-Headed_Photographer_with_Oversized_Camera-2_5ee8ef09.png"
                  alt="Sadman as a freelance photographer holding a camera"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-[42%_center] select-none pointer-events-none"
                />
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("photo")}
              onPointerEnter={() => setActiveMobileRole("photo")}
              onPointerLeave={() => setActiveMobileRole(null)}
              onPointerDown={() => setActiveMobileRole("photo")}
              onPointerUp={() => setActiveMobileRole(null)}
              onPointerCancel={() => setActiveMobileRole(null)}
              onFocus={() => setActiveMobileRole("photo")}
              onBlur={() => setActiveMobileRole(null)}
              aria-label="Freelance Photographer: Explore Freelance Photography work"
              className="group absolute bottom-[2px] sm:bottom-[4px] md:bottom-[14px] left-[32%] sm:left-[33%] md:left-[34%] flex items-center gap-1 md:gap-2 px-1 pt-1 pb-0 rounded-xl cursor-pointer transition-transform duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169ed]"
            >
              <span className="mt-2 md:mt-3 pointer-events-none">
                <CurvedArrow
                  direction="mobile-left"
                  active={activeMobileRole === "photo"}
                />
              </span>
              <span className="text-left leading-none">
                <span className="block font-display text-[25px] sm:text-[28px] md:text-[38px] font-semibold leading-[1.03] tracking-[-0.025em] text-[#4169ed]">
                  Freelance
                </span>
                <span
                  className={`block font-display text-[25px] sm:text-[28px] md:text-[38px] font-semibold leading-[1.03] tracking-[-0.025em] transition-colors duration-200 group-hover:text-[#4169ed] group-active:text-[#4169ed] ${
                    activeMobileRole === "photo" ? "text-[#4169ed]" : "text-[#171716]"
                  }`}
                >
                  Photographer
                </span>
              </span>
            </button>
          </div>

          {/* Desktop horizontal 5-part hero */}
          <div className="hidden lg:flex w-full flex-row items-center justify-center gap-4 xl:gap-8">
            <button
              type="button"
              data-testid="desktop-design-role"
              onClick={() => onNavigate("design")}
              aria-label="Explore Product Design work"
              className="group relative flex items-center justify-end gap-2 px-1 py-0 rounded-2xl cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
            >
              <span className="relative inline-block text-left shrink-0 px-3.5 py-2 xl:px-4 xl:py-2.5">
                {/* Coral Corner-Handle Selection Frame on hover */}
                <span
                  aria-hidden="true"
                  data-testid="design-title-frame"
                  className="pointer-events-none absolute inset-0 border-2 border-[#ef4b33] opacity-0 scale-[0.96] transition-all duration-200 ease-out group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100"
                >
                  <span className="absolute -top-[6px] -left-[6px] w-[11px] h-[11px] border-2 border-[#ef4b33] bg-[#f2efe6]" />
                  <span className="absolute -top-[6px] -right-[6px] w-[11px] h-[11px] border-2 border-[#ef4b33] bg-[#f2efe6]" />
                  <span className="absolute -bottom-[6px] -left-[6px] w-[11px] h-[11px] border-2 border-[#ef4b33] bg-[#f2efe6]" />
                  <span className="absolute -bottom-[6px] -right-[6px] w-[11px] h-[11px] border-2 border-[#ef4b33] bg-[#f2efe6]" />
                </span>
                <span className="block font-display text-[clamp(26px,2.75vw,43px)] font-semibold leading-[1.03] tracking-[-0.025em] text-[#e84c35]">
                  Product
                </span>
                <span className="block font-display text-[clamp(26px,2.75vw,43px)] font-semibold leading-[1.03] tracking-[-0.025em] text-[#171716] group-hover:text-[#e84c35] transition-colors">
                  Designer
                </span>
              </span>

              <span className="shrink-0 ml-0.5 -mt-8 xl:ml-1 xl:-mt-9 z-10 pointer-events-none">
                <CurvedArrow direction="right" />
              </span>

              <div className="h-[clamp(275px,28.5vw,420px)] aspect-[78/100] shrink-0 overflow-hidden transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-[1.02] designer-float">
                <img
                  src="/assets/aistudio/Giant-headed_product_designer_with_stylus-1_ac847ac5.png"
                  alt="Sadman as a product designer holding a stylus and tablet"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center select-none pointer-events-none"
                />
              </div>
            </button>

            <div
              data-testid="hero-vs-badge"
              className="relative z-10 flex items-center justify-center shrink-0 px-1 cursor-default select-none"
              aria-hidden="true"
            >
              <div className="w-14 h-14 rounded-full bg-[#171716] text-[#f2efe6] border-[3px] border-[#f2efe6] shadow-[0_0_0_2px_#171716] grid place-items-center font-display font-semibold text-xl tracking-tight shrink-0">
                VS
              </div>
            </div>

            <button
              type="button"
              data-testid="desktop-photo-role"
              onClick={() => onNavigate("photo")}
              aria-label="Explore Freelance Photography work"
              className="group relative flex items-center justify-start gap-2 px-1 py-0 rounded-2xl cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4169ed]"
            >
              <div className="h-[clamp(275px,28.5vw,420px)] aspect-[62/100] shrink-0 overflow-hidden transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-[1.02] photographer-float">
                <img
                  src="/assets/aistudio/Big-Headed_Photographer_with_Oversized_Camera-2_5ee8ef09.png"
                  alt="Sadman as a freelance photographer holding a camera"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-[42%_center] select-none pointer-events-none"
                />
              </div>

              <span className="shrink-0 mt-1 mr-0.5 xl:mr-1 z-10 pointer-events-none">
                <CurvedArrow direction="left" />
              </span>

              <span className="relative inline-block text-left shrink-0 px-3.5 py-2 xl:px-4 xl:py-2.5">
                {/* Blue Focus Frame Corner Brackets on hover */}
                <span
                  aria-hidden="true"
                  data-testid="photo-title-frame"
                  className="pointer-events-none absolute inset-0 opacity-0 scale-[0.96] transition-all duration-200 ease-out group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100"
                >
                  <span className="absolute top-0 left-0 w-[18px] h-[18px] xl:w-[22px] xl:h-[22px] border-t-[3px] border-l-[3px] border-[#355bf2]" />
                  <span className="absolute top-0 right-0 w-[18px] h-[18px] xl:w-[22px] xl:h-[22px] border-t-[3px] border-r-[3px] border-[#355bf2]" />
                  <span className="absolute bottom-0 left-0 w-[18px] h-[18px] xl:w-[22px] xl:h-[22px] border-b-[3px] border-l-[3px] border-[#355bf2]" />
                  <span className="absolute bottom-0 right-0 w-[18px] h-[18px] xl:w-[22px] xl:h-[22px] border-b-[3px] border-r-[3px] border-[#355bf2]" />
                </span>
                <span className="block font-display text-[clamp(26px,2.75vw,43px)] font-semibold leading-[1.03] tracking-[-0.025em] text-[#4169ed]">
                  Freelance
                </span>
                <span className="block font-display text-[clamp(26px,2.75vw,43px)] font-semibold leading-[1.03] tracking-[-0.025em] text-[#171716] group-hover:text-[#4169ed] transition-colors">
                  Photographer
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Scroll-down cue to Selected Standouts (mobile, tablet, and desktop) */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3.5 md:gap-4 lg:gap-5 shrink-0">
          <span
            aria-hidden="true"
            className="justify-self-end font-display text-[15px] md:text-base lg:text-lg font-semibold tracking-[-0.015em] text-[#171716] select-none"
          >
            tap
          </span>
          <button
            type="button"
            data-testid="hero-scroll-down"
            onClick={handleScrollToStandouts}
            aria-label="Scroll to Selected Standouts"
            className="group relative overflow-hidden w-12 h-12 md:w-14 md:h-14 lg:w-[68px] lg:h-[68px] rounded-xl md:rounded-2xl lg:rounded-[18px] border-2 border-[#171716] bg-[#f2efe6] text-[#171716] shadow-[3px_3px_0_#171716] md:shadow-[4px_4px_0_#171716] lg:shadow-[5px_5px_0_#171716] grid place-items-center transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_5px_0_#171716] md:hover:shadow-[5px_6px_0_#171716] lg:hover:shadow-[6px_7px_0_#171716] active:translate-x-[3px] active:translate-y-[3px] md:active:translate-x-[4px] md:active:translate-y-[4px] lg:active:translate-x-[5px] lg:active:translate-y-[5px] active:shadow-none md:active:shadow-none lg:active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171716]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 group-active:opacity-100 transition-opacity duration-150 bg-[linear-gradient(135deg,#ff5b44_0%_50%,#4169ed_50%_100%)]"
            />
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="relative z-10 w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 fill-none stroke-current stroke-[2.5] text-[#171716] group-hover:text-[#f2efe6] group-focus-visible:text-[#f2efe6] group-active:text-[#f2efe6] transition-colors duration-150"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="M6.5 13.5 12 19l5.5-5.5" />
            </svg>
          </button>
          <span
            aria-hidden="true"
            className="justify-self-start font-display text-[15px] md:text-base lg:text-lg font-semibold tracking-[-0.015em] text-[#171716] select-none"
          >
            me
          </span>
        </div>
      </section>

      <section
        id="selected-standouts"
        ref={standoutsRef}
        className="lg:border-t-2 lg:border-[#171716] scroll-mt-20"
        aria-labelledby="featured-highlights-heading"
      >
        <div className="max-w-[1360px] lg:max-w-[1140px] mx-auto px-5 md:px-10 pt-5 pb-14 md:py-20 lg:pt-10 lg:pb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
            <div>
              <h2
                id="featured-highlights-heading"
                className="font-display text-[clamp(30px,4.2vw,54px)] lg:text-[46px] leading-[1.06] tracking-[-0.02em] font-medium m-0"
              >
                Selected <em className="not-italic font-medium text-[#d9442e]">Standouts</em>
              </h2>
            </div>

            <div
              className="flex flex-wrap items-center gap-2"
              role="tablist"
              aria-label="Filter featured highlights"
            >
              {HIGHLIGHT_FILTERS.map((tab) => {
                const active = highlightFilter === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setHighlightFilter(tab)}
                    className={`px-4 py-2 rounded-xl border-2 border-[#171716] text-sm font-medium transition-all duration-150 whitespace-nowrap shrink-0 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                      active
                        ? tab === "Photography"
                          ? "bg-[#4169ed] text-[#f2efe6] shadow-[3px_3px_0_#171716]"
                          : "bg-[#ff5b44] text-[#171716] shadow-[3px_3px_0_#171716]"
                        : "bg-[#fffdf6] text-[#171716] hover:-translate-y-0.5 hover:bg-[#f5d837] hover:shadow-[3px_3px_0_#171716] active:bg-[#f5d837]"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 md:mt-10 lg:mt-7 grid grid-cols-1 md:grid-cols-2 gap-7 lg:gap-6">
            {visibleHighlights.map((item) => {
              const isPhoto = item.kind === "photo";
              return (
                <article key={item.id} className="h-full">
                  <button
                    type="button"
                    onClick={() => onOpenProject(item.kind, item.sourceId)}
                    aria-label={`Open full details for ${item.title}`}
                    className={`group w-full h-full flex flex-col text-left bg-[#fffdf6] rounded-2xl border-2 border-[#171716] p-4 md:p-5 lg:p-4.5 shadow-[6px_6px_0_#171716] transition-all duration-200 hover:-translate-y-1 active:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 ${
                      isPhoto
                        ? "hover:shadow-[8px_8px_0_#4169ed] active:shadow-[8px_8px_0_#4169ed] focus-visible:outline-[#4169ed]"
                        : "hover:shadow-[8px_8px_0_#ff5b44] active:shadow-[8px_8px_0_#ff5b44] focus-visible:outline-[#ff5b44]"
                    }`}
                  >
                    <div
                      className={`relative aspect-[16/10] lg:aspect-[16/9.5] w-full overflow-hidden rounded-xl border-2 border-[#171716] ${
                        item.imageFit === "contain" ? "bg-[#f2efe6] p-2.5 sm:p-4" : "bg-[#ddd]"
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={`${item.title}, ${item.kicker}`}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full transition-transform duration-500 group-hover:scale-[1.03] group-active:scale-[1.03] ${
                          item.imageFit === "contain" ? "object-contain" : "object-cover"
                        }`}
                      />
                      <span
                        aria-hidden="true"
                        className={`absolute right-4 top-4 w-11 h-11 rounded-full border-2 border-[#171716] grid place-items-center scale-0 -rotate-45 group-hover:scale-100 group-hover:rotate-0 group-active:scale-100 group-active:rotate-0 transition-transform duration-200 ${
                          isPhoto
                            ? "bg-[#4169ed] text-[#f2efe6]"
                            : "bg-[#ff5b44] text-[#171716]"
                        }`}
                      >
                        <Arrow className="w-4 h-4" />
                      </span>
                    </div>

                    <div className="pt-4 lg:pt-3.5 flex items-start justify-between gap-4">
                      <div>
                        <p
                          className={`text-[16px] leading-[1.5] font-medium m-0 ${
                            isPhoto ? "text-[#4169ed]" : "text-[#d9442e]"
                          }`}
                        >
                          {item.kicker}
                        </p>
                        <h3 className="mt-1.5 font-display text-[26px] md:text-[30px] lg:text-[26px] font-medium tracking-[-0.015em] leading-[1.25] m-0">
                          {item.title}
                        </h3>
                        <p className="mt-2.5 lg:mt-2 text-[17px] md:text-[17px] leading-[1.5] md:leading-[1.65] text-[#171716]/80 line-clamp-2 m-0">
                          {item.summary}
                        </p>
                      </div>
                    </div>
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t-2 border-[#171716]">
        <div className="max-w-[1360px] mx-auto px-5 md:px-10 py-16 md:py-24">
          <p className="text-[16px] md:text-[16px] leading-[1.5] tabular-nums text-[#171716]/70 font-medium m-0">
            The Player
          </p>
          <h2 className="mt-4 max-w-4xl font-display text-[clamp(32px,4.4vw,58px)] leading-[1.15] tracking-[-0.02em] font-normal text-balance">
            I turn <em className="not-italic font-medium text-[#d9442e]">complexity</em> into clarity, then chase the
            light after hours.
          </h2>
          <div className="mt-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <p className="max-w-xl text-[18px] md:text-[19px] leading-[2] md:leading-[1.75] text-[#171716]/82 m-0">
              Based in Singapore, working everywhere. Partnering with ambitious product teams on
              digital &amp; physical experiences while documenting Southeast and East Asian street
              life on film.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={() => onNavigate("about")}
                className="inline-flex items-center gap-2.5 text-sm font-medium border-b-2 border-[#171716] pb-1.5 hover:text-[#d9442e] hover:border-[#d9442e] active:text-[#d9442e] active:border-[#d9442e] transition-colors whitespace-nowrap shrink-0"
              >
                About Sadman <Arrow />
              </button>
              <button
                type="button"
                onClick={onOpenContact}
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#c7ef45] border-2 border-[#171716] text-sm font-medium shadow-[4px_4px_0_#171716] hover:-translate-y-0.5 hover:bg-[#ff5b44] hover:shadow-[5px_6px_0_#171716] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none active:bg-[#ff5b44] transition-all duration-150 whitespace-nowrap shrink-0"
              >
                Get in Touch <Arrow />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
