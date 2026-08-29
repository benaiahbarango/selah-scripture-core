import { BibleReference } from "./types";

export const formatReference = (reference: BibleReference) => {
  const { book } = reference;
  const chapter = Number(reference.chapter);
  const startVerse = Number(reference.startVerse);
  const endVerse = Number(reference.endVerse);

  if (startVerse < 1) {
    return `${book} ${chapter}`;
  }

  if (startVerse === endVerse || endVerse === 0 || startVerse > endVerse) {
    return `${book} ${chapter}:${startVerse}`;
  }

  return `${book} ${chapter}:${startVerse}-${endVerse}`;
};
