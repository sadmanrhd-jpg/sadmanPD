import { useEffect, useState } from "react";

type World = "design" | "photo";

const work = {
  design: [
    {
      title: "Mori",
      type: "Wellness · Product",
      image:
        "https://images.unsplash.com/photo-1729303130444-686fbdaea1d7?auto=format&fit=crop&w=1400&q=85",
      className: "wide",
    },
    {
      title: "Pico",
      type: "Audio · Industrial",
      image:
        "https://images.unsplash.com/photo-1527529322410-38812e8fd77c?auto=format&fit=crop&w=1000&q=85",
    },
    {
      title: "Oral Lab",
      type: "Health · Strategy",
      image:
        "https://images.unsplash.com/photo-1727755868079-d7a2b287cb48?auto=format&fit=crop&w=1000&q=85",
    },
    {
      title: "After Eight",
      type: "Objects · Art direction",
      image:
        "https://images.unsplash.com/photo-1554908338-c9770e3acd0c?auto=format&fit=crop&w=1200&q=85",
      className: "wide",
    },
  ],
  photo: [
    {
      title: "Midnight Riders",
      type: "Saigon · 2024",
      image:
        "https://images.unsplash.com/photo-1599060052009-24d6d0b0161c?auto=format&fit=crop&w=1400&q=85",
      className: "wide",
    },
    {
      title: "Last Green",
      type: "Seoul · 2023",
      image:
        "https://images.unsplash.com/photo-1521794286957-348245b517a0?auto=format&fit=crop&w=1000&q=85",
    },
    {
      title: "Two Strangers",
      type: "Phnom Penh · 2024",
      image:
        "https://images.unsplash.com/photo-1670871361579-54da7b070608?auto=format&fit=crop&w=1000&q=85",
    },
    {
      title: "Passing Through",
      type: "Hong Kong · 2023",
      image:
        "https://images.unsplash.com/photo-1570587726545-494e2bcc2f9f?auto=format&fit=crop&w=1400&q=85",
      className: "wide",
    },
  ],
};

function Arrow({ direction = "right" }: { direction?: "right" | "left" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={direction === "left" ? "rotate-180" : ""}
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

function DesignerCharacter() {
  return (
    <svg
      className="character-svg"
      viewBox="0 0 430 540"
      role="img"
      aria-label="Kai as a product designer"
    >
      <g className="designer-float">
        <ellipse className="shadow" cx="222" cy="505" rx="136" ry="17" />
        <path
          className="outline white"
          d="M134 336c20-34 54-51 96-48 47 3 76 23 91 65l15 116H107z"
        />
        <path
          className="outline coral"
          d="M105 469l17-119c11-40 42-60 80-64l28 36 29-35c33 5 55 23 67 58l13 124z"
        />
        <path className="outline skin" d="M182 278l2 42c14 16 51 16 67-1l-2-48z" />
        <path
          className="outline skin"
          d="M128 157c-3 73 26 131 90 133 67 2 100-54 96-128-3-68-37-104-92-104-62 0-91 39-94 99z"
        />
        <path
          className="outline hair"
          d="M128 164c-16-48 12-111 72-118 47-6 91 8 111 52 8 17 9 45 3 67l-19-36c-42 9-84 1-111-21-7 23-25 41-56 56z"
        />
        <path
          className="outline hair"
          d="M134 138c-25 2-34 22-25 44 5 13 15 21 29 22zM307 139c24 0 34 20 27 41-4 13-14 22-27 23z"
        />
        <path className="line" d="M166 184c10-8 22-9 33-2M247 181c11-6 24-4 32 3" />
        <ellipse className="ink" cx="185" cy="193" rx="6" ry="8" />
        <ellipse className="ink" cx="263" cy="193" rx="6" ry="8" />
        <path className="line" d="M225 195l-5 30 13 1M193 242c17 13 45 14 63-1" />
        <path
          className="outline white"
          d="M137 168c21-14 49-12 67 3l-4 36c-22 10-48 5-58-16zM243 170c20-13 48-10 63 7l-8 34c-22 8-46 1-56-19z"
        />
        <path className="line" d="M203 178l39 1M138 176l-18-8M306 182l20-7" />
        <path
          className="outline skin arm-left"
          d="M129 342c-25 12-57 47-72 79-7 15-1 28 12 32 12 4 23-2 30-15l44-64z"
        />
        <path
          className="outline skin arm-right"
          d="M316 340c22 13 51 41 63 72 6 15 0 27-13 31-12 3-22-3-29-16l-36-57z"
        />
        <path className="outline white" d="M177 360h91l8 69h-105z" />
        <path className="outline lime" d="M185 367h75l7 52h-88z" />
        <path className="line" d="M204 385h40M204 399h30" />
        <path
          className="outline ink"
          d="M116 467h91l-7 40H91c0-23 8-36 25-40zM247 467h90c17 4 25 17 25 40H254z"
        />
        <path
          className="outline skin"
          d="M52 416c9-8 26-8 36 1 10 8 13 22 6 32-7 11-26 13-38 3-12-9-14-26-4-36z"
        />
        <path className="line" d="M57 419l-16-16M69 414l-8-22" />
        <g className="spark">
          <path className="outline yellow" d="M60 104l10 26 26 10-26 10-10 26-10-26-26-10 26-10z" />
        </g>
        <path className="outline white pencil" d="M339 85l18-14 57 73-18 14z" />
        <path className="outline coral pencil" d="M357 71l12-9 57 73-12 9z" />
      </g>
    </svg>
  );
}

function PhotographerCharacter() {
  return (
    <svg
      className="character-svg"
      viewBox="0 0 430 540"
      role="img"
      aria-label="Kai as a photographer"
    >
      <g className="photographer-float">
        <ellipse className="shadow" cx="210" cy="505" rx="136" ry="17" />
        <path
          className="outline white"
          d="M98 469l15-114c11-42 43-65 91-68l30 34 28-34c42 6 70 29 79 68l15 114z"
        />
        <path
          className="outline cobalt"
          d="M101 469l14-113c8-38 32-58 67-67l50 57 50-57c35 10 56 31 63 67l12 113z"
        />
        <path className="outline skin" d="M190 277l2 42c15 16 51 16 68-1l-3-48z" />
        <path
          className="outline skin"
          d="M129 157c-3 72 26 130 92 132 66 2 98-55 94-128-3-68-36-104-92-104-62 0-91 39-94 100z"
        />
        <path
          className="outline ink"
          d="M128 160c-13-52 18-110 73-118 53-8 96 13 111 59 6 17 7 41 2 60l-18-37c-39 8-83 0-112-22-10 26-27 45-56 58z"
        />
        <path
          className="outline ink"
          d="M136 137c-25 2-35 21-27 44 5 13 16 21 30 22zM308 138c23 0 33 19 26 41-4 13-14 22-27 23z"
        />
        <path className="line" d="M165 181c11-7 24-7 34 0M247 180c11-6 24-4 32 3" />
        <ellipse className="ink" cx="184" cy="193" rx="6" ry="8" />
        <ellipse className="ink" cx="262" cy="193" rx="6" ry="8" />
        <path className="line" d="M224 195l-5 30 13 1M193 241c17 13 45 14 63-1" />
        <path
          className="outline skin arm-left"
          d="M116 347c-23 11-50 40-64 69-7 15-2 29 11 34 13 4 24-2 31-15l38-59z"
        />
        <path
          className="outline skin arm-right"
          d="M336 346c22 12 47 38 59 67 6 15 1 28-12 32-12 4-23-2-30-15l-34-54z"
        />
        <path className="outline ink camera" d="M148 350h160l9 102H137z" />
        <path className="outline yellow camera" d="M169 334h44l12 16h-68z" />
        <circle className="outline white camera" cx="228" cy="400" r="45" />
        <circle className="outline cobalt camera" cx="228" cy="400" r="29" />
        <circle className="outline white camera" cx="228" cy="400" r="12" />
        <circle className="coral" cx="291" cy="370" r="8" />
        <path
          className="outline ink"
          d="M109 467h91l-7 40H84c0-23 8-36 25-40zM247 467h91c17 4 25 17 25 40H254z"
        />
        <path
          className="outline skin"
          d="M365 413c11-7 27-4 35 7 8 10 8 25-2 33-10 9-29 6-38-6-9-12-7-27 5-34z"
        />
        <path className="line" d="M392 421l18-14M398 432l22-3" />
        <g className="flash">
          <path className="outline yellow" d="M347 92l11 28 29 11-29 11-11 29-11-29-28-11 28-11z" />
          <path className="outline white" d="M384 65l5 12 12 5-12 5-5 12-5-12-12-5 12-5z" />
        </g>
      </g>
    </svg>
  );
}

function Home({ enter }: { enter: (world: World) => void }) {
  return (
    <main className="home">
      <header className="site-header">
        <button className="brand" onClick={() => window.scrollTo(0, 0)} aria-label="Kai home">
          KAI<span>!</span>
        </button>
        <div className="availability">
          <i /> AVAILABLE FOR PROJECTS
        </div>
        <a className="round-link" href="mailto:hello@kai.studio" aria-label="Email Kai">
          <Arrow />
        </a>
      </header>

      <section className="arena">
        <div className="eyebrow">PLAYER SELECT · CHOOSE YOUR STORY</div>
        <div className="title-wrap">
          <h1>
            ONE MIND.
            <br />
            <em>TWO WORLDS.</em>
          </h1>
          <div className="vs">VS</div>
        </div>

        <button
          className="fighter fighter-left"
          onClick={() => enter("design")}
          aria-label="View product design work"
        >
          <DesignerCharacter />
          <span className="player-number">P1</span>
          <span className="fighter-label">
            <b>PRODUCT</b> DESIGNER
          </span>
          <span className="choose">
            CHOOSE FIGHTER <Arrow />
          </span>
        </button>

        <button
          className="fighter fighter-right"
          onClick={() => enter("photo")}
          aria-label="View photography work"
        >
          <PhotographerCharacter />
          <span className="player-number">P2</span>
          <span className="fighter-label">
            <b>STREET</b> PHOTOGRAPHER
          </span>
          <span className="choose">
            CHOOSE FIGHTER <Arrow />
          </span>
        </button>

        <div className="center-copy">
          <p>
            DESIGNING USEFUL THINGS.
            <br />
            CAPTURING BEAUTIFUL MOMENTS.
          </p>
          <span>SCROLL TO MEET KAI</span>
        </div>
      </section>

      <section className="intro">
        <p className="section-index">01 / THE PLAYER</p>
        <h2>
          I TURN <span>COMPLEXITY</span> INTO CLARITY—THEN CHASE THE LIGHT AFTER HOURS.
        </h2>
        <div className="intro-bottom">
          <p>
            Based in Singapore, working everywhere. Currently shaping digital products and
            documenting the wonderfully ordinary.
          </p>
          <a href="mailto:hello@kai.studio">
            LET'S MAKE SOMETHING <Arrow />
          </a>
        </div>
      </section>
    </main>
  );
}

function Gallery({ world, close }: { world: World; close: () => void }) {
  const isDesign = world === "design";
  const items = work[world];
  return (
    <main className={`gallery gallery-${world}`}>
      <header className="gallery-header">
        <button className="brand" onClick={close}>
          KAI<span>!</span>
        </button>
        <button className="back" onClick={close}>
          <Arrow direction="left" /> BACK TO SELECT
        </button>
        <a href="mailto:hello@kai.studio">
          START A PROJECT <Arrow />
        </a>
      </header>
      <section className="gallery-hero">
        <div className="gallery-kicker">
          {isDesign ? "PLAYER ONE" : "PLAYER TWO"} · SELECTED WORK
        </div>
        <h1>
          {isDesign ? (
            <>
              PRODUCT
              <br />
              <em>DESIGN.</em>
            </>
          ) : (
            <>
              STREET
              <br />
              <em>STORIES.</em>
            </>
          )}
        </h1>
        <p>
          {isDesign
            ? "Useful, delightful digital and physical products—built from messy questions and sharp ideas."
            : "Unscripted fragments of city life—color, solitude, motion, and all the moments in between."}
        </p>
        <span className="gallery-count">0{items.length} PROJECTS</span>
      </section>
      <section className="work-grid">
        {items.map((item, index) => (
          <article className={`work-card ${item.className ?? ""}`} key={item.title}>
            <div className="image-wrap">
              <img src={item.image} alt={`${item.title}, ${item.type}`} />
              <span className="view-mark">
                <Arrow />
              </span>
            </div>
            <div className="work-meta">
              <span>0{index + 1}</span>
              <h2>{item.title}</h2>
              <p>{item.type}</p>
            </div>
          </article>
        ))}
      </section>
      <footer>
        <p>YOU MADE IT TO THE END.</p>
        <h2>
          LET'S CREATE
          <br />
          <em>SOMETHING GOOD.</em>
        </h2>
        <a href="mailto:hello@kai.studio">
          HELLO@KAI.STUDIO <Arrow />
        </a>
      </footer>
    </main>
  );
}

export default function App() {
  const [world, setWorld] = useState<World | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [world]);

  return world ? <Gallery world={world} close={() => setWorld(null)} /> : <Home enter={setWorld} />;
}
