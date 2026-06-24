function RailIcon({ children, title }) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" role="img" aria-hidden="true" focusable="false" aria-label={title}>
      {children}
    </svg>
  );
}

export function RailUsersIcon() {
  return (
    <RailIcon title="Atendimento">
      <circle cx="8" cy="8.8" r="2.5" fill="currentColor" />
      <circle cx="15.8" cy="8.2" r="2.2" fill="currentColor" opacity="0.98" />
      <circle cx="18.6" cy="10.2" r="1.7" fill="currentColor" opacity="0.95" />
      <path
        d="M4.2 18.4c.5-3.2 2.5-5.2 5.8-5.2s5.3 2 5.8 5.2"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M12.9 17.8c.3-2 1.7-3.3 3.7-3.6 1.7-.2 3.1.6 3.9 1.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.96"
      />
    </RailIcon>
  );
}

export function RailPatientIcon() {
  return (
    <RailIcon title="Cadastro">
      <circle cx="12" cy="8.2" r="3.7" fill="currentColor" />
      <path
        d="M5.9 18.5c.9-3.8 3.4-5.6 6.1-5.6s5.2 1.8 6.1 5.6"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="12" cy="8.2" r="6.3" stroke="currentColor" strokeWidth="1.8" opacity="0.96" />
    </RailIcon>
  );
}

export function RailMoneyIcon() {
  return (
    <RailIcon title="Financeiro">
      <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="2.3" />
      <path
        d="M8.8 11.2c0-1.5 1.4-2.7 3.2-2.7 1.3 0 2.3.5 3.1 1.3"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M15.2 13c0 1.5-1.4 2.7-3.2 2.7-1.3 0-2.3-.5-3.1-1.3"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M12 6.9v10.4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </RailIcon>
  );
}

export function RailDocumentsIcon() {
  return (
    <RailIcon title="Tabelas">
      <path d="M7 5.6h7.9l2.7 2.7v9.9H7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14.9 5.6v2.8h2.8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M5.1 7.6H13l2.8 2.8v7.9H5.1z" fill="currentColor" opacity="0.98" />
      <path d="M7.1 11.7h8.1M7.1 14.4h6.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.38" />
    </RailIcon>
  );
}

export function RailFileIcon() {
  return (
    <RailIcon title="Relatórios">
      <path d="M7 4.6h7l3.1 3.1v11.7H7z" fill="currentColor" />
      <path d="M14 4.6v3.1h3.1" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8.8 10.8h6.7M8.8 13.5h5.5M8.8 16.1h6.1" stroke="#16AAA1" strokeWidth="1.9" strokeLinecap="round" opacity="0.18" />
      <path d="M8.8 10.8h6.7M8.8 13.5h5.5M8.8 16.1h6.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    </RailIcon>
  );
}

export function RailGearIcon() {
  return (
    <RailIcon title="Configuração">
      <circle cx="12" cy="12" r="3.7" fill="currentColor" />
      <path
        d="M12 4.5v2.7M12 16.8v2.7M4.5 12h2.7M16.8 12h2.7M6.9 6.9l1.9 1.9M15.2 15.2l1.9 1.9M16.8 6.9l-1.9 1.9M8.7 15.2l-1.9 1.9"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="7.6" stroke="currentColor" strokeWidth="1.9" />
    </RailIcon>
  );
}

export function RailToolsIcon() {
  return (
    <RailIcon title="Ferramentas">
      <path
        d="M14.8 5.6c1.2 1.2 1.5 2.9 1 4.4l3.2 3.2c.6.6.6 1.4 0 2l-1 1c-.6.6-1.4.6-2 0l-3.2-3.2c-1.5.5-3.2.2-4.4-1l-5.2 5.2c-.4.4-1 .4-1.4 0s-.4-1 0-1.4l5.2-5.2c-1.2-1.2-1.5-2.9-1-4.4l2 2 2-.5.5-2z"
        fill="currentColor"
      />
    </RailIcon>
  );
}

export function RailSupportIcon() {
  return (
    <RailIcon title="Ajuda">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M12 6.3a5.7 5.7 0 0 1 5.7 5.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 17.7a5.7 5.7 0 0 1-5.7-5.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 8v5.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="15.8" r="1" fill="currentColor" />
    </RailIcon>
  );
}
