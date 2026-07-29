import { Alert, Button, Card, Form, Input, Space, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { appPath } from '../../app/basePath.js';
import { useAuth } from '../auth/useAuth.js';
import { FIRST_ACCESS_MIN_PASSWORD_LENGTH } from './firstAccessValidation.js';
import { useCompleteFirstAccess } from './useCompleteFirstAccess.js';
import './firstAccess.css';

export function FirstAccessPage() {
  const [form] = Form.useForm();
  const { user, token, signOut, refreshSession } = useAuth();
  const setup = useCompleteFirstAccess({
    token,
    refreshSession,
    onSuccess: () => {
      window.location.replace(appPath());
    },
  });

  const handleFinish = async (values) => {
    await setup.submit(values);
  };

  return (
    <div className="first-access-page">
      <div className="first-access-shell">
        <Card className="first-access-card" bordered={false}>
          <Space direction="vertical" size={18} style={{ width: '100%' }}>
            <div>
              <Typography.Text className="first-access-eyebrow">Brana Cloude</Typography.Text>
              <Typography.Title level={2} className="first-access-title">
                Primeiro acesso
              </Typography.Title>
              <Typography.Paragraph type="secondary" className="first-access-subtitle">
                Estamos quase prontos para começar. Antes de entrar no sistema, defina a senha de segurança interna
                do administrador da clínica.
              </Typography.Paragraph>
            </div>

            <Alert
              type="info"
              showIcon
              className="first-access-internal-password-alert"
              message="Esta NÃO é sua senha de login."
              description={
                <div className="first-access-internal-password-copy">
                  <Typography.Paragraph>
                    A senha de login continua sendo a senha usada para acessar esta conta.
                  </Typography.Paragraph>
                  <ul>
                    <li>Esta senha interna será usada para proteger ações importantes no sistema.</li>
                    <li>Ela será solicitada apenas em operações sensíveis.</li>
                    <li>Você poderá alterá-la posteriormente nas configurações.</li>
                    <li>Esta etapa ocorre apenas no primeiro acesso.</li>
                  </ul>
                </div>
              }
            />

            {setup.error ? (
              <Alert
                type="error"
                showIcon
                message={setup.error}
                closable
                onClose={setup.clearError}
              />
            ) : null}

            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              requiredMark={false}
              className="first-access-form"
            >
              <Form.Item label="E-mail" name="email" initialValue={user?.email || ''}>
                <Input
                  prefix={<MailOutlined />}
                  readOnly
                  aria-readonly="true"
                  autoComplete="username"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Senha interna"
                name="senha"
                rules={[
                  { required: true, message: 'Informe a senha interna.' },
                  {
                    min: FIRST_ACCESS_MIN_PASSWORD_LENGTH,
                    message: 'A senha deve ter no minimo 6 caracteres.',
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  autoComplete="new-password"
                  size="large"
                  autoFocus
                />
              </Form.Item>

              <Form.Item
                label="Confirmar senha interna"
                name="confirmaSenha"
                dependencies={['senha']}
                rules={[
                  { required: true, message: 'Confirme a senha interna.' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('senha') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('A confirmacao de senha nao confere.'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  autoComplete="new-password"
                  size="large"
                />
              </Form.Item>

              <div className="first-access-actions">
                <Button type="primary" htmlType="submit" loading={setup.loading} size="large">
                  Concluir primeiro acesso
                </Button>
                <Button type="default" onClick={signOut} disabled={setup.loading} size="large">
                  Sair
                </Button>
              </div>
            </Form>
          </Space>
        </Card>
      </div>
    </div>
  );
}
