import { useState } from "react";
import {
  PHOTO_GENRES,
  PHOTO_ITEMS,
  type PhotoGenre,
  type View,
} from "../data/portfolio";
import { filterPhotoItems } from "../utils/portfolioLogic";
import { Arrow } from "./Characters";

interface PhotoGalleryProps {
  onNavigate: (view: View) => void;
  onOpenPhotoDetail: (photoId: string) => void;
}

export function PhotoGallery({
  onNavigate,
  onOpenPhotoDetail,
}: PhotoGalleryProps) {
  const [genre, setGenre] = useState<PhotoGenre>("All");

  const visiblePhotos = filterPhotoItems(PHOTO_ITEMS, genre);

  return (
    <main className="gallery bg-[#111111] text-[#f2efe6] min-h-screen">
      <section className="border-b-2 border-[#f2efe6]">
        <div className="max-w-[1360px] mx-auto px-5 md:px-10 pt-5 pb-6 md:pt-7 md:pb-8">
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

          <div className="mt-8 md:mt-10 flex flex-col gap-5 max-w-2xl">
            <h1 className="font-display text-[clamp(48px,6.2vw,88px)] leading-[0.96] tracking-[-0.025em] font-medium m-0">
              Framed
              <br />
              <em className="not-italic font-medium text-[#6d8eff]">Stories.</em>
            </h1>
            <p className="max-w-xl text-[17px] md:text-[19px] leading-[1.7] text-[#f2efe6]/75 m-0">
              Unscripted fragments of city life across East &amp; Southeast Asia. Color, solitude,
              monsoon rain, and fleeting light on 35mm.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t-2 border-[#f2efe6]/30 flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter photographs by genre">
              {PHOTO_GENRES.map((tab) => {
                const active = genre === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setGenre(tab)}
                    className={`px-4 py-2 rounded-xl border-2 text-[15px] md:text-base font-medium transition-all duration-150 whitespace-nowrap shrink-0 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
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
      </section>

      <section className="max-w-[1360px] mx-auto px-5 md:px-10 pt-8 pb-16 md:pt-10 md:pb-20">
        {visiblePhotos.length === 0 ? (
          <div className="rounded-2xl border-2 border-[#f2efe6]/40 p-12 text-center">
            <p className="text-sm m-0">No frames in this genre yet.</p>
            <button
              type="button"
              onClick={() => setGenre("All")}
              className="mt-4 px-4 py-2 rounded-xl border-2 border-[#f2efe6] bg-[#4169ed] text-sm font-medium"
            >
              Show All Frames
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-14">
            {visiblePhotos.map((photo) => {
              const isAll = genre === "All";
              const isWide = Boolean(photo.wide && isAll);
              return (
                <article
                  key={photo.id}
                  className={
                    isAll
                      ? isWide
                        ? "md:col-span-2 lg:col-span-7"
                        : "lg:col-span-5"
                      : "lg:col-span-6"
                  }
                >
                  <button
                    type="button"
                    onClick={() => onOpenPhotoDetail(photo.id)}
                    className="group w-full text-left rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4169ed]"
                    aria-label={`Open ${photo.title} story`}
                  >
                    <div
                      className={`relative overflow-hidden rounded-2xl border-2 border-[#f2efe6]/80 bg-[#1e1e1d] transition-all duration-200 group-hover:border-[#4169ed] ${
                        isAll
                          ? isWide
                            ? "aspect-[16/9] max-h-[640px] lg:aspect-auto lg:h-[380px] xl:h-[410px] w-full"
                            : "aspect-[4/3] lg:aspect-auto lg:h-[380px] xl:h-[410px] w-full"
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
                      <h2 className="font-display text-2xl md:text-[32px] font-medium tracking-[-0.015em] leading-tight m-0 group-hover:text-[#6d8eff] transition-colors">
                        {photo.title}
                      </h2>
                      <p className="text-[15px] md:text-base text-[#f2efe6]/75 tabular-nums m-0">
                        {photo.genre} · {photo.location} · {photo.year}
                      </p>
                    </div>
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
