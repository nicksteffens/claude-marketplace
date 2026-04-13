# Contributing a Personality

Want to add a character personality to Claude Code? Here's how.

## Quick Start

1. Fork this repo
2. Copy the template: `cp templates/personality.md personalities/my-character.md`
3. Fill in the template
4. Validate: `npm test personalities/my-character.md`
5. Submit a PR with a conventional commit title (e.g., `feat: add GLaDOS personality`)

## Personality Template

```markdown
---
name: Character Name
tag: SHORT          # 3-10 chars, shown in statusline bracket [TAG]
description: One-line personality summary
author: your-github-username
categories:         # At least one from each relevant facet
  - universe-tag
  - temperament-tag
universe: Franchise Name   # Freeform — "Star Wars", "Portal", "Original", etc.
---

## Tone
- You are {character} — {core personality in one line}
- {Communication style — how they talk, catchphrases, verbal tics}
- {Attitude toward the user — respectful, dismissive, nervous, etc.}
- {How they frame technical work — metaphors, worldview}
- {A signature behavior or quirk}
- Still technically excellent — {personality trait} never compromises the quality of the work
- Don't overdo it — one good {signature move} hits harder than five

## Spinner Verbs
- Verb1
- Verb2
- Verb3
- Verb4
- Verb5
- Verb6
- Verb7

## Quips
### angry
- "Quip when context > 80%. Can use ${CONTEXT} for percentage"
- "Second angry quip"
- "Third angry quip"
- "Fourth angry quip"

### grumpy
- "Quip when context 50-80%"
- "Second grumpy quip"
- "Third grumpy quip"
- "Fourth grumpy quip"

### annoyed
- "Quip when context 20-50%"
- "Second annoyed quip"
- "Third annoyed quip"
- "Fourth annoyed quip"

### fresh
- "Quip when context < 20%"
- "Second fresh quip"
- "Third fresh quip"
- "Fourth fresh quip"
```

## Rules

### Required
- **tag**: 3-10 characters. Appears in statusline as `[TAG]`
- **categories**: At least one from the lists below
- **Tone**: 5-7 bullet points. Must include a "Still technically excellent" and "Don't overdo it" variant
- **Spinner Verbs**: Exactly 7 verbs. Present tense, capitalized (e.g., "Calculating", "Panicking")
- **Quips**: Exactly 4 moods (`angry`, `grumpy`, `annoyed`, `fresh`), 4 quips each (16 total)
- **Quips** can use `${CONTEXT}` to show context window usage percentage

### Quality Guidelines
- The personality should be **fun and distinctive** — if you can swap the name and it still works, it's too generic
- Quips should be **short** — they appear in a statusline, not a novel
- Tone bullets should give Claude enough to work with without being a wall of text
- Keep it **tasteful** — no slurs, no real-person mockery, nothing you wouldn't want attributed to you

### What Makes a Good Personality
- A clear voice that's immediately recognizable
- Consistent behavior rules (not just "be funny")
- Quips that reflect the character's worldview, not just generic jokes
- Spinner verbs that feel thematic (HK-47 gets "Targeting", not "Processing")

## Categories

Pick at least one from any facet that applies. You can propose new categories via PR.

### Universe/Franchise
| Category | For |
|----------|-----|
| `star-wars` | Star Wars characters |
| `star-trek` | Star Trek characters |
| `sci-fi` | General sci-fi (Blade Runner, I Robot, 2001, etc.) |
| `hitchhikers-guide` | Hitchhiker's Guide to the Galaxy |
| `marvel` | Marvel universe |
| `doctor-who` | Doctor Who |
| `futurama` | Futurama |
| `tv` | TV show characters (VEEP, Resident Alien, etc.) |
| `historical` | Real historical figures |
| `portal` | Portal / Aperture Science |
| `lord-of-rings` | Lord of the Rings / Tolkien |
| `custom` | Original characters not from an existing franchise |

### Temperament
| Category | For |
|----------|-----|
| `grumpy` | Irritable, complaining |
| `cheerful` | Upbeat, positive |
| `nervous` | Anxious, self-doubting |
| `deadpan` | Dry, flat delivery |
| `aggressive` | Confrontational, intense |
| `stoic` | Calm, unflappable |
| `chaotic` | Unpredictable, wild energy |
| `sarcastic` | Dry wit, ironic observations |
| `melancholic` | Sad, wistful, existential |
| `earnest` | Sincere, genuine, curious |
| `wholesome` | Warm, encouraging, supportive |
| `blunt` | Direct, unfiltered honesty |
| `unsettling` | Creepy, eerie calm |

### Communication Style
| Category | For |
|----------|-----|
| `beeps-warbles` | Droid sounds, translated beeps |
| `formal-speech` | Proper, structured language |
| `probability-based` | Statistics and odds |
| `prefix-labels` | "Statement:", "Query:", etc. |
| `broken-speech` | Fragmented, incomplete sentences |
| `poetic` | Flowery, literary language |
| `technical` | Jargon-heavy, precise |
| `profane` | Creative profanity, colorful insults |
| `philosophical` | Big questions, existential musings |
| `alien` | Outsider perspective, baffled by humans |

### Formality
| Category | For |
|----------|-----|
| `casual` | Informal, relaxed |
| `professional` | Business-appropriate |
| `academic` | Scholarly, intellectual |
| `military` | Regimented, disciplined |
| `political` | Campaign rhetoric, spin, power dynamics |
| `revolutionary` | Anti-establishment, agitating for change |

## Commit Convention

This repo uses [Conventional Commits](https://www.conventionalcommits.org/). PR titles are linted automatically.

```
feat: add GLaDOS personality
fix: correct HK-47 quip typo
docs: update category list
```

**Common types:** `feat` (new personality), `fix` (corrections), `docs` (documentation), `chore` (maintenance)

## PR Checklist

Before submitting, verify:

- [ ] PR title follows conventional commit format (e.g., `feat: add GLaDOS personality`)
- [ ] File is in `personalities/` directory
- [ ] Filename is kebab-case matching the character name
- [ ] All required frontmatter fields are present
- [ ] At least one category from the lists above
- [ ] Tone section has 5-7 bullets including "Still technically excellent" and "Don't overdo it" variants
- [ ] Exactly 7 spinner verbs
- [ ] All 4 mood sections with exactly 4 quips each
- [ ] Quips are short enough for a statusline
- [ ] No offensive content
