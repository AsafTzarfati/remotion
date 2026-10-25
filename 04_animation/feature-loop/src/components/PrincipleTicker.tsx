import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {HEBREW_FONT} from '../fonts';
import {alpha, LAYOUT, ramp, useColors, useProps} from '../theme';
import {Bidi} from './Bidi';

// One principle at a time. The period is the video length divided by the
// number of principles (10 s with 3 features and 6 principles), so the ticker
// returns to the first principle exactly at the loop point.
export const PrincipleTicker: React.FC = () => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const c = useColors();
  const p = useProps();
  const n = p.principles.length;
  const period = durationInFrames / n;
  const idx = Math.floor(f / period) % n;
  const m = f - Math.floor(f / period) * period;
  const fade = p.timing.principleFade;
  const o = ramp(m, 0, fade) * (1 - ramp(m, period - fade, period));
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: LAYOUT.bottomBar,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop: `1px solid ${alpha(c.border, 0.7)}`,
        background: alpha(c.panel, 0.55),
      }}
    >
      <div
        style={{
          fontFamily: HEBREW_FONT,
          fontSize: 36,
          fontWeight: 500,
          color: c.text,
          direction: 'rtl',
          opacity: o,
          transform: `translateY(${(1 - o) * 10}px)`,
        }}
      >
        <Bidi text={p.principles[idx]} />
      </div>
    </div>
  );
};
