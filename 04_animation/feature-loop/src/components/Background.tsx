import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {alpha, useColors} from '../theme';

// Dark background with two slow glows. Their motion is periodic over the
// whole video, so the last frame flows into the first.
export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const c = useColors();
  const a = (f / durationInFrames) * Math.PI * 2;
  const ax = 40 + Math.cos(a) * 8;
  const ay = 50 + Math.sin(a) * 8;
  const bx = 60 + Math.cos(a * 2 + 1) * 8;
  const by = 55 + Math.sin(a + 2) * 8;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: c.bg,
        backgroundImage: [
          `radial-gradient(800px circle at ${ax}% ${ay}%, ${alpha(c.grad2, 0.07)}, transparent 70%)`,
          `radial-gradient(700px circle at ${bx}% ${by}%, ${alpha(c.grad3, 0.07)}, transparent 70%)`,
          `radial-gradient(1px 1px at 1px 1px, ${alpha(c.text, 0.05)} 1px, transparent 0)`,
        ].join(','),
        backgroundSize: 'auto, auto, 48px 48px',
      }}
    />
  );
};
