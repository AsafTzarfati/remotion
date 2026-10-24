import React from 'react';
import {MONO_FONT} from '../fonts';
import {useColors} from '../theme';

export const TERMINAL = {width: 1440, height: 720, titleBar: 48, pad: 32};

export const Terminal: React.FC<{title: string; style?: React.CSSProperties; children: React.ReactNode}> = ({
  title,
  style,
  children,
}) => {
  const c = useColors();
  return (
    <div
      style={{
        position: 'absolute',
        width: TERMINAL.width,
        height: TERMINAL.height,
        background: '#090C10',
        border: `1px solid ${c.border}`,
        borderRadius: 18,
        boxShadow: '0 40px 120px rgba(0,0,0,0.7)',
        overflow: 'hidden',
        direction: 'ltr',
        ...style,
      }}
    >
      <div
        style={{
          height: TERMINAL.titleBar,
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: 9,
          background: '#11151B',
          borderBottom: `1px solid ${c.border}`,
          position: 'relative',
        }}
      >
        {['#FF5F57', '#FEBC2E', '#28C840'].map((d) => (
          <div key={d} style={{width: 13, height: 13, borderRadius: 7, background: d, opacity: 0.85}} />
        ))}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: MONO_FONT,
            fontSize: 18,
            color: c.muted,
          }}
        >
          {title}
        </div>
      </div>
      <div style={{padding: TERMINAL.pad}}>{children}</div>
    </div>
  );
};
