import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {Workspace} from '../components/Workspace';
import {FlyingChips} from '../components/FlyingChips';
import {TerminalLayer} from '../components/TerminalLayer';
import {Chain} from '../components/Chain';

type SceneProps = {start: number};

// Blur only while the camera is moving, so text stays sharp the rest of the time.
const PanBlur: React.FC<{start: number; children: React.ReactNode}> = ({children}) => {
  const local = useCurrentFrame();
  return local < 32 ? (
    <CameraMotionBlur samples={8} shutterAngle={180}>
      {children}
    </CameraMotionBlur>
  ) : (
    <>{children}</>
  );
};

export const Scene1Requirement: React.FC<SceneProps> = ({start}) => <Workspace sceneStart={start} />;

export const Scene2Split: React.FC<SceneProps> = ({start}) => (
  <>
    <Workspace sceneStart={start} />
    <FlyingChips sceneStart={start} />
  </>
);

export const Scene3Clarify: React.FC<SceneProps> = ({start}) => <Workspace sceneStart={start} />;

export const Scene4Plan: React.FC<SceneProps> = ({start}) => (
  <PanBlur start={start}>
    <Workspace sceneStart={start} />
  </PanBlur>
);

export const Scene5Tasks: React.FC<SceneProps> = ({start}) => (
  <PanBlur start={start}>
    <Workspace sceneStart={start} />
  </PanBlur>
);

export const Scene6TestCommit: React.FC<SceneProps> = ({start}) => (
  <>
    <Workspace sceneStart={start} />
    <TerminalLayer sceneStart={start} />
  </>
);

export const Scene7Grep: React.FC<SceneProps> = ({start}) => (
  <>
    <Workspace sceneStart={start} />
    <TerminalLayer sceneStart={start} />
    <Chain sceneStart={start} />
  </>
);
