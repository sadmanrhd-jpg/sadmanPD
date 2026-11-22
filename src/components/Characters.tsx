export function Arrow({
  direction = "right",
  className = "",
}: {
  direction?: "right" | "left" | "up-right";
  className?: string;
}) {
  if (direction === "up-right") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={`w-5 h-5 fill-none stroke-current stroke-[2.2] ${className}`}
      >
        <path d="M7 17L17 7M9 7h8v8" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`w-5 h-5 fill-none stroke-current stroke-[2.2] ${
        direction === "left" ? "rotate-180" : ""
      } ${className}`}
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`w-5 h-5 fill-none stroke-current stroke-[2.2] ${className}`}
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ChevronIcon({
  direction = "right",
  className = "",
}: {
  direction?: "left" | "right";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`w-5 h-5 fill-none stroke-current stroke-[2.2] ${className}`}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "left" ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  );
}

export function DesignerCharacter() {
  return (
    <svg
      className="character-svg"
      viewBox="0 0 430 540"
      role="img"
      aria-label="Sadman as a product designer"
    >
      <g className="designer-float">
        <ellipse className="svg-shadow" cx="222" cy="505" rx="136" ry="17" />
        <path
          className="svg-stroke svg-white"
          d="M134 336c20-34 54-51 96-48 47 3 76 23 91 65l15 116H107z"
        />
        <path
          className="svg-stroke svg-coral"
          d="M105 469l17-119c11-40 42-60 80-64l28 36 29-35c33 5 55 23 67 58l13 124z"
        />
        <path className="svg-stroke svg-skin" d="M182 278l2 42c14 16 51 16 67-1l-2-48z" />
        <path
          className="svg-stroke svg-skin"
          d="M128 157c-3 73 26 131 90 133 67 2 100-54 96-128-3-68-37-104-92-104-62 0-91 39-94 99z"
        />
        <path
          className="svg-stroke svg-hair"
          d="M128 164c-16-48 12-111 72-118 47-6 91 8 111 52 8 17 9 45 3 67l-19-36c-42 9-84 1-111-21-7 23-25 41-56 56z"
        />
        <path
          className="svg-stroke svg-hair"
          d="M134 138c-25 2-34 22-25 44 5 13 15 21 29 22zM307 139c24 0 34 20 27 41-4 13-14 22-27 23z"
        />
        <path className="svg-line" d="M166 184c10-8 22-9 33-2M247 181c11-6 24-4 32 3" />
        <ellipse className="svg-ink" cx="185" cy="193" rx="6" ry="8" />
        <ellipse className="svg-ink" cx="263" cy="193" rx="6" ry="8" />
        <path className="svg-line" d="M225 195l-5 30 13 1M193 242c17 13 45 14 63-1" />
        <path
          className="svg-stroke svg-white"
          d="M137 168c21-14 49-12 67 3l-4 36c-22 10-48 5-58-16zM243 170c20-13 48-10 63 7l-8 34c-22 8-46 1-56-19z"
        />
        <path className="svg-line" d="M203 178l39 1M138 176l-18-8M306 182l20-7" />
        <path
          className="svg-stroke svg-skin"
          d="M129 342c-25 12-57 47-72 79-7 15-1 28 12 32 12 4 23-2 30-15l44-64z"
        />
        <path
          className="svg-stroke svg-skin"
          d="M316 340c22 13 51 41 63 72 6 15 0 27-13 31-12 3-22-3-29-16l-36-57z"
        />
        <path className="svg-stroke svg-white" d="M177 360h91l8 69h-105z" />
        <path className="svg-stroke svg-lime" d="M185 367h75l7 52h-88z" />
        <path className="svg-line" d="M204 385h40M204 399h30" />
        <path
          className="svg-stroke svg-ink"
          d="M116 467h91l-7 40H91c0-23 8-36 25-40zM247 467h90c17 4 25 17 25 40H254z"
        />
        <path
          className="svg-stroke svg-skin"
          d="M52 416c9-8 26-8 36 1 10 8 13 22 6 32-7 11-26 13-38 3-12-9-14-26-4-36z"
        />
        <path className="svg-line" d="M57 419l-16-16M69 414l-8-22" />
        <g className="spark">
          <path
            className="svg-stroke svg-yellow"
            d="M60 104l10 26 26 10-26 10-10 26-10-26-26-10 26-10z"
          />
        </g>
        <path className="svg-stroke svg-white pencil" d="M339 85l18-14 57 73-18 14z" />
        <path className="svg-stroke svg-coral pencil" d="M357 71l12-9 57 73-12 9z" />
      </g>
    </svg>
  );
}

export function PhotographerCharacter() {
  return (
    <svg
      className="character-svg"
      viewBox="0 0 430 540"
      role="img"
      aria-label="Sadman as a photographer"
    >
      <g className="photographer-float">
        <ellipse className="svg-shadow" cx="210" cy="505" rx="136" ry="17" />
        <path
          className="svg-stroke svg-white"
          d="M98 469l15-114c11-42 43-65 91-68l30 34 28-34c42 6 70 29 79 68l15 114z"
        />
        <path
          className="svg-stroke svg-cobalt"
          d="M101 469l14-113c8-38 32-58 67-67l50 57 50-57c35 10 56 31 63 67l12 113z"
        />
        <path className="svg-stroke svg-skin" d="M190 277l2 42c15 16 51 16 68-1l-3-48z" />
        <path
          className="svg-stroke svg-skin"
          d="M129 157c-3 72 26 130 92 132 66 2 98-55 94-128-3-68-36-104-92-104-62 0-91 39-94 100z"
        />
        <path
          className="svg-stroke svg-ink"
          d="M128 160c-13-52 18-110 73-118 53-8 96 13 111 59 6 17 7 41 2 60l-18-37c-39 8-83 0-112-22-10 26-27 45-56 58z"
        />
        <path
          className="svg-stroke svg-ink"
          d="M136 137c-25 2-35 21-27 44 5 13 16 21 30 22zM308 138c23 0 33 19 26 41-4 13-14 22-27 23z"
        />
        <path className="svg-line" d="M165 181c11-7 24-7 34 0M247 180c11-6 24-4 32 3" />
        <ellipse className="svg-ink" cx="184" cy="193" rx="6" ry="8" />
        <ellipse className="svg-ink" cx="262" cy="193" rx="6" ry="8" />
        <path className="svg-line" d="M224 195l-5 30 13 1M193 241c17 13 45 14 63-1" />
        <path
          className="svg-stroke svg-skin"
          d="M116 347c-23 11-50 40-64 69-7 15-2 29 11 34 13 4 24-2 31-15l38-59z"
        />
        <path
          className="svg-stroke svg-skin"
          d="M336 346c22 12 47 38 59 67 6 15 1 28-12 32-12 4-23-2-30-15l-34-54z"
        />
        <path className="svg-stroke svg-ink camera" d="M148 350h160l9 102H137z" />
        <path className="svg-stroke svg-yellow camera" d="M169 334h44l12 16h-68z" />
        <circle className="svg-stroke svg-white camera" cx="228" cy="400" r="45" />
        <circle className="svg-stroke svg-cobalt camera" cx="228" cy="400" r="29" />
        <circle className="svg-stroke svg-white camera" cx="228" cy="400" r="12" />
        <circle className="svg-coral" cx="291" cy="370" r="8" />
        <path
          className="svg-stroke svg-ink"
          d="M109 467h91l-7 40H84c0-23 8-36 25-40zM247 467h91c17 4 25 17 25 40H254z"
        />
        <path
          className="svg-stroke svg-skin"
          d="M365 413c11-7 27-4 35 7 8 10 8 25-2 33-10 9-29 6-38-6-9-12-7-27 5-34z"
        />
        <path className="svg-line" d="M392 421l18-14M398 432l22-3" />
        <g className="flash">
          <path
            className="svg-stroke svg-yellow"
            d="M347 92l11 28 29 11-29 11-11 29-11-29-28-11 28-11z"
          />
          <path
            className="svg-stroke svg-white"
            d="M384 65l5 12 12 5-12 5-5 12-5-12-12-5 12-5z"
          />
        </g>
      </g>
    </svg>
  );
}
