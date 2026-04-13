# Claude Personalities

Community-created character personalities for Claude Code. Swap Claude's tone, statusline quips, and spinner verbs with a single command.

## Install

Inside any Claude Code session, run these two commands (one-time setup):

**Step 1 — Add the marketplace** (tells Claude Code where to find the plugin):
```
/plugin marketplace add nicksteffens/claude-marketplace
```

**Step 2 — Install the plugin** (format: `plugin-name@marketplace-name`):
```
/plugin install claude-personalities@nicksteffens
```

**Step 3 — Activate** by running `/reload-plugins` (or restart Claude Code).

That's it. The plugin loads automatically on every future `claude` session — no flags needed.

To get updates after new personalities are added:

```
/claude-personalities:update
```

> **Note:** The `/update` command was added in **v1.8.0**. If you're on an older version, you'll need to update manually first:
> 1. Run `/plugin` and select "update marketplace"
> 2. Run `/reload-plugins`
> 3. Restart Claude Code to pick up the new command
>
> After that one-time manual update, `/claude-personalities:update` will work for all future updates.

### Local development

If you're working on the plugin itself, clone the repo and load it directly:

```bash
git clone https://github.com/nicksteffens/claude-marketplace
claude --plugin-dir ./claude-marketplace/plugins/claude-personalities
```

## Usage

### Switch Personality

```
/claude-personalities:swap
```

Pick a character. Claude's tone, statusline, and spinner verbs update immediately.

### Browse Personalities

```
/claude-personalities:browse
/claude-personalities:browse grumpy
/claude-personalities:browse star-wars
```

List all available personalities or filter by category.

### Reset to Default

```
/claude-personalities:reset
```

Remove the active personality and restore Claude's default behavior. Strips the tone section, statusline quips, and spinner verbs.

### Update Plugin

```
/claude-personalities:update
```

Pull the latest version and see what new personalities were added.

### Create a New Personality

```
/claude-personalities:create
```

Guided wizard that walks you through building a properly formatted personality file.

## Reducing Permission Prompts

The `/swap` and `/reset` commands edit files in `~/.claude/`, so Claude will ask for permission on each one. To auto-approve these, copy the example settings file into your project:

```bash
mkdir -p .claude && cp ~/.claude/plugins/cache/nicksteffens/claude-personalities/*/examples/settings.local.json .claude/settings.local.json
```

This grants edit access only to the files the swap and reset commands touch — nothing else.

## What Gets Changed

| Component | File | Effect |
|-----------|------|--------|
| Tone & voice | `~/.claude/CLAUDE.md` | `## Tone & Personality` section replaced |
| Status bar | `~/.claude/statusline-command.sh` | Tag, quips, and mood thresholds rewritten |
| Spinner verbs | `~/.claude/settings.json` | `spinnerVerbs` key updated |

## Available Personalities

See the full **[Personality Index](PERSONALITIES.md)** for all characters, grouped by universe with author credits. This index is auto-generated whenever personalities are added or updated.

## Contributing

We welcome personality contributions from any universe — Star Wars droids, Portal AIs, Hitchhiker's Guide characters, Marvel heroes, original creations, whatever you've got.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full template, category list, and PR checklist.

The fastest way to create a new personality is the built-in wizard:

```
/claude-personalities:create
```

It walks you through every field and generates a properly formatted file.

## Categories

Personalities are tagged with categories for browsing and filtering.

**Universe:** `star-wars` `star-trek` `portal` `hitchhikers-guide` `lord-of-rings` `marvel` `doctor-who` `custom`

**Temperament:** `grumpy` `cheerful` `nervous` `deadpan` `aggressive` `stoic` `chaotic` `sarcastic`

**Communication:** `beeps-warbles` `formal-speech` `probability-based` `prefix-labels` `broken-speech` `poetic` `technical`

**Formality:** `casual` `professional` `academic` `military`

## Testing the Statusline

```bash
echo '{"model":{"display_name":"Claude Opus 4.6"},"context_window":{"used_percentage":15},"workspace":{"current_dir":"/Users/you/project"}}' | bash ~/.claude/statusline-command.sh
```

Output: `[TAG] Claude Opus 4.6 | project | quip here`

## License

MIT
