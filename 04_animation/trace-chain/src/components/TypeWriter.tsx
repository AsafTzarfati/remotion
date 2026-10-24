import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {MONO_FONT} from '../fonts';
import {CODE, useColors} from '../theme';
import {Highlighter} from './highlight';
import {pulseAmount, TagGlow} from './TagPulse';

type Props = {
  text: string;
  startFrame: number;
  charsPerFrame: number;
  frame?: number; // defaults to useCurrentFrame()
  highlight?: Highlighter;
  color?: string;
  cursor?: boolean;
  lineStyle?: (lineIndex: number) => React.CSSProperties | undefined;
};

export const typingDuration = (text: string, charsPerFrame: number) => Math.ceil(text.length / charsPerFrame);

// Types text at a constant rate (linear, no spring).
export const TypeWriter: React.FC<Props> = ({
  text,
  startFrame,
  charsPerFrame,
  frame,
  highlight,
  color,
  cursor = true,
  lineStyle,
}) => {
  const current = useCurrentFrame();
  const f = frame ?? current;
  const c = useColors();
  const total = text.length;
  const end = startFrame + total / charsPerFrame;
  const visible = Math.floor(
    interpolate(f, [startFrame, end], [0, total], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
  );
  const typing = f >= startFrame && f < end + 20;
  const blinkOn = f < end || Math.floor((f - end) / 8) % 2 === 0;

  let offset = 0;
  const lines = text.split('\n');
  let cursorPlaced = false;

  return (
    <div style={{fontFamily: MONO_FONT, fontSize: CODE.fontSize, color: color ?? c.text, direction: 'ltr'}}>
      {lines.map((line, li) => {
        const lineStart = offset;
        offset += line.length + 1;
        const inLine = Math.max(0, Math.min(line.length, visible - lineStart));
        const tokens = highlight ? highlight(line, li) : [{text: line}];
        let pos = 0;
        const showCursor =
          cursor && typing && !cursorPlaced && visible >= lineStart && (visible <= lineStart + line.length || li === lines.length - 1);
        if (showCursor) cursorPlaced = true;
        return (
          <div
            key={li}
            style={{height: CODE.lineHeight, lineHeight: `${CODE.lineHeight}px`, whiteSpace: 'pre', ...lineStyle?.(li)}}
          >
            {tokens.map((t, ti) => {
              const tokStart = pos;
              pos += t.text.length;
              const shown = t.text.slice(0, Math.max(0, inLine - tokStart));
              if (!shown) return null;
              if (t.tag && shown.length === t.text.length) {
                const completeAt = startFrame + (lineStart + tokStart + t.text.length) / charsPerFrame;
                return <TagGlow key={ti} text={shown} amount={pulseAmount(f, completeAt)} />;
              }
              return (
                <span key={ti} style={t.tag ? {color: c.srs, fontWeight: 700} : t.style}>
                  {shown}
                </span>
              );
            })}
            {showCursor ? (
              <span
                style={{
                  display: 'inline-block',
                  width: CODE.charWidth,
                  height: CODE.fontSize * 1.15,
                  verticalAlign: 'middle',
                  background: c.text,
                  opacity: blinkOn ? 0.85 : 0,
                  marginLeft: 1,
                }}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
