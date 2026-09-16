import { useEffect, useLayoutEffect, useRef } from 'react';
import './agendaContextMenu.css';

const FREE_ITEMS = [{ key: 'novo', label: 'Novo agendamento...' }];
const EVENT_ITEMS = [
  { key: 'editar', label: 'Editar agendamento...' },
  { key: 'excluir', label: 'Excluir agendamento' },
  { key: 'separator', separator: true },
  { key: 'repetir', label: 'Repetir agendamento...' },
  { key: 'odontograma', label: 'Abrir odontograma...', placeholder: true },
  { key: 'ficha', label: 'Abrir ficha pessoal...', placeholder: true },
  { key: 'iguais', label: 'Pesquisar iguais...', placeholder: true },
];

export function AgendaContextMenu({ context, onAction, onClose }) {
  const menuRef = useRef(null);
  const items = context?.kind === 'existing-event' ? EVENT_ITEMS : FREE_ITEMS;

  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu || !context?.open) return undefined;
    const width = menu.offsetWidth || 220;
    const height = menu.offsetHeight || 30;
    const left = Math.max(8, Math.min(context.x, window.innerWidth - width - 8));
    const top = Math.max(8, Math.min(context.y, window.innerHeight - height - 8));
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    return undefined;
  }, [context]);

  useEffect(() => {
    if (!context?.open) return undefined;
    const handleOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) onClose();
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    const handleClose = () => onClose();
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    window.addEventListener('blur', handleClose);
    window.addEventListener('resize', handleClose);
    window.addEventListener('scroll', handleClose, true);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('blur', handleClose);
      window.removeEventListener('resize', handleClose);
      window.removeEventListener('scroll', handleClose, true);
    };
  }, [context?.open, onClose]);

  if (!context?.open) return null;
  return (
    <div ref={menuRef} className="agenda-context-menu" role="menu" style={{ left: context.x, top: context.y }}>
      {items.map((item) => item.separator ? <div key={item.key} className="agenda-context-menu__separator" role="separator" /> : (
        <button
          key={item.key}
          type="button"
          role="menuitem"
          className={`agenda-context-menu__item${item.placeholder ? ' agenda-context-menu__item--placeholder' : ''}`}
          onClick={() => { onClose(); onAction(item.key, context); }}
        >{item.label}</button>
      ))}
    </div>
  );
}
