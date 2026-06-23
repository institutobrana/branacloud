import { useState } from 'react';
import { Alert, Button, Card, Checkbox, Form, Input, Space, Typography, message } from 'antd';
import { LockOutlined, MailOutlined, LoginOutlined } from '@ant-design/icons';

import './login.css';

export function LoginPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 120));
      message.success('Login visual validado. Integração real será feita em etapa posterior.');
      form.setFieldsValue({ senha: values.senha });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-experiment-page">
      <div className="login-experiment-shell">
        <Card className="login-experiment-card" bordered={false}>
          <Space direction="vertical" size={20} style={{ width: '100%' }}>
            <div>
              <Typography.Text className="login-experiment-brand">Brana Cloud</Typography.Text>
              <Typography.Title level={2} className="login-experiment-title">
                Sistema odontológico em nuvem
              </Typography.Title>
              <Typography.Paragraph type="secondary" className="login-experiment-subtitle">
                Tela experimental do novo frontend React. Autenticação real ainda não conectada.
              </Typography.Paragraph>
            </div>

            <Alert
              type="warning"
              showIcon
              message="Ambiente experimental isolado. O frontend legado continua preservado."
            />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              requiredMark={false}
              className="login-experiment-form"
            >
              <Form.Item
                label="E-mail"
                name="email"
                rules={[{ required: true, message: 'Informe o e-mail.' }]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="seuemail@brana.com"
                  autoComplete="username"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Senha"
                name="senha"
                rules={[{ required: true, message: 'Informe a senha.' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  size="large"
                />
              </Form.Item>

              <Form.Item name="lembrar" valuePropName="checked">
                <Checkbox>Lembrar neste dispositivo</Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<LoginOutlined />}
                  loading={loading}
                  block
                  size="large"
                >
                  Entrar
                </Button>
              </Form.Item>
            </Form>

            <div className="login-experiment-links">
              <button type="button" className="login-experiment-link">
                Esqueci minha senha
              </button>
              <button type="button" className="login-experiment-link">
                Criar nova conta
              </button>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
}
