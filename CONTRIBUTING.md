# Writing a spellbook

1. Copy `TEMPLATE.json` to `books/<app-id>.json`. The id is lowercase with dashes, e.g. `affinity-designer`.
2. Fill it in (see below).
3. Run `node tools/check.mjs --write` (Node 18+, nothing to install).
4. Open a pull request. A maintainer tries it and, if it's good, marks it reviewed.

## The parts

**`app`.** How Blip knows you're in this app.
- `exe` is the program name without `.exe`. Find it in Task Manager → Details.
- For a web app, list the browsers in `exe` and put a word from the tab title in `title`, e.g. `["chrome", "msedge"]` + `["flypp"]`.

**`recipes`.** The heart of it. One job each.
- `asks`: 3–8 ways a real person would ask, in their words, not the app's. People say "round the edges", not "bevel".
- `steps`: up to 8. Each one has:
  - `do`: a short instruction, said like a mate would.
  - `click`: the button's **exact on-screen text**, so Blip can find it and point. For menus, use a path like `File > Export > PNG`. Leave `click` out for icon-only buttons, and describe where the icon is in `do` instead.
  - `keys`: a shortcut, like `Ctrl+B`.
- `say`: an optional one-liner before the steps.
- `checked`: set to `true` only if you actually followed the steps in the app.

**`landmarks`.** Big things and where they live ("Outliner: top right").

**`glossary`.** The app's jargon in plain words.

**`tips`.** Short and genuinely useful. Blip drops these on the island while watching you work.

## House style

- Short. Blip says it out loud.
- British or American spelling, just be consistent.
- Your own words. Don't paste from official docs.
- Note the app version you tested in `tested_with`. Menus move between versions.

## Reviews

Reviewed status is pinned to the file's exact sha256. Change a book and it's unreviewed again until a maintainer re-checks it, so a reviewed badge always means *this exact text* was looked at by a person.
