export function AmbienteSectionList({ sections, active, onSelect }) {
  return <div className="config-preferencias-ambiente-section-list" role="listbox" aria-label="Seção">
    {(sections || []).map((item) => <button type="button" role="option" aria-selected={item.id === active} className={`config-preferencias-ambiente-section${item.id === active ? ' is-active' : ''}`} key={item.id} onClick={() => onSelect(item.id)}>{item.label}</button>)}
  </div>;
}
