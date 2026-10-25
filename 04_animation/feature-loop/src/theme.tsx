import {createContext, useContext} from 'react';
import {interpolate, interpolateColors} from 'remotion';
import {defaultFeatureLoopProps, FeatureLoopProps} from './props';

export const ThemeContext = createContext<FeatureLoopProps>(defaultFeatureLoopProps);
export const useProps = () => useContext(ThemeContext);
export const useColors = () => useContext(ThemeContext).colors;

export const alpha = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h.slice(0, 6), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

// Color at position t (0..1) along the Spec Kit gradient.
export const gradAt = (c: FeatureLoopProps['colors'], t: number) =>
  interpolateColors(t, [0, 0.5, 1], [c.grad1, c.grad2, c.grad3]);

export const gradCss = (c: FeatureLoopProps['colors'], dir = 'to right') =>
  `linear-gradient(${dir}, ${c.grad1}, ${c.grad2}, ${c.grad3})`;

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// 0 → 1 between two frames, linear and clamped.
export const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);

// Fixed screen layout (1920×1080).
export const LAYOUT = {
  topBar: 96,
  bottomBar: 96,
  ring: {cx: 722, cy: 560, r: 190},
  repo: {x: 36, y: 300, w: 352},
  srs: {x: 1536, y: 196, w: 346},
  windows: {x: 1062, w: 432},
};

export const MONO = {fontSize: 19, lineHeight: 30, charWidth: 19 * 0.6};
