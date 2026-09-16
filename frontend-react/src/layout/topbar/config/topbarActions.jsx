import {
  CalendarOutlined, DollarCircleFilled, FieldTimeOutlined, FileTextOutlined,
  HomeOutlined, MailOutlined, MoneyCollectOutlined, RocketOutlined,
  SnippetsOutlined, TransactionOutlined, UserAddOutlined, UsergroupAddOutlined,
} from '@ant-design/icons';
import { BranaEstoqueIcon } from '../icons/BranaEstoqueIcon.jsx';
import { BranaFichaClinicaIcon } from '../icons/BranaFichaClinicaIcon.jsx';
import { BranaPacienteIcon } from '../../../shared/icons/BranaPacienteIcon.jsx';

export const topbarActionGroups = [
  { key: 'agenda-clinica', items: [
    { key: 'dashboard', label: 'Dashboard', icon: <HomeOutlined />, target: 'dashboard' }, { key: 'agenda', label: 'Agenda', icon: <CalendarOutlined />, target: 'agenda-semanal' },
    { key: 'proximo-agendado', label: 'Próximo agendado', icon: <FieldTimeOutlined /> }, { key: 'cadastro-pacientes', label: 'Cadastro de pacientes', icon: <UsergroupAddOutlined />, target: 'pacientes' },
    { key: 'paciente', label: 'Paciente', icon: <BranaPacienteIcon />, target: 'pacientes' }, { key: 'novo-paciente', label: 'Novo paciente', icon: <UserAddOutlined />, target: { screen: 'pacientes', intent: 'new-patient' } },
    { key: 'anamnese', label: 'Anamnese', icon: <SnippetsOutlined />, target: 'questionarios-anamnese' }, { key: 'ficha-clinica', label: 'Ficha clínica', icon: <BranaFichaClinicaIcon />, target: 'ficha-clinica' },
  ] },
  { key: 'financeiro-estoque', items: [
    { key: 'contas-pagar', label: 'Contas a pagar', icon: <DollarCircleFilled /> }, { key: 'contas-receber', label: 'Contas a receber', icon: <MoneyCollectOutlined /> },
    { key: 'fluxo-caixa', label: 'Fluxo de caixa', icon: <TransactionOutlined />, target: 'conta-corrente-cirurgiao' }, { key: 'controle-estoque', label: 'Controle de estoque', icon: <BranaEstoqueIcon /> },
  ] },
  { key: 'produtividade-crm', items: [
    { key: 'editor-textos', label: 'Editor de textos', icon: <FileTextOutlined />, target: 'editor-textos' }, { key: 'mala-direta', label: 'Mala direta', icon: <MailOutlined /> }, { key: 'crm-vendas', label: 'CRM de vendas', icon: <RocketOutlined /> },
  ] },
];

export const topbarUserMenuItems = [
  { key: 'alterar-senha', label: 'Alterar senha interna' }, { key: 'opcoes-conta', label: 'Opções da conta' }, { key: 'opcoes-sistema', label: 'Opções do sistema' }, { key: 'preferencias', label: 'Preferências' }, { type: 'divider' }, { key: 'sair', label: 'Sair' },
];
