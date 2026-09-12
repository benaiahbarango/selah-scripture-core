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

test("tolerates whitespace around the colon", () => {
  assert.deepEqual(resolveReference("Ex 4: 5"), resolveReference("Ex 4:5"));
  assert.deepEqual(resolveReference("Mat 4 : 5"), resolveReference("Mat 4:5"));
});

test("tolerates whitespace around the range dash", () => {
  const r = resolveReference("Romans 8 : 28 - 30");
  assert.equal(r.startVerse, 28);
  assert.equal(r.endVerse, 30);
  assert.equal(r.isRange, true);
});

test("auto-corrects a high-confidence book misspelling", () => {
  const r = resolveReference("Ephesains 1:3");
  assert.equal(r.book, "Ephesians");
  assert.equal(r.chapter, 1);
  assert.equal(r.startVerse, 3);
});

test("completes a truncation inside a reference", () => {
  assert.equal(resolveReference("Philip 4:13").book, "Philippians");
});

test("does not auto-convert a medium-confidence guess", () => {
  assert.equal(resolveReference("janesis 1:1"), null);
});
