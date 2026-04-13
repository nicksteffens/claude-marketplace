---
description: Update the claude-personalities plugin to the latest version
disable-model-invocation: true
---

# Update Plugin

Fetch the latest version of the claude-personalities plugin.

## Instructions

1. **Snapshot current personalities**: Find the list-personalities script by globbing for `**/claude-personalities/scripts/list-personalities.js` starting from `~/.claude/plugins/`. Use the most recent version (highest version number in the path). Run `node <path>/scripts/list-personalities.js` and save the list of personality names for comparison later.

2. **Migrate custom personalities**: Before updating, check the plugin's `personalities/` directory for user-added files that would be lost. From the plugin root (parent of `scripts/`), run:

```bash
git -C <plugin-root> ls-files --others --exclude-standard personalities/*.md
```

If any untracked `.md` files are found, these are custom personalities the user added directly to the plugin directory. Migrate them:
- Run `mkdir -p ~/.claude/personalities/`
- Copy each untracked file to `~/.claude/personalities/`
- Tell the user: "Migrated {n} custom personality file(s) to `~/.claude/personalities/` — they'll persist across future updates."

If no untracked files are found, skip silently.

3. **Refresh the marketplace index**: Execute the following command:

```bash
claude plugin marketplace update
```

4. **Update the installed plugin**: Execute the following command:

```bash
claude plugin update claude-personalities@claude-personalities
```

5. **List new personalities**: Find the list-personalities script again (glob fresh — the path will have a new version number after update). Run it and compare against the snapshot from step 1. When comparing, filter both lists to `source === "official"` only — custom personalities are unaffected by plugin updates and should not appear in the diff. Display results as a table:

```
### Available Personalities

| Character | Tag | Universe | Description |
|-----------|-----|----------|-------------|
| **{name}** | `{tag}` | {universe} | {description} |
```

If there are new personalities not in the original snapshot, highlight them with a "NEW" marker. If no new personalities, say "You're up to date — no new personalities added."

6. **Remind to reload**: Tell the user to run `/reload-plugins` or restart Claude Code to pick up the changes, then try `/claude-personalities:browse` to explore.
