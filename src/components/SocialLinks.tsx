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
