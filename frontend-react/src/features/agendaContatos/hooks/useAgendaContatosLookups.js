import { useEffect, useState } from 'react';
import { listarAuxiliares, listarEspecialidades, listarTiposContato } from '../api/agendaContatosApi.js';

export function useAgendaContatosLookups(open) {
  const [lookups, setLookups] = useState({ types: [], bairros: [], cidades: [], palavrasChave: [], especialidades: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!open) return undefined;
    let active = true;
    setLoading(true); setError('');
    Promise.allSettled([listarTiposContato(), listarAuxiliares('Bairro'), listarAuxiliares('Cidade'), listarAuxiliares('Palavra chave'), listarEspecialidades()])
      .then((results) => {
        if (!active) return;
        const [types, bairros, cidades, palavrasChave, especialidades] = results;
        const failed = results.find((result) => result.status === 'rejected');
        setLookups({
          types: types.status === 'fulfilled' ? types.value : [],
          bairros: bairros.status === 'fulfilled' ? bairros.value : [],
          cidades: cidades.status === 'fulfilled' ? cidades.value : [],
          palavrasChave: palavrasChave.status === 'fulfilled' ? palavrasChave.value : [],
          especialidades: especialidades.status === 'fulfilled' ? especialidades.value : [],
        });
        if (failed) setError(failed.reason?.message || 'Falha ao carregar os cadastros auxiliares.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [open]);
  return { ...lookups, loading, error };
}
