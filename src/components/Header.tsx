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
          className="brand whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
          onClick={() => handleSelect("home")}
          aria-label="Kai portfolio home"
        >
          KAI<span>!</span>
        </button>

        <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
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
                className={`text-sm font-medium py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44] ${
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
            className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44] ${
              isDark
                ? "border-[#f2efe6] bg-[#f2efe6] text-[#171716] hover:bg-[#4169ed] hover:text-[#f2efe6] hover:border-[#4169ed]"
                : "border-[#171716] bg-[#171716] text-[#f2efe6] hover:bg-[#ff5b44] hover:border-[#171716] hover:text-[#171716] shadow-[3px_3px_0_#171716] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#171716]"
            }`}
          >
            Get in Touch
          </button>

          <button
            type="button"
            className={`md:hidden px-3 py-2 rounded-xl border-2 text-sm font-medium whitespace-nowrap shrink-0 ${
              isDark ? "border-[#f2efe6] text-[#f2efe6]" : "border-[#171716] text-[#171716]"
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
          className={`md:hidden border-t-2 px-5 py-4 flex flex-col gap-3 ${
            isDark
              ? "bg-[#111111] border-[#f2efe6]/25 text-[#f2efe6]"
              : "bg-[#f2efe6] border-[#171716]/20 text-[#171716]"
          }`}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`text-left py-2 text-sm font-medium ${
                  isActive ? "text-[#d9442e]" : "opacity-80"
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
