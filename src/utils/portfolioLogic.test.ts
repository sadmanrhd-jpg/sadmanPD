import test from "node:test";
import assert from "node:assert/strict";
import type { DesignProject, PhotoItem } from "../data/portfolio";
import {
  advancePosterCoverCycle,
  buildContactEmailPlainText,
  buildContactEmailSubject,
  buildContactMailtoHref,
  buildContactSubmissionPayload,
  buildFeaturedHighlights,
  buildGmailComposeUrl,
  buildPosterBentoRows,
  CONTACT_API_ENDPOINT,
  CONTACT_RECIPIENT_EMAIL,
  filterDesignProjects,
  formatContactTopicLabel,
  filterHighlights,
  filterPhotoItems,
  formatCount,
  getAdjacentItemId,
  getCaseStudySections,
  getEditorialSpreadPages,
  getGalleryScrollTarget,
  getNextSlideIndex,
  getSwipeFlipProgress,
  shouldUseEditorialPageFlip,
  sortPostersAlphabetically,
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
    id: "people-01",
    title: "Evening Portrait",
    genre: "People",
    location: "Dhaka",
    year: "2024",
    image: "/dhaka-portrait.jpg",
    camera: "Nikon",
    lens: "50mm",
    settings: "f/2.0",
    story: "Warm evening portrait",
  },
  {
    id: "documentary-01",
    title: "Market Morning",
    genre: "Documentary",
    location: "Old Dhaka",
    year: "2023",
    image: "/old-dhaka.jpg",
    camera: "Nikon",
    lens: "35mm",
    settings: "f/2.8",
    story: "Quiet morning alley",
  },
  {
    id: "still-life-01",
    title: "Glass Study",
    genre: "Still Life",
    location: "Dhaka",
    year: "2023",
    image: "/glass.jpg",
    camera: "Nikon",
    lens: "50mm",
    settings: "f/1.8",
    story: "Chess king study",
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
  const people = filterPhotoItems(SAMPLE_PHOTOS, "People");
  assert.equal(people.length, 1);
  const documentary = filterPhotoItems(SAMPLE_PHOTOS, "Documentary");
  assert.equal(documentary.length, 1);
  assert.equal(documentary[0].title, "Market Morning");
  assert.equal(filterPhotoItems(SAMPLE_PHOTOS, "Concert").length, 0);
});

test("buildFeaturedHighlights interleaves design and photo highlights and filterHighlights filters them", () => {
  const highlights = buildFeaturedHighlights(SAMPLE_DESIGN, SAMPLE_PHOTOS);
  assert.equal(highlights.length, 4);
  assert.deepEqual(
    highlights.map((h) => h.title),
    [
      "National Sanitation Dashboard (NSD)",
      "Evening Portrait",
      "Planning Information System (PLIS)",
      "Market Morning",
    ],
  );
  assert.deepEqual(
    highlights.map((h) => h.sourceId),
    ["nsd", "people-01", "plis", "documentary-01"],
  );
  assert.equal(highlights[0].imageFit, "contain");
  assert.equal(highlights[1].photoGenre, "People");
  assert.equal(highlights[2].imageFit, "contain");
  assert.equal(highlights[3].photoGenre, "Documentary");
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

test("contact email payload, subject line, plain-text body, and Gmail compose URL target sadmanrhd@gmail.com without FormSubmit", async () => {
  assert.equal(CONTACT_RECIPIENT_EMAIL, "sadmanrhd@gmail.com");
  assert.equal(CONTACT_API_ENDPOINT, "/api/contact");
  assert.equal(formatContactTopicLabel("Product Design"), "Product Design");
  assert.equal(formatContactTopicLabel("Street Photography"), "Photography");
  assert.equal(formatContactTopicLabel("Both"), "Product Design & Photography");

  const payload = buildContactSubmissionPayload({
    name: "  Maya\r\nLin ",
    email: " maya@studio.co ",
    topic: "Street Photography",
    message: "  Interested in purchasing a fine-art print. ",
  });
  assert.deepEqual(payload, {
    name: "Maya Lin",
    email: "maya@studio.co",
    topic: "Photography",
    message: "Interested in purchasing a fine-art print.",
  });

  const subject = buildContactEmailSubject({
    name: "Maya\nLin",
    email: "maya@studio.co",
    topic: "Both",
    message: "Interested in a brand + documentary shoot.",
  });
  assert.equal(subject, "[Product Design & Photography] Inquiry from Maya Lin");

  const plainBody = buildContactEmailPlainText({
    name: "Maya Lin",
    email: "maya@studio.co",
    topic: "Product Design",
    message: "Let's collaborate on a design system.",
  });
  assert.ok(plainBody.startsWith("Hi Sadman,\n\nLet's collaborate on a design system."));
  assert.ok(plainBody.includes("From: Maya Lin <maya@studio.co>"));
  assert.ok(plainBody.includes("Topic: Product Design"));
  assert.equal(plainBody.includes("<table"), false);

  const gmailUrl = buildGmailComposeUrl({
    name: "Maya Lin",
    email: "maya@studio.co",
    topic: "Product Design",
    message: "Let's collaborate on a design system.",
  });
  assert.ok(gmailUrl.startsWith("https://mail.google.com/mail/?view=cm&fs=1&to=sadmanrhd%40gmail.com"));
  assert.ok(gmailUrl.includes(encodeURIComponent("[Product Design] Inquiry from Maya Lin")));
  assert.ok(gmailUrl.includes(encodeURIComponent("Let's collaborate on a design system.")));

  const mailto = buildContactMailtoHref({
    name: "Maya Lin",
    email: "maya@studio.co",
    topic: "Product Design",
    message: "Let's collaborate on a design system.",
  });
  assert.ok(mailto.startsWith("mailto:sadmanrhd@gmail.com?subject="));
  assert.ok(mailto.includes(encodeURIComponent("[Product Design] Inquiry from Maya Lin")));
  assert.ok(mailto.includes(encodeURIComponent("Let's collaborate on a design system.")));

  // Verify zero FormSubmit references remain in contact modules or server
  const { readFileSync } = await import("node:fs");
  const { resolve } = await import("node:path");
  for (const rel of [
    "src/utils/portfolioLogic.ts",
    "src/services/contactService.ts",
    "src/components/ContactModal.tsx",
    "server.ts",
  ]) {
    const content = readFileSync(resolve(process.cwd(), rel), "utf8");
    assert.equal(
      content.toLowerCase().includes("formsubmit"),
      false,
      `${rel} must not reference FormSubmit`,
    );
  }
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

test("portfolio data has no em/en-dashes, excludes template projects, and includes all 5 social links with Behance first", async () => {
  const { readFileSync } = await import("node:fs");
  const { resolve } = await import("node:path");
  const portfolioSrc = readFileSync(resolve(process.cwd(), "src/data/portfolio.ts"), "utf8");

  assert.equal(portfolioSrc.includes("\u2014"), false, "portfolio.ts must not contain em-dashes");
  assert.equal(portfolioSrc.includes("\u2013"), false, "portfolio.ts must not contain en-dashes");
  assert.equal(portfolioSrc.includes("oral-lab"), false, "Oral Lab template project must be removed");
  assert.equal(portfolioSrc.includes("after-eight"), false, "After Eight template project must be removed");
  assert.equal(portfolioSrc.includes("https://www.behance.net/sadmanrahman2"), true);
  assert.equal(portfolioSrc.includes("https://www.linkedin.com/in/sadmanrahmand/"), true);
  assert.equal(portfolioSrc.includes("https://www.facebook.com/sdhruba"), true);
  assert.equal(portfolioSrc.includes("https://www.youtube.com/@thetechytrippers3410"), true);
  assert.equal(portfolioSrc.includes("https://www.flickr.com/photos/137565099@N07/"), true);

  const behancePos = portfolioSrc.indexOf("https://www.behance.net/sadmanrahman2");
  const linkedinPos = portfolioSrc.indexOf("https://www.linkedin.com/in/sadmanrahmand/");
  assert.ok(behancePos > 0 && behancePos < linkedinPos, "Behance must appear in 1st position before LinkedIn");
});

test("editorial mobile page-flip only activates on mobile after the cover and clamps swipe progress", () => {
  // Cover (index 0) and desktop stay flat; interior pages (index >= 1) on mobile enable 3D page flip
  assert.equal(shouldUseEditorialPageFlip(0, false), false);
  assert.equal(shouldUseEditorialPageFlip(1, false), true);
  assert.equal(shouldUseEditorialPageFlip(5, false), true);
  assert.equal(shouldUseEditorialPageFlip(1, true), false);
  assert.equal(shouldUseEditorialPageFlip(0, true), false);

  // Left swipe advances next when allowed
  const nextDrag = getSwipeFlipProgress(-108, 300, true, true);
  assert.equal(nextDrag.direction, "next");
  assert.equal(Number(nextDrag.progress.toFixed(2)), 0.5);

  // Right swipe returns prev when allowed
  const prevDrag = getSwipeFlipProgress(300, 300, true, true);
  assert.equal(prevDrag.direction, "prev");
  assert.equal(prevDrag.progress, 1);

  // Blocked directions yield null / 0
  assert.deepEqual(getSwipeFlipProgress(-80, 300, false, true), {
    direction: null,
    progress: 0,
  });
  assert.deepEqual(getSwipeFlipProgress(80, 300, true, false), {
    direction: null,
    progress: 0,
  });
});

test("getGalleryScrollTarget computes docked scroll offset across all viewports and clamps to zero", () => {
  assert.equal(
    getGalleryScrollTarget({
      anchorTop: 432.6,
      headerHeight: 82,
    }),
    351,
  );
  assert.equal(
    getGalleryScrollTarget({
      anchorTop: 40,
      headerHeight: 82,
    }),
    0,
  );
});

test("sortPostersAlphabetically and buildPosterBentoRows preserve alphabetical order with balanced rows", () => {
  const unsorted = [
    { title: "Zodiac", width: 724, height: 1024 },
    { title: "Ajji", width: 812, height: 1024 },
    { title: "BREATHE", width: 870, height: 1023 },
    { title: "Love and Other Drugs", width: 1024, height: 733 },
    { title: "Bulbbul", width: 819, height: 1024 },
    { title: "Eternal Sunshine", width: 819, height: 1024 },
  ];
  const sorted = sortPostersAlphabetically(unsorted);
  assert.deepEqual(
    sorted.map((p) => p.title),
    [
      "Ajji",
      "BREATHE",
      "Bulbbul",
      "Eternal Sunshine",
      "Love and Other Drugs",
      "Zodiac",
    ],
  );

  const rows = buildPosterBentoRows(sorted);
  assert.deepEqual(
    rows.flat().map((p) => p.title),
    sorted.map((p) => p.title),
  );
  assert.ok(rows.every((r) => r.length >= 2 && r.length <= 4));

  const posterSections = getCaseStudySections({
    ...SAMPLE_DESIGN[0],
    category: "Editorial",
    posterGallery: {
      collectionNote: "Note",
      purchaseHeading: "Buy",
      purchaseNote: "Contact",
      coverPreviewSrcs: ["/a.jpg"],
      items: [{ src: "/a.jpg", title: "Ajji", width: 812, height: 1024 }],
    },
  });
  assert.deepEqual(
    posterSections.map((s) => s.label),
    ["Gallery", "Details"],
  );
});

test("advancePosterCoverCycle changes cover on every reload and visits all posters before repeating", () => {
  // Deterministic pseudo-random generator
  let seed = 42;
  const rng = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const total = 13;
  let state = null;
  const firstCycle: number[] = [];

  for (let i = 0; i < total; i++) {
    const res = advancePosterCoverCycle(total, state, rng);
    firstCycle.push(res.index);
    state = res.nextState;
  }

  // Visits all 13 unique indices before repeating
  assert.equal(new Set(firstCycle).size, total);

  // Even if the next cycle's shuffle puts lastIndex first (rng always returns 0.99),
  // consecutive reloads still never repeat the same cover
  const lastOfFirst = firstCycle[firstCycle.length - 1];
  const boundaryStep = advancePosterCoverCycle(total, state, () => 0.99);
  assert.notEqual(boundaryStep.index, lastOfFirst);

  // Single item edge case
  assert.equal(advancePosterCoverCycle(1, null).index, 0);
});

test("PHOTO_GENRES places People first among genres and includes Concert with all 5 uploaded photos", async () => {
  const { readFileSync } = await import("node:fs");
  const { resolve } = await import("node:path");
  const portfolioSrc = readFileSync(resolve(process.cwd(), "src/data/portfolio.ts"), "utf8");

  const peopleIdx = portfolioSrc.indexOf('"People"');
  const concertIdx = portfolioSrc.indexOf('"Concert"');
  const documentaryIdx = portfolioSrc.indexOf('"Documentary"');
  assert.ok(peopleIdx > 0 && peopleIdx < documentaryIdx, "People must appear before Documentary in PHOTO_GENRES");
  assert.ok(concertIdx > 0, "Concert genre must exist");

  const concertAssetMatches = [
    "/assets/aistudio/dsc_0970_49509400311_l_73a08806.jpg",
    "/assets/aistudio/dsc_0831_49509398071_l_23008517.jpg",
    "/assets/aistudio/dsc_0971_49508894543_l_74a0c91b.jpg",
    "/assets/aistudio/dsc_0827-2_49508892723_l_f27aea92.jpg",
    "/assets/aistudio/dsc_0676_49509632397_l_02f9ceb3.jpg",
  ];
  for (const src of concertAssetMatches) {
    assert.equal(portfolioSrc.includes(src), true, `Missing concert image: ${src}`);
  }

  assert.ok(portfolioSrc.includes('"Conceptual"'), "Conceptual genre must exist");
  const conceptualAssetMatches = [
    "/assets/aistudio/psx_20201031_191741_50552111737_l_4b5a9767.jpg",
    "/assets/aistudio/psx_20201031_171226__01_50552110107_l_786be82e.jpg",
    "/assets/aistudio/dsc_3796__01_50551981141_l_fb723572.jpg",
    "/assets/aistudio/dsc_3787_50552110802_l_5f1aa18d.jpg",
    "/assets/aistudio/dsc_3768_50552111822_l_e6ba7368.jpg",
    "/assets/aistudio/dsc_3749_50551247023_l_b9ba282d.jpg",
    "/assets/aistudio/2020-10-23_02-45-45_50517960932_l_7c22f120.jpg",
  ];
  for (const src of conceptualAssetMatches) {
    assert.equal(portfolioSrc.includes(src), true, `Missing conceptual image: ${src}`);
  }

  assert.ok(portfolioSrc.includes('"Still Life"'), "Still Life genre must exist");
  const stillLifeAssetMatches = [
    "/assets/aistudio/2020-10-04_11-41-31_50418469861_l_9ba0dab8.jpg",
    "/assets/aistudio/2020-10-13_08-54-14_50470207608_l_0864f031.jpg",
    "/assets/aistudio/2020-10-23_02-45-45_50517960932_l_7c22f120.jpg",
    "/assets/aistudio/dsc_4775_50888087072_l_f2596248.jpg",
    "/assets/aistudio/dsc_2632-2_50443756273_l_00ddf8f1.jpg",
    "/assets/aistudio/psx_20201009_200950_50442095882_l_9746fbc0.jpg",
    "/assets/aistudio/psx_20210701_180955_51283874842_l_844ea8e0.jpg",
    "/assets/aistudio/50524364918_c6a9110049_b_a7998baa.jpg",
  ];
  for (const src of stillLifeAssetMatches) {
    assert.equal(portfolioSrc.includes(src), true, `Missing still life image: ${src}`);
  }

  // Empty and removed sample genres must be absent from PHOTO_GENRES and PHOTO_ITEMS
  const genresBlockMatch = portfolioSrc.match(/export const PHOTO_GENRES[\s\S]*?\];/);
  assert.ok(genresBlockMatch, "PHOTO_GENRES block must exist");
  assert.equal(genresBlockMatch[0].includes('"Product"'), false, "Empty Product genre must be removed");
  assert.equal(genresBlockMatch[0].includes('"Nature"'), false, "Empty Nature genre must be removed");
  assert.equal(genresBlockMatch[0].includes('"Street"'), false, "Street genre must be removed");
  assert.equal(genresBlockMatch[0].includes('"Travel"'), false, "Travel genre must be removed");
  assert.equal(portfolioSrc.includes('"midnight-riders"'), false, "Sample Street photo must be removed");
  assert.equal(portfolioSrc.includes('"two-strangers"'), false, "Sample Travel photo must be removed");
  assert.equal(portfolioSrc.includes('"passing-through"'), false, "Sample Street photo must be removed");

  assert.ok(portfolioSrc.includes('"Animal Kingdom"'), "Animal Kingdom genre must exist");
  const animalKingdomAssetMatches = [
    "/assets/aistudio/psx_20200922_015316_50368340028_l_2a0b0dbd.jpg",
    "/assets/aistudio/psx_20180802_233821_43949906562_l_111945ac.jpg",
    "/assets/aistudio/love_43192227441_l_76844648.jpg",
    "/assets/aistudio/dsc_9238_40023113801_l_0f5fdf9e.jpg",
    "/assets/aistudio/dsc_5247-2_46404122961_l_38933ab2.jpg",
    "/assets/aistudio/dsc_4392_38527401032_l_f43d1b7a.jpg",
    "/assets/aistudio/dsc_4367_37842285624_l_4ba498b7.jpg",
    "/assets/aistudio/dsc_3790-3_37141521133_l_1fc174dd.jpg",
    "/assets/aistudio/dsc_2996_36522808025_l_0c358b6d.jpg",
    "/assets/aistudio/dsc_2305_50369204442_l_9cb36ce1.jpg",
    "/assets/aistudio/dsc_2256-2_50368337633_l_80d23e76.jpg",
    "/assets/aistudio/dsc_1926_50345527363_l_dcbb8698.jpg",
    "/assets/aistudio/dsc_1910-2_50369204197_l_83a27729.jpg",
    "/assets/aistudio/dsc_1856_50345549218_l_36400529.jpg",
    "/assets/aistudio/2021-01-03_04-18-33_50794928317_l_0bc9b838.jpg",
    "/assets/aistudio/_dsc2861-2_35841319396_l_40359f8b.jpg",
    "/assets/aistudio/_dsc0547_33149934715_l_52f3e16c.jpg",
    "/assets/aistudio/_dsc0550_33108416646_l_dd39e24e.jpg",
    "/assets/aistudio/53714110692_98bcb81f84_b_82eaa500.jpg",
  ];
  for (const src of animalKingdomAssetMatches) {
    assert.equal(portfolioSrc.includes(src), true, `Missing animal kingdom image: ${src}`);
  }

  const peopleAssetMatches = [
    "/assets/aistudio/51577409065_8b160cec0c_b_fb6742df.jpg",
    "/assets/aistudio/51721141298_2500caecc4_b_acdcc3a4.jpg",
    "/assets/aistudio/psx_20201103_191750_50563770371_l_af686205.jpg",
    "/assets/aistudio/psx_20210218_224753_50959234343_l_34c71513.jpg",
    "/assets/aistudio/53182317168_ef24bbee65_b_3aa585f4.jpg",
    "/assets/aistudio/53182260850_2b17f7c92c_b_448cc53e.jpg",
    "/assets/aistudio/51721554004_924db8277a_b_b91a1d84.jpg",
    "/assets/aistudio/psx_20201028_215438_50540737883_l_b61e806a.jpg",
    "/assets/aistudio/psx_20201026_220237_50532786183_l_ef825725.jpg",
    "/assets/aistudio/mom_50555450323_l_f0f66fda.jpg",
    "/assets/aistudio/magic_28773663276_l_1559e81e.jpg",
    "/assets/aistudio/dsc_eddd4833_46353231222_l_17071549.jpg",
    "/assets/aistudio/dsc_9955_39914794170_l_58e4ca5c.jpg",
    "/assets/aistudio/dsc_9327ed_49029394373_l_9236f51d.jpg",
    "/assets/aistudio/dsc_4946_50959234228_l_cabd5b3a.jpg",
    "/assets/aistudio/dsc_4539-2_50785069763_l_715e7539.jpg",
    "/assets/aistudio/child_50558181827_l_34beeeff.jpg",
    "/assets/aistudio/_dsc2668_35494011510_l_d116c843.jpg",
    "/assets/aistudio/2020-10-20_06-51-27_50509597567_l_50e9fb07.jpg",
    "/assets/aistudio/51576489981_2fb9424162_b_e5774cda.jpg",
    "/assets/aistudio/51577361631_7af2f9c866_b_28327d6a.jpg",
    "/assets/aistudio/51684607371_ac3d4d5a4f_b_4d2f007a.jpg",
    "/assets/aistudio/51649197306_cc03d17cb1_b_1363a993.jpg",
    "/assets/aistudio/51576551642_6df8ae2041_b_cb8fede8.jpg",
    "/assets/aistudio/2020-11-04_02-35-54_50563488238_l_57acd140.jpg",
  ];
  for (const src of peopleAssetMatches) {
    assert.equal(portfolioSrc.includes(src), true, `Missing people image: ${src}`);
  }

  const documentaryAssetMatches = [
    "/assets/aistudio/dsc_1727-2_35749572762_l_a0a8cc54.jpg",
    "/assets/aistudio/51721554004_924db8277a_b_b91a1d84.jpg",
    "/assets/aistudio/28826064240_b1abe51639_oc_29595471850_l_804b2dd0.jpg",
    "/assets/aistudio/dsc_0062-3_35072654823_l_103b83a9.jpg",
    "/assets/aistudio/dsc_0659_35882007605_l_50d95e25.jpg",
    "/assets/aistudio/dsc_1539-2_43775248544_l_0d40bfff.jpg",
    "/assets/aistudio/dsc_1620-3_35841154136_l_043f096b.jpg",
    "/assets/aistudio/dsc_1759-2_35787361591_l_2be6023b.jpg",
    "/assets/aistudio/dsc_4839eeddttt_31464600367_l_7d4b5bba.jpg",
    "/assets/aistudio/psx_20180731_215704_43092522835_l_1facc0bf.jpg",
    "/assets/aistudio/psx_20210320_235235_51331413457_l_c1564820.jpg",
    "/assets/aistudio/psx_20210326_144932_51331413467_l_ae69e174.jpg",
    "/assets/aistudio/psx_20210723_230207_51333128725_l_2ce7c8ff.jpg",
    "/assets/aistudio/psx_20210722_014408_51332133821_l_2431fa2b.jpg",
    "/assets/aistudio/psx_20210724_220825_51333128785_l_96631b46.jpg",
  ];
  for (const src of documentaryAssetMatches) {
    assert.equal(portfolioSrc.includes(src), true, `Missing documentary image: ${src}`);
  }

  // Deduplication check for cross-genre images in All view
  const dupTest = filterPhotoItems(
    [
      { ...SAMPLE_PHOTOS[0], id: "a", genre: "Conceptual", image: "/shared.jpg" },
      { ...SAMPLE_PHOTOS[0], id: "b", genre: "Still Life", image: "/shared.jpg" },
      { ...SAMPLE_PHOTOS[1], id: "c", genre: "Still Life", image: "/unique.jpg" },
    ],
    "All",
  );
  assert.equal(dupTest.length, 2);
});

test("AboutView reflects Dhaka bio, smartphone photography, face-only coral-blue portrait, and real disciplines", async () => {
  const { readFileSync } = await import("node:fs");
  const { resolve } = await import("node:path");
  const aboutSrc = readFileSync(resolve(process.cwd(), "src/components/AboutView.tsx"), "utf8");
  const portfolioSrc = readFileSync(resolve(process.cwd(), "src/data/portfolio.ts"), "utf8");

  assert.equal(aboutSrc.includes("/assets/sadman-head.png"), true);
  assert.equal(aboutSrc.includes("DesignerCharacter"), false);
  assert.equal(aboutSrc.includes("#ff5b44"), true);
  assert.equal(aboutSrc.includes("#4169ed"), true);
  assert.equal(aboutSrc.includes("Dhaka-based product designer and photographer"), true);
  assert.equal(aboutSrc.toLowerCase().includes("smartphone"), true);
  assert.equal(aboutSrc.includes("GMT+6"), true);
  assert.equal(aboutSrc.includes("Singapore"), false);
  assert.equal(portfolioSrc.includes("Singapore"), false);
});



