'use client';

import { Flexbox } from '@lobehub/ui';
import { cssVar } from 'antd-style';
import { memo, useMemo } from 'react';

import {
  AGENTS,
  BEHAVIOR_COLORS,
  BEHAVIOR_LABELS,
} from '@/features/BridgePointAgentPanel/agentData';
import NavHeader from '@/features/NavHeader';
import { useAgentStore } from '@/store/agent';

import HeaderActions from './HeaderActions';
import ShareButton from './ShareButton';
import Tags from './Tags';

const Header = memo(() => {
  const activeAgentId = useAgentStore((s) => s.activeAgentId);

  const agentMeta = useMemo(() => {
    if (!activeAgentId) return null;
    return AGENTS.find((a) => a.id === activeAgentId) ?? null;
  }, [activeAgentId]);

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

  return (
    <NavHeader
      left={
        <Flexbox
          horizontal
          align="center"
          gap={8}
          style={{ backgroundColor: cssVar.colorBgContainer }}
        >
          <Tags />
          {behaviorTag}
        </Flexbox>
      }
      right={
        <Flexbox horizontal align={'center'} style={{ backgroundColor: cssVar.colorBgContainer }}>
          <ShareButton />
          <HeaderActions />
        </Flexbox>
      }
    />
  );
});

export default Header;
