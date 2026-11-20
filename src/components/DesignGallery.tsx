import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  DESIGN_CATEGORIES,
  DESIGN_PROJECTS,
  type DesignCategory,
  type DesignProject,
  type View,
} from "../data/portfolio";
import {
  filterDesignProjects,
  formatCount,
  getAdjacentItemId,
} from "../utils/portfolioLogic";
import { Arrow, CloseIcon } from "./Characters";

interface DesignGalleryProps {
  onNavigate: (view: View) => void;
  onModalChange?: (open: boolean) => void;
  onInquire: (topic: "Product Design", note: string) => void;
}

export function DesignGallery({
  onNavigate,
  onModalChange,
  onInquire,
}: DesignGalleryProps) {
  const [category, setCategory] = useState<DesignCategory>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visibleProjects = filterDesignProjects(DESIGN_PROJECTS, category);
  const selectedProject: DesignProject | null =
    DESIGN_PROJECTS.find((p) => p.id === selectedId) ?? null;

  useEffect(() => {
    onModalChange?.(Boolean(selectedProject));
  }, [selectedProject, onModalChange]);

  useEffect(() => {
    if (!selectedProject) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedId(null);
      } else if (event.key === "ArrowRight") {
        setSelectedId((id) =>
          id ? getAdjacentItemId(visibleProjects, id, "next") : null,
        );
      } else if (event.key === "ArrowLeft") {
        setSelectedId((id) =>
          id ? getAdjacentItemId(visibleProjects, id, "prev") : null,
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject, visibleProjects]);

  return (
    <main className="gallery bg-[#f2efe6] text-[#171716] min-h-screen">
      <section className="border-b-2 border-[#171716]">
        <div className="max-w-[1360px] mx-auto px-5 md:px-10 pt-5 pb-6 md:pt-7 md:pb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="group inline-flex items-center gap-2.5 py-1.5 pr-2 text-sm font-medium text-[#171716] hover:text-[#d9442e] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
            >
              <Arrow
                direction="left"
                className="w-4 h-4 transition-transform duration-150 group-hover:-translate-x-1"
              />
              <span className="group-hover:underline underline-offset-4">Back to Select</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate("photo")}
              className="group inline-flex items-center gap-2 py-1.5 pl-2 text-sm font-medium text-[#4169ed] transition-colors"
            >
              <span className="group-hover:underline underline-offset-4">Switch to Photography</span>
              <Arrow className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
            </button>
          </div>

          <div className="mt-8 md:mt-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h1 className="font-display text-[clamp(48px,6.2vw,88px)] leading-[0.96] tracking-[-0.025em] font-medium m-0">
              Product
              <br />
              <em className="not-italic font-medium text-[#d9442e]">Design.</em>
            </h1>
            <p className="max-w-md text-base leading-relaxed text-[#171716]/80 m-0">
              Useful, tactile digital and physical products—built from messy questions, field
              research, and sharp industrial execution.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t-2 border-[#171716] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter design projects">
              {DESIGN_CATEGORIES.map((tab) => {
                const active = category === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCategory(tab)}
                    className={`px-4 py-2 rounded-xl border-2 border-[#171716] text-sm font-medium transition-all duration-150 whitespace-nowrap shrink-0 ${
                      active
                        ? "bg-[#ff5b44] text-[#171716] shadow-[3px_3px_0_#171716]"
                        : "bg-[#fffdf6] text-[#171716] hover:bg-[#c7ef45]"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
            <span className="text-sm font-medium tabular-nums text-[#171716]/75">
              {formatCount(visibleProjects.length)} Projects
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-[1360px] mx-auto px-5 md:px-10 pt-8 pb-16 md:pt-10 md:pb-20">
        {visibleProjects.length === 0 ? (
          <div className="rounded-2xl border-2 border-[#171716] bg-[#fffdf6] p-12 text-center">
            <p className="text-sm m-0">No projects match this filter.</p>
            <button
              type="button"
              onClick={() => setCategory("All")}
              className="mt-4 px-4 py-2 rounded-xl border-2 border-[#171716] bg-[#ff5b44] text-sm font-medium"
            >
              Show All Projects
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">
            {visibleProjects.map((project, index) => (
              <article
                key={project.id}
                className={project.wide && category === "All" ? "md:col-span-2" : ""}
              >
                <button
                  type="button"
                  onClick={() => setSelectedId(project.id)}
                  className="group w-full text-left rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
                  aria-label={`Open case study for ${project.title}`}
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl border-2 border-[#171716] bg-[#ddd] shadow-[6px_6px_0_#171716] group-hover:shadow-[8px_8px_0_#ff5b44] transition-all duration-200 ${
                      project.wide && category === "All"
                        ? "aspect-[16/9] max-h-[620px] w-full"
                        : "aspect-[4/3] w-full"
                    }`}
                  >
                    <img
                      src={project.image}
                      alt={`${project.title} — ${project.subtitle}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute right-5 top-5 w-12 h-12 rounded-full bg-[#ff5b44] border-2 border-[#171716] text-[#171716] grid place-items-center scale-0 -rotate-45 group-hover:scale-100 group-hover:rotate-0 transition-transform duration-200"
                    >
                      <Arrow />
                    </span>
                  </div>

                  <div className="pt-4 flex flex-wrap items-baseline justify-between gap-3">
                    <div className="flex items-baseline gap-4">
                      <span className="text-sm font-medium tabular-nums text-[#171716]/60">
                        {formatCount(index + 1)}
                      </span>
                      <h2 className="font-display text-2xl md:text-[32px] font-medium tracking-[-0.015em] leading-tight m-0 group-hover:text-[#d9442e] transition-colors">
                        {project.title}
                      </h2>
                    </div>
                    <p className="text-sm text-[#171716]/70 tabular-nums m-0">
                      {project.subtitle} · {project.year}
                    </p>
                  </div>
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {selectedProject &&
        createPortal(
          <div
            className="fixed inset-0 z-50 bg-[#171716]/45 flex items-center justify-center p-4 md:p-8 overflow-y-auto"
            role="presentation"
            onClick={(event) => {
              if (event.target === event.currentTarget) setSelectedId(null);
            }}
          >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
            className="w-full max-w-4xl rounded-2xl bg-[#f2efe6] text-[#171716] border-2 border-[#171716] shadow-[10px_10px_0_#171716] overflow-hidden my-auto max-h-[92vh] flex flex-col"
          >
            <div className="px-6 py-4 border-b-2 border-[#171716] bg-[#fffdf6] flex items-center justify-between gap-4 shrink-0">
              <div className="text-sm font-medium tabular-nums text-[#171716]/75">
                {selectedProject.client} · {selectedProject.year} · {selectedProject.role}
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close case study"
                className="w-10 h-10 rounded-xl border-2 border-[#171716] bg-[#f2efe6] grid place-items-center hover:bg-[#ff5b44] transition-colors shrink-0"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="overflow-y-auto p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-6 items-start">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border-2 border-[#171716] bg-[#ddd]">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-sm text-[#d9442e] font-medium m-0">
                    {selectedProject.subtitle}
                  </p>
                  <h2
                    id="case-study-title"
                    className="mt-2 font-display text-4xl font-medium tracking-[-0.02em] leading-tight m-0"
                  >
                    {selectedProject.title}
                  </h2>
                  <p className="mt-4 text-sm md:text-base leading-relaxed text-[#171716]/85 m-0">
                    {selectedProject.summary}
                  </p>
                  <div className="mt-5 rounded-xl bg-[#c7ef45] border-2 border-[#171716] p-4">
                    <h3 className="text-xs font-semibold text-[#171716]/75 m-0">
                      Outcome
                    </h3>
                    <p className="mt-1.5 text-sm font-medium leading-relaxed m-0">
                      {selectedProject.outcome}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t-2 border-[#171716] pt-6">
                <div>
                  <h3 className="text-sm font-semibold text-[#171716]/70 m-0">
                    The Challenge
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#171716]/85 m-0">
                    {selectedProject.challenge}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#171716]/70 m-0">
                    Design Approach
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#171716]/85 m-0">
                    {selectedProject.approach}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#171716]/70 m-0">
                    Deliverables
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#171716] m-0">
                    {selectedProject.deliverables.join(" · ")}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t-2 border-[#171716] bg-[#fffdf6] flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedId(getAdjacentItemId(visibleProjects, selectedProject.id, "prev"))
                  }
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-[#171716] bg-[#f2efe6] text-sm font-medium hover:bg-[#f5d837] transition-colors"
                >
                  <Arrow direction="left" className="w-4 h-4" /> Prev
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedId(getAdjacentItemId(visibleProjects, selectedProject.id, "next"))
                  }
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-[#171716] bg-[#f2efe6] text-sm font-medium hover:bg-[#f5d837] transition-colors"
                >
                  Next <Arrow className="w-4 h-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  const title = selectedProject.title;
                  setSelectedId(null);
                  onInquire(
                    "Product Design",
                    `Hi Kai — I saw your ${title} case study and would love to discuss a similar product project.`,
                  );
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#171716] bg-[#ff5b44] text-[#171716] text-sm font-medium shadow-[3px_3px_0_#171716] hover:bg-[#171716] hover:text-[#f2efe6] transition-colors"
              >
                Inquire About Similar Work <Arrow className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>,
          document.body,
        )}
    </main>
  );
}
