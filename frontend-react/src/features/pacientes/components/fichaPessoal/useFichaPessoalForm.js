import { useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { buscarContatosIndicacao, buscarPacientesIndicacao, buscarSugestoesPorSobrenome, createPaciente, deletePaciente, listarAuxiliarFicha, listarConveniosPlanosCombos, listarOpcoesFichaPaciente, listarPrestadoresFicha, listarTiposIndicacao, listarUnidadesFicha, lookupCep, obterPreferenciasGerais, obterProximoCodigoPaciente, updatePaciente } from './fichaPessoalApi.js';
import { obterPaciente } from '../../pacientesApi.js';
import { EMPTY_COMPLEMENTARY, normalizeComplementary } from './dadosComplementares/dadosComplementaresOptions.js';

const today = () => dayjs().format('DD/MM/YYYY');

const initialForm = () => ({
  codigo: '', nome: '', sobrenome: '', sexo: 'Masculino', nascimento: null, dataCadastro: today(), status: 'Ativo',
  cpf: '', rg: '', tipoIndicacao: '', indicadoPor: '', correspondencia: '', endereco: '', complemento: '', bairro: '',
  cidade: 'São José do Rio Preto', cep: '', uf: 'SP', email: '', matricula: '', complementares: { ...EMPTY_COMPLEMENTARY },
  tipo_fone1: 'Residencial', fone1: '', tipo_fone2: 'Comercial', fone2: '', tipo_fone3: 'Celular', fone3: '', tipo_fone4: 'Recado', fone4: '',
  id_convenio: null, id_plano: null, carteira: '', validade: null, tabela: null, cns: '', fotoDataUrl: '', fotoNome: '', proximoRetorno: '?', inclusao: today(), alteracao: today(),
});

function displayDate(value) {
  const parsed = value ? dayjs(value) : null;
  return parsed?.isValid?.() ? parsed.format('DD/MM/YYYY') : (value || '');
}

function mapExistingPaciente(item, current) {
  return {
    ...current,
    codigo: item.codigo == null ? '' : String(item.codigo),
    nome: item.nome || '',
    sobrenome: item.sobrenome || '',
    sexo: item.sexo || '',
    nascimento: item.data_nascimento || null,
    dataCadastro: displayDate(item.data_cadastro),
    status: item.status || '',
    cpf: item.cpf || '',
    rg: item.rg || '',
    tipoIndicacao: item.tipo_indicacao || '',
    indicadoPor: item.indicado_por || '',
    correspondencia: item.correspondencia || '',
    endereco: item.endereco || '',
    complemento: item.complemento || '',
    bairro: item.bairro || '',
    cidade: item.cidade || '',
    cep: item.cep || '',
    uf: item.uf || '',
    email: item.email || '',
    tipo_fone1: item.tipo_fone1 || '', fone1: item.fone1 || '',
    tipo_fone2: item.tipo_fone2 || '', fone2: item.fone2 || '',
    tipo_fone3: item.tipo_fone3 || '', fone3: item.fone3 || '',
    tipo_fone4: item.tipo_fone4 || '', fone4: item.fone4 || '',
    id_convenio: item.id_convenio ?? null,
    id_plano: item.id_plano ?? null,
    validade: item.data_validade_plano || null,
    tabela: item.tabela_codigo ?? null,
    cns: item.cns || '', matricula: item.matricula || '',
    complementares: { ...normalizeComplementary(item.extra), matricula: item.matricula || '' },
    fotoDataUrl: item.extra?.foto_data_url || '',
    fotoNome: item.extra?.foto_nome || '',
    inclusao: displayDate(item.data_cadastro),
    alteracao: displayDate(item.atualizado_em || item.data_cadastro),
  };
}

function comparableForm(form) {
  return {
    codigo: form.codigo || '', nome: form.nome || '', sobrenome: form.sobrenome || '', sexo: form.sexo || '',
    nascimento: form.nascimento?.format?.('YYYY-MM-DD') || form.nascimento || '', dataCadastro: form.dataCadastro || '', status: form.status || '',
    cpf: form.cpf || '', rg: form.rg || '', tipoIndicacao: form.tipoIndicacao || '', indicadoPor: form.indicadoPor || '', correspondencia: form.correspondencia || '',
    endereco: form.endereco || '', complemento: form.complemento || '', bairro: form.bairro || '', cidade: form.cidade || '', cep: form.cep || '', uf: form.uf || '', email: form.email || '',
    tipo_fone1: form.tipo_fone1 || '', fone1: form.fone1 || '', tipo_fone2: form.tipo_fone2 || '', fone2: form.fone2 || '', tipo_fone3: form.tipo_fone3 || '', fone3: form.fone3 || '', tipo_fone4: form.tipo_fone4 || '', fone4: form.fone4 || '',
    id_convenio: form.id_convenio ?? null, id_plano: form.id_plano ?? null, validade: form.validade?.format?.('YYYY-MM-DD') || form.validade || '', tabela: form.tabela ?? null, cns: form.cns || '', matricula: form.matricula || '', complementares: form.complementares || {}, fotoDataUrl: form.fotoDataUrl || '', fotoNome: form.fotoNome || '',
  };
}

export function buildPacientePayload(form) {
  const dateValue = (value) => value?.format?.('YYYY-MM-DD') || value || null;
  return {
    codigo: form.codigo ? Number(form.codigo) : null,
    nome: String(form.nome || '').trim(), sobrenome: form.sobrenome || null, sexo: form.sexo || null,
    data_nascimento: dateValue(form.nascimento), data_cadastro: dateValue(form.dataCadastro), status: form.status || null,
    cpf: form.cpf || null, rg: form.rg || null, tipo_indicacao: form.tipoIndicacao || null, indicado_por: form.indicadoPor || null,
    correspondencia: form.correspondencia || null, endereco: form.endereco || null, complemento: form.complemento || null, bairro: form.bairro || null,
    cidade: form.cidade || null, cep: form.cep || null, uf: form.uf || null, email: form.email || null,
    tipo_fone1: form.tipo_fone1 || null, fone1: form.fone1 || null, tipo_fone2: form.tipo_fone2 || null, fone2: form.fone2 || null,
    tipo_fone3: form.tipo_fone3 || null, fone3: form.fone3 || null, tipo_fone4: form.tipo_fone4 || null, fone4: form.fone4 || null,
    id_convenio: form.id_convenio || null, id_plano: form.id_plano || null, data_validade_plano: dateValue(form.validade), tabela_codigo: form.tabela || null, cns: form.cns || null,
    matricula: form.matricula || null,
    extra: { ...(form.complementares || {}), foto_data_url: form.fotoDataUrl || null, foto_nome: form.fotoNome || null },
  };
}

export function useFichaPessoalForm(open, mode = 'new', patientId = null) {
  const [form, setForm] = useState(initialForm);
  const [complementaryCatalogs, setComplementaryCatalogs] = useState({ unidades: [], cirurgioes: [], estadoCivil: [], bairros: [], cidades: [], palavrasChave: [], ufs: ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'] });
  const [catalogs, setCatalogs] = useState({ menu: null, convenios: [], planos: [], tabelas: [], tiposIndicacao: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [pacienteId, setPacienteId] = useState(null);
  const [isNew, setIsNew] = useState(true);
  const [originalForm, setOriginalForm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [cepLookupLoading, setCepLookupLoading] = useState(false);
  const [cepLookupError, setCepLookupError] = useState('');
  const [indicacaoResultados, setIndicacaoResultados] = useState([]);
  const [indicacaoLoading, setIndicacaoLoading] = useState(false);
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [nameSuggestionsLoading, setNameSuggestionsLoading] = useState(false);
  const indicacaoSeq = useRef(0);
  const lastCepLookup = useRef({ residential: '', commercial: '' });
  const cepLookupRequest = useRef({ residential: null, commercial: null });
  const formRef = useRef(form);
  const nameSuggestionsCache = useRef(new Map());
  const nameSuggestionsRequest = useRef(0);
  const responsibleSelectionRequest = useRef(0);

  useEffect(() => { formRef.current = form; }, [form]);

  useEffect(() => {
    if (!open) return undefined;
    let active = true;
    const existingId = Number(patientId);
    const existing = mode === 'existing' && Boolean(existingId);
    setForm(initialForm());
    setPacienteId(existing ? existingId : null);
    setIsNew(!existing);
    setSaving(false);
    setDeleting(false);
    setLoading(true);
    setError('');
    setOriginalForm(null);
    lastCepLookup.current = { residential: '', commercial: '' };
    cepLookupRequest.current = { residential: null, commercial: null };
    nameSuggestionsCache.current.clear();
    setNameSuggestions([]);
    setIndicacaoResultados([]);
    const requests = existing
      ? [obterPaciente(existingId), listarOpcoesFichaPaciente(), listarConveniosPlanosCombos(), listarTiposIndicacao(), listarAuxiliarFicha('Estado civil'), listarAuxiliarFicha('Bairro'), listarAuxiliarFicha('Cidade'), listarAuxiliarFicha('Palavra chave'), listarUnidadesFicha(), listarPrestadoresFicha()]
      : [obterProximoCodigoPaciente(), listarOpcoesFichaPaciente(), listarConveniosPlanosCombos(), listarTiposIndicacao(), obterPreferenciasGerais(), listarAuxiliarFicha('Estado civil'), listarAuxiliarFicha('Bairro'), listarAuxiliarFicha('Cidade'), listarAuxiliarFicha('Palavra chave'), listarUnidadesFicha(), listarPrestadoresFicha()];
    Promise.allSettled(requests)
      .then((results) => {
        const [primary, menu, combos, indicacoes] = results;
        const preferencias = existing ? null : results[4];
        const offset = existing ? 4 : 5;
        if (!active) return;
        if (existing && primary.status !== 'fulfilled') {
          setPacienteId(null);
          setIsNew(false);
          setError(primary.reason?.message || 'Falha ao carregar o paciente.');
          return;
        }
        const nextMenu = menu.status === 'fulfilled' ? menu.value : null;
        const nextCombos = combos.status === 'fulfilled' ? combos.value : {};
        const aux = (index) => results[offset + index]?.status === 'fulfilled' ? results[offset + index].value : [];
        const unidades = results[offset + 4]?.status === 'fulfilled' ? results[offset + 4].value : [];
        const prestadores = results[offset + 5]?.status === 'fulfilled' ? results[offset + 5].value : {};
        setComplementaryCatalogs({ unidades: (Array.isArray(unidades) ? unidades : []).map((item) => String(item?.nome || item?.descricao || '').trim()).filter(Boolean), cirurgioes: (prestadores?.itens || []).map((item) => String(item?.nome || '').trim()).filter(Boolean), estadoCivil: aux(0), bairros: aux(1), cidades: aux(2), palavrasChave: aux(3), ufs: ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'] });
        setCatalogs({ menu: nextMenu, convenios: nextCombos.convenios || [], planos: nextCombos.planos || [], tabelas: nextCombos.tabelas || [], tiposIndicacao: indicacoes.status === 'fulfilled' ? indicacoes.value : [] });
        if (existing) {
          const nextForm = mapExistingPaciente(primary.value, initialForm());
          setForm(nextForm);
          setOriginalForm(nextForm);
        } else {
          const preferenceValues = preferencias?.status === 'fulfilled' ? (preferencias.value?.values || {}) : {};
          const preferredConvenioId = Number(preferenceValues.convenio_padrao_id || 0);
          const preferredConvenio = nextCombos.convenios?.find((item) =>
            Number(item.row_id || 0) === preferredConvenioId ||
            Number(item.id || 0) === preferredConvenioId
          )?.id ?? 0;
          const preferredTabelaRowId = Number(preferenceValues.tabela_padrao_id || 0);
          const preferredTabela = nextCombos.tabelas?.find((item) => Number(item.row_id) === preferredTabelaRowId);
          const preferredPlano = nextCombos.planos?.find((item) =>
            Number(item.convenio_id || 0) === Number(preferredConvenio || 0)
            && !item.inativo
          );
          const nextForm = { ...initialForm(),
            codigo: primary.status === 'fulfilled' ? String(primary.value?.codigo || '') : '',
            sexo: nextMenu?.sexo?.[0]?.label || 'Masculino',
            status: nextMenu?.filtro_status?.find((item) => /ativo/i.test(item.label) && !/todos/i.test(item.label))?.label || 'Ativo',
            correspondencia: 'Residencial',
            id_convenio: preferredConvenio || 0,
            id_plano: preferredPlano?.id ?? null,
            tabela: preferredTabela?.id ?? null,
          };
          setForm(nextForm);
          setOriginalForm(nextForm);
        }
        if ([primary, menu, combos, indicacoes, ...results.slice(offset)].some((item) => item.status === 'rejected')) setError('Alguns catálogos não puderam ser carregados.');
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [open, mode, patientId]);

  const setField = (field, value) => {
    const next = { ...formRef.current, [field]: value };
    formRef.current = next;
    setForm(next);
  };
  const buscarIndicacao = async (tipo, termo) => {
    const seq = ++indicacaoSeq.current;
    const query = String(termo || '').trim();
    if (query.length === 1) { setIndicacaoResultados([]); return []; }
    setIndicacaoLoading(true);
    try {
      const data = tipo === 'contato' ? await buscarContatosIndicacao(query) : await buscarPacientesIndicacao(query);
      if (seq !== indicacaoSeq.current) return [];
      const itens = Array.isArray(data) ? data : [];
      const resultados = itens.map((item) => ({
        id: item.id,
        codigo: item.codigo,
        nome: item.nome_completo || [item.nome, item.sobrenome].filter(Boolean).join(' ') || item.nome || '',
        tipo,
      }));
      setIndicacaoResultados(resultados);
      return resultados;
    } finally {
      if (seq === indicacaoSeq.current) setIndicacaoLoading(false);
    }
  };
  const limparIndicacao = () => {
    indicacaoSeq.current += 1;
    setIndicacaoResultados([]);
  };
  useEffect(() => {
    nameSuggestionsCache.current.clear();
    setNameSuggestions([]);
  }, [form.sobrenome]);
  const buscarSugestoesSobrenome = async () => {
    const reference = String(formRef.current.sobrenome || '').trim();
    if (reference.length < 2) { setNameSuggestions([]); return []; }
    if (nameSuggestionsCache.current.has(reference)) {
      const cached = nameSuggestionsCache.current.get(reference);
      setNameSuggestions(cached);
      return cached;
    }
    const requestId = ++nameSuggestionsRequest.current;
    setNameSuggestionsLoading(true);
    try {
      const data = await buscarSugestoesPorSobrenome(reference);
      const values = Array.isArray(data) ? data : [];
      nameSuggestionsCache.current.set(reference, values);
      if (requestId === nameSuggestionsRequest.current && String(formRef.current.sobrenome || '').trim() === reference) setNameSuggestions(values);
      return values;
    } catch {
      if (requestId === nameSuggestionsRequest.current) setNameSuggestions([]);
      return [];
    } finally {
      if (requestId === nameSuggestionsRequest.current) setNameSuggestionsLoading(false);
    }
  };
  const selecionarResponsavel = async (item) => {
    const requestId = ++responsibleSelectionRequest.current;
    const nome = String(item?.nome_completo || '');
    setForm((current) => ({ ...current, complementares: { ...current.complementares, responsavel: nome } }));
    try {
      const detail = await obterPaciente(item?.id);
      if (requestId !== responsibleSelectionRequest.current) return;
      setForm((current) => (current.complementares.responsavel === nome
        ? ({ ...current, complementares: { ...current.complementares, cpf_responsavel: String(detail?.cpf || '') } })
        : current));
    } catch {
      if (requestId === responsibleSelectionRequest.current) setForm((current) => ({ ...current, complementares: { ...current.complementares, responsavel: nome, cpf_responsavel: '' } }));
    }
  };
  const lookupCepForForm = async (value, target = 'residential') => {
    const isCommercial = target === 'commercial';
    const digits = String(value || '').replace(/\D/g, '');
    if (digits.length !== 8 || digits === lastCepLookup.current[target]) return;
    if (cepLookupRequest.current[target]?.cep === digits) return cepLookupRequest.current[target].promise;
    const formatted = `${digits.slice(0, 5)}-${digits.slice(5)}`;
    if (isCommercial) {
      const next = { ...formRef.current, complementares: { ...formRef.current.complementares, cep_tra: formatted } };
      formRef.current = next;
      setForm(next);
    } else setField('cep', formatted);
    setCepLookupError('');
    setCepLookupLoading(true);
    const promise = lookupCep(digits)
      .then((result) => {
        const currentCep = isCommercial ? formRef.current.complementares?.cep_tra : formRef.current.cep;
        if (String(currentCep || '').replace(/\D/g, '') !== digits) return result;
        setForm((current) => isCommercial
          ? ({ ...current, complementares: { ...current.complementares, cep_tra: formatted, end_tra: result.endereco || current.complementares.end_tra, bai_tra: result.bairro || current.complementares.bai_tra, cid_tra: result.cidade || current.complementares.cid_tra, est_tra: result.uf || current.complementares.est_tra } })
          : ({ ...current, cep: formatted, endereco: result.endereco || current.endereco, bairro: result.bairro || current.bairro, cidade: result.cidade || current.cidade, uf: result.uf || current.uf }));
        lastCepLookup.current[target] = digits;
        return result;
      })
      .catch((lookupError) => {
        const currentCep = isCommercial ? formRef.current.complementares?.cep_tra : formRef.current.cep;
        if (String(currentCep || '').replace(/\D/g, '') === digits) setCepLookupError(lookupError?.message || 'CEP não encontrado.');
        return null;
      })
      .finally(() => {
        if (cepLookupRequest.current[target]?.cep === digits) {
          cepLookupRequest.current[target] = null;
          setCepLookupLoading(false);
        }
      });
    cepLookupRequest.current[target] = { cep: digits, promise };
    return promise;
  };
  const dirty = Boolean(originalForm) && JSON.stringify(comparableForm(form)) !== JSON.stringify(comparableForm(originalForm));
  const save = async () => {
    if (saving || (!isNew && !dirty)) return null;
    const nome = String(form.nome || '').trim();
    if (!nome) {
      setError('Informe o nome do paciente.');
      return null;
    }
    setSaving(true);
    setError('');
    const payload = buildPacientePayload({ ...form, nome });
    try {
      const saved = isNew ? await createPaciente(payload) : await updatePaciente(pacienteId, payload);
      setPacienteId(saved?.id ?? pacienteId);
      setIsNew(false);
      const nextForm = mapExistingPaciente(saved || {}, { ...form, codigo: String(saved?.codigo ?? form.codigo), nome: saved?.nome || nome });
      setForm(nextForm);
      setOriginalForm(nextForm);
      return saved;
    } catch (saveError) {
      setError(saveError?.message || 'Falha ao gravar o paciente.');
      return null;
    } finally {
      setSaving(false);
    }
  };
  const remove = async () => {
    if (deleting || isNew || !pacienteId) return false;
    setDeleting(true);
    setError('');
    try {
      await deletePaciente(pacienteId);
      return true;
    } catch (deleteError) {
      setError(deleteError?.message || 'Falha ao eliminar o paciente.');
      return false;
    } finally {
      setDeleting(false);
    }
  };
  const idade = useMemo(() => {
    if (!form.nascimento) return '?';
    const birth = dayjs(form.nascimento);
    if (!birth.isValid()) return '?';
    return String(dayjs().diff(birth, 'year'));
  }, [form.nascimento]);

  const setComplementares = (value) => setField('complementares', value);
  return { form, setField, setComplementares, complementaryCatalogs, idade, catalogs, loading, error, saving, deleting, pacienteId, hasPersistedPaciente: Boolean(pacienteId), isNew, dirty, save, remove, lookupCep: lookupCepForForm, lookupCepCommercial: (value) => lookupCepForForm(value, 'commercial'), cepLookupLoading, cepLookupError, buscarIndicacao, limparIndicacao, indicacaoResultados, indicacaoLoading, nameSuggestions, nameSuggestionsLoading, buscarSugestoesSobrenome, selecionarResponsavel };
}
