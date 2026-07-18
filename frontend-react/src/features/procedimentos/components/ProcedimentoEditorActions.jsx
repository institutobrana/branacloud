import { Button, Space } from 'antd';

export function ProcedimentoEditorActions({
  canClose = true,
  canSave = false,
  canLink = false,
  canUnlink = false,
  onClose,
  onSave,
  onLink,
  onUnlink,
}) {
  return (
    <Space size={8} wrap className="procedimento-editor-actions">
      <Button type="primary" disabled={!canSave} loading={false} onClick={onSave}>
        Gravar
      </Button>
      <Button onClick={onClose} disabled={!canClose}>
        Voltar
      </Button>
      <Button disabled={!canLink} onClick={onLink}>
        Vincular material
      </Button>
      <Button disabled={!canUnlink} onClick={onUnlink}>
        Desvincular material
      </Button>
    </Space>
  );
}
