import designMoriImg from "../assets/images/design_mori_1794924578424.jpg";
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
export type PhotoLocation = "All" | "Saigon" | "Seoul" | "Phnom Penh" | "Hong Kong";

export interface DesignProject {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<DesignCategory, "All">;
  year: string;
  client: string;
  role: string;
  image: string;
  wide?: boolean;
  summary: string;
  challenge: string;
  approach: string;
  deliverables: string[];
  outcome: string;
}

export interface PhotoItem {
  id: string;
  title: string;
  location: Exclude<PhotoLocation, "All">;
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

export const PHOTO_LOCATIONS: PhotoLocation[] = [
  "All",
  "Saigon",
  "Seoul",
  "Phnom Penh",
  "Hong Kong",
];

export const DESIGN_PROJECTS: DesignProject[] = [
  {
    id: "mori",
    title: "Mori",
    subtitle: "Wellness · Product",
    category: "Product",
    year: "2024",
    client: "Mori Labs",
    role: "Lead Product Designer",
    image: designMoriImg,
    wide: true,
    summary:
      "A calm bedside hardware companion and companion mobile experience designed to replace anxious morning phone checks with gentle light and breath cues.",
    challenge:
      "Most sleep trackers flood users with anxiety-inducing readiness scores first thing in the morning, turning rest into another performance metric.",
    approach:
      "Paired a matte-ceramic tactile pebble with a minimal mobile timeline that surfaces trends weekly rather than grading every night.",
    deliverables: [
      "Hardware Interaction Spec",
      "iOS Companion App",
      "Design System",
      "Prototyping",
    ],
    outcome: "4.9 App Store rating across 18,000+ early adopters with 72% 90-day retention.",
  },
  {
    id: "pico",
    title: "Pico",
    subtitle: "Audio · Industrial",
    category: "Industrial",
    year: "2024",
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
  },
  {
    id: "oral-lab",
    title: "Oral Lab",
    subtitle: "Health · Strategy",
    category: "Strategy",
    year: "2023",
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
  },
  {
    id: "after-eight",
    title: "After Eight",
    subtitle: "Objects · Art direction",
    category: "Industrial",
    year: "2023",
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
  },
];

export const PHOTO_ITEMS: PhotoItem[] = [
  {
    id: "midnight-riders",
    title: "Midnight Riders",
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
