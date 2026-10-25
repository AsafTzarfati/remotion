# FeatureLoop: "לולאת הפיצ'רים" (done)

60 s seamless loop · 1920×1080 · 30 fps · 1800 frames · no sound. Script: `../../01_script/feature-loop-brief.md`. Read the root `CLAUDE.md` first.

## The idea
A calm "machine": three features, 20 s each, go from an SRS card through the Spec Kit loop (specify → clarify → plan → tasks → analyze → implement) to a commit and a folder in the repo tree. Same structure every cycle; only the content changes.

## Current version: ring only
The user found the full layout too busy. Default props now have `ringOnly: true`: only `LoopRing` (logo, feature id, stage name, stations, dot) centered and scaled by `ringScale` (1.55), on the background. No SRS stack, windows, repo, top bar or ticker. Set `ringOnly: false` to get the full layout from the script back.

## Map
- `src/props.ts`: all content, colors and timing (zod). `features[]` drives everything; adding a feature adds a 600-frame cycle (`calculateMetadata` in `Root.tsx`).
- `src/cycle.ts`: `useCycle()` gives `k = floor(frame/600) % n`, `local = frame % 600` and the stage starts.
- `src/theme.tsx`: screen layout (`LAYOUT`), gradient helpers.
- Components: `SrsStack` (right queue, card flies to the ring as a tag), `LoopRing` (SVG ring, stations, gradient dot with `Easing.inOut(Easing.cubic)`, center logo/id/stage), `StageWindows` (spec/plan/tasks/code windows, analyze scan, fold, flying file), `MiniEditor`, `TypeWriter` (2 chars/frame), `RepoTree`, `PrincipleTicker`, `Bars` (top bar), `Background`, `Bidi`.

## Seamless loop
Everything is a function of `k` and `local`, so frame 1799 flows into frame 0: the repo always shows the two newest folders, the SRS queue rotates, the dot returns to the top (and back to pink), background motion is periodic over the whole video, and the ticker period is `duration / principles.length` (10 s with 3 features).

## Choices not in the script (all in props, easy to change)
- **Illustrative content I wrote:** `planLines`, `tasks`, `code` for each feature, commits `4e5f6a7` (002) and `9c8d7e2` (003), repo name `firmware`, static repo rows. Only `a1b2c3d` came from the script.
- spec.md shows `# <feature id>` above the typed `FR-001 [SRS-xxx]` line.
- implement opens a 4th window (`src/<name>.c`) in front of the other three; it folds with them at handoff.
- Spec Kit branding: the official logo (`public/speckit-logo.png`, cropped from `media/logo_large.webp` in github/spec-kit; hash in `public/SHA256SUMS-logo`) sits in the ring center, the top bar, the repo commit avatar and the flying file. Success green is the logo's sprout green `#A6E15A` instead of the shared `#3FB950`. Windows and the repo have a gradient strip on top, and a slow conic gradient glows behind the ring.
- Full layout only: top bar left side shows the placeholders `[שם האירוע] · [תאריך]` (`eventName`, `eventDate`).
- The `sound` prop and `make-sfx.mjs` were not copied: the script asks for no sound.

## Render
`npm run render` → `out/feature-loop.mp4` (muted).
