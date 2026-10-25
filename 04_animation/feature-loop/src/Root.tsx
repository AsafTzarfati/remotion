import {Composition} from 'remotion';
import {FeatureLoop} from './FeatureLoop';
import {defaultFeatureLoopProps, featureLoopSchema} from './props';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="FeatureLoop"
    component={FeatureLoop}
    schema={featureLoopSchema}
    defaultProps={defaultFeatureLoopProps}
    durationInFrames={1800}
    fps={30}
    width={1920}
    height={1080}
    // One cycle per feature: adding a feature makes the video longer.
    calculateMetadata={({props}) => ({durationInFrames: props.features.length * props.timing.cycleFrames})}
  />
);
