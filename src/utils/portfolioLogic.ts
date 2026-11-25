import type {
  DesignCategory,
  DesignProject,
  PhotoGenre,
  PhotoItem,
} from "../data/portfolio";

export interface ContactFormValues {
  name: string;
  email: string;
  topic: "Product Design" | "Street Photography" | "Both";
  message: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormValues, string>>;
}

export type HighlightFilter = "All" | "Product Design" | "Photography";

export interface FeaturedHighlight {
  id: string;
  sourceId: string;
  kind: "design" | "photo";
  title: string;
  kicker: string;
  meta: string;
  image: string;
  imageFit?: "cover" | "contain";
  summary: string;
  challenge?: string;
  primaryLabel: string;
  primaryValue: string;
  secondaryLabel: string;
  secondaryValue: string;
  tags: string[];
}

export function filterDesignProjects(
  projects: DesignProject[],
  category: DesignCategory,
): DesignProject[] {
  if (category === "All") return projects;
  return projects.filter((project) => project.category === category);
}

export function filterPhotoItems(
  photos: PhotoItem[],
  genre: PhotoGenre,
): PhotoItem[] {
  if (genre === "All") return photos;
  return photos.filter((photo) => photo.genre === genre);
}

export function buildFeaturedHighlights(
  projects: DesignProject[],
  photos: PhotoItem[],
): FeaturedHighlight[] {
  const picks: FeaturedHighlight[] = [];
  const designOrder = ["nsd", "plis"];
  const photoOrder = ["midnight-riders", "passing-through"];

  const designById = new Map(projects.map((p) => [p.id, p]));
  const photoById = new Map(photos.map((p) => [p.id, p]));

  const m = designById.get(designOrder[0]) ?? projects[0];
  if (m) {
    picks.push({
      id: `highlight-${m.id}`,
      sourceId: m.id,
      kind: "design",
      title: m.title,
      kicker: `Product Design · ${m.year}`,
      meta: `${m.client} · ${m.subtitle}`,
      image: m.image,
      imageFit: m.imageFit,
      summary: m.summary,
      challenge: m.challenge,
      primaryLabel: "Approach",
      primaryValue: m.approach,
      secondaryLabel: "Outcome",
      secondaryValue: m.outcome,
      tags: m.deliverables,
    });
  }

  const mr = photoById.get(photoOrder[0]) ?? photos[0];
  if (mr) {
    picks.push({
      id: `highlight-${mr.id}`,
      sourceId: mr.id,
      kind: "photo",
      title: mr.title,
      kicker: `Photography · ${mr.location}`,
      meta: `${mr.year} · ${mr.camera}`,
      image: mr.image,
      summary: mr.story,
      primaryLabel: "Gear",
      primaryValue: `${mr.camera} · ${mr.lens}`,
      secondaryLabel: "Exposure",
      secondaryValue: mr.settings,
      tags: [mr.location, mr.year, "35mm Documentary"],
    });
  }

  const p = designById.get(designOrder[1]) ?? projects[1];
  if (p && p.id !== m?.id) {
    picks.push({
      id: `highlight-${p.id}`,
      sourceId: p.id,
      kind: "design",
      title: p.title,
      kicker: `Product Design · ${p.year}`,
      meta: `${p.client} · ${p.subtitle}`,
      image: p.image,
      imageFit: p.imageFit,
      summary: p.summary,
      challenge: p.challenge,
      primaryLabel: "Approach",
      primaryValue: p.approach,
      secondaryLabel: "Outcome",
      secondaryValue: p.outcome,
      tags: p.deliverables,
    });
  }

  const pt = photoById.get(photoOrder[1]) ?? photos[1];
  if (pt && pt.id !== mr?.id) {
    picks.push({
      id: `highlight-${pt.id}`,
      sourceId: pt.id,
      kind: "photo",
      title: pt.title,
      kicker: `Photography · ${pt.location}`,
      meta: `${pt.year} · ${pt.camera}`,
      image: pt.image,
      summary: pt.story,
      primaryLabel: "Gear",
      primaryValue: `${pt.camera} · ${pt.lens}`,
      secondaryLabel: "Exposure",
      secondaryValue: pt.settings,
      tags: [pt.location, pt.year, "35mm Documentary"],
    });
  }

  return picks;
}

export function filterHighlights(
  highlights: FeaturedHighlight[],
  filter: HighlightFilter,
): FeaturedHighlight[] {
  if (filter === "All") return highlights;
  if (filter === "Product Design") {
    return highlights.filter((item) => item.kind === "design");
  }
  return highlights.filter((item) => item.kind === "photo");
}

export function getAdjacentItemId<T extends { id: string }>(
  items: T[],
  currentId: string,
  direction: "prev" | "next",
): string | null {
  if (items.length === 0) return null;
  const index = items.findIndex((item) => item.id === currentId);
  if (index === -1) return items[0].id;
  if (direction === "next") {
    return items[(index + 1) % items.length].id;
  }
  return items[(index - 1 + items.length) % items.length].id;
}

export function formatCount(count: number): string {
  return count < 10 ? `0${count}` : String(count);
}

export function validateContactForm(
  values: ContactFormValues,
): ContactValidationResult {
  const errors: Partial<Record<keyof ContactFormValues, string>> = {};
  const trimmedName = values.name.trim();
  const trimmedEmail = values.email.trim();
  const trimmedMessage = values.message.trim();

  if (trimmedName.length < 2) {
    errors.name = "Please enter your name (at least 2 characters).";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = "Please enter a valid email address.";
  }

  if (trimmedMessage.length < 10) {
    errors.message = "Tell Sadman a bit about your project (at least 10 characters).";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface CaseStudySectionNavItem {
  id: string;
  label: string;
}

export function getCaseStudySections(
  project: DesignProject,
): CaseStudySectionNavItem[] {
  if (project.editorialDocument?.pages.length) {
    return [
      { id: "section-reader", label: "Read" },
      { id: "section-overview", label: "Details" },
    ];
  }

  const isRich = Boolean(
    project.overview ||
      project.backgroundMilestones?.length ||
      project.contributions?.length ||
      project.keyDesignAreas?.length,
  );

  if (isRich) {
    const sections: CaseStudySectionNavItem[] = [
      { id: "section-overview", label: "Overview" },
    ];
    if (project.backgroundMilestones?.length) {
      sections.push({ id: "section-background", label: "Background" });
    }
    if (project.challengePoints?.length) {
      sections.push({ id: "section-challenge", label: "Challenge" });
    }
    if (project.contributions?.length) {
      sections.push({ id: "section-contribution", label: "Contribution" });
    }
    if (project.mobileShowcase?.screens.length) {
      sections.push({ id: "section-mobile", label: "Mobile" });
    }
    if (
      project.processSteps?.length ||
      project.processVisuals?.length ||
      project.processVisual
    ) {
      sections.push({
        id: "section-process",
        label: project.processNavLabel ?? "Process",
      });
    }
    if (project.keyDesignAreas?.length) {
      sections.push({
        id: "section-key-areas",
        label: project.keyDesignAreasNavLabel ?? "Key Areas",
      });
    }
    if (project.beforeAfter?.length) {
      sections.push({ id: "section-before-after", label: "Before & After" });
    }
    sections.push({
      id: "section-outcomes",
      label: project.outcomesNavLabel ?? "Outcomes",
    });
    return sections;
  }

  const standard: CaseStudySectionNavItem[] = [
    { id: "section-challenge", label: "Challenge" },
    { id: "section-approach", label: "Approach" },
  ];
  if (project.keyDecisions?.length) {
    standard.push({ id: "section-decisions", label: "Decisions" });
  }
  standard.push({
    id: "section-outcomes",
    label: project.outcomesNavLabel ?? "Outcome",
  });
  return standard;
}

export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

export function getNextSlideIndex(
  current: number,
  delta: -1 | 1,
  total: number,
): number {
  if (total <= 0) return 0;
  return (((current + delta) % total) + total) % total;
}

export type EditorialViewMode = "single" | "spread";

export function getEditorialSpreadPages(
  currentIndex: number,
  totalPages: number,
  mode: EditorialViewMode,
): number[] {
  if (totalPages <= 0) return [];
  const clamped = Math.max(0, Math.min(currentIndex, totalPages - 1));
  if (mode === "single" || clamped === 0) {
    return [clamped];
  }
  const left = clamped % 2 === 1 ? clamped : clamped - 1;
  if (left + 1 < totalPages) {
    return [left, left + 1];
  }
  return [left];
}

export function stepEditorialPage(
  currentIndex: number,
  delta: -1 | 1,
  totalPages: number,
  mode: EditorialViewMode,
): number {
  if (totalPages <= 0) return 0;
  const clamped = Math.max(0, Math.min(currentIndex, totalPages - 1));
  if (mode === "single") {
    return Math.max(0, Math.min(clamped + delta, totalPages - 1));
  }
  if (delta === 1) {
    if (clamped === 0) {
      return Math.min(1, totalPages - 1);
    }
    const left = clamped % 2 === 1 ? clamped : clamped - 1;
    return left + 2 < totalPages ? left + 2 : left;
  }
  if (clamped <= 2) {
    return 0;
  }
  const left = clamped % 2 === 1 ? clamped : clamped - 1;
  return Math.max(0, left - 2);
}


