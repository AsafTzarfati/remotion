import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {HEBREW_FONT} from '../fonts';
import {useColors, useProps} from '../theme';

// Gradient line + title. The title docks to the top-right corner and stays.
export const Header: React.FC = () => {
  const f = useCurrentFrame();
  const {fps, width} = useVideoConfig();
  const c = useColors();
  const p = useProps();
  const line = spring({frame: f, fps, config: {damping: 200}, durationInFrames: 32});
  const enter = spring({frame: f - 8, fps, config: {damping: 200}, durationInFrames: 26});
  const dock = spring({frame: f - p.timing.titleDockFrame, fps, config: {damping: 200}, durationInFrames: 24});
  const fadeOut = interpolate(f, [p.timing.fadeOutFrame - 40, p.timing.fadeOutFrame], [1, 0.6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: 6,
          width: width * line,
          background: `linear-gradient(to left, ${c.test}, ${c.tasks}, ${c.fr})`,
          boxShadow: `0 0 24px rgba(219,97,162,0.45)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: interpolate(dock, [0, 1], [960, 1856]),
          top: interpolate(dock, [0, 1], [540, 44]),
          transform: `translate(${interpolate(dock, [0, 1], [-50, -100])}%, ${interpolate(dock, [0, 1], [-50, 0])}%) translateY(${(1 - enter) * 50}px)`,
          opacity: enter * fadeOut,
          fontFamily: HEBREW_FONT,
          fontWeight: 700,
          fontSize: interpolate(dock, [0, 1], [72, 36]),
          color: c.text,
          direction: 'rtl',
          whiteSpace: 'nowrap',
        }}
      >
        {p.title}
      </div>
    </>
  );
};
