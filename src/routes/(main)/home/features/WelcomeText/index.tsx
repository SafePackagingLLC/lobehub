'use client';

import { Flexbox } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { memo, useMemo } from 'react';

const useStyles = createStyles(({ css }) => ({
  card: css`
    cursor: pointer;

    flex: 1;

    min-width: 160px;
    padding: 20px;
    border: 1px solid var(--bp-border, rgb(202 220 252 / 8%));
    border-radius: 12px;

    background: var(--bp-card-bg, #1a2340);

    transition: all 0.15s ease;

    &:hover {
      transform: translateY(-2px);
      border-color: var(--bp-border-light, rgb(202 220 252 / 12%));
      background: var(--bp-card-hover, #1f2a4a);
    }
  `,
  cardDesc: css`
    font-size: 12px;
    line-height: 1.4;
    color: var(--bp-text-muted, #6b7280);
  `,
  cardIcon: css`
    font-size: 28px;
  `,
  cardTitle: css`
    font-size: 14px;
    font-weight: 600;
    color: var(--bp-text-primary, #e5e7eb);
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
    color: var(--bp-text-secondary, #9ca3af);
    text-align: center;
  `,
  title: css`
    font-size: 28px;
    font-weight: 700;
    color: var(--bp-text-primary, #e5e7eb);
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

const WelcomeText = memo(() => {
  const { styles } = useStyles();
  const greeting = useMemo(() => getGreeting(), []);

  return (
    <Flexbox align="center" gap={20} style={{ marginBlock: '36px 24px' }}>
      {/* Logo */}
      <div className={styles.logoIcon}>B</div>

      {/* Greeting */}
      <span className={styles.title}>{greeting}</span>

      <span className={styles.subtitle}>
        Your manufacturing AI workspace is ready. Select an agent from the panel or start with one
        of today&apos;s priorities.
      </span>

      {/* Quick-start cards */}
      <Flexbox
        horizontal
        gap={16}
        style={{ flexWrap: 'wrap', justifyContent: 'center', marginTop: 12, width: '100%' }}
      >
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
  );
});

export default WelcomeText;
