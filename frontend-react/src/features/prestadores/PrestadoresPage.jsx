import { useState } from 'react';

import { BranaCard } from '../../components/BranaCard.jsx';
import { PrestadoresTable } from './PrestadoresTable.jsx';
import { PrestadoresToolbar } from './PrestadoresToolbar.jsx';

export function PrestadoresPage() {
  const [especialidade, setEspecialidade] = useState('');
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="prestadores-page">
      <div className="prestadores-shell-l">
        <div className="prestadores-shell-band">
          <PrestadoresToolbar
            especialidade={especialidade}
            searchValue={searchValue}
            onEspecialidadeChange={setEspecialidade}
            onSearchChange={setSearchValue}
          />
        </div>

        <BranaCard className="prestadores-shell-card" bodyStyle={{ padding: 0 }}>
          <PrestadoresTable selectedId={null} />
        </BranaCard>
      </div>
    </div>
  );
}
