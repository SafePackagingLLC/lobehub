/**
 * BridgePoint AI — Agent Card component for the right panel
 */
import { Flexbox } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { memo, useCallback } from 'react';

import { BEHAVIOR_COLORS, BEHAVIOR_LABELS, type BPAgent, CATEGORY_COLORS } from './agentData';

const useStyles = createStyles(({ css }) => ({
  accentBar: css`
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;

    width: 3px;
    border-radius: 0 3px 3px 0;

    opacity: 0;
    background: var(--bp-accent-blue);

    transition: opacity 0.15s ease;
  `,
  active: css`
    border-color: rgb(59 130 246 / 50%) !important;
    box-shadow: 0 0 12px rgb(59 130 246 / 15%);
  `,
  badge: css`
    padding-block: 1px;
    padding-inline: 6px;
    border-radius: 4px;

    font-size: 9px;
    font-weight: 700;
    line-height: 1.4;
    text-transform: uppercase;
  `,
  card: css`
    cursor: pointer;

    position: relative;

    overflow: hidden;

    padding: 12px;
    padding-inline-start: 15px;
    border: 1px solid var(--bp-border);
    border-radius: 12px;

    background: var(--bp-card-bg);

    transition: all 0.15s ease;

    &:hover {
      transform: translateY(-1px);
      border-color: var(--bp-border-light);
      background: var(--bp-card-hover);

      .bp-accent-bar {
        opacity: 1;
      }
    }
  `,
  description: css`
    overflow: hidden;

    font-size: 10px;
    line-height: 1.3;
    color: var(--bp-text-muted);
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  disabled: css`
    cursor: default;
    opacity: 0.6;

    &:hover {
      transform: none;
      border-color: var(--bp-border);
      background: var(--bp-card-bg);

      .bp-accent-bar {
        opacity: 0;
      }
    }
  `,
  emoji: css`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    width: 34px;
    height: 34px;
    border-radius: 8px;

    font-size: 18px;

    background: linear-gradient(135deg, rgb(59 130 246 / 15%), rgb(99 102 241 / 15%));
  `,
  name: css`
    overflow: hidden;

    font-size: 12px;
    font-weight: 600;
    line-height: 1.3;
    color: var(--bp-text-primary);
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  tag: css`
    padding-block: 1px;
    padding-inline: 6px;
    border-radius: 4px;

    font-size: 9px;
    font-weight: 600;
    line-height: 1.4;
  `,
}));

interface AgentCardProps {
  active?: boolean;
  agent: BPAgent;
  onClick?: (agent: BPAgent) => void;
}

const AgentCard = memo<AgentCardProps>(({ agent, active, onClick }) => {
  const { styles, cx } = useStyles();
  const catColor = CATEGORY_COLORS[agent.category] || {
    bg: 'rgba(107,114,128,0.12)',
    text: '#6B7280',
  };
  const behColor = BEHAVIOR_COLORS[agent.behavior];
  const isSoon = agent.behavior === 'soon';

  const handleClick = useCallback(() => {
    if (!isSoon && onClick) onClick(agent);
  }, [agent, isSoon, onClick]);

  return (
    <div
      className={cx(styles.card, active && styles.active, isSoon && styles.disabled)}
      role="button"
      tabIndex={isSoon ? -1 : 0}
      title={isSoon ? 'Coming soon — in development' : agent.name}
      onClick={handleClick}
    >
      <div
        className={`bp-accent-bar ${styles.accentBar}`}
        style={active ? { opacity: 1 } : undefined}
      />

      <Flexbox gap={8}>
        {/* Top row: icon + name + description */}
        <Flexbox horizontal align="center" gap={10}>
          <div className={styles.emoji}>{agent.emoji}</div>
          <Flexbox flex={1} gap={2} style={{ overflow: 'hidden' }}>
            <div className={styles.name}>{agent.name}</div>
            <div className={styles.description}>{agent.description}</div>
          </Flexbox>
        </Flexbox>

        {/* Bottom row: category tag + behavior badge */}
        <Flexbox horizontal align="center" gap={6}>
          <span className={styles.tag} style={{ background: catColor.bg, color: catColor.text }}>
            {agent.category}
          </span>
          <span className={styles.badge} style={{ background: behColor.bg, color: behColor.text }}>
            {BEHAVIOR_LABELS[agent.behavior]}
          </span>
        </Flexbox>
      </Flexbox>
    </div>
  );
});

export default AgentCard;
