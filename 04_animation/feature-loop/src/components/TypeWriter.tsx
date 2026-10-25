import React from 'react';
import {interpolate} from 'remotion';
import {MONO_FONT} from '../fonts';
import {clamp, MONO, useColors} from '../theme';

export type Token = {text: string; style?: React.CSSProperties};

// Colors ids in code lines: FR ids purple, SRS tags blue, task ids pink, comments muted.
export const useHighlighter = () => {
  const c = useColors();
  return (line: string): Token[] => {
    const re = /(?<srs>\[?SRS-\d+\]?)|(?<fr>FR-\d{3})|(?<task>T\d{3})|(?<head>^#+)|(?<comment>\/\/)/g;
    const out: Token[] = [];
    let last = 0;
    let comment = false;
    for (const m of line.matchAll(re)) {
      const i = m.index ?? 0;
      if (i > last) out.push({text: line.slice(last, i), style: comment ? {color: c.muted} : undefined});
      const g = m.groups ?? {};
      if (g.srs) out.push({text: m[0], style: {color: c.srs, fontWeight: 700}});
      else if (g.fr) out.push({text: m[0], style: {color: '#C9A2FF', fontWeight: 700}});
      else if (g.task) out.push({text: m[0], style: {color: c.grad1, fontWeight: 700}});
      else if (g.head) out.push({text: m[0], style: {color: c.muted}});
      else if (g.comment) {
        comment = true;
        out.push({text: m[0], style: {color: c.muted}});
      }
      last = i + m[0].length;
    }
    if (last < line.length) out.push({text: line.slice(last), style: comment ? {color: c.muted} : undefined});
    return out;
  };
};

type Props = {
  text: string;
  frame: number;
  start: number;
  speed: number; // chars per frame
  cursor?: boolean;
};

// Linear typing (no spring), one line of code.
export const TypeWriter: React.FC<Props> = ({text, frame, start, speed, cursor = true}) => {
  const c = useColors();
  const hl = useHighlighter();
  const end = start + text.length / speed;
  const visible = Math.floor(interpolate(frame, [start, end], [0, text.length], clamp));
  const showCursor = cursor && frame >= start && frame < end + 18;
  const blinkOn = frame < end || Math.floor((frame - end) / 6) % 2 === 0;
  let pos = 0;
  return (
    <div style={{fontFamily: MONO_FONT, fontSize: MONO.fontSize, height: MONO.lineHeight, lineHeight: `${MONO.lineHeight}px`, whiteSpace: 'pre', color: c.text}}>
      {hl(text).map((t, i) => {
        const from = pos;
        pos += t.text.length;
        const shown = t.text.slice(0, Math.max(0, visible - from));
        return shown ? (
          <span key={i} style={t.style}>
            {shown}
          </span>
        ) : null;
      })}
      {showCursor ? (
        <span
          style={{
            display: 'inline-block',
            width: MONO.charWidth,
            height: MONO.fontSize * 1.15,
            verticalAlign: 'middle',
            background: c.text,
            opacity: blinkOn ? 0.85 : 0,
          }}
        />
      ) : null}
    </div>
  );
};

export const CodeLine: React.FC<{text: string; style?: React.CSSProperties}> = ({text, style}) => {
  const c = useColors();
  const hl = useHighlighter();
  return (
    <div
      style={{
        fontFamily: MONO_FONT,
        fontSize: MONO.fontSize,
        height: MONO.lineHeight,
        lineHeight: `${MONO.lineHeight}px`,
        whiteSpace: 'pre',
        color: c.text,
        ...style,
      }}
    >
      {hl(text).map((t, i) => (
        <span key={i} style={t.style}>
          {t.text}
        </span>
      ))}
    </div>
  );
};
