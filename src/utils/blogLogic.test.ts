import test from "node:test";
import assert from "node:assert/strict";
import {
  BLOG_LIMITS,
  createEmptyBlock,
  deriveExcerpt,
  emailToDocId,
  estimateReadTimeMinutes,
  filterBlogPosts,
  isOwnerEmail,
  sanitizeInlineHtml,
  sanitizeUrl,
  slugifyTitle,
  validateBlogPostPayload,
  validateWriterInput,
  type BlogPost,
} from "./blogLogic";

test("emailToDocId normalizes emails deterministically to valid Firestore document IDs", () => {
  assert.equal(emailToDocId("SadmanRHD@Gmail.com "), "sadmanrhd_gmail_com");
  assert.equal(emailToDocId("guest+writer@studio-dhaka.io"), "guest_writer_studio_dhaka_io");
  assert.match(emailToDocId("a.b+c@domain.co.uk"), /^[a-zA-Z0-9_-]+$/);
  assert.equal(isOwnerEmail("SADMANRHD@gmail.com"), true);
  assert.equal(isOwnerEmail("someone@else.com"), false);
});

test("slugifyTitle creates clean lowercase URL slugs and safe fallback", () => {
  assert.equal(
    slugifyTitle("Designing Dhaka's Metro Display: A Field Study!"),
    "designing-dhakas-metro-display-a-field-study",
  );
  assert.equal(slugifyTitle("   !!!   "), "untitled-story");
});

test("sanitizeInlineHtml preserves editorial formatting and strips XSS vectors", () => {
  const dirty =
    '<p>Hello <b>bold</b> and <i>italic</i> <mark>highlight</mark> <script>alert(1)</script><img src=x onerror=alert(2)><a href="javascript:alert(3)">bad</a> <a href="https://sanboard.gov.bd">NSD</a></p>';
  const clean = sanitizeInlineHtml(dirty);
  assert.equal(clean.includes("<script"), false);
  assert.equal(clean.includes("onerror"), false);
  assert.equal(clean.includes("javascript:"), false);
  assert.equal(clean.includes("<strong>bold</strong>"), true);
  assert.equal(clean.includes("<em>italic</em>"), true);
  assert.equal(clean.includes("<mark>highlight</mark>"), true);
  assert.equal(
    clean.includes('<a href="https://sanboard.gov.bd/" target="_blank" rel="noopener noreferrer">NSD</a>'),
    true,
  );
});

test("sanitizeUrl blocks dangerous protocols and normalizes bare domains", () => {
  assert.equal(sanitizeUrl("javascript:alert(1)"), null);
  assert.equal(sanitizeUrl("data:text/html,<script>"), null);
  assert.equal(sanitizeUrl("behance.net/sadmanrahman2"), "https://behance.net/sadmanrahman2");
  assert.equal(sanitizeUrl("mailto:sadmanrhd@gmail.com"), "mailto:sadmanrhd@gmail.com");
});

test("validateBlogPostPayload enforces blueprint constraints and calculates read time + excerpt", () => {
  const emptyPublish = validateBlogPostPayload({
    title: "",
    subtitle: "",
    coverImage: "",
    coverAlt: "",
    topic: "Product Design",
    tags: [],
    blocks: [createEmptyBlock("paragraph")],
    status: "published",
  });
  assert.equal(emptyPublish.valid, false);
  assert.ok(emptyPublish.errors.length >= 2);

  const validPost = validateBlogPostPayload({
    title: "Clarity in Public Systems",
    subtitle: "Notes from interviewing forty planners in Dhaka.",
    coverImage: "https://example.com/cover.jpg",
    coverAlt: "Planners around a map",
    topic: "Product Design",
    tags: [
      "GovTech",
      "UX Research",
      "GovTech",
      "Dhaka",
      "Maps",
      "Systems",
      "ExtraTag",
      "OverflowTag",
    ],
    blocks: [
      createEmptyBlock("paragraph", {
        html: "Good systems hide complexity until the exact moment an officer needs to decide.",
      }),
      createEmptyBlock("quote", {
        html: "Design for the room where the decision is actually made.",
        quoteStyle: "pullquote",
      }),
    ],
    status: "published",
  });

  assert.equal(validPost.valid, true);
  assert.equal(validPost.slug, "clarity-in-public-systems");
  assert.equal(validPost.sanitizedTags.length, BLOG_LIMITS.maxTags);
  assert.equal(validPost.sanitizedTags.includes("OverflowTag"), false);
  assert.equal(validPost.readTimeMinutes, 1);
  assert.equal(validPost.excerpt, "Notes from interviewing forty planners in Dhaka.");
});

test("validateWriterInput rejects invalid emails and owner duplicate while accepting guest writers", () => {
  assert.equal(
    validateWriterInput({
      email: "sadmanrhd@gmail.com",
      displayName: "Sadman",
      title: "Owner",
      bio: "",
    }).valid,
    false,
  );
  assert.equal(
    validateWriterInput({
      email: "not-an-email",
      displayName: "",
      title: "",
      bio: "",
    }).valid,
    false,
  );
  assert.equal(
    validateWriterInput({
      email: "anika.writer@gmail.com",
      displayName: "Anika Rahman",
      title: "Guest Writer",
      bio: "Writes about photography and Dhaka architecture.",
    }).valid,
    true,
  );
});

test("estimateReadTimeMinutes, deriveExcerpt, and filterBlogPosts behave accurately", () => {
  const longText = Array(460).fill("word").join(" ");
  const blocks = [createEmptyBlock("paragraph", { html: longText })];
  assert.equal(estimateReadTimeMinutes(blocks), 3);
  assert.ok(deriveExcerpt(blocks, "").endsWith("..."));

  const samplePosts: BlogPost[] = [
    {
      id: "p1",
      slug: "p1",
      title: "Chasing Monsoon Light",
      subtitle: "Street photography notes",
      excerpt: "Wet streets and neon",
      coverImage: "",
      coverAlt: "",
      topic: "Photography",
      tags: ["Dhaka", "Monsoon"],
      blocks,
      status: "published",
      authorUid: "u1",
      authorName: "Sadman",
      authorRole: "Owner",
      authorPhotoUrl: "",
      readTimeMinutes: 3,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "p2",
      slug: "p2",
      title: "Bilingual Forms at Scale",
      subtitle: "GovTech patterns",
      excerpt: "Bangla and English UI",
      coverImage: "",
      coverAlt: "",
      topic: "Product Design",
      tags: ["GovTech"],
      blocks,
      status: "published",
      authorUid: "u1",
      authorName: "Sadman",
      authorRole: "Owner",
      authorPhotoUrl: "",
      readTimeMinutes: 4,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  assert.equal(filterBlogPosts(samplePosts, "All", "").length, 2);
  assert.equal(filterBlogPosts(samplePosts, "Photography", "").length, 1);
  assert.equal(filterBlogPosts(samplePosts, "All", "bangla").length, 1);
  assert.equal(filterBlogPosts(samplePosts, "Photography", "bangla").length, 0);
});
