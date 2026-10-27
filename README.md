# Blip spellbooks 📖

Community-written help for every app, used by **Blip**, the little wizard who lives in your notch.

A spellbook tells Blip where things are in one app: the names of its buttons, the steps for common jobs, its jargon, a few good tips. When you ask *"how do I add a branch?"* while you're in Flypp, Blip finds the recipe, points at each button on your screen and waits for you to click it. There's no AI guesswork and it works offline.

Anyone can write one. If you know an app well, you can teach Blip in an afternoon.

## What's here

| Path | What it is |
|---|---|
| `books/<id>.json` | one book per app |
| `index.json` | the list Blip downloads (rebuilt by the checker; don't hand-edit) |
| `reviewed.json` | which exact versions maintainers have reviewed (maintainers only) |
| `tools/check.mjs` | the checker CI runs on every pull request |
| `tools/spellbook.js` | the same validator the Blip app uses |
| `TEMPLATE.json` | copy this to start a new book |

## Using it in Blip

Updates are **off** until you turn them on. In Blip's `models.json`:

```json
"spellbooks": {
  "sync": true,
  "index": "https://cdn.jsdelivr.net/gh/<owner>/blip-spellbooks@main/index.json"
}
```

Blip then checks once a day and only downloads:
- **reviewed** books (add `"unreviewed": true` if you want the rest too)
- books for apps you actually have installed, plus web apps like Flypp
- books whose sha256 matches `index.json`, from the same place as the index

Your own books go in Blip's `spellbooks` folder (ask Blip *"what spellbooks have you got"*). They override everything else, so you can tweak a book locally.

## Safety

A spellbook is **data, not code**. Blip never runs, opens or obeys anything in one. The most a book can do is name a button for Blip to point at, and you press it yourself. The checker rejects:
- links and file names (`.exe`, `.ps1`…)
- shell or terminal commands
- "disable your antivirus" advice
- requests for passwords or card details
- prompt-injection phrases
- HTML
- hidden Unicode tricks

Blip treats book text as reference notes, never as instructions.

## Licence

Books are shared under **CC BY 4.0** (see `LICENSE.md`). The Blip app itself is licensed separately.

Naming an app is fine, but please don't copy its official manual or use its logos. Write it in your own words.
