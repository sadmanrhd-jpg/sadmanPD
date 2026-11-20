import { useRef, useState } from "react";
import { DESIGN_PROJECTS, PHOTO_ITEMS, type View } from "../data/portfolio";
import {
  buildFeaturedHighlights,
  filterHighlights,
  formatCount,
  type FeaturedHighlight,
  type HighlightFilter,
} from "../utils/portfolioLogic";
import { Arrow } from "./Characters";

interface HomeViewProps {
  onNavigate: (view: View) => void;
  onOpenContact: () => void;
  onSelectHighlight: (highlightId: string) => void;
}

const HIGHLIGHT_FILTERS: HighlightFilter[] = ["All", "Product Design", "Photography"];

function CurvedArrow({
  direction,
}: {
  direction: "right" | "left" | "mobile-down-right" | "mobile-left";
}) {
  if (direction === "mobile-down-right") {
    return (
      <svg
        viewBox="0 0 44 36"
        aria-hidden="true"
        className="w-9 h-7 sm:w-10 sm:h-8 fill-none stroke-[#171716] stroke-[1.9] shrink-0"
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
        className="w-9 h-6 sm:w-10 sm:h-7 fill-none stroke-[#171716] stroke-[1.9] shrink-0"
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
        className="w-14 h-8 fill-none stroke-[#171716] stroke-[2.2] shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
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
      className="w-14 h-8 fill-none stroke-[#171716] stroke-[2.2] shrink-0 transition-transform duration-200 group-hover:translate-x-1"
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
  onSelectHighlight,
}: HomeViewProps) {
  const [highlightFilter, setHighlightFilter] = useState<HighlightFilter>("All");
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
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-10 min-h-[calc(100svh-82px)] pt-7 pb-10 sm:pt-8 sm:pb-12 lg:py-8 flex flex-col items-center justify-start gap-[144px] lg:justify-center lg:gap-[34px] overflow-x-clip">
        <h1 className="sr-only">Kai — Product Designer and Street Photographer</h1>

        <div className="w-full flex items-center justify-center">
          {/* Mobile diagonal staggered hero */}
          <div
            data-testid="mobile-hero"
            className="lg:hidden relative w-full max-w-[372px] sm:max-w-[430px] h-[324px] sm:h-[364px] mx-auto"
          >
            <button
              type="button"
              onClick={() => onNavigate("design")}
              aria-label="Product Designer — Explore Product Design work"
              className="absolute top-0 left-[21%] sm:left-[23%] flex items-start gap-1 p-1 rounded-xl cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5b44]"
            >
              <span className="text-left leading-none">
                <span className="block font-display text-[25px] sm:text-[28px] font-semibold leading-[1.03] tracking-[-0.025em] text-[#e84c35]">
                  Product
                </span>
                <span className="block font-display text-[25px] sm:text-[28px] font-semibold leading-[1.03] tracking-[-0.025em] text-[#171716]">
                  Designer
                </span>
              </span>
              <span className="mt-2 sm:mt-2.5 -ml-1 pointer-events-none">
                <CurvedArrow direction="mobile-down-right" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("design")}
              aria-label="Explore Product Design work"
              className="absolute top-[38px] sm:top-[44px] right-0 p-1 rounded-2xl cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5b44]"
            >
              <div className="h-[192px] sm:h-[214px] aspect-[78/100] overflow-hidden designer-float">
                <img
                  src="/assets/aistudio/Giant-headed_product_designer_with_stylus-1_ac847ac5.png"
                  alt="Kai as a product designer holding a stylus and tablet"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center select-none pointer-events-none"
                />
              </div>
            </button>

            <div
              data-testid="mobile-vs-badge"
              aria-hidden="true"
              className="absolute top-[126px] sm:top-[142px] left-[45%] -translate-x-1/2 z-10 cursor-default select-none"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#171716] text-[#f2efe6] border-[3px] border-[#f2efe6] shadow-[0_0_0_2px_#171716] grid place-items-center font-display font-semibold text-sm sm:text-base tracking-tight">
                VS
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate("photo")}
              aria-label="Explore Street Photography work"
              className="absolute bottom-0 left-0 px-1 pt-1 pb-0 rounded-2xl cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169ed]"
            >
              <div className="h-[192px] sm:h-[214px] aspect-[62/100] overflow-hidden photographer-float">
                <img
                  src="/assets/aistudio/Big-Headed_Photographer_with_Oversized_Camera-2_5ee8ef09.png"
                  alt="Kai as a street photographer holding a camera"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-[42%_center] select-none pointer-events-none"
                />
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("photo")}
              aria-label="Street Photographer — Explore Street Photography work"
              className="absolute bottom-[2px] sm:bottom-[4px] left-[32%] sm:left-[33%] flex items-center gap-1 px-1 pt-1 pb-0 rounded-xl cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169ed]"
            >
              <span className="mt-2 pointer-events-none">
                <CurvedArrow direction="mobile-left" />
              </span>
              <span className="text-left leading-none">
                <span className="block font-display text-[25px] sm:text-[28px] font-semibold leading-[1.03] tracking-[-0.025em] text-[#4169ed]">
                  Street
                </span>
                <span className="block font-display text-[25px] sm:text-[28px] font-semibold leading-[1.03] tracking-[-0.025em] text-[#171716]">
                  Photographer
                </span>
              </span>
            </button>
          </div>

          {/* Desktop horizontal 5-part hero */}
          <div className="hidden lg:flex w-full flex-row items-center justify-center gap-7 xl:gap-10">
            <button
              type="button"
              onClick={() => onNavigate("design")}
              aria-label="Explore Product Design work"
              className="group relative flex items-center justify-end gap-2 px-2 py-0 rounded-2xl cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
            >
              <span className="text-left shrink-0">
                <span className="block font-display text-[clamp(28px,2.95vw,43px)] font-semibold leading-[1.03] tracking-[-0.025em] text-[#e84c35]">
                  Product
                </span>
                <span className="block font-display text-[clamp(28px,2.95vw,43px)] font-semibold leading-[1.03] tracking-[-0.025em] text-[#171716] group-hover:text-[#e84c35] transition-colors">
                  Designer
                </span>
              </span>

              <span className="shrink-0 -ml-2 -mt-8 xl:-ml-2.5 xl:-mt-9 z-10 pointer-events-none">
                <CurvedArrow direction="right" />
              </span>

              <div className="h-[clamp(290px,29.5vw,425px)] aspect-[78/100] shrink-0 overflow-hidden transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-[1.02] designer-float">
                <img
                  src="/assets/aistudio/Giant-headed_product_designer_with_stylus-1_ac847ac5.png"
                  alt="Kai as a product designer holding a stylus and tablet"
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
              onClick={() => onNavigate("photo")}
              aria-label="Explore Street Photography work"
              className="group relative flex items-center justify-start gap-2 px-2 py-0 rounded-2xl cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4169ed]"
            >
              <div className="h-[clamp(290px,29.5vw,425px)] aspect-[62/100] shrink-0 overflow-hidden transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-[1.02] photographer-float">
                <img
                  src="/assets/aistudio/Big-Headed_Photographer_with_Oversized_Camera-2_5ee8ef09.png"
                  alt="Kai as a street photographer holding a camera"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-[42%_center] select-none pointer-events-none"
                />
              </div>

              <span className="shrink-0 mt-1 z-10 pointer-events-none">
                <CurvedArrow direction="left" />
              </span>

              <span className="text-left shrink-0">
                <span className="block font-display text-[clamp(28px,2.95vw,43px)] font-semibold leading-[1.03] tracking-[-0.025em] text-[#4169ed]">
                  Street
                </span>
                <span className="block font-display text-[clamp(28px,2.95vw,43px)] font-semibold leading-[1.03] tracking-[-0.025em] text-[#171716] group-hover:text-[#4169ed] transition-colors">
                  Photographer
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Scroll-down cue to Selected Standouts (both mobile and desktop) */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3.5 lg:gap-5 shrink-0">
          <span
            aria-hidden="true"
            className="justify-self-end font-display text-[15px] lg:text-lg font-semibold tracking-[-0.015em] text-[#171716] select-none"
          >
            tap
          </span>
          <button
            type="button"
            data-testid="hero-scroll-down"
            onClick={handleScrollToStandouts}
            aria-label="Scroll to Selected Standouts"
            className="group relative overflow-hidden w-12 h-12 lg:w-[68px] lg:h-[68px] rounded-xl lg:rounded-[18px] border-2 border-[#171716] bg-[#f2efe6] text-[#171716] shadow-[3px_3px_0_#171716] lg:shadow-[5px_5px_0_#171716] grid place-items-center transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_5px_0_#171716] lg:hover:shadow-[6px_7px_0_#171716] active:translate-x-[3px] active:translate-y-[3px] lg:active:translate-x-[5px] lg:active:translate-y-[5px] active:shadow-none lg:active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171716]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 group-active:opacity-100 transition-opacity duration-150 bg-[linear-gradient(135deg,#ff5b44_0%_50%,#4169ed_50%_100%)]"
            />
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="relative z-10 w-5 h-5 lg:w-8 lg:h-8 fill-none stroke-current stroke-[2.5] text-[#171716] group-hover:text-[#f2efe6] group-focus-visible:text-[#f2efe6] group-active:text-[#f2efe6] transition-colors duration-150"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="M6.5 13.5 12 19l5.5-5.5" />
            </svg>
          </button>
          <span
            aria-hidden="true"
            className="justify-self-start font-display text-[15px] lg:text-lg font-semibold tracking-[-0.015em] text-[#171716] select-none"
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
        <div className="max-w-[1360px] mx-auto px-5 md:px-10 pt-5 pb-14 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
            <div>
              <h2
                id="featured-highlights-heading"
                className="font-display text-[clamp(30px,4.2vw,54px)] leading-[1.06] tracking-[-0.02em] font-medium m-0"
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
                    className={`px-4 py-2 rounded-xl border-2 border-[#171716] text-sm font-medium transition-all duration-150 whitespace-nowrap shrink-0 ${
                      active
                        ? tab === "Photography"
                          ? "bg-[#4169ed] text-[#f2efe6] shadow-[3px_3px_0_#171716]"
                          : "bg-[#ff5b44] text-[#171716] shadow-[3px_3px_0_#171716]"
                        : "bg-[#fffdf6] text-[#171716] hover:bg-[#f5d837]"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-7">
            {visibleHighlights.map((item, index) => {
              const isPhoto = item.kind === "photo";
              return (
                <article key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelectHighlight(item.id)}
                    aria-label={`Open highlight modal for ${item.title}`}
                    className={`group w-full text-left bg-[#fffdf6] rounded-2xl border-2 border-[#171716] p-4 md:p-5 shadow-[6px_6px_0_#171716] transition-all duration-200 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 ${
                      isPhoto
                        ? "hover:shadow-[8px_8px_0_#4169ed] focus-visible:outline-[#4169ed]"
                        : "hover:shadow-[8px_8px_0_#ff5b44] focus-visible:outline-[#ff5b44]"
                    }`}
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border-2 border-[#171716] bg-[#ddd]">
                      <img
                        src={item.image}
                        alt={`${item.title} — ${item.kicker}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <span
                        aria-hidden="true"
                        className={`absolute right-4 top-4 w-11 h-11 rounded-full border-2 border-[#171716] grid place-items-center scale-0 -rotate-45 group-hover:scale-100 group-hover:rotate-0 transition-transform duration-200 ${
                          isPhoto
                            ? "bg-[#4169ed] text-[#f2efe6]"
                            : "bg-[#ff5b44] text-[#171716]"
                        }`}
                      >
                        <Arrow className="w-4 h-4" />
                      </span>
                    </div>

                    <div className="pt-4 flex items-start justify-between gap-4">
                      <div>
                        <p
                          className={`text-[13px] tabular-nums font-medium m-0 ${
                            isPhoto ? "text-[#4169ed]" : "text-[#d9442e]"
                          }`}
                        >
                          {formatCount(index + 1)} · {item.kicker}
                        </p>
                        <h3 className="mt-1.5 font-display text-2xl md:text-[30px] font-medium tracking-[-0.015em] leading-tight m-0">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#171716]/75 line-clamp-2 m-0">
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
          <p className="text-sm tabular-nums text-[#171716]/70 font-medium m-0">
            02. The Player
          </p>
          <h2 className="mt-4 max-w-4xl font-display text-[clamp(32px,4.4vw,58px)] leading-[1.1] tracking-[-0.02em] font-normal text-balance">
            I turn <em className="not-italic font-medium text-[#d9442e]">complexity</em> into clarity—then chase the
            light after hours.
          </h2>
          <div className="mt-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <p className="max-w-lg text-base leading-relaxed text-[#171716]/80 m-0">
              Based in Singapore, working everywhere. Partnering with ambitious product teams on
              digital &amp; physical experiences while documenting Southeast and East Asian street
              life on film.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={() => onNavigate("about")}
                className="inline-flex items-center gap-2.5 text-sm font-medium border-b-2 border-[#171716] pb-1.5 hover:text-[#d9442e] hover:border-[#d9442e] transition-colors whitespace-nowrap shrink-0"
              >
                About Kai <Arrow />
              </button>
              <button
                type="button"
                onClick={onOpenContact}
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#c7ef45] border-2 border-[#171716] text-sm font-medium shadow-[4px_4px_0_#171716] hover:bg-[#ff5b44] transition-colors whitespace-nowrap shrink-0"
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
