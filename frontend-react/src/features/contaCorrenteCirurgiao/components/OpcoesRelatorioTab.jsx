import { useEffect, useMemo, useState } from 'react';
import { Button, Input, Radio, Select } from 'antd';

const availableItems = [
  'Categoria',
  'Cirurgião',
  'Complemento',
  'Crédito',
  'Data',
  'Débito',
  'Grupo',
  'Histórico',
  'Lançamento',
  'Nº Documento',
  'Pagamento',
  'Referência',
  'Saldo',
];

const outputOptions = [
  { value: 'Tela', label: 'Tela' },
  { value: 'Arquivo', label: 'Arquivo' },
  { value: 'Imprimir', label: 'Imprimir' },
];

function buildRows(items) {
  return items.map((item) => ({ key: item, nome: item }));
}

function moveItemToFront(items, value) {
  if (!value || !items.includes(value)) {
    return items;
  }

  return [value, ...items.filter((item) => item !== value)];
}

export function OpcoesRelatorioTab() {
  const [selecionados, setSelecionados] = useState([]);
  const [selectedDisponiveis, setSelectedDisponiveis] = useState([]);
  const [selectedSelecionados, setSelectedSelecionados] = useState([]);
  const [nomeRelatorio, setNomeRelatorio] = useState('Relatório de contas do cirurgião');
  const [ordem, setOrdem] = useState('Data');
  const [saida, setSaida] = useState('Tela');
  const [orientacao, setOrientacao] = useState('paisagem');

  const rowsDisponiveis = useMemo(() => buildRows(availableItems), []);
  const rowsSelecionados = useMemo(() => buildRows(selecionados), [selecionados]);
  const orderOptions = useMemo(() => {
    return selecionados.map((item) => ({ value: item, label: item }));
  }, [selecionados]);

  const ordemAtual = selecionados.includes(ordem) ? ordem : (selecionados[0] || 'Data');

  useEffect(() => {
    if (selecionados.length === 0) {
      if (ordem !== 'Data') {
        setOrdem('Data');
      }
      return;
    }

    if (!selecionados.includes(ordem)) {
      setOrdem(selecionados[0]);
    }
  }, [ordem, selecionados]);

  const incluir = () => {
    if (!selectedDisponiveis.length) return;
    setSelecionados((current) => {
      const next = [...current];
      selectedDisponiveis.forEach((key) => {
        if (!next.includes(key)) next.push(key);
      });
      return next;
    });
    setSelectedDisponiveis([]);
  };

  const excluir = () => {
    if (!selectedSelecionados.length) return;
    setSelecionados((current) => current.filter((item) => !selectedSelecionados.includes(item)));
    setSelectedSelecionados([]);
  };

  const incluirPorDuploClique = (key) => {
    setSelectedDisponiveis([key]);
    setSelecionados((current) => (current.includes(key) ? current : [...current, key]));
    setSelectedDisponiveis([]);
  };

  const excluirPorDuploClique = (key) => {
    setSelectedSelecionados([key]);
    setSelecionados((current) => current.filter((item) => item !== key));
    setSelectedSelecionados([]);
  };

  const onChangeOrdem = (value) => {
    setOrdem(value);
    setSelecionados((current) => moveItemToFront(current, value));
  };

  return (
    <div className="pesquisa-fluxo-caixa-opcoes">
      <div className="pesquisa-fluxo-caixa-opcoes-grid">
        <section className="pesquisa-fluxo-caixa-opcoes-panel pesquisa-fluxo-caixa-opcoes-panel--available">
          <div className="pesquisa-fluxo-caixa-opcoes-title">Dados disponíveis:</div>
          <div className="pesquisa-fluxo-caixa-opcoes-list" role="listbox" aria-label="Dados disponíveis">
            {rowsDisponiveis.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`pesquisa-fluxo-caixa-opcoes-row${selectedDisponiveis[0] === item.key ? ' is-selected' : ''}`}
                onClick={() => setSelectedDisponiveis([item.key])}
                onDoubleClick={() => incluirPorDuploClique(item.key)}
              >
                <span className="pesquisa-fluxo-caixa-opcoes-row-text">{item.nome}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="pesquisa-fluxo-caixa-opcoes-actions">
          <Button onClick={incluir} disabled={!selectedDisponiveis.length}>
            Inclui &gt;&gt;
          </Button>
          <Button onClick={excluir} disabled={!selectedSelecionados.length}>
            &lt;&lt; Exclui
          </Button>
        </div>

        <section className="pesquisa-fluxo-caixa-opcoes-panel pesquisa-fluxo-caixa-opcoes-panel--selected">
          <div className="pesquisa-fluxo-caixa-opcoes-title">Dados selecionados:</div>
          <div className="pesquisa-fluxo-caixa-opcoes-list" role="listbox" aria-label="Dados selecionados">
            {rowsSelecionados.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`pesquisa-fluxo-caixa-opcoes-row${selectedSelecionados[0] === item.key ? ' is-selected' : ''}`}
                onClick={() => setSelectedSelecionados([item.key])}
                onDoubleClick={() => excluirPorDuploClique(item.key)}
              >
                <span className="pesquisa-fluxo-caixa-opcoes-row-text">{item.nome}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="pesquisa-fluxo-caixa-opcoes-side">
          <label className="pesquisa-fluxo-caixa-opcoes-field">
            <span>Ordem de impressão:</span>
            <Select value={ordemAtual} onChange={onChangeOrdem} options={orderOptions} placeholder="Selecione" />
          </label>

          <label className="pesquisa-fluxo-caixa-opcoes-field">
            <span>Saída do relatório:</span>
            <Select value={saida} onChange={setSaida} options={outputOptions} />
          </label>

          <div className="pesquisa-fluxo-caixa-opcoes-radio-group">
            <div className="pesquisa-fluxo-caixa-opcoes-radio-title">Modo de impressão</div>
            <Radio.Group value={orientacao} onChange={(event) => setOrientacao(event.target.value)}>
              <Radio value="retrato">Modo "Retrato"</Radio>
              <Radio value="paisagem">Modo "Paisagem"</Radio>
            </Radio.Group>
          </div>
        </div>
      </div>

      <div className="pesquisa-fluxo-caixa-opcoes-footer">
        <label className="pesquisa-fluxo-caixa-opcoes-field pesquisa-fluxo-caixa-opcoes-field--full">
          <span>Nome do relatório:</span>
          <Input value={nomeRelatorio} onChange={(event) => setNomeRelatorio(event.target.value)} />
        </label>
      </div>
    </div>
  );
}
