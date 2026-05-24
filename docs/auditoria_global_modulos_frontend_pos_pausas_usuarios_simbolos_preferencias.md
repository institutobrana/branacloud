# Auditoria global de módulos do frontend após as pausas de Usuários/Admin, Símbolos Gráficos e Preferências/Opções do Sistema

## 1. Objetivo da auditoria global
Consolidar, em um único registro documental, o estado real dos módulos do frontend antes de qualquer nova recomendação de modularização segura. Esta auditoria cruza:

- os arquivos existentes em `frontend/js/modules/`;
- a documentação já produzida em `docs/`;
- os trechos ainda concentrados em `frontend/app.js`;
- o que aparece em `frontend/index.html`;
- e os riscos já registrados para cada trilha.

O objetivo desta rodada não é escolher um novo módulo automaticamente, mas evitar repetir a falsa partida observada nas últimas pausas.

## 2. Estado atual após o commit `d425aa4`
Após `d425aa4 — Documenta pausa em preferencias e opcoes do sistema`, o estado consolidado é:

- `Usuários/Admin` permanece pausado porque `usersRenderAdvanced()` foi classificado como risco médio.
- `Símbolos Gráficos` permanece pausado porque `validarTipoMarcaSimbolo(valor)` já estava extraído e a integração no fluxo real subia o risco.
- `Preferências e Opções do Sistema` permanece pausado porque os helpers seguros já estavam extraídos e os remanescentes ficaram em faixa média, média/alta ou alta.
- não há código rastreado modificado;
- permanecem apenas untracked antigos fora da trilha principal, sobretudo documentos de `anamnese`, `SQLServer`, `restauração` e arquivos soltos.

## 3. Lista real dos arquivos existentes em `frontend/js/modules/`

- `anamnese.js`
- `auxiliares.js`
- `cid.js`
- `convenios-planos.js`
- `etiquetas.js`
- `intervencoes-procedimentos.js`
- `materiais.js`
- `medicamentos.js`
- `plano-contas.js`
- `preferencias-opcoes-sistema.js`
- `prestadores.js`
- `procedimentos-genericos.js`
- `simbolos-graficos.js`
- `unidades.js`
- `users-admin-modal-visual.js`

## 4. Arquivos técnicos relacionados encontrados

### 4.1. `frontend/app.js`
O arquivo ainda concentra a maior parte da superfície funcional do frontend, incluindo blocos e wrappers para:

- `users*` e o fluxo de Usuários/Admin;
- `pref*` e `sysOpt*` do módulo de Preferências e Opções do Sistema;
- `simbolos*` do módulo Símbolos Gráficos;
- `anamnese*`, `materiais*`, `pgen*`, `procedimentos*`, `prestadores*`, `unidades*`, `cid*`, `medicamentos*`, `etiquetas*`, `plano*`, `aux*`, `convPlan*`, `cc*`, `fcx*`, `dash*`, `agenda*`, `editorTextos*`, `prot*`, `ctrlProt*`, `licenca*` e `superadmin*`.

Trechos sensíveis e ainda concentrados:

- `prefColetarPayload*`, `prefCarregarDados`, `prefSalvar*`, `prefEnsureUI`, `prefAbrir`;
- `sysOptColetarPayload`, `sysOptCarregar`, `sysOptSalvar`, `sysOptAbrir`, `sysOptEnsureUI`;
- os blocos de modal, listagem, seleção e proteção de senha de Usuários/Admin;
- os fluxos de biblioteca, preview, modal e salvamento de Símbolos Gráficos;
- os fluxos de payload, seleção e integração de Procedimentos Genéricos e Intervenções/Procedimentos.

Wrappers/fallbacks já observados em `app.js`:

- `prefOdontoNorm`;
- `prefValoresPadraoModelos`;
- `prefOdontoFindByLabel`.

### 4.2. `frontend/index.html`
O HTML ainda referencia explicitamente a trilha modular e os pontos de entrada de telas, incluindo:

- o carregamento de `frontend/js/modules/preferencias-opcoes-sistema.js`;
- itens de menu para `Preferências...`, `Opções do sistema...`, `Símbolos Gráficos...`, `CID`, `Medicamentos`, `Etiquetas`, `Plano de contas`, `Materiais`, `Procedimentos genéricos` e `Intervenções/Procedimentos`;
- o botão/ação de `Preferências...` no contexto de usuários;
- os pontos de integração visual que confirmam que a superfície modular continua ligada ao `app.js`.

## 5. Mapa consolidado dos módulos encontrados

| Módulo | Arquivo modular | Documentação encontrada | Status da trilha | Helpers/funções já extraídos | Ainda concentrado em `frontend/app.js` | Risco de continuar agora | Recomendação individual |
|---|---|---|---|---|---|---|---|
| Usuários/Admin | `users-admin-modal-visual.js` | `usuarios_admin_modularizacao_subetapa_1_helpers_dom_apresentacao.md`, `usuarios_admin_modularizacao_subetapa_2_diagnostico_proximo_helper_visual.md`, `usuarios_admin_modularizacao_subetapa_3_extracao_toolbar_visual.md`, `usuarios_admin_modularizacao_subetapa_4_diagnostico_proximo_recorte.md`, `users_admin_*`, `auditoria_fina_users_*` | Iniciado e pausado | `usersOptions`, `usersPopularModalCombos`, `usersPreencherModal`, `usersSyncSenhaAtualVisibility`, `usersToggleSenhaVisibilidade`, `usersAtualizarAcoesToolbar` | Muito do fluxo de abertura, permissões, proteção de senha, estado e integrações de modal | Médio | Manter pausado; excluir temporariamente da próxima recomendação |
| Símbolos Gráficos | `simbolos-graficos.js` | `simbolos_graficos_subetapa_0_mapeamento_monolitico.md` até `..._10_fechamento_pos_validar_tipo_marca.md`, `simbolos_graficos_retomada_subetapa_0_diagnostico_validar_tipo_marca.md`, `recomendacao_proximo_modulo_pos_simbolos_graficos.md`, `reavaliacao_pos_fechamento_simbolos_graficos_proximo_modulo.md` | Iniciado e pausado | `normalizarTextoSimbolo`, `ehSimboloSistema`, `ocultarItemDaBiblioteca`, `compararBibliotecaPorCodigo`, `urlImagemSimbolo`, `validarTipoMarcaSimbolo` | Continua no `app.js` o fluxo de modal, biblioteca, preview, seleção, salvamento e integração com consumidores | Baixo no helper; baixo/médio na integração real | Manter pausado; não retomar apenas para integrar helper já extraído |
| Preferências e Opções do Sistema | `preferencias-opcoes-sistema.js` | `preferencias_opcoes_sistema_subetapa_0_mapeamento_monolitico.md` até `..._9_fechamento_reavaliacao_modulo.md`, `preferencias_opcoes_sistema_subetapa_0_diagnostico_helpers_defaults_fronteiras.md`, `recomendacao_proximo_modulo_pos_pausa_usuarios_admin.md`, `recomendacao_proximo_modulo_pos_pausa_usuarios_admin_simbolos.md` | Iniciado e pausado | `prefOdontoNorm`, `prefValoresPadraoModelos`, `prefOdontoFindByLabel` | `prefColetarPayload*`, `prefCarregarDados`, `prefSalvar*`, `prefEnsureUI`, `prefAbrir`, `sysOptColetarPayload`, `sysOptCarregar`, `sysOptSalvar`, `sysOptAbrir`, `sysOptEnsureUI`, além de contexto e defaults sensíveis | Médio, médio/alto e alto nos remanescentes | Manter pausado; os helpers seguros já saíram |
| Anamnese | `anamnese.js` | `anamnese_subetapa_0_retomada_estado_atual.md`, `anamnese_subetapa_1_documental_helpers_puros_existentes.md`, `anamnese_subetapa_2_fronteiras_contratos.md`, `anamnese_subetapa_3_*`, `anamnese_subetapa_4*`, `anamnese_subetapa_5_encerramento_ciclo_helpers_textuais.md`, `recomendacao_proximo_modulo_pos_anamnese*.md`, além de inventários e extrações `anamnese_*` | Iniciado, muito explorado e sensível | `anamneseValidarNomeQuestionario`, `anamneseValidarTextoPergunta`, helpers/documentação de candidatos futuros | Ainda há muita superfície de UI, busca, importação, contratos e integração com dados legados | Alto | Evitar como próximo módulo; não é recorte baixo risco agora |
| Auxiliares | `auxiliares.js` | `auxiliares_subetapa_0_mapeamento_monolitico.md` até `auxiliares_subetapa_5_encerramento_ciclo_helpers.md`, `auxiliares_retomada_pos_intervencoes_reavaliacao_estado_atual.md`, `recomendacao_proximo_modulo_pos_auxiliares.md` | Iniciado e praticamente consolidado | `auxTipoEh`, `auxNormalizarHexCor`, `auxCorrigirMojibake`, `auxCorApresentacao*` | Restos de integração e chamadas utilitárias em `app.js` | Baixo a médio, mas sem sinal de nova trilha realmente necessária | Parece mais esgotado do que candidato novo |
| CID | `cid.js` | `cid_subetapa_0_mapeamento_monolitico.md` até `cid_subetapa_5_encerramento_ciclo_helpers.md`, `cid_correcao_duplo_clique_checkbox_modal.md`, `varredura_proximo_modulo_pos_cid.md` | Iniciado e aparentemente encerrado | `normalizarCodigoCid`, `validarCodigoCid`, `validarDescricaoCid`, `montarPayloadCid`, `compararTextoCid` | Parte de fluxo de tela e integrações de tabela ainda aparece no `app.js` | Baixo a médio, já muito maduro | Não parece o próximo módulo; trilha já bem estabilizada |
| Convênios e Planos | `convenios-planos.js` | `convenios_planos_subetapa_0_mapeamento_monolitico.md` até `convenios_planos_subetapa_13_fechamento_mini_ciclo_recomendacao_proximo_modulo.md`, `convenios_planos_auditoria_correcao_textos_nao_aplicada.md`, `frontend_correcao_convenios_duplo_clique.md`, `recomendacao_proximo_modulo_pos_convenios_planos.md` | Iniciado, com mini ciclo documental amplo | `normalizeText`, `normalizarNomeConvenio`, `validarNomeConvenio`, `normalizarNomePlano`, `validarNomePlano`, `normalizarCodigoRegistro` | Fluxos de formulário, calendário, duplo clique e salvamento ainda estão no `app.js` | Médio | Não é candidato novo “limpo”; já foi bastante trabalhado |
| Etiquetas | `etiquetas.js` | `etiquetas_subetapa_0_mapeamento_monolitico.md` até `etiquetas_subetapa_5_encerramento_ciclo_helpers.md`, `clinica_8_exclusao_segura_etapa_8b_auditoria_etiqueta_modelo.md`, `recomendacao_proximo_modulo_pos_etiquetas.md` | Iniciado e muito documentado | `normalizeNumber`, `formatNumber`, `layoutFromItem`, `etqNumero`, `etqFormatNumero`, `etqLayoutFromItem` | Parte de layout e fluxos de uso ainda permanece no `app.js` | Médio | Sem justificativa para ser escolhido agora |
| Intervenções / Procedimentos | `intervencoes-procedimentos.js` | `intervencoes_procedimentos_subetapa_0_mapeamento_monolitico.md` até `intervencoes_procedimentos_subetapa_2o_fechamento_reavaliacao_modulo.md`, `intervencoes_procedimentos_subetapa_b1_*`, `intervencoes_procedimentos_subetapa_b2*`, `intervencoes_procedimentos_retomada_pos_prestadores_estado_atual.md`, `recomendacao_proximo_modulo_pos_intervencoes_*.md` | Iniciado, amplo e sensível | `procParse`, `procFmtBr`, `procFmtAuxLabel`, `procFmtSimboloLabel`, `procIndiceSiglaFromValor`, além de `pgen`-adjacências documentais | Muito conteúdo de seleção, tabela, materiais vinculados e payload ainda concentrado | Médio/alto | Evitar agora; forte dependência de fluxos e dados sensíveis |
| Materiais | `materiais.js` | `materiais_subetapa_0_mapeamento_monolitico.md` até `materiais_subetapa_6_consolidacao_pos_integracao.md`, `materiais_mapa_extracao_funcoes_pos_vinculos.md`, `retomada_modularizacao_materiais_pos_consolidacao_vinculos.md`, `recomendacao_proximo_modulo_pos_materiais.md` | Iniciado, com trilha ampla e recorrente | `materiaisUniqueAuxDescricoes` | Ainda existem vínculos, origem de dados e integrações de generico/procedimento no `app.js` | Médio | Não é módulo novo; é trilha já bastante explorada |
| Medicamentos | `medicamentos.js` | `medicamentos_subetapa_0_mapeamento_monolitico.md` até `medicamentos_subetapa_5_encerramento_ciclo_helpers.md`, `medicamentos_fechamento_reavaliacao_proximo_modulo.md` | Iniciado e praticamente consolidado | `normalizarTextoMedicamento`, `validarNomeMedicamento`, `validarGrupoMedicamento`, `compararTextoMedicamento` | Ainda existe integração de listagem/seleção no `app.js` | Baixo a médio | Não parece melhor candidato novo |
| Plano de Contas | `plano-contas.js` | `plano_contas_subetapa_0_mapeamento_monolitico.md` até `plano_contas_subetapa_5_encerramento_ciclo_helpers.md`, `plano_contas_diagnostico_400_teste_manual_pre_commit.md`, `varredura_proximo_modulo_pos_plano_contas.md` | Iniciado e bem mapeado | `validarNomeGrupo`, `validarNomeCategoria`, `montarPayloadGrupo`, `montarPayloadCategoria` | Formulários e montagem de payload ainda vivem no `app.js` | Médio | Evitar por ora; não é recorte trivial |
| Prestadores | `prestadores.js` | `prestadores_subetapa_0_mapeamento_monolitico.md` até `prestadores_subetapa_8_reavaliacao_pos_prest_status_html.md`, `prestadores_retomada_pos_varredura_parciais_estado_atual.md`, `recomendacao_proximo_modulo_pos_prestadores*.md` | Iniciado, reavaliado e bastante documentado | `prestFmtCodigo`, `prestStatusHtml` | Ainda há fluxo de cadastro/listagem no `app.js` | Médio | Poderia ter recorte pequeno, mas não é novo nem claramente baixo risco |
| Procedimentos Genéricos | `procedimentos-genericos.js` | `procedimentos_genericos_subetapa_0_mapeamento_monolitico.md` até `procedimentos_genericos_subetapa_5b_fixtures_payload_pgenpayloadfromstate.md`, `procedimentos_genericos_correcao_valores_monetarios_dependencias.md`, `recomendacao_proximo_modulo_pos_procedimentos_genericos.md` | Iniciado, ativo e sensível | `pgenStatusDot` e documentação de `helpersExtraidos` | `pgenPayloadFromState(state)` e fluxos de formulário/seleção ainda têm peso no `app.js` | Médio/alto | Evitar agora; integração com payload sobe o risco |
| Unidades | `unidades.js` | `unidades_subetapa_0_mapeamento_monolitico.md` até `unidades_subetapa_8_encerramento_ciclo_helpers.md`, `unidades_diagnostico_duplo_clique_subetapa_1.md`, `unidades_correcao_duplo_clique_subetapa_1.md`, `recomendacao_proximo_modulo_pos_*` correlatos | Iniciado e muito avançado | `fmtCodigo`, `statusHtml`, `telefonePadrao` | Parte de cadastro/duplo clique ainda aparece no `app.js` | Baixo a médio | Mais próximo de encerrado do que de novo início |
| Módulo visual de Usuários | `users-admin-modal-visual.js` | Já contemplado nos docs de Usuários/Admin | Iniciado e pausado | Visual e combos do modal | Parte central de `Users/Admin` ainda está no `app.js` | Médio | Excluído da recomendação imediata |

## 6. Módulos já pausados e motivo

- `Usuários/Admin`: pausado porque o próximo candidato `usersRenderAdvanced()` foi classificado como risco médio.
- `Símbolos Gráficos`: pausado porque `validarTipoMarcaSimbolo(valor)` já estava extraído em módulo próprio.
- `Preferências e Opções do Sistema`: pausado porque os helpers seguros já saíram e os remanescentes sobem para médio, médio/alto ou alto.

## 7. Módulos já iniciados anteriormente

Os módulos abaixo já têm trilha modular/documental iniciada:

- `Usuários/Admin`
- `Símbolos Gráficos`
- `Preferências e Opções do Sistema`
- `Anamnese`
- `Auxiliares`
- `CID`
- `Convênios e Planos`
- `Etiquetas`
- `Intervenções / Procedimentos`
- `Materiais`
- `Medicamentos`
- `Plano de Contas`
- `Prestadores`
- `Procedimentos Genéricos`
- `Unidades`

## 8. Módulos aparentemente encerrados ou esgotados

Os módulos abaixo parecem já ter passado por um ciclo suficientemente amplo de helpers/documentação, sem sinal claro de um recorte novo de baixo risco para esta rodada:

- `Auxiliares`
- `CID`
- `Medicamentos`
- `Etiquetas`
- `Plano de Contas`
- `Unidades`
- parte relevante de `Prestadores`
- parte relevante de `Convênios e Planos`

## 9. Módulos ainda não iniciados

Nesta auditoria global não foi confirmado nenhum módulo realmente “novo” e seguro que estivesse fora de qualquer trilha prévia. Os candidatos citados no frontend e nos docs já aparecem com documentação, histórico de extrações, reavaliações ou retomadas.

## 10. Módulos que ainda poderiam ter recorte baixo risco

Como hipótese documental, ainda poderiam existir recortes menores em:

- `Prestadores`
- `Unidades`
- `Auxiliares`
- `CID`

Mas, nesta auditoria, esses módulos já se mostram muito avançados ou próximos de encerramento, então não são candidatos fortes para iniciar uma nova trilha.

## 11. Módulos que devem ser evitados agora por risco médio ou alto

- `Usuários/Admin`
- `Símbolos Gráficos`
- `Preferências e Opções do Sistema`
- `Anamnese`
- `Intervenções / Procedimentos`
- `Procedimentos Genéricos`
- `Materiais`
- `Convênios e Planos`
- `Plano de Contas`
- `Etiquetas`

Motivo geral: esses módulos ainda concentram fluxo visual complexo, payload, salvamento, dependências de dados, permissões, integração com consumidores externos ou remanescentes sensíveis de `app.js`.

## 12. Próximo módulo recomendado
Não há, nesta auditoria, um próximo módulo realmente novo e baixo risco que justifique uma nova recomendação de modulação segura.

## 13. Se não houver candidato baixo risco
A recomendação é pausar a escolha imediata de módulo e fazer uma nova estratégia de auditoria antes de avançar, por exemplo:

- auditoria por eixo de consumo;
- auditoria por contrato de UI;
- auditoria por dependências externas;
- ou nova varredura documental para confirmar se algum recorte pequeno realmente restou.

## 14. Primeira subetapa recomendada
Não há nova subetapa recomendada para iniciar agora.

## 15. O que deve ficar fora da próxima subetapa
Se uma nova trilha for aberta depois, o primeiro recorte deve ficar longe de:

- payload;
- salvamento;
- backend;
- banco;
- seeds;
- permissões;
- login;
- senha interna;
- dados persistidos;
- integrações com consumidores externos;
- e qualquer comportamento que já tenha histórico de risco.

## 16. O que deve entrar em commit depois desta etapa documental
Se esta auditoria for versionada, o commit deve conter apenas este documento documental, sem qualquer alteração de código, HTML, backend, banco, seeds ou roadmap.

## 17. O que deve entrar no roadmap se uma nova trilha for iniciada
O roadmap deve registrar explicitamente:

- o módulo escolhido;
- o recorte exato;
- os helpers já extraídos;
- os pontos proibidos da primeira subetapa;
- e os testes manuais mínimos depois de qualquer futura alteração.

## 18. Onde testar depois de uma futura alteração de código
Depende do módulo escolhido, mas o roteiro mínimo de validação deve incluir:

- abrir a tela ou modal do módulo;
- conferir renderização e estados visuais;
- verificar console sem erros;
- validar a função/helper extraído;
- e, se houver, checar comportamento de salvar/excluir somente após a etapa documental aprovar esse risco.

## 19. Conclusão
Esta auditoria consolida o ponto principal da trilha atual: os três módulos temporariamente pausados já tinham histórico suficiente para não serem retomados agora, e os demais módulos do frontend já estão iniciados, avançados ou sensíveis demais para virar a “próxima aposta” sem uma nova estratégia de leitura do sistema.

Portanto, a decisão mais segura nesta rodada é **não avançar para um novo módulo** até que uma nova varredura documental confirme um recorte realmente baixo risco.
