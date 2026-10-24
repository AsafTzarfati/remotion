import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {alpha, escapeRegExp, useColors, useProps} from '../theme';

// Glow strength for a tag that finished appearing at `completeAt`.
export const pulseAmount = (frame: number, completeAt: number) =>
  completeAt === undefined || frame < completeAt
    ? 0
    : interpolate(frame - completeAt, [0, 4, 28], [0, 1, 0], {extrapolateRight: 'clamp'});

export const TagGlow: React.FC<{text: string; amount: number; color?: string; style?: React.CSSProperties}> = ({text, amount, color, style}) => {
  const c = useColors();
  const glow = c.fr;
  return (
    <span
      style={{
        display: 'inline-block',
        color: color ?? c.srs,
        fontWeight: 700,
        borderRadius: 6,
        background: alpha(glow, 0.08 + 0.3 * amount),
        boxShadow: `0 0 ${4 + 26 * amount}px ${alpha(glow, 0.15 + 0.7 * amount)}`,
        textShadow: amount > 0.01 ? `0 0 ${18 * amount}px ${glow}` : undefined,
        transform: `scale(${1 + 0.08 * amount})`,
        ...style,
      }}
    >
      {text}
    </span>
  );
};

// Finds the tag (for example [SRS-042]) inside any text and makes it glow
// starting at frame `pulseAt`.
export const TagPulse: React.FC<{text: string; pulseAt: number; frame?: number; tagColor?: string; tagStyle?: React.CSSProperties}> = ({
  text,
  pulseAt,
  frame,
  tagColor,
  tagStyle,
}) => {
  const {tagId} = useProps();
  const current = useCurrentFrame();
  const f = frame ?? current;
  const parts = text.split(new RegExp(`(\\[?${escapeRegExp(tagId)}\\]?)`, 'g'));
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <TagGlow key={i} text={p} amount={pulseAmount(f, pulseAt)} color={tagColor} style={tagStyle} />
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        ),
      )}
    </>
  );
};
