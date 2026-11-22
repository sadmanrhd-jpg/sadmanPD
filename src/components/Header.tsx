import { useState } from "react";
import type { View } from "../data/portfolio";

interface HeaderProps {
  activeView: View;
  onNavigate: (view: View) => void;
  onOpenContact: () => void;
}

const NAV_ITEMS: { id: View; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "design", label: "Product Design" },
  { id: "photo", label: "Photography" },
  { id: "about", label: "About" },
];

export function Header({ activeView, onNavigate, onOpenContact }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDark = activeView === "photo";

  const handleSelect = (view: View) => {
    setMobileMenuOpen(false);
    onNavigate(view);
  };

  return (
    <header
      className={`sticky top-0 z-30 border-b-2 transition-colors duration-200 ${
        isDark
          ? "bg-[#111111]/95 border-[#f2efe6] text-[#f2efe6]"
          : "bg-[#f2efe6]/95 border-[#171716] text-[#171716]"
      } backdrop-blur-sm`}
    >
      <div className="max-w-[1360px] mx-auto h-20 px-5 md:px-10 flex items-center justify-between gap-8">
        <button
          type="button"
          data-testid="brand-logo"
          className="group inline-flex items-center gap-2.5 border-0 bg-transparent p-0 whitespace-nowrap shrink-0 transition-transform duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
          onClick={() => handleSelect("home")}
          aria-label="Sadman portfolio home"
        >
          <svg
            viewBox="0 0 40 36"
            aria-hidden="true"
            className="w-10 h-9 md:w-[42px] md:h-[38px] shrink-0 transition-transform duration-200 group-hover:scale-[1.04]"
          >
            <path d="M2 2H21V7.5H7.5V21H2Z" fill="#ff5b44" />
            <circle
              cx="20"
              cy="18"
              r="4.4"
              className={isDark ? "fill-[#f2efe6]" : "fill-[#171716]"}
            />
            <path d="M38 34H19V28.5H32.5V15H38Z" fill="#4169ed" />
          </svg>
          <span
            data-testid="brand-wordmark"
            className={`hidden md:inline font-display text-[28px] font-bold leading-none tracking-[-0.03em] ${
              isDark ? "text-[#f2efe6]" : "text-[#171716]"
            }`}
          >
            Sadman
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-5 lg:gap-9" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            const activeAccent =
              item.id === "photo" ? "border-[#4169ed] text-[#4169ed]" : "border-[#ff5b44] text-[#d9442e]";
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={`text-base lg:text-[17px] font-medium py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44] ${
                  isActive
                    ? activeAccent
                    : isDark
                      ? "border-transparent text-[#f2efe6]/75 hover:text-[#f2efe6]"
                      : "border-transparent text-[#171716]/75 hover:text-[#171716]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenContact}
            className={`px-4 py-2 rounded-xl border-2 text-sm md:text-[15px] lg:text-base font-medium transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44] ${
              isDark
                ? "border-[#f2efe6] bg-[#f2efe6] text-[#171716] shadow-[3px_3px_0_#4169ed] hover:-translate-y-0.5 hover:bg-[#4169ed] hover:text-[#f2efe6] hover:border-[#f2efe6] hover:shadow-[4px_5px_0_#f2efe6] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none active:bg-[#4169ed] active:text-[#f2efe6]"
                : "border-[#171716] bg-[#171716] text-[#f2efe6] shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 hover:bg-[#ff5b44] hover:border-[#171716] hover:text-[#171716] hover:shadow-[4px_5px_0_#171716] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none active:bg-[#ff5b44] active:text-[#171716]"
            }`}
          >
            Get in Touch
          </button>

          <button
            type="button"
            className={`md:hidden px-3.5 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44] ${
              isDark
                ? "border-[#f2efe6] bg-transparent text-[#f2efe6] shadow-[3px_3px_0_#f2efe6] hover:-translate-y-0.5 hover:bg-[#f2efe6] hover:text-[#111111] hover:shadow-[4px_5px_0_#f2efe6] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none active:bg-[#f2efe6] active:text-[#111111]"
                : "border-[#171716] bg-[#fffdf6] text-[#171716] shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 hover:bg-[#171716] hover:text-[#f2efe6] hover:shadow-[4px_5px_0_#171716] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none active:bg-[#171716] active:text-[#f2efe6]"
            }`}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className={`md:hidden border-t-2 px-5 py-4 flex flex-col gap-2 ${
            isDark
              ? "bg-[#111111] border-[#f2efe6]/25 text-[#f2efe6]"
              : "bg-[#f2efe6] border-[#171716]/20 text-[#171716]"
          }`}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            const activeClass =
              item.id === "photo"
                ? "text-[#4169ed] font-semibold"
                : "text-[#d9442e] font-semibold";
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? activeClass
                    : isDark
                      ? "text-[#f2efe6]/80 hover:text-[#f2efe6] hover:bg-[#f2efe6]/10 active:bg-[#f2efe6]/15 active:translate-x-0.5"
                      : "text-[#171716]/80 hover:text-[#171716] hover:bg-[#171716]/5 active:bg-[#171716]/10 active:translate-x-0.5"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}
