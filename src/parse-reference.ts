import { BOOK_ABBREVIATIONS } from "./book-abbreviations";
import { ParsedReference } from "./types";

export function parseReference(ref: string): ParsedReference | null {
  const bookMatch = ref.match(/^((?:\d\s?)?[A-Za-z]+)\.?/);
  const chapterVerseMatch = ref.match(/(\d+):(\d+|\*)(?:-(\d+))?/);

  if (!bookMatch || !chapterVerseMatch) return null;

  const bookKey = bookMatch[1].replace(/\s+/g, "").toLowerCase();
  const book = BOOK_ABBREVIATIONS[bookKey];

  if (!book) return null;

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
