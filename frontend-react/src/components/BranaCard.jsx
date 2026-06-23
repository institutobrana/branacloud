import { Card } from 'antd';

export function BranaCard(props) {
  return <Card {...props} className={`brana-card ${props.className ?? ''}`.trim()} />;
}
