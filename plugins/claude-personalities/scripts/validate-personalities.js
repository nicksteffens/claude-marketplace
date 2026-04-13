#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

// ── Parsing ──────────────────────────────────────────────────────────────────

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

function parseSections(body) {
  const sections = {};
  const sectionRegex = /^## (.+)$/gm;
  const matches = [...body.matchAll(sectionRegex)];

  for (let i = 0; i < matches.length; i++) {
    const name = matches[i][1].trim();
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : body.length;
    const content = body.slice(start, end).trim();

    // Parse subsections (### headings) within this section
    const subRegex = /^### (.+)$/gm;
    const subMatches = [...content.matchAll(subRegex)];
    let subsections = null;

    if (subMatches.length > 0) {
      subsections = {};
      for (let j = 0; j < subMatches.length; j++) {
        const subName = subMatches[j][1].trim();
        const subStart = subMatches[j].index + subMatches[j][0].length;
        const subEnd =
          j + 1 < subMatches.length ? subMatches[j + 1].index : content.length;
        subsections[subName] = content.slice(subStart, subEnd).trim();
      }
    }

    sections[name] = { content, subsections };
  }

  return sections;
}

// ── Validation ───────────────────────────────────────────────────────────────

function validateFrontmatter(fields, schemaFrontmatter, errors) {
  for (const [key, rules] of Object.entries(schemaFrontmatter)) {
    const value = fields[key];

    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`Missing required frontmatter field: "${key}"`);
      continue;
    }

    if (value === undefined) continue;

    if (rules.type === 'array') {
      if (!Array.isArray(value)) {
        errors.push(`"${key}" must be an array`);
        continue;
      }
      if (rules.minItems && value.length < rules.minItems) {
        errors.push(`"${key}" must have at least ${rules.minItems} item(s) (found ${value.length})`);
      }
    }

    if (rules.type === 'string' && typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`"${key}" must be at least ${rules.minLength} characters (got ${value.length}: "${value}")`);
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`"${key}" must be at most ${rules.maxLength} characters (got ${value.length}: "${value}")`);
      }
    }
  }
}

function validateSections(parsed, schemaSections, errors) {
  for (const [name, rules] of Object.entries(schemaSections)) {
    const section = parsed[name];

    if (rules.required && !section) {
      errors.push(`Missing required section: "## ${name}"`);
      continue;
    }

    if (!section) continue;

    if (rules.contentRequired && !section.content) {
      errors.push(`"## ${name}" section is empty`);
    }

    if (rules.subsections) {
      for (const [subName, subRules] of Object.entries(rules.subsections)) {
        const subContent = section.subsections?.[subName];

        if (subRules.required && !subContent) {
          errors.push(`"## ${name}" missing required subsection: "### ${subName}"`);
          continue;
        }

        if (subRules.contentRequired && subContent !== undefined && !subContent) {
          errors.push(`"### ${subName}" subsection is empty`);
        }
      }
    }
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

function validateFile(filePath, schema) {
  const errors = [];

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    return { errors: [`Could not read file: ${err.message}`], tag: null };
  }

  const fields = parseFrontmatter(content);
  if (!fields) {
    errors.push('Missing or malformed frontmatter (must be between --- delimiters)');
    return { errors, tag: null };
  }
  validateFrontmatter(fields, schema.frontmatter, errors);

  const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---\s*/, '');
  const sections = parseSections(body);
  validateSections(sections, schema.sections, errors);

  return { errors, tag: fields.tag || null };
}

function checkDuplicateTags(dir) {
  if (!fs.existsSync(dir)) return [];

  const tagMap = new Map(); // tag -> [filenames]
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), 'utf-8');
    const fields = parseFrontmatter(content);
    if (!fields || !fields.tag) continue;

    const tag = fields.tag.toUpperCase();
    if (!tagMap.has(tag)) {
      tagMap.set(tag, []);
    }
    tagMap.get(tag).push(file);
  }

  const errors = [];
  for (const [tag, files] of tagMap) {
    if (files.length > 1) {
      errors.push(`Duplicate tag "${tag}" found in: ${files.join(', ')}`);
    }
  }
  return errors;
}

function main() {
  const schemaPath = path.join(__dirname, '..', 'personality-schema.json');
  let schema;
  try {
    schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
  } catch (err) {
    console.error(`Could not load schema: ${err.message}`);
    process.exit(1);
  }

  let files = process.argv.slice(2);

  if (files.length === 0) {
    const dir = path.join(process.cwd(), 'personalities');
    if (!fs.existsSync(dir)) {
      console.error('No personalities/ directory found and no files specified.');
      process.exit(1);
    }
    files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => path.join(dir, f));
  }

  if (files.length === 0) {
    console.log('No personality files to validate.');
    process.exit(0);
  }

  let hasErrors = false;

  for (const file of files) {
    const relPath = path.relative(process.cwd(), file);
    const { errors } = validateFile(file, schema);

    if (errors.length === 0) {
      console.log(`✓ ${relPath}`);
      continue;
    }

    hasErrors = true;
    console.error(`\n✗ ${relPath}`);
    for (const err of errors) {
      console.error(`  ERROR: ${err}`);
    }
  }

  // Check for duplicate tags across all personality files
  const personalitiesDir = path.join(process.cwd(), 'personalities');
  const dupeErrors = checkDuplicateTags(personalitiesDir);
  if (dupeErrors.length > 0) {
    hasErrors = true;
    console.error('\n✗ Duplicate tags');
    for (const err of dupeErrors) {
      console.error(`  ERROR: ${err}`);
    }
  }

  if (hasErrors) {
    console.error('\nValidation failed.');
    process.exit(1);
  }

  console.log('\nAll files valid.');
  process.exit(0);
}

main();
