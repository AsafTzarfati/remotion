import {TraceChainProps} from './props';

const dur = (text: string, cps: number) => Math.ceil(text.length / cps);

// All absolute frames derived from props, shared by visuals and sound.
export const getTimeline = (p: TraceChainProps) => {
  const t = p.timing;
  const [s0, s1, s2, s3, s4, s5, s6, s7, end] = t.scenes;
  const cps = t.typeSpeed;
  const term = p.terminal;

  const specStart = s2 + 72;
  const clarifyStart = s3 + 4;
  const resolvedStart = t.strikeFrame + 10;
  const resolvedCps = cps * 1.5;
  const planStart = s4 + 34;
  const tasksStart = s5 + 34;

  const testCmd = s6 + 26;
  const testOut = testCmd + dur(term.testCommand, cps) + 8;
  const passed = testOut + 20;
  const stats = passed + 8;
  const commitCmd = stats + 10;
  const commitCps = cps * 1.25;
  const commitOut = commitCmd + dur(term.commitCommand, commitCps) + 6;
  const hashMark = commitOut + 6;

  const grepCmd = s7 + 6;
  const grepOut = grepCmd + dur(term.grepCommand, cps) + 8;
  const grepInterval = 9;
  const zoom = s7 + 80;
  const litStart = zoom + 16;

  return {
    s0, s1, s2, s3, s4, s5, s6, s7, end, cps,
    wordsStart: s1 + 24,
    framesPerWord: 3,
    cardShrink: s2,
    specOpen: s2 + 26,
    chipLaunch: (i: number) => s2 + 34 + i * 8,
    specStart,
    specEnd: specStart + dur(p.spec.code, cps),
    clarifyStart,
    clarifyEnd: clarifyStart + dur(p.spec.clarify, cps),
    ccb: t.ccbFrame,
    strike: t.strikeFrame,
    resolvedStart,
    resolvedCps,
    resolvedEnd: resolvedStart + dur(p.spec.resolved, resolvedCps),
    pan1: s4,
    planOpen: s4 + 14,
    planStart,
    planEnd: planStart + dur(p.plan.code, cps),
    banner: t.bannerFrame,
    pan2: s5,
    tasksOpen: s5 + 14,
    tasksStart,
    tasksEnd: tasksStart + dur(p.tasks.code, cps),
    check: (i: number) => t.checkStartFrame + i * t.checkInterval,
    termIn: s6,
    testCmd,
    testCmdEnd: testCmd + dur(term.testCommand, cps),
    testOut,
    passed,
    stats,
    commitCmd,
    commitCps,
    commitCmdEnd: commitCmd + dur(term.commitCommand, commitCps),
    commitOut,
    hashMark,
    grepCmd,
    grepCmdEnd: grepCmd + dur(term.grepCommand, cps),
    grepOut,
    grepInterval,
    zoom,
    pillAppear: (i: number) => zoom + 8 + i * 4,
    lit: (i: number) => litStart + i * t.pillInterval,
    caption: t.captionFrame,
    fade: t.fadeOutFrame,
  };
};

export type Timeline = ReturnType<typeof getTimeline>;
