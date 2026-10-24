import React from 'react';
import {interpolate} from 'remotion';
import {MONO_FONT} from '../fonts';
import {alpha, useColors} from '../theme';

export const PILL = {width: 230, height: 76};

// appear: 0..1 entrance progress. lit: frames since the light reached it (negative = not yet).
export const ChainPill: React.FC<{label: string; color: string; appear: number; litFor: number; x: number; y: number}> = ({
  label,
  color,
  appear,
  litFor,
  x,
  y,
}) => {
  const c = useColors();
  const lit = interpolate(litFor, [0, 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const flash = interpolate(litFor, [0, 4, 20], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        left: x - PILL.width / 2,
        top: y - PILL.height / 2,
        width: PILL.width,
        height: PILL.height,
        borderRadius: PILL.height / 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: MONO_FONT,
        fontSize: 28,
        fontWeight: 700,
        direction: 'ltr',
        color: lit > 0.5 ? c.bg : color,
        background: lit > 0 ? alpha(color, 0.12 + 0.88 * lit) : alpha(color, 0.1),
        border: `2px solid ${alpha(color, 0.45 + 0.55 * lit)}`,
        boxShadow: `0 0 ${10 + 40 * lit + 30 * flash}px ${alpha(color, 0.15 + 0.5 * lit)}`,
        opacity: appear,
        transform: `translateY(${(1 - appear) * 40}px) scale(${(0.85 + 0.15 * appear) * (1 + 0.1 * flash)})`,
      }}
    >
      {label}
    </div>
  );
};
