import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {getTimeline} from '../timeline';
import {alpha, CODE, useColors, useProps} from '../theme';
import {Highlighter, makeHighlighter} from './highlight';
import {TagPulse} from './TagPulse';
import {Terminal, TERMINAL} from './Terminal';
import {TypeWriter} from './TypeWriter';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const TerminalLayer: React.FC<{sceneStart: number}> = ({sceneStart}) => {
  const f = useCurrentFrame() + sceneStart;
  const {fps} = useVideoConfig();
  const p = useProps();
  const c = useColors();
  const tl = getTimeline(p);
  const term = p.terminal;
  if (f < tl.termIn || f >= tl.zoom + 30) return null;

  const slide = spring({frame: f - tl.termIn, fps, config: {damping: 200}, durationInFrames: 26});
  const zoom = spring({frame: f - tl.zoom, fps, config: {damping: 200}, durationInFrames: 28});
  const hl = makeHighlighter(p, {hash: term.commitHash});

  // Test result line: name, dots filling up, then PASSED with a small bounce.
  const dotsTotal = 10;
  const dots = Math.floor(interpolate(f, [tl.testOut, tl.passed - 2], [0, dotsTotal], clamp));
  const bounce = spring({frame: f - tl.passed, fps, config: {damping: 9, stiffness: 180}, durationInFrames: 24});
  const passedGlow = interpolate(f, [tl.passed, tl.passed + 4, tl.passed + 30], [0, 1, 0.25], clamp);
  const hashMark = interpolate(f, [tl.hashMark, tl.hashMark + 8], [0, 1], clamp);

  const fileColor = (path: string) =>
    path.includes('spec') ? c.fr : path.includes('plan') ? c.ok : path.includes('tasks') ? c.tasks : c.commit;
  const grepHl: Highlighter = (line, i) => {
    const m = line.match(/^(\S+(?: log)?:)(\s+)(.*)$/);
    if (!m) return hl(line, i);
    return [{text: m[1], style: {color: fileColor(m[1])}}, {text: m[2]}, ...hl(m[3], i)];
  };
  const commitHl: Highlighter = (line, i) =>
    hl(line, i).map((t) =>
      t.text === term.commitHash
        ? {
            ...t,
            style: {
              ...t.style,
              display: 'inline-block',
              borderRadius: 6,
              background: alpha(c.commit, 0.28 * hashMark),
              boxShadow: `0 0 ${22 * hashMark}px ${alpha(c.commit, 0.6 * hashMark)}`,
            },
          }
        : t,
    );

  const row = (i: number, child: React.ReactNode) => (
    <div style={{position: 'absolute', top: i * CODE.lineHeight, left: 0, right: 0}}>{child}</div>
  );

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - zoom,
        transform: `translateY(${(1 - slide) * 900 - 120 * zoom}px) scale(${1 - 0.65 * zoom})`,
      }}
    >
      <Terminal title={term.title} style={{left: (1920 - TERMINAL.width) / 2, top: 260}}>
        <div style={{position: 'relative'}}>
          {row(0, <TypeWriter text={term.testCommand} startFrame={tl.testCmd} charsPerFrame={tl.cps} frame={f} highlight={hl} cursor={f < tl.testOut} />)}
          {f >= tl.testOut
            ? row(
                1,
                <div style={{fontFamily: 'inherit', whiteSpace: 'pre', lineHeight: `${CODE.lineHeight}px`}}>
                  <TypeWriter
                    text={`${term.testName} ${term.testRef} ${'.'.repeat(dots)}`}
                    startFrame={tl.testOut}
                    charsPerFrame={999}
                    frame={f}
                    highlight={hl}
                    cursor={false}
                  />
                  {f >= tl.passed ? (
                    <span
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: (term.testName.length + term.testRef.length + 3 + dotsTotal) * CODE.charWidth,
                        fontFamily: 'inherit',
                      }}
                    >
                      <TypeWriter
                        text="PASSED"
                        startFrame={tl.passed}
                        charsPerFrame={999}
                        frame={f}
                        cursor={false}
                        highlight={() => [
                          {
                            text: 'PASSED',
                            style: {
                              display: 'inline-block',
                              color: c.test,
                              fontWeight: 700,
                              transform: `scale(${0.5 + 0.5 * bounce})`,
                              textShadow: `0 0 ${20 * passedGlow}px ${c.test}`,
                            },
                          },
                        ]}
                      />
                    </span>
                  ) : null}
                </div>,
              )
            : null}
          {f >= tl.stats ? row(2, <TypeWriter text={term.testStats} startFrame={tl.stats} charsPerFrame={999} frame={f} color={c.muted} cursor={false} />) : null}
          {row(3, <TypeWriter text={term.commitCommand} startFrame={tl.commitCmd} charsPerFrame={tl.commitCps} frame={f} highlight={hl} cursor={f < tl.commitOut} />)}
          {f >= tl.commitOut ? row(4, <TypeWriter text={term.commitOutput} startFrame={tl.commitOut} charsPerFrame={999} frame={f} highlight={commitHl} cursor={false} />) : null}
          {row(6, <TypeWriter text={term.grepCommand} startFrame={tl.grepCmd} charsPerFrame={tl.cps} frame={f} highlight={hl} cursor={f < tl.grepOut} />)}
          {term.grepResults.map((r, i) => {
            const at = tl.grepOut + i * tl.grepInterval;
            if (f < at) return null;
            const s = spring({frame: f - at, fps, config: {damping: 200}, durationInFrames: 10});
            return row(
              7 + i,
              <div style={{opacity: s, transform: `translateY(${(1 - s) * -10}px)`}}>
                <TypeWriter text={r} startFrame={at} charsPerFrame={10} frame={f} highlight={grepHl} cursor={false} />
              </div>,
            );
          })}
        </div>
      </Terminal>
    </AbsoluteFill>
  );
};

export {TagPulse};
