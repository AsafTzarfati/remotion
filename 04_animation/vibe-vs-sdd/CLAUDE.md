# VibeVsSdd (in progress)

Script: `../../01_script/vibe-vs-sdd-brief.md`. Read the root `CLAUDE.md` first for shared rules (safety, fonts, Hebrew, quality).

## The idea
A split screen comparing two ways to work with an AI agent on the same firmware task (sample an IMU at 1 kHz, publish within 2 ms, the same SRS-042 example as TraceChain):
- **Right lane: Vibe coding.** Chat prompts, quick fixes, regressions. Attempt counter climbs (#2 → #14), progress bar jumps and falls back, chat scrolls and old context disappears, orange header starts blinking. Ends stuck at 55%, "works… probably".
- **Left lane: SDD (Spec Kit).** Calm and steady through `/speckit.clarify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.implement`. Tests pass, bar reaches 100%, big green check plus the trace `SRS-042 → FR-001/002 → T011–T013 → commit a1b2c3d`.
- At frame 700 both bars meet at the same height; after that the trend flips.
- Finale: a shared clock stops at 00:50, the divider dissolves, the left lane fills the screen. Text: "הבעיה אף פעם לא הייתה מהירות ההקלדה." then "Spec-Driven Development" in purple. Fade to black at 1770, cutting to the slide "שתי דרכים לעבוד עם סוכן AI".

## Status
- [x] Scenes 2–5 written (frames 420–1800)
- [ ] **Scenes 0–1 (frames 0–420) missing: ask the user**
- [ ] General spec missing (resolution, fps, palette, lane titles, header text): ask. Assumed: 60 s, 1920×1080, 30 fps, 1800 frames, shared palette from root CLAUDE.md.
- [ ] Remotion project not created yet (this folder only has this file)

## Required structure (from the script)
- One Composition `VibeVsSdd`, two components `<VibeLane>` and `<SddLane>`, both receive the same `frame`.
- Every event lives in a `timeline` array: `{frame, side: 'vibe' | 'sdd', type, content}`. Tuning the pace means editing only this array.
- Progress bars: keyframes via `interpolate` over a list of points. Vibe uses `Easing.out(Easing.back)` (overshoots and settles back); SDD uses a soft, monotonic `spring`.
- Typing speed carries meaning: Vibe about 4 chars/frame, SDD about 2.
- Components: `ChatBubble`, `TypeWriter`, `StageRail` (stage rail), `ProgressBar`, `AttemptCounter` (small spring on each increment), `RateGraph` (SVG, noise from `random(seed)` so renders are deterministic).
- Hebrew titles `rtl`; code, chat and terminal `ltr`.
- Also deliver both a sound and a silent version (as with TraceChain).

## Suggested next steps
1. Get scenes 0–1 and the general spec from the user; add them to the script file.
2. Scaffold the project here by copying the setup from `../trace-chain` (see root CLAUDE.md, "Starting a new video").
3. Build `timeline` plus lanes, check stills at frames such as 450, 600, 700, 900, 1100, 1300, 1550, 1700, then render both versions.
