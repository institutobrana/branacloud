import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { listarAuxiliares } from '../../tabelasAuxiliares/auxiliaresApi.js';
import { EMPTY_CONVENIO_FORM, mapConvenioAuxiliaryOptions } from '../utils/convenioFormMappers.js';
import { lookupCep } from '../conveniosPlanosApi.js';

export function useConvenioForm(open, initialRecord = null) {
  const [form, setForm] = useState(EMPTY_CONVENIO_FORM);
  const [lookups, setLookups] = useState({ loading: false, error: '', logradouro: [], contato: [], bairro: [], cidade: [] });
  const [cepLookupLoading, setCepLookupLoading] = useState(false);
  const [cepLookupError, setCepLookupError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const cepLookupRequest = useRef(null);
  const lastCepLookup = useRef('');
  const reset = useCallback(() => { setForm({ ...EMPTY_CONVENIO_FORM }); setSubmitError(''); setSubmitting(false); }, []);
  const initialize = useCallback((record) => {
    if (!record) return reset();
    const integerFields = ['tipo_logradouro', 'tipo_fone1', 'tipo_fone2', 'tipo_fone3', 'tipo_fone4'];
    const next = { ...EMPTY_CONVENIO_FORM, ...record };
    integerFields.forEach((field) => { next[field] = record[field] == null ? '' : String(record[field]); });
    next.tipo_faturamento = record.tipo_faturamento == null ? 1 : Number(record.tipo_faturamento);
    next.inativo = Boolean(record.inativo);
    setForm(next); setSubmitError(''); setSubmitting(false);
  }, [reset]);
  const updateField = useCallback((field, value) => setForm((current) => ({ ...current, [field]: value })), []);
  const lookupCepForForm = useCallback(async (value) => {
    const digits = String(value || '').replace(/\D/g, '');
    if (digits.length !== 8 || digits === lastCepLookup.current) return null;
    if (cepLookupRequest.current?.cep === digits) return cepLookupRequest.current.promise;
    const formatted = `${digits.slice(0, 5)}-${digits.slice(5)}`;
    updateField('cep', formatted); setCepLookupError(''); setCepLookupLoading(true);
    const promise = lookupCep(digits).then((result) => {
      setForm((current) => ({ ...current, cep: formatted, endereco: result?.endereco || current.endereco, bairro: result?.bairro || current.bairro, cidade: result?.cidade || current.cidade, uf: result?.uf || current.uf }));
      lastCepLookup.current = digits; return result;
    }).catch((error) => { setCepLookupError(error?.message || 'CEP não encontrado.'); return null; }).finally(() => {
      if (cepLookupRequest.current?.cep === digits) { cepLookupRequest.current = null; setCepLookupLoading(false); }
    });
    cepLookupRequest.current = { cep: digits, promise }; return promise;
  }, [updateField]);
  useEffect(() => {
    if (!open) return undefined;
    initialize(initialRecord);
    let active = true;
    setLookups((current) => ({ ...current, loading: true, error: '' }));
    Promise.allSettled(['Tipos de logradouro', 'Tipos de contato', 'Bairro', 'Cidade'].map((tipo) => listarAuxiliares(tipo))).then((results) => {
      if (!active) return;
      const [logradouro, contato, bairro, cidade] = results;
      setLookups({ loading: false, error: results.some((result) => result.status === 'rejected') ? 'Não foi possível carregar todos os auxiliares.' : '', logradouro: logradouro.status === 'fulfilled' ? logradouro.value : [], contato: contato.status === 'fulfilled' ? contato.value : [], bairro: bairro.status === 'fulfilled' ? bairro.value : [], cidade: cidade.status === 'fulfilled' ? cidade.value : [] });
    });
    return () => { active = false; };
  }, [open, initialRecord, initialize]);
  const options = useMemo(() => ({ logradouro: mapConvenioAuxiliaryOptions(lookups.logradouro, { historicalIndex: true }), contato: mapConvenioAuxiliaryOptions(lookups.contato, { historicalIndex: true }), bairro: mapConvenioAuxiliaryOptions(lookups.bairro), cidade: mapConvenioAuxiliaryOptions(lookups.cidade) }), [lookups]);
  return { form, reset, updateField, lookups, options, lookupCep: lookupCepForForm, cepLookupLoading, cepLookupError, submitting, setSubmitting, submitError, setSubmitError };
}
