import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const rules = readFileSync(resolve(process.cwd(), "firestore.rules"), "utf8");
const blueprint = JSON.parse(
  readFileSync(resolve(process.cwd(), "firebase-blueprint.json"), "utf8"),
);

test("firestore.rules starts with default-deny catch-all and covers every blueprint collection", () => {
  assert.ok(rules.includes("rules_version = '2';"));
  const catchAllIndex = rules.indexOf("match /{document=**}");
  const writersIndex = rules.indexOf("match /writers/{writerId}");
  const postsIndex = rules.indexOf("match /posts/{postId}");

  assert.ok(catchAllIndex > 0, "Default-deny catch-all must exist");
  assert.ok(catchAllIndex < writersIndex && catchAllIndex < postsIndex, "Catch-all must come first");

  for (const path of Object.keys(blueprint.firestore)) {
    const cleanPath = path.replace(/^\//, "");
    assert.ok(
      rules.includes(`match /${cleanPath}`),
      `Missing match block for blueprint path ${path}`,
    );
  }
});

test("Dirty Dozen security invariants are enforced across writers and posts rules", () => {
  // 1 & 2: Verified owner check requires email_verified == true for sadmanrhd@gmail.com only
  assert.ok(rules.includes("request.auth.token.email_verified == true"));
  assert.ok(rules.includes("request.auth.token.email.lower() == 'sadmanrhd@gmail.com'"));
  assert.equal(rules.includes("sadman.tiller@gmail.com"), false);

  // 3: PII isolation on /writers — list strictly owner-only, zero get()/exists() in list rules
  const writersListMatch = rules.match(/match \/writers\/\{writerId\}[\s\S]*?allow list:\s*if\s*([^;]+);/);
  assert.ok(writersListMatch, "writers list rule must exist");
  assert.equal(writersListMatch[1].trim(), "isBootstrapAdmin()");
  assert.equal(writersListMatch[1].includes("get("), false);
  assert.equal(writersListMatch[1].includes("exists("), false);

  // 4 & 5: Approved writer gate checks exists() and status == 'active'
  assert.ok(rules.includes("get(writerPath).data.status == 'active'"));
  assert.ok(rules.includes("get(writerPath).data.email == request.auth.token.email.lower()"));

  // 6 & 7: Strict schema keys (hasAll + hasOnly) and update action affectedKeys().hasOnly()
  assert.ok(rules.includes("data.keys().hasAll(["));
  assert.ok(rules.includes("data.keys().hasOnly(["));
  assert.ok(rules.includes("incoming().diff(existing()).affectedKeys().hasOnly(["));

  // 8 & 9: Posts list rule explicitly evaluates existing().status == 'published' with zero DB lookups
  const postsListMatch = rules.match(/match \/posts\/\{postId\}[\s\S]*?allow list:\s*if\s*([^;]+);/);
  assert.ok(postsListMatch, "posts list rule must exist");
  assert.ok(postsListMatch[1].includes("existing().status == 'published'"));
  assert.equal(postsListMatch[1].includes("get("), false);
  assert.equal(postsListMatch[1].includes("exists("), false);

  // 10 & 11: Immutability and server request.time timestamps
  assert.ok(rules.includes("incoming().authorUid == existing().authorUid"));
  assert.ok(rules.includes("incoming().createdAt == existing().createdAt"));
  assert.ok(rules.includes("incoming().createdAt == request.time"));
  assert.ok(rules.includes("incoming().updatedAt == request.time"));

  // 12: Path ID hardening and blueprint maxLength sync
  assert.ok(rules.includes("id.matches('^[a-zA-Z0-9_\\\\-]+$')"));
  assert.ok(rules.includes(`data.title.size() <= ${blueprint.entities.BlogPost.properties.title.maxLength}`));
  assert.ok(rules.includes(`data.subtitle.size() <= ${blueprint.entities.BlogPost.properties.subtitle.maxLength}`));
  assert.ok(rules.includes(`data.excerpt.size() <= ${blueprint.entities.BlogPost.properties.excerpt.maxLength}`));
  assert.ok(rules.includes(`data.coverImage.size() <= ${blueprint.entities.BlogPost.properties.coverImage.maxLength}`));
  assert.ok(rules.includes(`data.displayName.size() <= ${blueprint.entities.Writer.properties.displayName.maxLength}`));
  assert.ok(rules.includes(`data.bio.size() <= ${blueprint.entities.Writer.properties.bio.maxLength}`));

  // 13-15: /inquiries PII isolation (owner-only get/list/update/delete, bounded schema)
  const inquiriesListMatch = rules.match(/match \/inquiries\/\{inquiryId\}[\s\S]*?allow list:\s*if\s*([^;]+);/);
  assert.ok(inquiriesListMatch, "inquiries list rule must exist");
  assert.equal(inquiriesListMatch[1].trim(), "isBootstrapAdmin()");
  assert.ok(rules.includes("allow get: if isValidId(inquiryId) && isBootstrapAdmin();"));
  assert.ok(rules.includes(`data.name.size() <= ${blueprint.entities.Inquiry.properties.name.maxLength}`));
  assert.ok(rules.includes(`data.message.size() <= ${blueprint.entities.Inquiry.properties.message.maxLength}`));
  assert.ok(rules.includes(`data.subject.size() <= ${blueprint.entities.Inquiry.properties.subject.maxLength}`));
  assert.ok(rules.includes("incoming().status == 'new'"));
});
