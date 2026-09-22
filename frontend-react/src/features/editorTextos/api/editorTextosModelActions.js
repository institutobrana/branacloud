import { editorTextosApi } from './editorTextosApi.js';

function selectedModelId(item) {
  const id = Number(item?.id);
  if (!Number.isInteger(id) || id <= 0 || item?.sistema) throw new Error('Selecione um modelo de clínica válido.');
  return id;
}

export async function renameEditorTextModel(item, name, api = editorTextosApi) {
  const id = selectedModelId(item);
  const nextName = String(name || '').trim();
  if (!nextName) throw new Error('Informe um nome válido.');
  const result = await api.renameDocument(id, nextName);
  if (Number(result?.id ?? result?.modelo_id) !== id) throw new Error('A resposta do servidor não corresponde ao modelo selecionado.');
  const response = await api.listDocuments();
  return { id, items: Array.isArray(response?.itens) ? response.itens : [] };
}

export async function deleteEditorTextModel(item, api = editorTextosApi) {
  const id = selectedModelId(item);
  if (!(item?.nome_exibicao || item?.nome || item?.nome_arquivo)) throw new Error('O modelo selecionado não tem um nome válido.');
  const result = await api.deleteDocument(id);
  if (result?.ok !== true || Number(result?.id) !== id) throw new Error('A confirmação do servidor não corresponde ao modelo selecionado.');
  return id;
}
