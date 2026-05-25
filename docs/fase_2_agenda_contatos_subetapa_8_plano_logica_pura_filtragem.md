# Fase 2 - Agenda de contatos - Subetapa 8 - Plano documental da separacao da logica pura de filtragem e da coleta de contexto da UI

## 1. Contexto
Esta subetapa continua a frente `Agenda de contatos` apos a Subetapa 7.

O foco agora e documentar a separacao entre:
- a logica pura de filtragem;
- a coleta de contexto da UI feita em `frontend/app.js`.

A funcao candidata e `agendaContatosFiltrar`.

## 2. Documentos consultados
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_agenda_contatos_subetapa_4_mapa_apoio_visual_ui.md`
- `docs/fase_2_agenda_contatos_subetapa_5_plano_primeiro_recorte_helper_visual.md`
- `docs/fase_2_agenda_contatos_subetapa_6_implementacao_minima_helper_visual.md`
- `docs/fase_2_agenda_contatos_subetapa_6b_correcao_regressao_icone_telefone.md`
- `docs/fase_2_agenda_contatos_subetapa_7_plano_segundo_recorte_filtrar.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/js/modules/agenda-contatos-telefones.js`
- `frontend/index.html`

## 3. Confirmacao dos commits anteriores
Commits confirmados:
- `fcee577630936809c65d95bb53928a8816e3e988` - `Extrai helper visual de agenda contatos`
- `d78aec0ca64161ac6852b0f6246773c860329acb` - `Corrige icone de telefone em agenda contatos`
- `f7892d1f784d32e4a9e9881a4cf4bd36dc4eefd7` - `Planeja segundo recorte de agenda contatos`

## 4. Diretriz core/comum
`Agenda de contatos` continua tratada como `core / comum`.

Regras mantidas:
- nao implementar multiarea
- nao criar flags multiarea
- nao separar comportamento por area profissional
- nao alterar backend, banco, endpoint ou permissao

## 5. Separacao entre logica pura e coleta de contexto da UI
### Logica pura
A parte pura da futura solucao e a funcao que:
- recebe uma lista de contatos;
- recebe o filtro de tipo ja normalizado;
- recebe o termo de busca ja normalizado;
- devolve uma nova lista filtrada;
- nao depende de DOM;
- nao altera cache;
- nao altera selecao;
- nao altera eventos;
- nao chama `requestJson`;
- nao toca modal, salvar, excluir ou payload.

### Coleta de contexto da UI
A parte de UI que deve permanecer em `frontend/app.js` e:
- ler `agendaContatos?.filtro?.value`;
- ler `agendaContatos?.busca?.value`;
- normalizar os valores atuais;
- decidir qual lista base sera usada;
- chamar o helper puro;
- repassar o resultado para `agendaContatosRender()` quando necessario.

## 6. Contrato do helper puro futuro
Assinatura documental recomendada:
- `filtrarAgendaContatos(lista, filtroTipo, termoBusca)`

### Entrada
- `lista`: array de contatos
- `filtroTipo`: string ja normalizada ou vazia
- `termoBusca`: string ja normalizada ou vazia

### Saida
- novo array de contatos filtrado

### Regras de comportamento
- se `filtroTipo` estiver vazio, nao filtra por tipo
- se `termoBusca` estiver vazio, nao filtra por nome
- se ambos estiverem vazios, devolve a lista original em forma filtrada equivalente
- o helper nao deve alterar os itens recebidos

## 7. Tratamento de entradas nulas/vazias
Tratamento recomendado para a futura implementacao:
- `null` e `undefined` devem virar string vazia antes do helper
- lista nula ou indefinida deve virar array vazio
- campos vazios devem ser tratados como "sem filtro"
- lista vazia deve continuar resultando em lista vazia

## 8. Regras de filtragem a preservar
O comportamento atual precisa ser preservado exatamente:
- o filtro por tipo compara com `item.tipo`
- a busca por texto compara apenas com `item.nome`
- a comparacao deve continuar sem ampliar escopo para outros campos
- a busca nao deve passar a considerar contato, telefone, email ou outros dados
- a ordenacao atual nao deve ser alterada nesta etapa

## 9. Confirmacao de que a busca nao deve ser ampliada
Confirmacao documental:
- a busca continua restrita ao nome
- nao deve ser ampliada para outros campos
- nao deve ganhar heuristicas novas
- nao deve mudar a experiencia atual percebida pelo usuario

## 10. Arquivo futuro recomendado
Arquivo futuro recomendado para abrigar o helper:
- `frontend/js/modules/agenda-contatos-listagem.js`

Motivo:
- o modulo de telefones ja ficou focado no helper visual puro;
- a filtragem pertence ao fluxo de listagem e renderizacao;
- o nome deixa clara a responsabilidade futura.

## 11. Namespace futuro recomendado
Namespace recomendado:
- `window.BranaAgendaContatosListagemModule`

Estrutura documental sugerida:
- `helpers.filtrarAgendaContatos`

## 12. Nome do helper futuro
Nome documental sugerido:
- `filtrarAgendaContatos`

Nome do wrapper em `frontend/app.js`:
- `agendaContatosFiltrar`

## 13. Plano de wrapper/fallback em frontend/app.js
Plano documental para a futura implementacao:
- `frontend/app.js` continua coletando `filtro` e `busca` da UI
- os valores serao normalizados antes da chamada ao helper
- o helper puro sera chamado com a lista e os dois parametros ja tratados
- se o namespace nao estiver disponivel, o fallback deve manter a logica atual exatamente como esta hoje

Estrutura conceitual:
- `agendaContatosFiltrar()` vira wrapper fino
- `filtrarAgendaContatos(lista, filtroTipo, termoBusca)` vira helper puro

## 14. Funcoes que devem permanecer em frontend/app.js
Devem permanecer em `frontend/app.js`:
- `agendaContatosAbrir`
- `agendaContatosVincularEventos`
- `agendaContatosCarregar`
- `agendaContatosCarregarTipos`
- `agendaContatosCarregarEspecialidades`
- `agendaContatosCarregarAuxiliares`
- `agendaContatosAtualizarFiltroTipos`
- `agendaContatosRender`
- `agendaContatosPreencherModal`
- `agendaContatosAbrirModal`
- `agendaContatosFecharModal`
- `agendaContatosMontarPayload`
- `agendaContatosSalvarModal`
- `agendaContatosExcluir`

## 15. Riscos de regressao
Riscos observados para futura implementacao:
- quebrar a lista filtrada ao normalizar tipo ou busca
- mudar o comportamento quando o filtro estiver vazio
- mudar o comportamento quando a busca estiver vazia
- alterar a comparacao por nome
- alterar a preservacao de selecao apos re-renderizacao
- introduzir diferenca entre o resultado do helper e o resultado atual

## 16. Checks tecnicos obrigatorios para futura implementacao
Se houver implementacao futura, os checks minimos devem incluir:
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules`
- `git diff -- backend`
- `git diff -- docs/11_roadmap_desenvolvimento.md`
- `git status --short`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/agenda-contatos-telefones.js`
- validar a tela `Agenda de contatos`
- validar filtro por tipo
- validar busca por nome
- validar selecao de linha apos filtro
- validar a coluna de telefones

## 17. Onde testar no sistema apos futura implementacao
Quando houver implementacao real, testar:
1. abrir `Agenda de contatos`
2. aplicar filtro de tipo
3. aplicar busca por nome
4. combinar tipo + busca
5. limpar filtro e busca
6. confirmar selecao de linha apos re-renderizacao
7. conferir que a coluna de telefones permanece igual
8. confirmar console sem `ReferenceError` ou `TypeError`

## 18. Decisao: proxima subetapa pode ou nao ser implementacao minima
Decisao documental desta subetapa:
- sim, a proxima subetapa pode ser uma implementacao minima
- ela deve se concentrar na extracao da logica pura `filtrarAgendaContatos`
- `frontend/app.js` deve ficar apenas com a coleta do contexto da UI e o wrapper fino

## 19. Proxima subetapa recomendada
Proxima subetapa recomendada:
- `Agenda de contatos - Subetapa 9 - Implementacao minima da logica pura de filtragem`

## 20. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nao houve correcao textual, acentuacao, labels, placeholders, strings visiveis ou mojibake.

Qualquer texto estranho observado deve permanecer apenas como pendencia futura, sem correcao nesta etapa.

## 21. Registro para roadmap
- A Subetapa 8 foi criada documentalmente.
- A separacao planejada entre logica pura de filtragem e coleta de contexto da UI foi registrada.
- O modulo continua tratado como `core / comum`.
- Nenhum codigo foi alterado.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- A proxima subetapa recomendada e `Agenda de contatos - Subetapa 9 - Implementacao minima da logica pura de filtragem`.

## 22. Commit seletivo obrigatorio
Se e somente se a etapa ficar restrita a este documento novo e, se necessario, ao roadmap:
- usar apenas `git add docs/fase_2_agenda_contatos_subetapa_8_plano_logica_pura_filtragem.md`
- se houver alteracao de roadmap, adicionar apenas `docs/11_roadmap_desenvolvimento.md`
- depois executar `git commit -m "Planeja logica pura de filtro de agenda contatos"`
- em seguida executar `git push`

