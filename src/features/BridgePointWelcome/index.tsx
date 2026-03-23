/**
 * BridgePoint AI — Welcome Screen
 *
 * Shown in the main chat area when no conversation is active.
 * Displays greeting, quick-start cards, branding, and a chat input bar.
 */
import { Flexbox } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { ArrowUp } from 'lucide-react';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { agentService } from '@/services/agent';
import { useAgentStore } from '@/store/agent';
import { useHomeStore } from '@/store/home';
import { useUserStore } from '@/store/user';
import { userProfileSelectors } from '@/store/user/slices/auth/selectors';

import {
  AGENT_CONFIGS,
  AGENT_OPENINGS,
  resolveSystemRole,
} from '../BridgePointAgentPanel/agentConfigs';
import { AGENTS } from '../BridgePointAgentPanel/agentData';
import { BP_PENDING_MESSAGE_KEY } from './pendingMessage';

const DEFAULT_AGENT_ID = 'general-engineering';

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
  inputContainer: css`
    position: relative;
    width: 100%;
    margin-block-start: 28px;
  `,
  inputSendBtn: css`
    cursor: pointer;

    position: absolute;
    inset-block-end: 10px;
    inset-inline-end: 10px;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 32px;
    height: 32px;
    border: none;
    border-radius: 10px;

    color: #fff;

    background: var(--bp-accent-blue);

    transition: background 0.15s;

    &:hover {
      background: var(--bp-accent-hover);
    }

    &:disabled {
      cursor: default;
      opacity: 0.4;
    }
  `,
  inputTextarea: css`
    resize: none;

    width: 100%;
    min-height: 52px;
    max-height: 160px;
    padding-block: 14px;
    padding-inline: 16px 52px;
    border: 1px solid var(--bp-border-light);
    border-radius: 14px;

    font-family: inherit;
    font-size: 14px;
    line-height: 1.5;
    color: var(--bp-text-primary);

    background: var(--bp-card-bg);
    backdrop-filter: blur(12px);

    transition: border-color 0.15s;

    &::placeholder {
      color: var(--bp-text-muted);
    }

    &:focus {
      border-color: var(--bp-accent-blue);
      outline: none;
    }
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

// Module-level cache for the default agent's LobeChat ID
const defaultAgentCache = new Map<string, string>();

const BridgePointWelcome = memo(() => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const greeting = useMemo(() => getGreeting(), []);
  const [isCreating, setIsCreating] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fullName = useUserStore(userProfileSelectors.fullName);
  const firstName = fullName ? fullName.split(' ')[0] : '';

  const storeCreateAgent = useAgentStore((s) => s.createAgent);
  const refreshAgentList = useHomeStore((s) => s.refreshAgentList);

  /** Create or find a BridgePoint agent by its BP ID and navigate to it */
  const createAndNavigate = useCallback(
    async (bpAgentId: string, pendingMessage?: string) => {
      if (isCreating) return;
      const agent = AGENTS.find((a) => a.id === bpAgentId);
      if (!agent) return;

      setIsCreating(true);
      try {
        // Check caches first
        const marketId = `bp:${agent.id}`;
        const cachedId = defaultAgentCache.get(agent.id);
        if (cachedId) {
          if (pendingMessage) sessionStorage.setItem(BP_PENDING_MESSAGE_KEY, pendingMessage);
          useAgentStore.setState({ activeAgentId: cachedId });
          navigate(`/agent/${cachedId}`);
          return;
        }

        const existingId = await agentService.getAgentByMarketIdentifier(marketId);
        if (existingId) {
          defaultAgentCache.set(agent.id, existingId);
          if (pendingMessage) sessionStorage.setItem(BP_PENDING_MESSAGE_KEY, pendingMessage);
          useAgentStore.setState({ activeAgentId: existingId });
          navigate(`/agent/${existingId}`);
          return;
        }

        // Create new agent
        const agentConfig = AGENT_CONFIGS[agent.id];
        const systemRole = agentConfig
          ? resolveSystemRole(agentConfig.systemRole)
          : `You are the ${agent.name} for BridgePoint AI. ${agent.description}.`;

        const openings = AGENT_OPENINGS[agent.id];
        const result = await storeCreateAgent({
          config: {
            description: agent.description,
            marketIdentifier: marketId,
            model: agent.model,
            openingMessage: openings?.openingMessage,
            openingQuestions: openings?.openingQuestions,
            params: { temperature: agent.temperature },
            provider: agent.provider,
            systemRole,
            tags: [agent.category, agent.behavior],
            title: `${agent.emoji} ${agent.name}`,
          },
        });

        if (result.agentId) {
          defaultAgentCache.set(agent.id, result.agentId);
          if (pendingMessage) sessionStorage.setItem(BP_PENDING_MESSAGE_KEY, pendingMessage);
          useAgentStore.setState({ activeAgentId: result.agentId });
          refreshAgentList();
          navigate(`/agent/${result.agentId}`);
        }
      } catch (error) {
        console.error('[BridgePoint] Failed to create agent:', error);
      } finally {
        setIsCreating(false);
      }
    },
    [isCreating, storeCreateAgent, navigate, refreshAgentList],
  );

  const handleInputSubmit = useCallback(() => {
    const message = inputValue.trim();
    if (!message || isCreating) return;
    setInputValue('');
    createAndNavigate(DEFAULT_AGENT_ID, message);
  }, [inputValue, isCreating, createAndNavigate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleInputSubmit();
      }
    },
    [handleInputSubmit],
  );

  return (
    <div className={styles.container}>
      <Flexbox align="center" gap={20} style={{ maxWidth: 600, width: '100%' }}>
        {/* Logo */}
        <div className={styles.logoIcon}>B</div>

        {/* Greeting */}
        <span className={styles.title}>
          {greeting}
          {firstName ? `, ${firstName}` : ''}
        </span>

        <span className={styles.subtitle}>
          Your manufacturing AI workspace is ready. Ask anything below or select an agent from the
          panel.
        </span>

        {/* Chat input */}
        <div className={styles.inputContainer}>
          <textarea
            className={styles.inputTextarea}
            placeholder="Describe your issue, upload a document, or ask a question..."
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className={styles.inputSendBtn}
            disabled={!inputValue.trim() || isCreating}
            onClick={handleInputSubmit}
          >
            <ArrowUp size={18} />
          </button>
        </div>

        {/* Quick-start cards */}
        <Flexbox horizontal gap={12} style={{ marginTop: 8, width: '100%' }}>
          {QUICK_STARTS.map((qs) => (
            <div
              className={styles.card}
              key={qs.title}
              role="button"
              tabIndex={0}
              onClick={() => createAndNavigate(qs.agentId)}
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
