import { useMemo, useState } from 'react';

import { AgendaColorDropdown } from '../AgendaColorDropdown.jsx';
import { AgendaFonteModal } from '../fonte/AgendaFonteModal.jsx';
import { buildAgendaFontePreviewStyle, normalizeAgendaFonteValue } from '../../agendaConfiguracaoFonte.js';

function PresentationField({ label, value, onChange }) {
  return (
    <label className="agenda-apresentacao-field">
      <span className="agenda-apresentacao-label">{label}</span>
      <div className="agenda-apresentacao-control">
        <AgendaColorDropdown
          value={value}
          onChange={onChange}
          aria-label={label}
        />
      </div>
    </label>
  );
}

function PreviewBox({ label, color, fontStyle }) {
  const previewStyle = useMemo(() => ({
    background: color,
    borderColor: color,
    ...fontStyle,
  }), [color, fontStyle]);

  return (
    <div className="agenda-apresentacao-preview" style={previewStyle}>
      <span className="agenda-apresentacao-preview-title">{label}</span>
      <span className="agenda-apresentacao-preview-sample">AaBbYyZz</span>
    </div>
  );
}

export function AgendaApresentacaoTab({ draft, updateDraft }) {
  const [fonteOpen, setFonteOpen] = useState(false);
  const currentDraft = draft || {};
  const fonteAtual = normalizeAgendaFonteValue(currentDraft.apresentacaoFonte);
  const fontePreviewStyle = useMemo(() => buildAgendaFontePreviewStyle(fonteAtual), [fonteAtual]);

  const handleColorChange = (key) => (value) => {
    updateDraft?.({ [key]: value });
  };

  const handleFonteConfirm = (nextFonte) => {
    updateDraft?.({ apresentacaoFonte: normalizeAgendaFonteValue(nextFonte) });
    setFonteOpen(false);
  };

  return (
    <>
      <div className="agenda-configuracao-pane agenda-configuracao-pane--apresentacao" aria-label="Aba Apresentação">
        <div className="agenda-apresentacao-grid">
          <section className="agenda-apresentacao-card">
            <div className="agenda-apresentacao-card-title">Cor de fundo</div>
            <div className="agenda-apresentacao-fields">
              <PresentationField label="Pacientes particulares:" value={currentDraft.corParticular || '#ffff00'} onChange={handleColorChange('corParticular')} />
              <PresentationField label="Pacientes de convênio:" value={currentDraft.corConvenio || '#0000ff'} onChange={handleColorChange('corConvenio')} />
              <PresentationField label="Compromissos:" value={currentDraft.corCompromisso || '#00e5ef'} onChange={handleColorChange('corCompromisso')} />
            </div>
          </section>

          <section className="agenda-apresentacao-card agenda-apresentacao-card--fonte">
            <div className="agenda-apresentacao-card-title">Tipo de letra (fonte)</div>
            <div className="agenda-apresentacao-fonte-actions">
              <button type="button" className="ant-btn ant-btn-default" onClick={() => setFonteOpen(true)}>
                <span>Altera letra...</span>
              </button>
            </div>
            <div className="agenda-apresentacao-previews" aria-label="Previews de apresentação">
              <PreviewBox
                label="Particular"
                color={currentDraft.corParticular || '#ffff00'}
                fontStyle={fontePreviewStyle}
              />
              <PreviewBox
                label="Convênio"
                color={currentDraft.corConvenio || '#0000ff'}
                fontStyle={fontePreviewStyle}
              />
              <PreviewBox
                label="Compromisso"
                color={currentDraft.corCompromisso || '#00e5ef'}
                fontStyle={fontePreviewStyle}
              />
            </div>
          </section>
        </div>
      </div>
      <AgendaFonteModal
        open={fonteOpen}
        value={fonteAtual}
        onCancel={() => setFonteOpen(false)}
        onConfirm={handleFonteConfirm}
      />
    </>
  );
}
