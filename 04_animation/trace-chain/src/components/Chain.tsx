import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {HEBREW_FONT, MONO_FONT} from '../fonts';
import {getTimeline} from '../timeline';
import {alpha, useColors, useProps} from '../theme';
import {ChainPill, PILL} from './ChainPill';
import {TagPulse} from './TagPulse';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Final shot: six pills right-to-left, a light runs through them, then the caption.
export const Chain: React.FC<{sceneStart: number}> = ({sceneStart}) => {
  const f = useCurrentFrame() + sceneStart;
  const {fps} = useVideoConfig();
  const p = useProps();
  const c = useColors();
  const tl = getTimeline(p);
  const pills = p.chain.pills;
  if (f < tl.zoom) return null;

  const gap = 48;
  const step = PILL.width + gap;
  const total = pills.length * PILL.width + (pills.length - 1) * gap;
  const xs = pills.map((_, i) => 960 + total / 2 - PILL.width / 2 - i * step); // RTL: first pill on the right
  const y = 470;
  const first = xs[0];
  const last = xs[xs.length - 1];
  const lineGrow = interpolate(f, [tl.pillAppear(0), tl.pillAppear(pills.length - 1) + 10], [0, 1], clamp);
  const lightStart = tl.lit(0);
  const lightEnd = tl.lit(pills.length - 1);
  const dotX = interpolate(f, [lightStart, lightEnd], [first, last], clamp);
  const dotOpacity = interpolate(f, [lightStart - 4, lightStart, lightEnd, lightEnd + 10], [0, 1, 1, 0], clamp);
  const cap = spring({frame: f - tl.caption, fps, config: {damping: 200}, durationInFrames: 22});
  const captionParts = p.chain.caption.split(/(grep)/);

  return (
    <AbsoluteFill>
      {/* Connector */}
      <div
        style={{
          position: 'absolute',
          left: first - (first - last) * lineGrow,
          width: (first - last) * lineGrow,
          top: y - 2,
          height: 4,
          borderRadius: 2,
          background: alpha(c.muted, 0.35),
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: dotX,
          width: Math.max(0, first - dotX),
          top: y - 2,
          height: 4,
          borderRadius: 2,
          background: `linear-gradient(to left, ${pills.map((pl) => pl.color).join(', ')})`,
          backgroundSize: `${first - last}px 100%`,
          backgroundPosition: 'right center',
          boxShadow: `0 0 16px ${alpha(c.text, 0.35)}`,
        }}
      />
      {pills.map((pl, i) => (
        <ChainPill
          key={pl.label}
          label={pl.label}
          color={pl.color}
          appear={spring({frame: f - tl.pillAppear(i), fps, config: {damping: 200}, durationInFrames: 18})}
          litFor={f - tl.lit(i)}
          x={xs[i]}
          y={y}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: dotX - 14,
          top: y - 14,
          width: 28,
          height: 28,
          borderRadius: 14,
          background: '#FFFFFF',
          opacity: dotOpacity,
          boxShadow: `0 0 20px 6px rgba(255,255,255,0.8), 0 0 60px 20px ${alpha(c.fr, 0.6)}`,
        }}
      />
      {f >= tl.caption ? (
        <div
          style={{
            position: 'absolute',
            top: 640,
            left: 120,
            right: 120,
            textAlign: 'center',
            direction: 'rtl',
            fontFamily: HEBREW_FONT,
            fontSize: 50,
            fontWeight: 500,
            lineHeight: 1.5,
            color: c.text,
            opacity: cap,
            transform: `translateY(${(1 - cap) * 30}px)`,
          }}
        >
          {captionParts.map((part, i) =>
            part === 'grep' ? (
              <span key={i} style={{fontFamily: MONO_FONT, fontWeight: 700, color: c.commit}}>
                grep
              </span>
            ) : (
              <TagPulse key={i} text={part} pulseAt={tl.caption + 10} frame={f} tagStyle={{padding: '0 8px', margin: '0 6px', direction: 'ltr'}} />
            ),
          )}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
