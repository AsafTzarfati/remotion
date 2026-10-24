import React from 'react';
import {Sequence, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {getTimeline} from '../timeline';
import {useProps} from '../theme';

const Sfx: React.FC<{from: number; dur: number; file: string; volume: number; name: string}> = ({from, dur, file, volume, name}) => (
  <Sequence from={Math.round(from)} durationInFrames={Math.max(1, Math.round(dur))} name={name} layout="none">
    <Audio src={staticFile(file)} volume={volume} />
  </Sequence>
);

// Optional: soft key clicks while typing, ticks for checks and pills, whooshes for moves.
export const Sound: React.FC = () => {
  const p = useProps();
  if (!p.sound) return null;
  const tl = getTimeline(p);
  const typing: [number, number][] = [
    [tl.specStart, tl.specEnd],
    [tl.clarifyStart, tl.clarifyEnd],
    [tl.resolvedStart, tl.resolvedEnd],
    [tl.planStart, tl.planEnd],
    [tl.tasksStart, tl.tasksEnd],
    [tl.testCmd, tl.testCmdEnd],
    [tl.commitCmd, tl.commitCmdEnd],
    [tl.grepCmd, tl.grepCmdEnd],
  ];
  const ticks = [
    ...p.tasks.code.split('\n').map((_, i) => tl.check(i)),
    ...p.plan.bannerItems.map((_, i) => tl.banner + 12 + i * 8),
    ...p.chain.pills.map((_, i) => tl.lit(i)),
    tl.passed,
    tl.ccb,
  ];
  const whooshes = [tl.chipLaunch(0) - 2, tl.pan1, tl.pan2, tl.termIn, tl.zoom];
  return (
    <>
      {typing.map(([a, b], i) => (
        <Sfx key={`type${i}`} name="typing" from={a} dur={b - a} file="sfx/typing.wav" volume={0.45} />
      ))}
      {ticks.map((t, i) => (
        <Sfx key={`tick${i}`} name="tick" from={t} dur={4} file="sfx/tick.wav" volume={0.5} />
      ))}
      {whooshes.map((t, i) => (
        <Sfx key={`wh${i}`} name="whoosh" from={t - 3} dur={15} file="sfx/whoosh.wav" volume={0.35} />
      ))}
    </>
  );
};
