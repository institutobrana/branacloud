# Plano de implementacao - Medicamentos no novo frontend React

## 1. Objetivo
Organizar a implementacao modular da frente `Tabelas -> Medicamentos` no novo frontend React, sem componente monolitico e sem alterar backend, banco ou permissões nesta etapa.

## 2. Padrões observados no repositório
A frente deve seguir o padrao dos modulos React ja consolidados:
- pagina pequena e orquestradora
- toolbar separada
- tabela separada
- modal separado
- hooks para estado e CRUD
- mapeadores/adapters quando necessario
- CSS de feature, nao um bloco global gigante

## 3. Estrutura proposta

```text
frontend-react/src/features/medicamentos/
  api/
    medicamentosApi.js
    medicamentosAdapters.js
  components/
    MedicamentosToolbar.jsx
    MedicamentosTable.jsx
    MedicamentoModal.jsx
    MedicamentoForm.jsx
  hooks/
    useMedicamentos.js
    useMedicamentoForm.js
    useMedicamentoCrud.js
  pages/
    MedicamentosPage.jsx
  schemas/
    medicamentoSchema.js
  constants/
    medicamentosConstants.js
  utils/
    medicamentosFormatters.js
```

## 4. Responsabilidade por arquivo

### `api/medicamentosApi.js`
- Entradas: filtros, id, payload.
- Saidas: respostas normalizadas do backend.
- Dependencias: `requestJson` e endpoints de Medicamentos.
- Nao deve conter UI, validacao visual ou estado local de tela.

### `api/medicamentosAdapters.js`
- Entradas: payloads brutos do backend.
- Saidas: objetos prontos para UI.
- Dependencias: formato do backend atual.
- Nao deve conter componentes nem chamadas HTTP.

### `components/MedicamentosToolbar.jsx`
- Entradas: acoes, filtros, loading, estado de selecao.
- Saidas: eventos para a pagina.
- Nao deve conter fetch nem regra de negocio de CRUD.

### `components/MedicamentosTable.jsx`
- Entradas: itens, selecao, loading, contador, ordenacao.
- Saidas: clique e duplo clique.
- Nao deve conter modal nem salvamento.

### `components/MedicamentoModal.jsx`
- Entradas: modo, visibilidade, handlers, estado do formulario.
- Saidas: submit, cancelamento, exclusao.
- Nao deve conter carregamento remoto de lista inteira.

### `components/MedicamentoForm.jsx`
- Entradas: valores, erros, options, handlers de campo.
- Saidas: mudanca de formulario.
- Nao deve conter acoes de toolbar ou lista.

### `hooks/useMedicamentos.js`
- Responsabilidade: listagem, filtros, selecao e loading.
- Nao deve misturar form, modal e CRUD completo.

### `hooks/useMedicamentoForm.js`
- Responsabilidade: estado do formulario, validacao local e sincronizacao de campos.
- Nao deve chamar `GET /medicamentos` para lista.

### `hooks/useMedicamentoCrud.js`
- Responsabilidade: create, update e delete.
- Nao deve renderizar UI.

### `pages/MedicamentosPage.jsx`
- Responsabilidade: compor toolbar, tabela e modal.
- Nao deve concentrar regra de API, validacao, payload e mensagens em volume grande.

### `schemas/medicamentoSchema.js`
- Responsabilidade: validacao estrutural do formulario.
- Nao deve depender de DOM.

### `constants/medicamentosConstants.js`
- Responsabilidade: labels, tamanhos, modo e metadados estaticos realmente reutilizaveis.
- Nao deve virar deposito de logica.

### `utils/medicamentosFormatters.js`
- Responsabilidade: formatacao de texto, labels e eventuais normalizadores puros.
- Nao deve chamar API nem acessar estado de componente.

## 5. Fluxo de dados
- A pagina carrega a listagem.
- A toolbar altera filtros e dispara acoes.
- A tabela exibe itens e selecao.
- O modal recebe valores para novo/alteracao.
- O hook de CRUD conversa com a API.
- O schema valida antes do submit.
- O adapter normaliza a resposta para a UI.

## 6. Estado local e remoto
- Estado remoto: lista de medicamentos, detalhe, combos.
- Estado local: selecao, filtro de grupo, busca, visibilidade do modal, modo do modal e erros locais.
- O estado remoto nao deve ser espelhado em varias fontes sem necessidade.

## 7. Regras tecnicas fechadas
- A busca deve ser remota.
- O filtro de grupo deve usar o endpoint de grupos.
- O modal deve carregar combos por endpoint real.
- O backend atual deve continuar fonte da verdade.
- O carregamento deve preservar a selecao sempre que possivel.
- O submit deve recarregar a lista apos sucesso.
- O erro de conflito por nome deve ser tratado como falha esperada do backend.

## 8. Nao fazer
- Nao criar uma pagina monolitica.
- Nao colocar toolbar, tabela, modal, validação e fetch no mesmo arquivo.
- Nao criar payload manual espalhado pela UI.
- Nao duplicar regra de permissao no frontend como se fosse seguranca real.

## 9. Etapas futuras de implementacao

### Etapa 1 - Fundacao
- Rota, menu e shell.
- Página vazia ou estrutural.
- Toolbar sem CRUD.

Arquivos previstos:
- `frontend-react/src/app/App.jsx`
- `frontend-react/src/app/routes.jsx`
- `frontend-react/src/features/medicamentos/pages/MedicamentosPage.jsx`

Proibido:
- persistencia
- exclusao
- alteracao de backend

Aceite:
- rota renderiza
- shell em "L" aparece

### Etapa 2 - Listagem
- API de listagem.
- Tabela.
- Filtros.
- Pesquisa.
- Seleção.
- Contador.

Arquivos previstos:
- `api/medicamentosApi.js`
- `api/medicamentosAdapters.js`
- `hooks/useMedicamentos.js`
- `components/MedicamentosToolbar.jsx`
- `components/MedicamentosTable.jsx`

Proibido:
- modal de edição completo
- POST/PUT/DELETE

Aceite:
- lista carrega
- filtro e busca funcionam
- seleção e contador funcionam

### Etapa 3 - Modal estrutural
- Modal.
- Abas.
- Campos.
- Combos.
- Tema.

Arquivos previstos:
- `components/MedicamentoModal.jsx`
- `components/MedicamentoForm.jsx`
- `hooks/useMedicamentoForm.js`
- `schemas/medicamentoSchema.js`

Proibido:
- salvar de verdade, se o contrato ainda exigir pausa

Aceite:
- modal abre e fecha
- valores são exibidos corretamente

### Etapa 4 - Inclusão
- Validação.
- Payload.
- POST.
- Recarga.
- Seleção do novo item.

Arquivos previstos:
- `hooks/useMedicamentoCrud.js`
- `api/medicamentosApi.js`
- `components/MedicamentoModal.jsx`

Aceite:
- inclusão grava
- lista atualiza

### Etapa 5 - Alteração
- Carregamento por id.
- Hidratação do formulário.
- PUT.

Aceite:
- altera e preserva contexto

### Etapa 6 - Exclusão
- Confirmação.
- DELETE.
- Dependências reais.

Aceite:
- bloqueios são compreensíveis
- lista atualiza

### Etapa 7 - Refinamento
- Duplo clique.
- Teclado.
- Acessibilidade.
- Responsividade.
- Tema.
- Mensagens.

Aceite:
- navegação confortável
- não quebra em tela menor

### Etapa 8 - Testes e fechamento
- Testes unitários.
- Testes de integração.
- Validação em navegador.
- Documentação.
- Commit seletivo e push somente com autorização.

## 10. Critérios de parada
- Se uma etapa tocar em backend ou banco sem necessidade, parar.
- Se o modal ficar monolítico, parar e recortar.
- Se a implementação começar a duplicar regra do legado sem ganho real, parar e revisar o contrato.

## 11. Conclusão
O plano segue o padrão modular já adotado no repositório e mantém Medicamentos pequeno por partes, com UI, dados e validação separados.
