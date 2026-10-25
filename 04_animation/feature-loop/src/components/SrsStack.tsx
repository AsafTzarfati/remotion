import React from 'react';
import {spring, useVideoConfig} from 'remotion';
import {HEBREW_FONT, MONO_FONT} from '../fonts';
import {useCycle} from '../cycle';
import {Feature} from '../props';
import {alpha, LAYOUT, ramp, useColors, useProps} from '../theme';
import {Bidi} from './Bidi';
import {TAG_POS} from './LoopRing';

const CARD = {w: LAYOUT.srs.w, h: 138, gap: 22, top: LAYOUT.srs.y + 56};
const VISIBLE = 3;
const slotY = (slot: number) => CARD.top + slot * (CARD.h + CARD.gap);

const Card: React.FC<{f: Feature; style: React.CSSProperties}> = ({f, style}) => {
  const c = useColors();
  return (
    <div
      style={{
        position: 'absolute',
        width: CARD.w,
        height: CARD.h,
        boxSizing: 'border-box',
        padding: '18px 26px',
        background: c.panel,
        borderRadius: 18,
        border: `1px solid ${alpha(c.srs, 0.35)}`,
        borderRight: `6px solid ${c.srs}`,
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        direction: 'rtl',
        fontFamily: HEBREW_FONT,
        color: c.text,
        ...style,
      }}
    >
      <div
        style={{
          display: 'inline-block',
          fontFamily: MONO_FONT,
          fontSize: 20,
          fontWeight: 700,
          color: c.srs,
          direction: 'ltr',
          padding: '2px 10px',
          borderRadius: 8,
          background: alpha(c.srs, 0.12),
          border: `2px solid ${alpha(c.srs, 0.5)}`,
        }}
      >
        {f.srs}
      </div>
      <div style={{marginTop: 12, fontSize: 27, fontWeight: 500, lineHeight: 1.3}}>
        <Bidi text={f.title} />
      </div>
    </div>
  );
};

export const SrsTag: React.FC<{text: string; opacity: number; scale?: number}> = ({text, opacity, scale = 1}) => {
  const c = useColors();
  return (
    <div
      style={{
        position: 'absolute',
        left: TAG_POS.x,
        top: TAG_POS.y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        fontFamily: MONO_FONT,
        fontSize: 26,
        fontWeight: 700,
        color: c.srs,
        padding: '6px 18px',
        borderRadius: 12,
        background: alpha(c.srs, 0.14),
        border: `2px solid ${c.srs}`,
        boxShadow: `0 0 26px ${alpha(c.srs, 0.45)}`,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

// Queue of requirement cards. The top card flies to the ring; at the end of
// the cycle the rest move up and the card that left returns to the bottom.
export const SrsStack: React.FC = () => {
  const c = useColors();
  const p = useProps();
  const {fps} = useVideoConfig();
  const {local, n, at, s} = useCycle();

  const leave = spring({frame: local, fps, config: {damping: 200}, durationInFrames: 54});
  const rise = spring({frame: local - (s.handoff + 25), fps, config: {damping: 200}, durationInFrames: 30});

  // Card leaving: quadratic arc from slot 0 to the tag above the ring.
  const p0 = {x: LAYOUT.srs.x + CARD.w / 2, y: slotY(0) + CARD.h / 2};
  const p1 = TAG_POS;
  const ctl = {x: (p0.x + p1.x) / 2, y: 110};
  const t = leave;
  const lx = (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * ctl.x + t ** 2 * p1.x;
  const ly = (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * ctl.y + t ** 2 * p1.y;
  const cardOpacity = 1 - ramp(t, 0.72, 0.95);
  const tagOpacity = ramp(t, 0.7, 1) * (1 - ramp(local, s.handoff, s.handoff + 20));

  const vis = (slot: number) => Math.max(0, Math.min(1, VISIBLE - slot));
  const cards: React.ReactNode[] = [];
  for (let j = 1; j < n; j++) {
    const slot = j - rise;
    cards.push(
      <Card key={`q${at(j)}`} f={p.features[at(j)]} style={{left: LAYOUT.srs.x, top: slotY(slot), opacity: vis(slot)}} />,
    );
  }
  // The card that left comes back at the bottom.
  const back = n - 1;
  cards.push(
    <Card
      key="back"
      f={p.features[at(0)]}
      style={{left: LAYOUT.srs.x, top: slotY(back) + (1 - rise) * 40, opacity: rise * vis(back)}}
    />,
  );

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: LAYOUT.srs.x,
          top: LAYOUT.srs.y,
          width: CARD.w,
          direction: 'rtl',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontFamily: HEBREW_FONT,
          fontSize: 24,
          fontWeight: 700,
          color: c.muted,
          letterSpacing: 2,
        }}
      >
        <div style={{width: 10, height: 10, borderRadius: 5, background: c.srs}} />
        {p.srsLabel}
      </div>
      {cards}
      {cardOpacity > 0 ? (
        <Card
          f={p.features[at(0)]}
          style={{
            left: lx - CARD.w / 2,
            top: ly - CARD.h / 2,
            transform: `scale(${1 - 0.62 * t})`,
            opacity: cardOpacity,
            zIndex: 5,
          }}
        />
      ) : null}
      {tagOpacity > 0 ? <SrsTag text={p.features[at(0)].srs} opacity={tagOpacity} scale={0.85 + 0.15 * ramp(t, 0.7, 1)} /> : null}
    </>
  );
};
