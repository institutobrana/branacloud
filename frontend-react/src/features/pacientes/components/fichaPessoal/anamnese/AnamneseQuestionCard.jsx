import { nextYesNoAnswer, normalizeAnswer, shouldShowAlert } from './anamneseUtils.js';

function AnamneseAnswerField({ type, value, label, onChange }) {
  return <label className="ficha-anamnese-complemento-wrap" data-anamnese-answer-label={label || ''}>
    <span className={label ? '' : 'ficha-anamnese-answer-label-spacer'} aria-hidden={label ? undefined : 'true'}>{label}</span>
    <textarea data-anamnese-answer-field value={value || ''} readOnly={!label ? true : undefined} onChange={(event) => onChange?.(event.target.value)} aria-label={label || 'Superficie visual reservada'} tabIndex={label ? undefined : -1} />
  </label>;
}

export function AnamneseQuestionCard({ item, onChange }) {
  const type = Number(item.tipo_resposta || 1);
  const parsed = normalizeAnswer(item.resposta, type);
  const showAlert = shouldShowAlert(item, parsed.answer);
  const setBooleanAnswer = (event, answer) => {
    event.preventDefault();
    onChange?.(item.pergunta_id, nextYesNoAnswer(parsed.answer, answer), parsed.complement);
  };
  return <article className="ficha-anamnese-card">
    <div className="ficha-anamnese-question-head">
      <div className="ficha-anamnese-alerta">{showAlert ? <img src="/assets/easy/ico_dedo.bmp" alt="Alerta critico" /> : null}</div>
      <div className="ficha-anamnese-num">{item.numero})</div>
      <div className="ficha-anamnese-texto">{item.texto}</div>
    </div>
    <div className="ficha-anamnese-answer-row">
      <div className="ficha-anamnese-opcoes" role="group" aria-label={`Resposta visual da pergunta ${item.numero}`}>
        <label><input type="radio" checked={parsed.answer === 'sim'} readOnly disabled={type === 3} onClick={(event) => setBooleanAnswer(event, 'sim')} /> Sim</label>
        <label><input type="radio" checked={parsed.answer === 'nao'} readOnly disabled={type === 3} onClick={(event) => setBooleanAnswer(event, 'nao')} /> Nao</label>
      </div>
      <div className="ficha-anamnese-answer-slot">
        {type === 2 ? <AnamneseAnswerField type={type} label="Complemento / observacao" value={parsed.complement} onChange={(value) => onChange?.(item.pergunta_id, parsed.answer, value)} /> : null}
        {type === 3 ? <AnamneseAnswerField type={type} label="Resposta textual" value={parsed.answer} onChange={(value) => onChange?.(item.pergunta_id, value, '')} /> : null}
        {type !== 2 && type !== 3 ? <AnamneseAnswerField type={type} label="" value="" /> : null}
      </div>
    </div>
  </article>;
}
