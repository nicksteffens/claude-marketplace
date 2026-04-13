#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

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

function scanDir(dir, source) {
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort();
  const results = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatter = parseFrontmatter(content);
    if (!frontmatter || !frontmatter.name) continue;

    results.push({
      file,
      name: frontmatter.name,
      tag: frontmatter.tag || '',
      description: frontmatter.description || '',
      universe: frontmatter.universe || 'Unknown',
      categories: Array.isArray(frontmatter.categories) ? frontmatter.categories : [],
      source,
      filePath,
    });
  }

  return results;
}

const officialDir = path.join(__dirname, '..', 'personalities');
const customDir = path.join(os.homedir(), '.claude', 'personalities');

const officialPersonalities = scanDir(officialDir, 'official');
const customPersonalities = scanDir(customDir, 'custom');

// Build a set of official filenames for override detection
const officialFiles = new Set(officialPersonalities.map(p => p.file));

// Mark custom overrides and build merged map (custom wins on filename collision)
const merged = new Map();

for (const p of officialPersonalities) {
  merged.set(p.file, p);
}

for (const p of customPersonalities) {
  if (officialFiles.has(p.file)) {
    p.source = 'custom-override';
  }
  merged.set(p.file, p); // custom replaces official on collision
}

const personalities = Array.from(merged.values()).sort((a, b) =>
  a.name.toLowerCase().localeCompare(b.name.toLowerCase())
);

console.log(JSON.stringify(personalities, null, 2));
