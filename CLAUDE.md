# Animation videos repo: rules for Claude

The user speaks Hebrew. Reply in Hebrew, short and simple. Code, comments and commit messages in English.

This repo holds several animated explainer videos built with **Remotion (React)**. Each video is its own Remotion project. Rules here apply to all of them. Each video folder also has its own `CLAUDE.md` with that video's context; read it before working on that video.

## Videos
| Video | Folder | Script | Status |
|---|---|---|---|
| מדרישה לקוד (`TraceChain`) | `04_animation/trace-chain/` | `01_script/trace-chain-brief.md` | Done, rendered with and without sound |
| Vibe vs SDD (`VibeVsSdd`) | `04_animation/vibe-vs-sdd/` | `01_script/vibe-vs-sdd-brief.md` | In progress: script partial, code not started |
| לולאת הפיצ'רים (`FeatureLoop`) | `04_animation/feature-loop/` | `01_script/feature-loop-brief.md` | Done, rendered (silent loop); event name/date and logo are placeholders |

Update this table whenever a video is added or its status changes.

## Folder layout
- `01_script/<video>-brief.md`: the script for each video
- `02_storyboard/`: sketches · `03_assets/`: characters, backgrounds, props, audio · `references/`: inspiration
- `04_animation/<video>/`: one Remotion project per video, in kebab-case
- `05_editing/`: edit projects · `06_final_renders/`: final mp4s (git-ignored, keep them out of git)

## Starting a new video
1. Save the script as `01_script/<video>-brief.md`. If parts are missing, ask before building them; do not invent content.
2. Create `04_animation/<video>/` by copying the setup from `trace-chain`: `package.json` (same pinned versions), `tsconfig.json`, `remotion.config.ts`, `public/fonts`, `src/fonts.ts`, `src/font-ranges.json`, `scripts/make-sfx.mjs`. Reuse components when they fit (TypeWriter, EditorWindow, Terminal, TagPulse, highlight).
3. Add `04_animation/<video>/CLAUDE.md` and a row in the table above.

## Code conventions (all videos)
- One Composition per video. All texts, code, colors and timings go in props (`src/props.ts` with a zod schema), or in a `timeline` array, so the content can change without touching the animation.
- Frames: compute everything from `useCurrentFrame()`, with nothing random or time-based outside `random(seed)` from Remotion. Renders must be deterministic.
- Motion: `spring({damping: 200})` for entrances and camera moves; linear `interpolate` for typing (spring typing looks wrong).
- Hebrew: explicit `direction: 'rtl'`. Code, terminal and chat `ltr`. Wrap Latin and number runs inside Hebrew text in `<bdi dir="ltr">`, otherwise "1 kHz" shows as "kHz 1".
- Fonts: Rubik (Hebrew/UI) and JetBrains Mono (code), served locally from `public/fonts` and loaded with `@remotion/fonts`. Do not use `@remotion/google-fonts`; local fonts keep renders offline and reproducible.
- Shared palette (unless a script says otherwise): background `#0E1117`, panel `#161B22`, border `#30363D`, text `#E6EDF3`, muted `#8B949E`; SRS blue `#79C0FF`, FR purple `#A371F7`, tasks pink `#DB61A2`, tests orange `#F78166`, commit/ambiguity yellow `#E3B341`, success green `#3FB950`.
- Sound is optional and controlled by a `sound` prop. Generate effects in code (`scripts/make-sfx.mjs`); do not download audio.
- Deliver two renders when sound exists: `render:sound` and `render:silent` (`--props='{"sound":false}' --muted`).

## Quality settings
`remotion.config.ts`: PNG frames, H.264, CRF 14, `yuv420p`, `bt709`. Use `CameraMotionBlur` only while the camera moves, so text stays sharp otherwise.

## Dependency safety (the user asked for this; always follow it)
Before installing or upgrading any package:
1. Pin an **exact** version published **at least 2 weeks ago** (`npm view <pkg> time`).
2. Check the publisher and repository are the official ones (`npm view <pkg> maintainers repository.url`).
3. Install with `npm ci --ignore-scripts` / `npm i --ignore-scripts --save-exact`.
4. Run `npm audit` and `npm audit signatures`; report the results.
Current pins: remotion and @remotion/* 4.0.534, react/react-dom 19.3.0, zod 4.5.4, typescript 7.0.2, @types/react 19.3.0.

## Checking work
Type-check with `npx tsc -p .`, then render stills of key frames (`npx remotion still src/index.ts <Comp> out/stills/fNNNN.png --frame=NNNN`) and look at them before a full render. Check Hebrew direction, overflow and alignment.

## Commands (inside a video folder)
```bash
npm ci --ignore-scripts
npm run studio          # preview and edit props
npm run render:sound    # out/<video>-sound.mp4
npm run render:silent   # out/<video>-silent.mp4
```
