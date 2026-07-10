import { useEffect, useMemo, useState } from 'react';
import { Button, Checkbox, Form, Input, Modal, Select, Tabs, Table, Typography, message } from 'antd';
import {
  carregarCenarioProcedimentoGenerico,
  listarProcedimentosGenericosEspecialidades,
  listarSimbolosGraficoGenericos,
  obterProcedimentoGenericoDetalhe,
  obterProximoCodigoProcedimentoGenerico,
  salvarProcedimentoGenerico,
} from './procedimentosGenericosApi.js';

function formatMoney(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
}

function formatDecimal(value) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function buildEmptyState(codigo = '') {
  return {
    id: null,
    codigo: String(codigo || ''),
    descricao: '',
    especialidade: '',
    tempo: 0,
    custo_lab: 0,
    peso: 0,
    simbolo_grafico: '',
    mostrar_simbolo: false,
    inativo: false,
    observacoes: '',
    data_inclusao: '',
    data_alteracao: '',
    fases: [],
    materiais: [],
    vinculos: [],
  };
}

function normalizeQuantidade(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return 0;
  const normalized = raw.replace(/\s+/g, '').replace(',', '.');
  const next = Number(normalized);
  return Number.isFinite(next) ? next : 0;
}

function buildPayload(state) {
  return {
    codigo: String(state?.codigo || '').trim(),
    descricao: String(state?.descricao || '').trim(),
    especialidade: String(state?.especialidade || '').trim(),
    tempo: Math.max(0, Number(state?.tempo || 0)),
    custo_lab: Number(state?.custo_lab || 0),
    peso: Number(state?.peso || 0),
    simbolo_grafico: String(state?.simbolo_grafico || '').trim(),
    mostrar_simbolo: !!String(state?.simbolo_grafico || '').trim(),
    inativo: !!state?.inativo,
    observacoes: String(state?.observacoes || '').trim(),
    fases: Array.isArray(state?.fases)
      ? state.fases
          .map((fase, index) => ({
            codigo: String(fase?.codigo || '').trim(),
            descricao: String(fase?.descricao || '').trim(),
            sequencia: index + 1,
            tempo: Number(fase?.tempo || 0),
          }))
          .filter((fase) => fase.descricao)
      : [],
    materiais: Array.isArray(state?.materiais)
      ? state.materiais
          .map((material) => ({
            material_id: Number(material?.material_id || 0),
            quantidade: normalizeQuantidade(material?.quantidade || 0),
          }))
          .filter((material) => material.material_id > 0 && material.quantidade > 0)
      : [],
  };
}

function buildCustoTotals(state, cenario) {
  const tempo = Math.max(0, Number(state?.tempo || 0));
  const custoLab = Math.max(0, Number(state?.custo_lab || 0));
  const custoMateriais = Array.isArray(state?.materiais)
    ? state.materiais.reduce((total, material) => total + Number(material?.custo_und || 0) * Number(material?.quantidade || 0), 0)
    : 0;
  const custoFixo = Math.max(0, Number(cenario?.cfpm || 0)) * tempo;
  const custoTotal = custoFixo + custoLab + custoMateriais;
  return {
    tempo,
    custoLab,
    custoMateriais,
    custoFixo,
    custoTotal,
  };
}

export function ProcedimentoGenericoModal({ open, mode = 'novo', itemId = null, onClose, onSaved, focusToken }) {
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState('principal');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [specialidades, setSpecialidades] = useState([]);
  const [simbolos, setSimbolos] = useState([]);
  const [cenario, setCenario] = useState({ cfph: 0, cfpm: 0 });
  const [state, setState] = useState(buildEmptyState());

  const isEditing = mode === 'editar' || Boolean(itemId);
  const title = isEditing ? 'Altera procedimento genérico' : 'Novo procedimento genérico';

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const [nextSpecialidades, nextSimbolos, nextCenario] = await Promise.all([
          listarProcedimentosGenericosEspecialidades(),
          listarSimbolosGraficoGenericos(),
          carregarCenarioProcedimentoGenerico(),
        ]);
        if (cancelled) return;
        setSpecialidades(nextSpecialidades);
        setSimbolos(nextSimbolos);
        setCenario(nextCenario);

        if (isEditing && itemId) {
          const nextState = await obterProcedimentoGenericoDetalhe(itemId);
          if (cancelled) return;
          setState(nextState);
          form.setFieldsValue({
            codigo: nextState.codigo,
            descricao: nextState.descricao,
            especialidade: nextState.especialidade || undefined,
            peso: nextState.peso,
            simbolo_grafico: nextState.simbolo_grafico || undefined,
            observacoes: nextState.observacoes,
            inativo: nextState.inativo,
          });
        } else {
          const codigo = await obterProximoCodigoProcedimentoGenerico();
          if (cancelled) return;
          const nextState = buildEmptyState(codigo);
          setState(nextState);
          form.resetFields();
          form.setFieldsValue({
            codigo: nextState.codigo,
            descricao: '',
            especialidade: undefined,
            peso: 0,
            simbolo_grafico: undefined,
            observacoes: '',
            inativo: false,
          });
        }
        setActiveKey('principal');
      } catch (error) {
        message.error(error?.message || 'Falha ao carregar procedimento genérico.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [form, isEditing, itemId, open]);

  useEffect(() => {
    if (!open) return;
    if (!focusToken) return;
    setActiveKey('principal');
  }, [focusToken, open]);

  const totals = useMemo(() => buildCustoTotals(state, cenario), [cenario, state]);

  useEffect(() => {
    if (!open) return;
    const nextValues = {
      codigo: state.codigo,
      descricao: state.descricao,
      especialidade: state.especialidade || undefined,
      peso: state.peso,
      simbolo_grafico: state.simbolo_grafico || undefined,
      observacoes: state.observacoes,
      inativo: state.inativo,
      tempo: state.tempo,
      custo_lab: state.custo_lab,
    };
    form.setFieldsValue(nextValues);
  }, [form, open, state]);

  const symbolPreview = useMemo(() => {
    const codigo = String(state.simbolo_grafico || '').trim();
    if (!codigo) return null;
    const item = simbolos.find((entry) => String(entry?.codigo || '').trim() === codigo) || null;
    if (!item?.imagem_url) return null;
    return <img src={item.imagem_url} alt="" className="procedimento-generico-symbol-preview-img" />;
  }, [simbolos, state.simbolo_grafico]);

  const vinculos = Array.isArray(state.vinculos) ? state.vinculos : [];

  const updateField = (name, value) => {
    setState((current) => ({ ...current, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const nextState = {
        ...state,
        codigo: String(values.codigo || '').trim(),
        descricao: String(values.descricao || '').trim(),
        especialidade: String(values.especialidade || '').trim(),
        peso: Number(values.peso || 0),
        simbolo_grafico: String(values.simbolo_grafico || '').trim(),
        observacoes: String(values.observacoes || '').trim(),
        inativo: !!values.inativo,
      };
      const payload = buildPayload(nextState);
      setSaving(true);
      const saved = await salvarProcedimentoGenerico({ id: state.id, payload });
      message.success('Procedimento genérico salvo com sucesso.');
      onSaved?.(saved);
      onClose?.();
    } catch (error) {
      if (error?.errorFields) return;
      message.error(error?.message || 'Falha ao gravar procedimento genérico.');
    } finally {
      setSaving(false);
    }
  };

  const custoRows = [
    {
      key: 'cfph',
      label: 'Custo da hora clínica:',
      value: formatMoney(cenario.cfph),
      accent: true,
    },
    {
      key: 'tempo',
      label: 'Tempo total de execução:',
      input: (
        <Input
          value={String(state.tempo ?? 0)}
          onChange={(event) => updateField('tempo', Math.max(0, Number(event.target.value || 0)))}
          inputMode="numeric"
        />
      ),
      suffix: 'min',
    },
    {
      key: 'custo_fixo',
      label: 'Custo fixo da intervenção:',
      value: formatMoney(totals.custoFixo),
      accent: true,
    },
    {
      key: 'custo_lab',
      label: 'Custo de protético:',
      input: (
        <Input
          value={formatDecimal(state.custo_lab)}
          onChange={(event) => updateField('custo_lab', normalizeQuantidade(event.target.value))}
        />
      ),
    },
    {
      key: 'custo_materiais',
      label: 'Custo de materiais:',
      value: formatMoney(totals.custoMateriais),
      accent: true,
    },
    {
      key: 'custo_total',
      label: 'Custo total:',
      value: formatMoney(totals.custoTotal),
      accent: true,
    },
  ];

  const vinculosColumns = [
    { title: 'Tabela', dataIndex: 'tabela_nome', key: 'tabela_nome', width: 160, render: (value, record) => value || String(record?.tabela_id || '') || '-' },
    { title: 'Código', dataIndex: 'codigo', key: 'codigo', width: 120, render: (value) => value || '-' },
    { title: 'Nome', dataIndex: 'nome', key: 'nome', render: (value) => value || '-' },
  ];

  return (
    <Modal
      open={open}
      centered
      width={620}
      destroyOnClose
      onCancel={onClose}
      footer={null}
      className="procedimento-generico-modal"
      confirmLoading={saving}
    >
      <div className="procedimento-generico-modal-header">
        <Typography.Title level={3} className="procedimento-generico-modal-title">
          {title}
        </Typography.Title>
      </div>

      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        className="procedimento-generico-modal-tabs"
        items={[
          {
            key: 'principal',
            label: 'Principal',
            children: (
              <Form form={form} layout="vertical" className="procedimento-generico-modal-form">
                <div className="procedimento-generico-principal-grid">
                  <div className="procedimento-generico-symbol-box">{symbolPreview}</div>

                  <Form.Item name="descricao" label="Nome do procedimento genérico:" rules={[{ required: true, message: 'Informe o nome do procedimento genérico.' }]}>
                    <Input value={state.descricao} onChange={(event) => updateField('descricao', event.target.value)} />
                  </Form.Item>

                  <div className="procedimento-generico-principal-row">
                    <Form.Item name="codigo" label="Código genérico:" rules={[{ required: true, message: 'Informe o código genérico.' }]}>
                      <Input value={state.codigo} onChange={(event) => updateField('codigo', event.target.value)} />
                    </Form.Item>

                    <Form.Item name="especialidade" label="Especialidade:">
                      <Select
                        allowClear
                        placeholder="<<Todas>>"
                        options={specialidades.map((item) => ({
                          label: `${String(item?.codigo || '').trim()} - ${String(item?.nome || '').trim()}`,
                          value: String(item?.codigo || '').trim(),
                        }))}
                        value={state.especialidade || undefined}
                        onChange={(value) => updateField('especialidade', value || '')}
                      />
                    </Form.Item>
                  </div>

                  <div className="procedimento-generico-principal-row">
                    <Form.Item name="simbolo_grafico" label="Símbolo gráfico:">
                      <Select
                        allowClear
                        placeholder="Selecione..."
                        options={simbolos.map((item) => ({
                          label: `${String(item?.codigo || '').trim()} - ${String(item?.descricao || '').trim()}`,
                          value: String(item?.codigo || '').trim(),
                        }))}
                        value={state.simbolo_grafico || undefined}
                        onChange={(value) => updateField('simbolo_grafico', value || '')}
                      />
                    </Form.Item>

                    <Form.Item name="peso" label="Peso:">
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        value={String(state.peso ?? 0)}
                        onChange={(event) => updateField('peso', Math.max(0, Number(event.target.value || 0)))}
                      />
                    </Form.Item>
                  </div>

                  <Form.Item name="observacoes" label="Observações:" className="procedimento-generico-wide">
                    <Input.TextArea
                      rows={4}
                      value={state.observacoes}
                      onChange={(event) => updateField('observacoes', event.target.value)}
                    />
                  </Form.Item>

                  <Form.Item name="inativo" valuePropName="checked" className="procedimento-generico-check">
                    <Checkbox checked={state.inativo} onChange={(event) => updateField('inativo', event.target.checked)}>
                      Inativar procedimento
                    </Checkbox>
                  </Form.Item>

                  <div className="procedimento-generico-dates procedimento-generico-wide">
                    <div className="procedimento-generico-date-field">
                      <span>Inclusão:</span>
                      <div className="procedimento-generico-date-box">{state.data_inclusao || ' '}</div>
                    </div>
                    <div className="procedimento-generico-date-field">
                      <span>Alteração:</span>
                      <div className="procedimento-generico-date-box">{state.data_alteracao || ' '}</div>
                    </div>
                  </div>
                </div>
              </Form>
            ),
          },
          {
            key: 'custos',
            label: 'Custos diretos',
            children: (
              <div className="procedimento-generico-costs">
                {custoRows.map((row) => (
                  <div className="procedimento-generico-cost-row" key={row.key}>
                    <span className="procedimento-generico-cost-label">{row.label}</span>
                    <span className="procedimento-generico-cost-currency">{row.key.includes('custo') || row.key === 'cfph' ? 'R$' : ''}</span>
                    <div className={`procedimento-generico-cost-value${row.accent ? ' is-accent' : ''}`}>
                      {row.input || row.value}
                    </div>
                    <span className="procedimento-generico-cost-suffix">{row.suffix || ''}</span>
                  </div>
                ))}
              </div>
            ),
          },
          {
            key: 'vinculos',
            label: 'Vínculos',
            children: (
              <div className="procedimento-generico-links">
                <div className="procedimento-generico-links-table">
                  <Table
                    rowKey={(record) => `${record.tabela_id}-${record.codigo}-${record.nome}`}
                    dataSource={vinculos}
                    columns={vinculosColumns}
                    pagination={false}
                    size="small"
                    bordered
                    locale={{ emptyText: '' }}
                  />
                </div>
                <div className="procedimento-generico-links-footer">{vinculos.length} itens vinculados</div>
              </div>
            ),
          },
        ]}
      />

      <div className="procedimento-generico-modal-actions">
        <Button type="primary" loading={saving} onClick={() => void handleSave()}>
          Ok
        </Button>
        <Button onClick={onClose}>Cancela</Button>
      </div>
    </Modal>
  );
}
