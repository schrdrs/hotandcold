# Hot & Cold — a bathhouse journal

A calm, minimal web app for rating bathhouses and the bathhouse experience.

## Features

- **10 categories**, each scored **0–10** with an interactive slider (or tap a number):
  booking experience, location, sauna, steam room, hot/warm pool, cold plunge,
  general setup & ambience, water/tea/snacks, change rooms & shower, price.
- **Per-category weighting** (×0 – ×3 in 0.5 steps), with a live “share of score” %.
  Set your default weights once in *Settings*; tweak them per bathhouse when needed.
- **Not offered** toggle — e.g. no steam room — excludes a category so it isn’t penalised.
- **Bonus & minus points** — add your own (−5 to +5 in 0.5 steps) or pick a suggestion
  (Aufguss ritual, outdoor area, crowded, noisy…).
- **Live total score** with an animated ring, and a tier from *Chilly* to *Transcendent*.
- Detail view with a full breakdown, a sortable list (score / recent / A–Z), notes,
  JSON export/import, light & dark mode, offline support, installable to the home screen.

## How the score is calculated

```
weighted base = Σ(score × weight) ÷ Σ(weight)   — scored, offered categories only
final score   = clamp(weighted base + Σ bonus/minus points, 0, 10)
```

## Running it

No build step and no dependencies — it’s plain HTML, CSS and JavaScript.

```sh
python3 -m http.server 8000   # or any static file server
# open http://localhost:8000
```

It can be hosted as-is on GitHub Pages, Netlify, etc. Ratings are stored in the
browser’s `localStorage` on the device; use *Settings → Export* to back them up or
move them to another device.
