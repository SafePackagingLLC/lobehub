/**
 * BridgePoint AI Manufacturing Workspace — Global Theme Overrides
 *
 * This file injects CSS custom properties and global style overrides
 * for the BridgePoint AI dark manufacturing theme.
 * It is imported alongside the existing global styles in src/styles/index.ts.
 */
import { css } from 'antd-style';

// eslint-disable-next-line unicorn/no-anonymous-default-export
export default () => css`
  /* ── BridgePoint AI Design Tokens ── */
  :root,
  html[data-theme='dark'] {
    /* Brand */
    --bp-primary-navy: #1e2761;
    --bp-deep-navy: #141b45;
    --bp-accent-blue: #3b82f6;
    --bp-accent-hover: #2563eb;
    --bp-ice-blue: #cadcfc;

    /* Surfaces */
    --bp-background: #0f1629;
    --bp-card-bg: #1a2340;
    --bp-card-hover: #1f2a4a;
    --bp-input-bg: #141b36;
    --bp-chat-bg: #111827;

    /* Borders */
    --bp-border: rgb(202 220 252 / 8%);
    --bp-border-light: rgb(202 220 252 / 12%);

    /* Text */
    --bp-text-primary: #e5e7eb;
    --bp-text-secondary: #9ca3af;
    --bp-text-muted: #6b7280;

    /* Status */
    --bp-success: #10b981;
    --bp-warning: #f59e0b;
    --bp-danger: #ef4444;

    /* Category tag colours */
    --bp-cat-operations: #34d399;
    --bp-cat-quality: #60a5fa;
    --bp-cat-finance: #f87171;
    --bp-cat-safety: #fbbf24;
    --bp-cat-maintenance: #a78bfa;
    --bp-cat-management: #f472b6;
    --bp-cat-strategy: #2dd4bf;
    --bp-cat-logistics: #fb923c;
    --bp-cat-engineering: #818cf8;
    --bp-cat-hr: #c084fc;
    --bp-cat-platform: #22d3ee;
  }

  /* stylelint-disable custom-property-pattern */

  /* ── Override LobeChat / antd surface colours in dark mode ── */
  html[data-theme='dark'] {
    /* Main layout backgrounds */
    --lobe-vars-colorBgLayout: var(--bp-background) !important;
    --lobe-vars-colorBgContainer: var(--bp-chat-bg) !important;
    --lobe-vars-colorBgElevated: var(--bp-card-bg) !important;

    /* Border overrides */
    --lobe-vars-colorBorder: var(--bp-border) !important;
    --lobe-vars-colorBorderSecondary: var(--bp-border-light) !important;

    /* Text overrides */
    --lobe-vars-colorText: var(--bp-text-primary) !important;
    --lobe-vars-colorTextSecondary: var(--bp-text-secondary) !important;
    --lobe-vars-colorTextDescription: var(--bp-text-muted) !important;
    --lobe-vars-colorTextTertiary: var(--bp-text-muted) !important;
    --lobe-vars-colorTextQuaternary: var(--bp-text-muted) !important;

    /* Primary colour overrides */
    --lobe-vars-colorPrimary: var(--bp-accent-blue) !important;
    --lobe-vars-colorPrimaryHover: var(--bp-accent-hover) !important;

    /* Input backgrounds */
    --lobe-vars-colorFillTertiary: var(--bp-input-bg) !important;
    --lobe-vars-colorFillQuaternary: var(--bp-input-bg) !important;
    --lobe-vars-colorFillSecondary: rgb(202 220 252 / 6%) !important;
    --lobe-vars-colorFill: rgb(202 220 252 / 4%) !important;

    /* Success / warning / error */
    --lobe-vars-colorSuccess: var(--bp-success) !important;
    --lobe-vars-colorWarning: var(--bp-warning) !important;
    --lobe-vars-colorError: var(--bp-danger) !important;
  }
  /* stylelint-enable custom-property-pattern */

  /* ── Typography: Inter font (loaded via <link> in index.html) ── */
  html,
  body {
    font-family:
      Inter,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      sans-serif;
  }

  /* ── Dark-mode body background ── */
  html[data-theme='dark'] body {
    background-color: var(--bp-background) !important;
  }

  /* ── Left sidebar (NavPanel DraggablePanel) ── */
  html[data-theme='dark'] .ant-draggable-panel {
    background: var(--bp-deep-navy) !important;
  }

  /* ── Chat message bubbles ── */
  html[data-theme='dark'] [class*='message'][class*='assistant'],
  html[data-theme='dark'] [class*='MessageItem'][class*='assistant'] {
    .ant-message-content,
    [class*='messageContent'] {
      border: 1px solid var(--bp-border) !important;
      border-radius: 4px 14px 14px !important;
      background: var(--bp-card-bg) !important;
    }
  }

  html[data-theme='dark'] [class*='message'][class*='user'],
  html[data-theme='dark'] [class*='MessageItem'][class*='user'] {
    .ant-message-content,
    [class*='messageContent'] {
      border-radius: 14px 4px 14px 14px !important;
      background: linear-gradient(135deg, var(--bp-accent-blue), var(--bp-accent-hover)) !important;
    }
  }

  /* ── Scrollbar in dark mode ── */
  html[data-theme='dark'] * {
    scrollbar-color: rgb(202 220 252 / 15%) transparent;
  }

  /* ── Input area ── */
  html[data-theme='dark'] [class*='ChatInput'],
  html[data-theme='dark'] [class*='chatInput'],
  html[data-theme='dark'] textarea {
    border-color: var(--bp-border-light) !important;
    border-radius: 14px !important;
    color: var(--bp-text-primary) !important;
    background: var(--bp-input-bg) !important;
  }

  /* ── Send button gradient ── */
  html[data-theme='dark'] [class*='ChatInput'] button[class*='send'],
  html[data-theme='dark'] [class*='chatInput'] button[class*='send'] {
    border: none !important;
    border-radius: 10px !important;
    background: linear-gradient(135deg, var(--bp-accent-blue), var(--bp-accent-hover)) !important;
  }

  /* ── Cards and elevated surfaces ── */
  html[data-theme='dark'] .ant-card {
    border-color: var(--bp-border) !important;
    background: var(--bp-card-bg) !important;

    &:hover {
      background: var(--bp-card-hover) !important;
    }
  }

  /* ── Buttons: primary gradient ── */
  html[data-theme='dark'] .ant-btn-primary {
    border: none !important;
    background: linear-gradient(135deg, var(--bp-accent-blue), var(--bp-accent-hover)) !important;
  }

  /* ── Modal / drawer backgrounds ── */
  html[data-theme='dark'] .ant-modal-content,
  html[data-theme='dark'] .ant-drawer-body {
    border-color: var(--bp-border) !important;
    background: var(--bp-card-bg) !important;
  }

  /* ── Dropdown menus ── */
  html[data-theme='dark'] .ant-dropdown-menu,
  html[data-theme='dark'] .ant-select-dropdown,
  html[data-theme='dark'] .ant-popover-inner {
    background: var(--bp-card-bg) !important;
  }
`;
