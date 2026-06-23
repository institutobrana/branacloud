import { Table } from 'antd';

export function BranaTable(props) {
  return <Table {...props} className={`brana-table ${props.className ?? ''}`.trim()} />;
}
