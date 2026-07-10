import { buildApiUrl } from '../../services/api.js';

async function requestJson(path, options = {}) {
  const response = await fetch(buildApiUrl(path), options);
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error((data && (data.detail || data.message)) || 'Falha ao processar a requisicao.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function getAuthHeaders() {
  const token = window.localStorage.getItem('brana_token') || '';
  if (!token) {
    const error = new Error('Sessao expirada.');
    error.status = 401;
    throw error;
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

function normalizeProcedimentoGenerico(item) {
  return {
    id: Number(item?.id || 0) || 0,
    codigo: String(item?.codigo || '').trim(),
    descricao: String(item?.descricao || '').trim(),
    especialidade: String(item?.especialidade || '').trim(),
    status: String(item?.status || (item?.inativo ? 'Inativo' : 'Ativo')).trim(),
    inativo: Boolean(item?.inativo),
    instrucao_direta: String(item?.instrucao_direta || item?.observacoes || '').trim(),
    total_fases: Number(item?.total_fases || 0) || 0,
    total_materiais: Number(item?.total_materiais || 0) || 0,
  };
}

function normalizeProcedimentoGenericoDetalhe(item) {
  const normalizado = normalizeProcedimentoGenerico(item);
  return {
    ...normalizado,
    peso: Number(item?.peso || 0) || 0,
    simbolo_grafico: String(item?.simbolo_grafico || '').trim(),
    simbolo_grafico_legacy_id: Number(item?.simbolo_grafico_legacy_id || 0) || null,
    mostrar_simbolo: Boolean(item?.mostrar_simbolo),
    observacoes: String(item?.observacoes || '').trim(),
    data_inclusao: String(item?.data_inclusao || '').trim(),
    data_alteracao: String(item?.data_alteracao || '').trim(),
    tempo: Number(item?.tempo || 0) || 0,
    custo_lab: Number(item?.custo_lab || 0) || 0,
    fases: Array.isArray(item?.fases)
      ? item.fases.map((fase, index) => ({
          codigo: String(fase?.codigo || '').trim(),
          descricao: String(fase?.descricao || '').trim(),
          sequencia: Number(fase?.sequencia || index + 1) || index + 1,
          tempo: Number(fase?.tempo || 0) || 0,
        }))
      : [],
    materiais: Array.isArray(item?.materiais)
      ? item.materiais.map((material) => ({
          material_id: Number(material?.material_id || 0) || 0,
          codigo: String(material?.codigo || '').trim(),
          nome: String(material?.nome || '').trim(),
          quantidade: Number(material?.quantidade || 0) || 0,
          custo_und: Number(material?.custo_und || 0) || 0,
        }))
      : [],
    vinculos: Array.isArray(item?.vinculos)
      ? item.vinculos.map((vinculo) => ({
          id: Number(vinculo?.id || 0) || 0,
          tabela_id: Number(vinculo?.tabela_id || 0) || 0,
          tabela_nome: String(vinculo?.tabela_nome || '').trim(),
          codigo: String(vinculo?.codigo || '').trim(),
          nome: String(vinculo?.nome || '').trim(),
        }))
      : [],
  };
}

export async function listarProcedimentosGenericos(params = {}) {
  const search = new URLSearchParams();
  if (params.q) search.set('q', params.q);
  if (params.especialidade) search.set('especialidade', params.especialidade);

  const data = await requestJson(`/cadastros/procedimentos-genericos${search.toString() ? `?${search.toString()}` : ''}`, {
    headers: getAuthHeaders(),
  });
  return Array.isArray(data) ? data.map(normalizeProcedimentoGenerico) : [];
}

export async function obterProcedimentoGenericoDetalhe(id) {
  const data = await requestJson(`/cadastros/procedimentos-genericos/detalhe/${id}`, {
    headers: getAuthHeaders(),
  });
  return normalizeProcedimentoGenericoDetalhe(data);
}

export async function obterProximoCodigoProcedimentoGenerico() {
  const data = await requestJson('/cadastros/procedimentos-genericos/proximo-codigo', {
    headers: getAuthHeaders(),
  });
  return String(data?.codigo || '').trim();
}

export async function salvarProcedimentoGenerico({ id, payload }) {
  const method = id ? 'PUT' : 'POST';
  const path = id ? `/cadastros/procedimentos-genericos/${id}` : '/cadastros/procedimentos-genericos';
  const data = await requestJson(path, {
    method,
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return normalizeProcedimentoGenericoDetalhe(data);
}

export async function carregarCenarioProcedimentoGenerico() {
  const data = await requestJson('/cenario', {
    headers: getAuthHeaders(),
  });
  return {
    cfph: Number(data?.cfph || 0) || 0,
    cfpm: Number(data?.cfpm || 0) || 0,
  };
}

export async function listarProcedimentosGenericosEspecialidades() {
  const data = await requestJson('/procedimentos/filtros', {
    headers: getAuthHeaders(),
  });
  return Array.isArray(data?.especialidades) ? data.especialidades : [];
}

export async function listarSimbolosGraficoGenericos() {
  const data = await requestJson('/cadastros/simbolos-graficos?scope=genericos', {
    headers: getAuthHeaders(),
  });
  return Array.isArray(data) ? data : [];
}
