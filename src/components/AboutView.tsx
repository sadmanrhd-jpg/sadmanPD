import { EXPERIENCE_LIST, type View } from "../data/portfolio";
import { Arrow, DesignerCharacter } from "./Characters";
import { SocialLinks } from "./SocialLinks";

interface AboutViewProps {
  onNavigate: (view: View) => void;
  onOpenContact: () => void;
}

export function AboutView({ onNavigate, onOpenContact }: AboutViewProps) {
  return (
    <main className="bg-[#f2efe6] text-[#171716] min-h-screen">
      <section className="border-b-2 border-[#171716]">
        <div className="max-w-[1360px] mx-auto px-5 md:px-10 pt-6 pb-14 md:pt-8 md:pb-20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border-2 border-[#171716] bg-[#fffdf6] text-sm font-medium text-[#171716] shadow-[3px_3px_0_#171716] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_5px_0_#171716] hover:bg-[#171716] hover:text-[#f2efe6] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none active:bg-[#171716] active:text-[#f2efe6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5b44]"
            >
              <Arrow
                direction="left"
                className="w-4 h-4 transition-transform duration-150 group-hover:-translate-x-1 group-active:-translate-x-1"
              />
              <span>Back</span>
            </button>
          </div>

          <p className="mt-8 md:mt-10 text-[16px] text-[#171716]/70 font-medium m-0">
            About Sadman · Singapore
          </p>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1.45fr_0.85fr] gap-12 items-center">
            <div>
              <h1 className="font-display text-[clamp(40px,5.2vw,72px)] leading-[1.04] tracking-[-0.025em] font-medium m-0 text-balance">
                Clarity in <em className="not-italic font-medium text-[#d9442e]">Systems.</em>
                <br />
                Tension in <em className="not-italic font-medium text-[#4169ed]">Light.</em>
              </h1>
              <div className="mt-8 max-w-[50ch] flex flex-col gap-7 md:gap-8">
                <p className="text-[17px] md:text-[18px] leading-[2] md:leading-[1.9] text-[#171716]/82 m-0">
                  I&apos;m Sadman, a Singapore-based product designer and freelance photographer working
                  at the intersection of tactile hardware, calm interfaces, and 35mm documentary
                  storytelling.
                </p>
                <p className="text-[17px] md:text-[17.5px] leading-[2] md:leading-[1.9] text-[#171716]/76 m-0">
                  During studio hours I partner with founders and engineering teams to turn tangled
                  technical constraints into products people look forward to picking up. After dusk,
                  I walk dense neighborhoods across Asia with a mechanical rangefinder.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#171716] text-[#f2efe6] border-2 border-[#171716] text-sm font-medium shadow-[4px_4px_0_#ff5b44] hover:-translate-y-0.5 hover:bg-[#ff5b44] hover:text-[#171716] hover:shadow-[5px_6px_0_#171716] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none active:bg-[#ff5b44] active:text-[#171716] transition-all duration-150"
                >
                  Get in Touch <Arrow />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("design")}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#fffdf6] border-2 border-[#171716] text-sm font-medium shadow-[3px_3px_0_#171716] hover:-translate-y-0.5 hover:bg-[#c7ef45] hover:shadow-[4px_5px_0_#171716] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none active:bg-[#c7ef45] transition-all duration-150"
                >
                  View Design Work <Arrow className="w-4 h-4" />
                </button>
              </div>

              <div data-testid="about-socials" className="mt-8 pt-6 border-t border-[#171716]/20">
                <p className="text-sm font-medium text-[#171716]/70 mb-3 m-0">
                  Find me online
                </p>
                <SocialLinks variant="surface" compact />
              </div>
            </div>

            <div className="rounded-2xl bg-[#fffdf6] border-2 border-[#171716] shadow-[8px_8px_0_#171716] p-6 flex flex-col items-center">
              <div className="w-full max-w-[270px] h-[310px]">
                <DesignerCharacter />
              </div>
              <div className="w-full border-t-2 border-[#171716] pt-4 mt-2 flex items-center justify-between text-sm font-medium">
                <span>Based in Singapore</span>
                <span className="text-[#d9442e] tabular-nums">GMT+8</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-[#171716]">
        <div className="max-w-[1360px] mx-auto px-5 md:px-10 py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          <div>
            <p className="text-[16px] text-[#d9442e] font-medium m-0">
              Discipline 01 · Product Design
            </p>
            <h2 className="mt-3 font-display text-[26px] md:text-[32px] font-medium tracking-[-0.015em] leading-snug m-0">
              Interfaces, Hardware &amp; Brand Systems
            </h2>
            <p className="mt-4 max-w-[46ch] text-[17px] md:text-[17px] leading-[1.95] md:leading-[1.88] text-[#171716]/76">
              From zero-to-one mobile companions and industrial hardware ergonomics to coherent
              design systems that scale cleanly across engineering teams.
            </p>
            <ul className="mt-6 space-y-2.5 text-[17px] md:text-[17px] leading-[1.5] text-[#171716]/85 list-none p-0 m-0 tabular-nums">
              <li className="py-2 border-b border-[#171716]/20">
                01 · Zero-to-One Product &amp; Hardware Strategy
              </li>
              <li className="py-2 border-b border-[#171716]/20">
                02 · Companion Apps, Web Interfaces &amp; Prototyping
              </li>
              <li className="py-2 border-b border-[#171716]/20">
                03 · Industrial Enclosure &amp; Tactile UI Systems
              </li>
              <li className="py-2 border-b border-[#171716]/20">
                04 · Art Direction &amp; Launch Packaging
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[16px] text-[#4169ed] font-medium m-0">
              Discipline 02 · Freelance Photography
            </p>
            <h2 className="mt-3 font-display text-[26px] md:text-[32px] font-medium tracking-[-0.015em] leading-snug m-0">
              Documentary, Editorial &amp; Print Editions
            </h2>
            <p className="mt-4 max-w-[46ch] text-[17px] md:text-[17px] leading-[1.95] md:leading-[1.88] text-[#171716]/76">
              Working primarily on 35mm film and compact rangefinders to capture unposed human
              presence, nocturnal neon geometry, and architectural rhythm.
            </p>
            <ul className="mt-6 space-y-2.5 text-[17px] md:text-[17px] leading-[1.5] text-[#171716]/85 list-none p-0 m-0 tabular-nums">
              <li className="py-2 border-b border-[#171716]/20">
                01 · Editorial Essays &amp; Brand Visual Stories
              </li>
              <li className="py-2 border-b border-[#171716]/20">
                02 · Archival Pigment Prints &amp; Zine Editions
              </li>
              <li className="py-2 border-b border-[#171716]/20">
                03 · Architectural &amp; Object Still-Life Direction
              </li>
              <li className="py-2 border-b border-[#171716]/20">
                04 · Exhibition Curation across Asia
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-[1360px] mx-auto px-5 md:px-10 py-16 md:py-20">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-medium tracking-[-0.02em] leading-tight m-0">
            Experience &amp; Exhibitions
          </h2>
          <button
            type="button"
            onClick={() => onNavigate("photo")}
            className="inline-flex items-center gap-2 text-[15px] font-medium text-[#4169ed] hover:underline underline-offset-4"
          >
            Explore Photo Archive <Arrow className="w-4 h-4" />
          </button>
        </div>

        <div className="border-t-2 border-[#171716]">
          {EXPERIENCE_LIST.map((item) => (
            <div
              key={`${item.period}-${item.role}`}
              className="py-6 border-b border-[#171716]/25 grid grid-cols-1 md:grid-cols-[140px_1fr_1.1fr] gap-3 md:gap-8 items-baseline"
            >
              <span className="text-[17px] leading-[1.5] tabular-nums font-medium text-[#171716]/70">
                {item.period}
              </span>
              <div>
                <h3 className="font-semibold text-[19px] leading-[1.5] m-0">{item.role}</h3>
                <p className="mt-1 text-[17px] leading-[1.5] text-[#171716]/68 m-0">
                  {item.place} · {item.discipline}
                </p>
              </div>
              <p className="text-[18px] leading-[2] md:leading-[1.7] text-[#171716]/82 m-0">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
