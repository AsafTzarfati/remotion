import {z} from 'zod';
import {zColor} from '@remotion/zod-types';

// All content, colors and timing. Add a feature to `features` and the video
// gets longer by one cycle on its own (see calculateMetadata in Root.tsx).
const featureSchema = z.object({
  id: z.string(), // spec folder name, e.g. 001-imu-sampling
  srs: z.string(), // requirement id on the card
  title: z.string(), // Hebrew text on the card
  fr: z.string(), // functional requirement id typed in spec.md
  clarifyQ: z.string(),
  planLines: z.array(z.string()).length(2),
  tasks: z.array(z.string()).length(3),
  code: z.array(z.string()),
  commit: z.string(),
});

export const featureLoopSchema = z.object({
  colors: z.object({
    bg: zColor(),
    panel: zColor(),
    titleBar: zColor(),
    border: zColor(),
    text: zColor(),
    muted: zColor(),
    srs: zColor(),
    ok: zColor(),
    warn: zColor(),
    // Spec Kit gradient: pink → purple → blue
    grad1: zColor(),
    grad2: zColor(),
    grad3: zColor(),
    ringIdle: zColor(), // ring color between features
  }),
  topRight: z.string(),
  eventName: z.string(),
  eventDate: z.string(),
  srsLabel: z.string(),
  repoName: z.string(),
  repoStatic: z.array(z.string()), // fixed rows around specs/
  logoText: z.string(),
  logoFile: z.string(), // image in public/, empty = drawn placeholder
  needsLabel: z.string(),
  resolvedLabel: z.string(),
  constitutionLabel: z.string(),
  consistentLabel: z.string(),
  testsLabel: z.string(),
  stations: z.array(z.string()).length(6),
  principles: z.array(z.string()).min(1),
  features: z.array(featureSchema).min(3),
  timing: z.object({
    cycleFrames: z.number(),
    // Stage starts inside a cycle: specify, clarify, plan, tasks, analyze, implement, handoff
    stageStarts: z.array(z.number()).length(7),
    typeSpeed: z.number(), // chars per frame
    dotMoveFrames: z.number(),
    principleFade: z.number(),
  }),
});

export type FeatureLoopProps = z.infer<typeof featureLoopSchema>;
export type Feature = z.infer<typeof featureSchema>;

export const defaultFeatureLoopProps: FeatureLoopProps = {
  colors: {
    bg: '#0D1117',
    panel: '#161B22',
    titleBar: '#0D1117',
    border: '#30363D',
    text: '#E6EDF3',
    muted: '#8B949E',
    srs: '#79C0FF',
    ok: '#A6E15A', // Spec Kit sprout green
    warn: '#E3B341',
    grad1: '#FF3EA5',
    grad2: '#A020F0',
    grad3: '#2B2FD6',
    ringIdle: '#2C2A3F',
  },
  topRight: 'Spec-Driven Development',
  eventName: '[שם האירוע]',
  eventDate: '[תאריך]',
  srsLabel: 'SRS',
  repoName: 'firmware',
  repoStatic: ['.specify/', 'src/', 'specs/', 'README.md'],
  logoText: 'Spec Kit',
  logoFile: 'speckit-logo.png', // official logo from github/spec-kit (media/logo_large.webp)
  needsLabel: 'NEEDS CLARIFICATION',
  resolvedLabel: 'resolved',
  constitutionLabel: 'Constitution ✓',
  consistentLabel: '✓ consistent',
  testsLabel: 'tests ✓',
  stations: ['specify', 'clarify', 'plan', 'tasks', 'analyze', 'implement'],
  principles: [
    'המפרט הוא מקור האמת.',
    'עמימות מסומנת – לא מנוחשת.',
    'הסוכן מייצר, המהנדס מאשר.',
    'כל שורת קוד מובילה לדרישה.',
    'Constitution אחד, לכל הפיצ\'רים.',
    'ה-SRS נשאר המאסטר.',
  ],
  // Values are illustrative only, as in the slides.
  features: [
    {
      id: '001-imu-sampling',
      srs: 'SRS-042',
      title: 'דגימת IMU ב-1 kHz',
      fr: 'FR-001',
      clarifyQ: 'consumer misses deadline?',
      planLines: ['IMU over SPI, DMA burst read', '1 ms timer ISR → ring buffer'],
      tasks: ['T001 SPI + DMA driver', 'T002 1 kHz timer ISR', 'T003 jitter test'],
      code: ['void imu_isr(void) {', '  dma_read(&imu, buf);', '  ring_push(&q, buf);', '}  // FR-001 [SRS-042]'],
      commit: 'a1b2c3d',
    },
    {
      id: '002-watchdog-timer',
      srs: 'SRS-051',
      title: 'איפוס Watchdog תוך 100 ms',
      fr: 'FR-001',
      clarifyQ: 'reset on brown-out?',
      planLines: ['HW watchdog, 100 ms window', 'kick from main loop only'],
      tasks: ['T001 WDT init 100 ms', 'T002 kick in main loop', 'T003 hang → reset test'],
      code: ['void wdt_init(void) {', '  WDT->TIMEOUT = MS(100);', '  WDT->CTRL |= WDT_EN;', '}  // FR-001 [SRS-051]'],
      commit: '4e5f6a7',
    },
    {
      id: '003-can-telemetry',
      srs: 'SRS-067',
      title: 'שידור טלמטריה ב-CAN כל 10 ms',
      fr: 'FR-001',
      clarifyQ: 'bus-off recovery?',
      planLines: ['CAN 500 kbit/s, ID 0x120', '10 ms tick → TX mailbox'],
      tasks: ['T001 CAN init 500k', 'T002 pack telemetry frame', 'T003 10 ms period test'],
      code: ['void telem_tick(void) {', '  pack(&frame, &state);', '  can_send(0x120, &frame);', '}  // FR-001 [SRS-067]'],
      commit: '9c8d7e2',
    },
  ],
  timing: {
    cycleFrames: 600,
    stageStarts: [60, 150, 210, 300, 360, 420, 540],
    typeSpeed: 2,
    dotMoveFrames: 18,
    principleFade: 12,
  },
};
