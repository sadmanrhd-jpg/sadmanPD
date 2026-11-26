# Security Specification: Blog Auth & Editorial Firestore Rules

## 1. Data Invariants

1. **Owner Root of Trust**: Only the verified portfolio owner (`sadmanrhd@gmail.com` with `email_verified == true`) can create, update, list, or delete documents in `/writers/{writerId}`.
2. **PII Isolation**: The `/writers/{writerId}` collection contains writer email addresses. Non-admin users can only `get` their own writer document (when `writerId == emailToDocId(request.auth.token.email)` and `resource.data.email == request.auth.token.email.lower()`), and can NEVER `list` `/writers`.
3. **Writer Authorization Gate**: Only the verified owner or an active invited writer (`exists(/writers/{emailKey})` with `status == 'active'` and matching lowercase email) can create, update, or delete posts.
4. **Public Read vs. Private Draft**: Anyone (including unauthenticated visitors) can `get` and `list` documents in `/posts/{postId}` ONLY where `resource.data.status == 'published'`. Draft posts (`status == 'draft'`) can only be read by their own `authorUid` or the verified owner.
5. **Identity Integrity & Immutability**: On post creation, `authorUid` must equal `request.auth.uid`, and `createdAt`/`updatedAt` must equal `request.time`. On update, `authorUid` and `createdAt` are immutable, and a writer can only modify their own posts.
6. **Strict Schema & Size Guards**: Every document ID must match `^[a-zA-Z0-9_\-]+$` (max 128 chars), every string and array has bounded length, and no shadow/ghost fields are allowed (`hasAll` + `hasOnly` on create, `affectedKeys().hasOnly(...)` on update).

## 2. The "Dirty Dozen" Adversarial Payloads

| # | Attack Vector | Target Collection | Malicious Payload / Request | Expected Result |
|---|--------------|-------------------|-----------------------------|-----------------|
| 1 | Self-Privilege Escalation | `/writers/{id}` | Non-owner user writes `{ role: "admin", status: "active", ... }` to `/writers/attacker_gmail_com` | `PERMISSION_DENIED` |
| 2 | Unverified Admin Email Spoof | `/writers/{id}` | Token with `email: "sadmanrhd@gmail.com"` and `email_verified: false` lists `/writers` | `PERMISSION_DENIED` |
| 3 | Writer PII Scraping | `/writers` | Invited writer attempts `list` on `/writers` or `get` on another writer's doc | `PERMISSION_DENIED` |
| 4 | Uninvited User Publishing | `/posts/{id}` | Authenticated Google user not in `/writers` creates a `published` post | `PERMISSION_DENIED` |
| 5 | Paused Writer Bypass | `/posts/{id}` | Writer with `status: "paused"` attempts to create or update a post | `PERMISSION_DENIED` |
| 6 | Author Impersonation | `/posts/{id}` | Active writer creates post with `authorUid: "other_user_uid"` | `PERMISSION_DENIED` |
| 7 | Shadow / Ghost Field Injection | `/posts/{id}` | Active writer creates or updates post adding `{ isFeatured: true }` or `{ isAdmin: true }` | `PERMISSION_DENIED` |
| 8 | Cross-Author Hijack | `/posts/{id}` | Writer A attempts to update or delete a post where `existing().authorUid == "writer_b"` | `PERMISSION_DENIED` |
| 9 | Draft Leakage | `/posts/{id}` | Unauthenticated visitor or Writer B reads a post where `status == "draft"` | `PERMISSION_DENIED` |
| 10 | Immutable Timestamp / Owner Tamper | `/posts/{id}` | Author updates their post changing `createdAt` or `authorUid` | `PERMISSION_DENIED` |
| 11 | Client Clock Forgery | `/posts/{id}` | Author creates post with backdated `createdAt` (`!= request.time`) | `PERMISSION_DENIED` |
| 12 | ID & Resource Poisoning | `/posts/{id}` | Author writes with 300-char invalid `postId` containing spaces or `tags` array with 25 entries | `PERMISSION_DENIED` |
| 13 | Inquiry PII Scraping | `/inquiries` | Unauthenticated visitor or invited writer attempts `get` or `list` on `/inquiries` | `PERMISSION_DENIED` |
| 14 | Inquiry Forged Status / Shadow Fields | `/inquiries/{id}` | Public visitor creates inquiry with `status: "archived"` or extra field `isAdmin: true` or oversized message | `PERMISSION_DENIED` |
| 15 | Inquiry Content Tampering | `/inquiries/{id}` | Non-owner updates or deletes an existing inquiry, or owner mutates immutable sender `message`/`createdAt` | `PERMISSION_DENIED` |
