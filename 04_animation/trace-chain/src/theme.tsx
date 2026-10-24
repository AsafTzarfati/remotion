import {createContext, useContext} from 'react';
import {defaultTraceChainProps, TraceChainProps} from './props';

export const ThemeContext = createContext<TraceChainProps>(defaultTraceChainProps);
export const useProps = () => useContext(ThemeContext);
export const useColors = () => useContext(ThemeContext).colors;

export const alpha = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h.slice(0, 6), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

export const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Code geometry shared by editors, terminal and chip landing points.
export const CODE = {
  fontSize: 26,
  lineHeight: 42,
  charWidth: 26 * 0.6, // JetBrains Mono advance width is 0.6em
};
