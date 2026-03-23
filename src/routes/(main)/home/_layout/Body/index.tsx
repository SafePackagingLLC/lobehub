'use client';

import { SESSION_CHAT_URL } from '@lobechat/const';
import { type SidebarAgentItem } from '@lobechat/types';
import { Flexbox } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { memo, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

import { AGENTS, CATEGORY_COLORS } from '@/features/BridgePointAgentPanel/agentData';
import SkeletonList from '@/features/NavPanel/components/SkeletonList';
import { useFetchAgentList } from '@/hooks/useFetchAgentList';
import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';
import { useHomeStore } from '@/store/home';
import { homeAgentListSelectors } from '@/store/home/selectors';

export enum GroupKey {
  Agent = 'agent',
  Project = 'project',
}

/* ── Styles ── */
const useStyles = createStyles(({ css }) => ({
  active: css`
    border: 1px solid rgb(59 130 246 / 20%);
    background: rgb(59 130 246 / 15%);

    .bp-convo-title {
      color: #fff;
    }
  `,
  convoItem: css`
    cursor: pointer;

    padding-block: 10px;
    padding-inline: 12px;
    border: 1px solid transparent;
    border-radius: 8px;

    transition: all 0.15s ease;

    &:hover {
      background: rgb(255 255 255 / 5%);
    }
  `,
  convoAgentTag: css`
    padding-block: 1px;
    padding-inline: 6px;
    border-radius: 3px;

    font-size: 9px;
    font-weight: 500;
    white-space: nowrap;
  `,
  convoMeta: css`
    display: flex;
    gap: 6px;
    align-items: center;
  `,
  convoTime: css`
    overflow: hidden;

    font-size: 11px;
    color: var(--bp-text-secondary);
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  convoTitle: css`
    overflow: hidden;

    font-size: 13px;
    font-weight: 500;
    color: #d1d5db;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  list: css`
    overflow-y: auto;
    flex: 1;
    padding-block: 4px;
    padding-inline: 8px;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: rgb(255 255 255 / 8%);
    }
  `,
  sectionLabel: css`
    padding-block: 16px 8px;
    padding-inline: 12px;

    font-size: 10px;
    font-weight: 600;
    color: var(--bp-text-secondary);
    text-transform: uppercase;
    letter-spacing: 1.2px;
  `,
}));

/* ── Date grouping helpers ── */
function getDateGroup(date: Date): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Same calendar day
  if (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  ) {
    return 'TODAY';
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  ) {
    return 'YESTERDAY';
  }

  if (diffDays < 7) return 'LAST 7 DAYS';
  return 'OLDER';
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

function groupByDate(items: SidebarAgentItem[]): { group: string; items: SidebarAgentItem[] }[] {
  const groups = new Map<string, SidebarAgentItem[]>();
  const order = ['TODAY', 'YESTERDAY', 'LAST 7 DAYS', 'OLDER'];

  for (const item of items) {
    const group = getDateGroup(item.updatedAt);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push(item);
  }

  return order.filter((g) => groups.has(g)).map((g) => ({ group: g, items: groups.get(g)! }));
}

/* ── Conversation item ── */
const ConvoItem = memo<{ active: boolean; item: SidebarAgentItem }>(({ item, active }) => {
  const { styles, cx } = useStyles();
  const agentUrl = SESSION_CHAT_URL(item.id, false);
  const agentName = item.title || 'New Conversation';
  const timeStr = formatRelativeTime(item.updatedAt);

  const matchedAgent = useMemo(() => {
    if (!item.title) return null;
    return AGENTS.find((a) => item.title!.includes(a.name)) ?? null;
  }, [item.title]);

  const catColor = matchedAgent ? CATEGORY_COLORS[matchedAgent.category] : null;

  return (
    <Link style={{ textDecoration: 'none' }} to={agentUrl}>
      <div className={cx(styles.convoItem, active && styles.active)}>
        <div className={`bp-convo-title ${styles.convoTitle}`}>{agentName}</div>
        <div className={styles.convoMeta}>
          <span className={styles.convoTime}>{timeStr}</span>
          {matchedAgent && catColor && (
            <span
              className={styles.convoAgentTag}
              style={{ background: catColor.bg, color: catColor.text }}
            >
              {matchedAgent.category}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
});

/* ── Body ── */
const Body = memo(() => {
  const { styles } = useStyles();
  const params = useParams<{ aid?: string }>();
  const activeId = params.aid;

  const isInit = useHomeStore(homeAgentListSelectors.isAgentListInit);
  const agentPageSize = useGlobalStore(systemStatusSelectors.agentPageSize);
  const ungroupedAgents = useHomeStore(
    homeAgentListSelectors.ungroupedAgentsLimited(agentPageSize),
    isEqual,
  );
  const pinnedAgents = useHomeStore(homeAgentListSelectors.pinnedAgents, isEqual);

  useFetchAgentList();

  // Merge pinned + ungrouped, sort by updatedAt desc, group by date
  const dateGroups = useMemo(() => {
    const all = [...(pinnedAgents || []), ...(ungroupedAgents || [])];
    // Sort most recent first
    all.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return groupByDate(all);
  }, [pinnedAgents, ungroupedAgents]);

  if (!isInit) {
    return (
      <Flexbox flex={1} paddingInline={4}>
        <SkeletonList rows={6} />
      </Flexbox>
    );
  }

  if (dateGroups.length === 0) {
    return (
      <Flexbox
        align="center"
        flex={1}
        justify="center"
        paddingInline={16}
        style={{ color: 'var(--bp-text-muted)', fontSize: 13, textAlign: 'center' }}
      >
        No conversations yet.
        <br />
        Select an agent to get started.
      </Flexbox>
    );
  }

  return (
    <div className={styles.list}>
      {dateGroups.map(({ group, items }) => (
        <div key={group}>
          <div className={styles.sectionLabel}>{group}</div>
          <Flexbox gap={2}>
            {items.map((item) => (
              <ConvoItem active={item.id === activeId} item={item} key={item.id} />
            ))}
          </Flexbox>
        </div>
      ))}
    </div>
  );
});

export default Body;
