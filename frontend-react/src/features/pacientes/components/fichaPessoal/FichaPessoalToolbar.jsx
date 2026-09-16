import { Fragment } from 'react';
import { Button } from 'antd';
import { isGravaDisabled } from './fichaPessoalToolbarState.js';
import {
  AppstoreOutlined,
  DeleteOutlined,
  FastBackwardOutlined,
  FastForwardOutlined,
  LeftOutlined,
  PrinterOutlined,
  SaveOutlined,
  RightOutlined,
  PlusOutlined,
} from '@ant-design/icons';

export function FichaPessoalToolbar({ onClose, onSave, onDelete, saving, deleting, isNew, dirty }) {
  const buttons = [
    { label: 'Grava', icon: <SaveOutlined /> },
    { label: 'Novo', icon: <PlusOutlined /> },
    { label: 'Elimina', icon: <DeleteOutlined /> },
    { label: 'Imprime...', icon: <PrinterOutlined /> },
    { label: '|<', icon: <FastBackwardOutlined />, ariaLabel: 'Primeiro paciente', iconOnly: true },
    { label: '<', icon: <LeftOutlined />, ariaLabel: 'Paciente anterior', iconOnly: true },
    { label: '>', icon: <RightOutlined />, ariaLabel: 'Próximo paciente', iconOnly: true },
    { label: '>|', icon: <FastForwardOutlined />, ariaLabel: 'Último paciente', iconOnly: true },
    { label: 'Odontograma', icon: <AppstoreOutlined /> },
  ];

  return (
    <div className="ficha-pessoal-toolbar" role="toolbar" aria-label="Toolbar da Ficha Pessoal">
      {buttons.map(({ label, icon, ariaLabel, iconOnly }) => (
        <Fragment key={label}>
          {label === '|<' || label === 'Odontograma' ? (
            <span className="ficha-pessoal-toolbar-divider" aria-hidden="true" />
          ) : null}
          <Button
            type="default"
            htmlType="button"
            size="small"
            className={`ficha-pessoal-toolbar-button${iconOnly ? ' is-icon-only' : ''}`}
            disabled={label === 'Grava' ? isGravaDisabled({ saving, isNew, dirty }) : label === 'Elimina' ? deleting || isNew : true}
            loading={label === 'Grava' ? saving : label === 'Elimina' ? deleting : false}
            onClick={label === 'Grava' ? onSave : label === 'Elimina' ? onDelete : undefined}
            aria-label={ariaLabel}
            title={ariaLabel || `${label} será implementado em etapa posterior`}
          >
            {icon}
            {!iconOnly ? label : null}
          </Button>
        </Fragment>
      ))}
      <Button type="default" htmlType="button" size="small" className="ficha-pessoal-toolbar-button" onClick={onClose}>
        <LeftOutlined />
        Fecha
      </Button>
    </div>
  );
}
