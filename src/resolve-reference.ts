import { parseReference } from "./parse-reference";
import { BibleReference } from "./types";
import { VERSE_COUNTS } from "./verse-counts";

export function resolveReference(ref: string): BibleReference | null {
  const parsed = parseReference(ref);
  if (!parsed) return null;

  const { book, chapter, isWholeChapter } = parsed;

  const chapters = VERSE_COUNTS[book];
  if (!chapters) return null;

  const lastVerse = chapters[chapter - 1];
  if (!lastVerse) return null;

  if (isWholeChapter) {
    return {
      book,
      chapter,
      startVerse: 1,
      endVerse: lastVerse,
      isRange: lastVerse > 1,
    };
  }

  const startVerse = Math.min(parsed.startVerse, lastVerse);
  const endVerse = Math.min(parsed.endVerse ?? parsed.startVerse, lastVerse);

  return {
    book,
    chapter,
    startVerse,
    endVerse,
    isRange: endVerse > startVerse,
  };
}
