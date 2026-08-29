# @selah/scripture-core

Single source of truth for Bible-reference **detection, parsing, and Tiptap
wiring** shared by the Selah mobile app and website. Both apps consume this repo
as a git dependency so the regex, book map, and versification never drift again.

## What lives here

**Pure core** (`@selah/scripture-core`, zero runtime dependencies):

- `SCRIPTURE_REGEX`, `SCRIPTURE_TRIGGER`, `SCRIPTURE_START_BOUNDARY`,
  `buildInputRuleRegex()`, `buildEnterRegex()`
- `BOOK_ABBREVIATIONS`, `BOOK_ABBREVIATIONS_REVERSED`
- `VERSE_COUNTS` — canonical KJV versification (`book → [lastVersePerChapter]`)
- `parseReference(ref)` — pure string → structured reference (numbers)
- `resolveReference(ref)` — parse + validate + clamp verses + resolve `*`
  whole-chapter wildcards, using `VERSE_COUNTS`. No network, no bundled text.
- `formatReference(ref)`, and the `BibleReference` / `ParsedReference` types

**Tiptap layer** (`@selah/scripture-core/tiptap`, Tiptap `^3` as peer deps):

- `createSharedExtensionConfig(getAttrs)` — attributes, `Enter`/`Backspace`
  shortcuts, the `convertScripture` command, `renderText`
- `createScriptureInputRule(name, getAttrs)`,
  `createScriptureCardInputRule(name, getAttrs)`, `applyCardInsertion`
- `handleScriptureEnter`, `resolveScriptureMatch`

Each app passes its own `getAttrs` resolver so it can layer app-specific
validation on top of `resolveReference` (the website gates on its YouVersion
USFM map; mobile uses `resolveReference` directly). Node views and rendering
stay in each app.

## Consuming it

```jsonc
// package.json in each app
"@selah/scripture-core": "github:benaiahbarango/selah-scripture-core#v0.1.0"
```

```ts
import { resolveReference, SCRIPTURE_REGEX } from "@selah/scripture-core";
import { createScriptureInputRule } from "@selah/scripture-core/tiptap";
```

`dist/` is committed, so a git install needs no build step and works in Metro,
Vite, and Next without extra bundler config.

## Making a change

1. Edit `src/`, add/adjust a test in `test/`.
2. `npm test` (builds, then runs the Node test runner).
3. Commit, then tag a new version: `git tag v0.2.0 && git push --tags`.
4. In each app bump the pinned tag in `package.json` and reinstall.

## Regenerating the verse table

`VERSE_COUNTS` is generated from the mobile app's bundled KJV data:

```bash
node scripts/gen-verse-counts.mjs > /tmp/vc.json   # then update src/verse-counts.ts
```
