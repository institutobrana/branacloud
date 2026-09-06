import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { fetchAgendaNoticeOptions, fetchAgendaNotices, sendAgendaNotices } from '../api/agendaNoticesApi.js';

const today = () => dayjs().format('YYYY-MM-DD');
const initial = () => ({ startDate: today(), endDate: today(), sendType: 'email', modelId: '', allProviders: true });

export function useAgendaNotices({ open, providerId = '' } = {}) {
  const [filters, setFilters] = useState(initial);
  const [options, setOptions] = useState({ types: [], models: [], defaults: {} });
  const [rows, setRows] = useState([]); const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(false); const [sending, setSending] = useState(false); const [error, setError] = useState(''); const [feedback, setFeedback] = useState('');
  const reset = useCallback(() => { setFilters(initial()); setRows([]); setSelectedIndex(null); setError(''); setFeedback(''); }, []);
  useEffect(() => { if (!open) return; reset(); const controller = new AbortController(); fetchAgendaNoticeOptions({ signal: controller.signal }).then((data) => { const defaults = data?.defaults || {}; setOptions({ types: data?.tipos_envio || [], models: data?.modelos || {}, defaults }); setFilters((current) => ({ ...current, modelId: String(defaults.email_modelo_id || '') })); }).catch((reason) => { if (reason?.name !== 'AbortError') setError(reason?.message || 'Falha ao carregar opções.'); }); return () => controller.abort(); }, [open, reset]);
  const models = options.models?.[filters.sendType] || [];
  const canSearch = Boolean(filters.startDate && filters.endDate && filters.endDate >= filters.startDate && filters.sendType && filters.modelId && (filters.allProviders || providerId));
  const canSend = useMemo(() => rows.some((row) => row.ok === true), [rows]);
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const changeType = (value) => { update('sendType', value); setRows([]); setSelectedIndex(null); setFeedback(''); };
  const changeModel = (value) => { update('modelId', value); setRows([]); setSelectedIndex(null); };
  const search = useCallback(async () => { if (!canSearch || loading) return; setLoading(true); setError(''); setRows([]); setSelectedIndex(null); try { const result = await fetchAgendaNotices({ ...filters, providerId }); setRows((Array.isArray(result) ? result : []).map((row) => ({ ...row, ok: row.ok === true && row.identity_eligible === true && row.contact_eligible === true && Boolean(String(row.contato || '').trim()) }))); setSelectedIndex(null); } catch (reason) { setError(reason?.message || 'Falha ao pesquisar avisos.'); } finally { setLoading(false); } }, [canSearch, filters, loading, providerId]);
  const send = useCallback(async () => { if (!canSend || sending) return; setSending(true); setError(''); try { const result = await sendAgendaNotices({ sendType: filters.sendType, modelId: filters.modelId, items: rows.map((row) => ({ agenda_id: Number(row.id), ok: row.ok === true })) }); setFeedback(`Processado ${result?.total_selecionados || rows.length} aviso(s). Enviados: ${result?.enviados || 0}. Pendentes: ${result?.pendentes || 0}. Falhas: ${(result?.falhas || []).length}.`); } catch (reason) { setError(reason?.message || 'Falha ao enviar avisos.'); } finally { setSending(false); } }, [canSend, filters.modelId, filters.sendType, rows, sending]);
  const toggleOk = (index) => setRows((current) => current.map((row, rowIndex) => rowIndex === index && row.identity_eligible === true && row.contact_eligible === true && String(row.contato || '').trim() ? { ...row, ok: !row.ok } : row));
  return { filters, options, models, rows, selectedIndex, setSelectedIndex, loading, sending, error, feedback, canSearch, canSend, update, changeType, changeModel, search, send, toggleOk, reset };
}
