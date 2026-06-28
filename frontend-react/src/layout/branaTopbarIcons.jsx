function BranaTopbarSvg({ children }) {
  return (
    <svg
      className="brana-topbar-icon"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      aria-hidden="true"
      role="presentation"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function BranaPacienteIcon() {
  return (
    <BranaTopbarSvg>
      <circle cx="8.25" cy="7.25" r="2.35" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4.9 17.25c0-2.15 1.76-3.9 3.9-3.9h.9c2.14 0 3.9 1.75 3.9 3.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14.5 7.5h3.35a1.15 1.15 0 0 1 1.15 1.15v7.2a1.15 1.15 0 0 1-1.15 1.15H14.5a1.15 1.15 0 0 1-1.15-1.15v-7.2A1.15 1.15 0 0 1 14.5 7.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M15.8 10.1h1.9M15.8 12.3h1.9M15.8 14.5h1.25" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
      <path d="M13.4 7.5l4.18-2.1" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </BranaTopbarSvg>
  );
}

export function BranaFichaClinicaIcon() {
  return (
    <BranaTopbarSvg>
      <path
        d="M6.15 3.8h8.5l2.9 2.85v13.55H6.15a1.4 1.4 0 0 1-1.4-1.4V5.2a1.4 1.4 0 0 1 1.4-1.4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M14.65 3.8v2.9h2.9" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8.3 9.55h6.85M8.3 12.1h4.75M8.3 14.65h3.4" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
      <path
        d="M14.7 15.6c0-1.2.95-2.15 2.15-2.15s2.15.95 2.15 2.15-.95 2.15-2.15 2.15-2.15-.95-2.15-2.15Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M16.85 13.9v3.4M15.15 15.6h3.4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M5.7 18.55h5.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </BranaTopbarSvg>
  );
}

export function BranaEstoqueIcon() {
  return (
    <BranaTopbarSvg>
      <path
        d="M6 8.2 12 5l6 3.2v8L12 19.5 6 16.2v-8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M6 8.2 12 11.4l6-3.2M12 11.4v8.1" stroke="currentColor" strokeWidth="1.45" strokeLinejoin="round" />
      <path d="M8 10.15 12 12.2l4-2.05" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M8 14.15h8" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M8.2 6.4 12 8.25l3.8-1.85" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </BranaTopbarSvg>
  );
}
