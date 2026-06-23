export function BranaFormSection({ title, children }) {
  return (
    <section className="brana-form-section">
      {title ? <h3>{title}</h3> : null}
      {children}
    </section>
  );
}
