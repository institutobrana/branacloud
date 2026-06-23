import { theme } from 'antd';

export const branaTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#00A79D',
    colorInfo: '#00A79D',
    colorSuccess: '#006838',
    borderRadius: 10,
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    colorBgLayout: '#f6f8f8',
    colorBgContainer: '#ffffff',
    colorBorderSecondary: '#d4d9db',
    colorTextSecondary: '#808285',
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
