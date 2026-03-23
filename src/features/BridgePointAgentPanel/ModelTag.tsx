'use client';

import { createStyles } from 'antd-style';
import { memo, useMemo } from 'react';

import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/selectors/selectors';

import { AGENTS } from './agentData';

const MODEL_DISPLAY: Record<string, string> = {
  'anthropic/claude-haiku-4': 'Claude Haiku',
  'anthropic/claude-sonnet-4': 'Claude Sonnet',
  'google/gemini-2.0-flash': 'Gemini Flash',
};

const useStyles = createStyles(({ css }) => ({
  dot: css`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--bp-success);
  `,
  root: css`
    display: flex;
    gap: 6px;
    align-items: center;

    padding-block: 4px;
    padding-inline: 10px;
    border-radius: 6px;

    font-size: 11px;
    color: var(--bp-text-secondary);

    background: rgb(255 255 255 / 4%);
  `,
}));

const ModelTag = memo(() => {
  const { styles } = useStyles();
  const agentTitle = useAgentStore(agentSelectors.currentAgentTitle);

  const displayText = useMemo(() => {
    if (!agentTitle) return null;
    const matched = AGENTS.find((a) => agentTitle.includes(a.name));
    if (!matched) return null;
    const modelName = MODEL_DISPLAY[matched.model] || matched.model;
    return modelName;
  }, [agentTitle]);

  if (!displayText) return null;

  return (
    <div className={styles.root}>
      <div className={styles.dot} />
      <span>{displayText}</span>
    </div>
  );
});

ModelTag.displayName = 'ModelTag';

export default ModelTag;
