import { useEffect, useMemo, useState } from 'react';
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Tabs } from 'antd';

import { listarAuxiliaresPorTipo, obterProximoCodigoMaterial } from './materiaisEstoqueApi.js';

function parseNumber(value) {
  if (value === null || value === undefined || value === '') return 0;
  const normalized = String(value).replace(',', '.').trim();
  const next = Number(normalized);
  return Number.isFinite(next) ? next : 0;
}

export function MateriaisMaterialModal({ open, mode, listaId, item, onClose, onSaved, onLoadError }) {
  const [form] = Form.useForm();
  const [tab, setTab] = useState('principal');
  const [loadingCodigo, setLoadingCodigo] = useState(false);
  const [classificacoes, setClassificacoes] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [fabricantes, setFabricantes] = useState([]);
  const [apresentacoes, setApresentacoes] = useState([]);

  const isEdit = mode === 'edit';
  const title = useMemo(() => (isEdit ? 'Alterar material' : 'Novo material'), [isEdit]);

  useEffect(() => {
    if (!open) {
      form.resetFields();
      setTab('principal');
      return;
    }

    const load = async () => {
      try {
        const [classes, units, nextFabricantes, nextApresentacoes] = await Promise.all([
          listarAuxiliaresPorTipo('Tipos de material'),
          listarAuxiliaresPorTipo('Unidades de medida'),
          listarAuxiliaresPorTipo('Fabricantes'),
          listarAuxiliaresPorTipo('Apresentações'),
        ]);
        setClassificacoes(classes);
        setUnidades(units);
        setFabricantes(nextFabricantes);
        setApresentacoes(nextApresentacoes);
      } catch (error) {
        onLoadError?.(error);
      }
    };

    void load();
  }, [form, onLoadError, open]);

  useEffect(() => {
    if (!open) return;

    const next = item || null;
    form.setFieldsValue({
      classificacao: next?.classificacao || '',
      codigo: next?.codigo || '',
      nome: next?.nome || '',
      unidade_compra: next?.unidade_compra || '',
      unidade_consumo: next?.unidade_consumo || '',
      relacao: next?.relacao ?? 0,
      preco: next?.preco ?? 0,
      custo: next?.custo ?? 0,
      validade_dias: next?.validade_dias ?? 0,
      preferido: Boolean(next?.preferido),
      fabricante: next?.fabricante || '',
      apresentacao: next?.apresentacao || '',
      observacoes: next?.observacoes || '',
    });

    if (!next && listaId) {
      setLoadingCodigo(true);
      void obterProximoCodigoMaterial(listaId)
        .then((codigo) => form.setFieldsValue({ codigo }))
        .catch((error) => onLoadError?.(error))
        .finally(() => setLoadingCodigo(false));
    }
  }, [form, item, listaId, onLoadError, open]);

  const handleValuesChange = (_, values) => {
    const preco = parseNumber(values.preco);
    const relacao = parseNumber(values.relacao);
    const custo = relacao > 0 ? preco / relacao : 0;
    if (Number.isFinite(custo)) {
      form.setFieldValue('custo', custo);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSaved?.({
        codigo: String(values.codigo || '').trim(),
        nome: String(values.nome || '').trim(),
        preco: parseNumber(values.preco),
        relacao: parseNumber(values.relacao),
        custo: parseNumber(values.custo),
        unidade_compra: String(values.unidade_compra || '').trim(),
        unidade_consumo: String(values.unidade_consumo || '').trim(),
        validade_dias: Math.max(0, Number.parseInt(String(values.validade_dias || 0), 10) || 0),
        preferido: Boolean(values.preferido),
        classificacao: String(values.classificacao || '').trim(),
        lista_id: Number(listaId || 0),
      });
    } catch {
      // handled by antd
    }
  };

  return (
    <Modal
      open={open}
      title={title}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={460}
      centered
      className="materiais-modal"
    >
      <Form form={form} layout="vertical" autoComplete="off" onValuesChange={handleValuesChange}>
        <Tabs
          activeKey={tab}
          onChange={setTab}
          className="materiais-modal-tabs"
          items={[
            {
              key: 'principal',
              label: 'Principal',
              children: (
                <div className="materiais-modal-principal-grid">
                  <div className="materiais-modal-row principal-top">
                    <Form.Item className="materiais-modal-field-classificacao" name="classificacao" label="Classificação">
                      <Select allowClear showSearch optionFilterProp="label" options={classificacoes.map((item) => ({ value: item, label: item }))} />
                    </Form.Item>
                    <Form.Item className="materiais-modal-field-codigo" name="codigo" label="Código interno" rules={[{ required: true, message: 'Informe o código.' }]}>
                      <Input disabled={loadingCodigo && !isEdit} maxLength={32} />
                    </Form.Item>
                  </div>

                  <Form.Item name="nome" label="Nome do material" rules={[{ required: true, message: 'Informe o nome.' }]}>
                    <Input maxLength={180} />
                  </Form.Item>

                  <div className="materiais-modal-rows">
                    <div className="materiais-modal-line">
                      <span className="materiais-modal-line-label">Unidade de compra</span>
                      <Form.Item className="materiais-modal-line-field" name="unidade_compra" noStyle>
                        <Select allowClear showSearch optionFilterProp="label" options={unidades.map((item) => ({ value: item, label: item }))} />
                      </Form.Item>
                    </div>
                    <div className="materiais-modal-line">
                      <span className="materiais-modal-line-label">Unidade de consumo</span>
                      <Form.Item className="materiais-modal-line-field" name="unidade_consumo" noStyle>
                        <Select allowClear showSearch optionFilterProp="label" options={unidades.map((item) => ({ value: item, label: item }))} />
                      </Form.Item>
                    </div>
                    <div className="materiais-modal-line">
                      <span className="materiais-modal-line-label">Relação</span>
                      <Form.Item className="materiais-modal-line-field" name="relacao" noStyle rules={[{ required: true, message: 'Informe a relação.' }]}>
                        <InputNumber style={{ width: '100%' }} min={0} step={0.01} stringMode />
                      </Form.Item>
                    </div>
                    <div className="materiais-modal-line">
                      <span className="materiais-modal-line-label">Preço</span>
                      <Form.Item className="materiais-modal-line-field" name="preco" noStyle rules={[{ required: true, message: 'Informe o preço.' }]}>
                        <InputNumber style={{ width: '100%' }} min={0} step={0.01} stringMode />
                      </Form.Item>
                    </div>
                    <div className="materiais-modal-line">
                      <span className="materiais-modal-line-label">Valor de custo unitário</span>
                      <Form.Item className="materiais-modal-line-field" name="custo" noStyle>
                        <InputNumber style={{ width: '100%' }} min={0} step={0.01} stringMode readOnly />
                      </Form.Item>
                    </div>
                    <div className="materiais-modal-line">
                      <span className="materiais-modal-line-label">Validade média</span>
                      <Form.Item className="materiais-modal-line-field validade" name="validade_dias" noStyle>
                        <InputNumber style={{ width: '100%' }} min={0} step={1} />
                      </Form.Item>
                    </div>
                  </div>

                  <Form.Item name="preferido" valuePropName="checked" className="materiais-modal-preferido">
                    <Checkbox>Incluir na lista de preferidos</Checkbox>
                  </Form.Item>
                </div>
              ),
            },
            {
              key: 'detalhes',
              label: 'Detalhes',
              children: (
                <div className="materiais-modal-stack compact">
                  <Form.Item name="fabricante" label="Fabricante">
                    <Select allowClear showSearch optionFilterProp="label" options={fabricantes.map((item) => ({ value: item, label: item }))} />
                  </Form.Item>
                  <Form.Item name="apresentacao" label="Apresentação">
                    <Input maxLength={120} />
                  </Form.Item>
                  <Form.Item name="observacoes" label="Observações">
                    <Input.TextArea autoSize={{ minRows: 4, maxRows: 6 }} maxLength={1000} />
                  </Form.Item>
                </div>
              ),
            },
          ]}
        />

        <Space className="materiais-modal-footer" style={{ justifyContent: 'flex-end', width: '100%' }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="primary" onClick={handleOk}>
            Ok
          </Button>
        </Space>
      </Form>
    </Modal>
  );
}
