import { BranaModal } from '../../../components/BranaModal.jsx';
import { Button } from 'antd';

export function EditorTextosUnsavedChangesDialog({ open, saving = false, onSave, onDiscard, onCancel }) {
  return (
    <BranaModal open={open} title="Alterações não salvas" onCancel={onCancel} footer={[
      <Button key="discard" onClick={onDiscard} disabled={saving}>Não salvar</Button>,
      <Button key="cancel" onClick={onCancel} disabled={saving}>Cancelar</Button>,
      <Button key="save" type="primary" onClick={onSave} loading={saving} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>,
    ]}>
      <p>Existem alterações não salvas. Deseja salvar?</p>
    </BranaModal>
  );
}
