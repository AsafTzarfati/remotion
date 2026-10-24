import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  spring,
  useCurrentFrame,
  useCurrentScale,
  useVideoConfig,
} from 'remotion';
import {getPointAtLength, getLength} from '@remotion/paths';
import {fontsReady} from '../fonts';
import {getTimeline} from '../timeline';
import {CODE, useColors, useProps} from '../theme';
import {cardPose} from './Workspace';
import {CARD_WIDTH, SrsCard} from './SrsCard';
import {Chip, CHIP} from './Chip';
import {editorCharPos} from './EditorWindow';
import {EDITOR_Y, SPEC_X} from './Workspace';

type Pt = {x: number; y: number};

// Chips leave the underlined phrases and land where their FR id gets typed in spec.md.
export const FlyingChips: React.FC<{sceneStart: number}> = ({sceneStart}) => {
  const f = useCurrentFrame() + sceneStart;
  const {fps} = useVideoConfig();
  const p = useProps();
  const c = useColors();
  const tl = getTimeline(p);
  const scale = useCurrentScale();
  const rootRef = useRef<HTMLDivElement>(null);
  const refs = useRef(p.srs.highlights.map(() => React.createRef<HTMLSpanElement>())).current;
  const [origins, setOrigins] = useState<Pt[] | null>(null);
  const [handle] = useState(() => delayRender('Measuring highlight positions'));

  useLayoutEffect(() => {
    let cancelled = false;
    fontsReady().then(() => {
      if (cancelled || !rootRef.current) return;
      const root = rootRef.current.getBoundingClientRect();
      setOrigins(
        refs.map((r, i) => {
          const rects = r.current ? Array.from(r.current.getClientRects()) : [];
          const big = rects.sort((a, b) => b.width - a.width)[0];
          if (!big) return {x: 960 - 200 + i * 300, y: 600};
          return {
            x: (big.left + big.width / 2 - root.left) / scale,
            y: (big.top + big.height / 2 - root.top) / scale,
          };
        }),
      );
    });
    return () => {
      cancelled = true;
    };
  }, [refs, scale]);

  useEffect(() => {
    if (origins) continueRender(handle);
  }, [origins, handle]);

  const lines = p.spec.code.split('\n');

  return (
    <AbsoluteFill ref={rootRef}>
      {/* Invisible copy of the card at rest, used only for measuring. */}
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 540,
          width: CARD_WIDTH,
          transform: 'translate(-50%, -50%)',
          visibility: 'hidden',
        }}
      >
        <SrsCard words={999} underline={p.srs.highlights.map(() => 1)} blink={0} rev={0} flash={0} highlightRefs={refs} />
      </div>
      {origins
        ? p.spec.chips.map((label, i) => {
            const launch = tl.chipLaunch(i);
            if (f < launch) return null;
            const pose = cardPose(launch, tl, fps);
            const o = origins[i] ?? origins[0];
            const from = {x: pose.cx + (o.x - 960) * pose.scale, y: pose.cy + (o.y - 540) * pose.scale};
            const li = Math.max(0, lines.findIndex((l) => l.includes(label)));
            const col = Math.max(0, lines[li].indexOf(label));
            const w = label.length * CODE.charWidth + 2 * (CHIP.padX + CHIP.border);
            const land = editorCharPos(li, col);
            const to = {x: SPEC_X + land.x - CHIP.padX - CHIP.border + w / 2, y: EDITOR_Y + land.y + CODE.lineHeight / 2};
            const ctrl = {x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - 260};
            const d = `M ${from.x} ${from.y} Q ${ctrl.x} ${ctrl.y} ${to.x} ${to.y}`;
            const t = spring({frame: f - launch, fps, config: {damping: 200}, durationInFrames: 34});
            const pt = getPointAtLength(d, getLength(d) * t) ?? to;
            const offset = lines.slice(0, li).reduce((a, l) => a + l.length + 1, 0) + col + label.length;
            const typedAt = tl.specStart + offset / tl.cps;
            const pop = interpolate(f - launch, [0, 8], [0.6, 1], {extrapolateRight: 'clamp'});
            const fade = interpolate(f, [typedAt, typedAt + 8], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            if (fade <= 0) return null;
            return (
              <Chip
                key={label}
                label={label}
                color={c.fr}
                style={{
                  left: pt.x - w / 2,
                  top: pt.y - CODE.lineHeight / 2,
                  opacity: Math.min(pop, fade),
                  transform: `scale(${pop})`,
                }}
              />
            );
          })
        : null}
    </AbsoluteFill>
  );
};
