import { BUILTIN_AGENT_SLUGS } from '@lobechat/builtin-agents';
import { type ButtonProps } from '@lobehub/ui';
import { Button, Center, Tooltip } from '@lobehub/ui';
import { createStaticStyles, cssVar, cx } from 'antd-style';
// BridgePoint AI customization - manufacturing-specific icons
import {
  AlertTriangleIcon,
  ClipboardListIcon,
  FileTextIcon,
  PenLineIcon,
  SearchIcon,
} from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useInitBuiltinAgent } from '@/hooks/useInitBuiltinAgent';
import { type StarterMode } from '@/store/home';
import { useHomeStore } from '@/store/home';

const styles = createStaticStyles(({ css, cssVar }) => ({
  active: css`
    border-color: ${cssVar.colorFillSecondary} !important;
    background: ${cssVar.colorBgElevated} !important;
  `,
  button: css`
    height: 40px;
    border-color: ${cssVar.colorFillSecondary};
    background: transparent;
    box-shadow: none !important;

    &:hover {
      border-color: ${cssVar.colorFillSecondary} !important;
      background: ${cssVar.colorBgElevated} !important;
    }
  `,
}));

type StarterTitleKey =
  | 'starter.createAgent'
  | 'starter.createGroup'
  | 'starter.write'
  | 'starter.imageGeneration'
  | 'starter.videoGeneration'
  | 'starter.deepResearch';

interface StarterItem {
  disabled?: boolean;
  hot?: boolean;
  icon?: ButtonProps['icon'];
  key: StarterMode;
  titleKey: StarterTitleKey;
}

const StarterList = memo(() => {
  const { t } = useTranslation('home');

  useInitBuiltinAgent(BUILTIN_AGENT_SLUGS.agentBuilder);
  useInitBuiltinAgent(BUILTIN_AGENT_SLUGS.groupAgentBuilder);
  useInitBuiltinAgent(BUILTIN_AGENT_SLUGS.pageAgent);

  const [inputActiveMode, setInputActiveMode] = useHomeStore((s) => [
    s.inputActiveMode,
    s.setInputActiveMode,
  ]);

  // BridgePoint AI customization - manufacturing-specific starter buttons
  const items: StarterItem[] = useMemo(
    () => [
      {
        icon: AlertTriangleIcon,
        key: 'agent',
        titleKey: 'starter.createAgent',
      },
      {
        icon: FileTextIcon,
        key: 'group',
        titleKey: 'starter.createGroup',
      },
      {
        icon: PenLineIcon,
        key: 'write',
        titleKey: 'starter.write',
      },
      {
        icon: ClipboardListIcon,
        key: 'image',
        titleKey: 'starter.imageGeneration',
      },
      {
        icon: SearchIcon,
        key: 'video',
        titleKey: 'starter.videoGeneration',
      },
    ],
    [],
  );

  // BridgePoint AI customization - all buttons toggle input mode (no video/image navigation)
  const handleClick = useCallback(
    (key: StarterMode) => {
      // Toggle mode: if clicking the active mode, clear it; otherwise set it
      if (inputActiveMode === key) {
        setInputActiveMode(null);
      } else {
        setInputActiveMode(key);
      }
    },
    [inputActiveMode, setInputActiveMode],
  );

  return (
    <Center horizontal gap={8}>
      {items.map((item) => {
        const button = (
          <Button
            className={cx(styles.button, inputActiveMode === item.key && styles.active)}
            disabled={item.disabled}
            icon={item.icon}
            key={item.key}
            shape={'round'}
            variant={'outlined'}
            iconProps={{
              color: inputActiveMode === item.key ? cssVar.colorText : cssVar.colorTextSecondary,
              size: 18,
            }}
            onClick={() => handleClick(item.key)}
          >
            {t(item.titleKey)}
          </Button>
        );

        if (item.disabled) {
          return (
            <Tooltip key={item.key} title={t('starter.developing')}>
              {button}
            </Tooltip>
          );
        }

        return button;
      })}
    </Center>
  );
});

export default StarterList;
