export function EtiquetaLayoutPreview({ values }) {
  const columns = Math.max(1, Number(values.nro_colunas) || 1); const rows = Math.max(1, Number(values.nro_linhas) || 1);
  return <div className="etiqueta-layout-preview" aria-label={`Preview com ${columns} colunas e ${rows} linhas`}><div className="etiqueta-layout-sheet" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>{Array.from({ length: columns * rows }, (_, i) => <span key={i} className="etiqueta-layout-cell" />)}</div><span>{columns} × {rows}</span></div>;
}
