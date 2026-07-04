#!/usr/bin/env node
// Auto-drafts a translation of the sibling-language file whenever a
// src/content/{segments,solutions}/*.en.md or *.no.md file changes.
// Run by .github/workflows/translate.yml — requires DEEPL_API_KEY.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import matter from 'gray-matter';

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

const TRANSLATABLE_SCALAR_FIELDS = ['title', 'excerpt', 'heroImageAlt', 'imageAlt', 'seoTitle', 'seoDescription'];
const DEEPL_TARGET_LANG = { en: 'EN-US', no: 'NB' };
const DEEPL_SOURCE_LANG = { en: 'EN', no: 'NB' };

function getChangedContentFiles() {
  const diff = execSync('git diff --name-only HEAD^ HEAD', { encoding: 'utf8' });
  return diff
    .split('\n')
    .map((f) => f.trim())
    .filter((f) => /^src\/content\/(segments|solutions)\/.+\.(en|no)\.md$/.test(f))
    .filter((f) => fs.existsSync(f));
}

function siblingPath(filePath) {
  if (filePath.endsWith('.en.md')) return filePath.replace(/\.en\.md$/, '.no.md');
  if (filePath.endsWith('.no.md')) return filePath.replace(/\.no\.md$/, '.en.md');
  return null;
}

function sourceLangFromPath(filePath) {
  return filePath.endsWith('.en.md') ? 'en' : filePath.endsWith('.no.md') ? 'no' : null;
}

async function translateTexts(texts, sourceLang, targetLang) {
  if (texts.length === 0) return [];
  const response = await fetch(DEEPL_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: texts,
      source_lang: DEEPL_SOURCE_LANG[sourceLang],
      target_lang: DEEPL_TARGET_LANG[targetLang],
    }),
  });
  if (!response.ok) {
    throw new Error(`DeepL API error ${response.status}: ${await response.text()}`);
  }
  const data = await response.json();
  return data.translations.map((t) => t.text);
}

async function translatePairInto(sourcePath, targetPath) {
  const sourceLang = sourceLangFromPath(sourcePath);
  const targetLang = sourceLang === 'en' ? 'no' : 'en';

  const source = matter(fs.readFileSync(sourcePath, 'utf8'));
  const target = matter(fs.readFileSync(targetPath, 'utf8'));

  const scalarFields = TRANSLATABLE_SCALAR_FIELDS.filter(
    (f) => typeof source.data[f] === 'string' && source.data[f].length > 0,
  );
  const statLabels = Array.isArray(source.data.stats) ? source.data.stats.map((s) => s.label ?? '') : [];

  const texts = [...scalarFields.map((f) => source.data[f]), ...statLabels, source.content];
  const translated = await translateTexts(texts, sourceLang, targetLang);

  let i = 0;
  const newData = { ...target.data }; // keep target's own lang/keys/slug/image/order untouched
  for (const field of scalarFields) newData[field] = translated[i++];
  if (statLabels.length > 0) {
    newData.stats = source.data.stats.map((s, idx) => ({ ...s, label: translated[i + idx] }));
    i += statLabels.length;
  }
  const newBody = translated[i++];

  const marker = `<!-- Automatisk oversatt ${new Date().toISOString().slice(0, 10)} av DeepL — sjekk teksten før publisering -->\n\n`;
  fs.writeFileSync(targetPath, matter.stringify(marker + newBody.trim() + '\n', newData));
  console.log(`Updated ${targetPath} (translated from ${sourcePath})`);
}

async function main() {
  if (!DEEPL_API_KEY) throw new Error('DEEPL_API_KEY environment variable is not set.');

  const changedFiles = getChangedContentFiles();
  if (changedFiles.length === 0) {
    console.log('No relevant content files changed — nothing to translate.');
    return;
  }

  const processedPairs = new Set();
  let anyUpdated = false;

  for (const file of changedFiles) {
    const sibling = siblingPath(file);
    if (!sibling || !fs.existsSync(sibling)) {
      console.log(`Skipping ${file} — no sibling translation file found.`);
      continue;
    }
    const pairKey = [file, sibling].sort().join('|');
    if (processedPairs.has(pairKey)) continue;
    processedPairs.add(pairKey);

    await translatePairInto(file, sibling);
    anyUpdated = true;
  }

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `updated=${anyUpdated}\n`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
