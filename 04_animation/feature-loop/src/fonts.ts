import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
import ranges from './font-ranges.json';

// Fonts are served from public/fonts (downloaded once from Google Fonts, OFL license),
// so rendering does not depend on the network.
export const HEBREW_FONT = 'Rubik';
export const MONO_FONT = 'JetBrains Mono';

const faces = Object.entries(ranges as Record<string, string>).map(([file, unicodeRange]) =>
  loadFont({
    family: file.startsWith('Rubik') ? HEBREW_FONT : MONO_FONT,
    url: staticFile(`fonts/${file}`),
    weight: '100 900',
    unicodeRange,
    display: 'block',
  }),
);

const ready = Promise.all(faces);
export const fontsReady = () => ready;
