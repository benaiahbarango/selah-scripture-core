"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseReference = parseReference;
const resolve_book_1 = require("./resolve-book");
function parseReference(ref) {
    const bookMatch = ref.match(/^((?:\d\s?)?[A-Za-z]+)\.?/);
    const chapterVerseMatch = ref.match(/(\d+)\s*:\s*(\d+|\*)(?:\s*-\s*(\d+))?/);
    if (!bookMatch || !chapterVerseMatch)
        return null;
    const rawBook = bookMatch[1].trim();
    const resolved = (0, resolve_book_1.resolveBook)(rawBook, {
        hasChapterVerse: true,
        hasRange: !!chapterVerseMatch[3] || chapterVerseMatch[2] === "*",
        hasNumberPrefix: /^\d/.test(rawBook),
    });
    // Only auto-convert when confident. "medium" guesses are left for a
    // suggestion affordance so a wrong correction never lands silently.
    if (!resolved || resolved.confidence === "medium")
        return null;
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
