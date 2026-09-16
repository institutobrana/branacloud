import { useEffect, useMemo, useState } from 'react';
import { Modal, Select, InputNumber, message } from 'antd';

export function ProcedimentoGenericoFaseEditModal({
  open,
  title,
  options,
  initialValue,
  nextSequence,
  onCancel,
  onConfirm,
}) {
  const [codigo, setCodigo] = useState('');
  const [sequencia, setSequencia] = useState(1);
  const [tempo, setTempo] = useState(0);

  const normalizedOptions = useMemo(() => {
    return Array.isArray(options) ? options : [];
  }, [options]);

  useEffect(() => {
    if (!open) return;
    setCodigo(String(initialValue?.codigo || '').trim() || String(normalizedOptions[0]?.value || '').trim());
    setSequencia(Math.max(1, Number(initialValue?.sequencia || nextSequence || 1)));
    setTempo(Math.max(0, Number(initialValue?.tempo || 0)));
  }, [initialValue, nextSequence, normalizedOptions, open]);

  const handleConfirm = () => {
    const nextCodigo = String(codigo || '').trim();
    if (!nextCodigo) {
      message.warning('Selecione a fase do procedimento.');
      return;
    }
    onConfirm?.({
      codigo: nextCodigo,
      sequencia: Math.max(1, Number(sequencia || 1)),
      tempo: Math.max(0, Number(tempo || 0)),
    });
  };

  return (
    <Modal
      open={open}
      centered
      destroyOnClose
      width={360}
      title={title}
      onCancel={onCancel}
      footer={null}
      className="procedimento-generico-fase-edit-modal"
      closeIcon={<span aria-hidden="true">X</span>}
    >
      <div className="procedimento-generico-fase-edit-body">
        <div className="procedimento-generico-fase-edit-field">
          <label htmlFor="pgen-fase-select">Nome da fase</label>
          <Select
            id="pgen-fase-select"
            value={codigo || undefined}
            placeholder="Selecione..."
            options={normalizedOptions}
            onChange={(value) => setCodigo(String(value || '').trim())}
            showSearch
            optionFilterProp="label"
          />
        </div>
        <div className="procedimento-generico-fase-edit-field">
          <label htmlFor="pgen-fase-sequencia">Sequência de execução</label>
          <InputNumber
            id="pgen-fase-sequencia"
            min={1}
            step={1}
            value={sequencia}
            onChange={(value) => setSequencia(Math.max(1, Number(value || 1)))}
          />
        </div>
        <div className="procedimento-generico-fase-edit-field">
          <label htmlFor="pgen-fase-tempo">Duração em minutos</label>
          <InputNumber
            id="pgen-fase-tempo"
            min={0}
            step={1}
            value={tempo}
            onChange={(value) => setTempo(Math.max(0, Number(value || 0)))}
          />
        </div>
      </div>

      <div className="procedimento-generico-fase-edit-actions">
        <button type="button" className="procedimento-generico-fase-edit-button is-primary procedimento-generico-fase-edit-ok" onClick={handleConfirm}>
          Ok
        </button>
        <button type="button" className="procedimento-generico-fase-edit-button procedimento-generico-fase-edit-cancel" onClick={onCancel}>
          Cancela
        </button>
      </div>
    </Modal>
  );
}
