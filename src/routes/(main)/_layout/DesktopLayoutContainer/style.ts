import { createStaticStyles } from 'antd-style';

import { isDesktop } from '@/const/version';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  // 内层容器
  innerContainer: css`
    position: relative;
    overflow: hidden;
    background: ${cssVar.colorBgContainer};
    transition: opacity 0.15s ease;
  `,

  // 外层容器
  outerContainer: css`
    position: relative;
    overflow: hidden;
    background: ${isDesktop ? 'transparent' : cssVar.colorBgLayout};
  `,
}));
