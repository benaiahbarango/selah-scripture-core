export type BookConfidence = "exact" | "high" | "medium";
export type ResolvedBook = {
    book: string;
    confidence: BookConfidence;
};
export type ReferenceStructure = {
    hasChapterVerse: boolean;
    hasRange?: boolean;
    hasNumberPrefix?: boolean;
};
export declare const resolveBook: (rawBook: string, structure?: ReferenceStructure) => ResolvedBook | null;
