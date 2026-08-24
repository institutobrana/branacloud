import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { createPaciente, deletePaciente, listarConveniosPlanosCombos, listarOpcoesFichaPaciente, listarTiposIndicacao, obterProximoCodigoPaciente, updatePaciente } from './fichaPessoalApi.js';
import { obterPaciente } from '../../pacientesApi.js';

const today = () => dayjs().format('DD/MM/YYYY');

const initialForm = () => ({
  codigo: '', nome: '', sobrenome: '', sexo: 'Masculino', nascimento: null, dataCadastro: today(), status: 'Ativo',
  cpf: '', rg: '', tipoIndicacao: '', indicadoPor: '', correspondencia: '', endereco: '', complemento: '', bairro: '',
  cidade: 'São José do Rio Preto', cep: '', uf: 'SP', email: '',
  tipo_fone1: 'Residencial', fone1: '', tipo_fone2: 'Comercial', fone2: '', tipo_fone3: 'Celular', fone3: '', tipo_fone4: 'Recado', fone4: '',
  id_convenio: null, id_plano: null, carteira: '', validade: null, tabela: null, cns: '', proximoRetorno: '?', inclusao: today(), alteracao: today(),
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
    cns: item.cns || '',
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
    id_convenio: form.id_convenio ?? null, id_plano: form.id_plano ?? null, validade: form.validade?.format?.('YYYY-MM-DD') || form.validade || '', tabela: form.tabela ?? null, cns: form.cns || '',
  };
}

function buildPacientePayload(form) {
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
  };
}

export function useFichaPessoalForm(open, mode = 'new', patientId = null) {
  const [form, setForm] = useState(initialForm);
  const [catalogs, setCatalogs] = useState({ menu: null, convenios: [], planos: [], tabelas: [], tiposIndicacao: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [pacienteId, setPacienteId] = useState(null);
  const [isNew, setIsNew] = useState(true);
  const [originalForm, setOriginalForm] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
    const requests = existing
      ? [obterPaciente(existingId), listarOpcoesFichaPaciente(), listarConveniosPlanosCombos(), listarTiposIndicacao()]
      : [obterProximoCodigoPaciente(), listarOpcoesFichaPaciente(), listarConveniosPlanosCombos(), listarTiposIndicacao()];
    Promise.allSettled(requests)
      .then(([primary, menu, combos, indicacoes]) => {
        if (!active) return;
        if (existing && primary.status !== 'fulfilled') {
          setPacienteId(null);
          setIsNew(false);
          setError(primary.reason?.message || 'Falha ao carregar o paciente.');
          return;
        }
        const nextMenu = menu.status === 'fulfilled' ? menu.value : null;
        const nextCombos = combos.status === 'fulfilled' ? combos.value : {};
        setCatalogs({ menu: nextMenu, convenios: nextCombos.convenios || [], planos: nextCombos.planos || [], tabelas: nextCombos.tabelas || [], tiposIndicacao: indicacoes.status === 'fulfilled' ? indicacoes.value : [] });
        if (existing) {
          const nextForm = mapExistingPaciente(primary.value, initialForm());
          setForm(nextForm);
          setOriginalForm(nextForm);
        } else {
          const nextForm = { ...initialForm(),
            codigo: primary.status === 'fulfilled' ? String(primary.value?.codigo || '') : '',
            sexo: nextMenu?.sexo?.[0]?.label || 'Masculino',
            status: nextMenu?.filtro_status?.find((item) => /ativo/i.test(item.label) && !/todos/i.test(item.label))?.label || 'Ativo',
            correspondencia: 'Residencial',
            id_convenio: nextCombos.convenios?.find((item) => /particular/i.test(item.nome))?.id ?? null,
            id_plano: nextCombos.planos?.find((item) => /principal/i.test(item.nome))?.id ?? null,
            tabela: nextCombos.tabelas?.find((item) => /particular/i.test(item.nome))?.id ?? null,
          };
          setForm(nextForm);
          setOriginalForm(nextForm);
        }
        if ([primary, menu, combos, indicacoes].some((item) => item.status === 'rejected')) setError(existing ? 'Alguns catálogos não puderam ser carregados.' : 'Alguns catálogos não puderam ser carregados.');
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [open, mode, patientId]);

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
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

  return { form, setField, idade, catalogs, loading, error, saving, deleting, pacienteId, hasPersistedPaciente: Boolean(pacienteId), isNew, dirty, save, remove };
}
