# Fase 2C - Contrato especifico de painel lateral/listagem visual do Editor de Textos

## 1. Objetivo

Mapear o painel lateral/listagem visual do Editor de Textos e avaliar se existe um recorte real que reduza `frontend/app.js` sem tocar em carregamento remoto, selecao funcional ou fluxos sensiveis.

## 2. Decisao de origem

- Decisao de origem: `F2C-CURTA-A`

## 3. Contexto das duas extracoes reais ja validadas

- A rodada inicial do Editor de Textos ja foi consolidada com sucesso.
- Extracao 1 validada: bootstrap/shell visual.
  - implementacao: `8e16fd3`
  - validacao: `3d5b2c8`
- Extracao 2 validada: toolbar visual.
  - implementacao: `27e990d`
  - validacao: `eb70773`
- A consolidacao documental da rodada ficou registrada na decisao `F2C-EDITOR-REV-E`.

## 4. Mapa de arquivos

- `frontend/app.js`
- `frontend/js/modules/editor_textos_bootstrap.js`
- outros modulos do Editor de Textos, se existirem, apenas por leitura.
- `frontend/index.html` somente leitura.

## 5. Funcoes relacionadas ao painel lateral/listagem visual

### 5.1 Abertura/fechamento visual do painel

- `editorTextosAbrirModalAbrir()`
  - mostra o backdrop do modal de abertura;
  - foca o campo de busca.
- `editorTextosFecharModalAbrir()`
  - oculta o backdrop do modal.

### 5.2 Renderizacao de lista

- `editorTextosRenderListaAbertura()`
  - filtra e monta a lista de modelos/documentos;
  - preenche `openTbody`;
  - mostra a linha vazia quando nao ha itens.

### 5.3 Atualizacao visual da lista

- `editorTextosRenderListaAbertura()`
  - atualiza o HTML do corpo da lista;
  - preserva o destaque visual da linha selecionada quando possivel.

### 5.4 Selecao visual de item

- `editorTextosOpenSelecionarLinha(tr)`
  - marca a linha como `selected`;
  - atualiza `openSelId`.

### 5.5 Estados visuais ativo/inativo

- `editorTextosOpenMostrarContexto(clientX, clientY, itemId)`
  - habilita/desabilita `openMenuRenomear` e `openMenuExcluir`;
  - mostra/oculta o menu de contexto visual.

- `editorTextosOpenPodeAlterarItem(item)`
  - separa visualmente o que pode ser alterado do que e item de sistema.

### 5.6 Contadores, badges ou mensagens visuais

- O painel usa mensagens de estado no `status` do Editor de Textos.
- A lista vazia usa linha com texto `Nenhum modelo encontrado.`
- Nao foi identificado contador/badge dedicado nesse recorte.

### 5.7 Funcoes `editorTextos*` relacionadas ao painel, lista, modelos ou documentos

- `editorTextosAbrirModalAbrir`
- `editorTextosFecharModalAbrir`
- `editorTextosRenderListaAbertura`
- `editorTextosOpenSelecionarLinha`
- `editorTextosOpenOcultarContexto`
- `editorTextosOpenMostrarContexto`
- `editorTextosOpenContextoAbrirSelecionado`
- `editorTextosOpenContextoRenomearSelecionado`
- `editorTextosOpenContextoExcluirSelecionado`
- `editorTextosOpenContextoMostrarPropriedades`
- `editorTextosOpenItemPorId`
- `editorTextosOpenPodeAlterarItem`
- `editorTextosOpenTipoArquivoLabel`
- `editorTextosOpenCorrespondeTipo`
- `editorTextosOpenNormalizarExtensao`
- `editorTextosCarregarModelos`
- `editorTextosAbrirModelo`

## 6. Separacao entre visual, selecao, carregamento e fluxos sensiveis

### 6.1 Painel/listagem puramente visual

- abertura/fechamento do backdrop;
- montagem do HTML da lista;
- linha vazia;
- destaque visual da linha selecionada;
- menu de contexto visual.

### 6.2 Renderizacao DOM

- `editorTextosRenderListaAbertura()`;
- atribuicao de `innerHTML`;
- ajuste de classe `selected`;
- atualizacao de texto e estrutura da lista.

### 6.3 Selecao visual

- `editorTextosOpenSelecionarLinha(tr)`;
- `editorTextosOpenMostrarContexto(...)` ao mostrar estado visual do item;
- destaque visual da linha selecionada.

### 6.4 Selecao funcional

- `openSelId`;
- `openContextId`;
- abertura efetiva do modelo selecionado;
- renomear/excluir/propriedades do item.

### 6.5 Carregamento remoto

- `editorTextosCarregarModelos()`;
- possivel dependencia de `requestJson` e fluxo remoto de modelos/documentos.

### 6.6 Fluxos sensiveis

- `editorTextosAbrirModelo(...)`;
- renomear;
- excluir;
- propriedades;
- qualquer fluxo que possa tocar salvamento, backend ou persistencia.

## 7. Riscos por area

- DOM: medio.
- Estado global: medio.
- Eventos/wiring: medio-alto.
- Selecao funcional: medio-alto.
- Carregamento de modelos/documentos: alto.
- `requestJson`: alto.
- Payload: alto.
- Salvamento: alto.
- Exclusao: alto.
- PDF: alto.
- Assinatura: alto.
- Backend: critico.
- Banco: critico.
- Permissoes: alto.

## 8. Avaliacao dos micro-recortes

### PAINEL-1

- Extrair apenas renderizacao visual/listagem do painel, sem mexer em carregamento remoto ou selecao funcional.
- Risco: medio controlado.
- Ganho: bom.
- Observacao: melhor candidato inicial.

### PAINEL-2

- Extrair apenas atualizacao visual de estado ativo/inativo da lista, sem mexer em handlers sensiveis.
- Risco: medio.
- Ganho: medio.
- Observacao: boa complementaridade com PAINEL-1.

### PAINEL-3

- Extrair apenas helpers visuais de montagem DOM do painel/lista, desde que com consumo real e reducao de `app.js`.
- Risco: medio.
- Ganho: medio.
- Observacao: possivel, mas deve preservar utilidade pratica.

### PAINEL-4

- Extrair selecao visual simples, somente se nao alterar selecao funcional, carregamento, `requestJson`, payload ou salvamento.
- Risco: medio-alto.
- Ganho: medio.
- Observacao: o acoplamento sobe rapido.

### PAINEL-5

- Nao avancar em painel/listagem por acoplamento excessivo; voltar para matriz operacional da Fase 2C.
- Risco: baixo.
- Ganho: nenhum imediato.
- Observacao: valida cautela, mas nao reduz monolito.

## 9. Decisao final

- Decisao final: `F2C-PAINEL-A`
- Interpretacao: futura implementacao deve extrair apenas renderizacao visual/listagem do painel.
- Justificativa:
  - a renderizacao da lista e o bloco mais visual e mais claramente separavel neste momento;
  - a selecao funcional pode permanecer no `app.js` na primeira passada;
  - a reducao real de `frontend/app.js` fica plausivel sem encostar em carregamento remoto ou fluxos sensiveis;
  - o recorte e mais seguro do que mexer em selecao funcional, rename/excluir ou carregamento remoto.

## 10. Proximo documento recomendado

- Documento de implementacao da renderizacao visual/listagem do painel lateral do Editor de Textos.

## 11. Arquivos provaveis para futura implementacao

- `frontend/app.js`
- `frontend/js/modules/editor_textos_bootstrap.js`
- possivelmente um novo modulo `frontend/js/modules/editor_textos_painel.js`, somente se houver justificativa tecnica forte.

## 12. Arquivos proibidos

- `frontend/index.html`
- backend
- banco
- schema
- migrations
- seeds
- endpoints
- `.env`
- scripts de migracao
- dumps/backups fora da pasta controlada da etapa

## 13. Backup futuro necessario

- `frontend/app.js`
- o modulo do Editor de Textos que for alterado ou criado
- outros arquivos apenas se estritamente necessarios e justificados pelo contrato

## 14. Onde o usuario devera testar futuramente

1. Abrir o sistema normalmente.
2. Entrar no Editor de Textos.
3. Abrir o painel/listagem visual.
4. Confirmar que a lista de modelos/documentos continua aparecendo.
5. Confirmar que a busca/filtro visual nao quebrou.
6. Recarregar a tela e abrir o Editor de Textos novamente.
7. Observar se a renderizacao visual continua igual e sem regressao.
8. Nao focar em carregamento remoto, salvamento, PDF, assinatura ou exclusao como objetivo principal desta etapa futura.

## 15. Commit seletivo obrigatorio

Arquivos alvo do commit seletivo desta etapa:

- `docs/fase_2c_editor_textos_contrato_painel_lateral_listagem_visual.md`
- `docs/11_roadmap_desenvolvimento.md`

## 16. Registro para roadmap

Registrar no roadmap:

- abertura do contrato especifico de painel lateral/listagem visual do Editor de Textos;
- origem na decisao `F2C-CURTA-A`;
- decisao final `F2C-PAINEL-A`;
- confirmacao de que nenhum codigo ou banco foi alterado nesta etapa documental;
- proximo passo recomendado.
