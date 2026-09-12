export {
  BOOK_ABBREVIATIONS,
  BOOK_ABBREVIATIONS_REVERSED,
} from "./book-abbreviations";
export {
  SCRIPTURE_REGEX,
  SCRIPTURE_TRIGGER,
  SCRIPTURE_START_BOUNDARY,
  buildInputRuleRegex,
  buildEnterRegex,
} from "./regex";
export { VERSE_COUNTS } from "./verse-counts";
export { parseReference } from "./parse-reference";
export { resolveReference } from "./resolve-reference";
export { resolveBook } from "./resolve-book";
export { formatReference } from "./format-reference";
export type { BibleReference, ParsedReference } from "./types";
export type {
  BookConfidence,
  ResolvedBook,
  ReferenceStructure,
} from "./resolve-book";
