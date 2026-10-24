import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {TraceChainProps} from './props';
import {ThemeContext} from './theme';
import {Background} from './components/Background';
import {Header} from './components/Header';
import {Sound} from './components/Sound';
import {
  Scene1Requirement,
  Scene2Split,
  Scene3Clarify,
  Scene4Plan,
  Scene5Tasks,
  Scene6TestCommit,
  Scene7Grep,
} from './scenes/Scenes';
import './fonts';

const SCENES = [
  {name: '1 · הדרישה', C: Scene1Requirement},
  {name: '2 · פיצול ל-spec.md', C: Scene2Split},
  {name: '3 · clarify', C: Scene3Clarify},
  {name: '4 · plan.md', C: Scene4Plan},
  {name: '5 · tasks.md', C: Scene5Tasks},
  {name: '6 · בדיקה ו-commit', C: Scene6TestCommit},
  {name: '7 · grep ושרשרת', C: Scene7Grep},
];

const FadeToBlack: React.FC<{from: number; to: number}> = ({from, to}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{background: '#000', opacity: interpolate(f, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}
    />
  );
};

export const TraceChain: React.FC<TraceChainProps> = (props) => {
  const s = props.timing.scenes;
  return (
    <ThemeContext.Provider value={props}>
      <AbsoluteFill style={{backgroundColor: props.colors.bg, overflow: 'hidden'}}>
        <Background />
        {SCENES.map(({name, C}, i) => (
          <Sequence key={name} name={name} from={s[i + 1]} durationInFrames={s[i + 2] - s[i + 1]}>
            <C start={s[i + 1]} />
          </Sequence>
        ))}
        {/* Scene 0 builds the title; it then stays docked as the slide header. */}
        <Sequence name="0 · פתיחה">
          <Header />
        </Sequence>
        <FadeToBlack from={props.timing.fadeOutFrame} to={s[8] - 1} />
        <Sound />
      </AbsoluteFill>
    </ThemeContext.Provider>
  );
};
