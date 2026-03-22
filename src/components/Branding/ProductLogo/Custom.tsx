import { BRANDING_LOGO_URL, BRANDING_NAME } from '@lobechat/business-const';
import { type IconType } from '@lobehub/icons';
import { type FlexboxProps } from '@lobehub/ui';
import { Flexbox } from '@lobehub/ui';
import { type LobeChatProps } from '@lobehub/ui/brand';
import { createStaticStyles, cssVar } from 'antd-style';
import { type ReactNode } from 'react';
import { memo } from 'react';

import { type ImageProps } from '@/libs/next/Image';
import Image from '@/libs/next/Image';

const styles = createStaticStyles(({ css }) => {
  return {
    extraTitle: css`
      font-weight: 300;
      white-space: nowrap;
    `,
    logoIcon: css`
      display: flex;
      align-items: center;
      justify-content: center;

      width: 36px;
      height: 36px;
      border-radius: 10px;

      font-size: 18px;
      font-weight: 800;
      line-height: 1;
      color: #fff;

      background: linear-gradient(135deg, #3b82f6, #6366f1);
    `,
    logoSubtitle: css`
      font-size: 10px;
      font-weight: 500;
      line-height: 1;
      color: #3b82f6;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    `,
    logoText: css`
      font-size: 15px;
      font-weight: 700;
      line-height: 1.2;
      color: #fff;
    `,
  };
});

/** BridgePoint AI gradient "B" icon */
const BPLogoIcon = memo<{ size?: number }>(({ size = 36 }) => (
  <div
    className={styles.logoIcon}
    style={{
      borderRadius: Math.round(size * 0.28),
      fontSize: Math.round(size * 0.5),
      height: size,
      width: size,
    }}
  >
    B
  </div>
));

/** Full branded logo: icon + text + subtitle */
const BPCombinedLogo = memo<{ size?: number }>(({ size = 36 }) => (
  <Flexbox horizontal align="center" gap={10}>
    <BPLogoIcon size={size} />
    <Flexbox gap={2}>
      <span className={styles.logoText}>BridgePoint AI</span>
      <span className={styles.logoSubtitle}>MANUFACTURING</span>
    </Flexbox>
  </Flexbox>
));

const CustomTextLogo = memo<FlexboxProps & { size: number }>(({ size, style, ...rest }) => {
  return (
    <Flexbox
      height={size}
      style={{
        fontSize: size / 1.5,
        fontWeight: 'bolder',
        userSelect: 'none',
        ...style,
      }}
      {...rest}
    >
      {BRANDING_NAME}
    </Flexbox>
  );
});

const CustomImageLogo = memo<Omit<ImageProps, 'alt' | 'src'> & { size: number }>(
  ({ size, ...rest }) => {
    // If no custom logo URL is set, render the gradient B icon
    if (!BRANDING_LOGO_URL) {
      return <BPLogoIcon size={size} />;
    }
    return (
      <Image
        alt={BRANDING_NAME}
        height={size}
        src={BRANDING_LOGO_URL}
        unoptimized={true}
        width={size}
        {...rest}
      />
    );
  },
);

const Divider: IconType = (({ ref, size = '1em', style, ...rest }) => (
  <svg
    fill="none"
    height={size}
    ref={ref}
    shapeRendering="geometricPrecision"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flex: 'none', lineHeight: 1, ...style }}
    viewBox="0 0 24 24"
    width={size}
    {...rest}
  >
    <path d="M16.88 3.549L7.12 20.451" />
  </svg>
)) as IconType;

const CustomLogo = memo<LobeChatProps>(({ extra, size = 32, className, style, type, ...rest }) => {
  let logoComponent: ReactNode;

  switch (type) {
    case '3d':
    case 'flat': {
      logoComponent = <CustomImageLogo size={size} style={style} {...rest} />;
      break;
    }
    case 'mono': {
      logoComponent = (
        <CustomImageLogo size={size} style={{ filter: 'grayscale(100%)', ...style }} {...rest} />
      );
      break;
    }
    case 'text': {
      logoComponent = <CustomTextLogo size={size} style={style} {...rest} />;
      break;
    }
    case 'combine': {
      logoComponent = <BPCombinedLogo size={size} />;
      if (!extra) return logoComponent;
      break;
    }
    default: {
      logoComponent = <CustomImageLogo size={size} style={style} {...rest} />;
      break;
    }
  }

  if (!extra) return logoComponent;

  const extraSize = Math.round((size / 3) * 1.9);

  return (
    <Flexbox horizontal align={'center'} className={className} flex={'none'} {...rest}>
      {logoComponent}
      <Divider size={extraSize} style={{ color: cssVar.colorFill }} />
      <div className={styles.extraTitle} style={{ fontSize: extraSize }}>
        {extra}
      </div>
    </Flexbox>
  );
});

export default CustomLogo;
