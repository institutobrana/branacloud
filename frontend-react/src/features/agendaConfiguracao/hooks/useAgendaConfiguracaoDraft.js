import { useCallback, useState } from 'react';

import { createAgendaConfiguracaoDraft } from '../agendaConfiguracaoState.js';

export function useAgendaConfiguracaoDraft() {
  const [draft, setDraft] = useState(() => createAgendaConfiguracaoDraft());

  const resetDraft = useCallback(() => {
    setDraft(createAgendaConfiguracaoDraft());
  }, []);

  const updateDraft = useCallback((patch) => {
    setDraft((current) => {
      const nextPatch = typeof patch === 'function' ? patch(current) : patch;
      return { ...current, ...nextPatch };
    });
  }, []);

  return { draft, setDraft, updateDraft, resetDraft };
}
