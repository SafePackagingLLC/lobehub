/**
 * BridgePoint AI — Agent Card component for the right panel
 */
import { Flexbox } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { memo, useCallback, useState } from 'react';

import { BEHAVIOR_COLORS, BEHAVIOR_LABELS, type BPAgent, CATEGORY_COLORS } from './agentData';

/** Quick actions per agent ID (first 2 shown on hover) */
const QUICK_ACTIONS: Record<string, string[]> = {
  'company-intelligence': ['Run Assessment', 'View Insights'],
  'continuous-improvement': ['Start A3', 'Calculate OEE'],
  'cost-budget-analyst': ['Budget Review', 'Cost Breakdown'],
  'due-diligence': ['New Analysis', 'View Reports'],
  'equipment-troubleshooting': ['Report Issue', 'View History'],
  'general-engineering': ['Quick Calc', 'Material Lookup'],
  'executive-brief': ['Morning Brief', 'Meeting Prep'],
  'invoice-po-processor': ['Upload Invoice', 'Batch Process'],
  'maintenance-report': ['New Report', 'Recent Reports'],
  'maintenance-work-order': ['Create WO', 'View Queue'],
  'meeting-summarizer': ['Upload Notes', 'Recent Summaries'],
  'pid-schematic-analyst': ['Upload P&ID', 'Trace Circuit'],
  'quality-compliance': ['Search SOPs', 'Audit Prep'],
  'safety-incident': ['Report Incident', 'Near Miss'],
  'shift-handoff': ['Start Handoff', 'View Recent'],
  'shipping-logistics': ['Check Status', 'At-Risk Orders'],
  'technical-drawing': ['Upload Drawing', 'GD&T Help'],
  'training-tracker': ['Check Certs', 'New Hire'],
};

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
    border-color: rgb(59 130 246 / 40%) !important;
    background: rgb(59 130 246 / 15%) !important;
    box-shadow: 0 4px 20px rgb(59 130 246 / 15%);
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

    padding: 14px;
    padding-inline-start: 15px;
    border: 1px solid var(--bp-border);
    border-radius: 12px;

    background: var(--bp-card-bg);

    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-1px);
      border-color: rgb(59 130 246 / 25%);
      background: var(--bp-card-hover);
      box-shadow: 0 4px 16px rgb(0 0 0 / 20%);

      .bp-accent-bar {
        opacity: 1;
      }

      .bp-quick-actions {
        display: flex;
      }
    }
  `,
  description: css`
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    font-size: 11px;
    line-height: 1.4;
    color: var(--bp-text-muted);
    text-overflow: ellipsis;
  `,
  disabled: css`
    cursor: default;
    opacity: 0.6;

    &:hover {
      transform: none;
      border-color: var(--bp-border);
      background: var(--bp-card-bg);
      box-shadow: none;

      .bp-accent-bar {
        opacity: 0;
      }

      .bp-quick-actions {
        display: none;
      }
    }
  `,
  emoji: css`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    width: 36px;
    height: 36px;
    border-radius: 10px;

    font-size: 16px;
  `,
  name: css`
    overflow: hidden;

    font-size: 13px;
    font-weight: 600;
    line-height: 1.3;
    color: #fff;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  quickAction: css`
    cursor: pointer;

    flex: 1;

    padding-block: 6px;
    padding-inline: 8px;
    border: 1px solid var(--bp-border-light);
    border-radius: 6px;

    font-size: 10px;
    font-weight: 600;
    color: var(--bp-accent-blue);
    text-align: center;

    background: rgb(59 130 246 / 8%);

    transition: all 0.15s;

    &:hover {
      background: rgb(59 130 246 / 15%);
    }
  `,
  quickActions: css`
    display: none;
    gap: 6px;
    margin-block-start: 10px;
  `,
  statusDot: css`
    width: 7px;
    height: 7px;
    border-radius: 50%;

    background: var(--bp-success);
    box-shadow: 0 0 6px rgb(16 185 129 / 40%);
  `,
  statusDotGray: css`
    background: var(--bp-text-muted);
    box-shadow: none;
  `,
  tag: css`
    padding-block: 1px;
    padding-inline: 6px;
    border-radius: 4px;

    font-size: 10px;
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
  const [isHovered, setIsHovered] = useState(false);
  const catColor = CATEGORY_COLORS[agent.category] || {
    bg: 'rgba(107,114,128,0.12)',
    text: '#6B7280',
  };
  const behColor = BEHAVIOR_COLORS[agent.behavior];
  const isSoon = agent.behavior === 'soon';
  const quickActions = QUICK_ACTIONS[agent.id] || [];

  const handleClick = useCallback(() => {
    if (!isSoon && onClick) onClick(agent);
  }, [agent, isSoon, onClick]);

  // Build gradient background for emoji based on category color
  const emojiBg = `linear-gradient(135deg, ${catColor.text}33, ${catColor.text}1a)`;

  return (
    <div
      className={cx(styles.card, active && styles.active, isSoon && styles.disabled)}
      role="button"
      tabIndex={isSoon ? -1 : 0}
      title={isSoon ? 'Coming soon — in development' : agent.name}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`bp-accent-bar ${styles.accentBar}`}
        style={active ? { background: 'var(--bp-accent-blue)', opacity: 1 } : undefined}
      />

      <Flexbox gap={8}>
        {/* Top row: icon + name + description + status dot */}
        <Flexbox horizontal align="flex-start" gap={10}>
          <div className={styles.emoji} style={{ background: emojiBg }}>
            {agent.emoji}
          </div>
          <Flexbox flex={1} gap={2} style={{ minWidth: 0 }}>
            <Flexbox horizontal align="center" gap={6}>
              <div className={styles.name}>{agent.name}</div>
            </Flexbox>
            <div className={styles.description}>{agent.description}</div>
          </Flexbox>
          <div className={cx(styles.statusDot, isSoon && styles.statusDotGray)} />
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

        {/* Quick actions (shown on hover) */}
        {quickActions.length > 0 && (
          <div
            className={`bp-quick-actions ${styles.quickActions}`}
            style={(active || isHovered) && !isSoon ? { display: 'flex' } : undefined}
          >
            {quickActions.slice(0, 2).map((action) => (
              <button
                className={styles.quickAction}
                key={action}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                {action}
              </button>
            ))}
          </div>
        )}
      </Flexbox>
    </div>
  );
});

export default AgentCard;
