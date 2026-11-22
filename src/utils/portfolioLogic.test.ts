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
  validateContactForm,
} from "./portfolioLogic";

const SAMPLE_DESIGN: DesignProject[] = [
  {
    id: "nsd",
    title: "National Sanitation Dashboard (NSD)",
    subtitle: "GovTech · Data Platform",
    category: "Product",
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
    id: "pico",
    title: "Pico",
    subtitle: "Audio · Industrial",
    category: "Industrial",
    year: "2024",
    client: "Modular Audio Co.",
    role: "Industrial Designer",
    image: "/pico.jpg",
    summary: "Pocket synth",
    challenge: "Challenge",
    approach: "Approach Pico",
    deliverables: ["CAD", "OLED UI"],
    outcome: "420% funded",
  },
  {
    id: "oral-lab",
    title: "Oral Lab",
    subtitle: "Health · Strategy",
    category: "Strategy",
    year: "2023",
    client: "Ora Healthcare",
    role: "Strategy",
    image: "/oral.jpg",
    summary: "Oral care",
    challenge: "Challenge",
    approach: "Approach",
    deliverables: ["Brand"],
    outcome: "Outcome",
  },
  {
    id: "after-eight",
    title: "After Eight",
    subtitle: "Objects · Art direction",
    category: "Industrial",
    year: "2023",
    client: "Studio Monograph",
    role: "Direction",
    image: "/after-eight.jpg",
    wide: true,
    summary: "Desk objects",
    challenge: "Challenge",
    approach: "Approach",
    deliverables: ["Objects"],
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
  const industrial = filterDesignProjects(SAMPLE_DESIGN, "Industrial");
  assert.equal(industrial.length, 2);
  assert.deepEqual(
    industrial.map((p) => p.id),
    ["pico", "after-eight"],
  );
  const strategy = filterDesignProjects(SAMPLE_DESIGN, "Strategy");
  assert.equal(strategy.length, 1);
  assert.equal(strategy[0].id, "oral-lab");
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
      "Pico",
      "Passing Through",
    ],
  );
  assert.deepEqual(
    highlights.map((h) => h.sourceId),
    ["nsd", "midnight-riders", "pico", "passing-through"],
  );
  assert.equal(highlights[0].imageFit, "contain");
  assert.equal(filterHighlights(highlights, "All").length, 4);
  assert.equal(filterHighlights(highlights, "Product Design").length, 2);
  assert.equal(filterHighlights(highlights, "Photography").length, 2);
});

test("getAdjacentItemId wraps around forward and backward", () => {
  assert.equal(getAdjacentItemId(SAMPLE_DESIGN, "nsd", "next"), "pico");
  assert.equal(getAdjacentItemId(SAMPLE_DESIGN, "after-eight", "next"), "nsd");
  assert.equal(getAdjacentItemId(SAMPLE_DESIGN, "nsd", "prev"), "after-eight");
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
