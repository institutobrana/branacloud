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
      <circle cx="8" cy="9" r="2.1" fill="currentColor" />
      <circle cx="15.8" cy="8.4" r="1.8" fill="currentColor" opacity="0.95" />
      <circle cx="18.4" cy="10.5" r="1.4" fill="currentColor" opacity="0.88" />
      <path
        d="M4.8 18.1c.4-2.7 2.2-4.5 4.8-4.5s4.4 1.8 4.8 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M13.2 17.8c.2-1.7 1.4-2.9 3.1-3.1 1.4-.1 2.6.5 3.3 1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
    </RailIcon>
  );
}

export function RailPatientIcon() {
  return (
    <RailIcon title="Cadastro">
      <circle cx="12" cy="8.3" r="3.1" fill="currentColor" />
      <path
        d="M6.5 18.4c.8-3.4 3-5 5.5-5s4.7 1.6 5.5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="12" cy="8.3" r="5.8" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />
    </RailIcon>
  );
}

export function RailMoneyIcon() {
  return (
    <RailIcon title="Financeiro">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9.1 11.3c0-1.3 1.3-2.3 2.9-2.3 1.2 0 2.1.4 2.8 1.2"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M14.9 13.1c0 1.3-1.3 2.3-2.9 2.3-1.2 0-2.1-.4-2.8-1.2"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path d="M12 7.1v9.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </RailIcon>
  );
}

export function RailDocumentsIcon() {
  return (
    <RailIcon title="Tabelas">
      <path d="M7.2 5.8h7.4l3 3v9.4H7.2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14.6 5.8v3h3" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M5.2 7.8h7.4l3 3v7.4H5.2z" fill="currentColor" opacity="0.95" />
      <path d="M7.4 12h7.6M7.4 14.8h6" stroke="#16AAA1" strokeWidth="1.6" strokeLinecap="round" opacity="0.18" />
      <path d="M7.4 12h7.6M7.4 14.8h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.24" />
    </RailIcon>
  );
}

export function RailFileIcon() {
  return (
    <RailIcon title="Relatórios">
      <path d="M7.2 4.8h6.6l3.2 3.2v11.2H7.2z" fill="currentColor" />
      <path d="M13.8 4.8v3.2H17" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 11.1h6M9 13.7h4.8M9 16.2h5.5" stroke="#16AAA1" strokeWidth="1.6" strokeLinecap="round" opacity="0.18" />
      <path d="M9 11.1h6M9 13.7h4.8M9 16.2h5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.26" />
    </RailIcon>
  );
}

export function RailGearIcon() {
  return (
    <RailIcon title="Configuração">
      <circle cx="12" cy="12" r="3.1" fill="currentColor" />
      <path
        d="M12 4.8v2.3M12 16.9v2.3M4.8 12h2.3M16.9 12h2.3M7.1 7.1l1.6 1.6M15.3 15.3l1.6 1.6M16.9 7.1l-1.6 1.6M8.7 15.3l-1.6 1.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="7.1" stroke="currentColor" strokeWidth="1.7" />
    </RailIcon>
  );
}

export function RailToolsIcon() {
  return (
    <RailIcon title="Ferramentas">
      <path
        d="M14.7 5.8c1.1 1.1 1.4 2.7.9 4l3.2 3.2c.5.5.5 1.3 0 1.8l-1 1c-.5.5-1.3.5-1.8 0l-3.2-3.2c-1.3.5-2.9.2-4-.9l-4.8 4.8c-.4.4-1 .4-1.4 0s-.4-1 0-1.4l4.8-4.8c-1.1-1.1-1.4-2.7-.9-4l1.8 1.8 1.9-.5.5-1.9z"
        fill="currentColor"
      />
    </RailIcon>
  );
}

export function RailSupportIcon() {
  return (
    <RailIcon title="Ajuda">
      <circle cx="12" cy="12" r="7.4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 6.7a5.3 5.3 0 0 1 5.3 5.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 17.3a5.3 5.3 0 0 1-5.3-5.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 8.2v4.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="15.4" r="0.9" fill="currentColor" />
    </RailIcon>
  );
}

