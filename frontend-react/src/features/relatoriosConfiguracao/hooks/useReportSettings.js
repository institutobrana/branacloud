import { useEffect, useState } from 'react';
import { getReportSettings, updateReportSettings } from '../services/reportSettingsApi.js';
import { normalizeReportSettings, REPORT_DEFAULTS } from '../constants/reportSettingsConstants.js';
export function useReportSettings(open, targetUser) { const [data, setData] = useState({ config: normalizeReportSettings(), user: null }); const [loading, setLoading] = useState(false); const [saving, setSaving] = useState(false); const [error, setError] = useState(''); const userId = targetUser?.id;
  useEffect(() => { if (!open) return; let live = true; setLoading(true); setError(''); getReportSettings(userId).then((next) => { if (live) setData({ config: normalizeReportSettings(next?.config), user: next?.user || targetUser }); }).catch((e) => live && setError(e.message)).finally(() => live && setLoading(false)); return () => { live = false; }; }, [open, userId]);
  const update = (part) => setData((prev) => ({ ...prev, config: { ...prev.config, ...part } }));
  const updateSection = (id, part) => setData((prev) => ({ ...prev, config: { ...prev.config, sectionStyles: { ...prev.config.sectionStyles, [id]: { ...prev.config.sectionStyles[id], ...part } } } }));
  const reset = () => setData((prev) => ({ ...prev, config: normalizeReportSettings(REPORT_DEFAULTS) }));
  const save = async () => { setSaving(true); setError(''); try { const next = await updateReportSettings(data.config, userId); setData((prev) => ({ ...prev, config: normalizeReportSettings(next?.config || data.config), user: next?.user || prev.user })); } catch (e) { setError(e.message); throw e; } finally { setSaving(false); } };
  return { ...data, loading, saving, error, update, updateSection, reset, save };
}
