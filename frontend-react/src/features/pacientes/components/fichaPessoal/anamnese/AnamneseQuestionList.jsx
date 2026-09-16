import { AnamneseQuestionCard } from './AnamneseQuestionCard.jsx';

export function AnamneseQuestionList({ items, onChange }) {
  return <div className="ficha-anamnese-scroll">{items.length ? <div className="ficha-anamnese-list">{items.map((item) => <AnamneseQuestionCard key={item.pergunta_id} item={item} onChange={onChange} />)}</div> : <div className="ficha-anamnese-state">Nenhuma pergunta encontrada para o questionario selecionado.</div>}</div>;
}
