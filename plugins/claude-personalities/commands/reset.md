---
description: Reset personality to default Claude (remove tone, statusline quips, and spinner verbs)
disable-model-invocation: true
---

# Personality Reset

Remove the active character personality and restore Claude's default behavior. This undoes the three changes made by the swap command.

## Instructions

1. **Confirm with the user** using `AskUserQuestion`: "Reset personality to default Claude? This will remove the custom tone, statusline quips, and spinner verbs." Options: "Yes, reset" and "Cancel". Use header "Reset".

2. **If the user confirms**, proceed with the following three changes:

3. **Remove tone section from CLAUDE.md**: Read `~/.claude/CLAUDE.md`. Use the Edit tool to remove the `## Tone & Personality` section entirely — from the `## Tone & Personality` heading through all its content, up to but not including the next `#` heading that is NOT a subsection of `## Tone & Personality`. Remove any trailing blank lines left behind so there's no gap at the top of the file.

4. **Remove statusline config from settings.json**: Read `~/.claude/settings.json`. Use the Edit tool to remove the `"statusLine"` key and its value object entirely from the JSON. Preserve all other keys. Make sure the resulting JSON is valid (handle trailing commas).

5. **Remove spinner verbs from settings.json**: In the same `~/.claude/settings.json` file, use the Edit tool to remove the `"spinnerVerbs"` key and its value object entirely. Preserve all other keys. Make sure the resulting JSON is valid.

6. **Remove the statusline script**: Delete the file `~/.claude/statusline-command.sh` using `trash` (never `rm`).

7. **Confirm the reset** with a neutral, default-Claude message like: "Personality reset complete. I'm back to default Claude — no character voice, standard statusline, default spinner verbs. Use `/swap` to pick a new personality anytime."
