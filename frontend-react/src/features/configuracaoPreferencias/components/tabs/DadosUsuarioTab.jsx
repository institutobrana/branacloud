import { Input, Select } from 'antd';
import { UNIDADE_ATENDIMENTO_UFS } from '../../../unidadesAtendimento/constants/unidadeAtendimentoOptions.js';

function Field({ label, name, values, update, className = '' }) {
  return <label className={`config-preferencias-field ${className}`.trim()}><span>{label}</span><Input value={values[name] ?? ''} onChange={(event) => update({ [name]: event.target.value })} /></label>;
}

export function DadosUsuarioTab({ values, update }) {
  return <div className="config-preferencias-dados-usuario" aria-label="Dados do usuário">
    <Field label="Nome" name="nome" values={values} update={update} className="config-preferencias-dados-span-all" />
    <Field label="Endereço" name="endereco" values={values} update={update} className="config-preferencias-dados-span-all" />
    <Field label="Bairro" name="bairro" values={values} update={update} />
    <Field label="Cidade" name="cidade" values={values} update={update} />
    <Field label="CEP" name="cep" values={values} update={update} />
    <label className="config-preferencias-field"><span>UF</span><Select value={values.uf || undefined} allowClear options={UNIDADE_ATENDIMENTO_UFS} onChange={(value) => update({ uf: value || '' })} /></label>
    <Field label="País" name="pais" values={values} update={update} />
    <Field label="Telefones" name="telefones" values={values} update={update} />
    <Field label="CRO" name="cro" values={values} update={update} />
    <Field label="CPF" name="cpf" values={values} update={update} />
  </div>;
}
