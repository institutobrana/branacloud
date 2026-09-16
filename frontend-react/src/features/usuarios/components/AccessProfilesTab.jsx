import { Checkbox, Empty } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

// The user-profile API returns AccessProfile rows without the seed code.  The
// native catalog's stable source_id values are its canonical discriminator;
// custom/temporary rows must never become functional choices here.
const NATIVE_PROFILE_SOURCE_IDS = new Set([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);

export function AccessProfilesTab({ profiles, userId, saving, onAssignmentsChange }) {
  const profileRows = (Array.isArray(profiles?.profiles) ? profiles.profiles : [])
    .filter((profile) => Boolean(profile.reservado) && NATIVE_PROFILE_SOURCE_IDS.has(Number(profile.source_id)))
    .sort((a, b) => Number(a.source_id) - Number(b.source_id));
  const providers = Array.isArray(profiles?.prestadores) ? profiles.prestadores : [];
  const assignments = profiles?.assignments || {};
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const profileTableRef = useRef(null);
  useEffect(() => {
    if (!profileRows.length) { setSelectedProfileId(null); return; }
    setSelectedProfileId((current) => profileRows.some((profile) => String(profile.id) === String(current)) ? current : profileRows[0].id);
  }, [profileRows]);
  const selectedProviderIds = useMemo(() => new Set((assignments[String(selectedProfileId)] || []).map(Number)), [assignments, selectedProfileId]);
  const selectedProfile = profileRows.find((profile) => String(profile.id) === String(selectedProfileId));
  const selectProfileAt = (index) => {
    const profile = profileRows[Math.max(0, Math.min(index, profileRows.length - 1))];
    if (profile) setSelectedProfileId(profile.id);
  };
  const handleProfileTableKeyDown = (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const currentIndex = profileRows.findIndex((profile) => String(profile.id) === String(selectedProfileId));
    selectProfileAt(currentIndex + (event.key === 'ArrowDown' ? 1 : -1));
  };
  const updateProviders = (providerIds) => {
    if (selectedProfileId == null) return;
    onAssignmentsChange?.(userId, selectedProfileId, providerIds);
  };
  if (!profileRows.length) return <Empty description="Nenhum perfil de acesso encontrado" />;
  return <div className="usuarios-profiles-layout">
    <section className="usuarios-profiles-panel" aria-label="Perfis">
      <table className="usuarios-permission-table usuarios-profiles-table" ref={profileTableRef} tabIndex={0} aria-label="Perfis funcionais" onKeyDown={handleProfileTableKeyDown}>
        <thead><tr><th scope="col">Perfil</th></tr></thead>
        <tbody>{profileRows.map((profile) => <tr key={profile.id || profile.source_id} aria-selected={String(profile.id) === String(selectedProfileId)} className={String(profile.id) === String(selectedProfileId) ? 'is-selected' : ''} onClick={() => setSelectedProfileId(profile.id)}><td>{profile.nome}</td></tr>)}</tbody>
      </table>
    </section>
    <section className="usuarios-profiles-panel usuarios-providers-panel" aria-label="Prestadores">
      <div className="usuarios-permission-section-title">Prestadores</div>
      {providers.length ? <div className="usuarios-providers-checklist" aria-label={`Prestadores de ${selectedProfile?.nome || 'perfil selecionado'}`}>{providers.map((provider) => <label className="usuarios-provider-checkbox" key={provider.id}><Checkbox checked={selectedProviderIds.has(Number(provider.id))} disabled={saving || selectedProfileId == null} onChange={(event) => { const next = new Set(selectedProviderIds); if (event.target.checked) next.add(Number(provider.id)); else next.delete(Number(provider.id)); updateProviders([...next]); }}>{provider.nome}</Checkbox></label>)}</div> : <Empty description="Nenhum prestador disponível" />}
    </section>
  </div>;
}
