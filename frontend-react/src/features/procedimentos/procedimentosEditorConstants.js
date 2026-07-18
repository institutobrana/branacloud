export const PROCEDIMENTO_EDITOR_MODE = Object.freeze({
  NEW: 'new',
  EDIT: 'edit',
});

export const PROCEDIMENTO_FORMA_COBRANCA_OPTIONS = Object.freeze([
  { value: 'INTERVENCAO', label: 'Intervenção' },
  { value: 'ELEMENTO_FACE', label: 'Elemento/Face' },
]);

export const PROCEDIMENTO_MATERIAIS_COLUMNS = Object.freeze([
  'Código',
  'Material vinculado ao procedimento',
  'Relação',
  'Preço R$',
  'Custo / UND',
  'Quantidade',
  'Custo R$',
]);

export const PROCEDIMENTO_FINANCEIRO_FIELDS = Object.freeze([
  'CFPH',
  'Mat. Consumo',
  'Custo R$',
  'Imposto',
  'Comissão CD',
  'Taxa Cartão',
  'Valor Mínimo',
  'Lucro Bruto',
  'Lucro Líquido',
  'Rendimento %',
  'Bom 30 a 40%',
  'Bom 10 a 20%',
  'Lucro por hora',
]);
