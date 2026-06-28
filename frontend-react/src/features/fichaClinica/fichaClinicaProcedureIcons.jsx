const iconStroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.6',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function ProcedureIconShell({ children, title }) {
  return (
    <svg
      className="ficha-clinica-procedure-icon-svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      role="img"
      aria-label={title}
      focusable="false"
    >
      <title>{title}</title>
      <rect x="2.25" y="2.25" width="19.5" height="19.5" rx="4.25" fill="#f8fdfc" stroke="rgba(22, 170, 161, 0.35)" />
      {children}
    </svg>
  );
}

export function FichaClinicaProcedureIconApicectomia() {
  return (
    <ProcedureIconShell title="Apicectomia">
      <path {...iconStroke} d="M8 5.6c-.8 1.1-1.3 2.5-1.3 4.1 0 2.2.7 4.3 1.6 6.1.5 1 .9 1.9.9 2.6" />
      <path {...iconStroke} d="M15.9 5.6c.8 1.1 1.3 2.5 1.3 4.1 0 2.2-.7 4.3-1.6 6.1-.5 1-.9 1.9-.9 2.6" />
      <path {...iconStroke} d="M9.1 8.3c.5-1.1 1.5-1.8 2.9-1.8s2.4.7 2.9 1.8" />
      <path {...iconStroke} d="M9.4 11.2h5.2" />
      <path {...iconStroke} d="M10.1 15.5h3.8" />
      <path {...iconStroke} d="M11.3 18.2l1.4-1.4 1.4 1.4" />
      <path {...iconStroke} d="M16.6 16.2l2.2-2.2" />
      <path {...iconStroke} d="M18.2 16.2l-2.2-2.2" />
    </ProcedureIconShell>
  );
}

export function FichaClinicaProcedureIconCirurgia() {
  return (
    <ProcedureIconShell title="Cirurgia">
      <path {...iconStroke} d="M5.4 15.9c2.1-2.2 3.5-4.5 4.2-6.8.3-.9 1.1-1.5 2-1.5 1.3 0 2.4 1 2.4 2.3 0 .7-.3 1.4-.8 1.8-2.1 1.8-4.5 3.1-7.4 4.2" />
      <path {...iconStroke} d="M14.4 8.6l3.6 3.6" />
      <path {...iconStroke} d="M13.1 10l1.7-1.7 3 3-1.7 1.7" />
      <path {...iconStroke} d="M6.6 18.2c.8.3 1.8.5 2.7.5 2.4 0 4.5-1.1 5.8-2.9" />
      <path {...iconStroke} d="M7.2 7.8c.8-.8 1.9-1.3 3.1-1.3 1.8 0 3.2.9 4 2.2" />
    </ProcedureIconShell>
  );
}

export function FichaClinicaProcedureIconEnxerto() {
  return (
    <ProcedureIconShell title="Enxerto">
      <rect x="5" y="8" width="5.2" height="4.1" rx="1.2" fill="rgba(22, 170, 161, 0.16)" stroke="rgba(22, 170, 161, 0.78)" />
      <rect x="13.8" y="8" width="5.2" height="4.1" rx="1.2" fill="rgba(239, 68, 68, 0.12)" stroke="rgba(239, 68, 68, 0.72)" />
      <path {...iconStroke} d="M7.6 14.8h8.8" />
      <path {...iconStroke} d="M12 6.4v14" />
      <path {...iconStroke} d="M10.9 9.8h2.2" />
    </ProcedureIconShell>
  );
}

export function FichaClinicaProcedureIconFrenectomia() {
  return (
    <ProcedureIconShell title="Frenectomia">
      <path {...iconStroke} d="M5.5 8.3c1.5-1.2 3.3-1.8 6.5-1.8s5 .6 6.5 1.8" />
      <path {...iconStroke} d="M5.9 14.5c1.7 1.1 3.6 1.7 6.1 1.7s4.4-.6 6.1-1.7" />
      <path {...iconStroke} d="M12 7.1v8.4" />
      <path {...iconStroke} d="M10.1 11.3l3.8 3.8" />
      <path {...iconStroke} d="M13.9 11.3l-3.8 3.8" />
    </ProcedureIconShell>
  );
}

export function FichaClinicaProcedureIconHemisecao() {
  return (
    <ProcedureIconShell title="Hemisecção">
      <path {...iconStroke} d="M7 6.5c1.2-.7 2.5-1.1 5-1.1 2.6 0 3.8.4 5 1.1" />
      <path {...iconStroke} d="M7.8 10.3c1-.8 2.1-1.2 4.2-1.2s3.2.4 4.2 1.2" />
      <path {...iconStroke} d="M8.2 16.5c1 .6 2 .9 3.8.9 1.8 0 2.8-.3 3.8-.9" />
      <path {...iconStroke} d="M12 5.7v12.8" />
      <path {...iconStroke} d="M14.7 8.2l2.1-2.1" />
      <path {...iconStroke} d="M14.7 5.9l2.1 2.1" />
    </ProcedureIconShell>
  );
}

export function FichaClinicaProcedureIconRetalho() {
  return (
    <ProcedureIconShell title="Retalho">
      <path {...iconStroke} d="M5.2 15.4c1.8-1.7 3.8-2.6 6.8-2.6s5 .9 6.8 2.6" />
      <path {...iconStroke} d="M5.8 11.9c1.4-1.2 3.1-1.9 6.2-1.9 3 0 4.8.7 6.2 1.9" />
      <path {...iconStroke} d="M12 8.3v8.1" />
      <path {...iconStroke} d="M10.5 9.8L12 8.3l1.5 1.5" />
      <path {...iconStroke} d="M8.8 17.2h6.4" />
    </ProcedureIconShell>
  );
}

export function FichaClinicaProcedureIconRizectomia() {
  return (
    <ProcedureIconShell title="Rizectomia">
      <path {...iconStroke} d="M8.2 6.3c-.8 1.3-1.3 2.8-1.3 4.5 0 2.5.9 4.6 2 6.4.4.8.7 1.5.7 2.2" />
      <path {...iconStroke} d="M15.8 6.3c.8 1.3 1.3 2.8 1.3 4.5 0 2.5-.9 4.6-2 6.4-.4.8-.7 1.5-.7 2.2" />
      <path {...iconStroke} d="M11.3 11.2h1.4" />
      <path {...iconStroke} d="M11.3 15.3h1.4" />
      <path {...iconStroke} d="M10 18l4-4" />
      <path {...iconStroke} d="M10 14l4 4" />
    </ProcedureIconShell>
  );
}

export function FichaClinicaProcedureIconUlectomia() {
  return (
    <ProcedureIconShell title="Ulectomia">
      <path {...iconStroke} d="M5.5 9.4c1.1-2.1 3-3.1 6.5-3.1s5.4 1 6.5 3.1" />
      <path {...iconStroke} d="M6.1 13.4c1.1 1.7 2.9 2.6 5.9 2.6s4.8-.9 5.9-2.6" />
      <path {...iconStroke} d="M8.3 11.7h7.4" />
      <path {...iconStroke} d="M9.3 15.5h5.4" />
      <path {...iconStroke} d="M13.7 7.2l2.1 2.1" />
      <path {...iconStroke} d="M13.7 9.3l2.1-2.1" />
    </ProcedureIconShell>
  );
}
