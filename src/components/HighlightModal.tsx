import { useEffect } from "react";
import type { View } from "../data/portfolio";
import type { ContactFormValues, FeaturedHighlight } from "../utils/portfolioLogic";
import { Arrow, CloseIcon } from "./Characters";

interface HighlightModalProps {
  highlight: FeaturedHighlight | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onNavigate: (view: View) => void;
  onInquire: (topic: ContactFormValues["topic"], note: string) => void;
}

export function HighlightModal({
  highlight,
  onClose,
  onPrev,
  onNext,
  onNavigate,
  onInquire,
}: HighlightModalProps) {
  useEffect(() => {
    if (!highlight) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft") {
        onPrev();
      } else if (event.key === "ArrowRight") {
        onNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [highlight, onClose, onPrev, onNext]);

  if (!highlight) return null;

  const isPhoto = highlight.kind === "photo";
  const accentColor = isPhoto ? "#4169ed" : "#ff5b44";

  return (
    <div
      className="fixed inset-0 z-50 bg-[#171716]/45 flex items-center justify-center p-4 md:p-8 overflow-y-auto"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="highlight-modal-title"
        className={`w-full max-w-4xl rounded-2xl border-2 my-auto overflow-hidden flex flex-col max-h-[92vh] ${
          isPhoto
            ? "bg-[#111111] text-[#f2efe6] border-[#f2efe6] shadow-[10px_10px_0_#4169ed]"
            : "bg-[#f2efe6] text-[#171716] border-[#171716] shadow-[10px_10px_0_#171716]"
        }`}
      >
        <div
          className={`px-6 py-4 border-b-2 flex items-center justify-between gap-4 shrink-0 ${
            isPhoto
              ? "border-[#f2efe6]/25 bg-[#181817]"
              : "border-[#171716] bg-[#fffdf6]"
          }`}
        >
          <span
            className="text-sm font-medium"
            style={{ color: accentColor }}
          >
            Featured Highlight · {highlight.kicker}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close highlight details"
            className={`w-10 h-10 rounded-xl border-2 grid place-items-center transition-colors shrink-0 ${
              isPhoto
                ? "border-[#f2efe6]/70 bg-[#111111] hover:bg-[#4169ed] hover:border-[#4169ed]"
                : "border-[#171716] bg-[#f2efe6] hover:bg-[#ff5b44]"
            }`}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-y-auto p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-6 items-start">
            <div
              className={`aspect-[4/3] w-full overflow-hidden rounded-xl border-2 ${
                isPhoto ? "border-[#f2efe6]/70 bg-[#1e1e1d]" : "border-[#171716] bg-[#ddd]"
              }`}
            >
              <img
                src={highlight.image}
                alt={`${highlight.title} — ${highlight.meta}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <p
                className={`text-sm font-medium tabular-nums m-0 ${
                  isPhoto ? "text-[#f2efe6]/70" : "text-[#171716]/70"
                }`}
              >
                {highlight.meta}
              </p>
              <h2
                id="highlight-modal-title"
                className="mt-2 font-display text-3xl md:text-4xl font-medium tracking-[-0.02em] leading-tight m-0"
              >
                {highlight.title}
              </h2>
              <p
                className={`mt-4 text-sm md:text-base leading-relaxed m-0 ${
                  isPhoto ? "text-[#f2efe6]/85" : "text-[#171716]/85"
                }`}
              >
                {highlight.summary}
              </p>

              <div
                className={`mt-5 rounded-xl border-2 p-4 ${
                  isPhoto
                    ? "bg-[#1a1a19] border-[#f2efe6]/35"
                    : "bg-[#c7ef45] border-[#171716] text-[#171716]"
                }`}
              >
                <h3 className="text-xs font-semibold opacity-75 m-0">
                  {highlight.secondaryLabel}
                </h3>
                <p className="mt-1.5 text-sm font-medium leading-relaxed m-0 tabular-nums">
                  {highlight.secondaryValue}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-6 border-t-2 pt-5 ${
              isPhoto ? "border-[#f2efe6]/20" : "border-[#171716]"
            }`}
          >
            <div>
              <h3
                className={`text-sm font-semibold m-0 ${
                  isPhoto ? "text-[#f2efe6]/60" : "text-[#171716]/65"
                }`}
              >
                {highlight.primaryLabel}
              </h3>
              <p
                className={`mt-2 text-sm leading-relaxed m-0 ${
                  isPhoto ? "text-[#f2efe6]/85" : "text-[#171716]/85"
                }`}
              >
                {highlight.primaryValue}
              </p>
            </div>
            <div>
              <h3
                className={`text-sm font-semibold m-0 ${
                  isPhoto ? "text-[#f2efe6]/60" : "text-[#171716]/65"
                }`}
              >
                Focus
              </h3>
              <p className="mt-2 text-sm leading-relaxed m-0">
                {highlight.tags.join(" · ")}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`px-6 py-4 border-t-2 flex flex-wrap items-center justify-between gap-4 shrink-0 ${
            isPhoto
              ? "border-[#f2efe6]/25 bg-[#181817]"
              : "border-[#171716] bg-[#fffdf6]"
          }`}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 text-sm font-medium transition-colors ${
                isPhoto
                  ? "border-[#f2efe6]/60 hover:bg-[#4169ed] hover:border-[#4169ed]"
                  : "border-[#171716] bg-[#f2efe6] hover:bg-[#f5d837]"
              }`}
            >
              <Arrow direction="left" className="w-4 h-4" /> Prev
            </button>
            <button
              type="button"
              onClick={onNext}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 text-sm font-medium transition-colors ${
                isPhoto
                  ? "border-[#f2efe6]/60 hover:bg-[#4169ed] hover:border-[#4169ed]"
                  : "border-[#171716] bg-[#f2efe6] hover:bg-[#f5d837]"
              }`}
            >
              Next <Arrow className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate(isPhoto ? "photo" : "design");
              }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-colors ${
                isPhoto
                  ? "border-[#f2efe6]/60 hover:bg-[#f2efe6] hover:text-[#171716]"
                  : "border-[#171716] bg-[#fffdf6] hover:bg-[#c7ef45]"
              }`}
            >
              {isPhoto ? "Open Photo Archive" : "Open Design Gallery"}
            </button>
            <button
              type="button"
              onClick={() => {
                const title = highlight.title;
                const topic = isPhoto ? "Street Photography" : "Product Design";
                onClose();
                onInquire(
                  topic,
                  `Hi Kai — I explored "${title}" in your Featured Highlights and would love to connect.`,
                );
              }}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-sm font-medium transition-colors ${
                isPhoto
                  ? "border-[#f2efe6] bg-[#4169ed] text-[#f2efe6] hover:bg-[#f2efe6] hover:text-[#171716]"
                  : "border-[#171716] bg-[#ff5b44] text-[#171716] shadow-[3px_3px_0_#171716] hover:bg-[#171716] hover:text-[#f2efe6]"
              }`}
            >
              Inquire <Arrow className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
