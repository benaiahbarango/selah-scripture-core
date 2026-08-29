import { kjvData } from "/home/user/selah-mobile-app/src/assets/bibles/kjv-organized.js";

const RENAME = { "Song of Solomon": "Song Of Solomon" };

const out = {};
for (const [rawBook, data] of Object.entries(kjvData.books)) {
  const book = RENAME[rawBook] ?? rawBook;
  const chapters = data.chapters;
  const nums = Object.keys(chapters).map(Number).sort((a, b) => a - b);
  const counts = [];
  for (const n of nums) {
    const verses = chapters[n];
    counts[n - 1] = verses[verses.length - 1]?.verse ?? verses.length;
  }
  out[book] = counts;
}
process.stdout.write(JSON.stringify(out));
