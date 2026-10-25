import React from 'react';
import {Img, interpolate, interpolateColors, spring, staticFile, useVideoConfig} from 'remotion';
import {MONO_FONT} from '../fonts';
import {useCycle} from '../cycle';
import {alpha, clamp, gradAt, gradCss, LAYOUT, MONO, ramp, useColors, useProps} from '../theme';
import {MiniEditor} from './MiniEditor';
import {Check, landFrame, repoLandPoint} from './RepoTree';
import {CodeLine, TypeWriter} from './TypeWriter';

const X = LAYOUT.windows.x;
const W = LAYOUT.windows.w;
export const WIN = {
  spec: {x: X, y: 170, w: W, h: 220},
  plan: {x: X, y: 410, w: W, h: 170},
  tasks: {x: X, y: 600, w: W, h: 152},
  code: {x: X - 20, y: 320, w: W + 20, h: 244},
  badgeY: 776,
};
// Point the windows fold into before the file flies.
const FOLD = {x: X + W / 2, y: 460};

const Pill: React.FC<{color: string; children: React.ReactNode; scale?: number; opacity?: number; style?: React.CSSProperties}> = ({
  color,
  children,
  scale = 1,
  opacity = 1,
  style,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: MONO_FONT,
      fontSize: 17,
      fontWeight: 700,
      color,
      padding: '4px 12px',
      borderRadius: 9,
      background: alpha(color, 0.14),
      border: `2px solid ${alpha(color, 0.8)}`,
      transform: `scale(${scale})`,
      opacity,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);

const Box: React.FC<{done: number}> = ({done}) => {
  const c = useColors();
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" style={{flexShrink: 0, marginRight: 10}}>
      <rect
        x={1.5}
        y={1.5}
        width={17}
        height={17}
        rx={4}
        fill={alpha(c.ok, 0.85 * done)}
        stroke={interpolateColors(done, [0, 1], [c.muted, c.ok])}
        strokeWidth={2}
      />
      <path
        d="M5 10.5 l3.2 3.2 l6.5-7"
        fill="none"
        stroke="#fff"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={20}
        strokeDashoffset={20 * (1 - done)}
      />
    </svg>
  );
};

// spec.md, plan.md, tasks.md and the code window, then the fold into one file
// that flies to the repo tree.
export const StageWindows: React.FC = () => {
  const c = useColors();
  const p = useProps();
  const {fps} = useVideoConfig();
  const {local, feature: f, s} = useCycle();
  const sp = p.timing.typeSpeed;
  const open = (at: number) => spring({frame: local - at, fps, config: {damping: 200}, durationInFrames: 18});
  const pop = (at: number) => spring({frame: local - at, fps, config: {damping: 200}, durationInFrames: 12});

  // Fold at handoff: every window moves to FOLD and shrinks away.
  const fold = spring({frame: local - s.handoff, fps, config: {damping: 200}, durationInFrames: 18});
  const foldStyle = (w: {x: number; y: number; w: number; h: number}): React.CSSProperties =>
    fold > 0
      ? {
          translate: `${(FOLD.x - (w.x + w.w / 2)) * fold}px ${(FOLD.y - (w.y + w.h / 2)) * fold}px`,
          scale: `${1 - 0.88 * fold}`,
          opacity: 1 - fold,
        }
      : {};
  const dimCode = ramp(local, s.implement, s.implement + 12);

  // specify
  const specLine = `${f.fr} [${f.srs}]`;
  const typeAt = s.specify + 16;
  // clarify
  const ask = pop(s.clarify + 4);
  const resolve = ramp(local, s.clarify + 34, s.clarify + 42);
  const qColor = interpolateColors(resolve, [0, 1], [c.warn, c.ok]);
  // plan
  const planType = s.plan + 14;
  const planLine2 = planType + Math.ceil(f.planLines[0].length / sp) + 2;
  const constitution = pop(s.plan + 56);
  // tasks
  const checks = [18, 30, 42].map((d) => ramp(local, s.tasks + d, s.tasks + d + 6));
  // analyze
  const scanX = interpolate(local, [s.analyze + 4, s.analyze + 40], [X - 30, X + W + 30], clamp);
  const scanO = ramp(local, s.analyze + 2, s.analyze + 6) * (1 - ramp(local, s.analyze + 38, s.analyze + 44));
  const consistent = pop(s.analyze + 38);
  // implement
  const codeAt = (i: number) => s.implement + 14 + i * 9;
  const tests = pop(s.implement + 62);
  const commit = pop(s.implement + 78);

  // File flight
  const fileIn = ramp(local, s.handoff + 6, s.handoff + 12);
  const fly = spring({frame: local - (s.handoff + 10), fps, config: {damping: 200}, durationInFrames: landFrame(s.handoff) - (s.handoff + 10)});
  const target = repoLandPoint(p.repoStatic);
  const ctl = {x: (FOLD.x + target.x) / 2, y: 170};
  const fx = (1 - fly) ** 2 * FOLD.x + 2 * (1 - fly) * fly * ctl.x + fly ** 2 * target.x;
  const fy = (1 - fly) ** 2 * FOLD.y + 2 * (1 - fly) * fly * ctl.y + fly ** 2 * target.y;
  const fileO = fileIn * (1 - ramp(fly, 0.88, 1));

  const specColor = gradAt(c, 0);
  const planColor = gradAt(c, 0.4);
  const tasksColor = gradAt(c, 0.6);
  const codeColor = gradAt(c, 1);

  return (
    <>
      <MiniEditor tab="spec.md" tabColor={specColor} {...WIN.spec} open={open(s.specify + 4)} lines={2} dim={dimCode} style={foldStyle(WIN.spec)}>
        <CodeLine text={`# ${f.id}`} style={{color: c.muted}} />
        <TypeWriter text={specLine} frame={local} start={typeAt} speed={sp} />
        {ask > 0 ? (
          <div
            style={{
              marginTop: 12,
              padding: '8px 12px',
              borderRadius: 10,
              border: `2px solid ${alpha(qColor, 0.85)}`,
              background: alpha(qColor, 0.12),
              transform: `scale(${0.85 + 0.15 * ask})`,
              transformOrigin: 'left center',
              opacity: ask,
              fontFamily: MONO_FONT,
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 800, color: qColor, letterSpacing: 0.5}}>
              [{p.needsLabel}]
              {resolve > 0 ? (
                <span style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, opacity: resolve, fontSize: 17}}>
                  <Check color={c.ok} size={18} />
                  {p.resolvedLabel}
                </span>
              ) : null}
            </div>
            <div style={{marginTop: 4, fontSize: 18, color: c.text, opacity: 1 - 0.35 * resolve}}>
              <TypeWriter text={f.clarifyQ} frame={local} start={s.clarify + 10} speed={sp} cursor={false} />
            </div>
          </div>
        ) : null}
      </MiniEditor>

      <MiniEditor tab="plan.md" tabColor={planColor} {...WIN.plan} open={open(s.plan + 4)} lines={2} dim={dimCode} style={foldStyle(WIN.plan)}>
        <TypeWriter text={f.planLines[0]} frame={local} start={planType} speed={sp} cursor={local < planLine2} />
        <TypeWriter text={f.planLines[1]} frame={local} start={planLine2} speed={sp} />
        {constitution > 0 ? (
          <Pill color={c.ok} scale={0.8 + 0.2 * constitution} opacity={constitution} style={{marginTop: 8, transformOrigin: 'left center'}}>
            {p.constitutionLabel}
          </Pill>
        ) : null}
      </MiniEditor>

      <MiniEditor tab="tasks.md" tabColor={tasksColor} {...WIN.tasks} open={open(s.tasks + 4)} lines={3} dim={dimCode} style={foldStyle(WIN.tasks)}>
        {f.tasks.map((t, i) => (
          <div key={t} style={{display: 'flex', alignItems: 'center', height: MONO.lineHeight}}>
            <Box done={checks[i]} />
            <CodeLine text={t} style={{opacity: 0.75 + 0.25 * checks[i]}} />
          </div>
        ))}
      </MiniEditor>

      {/* analyze: vertical scan line over the three windows */}
      {scanO > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: scanX - 2,
            top: WIN.spec.y - 16,
            width: 4,
            height: WIN.tasks.y + WIN.tasks.h - WIN.spec.y + 32,
            background: `linear-gradient(to bottom, ${c.grad1}, ${c.grad2}, ${c.grad3})`,
            boxShadow: `0 0 18px ${c.grad2}, 0 0 40px ${alpha(c.grad1, 0.6)}`,
            opacity: scanO,
            borderRadius: 2,
          }}
        />
      ) : null}
      {consistent > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: X,
            width: W,
            top: WIN.badgeY,
            display: 'flex',
            justifyContent: 'center',
            ...foldStyle({x: X, y: WIN.badgeY, w: W, h: 40}),
          }}
        >
          <Pill color={c.ok} scale={0.8 + 0.2 * consistent} opacity={consistent} style={{fontSize: 20, padding: '6px 16px'}}>
            {p.consistentLabel}
          </Pill>
        </div>
      ) : null}

      <MiniEditor
        tab={`src/${f.id.replace(/^\d+-/, '').replace(/-/g, '_')}.c`}
        tabColor={codeColor}
        {...WIN.code}
        open={open(s.implement + 4)}
        lines={f.code.length}
        style={{...foldStyle(WIN.code), boxShadow: `0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px ${alpha(c.grad2, 0.4)}`}}
      >
        {f.code.map((line, i) => {
          const a = codeAt(i);
          const shown = ramp(local, a, a + 2);
          const flash = interpolate(local, [a, a + 2, a + 14], [0, 1, 0], clamp);
          return (
            <div key={i} style={{position: 'relative', opacity: shown}}>
              <div
                style={{
                  position: 'absolute',
                  inset: '0 -14px 0 -54px',
                  background: alpha(gradAt(c, 0.5), 0.35 * flash),
                }}
              />
              <CodeLine text={line} style={{position: 'relative', textShadow: flash > 0.01 ? `0 0 ${12 * flash}px ${c.grad1}` : undefined}} />
            </div>
          );
        })}
        <div style={{display: 'flex', gap: 12, marginTop: 14}}>
          {tests > 0 ? (
            <Pill color={c.ok} scale={0.8 + 0.2 * tests} opacity={tests}>
              {p.testsLabel}
            </Pill>
          ) : null}
          {commit > 0 ? (
            <Pill color={c.warn} scale={0.8 + 0.2 * commit} opacity={commit}>
              <span style={{color: c.muted, fontWeight: 500}}>commit</span> {f.commit}
            </Pill>
          ) : null}
        </div>
      </MiniEditor>

      {/* The folded "file" flying to the repo */}
      {fileO > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: fx,
            top: fy,
            transform: `translate(-50%, -50%) scale(${1 - 0.45 * fly})`,
            opacity: fileO,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: 64,
              height: 80,
              borderRadius: 10,
              padding: 2,
              background: gradCss(c, '160deg'),
              boxShadow: `0 0 30px ${alpha(c.grad2, 0.7)}`,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 8,
                background: c.panel,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 6,
                padding: '0 10px',
                boxSizing: 'border-box',
              }}
            >
              {p.logoFile ? <Img src={staticFile(p.logoFile)} style={{width: 34, height: 34, alignSelf: 'center'}} /> : null}
              {[1, 0.6].map((w, i) => (
                <div key={i} style={{height: 4, width: `${w * 100}%`, borderRadius: 2, background: alpha(c.text, 0.5)}} />
              ))}
            </div>
          </div>
          <div style={{fontFamily: MONO_FONT, fontSize: 18, color: c.text, whiteSpace: 'nowrap', textShadow: '0 2px 8px #000'}}>
            specs/{f.id}/
          </div>
        </div>
      ) : null}
    </>
  );
};

