import { Layout } from 'antd';

export function BranaShell({ sidebar, topbar, children }) {
  return (
    <Layout className="brana-shell">
      <Layout.Sider width={272} breakpoint="lg" collapsible={false} className="brana-sidebar">
        {sidebar}
      </Layout.Sider>
      <Layout>
        <Layout.Header className="brana-topbar">{topbar}</Layout.Header>
        <Layout.Content className="brana-content">{children}</Layout.Content>
      </Layout>
    </Layout>
  );
}
