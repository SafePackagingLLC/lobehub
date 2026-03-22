/**
 * BridgePoint AI — Right-hand Agent Panel (340 px)
 *
 * Renders the full agent panel with search, category filters,
 * grouped agent cards, "Teach Your Workspace" CTA, and stats bar.
 */
import { Flexbox, ScrollShadow } from '@lobehub/ui';
import { Input } from 'antd';
import { createStyles } from 'antd-style';
import { SearchIcon } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';

import AgentCard from './AgentCard';
import { AGENTS, BEHAVIOR_SECTIONS, type BPAgent, FILTER_MAP, FILTER_TABS } from './agentData';

const PANEL_WIDTH = 340;

const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    flex-shrink: 0;

    width: ${PANEL_WIDTH}px;
    height: 100%;
    border-inline-start: 1px solid var(--bp-border);

    background: var(--bp-deep-navy);
  `,
  ctaCard: css`
    cursor: pointer;

    padding: 14px;
    border: 1px dashed var(--bp-border-light);
    border-radius: 10px;

    background: transparent;

    transition: border-color 0.15s;

    &:hover {
      border-color: var(--bp-accent-blue);
    }
  `,
  ctaSubtitle: css`
    font-size: 11px;
    line-height: 1.3;
    color: var(--bp-text-muted);
  `,
  ctaTitle: css`
    font-size: 13px;
    font-weight: 600;
    color: var(--bp-accent-blue);
  `,
  filterActive: css`
    color: #fff !important;
    background: var(--bp-accent-blue) !important;
  `,
  filterTab: css`
    cursor: pointer;

    padding-block: 4px;
    padding-inline: 10px;
    border: none;
    border-radius: 6px;

    font-size: 11px;
    font-weight: 500;
    color: var(--bp-text-secondary);

    background: rgb(202 220 252 / 6%);

    transition: all 0.12s;

    &:hover {
      color: var(--bp-text-primary);
      background: rgb(202 220 252 / 10%);
    }
  `,
  header: css`
    padding-block: 20px 12px;
    padding-inline: 16px;
    border-block-end: 1px solid var(--bp-border);
  `,
  headerCount: css`
    padding-block: 2px;
    padding-inline: 8px;
    border-radius: 6px;

    font-size: 11px;
    font-weight: 600;
    color: var(--bp-accent-blue);

    background: rgb(59 130 246 / 12%);
  `,
  headerTitle: css`
    font-size: 14px;
    font-weight: 700;
    color: var(--bp-text-primary);
  `,
  sectionCount: css`
    font-size: 10px;
    color: var(--bp-text-muted);
  `,
  sectionLabel: css`
    font-size: 11px;
    font-weight: 600;
    color: var(--bp-text-secondary);
  `,
  statLabel: css`
    font-size: 10px;
    color: var(--bp-text-muted);
  `,
  statValue: css`
    font-size: 16px;
    font-weight: 700;
    color: var(--bp-text-primary);
  `,
  statsBar: css`
    display: flex;
    justify-content: space-around;

    padding-block: 14px;
    padding-inline: 16px;
    border-block-start: 1px solid var(--bp-border);
  `,
}));

const BridgePointAgentPanel = memo(() => {
  const { styles, cx } = useStyles();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  const handleAgentClick = useCallback((agent: BPAgent) => {
    setActiveAgent((prev) => (prev === agent.id ? null : agent.id));
  }, []);

  const filteredSections = useMemo(() => {
    const q = search.toLowerCase().trim();
    const catFilter = FILTER_MAP[activeFilter] || [];

    return BEHAVIOR_SECTIONS.map((section) => {
      const agents = section.agents.filter((a) => {
        if (catFilter.length > 0 && !catFilter.includes(a.category)) return false;
        if (q && !a.name.toLowerCase().includes(q) && !a.description.toLowerCase().includes(q))
          return false;
        return true;
      });
      return { ...section, agents };
    }).filter((s) => s.agents.length > 0);
  }, [search, activeFilter]);

  // De-duplicate platform agents from ask-first section
  const deduplicatedSections = useMemo(() => {
    const seen = new Set<string>();
    return filteredSections
      .map((section) => {
        const agents = section.agents.filter((a) => {
          if (seen.has(a.id)) return false;
          seen.add(a.id);
          return true;
        });
        return { ...section, agents };
      })
      .filter((s) => s.agents.length > 0);
  }, [filteredSections]);

  const totalActive = AGENTS.filter((a) => a.behavior !== 'soon').length;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Flexbox horizontal align="center" justify="space-between" style={{ marginBottom: 12 }}>
          <span className={styles.headerTitle}>🤖 Manufacturing Agents</span>
          <span className={styles.headerCount}>{AGENTS.length} Agents</span>
        </Flexbox>

        {/* Search */}
        <Input
          allowClear
          placeholder="Search agents..."
          prefix={<SearchIcon size={14} style={{ color: 'var(--bp-text-muted)' }} />}
          size="small"
          value={search}
          style={{
            background: 'var(--bp-input-bg)',
            borderColor: 'var(--bp-border)',
            borderRadius: 8,
            marginBottom: 10,
          }}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter tabs */}
        <Flexbox horizontal gap={4} style={{ flexWrap: 'wrap' }}>
          {FILTER_TABS.map((tab) => (
            <button
              className={cx(styles.filterTab, activeFilter === tab && styles.filterActive)}
              key={tab}
              onClick={() => setActiveFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </Flexbox>
      </div>

      {/* Agent list */}
      <ScrollShadow size={2} style={{ flex: 1, overflow: 'auto' }}>
        <Flexbox gap={16} padding={16}>
          {deduplicatedSections.map((section) => (
            <Flexbox gap={8} key={section.label}>
              <Flexbox horizontal align="center" gap={6}>
                <span className={styles.sectionLabel}>{section.label}</span>
                <span className={styles.sectionCount}>({section.agents.length})</span>
              </Flexbox>
              {section.agents.map((agent) => (
                <AgentCard
                  active={activeAgent === agent.id}
                  agent={agent}
                  key={agent.id}
                  onClick={handleAgentClick}
                />
              ))}
            </Flexbox>
          ))}
        </Flexbox>
      </ScrollShadow>

      {/* Teach Your Workspace CTA */}
      <div style={{ padding: '0 16px 12px' }}>
        <div
          className={styles.ctaCard}
          role="button"
          tabIndex={0}
          onClick={() => setActiveAgent('company-intelligence')}
        >
          <Flexbox horizontal align="center" gap={10}>
            <span style={{ fontSize: 24 }}>🧠</span>
            <Flexbox gap={2}>
              <span className={styles.ctaTitle}>Teach Your Workspace</span>
              <span className={styles.ctaSubtitle}>
                Share company knowledge to improve all agents
              </span>
            </Flexbox>
          </Flexbox>
        </div>
      </div>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        <Flexbox align="center" gap={2}>
          <span className={styles.statValue}>{totalActive}</span>
          <span className={styles.statLabel}>Active Agents</span>
        </Flexbox>
        <Flexbox align="center" gap={2}>
          <span className={styles.statValue}>—</span>
          <span className={styles.statLabel}>Time Saved</span>
        </Flexbox>
        <Flexbox align="center" gap={2}>
          <span className={styles.statValue}>—</span>
          <span className={styles.statLabel}>AI Cost Today</span>
        </Flexbox>
      </div>
    </div>
  );
});

export default BridgePointAgentPanel;
