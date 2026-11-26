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
  photoGenre?: PhotoGenre;
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
  if (genre === "All") {
    const seen = new Set<string>();
    return photos.filter((photo) => {
      if (seen.has(photo.image)) return false;
      seen.add(photo.image);
      return true;
    });
  }
  return photos.filter((photo) => photo.genre === genre);
}

export function buildFeaturedHighlights(
  projects: DesignProject[],
  photos: PhotoItem[],
): FeaturedHighlight[] {
  const picks: FeaturedHighlight[] = [];
  const designOrder = ["nsd", "plis"];
  const photoOrder = ["people-01", "documentary-01"];

  const designById = new Map(projects.map((p) => [p.id, p]));
  const photoById = new Map(photos.map((p) => [p.id, p]));

  const formatPhotoHighlight = (item: PhotoItem): FeaturedHighlight => ({
    id: `highlight-${item.id}`,
    sourceId: item.id,
    kind: "photo",
    photoGenre: item.genre,
    title: item.title || `${item.genre} Studies`,
    kicker: item.location
      ? `Photography · ${item.location}`
      : `Photography · ${item.genre}`,
    meta: [item.year, item.camera].filter(Boolean).join(" · ") || item.genre,
    image: item.image,
    summary:
      item.story ||
      `Selected frame from Sadman's ${item.genre} photography collection.`,
    primaryLabel: "Gear",
    primaryValue:
      [item.camera, item.lens].filter(Boolean).join(" · ") || "Camera & Smartphone",
    secondaryLabel: "Exposure",
    secondaryValue: item.settings || "Natural Light",
    tags: [item.genre, item.location, item.year].filter(Boolean),
  });

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
    picks.push(formatPhotoHighlight(mr));
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
    picks.push(formatPhotoHighlight(pt));
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

export const CONTACT_RECIPIENT_EMAIL = "sadmanrhd@gmail.com";
export const CONTACT_API_ENDPOINT = "/api/contact";

export type CanonicalInquiryTopic =
  | "Product Design"
  | "Photography"
  | "Product Design & Photography";

export function formatContactTopicLabel(
  topic: ContactFormValues["topic"],
): CanonicalInquiryTopic {
  if (topic === "Street Photography") return "Photography";
  if (topic === "Both") return "Product Design & Photography";
  return "Product Design";
}

function stripLineBreaks(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export function buildContactEmailSubject(values: ContactFormValues): string {
  const topicLabel = formatContactTopicLabel(values.topic);
  const name = stripLineBreaks(values.name);
  const subject = name
    ? `[${topicLabel}] Inquiry from ${name}`
    : `[${topicLabel}] Portfolio Inquiry`;
  return subject.slice(0, 180);
}

export function buildContactEmailPlainText(values: ContactFormValues): string {
  const name = stripLineBreaks(values.name);
  const email = stripLineBreaks(values.email);
  const topicLabel = formatContactTopicLabel(values.topic);
  const message = values.message.trim();

  return [
    "Hi Sadman,",
    "",
    message,
    "",
    "--",
    name && email ? `From: ${name} <${email}>` : name ? `From: ${name}` : "",
    `Topic: ${topicLabel}`,
  ]
    .filter((line, idx, arr) => line !== "" || (idx > 0 && arr[idx - 1] !== ""))
    .join("\n");
}

export function buildContactSubmissionPayload(values: ContactFormValues) {
  return {
    name: stripLineBreaks(values.name).slice(0, 100),
    email: stripLineBreaks(values.email).slice(0, 160),
    topic: formatContactTopicLabel(values.topic),
    message: values.message.trim().slice(0, 3000),
  };
}

export function buildGmailComposeUrl(values: ContactFormValues): string {
  const subject = buildContactEmailSubject(values);
  const body = buildContactEmailPlainText(values);
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_RECIPIENT_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function buildContactMailtoHref(values: ContactFormValues): string {
  const subject = buildContactEmailSubject(values);
  const body = buildContactEmailPlainText(values);
  return `mailto:${CONTACT_RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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

  if (project.posterGallery?.items.length) {
    return [
      { id: "section-gallery", label: "Gallery" },
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

export function shouldUseEditorialPageFlip(
  pageIndex: number,
  isDesktop: boolean,
): boolean {
  return !isDesktop && pageIndex >= 1;
}

export interface SwipeFlipState {
  direction: "next" | "prev" | null;
  progress: number;
}

export function getSwipeFlipProgress(
  deltaX: number,
  stageWidth: number,
  canGoNext: boolean,
  canGoPrev: boolean,
): SwipeFlipState {
  const effectiveWidth = Math.max(180, stageWidth * 0.72);
  if (deltaX < 0 && canGoNext) {
    return {
      direction: "next",
      progress: Math.max(0, Math.min(1, Math.abs(deltaX) / effectiveWidth)),
    };
  }
  if (deltaX > 0 && canGoPrev) {
    return {
      direction: "prev",
      progress: Math.max(0, Math.min(1, Math.abs(deltaX) / effectiveWidth)),
    };
  }
  return { direction: null, progress: 0 };
}

export function getGalleryScrollTarget(params: {
  anchorTop: number;
  headerHeight: number;
}): number {
  return Math.max(0, Math.round(params.anchorTop - params.headerHeight));
}

export function sortPostersAlphabetically<T extends { title: string }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
  );
}

export function buildPosterBentoRows<
  T extends { width: number; height: number },
>(items: T[], targetRowRatio = 2.75): T[][] {
  if (items.length === 0) return [];
  const rows: T[][] = [];
  let current: T[] = [];
  let currentRatio = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const ratio = item.height > 0 ? item.width / item.height : 1;
    const remaining = items.length - i;

    if (
      current.length > 0 &&
      (currentRatio + ratio > targetRowRatio + 0.55 || current.length >= 4) &&
      remaining > 1
    ) {
      rows.push(current);
      current = [item];
      currentRatio = ratio;
    } else {
      current.push(item);
      currentRatio += ratio;
    }
  }

  if (current.length > 0) {
    // Avoid a lone single-item trailing row when the previous row has 4 items
    if (current.length === 1 && rows.length > 0 && rows[rows.length - 1].length >= 4) {
      const moved = rows[rows.length - 1].pop()!;
      current.unshift(moved);
    }
    rows.push(current);
  }

  return rows;
}

export interface PosterCoverCycleState {
  lastIndex: number | null;
  remaining: number[];
}

export function advancePosterCoverCycle(
  total: number,
  previousState: PosterCoverCycleState | null,
  randomFn: () => number = Math.random,
): { index: number; nextState: PosterCoverCycleState } {
  if (total <= 1) {
    return {
      index: 0,
      nextState: { lastIndex: 0, remaining: [] },
    };
  }

  const lastIndex =
    previousState &&
    typeof previousState.lastIndex === "number" &&
    previousState.lastIndex >= 0 &&
    previousState.lastIndex < total
      ? previousState.lastIndex
      : null;

  const validRemaining = Array.isArray(previousState?.remaining)
    ? previousState.remaining.filter(
        (idx) => Number.isInteger(idx) && idx >= 0 && idx < total,
      )
    : [];

  let queue = [...validRemaining];
  if (queue.length === 0) {
    queue = Array.from({ length: total }, (_, idx) => idx);
    for (let i = queue.length - 1; i > 0; i--) {
      const rand = Math.max(0, Math.min(0.9999999, randomFn()));
      const j = Math.floor(rand * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
    if (lastIndex !== null && queue[0] === lastIndex) {
      const swapIdx = queue.findIndex((val) => val !== lastIndex);
      if (swapIdx > 0) {
        [queue[0], queue[swapIdx]] = [queue[swapIdx], queue[0]];
      }
    }
  } else if (lastIndex !== null && queue[0] === lastIndex && queue.length > 1) {
    const swapIdx = queue.findIndex((val) => val !== lastIndex);
    if (swapIdx > 0) {
      [queue[0], queue[swapIdx]] = [queue[swapIdx], queue[0]];
    }
  }

  const [index, ...rest] = queue;
  return {
    index,
    nextState: {
      lastIndex: index,
      remaining: rest,
    },
  };
}


