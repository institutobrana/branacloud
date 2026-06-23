import { theme } from 'antd';

export const branaTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#1d8f5f',
    colorInfo: '#1d8f5f',
    borderRadius: 10,
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    colorBgLayout: '#f4f8f5',
    colorBgContainer: '#ffffff',
    colorBorderSecondary: '#dfe9e3',
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      siderBg: '#ffffff',
    },
    Card: {
      borderRadiusLG: 14,
    },
  },
};
