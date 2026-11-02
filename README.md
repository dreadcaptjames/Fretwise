# Fretwise 🎸

Fretwise is a free, responsive guitar-learning web app. It runs entirely in a browser and can be hosted on GitHub Pages without a server or build step.

## Features

- Searchable library of 96 chords across 12 roots and multiple chord qualities.
- Interactive fretboard diagrams showing strings, fret positions and playable voicings.
- Eight common chord progressions with key transposition and practice mode.
- Power-chord lessons covering root and fifth, optional octave, muting, palm muting and downstroke technique.
- Power-chord explorer with low E / A string shapes and two- or three-note variants.
- Six punk-inspired progression loops including classic I–IV–V, pop-punk, skate-punk, garage, descending hardcore-style and melodic punk.
- Punk practice player with 80–220 BPM, quarter/eighth-note patterns, metronome and highlighted chord changes.
- In-browser Web Audio playback; no audio files or server processing required.
- Responsive layouts for phones, iPads, laptops and desktops.
- Custom Fretwise app icon for iPad/iPhone Add to Home Screen, browser favicons and a web app manifest.

## Publish to GitHub Pages

1. Extract this ZIP.
2. Upload **all** files and the `icons` folder to the root of your `dreadcaptjames/Fretwise` GitHub repository. Replace matching existing files.
3. Make sure GitHub Pages is set to publish from `main` / `/ (root)` under **Settings → Pages**.
4. Open https://dreadcaptjames.github.io/Fretwise/

For iPad or iPhone, open the site in Safari and use **Share → Add to Home Screen**. If the old shortcut still shows the old icon, remove the shortcut and add it again.

## Important files

- `index.html`: site structure and Home Screen metadata.
- `styles.css`: responsive styling.
- `app.js`: chord data and interactive practice tools.
- `site.webmanifest`: web app metadata and icon paths.
- `apple-touch-icon.png` and other Apple sizes: Apple Home Screen icons.
- `icons/icon-192.png` and `icons/icon-512.png`: web app icons.
- `favicon.png`, `favicon.ico` and `favicon.svg`: browser icons and fallback.

Fretwise uses standard E–A–D–G–B–e tuning. Its synthesized audio is a practice reference rather than a sampled acoustic guitar.
