import { test } from "node:test";
import assert from "node:assert/strict";

import { resolveBook } from "../dist/index.js";

// Exact matches
test("resolves canonical names", () => {
  assert.deepEqual(resolveBook("John"), { book: "John", confidence: "exact" });
});

test("resolves abbreviations", () => {
  assert.deepEqual(resolveBook("Jn"), { book: "John", confidence: "exact" });
  assert.deepEqual(resolveBook("Eph"), {
    book: "Ephesians",
    confidence: "exact",
  });
});

test("resolves numbered books with and without a space", () => {
  assert.deepEqual(resolveBook("1 Corinthians"), {
    book: "1 Corinthians",
    confidence: "exact",
  });
  assert.deepEqual(resolveBook("1cor"), {
    book: "1 Corinthians",
    confidence: "exact",
  });
});

test("is case- and punctuation-insensitive", () => {
  assert.deepEqual(resolveBook("GEN."), {
    book: "Genesis",
    confidence: "exact",
  });
});

// High-confidence corrections
test("fixes a transposition", () => {
  assert.deepEqual(resolveBook("Ephesains"), {
    book: "Ephesians",
    confidence: "high",
  });
});

test("fixes a single substitution", () => {
  assert.deepEqual(resolveBook("Galations"), {
    book: "Galatians",
    confidence: "high",
  });
});

test("fixes a single insertion (extra pluralizing s)", () => {
  assert.deepEqual(resolveBook("Revelations"), {
    book: "Revelation",
    confidence: "high",
  });
});

test("fixes a single deletion (dropped letter)", () => {
  assert.deepEqual(resolveBook("Philipians"), {
    book: "Philippians",
    confidence: "high",
  });
});

test("corrects a misspelled numbered book while keeping the number", () => {
  assert.deepEqual(resolveBook("1 Corinthans"), {
    book: "1 Corinthians",
    confidence: "high",
  });
});

test("corrects a misspelling of a known abbreviation", () => {
  assert.deepEqual(resolveBook("math"), { book: "Matthew", confidence: "high" });
  assert.deepEqual(resolveBook("phill"), {
    book: "Philippians",
    confidence: "high",
  });
  assert.deepEqual(resolveBook("duet"), {
    book: "Deuteronomy",
    confidence: "high",
  });
});

test("applies a two-edit misspelling that dominates the field", () => {
  assert.deepEqual(resolveBook("phillipians"), {
    book: "Philippians",
    confidence: "high",
  });
  assert.deepEqual(resolveBook("Filippians"), {
    book: "Philippians",
    confidence: "high",
  });
});

// Medium-confidence suggestions
test("suggests, not applies, when a two-edit match has a close rival", () => {
  assert.deepEqual(resolveBook("janesis"), {
    book: "Genesis",
    confidence: "medium",
  });
});

// Structure-gated truncations
const inReference = { hasChapterVerse: true };

test("never auto-applies a truncation out of context", () => {
  assert.equal(resolveBook("Ecclesi"), null);
  assert.notEqual(resolveBook("Philip")?.confidence, "high");
  assert.notEqual(resolveBook("Deuter")?.confidence, "high");
});

test("completes a truncation when the syntax marks a reference", () => {
  assert.deepEqual(resolveBook("Philip", inReference), {
    book: "Philippians",
    confidence: "high",
  });
  assert.deepEqual(resolveBook("Ecclesi", inReference), {
    book: "Ecclesiastes",
    confidence: "high",
  });
  assert.deepEqual(resolveBook("Deuter", inReference), {
    book: "Deuteronomy",
    confidence: "high",
  });
});

test("still does not snap a non-book word inside a reference", () => {
  assert.equal(resolveBook("Room", inReference), null);
  assert.equal(resolveBook("Level", inReference), null);
  assert.equal(resolveBook("Score", inReference), null);
});

test("will not complete a truncation shared by two books", () => {
  assert.equal(resolveBook("Thessa", inReference), null);
});

// Stays quiet when unsure
test("returns null for genuine non-books", () => {
  assert.equal(resolveBook("Madeup"), null);
  assert.equal(resolveBook("Notes"), null);
});

test("does not fuzzy-match very short inputs", () => {
  assert.deepEqual(resolveBook("Jon"), { book: "Jonah", confidence: "exact" });
  assert.equal(resolveBook("Xyz"), null);
});

test("will not guess between two equally-close books", () => {
  assert.equal(resolveBook("Corinthians"), null);
});

test("returns null for empty input", () => {
  assert.equal(resolveBook(""), null);
  assert.equal(resolveBook("   "), null);
});
