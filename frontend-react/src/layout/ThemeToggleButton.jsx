import { Tooltip } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useBranaThemeMode } from '../theme/branaThemeMode.jsx';

export function ThemeToggleButton() {
  const { isDarkMode, toggleThemeMode } = useBranaThemeMode();
  const nextLabel = isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro';
  const icon = isDarkMode ? <SunOutlined /> : <MoonOutlined />;

  return (
    <Tooltip title={nextLabel} placement="right">
      <button
        type="button"
        className="brana-icon-rail-button brana-icon-rail-theme-toggle"
        onClick={toggleThemeMode}
        aria-label={nextLabel}
      >
        <span className="brana-icon-rail-icon" aria-hidden="true">
          {icon}
        </span>
        <span className="brana-icon-rail-label">{nextLabel}</span>
      </button>
    </Tooltip>
  );
}
