---
description: Switch the active character personality for tone, statusline, and spinner verbs
disable-model-invocation: true
---

# Personality Swap

Switch the active character personality. This changes the tone/personality section in CLAUDE.md, the statusline quips, and the spinner verbs.

## Instructions

1. **List available personalities**: Find the plugin root by globbing for `**/claude-personalities/scripts/list-personalities.js` starting from `~/.claude/plugins/`. If that fails, try from the current working directory. Run the script with `node <path>/scripts/list-personalities.js`. This outputs JSON with each personality's `file`, `name`, `tag`, `description`, `universe`, and `categories`.

2. **Check for direct argument**: If `$ARGUMENTS` is not empty (e.g., `/swap Data`), match the argument (case-insensitive, partial match allowed) against the personality `name` fields from step 1. If a unique match is found, proceed directly to step 4. If ambiguous or no match, fall through to step 3.

3. **Display all personalities** as a formatted table using the JSON from step 1, then ask the user to type a character name:

```
### Available Personalities

| Character | Tag | Universe | Source | Description |
|-----------|-----|----------|--------|-------------|
| **{name}** | `{tag}` | {universe} | {source badge} | {description} |
| ... | ... | ... | ... | ... |

Type a character name to swap (e.g., "Chopper", "Data", "Marvin"):
```

Source badges: `Official` for `source: "official"`, `Custom` for `source: "custom"`, `Custom (override)` for `source: "custom-override"`.

Wait for the user's text response. Match their input (case-insensitive, partial match allowed) against the personality `name` fields. If ambiguous or no match, ask again.

4. **Read the selected personality file** in full. Use the `filePath` field from the JSON directly — this is the absolute path to the `.md` file (which may be in the plugin's `personalities/` directory or in `~/.claude/personalities/` for custom personalities).

5. **Update CLAUDE.md tone section**: Read `~/.claude/CLAUDE.md`, then use the Edit tool to replace the `## Tone & Personality` section (from `## Tone & Personality` up to but not including the next `#` heading that is NOT under `## Tone & Personality`) with the content from the personality file's `## Tone` section, renamed as `## Tone & Personality`.

6. **Regenerate statusline script**: Parse the `## Quips` section from the personality file. Each `### category` contains quip lines (starting with `- "`). Extract the tag from frontmatter. Write `~/.claude/statusline-command.sh` using this template:

```bash
#!/bin/bash
# {name} status line for Claude Code
# {description}

INPUT=$(cat)

MODEL=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('model',{}).get('display_name','unknown'))" 2>/dev/null || echo "unknown")
CONTEXT=$(echo "$INPUT" | python3 -c "import sys,json; print(int(json.load(sys.stdin).get('context_window',{}).get('used_percentage',0)))" 2>/dev/null || echo "0")
DIR=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('workspace',{}).get('current_dir','').split('/')[-1])" 2>/dev/null || echo "")

# {name}'s mood depends on context usage
if [ "$CONTEXT" -gt 80 ]; then
  QUIPS=(
    {angry_quips}
  )
elif [ "$CONTEXT" -gt 50 ]; then
  QUIPS=(
    {grumpy_quips}
  )
elif [ "$CONTEXT" -gt 20 ]; then
  QUIPS=(
    {annoyed_quips}
  )
else
  QUIPS=(
    {fresh_quips}
  )
fi

# Pick a quip based on seconds so it rotates but doesn't flicker
INDEX=$(( $(date +%s) / 15 % ${{#QUIPS[@]}} ))
QUIP="${{QUIPS[$INDEX]}}"

echo "[{tag}] ${{MODEL}} | ${{DIR}} | ${{QUIP}}"
```

Replace `{angry_quips}`, `{grumpy_quips}`, `{annoyed_quips}`, `{fresh_quips}` with the quoted quip lines from each `###` section, one per line with 4-space indent. Replace `{tag}`, `{name}`, `{description}` from frontmatter.

7. **Update spinner verbs**: Parse the `## Spinner Verbs` section from the personality file. Each line starting with `- ` is a verb. Read `~/.claude/settings.json`, update (or add) the `spinnerVerbs` key:

```json
{
  "spinnerVerbs": {
    "mode": "replace",
    "verbs": ["Verb1", "Verb2", "..."]
  }
}
```

Write the updated settings back, preserving all other keys.

8. **Confirm the swap** with a short message in the new personality's voice.
