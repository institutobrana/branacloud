import { buildApiUrl } from '../../services/api.js';

export const ALL_FILTER = '__all__';

async function requestJson(path, options = {}) {
  const token = window.localStorage.getItem('brana_token') || '';
  if (!token) throw new Error('Sessao expirada.');
  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.detail || 'Falha ao carregar fatores de comissão.');
  return data;
}

export async function listarComissoes({ convenioRowId = ALL_FILTER, prestadorRowId = ALL_FILTER } = {}) {
  const params = new URLSearchParams();
  if (convenioRowId !== ALL_FILTER && Number(convenioRowId) > 0) params.set('convenio_row_id', convenioRowId);
  if (prestadorRowId !== ALL_FILTER) params.set('prestador_row_id', Number(prestadorRowId) === 0 ? 0 : prestadorRowId);
  const query = params.toString();
  const data = await requestJson(`/cadastros/prestadores/comissoes${query ? `?${query}` : ''}`);
  return Array.isArray(data?.itens) ? data.itens.map((item) => ({
    ...item,
    id: Number(item.id || item.row_id || 0) || null,
    vigencia: String(item.vigencia ?? '').trim(),
    prestador_nome: String(item.prestador_nome ?? '').trim() || 'Clínica',
    convenio_nome: String(item.convenio_nome ?? '').trim(),
    especialidade: String(item.especialidade ?? '').trim(),
    repasse: String(item.repasse ?? '').trim(),
  })) : [];
}

export async function listarComissaoCombos() {
  const [convenioData, prestadorData] = await Promise.all([
    requestJson('/cadastros/convenios-planos/combos'),
    requestJson('/cadastros/prestadores'),
  ]);
  return {
    convenios: Array.isArray(convenioData?.convenios) ? convenioData.convenios : [],
    prestadores: Array.isArray(prestadorData?.itens) ? prestadorData.itens : [],
  };
}

export async function listarEspecialidadesAtivas() {
  let data = await requestJson('/cadastros/auxiliares/especialidades-ativas');
  if (!Array.isArray(data) || data.length === 0) {
    const fallback = await requestJson('/cadastros/auxiliares?tipo=Especialidade');
    data = Array.isArray(fallback) ? fallback.filter((item) => item?.inativo !== true) : [];
  }
  return Array.isArray(data) ? data.map((item) => ({
    ...item,
    id: Number(item?.id || 0) || 0,
    descricao: String(item?.descricao ?? item?.nome ?? '').trim(),
  })).filter((item) => item.id && item.descricao) : [];
}

export async function listarProcedimentosGenericos() {
  const data = await requestJson('/cadastros/procedimentos-genericos');
  return Array.isArray(data?.itens) ? data.itens : (Array.isArray(data) ? data : []);
}

export async function criarComissao(payload) {
  return requestJson('/cadastros/prestadores/comissoes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {}),
  });
}

export async function atualizarComissao(id, payload) {
  return requestJson(`/cadastros/prestadores/comissoes/${Number(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {}),
  });
}

export async function excluirComissao(id) {
  return requestJson(`/cadastros/prestadores/comissoes/${Number(id)}`, { method: 'DELETE' });
}
