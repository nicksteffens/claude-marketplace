# Claude Marketplace

Claude Code plugins by Nick Steffens.

## Install

Inside any Claude Code session:

**Step 1 — Add the marketplace:**
```
/plugin marketplace add nicksteffens/claude-marketplace
```

**Step 2 — Install a plugin** (format: `plugin-name@marketplace-name`):
```
/plugin install claude-personalities@nicksteffens
```

**Step 3 — Activate** by running `/reload-plugins` (or restart Claude Code).

## Available Plugins

| Plugin | Description | Install |
|--------|-------------|---------|
| **[claude-personalities](plugins/claude-personalities/)** | Community character personalities — swap tone, statusline, and spinner verbs | `/plugin install claude-personalities@nicksteffens` |

## Contributing

Each plugin has its own `CONTRIBUTING.md` with guidelines. See the plugin's directory for details.

## License

MIT
