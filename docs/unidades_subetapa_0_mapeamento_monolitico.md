# Unidades - Subetapa 0 de Mapeamento Monolitico

## Estado atual
- Branch atual: `modularizacao-segura-fase-1`
- Working tree antes da analise: limpo
- Ultimos commits relevantes:
  - `36d9539` - Compara modulos para primeira modularizacao segura
  - `fd5129d` - Mapeia Medicamentos para modularizacao segura
  - `e5a04fc` - Mapeia CID para modularizacao segura
  - `46f49b9` - Cria plano de retomada da modularizacao segura
  - `f3cab35` - Corrige duplo clique em convenios e planos no monolitico
  - `1dc8b18` - Restaura frontend monolitico e corrige contratos globais pos-reversao

## Arquivos analisados
- `frontend/app.js`
- `frontend/index.html`

## Documentos consultados
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/cid_subetapa_0_mapeamento_monolitico.md`
- `docs/medicamentos_subetapa_0_mapeamento_monolitico.md`
- `docs/varredura_comparativa_primeiro_modulo_modularizacao.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`

## Resumo da varredura comparativa que escolheu Unidades
- `CID` e `Medicamentos` nao forneceram helper puro seguro para extração inicial.
- Entre `Unidades`, `Plano de contas`, `Indices financeiros`, `Cenarios financeiros`, `Tabelas auxiliares` e `Convênios e Planos`, `Unidades` foi o modulo com menor risco relativo.
- A escolha foi conservadora: menos subfluxos que os demais candidatos, sem calendario, sem dupla grade dependente e sem ramificacoes complexas como `Convênios e Planos` e `Indices financeiros`.

## Mapa de funções Unidades no app.js

### Função de abertura
- `unidadeAbrir()`
- Chama `unidadeEnsureUI()`, aplica ajustes visuais V2, oculta o shell atual e carrega a lista.

### Funções de listagem e renderização
- `unidadeCarregar()`
- `unidadeRender()`
- `unidadeSelecionada()`
- `unidadeSelecionarLinha(tr)`
- `unidadeFmtCodigo(valor, idx)`
- `unidadeStatusHtml(ativo)`

### Funções de modal/formulario
- `unidadeAbrirModal(ed = null)`
- `unidadeFecharModal()`
- `unidadeModalPayload()`
- `unidadeTelefonePadrao(idx, tipos)`

### Funções de salvar/excluir
- `unidadeSalvarModal()`
- `unidadeExcluirSelecionada()`

### Funções de infraestrutura do modulo
- `unidadeEnsureUI()`
- `unidadeAplicarAjustesVisuaisV2()`
- `unidadeCarregarTiposLogradouroV2()`

## Mapa de variáveis/estado Unidades
- `unidadeCfg`
- `unidadesCache`
- `unidadeSelId`
- `unidadeCfg.modalEditId`

## Mapa de eventos/binds Unidades
- `bindStandardGridActivation(unidadeCfg.tbody, ...)` para selecao e edicao por duplo clique
- `click` em `unidadeCfg.btnNovo`
- `click` em `unidadeCfg.btnEditar`
- `click` em `unidadeCfg.btnExcluir`
- `click` em `unidadeCfg.btnFechar`
- `click` em `unidadeCfg.mOk`
- `click` em `unidadeCfg.mCancelar`
- `click` no backdrop `unidadeCfg.modal`
- `click` nos atalhos WhatsApp `wa1`, `wa2`, `wa3`, `wa4`

## Mapa de seletores DOM Unidades
- Painel: `#unidades-atendimento-panel`
- Grade: `#unidade-tbody`
- Total: `#unidade-total`
- Botoes: `#unidade-btn-novo`, `#unidade-btn-editar`, `#unidade-btn-excluir`, `#unidade-btn-fechar`
- Modal: `#unidade-modal-backdrop`
- Titulo modal: `#unidade-modal-titulo`
- Campos principais: `#unidade-codigo`, `#unidade-nome`, `#unidade-logradouro`, `#unidade-endereco`, `#unidade-numero`, `#unidade-complemento`, `#unidade-bairro`, `#unidade-cidade`, `#unidade-cep`, `#unidade-uf`
- Telefones: `#unidade-fone1-tipo`, `#unidade-fone1`, `#unidade-contato1`, `#unidade-fone2-tipo`, `#unidade-fone2`, `#unidade-contato2`, `#unidade-fone3-tipo`, `#unidade-fone3`, `#unidade-contato3`, `#unidade-fone4-tipo`, `#unidade-fone4`, `#unidade-contato4`
- Checkbox: `#unidade-inativa`
- Datas: `#unidade-inclusao`, `#unidade-alteracao`
- Acoes do modal: `#unidade-modal-ok`, `#unidade-modal-cancelar`
- Atalhos visuais: `#unidade-wa1`, `#unidade-wa2`, `#unidade-wa3`, `#unidade-wa4`

## Mapa de endpoints Unidades
- `GET /cadastros/unidades-atendimento`
- `GET /cadastros/unidades-atendimento/proximo-codigo`
- `GET /cadastros/unidades-atendimento/combos`
- `POST /cadastros/unidades-atendimento`
- `PUT /cadastros/unidades-atendimento/{id}`
- `DELETE /cadastros/unidades-atendimento/{id}`

## Contratos globais / window relacionados a Unidades
- `window.unidadeAbrir`
- `window.unidadeAbrirModal`
- Dependencias globais consumidas:
  - `hideAllPanels()`
  - `workspaceEmpty`
  - `ensurePanelChrome()`
  - `ensureModalChrome()`
  - `footerMsg`
  - `requestJson()`
  - `esc()`
  - `materiaisCarregarAuxTipo()`
  - `FICHA_UFS_PADRAO`
  - `FICHA_TIPOS_FONE_PADRAO`
  - `fichaAbrirWhatsAppComTelefone()`

## Dependencias compartilhadas
- Shell/menu: o modulo e aberto por `data-menu-action="cadastro-unidades-atendimento"` e pelo dispatcher de `app.js`
- Permissoes: depende de `menuEnsurePermission(action)` antes da abertura
- Grid padrao: usa `bindStandardGridActivation()` para selecao e duplo clique
- Infraestrutura visual: usa `ensurePanelChrome()` e `ensureModalChrome()`
- Helpers externos: depende de helpers de materiais e ficha para combos e WhatsApp

## Classificacao por risco
- `unidadeFmtCodigo`: helper puro
- `unidadeStatusHtml`: helper puro
- `unidadeTelefonePadrao`: helper puro com dependencia leve de constante compartilhada
- `unidadeSetOptions`: helper com DOM
- `unidadeSelecionada`: helper com estado global
- `unidadeSelecionarLinha`: evento/estado
- `unidadeRender`: renderizacao/listagem
- `unidadeCarregar`: fetch/API
- `unidadeAbrirModal`: modal/formulario + fetch/API
- `unidadeFecharModal`: modal/formulario
- `unidadeModalPayload`: helper com DOM
- `unidadeSalvarModal`: fetch/API + modal/formulario
- `unidadeExcluirSelecionada`: fetch/API + estado
- `unidadeEnsureUI`: DOM/infraestrutura
- `unidadeAplicarAjustesVisuaisV2`: DOM/infraestrutura
- `unidadeCarregarTiposLogradouroV2`: fetch/API
- `unidadeAbrir`: integração com shell + estado + DOM

## Candidatos seguros para Subetapa 1
- `unidadeFmtCodigo`
- `unidadeStatusHtml`
- `unidadeTelefonePadrao`

## Itens proibidos de mover agora
- `unidadeAbrir()`
- binds de eventos
- duplo clique da grade
- selecao de linha
- salvar/excluir
- qualquer funcao com `requestJson()`
- qualquer manipulacao direta de DOM
- qualquer funcao ligada ao menu ou ao shell
- qualquer contrato `window.*`
- qualquer comportamento ja funcional no monolitico

## Recomendacao tecnica para a proxima subetapa
- A proxima subetapa deve ser apenas a criacao de uma estrutura modular vazia/controlada, sem carregar no `index.html` e sem substituir comportamento funcional do `app.js`.
- O primeiro movimento seguro e copiar somente os helpers puros acima para um namespace/teste isolado, mantendo o monolito como fonte da verdade.

## A proxima subetapa deve ser apenas criar estrutura vazia/controlada?
- Sim.
- Nao e momento de mover renderizacao, eventos, fetch ou abertura do modulo.
- O objetivo deve ser somente estabelecer o contrato do futuro modulo sem ativar dependencia nova.

## Checklist manual futuro para testar Unidades
- Abrir `Cadastro > Unidades de atendimento`
- Confirmar listagem
- Selecionar linha
- Dar duplo clique e abrir edicao
- Abrir por botao `Altera...`
- Testar `Nova unidade...`
- Salvar alteracao
- Excluir unidade
- Fechar modal
- Confirmar ausencia de erro no console

## Checklist reduzido de regressao geral
- Login continua funcionando
- `Medicamentos` continua funcionando
- `CID` continua funcionando
- `Convênios e Planos` continua funcionando
- `Tabelas auxiliares` continua funcionando
- `Plano de contas` continua funcionando
- `Indices financeiros` continua funcionando
- `Agenda` continua funcionando

## Critérios para parar antes de alterar codigo
- Se a extracao exigir mover DOM, eventos e fetch juntos
- Se alguma funçao funcional do monolito precisar ser removida antes da validacao do modulo novo
- Se o namespace novo exigir reativar `frontend/js/modules/`
- Se surgir `ReferenceError` ou `TypeError` ao mapear a fronteira
- Se qualquer parte do shell ou permissao ficar ambigua

## Conclusao
- `Unidades` segue como o melhor primeiro modulo real para uma modularizacao segura.
- O recorte imediato e pequeno: helpers puros `unidadeFmtCodigo`, `unidadeStatusHtml` e `unidadeTelefonePadrao`.
- Tudo o que envolve DOM, estado, evento, fetch e shell precisa permanecer no monolito nesta fase.
