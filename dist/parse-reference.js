"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseReference = parseReference;
const book_abbreviations_1 = require("./book-abbreviations");
function parseReference(ref) {
    const bookMatch = ref.match(/^((?:\d\s?)?[A-Za-z]+)\.?/);
    const chapterVerseMatch = ref.match(/(\d+)\s*:\s*(\d+|\*)(?:\s*-\s*(\d+))?/);
    if (!bookMatch || !chapterVerseMatch)
        return null;
    const bookKey = bookMatch[1].replace(/\s+/g, "").toLowerCase();
    const book = book_abbreviations_1.BOOK_ABBREVIATIONS[bookKey];
    if (!book)
        return null;
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
