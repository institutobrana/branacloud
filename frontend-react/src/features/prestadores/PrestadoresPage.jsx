import { useState } from 'react';

import { PrestadoresTable } from './PrestadoresTable.jsx';
import { PrestadoresToolbar } from './PrestadoresToolbar.jsx';

export function PrestadoresPage() {
  const [especialidade, setEspecialidade] = useState('');
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="prestadores-page servicos-protetico-page">
      <PrestadoresToolbar
        especialidade={especialidade}
        searchValue={searchValue}
        onEspecialidadeChange={setEspecialidade}
        onSearchChange={setSearchValue}
      />

      <PrestadoresTable selectedId={null} />
    </div>
  );
}
