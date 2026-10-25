import React from 'react';
import {Img, staticFile} from 'remotion';
import {HEBREW_FONT} from '../fonts';
import {alpha, gradCss, LAYOUT, useColors, useProps} from '../theme';
import {Bidi} from './Bidi';

// Top bar: title on the right, event and date on the left.
export const TopBar: React.FC = () => {
  const c = useColors();
  const p = useProps();
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: LAYOUT.topBar,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 56px',
        boxSizing: 'border-box',
        borderBottom: `1px solid ${alpha(c.border, 0.7)}`,
        background: alpha(c.panel, 0.55),
      }}
    >
      <div style={{fontFamily: HEBREW_FONT, fontSize: 26, color: c.muted, direction: 'rtl', fontWeight: 500}}>
        <Bidi text={`${p.eventName} · ${p.eventDate}`} />
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
      <div
        style={{
          fontFamily: HEBREW_FONT,
          fontSize: 32,
          fontWeight: 700,
          backgroundImage: gradCss(c),
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          direction: 'ltr',
        }}
      >
        {p.topRight}
      </div>
      {p.logoFile ? <Img src={staticFile(p.logoFile)} style={{width: 52, height: 52}} /> : null}
      </div>
      <div
        style={{position: 'absolute', left: 0, bottom: -1, width: '100%', height: 2, background: gradCss(c), opacity: 0.55}}
      />
    </div>
  );
};
