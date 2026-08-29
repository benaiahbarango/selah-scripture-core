"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveReference = resolveReference;
const parse_reference_1 = require("./parse-reference");
const verse_counts_1 = require("./verse-counts");
function resolveReference(ref) {
    var _a;
    const parsed = (0, parse_reference_1.parseReference)(ref);
    if (!parsed)
        return null;
    const { book, chapter, isWholeChapter } = parsed;
    const chapters = verse_counts_1.VERSE_COUNTS[book];
    if (!chapters)
        return null;
    const lastVerse = chapters[chapter - 1];
    if (!lastVerse)
        return null;
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
    const endVerse = Math.min((_a = parsed.endVerse) !== null && _a !== void 0 ? _a : parsed.startVerse, lastVerse);
    return {
        book,
        chapter,
        startVerse,
        endVerse,
        isRange: endVerse > startVerse,
    };
}
