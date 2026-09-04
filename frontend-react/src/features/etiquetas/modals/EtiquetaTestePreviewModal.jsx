import { Modal } from 'antd';
import { EtiquetaLayoutPreview } from '../components/EtiquetaLayoutPreview.jsx';

export function EtiquetaTestePreviewModal({ model, onClose }) {
  return (
    <Modal open={Boolean(model)} title="Teste de etiqueta" centered width={780} onCancel={onClose} maskClosable={false} destroyOnClose footer={<button type="button" className="etiqueta-modal-cancel" onClick={onClose}>Fechar</button>}>
      {model ? <div className="etiqueta-modelo-modal-layout">
        <div className="etiqueta-modelo-form">
          <p><strong>{model.nome}</strong></p>
          <p>{model.nome_arquivo}</p>
          <p>{model.padrao_nome || 'Definido pelo usuário'}</p>
          <p>Margens: {Number(model.margem_esq || 0).toFixed(2)} / {Number(model.margem_sup || 0).toFixed(2)} mm</p>
          <p>Espaços: {Number(model.esp_horizontal || 0).toFixed(2)} / {Number(model.esp_vertical || 0).toFixed(2)} mm</p>
        </div>
        <EtiquetaLayoutPreview values={model} />
      </div> : null}
    </Modal>
  );
}
