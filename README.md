# Fretwise 🎸

**Fretwise** is a free, browser-based guitar learning space. It is designed to make chord shapes and the progressions that connect them easy to explore — whether you're picking up a guitar for the first time or looking for your next practice idea.

## What's inside

- **96 chords** — major, minor, dominant 7, major 7, minor 7, suspended 2, suspended 4, and diminished across all twelve root notes.
- **Visual fretboard diagrams** — clear string labels, open and muted strings, fret positions, highlighted root notes, and finger numbers on selected beginner chord shapes.
- **Search and filters** — jump to a chord by name, root note, or chord type.
- **Hear a chord** — synthesized strums played directly in the browser.
- **Eight classic chord progressions** — pop, rock, doo-wop, folk, minor-key color, jazz ii–V–I, 12-bar blues, and the Canon progression.
- **Transpose into any major key** — chord names, diagrams, and playback update together.
- **Practice mode** — adjustable tempo (50–180 BPM), four beats per chord, optional metronome, and highlighted changes as you play along.
- **Responsive and accessible** — suitable for phones, tablets, and desktops; keyboard-friendly controls; reduced-motion support.

Fretwise uses standard **E–A–D–G–B–e** tuning. Sounds are generated with the Web Audio API; there are no prerecorded audio samples or external sound files. Diagram shapes use playable open positions where available and movable shapes for other chords.

## Publishing

This is a static website with no build step or backend. GitHub Pages, any static web host, or a local browser can serve the app. On GitHub, select **Settings → Pages → Deploy from a branch → main → /(root)** to publish it. The site will be available on your repository's Pages address once GitHub has published it.

## Files

- `index.html` — page structure and accessible controls
- `styles.css` — responsive appearance
- `app.js` — chord data, diagrams, transposition, and practice playback
- `favicon.svg` — app icon

## Notes

- Audio begins only after you interact with the page, as required by browser autoplay rules.
- Progressions are presented relative to a selected **major** key; the minor pop loop begins on its relative minor chord.
- A synthesized strum is a pitch reference, not a realistic sampled guitar recording.

Made for the simple joy of playing guitar.
