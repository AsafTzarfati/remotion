import {Composition} from 'remotion';
import {TraceChain} from './TraceChain';
import {defaultTraceChainProps, traceChainSchema} from './props';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="TraceChain"
    component={TraceChain}
    schema={traceChainSchema}
    defaultProps={defaultTraceChainProps}
    durationInFrames={1200}
    fps={30}
    width={1920}
    height={1080}
    calculateMetadata={({props}) => ({durationInFrames: props.timing.scenes[8]})}
  />
);
