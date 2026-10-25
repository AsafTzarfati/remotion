import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FeatureLoopProps} from './props';
import {LAYOUT, ThemeContext} from './theme';
import {Background} from './components/Background';
import {TopBar} from './components/Bars';
import {PrincipleTicker} from './components/PrincipleTicker';
import {LoopRing} from './components/LoopRing';
import {SrsStack} from './components/SrsStack';
import {RepoTree} from './components/RepoTree';
import {StageWindows} from './components/StageWindows';
import './fonts';

const {cx, cy} = LAYOUT.ring;

export const FeatureLoop: React.FC<FeatureLoopProps> = (props) =>
  props.ringOnly ? (
    <ThemeContext.Provider value={props}>
      <AbsoluteFill style={{backgroundColor: props.colors.bg, overflow: 'hidden'}}>
        <Background />
        {/* Only the ring: moved to the screen center and enlarged */}
        <AbsoluteFill
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            transform: `translate(${960 - cx}px, ${540 - cy}px) scale(${props.ringScale})`,
          }}
        >
          <LoopRing />
        </AbsoluteFill>
      </AbsoluteFill>
    </ThemeContext.Provider>
  ) : (
  <ThemeContext.Provider value={props}>
    <AbsoluteFill style={{backgroundColor: props.colors.bg, overflow: 'hidden'}}>
      <Background />
      <TopBar />
      <PrincipleTicker />
      <RepoTree />
      <LoopRing />
      <StageWindows />
      <SrsStack />
    </AbsoluteFill>
  </ThemeContext.Provider>
);
