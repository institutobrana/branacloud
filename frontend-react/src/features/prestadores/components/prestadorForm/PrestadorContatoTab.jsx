import { Input, Select } from 'antd';
import { useEffect, useState } from 'react';

import { listarAuxiliares } from '../../../tabelasAuxiliares/auxiliaresApi.js';
import { UNIDADE_ATENDIMENTO_UFS } from '../../../unidadesAtendimento/constants/unidadeAtendimentoOptions.js';

const DEFAULT_PHONE_TYPES = ['Residencial', 'Comercial', 'Celular', 'Recado'];
const DEFAULT_CITY_OPTIONS = ['São José do Rio Preto', 'Mirassol', 'Cedral', 'Bálsamo'];
const DEFAULT_ADDRESS_TYPES = ['Rua', 'Avenida', 'Alameda', 'Travessa'];

function normalizeAuxOptions(items, fallback = []) {
  const normalized = (Array.isArray(items) ? items : [])
    .map((item) => {
      const label = String(item?.descricao || item?.name || item?.codigo || '').trim();
      if (!label) return null;
      return { value: label, label };
    })
    .filter(Boolean);

  if (normalized.length) return normalized;
  return fallback.map((value) => ({ value, label: value }));
}

function ContactField({ label, children, className = '' }) {
  return (
    <label className={`prestadores-modal-contact-field ${className}`.trim()}>
      <span className="prestadores-modal-contact-label">{label}</span>
      <div className="prestadores-modal-contact-control">{children}</div>
    </label>
  );
}

export function PrestadorContatoTab({ draft, updateDraft }) {
  const [foneTypes] = useState(() => DEFAULT_PHONE_TYPES.map((value) => ({ value, label: value })));
  const [logradouroTypes, setLogradouroTypes] = useState(() => DEFAULT_ADDRESS_TYPES.map((value) => ({ value, label: value })));
  const [bairroOptions, setBairroOptions] = useState([]);
  const [cidadeOptions, setCidadeOptions] = useState(() => DEFAULT_CITY_OPTIONS.map((value) => ({ value, label: value })));
  const [ufOptions] = useState(() => UNIDADE_ATENDIMENTO_UFS);
  const form = draft || {};

  useEffect(() => {
    let alive = true;

    async function loadOptions() {
      try {
        const [logradouroItems, bairroItems, cidadeItems] = await Promise.all([
          listarAuxiliares('Tipos de logradouro'),
          listarAuxiliares('Bairro'),
          listarAuxiliares('Cidade'),
        ]);

        if (!alive) return;

        setLogradouroTypes(normalizeAuxOptions(logradouroItems, DEFAULT_ADDRESS_TYPES));
        setBairroOptions(normalizeAuxOptions(bairroItems, []));
        setCidadeOptions(normalizeAuxOptions(cidadeItems, DEFAULT_CITY_OPTIONS));
      } catch {
        if (!alive) return;
        setLogradouroTypes(DEFAULT_ADDRESS_TYPES.map((value) => ({ value, label: value })));
        setBairroOptions([]);
        setCidadeOptions(DEFAULT_CITY_OPTIONS.map((value) => ({ value, label: value })));
      }
    }

    loadOptions();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="prestadores-modal-tab prestadores-modal-tab--contato">
      <div className="prestadores-modal-contact-row prestadores-modal-contact-row--phones">
        <ContactField label="Telefones:" className="prestadores-modal-contact-field--phone-type">
          <Select placeholder="Selecione" options={foneTypes} value={form.fone1_tipo ?? 'Residencial'} onChange={(value) => updateDraft({ fone1_tipo: value })} />
        </ContactField>
        <ContactField label="&nbsp;" className="prestadores-modal-contact-field--phone-value">
          <Input placeholder="Telefone 1" value={form.fone1 ?? ''} onChange={(event) => updateDraft({ fone1: event.target.value })} />
        </ContactField>
        <ContactField label="&nbsp;" className="prestadores-modal-contact-field--phone-type">
          <Select placeholder="Selecione" options={foneTypes} value={form.fone2_tipo ?? 'Comercial'} onChange={(value) => updateDraft({ fone2_tipo: value })} />
        </ContactField>
        <ContactField label="&nbsp;" className="prestadores-modal-contact-field--phone-value">
          <Input placeholder="Telefone 2" value={form.fone2 ?? ''} onChange={(event) => updateDraft({ fone2: event.target.value })} />
        </ContactField>
      </div>

      <div className="prestadores-modal-contact-row prestadores-modal-contact-row--single">
        <ContactField label="E-mail principal:" className="prestadores-modal-contact-field--wide">
          <Input placeholder="E-mail" value={form.email ?? ''} onChange={(event) => updateDraft({ email: event.target.value })} />
        </ContactField>
      </div>

      <div className="prestadores-modal-contact-row prestadores-modal-contact-row--single">
        <ContactField label="Home-page:" className="prestadores-modal-contact-field--wide">
          <Input placeholder="Home-page" value={form.homepage ?? ''} onChange={(event) => updateDraft({ homepage: event.target.value })} />
        </ContactField>
      </div>

      <div className="prestadores-modal-contact-row prestadores-modal-contact-row--address">
        <ContactField label="Endereço residencial:" className="prestadores-modal-contact-field--logradouro">
          <Select placeholder="Selecione" options={logradouroTypes} value={form.logradouro_tipo ?? ''} onChange={(value) => updateDraft({ logradouro_tipo: value })} />
        </ContactField>
        <ContactField label="&nbsp;" className="prestadores-modal-contact-field--endereco">
          <Input placeholder="Endereço" value={form.endereco ?? ''} onChange={(event) => updateDraft({ endereco: event.target.value })} />
        </ContactField>
        <ContactField label="Nº:" className="prestadores-modal-contact-field--numero">
          <Input placeholder="Nº" value={form.numero ?? ''} onChange={(event) => updateDraft({ numero: event.target.value })} />
        </ContactField>
        <ContactField label="Complemento:" className="prestadores-modal-contact-field--complemento">
          <Input placeholder="Complemento" value={form.complemento ?? ''} onChange={(event) => updateDraft({ complemento: event.target.value })} />
        </ContactField>
      </div>

      <div className="prestadores-modal-contact-row prestadores-modal-contact-row--location">
        <ContactField label="Bairro:" className="prestadores-modal-contact-field--bairro">
          <Select
            placeholder="Selecione"
            options={bairroOptions}
            showSearch
            optionFilterProp="label"
            value={form.bairro ?? ''}
            onChange={(value) => updateDraft({ bairro: value })}
          />
        </ContactField>
        <ContactField label="Cidade:" className="prestadores-modal-contact-field--cidade">
          <Select
            placeholder="Selecione"
            options={cidadeOptions}
            showSearch
            optionFilterProp="label"
            value={form.cidade ?? 'São José do Rio Preto'}
            onChange={(value) => updateDraft({ cidade: value })}
          />
        </ContactField>
        <ContactField label="CEP:" className="prestadores-modal-contact-field--cep">
          <Input placeholder="CEP" value={form.cep ?? ''} onChange={(event) => updateDraft({ cep: event.target.value })} />
        </ContactField>
        <ContactField label="UF:" className="prestadores-modal-contact-field--uf">
          <Select placeholder="UF" options={ufOptions} value={form.uf ?? 'SP'} onChange={(value) => updateDraft({ uf: value })} />
        </ContactField>
      </div>
    </div>
  );
}
