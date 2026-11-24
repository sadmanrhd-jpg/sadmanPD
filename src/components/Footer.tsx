import { Arrow } from "./Characters";
import { SocialLinks } from "./SocialLinks";

interface FooterProps {
  onOpenContact: () => void;
}

export function Footer({ onOpenContact }: FooterProps) {
  return (
    <footer className="bg-[#f5d837] text-[#171716] border-t-2 border-[#171716]">
      <div className="max-w-[1360px] mx-auto px-5 md:px-10 pt-20 pb-12 md:pt-24 md:pb-14">
        <p className="text-sm font-medium m-0">
          You made it to the end
        </p>
        <h2 className="mt-6 mb-10 font-display text-[clamp(42px,6.5vw,88px)] leading-[1.02] tracking-[-0.025em] font-medium">
          Let&apos;s create
          <br />
          <em className="not-italic font-medium text-[#b82d18]">something good.</em>
        </h2>
        <div className="flex flex-wrap items-center gap-6">
          <button
            type="button"
            onClick={onOpenContact}
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-[#171716] text-[#f2efe6] border-2 border-[#171716] text-sm font-medium shadow-[5px_5px_0_#ff5b44] hover:-translate-y-0.5 hover:bg-[#ff5b44] hover:text-[#171716] hover:shadow-[6px_7px_0_#171716] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none active:bg-[#ff5b44] active:text-[#171716] transition-all duration-150 whitespace-nowrap shrink-0"
          >
            Start a Conversation <Arrow />
          </button>
          <a
            href="mailto:sadmanrhd@gmail.com"
            className="inline-flex items-center gap-3 text-sm font-medium border-b-2 border-[#171716] pb-1.5 hover:text-[#b82d18] hover:border-[#b82d18] active:text-[#b82d18] active:border-[#b82d18] transition-colors whitespace-nowrap shrink-0"
          >
            sadmanrhd@gmail.com <Arrow />
          </a>
        </div>

        <div
          data-testid="footer-socials"
          className="mt-14 pt-8 border-t-2 border-[#171716]/25 flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
            <span className="text-sm font-medium text-[#171716]/75 shrink-0">
              Connect
            </span>
            <SocialLinks variant="footer" />
          </div>
          <p className="text-sm text-[#171716]/70 m-0 tabular-nums">
            &copy; {new Date().getFullYear()} Sadman Rahman
          </p>
        </div>
      </div>
    </footer>
  );
}
