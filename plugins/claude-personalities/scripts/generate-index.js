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

const personalitiesDir = path.join(__dirname, '..', 'personalities');
const files = fs.readdirSync(personalitiesDir).filter(f => f.endsWith('.md')).sort();

const personalities = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(personalitiesDir, file), 'utf8');
  const frontmatter = parseFrontmatter(content);
  if (!frontmatter || !frontmatter.name) continue;

  personalities.push({
    file,
    name: frontmatter.name,
    tag: frontmatter.tag || '',
    description: frontmatter.description || '',
    universe: frontmatter.universe || 'Unknown',
    author: frontmatter.author || 'unknown',
    categories: Array.isArray(frontmatter.categories) ? frontmatter.categories : [],
  });
}

// Group by universe
const byUniverse = {};
for (const p of personalities) {
  if (!byUniverse[p.universe]) byUniverse[p.universe] = [];
  byUniverse[p.universe].push(p);
}

const universes = Object.keys(byUniverse).sort();

let md = `# Personality Index

> **${personalities.length} personalities** across ${universes.length} universes — auto-generated from \`personalities/\`

| Character | Tag | Universe | Description |
|-----------|-----|----------|-------------|
`;

for (const p of personalities) {
  md += `| **${p.name}** | \`${p.tag}\` | ${p.universe} | ${p.description} |\n`;
}

md += `\n## By Universe\n`;

for (const universe of universes) {
  const group = byUniverse[universe];
  md += `\n### ${universe}\n\n`;
  for (const p of group) {
    md += `- **${p.name}** (\`${p.tag}\`) — ${p.description} · *by ${p.author}*\n`;
  }
}

md += `\n---\n*Last updated: ${new Date().toISOString().split('T')[0]}*\n`;

const outPath = path.join(__dirname, '..', 'PERSONALITIES.md');
fs.writeFileSync(outPath, md);

console.log(`Generated PERSONALITIES.md with ${personalities.length} personalities`);
