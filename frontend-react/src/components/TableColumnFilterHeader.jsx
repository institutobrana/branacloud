import { CheckOutlined, FilterOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Space, Typography } from 'antd';

export function TableColumnFilterHeader({
  label,
  activeSort,
  onSortAsc,
  onSortDesc,
  columns,
  onToggleColumn,
  filterValue = '',
  onFilterValueChange,
  onFilterApply,
  onFilterClear,
  activeFilter = false,
  hideLabel,
}) {
  const hasFilterControls = Boolean(onFilterValueChange || onFilterApply || onFilterClear);

  return (
    <div className={`auxiliary-filter-header${hideLabel ? ' is-icon-only' : ''}`}>
      {hideLabel ? null : <span>{label}</span>}
      <Dropdown
        trigger={['click']}
        rootClassName="brana-column-filter-dropdown"
        dropdownRender={() => (
          <div className="auxiliary-filter-menu" onClick={(event) => event.stopPropagation()}>
            <Typography.Text strong className="auxiliary-filter-menu-title">
              {label}
            </Typography.Text>
            {onSortAsc ? (
              <button type="button" className="auxiliary-filter-menu-item" onClick={onSortAsc}>
                Ordem Ascendente
                {activeSort === 'asc' ? <CheckOutlined /> : null}
              </button>
            ) : null}
            {onSortDesc ? (
              <button type="button" className="auxiliary-filter-menu-item" onClick={onSortDesc}>
                Ordem Descendente
                {activeSort === 'desc' ? <CheckOutlined /> : null}
              </button>
            ) : null}
            {(onSortAsc || onSortDesc) ? <div className="auxiliary-filter-menu-separator" /> : null}
            {hasFilterControls ? (
              <>
                <div className="auxiliary-filter-menu-subtitle">Filtro</div>
                <div className="auxiliary-filter-menu-filter">
                  <Input
                    value={filterValue}
                    allowClear
                    size="small"
                    placeholder={`Filtrar ${label.toLowerCase()}`}
                    onChange={(event) => onFilterValueChange?.(event.target.value)}
                    onPressEnter={() => onFilterApply?.()}
                  />
                  <Space size={6} className="auxiliary-filter-menu-actions">
                    <Button size="small" type="primary" onClick={() => onFilterApply?.()}>
                      Aplicar
                    </Button>
                    <Button size="small" onClick={() => onFilterClear?.()}>
                      Limpar
                    </Button>
                  </Space>
                </div>
                <div className="auxiliary-filter-menu-separator" />
              </>
            ) : null}
            <div className="auxiliary-filter-menu-subtitle">Colunas</div>
            <div className="auxiliary-filter-menu-columns">
              {columns.map((column) => (
                <label key={column.key} className={`auxiliary-filter-menu-checkbox${column.locked ? ' is-disabled' : ''}`}>
                  <input
                    type="checkbox"
                    checked={column.visible}
                    disabled={column.locked}
                    onChange={() => onToggleColumn(column.key)}
                  />
                  <span>{column.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        >
        <button
          type="button"
          className={`auxiliary-filter-trigger${activeFilter ? ' is-active' : ''}`}
          aria-label={`Abrir filtro de ${label}`}
        >
          <FilterOutlined />
        </button>
      </Dropdown>
    </div>
  );
}
