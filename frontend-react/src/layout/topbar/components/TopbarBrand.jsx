import { Typography } from 'antd';
import branaLogo from '../../../assets/brana.png';

export function TopbarBrand() {
  return <div className="brana-action-topbar-brand"><img className="brana-action-topbar-logo" src={branaLogo} alt="Instituto Brana Odontologia" /><div className="brana-action-topbar-brand-copy"><Typography.Text className="brana-action-topbar-brand-name">BranaCloud</Typography.Text></div></div>;
}
