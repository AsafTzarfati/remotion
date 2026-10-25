import React from 'react';
import {Img, interpolate, spring, staticFile, useVideoConfig} from 'remotion';
import {MONO_FONT} from '../fonts';
import {useCycle} from '../cycle';
import {alpha, gradCss, LAYOUT, useColors, useProps} from '../theme';

const R = {header: 52, commit: 50, row: 40, pad: 8, childIndent: 26};
const SPECS_DIR = 'specs/';

// Frame (inside a cycle) when the flying file lands.
export const landFrame = (handoff: number) => handoff + 48;

// Screen point of the first child row under specs/, where new folders land.
export const repoLandPoint = (staticRows: string[]) => {
  const specsIdx = Math.max(0, staticRows.indexOf(SPECS_DIR));
  return {
    x: LAYOUT.repo.x + 18 + R.childIndent + 20,
    y: LAYOUT.repo.y + 3 + R.header + R.commit + R.pad + (specsIdx + 1) * R.row + R.row / 2,
  };
};

const Folder: React.FC<{color: string}> = ({color}) => (
  <svg width={20} height={16} viewBox="0 0 20 16" style={{flexShrink: 0}}>
    <path d="M1 3 a2 2 0 0 1 2-2 h4 l2 2 h8 a2 2 0 0 1 2 2 v8 a2 2 0 0 1-2 2 h-14 a2 2 0 0 1-2-2 z" fill={color} />
  </svg>
);

const FileIcon: React.FC<{color: string}> = ({color}) => (
  <svg width={16} height={18} viewBox="0 0 16 18" style={{flexShrink: 0, marginLeft: 2, marginRight: 2}}>
    <path d="M2 1 h8 l4 4 v11 a1 1 0 0 1-1 1 h-11 a1 1 0 0 1-1-1 v-14 a1 1 0 0 1 1-1 z" fill="none" stroke={color} strokeWidth={1.6} />
  </svg>
);

const Check: React.FC<{color: string; size?: number}> = ({color, size = 20}) => (
  <svg width={size} height={size} viewBox="0 0 20 20" style={{flexShrink: 0}}>
    <circle cx={10} cy={10} r={9} fill={alpha(color, 0.18)} stroke={color} strokeWidth={1.6} />
    <path d="M5.5 10.5 l3 3 l6-7" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// GitHub-style file tree. specs/ shows the two newest feature folders; a new
// one lands on top and pushes the oldest out at the bottom.
export const RepoTree: React.FC = () => {
  const c = useColors();
  const p = useProps();
  const {fps} = useVideoConfig();
  const {local, at, s} = useCycle();
  const land = landFrame(s.handoff);
  const shift = spring({frame: local - land, fps, config: {damping: 200}, durationInFrames: 11});

  const latest = (offset: number) => p.features[at(offset)];
  const rowBase: React.CSSProperties = {
    height: R.row,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontFamily: MONO_FONT,
    fontSize: 18,
    color: c.text,
    whiteSpace: 'nowrap',
  };

  const commitRow = (f: (typeof p.features)[number], o: number) => (
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', opacity: o}}>
      {p.logoFile ? (
        <Img src={staticFile(p.logoFile)} style={{width: 24, height: 24, flexShrink: 0}} />
      ) : (
        <div style={{width: 22, height: 22, borderRadius: 11, background: `linear-gradient(135deg, ${c.grad1}, ${c.grad3})`, flexShrink: 0}} />
      )}
      <span style={{color: c.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1}}>{f.id}</span>
      <span style={{color: c.warn}}>{f.commit}</span>
    </div>
  );

  // Children of specs/: feature k (lands now), k-1 and k-2 (pushed out).
  const children = [0, -1, -2].map((off, j) => {
    const row = j - 1 + shift; // k starts above (row -1 → 0)
    const isNew = j === 0;
    const flash = isNew ? interpolate(shift, [0, 0.5, 1], [0, 1, 0]) : 0;
    return (
      <div
        key={`c${at(off)}`}
        style={{
          ...rowBase,
          position: 'absolute',
          left: 0,
          right: 0,
          top: Math.round(row * R.row),
          paddingLeft: 18 + R.childIndent,
          paddingRight: 16,
          opacity: isNew ? shift : 1,
          background: alpha(c.ok, 0.18 * flash),
        }}
      >
        <Folder color={c.srs} />
        <span style={{flex: 1, overflow: 'hidden', textOverflow: 'ellipsis'}}>{latest(off).id}/</span>
        <Check color={c.ok} />
      </div>
    );
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: LAYOUT.repo.x,
        top: LAYOUT.repo.y,
        width: LAYOUT.repo.w,
        background: c.panel,
        border: `1px solid ${c.border}`,
        borderRadius: 14,
        boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        direction: 'ltr',
        paddingBottom: R.pad,
      }}
    >
      <div style={{height: 3, background: gradCss(c)}} />
      <div
        style={{
          height: R.header,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 16px',
          background: c.titleBar,
          borderBottom: `1px solid ${c.border}`,
          fontFamily: MONO_FONT,
          fontSize: 19,
          color: c.text,
        }}
      >
        <svg width={18} height={18} viewBox="0 0 16 16">
          <path
            d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5v-1.5h1.75v-2h-8a1 1 0 0 0-.71 1.71.75.75 0 0 1-1.06 1.06A2.5 2.5 0 0 1 2 11.5zm10.5-1h-8a1 1 0 0 0-1 1v6.71A2.5 2.5 0 0 1 4.5 9h8z"
            fill={c.muted}
          />
        </svg>
        <span style={{fontWeight: 700}}>{p.repoName}</span>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: 15,
            color: c.muted,
            padding: '2px 10px',
            border: `1px solid ${c.border}`,
            borderRadius: 12,
          }}
        >
          main
        </span>
      </div>
      <div
        style={{
          position: 'relative',
          height: R.commit,
          background: alpha(c.srs, 0.05),
          borderBottom: `1px solid ${c.border}`,
          fontFamily: MONO_FONT,
          fontSize: 16,
        }}
      >
        {commitRow(latest(-1), 1 - shift)}
        {commitRow(latest(0), shift)}
      </div>
      <div style={{paddingTop: R.pad}}>
        {p.repoStatic.map((name) => (
          <React.Fragment key={name}>
            <div style={{...rowBase, padding: '0 16px'}}>
              {name.endsWith('/') ? <Folder color={alpha(c.srs, 0.75)} /> : <FileIcon color={c.muted} />}
              <span style={{color: name === SPECS_DIR ? c.text : c.muted, fontWeight: name === SPECS_DIR ? 700 : 400}}>{name}</span>
            </div>
            {name === SPECS_DIR ? <div style={{position: 'relative', height: R.row * 2, overflow: 'hidden'}}>{children}</div> : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export {Check};
