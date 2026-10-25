import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FeatureLoopProps} from './props';
import {ThemeContext} from './theme';
import {Background} from './components/Background';
import {TopBar} from './components/Bars';
import {PrincipleTicker} from './components/PrincipleTicker';
import {LoopRing} from './components/LoopRing';
import {SrsStack} from './components/SrsStack';
import {RepoTree} from './components/RepoTree';
import {StageWindows} from './components/StageWindows';
import './fonts';

export const FeatureLoop: React.FC<FeatureLoopProps> = (props) => (
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
