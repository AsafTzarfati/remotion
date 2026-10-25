import {useCurrentFrame} from 'remotion';
import {useProps} from './theme';

export const mod = (n: number, m: number) => ((n % m) + m) % m;

// Which feature is in the machine right now, and the frame inside its cycle.
export const useCycle = () => {
  const frame = useCurrentFrame();
  const p = useProps();
  const n = p.features.length;
  const len = p.timing.cycleFrames;
  const k = Math.floor(frame / len) % n;
  const local = frame % len;
  const [specify, clarify, plan, tasks, analyze, implement, handoff] = p.timing.stageStarts;
  return {
    frame,
    local,
    k,
    n,
    len,
    feature: p.features[k],
    at: (offset: number) => mod(k + offset, n),
    s: {specify, clarify, plan, tasks, analyze, implement, handoff},
  };
};
