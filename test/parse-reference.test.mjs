import { test } from "node:test";
import assert from "node:assert/strict";

import { parseReference } from "../dist/index.js";

test("parses a simple reference", () => {
  assert.deepEqual(parseReference("John 3:16"), {
    book: "John",
    chapter: 3,
    startVerse: 16,
    endVerse: 16,
    isRange: false,
    isWholeChapter: false,
  });
});

test("parses a numbered book abbreviation", () => {
  const r = parseReference("1 Cor 13:4-7");
  assert.equal(r.book, "1 Corinthians");
  assert.equal(r.chapter, 13);
  assert.equal(r.startVerse, 4);
  assert.equal(r.endVerse, 7);
  assert.equal(r.isRange, true);
});

test("parses a trailing-dot abbreviation (Gen.)", () => {
  assert.equal(parseReference("Gen. 1:1").book, "Genesis");
});

test("parses a whole-chapter wildcard", () => {
  const r = parseReference("Psalm 23:*");
  assert.equal(r.book, "Psalms");
  assert.equal(r.isWholeChapter, true);
  assert.equal(r.endVerse, null);
  assert.equal(r.isRange, true);
});

test("returns null for an unknown book", () => {
  assert.equal(parseReference("Nope 1:1"), null);
});

test("numbers, not strings, for chapter and verses", () => {
  const r = parseReference("John 3:16");
  assert.equal(typeof r.chapter, "number");
  assert.equal(typeof r.startVerse, "number");
});
