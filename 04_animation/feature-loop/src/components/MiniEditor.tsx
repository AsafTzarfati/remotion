import React from 'react';
import {MONO_FONT} from '../fonts';
import {alpha, gradCss, MONO, useColors} from '../theme';

export const EDITOR = {titleBar: 40, padTop: 12, gutter: 40, padLeft: 14};

type Props = {
  tab: string;
  tabColor: string;
  x: number;
  y: number;
  w: number;
  h: number;
  open: number; // 0..1 entrance
  lines?: number; // line-number gutter
  dim?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

// Small editor window in the style of the slides.
export const MiniEditor: React.FC<Props> = ({tab, tabColor, x, y, w, h, open, lines = 0, dim = 0, style, children}) => {
  const c = useColors();
  if (open <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        opacity: open * (1 - 0.55 * dim),
        transform: `translateY(${(1 - open) * 24}px) scale(${0.95 + 0.05 * open})`,
        background: c.panel,
        border: `1px solid ${c.border}`,
        borderRadius: 14,
        boxShadow: `0 24px 60px rgba(0,0,0,0.55), 0 0 30px ${alpha(tabColor, 0.12)}`,
        overflow: 'hidden',
        direction: 'ltr',
        ...style,
      }}
    >
      <div style={{height: 3, background: gradCss(c)}} />
      <div
        style={{
          height: EDITOR.titleBar - 3,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 14,
          padding: '0 14px',
          background: c.titleBar,
          borderBottom: `1px solid ${c.border}`,
        }}
      >
        <div style={{display: 'flex', gap: 7, alignSelf: 'center'}}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((d) => (
            <div key={d} style={{width: 11, height: 11, borderRadius: 6, background: d, opacity: 0.85}} />
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            height: 31,
            padding: '0 14px',
            background: c.panel,
            borderRadius: '8px 8px 0 0',
            borderTop: `2px solid ${tabColor}`,
            fontFamily: MONO_FONT,
            fontSize: 17,
            color: c.text,
          }}
        >
          <div style={{width: 8, height: 8, borderRadius: 4, background: tabColor}} />
          {tab}
        </div>
      </div>
      <div style={{position: 'relative', display: 'flex', paddingTop: EDITOR.padTop}}>
        <div
          style={{
            width: EDITOR.gutter,
            flexShrink: 0,
            textAlign: 'right',
            paddingRight: 10,
            boxSizing: 'border-box',
            fontFamily: MONO_FONT,
            fontSize: 16,
            color: alpha(c.muted, 0.5),
          }}
        >
          {Array.from({length: lines}, (_, i) => (
            <div key={i} style={{height: MONO.lineHeight, lineHeight: `${MONO.lineHeight}px`}}>
              {i + 1}
            </div>
          ))}
        </div>
        <div style={{position: 'relative', paddingLeft: EDITOR.padLeft, paddingRight: 14, flex: 1, minWidth: 0}}>{children}</div>
      </div>
    </div>
  );
};
