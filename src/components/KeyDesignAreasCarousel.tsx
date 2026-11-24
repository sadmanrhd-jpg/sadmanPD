import { useEffect, useRef, useState } from "react";
import type { CaseStudyVisual } from "../data/portfolio";
import { formatCount, getNextSlideIndex } from "../utils/portfolioLogic";
import { ChevronIcon } from "./Characters";

interface KeyDesignAreasCarouselProps {
  visuals: CaseStudyVisual[];
  onOpenFullscreen: (index: number) => void;
  testIdPrefix?: string;
  eyebrow?: string;
}

function ExpandIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
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

export function KeyDesignAreasCarousel({
  visuals,
  onOpenFullscreen,
  testIdPrefix = "kda",
  eyebrow = "UX Sketches & Flows",
}: KeyDesignAreasCarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragStartXRef = useRef<number | null>(null);
  const draggedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
    if (trackRef.current) {
      trackRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
  }, [visuals]);

  if (visuals.length === 0) return null;

  const safeIndex = Math.min(activeIndex, visuals.length - 1);
  const hasMultiple = visuals.length > 1;
  const rootTestId =
    testIdPrefix === "kda"
      ? "key-design-areas-intro-carousel"
      : `${testIdPrefix}-visuals-carousel`;

  const goToSlide = (nextIndex: number) => {
    const clamped = Math.max(0, Math.min(visuals.length - 1, nextIndex));
    setActiveIndex(clamped);
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({
      left: clamped * track.clientWidth,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const idx = Math.round(track.scrollLeft / track.clientWidth);
    const clamped = Math.max(0, Math.min(visuals.length - 1, idx));
    if (clamped !== activeIndex) {
      setActiveIndex(clamped);
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    dragStartXRef.current = event.clientX;
    draggedRef.current = false;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartXRef.current === null) return;
    if (Math.abs(event.clientX - dragStartXRef.current) > 12) {
      draggedRef.current = true;
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartXRef.current === null) return;
    const deltaX = event.clientX - dragStartXRef.current;
    dragStartXRef.current = null;
    if (hasMultiple && Math.abs(deltaX) > 48) {
      const next = getNextSlideIndex(
        safeIndex,
        deltaX < 0 ? 1 : -1,
        visuals.length,
      );
      goToSlide(next);
    }
  };

  return (
    <div
      data-testid={rootTestId}
      className="w-full flex flex-col gap-4 md:gap-5"
    >
      {hasMultiple && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13.5px] md:text-[13px] font-medium uppercase tracking-[0.09em] leading-[1.4] text-[#171716]/55 m-0">
            {eyebrow}
          </p>

          <div className="flex items-center gap-2.5">
            <span
              data-testid={`${testIdPrefix}-carousel-counter`}
              className="text-sm md:text-[15px] font-medium tabular-nums text-[#171716]/60 mr-0.5 whitespace-nowrap"
            >
              {formatCount(safeIndex + 1)} / {formatCount(visuals.length)}
            </span>
            <span className="md:hidden text-[13.5px] font-medium uppercase tracking-[0.07em] text-[#d9442e] whitespace-nowrap">
              Swipe →
            </span>
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                data-testid={`${testIdPrefix}-carousel-prev`}
                onClick={() =>
                  goToSlide(getNextSlideIndex(safeIndex, -1, visuals.length))
                }
                aria-label="Previous workflow visual"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-[#171716] bg-[#fffdf6] text-[15px] font-medium text-[#171716] shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 hover:bg-[#171716] hover:text-[#f2efe6] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150"
              >
                <ChevronIcon direction="left" className="w-4 h-4" />
                <span>Prev</span>
              </button>
              <button
                type="button"
                data-testid={`${testIdPrefix}-carousel-next`}
                onClick={() =>
                  goToSlide(getNextSlideIndex(safeIndex, 1, visuals.length))
                }
                aria-label="Next workflow visual"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-[#171716] bg-[#fffdf6] text-[15px] font-medium text-[#171716] shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 hover:bg-[#ff5b44] hover:text-[#171716] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150"
              >
                <span>Next</span>
                <ChevronIcon direction="right" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Horizontal snap-scroll swipe track */}
      <div
        ref={trackRef}
        data-testid={`${testIdPrefix}-carousel-track`}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          dragStartXRef.current = null;
        }}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth pt-2 pb-3 cursor-grab active:cursor-grabbing"
      >
        {visuals.map((visual, idx) => (
          <figure
            key={visual.src}
            data-testid={`${testIdPrefix}-intro-slide-${idx}`}
            className="w-full shrink-0 snap-center m-0 flex flex-col gap-3.5 px-1"
          >
            <div
              data-testid={`${testIdPrefix}-intro-card-${idx}`}
              className="float-card overflow-hidden rounded-xl md:rounded-2xl border-2 border-[#171716] bg-white p-2 sm:p-3 md:p-5 shadow-[4px_4px_0_#171716] md:shadow-[6px_6px_0_#171716]"
            >
              <button
                type="button"
                data-testid={`${testIdPrefix}-intro-open-btn-${idx}`}
                onClick={() => {
                  if (draggedRef.current) {
                    draggedRef.current = false;
                    return;
                  }
                  onOpenFullscreen(idx);
                }}
                aria-label={`View full screen: ${visual.title}`}
                className="group relative block w-full overflow-hidden rounded-lg cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
              >
                <img
                  src={visual.src}
                  alt={visual.title}
                  draggable={false}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto block rounded-lg select-none transition-transform duration-300 ease-out group-hover:scale-[1.015]"
                />
              </button>
            </div>

            <figcaption className="px-0.5 flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-display text-[16px] md:text-[16.5px] font-medium tracking-[-0.01em] leading-[1.4] text-[#171716]/88 m-0">
                  {visual.title}
                </p>
                <button
                  type="button"
                  onClick={() => onOpenFullscreen(idx)}
                  aria-label={`Expand ${visual.title}`}
                  className="inline-flex items-center gap-1.5 text-[13.5px] font-normal text-[#171716]/55 hover:text-[#d9442e] transition-colors shrink-0 cursor-zoom-in"
                >
                  <ExpandIcon className="w-3.5 h-3.5" />
                  <span>Full screen</span>
                </button>
              </div>
              {visual.caption && (
                <p className="text-[15px] md:text-[15px] font-normal leading-[1.75] text-[#171716]/64 m-0 max-w-[64ch]">
                  {visual.caption}
                </p>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
