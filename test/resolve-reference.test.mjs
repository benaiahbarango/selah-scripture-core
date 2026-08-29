import { test } from "node:test";
import assert from "node:assert/strict";

import { resolveReference } from "../dist/index.js";

test("resolves and validates a concrete reference", () => {
  assert.deepEqual(resolveReference("John 3:16"), {
    book: "John",
    chapter: 3,
    startVerse: 16,
    endVerse: 16,
    isRange: false,
  });
});

test("clamps an out-of-range end verse to the chapter length", () => {
  const r = resolveReference("John 3:16-999");
  assert.equal(r.endVerse, 36);
});

test("resolves a whole-chapter wildcard to the real last verse", () => {
  const r = resolveReference("Psalm 119:*");
  assert.equal(r.startVerse, 1);
  assert.equal(r.endVerse, 176);
  assert.equal(r.isRange, true);
});

test("returns null for a non-existent chapter", () => {
  assert.equal(resolveReference("John 99:1"), null);
});

test("Song of Solomon resolves (canonical casing fix)", () => {
  const r = resolveReference("Song 2:1");
  assert.equal(r.book, "Song Of Solomon");
  assert.equal(r.chapter, 2);
});

test("fully-spelled 1 Thessalonians resolves (drift fix)", () => {
  const r = resolveReference("1thessalonians 5:16");
  assert.equal(r.book, "1 Thessalonians");
});
