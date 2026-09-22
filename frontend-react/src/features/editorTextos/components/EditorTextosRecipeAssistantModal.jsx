import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Button, Empty, Input, Modal, Radio, Select, Spin, Table } from 'antd';
import { editorTextosApi } from '../api/editorTextosApi.js';
import { getPatientDisplayName } from '../models/recipeAssistantFlow.js';
import { filterRecipeMedications, getRecipeMedicationAlphabetOptions, getRecipeMedicationName, reconcileRecipeMedicationSelection } from '../models/recipeMedicationMenu.js';
import { PacientesAlphabet } from '../../pacientes/components/PacientesAlphabet.jsx';
import { buildRecipeAssistantBody, createRecipeAssistantItem } from '../models/recipeAssistantDraft.js';
import './EditorTextosRecipeAssistantModal.css';

const { TextArea } = Input;
const idOf = (item) => Number(item?.id || 0);
const medicationLabel = (item) => `${String(item?.codigo || '').trim() ? `${String(item.codigo).trim()} - ` : ''}${String(item?.nome || item?.grupo || '').trim()}`;

export function EditorTextosRecipeAssistantModal({ open, patient, onSelectPatient, onPreview, onCancel, onFinalize }) {
  const [context, setContext] = useState(null);
  const [menuMedications, setMenuMedications] = useState([]);
  const [menuSelectedMedicationId, setMenuSelectedMedicationId] = useState(null);
  const [surgeonId, setSurgeonId] = useState(null);
  const [recipeModelId, setRecipeModelId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ageGroup, setAgeGroup] = useState('adulto');
  const [medicationId, setMedicationId] = useState(null);
  const [medicationListOpen, setMedicationListOpen] = useState(false);
  const [medicationSearch, setMedicationSearch] = useState('');
  const [medicationGroup, setMedicationGroup] = useState('*');
  const [medicationLetter, setMedicationLetter] = useState('*');
  const [medicationMenuLoading, setMedicationMenuLoading] = useState(false);
  const [medicationMenuError, setMedicationMenuError] = useState('');
  const [prescription, setPrescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [usageId, setUsageId] = useState(null);
  const [observations, setObservations] = useState('');
  const [recipeItems, setRecipeItems] = useState([]);
  const [finalizing, setFinalizing] = useState(false);
  const [including, setIncluding] = useState(false);
  const [emptyMedicationVisible, setEmptyMedicationVisible] = useState(false);
  const [actionError, setActionError] = useState('');
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragStateRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const move = (event) => {
      const start = dragStateRef.current;
      if (!start || (start.pointerId != null && event.pointerId !== start.pointerId)) return;
      setDragOffset({ x: start.offsetX + event.clientX - start.clientX, y: start.offsetY + event.clientY - start.clientY });
    };
    const stop = (event) => {
      if (dragStateRef.current && (dragStateRef.current.pointerId == null || event.pointerId === dragStateRef.current.pointerId)) dragStateRef.current = null;
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', stop);
    document.addEventListener('pointercancel', stop);
    return () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', stop);
      document.removeEventListener('pointercancel', stop);
      dragStateRef.current = null;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setRecipeItems([]);
    setActionError('');
    setAgeGroup('adulto');
    setMedicationId(null);
    setPrescription('');
    setQuantity('');
    setUsageId(null);
    setObservations('');
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    let active = true;
    setLoading(true);
    setError('');
    editorTextosApi.getRecipeAssistantContext({ patientId: patient?.id ?? patient?.patientId ?? patient?.nro_pac ?? null })
      .then((data) => { if (active) setContext(data); })
      .catch((cause) => { if (active) setError(cause?.message || 'Não foi possível carregar os dados do assistente de receitas.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [open, patient?.id, patient?.patientId, patient?.nro_pac]);

  const medications = Array.isArray(context?.medicamentos) ? context.medicamentos : [];
  const selectedMedication = [...menuMedications, ...medications].find((item) => idOf(item) === Number(medicationId)) || null;
  const visibleMedications = useMemo(() => filterRecipeMedications(menuMedications, {
    group: medicationGroup,
    query: medicationSearch,
    letter: medicationLetter,
  }), [menuMedications, medicationGroup, medicationSearch, medicationLetter]);

  const medicationGroups = useMemo(() => [...new Set(menuMedications.map((item) => String(item?.grupo || '').trim()).filter(Boolean))], [menuMedications]);

  useEffect(() => {
    setMenuSelectedMedicationId((current) => reconcileRecipeMedicationSelection(visibleMedications, current));
  }, [visibleMedications]);

  useEffect(() => {
    if (!context) return;
    setSurgeonId((current) => current ?? (context.cirurgiao_padrao_id ? Number(context.cirurgiao_padrao_id) : null));
    setRecipeModelId((current) => current ?? (context.modelo_padrao_id ? Number(context.modelo_padrao_id) : null));
  }, [context]);

  const openMedicationMenu = async () => {
    setMedicationListOpen(true);
    setMedicationSearch('');
    setMedicationGroup('*');
    setMedicationLetter('*');
    setMedicationMenuError('');
    setMenuMedications([]);
    setMedicationMenuLoading(true);
    setMenuSelectedMedicationId(medicationId);
    try {
      const result = await editorTextosApi.getRecipeAssistantMedications({ limit: 1000 });
      const items = Array.isArray(result?.itens) ? result.itens.filter((item) => getRecipeMedicationName(item)) : [];
      setMenuMedications(items);
      setMenuSelectedMedicationId(reconcileRecipeMedicationSelection(items, medicationId));
    } catch (cause) {
      setMenuMedications([]);
      setMenuSelectedMedicationId(null);
      setMedicationMenuError(cause?.message || 'Não foi possível carregar o menu de medicamentos.');
    } finally {
      setMedicationMenuLoading(false);
    }
  };

  const selectMedication = (id) => {
    const item = [...menuMedications, ...medications].find((entry) => idOf(entry) === Number(id));
    setMedicationId(item ? idOf(item) : null);
    if (!item) {
      setPrescription('');
      setQuantity('');
      return;
    }
    setPrescription(String(ageGroup === 'crianca' ? item.prescricao_crianca || '' : item.prescricao_adulto || ''));
    const suggestedQuantity = String(ageGroup === 'crianca' ? item.quantidade_crianca || '' : item.quantidade_adulto || '');
    if (!quantity.trim() || suggestedQuantity) setQuantity(suggestedQuantity);
    const suggestedUsage = String(item.uso_padrao || '').trim().toLocaleLowerCase('pt-BR');
    const matchingUsage = (context?.tipos_uso || []).find((usage) => String(usage.descricao || '').trim().toLocaleLowerCase('pt-BR') === suggestedUsage);
    if (matchingUsage) setUsageId(idOf(matchingUsage));
  };

  const changeAgeGroup = (value) => {
    setAgeGroup(value);
    if (selectedMedication) {
      setPrescription(String(value === 'crianca' ? selectedMedication.prescricao_crianca || '' : selectedMedication.prescricao_adulto || ''));
      const suggested = String(value === 'crianca' ? selectedMedication.quantidade_crianca || '' : selectedMedication.quantidade_adulto || '');
      if (suggested) setQuantity(suggested);
    }
  };

  const changePatient = async () => {
    const selected = await onSelectPatient?.();
    if (!selected) return;
    setError('');
  };

  const confirmMedication = (id = menuSelectedMedicationId) => {
    const item = menuMedications.find((entry) => idOf(entry) === Number(id));
    if (!item) return;
    selectMedication(idOf(item));
    setMedicationListOpen(false);
  };

  const includeMedication = async () => {
    if (!selectedMedication) {
      setEmptyMedicationVisible(true);
      return;
    }
    if (including || finalizing) return;
    if (typeof onPreview !== 'function') {
      setActionError('A prévia da receita não está disponível.');
      return;
    }
    const usage = (context?.tipos_uso || []).find((item) => idOf(item) === Number(usageId));
    const item = createRecipeAssistantItem({
      medication: selectedMedication,
      ageGroup,
      prescription,
      quantity,
      usageId,
      usageLabel: usage?.descricao || usage?.codigo || '',
      observations,
    });
    if (!item) return;
    const nextItems = [...recipeItems, item];
    setIncluding(true);
    setActionError('');
    try {
      const updated = await onPreview?.({
        items: nextItems.map((entry) => ({ ...entry })),
        body: buildRecipeAssistantBody(nextItems),
        patient,
        surgeonId,
        modelId: recipeModelId,
      });
      if (updated === false) throw new Error('Não foi possível atualizar a prévia da receita.');
      setRecipeItems(nextItems);
      // Match the legacy reset: retain medication and usage; clear item details.
      setPrescription('');
      setQuantity('');
      setObservations('');
    } catch (cause) {
      setActionError(cause?.message || 'Não foi possível atualizar a prévia da receita.');
    } finally {
      setIncluding(false);
    }
  };

  const finalizeRecipe = async () => {
    if (!recipeItems.length || !patient || finalizing) return;
    setFinalizing(true);
    setActionError('');
    try {
      const completed = await onFinalize?.({
        items: recipeItems.map((item) => ({ ...item })),
        body: buildRecipeAssistantBody(recipeItems),
        patient,
        surgeonId,
        modelId: recipeModelId,
      });
      if (!completed) setActionError('Não foi possível finalizar a receita. O documento atual foi preservado.');
    } catch (cause) {
      setActionError(cause?.message || 'Não foi possível finalizar a receita. O documento atual foi preservado.');
    } finally {
      setFinalizing(false);
    }
  };

  const medicationColumns = [
    { key: 'nome', title: 'Nome', dataIndex: 'nome', ellipsis: true, render: (value) => <span title={String(value || '')}>{value || '—'}</span> },
    { key: 'apresentacao', title: 'Apresentação', dataIndex: 'apresentacao', ellipsis: true, render: (value) => <span title={String(value || '')}>{value || '—'}</span> },
  ];

  const beginModalDrag = (event) => {
    if (event.button !== 0 || event.target.closest('button,a,input,select,textarea,[role="button"]')) return;
    dragStateRef.current = { clientX: event.clientX, clientY: event.clientY, offsetX: dragOffset.x, offsetY: dragOffset.y, pointerId: event.pointerId };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  };

  return <>
    <Modal
      open={open}
      title={<div className="editor-textos-recipe-assistant__drag-handle" onPointerDown={beginModalDrag} onDoubleClick={() => setDragOffset({ x: 0, y: 0 })}>Assistente de receitas</div>}
      modalRender={(modal) => <div style={{ transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }}>{modal}</div>}
      width={520}
      footer={null}
      destroyOnClose={false}
      onCancel={() => { if (!including && !finalizing) onCancel?.(); }}
      className="editor-textos-recipe-assistant"
      rootClassName="editor-textos-recipe-assistant-root"
    >
      {loading ? <div className="editor-textos-recipe-assistant__loading"><Spin /> <span>Carregando dados do assistente...</span></div> : null}
      {error ? <div className="editor-textos-recipe-assistant__error" role="alert">{error}</div> : null}
      <div className="editor-textos-recipe-assistant__grid" aria-busy={loading}>
        <label>Cirurgião<Select aria-label="Cirurgião" disabled={loading} placeholder="Selecione" value={surgeonId} onChange={setSurgeonId} options={(context?.cirurgioes || []).map((item) => ({ value: idOf(item), label: item.nome || item.nome_completo }))} /></label>
        <label>Modelo de receituário<Select aria-label="Modelo de receituário" disabled={loading} placeholder="Selecione" value={recipeModelId} onChange={setRecipeModelId} options={(context?.modelos_receituario || []).map((item) => ({ value: idOf(item), label: item.nome }))} /></label>
        <label className="editor-textos-recipe-assistant__wide">Paciente<div className="editor-textos-recipe-assistant__inline"><Input aria-label="Paciente" readOnly value={getPatientDisplayName(patient) || context?.paciente?.nome || ''} /><Button onClick={changePatient}>Selecionar paciente</Button></div></label>
        <label className="editor-textos-recipe-assistant__wide">Medicamento<div className="editor-textos-recipe-assistant__inline"><Select aria-label="Medicamento" showSearch optionFilterProp="label" value={medicationId} disabled={loading} placeholder="Selecione" options={[...new Map([...medications, ...menuMedications].map((item) => [idOf(item), item])).values()].map((item) => ({ value: idOf(item), label: medicationLabel(item) }))} onChange={selectMedication} /><Button onClick={() => void openMedicationMenu()} disabled={loading}>Menu</Button></div></label>
        <section className="editor-textos-recipe-assistant__wide"><label>Prescrição</label><Radio.Group aria-label="Faixa de prescrição" value={ageGroup} onChange={(event) => changeAgeGroup(event.target.value)}><Radio value="adulto">Adulto</Radio><Radio value="crianca">Criança</Radio></Radio.Group><TextArea aria-label="Prescrição" rows={2} value={prescription} onChange={(event) => setPrescription(event.target.value)} /></section>
        <label>Quantidade<Input aria-label="Quantidade" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></label>
        <label>Uso<Select aria-label="Uso" allowClear value={usageId} placeholder="Selecione" options={(context?.tipos_uso || []).map((item) => ({ value: idOf(item), label: item.descricao || item.codigo }))} onChange={setUsageId} /></label>
        <label className="editor-textos-recipe-assistant__wide">Observações<TextArea aria-label="Observações" rows={1} value={observations} onChange={(event) => setObservations(event.target.value)} /></label>
        {actionError && <div className="editor-textos-recipe-assistant__error" role="alert">{actionError}</div>}
      </div>
      <div className="editor-textos-recipe-assistant__actions">
        <Button disabled={loading || including || finalizing} loading={including} onClick={() => void includeMedication()}>Incluir</Button>
        <Button type="primary" disabled={!recipeItems.length || !patient || loading || including || finalizing} loading={finalizing} onClick={() => void finalizeRecipe()}>Finalizar</Button>
        <Button disabled>Assinar PDF</Button><Button disabled={finalizing || including} onClick={onCancel}>Cancelar</Button>
      </div>
    </Modal>
    <Modal
      open={emptyMedicationVisible}
      title="Atenção"
      width={360}
      centered
      onCancel={() => setEmptyMedicationVisible(false)}
      footer={<Button type="primary" onClick={() => setEmptyMedicationVisible(false)}>Ok</Button>}
    >Campo medicamento não pode ser nulo.</Modal>
    <Modal
      open={medicationListOpen}
      title="Menu de medicamentos"
      width={720}
      centered
      destroyOnClose
      className="editor-textos-medication-menu"
      onCancel={() => setMedicationListOpen(false)}
      footer={<><Button onClick={() => setMedicationListOpen(false)}>Cancelar</Button><Button type="primary" disabled={!menuSelectedMedicationId || medicationMenuLoading || Boolean(medicationMenuError)} onClick={() => confirmMedication()}>Ok</Button></>}
    >
      <div className="editor-textos-medication-menu__filters">
        <label>Filtro<Select aria-label="Filtro de grupo de medicamentos" value={medicationGroup} disabled={medicationMenuLoading || Boolean(medicationMenuError)} options={[{ value: '*', label: 'Todos' }, ...medicationGroups.map((group) => ({ value: group, label: group }))]} onChange={setMedicationGroup} /></label>
        <label>Pesquisar nome<Input aria-label="Pesquisar nome" placeholder="Pesquisar nome" value={medicationSearch} disabled={medicationMenuLoading || Boolean(medicationMenuError)} onChange={(event) => setMedicationSearch(event.target.value)} allowClear /></label>
      </div>
      <PacientesAlphabet
        options={getRecipeMedicationAlphabetOptions()}
        activeValue={medicationLetter === '*' ? 0 : medicationLetter.charCodeAt(0)}
        ariaLabel="Régua alfabética de medicamentos"
        entityLabel="medicamentos"
        onChange={(value) => setMedicationLetter(Number(value) === 0 ? '*' : String.fromCharCode(Number(value)))}
      />
      {medicationMenuError ? <Alert className="editor-textos-medication-menu__error" type="error" showIcon message={medicationMenuError} action={<Button size="small" onClick={() => void openMedicationMenu()}>Tentar novamente</Button>} /> : null}
      <Table
        aria-label="Medicamentos disponíveis"
        className="editor-textos-medication-menu__table"
        rowKey={(item) => idOf(item)}
        size="small"
        tableLayout="fixed"
        pagination={false}
        scroll={{ y: 420 }}
        loading={medicationMenuLoading}
        dataSource={medicationMenuError ? [] : visibleMedications}
        columns={medicationColumns}
        rowClassName={(item) => Number(item.id) === Number(menuSelectedMedicationId) ? 'is-selected' : ''}
        onRow={(item) => ({
          role: 'row',
          tabIndex: 0,
          'aria-selected': Number(item.id) === Number(menuSelectedMedicationId),
          onClick: () => setMenuSelectedMedicationId(idOf(item)),
          onDoubleClick: () => confirmMedication(idOf(item)),
          onKeyDown: (event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              confirmMedication(idOf(item));
            } else if (event.key === ' ') {
              event.preventDefault();
              setMenuSelectedMedicationId(idOf(item));
            }
          },
        })}
        locale={{ emptyText: medicationMenuLoading ? <Spin size="small" /> : <Empty description="Nenhum medicamento encontrado." /> }}
      />
      <div className="editor-textos-medication-menu__summary" role="status">
        {visibleMedications.length} {visibleMedications.length === 1 ? 'medicamento' : 'medicamentos'}
        {context?.medicamentos_fonte ? ` · ${context.medicamentos_fonte === 'medicamento' ? 'cadastro de medicamentos' : 'itens auxiliares'}` : ''}
      </div>
    </Modal>
  </>;
}
