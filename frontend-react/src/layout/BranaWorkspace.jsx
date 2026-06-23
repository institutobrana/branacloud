export function BranaWorkspace({ topbar, children }) {
  return (
    <section className="brana-workspace">
      {topbar}
      <main className="brana-workspace-content">{children}</main>
    </section>
  );
}
