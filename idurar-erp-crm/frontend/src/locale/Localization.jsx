import { ConfigProvider } from 'antd';

export default function Localization({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4f46e5', // Modern Indigo
          colorLink: '#4f46e5',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          borderRadius: 10,
          colorBgBase: '#ffffff',
          colorTextBase: '#1e293b',
          colorTextHeading: '#0f172a',
          controlHeight: 40,
          boxShadowSecondary: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          fontSize: 14,
          wireframe: false,
        },
        components: {
          Layout: {
            headerBg: 'rgba(255, 255, 255, 0.8)',
            bodyBg: '#f8fafc',
            headerHeight: 70,
          },
          Menu: {
            itemBg: 'transparent',
            itemHoverBg: 'rgba(79, 70, 229, 0.08)',
            itemSelectedBg: 'rgba(79, 70, 229, 0.12)',
            itemSelectedColor: '#4f46e5',
            itemColor: '#64748b',
            iconSize: 20,
            itemMarginInline: 12,
            itemBorderRadius: 8,
          },
          Button: {
            paddingInline: 24,
            fontWeight: 600,
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            controlHeight: 40,
          },
          Card: {
            boxShadowTertiary: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            headerBg: 'transparent',
            borderRadiusLG: 16,
            paddingLG: 24,
          },
          Table: {
            headerBg: '#f1f5f9',
            headerColor: '#475569',
            headerBorderRadius: 8,
            padding: 16,
          },
          Input: {
            paddingInline: 16,
            paddingBlock: 10,
            borderRadius: 8,
          },
          Select: {
            controlHeight: 40,
            borderRadius: 8,
          },
          Modal: {
            borderRadiusLG: 16,
            headerBg: 'transparent',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
