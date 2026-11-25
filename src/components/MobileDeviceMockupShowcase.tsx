import { useRef, useState } from "react";
import type { CaseStudyVisual, MobileShowcaseBlock } from "../data/portfolio";

interface MobileDeviceMockupShowcaseProps {
  showcase: MobileShowcaseBlock;
  onOpenFullscreen: (index: number) => void;
  sectionContainerClass: string;
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

type PhoneDensity = "two-up" | "multi" | "four-up";

interface PhoneMockupCardProps {
  screen: CaseStudyVisual;
  index: number;
  onOpenFullscreen: (index: number) => void;
  density: PhoneDensity;
}

function PhoneMockupCard({
  screen,
  index,
  onOpenFullscreen,
  density,
}: PhoneMockupCardProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [atBottom, setAtBottom] = useState(false);

  const handleScreenScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
    setAtBottom(remaining <= 16);
  };

  const handleScrollCueClick = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (atBottom) {
      el.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ top: 220, behavior: "smooth" });
    }
  };

  const isCompact = density !== "two-up";

  const figureWidthClass =
    density === "four-up"
      ? "w-full max-w-[236px] lg:max-w-[208px]"
      : density === "multi"
        ? "w-full max-w-[236px] sm:w-[232px] lg:w-[224px]"
        : "w-full max-w-[288px]";

  const frameWidthClass =
    density === "four-up"
      ? "w-[224px] sm:w-[228px] lg:w-[190px] xl:w-[200px]"
      : density === "multi"
        ? "w-[224px] sm:w-[224px] lg:w-[214px] xl:w-[220px]"
        : "w-[240px] sm:w-[254px] md:w-[256px] lg:w-[262px]";

  return (
    <figure
      data-testid={`device-mockup-card-${index}`}
      className={`m-0 flex flex-col items-center gap-4 sm:gap-5 ${figureWidthClass}`}
    >
      {/* Realistic Smartphone Hardware Mockup */}
      <div
        data-testid={`device-mockup-frame-${index}`}
        className={`relative transition-transform duration-200 ease-out hover:-translate-y-1 ${frameWidthClass}`}
      >
        {/* Side hardware buttons */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-[3px] top-[76px] w-[3px] h-5 rounded-l bg-[#2d2d2b]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-[3px] top-[108px] w-[3px] h-9 rounded-l bg-[#2d2d2b]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-[3px] top-[152px] w-[3px] h-9 rounded-l bg-[#2d2d2b]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-[3px] top-[116px] w-[3px] h-11 rounded-r bg-[#2d2d2b]"
        />

        {/* Phone chassis */}
        <div
          className={`${
            isCompact
              ? "rounded-[24px] p-[7px] shadow-[0_12px_24px_rgba(23,23,22,0.13),4px_4px_0_#171716]"
              : "rounded-[30px] p-[9px] shadow-[0_16px_32px_rgba(23,23,22,0.15),5px_5px_0_#171716]"
          } bg-[#171716] ring-1 ring-white/10`}
        >
          {/* Top speaker slit & front camera dot above screen */}
          <div
            aria-hidden="true"
            className={`flex items-center justify-center gap-2 ${
              isCompact ? "pt-0.5 pb-1.5" : "pt-1 pb-2"
            }`}
          >
            <span
              className={`${
                isCompact ? "w-9 h-[3px]" : "w-11 h-[3.5px]"
              } rounded-full bg-[#2f2f2d]`}
            />
            <span className="w-1.5 h-1.5 rounded-full bg-[#292927] ring-1 ring-white/10" />
          </div>

          {/* Screen aperture — zero horizontal or vertical cropping */}
          <div
            className={`relative w-full overflow-hidden ring-1 ring-white/10 ${
              isCompact
                ? "rounded-[14px] bg-white"
                : "rounded-[16px] bg-[#111827]"
            } ${screen.scrollable ? "aspect-[780/1400]" : ""}`}
          >
            {screen.scrollable ? (
              <>
                <div
                  ref={scrollRef}
                  data-testid={`device-mockup-scroll-${index}`}
                  onScroll={handleScreenScroll}
                  tabIndex={0}
                  aria-label={`${screen.title} scrollable preview`}
                  className="h-full w-full overflow-y-auto overscroll-y-contain scroll-smooth phone-screen-scroll bg-white focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#ff5b44]"
                >
                  <img
                    src={screen.src}
                    alt={screen.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto block select-none"
                  />
                </div>

                {/* Gentle bottom edge fade indicating more screen content below */}
                {!atBottom && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#111827]/35 via-[#111827]/10 to-transparent"
                  />
                )}
              </>
            ) : (
              <button
                type="button"
                data-testid={`device-mockup-open-${index}`}
                onClick={() => onOpenFullscreen(index)}
                aria-label={`View full screen: ${screen.title}`}
                className="group relative block w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#ff5b44]"
              >
                <img
                  src={screen.src}
                  alt={screen.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto block transition-opacity duration-200 group-hover:opacity-95"
                />
              </button>
            )}
          </div>

          {/* Bottom gesture bar */}
          <div
            aria-hidden="true"
            className={`flex justify-center ${
              isCompact ? "pt-1.5 pb-0.5" : "pt-2 pb-0.5"
            }`}
          >
            <span
              className={`${
                isCompact ? "w-16" : "w-20"
              } h-1 rounded-full bg-white/25`}
            />
          </div>
        </div>
      </div>

      {/* Caption & interactive actions */}
      <figcaption className="w-full px-0.5 flex flex-col gap-1.5 text-left">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`font-display font-medium tracking-[-0.01em] leading-[1.38] text-[#171716]/88 m-0 ${
              isCompact ? "text-[15px]" : "text-[16px] md:text-[16.5px]"
            }`}
          >
            {screen.title}
          </p>
          <button
            type="button"
            onClick={() => onOpenFullscreen(index)}
            aria-label={`Expand ${screen.title}`}
            className="inline-flex items-center gap-1 text-[12.5px] font-normal text-[#171716]/55 hover:text-[#d9442e] transition-colors shrink-0 cursor-zoom-in pt-0.5"
          >
            <ExpandIcon className="w-3.5 h-3.5" />
            <span>{isCompact ? "Zoom" : "Full screen"}</span>
          </button>
        </div>

        {screen.scrollable && (
          <div className="flex items-center gap-2.5 pt-0.5">
            <button
              type="button"
              data-testid={`phone-scroll-cue-${index}`}
              onClick={handleScrollCueClick}
              className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#171716] bg-[#fffdf6] px-3 py-1 text-[13px] font-medium text-[#171716] shadow-[2px_2px_0_#171716] hover:bg-[#171716] hover:text-[#f2efe6] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all whitespace-nowrap"
            >
              <span>{atBottom ? "Back to top ↑" : "Scroll screen ↓"}</span>
            </button>
            <span className="text-[12.5px] text-[#171716]/55">
              or scroll inside phone
            </span>
          </div>
        )}

        <p
          className={`font-normal leading-[1.68] text-[#171716]/64 m-0 ${
            isCompact ? "text-[14px]" : "text-[15px]"
          }`}
        >
          {screen.caption}
        </p>
      </figcaption>
    </figure>
  );
}

export function MobileDeviceMockupShowcase({
  showcase,
  onOpenFullscreen,
  sectionContainerClass,
}: MobileDeviceMockupShowcaseProps) {
  const hasGroups = Boolean(showcase.groups && showcase.groups.length > 0);
  const isMultiUngrouped = !hasGroups && showcase.screens.length > 2;

  let runningOffset = 0;

  return (
    <section
      id="section-mobile"
      data-testid="mobile-experience-section"
      className="bg-[#f8f6ef] border-b border-[#171716]/12"
    >
      <div
        className={`${sectionContainerClass} py-20 md:py-28 flex flex-col gap-10 md:gap-14`}
      >
        <div className="w-full max-w-[680px] text-left flex flex-col gap-3.5">
          <h2 className="font-display text-[30px] sm:text-[36px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.16] text-balance m-0">
            {showcase.heading}
          </h2>
          {showcase.note && (
            <p className="text-[17px] sm:text-[18px] md:text-[20px] lg:text-[21px] leading-[1.95] md:leading-[1.85] text-[#171716]/76 m-0">
              {showcase.note}
            </p>
          )}
        </div>

        {hasGroups && showcase.groups ? (
          <div className="flex flex-col gap-16 md:gap-20">
            {showcase.groups.map((group, groupIdx) => {
              const groupStartIndex = runningOffset;
              runningOffset += group.screens.length;
              const isSingleScreen = group.screens.length === 1;
              const isTwoUp = group.screens.length === 2;

              if (isSingleScreen) {
                const singleScreen = group.screens[0];
                return (
                  <div
                    key={group.id}
                    data-testid={`device-mockup-group-${group.id}`}
                    className={
                      groupIdx > 0
                        ? "pt-12 md:pt-16 border-t border-[#171716]/12 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] items-start gap-10 md:gap-14 lg:gap-16"
                        : "grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] items-start gap-10 md:gap-14 lg:gap-16"
                    }
                  >
                    <div className="w-full max-w-[540px] text-left flex flex-col gap-3">
                      <p className="text-[13px] md:text-[14px] font-semibold uppercase tracking-[0.08em] text-[#d9442e] m-0">
                        {group.eyebrow}
                      </p>
                      <h3 className="font-display text-[24px] sm:text-[28px] md:text-[32px] font-medium tracking-[-0.02em] leading-[1.2] text-[#171716] m-0">
                        {group.title}
                      </h3>
                      <p className="text-[16px] md:text-[17.5px] leading-[1.78] text-[#171716]/72 m-0">
                        {group.description}
                      </p>

                      {group.companionNote && (
                        <div
                          data-testid={`device-mockup-companion-${group.id}`}
                          className="mt-4 rounded-2xl border border-[#171716]/16 bg-[#fffdf6] p-5 sm:p-6 shadow-[0_2px_10px_rgba(23,23,22,0.04)] flex flex-col gap-2"
                        >
                          <p className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-[#d9442e] m-0">
                            {group.companionNote.label}
                          </p>
                          <h4 className="font-display text-[19px] md:text-[21px] font-medium tracking-[-0.015em] leading-[1.3] text-[#171716] m-0">
                            {group.companionNote.title}
                          </h4>
                          <p className="text-[15.5px] md:text-[16.5px] leading-[1.72] text-[#171716]/72 m-0">
                            {group.companionNote.detail}
                          </p>
                        </div>
                      )}
                    </div>

                    <div
                      data-testid={`device-mockup-grid-${group.id}`}
                      className="flex justify-center md:justify-end w-full md:w-auto"
                    >
                      <PhoneMockupCard
                        key={singleScreen.src}
                        screen={singleScreen}
                        index={groupStartIndex}
                        onOpenFullscreen={onOpenFullscreen}
                        density="two-up"
                      />
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={group.id}
                  data-testid={`device-mockup-group-${group.id}`}
                  className={
                    groupIdx > 0
                      ? "pt-12 md:pt-16 border-t border-[#171716]/12 flex flex-col gap-8 md:gap-10"
                      : "flex flex-col gap-8 md:gap-10"
                  }
                >
                  <div className="w-full max-w-[680px] text-left flex flex-col gap-2">
                    <p className="text-[13px] md:text-[14px] font-semibold uppercase tracking-[0.08em] text-[#d9442e] m-0">
                      {group.eyebrow}
                    </p>
                    <h3 className="font-display text-[24px] sm:text-[28px] md:text-[32px] font-medium tracking-[-0.02em] leading-[1.2] text-[#171716] m-0">
                      {group.title}
                    </h3>
                    <p className="text-[16px] md:text-[17.5px] leading-[1.78] text-[#171716]/70 m-0">
                      {group.description}
                    </p>
                  </div>

                  <div
                    data-testid={`device-mockup-grid-${group.id}`}
                    className={
                      isTwoUp
                        ? "grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-x-16 lg:gap-x-20 justify-items-center items-start w-full max-w-[740px] mx-auto"
                        : `grid grid-cols-1 sm:grid-cols-2 gap-y-12 gap-x-8 lg:gap-x-7 xl:gap-x-8 justify-items-center items-start w-full ${
                            group.screens.length === 3
                              ? "lg:grid-cols-3"
                              : "lg:grid-cols-4"
                          }`
                    }
                  >
                    {group.screens.map((screen, idx) => (
                      <PhoneMockupCard
                        key={screen.src}
                        screen={screen}
                        index={groupStartIndex + idx}
                        onOpenFullscreen={onOpenFullscreen}
                        density={
                          isTwoUp
                            ? "two-up"
                            : group.screens.length === 3
                              ? "multi"
                              : "four-up"
                        }
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : isMultiUngrouped ? (
          <div
            data-testid="device-mockup-grid"
            className="flex flex-wrap justify-center gap-y-12 gap-x-8 md:gap-x-10 lg:gap-x-12 items-start w-full pt-1"
          >
            {showcase.screens.map((screen, idx) => (
              <PhoneMockupCard
                key={screen.src}
                screen={screen}
                index={idx}
                onOpenFullscreen={onOpenFullscreen}
                density="multi"
              />
            ))}
          </div>
        ) : (
          <div
            data-testid="device-mockup-grid"
            className="grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-x-16 lg:gap-x-20 justify-items-center items-start w-full max-w-[740px] mx-auto pt-1"
          >
            {showcase.screens.map((screen, idx) => (
              <PhoneMockupCard
                key={screen.src}
                screen={screen}
                index={idx}
                onOpenFullscreen={onOpenFullscreen}
                density="two-up"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
