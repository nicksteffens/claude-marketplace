# host-html

Preview a chunk of raw HTML on a throwaway local HTTP server. Every run gives you **both** a browser link and a scannable **QR code**, so you can open the same page on your phone (same Wi-Fi) — handy for checking responsive email markup and HTML snippets on a real device.

> **macOS only.** Uses `pbpaste`, `ipconfig`, `open`, and Homebrew (`brew install qrencode`). Requires Python 3.

## Install

```
/plugin marketplace add nicksteffens/claude-marketplace
/plugin install host-html@nicksteffens
```

Then run `/reload-plugins` (or restart Claude Code).

## Usage

Invoke `/host-html` and either:
- paste HTML right after it, or
- copy HTML to your clipboard and run `/host-html` with no argument.

You get a `http://127.0.0.1:8347/` link for your browser and a QR of your machine's LAN URL for your phone. Say "kill it" when done and the server is torn down.

## License

MIT
