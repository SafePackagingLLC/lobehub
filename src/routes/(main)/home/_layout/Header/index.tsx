'use client';

import { Flexbox } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { Plus } from 'lucide-react';
import { memo, useCallback } from 'react';

import { useCreateMenuItems } from '../hooks';

const useStyles = createStyles(({ css }) => ({
  brand: css`
    padding-block: 16px 12px;
    padding-inline: 16px;
  `,
  logo: css`
    display: flex;
    align-items: center;
    justify-content: center;

    width: 36px;
    height: 36px;
    border-radius: 10px;

    font-size: 18px;
    font-weight: 800;
    color: #fff;

    background: linear-gradient(135deg, #3b82f6, #6366f1);
  `,
  newBtn: css`
    cursor: pointer;

    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;

    width: 100%;
    margin-block: 0;
    margin-inline: 16px;
    padding-block: 10px;
    padding-inline: 0;
    border: none;
    border-radius: 10px;

    font-size: 13px;
    font-weight: 600;
    color: #fff;

    background: linear-gradient(135deg, #3b82f6, #2563eb);

    transition: opacity 0.15s ease;

    &:hover {
      opacity: 0.9;
    }
  `,
  subtitle: css`
    font-size: 10px;
    font-weight: 500;
    line-height: 1;
    color: #3b82f6;
    text-transform: uppercase;
    letter-spacing: 1.5px;
  `,
  title: css`
    font-size: 15px;
    font-weight: 700;
    line-height: 1.2;
    color: #fff;
  `,
}));

const Header = memo(() => {
  const { styles } = useStyles();
  const { createAgent, isMutatingAgent } = useCreateMenuItems();

  const handleNewConversation = useCallback(() => {
    if (!isMutatingAgent) createAgent();
  }, [createAgent, isMutatingAgent]);

  return (
    <Flexbox gap={12}>
      {/* Brand row */}
      <Flexbox horizontal align="center" className={styles.brand} gap={10}>
        <div className={styles.logo}>B</div>
        <Flexbox gap={3}>
          <span className={styles.title}>BridgePoint AI</span>
          <span className={styles.subtitle}>MANUFACTURING</span>
        </Flexbox>
      </Flexbox>

      {/* New Conversation button */}
      <button className={styles.newBtn} onClick={handleNewConversation}>
        <Plus size={16} />
        New Conversation
      </button>
    </Flexbox>
  );
});

export default Header;
