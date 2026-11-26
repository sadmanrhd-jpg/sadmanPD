import { SOCIAL_LINKS, type SocialPlatform } from "../data/portfolio";

interface SocialLinksProps {
  variant?: "footer" | "surface" | "dark";
  compact?: boolean;
  className?: string;
}

function SocialIcon({
  platform,
  className = "w-[18px] h-[18px] shrink-0",
}: {
  platform: SocialPlatform;
  className?: string;
}) {
  switch (platform) {
    case "behance":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          aria-hidden="true"
          className={className}
        >
          <path d="M8.84 10.89c1.27-.44 1.97-1.41 1.97-2.67 0-2.19-1.64-3.22-4.14-3.22H1.5v13.5h5.38c2.73 0 4.62-1.31 4.62-3.94 0-1.91-.95-3.22-2.66-3.67zM4.42 7.36h2.06c1.09 0 1.72.42 1.72 1.33 0 .94-.67 1.38-1.75 1.38H4.42V7.36zm2.36 8.76H4.42v-3.82h2.39c1.29 0 2.02.52 2.02 1.93 0 1.44-.77 1.89-2.05 1.89z" />
          <path d="M14.72 6.4h5.35v1.45h-5.35z" />
          <path d="M17.46 9.13c-3.03 0-5.08 2.09-5.08 4.86 0 2.94 1.97 4.78 5.14 4.78 2.25 0 3.84-.98 4.64-2.88h-2.55c-.36.73-1.08 1.09-2.02 1.09-1.45 0-2.37-.78-2.48-2.25h7.31c.05-.34.08-.77.08-1.14 0-2.61-1.83-4.46-5.04-4.46zm-2.31 3.92c.19-1.28 1.02-2.02 2.27-2.02 1.28 0 2.08.73 2.23 2.02h-4.5z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
          <path d="M6.94 8.5H3.56V19.5H6.94V8.5ZM5.25 3.5C4.14 3.5 3.25 4.39 3.25 5.5C3.25 6.6 4.14 7.5 5.25 7.5C6.35 7.5 7.25 6.6 7.25 5.5C7.25 4.39 6.35 3.5 5.25 3.5ZM20.44 13.02C20.44 9.88 18.76 8.22 16.22 8.22C14.43 8.22 13.56 9.21 13.11 9.91V8.5H9.74C9.78 9.45 9.74 19.5 9.74 19.5H13.11V13.36C13.11 13.02 13.14 12.69 13.24 12.45C13.51 11.78 14.12 11.09 15.16 11.09C16.51 11.09 17.07 12.12 17.07 13.63V19.5H20.44V13.02Z" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
          <path d="M13.5 21V12.82H16.24L16.65 9.63H13.5V7.59C13.5 6.67 13.76 6.04 15.08 6.04H16.77V3.19C16.48 3.15 15.48 3.06 14.31 3.06C11.88 3.06 10.22 4.54 10.22 7.27V9.63H7.47V12.82H10.22V21H13.5Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
          <path d="M21.58 7.19C21.35 6.33 20.67 5.65 19.81 5.42C18.25 5 12 5 12 5C12 5 5.75 5 4.19 5.42C3.33 5.65 2.65 6.33 2.42 7.19C2 8.75 2 12 2 12C2 12 2 15.25 2.42 16.81C2.65 17.67 3.33 18.35 4.19 18.58C5.75 19 12 19 12 19C12 19 18.25 19 19.81 18.58C20.67 18.35 21.35 17.67 21.58 16.81C22 15.25 22 12 22 12C22 12 22 8.75 21.58 7.19ZM10 15V9L15.2 12L10 15Z" />
        </svg>
      );
    case "flickr":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
          <circle cx="7.75" cy="12" r="4.25" />
          <circle cx="16.25" cy="12" r="4.25" fillOpacity="0.68" />
        </svg>
      );
  }
}

export function SocialLinks({
  variant = "surface",
  compact = false,
  className = "",
}: SocialLinksProps) {
  const linkClasses =
    variant === "footer"
      ? "border-2 border-[#171716] bg-[#fffdf6] text-[#171716] shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 hover:bg-[#171716] hover:text-[#f5d837] hover:shadow-[4px_5px_0_#171716] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171716]"
      : variant === "dark"
        ? "border-2 border-[#f2efe6]/45 bg-transparent text-[#f2efe6] hover:border-[#f2efe6] hover:bg-[#f2efe6] hover:text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4169ed]"
        : "border-2 border-[#171716] bg-[#fffdf6] text-[#171716] shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 hover:bg-[#171716] hover:text-[#f2efe6] hover:shadow-[4px_5px_0_#171716] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]";

  return (
    <ul
      className={`flex flex-wrap items-center gap-2.5 sm:gap-3 list-none p-0 m-0 ${className}`}
      aria-label="Social and connectivity links"
    >
      {SOCIAL_LINKS.map((social) => (
        <li key={social.id}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${social.label} (opens in new tab)`}
            className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 whitespace-nowrap shrink-0 ${
              compact
                ? "min-h-[42px] px-3 py-2 text-[13.5px]"
                : "min-h-[44px] px-3.5 py-2.5 text-sm"
            } ${linkClasses}`}
          >
            <SocialIcon platform={social.id} className="w-[17px] h-[17px] shrink-0" />
            <span>{social.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
