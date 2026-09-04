import { useEffect, useState } from 'react';
import { listarEtiquetasModelos } from '../api/etiquetasApi.js';

export function useEtiquetasModelos(reloadToken = 0) {
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    listarEtiquetasModelos()
      .then((items) => { if (active) setModelos(items); })
      .catch((err) => { if (active) { setModelos([]); setError(err.message || 'Falha ao carregar modelos de etiqueta.'); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reloadToken]);

  return { modelos, loading, error };
}
