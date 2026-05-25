# Fase 2 - Agenda de contatos - Subetapa 10 - Plano documental do terceiro recorte funcional minimo

## 1. Contexto
Esta subetapa continua a frente `Agenda de contatos` apos a validacao manual bem-sucedida da Subetapa 9.

O foco agora e `agendaContatosAtualizarFiltroTipos`, que mistura geracao de opcoes com escrita direta no DOM e por isso exige uma documentacao mais cirurgica antes de qualquer patch futuro.

## 2. Documentos consultados
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_agenda_contatos_subetapa_8_plano_logica_pura_filtragem.md`
- `docs/fase_2_agenda_contatos_subetapa_9_implementacao_logica_pura_filtragem.md`
- `docs/fase_2_agenda_contatos_subetapa_4_mapa_apoio_visual_ui.md`
- `docs/fase_2_agenda_contatos_subetapa_6_implementacao_minima_helper_visual.md`
- `docs/fase_2_agenda_contatos_subetapa_6b_correcao_regressao_icone_telefone.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/agenda-contatos-telefones.js`
- `frontend/js/modules/agenda-contatos-listagem.js`

## 3. Confirmacao dos commits anteriores
Commits confirmados:
- `596c1d2fb487401b1dabdb83b5bffe5c674f1418` - `Extrai filtro de agenda contatos`
- `f7b8129782eb4aa68869f50ebf96c82811797d04` - `Planeja logica pura de filtro de agenda contatos`
- `d78aec0ca64161ac6852b0f6246773c860329acb` - `Corrige icone de telefone em agenda contatos`

## 4. Confirmacao da validacao manual informada pelo usuario
A validacao manual foi informada como bem-sucedida:
- `Agenda de contatos` abre;
- lista/grade aparece normalmente;
- busca por nome existente funciona;
- busca por termo inexistente funciona;
- busca vazia funciona;
- filtro por tipo funciona, se houver dados;
- combinacao de tipo + busca por nome funciona;
- busca nao passou a filtrar por telefone, cidade ou outros campos;
- coluna de telefones continua igual;
- selecao de linha continua funcionando;
- modal abre/fecha sem salvar;
- salvar/excluir nao foram alterados;
- `Agenda principal` e `Agenda legado` continuam abrindo;
- nao foi relatado erro de console.

## 5. Diretriz core/comum
`Agenda de contatos` continua tratada como `core / comum`.

Regras mantidas:
- nao implementar multiarea
- nao criar flags multiarea
- nao separar comportamento por area profissional
- nao alterar backend, banco, endpoint ou permissao

## 6. Funcao candidata
Funcao candidata para o terceiro recorte funcional minimo:
- `agendaContatosAtualizarFiltroTipos`

## 7. Mapa de chamadas e dependencias
### Onde a funcao esta definida
- `frontend/app.js`, na area de funcoes de apoio da `Agenda de contatos`

### Onde a funcao e chamada
- `agendaContatosCarregarTipos()` chama `agendaContatosAtualizarFiltroTipos()`

### Fluxo observado
- `agendaContatosCarregarTipos()` carrega os tipos de contato
- atualiza `agendaContatosTiposCache`
- chama `agendaContatosAtualizarFiltroTipos()`
- a funcao monta as opcoes e escreve no filtro e no select de tipo

## 8. Contrato atual da funcao
`agendaContatosAtualizarFiltroTipos()` hoje:
- nao recebe parametros
- depende diretamente de `agendaContatos`
- depende diretamente de `agendaContatosTiposCache`
- gera a lista de opcoes com HTML
- escreve o HTML em dois controles da UI

### Entradas usadas hoje
- `agendaContatos`
- `agendaContatosTiposCache`

### Saidas / efeitos
- preenche `agendaContatos.filtro`
- preenche `agendaContatos.tipo`
- usa a lista de tipos para gerar as opcoes
- quando nao ha cache, usa fallback fixo de opcoes

## 9. Contrato futuro recomendado
Contrato ideal para helper puro futuro:
- `montarOpcoesFiltroTipos(listaTipos)`

### Entrada
- lista de tipos ja normalizada

### Saida
- string HTML com as opcoes

### Camada de UI
- a escrita em `agendaContatos.filtro` e `agendaContatos.tipo` deve ficar em `frontend/app.js`

Esse contrato separa:
- geracao do HTML das opcoes
- aplicacao das opcoes no DOM

## 10. Dependencias com DOM, cache, estado, renderizacao e selecao
### DOM
Existe dependencia direta:
- `agendaContatos.filtro`
- `agendaContatos.tipo`

### Cache
Existe dependencia direta:
- `agendaContatosTiposCache`

### Estado
Existe dependencia direta do objeto `agendaContatos`

### Renderizacao
Nao chama `agendaContatosRender()` diretamente, mas alimenta a interface que influencia o filtro

### Selecao
Nao depende de selecao diretamente

## 11. Confirmacao de inexistencia ou existencia de requestJson, modal, salvar, excluir, payload e eventos
### requestJson
- existe indiretamente no fluxo anterior, em `agendaContatosCarregarTipos()`
- nao e usado diretamente em `agendaContatosAtualizarFiltroTipos()`

### modal
- inexistente

### salvar
- inexistente

### excluir
- inexistente

### payload
- inexistente

### eventos
- inexistente

Conclusao:
- a funcao nao e de rede, modal ou persistencia;
- o risco principal esta na escrita DOM dupla e no acoplamento com cache da UI.

## 12. Avaliacao se deve extrair funcao inteira ou apenas logica pura
Recomendacao documental:
- nao extrair a funcao inteira de imediato
- extrair primeiro a geracao pura das opcoes
- manter em `frontend/app.js` a escrita no DOM e a orquestracao da tela

Motivo:
- a funcao atual mistura geracao de string HTML com aplicacao visual
- o primeiro corte seguro e isolar a parte que transforma lista de tipos em HTML

## 13. Arquivo futuro sugerido
Arquivo futuro sugerido:
- `frontend/js/modules/agenda-contatos-listagem.js`

Motivo:
- o modulo ja abriga a logica de filtragem
- a geracao das opcoes de tipos faz parte da camada de listagem e apoio da tela
- evitar criar um arquivo novo desnecessario para um helper muito pequeno

## 14. Namespace futuro sugerido
Namespace sugerido:
- `window.BranaAgendaContatosListagemModule`

Possiveis helpers futuros:
- `filtrarAgendaContatos`
- `montarOpcoesFiltroTipos`

## 15. Plano de wrapper/fallback em frontend/app.js
Plano documental para futura implementacao:
- `frontend/app.js` continua responsavel por escrever o HTML nos selects
- o helper futuro devolve apenas a string de opcoes
- se o namespace nao estiver disponivel, o fallback deve manter a logica atual exatamente como esta hoje

Estrutura conceitual:
- helper puro: `montarOpcoesFiltroTipos(listaTipos)`
- wrapper em `app.js`: `agendaContatosAtualizarFiltroTipos()`

## 16. Funcoes que devem permanecer em frontend/app.js
Devem permanecer em `frontend/app.js`:
- `agendaContatosAbrir`
- `agendaContatosVincularEventos`
- `agendaContatosCarregar`
- `agendaContatosCarregarTipos`
- `agendaContatosCarregarEspecialidades`
- `agendaContatosCarregarAuxiliares`
- `agendaContatosFiltrar`
- `agendaContatosRender`
- `agendaContatosPreencherModal`
- `agendaContatosAbrirModal`
- `agendaContatosFecharModal`
- `agendaContatosMontarPayload`
- `agendaContatosSalvarModal`
- `agendaContatosExcluir`

## 17. Riscos de regressao
Riscos observados para futura implementacao:
- quebrar o select de filtro
- quebrar o select de tipo no modal
- perder as opcoes fallback quando o cache vier vazio
- alterar a ordem ou o texto das opcoes
- introduzir diferenca entre o HTML gerado hoje e o gerado pelo helper futuro
- quebrar a atualizacao dos dois campos ao mesmo tempo

## 18. Checks tecnicos obrigatorios para futura implementacao
Se houver implementacao futura, os checks minimos devem incluir:
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules`
- `git diff -- backend`
- `git diff -- docs/11_roadmap_desenvolvimento.md`
- `git status --short`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/agenda-contatos-listagem.js`
- `node --check frontend/js/modules/agenda-contatos-telefones.js`
- abrir `Agenda de contatos`
- validar filtro de tipos no painel
- validar tipo no modal de contato
- validar fallback quando o cache vier vazio

## 19. Onde testar no sistema antes de prosseguir apos futura implementacao
Quando houver implementacao real, testar:
1. abrir `Agenda de contatos`
2. confirmar o filtro de tipos carregado
3. confirmar o select de tipo no modal
4. validar o fallback com cache vazio
5. trocar tipo e confirmar a lista atualiza corretamente
6. confirmar que a busca continua restrita ao nome
7. confirmar que a coluna de telefones permanece igual
8. confirmar console sem `ReferenceError` ou `TypeError`

## 20. Decisao: proxima subetapa pode ou nao ser implementação minima
Decisao documental desta subetapa:
- sim, a proxima subetapa pode ser uma implementacao minima
- mas ela deve ser restrita a extrair apenas a geracao pura das opcoes
- a escrita no DOM deve continuar em `frontend/app.js` como wrapper fino

## 21. Proxima subetapa recomendada
Proxima subetapa recomendada:
- `Agenda de contatos - Subetapa 11 - Implementacao minima da geracao pura de opcoes de filtro de tipos`

## 22. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nao houve correcao textual, acentuacao, labels, placeholders, strings visiveis ou mojibake.

Qualquer texto estranho observado deve permanecer apenas como pendencia futura, sem correcao nesta etapa.

## 23. Registro para roadmap
- A validacao manual da Subetapa 9 foi registrada como bem-sucedida.
- A Subetapa 10 foi criada documentalmente.
- O plano do terceiro recorte funcional minimo foi registrado.
- O modulo continua tratado como `core / comum`.
- Nenhum codigo foi alterado.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- A proxima subetapa recomendada e `Agenda de contatos - Subetapa 11 - Implementacao minima da geracao pura de opcoes de filtro de tipos`.

## 24. Commit seletivo obrigatorio
Se e somente se a etapa ficar restrita a este documento novo e, se necessario, ao roadmap:
- usar apenas `git add docs/fase_2_agenda_contatos_subetapa_10_plano_atualizar_filtro_tipos.md`
- se houver alteracao de roadmap, adicionar apenas `docs/11_roadmap_desenvolvimento.md`
- depois executar `git commit -m "Planeja filtro de tipos de agenda contatos"`
- em seguida executar `git push`

