import test from "node:test";
import assert from "node:assert/strict";
import type { DesignProject, PhotoItem } from "../data/portfolio";
import {
  buildFeaturedHighlights,
  filterDesignProjects,
  filterHighlights,
  filterPhotoItems,
  formatCount,
  getAdjacentItemId,
  getCaseStudySections,
  getEditorialSpreadPages,
  getNextSlideIndex,
  splitParagraphs,
  stepEditorialPage,
  validateContactForm,
} from "./portfolioLogic";

const SAMPLE_DESIGN: DesignProject[] = [
  {
    id: "nsd",
    title: "National Sanitation Dashboard (NSD)",
    subtitle: "GovTech · Data Platform",
    category: "GovTech",
    year: "2024",
    client: "Department of Public Health Engineering · DPHE",
    role: "Product Designer · UX Researcher · Communication Expert",
    liveUrl: "https://www.sanboard.gov.bd",
    image: "/assets/aistudio/Cover_0575afc4.png",
    imageFit: "contain",
    wide: true,
    summary: "National sanitation data platform",
    challenge: "Challenge",
    approach: "Approach NSD",
    deliverables: ["Dashboard Redesign", "City Comparison"],
    outcome: "126+ towns represented",
  },
  {
    id: "plis",
    title: "Planning Information System (PLIS)",
    subtitle: "GovTech · GIS Platform",
    category: "GovTech",
    year: "2022",
    client: "Planning Commission, GoB",
    role: "Product Designer · UX Researcher · Trainer",
    image: "/assets/aistudio/plis-project-hero_5e2c9844.png",
    imageFit: "contain",
    summary: "GIS based decision support platform",
    challenge: "Challenge",
    approach: "Approach PLIS",
    deliverables: ["Needs Assessment", "GIS UX"],
    outcome: "40+ officers interviewed",
  },
  {
    id: "whatsapp-anc",
    title: "WhatsApp MCC & PWA (ANC Caregivers)",
    subtitle: "Digital Health · Conversational UX & PWA",
    category: "Digital Health",
    year: "2025",
    client: "ANC Caregiver Program",
    role: "Product Designer · UX Researcher",
    image: "/wa.png",
    summary: "Antenatal caregiver support",
    challenge: "Challenge",
    approach: "Approach",
    deliverables: ["WhatsApp UX", "Embedded PWA"],
    outcome: "Outcome",
  },
  {
    id: "bike-lagbe",
    title: "Bike Lagbe: Bangla QR Payment",
    subtitle: "Ride Sharing · Bangla QR & Low-Connectivity UX",
    category: "Fintech",
    year: "2025",
    client: "Bike Lagbe",
    role: "Product Designer",
    image: "/bike.jpg",
    wide: true,
    summary: "Ride sharing Bangla QR concept",
    challenge: "Challenge",
    approach: "Approach",
    deliverables: ["Rider & Driver UI", "Bangla QR Flow"],
    outcome: "Outcome",
  },
];

const SAMPLE_PHOTOS: PhotoItem[] = [
  {
    id: "midnight-riders",
    title: "Midnight Riders",
    genre: "Street",
    location: "Saigon",
    year: "2024",
    image: "/saigon.jpg",
    camera: "Leica M6",
    lens: "35mm",
    settings: "f/2.0",
    story: "Saigon night",
  },
  {
    id: "passing-through",
    title: "Passing Through",
    genre: "Street",
    location: "Hong Kong",
    year: "2023",
    image: "/hk.jpg",
    camera: "Leica M6",
    lens: "35mm",
    settings: "f/2.8",
    story: "Hong Kong tram",
  },
  {
    id: "last-green",
    title: "Last Green",
    genre: "Documentary",
    location: "Seoul",
    year: "2023",
    image: "/seoul.jpg",
    camera: "Leica Q2",
    lens: "28mm",
    settings: "f/1.7",
    story: "Seoul dusk",
  },
];

test("filterDesignProjects returns all items for All and filters by category", () => {
  assert.equal(filterDesignProjects(SAMPLE_DESIGN, "All").length, 4);
  const govTech = filterDesignProjects(SAMPLE_DESIGN, "GovTech");
  assert.equal(govTech.length, 2);
  assert.deepEqual(
    govTech.map((p) => p.id),
    ["nsd", "plis"],
  );
  const digitalHealth = filterDesignProjects(SAMPLE_DESIGN, "Digital Health");
  assert.equal(digitalHealth.length, 1);
  assert.equal(digitalHealth[0].id, "whatsapp-anc");
  const fintech = filterDesignProjects(SAMPLE_DESIGN, "Fintech");
  assert.equal(fintech.length, 1);
  assert.equal(fintech[0].id, "bike-lagbe");
});

test("filterPhotoItems filters photography frames by genre", () => {
  assert.equal(filterPhotoItems(SAMPLE_PHOTOS, "All").length, 3);
  const street = filterPhotoItems(SAMPLE_PHOTOS, "Street");
  assert.equal(street.length, 2);
  const documentary = filterPhotoItems(SAMPLE_PHOTOS, "Documentary");
  assert.equal(documentary.length, 1);
  assert.equal(documentary[0].title, "Last Green");
  assert.equal(filterPhotoItems(SAMPLE_PHOTOS, "Nature").length, 0);
});

test("buildFeaturedHighlights interleaves design and photo highlights and filterHighlights filters them", () => {
  const highlights = buildFeaturedHighlights(SAMPLE_DESIGN, SAMPLE_PHOTOS);
  assert.equal(highlights.length, 4);
  assert.deepEqual(
    highlights.map((h) => h.title),
    [
      "National Sanitation Dashboard (NSD)",
      "Midnight Riders",
      "Planning Information System (PLIS)",
      "Passing Through",
    ],
  );
  assert.deepEqual(
    highlights.map((h) => h.sourceId),
    ["nsd", "midnight-riders", "plis", "passing-through"],
  );
  assert.equal(highlights[0].imageFit, "contain");
  assert.equal(highlights[2].imageFit, "contain");
  assert.equal(filterHighlights(highlights, "All").length, 4);
  assert.equal(filterHighlights(highlights, "Product Design").length, 2);
  assert.equal(filterHighlights(highlights, "Photography").length, 2);
});

test("getAdjacentItemId wraps around forward and backward", () => {
  assert.equal(getAdjacentItemId(SAMPLE_DESIGN, "nsd", "next"), "plis");
  assert.equal(getAdjacentItemId(SAMPLE_DESIGN, "bike-lagbe", "next"), "nsd");
  assert.equal(getAdjacentItemId(SAMPLE_DESIGN, "nsd", "prev"), "bike-lagbe");
  assert.equal(getAdjacentItemId([], "nsd", "next"), null);
});

test("formatCount pads single digits with leading zero", () => {
  assert.equal(formatCount(4), "04");
  assert.equal(formatCount(12), "12");
});

test("validateContactForm validates required fields and rejects bad inputs", () => {
  const invalid = validateContactForm({
    name: "A",
    email: "not-an-email",
    topic: "Product Design",
    message: "Too short",
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.message);

  const valid = validateContactForm({
    name: "Maya Lin",
    email: "maya@studio.co",
    topic: "Both",
    message: "Looking to collaborate on a hardware product launch in Q2.",
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test("getCaseStudySections builds section jump links for rich and standard case studies", () => {
  const richProject: DesignProject = {
    ...SAMPLE_DESIGN[0],
    overview: "Overview text",
    backgroundMilestones: [{ tag: "2020", title: "Start", detail: "Detail" }],
    challengePoints: [{ title: "Gap", detail: "Detail" }],
    contributions: [{ title: "Redesign", detail: "Detail" }],
    mobileShowcase: {
      eyebrow: "Mobile",
      heading: "Mobile View",
      screens: [{ src: "/m.jpg", title: "Home", caption: "Home screen" }],
    },
    processSteps: [{ phase: "Understand", title: "Audit", detail: "Detail" }],
    keyDesignAreas: [{ title: "Dashboard", detail: "Detail" }],
    beforeAfter: [{ before: "Old", after: "New" }],
  };

  const richSections = getCaseStudySections(richProject);
  assert.deepEqual(
    richSections.map((s) => s.label),
    [
      "Overview",
      "Background",
      "Challenge",
      "Contribution",
      "Mobile",
      "Process",
      "Key Areas",
      "Before & After",
      "Outcomes",
    ],
  );

  const curatedPlisSections = getCaseStudySections({
    ...SAMPLE_DESIGN[1],
    overview: "PLIS overview",
    challengePoints: [{ title: "Gap", detail: "Detail" }],
    contributions: [{ title: "Research", detail: "Detail" }],
    processSteps: [{ phase: "01", title: "Listen", detail: "Detail" }],
    keyDesignAreas: [{ title: "GIS", detail: "Detail" }],
  });
  assert.deepEqual(
    curatedPlisSections.map((s) => s.label),
    ["Overview", "Challenge", "Contribution", "Process", "Key Areas", "Outcomes"],
  );

  const curatedMobileSections = getCaseStudySections({
    ...SAMPLE_DESIGN[1],
    overview: "Mobile companion overview",
    challengePoints: [{ title: "Drop-off", detail: "Detail" }],
    mobileShowcase: {
      eyebrow: "Mobile UI",
      heading: "Companion & PWA",
      variant: "device-mockup",
      screens: [{ src: "/screen.png", title: "Triage", caption: "Flow", scrollable: true }],
    },
    processSteps: [{ phase: "01", title: "Audit", detail: "Detail" }],
    keyDesignAreas: [{ title: "Voice-First", detail: "Detail" }],
  });
  assert.deepEqual(
    curatedMobileSections.map((s) => s.label),
    ["Overview", "Challenge", "Mobile", "Process", "Key Areas", "Outcomes"],
  );

  const conciseConceptSections = getCaseStudySections({
    ...SAMPLE_DESIGN[2],
    category: "Transit",
    overview: "Daily Dhaka Metro Rail observation",
    processNavLabel: "Exploration",
    processVisuals: [
      { src: "/brain-map.png", title: "Brain Map", caption: "Commute questions" },
    ],
    keyDesignAreasNavLabel: "Strategies",
    keyDesignAreas: [
      { title: "Make the brand colors work", detail: "Detail" },
      { title: "Concise delivery of updates", detail: "Detail" },
      { title: "More information through the MRT 6 map", detail: "Detail" },
    ],
    outcomesNavLabel: "Reflection",
  });
  assert.deepEqual(
    conciseConceptSections.map((s) => s.label),
    ["Overview", "Exploration", "Strategies", "Reflection"],
  );

  const standardSections = getCaseStudySections(SAMPLE_DESIGN[2]);
  assert.deepEqual(
    standardSections.map((s) => s.label),
    ["Challenge", "Approach", "Outcome"],
  );
});

test("splitParagraphs splits blank-line separated text into trimmed paragraphs", () => {
  assert.deepEqual(
    splitParagraphs("First paragraph.\n\n  Second paragraph.  \n\n\nThird."),
    ["First paragraph.", "Second paragraph.", "Third."],
  );
  assert.deepEqual(splitParagraphs("   "), []);
});

test("getNextSlideIndex wraps cleanly forward and backward", () => {
  assert.equal(getNextSlideIndex(0, 1, 2), 1);
  assert.equal(getNextSlideIndex(1, 1, 2), 0);
  assert.equal(getNextSlideIndex(0, -1, 2), 1);
  assert.equal(getNextSlideIndex(1, -1, 3), 0);
  assert.equal(getNextSlideIndex(0, 1, 0), 0);
});

test("editorial reader page & spread navigation steps accurately and clamps boundaries", () => {
  // Single page mode
  assert.deepEqual(getEditorialSpreadPages(0, 8, "single"), [0]);
  assert.deepEqual(getEditorialSpreadPages(3, 8, "single"), [3]);
  assert.equal(stepEditorialPage(0, -1, 8, "single"), 0);
  assert.equal(stepEditorialPage(0, 1, 8, "single"), 1);
  assert.equal(stepEditorialPage(7, 1, 8, "single"), 7);

  // Spread mode: cover solo, interior pairs, trailing even back cover solo
  assert.deepEqual(getEditorialSpreadPages(0, 8, "spread"), [0]);
  assert.deepEqual(getEditorialSpreadPages(1, 8, "spread"), [1, 2]);
  assert.deepEqual(getEditorialSpreadPages(2, 8, "spread"), [1, 2]);
  assert.deepEqual(getEditorialSpreadPages(7, 8, "spread"), [7]);

  assert.equal(stepEditorialPage(0, 1, 8, "spread"), 1);
  assert.equal(stepEditorialPage(1, 1, 8, "spread"), 3);
  assert.equal(stepEditorialPage(5, 1, 8, "spread"), 7);
  assert.equal(stepEditorialPage(7, 1, 8, "spread"), 7);
  assert.equal(stepEditorialPage(7, -1, 8, "spread"), 5);
  assert.equal(stepEditorialPage(1, -1, 8, "spread"), 0);
  assert.equal(stepEditorialPage(2, -1, 8, "spread"), 0);

  // Editorial case study sections stay concise (Read + Details)
  const editorialSections = getCaseStudySections({
    ...SAMPLE_DESIGN[2],
    category: "Editorial",
    editorialDocument: {
      pdfUrl: "/sample.pdf",
      pdfLabel: "Open Full PDF",
      formatLabel: "8-Page Booklet",
      pages: [
        { src: "/p1.jpg", title: "Cover" },
        { src: "/p2.jpg", title: "Page 2" },
      ],
    },
  });
  assert.deepEqual(
    editorialSections.map((s) => s.label),
    ["Read", "Details"],
  );
});

test("portfolio data has no em/en-dashes, excludes template projects, and includes all 4 social links", async () => {
  const { readFileSync } = await import("node:fs");
  const { resolve } = await import("node:path");
  const portfolioSrc = readFileSync(resolve(process.cwd(), "src/data/portfolio.ts"), "utf8");

  assert.equal(portfolioSrc.includes("\u2014"), false, "portfolio.ts must not contain em-dashes");
  assert.equal(portfolioSrc.includes("\u2013"), false, "portfolio.ts must not contain en-dashes");
  assert.equal(portfolioSrc.includes("oral-lab"), false, "Oral Lab template project must be removed");
  assert.equal(portfolioSrc.includes("after-eight"), false, "After Eight template project must be removed");
  assert.equal(portfolioSrc.includes("https://www.linkedin.com/in/sadmanrahmand/"), true);
  assert.equal(portfolioSrc.includes("https://www.facebook.com/sdhruba"), true);
  assert.equal(portfolioSrc.includes("https://www.youtube.com/@thetechytrippers3410"), true);
  assert.equal(portfolioSrc.includes("https://www.flickr.com/photos/137565099@N07/"), true);
});


