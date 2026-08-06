import { useEffect, useRef, useState } from 'react';

import { listSimbolosGraficosEspecialidades } from '../simbolosGraficosApi.js';
import { getSimboloGraficoEditorBaseLibrary } from '../model/simboloGraficoEditorBaseLibrary.js';
import { mapSimboloGraficoEspecialidadesCatalog } from '../model/simboloGraficoEspecialidadesMapper.js';

function createCatalogState() {
  const biblioteca = getSimboloGraficoEditorBaseLibrary();
  return {
    especialidades: [],
    loadingEspecialidades: true,
    especialidadesError: '',
    especialidadesEmpty: false,
    biblioteca,
    bibliotecaLoading: false,
    bibliotecaError: '',
    bibliotecaEmpty: biblioteca.length === 0,
  };
}

export function useSimboloGraficoCatalogs() {
  const mountedRef = useRef(true);
  const especialidadesRequestRef = useRef(0);
  const [state, setState] = useState(() => createCatalogState());

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const requestId = ++especialidadesRequestRef.current;
    setState((current) => ({
      ...current,
      loadingEspecialidades: true,
      especialidadesError: '',
      especialidadesEmpty: false,
    }));

    let active = true;
    (async () => {
      try {
        const payload = await listSimbolosGraficosEspecialidades();
        if (!mountedRef.current || !active || requestId !== especialidadesRequestRef.current) return;

        const especialidades = mapSimboloGraficoEspecialidadesCatalog(payload);
        setState((current) => ({
          ...current,
          especialidades,
          loadingEspecialidades: false,
          especialidadesError: '',
          especialidadesEmpty: especialidades.length === 0,
        }));
      } catch (error) {
        if (!mountedRef.current || !active || requestId !== especialidadesRequestRef.current) return;
        setState((current) => ({
          ...current,
          especialidades: [],
          loadingEspecialidades: false,
          especialidadesError: error?.message || 'Falha ao carregar especialidades.',
          especialidadesEmpty: false,
        }));
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const reloadEspecialidades = () => {
    const requestId = ++especialidadesRequestRef.current;
    setState((current) => ({
      ...current,
      loadingEspecialidades: true,
      especialidadesError: '',
      especialidadesEmpty: false,
    }));

    (async () => {
      try {
        const payload = await listSimbolosGraficosEspecialidades();
        if (!mountedRef.current || requestId !== especialidadesRequestRef.current) return;

        const especialidades = mapSimboloGraficoEspecialidadesCatalog(payload);
        setState((current) => ({
          ...current,
          especialidades,
          loadingEspecialidades: false,
          especialidadesError: '',
          especialidadesEmpty: especialidades.length === 0,
        }));
      } catch (error) {
        if (!mountedRef.current || requestId !== especialidadesRequestRef.current) return;
        setState((current) => ({
          ...current,
          especialidades: [],
          loadingEspecialidades: false,
          especialidadesError: error?.message || 'Falha ao carregar especialidades.',
          especialidadesEmpty: false,
        }));
      }
    })();
  };

  return {
    especialidades: state.especialidades,
    loadingEspecialidades: state.loadingEspecialidades,
    especialidadesError: state.especialidadesError,
    especialidadesEmpty: state.especialidadesEmpty,
    reloadEspecialidades,
    biblioteca: state.biblioteca,
    bibliotecaLoading: state.bibliotecaLoading,
    bibliotecaError: state.bibliotecaError,
    bibliotecaEmpty: state.bibliotecaEmpty,
  };
}
