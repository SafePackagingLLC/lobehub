/**
 * BridgePoint AI — Welcome Screen
 *
 * Shown in the main chat area when no conversation is active.
 * Displays greeting, quick-start cards, and branding.
 */
import { Flexbox } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { memo, useMemo } from 'react';

const useStyles = createStyles(({ css }) => ({
  card: css`
    cursor: pointer;

    flex: 1;

    padding: 20px;
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
    font-size: 12px;
    line-height: 1.4;
    color: var(--bp-text-muted);
  `,
  cardIcon: css`
    font-size: 28px;
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
    border-radius: 18px;

    font-size: 36px;
    font-weight: 800;
    color: #fff;

    background: linear-gradient(135deg, #3b82f6, #6366f1);
  `,
  subtitle: css`
    max-width: 520px;

    font-size: 14px;
    line-height: 1.6;
    color: var(--bp-text-secondary);
    text-align: center;
  `,
  title: css`
    font-size: 28px;
    font-weight: 700;
    color: var(--bp-text-primary);
  `,
}));

const QUICK_STARTS = [
  {
    desc: 'Diagnose a problem with guided troubleshooting steps',
    icon: '🔧',
    title: 'Equipment Issue',
  },
  {
    desc: 'Process a batch of invoices or purchase orders',
    icon: '🧾',
    title: 'Invoice Batch',
  },
  {
    desc: 'Prepare a summary brief for your next meeting',
    icon: '📋',
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
  const greeting = useMemo(() => getGreeting(), []);

  return (
    <div className={styles.container}>
      <Flexbox align="center" gap={20} style={{ maxWidth: 600 }}>
        {/* Logo */}
        <div className={styles.logoIcon}>B</div>

        {/* Greeting */}
        <span className={styles.title}>{greeting}</span>

        <span className={styles.subtitle}>
          Your manufacturing AI workspace is ready. Select an agent from the panel or start with one
          of today&apos;s priorities.
        </span>

        {/* Quick-start cards */}
        <Flexbox horizontal gap={16} style={{ marginTop: 12, width: '100%' }}>
          {QUICK_STARTS.map((qs) => (
            <div className={styles.card} key={qs.title}>
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
