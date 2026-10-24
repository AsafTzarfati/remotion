import React from 'react';
import {MONO_FONT} from '../fonts';
import {alpha, CODE} from '../theme';

export const CHIP = {padX: 10, padY: 4, border: 2};

export const Chip: React.FC<{label: string; color: string; style?: React.CSSProperties}> = ({label, color, style}) => (
  <div
    style={{
      position: 'absolute',
      fontFamily: MONO_FONT,
      fontSize: CODE.fontSize,
      fontWeight: 700,
      lineHeight: `${CODE.lineHeight - 2 * (CHIP.padY + CHIP.border)}px`,
      padding: `${CHIP.padY}px ${CHIP.padX}px`,
      color,
      background: alpha(color, 0.18),
      border: `${CHIP.border}px solid ${color}`,
      borderRadius: 10,
      boxShadow: `0 0 24px ${alpha(color, 0.55)}`,
      whiteSpace: 'pre',
      direction: 'ltr',
      ...style,
    }}
  >
    {label}
  </div>
);
