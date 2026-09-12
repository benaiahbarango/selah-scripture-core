"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveBook = void 0;
const book_abbreviations_1 = require("./book-abbreviations");
const normalizeKey = (raw) => raw.toLowerCase().replace(/\./g, "").replace(/\s+/g, "");
const splitPrefix = (key) => {
    const match = key.match(/^([123])(.+)$/);
    return match
        ? { prefix: match[1], core: match[2] }
        : { prefix: "", core: key };
};
// Optimal string alignment distance (Damerau-Levenshtein restricted to
// adjacent transpositions). A transposition counts as a single edit because it
// is the most common real-world typo — "Ephesains" for "Ephesians".
const osaDistance = (a, b) => {
    const m = a.length;
    const n = b.length;
    if (m === 0)
        return n;
    if (n === 0)
        return m;
    const d = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++)
        d[i][0] = i;
    for (let j = 0; j <= n; j++)
        d[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
            if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
                d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
            }
        }
    }
    return d[m][n];
};
const CANONICAL_BOOKS = Array.from(new Set(Object.values(book_abbreviations_1.BOOK_ABBREVIATIONS))).map((name) => ({ name, ...splitPrefix(normalizeKey(name)) }));
// Every known way to write each book — full name and abbreviations — so a
// misspelling can be measured against the spelling the writer was reaching for
// ("phill" for the abbreviation "phil", "duet" for "deut"), not just the full
// name. Short spellings are excluded from fuzzy matching: a one-letter slip off
// a 3-letter abbreviation ("rom" -> "room") is too often a real word.
const MIN_FUZZY_SPELLING = 4;
const BOOK_SPELLINGS = Object.entries(book_abbreviations_1.BOOK_ABBREVIATIONS)
    .map(([key, name]) => ({ name, ...splitPrefix(normalizeKey(key)) }))
    .filter((s) => s.core.length >= MIN_FUZZY_SPELLING);
const structureStrength = (structure) => {
    if (!structure)
        return 0;
    return ((structure.hasChapterVerse ? 2 : 0) +
        (structure.hasRange ? 1 : 0) +
        (structure.hasNumberPrefix ? 1 : 0));
};
const resolveByEditDistance = (core, prefix) => {
    var _a, _b, _c;
    // Distance to the closest spelling of each book, then rank books by it, so a
    // book is judged by its nearest form (full name or abbreviation).
    const nearestByBook = new Map();
    for (const spelling of BOOK_SPELLINGS) {
        if (spelling.prefix !== prefix)
            continue;
        const distance = osaDistance(core, spelling.core);
        if (distance < ((_a = nearestByBook.get(spelling.name)) !== null && _a !== void 0 ? _a : Infinity)) {
            nearestByBook.set(spelling.name, distance);
        }
    }
    const scored = Array.from(nearestByBook, ([name, distance]) => ({
        name,
        distance,
    })).sort((a, b) => a.distance - b.distance);
    const best = scored[0];
    if (!best)
        return null;
    const margin = ((_c = (_b = scored[1]) === null || _b === void 0 ? void 0 : _b.distance) !== null && _c !== void 0 ? _c : Infinity) - best.distance;
    // No clear winner — the guess is a coin flip, so stay quiet.
    if (margin < 1)
        return null;
    // Reject matches too far to be a plausible typo of a real book. Longer words
    // absorb more edits before they stop looking like the intended book.
    const maxEdits = core.length <= 5 ? 1 : core.length <= 8 ? 2 : 3;
    if (best.distance > maxEdits)
        return null;
    // A single edit off an unambiguous winner is a confident correction.
    if (best.distance === 1)
        return { book: best.name, confidence: "high" };
    // More edits, but if it dominates the field ("phillipians" is miles from any
    // book but Philippians) it is still safe to apply. A close rival stays a
    // suggestion.
    if (margin >= 2)
        return { book: best.name, confidence: "high" };
    return { book: best.name, confidence: "medium" };
};
// A truncation ("Philip", "Ecclesi") reads as many deletions to edit distance,
// but it cleanly identifies a book when it is the start of exactly one. This
// only runs under strong reference structure, so an arbitrary word before a
// number ("Room 3:15") is never completed into a book.
const resolveByPrefix = (core, prefix) => {
    const matches = CANONICAL_BOOKS.filter((c) => c.prefix === prefix &&
        c.core.length > core.length &&
        c.core.startsWith(core));
    if (matches.length !== 1)
        return null;
    return { book: matches[0].name, confidence: "high" };
};
const resolveBook = (rawBook, structure) => {
    const key = normalizeKey(rawBook);
    if (!key)
        return null;
    const exact = book_abbreviations_1.BOOK_ABBREVIATIONS[key];
    if (exact)
        return { book: exact, confidence: "exact" };
    const { prefix, core } = splitPrefix(key);
    // Too short to distinguish a typo or truncation from a different book
    // (e.g. "jn" vs "jon", "jo" vs any of John/Jonah/Joel/Job).
    if (core.length < 4)
        return null;
    const byEdit = resolveByEditDistance(core, prefix);
    if ((byEdit === null || byEdit === void 0 ? void 0 : byEdit.confidence) === "high")
        return byEdit;
    if (structureStrength(structure) >= 2) {
        const byPrefix = resolveByPrefix(core, prefix);
        if (byPrefix)
            return byPrefix;
    }
    return byEdit;
};
exports.resolveBook = resolveBook;
