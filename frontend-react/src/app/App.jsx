import { ConfigProvider, Layout, Menu, Card, Typography, Row, Col, Space, theme } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SmileOutlined,
  CalendarOutlined,
  DollarOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { branaTheme, branaThemeAlgorithm } from '../theme/branaTheme.js';
import { BranaPageHeader } from '../components/BranaPageHeader.jsx';
import { BranaShell } from '../layout/BranaShell.jsx';
import { BranaSidebar } from '../layout/BranaSidebar.jsx';
import { BranaTopbar } from '../layout/BranaTopbar.jsx';
import { HomePlaceholder } from '../features/home/HomePlaceholder.jsx';

const menuItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: 'pacientes', icon: <UserOutlined />, label: 'Pacientes' },
  { key: 'odontograma', icon: <SmileOutlined />, label: 'Odontograma' },
  { key: 'agenda', icon: <CalendarOutlined />, label: 'Agenda' },
  { key: 'financeiro', icon: <DollarOutlined />, label: 'Financeiro' },
  { key: 'configuracoes', icon: <SettingOutlined />, label: 'Configurações' },
];

export default function App() {
  return (
    <ConfigProvider theme={branaTheme}>
      <BranaShell
        sidebar={<BranaSidebar menuItems={menuItems} />}
        topbar={<BranaTopbar />}
      >
        <HomePlaceholder />
      </BranaShell>
    </ConfigProvider>
  );
}
