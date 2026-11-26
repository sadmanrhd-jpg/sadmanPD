import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  PHOTO_GENRES,
  PHOTO_ITEMS,
  SOCIAL_LINKS,
  type PhotoGenre,
  type PhotoItem,
  type View,
} from "../data/portfolio";
import {
  buildPosterBentoRows,
  filterPhotoItems,
  formatCount,
  getGalleryScrollTarget,
  getNextSlideIndex,
} from "../utils/portfolioLogic";
import { Arrow } from "./Characters";

interface PhotoGalleryProps {
  initialGenre?: PhotoGenre;
  autoScrollToImages?: boolean;
  disableKeyboardNav?: boolean;
  onNavigate: (view: View) => void;
  onBuyPhoto: (note: string) => void;
}

const FLICKR_LINK =
  SOCIAL_LINKS.find((link) => link.id === "flickr")?.href ??
  "https://www.flickr.com/photos/137565099@N07/";

function FlickrIcon({ className = "w-4 h-4 shrink-0" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <circle cx="7.75" cy="12" r="4.25" />
      <circle cx="16.25" cy="12" r="4.25" fillOpacity="0.68" />
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

interface SizedPhotoItem extends PhotoItem {
  width: number;
  height: number;
}

export function PhotoGallery({
  initialGenre = "All",
  autoScrollToImages = false,
  disableKeyboardNav = false,
  onNavigate,
  onBuyPhoto,
}: PhotoGalleryProps) {
  const [genre, setGenre] = useState<PhotoGenre>(initialGenre);
  const [riseKey, setRiseKey] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const genreAnchorRef = useRef<HTMLDivElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    setGenre(initialGenre);
    setLightboxIndex(null);
  }, [initialGenre]);

  useLayoutEffect(() => {
    if (!autoScrollToImages) return;

    const scrollToGalleryImages = () => {
      const anchor = genreAnchorRef.current;
      if (!anchor) return;
      const headerEl = document.querySelector("header");
      const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 82;
      const anchorTop = anchor.getBoundingClientRect().top + window.scrollY;
      const targetY = getGalleryScrollTarget({
        anchorTop,
        headerHeight,
      });
      window.scrollTo({ top: targetY, behavior: "instant" });
    };

    scrollToGalleryImages();
    const rafId = window.requestAnimationFrame(scrollToGalleryImages);
    return () => window.cancelAnimationFrame(rafId);
  }, [autoScrollToImages, initialGenre]);

  const visiblePhotos = useMemo<SizedPhotoItem[]>(() => {
    return filterPhotoItems(PHOTO_ITEMS, genre).map((photo) => ({
      ...photo,
      width: photo.width ?? 1200,
      height: photo.height ?? 900,
    }));
  }, [genre]);

  const bentoRows = useMemo(
    () => buildPosterBentoRows(visiblePhotos, 3.05),
    [visiblePhotos],
  );

  const indexMap = useMemo(() => {
    const map = new Map<string, number>();
    visiblePhotos.forEach((item, idx) => map.set(item.id, idx));
    return map;
  }, [visiblePhotos]);

  const isFullscreenOpen = lightboxIndex !== null;
  const activePhoto: SizedPhotoItem | null =
    lightboxIndex !== null ? visiblePhotos[lightboxIndex] ?? null : null;

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
          prev === null ? null : getNextSlideIndex(prev, 1, visiblePhotos.length),
        );
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setLightboxIndex((prev) =>
          prev === null ? null : getNextSlideIndex(prev, -1, visiblePhotos.length),
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFullscreenOpen, disableKeyboardNav, visiblePhotos.length]);

  const handleSelectGenre = (tab: PhotoGenre) => {
    setLightboxIndex(null);
    setGenre(tab);
    setRiseKey((prev) => prev + 1);

    const anchor = genreAnchorRef.current;
    if (!anchor) return;

    const headerEl = document.querySelector("header");
    const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 82;
    const anchorTop = anchor.getBoundingClientRect().top + window.scrollY;
    const targetY = getGalleryScrollTarget({
      anchorTop,
      headerHeight,
    });

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: targetY,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  };

  const stepLightbox = (delta: -1 | 1) => {
    setLightboxIndex((prev) =>
      prev === null ? null : getNextSlideIndex(prev, delta, visiblePhotos.length),
    );
  };

  const buildBuyNote = (photo?: SizedPhotoItem, photoNumber?: number) => {
    if (photo && photoNumber) {
      return `Hi Sadman, I would like to inquire about buying a print of photograph #${formatCount(photoNumber)} from your ${photo.genre} photography collection.`;
    }
    return `Hi Sadman, I would like to inquire about buying a print from your Photography collection.`;
  };

  return (
    <main className="gallery bg-[#111111] text-[#f2efe6] min-h-screen">
      <section data-testid="photo-gallery-hero">
        <div className="max-w-[1360px] mx-auto px-5 md:px-10 pt-5 md:pt-7">
          <div
            data-testid="gallery-nav-actions"
            className="flex flex-col items-start gap-2.5"
          >
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border-2 border-[#f2efe6] bg-transparent text-sm font-medium text-[#f2efe6] shadow-[3px_3px_0_#f2efe6] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_5px_0_#f2efe6] hover:bg-[#f2efe6] hover:text-[#111111] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none active:bg-[#f2efe6] active:text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4169ed]"
            >
              <Arrow
                direction="left"
                className="w-4 h-4 transition-transform duration-150 group-hover:-translate-x-1 group-active:-translate-x-1"
              />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate("design")}
              className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border-2 border-[#f2efe6] bg-[#ff5b44] text-sm font-medium text-[#171716] shadow-[3px_3px_0_#f2efe6] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_5px_0_#f2efe6] hover:bg-[#ff6d59] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none active:bg-[#ff6d59] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
            >
              <span>Switch to Product Design</span>
              <Arrow className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1 group-active:translate-x-1" />
            </button>
          </div>

          <div className="mt-8 md:mt-10 pb-6 flex flex-col gap-5 max-w-2xl">
            <h1 className="font-display text-[clamp(48px,6.2vw,88px)] leading-[0.96] tracking-[-0.025em] font-medium m-0">
              Framed
              <br />
              <em className="not-italic font-medium text-[#6d8eff]">Stories.</em>
            </h1>
            <p className="max-w-xl text-[17px] md:text-[19px] leading-[1.7] text-[#f2efe6]/75 m-0">
              Unscripted fragments of live concerts, people, and city life. Hover any photograph to
              purchase a print, or click to view it in full screen.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <a
                href={FLICKR_LINK}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="photo-flickr-btn"
                aria-label="Explore full photography archive on Flickr (opens in new tab)"
                className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 border-[#f2efe6] bg-[#fffdf6] text-sm md:text-[15px] font-semibold text-[#171716] shadow-[3px_3px_0_#4169ed] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#4169ed] hover:text-[#f2efe6] hover:shadow-[4px_5px_0_#f2efe6] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4169ed]"
              >
                <FlickrIcon className="w-[18px] h-[18px] shrink-0" />
                <span>View on Flickr</span>
                <Arrow className="w-4 h-4 -rotate-45 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          <div className="border-t-2 border-[#f2efe6]/30" aria-hidden="true" />
        </div>
      </section>

      <div ref={genreAnchorRef} className="h-0" aria-hidden="true" />

      <div
        data-testid="photo-genre-bar"
        className="sticky top-[80px] z-20 bg-[#111111]/95 backdrop-blur-sm border-b-2 border-[#f2efe6]/30"
      >
        <div className="max-w-[1360px] mx-auto px-5 md:px-10 py-3.5 md:py-4 flex flex-wrap items-center gap-4">
          <div
            className="flex flex-wrap items-center gap-1.5 md:gap-2"
            role="tablist"
            aria-label="Filter photographs by genre"
          >
            {PHOTO_GENRES.map((tab) => {
              const active = genre === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleSelectGenre(tab)}
                  className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl border-2 text-[13px] sm:text-sm lg:text-base font-medium transition-all duration-150 whitespace-nowrap shrink-0 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                    active
                      ? "bg-[#4169ed] text-[#f2efe6] border-[#f2efe6] shadow-[3px_3px_0_#f2efe6]"
                      : "bg-transparent text-[#f2efe6] border-[#f2efe6]/40 hover:-translate-y-0.5 hover:border-[#f2efe6] hover:shadow-[3px_3px_0_#f2efe6] active:border-[#f2efe6] active:bg-[#4169ed]/20"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section
        data-testid="photo-gallery-section"
        data-active-genre={genre}
        className="max-w-[1360px] mx-auto px-5 md:px-10 pt-6 pb-16 md:pt-8 md:pb-20 min-h-[calc(100svh-155px)]"
      >
        {visiblePhotos.length === 0 ? (
          <div
            key={riseKey}
            className={`rounded-2xl border-2 border-[#f2efe6]/30 bg-[#181818] p-10 sm:p-12 text-center ${
              riseKey > 0 ? "gallery-projects-rise" : ""
            }`}
          >
            <p className="text-[16px] text-[#f2efe6]/75 m-0">
              New {genre} frames are being curated. Check back soon or browse the archive on Flickr.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleSelectGenre("All")}
                className="px-4 py-2.5 rounded-xl border-2 border-[#f2efe6] bg-[#4169ed] text-sm font-medium text-[#f2efe6] shadow-[3px_3px_0_#f2efe6] hover:-translate-y-0.5 transition-all"
              >
                Show All Frames
              </button>
              <a
                href={FLICKR_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#f2efe6]/50 text-sm font-medium text-[#f2efe6] hover:border-[#f2efe6] hover:bg-[#f2efe6] hover:text-[#111111] transition-all"
              >
                <FlickrIcon className="w-4 h-4" />
                <span>Browse on Flickr</span>
              </a>
            </div>
          </div>
        ) : (
          <div
            key={riseKey}
            className={riseKey > 0 ? "gallery-projects-rise" : ""}
          >
            {/* Frameless Bento Photography Rows matching Poster gallery effects — zero image names */}
            <div className="flex flex-col gap-6 md:gap-7">
              {bentoRows.map((row, rowIdx) => (
                <div
                  key={`photo-bento-row-${rowIdx}`}
                  data-testid={`photo-bento-row-${rowIdx + 1}`}
                  className="flex flex-col md:flex-row gap-6 md:gap-7 items-stretch"
                >
                  {row.map((photo) => {
                    const photoIdx = indexMap.get(photo.id) ?? 0;
                    const aspectRatio = photo.width / photo.height;
                    return (
                      <div
                        key={photo.id}
                        data-testid={`photo-card-${photoIdx + 1}`}
                        data-photo-genre={photo.genre}
                        style={
                          {
                            "--photo-ratio": String(aspectRatio),
                          } as CSSProperties
                        }
                        className="group relative w-full md:w-auto md:[flex:var(--photo-ratio)_1_0%] overflow-hidden rounded-lg bg-[#1a1a1a] shadow-[0_10px_28px_rgba(0,0,0,0.42)] transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_52px_rgba(0,0,0,0.75)] focus-within:-translate-y-1.5 focus-within:shadow-[0_24px_52px_rgba(0,0,0,0.75)]"
                      >
                        <button
                          type="button"
                          onClick={() => setLightboxIndex(photoIdx)}
                          aria-label={`View ${photo.genre} photograph ${photoIdx + 1} in full screen`}
                          className="block w-full h-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4169ed]"
                        >
                          <img
                            src={photo.image}
                            alt={`${photo.genre} photograph ${photoIdx + 1}`}
                            width={photo.width}
                            height={photo.height}
                            loading={photoIdx < 6 ? "eager" : "lazy"}
                            referrerPolicy="no-referrer"
                            className="w-full h-auto block transition-transform duration-300 ease-out group-hover:scale-[1.02] group-focus-within:scale-[1.02]"
                          />
                        </button>

                        {/* Frosted dark hover action bar — no image name, direct Buy Image button + expand */}
                        <div
                          data-testid={`photo-hover-bar-${photoIdx + 1}`}
                          className="pointer-events-none absolute inset-x-0 bottom-0 bg-[#141416]/76 backdrop-blur-md px-3.5 py-3 opacity-0 translate-y-2 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 flex items-center justify-between gap-3"
                        >
                          <button
                            type="button"
                            data-testid={`photo-buy-btn-${photoIdx + 1}`}
                            onClick={() => onBuyPhoto(buildBuyNote(photo, photoIdx + 1))}
                            className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ff5b44] text-[#171716] text-[13px] font-semibold hover:bg-[#c7ef45] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2efe6]"
                          >
                            <span>Buy Image</span>
                            <Arrow className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setLightboxIndex(photoIdx)}
                            aria-label={`Open ${photo.genre} photograph ${photoIdx + 1} in full screen`}
                            className="pointer-events-auto inline-flex items-center justify-center w-8 h-8 rounded-md bg-white/14 text-white hover:bg-white/25 transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169ed]"
                          >
                            <ExpandIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Print Purchase CTA Banner */}
            <div
              data-testid="photo-purchase-cta"
              className="mt-12 md:mt-16 rounded-2xl border-2 border-[#f2efe6]/80 bg-[#181818] p-6 sm:p-8 shadow-[4px_4px_0_#4169ed] flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="max-w-2xl">
                <p className="text-[13px] font-semibold uppercase tracking-[0.07em] text-[#6d8eff] m-0">
                  Fine Art Prints &amp; Licensing
                </p>
                <h2 className="mt-1.5 font-display text-[22px] sm:text-[26px] font-medium tracking-[-0.02em] leading-snug text-[#f2efe6] m-0">
                  Interested in buying a print?
                </h2>
                <p className="mt-2 text-[16px] leading-[1.6] text-[#f2efe6]/75 m-0">
                  Every photograph in this gallery is available as a fine-art print or licensing
                  file. Get in touch directly to purchase an image.
                </p>
              </div>
              <button
                type="button"
                data-testid="photo-gallery-buy-cta"
                onClick={() => onBuyPhoto(buildBuyNote())}
                className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl border-2 border-[#f2efe6] bg-[#ff5b44] text-[#171716] text-[15px] sm:text-[16px] leading-[1.4] font-semibold shadow-[3px_3px_0_#f2efe6] hover:-translate-y-0.5 hover:bg-[#c7ef45] hover:shadow-[4px_5px_0_#f2efe6] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-150 whitespace-nowrap shrink-0 self-start md:self-center"
              >
                <span>Buy Image</span>
                <Arrow className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Fullscreen Photograph Lightbox — no image names, direct Buy Image button */}
      {isFullscreenOpen && activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activePhoto.genre} photograph full screen preview`}
          data-testid="photo-fullscreen-dialog"
          className="fixed inset-0 z-50 bg-[#0a0a0a]/96 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 md:p-8"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between gap-4 text-[#f2efe6]"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              data-testid="photo-fullscreen-counter"
              className="text-sm font-medium text-[#f2efe6]/75 tabular-nums whitespace-nowrap"
            >
              {formatCount((lightboxIndex ?? 0) + 1)} / {formatCount(visiblePhotos.length)}
            </span>

            <button
              type="button"
              data-testid="photo-fullscreen-close"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close full screen photograph view"
              className="w-11 h-11 rounded-xl border border-white/20 bg-white/10 text-white hover:bg-[#ff5b44] hover:border-[#ff5b44] hover:text-[#171716] transition-colors grid place-items-center shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169ed]"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Center Stage */}
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
              data-testid="photo-fullscreen-prev"
              onClick={() => stepLightbox(-1)}
              aria-label="Previous photograph"
              className="hidden sm:grid place-items-center absolute left-0 md:left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-white/25 bg-black/55 text-white hover:bg-[#4169ed] hover:border-[#4169ed] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169ed]"
            >
              <ChevronIcon direction="left" className="w-5 h-5" />
            </button>

            <img
              src={activePhoto.image}
              alt={`${activePhoto.genre} photograph ${(lightboxIndex ?? 0) + 1} full screen`}
              referrerPolicy="no-referrer"
              className="max-h-[74vh] sm:max-h-[78vh] max-w-full sm:max-w-[84vw] w-auto h-auto object-contain rounded-md shadow-[0_24px_80px_rgba(0,0,0,0.8)] select-none"
            />

            <button
              type="button"
              data-testid="photo-fullscreen-next"
              onClick={() => stepLightbox(1)}
              aria-label="Next photograph"
              className="hidden sm:grid place-items-center absolute right-0 md:right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-white/25 bg-black/55 text-white hover:bg-[#4169ed] hover:border-[#4169ed] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169ed]"
            >
              <ChevronIcon direction="right" className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Bar with Mobile Prev/Next + Buy Image CTA */}
          <div
            className="flex flex-wrap items-center justify-between gap-3 text-[#f2efe6]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 sm:hidden">
              <button
                type="button"
                onClick={() => stepLightbox(-1)}
                aria-label="Previous photograph"
                className="px-3.5 py-2 rounded-xl border border-white/20 bg-white/10 text-sm font-medium text-white"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => stepLightbox(1)}
                aria-label="Next photograph"
                className="px-3.5 py-2 rounded-xl border border-white/20 bg-white/10 text-sm font-medium text-white"
              >
                Next
              </button>
            </div>

            <button
              type="button"
              data-testid="photo-fullscreen-buy-btn"
              onClick={() => {
                const selectedPhoto = activePhoto;
                const selectedNumber = (lightboxIndex ?? 0) + 1;
                setLightboxIndex(null);
                onBuyPhoto(buildBuyNote(selectedPhoto, selectedNumber));
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#f2efe6] bg-[#ff5b44] text-[#171716] text-sm sm:text-[15px] font-semibold hover:bg-[#c7ef45] transition-colors whitespace-nowrap shrink-0 ml-auto"
            >
              <span>Buy Image</span>
              <Arrow className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
