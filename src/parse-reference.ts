import { resolveBook } from "./resolve-book";
import { ParsedReference } from "./types";

export function parseReference(ref: string): ParsedReference | null {
  const bookMatch = ref.match(/^((?:\d\s?)?[A-Za-z]+)\.?/);
  const chapterVerseMatch = ref.match(/(\d+)\s*:\s*(\d+|\*)(?:\s*-\s*(\d+))?/);

  if (!bookMatch || !chapterVerseMatch) return null;

  const rawBook = bookMatch[1].trim();

  const resolved = resolveBook(rawBook, {
    hasChapterVerse: true,
    hasRange: !!chapterVerseMatch[3] || chapterVerseMatch[2] === "*",
    hasNumberPrefix: /^\d/.test(rawBook),
  });

  // Only auto-convert when confident. "medium" guesses are left for a
  // suggestion affordance so a wrong correction never lands silently.
  if (!resolved || resolved.confidence === "medium") return null;

  const book = resolved.book;
  const chapter = Number(chapterVerseMatch[1]);
  const verseToken = chapterVerseMatch[2];

  if (verseToken === "*") {
    return {
      book,
      chapter,
      startVerse: 1,
      endVerse: null,
      isRange: true,
      isWholeChapter: true,
    };
  }

  const startVerse = Number(verseToken);
  const endVerse = chapterVerseMatch[3] ? Number(chapterVerseMatch[3]) : startVerse;

  return {
    book,
    chapter,
    startVerse,
    endVerse,
    isRange: !!chapterVerseMatch[3] && endVerse > startVerse,
    isWholeChapter: false,
  };
}
