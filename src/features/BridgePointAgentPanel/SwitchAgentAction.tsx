'use client';

import { ActionIcon, DropdownMenu, type DropdownMenuProps } from '@lobehub/ui';
import { Bot } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { agentService } from '@/services/agent';
import { useAgentStore } from '@/store/agent';
import { useHomeStore } from '@/store/home';

import { AGENT_CONFIGS, resolveSystemRole } from './agentConfigs';
import { AGENTS, type BPAgent } from './agentData';

// Module-level cache shared with the main agent panel
const switchCache = new Map<string, string>();

const SwitchAgentAction = memo(() => {
  const navigate = useNavigate();
  const storeCreateAgent = useAgentStore((s) => s.createAgent);
  const refreshAgentList = useHomeStore((s) => s.refreshAgentList);

  const handleAgentSelect = useCallback(
    async (agent: BPAgent) => {
      if (agent.behavior === 'soon') return;

      // Check cache first
      const cached = switchCache.get(agent.id);
      if (cached) {
        navigate(`/agent/${cached}`);
        return;
      }

      // Check DB for existing agent
      try {
        const existingId = await agentService.getAgentByMarketIdentifier(`bp:${agent.id}`);
        if (existingId) {
          switchCache.set(agent.id, existingId);
          navigate(`/agent/${existingId}`);
          return;
        }
      } catch {
        // Fall through to create
      }

      // Create new agent
      const agentConfig = AGENT_CONFIGS[agent.id];
      const systemRole = agentConfig
        ? resolveSystemRole(agentConfig.systemRole)
        : `You are the ${agent.name} for BridgePoint AI. ${agent.description}.`;

      const result = await storeCreateAgent({
        config: {
          description: agent.description,
          marketIdentifier: `bp:${agent.id}`,
          model: agent.model,
          params: { temperature: agent.temperature },
          provider: agent.provider,
          systemRole,
          tags: [agent.category, agent.behavior],
          title: `${agent.emoji} ${agent.name}`,
        },
      });

      if (result.agentId) {
        switchCache.set(agent.id, result.agentId);
        refreshAgentList();
        navigate(`/agent/${result.agentId}`);
      }
    },
    [navigate, storeCreateAgent, refreshAgentList],
  );

  const menuItems: DropdownMenuProps['items'] = useMemo(() => {
    const activeAgents = AGENTS.filter((a) => a.behavior !== 'soon');
    return activeAgents.map((agent) => ({
      icon: <span style={{ fontSize: 14 }}>{agent.emoji}</span>,
      key: agent.id,
      label: agent.name,
      onClick: () => handleAgentSelect(agent),
    }));
  }, [handleAgentSelect]);

  return (
    <DropdownMenu items={menuItems}>
      <ActionIcon icon={Bot} size="small" title="Switch Agent" />
    </DropdownMenu>
  );
});

SwitchAgentAction.displayName = 'SwitchAgentAction';

export default SwitchAgentAction;
