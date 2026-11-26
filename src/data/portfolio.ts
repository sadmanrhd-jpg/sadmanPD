import bikeLagbeCoverImg from "../assets/images/bike_lagbe_cover_canvas_1795516678052.jpg";

export type World = "design" | "photo";
export type View = "home" | "design" | "photo" | "blog" | "about";
export type DesignCategory =
  | "All"
  | "GovTech"
  | "Digital Health"
  | "Fintech"
  | "Transit"
  | "E-Commerce"
  | "Editorial";
export type PhotoGenre =
  | "All"
  | "People"
  | "Concert"
  | "Conceptual"
  | "Still Life"
  | "Animal Kingdom"
  | "Documentary";
export type SocialPlatform =
  | "behance"
  | "linkedin"
  | "facebook"
  | "youtube"
  | "flickr";

export interface SocialLink {
  id: SocialPlatform;
  label: string;
  href: string;
  handle: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "behance",
    label: "Behance",
    href: "https://www.behance.net/sadmanrahman2",
    handle: "behance.net/sadmanrahman2",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sadmanrahmand/",
    handle: "in/sadmanrahmand",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/sdhruba",
    handle: "facebook.com/sdhruba",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@thetechytrippers3410",
    handle: "@thetechytrippers3410",
  },
  {
    id: "flickr",
    label: "Flickr",
    href: "https://www.flickr.com/photos/137565099@N07/",
    handle: "Flickr Photostream",
  },
];

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
  scrollable?: boolean;
}

export interface CaseStudyVideo {
  src: string;
  poster?: string;
  title: string;
  caption: string;
}

export interface CaseStudyComparisonRow {
  before: string;
  after: string;
}

export interface MobileShowcaseGroup {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  companionNote?: {
    label: string;
    title: string;
    detail: string;
  };
  screens: CaseStudyVisual[];
}

export interface MobileShowcaseBlock {
  eyebrow: string;
  heading: string;
  note?: string;
  variant?: "strip" | "device-mockup";
  screens: CaseStudyVisual[];
  groups?: MobileShowcaseGroup[];
}

export interface EditorialPageItem {
  src: string;
  title: string;
}

export interface EditorialDocumentBlock {
  pdfUrl: string;
  pdfLabel: string;
  formatLabel: string;
  spreadPreviewSrc?: string;
  pages: EditorialPageItem[];
}

export interface PosterStudyItem {
  src: string;
  title: string;
  subtitle?: string;
  width: number;
  height: number;
}

export interface PosterGalleryBlock {
  collectionNote: string;
  purchaseHeading: string;
  purchaseNote: string;
  coverPreviewSrcs: string[];
  items: PosterStudyItem[];
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
  heroSurface?:
    | "transparent"
    | "blend-canvas"
    | "soft-feather"
    | "screen-frame"
    | "canvas-frame";
  wide?: boolean;
  summary: string;
  overview?: string;
  quote?: string;
  overviewVisual?: CaseStudyVisual;
  overviewVideo?: CaseStudyVideo;
  challenge: string;
  challengeIntro?: string;
  challengePoints?: CaseStudyFeatureItem[];
  challengeVisual?: CaseStudyVisual;
  backgroundIntro?: string;
  backgroundMilestones?: CaseStudyMilestone[];
  mobileShowcase?: MobileShowcaseBlock;
  contributionsIntro?: string;
  contributions?: CaseStudyFeatureItem[];
  contributionGalleryHeading?: string;
  contributionGallery?: CaseStudyVisual[];
  approach: string;
  deliverables: string[];
  outcome: string;
  metrics?: CaseStudyMetric[];
  researchInsights?: string[];
  processHeading?: string;
  processNavLabel?: string;
  processEyebrow?: string;
  processIntro?: string;
  processVisual?: CaseStudyVisual;
  processVisuals?: CaseStudyVisual[];
  processSteps?: CaseStudyProcessStep[];
  keyDesignAreasHeading?: string;
  keyDesignAreasSubheading?: string;
  keyDesignAreasNavLabel?: string;
  keyDesignAreasIntro?: string;
  keyDesignAreas?: CaseStudyFeatureItem[];
  keyDesignAreasIntroVisual?: CaseStudyVisual;
  keyDesignAreasIntroVisuals?: CaseStudyVisual[];
  keyDesignAreasVisual?: CaseStudyVisual;
  beforeAfter?: CaseStudyComparisonRow[];
  outcomesNavLabel?: string;
  scaleIntro?: string;
  scaleMetrics?: CaseStudyMetric[];
  outcomeVisual?: CaseStudyVisual;
  keyDecisions?: CaseStudyDecision[];
  reflection?: string;
  editorialDocument?: EditorialDocumentBlock;
  posterGallery?: PosterGalleryBlock;
}

export interface PhotoItem {
  id: string;
  title: string;
  genre: Exclude<PhotoGenre, "All">;
  location: string;
  year: string;
  image: string;
  width?: number;
  height?: number;
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
  "GovTech",
  "Digital Health",
  "Fintech",
  "Transit",
  "E-Commerce",
  "Editorial",
];

export const PHOTO_GENRES: PhotoGenre[] = [
  "All",
  "People",
  "Concert",
  "Conceptual",
  "Still Life",
  "Animal Kingdom",
  "Documentary",
];

export const DESIGN_PROJECTS: DesignProject[] = [
  {
    id: "nsd",
    title: "National Sanitation Dashboard (NSD)",
    subtitle: "GovTech · Data Platform",
    category: "GovTech",
    year: "2024",
    timeline: "2020-2024 · Phase II Upscaling",
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
      "The National Sanitation Dashboard is a government digital platform for sanitation planning, monitoring, and evidence based decision making.\n\nThe upscaling work expanded the product with stronger visualization, survey management, multilingual access, city comparison, user management, and integration with municipal data systems.",
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
    backgroundIntro: "How the dashboard scaled into a national platform.",
    backgroundMilestones: [
      {
        tag: "2020",
        title: "Original dashboard",
        detail: "Launched with national, city, chart, and indicator survey views.",
      },
      {
        tag: "61 cities",
        title: "Existing coverage",
        detail: "Covered sanitation, solid waste, drainage, and SFD data for 61 cities.",
      },
      {
        tag: "2024",
        title: "Integrative upscaling",
        detail: "Redesigned for usability, scalability, data workflows, and integration.",
      },
      {
        tag: "Phase II",
        title: "80+ Paurashavas",
        detail: "Expanding standardized municipal data, interoperability, and adoption.",
      },
    ],
    challenge:
      "Three core gaps shaped the upscaling redesign: fragmented sanitation data, static manual workflows, and limited accessibility and analysis.",
    challengeIntro: "Three core gaps shaped the upscaling redesign.",
    challengePoints: [
      {
        title: "Fragmented sanitation data",
        detail: "Inconsistent survey and municipal data structures made city comparisons difficult.",
      },
      {
        title: "Static and manual workflows",
        detail: "Adding cities relied on static files and manual updates instead of scalable workflows.",
      },
      {
        title: "Limited accessibility and analysis",
        detail: "Users needed clearer hierarchy, city comparison, Bangla access, and guided charts.",
      },
    ],
    challengeVisual: {
      src: "/assets/aistudio/Screenshot_2026-11-23_at_1.08.48_PM_c7ef561d.png",
      title: "Initial Architecture Planning",
      caption:
        "An early architecture map outlining how national views, city profiles, surveys, permissions, and bilingual access would connect into one system.",
    },
    mobileShowcase: {
      eyebrow: "Mobile View",
      heading: "Mobile Experience",
      note: "Responsive mobile views enabling municipal officers and planners to inspect sanitation profiles, SFD diagrams, and field surveys on smartphones.",
      variant: "device-mockup",
      screens: [
        {
          src: "/assets/aistudio/IMG_20261123_105706_267e9092.jpg",
          title: "Mobile Homepage",
          caption: "135 municipalities & 10+ surveys at a glance.",
        },
        {
          src: "/assets/aistudio/IMG_20261123_105236_1862ed46.jpg",
          title: "Shit Flow Diagram (SFD)",
          caption: "City SFD filters with instant PNG export.",
        },
        {
          src: "/assets/aistudio/IMG_20261123_105859_02e15d27.jpg",
          title: "News & Updates",
          caption: "Sector news and clean-water briefings.",
        },
        {
          src: "/assets/aistudio/IMG_20261123_105745_7ed778d7.jpg",
          title: "IMIS Survey Records",
          caption: "Filter published municipal survey records.",
        },
        {
          src: "/assets/aistudio/IMG_20261123_105800_15aee670.jpg",
          title: "Survey Management",
          caption: "Filter or add national surveys in the field.",
        },
      ],
    },
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
    contributionGalleryHeading: "Selected Interfaces & IMIS Integration",
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
        src: "/assets/aistudio/Screenshot_2026-11-22_at_5.40.28_PM_eef5495e.png",
        title: "National Indicators Map View",
        caption:
          "Geospatial indicator explorer plotting nationwide CWIS, Solid Waste Management, and SDG 6.2 metrics across Bangladesh municipalities with year filtering and Chart/Map switching.",
      },
      {
        src: "/assets/aistudio/Screenshot_2026-11-22_at_5.40.43_PM_441f0c19.png",
        title: "Administrative Modules Hub",
        caption:
          "Centralized operational hub uniting user permissions, project and survey management, KII questionnaires, IMIS data sync, and city profile administration.",
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
    processVisual: {
      src: "/assets/aistudio/Monochrome_four_stage_UX_workflow_sketch__1__7ad11798.png",
      title: "Four-Stage UX Workflow",
      caption:
        "From scoping audit and information architecture to bilingual modules and multidisciplinary validation.",
    },
    processSteps: [
      {
        phase: "Understand",
        title: "Audit & Stakeholder Alignment",
        detail:
          "Review the existing NSD, scoping study, major data modules, current limitations, and stakeholder expectations.",
      },
      {
        phase: "Define",
        title: "Information Architecture & Flows",
        detail:
          "Translate technical and domain requirements into information architecture, priority flows, dashboard modules, and reusable interface patterns.",
      },
      {
        phase: "Design",
        title: "Modules & Bilingual System",
        detail:
          "Create and refine dashboard, city profiles, charts, indicators, survey management, user management, language, and tooltip experiences.",
      },
      {
        phase: "Validate",
        title: "Multidisciplinary Iteration",
        detail:
          "Review designs with multidisciplinary teams and stakeholder representatives, then iterate with developers based on feasibility and feedback.",
      },
    ],
    keyDesignAreasIntroVisuals: [
      {
        src: "/assets/aistudio/file_00000000773c82119a2a06f5e6c71e56_9e072890.png",
        title: "Core Platform Workflows",
        caption:
          "How city comparison, survey planning, role-based access, and contextual bilingual guidance fit together.",
      },
      {
        src: "/assets/aistudio/Sanitation_dashboard_UX_brainstorm_d3f413ab.png",
        title: "UX Brainstorm & Module Mapping",
        caption:
          "Early brainstorm connecting NSD modules around summary-first scanning, shared indicators, tooltips, and role-based workflows.",
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
      "Working on the National Sanitation Dashboard required me to think beyond individual screens.\n\nI had to understand how public sector users read dense data, how different organizations describe the same sanitation problems, and how design choices can make technical information easier to compare and act on.",
  },
  {
    id: "plis",
    title: "Planning Information System (PLIS)",
    subtitle: "GovTech · GIS Platform",
    category: "GovTech",
    year: "2022",
    timeline: "2022 · Bangladesh Planning Commission",
    client: "Planning Commission, GoB",
    partner: "GIZ",
    budget: "180K USD",
    role: "Product Designer · UX Researcher · Trainer",
    liveUrl: "http://118.179.197.118:84/",
    liveUrlLabel: "PLIS",
    image: "/assets/aistudio/plis-project-hero_5e2c9844.png",
    imageFit: "contain",
    summary:
      "GIS based decision support platform that helps government analyze spatial data, manage climate challenges and make informed decisions.",
    overview:
      "Developed as part of GIZ's Adaptation to Climate Change into the National and Local Development Planning II (ACCNLDP II) project, the Planning Information System (PLIS) is a GIS-based decision support platform built for the Programming Division of the Bangladesh Planning Commission. It enables officials across Sector Divisions and government agencies to bring climate risk and spatial data directly into national and local development planning, project formulation, and appraisal.",
    quote:
      "Strengthening the climate resilience of public investments starts with listening to the officers who appraise them. Every layer, checklist, and spatial summary in PLIS was designed around how Bangladesh Planning Commission officials actually evaluate projects.",
    metrics: [
      { value: "40+", label: "Planning Commission officers interviewed in needs assessment" },
      { value: "6", label: "Thematic GIS & NAP (2023-2050) spatial layer groups integrated" },
      { value: "100 yr", label: "Flood & cyclone return-period risk horizons modeled per site" },
      { value: "180K", label: "USD initiative under GIZ's ACCNLDP II climate adaptation program" },
    ],
    overviewVisual: {
      src: "/assets/aistudio/1_0ea294f1.PNG",
      title: "Interactive GIS Spatial Analysis & Multi-Layer Climate Workspace",
      caption:
        "Officials evaluate proposed project boundaries against water resources, soil conditions, RAJUK Detail Area Plans, 25- and 100-year flood and cyclone return periods, and NAP (2023-2050) climate stress layers.",
    },
    challenge:
      "PLIS required turning complex planning data and GIS workflows into a simpler experience for government users across Sector Divisions and executing agencies.",
    challengeIntro:
      "PLIS required turning complex planning data and GIS workflows into a simpler experience for government users, informed by interviews with over 40 Bangladesh Planning Commission officers.",
    challengePoints: [
      {
        title: "Complex GIS Information",
        detail:
          "Large volumes of spatial datasets, including flood return periods, Ecological Critical Areas, and Detail Area Plans, needed a clearer way to explore without desktop GIS expertise.",
      },
      {
        title: "Multiple Stakeholder Needs",
        detail:
          "Different Sector Divisions of the Bangladesh Planning Commission and executing agencies required distinct workflows and decision-ready information.",
      },
      {
        title: "Decision Making Complexity",
        detail:
          "Static documents left officers without a clear connection between geographic risk data and everyday project formulation and appraisal decisions.",
      },
    ],
    challengeVisual: {
      src: "/assets/aistudio/PLIS_needs_assessment_field_notes_eb5a6400.png",
      title: "Needs Assessment Field Notes (40+ Officers)",
      caption:
        "Before designing a single screen, we sat down with over 40 Bangladesh Planning Commission officers to map current project workflows, approval paths, and pre-approval checks. Listening first ensured PLIS fits real decision making.",
    },
    contributionsIntro:
      "From a 40+ officer needs assessment at the Bangladesh Planning Commission to spatial interface design and hands-on training.",
    contributionGalleryHeading: "Selected Interfaces & Spatial Appraisal Flows",
    contributionGallery: [
      {
        src: "/assets/aistudio/Screenshot_2026-11-24_at_12.05.29_PM_96f48b28.png",
        title: "All Projects Registry & Spatial Upload Hub",
        caption:
          "Central workspace for ministries and agencies to register projects, upload spatial boundaries, open map evaluations, and download appraisal PDF reports.",
      },
      {
        src: "/assets/aistudio/Screenshot_2026-11-24_at_11.49.35_AM_85e14900.png",
        title: "Climate Check Method Questionnaire (Bangla)",
        caption:
          "Structured Bangla appraisal checklist (CCMQ) guiding officers through land use, soil degradation, and downstream environmental checks with reviewer notes.",
      },
      {
        src: "/assets/aistudio/5_64643c57.PNG",
        title: "Ecological Critical Area (ECA): 4.59% Buriganga River Overlap",
        caption:
          "Automated spatial intersection surfacing exact overlap percentages with protected ecological corridors alongside a zoomed map of the proposed project polygon.",
      },
      {
        src: "/assets/aistudio/7_f3e304f6.PNG",
        title: "Detail Area Plan (RAJUK DAP): 98.23% Flood Flow Zone Check",
        caption:
          "Instant land-use verification flagging when a proposed project site sits inside Flood Flow Zones or protected waterbodies prior to approval.",
      },
      {
        src: "/assets/aistudio/9_83c4ecb5.PNG",
        title: "Climate Stress Area: 100% Severe Flood Exposure Analysis",
        caption:
          "Automated vulnerability screening quantifying exposure to Severe Flood and NAP climate stress zones so appraisal teams can mandate resilient adjustments.",
      },
    ],
    contributions: [
      {
        num: "01",
        title: "Simplifying GIS Exploration",
        detail:
          "Designed clearer map views, information hierarchy, and data interaction patterns across water, soil, land-use, return-period, and NAP climate stress layers.",
      },
      {
        num: "02",
        title: "Understanding User Workflows",
        detail:
          "Interviewed over 40 Bangladesh Planning Commission officers and translated real pre-approval checks and stakeholder requirements into practical digital experiences.",
      },
      {
        num: "03",
        title: "Supporting Multiple Divisions",
        detail:
          "Created flexible structures for broader Planning Commission workflows by combining automated ECA, Detail Area Plan, and Climate Stress screening with the Bangla Climate Check questionnaire.",
      },
      {
        num: "04",
        title: "Improving Usability & Training",
        detail:
          "Validated flows through usability testing and delivered hands-on trainings across 4 days for 60+ users from government agencies and the Bangladesh Planning Commission.",
      },
    ],
    approach:
      "Grounded every interface decision in direct interviews with 40+ Bangladesh Planning Commission officers, turning complex multi-layer GIS climate risk data into clear, repeatable project appraisal checks.",
    deliverables: [
      "Needs Assessment (40+ Officers)",
      "GIS Decision Support UX",
      "Climate Risk Screening Flows",
      "Bangla Appraisal Checklists",
      "Usability Testing & 4-Day Training (60+ Users)",
    ],
    processVisuals: [
      {
        src: "/assets/aistudio/Minimal_cleanup_of_PLIS_sketch_headings-5_21e6bcbb.png",
        title: "Preparing the Project Area & Choosing Spatial Evidence",
        caption:
          "Early UX concept mapping how officers upload KML/SHP project boundaries, verify geometry, select relevant climate and planning layers with synced legends, and run one-click overlap analysis across water, planning, and flood exposure.",
      },
      {
        src: "/assets/aistudio/Flood_scenario_planning_sketch-3_f3999176.png",
        title: "Flood Scenario Comparison & Infrastructure Risk Thinking",
        caption:
          "Comparing 25-year (4% annual chance) and 100-year (1% annual chance) flood extents on the same project boundary with consistent legends. Framing return periods as probabilities helps guide critical infrastructure and adaptation checks.",
      },
      {
        src: "/assets/aistudio/Climate_check_and_map_report_sketch-4_fe01ad91.png",
        title: "Climate Check Questionnaire & Unified Appraisal Report",
        caption:
          "Designing generous space for long Climate Check questions and reviewer rationales alongside ECA, Detailed Area Plan, and flood overlap maps, source metadata, and PDF preview before officer submission.",
      },
    ],
    processSteps: [
      {
        phase: "01 · Listen",
        title: "Discovery Across Commission Wings",
        detail:
          "Documented how project proposals move through Bangladesh Planning Commission Sector Divisions, where approvals stall, and which verification checks happen before sign-off.",
      },
      {
        phase: "02 · Synthesize",
        title: "Mapping the End-to-End Appraisal Sequence",
        detail:
          "Structured the review journey from project registration and KML/SHP boundary upload through multi-layer risk intersection and Bangla Climate Check responses.",
      },
      {
        phase: "03 · Design",
        title: "Interactive Spatial & Report Prototyping",
        detail:
          "Iterated on grouped GIS layer controls, dynamic legends, one-click overlap calculation, and paired percentage tables with zoomed site maps.",
      },
      {
        phase: "04 · Validate",
        title: "Usability Testing & 4-Day Rollout",
        detail:
          "Partnered with GIZ's ACCNLDP II team and Programming Division stakeholders to run usability testing, refine edge cases, and onboard 60+ agency and Planning Commission users over 4 days.",
      },
    ],
    keyDesignAreas: [
      {
        title: "Multi-layer GIS risk map",
        detail:
          "Grouped water resources, physical features, soil condition, spatial planning, 25/100-year flood and cyclone horizons, and NAP (2023-2050) stress areas with clear legends and info tooltips.",
      },
      {
        title: "Automated spatial intersection",
        detail:
          "Replaced manual map cross-checking with instant overlap percentages across Ecological Critical Areas, RAJUK Detail Area Plans, and Climate Stress Areas.",
      },
      {
        title: "Bangla Climate Check workflow",
        detail:
          "Embedded the Climate Check Method Questionnaire (CCMQ) in Bangla with structured responses and commentary fields linked directly to each project record.",
      },
      {
        title: "Project registry & PDF reporting",
        detail:
          "Unified ministry and executing agency projects into one searchable workspace with boundary uploads, map inspection, and exportable PDF appraisal summaries.",
      },
    ],
    scaleIntro:
      "As part of GIZ's Adaptation to Climate Change into the National and Local Development Planning II (ACCNLDP II) initiative, the Bangladesh Planning Commission, Ministry of Planning, and the Government of the People's Republic of Bangladesh increasingly use climate risk information during planning and appraisal to strengthen the climate resilience of public investments.",
    scaleMetrics: [
      { value: "40+", label: "Planning Commission officers engaged in discovery & needs assessment" },
      { value: "60+", label: "Government agency & Planning Commission users trained over 4 days" },
      { value: "NAP", label: "2023-2050 climate stress & return-period horizons embedded in review" },
      { value: "GoB", label: "Ministry of Planning & agency adoption under GIZ's ACCNLDP II" },
    ],
    outcomeVisual: {
      src: "/assets/aistudio/plis-research-visual_2500cdf2.png",
      title: "Unified Spatial Appraisal & Multi-Layer Risk Reports",
      caption:
        "Bringing together the core PLIS GIS workspace with automated site-level outputs across Ecological Critical Areas, Road Proximity, Delta Hotspots, 100-Year Flood Return Periods, RAJUK Detail Area Plans, and Climate Stress Areas.",
    },
    outcome:
      "Enabled officials across Sector Divisions of the Bangladesh Planning Commission and government agencies to screen public investment projects against climate and spatial risks during formulation and appraisal, backed by 4 days of hands-on trainings for 60+ users.",
    reflection:
      "Designing PLIS reinforced that climate resilience in public investment is as much a human workflow challenge as a geospatial data challenge.\n\nSpeaking with over 40 Planning Commission officers showed us that the most impactful design decisions respected their real appraisal responsibilities, turning dense climate layers into clear, trustworthy evidence they can act on before approving national projects.",
  },
  {
    id: "whatsapp-anc",
    title: "WhatsApp MCC & PWA (ANC Caregivers)",
    subtitle: "Digital Health · Conversational UX & PWA",
    category: "Digital Health",
    year: "2025",
    timeline: "2025",
    client: "ANC Caregiver Program",
    role: "Product Designer · UX Researcher",
    image: "/assets/aistudio/image_2b6b956e.png",
    imageFit: "contain",
    heroSurface: "blend-canvas",
    summary:
      "Solving silent caregiver drop-off in a WhatsApp Mobile Care Companion (MCC) and introducing a zero-login, voice-first embedded PWA for antenatal danger sign triage.",
    overview:
      "Antenatal care (ANC) caregivers in Bangladesh rely on the WhatsApp Mobile Care Companion (MCC) for timely pregnancy guidance, yet live testing revealed high silent drop-off caused by long response delays, unanswered voice notes, and dense text walls. I redesigned the end-to-end service around a two-tier WhatsApp care model with instant routine answers and warm human nurse handovers, and introduced a lightweight, zero-login embedded PWA featuring “Maa Shohokari,” a 24/7 Bengali voice-first AI triage companion built to bridge maternal emergencies on low-end smartphones.",
    quote:
      "Caregivers do not leave from a lack of interest. Hours of silence, ignored danger-sign voice notes, unannounced calls, and heavy text walls make anxious families feel unheard. Restoring trust begins with clear expectations, voice-first empathy, and an immediate bridge to human care.",
    metrics: [
      { value: "20h 06m", label: "Longest overnight response delay uncovered in live field testing" },
      { value: "< 1.5 MB", label: "Zero-login embedded PWA payload built for rural 2G/3G networks" },
      { value: "< 5 min", label: "Target median nurse response time during staffed hours" },
      { value: "≥ 45%", label: "Target Day 1 first-tap engagement within 60 minutes of welcome" },
    ],
    challenge:
      "Live testing of the WhatsApp Mobile Care Companion exposed severe wait-time gaps, ignored Bengali voice notes, dense text walls, and native WhatsApp interface constraints during acute maternal danger signs.",
    challengeIntro:
      "Real field testing from a live caregiver account uncovered five engagement bottlenecks on WhatsApp, along with the structural limits of plain chat during maternal emergencies.",
    challengePoints: [
      {
        title: "Unclear working hours upfront",
        detail:
          "Registering after 5:00 PM via IVR did not explain that live health staff were off duty, and the WhatsApp welcome gave no expected reply time.",
      },
      {
        title: "20-hour overnight & 3-hour delays",
        detail:
          "An evening question waited 20h 06m and a morning question waited 3h 10m before both arrived together at 1:58 PM, leaving anxious families waiting when they needed help most.",
      },
      {
        title: "Heavy text walls, zero reply cues",
        detail:
          "Tapping an info option sent six dense paragraphs of medical advice the next day, with no quick-reply buttons or gentle prompt inviting a conversation.",
      },
      {
        title: "Unanswered danger-sign voice notes",
        detail:
          "A voice note reporting swollen feet received an unrelated checkup survey, followed two hours later by a generic hospital line with no nurse handover.",
      },
      {
        title: "Unannounced calls & broken callbacks",
        detail:
          "An unexpected call from an unknown number felt like spam and went unanswered; dialing back failed to recognize the caregiver and restarted onboarding from scratch.",
      },
      {
        title: "Native chat limits in emergencies",
        detail:
          "Plain WhatsApp threads cannot render tactile danger-sign cards, persistent audio playback bars, readiness checklists, or one-tap transport and clinic dispatch.",
      },
    ],
    challengeVisual: {
      src: "/assets/aistudio/Hand-drawn_caregiver_support_map-1_7d370003.png",
      title: "Caregiver Support Exploration Map",
      caption:
        "Mapping the core anxieties voiced by families: who is replying, when to expect help, how to respond without typing, what happens after hours, and how voice-first warm handovers restore confidence.",
    },
    mobileShowcase: {
      eyebrow: "High-Fidelity Mobile UI",
      heading: "WhatsApp Handover & Embedded PWA",
      note: "Designed for budget Android screens and outdoor sunlight, pairing a warm human handover inside native WhatsApp with a scrollable, voice-first Maa Shohokari triage screen.",
      variant: "device-mockup",
      screens: [
        {
          src: "/assets/aistudio/image_957b0c59.png",
          title: "The Human Handover Moment (WhatsApp MCC)",
          caption:
            "When a caregiver reports swollen feet, automated surveys pause immediately. A clear join divider introduces health worker Rahima apa, who greets the family with verified 5-month pregnancy context, focused follow-up questions, and direct call or voice options.",
        },
        {
          src: "/assets/aistudio/image_ead2c419.png",
          title: "“Maa Shohokari” Live AI Triage (Embedded PWA)",
          caption:
            "Scroll inside the phone frame to explore the full triage flow: Bangla voice-note transcription, tap-to-listen maternal audio guidance, high-contrast amber pre-eclampsia warning, 48dp+ one-tap CNG transport and government clinic call buttons, and a sticky 16263 emergency hotline bar.",
          scrollable: true,
        },
      ],
    },
    approach:
      "Combined native WhatsApp service improvements (clear hours, instant two-tier routing, and warm nurse handovers) with a zero-login sub-1.5 MB embedded PWA for 24/7 voice-first maternal danger sign triage.",
    deliverables: [
      "WhatsApp UX",
      "Embedded PWA",
    ],
    processVisuals: [
      {
        src: "/assets/aistudio/Caregiver_chat_support_concept_sketch-2_12063e5f.png",
        title: "Two-Tier WhatsApp Service Concept",
        caption:
          "Early service sketch structuring three trust moments inside WhatsApp: setting clear service hours upfront, immediately acknowledging voice notes while pausing routine surveys, and introducing a named health worker with a 15-minute heads-up before calling.",
      },
      {
        src: "/assets/aistudio/Caregiver_support_journey_sketch-3_4b8db6a0.png",
        title: "End-to-End WhatsApp-to-PWA Care Journey",
        caption:
          "Mapping the zero-friction loop from a familiar WhatsApp prompt into the care guide, audio-first danger sign cards and readiness checklist, spoken/typed symptom confirmation, one-tap facility or transport calls, and returning context back to the same chat thread.",
      },
    ],
    processSteps: [
      {
        phase: "01 · Field Audit",
        title: "Live Account & Drop-Off Investigation",
        detail:
          "Tested the live caregiver journey across Days 1 to 3, logging response bottlenecks (20h overnight / 3h daytime), ignored Bengali voice notes, six-paragraph text walls, and callback failures.",
      },
      {
        phase: "02 · Service Design",
        title: "Two-Tier WhatsApp Care Plan",
        detail:
          "Designed Tier 1 automated help (<2s replies, quick buttons, voice option) to absorb routine questions while Tier 2 routes concerns straight to staffed nurses (Sun to Thu, 9 AM to 5 PM) and urgent 16263/999 guidance after hours.",
      },
      {
        phase: "03 · Embedded PWA",
        title: "Zero-Login Active Danger Sign Triage",
        detail:
          "Scoped a single-surface sub-1.5 MB PWA authenticated silently via WhatsApp session token, deliberately cutting passwords, 50 MB Play Store installs, heavy video, and deep navigation menus.",
      },
      {
        phase: "04 · Validation",
        title: "A/B Pilot & Safety-Net Escalation",
        detail:
          "Defined a 200-inquiry A/B pilot testing instant queue receipts and two-button welcomes, alongside automated 30 min to 2 hr WhatsApp safety nudges that escalate stalled families to community health workers.",
      },
    ],
    keyDesignAreas: [
      {
        title: "Two-tier WhatsApp triage",
        detail:
          "Carries pregnancy care selection forward with clear service hours and instant routine tips, while danger-sign text or voice immediately interrupts surveys for nurse review.",
      },
      {
        title: "Human handover with medical memory",
        detail:
          "Names the joining health worker (Rahima apa), reflects verified pregnancy stage from the patient record, and gives parents or elders a direct phone number and microphone option.",
      },
      {
        title: "Zero-login sub-1.5 MB PWA",
        detail:
          "Launches in one tap from WhatsApp via session token using inline vectors and compressed audio. Engineered for entry-level Android storage and intermittent rural 2G/3G data packs.",
      },
      {
        title: "Voice-first “Maa Shohokari” AI",
        detail:
          "Transcribes rural Bengali dialect voice notes 24/7 and pairs warnings with spoken Bangla playback bars so low-literacy caregivers never face reading fatigue.",
      },
      {
        title: "Sunlight-ready emergency mobilization",
        detail:
          "Uses high-contrast amber warning containers, 48dp+ dark slate buttons for one-tap CNG transport and nearby clinic calls, and a sticky 16263 hotline banner to overcome decision paralysis.",
      },
      {
        title: "Closed-loop WhatsApp safety nudges",
        detail:
          "Every PWA interaction writes back to chat; if a caregiver stalls after viewing a danger sign, an automated follow-up checks whether they reached care and escalates unresolved cases to community health workers.",
      },
    ],
    scaleIntro:
      "Built around ground realities like entry-level Android handsets, intermittent rural 2G/3G connectivity, and low-literacy families who already live inside WhatsApp, paired with a concrete 200-inquiry A/B validation framework.",
    scaleMetrics: [
      { value: "200", label: "Inbound inquiries scoped for the controlled A/B validation pilot" },
      { value: "≥ 45%", label: "Target Day 1 first-tap response within 60 minutes of welcome" },
      { value: "≥ 30%", label: "Target 14-day follow-up questions from active caregivers" },
      { value: "< 5 min", label: "Target median nurse contact during staffed service hours" },
    ],
    outcome:
      "Redesigned the WhatsApp Mobile Care Companion to eliminate silent drop-off through instant acknowledgment and human nurse handover, paired with a zero-login voice-first PWA bridging acute maternal danger signs to physical transport and clinical care.",
    reflection:
      "Designing for antenatal caregivers on rural smartphones showed that trust is built in the quietest operational moments: stating working hours clearly, acknowledging a worried voice note immediately, and giving a 15-minute WhatsApp heads-up before calling.\n\nPairing native WhatsApp warmth with a sub-1.5 MB voice-first PWA respects how families actually use their phones while turning digital warnings into real-world mobilization when every minute matters.",
  },
  {
    id: "bike-lagbe",
    title: "Bike Lagbe: Bangla QR Payment",
    subtitle: "Ride Sharing · Bangla QR & Low-Connectivity UX",
    category: "Fintech",
    year: "2025",
    timeline: "2025 · Concept",
    client: "Bike Lagbe",
    role: "Product Designer",
    image: bikeLagbeCoverImg,
    imageFit: "contain",
    heroSurface: "soft-feather",
    wide: true,
    summary:
      "Ride-sharing payment concept designed around Bangla QR for low-connectivity areas and low-spec Android devices in Bangladesh, pairing dynamic trip-locked QR codes with clear confirmation and practical offline fallbacks.",
    overview:
      "Bike Lagbe is a ride-sharing payment concept designed around Bangla QR for the Bangladesh market. Built specifically for low-connectivity corridors and low-spec Android handsets, the dual-sided rider and driver experience focuses on fast, trusted curbside payments using ride-specific dynamic QR codes, unmistakable visual and Bangla audio confirmations, and practical fallback options whenever mobile networks become unstable.",
    quote:
      "Curbside ride payments happen in moving traffic, harsh glare, night alleys, and unstable signal. Trust is won when both rider and driver know instantly that a fare settled, and neither is left stranded when the network drops.",
    metrics: [
      { value: "5 min", label: "Trip-locked dynamic Bangla QR validity window generated per ride" },
      { value: "3", label: "Built-in offline driver fallbacks (Vehicle QR, Saved QR, Cash)" },
      { value: "720p", label: "Lightweight UI built for entry-level Android screens & cameras" },
      { value: "2-Way", label: "Synchronized visual + Bangla voice confirmation for rider & driver" },
    ],
    challenge:
      "Designing digital ride payments for Bangladesh means solving for unstable 2G/3G pockets, low-spec Android cameras and dim screens, static QR amount disputes, and high anxiety whenever a transaction fails mid-curbside.",
    approach:
      "Pair ride-specific 5-minute dynamic Bangla QR codes with synchronized green confirmations, Bangla audio receipts for drivers, low-light flashlight scanning, and three practical offline fallbacks.",
    challengeIntro:
      "Everyday ride-sharing drop-offs rarely happen on strong Wi-Fi or flagship phones. Every screen in Bike Lagbe was shaped around four practical field constraints:",
    challengePoints: [
      {
        title: "Unstable network pockets at drop-off",
        detail:
          "Busy streets, narrow alleys, and basement drop-offs frequently trigger sudden signal drops. Standard QR flows stall and create awkward curbside standoffs between riders and drivers.",
      },
      {
        title: "Low-spec Android cameras & low light",
        detail:
          "Budget Android handsets struggle with slow autofocus and dim displays, especially during evening commutes. Riders need large high-contrast QR modules and instant one-tap flashlight access.",
      },
      {
        title: "Static QR reuse & fare disputes",
        detail:
          "Scanning a static sticker forces riders to manually type fares, introducing typos, slow verification, and mistrust over whether the right amount was actually paid for the current trip.",
      },
      {
        title: "Payment failure anxiety",
        detail:
          "Vague network error messages leave riders worried their wallet was debited anyway, while drivers hesitate to end the ride without clear proof or an obvious backup method.",
      },
    ],
    challengeVisual: {
      src: "/assets/aistudio/Bike_Lagbe_QR_payment_brainstorm-1_599fab36.png",
      title: "Bangla QR Payment Concept Notes",
      caption:
        "Early mind map unpacking the core curbside questions for both riders and drivers: matching the exact fare and ride reference, confirming settlement on both phones, and planning for pending, failed, and unknown network states rather than only the happy path.",
    },
    mobileShowcase: {
      eyebrow: "Dual-Sided Mobile Experience",
      heading: "Rider & Driver Bangla QR Flows",
      note: "Designed on a lightweight 720×1600 Android grid for fast rendering, high sunlight contrast, and zero-deadlock recovery across both sides of every trip.",
      variant: "device-mockup",
      screens: [
        {
          src: "/assets/aistudio/image_25e91416.png",
          title: "01 · Choose Payment Method",
          caption:
            "Highlights the exact ৳347 fare alongside a clean Cash vs. Bangla QR choice, pairing an incentive tracker (2 of 3 rides completed) with a single high-contrast Scan to Pay action.",
        },
        {
          src: "/assets/aistudio/image_25cd1e44.png",
          title: "02 · Low-Light QR Scanner",
          caption:
            "Pins the locked ৳347 fare above wide green alignment brackets and a dedicated Tap to turn on flash toggle built for night drop-offs and entry-level Android cameras.",
        },
        {
          src: "/assets/aistudio/image_7406538d.png",
          title: "03 · Payment Successful",
          caption:
            "Full-screen emerald confirmation with oversized ৳347 fare and Reference ID (BGQR-8721-3344-5566) so both rider and driver can verify settlement at a glance.",
        },
        {
          src: "/assets/aistudio/image_5ea4bd3d.png",
          title: "04 · Reassuring Failure Recovery",
          caption:
            "States the exact server issue clearly, reassures the rider that no amount was debited from their wallet, and offers instant Try Again or Choose Another Method exits.",
        },
        {
          src: "/assets/aistudio/image_a5c6df9e.png",
          title: "01 · Complete Ride & Generate QR",
          caption:
            "Lets the driver lock the ৳347 trip fare and generate a fresh ride-specific QR in one tap, clearly signaling that every ride produces a new code.",
        },
        {
          src: "/assets/aistudio/image_62c4bb3f.png",
          title: "02 · Dynamic Bangla QR",
          caption:
            "Displays a large, high-contrast B.QR code with a 5-minute countdown badge, Ride ID, single-trip lock, and exact fare so riders never manually enter amounts.",
        },
        {
          src: "/assets/aistudio/image_09ef6208.png",
          title: "03 · Payment Received + Bangla Audio",
          caption:
            "Mirrors the rider’s green confirmation and Reference ID while adding a Bangla audio receipt banner (“৩৪৭ টাকা পেমেন্ট গ্রহণ করা হয়েছে · শেষ ৪টি ডিজিটঃ ১২৭২”) for hands-free verification.",
        },
        {
          src: "/assets/aistudio/image_fd3a41f8.png",
          title: "04 · Unstable Connection Fallbacks",
          caption:
            "When network verification stalls, the screen surfaces three immediate backup paths: Use Vehicle QR sticker, Open Saved QR Image from gallery, or Request Rider for Cash Payment.",
        },
      ],
      groups: [
        {
          id: "rider-flow",
          eyebrow: "01 · Rider App",
          title: "Rider Payment Flow",
          description:
            "Guides passengers from fare selection and low-light scanning to unmistakable payment confirmation, or calm recovery if the Bangla QR server cannot be reached.",
          screens: [
            {
              src: "/assets/aistudio/image_25e91416.png",
              title: "01 · Choose Payment Method",
              caption:
                "Highlights the exact ৳347 fare alongside Cash and Bangla QR with a clear 3-ride offer tracker and one-tap Scan to Pay button.",
            },
            {
              src: "/assets/aistudio/image_25cd1e44.png",
              title: "02 · Low-Light QR Scanner",
              caption:
                "Pins the ৳347 fare above wide scanner brackets with an accessible Tap to turn on flash toggle for night drop-offs on budget cameras.",
            },
            {
              src: "/assets/aistudio/image_7406538d.png",
              title: "03 · Payment Successful",
              caption:
                "Full-bleed green success state with oversized ৳347 amount and verifiable Reference ID readable at arm’s length.",
            },
            {
              src: "/assets/aistudio/image_5ea4bd3d.png",
              title: "04 · Payment Failed & Recovery",
              caption:
                "Explains the connection error, confirms zero wallet debit, and pairs Try Again with Choose Another Method.",
            },
          ],
        },
        {
          id: "driver-flow",
          eyebrow: "02 · Driver App",
          title: "Driver Collection & Fallback Flow",
          description:
            "Equips drivers to generate trip-locked dynamic Bangla QR codes, confirm payment hands-free via Bangla voice cues, and switch smoothly to offline backups during signal drops.",
          screens: [
            {
              src: "/assets/aistudio/image_a5c6df9e.png",
              title: "01 · Generate Ride QR",
              caption:
                "One-tap Complete Ride and Generate QR action locked to the ৳347 fare, reassuring drivers a unique QR is created per trip.",
            },
            {
              src: "/assets/aistudio/image_62c4bb3f.png",
              title: "02 · Dynamic Bangla QR",
              caption:
                "High-contrast B.QR with a 5-minute validity badge, Ride ID, single-trip lock, and pre-filled fare amount.",
            },
            {
              src: "/assets/aistudio/image_09ef6208.png",
              title: "03 · Paid + Bangla Voice Alert",
              caption:
                "Green receipt screen with Reference ID plus Bangla audio confirmation (“৩৪৭ টাকা পেমেন্ট গ্রহণ করা হয়েছে”) for quick roadside verification.",
            },
            {
              src: "/assets/aistudio/image_fd3a41f8.png",
              title: "04 · Offline Backup Options",
              caption:
                "Graceful unstable-network screen offering physical Vehicle QR sticker, Saved QR gallery image, or Cash payment.",
            },
          ],
        },
      ],
    },
    processVisuals: [
      {
        src: "/assets/aistudio/Rider_and_driver_payment_flow_sketch-2_8ee97f7d.png",
        title: "Synchronized Rider & Driver Concept Flow",
        caption:
          "Mapping both sides of the fare handoff step by step: keeping the Tk 347 amount and ride reference consistent from QR generation to scanning, and pairing visual confirmation with an audio cue so both people get immediate clarity.",
      },
      {
        src: "/assets/aistudio/Bike_payment_status_recovery_sketch-3_79f40433.png",
        title: "Check-Before-Retrying & Network Recovery Concept",
        caption:
          "Handling unstable signal without double-charging: resolving the earlier attempt first by checking whether payment is confirmed, pending, or failed, then guiding users cleanly to Vehicle QR, Saved QR, or Cash when a retry is needed.",
      },
    ],
    processSteps: [
      {
        phase: "01 · Constraints",
        title: "Low-Spec Android & 2G/3G Budgeting",
        detail:
          "Designed on a crisp 720×1600 canvas using flat vector iconography, generous hit targets, and zero heavy animations so screens launch instantaneously on budget Android phones.",
      },
      {
        phase: "02 · Dynamic QR",
        title: "Trip-Locked Bangla QR Architecture",
        detail:
          "Replaced error-prone manual fare entry with a ride-specific, 5-minute dynamic Bangla QR bound to the Ride ID and exact amount, interoperable across bKash, Nagad, Rocket, and bank wallets.",
      },
      {
        phase: "03 · Mutual Trust",
        title: "Mirrored Confirmation & Bangla Audio",
        detail:
          "Synchronized the full-screen emerald receipt and Reference ID across both phones, reinforced by a Bangla voice confirmation banner on the driver side for hands-free confidence in traffic.",
      },
      {
        phase: "04 · Resilience",
        title: "Zero-Deadlock Offline Fallbacks",
        detail:
          "Mapped every unstable-network failure path so riders see explicit zero-debit reassurance while drivers can pivot immediately to a physical Vehicle QR, Saved QR image, or Cash.",
      },
    ],
    keyDesignAreas: [
      {
        title: "Ride-specific dynamic Bangla QR",
        detail:
          "Encodes the exact trip fare and Ride ID inside a 5-minute dynamic QR code, eliminating manual typing errors and ensuring every payment ties cleanly to one completed ride.",
      },
      {
        title: "Hands-free Bangla voice confirmation",
        detail:
          "Announces the exact Taka amount and last four digits in Bangla on the driver’s receipt screen so riders and drivers settle quickly without squinting at small text.",
      },
      {
        title: "Low-light scanner with one-tap flash",
        detail:
          "Keeps the camera viewfinder uncluttered with the fare pinned overhead and a large flashlight toggle built specifically for dim streets and budget Android lenses.",
      },
      {
        title: "Zero-debit failure reassurance",
        detail:
          "Replaces cryptic payment errors with plain-language network causes, explicit confirmation that no funds left the rider’s wallet, and direct retry or switch-method buttons.",
      },
      {
        title: "Three-tier offline driver fallbacks",
        detail:
          "When live QR verification drops, drivers get one-tap guidance to show their physical Vehicle QR sticker, open a saved gallery QR image, or smoothly collect Cash.",
      },
      {
        title: "Low-spec Android clarity",
        detail:
          "High-contrast emerald, amber, and coral semantic states paired with clean typography keep every critical cue readable in direct sunlight on entry-level screens.",
      },
    ],
    deliverables: [
      "Rider & Driver UI",
      "Bangla QR Flow",
    ],
    outcome:
      "Delivered a complete dual-sided Bangla QR ride payment concept tailored to Bangladesh’s connectivity and hardware realities, combining trip-locked QR speed, synchronized visual and Bangla audio trust, and practical offline fallbacks.",
    reflection:
      "Designing fintech experiences for emerging mobility markets means treating unstable signal and budget hardware as core design inputs rather than edge cases.\n\nBy pairing dynamic ride-specific Bangla QR codes with plain-language failure reassurance, Bangla audio receipts, and physical/saved QR backups, digital payments stay fast and trustworthy even when connectivity falters.",
  },
  {
    id: "dhaka-metro-screen",
    title: "Redesign Concept: Dhaka Metro Rail Update Screen",
    subtitle: "Public Transit · Concept Redesign",
    category: "Transit",
    year: "2025",
    timeline: "2025 · Self-Initiated Concept",
    client: "Dhaka Metro Rail (MRT Line 6)",
    role: "Product Designer · Visual & Motion Concept",
    image: "/assets/aistudio/Cover_MRT_e57781b1.png",
    imageFit: "contain",
    heroSurface: "screen-frame",
    wide: true,
    summary:
      "Reimagining the overhead station update screen inside Dhaka Metro Rail coaches with purposeful brand color hierarchy, concise station and door cues, and a richer MRT Line 6 route map.",
    overview:
      "I see the station update screen inside the coaches of Dhaka Metro Rail every day, and I kept wishing it looked more modern, calmer, and easier to read from across a crowded aisle. When a train is moving or pulling into a busy platform, commuters only have a quick glance to confirm where they are, what stop comes next, and which side the doors will open.\n\nThis self-initiated redesign concept reimagines the MRT Line 6 coach display around three practical strategies: making the brand colors carry real functional meaning, delivering concise station and door updates without visual noise, and giving riders clearer full-corridor orientation through the MRT Line 6 map.",
    overviewVideo: {
      src: "/assets/aistudio/MRT-6_Stattion_Update_Screen_200971bb.mp4",
      poster: "/assets/aistudio/Cover_MRT_e57781b1.png",
      title: "Animated Coach Screen Prototype (MRT Line 6)",
      caption:
        "Live motion concept demonstrating synchronized station labels, upcoming door-side cues, the bottom linear train indicator, and live position tracking along the vertical MRT Line 6 map.",
    },
    challenge:
      "Coach displays must be readable in a single quick glance from both standing aisles and seats, pairing current station, door-side status, next stop, and full-line direction without making every element compete for attention.",
    approach:
      "Reorganized the overhead screen into a calm, balanced layout that puts Dhaka Metro brand colors to work, pairs concise station and door updates on the left, and anchors route direction with the full MRT Line 6 map on the right.",
    deliverables: [
      "Coach Display UI",
      "MRT Line 6 Route Map",
      "Motion Prototype",
    ],
    processHeading: "Exploration & Storyboard",
    processNavLabel: "Exploration",
    processEyebrow: "Sketches & Motion Thinking",
    processIntro:
      "Working directly from daily commute observations, I mapped what riders look for first, compared three layout directions, and storyboarded how labels, door cues, and train position stay in sync across station states.",
    processVisuals: [
      {
        src: "/assets/aistudio/MRT_6_Coach_Display_Brain_Map-1_7bb71be0.png",
        title: "Daily Commute Brain Map",
        caption:
          "Unpacking the real questions passengers ask while looking up inside the coach (Where am I? What is next? Which doors open? How far to my stop?) and shifting away from equal-weight clutter toward prioritizing the next useful fact.",
      },
      {
        src: "/assets/aistudio/MRT_Line_6_Layout_Exploration-2_ed2e8624.png",
        title: "Layout Exploration (Text-First, Map-First & Balanced)",
        caption:
          "Comparing three screen compositions before choosing Option C: current station leads at full scale, door cues stay immediately adjacent, the next stop sits on its own clean level, and the vertical MRT Line 6 map adds direction on the right against a quiet backdrop.",
      },
      {
        src: "/assets/aistudio/MRT_coach_display_motion_storyboard_657b51e8.png",
        title: "Motion States & Readability Storyboard",
        caption:
          "Sequencing After departure, Approaching, and At station states so train movement, station names, and door cues update in lockstep, paired with practical checks for aisle-to-seat legibility, Bangla and English pairing, and icon clarity without relying on color alone.",
      },
    ],
    keyDesignAreasHeading: "Core Design Strategies",
    keyDesignAreasSubheading: "Three Focused Shifts",
    keyDesignAreasNavLabel: "Strategies",
    keyDesignAreasIntro:
      "Every layout, color, and motion choice serves one goal: helping daily Dhaka commuters orient themselves effortlessly in a single glance.",
    keyDesignAreas: [
      {
        title: "Make the brand colors work",
        detail:
          "Uses Dhaka Metro's signature emerald green to anchor the current station, route spine, and train livery while reserving warm amber-orange for the upcoming stop. A quiet white canvas with a subtle Dhaka skyline watermark ensures brand color signals live status instead of adding visual noise.",
      },
      {
        title: "Concise delivery of updates",
        detail:
          "Establishes an unmistakable typographic hierarchy: 'You are at' and the current station with active door side lead first, followed by 'Next Station' and upcoming door side right beneath. Commuters get the exact fact they need to prepare for exit without parsing dense labels.",
      },
      {
        title: "More information through the MRT 6 map",
        detail:
          "Combines a focused 4-stop horizontal track (previous, current, next, and ahead) with the full vertical Motijheel to Uttara North corridor map and live train icon, giving both first-time riders and daily commuters immediate door readiness and whole-line context.",
      },
    ],
    keyDesignAreasVisual: {
      src: "/assets/aistudio/MRT_6_update_screen_cd52ee69.jpg",
      title: "Synchronized In-Transit State: Farmgate to Bijoy Sarani",
      caption:
        "Companion station state showing how the active green anchor, amber next-stop door alert, horizontal train rail, and vertical MRT Line 6 corridor marker stay cleanly aligned as the coach progresses northbound.",
    },
    outcomesNavLabel: "Reflection",
    outcome:
      "A modern, glanceable coach update screen concept for Dhaka Metro Rail MRT Line 6 that turns everyday brand colors, concise station and door cues, and full-line spatial context into a calmer daily commute.",
    reflection:
      "Public transit screens are among the most viewed interfaces in any city, yet they are often treated as an afterthought. Reimagining a display I rely on every day reminded me how much quiet relief good information hierarchy can bring to thousands of commuters moving through a crowded train.\n\nKeeping the screen uncluttered, giving brand colors a clear functional job, and letting the MRT Line 6 map carry spatial context makes the ride feel calmer and more intuitive for first-time visitors and regular riders alike. As a next step, pairing this layout seamlessly with Bangla and English switching and testing aisle-to-seat readability inside live coaches would make the system even more inclusive.",
  },
  {
    id: "tonis-bakery",
    title: "Toni's Bakery App",
    subtitle: "Mobile App · Bakery Ordering",
    category: "E-Commerce",
    year: "2023",
    timeline: "2023 · Mobile Product Design",
    client: "Toni's Bakery · Gulshan-2",
    role: "Product Designer · UI/UX",
    image: "/assets/aistudio/image_67f58646.png",
    imageFit: "cover",
    heroSurface: "canvas-frame",
    summary:
      "A mobile bakery ordering experience that connects product discovery, order review, pickup or delivery, and live tracking.",
    overview:
      "Toni's brings the bakery shopping experience onto a mobile interface. Customers can explore products, adjust quantities, review their selections, choose how to receive their order, and follow its delivery progress.\n\nThe design combines product photography, warm orange accents, and simple layouts to give the experience a welcoming bakery identity.",
    challenge:
      "The challenge was to make each stage of ordering understandable. Customers need enough information to choose products, check their order confidently, and understand what happens after confirmation.",
    challengeIntro:
      "The challenge was to make each stage of ordering understandable. Customers need enough information to choose products, check their order confidently, and understand what happens after confirmation.",
    challengePoints: [
      {
        title: "Finding the right product",
        detail:
          "A varied menu can make it difficult to locate a particular item or explore relevant categories.",
      },
      {
        title: "Keeping track of selections",
        detail:
          "Customers need to see quantities and remember what they have already added while browsing.",
      },
      {
        title: "Understanding the final cost",
        detail:
          "Item prices, delivery charges, discounts, and the total need to be clear before confirmation.",
      },
      {
        title: "Uncertainty during delivery",
        detail:
          "Customers need visibility into order progress, an arrival estimate, and a way to contact the delivery person.",
      },
    ],
    mobileShowcase: {
      eyebrow: "Mobile Interface",
      heading: "End-to-End Ordering & Delivery Screens",
      note: "From home discovery and live cart previews to transparent checkout, real-time tracking, and post-delivery feedback.",
      variant: "device-mockup",
      screens: [
        {
          src: "/assets/aistudio/image_b03eb535.png",
          title: "01 · Home & Featured Offers",
          caption:
            "Combines search, pickup mode selection, ongoing orders access, featured pastry and cookie offers, and quick category icons.",
        },
        {
          src: "/assets/aistudio/image_dfc38fa9.png",
          title: "02 · Categorized Bakery Menu",
          caption:
            "Groups cookies, donuts, and cakes into clear sections with product photography, BDT per-piece pricing, favorites, and inline quantity steppers.",
        },
        {
          src: "/assets/aistudio/image_d2067ea7.png",
          title: "03 · Product Details & Live Cart",
          caption:
            "Brings product photography, description, 4.8/5 rating, price per piece, quantity controls, related items ('People also love'), and an 'In cart' preview together.",
        },
        {
          src: "/assets/aistudio/image_8af7ecfc.png",
          title: "04 · Cart & Order Review",
          caption:
            "Unites pickup or delivery choice with store location, itemized quantities, subtotal, delivery fee, coupon savings (HAPPY50), payment method, and Confirm Order.",
        },
        {
          src: "/assets/aistudio/image_8c50d813.png",
          title: "05 · Live Order Tracking",
          caption:
            "Pairs confirmation time and live 'On the way' status with a 15-19 minute arrival estimate, delivery map, and direct Call and Chat buttons.",
        },
        {
          src: "/assets/aistudio/image_321fbde6.png",
          title: "06 · Delivered & Experience Rating",
          caption:
            "After delivery, a warm 'Enjoy!' completion screen invites customers to rate their experience with 5 stars or return home.",
        },
      ],
      groups: [
        {
          id: "bakery-discovery",
          eyebrow: "01 · Discovery & Selection",
          title: "Making Products Easier to Explore",
          description:
            "Search, category groupings, appetizing photography, inline quantity steppers, and a live 'In cart' summary help customers browse and build orders without losing track.",
          screens: [
            {
              src: "/assets/aistudio/image_b03eb535.png",
              title: "01 · Home & Featured Offers",
              caption:
                "Combines search, pickup mode toggle, ongoing orders access, featured pastry and cookie offers, and visual category shortcuts.",
            },
            {
              src: "/assets/aistudio/image_dfc38fa9.png",
              title: "02 · Categorized Menu",
              caption:
                "Groups cookies, donuts, and cakes into scannable sections with photography, per-piece pricing, favorites, and inline quantity controls.",
            },
            {
              src: "/assets/aistudio/image_d2067ea7.png",
              title: "03 · Product Details & Cart Preview",
              caption:
                "Unites photography, ratings, price per piece, quantity controls, 'People also love' suggestions, and a live 'In cart' preview on one screen.",
            },
          ],
        },
        {
          id: "bakery-checkout-tracking",
          eyebrow: "02 · Checkout & Fulfillment",
          title: "Order Review, Tracking & Delivery",
          description:
            "Transparent cost breakdowns before confirmation lead smoothly into live status, arrival estimates, map context, direct courier contact, and post-delivery ratings.",
          screens: [
            {
              src: "/assets/aistudio/image_8af7ecfc.png",
              title: "04 · Cart & Cost Breakdown",
              caption:
                "Collects pickup or delivery choice, itemized quantities, subtotal, delivery charge, coupon discount, payment method, and order confirmation.",
            },
            {
              src: "/assets/aistudio/image_8c50d813.png",
              title: "05 · Live Order Tracking",
              caption:
                "Combines order status, 15-19 minute arrival estimate, delivery map, and one-tap Call and Chat buttons for the delivery person.",
            },
            {
              src: "/assets/aistudio/image_321fbde6.png",
              title: "06 · Delivered & Rating",
              caption:
                "Celebrates delivery with a warm 'Enjoy!' screen inviting customers to rate their experience and share feedback.",
            },
          ],
        },
      ],
    },
    approach:
      "Structured the ordering flow around clear product browsing, inline quantity controls with live cart visibility, upfront cost breakdowns, and reassuring post-checkout tracking.",
    deliverables: [
      "Mobile App UI",
      "Ordering & Cart UX",
      "Live Tracking Flow",
    ],
    processHeading: "From Wireframes to the Final Interface",
    processNavLabel: "Wireframes",
    processEyebrow: "Ordering & Delivery Flow Sketches",
    processIntro:
      "The wireframes establish the placement of product information, quantity controls, cart details, and tracking features. The final screens develop these structures through bakery photography, rounded components, consistent spacing, and prominent action buttons.",
    processVisuals: [
      {
        src: "/assets/aistudio/Bakery_app_ordering_flow_sketches-2_53628d01.png",
        title: "Ordering Flow Exploration (Browse, Choose & Review)",
        caption:
          "Hand-drawn wireframes establishing search and category browsing, inline quantity controls close to each item, price per piece, related suggestions, live 'In cart' visibility, and transparent pickup or delivery cost review before confirmation.",
      },
      {
        src: "/assets/aistudio/Bakery_delivery_journey_sketch-3_7a6889a8.png",
        title: "Delivery Journey Exploration (Confirmed, Tracking & Delivered)",
        caption:
          "Hand-drawn flow mapping pickup store timing and live delivery tracking with visible status, a clear 15 to 19 minute estimate, location map context, one-tap Call and Chat access to the delivery person, and post-delivery star ratings.",
      },
    ],
    keyDesignAreasHeading: "How Each Stage Works Together",
    keyDesignAreasSubheading: "Three Core Flows",
    keyDesignAreasNavLabel: "Key Flows",
    keyDesignAreas: [
      {
        title: "Making products easier to explore",
        detail:
          "The home screen combines search, product categories, and featured offers, while the menu groups products into clear sections with images, names, and prices. Product details bring photography, descriptions, ratings, price per piece, quantity controls, and related products together on one screen.",
      },
      {
        title: "Keeping order review clear",
        detail:
          "Quantity controls sit close to each product and a cart preview on the product page keeps selected items visible. The cart brings together item quantities, costs, discounts, payment selection, and pickup or delivery options so customers can review everything confidently before confirming.",
      },
      {
        title: "Supporting customers after checkout",
        detail:
          "The tracking screen combines order status, an estimated arrival time, and a delivery map with Call and Chat options for direct access to the delivery person. After delivery, a completion screen invites customers to rate their experience.",
      },
    ],
    outcomesNavLabel: "Reflection",
    outcome:
      "Connected product discovery, live cart review, flexible pickup or delivery checkout, and real-time order tracking into a warm, approachable mobile bakery experience.",
    reflection:
      "Designing Toni's Bakery reinforced how much confidence comes from small, consistent cues throughout an ordering journey: keeping quantity controls close to each pastry, surfacing what is already in the cart while browsing, breaking down every charge and discount clearly before checkout, and making delivery progress easy to read at a glance.\n\nPairing structured wireframes with warm orange accents, clean spacing, and inviting bakery photography turns everyday food ordering into a calm, welcoming experience from the first search to the final star rating.",
  },
  {
    id: "booklet-unlocking-the-mind",
    title: "Booklet Design: Unlocking the Mind",
    subtitle: "Editorial · Illustrated Booklet",
    category: "Editorial",
    year: "2024",
    timeline: "8 Pages · Print & Digital Booklet",
    client: "North South University · Psychology 101",
    role: "Editorial Designer · Layout & Typography",
    image: "/assets/editorial/booklet/page-01.jpg",
    imageFit: "contain",
    summary:
      "An 8-page reflective booklet tracing how Psychology 101 turned childhood pop-culture myths into a deeper appreciation for memory, literature, mentorship, and belonging.",
    overview:
      "Unlocking the Mind is an 8-page illustrated booklet reflecting on a personal semester in Psychology 101 at North South University. Designed to feel warmer and more memorable than a standard academic paper, each spread pairs clean geometric typography, coral-orange chapter bands, vertical running folios, and full-bleed bottom artwork so the story unfolds visually from cover to closing note.",
    challenge:
      "Turning a personal academic reflection into an inviting multi-page editorial piece with clear chapter pacing and expressive visual storytelling.",
    approach:
      "Built a repeatable grid anchored by warm cream stock, coral header bars, generous reading margins, and full-bleed bottom imagery paired with vertical side folios.",
    deliverables: [
      "Booklet Layout",
      "Editorial Typography",
      "Visual Pacing",
    ],
    keyDesignAreas: [
      {
        title: "Structured chapter pacing",
        detail:
          "Consistent coral-orange title bands, open cream margins, and concise paragraphs create an unhurried reading rhythm across all 8 pages.",
      },
      {
        title: "Paired editorial imagery",
        detail:
          "Each milestone is grounded by full-bleed lower-half artwork and a matching vertical running title strip along the left edge.",
      },
      {
        title: "Expressive cover to close",
        detail:
          "Opens with a bold illustrated cover and muted half-title page, concluding cleanly with a warm typographic dedication.",
      },
    ],
    outcome:
      "Delivered a cohesive 8-page print and digital booklet that elevates personal reflection through deliberate editorial structure and warmth.",
    editorialDocument: {
      pdfUrl: "/assets/aistudio/Psychology_101_42bb377d.pdf",
      pdfLabel: "Open Full PDF",
      formatLabel: "8-Page Booklet · Portrait",
      spreadPreviewSrc: "/assets/editorial/booklet/page-03.jpg",
      pages: [
        { src: "/assets/editorial/booklet/page-01.jpg", title: "Cover: Unlocking the Mind" },
        { src: "/assets/editorial/booklet/page-02.jpg", title: "Half-Title Page" },
        { src: "/assets/editorial/booklet/page-03.jpg", title: "A Journey Begins & Childhood Fantasies" },
        { src: "/assets/editorial/booklet/page-04.jpg", title: "The Turning Point: Learning and Memory" },
        { src: "/assets/editorial/booklet/page-05.jpg", title: "Connecting the Dots: Literature & Psychology" },
        { src: "/assets/editorial/booklet/page-06.jpg", title: "An Unforgettable Mentor: The Power of Being Seen" },
        { src: "/assets/editorial/booklet/page-07.jpg", title: "Finding Belonging: A Quiet Student's Transformation" },
        { src: "/assets/editorial/booklet/page-08.jpg", title: "Gratitude, Growth & Closing Note" },
      ],
    },
  },
  {
    id: "menu-food-pavilion",
    title: "Menu Design: Food Pavilion",
    subtitle: "Editorial · Restaurant Menu",
    category: "Editorial",
    year: "2024",
    timeline: "20 Pages · Print Menu Book",
    client: "Food Pavilion · Lakshmipur",
    role: "Editorial Designer · Illustration & Menu Layout",
    image: "/assets/editorial/food-pavilion/page-01.jpg",
    imageFit: "contain",
    wide: true,
    summary:
      "A 20-page illustrated restaurant menu for Food Pavilion in Lakshmipur, opening with a bespoke Bangla neighborhood landmark map and organizing 72 dishes with playful food mascots and clear pricing.",
    overview:
      "Designed for Food Pavilion on Hospital Road in Lakshmipur (founded in 2018), this 20-page menu brings 72 dishes across 10 culinary categories into a bright, easy-to-browse dining booklet. It opens with a custom illustrated map celebrating beloved local landmarks around the restaurant and wraps up with private event booking details and a bold typographic back cover.",
    challenge:
      "Organizing a broad 72-item multi-cuisine menu (from burgers and pizza to platters, oriental, curry, desserts, and pre-order feasts) so tables can scan items, portions, and prices effortlessly.",
    approach:
      "Paired oversized pastel category headers, numbered dishes, clear serving ratios (1:1, 1:3, Small/Medium/Large), and playful corner illustrations across a clean, airy print grid.",
    deliverables: [
      "20-Page Menu Layout",
      "Illustrated Landmark Cover",
      "Typography & Pricing Grid",
    ],
    keyDesignAreas: [
      {
        title: "Local Lakshmipur map cover",
        detail:
          "Welcomes diners with a custom thematic Bangla map featuring neighborhood landmarks around Hospital Road, immediately rooting the brand in its community.",
      },
      {
        title: "Effortless 72-item scanning",
        detail:
          "Bold top category headers, numbered dish entries, italicized flavor notes, and crisp right-aligned prices simplify ordering for individuals and groups.",
      },
      {
        title: "Playful section illustrations",
        detail:
          "Dedicated dish and character illustrations give each section distinct visual personality while keeping plenty of breathing room on every page.",
      },
    ],
    outcome:
      "Created a complete 20-page print-ready menu that balances warm local identity with clear, approachable table-side readability.",
    editorialDocument: {
      pdfUrl: "/assets/aistudio/Food_Pavilion_Menu_FINAL_compressed_2dbb431b.pdf",
      pdfLabel: "Open Full PDF",
      formatLabel: "20-Page Menu · Portrait",
      spreadPreviewSrc: "/assets/editorial/food-pavilion/page-03.jpg",
      pages: [
        { src: "/assets/editorial/food-pavilion/page-01.jpg", title: "Cover: Illustrated Lakshmipur Map" },
        { src: "/assets/editorial/food-pavilion/page-02.jpg", title: "Welcome to Food Pavilion" },
        { src: "/assets/editorial/food-pavilion/page-03.jpg", title: "Burger (Items 1-5)" },
        { src: "/assets/editorial/food-pavilion/page-04.jpg", title: "Snacks (Items 6-11)" },
        { src: "/assets/editorial/food-pavilion/page-05.jpg", title: "Snacks: Fried Chicken & Wings (Items 12-17)" },
        { src: "/assets/editorial/food-pavilion/page-06.jpg", title: "Italian: Pizza (Items 18-21)" },
        { src: "/assets/editorial/food-pavilion/page-07.jpg", title: "Italian: Oven Baked Pasta (Items 22-23)" },
        { src: "/assets/editorial/food-pavilion/page-08.jpg", title: "Platter (Items 24-28)" },
        { src: "/assets/editorial/food-pavilion/page-09.jpg", title: "Platter (Items 29-33)" },
        { src: "/assets/editorial/food-pavilion/page-10.jpg", title: "Oriental: Soups & Fried Rice (Items 34-37)" },
        { src: "/assets/editorial/food-pavilion/page-11.jpg", title: "Oriental: Mains, Salad & Chowmein (Items 38-42)" },
        { src: "/assets/editorial/food-pavilion/page-12.jpg", title: "Curry (Items 43-48)" },
        { src: "/assets/editorial/food-pavilion/page-13.jpg", title: "Indian Specialties & Biryani (Items 49-52)" },
        { src: "/assets/editorial/food-pavilion/page-14.jpg", title: "Complements: Naan, Luchi & Add-Ons" },
        { src: "/assets/editorial/food-pavilion/page-15.jpg", title: "Beverage: Mojito, Lassi & Shakes (Items 56-61)" },
        { src: "/assets/editorial/food-pavilion/page-16.jpg", title: "Beverage: Coffee & Fresh Juices (Items 62-67)" },
        { src: "/assets/editorial/food-pavilion/page-17.jpg", title: "Dessert: Ice Cream & Faluda (Items 68-69)" },
        { src: "/assets/editorial/food-pavilion/page-18.jpg", title: "Pre-Order Feasts: Kacchi, Tehari & Pulaw" },
        { src: "/assets/editorial/food-pavilion/page-19.jpg", title: "Events & Table Reservations" },
        { src: "/assets/editorial/food-pavilion/page-20.jpg", title: "Back Cover: Category Typography" },
      ],
    },
  },
  {
    id: "visual-poster-studies",
    title: "Visual & Poster Studies",
    subtitle: "Editorial · Film Poster Series",
    category: "Editorial",
    year: "2024",
    timeline: "13 Posters · Print & Key Art",
    client: "Personal Series · Prints Available",
    role: "Visual Designer · Typography & Illustration",
    image: "/assets/aistudio/Zodiac_d3f4239a.jpg",
    imageFit: "contain",
    summary:
      "A curated collection of 13 alternative film poster studies exploring minimalist symbolism, expressive typography, and cinematic mood across portrait, square, and landscape formats.",
    overview:
      "Visual & Poster Studies brings together 13 personal key-art and poster explorations inspired by memorable films and series. Each piece distills a story's emotional core into a single visual metaphor, pairing bold conceptual typography, gritty textures, and contrasting compositions across varied aspect ratios.\n\nEvery poster in this collection is available as a high-resolution print. If you would like to purchase a poster or commission a custom artwork, please get in touch directly.",
    challenge:
      "Distilling each film's narrative tension and atmosphere into an immediately recognizable graphic composition while keeping every piece visually distinct.",
    approach:
      "Combined symbolic illustration, typographic storytelling, halftone textures, and deliberate negative space tailored to the mood of each title.",
    deliverables: [
      "13 Film Poster Studies",
      "Custom Typography",
      "Print-Ready Artwork",
    ],
    keyDesignAreas: [
      {
        title: "Symbolic visual metaphors",
        detail:
          "From mirrored typography in The Gift and scissors in Ajji to the red moon footprint in Bulbbul, each poster anchors its concept in a single unforgettable motif.",
      },
      {
        title: "Expressive title treatments",
        detail:
          "Hand-crafted and custom-arranged letterforms act as part of the illustration itself, carrying tone before a single line of copy is read.",
      },
      {
        title: "Prints available on request",
        detail:
          "Interested in owning any of these posters as a framed or archival print? Reach out directly with the poster title to arrange an order.",
      },
    ],
    outcome:
      "Built an evolving archive of 13 cinematic poster studies available for collectors and print enthusiasts.",
    posterGallery: {
      collectionNote:
        "Hover over any poster to preview its title, or click any piece to view it in full screen.",
      purchaseHeading: "Interested in owning a print?",
      purchaseNote:
        "If you would like to buy any poster from this collection or commission a custom print, please contact me directly with the poster title.",
      coverPreviewSrcs: [
        "/assets/aistudio/Eternal_Sunshine_9a78b1d3.jpg",
        "/assets/aistudio/Zodiac_d3f4239a.jpg",
        "/assets/aistudio/Nightcrawler_c586196a.jpg",
      ],
      items: [
        {
          src: "/assets/aistudio/Ajji_8e2c1a0e.jpg",
          title: "Ajji",
          subtitle: "Film Poster Study",
          width: 812,
          height: 1024,
        },
        {
          src: "/assets/aistudio/BREATHE_c1265b16.jpg",
          title: "BREATHE",
          subtitle: "Series Poster Study",
          width: 870,
          height: 1023,
        },
        {
          src: "/assets/aistudio/Bulbbul_188598d1.jpg",
          title: "Bulbbul",
          subtitle: "Film Poster Study",
          width: 819,
          height: 1024,
        },
        {
          src: "/assets/aistudio/Eternal_Sunshine_9a78b1d3.jpg",
          title: "Eternal Sunshine",
          subtitle: "Film Poster Study",
          width: 819,
          height: 1024,
        },
        {
          src: "/assets/aistudio/Five_Feet_Apart_76c7c3aa.jpg",
          title: "Five Feet Apart",
          subtitle: "Film Poster Study",
          width: 843,
          height: 1023,
        },
        {
          src: "/assets/aistudio/Love_and_Other_Drugs_dcf3413e.jpg",
          title: "Love and Other Drugs",
          subtitle: "Film Poster Study",
          width: 1024,
          height: 733,
        },
        {
          src: "/assets/aistudio/Nightcrawler_c586196a.jpg",
          title: "Nightcrawler",
          subtitle: "Film Poster Study",
          width: 928,
          height: 1024,
        },
        {
          src: "/assets/aistudio/One_Hour_Photo_4c967f96.jpg",
          title: "One Hour Photo",
          subtitle: "Film Poster Study",
          width: 950,
          height: 1024,
        },
        {
          src: "/assets/aistudio/Se7en_7fcf8fa5.jpg",
          title: "Se7en",
          subtitle: "Film Poster Study",
          width: 777,
          height: 1024,
        },
        {
          src: "/assets/aistudio/The_Gift_24ab5be7.jpg",
          title: "The Gift",
          subtitle: "Film Poster Study",
          width: 948,
          height: 1023,
        },
        {
          src: "/assets/aistudio/The_Imitation_Game_1e779d0e.jpg",
          title: "The Imitation Game",
          subtitle: "Film Poster Study",
          width: 808,
          height: 1024,
        },
        {
          src: "/assets/aistudio/The_Terminal_b3893732.jpg",
          title: "The Terminal",
          subtitle: "Film Poster Study",
          width: 1024,
          height: 822,
        },
        {
          src: "/assets/aistudio/Zodiac_d3f4239a.jpg",
          title: "Zodiac",
          subtitle: "Film Poster Study",
          width: 724,
          height: 1024,
        },
      ],
    },
  },
  {
    id: "benevolent-pay",
    title: "Benevolent Pay",
    subtitle: "Mobile App · Workplace Fund & Culture",
    category: "Fintech",
    year: "2025",
    timeline: "2025 · Mobile Product Concept",
    client: "Office Culture Concept",
    role: "Product Designer · UI/UX",
    image: "/assets/aistudio/Benevolent_Pay_twin_phone_portfolio_mockup_250e909e.png",
    imageFit: "contain",
    summary:
      "Small slip ups. Shared celebrations. A playful office app where everyday rule breaks contribute to the next team party.",
    overview:
      "Late to a meeting? Shoes outside the rack? Those familiar office moments become part of Benevolent Pay. Each broken rule carries a small fine, and the money collected goes towards a monthly party hosted by HR.\n\nThe concept pairs a practical reporting and collection system with the humour of everyday office life.",
    quote:
      "Small slip ups. Shared celebrations. Playful language gives the app its character; clear amounts and statuses give the experience structure.",
    challenge:
      "How can reporting a rule break feel lighthearted while keeping the incident, fine and payment status clear?",
    challengeIntro:
      "How can reporting a rule break feel lighthearted while keeping the incident, fine and payment status clear? The experience brings together two responsibilities: team leaders report incidents, while HR reviews the details and oversees the shared fund. Playful language gives the app its character; clear amounts and statuses give the experience structure.",
    challengePoints: [
      {
        title: "Lighthearted reporting without ambiguity",
        detail:
          "Team leaders need a quick, playful way to log everyday office slip ups while keeping the team member, broken rule, fine amount and photo evidence completely clear.",
      },
      {
        title: "Transparent fund tracking for HR",
        detail:
          "HR needs a dependable view separating collected money, outstanding dues and total funds before sharing monthly totals or transferring money for the team party.",
      },
      {
        title: "Clear review before notifying teammates",
        detail:
          "Every incident report brings together context, payment deadline, status and supporting evidence so HR can review and acknowledge it fairly.",
      },
      {
        title: "Connecting fines to the shared celebration",
        detail:
          "Nicknames, contribution leaderboards and playful food comparisons turn routine dues into a shared social story that everyone looks forward to celebrating.",
      },
    ],
    mobileShowcase: {
      eyebrow: "Interactive Mobile Screens",
      heading: "Designed for HR & Team Leaders",
      note: "Scroll inside each phone mockup to explore the full mobile layouts, from the HR Taka Tracker and Crime Report review to the Party Sponsors leaderboard and Team Leader reporting form.",
      variant: "device-mockup",
      screens: [
        {
          src: "/assets/aistudio/image_aab4e900.png",
          title: "HR Dashboard",
          caption:
            "The Taka Tracker separates collected money, outstanding dues and the total amount. Quick statistics, contributor highlights and recent reports bring the month's activity into the same view.",
          scrollable: true,
        },
        {
          src: "/assets/aistudio/image_3e3b41ba.png",
          title: "Crime Report",
          caption:
            "Each report brings together the team member, broken rule, fine, payment deadline, status and supporting evidence. HR can review this context before acknowledging the incident and notifying the team member.",
          scrollable: true,
        },
        {
          src: "/assets/aistudio/image_f436af9e.png",
          title: "Party Sponsors",
          caption:
            "A contribution leaderboard with a playful identity. The highlighted sponsor's total, paid amount and remaining dues sit alongside the monthly rankings, making the fund part of the app's social story.",
          scrollable: true,
        },
        {
          src: "/assets/aistudio/image_1a44a187.png",
          title: "Team Leader Dashboard",
          caption:
            "Team statistics and contributor highlights sit above the reporting form. The invitation to \"Be a SNITCH!\" adds humour to a task with straightforward inputs.",
          scrollable: true,
        },
      ],
      groups: [
        {
          id: "hr-view",
          eyebrow: "01 · For HR",
          title: "For HR: Every Contribution in View",
          description:
            "The HR experience brings monthly collections, outstanding dues and recent reports into one place. Incident details support review, while the Party Sponsors leaderboard connects individual contributions to the shared celebration.",
          screens: [
            {
              src: "/assets/aistudio/image_aab4e900.png",
              title: "HR Dashboard",
              caption:
                "The Taka Tracker separates collected money, outstanding dues and the total amount. Quick statistics, contributor highlights and recent reports bring the month's activity into the same view.",
              scrollable: true,
            },
            {
              src: "/assets/aistudio/image_3e3b41ba.png",
              title: "Crime Report",
              caption:
                "Each report brings together the team member, broken rule, fine, payment deadline, status and supporting evidence. HR can review this context before acknowledging the incident and notifying the team member.",
              scrollable: true,
            },
            {
              src: "/assets/aistudio/image_f436af9e.png",
              title: "Party Sponsors",
              caption:
                "A contribution leaderboard with a playful identity. The highlighted sponsor's total, paid amount and remaining dues sit alongside the monthly rankings, making the fund part of the app's social story.",
              scrollable: true,
            },
          ],
        },
        {
          id: "team-leader-view",
          eyebrow: "02 · For Team Leaders",
          title: "For Team Leaders: Report the Moment",
          description:
            "The Team Leader Dashboard combines a team overview with the reporting form. Selecting a team member, choosing the broken rule, entering the fine and attaching evidence keeps the reporting task together.",
          companionNote: {
            label: "Companion View · Explored in Sketch 03",
            title: "Criminal Profile",
            detail:
              "An individual contribution record with personality. Monthly rule summaries, playful nicknames and a humorous personal story sit alongside contribution details and food comparisons that bring the shared meal into focus.",
          },
          screens: [
            {
              src: "/assets/aistudio/image_1a44a187.png",
              title: "Team Leader Dashboard",
              caption:
                "Team statistics and contributor highlights sit above the reporting form. The invitation to \"Be a SNITCH!\" adds humour to a task with straightforward inputs.",
              scrollable: true,
            },
          ],
        },
      ],
    },
    approach:
      "Paired a playful palette, cheeky office nicknames and shared food comparisons with unmistakable Taka totals, clear payment statuses and direct reporting forms.",
    deliverables: [
      "HR & Team Leader UI",
      "Incident Reporting Flow",
      "Fund Leaderboard UX",
    ],
    processHeading: "From Office Moments to Interface Ideas",
    processNavLabel: "Sketches",
    processEyebrow: "Retrospective Concept Explorations",
    processIntro:
      "The sketches connect familiar office situations with the main tasks in the app: recording a rule break, reviewing the report, tracking contributions and bringing the team together for the monthly party.",
    processVisuals: [
      {
        src: "/assets/aistudio/Benevolent_Pay_office_storyboard-1_c262bfe3.png",
        title: "01 · Office Moments Storyboard",
        caption:
          "Retrospective concept explorations based on the final interface. Traces everyday office slip ups from late arrivals and loose shoes to quick reporting, HR review, tracking the shared fund and sharing the monthly celebration.",
      },
      {
        src: "/assets/aistudio/Benevolent_Pay_wireframe_sketch_sheet-2_931b7153.png",
        title: "02 · Working Through the Essentials",
        caption:
          "Retrospective concept explorations based on the final interface. Maps the core structure across the Team Leader reporting view, HR Crime Report review and HR Taka Tracker overview.",
      },
      {
        src: "/assets/aistudio/Retrospective_fund_interface_sketch_study-3_fcf8f047.png",
        title: "03 · Giving the Fund a Personality (Party Sponsors & Criminal Profile)",
        caption:
          "Retrospective concept explorations based on the final interface. Explores how Party Sponsors rankings and the Criminal Profile pair monthly top crimes, playful nicknames and personal stories with contribution totals and food comparisons.",
      },
    ],
    keyDesignAreasHeading: "Light in Tone. Clear About Money.",
    keyDesignAreasSubheading: "Visual Character & Structure",
    keyDesignAreasNavLabel: "Tone & Money",
    keyDesignAreas: [
      {
        title: "Playful palette & card hierarchy",
        detail:
          "Sky blue, lavender, coral and dark navy give the interface its playful character. Distinct cards organise summaries, contributor rankings and incident records without visual clutter.",
      },
      {
        title: "Humour & personality in copy",
        detail:
          "The humour runs through the nicknames, report titles, \"Be a SNITCH!\" prompts and Criminal Profile stories, turning everyday rule breaks into shared office banter.",
      },
      {
        title: "Direct financial clarity",
        detail:
          "Prominent BDT amounts, separated Collected, Due and Total cards, labelled payment states and straightforward reporting fields keep every financial detail unmistakable.",
      },
    ],
    outcomesNavLabel: "Reflection",
    outcome:
      "Created a dual-role mobile concept that turns lighthearted office rule breaks into a transparent monthly party fund for HR and team leaders.",
    reflection:
      "Benevolent Pay was an exercise in balancing warmth and structure. Playful copy, expressive colour accents and food comparisons make everyday office accountability feel friendly rather than rigid, while crisp card hierarchy, prominent BDT figures and unmistakable Paid or Not Paid states ensure the shared fund stays completely trustworthy.",
  },
];

export const PHOTO_ITEMS: PhotoItem[] = [
  {
    id: "people-01",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/51577409065_8b160cec0c_b_fb6742df.jpg",
    width: 1024,
    height: 860,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-02",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/51721141298_2500caecc4_b_acdcc3a4.jpg",
    width: 777,
    height: 1024,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-03",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/psx_20201103_191750_50563770371_l_af686205.jpg",
    width: 1023,
    height: 713,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-04",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/psx_20210218_224753_50959234343_l_34c71513.jpg",
    width: 1024,
    height: 685,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-05",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/53182317168_ef24bbee65_b_3aa585f4.jpg",
    width: 812,
    height: 1024,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-06",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/53182260850_2b17f7c92c_b_448cc53e.jpg",
    width: 1024,
    height: 683,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-07",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/51721554004_924db8277a_b_b91a1d84.jpg",
    width: 1024,
    height: 683,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-08",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/psx_20201028_215438_50540737883_l_b61e806a.jpg",
    width: 1024,
    height: 766,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-09",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/psx_20201026_220237_50532786183_l_ef825725.jpg",
    width: 1024,
    height: 812,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-10",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/mom_50555450323_l_f0f66fda.jpg",
    width: 1024,
    height: 862,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-11",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/magic_28773663276_l_1559e81e.jpg",
    width: 1024,
    height: 950,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-12",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_eddd4833_46353231222_l_17071549.jpg",
    width: 1024,
    height: 798,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-13",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_9955_39914794170_l_58e4ca5c.jpg",
    width: 648,
    height: 1024,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-14",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_9327ed_49029394373_l_9236f51d.jpg",
    width: 692,
    height: 1024,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-15",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_4946_50959234228_l_cabd5b3a.jpg",
    width: 604,
    height: 1024,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-16",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_4539-2_50785069763_l_715e7539.jpg",
    width: 1024,
    height: 772,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-17",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/child_50558181827_l_34beeeff.jpg",
    width: 1023,
    height: 783,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-18",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/_dsc2668_35494011510_l_d116c843.jpg",
    width: 668,
    height: 1024,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-19",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/2020-10-20_06-51-27_50509597567_l_50e9fb07.jpg",
    width: 1024,
    height: 692,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-20",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/51576489981_2fb9424162_b_e5774cda.jpg",
    width: 1024,
    height: 820,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-21",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/51577361631_7af2f9c866_b_28327d6a.jpg",
    width: 699,
    height: 1024,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-22",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/51684607371_ac3d4d5a4f_b_4d2f007a.jpg",
    width: 1024,
    height: 723,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-23",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/51649197306_cc03d17cb1_b_1363a993.jpg",
    width: 1024,
    height: 629,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-24",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/51576551642_6df8ae2041_b_cb8fede8.jpg",
    width: 1024,
    height: 683,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "people-25",
    title: "",
    genre: "People",
    location: "",
    year: "",
    image: "/assets/aistudio/2020-11-04_02-35-54_50563488238_l_57acd140.jpg",
    width: 1024,
    height: 700,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "concert-01",
    title: "",
    genre: "Concert",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_0970_49509400311_l_73a08806.jpg",
    width: 1024,
    height: 748,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "concert-02",
    title: "",
    genre: "Concert",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_0831_49509398071_l_23008517.jpg",
    width: 683,
    height: 1024,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "concert-03",
    title: "",
    genre: "Concert",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_0971_49508894543_l_74a0c91b.jpg",
    width: 1024,
    height: 733,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "concert-04",
    title: "",
    genre: "Concert",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_0827-2_49508892723_l_f27aea92.jpg",
    width: 1024,
    height: 683,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "concert-05",
    title: "",
    genre: "Concert",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_0676_49509632397_l_02f9ceb3.jpg",
    width: 1024,
    height: 640,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "conceptual-01",
    title: "",
    genre: "Conceptual",
    location: "",
    year: "",
    image: "/assets/aistudio/psx_20201031_191741_50552111737_l_4b5a9767.jpg",
    width: 1024,
    height: 771,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "conceptual-02",
    title: "",
    genre: "Conceptual",
    location: "",
    year: "",
    image: "/assets/aistudio/psx_20201031_171226__01_50552110107_l_786be82e.jpg",
    width: 1024,
    height: 704,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "conceptual-03",
    title: "",
    genre: "Conceptual",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_3796__01_50551981141_l_fb723572.jpg",
    width: 1024,
    height: 683,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "conceptual-04",
    title: "",
    genre: "Conceptual",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_3787_50552110802_l_5f1aa18d.jpg",
    width: 1023,
    height: 694,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "conceptual-05",
    title: "",
    genre: "Conceptual",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_3768_50552111822_l_e6ba7368.jpg",
    width: 1024,
    height: 809,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "conceptual-06",
    title: "",
    genre: "Conceptual",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_3749_50551247023_l_b9ba282d.jpg",
    width: 1024,
    height: 683,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "conceptual-07",
    title: "",
    genre: "Conceptual",
    location: "",
    year: "",
    image: "/assets/aistudio/2020-10-23_02-45-45_50517960932_l_7c22f120.jpg",
    width: 1024,
    height: 773,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "still-life-01",
    title: "",
    genre: "Still Life",
    location: "",
    year: "",
    image: "/assets/aistudio/2020-10-04_11-41-31_50418469861_l_9ba0dab8.jpg",
    width: 1024,
    height: 692,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "still-life-02",
    title: "",
    genre: "Still Life",
    location: "",
    year: "",
    image: "/assets/aistudio/2020-10-13_08-54-14_50470207608_l_0864f031.jpg",
    width: 683,
    height: 1024,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "still-life-03",
    title: "",
    genre: "Still Life",
    location: "",
    year: "",
    image: "/assets/aistudio/2020-10-23_02-45-45_50517960932_l_7c22f120.jpg",
    width: 1024,
    height: 773,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "still-life-04",
    title: "",
    genre: "Still Life",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_4775_50888087072_l_f2596248.jpg",
    width: 1024,
    height: 683,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "still-life-05",
    title: "",
    genre: "Still Life",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_2632-2_50443756273_l_00ddf8f1.jpg",
    width: 1024,
    height: 767,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "still-life-06",
    title: "",
    genre: "Still Life",
    location: "",
    year: "",
    image: "/assets/aistudio/psx_20201009_200950_50442095882_l_9746fbc0.jpg",
    width: 1024,
    height: 683,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "still-life-07",
    title: "",
    genre: "Still Life",
    location: "",
    year: "",
    image: "/assets/aistudio/psx_20210701_180955_51283874842_l_844ea8e0.jpg",
    width: 1024,
    height: 693,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "still-life-08",
    title: "",
    genre: "Still Life",
    location: "",
    year: "",
    image: "/assets/aistudio/50524364918_c6a9110049_b_a7998baa.jpg",
    width: 1024,
    height: 501,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "animal-kingdom-01",
    title: "",
    genre: "Animal Kingdom",
    location: "",
    year: "",
    image: "/assets/aistudio/psx_20200922_015316_50368340028_l_2a0b0dbd.jpg",
    width: 1024,
    height: 733,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "animal-kingdom-02",
    title: "",
    genre: "Animal Kingdom",
    location: "",
    year: "",
    image: "/assets/aistudio/psx_20180802_233821_43949906562_l_111945ac.jpg",
    width: 1024,
    height: 761,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "animal-kingdom-03",
    title: "",
    genre: "Animal Kingdom",
    location: "",
    year: "",
    image: "/assets/aistudio/love_43192227441_l_76844648.jpg",
    width: 1024,
    height: 630,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "animal-kingdom-04",
    title: "",
    genre: "Animal Kingdom",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_9238_40023113801_l_0f5fdf9e.jpg",
    width: 683,
    height: 1024,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "animal-kingdom-05",
    title: "",
    genre: "Animal Kingdom",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_5247-2_46404122961_l_38933ab2.jpg",
    width: 1024,
    height: 683,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "animal-kingdom-06",
    title: "",
    genre: "Animal Kingdom",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_4392_38527401032_l_f43d1b7a.jpg",
    width: 1023,
    height: 741,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "animal-kingdom-07",
    title: "",
    genre: "Animal Kingdom",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_4367_37842285624_l_4ba498b7.jpg",
    width: 1024,
    height: 683,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "animal-kingdom-08",
    title: "",
    genre: "Animal Kingdom",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_3790-3_37141521133_l_1fc174dd.jpg",
    width: 1024,
    height: 683,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "animal-kingdom-09",
    title: "",
    genre: "Animal Kingdom",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_2996_36522808025_l_0c358b6d.jpg",
    width: 1024,
    height: 639,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "animal-kingdom-10",
    title: "",
    genre: "Animal Kingdom",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_2305_50369204442_l_9cb36ce1.jpg",
    width: 1024,
    height: 769,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "animal-kingdom-11",
    title: "",
    genre: "Animal Kingdom",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_2256-2_50368337633_l_80d23e76.jpg",
    width: 1024,
    height: 755,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "animal-kingdom-12",
    title: "",
    genre: "Animal Kingdom",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_1926_50345527363_l_dcbb8698.jpg",
    width: 875,
    height: 1024,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "animal-kingdom-13",
    title: "",
    genre: "Animal Kingdom",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_1910-2_50369204197_l_83a27729.jpg",
    width: 1023,
    height: 709,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "animal-kingdom-14",
    title: "",
    genre: "Animal Kingdom",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_1856_50345549218_l_36400529.jpg",
    width: 1024,
    height: 707,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "animal-kingdom-15",
    title: "",
    genre: "Animal Kingdom",
    location: "",
    year: "",
    image: "/assets/aistudio/2021-01-03_04-18-33_50794928317_l_0bc9b838.jpg",
    width: 1024,
    height: 683,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "animal-kingdom-16",
    title: "",
    genre: "Animal Kingdom",
    location: "",
    year: "",
    image: "/assets/aistudio/_dsc2861-2_35841319396_l_40359f8b.jpg",
    width: 1024,
    height: 696,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "animal-kingdom-17",
    title: "",
    genre: "Animal Kingdom",
    location: "",
    year: "",
    image: "/assets/aistudio/_dsc0547_33149934715_l_52f3e16c.jpg",
    width: 1023,
    height: 686,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "animal-kingdom-18",
    title: "",
    genre: "Animal Kingdom",
    location: "",
    year: "",
    image: "/assets/aistudio/_dsc0550_33108416646_l_dd39e24e.jpg",
    width: 688,
    height: 1024,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "animal-kingdom-19",
    title: "",
    genre: "Animal Kingdom",
    location: "",
    year: "",
    image: "/assets/aistudio/53714110692_98bcb81f84_b_82eaa500.jpg",
    width: 728,
    height: 1023,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "documentary-01",
    title: "",
    genre: "Documentary",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_1727-2_35749572762_l_a0a8cc54.jpg",
    width: 1024,
    height: 768,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "documentary-02",
    title: "",
    genre: "Documentary",
    location: "",
    year: "",
    image: "/assets/aistudio/51721554004_924db8277a_b_b91a1d84.jpg",
    width: 1024,
    height: 683,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "documentary-03",
    title: "",
    genre: "Documentary",
    location: "",
    year: "",
    image: "/assets/aistudio/28826064240_b1abe51639_oc_29595471850_l_804b2dd0.jpg",
    width: 1024,
    height: 562,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "documentary-04",
    title: "",
    genre: "Documentary",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_0062-3_35072654823_l_103b83a9.jpg",
    width: 703,
    height: 1024,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "documentary-05",
    title: "",
    genre: "Documentary",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_0659_35882007605_l_50d95e25.jpg",
    width: 683,
    height: 1024,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "documentary-06",
    title: "",
    genre: "Documentary",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_1539-2_43775248544_l_0d40bfff.jpg",
    width: 1023,
    height: 625,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "documentary-07",
    title: "",
    genre: "Documentary",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_1620-3_35841154136_l_043f096b.jpg",
    width: 1023,
    height: 697,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "documentary-08",
    title: "",
    genre: "Documentary",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_1759-2_35787361591_l_2be6023b.jpg",
    width: 1024,
    height: 683,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "documentary-09",
    title: "",
    genre: "Documentary",
    location: "",
    year: "",
    image: "/assets/aistudio/dsc_4839eeddttt_31464600367_l_7d4b5bba.jpg",
    width: 1024,
    height: 699,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "documentary-10",
    title: "",
    genre: "Documentary",
    location: "",
    year: "",
    image: "/assets/aistudio/psx_20180731_215704_43092522835_l_1facc0bf.jpg",
    width: 1023,
    height: 554,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "documentary-11",
    title: "",
    genre: "Documentary",
    location: "",
    year: "",
    image: "/assets/aistudio/psx_20210320_235235_51331413457_l_c1564820.jpg",
    width: 532,
    height: 1024,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "documentary-12",
    title: "",
    genre: "Documentary",
    location: "",
    year: "",
    image: "/assets/aistudio/psx_20210326_144932_51331413467_l_ae69e174.jpg",
    width: 1023,
    height: 569,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "documentary-13",
    title: "",
    genre: "Documentary",
    location: "",
    year: "",
    image: "/assets/aistudio/psx_20210723_230207_51333128725_l_2ce7c8ff.jpg",
    width: 683,
    height: 1024,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "documentary-14",
    title: "",
    genre: "Documentary",
    location: "",
    year: "",
    image: "/assets/aistudio/psx_20210722_014408_51332133821_l_2431fa2b.jpg",
    width: 768,
    height: 1024,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
  {
    id: "documentary-15",
    title: "",
    genre: "Documentary",
    location: "",
    year: "",
    image: "/assets/aistudio/psx_20210724_220825_51333128785_l_96631b46.jpg",
    width: 1023,
    height: 749,
    camera: "",
    lens: "",
    settings: "",
    story: "",
  },
];

export const EXPERIENCE_LIST: ExperienceItem[] = [
  {
    period: "2020 - 2024",
    role: "Product Designer, UX Researcher & Communication Expert",
    place: "DPHE & GWSC · Dhaka",
    discipline: "Design",
    detail:
      "Led the Phase II upscaling UX for the National Sanitation Dashboard (NSD), unifying data visualization, survey workflows, city comparisons, and bilingual Bangla-English access across 80+ Paurashavas.",
  },
  {
    period: "2022",
    role: "Product Designer, UX Researcher & Trainer",
    place: "Planning Commission, GoB · Dhaka",
    discipline: "Design",
    detail:
      "Designed the GIS-based Planning Information System (PLIS) from needs assessments with 40+ officers through spatial climate risk screening, usability testing, and hands-on training for 60+ users.",
  },
  {
    period: "2023 - NOW",
    role: "Product & Editorial Designer",
    place: "Dhaka · Remote",
    discipline: "Design",
    detail:
      "Crafting digital health PWAs, low-connectivity Bangla QR ride-sharing payment flows, Dhaka Metro Rail display concepts, mobile bakery ordering, illustrated menus, booklets, and film poster studies.",
  },
  {
    period: "ONGOING",
    role: "Freelance Photographer",
    place: "Dhaka · Flickr Photostream",
    discipline: "Photography",
    detail:
      "Documenting people, live concerts, conceptual studies, still life, and the animal kingdom with both dedicated cameras and everyday smartphone walks, with prints available on request.",
  },
];
