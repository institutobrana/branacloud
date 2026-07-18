import { PROCEDIMENTO_MATERIAIS_COLUMNS } from '../procedimentosEditorConstants.js';

export function ProcedimentoMateriaisTable({
  loading = false,
  error = '',
  items = [],
  selectedCodigo = '',
  totalMateriais = 0,
  totalCustoUnd = 0,
  totalCusto = 0,
  onSelect,
  onDoubleClick,
}) {
  return (
    <section className="procedimento-editor-panel procedimento-editor-panel-materiais">
      <div className="procedimento-editor-panel-title">Materiais vinculados</div>
      {error ? <div className="procedimento-materiais-error">{error}</div> : null}
      <div className="procedimento-materiais-table-wrap procedimento-materiais-table-shell">
        <table className="procedimento-materiais-table" aria-label="Materiais vinculados ao procedimento">
          <colgroup>
            <col className="procedimento-materiais-col-codigo" />
            <col className="procedimento-materiais-col-material" />
            <col className="procedimento-materiais-col-relacao" />
            <col className="procedimento-materiais-col-preco" />
            <col className="procedimento-materiais-col-custo-und" />
            <col className="procedimento-materiais-col-quantidade" />
            <col className="procedimento-materiais-col-custo-total" />
          </colgroup>
          <thead>
            <tr>
              {PROCEDIMENTO_MATERIAIS_COLUMNS.map((label) => (
                <th key={label}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="procedimento-materiais-empty">
                <td colSpan={PROCEDIMENTO_MATERIAIS_COLUMNS.length}>Carregando materiais vinculados...</td>
              </tr>
            ) : items.length ? (
              items.map((item) => (
                <tr
                  key={`${item.codigo || item.material_id || item.vinculo_id}`}
                  className={[String(selectedCodigo || '') === String(item.codigo || '') ? 'is-selected' : ''].filter(Boolean).join(' ')}
                  onClick={() => onSelect?.(item.codigo)}
                  onDoubleClick={() => onDoubleClick?.(item)}
                >
                  <td>{item.codigo || '-'}</td>
                  <td title={item.nome || ''}>
                    <span className="procedimento-materiais-nome">{item.nome || '-'}</span>
                  </td>
                  <td>{item.relacao != null ? String(item.relacao) : '-'}</td>
                  <td>{Number(item.preco || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>{Number(item.custo_und || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>{Number(item.quantidade || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 3 })}</td>
                  <td>{Number(item.custo_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))
            ) : (
              <tr className="procedimento-materiais-empty">
                <td colSpan={PROCEDIMENTO_MATERIAIS_COLUMNS.length}>Nenhum material vinculado.</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td>Totais ({totalMateriais})</td>
              <td />
              <td />
              <td />
              <td>{Number(totalCustoUnd || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td />
              <td>{Number(totalCusto || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
