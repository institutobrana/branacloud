# Fase 2 - Agenda de contatos - Subetapa 7 - Plano documental do segundo recorte funcional minimo

## 1. Contexto
Esta subetapa continua a trilha documental de `Agenda de contatos` apos a validacao manual bem-sucedida da Subetapa 6 e da correcao 6B.

O novo foco e a funcao `agendaContatosFiltrar`, que foi apontada como a proxima candidata tecnica, mas ainda nao deve ser extraida nesta etapa.

## 2. Documentos consultados
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_agenda_contatos_subetapa_5_plano_primeiro_recorte_helper_visual.md`
- `docs/fase_2_agenda_contatos_subetapa_6_implementacao_minima_helper_visual.md`
- `docs/fase_2_agenda_contatos_subetapa_6b_correcao_regressao_icone_telefone.md`
- `docs/fase_2_agenda_contatos_subetapa_4_mapa_apoio_visual_ui.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/js/modules/agenda-contatos-telefones.js`
- `frontend/index.html`

## 3. Confirmacao dos commits anteriores
Commits recentes confirmados:
- `fcee577630936809c65d95bb53928a8816e3e988` - `Extrai helper visual de agenda contatos`
- `d78aec0ca64161ac6852b0f6246773c860329acb` - `Corrige icone de telefone em agenda contatos`

## 4. Confirmacao da validacao manual informada pelo usuario
A validacao manual foi informada como bem-sucedida:
- `Agenda de contatos` abre
- o icone de telefone voltou ao normal
- a coluna/lista de telefones continua funcionando
- contatos sem telefone, com um telefone e com multiplos telefones foram conferidos
- filtro e selecao continuam funcionando
- modal abre/fecha sem regressao aparente
- nao foi relatado erro de console

## 5. Diretriz core/comum
Nesta frente, `Agenda de contatos` continua tratada como `core / comum`.

Regras mantidas:
- nao implementar multiarea
- nao criar flags multiarea
- nao separar comportamento por area profissional
- nao alterar backend, banco, endpoint ou permissao

## 6. Funcao candidata
Funcao candidata para o segundo recorte funcional minimo:
- `agendaContatosFiltrar`

## 7. Mapa de chamadas e dependencias
### Onde a funcao esta definida
- `frontend/app.js`, por volta da area de `Agenda de contatos`
- definicao localizada no bloco de funcoes de filtro, antes de `agendaContatosSelecionado` e `agendaContatosTelefonesTexto`

### Onde a funcao e chamada
- `agendaContatosRender()` chama `agendaContatosFiltrar()` para montar a lista exibida

### Fluxo observado
- `agendaContatosCarregar()` atualiza `agendaContatosCache`
- `agendaContatosCarregar()` chama `agendaContatosRender()`
- `agendaContatosRender()` chama `agendaContatosFiltrar()`
- `agendaContatosFiltrar()` devolve a lista filtrada

## 8. Contrato atual da funcao
`agendaContatosFiltrar()` hoje:
- nao recebe parametros
- le diretamente o estado da UI
- usa o cache carregado
- retorna um novo array filtrado

### Entradas usadas hoje
- `agendaContatos?.filtro?.value`
- `agendaContatos?.busca?.value`
- `agendaContatosCache`

### Saida atual
- retorna a lista de contatos filtrada por:
  - tipo selecionado
  - texto de busca

### Regras atuais observadas
- se o filtro de tipo estiver preenchido, compara com `item.tipo`
- se o termo de busca estiver preenchido, compara com `item.nome`
- nao altera itens
- nao altera cache
- nao altera DOM diretamente

## 9. Contrato futuro recomendado
Para tornar a funcao mais segura em uma futura extracao, o contrato ideal seria separar:
- um helper puro que recebe `lista`, `filtro` e `termo`
- uma camada fina em `frontend/app.js` que apenas coleta os valores da UI

Contrato futuro sugerido do helper puro:
- entrada:
  - lista de contatos
  - tipo selecionado
  - termo de busca
- saida:
  - nova lista filtrada

Esse contrato reduz o acoplamento ao DOM e facilita teste unitario futuro.

## 10. Dependencias com DOM, cache, estado, renderizacao e selecao
### DOM
Existe dependencia direta:
- `agendaContatos?.filtro?.value`
- `agendaContatos?.busca?.value`

### Cache
Existe dependencia direta:
- `agendaContatosCache`

### Estado
Existe dependencia indireta:
- o estado da UI e lido por meio do objeto `agendaContatos`

### Renderizacao
Nao altera DOM diretamente, mas e chamada por `agendaContatosRender()`, que atualiza a grade

### Selecao
Nao le diretamente `agendaContatosSelId`, mas participa do fluxo que preserva a selecao na renderizacao

## 11. Confirmacao de inexistencia ou existencia de requestJson/modal/salvar/excluir/payload/eventos
### requestJson
- inexistente em `agendaContatosFiltrar`

### modal
- inexistente em `agendaContatosFiltrar`

### salvar
- inexistente em `agendaContatosFiltrar`

### excluir
- inexistente em `agendaContatosFiltrar`

### payload
- inexistente em `agendaContatosFiltrar`

### eventos
- inexistente em `agendaContatosFiltrar`

Conclusao:
- a funcao e de leitura e filtro;
- o risco maior nao e request/modais, e sim o acoplamento com DOM e cache global.

## 12. Avaliacao se deve extrair funcao inteira ou apenas logica pura
A recomendacao documental e:
- nao extrair a funcao inteira de imediato
- extrair primeiro apenas a logica pura de filtragem, separando a coleta dos valores de UI

Motivo:
- a funcao hoje le diretamente `agendaContatos.filtro` e `agendaContatos.busca`
- isso impede que ela seja um helper puro completo sem um wrapper
- a separacao minima de risco e manter `frontend/app.js` como coletor de contexto

## 13. Arquivo futuro sugerido
Sugestao de arquivo futuro mais adequada:
- `frontend/js/modules/agenda-contatos-listagem.js`

Motivo:
- a funcao nao e apenas filtro de dados isolado;
- ela participa da logica de listagem/renderizacao da grade;
- o nome deixa mais claro que o helper futuro pertence ao fluxo de listagem de `Agenda de contatos`.

Reaproveitar `frontend/js/modules/agenda-contatos-telefones.js` nao e o caminho ideal, porque esse modulo ficou focado no helper de telefones.

## 14. Namespace futuro sugerido
Namespace sugerido:
- `window.BranaAgendaContatosListagemModule`

Possivel helper futuro:
- `agendaContatosFiltrar`
- ou `filtrarContatos`

## 15. Plano de wrapper/fallback em frontend/app.js
Plano documental para a futura extracao:
- `frontend/app.js` continua sendo o ponto que coleta `agendaContatos.filtro.value` e `agendaContatos.busca.value`
- o wrapper pode chamar um helper puro exportado pelo novo modulo
- se o helper nao estiver carregado, o fallback deve manter a logica atual exatamente como esta

Estrutura conceitual sugerida:
- helper novo recebe lista + filtro + termo
- `app.js` chama esse helper
- fallback preserva o comportamento atual caso o namespace nao exista

## 16. Funcoes que devem permanecer em frontend/app.js
Devem permanecer em `frontend/app.js`:
- `agendaContatosAbrir`
- `agendaContatosVincularEventos`
- `agendaContatosCarregar`
- `agendaContatosCarregarTipos`
- `agendaContatosCarregarEspecialidades`
- `agendaContatosCarregarAuxiliares`
- `agendaContatosAtualizarFiltroTipos`
- `agendaContatosRender` enquanto o contexto visual nao for totalmente isolado
- `agendaContatosPreencherModal`
- `agendaContatosAbrirModal`
- `agendaContatosFecharModal`
- `agendaContatosMontarPayload`
- `agendaContatosSalvarModal`
- `agendaContatosExcluir`

## 17. Riscos de regressao
Riscos principais:
- quebrar o filtro por tipo
- quebrar a busca por nome
- alterar a preservacao da selecao ao re-renderizar
- perder compatibilidade com o cache carregado
- introduzir diferenca entre o resultado atual e o resultado do helper futuro

Riscos menores:
- alterar o comportamento quando filtro ou busca estiverem vazios
- mudar tratamento de maiusculas/minusculas
- alterar a lista exibida durante o carregamento

## 18. Checks tecnicos obrigatorios para futura implementacao
Se houver implementacao futura, os checks minimos devem incluir:
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules`
- `git diff -- backend`
- `git diff -- docs/11_roadmap_desenvolvimento.md`
- `git status --short`
- `node --check` nos arquivos JS alterados
- abrir `Agenda de contatos`
- validar filtro por tipo
- validar filtro por texto
- validar selecao de linha antes e depois do filtro
- validar que a coluna de telefones segue correta

## 19. Onde testar no sistema antes de prosseguir apos futura implementacao
Quando houver implementacao real, testar:
1. abrir `Agenda de contatos`
2. aplicar filtro de tipo
3. aplicar busca por nome
4. combinar tipo + busca
5. limpar filtro e busca
6. confirmar selecao de linha apos re-renderizacao
7. confirmar que a coluna de telefones continua igual
8. abrir e fechar modal sem salvar
9. confirmar console sem `ReferenceError` ou `TypeError`

## 20. Decisao: proxima subetapa pode ou nao ser implementacao minima
Decisao documental desta subetapa:
- a proxima subetapa ainda nao deve ser uma implementacao minima direta de `agendaContatosFiltrar`
- primeiro e mais seguro documentar o helper puro de listagem/filtro e a separacao da coleta de valores da UI

Conclusao:
- a proximidade da funcao com dados puros e real;
- porem o acoplamento com DOM e cache ainda recomenda mais documentacao antes do patch.

## 21. Proxima subetapa recomendada
Proxima subetapa recomendada:
- `Agenda de contatos - Subetapa 8 - Plano documental da separacao da logica pura de filtragem e da coleta de contexto da UI`

## 22. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nao houve correcao textual, acentuacao, labels, placeholders, strings visiveis ou mojibake.

Qualquer texto estranho observado deve permanecer apenas como pendencia futura, sem correcao nesta etapa.

## 23. Registro para roadmap
- A validacao manual da correcao 6B foi registrada como bem-sucedida.
- A Subetapa 7 foi criada documentalmente.
- O plano do segundo recorte funcional minimo foi registrado.
- O modulo continua tratado como `core / comum`.
- Nenhum codigo foi alterado.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- A proxima subetapa recomendada e `Agenda de contatos - Subetapa 8 - Plano documental da separacao da logica pura de filtragem e da coleta de contexto da UI`.

## 24. Commit seletivo obrigatorio
Se e somente se a etapa ficar restrita a este documento novo e, se necessario, ao roadmap:
- usar apenas `git add docs/fase_2_agenda_contatos_subetapa_7_plano_segundo_recorte_filtrar.md`
- se houver alteracao de roadmap, adicionar apenas `docs/11_roadmap_desenvolvimento.md`
- depois executar `git commit -m "Planeja segundo recorte de agenda contatos"`
- em seguida executar `git push`

