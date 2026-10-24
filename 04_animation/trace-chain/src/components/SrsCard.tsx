import React from 'react';
import {interpolateColors} from 'remotion';
import {HEBREW_FONT, MONO_FONT} from '../fonts';
import {alpha, useColors, useProps} from '../theme';

export const CARD_WIDTH = 1120;

type Segment = {text: string; hl: number};

const buildSegments = (text: string, highlights: string[]): Segment[] => {
  const segs: Segment[] = [];
  let rest = text;
  let guard = 0;
  while (rest.length && guard++ < 50) {
    let best = -1;
    let bestIdx = Infinity;
    highlights.forEach((h, i) => {
      const idx = rest.indexOf(h);
      if (idx >= 0 && idx < bestIdx) {
        bestIdx = idx;
        best = i;
      }
    });
    if (best < 0) {
      segs.push({text: rest, hl: -1});
      break;
    }
    if (bestIdx > 0) segs.push({text: rest.slice(0, bestIdx), hl: -1});
    segs.push({text: highlights[best], hl: best});
    rest = rest.slice(bestIdx + highlights[best].length);
  }
  return segs;
};

type Props = {
  words: number; // how many words are revealed (fractional fades in)
  underline: number[]; // 0..1 per highlight
  blink: number;
  rev: number;
  flash: number; // yellow flash when the question arrives
  highlightRefs?: React.RefObject<HTMLSpanElement | null>[];
  revLabel?: string;
};

export const SrsCard: React.FC<Props> = ({words, underline, blink, rev, flash, highlightRefs, revLabel}) => {
  const c = useColors();
  const {srs, tagId} = useProps();
  const segs = buildSegments(srs.text, srs.highlights);
  let wordIndex = 0;

  // Latin/number runs ("1 kHz", "±1%", "2 ms") are kept together left-to-right,
  // so they read correctly inside the Hebrew sentence.
  const isLatin = (w: string) => /^[A-Za-z0-9±%.,:]+$/.test(w) && /[A-Za-z0-9]/.test(w);
  const renderWords = (text: string) => {
    const parts = text.split(/(\s+)/).filter(Boolean);
    const groups: (string[] & {latin?: boolean; space?: boolean})[] = [];
    for (let i = 0; i < parts.length; i++) {
      const w = parts[i];
      const prev = groups[groups.length - 1];
      if (/^\s+$/.test(w)) {
        const next = parts[i + 1];
        if (prev && prev.latin && next && isLatin(next)) prev.push(w);
        else groups.push(Object.assign([w], {space: true}));
        continue;
      }
      if (isLatin(w) && prev && (prev as any).latin) prev.push(w);
      else groups.push(Object.assign([w], {latin: isLatin(w)}));
    }
    return groups.map((g, i) => {
      if (g.space) return <React.Fragment key={i}>{g[0]}</React.Fragment>;
      let word = g.join('');
      let trail = '';
      if (g.latin) {
        const m = word.match(/^(.*?)([.,:]+)$/);
        if (m) {
          word = m[1];
          trail = m[2];
        }
      }
      const o = Math.max(0, Math.min(1, words - wordIndex));
      wordIndex += g.filter((x) => !/^\s+$/.test(x)).length;
      return (
        <span
          key={i}
          style={{
            display: 'inline-block',
            opacity: o,
            transform: `translateY(${(1 - o) * 14}px)`,
          }}
        >
          {g.latin ? <bdi dir="ltr">{word}</bdi> : word}
          {trail}
        </span>
      );
    });
  };

  return (
    <div
      style={{
        width: CARD_WIDTH,
        boxSizing: 'border-box',
        padding: '44px 64px 56px',
        background: c.panel,
        borderRadius: 28,
        border: `1px solid ${alpha(c.srs, 0.35)}`,
        borderRight: `6px solid ${c.srs}`,
        boxShadow: `0 40px 100px rgba(0,0,0,0.55), 0 0 ${60 * flash}px ${alpha(c.commit, 0.6 * flash)}`,
        direction: 'rtl',
        fontFamily: HEBREW_FONT,
        color: c.text,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 30}}>
        <div style={{width: 12, height: 12, borderRadius: 6, background: c.ok}} />
        <span style={{fontSize: 28, color: c.muted, fontWeight: 500}}>{srs.label}</span>
        <span
          style={{
            fontFamily: MONO_FONT,
            fontSize: 26,
            fontWeight: 700,
            color: c.srs,
            direction: 'ltr',
            padding: '4px 14px',
            borderRadius: 10,
            background: alpha(c.srs, 0.12 + 0.35 * blink),
            border: `2px solid ${alpha(c.srs, 0.5 + 0.5 * blink)}`,
            boxShadow: `0 0 ${36 * blink}px ${alpha(c.srs, 0.8 * blink)}`,
          }}
        >
          {tagId}
        </span>
        {revLabel && rev > 0 ? (
          <span
            style={{
              fontFamily: MONO_FONT,
              fontSize: 22,
              fontWeight: 700,
              color: c.commit,
              direction: 'ltr',
              padding: '3px 12px',
              borderRadius: 8,
              border: `2px solid ${c.commit}`,
              opacity: rev,
              transform: `scale(${0.7 + 0.3 * rev})`,
            }}
          >
            {revLabel}
          </span>
        ) : null}
      </div>
      <div style={{fontSize: 46, lineHeight: 1.65, fontWeight: 500}}>
        {segs.map((s, i) => {
          if (s.hl < 0) return <React.Fragment key={i}>{renderWords(s.text)}</React.Fragment>;
          const p = underline[s.hl] ?? 0;
          return (
            <span
              key={i}
              ref={highlightRefs?.[s.hl]}
              style={{
                color: interpolateColors(p, [0, 1], [c.text, '#D8C2FF']),
                backgroundImage: `linear-gradient(${c.fr}, ${c.fr})`,
                backgroundSize: `${p * 100}% 5px`,
                backgroundPosition: 'right bottom',
                backgroundRepeat: 'no-repeat',
                paddingBottom: 6,
              }}
            >
              {renderWords(s.text)}
            </span>
          );
        })}
      </div>
    </div>
  );
};
