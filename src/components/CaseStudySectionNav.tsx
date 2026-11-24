import { useEffect, useRef } from "react";
import type { CaseStudySectionNavItem } from "../utils/portfolioLogic";

interface CaseStudySectionTabsProps {
  sections: CaseStudySectionNavItem[];
  activeSectionId: string;
  onJump: (sectionId: string) => void;
  containerClassName: string;
}

export function CaseStudySectionTabs({
  sections,
  activeSectionId,
  onJump,
  containerClassName,
}: CaseStudySectionTabsProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const scroller = scrollerRef.current;
    const activeTab = tabRefs.current[activeSectionId];
    if (!scroller || !activeTab) return;

    const targetLeft =
      activeTab.offsetLeft - scroller.clientWidth / 2 + activeTab.clientWidth / 2;
    scroller.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: "smooth",
    });
  }, [activeSectionId]);

  if (sections.length === 0) return null;

  return (
    <nav
      aria-label="Case study sections"
      data-testid="case-study-section-tabs"
      className="sticky top-[81px] z-20 bg-[#f2efe6]/96 backdrop-blur-sm border-b border-[#171716]/14"
    >
      <div className={containerClassName}>
        <div
          ref={scrollerRef}
          className="flex items-center gap-5 sm:gap-6 md:gap-8 overflow-x-auto no-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0"
        >
          {sections.map((section) => {
            const isActive = section.id === activeSectionId;
            return (
              <button
                key={section.id}
                ref={(node) => {
                  tabRefs.current[section.id] = node;
                }}
                type="button"
                onClick={() => onJump(section.id)}
                aria-current={isActive ? "location" : undefined}
                className={`relative py-3.5 md:py-4 text-[15px] md:text-[15.5px] leading-none whitespace-nowrap shrink-0 border-b-2 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5b44] ${
                  isActive
                    ? "border-[#d9442e] text-[#171716] font-semibold"
                    : "border-transparent text-[#171716]/58 font-medium hover:text-[#171716]"
                }`}
              >
                {section.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

