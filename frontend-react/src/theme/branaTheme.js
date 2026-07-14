import { theme } from 'antd';

const BRANA_THEME_BASE = {
  colorPrimary: '#16aaa1',
  colorInfo: '#16aaa1',
  colorSuccess: '#006838',
  borderRadius: 10,
  fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  colorBgLayout: '#f6f8f8',
  colorBgContainer: '#ffffff',
  colorBgElevated: '#ffffff',
  colorBorderSecondary: '#d4d9db',
  colorTextSecondary: '#808285',
  colorText: '#163328',
  colorTextHeading: '#36513d',
  colorIcon: '#808285',
  colorIconHover: '#163328',
};

const BRANA_THEME_DARK = {
  colorBgLayout: '#0e1718',
  colorBgContainer: '#142225',
  colorBgElevated: '#142225',
  colorBorderSecondary: '#2a3a3c',
  colorTextSecondary: '#a9b3b6',
  colorText: '#e6f0f1',
  colorTextHeading: '#e8f2f3',
  colorIcon: '#a9b3b6',
  colorIconHover: '#f5ffff',
  colorPrimary: '#1a5d58',
  colorInfo: '#1a5d58',
};

const BRANA_TABLE_LIGHT = {
  headerBg: '#ebe5da',
  headerColor: '#4d5b45',
  rowHoverBg: '#e5ede0',
  rowSelectedBg: '#e4eee0',
  rowSelectedHoverBg: '#dde8d8',
  borderColor: '#d9dfd4',
  colorBgContainer: '#fffaf3',
  colorText: '#314038',
  colorTextHeading: '#36513d',
};

const BRANA_TABLE_DARK = {
  headerBg: '#162729',
  headerColor: '#e8f2f3',
  rowHoverBg: '#183235',
  rowSelectedBg: '#1a5d58',
  rowSelectedHoverBg: '#1e6a64',
  borderColor: '#314447',
  colorBgContainer: '#132123',
  colorText: '#e6f0f1',
  colorTextHeading: '#e8f2f3',
};

const BRANA_FIELD_LIGHT = {
  colorBgContainer: '#ffffff',
  colorBorder: '#c8d1c8',
  colorText: '#163328',
  colorTextPlaceholder: '#7f8a83',
  activeBorderColor: '#00a79d',
  hoverBorderColor: '#7bb6b0',
};

const BRANA_FIELD_DARK = {
  colorBgContainer: '#162326',
  colorBorder: '#3b4d4f',
  colorText: '#ecf4f5',
  colorTextPlaceholder: '#93a2a5',
  activeBorderColor: '#00a79d',
  hoverBorderColor: '#4f676a',
};

const BRANA_MODAL_LIGHT = {
  contentBg: '#ffffff',
  headerBg: '#ffffff',
  titleColor: '#36513d',
  footerBg: '#ffffff',
  boxShadow: '0 20px 48px rgba(56, 53, 41, 0.18)',
  borderRadiusLG: 18,
};

const BRANA_MODAL_DARK = {
  contentBg: '#142225',
  headerBg: '#142225',
  titleColor: '#e6f0f1',
  footerBg: '#142225',
  boxShadow: '0 20px 48px rgba(3, 17, 18, 0.42)',
  borderRadiusLG: 18,
};

const BRANA_MENU_LIGHT = {
  darkItemBg: '#ffffff',
  darkItemColor: '#163328',
  darkItemSelectedBg: '#e4eee0',
  darkItemSelectedColor: '#163328',
  darkSubMenuItemBg: '#ffffff',
  darkSubMenuItemSelectedBg: '#e4eee0',
  itemBg: '#ffffff',
  itemColor: '#163328',
  itemSelectedBg: '#e4eee0',
  itemSelectedColor: '#163328',
};

const BRANA_MENU_DARK = {
  darkItemBg: '#142225',
  darkItemColor: '#e6f0f1',
  darkItemSelectedBg: '#1a5d58',
  darkItemSelectedColor: '#f5ffff',
  darkSubMenuItemBg: '#142225',
  darkSubMenuItemSelectedBg: '#1a5d58',
  itemBg: '#142225',
  itemColor: '#e6f0f1',
  itemSelectedBg: '#1a5d58',
  itemSelectedColor: '#f5ffff',
};

function getFieldTokens(isDarkMode) {
  return isDarkMode ? BRANA_FIELD_DARK : BRANA_FIELD_LIGHT;
}

export function getBranaTheme(mode = 'light') {
  const isDarkMode = mode === 'dark';

  return {
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      ...BRANA_THEME_BASE,
      ...(isDarkMode ? BRANA_THEME_DARK : {}),
    },
    components: {
      Table: isDarkMode ? BRANA_TABLE_DARK : BRANA_TABLE_LIGHT,
      Input: getFieldTokens(isDarkMode),
      Button: {
        colorPrimary: isDarkMode ? '#1a5d58' : '#16aaa1',
        colorPrimaryHover: isDarkMode ? '#1e6a64' : '#1bbab2',
        colorPrimaryActive: isDarkMode ? '#133336' : '#0f938d',
        defaultColor: isDarkMode ? '#e6f0f1' : '#163328',
        defaultBorderColor: isDarkMode ? '#3b4d4f' : '#c8d1c8',
        defaultBg: isDarkMode ? '#162326' : '#ffffff',
      },
      Select: {
        ...getFieldTokens(isDarkMode),
        optionSelectedBg: isDarkMode ? '#1c3a3d' : '#dff2ef',
        optionActiveBg: isDarkMode ? '#173133' : '#edf7f5',
      },
      Radio: {
        colorPrimary: '#00A79D',
        colorPrimaryHover: '#00b9ae',
        colorBgContainer: isDarkMode ? '#132123' : '#ffffff',
        colorBorder: isDarkMode ? '#91a4a7' : '#7c8a80',
      },
      Checkbox: {
        colorPrimary: '#00A79D',
        colorPrimaryHover: '#00b9ae',
        colorBgContainer: isDarkMode ? '#132123' : '#ffffff',
        colorBorder: isDarkMode ? '#91a4a7' : '#7c8a80',
      },
      Pagination: {
        colorBgContainer: isDarkMode ? '#142225' : '#ffffff',
        itemBg: isDarkMode ? '#142225' : '#ffffff',
        itemActiveBg: isDarkMode ? '#1a5d58' : '#e4eee0',
        colorText: isDarkMode ? '#e6f0f1' : '#163328',
        colorTextDisabled: isDarkMode ? '#607174' : '#a9b3b6',
      },
      Dropdown: {
        colorBgElevated: isDarkMode ? '#142225' : '#ffffff',
      },
      Popover: {
        colorBgElevated: isDarkMode ? '#142225' : '#ffffff',
      },
      Tooltip: {
        colorBgSpotlight: isDarkMode ? '#142225' : '#163328',
        colorTextLightSolid: '#ffffff',
      },
      Menu: isDarkMode ? BRANA_MENU_DARK : BRANA_MENU_LIGHT,
      Layout: {
        headerBg: isDarkMode ? '#0f1b1d' : '#ffffff',
        siderBg: isDarkMode ? '#112628' : '#ffffff',
      },
      Modal: isDarkMode ? BRANA_MODAL_DARK : BRANA_MODAL_LIGHT,
      Tabs: {
        itemColor: isDarkMode ? '#a9b3b6' : '#52626a',
        itemSelectedColor: isDarkMode ? '#e6f0f1' : '#36513d',
        itemHoverColor: isDarkMode ? '#f5ffff' : '#163328',
        itemActiveColor: isDarkMode ? '#f5ffff' : '#163328',
        inkBarColor: '#00A79D',
        cardBg: isDarkMode ? '#142225' : '#ffffff',
      },
      Card: {
        borderRadiusLG: 14,
      },
    },
  };
}
