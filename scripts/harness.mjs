// デザインハーネス: 任意値とgray以外の色を禁止する。
// --release を付けると〔仮〕の原稿が残っている場合も失敗する。
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const release = process.argv.includes('--release');
const files = readdirSync('src', { recursive: true })
  .map((file) => join('src', String(file)))
  .filter((file) => /\.(astro|mdx|ts|css)$/.test(file));

const classAttr = /\bclass(?::list)?=(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\})/g;
const applyRule = /@apply\s+([^;]+);/g;
const offPalette =
  /\b(?:bg|text|border|ring|outline|divide|fill|stroke|from|via|to|shadow|accent|caret|decoration|placeholder)-(?:slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/g;

const errors = [];
for (const file of files) {
  const source = readFileSync(file, 'utf8');
  const classes = [...source.matchAll(classAttr), ...source.matchAll(applyRule)]
    .flatMap((match) => match.slice(1).filter(Boolean))
    .flatMap((value) => value.split(/\s+/));

  for (const name of classes) {
    if (name.includes('[')) errors.push(`${file}: 任意値は禁止です: ${name}`);
  }
  for (const [name] of source.matchAll(offPalette)) {
    errors.push(`${file}: gray以外の色は禁止です: ${name}`);
  }
  if (release && source.includes('〔仮〕')) {
    errors.push(`${file}: 〔仮〕の原稿が残っています`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`harness: ${files.length} files OK`);
