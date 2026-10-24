import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';
import {alpha, useColors} from '../theme';

// Dark background with two slow, soft glows.
export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const c = useColors();
  const ax = 30 + noise2D('ax', f / 240, 0) * 12;
  const ay = 35 + noise2D('ay', 0, f / 240) * 10;
  const bx = 72 + noise2D('bx', f / 260, 3) * 12;
  const by = 70 + noise2D('by', 3, f / 260) * 10;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: c.bg,
        backgroundImage: [
          `radial-gradient(900px circle at ${ax}% ${ay}%, ${alpha(c.fr, 0.07)}, transparent 70%)`,
          `radial-gradient(800px circle at ${bx}% ${by}%, ${alpha(c.srs, 0.05)}, transparent 70%)`,
          `radial-gradient(1px 1px at 1px 1px, ${alpha(c.text, 0.05)} 1px, transparent 0)`,
        ].join(','),
        backgroundSize: 'auto, auto, 48px 48px',
      }}
    />
  );
};
