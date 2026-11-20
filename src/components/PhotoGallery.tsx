import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  PHOTO_ITEMS,
  PHOTO_LOCATIONS,
  type PhotoItem,
  type PhotoLocation,
  type View,
} from "../data/portfolio";
import {
  filterPhotoItems,
  formatCount,
  getAdjacentItemId,
} from "../utils/portfolioLogic";
import { Arrow, CloseIcon } from "./Characters";

interface PhotoGalleryProps {
  onNavigate: (view: View) => void;
  onModalChange?: (open: boolean) => void;
  onInquire: (topic: "Street Photography", note: string) => void;
}

export function PhotoGallery({
  onNavigate,
  onModalChange,
  onInquire,
}: PhotoGalleryProps) {
  const [location, setLocation] = useState<PhotoLocation>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visiblePhotos = filterPhotoItems(PHOTO_ITEMS, location);
  const selectedPhoto: PhotoItem | null =
    PHOTO_ITEMS.find((p) => p.id === selectedId) ?? null;

  useEffect(() => {
    onModalChange?.(Boolean(selectedPhoto));
  }, [selectedPhoto, onModalChange]);

  useEffect(() => {
    if (!selectedPhoto) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedId(null);
      } else if (event.key === "ArrowRight") {
        setSelectedId((id) =>
          id ? getAdjacentItemId(visiblePhotos, id, "next") : null,
        );
      } else if (event.key === "ArrowLeft") {
        setSelectedId((id) =>
          id ? getAdjacentItemId(visiblePhotos, id, "prev") : null,
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto, visiblePhotos]);

  return (
    <main className="gallery bg-[#111111] text-[#f2efe6] min-h-screen">
      <section className="border-b-2 border-[#f2efe6]">
        <div className="max-w-[1360px] mx-auto px-5 md:px-10 pt-5 pb-6 md:pt-7 md:pb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="group inline-flex items-center gap-2.5 py-1.5 pr-2 text-sm font-medium text-[#f2efe6] hover:text-[#6d8eff] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4169ed]"
            >
              <Arrow
                direction="left"
                className="w-4 h-4 transition-transform duration-150 group-hover:-translate-x-1"
              />
              <span className="group-hover:underline underline-offset-4">Back to Select</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate("design")}
              className="group inline-flex items-center gap-2 py-1.5 pl-2 text-sm font-medium text-[#ff5b44] transition-colors"
            >
              <span className="group-hover:underline underline-offset-4">Switch to Product Design</span>
              <Arrow className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
            </button>
          </div>

          <div className="mt-8 md:mt-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h1 className="font-display text-[clamp(48px,6.2vw,88px)] leading-[0.96] tracking-[-0.025em] font-medium m-0">
              Street
              <br />
              <em className="not-italic font-medium text-[#6d8eff]">Stories.</em>
            </h1>
            <p className="max-w-md text-base leading-relaxed text-[#f2efe6]/80 m-0">
              Unscripted fragments of city life across East &amp; Southeast Asia—color, solitude,
              monsoon rain, and fleeting light on 35mm.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t-2 border-[#f2efe6]/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter photographs by city">
              {PHOTO_LOCATIONS.map((city) => {
                const active = location === city;
                return (
                  <button
                    key={city}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setLocation(city)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-150 whitespace-nowrap shrink-0 ${
                      active
                        ? "bg-[#4169ed] text-[#f2efe6] border-[#f2efe6]"
                        : "bg-transparent text-[#f2efe6] border-[#f2efe6]/40 hover:border-[#f2efe6]"
                    }`}
                  >
                    {city}
                  </button>
                );
              })}
            </div>
            <span className="text-sm font-medium tabular-nums text-[#f2efe6]/80">
              {formatCount(visiblePhotos.length)} Frames
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-[1360px] mx-auto px-5 md:px-10 pt-8 pb-16 md:pt-10 md:pb-20">
        {visiblePhotos.length === 0 ? (
          <div className="rounded-2xl border-2 border-[#f2efe6]/40 p-12 text-center">
            <p className="text-sm m-0">No frames in this city series.</p>
            <button
              type="button"
              onClick={() => setLocation("All")}
              className="mt-4 px-4 py-2 rounded-xl border-2 border-[#f2efe6] bg-[#4169ed] text-sm font-medium"
            >
              Show All Frames
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">
            {visiblePhotos.map((photo, index) => (
              <article
                key={photo.id}
                className={photo.wide && location === "All" ? "md:col-span-2" : ""}
              >
                <button
                  type="button"
                  onClick={() => setSelectedId(photo.id)}
                  className="group w-full text-left rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4169ed]"
                  aria-label={`Open lightbox for ${photo.title}`}
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl border-2 border-[#f2efe6]/80 bg-[#1e1e1d] transition-all duration-200 group-hover:border-[#4169ed] ${
                      photo.wide && location === "All"
                        ? "aspect-[16/9] max-h-[640px] w-full"
                        : "aspect-[4/3] w-full"
                    }`}
                  >
                    <img
                      src={photo.image}
                      alt={`${photo.title}, ${photo.location} ${photo.year}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover saturate-[0.85] group-hover:saturate-[1.15] group-hover:scale-[1.03] transition-all duration-500"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute right-5 top-5 w-12 h-12 rounded-full bg-[#4169ed] border-2 border-[#f2efe6] text-[#f2efe6] grid place-items-center scale-0 -rotate-45 group-hover:scale-100 group-hover:rotate-0 transition-transform duration-200"
                    >
                      <Arrow />
                    </span>
                  </div>

                  <div className="pt-4 flex flex-wrap items-baseline justify-between gap-3">
                    <div className="flex items-baseline gap-4">
                      <span className="text-sm font-medium tabular-nums text-[#f2efe6]/60">
                        {formatCount(index + 1)}
                      </span>
                      <h2 className="font-display text-2xl md:text-[32px] font-medium tracking-[-0.015em] leading-tight m-0 group-hover:text-[#6d8eff] transition-colors">
                        {photo.title}
                      </h2>
                    </div>
                    <p className="text-sm text-[#f2efe6]/70 tabular-nums m-0">
                      {photo.location} · {photo.year} · {photo.camera}
                    </p>
                  </div>
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {selectedPhoto &&
        createPortal(
          <div
            className="fixed inset-0 z-50 bg-[#0a0a0a]/65 flex items-center justify-center p-4 md:p-8 overflow-y-auto"
            role="presentation"
            onClick={(event) => {
              if (event.target === event.currentTarget) setSelectedId(null);
            }}
          >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="photo-lightbox-title"
            className="w-full max-w-5xl rounded-2xl bg-[#111111] text-[#f2efe6] border-2 border-[#f2efe6] my-auto overflow-hidden flex flex-col max-h-[94vh]"
          >
            <div className="px-5 py-3.5 border-b border-[#f2efe6]/25 flex items-center justify-between gap-4 shrink-0">
              <span className="text-sm font-medium tabular-nums text-[#f2efe6]/80">
                {selectedPhoto.location} · {selectedPhoto.year} · {selectedPhoto.camera}
              </span>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close photograph lightbox"
                className="w-10 h-10 rounded-xl border border-[#f2efe6]/60 grid place-items-center hover:bg-[#4169ed] hover:border-[#4169ed] transition-colors shrink-0"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="overflow-y-auto p-5 md:p-7 space-y-5">
              <div className="rounded-xl bg-[#050505] border border-[#f2efe6]/20 flex items-center justify-center max-h-[50vh] overflow-hidden">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[50vh] w-auto max-w-full object-contain"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-6 items-start">
                <div>
                  <h2
                    id="photo-lightbox-title"
                    className="font-display text-3xl md:text-4xl font-medium tracking-[-0.02em] leading-tight m-0"
                  >
                    {selectedPhoto.title}
                  </h2>
                  <p className="mt-3 text-sm md:text-base leading-relaxed text-[#f2efe6]/80 m-0">
                    {selectedPhoto.story}
                  </p>
                </div>

                <div className="rounded-xl border border-[#f2efe6]/25 p-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-[#f2efe6]/60">Camera</span>
                    <span>{selectedPhoto.camera}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#f2efe6]/60">Lens</span>
                    <span>{selectedPhoto.lens}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#f2efe6]/60">Exposure</span>
                    <span className="tabular-nums">{selectedPhoto.settings}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-[#f2efe6]/25 flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedId(getAdjacentItemId(visiblePhotos, selectedPhoto.id, "prev"))
                  }
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#f2efe6]/60 text-sm font-medium hover:bg-[#4169ed] hover:border-[#4169ed] transition-colors"
                >
                  <Arrow direction="left" className="w-4 h-4" /> Prev Frame
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedId(getAdjacentItemId(visiblePhotos, selectedPhoto.id, "next"))
                  }
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#f2efe6]/60 text-sm font-medium hover:bg-[#4169ed] hover:border-[#4169ed] transition-colors"
                >
                  Next Frame <Arrow className="w-4 h-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  const title = selectedPhoto.title;
                  setSelectedId(null);
                  onInquire(
                    "Street Photography",
                    `Hi Kai — I'm interested in prints or an editorial commission inspired by "${title}".`,
                  );
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4169ed] text-[#f2efe6] border border-[#f2efe6] text-sm font-medium hover:bg-[#f2efe6] hover:text-[#171716] transition-colors"
              >
                Prints &amp; Commissions <Arrow className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>,
          document.body,
        )}
    </main>
  );
}
