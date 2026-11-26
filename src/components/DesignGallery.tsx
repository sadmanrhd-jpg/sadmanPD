import { useRef, useState } from "react";
import {
  DESIGN_CATEGORIES,
  DESIGN_PROJECTS,
  type DesignCategory,
  type View,
} from "../data/portfolio";
import {
  advancePosterCoverCycle,
  filterDesignProjects,
  getGalleryScrollTarget,
  type PosterCoverCycleState,
} from "../utils/portfolioLogic";
import { Arrow } from "./Characters";

const POSTER_COVER_STORAGE_PREFIX = "portfolio:poster-cover-cycle:";
const pageLoadPosterCoverIndexCache = new Map<string, number>();

function getReloadPosterCoverIndex(projectId: string, total: number): number {
  const cached = pageLoadPosterCoverIndexCache.get(projectId);
  if (cached !== undefined && cached >= 0 && cached < total) {
    return cached;
  }

  let previousState: PosterCoverCycleState | null = null;
  const storageKey = `${POSTER_COVER_STORAGE_PREFIX}${projectId}`;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      previousState = JSON.parse(raw) as PosterCoverCycleState;
    }
  } catch {
    previousState = null;
  }

  const { index, nextState } = advancePosterCoverCycle(total, previousState);
  pageLoadPosterCoverIndexCache.set(projectId, index);

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(nextState));
  } catch {
    // Ignore storage write errors in restricted browsing modes
  }

  return index;
}

interface DesignGalleryProps {
  onNavigate: (view: View) => void;
  onOpenDetailedStudy: (projectId: string) => void;
}

export function DesignGallery({
  onNavigate,
  onOpenDetailedStudy,
}: DesignGalleryProps) {
  const [category, setCategory] = useState<DesignCategory>("All");
  const [riseKey, setRiseKey] = useState(0);
  const genreAnchorRef = useRef<HTMLDivElement | null>(null);

  const visibleProjects = filterDesignProjects(DESIGN_PROJECTS, category);

  const handleSelectCategory = (tab: DesignCategory) => {
    setCategory(tab);
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

  return (
    <main className="gallery bg-[#f2efe6] text-[#171716] min-h-screen">
      <section data-testid="design-gallery-hero">
        <div className="max-w-[1360px] mx-auto px-5 md:px-10 pt-5 md:pt-7">
          <div
            data-testid="gallery-nav-actions"
            className="flex flex-col items-start gap-2.5"
          >
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border-2 border-[#171716] bg-[#fffdf6] text-sm font-medium text-[#171716] shadow-[3px_3px_0_#171716] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_5px_0_#171716] hover:bg-[#171716] hover:text-[#f2efe6] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none active:bg-[#171716] active:text-[#f2efe6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
            >
              <Arrow
                direction="left"
                className="w-4 h-4 transition-transform duration-150 group-hover:-translate-x-1 group-active:-translate-x-1"
              />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate("photo")}
              className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border-2 border-[#171716] bg-[#4169ed] text-sm font-medium text-[#f2efe6] shadow-[3px_3px_0_#171716] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_5px_0_#171716] hover:bg-[#3156d6] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none active:bg-[#3156d6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4169ed]"
            >
              <span>Switch to Photography</span>
              <Arrow className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1 group-active:translate-x-1" />
            </button>
          </div>

          <div className="mt-8 md:mt-10 pb-6 flex flex-col gap-5 max-w-2xl">
            <h1 className="font-display text-[clamp(48px,6.2vw,88px)] leading-[0.96] tracking-[-0.025em] font-medium m-0">
              Product
              <br />
              <em className="not-italic font-medium text-[#d9442e]">Design.</em>
            </h1>
            <p className="max-w-xl text-[17px] md:text-[19px] leading-[1.7] text-[#171716]/72 m-0">
              Useful, practical digital products built from real field research, messy questions,
              and careful execution.
            </p>
          </div>

          <div className="border-t-2 border-[#171716]" aria-hidden="true" />
        </div>
      </section>

      <div ref={genreAnchorRef} className="h-0" aria-hidden="true" />

      <div
        data-testid="design-genre-bar"
        className="sticky top-[80px] z-20 bg-[#f2efe6]/95 backdrop-blur-sm border-b-2 border-[#171716]"
      >
        <div className="max-w-[1360px] mx-auto px-5 md:px-10 py-3.5 md:py-4 flex flex-wrap items-center gap-4">
          <div
            className="flex flex-wrap items-center gap-1.5 md:gap-2"
            role="tablist"
            aria-label="Filter design projects"
          >
            {DESIGN_CATEGORIES.map((tab) => {
              const active = category === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleSelectCategory(tab)}
                  className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl border-2 border-[#171716] text-[13px] sm:text-sm lg:text-base font-medium transition-all duration-150 whitespace-nowrap shrink-0 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                    active
                      ? "bg-[#ff5b44] text-[#171716] shadow-[3px_3px_0_#171716]"
                      : "bg-[#fffdf6] text-[#171716] hover:-translate-y-0.5 hover:bg-[#c7ef45] hover:shadow-[3px_3px_0_#171716] active:bg-[#c7ef45]"
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
        data-testid="design-projects-section"
        data-active-category={category}
        className="max-w-[1360px] mx-auto px-5 md:px-10 pt-6 pb-16 md:pt-8 md:pb-20 min-h-[calc(100svh-155px)]"
      >
        {visibleProjects.length === 0 ? (
          <div className="rounded-2xl border-2 border-[#171716] bg-[#fffdf6] p-12 text-center">
            <p className="text-sm m-0">No projects match this filter.</p>
            <button
              type="button"
              onClick={() => handleSelectCategory("All")}
              className="mt-4 px-4 py-2 rounded-xl border-2 border-[#171716] bg-[#ff5b44] text-sm font-medium"
            >
              Show All Projects
            </button>
          </div>
        ) : (
          <div
            key={riseKey}
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-14 ${
              riseKey > 0 ? "gallery-projects-rise" : ""
            }`}
          >
            {visibleProjects.map((project, idx) => {
              const isAll = category === "All";
              const isWide = Boolean(project.wide && isAll);
              const isTrailingOdd =
                isAll &&
                visibleProjects.length % 2 === 1 &&
                idx === visibleProjects.length - 1;
              const isScreenFrame = project.heroSurface === "screen-frame";
              const isCanvasFrame = project.heroSurface === "canvas-frame";
              return (
                <article
                  key={project.id}
                  className={
                    isAll
                      ? isTrailingOdd
                        ? "md:col-span-2 lg:col-span-10 lg:col-start-2"
                        : isWide
                          ? "md:col-span-2 lg:col-span-7"
                          : "lg:col-span-5"
                      : "lg:col-span-6"
                  }
                >
                  <button
                    type="button"
                    onClick={() => onOpenDetailedStudy(project.id)}
                    className="group w-full text-left rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
                    aria-label={`Open case study for ${project.title}`}
                  >
                    <div
                      className={`relative overflow-hidden rounded-2xl border-2 border-[#171716] shadow-[6px_6px_0_#171716] group-hover:shadow-[8px_8px_0_#ff5b44] transition-all duration-200 ${
                        isScreenFrame
                          ? "bg-white"
                          : isCanvasFrame
                            ? "bg-[#f2efe6]"
                            : project.imageFit === "contain"
                              ? "bg-[#f2efe6] p-3 sm:p-5"
                              : "bg-[#f2efe6]"
                      } ${
                        isAll
                          ? isTrailingOdd
                            ? "aspect-[16/9] w-full"
                            : isWide
                              ? "aspect-[16/9] max-h-[620px] lg:aspect-auto lg:h-[380px] xl:h-[410px] w-full"
                              : "aspect-[4/3] lg:aspect-auto lg:h-[380px] xl:h-[410px] w-full"
                          : isScreenFrame && project.imageFit === "contain"
                            ? "aspect-[16/9] w-full"
                            : "aspect-[4/3] w-full"
                      }`}
                    >
                      {project.editorialDocument ? (
                        <div className="w-full h-full flex items-center justify-center gap-3 sm:gap-5 px-2 sm:px-4 py-1">
                          <img
                            src={project.image}
                            alt={`${project.title}, ${project.subtitle}`}
                            referrerPolicy="no-referrer"
                            className="h-full max-h-full w-auto max-w-[47%] object-contain rounded-[6px] bg-white shadow-[0_10px_24px_rgba(23,23,22,0.16)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.02]"
                          />
                          {project.editorialDocument.spreadPreviewSrc && (
                            <img
                              src={project.editorialDocument.spreadPreviewSrc}
                              alt=""
                              aria-hidden="true"
                              referrerPolicy="no-referrer"
                              className="h-[92%] max-h-full w-auto max-w-[44%] object-contain rounded-[6px] bg-white shadow-[0_10px_24px_rgba(23,23,22,0.14)] transition-transform duration-500 group-hover:translate-y-0.5 group-hover:scale-[1.02]"
                            />
                          )}
                        </div>
                      ) : project.posterGallery && project.posterGallery.items.length > 0 ? (
                        (() => {
                          const coverIdx = getReloadPosterCoverIndex(
                            project.id,
                            project.posterGallery.items.length,
                          );
                          const coverPoster =
                            project.posterGallery.items[coverIdx] ??
                            project.posterGallery.items[0];
                          return (
                            <div
                              data-testid="poster-cover-preview"
                              data-cover-title={coverPoster.title}
                              data-cover-index={coverIdx}
                              className="w-full h-full flex items-center justify-center p-1 sm:p-2"
                            >
                              <img
                                src={coverPoster.src}
                                alt={`${project.title}: ${coverPoster.title} poster cover`}
                                referrerPolicy="no-referrer"
                                className="max-h-full max-w-full w-auto h-auto object-contain rounded-[6px] shadow-[0_14px_30px_rgba(23,23,22,0.22)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.03]"
                              />
                            </div>
                          );
                        })()
                      ) : (
                        <img
                          src={project.image}
                          alt={`${project.title}, ${project.subtitle}`}
                          referrerPolicy="no-referrer"
                          className={`w-full h-full transition-transform duration-500 group-hover:scale-[1.03] ${
                            project.imageFit === "contain" ? "object-contain" : "object-cover"
                          } ${
                            project.heroSurface === "blend-canvas"
                              ? "mix-blend-multiply brightness-[1.015]"
                              : project.heroSurface === "soft-feather"
                                ? "cover-edge-feather"
                                : ""
                          }`}
                        />
                      )}
                      <span
                        aria-hidden="true"
                        className="absolute right-5 top-5 w-12 h-12 rounded-full bg-[#ff5b44] border-2 border-[#171716] text-[#171716] grid place-items-center scale-0 -rotate-45 group-hover:scale-100 group-hover:rotate-0 transition-transform duration-200"
                      >
                        <Arrow />
                      </span>
                    </div>

                    <div className="pt-4 flex flex-wrap items-baseline justify-between gap-3">
                      <h2 className="font-display text-2xl md:text-[32px] font-medium tracking-[-0.015em] leading-tight m-0 group-hover:text-[#d9442e] transition-colors">
                        {project.title}
                      </h2>
                      <p className="text-[15px] md:text-base text-[#171716]/72 tabular-nums m-0">
                        {project.subtitle} · {project.year}
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
