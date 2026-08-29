export type BibleReference = {
    book: string;
    chapter: number;
    startVerse: number;
    endVerse: number;
    isRange?: boolean;
};
export type ParsedReference = {
    book: string;
    chapter: number;
    startVerse: number;
    endVerse: number | null;
    isRange: boolean;
    isWholeChapter: boolean;
};
