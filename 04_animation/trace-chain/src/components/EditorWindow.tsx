import React from 'react';
import {spring, useVideoConfig} from 'remotion';
import {MONO_FONT} from '../fonts';
import {alpha, CODE, useColors} from '../theme';

export const EDITOR = {
  width: 1000,
  height: 520,
  titleBar: 52,
  padTop: 24,
  gutter: 64,
  padLeft: 24,
  border: 1,
};

// Where character `col` of line `line` sits, relative to the window's top-left.
export const editorCharPos = (line: number, col: number) => ({
  x: EDITOR.border + EDITOR.gutter + EDITOR.padLeft + col * CODE.charWidth,
  y: EDITOR.border + EDITOR.titleBar + EDITOR.padTop + line * CODE.lineHeight,
});

type Props = {
  tab: string;
  tabColor: string;
  frame: number;
  openFrame: number;
  lineCount: number;
  dim?: number; // 0 = normal, 1 = fully dimmed
  x: number;
  y: number;
  children: React.ReactNode;
};

export const EditorWindow: React.FC<Props> = ({tab, tabColor, frame, openFrame, lineCount, dim = 0, x, y, children}) => {
  const c = useColors();
  const {fps} = useVideoConfig();
  if (frame < openFrame) return null;
  const s = spring({frame: frame - openFrame, fps, config: {damping: 200}, durationInFrames: 20});
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: EDITOR.width,
        height: EDITOR.height,
        opacity: s * (1 - 0.68 * dim),
        transform: `translateY(${(1 - s) * 30}px) scale(${0.96 + 0.04 * s})`,
        filter: dim > 0.01 ? `saturate(${1 - 0.5 * dim})` : undefined,
        background: c.panel,
        border: `${EDITOR.border}px solid ${c.border}`,
        borderRadius: 18,
        boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px ${alpha(tabColor, 0.08)}`,
        overflow: 'hidden',
        direction: 'ltr',
      }}
    >
      <div
        style={{
          height: EDITOR.titleBar,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 18,
          padding: '0 20px',
          background: '#0D1117',
          borderBottom: `1px solid ${c.border}`,
        }}
      >
        <div style={{display: 'flex', gap: 9, alignSelf: 'center'}}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((d) => (
            <div key={d} style={{width: 13, height: 13, borderRadius: 7, background: d, opacity: 0.85}} />
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            height: 40,
            padding: '0 18px',
            background: c.panel,
            borderRadius: '10px 10px 0 0',
            borderTop: `2px solid ${tabColor}`,
            fontFamily: MONO_FONT,
            fontSize: 20,
            color: c.text,
          }}
        >
          <div style={{width: 9, height: 9, borderRadius: 5, background: tabColor}} />
          {tab}
        </div>
      </div>
      <div style={{position: 'relative', display: 'flex', paddingTop: EDITOR.padTop}}>
        <div
          style={{
            width: EDITOR.gutter,
            textAlign: 'right',
            paddingRight: 18,
            boxSizing: 'border-box',
            fontFamily: MONO_FONT,
            fontSize: 20,
            color: alpha(c.muted, 0.55),
          }}
        >
          {Array.from({length: lineCount}, (_, i) => (
            <div key={i} style={{height: CODE.lineHeight, lineHeight: `${CODE.lineHeight}px`}}>
              {i + 1}
            </div>
          ))}
        </div>
        <div style={{position: 'relative', paddingLeft: EDITOR.padLeft, flex: 1}}>{children}</div>
      </div>
    </div>
  );
};
