#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const raw = match[1];
  const fields = {};
  let currentKey = null;
  let inArray = false;

  for (const line of raw.split('\n')) {
    const arrayItem = line.match(/^\s+-\s+(.+)/);
    if (inArray && arrayItem) {
      fields[currentKey].push(arrayItem[1].trim());
      continue;
    }

    const kvMatch = line.match(/^([a-zA-Z_-]+):\s*(.*)/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const value = kvMatch[2].trim();
      if (value === '') {
        fields[currentKey] = [];
        inArray = true;
      } else {
        fields[currentKey] = value;
        inArray = false;
      }
    }
  }

  return fields;
}

function parseSection(content, sectionName) {
  const regex = new RegExp(`^## ${sectionName}\\s*$`, 'm');
  const match = content.match(regex);
  if (!match) return null;

  const start = match.index + match[0].length;
  const nextSection = content.slice(start).match(/^## /m);
  const end = nextSection ? start + nextSection.index : content.length;

  return content.slice(start, end).trim();
}

function parseListItems(text) {
  return text
    .split('\n')
    .filter(l => l.match(/^\s*-\s+/))
    .map(l => l.replace(/^\s*-\s+/, '').trim());
}

function parseQuips(content) {
  const quipsSection = parseSection(content, 'Quips');
  if (!quipsSection) return {};

  const moods = {};
  const moodRegex = /^### (\w+)\s*$/gm;
  const matches = [...quipsSection.matchAll(moodRegex)];

  for (let i = 0; i < matches.length; i++) {
    const name = matches[i][1];
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : quipsSection.length;
    const block = quipsSection.slice(start, end).trim();
    moods[name] = parseListItems(block).map(q => q.replace(/^["']|["']$/g, ''));
  }

  return moods;
}

// ── Main ─────────────────────────────────────────────────────────────────────

const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: node scripts/preview-personality.js <personality-file>');
  console.error('  e.g. node scripts/preview-personality.js personalities/marvin.md');
  process.exit(1);
}

const resolved = path.resolve(filePath);
let content;
try {
  content = fs.readFileSync(resolved, 'utf8');
} catch (err) {
  console.error(`Could not read file: ${err.message}`);
  process.exit(1);
}

const fields = parseFrontmatter(content);
if (!fields || !fields.name) {
  console.error('Missing or malformed frontmatter.');
  process.exit(1);
}

const name = fields.name;
const tag = fields.tag || '???';
const description = fields.description || '';

// Header
console.log(`\n=== ${name} ===`);
console.log(`${description}\n`);

// Tone
const toneSection = parseSection(content, 'Tone');
if (toneSection) {
  console.log('Tone:');
  for (const bullet of parseListItems(toneSection)) {
    console.log(`  - ${bullet}`);
  }
  console.log();
}

// Spinner Verbs
const verbsSection = parseSection(content, 'Spinner Verbs');
if (verbsSection) {
  const verbs = parseListItems(verbsSection);
  console.log(`Spinner verbs: ${verbs.join(', ')}`);
  console.log();
}

// Statusline samples
const moods = parseQuips(content);
const sampleContexts = { fresh: 12, annoyed: 35, grumpy: 65, angry: 88 };

console.log('Statusline samples:');
for (const [mood, ctx] of Object.entries(sampleContexts)) {
  const quips = moods[mood];
  if (!quips || quips.length === 0) continue;
  const quip = quips[0].replace(/\$\{CONTEXT\}/g, String(ctx));
  console.log(`  ${mood.padEnd(8)} [${tag}] claude-opus-4-6 | my-project | "${quip}"`);
}
console.log();
