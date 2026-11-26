import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { EditorialDocumentBlock } from "../data/portfolio";
import {
  formatCount,
  getEditorialSpreadPages,
  getSwipeFlipProgress,
  shouldUseEditorialPageFlip,
  stepEditorialPage,
  type EditorialViewMode,
} from "../utils/portfolioLogic";
import { ChevronIcon } from "./Characters";

interface ActiveDragState {
  direction: "next" | "prev";
  progress: number;
  leafIndex: number;
  underIndex: number;
  cancelling?: boolean;
}

interface FlipTransitionState {
  direction: "next" | "prev";
  leafIndex: number;
  underIndex: number;
  targetIndex: number;
  phase: "start" | "settling";
  startAngle: number;
  endAngle: number;
}

interface EditorialPdfReaderProps {
  title: string;
  document: EditorialDocumentBlock;
  disableKeyboardNav?: boolean;
  onFullscreenChange?: (open: boolean) => void;
}

function ExpandIcon({ className = "w-4 h-4" }: { className?: string }) {
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

function ExternalPdfIcon({ className = "w-4 h-4" }: { className?: string }) {
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
      <path d="M14 3h7v7" />
      <path d="M10 14 21 3" />
      <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
    </svg>
  );
}

export function EditorialPdfReader({
  title,
  document: doc,
  disableKeyboardNav = false,
  onFullscreenChange,
}: EditorialPdfReaderProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<EditorialViewMode>("single");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true,
  );
  const [activeDrag, setActiveDrag] = useState<ActiveDragState | null>(null);
  const [flipAnim, setFlipAnim] = useState<FlipTransitionState | null>(null);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const swipeStartXRef = useRef<number | null>(null);
  const swipeStartYRef = useRef<number | null>(null);
  const swipeAxisRef = useRef<"x" | "y" | null>(null);
  const lastDeltaXRef = useRef<number>(0);
  const suppressClickRef = useRef<boolean>(false);
  const flipTimerRef = useRef<number | null>(null);
  const cancelTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const thumbStripRef = useRef<HTMLDivElement | null>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const totalPages = doc.pages.length;

  const clearFlipTimers = useCallback(() => {
    if (flipTimerRef.current !== null) {
      window.clearTimeout(flipTimerRef.current);
      flipTimerRef.current = null;
    }
    if (cancelTimerRef.current !== null) {
      window.clearTimeout(cancelTimerRef.current);
      cancelTimerRef.current = null;
    }
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  // Reset reader to cover when switching editorial publications
  useEffect(() => {
    clearFlipTimers();
    setPageIndex(0);
    setViewMode("single");
    setIsFullscreen(false);
    setActiveDrag(null);
    setFlipAnim(null);
  }, [doc.pdfUrl, clearFlipTimers]);

  useEffect(() => {
    return () => clearFlipTimers();
  }, [clearFlipTimers]);

  // Track viewport width so two-page spread only applies on tablet/desktop
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const effectiveMode: EditorialViewMode = isDesktop ? viewMode : "single";
  const canUseMobileFlip = shouldUseEditorialPageFlip(pageIndex, isDesktop);

  const visibleIndices = useMemo(
    () => getEditorialSpreadPages(pageIndex, totalPages, effectiveMode),
    [pageIndex, totalPages, effectiveMode],
  );

  const canGoPrev = visibleIndices.length > 0 && visibleIndices[0] > 0;
  const canGoNext =
    visibleIndices.length > 0 &&
    visibleIndices[visibleIndices.length - 1] < totalPages - 1;

  const startMobileFlip = useCallback(
    (direction: "next" | "prev", initialProgress = 0) => {
      const targetIndex =
        direction === "next"
          ? Math.min(totalPages - 1, pageIndex + 1)
          : Math.max(0, pageIndex - 1);
      if (targetIndex === pageIndex) return;

      clearFlipTimers();
      setActiveDrag(null);

      const leafIndex = direction === "next" ? pageIndex : targetIndex;
      const underIndex = direction === "next" ? targetIndex : pageIndex;
      const startAngle =
        direction === "next"
          ? -initialProgress * 115
          : -(1 - initialProgress) * 115;
      const endAngle = direction === "next" ? -122 : 0;

      setFlipAnim({
        direction,
        leafIndex,
        underIndex,
        targetIndex,
        phase: "start",
        startAngle,
        endAngle,
      });

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = window.requestAnimationFrame(() => {
          setFlipAnim((prev) => (prev ? { ...prev, phase: "settling" } : null));
        });
      });

      flipTimerRef.current = window.setTimeout(() => {
        setPageIndex(targetIndex);
        setFlipAnim(null);
        flipTimerRef.current = null;
      }, 390);
    },
    [pageIndex, totalPages, clearFlipTimers],
  );

  const goPrev = () => {
    if (!canGoPrev) return;
    if (canUseMobileFlip) {
      startMobileFlip("prev", 0);
      return;
    }
    setPageIndex((prev) => stepEditorialPage(prev, -1, totalPages, effectiveMode));
  };

  const goNext = () => {
    if (!canGoNext) return;
    if (canUseMobileFlip) {
      startMobileFlip("next", 0);
      return;
    }
    setPageIndex((prev) => stepEditorialPage(prev, 1, totalPages, effectiveMode));
  };

  // Preload adjacent pages so turning pages feels instantaneous
  useEffect(() => {
    const toPreload = [pageIndex - 1, pageIndex + 1, pageIndex + 2];
    for (const idx of toPreload) {
      if (idx >= 0 && idx < totalPages) {
        const img = new Image();
        img.src = doc.pages[idx].src;
      }
    }
  }, [pageIndex, totalPages, doc.pages]);

  // Keep active thumbnail centered inside the filmstrip without scrolling the page window
  useEffect(() => {
    const strip = thumbStripRef.current;
    const activeThumb = thumbRefs.current[visibleIndices[0] ?? 0];
    if (!strip || !activeThumb) return;
    const targetLeft =
      activeThumb.offsetLeft -
      strip.clientWidth / 2 +
      activeThumb.clientWidth / 2;
    strip.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: "smooth",
    });
  }, [visibleIndices]);

  // Notify parent & lock body scroll while fullscreen reader is open
  useEffect(() => {
    onFullscreenChange?.(isFullscreen);
    if (!isFullscreen) return;
    const prevOverflow = window.document.body.style.overflow;
    window.document.body.style.overflow = "hidden";
    return () => {
      window.document.body.style.overflow = prevOverflow;
    };
  }, [isFullscreen, onFullscreenChange]);

  useEffect(() => {
    return () => onFullscreenChange?.(false);
  }, [onFullscreenChange]);

  // Keyboard arrow navigation turns pages directly
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

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setPageIndex((prev) => stepEditorialPage(prev, -1, totalPages, effectiveMode));
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setPageIndex((prev) => stepEditorialPage(prev, 1, totalPages, effectiveMode));
      } else if (event.key === "Escape" && isFullscreen) {
        event.preventDefault();
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disableKeyboardNav, totalPages, effectiveMode, isFullscreen]);

  const pageRangeLabel =
    visibleIndices.length === 2
      ? `${formatCount(visibleIndices[0] + 1)}-${formatCount(visibleIndices[1] + 1)} / ${formatCount(totalPages)}`
      : `${formatCount((visibleIndices[0] ?? 0) + 1)} / ${formatCount(totalPages)}`;

  const activeCaptionTitle =
    visibleIndices.length === 2
      ? `${doc.pages[visibleIndices[0]].title} · ${doc.pages[visibleIndices[1]].title}`
      : doc.pages[visibleIndices[0] ?? 0]?.title ?? title;

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    if (!touch) return;
    if (flipAnim) {
      clearFlipTimers();
      setPageIndex(flipAnim.targetIndex);
      setFlipAnim(null);
    }
    if (cancelTimerRef.current !== null) {
      window.clearTimeout(cancelTimerRef.current);
      cancelTimerRef.current = null;
    }
    swipeStartXRef.current = touch.clientX;
    swipeStartYRef.current = touch.clientY;
    swipeAxisRef.current = null;
    lastDeltaXRef.current = 0;
    suppressClickRef.current = false;
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    if (!touch || swipeStartXRef.current === null || swipeStartYRef.current === null) {
      return;
    }
    const dx = touch.clientX - swipeStartXRef.current;
    const dy = touch.clientY - swipeStartYRef.current;
    lastDeltaXRef.current = dx;

    if (swipeAxisRef.current === null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      swipeAxisRef.current = Math.abs(dx) > Math.abs(dy) * 1.1 ? "x" : "y";
    }

    if (swipeAxisRef.current !== "x" || !canUseMobileFlip) {
      return;
    }

    const stageWidth = stageRef.current?.clientWidth || 320;
    const { direction, progress } = getSwipeFlipProgress(
      dx,
      stageWidth,
      canGoNext,
      canGoPrev,
    );

    if (!direction || progress <= 0) {
      setActiveDrag(null);
      return;
    }

    suppressClickRef.current = true;
    const leafIndex = direction === "next" ? pageIndex : pageIndex - 1;
    const underIndex = direction === "next" ? pageIndex + 1 : pageIndex;

    setActiveDrag({
      direction,
      progress,
      leafIndex,
      underIndex,
      cancelling: false,
    });
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (swipeStartXRef.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? swipeStartXRef.current;
    const delta = endX - swipeStartXRef.current;
    const axis = swipeAxisRef.current;

    swipeStartXRef.current = null;
    swipeStartYRef.current = null;
    swipeAxisRef.current = null;

    if (canUseMobileFlip && activeDrag && !activeDrag.cancelling) {
      if (activeDrag.progress >= 0.2 || Math.abs(delta) >= 42) {
        startMobileFlip(activeDrag.direction, activeDrag.progress);
      } else {
        setActiveDrag({ ...activeDrag, progress: 0, cancelling: true });
        cancelTimerRef.current = window.setTimeout(() => {
          setActiveDrag(null);
          cancelTimerRef.current = null;
        }, 230);
      }
      return;
    }

    if (axis === "y" || Math.abs(delta) < 42) return;
    suppressClickRef.current = true;

    if (delta < 0 && canGoNext) {
      goNext();
    } else if (delta > 0 && canGoPrev) {
      goPrev();
    }
  };

  const handleTouchCancel = () => {
    swipeStartXRef.current = null;
    swipeStartYRef.current = null;
    swipeAxisRef.current = null;
    if (activeDrag) {
      setActiveDrag(null);
    }
  };

  const isFlippingActive = Boolean(activeDrag || flipAnim);

  const flipVisual = useMemo(() => {
    if (flipAnim) {
      const angle =
        flipAnim.phase === "start" ? flipAnim.startAngle : flipAnim.endAngle;
      const revealRatio =
        flipAnim.direction === "next"
          ? flipAnim.phase === "settling"
            ? 1
            : Math.min(1, Math.abs(flipAnim.startAngle) / 115)
          : flipAnim.phase === "settling"
            ? 0
            : Math.min(1, Math.abs(flipAnim.startAngle) / 115);
      const leafOpacity =
        flipAnim.direction === "next"
          ? flipAnim.phase === "settling"
            ? 0.08
            : 1
          : flipAnim.phase === "settling"
            ? 1
            : Math.max(0.28, 1 - Math.abs(flipAnim.startAngle) / 135);
      return {
        leafIndex: flipAnim.leafIndex,
        underIndex: flipAnim.underIndex,
        angle,
        revealRatio,
        leafOpacity,
        mode: "settling" as const,
      };
    }

    if (activeDrag) {
      const angle =
        activeDrag.direction === "next"
          ? -activeDrag.progress * 115
          : -(1 - activeDrag.progress) * 115;
      const revealRatio =
        activeDrag.direction === "next"
          ? activeDrag.progress
          : 1 - activeDrag.progress;
      const leafOpacity =
        activeDrag.direction === "next"
          ? 1
          : Math.min(1, 0.25 + activeDrag.progress * 1.15);
      return {
        leafIndex: activeDrag.leafIndex,
        underIndex: activeDrag.underIndex,
        angle,
        revealRatio,
        leafOpacity,
        mode: activeDrag.cancelling ? ("cancel" as const) : ("drag" as const),
      };
    }

    return null;
  }, [activeDrag, flipAnim]);

  const handleStageOpenFullscreen = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    setIsFullscreen(true);
  };

  return (
    <div
      id="section-reader"
      data-testid="editorial-pdf-reader"
      className="mt-7 md:mt-10 flex flex-col gap-5 md:gap-6"
    >
      {/* Borderless Page Reading Stage on Warm Paper Canvas */}
      <div
        className="relative flex items-center justify-center gap-3 md:gap-6 overflow-x-clip py-1"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        {/* Left Arrow Button (Desktop/Tablet) */}
        <button
          type="button"
          data-testid="editorial-prev-btn"
          onClick={goPrev}
          disabled={!canGoPrev}
          aria-label="Previous page"
          className={`hidden sm:grid w-11 h-11 md:w-13 md:h-13 rounded-full border-2 border-[#171716] place-items-center shrink-0 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44] ${
            canGoPrev
              ? "bg-[#fffdf6] text-[#171716] shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 hover:bg-[#ff5b44] hover:shadow-[4px_4px_0_#171716] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              : "bg-[#f2efe6] text-[#171716]/28 border-[#171716]/25 cursor-not-allowed"
          }`}
        >
          <ChevronIcon direction="left" className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Page Sheet(s) — Zero Border Frame, Realistic Print Sheet Depth & Mobile 3D Flip After Cover */}
        <div
          ref={stageRef}
          data-testid="editorial-page-stage"
          data-flip-eligible={canUseMobileFlip ? "true" : "false"}
          data-flip-active={isFlippingActive ? "true" : "false"}
          className={`relative flex items-center justify-center ${
            canUseMobileFlip ? "editorial-flip-stage" : ""
          } ${
            visibleIndices.length === 2
              ? "gap-1 md:gap-1.5 max-w-[880px]"
              : "max-w-[540px]"
          } w-full`}
        >
          {flipVisual && canUseMobileFlip ? (
            <div className="relative w-fit max-w-full mx-auto">
              {/* Underneath revealed page */}
              <div
                data-testid="editorial-flip-under"
                className="relative z-0 rounded-lg overflow-hidden bg-white shadow-[0_14px_34px_rgba(23,23,22,0.14)] transition-[filter] duration-200"
                style={{
                  filter: `brightness(${(0.84 + 0.16 * flipVisual.revealRatio).toFixed(3)})`,
                }}
              >
                <img
                  src={doc.pages[flipVisual.underIndex]?.src}
                  alt={`${title} - Page ${flipVisual.underIndex + 1}: ${doc.pages[flipVisual.underIndex]?.title ?? ""}`}
                  referrerPolicy="no-referrer"
                  className="block w-auto max-w-full max-h-[620px] object-contain select-none"
                  draggable={false}
                />
                {/* Soft spine crease shadow cast onto the underneath sheet */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#171716]/25 via-[#171716]/8 to-transparent transition-opacity duration-200"
                  style={{ opacity: Math.max(0, 1 - flipVisual.revealRatio * 0.85) }}
                />
              </div>

              {/* Turning top leaf hinged along the left spine */}
              <div
                data-testid="editorial-flip-leaf"
                className={`editorial-flip-leaf absolute inset-0 z-10 rounded-lg overflow-hidden bg-white ${
                  flipVisual.mode === "settling"
                    ? "editorial-flip-leaf--settling"
                    : flipVisual.mode === "cancel"
                      ? "editorial-flip-leaf--cancel"
                      : ""
                }`}
                style={{
                  transform: `rotateY(${flipVisual.angle.toFixed(1)}deg)`,
                  opacity: flipVisual.leafOpacity,
                  boxShadow:
                    Math.abs(flipVisual.angle) > 4
                      ? `${Math.round(Math.min(28, Math.abs(flipVisual.angle) * 0.35))}px 14px 34px rgba(23,23,22,0.28)`
                      : "0 16px 38px rgba(23,23,22,0.14)",
                }}
              >
                <img
                  src={doc.pages[flipVisual.leafIndex]?.src}
                  alt={`${title} - Page ${flipVisual.leafIndex + 1}: ${doc.pages[flipVisual.leafIndex]?.title ?? ""}`}
                  referrerPolicy="no-referrer"
                  className="block w-full h-full object-contain select-none"
                  draggable={false}
                />
                {/* Dynamic paper sheen & fold shading across the turning leaf */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(23,23,22,0.14) 0%, rgba(255,255,255,0.22) 38%, rgba(23,23,22,0.24) 100%)",
                    opacity: Math.min(
                      0.9,
                      Math.sin(
                        (Math.min(115, Math.abs(flipVisual.angle)) / 115) *
                          Math.PI,
                      ),
                    ),
                  }}
                />
              </div>
            </div>
          ) : (
            visibleIndices.map((idx, pos) => {
              const page = doc.pages[idx];
              if (!page) return null;
              return (
                <div
                  key={page.src}
                  className={`relative flex-1 min-w-0 flex justify-center ${
                    visibleIndices.length === 2
                      ? pos === 0
                        ? "justify-end"
                        : "justify-start"
                      : "justify-center"
                  }`}
                >
                  <button
                    type="button"
                    onClick={handleStageOpenFullscreen}
                    aria-label={`Open full screen on page ${idx + 1}: ${page.title}`}
                    className="group relative block cursor-zoom-in rounded-lg overflow-hidden bg-white shadow-[0_16px_38px_rgba(23,23,22,0.14)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
                  >
                    <img
                      src={page.src}
                      alt={`${title} - Page ${idx + 1}: ${page.title}`}
                      referrerPolicy="no-referrer"
                      draggable={false}
                      className={`block w-auto max-w-full object-contain select-none transition-transform duration-200 group-hover:scale-[1.006] ${
                        visibleIndices.length === 2
                          ? "max-h-[560px] md:max-h-[600px]"
                          : "max-h-[620px] md:max-h-[680px]"
                      }`}
                    />
                    {/* Subtle turned-corner hint on mobile interior pages after the cover */}
                    {canUseMobileFlip && canGoNext && (
                      <span
                        aria-hidden="true"
                        data-testid="editorial-page-corner-hint"
                        className="pointer-events-none absolute right-0 bottom-0 w-7 h-7 editorial-page-corner-hint rounded-tl-md"
                      />
                    )}
                    {pos === visibleIndices.length - 1 && (
                      <span
                        className={`pointer-events-none absolute bottom-2.5 inline-flex items-center gap-1.5 rounded-lg border-2 border-[#171716] bg-[#fffdf6]/95 px-2.5 py-1.5 text-xs font-medium text-[#171716] shadow-[2px_2px_0_#171716] opacity-85 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 transition-opacity ${
                          canUseMobileFlip && canGoNext ? "left-2.5" : "right-2.5"
                        }`}
                      >
                        <ExpandIcon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Full screen</span>
                      </span>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Right Arrow Button (Desktop/Tablet) */}
        <button
          type="button"
          data-testid="editorial-next-btn"
          onClick={goNext}
          disabled={!canGoNext}
          aria-label="Next page"
          className={`hidden sm:grid w-11 h-11 md:w-13 md:h-13 rounded-full border-2 border-[#171716] place-items-center shrink-0 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44] ${
            canGoNext
              ? "bg-[#fffdf6] text-[#171716] shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 hover:bg-[#ff5b44] hover:shadow-[4px_4px_0_#171716] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              : "bg-[#f2efe6] text-[#171716]/28 border-[#171716]/25 cursor-not-allowed"
          }`}
        >
          <ChevronIcon direction="right" className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Compact Interactive Reader Control Bar */}
      <div className="max-w-[880px] mx-auto w-full rounded-2xl border-2 border-[#171716] bg-[#fffdf6] px-4 py-3 sm:px-5 sm:py-3.5 shadow-[4px_4px_0_#171716] flex flex-col md:flex-row md:flex-nowrap md:items-center justify-between gap-3">
        {/* Left: Page Counter + Active Page Label */}
        <div className="flex items-center gap-3 min-w-0 md:flex-1">
          <span
            data-testid="editorial-page-indicator"
            className="inline-flex items-center px-2.5 py-1 rounded-lg border-2 border-[#171716] bg-[#f5d837] text-xs sm:text-sm font-semibold tabular-nums text-[#171716] shrink-0"
          >
            {pageRangeLabel}
          </span>
          <p
            data-testid="editorial-page-title"
            className="text-sm sm:text-[15px] font-medium text-[#171716] truncate m-0"
          >
            {activeCaptionTitle}
          </p>
        </div>

        {/* Right: Prev/Next (Mobile + Quick Access), Single/Spread Toggle, Fullscreen, Open PDF */}
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between md:justify-end gap-2 shrink-0">
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canGoPrev}
              aria-label="Previous page"
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border-2 border-[#171716] text-xs font-medium ${
                canGoPrev
                  ? "bg-[#f2efe6] text-[#171716] active:bg-[#ff5b44]"
                  : "bg-[#f2efe6]/50 text-[#171716]/30 border-[#171716]/25 cursor-not-allowed"
              }`}
            >
              <ChevronIcon direction="left" className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              aria-label="Next page"
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border-2 border-[#171716] text-xs font-medium ${
                canGoNext
                  ? "bg-[#f2efe6] text-[#171716] active:bg-[#ff5b44]"
                  : "bg-[#f2efe6]/50 text-[#171716]/30 border-[#171716]/25 cursor-not-allowed"
              }`}
            >
              <span>Next</span>
              <ChevronIcon direction="right" className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Single / Spread Toggle on Tablet & Desktop */}
          <div
            className="hidden md:inline-flex items-center rounded-xl border-2 border-[#171716] bg-[#f2efe6] p-0.5"
            role="group"
            aria-label="Page layout mode"
          >
            <button
              type="button"
              data-testid="editorial-mode-single"
              onClick={() => setViewMode("single")}
              aria-pressed={viewMode === "single"}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === "single"
                  ? "bg-[#171716] text-[#f2efe6]"
                  : "text-[#171716]/75 hover:text-[#171716]"
              }`}
            >
              Single
            </button>
            <button
              type="button"
              data-testid="editorial-mode-spread"
              onClick={() => setViewMode("spread")}
              aria-pressed={viewMode === "spread"}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === "spread"
                  ? "bg-[#171716] text-[#f2efe6]"
                  : "text-[#171716]/75 hover:text-[#171716]"
              }`}
            >
              Spread
            </button>
          </div>

          <button
            type="button"
            data-testid="editorial-fullscreen-btn"
            onClick={() => setIsFullscreen(true)}
            aria-label="Read in full screen"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[#171716] bg-[#f2efe6] text-xs sm:text-sm font-medium text-[#171716] hover:bg-[#171716] hover:text-[#f2efe6] transition-colors"
          >
            <ExpandIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Full screen</span>
          </button>

          <a
            href={doc.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="editorial-open-pdf-link"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[#171716] bg-[#c7ef45] text-xs sm:text-sm font-semibold text-[#171716] hover:bg-[#ff5b44] transition-colors"
          >
            <span>{doc.pdfLabel}</span>
            <ExternalPdfIcon className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Horizontal Thumbnail Strip for Fast Page Jumping */}
      <div
        ref={thumbStripRef}
        aria-label="Jump to publication page"
        className="relative max-w-[880px] mx-auto w-full flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 px-0.5 no-scrollbar"
      >
        {doc.pages.map((page, idx) => {
          const isCurrent = visibleIndices.includes(idx);
          return (
            <button
              key={page.src}
              ref={(el) => {
                thumbRefs.current[idx] = el;
              }}
              type="button"
              data-testid={`editorial-thumb-${idx + 1}`}
              onClick={() => setPageIndex(idx)}
              aria-label={`Go to page ${idx + 1}: ${page.title}`}
              aria-current={isCurrent ? "page" : undefined}
              className={`group shrink-0 flex flex-col items-center gap-1 p-1 rounded-xl border-2 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5b44] ${
                isCurrent
                  ? "border-[#ff5b44] bg-[#fffdf6] shadow-[2px_2px_0_#171716] -translate-y-0.5"
                  : "border-[#171716]/16 bg-[#fffdf6]/70 hover:border-[#171716] hover:bg-[#fffdf6]"
              }`}
            >
              <div className="w-11 h-[62px] sm:w-12 sm:h-[68px] rounded-md overflow-hidden bg-white">
                <img
                  src={page.src}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover block"
                />
              </div>
              <span
                className={`text-[11px] font-semibold tabular-nums leading-none ${
                  isCurrent ? "text-[#d9442e]" : "text-[#171716]/65"
                }`}
              >
                {formatCount(idx + 1)}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs sm:text-[13px] text-[#171716]/58 m-0">
        {canUseMobileFlip
          ? `Swipe left or right to flip through all ${totalPages} pages.`
          : `Use the arrows or your keyboard Left / Right keys to flip through all ${totalPages} pages.`}
      </p>

      {/* Fullscreen Reader Overlay */}
      {isFullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} full screen reader`}
          data-testid="editorial-fullscreen-dialog"
          onClick={() => setIsFullscreen(false)}
          className="fixed inset-0 z-50 bg-[#171716]/94 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-6 md:p-8"
        >
          <div className="flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <span className="px-2.5 py-1 rounded-lg bg-[#f5d837] text-[#171716] text-xs sm:text-sm font-semibold tabular-nums shrink-0">
                {pageRangeLabel}
              </span>
              <p className="text-sm sm:text-base font-medium text-[#f2efe6] truncate m-0">
                {activeCaptionTitle}
              </p>
            </div>

            <button
              type="button"
              data-testid="editorial-fullscreen-close"
              onClick={() => setIsFullscreen(false)}
              aria-label="Close full screen reader"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-[#f2efe6]/35 bg-[#171716] text-sm font-medium text-[#f2efe6] hover:bg-[#ff5b44] hover:border-[#ff5b44] hover:text-[#171716] transition-colors shrink-0"
            >
              <CloseIcon className="w-4 h-4" />
              <span>Close</span>
            </button>
          </div>

          <div
            className="relative flex-1 min-h-0 flex items-center justify-center my-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
          >
            <button
              type="button"
              data-testid="editorial-fullscreen-prev"
              onClick={(event) => {
                event.stopPropagation();
                goPrev();
              }}
              disabled={!canGoPrev}
              aria-label="Previous page"
              className={`absolute left-0 sm:left-2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 grid place-items-center transition-colors ${
                canGoPrev
                  ? "border-[#f2efe6]/40 bg-[#171716]/85 text-[#f2efe6] hover:bg-[#f2efe6] hover:text-[#171716]"
                  : "border-[#f2efe6]/15 bg-[#171716]/40 text-[#f2efe6]/25 cursor-not-allowed"
              }`}
            >
              <ChevronIcon direction="left" className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <div
              onClick={(event) => event.stopPropagation()}
              className={`flex items-center justify-center ${
                visibleIndices.length === 2 ? "gap-1.5" : ""
              } max-w-[88vw] max-h-full`}
            >
              {visibleIndices.map((idx) => {
                const page = doc.pages[idx];
                if (!page) return null;
                return (
                  <img
                    key={page.src}
                    src={page.src}
                    alt={`${title} - Page ${idx + 1}: ${page.title}`}
                    referrerPolicy="no-referrer"
                    className={`rounded-md bg-white shadow-2xl object-contain ${
                      visibleIndices.length === 2
                        ? "max-w-[42vw] max-h-[78vh]"
                        : "max-w-[84vw] max-h-[80vh]"
                    }`}
                  />
                );
              })}
            </div>

            <button
              type="button"
              data-testid="editorial-fullscreen-next"
              onClick={(event) => {
                event.stopPropagation();
                goNext();
              }}
              disabled={!canGoNext}
              aria-label="Next page"
              className={`absolute right-0 sm:right-2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 grid place-items-center transition-colors ${
                canGoNext
                  ? "border-[#f2efe6]/40 bg-[#171716]/85 text-[#f2efe6] hover:bg-[#f2efe6] hover:text-[#171716]"
                  : "border-[#f2efe6]/15 bg-[#171716]/40 text-[#f2efe6]/25 cursor-not-allowed"
              }`}
            >
              <ChevronIcon direction="right" className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          <p className="text-center text-xs sm:text-sm text-[#f2efe6]/70 m-0">
            {doc.formatLabel} · Arrow keys to turn pages · Esc to close
          </p>
        </div>
      )}
    </div>
  );
}
