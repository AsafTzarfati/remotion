import React from 'react';
import {escapeRegExp} from '../theme';
import {TraceChainProps} from '../props';

export type Token = {text: string; style?: React.CSSProperties; tag?: boolean};
export type Highlighter = (line: string, lineIndex: number) => Token[];

// Default code coloring: tag, FR ids, task ids, markdown headings, PASSED, prompts.
export const makeHighlighter = (props: TraceChainProps, extra?: {hash?: string}): Highlighter => {
  const c = props.colors;
  const tag = escapeRegExp(props.tagId);
  const hash = extra?.hash ? `|(?<hash>${escapeRegExp(extra.hash)})` : '';
  const re = new RegExp(
    `(?<tag>\\[?${tag}\\]?)|(?<fr>FR-\\d{3})|(?<task>T\\d{3})|(?<head>^#{2,3})|(?<must>MUST)|(?<passed>PASSED)|(?<prompt>^\\$)|(?<box>\\[[ x]\\])|(?<needs>NEEDS CLARIFICATION)${hash}`,
    'g',
  );
  return (line) => {
    const tokens: Token[] = [];
    const heading = /^#{2,3}/.test(line);
    const base: React.CSSProperties | undefined = heading ? {fontWeight: 700, color: c.text} : undefined;
    let last = 0;
    for (const m of line.matchAll(re)) {
      const idx = m.index ?? 0;
      if (idx > last) tokens.push({text: line.slice(last, idx), style: base});
      const g = m.groups ?? {};
      const text = m[0];
      if (g.tag) tokens.push({text, tag: true});
      else if (g.fr) tokens.push({text, style: {color: c.fr, fontWeight: 700}});
      else if (g.task) tokens.push({text, style: {color: c.tasks, fontWeight: 700}});
      else if (g.head) tokens.push({text, style: {color: c.muted}});
      else if (g.must) tokens.push({text, style: {color: c.text, fontWeight: 700}});
      else if (g.passed) tokens.push({text, style: {color: c.test, fontWeight: 700}});
      else if (g.prompt) tokens.push({text, style: {color: c.ok, fontWeight: 700}});
      else if (g.box) tokens.push({text, style: {color: c.muted}});
      else if (g.needs) tokens.push({text, style: {fontWeight: 700}});
      else if (g.hash) tokens.push({text, style: {color: c.commit, fontWeight: 700}});
      last = idx + text.length;
    }
    if (last < line.length) tokens.push({text: line.slice(last), style: base});
    return tokens;
  };
};
