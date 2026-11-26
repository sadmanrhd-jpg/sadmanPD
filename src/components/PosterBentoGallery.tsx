import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { PosterGalleryBlock, PosterStudyItem } from "../data/portfolio";
import {
  buildPosterBentoRows,
  formatCount,
  getNextSlideIndex,
  sortPostersAlphabetically,
} from "../utils/portfolioLogic";
import { Arrow } from "./Characters";

interface PosterBentoGalleryProps {
  projectTitle: string;
  gallery: PosterGalleryBlock;
  disableKeyboardNav?: boolean;
  onFullscreenChange?: (isOpen: boolean) => void;
  onBuyPoster: (posterTitle?: string) => void;
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

function ChevronIcon({
  direction,
  className = "w-5 h-5",
}: {
  direction: "left" | "right";
  className?: string;
}) {
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
      {direction === "left" ? (
        <path d="m15 18-6-6 6-6" />
      ) : (
        <path d="m9 18 6-6-6-6" />
      )}
    </svg>
  );
}

function ExpandIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

export function PosterBentoGallery({
  projectTitle,
  gallery,
  disableKeyboardNav = false,
  onFullscreenChange,
  onBuyPoster,
}: PosterBentoGalleryProps) {
  const sortedPosters = useMemo(
    () => sortPostersAlphabetically(gallery.items),
    [gallery.items],
  );

  const bentoRows = useMemo(
    () => buildPosterBentoRows(sortedPosters, 2.75),
    [sortedPosters],
  );

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const isFullscreenOpen = lightboxIndex !== null;
  const activePoster: PosterStudyItem | null =
    lightboxIndex !== null ? sortedPosters[lightboxIndex] ?? null : null;

  useEffect(() => {
    onFullscreenChange?.(isFullscreenOpen);
  }, [isFullscreenOpen, onFullscreenChange]);

  useEffect(() => {
    return () => {
      onFullscreenChange?.(false);
    };
  }, [onFullscreenChange]);

  useEffect(() => {
    if (!isFullscreenOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isFullscreenOpen]);

  useEffect(() => {
    if (!isFullscreenOpen || disableKeyboardNav) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setLightboxIndex(null);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setLightboxIndex((prev) =>
          prev === null ? null : getNextSlideIndex(prev, 1, sortedPosters.length),
        );
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setLightboxIndex((prev) =>
          prev === null ? null : getNextSlideIndex(prev, -1, sortedPosters.length),
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFullscreenOpen, disableKeyboardNav, sortedPosters.length]);

  const indexMap = useMemo(() => {
    const map = new Map<string, number>();
    sortedPosters.forEach((item, idx) => map.set(item.src, idx));
    return map;
  }, [sortedPosters]);

  const stepLightbox = (delta: -1 | 1) => {
    setLightboxIndex((prev) =>
      prev === null ? null : getNextSlideIndex(prev, delta, sortedPosters.length),
    );
  };

  return (
    <div id="section-gallery" data-testid="poster-bento-gallery" className="mt-8 md:mt-11">
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-[15px] md:text-[16px] leading-[1.55] text-[#171716]/68 m-0">
          {gallery.collectionNote}
        </p>
        <p className="text-[14px] md:text-[15px] font-medium text-[#171716]/72 tabular-nums whitespace-nowrap m-0">
          {formatCount(sortedPosters.length)} Posters · A to Z
        </p>
      </div>

      {/* Frameless Bento Poster Rows — exact natural aspect ratios, zero rectangle border framing */}
      <div className="flex flex-col gap-6 md:gap-7">
        {bentoRows.map((row, rowIdx) => (
          <div
            key={`bento-row-${rowIdx}`}
            data-testid={`poster-bento-row-${rowIdx + 1}`}
            className="flex flex-col md:flex-row gap-6 md:gap-7 items-stretch"
          >
            {row.map((poster) => {
              const posterIdx = indexMap.get(poster.src) ?? 0;
              const aspectRatio = poster.width / poster.height;
              return (
                <button
                  key={poster.src}
                  type="button"
                  data-testid={`poster-card-${posterIdx + 1}`}
                  data-poster-title={poster.title}
                  onClick={() => setLightboxIndex(posterIdx)}
                  aria-label={`View ${poster.title} poster in full screen`}
                  style={
                    {
                      "--poster-ratio": String(aspectRatio),
                    } as CSSProperties
                  }
                  className="group relative block w-full md:w-auto md:[flex:var(--poster-ratio)_1_0%] overflow-hidden rounded-lg bg-[#171716]/5 text-left cursor-zoom-in shadow-[0_10px_28px_rgba(23,23,22,0.12)] transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_48px_rgba(23,23,22,0.28)] focus-visible:-translate-y-1.5 focus-visible:shadow-[0_24px_48px_rgba(23,23,22,0.28)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
                >
                  <img
                    src={poster.src}
                    alt={`${poster.title} poster`}
                    width={poster.width}
                    height={poster.height}
                    loading={posterIdx < 6 ? "eager" : "lazy"}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto block transition-transform duration-300 ease-out group-hover:scale-[1.02] group-focus-visible:scale-[1.02]"
                  />

                  {/* Frosted dark hover label bar matching reference image */}
                  <div
                    data-testid={`poster-hover-label-${posterIdx + 1}`}
                    className="pointer-events-none absolute inset-x-0 bottom-0 bg-[#18181b]/76 backdrop-blur-md px-4 py-3.5 text-[#fffdf6] opacity-0 translate-y-2 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 flex items-end justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="font-display text-[15px] md:text-[16px] font-semibold tracking-[0.015em] leading-snug text-white truncate m-0">
                        {poster.title}
                      </p>
                      <p className="mt-0.5 text-[12.5px] leading-snug text-white/75 truncate m-0">
                        {poster.subtitle ?? "Key Art / Poster Study"}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-white/12 text-white/90 shrink-0"
                    >
                      <ExpandIcon className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Print Purchase / Inquiry Notice */}
      <div
        data-testid="poster-purchase-cta"
        className="mt-10 md:mt-14 rounded-2xl border-2 border-[#171716] bg-[#fffdf6] p-6 sm:p-8 shadow-[4px_4px_0_#171716] flex flex-col md:flex-row md:items-center justify-between gap-5"
      >
        <div className="max-w-2xl">
          <p className="text-[13px] font-semibold uppercase tracking-[0.07em] text-[#d9442e] m-0">
            Collector Prints Available
          </p>
          <h2 className="mt-1.5 font-display text-[22px] sm:text-[26px] font-medium tracking-[-0.02em] leading-snug text-[#171716] m-0">
            {gallery.purchaseHeading}
          </h2>
          <p className="mt-2 text-[16px] leading-[1.6] text-[#171716]/75 m-0">
            {gallery.purchaseNote}
          </p>
        </div>
        <button
          type="button"
          data-testid="poster-buy-inquiry-btn"
          onClick={() => onBuyPoster()}
          className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl border-2 border-[#171716] bg-[#171716] text-[#f2efe6] text-[15px] sm:text-[16px] leading-[1.4] font-medium shadow-[3px_3px_0_#ff5b44] hover:-translate-y-0.5 hover:bg-[#ff5b44] hover:text-[#171716] hover:shadow-[3px_3px_0_#171716] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-150 whitespace-nowrap shrink-0 self-start md:self-center"
        >
          <span>Contact to Buy a Poster</span>
          <Arrow className="w-4 h-4" />
        </button>
      </div>

      {/* Fullscreen Poster Lightbox */}
      {isFullscreenOpen && activePoster && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activePoster.title} full screen preview`}
          data-testid="poster-fullscreen-dialog"
          className="fixed inset-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 md:p-8"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between gap-4 text-[#f2efe6]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0 flex items-center gap-3">
              <span
                data-testid="poster-fullscreen-counter"
                className="text-sm font-medium text-[#f2efe6]/70 tabular-nums whitespace-nowrap"
              >
                {formatCount((lightboxIndex ?? 0) + 1)} / {formatCount(sortedPosters.length)}
              </span>
              <span className="text-[#f2efe6]/30" aria-hidden="true">
                ·
              </span>
              <p
                data-testid="poster-fullscreen-title"
                className="font-display text-lg sm:text-xl font-medium text-white truncate m-0"
              >
                {activePoster.title}
              </p>
            </div>
            <button
              type="button"
              data-testid="poster-fullscreen-close"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close full screen poster view"
              className="w-11 h-11 rounded-xl border border-white/20 bg-white/10 text-white hover:bg-[#ff5b44] hover:border-[#ff5b44] hover:text-[#171716] transition-colors grid place-items-center shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5b44]"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Center Poster Stage */}
          <div
            className="relative flex-1 min-h-0 flex items-center justify-center my-4"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              touchStartXRef.current = e.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              if (touchStartXRef.current === null) return;
              const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
              const delta = endX - touchStartXRef.current;
              touchStartXRef.current = null;
              if (Math.abs(delta) > 45) {
                stepLightbox(delta < 0 ? 1 : -1);
              }
            }}
          >
            <button
              type="button"
              data-testid="poster-fullscreen-prev"
              onClick={() => stepLightbox(-1)}
              aria-label="Previous poster"
              className="hidden sm:grid place-items-center absolute left-0 md:left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-white/25 bg-black/55 text-white hover:bg-[#ff5b44] hover:border-[#ff5b44] hover:text-[#171716] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5b44]"
            >
              <ChevronIcon direction="left" className="w-5 h-5" />
            </button>

            <img
              src={activePoster.src}
              alt={`${activePoster.title} poster full screen`}
              referrerPolicy="no-referrer"
              className="max-h-[72vh] sm:max-h-[76vh] max-w-full sm:max-w-[82vw] w-auto h-auto object-contain rounded-md shadow-[0_24px_80px_rgba(0,0,0,0.7)] select-none"
            />

            <button
              type="button"
              data-testid="poster-fullscreen-next"
              onClick={() => stepLightbox(1)}
              aria-label="Next poster"
              className="hidden sm:grid place-items-center absolute right-0 md:right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-white/25 bg-black/55 text-white hover:bg-[#ff5b44] hover:border-[#ff5b44] hover:text-[#171716] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5b44]"
            >
              <ChevronIcon direction="right" className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Bar with Mobile Arrows + Buy CTA */}
          <div
            className="flex flex-wrap items-center justify-between gap-3 text-[#f2efe6]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 sm:hidden">
              <button
                type="button"
                onClick={() => stepLightbox(-1)}
                aria-label="Previous poster"
                className="px-3.5 py-2 rounded-xl border border-white/20 bg-white/10 text-sm font-medium text-white"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => stepLightbox(1)}
                aria-label="Next poster"
                className="px-3.5 py-2 rounded-xl border border-white/20 bg-white/10 text-sm font-medium text-white"
              >
                Next
              </button>
            </div>

            <p className="hidden sm:block text-sm text-[#f2efe6]/68 m-0">
              {projectTitle} · Want a print of &ldquo;{activePoster.title}&rdquo;?
            </p>

            <button
              type="button"
              data-testid="poster-fullscreen-buy-btn"
              onClick={() => {
                const selectedTitle = activePoster.title;
                setLightboxIndex(null);
                onBuyPoster(selectedTitle);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#f2efe6] bg-[#ff5b44] text-[#171716] text-sm sm:text-[15px] font-semibold hover:bg-[#c7ef45] transition-colors whitespace-nowrap shrink-0 ml-auto"
            >
              <span>Buy This Poster</span>
              <Arrow className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
