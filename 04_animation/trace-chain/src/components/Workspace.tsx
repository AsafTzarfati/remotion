import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {MONO_FONT} from '../fonts';
import {getTimeline, Timeline} from '../timeline';
import {alpha, CODE, useColors, useProps} from '../theme';
import {TraceChainProps} from '../props';
import {EDITOR, editorCharPos, EditorWindow} from './EditorWindow';
import {Highlighter, makeHighlighter, Token} from './highlight';
import {SrsCard} from './SrsCard';
import {TypeWriter} from './TypeWriter';

export const PAN_STEP = 1040;
export const EDITOR_Y = 290;
export const SPEC_X = 80;
export const PLAN_X = SPEC_X - PAN_STEP;
export const TASKS_X = SPEC_X - 2 * PAN_STEP;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const camera = (f: number, tl: Timeline, fps: number) =>
  PAN_STEP * spring({frame: f - tl.pan1, fps, config: {damping: 200}, durationInFrames: 30}) +
  PAN_STEP * spring({frame: f - tl.pan2, fps, config: {damping: 200}, durationInFrames: 30});

export const cardPose = (f: number, tl: Timeline, fps: number) => {
  const enter = spring({frame: f - tl.s1, fps, config: {damping: 200}, durationInFrames: 20});
  const shrink = spring({frame: f - tl.cardShrink, fps, config: {damping: 200}, durationInFrames: 30});
  return {
    cx: interpolate(shrink, [0, 1], [960, 1500]),
    cy: 540,
    scale: (0.9 + 0.1 * enter) * interpolate(shrink, [0, 1], [1, 0.55]),
    opacity: spring({frame: f - tl.s1 - 6, fps, config: {damping: 200}, durationInFrames: 16}),
  };
};

export const cardState = (f: number, tl: Timeline, p: TraceChainProps) => ({
  words: (f - tl.wordsStart) / tl.framesPerWord,
  underline: p.srs.highlights.map((_, i) =>
    interpolate(f, [p.timing.underlineFrame + i * 6, p.timing.underlineFrame + i * 6 + 14], [0, 1], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }),
  ),
  blink: interpolate(f, [tl.s1 + 16, tl.s1 + 22, tl.s1 + 34], [0, 1, 0], clamp),
  rev: spring({frame: f - tl.strike - 4, fps: 30, config: {damping: 200}, durationInFrames: 15}),
  flash: interpolate(f, [tl.ccb + 6, tl.ccb + 12, tl.ccb + 40], [0, 1, 0], clamp),
});

// "Resolved:" in green, the rest with the normal code colors.
const withPrefix = (base: Highlighter, prefix: string, color: string): Highlighter => (line, i) => {
  if (!line.startsWith(prefix)) return base(line, i);
  return [{text: prefix, style: {color, fontWeight: 700}}, ...base(line.slice(prefix.length), i)];
};

const SpecContent: React.FC<{f: number; tl: Timeline}> = ({f, tl}) => {
  const p = useProps();
  const c = p.colors;
  const hl = makeHighlighter(p);
  const top = 6 * CODE.lineHeight;
  const strike = interpolate(f, [tl.strike, tl.strike + 8], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const clarifyGone = interpolate(f, [tl.strike + 10, tl.strike + 16], [1, 0], clamp);
  const prefix = p.spec.resolved.split(' ')[0];
  return (
    <>
      <TypeWriter text={p.spec.code} startFrame={tl.specStart} charsPerFrame={tl.cps} frame={f} highlight={hl} />
      <div style={{position: 'absolute', top, left: EDITOR.padLeft, opacity: clarifyGone}}>
        {f >= tl.clarifyStart ? (
          <div
            style={{
              position: 'absolute',
              left: -12,
              top: 0,
              width: p.spec.clarify.length * CODE.charWidth + 24,
              height: CODE.lineHeight,
              borderRadius: 8,
              background: alpha(c.commit, 0.1),
            }}
          />
        ) : null}
        <TypeWriter
          text={p.spec.clarify}
          startFrame={tl.clarifyStart}
          charsPerFrame={tl.cps}
          frame={f}
          color={c.commit}
          highlight={hl}
          cursor={f < tl.strike}
        />
        <div
          style={{
            position: 'absolute',
            left: -4,
            top: CODE.lineHeight / 2 - 2,
            height: 4,
            borderRadius: 2,
            width: (p.spec.clarify.length * CODE.charWidth + 8) * strike,
            background: c.commit,
          }}
        />
      </div>
      <div style={{position: 'absolute', top, left: EDITOR.padLeft}}>
        <TypeWriter
          text={p.spec.resolved}
          startFrame={tl.resolvedStart}
          charsPerFrame={tl.resolvedCps}
          frame={f}
          highlight={withPrefix(hl, prefix, c.ok)}
        />
      </div>
    </>
  );
};

const PlanContent: React.FC<{f: number; tl: Timeline}> = ({f, tl}) => {
  const p = useProps();
  const c = p.colors;
  const {fps} = useVideoConfig();
  const s = spring({frame: f - tl.banner, fps, config: {damping: 200}, durationInFrames: 18});
  return (
    <>
      <TypeWriter text={p.plan.code} startFrame={tl.planStart} charsPerFrame={tl.cps} frame={f} highlight={makeHighlighter(p)} />
      {f >= tl.banner ? (
        <div
          style={{
            position: 'absolute',
            top: 5 * CODE.lineHeight - 4,
            left: EDITOR.padLeft - 12,
            width: EDITOR.width - EDITOR.gutter - 2 * EDITOR.padLeft,
            height: 64,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 26,
            padding: '0 22px',
            borderRadius: 12,
            background: alpha(c.ok, 0.14),
            border: `2px solid ${c.ok}`,
            boxShadow: `0 0 30px ${alpha(c.ok, 0.35 * s)}`,
            fontFamily: MONO_FONT,
            fontSize: 26,
            fontWeight: 700,
            color: c.ok,
            opacity: s,
            transform: `translateY(${(1 - s) * 24}px)`,
          }}
        >
          <span>{p.plan.bannerLabel}</span>
          <span style={{display: 'flex', gap: 22, color: c.text}}>
            {p.plan.bannerItems.map((item, i) => {
              const on = spring({frame: f - tl.banner - 12 - i * 8, fps, config: {damping: 12}, durationInFrames: 20});
              return (
                <span key={item} style={{display: 'flex', alignItems: 'center', gap: 8}}>
                  <span
                    style={{
                      display: 'inline-block',
                      color: c.ok,
                      opacity: Math.min(1, on),
                      transform: `scale(${on})`,
                    }}
                  >
                    ✓
                  </span>
                  {item}
                </span>
              );
            })}
          </span>
        </div>
      ) : null}
    </>
  );
};

const TasksContent: React.FC<{f: number; tl: Timeline}> = ({f, tl}) => {
  const p = useProps();
  const c = p.colors;
  const {fps} = useVideoConfig();
  const base = makeHighlighter(p);
  const lines = p.tasks.code.split('\n');
  const focus = lines.findIndex((l) => l.includes(p.tasks.focusTaskId));
  const hl: Highlighter = (line, i) =>
    base(line, i).map((t): Token => {
      if (t.text !== '[ ]') return t;
      const pop = spring({frame: f - tl.check(i), fps, config: {damping: 10}, durationInFrames: 16});
      if (f < tl.check(i)) return t;
      return {
        text: '[x]',
        style: {display: 'inline-block', color: c.ok, fontWeight: 700, transform: `scale(${0.6 + 0.4 * pop})`},
      };
    });
  let offset = 0;
  const focusTyped = lines.slice(0, focus + 1).reduce((a, l) => a + l.length + 1, 0);
  offset = tl.tasksStart + focusTyped / tl.cps;
  const glow = interpolate(f, [offset, offset + 10], [0, 1], clamp);
  return (
    <TypeWriter
      text={p.tasks.code}
      startFrame={tl.tasksStart}
      charsPerFrame={tl.cps}
      frame={f}
      highlight={hl}
      lineStyle={(i) =>
        i === focus
          ? {
              marginLeft: -12,
              paddingLeft: 12,
              marginRight: 12,
              borderRadius: 8,
              background: alpha(c.tasks, 0.18 * glow),
              boxShadow: `inset 4px 0 0 ${alpha(c.tasks, glow)}, 0 0 ${24 * glow}px ${alpha(c.tasks, 0.25 * glow)}`,
            }
          : undefined
      }
    />
  );
};

// The card and the three editors laid out side by side; the camera pans across them.
export const Workspace: React.FC<{sceneStart: number}> = ({sceneStart}) => {
  const f = useCurrentFrame() + sceneStart;
  const p = useProps();
  const c = useColors();
  const {fps} = useVideoConfig();
  const tl = getTimeline(p);
  if (f >= tl.zoom + 24) return null;
  const cam = camera(f, tl, fps);
  const pose = cardPose(f, tl, fps);
  const state = cardState(f, tl, p);
  const fadeAll = interpolate(f, [tl.zoom, tl.zoom + 20], [1, 0], clamp);
  const specDim = interpolate(f, [tl.pan1 + 12, tl.pan1 + 30], [0, 1], clamp);
  const planDim = interpolate(f, [tl.pan2 + 6, tl.pan2 + 24], [0, 1], clamp);
  const tasksDim = interpolate(f, [tl.termIn, tl.termIn + 20], [0, 1], clamp);
  const ccb = spring({frame: f - tl.ccb, fps, config: {damping: 11}, durationInFrames: 20});
  const ccbPos = editorCharPos(6, 0);
  const lineCount = (text: string, extra = 0) => text.split('\n').length + extra;

  return (
    <AbsoluteFill style={{opacity: fadeAll}}>
      {f >= tl.s1 ? (
        <div
          style={{
            position: 'absolute',
            left: pose.cx + cam,
            top: pose.cy,
            opacity: pose.opacity,
            transform: `translate(-50%, -50%) scale(${pose.scale})`,
          }}
        >
          <SrsCard {...state} revLabel={p.srs.revLabel} />
        </div>
      ) : null}
      <EditorWindow
        tab={p.spec.tab}
        tabColor={c.fr}
        frame={f}
        openFrame={tl.specOpen}
        lineCount={lineCount(p.spec.code, 2)}
        dim={specDim}
        x={SPEC_X + cam}
        y={EDITOR_Y}
      >
        <SpecContent f={f} tl={tl} />
      </EditorWindow>
      {f >= tl.ccb ? (
        <div
          style={{
            position: 'absolute',
            left: SPEC_X + EDITOR.width + 14 + cam,
            top: EDITOR_Y + ccbPos.y + 4,
            height: CODE.lineHeight - 8,
            display: 'flex',
            alignItems: 'center',
            padding: '0 10px',
            borderRadius: 8,
            fontFamily: MONO_FONT,
            fontSize: 20,
            fontWeight: 700,
            color: c.bg,
            background: c.commit,
            boxShadow: `0 0 24px ${alpha(c.commit, 0.6)}`,
            direction: 'ltr',
            opacity: Math.min(1, ccb) * (1 - specDim),
            transform: `scale(${ccb})`,
            transformOrigin: 'left center',
          }}
        >
          {p.spec.ccbLabel}
        </div>
      ) : null}
      <EditorWindow
        tab={p.plan.tab}
        tabColor={c.ok}
        frame={f}
        openFrame={tl.planOpen}
        lineCount={lineCount(p.plan.code, 3)}
        dim={planDim}
        x={PLAN_X + cam}
        y={EDITOR_Y}
      >
        <PlanContent f={f} tl={tl} />
      </EditorWindow>
      <EditorWindow
        tab={p.tasks.tab}
        tabColor={c.tasks}
        frame={f}
        openFrame={tl.tasksOpen}
        lineCount={lineCount(p.tasks.code, 2)}
        dim={tasksDim}
        x={TASKS_X + cam}
        y={EDITOR_Y}
      >
        <TasksContent f={f} tl={tl} />
      </EditorWindow>
    </AbsoluteFill>
  );
};
