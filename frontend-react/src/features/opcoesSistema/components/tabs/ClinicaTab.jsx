import { Input, Select } from 'antd';
import { UF_OPTIONS } from '../../constants/opcoesSistemaConstants.js';
function Field({ label, children, className = '' }) { return <label className={`opcoes-sistema-field ${className}`.trim()}><span>{label}</span>{children}</label>; }
export function ClinicaTab({ values, update }) { return <div className="opcoes-sistema-grid clinica" aria-label="Opções da clínica">
  <Field label="Nome:" className="clinica-nome"><Input value={values.nome} onChange={(e) => update({ nome: e.target.value })} /></Field>
  <Field label="Endereço:" className="clinica-endereco"><Input value={values.endereco} onChange={(e) => update({ endereco: e.target.value })} /></Field><Field label="Complemento:" className="clinica-complemento"><Input value={values.complemento} onChange={(e) => update({ complemento: e.target.value })} /></Field>
  <Field label="CEP:" className="clinica-cep"><Input value={values.cep} onChange={(e) => update({ cep: e.target.value })} /></Field><Field label="UF:" className="clinica-uf"><Select value={values.uf || undefined} options={UF_OPTIONS} onChange={(value) => update({ uf: value || '' })} /></Field><Field label="Telefones:" className="clinica-telefones"><Input value={values.telefones} onChange={(e) => update({ telefones: e.target.value })} /></Field>
  <Field label="CNPJ:" className="clinica-cnpj"><Input value={values.cnpj} onChange={(e) => update({ cnpj: e.target.value })} /></Field><Field label="Inscrição Estadual:" className="clinica-ie"><Input value={values.inscricao_estadual} onChange={(e) => update({ inscricao_estadual: e.target.value })} /></Field>
</div>; }
