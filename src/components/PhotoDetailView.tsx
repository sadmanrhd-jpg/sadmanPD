import { useEffect } from "react";
import type { PhotoItem } from "../data/portfolio";
import { getAdjacentItemId } from "../utils/portfolioLogic";
import { Arrow, ChevronIcon } from "./Characters";

interface PhotoDetailViewProps {
  photo: PhotoItem;
  photos: PhotoItem[];
  disableKeyboardNav?: boolean;
  onBack: () => void;
  onSelectPhoto: (photoId: string) => void;
  onInquire: (topic: "Street Photography", note: string) => void;
}

export function PhotoDetailView({
  photo,
  photos,
  disableKeyboardNav = false,
  onBack,
  onSelectPhoto,
  onInquire,
}: PhotoDetailViewProps) {
  const prevId = getAdjacentItemId(photos, photo.id, "prev");
  const nextId = getAdjacentItemId(photos, photo.id, "next");
  const prevPhoto = photos.find((item) => item.id === prevId) ?? null;
  const nextPhoto = photos.find((item) => item.id === nextId) ?? null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [photo.id]);

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
      if (event.key === "ArrowLeft" && prevId) {
        onSelectPhoto(prevId);
      } else if (event.key === "ArrowRight" && nextId) {
        onSelectPhoto(nextId);
      } else if (event.key === "Escape") {
        onBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disableKeyboardNav, prevId, nextId, onSelectPhoto, onBack]);

  return (
    <main
      data-testid="photo-detail-page"
      className="relative bg-[#111111] text-[#f2efe6] min-h-screen"
    >
      {/* Subtle side chevrons on tablet & desktop (hidden on mobile to keep screen uncluttered) */}
      {prevPhoto && (
        <button
          type="button"
          data-testid="photo-prev-chevron"
          onClick={() => onSelectPhoto(prevPhoto.id)}
          aria-label={`Previous frame: ${prevPhoto.title}`}
          title={`Previous: ${prevPhoto.title}`}
          className="hidden md:grid fixed left-2.5 lg:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-[#f2efe6]/25 bg-[#111111]/85 backdrop-blur-sm text-[#f2efe6]/65 place-items-center transition-all duration-150 hover:bg-[#4169ed] hover:text-[#f2efe6] hover:border-2 hover:border-[#f2efe6] hover:shadow-[3px_3px_0_#f2efe6] hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4169ed]"
        >
          <ChevronIcon direction="left" className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
      )}

      {nextPhoto && (
        <button
          type="button"
          data-testid="photo-next-chevron"
          onClick={() => onSelectPhoto(nextPhoto.id)}
          aria-label={`Next frame: ${nextPhoto.title}`}
          title={`Next: ${nextPhoto.title}`}
          className="hidden md:grid fixed right-2.5 lg:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-[#f2efe6]/25 bg-[#111111]/85 backdrop-blur-sm text-[#f2efe6]/65 place-items-center transition-all duration-150 hover:bg-[#4169ed] hover:text-[#f2efe6] hover:border-2 hover:border-[#f2efe6] hover:shadow-[3px_3px_0_#f2efe6] hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4169ed]"
        >
          <ChevronIcon direction="right" className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
      )}

      {/* Hero & Full Frame */}
      <section className="border-b-2 border-[#f2efe6]/25">
        <div className="max-w-[1160px] mx-auto px-5 md:px-16 lg:px-24 pt-7 pb-10 md:pt-10 md:pb-16">
          <div className="max-w-3xl">
            <p className="text-base md:text-[17px] font-medium text-[#6d8eff] tabular-nums m-0">
              {photo.genre} · {photo.location} · {photo.year}
            </p>
            <h1 className="mt-2 font-display text-[clamp(38px,5.8vw,74px)] leading-[1.02] tracking-[-0.025em] font-medium m-0">
              {photo.title}
            </h1>
          </div>

          <div className="mt-7 md:mt-10 overflow-hidden rounded-2xl border-2 border-[#f2efe6]/85 bg-[#050505] shadow-[8px_8px_0_#4169ed] flex items-center justify-center">
            <img
              src={photo.image}
              alt={`${photo.title}, ${photo.location} ${photo.year}`}
              referrerPolicy="no-referrer"
              className="w-full max-h-[68vh] object-contain"
            />
          </div>
        </div>
      </section>

      {/* Story & Camera Notes */}
      <section className="border-b-2 border-[#f2efe6]/25">
        <div className="max-w-[1160px] mx-auto px-5 md:px-16 lg:px-24 py-12 md:py-16 space-y-10 md:space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-start">
            <div>
              <p className="text-[16px] md:text-[16px] font-semibold leading-[1.5] tabular-nums text-[#6d8eff] m-0">
                Field Notes
              </p>
              <h2 className="mt-2 font-display text-[32px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.2] m-0">
                Behind the Frame
              </h2>
              <p className="mt-5 text-[18px] md:text-[20px] leading-[2] md:leading-[1.8] text-[#f2efe6]/88 m-0">
                {photo.story}
              </p>
            </div>

            <div className="rounded-2xl border-2 border-[#f2efe6]/35 bg-[#181817] p-5 md:p-7 space-y-4 text-[17px] md:text-[17px] leading-[1.5]">
              <p className="text-[15px] sm:text-[15px] font-semibold uppercase tracking-[0.06em] leading-[1.5] text-[#6d8eff] m-0">
                Technical Specifications
              </p>
              <dl className="space-y-3.5 m-0">
                <div className="flex justify-between gap-4 border-b border-[#f2efe6]/15 pb-3">
                  <dt className="text-[#f2efe6]/65">Genre</dt>
                  <dd className="font-medium m-0">{photo.genre}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#f2efe6]/15 pb-3">
                  <dt className="text-[#f2efe6]/65">Location</dt>
                  <dd className="font-medium m-0">{photo.location}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#f2efe6]/15 pb-3">
                  <dt className="text-[#f2efe6]/65">Camera</dt>
                  <dd className="font-medium m-0">{photo.camera}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#f2efe6]/15 pb-3">
                  <dt className="text-[#f2efe6]/65">Lens</dt>
                  <dd className="font-medium m-0">{photo.lens}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#f2efe6]/65">Exposure</dt>
                  <dd className="font-medium tabular-nums m-0">{photo.settings}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-[#f2efe6] bg-[#181817] p-6 md:p-9 shadow-[6px_6px_0_#4169ed] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.06em] text-[#6d8eff] m-0">
                Prints &amp; Commissions
              </p>
              <p className="mt-2.5 font-display text-2xl md:text-[30px] font-medium leading-[1.35] tracking-[-0.015em] m-0">
                Signed archival prints or editorial assignments.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                onInquire(
                  "Street Photography",
                  `Hi Sadman — I'm interested in prints or an editorial commission inspired by "${photo.title}".`,
                )
              }
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#4169ed] text-[#f2efe6] border-2 border-[#f2efe6] text-[15px] md:text-base font-medium shadow-[3px_3px_0_#f2efe6] hover:-translate-y-0.5 hover:bg-[#f2efe6] hover:text-[#171716] hover:shadow-[4px_5px_0_#4169ed] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-150 whitespace-nowrap shrink-0 self-start md:self-center"
            >
              Prints &amp; Commissions <Arrow className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Frame Switcher (clean navigation on mobile and end-of-page cue on all devices) */}
      {(prevPhoto || nextPhoto) && (
        <section aria-label="Adjacent frames">
          <div className="max-w-[1160px] mx-auto px-5 md:px-16 lg:px-24 py-10 md:py-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
              {prevPhoto ? (
                <button
                  type="button"
                  onClick={() => onSelectPhoto(prevPhoto.id)}
                  className="group text-left rounded-2xl border-2 border-[#f2efe6]/45 bg-[#181817] p-4 md:p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#f2efe6] hover:shadow-[5px_5px_0_#4169ed] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4169ed] flex items-center gap-3.5"
                >
                  <span className="w-10 h-10 rounded-xl border-2 border-[#f2efe6]/60 bg-[#111111] grid place-items-center shrink-0 transition-colors group-hover:bg-[#4169ed] group-hover:border-[#f2efe6]">
                    <ChevronIcon direction="left" className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <span className="block text-xs sm:text-sm font-medium text-[#f2efe6]/65">
                      Previous Frame
                    </span>
                    <span className="mt-0.5 block font-display text-lg md:text-[22px] font-medium truncate group-hover:text-[#6d8eff] transition-colors">
                      {prevPhoto.title}
                    </span>
                  </div>
                </button>
              ) : (
                <div />
              )}

              {nextPhoto && (
                <button
                  type="button"
                  onClick={() => onSelectPhoto(nextPhoto.id)}
                  className="group text-right rounded-2xl border-2 border-[#f2efe6]/45 bg-[#181817] p-4 md:p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#f2efe6] hover:shadow-[5px_5px_0_#4169ed] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4169ed] flex items-center justify-end gap-3.5"
                >
                  <div className="min-w-0">
                    <span className="block text-xs sm:text-sm font-medium text-[#f2efe6]/65">
                      Next Frame
                    </span>
                    <span className="mt-0.5 block font-display text-lg md:text-[22px] font-medium truncate group-hover:text-[#6d8eff] transition-colors">
                      {nextPhoto.title}
                    </span>
                  </div>
                  <span className="w-10 h-10 rounded-xl border-2 border-[#f2efe6]/60 bg-[#111111] grid place-items-center shrink-0 transition-colors group-hover:bg-[#4169ed] group-hover:border-[#f2efe6]">
                    <ChevronIcon direction="right" className="w-5 h-5" />
                  </span>
                </button>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
