# TraceChain: "מדרישה לקוד" (done)

40 s · 1920×1080 · 30 fps · 1200 frames. Script: `../../01_script/trace-chain-brief.md`.
Story: follow the tag `[SRS-042]` from requirement → spec.md → clarify → plan.md → tasks.md → test + commit → grep chain. Each time the tag is typed it gets a purple glow pulse.

## Map
- `src/props.ts`: all content, colors and timing (zod schema)
- `src/timeline.ts`: absolute frames derived from props, shared by visuals and sound
- `src/scenes/Scenes.tsx`: one `<Sequence>` per scene; `src/TraceChain.tsx` wires them
- `src/components/Workspace.tsx`: SRS card and three editors side by side; camera pans by `PAN_STEP` (1040 px)
- `src/components/FlyingChips.tsx`: measures the underlined phrases in the DOM (delayRender), then flies FR chips along a curved path into spec.md
- Others: TypeWriter (+ `highlight.tsx`), TagPulse, EditorWindow, Terminal, TerminalLayer, Chip, ChainPill, Chain, SrsCard, Header, Background, Sound

## Changes from the script
- "rev B" badge appears on the SRS card when the clarify is resolved.
- Plan pill is green (the script gave no color for it).
- Fonts are local instead of Google Fonts (see root CLAUDE.md).

## Renders
`out/trace-chain-sound.mp4` and `out/trace-chain-silent.mp4`. The user already has both locally.
