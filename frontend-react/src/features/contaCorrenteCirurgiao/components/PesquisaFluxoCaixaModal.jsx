import { Button, Modal, Tabs } from 'antd';
import { CriteriosAdicionaisTab } from './CriteriosAdicionaisTab.jsx';
import { CriteriosGeraisTab } from './CriteriosGeraisTab.jsx';
import { OpcoesRelatorioTab } from './OpcoesRelatorioTab.jsx';

function PesquisaFluxoCaixaTab({ tabKey, surgeonOptions, surgeonId }) {
  if (tabKey === 'geral') return <CriteriosGeraisTab surgeonOptions={surgeonOptions} initialSurgeonId={surgeonId} />;
  if (tabKey === 'adicionais') return <CriteriosAdicionaisTab />;
  if (tabKey === 'opcoes') return <OpcoesRelatorioTab />;
  return <div className="pesquisa-fluxo-caixa-modal-placeholder" data-tab-key={tabKey} />;
}

export function PesquisaFluxoCaixaModal({ open, activeKey, onTabChange, onClose, surgeonOptions, surgeonId }) {
  return (
    <Modal
      open={open}
      title="Pesquisa fluxo de caixa"
      onCancel={onClose}
      footer={[
        <Button key="novo" onClick={() => {}}>
          Novo
        </Button>,
        <Button key="ok" type="primary" onClick={() => {}}>
          Ok
        </Button>,
        <Button key="cancel" onClick={onClose}>
          Cancela
        </Button>,
      ]}
      width={712}
      destroyOnClose
      maskClosable={false}
      keyboard
      centered
      className="conta-corrente-cirurgiao-modal conta-corrente-cirurgiao-pesquisa-modal"
      styles={{
        body: {
          padding: '10px 12px 12px',
        },
      }}
    >
      <Tabs
        activeKey={activeKey}
        onChange={onTabChange}
        type="card"
        className="conta-corrente-cirurgiao-classic-tabs conta-corrente-cirurgiao-pesquisa-tabs"
        items={[
          { key: 'geral', label: 'Critérios gerais', children: <PesquisaFluxoCaixaTab tabKey="geral" surgeonOptions={surgeonOptions} surgeonId={surgeonId} /> },
          { key: 'adicionais', label: 'Critérios adicionais', children: <PesquisaFluxoCaixaTab tabKey="adicionais" surgeonOptions={surgeonOptions} surgeonId={surgeonId} /> },
          { key: 'opcoes', label: 'Opções de relatório', children: <PesquisaFluxoCaixaTab tabKey="opcoes" surgeonOptions={surgeonOptions} surgeonId={surgeonId} /> },
        ]}
      />
    </Modal>
  );
}
