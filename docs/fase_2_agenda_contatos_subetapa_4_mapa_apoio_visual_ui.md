# Fase 2 - Agenda de contatos - Subetapa 4 - Mapa documental do carregamento de apoio visual e fronteiras de UI

## 1. Contexto
Esta etapa continua documentalmente o modulo `Agenda de contatos` dentro da Fase 2 de modularizacao/refatoracao do frontend.

O objetivo desta subetapa e mapear o carregamento de apoio visual e as fronteiras de UI antes de qualquer extração funcional.

O foco foi separado em quatro blocos:

- apoio visual puro;
- carregamento de apoio vindo de endpoint;
- construcao de DOM;
- fronteiras de modal, eventos e estado global/cache.

Diretriz registrada nesta etapa:

- `Agenda de contatos` deve ser tratada como `core / comum`;
- nao implementar multiarea;
- nao criar flags multiarea;
- nao separar comportamento por area profissional.

## 2. Documentos consultados
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_agenda_contatos_subetapa_1_contrato_funcional_fronteiras.md`
- `docs/fase_2_agenda_contatos_subetapa_2_mapa_dependencias_tenant.md`
- `docs/fase_2_agenda_contatos_subetapa_3_mapa_fluxo_listagem_filtros.md`
- `docs/fase_2_reavaliacao_modulos_frontend_sem_modularizacao.md`
- `docs/auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 3. Confirmacao do commit anterior
Confirmado:

- `8512c9706809712345419d61b2353f95e83a2e35` - `Mapeia fluxo de listagem de agenda contatos`

Esse commit permanece valido e nao e reescrito por esta etapa.

## 4. Diretriz core/comum
Nesta frente, `Agenda de contatos` continua tratada como modulo `core / comum`.

Regras de conducao:

- nao implementar multiarea;
- nao criar flags multiarea;
- nao separar comportamento por area profissional;
- nao usar classificacao por area como criterio de conducao;
- nao alterar comportamento nesta etapa.

## 5. Mapa de apoio visual puro
Funcoes lidas como apoio visual puro ou quase puro:

- `agendaContatosTelefonesTexto`
- `agendaContatosField`
- `agendaContatosOption`
- `agendaContatosSelect`
- `agendaContatosBuildPhoneRow`
- `agendaContatosNode`
- `agendaContatosSelecionarLinha`
- `agendaContatosSetTab`

Observacao:

- essas funcoes ainda dependem do contexto da tela, mas sao as mais proximas de um helper visual puro;
- `agendaContatosTelefonesTexto` e a candidata visual mais simples porque apenas formata texto para exibicao na grade.

## 6. Mapa de funcoes que constroem DOM
Funcoes que constroem ou reorganizam DOM:

- `agendaContatosNode`
- `agendaContatosOption`
- `agendaContatosSelect`
- `agendaContatosField`
- `agendaContatosBuildPhoneRow`
- `agendaContatosGarantirAbaDetalhes`
- `agendaContatosReconstruirModalBody`
- `agendaContatosEnsureUI`
- `agendaContatosRender`
- `agendaContatosSetTab`
- `agendaContatosSelecionarLinha`

Observacao:

- `agendaContatosEnsureUI` e `agendaContatosReconstruirModalBody` constroem o esqueleto da tela e do modal;
- `agendaContatosRender` atualiza a grade com base no cache e no filtro atual;
- `agendaContatosSelecionarLinha` altera classe de selecao na grade e portanto depende do DOM vivo.

## 7. Mapa de funcoes com dependencia de contexto global
Funcoes dependentes de estado global da tela:

- `agendaContatosEnsureUI`
- `agendaContatosGarantirAbaDetalhes`
- `agendaContatosSelecionarLinha`
- `agendaContatosSetTab`
- `agendaContatosFiltrar`
- `agendaContatosTelefonesTexto`
- `agendaContatosAtualizarFiltroTipos`
- `agendaContatosRender`
- `agendaContatosCarregar`
- `agendaContatosCarregarTipos`
- `agendaContatosCarregarEspecialidades`
- `agendaContatosCarregarAuxiliares`
- `agendaContatosAbrir`

Contexto global relevante associado:

- `agendaContatos`
- `agendaContatosCache`
- `agendaContatosTiposCache`
- `agendaContatosEspecialidadesCache`
- `agendaContatosSelId`

## 8. Mapa de funcoes com `requestJson`
Funcoes que usam `requestJson`:

- `agendaContatosCarregarTipos`
- `agendaContatosCarregarEspecialidades`
- `agendaContatosCarregarAuxiliares`
- `agendaContatosCarregar`
- `agendaContatosSalvarModal`
- `agendaContatosExcluir`

Para esta subetapa, o foco documental fica apenas nas quatro primeiras:

- `agendaContatosCarregarTipos`
- `agendaContatosCarregarEspecialidades`
- `agendaContatosCarregarAuxiliares`
- `agendaContatosCarregar`

## 9. Mapa de funcoes que escrevem cache global
Funcoes que escrevem cache ou estado compartilhado:

- `agendaContatosCarregarTipos` -> `agendaContatosTiposCache`
- `agendaContatosCarregarEspecialidades` -> `agendaContatosEspecialidadesCache`
- `agendaContatosCarregarAuxiliares` -> apoio de selects, sem cache dedicado novo, mas alimenta o estado da UI
- `agendaContatosCarregar` -> `agendaContatosCache` e `agendaContatosSelId`
- `agendaContatosSelecionarLinha` -> `agendaContatosSelId`
- `agendaContatosAbrir` -> dispara o ciclo que atualiza caches e UI

## 10. Funcoes proibidas para extracao nesta fase
Ficam proibidas para extracao nesta fase:

- `agendaContatosAbrir`
- `agendaContatosVincularEventos`
- `agendaContatosPreencherModal`
- `agendaContatosAbrirModal`
- `agendaContatosFecharModal`
- `agendaContatosMontarPayload`
- `agendaContatosSalvarModal`
- `agendaContatosExcluir`

Tambem ficam fora do primeiro recorte:

- qualquer rotina que toque `requestJson` de salvamento/exclusao;
- qualquer rotina de modal;
- qualquer rotina que dependa do fluxo de detalhe ou da orquestracao completa da tela.

## 11. Avaliacao de risco
### 11.1 `agendaContatosRender`
Risco: medio.

Motivos:

- depende de `agendaContatosCache`, `agendaContatosSelId` e do DOM da grade;
- e puramente visual em resultado, mas ainda depende do estado da tela;
- pode ser um bom candidato futuro, desde que o contexto de tela seja isolado antes.

### 11.2 `agendaContatosFiltrar`
Risco: baixo a medio.

Motivos:

- e a funcao mais proxima de um filtro puro de dados;
- ainda depende de `agendaContatosCache` e dos valores atuais da interface;
- e a candidata mais conservadora para um helper separavel em fase futura.

### 11.3 `agendaContatosAtualizarFiltroTipos`
Risco: medio.

Motivos:

- mistura construçao de opções com leitura de cache de tipos;
- escreve `innerHTML` em dois controles diferentes;
- e visual, mas ainda acoplada ao ciclo de carregamento.

### 11.4 `agendaContatosTelefonesTexto`
Risco: baixo.

Motivos:

- e a função visual mais isolada do grupo;
- apenas formata o texto exibido na grade;
- ainda depende da estrutura do item, mas nao faz request nem altera cache.

## 12. Primeiro recorte funcional minimo recomendado, apenas como plano
O primeiro recorte funcional minimo recomendado ainda nao deve ser executado nesta etapa. Como plano documental, ele pode ser:

1. separar apenas `agendaContatosTelefonesTexto` como helper visual puro;
2. estudar `agendaContatosFiltrar` como helper de filtro quase puro;
3. manter `agendaContatosRender` em `frontend/app.js` ate o contexto visual estar totalmente compreendido;
4. deixar `agendaContatosAtualizarFiltroTipos` para um segundo momento, porque ela ainda escreve diretamente no DOM e depende de cache carregado.

Conclusao do plano:

- ainda nao e seguro iniciar patch;
- a fronteira mais conservadora continua sendo helper visual puro antes de renderização/listagem.

## 13. Checks tecnicos exigidos para futura implementacao
Se houver implementacao futura, os checks exigidos devem incluir:

- `git diff -- frontend/app.js`;
- `git diff -- frontend/index.html`;
- `git diff -- frontend/js/modules`;
- `git diff -- backend`;
- `git diff -- docs/11_roadmap_desenvolvimento.md`;
- `git diff -- docs/fase_2_agenda_contatos_subetapa_4_mapa_apoio_visual_ui.md`;
- `git status --short`;
- validar no navegador a abertura de `Agenda de contatos`;
- validar a grade de contatos;
- validar filtro por texto;
- validar filtro de tipos;
- validar carregamento de tipos, especialidades e auxiliares;
- validar que `Agenda` e `Agenda legado` continuam funcionando;
- validar console sem `ReferenceError`/`TypeError`;
- validar que nenhuma permissao foi alterada.

## 14. Onde testar futuramente quando houver alteracao real
Quando houver alteracao real, testar futuramente:

- abrir `Agenda de contatos`;
- confirmar a abertura visual do painel;
- confirmar a grade de contatos;
- confirmar filtro por texto;
- confirmar filtro de tipos;
- confirmar listas de apoio carregadas;
- abrir `Agenda` e confirmar que o fluxo maior continua funcionando;
- abrir `Agenda legado` e confirmar que a lista auxiliar continua funcionando;
- confirmar ausencia de regressao de DOM e console;
- confirmar que a permissao `agenda` continua a mesma.

## 15. Proxima subetapa recomendada
Recomenda-se como continuidade documental:

- `Fase 2 - Agenda de contatos - Subetapa 5 - Plano documental do primeiro recorte funcional minimo com helper visual puro`

## 16. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nao houve correcao textual, acentuacao, label, placeholder, string visivel ou mojibake.

Se algum texto estranho ou acento incorreto aparecer nos arquivos lidos, ele deve ser tratado apenas como pendencia futura, sem correcao nesta etapa.

## 17. Registro para roadmap
- A Subetapa 4 de `Agenda de contatos` foi criada documentalmente.
- O mapa de apoio visual/UI foi registrado.
- O modulo continua tratado como `core / comum`.
- Nenhum codigo foi alterado.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- O primeiro recorte funcional minimo foi mantido apenas como plano documental.
- A proxima subetapa recomendada e `Agenda de contatos - Subetapa 5 - Plano documental do primeiro recorte funcional minimo com helper visual puro`.

## 18. Commit seletivo obrigatorio
Se esta etapa permanecer restrita a este documento e, se necessario, ao roadmap, o commit deve ser seletivo.

Nao usar:

- `git add .`
- `git add docs/`
- qualquer forma de selecao ampla de arquivos

Usar apenas:

- `git add docs/fase_2_agenda_contatos_subetapa_4_mapa_apoio_visual_ui.md`
- se alterado, `git add docs/11_roadmap_desenvolvimento.md`

Depois:

- `git commit -m "Mapeia apoio visual de agenda contatos"`
- `git push`

