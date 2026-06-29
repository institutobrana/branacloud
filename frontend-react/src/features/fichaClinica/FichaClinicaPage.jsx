import { useMemo, useRef, useState } from 'react';
import { Button, Card, Empty, Space, Table, Tabs, Tag, Typography, message } from 'antd';
import {
  DollarOutlined,
  FileTextOutlined,
  FilterOutlined,
  LeftOutlined,
  LockOutlined,
  MoreOutlined,
  MenuOutlined,
  RightOutlined,
  PrinterOutlined,
  PlusOutlined,
  SearchOutlined,
  StopOutlined,
  TeamOutlined,
  DeleteOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  FichaClinicaProcedureIconApicectomia,
  FichaClinicaProcedureIconCirurgia,
  FichaClinicaProcedureIconEnxerto,
  FichaClinicaProcedureIconFrenectomia,
  FichaClinicaProcedureIconHemisecao,
  FichaClinicaProcedureIconRetalho,
  FichaClinicaProcedureIconRizectomia,
  FichaClinicaProcedureIconUlectomia,
} from './fichaClinicaProcedureIcons';
import './fichaClinica.css';

const SELECTED_PATIENT_KEY = 'brana.fichaClinica.pacienteEmUso';

function formatNomeCompleto(item) {
  const nomeCompleto = String(item?.nome_completo || '').trim();
  if (nomeCompleto) return nomeCompleto;
  return [item?.nome || '', item?.sobrenome || ''].filter(Boolean).join(' ').trim();
}

function formatTelefone(item) {
  return String(item?.fone1 || '').trim();
}

function formatStatus(item) {
  if (item?.inativo) return 'Inativo';
  return String(item?.status || '').trim() || 'Ativo';
}

function getStatusColor(item) {
  if (item?.inativo) return 'default';
  const status = String(item?.status || '').toLowerCase();
  if (status.includes('inativo')) return 'default';
  if (status.includes('bloq')) return 'volcano';
  return 'green';
}

function readStoredPatient() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(SELECTED_PATIENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function storeSelectedPatient(paciente) {
  if (typeof window === 'undefined') return;
  try {
    if (!paciente) {
      window.sessionStorage.removeItem(SELECTED_PATIENT_KEY);
      return;
    }
    window.sessionStorage.setItem(SELECTED_PATIENT_KEY, JSON.stringify(paciente));
  } catch {
    // estado visual continua funcionando mesmo sem persistencia
  }
}

function buildPatientSummary(paciente) {
  if (!paciente) return [];

  const items = [
    ['Codigo', paciente.codigo ?? paciente.id ?? '-'],
    ['Nome completo', formatNomeCompleto(paciente) || '-'],
    ['Telefone', formatTelefone(paciente) || 'Nao informado'],
    ['Status', formatStatus(paciente)],
  ];

  if (paciente.cpf) {
    items.push(['CPF', paciente.cpf]);
  }

  if (paciente.cidade) {
    items.push(['Cidade', paciente.cidade]);
  }

  if (paciente.cod_prontuario) {
    items.push(['Prontuario', paciente.cod_prontuario]);
  }

  return items;
}

function buildCalendarDays(referenceDate = new Date()) {
  const current = new Date(referenceDate);
  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < firstDay; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(day);
  }

  return cells;
}

const clinicCategories = [
  { key: 'cirur', label: 'Cirur', asset: 'esp_Cirurgia.bmp' },
  { key: 'dent', label: 'Dent', asset: 'esp_Dentistica.bmp' },
  { key: 'diag', label: 'Diag', asset: 'esp_Diagnostico.bmp' },
  { key: 'emer', label: 'Emer', asset: 'int_emerg.bmp' },
  { key: 'endo', label: 'Endo', asset: 'esp_Endodontia.bmp' },
  { key: 'espec', label: 'Espec', asset: 'esp_Generico.bmp' },
  { key: 'estet', label: 'Estét', asset: 'esp_Estetica.bmp' },
  { key: 'estom', label: 'Estom', asset: 'int_consulta.bmp' },
  { key: 'geral', label: 'Geral', asset: 'esp_Gerais.bmp' },
  { key: 'hof', label: 'HOF', asset: 'sim_face.bmp' },
  { key: 'impla', label: 'Impla', asset: 'esp_Implantodontia.bmp' },
  { key: 'odped', label: 'OdPed', asset: 'esp_Odontopediatria.bmp' },
  { key: 'orto', label: 'Orto', asset: 'esp_Ortodontia.bmp' },
  { key: 'ortop', label: 'Ortop', asset: 'int_bracket.bmp' },
  { key: 'perio', label: 'Perio', asset: 'esp_Periodontia.bmp' },
  { key: 'prev', label: 'Prev', asset: 'esp_Prevencao.bmp' },
  { key: 'prot', label: 'Prót', asset: 'esp_Protese.bmp' },
  { key: 'radio', label: 'Radio', asset: 'esp_Radiologia.bmp' },
];

function buildToothDescriptors() {
  return [
    { number: 1, role: 'incisor' },
    { number: 2, role: 'incisor' },
    { number: 3, role: 'canine' },
    { number: 4, role: 'premolar' },
    { number: 5, role: 'premolar' },
    { number: 6, role: 'molar' },
    { number: 7, role: 'molar' },
    { number: 8, role: 'molar' },
    { number: 9, role: 'molar' },
    { number: 10, role: 'molar' },
    { number: 11, role: 'premolar' },
    { number: 12, role: 'premolar' },
    { number: 13, role: 'canine' },
    { number: 14, role: 'incisor' },
    { number: 15, role: 'incisor' },
    { number: 16, role: 'incisor' },
  ];
}

function ToothFace() {
  return (
    <span className="ficha-clinica-tooth-face" aria-hidden="true">
      <span className="ficha-clinica-tooth-face-segment is-left-top" />
      <span className="ficha-clinica-tooth-face-segment is-right-top" />
      <span className="ficha-clinica-tooth-face-segment is-left-bottom" />
      <span className="ficha-clinica-tooth-face-segment is-right-bottom" />
      <span className="ficha-clinica-tooth-face-core" />
    </span>
  );
}

function ClinicCategoryIcon({ icon }) {
  return <span className={`ficha-clinica-clinic-category-icon is-${icon}`} aria-hidden="true" />;
}

function PlaceholderBlock({ title, description }) {
  return (
    <div className="ficha-clinica-placeholder">
      <FileTextOutlined className="ficha-clinica-placeholder-icon" />
      <Typography.Title level={4} className="ficha-clinica-placeholder-title">
        {title}
      </Typography.Title>
      <Typography.Text type="secondary" className="ficha-clinica-placeholder-copy">
        {description}
      </Typography.Text>
    </div>
  );
}

function ToothGrid() {
  const upperTeeth = useMemo(() => buildToothDescriptors(), []);
  const lowerTeeth = useMemo(
    () => buildToothDescriptors().map((tooth, index) => ({ ...tooth, number: index + 17 })),
    [],
  );

  return (
    <div className="ficha-clinica-tooth-grid">
      <div className="ficha-clinica-tooth-row">
        {upperTeeth.map((tooth) => (
          <div key={`up-${tooth.number}`} className={`ficha-clinica-tooth is-upper is-${((tooth.number - 1) % 4) + 1}`}>
            <span className={`ficha-clinica-tooth-shape ficha-clinica-tooth-shape-top is-${tooth.role}`} />
            <span className="ficha-clinica-tooth-root" />
            <span className="ficha-clinica-tooth-label">{tooth.number}</span>
          </div>
        ))}
      </div>

      <div className="ficha-clinica-tooth-glyph-row">
        {upperTeeth.map((tooth, index) => (
          <ToothFace key={`mid-up-${index}`} />
        ))}
      </div>

      <div className="ficha-clinica-tooth-glyph-row">
        {lowerTeeth.map((tooth, index) => (
          <ToothFace key={`mid-low-${index}`} />
        ))}
      </div>

      <div className="ficha-clinica-tooth-row ficha-clinica-tooth-row-bottom">
        {lowerTeeth.map((tooth) => (
          <div key={`low-${tooth.number}`} className={`ficha-clinica-tooth is-lower is-${((tooth.number - 17) % 4) + 1}`}>
            <span className={`ficha-clinica-tooth-shape ficha-clinica-tooth-shape-bottom is-${tooth.role}`} />
            <span className="ficha-clinica-tooth-root" />
            <span className="ficha-clinica-tooth-label">{tooth.number}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const odontogramAssetBase = '/assets/fichaClinica/odontograma';
const odontogramTeethAssetBase = `${odontogramAssetBase}/dentes-limpos`;
const odontogramFaceImage = `${odontogramAssetBase}/arc_faces.bmp`;
const odontogramNumberLabels = ['8', '7', '6', '5', '4', '3', '2', '1', '1', '2', '3', '4', '5', '6', '7', '8'];
const odontogramUpperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const odontogramLowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

const clinicSpecialties = [
  { key: 'cirur', label: 'Cirur', fullLabel: 'Cirurgia' },
  { key: 'dent', label: 'Dent', fullLabel: 'Dentística' },
  { key: 'diag', label: 'Diag', fullLabel: 'Diagnóstico' },
  { key: 'emer', label: 'Emer', fullLabel: 'Emergência' },
  { key: 'endo', label: 'Endo', fullLabel: 'Endodontia' },
  { key: 'espec', label: 'Espec', fullLabel: 'Pacientes especiais' },
  { key: 'estet', label: 'Estét', fullLabel: 'Estética' },
  { key: 'estom', label: 'Estom', fullLabel: 'Estomatologia' },
  { key: 'geral', label: 'Geral', fullLabel: 'Geral' },
  { key: 'hof', label: 'HOF', fullLabel: 'Harmonização Orofacial' },
  { key: 'impla', label: 'Impla', fullLabel: 'Implantodontia' },
  { key: 'odped', label: 'OdPed', fullLabel: 'Odontopediatria' },
  { key: 'orto', label: 'Orto', fullLabel: 'Ortodôntia' },
  { key: 'ortop', label: 'Ortop', fullLabel: 'Ortopedia Funcional dos Maxilares' },
  { key: 'perio', label: 'Perio', fullLabel: 'Periodontia' },
  { key: 'prev', label: 'Prev', fullLabel: 'Prevenção' },
  { key: 'prot', label: 'Prót', fullLabel: 'Prótese' },
  { key: 'radio', label: 'Radio', fullLabel: 'Radiologia' },
];

const clinicProcedureItemsByCategory = {
  cirur: [
    { title: 'Apicectomia', Icon: FichaClinicaProcedureIconApicectomia },
    { title: 'Cirurgia', Icon: FichaClinicaProcedureIconCirurgia },
    { title: 'Enxerto', Icon: FichaClinicaProcedureIconEnxerto },
    { title: 'Frenectomia', Icon: FichaClinicaProcedureIconFrenectomia },
    { title: 'Hemisecção', Icon: FichaClinicaProcedureIconHemisecao },
    { title: 'Retalho', Icon: FichaClinicaProcedureIconRetalho },
    { title: 'Rizectomia', Icon: FichaClinicaProcedureIconRizectomia },
    { title: 'Ulectomia', Icon: FichaClinicaProcedureIconUlectomia },
  ],
  dent: [
    { title: 'Consulta', asset: 'int_consulta.bmp' },
    { title: 'Aplicação de flúor', asset: 'int_fluor.bmp' },
    { title: 'Ajuste', asset: 'int_ajuste.bmp' },
    { title: 'Escova', asset: 'int_escova.bmp' },
    { title: 'Polimento', asset: 'int_poli.bmp' },
    { title: 'Selante', asset: 'int_selante.bmp' },
    { title: 'Restauração', asset: 'int_restaura.bmp' },
    { title: 'Mordida', asset: 'int_mordida.bmp' },
  ],
  diag: [
    { title: 'Raio X', asset: 'int_raiox.bmp' },
    { title: 'Panorâmica', asset: 'int_panoram.bmp' },
    { title: 'Periapical', asset: 'int_peric.bmp' },
    { title: 'Lateral', asset: 'int_lateral.bmp' },
    { title: 'Fotos', asset: 'int_fotos.bmp' },
    { title: 'Attach', asset: 'int_attach.bmp' },
    { title: 'Modelo', asset: 'int_modelo.bmp' },
    { title: 'Consulta', asset: 'int_consulta.bmp' },
  ],
  emer: [
    { title: 'Emergência', asset: 'int_emerg.bmp' },
    { title: 'Consulta', asset: 'int_consulta.bmp' },
    { title: 'Raspagem', asset: 'int_raspagem.bmp' },
    { title: 'Retalho', asset: 'int_retalho.bmp' },
    { title: 'Ajuste', asset: 'int_ajuste.bmp' },
    { title: 'Byte', asset: 'int_byte.bmp' },
    { title: 'Mordida', asset: 'int_mordida.bmp' },
    { title: 'Faceta', asset: 'int_faceta.bmp' },
  ],
  endo: [
    { title: 'Canal', asset: 'int_canal.bmp' },
    { title: 'Pulpo', asset: 'int_pulpo.bmp' },
    { title: 'Núcleo', asset: 'int_nucleo.bmp' },
    { title: 'Restauração', asset: 'int_restaura.bmp' },
    { title: 'Rest. DO', asset: 'int_RestDO.bmp' },
    { title: 'Rest. MO', asset: 'int_RestMO.bmp' },
    { title: 'Rest. MOD', asset: 'int_RestMOD.bmp' },
    { title: 'Rest. O', asset: 'int_RestO.bmp' },
  ],
  espec: [
    { title: 'Consulta', asset: 'int_consulta.bmp' },
    { title: 'Escova', asset: 'int_escova.bmp' },
    { title: 'Modelo', asset: 'int_modelo.bmp' },
    { title: 'Fotos', asset: 'int_fotos.bmp' },
    { title: 'Attach', asset: 'int_attach.bmp' },
    { title: 'Prof.', asset: 'int_prof.bmp' },
    { title: 'Byte', asset: 'int_byte.bmp' },
    { title: 'Selante', asset: 'int_selante.bmp' },
  ],
  estet: [
    { title: 'Faceta', asset: 'int_faceta.bmp' },
    { title: 'Consulta', asset: 'int_consulta.bmp' },
    { title: 'Aumento', asset: 'int_aumen.bmp' },
    { title: 'Desgaste', asset: 'int_desgas.bmp' },
    { title: 'Coroa', asset: 'int_coroa.bmp' },
    { title: 'Modelo', asset: 'int_modelo.bmp' },
    { title: 'Fotos', asset: 'int_fotos.bmp' },
    { title: 'Núcleo', asset: 'int_nucleo.bmp' },
  ],
  estom: [
    { title: 'Consulta', asset: 'int_consulta.bmp' },
    { title: 'Mordida', asset: 'int_mordida.bmp' },
    { title: 'Placa', asset: 'int_placa.bmp' },
    { title: 'Coroa', asset: 'int_coroa.bmp' },
    { title: 'Núcleo', asset: 'int_nucleo.bmp' },
    { title: 'Fixa', asset: 'int_fixa.bmp' },
    { title: 'Movel', asset: 'int_movel.bmp' },
    { title: 'Total', asset: 'int_total.bmp' },
  ],
  geral: [
    { title: 'Consulta', asset: 'int_consulta.bmp' },
    { title: 'Adj. geral', asset: 'int_ajuste.bmp' },
    { title: 'Prof.', asset: 'int_prof.bmp' },
    { title: 'Fotos', asset: 'int_fotos.bmp' },
    { title: 'Modelo', asset: 'int_modelo.bmp' },
    { title: 'Attach', asset: 'int_attach.bmp' },
    { title: 'Byte', asset: 'int_byte.bmp' },
    { title: 'Escova', asset: 'int_escova.bmp' },
  ],
  hof: [
    { title: 'Consulta', asset: 'int_consulta.bmp' },
    { title: 'Mordida', asset: 'int_mordida.bmp' },
    { title: 'Aumento', asset: 'int_aumen.bmp' },
    { title: 'Faceta', asset: 'int_faceta.bmp' },
    { title: 'Lateral', asset: 'int_lateral.bmp' },
    { title: 'Modelagem', asset: 'int_modelo.bmp' },
    { title: 'Fixa', asset: 'int_fixa.bmp' },
    { title: 'Movel', asset: 'int_movel.bmp' },
  ],
  impla: [
    { title: 'Implante', asset: 'int_implante.bmp' },
    { title: 'Coroa', asset: 'int_coroa.bmp' },
    { title: 'Núcleo', asset: 'int_nucleo.bmp' },
    { title: 'Provisório', asset: 'int_provgru.bmp' },
    { title: 'Desgaste', asset: 'int_desgas.bmp' },
    { title: 'Braquete', asset: 'int_bracket.bmp' },
    { title: 'Placa', asset: 'int_placa.bmp' },
    { title: 'Modelo', asset: 'int_modelo.bmp' },
  ],
  odped: [
    { title: 'Consulta', asset: 'int_consulta.bmp' },
    { title: 'Flúor', asset: 'int_fluor.bmp' },
    { title: 'Escova', asset: 'int_escova.bmp' },
    { title: 'Selante', asset: 'int_selante.bmp' },
    { title: 'Prof.', asset: 'int_prof.bmp' },
    { title: 'Mordida', asset: 'int_mordida.bmp' },
    { title: 'Byte', asset: 'int_byte.bmp' },
    { title: 'Consulta 2', asset: 'int_consulta.bmp' },
  ],
  orto: [
    { title: 'Bracket', asset: 'int_bracket.bmp' },
    { title: 'Banda', asset: 'int_banda.bmp' },
    { title: 'Fixa', asset: 'int_fixa.bmp' },
    { title: 'Movel', asset: 'int_movel.bmp' },
    { title: 'Modelo', asset: 'int_modelo.bmp' },
    { title: 'Maopunho', asset: 'int_maopunho.bmp' },
    { title: 'Ajuste', asset: 'int_ajuste.bmp' },
    { title: 'Consulta', asset: 'int_consulta.bmp' },
  ],
  ortop: [
    { title: 'Bracket', asset: 'int_bracket.bmp' },
    { title: 'Banda', asset: 'int_banda.bmp' },
    { title: 'Ajuste', asset: 'int_ajuste.bmp' },
    { title: 'Maopunho', asset: 'int_maopunho.bmp' },
    { title: 'Modelo', asset: 'int_modelo.bmp' },
    { title: 'Byte', asset: 'int_byte.bmp' },
    { title: 'Consulta', asset: 'int_consulta.bmp' },
    { title: 'Movel', asset: 'int_movel.bmp' },
  ],
  perio: [
    { title: 'Raspagem', asset: 'int_raspagem.bmp' },
    { title: 'Raspagem geral', asset: 'int_raspger.bmp' },
    { title: 'Gengivectomia', asset: 'int_gengivec.bmp' },
    { title: 'Retalho', asset: 'int_retalho.bmp' },
    { title: 'Enxerto', asset: 'int_enxerto.bmp' },
    { title: 'Tunel', asset: 'int_tunel.bmp' },
    { title: 'Reemb.', asset: 'int_reemb.bmp' },
    { title: 'Consulta', asset: 'int_consulta.bmp' },
  ],
  prev: [
    { title: 'Escova', asset: 'int_escova.bmp' },
    { title: 'Flúor', asset: 'int_fluor.bmp' },
    { title: 'Selante', asset: 'int_selante.bmp' },
    { title: 'Prof.', asset: 'int_prof.bmp' },
    { title: 'Poli', asset: 'int_poli.bmp' },
    { title: 'Modelo', asset: 'int_modelo.bmp' },
    { title: 'Consulta', asset: 'int_consulta.bmp' },
    { title: 'Attach', asset: 'int_attach.bmp' },
  ],
  prot: [
    { title: 'Prótese', asset: 'int_protese.bmp' },
    { title: 'Provele', asset: 'int_provele.bmp' },
    { title: 'Prov. gru', asset: 'int_provgru.bmp' },
    { title: 'Total', asset: 'int_total.bmp' },
    { title: 'Movel', asset: 'int_movel.bmp' },
    { title: 'Fixa', asset: 'int_fixa.bmp' },
    { title: 'Coroa', asset: 'int_coroa.bmp' },
    { title: 'Núcleo', asset: 'int_nucleo.bmp' },
  ],
  radio: [
    { title: 'Raio X', asset: 'int_raiox.bmp' },
    { title: 'Panorâmica', asset: 'int_panoram.bmp' },
    { title: 'Periapical', asset: 'int_peric.bmp' },
    { title: 'Lateral', asset: 'int_lateral.bmp' },
    { title: 'Fotos', asset: 'int_fotos.bmp' },
    { title: 'Oclusal', asset: 'int_oclusal.bmp' },
    { title: 'Attach', asset: 'int_attach.bmp' },
    { title: 'Modelo', asset: 'int_modelo.bmp' },
  ],
};

function ClinicCategoryIconImage({ asset, label }) {
  if (asset) {
    return (
      <img
        className="ficha-clinica-clinic-category-icon-image"
        src={`${odontogramAssetBase}/especialidades/${asset}`}
        alt=""
        aria-hidden="true"
        title={label}
        loading="lazy"
        decoding="async"
      />
    );
  }

  return <ClinicCategoryIcon icon="grid" />;
}

function ClinicSpecialtyButton({ category, active, onClick }) {
  const assetMeta = clinicCategories.find((item) => item.key === category.key) || null;
  return (
    <button
      type="button"
      className={`ficha-clinica-specialty-category${active ? ' is-active' : ''}`}
      title={category.fullLabel}
      aria-label={category.fullLabel}
      onClick={onClick}
    >
      <span className="ficha-clinica-specialty-category-icon-wrap">
        <ClinicCategoryIconImage asset={assetMeta?.asset || ''} label={category.fullLabel} />
      </span>
      <span className="ficha-clinica-specialty-category-label">{category.label}</span>
    </button>
  );
}

function ClinicProcedureIconImage({ asset, label, Icon }) {
  if (Icon) {
    return <Icon />;
  }

  return (
    <img
      className="ficha-clinica-procedure-icon-image"
      src={`/assets/fichaClinica/odontograma/procedimentos/${asset}`}
      alt=""
      aria-hidden="true"
      title={label}
      loading="lazy"
      decoding="async"
    />
  );
}

function ClinicProcedureRail({ category }) {
  const procedures = clinicProcedureItemsByCategory[category] ?? clinicProcedureItemsByCategory.cirur;
  const trackRef = useRef(null);

  const scrollTrack = (direction) => {
    const node = trackRef.current;
    if (!node) return;
    const amount = direction === 'left' ? -160 : 160;
    node.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className="ficha-clinica-procedure-categories" aria-label="Procedimentos da especialidade">
      <Button
        type="text"
        className="ficha-clinica-procedure-menu"
        icon={<MenuOutlined />}
        aria-label="Menu de procedimentos"
        title="Menu de procedimentos"
      />
      <Button
        type="text"
        className="ficha-clinica-procedure-arrow"
        aria-label="Rolar procedimentos para a esquerda"
        title="Rolar procedimentos para a esquerda"
        icon={<LeftOutlined />}
        onClick={() => scrollTrack('left')}
      />
      <div className="ficha-clinica-procedure-categories-track" ref={trackRef}>
        {procedures.map((procedure) => (
          <button key={procedure.title} type="button" className="ficha-clinica-procedure-item" title={procedure.title} aria-label={procedure.title}>
            <ClinicProcedureIconImage asset={procedure.asset} Icon={procedure.Icon} label={procedure.title} />
          </button>
        ))}
      </div>
      <Button
        type="text"
        className="ficha-clinica-procedure-arrow"
        aria-label="Rolar procedimentos para a direita"
        title="Rolar procedimentos para a direita"
        icon={<RightOutlined />}
        onClick={() => scrollTrack('right')}
      />
    </div>
  );
}

function OdontogramTeethRow({ numbers, className }) {
  return (
    <div className={`ficha-clinica-odontogram-teeth-row ${className || ''}`.trim()} aria-hidden="true">
      {numbers.map((number) => (
        <span key={number} className="ficha-clinica-odontogram-tooth-shell">
          <img
            className="ficha-clinica-odontogram-tooth"
            src={`${odontogramTeethAssetBase}/arc_dente${number}.png`}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </span>
      ))}
    </div>
  );
}

function OdontogramFaceRow() {
  return (
    <div className="ficha-clinica-odontogram-face-row" aria-hidden="true">
      {Array.from({ length: 16 }).map((_, index) => (
        <img
          key={`face-${index}`}
          className="ficha-clinica-odontogram-face"
          src={odontogramFaceImage}
          alt=""
          loading="lazy"
          decoding="async"
        />
      ))}
    </div>
  );
}

function ToothGridImage() {
  return (
    <div className="ficha-clinica-odontogram-canvas">
      <OdontogramTeethRow numbers={odontogramUpperTeeth} className="is-upper" />
      <OdontogramFaceRow />
      <div className="ficha-clinica-odontogram-number-row" aria-hidden="true">
        {odontogramNumberLabels.map((label, index) => (
          <span key={`${label}-${index}`} className="ficha-clinica-odontogram-number">
            {label}
          </span>
        ))}
      </div>
      <OdontogramFaceRow />
      <OdontogramTeethRow numbers={odontogramLowerTeeth} className="is-lower" />
    </div>
  );
}

export function FichaClinicaPage({ onBackHome }) {
  const [selectedPatient, setSelectedPatient] = useState(() => readStoredPatient());
  const [activeTab, setActiveTab] = useState('tratamento');
  const [activeClinicCategory, setActiveClinicCategory] = useState('cirur');
  const specialtyTrackRef = useRef(null);

  const patientLabel = useMemo(() => {
    if (!selectedPatient) return 'Nenhum paciente em uso';
    return formatNomeCompleto(selectedPatient) || `Paciente ${selectedPatient.id ?? ''}`.trim();
  }, [selectedPatient]);

  const calendarDays = useMemo(() => buildCalendarDays(new Date()), []);
  const currentDay = new Date().getDate();
  const activeProcedureCategory = activeClinicCategory || 'cirur';
  const scrollSpecialties = (direction) => {
    const node = specialtyTrackRef.current;
    if (!node) return;
    const amount = direction === 'left' ? -160 : 160;
    node.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const handleClearPatient = () => {
    setSelectedPatient(null);
    storeSelectedPatient(null);
    message.info('Paciente em uso limpo.');
  };

  const handlePlaceholderAction = (label) => {
    if (!selectedPatient) {
      message.info('Selecione um paciente para abrir este fluxo.');
      return;
    }
    message.info(`${label}: fluxo em implantacao no Brana Cloude.`);
  };

  const treatmentColumns = [
    {
      title: 'Procedimento',
      dataIndex: 'procedimento',
      key: 'procedimento',
      render: () => <Typography.Text type="secondary">Nenhum tratamento selecionado no odontograma.</Typography.Text>,
    },
    {
      title: 'Região',
      dataIndex: 'regiao',
      key: 'regiao',
      width: 110,
      render: () => '-',
    },
    {
      title: 'Rep',
      dataIndex: 'rep',
      key: 'rep',
      width: 100,
      render: () => '-',
    },
    {
      title: 'Pac',
      dataIndex: 'pac',
      key: 'pac',
      width: 90,
      render: () => '-',
    },
    {
      title: 'Ações',
      key: 'acoes',
      width: 120,
      render: () => (
        <Button type="link" size="small" onClick={() => handlePlaceholderAction('Abrir tratamento')}>
          Abrir
        </Button>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'tratamento',
      label: 'Tratamento',
      children: (
        <div className="ficha-clinica-treatment-tab">
          <div className="ficha-clinica-treatment-toolbar">
            <Button type="text" icon={<PlusOutlined />} onClick={() => handlePlaceholderAction('Novo procedimento')} />
            <Button type="text" icon={<DollarOutlined />} onClick={() => handlePlaceholderAction('Financeiro')} />
            <Button type="text" icon={<UserOutlined />} onClick={() => handlePlaceholderAction('Vincular prestador')} />
            <Button type="text" icon={<StopOutlined />} onClick={() => handlePlaceholderAction('Interromper')} />
            <Button type="text" icon={<LockOutlined />} onClick={() => handlePlaceholderAction('Bloquear')} />
            <Button type="text" icon={<DeleteOutlined />} onClick={() => handlePlaceholderAction('Excluir')} />
            <Button type="text" icon={<MoreOutlined />} onClick={() => handlePlaceholderAction('Mais ações')} />
          </div>

          <Card bordered={false} className="ficha-clinica-treatment-card">
            <Table
              rowKey="id"
              columns={treatmentColumns}
              dataSource={[]}
              pagination={false}
              size="middle"
              locale={{
                emptyText: (
                  <Empty
                    description={
                      selectedPatient
                        ? 'Nenhum procedimento vinculado. Fluxo visual em implantação.'
                        : 'Selecione um paciente para iniciar a ficha clínica.'
                    }
                  />
                ),
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: 'financeiro',
      label: 'Financeiro',
      children: (
        <PlaceholderBlock
          title="Financeiro da ficha"
          description="Painel reservado para títulos, repasses e cobrança vinculada ao paciente em uso."
        />
      ),
    },
    {
      key: 'timeline',
      label: 'Timeline',
      children: (
        <PlaceholderBlock
          title="Timeline do paciente"
          description="Histórico visual do atendimento, eventos clínicos e evolução da ficha."
        />
      ),
    },
    {
      key: 'documentos',
      label: 'Documentos',
      children: (
        <PlaceholderBlock
          title="Documentos da ficha"
          description="Área preparada para prontuários, anexos e emitidos sem expor dados sensíveis nesta etapa."
        />
      ),
    },
    {
      key: 'anotacoes',
      label: 'Anotações',
      children: (
        <PlaceholderBlock
          title="Anotações clínicas"
          description="Espaço inicial para observações, orientações e evolução do atendimento."
        />
      ),
    },
  ];

  return (
    <div className="ficha-clinica-page">
      <div className="ficha-clinica-stage">
        <section className="ficha-clinica-board ficha-clinica-odontogram-board">
          <div className="ficha-clinica-board-toolbar">
            <Button type="text" icon={<PlusOutlined />} />
            <Button type="text" icon={<SearchOutlined />} />
            <Button type="text" icon={<FilterOutlined />} />
            <span className="ficha-clinica-board-divider" />
            <Button type="text" icon={<FileTextOutlined />} />
            <Button type="text" icon={<DollarOutlined />} />
            <Button type="text" icon={<PrinterOutlined />} />
          </div>

          <div className="ficha-clinica-odontogram-frame">
            <ToothGridImage />
          </div>

          <div className="ficha-clinica-specialty-categories" aria-label="Especialidades clínicas">
            <Button
              type="text"
              className="ficha-clinica-specialty-menu"
              icon={<MenuOutlined />}
              aria-label="Menu das especialidades"
              title="Menu das especialidades"
            />
            <Button
              type="text"
              className="ficha-clinica-specialty-arrow"
              aria-label="Rolar especialidades para a esquerda"
              title="Rolar especialidades para a esquerda"
              icon={<LeftOutlined />}
              onClick={() => scrollSpecialties('left')}
            />
            <div className="ficha-clinica-specialty-categories-track" ref={specialtyTrackRef}>
              {clinicSpecialties.map((category) => (
                <ClinicSpecialtyButton
                  key={category.key}
                  category={category}
                  active={activeClinicCategory === category.key}
                  onClick={() => setActiveClinicCategory(category.key)}
                />
              ))}
            </div>
            <Button
              type="text"
              className="ficha-clinica-specialty-arrow"
              aria-label="Rolar especialidades para a direita"
              title="Rolar especialidades para a direita"
              icon={<RightOutlined />}
              onClick={() => scrollSpecialties('right')}
            />
          </div>

          <div className="ficha-clinica-odontogram-footer">
            <Tabs
              activeKey="boca"
              items={[
                {
                  key: 'boca',
                  label: 'Boca',
                  children: (
                    <div className="ficha-clinica-boca-panel">
                      <ClinicProcedureRail category={activeProcedureCategory} />
                      <div className="ficha-clinica-boca-empty">
                        <Typography.Text className="ficha-clinica-boca-empty-copy">
                          Nenhum tratamento selecionado no odontograma.
                          <br />
                          Selecione o tratamento desejado para visualizar os detalhes.
                        </Typography.Text>
                      </div>
                    </div>
                  ),
                },
                { key: 'dente', label: 'Dente', children: <div className="ficha-clinica-boca-empty" /> },
              ]}
            />
          </div>
        </section>

        <section className="ficha-clinica-board ficha-clinica-treatment-board">
          <Card bordered={false} className="ficha-clinica-treatment-shell">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              className="ficha-clinica-tabs"
              destroyInactiveTabPane={false}
            />
          </Card>
        </section>

        <aside className="ficha-clinica-patient-rail">
          <div className="ficha-clinica-patient-header">
            <div className="ficha-clinica-patient-header-top">
              <Button type="text" icon={<span className="ficha-clinica-patient-arrow">↙</span>} />
              <Typography.Text className="ficha-clinica-patient-name">{patientLabel}</Typography.Text>
              <Button type="text" icon={<span className="ficha-clinica-patient-arrow">›</span>} />
            </div>
          </div>

          <div className="ficha-clinica-calendar">
            <div className="ficha-clinica-calendar-header">
              <Button type="text" icon={<span className="ficha-clinica-calendar-nav">◀</span>} />
              <Typography.Text className="ficha-clinica-calendar-title">Junho 2026</Typography.Text>
              <Button type="text" icon={<span className="ficha-clinica-calendar-nav">▶</span>} />
            </div>

            <div className="ficha-clinica-calendar-days-head">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="ficha-clinica-calendar-grid">
              {calendarDays.map((day, index) => (
                <div
                  key={day === null ? `empty-${index}` : `day-${day}`}
                  className={`ficha-clinica-calendar-cell${day === currentDay ? ' is-today' : ''}${day === null ? ' is-empty' : ''}`}
                >
                  {day || ''}
                </div>
              ))}
            </div>
          </div>

          <div className="ficha-clinica-patient-meta">
            <Tag color={selectedPatient ? 'green' : 'gold'} className="ficha-clinica-patient-status">
              {selectedPatient ? 'Paciente em uso' : 'Sem paciente em uso'}
            </Tag>
            <Typography.Title level={4} className="ficha-clinica-patient-title">
              {patientLabel}
            </Typography.Title>
            <Typography.Text className="ficha-clinica-patient-subtitle">
              {selectedPatient
                ? `${formatStatus(selectedPatient)} | ${formatTelefone(selectedPatient) || 'Sem telefone'}`
                : 'Use a busca superior para localizar um paciente.'}
            </Typography.Text>
          </div>

          <div className="ficha-clinica-patient-actions">
            <Button icon={<SearchOutlined />} onClick={() => handlePlaceholderAction('Buscar paciente')}>
              Buscar paciente
            </Button>
            <Button icon={<TeamOutlined />} onClick={handleClearPatient} disabled={!selectedPatient}>
              Limpar
            </Button>
            <Button type="primary" icon={<FileTextOutlined />} onClick={() => handlePlaceholderAction('Abrir ficha clínica')}>
              Fluxo em implantação
            </Button>
          </div>

          <div className="ficha-clinica-patient-footer">
            <Typography.Text strong>26/06/2026 Sexta-feira</Typography.Text>
            <Space size={12}>
              <Button type="text" icon={<SearchOutlined />} />
              <Button type="text" icon={<PlusOutlined />} />
            </Space>
          </div>

          <div className="ficha-clinica-patient-back">
            <Button block onClick={onBackHome}>
              Voltar para Início
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
