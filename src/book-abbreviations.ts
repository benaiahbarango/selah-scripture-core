export const BOOK_ABBREVIATIONS: { [key: string]: string } = {
  // Old Testament
  gen: "Genesis",
  genesis: "Genesis",

  ex: "Exodus",
  exo: "Exodus",
  exodus: "Exodus",

  lev: "Leviticus",
  leviticus: "Leviticus",

  num: "Numbers",
  numbers: "Numbers",

  deu: "Deuteronomy",
  deut: "Deuteronomy",
  dt: "Deuteronomy",
  deuteronomy: "Deuteronomy",

  jos: "Joshua",
  josh: "Joshua",
  joshua: "Joshua",
  jsh: "Joshua",

  jdg: "Judges",
  judg: "Judges",
  judges: "Judges",

  rut: "Ruth",
  rth: "Ruth",
  ruth: "Ruth",

  "1sa": "1 Samuel",
  "1sam": "1 Samuel",
  "1samuel": "1 Samuel",

  "2sa": "2 Samuel",
  "2sam": "2 Samuel",
  "2samuel": "2 Samuel",

  "1ki": "1 Kings",
  "1kings": "1 Kings",
  "1kgs": "1 Kings",

  "2ki": "2 Kings",
  "2kings": "2 Kings",
  "2kgs": "2 Kings",

  "1ch": "1 Chronicles",
  "1chr": "1 Chronicles",
  "1chron": "1 Chronicles",
  "1chronicles": "1 Chronicles",

  "2ch": "2 Chronicles",
  "2chr": "2 Chronicles",
  "2chron": "2 Chronicles",
  "2chronicles": "2 Chronicles",

  ezr: "Ezra",
  ezra: "Ezra",

  neh: "Nehemiah",
  nehemiah: "Nehemiah",

  est: "Esther",
  esth: "Esther",
  esther: "Esther",

  job: "Job",

  ps: "Psalms",
  psa: "Psalms",
  psalm: "Psalms",
  psalms: "Psalms",

  pro: "Proverbs",
  prov: "Proverbs",
  proverbs: "Proverbs",

  ecc: "Ecclesiastes",
  eccl: "Ecclesiastes",
  ecclesiastes: "Ecclesiastes",

  sng: "Song Of Solomon",
  song: "Song Of Solomon",
  sos: "Song Of Solomon",

  isa: "Isaiah",
  is: "Isaiah",
  isaiah: "Isaiah",

  jer: "Jeremiah",
  jeremiah: "Jeremiah",

  lam: "Lamentations",
  lamentations: "Lamentations",

  ezk: "Ezekiel",
  ezek: "Ezekiel",
  eze: "Ezekiel",
  ezekiel: "Ezekiel",

  dan: "Daniel",
  daniel: "Daniel",

  hos: "Hosea",
  hosea: "Hosea",

  jol: "Joel",
  joel: "Joel",

  amo: "Amos",
  amos: "Amos",

  oba: "Obadiah",
  obad: "Obadiah",
  obadiah: "Obadiah",

  jon: "Jonah",
  jonah: "Jonah",

  mic: "Micah",
  micah: "Micah",

  nah: "Nahum",
  nam: "Nahum",
  nahum: "Nahum",

  hab: "Habakkuk",
  habakkuk: "Habakkuk",

  zeph: "Zephaniah",
  zep: "Zephaniah",
  zephaniah: "Zephaniah",

  hag: "Haggai",
  haggai: "Haggai",

  zech: "Zechariah",
  zec: "Zechariah",
  zechariah: "Zechariah",

  mal: "Malachi",
  malachi: "Malachi",

  // New Testament
  mt: "Matthew",
  mat: "Matthew",
  matt: "Matthew",
  matthew: "Matthew",

  mk: "Mark",
  mark: "Mark",
  mrk: "Mark",

  lk: "Luke",
  luk: "Luke",
  luke: "Luke",

  jhn: "John",
  jn: "John",
  john: "John",

  act: "Acts",
  acts: "Acts",

  rm: "Romans",
  rom: "Romans",
  romans: "Romans",

  "1co": "1 Corinthians",
  "1cor": "1 Corinthians",
  "1corinthians": "1 Corinthians",

  "2co": "2 Corinthians",
  "2cor": "2 Corinthians",
  "2corinthians": "2 Corinthians",

  gal: "Galatians",
  galatians: "Galatians",

  eph: "Ephesians",
  ephesians: "Ephesians",

  phil: "Philippians",
  php: "Philippians",
  philippians: "Philippians",

  col: "Colossians",
  colossians: "Colossians",

  "1thess": "1 Thessalonians",
  "1th": "1 Thessalonians",
  "1thessalonians": "1 Thessalonians",

  "2thess": "2 Thessalonians",
  "2th": "2 Thessalonians",
  "2thessalonians": "2 Thessalonians",

  "1ti": "1 Timothy",
  "1tim": "1 Timothy",
  "1timothy": "1 Timothy",

  "2ti": "2 Timothy",
  "2tim": "2 Timothy",
  "2timothy": "2 Timothy",

  tit: "Titus",
  titus: "Titus",

  phm: "Philemon",
  phlm: "Philemon",
  philemon: "Philemon",

  heb: "Hebrews",
  hebrews: "Hebrews",

  jas: "James",
  jms: "James",
  james: "James",

  "1pe": "1 Peter",
  "1pet": "1 Peter",
  "1peter": "1 Peter",

  "2pe": "2 Peter",
  "2pet": "2 Peter",
  "2peter": "2 Peter",

  "1jn": "1 John",
  "1john": "1 John",

  "2jn": "2 John",
  "2john": "2 John",

  "3jn": "3 John",
  "3john": "3 John",

  jud: "Jude",
  jude: "Jude",

  rev: "Revelation",
  revelation: "Revelation",
};

export const BOOK_ABBREVIATIONS_REVERSED = Object.entries(
  BOOK_ABBREVIATIONS,
).reduce(
  (acc, [key, value]) => {
    if (!acc[value]) {
      acc[value] = key;
    }
    return acc;
  },
  {} as { [key: string]: string },
);
