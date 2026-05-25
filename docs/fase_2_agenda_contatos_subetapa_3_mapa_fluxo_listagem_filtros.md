# Fase 2 - Agenda de contatos - Subetapa 3 - Mapa documental do fluxo de listagem, filtros e carregamento de apoio

## 1. Contexto
Esta etapa continua documentalmente o modulo `Agenda de contatos` dentro da Fase 2 de modularizacao/refatoracao do frontend.

O foco agora e mapear com precisao apenas o fluxo de menor risco:

- abertura da tela;
- carregamento da lista;
- filtros locais;
- renderizacao da grade/lista;
- atualizacao do filtro de tipos;
- carregamento de tipos;
- carregamento de especialidades;
- carregamento de auxiliares.

Diretriz registrada nesta etapa:

- `Agenda de contatos` deve ser tratada como `core / comum`;
- nao implementar multiarea;
- nao criar flags multiarea;
- nao separar comportamento por area profissional.

## 2. Documentos consultados
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_agenda_contatos_subetapa_1_contrato_funcional_fronteiras.md`
- `docs/fase_2_agenda_contatos_subetapa_2_mapa_dependencias_tenant.md`
- `docs/fase_2_reavaliacao_modulos_frontend_sem_modularizacao.md`
- `docs/auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 3. Confirmacao do commit anterior
Confirmado:

- `443f6bee621e38b7e3a74ac9a2ada4669cbcf761` - `Mapeia dependencias de agenda contatos`

Esse commit permanece valido e nao e reescrito por esta etapa.

## 4. Diretriz core/comum
Nesta frente, `Agenda de contatos` continua tratada como modulo `core / comum`.

Regras de conducao:

- nao implementar multiarea;
- nao criar flags multiarea;
- nao separar comportamento por area profissional;
- nao usar classificacao por area como criterio de conducao;
- nao alterar comportamento nesta etapa.

## 5. Fluxo esperado de abertura/listagem
Sequencia observada ao abrir `Agenda de contatos`:

1. `agendaContatosAbrir()`
2. `agendaContatosEnsureUI()`
3. `agendaContatosVincularEventos()`
4. `hideAllPanels()`
5. `ensurePanelChrome(agendaContatos.panel)`
6. exibe o painel `agendaContatos.panel`
7. esconde `workspaceEmpty`
8. `agendaContatosCarregarTipos()`
9. `agendaContatosCarregarEspecialidades()`
10. `agendaContatosCarregarAuxiliares()`
11. `agendaContatosCarregar()`
12. `agendaContatosRender()`

## 6. Funcoes candidatas de baixo risco para estudo
Funcoes com menor risco, porque atuam no fluxo de leitura/listagem/filtro/renderizacao:

- `agendaContatosFiltrar`
- `agendaContatosTelefonesTexto`
- `agendaContatosAtualizarFiltroTipos`
- `agendaContatosCarregarTipos`
- `agendaContatosCarregarEspecialidades`
- `agendaContatosCarregarAuxiliares`
- `agendaContatosCarregar`
- `agendaContatosRender`

Funcoes de apoio visual que podem ser lidas, mas ainda nao devem ser foco de extracao:

- `agendaContatosSelecionarLinha`
- `agendaContatosNode`
- `agendaContatosOption`
- `agendaContatosSelect`
- `agendaContatosField`
- `agendaContatosBuildPhoneRow`
- `agendaContatosGarantirAbaDetalhes`
- `agendaContatosReconstruirModalBody`
- `agendaContatosEnsureUI`
- `agendaContatosSetTab`

## 7. Funcoes proibidas para o primeiro recorte
Ficam fora do primeiro recorte por tocar modal, salvamento, exclusao, payload ou vinculo:

- `agendaContatosPreencherModal`
- `agendaContatosAbrirModal`
- `agendaContatosFecharModal`
- `agendaContatosMontarPayload`
- `agendaContatosSalvarModal`
- `agendaContatosExcluir`
- `agendaContatosVincularEventos`

Tambem ficam fora por serem entrada geral que aciona a UI completa:

- `agendaContatosAbrir`

## 8. Variaveis globais/cache lidas
No fluxo de abertura/listagem/filtro/renderizacao, as variaveis lidas sao:

- `agendaContatos`
- `agendaContatosCache`
- `agendaContatosTiposCache`
- `agendaContatosEspecialidadesCache`
- `agendaContatosSelId`

Leituras adicionais relevantes:

- `agendaContatos.panel`
- `agendaContatos.tbody`
- `agendaContatos.total`
- `agendaContatos.filtro`
- `agendaContatos.busca`
- `agendaContatos.tipo`
- `agendaContatos.especialidade`

## 9. Variaveis globais/cache escritas
No fluxo de abertura/listagem/filtro/renderizacao, as variaveis escritas sao:

- `agendaContatosTiposCache`
- `agendaContatosEspecialidadesCache`
- `agendaContatosCache`
- `agendaContatosSelId`

Escritas de apoio no DOM associadas ao fluxo:

- `agendaContatos.filtro.innerHTML`
- `agendaContatos.tipo.innerHTML`
- `agendaContatos.tbody.innerHTML`
- `agendaContatos.total.textContent`
- `agendaContatos.especialidade.innerHTML`

## 10. Chamadas `requestJson` e endpoints somente leitura
Chamadas de leitura encontradas no fluxo:

- `GET /cadastros/auxiliares?tipo=Tipos de contato` em `agendaContatosCarregarTipos`
- `GET /procedimentos/filtros` em `agendaContatosCarregarEspecialidades`
- `GET /cadastros/auxiliares?tipo=Bairro` em `agendaContatosCarregarAuxiliares`
- `GET /cadastros/auxiliares?tipo=Cidade` em `agendaContatosCarregarAuxiliares`
- `GET /cadastros/auxiliares?tipo=Palavra chave` em `agendaContatosCarregarAuxiliares`
- `GET /cadastros/auxiliares?tipo=Tipos de contato` em `agendaContatosCarregarAuxiliares`
- `GET /agenda-contatos` em `agendaContatosCarregar`

Endpoints somente leitura que alimentam este fluxo:

- `/cadastros/auxiliares`
- `/procedimentos/filtros`
- `/agenda-contatos`

## 11. Partes puramente visuais
Partes lidas como puramente visuais ou de apresentação:

- `agendaContatosNode`
- `agendaContatosOption`
- `agendaContatosSelect`
- `agendaContatosField`
- `agendaContatosBuildPhoneRow`
- `agendaContatosGarantirAbaDetalhes`
- `agendaContatosReconstruirModalBody`
- `agendaContatosEnsureUI`
- `agendaContatosAtualizarFiltroTipos`
- `agendaContatosRender`
- `agendaContatosSetTab`
- `agendaContatosSelecionarLinha`
- `agendaContatosTelefonesTexto`

## 12. Partes acopladas demais
Partes que ainda estao acopladas demais para extracao imediata:

- `agendaContatosAbrir`, porque orquestra UI, eventos e carregamentos;
- `agendaContatosVincularEventos`, porque mistura bind de DOM, selecao, modal e botoes de acao;
- `agendaContatosPreencherModal`, porque depende de campos da UI que pertencem ao ciclo de edicao;
- `agendaContatosMontarPayload`, porque ja entra no fluxo de persistencia, fora do recorte atual;
- `agendaContatosSalvarModal` e `agendaContatosExcluir`, porque ja executam alteracoes;
- `agendaContatos` como objeto de contexto, porque concentra referencias de DOM e estado da tela.

## 13. Menor recorte funcional futuro possivel, como hipotese documental
Hipotese mais conservadora para um patch futuro:

- `agendaContatosFiltrar`
- `agendaContatosTelefonesTexto`
- `agendaContatosAtualizarFiltroTipos`
- `agendaContatosRender`

Hipotese um pouco mais ampla, ainda sem tocar CRUD:

- `agendaContatosFiltrar`
- `agendaContatosTelefonesTexto`
- `agendaContatosAtualizarFiltroTipos`
- `agendaContatosCarregarTipos`
- `agendaContatosCarregarEspecialidades`
- `agendaContatosCarregarAuxiliares`
- `agendaContatosCarregar`
- `agendaContatosRender`

## 14. Funcoes que devem permanecer em `frontend/app.js` no primeiro patch
Para o primeiro patch, devem permanecer em `frontend/app.js`:

- `agendaContatosAbrir`
- `agendaContatosVincularEventos`
- `agendaContatosPreencherModal`
- `agendaContatosAbrirModal`
- `agendaContatosFecharModal`
- `agendaContatosMontarPayload`
- `agendaContatosSalvarModal`
- `agendaContatosExcluir`
- `agendaContatosSelecionarLinha`
- `agendaContatosBuildPhoneRow`
- `agendaContatosField`
- `agendaContatosSelect`
- `agendaContatosOption`
- `agendaContatosNode`

Motivo:

- sao funcoes mais dependentes do DOM, da UI completa, de modal ou de alteracao de dados;
- ainda estao misturadas com o contexto geral da tela e nao sao parte do recorte de leitura pura.

## 15. Onde testar futuramente quando houver alteracao real
Quando houver alteracao real, testar futuramente:

- abrir `Agenda de contatos`;
- confirmar que a lista carrega;
- confirmar que o filtro por texto continua funcionando;
- confirmar que o filtro de tipos continua preenchido;
- confirmar que os selects de apoio continuam carregando;
- abrir `Agenda` e confirmar que a agenda maior continua intacta;
- abrir `Agenda legado` e confirmar que o preenchimento por contatos continua funcionando;
- confirmar ausencia de `ReferenceError`, `TypeError` e regressao de DOM;
- confirmar que nenhuma permissao foi alterada.

## 16. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nao houve correcao textual, acentuacao, label, placeholder, string visivel ou mojibake.

Se algum texto estranho ou acento incorreto aparecer nos arquivos lidos, ele deve ser tratado apenas como pendencia futura, sem correcao nesta etapa.

## 17. Registro para roadmap
- A Subetapa 3 de `Agenda de contatos` foi criada documentalmente.
- O fluxo de listagem, filtros e carregamento de apoio foi mapeado.
- O modulo continua tratado como `core / comum`.
- Nenhum codigo foi alterado.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- O menor recorte futuro possivel foi registrado como hipotese documental.
- A proxima subetapa recomendada e `Agenda de contatos - Subetapa 4 - Mapa documental do carregamento de apoio visual e fronteiras de UI` .

## 18. Commit seletivo obrigatorio
Se esta etapa permanecer restrita a este documento e, se necessario, ao roadmap, o commit deve ser seletivo.

Nao usar:

- `git add .`
- `git add docs/`
- qualquer forma de selecao ampla de arquivos

Usar apenas:

- `git add docs/fase_2_agenda_contatos_subetapa_3_mapa_fluxo_listagem_filtros.md`
- se alterado, `git add docs/11_roadmap_desenvolvimento.md`

Depois:

- `git commit -m "Mapeia fluxo de listagem de agenda contatos"`
- `git push`

