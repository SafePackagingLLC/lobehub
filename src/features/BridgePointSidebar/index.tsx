/**
 * BridgePoint AI — Fixed Left Sidebar (260 px)
 *
 * Replaces LobeChat's DraggablePanel sidebar with a fixed-width
 * BridgePoint-branded panel.  Preserves the NavPanelPortal system
 * so that other routes (settings, community, etc.) can still
 * inject their own sidebar content.
 */
'use client';

import { createStyles } from 'antd-style';
import { memo, useSyncExternalStore } from 'react';

import {
  getNavPanelSnapshot,
  NAV_PANEL_RIGHT_DRAWER_ID,
  subscribeNavPanel,
} from '@/features/NavPanel';
import SidebarContent from '@/routes/(main)/home/_layout/SidebarContent';

const SIDEBAR_WIDTH = 260;

const useStyles = createStyles(({ css }) => ({
  container: css`
    user-select: none;

    display: flex;
    flex-direction: column;
    flex-shrink: 0;

    width: ${SIDEBAR_WIDTH}px;
    height: 100%;
    border-inline-end: 1px solid var(--bp-border);

    color: var(--bp-text-secondary);

    background: var(--bp-deep-navy);

    * {
      user-select: none;
    }
  `,
  content: css`
    overflow: hidden;
    display: flex;
    flex: 1;
    flex-direction: column;

    min-width: 0;
    height: 100%;
  `,
}));

const BridgePointSidebar = memo(() => {
  const { styles } = useStyles();

  const panelContent = useSyncExternalStore(
    subscribeNavPanel,
    getNavPanelSnapshot,
    getNavPanelSnapshot,
  );

  // Render portal content if another route has pushed sidebar content,
  // otherwise fall back to the home sidebar (logo, conversations, footer).
  const activeNode = panelContent ? panelContent.node : <SidebarContent />;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>{activeNode}</div>
      </div>
      {/* Drawer overlay target — used by LobeChat's right drawer system */}
      <div
        id={NAV_PANEL_RIGHT_DRAWER_ID}
        style={{
          height: '100%',
          position: 'relative',
          width: 0,
          zIndex: 10,
        }}
      />
    </>
  );
});

export default BridgePointSidebar;
