import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export function TopbarPatientSearch({ onSubmit }) {
  return <div className="brana-action-topbar-search-wrap"><Input allowClear prefix={<SearchOutlined />} placeholder="Pesquisar paciente" className="brana-action-topbar-search" onChange={() => {}} onPressEnter={() => onSubmit?.('pesquisar-paciente')} /></div>;
}
