import { Typography } from 'antd';
import './contaCorrenteCirurgiao.css';

export function ContaCorrenteCirurgiaoPage() {
  return (
    <div className="conta-corrente-cirurgiao-page">
      <div className="conta-corrente-cirurgiao-shell">
        <Typography.Title level={4} className="conta-corrente-cirurgiao-title">
          Conta corrente do cirurgião
        </Typography.Title>
        <Typography.Text type="secondary" className="conta-corrente-cirurgiao-subtitle">
          Estrutura inicial pronta para a próxima etapa.
        </Typography.Text>
      </div>
    </div>
  );
}
