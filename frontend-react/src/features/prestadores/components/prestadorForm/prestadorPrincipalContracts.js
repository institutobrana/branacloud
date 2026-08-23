import { UNIDADE_ATENDIMENTO_UFS } from '../../../unidadesAtendimento/constants/unidadeAtendimentoOptions.js';

export const PRESTADOR_TIPO_DEFAULT = 'Cirurgião dentista';
export const PRESTADOR_CBO_DEFAULT = 'Cir.Dentista em Geral';

export const PRESTADOR_TIPO_OPTIONS = [
  { value: '01', label: 'Cirurgião dentista' },
  { value: '02', label: 'Clínica odontológica' },
  { value: '03', label: 'Clínica ortodôntica' },
  { value: '04', label: 'Clínica radiológica' },
  { value: '05', label: 'Perito' },
];

export const PRESTADOR_CBO_OPTIONS = [
  { value: '06310', label: 'Cir.Dentista em Geral' },
  { value: '06330', label: 'Cir.Dentista (saúde pública)' },
  { value: '06335', label: 'Cir.Dentista (traumatologia buco maxilo facial)' },
  { value: '06340', label: 'Cir.Dentista (endodontia)' },
  { value: '06345', label: 'Cir.Dentista (ortodontia)' },
  { value: '06350', label: 'Cir.Dentista (patologia bucal)' },
  { value: '06355', label: 'Cir.Dentista (pediatria)' },
  { value: '06360', label: 'Cir.Dentista (prótese)' },
  { value: '06365', label: 'Cir.Dentista (radiologia)' },
  { value: '06370', label: 'Cir.Dentista (periodontia)' },
];

export const PRESTADOR_SEXO_OPTIONS = [
  { value: 'Masculino', label: 'Masculino' },
  { value: 'Feminino', label: 'Feminino' },
];

export const PRESTADOR_ESTADO_CIVIL_OPTIONS = [
  { value: 'Casado(a)', label: 'Casado(a)' },
  { value: 'Desquitado(a)', label: 'Desquitado(a)' },
  { value: 'Divorciado(a)', label: 'Divorciado(a)' },
  { value: 'Outro', label: 'Outro' },
  { value: 'Separado(a)', label: 'Separado(a)' },
  { value: 'Solteiro(a)', label: 'Solteiro(a)' },
  { value: 'Viúvo(a)', label: 'Viúvo(a)' },
  { value: 'União Estável', label: 'União Estável' },
];

export const PRESTADOR_PREFIXO_OPTIONS = [
  { value: 'Dr', label: 'Dr' },
  { value: 'Dra', label: 'Dra' },
  { value: 'Sr', label: 'Sr' },
  { value: 'Sra', label: 'Sra' },
];

export const PRESTADOR_UF_CRO_OPTIONS = UNIDADE_ATENDIMENTO_UFS;

export function buildPrestadorPrincipalDefaults(items = []) {
  const hoje = new Date().toLocaleDateString('pt-BR');
  return {
    codigo: '',
    tipo_prestador: PRESTADOR_TIPO_DEFAULT,
    inicio: hoje,
    termino: '',
    inativo: false,
    executa_procedimento: true,
    uf_cro: '',
    cbos: PRESTADOR_CBO_DEFAULT,
    sexo: '',
    estado_civil: '',
    prefixo: '',
    inclusao: hoje,
    alteracao: hoje,
    id_interno: String(Date.now()).slice(-6),
  };
}
