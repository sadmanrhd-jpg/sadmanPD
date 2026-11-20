import type {
  DesignCategory,
  DesignProject,
  PhotoItem,
  PhotoLocation,
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
  kind: "design" | "photo";
  title: string;
  kicker: string;
  meta: string;
  image: string;
  summary: string;
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
  location: PhotoLocation,
): PhotoItem[] {
  if (location === "All") return photos;
  return photos.filter((photo) => photo.location === location);
}

export function buildFeaturedHighlights(
  projects: DesignProject[],
  photos: PhotoItem[],
): FeaturedHighlight[] {
  const picks: FeaturedHighlight[] = [];
  const designOrder = ["mori", "pico"];
  const photoOrder = ["midnight-riders", "passing-through"];

  const designById = new Map(projects.map((p) => [p.id, p]));
  const photoById = new Map(photos.map((p) => [p.id, p]));

  const m = designById.get(designOrder[0]) ?? projects[0];
  if (m) {
    picks.push({
      id: `highlight-${m.id}`,
      kind: "design",
      title: m.title,
      kicker: `Product Design · ${m.year}`,
      meta: `${m.client} · ${m.subtitle}`,
      image: m.image,
      summary: m.summary,
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
      kind: "design",
      title: p.title,
      kicker: `Product Design · ${p.year}`,
      meta: `${p.client} · ${p.subtitle}`,
      image: p.image,
      summary: p.summary,
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
    errors.message = "Tell Kai a bit about your project (at least 10 characters).";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
