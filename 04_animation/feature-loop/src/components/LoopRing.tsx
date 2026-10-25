import React from 'react';
import {Easing, Img, interpolate, interpolateColors, staticFile} from 'remotion';
import {HEBREW_FONT, MONO_FONT} from '../fonts';
import {useCycle} from '../cycle';
import {alpha, clamp, gradAt, gradCss, LAYOUT, ramp, useColors, useProps} from '../theme';

const {cx, cy, r} = LAYOUT.ring;

// Angle in degrees: 0 is the top, clockwise.
export const ringPoint = (deg: number, radius = r) => {
  const a = (deg * Math.PI) / 180;
  return {x: cx + radius * Math.sin(a), y: cy - radius * Math.cos(a)};
};

// Where the SRS tag sits, above the top station.
export const TAG_POS = {x: cx, y: cy - r - 104};

// Shared stage timing for the ring and the center label.
export const useRingState = () => {
  const {local, len, s} = useCycle();
  const p = useProps();
  const m = p.timing.dotMoveFrames;
  const starts = [s.specify, s.clarify, s.plan, s.tasks, s.analyze, s.implement];
  // The dot rests on a station, then eases to the next one when its stage starts.
  const input = [0];
  const output = [0];
  for (let i = 1; i < 6; i++) {
    input.push(starts[i], starts[i] + m);
    output.push((i - 1) * 60, i * 60);
  }
  input.push(s.handoff, len);
  output.push(300, 360);
  const angle = interpolate(local, input, output, {...clamp, easing: Easing.inOut(Easing.cubic)});
  const arrive = starts.map((st, i) => (i === 0 ? st : st + m));
  const active = 1 - ramp(local, s.handoff, s.handoff + 30);
  const lit = arrive.map((a) => ramp(local, a - 4, a + 6) * active);
  const commitFrame = s.implement + 80;
  const pulse = interpolate(local, [commitFrame, commitFrame + 10, commitFrame + 36], [0, 1, 0], clamp);
  return {angle, lit, active, pulse, starts, local, s};
};

const Logo: React.FC = () => {
  const c = useColors();
  const p = useProps();
  if (p.logoFile) return <Img src={staticFile(p.logoFile)} style={{height: 96}} />;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
      <div
        style={{
          width: 76,
          height: 76,
          borderRadius: 20,
          background: gradCss(c, '135deg'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 40px ${alpha(c.grad2, 0.45)}`,
          fontFamily: MONO_FONT,
          fontWeight: 800,
          fontSize: 34,
          color: '#fff',
        }}
      >
        {'{}'}
      </div>
      <div style={{fontFamily: HEBREW_FONT, fontWeight: 700, fontSize: 24, color: c.text, letterSpacing: 1}}>{p.logoText}</div>
    </div>
  );
};

export const LoopRing: React.FC = () => {
  const c = useColors();
  const p = useProps();
  const {feature} = useCycle();
  const {angle, lit, active, pulse, starts, local, s} = useRingState();
  const stationColor = (i: number) => gradAt(c, i / 5);
  const dot = ringPoint(angle);
  // Back from blue to pink on the way home, so the loop point has no color jump.
  const dotColor = gradAt(c, angle <= 300 ? angle / 300 : 1 - (angle - 300) / 60);

  // Gradient trail from the top to the dot, drawn as short arc segments.
  const segs: React.ReactNode[] = [];
  const step = 3;
  for (let a = 0; a < angle - 0.01; a += step) {
    const b = Math.min(angle, a + step + 0.6);
    const p0 = ringPoint(a);
    const p1 = ringPoint(b);
    segs.push(
      <path
        key={a}
        d={`M ${p0.x} ${p0.y} A ${r} ${r} 0 0 1 ${p1.x} ${p1.y}`}
        stroke={gradAt(c, Math.min(1, a / 300))}
        strokeWidth={7}
        fill="none"
      />,
    );
  }

  const baseStroke = interpolateColors(pulse, [0, 1], [c.border, c.ok]);
  const idOpacity = ramp(local, 18, 40) * (1 - ramp(local, s.handoff, s.handoff + 18));

  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <circle cx={cx} cy={cy} r={r + 26} fill="none" stroke={alpha(c.border, 0.35)} strokeWidth={1} />
        <circle cx={cx} cy={cy} r={r - 26} fill="none" stroke={alpha(c.border, 0.25)} strokeWidth={1} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={baseStroke} strokeWidth={7 + 6 * pulse} />
        <g opacity={active * (1 - pulse * 0.7)} style={{filter: `drop-shadow(0 0 8px ${alpha(c.grad2, 0.7)})`}}>
          {segs}
        </g>
        {pulse > 0.001 ? (
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={c.ok}
            strokeWidth={8}
            opacity={pulse}
            style={{filter: `drop-shadow(0 0 ${24 * pulse}px ${c.ok})`}}
          />
        ) : null}
        {p.stations.map((name, i) => {
          const deg = i * 60;
          const pt = ringPoint(deg);
          const lp = ringPoint(deg, r + 40);
          const sin = Math.sin((deg * Math.PI) / 180);
          const anchor = sin > 0.3 ? 'start' : sin < -0.3 ? 'end' : 'middle';
          const col = stationColor(i);
          const l = lit[i];
          const isNow = local >= starts[i] && (i === 5 ? local < s.handoff : local < starts[i + 1]);
          const nowGlow = isNow ? l : 0;
          return (
            <g key={name}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={17 + 3 * nowGlow}
                fill={interpolateColors(l, [0, 1], [c.panel, alpha(col, 0.25)])}
                stroke={interpolateColors(l, [0, 1], [c.border, col])}
                strokeWidth={4}
                style={{filter: nowGlow > 0.01 ? `drop-shadow(0 0 ${16 * nowGlow}px ${col})` : undefined}}
              />
              <circle cx={pt.x} cy={pt.y} r={6} fill={interpolateColors(l, [0, 1], [c.border, col])} />
              <text
                x={lp.x}
                y={lp.y + 8}
                textAnchor={anchor}
                fontFamily={MONO_FONT}
                fontSize={23}
                fontWeight={isNow ? 700 : 500}
                fill={interpolateColors(l, [0, 1], [c.muted, c.text])}
              >
                {name}
              </text>
            </g>
          );
        })}
        <circle cx={dot.x} cy={dot.y} r={26} fill={alpha(dotColor, 0.18)} />
        <circle
          cx={dot.x}
          cy={dot.y}
          r={11}
          fill="#fff"
          stroke={dotColor}
          strokeWidth={5}
          style={{filter: `drop-shadow(0 0 14px ${dotColor}) drop-shadow(0 0 28px ${dotColor})`}}
        />
      </svg>

      {/* Center: logo, feature id, stage name */}
      <div
        style={{
          position: 'absolute',
          left: cx - 160,
          top: cy - 140,
          width: 320,
          height: 280,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          direction: 'ltr',
        }}
      >
        <Logo />
        <div
          style={{
            marginTop: 16,
            fontFamily: MONO_FONT,
            fontSize: 22,
            color: c.text,
            opacity: idOpacity,
            whiteSpace: 'nowrap',
          }}
        >
          {feature.id}
        </div>
        <div style={{position: 'relative', width: 320, height: 64, marginTop: 6}}>
          {p.stations.map((name, i) => {
            const end = i === 5 ? s.handoff : starts[i + 1];
            const o = ramp(local, starts[i], starts[i] + 10) * (1 - ramp(local, end - 6, end));
            const col = interpolateColors(0.3, [0, 1], [stationColor(i), '#ffffff']);
            if (o <= 0) return null;
            return (
              <div
                key={name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  textAlign: 'center',
                  fontFamily: HEBREW_FONT,
                  fontWeight: 800,
                  fontSize: 48,
                  letterSpacing: 4,
                  color: col,
                  opacity: o,
                  transform: `translateY(${(1 - o) * 8}px)`,
                  textShadow: `0 0 24px ${alpha(stationColor(i), 0.5)}`,
                }}
              >
                {name.toUpperCase()}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
