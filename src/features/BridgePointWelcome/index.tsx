/**
 * BridgePoint AI — Welcome Screen
 *
 * Shown in the main chat area when no conversation is active.
 * Displays greeting, quick-start cards, and branding.
 */
import { Flexbox } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { memo, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAgentStore } from '@/store/agent';
import { useHomeStore } from '@/store/home';
import { useUserStore } from '@/store/user';
import { userProfileSelectors } from '@/store/user/slices/auth/selectors';

import { AGENT_CONFIGS, resolveSystemRole } from '../BridgePointAgentPanel/agentConfigs';
import { AGENTS } from '../BridgePointAgentPanel/agentData';

const useStyles = createStyles(({ css }) => ({
  card: css`
    cursor: pointer;

    flex: 1;

    padding: 16px;
    border: 1px solid var(--bp-border);
    border-radius: 12px;

    background: var(--bp-card-bg);

    transition: all 0.15s ease;

    &:hover {
      transform: translateY(-2px);
      border-color: var(--bp-border-light);
      background: var(--bp-card-hover);
    }
  `,
  cardDesc: css`
    font-size: 11px;
    line-height: 1.4;
    color: var(--bp-text-muted);
  `,
  cardIcon: css`
    font-size: 20px;
  `,
  cardTitle: css`
    font-size: 14px;
    font-weight: 600;
    color: var(--bp-text-primary);
  `,
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    height: 100%;
    padding: 40px;

    background: var(--bp-chat-bg);
  `,
  logoIcon: css`
    display: flex;
    align-items: center;
    justify-content: center;

    width: 72px;
    height: 72px;
    border-radius: 20px;

    font-size: 36px;
    font-weight: 800;
    color: #fff;

    background: linear-gradient(135deg, #3b82f6, #6366f1);
    box-shadow: 0 4px 20px rgb(59 130 246 / 20%);
  `,
  subtitle: css`
    max-width: 520px;

    font-size: 15px;
    line-height: 1.6;
    color: var(--bp-text-secondary);
    text-align: center;
  `,
  title: css`
    font-size: 24px;
    font-weight: 700;
    color: var(--bp-text-primary);
  `,
}));

const QUICK_STARTS = [
  {
    agentId: 'invoice-po-processor',
    desc: 'Process, validate, and cross-reference invoices against POs',
    icon: '🧾',
    title: "Today's Invoices",
  },
  {
    agentId: 'equipment-troubleshooting',
    desc: 'Diagnose symptoms, find probable causes, and get containment actions',
    icon: '🔧',
    title: 'Equipment Issue',
  },
  {
    agentId: 'meeting-summarizer',
    desc: 'Summarize meeting notes with action items, owners, and deadlines',
    icon: '📝',
    title: 'Meeting Prep',
  },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const BridgePointWelcome = memo(() => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const greeting = useMemo(() => getGreeting(), []);
  const [isCreating, setIsCreating] = useState(false);
  const fullName = useUserStore(userProfileSelectors.fullName);
  const firstName = fullName ? fullName.split(' ')[0] : '';

  const storeCreateAgent = useAgentStore((s) => s.createAgent);
  const refreshAgentList = useHomeStore((s) => s.refreshAgentList);

  const handleQuickStart = useCallback(
    async (bpAgentId: string) => {
      if (isCreating) return;
      const agent = AGENTS.find((a) => a.id === bpAgentId);
      if (!agent) return;

      const agentConfig = AGENT_CONFIGS[agent.id];
      const systemRole = agentConfig
        ? resolveSystemRole(agentConfig.systemRole)
        : `You are the ${agent.name} for BridgePoint AI. ${agent.description}.`;

      setIsCreating(true);
      try {
        const result = await storeCreateAgent({
          config: {
            description: agent.description,
            model: agent.model,
            params: { temperature: agent.temperature },
            provider: agent.provider,
            systemRole,
            tags: [agent.category, agent.behavior],
            title: `${agent.emoji} ${agent.name}`,
          },
        });

        if (result.agentId) {
          refreshAgentList();
          navigate(`/agent/${result.agentId}`);
        }
      } catch (error) {
        console.error('[BridgePoint] Failed to create agent from quick-start:', error);
      } finally {
        setIsCreating(false);
      }
    },
    [isCreating, storeCreateAgent, navigate, refreshAgentList],
  );

  return (
    <div className={styles.container}>
      <Flexbox align="center" gap={20} style={{ maxWidth: 600 }}>
        {/* Logo */}
        <div className={styles.logoIcon}>B</div>

        {/* Greeting */}
        <span className={styles.title}>
          {greeting}
          {firstName ? `, ${firstName}` : ''}
        </span>

        <span className={styles.subtitle}>
          Your manufacturing AI workspace is ready. Select an agent from the panel or start with one
          of today&apos;s priorities.
        </span>

        {/* Quick-start cards */}
        <Flexbox horizontal gap={12} style={{ marginTop: 20, width: '100%' }}>
          {QUICK_STARTS.map((qs) => (
            <div
              className={styles.card}
              key={qs.title}
              role="button"
              tabIndex={0}
              onClick={() => handleQuickStart(qs.agentId)}
            >
              <Flexbox gap={10}>
                <span className={styles.cardIcon}>{qs.icon}</span>
                <span className={styles.cardTitle}>{qs.title}</span>
                <span className={styles.cardDesc}>{qs.desc}</span>
              </Flexbox>
            </div>
          ))}
        </Flexbox>
      </Flexbox>
    </div>
  );
});

export default BridgePointWelcome;
