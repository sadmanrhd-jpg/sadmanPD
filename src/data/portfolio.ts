import designPicoImg from "../assets/images/design_pico_1794924583357.jpg";
import designOralLabImg from "../assets/images/design_oral_lab_1794924580155.jpg";
import designAfterEightImg from "../assets/images/design_after_eight_1794924582908.jpg";
import photoMidnightRidersImg from "../assets/images/photo_midnight_riders_1794924584704.jpg";
import photoLastGreenImg from "../assets/images/photo_last_green_1794924581955.jpg";
import photoTwoStrangersImg from "../assets/images/photo_two_strangers_1794924582739.jpg";
import photoPassingThroughImg from "../assets/images/photo_passing_through_1794924582582.jpg";

export type World = "design" | "photo";
export type View = "home" | "design" | "photo" | "about";
export type DesignCategory = "All" | "Product" | "Industrial" | "Strategy";
export type PhotoGenre =
  | "All"
  | "Street"
  | "Documentary"
  | "Product"
  | "Travel"
  | "Nature";

export interface CaseStudyMetric {
  label: string;
  value: string;
}

export interface CaseStudyProcessStep {
  phase: string;
  title: string;
  detail: string;
}

export interface CaseStudyDecision {
  title: string;
  rationale: string;
}

export interface CaseStudyMilestone {
  tag: string;
  title: string;
  detail: string;
}

export interface CaseStudyFeatureItem {
  num?: string;
  title: string;
  detail: string;
}

export interface CaseStudyVisual {
  src: string;
  title: string;
  caption: string;
  featured?: boolean;
}

export interface CaseStudyComparisonRow {
  before: string;
  after: string;
}

export interface DesignProject {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<DesignCategory, "All">;
  year: string;
  timeline?: string;
  client: string;
  partner?: string;
  budget?: string;
  role: string;
  liveUrl?: string;
  liveUrlLabel?: string;
  image: string;
  imageFit?: "cover" | "contain";
  wide?: boolean;
  summary: string;
  overview?: string;
  quote?: string;
  overviewVisual?: CaseStudyVisual;
  challenge: string;
  challengeIntro?: string;
  challengePoints?: CaseStudyFeatureItem[];
  backgroundIntro?: string;
  backgroundMilestones?: CaseStudyMilestone[];
  contributionsIntro?: string;
  contributions?: CaseStudyFeatureItem[];
  contributionGallery?: CaseStudyVisual[];
  approach: string;
  deliverables: string[];
  outcome: string;
  metrics?: CaseStudyMetric[];
  researchInsights?: string[];
  processSteps?: CaseStudyProcessStep[];
  keyDesignAreas?: CaseStudyFeatureItem[];
  keyDesignAreasVisual?: CaseStudyVisual;
  beforeAfter?: CaseStudyComparisonRow[];
  scaleIntro?: string;
  scaleMetrics?: CaseStudyMetric[];
  keyDecisions?: CaseStudyDecision[];
  reflection?: string;
}

export interface PhotoItem {
  id: string;
  title: string;
  genre: Exclude<PhotoGenre, "All">;
  location: string;
  year: string;
  image: string;
  wide?: boolean;
  camera: string;
  lens: string;
  settings: string;
  story: string;
}

export interface ExperienceItem {
  period: string;
  role: string;
  place: string;
  discipline: "Design" | "Photography";
  detail: string;
}

export const DESIGN_CATEGORIES: DesignCategory[] = [
  "All",
  "Product",
  "Industrial",
  "Strategy",
];

export const PHOTO_GENRES: PhotoGenre[] = [
  "All",
  "Street",
  "Documentary",
  "Product",
  "Travel",
  "Nature",
];

export const DESIGN_PROJECTS: DesignProject[] = [
  {
    id: "nsd",
    title: "National Sanitation Dashboard (NSD)",
    subtitle: "GovTech · Data Platform",
    category: "Product",
    year: "2024",
    timeline: "2020–2024 · Phase II Upscaling",
    client: "Department of Public Health Engineering · DPHE",
    partner: "Global Water and Sanitation Center · GWSC",
    budget: "BDT 5.50 CR",
    role: "Product Designer · UX Researcher · Communication Expert",
    liveUrl: "https://www.sanboard.gov.bd",
    liveUrlLabel: "sanboard.gov.bd",
    image: "/assets/aistudio/Cover_0575afc4.png",
    imageFit: "contain",
    wide: true,
    summary:
      "Designing a national sanitation data platform that turns complex and fragmented information into clearer, comparable insights for planning, monitoring, and decision making.",
    overview:
      "The National Sanitation Dashboard is a government digital platform for sanitation planning, monitoring, and evidence based decision making. The upscaling work expanded the product with stronger visualization, survey management, multilingual access, city comparison, user management, and integration with municipal data systems.",
    quote:
      "The design challenge was not only to show more data. It was to make a national data heavy system easier to understand, compare, and use across very different stakeholder groups.",
    metrics: [
      { value: "126+", label: "Towns represented in the current dashboard" },
      { value: "18", label: "Approximate sanitation data categories" },
      { value: "12+", label: "Organizations represented in requirements" },
      { value: "22", label: "CWIS indicators visualized from IMIS" },
    ],
    overviewVisual: {
      src: "/assets/aistudio/Screenshot_2026-11-22_at_4.52.16_PM_c40c7973.png",
      title: "National Sanitation Dashboard Portal",
      caption:
        "Bilingual entry portal uniting 135 municipalities and 10+ national surveys with direct navigation to city profiles, charts, indicators, FSTP records, and IMIS Cities.",
    },
    backgroundIntro:
      "A compact view of how the dashboard evolved into a broader national platform.",
    backgroundMilestones: [
      {
        tag: "2020",
        title: "Original dashboard",
        detail:
          "The dashboard was introduced using household and institutional survey data with national, city, chart, and indicator views.",
      },
      {
        tag: "61 cities",
        title: "Existing coverage",
        detail:
          "The earlier system covered sanitation, solid waste management, drainage, and SFD information for 61 cities.",
      },
      {
        tag: "2024",
        title: "Integrative upscaling",
        detail:
          "The product entered a broader redesign phase focused on usability, scalability, data management, and integration.",
      },
      {
        tag: "Phase II",
        title: "80+ Paurashavas",
        detail:
          "The next phase expands data standardization and integration while strengthening interoperability, training, and institutional use.",
      },
    ],
    challenge:
      "Three product problems shaped the direction of the redesign and upscaling work: fragmented sanitation data, static manual workflows, and limited accessibility and analysis.",
    challengeIntro:
      "Three product problems shaped the direction of the redesign and upscaling work.",
    challengePoints: [
      {
        title: "Fragmented sanitation data",
        detail:
          "Sanitation information came from different surveys, municipal records, datasets, years, and systems. Inconsistent structures made national and city level comparison difficult.",
      },
      {
        title: "Static and manual workflows",
        detail:
          "The earlier platform relied heavily on static data and manual processes for adding new cities. Survey planning, monitoring, and data incorporation needed a more scalable workflow.",
      },
      {
        title: "Limited accessibility and analysis",
        detail:
          "The system needed clearer information hierarchy, stronger visualization, city comparison, Bangla access, and contextual help for technical and general users.",
      },
    ],
    approach:
      "Translated stakeholder research, technical domain requirements, and municipal data workflows into a scalable bilingual platform spanning city profiles, comparison views, FSTP tracking, interactive charts, and IMIS CWIS integration.",
    contributionsIntro:
      "How I translated research, stakeholder needs, and technical constraints into product decisions.",
    contributions: [
      {
        num: "01",
        title: "Dashboard redesign",
        detail:
          "Led the design refresh across data heavy dashboard modules, improving layout structure, visual hierarchy, color usage, and typography.",
      },
      {
        num: "02",
        title: "City profile and comparison",
        detail:
          "Translated requirements into clearer city level information views and comparison patterns so users could review two cities using the same set of indicators.",
      },
      {
        num: "03",
        title: "Survey planning workflows",
        detail:
          "Helped structure the interface for projects, surveys, questionnaires, monitoring, and collected survey data so the workflow could scale beyond static data entry.",
      },
      {
        num: "04",
        title: "Bilingual accessibility",
        detail:
          "Supported a Bangla and English experience and contextual explanation patterns that make technical sanitation terms easier to understand.",
      },
      {
        num: "05",
        title: "User and permission flows",
        detail:
          "Worked with multilevel user requirements including registration, access requests, administrative approval, and role based visibility.",
      },
      {
        num: "06",
        title: "Data visualization patterns",
        detail:
          "Defined practical interface decisions for charts, indicators, exports, and IMIS sourced data while coordinating with developers, GIS experts, data analysts, and WASH specialists.",
      },
    ],
    contributionGallery: [
      {
        src: "/assets/aistudio/After_My_Contribution_1_1d6ea48d.png",
        title: "City Profile Overview",
        caption:
          "Single-city overview for Cumilla surfacing SDG sanitation gauges, demographic breakdown, fecal sludge generation, and solid waste summaries with bilingual toggle and PDF export.",
      },
      {
        src: "/assets/aistudio/After_My_Contribution_2_55d1c5a0.png",
        title: "Side-by-Side City Comparison",
        caption:
          "Comparative view pairing Cumilla and Bagerhat across identical SDG indicators, ward counts, area, population density, and survey years.",
      },
      {
        src: "/assets/aistudio/After_My_Contribution_3_40020577.png",
        title: "Faecal Sludge Treatment Plant (FSTP) Profile",
        caption:
          "Facility record structuring administrative ownership, CapEx/OpEx budgets, design vs. actual treatment capacity, and effluent compliance metrics.",
      },
      {
        src: "/assets/aistudio/After_My_Contribution_4_d47f2cc2.png",
        title: "Interactive Multi-Dataset Charts",
        caption:
          "Configurable stacked bar analysis comparing containment outlets by tubewell distance, complete with instant PNG and XLS report exports.",
      },
      {
        src: "/assets/aistudio/IMIS_Integration_4ebeee5d.png",
        title: "IMIS Cities CWIS Dashboard Integration",
        caption:
          "Live municipal integration visualizing 22 Citywide Inclusive Sanitation (CWIS) equity and safety indicators connected directly from IMIS.",
        featured: true,
      },
    ],
    deliverables: [
      "Dashboard Redesign",
      "City Profile & Comparison",
      "Survey Workflows",
      "Bilingual UI (Bangla & English)",
      "IMIS Integration UX",
    ],
    processSteps: [
      {
        phase: "01 · Understand",
        title: "Audit & Stakeholder Alignment",
        detail:
          "Review the existing NSD, scoping study, major data modules, current limitations, and stakeholder expectations.",
      },
      {
        phase: "02 · Define",
        title: "Information Architecture & Flows",
        detail:
          "Translate technical and domain requirements into information architecture, priority flows, dashboard modules, and reusable interface patterns.",
      },
      {
        phase: "03 · Design",
        title: "Modules & Bilingual System",
        detail:
          "Create and refine dashboard, city profiles, charts, indicators, survey management, user management, language, and tooltip experiences.",
      },
      {
        phase: "04 · Validate",
        title: "Multidisciplinary Iteration",
        detail:
          "Review designs with multidisciplinary teams and stakeholder representatives, then iterate with developers based on feasibility and feedback.",
      },
    ],
    keyDesignAreas: [
      {
        title: "National dashboard",
        detail:
          "High level sanitation performance and summary views designed for quick scanning.",
      },
      {
        title: "City profile",
        detail:
          "Municipal information, infrastructure, indicators, and contextual sanitation data in one structured place.",
      },
      {
        title: "City comparison",
        detail:
          "Side by side review of sanitation indicators, infrastructure, capacity, and related city information.",
      },
      {
        title: "Charts and exports",
        detail:
          "Interactive visualizations with export options for deeper analysis and reporting.",
      },
      {
        title: "Survey management",
        detail:
          "Projects, surveys, questionnaires, monitoring, and collected survey data within a connected workflow.",
      },
      {
        title: "Multilevel access",
        detail:
          "User registration, access requests, administrative approval, roles, and permission based views.",
      },
      {
        title: "Bangla and English",
        detail:
          "A language switch that improves access for local stakeholders while preserving technical consistency.",
      },
      {
        title: "Information tooltips",
        detail:
          "Contextual explanations for technical terms, abbreviations, indicators, and formulas.",
      },
    ],
    keyDesignAreasVisual: {
      src: "/assets/aistudio/After_Key_Design_Areas_b5ac0ec0.png",
      title: "Unified Multi-Module Interface System",
      caption:
        "Coordinated visual language spanning national GIS indicator mapping, city profiles, comparative analytics, FSTP monitoring, and desktop portal entry.",
    },
    beforeAfter: [
      {
        before: "Static and limited dataset views",
        after: "Visualization across different cities, datasets, and years",
      },
      {
        before: "No direct city comparison",
        after: "Side by side city comparison",
      },
      {
        before: "English only experience",
        after: "Bangla and English interface",
      },
      {
        before: "Limited survey workflow support",
        after: "Project, survey, questionnaire, and monitoring workflows",
      },
      {
        before: "Limited access management",
        after: "Multilevel user and permission management",
      },
    ],
    scaleIntro:
      "The product moved from a comparatively static information dashboard toward a broader sanitation data environment with stronger workflows, access management, comparison, visualization, and interoperability.",
    scaleMetrics: [
      { value: "80+", label: "Paurashavas in Phase II data scope" },
      { value: "73", label: "Received city datasets integrated in Phase II" },
      { value: "22", label: "CWIS indicators connected from IMIS" },
      { value: "12+", label: "Organizations represented in product requirements" },
    ],
    outcome:
      "Expanded from a static reporting tool into a national bilingual sanitation platform spanning 126+ towns, 80+ Phase II Paurashavas, 73 integrated city datasets, and 22 live IMIS CWIS indicators.",
    reflection:
      "Working on the National Sanitation Dashboard required me to think beyond individual screens. I had to understand how public sector users read dense data, how different organizations describe the same sanitation problems, and how design choices can make technical information easier to compare and act on.",
  },
  {
    id: "pico",
    title: "Pico",
    subtitle: "Audio · Industrial",
    category: "Industrial",
    year: "2024",
    timeline: "12 Weeks · 2024",
    client: "Modular Audio Co.",
    role: "Industrial & UI Designer",
    image: designPicoImg,
    summary:
      "A pocket-sized modular synthesizer and field speaker uniting knurled aluminum tactile dials with a high-contrast monochrome OLED patch matrix.",
    challenge:
      "Portable synthesizers often cram deep menu trees behind tiny membranes, breaking creative flow while sketching melodies on the move.",
    approach:
      "Dedicated one physical coral-anodized encoder per core synth parameter and paired it with crisp typographic OLED feedback.",
    deliverables: [
      "CAD Enclosure Studies",
      "Embedded OLED UI",
      "Tactile Control Language",
      "Packaging",
    ],
    outcome: "Funded 420% on launch week and featured in Wallpaper* Design Awards shortlist.",
    metrics: [
      { value: "420%", label: "Crowdfunding goal reached in week one" },
      { value: "1:1", label: "Direct knob-to-parameter ratio for core synth engine" },
      { value: "148g", label: "CNC-milled anodized aluminum body weight" },
    ],
    researchInsights: [
      "Musicians sketching on trains and flights abandoned devices that required more than two button chords to adjust filter cutoff or envelope decay.",
      "High-contrast 1-bit OLED typography stayed legible in direct outdoor sunlight where glossy color touchscreens washed out.",
      "Distinct knurling profiles on encoders let players identify cutoff vs. resonance strictly by thumb texture.",
    ],
    processSteps: [
      {
        phase: "01 · Discover",
        title: "Studio & transit jamming observations",
        detail:
          "Shadowed 14 electronic producers and sound designers testing portable grooveboxes in cafes, flights, and home studios.",
      },
      {
        phase: "02 · Define",
        title: "One-knob-per-function physical map",
        detail:
          "Prioritized the 5 parameters musicians modulate live 90% of the time and promoted them to dedicated coral-anodized dials.",
      },
      {
        phase: "03 · Prototype",
        title: "128×64 OLED pixel grid & tactile detents",
        detail:
          "Designed a custom bitmap font and animated waveform visualizer synchronized at 60Hz with encoder rotation detents.",
      },
      {
        phase: "04 · Ship",
        title: "DFM tolerances & collector packaging",
        detail:
          "Partnered with Shenzhen CNC machinists on bead-blast finish specs, speaker grille perforation acoustics, and molded pulp packaging.",
      },
    ],
    keyDecisions: [
      {
        title: "Coral-anodized encoders against raw bead-blasted aluminum",
        rationale:
          "Color-coding live performance controls separated modulation dials from utility transport switches at a single glance on dimly lit stages.",
      },
      {
        title: "Monochrome bitmap OLED instead of full-color LCD",
        rationale:
          "Doubled battery life to 14 hours while delivering instant-response waveform rendering with zero backlight bleed.",
      },
    ],
    reflection:
      "Hardware UI lives in the millimeter between finger resistance and pixel feedback. Prototyping both the encoder torque and the OLED micro-animations together unlocked a playful instrument feel.",
  },
  {
    id: "oral-lab",
    title: "Oral Lab",
    subtitle: "Health · Strategy",
    category: "Strategy",
    year: "2023",
    timeline: "14 Weeks · 2023",
    client: "Ora Healthcare",
    role: "Product Strategy & Brand",
    image: designOralLabImg,
    summary:
      "Reimagining daily preventative oral care through refillable aluminum hardware, sculptural ceramic docks, and zero-plastic embossed packaging.",
    challenge:
      "Clinical oral care brands felt sterile and disposable, while eco-friendly alternatives sacrificed ergonomic precision and battery longevity.",
    approach:
      "Positioned the brush as a permanent bathroom object through calm stone tones, magnetic dock geometry, and subscription refill choreography.",
    deliverables: [
      "Brand Positioning",
      "Industrial Form Direction",
      "Refill Commerce UX",
      "Packaging System",
    ],
    outcome: "Reduced packaging plastics by 94% and lifted subscription renewal rate by 38%.",
    metrics: [
      { value: "-94%", label: "Reduction in single-use packaging plastics" },
      { value: "+38%", label: "Lift in quarterly brush-head refill renewals" },
      { value: "45 days", label: "Single-charge battery life with magnetic dock" },
    ],
    researchInsights: [
      "Most consumers hid plastic electric brushes inside cabinets because cluttered charging bases clashed with calm bathroom surfaces.",
      "Refill churn spiked when customers forgot to swap worn brush heads—a subtle color-fade bristle cue outperformed push notifications.",
      "Unpacking molded fiber trays with blind debossing signaled tactile quality without glossy laminated boxes.",
    ],
    processSteps: [
      {
        phase: "01 · Discover",
        title: "Bathroom ritual ethnography & category audit",
        detail:
          "Benchmarked 30+ clinical and sustainable oral care lines to uncover whitespace between pharmacy aesthetics and architectural homeware.",
      },
      {
        phase: "02 · Define",
        title: "Permanent object + effortless refill strategy",
        detail:
          "Framed the handle as a 5-year heirloom aluminum tool supported by a 2-tap SMS and web refill cadence.",
      },
      {
        phase: "03 · Prototype",
        title: "Ergonomic grip angles & zero-plastic mailers",
        detail:
          "Tested 8 handle tapers for wet-hand grip stability and engineered a letterbox-ready compostable refill carton.",
      },
      {
        phase: "04 · Ship",
        title: "Direct-to-consumer store & unboxing system",
        detail:
          "Launched the modular storefront, refill cadence dashboard, and tactile packaging suite across Singapore and Australia.",
      },
    ],
    keyDecisions: [
      {
        title: "Weighted stoneware dock with concealed USB-C channel",
        rationale:
          "Kept the brush upright and hygienic on narrow sink ledges while eliminating tangled countertop cables.",
      },
      {
        title: "Pause-or-skip refill controls in one tap without login friction",
        rationale:
          "Giving subscribers effortless control built trust and reduced cancellation rates dramatically after month three.",
      },
    ],
    reflection:
      "Sustainability only sticks when the sustainable choice feels unmistakably better to hold, display, and reorder than the disposable incumbent.",
  },
  {
    id: "after-eight",
    title: "After Eight",
    subtitle: "Objects · Art direction",
    category: "Industrial",
    year: "2023",
    timeline: "10 Weeks · 2023",
    client: "Studio Monograph",
    role: "Creative & Object Direction",
    image: designAfterEightImg,
    wide: true,
    summary:
      "A limited collection of quiet architectural desk objects—cantilever task lamp, glazed stoneware vessel, and arched brass clock—built for late evening focus.",
    challenge:
      "Home workspaces often borrow harsh corporate task lighting and generic plastic accessories that feel out of place after sunset.",
    approach:
      "Designed warm-spectrum shadow-casting forms in powder-coated steel, raw plaster, and cobalt glaze photographed under natural afternoon light.",
    deliverables: [
      "Object Collection",
      "Material Palette",
      "Editorial Art Direction",
      "Exhibition Catalogue",
    ],
    outcome: "First edition of 300 numbered sets sold out in 11 days across Tokyo and Singapore.",
    metrics: [
      { value: "11 Days", label: "Complete sell-out of 300 numbered edition sets" },
      { value: "2700K", label: "Warm glare-free cantilever illumination spectrum" },
      { value: "3 Objects", label: "Coordinated lamp, vessel, and analog desk clock" },
    ],
    researchInsights: [
      "Designers and writers working after 8 PM preferred warm localized pools of light over overhead room illumination.",
      "Analog timepieces without ticking hands anchored deep-focus sessions without pulling attention toward phone lock screens.",
      "Pairing matte architectural steel with hand-thrown stoneware introduced warmth that softened aluminum laptops and monitors.",
    ],
    processSteps: [
      {
        phase: "01 · Discover",
        title: "After-hours studio lighting studies",
        detail:
          "Documented how shadows fall across timber and travertine desks between dusk and midnight to calibrate shade geometry.",
      },
      {
        phase: "02 · Define",
        title: "Quiet architectural material trio",
        detail:
          "Limited the entire collection to folded satin-black steel, unglazed stoneware with cobalt dip, and brushed brass.",
      },
      {
        phase: "03 · Prototype",
        title: "Counterweight balance & dimmer feel",
        detail:
          "Iterated cantilever balance tolerances and rotary brass dimmer resistance with local metalworkers and ceramicists.",
      },
      {
        phase: "04 · Ship",
        title: "Exhibition art direction & numbered catalogue",
        detail:
          "Directed the campaign stills, print monograph, and physical showcase installations in Singapore and Tokyo.",
      },
    ],
    keyDecisions: [
      {
        title: "Concealed warm-dim LED strip with weighted brass dimmer",
        rationale:
          "Eliminated exposed bulb glare from seated eye level while turning brightness adjustment into a satisfying evening ritual.",
      },
      {
        title: "Unified footprint proportions across all three objects",
        rationale:
          "Shared radiuses and vertical rhythms allow the lamp, vessel, and clock to compose cleanly on compact urban desks.",
      },
    ],
    reflection:
      "Directing both the physical object proportions and the editorial photography let the collection speak with one quiet, cohesive voice from sketch to shelf.",
  },
];

export const PHOTO_ITEMS: PhotoItem[] = [
  {
    id: "midnight-riders",
    title: "Midnight Riders",
    genre: "Street",
    location: "Saigon",
    year: "2024",
    image: photoMidnightRidersImg,
    wide: true,
    camera: "Leica M6",
    lens: "35mm Summicron",
    settings: "f/2.0 · 1/60s · ISO 800",
    story:
      "Captured just after a monsoon downpour in District 4 as late-night noodle stalls lit the wet asphalt in amber and tail-light crimson.",
  },
  {
    id: "last-green",
    title: "Last Green",
    genre: "Documentary",
    location: "Seoul",
    year: "2023",
    image: photoLastGreenImg,
    camera: "Leica Q2",
    lens: "28mm Summilux",
    settings: "f/1.7 · 1/125s · ISO 1600",
    story:
      "A quiet pause beneath a flickering emerald restaurant awning in Euljiro as blue hour settled over concrete alleyways.",
  },
  {
    id: "two-strangers",
    title: "Two Strangers",
    genre: "Travel",
    location: "Phnom Penh",
    year: "2024",
    image: photoTwoStrangersImg,
    camera: "Leica M6",
    lens: "35mm Summicron",
    settings: "f/8.0 · 1/500s · ISO 400",
    story:
      "Late afternoon sunlight sliced diagonally across an ochre shophouse corner, briefly uniting two passersby walking in opposite directions.",
  },
  {
    id: "passing-through",
    title: "Passing Through",
    genre: "Street",
    location: "Hong Kong",
    year: "2023",
    image: photoPassingThroughImg,
    wide: true,
    camera: "Leica M6",
    lens: "35mm Summicron",
    settings: "f/2.8 · 1/30s · ISO 800",
    story:
      "Standing at the edge of Wan Chai tramway at dusk, letting the double-decker green tram streak softly beneath lingering neon signage.",
  },
];

export const EXPERIENCE_LIST: ExperienceItem[] = [
  {
    period: "2022–NOW",
    role: "Independent Product Designer & Photographer",
    place: "Singapore · Global",
    discipline: "Design",
    detail: "Partnering with hardware, health, and creative software teams from zero-to-one strategy through shipped interfaces.",
  },
  {
    period: "2024",
    role: "Monsoon Light — Solo Zine & Print Show",
    place: "Deck, Singapore",
    discipline: "Photography",
    detail: "36-plate 35mm documentary series exploring nocturnal Southeast Asian street geometry and rain reflections.",
  },
  {
    period: "2019–2022",
    role: "Staff Product Designer",
    place: "Atelier Digital",
    discipline: "Design",
    detail: "Led consumer hardware companion apps and cross-platform design systems serving 2M+ monthly active users.",
  },
  {
    period: "2021",
    role: "Asian Street Collective — Group Exhibition",
    place: "Seoul & Hong Kong",
    discipline: "Photography",
    detail: "Curated street color studies alongside seven documentary photographers across East and Southeast Asia.",
  },
];
