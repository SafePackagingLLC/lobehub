'use client';

import { Flexbox } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { Paperclip, Settings2, Share2 } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AGENTS,
  BEHAVIOR_COLORS,
  BEHAVIOR_LABELS,
  CATEGORY_COLORS,
} from '@/features/BridgePointAgentPanel/agentData';
import NavHeader from '@/features/NavHeader';
import { useShareModal } from '@/features/ShareModal';
import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/selectors/selectors';

import HeaderActions from './HeaderActions';
import Tags from './Tags';

const useStyles = createStyles(({ css }) => ({
  agentIcon: css`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    width: 34px;
    height: 34px;
    border-radius: 10px;

    font-size: 16px;
  `,
  agentName: css`
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  `,
  categoryTag: css`
    padding-block: 2px;
    padding-inline: 8px;
    border-radius: 4px;

    font-size: 10px;
    font-weight: 500;
    white-space: nowrap;
  `,
  headerBtn: css`
    cursor: pointer;

    display: flex;
    gap: 4px;
    align-items: center;

    padding-block: 6px;
    padding-inline: 12px;
    border: 1px solid var(--bp-border-light);
    border-radius: 8px;

    font-size: 12px;
    color: var(--bp-text-secondary);

    background: transparent;

    transition: all 0.15s;

    &:hover {
      color: #fff;
      background: rgb(255 255 255 / 5%);
    }
  `,
  statusDot: css`
    width: 6px;
    height: 6px;
    border-radius: 50%;

    background: var(--bp-success);

    animation: bp-pulse 2s infinite;

    @keyframes bp-pulse {
      0%,
      100% {
        opacity: 1;
      }

      50% {
        opacity: 0.4;
      }
    }
  `,
  statusText: css`
    font-size: 11px;
    color: var(--bp-success);
  `,
}));

const Header = memo(() => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const agentTitle = useAgentStore(agentSelectors.currentAgentTitle);
  const activeAgentId = useAgentStore((s) => s.activeAgentId);
  const { openShareModal } = useShareModal();

  // Match BridgePoint agent by title — LobeChat agent titles are like "🔧 Equipment Troubleshooting"
  const agentMeta = useMemo(() => {
    if (!agentTitle) return null;
    return AGENTS.find((a) => agentTitle.includes(a.name)) ?? null;
  }, [agentTitle]);

  const behaviorTag = useMemo(() => {
    if (!agentMeta) return null;
    const colors = BEHAVIOR_COLORS[agentMeta.behavior];
    const label = BEHAVIOR_LABELS[agentMeta.behavior];
    return (
      <span
        style={{
          background: colors.bg,
          borderRadius: 4,
          color: colors.text,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: 0.5,
          padding: '2px 8px',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    );
  }, [agentMeta]);

  const categoryTag = useMemo(() => {
    if (!agentMeta) return null;
    const catColor = CATEGORY_COLORS[agentMeta.category];
    if (!catColor) return null;
    return (
      <span
        className={styles.categoryTag}
        style={{
          background: catColor.bg,
          color: catColor.text,
        }}
      >
        {agentMeta.category}
      </span>
    );
  }, [agentMeta, styles.categoryTag]);

  const agentIcon = useMemo(() => {
    if (!agentMeta) return null;
    const catColor = CATEGORY_COLORS[agentMeta.category];
    const bg = catColor
      ? `linear-gradient(135deg, ${catColor.text}, ${catColor.text}88)`
      : 'linear-gradient(135deg, #3B82F6, #6366F1)';
    return (
      <div className={styles.agentIcon} style={{ background: bg }}>
        {agentMeta.emoji}
      </div>
    );
  }, [agentMeta, styles.agentIcon]);

  const handleSettings = useCallback(() => {
    if (activeAgentId) navigate(`/agent/${activeAgentId}/setting`);
  }, [activeAgentId, navigate]);

  const handleExport = useCallback(() => {
    openShareModal();
  }, [openShareModal]);

  return (
    <NavHeader
      left={
        <Flexbox horizontal align="center" gap={10}>
          {agentIcon}
          <Flexbox gap={2}>
            <Flexbox horizontal align="center" gap={8}>
              {agentMeta && <span className={styles.agentName}>{agentMeta.name}</span>}
              {!agentMeta && <Tags />}
              {behaviorTag}
              {categoryTag}
            </Flexbox>
            {agentMeta && (
              <Flexbox horizontal align="center" gap={4}>
                <div className={styles.statusDot} />
                <span className={styles.statusText}>Online · Ready</span>
              </Flexbox>
            )}
          </Flexbox>
        </Flexbox>
      }
      right={
        <Flexbox horizontal align="center" gap={8}>
          <button className={styles.headerBtn}>
            <Paperclip size={12} />
            Attach
          </button>
          <button className={styles.headerBtn} onClick={handleSettings}>
            <Settings2 size={12} />
            Settings
          </button>
          <button className={styles.headerBtn} onClick={handleExport}>
            <Share2 size={12} />
            Export
          </button>
          <HeaderActions />
        </Flexbox>
      }
      style={{
        backdropFilter: 'blur(12px)',
        background: 'rgba(17, 24, 39, 0.8)',
        borderBottom: '1px solid var(--bp-border)',
        height: 56,
        padding: '14px 24px',
      }}
    />
  );
});

export default Header;
