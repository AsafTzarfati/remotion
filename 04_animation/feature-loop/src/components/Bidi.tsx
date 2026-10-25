import React from 'react';

// Wraps Latin and number runs inside Hebrew text in <bdi dir="ltr">,
// so "ב-1 kHz" does not turn into "ב-kHz 1".
const LATIN = /[A-Za-z0-9][A-Za-z0-9 .:%±]*[A-Za-z0-9%]|[A-Za-z0-9]/g;

export const Bidi: React.FC<{text: string}> = ({text}) => {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LATIN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    out.push(
      <bdi key={i} dir="ltr">
        {m[0]}
      </bdi>,
    );
    last = i + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
};
