import { test } from "node:test";
import assert from "node:assert/strict";

import { formatReference } from "../dist/index.js";

test("formats a single verse", () => {
  assert.equal(
    formatReference({ book: "John", chapter: 3, startVerse: 16, endVerse: 16 }),
    "John 3:16",
  );
});

test("formats a verse range", () => {
  assert.equal(
    formatReference({
      book: "1 Corinthians",
      chapter: 13,
      startVerse: 4,
      endVerse: 7,
    }),
    "1 Corinthians 13:4-7",
  );
});

test("collapses an inverted range to the start verse", () => {
  assert.equal(
    formatReference({ book: "John", chapter: 3, startVerse: 16, endVerse: 10 }),
    "John 3:16",
  );
});
