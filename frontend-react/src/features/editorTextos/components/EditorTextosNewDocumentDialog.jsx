import { useState } from 'react';
import { Button, Radio } from 'antd';
import { BranaModal } from '../../../components/BranaModal.jsx';
import { NEW_TEXT_TYPES } from '../models/editorTextosModalModels.js';
import './EditorTextosNewDocumentDialog.css';

export function EditorTextosNewDocumentDialog({ onCancel, onOpenExisting, onCreate }) {
  const [mode, setMode] = useState('create_new');
  const [selectedType, setSelectedType] = useState('receita');
  const createMode = mode === 'create_new';

  return (
    <BranaModal
      open
      title="Novo documento"
      rootClassName="editor-textos-new-document-modal"
      width={312}
      footer={null}
      onCancel={onCancel}
    >
      <Radio.Group aria-label="Ação de novo documento" value={mode} onChange={(event) => setMode(event.target.value)}>
        <div className="editor-textos-new-document-options">
          <Radio value="open_existing">Abrir um texto já existente...</Radio>
          <div>
            <Radio value="create_new">Criar um novo texto do tipo:</Radio>
            <div className="editor-textos-new-document-type-column">
              <select
                aria-label="Tipo de novo texto"
                size={5}
                value={selectedType}
                disabled={!createMode}
                onChange={(event) => { if (createMode) setSelectedType(event.target.value); }}
                className="editor-textos-new-document-type-list"
              >
                {NEW_TEXT_TYPES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
              <div className="editor-textos-new-document-actions">
                <Button onClick={onCancel}>Cancelar</Button>
                <Button
                  type="primary"
                  disabled={createMode && !selectedType}
                  onClick={() => createMode ? onCreate(selectedType) : onOpenExisting()}
                >
                  {createMode ? 'Criar' : 'Abrir'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Radio.Group>
    </BranaModal>
  );
}
