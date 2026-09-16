import { Button } from 'antd';

const actions = ['Inserir linha', 'Edita linha', 'Elimina linha', 'Propriedades da linha...'];

export function HistoricoPacienteToolbar({ hasSelection, onInsert, onEdit, onDelete, onProperties, disabled }) {
  return (
    <div className="historico-paciente-toolbar" role="toolbar" aria-label="Ações do histórico">
      {actions.map((label, index) => (
        <Button
          key={label}
          type="default"
          size="small"
          disabled={disabled || (index > 0 && !hasSelection)}
          onClick={[onInsert, onEdit, onDelete, onProperties][index]}
          title={disabled ? 'Ação indisponível durante outra edição.' : undefined}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
