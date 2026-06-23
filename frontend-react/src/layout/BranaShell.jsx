import { Layout } from 'antd';

export function BranaShell({ sidebar, topbar, children }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Sider width={260} breakpoint="lg" collapsible={false} className="brana-sidebar">
        {sidebar}
      </Layout.Sider>
      <Layout>
        <Layout.Header className="brana-topbar">{topbar}</Layout.Header>
        <Layout.Content className="brana-content">{children}</Layout.Content>
      </Layout>
    </Layout>
  );
}
