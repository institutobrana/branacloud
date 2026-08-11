ï¿½# COMO USAR ESTE ARQUIVO

Este documento representa o estado atual de desenvolvimento do sistema.

Sempre que um mÃ³dulo for alterado:

* Atualizar as fases
* Atualizar o prÃ³ximo passo
* Atualizar observaÃ§Ãµes

Nenhuma funcionalidade Ã© considerada concluÃ­da sem atualizaÃ§Ã£o deste arquivo.

Este arquivo deve ser consultado antes de iniciar qualquer nova tarefa.

---
# 11 - Roadmap de Desenvolvimento

## Objetivo

Este documento registra o estado atual dos modulos do Brana Cloude com base no codigo existente em `backend/` e `frontend/`. Ele nao substitui o codigo como fonte da verdade; serve como mapa operacional para desenvolvedores e IAs entenderem o que ja existe, o que esta pendente e qual deve ser o proximo passo.

## Legenda

- `CONCLUIDO`: fluxo implementado e sem pendencia critica conhecida nesta auditoria.
- `EM DESENVOLVIMENTO`: existe implementacao funcional, mas ha pendencias de teste, modularizacao, migration, hardening ou acabamento.
- `NAO INICIADO`: nao foi encontrada implementacao suficiente no codigo atual.

Observacao: pela ausencia de migrations formais e testes automatizados amplos, a maioria dos modulos deve ser tratada como `EM DESENVOLVIMENTO`, mesmo quando ja possui backend e frontend operantes.

- A frente `Configuracoes > Simbolos graficos` foi concluida no frontend React, com listagem, selecao, `Novo`, `Altera`, `Elimina`, editor grafico 24x24, biblioteca, previews, `Recarregar`, `Salvar como`, `Cancela`, validacoes, runtime e testes/build aprovados; o contrato funcional e o plano de implementacao foram atualizados para refletir o estado final validado.
- A frente `Unidades de atendimento` teve a Etapa 1 do frontend React concluida com fundacao modular, rota, shell, listagem, inclusao e alteracao; a exclusao funcional passou a existir apenas de forma protegida, com contrato e testes dedicados, e os documentos de base seguem em `docs/auditoria_unidades_atendimento_brana_easydental.md` e `docs/contrato_implementacao_unidades_atendimento_frontend_react.md`.
- A auditoria corretiva da Etapa 1.1 fechou o contrato de `ativo`/`inativo`, confirmou a preservacao de `qtd_sala` no PUT, identificou os registros de teste locais e isolou o `404` de `favicon.ico` como recurso global, sem alterar backend, banco ou regras de exclusao.
- A auditoria da Etapa 2 concluiu que o `DELETE /cadastros/unidades-atendimento/{row_id}` era fisico e sem protecao suficiente; a etapa seguinte consolidou a protecao por unidade principal, ultima unidade, usuarios, agenda, bloqueios e tratamentos antes da liberacao no frontend.
- A frente `Tabelas -> Doencas (CID)` teve sua primeira fatia React de leitura iniciada, com rota, menu e listagem basal em andamento; CRUD de escrita, modal e validacao autenticada completa ainda permanecem pendentes.
- A primeira validacao autenticada da fatia somente leitura do CID foi concluida no novo frontend React, com login real, rota `/app/tabelas/doencas-cid` ativa e `GET /cid` observado; a etapa de CRUD segue pendente.
- A listagem do CID passou por paginação local para reduzir o DOM de milhares de linhas para cerca de 50 por página, preservando filtros, selecao e modal sem alterar backend ou banco.
- A validacao runtime posterior confirmou a paginação local no navegador, com pagina principal carregando cerca de 50 linhas visiveis, troca de pagina sem nova chamada HTTP e modal abrindo/fechando sem congelamento perceptivel.
- A etapa seguinte validou inclusao e alteracao reais com registro de teste unico `CID-ZZ-20260714`, incluindo validacao frontend, `POST /cid`, `PUT /cid/{id}`, recarga da lista, selecao coerente e modal retornando ao estado limpo apos cancelar.
- O CRUD de CID permanece em desenvolvimento, mas agora com fluxo de inclusao e edicao autenticado validado em navegador local, sem backend, banco ou migration nova.
- A barra horizontal do CID foi compactada nesta etapa, com remocao dos campos duplicados de busca da toolbar e preservacao dos filtros apenas nos cabecalhos de coluna.
- A exclusao segura do CID foi implementada e validada com o registro de teste `CID-ZZ-20260714` / `15638756`, usando confirmacao React e `DELETE /cid/{id}` sem regressao aparente em filtros, selecao ou paginação.
- O modal `Nova doença` do CID foi compactado visualmente, com Código e Doença na mesma linha, Observações abaixo e checkbox em sequência, sem alterar payload, validações ou API.
- A etapa visual seguinte do CID ajustou o modal `Nova doença` para ficar mais legivel no layout real, com titulo/espacamento refinados e o shell lateral/topbar mantido em encaixe continuo de canto, sem tocar em backend, filtros, paginação ou permissões.
- Na validacao posterior de continuidade da exclusao, o registro tecnico `CID-ZZ-20260714` / `15638756` nao foi mais localizado na listagem autenticada do CID; por isso nenhuma exclusao adicional foi executada nesta passagem e a frente permanece com a exclusao tecnica ja concluida em rodada anterior.
- Em nova rodada controlada de teste, um registro tecnico temporario foi criado pelo fluxo real de inclusao, recebeu validacao de Cancelar, X e Escape no modal de exclusao e foi removido com um unico `DELETE`, deixando a listagem sem residuos tecnicos ao final da passagem.
- A validacao integrada final do CID foi consolidada em `docs/validacao_final_doencas_cid_frontend_react.md`, com shell, tabela, paginação, busca, filtros, selecao, duplo clique, modais, desempenho, responsividade e inventario da frente revisados para preparacao de commit seletivo.

## Estado validado recente

- Em `2026-07-18`, a migracao integral do banco local para o RDS de homologacao foi concluida com snapshot pre-corte, dump `pg_dump -Fc`, restore por task ECS one-shot e smoke funcional no backend publico.
- A validacao read-only posterior registrou `65` tabelas publicas, `tiss_tipo_atendimento = 5`, `clinicas = 4`, `usuarios = 14`, `pacientes = 1629` e `brana_schema_versions = 1`.
- O diretorio local `storage/modelos/clinicas/` permanece com 260 arquivos e segue para a frente separada de persistencia externa.
- O endpoint publico respondeu `GET /health = 200`, `GET /app = 200`, `GET /frontend/ = 200`, `POST /auth/renew = 401`, `POST /login = 200` e `GET /me = 200` para a credencial funcional conhecida `gleissontel@gmail.com`.
- A protecao backend minima dos seis grupos nativos do Plano de contas foi concluida, com regra centralizada, bloqueio por nome normalizado e testes backend dedicados; o reforco visual no React e no legado continua pendente.
- O reforco defensivo no frontend React do Plano de contas foi aplicado nesta etapa, com reconhecimento dos seis grupos protegidos no hook, bloqueio do evento de exclusao de grupo protegido no shell, tooltip explicativa e confirmacao separada para exclusao de grupo comum, sem alterar o fluxo de categorias; a validacao autenticada em navegador confirmou o bloqueio dos seis grupos nativos e a alternancia de tema sem regressao visivel.
- A solucao estrutural com chave estavel e migration segue como trabalho futuro separado.
- A frente de blindagem dos seis grupos nativos do Plano de contas foi aberta para auditoria documental e tecnica focada; o trabalho atual ficou restrito a leitura, comparacao de evidencias e proposta de contrato, sem implementacao.
- A blindagem ainda nao foi implementada e permanece pendente de decisao estrutural.
- A frente `Tabelas -> Servicos de protetico` concluiu a listagem, o fluxo `Novo servico`, a etapa funcional `Altera`, a confirmacao `Elimina` com botões `Nao` e `Sim`, e `Imprime` no novo frontend React, com rota, shell, toolbar, combo de protetico, leitura de proteticos e servicos, filtros por coluna, ordenacao, visibilidade de colunas, selecao, duplo clique, rodape integrado, contador, modal compacto, salvamento e runtime validados; a frente passou para estado de encerramento e consolidacao final.
- A etapa de backend/banco de `Tabelas -> Servicos de protetico` foi fechada com `codigo` e `descricao` no modelo, na rota e no script aditivo; o backfill local de `codigo` foi aplicado com sucesso e o contrato React de `Novo servico` foi validado.
- Login, senha interna e perfis: validado manualmente.
- Validacao runtime do backend de Orcamento concluida com login real em `POST /login` usando `gleissontel@gmail.com` e validacao dos endpoints principais `GET /orcamento/pacientes/1/tratamentos`, `GET /orcamento/tratamentos/1` e `POST /orcamento/tratamentos/1/impressao`.
- Hotfix de acesso do usuario `gleissontel@gmail.com` executado e validado com login real; o login global do sistema continuou funcional e a trilha de Tratamento permanece pausada ate o aceite final desta restauracao.
- Revalidacao runtime posterior detectou que o login de `gleissontel@gmail.com` voltou a responder `400` no momento da checagem, impedindo a observacao do fluxo `Tratamento -> Novo tratamento`; o novo documento de runtime foi registrado em `docs/revalidacao_runtime_pos_rollback_novo_tratamento.md`.
- A janela `Novo tratamento` foi revalidada em runtime com paciente em uso e carregamento real do endpoint `GET /tratamentos/novo/combos`; a modal abriu com os campos principais preenchidos e sem persistencia.
- Os campos de data do modal `Novo tratamento` passaram a exibir e aceitar datas em `DD/MM/AAAA`, com validacao local e calendario popup, e `Finalizacao` agora recebe a data vigente quando a `Situacao` vira `Finalizado`, sem mudar o contrato de persistencia.
- O combo `Cirurgiao responsavel` do modal `Novo tratamento` passou a carregar prestadores ativos da clinica no endpoint de combos, com selecao preferencial do prestador vinculado ao usuario atual; a aba `Convenio` passou a usar o mesmo catalogo para `Cirurgiao contratado`, `Solicitante` e `Executante`; a validacao runtime mostrou `Agenda - TLMK`, `Butarelo`, `Clï¿½nica` e `Tel` na clinica 1.
- O combo `Tabela principal` do modal `Novo tratamento` passou a respeitar a preferencia salva em `Preferï¿½ncias > Geral > Tabela de intervenï¿½ï¿½es padrï¿½o para novos cadastros`, mantendo a lista completa de tabelas e caindo para `PARTICULAR` quando a preferencia estiver ausente ou invalida.
- A frente `Tabelas -> Procedimentos` teve a sincronizacao operacional da tabela `PARTICULAR` reaberta em leitura somente leitura no SQL Server legado: `NROTAB=10`, `336` registros, snapshot e preview gerados sem escrita, comparacao consolidada por codigo e apply ainda bloqueado.
- A validacao da heranca do Procedimento generico no modal de Procedimentos do novo frontend React foi concluida em modo de auditoria; o React foi confirmado como dependente do backend para aplicar a heranca e nenhuma nova regra local foi criada.
- O preview financeiro de `Tabelas -> Procedimentos` foi corrigido para usar `POST /procedimentos/dashboard-preview` com a formula oficial do backend, removendo o motor financeiro local provisório do React e encerrando o contorno por `GET /cenario` na feature.
- A microetapa subsequente ajustou o React para tratar `herdado` apenas como estado transitório antes do save, removendo o bloqueio permanente de edição/desvinculação e o badge persistente após save/reopen; a recomposição e a deduplicação permanecem ativas.
- O combo `Unidade de atendimento` do modal `Novo tratamento` passou a listar apenas unidades ativas do cadastro de `Unidade de atendimento`, com selecao preferencial da unidade vinculada ao usuario atual e fallback para a primeira unidade ativa.
- Os campos `Inclusao` e `Alteracao` do modal `Novo tratamento` agora abrem vazios; a primeira gravacao preenche `Inclusao` com `DD/MM/AAAA - apelido` e gravacoes posteriores do mesmo tratamento preenchem `Alteracao` com a nova data e apelido, preservando a `Inclusao`.
- O combo `Tipo de atendimento (TISS)` da aba `Convenio` do modal `Novo tratamento` passou a usar um catalogo proprio aditivo no backend, com os cinco itens do EasyDental, mantendo `payload.tipos_tiss` para o frontend e preservando a reabertura do tratamento com o valor salvo.
- Signup com Brana: validado manualmente.
- Brana nasce com seed canonico proprio de 336 procedimentos.
- Tabela exemplo permanece separada.
- PARTICULAR fica restrito a contas antigas.
- Exclusoes seguras das clinicas de teste 8, 9, 10 e 15 foram documentadas e executadas.
- Auditoria documental geral concluida.
- Validacao manual da nova conta apos 8P, 8K, 8R e 8S registrada na Subetapa 8T.
- A Subetapa 8T-B complementou a 8T com comparacao direta no EasyDental virgem, confirmando o contrato revisado de usuario ADM, prestador ADM/Mestre funcional e setup apenas para o ADM inicial.
- A Subetapa 8T-C confirmou diretamente no UNC principal `\\Sonyvaio\c\EDS70` os achados da 8T-B, reforcando o contrato de usuario ADM, prestador, unidade e setup antes da 8U.
- A Subetapa 8U ajustou o nascimento do usuario ADM inicial para `Dentista (CD)`, com vinculo ao prestador ADM/Mestre funcional e a unidade Principal / 0001.
- A Subetapa 8U-B executou a exclusao segura da clinica 12 para liberar `institutobrana@gmail.com`, com backup/export, dry-run e remocao confirmada apos validacao por banco.
- A Subetapa 8V-A auditou o setup para usuarios criados posteriormente e confirmou que o gatilho atual esta no `setup_completed` do proprio usuario.
- A Subetapa 8V-B implementou a menor correcao segura para que usuarios criados posteriormente nascam com `setup_completed = True`.
- O contrato tecnico preliminar do modulo Tratamento foi registrado em `docs/contrato_tecnico_modulo_tratamento.md`, e o contrato complementar de layout/comportamento da tela `Novo tratamento` foi criado em `docs/contrato_layout_comportamento_tela_novo_tratamento.md`; nenhuma implementacao foi feita nesta etapa.
- O contrato tecnico da extracao segura da tela principal e da faixa de paciente foi registrado em `docs/contrato_tecnico_extracao_tela_principal_paciente_em_uso.md`; o documento separa a responsabilidade da faixa de paciente do monolito, reaproveita o lookup existente por codigo de paciente e ainda nao autoriza implementacao.
- O inventario operacional da extracao da tela principal e da faixa de paciente foi registrado em `docs/inventario_extracao_tela_principal_paciente_em_uso.md`; o documento separa o que fica no monolito, o que pode ser encapsulado e quais ondas de corte devem ser seguidas antes de qualquer implementacao.
- O contrato de implementacao da Onda 1 da extracao da tela principal e da faixa de paciente foi registrado em `docs/contrato_implementacao_onda1_tela_principal_paciente_em_uso.md`; o documento define `frontend/js/modules/prontuario.js` como modulo alvo, preserva `frontend/js/modules/paciente-em-uso-header.js` como motor visual temporario, reutiliza a rota existente de lookup por codigo e nao autoriza backend novo nesta onda.
- A ordem de execucao da Onda 1 da extracao da tela principal e da faixa de paciente foi registrada em `docs/onda1_tela_principal_paciente_em_uso_ordem_execucao.md`; o documento quebra a onda em subetapas pequenas com teste esperado em cada passo e reforca que nenhuma implementacao deve ocorrer sem validacao entre etapas.
- O checklist operacional da Subetapa 1 da Onda 1 da extracao da tela principal e da faixa de paciente foi registrado em `docs/onda1_tela_principal_paciente_em_uso_subetapa_1_checklist_operacional.md`; o documento separa preparacao, criacao do modulo novo, integracao minima no shell e validacao funcional minima antes de passar para a proxima subetapa.
- O checklist operacional das Subetapas 2 e 3 da Onda 1 da extracao da tela principal e da faixa de paciente foi registrado em `docs/onda1_tela_principal_paciente_em_uso_subetapa_2_3_checklist_operacional.md`; o documento define a entrada visual minima e a leitura do paciente em uso como passos separados, cada um com teste esperado antes de liberar a continuacao.
- O checklist operacional da Subetapa 4 da Onda 1 da extracao da tela principal e da faixa de paciente foi registrado em `docs/onda1_tela_principal_paciente_em_uso_subetapa_4_checklist_operacional.md`; o documento formaliza o lookup por codigo com `Enter` e `Tab`, mantendo o Menu de pacientes como fallback seguro.
- O checklist operacional da Subetapa 5 da Onda 1 da extracao da tela principal e da faixa de paciente foi registrado em `docs/onda1_tela_principal_paciente_em_uso_subetapa_5_checklist_operacional.md`; o documento valida a integracao com `Tratamento -> Novo tratamento` usando o mesmo paciente em uso da tela principal e preservando o fallback para Menu de pacientes.
- O checklist operacional da Subetapa 6 da Onda 1 da extracao da tela principal e da faixa de paciente foi registrado em `docs/onda1_tela_principal_paciente_em_uso_subetapa_6_checklist_operacional.md`; o documento fecha a frente em modo de estabilizacao, confirmando que nao ha novo comportamento funcional a adicionar antes da proxima onda.
- O ajuste funcional posterior da frente adicionou a busca por nome na tela principal: o campo de nome agora pode abrir diretamente o prontuario quando o nome completo estiver exato, ou abrir o Menu de pacientes quando a entrada for parcial, preservando a mesma fonte de contexto do paciente em uso. O modulo da tela principal foi renomeado no frontend para `frontend/js/modules/prontuario.js`, mantendo a API interna de paciente em uso e o fallback existente.
- A etapa visual isolada da janela `Novo tratamento` foi iniciada no frontend com o modulo dedicado `frontend/js/modules/novo-tratamento-modal.js`, carregado por `frontend/index.html` e acionado pela acao `tratamento-novo` em `frontend/app.js`; a abertura atual e apenas visual, sem salvar tratamento, sem backend, sem banco e sem integracao com odontograma ou financeiro.
- A validacao visual em runtime do modal `Novo tratamento` foi concluida com sessao autenticada local, abrindo o menu `Tratamento -> Novo tratamento`, alternando a aba `Convenio` e confirmando os fechamentos por `Ok`, `Cancela`, `X`, `ESC` e clique fora, sem qualquer requisicao de gravaï¿½ï¿½o.
- O contrato funcional campo por campo do modal `Novo tratamento` foi registrado em `docs/contrato_funcional_campos_modal_novo_tratamento.md`; nenhuma implementacao foi feita e a proxima etapa recomendada passou a ser a correcao controlada por grupo de campos apos confirmacao do usuario.
- A correcao funcional leve dos campos provisï¿½rios do modal `Novo tratamento` removeu o valor hardcoded de `Idade`; sem paciente seguro, o campo permanece vazio, e `Inclusao`/`Alteracao` continuam neutros ate existir persistencia real.
- O contrato tecnico do fluxo `Novo tratamento` com paciente em uso foi registrado em `docs/contrato_fluxo_novo_tratamento_paciente_em_uso.md`; o documento consolida a regra de abrir o modal apenas com paciente em uso, ou abrir o `Menu de pacientes` quando nao houver paciente ativo, sem qualquer implementacao nesta etapa.
- A auditoria inicial da frente `Tabelas -> Procedimentos` foi concluida e a frente foi aberta formalmente para o novo frontend React, com painel principal, editor em modal proprio, CRUD de tabelas, materiais vinculados, reajuste e relatorio ja mapeados no legado; nenhum codigo foi alterado nesta passada.
- O contrato funcional, visual e arquitetural da frente `Tabelas -> Procedimentos` no React foi consolidado em `docs/contrato_implementacao_tabela_procedimentos_frontend_react.md`; a implementacao ainda nao foi iniciada.
- A auditoria detalhada da frente `Tabelas -> Procedimentos` no React foi consolidada em `docs/auditoria_tabela_procedimentos_frontend_react.md`; o documento registra shell, barra, filtros, tabela, editor modal, materiais, reajuste, relatorio e dependencias reais.
- O ajuste visual estrutural de `Tabelas -> Procedimentos` foi aplicado no novo frontend React com barra compacta unificada, filtros incorporados a faixa principal e tabela centralizada; o fechamento funcional da frente continua pendente.
- A auditoria especifica do modal de procedimento foi iniciada e consolidada em `docs/auditoria_modal_procedimento_frontend_react.md`; o documento fecha o contrato do painel de cadastro, painel financeiro, materiais vinculados, backend, layout legado e arquitetura modular proposta, sem iniciar implementacao.
- O contrato especifico do painel financeiro de Procedimentos foi consolidado em `docs/contrato_painel_financeiro_procedimentos_frontend_react.md`; o backend oficial segue sendo `_calcular_financeiro_dashboard()` em `backend/routes/procedimentos_routes.py`, sem duplicacao de formulas no React.
- A auditoria comparativa das formulas de `Valor Minimo` e `Rendimento %` foi aberta e concluida em `docs/auditoria_comparativa_valor_minimo_rendimento_procedimentos.md`; a divergencia de `Rendimento %` ficou confirmada entre o legado do modal e o contrato atual do React/backend, enquanto `Valor Minimo` nao reproduziu divergencia no codigo atual analisado.
- O card `Rendimento %` do painel financeiro do React passou a consumir explicitamente `rendimento_proc`, alinhando a exibicao ao contrato do legado sem alterar o backend.
- A rastreabilidade de `Valor Minimo` foi consolidada em documento proprio e a correcao do backend foi aplicada, alinhando a base historica do legado.
- O contrato de implementacao de `Tabelas -> Procedimentos` foi reforcado com os detalhes do modal proprio de inclusao e alteracao, incluindo nome lateral `Procedimentos`, agrupador `Tabelas` e rota tecnica `/app/tabelas/procedimentos`.
- A estrutura modular inicial do modal de procedimento foi criada no React em `frontend-react/src/features/procedimentos/components/` e `frontend-react/src/features/procedimentos/hooks/`; a integracao de materiais vinculados agora tambem esta implementada no modal proprio, com hook, API, tabela, submodal e validacao real via navegador.
- A auditoria funcional do catalogo de simbolos graficos foi consolidada em `docs/auditoria_funcional_catalogo_simbolos_graficos_easydental_brana_cloud.md`; o registro fecha o contrato entre EasyDental, legado web, backend e React para `Procedimentos` e `Procedimentos Genericos`, sem alterar backend, banco ou payloads.
- Auditoria de mojibake nos dados das tabelas de procedimentos registrada em `docs/auditoria_mojibake_dados_tabelas_brana_cloud.md`; a frente confirmada foi `Tabelas -> Procedimentos`, com quatro tabelas tecnicas afetadas (`PARTICULAR`, `CAIXA ECONOMICA FEDERAL`, `EASY - PARTICULAR`, `UNIMED - ODONTO`), matriz banco/API/React concluindo que o texto corrompido ja esta persistido na origem legada/importacao; nenhuma escrita em banco foi executada nesta etapa.
- A preparacao controlada da correcao ficou pronta em modo somente leitura: o importador de procedimentos passou a decodificar a saida do `OSQL.EXE` em `cp850`, o preview/dry-run foi separado em `backend/scripts/preview_correcao_mojibake_procedimentos.py` e o contrato de execucao sem escrita foi registrado em `docs/contrato_correcao_mojibake_procedimentos_brana_cloud.md`; continua proibida qualquer alteracao de dados sem autorizacao especifica.
- A etapa atual reabriu a tabela `PARTICULAR` para preview somente leitura, ajustando o preview para incluir o codigo `4` sem liberar apply; a matriz de auditoria desta etapa ficou em `E=336` para a tabela `4`, sem candidatos seguros.
- O dry-run corrigido exporta IDs reais, clinica_id e chave operacional completa; a reauditoria B/C validou a regra por exemplos, o backup real da tabela 5 foi gerado com `54` registros e `schema_version 1.1`, e o apply/rollback foram validados em modo somente leitura; o `tabela_id` do backup representa a FK técnica interna (`47`) e a tabela 10 continua bloqueada, com a frente em espera de nova confirmacao antes de qualquer `UPDATE`.
- A aplicação controlada da correção foi concluída para a tabela código `5`, com `54` registros atualizados e validação real via `GET /me`, `GET /procedimentos?tabela_id=5` e `GET /procedimentos/filtros` retornando `200`; a tela autenticada de `Tabelas -> Procedimentos` abriu no navegador local sem mojibake visível.
- A conclusao real desta auditoria revisou a supercontagem anterior, confirmou que `legacy_id NULL` nao e duplicidade e manteve a necessidade de classificar repeticoes legitimas versus ambiguidade antes de novas telas consumidoras de simbolos graficos.
- A validacao autenticada confirmou `GET /me`, `GET /cadastros/simbolos-graficos?scope=procedimentos`, `GET /cadastros/simbolos-graficos?scope=genericos` e `GET /cadastros/auxiliares?tipo=Símbolo gráfico`, com um unico valor repetido em `scope=procedimentos` e nenhum valor repetido em `scope=genericos`.
- A decisao tecnica final desta rodada ficou em **A**: seguir com a implementacao do frontend React usando o contrato atual, sem alterar backend nesta etapa.
- A implementacao modular do gate de paciente em uso para `Tratamento -> Novo tratamento` foi aplicada com o helper isolado `frontend/js/modules/novo-tratamento-paciente-gate.js` e uma ligacao minima sob demanda em `frontend/app.js`; nao houve persistencia real nem alteracao de backend/banco.
- O cabeï¿½alho de paciente em uso da tela principal foi adicionado como faixa discreta no topo do shell odontologico, reaproveitando `BranaOdontoV1Module.state.paciente` e `fichaPacienteAtualId` apenas como leitura segura; a faixa serve para dar visibilidade ao contexto ativo antes do fluxo `Novo tratamento`.
- A correcao runtime do header de paciente em uso ajustou a tela principal odontologica isolada, que era o fluxo realmente exibido no navegador; a linha de paciente do layout passou a mostrar numero e nome de forma visivel, e o fluxo legado da ficha ganhou sincronizacao sob demanda para o mesmo elemento.
- A etapa posterior de integracao do fluxo `Tratamento -> Novo tratamento` foi detectada como regressiva e revertida seletivamente apos o commit `d895078`, para retornar ao estado funcional anterior antes de qualquer nova mudanca no fluxo.
- Auditoria documental da regra usuario -> prestador Clinica concluida: o combo de usuarios carrega o prestador sistï¿½mico, o frontend nao filtra esse item e o backend bloqueia o vï¿½nculo em `_load_prestador_from_same_clinic()`; o banco confirmou o par usuario/prestador sistemico nas clinicas 1, 4, 13, 17 e 18; classificacao preliminar `REGRA-B + REGRA-F`; proxima etapa recomendada: comparar com EasyDental virgem antes de qualquer correï¿½ï¿½o.
- Comparacao EasyDental virgem concluida com fonte local somente leitura (`PROJETO_PRECIFICACAO_LEGADO\\Dados`, `eds70.sql`, `Dist\\USUARIO.raw`, `Dist\\PRESTADOR.raw`, `Dist\\UNIDADE.raw`, `Dist\\SISTEMA.raw` e `D:\\UTIL\\EasyDental_7.6_BR\\Readme.doc`): o legado confirma `Clï¿½nica` como prestador sistemico protegido, mas tambï¿½m confirma o vinculo operacional usuario/prestador e o uso desse contexto para agenda/conta da clinica; classificacao `EASY-A + REGRA-A + REGRA-F`; proxima etapa recomendada: abrir contrato de correï¿½ï¿½o pequena no backend para permitir o vï¿½nculo operacional sem mexer na protecao estrutural.
- Contrato tecnico da correcao de vinculo usuario -> prestador Clinica registrado em `docs/contrato_correcao_usuario_vinculo_prestador_clinica.md`; abordagem escolhida `USER-PREST-CONTRATO-B`; regra definida: manter a protecao estrutural do prestador Clinica e liberar apenas o vinculo operacional de usuario no backend, sem mexer em frontend, payload ou banco nesta etapa.
- Correcao backend-only do vinculo usuario -> prestador Clinica aplicada em `backend/routes/user_admin_routes.py`, com helper operacional separado para `admin_create_user` e `admin_update_user` e preservacao do helper estrutural; proxima validacao recomendada: teste manual controlado do vinculo e consolidacao documental final.
- Validacao manual do vinculo usuario -> prestador Clinica confirmada pelo usuario; correcao backend-only considerada validada e documentada em `docs/validacao_manual_usuario_vinculo_prestador_clinica.md`; protecao estrutural preservada; nenhuma alteracao de codigo ou banco nesta etapa.
- Bootstrap frontend do odontograma V1 documentado em `docs/odontograma_v1_frontend_bootstrap_leitura.md`; painel de leitura validado em DOM simulado com backend real, usando status, resumo e fallback de referencia vazia quando nao ha tratamentos cadastrados; `frontend/app.js` permaneceu intacto.
- Refino visual controlado da arcada do odontograma V1 documentado em `docs/odontograma_v1_refino_visual_arcada_leitura.md`; arcada passou a renderizar em faixas superior/inferior via modulo separado, intervencoes ficaram em cards simples, sem escrita e sem tocar em `frontend/app.js`.
- Reorganizacao do layout clinico do odontograma V1 documentada em `docs/odontograma_v1_reorganizacao_layout_clinico.md`; shell clinico prioriza a arcada como area principal, suporte ficou lateral/auxiliar, sem escrita e com modularizacao preservada.
- Auditoria documental de `assets/easy` para o odontograma registrada em `docs/odontograma_assets_easy_auditoria.md`; o acervo e quase todo BMP e tem blocos promissores de dentes, arcadas, simbolos e intervencoes, com risco de acoplamento direto ao legado.
- Inspecao visual controlada dos BMPs mais promissores de `assets/easy` registrada em `docs/odontograma_assets_easy_inspecao_visual_bmps.md`; arcadas e dentes servem como melhor referencia de layout, enquanto simbolos e intervencoes ficam mais indicados para fase futura, sem copiar o legado.
- Inventario tecnico de assets do odontograma registrado em `docs/easydental_tela_principal_odontologica_inventario_assets_odontograma.md`; o Brana Cloud ja possui candidatos locais em `assets/easy`, o EasyDental confirma arcadas, dentes, comandos e objetos `.dat`, e a decisao permanece somente documental, sem copiar assets nem alterar implementacao.
- A auditoria documental de assets odontologicos para o odontograma foi consolidada em `docs/frontend_react_ficha_clinica_analise_inicial_easy_dental.md`; a varredura encontrou 1414 imagens nos caminhos inspecionados, com 493 candidatos por nome odontologico, confirmou assets bons de dentes/arcada, faces auxiliares e paleta clinica, e nao exigiu backend, banco ou migration.
- Subetapa D1-F2 registrada em `docs/easydental_tela_principal_odontologica_subetapa_d1f2_assets_locais_odontograma.md`; o mapa de assets locais foi criado, o renderer isolado passou a usar BMPs do Brana Cloud, o `frontend/js/modules/odontograma-v1.js` foi ajustado apenas para carregar o novo modulo e o fallback antigo permaneceu preservado.
- Subetapa D1-F3 registrada em `docs/easydental_tela_principal_odontologica_subetapa_d1f3_composicao_arcada_assets.md`; o renderer foi refatorado para remover a aparencia de cards, compor a arcada em cinco faixas alinhadas, usar `arc_faces.bmp` nas faces e manter o fallback antigo preservado sem backend, banco ou alteracao de assets.
- Subetapa D1-F4 registrada em `docs/easydental_tela_principal_odontologica_subetapa_d1f4_correcao_paths_assets_odontograma.md`; o diagnostico mostrou que os BMPs locais precisavam do prefixo publico `/desktop-assets/easy/...`, o mapa de assets foi corrigido no menor ponto possivel, o fallback antigo permaneceu preservado e nao houve redesign, backend, banco ou alteracao de assets.
- Subetapa D1-F5 registrada em `docs/easydental_tela_principal_odontologica_subetapa_d1f5_comparacao_camadas_ajuste_fino.md`; a comparacao das camadas com o EasyDental confirmou que as arcadas base sao estruturais, que o underlay estava forte demais e que o ajuste fino correto era reduzir a opacidade do fundo, compactar a composicao e manter a estrutura em 5 faixas sem remover camada sem evidencia; fallback antigo preservado e sem backend/banco/alteracao de assets.
- O inventario local dos assets odontologicos reutilizaveis do Brana Cloud foi consolidado em `docs/frontend_react_ficha_clinica_analise_inicial_easy_dental.md` e confirma que o repositorio ja tem arcadas, familia de dentes, simbolos e icones de intervencao prontos para orientar o shell visual da Ficha clinica, sem depender de copia direta do EasyDental.
- A auditoria visual da origem do odontograma no EasyDental Cloud foi concluida em `docs/frontend_react_ficha_clinica_analise_inicial_easy_dental.md`; a inspecao mostrou `img` e `background-image` como mecanismos principais, sem evidÃªncia de canvas, com nomes como `dente_vazio.png`, `dente_vazio2.png` e `int_*` ainda compatÃ­veis com os assets locais.
- Refino da geometria da arcada V1 por referencia visual dos BMPs Easy registrado em `docs/odontograma_v1_refino_geometria_arcada_por_referencia_easy.md`; a arcada passou a usar composicao mais curva e odontologica, sem importar assets legados e sem escrita.
- Mapeamento funcional da tela principal do EasyDental registrado em `docs/easydental_tela_principal_odontograma_mapeamento_e_plano.md`; a tela foi decomposta em shell, busca de paciente, odontograma, procedimentos, contexto lateral e historico inferior para orientar a proxima evolucao modular do Brana.
- Investigacao detalhada da tela principal odontologica no `Y:\\EDS70` registrada em `docs/easydental_investigacao_tela_principal_odontograma_y_eds70.md`; a base viva confirmou a tela integrada com menus, toolbar, busca de paciente, arcada, procedimentos, contexto lateral e grade inferior de historico, exigindo modularizacao clara no Brana.
- Auditoria visual e funcional da tela principal odontologica baseada nos dois prints fornecidos e nas fontes locais `D:\\UTIL\\EasyDental_7.6_BR` e `Y:\\EDS70` registrada em `docs/easydental_tela_principal_odontograma_auditoria_prints_fontes_locais.md`; a tela segue classificada como especifica de Odontologia com subpartes core/comum e a proxima etapa recomendada e contrato funcional/inventario do Brana atual.
- Contrato funcional da tela principal odontologica registrado em `docs/easydental_tela_principal_odontologica_contrato_funcional.md`; o documento formaliza escopo, estados, regras por regiao e limites da etapa, confirma que a implementacao ainda nao comecou e aponta como proxima etapa o inventario do que ja existe no Brana Cloud.
- Inventario do Brana Cloud atual para a futura tela principal odontologica registrado em `docs/easydental_tela_principal_odontologica_inventario_brana_atual.md`; o levantamento consolidou areas existentes de odontograma V1, agenda, prestadores, procedimentos, historico, pacientes, documentos e permissao, sem iniciar implementacao.
- Inventario tecnico somente leitura das fontes locais do EasyDental registrado em `docs/easydental_tela_principal_odontologica_inventario_fontes_easydental.md`; os caminhos `D:\\UTIL\\EasyDental_7.6_BR` e `Y:\\EDS70` foram lidos em modo somente referencia, com identificacao de instaladores, `eds70.dsn`, `Dados\\Dist`, `Bitmaps`, `Icones`, `Objetos`, `Textos`, `Reports`, `Help`, `Safe`, `Import` e `MSDE`, sem alteracao, copia ou inicio de implementacao; proxima etapa recomendada: Subetapa D preliminar de layout estatico sem implementacao.
- Desenho tecnico preliminar do layout estatico da futura tela principal odontologica registrado em `docs/easydental_tela_principal_odontologica_desenho_tecnico_layout_estatico.md`; o documento definiu premissas, arquivos novos planejados, arquivos existentes protegidos, arquitetura visual por regioes, estados estaticos, integracoes proibidas e a proxima etapa recomendada como D1 de esqueleto visual estatico, sem implementacao.
- Auditoria da implementacao antiga do odontograma registrada em `docs/easydental_tela_principal_odontologica_auditoria_implementacao_antiga_odontograma.md`; o documento mapeou o botao `Odontograma` no shell da ficha, a interceptacao global de clique, os wrappers de `hideAllPanels`, `closeWorkspacePanel`, `fichaAplicarPaciente` e `fichaLimparNovo`, a relacao com a aba `Historico` e o risco tecnico da trilha antiga; proxima etapa recomendada: definir um contrato de entrada mais isolado antes de qualquer mudanca funcional.
- Contrato tecnico de entrada isolada do botao `Odontograma` registrado em `docs/easydental_tela_principal_odontologica_contrato_entrada_isolada_botao_odontograma.md`; a etapa ficou apenas documental, sem alteracao funcional, e consolidou a proxima etapa recomendada como D1-C para criar o modulo minimo de entrada isolada antes de ligar o botao.
- Subetapa D1-C executada com criacao dos modulos `frontend/js/modules/tela-principal-odontologica-contratos.js` e `frontend/js/modules/tela-principal-odontologica-entrada.js`, sem ligar ao botao `Odontograma`, sem remover a implementacao antiga e sem alterar `frontend/app.js`; a documentacao da etapa foi registrada em `docs/easydental_tela_principal_odontologica_subetapa_d1c_entrada_isolada_minima.md`; proxima etapa recomendada: D1-D de esqueleto visual estatico isolado reaproveitando a entrada minima.
- Subetapa D1-D executada com criacao dos modulos `frontend/js/modules/tela-principal-odontologica-estado.js` e `frontend/js/modules/tela-principal-odontologica-layout.js`, com ajuste minimo em `frontend/js/modules/tela-principal-odontologica-entrada.js` para renderizar o esqueleto visual estatico mockado; a etapa manteve o botao `Odontograma` desligado, a implementacao antiga intacta e registrou a documentacao em `docs/easydental_tela_principal_odontologica_subetapa_d1d_esqueleto_visual_estatico.md`; proxima etapa recomendada: D1-E para adaptar o botao com fallback antigo preservado.
- Subetapa D1-E executada com a adaptacao do botao `Odontograma` no modulo legado `frontend/js/modules/odontograma-v1.js` para tentar primeiro a entrada isolada nova, usando um host controlado no `body` com fallback automatico para `openPanel()` do fluxo antigo quando a entrada nova nao estiver disponivel ou falhar; a documentacao da etapa foi registrada em `docs/easydental_tela_principal_odontologica_subetapa_d1e_ligacao_botao_fallback.md`; a intercepcao global antiga foi mantida nesta fase.
- Subetapa D1-E2 executada para corrigir o carregamento real da entrada isolada: os scripts novos da tela odontologica nao estavam presentes no fluxo real da pagina, entao o modulo legado passou a carregar dinamicamente `tela-principal-odontologica-contratos.js`, `tela-principal-odontologica-estado.js`, `tela-principal-odontologica-layout.js` e `tela-principal-odontologica-entrada.js` antes de chamar `abrirTelaPrincipalOdontologicaPorPaciente`; a documentacao da etapa foi registrada em `docs/easydental_tela_principal_odontologica_subetapa_d1e2_correcao_carregamento_entrada_isolada.md`; fallback antigo preservado e `frontend/app.js` e `frontend/index.html` mantidos fora da correcao.
- Subetapa D1-F executada com o refino visual odontologico da tela isolada: foi criado o renderer dedicado `frontend/js/modules/tela-principal-odontologica-odontograma.js`, o estado mockado passou a expor arcadas superior e inferior, o layout foi reorganizado para dar destaque central ao odontograma e o carregamento legado passou a incluir o novo modulo visual antes da entrada; a documentacao da etapa foi registrada em `docs/easydental_tela_principal_odontologica_subetapa_d1f_refino_visual_odontograma.md`; backend, banco, `frontend/app.js`, `frontend/index.html` e a implementacao antiga continuam intactos.
- Especificacao de implementacao modular da tela odontologica do Brana registrada em `docs/brana_odontograma_especificacao_implementacao_modular.md`; ordem de arquivos, responsabilidades e sequencia de entrega definidas para evitar monolito e manter `frontend/app.js` fora do fluxo odontologico.
- Plano de subtarefas da implementacao modular do odontograma Brana registrado em `docs/brana_odontograma_plano_subtarefas_implementacao.md`; a especificacao foi quebrada em fases pequenas e validaveis para shell, busca de paciente, tratamento, arcada, procedimentos, contexto lateral e historico.

## Proximas prioridades sugeridas

- Atualizar `README.md`, `README_WEB.md` e `backend/README.md` em trilha separada.
- Consolidar a documentacao por modulo sem misturar contratos vigentes com historico.
- Encerrar a trilha de correcao usuario -> prestador Clinica apos a validacao manual documentada e retomar a trilha planejada de Prestadores remanescentes/modularizacao.
- Decidir o destino dos untracked antigos fora da trilha principal.
- Tratar mojibake/UTF-8 em trilha propria, sem misturar com correcoes funcionais.
- Retomar modularizacao/refatoracao somente depois da documentacao base estar consolidada.
- Validar manualmente a janela visual `Novo tratamento` e depois fechar a matriz de lacunas do convenio antes de qualquer persistencia real.
- Apos a validacao visual, o proximo passo mais provavel e o aceite humano comparando com o print do EasyDental, antes de qualquer persistencia real.
- Apos o contrato funcional dos campos, o proximo passo recomendado e priorizar apenas um grupo pequeno de campos de baixo risco, sem persistencia, se o usuario confirmar.
- A correï¿½ï¿½o leve atual deixou o modal pronto para validacao dos campos pendentes ou para o contrato da aba `Convenio`, sem tocar em persistï¿½ncia.
- O fluxo Novo tratamento com paciente em uso passou a ser a nova lacuna formalizada; a proxima etapa recomendada e implementar somente o gate modular de paciente em uso no acionamento `Tratamento -> Novo tratamento`, sem gravar tratamento.
- A proxima etapa apos o gate e validar runtime com e sem paciente em uso e, depois, fechar a origem de `Idade` ou os campos restantes do modal sem misturar persistencia.
- Com o cabeï¿½alho de paciente em uso visï¿½vel, a continuidade do fluxo Menu de pacientes -> paciente ativo -> Novo tratamento fica mais auditï¿½vel na tela principal.
- A proxima etapa apos o rollback seletivo e uma nova auditoria de runtime antes de qualquer nova mudanca no fluxo `Tratamento -> Novo tratamento`.
- Revisar anamnese/SQLServer/restauracao em trilha separada.
- O plano tecnico do modulo Orcamento foi formalizado em `docs/15_plano_execucao_orcamento.md`; proxima etapa recomendada: iniciar a Fase 1 apenas depois de backup/checkpoint e aviso explicito antes da primeira alteracao de codigo.
- O checklist de execucao por onda do modulo Orcamento foi formalizado em `docs/16_checklist_execucao_orcamento.md`; proxima etapa recomendada: aguardar autorizacao para iniciar a Onda 1 com backup/checkpoint antes da primeira alteracao real.
- A Onda 1 do modulo Orcamento foi iniciada em base de backend, com checkpoint fisico criado em `backups_modularizacao/orcamento_onda1_pre_impl_20260617_121407` e novos arquivos separados em `backend/schemas/`, `backend/services/` e `backend/routes/`; ainda falta validacao runtime completa no ambiente com dependencias da aplicacao.
- A Onda 1 do modulo Orcamento teve validacao runtime concluida no backend real com login autentico e retorno consistente dos endpoints principais; o proximo passo operacional segue sendo a preparacao da Onda 2 com checkpoint isolado de frontend antes de qualquer alteracao de codigo.
- A Onda 2 do modulo Orcamento foi iniciada em frontend com checkpoint fisico criado em `backups_modularizacao/orcamento_onda2_pre_impl_20260617_125540`, novos arquivos separados em `frontend/orcamento/` e roteamento minimo ligado em `frontend/app.js`; a validacao de sintaxe terminou limpa.
- A Onda 3 do modulo Orcamento foi iniciada com checkpoint fisico criado em `backups_modularizacao/orcamento_onda3_pre_impl_20260617_131837`, modais centrais separados em `frontend/orcamento/modals/` e roteamento do shell atualizado para abrir os modais por responsabilidade; a exclusao de intervencao ainda depende de persistencia dedicada.

## Frente aberta: auditoria comparativa EasyDental virgem x Brana Cloud

- Caminho externo usado: `\\Sonyvaio\c\EDS70`
- Objetivo: inventario tecnico inicial do EasyDental virgem para orientar futuras decisoes sobre usuarios, prestadores, permissoes, seeds e configuracao inicial.
- A base analisada deve ser tratada como referencia da forma virgem do sistema; a volumetria populada pode representar seeds estruturais do proprio EasyDental e nao deve ser lida automaticamente como sinal de uso previo.
- Subetapa 0 registrada como somente documental.
- Nao houve implementacao, alteracao de banco, alteracao de codigo ou importacao nesta etapa.
- Proxima subetapa recomendada: `EasyDental virgem - Subetapa 1 - inventario somente leitura de tabelas e contagem de registros`.

## Subetapa 1 da frente EasyDental virgem

- Subetapa executada: inventario somente leitura de tabelas e contagens.
- Conexao somente leitura realizada em ambiente local de apoio `.\SQLEXPRESS` com a base `EDS70` ja disponivel para consulta.
- Metodo: consultas `SELECT` apenas sobre `sys.tables`, `sys.schemas` e `sys.dm_db_partition_stats`, sem execucao de scripts de escrita, sem attach/detach, sem backup/restore e sem importacao de dados.
- Total de schemas encontrados: `1` (`dbo`).
- Total de tabelas encontradas: `130`.
- Total de tabelas vazias: `10`.
- Total de tabelas populadas: `120`.
- Grupos preliminares identificados: usuarios/login, prestadores/profissionais, vinculos usuario/prestador, permissoes/perfis, clinica/empresa/configuracao inicial, procedimentos, materiais, convenios, agenda, financeiro, tabelas auxiliares/seeds e sistema/interno.
- Achado importante: varias tabelas estruturais pequenas ja nascem populadas, enquanto outras tabelas operacionais pesadas concentram o volume historico do sistema.
- Nao houve implementacao.
- Nao houve alteracao no EasyDental.
- Proxima subetapa recomendada: `EasyDental virgem - Subetapa 2 - analise estrutural somente leitura das tabelas candidatas de usuarios, prestadores e vinculos`.

## Subetapa 2 da frente EasyDental virgem

- Subetapa executada: validacao da identidade da base e analise estrutural de usuarios, prestadores e vinculos.
- Divergencia registrada: o DSN da fonte externa aponta `SERVER=SONYVAIO\EDS70`, `DATABASE=eds70`, mas a leitura foi feita na instancia local `INSPIRON-15\SQLEXPRESS`, banco `EDS70`.
- Validacao documental: `sys.database_files` mostrou caminhos fisicos locais em `D:\SQLData\EDS70_2022\`, nao o caminho UNC externo.
- Conclusao cautelosa: a correspondencia fisica direta com a share externa nao foi confirmada; o volume populado nao deve ser usado isoladamente como prova de base usada, pois pode refletir seeds estruturais do proprio EasyDental.
- Tabelas analisadas: `_TIPO_USUARIO`, `LOGON`, `USUARIO`, `CCCIRURGIAO`, `PESSOAL`, `PREST_ESP`, `PRESTADOR`, `TMP_PARTICIPACAO`, `USUARIO_FUNCAO`, `USUARIO_MODULO`, `USUARIO_PERFIL`.
- Principais achados sobre usuarios/login: `USUARIO` e a tabela clara de login; `LOGON` e vazia e parece ser sessao/log; `_TIPO_USUARIO` e seed auxiliar de tipos.
- Principais achados sobre prestadores/profissionais: `PRESTADOR` e a tabela clara de prestador; `PREST_ESP` e a junï¿½ï¿½o formal com especialidades; `PESSOAL` e amplo cadastro de pessoas com FK para prestador; `CCCIRURGIAO` e operacional com `ID_PRESTADOR` por nomenclatura.
- Principais achados sobre vinculos: `USUARIO_FUNCAO`, `USUARIO_MODULO` e `USUARIO_PERFIL` possuem FKs formais e representam os vinculos de acesso/perfil; `TMP_PARTICIPACAO` e auxiliar/temporaria sem FKs observadas.
- Nao houve implementacao.
- Nao houve alteracao no EasyDental.
- Proxima subetapa recomendada: `EasyDental virgem - Subetapa 3 - analise estrutural somente leitura de permissoes, perfis, modulos e funcoes`.

## Subetapa 3 da frente EasyDental virgem

- Subetapa executada: analise estrutural somente leitura de permissoes, perfis, modulos e funcoes.
- Tabelas analisadas: `SIS_FUNCAO`, `SIS_MODULO`, `SIS_PERFIL`, `USUARIO_FUNCAO`, `USUARIO_MODULO`, `USUARIO_PERFIL`, `USUARIO`, `_TIPO_USUARIO`, `PRESTADOR`, `UNIDADE`.
- Contagens registradas: `SIS_FUNCAO` 127, `SIS_MODULO` 52, `SIS_PERFIL` 10, `USUARIO_FUNCAO` 740, `USUARIO_MODULO` 312, `USUARIO_PERFIL` 184, `USUARIO` 7, `_TIPO_USUARIO` 10, `PRESTADOR` 5, `UNIDADE` 1.
- `SIS_PERFIL` nao apresenta um perfil nomeado explicitamente como administrador; os nomes sao funcionais, como `Pacientes`, `Intervenï¿½ï¿½es`, `Agenda de horï¿½rios`, `Controle de estoque` e relatï¿½rios.
- `SIS_MODULO` possui 52 modulos e o campo `PERMITE_SENHA`; a maior parte dos modulos consultados exige senha, com excecao inicial de `Odontograma`.
- `SIS_FUNCAO` possui 127 funcoes, todas ligadas formalmente a `SIS_MODULO`; os nomes observados sao operacionais, como inserir, alterar e eliminar, com `PERMITE_SENHA` em boa parte delas.
- `USUARIO_MODULO`, `USUARIO_FUNCAO` e `USUARIO_PERFIL` formam a matriz de acesso; o usuario `1` aparece com cobertura muito ampla, o que sugere um usuario inicial/admin de fato comportamental, embora nao exista perfil chamado `Administrador`.
- `USUARIO_PERFIL` inclui a ligacao com `PRESTADOR`, mostrando que o perfil pode variar por prestador; `USUARIO` ancora o tipo de usuario e a unidade.
- Nao houve implementacao.
- Nao houve alteracao no EasyDental.
- Impacto futuro previsto: novas contas no Brana Cloud provavelmente precisarao nascer com perfis, modulos e funcoes seedadas de forma segura, preservando um usuario inicial de alto privilegio e os registros estruturais que sustentam o acesso.
- Proxima subetapa recomendada: `EasyDental virgem - Subetapa 4 - analise somente leitura de clinica, unidade, configuracao inicial e registros proprios do sistema`.

## Subetapa 4 da frente EasyDental virgem

- Subetapa executada: analise somente leitura de clinica, unidade, configuracao inicial e registros proprios do sistema.
- Tabelas analisadas: `UNIDADE`, `SISTEMA`, `CONFIG_REPORT`, `CUSTOMCONTROL`, `CUSTOMPAGE`, `AVISO`, `_BANCO`, `_CIDADE`, `_ESTADO_CIVIL`, `_TIPO_LOGRADOURO`, `_TIPO_CONTATO`, `_TIPO_APRESENTACAO`, `_TIPO_INDICA`, `USUARIO`, `PRESTADOR`, `USUARIO_PERFIL`, `USUARIO_MODULO`, `USUARIO_FUNCAO`.
- `UNIDADE` apareceu com um registro unico e campos completos de cadastro/agenda/contato; isso sugere unidade inicial estrutural da instalacao.
- `SISTEMA` apareceu com um registro unico e campos de identidade da base, versao, release, preferencias e licenca/instalacao; isso sugere registro interno estrutural.
- `CONFIG_REPORT`, `CUSTOMCONTROL` e `CUSTOMPAGE` aparecem populadas e com ligacoes formais de configuracao por usuario e de layout entre formulario/pagina/controle; parecem seeds de interface e relatorio.
- As tabelas auxiliares `_BANCO`, `_CIDADE`, `_ESTADO_CIVIL`, `_TIPO_LOGRADOURO`, `_TIPO_CONTATO`, `_TIPO_APRESENTACAO` e `_TIPO_INDICA` aparecem populadas como lookup seeds estruturais.
- `_ESTADO` nao foi encontrada no banco e nao entrou na analise.
- `UNIDADE` liga-se formalmente a `USUARIO` pelos campos de auditoria; `USUARIO.ID_UNIDADE` aponta para a unidade ativa do usuario.
- Nao houve implementacao.
- Nao houve alteracao no EasyDental.
- Impacto futuro previsto: novas contas no Brana Cloud provavelmente precisarao nascer com unidade inicial, config global e seeds auxiliares protegidos, para evitar tela quebrada, menu vazio ou identidade de instalacao incompleta.
- Proxima subetapa recomendada: `EasyDental virgem - Subetapa 5 - analise somente leitura de Intervenï¿½ï¿½es/Procedimentos, seeds odontolï¿½gicos e tabelas clï¿½nicas estruturais`.

## Subetapa 5 da frente EasyDental virgem

- Subetapa executada: analise somente leitura de Intervencoes / Procedimentos, seeds odontologicos e tabelas clinicas estruturais.
- Tabelas clinicas / odontologicas analisadas: `INTERVENCAO`, `DENTE`, `ARCADA`, `HISTORICO`, `CCPACIENTE`, `CCCIRURGIAO`, `CID_ITEM`, `PREST_ESP`, `PRESTADOR`, `PLANO`, `CONVENIO`, `FACE`, `ANAMNESE_RESP`, `ANAMNESE_PERG`, `ANAMNESE_QUEST`, `CUSTOMPAGE`, `CUSTOMCONTROL`, `TRATAMENTO`, `TRATAMENTO_COMISSAO`, `TAB_PRC`, `TAB_PRC_ITEM`, `TAB_GEN_ITEM`, `TAB_GEN_ITEM_FASE`, `TAB_GEN_ITEM_MAT`, `TAB_MAT`, `TAB_MAT_ITEM`, `TAB_PRT_ITEM`, `TAB_REPASSE`, `_ESPECIALIDADE`, `_FASE_PROCEDIMENTO`, `_STATUS_INTERV`, `_SIMBOLO_ODONTO`, `_SIMBOLO_ANOMALIA`, `_TISS_REGIAO_PROCEDIMENTO`, `_TISS_TIPO_TABELA`.
- Principais achados sobre `INTERVENCAO`: tabela central do fluxo clinico / odontologico, com FK para `TRATAMENTO`, `TAB_PRC_ITEM`, `PRESTADOR`, `_STATUS_INTERV`, `_INDICE` e `USUARIO`, alem de indices proprios e volume elevado.
- Principais achados sobre `DENTE`: estrutura de odontograma por paciente / intervencao, com PK composta, indices por dente e FK para `INTERVENCAO`.
- Principais achados sobre `ARCADA`: estrutura de arcada odontologica com matriz 3D e FK para `TRATAMENTO`.
- Principais achados sobre `HISTORICO`: historico clinico / operacional volumoso e sensivel, com FKs para `INTERVENCAO`, `PESSOAL`, `PRESTADOR` e `USUARIO`.
- Principais achados sobre `CID_ITEM`: seed auxiliar de CID com codigo e nome, populado e indexado.
- Principais achados sobre tabelas de procedimentos / tabelas de preco: `TAB_PRC`, `TAB_PRC_ITEM`, `TAB_GEN_ITEM`, `TAB_GEN_ITEM_FASE`, `TAB_GEN_ITEM_MAT`, `TAB_MAT`, `TAB_MAT_ITEM`, `TAB_PRT_ITEM` e `TAB_REPASSE` formam a malha de catalogo, preco, material e repasse; varios exemplos apontam para seeds odontologicos estruturais.
- Principais achados sobre simbolos / odontograma / face / regiao: `_SIMBOLO_ODONTO`, `_SIMBOLO_ANOMALIA`, `FACE` e `_TISS_REGIAO_PROCEDIMENTO` reforcam a existencia de seeds estruturais de odontograma e marcacoes clinicas.
- Registros proprios / estruturais provaveis: intervencoes base, dentes / arcadas / faces, CID / item clinico, simbolos odontologicos, especialidades, tabelas de preco, materiais, repasse, anamnese e formularios clinicos.
- Impacto futuro previsto: novas contas no Brana Cloud podem precisar nascer com seeds odontologicos mais completos, com separacao clara entre estrutura obrigatoria e precificacao / configuracao comercial.
- Nao houve implementacao.
- Nao houve alteracao no EasyDental.
- Proxima subetapa recomendada: `EasyDental virgem - Subetapa 6 - comparacao inicial com seeds atuais do Brana Cloud, sem implementacao`.

## Subetapa 6 da frente EasyDental virgem

- Subetapa executada: comparacao documental inicial com seeds atuais do Brana Cloud, sem implementacao.
- Fontes Brana verificadas: `docs/11_roadmap_desenvolvimento.md`, `docs/05_banco_dados.md`, `docs/04_funcionalidades.md`, `docs/03_mapa_codigo.md`, `docs/validacao_manual_final_signup_brana_pos_correcoes.md`, `backend/README.md`, `backend/services/signup_service.py`, `backend/routes/auth_routes.py`, `backend/routes/user_admin_routes.py`, `backend/routes/superadmin_routes.py`, `backend/routes/procedimentos_routes.py`, `backend/services/runtime_bootstrap_service.py`, `backend/seeds/access_profiles_default.py`, `backend/seeds/access_profiles_bootstrap.py`, `backend/security/permissions.py`, `backend/security/system_accounts.py`, `backend/services/indices_service.py`, `backend/services/simbolos_service.py`, `backend/seeds/procedimentos_padrao.py`, `backend/seeds/procedimentos_brana.py`, `backend/seeds/procedimentos_genericos.py`, `backend/services/procedimentos_legado_service.py`, `backend/scripts/aplicar_compatibilidade_schema.py`, `backend/models/clinica.py`, `backend/models/usuario.py`, `backend/models/prestador_odonto.py`, `backend/models/access_profile.py`, `backend/models/procedimento_tabela.py`, `backend/models/procedimento.py`, `backend/models/unidade_atendimento.py`, `backend/routes/unidades_atendimento_routes.py`, `backend/routes/preferences_routes.py`, `backend/routes/system_options_routes.py`.
- Principais equivalencias EasyDental x Brana: usuario admin inicial, prestador sistemico, 10 perfis base, seeds de procedimentos, simbolos, anamnese, materiais e relatorios/etiquetas.
- Principais lacunas: ausencia de um `SISTEMA` persistido equivalente, ausencia de um seed unico e comprovado de `UNIDADE` inicial, e modelagem de permissao mais hibrida no Brana do que no legado.
- Riscos atuais: ambiguidade entre `PARTICULAR` e `Brana`, protecao incompleta de registros estruturais, dupla trilha de permissao e possibilidade de novas contas nascerem com unidade/configuracao insuficiente.
- Decisoes futuras pendentes: regra final da tabela privada de procedimentos, unidade inicial, protecoes estruturais, prestador excluivel ou nao, e contrato de seed global x por clinica.
- Nao houve implementacao.
- Nao houve alteracao no EasyDental.
- Proxima subetapa recomendada: `EasyDental virgem - Subetapa 7 - contrato documental para regra futura de nascimento de nova conta Brana, sem implementacao`.

## Subetapa 7 da frente EasyDental virgem

- Subetapa executada: contrato documental futuro para nascimento de nova conta Brana, sem implementacao.
- Principios consolidados: novas contas podem receber novas regras; contas existentes nao devem ser migradas automaticamente; dados estruturais devem ser separados de dados configuraveis; registros proprios do sistema devem ser protegidos contra exclusao; seeds com preco exigem cuidado.
- Principais regras propostas: tabela Brana apenas para novas contas; PARTICULAR mantida em contas legadas; unidade inicial e usuario admin precisam de contrato claro; prestador sistemico precisa de protecao; permissao precisa de separacao entre global, perfil e usuario.
- Separacao entre novas contas e contas existentes: toda nova regra deve valer primeiro para novas contas, sem correcao automatica de legado.
- Registros candidatos a protecao contra exclusao: usuario admin inicial, prestador sistemico/reservado, unidade inicial unica, perfis base, matriz de acesso, tabela privada padrao, seeds odontologicos, simbolos, especialidades e configuracoes globais.
- Decisoes futuras pendentes: unidade inicial obrigatoria ou nao, protecao da unidade, vinculacao do admin, visibilidade do prestador sistemico, politica final da tabela Brana x PARTICULAR, politica de preco, seeds de materiais/repasses e protecao de registros globais.
- Nao houve implementacao.
- Nao houve alteracao no EasyDental.
- Proxima subetapa recomendada: `EasyDental virgem - Subetapa 8 - plano incremental de implementacao futura para nascimento de nova conta Brana, sem alterar codigo`.

## Subetapa 8 da frente EasyDental virgem

- Subetapa executada: atualizacao do contrato de novas contas Brana, sem implementacao.
- Premissa atualizada: novas contas devem nascer prontas e abertas, com estrutura minima automatica; a tela de setup passa a ser candidata a dispensa, substituicao ou reducao futura, sem alteracao nesta etapa.
- Principios consolidados: novas contas seguem contrato novo; contas existentes preservam contrato legado; PARTICULAR fica em contas antigas; Brana e a tabela privada padrao de novas contas; seeds estruturais devem nascer automaticamente; dados comerciais/precos exigem cuidado; registros proprios devem ser protegidos.
- Registros candidatos a protecao: usuario admin inicial, prestador sistemico/reservado, unidade inicial, tabela Brana, perfis base, matriz de permissoes, procedimentos estruturais, CID, tabela generica, especialidades, simbolos, anamnese base, configuracoes globais e equivalentes a Mestre/Clinica.
- Fluxo esperado de nascimento: clinica/tenant, usuario admin, prestador sistemico, unidade, perfis/permissoes, tabela Brana, seeds odontologicos, sistema pronto para uso e setup nao obrigatorio para estrutura minima.
- A necessidade de mapear Mestre/Clinica antes do teste foi registrada como lacuna prioritaria.
- Nao houve implementacao.
- Nao houve alteracao no EasyDental.
- Nenhuma conta foi criada ou alterada.
- Proxima subetapa recomendada: `EasyDental virgem - Subetapa 8A - validacao documental dos registros Mestre e Clinica e fechamento do contrato de nova conta, sem implementacao`.

## Subetapa 8A da frente EasyDental virgem

- Subetapa executada: decisao de tabelas, usuarios e prestadores para novas contas Brana, ainda sem implementacao.
- Foco documental: fechamento do papel de `Mestre` e `Clï¿½nica`, sem forcar conclusao literal onde a busca textual nao confirmou o termo `Mestre`.
- Resultado preliminar: `Clï¿½nica` foi localizada de forma literal em `USUARIO 255` / `PRESTADOR 255` / `UNIDADE 1`; `Mestre` permanece como papel admin-like inferido, com `USUARIO 1` como melhor equivalente funcional.
- Matriz completa EasyDental x Brana: classifica tabelas em manter Brana atual, regular no contrato, incluir no contrato de novas contas, melhorar equivalente existente, nao incluir ou deixar pendente.
- Regra reforcada: nao duplicar conceitos que ja existem no Brana; quando o EasyDental for melhor, registrar como melhoria do equivalente existente em vez de criar novo conceito.
- Regra reforcada: logs, historicos, transacionais e temporarios nao devem nascer como seed de novas contas.
- Nao houve implementacao.
- Nao houve alteracao no EasyDental.
- Nenhuma conta foi criada ou alterada.
- Proxima subetapa recomendada: `EasyDental virgem - Subetapa 8B - fechamento final do contrato de usuarios/prestadores e matriz de seeds para novas contas, sem implementacao`.

## Subetapa 8B da frente EasyDental virgem

- Subetapa executada: fechamento final do contrato de usuarios, prestadores e seeds, sem implementacao.
- Decisao final documental: `Clï¿½nica` permanece como papel estrutural literal (`USUARIO 255` / `PRESTADOR 255` / `UNIDADE 1`); `Mestre` permanece como admin-like inferido (`USUARIO 1` / `PRESTADOR 1`).
- Contrato final de seeds: CID, tabela generica, procedimentos canonicos, procedimentos genericos, tabela Brana, especialidades, fases/status, simbolos, anamnese, lookups auxiliares e configuracoes minimas devem nascer para novas contas.
- Ficam fora do nascimento: logs, historicos, transacionais, movimentos e `TMP_*`.
- Regra final: novas contas nascem prontas, setup nao cria estrutura minima, contas existentes preservam PARTICULAR.
- O contrato ficou suficiente para baseline/teste da criacao de conta atual, sem alterar codigo.
- Nao houve implementacao.
- Nao houve alteracao no EasyDental.
- Nenhuma conta foi criada ou alterada.
- Proxima subetapa recomendada: `EasyDental virgem - Subetapa 8C - baseline documental e teste manual da criacao de conta atual, sem alteracao de codigo`.

## Subetapa 8C da frente EasyDental virgem

- Subetapa executada: baseline documental da conta existente ID 16 / `institutobrana@gmail.com`, sem criar nova conta.
- Conferencia Git da 8B: o hash `9f97e5096040630d24e2a14f60c5be83bb429ac0` pertence a 8A; 8B nao tinha commit proprio no historico conferido.
- Comparacao contrato x conta real: a conta 16 confirma usuario admin inicial, usuario sistemico 255, prestador sistemico 255, tabela Brana, CID, tabela generica, procedimentos canonicos, materiais, simbolos e anamnese.
- Principais conformidades: conta ativa em trial, setup ja marcado como concluido para os usuarios principais, tabela Brana presente, lookup seeds presentes e catalogos odontologicos amplos.
- Principais lacunas: nao ha unidade inicial, nao ha `usuario_perfil_acesso`, `relatorio_config` nao nasceu, e o nome legado `Tabela Exemplo` continua convivendo com a tabela Brana.
- Riscos: a conta nasce pronta, mas ainda com pontos de contrato tecnico pendentes em unidade e matriz formal de acesso.
- Nao houve implementacao.
- A conta ID 16 nao foi alterada.
- Nao houve alteracao no EasyDental.
- Nenhuma conta foi criada ou alterada.
- Proxima subetapa recomendada: `EasyDental virgem - Subetapa 8D - contrato tecnico da unidade inicial e matriz de perfis/permissoes para novas contas, sem implementacao`.

## Subetapa 8T da frente EasyDental virgem

- Subetapa executada: validacao manual e contrato complementar do usuario ADM/setup, sem implementacao.
- A nova conta testada passou nos pontos principais ja fechados pelas Subetapas 8P, 8K, 8R e 8S:
  - tabelas de procedimentos corretas;
  - unidade Principal / 0001 correta;
  - prestador Clï¿½nica correto;
  - prestador ADM/Mestre funcional correto;
  - prestador ADM com tipo Cirurgiï¿½o dentista.
- Nova pendencia funcional registrada: o modulo Usuï¿½rios ainda precisa nascer com Tipo de usuï¿½rio = Dentista (CD), prestador associado = prestador ADM/Mestre funcional e unidade de atendimento = Principal / 0001.
- Decisao atualizada sobre setup: manter a tela de setup para o primeiro acesso do ADM inicial da nova conta e impedir que ela apareca para usuarios criados depois dentro da mesma conta.
- Contrato complementar fechado para a proxima implementacao isolada:
  - 8U: ajustar o nascimento do usuario ADM;
  - 8V: ajustar o comportamento do setup para usuarios posteriores.
- A 8T ficou somente documental e investigativa.
- Nenhum codigo foi alterado.
- Nenhum backend foi alterado.
- Nenhum frontend foi alterado.
- Nenhum banco/schema/migration/seed/endpoints foi alterado.
- Nenhuma conta foi criada ou excluida.
- EasyDental nao foi alterado.
- A blindagem textual/mojibake foi respeitada.

## Subetapa 8T-B da frente EasyDental virgem

- Subetapa executada: comparacao direta EasyDental virgem sobre usuario, prestador, unidade e setup, sem implementacao.
- Motivo da complementacao: a 8T fechou o contrato documental e a validacao manual, mas nao fez nova leitura direta no EasyDental virgem nesta frente.
- Fonte consultada nesta sessao: o share UNC principal `\\Sonyvaio\c\EDS70` nao estava acessivel; a leitura foi complementada por mirror local somente leitura e pelos documentos historicos da trilha.
- Achados diretos no EasyDental:
  - `USUARIO.raw`, `PRESTADOR.raw` e os contratos historicos confirmam a presenca funcional de `Mestre`.
  - `PRESTADOR.raw` e `USUARIO.raw` confirmam `Clï¿½nica` como referencia estrutural do legado.
  - `_TIPO_USUARIO` contem o tipo `Dentista (CD)`.
  - `UNIDADE.raw` traz `0001` / `Principal`.
  - `SISTEMA.raw` traz `ControleUsuarios=0` e `Auditoria=0`.
  - `LOGON` e a estrutura de apoio de sessao/registro, sem servir como setup de usuario novo.
- Regra revisada para usuario ADM:
  - o usuario ADM deve nascer como `Dentista (CD)`;
  - deve vincular ao prestador ADM/Mestre funcional;
  - deve vincular a `Principal / 0001`;
  - vale somente para novas contas.
- Regra revisada para setup:
  - o setup permanece para o ADM inicial da nova conta;
  - o setup nao deve aparecer para usuarios criados posteriormente;
  - o setup nao deve virar etapa de todo usuario novo.
- Proxima subetapa recomendada: `8U` para o ajuste isolado do usuario ADM, seguido de `8V` para o comportamento do setup em usuarios posteriores.
- Nao houve implementacao.
- Nenhum codigo foi alterado.
- Nenhum banco foi alterado.
- Nenhum arquivo EasyDental foi alterado.
- Nenhuma conta foi criada ou excluida.
- A blindagem textual/mojibake foi respeitada.

## Subetapa 8T-C da frente EasyDental virgem

- Subetapa executada: confirmaï¿½ï¿½o complementar no UNC principal sobre usuï¿½rio, prestador, unidade e setup, sem implementaï¿½ï¿½o.
- Motivo da confirmaï¿½ï¿½o: a 8T-B usou mirror local porque o UNC principal nï¿½o estava acessï¿½vel naquela sessï¿½o; nesta sessï¿½o o UNC voltou a responder.
- Resultado do acesso ao UNC principal: acessï¿½vel.
- Achados confirmados:
  - `Mestre` em `USUARIO.raw` e `PRESTADOR.raw`.
  - `Clï¿½nica` em `PRESTADOR.raw` e na referï¿½ncia estrutural da base.
  - `Dentista (CD)` em `_TIPO_USUARIO.raw`.
  - `Principal / 0001` em `UNIDADE.raw`.
  - `USUARIO.ID_UNIDADE` e `USUARIO.ID_PRESTADOR` no layout de `eds70.sql`.
  - `ControleUsuarios=0` e `Auditoria=0` em `SISTEMA.raw`.
  - ausï¿½ncia de setup genï¿½rico obrigatï¿½rio para todo usuï¿½rio novo nos arquivos consultados.
- Regra confirmada:
  - o usuï¿½rio ADM inicial das novas contas deve nascer como `Dentista (CD)`;
  - deve apontar para o prestador ADM/Mestre funcional;
  - deve apontar para `Principal / 0001`;
  - setup continua apenas para o ADM inicial;
  - setup nï¿½o deve aparecer para usuï¿½rios criados depois.
- Prï¿½xima subetapa liberada: `8U`, mantendo `8V` separada e posterior.
- Nï¿½o houve implementaï¿½ï¿½o.
- Nenhum cï¿½digo foi alterado.
- Nenhum banco foi alterado.
- Nenhum arquivo EasyDental foi alterado.
- Nenhuma conta foi criada ou excluï¿½da.
- A blindagem textual/mojibake foi respeitada.

## Subetapa 8U-B da frente EasyDental virgem

- Subetapa executada: exclusao segura da clinica 12 para liberar `institutobrana@gmail.com` apos a 8U.
- Motivo da etapa: preparar um novo teste limpo da conta, confirmando por banco que o ID informado (`12`) batia com o e-mail alvo antes de qualquer exclusao.
- Documentos revisados: contrato de exclusao segura, historicos das exclusoes anteriores e a auditoria da 8U.
- Scripts revisados: runners e backups seguros anteriores, reaproveitados como padrao de protecao.
- Scripts alterados/criados: `backend/scripts/delete_test_clinic_12_runner.py` e `backend/scripts/export_test_clinic_12_backup.py`.
- Conta alvo confirmada: clinica 12, e-mail `institutobrana@gmail.com`.
- Backup/export executado com sucesso antes da exclusao real.
- Dry-run executado com alvo unico, usuarios 27/28/29, prestadores 17/18 e dependencias sem bloqueio.
- Execucao real executada uma unica vez com confirmacao pos-commit da remocao da clinica 12 e liberacao do e-mail.
- Resultado: conta removida com sucesso, sem impacto em outras contas.
- Confirmacao final por banco: clinicas=0, usuarios=0, prestador_odonto=0, unidade_atendimento=0, email_codes=0 para institutobrana@gmail.com.
- Proximo teste manual recomendado: criar nova conta com `institutobrana@gmail.com` e validar 8P, 8K, 8R e 8U em conjunto.
- Proxima subetapa recomendada: `8U-C` para validacao manual da nova conta apos a exclusao segura.
- Confirmacao funcional: frontend, backend funcional, tabelas de procedimentos, setup e EasyDental nao foram alterados por esta etapa.
- Nenhuma conta foi criada automaticamente.
- A blindagem textual/mojibake foi respeitada.

## Correcao urgente apos 8U

- Problema identificado: `NameError: name '_apply_user_links' is not defined` durante `/signup/confirm` na validacao da nova conta apos a 8U.
- Causa: o fluxo de signup chamou `_apply_user_links(db, usuario_admin, prestador_adm, unidade_principal)` sem a funcao estar definida no escopo de `backend/services/signup_service.py`.
- Correcao aplicada: helper local minimo `_apply_user_links` criado para amarrar usuario, prestador e unidade e preservar `tipo_usuario = Dentista (CD)`.
- Conta parcial: nao houve conta parcial persistida para `institutobrana@gmail.com`; restou apenas um `email_codes` residual, sem clinica, usuario, prestador ou unidade associados.
- Checks executados: `python -m py_compile backend/services/signup_service.py backend/security/permissions.py` e import seguro de `services.signup_service`, ambos com sucesso.
- Onde testar: tentar novamente criar conta limpa com `institutobrana@gmail.com` e validar 8P, 8K, 8R e 8U.
- Proxima etapa: validar a criacao limpa apos a correcao e, se passar, seguir para a trilha de setup posterior da 8V.
## Subetapa 8V-B da frente EasyDental virgem

- Subetapa executada: implementacao isolada do bloqueio de setup para usuarios criados posteriormente.
- Regra implementada: usuarios criados depois pelo modulo Usuarios ou pelo superadmin passam a nascer com `setup_completed = True`.
- Arquivos alterados: `backend/routes/user_admin_routes.py` e `backend/routes/superadmin_routes.py`.
- Checks executados: `python -m py_compile backend/routes/user_admin_routes.py backend/routes/superadmin_routes.py` e import seguro dos modulos alterados, ambos com sucesso.
- Onde testar manualmente: criar usuario novo na conta de teste, sair do ADM, entrar com o usuario criado e confirmar que o setup nao aparece.
- Confirmacao funcional: frontend nao foi alterado, setup visual nao foi alterado, ADM inicial permanece com setup e contas existentes nao foram alteradas.
- Proxima subetapa recomendada: validacao manual da 8V-B.
- Nenhuma conta foi criada automaticamente.
- A blindagem textual/mojibake foi respeitada.

## Subetapa 8V-C da frente EasyDental virgem

- Subetapa executada: validacao manual da correcao da 8V-B para usuarios criados posteriormente.
- Resultado informado pelo usuario: teste realizado ok.
- Interpretacao funcional: um usuario criado posteriormente nao caiu mais na tela de setup.
- O setup do ADM inicial permanece preservado, como esperado.
- O frontend nao precisou ser alterado para a validacao.
- O backend de criacao posterior seguiu funcionando com a regra de `setup_completed = True`.
- Opcoes do Sistema nao foram alteradas.
- Tabelas, unidade e prestadores nao foram alterados.
- Pendencias mantidas fora desta validacao: fluxo Superadmin, Opcoes do Sistema > Seguranca, auditoria, controle interno de usuarios/senhas, menu Alterar senha e correcao textual da tela de setup.
- Confirmacao funcional: nenhuma implementacao foi feita nesta etapa.
- Nenhuma conta foi criada ou excluida nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Subetapa 8W-A da frente EasyDental virgem

- Subetapa executada: auditoria tecnica e documental das permissoes padrao de usuarios criados posteriormente.
- O foco foi mapear como `permissoes_json` nasce hoje, qual o papel de `default_permissions`, como `tipo_usuario` e `is_admin` influenciam a matriz e como o frontend apenas consome a configuracao vinda do backend.
- Foi registrado que `Usuarios` e `Opcoes do Sistema` ja sao tratadas como areas administrativas protegidas em camadas distintas: permissao de modulo e gate por senha interna quando o controle interno esta ativo.
- O checkbox `Ativar controle de usuarios e senhas` foi identificado como flag em `clinica.opcoes_sistema_json.seguranca.ativar_controle_usuarios`, com default atual ligado no Brana, afetando a exigencia de senha/admin password, mas nao recriando sozinho a matriz de permissao.
- O comparativo com o EasyDental virgem foi mantido: controle de usuarios/senhas e auditoria nascem desativados na fonte observada, enquanto o Brana atual ainda combina permissao de modulo com gate interno mais rigido.
- O contrato tecnico preliminar registrado recomenda que usuarios posteriores nascam com acesso mais livre em geral, mas com `Usuarios` e `Opcoes do Sistema` protegidos por padrao, sem abrir acesso indevido.
- A recomendacao para a proxima etapa passa a ser uma implementacao isolada de permissï¿½es padrao para usuarios novos, ou contrato complementar se ainda houver duvida.
- Confirmacao funcional: nenhuma implementacao foi feita nesta etapa.
- Nenhuma conta foi criada ou excluida nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Subetapa 8W-B da frente EasyDental virgem

- Subetapa executada: implementacao isolada do baseline de permissoes para usuarios criados posteriormente.
- A regra aplicada liberou os modulos comuns por padrao para usuarios nao-admin, preservando `Usuarios` e `Configuracao/Opcoes do Sistema` como protegidos.
- `default_permissions()` em `backend/security/permissions.py` passou a usar um baseline comum para os tipos nao-admin, sem alterar o checkbox `ativar_controle_usuarios`.
- `is_admin=True` continua liberando todos os modulos.
- As permissoes existentes de contas antigas nao foram alteradas, porque a mudanca atingiu apenas o baseline de novos usuarios.
- `user_admin_routes.py` e `superadmin_routes.py` nao precisaram de alteracao, pois ja consomem o baseline do backend ou a derivacao em leitura sem criar nova regra paralela.
- Os checks executados confirmaram `default_permissions()` para Dentista (CD), Clï¿½nica, Gerente administrativo, Funcionï¿½rio(a) administrativo(a) e admin com os valores esperados.
- O comportamento do checkbox `Ativar controle de usuarios e senhas` foi preservado; esta etapa nao mudou seu default nem a sua persistencia.
- A validacao manual recomendada agora e criar um novo usuario nao-admin e conferir que os modulos comuns nascem livres, com `Usuarios` e `Opcoes do Sistema/Configuracao` protegidos.
- A proxima subetapa recomendada passa a ser a validacao manual da 8W-B.
- Confirmacao funcional: nenhuma conta foi criada automaticamente e nenhum acesso existente foi reescrito.
- A blindagem textual/mojibake foi respeitada.
## Subetapa 8U-C da frente EasyDental virgem

- Subetapa executada: validacao manual bem-sucedida da nova conta apos 8P/8K/8R/8U.
- Validacao informada pelo usuario: testes ok, conta criada corretamente e 8U-C considerada ok.
- Itens confirmados: `signup/confirm`, unidade `Principal / 0001`, tabelas da 8P, `Tabela Exemplo` ausente, `Brana` padrao/privada, prestador `Clï¿½nica`, prestador ADM/Mestre funcional, tipo `Cirurgiao dentista` no prestador ADM, usuario ADM como `Dentista (CD)`, vinculo ao prestador ADM e vinculo a unidade `Principal / 0001`.
- Setup para o ADM inicial: confirmado como ainda presente, sem alteracao nesta etapa.
- Correcoes acumuladas confirmadas: `PRIVATE_TABLE_NAME`, `senha_interna_hash` e `_apply_user_links`.
- Proxima subetapa recomendada: `8V` para impedir setup em usuarios criados posteriormente.
- Confirmacao funcional: nenhuma implementacao foi feita nesta etapa.
- Nenhuma conta foi criada ou excluida nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Subetapa 8V-A da frente EasyDental virgem

- Subetapa executada: auditoria tecnica e contrato para setup de usuarios criados posteriormente, sem implementacao.
- Fluxo atual identificado: o frontend abre setup quando `/me` retorna `setup_completed === false`; o backend bloqueia as rotas fora de `/me`, `/logout` e `/auth/setup/complete` quando `setup_completed` esta falso.
- O setup grava `senha_interna_hash`, `setup_completed`, `forcar_troca_senha` e `online` no proprio usuario.
- Usuarios criados depois nascem com `setup_completed` ausente e caem no setup por default `False`.
- Causa provavel: o setup esta sendo tratado como atributo de usuario, e nao como bootstrap exclusivo do ADM inicial.
- Contrato tecnico proposto: setup so para o ADM inicial da conta; usuarios criados depois devem nascer com `setup_completed = True`.
- Opcao recomendada para 8V-B: inicializar `setup_completed = True` na criacao de usuarios posteriores, sem mexer no login SaaS, nas opcoes do sistema ou no setup existente.
- Proxima subetapa recomendada: `8V-B`.
- Confirmacao funcional: nenhuma implementacao foi feita nesta etapa.
- Nenhuma conta foi criada ou excluida nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Subetapa 8U da frente EasyDental virgem

- Subetapa executada: implementacao isolada do usuario ADM com `Dentista (CD)`, prestador ADM e unidade Principal / 0001, sem mexer em setup.
- Regra implementada:
  - o usuario ADM inicial das novas contas passa a nascer com `tipo_usuario = Dentista (CD)`;
  - o usuario ADM inicial passa a vincular ao prestador ADM/Mestre funcional;
  - o usuario ADM inicial passa a vincular a unidade Principal / 0001;
  - a regra vale somente para novas contas.
- Arquivos alterados:
  - `backend/services/signup_service.py`
  - `backend/security/permissions.py`
  - `docs/auditoria_easydental_virgem_subetapa_8u_usuario_adm_dentista_prestador_unidade.md`
- Funcoes alteradas:
  - `criar_conta_saas`
  - `normalize_tipo_usuario`
- Checks executados:
  - `python -m py_compile backend/services/signup_service.py backend/security/permissions.py`
  - `python -c "import sys; sys.path.insert(0, r'D:\\BRANA ARQUIVOS\\BRANA CLOUD\\backend'); from services import signup_service; print('ok')"`
- Resultado dos checks:
  - compilacao Python concluida com sucesso;
  - import seguro de `services.signup_service` concluido com sucesso;
  - nenhuma conta foi criada automaticamente.
- Onde testar manualmente:
  - criar nova conta limpa;
  - abrir o modulo Usuï¿½rios e confirmar `Dentista (CD)`, prestador ADM e unidade `Principal / 0001`;
  - abrir o modulo Prestadores e confirmar `Clï¿½nica` e o prestador ADM;
  - verificar que `Tabela Exemplo` nao nasce;
  - verificar que o setup continua aparecendo para o ADM inicial.
- Confirmacao funcional:
  - setup nao foi alterado;
  - frontend nao foi alterado;
  - tabelas de procedimentos e seeds da 8P foram preservadas;
  - unidade Principal / 0001 nao foi alterada como regra de criacao;
  - contas existentes nao foram alteradas.
- Proxima subetapa recomendada: `8V` para impedir que o setup apareca para usuarios criados posteriormente.
- Nenhuma conta foi criada ou excluida.
- A blindagem textual/mojibake foi respeitada.

## Regras de conducao

- Nao misturar correcao funcional com mojibake.
- Nao misturar documentacao historica com contratos vigentes.
- Nao mexer em seeds sem respeitar os contratos.
- Comandos Git destrutivos continuam proibidos sem autorizacao explicita.
- Commits devem continuar separados por trilha.

---

## Modulo: Autenticacao

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢ï¿½â¬] Fase 1 - Login por email e senha implementado em `POST /login`.
[Ã¢ï¿½â¬] Fase 2 - JWT implementado em `backend/security/jwt_handler.py` usando `JWT_SECRET_KEY` obrigatoria.
[Ã¢ï¿½â¬] Fase 3 - Endpoint `/me`, logout, setup inicial e validacao de usuario atual implementados.
[Ã¢ï¿½â¬] Fase 4 - Cadastro com codigo, recuperacao de senha e Google OAuth presentes em `auth_routes.py`.
[ ] Fase 5 - Criar testes automatizados para login, token expirado, usuario inativo, setup pendente e erro de credenciais.

Proximo passo:

* Criar testes de smoke para `POST /login` e `GET /me`, incluindo validacao de que `JWT_SECRET_KEY` vem somente do ambiente.

Observacoes:

* `backend/main.py` carrega `backend/.env` automaticamente.
* `POST /login` usa `OAuth2PasswordRequestForm`, portanto recebe `application/x-www-form-urlencoded`.
* O frontend salva o token em `localStorage` como `brana_token`.
* Nao existe fallback seguro para JWT; se `JWT_SECRET_KEY` faltar, o sistema deve falhar.
* Estado funcional validado manualmente: login com senha de login, senha interna separada e perfis ajustados.

---

## Modulo: Usuarios, Perfis e Permissoes

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢ï¿½â¬] Fase 1 - CRUD administrativo de usuarios presente em `backend/routes/user_admin_routes.py`.
[Ã¢ï¿½â¬] Fase 2 - Controle de perfis e vinculos presente em `access_profile.py` e `usuario_perfil_acesso.py`.
[Ã¢ï¿½â¬] Fase 3 - Matriz de permissoes por modulo implementada em `backend/security/permissions.py`.
[Ã¢ï¿½â¬] Fase 4 - Modulos protegidos com senha administrativa/grant temporario implementados em `dependencies.py`.
[ ] Fase 5 - Testar todos os niveis de acesso: habilitado, protegido e desabilitado.

Proximo passo:

* Criar bateria de testes para usuario comum, admin de clinica, modulo protegido e usuario sem permissao.

Observacoes:

* Rotas usam `require_module_access("usuarios")`.
* O controle de usuarios pode exigir senha administrativa quando habilitado nas opcoes da clinica.
* Mudancas neste modulo podem bloquear acesso ao sistema inteiro.
* Estado funcional validado manualmente no ciclo recente de login, senha interna e perfis.

---

## Modulo: Pacientes

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢ï¿½â¬] Fase 1 - Modelo `Paciente` implementado em `backend/models/paciente.py`.
[Ã¢ï¿½â¬] Fase 2 - Rotas de pacientes implementadas em `backend/routes/cadastros_routes.py`.
[Ã¢ï¿½â¬] Fase 3 - Frontend chama endpoints de pacientes em `frontend/app.js`.
[Ã¢ï¿½â¬] Fase 4 - Filtros por `clinica_id` aparecem nas consultas principais.
[ ] Fase 5 - Criar testes de tenant para impedir acesso a paciente de outra clinica.

Proximo passo:

* Testar criar, buscar, navegar, editar e excluir paciente com usuarios de clinicas diferentes.

Observacoes:

* Endpoints principais ficam sob `/cadastros/pacientes`.
* Paciente e usado por agenda, anamnese, tratamentos, documentos e financeiro.
* Qualquer alteracao deve preservar `current_user.clinica_id` como fonte de tenant.

---

## Modulo: Cadastros Gerais

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢ï¿½â¬] Fase 1 - Auxiliares, grupos, categorias e simbolos graficos existem em `cadastros_routes.py`.
[Ã¢ï¿½â¬] Fase 2 - Unidades de atendimento existem em `unidades_atendimento_routes.py`.
[Ã¢ï¿½â¬] Fase 3 - CID existe em `cid_routes.py`.
[Ã¢ï¿½â¬] Fase 4 - Frontend possui chamadas para cadastros e menus auxiliares.
[ ] Fase 5 - Separar `cadastros_routes.py` em arquivos menores por dominio.

Proximo passo:

* Mapear quais endpoints de `cadastros_routes.py` podem ser extraidos sem alterar comportamento.

Observacoes:

* `cadastros_routes.py` e grande e mistura varios dominios.
* Ha referencias historicas a fontes legadas em alguns pontos.
* Modulos usam permissoes como `procedimentos`, `financeiro` e `configuracao`.

---

## Modulo: Agenda

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢ï¿½â¬] Fase 1 - Eventos e bloqueios de agenda existem em `agenda_legado.py`.
[Ã¢ï¿½â¬] Fase 2 - Rotas principais implementadas em `agenda_legado_routes.py`.
[Ã¢ï¿½â¬] Fase 3 - Contatos de agenda implementados em `agenda_contatos_routes.py`.
[Ã¢ï¿½â¬] Fase 4 - Frontend possui tela e chamadas para agenda, repeticao, combos e filtros.
[Ã¢ï¿½â¬] Fase 5 - Integracao Google Calendar presente em rotas e servicos.
[ ] Fase 6 - Criar testes de repeticao, horarios livres e tenant.

Proximo passo:

* Testar fluxo completo de agenda: criar evento, repetir, editar, excluir, buscar horarios livres e exportar para Google quando configurado.

Observacoes:

* Modulo protegido por permissao `agenda`.
* Usa `clinica_id`, paciente, prestador e unidade.
* Google Calendar depende de variaveis externas.
* Arquivo `agenda_legado_routes.py` e grande e sensivel.

---

## Modulo: Financeiro

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢ï¿½â¬] Fase 1 - Modelos financeiros existem em `backend/models/financeiro.py`.
[Ã¢ï¿½â¬] Fase 2 - Lancamentos, categorias, formas de pagamento e situacoes existem em `financeiro_routes.py`.
[Ã¢ï¿½â¬] Fase 3 - Relatorio de conta corrente e fluxo de caixa existem no backend e frontend.
[Ã¢ï¿½â¬] Fase 4 - Indices financeiros e cotacoes existem em `indices_financeiros_routes.py`.
[Ã¢ï¿½â¬] Fase 5 - Cenario financeiro existe em `cenario_routes.py`.
[ ] Fase 6 - Criar testes para exclusao/migracao de categorias em uso e relatorios.

Proximo passo:

* Validar lancamentos por clinica e criar testes para relatorios financeiros principais.

Observacoes:

* Modulo usa permissao `financeiro`.
* Dados financeiros sao sensiveis.
* Categorias em uso exigem cuidado antes de excluir.

---

## Modulo: Procedimentos e Tabelas

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢ï¿½â¬] Fase 1 - Modelos de procedimento, fases, materiais e tabelas existem.
[Ã¢ï¿½â¬] Fase 2 - CRUD de tabelas e procedimentos existe em `procedimentos_routes.py`.
[Ã¢ï¿½â¬] Fase 3 - Procedimentos genericos existem em `cadastros_routes.py`.
[Ã¢ï¿½â¬] Fase 4 - Dashboard e relatorio de tabela existem no backend/frontend.
[Ã¢ï¿½â¬] Fase 5 - Vinculo de materiais a procedimentos existe.
[ ] Fase 6 - Criar testes complementares para materiais vinculados, filtros por clinica e modularizacao posterior.

Proximo passo:

* Concentrar a proxima evolucao em modularizacao/refatoracao e testes complementares de materiais/vinculos; o seed canonico Brana e o signup ja foram validados.

Observacoes:

* Modulo usa permissao `procedimentos`.
* Tem relacao com materiais, prestadores, tratamentos e agenda.
* `procedimentos_routes.py` e grande e deve ser refatorado com cuidado.
* Nova conta nasce com Brana de 336 procedimentos, Tabela exemplo separada e PARTICULAR restrito a contas antigas.

---

## Modulo: Tratamentos

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢ï¿½â¬] Fase 1 - Modelo `Tratamento` existe em `backend/models/tratamento.py`.
[Ã¢ï¿½â¬] Fase 2 - Rotas existem em `backend/routes/tratamentos_routes.py`.
[Ã¢ï¿½â¬] Fase 3 - Combos de novo tratamento existem no backend.
[Ã¢ï¿½â¬] Fase 4 - Frontend possui chamadas vinculadas ao contexto de paciente/procedimentos.
[ ] Fase 5 - Testar ciclo completo de tratamento por paciente e isolamento por clinica.

Proximo passo:

* Validar criacao de tratamento a partir de paciente real e confirmar vinculos com cirurgioes/prestadores.

Observacoes:

* O contrato tecnico do modulo Tratamento ja existe em `docs/contrato_tecnico_modulo_tratamento.md`.
* O contrato de layout/comportamento da tela `Novo tratamento` ja existe em `docs/contrato_layout_comportamento_tela_novo_tratamento.md`.
* A janela `Novo tratamento` passou a consumir o endpoint `GET /tratamentos/novo/combos` ao abrir com paciente em uso, sem persistencia e sem alterar `frontend/app.js`.
* A frente Tratamento entrou em nova etapa documental com o contrato `docs/frontend_react_tratamento_analise_inicial_easy_dental.md`; o video EasyDental foi a referencia usada, nenhuma implementacao foi iniciada e a proxima validacao recomendada continua sendo a conferencia de combos e regras do Novo tratamento.
* A validacao direta do EasyDental nesta rodada ficou limitada a tela de login; o modal `Novo tratamento` continua pendente de sessao autenticada, entao os campos e regras nao puderam ser confirmados ao vivo.
* A correcao de escopo identificou `Ficha clinica` como modulo raiz acessado pelo icone da barra horizontal; foi criado o contrato documental inicial em `docs/frontend_react_ficha_clinica_analise_inicial_easy_dental.md`, com `Tratamento` e `Novo tratamento` registrados como subfluxos dependentes do prontuario.
* A validacao autenticada posterior com paciente em uso confirmou a `Ficha clinica` como shell raiz, com abas `Tratamento`, `Financeiro`, `Timeline`, `Documentos` e `Anotacoes`, grade de procedimentos e botao `Novo...` para o fluxo `Novo tratamento`; nenhuma implementacao foi feita.
* A entrada visual `Ficha clinica` e o shell inicial agora existem no `frontend-react`, com rota `/app/ficha-clinica`, paciente em uso por estado local de sessao, pesquisa visual de pacientes, abas operacionais e grade vazia de procedimentos; o build do frontend-react foi validado com sucesso e a continuidade recomendada e ligar este shell ao contexto real de paciente em uso.
* A fase FC2B refinou a geometria geral da Ficha clinica, aproximando o desktop operacional do EasyDental sem backend, banco ou migration; a proxima etapa recomendada e FC2C, focada em odontograma/arcada visual.
* A fase FC2C refinou visualmente o odontograma/arcada da Ficha clinica no `frontend-react`, mantendo tudo como placeholder visual e sem backend/banco/migration; a proxima etapa recomendada e FC2D, focada no painel Tratamento.
* A fase FC2C-2 refinou ainda mais o odontograma e a paleta clinica da Ficha clinica, com dentes, faces e categorias mais proximos da referencia; sem backend, banco ou migration, e a proxima etapa recomendada continua sendo FC2D no painel Tratamento.
* Modulo depende de paciente, procedimentos e usuarios/prestadores.
* Usa permissao `procedimentos`.
* Deve manter filtro por `clinica_id` em todos os acessos.

---

## Modulo: Prestadores

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢ï¿½â¬] Fase 1 - Modelos de prestadores existem em `prestador.py` e `prestador_odonto.py`.
[Ã¢ï¿½â¬] Fase 2 - Rotas de prestadores existem em `prestadores_routes.py`.
[Ã¢ï¿½â¬] Fase 3 - Credenciamentos e comissoes existem no backend.
[Ã¢ï¿½â¬] Fase 4 - Frontend possui tela/chamadas para prestadores.
[ ] Fase 5 - Testar credenciamentos, comissoes e vinculo com usuarios.

Proximo passo:

* Validar fluxo completo de prestador: criar, editar, vincular usuario, credenciamento e comissao.

Observacoes:

* Modulo usa permissao `prestadores`.
* Prestadores se conectam com agenda, procedimentos, convenios e usuarios.
* Existem arquivos frontend auxiliares `prestadores_*`.

---

## Modulo: Convenios, Planos e Faturamento

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢ï¿½â¬] Fase 1 - Modelos `ConvenioOdonto`, `PlanoOdonto` e `CalendarioFaturamentoOdonto` existem.
[Ã¢ï¿½â¬] Fase 2 - Rotas existem em `convenios_planos_routes.py`.
[Ã¢ï¿½â¬] Fase 3 - Frontend possui chamadas para convenios, planos e calendario.
[Ã¢ï¿½â¬] Fase 4 - Combos sao usados por pacientes/prestadores/agenda.
[ ] Fase 5 - Testar exclusao segura e dependencias com prestadores/pacientes.

Proximo passo:

* Mapear dependencias antes de permitir exclusoes em cenarios reais.

Observacoes:

* Modulo usa permissao `configuracao`.
* Tem impacto em pacientes, prestadores, agenda e financeiro.

---

## Modulo: Materiais

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢ï¿½??â¬] Fase 1 - Modelos `ListaMaterial` e `Material` existem.
[Ã¢ï¿½??â¬] Fase 2 - Rotas CRUD existem em `materiais_routes.py`.
[Ã¢ï¿½??â¬] Fase 3 - Frontend possui chamadas para listas, materiais e indices.
[Ã¢ï¿½??â¬] Fase 4 - Materiais vinculam com procedimentos.
[ ] Fase 5 - Testar vinculos antes de excluir materiais/listas.

Proximo passo:

* Criar validacao/teste para impedir quebra de procedimentos ao remover material em uso.

Observacoes:

* Modulo usa permissao `materiais`.
* Relaciona-se diretamente com procedimentos.
* O fechamento temporario da frente foi consolidado em `docs/encerramento_temporario_materiais_frontend_react.md`.
* O shell visual, a listagem principal, os modais de tabela/material, os modais proprios de confirmacao/aviso e a correcao textual de `Apresentação` ficaram registrados como estado atual validado.
* O ajuste visual recente de largura/centralizacao da tabela de `Procedimentos genericos` foi incorporado ao mesmo padrao visual compartilhado, sem reabrir a frente.
* Proximo passo: manter a frente em pausa controlada ate haver nova prioridade ou novo contrato funcional.

---
## Modulo: Medicamentos e Restricoes Terapeuticas

Status: EM DESENVOLVIMENTO

Fases:

[x] Fase 1 - Modelos `Medicamento` e `RestricaoTerapeutica` existem.
[x] Fase 2 - Rotas CRUD e opcoes existem em `medicamentos_routes.py`.
[x] Fase 3 - Frontend legado possui listagem, filtros, modal e CRUD.
[x] Fase 4 - Assistente de textos consulta medicamentos para receitas.
[x] Fase 5 - Ciclo documental de helpers do legado foi encerrado.
[x] Fase 6 - Etapa 1 da frente React modular em `Tabelas -> Medicamentos` iniciada, com rota, menu e shell estrutural.
[x] Fase 7 - Etapa 2 da frente React modular concluiu a listagem somente leitura, com filtros, selecao e contador.
[x] Fase 8 - Adequacao visual da tabela de Medicamentos ao padrao compacto de Materiais, com filtros por cabecalho, selecao circular e contador integrado ao rodape.
[x] Fase 9 - Rodape definitivo integrado, filtro completo do `TableColumnFilterHeader` consolidado no componente global e visibilidade de colunas compartilhada.
[ ] Fase 9 - Modal estrutural, inclusao, alteracao e exclusao ainda nao iniciados.

Proximo passo:

* Etapa de adequacao visual da tabela React foi concluida para alinhamento ao padrao compacto de Materiais, com filtros completos por cabecalho, selecao circular, contador no rodape, visibilidade de colunas e densidade reduzida; a correcao definitiva do rodape integrado e do filtro do cabecalho consolidado no componente global foi fechada nesta passagem; a proxima etapa recomendada e o modal estrutural sem persistencia, mantendo o contrato funcional e o plano modular criados nesta rodada.

Observacoes:

* O router atual usa `require_module_access("anamnese")` e funcoes especificas de inserir, alterar e eliminar medicamento.
* O fluxo do assistente de receitas continua dependente da consulta de medicamentos.
* A etapa de listagem React nao implementou modal, POST, PUT ou DELETE.
* A tabela React de Medicamentos agora usa o mesmo padrao compacto de Materiais como referencia visual principal.
* Os filtros de cabecalho e o contador passaram a seguir o contrato compacto consolidado, com popup compartilhando a linguagem visual do sistema, ordenacao e seccao `COLUNAS`, com rodape integrado ao quadro da tabela.
* A popup customizada de Medicamentos foi removida e o `TableColumnFilterHeader` passou a ser usado diretamente no cabecalho, com estado temporario aplicado/limpo e colunas visiveis compartilhadas alinhadas ao contrato auxiliar.
* O novo frontend deve ser modular e nao monolitico.

Atualizacao da rodada:

* Auditoria funcional de Medicamentos completada com validacao em runtime do Brana Cloud legado em `8000` e confirmacao de dependencias reais no backend e banco.
* O contrato funcional foi formalizado em `docs/contrato_funcional_medicamentos_frontend_react.md`.
* O plano modular foi formalizado em `docs/plano_implementacao_medicamentos_frontend_react.md`.
* O teste E2E real de Medicamentos foi estabilizado e passou a reprovar o cenario de restauracao quando necessario, antes da correcao final da composicao de colunas; depois da correcao minima, a mesma sequencia passou em runtime.
* A implementacao ainda nao foi iniciada.

---

## Modulo: Proteticos e Controle Protetico

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢ï¿½â¬] Fase 1 - Modelos `Protetico`, `ServicoProtetico` e `ControleProtetico` existem.
[Ã¢ï¿½â¬] Fase 2 - Rotas de proteticos existem em `proteticos_routes.py`.
[Ã¢ï¿½â¬] Fase 3 - Rotas de controle existem em `controle_proteticos_routes.py`.
[Ã¢ï¿½â¬] Fase 4 - Agenda contatos pode criar/usar proteticos.
[ ] Fase 5 - Testar ciclo completo com paciente, servico e controle.

Proximo passo:

* Validar cadastro de protetico, servicos e controle protetico por clinica.

Observacoes:

* Modulo usa permissao `procedimentos`.
* Relaciona protetico, paciente, cirurgiao e servico.

---

## Modulo: Anamnese

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢ï¿½â¬] Fase 1 - Questionarios e perguntas existem em `anamnese.py`.
[Ã¢ï¿½â¬] Fase 2 - Respostas existem em `anamnese_resposta.py`.
[Ã¢ï¿½â¬] Fase 3 - Rotas CRUD e respostas por paciente existem em `anamnese_routes.py`.
[Ã¢ï¿½â¬] Fase 4 - Frontend possui chamadas para questionarios, perguntas e respostas.
[ ] Fase 5 - Testar renumeracao, resposta por paciente e tenant.

Proximo passo:

* Criar teste/manual checklist para questionario completo: criar, inserir perguntas, responder para paciente e editar resposta.

Observacoes:

* Modulo usa permissao `anamnese`.
* Paciente, questionario, pergunta e resposta devem pertencer a mesma clinica.

---

## Modulo: Editor de Textos, Modelos, PDF e Assinatura

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢ï¿½â¬] Fase 1 - Modelos de documentos existem em `modelo_documento.py`.
[Ã¢ï¿½â¬] Fase 2 - Rotas de editor/modelos/mesclagem existem em `editor_textos_routes.py`.
[Ã¢ï¿½â¬] Fase 3 - Exportacao PDF existe em `editor_pdf_service.py`.
[Ã¢ï¿½â¬] Fase 4 - Assinatura digital/local e preparacao para Acrobat existem.
[Ã¢ï¿½â¬] Fase 5 - Assistentes de receita e atestado existem.
[ ] Fase 6 - Testar storage por clinica, PDF, assinatura e local bridge em ambiente limpo.

Proximo passo:

* Validar geracao de PDF e modelos por clinica sem gravar dados sensiveis no repositorio.

Observacoes:

* Modulo usa permissao `configuracao` no router atual.
* `storage/modelos/clinicas/` nao deve ser versionado.
* Arquivo `editor_textos_routes.py` e um dos mais sensiveis do backend.
* FASE 6 do editor: captura de Tab agora usa `editorTextosCalcularOffsetLinear` com `selection.focusNode/focusOffset` no `keydown`, antes de render/rebuild, e a reancoragem usa `posDepois.textOffset`.
* Logs de diagnostico adicionados/ajustados: `SELECTION RAW`, `OFFSET LINEAR CALCULADO` e `REANCORAGEM ALVO`.
* FASE 6.1: adicionada protecao curta de cursor durante Tab (`editorTextosProtegendoCursor`), bloqueando `editorTextosDocumentoModelAtualizar` ate o proximo frame apos a reancoragem para impedir rebuild assÃ­ncrono que recriava a selecao em offset `0`.
* FASE 6: `posDepois.cursorXPx`, `posDepois.indentXPx` e `posDepois.xPx` sao sincronizados com a indentacao do modelo, com log `CURSOR XPX SINCRONIZADO`, evitando `cursorXPx=0` quando `textOffset` ja esta correto.
* FASE 6: aplicacao visual do Tab corrigida em `editorTextosAplicarTabOperationsNoDOM`; o bloco recebe `paddingLeft` baseado no `tabStateKey` ativo e o log `TAB DOM TARGET` mostra alvo, estilo antes/depois e computed style.
* FASE 6: reforcada aplicacao CSS real do Tab com `padding-left` inline/important, `data-tab-indent-px`, log `TAB DOM STYLE CONFIRMADO` e reaplicacao apos render/update do modelo.
* FASE 6: Tab agora diferencia `paragraph-indent` e `inline-tab`; quando o cursor esta apos texto, renderiza marcador inline no ponto do cursor e evita recuar o paragrafo inteiro.
* FASE 6: marcador `inline-tab` reforcado com `data-et-tab-inline`, `data-et-tab-width`, logs `INLINE TAB INSERINDO`/`INLINE TAB DOM APOS INSERIR` e preservacao explicita no sanitizador HTML.
* FASE 6: `cursorXPx`/`modelCursorPx` de `inline-tab` passam a usar a soma `inlineTabPx` da `tabStateKey`, nao apenas a largura da ultima operacao.
* FASE 6 validada tecnicamente para Tab/Shift+Tab basico (`paragraph-indent`, `inline-tab`, preservacao de texto apos Tab e bloqueio do marcador legado); logs de diagnostico agora ficam atras da flag `EDITOR_TEXTOS_DEBUG`/`window.EDITOR_TEXTOS_DEBUG`/`brana_editor_textos_debug`. Proximo passo: validacao manual visual limpa antes da Fase 7.
* FASE 6.2 aberta: robustez do editor em conteudo rico/importado. O foco atual passa a ser estabilizar Tab/Shift+Tab em paragrafos com spans existentes, `&nbsp;`, campos `<<...>>`, imagens e marcadores legados, sem quebrar os casos simples ja aprovados.
* FASE 6.2: cleanup do render semantico foi restringido aos marcadores do motor novo (`data-et-tab-*`); spans ricos/importados e marcadores legados devem ser preservados e apenas registrados em debug quando encontrados.
* FASE 6.2: cada `inline-tab` passa a carregar `data-et-tab-offset-logico`, permitindo reinsercao no mesmo ponto logico mesmo com `\u200B`, `&nbsp;` e multiplos spans misturados no paragrafo.
* FASE 6.2: ferramenta basica de cor entrou como pendencia de formatacao. O objetivo imediato e aplicar cor em selecao sem perder `strong/em/span`, manter persistencia no HTML salvo e reabrir com a cor preservada.
* FASE 6.2: editor agora mostra mudanca visual de pagina em layout continuo. A paginacao foi implementada no frontend por quebras visuais calculadas entre blocos do `contenteditable`, com gap visivel entre paginas e preservacao do fluxo de edicao/cursor sem reescrever o editor.
* FASE 6.2: a visualizacao paginada usa a configuracao atual de papel/margens para estimar a altura util da pagina e inserir separadores visuais entre blocos quando o conteudo ultrapassa a pagina atual. Ainda e uma paginacao visual baseada no render do DOM, nao uma composicao tipografica perfeita.
* FASE 6.2: repaginacao visual estabilizada para navegacao. Setas, clique, `selectionchange`, `mouseup`, `keyup` e foco nao devem mais repaginar de forma destrutiva quando o conteudo nao mudou; a rotina agora usa assinatura do conteudo, short-circuit e tolerancia de alguns pixels para evitar oscillacao na quebra.
* FASE 6.2: refluxo bidirecional da paginacao visual refinado. Quando o conteudo cresce, blocos podem descer para a pagina seguinte; quando o conteudo diminui, os primeiros blocos da pagina seguinte devem voltar para a anterior se couberem. A distribuicao passou a ser recalculada por blocos paginaveis reais do DOM, e nao apenas por filhos diretos da raiz.
* FASE 6.2: direcao do reflow ajustada para remocao. Eventos de `Delete`/`Backspace` agora sinalizam explicitamente reflow para cima, com prioridade de refluxo e tolerancia de overflow mais favoravel para puxar conteudo da pagina seguinte quando ele voltar a caber.
* FASE 6.2: Fase 7 continua bloqueada ate que Tab em conteudo rico e cor basica estejam validados manualmente.
* FASE 6.2 continua em ajuste: conteudo rico/importado agora deve usar o modo conservador `TAB_RICH_SAFE`, inserindo apenas espaco visual seguro no ponto do cursor.
* FASE 6.2: o motor `inline-tab` model-first fica restrito a paragrafos simples; paragrafos com campos `<<...>>`, `&nbsp;`, spans legados, imagens, estilos/classes, elementos `contenteditable=false`, multiplos nodes significativos ou HTML complexo nao devem criar `span[data-et-tab-inline]` nem `\u200B` novo.
* FASE 6.2: `Shift+Tab` em conteudo rico so remove uma unidade segura inserida pelo `TAB_RICH_SAFE`; nao deve executar cleanup `INLINE TAB SHIFT CLEANUP`, remover spans, imagens ou campos.
* FASE 6.2: cor do texto continua pendente para validacao separada; esta correcao prioriza estabilidade de Tab/Shift+Tab em conteudo rico.
* FASE 6.2: Fase 7 continua bloqueada ate validacao manual real de Tab/Shift+Tab em texto simples, modelo rico com Whatsapp, campos e imagens/cabecalho.
* FASE 6.2 segue em estabilizacao: o `inline-tab` antigo com `span[data-et-tab-inline]` + `\u200B` foi desativado temporariamente para novas tabulacoes inline.
* FASE 6.2: Tab seguro passa a ser o padrao para qualquer Tab apos texto; o motor de recuo de paragrafo fica reservado para inicio absoluto de paragrafo/linha ou bloco vazio.
* FASE 6.2: marcadores proprios antigos (`span[data-et-tab-inline]`, `span[data-et-tab-pad]`, `editor-textos-sem-tab-pad`) devem ser convertidos de forma conservadora para espacos visuais seguros no carregamento/persistencia.
* FASE 6.2: cor de texto passa a ser correcao obrigatoria antes da Fase 7; a aplicacao deve preservar spans/strong/em e persistir `style="color: ..."`.
* FASE 6.2: Fase 7 continua bloqueada ate validacao manual completa de Tab seguro, Shift+Tab, modelos reais e cor de texto salva/reaberta.
* FASE 6.2: Tab SAFE esta praticamente estabilizado nos testes recentes; a prioridade ativa passou a ser a preservacao/restauracao da selecao real para cor de texto.
* FASE 6.2: cor de texto agora usa snapshot de selecao do editor antes do dropdown roubar foco; validacao recente indicou aplicacao correta e persistencia.
* FASE 6.2: Fase 7 continua bloqueada; a pendencia ativa agora e validar insercao de campo de mesclagem respeitando cursor/selecao reais.
* FASE 6.2: cor de texto passou nos testes recentes com snapshot/restauracao de selecao antes do dropdown roubar foco.
* FASE 6.2: pendencia ativa aberta para insercao de campo de mesclagem respeitar cursor/selecao reais; o fluxo deve usar snapshot especifico antes do modal/dropdown roubar foco e restaurar o Range antes de inserir `<<...>>`.
* FASE 6.2: Fase 7 continua bloqueada ate validar insercao de campo em documento simples, modelo `.MOD` real, proximo de campos existentes e proximo de texto colorido/formatado.
* CHECKPOINT - FASE 6 / ABERTURA DE MODELOS ANTIGOS: regressao de abertura corrigida no projeto ativo `D:\BRANA ARQUIVOS\BRANA CLOUD`. O backend agora resolve modelos nesta ordem: caminho clinico registrado, busca recursiva em `storage/modelos/clinicas/{clinica_id}`, fallback base compativel e vazio apenas se nada existir.
* CHECKPOINT - FASE 6 / ABERTURA DE MODELOS ANTIGOS: validacao da clinica `1` resultou em `126` modelos analisados, `110` resolvidos por fallback recursivo, `10` por fallback base e `6` sem arquivo util, todos auxiliares/nao textuais. Ver `docs/relatorio_modelos_clinica_1_mapeamento_arquivos.md`.
* CHECKPOINT - FASE 6 / ABERTURA DE MODELOS ANTIGOS: o conteudo volta a abrir no navegador, mas a formatacao legada de `.rtf`/`.mod`/`.doc`/`.docx` ainda nao e preservada integralmente. Modelos importantes devem ser reformatados no editor novo ou passar por conversao futura.
* FASE 6.2: regressao da lista de campos de mesclagem diagnosticada; a rota `GET /editor-textos/campos` caia em `MERGE_FIELDS_LEGACY` porque `backend/data/editor_textos_mesclagem_snapshot.json` nao existia, reduzindo a lista para 9 campos.
* FASE 6.2: fonte completa restaurada a partir de `storage/modelos/clinicas/1/MergeList.tmp`; snapshot `backend/data/editor_textos_mesclagem_snapshot.json` criado com 107 campos e 9 grupos (`Atestado`, `Data`, `Clinica`, `Cirurgiao`, `Paciente`, `Contato`, `Receita`, `Recibo`, `Etiqueta`).
* FASE 6.2: `_load_merge_fields_payload()` agora prioriza `snapshot_json`, depois fallback direto para `merge_list_tmp` e somente por ultimo `legacy_fallback`; a rota validada usa `snapshot_json` e preserva o campo adicional de assinatura digital existente.
* FASE 6.2: Fase 7 continua bloqueada; esta restauracao nao iniciou Fase 7 e nao alterou Tab SAFE, cor do texto, insercao de campo, banco ou backend de modelos.
* FASE 6.2: persistencia de fonte e tamanho corrigida no editor. Fonte/tamanho deixam de usar `execCommand("fontName"/"fontSize")` como caminho principal e passam a envolver selecao real em `span style="font-family: ..."` e/ou `span style="font-size: ..."` com snapshot/restauracao de selecao.
* FASE 6.2: salvamento passa a detectar formatacao rica (`font-family`, `font-size`, `color`, negrito/italico/sublinhado etc.) e persistir HTML mesmo em texto branco `.txt`, evitando perda de estilos ao salvar/reabrir.
* FASE 6.2: Fase 7 continua bloqueada ate validacao manual real de fonte/tamanho em documento simples, modelo real e combinacao com cor.
* FASE 6.2: pendencia de fonte/tamanho isolada em selecao multi-bloco. O editor agora detecta selecoes atravessando multiplos paragrafos/blocos, divide a aplicacao por bloco e so declara sucesso quando ao menos um span real de fonte/tamanho e criado no DOM.
* FASE 6.2: dropdowns de fonte/tamanho passam a usar estado neutro em selecao multi-bloco com estilos mistos, evitando exibir valor unico enganoso.
* FASE 6.2: corrigida pendencia especifica de merge de estilos inline entre `font-family` e `font-size`; ao aplicar fonte ou tamanho, o editor preserva os estilos existentes relevantes (`color`, `font-family`, `font-size`) em selecoes simples e multi-bloco.
* FASE 6.2: Fase 7 continua bloqueada ate validacao manual de fonte/tamanho em selecao curta, multi-bloco, alternancia entre dropdowns e selecao envolvendo campos de mesclagem.
* FASE 6.2: modal de campos de mesclagem refinado com deduplicacao visual por alias historico (ex.: `Data.Mï¿½sExtenso` oculto em favor de `Data.Mï¿½sExt`), mantendo token principal de insercao e sem alterar a fonte primaria restaurada.
* FASE 6.2: coluna de descricao do modal passa a exibir rï¿½tulos amigaveis na categoria Data (`Ano atual`, `Data atual`, `Dia atual`, `Dia da semana`, `Mï¿½s atual`, `Mï¿½s por extenso`) e renderizacao visual da grade foi ajustada para melhorar leitura de Campo/Descricao.
* FASE 6.2: Fase 7 continua bloqueada ate validacao visual final do modal de mesclagem, incluindo deduplicacao, descricoes amigaveis e insercao real no editor.
* FASE 6.2: sincronizacao do dropdown de tamanho corrigida para priorizar leitura do `font-size` CSS efetivo da selecao (em vez da escala legada de `queryCommandValue("fontSize")`), evitando salto/desalinhamento entre 8/9/10/11 e mantendo estado neutro em selecao multi-bloco mista.
* FASE 6.2: Fase 7 continua bloqueada ate validacao manual final da barra de tamanho (8, 9, 10, 11, 12 e transicoes alternadas) em selecao simples e multi-bloco.
* FASE 6.2: implementado estilo pendente de digitacao no editor (`pendingInlineStyle`) para cor/fonte/tamanho com cursor colapsado; escolhas feitas antes de digitar passam a ser aplicadas no texto novo via `beforeinput`, sem depender de selecao expandida.
* FASE 6.2: toolbar agora sincroniza estado pendente vs estilo efetivo do cursor com logs de diagnostico (`EDITOR PENDING STYLE SET/APPLY/CLEARED` e `EDITOR CURRENT INLINE STYLE SYNC`), mantendo Fase 7 bloqueada ate validacao manual final desse fluxo.
* FASE 6.2: causa raiz da dessintonia do dropdown de tamanho confirmada como conflito entre `cssFontSizeRaw/cssMapped` e escala legada de `queryCommandValue("fontSize")` (`cmdRaw/cmdMapped`); a toolbar passa a decidir o tamanho final apenas por CSS real, mantendo `cmdRaw/cmdMapped` apenas para log diagnostico.
* FASE 6.2: `pendingInlineStyle` estabilizado com assinatura por bloco (`pendingInlineStyleBlockSignature`) e decisoes explicitas de manter/limpar (`EDITOR PENDING STYLE KEEP` / `EDITOR PENDING STYLE CLEAR DECISION`), evitando limpeza precoce em `selectionchange` da propria digitacao.
* FASE 6.2: corrigida perda de pending style no reentry/focus do editor antes da digitacao; toolbar agora preserva cor/fonte/tamanho pendentes ao voltar para o mesmo contexto e registra decisoes de reentry (`EDITOR PENDING STYLE REENTRY KEEP/CLEAR`) e de sync (`EDITOR TOOLBAR SYNC SKIPPED_FOR_PENDING` / `EDITOR TOOLBAR SYNC APPLIED`).
* FASE 6.2: Fase 7 continua bloqueada ate validacao manual final de tamanho 8/9/10/11/12 e fluxo de digitacao com estilo pendente (cor/fonte/tamanho).
* CHECKPOINT - FASE 6.2 / PAGINACAO VISUAL: correcao estrutural da quebra de pagina do Editor de Textos validada no projeto ativo `D:\BRANA ARQUIVOS\BRANA CLOUD`. O fluxo real da quebra passou a fechar com `breakCount: 1`, `effectiveCount: 1`, `persistedTransitionCount: 1`, `beforeSampleCountReal: 3`, `afterSampleCountReal: 3`, `VISUAL_SPACING_AUDIT_RESULT stable: true`, `POST_COMMIT_SPACING_STABLE stable: true` e `LINE_SPACING_PRESERVED`.
* CHECKPOINT - FASE 6.2 / REFLOW-UP MANUAL: validado visualmente no modelo `ATESTADO_TEL_BRANA`. No cenario manual correto, com cursor no primeiro conteudo real da pagina 2 e `Backspace` em ciclo limpo, o console registrou `EDITOR PAGE BLOCK MOVED_PREV`, `EDITOR PAGE REFLOW UP RESULT` com `movedPrevCount: 1`, retorno para `breakCount: 0`, `POST_COMMIT_SPACING_STABLE stable: true`, `LINE_SPACING_PRESERVED` e `POST_COMMIT_LINEHEIGHT_CHECK preserved: true`.
* CHECKPOINT - FASE 6 / ABERTURA DE MODELOS ANTIGOS: Fase 7 ainda nao iniciada.

---

## Modulo: Etiquetas e Relatorios

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢ï¿½â¬] Fase 1 - Modelos de etiqueta existem.
[Ã¢ï¿½â¬] Fase 2 - Rotas de etiquetas existem em `etiquetas_routes.py`.
[Ã¢ï¿½â¬] Fase 3 - Configuracao de relatorio existe em `relatorio_config.py` e `preferences_routes.py`.
[Ã¢ï¿½â¬] Fase 4 - Envio de relatorio por email existe em `relatorios_routes.py`.
[ ] Fase 5 - Testar email, anexos e limites de tamanho.

Proximo passo:

* Validar envio de email em ambiente de teste com SMTP/Resend configurado.

Observacoes:

* Etiquetas usam permissao `relatorios`.
* Relatorios e anexos podem conter dados sensiveis.
* `EMAIL_ATTACHMENT_MAX_MB` controla limite de anexo.

---

## Modulo: Preferencias e Opcoes do Sistema

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢ï¿½â¬] Fase 1 - Preferencias gerais, modelos, ambiente, dados do usuario, odontograma e relatorio existem.
[Ã¢ï¿½â¬] Fase 2 - Rotas de preferencias existem em `preferences_routes.py`.
[Ã¢ï¿½â¬] Fase 3 - Opcoes do sistema existem em `system_options_routes.py`.
[Ã¢ï¿½â¬] Fase 4 - Frontend possui chamadas para salvar preferencias.
[ ] Fase 5 - Testar impacto das opcoes de seguranca sobre permissoes e senha administrativa.

Proximo passo:

* Validar opcoes de seguranca por clinica e confirmar que nao abrem acesso indevido.

Observacoes:

* Modulo usa permissao `configuracao`.
* Opcoes podem alterar comportamento de controle de usuarios.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 1

- A frente `Preferencias / Configuracoes comuns` foi iniciada documentalmente.
- A classificacao registrada e `core / comum`.
- A escolha veio da reavaliacao pos-`Agenda principal`.
- A `Agenda principal` fica temporariamente pausada apos as extraicoes ja validadas.
- A `Agenda de contatos` permanece pausada/consolidada.
- Nenhum codigo foi alterado.
- Nenhum arquivo de frontend, backend, banco, endpoints, seeds ou permissoes foi alterado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Preferencias / Configuracoes comuns - Subetapa 2 - Mapeamento tecnico detalhado por leitura`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 2

- A Subetapa 2 foi concluida como etapa exclusivamente documental.
- O mapeamento tecnico detalhado foi realizado por leitura.
- Nenhum codigo foi alterado.
- `Preferencias / Configuracoes comuns` continua como `core / comum`.
- A `Agenda principal` permanece pausada temporariamente.
- A `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e o isolamento documental dos candidatos mais seguros.

---

## Modulo: Licenca, Planos e Pagamentos

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢ï¿½â¬] Fase 1 - Modelos de planos, assinaturas e plataforma existem.
[Ã¢ï¿½â¬] Fase 2 - Rotas de licenca existem em `licenca_routes.py`.
[Ã¢ï¿½â¬] Fase 3 - Checkout, confirmacao, sincronizacao e webhook Mercado Pago existem no codigo.
[Ã¢ï¿½â¬] Fase 4 - Frontend possui chamadas para licenca e checkout.
[ ] Fase 5 - Testar fluxo completo com Mercado Pago em sandbox e validar webhook.

Proximo passo:

* Configurar ambiente sandbox e validar checkout, retorno, sincronizacao e webhook sem dados reais.

Observacoes:

* Depende de `MERCADOPAGO_ACCESS_TOKEN` e URLs publicas quando usado fora do local.
* Webhook precisa de hardening antes de exposicao publica.

---

## Modulo: Superadmin da Plataforma

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢ï¿½â¬] Fase 1 - Rotas de overview, clinicas, usuarios, cobrancas, auditoria e assinaturas existem.
[Ã¢ï¿½â¬] Fase 2 - Servico de administracao de plataforma existe em `platform_admin_service.py`.
[Ã¢ï¿½â¬] Fase 3 - Frontend possui chamadas para `/superadmin/*`.
[Ã¢ï¿½â¬] Fase 4 - Alteracoes de status/plano/trial e reset de senha existem no codigo.
[ ] Fase 5 - Testar autorizacao de superadmin e impedir acesso por admin comum.

Proximo passo:

* Criar teste de acesso: superadmin permitido, admin de clinica negado, usuario comum negado.

Observacoes:

* Modulo atravessa clinicas e e altamente sensivel.
* Nao alterar sem revisar regras em `security/superadmin.py` e `superadmin_routes.py`.

---

## Frente: Integracao e migracao modular do Painel ADM para o frontend React

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢ï¿½â¬] Auditoria tecnica inicial - concluida.
[Ã¢ï¿½â¬] Inventario funcional do legado - concluido.
[Ã¢ï¿½â¬] Contrato de arquitetura modular - concluido.
[Ã¢ï¿½â¬] Fundacao do modulo ADM React - concluida.
[Ã¢ï¿½â¬] Item ADM no menu superior - concluido.
[Ã¢ï¿½â¬] Rota protegida e autorizacao - concluida.
[Ã¢ï¿½â¬] Layout e navegacao administrativa - concluida.
[Ã¢ï¿½â¬] Mapeamento exaustivo de campos e funcoes - concluido.
[Ã¢ï¿½â¬] Matriz de paridade legado -> React - concluida.
[Ã¢ï¿½â¬] Plano funcional de migracao modular - concluido.
[Ã¢ï¿½â¬] Refinamento visual da fundacao - concluido.
[ ] Migracao do primeiro modulo administrativo - pendente.
[ ] Migracao incremental dos demais modulos - pendente.
[Ã¢ï¿½â¬] Testes locais - concluidos.
[Ã¢ï¿½â¬] Encerramento documental - concluido.
[ ] Commit seletivo - pendente.
[ ] Push para GitHub - pendente.
[ ] Publicacao e validacao AWS - pendente.
[ ] Desativacao futura do painel ADM legado - somente apos paridade comprovada.

Proximo passo:

* Iniciar a migracao funcional do dashboard/visao geral ou da frente de Clinicas, conforme a priorizacao operacional da proxima frente.

Observacoes:

* O painel ADM novo e uma feature propria do React.
* O legado permanece apenas como referencia de auditoria e comportamento.
* A migracao futura deve seguir modularidade e teste por area.

---

## Modulo: Frontend Web

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢ï¿½â¬] Fase 1 - Frontend estatico servido por `backend/main.py` em `/app` e `/frontend`.
[Ã¢ï¿½â¬] Fase 2 - Login, token, chamadas autenticadas e varias telas operacionais existem em `frontend/app.js`.
[Ã¢ï¿½â¬] Fase 3 - Arquivos auxiliares de prestadores, agenda, preferencias e dialogo de fonte existem.
[ ] Fase 4 - Modularizar `frontend/app.js` por dominio.
[ ] Fase 5 - Criar testes/smoke de interface para fluxos principais.

Proximo passo:

* Iniciar modularizacao pelo menor dominio seguro, mantendo `requestJson`, auth e estado compartilhado intactos.

Observacoes:

* `frontend/app.js` tem mais de 23 mil linhas.
* Mudancas devem ser pequenas e testadas manualmente no navegador.
* Frontend nao e barreira de seguranca.
* Subetapa 1 de Usuarios/Admin concluida: helpers visuais de senha foram extraidos para `frontend/js/modules/users-admin-modal-visual.js`, mantendo o comportamento funcional e os fluxos sensiveis fora do recorte.
* Usuarios/Admin - Subetapa 3 concluida: `usersAtualizarAcoesToolbar()` extraida para `frontend/js/modules/users-admin-modal-visual.js`, mantendo wrapper fino em `frontend/app.js` e sem alterar salvar, senha interna, permissoes, perfis, backend, banco, seeds ou textos visiveis.

---

## Modulo: Banco, Schema e Bootstrap

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢ï¿½â¬] Fase 1 - Conexao PostgreSQL implementada em `backend/database.py`.
[Ã¢ï¿½â¬] Fase 2 - Modelos SQLAlchemy implementados em `backend/models/`.
[Ã¢ï¿½â¬] Fase 3 - `Base.metadata.create_all` e hotfixes aditivos existem no startup.
[Ã¢ï¿½â¬] Fase 4 - Bootstrap runtime existe em `runtime_bootstrap_service.py`.
[ ] Fase 5 - Criar migrations formais versionadas.

Proximo passo:

* Implantar Alembic ou ferramenta equivalente e transformar hotfixes de schema em migrations controladas.

Observacoes:

* `DATABASE_URL` e obrigatoria.
* Nao ha migrations formais hoje.
* Nao executar alteracoes destrutivas sem backup e aprovacao.

---

## Modulo: Integracoes Externas

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢ï¿½â¬] Fase 1 - Email SMTP/Resend existe em `email_service.py`.
[Ã¢ï¿½â¬] Fase 2 - Google OAuth/Calendar existe em `auth_routes.py` e `google_calendar_service.py`.
[Ã¢ï¿½â¬] Fase 3 - Mercado Pago existe em `licenca_routes.py`.
[Ã¢ï¿½â¬] Fase 4 - WhatsApp aparece no fluxo de avisos da agenda.
[Ã¢ï¿½â¬] Fase 5 - Assinatura PDF possui variaveis e servico dedicados.
[ ] Fase 6 - Criar checklist de configuracao e teste para cada integracao.

Proximo passo:

* Documentar e testar cada integracao em ambiente sandbox/local sem credenciais reais versionadas.

Observacoes:

* Variaveis sensiveis nunca devem entrar no Git.
* Integracoes podem falhar sem impedir todo o sistema, mas devem gerar erro claro ao usuario.

---

## Modulo: Testes Automatizados

Status: NAO INICIADO

Fases:

[ ] Fase 1 - Definir ferramenta de testes backend.
[ ] Fase 2 - Criar teste de startup/import com `.env`.
[ ] Fase 3 - Criar testes de login e `/me`.
[ ] Fase 4 - Criar testes de tenant para pacientes, agenda e financeiro.
[ ] Fase 5 - Criar smoke test de frontend.

Proximo passo:

* Escolher estrategia minima de testes e iniciar por login, `/me` e isolamento por `clinica_id`.

Observacoes:

* A ausencia de testes automatizados aumenta risco de regressao.
* Antes de refatorar frontend ou rotas grandes, criar pelo menos smoke tests.

---

## Prioridade Recomendada

1. Testes de autenticacao e multi-tenant.
2. Migrations formais.
3. Testes de pacientes, agenda e financeiro.
4. Modularizacao gradual do frontend.
5. Refatoracao de rotas grandes para servicos menores.
6. Hardening de webhooks e integracoes externas.

---

## Atualizacao Editor de Textos - Salvar como

- Modal proprio de "Salvar como" implementado no frontend (sem prompt nativo).
- Fluxo agora coleta nome do arquivo/modelo e tipo: `.MOD`, `.RTF`, `.TXT`, `PDF`.
- `PDF` tratado como exportacao nao editavel (nao simula salvamento editavel de modelo).
- Fluxo de salvar documento existente permanece inalterado para `Salvar`.
- Fase 7 continua bloqueada.

## Atualizacao Preferencias e Opcoes do Sistema - Subetapa 8

- Subetapa 8 concluida documentalmente: plano minimo por linha/trecho.
- Candidato mantido: leitura isolada de preferencias de usuario sem escrita.
- Nenhuma autorizacao de codigo concedida ainda.
- A frente continua em refinamento documental antes de qualquer patch.

## Atualizacao Preferencias e Opcoes do Sistema - Subetapa 9

- Subetapa 9 documental concluida: consolidacao e pausa tecnica da frente.
- Frente pausada/consolidada neste momento.
- Nenhum codigo foi alterado.
- Proxima frente recomendada: Cadastros Gerais.
- Proxima subetapa recomendada: Cadastros Gerais - Subetapa 1 - Contrato funcional e classificacao multiarea.

## Atualizacao Cadastros Gerais - Subetapa 1

- Subetapa 1 iniciada documentalmente para a frente `Cadastros Gerais`.
- Frente aberta sem alteracao de codigo.
- Classificacao multiarea registrada: `mista`.
- Contrato funcional inicial documentado.
- Nao houve alteracao em `frontend/app.js`, `frontend/index.html`, `frontend/js/modules`, backend, banco, schema, migrations, seeds ou endpoints.
- Nenhum controle multiarea foi implementado.
- Proxima subetapa recomendada: `Cadastros Gerais - Subetapa 2 - Mapa documental de fronteiras por dominio e dependencias de permissao`.
- A frente `Preferencias e Opcoes do Sistema` permanece pausada/consolidada.

## Atualizacao Cadastros Gerais - Subetapa 2

- Subetapa 2 criada documentalmente para a frente `Cadastros Gerais`.
- Mapa de fronteiras por dominio e dependencias de permissao concluido.
- Nenhuma alteracao de codigo foi feita.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- A classificacao multiï¿½rea herdada permanece `mista`.
- Proxima subetapa recomendada: continuidade documental em `Auxiliares / Tabelas auxiliares`.
- O primeiro recorte funcional segue proibido nesta etapa.

## Atualizacao Reavaliacao Modulos Frontend Sem Modularizacao

- Reavaliacao documental dos modulos frontend sem modularizacao real concluida.
- A decisao do usuario de tratar todos os modulos como `core / comum` foi registrada.
- `Cadastros Gerais / Auxiliares` nao foi continuado nesta etapa.
- Nenhum codigo foi alterado.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- Modulo recomendado para a proxima etapa documental: `Agenda de contatos`.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 1 - Contrato funcional e fronteiras documentais`.

## Atualizacao Agenda de Contatos

- Inicio documental do modulo `Agenda de contatos` registrado.
- `Agenda de contatos` foi tratada como `core / comum`.
- A Subetapa 1 foi criada sem alteracao de codigo.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 2 - Mapa documental de dependencias com agenda principal, agenda legado e tenant`.

## Prestadores - Nova frente React

- Auditoria funcional e tecnica da nova frente `Prestadores` concluida para o caminho `Cadastro -> Corpo clinico`.
- A frente ganhou a rota autenticada `Cadastro -> Corpo clinico` no frontend React com shell inicial em L.
- A implementacao atual cobre apenas a estrutura visual e de navegacao inicial.
- A correção visual desta etapa alinhou barra, tabela, seleção, filtros e contador ao padrão de `Tabelas -> ServiÃ§os de ProtÃ©tico`.
- A documentacao base desta nova frente foi registrada em:
  - `docs/auditoria_prestadores_frontend_legado_backend_easydental.md`
  - `docs/contrato_implementacao_prestadores_frontend_react.md`
- O contrato da nova frente preserva a separacao entre listagem principal, modal de cadastro e os fluxos isolados de `Agenda`, `Convênios` e `Comissões`.
- Dependencias e riscos principais continuam restritos ao frontend desta etapa.
- Nenhum backend, banco, payload ou CRUD foi alterado nesta etapa.
- Listagem real, especialidades reais, pesquisa real e demais acoes continuam pendentes.

## Atualizacao Agenda de Contatos - Subetapa 2

- Subetapa 2 de `Agenda de contatos` criada documentalmente.
- Mapa de dependencias com agenda principal, agenda legado e tenant concluido.
- O modulo continua tratado como `core / comum`.
- Nenhuma alteracao de codigo foi feita.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 3 - Mapa documental do fluxo de listagem, filtros e carregamento de apoio`.

## Atualizacao Agenda de Contatos - Subetapa 3

- Subetapa 3 de `Agenda de contatos` criada documentalmente.
- Mapa do fluxo de listagem, filtros e carregamento de apoio concluido.
- O modulo continua tratado como `core / comum`.
- Nenhuma alteracao de codigo foi feita.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- O menor recorte futuro possivel foi registrado como hipotese documental.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 4 - Mapa documental do carregamento de apoio visual e fronteiras de UI`.

## Atualizacao Agenda de Contatos - Subetapa 4

- Subetapa 4 de `Agenda de contatos` criada documentalmente.
- Mapa de apoio visual/UI concluido.
- O modulo continua tratado como `core / comum`.
- Nenhuma alteracao de codigo foi feita.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- O primeiro recorte funcional minimo foi mantido apenas como plano documental.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 5 - Plano documental do primeiro recorte funcional minimo com helper visual puro`.

## Atualizacao Agenda de Contatos - Subetapa 5

- Subetapa 5 de `Agenda de contatos` criada documentalmente.
- Plano do primeiro recorte funcional minimo com helper visual puro registrado.
- O modulo continua tratado como `core / comum`.
- Nenhuma alteracao de codigo foi feita.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 6 - Implementacao minima do helper visual puro`.

## Atualizacao Agenda de Contatos - Subetapa 6

- Subetapa 6 de `Agenda de contatos` concluida com implementacao minima.
- Helper visual puro `agendaContatosTelefonesTexto` extraido para modulo proprio.
- Wrapper compatï¿½vel preservado em `frontend/app.js`.
- `Agenda de contatos` continua tratada como `core / comum`.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 7 - Validacao documental da separacao do helper visual e do wrapper no app.js`.

## Atualizacao Agenda de Contatos - Subetapa 6b

- Correcao da regressao visual do icone de telefone em `Agenda de contatos` registrada.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- Nenhuma nova modularizacao foi criada.
- Teste manual obrigatorio antes de prosseguir.

## Atualizacao Agenda de Contatos - Subetapa 7

- Validacao manual da correcao 6B registrada como bem-sucedida.
- Subetapa 7 criada documentalmente.
- Plano do segundo recorte funcional minimo registrado.
- `Agenda de contatos` continua tratada como `core / comum`.
- Nenhuma alteracao de codigo foi feita.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 8 - Plano documental da separacao da logica pura de filtragem e da coleta de contexto da UI`.

## Atualizacao Agenda de Contatos - Subetapa 8

- Subetapa 8 criada documentalmente.
- Separacao planejada entre logica pura de filtragem e coleta de contexto da UI registrada.
- O modulo continua tratado como `core / comum`.
- Nenhuma alteracao de codigo foi feita.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 9 - Implementacao minima da logica pura de filtragem`.

## Atualizacao Agenda de Contatos - Subetapa 9

- Subetapa 9 implementada com extracao minima da logica pura de filtragem.
- O modulo continua tratado como `core / comum`.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- Proximo teste manual obrigatorio antes de prosseguir.
- Proxima subetapa recomendada somente apos validacao manual.

## Atualizacao Agenda de Contatos - Subetapa 10

- Validacao manual da Subetapa 9 registrada como bem-sucedida.
- Subetapa 10 criada documentalmente.
- Plano do terceiro recorte funcional minimo registrado.
- O modulo continua tratado como `core / comum`.
- Nenhuma alteracao de codigo foi feita.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 11 - Implementacao minima da geracao pura de opcoes de filtro de tipos`.

## Atualizacao Agenda de Contatos - Subetapa 11

- Subetapa 11 implementada com extracao minima da geracao pura de opcoes de filtro de tipos.
- O modulo continua tratado como `core / comum`.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- `frontend/index.html` nao precisou ser alterado.
- Proximo teste manual obrigatorio antes de prosseguir.
- Proxima subetapa recomendada somente apos validacao manual.

## Atualizacao Agenda de Contatos - Subetapa 12

- Validacao manual da Subetapa 11 registrada como bem-sucedida.
- Subetapa 12 criada documentalmente.
- Plano de fronteiras da renderizacao da lista registrado.
- O modulo continua tratado como `core / comum`.
- Nenhuma alteracao de codigo foi feita.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 13 - Plano documental da montagem da linha da lista`.

## Atualizacao Agenda de Contatos - Subetapa 13

- Subetapa 13 criada documentalmente.
- Plano de montagem da linha da lista registrado.
- O modulo continua tratado como `core / comum`.
- Nenhuma alteracao de codigo foi feita.
- Nenhuma alteracao de backend, banco, endpoint ou permissao foi feita.
- Proxima subetapa recomendada: `Agenda de contatos - Subetapa 14 - Implementacao minima da montagem pura da linha da lista`.

## Atualizacao Agenda de Contatos - Subetapa 14

- Subetapa 14 implementada com extracao minima da montagem pura da linha da lista.
- O modulo continua tratado como `core / comum`.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- `frontend/index.html` nao foi alterado.
- Proximo teste manual obrigatorio antes de prosseguir.
- Proxima subetapa recomendada somente apos validacao manual.

## Atualizacao Agenda de Contatos - Subetapa 15

- Validacao manual da Subetapa 14 registrada como bem-sucedida.
- Subetapa 15 criada documentalmente.
- Consolidacao dos recortes de `Agenda de contatos` registrada.
- A frente foi considerada pausada/consolidada.
- O modulo continua tratado como `core / comum`.
- Nenhuma alteracao de codigo foi feita.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- Proxima frente recomendada: `Agenda principal`.
- Proxima subetapa recomendada: `Agenda principal - Subetapa 1 - Contrato funcional e fronteiras documentais`.

## Atualizacao Agenda Principal - Subetapa 1

- Inicio documental da frente `Agenda principal` registrado.
- `Agenda de contatos` permanece pausada/consolidada.
- Subetapa 1 criada documentalmente.
- A frente continua tratada como `core / comum`.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em `frontend/app.js`, `frontend/index.html`, `frontend/js/modules`, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- Nenhum controle multiarea foi implementado.
- Proxima subetapa recomendada: `Agenda principal - Subetapa 2 - Mapa documental dos fluxos de abertura, modos dia/semana, proximo agendado, avisos e fronteiras com agenda legado`.

## Atualizacao Agenda Principal - Subetapa 2

- Subetapa 2 criada documentalmente para `Agenda principal`.
- O mapa de abertura, modos dia/semana, proximo agendado, avisos e fronteira com agenda legado foi registrado.
- `Agenda principal` continua tratada como `core / comum`.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- Nenhum helper foi escolhido.
- Nenhum patch foi autorizado.
- Proxima subetapa recomendada: `Agenda principal - Subetapa 3 - Plano documental do primeiro helper puro candidato, com avaliacao de risco e fronteira de extracao`.

## Atualizacao Agenda Principal - Subetapa 3

- Subetapa 3 criada documentalmente para `Agenda principal`.
- Os candidatos a helper puro foram reavaliados.
- O primeiro helper recomendado para futura implementacao foi `agendaLegadoNumOrNull`.
- `Agenda principal` continua tratada como `core / comum`.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- Nenhum helper foi implementado.
- Nenhum patch foi autorizado.
- Proxima subetapa recomendada: `Agenda principal - Subetapa 4 - Implementacao minima do helper puro agendaLegadoNumOrNull e validacao manual do fluxo de agenda legado`.

## Atualizacao Agenda Principal - Subetapa 4

- Primeira extracao minima de helper puro concluida.
- O helper extraido foi `agendaLegadoNumOrNull`.
- `Agenda principal` continua tratada como `core / comum`.
- `Agenda de contatos` permanece pausada/consolidada.
- Os arquivos de codigo alterados foram `frontend/app.js`, `frontend/index.html` e `frontend/js/modules/agenda-principal-legado-utils.js`.
- Nenhum backend, banco, schema, migration, seed, endpoint ou permissao foi alterado.
- A blindagem textual/mojibake foi respeitada.
- Proxima subetapa recomendada: `Agenda principal - Subetapa 5 - Validacao manual da extracao do helper agendaLegadoNumOrNull e revisao do primeiro impacto funcional`.

## Atualizacao Agenda Principal - Subetapa 5

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 5 foi executada como validacao e revisao de impacto da extracao anterior.
- Nenhuma nova extracao foi realizada.
- Nenhuma alteracao funcional nova foi aplicada.
- O helper `agendaLegadoNumOrNull` permanece como a primeira extracao minima da frente.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migration, seed, endpoint ou permissao foi alterado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e o planejamento documental do segundo helper puro de menor risco.

## Atualizacao Agenda Principal - Subetapa 6

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 6 foi executada apenas como planejamento documental do segundo helper puro.
- O segundo candidato recomendado para futura implementacao foi `agendaLegadoFmtHora`.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a implementacao minima de `agendaLegadoFmtHora` com validacao manual do impacto visual.

## Atualizacao Agenda Principal - Subetapa 7

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 7 concluiu a segunda extracao minima de helper puro.
- O helper extraido foi `agendaLegadoFmtHora`.
- Os arquivos de codigo alterados foram `frontend/app.js` e `frontend/js/modules/agenda-principal-legado-utils.js`.
- `frontend/index.html` nao foi alterado nesta etapa.
- `agendaLegadoNumOrNull` nao foi alterado.
- Nenhum backend, banco, schema, migration, seed, endpoint ou permissao foi alterado.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a validacao manual da extracao de `agendaLegadoFmtHora` no impacto visual da agenda legado.

## Atualizacao Agenda Principal - Subetapa 8

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 8 foi executada como validacao e revisao de impacto visual da extracao anterior.
- Nenhuma nova extracao foi realizada.
- Nenhuma alteracao funcional nova foi aplicada.
- O helper `agendaLegadoFmtHora` permanece como a segunda extracao minima.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migration, seed, endpoint ou permissao foi alterado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e o planejamento documental do terceiro helper puro de menor risco.

## Atualizacao Agenda Principal - Subetapa 9

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 9 foi executada apenas como planejamento documental do terceiro helper puro.
- O terceiro candidato recomendado para futura implementacao foi `agendaLegadoFmtDataInput`.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a implementacao minima de `agendaLegadoFmtDataInput` com validacao manual do impacto visual no modal da agenda legado.

## Atualizacao Agenda Principal - Subetapa 10

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 10 concluiu a terceira extracao minima de helper puro.
- O helper extraido foi `agendaLegadoFmtDataInput`.
- Os arquivos de codigo alterados foram `frontend/app.js` e `frontend/js/modules/agenda-principal-legado-utils.js`.
- `frontend/index.html` nao foi alterado nesta etapa.
- `agendaLegadoNumOrNull` nao foi alterado.
- `agendaLegadoFmtHora` nao foi alterado.
- Nenhum backend, banco, schema, migration, seed, endpoint ou permissao foi alterado.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a validacao manual da extracao de `agendaLegadoFmtDataInput` no impacto visual do modal da agenda legado.

## Atualizacao Agenda Principal - Subetapa 11

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 11 foi executada como validacao e revisao de impacto visual no modal.
- Nenhuma nova extracao foi realizada.
- Nenhuma alteracao funcional nova foi aplicada.
- O helper `agendaLegadoFmtDataInput` permanece como a terceira extracao minima.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migration, seed, endpoint ou permissao foi alterado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e o planejamento documental do quarto helper puro de menor risco.

## Atualizacao Agenda Principal - Subetapa 12

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 12 foi executada apenas como planejamento documental do quarto helper puro.
- O quarto candidato recomendado para futura implementacao foi `agendaLegadoFmtData`.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a implementacao minima de `agendaLegadoFmtData` com validacao manual do impacto visual na tabela da agenda legado.

## Atualizacao Agenda Principal - Subetapa 13

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 13 concluiu a quarta extracao minima de helper puro.
- O helper extraido foi `agendaLegadoFmtData`.
- Os arquivos de codigo alterados foram `frontend/app.js` e `frontend/js/modules/agenda-principal-legado-utils.js`.
- `frontend/index.html` nao foi alterado nesta etapa.
- `agendaLegadoNumOrNull` nao foi alterado.
- `agendaLegadoFmtHora` nao foi alterado.
- `agendaLegadoFmtDataInput` nao foi alterado.
- Nenhum backend, banco, schema, migration, seed, endpoint ou permissao foi alterado.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a validacao manual da extracao de `agendaLegadoFmtData` no impacto visual na tabela da agenda legado.

## Atualizacao Agenda Principal - Subetapa 14

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 14 foi executada como validacao e revisao de impacto visual na tabela/lista.
- Nenhuma nova extracao foi realizada.
- Nenhuma alteracao funcional nova foi aplicada.
- O helper `agendaLegadoFmtData` permanece como a quarta extracao minima.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e o planejamento documental do quinto helper puro de menor risco.

## Atualizacao Agenda Principal - Subetapa 15

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 15 foi executada apenas como planejamento documental do quinto helper puro.
- O quinto candidato recomendado para futura implementacao foi `agendaLegadoRangeHoje`.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a implementacao minima de `agendaLegadoRangeHoje` com validacao manual do impacto visual nos filtros de periodo da agenda legado.

## Atualizacao Agenda Principal - Subetapa 16

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 16 foi executada como implementacao minima planejada do quinto helper puro.
- O helper extraido foi `agendaLegadoRangeHoje`.
- Os arquivos de codigo alterados foram `frontend/app.js` e `frontend/js/modules/agenda-principal-legado-utils.js`.
- `frontend/index.html` nao foi alterado nesta etapa.
- `agendaLegadoNumOrNull` nao foi alterado.
- `agendaLegadoFmtHora` nao foi alterado.
- `agendaLegadoFmtDataInput` nao foi alterado.
- `agendaLegadoFmtData` nao foi alterado.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a validacao manual da extracao de `agendaLegadoRangeHoje` no impacto visual nos filtros de periodo da agenda legado.

## Atualizacao Agenda Principal - Subetapa 17

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 17 foi executada como validacao e revisao de impacto dos filtros de periodo.
- Nenhuma nova extracao foi realizada.
- Nenhuma alteracao funcional nova foi aplicada.
- O helper `agendaLegadoRangeHoje` permanece como a quinta extracao minima.
- O volume do diff da Subetapa 16 foi conferido e separado entre documentacao/roadmap e a extracao autorizada.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e o planejamento documental do sexto helper puro de menor risco.

## Atualizacao Agenda Principal - Subetapa 18

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 18 foi executada apenas como planejamento documental do sexto helper puro.
- O sexto candidato recomendado para futura implementacao foi `agendaLegadoRangeSemana`.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a implementacao minima de `agendaLegadoRangeSemana` com validacao manual do impacto visual nos filtros de periodo da agenda legado.

## Atualizacao Agenda Principal - Subetapa 19

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 19 foi executada como implementacao minima do sexto helper puro.
- O helper extraido foi `agendaLegadoRangeSemana`.
- Os arquivos de codigo alterados foram `frontend/app.js` e `frontend/js/modules/agenda-principal-legado-utils.js`.
- `frontend/index.html` nao foi alterado nesta etapa.
- `agendaLegadoNumOrNull` nao foi alterado.
- `agendaLegadoFmtHora` nao foi alterado.
- `agendaLegadoFmtDataInput` nao foi alterado.
- `agendaLegadoFmtData` nao foi alterado.
- `agendaLegadoRangeHoje` nao foi alterado.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a validacao manual da extracao de `agendaLegadoRangeSemana` no impacto visual nos filtros de periodo da agenda legado.

## Atualizacao Agenda Principal - Subetapa 20

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 20 foi executada como validacao e revisao de impacto dos filtros de periodo.
- Nenhuma nova extracao foi realizada.
- Nenhuma alteracao funcional nova foi aplicada.
- O helper `agendaLegadoRangeSemana` permanece como a sexta extracao minima.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e o planejamento documental do setimo helper puro de menor risco.

## Atualizacao Agenda Principal - Subetapa 21

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 21 foi executada apenas como planejamento documental do setimo helper puro.
- O setimo candidato recomendado para futura implementacao foi `agendaSemanaIsStandaloneRequest`.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a implementacao minima de `agendaSemanaIsStandaloneRequest` em um modulo futuro proprio da agenda semana, com validacao manual da abertura standalone.

## Atualizacao Agenda Principal - Subetapa 22

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 22 foi executada como implementacao minima do setimo helper puro.
- O helper extraido foi `agendaSemanaIsStandaloneRequest`.
- Foi criado o modulo proprio `frontend/js/modules/agenda-principal-semana-utils.js`.
- Os arquivos de codigo alterados foram `frontend/app.js`, `frontend/index.html` e `frontend/js/modules/agenda-principal-semana-utils.js`.
- `frontend/index.html` foi alterado apenas para carregar o novo modulo antes de `frontend/app.js`.
- `agenda-principal-legado-utils.js` nao foi usado como destino desta extracao.
- Nenhum helper de agenda legado foi alterado.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a validacao manual da abertura standalone da agenda semana.

## Atualizacao Agenda Principal - Subetapa 23

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 23 foi executada apenas como validacao documental da abertura standalone da agenda semana.
- Nenhuma nova extracao foi realizada.
- Nenhuma alteracao funcional nova foi aplicada.
- O helper `agendaSemanaIsStandaloneRequest` permanece como a setima extracao minima.
- `frontend/js/modules/agenda-principal-semana-utils.js` e `frontend/js/modules/agenda-principal-legado-utils.js` nao foram alterados nesta etapa.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e o planejamento documental do oitavo helper puro de menor risco.

## Atualizacao Agenda Principal - Subetapa 24

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 24 foi executada apenas como planejamento documental do oitavo helper puro.
- O oitavo candidato recomendado para futura implementacao foi `agendaSemanaStandaloneModeFromQuery`.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O teste manual direto de querystring standalone da Subetapa 23 ficou limitado porque o usuario nao sabia a rota exata.
- A proxima subetapa recomendada e a implementacao minima de `agendaSemanaStandaloneModeFromQuery` em `frontend/js/modules/agenda-principal-semana-utils.js`, com validacao manual da agenda semana standalone.

## Atualizacao Agenda Principal - Subetapa 25

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 25 foi executada como implementacao minima do oitavo helper puro.
- O helper extraido foi `agendaSemanaStandaloneModeFromQuery`.
- A extracao foi feita no modulo `frontend/js/modules/agenda-principal-semana-utils.js`.
- `frontend/index.html` nao precisou ser alterado.
- `agendaSemanaIsStandaloneRequest` nao foi alterado.
- `agendaSemanaBuildStandaloneUrl` nao foi alterado.
- `agenda-principal-legado-utils.js` nao foi alterado.
- Nenhum helper de agenda legado foi alterado.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O usuario informou que testou posteriormente o modo URL/standalone e a agenda abriu corretamente.
- A proxima subetapa recomendada e a validacao manual da extracao de `agendaSemanaStandaloneModeFromQuery` e do modo standalone da agenda semana.

## Atualizacao Agenda Principal - Subetapa 26

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 26 foi executada apenas como validacao documental do modo standalone da agenda semana.
- Nenhuma nova extracao foi realizada.
- Nenhuma alteracao funcional nova foi aplicada.
- O helper `agendaSemanaStandaloneModeFromQuery` permanece como a oitava extracao minima.
- `frontend/js/modules/agenda-principal-semana-utils.js` e `frontend/js/modules/agenda-principal-legado-utils.js` nao foram alterados nesta etapa.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- A blindagem textual/mojibake foi respeitada.
- O usuario informou que ja conseguiu testar modo URL/standalone.
- O proximo passo recomendado e o planejamento documental do nono helper puro de menor risco.

## Atualizacao Agenda Principal - Subetapa 27

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 27 foi executada apenas como planejamento documental do nono helper puro.
- O nono candidato recomendado para futura implementacao foi `agendaSemanaBuildStandaloneUrl`.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O usuario validou a abertura URL/standalone e `agenda_modo=dia`, `agenda_modo=clinica` e sem `agenda_modo` sem identificar erros.
- O proximo passo recomendado e a implementacao minima de `agendaSemanaBuildStandaloneUrl` em `frontend/js/modules/agenda-principal-semana-utils.js`, com validacao manual da abertura standalone da agenda semana.

## Atualizacao Agenda Principal - Subetapa 28

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 28 foi executada como a nona extracao minima de helper puro.
- O helper extraido foi `agendaSemanaBuildStandaloneUrl`.
- A extracao foi feita em `frontend/js/modules/agenda-principal-semana-utils.js`.
- `frontend/index.html` nao foi alterado.
- `agendaSemanaIsStandaloneRequest` nao foi alterado.
- `agendaSemanaStandaloneModeFromQuery` nao foi alterado.
- `agenda-principal-legado-utils.js` nao foi alterado.
- Nenhum helper de agenda legado foi alterado.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A auditoria pos-Subetapa 27 confirmou commit documental limpo.
- O usuario ja testou URL/standalone e os modos `agenda_modo=dia`, `agenda_modo=clinica` e sem `agenda_modo` sem identificar erros.
- O proximo passo recomendado e a validacao manual da extracao de `agendaSemanaBuildStandaloneUrl` e da abertura standalone da agenda semana.

## Atualizacao Agenda Principal - Subetapa 29

- `Agenda principal` continua tratada como `core / comum`.
- A Subetapa 29 foi executada apenas como validacao documental da URL standalone da agenda semana.
- O helper `agendaSemanaBuildStandaloneUrl` permanece como a nona extracao minima.
- Nenhum codigo foi alterado.
- Nao houve alteracao de frontend, backend, banco, schema, migrations, seeds, endpoints ou permissï¿½es.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O usuario ja havia testado URL/standalone e `agenda_modo` sem identificar erros.
- O proximo passo recomendado e a validacao manual da extracao de `agendaSemanaBuildStandaloneUrl` e da abertura standalone da agenda semana.

## Reavaliacao Documental - Pos Agenda Principal

- A reavaliacao foi feita apos a Subetapa 29 da `Agenda principal`.
- Nenhum codigo foi alterado.
- A `Agenda principal` ja tem nove helpers extraidos e validados.
- Os helpers restantes da `Agenda principal` foram considerados mais sensiveis.
- As frentes comparadas foram `Ficha pessoal`, `Conta corrente`, `Relatorios`, `Indices financeiros`, `Preferencias / Configuracoes comuns` e outros cadastros auxiliares ja modularizados.
- A frente recomendada como proxima e `Preferencias / Configuracoes comuns`.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 3

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 3 foi executada apenas como isolamento documental dos candidatos mais seguros.
- Nenhum codigo foi alterado.
- Os candidatos de menor risco foram reavaliados por leitura: `prefAmbEstiloPadrao`, `prefValoresPadraoDados`, `prefValoresPadraoOdontograma`, `prefAmbienteTextoExemplo`, `prefAmbienteDialogoValor` e `prefAmbienteEstiloDeDialogo`.
- O primeiro candidato recomendado para futura implementacao foi `prefAmbEstiloPadrao`.
- A ordem conservadora de extracao futura foi documentada antes de qualquer alteracao funcional.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum arquivo de frontend, backend, banco, schema, migrations, seeds, endpoints, permissï¿½es, `package.json` ou configuracao foi alterado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a implementacao minima do helper puro mais seguro, com validacao manual do fluxo de ambiente.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 4

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 4 foi concluida com implementacao minima do helper puro `prefAmbEstiloPadrao`.
- Os arquivos alterados foram `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_preferencias_configuracoes_subetapa_4_implementacao_pref_amb_estilo_padrao.md`.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissï¿½es foi alterado.
- `frontend/app.js` preservou fallback local equivalente para o helper de estilo padrao.
- `frontend/js/modules/preferencias-opcoes-sistema.js` passou a expor `prefAmbEstiloPadrao` em `window.BranaPreferenciasOpcoesSistemaModule`.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O teste manual da aba `Ambiente` foi indicado antes de prosseguir.
- A proxima subetapa recomendada e a implementacao minima do helper puro `prefValoresPadraoDados`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 4B

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 4B foi concluida como validacao documental pos-teste da Subetapa 4.
- O teste manual informado pelo usuario passou sem regressao observada.
- `prefAmbEstiloPadrao` foi validado no fluxo real de preferencias.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints, permissï¿½es, `frontend/index.html` ou configuracao foi alterado nesta validacao.
- A proxima subetapa recomendada e a implementacao minima do helper puro `prefValoresPadraoDados`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 5

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 5 foi concluida com implementacao minima do helper puro `prefValoresPadraoDados`.
- Os arquivos alterados foram `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_preferencias_configuracoes_subetapa_5_implementacao_pref_valores_padrao_dados.md`.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissï¿½es foi alterado.
- `frontend/app.js` preservou fallback local equivalente para o helper de dados.
- `frontend/js/modules/preferencias-opcoes-sistema.js` passou a expor `prefValoresPadraoDados` em `window.BranaPreferenciasOpcoesSistemaModule`.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O teste manual da aba `Dados` foi indicado antes de prosseguir.
- A proxima subetapa recomendada e a implementacao minima do helper puro `prefValoresPadraoOdontograma`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 5B

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 5B foi concluida como validacao documental pos-teste da Subetapa 5.
- O teste manual informado pelo usuario passou sem regressao observada.
- `prefValoresPadraoDados` foi validado no fluxo real de preferencias.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints, permissï¿½es, `frontend/index.html` ou configuracao foi alterado nesta validacao.
- A proxima subetapa recomendada e a implementacao minima do helper puro `prefValoresPadraoOdontograma`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 6

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 6 foi concluida com implementacao minima do helper puro `prefValoresPadraoOdontograma`.
- Os arquivos alterados foram `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_preferencias_configuracoes_subetapa_6_implementacao_pref_valores_padrao_odontograma.md`.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissï¿½es foi alterado.
- `frontend/app.js` preservou fallback local equivalente para o helper de odontograma.
- `frontend/js/modules/preferencias-opcoes-sistema.js` passou a expor `prefValoresPadraoOdontograma` em `window.BranaPreferenciasOpcoesSistemaModule`.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O teste manual da aba `Odontograma` foi indicado antes de prosseguir.
- A proxima subetapa recomendada e a validacao pos-teste do helper `prefValoresPadraoOdontograma`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 7

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 7 foi concluida como validacao documental pos-teste da Subetapa 6.
- O teste manual informado pelo usuario passou sem regressao observada.
- `prefValoresPadraoOdontograma` foi validado no fluxo real de preferencias.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints, permissï¿½es, `frontend/index.html` ou configuracao foi alterado nesta validacao.
- A proxima subetapa recomendada foi registrada para a fila seguinte apos o odontograma.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 8

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 8 foi concluida como etapa exclusivamente documental.
- Os tres helpers anteriores permanecem validados: `prefAmbEstiloPadrao`, `prefValoresPadraoDados` e `prefValoresPadraoOdontograma`.
- A fila restante de helpers seguros foi reavaliada por leitura.
- O candidato recomendado para proxima implementacao foi `prefAmbienteTextoExemplo`.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints, permissï¿½es, `frontend/index.html` ou configuracao foi alterado nesta etapa.
- A proxima subetapa recomendada e a implementacao minima do helper puro `prefAmbienteTextoExemplo`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 9

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 9 foi concluida com implementacao minima do helper puro `prefAmbienteTextoExemplo`.
- Os arquivos alterados foram `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_preferencias_configuracoes_subetapa_9_implementacao_pref_ambiente_texto_exemplo.md`.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissï¿½es foi alterado.
- `frontend/app.js` preservou fallback local equivalente para o helper de texto exemplo.
- `frontend/js/modules/preferencias-opcoes-sistema.js` passou a expor `prefAmbienteTextoExemplo` em `window.BranaPreferenciasOpcoesSistemaModule`.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O teste manual da frente de ambiente foi indicado antes de prosseguir.
- A proxima subetapa recomendada e a validacao pos-teste do helper `prefAmbienteTextoExemplo`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 10

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 10 foi concluida como validacao documental pos-teste da Subetapa 9.
- O teste manual da Subetapa 9 nao encontrou erros.
- `prefAmbienteTextoExemplo` foi validado no fluxo real de preferencias.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissï¿½es foi alterado nesta validacao.
- A proxima subetapa recomendada e a implementacao minima do helper puro `prefAmbienteDialogoValor`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 11

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 11 foi concluida com implementacao minima do helper `prefAmbienteDialogoValor`.
- Os arquivos alterados foram `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_preferencias_configuracoes_subetapa_11_implementacao_pref_ambiente_dialogo_valor.md`.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissï¿½es foi alterado.
- `frontend/app.js` preservou fallback local equivalente para o helper do dialogo.
- `frontend/js/modules/preferencias-opcoes-sistema.js` passou a expor `prefAmbienteDialogoValor` em `window.BranaPreferenciasOpcoesSistemaModule`.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O teste manual da frente de ambiente deve ser indicado antes de prosseguir.
- A proxima subetapa recomendada e a validacao pos-teste do helper `prefAmbienteDialogoValor`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 12

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 12 foi concluida como validacao documental pos-teste da Subetapa 11.
- O teste manual da Subetapa 11 passou.
- `prefAmbienteDialogoValor` foi validado no fluxo real de preferencias.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissï¿½es foi alterado nesta validacao.
- A proxima subetapa recomendada e a reavaliacao documental da fila restante apos o dialogo de fonte.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 13

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 13 foi concluida como etapa exclusivamente documental.
- Os helpers anteriores permanecem validados: `prefAmbEstiloPadrao`, `prefValoresPadraoDados`, `prefValoresPadraoOdontograma`, `prefAmbienteTextoExemplo` e `prefAmbienteDialogoValor`.
- A fila restante do ambiente foi reavaliada por leitura.
- O candidato recomendado para a proxima implementacao foi `prefAmbienteEstiloDeDialogo`.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints, permissoes, `frontend/index.html` ou configuracao foi alterado nesta etapa.
- A proxima subetapa recomendada e a implementacao minima do helper `prefAmbienteEstiloDeDialogo`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 14

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 14 foi concluida com implementacao minima do helper `prefAmbienteEstiloDeDialogo`.
- Os arquivos alterados foram `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_preferencias_configuracoes_subetapa_14_implementacao_pref_ambiente_estilo_de_dialogo.md`.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- `frontend/app.js` preservou fallback local equivalente para o helper do estilo do dialogo.
- `frontend/js/modules/preferencias-opcoes-sistema.js` passou a expor `prefAmbienteEstiloDeDialogo` em `window.BranaPreferenciasOpcoesSistemaModule`.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O teste manual da frente de ambiente deve ser indicado antes de prosseguir.
- A proxima subetapa recomendada e a validacao pos-teste do helper `prefAmbienteEstiloDeDialogo`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 15

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 15 foi concluida como validacao documental pos-teste da Subetapa 14.
- O teste manual da Subetapa 14 passou.
- `prefAmbienteEstiloDeDialogo` foi validado no fluxo real de preferencias.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado nesta validacao.
- A proxima subetapa recomendada e a reavaliacao documental da fila restante apos o dialogo de estilo.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 16

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 16 foi concluida como etapa exclusivamente documental.
- Os helpers anteriores permanecem validados: `prefAmbEstiloPadrao`, `prefValoresPadraoDados`, `prefValoresPadraoOdontograma`, `prefAmbienteTextoExemplo`, `prefAmbienteDialogoValor` e `prefAmbienteEstiloDeDialogo`.
- A fila restante apos o dialogo de estilo foi reavaliada por leitura.
- Nao foi identificado candidato pequeno e seguro suficiente para nova implementacao minima imediata.
- A recomendacao de continuidade registrada foi de pausa documental da frente, sem nova extracao nesta rodada.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints, permissoes, `frontend/index.html` ou configuracao foi alterado nesta etapa.
- A proxima subetapa recomendada e o fechamento documental da frente e a consolidacao da pausa.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 17

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 17 foi concluida como fechamento documental da frente.
- A frente `Preferencias / Configuracoes comuns` foi consolidada como pausada nesta rodada.
- Os helpers extraidos e validados continuam: `prefAmbEstiloPadrao`, `prefValoresPadraoDados`, `prefValoresPadraoOdontograma`, `prefAmbienteTextoExemplo`, `prefAmbienteDialogoValor` e `prefAmbienteEstiloDeDialogo`.
- Nenhum codigo foi alterado nesta subetapa.
- O modulo permanece passivo e parcial.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A recomendacao registrada e de nova etapa documental comparativa entre modulos core/comum, sem codigo, para escolher a proxima frente de menor risco.

## Reavaliacao Comparativa - Pos Pausa de Preferencias / Configuracoes Comuns

- A reavaliacao comparativa foi concluida sem alteracao de codigo.
- `Preferencias / Configuracoes comuns` permanece pausada/consolidada nesta rodada.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- Foram comparados `Ficha pessoal`, `Conta corrente`, `Relatorios`, `Indices financeiros`, `Cadastros auxiliares`, `Convï¿½nios e Planos`, `Plano de Contas`, `Medicamentos`, `Materiais`, `Procedimentos genericos`, `Tabela de servicos de protese / Tabela de proteticos`, `Etiquetas`, `Simbolos graficos` e outras frentes core/comum registradas no roadmap.
- A comparacao por risco concluiu que os blocos maiores e mais sensiveis permanecem acima do patamar ideal para uma nova extraï¿½ï¿½o minima controlada.
- A frente recomendada como proxima e `Prestadores`, por ser o menor candidato parcial ainda plausivelmente retomavel.
- A proxima subetapa recomendada e `Prestadores - Subetapa 0 de retomada documental / mapeamento tecnico complementar`.
- A blindagem textual/mojibake foi respeitada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado nesta etapa.

## Prestadores - Subetapa 0

- A frente `Prestadores` foi retomada documentalmente como aproximadamente `core / comum` administrativa/transversal.
- A Subetapa 0 foi executada apenas como retomada documental e mapeamento tecnico complementar.
- Nenhum codigo foi alterado.
- O modulo `frontend/js/modules/prestadores.js` existe e permanece passivo.
- `window.BranaPrestadoresModule` continua exposto.
- `prestFmtCodigo` e `prestStatusHtml` permanecem como helpers extraidos e validados.
- `frontend/index.html` carrega o modulo de Prestadores antes de `frontend/app.js`.
- `frontend/app.js` continua concentrando o fluxo funcional, com wrapper/fallback local para os helpers ja delegados.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- `Preferencias / Configuracoes comuns` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.

## Prestadores - Subetapa 1

- A frente `Prestadores` teve a Subetapa 1 concluida como etapa documental de fronteiras e contrato do helper `prestSelecionado`.
- O helper `prestSelecionado` foi analisado sem alteracao de codigo.
- O helper continua dependente de `prestadoresCache` e `prestadorSelId`, com recomendacao de contrato explicito caso venha a ser extraido futuramente.
- Nenhuma alteracao de codigo foi feita nesta subetapa.
- O modulo `frontend/js/modules/prestadores.js` continua passivo e com namespace global `window.BranaPrestadoresModule`.
- `frontend/app.js` segue concentrando o fluxo funcional e o wrapper local dos helpers ja delegados.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- `Preferencias / Configuracoes comuns` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a Subetapa 2 documental ou funcional de `prestSelecionado` com contrato explicito de cache e selecao, caso a frente siga com uma extracao minima segura.

## Prestadores - Subetapa 2

- A frente `Prestadores` teve a Subetapa 2 concluida com implementacao minima do helper `prestSelecionado`.
- O helper agora possui contrato explicito `cache/selId`.
- `frontend/js/modules/prestadores.js` passou a exportar `prestSelecionado(cache, selId)` no namespace passivo `window.BranaPrestadoresModule`.
- `frontend/app.js` passou a consultar primeiro o helper do modulo passivo e manteve fallback local equivalente.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissï¿½es foi alterado.
- `Prestadores` segue classificado como `core / comum` administrativo/transversal.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- `Preferencias / Configuracoes comuns` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a reavaliacao documental do bloco restante apos a extracao minima de `prestSelecionado`.

## Prestadores - Subetapa 2B

- A frente `Prestadores` teve a Subetapa 2B concluida como validacao documental pos-teste do helper `prestSelecionado`.
- O teste manual informado pelo usuario passou.
- O helper `prestSelecionado` foi validado sem alteracao de codigo nesta rodada.
- `Prestadores` segue como `core / comum` administrativo/transversal.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- `Preferencias / Configuracoes comuns` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada permanece a Reavaliacao documental do bloco restante apos a extracao minima de `prestSelecionado`.

## Prestadores - Subetapa 3

- A frente `Prestadores` teve a Subetapa 3 concluida como etapa exclusivamente documental.
- `prestSelecionado` permanece validado.
- O bloco restante foi reavaliado por leitura.
- Nenhum novo candidato pequeno e seguro foi identificado para implementacao minima imediata.
- A recomendacao registrada e pausar/consolidar a frente nesta rodada.
- `Prestadores` segue como `core / comum` administrativo/transversal.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- `Preferencias / Configuracoes comuns` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e o fechamento documental da frente e a consolidacao da pausa, ou nova comparacao documental antes de qualquer implementacao futura.

## Prestadores - Subetapa 4

- A frente `Prestadores` teve a Subetapa 4 concluida como fechamento documental.
- A frente `Prestadores` foi pausada/consolidada nesta rodada.
- Os helpers extraidos e validados permanecem `prestFmtCodigo`, `prestStatusHtml` e `prestSelecionado`.
- Nenhum codigo foi alterado nesta subetapa.
- O modulo `frontend/js/modules/prestadores.js` permanece passivo e parcial.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- `Preferencias / Configuracoes comuns` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima recomendacao e a fase documental de transicao para recortes de risco medio controlado.

## Transicao para recortes de risco medio controlado

- A Fase 2 entra em transicao documental para recortes de risco medio controlado.
- Nenhum codigo foi alterado nesta etapa.
- As frentes pausadas/consolidadas permanecem mantidas: `Agenda principal`, `Agenda de contatos`, `Preferencias / Configuracoes comuns` e `Prestadores`.
- Os criterios de aceitacao de risco medio foram definidos documentalmente.
- A matriz de decisao inicial foi registrada para comparar candidatos futuros.
- A proxima etapa recomendada e a selecao documental do primeiro recorte de risco medio controlado.
- A blindagem textual/mojibake foi respeitada.

## Selecao do primeiro recorte medio controlado

- A selecao documental do primeiro recorte de risco medio controlado foi concluida.
- Nenhum codigo foi alterado nesta etapa.
- Os candidatos comparados foram `Prestadores/prestFiltrarLista`, `Prestadores/prestRender`, `Prestadores/prestSelecionarLinha`, `Prestadores/prestAcoesPlaceholder`, blocos de `Cadastros auxiliares`, `Convï¿½nios e Planos`, `Relatorios`, `Agenda principal`, `Preferencias / Configuracoes comuns` e outros candidatos core/comum registrados no roadmap.
- A recomendacao escolhida foi `Prestadores / prestFiltrarLista` como primeiro recorte medio controlado, mas apenas com contrato documental anterior a qualquer implementacao futura.
- As frentes pausadas/consolidadas permanecem mantidas.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Prestadores - Contrato detalhado de prestFiltrarLista como recorte medio controlado`.

## Prestadores - Contrato detalhado de prestFiltrarLista

- O contrato detalhado de `prestFiltrarLista` como recorte medio controlado foi definido documentalmente.
- Nenhum codigo foi alterado nesta etapa.
- O contrato observado ainda parte de leitura local de `prestCfg` e `prestadoresCache` em `frontend/app.js`.
- O contrato futuro recomendado separa filtragem pura de leitura de DOM e de renderizacao.
- `Prestadores` continua classificado como `core / comum` administrativo/transversal.
- As frentes pausadas/consolidadas permanecem mantidas: `Agenda principal`, `Agenda de contatos`, `Preferencias / Configuracoes comuns` e `Prestadores`.
- A decisao registrada e que `Prestadores / prestFiltrarLista` segue como candidato para implementacao futura, apenas depois deste contrato.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Prestadores - Implementacao minima de prestFiltrarLista com contrato explicito lista/filtros`.

## Prestadores - Implementacao minima de prestFiltrarLista

- A implementacao minima de `prestFiltrarLista` foi concluida como primeiro recorte de risco medio controlado.
- O contrato explicito `lista/filtros` foi aplicado em `frontend/js/modules/prestadores.js`.
- `frontend/app.js` passou a montar os filtros localmente e a chamar o helper do modulo com fallback equivalente.
- Nenhum backend, banco, schema, migration, seed, endpoint ou permissao foi alterado nesta etapa.
- `Prestadores` continua classificado como `core / comum` administrativo/transversal.
- As frentes pausadas/consolidadas permanecem mantidas: `Agenda principal`, `Agenda de contatos`, `Preferencias / Configuracoes comuns` e `Prestadores`.
- A blindagem textual/mojibake foi respeitada.
- A validacao manual segue indicada antes de qualquer novo passo.
- A proxima subetapa recomendada e a validacao documental pos-teste da implementacao de `prestFiltrarLista`.

## Prestadores - Validacao pos-teste de prestFiltrarLista

- A validacao pos-teste de `prestFiltrarLista` foi concluida documentalmente.
- O teste manual informado pelo usuario passou.
- `prestFiltrarLista` permanece validado como primeiro recorte de risco medio controlado.
- `Prestadores` segue classificado como `core / comum` administrativo/transversal.
- As frentes pausadas/consolidadas permanecem mantidas: `Agenda principal`, `Agenda de contatos`, `Preferencias / Configuracoes comuns` e `Prestadores`.
- Nenhum novo codigo foi alterado nesta rodada de validacao documental.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Prestadores - Consolidacao documental da frente apos validacao de prestFiltrarLista`.

## Prestadores - Consolidacao documental apos prestFiltrarLista

- A frente Prestadores foi consolidada documentalmente apos a validacao de `prestFiltrarLista`.
- O primeiro recorte de risco medio controlado permanece validado.
- Nenhum codigo foi alterado nesta etapa.
- `Prestadores` segue classificado como `core / comum` administrativo/transversal.
- As frentes pausadas/consolidadas permanecem mantidas: `Agenda principal`, `Agenda de contatos`, `Preferencias / Configuracoes comuns` e `Prestadores`.
- O modulo `frontend/js/modules/prestadores.js` permanece passivo e parcial, com os helpers extraidos e validados.
- O restante do fluxo visual segue em `frontend/app.js`.
- A blindagem textual/mojibake foi respeitada.
- A recomendacao registrada e pausar/consolidar novamente a frente e fazer nova selecao documental entre modulos/blocos antes de qualquer novo recorte.
- A proxima subetapa recomendada e `Fase 2 - Nova selecao documental entre modulos/blocos antes de qualquer novo recorte em Prestadores`.

## Nova selecao documental apos Prestadores

- A nova selecao documental foi realizada apos a consolidacao de `Prestadores`.
- Nenhum codigo foi alterado nesta etapa.
- `Prestadores` permanece consolidado apos a validacao de `prestFiltrarLista`.
- As frentes pausadas/consolidadas permanecem mantidas: `Agenda principal`, `Agenda de contatos`, `Preferencias / Configuracoes comuns` e `Prestadores`.
- Os candidatos comparados incluem `Prestadores/prestRender`, `Prestadores/prestSelecionarLinha`, `Prestadores/prestAcoesPlaceholder`, `Preferencias / Configuracoes comuns` remanescente, `Convï¿½nios e Planos`, `Relatorios`, `Etiquetas`, `Medicamentos`, `Plano de Contas`, `Materiais`, `Procedimentos genericos` e `Agenda principal` remanescente.
- A recomendacao escolhida foi seguir com um novo contrato documental em `Preferencias / Configuracoes comuns`.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Preferencias / Configuracoes comuns - Contrato funcional e fronteiras para o proximo recorte medio controlado`.

## Preferencias / Configuracoes comuns - Contrato do proximo recorte medio

- `Preferencias / Configuracoes comuns` foi retomada documentalmente para avaliar o proximo recorte medio controlado.
- Nenhum codigo foi alterado nesta etapa.
- O modulo `frontend/js/modules/preferencias-opcoes-sistema.js` permanece passivo, parcial e com helpers validados.
- As frentes pausadas/consolidadas permanecem mantidas: `Agenda principal`, `Agenda de contatos`, `Prestadores` e `Preferencias / Configuracoes comuns`.
- A recomendacao escolhida foi detalhar `prefAmbienteSecoesAtuais` como proximo recorte medio controlado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Preferencias / Configuracoes comuns - Contrato detalhado de prefAmbienteSecoesAtuais como recorte medio controlado`.

## Preferencias / Configuracoes comuns - Contrato detalhado de prefAmbienteSecoesAtuais

- `Preferencias / Configuracoes comuns` continua como frente core / comum.
- Nenhum codigo foi alterado nesta etapa.
- O helper `prefAmbienteSecoesAtuais` foi confirmado como recorte medio controlado com contrato explicito de `baseSecoes` e `atuais`.
- O modulo `frontend/js/modules/preferencias-opcoes-sistema.js` permanece passivo, com fallback/duplicidade controlada em `frontend/app.js`.
- As frentes pausadas/consolidadas permanecem mantidas: `Agenda principal`, `Agenda de contatos` e `Prestadores`.
- A recomendacao escolhida foi seguir com a implementacao futura minima de `prefAmbienteSecoesAtuais` com parametros explicitos.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Preferencias / Configuracoes comuns - Implementacao minima de prefAmbienteSecoesAtuais com contrato explicito baseSecoes/atuais`.

## Preferencias / Configuracoes comuns - Implementacao minima de prefAmbienteSecoesAtuais

- `Preferencias / Configuracoes comuns` continua como frente core / comum.
- A implementacao minima de `prefAmbienteSecoesAtuais(baseSecoes, atuais)` foi concluida como recorte medio controlado.
- O helper foi exposto no modulo passivo `frontend/js/modules/preferencias-opcoes-sistema.js`.
- `frontend/app.js` continua lendo a base e o estado atual, e preserva fallback local equivalente.
- Nenhum backend, banco, permissao ou payload foi alterado nesta subetapa.
- A blindagem textual/mojibake foi respeitada.
- O teste manual indicado antes de prosseguir deve ocorrer na aba `Ambiente`.
- A proxima subetapa recomendada e `Preferencias / Configuracoes comuns - Validacao pos-teste de prefAmbienteSecoesAtuais`.

## Preferencias / Configuracoes comuns - Validacao pos-teste de prefAmbienteSecoesAtuais

- `Preferencias / Configuracoes comuns` continua como frente core / comum.
- A validacao pos-teste de `prefAmbienteSecoesAtuais` foi concluida como recorte de risco medio controlado.
- O teste manual passou e nao houve regressao no fluxo da aba `Ambiente`.
- `frontend/app.js` e o modulo passivo continuam com contrato explicito `baseSecoes/atuais` e fallback local equivalente.
- `Prestadores` permanece consolidado apos `prestFiltrarLista`.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Preferencias / Configuracoes comuns - Consolidacao documental apos validacao de prefAmbienteSecoesAtuais`.

## Preferencias / Configuracoes comuns - Consolidacao documental apos validacao de prefAmbienteSecoesAtuais

- `Preferencias / Configuracoes comuns` segue como frente core / comum.
- `prefAmbienteSecoesAtuais` foi validado como recorte de risco medio controlado.
- Nenhum codigo foi alterado nesta subetapa.
- O modulo `frontend/js/modules/preferencias-opcoes-sistema.js` permanece passivo, com fallback/duplicidade controlada em `frontend/app.js`.
- As frentes pausadas/consolidadas permanecem mantidas: `Agenda principal`, `Agenda de contatos` e `Prestadores`.
- A recomendacao escolhida e pausar/consolidar novamente a frente e fazer nova selecao documental entre modulos/blocos antes de qualquer novo recorte.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Fase 2 - Nova selecao documental entre modulos/blocos apos validacao do recorte medio de Preferencias`.

## Fase 2 - Nova selecao documental entre modulos/blocos apos validacao do recorte medio de Preferencias

- `Preferencias / Configuracoes comuns` permanece consolidada apos `prefAmbienteSecoesAtuais`.
- `Prestadores` permanece consolidado apos `prestFiltrarLista`.
- Nenhum codigo foi alterado nesta etapa.
- As frentes pausadas/consolidadas permanecem mantidas: `Agenda principal`, `Agenda de contatos`, `Preferencias / Configuracoes comuns` e `Prestadores`.
- A recomendacao escolhida foi fazer nova comparacao documental restrita entre `Cadastros auxiliares`, `Medicamentos` e `Plano de Contas` antes de qualquer novo recorte.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Fase 2 - Comparacao documental restrita entre Cadastros auxiliares, Medicamentos e Plano de Contas`.

## Fase 2 - Comparacao documental restrita entre Cadastros auxiliares, Medicamentos e Plano de Contas

- A comparacao documental restrita entre `Cadastros auxiliares`, `Medicamentos` e `Plano de Contas` foi realizada.
- O candidato recomendado foi `Plano de Contas`, mas apenas para receber antes um contrato documental funcional.
- A proxima etapa nao deve ser implementacao imediata; deve ser contrato documental.
- Nenhum codigo foi alterado nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Plano de Contas - Contrato documental do proximo helper ou transformacao segura`.

## Plano de Contas - Contrato documental do proximo helper ou transformacao segura

- `Plano de Contas` foi tratado como modulo comum/core administrativo/transversal.
- O contrato documental do proximo helper/transformacao segura foi definido.
- O candidato mais promissor ficou sendo `montarPayloadGrupo(nome, tipo)`, com `montarPayloadCategoria(nome, grupo_id, tipo, tributavel)` como secundario imediato.
- Nenhum codigo foi alterado nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a avaliacao documental da implementacao minima de `montarPayloadGrupo`.

## Plano de Contas - Implementacao minima de montarPayloadGrupo

- `Plano de Contas` continua tratado como modulo comum/core administrativo/transversal.
- A implementacao minima de `montarPayloadGrupo(nome, tipo)` foi realizada de forma passiva e conservadora.
- O modulo `frontend/js/modules/plano-contas.js` passou a expor o helper diretamente, mantendo fallback/compatibilidade com `frontend/app.js`.
- `frontend/app.js` passou a delegar o payload de grupo ao helper do modulo, com fallback local equivalente.
- O payload final, o salvamento, `requestJson` e os endpoints nao foram alterados.
- DOM, renderizacao, modal, scaffold e selecao visual nao foram alterados.
- A blindagem textual/mojibake foi respeitada.
- O teste manual do usuario e obrigatorio antes de qualquer proxima etapa documental.
- A proxima subetapa e apenas teste manual pelo usuario antes de qualquer nova validacao documental.

## Plano de Contas - Validacao pos-teste de montarPayloadGrupo

- `Plano de Contas` continua tratado como modulo comum/core administrativo/transversal.
- A implementacao minima de `montarPayloadGrupo(nome, tipo)` foi validada pelo usuario em `Cadastros > Plano de contas`.
- O teste manual passou.
- A implementacao minima fica consolidada.
- O payload final, o salvamento e o comportamento visual foram preservados.
- As categorias continuaram funcionando normalmente.
- Nenhuma nova alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima decisao deve ser documental e conservadora antes de qualquer novo recorte em Plano de Contas.

## Plano de Contas - Contrato documental de montarPayloadCategoria

- `Plano de Contas` continua tratado como modulo comum/core administrativo/transversal.
- O contrato documental de `montarPayloadCategoria(nome, grupo_id, tipo, tributavel)` foi criado.
- O helper existe de forma passiva em `frontend/js/modules/plano-contas.js`, mas a recomendacao conservadora foi pedir mais auditoria antes de implementar.
- A superficie de categoria e maior que a de grupo e depende de `grupo_id` e `tributavel`.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e uma nova auditoria documental de `montarPayloadCategoria` antes de qualquer implementacao.

## Plano de Contas - Auditoria documental de montarPayloadCategoria

- `Plano de Contas` continua tratado como modulo comum/core administrativo/transversal.
- A auditoria documental concluiu que `montarPayloadCategoria` deve permanecer como esta, sem implementacao nova.
- O helper segue passivo em `ns.helpers` e o `app.js` ja delega parcialmente com fallback equivalente.
- A mudanca proposta teria ganho real pequeno e risco desnecessario para um fluxo ja funcional.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e consolidar documentalmente a permanencia do fluxo atual, sem implementacao.

## Plano de Contas - Consolidacao documental de manter montarPayloadCategoria como esta

- `Plano de Contas` continua tratado como modulo comum/core administrativo/transversal.
- `montarPayloadCategoria` foi consolidado sem alteracao.
- O uso atual via `ns.helpers` sera mantido.
- `montarPayloadGrupo` segue implementado, testado e consolidado.
- `Plano de Contas` fica pausado/consolidado por ora.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e voltar para nova selecao documental de blocos leves.

## Fase 2 - Nova selecao documental de blocos leves apos consolidacao do Plano de Contas

- `Plano de Contas` permaneceu consolidado/pausado por ora.
- Foi realizada nova selecao documental de blocos leves.
- Os candidatos avaliados foram `Cadastros auxiliares`, `Medicamentos`, `Etiquetas`, `Convï¿½nios e Planos`, `Relatorios` e `CID`.
- A classificacao multiarea resumida mostrou `Cadastros auxiliares` e `Etiquetas` como comuns/core administrativos/transversais, `Medicamentos` e `CID` como especificos de area profissional e `Convï¿½nios e Planos`/`Relatorios` como mistos ou de risco maior.
- A recomendacao escolhida foi criar primeiro um contrato documental para `CID`.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `CID - Contrato documental do proximo helper leve ou transformacao segura`.

## CID - Contrato documental do proximo helper leve ou transformacao segura

- `CID` foi tratado como modulo especifico de area profissional.
- O estado atual de `CID` continua concentrado em `frontend/app.js` e no modulo passivo `frontend/js/modules/cid.js`.
- O candidato documental mais seguro identificado foi `compararTextoCid(texto, termo)`.
- A recomendacao ficou em manter a abordagem conservadora: contrato antes de qualquer implementacao futura.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e seguir com contrato documental antes de qualquer delegacao adicional em `CID`.

## CID - Contrato funcional especifico de compararTextoCid antes de implementacao

- Foi criado contrato funcional especifico de `compararTextoCid(texto, termo)`.
- `CID` continua classificado como modulo especifico de area profissional.
- A decisao conservadora foi aprovar o helper para futura implementacao minima, mantendo fallback equivalente.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a implementacao minima futura de uso de `compararTextoCid` no filtro local de `CID`.

## CID - Implementacao minima de uso de compararTextoCid no filtro local

- A implementacao minima de uso de `compararTextoCid(texto, termo)` no filtro local de `CID` foi realizada.
- `CID` continua classificado como modulo especifico de area profissional.
- Os arquivos alterados foram `frontend/app.js`, `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_cid_implementacao_comparar_texto_cid.md`.
- O helper permanece passivo em `frontend/js/modules/cid.js`.
- DOM/renderizacao/modal/selecao/eventos nao foram alterados.
- `requestJson`/payload/salvamento/endpoints nao foram alterados.
- backend/banco/permissoes nao foram alterados.
- A blindagem textual/mojibake foi respeitada.
- O teste manual do usuario passa a ser obrigatorio antes da proxima etapa documental.

## CID - Validacao pos-teste de compararTextoCid no filtro local

- A validacao pos-teste de `compararTextoCid` no filtro local de CID foi concluida.
- O teste manual passou em `Tabelas > Doencas (CID)`.
- A implementacao minima ficou consolidada.
- `CID` continua classificado como modulo especifico de area profissional.
- Nenhuma nova alteracao de codigo foi feita nesta etapa.
- `frontend/js/modules/cid.js` nao foi alterado porque o helper ja existia.
- O ganho foi principalmente arquitetural/de delegacao segura, e nao necessariamente de reducao visivel de linhas.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e uma nova decisao documental antes de qualquer novo recorte em `CID`.

## CID - Consolidacao documental pos-validacao de compararTextoCid

- `compararTextoCid` foi consolidado no filtro local de CID.
- O teste manual passou em `Tabelas > Doencas (CID)`.
- `CID` continua como modulo especifico de area profissional.
- O ganho foi arquitetural/de delegacao segura.
- Nenhuma nova alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- `CID` fica pausado/consolidado por ora.
- A proxima subetapa recomendada e nova decisao documental antes de qualquer novo recorte.

## Fase 2 - Nova selecao documental de proximo bloco leve apos consolidacao de CID

- `CID` permaneceu consolidado/pausado por ora.
- Foi realizada nova selecao documental de proximo bloco leve.
- Os candidatos avaliados foram `Cadastros auxiliares`, `Medicamentos`, `Etiquetas`, `Convï¿½nios e Planos` e um eventual outro bloco leve identificado no roadmap.
- A classificacao multiarea resumida apontou `Cadastros auxiliares` e `Etiquetas` como comuns/core administrativos/transversais, `Medicamentos` como especifico de area profissional e `Convï¿½nios e Planos` como misto/depende de contexto.
- A recomendacao escolhida foi `Etiquetas` como proxima frente documental.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Etiquetas - Contrato documental do proximo helper leve ou transformacao segura`.

## Etiquetas - Contrato documental do proximo helper leve ou transformacao segura

- `Etiquetas` foi tratado como modulo comum/core administrativo/transversal.
- A auditoria operacional dos dois commits anteriores de CID foi aceita sem necessidade de correcao.
- O helper mais seguro identificado foi `etqArquivosOrdenados(lista)`.
- A recomendacao para futura implementacao minima e manter um helper passivo com fallback equivalente.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a implementacao minima futura de `etqArquivosOrdenados(lista)` com teste manual em `Etiquetas / Configuracao de modelos de etiqueta`.

## Etiquetas - Implementacao minima de etqArquivosOrdenados(lista)

- `etqArquivosOrdenados(lista)` foi implementado de forma minima.
- `Etiquetas` continua como modulo comum/core administrativo/transversal.
- Os arquivos alterados foram `frontend/app.js`, `frontend/js/modules/etiquetas.js`, `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_etiquetas_implementacao_etq_arquivos_ordenados.md`.
- O helper ficou passivo e puro, com fallback equivalente mantido em `frontend/app.js`.
- DOM/renderizacao/modal/preview/selecao/eventos nao foram alterados.
- `requestJson`/payload/salvamento/endpoints nao foram alterados.
- backend/banco/permissoes nao foram alterados.
- A blindagem textual/mojibake foi respeitada.
- O teste manual do usuario deve ocorrer antes de qualquer nova validacao documental.

## Etiquetas - Validacao pos-teste de etqArquivosOrdenados(lista)

- A validacao pos-teste de `etqArquivosOrdenados(lista)` foi concluida.
- O teste manual passou em `Etiquetas / Configuracao de modelos de etiqueta`.
- A implementacao minima ficou consolidada.
- `Etiquetas` continua como modulo comum/core administrativo/transversal.
- Nenhuma nova alteracao de codigo foi feita nesta etapa.
- DOM/renderizacao/modal/preview/eventos foram preservados.
- `requestJson`/payload/salvamento/endpoints foram preservados.
- backend/banco/permissoes foram preservados.
- A blindagem textual/mojibake foi respeitada.
- A proxima decisao documental recomendada e consolidar/pausar Etiquetas por ora antes de qualquer novo recorte.

## Etiquetas - Consolidacao documental pos-validacao de etqArquivosOrdenados(lista)

- `etqArquivosOrdenados(lista)` foi consolidado em Etiquetas.
- O teste manual passou.
- `Etiquetas` continua como modulo comum/core administrativo/transversal.
- O ganho foi arquitetural/de delegacao segura.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A auditoria confirmou que o problema anterior foi apenas erro de relatorio, sem alteracao indevida de codigo.
- A blindagem textual/mojibake foi respeitada.
- `Etiquetas` fica pausado/consolidado por ora.
- A proxima subetapa recomendada e nova decisao documental antes de qualquer novo recorte.

## Fase 2 - Nova selecao documental de proximo bloco leve apos consolidacao de Etiquetas

- `Etiquetas` permaneceu consolidado/pausado por ora.
- Foi realizada nova selecao documental de proximo bloco leve.
- Os candidatos avaliados foram `Cadastros auxiliares`, `Medicamentos`, `Convï¿½nios e Planos` e um eventual outro bloco leve identificado no roadmap.
- A classificacao multiarea resumida apontou `Cadastros auxiliares` como comum/core administrativo/transversal, `Medicamentos` como especifico de area profissional e `Convï¿½nios e Planos` como misto/depende de contexto.
- A recomendacao escolhida foi `Cadastros auxiliares` como proxima frente documental.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Cadastros auxiliares - Contrato documental do proximo helper leve ou transformacao segura`.

## Fase 2 - Normalizacao documental da selecao pos-Etiquetas e contrato de Cadastros auxiliares

- A normalizacao documental apos a consolidacao de Etiquetas foi registrada.
- O commit `2054745349bdc88f8bf7f2d6cb0e3af710da6bd6` foi auditado.
- O commit alterou somente documentacao.
- A inconsistenca operacional/documental foi registrada sem risco funcional.
- Cadastros auxiliares foi aceito como proxima frente documental.
- O contrato documental ja criado sera o ponto de continuidade.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e `Cadastros auxiliares - Conferencia do contrato documental existente antes de qualquer implementacao`.

## Cadastros auxiliares - Conferencia do contrato documental existente antes de qualquer implementacao

- O contrato documental existente de Cadastros auxiliares foi conferido.
- `Cadastros auxiliares` continua como modulo comum/core administrativo/transversal.
- A avaliacao conservadora concluiu que o contrato esta apto para continuidade documental.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a implementacao minima futura de `auxNormalizarHexCor(value)` com teste manual obrigatorio.

## Cadastros auxiliares - Implementacao minima de auxNormalizarHexCor(value)

- A implementacao minima de `auxNormalizarHexCor(value)` foi registrada como ja presente e consolidada no modulo real `frontend/js/modules/auxiliares.js`.
- `Cadastros auxiliares` continua como modulo comum/core administrativo/transversal.
- Os arquivos alterados foram `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_cadastros_auxiliares_implementacao_aux_normalizar_hex_cor.md`.
- O nome real do modulo usado foi `frontend/js/modules/auxiliares.js` com namespace `window.BranaAuxiliaresModule`.
- O helper ficou passivo.
- DOM/renderizacao/modal/preview/selecao/eventos nao foram alterados.
- `requestJson`/payload/salvamento/endpoints nao foram alterados.
- backend/banco/permissoes nao foram alterados.
- A blindagem textual/mojibake foi respeitada.
- O teste manual do usuario permanece obrigatorio antes da proxima etapa documental.

## Cadastros auxiliares - Validacao e consolidacao pos-teste de auxNormalizarHexCor(value)

- A validacao pos-teste de `auxNormalizarHexCor(value)` foi registrada e consolidada.
- O teste manual passou.
- Nenhuma alteracao de codigo foi necessaria nesta etapa anterior porque o helper e a delegacao ja existiam.
- O modulo real validado e `frontend/js/modules/auxiliares.js`.
- `Cadastros auxiliares` continua como modulo comum/core administrativo/transversal.
- `auxNormalizarHexCor(value)` fica consolidado.
- DOM/renderizacao/modal/preview/selecao/eventos nao foram alterados.
- `requestJson`/payload/salvamento/endpoints nao foram alterados.
- backend/banco/permissoes nao foram alterados.
- A blindagem textual/mojibake foi respeitada.
- Qualquer proximo recorte em Cadastros auxiliares precisa de nova decisao documental.

## Cadastros auxiliares - Consolidacao pos-validacao de auxNormalizarHexCor(value)

- `auxNormalizarHexCor(value)` foi consolidado em Cadastros auxiliares.
- O teste manual passou.
- `Cadastros auxiliares` continua como modulo comum/core administrativo/transversal.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- O modulo real permanece `frontend/js/modules/auxiliares.js`.
- O namespace real permanece `window.BranaAuxiliaresModule`.
- DOM/renderizacao/modal/preview/selecao/eventos nao foram alterados.
- `requestJson`/payload/salvamento/endpoints nao foram alterados.
- backend/banco/permissoes nao foram alterados.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa deve ser definida por nova decisao documental antes de qualquer implementacao futura.

## Fase 2 - Nova selecao documental de proximo bloco leve apos consolidacao de Cadastros auxiliares

- `Cadastros auxiliares` foi consolidado/pausado por ora.
- Foi realizada nova selecao documental de blocos leves.
- Os candidatos avaliados foram `Medicamentos` e `Convenios e Planos`.
- A classificacao multiarea resumida apontou `Medicamentos` como especifico de area profissional e `Convenios e Planos` como misto/depende de contexto.
- A recomendacao escolhida foi `Medicamentos` como proxima frente documental.
- A proxima subetapa recomendada e `Medicamentos - Contrato documental do proximo helper leve ou transformacao segura`.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Medicamentos - Contrato documental do proximo helper leve ou transformacao segura

- `Medicamentos` foi escolhido para contrato documental.
- `Medicamentos` e um modulo especifico de area profissional.
- O candidato recomendado foi `compararTextoMedicamento(texto, termo)`.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa deve ser definida por contrato documental antes de qualquer implementacao futura.

## Medicamentos - Conferencia do contrato de compararTextoMedicamento antes de implementacao

- A conferencia do contrato de `compararTextoMedicamento(texto, termo)` foi realizada.
- `Medicamentos` segue como modulo especifico de area profissional.
- O contrato precisa de complemento documental antes de qualquer implementacao.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e um complemento documental com consumidor local claramente definido antes de implementar.

## Fase 2B - Organizacao da transicao para recortes medios controlados

- O encerramento pratico da busca por helpers leves foi registrado.
- A Fase 2B foi aberta e organizada para recortes medios controlados.
- A diferenca entre Fase 2B e a futura Fase 3 foi registrada: Fase 2B fica no frontend sem backend/banco/payload/salvamento; Fase 3 e para mudancas estruturais maiores.
- O protocolo obrigatorio de recortes medios controlados foi definido.
- A primeira frente recomendada foi `Preferencias remanescentes`.
- A proxima subetapa recomendada e `Preferencias remanescentes - Contrato profundo de recorte medio controlado`.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Preferencias remanescentes - Contrato profundo do primeiro recorte medio controlado

- O contrato profundo de `Preferencias remanescentes` foi criado em `docs/fase_2b_preferencias_remanescentes_contrato_profundo.md`.
- A etapa segue exclusivamente documental.
- Nenhuma implementacao foi feita.
- O mapeamento confirmou o eixo common/core de `Preferencias / Configuracoes remanescentes`.
- O modulo passivo existente `frontend/js/modules/preferencias-opcoes-sistema.js` foi reconhecido como apoio de helpers puros.
- O fluxo principal continua concentrado em `frontend/app.js`.
- O recorte medio recomendado para futura implementacao foi definido como a extracao da montagem e atualizacao do preview visual da aba Ambiente de Preferencias.
- O teste manual futuro foi definido para o caminho `Configuracao > Preferencias`, com validacao da aba Ambiente, do preview e da restauracao visual.
- As pendencias e limites continuam explicitamente fora de escopo:
  - backend;
  - banco;
  - endpoints;
  - permissoes;
  - payload efetivo;
  - salvamento;
  - correcao textual;
  - mojibake;
  - `frontend/index.html`.
- Nenhum arquivo de codigo foi alterado nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Preferencias remanescentes - Implementacao minima do preview visual da aba Ambiente

- A primeira implementacao minima do recorte medio controlado de `Preferencias remanescentes` foi realizada.
- O foco foi o preview visual da aba `Ambiente` dentro de Preferencias.
- O modulo comum/core continua sendo `Preferencias / Configuracoes remanescentes`.
- A montagem e atualizacao visual do preview passaram a ser delegadas ao modulo passivo existente `frontend/js/modules/preferencias-opcoes-sistema.js`.
- `frontend/app.js` permaneceu responsavel pela abertura, carregamento, salvamento e roteamento.
- Backend, banco, endpoints, permissoes, payload efetivo e `requestJson` ficaram fora do escopo.
- O teste manual obrigatorio continua pendente antes de qualquer nova subetapa.
- Nenhuma alteracao de comportamento funcional foi pretendida nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Preferencias remanescentes - Validacao pos-teste do preview visual da aba Ambiente

- A validacao pos-teste do commit `593a5b63669ad00d80609c2210e83bcc7dd88b89` foi registrada.
- O teste manual informado pelo usuario foi aprovado.
- O primeiro recorte medio controlado da Fase 2B foi validado com sucesso.
- A divisao de responsabilidades continua a mesma: preview visual da aba `Ambiente` parcial fora de `app.js`, enquanto abertura, carregamento, salvamento, roteamento, fechamento e `sysOpt*` permanecem no fluxo principal.
- Backend, banco, endpoints, permissoes, `requestJson`, payload e salvamento seguem fora do escopo desta etapa.
- Os limites da Fase 2B continuam vigentes.
- O proximo passo ainda nao foi escolhido nesta etapa e depende de novo contrato/recorte controlado.
- Nenhum arquivo de codigo foi alterado nesta validacao pos-teste.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Escolha controlada do proximo recorte medio

- A escolha controlada do proximo recorte medio da Fase 2B foi aberta apos a validacao bem-sucedida do preview visual da aba `Ambiente`.
- Os criterios adotados foram: menor contato com backend, payload, salvamento e permissoes; menor risco textual/mojibake; teste manual claro; rollback mental simples; ganho real de organizacao do `app.js`; possibilidade de recorte medio pequeno.
- A frente recomendada foi `Preferencias remanescentes`, tratada como `comum/core`.
- `Prestadores remanescentes` ficou em segundo plano por ja possuir trilha propria consolidada e por trazer mais conexoes com agenda, convenios e usuarios.
- `Medicamentos`, `Convenios e Planos`, `Ficha pessoal`, `Conta corrente`, `Indices financeiros`, `Agenda principal remanescente`, `Relatorios`, `Materiais` e `Procedimentos genericos` ficaram em segundo plano por risco funcional, dependencia de backend/payload/salvamento ou maior sensibilidade operacional.
- A proxima subetapa recomendada e somente um novo contrato profundo dentro de `Preferencias remanescentes`.
- Os limites da Fase 2B continuam vigentes: nada de backend, banco, endpoints, permissoes, payload efetivo, salvamento, `sysOpt*` ou `Odontograma` sem novo contrato especifico.
- Nenhum codigo foi alterado nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Preferencias remanescentes - Segundo contrato profundo controlado

- O segundo contrato profundo de `Preferencias remanescentes` foi criado em `docs/fase_2b_preferencias_segundo_contrato_profundo.md`.
- Nenhuma implementacao foi feita.
- A frente continua sendo `Preferencias remanescentes`, tratada como `comum/core`.
- Os recortes avaliados foram documentados comparativamente:
  - delegacao da renderizacao dos combos das abas `Geral`, `Modelos` e `Dados`;
  - extracao de `prefSelecionarAba` e `prefAtualizarTitulo`;
  - extracao apenas dos defaults/normalizacao visual de `prefValoresPadrao*`.
- O recorte recomendado para futura implementacao minima continua sendo a delegacao da renderizacao dos combos das abas `Geral`, `Modelos` e `Dados`.
- Os limites da Fase 2B permanecem os mesmos:
  - sem backend;
  - sem banco;
  - sem endpoints;
  - sem permissï¿½es;
  - sem requestJson como area de alteracao;
  - sem payload efetivo;
  - sem salvamento;
  - sem `sysOpt*`;
  - sem Odontograma.
- O teste manual previsto e visual/local e nao inclui salvar.
- Nenhum codigo foi alterado nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Preferencias remanescentes - Implementacao minima dos combos Geral, Modelos e Dados

- A implementacao minima do segundo recorte medio controlado da Fase 2B foi realizada em `Preferencias remanescentes`.
- O recorte aplicado foi a delegacao da renderizacao visual/local dos combos das abas `Geral`, `Modelos` e `Dados do usuario`.
- O modulo comum/core continua sendo `Preferencias / Configuracoes remanescentes`.
- `prefSincronizarUI()` continua como orquestrador do fluxo visual da modal.
- `prefCarregarDados()`, `prefSalvar*()`, `requestJson`, payload efetivo, backend, banco, endpoints e permissoes ficaram fora do escopo.
- `sysOpt*` e `Odontograma` tambem permaneceram fora do escopo.
- O preview de `Ambiente` permaneceu compativel com o comportamento ja validado anteriormente.
- O teste manual permanece pendente antes de qualquer nova subetapa.
- Nenhum codigo fora do recorte visual/local foi pretendido nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Preferencias remanescentes - Validacao pos-teste dos combos Geral, Modelos e Dados

- A validacao pos-teste do commit `05e54e6761b3867b6b594106c3f2459961e7095c` foi registrada.
- O teste manual informado pelo usuario foi aprovado.
- O segundo recorte medio controlado da Fase 2B foi validado com sucesso.
- A divisao de responsabilidades continua a mesma: renderizacao visual/local dos combos fora de `app.js`, enquanto abertura, carregamento, salvamento, roteamento, fechamento, `prefSincronizarUI()`, preview de `Ambiente`, `sysOpt*` e `Odontograma` permanecem no fluxo principal.
- Backend, banco, endpoints, permissoes, `requestJson`, payload e salvamento seguem fora do escopo desta etapa.
- Os limites da Fase 2B continuam vigentes.
- O proximo passo ainda nao foi escolhido nesta etapa e depende de nova escolha controlada.
- Nenhum arquivo de codigo foi alterado nesta validacao pos-teste.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Preferencias remanescentes - Consolidacao parcial apos dois recortes validados

- A consolidacao parcial do estado de Preferencias remanescentes foi registrada apos dois recortes medios controlados validados com sucesso.
- O primeiro recorte validado foi o preview visual da aba `Ambiente`, com implementacao minima em `593a5b63669ad00d80609c2210e83bcc7dd88b89` e validacao pos-teste em `5bf60619e29124a9e229b1454407100ac28ce0b1`.
- O segundo recorte validado foi a renderizacao dos combos das abas `Geral`, `Modelos` e `Dados`, com implementacao minima em `05e54e6761b3867b6b594106c3f2459961e7095c` e validacao pos-teste em `4d7d0e609897c9bb22a16498181f2b592160afd8`.
- O estado atual do modulo ficou parcialmente consolidado: parte do visual/local ja saiu de `app.js`, mas abertura da modal, carregamento, salvamento, roteamento, `prefSincronizarUI()`, `prefAbrirDialogoFonteAmbiente()`, `sysOpt*` e `Odontograma` permanecem no fluxo principal.
- As areas ainda sensiveis permanecem sob cautela: `prefEnsureUI()` amplo, `prefCarregarDados()`, `prefSalvar*()`, `requestJson`, payload efetivo, backend, banco, endpoints, permissoes, financeiro, seguranca e debug.
- Ainda existe ganho seguro em Preferencias, mas agora a expansao deve ser mais conservadora e sempre precedida de novo contrato ou de uma nova matriz comparativa.
- As areas proibidas continuam as mesmas: backend, banco, endpoints, permissoes, `requestJson`, payload efetivo, salvamento, `sysOpt*`, `Odontograma`, financeiro, seguranca, debug, correcoes textuais, acentos, labels/placeholders/mensagens e mojibake.
- A recomendacao registrada e pausar Preferencias por enquanto e abrir uma nova matriz comparativa da Fase 2B antes de qualquer terceiro contrato em Preferencias.
- Nenhuma implementacao direta foi escolhida nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Nova matriz comparativa apos pausa de Preferencias

- A nova matriz comparativa documental foi aberta apos a consolidacao parcial de `Preferencias`.
- A auditoria leve inicial foi registrada sem alteracao de arquivos:
  - branch atual `modularizacao-segura-fase-1`;
  - `git status --short` ainda com untracked antigos em `docs/`;
  - `HEAD` atual em `68334a57c850460a829b1e3f0abe68da9e1ea6a5`;
  - commits recentes relevantes incluindo `68334a5` e `e4c51a4`, com hashes completos confirmados.
- Os criterios adotados para a matriz foram: menor contato com backend, `requestJson`, payload, salvamento e permissoes; menor risco textual/mojibake; teste manual claro; rollback mental simples; ganho real de organizacao do `app.js`; contrato profundo objetivo; recorte medio pequeno.
- A frente recomendada ficou em `Prestadores remanescentes`, tratada como frente especifica de area profissional e com contrato profundo obrigatorio antes de qualquer implementacao.
- `Preferencias` ficou pausada por enquanto, apesar do sucesso dos dois recortes, para evitar avancar automaticamente para `sysOpt*`, `Odontograma`, `requestJson`, payload ou salvamento.
- Os demais candidatos foram relegados a segundo plano por risco funcional, sensibilidade financeira, acoplamento amplo ou menor clareza de teste.
- A proxima subetapa recomendada continua sendo apenas contrato profundo, sem implementacao direta.
- Os limites da Fase 2B continuam vigentes: sem backend, banco, endpoints, permissoes, `requestJson`, payload, salvamento, `sysOpt*`, `Odontograma` ou correcao textual/mojibake.
- Nenhuma implementacao foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Prestadores remanescentes - Contrato profundo do primeiro recorte medio controlado

- O contrato profundo de `Prestadores remanescentes` foi criado como etapa exclusivamente documental da Fase 2B.
- A frente foi classificada como especifica de area profissional, nao como modulo comum/core.
- O contexto ficou amarrado a nova matriz comparativa apos a pausa de `Preferencias`, que recomendou `Prestadores remanescentes` como proxima frente apenas para contrato profundo.
- O mapa documental registrou funcoes de `app.js`, modulos existentes, DOM, eventos, `requestJson`, payload, salvamento, exclusao, backend, endpoints e permissoes apenas por leitura.
- As areas proibidas permaneceram intocadas: backend, banco, endpoints, permissoes, `requestJson`, payload efetivo, salvamento, exclusao, validacoes criticas, integracoes com agenda/financeiro/usuarios, correcoes textuais e mojibake.
- Foram avaliados candidatos pequenos de recorte medio controlado dentro de `Prestadores`, com recomendacao futura para uma composicao visual/local ainda sem tocar persistencia.
- O teste manual previsto foi registrado para uma futura implementacao minima, sem executar nada nesta etapa.
- Nenhuma implementacao direta foi escolhida.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Prestadores remanescentes - Implementacao minima da lista principal e contador

- A implementacao minima do primeiro recorte medio controlado de `Prestadores remanescentes` foi realizada.
- O recorte aplicado foi a delegacao da renderizacao visual/local da lista principal e do contador para o modulo passivo existente.
- A classificacao da frente continua sendo `Prestadores remanescentes` como frente especifica de area profissional, nao modulo comum/core.
- `frontend/app.js` manteve a orquestracao de `prestCarregar()`, filtros, selecao, abertura/fechamento, botoes de acao e fluxos adjacentes.
- `requestJson`, payload efetivo, backend, banco, endpoints, permissoes, salvamento e exclusao ficaram fora do escopo.
- Agenda, financeiro, usuarios/perfis, credenciamento e comissoes tambem permaneceram fora do recorte funcional.
- O teste manual permanece pendente antes de qualquer nova subetapa.
- Nenhum codigo fora da delegacao visual/local foi pretendido nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Prestadores remanescentes - Validacao pos-teste da lista principal e contador

- A validacao pos-teste do commit `24b6e0540a7a55fc709224d3331bfc1090795197` foi registrada.
- O teste manual informado pelo usuario foi aprovado.
- O primeiro recorte medio controlado de `Prestadores remanescentes` foi validado com sucesso.
- A divisao de responsabilidades continua a mesma: renderizacao visual/local da lista e do contador fora de `app.js`, enquanto `prestCarregar()`, filtros, selecao, abertura/fechamento, botoes de acao e fluxos adjacentes permanecem no fluxo principal.
- Backend, banco, endpoints, permissoes, `requestJson`, payload, salvamento, exclusao, agenda, financeiro, usuarios/perfis, credenciamento e comissoes seguem fora do escopo.
- Os limites da Fase 2B continuam vigentes.
- O proximo passo ainda nao foi escolhido nesta etapa e depende de nova escolha controlada.
- Nenhum arquivo de codigo foi alterado nesta validacao pos-teste.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Prestadores remanescentes - Consolidacao parcial apos primeiro recorte validado

- A consolidacao parcial do primeiro recorte medio validado em `Prestadores remanescentes` foi registrada.
- O recorte consolidado foi a lista principal e o contador de Prestadores.
- A classificacao da frente continua sendo especifica de area profissional, nao modulo comum/core.
- O estado atual mostrou que parte do visual/local ja saiu de `app.js`, mas os fluxos restantes se aproximam de areas mais sensiveis como modal, salvar, excluir, agenda, credenciamento, comissoes, permissoes e backend.
- A recomendacao registrada foi pausar `Prestadores` por enquanto e voltar para uma nova matriz comparativa documental da Fase 2B.
- O teste manual passou e continua sendo o marco de validade deste primeiro recorte.
- Nenhuma implementacao direta foi escolhida nesta etapa.
- Os limites ainda vigentes foram mantidos.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Nova matriz comparativa apos pausa de Prestadores

- A nova matriz comparativa documental foi aberta apos a consolidacao parcial de `Prestadores`.
- A consolidacao de `Preferencias` e de `Prestadores` foi mantida como contexto valido para a escolha da proxima frente.
- Os criterios adotados para a matriz foram: menor contato com backend, `requestJson`, payload, salvamento e exclusao; menor contato com permissoes; menor risco textual/mojibake; teste manual claro; rollback mental simples; ganho real de organizacao do `app.js`; contrato profundo objetivo; recorte medio pequeno.
- A frente recomendada ficou em `Convenios e Planos`, tratada como frente comum/core transversal e com contrato profundo obrigatorio antes de qualquer implementacao.
- `Preferencias` continuou pausada e `Prestadores` continuou pausado para evitar avancar automaticamente para `sysOpt*`, `Odontograma`, modal, salvar, excluir, agenda, credenciamento, comissoes, permissao ou backend.
- Os demais candidatos foram relegados a segundo plano por risco funcional, sensibilidade financeira, acoplamento amplo ou menor clareza de teste.
- A proxima subetapa recomendada continua sendo apenas contrato profundo, sem implementacao direta.
- Os limites da Fase 2B continuam vigentes: sem backend, banco, endpoints, permissoes, `requestJson`, payload, salvamento, exclusao, `sysOpt*`, `Odontograma` ou correcao textual/mojibake.
- Nenhuma implementacao foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Auditoria central de abertura de paineis apos Conta corrente

- O teste pos-correcao da `Conta corrente` revelou uma falha central de abertura de paineis: varios modulos nao abrem porque `hideAllPanels()` acaba quebrando em `usersDetachOverlay()`.
- O console reportado foi `ReferenceError: usersPanelOverlay is not defined` em `app.js?v=20260513-medicamentos-sub1`.
- A auditoria documental foi aberta antes de qualquer correcao.
- O commit `beee5d72cc3ebf82dd8bbcef35a3f4ca5f748647` segue nao validado.
- A validacao de `Conta corrente` continua bloqueada ate o fluxo central voltar a abrir de forma estavel.
- A correcao desta auditoria nao tocou `requestJson`, payload, salvamento, exclusao, backend, permissoes, relatorios ou fluxos financeiros sensiveis.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Correcao minima da regressao central usersPanelOverlay

- A variavel global `usersPanelOverlay` foi restaurada no bloco de estado inicial de `frontend/app.js`, mantendo a correcao no menor escopo possivel.
- A falha central afetava `hideAllPanels()` e podia impedir a abertura de varios paineis.
- A validacao da `Conta corrente` continua dependente de novo teste manual apos essa correcao.
- `requestJson`, payload, salvamento, exclusao, backend, permissoes e fluxos financeiros sensiveis permaneceram fora do escopo.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Auditoria de retorno ao ultimo ponto funcional antes da Conta corrente

- A auditoria confirmou `eb437dfad95f004f43a06d1db071438203ede90a` como o ultimo ponto funcional antes da tentativa de modularizacao de `Conta corrente`.
- Os commits posteriores incluem `beee5d7`, `ad2627d`, `abdf2fa`, `0e911ca` e `d85bed1`, com alteracoes em codigo, modulo novo, auditorias, correcoes e roadmap.
- A estrategia recomendada para a proxima etapa e um novo commit controlado restaurando apenas os arquivos de codigo ao estado de `eb437df`, preservando toda a documentacao.
- Nenhum rollback foi executado ainda.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Rollback controlado de codigo ao ponto funcional anterior

- O rollback controlado de codigo foi executado para retornar ao ponto funcional `eb437dfad95f004f43a06d1db071438203ede90a`.
- `frontend/app.js` foi restaurado ao estado de `eb437df`.
- `frontend/js/modules/conta-corrente.js` foi removido, porque nao existia no ponto funcional restaurado.
- O historico foi preservado e nenhum `git reset` foi usado.
- A documentacao posterior das tentativas e auditorias foi preservada.
- O teste manual apos o rollback continua obrigatorio antes de retomar qualquer subetapa da Fase 2B.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Nova matriz comparativa apos pausa de Ficha pessoal

- A nova matriz comparativa documental foi aberta apos o contrato profundo de `Ficha pessoal` concluir que nao existe recorte medio suficientemente seguro agora.
- A consolidacao de `Preferencias`, `Prestadores` e `Convï¿½nios e Planos` foi mantida como contexto, assim como a pausa sem implementacao de `Medicamentos` e `Ficha pessoal`.
- A auditoria leve do commit `09544fc6f89c5c1a3aed5b5c2098b2c4c414a3e7` foi registrada:
  - `git status --short` mostrou apenas untracked antigos em `docs/`, sem alteracao de codigo;
  - `git log --oneline -5` confirmou `09544fc` no historico recente;
  - `git show --name-only --stat --oneline 09544fc6f89c5c1a3aed5b5c2098b2c4c414a3e7` mostrou apenas `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2b_ficha_pessoal_contrato_profundo.md`;
  - a aparente indicacao visual de 4 arquivos editados foi tratada como duplicidade de interface/summary, nao como alteracao real adicional.
- Os criterios adotados para a matriz foram: menor contato com backend, `requestJson`, payload, salvamento e exclusao; menor contato com permissoes; menor risco textual/mojibake; teste manual claro; rollback mental simples; ganho real de organizacao do `app.js`; contrato profundo objetivo; recorte medio pequeno.
- A frente recomendada ficou em `Conta corrente`, tratada como `comum/core transversal` e com contrato profundo obrigatorio antes de qualquer implementacao.
- `Preferï¿½ncias`, `Prestadores`, `Convï¿½nios e Planos`, `Medicamentos` e `Ficha pessoal` continuaram pausados, evitando reentrada em `sysOpt*`, `Odontograma`, modal, salvar, excluir, agenda, credenciamento, comissoes, calendario, `requestJson`, payload, pacientes, financeiro, recebimentos, procedimentos, permissï¿½es ou backend.
- `Indices financeiros`, `Materiais`, `Agenda principal remanescente`, `Procedimentos genericos` e `Relatorios` ficaram em segundo plano por sensibilidade, tamanho do bloco, risco funcional ou acoplamento estrutural.
- A proxima subetapa recomendada continua sendo apenas contrato profundo, sem implementacao direta.
- Os limites da Fase 2B continuam vigentes: sem backend, banco, endpoints, permissoes, `requestJson`, payload, salvamento, exclusao, `sysOpt*`, `Odontograma` ou correcao textual/mojibake.
- Nenhuma implementacao foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Conta corrente - Contrato profundo do primeiro recorte medio controlado

- O contrato profundo de `Conta corrente` foi criado como etapa exclusivamente documental da Fase 2B.
- A frente foi tratada como `comum/core transversal`, com cautela reforcada por envolver financeiro, recebimentos, pagamentos, fluxo de caixa e relatorios.
- O mapa documental registrou funcoes de `app.js`, o modulo adjacente `frontend/js/modules/plano-contas.js`, DOM, eventos, `requestJson`, payload, salvamento, exclusao, backend, endpoints e permissoes apenas por leitura.
- As areas proibidas permaneceram intocadas: backend, banco, endpoints, permissoes, `requestJson`, payload efetivo, salvamento, exclusao, validacoes criticas, alteracao de valores/datas/status/forma de pagamento, relatorios financeiros, vinculos transversais e correcoes textuais/mojibake.
- Foi recomendado como recorte medio controlado futuro a renderizacao visual/local da tabela de lancamentos e dos totais/resumo mensal, sem tocar persistencia.
- O teste manual previsto foi registrado para uma futura implementacao minima, sem executar nada nesta etapa.
- Nenhuma implementacao direta foi escolhida.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Conta corrente - Implementacao minima da tabela de lancamentos e totais

- A implementacao minima do primeiro recorte medio controlado da Fase 2B foi realizada em `Conta corrente`.
- O recorte aplicado foi a delegacao da renderizacao visual/local da tabela de lancamentos e dos totais/resumo mensal para o modulo passivo `frontend/js/modules/conta-corrente.js`.
- A classificacao da frente continua sendo `comum/core transversal`.
- `frontend/app.js` manteve a orquestracao de carregamento, filtros, selecao, abertura/fechamento, modal, salvar, excluir, imprimir, relatorios, fluxo de caixa, payload e `requestJson`.
- `requestJson`, payload efetivo, backend, banco, endpoints, permissoes, salvamento e exclusao ficaram fora do escopo.
- Relatorios, fluxo de caixa, recebimentos, pagamentos, pacientes, agenda, convenios, prestadores e procedimentos tambem permaneceram fora do recorte funcional.
- Valores financeiros, datas, status e formas de pagamento nao foram alterados.
- O teste manual permanece pendente antes de qualquer nova subetapa.
- Nenhum codigo fora da delegacao visual/local foi pretendido nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Conta corrente - Auditoria da tela que nao abre

- O teste manual informou que a tela de `Conta corrente` nao abriu.
- O commit `beee5d72cc3ebf82dd8bbcef35a3f4ca5f748647` permanece sem validacao pos-teste.
- Foi aberta auditoria documental antes de qualquer correcao.
- O diff registrou o preloader assincrono `contaCorrenteModulePromise` em `app.js` e a nova delegacao de `ccRenderTabela()` para o modulo passivo.
- `node --check frontend/app.js` passou e `node --check frontend/js/modules/conta-corrente.js` passou, entao a suspeita recai sobre o bootstrap/runtime do navegador e nao sobre sintaxe local.
- Nenhuma validacao final foi registrada nesta etapa.
- Os limites da Fase 2B continuam vigentes.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Conta corrente - Correcao minima da abertura da tela

- A correï¿½ï¿½o mï¿½nima da abertura da tela `Financeiro > Conta corrente` foi aplicada.
- A delegaï¿½ï¿½o para o mï¿½dulo passivo foi temporariamente desativada em `app.js`, e `ccRenderTabela()` voltou a ser sï¿½ncrona e autï¿½noma.
- O mï¿½dulo `frontend/js/modules/conta-corrente.js` foi preservado para futura integraï¿½ï¿½o mais segura, sem uso no bootstrap desta rodada.
- A correï¿½ï¿½o nï¿½o tocou `requestJson`, payload, salvamento, exclusï¿½o, backend, permissï¿½es, relatï¿½rios ou fluxos financeiros sensï¿½veis.
- A validaï¿½ï¿½o do commit `beee5d7` continua dependendo de novo teste manual apï¿½s esta correï¿½ï¿½o.
- Nenhuma nova validaï¿½ï¿½o final foi registrada nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Ficha pessoal - Contrato profundo do primeiro recorte medio controlado

- O contrato profundo de `Ficha pessoal` foi criado como etapa exclusivamente documental da Fase 2B.
- A frente foi tratada como `comum/core transversal`, com cautela reforcada por envolver cadastro de paciente, dados pessoais, contatos, convenio/plano, anamnese, historico, documentos, agenda e financeiro.
- O mapa documental registrou funcoes de `app.js`, modulos proximos, DOM, eventos, `requestJson`, payload, salvamento, exclusao, backend, endpoints e permissoes apenas por leitura.
- Os candidatos de recorte medio analisados nao liberaram uma superficie segura para implementacao agora.
- A recomendacao registrada foi pausar `Ficha pessoal` por enquanto e abrir nova matriz comparativa ou escolher outra frente antes de qualquer nova tentativa.
- Os limites da Fase 2B permanecem vigentes: sem backend, banco, endpoints, permissoes, `requestJson`, payload, salvamento, exclusao, dados reais de paciente, anamnese, historico, documentos, atendimento, agenda ou financeiro.
- Nenhuma implementacao foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Medicamentos - Contrato profundo do primeiro recorte medio controlado

- O contrato profundo de `Medicamentos` foi criado como etapa exclusivamente documental da Fase 2B.
- A frente foi classificada como `comum/core transversal`.
- O contexto ficou amarrado a nova matriz comparativa pos-Convï¿½nios e Planos, que recomendou `Medicamentos` como proxima frente apenas para contrato profundo.
- O mapa documental registrou funcoes de `app.js`, modulo existente, DOM, eventos, `requestJson`, payload, salvamento, exclusao, backend, endpoints e permissoes apenas por leitura.
- As areas proibidas permaneceram intocadas: backend, banco, endpoints, permissoes, `requestJson`, payload efetivo, salvamento, exclusao, validacoes criticas, vinculos com Assistente de receitas, editor, documento gerado, receituario, pacientes e atendimentos, alem de correcoes textuais e mojibake.
- Os candidatos avaliados nao liberaram recorte medio controlado realmente seguro; a recomendacao final foi nao implementar agora e abrir nova matriz ou escolher outra frente.
- O teste manual foi registrado apenas para uma futura decisao, sem executar nada nesta etapa.
- Nenhuma implementacao direta foi escolhida.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Nova matriz comparativa apos pausa de Medicamentos

- A nova matriz comparativa documental foi aberta apos o contrato profundo de `Medicamentos` concluir que nao existe recorte medio suficientemente seguro para implementacao agora.
- A consolidacao de `Preferï¿½ncias`, `Prestadores`, `Convï¿½nios e Planos` e `Medicamentos` foi mantida como contexto valido para a escolha da proxima frente.
- Os criterios adotados para a matriz foram: menor contato com backend, `requestJson`, payload, salvamento e exclusao; menor contato com permissoes; menor risco textual/mojibake; teste manual claro; rollback mental simples; ganho real de organizacao do `app.js`; contrato profundo objetivo; recorte medio pequeno.
- A frente recomendada ficou em `Ficha pessoal`, tratada como `comum/core transversal` e com contrato profundo obrigatorio antes de qualquer implementacao.
- `Preferï¿½ncias`, `Prestadores` e `Convï¿½nios e Planos` continuaram pausados por ja terem recortes validados e consolidados.
- `Medicamentos` continuou pausado porque o contrato profundo concluiu que nao ha recorte medio suficientemente seguro agora, devido ao acoplamento com Assistente de receitas, editor, documento gerado, receituario, `requestJson`, payload, salvamento, exclusao, endpoints, pacientes e atendimentos.
- Os demais candidatos foram relegados a segundo plano por risco funcional, sensibilidade financeira, acoplamento amplo ou menor clareza de teste.
- A proxima subetapa recomendada continua sendo apenas contrato profundo, sem implementacao direta.
- Os limites da Fase 2B continuam vigentes: sem backend, banco, endpoints, permissoes, `requestJson`, payload, salvamento, exclusao, `sysOpt*`, `Odontograma` ou correcao textual/mojibake.
- Nenhuma implementacao foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Convenios e Planos - Contrato profundo do primeiro recorte medio controlado

- O contrato profundo de `Convï¿½nios e Planos` foi criado como etapa exclusivamente documental da Fase 2B.
- A frente foi classificada como comum/core transversal.
- O contexto ficou amarrado a nova matriz comparativa pos-Prestadores, que recomendou `Convï¿½nios e Planos` como proxima frente apenas para contrato profundo.
- O mapa documental registrou funcoes de `app.js`, modulos existentes, DOM, eventos, `requestJson`, payload, salvamento, exclusao, backend, endpoints e permissoes apenas por leitura.
- As areas proibidas permaneceram intocadas: backend, banco, endpoints, permissoes, `requestJson`, payload efetivo, salvamento, exclusao, validacoes criticas, vinculos com pacientes, agenda, financeiro, recebimentos, procedimentos e prestadores, alem de correcoes textuais e mojibake.
- Foram avaliados candidatos pequenos de recorte medio controlado dentro de `Convï¿½nios e Planos`, com recomendacao futura para a renderizacao visual/local da lista principal e dos contadores.
- O teste manual previsto foi registrado para uma futura implementacao minima, sem executar nada nesta etapa.
- Nenhuma implementacao direta foi escolhida.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Convenios e Planos - Implementacao minima da lista principal e contadores

- A implementacao minima do primeiro recorte medio controlado da Fase 2B foi realizada em `Convenios e Planos`.
- O recorte aplicado foi a delegacao da renderizacao visual/local da lista principal e dos contadores para o modulo passivo existente.
- A classificacao da frente continua sendo comum/core transversal.
- `frontend/app.js` manteve a orquestracao de carregamento, selecao, abertura/fechamento, botoes, modais, calendario de faturamento, salvar, excluir, payload e `requestJson`.
- `requestJson`, payload efetivo, backend, banco, endpoints, permissoes, salvamento e exclusao ficaram fora do escopo.
- Calendario, modais, pacientes, agenda, financeiro, recebimentos, procedimentos e prestadores tambem permaneceram fora do recorte funcional.
- O teste manual permanece pendente antes de qualquer nova subetapa.
- Nenhum codigo fora da delegacao visual/local foi pretendido nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Convenios e Planos - Auditoria de regressao visual/textual em Telefones

- O teste funcional geral do commit `81379b6d2c9901ab0e77ab4bf6bf1f4e7da0bc8e` passou, mas foi observada uma regressao visual/textual na area de `Telefones` da modal de `Convï¿½nios e Planos`.
- O texto exibido em vermelho aparece como mojibake semelhante a `ï¿½ï¿½...` no lugar de um simbolo/icone de telefone.
- A validacao pos-teste do commit `81379b6` continua bloqueada ate a analise conclusiva e eventual correcao futura.
- Foi aberta auditoria documental antes de qualquer correï¿½ï¿½o.
- Nao houve validacao final nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Convenios e Planos - Correcao pontual do mojibake no icone de telefones

- A correï¿½ï¿½o pontual foi aplicada somente no literal do ï¿½cone/sï¿½mbolo de telefone da funï¿½ï¿½o `convPlanConvenioPhoneRowV2()` em `frontend/app.js`.
- O mojibake identificado `ï¿½ï¿½}` foi substituido por `&#9742;`, mantendo a intencao visual sem depender de encoding ambï¿½guo.
- A correï¿½ï¿½o foi separada de qualquer refatoraï¿½ï¿½o ou ajuste de listas/contadores.
- `requestJson`, payload, salvamento, exclusï¿½o, backend, permissï¿½es e fluxos transversais permaneceram fora do escopo.
- A validaï¿½ï¿½o pï¿½s-teste do commit `81379b6` continua dependendo de novo teste manual apï¿½s esta correï¿½ï¿½o.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Convenios e Planos - Validacao pos-teste da lista principal e contadores

- A validacao pos-teste do commit `81379b6d2c9901ab0e77ab4bf6bf1f4e7da0bc8e` foi registrada.
- A auditoria documental `c7040a41b996935c01b3efdb7d90ce0d4e157299` confirmou que o mojibake da area de telefones era preexistente.
- A correï¿½ï¿½o pontual `0c64ed30f06ab929a14515ce2b207ff27a0b9d94` foi validada depois do teste.
- O primeiro recorte medio controlado de `Convï¿½nios e Planos` foi validado com sucesso em teste manual.
- A separacao entre implementacao, auditoria e correï¿½ï¿½o ficou preservada.
- `requestJson`, payload, salvamento, exclusï¿½o, backend, permissï¿½es e fluxos transversais permaneceram fora do escopo.
- Os limites da Fase 2B continuam vigentes.
- O proximo passo ainda nao foi escolhido nesta etapa e depende de nova escolha controlada.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Convenios e Planos - Consolidacao parcial apos primeiro recorte validado

- A consolidacao parcial do primeiro recorte medio validado em `Convï¿½nios e Planos` foi registrada como etapa exclusivamente documental.
- O recorte consolidado permaneceu sendo a lista principal e os contadores, com separacao clara entre `app.js` e modulo passivo.
- O teste manual passou apos a correï¿½ï¿½o pontual do mojibake na area de telefones.
- A correï¿½ï¿½o pontual foi mantida separada da refatoraï¿½ï¿½o da lista e dos contadores.
- O estado atual da frente foi documentado sem ampliar escopo para calendario, modais, salvar, excluir, `requestJson`, payload, backend ou permissï¿½es.
- Os limites da Fase 2B permanecem vigentes e a proxima subetapa recomendada ï¿½ nova matriz comparativa documental.
- Nenhuma nova implementacao foi escolhida nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Nova matriz comparativa apos pausa de Convenios e Planos

- A nova matriz comparativa documental foi aberta apos a consolidacao parcial de `Convï¿½nios e Planos`.
- A consolidacao de `Preferï¿½ncias`, `Prestadores` e `Convï¿½nios e Planos` foi mantida como contexto valido para a escolha da proxima frente.
- Os criterios adotados para a matriz foram: menor contato com backend, `requestJson`, payload, salvamento e exclusao; menor contato com permissoes; menor risco textual/mojibake; teste manual claro; rollback mental simples; ganho real de organizacao do `app.js`; contrato profundo objetivo; recorte medio pequeno.
- A frente recomendada ficou em `Medicamentos`, tratada como `comum/core transversal` e com contrato profundo obrigatorio antes de qualquer implementacao.
- `Preferï¿½ncias`, `Prestadores` e `Convï¿½nios e Planos` continuaram pausados para evitar reentrada em `sysOpt*`, `Odontograma`, modal, salvar, excluir, agenda, credenciamento, comissoes, calendario, `requestJson`, payload, pacientes, financeiro, recebimentos, procedimentos, permissï¿½es ou backend.
- Os demais candidatos foram relegados a segundo plano por risco funcional, sensibilidade financeira, acoplamento amplo ou menor clareza de teste.
- A proxima subetapa recomendada continua sendo apenas contrato profundo, sem implementacao direta.
- Os limites da Fase 2B continuam vigentes: sem backend, banco, endpoints, permissoes, `requestJson`, payload, salvamento, exclusao, `sysOpt*`, `Odontograma` ou correcao textual/mojibake.
- Nenhuma implementacao foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.





## Ajuste documental posterior da trilha 8B/8C

- A Subetapa 8B foi regularizada em commit proprio: `9444c9e1d4d9f7f0c90b14d56d7d2eb5f1e2e0fd`.
- O documento da 8B foi finalmente incluido em commit proprio, separado do baseline da 8C.
- A interpretacao do baseline da 8C foi corrigida: o `USUARIO 38` nao faz parte do nascimento padrao da conta 16, pois foi criado manualmente apos a criacao da conta e depois removido.
- O baseline valido para nascimento padrao da conta 16 passa a considerar `USUARIO 36` como usuario estrutural/system, `USUARIO 37` como admin inicial e `PRESTADOR 22` como prestador sistemico/reservado.
- Permanecem validos: tabela Brana, perfis reservados, seeds odontologicos, ausencia de unidade formal e ausencia de `usuario_perfil_acesso` formal.
- A coexistencia de metadata legada "Tabela Exemplo" com Brana continua sendo lacuna valida.
- Nao houve implementacao, nem alteracao da conta 16, nem criacao de novas contas.
- A proxima subetapa recomendada permanece documental e deve partir da confirmacao dessa baseline corrigida.

## Subetapa 8D da frente EasyDental virgem

- Subetapa executada: contrato tecnico da unidade inicial e da matriz de perfis/permissoes para novas contas.
- A unidade de referencia do EasyDental foi consolidada no contrato como `Principal` com codigo `0001`.
- O prestador `Mestre` foi mantido como referencia documental para o admin inicial de codigo `1`.
- O prestador `Clï¿½nica` foi mantido como referencia documental para o prestador sistemico/reservado de codigo `255`.
- O contrato reforca que a nova conta Brana deve nascer com unidade inicial formal, sem depender do setup para completar estrutura minima.
- O contrato reforca que `permissoes_json` sozinho nao basta e que deve existir matriz formal equivalente a `usuario_perfil_acesso` ou modelo confiavel equivalente.
- O baseline da conta 16 segue valido com a ressalva de que nao ha unidade formal e nao ha matriz formal de acesso.
- Nao houve implementacao.
- A conta ID 16 nao foi alterada.
- Nenhuma nova conta foi criada.
- A proxima subetapa recomendada ficou em `EasyDental virgem - Subetapa 8E - baseline documental e teste manual da unidade inicial e matriz formal de perfis/permissoes na conta atual, sem alteracao de codigo`.

## Subetapa 8E da frente EasyDental virgem

- Subetapa executada: contrato mestre das tabelas e registros que nascerao em novas contas.
- A unidade inicial `Principal` / `0001` foi consolidada como regra contratual.
- `Mestre` ID `1` segue como referencia documental do admin inicial e `Clï¿½nica` ID `255` segue como referencia documental do prestador/usuario sistemico.
- O contrato mestre classifica o que nasce, o que nao nasce, o que ja existe no Brana e sera mantido, o que sera melhorado, o que e pendente e o que e protegido.
- O contrato mestre reforca que nao se deve duplicar o que ja existe no Brana e que futuras implementacoes devem respeitar modularizacao segura.
- A regra de modularizacao futura continua sendo: frontend novo deve preferir modulo pequeno e dedicado, backend deve preferir helper/service isolado e banco/schema deve ter contrato proprio antes de qualquer alteracao.
- O baseline da conta 16 continua valido com a ressalva de que nao ha unidade formal e nao ha matriz formal de acesso.
- Nao houve implementacao.
- A conta ID 16 nao foi alterada.
- Nenhuma nova conta foi criada.
- A proxima subetapa recomendada ficou em `EasyDental virgem - Subetapa 8F - baseline documental comparativa da conta atual contra o contrato mestre de novas contas, sem alteracao de codigo`.

## Subetapa 8F da frente EasyDental virgem

- Subetapa executada: correcao do contrato de tabelas estruturais para novas contas.
- O contrato mestre foi corrigido para nao duplicar o que ja existe no Brana e para separar claramente tabela estrutural, equivalente existente, equivalente futuro e dado de uso.
- A revisao reforca que `CID` continua sendo exemplo de equivalente ja existente no Brana, a ser mantido ou melhorado, sem duplicacao.
- A revisao separa TISS, Intervencoes/Procedimentos, odontograma, anamnese, materiais, repasses e lookups auxiliares entre estrutura, seed e dado transacional.
- A revisao explicita que tabelas de uso como historico, agenda, lancamentos, respostas e registros transacionais nao devem nascer como seed.
- A revisao registra quais tabelas ja existem no Brana, quais devem ser mantidas ou melhoradas e quais ainda precisam de equivalente futuro.
- A regra de modularizacao futura permanece: qualquer implementacao posterior deve nascer pequena, isolada e com contrato proprio, sem agrupar correcao de frontend, backend e banco numa unica entrega.
- Nao houve implementacao.
- Nenhuma nova conta foi criada ou alterada.
- A proxima subetapa recomendada ficou em `EasyDental virgem - Subetapa 8G - fechamento do contrato mestre revisado`.

## Subetapa 8G da frente EasyDental virgem

- Subetapa executada: fechamento do contrato mestre revisado de novas contas.
- A versao final revisada consolida o que ja existe no Brana e nao deve duplicar, o que deve ser melhorado, o que falta e deve entrar como equivalente futuro, o que deve existir como estrutura vazia e o que deve nascer populado como seed.
- A revisao final reforca que seeds sao apenas de catalogos, lookups e configuracoes estruturais; dados de pacientes, agenda, financeiro, historico, logs, temporarios e respostas preenchidas ficam fora do nascimento.
- A revisao final preserva `Principal / 0001`, `Mestre` `1`, `Clï¿½nica` `255`, a tabela Brana, os equivalentes de CID, procedimentos, anamnese, TISS tipo tabela e a matriz formal de acesso quando confirmada.
- A revisao final fecha o fluxo de nascimento de nova conta sem depender de setup para a estrutura minima.
- A regra de modularizacao futura permanece: cada implementacao posterior deve nascer pequena, isolada e com contrato proprio, com primeira implementacao mais segura sendo a unidade `Principal / 0001`.
- Nao houve implementacao.
- Nenhuma nova conta foi criada ou alterada.
- A proxima subetapa recomendada ficou em `EasyDental virgem - Subetapa 8H - implementacao isolada da unidade Principal 0001 apenas para novas contas`.

## Subetapa 8H da frente EasyDental virgem

- Subetapa executada: contrato das tabelas de procedimentos/precos para novas contas.
- A lista nominal correta de TAB_PRC do EasyDental virgem foi corrigida para `Banco do Brasil`, `Banespa`, `Bradesco`, `Caixa Econ Federal`, `CNCC`, `Particular`, `Petrobras`, `Sindicato` e `Telebras`.
- Novas contas Brana passam a nascer com essas 9 tabelas herdadas do EasyDental virgem mais a tabela `Brana`, totalizando 10 tabelas de procedimentos/precos no nascimento.
- `Tabela Exemplo` nao nasce mais em novas contas; ela pode permanecer em contas antigas sem migracao automatica.
- `Particular` retorna como tabela herdada de novas contas, mas `Brana` continua sendo a tabela privada/padrao do SaaS.
- A decisao sobre precos, custos e repasses fica sanitizada para novas contas, sem trazer valores comerciais indevidos do EasyDental.
- A regra de modularizacao futura permanece: qualquer implementacao posterior deve ser pequena, isolada e preferencialmente concentrada em helper idempotente, sem misturar unidade, permissoes, TISS e setup na mesma entrega.
- Nao houve implementacao.
- Nenhuma nova conta foi criada ou alterada.
- A proxima subetapa recomendada ficou em `EasyDental virgem - Subetapa 8I - contrato tecnico de implementacao das 10 tabelas de procedimentos/precos, sem codigo`.

## Subetapa 8I da frente EasyDental virgem

- Subetapa executada: contrato tecnico de implementacao das 10 tabelas de procedimentos/precos.
- A implementacao futura deve ocorrer no fluxo de signup em `backend/services/signup_service.py`, por helper idempotente e isolado.
- A decisao tecnica recomendada e replicar os procedimentos nas 10 tabelas com valores sanitizados, mantendo Brana como tabela privada/padrao.
- Os precos devem nascer sanitizados, preferencialmente com zero ou nulo conforme o modelo permitir, sem trazer valores comerciais indevidos.
- As 10 tabelas devem aparecer ao usuario final, com Brana em primeiro/padrao e Tabela Exemplo ausente nas novas contas.
- O metadata inicial da clinica deve apontar Brana como padrao/privada, sem herdar Tabela Exemplo nas novas contas.
- O helper idempotente recomendado compara por `clinica_id` + nome normalizado e nao altera contas antigas.
- Os seeds provaveis foram mapeados e os testes futuros obrigatorios foram registrados.
- A regra de modularizacao futura permanece: qualquer implementacao posterior deve continuar pequena, isolada e sem misturar unidade, permissoes, TISS ou setup na mesma entrega.
- Nao houve implementacao.
- Nenhuma nova conta foi criada ou alterada.
- A proxima subetapa recomendada ficou em `EasyDental virgem - Subetapa 8J - implementacao isolada das 10 tabelas de procedimentos/precos apenas para novas contas`.

## Subetapa 8J da frente EasyDental virgem

- Subetapa executada: implementacao isolada das 10 tabelas de procedimentos/precos apenas para novas contas.
- O helper idempotente foi aplicado no fluxo de signup em `backend/services/signup_service.py`, apos `seed_procedimentos_genericos(db, clinica.id)`, para garantir as 10 tabelas sem afetar contas existentes.
- `Brana` passa a nascer como tabela privada/padrao; `Tabela Exemplo` nao nasce mais em novas contas.
- `Particular` nasce como tabela herdada, mas nao como padrao.
- Os procedimentos canonicos sao replicados nas 10 tabelas com valores sanitizados.
- A ordem de exibicao das tabelas foi ajustada para mostrar Brana primeiro e respeitar a sequencia contratual.
- Os checks sintaticos foram executados com sucesso em `backend/services/signup_service.py`, `backend/seeds/procedimentos_padrao.py` e `backend/routes/procedimentos_routes.py`.
- O teste manual deve ser feito criando uma nova conta e verificando as 10 tabelas, a ausencia de `Tabela Exemplo`, a presenca de `Brana` como padrao/privada e a preservacao da conta 16.
- Nenhuma conta existente foi alterada.
- Nenhuma conta foi criada automaticamente.
- A proxima subetapa recomendada ficou em `EasyDental virgem - Subetapa 8K - validacao manual da nova conta apos implementacao das 10 tabelas`.

## Subetapa 8K da frente EasyDental virgem

- Subetapa executada: implementacao isolada da unidade Principal / 0001 apenas para novas contas.
- O helper `_garantir_unidade_principal_clinica(db, clinica_id)` foi criado em `backend/services/signup_service.py` para garantir a unidade sem duplicar registros e sem afetar contas existentes.
- A unidade nasce com nome `Principal` e codigo `0001`, ativa, com campos opcionais mantidos vazios.
- A implementacao nao mexeu em Mestre, Clinica, usuarios, prestadores, permissoes, TISS, setup ou nas tabelas de procedimentos/precos da 8J.
- Os checks sintaticos foram executados com sucesso em `backend/services/signup_service.py`.
- O teste manual deve ser feito criando uma nova conta e verificando a unidade Principal / 0001, sem duplicidade, sem afetar a conta 16 e sem alterar contas antigas.
- Nenhuma conta existente foi alterada.
- Nenhuma conta foi criada automaticamente.
- A proxima subetapa recomendada ficou em `EasyDental virgem - Subetapa 8L - validacao manual da nova conta apos unidade + 10 tabelas`.

## Subetapa 8L da frente EasyDental virgem

- Subetapa executada: auditoria da senha interna, setup e Opcoes do Sistema.
- A auditoria separou explicitamente login SaaS de senha interna do sistema.
- `setup_completed` continua sendo o gate atual do Brana para liberar a aplicacao apos o primeiro acesso.
- `clinicas.opcoes_sistema_json` guarda as flags de seguranca, incluindo `ativar_controle_usuarios` e `ativar_auditoria`.
- No Brana atual, `config-alterar-senha` abre a troca de senha do usuario logado, nao um fluxo interno separado equivalente ao EasyDental.
- A regra observada no EasyDental foi registrada: controle de usuarios/senhas e auditoria nascem desmarcados e o menu de alteracao de senha aparece depois de ativar o controle interno.
- O share `\\\\Sonyvaio\\c\\EDS70` nao estava acessivel neste ambiente, entao a trilha do EasyDental foi tratada como documental e baseada em docs historicos e na regra observada pelo usuario.
- Nao houve implementacao.
- Nenhuma conta foi criada ou alterada.
- A proxima subetapa recomendada ficou em validacao manual da nova conta 8J/8K antes de mexer no setup interno.

## Subetapa 8M da frente EasyDental virgem

- Subetapa executada: exclusao segura da conta ID 16 / `institutobrana@gmail.com` para liberar o e-mail e permitir validacao limpa das Subetapas 8J e 8K.
- Documentos revisados: contrato central de exclusao segura, trilhas seguras das clinicas 8, 9, 10 e 15, baseline documental da conta 16 e o inventario de contratos/regras.
- Procedimento encontrado: runner generico seguro `backend/scripts/remover_conta_teste.py`, com plan/preview por leitura e confirmacao explicita antes da execucao real.
- Dry-run executado com sucesso: plano apontou somente a conta 16, os usuarios 36/37 e as dependencias vinculadas, sem alterar nada.
- Execucao real concluida com sucesso: a conta 16 foi removida e o e-mail `institutobrana@gmail.com` foi liberado.
- Nenhuma outra conta foi afetada: apos a exclusao restaram apenas as clinicas `1` e `4`.
- As entregas 8J e 8K permaneceram preservadas, sem qualquer alteracao de codigo.
- Nao houve alteracao em EasyDental, frontend, banco schema, migrations, seeds ou endpoints durante esta etapa.
- Nao houve criacao de nova conta automaticamente.
- A proxima subetapa recomendada ficou em `EasyDental virgem - Subetapa 8M - validacao manual da nova conta limpa apos exclusao segura da conta 16`.

## Adendo 8M - correcao documental das tabelas de procedimentos por tabela EasyDental

- O teste manual apos 8J/8K confirmou que a unidade Principal / 0001 nasceu corretamente, mas as tabelas de procedimentos/precos herdadas ainda estavam recebendo o seed Brana repetido.
- A investigacao de leitura confirmou que o EasyDental vivo acessivel nesta sessao expunha apenas 4 tabelas `TAB_PRC` populadas: `EASY - Particular` (112), `Caixa Econ. Federal` (88), `PARTICULAR` (336) e `UNIMED-ODONTO` (162).
- O backup legado local revisado em `D:\\BRANA ARQUIVOS\\PROJETO_PRECIFICACAO_LEGADO\\saas\\backend\\backups\\brana_saas_full_20260413_130945\\data\\procedimento.csv` mostrou 9 grupos de tabela com contagens distintas, mas ainda sem um mapa verificavel fechado para os 9 nomes contratuais do Brana.
- Por seguranca, nao foi feita correï¿½ï¿½o incompleta nem inventado mapa de seeds por tabela.
- A correï¿½ï¿½o permanece bloqueada ate existir um mapa confiavel por tabela EasyDental ou uma revisao contratual que feche a relacao entre os nomes do Brana e a origem de cada seed.
- Nenhuma conta existente foi alterada e nenhum arquivo de codigo foi modificado nesta revisao documental.
- A proxima etapa recomendada e obter o mapa verificavel antes de qualquer nova implementacao de seed por tabela.

## Subetapa 8N da frente EasyDental virgem

- Subetapa executada: mapa verificavel `TAB_PRC` / `TAB_PRC_ITEM` do EasyDental virgem com acesso restaurado ao caminho `\\\\Sonyvaio\\c\\EDS70`.
- O arquivo `TAB_PRC.raw` confirmou os 9 nomes contratuais da tabela de procedimentos/precos do EasyDental virgem: `Particular`, `Sindicato`, `Bradesco`, `Banco do Brasil`, `Caixa Econ. Federal`, `Banespa`, `Telebrï¿½s`, `Petrobrï¿½s` e `CNCC`.
- As divergencias em relacao ao contrato do Brana sao apenas ortograficas / de acentuacao em `Caixa Econ Federal`, `Petrobras` e `Telebras`.
- O arquivo `TAB_PRC_ITEM.raw` permaneceu acessivel, mas a contagem por tabela nao ficou fechada com seguranca nesta sessao.
- Fontes secundarias continuam divergentes e nao servem como substitutas da fonte virgem: o SQL vivo acessivel nesta maquina mostrou apenas 4 tabelas ativas e o backup legado local mostra grupos de tabela do legado Brana / conta antiga.
- Nao houve implementacao.
- Nenhuma conta foi criada ou alterada.
- A correï¿½ï¿½o continua bloqueada ate a complementacao do mapa por tabela EasyDental.
- A proxima subetapa recomendada ficou em `EasyDental virgem - Subetapa 8O - complementacao da fonte/mapeamento TAB_PRC antes da correcao`.

## Subetapa 8O da frente EasyDental virgem

- Subetapa executada: complementacao do mapa verificavel de `TAB_PRC_ITEM` na fonte virgem `\\\\Sonyvaio\\c\\EDS70`.
- O arquivo `TAB_PRC_ITEM.raw` foi lido em modo somente leitura e revelou um mapa por tabela agora fechavel por `NROTAB` e `NROPROCTAB`.
- O conjunto nominal de `TAB_PRC` continuou confirmado e as nove tabelas herdadas do EasyDental ficaram assim mapeadas: `Particular`, `Sindicato`, `Bradesco`, `Banco do Brasil`, `Caixa Econ. Federal`, `Banespa`, `Telebrï¿½s`, `Petrobrï¿½s` e `CNCC`.
- As contagens verificadas em `TAB_PRC_ITEM` ficaram fechadas por tabela: `Particular 112`, `Sindicato 238`, `Bradesco 94`, `Banco do Brasil 188`, `Caixa Econ. Federal 88`, `Banespa 32`, `Telebrï¿½s 101`, `Petrobrï¿½s 174` e `CNCC 236`.
- Foi possivel extrair amostras seguras de itens por tabela sem expor dados sensiveis nem valores comerciais reais.
- Nao houve implementacao.
- Nenhuma conta foi criada ou alterada.
- O mapa passou a ser suficiente para a proxima correcao isolada do seed por tabela.
- A proxima subetapa recomendada ficou em `EasyDental virgem - Subetapa 8P - correcao isolada dos seeds por tabela EasyDental`.

## Subetapa 8P da frente EasyDental virgem

- Subetapa executada: correcao isolada dos seeds por tabela EasyDental.
- A falha da 8J foi corrigida para que `Brana` permaneï¿½a com seed proprio e as 9 tabelas herdadas recebam seus itens EasyDental respectivos.
- O mapa 8O foi aplicado: `Particular 112`, `Sindicato 238`, `Bradesco 94`, `Banco do Brasil 188`, `Caixa Econ. Federal 88`, `Banespa 32`, `Telebrï¿½s 101`, `Petrobrï¿½s 174` e `CNCC 236`.
- Os arquivos alterados foram `backend/seeds/procedimentos_padrao.py` e o novo `backend/seeds/procedimentos_easy_tabelas.py`.
- Os checks sintaticos foram executados com sucesso para os arquivos Python alterados.
- O teste manual continua sendo criar nova conta e verificar que as 9 tabelas herdadas nao herdam mais os 336 itens da Brana, mantendo `Tabela Exemplo` fora do nascimento e `Brana` como padrao/privada.
- O erro textual da tela de setup permanece fora do escopo e segue como pendencia separada.
- Nenhuma conta existente foi alterada.
- Nenhuma conta foi criada automaticamente.
- A proxima subetapa recomendada ficou em `EasyDental virgem - Subetapa 8Q - validacao manual da nova conta apos correcao dos seeds`.

## Subetapa 8Q da frente EasyDental virgem

- Subetapa executada: exclusao segura da conta de teste para liberar `institutobrana@gmail.com` e validar a trilha 8J/8K/8P.
- O e-mail alvo foi confirmado no banco como `institutobrana@gmail.com`, mas o ID informado pelo usuario como `17` nao bateu com a leitura; a conta correta confirmada por leitura foi a clï¿½nica `ID 8`.
- O procedimento aprovado encontrado foi o contrato central de exclusao segura com backup/export, dry-run e runner controlado.
- O dry-run foi executado com sucesso antes da exclusao real.
- A exclusao real foi executada uma unica vez com `--execute` e concluiu com sucesso, removendo a clinica `ID 8` e liberando o e-mail.
- A validacao pos-exclusao confirmou que nenhuma outra conta foi afetada.
- Os arquivos alterados foram o novo documento de exclusao segura e este roadmap.
- A prï¿½xima validacao manual recomendada passa a ser criar nova conta com `institutobrana@gmail.com` para conferir 8J/8K/8P.
- Nenhum cï¿½digo foi alterado.
- Nenhuma conta adicional foi criada ou alterada fora da exclusao segura documentada.

## Correï¿½ï¿½o urgente de schema/login - `usuarios.senha_interna_hash`

- Foi diagnosticado erro de login `500` em `POST /login` causado por `psycopg2.errors.UndefinedColumn` na coluna `usuarios.senha_interna_hash`.
- O model de `Usuario` jï¿½ esperava a coluna e o banco real estava sem ela.
- A correï¿½ï¿½o aplicada foi idempotente: o startup HTTP passou a garantir `senha_interna_hash` e o script manual de compatibilidade tambï¿½m foi alinhado.
- As demais colunas conferidas em `usuarios` permaneceram presentes.
- Nï¿½o houve alteraï¿½ï¿½o funcional em `setup`, senha interna, `Opï¿½ï¿½es do Sistema`, frontend, seeds de procedimentos, unidade ou contas existentes.
- O login deve ser validado manualmente apï¿½s reiniciar o backend e, se estiver normal, a prï¿½xima conta limpa pode ser criada com `institutobrana@gmail.com`.
- A prï¿½xima subetapa recomendada passa a ser a validaï¿½ï¿½o manual da nova conta apï¿½s 8J/8K/8P.

## Correï¿½ï¿½o urgente do signup - `PRIVATE_TABLE_NAME` ausente

- O `/signup/confirm` falhou com `NameError: name 'PRIVATE_TABLE_NAME' is not defined` em `backend/seeds/procedimentos_padrao.py`.
- A causa foi uma referï¿½ncia ï¿½ tabela privada `Brana` sem constante definida no escopo do seed.
- A correï¿½ï¿½o aplicada foi mï¿½nima: a constante local `PRIVATE_TABLE_NAME = "Brana"` foi definida no prï¿½prio arquivo do seed.
- A consulta segura ao banco para `institutobrana@gmail.com` nï¿½o encontrou conta parcial em `clinicas` nem em `usuarios`.
- Os seeds da 8P foram preservados.
- Nenhuma conta foi criada automaticamente.
- O teste manual recomendado passa a ser tentar novamente criar uma conta limpa com `institutobrana@gmail.com` e validar 8J/8K/8P.

## Subetapa 8R da frente EasyDental virgem

- Execuï¿½ï¿½o da Subetapa 8R: o signup passou a criar, alï¿½m do prestador sistï¿½mico `Clï¿½nica`, um prestador ADM/Mestre funcional nas novas contas.
- A regra contratual adicionada foi: nome do prestador ADM vem do cadastro da conta, o tipo ï¿½ `Cirurgiï¿½o dentista` e o seed usa `source_id=1` com `codigo=002`.
- O helper de signup foi ajustado de forma idempotente para reaproveitar o prestador ADM quando a conta nova jï¿½ tiver sido parcialmente construï¿½da.
- O prestador `Clï¿½nica` sistï¿½mico foi preservado.
- O usuï¿½rio admin inicial foi vinculado ao prestador ADM funcional.
- Nï¿½o houve alteraï¿½ï¿½o em unidade Principal / 0001, 8P, setup, senha interna, permissï¿½es ou frontend.
- A consulta segura nï¿½o encontrou conta parcial para `institutobrana@gmail.com` na etapa anterior, e a nova implementaï¿½ï¿½o nï¿½o altera contas existentes.
- A prï¿½xima validaï¿½ï¿½o manual recomendada passa a ser abrir nova conta limpa e confirmar que o mï¿½dulo Prestadores exibe `Clï¿½nica` e o prestador ADM com o nome do cadastro.
- Nenhuma conta foi criada automaticamente por esta correï¿½ï¿½o.

## Exclusao segura bloqueada apos 8R

- O e-mail alvo `institutobrana@gmail.com` foi confirmado no banco como clï¿½nica `ID 11`, nao `25`.
- Foram revisados o contrato central de exclusao segura, as trilhas historicas e os documentos de exclusao anteriores.
- O runner seguro existente no repositï¿½rio estï¿½ travado para `clinica_id = 8`, entï¿½o nao havia ferramenta aprovada para executar a exclusao da clï¿½nica 11 sem alterar cï¿½digo.
- Nao houve backup/export, dry-run ou exclusao real nesta etapa, porque a operacao ficou bloqueada por ausencia de runner seguro especï¿½fico para `ID 11`.
- Nenhuma outra conta foi alterada, e 8P/8K/8R foram preservadas.
- A prï¿½xima etapa recomendada passa a ser aprovar ou criar um runner seguro especï¿½fico para a clï¿½nica 11 antes de tentar qualquer exclusao.

## Subetapa 8S da frente EasyDental virgem

- Execuï¿½ï¿½o da Subetapa 8S: foi criado um runner seguro especï¿½fico para a clï¿½nica 11, reaproveitando a trilha de exclusï¿½o segura jï¿½ validada.
- O e-mail alvo `institutobrana@gmail.com` foi confirmado na clï¿½nica 11, e a hipï¿½tese `25` foi descartada como alvo.
- O backup/export somente leitura foi executado com sucesso e gerou o conjunto de arquivos de prï¿½-exclusï¿½o da clï¿½nica 11.
- O dry-run foi executado com sucesso e confirmou alvo ï¿½nico, usuï¿½rios vinculados, prestador, assinatura, `email_codes` e dependï¿½ncias.
- A exclusï¿½o real foi executada uma ï¿½nica vez com `--execute` e concluiu com sucesso.
- A clï¿½nica 11 foi removida e o e-mail foi liberado para nova conta limpa.
- Nenhuma outra conta foi afetada, e 8P/8K/8R foram preservadas.
- Os arquivos alterados foram o novo runner seguro da clï¿½nica 11, o backup/export da clï¿½nica 11, o novo documento da subetapa e este roadmap.
- A prï¿½xima validaï¿½ï¿½o manual recomendada passa a ser criar nova conta com `institutobrana@gmail.com` e validar 8P/8K/8R.
- Nenhuma conta foi criada automaticamente.

## Correï¿½ï¿½o segura da exclusao de usuario no modulo Usuarios

- Foi auditado o fluxo do botao Excluir em `frontend/app.js`, que chama `DELETE /admin/users/{id}` e mostrava o alerta generico `Falha ao excluir usuario.`.
- O diagnostico confirmou que a rota `backend/routes/user_admin_routes.py` fazia `db.delete(usuario)` direto e quebrava quando o usuario ainda estava referenciado por `prestador_odonto.usuario_id`.
- A falha nao era geral para qualquer usuario: usuarios sem dependencia puderam ser excluidos em transacao descartavel, enquanto o usuario `37` da clinica 15 falhava por FK, e o usuario `36` nao falhava.
- A regra de seguranca foi reforcada para bloquear o ultimo admin, preservar a conta base `Clï¿½nica`/system user e manter o bloqueio do proprio usuario logado.
- A correcao aplicada limpa dependencias conhecidas antes do delete: `prestador_odonto.usuario_id`, `usuario_perfil_acesso`, `relatorio_config`, `controle_protetico` e os campos de `tratamento` que apontam para o usuario.
- O frontend nao precisou ser alterado, porque agora a rota deve responder sem 500 nos casos comuns e, se houver dependencias inesperadas, retorna erro controlado.
- Nenhuma conta foi criada ou excluida nesta etapa alem da validacao segura de leitura.
- Os checks incluem py_compile e validacoes seguras em transacao descartavel no banco.
- A validacao manual recomendada e testar exclusao de usuario comum, bloqueio da conta base, bloqueio do proprio usuario e bloqueio do ultimo admin.
- A proxima subetapa recomendada e retomar a validacao da 8W-B apos confirmar a exclusao segura.

## Auditoria de retomada da modularizacao apos correcao de exclusao de usuario

- Auditoria documental executada para confirmar o ponto atual antes de escolher novo recorte de modularizacao.
- O ponto atual permanece dependente da validacao manual da exclusao de usuario no modulo Usuarios e, depois, da retomada da validacao da 8W-B.
- Nao houve nova modularizacao implementada nesta etapa.
- A blindagem textual/mojibake foi respeitada.
- O documento criado foi `docs/fase_2b_auditoria_retomada_modularizacao_pos_correcao_exclusao_usuario.md`.
- A proxima etapa conservadora continua sendo validar exclusao de usuario e retomar a 8W-B antes de considerar novo modulo.

## Fase 2B - Validacao manual aprovada da exclusao de usuario comum

- O usuario informou que testou a exclusao pelo sistema e que deu certo.
- O cenario validado foi a exclusao de usuario comum na tela `Configuracao de usuarios do sistema`.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- Os bloqueios de seguranca da exclusao permanecem como conferencia complementar se ainda nao tiverem sido testados manualmente.
- A proxima etapa recomendada passa a ser retomar a validacao da 8W-B.
- O documento criado foi `docs/fase_2b_validacao_manual_exclusao_usuario_comum_aprovada.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Retomada da validacao 8W-B de usuarios novos

- A exclusao de usuario comum foi validada e a trilha voltou a apontar para a 8W-B.
- Foi criado um checklist de validacao manual para usuarios novos.
- Nenhuma implementacao foi feita nesta etapa.
- Nenhuma nova modularizacao foi iniciada.
- O documento criado foi `docs/fase_2b_retomada_validacao_8w_b_usuarios_novos.md`.
- A blindagem textual/mojibake foi respeitada.
- A proxima acao depende do teste manual da 8W-B.

## Fase 2B - Validacao aprovada da 8W-B de usuarios novos

- A validacao manual da 8W-B foi aprovada pelo usuario.
- Os testes principais foram confirmados como aprovados.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- Nenhuma nova modularizacao foi iniciada nesta etapa.
- A pendencia da 8W-B foi encerrada.
- A proxima etapa recomendada passa a ser a auditoria para retomada da escolha do proximo modulo de modularizacao/refatoracao.
- O documento criado foi `docs/fase_2b_validacao_8w_b_usuarios_novos_aprovada.md`.
- A blindagem textual/mojibake foi respeitada.

## Auditoria para escolha do proximo modulo pos-8W-B

- Auditoria documental executada apos a validacao aprovada da 8W-B.
- A exclusao de usuario comum e a 8W-B permanecem validadas.
- Nenhuma implementacao foi feita nesta etapa.
- Nenhuma nova modularizacao foi iniciada nesta etapa.
- A matriz comparativa de frentes candidatas foi criada.
- A decisao conservadora foi registrada como Opcao A.
- O proximo recorte recomendado e o bloco remanescente de `Preferencias / Configuracoes`.
- O documento criado foi `docs/fase_2b_auditoria_escolha_proximo_modulo_pos_8w_b.md`.
- A blindagem textual/mojibake foi respeitada.

## Contrato de Preferencias / Configuracoes

- Contrato documental aberto para o recorte remanescente de `Preferï¿½ncias / Configuraï¿½ï¿½es`.
- O mï¿½dulo continua classificado como `comum/core`.
- O recorte recomendado ï¿½ a sincronizaï¿½ï¿½o visual bï¿½sica da modal, com tï¿½tulo e alternï¿½ncia de abas.
- Nenhuma implementaï¿½ï¿½o foi feita nesta etapa.
- Implementaï¿½ï¿½o mï¿½nima do recorte contratado concluï¿½da com delegaï¿½ï¿½o visual ao mï¿½dulo passivo.
- Arquivos alterados: `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/fase_2b_preferencias_configuracoes_implementacao_sincronizacao_visual_modal.md`.
- Sem alteraï¿½ï¿½o em carregamento, payload, salvamento, `sysOpt*`, backend, banco, permissï¿½es ou seeds.
- Prï¿½xima etapa recomendada: validaï¿½ï¿½o manual pï¿½s-implementaï¿½ï¿½o.
- A blindagem textual/mojibake foi respeitada.
- Nenhum cï¿½digo foi alterado nesta etapa.
- O documento criado foi `docs/fase_2b_preferencias_configuracoes_contrato_recorte_remanescente.md`.
- A blindagem textual/mojibake foi respeitada.
- A prï¿½xima etapa recomendada, se o contrato continuar seguro, ï¿½ a implementaï¿½ï¿½o mï¿½nima do recorte contratado.

## Validaï¿½ï¿½o manual da sincronizaï¿½ï¿½o visual de Preferencias / Configuracoes

- A validaï¿½ï¿½o manual da sincronizaï¿½ï¿½o visual da modal de `Preferï¿½ncias / Configuraï¿½ï¿½es` foi aprovada.
- Commit validado: `7dae8e3226cd6f4510a0094968d29a2e853b9ddc`.
- Os testes principais foram aprovados: abertura da tela, abertura da modal, alternï¿½ncia de abas, atualizaï¿½ï¿½o do tï¿½tulo, fechamento, reabertura, reabertura sem salvar, ausï¿½ncia de alteraï¿½ï¿½o indevida e checagem rï¿½pida em `Opï¿½ï¿½es do Sistema` sem regressï¿½o visual.
- Nenhuma alteraï¿½ï¿½o de cï¿½digo foi feita nesta etapa.
- O recorte de sincronizaï¿½ï¿½o visual da modal fica consolidado como validado.
- O documento criado foi `docs/fase_2b_preferencias_configuracoes_validacao_sincronizacao_visual_modal.md`.
- A blindagem textual/mojibake foi respeitada.
- A prï¿½xima etapa recomendada ï¿½ uma decisï¿½o conservadora sobre novo recorte de `Preferï¿½ncias / Configuraï¿½ï¿½es` ou nova matriz comparativa.

## Decisao conservadora pos validacao visual de Preferencias / Configuracoes

- A decisao conservadora foi registrada apos a validacao visual.
- O recorte visual anterior permanece validado.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- Caminho escolhido: `Opcao C`.
- A proxima subetapa recomendada e um contrato profundo para um novo recorte visual/DOM em `Preferencias / Configuracoes`.
- O documento criado foi `docs/fase_2b_preferencias_configuracoes_decisao_pos_validacao_visual.md`.
- A blindagem textual/mojibake foi respeitada.

## Contrato profundo de prefRenderCombos em Preferencias / Configuracoes

- O contrato profundo foi aberto para `prefRenderCombos`.
- O modulo continua classificado como `comum/core`.
- Nenhuma implementacao foi feita nesta etapa.
- Nenhum codigo foi alterado nesta etapa.
- A decisao do contrato foi registrada como `Opcao C`.
- A proxima subetapa recomendada e a implementacao minima futura do recorte visual dos combos gerais.
- O documento criado foi `docs/fase_2b_preferencias_configuracoes_contrato_profundo_pref_render_combos.md`.
- A blindagem textual/mojibake foi respeitada.

## Implementacao minima de prefRenderCombos em Preferencias / Configuracoes

- A implementacao minima de `prefRenderCombos` foi concluida.
- A renderizacao visual dos combos gerais foi delegada ao modulo existente.
- `prefRenderCombos` permaneceu como orquestrador.
- O fallback local foi preservado.
- Nenhuma alteracao de carregamento, payload, salvamento, `sysOpt*`, backend, banco, permissï¿½es ou seeds foi feita.
- O documento criado foi `docs/fase_2b_preferencias_configuracoes_implementacao_pref_render_combos.md`.
- A blindagem textual/mojibake foi respeitada.
- A proxima etapa recomendada e validacao manual.

## Validacao manual de prefRenderCombos em Preferencias / Configuracoes

- A validacao manual de `prefRenderCombos` foi aprovada.
- Commit validado: `0795fe4a03806f95225128472db043eced335eaf`.
- Os testes principais foram aprovados: abertura da tela, abertura da modal, conferencia e renderizacao dos combos gerais, alternancia de abas, fechamento e reabertura, reabertura sem salvar e checagem rapida em `Opcoes do Sistema` sem regressao visual.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- O recorte de `prefRenderCombos` fica consolidado como validado.
- O documento criado foi `docs/fase_2b_preferencias_configuracoes_validacao_pref_render_combos.md`.
- A blindagem textual/mojibake foi respeitada.
- A proxima etapa recomendada e uma decisao conservadora sobre novo recorte de `Preferencias` ou nova matriz comparativa.

## Decisao conservadora pos validacao de prefRenderCombos em Preferencias / Configuracoes

- A decisao conservadora foi registrada apos a validacao de `prefRenderCombos`.
- Os recortes anteriores de `Preferencias` permanecem validados.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- Caminho escolhido: `Opcao C`.
- A proxima subetapa recomendada e um contrato profundo para `prefRenderCombosModelos`.
- O documento criado foi `docs/fase_2b_preferencias_configuracoes_decisao_pos_validacao_pref_render_combos.md`.
- A blindagem textual/mojibake foi respeitada.

## Contrato profundo de prefRenderCombosModelos em Preferencias / Configuracoes

- O contrato profundo foi aberto para `prefRenderCombosModelos`.
- O modulo continua classificado como `comum/core`.
- Nenhuma implementacao foi feita nesta etapa.
- Nenhum codigo foi alterado nesta etapa.
- A decisao do contrato foi registrada como `Opcao C`.
- A proxima subetapa recomendada e a implementacao minima futura do recorte visual dos combos de modelos.
- O documento criado foi `docs/fase_2b_preferencias_configuracoes_contrato_profundo_pref_render_combos_modelos.md`.
- A blindagem textual/mojibake foi respeitada.

## Implementacao minima de prefRenderCombosModelos em Preferencias / Configuracoes

- A implementacao minima de `prefRenderCombosModelos` foi concluida.
- A renderizacao visual dos combos de modelos foi delegada ao modulo existente.
- `prefRenderCombosModelos` permaneceu como orquestrador.
- O fallback local foi preservado.
- Nenhuma alteracao de carregamento, payload, salvamento, `sysOpt*`, backend, banco, permissoes ou seeds foi feita.
- Arquivos alterados: `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/fase_2b_preferencias_configuracoes_implementacao_pref_render_combos_modelos.md` e `docs/11_roadmap_desenvolvimento.md`.
- A proxima etapa recomendada e validacao manual.
- A blindagem textual/mojibake foi respeitada.

## Pausa temporaria da modularizacao por suspeita de regressao

- A modularizacao foi pausada temporariamente por suspeita de regressao apos `prefRenderCombosModelos`.
- O usuario relatou ausencia de uma conta relacionada a `Paulo Gustavo` e de um usuario de outra conta.
- Uma auditoria somente leitura foi executada.
- Checkpoint usado: `5e6dd08a3d5e2bdce6d5c04b8c292e0bcea9d271`.
- Commit atual comparado: `bcf7e2c84274c130ce47cb63c3535eb1dc2cfb62`.
- A classificacao final registrada foi `Opcao B`.
- A proxima etapa recomendada e auditoria forense de exclusao/logs com identificadores mais precisos.
- O documento criado foi `docs/auditoria_regressao_pos_pref_render_combos_modelos_conta_usuario_sumidos.md`.
- A blindagem textual/mojibake foi respeitada.

## Auditoria forense de conta ausente e usuario Wilker

- A pausa da modularizacao continua valendo enquanto a auditoria forense nao encerra.
- O usuario relatou ausencia de uma conta/clinica e do usuario `Wilker`.
- Uma auditoria somente leitura foi executada.
- A conta/clinica identificada foi `clinica_id = 3`, nome `Wilker`, com exclusao definitiva registrada.
- A autoria foi identificada na tabela de auditoria.
- A modularizacao recente em `Preferencias / Configuracoes` nao mostrou relacao causal.
- A classificacao final registrada foi `Opcao C` para `Wilker`, `Opcao E` para a conta/clinica identificada e `Opcao H` para regressao ligada as modularizacoes recentes.
- O documento criado foi `docs/auditoria_forense_exclusao_conta_usuario_wilker.md`.
- A proxima etapa recomendada e validar o historico da exclusao ou pedir identificador da eventual segunda conta ausente.
- A blindagem textual/mojibake foi respeitada.

## Nova auditoria forense com alvo corrigido de Wilker e conta de 27/05/2026

- A modularizacao segue pausada durante a auditoria forense.
- O alvo correto passou a ser `Wilker@digitalprodutora.com.br`, vinculado ao ADM da clinica `ID 17`.
- Tambem foi investigada a conta/clinica criada em `27/05/2026`.
- A auditoria somente leitura foi executada.
- A clinica `ID 17` encontrada no banco atual e `Tel / institutobrana@gmail.com`, sem relacao com o alvo correto.
- Nao foi encontrada conta criada em `27/05/2026` no conjunto consultado.
- A classificacao registrada foi `W-D`, `C17-A`, `D27-D` e `R-C`.
- Nao foi possivel identificar autoria para os alvos corretos nesta trilha.
- A proxima etapa recomendada e obter identificadores adicionais da conta ou do usuario ausente.
- O documento criado foi `docs/auditoria_forense_wilker_digitalprodutora_clinica_17_conta_2026_05_27.md`.
- A blindagem textual/mojibake foi respeitada.

## Auditoria tecnica de banco apos reinicio do Unicorn

- A auditoria tecnica foi executada em leitura para verificar possivel banco incorreto, restore ou perda de persistencia apos reinicio do Unicorn.
- O banco configurado pela aplicacao continua sendo `brana_saas` via `backend/.env`.
- Um banco alternativo `brana_saas_test` existe no mesmo servidor, mas nao contem os dados ausentes.
- `Wilker@digitalprodutora.com.br`, a conta de `27/05/2026` e o banco alternativo nao trouxeram o alvo correto.
- A configuracao `ativar_controle_usuarios` permaneceu persistida como `true` nas clinicas consultadas.
- A classificacao final ficou em `BD-A` e `BD-G`.
- Nao houve evidencia de troca/rollback.
- O documento criado foi `docs/auditoria_banco_pos_reinicio_unicorn_dados_nao_persistidos.md`.
- A proxima etapa recomendada e continuar a auditoria forense de exclusao/logs com identificadores mais precisos.
- A blindagem textual/mojibake foi respeitada.

## Auditoria de fluxos de persistencia de usuario, signup e opcoes do sistema

- A auditoria somente leitura dos fluxos de persistencia foi executada.
- Foram mapeados os fluxos de criacao de usuario, signup/criacao de conta e salvamento de `clinicas.opcoes_sistema_json`.
- Nenhum codigo foi alterado e nenhum dado de banco foi modificado.
- Os principais riscos identificados foram `P1` a `P7`, com destaque para possivel sobrescrita de `opcoes_sistema_json` por estado local antigo e ausencia de logs persistidos suficientes.
- O plano de teste controlado futuro foi preparado, mas nao executado.
- A proxima etapa recomendada e executar o teste controlado somente com autorizacao futura.
- O documento criado foi `docs/auditoria_fluxos_persistencia_usuario_signup_opcoes.md`.
- A blindagem textual/mojibake foi respeitada.

## Validacao da conta teste ID 18

- A conta teste `ID 18` foi criada manualmente pelo usuario e validada por SELECT no banco atual `brana_saas`.
- A conta nasceu com estrutura inicial esperada, incluindo usuario ADM, usuario sistemico, prestadores, unidade principal e perfis reservados.
- Nenhum codigo foi alterado e nenhum dado de banco foi modificado pelo Codex.
- A proxima etapa recomendada e o teste controlado de usuario comum na conta `ID 18` e o teste controlado de `opcoes_sistema_json`.
- O documento criado foi `docs/validacao_conta_teste_id18_persistencia_signup.md`.
- A blindagem textual/mojibake foi respeitada.

## Validacao de persistencia de usuarios nas clinicas 17 e 18

- A validacao controlada foi executada por SELECT para as clinicas `17` e `18`.
- Os usuarios de teste `mileneflor99@gmail.com` e `mileneflor17@gmail.com` foram confirmados no `brana_saas`.
- A classificacao final ficou em `PERSIST-USERS-A` e `PERSIST-OPCOES-OK-INFORMADO`.
- Nenhum codigo foi alterado e nenhum dado foi alterado diretamente pelo Codex.
- A proxima etapa recomendada e, se desejado, validar persistencia apos recarga/reinicio autorizado do Uvicorn.
- O documento criado foi `docs/validacao_persistencia_usuarios_c17_c18.md`.
- A blindagem textual/mojibake foi respeitada.








## Auditoria de alternancia de banco apos reinicio com Paulo ID 13 e sumico das contas 17/18

- Auditoria somente leitura concluida apos o reinicio do PC e da nova subida do Uvicorn.
- O backend ativo segue apontando para `brana_saas` em `8000`.
- A conta `Paulo Gustavo` `ID 13` voltou a aparecer no banco ativo.
- As contas recentes `ID 17` e `ID 18` nao aparecem no banco ativo atual.
- Os usuarios de teste `mileneflor17@gmail.com` e `mileneflor99@gmail.com` nao foram encontrados no banco ativo atual.
- Nenhum codigo foi alterado e nenhum dado de banco foi modificado.
- O banco alternativo `saas_local` existe, mas tambem nao explica o retorno de `Paulo Gustavo` nem contem `17/18`.
- Classificacao registrada: `ALT-D` e `ALT-E`.
- Proxima etapa recomendada: parar o uso operacional, oficializar o banco correto e preparar backup/analise de restauracao ou unificacao.
- O documento criado foi `docs/auditoria_alternancia_banco_pos_reinicio_paulo_id13_sumico_id17_id18.md`.
- A blindagem textual/mojibake foi respeitada.

## Auditoria da origem do estado do PostgreSQL 18 apos sumico de ID 17/18

- A auditoria somente leitura aprofundou a origem do estado atual do `brana_saas` no PostgreSQL 18.
- Foi confirmada a contradicao entre documentos anteriores e o banco atual: `ID 17/18` e `usuarios 44/45` foram documentados antes e nao aparecem agora.
- Foram encontrados artefatos antigos de backup/restore e dumps com nomes ligados a `pg17` e `pg18`, mas sem prova direta de restore do estado atual.
- Nenhum codigo foi alterado e nenhum dado de banco foi modificado.
- Classificacao registrada: `REST-B`, `REST-D`, `REST-E` e `USO-PAUSAR`.
- A proxima etapa recomendada e manter o uso operacional pausado, definir o banco correto e planejar backup/recuperacao antes de qualquer nova acao.
- O documento criado foi `docs/auditoria_origem_estado_banco_postgres18_sumico_id17_id18.md`.
- A blindagem textual/mojibake foi respeitada.

## Auditoria de bancos PostgreSQL existentes e banco ativo do Brana Cloud

- A auditoria somente leitura confirmou os bancos locais `brana_saas`, `saas_local` e `postgres`.
- O backend/Uvicorn usa `brana_saas` na configuracao atual.
- `brana_saas` e o banco oficial aparente agora, enquanto `saas_local` e um banco separado/antigo.
- Nao ha evidencia de mais de uma instancia PostgreSQL ativa ao mesmo tempo.
- Nenhum codigo foi alterado e nenhum dado de banco foi modificado.
- A proxima etapa recomendada e, se `brana_saas` for o oficial, documentar essa decisao e manter o estado atual.
- O documento criado foi `docs/auditoria_bancos_postgresql_existentes.md`.
- A blindagem textual/mojibake foi respeitada.

## Decisao de manter o banco atual

- O usuario decidiu manter `brana_saas` como banco oficial do projeto.
- `saas_local` foi tratado como banco separado e antigo, nao oficial.
- As contas `ID 17/18` e os usuarios `44/45` nao serao recuperados nesta etapa.
- Nenhum codigo foi alterado e nenhum dado de banco foi modificado.
- O documento criado foi `docs/decisao_estado_oficial_banco_atual_sem_recuperar_id17_id18.md`.
- A proxima etapa recomendada e abrir uma auditoria curta de retomada pos-decisao antes de continuar a modularizacao.
- A blindagem textual/mojibake foi respeitada.

## Teste de estabilidade antes do reinicio

- O estado-base do banco oficial `brana_saas` foi registrado antes do reinicio do PC/Uvicorn.
- `Paulo Gustavo ID 13` segue presente e `ID 17/18` continuam ausentes.
- `max(clinicas.id)` permanece em `15` e `max(usuarios.id)` permanece em `36`.
- Nenhum codigo foi alterado e nenhum dado de banco foi modificado.
- O documento criado foi `docs/teste_estabilidade_banco_pre_reinicio_estado_base.md`.
- A proxima etapa recomendada e o usuario reiniciar manualmente o PC/Uvicorn e depois executar a auditoria pos-reinicio.
- A blindagem textual/mojibake foi respeitada.

## Auditoria pos-reinicio com reaparecimento de ID 17/18

- A auditoria urgente capturou o estado vivo apos o reinicio, antes de qualquer novo reinicio.
- `ID 17` e `ID 18` reapareceram visualmente e `ID 15` sumiu visualmente.
- O backend continua apontando para `brana_saas`, mas agora em PostgreSQL 17 com `data_directory` em `C:/Program Files/PostgreSQL/17/data`.
- O estado mudou em relacao ao estado-base, com `ID 13` ausente e `ID 17/18` presentes.
- Nenhum codigo foi alterado e nenhum dado de banco foi modificado.
- O documento criado foi `docs/auditoria_estado_pos_reinicio_id17_id18_reapareceram.md`.
- A proxima etapa recomendada e nao reiniciar novamente atï¿½ entender a troca de cluster/instancia.
- A blindagem textual/mojibake foi respeitada.

## Decisao de oficializar o PostgreSQL 17

- O usuï¿½rio definiu o PostgreSQL 17 como cluster oficial.
- O banco `brana_saas` do PostgreSQL 17 passa a ser o banco oficial.
- A conta `Paulo Gustavo ID 13` do PostgreSQL 18 fica preservada para migraï¿½ï¿½o futura.
- O cluster 18 nao sera excluido nesta etapa e permanece preservado temporariamente.
- Nenhum codigo foi alterado e nenhum dado de banco foi modificado.
- O documento criado foi `docs/decisao_cluster17_oficial_migrar_conta13_cluster18.md`.
- As proximas subetapas registradas sao backup, inventario, dry-run, migracao, estabilizacao e possivel desativacao/exclusao futura do cluster 18.
- A blindagem textual/mojibake foi respeitada.

## Backup dos clusters PostgreSQL 17 e 18

- O backup logico dos dois clusters foi executado antes da migracao da conta `ID 13`.
- O PostgreSQL 17 oficial foi preservado e validado com dump custom e schema textual.
- O PostgreSQL 18 foi acessado de forma temporaria apenas para gerar o backup da conta `Paulo Gustavo ID 13`.
- Nenhum restore, migracao ou exclusao foi executado.
- Os arquivos de backup foram gerados localmente e nao foram versionados.
- O documento criado foi `docs/backup_clusters_pg17_pg18_pre_migracao_conta13.md`.
- A proxima etapa recomendada e a Subetapa B: inventario da conta `Paulo Gustavo ID 13` no cluster 18, sem migrar ainda.
- A blindagem textual/mojibake foi respeitada.

## Inventario da conta Paulo Gustavo ID 13 no cluster 18

- O inventario somente leitura da conta `Paulo Gustavo ID 13` no PostgreSQL 18 foi concluido.
- Foram mapeadas `49` tabelas com `clinica_id` e os registros principais da conta 13.
- Nao foram encontrados conflitos diretos da conta 13 no PostgreSQL 17 oficial para os IDs principais verificados.
- A estrategia preliminar ficou como `MIG-A` com cautela para dependencias futuras.
- Nenhuma migracao, restore ou exclusao foi executada.
- O documento criado foi `docs/inventario_conta13_cluster18_pre_migracao.md`.
- A proxima etapa recomendada e a Subetapa C: plano de migracao dry-run sem execucao.
- A blindagem textual/mojibake foi respeitada.

## Plano dry-run da migracao da conta 13

- O plano dry-run da migracao da conta `Paulo Gustavo ID 13` foi preparado sem execucao.
- A estrategia manteve `MIG-A`, com preservacao do `clinica_id = 13` no cluster 17 oficial.
- Um arquivo SQL de pre-visualizacao foi criado apenas como referencia tecnica e nao foi executado.
- Nenhum dado foi alterado, nenhuma migracao foi executada e nenhum restore foi feito.
- O documento criado foi `docs/plano_dry_run_migracao_conta13_pg18_para_pg17.md`.
- A proxima etapa depende de aprovacao explicita do usuario para a Subetapa D.
- A blindagem textual/mojibake foi respeitada.

## Migracao real da conta 13 concluida

- A migracao real da conta `Paulo Gustavo ID 13` do PostgreSQL 18 para o PostgreSQL 17 foi executada com sucesso dentro de transacao.
- A estrategia `MIG-A` foi mantida, preservando `clinica_id = 13` e os vinculos diretos da conta.
- Foi identificada durante a execucao uma dependencia externa adicional, `material` com `lista_id = 30`, e ela tambem foi migrada.
- As tabelas principais da conta foram migradas e validadas no PostgreSQL 17 oficial.
- `ID 17/18` e `usuarios 44/45` permaneceram presentes no cluster 17.
- Nenhum restore, exclusao de cluster ou alteracao de codigo ocorreu.
- O PostgreSQL 18 temporario foi parado ao final da etapa.
- O documento criado foi `docs/migracao_conta13_pg18_para_pg17_executada.md`.
- O registro SQL local foi `docs/migracao_executada_conta13_pg18_para_pg17.sql`.
- A proxima etapa recomendada agora e a validacao manual do sistema pelo usuario.
- A blindagem textual/mojibake foi respeitada.

## Validacao manual pos-migracao da conta 13

- A validacao manual administrativa da conta `Paulo Gustavo ID 13` foi aprovada pelo painel de Super ADM.
- O usuario informou que a conta apareceu no sistema, mas nao testou o login direto do usuario final por falta de senha.
- Nenhum codigo foi alterado e nenhum dado de banco foi modificado.
- A proxima etapa recomendada e estabilizar o PostgreSQL 17 como cluster oficial e avaliar a desativacao controlada do PostgreSQL 18 em etapa futura, apos nova autorizacao.
- O documento criado foi `docs/validacao_manual_pos_migracao_conta13_superadmin.md`.
- A blindagem textual/mojibake foi respeitada.

## Estabilizacao do PostgreSQL 17 como cluster oficial

- O PostgreSQL 17 permaneceu ativo como cluster oficial na porta `5432`.
- O PostgreSQL 18 permaneceu parado e nao assumiu a porta oficial na validacao final.
- A conta `ID 13` e as contas `ID 17/18` continuam presentes no cluster 17.
- A tentativa de alterar o startup type do PostgreSQL 18 para impedir inicializacao automatica foi bloqueada por permissao do Windows nesta sessao.
- Nenhum codigo foi alterado e nenhum dado de banco foi modificado.
- A proxima etapa recomendada e um teste pos-reinicio do PC/Uvicorn para confirmar estabilidade.
- O documento criado foi `docs/estabilizacao_postgresql17_cluster_oficial.md`.
- A blindagem textual/mojibake foi respeitada.

## Validacao pos-reinicio do PostgreSQL 17

- O usuario informou que reiniciou o sistema e todas as contas apareceram.
- O PostgreSQL 17 permaneceu oficial e ativo em `5432` apos o reinicio.
- O PostgreSQL 18 permaneceu parado e nao assumiu a porta oficial.
- As contas `13`, `17` e `18` e os usuarios `30/31/44/45` foram confirmados por `SELECT`.
- A conclusao final ficou em `ESTABILIDADE-A`.
- Nenhum codigo foi alterado e nenhum dado de banco foi modificado.
- O documento criado foi `docs/validacao_pos_reinicio_postgresql17_estavel.md`.
- A proxima etapa recomendada e decidir, em etapa futura, se o PostgreSQL 18 deve permanecer parado/manual ou se havera desativacao/exclusao controlada antes de retomar a modularizacao.
- A blindagem textual/mojibake foi respeitada.

## Auditoria de retomada pos-estabilizacao do PostgreSQL 17

- A crise de banco foi encerrada operacionalmente e o PostgreSQL 17 permaneceu como ambiente oficial estavel.
- O ultimo ponto seguro da modularizacao foi identificado como `prefRenderCombosModelos`, mas a validacao manual desse recorte ficou pendente antes da pausa.
- A classificacao de retomada ficou em `RET-B`.
- A proxima etapa recomendada e validar manualmente `prefRenderCombosModelos` antes de abrir novo recorte.
- Nenhum codigo foi alterado e nenhum dado de banco foi modificado.
- O documento criado foi `docs/auditoria_retomada_pos_estabilizacao_postgresql17.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Validacao manual de prefRenderCombosModelos

- A validacao manual de `prefRenderCombosModelos` foi concluida pelo usuario e passou / esta ok.
- O recorte visual/DOM de `Preferencias / Configuracoes` ficou consolidado como validado.
- `prefRenderCombos` e `prefRenderCombosModelos` permanecem validados de forma conservadora.
- Nenhum codigo foi alterado nesta etapa e nenhum dado de banco foi modificado.
- A crise de banco/cluster segue estabilizada com PostgreSQL 17 oficial.
- A proxima etapa recomendada passa a ser uma decisao conservadora sobre novo recorte ou retorno a matriz comparativa antes de ampliar a modularizacao.
- O documento criado foi `docs/fase_2b_preferencias_configuracoes_validacao_pref_render_combos_modelos.md`.
- A blindagem textual/mojibake foi respeitada.

## Decisao conservadora apos validacao de prefRenderCombosModelos

- A decisao conservadora apos a validacao de `prefRenderCombosModelos` foi registrada como `DEC-C`.
- `Preferencias / Configuracoes` permanece consolidada como frente estavel e candidata.
- `prefRenderCombos` e `prefRenderCombosModelos` ficam validados de forma conservadora.
- Nenhum codigo foi alterado e nenhum dado de banco foi modificado nesta etapa.
- A proxima etapa recomendada e abrir contrato profundo antes de qualquer novo recorte; se o proximo recorte parecer arriscado, reavaliar matriz comparativa antes de implementar qualquer coisa.
- O documento criado foi `docs/fase_2b_preferencias_configuracoes_decisao_pos_validacao_pref_render_combos_modelos.md`.
- A blindagem textual/mojibake foi respeitada.

## Contrato profundo apos prefRenderCombosModelos

- O contrato profundo apos `prefRenderCombosModelos` foi aberto sem implementacao de codigo.
- O bloco remanescente de `Preferencias / Configuracoes` foi mapeado.
- Os candidatos avaliados foram registrados com risco, beneficio e decisao.
- A decisao do contrato foi `CONTRATO-A`.
- O recorte recomendado para futura implementacao e `prefRenderCombosDados`.
- Nenhum codigo foi alterado e nenhum dado de banco foi modificado nesta etapa.
- A proxima etapa recomendada e seguir o contrato pequeno recomendado, mantendo as fronteiras proibidas fora do escopo.
- O documento criado foi `docs/fase_2b_preferencias_configuracoes_contrato_profundo_pos_pref_render_combos_modelos.md`.
- A blindagem textual/mojibake foi respeitada.

## Implementacao minima de prefRenderCombosDados

- A implementacao minima de `prefRenderCombosDados` foi concluida.
- O helper passivo foi criado no modulo existente e a delegacao minima em `frontend/app.js` foi preservada.
- O recorte ficou restrito ao select de UF da aba `Dados`.
- O fallback local equivalente foi preservado.
- Nenhum backend, banco, payload, salvamento ou `sysOpt*` foi alterado nesta etapa.
- Os checks tecnicos foram executados com sucesso.
- A proxima etapa recomendada e validacao manual pos-implementacao.
- O documento criado foi `docs/fase_2b_preferencias_configuracoes_implementacao_pref_render_combos_dados.md`.
- A blindagem textual/mojibake foi respeitada.

## Validacao manual de prefRenderCombosDados

- A validacao manual de `prefRenderCombosDados` foi aprovada.
- O recorte visual/DOM do select de UF da aba `Dados` ficou consolidado como validado.
- `Preferencias / Configuracoes` segue estavel.
- Nenhum codigo foi alterado e nenhum dado de banco foi modificado nesta etapa.
- A proxima etapa recomendada e uma decisao conservadora antes de qualquer novo recorte.
- O documento criado foi `docs/fase_2b_preferencias_configuracoes_validacao_pref_render_combos_dados.md`.
- A blindagem textual/mojibake foi respeitada.

## Decisao pos-validacao de prefRenderCombosDados

- A decisao conservadora apos a validacao de `prefRenderCombosDados` foi registrada como `DEC-C`.
- `Preferencias / Configuracoes` permanece consolidada como frente estavel.
- `prefRenderCombos`, `prefRenderCombosModelos` e `prefRenderCombosDados` continuam validados de forma conservadora.
- Nenhum codigo foi alterado e nenhum dado de banco foi modificado nesta etapa.
- A proxima etapa recomendada e voltar para a matriz comparativa do proximo modulo ou frente candidata antes de qualquer novo avanco em `Preferencias / Configuracoes`.
- O documento criado foi `docs/fase_2b_preferencias_configuracoes_decisao_pos_validacao_pref_render_combos_dados.md`.
- A blindagem textual/mojibake foi respeitada.

## Matriz comparativa pos-Preferencias / Configuracoes

- A matriz comparativa apos a consolidacao de `Preferencias / Configuracoes` foi executada sem alterar codigo ou banco.
- As frentes comparadas foram registradas com classificacao multiarea, risco, beneficio, facilidade de teste e recomendacao.
- A decisao da matriz foi `MATRIZ-B`.
- A proxima frente recomendada e `Prestadores remanescentes`.
- O recorte inicial sugerido e um contrato profundo muito pequeno, primeiro sobre a parte restante de lista/selecao/acoes, sem tocar em `requestJson`, payload, agenda, convenios, comissoes ou mutacao funcional.
- O documento criado foi `docs/fase_2b_matriz_comparativa_pos_preferencias_configuracoes.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Prestadores remanescentes - Contrato profundo do recorte remanescente

- O contrato profundo de `Prestadores remanescentes` foi criado como etapa exclusivamente documental.
- O estado atual de `Prestadores` foi reavaliado com foco em `frontend/app.js` e no modulo passivo `frontend/js/modules/prestadores.js`.
- A matriz de risco separou lista/render, selecao e shell visual das areas sensiveis de `requestJson`, payload, salvamento, agenda, convenios, comissoes, permissao, backend e banco.
- A decisao registrada foi `PREST-CONTRATO-A`.
- O recorte recomendado e o contrato minimo de lista e selecao visual.
- Nenhum codigo foi alterado e nenhum dado de banco foi modificado nesta etapa.
- A proxima etapa recomendada e manter esse recorte como base para eventual implementacao minima futura, sem abrir os fluxos de negocio sensiveis.
- O documento criado foi `docs/fase_2b_prestadores_contrato_profundo_recorte_remanescente.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Prestadores remanescentes - Implementacao minima da lista e selecao visual

- A implementacao minima de `Prestadores` foi concluida para lista e selecao visual.
- `frontend/app.js` permaneceu como orquestrador, com delegacao visual minima para o modulo passivo `frontend/js/modules/prestadores.js`.
- O helper `prestRenderLista` foi mantido como alvo da renderizacao visual da lista e `prestSelecionarLinhaVisual` foi adicionado para a selecao visual.
- O fallback local foi preservado.
- Nao houve alteracao de `prestCarregar`, `requestJson`, payload, salvamento, `prestAcoesPlaceholder`, Agenda, Convenios, Comissoes, permissï¿½es, backend ou banco.
- Os checks tecnicos foram executados com sucesso.
- A proxima etapa recomendada e validacao manual pos-implementacao do recorte de lista e selecao visual.
- O documento criado foi `docs/fase_2b_prestadores_implementacao_lista_selecao_visual.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Prestadores remanescentes - Validacao manual da lista e selecao visual

- A validacao manual de `Prestadores` lista e selecao visual foi aprovada pelo usuario.
- O recorte visual foi consolidado como validado.
- O helper `prestSelecionarLinhaVisual` ficou validado como parte do contrato.
- Nenhum codigo foi alterado nesta etapa e nenhum dado de banco foi modificado.
- A proxima etapa recomendada e uma decisao conservadora antes de qualquer novo recorte em `Prestadores`.
- O documento criado foi `docs/fase_2b_prestadores_validacao_lista_selecao_visual.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Prestadores remanescentes - Decisao pos-validacao da lista e selecao visual

- A frente `Prestadores` ficou consolidada como parcialmente validada apos a lista e selecao visual.
- Os candidatos restantes foram reavaliados e separados entre apoio visual, filtros locais, shell e areas sensiveis.
- A decisao conservadora registrada foi `PREST-DEC-C`.
- A proxima etapa recomendada e exigir nova auditoria/contrato profundo antes de qualquer novo avanco em `Prestadores`.
- Nenhum codigo foi alterado nesta etapa e nenhum dado de banco foi modificado.
- O documento criado foi `docs/fase_2b_prestadores_decisao_pos_validacao_lista_selecao_visual.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Matriz curta apos Prestadores lista e selecao visual

- A matriz curta pos-`Prestadores` foi registrada em risco medio controlado.
- `Prestadores` ficou consolidado como parcialmente validado e sem novo recorte automatico.
- Os candidatos comparados incluï¿½ram `Prestadores`, `Cadastros auxiliares`, `Etiquetas`, `Convenios e Planos`, `Plano de contas`, `Medicamentos`, `Conta corrente`, `Preferencias / Configuracoes`, `Usuarios/Admin` e `Relatorios` / `Agenda principal`.
- A decisao registrada foi `MATRIZ-POS-PREST-C`.
- A proxima frente recomendada e `Convenios e Planos`.
- O recorte inicial sugerido e um contrato profundo do bloco restante de lista/shell/selecao visual, sem tocar em `requestJson`, payload, salvamento, exclusao, agenda/faturamento/calendario, backend, banco ou permissï¿½es.
- Nenhum codigo foi alterado nesta etapa e nenhum dado de banco foi modificado.
- O documento criado foi `docs/fase_2b_matriz_curta_pos_prestadores_lista_selecao.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Convï¿½nios e Planos - Contrato profundo do recorte inicial

- O contrato profundo de `Convï¿½nios e Planos` foi aberto como etapa exclusivamente documental.
- O bloco atual foi mapeado em `frontend/app.js`, com funï¿½ï¿½es de lista, seleï¿½ï¿½o, shell, carregamento, wiring e calendï¿½rio/faturamento.
- O mï¿½dulo passivo [`frontend/js/modules/convenios-planos.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\convenios-planos.js) foi identificado com helpers puros de normalizaï¿½ï¿½o, validaï¿½ï¿½o e montagem de linhas.
- A matriz de risco separou lista/render, seleï¿½ï¿½o, filtros, shell e modais visuais das ï¿½reas sensï¿½veis de payload, salvamento, exclusï¿½o, calendï¿½rio/faturamento, permissï¿½es, backend e banco.
- A decisï¿½o registrada foi `CONVPLAN-CONTRATO-B`.
- O recorte recomendado ï¿½ o contrato visual mï¿½nimo de lista e seleï¿½ï¿½o, com contrato ainda mais especï¿½fico antes de qualquer implementaï¿½ï¿½o.
- Nenhum cï¿½digo foi alterado e nenhum dado de banco foi modificado nesta etapa.
- A prï¿½xima etapa recomendada ï¿½ manter esse contrato como base e nï¿½o avanï¿½ar automaticamente para requestJson, payload, salvamento ou calendï¿½rio.
- O documento criado foi `docs/fase_2b_convenios_planos_contrato_profundo_recorte_inicial.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Convï¿½nios e Planos - Contrato especï¿½fico de lista e seleï¿½ï¿½o visual

- O contrato especï¿½fico de `Convï¿½nios e Planos` reduziu o recorte ao menor nï¿½cleo seguro.
- O mapeamento tï¿½cnico confirmou o bloco principal em `frontend/app.js` e o mï¿½dulo passivo [`frontend/js/modules/convenios-planos.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\convenios-planos.js).
- Os sub-recortes foram comparados e a decisï¿½o especï¿½fica foi `CONVPLAN-ESPEC-A`.
- O recorte futuro permitido ficou restrito apenas ï¿½ renderizaï¿½ï¿½o visual das listas.
- Seleï¿½ï¿½o, shell, wiring, requestJson, payload, salvamento, exclusï¿½o e calendï¿½rio/faturamento ficaram fora do recorte imediato.
- Nenhum cï¿½digo foi alterado nesta etapa e nenhum dado de banco foi modificado.
- O documento criado foi `docs/fase_2b_convenios_planos_contrato_especifico_lista_selecao.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Convï¿½nios e Planos - Microcontrato de renderizaï¿½ï¿½o de listas

- O microcontrato de `Convï¿½nios e Planos` fechou o recorte futuro mï¿½nimo para a renderizaï¿½ï¿½o visual das listas.
- O mapeamento tï¿½cnico confirmou que `convPlanRenderConvenios` e `convPlanRenderPlanos` sï¿½o simï¿½tricas e podem avanï¿½ar juntas com helpers passivos equivalentes.
- Os micro-recortes avaliados foram `MICRO 1`, `MICRO 2`, `MICRO 3` e `MICRO 4`.
- A decisï¿½o registrada foi `CONVPLAN-MICRO-C`.
- A fronteira futura permitida ficou restrita a `convPlanRenderConvenios`, `convPlanRenderPlanos`, `montarLinhasConvenios` e `montarLinhasPlanos`.
- Seleï¿½ï¿½o, shell, wiring, `requestJson`, payload, salvamento, exclusï¿½o, calendï¿½rio/faturamento, backend, banco e permissï¿½es ficaram fora do recorte imediato.
- Nenhum cï¿½digo foi alterado nesta etapa e nenhum dado de banco foi modificado.
- O documento criado foi `docs/fase_2b_convenios_planos_microcontrato_render_listas.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Convï¿½nios e Planos - Implementaï¿½ï¿½o mï¿½nima da renderizaï¿½ï¿½o de listas

- A renderizaï¿½ï¿½o visual das listas de `Convï¿½nios e Planos` foi implementada com o menor diff seguro.
- `convPlanRenderConvenios` e `convPlanRenderPlanos` permaneceram como orquestradores em `frontend/app.js`.
- Os helpers passivos `montarLinhasConvenios` e `montarLinhasPlanos` foram reutilizados quando disponï¿½veis, com fallback local preservado.
- O cï¿½digo alterado ficou restrito a `frontend/app.js`; o mï¿½dulo passivo `frontend/js/modules/convenios-planos.js` permaneceu sem alteraï¿½ï¿½es.
- Nenhum fluxo de seleï¿½ï¿½o, shell, eventos, `requestJson`, payload, salvamento, exclusï¿½o, calendï¿½rio/faturamento, backend ou banco foi alterado.
- Os checks tï¿½cnicos foram executados com sucesso.
- O documento criado foi `docs/fase_2b_convenios_planos_implementacao_render_listas.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Convï¿½nios e Planos - Validaï¿½ï¿½o manual da renderizaï¿½ï¿½o de listas

- A validaï¿½ï¿½o manual da renderizaï¿½ï¿½o visual das listas de `Convï¿½nios e Planos` foi aprovada pelo usuï¿½rio.
- O recorte visual ficou consolidado como validado.
- A validaï¿½ï¿½o cobriu tela, listas, renderizaï¿½ï¿½o visual, recarregamento sem salvar e nï¿½o-regressï¿½o visual de seleï¿½ï¿½o e calendï¿½rio/faturamento.
- A lista vazia nï¿½o foi explicitamente validada nesta etapa.
- Nenhum cï¿½digo foi alterado nesta etapa e nenhum dado de banco foi modificado.
- A prï¿½xima etapa recomendada ï¿½ uma decisï¿½o conservadora antes de qualquer novo recorte.
- O documento criado foi `docs/fase_2b_convenios_planos_validacao_render_listas.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Convï¿½nios e Planos - Decisï¿½o pï¿½s-validaï¿½ï¿½o da renderizaï¿½ï¿½o de listas

- `Convï¿½nios e Planos` permanece consolidado como frente parcialmente validada.
- Os candidatos restantes foram reavaliados e separados entre apoio visual local, eventos/wiring e ï¿½reas sensï¿½veis.
- A decisï¿½o conservadora registrada foi `CONVPLAN-DEC-C`.
- A prï¿½xima aï¿½ï¿½o recomendada ï¿½ exigir novo microcontrato antes de qualquer avanï¿½o adicional.
- Nenhum cï¿½digo foi alterado nesta etapa e nenhum dado de banco foi modificado.
- O documento criado foi `docs/fase_2b_convenios_planos_decisao_pos_validacao_render_listas.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Convï¿½nios e Planos - Microcontrato de seleï¿½ï¿½o visual

- A seleï¿½ï¿½o visual de `Convï¿½nios e Planos` foi avaliada apï¿½s a renderizaï¿½ï¿½o das listas.
- `convPlanSelecionarConvenio` e `convPlanSelecionarPlano` foram mapeadas como acopladas ao estado funcional da frente.
- A seleï¿½ï¿½o visual ficou considerada acoplada demais para um recorte isolado seguro nesta etapa.
- A decisï¿½o registrada foi `CONVPLAN-SEL-D`.
- O prï¿½ximo candidato recomendado ï¿½ shell visual ou filtros locais, caso venha um novo contrato.
- Nenhum cï¿½digo foi alterado nesta etapa e nenhum dado de banco foi modificado.
- O documento criado foi `docs/fase_2b_convenios_planos_microcontrato_selecao_visual.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Convï¿½nios e Planos - Microcontrato de shell visual

- O shell visual de `Convï¿½nios e Planos` foi aberto como microcontrato documental.
- `convPlanAbrir`, `convPlanEnsureUI` e `convPlanVincularEventos` foram mapeadas como parte do shell atual.
- O shell puro ainda estï¿½ parcialmente misturado com carregamento de dados e wiring.
- A decisï¿½o registrada foi `CONVPLAN-SHELL-A`.
- A futura implementaï¿½ï¿½o deve limitar-se a helper visual passivo para containers, sem alterar eventos nem carregamento.
- Nenhum cï¿½digo foi alterado nesta etapa e nenhum dado de banco foi modificado.
- O documento criado foi `docs/fase_2b_convenios_planos_microcontrato_shell_visual.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Convï¿½nios e Planos - Implementacao minima do shell visual de containers

- A implementacao minima do helper visual/passivo de containers foi concluida para `Convï¿½nios e Planos`.
- A origem da decisao foi `CONVPLAN-SHELL-A`.
- O helper passivo `resolverShellVisualContainers` foi criado em [`frontend/js/modules/convenios-planos.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\convenios-planos.js).
- `frontend/app.js` passou a consultar o helper de forma defensiva e manteve fallback local equivalente.
- Nenhum backend, banco, [`frontend/index.html`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\index.html), `requestJson`, payload, salvamento, exclusao, calendario/faturamento ou permissao foi alterado.
- O proximo passo recomendado e validacao manual pelo usuario antes de qualquer novo avanc'o.
- O documento criado foi `docs/fase_2b_convenios_planos_implementacao_shell_visual_containers.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Convï¿½nios e Planos - Validaï¿½ï¿½o manual do shell visual de containers

- A validaï¿½ï¿½o manual da implementaï¿½ï¿½o shell visual/containers de `Convï¿½nios e Planos` foi aprovada.
- O relato do usuï¿½rio foi: `PASSOU ESTA OK`.
- O commit validado foi `56c188b872ac96156ff267499f1f09d9583dc663`.
- Nenhum cï¿½digo ou banco foi alterado nesta etapa documental.
- O prï¿½ximo passo recomendado ï¿½ criar uma decisï¿½o pï¿½s-validaï¿½ï¿½o antes de qualquer novo avanï¿½o.
- O documento criado foi `docs/fase_2b_convenios_planos_validacao_shell_visual_containers.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Convï¿½nios e Planos - Decisao pos-validacao do shell visual de containers

- A decisï¿½o pï¿½s-validacao do shell visual/containers de `Convï¿½nios e Planos` foi registrada.
- A validaï¿½ï¿½o manual foi aprovada pelo usuï¿½rio.
- O relato do usuï¿½rio foi: `PASSOU ESTA OK`.
- A decisï¿½o final registrada foi `CONVPLAN-SHELL-DEC-C`.
- Nenhum cï¿½digo ou banco foi alterado nesta etapa documental.
- A prï¿½xima etapa recomendada ï¿½ voltar para a matriz comparativa da Fase 2B antes de abrir qualquer novo recorte nesta frente.
- O documento criado foi `docs/fase_2b_convenios_planos_decisao_pos_validacao_shell_visual_containers.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Matriz comparativa pos Convï¿½nios e Planos

- A matriz comparativa da Fase 2B foi aberta apos a pausa de `Convï¿½nios e Planos`.
- A decisao anterior consolidada foi `CONVPLAN-SHELL-DEC-C`.
- As frentes candidatas foram reavaliadas com foco em risco relativo, clareza de fronteira e possibilidade de recorte seguro.
- A decisao final registrada foi `MATRIZ-POS-CONV-C`.
- A Fase 2B tecnica permanece pausada por ora para revisao documental geral antes de qualquer novo recorte.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- O documento criado foi `docs/fase_2b_matriz_comparativa_pos_convenios_planos.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Revisao documental geral pos matriz Convï¿½nios e Planos

- A revisao documental geral da Fase 2B foi criada apos a matriz comparativa pos `Convï¿½nios e Planos`.
- A origem da revisao foi `MATRIZ-POS-CONV-C`.
- A pausa tecnica da Fase 2B foi confirmada.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- A prï¿½xima decisao recomendada e manter a pausa ate nova autorizacao ou nova analise documental.
- O documento criado foi `docs/fase_2b_revisao_documental_geral_pos_matriz_conv_plan.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2C - Matriz operacional de reducao de monolitos

- A Fase 2C foi aberta como estrategia de reducao real de monolitos, com risco controlado medio / medio-alto.
- A diferenca para a Fase 2B e que agora sao aceitos recortes maiores, desde que haja fronteira clara, backup, ponto de retorno e validacao manual posterior.
- A matriz operacional foi registrada em `docs/fase_2c_matriz_operacional_reducao_monolitos.md`.
- A decisao da matriz foi `F2C-MATRIZ-D`.
- O primeiro fluxo recomendado e `Editor de Textos - separacao inicial de bootstrap/shell visual`, por ser o maior bloco concentrado e ja possuir bootstrap passivo em `frontend/js/modules/editor_textos_bootstrap.js`.
- `Agenda principal`, `Ficha pessoal`, `Convï¿½nios e Planos` e `Prestadores` permanecem como candidatos futuros, mas nao sao a primeira escolha da Fase 2C.
- Nenhum codigo, banco, backend, HTML, migration, seed ou permissao foi alterado nesta etapa documental.
- A proxima etapa recomendada e criar um documento de implementacao do primeiro fluxo real da Fase 2C e, depois, sua validacao manual.
- A blindagem textual/mojibake foi respeitada.

## Fase 2C - Editor de Textos - Implementacao bootstrap/shell visual

- A primeira implementacao real da Fase 2C foi executada no `Editor de Textos`.
- A origem da decisao foi `F2C-MATRIZ-D`.
- O fluxo implementado foi a separacao inicial de bootstrap/shell visual.
- `frontend/app.js` foi reduzido de forma real, deixando de concentrar o bloco grande de bootstrap inicial do editor.
- `frontend/js/modules/editor_textos_bootstrap.js` passou a concentrar a inicializacao visual/base do editor.
- Um backup controlado foi criado antes da alteracao em `backups_modularizacao/fase_2c/editor_textos_bootstrap_shell_visual/`.
- Nenhum backend, banco, `frontend/index.html`, `requestJson`, payload, salvamento, PDF, assinatura ou permissao foi alterado nesta etapa.
- O documento criado foi `docs/fase_2c_editor_textos_implementacao_bootstrap_shell_visual.md`.
- A prï¿½xima etapa recomendada e o teste manual do usuario antes de qualquer novo avanco.
- A blindagem textual/mojibake foi respeitada.

## Fase 2C - Editor de Textos - Validacao bootstrap/shell visual

- A validacao manual da primeira implementacao real da Fase 2C foi aprovada pelo usuario.
- O modulo validado foi o `Editor de Textos`.
- O fluxo validado foi o bootstrap/shell visual.
- O commit validado foi `8e16fd3`.
- O relato do usuario foi: `testes passaram, tudo ok, nao encontrei problemas`.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- A proxima etapa recomendada e criar uma decisao pos-validacao antes de novo recorte da Fase 2C.
- O documento criado foi `docs/fase_2c_editor_textos_validacao_bootstrap_shell_visual.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2C - Editor de Textos - Decisao pos-validacao do bootstrap/shell visual

- A decisao pos-validacao da primeira implementacao real da Fase 2C foi registrada.
- O modulo continua sendo `Editor de Textos`.
- O fluxo validado continua sendo `bootstrap/shell visual`.
- O commit da implementacao validada e `8e16fd3`.
- O commit da validacao manual e `3d5b2c8`.
- O relato do usuario foi: `testes passaram, tudo ok, nao encontrei problemas`.
- A decisao final registrada foi `F2C-EDITOR-DEC-B`.
- A proxima etapa recomendada e abrir um contrato especifico para toolbar/acoes visuais antes de qualquer nova implementacao.
- O contrato especifico de toolbar/acoes visuais foi aberto com a decisao `F2C-TOOLBAR-A`, focando apenas a atualizacao visual da toolbar como passo futuro controlado.
- A implementacao da atualizacao visual da toolbar foi concluida com reducao real de `frontend/app.js` e concentracao do algoritmo visual em `frontend/js/modules/editor_textos_bootstrap.js`.
- Foi criado backup controlado em `backups_modularizacao/fase_2c/editor_textos_toolbar_visual/` antes da alteracao.
- Nenhum codigo funcional fora do recorte foi alterado: `frontend/index.html`, backend, banco, `requestJson`, payload, salvamento, PDF, assinatura, handlers de edicao e permissï¿½es permaneceram fora.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- O documento criado foi `docs/fase_2c_editor_textos_decisao_pos_validacao_bootstrap_shell_visual.md`.
- O novo documento de toolbar e `docs/fase_2c_editor_textos_contrato_toolbar_acoes_visuais.md`.
- O novo documento de implementacao e `docs/fase_2c_editor_textos_implementacao_toolbar_visual.md`.
- A validacao manual da toolbar visual foi aprovada com o relato do usuario `PASSOU SEM PROBLEMAS`.
- O commit validado foi `27e990d`.
- A decisao pos-validacao da toolbar visual foi registrada com a decisao final `F2C-EDITOR-TOOLBAR-DEC-E`.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- O proximo passo recomendado e criar uma decisao pos-validacao antes de qualquer novo recorte da Fase 2C.
- O novo documento de decisao e `docs/fase_2c_editor_textos_decisao_pos_validacao_toolbar_visual.md`.
- A rodada inicial do Editor de Textos foi consolidada com revisao documental curta.
- Foram registrados os commits `8e16fd3`, `3d5b2c8`, `27e990d` e `eb70773`.
- A decisao final desta revisao ficou em `F2C-EDITOR-REV-E`.
- O novo documento de revisao e `docs/fase_2c_editor_textos_revisao_curta_rodada_inicial.md`.
- A nova matriz operacional curta foi aberta com a decisao `F2C-CURTA-A`, recomendando continuar no Editor de Textos com contrato especifico para painel lateral/listagem visual.
- O novo documento de matriz e `docs/fase_2c_matriz_operacional_curta_pos_editor_textos.md`.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- A proxima etapa recomendada e abrir contrato especifico para o painel lateral/listagem visual do Editor de Textos.
- A blindagem textual/mojibake foi respeitada.

## Fase 2C - Editor de Textos - Contrato do painel lateral/listagem visual

- O contrato especifico do painel lateral/listagem visual do Editor de Textos foi aberto como continuidade da matriz curta.
- A origem da decisao foi `F2C-CURTA-A`.
- A frente foi tratada como visual/listagem separavel, com o painel lateral, a listagem, o shell e os estados de selecao mapeados por leitura.
- A separacao entre visual, selecao funcional e carga remota confirmou que a primeira fronteira segura e a renderizacao visual da listagem.
- A decisao final registrada foi `F2C-PAINEL-A`.
- O novo documento e `docs/fase_2c_editor_textos_contrato_painel_lateral_listagem_visual.md`.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- A proxima etapa recomendada e implementar apenas a renderizacao visual/listagem do painel lateral, sem abrir os fluxos remotos ou sensiveis.
- A blindagem textual/mojibake foi respeitada.

## Fase 2C - Editor de Textos - Implementacao painel lateral / listagem visual

- A renderizacao visual/listagem do painel lateral do Editor de Textos foi implementada como extracao real.
- A origem da decisao foi `F2C-PAINEL-A`.
- A logica de listagem foi concentrada no helper passivo `panelRenderListaAbertura` em `frontend/js/modules/editor_textos_bootstrap.js`.
- `frontend/app.js` passou a atuar como fachada defensiva, preservando fallback local.
- A reducao real de `frontend/app.js` foi confirmada.
- O backup controlado foi criado em `backups_modularizacao/fase_2c/editor_textos_painel_lateral_listagem_visual/`.
- Nao houve alteracao em `frontend/index.html`, backend, banco, `requestJson`, payload, salvamento, exclusao, PDF, assinatura, carga remota, selecao funcional ou permissï¿½es.
- O novo documento e `docs/fase_2c_editor_textos_implementacao_painel_lateral_listagem_visual.md`.
- A proxima etapa recomendada e teste manual pelo usuario antes de qualquer novo avanco.
- A blindagem textual/mojibake foi respeitada.

## Fase 2C - Editor de Textos - Validacao painel lateral / listagem visual

- A validacao manual da implementacao do painel lateral/listagem visual do Editor de Textos foi aprovada pelo usuario.
- A origem da decisao foi `F2C-PAINEL-A`.
- O commit validado foi `a405449`.
- O relato do usuario foi `TESTES PASSARAM, TUDO OK`.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- O novo documento e `docs/fase_2c_editor_textos_validacao_painel_lateral_listagem_visual.md`.
- O proximo passo recomendado e criar decisao pos-validacao antes de qualquer novo recorte da Fase 2C.
- A blindagem textual/mojibake foi respeitada.

## Fase 2C - Editor de Textos - Decisao pos-validacao do painel lateral / listagem visual

- A decisao pos-validacao do painel lateral/listagem visual do Editor de Textos foi registrada.
- O commit da implementacao validada foi `a405449`.
- O commit da validacao manual foi `3f7b77b`.
- O relato do usuario foi `TESTES PASSARAM, TUDO OK`.
- A decisao final foi `F2C-EDITOR-PAINEL-DEC-D`.
- A recomendacao registrada foi fazer revisao documental curta consolidando as tres extracoes reais antes de qualquer novo recorte.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- O novo documento e `docs/fase_2c_editor_textos_decisao_pos_validacao_painel_lateral_listagem_visual.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2C - Editor de Textos - Revisao curta das tres extracoes reais

- A revisao documental curta consolidando as tres extracoes reais do Editor de Textos foi registrada.
- Os commits principais consolidados foram `8e16fd3`, `3d5b2c8`, `27e990d`, `eb70773`, `a405449` e `3f7b77b`.
- Os backups consolidados foram `backups_modularizacao/fase_2c/editor_textos_bootstrap_shell_visual/`, `backups_modularizacao/fase_2c/editor_textos_toolbar_visual/` e `backups_modularizacao/fase_2c/editor_textos_painel_lateral_listagem_visual/`.
- A decisao final foi `F2C-EDITOR-REV3-E`.
- A recomendacao registrada foi fazer revisao geral da Fase 2C antes de qualquer novo recorte.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- O novo documento e `docs/fase_2c_editor_textos_revisao_curta_tres_extracoes_reais.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2C - Revisao geral apos tres extracoes reais do Editor de Textos

- A revisao geral da Fase 2C foi registrada apos tres extracoes reais validadas do Editor de Textos.
- A consolidacao incluiu os commits `7760283`, `8e16fd3`, `3d5b2c8`, `27e990d`, `eb70773`, `a405449`, `3f7b77b` e `72b0e5c`.
- O estado da Fase 2C ficou consolidado como estrategia comprovada de reducao real de monolitos.
- A decisao final foi `F2C-GERAL-E`.
- A recomendacao registrada foi fazer nova revisao estrategica antes de abrir novo recorte.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- O novo documento e `docs/fase_2c_revisao_geral_pos_editor_textos_tres_extracoes.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2C - Revisao estrategica pos-rodada do Editor de Textos

- A revisao estrategica da Fase 2C foi registrada apos a consolidacao da rodada do Editor de Textos.
- A consolidacao incluiu os resultados da Fase 2C ate aqui.
- A decisao final foi `F2C-ESTRAT-D`.
- A recomendacao registrada foi abrir nova matriz operacional curta da Fase 2C.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- O novo documento e `docs/fase_2c_revisao_estrategica_pos_editor_textos.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2C - Matriz operacional curta apos revisao estrategica

- A nova matriz operacional curta da Fase 2C foi aberta apos a revisao estrategica.
- A origem da decisao foi `F2C-ESTRAT-D`.
- A consolidacao da rodada do Editor de Textos foi mantida como contexto valido.
- A decisao final foi `F2C-CURTA2-B`.
- O modulo recomendado foi `Prestadores`.
- O fluxo recomendado foi o bloco visual complementar da listagem/painel com filtros locais simples.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- O novo documento e `docs/fase_2c_matriz_operacional_curta_pos_revisao_estrategica.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2C - Prestadores - Contrato da listagem, painel e filtros locais

- `Prestadores` foi confirmado como modulo comum/core nesta rodada.
- A origem da decisao foi `F2C-CURTA2-B`.
- O mapa tecnico destacou `frontend/app.js` como fachada atual e `frontend/js/modules/prestadores.js` como namespace passivo ja existente.
- O contrato documental uniu listagem/painel e filtros locais simples como fronteira segura para o proximo passo.
- A avaliacao comparou `PREST-F2C-1` a `PREST-F2C-5` e descartou selecao funcional, carga remota, payload, salvamento e demais fluxos sensiveis.
- A decisao final registrada foi `F2C-PREST-C`.
- O novo documento e `docs/fase_2c_prestadores_contrato_listagem_painel_filtros_locais.md`.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- A proxima etapa recomendada e manter o contrato documentado pronto para eventual implementacao real do bloco visual/painel + filtros locais simples, com backup controlado antes de qualquer codigo.
- A blindagem textual/mojibake foi respeitada.

## Fase 2C - Prestadores - Implementacao da listagem, painel e filtros locais

- A implementacao real do bloco visual/painel + filtros locais simples de `Prestadores` foi concluida.
- A classificacao confirmou `Prestadores` como modulo comum/core.
- A origem da decisao foi `F2C-PREST-C`.
- O fluxo implementado foi `listagem/painel + filtros locais simples`.
- Os arquivos alterados foram `frontend/app.js` e `frontend/js/modules/prestadores.js`.
- O backup controlado foi criado em `backups_modularizacao/fase_2c/prestadores_listagem_painel_filtros_locais/`.
- A reducao real de `frontend/app.js` foi confirmada.
- Nao houve alteracao de `frontend/index.html`, backend, banco, `requestJson`, payload, salvamento, exclusao, permissï¿½es, vinculo usuario/prestador ou protecao estrutural do prestador sistemico `Clï¿½nica`.
- O novo documento e `docs/fase_2c_prestadores_implementacao_listagem_painel_filtros_locais.md`.
- A proxima etapa recomendada e teste manual pelo usuario antes de qualquer novo avanco.
- A blindagem textual/mojibake foi respeitada.

## Fase 2C - Prestadores - Validacao da listagem, painel e filtros locais

- A validacao manual da implementacao de `Prestadores` na Fase 2C foi aprovada pelo usuario.
- A classificacao confirmou `Prestadores` como modulo comum/core.
- O fluxo validado foi `listagem/painel + filtros locais simples`.
- A origem da decisao foi `F2C-PREST-C`.
- O commit validado foi `1b438a2`.
- O relato do usuario foi `todos testes passaram`.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- O novo documento e `docs/fase_2c_prestadores_validacao_listagem_painel_filtros_locais.md`.
- O proximo passo recomendado e criar decisao pos-validacao antes de qualquer novo recorte da Fase 2C.
- A blindagem textual/mojibake foi respeitada.

## Fase 2C - Prestadores - Decisao pos-validacao da listagem, painel e filtros locais

- A decisao pos-validacao da implementacao de `Prestadores` na Fase 2C foi registrada.
- A classificacao confirmou `Prestadores` como modulo comum/core.
- O fluxo consolidado foi `listagem/painel + filtros locais simples`.
- A origem da decisao foi `F2C-PREST-C`.
- Os commits de referencia foram `1b438a2` e `8777137`.
- O relato do usuario foi `todos testes passaram`.
- A decisao final registrada foi `F2C-PREST-DEC-D`.
- O novo documento e `docs/fase_2c_prestadores_decisao_pos_validacao_listagem_painel_filtros_locais.md`.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- A recomendacao registrada foi fazer revisao documental curta consolidando a rodada de Prestadores antes de qualquer novo recorte.
- A blindagem textual/mojibake foi respeitada.

## Fase 2C - Prestadores - Revisao curta da rodada de listagem, painel e filtros locais

- A revisao curta da rodada de `Prestadores` na Fase 2C foi registrada.
- A classificacao confirmou `Prestadores` como modulo comum/core.
- A implementacao real consolidada foi `listagem/painel + filtros locais simples`.
- Os commits principais registrados foram `1b438a2`, `8777137` e `7c54c69`.
- A decisao final registrada foi `F2C-PREST-REV-E`.
- A recomendacao registrada foi fazer revisao geral da Fase 2C antes de novo recorte.
- O novo documento e `docs/fase_2c_prestadores_revisao_curta_rodada_listagem_painel.md`.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- A blindagem textual/mojibake foi respeitada.

## Fase 2C - Revisao geral apos Prestadores

- A revisao geral da Fase 2C foi registrada apos as rodadas consolidadas de `Editor de Textos` e `Prestadores`.
- A consolidacao incluiu as extracoes reais do Editor de Textos e a implementacao real de Prestadores.
- Os commits principais consolidados foram `8e16fd3`, `3d5b2c8`, `27e990d`, `eb70773`, `a405449`, `3f7b77b`, `72b0e5c`, `5630491`, `0bc0238`, `7892f99`, `1b438a2`, `8777137`, `7c54c69` e `270b505`.
- A decisao final registrada foi `F2C-GERAL2-E`.
- A recomendacao registrada foi abrir nova matriz operacional curta da Fase 2C para escolher o proximo modulo.
- O novo documento e `docs/fase_2c_revisao_geral_pos_prestadores.md`.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- A blindagem textual/mojibake foi respeitada.

## Fase 2C - Matriz operacional curta apos revisao geral de Prestadores

- A nova matriz operacional curta da Fase 2C foi aberta apos a revisao geral de `Prestadores`.
- A origem da decisao foi `F2C-GERAL2-E`.
- A consolidacao das rodadas de `Editor de Textos` e `Prestadores` foi mantida como contexto valido.
- A decisao final registrada foi `F2C-CURTA3-E`.
- O fluxo recomendado foi manter a Fase 2C em manutencao/correcoes apenas neste momento.
- O novo documento e `docs/fase_2c_matriz_operacional_curta_pos_prestadores.md`.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anotacoes - Diagnostico comparativo EasyDental x Brana Cloud

- O diagnostico comparativo da aba `Anotacoes` foi aberto como etapa exclusivamente documental.
- A leitura do codigo atual confirmou `textarea` simples, toolbar visivel com acoes ainda em planejamento, salvamento de texto puro e persistencia em `Text`.
- A leitura do legado localizada no workspace foi indireta e confirmou apenas o mapeamento do campo `ANOTAC` para `anotacoes`, sem UI direta do EasyDental para essa aba.
- A conclusao registrada e que o Brana Cloud tem uma implementacao minima de anotacoes, mas ainda sem equivalencia funcional rica comprovada com o EasyDental.
- O risco foi classificado como medio, com impacto medio/alto se houver futura aproximacao de comportamento rico ou mudanca de persistencia.
- A recomendacao registrada e abrir contrato especifico antes de qualquer implementacao futura, incluindo formato visual, semantica de salvamento e compatibilidade com o campo existente.
- O novo documento e `docs/ficha_pessoal_anotacoes_diagnostico_comparativo_easydental_brana.md`.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anotacoes - Contrato de correcao da toolbar e persistencia

- O contrato de correcao da aba `Anotacoes` foi aberto como etapa exclusivamente documental.
- A base documental usada foi `docs/ficha_pessoal_anotacoes_diagnostico_comparativo_easydental_brana.md`.
- A recomendacao registrada para a primeira implementacao e `FICHA-ANOT-CONTR-A`.
- A primeira implementacao deve priorizar texto puro, manter a persistencia atual e evitar backend, banco, payload e salvamento com novo formato.
- O escopo permitido futuro inclui apenas modularizacao controlada, fachada fina em `frontend/app.js` e evolucao visual/local minima.
- O escopo proibido futuro inclui backend, banco, migrations, seeds, endpoints, `.env`, `requestJson`, payload, salvamento, exclusao, permissoes, Anamnese, Historico, Editor de Textos, Agenda e Financeiro.
- O backup obrigatorio antes de eventual implementacao foi definido em `backups_modularizacao/fase_2c/ficha_pessoal_anotacoes_correcao_toolbar/`.
- O novo documento e `docs/ficha_pessoal_anotacoes_contrato_correcao_toolbar_persistencia.md`.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anotacoes - Implementacao da toolbar com texto puro

- A primeira implementacao pequena da aba `Anotacoes` foi concluida como etapa controlada.
- O modulo dedicado `frontend/js/modules/ficha_pessoal_anotacoes.js` foi criado e consumido.
- `frontend/app.js` ficou como fachada fina e integrou a toolbar de forma minima.
- O texto puro foi preservado com marcacoes simples e reversiveis no textarea.
- Nao houve alteracao de backend, banco, payload ou formato de salvamento.
- O backup obrigatorio foi criado em `backups_modularizacao/fase_2c/ficha_pessoal_anotacoes_correcao_toolbar/`.
- O novo documento e `docs/ficha_pessoal_anotacoes_implementacao_toolbar_texto_puro.md`.
- Nenhum codigo ou banco foi alterado alem do escopo estritamente controlado desta implementacao.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anotacoes - Correï¿½ï¿½o emergencial de regressï¿½o global

- Foi registrada regressï¿½o global de frontend apï¿½s a implementaï¿½ï¿½o da toolbar de `Anotaï¿½ï¿½es`.
- O sintoma informado foi perda de resposta dos menus apï¿½s login, inclusive do botï¿½o `Sair`.
- A correï¿½ï¿½o emergencial restaurou `frontend/app.js` a partir do backup manual controlado.
- O mï¿½dulo `frontend/js/modules/ficha_pessoal_anotacoes.js` ficou sem consumo prï¿½tico apï¿½s a restauraï¿½ï¿½o.
- O novo documento ï¿½ `docs/ficha_pessoal_anotacoes_correcao_regressao_global_frontend.md`.
- Nenhum backend, banco, payload, `requestJson` ou persistï¿½ncia foi alterado na correï¿½ï¿½o.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anotacoes - Validaï¿½ï¿½o da correï¿½ï¿½o emergencial da regressï¿½o global

- Foi registrada a validaï¿½ï¿½o manual da correï¿½ï¿½o emergencial da regressï¿½o global causada pela tentativa de integraï¿½ï¿½o da toolbar de `Anotaï¿½ï¿½es`.
- O sistema voltou a funcionar como estava antes.
- O login funcionou.
- Os menus voltaram a responder.
- O botï¿½o `Sair` voltou a funcionar.
- A navegaï¿½ï¿½o geral voltou ao comportamento anterior.
- A toolbar de `Anotaï¿½ï¿½es` deve permanecer pausada/desativada por enquanto.
- O novo documento ï¿½ `docs/ficha_pessoal_anotacoes_validacao_correcao_regressao_global.md`.
- Nenhum backend, banco, payload, `requestJson` ou persistï¿½ncia foi alterado nesta validaï¿½ï¿½o.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anamnese - Diagnï¿½stico comparativo EasyDental x Brana Cloud

- Foi registrada a anï¿½lise documental da aba `Anamnese` da `Ficha Pessoal`.
- O diagnï¿½stico comparou o comportamento atual do Brana Cloud com o comportamento esperado inspirado no EasyDental virgem/legado.
- O Brana Cloud mostrou estrutura funcional para questionï¿½rios, perguntas e respostas, com `requestJson`, tabela de perguntas e textarea de resposta/observaï¿½ï¿½o clï¿½nica.
- O backend possui modelos e rotas dedicados para `anamnese_questionarios`, `anamnese_perguntas` e `anamnese_respostas`.
- O legado disponï¿½vel no workspace confirma questionï¿½rios como `Principal`, `Implante`, `Ficha complementar`, `Anamnese de Saï¿½de` e `Anamnese pessoal`.
- Nï¿½o foi localizada UI direta do EasyDental neste workspace.
- O maior risco identificado estï¿½ em salvamento, payload, acoplamento do frontend e possï¿½vel regressï¿½o global.
- O novo documento ï¿½ `docs/ficha_pessoal_anamnese_diagnostico_comparativo_easydental_brana.md`.
- Nenhum backend, banco, payload, `requestJson` ou persistï¿½ncia foi alterado nesta etapa documental.
- A blindagem textual/mojibake foi respeitada.
## Ficha pessoal - Anamnese - Implementaï¿½ï¿½o do combo de questionï¿½rios

- Foi registrada a primeira implementaï¿½ï¿½o prï¿½tica segura da aba `Anamnese` da `Ficha Pessoal`.
- O combo visï¿½vel de questionï¿½rios foi adicionado na aba clï¿½nica.
- A troca do questionï¿½rio passou a recarregar perguntas/respostas usando a estrutura jï¿½ existente.
- Uma guarda simples de concorrï¿½ncia foi adicionada para evitar sobrescrever a tela com resposta antiga.
- O salvamento textual atual foi preservado.
- `frontend/app.js` foi alterado apenas no trecho da aba Anamnese.
- Backend, banco, payload, `requestJson` e formato de salvamento nï¿½o foram alterados.
- O backup obrigatï¿½rio foi criado em `backups_modularizacao/fase_2c/ficha_pessoal_anamnese_combo_questionarios/`.
- O novo documento ï¿½ `docs/ficha_pessoal_anamnese_implementacao_combo_questionarios.md`.
- A blindagem textual/mojibake foi respeitada.
## Ficha pessoal - Anamnese - CorreÃ§Ã£o da tela base e bloqueio por paciente vÃ¡lido

- Foi registrada a correÃ§Ã£o conservadora da tela base da `Anamnese` da `Ficha Pessoal`.
- O cabeÃ§alho da aba passou a exibir o nome do paciente atual de forma clara.
- A lista de perguntas recebeu rolagem prÃ³pria.
- A abertura de `Anamnese`/`HistÃ³rico` passou a ser bloqueada sem paciente vÃ¡lido/salvo.
- Uma guarda simples de concorrÃªncia foi mantida para evitar sobrescrever a tela com resposta antiga.
- A combo `QuestionÃ¡rio` continuou usando a fonte existente da clÃ­nica.
- Backend, banco, payload, `requestJson` e formato de salvamento nÃ£o foram alterados.
- O backup obrigatÃ³rio foi criado em `backups_modularizacao/fase_2c/ficha_pessoal_anamnese_correcao_tela_base_questionarios/`.
- O novo documento Ã© `docs/ficha_pessoal_anamnese_correcao_tela_base_questionarios.md`.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anamnese - Contrato do combo de questionï¿½rios e carregamento controlado

- Foi registrado o contrato seguro para a prï¿½xima etapa da aba `Anamnese` da `Ficha Pessoal`.
- A base documental usada foi o diagnï¿½stico comparativo EasyDental x Brana Cloud e a validaï¿½ï¿½o da correï¿½ï¿½o emergencial da regressï¿½o global da aba `Anotaï¿½ï¿½es`.
- A decisï¿½o recomendada ficou em `FICHA-ANAM-CONTR-A`.
- A primeira implementaï¿½ï¿½o futura deve se limitar ao combo visï¿½vel de questionï¿½rios e ao carregamento controlado usando endpoints jï¿½ existentes.
- O salvamento textual atual deve ser preservado.
- Backend, banco, payload e `requestJson` nï¿½o devem ser alterados nesta fase.
- O novo documento ï¿½ `docs/ficha_pessoal_anamnese_contrato_combo_questionarios.md`.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anamnese - Limpeza inicial do botao e quadros antigos

- Foi registrada a limpeza inicial da aba `Anamnese` da `Ficha Pessoal`.
- O botao `Atualizar anamnese` foi removido da tela.
- Os quadros antigos da parte inferior foram removidos:
  - `Perguntas de anamnese`
  - `Resposta / Observacao clinica`
  - a mensagem antiga de alerta
- A tela ficou apenas com a parte superior pronta: nome do paciente + combo `Questionario` + espaco inferior vazio para evolucao futura.
- A logica do combo nao foi alterada nesta rodada.
- `Procura` nao foi alterado nesta rodada.
- O arquivo alterado foi `frontend/app.js`.
- Nenhum backend, banco, payload, `requestJson` ou formato de salvamento foi alterado.
- O backup obrigatorio foi criado em `backups_modularizacao/fase_2c/ficha_pessoal_anamnese_limpeza_botao_quadros/`.
- O novo documento e `docs/ficha_pessoal_anamnese_limpeza_botao_quadros.md`.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Correcao do botao Procura reentrante

- Foi registrada a correcao do botao `Procura...` da `Ficha Pessoal`.
- O problema confirmado era o botao funcionar apenas uma vez apos a selecao de um paciente.
- A causa encontrada foi o atalho de abrir por codigo numerico, que podia curto-circuitar o fluxo de busca quando o codigo ja era o mesmo do paciente atual.
- A correccao fez o botao abrir sempre a pesquisa de pacientes, reutilizando o menu existente.
- A logica de abertura por codigo ficou preservada apenas para os fluxos de teclado/blur.
- A aba `Anamnese` nao foi alterada nesta rodada.
- O arquivo alterado foi `frontend/app.js`.
- Nenhum backend, banco, payload, `requestJson` ou formato de salvamento foi alterado.
- O novo documento e `docs/ficha_pessoal_correcao_botao_procura_reentrante.md`.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Validacao do botao Procura reentrante

- Foi registrada a validacao manual da correcao do botao `Procura...` da `Ficha Pessoal`.
- O commit validado foi `1b53fb4`.
- O resultado informado pelo usuario foi `PASSOU`.
- O fluxo testado confirmou: abrir `Ficha Pessoal`, clicar em `Procura...`, selecionar paciente, carregar a ficha, clicar novamente em `Procura...` sem fechar a ficha e abrir a pesquisa de novo.
- A correcao foi considerada concluida.
- Nenhum codigo, backend, banco, payload, `requestJson` ou formato de salvamento foi alterado nesta validacao.
- O novo documento e `docs/ficha_pessoal_validacao_botao_procura_reentrante.md`.
- A proxima recomendacao e retomar a aba `Anamnese` em uma nova subetapa pequena.
- A blindagem textual/mojibake foi respeitada.
## Fase 2B - Ficha pessoal - Contrato profundo do modulo core

- O contrato profundo documental de `Ficha pessoal` foi aberto como etapa autorizada pelo usuario.
- A frente foi tratada como `comum/core transversal`.
- O mapa de leitura registrou `frontend/app.js`, `frontend/js/modules/anamnese.js`, `backend/routes/cadastros_routes.py` e `backend/routes/anamnese_routes.py` por leitura apenas.
- A superficie funcional foi considerada ampla e fortemente acoplada a shell, menu de pacientes, busca, foto, convenios/planos, unidades, anamnese, historico, agenda e financeiro.
- A decisao registrada foi `FICHA-CONTRATO-D`.
- A recomendacao final e manter a pausa da frente e retomar apenas com novo contrato extremamente pequeno ou nova matriz comparativa.
- Nenhum codigo, banco, backend, HTML, migration, seed ou permissao foi alterado nesta etapa documental.
- O documento criado foi `docs/fase_2b_ficha_pessoal_contrato_profundo_modulo_core.md`.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Ficha pessoal - Microcontrato de namespace passivo

- O microcontrato de namespace passivo de `Ficha pessoal` foi aberto como etapa documental extremamente pequena.
- A frente continua classificada como `comum/core`.
- A origem da avaliacao foi `FICHA-CONTRATO-D`.
- O mapa comparou arquivos/passivos existentes, padrao de carregamento em `frontend/index.html` e a possibilidade de futuro namespace em arquivo proprio.
- A decisao final registrada foi `FICHA-NS-A`.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- O documento criado foi `docs/fase_2b_ficha_pessoal_microcontrato_namespace_passivo.md`.
- O proximo passo recomendado e somente futuro e condicional: se autorizado, avaliar criacao do arquivo passivo vazio sem consumo imediato pelo `app.js`.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anamnese - Auditoria do fluxo de questionario e contrato

- Foi registrada a auditoria documental do fluxo de questionario da aba `Anamnese` da `Ficha Pessoal`.
- A validacao do botao `Procura...` reentrante ja estava concluida e serviu como contexto de navegacao segura.
- O Brana Cloud mostrou combo visivel de questionario, backend normalizado e persistencia textual.
- O legado EasyDental foi acessado em modo somente leitura pela share `\\Sonyvaio\\c\\EDS70`, mas a extraï¿½ï¿½o direta de UI completa excedeu o tempo; a comparacao visual 1:1 permaneceu parcial.
- A leitura comparativa aponta que o Brana Cloud ainda nao comprova equivalencia completa de lista de perguntas, resposta Sim/Nao + complemento e alertas clinicos.
- A decisao recomendada ficou em `FICHA-ANAM-FLUXO-A`.
- Os caminhos futuros sugeridos incluem `frontend/js/modules/ficha-pessoal-aba-anamnese.js` e, se necessario, um backend com nomes como `backend/routes/ficha_pessoal_anamnese_routes.py`, `backend/models/ficha_pessoal_anamnese.py` e `backend/schemas/ficha_pessoal_anamnese.py`.
- O novo documento e `docs/ficha_pessoal_anamnese_auditoria_fluxo_questionario_contrato.md`.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anamnese - Modularizacao inicial sem mudanca de comportamento

- Foi registrada a modularizacao inicial da aba `Anamnese` da `Ficha Pessoal`.
- O modulo dedicado `frontend/js/modules/ficha-pessoal-aba-anamnese.js` foi criado e consumido.
- `frontend/app.js` foi reduzido a fachada fina para a aba.
- O comportamento visual atual foi preservado: nome do paciente, combo `Questionario` e area inferior vazia/preparada.
- A lista visual de perguntas ainda nao foi implementada.
- O arquivo `frontend/index.html` recebeu um script adicional para carregar o novo modulo, por necessidade tecnica indispensavel.
- O backup manual foi criado em `backups_modularizacao/fase_2c/ficha_pessoal_anamnese_modularizacao_sem_mudar_comportamento/`.
- O novo documento e `docs/ficha_pessoal_anamnese_modularizacao_sem_mudar_comportamento.md`.
- Nenhum backend, banco, payload, `requestJson` ou formato de salvamento foi alterado nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anamnese - Validacao da modularizacao inicial sem mudanca de comportamento

- Foi registrada a validacao manual da modularizacao inicial da aba `Anamnese` da `Ficha Pessoal`.
- O commit validado foi `1a89024`.
- O resultado informado pelo usuario foi `PASSOU`.
- O fluxo testado confirmou menus, `Sair`, `Procura...`, `Ficha Pessoal`, `Anamnese`, nome do paciente, combo `Questionario` e area inferior vazia/preparada.
- A modularizacao inicial foi considerada concluida e aprovada como base segura.
- O novo documento e `docs/ficha_pessoal_anamnese_validacao_modularizacao_sem_mudar_comportamento.md`.
- Nenhum backend, banco, payload, `requestJson` ou formato de salvamento foi alterado nesta validacao.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anamnese - Implementacao do questionario visual sem salvamento

- Foi registrada a implementacao da parte visual inferior da aba `Anamnese`.
- O modulo `frontend/js/modules/ficha-pessoal-aba-anamnese.js` passou a renderizar a lista de perguntas do questionario selecionado.
- Cada pergunta ganhou resposta visual `Sim` / `Nao` e campo de complemento/observacao apenas visual.
- A area inferior passou a ter rolagem vertical para questionarios longos.
- O topo da aba continuou com nome do paciente e combo `Questionario`.
- Nao houve alteracao de backend, banco, schema, migrations, seeds, endpoints, `requestJson`, payload ou formato de salvamento.
- A fachada `frontend/app.js` nao precisou ser alterada nesta rodada.
- `frontend/index.html` permaneceu inalterado.
- O novo documento e `docs/ficha_pessoal_anamnese_implementacao_questionario_visual_sem_salvamento.md`.
- O backup manual foi criado em `backups_modularizacao/fase_2c/ficha_pessoal_anamnese_questionario_visual_sem_salvamento/`.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anamnese - Ajuste visual Sim e Nao em coluna vertical

- Foi registrado o ajuste visual pontual da lista de perguntas da aba `Anamnese`.
- Os controles `Sim` e `Nao` passaram a ficar um abaixo do outro.
- A caixa complementar foi reposicionada de forma compatï¿½vel com o layout da pergunta.
- A rolagem vertical da area inferior foi mantida.
- O comportamento funcional permaneceu sem salvamento.
- O arquivo alterado foi `frontend/js/modules/ficha-pessoal-aba-anamnese.js`.
- `frontend/app.js` e `frontend/index.html` nao precisaram ser alterados.
- Nao houve alteracao de backend, banco, schema, migrations, seeds, endpoints, `requestJson` ou payload.
- O novo documento e `docs/ficha_pessoal_anamnese_ajuste_visual_sim_nao_vertical.md`.
- O backup manual foi criado em `backups_modularizacao/fase_2c/ficha_pessoal_anamnese_ajuste_visual_sim_nao_vertical/`.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anamnese - Validacao do questionario visual sem salvamento

- Foi registrada a validacao manual da implementacao visual do questionario da aba `Anamnese`.
- O commit validado foi `2f9761c`.
- O documento de implementacao validado foi `docs/ficha_pessoal_anamnese_implementacao_questionario_visual_sem_salvamento.md`.
- O usuario informou o resultado `PASSOU`.
- O fluxo testado confirmou perguntas listadas, troca de questionario, rolagem, controles visuais e estabilidade da `Ficha Pessoal`.
- A etapa visual sem salvamento foi considerada concluida.
- A proxima recomendacao e um ajuste visual pequeno para aproximar do EasyDental, especialmente organizar `Sim` e `Nao` em coluna vertical.
- Nenhum backend, banco, payload ou `requestJson` foi alterado nesta validacao.
- O novo documento e `docs/ficha_pessoal_anamnese_validacao_questionario_visual_sem_salvamento.md`.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anamnese - Validacao do ajuste visual Sim e Nao em coluna vertical

- Foi registrada a validacao manual do ajuste visual pontual da aba `Anamnese`.
- O commit validado foi `977235b`.
- O documento de implementacao validado foi `docs/ficha_pessoal_anamnese_ajuste_visual_sim_nao_vertical.md`.
- O usuario informou o resultado `PASSOU`.
- O fluxo testado confirmou perguntas listadas, `Sim` e `Nao` em coluna vertical, caixa complementar aceitavel, troca de questionario, rolagem, ausencia de salvamento e estabilidade da `Ficha Pessoal`.
- A etapa visual foi considerada concluida.
- A proxima recomendacao e abrir contrato especifico antes de implementar salvamento.
- Nenhum backend, banco, payload ou `requestJson` foi alterado nesta validacao.
- O novo documento e `docs/ficha_pessoal_anamnese_validacao_ajuste_visual_sim_nao_vertical.md`.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anamnese - Auditoria da persistencia e contrato

- Foi registrada a auditoria documental da persistencia da aba `Anamnese` da `Ficha Pessoal`.
- As shares legadas `\\Sonyvaio\\c\\EDS70` e `\\Dell_servidor\\c\\EDS70` foram acessadas em modo somente leitura.
- Os scripts SQL de descoberta das duas shares apresentaram a mesma estrutura de anamnese.
- A estrutura legada mostrou `ANAMNESE_QUEST`, `ANAMNESE_PERG` e `ANAMNESE_RESP`, com `RESPOSTA` e `COMPLEM`.
- O Brana Cloud foi confirmado com persistencia textual atual em `PUT /anamnese/pacientes/{id}/respostas`.
- A leitura comparativa indica que o contrato minimo nao exige novo banco, mas a equivalencia completa com o legado ainda nao foi provada.
- A decisao registrada foi `FICHA-ANAM-PERSIST-A`.
- O contrato proposto de confirmacao `Os dados foram alterados...` foi documentado para uso futuro antes de sair da ficha.
- O novo documento e `docs/ficha_pessoal_anamnese_auditoria_persistencia_contrato.md`.
- Nenhum codigo, backend, banco, payload, `requestJson` ou formato de salvamento foi alterado nesta etapa documental.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anamnese - Contrato de confirmacao de alteracoes

- Foi registrado o contrato especifico para confirmacao de alteracoes da aba `Anamnese`.
- A auditorio da persistencia indicou que o legado usa `ANAMNESE_QUEST`, `ANAMNESE_PERG` e `ANAMNESE_RESP`, com `RESPOSTA` e `COMPLEM`.
- O Brana Cloud atual segue com persistencia textual em `PUT /anamnese/pacientes/{id}/respostas`.
- A busca de um mecanismo geral de "dados alterados" na `Ficha Pessoal` nao comprovou um contrato existente para a Anamnese.
- Nao foi encontrado modal padrao unico com `Sim`, `Nao` e `Cancelar`; o frontend usa `window.confirm` e modais especificos em outros fluxos.
- A decisao recomendada foi `FICHA-ANAM-CONFIRM-A`.
- O contrato proposto usa a mensagem `Os dados foram alterados. Deseja grava-los?`.
- O novo documento e `docs/ficha_pessoal_anamnese_contrato_confirmacao_alteracoes.md`.
- Nenhum codigo, backend, banco, payload, `requestJson` ou formato de salvamento foi alterado nesta etapa documental.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anamnese - Contrato de persistencia real de Sim/Nao + complemento

- Foi aberto o contrato de persistencia real da aba `Anamnese`.
- O estado atual da aba ja tem cabecalho com nome do paciente, combo `Questionario`, lista visual de perguntas e confirmacao local sem salvamento.
- A analise do legado EasyDental reforca a existencia de resposta e complemento por pergunta em `ANAMNESE_RESP`.
- A estrutura atual do Brana Cloud possui rotas/modelos de anamnese, mas continua com persistencia textual em `PUT /anamnese/pacientes/{id}/respostas`.
- As opcoes analisadas foram B1, B2, B3 e B4.
- A recomendacao documental foi `FICHA-ANAM-PERSIST-B2`, usando envelope textual estruturado na estrutura atual.
- Para B2, nao ha necessidade imediata de backend novo, banco novo, migracao ou novo endpoint.
- A persistencia real futura deve continuar separada de qualquer evolucao posterior para B3, se um dia for necessario aproximar ainda mais o legado.
- O novo documento e `docs/ficha_pessoal_anamnese_contrato_persistencia_real_sim_nao_complemento.md`.
- Nenhum codigo, backend, banco, payload, `requestJson` ou formato de salvamento foi alterado nesta etapa documental.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anamnese - Implementacao da persistencia B2 por envelope textual

- Foi implementada a persistencia real da aba `Anamnese` usando o contrato `FICHA-ANAM-PERSIST-B2`.
- O frontend da aba passou a salvar e recarregar `Sim` / `Nao` + complemento por paciente/questionario/pergunta.
- O endpoint atual foi reaproveitado sem criacao de endpoint novo.
- O formato escolhido foi um envelope textual JSON stringificado armazenado no campo textual existente da resposta.
- O modal de confirmacao da Anamnese passou a integrar o salvamento seguro: `Sim` salva e prossegue, `Nao` descarta e prossegue, `Cancelar` mantem o usuario na aba.
- A confirmacao local continua funcionando.
- Nenhum backend, banco, migration ou schema novo foi criado.
- O novo documento e `docs/ficha_pessoal_anamnese_implementacao_persistencia_b2_envelope_textual.md`.
- O backup manual foi criado em `backups_modularizacao/fase_2c/ficha_pessoal_anamnese_persistencia_b2_envelope_textual/`.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anamnese - Implementacao da confirmacao local sem salvamento

- Foi registrada a implementacao da camada local de confirmacao de alteracoes da aba `Anamnese`.
- A mensagem contratada e `Os dados foram alterados. Deseja gravï¿½-los?`.
- A interface ganhou `Sim`, `Nao` e `Cancelar` em modal local isolado.
- `Sim` apenas informa que o salvamento ainda nao foi implementado nesta etapa.
- `Nao` descarta as alteracoes locais e segue com a acao pendente.
- `Cancelar` mantem o usuario na aba `Anamnese`.
- A confirmacao passa a cobrir saidas por troca de aba, `Procura...`, `Novo`, `Fechar`, `Sair`, navegacao de paciente e troca de questionario quando houver alteracoes locais.
- A modularizacao continuou restrita ao frontend, sem backend, banco, payload ou `requestJson`.
- O novo documento e `docs/ficha_pessoal_anamnese_implementacao_confirmacao_alteracoes_sem_salvamento.md`.
- O backup manual foi criado em `backups_modularizacao/fase_2c/ficha_pessoal_anamnese_confirmacao_alteracoes_sem_salvamento/`.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anamnese - Validacao da confirmacao local sem salvamento

- Foi registrada a validacao manual da confirmacao local da aba `Anamnese`.
- O commit validado foi `4e6bc554126ca40077940294a2984a7404353197`.
- O usuario informou `teste passou`.
- O modal de confirmacao apareceu quando havia alteracao local pendente.
- `Cancelar` manteve o usuario na Anamnese.
- `Nao` descartou alteracao local e prosseguiu.
- `Sim` nao gravou e apenas avisou limitacao.
- `Sim` / `Nao` e complemento marcaram estado alterado.
- `Procura...`, `Novo`, `Fechar`, `Sair`, troca de aba, navegacao entre pacientes e troca de questionario ficaram protegidos.
- Nao houve regressao global percebida.
- Ainda nao existe salvamento real de `Sim` / `Nao` + complemento.
- A persistencia real ficou como contrato futuro separado.
- O novo documento e `docs/ficha_pessoal_anamnese_validacao_confirmacao_alteracoes_sem_salvamento.md`.
- Nenhum codigo foi alterado nesta validacao.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anamnese - Correcao do Grava integrado e remocao do controle temporario

- Foi registrada a correcao da interface temporaria da Anamnese apos a implementacao B2.
- O texto `Persistencia B2 ativa.` foi removido.
- O botao `Salvar anamnese` foi removido.
- A gravacao da Anamnese passou a ocorrer pelo botao geral `Grava` da `Ficha Pessoal`.
- O modal local de confirmacao continua ativo com `Sim`, `Nao` e `Cancelar`.
- `Sim` salva a Anamnese e segue o fluxo.
- `Nao` descarta alteracoes locais e prossegue.
- `Cancelar` mantem o usuario na aba `Anamnese`.
- Nenhum backend, banco, payload, `requestJson` ou formato de salvamento novo foi introduzido nesta correcao.
- O novo documento e `docs/ficha_pessoal_anamnese_correcao_grava_integrado_remocao_controle_temporario.md`.
- O backup manual foi criado em `backups_modularizacao/fase_2c/ficha_pessoal_anamnese_grava_integrado_remocao_controle_temporario/`.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anamnese - Validacao do Grava integrado e remocao do controle temporario

- Foi registrada a validacao manual da correcao da Anamnese integrada ao botao geral `Grava`.
- O commit validado foi `f97e293`.
- O usuario confirmou `TESTE PASSOU`.
- O texto `Persistencia B2 ativa.` nao aparece mais na UI.
- O botao `Salvar anamnese` nao aparece mais na UI.
- O botao geral `Grava` salva a Anamnese.
- A persistencia B2 continua funcionando como envelope textual.
- O modal local continua funcionando com `Sim`, `Nao` e `Cancelar`.
- `Sim` salva e prossegue.
- `Nao` descarta e prossegue.
- `Cancelar` mantem o usuario na Anamnese.
- `Procura...`, `Novo`, `Fechar`, `Sair`, navegacao entre pacientes e troca de questionario permanecem funcionais.
- Nao houve regressao global percebida.
- Nenhum codigo foi alterado nesta validacao.
- O novo documento e `docs/ficha_pessoal_anamnese_validacao_grava_integrado_remocao_controle_temporario.md`.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anamnese - Consolidacao pos persistencia B2 e integracao ao Grava

- Foi registrada a consolidacao documental da trilha da aba `Anamnese`.
- O estado funcional validado inclui paciente, combo `Questionario`, perguntas, `Sim` / `Nao` vertical, complemento, confirmacao local e persistencia B2.
- A integracao ao botao geral `Grava` foi confirmada como parte do fluxo concluido.
- O texto temporario `Persistencia B2 ativa.` nao permanece na UI.
- O botao temporario `Salvar anamnese` nao permanece na UI.
- A persistencia atual continua sendo B2 por envelope textual.
- Nao houve persistencia estruturada 1:1 EasyDental nesta trilha.
- Nao houve backend novo, banco novo, migration nova ou endpoint novo.
- As pendencias futuras permanecem apenas como possibilidades futuras, com contrato proprio se um dia forem necessarias.
- A recomendacao registrada e considerar a aba `Anamnese` concluida nesta fase, salvo bugs encontrados em teste futuro.
- O novo documento e `docs/ficha_pessoal_anamnese_consolidacao_pos_persistencia_b2_grava.md`.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anamnese - Adendo de reabertura da comunicacao com o modulo Anamnese

- Foi registrado que a consolidacao anterior da Anamnese era parcial/prematura.
- A aba `Anamnese` continua aberta para tratar a comunicacao entre o modulo/configuracao e o uso clinico na `Ficha Pessoal`.
- Visual, confirmacao local, persistencia B2 e integracao ao `Grava` continuam validados.
- O diagnostico documental identificou a tela de configuracao em `frontend/app.js`, o namespace passivo `frontend/js/modules/anamnese.js`, o modulo clinico em `frontend/js/modules/ficha-pessoal-aba-anamnese.js` e os endpoints da familia `/anamnese`.
- A decisao recomendada ficou em `FICHA-ANAM-COMUNIC-B`.
- Nao houve alteracao de codigo nesta etapa.
- O novo documento e `docs/ficha_pessoal_anamnese_adendo_reabertura_comunicacao_modulo_anamnese.md`.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anamnese - Contrato manual EasyDental para o fluxo de configuracao e clinica

- Foi aberto o contrato especifico baseado nos pontos funcionais do manual EasyDental fornecidos pelo usuario.
- O PDF do manual nao estava acessivel localmente nesta sessao, entao a analise foi montada a partir dos pontos funcionais informados e do acervo local do projeto.
- O foco da leitura passou do refresh geral entre modulos para o contrato funcional entre configuracao e uso clinico da Anamnese.
- O modulo de configuracao foi mapeado em `frontend/app.js` e `frontend/js/modules/anamnese.js`, com CRUD de questionarios e perguntas, copia entre questionarios e renumeracao.
- A aba clinica foi mapeada em `frontend/js/modules/ficha-pessoal-aba-anamnese.js`, com questionarios, perguntas e respostas por paciente/questionario/pergunta.
- O backend possui `AnamneseQuestionario`, `AnamnesePergunta` e `AnamneseResposta`, com `tipo_pergunta`, `tipo_resposta` e `mensagem_alerta` disponiveis no modelo de perguntas.
- O Brana Cloud atual ainda nao comprovou uso clinico completo de `tipo_resposta`, `mensagem_alerta`, impressao em branco e equivalencia visual 1:1 com o legado EasyDental.
- O seed `Principal` existe, mas a versao validada atual possui 17 perguntas; a variante de 35 perguntas continua em analise documental.
- A decisao recomendada ficou em `FICHA-ANAM-MANUAL-B`, como proximo ajuste seguro para respeitar `tipo_resposta` na aba clinica antes de evolucoes maiores.
- O novo documento e `docs/ficha_pessoal_anamnese_contrato_manual_easydental_fluxo_configuracao_clinica.md`.
- Nenhum codigo, backend, banco, payload, `requestJson` ou formato de salvamento foi alterado nesta etapa documental.
- A blindagem textual/mojibake foi respeitada.

## Ficha pessoal - Anamnese - Implementacao do respeito a tipo_resposta conforme manual EasyDental

- Foi implementado o respeito a `tipo_resposta` na aba clinica da Anamnese.
- Os valores reais confirmados para `tipo_resposta` foram `1`, `2` e `3`.
- A semantica observada nos artefatos de descoberta foi `1 = Sim/Nï¿½o`, `2 = Sim/Nï¿½o/Texto` e `3 = Texto`.
- Perguntas `Sim/Nï¿½o` passaram a exibir apenas `Sim` e `Nao`, sem campo complementar editavel.
- Perguntas `Sim/Nï¿½o/Texto` passaram a exibir `Sim`, `Nao` e campo de texto.
- Perguntas `Texto` passaram a exibir apenas campo de texto, sem `Sim`/`Nao` aplicavel.
- O envelope B2 foi preservado e continua sendo JSON stringificado no campo textual da resposta.
- Respostas antigas continuam sendo carregadas e compatibilizadas.
- O botao geral `Grava` continua salvando a Anamnese.
- O modal continua funcionando com `Sim`, `Nao` e `Cancelar`.
- `tipo_pergunta` critica, `mensagem_alerta`, Preferencias/Odontograma, seed `Principal` e impressao de questionario em branco nao foram alterados nesta etapa.
- Nenhum backend, banco, schema, migration ou endpoint novo foi criado.
- O novo documento e `docs/ficha_pessoal_anamnese_implementacao_tipo_resposta_manual_b.md`.
- A blindagem textual/mojibake foi respeitada.

## Anamnese - Auditoria de migracao EasyDental para a Clinica 1

- Foi executada uma auditoria documental somente leitura para avaliar a seguranca de migracao dos dados preenchidos de Anamnese do EasyDental para a clinica 1 do Brana Cloud.
- A fonte legada `\\Dell_servidor\\c\\EDS70` foi acessada em modo somente leitura.
- A base atual do Brana Cloud foi consultada em modo somente leitura, com foco na clinica 1 e no usuario/paciente `gleissontel@gmail.com`.
- O paciente localizado no Brana foi `Gleisson Tel`, com correspondencia documental aceitavel com os dados de origem.
- Os questionarios atuais da clinica 1 sao `Principal`, `Implante`, `Ficha complementar`, `Anamnese de Saude` e `Anamnese pessoal`.
- O total atual no Brana e de `5` questionarios, `112` perguntas e `15` respostas salvas.
- O legado EDS70 apresenta o mesmo conjunto conceitual de questionarios, porem com volume historico muito maior de respostas brutas.
- A estrutura atual do Brana esta pronta para receber dados, mas a migracao automatica completa do historico ainda nao e segura sem um dry-run fechado por paciente/questionario/pergunta.
- A decisao recomendada ficou em `ANAM-MIG-C`.
- O novo documento de auditoria e `docs/anamnese_easy_dell_servidor_auditoria_migracao_clinica_1.md`.
- Nenhum codigo, backend, banco, schema, migration, endpoint, payload ou formato de salvamento foi alterado nesta etapa documental.

## Anamnese - Adendo de dry-run populacional clinica 1

- Foi registrada a correcao de rota da auditoria populacional: Gleisson Tel nao e a referencia de migracao do EasyDental legado.
- A fonte legada `\Dell_servidor\c\EDS70` foi usada apenas em leitura para inventariar todos os pacientes com anamnese preenchida.
- A comparacao com a clinica ID 1 do Brana Cloud confirmou `5` questionarios, `112` perguntas, `15` respostas salvas e `1` paciente com respostas atuais.
- O legado EDS70 contabilizou `1627` pacientes, `305` pacientes com anamnese preenchida, `16102` respostas brutas e `1875` complementos.
- O matching populacional ficou em `304` `MATCH_ALTO`, `0` `MATCH_MEDIO`, `0` `MATCH_BAIXO`, `1` `SEM_MATCH` e `0` `DUPLICADO/CONFLITO`.
- O novo documento de auditoria e `docs/anamnese_easy_dell_servidor_adendo_dry_run_populacional_clinica_1.md`.
- A decisao recomendada ficou em `ANAM-MIG-POP-B`.
- Nao houve escrita, migracao, backend, banco, schema, endpoint ou payload novo nesta etapa documental.


## Anamnese - Revisao do dry-run populacional do questionario Principal antes da migracao

- Foi revisado o pacote de auditoria populacional da Anamnese EasyDental (CSV/JSON) antes de qualquer migracao real.
- A fonte legada `\Dell_servidor\c\EDS70` permanece como referencia somente leitura.
- O problema estrutural esta concentrado no questionario Principal: o Brana tem 17 perguntas e o legado tem 35.
- As perguntas 18 a 35 possuem 18 respostas candidatas, todas com alerta preenchido, e pertencem a 1 unico paciente legada.
- Os outros quatro questionarios (`Implante`, `Ficha complementar`, `Anamnese de Saude`, `Anamnese pessoal`) estao estruturalmente completos no Brana.
- A decisao recomendada ficou em `ANAM-MIG-STRUCT-B`.
- Nenhuma migracao foi executada e nenhum backend, banco, schema, endpoint ou payload novo foi alterado nesta etapa documental.
- O novo documento de revisao e `docs/anamnese_easy_dell_servidor_revisao_dry_run_principal_antes_migracao.md`.
- Os relat?rios auxiliares criados foram `docs/anamnese_easy_dell_servidor_principal_perguntas_faltantes.csv` e `docs/anamnese_easy_dell_servidor_principal_respostas_perguntas_faltantes.csv`.


## Anamnese - Contrato estrutural do questionario Principal na clinica 1

- Foi aberto o contrato estrutural para completar o Principal atual da clinica 1 com as 18 perguntas faltantes do legado.
- A revisao confirmou que as 17 perguntas atuais devem ser preservadas integralmente.
- As perguntas 18 a 35 podem ser acrescentadas sem renumerar as existentes, preservando a ordem 1..35.
- Nao houve divergencia grave nas perguntas 1..17 que obrigue ajustes antes do acrescimo estrutural.
- A decisao recomendada ficou em `ANAM-MIG-STRUCT-B1`.
- Nenhuma migracao de respostas foi executada nesta etapa documental.
- O novo documento de contrato e `docs/anamnese_easy_dell_servidor_contrato_estrutural_principal_clinica_1.md`.

## Anamnese - Implementacao estrutural do Principal na clinica 1

- A expansao controlada do `Principal` da clinica 1 foi executada por script dedicado em modo validado.
- As 17 perguntas originais foram preservadas integralmente.
- As perguntas 18 a 35 foram adicionadas sem renumeracao e sem alterar os outros questionarios.
- Nenhuma resposta foi migrada nesta etapa.
- O `Principal` da clinica 1 passou de 17 para 35 perguntas.
- O novo documento de implementacao e `docs/anamnese_easy_dell_servidor_implementacao_estrutural_principal_clinica_1.md`.

## Anamnese - Validacao estrutural do Principal na clinica 1

- A expansao estrutural do `Principal` da clinica 1 foi validada manualmente pelo usuario.
- O resultado informado foi `teste passou`.
- O `Principal` da clinica 1 foi confirmado com 35 perguntas.
- As perguntas 1..17 foram preservadas.
- As perguntas 18..35 permanecem presentes e na ordem correta.
- A aba `Anamnese` continua carregando sem erro.
- O botao `Grava` continua funcionando.
- Nenhuma resposta antiga foi apagada.
- Nenhuma migracao de respostas foi executada nesta validacao.
- A proxima pendencia logica e um dry-run somente leitura das respostas do `Principal` com a estrutura agora completa.
- O novo documento de validacao e `docs/anamnese_easy_dell_servidor_validacao_estrutural_principal_clinica_1.md`.

## Anamnese - Dry-run das respostas do Principal apos estrutura completa

- O dry-run somente leitura das respostas do `Principal` foi executado com a estrutura completa da clinica 1.
- O legado concentrou respostas do `Principal` em 1 paciente.
- O total de respostas candidatas do `Principal` no legado foi 35.
- O destino estrutural no Brana ficou completo para as 35 respostas.
- Nao houve conflitos com as 15 respostas atuais do Brana.
- Nenhuma migracao foi executada nesta etapa.
- A decisao recomendada ficou em `ANAM-MIG-PRINC-DRY-B`.
- O novo documento de dry-run e `docs/anamnese_easy_dell_servidor_dry_run_respostas_principal_pos_estrutura.md`.

## Anamnese - Contrato de escrita assistida do Principal na clinica 1

- O contrato de escrita assistida do `Principal` foi aberto para a clinica 1.
- O escopo ficou restrito ao paciente legado `Joon Yun Lee Lee` e ao paciente Brana correspondente.
- A regra de nao sobrescrita foi registrada.
- O modo padrao foi definido como dry-run, com execute apenas explicito.
- A decisao recomendada ficou em `ANAM-MIG-PRINC-WRITE-B`.
- Nenhuma escrita foi executada nesta etapa.
- O novo documento de contrato e `docs/anamnese_easy_dell_servidor_contrato_escrita_assistida_principal_clinica_1.md`.

## Anamnese - Implementacao do runner assistido do Principal na clinica 1

- Foi implementado o runner controlado `backend/scripts/runner_anamnese_principal_clinica1_write_assisted.py`.
- O runner manteve `dry-run` como modo padrao e exigiu `--execute` apenas como via futura.
- O dry-run confirmou `Principal` com 35 perguntas, paciente alvo inequivoco e 0 conflitos para o paciente `273`.
- O runner criou snapshot de backup em `backups_modularizacao/fase_2c/anamnese_principal_write_assisted_runner_clinica_1/`.
- Nenhuma escrita real foi executada nesta etapa.
- O novo documento de implementacao e `docs/anamnese_easy_dell_servidor_implementacao_runner_escrita_assistida_principal_clinica_1.md`.

## Anamnese - Execucao assistida do Principal na clinica 1

- A execucao real controlada do runner assistido do `Principal` na clinica 1 foi concluida com sucesso.
- O dry-run imediatamente anterior a execucao permaneceu limpo, com `35` respostas planejadas e `0` conflitos.
- O backup timestampado previo a execucao foi criado em `backups_modularizacao/fase_2c/anamnese_principal_write_assisted_runner_clinica_1/execucao_real_20260601_112610`.
- A escrita real gravou `35` respostas para o paciente `273` / `Joon Yun Lee Lee`, com ids `18..52`.
- Nenhuma resposta antiga foi sobrescrita e nenhum outro questionario foi alterado.
- O novo documento de execucao e `docs/anamnese_easy_dell_servidor_execucao_assistida_principal_clinica_1.md`.

## Anamnese - Validacao pos-execucao assistida do Principal na clinica 1

- A validacao manual pos-execucao da migracao assistida do `Principal` foi aprovada pelo usuario.
- O usuario confirmou que `todos testes passaram`.
- As respostas migradas aparecem carregadas na aba `Anamnese`.
- O paciente `Joon Yun Lee Lee` ficou com o `Principal` preenchido.
- O botao `Grava` continua funcionando.
- A aba continua navegavel e sem regressao visual/global percebida.
- Nenhuma nova escrita foi executada nesta validacao.
- O novo documento de validacao e `docs/anamnese_easy_dell_servidor_validacao_execucao_assistida_principal_clinica_1.md`.

## Anamnese - Auditoria da regra de pergunta critica e icone de alerta no EasyDental

- Foi confirmada em leitura somente a existencia da regra de pergunta critica na Anamnese do EasyDental legado.
- A tabela `ANAMNESE_PERG` contem `TIPPER`, `TIPRES` e `TEXMEN`, suficientes para descrever a criticidade, o tipo de resposta e a mensagem de alerta.
- A regra observada ficou em `TIPPER = 1` nao critica, `TIPPER = 2` critica para resposta afirmativa e `TIPPER = 3` critica para resposta negativa.
- O legado possui recursos de alerta para a Anamnese, incluindo `ico_dedo.bmp`, `ico_dedoanamnese.bmp` e `ico_alert.bmp`.
- A rotina visual exata de exibicao do icone nao foi localizada em fonte legivel acessivel, entao a conclusao ficou restrita ao lastro em dados e recursos.
- O Brana Cloud ja possui campos analogos para `tipo_pergunta`, `tipo_resposta` e `mensagem_alerta`, mas a equivalencia visual completa do icone ainda permanece como frente de comparacao futura.
- O novo documento de auditoria e `docs/anamnese_easydental_auditoria_regra_pergunta_critica_icone_alerta.md`.
- Nenhum codigo, banco, backend, schema, endpoint, payload ou arquivo do EasyDental foi alterado nesta etapa documental.

## Anamnese - Auditoria comparativa da regra critica e icone de alerta no Brana

- A aba clinica da Anamnese no Brana le `tipo_resposta` para montar a interface e serializar respostas, mas nao demonstrou usar `tipo_pergunta` como gatilho visual de alerta.
- A configuracao da Anamnese grava `tipo_pergunta`, `tipo_resposta` e `mensagem_alerta`, mas o fluxo clinico inspecionado nao mostrou exibicao de `mensagem_alerta`.
- O codigo da aba clinica nao mostrou binding direto para `assets/easy/ico_dedo.bmp` nem para outro icone de alerta.
- A aderencia ao legado ficou parcial: estrutura e persistencia existem, mas o comportamento visual critico ainda nao foi confirmado.
- O novo documento comparativo e `docs/anamnese_brana_auditoria_comparativa_regra_critica_icone_alerta.md`.
- Nenhum codigo, banco, backend, schema, endpoint, payload ou arquivo do EasyDental foi alterado nesta etapa documental.

## Anamnese - Contrato funcional do alerta visual por pergunta critica

- O contrato funcional do alerta visual foi aberto para definir quando o icone aparece, desaparece e como convive com `tipo_pergunta`, `tipo_resposta` e `mensagem_alerta`.
- A decisao recomendada ficou em `ANAM-ALERTA-VISUAL-A`.
- O icone prioritario definido no contrato e `assets/easy/ico_dedo.bmp`, com `ico_dedoanamnese.bmp` e `ico_alert.bmp` como recursos correlatos.
- O contrato define que o alerta visual e local por pergunta, em tempo real, sem impacto no envelope B2 e sem mensagem_alerta visivel nesta primeira etapa.
- O novo documento de contrato e `docs/anamnese_brana_contrato_funcional_alerta_visual_pergunta_critica.md`.
- Nenhum codigo, banco, backend, schema, endpoint, payload ou arquivo do EasyDental foi alterado nesta etapa documental.

## Anamnese - Implementacao do alerta visual por pergunta critica

- O alerta visual por pergunta critica foi implementado na aba clinica da Anamnese com base no contrato `ANAM-ALERTA-VISUAL-A`.
- O icone prioritario usado foi `assets/easy/ico_dedo.bmp`.
- A reacao e em tempo real, por pergunta individual, conforme a resposta marcada pelo usuario.
- `TIPPER = 1` nao mostra icone; `TIPPER = 2` mostra quando a resposta e `sim`; `TIPPER = 3` mostra quando a resposta e `nao`.
- `mensagem_alerta` nao foi exibida nesta etapa e a persistencia B2 nao foi alterada.
- O novo documento de implementacao e `docs/anamnese_brana_implementacao_alerta_visual_pergunta_critica.md`.
- Nenhum codigo, banco, backend, schema, endpoint ou payload novo foi alterado fora do modulo da aba clinica nesta etapa.

## Anamnese - Correcao visual do alerta critico

- O teste manual apontou dois problemas visuais no alerta critico: posicao errada do icone e asset generico sendo exibido no lugar do dedo.
- A correcao reposicionou o alerta para antes do numero da pergunta, alinhado ao comportamento esperado do EasyDental.
- A correcao ajustou o `src` do alerta para o asset correto do projeto, `assets/easy/ico_dedo.bmp`, servido pela rota de desktop assets.
- A correcao tambem reordenou o markup do card para garantir que o alerta apareca visualmente antes do numero da pergunta.
- A logica critica permanece intacta: `TIPPER = 1` sem alerta, `TIPPER = 2` com alerta ao responder `sim`, `TIPPER = 3` com alerta ao responder `nao`.
- `mensagem_alerta`, envelope B2 e persistencia nao foram alterados nesta correcao.
- O novo documento de correcao e `docs/anamnese_brana_correcao_visual_alerta_pergunta_critica_posicao_asset.md`.

## Anamnese - Validacao manual do ajuste fino visual do icone critico

- A validacao manual informou que o teste passou.
- O icone ficou antes do numero da pergunta, com asset correto e alinhamento visual adequado.
- A logica critica permaneceu funcionando e nao houve regressao visual/global percebida.
- O botao `Grava` continua funcionando e `mensagem_alerta` continua nao exibida nesta fase.
- Nenhuma alteracao funcional adicional foi feita nesta validacao.
- O novo documento de validacao e `docs/anamnese_brana_validacao_correcao_fina_alerta_icone_alinhamento.md`.

## Ficha Pessoal - Historico

- Foi aberta a nova frente Ficha Pessoal / Historico.
- A classificacao do modulo foi registrada como comum/core.
- A referencia funcional foi baseada no EasyDental, com foco em botï¿½es, grade, navegaï¿½ï¿½o por teclado, propriedades da linha e integraï¿½ï¿½o com `Grava`.
- A auditoria inicial concluiu que a aba Historico hoje estï¿½ montada em `frontend/app.js`, sem mï¿½dulo prï¿½prio ainda, e sem persistï¿½ncia dedicada identificada.
- O plano seguro de subetapas foi registrado, prevendo futura modularizaï¿½ï¿½o em `frontend/js/modules/ficha-pessoal-aba-historico.js`.
- A etapa documental nï¿½o alterou cï¿½digo nem banco.
- A Etapa 1 - modularizacao passiva inicial foi concluida com o novo modulo `frontend/js/modules/ficha-pessoal-aba-historico.js`.
- O comportamento atual da aba foi preservado, sem persistencia nova e sem alteracao de banco.
- O carregamento do modulo foi incluï¿½do no frontend e a ponte compatï¿½vel foi mantida em `frontend/app.js`.
- Proxima etapa sugerida: ajuste visual e revisao dos botoes ou selecao/linha ativa, conforme o resultado tecnico encontrado.
- A Etapa 2 - ajuste visual e revisao dos botoes foi iniciada com refinamento da toolbar, grade e rotulos visuais em `frontend/js/modules/ficha-pessoal-aba-historico.js`.
- A interface da aba Historico foi aproximada ao padrao EasyDental sem persistencia nova, sem atalhos TAB/ENTER/ESC e sem propriedades funcionais ainda.
- Proxima etapa sugerida: selecao/linha ativa.
- A Etapa 3 - selecao / linha ativa foi iniciada com estado local, destaque visual e helper de linha selecionada em `frontend/js/modules/ficha-pessoal-aba-historico.js`.
- A grade da aba Historico passou a aceitar selecao por clique sem persistencia nova e sem alterar backend ou HTML de carregamento.
- Proxima etapa sugerida: Inserir linha.
- A Etapa 4 - inserir linha foi iniciada com criacao local de nova linha na grade, insercao abaixo da linha ativa quando houver selecao e foco local na primeira celula.
- A nova linha nasce com data atual padrao e fica selecionada sem persistencia nova, sem TAB/ENTER/ESC e sem integracao com Grava.
- Proxima etapa sugerida: navegacao por TAB ou preparacao de edicao local, conforme o resultado tecnico encontrado.
- A Etapa 5 - navegacao por TAB foi iniciada com foco local na grade do Historico e percurso entre Data, Cirurgiao, Regiao e Descricao do procedimento.
- O `Shift+Tab` tambem foi suportado de forma local e a navegacao permaneceu sem persistencia nova, sem ENTER/ESC e sem integracao com Grava.
- Proxima etapa sugerida: ENTER/ESC.
- A Etapa 6 - ENTER / ESC foi iniciada com confirmacao local da linha ativa e cancelamento local sem persistencia nova.
- O `ENTER` passa a confirmar a linha e abre nova linha abaixo de forma local quando seguro; o `ESC` cancela a linha em rascunho ou reverte a edicao local com snapshot conservador.
- Proxima etapa sugerida: integracao com Grava.
- A Etapa 7 - integracao com Grava foi implementada usando o envelope ja existente `extra` / `source_payload`, com serializacao local do Historico em `extra.historico_aba`.
- Nao houve alteracao de backend, banco, schema, endpoints ou models; o paciente continua gravando pelo fluxo atual e agora recebe e reaplica o Historico sem criar caminho novo.
- A Etapa 8 - edita linha foi iniciada com foco local na linha selecionada e reaproveitamento da infraestrutura de edicao ja existente.
- O botao `Edita linha` agora abre a linha selecionada para edicao local sem backend novo, sem banco novo e sem quebrar o fluxo de `ENTER` / `ESC` ou o envelope `extra.historico_aba`.
- A Etapa 9 - elimina linha foi iniciada com remocao local da linha selecionada e reencaixe estavel da selecao remanescente.
- O botao `Elimina linha` agora remove a linha ativa da grade e permanece compativel com a persistencia via `extra.historico_aba`.
- A Etapa 10 - propriedades da linha foi implementada de forma funcional e conservadora sobre a linha selecionada, usando uma janela modal local.
- Os campos efetivamente suportados nesta etapa sao `Data`, `Cirurgiao`, `Regiao` e `Historico / Descricao`; `Cor de fundo`, `Data de insercao` e `Data de atualizacao` ficaram apenas documentados como pendentes.
- A janela continua compativel com a persistencia via `extra.historico_aba` e nao exigiu alteracao de backend ou banco.
- Proxima etapa sugerida: validacao final manual.

## Ficha Pessoal - Historico - Auditoria comparativa EasyDental x Brana Cloud

- Foi aberta uma nova frente documental para auditoria comparativa detalhada entre EasyDental real e Brana Cloud na aba Historico.
- O escopo desta fase e exclusivamente documental e investigativo, sem alteracao de codigo, backend ou banco.
- As fontes de verdade registradas sao `\\Dell_servidor\\c\\EDS70` e `D:\\BRANA ARQUIVOS\\PROJETO_PRECIFICACAO_LEGADO\\Dados`.
- A auditoria cobre camadas visuais, de interacao, de regra funcional, de origem de dados, de persistencia e de dependencias cruzadas.
- A nova documentacao de contrato e `docs/ficha_pessoal_historico_auditoria_comparativa_contrato.md`.
- Proxima etapa sugerida: engenharia reversa do EasyDental.

## Ficha Pessoal - Historico - Engenharia reversa do EasyDental

- Foi aberta a frente documental de engenharia reversa tecnica da aba Historico no EasyDental legado.
- A leitura foi feita somente em fontes de consulta, sem alteracao de Brana Cloud, sem backend, sem banco e sem frontend.
- O nucleo confirmado da modelagem e a tabela `HISTORICO`, com relacao ao paciente em `PESSOAL`, ao tratamento em `INTERVENCAO`, ao profissional em `PRESTADOR` e a auditoria em `USER_STAMP_*` / `TIME_STAMP_*`.
- O mapeamento tecnico mais provavel ficou alinhado com `Data`, `Cirurgiao`, `Regiao` e `Descricao`.
- Campos de metadados como `Cor de fundo`, `Data de insercao` e `Data de atualizacao` ficaram classificados como hipotese de exposicao na janela de propriedades.
- A nova documentacao de engenharia reversa e `docs/ficha_pessoal_historico_easydental_engenharia_reversa.md`.
- Proxima etapa sugerida: comparacao funcional detalhada EasyDental x Brana Cloud para fechar a equivalencia de tela, teclado e propriedades.

## Ficha Pessoal - Historico - Comparativo detalhado EasyDental x Brana Cloud

- Foi aberta a frente documental de comparacao funcional detalhada entre EasyDental e Brana Cloud para a aba Historico.
- A comparacao cruza o contrato da auditoria, a engenharia reversa tecnica do legado e o estado atual ja implementado no Brana Cloud.
- O documento novo e `docs/ficha_pessoal_historico_easydental_vs_brana_comparativo_detalhado.md`.
- O comparativo organiza diferencas por camada visual, interacao, regra funcional, origem dos dados, persistencia e dependencias cruzadas.
- Cada diferenca foi classificada por impacto, tipo e evidencia, com sugestao de tratamento futuro.
- A conclusao preliminar e que o Brana ja reproduz o fluxo pratico principal, mas ainda diverge de forma relevante na persistencia relacional e na dependencia estrutural com `INTERVENCAO`.
- Proxima etapa sugerida: priorizacao das diferencas.

## Ficha Pessoal - Historico - Priorizacao de diferencas e backlog conservador

- Foi aberta a frente documental de priorizacao das diferencas da aba Historico.
- O objetivo e transformar a auditoria e o comparativo em backlog conservador, sem implementar correcoes nesta etapa.
- O documento novo e `docs/ficha_pessoal_historico_priorizacao_diferencas_backlog.md`.
- As diferencas foram separadas em quatro categorias: microajuste imediato, ajuste funcional de medio risco, dependente de observacao pratica adicional e estrutural/futura.
- A primeira microetapa recomendada foi definida como harmonizacao textual visual da grade, com foco no cabecalho final e nos rï¿½tulos da toolbar.
- As diferencas estruturais foram mantidas fora da trilha de ajuste fino.
- Proxima etapa sugerida: execucao da primeira microetapa de correcao real, quando autorizada.

## Ficha Pessoal - Historico - Microetapa 1 - harmonizacao textual visual

- A microetapa 1 foi iniciada com ajustes textuais/visuais de baixissimo risco na aba Historico.
- O cabeï¿½alho final da grade foi harmonizado de `Descricao do procedimento` para `Descricao`.
- Os rï¿½tulos da toolbar foram harmonizados de `Edita linha` para `Editar linha` e de `Elimina linha` para `Excluir linha`.
- Nao houve alteracao funcional.
- Nao houve alteracao de backend ou banco.
- O novo documento e `docs/ficha_pessoal_historico_microetapa_1_harmonizacao_textual_visual.md`.
- Proxima microetapa sugerida: refinamento visual leve do modal de `Propriedades da linha`, se ainda fizer sentido, ou inicio da analise dos ajustes funcionais de medio risco.

## Ficha Pessoal - Historico - Microetapa 2 - refino visual leve do modal de Propriedades da linha

- A microetapa 2 foi iniciada com refinamento visual leve do modal de `Propriedades da linha`.
- Houve ajuste de leitura no texto de apoio do cabecalho, no agrupamento interno e no bloco de aviso do modal.
- Nao houve alteracao funcional.
- Nao houve alteracao de backend ou banco.
- O novo documento e `docs/ficha_pessoal_historico_microetapa_2_refino_visual_modal_propriedades.md`.
- Proxima microetapa sugerida: iniciar a analise e, se autorizado, a execucao do primeiro ajuste funcional de medio risco.

## Ficha Pessoal - Historico - Microetapa 3 - auditoria curta de Cirurgiao e Regiao

- A microetapa 3 foi executada como auditoria curta e documental dos campos `Cirurgiao` e `Regiao`.
- Os campos permanecem hoje como texto local na grade, na edicao inline, no modal de propriedades e na serializacao via `extra.historico_aba`.
- Nao houve alteracao funcional, salvo excecao documentada inexistente nesta rodada.
- Nao houve alteracao de backend ou banco.
- O novo documento e `docs/ficha_pessoal_historico_microetapa_3_cirurgiao_regiao_auditoria.md`.
- O menor proximo passo seguro definido e criar um contrato local de origem para `Cirurgiao` e `Regiao` antes de qualquer combo, lookup ou integracao externa.

## Ficha Pessoal - Historico - Microetapa 4 - contrato local de origem para Cirurgiao e Regiao

- A microetapa 4 foi executada com contrato local de origem para `Cirurgiao` e `Regiao` no proprio modulo da aba Historico.
- Os campos continuam textuais e locais nesta etapa.
- Nao houve alteracao funcional.
- Nao houve alteracao de backend ou banco.
- O novo documento e `docs/ficha_pessoal_historico_microetapa_4_contrato_local_origem_cirurgiao_regiao.md`.
- A proxima microetapa sugerida e avaliar se vale introduzir uma sugestao ou lista local nao vinculante, ou manter os campos textuais por enquanto.

## Ficha Pessoal - Historico - Microetapa 5 - avaliacao de sugestao local nao vinculante para Cirurgiao e Regiao

- A microetapa 5 foi executada como avaliacao documental da eventual sugestao ou lista local nao vinculante para `Cirurgiao` e `Regiao`.
- Nao houve alteracao funcional.
- Nao houve alteracao de backend ou banco.
- A recomendacao final registrada e manter os campos textuais por enquanto.
- O novo documento e `docs/ficha_pessoal_historico_microetapa_5_avaliacao_sugestao_local_cirurgiao_regiao.md`.
- O menor proximo passo seguro, caso surja nova evidencia, e reavaliar uma sugestao local opcional e nao vinculante sem transformar os campos em combo obrigatorio.

## Ficha Pessoal - Historico - Microetapa 6 - reclassificacao funcional de Cirurgiao, Regiao e dependencias externas

- A microetapa 6 foi executada como reclassificacao funcional de `Cirurgiao`, `Regiao` e dependencias externas da aba Historico.
- `Cirurgiao` foi formalmente reclassificado como campo ligado ao executante do procedimento no alvo final.
- `Regiao` permaneceu dependente de nova evidencia ou de modulo externo ainda nao fechado no Brana.
- As dependencias que exigirao novo ciclo foram registradas como prestador/executante e possivel estrutura odontologica/regra clinica para Regiao.
- Nao houve alteracao funcional.
- Nao houve alteracao de backend ou banco.
- O novo documento e `docs/ficha_pessoal_historico_microetapa_6_reclassificacao_funcional_dependencias.md`.
- A proxima subetapa recomendada e abrir uma frente de dependencia funcional para o executante do procedimento e para a regiao odontologica, se necessario.

## Ficha Pessoal - Historico - Microetapa 7 - confirmacao EasyDental de Cirurgiao, Regiao e dependencias

- A microetapa 7 foi executada como consolidacao documental da leitura do EasyDental real sobre `Cirurgiao responsavel`, `Regiao` e suas dependencias.
- O alvo funcional de `Cirurgiao responsavel` foi confirmado como prestador/executante, mas o auto-preenchimento, a origem do combo/lista e a editabilidade visual exata continuam sem prova acessivel nas fontes consultadas.
- `Regiao` permaneceu como dependencia funcional em aberto, com mapeamento tecnico forte para `NRODENTE`, mas sem confirmacao visual da origem do controle.
- As dependencias com paciente, intervencao e prestador ficaram consolidadas no documento novo.
- Nao houve alteracao funcional, nem alteracao de backend ou banco.
- O novo documento e `docs/ficha_pessoal_historico_microetapa_7_confirmacao_easydental_cirurgiao_regiao_dependencias.md`.
- A proxima subetapa recomendada e abrir uma frente de dependencia somente se o usuario trouxer nova evidencia visual ou um modulo de apoio para fechar o que ainda permanece em aberto.

## Ficha Pessoal - Historico - Dependencia do prestador/executante para Cirurgiao responsavel - auditoria Brana

- Foi aberta uma frente documental para auditar se o Brana ja possui base suficiente para sustentar `Cirurgiao responsavel` como campo funcional ligado ao executante/prestador da aba Historico.
- A auditoria confirmou que o Brana ja possui cadastro de prestadores, vinculo explicito usuario/prestador, contexto de sessao com `prestador_id` e default de cirurgiao em tratamento baseado no usuario logado.
- O modulo do Historico, porem, continua local/textual e ainda nao esta amarrado a essa base para auto-preencher ou fechar a equivalencia real do campo.
- O novo documento e `docs/ficha_pessoal_historico_dependencia_prestador_executante_auditoria_brana.md`.
- A conclusao objetiva e que a base existe, mas ainda falta um pequeno ciclo de apoio para ligar o Historico ao contexto de executante/prestador sem improviso.
- A proxima etapa recomendada e abrir esse ciclo de apoio somente se o usuario autorizar a integracao do Historico com o contexto de login/prestador ou com a logica de tratamento.

## Ficha Pessoal - Historico - Contrato de integracao de Cirurgiao responsavel com login/prestador

- Foi aberto o contrato funcional e tecnico da futura integracao do campo `Cirurgiao responsavel` da aba Historico com o contexto de login/prestador ja existente no Brana Cloud.
- A recomendacao final e usar `sessaoAtual.prestador_id` como default minimo seguro, manter o catalogo vindo de `GET /cadastros/prestadores`, preservar a edicao manual e nao misturar Regiao nem tratamento nesta primeira fase.
- O novo documento e `docs/ficha_pessoal_historico_contrato_integracao_cirurgiao_login_prestador.md`.
- A menor subetapa segura futura e um helper local e conservador na aba Historico que leia a sessao, preencha o prestador quando houver valor e reaplique o valor persistido no envelope atual.

## Ficha Pessoal - Historico - Implementacao minima de Cirurgiao responsavel com login/prestador
- A implementacao minima do `Cirurgiao responsavel` foi aplicada na aba `Historico` usando o contexto de sessao e o catalogo existente de prestadores.
- O default usa `sessaoAtual.prestador_id` quando existe, com reaplicacao segura ao reabrir o paciente.
- O modal passou a oferecer sugestao de catalogo sem perder a edicao manual do campo.
- A serializacao continua compativel com o envelope atual e ganhou apoio opcional por id/nome durante a transicao.
- `Regiao`, `Cor de fundo`, `Data de insercao` e `Data de atualizacao` ficaram fora desta fase.
- O novo documento e `docs/ficha_pessoal_historico_implementacao_minima_cirurgiao_login_prestador.md`.
- Proxima subetapa sugerida: validacao funcional/manual desta integracao minima antes de qualquer expansao para `Regiao` ou para regras de tratamento/intervencao.
- A proxima subetapa recomendada, apos este contrato, e a implementacao minima e auditavel dessa integracao, sem abrir ainda dependencia com Regiao.

## Ficha Pessoal - Historico - Contrato de refatoracao da tela Propriedades da linha
- Foi definido o contrato documental para separar a tela `Propriedades da linha` em um novo modulo de frontend, sem alterar comportamento nesta etapa.
- O modulo principal da aba Historico permanece como orquestrador da grade, da selecao de linha, da serializacao e da reaplicacao do envelope.
- A menor separacao equivalente no backend foi definida como um helper/service minimo de normalizacao do envelope do Historico, sem nova rota e sem superengenharia.
- A primeira refatoracao segura deve separar apenas a montagem e a edicao do modal, preservando a experiencia atual.
- `Regiao`, `Cor de fundo`, datas de auditoria e regra de tratamento/intervencao continuam fora desta primeira extracao.
- O novo documento e `docs/ficha_pessoal_historico_contrato_refatoracao_propriedades_da_linha.md`.
- A proxima subetapa sugerida e a extracao do modulo de Propriedades da linha no frontend, mantendo a mesma experiencia funcional.

## Ficha Pessoal - Historico - Refatoracao da tela Propriedades da linha
- A tela `Propriedades da linha` foi extraida para o modulo proprio `frontend/js/modules/ficha-pessoal-aba-historico-propriedades-da-linha.js`.
- O modulo principal da aba Historico ficou como orquestrador da grade, da linha selecionada e da serializacao/reaplicacao.
- Nao houve separacao equivalente adicional no backend nesta fase; a normalizacao segue no fluxo atual do envelope `source_payload` / `extra.historico_aba`.
- A refatoracao preservou o contrato funcional da tela e nao alterou persistencia estrutural.
- O novo documento e `docs/ficha_pessoal_historico_refatoracao_propriedades_da_linha_impl.md`.
- A proxima subetapa sugerida e validacao manual completa da tela refatorada antes de qualquer nova expansao.

## Ficha Pessoal - Historico - Ajuste visual exato da janela Propriedades do histï¿½rico
- A janela `Propriedades do histï¿½rico` foi ajustada para seguir a screenshot de referï¿½ncia com maior fidelidade visual.
- O titulo foi alinhado para `Propriedades do histï¿½rico`, com fechamento em botï¿½o vermelho no canto superior direito.
- Os campos `Data`, `Cirurgiï¿½o responsï¿½vel`, `Regiï¿½o` e `Cor de fundo` passaram a compor a linha superior no estilo do legado.
- A area central passou a exibir `Histï¿½rico` e os metadados `Data de inserï¿½ï¿½o` e `Data de atualizaï¿½ï¿½o` com destaque visual em ciano.
- Os botï¿½es inferiores passaram a seguir a assinatura `Ok` e `Cancela`.
- O novo documento e `docs/ficha_pessoal_historico_refino_visual_exato_modal_propriedades.md`.
- A proxima validaï¿½ï¿½o sugerida e comparar o modal diretamente com a screenshot de referencia no fluxo real da aba Historico.
## Ficha Pessoal - Historico - Correcao do combo Cirurgiao responsavel
- O campo `Cirurgiao responsavel` na janela `Propriedades do historico` passou a listar visualmente os prestadores da conta em um combo real.
- O comportamento de default por sessao, edicao e persistencia foi mantido.
- O novo documento e `docs/ficha_pessoal_historico_combo_cirurgiao_responsavel_prestadores.md`.
- A proxima subetapa sugerida e validacao manual do combo com a conta logada e, se necessario, ajuste fino de ordenacao/label dos prestadores.
## Ficha Pessoal - Historico - Correcao cirurgica do combo Cirurgiao responsavel
- O campo `Cirurgiao responsavel` da janela `Propriedades da linha` passou a usar combo nativo com lista visivel de prestadores da conta.
- A lista foi ordenada para ficar mais legivel e o valor legado continua preservado quando existir.
- O novo documento e `docs/ficha_pessoal_historico_correcao_cirurgiao_responsavel_combo_nativo.md`.
- A proxima subetapa sugerida e validacao manual do combo na conta real e, se necessario, pequeno ajuste fino de rotulo ou ordenacao.
## Ficha Pessoal - Historico - Correcao da grade para apelido e busca do combo por nome
- O baseline desta correcao foi congelado e salvo em `D:\BRANA ARQUIVOS\_backups_brana\historico\20260602_121520`.
- A grade da aba Historico passou a exibir o `apelido` do prestador na coluna `Cirurgiao`.
- A combo `Cirurgiao responsavel` passou a ordenar os prestadores por `nome`, manter inativos disponiveis e buscar por nome sem perder o valor legado.
- O novo documento e `docs/ficha_pessoal_historico_correcao_grade_apelido_combo_nome.md`.
- A proxima subetapa sugerida e validar manualmente o fluxo real da tela antes de mexer em `Regiao`, `Cor de fundo` ou na dependencia com `INTERVENCAO`.
## Ficha Pessoal - Historico - Trava da coluna Cirurgiao no duplo clique
- A coluna 2 `Cirurgiao` da grade foi travada para nao entrar em edicao por duplo clique.
- A selecao e o foco continuam possiveis, mas a celula permanece bloqueada para edicao.
- O novo documento e `docs/ficha_pessoal_historico_trava_coluna_cirurgiao_duplo_clique.md`.
- A proxima subetapa sugerida e validar manualmente a trava da coluna antes de mexer em `Regiao`.
## Ficha Pessoal - Historico - Selecao de linha inteira e edicao por duplo clique
- A grade da aba Historico passou a manter fundo branco e seleciona a linha inteira ao clicar.
- O duplo clique em uma celula agora inicia edicao na coluna, aproximando o comportamento do EasyDental.
- O novo documento e `docs/ficha_pessoal_historico_selecao_linha_inteira_edicao_duplo_clique.md`.
- A proxima subetapa sugerida e validacao manual do comportamento de clique/duplo clique e, se necessario, pequeno ajuste fino de foco ou destaque visual.
## Ficha Pessoal - Historico - Remocao do quadro separado de descricao
- O quadro separado abaixo da grade, que exibia um textarea de detalhamento, foi removido da aba Historico.
- A tela passou a manter apenas a grade unica com fundo branco, e o rodape foi ajustado para `Ficha de histï¿½rico`.
- O novo documento e `docs/ficha_pessoal_historico_remocao_quadro_descricao_procedimento.md`.
- A proxima subetapa sugerida e conferir visualmente a equivalencia da grade e do rodape com o EasyDental antes de mexer em qualquer outra dependencia.
## Ficha Pessoal - Historico - Controle de linha unica e descricao obrigatoria
- A linha rascunho agora nasce sem texto automatico na coluna Historico.
- O comando `Inserir linha` nao cria novas linhas enquanto existir uma linha rascunho ativa.
- `Enter` e `Grava` validam a descricao obrigatoria e exibem a mensagem legada quando ela estiver vazia.
- O novo documento e `docs/ficha_pessoal_historico_controle_linha_unica_descricao_obrigatoria.md`.
- A proxima subetapa sugerida e validar manualmente o ciclo inserir -> editar -> Enter/Grava -> nova linha, sem acï¿½mulo de rascunhos.
## Ficha Pessoal - Historico - Trava de insercao consecutiva e alerta de descricao
- A primeira insercao continua permitida normalmente.
- A trava atua apenas quando ja existe uma linha rascunho ativa, bloqueando a criacao de uma nova linha consecutiva.
- Se a descricao obrigatoria estiver vazia, a tela exibe o alerta legada `Campo descriï¿½ï¿½o do procedimento nï¿½o pode ser nulo.`
- O novo documento e `docs/ficha_pessoal_historico_trava_insercao_consecutiva_e_alerta_descricao.md`.
- A proxima subetapa sugerida e validar manualmente que a primeira linha insere, a segunda consecutiva bloqueia e o `Enter`/`Grava` obedecem a mesma regra.
## Ficha Pessoal - Historico - Ordenacao por data com linha rascunho no final
- A insercao de nova linha passou a ocorrer sempre no fim da tabela.
- A ordenacao da lista agora e reavaliada por data ao confirmar a linha e ao serializar a ficha.
- A linha rascunho permanece por ultimo e o criterio de desempate usa a ordem original do registro.
- O novo documento e `docs/ficha_pessoal_historico_ordenacao_por_data_estavel.md`.
- A proxima validacao sugerida e confirmar manualmente que a linha salva com data passada retorna para a posicao correta sem permitir insercao entre outras linhas.
## Odontograma EasyDental - Auditoria de armazenamento, estados e cores
- Inicio da trilha de auditoria do odontograma EasyDental em uso.
- Mï¿½dulo classificado como especï¿½fico de Odontologia, fora do core comum.
- Objetivo: mapear armazenamento, estados, cores e tabelas participantes.
- Etapa somente leitura; nenhum cï¿½digo, banco ou arquivo do EasyDental foi alterado.
- Documento de referï¿½ncia: `docs/odontograma_easydental_auditoria_armazenamento_estados_cores_tabelas.md`.
## Odontograma EasyDental - Diagrama relacional e contrato inicial de modelagem Brana
- Consolidacao do diagrama relacional do odontograma EasyDental concluida em etapa somente documental.
- Contrato inicial de modelagem futura para o odontograma Brana registrado sem implementacao.
- Modulo classificado como especifico de Odontologia.
- Nenhum codigo alterado.
- Nenhum banco alterado.
- Documento de referï¿½ncia: `docs/odontograma_easydental_diagrama_relacional_contrato_modelagem_brana.md`.
## Odontograma EasyDental - Diagramas Mermaid revisaveis
- Conversao do contrato relacional consolidado em diagramas Mermaid para revisao visual.
- Etapa somente documental, sem implementacao.
- Modulo classificado como especifico de Odontologia.
- Nenhum codigo alterado.
- Nenhum banco alterado.
- Documento de referï¿½ncia: `docs/odontograma_easydental_diagramas_mermaid.md`.
## Odontograma Brana - Contrato futuro de modelagem
- Criacao do contrato inicial de modelagem futura do odontograma Brana.
- Base em auditoria EasyDental, diagrama relacional e diagramas Mermaid.
- Modulo classificado como especifico de Odontologia.
- Etapa somente documental, sem implementacao.
- Nenhum codigo alterado.
- Nenhum banco alterado.
- Sem migration, endpoint ou UI.
- Proxima etapa futura recomendada: validar `DENTE`/`FACE` e status de `INTERVENCAO` antes de codificar.
## Odontograma EasyDental - Validacao de DENTE, FACE e _STATUS_INTERV
- Validacao documental de `DENTE`, `FACE` e `_STATUS_INTERV` no EasyDental em uso.
- Fechamento parcial das cardinalidades do odontograma.
- Etapa somente leitura.
- Modulo classificado como especifico de Odontologia.
- Nenhum codigo alterado.
- Nenhum banco alterado.
- Futura implementacao deve seguir padrao modularizado no backend e frontend, evitando monolitos.
## Odontograma Brana - Contrato minimo de implementacao modular
- Criacao do contrato minimo de implementacao modular do odontograma Brana.
- Reforco explicito de modularizacao futura no backend e frontend.
- Etapa somente documental.
- Modulo especifico de Odontologia.
- Nenhum codigo alterado.
- Nenhum banco alterado.
- Nenhuma migration, endpoint ou tela criada.
- Proxima trilha futura: eventual contrato tecnico final antes da primeira implementacao.
## Odontograma Brana - Contrato tecnico final da V1
- Criacao do contrato tecnico final da V1 do odontograma Brana.
- Definicao de payloads minimos e leituras minimas.
- Reforco da implementacao modular no backend e frontend.
- Etapa somente documental.
- Nenhum codigo alterado.
- Nenhum banco alterado.
- Nenhuma migration, endpoint ou tela criada.
- Proxima etapa futura sugerida: migration minima da V1.

## Odontograma Brana - Migration minima V1
- Inicio da subetapa tecnica do odontograma Brana com migration minima da V1.
- Estrutura persistente minima criada para arcada, intervencao, dente, face e status.
- Mantida a diretriz de modularizacao futura no backend e frontend.
- Sem frontend nesta etapa.
- Sem tela nesta etapa.
- Proxima subetapa sugerida: contratos, models e schemas backend de leitura.

## Odontograma Brana - Conferencia pos-migration V1
- Conferencia somente leitura da migration minima concluida no banco local.
- Tabelas, seed, FKs e indices da V1 validados documentalmente.
- Nenhuma alteracao em frontend, `frontend/app.js` ou telas.
- Proxima subetapa sugerida: contratos, models e schemas backend de leitura.

## Odontograma Brana - Contracts, models e schemas backend da V1
- Camada backend estrutural de leitura da V1 criada.
- Contracts, models e schemas do odontograma adicionados.
- Sem rotas nesta etapa.
- Sem frontend nesta etapa.
- Modularizacao preservada.
- Proxima subetapa sugerida: rotas backend de leitura.

## Odontograma Brana - Rotas backend de leitura da V1
- Rotas de leitura do odontograma V1 materializadas no backend.
- Modulos separados em route, service e repository minimo.
- Sem frontend nesta etapa.
- Sem escrita nesta etapa.
- Proxima subetapa sugerida: validacao tecnica das rotas e, depois, frontend bootstrap/api/estado/render base.

## Odontograma Brana - Validacao tecnica das rotas backend de leitura da V1
- Validacao local concluida com `200 OK` nas rotas de leitura do odontograma V1.
- JSON coerente com os schemas de leitura.
- Sem escrita no banco durante a validacao.
- Frontend e `app.js` mantidos intactos.
- Proxima subetapa sugerida: bootstrap, API, estado e render base do frontend do odontograma V1.

## Odontograma Brana - Fechamento tecnico das rotas backend de leitura da V1
- Fechamento correto da subetapa tecnica em commit seletivo.
- Arquivos backend da leitura do odontograma V1 consolidados.
- Validacao local confirmada com respostas `200 OK`.
- Sem frontend e sem escrita.
- Proxima subetapa sugerida: bootstrap, API, estado e render base do frontend do odontograma V1.

## Odontograma Brana - Shell odontologica modular da V1
- Shell visual principal do odontograma V1 separada em modulo proprio no frontend.
- `frontend/index.html` atualizado para carregar a moldura antes do fluxo principal.
- Modo de leitura preservado, sem escrita e sem tocar em `frontend/app.js`.
- Proxima subetapa sugerida: busca de paciente em modulo proprio mantendo a shell como base estavel da tela principal odontologica.

## Odontograma Brana - Busca de paciente modular da V1
- Campo de paciente do Odontograma V1 passou a consultar pacientes por texto e abrir o contexto atual.
- Pesquisa reaproveita o contrato da ficha principal e nao introduz escrita.
- `frontend/app.js` permanece fora da solucao do modulo.
- A busca foi ajustada para reagir enquanto o usuario digita, com debounce leve, mantendo Enter e botao como alternativas.
- O contï¿½iner visual do paciente foi liberado para altura auto, permitindo que os resultados aparecam abaixo da linha de busca.
- Proxima subetapa sugerida: contexto de tratamento em modulo proprio depois da busca de paciente.

- Odontograma V1: correcao do fluxo de abertura do paciente e da tela vazia inicial, com abertura explicita do paciente selecionado na busca.

## Odontograma Brana - Montagem da area principal da tela odontologica
- A area principal de workspace passou a servir como ponto de montagem da tela odontologica.
- O fluxo principal usa `workspace-empty` quando disponivel e cai para `main.workspace` apenas como fallback tecnico.
- A entrada secundaria por botao na Ficha Pessoal > Historico continua preservada.
- A origem `workspace-principal` foi adicionada ao contrato da tela odontologica.
- `frontend/app.js` e `frontend/index.html` permaneceram intactos.
- Nenhum backend, banco ou asset foi alterado.
- Documento de referï¿½ncia: `docs/easydental_tela_principal_odontologica_subetapa_d2a_montagem_area_principal.md`.
- Proxima etapa sugerida: D2-B, se a decisao for ligar a abertura principal ao fluxo real de inicializacao do sistema.

## Odontograma Brana - Bootstrap real da area principal
- O bootstrap real foi ligado em `frontend/app.js`, na funcao `carregarSessao()`, apos a validacao de sessao em `/me`.
- A tela odontologica passou a abrir automaticamente na area principal abaixo da toolbar/menu com `abrirTelaPrincipalOdontologicaNoWorkspace({ origem: "workspace-principal", modo: "visual-estatico" })`.
- A entrada secundaria do botao `Odontograma` foi corrigida para reutilizar a mesma area principal.
- Menus e toolbar foram preservados.
- O fallback antigo e a implementacao antiga foram preservados.
- Nenhum backend, banco ou asset foi alterado.
- Documento de referï¿½ncia: `docs/easydental_tela_principal_odontologica_subetapa_d2b_bootstrap_real_area_principal.md`.
- Proxima etapa sugerida: D2-C, refino de encaixe/layout da tela odontologica ja no workspace principal.


## Toolbar principal do Brana Cloude

- A primeira onda da toolbar principal foi implementada de forma isolada no frontend.
- A toolbar nova agora expï¿½e: Novo paciente, Menu de pacientes, Novo tratamento, Agenda e Conta corrente.
- O fallback da toolbar antiga foi preservado como estrategia de reversao.
- Falta fechar a validacao funcional completa em sessao autenticada no navegador do usuario antes de expandir para a segunda onda.
- O inventario de residuos antigos da toolbar foi registrado em `docs/inventario_remocao_toolbar_legado_brana_cloude.md` para orientar a limpeza por etapas.

## Planejamento do novo frontend

- Foi registrada a decisao de iniciar o planejamento do novo frontend do Brana Cloude em React + Vite + Ant Design.
- O frontend atual em `frontend\` segue preservado como base legada enquanto a migracao nao for validada.
- A proxima etapa recomendada e criar a pasta `frontend-react\` de forma isolada, com escopo pequeno e documentacao propria.

## Criacao inicial do frontend React

- A pasta isolada `frontend-react\` foi criada com esqueleto inicial em React + Vite + Ant Design.
- O frontend legado em `frontend\` segue preservado.
- A proxima etapa sugerida e validar a execucao local e depois criar a tela de login experimental ou um shell de navegacao mais completo.

## Validacao do shell visual inicial

- O shell visual inicial do `frontend-react\` foi refinado e validado.
- O frontend-react continua isolado do frontend legado.
- A proxima etapa sugerida e criar uma tela de login experimental sem autenticacao real ou preparar o contrato de integracao com o backend atual.

## Contrato de autenticacao do frontend-react

- O contrato de autenticacao do `frontend-react\` foi documentado.
- O login real ainda nao foi implementado no novo frontend.
- O frontend legado segue preservado como referencia.
- A proxima etapa sugerida e criar a tela visual de login experimental conforme o contrato documentado.

## Login visual experimental

- A tela visual de login experimental foi criada no `frontend-react\`.
- A autenticaï¿½ï¿½o real ainda nï¿½o estï¿½ conectada.
- O frontend legado foi preservado.
- A prï¿½xima etapa sugerida ï¿½ implementar `AuthProvider` ou `SessionProvider` e `authApi.js` conforme o contrato de autenticaï¿½ï¿½o.

## AuthProvider inicial

- A base real de autenticaï¿½ï¿½o do `frontend-react\` foi criada com `AuthProvider`, `authApi.js` e `authStorage.js`.
- O frontend legado continua preservado.
- O backend continua preservado.
- A prï¿½xima etapa sugerida ï¿½ a validaï¿½ï¿½o runtime do login React com usuï¿½rio real em ambiente local.

## Validaï¿½ï¿½o runtime do login

- A validaï¿½ï¿½o runtime do login React foi executada de forma parcial e controlada.
- A pï¿½gina `/login` respondeu corretamente no dev server.
- O backend preservou o comportamento esperado de `/login`, `/me` e `/logout`.
- A validaï¿½ï¿½o completa ainda depende de credencial real disponï¿½vel no ambiente.

## Validaï¿½ï¿½o do login React com usuario real

- A tentativa de validacao com usuario real permaneceu bloqueada por ausencia de credencial real disponivel para digitaï¿½ï¿½o manual no ambiente local.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ corrigir apenas o bloqueio especï¿½fico no `frontend-react` se ele reaparecer em nova tentativa, ou concluir a validaï¿½ï¿½o completa quando uma credencial real estiver disponï¿½vel.

## Correï¿½ï¿½o da validaï¿½ï¿½o de sessï¿½o apos login

- A validacao de sessao apos login foi ajustada no `frontend-react` para diferenciar melhor o resultado de `POST /login` e `GET /me`.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ repetir o teste manual de login real.

## Correcao do Failed to fetch no login

- O erro `Failed to fetch` no login foi tratado no `frontend-react` com base de API centralizada e mensagem mais clara de conexao.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ repetir o teste manual de login real em `http://localhost:5173/login`.

## Correcao da URL do login auth

- A montagem da URL do `POST /login` foi normalizada no `frontend-react` para evitar raiz solta ou barra duplicada.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ repetir o teste manual de login real em `http://localhost:5173/login`.

## Correcao do CORS/preflight do `/me` via proxy Vite

- O bloqueio de CORS/preflight do `GET /me` foi tratado no `frontend-react` com proxy local do Vite.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ repetir o teste manual de login real e validar `POST /api/login` e `GET /api/me` no Network.

## Validacao final do login real

- O login real foi validado no `frontend-react` e a area experimental abriu com sucesso.
- A protecao simples de sessao entre `/login` e `/app` foi criada.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ criar o contrato da primeira tela piloto autenticada.

## Contrato da primeira tela piloto autenticada

- O contrato da primeira tela piloto autenticada foi criado.
- A tela escolhida ï¿½ `Inï¿½cio / Painel Inicial`.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa recomendada ï¿½ implementar a tela `Inï¿½cio` autenticada.

## Tokens da marca Brana

- Os tokens visuais oficiais da marca Brana foram registrados no `frontend-react`.
- A paleta oficial foi documentada.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa recomendada ï¿½ implementar a tela `Inï¿½cio` autenticada usando os tokens oficiais.

## Primeira tela autenticada Inï¿½cio/Painel Inicial

- A primeira tela autenticada `Inï¿½cio/Painel Inicial` foi implementada no `frontend-react`.
- Os tokens oficiais da marca Brana foram utilizados.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar manualmente `/app` e logout; depois criar contrato da primeira tela funcional real, preferencialmente `Pacientes` em modo somente leitura.

## Validacao manual de Inï¿½cio e logout

- A validacao manual da tela `Inï¿½cio` e do logout foi registrada em documento proprio.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ criar o contrato da primeira tela funcional real, preferencialmente `Pacientes` em modo somente leitura.

## Shell Operacional Odontolï¿½gico

- O contrato do `Shell Operacional Odontolï¿½gico` foi criado para orientar o refino visual do `frontend-react`.
- A decisï¿½o visual consolidada aponta para toolbar lateral estreita + toolbar superior horizontal.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ implementar o refino do shell operacional sem novas APIs.

## Implementacao do Shell Operacional Odontologico

- O Shell Operacional Odontolï¿½gico foi implementado no `frontend-react`.
- A barra lateral estreita foi criada.
- A toolbar superior horizontal foi criada.
- A tela `Inï¿½cio` foi mantida como conteï¿½do autenticado.
- As aï¿½ï¿½es da nova barra superior seguem como placeholders.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar manualmente `/app`, `Sair` e o layout; depois criar contrato da tela `Pacientes` em modo somente leitura.

## Refino visual do Shell Operacional Odontologico

- O refino visual do `Shell Operacional Odontolï¿½gico` foi realizado no `frontend-react`.
- A toolbar superior foi compactada e refinada.
- A barra lateral foi reforï¿½ada com a paleta Brana.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validaï¿½ï¿½o visual pelo usuï¿½rio.

## Refino visual 2 do Shell Operacional Odontologico

- O Shell Operacional Odontolï¿½gico recebeu um segundo refino visual no `frontend-react`.
- A barra lateral ficou mais presente.
- A toolbar superior ficou mais integrada e compacta.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validaï¿½ï¿½o visual pelo usuï¿½rio em `/app`.

## Refino estrutural do Shell Operacional Odontologico

- O Shell Operacional Odontolï¿½gico recebeu um refino estrutural no `frontend-react`.
- A base visual ficou mais prï¿½xima de software odontolï¿½gico operacional / ERP clï¿½nico.
- A barra lateral e a toolbar superior ficaram mais compactas e funcionais.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validaï¿½ï¿½o visual do usuï¿½rio em `/app`.

## Recomposicao estrutural do Shell Operacional Odontologico

- O Shell Operacional Odontolï¿½gico recebeu uma recomposiï¿½ï¿½o estrutural no `frontend-react`.
- A lateral passou a parecer menu principal de software clï¿½nico.
- O topo passou a parecer uma toolbar desktop ï¿½nica.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validaï¿½ï¿½o visual do usuï¿½rio em `/app`.

## Ajuste de cores CMYK da lateral do shell operacional

- A lateral do shell operacional recebeu ajuste de cor solicitado pelo usuï¿½rio.
- A barra lateral foi alinhada ao tom `#0B5006`.
- Os ï¿½cones e botï¿½es laterais foram alinhados ao tom `#666666`.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validaï¿½ï¿½o visual do usuï¿½rio em `/app`.

## Teste de paleta do shell operacional

- A paleta do shell operacional foi testada com combinaï¿½ï¿½o mais equilibrada da marca Brana.
- A lateral passou a usar `#006838` como base visual principal.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validaï¿½ï¿½o visual do usuï¿½rio em `/app`.

## Rail compacta com icones e tooltips

- A rail lateral do `frontend-react` foi compactada para operar como navegaï¿½ï¿½o por ï¿½cones.
- Os rï¿½tulos passaram a aparecer apenas em tooltip, sem ocupar largura fixa.
- O botï¿½o `Sair` foi mantido discreto e funcional.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validacao visual da rail compacta em `/app`.

## Auditoria do sistema odontologico de referencia

- Foi registrada uma auditoria documental do sistema odontologico externo aberto como referencia visual e funcional.
- O material serviu apenas para mapear shell, mï¿½dulos e fluxo de alto nivel.
- Nenhum codigo, asset ou credencial do sistema externo foi copiado.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ transformar o mapa observado em contrato de `Pacientes` em modo somente leitura.

## Contrato de Pacientes somente leitura

- O contrato da primeira tela real do `frontend-react` foi definido para a tela `Pacientes` em modo somente leitura.
- A leitura tï¿½cnica confirmou que o backend atual jï¿½ possui endpoints de pacientes.
- O frontend legado tambï¿½m jï¿½ consome pacientes em mï¿½ltiplos pontos.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ implementar a tela `Pacientes` somente leitura usando apenas os endpoints jï¿½ confirmados.

## Implementacao de Pacientes somente leitura

- A tela `Pacientes` somente leitura foi implementada no `frontend-react`.
- A navegaï¿½ï¿½o pelo ï¿½cone `Pacientes` da rail agora abre a tela dentro do shell atual.
- A listagem usa apenas `GET /pacientes` e o resumo usa apenas `GET /pacientes/{paciente_id}`.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar visualmente a lista, a busca e o resumo, e sï¿½ depois planejar a prï¿½xima tela funcional.

## Menu contextual lateral da shell

- A rail operacional do `frontend-react` passou a usar grupos principais e painel contextual lateral.
- O caminho `Cadastro -> Pacientes` foi preservado para a tela somente leitura jï¿½ entregue.
- Os demais submenus permanecem como placeholders visuais.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar visualmente a rail expandida/recolhida e o painel contextual.

## Menu lateral por grupos e submenus

- O shell do `frontend-react` foi ajustado para o padrï¿½o de grupos principais e painel contextual branco.
- O menu do usuï¿½rio no topo agora oferece preferï¿½ncias, alteraï¿½ï¿½o de senha, opï¿½ï¿½es da conta e logout.
- A tela `Pacientes` continua acessï¿½vel em `Cadastro -> Pacientes`.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validaï¿½ï¿½o visual final do shell contextual e, sï¿½ entï¿½o, seguir para a prï¿½xima frente funcional.

## Toolbar horizontal operacional

- A barra superior horizontal do `frontend-react` foi reorganizada em grupos de aï¿½ï¿½es com ï¿½cones e separadores visuais.
- A busca por paciente ficou posicionada apï¿½s os grupos operacionais.
- O menu do usuï¿½rio permanece com aï¿½ï¿½es de conta e logout.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar visualmente o topo compacto e sï¿½ entï¿½o avanï¿½ar para a prï¿½xima tela funcional.

## Shell com topbar full-width

- O shell do `frontend-react` foi reorganizado para que a topbar horizontal ocupe toda a largura no topo.
- A rail lateral e o painel contextual passaram a iniciar abaixo da topbar.
- O workspace foi corrigido para evitar compressï¿½o excessiva e quebra visual vertical.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar visualmente o shell reorganizado e ajustar apenas detalhes de densidade, se necessï¿½rio.

## Ajuste de logo e cor lateral

- A logo oficial `assets/logo_brana.png` foi copiada para o `frontend-react` e aplicada na topbar.
- A busca de paciente foi reduzida para equilibrar a faixa superior.
- A lateral passou a usar cor sï¿½lida baseada na marca, em `#16AAA1`.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar o encaixe visual da logo e, se necessï¿½rio, refinar apenas espaï¿½amentos.

## Ajuste de logo Brana e rail sem Inï¿½cio

- A logo da topbar passou a usar `assets/brana.png`.
- O bloco inicial da rail foi removido.
- O item `Inï¿½cio` foi removido da rail.
- O acesso ao `Inï¿½cio` foi mantido pelo botï¿½o `Dashboard` da toolbar superior.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar o novo encaixe da rail e do workspace, e sï¿½ depois seguir para refinamentos visuais finais.

## Marca da topbar e workspace

- A marca superior passou a exibir `BranaCloud` com `Sistema de Gestï¿½o Odontolï¿½gica.` abaixo, usando a logo local.
- O texto `Shell Operacional Odontolï¿½gico` foi removido da topbar.
- Os ï¿½cones da toolbar horizontal foram ampliados e receberam a cor da lateral.
- O workspace recebeu ajuste fino para evitar o texto quebrado verticalmente.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar visualmente a nova marca e, se necessï¿½rio, ajustar apenas espaï¿½amento fino.

## Refino do submenu lateral estilo EasyDental

- O submenu lateral contextual do `frontend-react` foi refinado para um estilo operacional compacto, sem cards.
- Os itens passaram a usar hover em faixa cinza e densidade vertical menor.
- O tooltip da rail lateral foi suprimido enquanto o painel contextual estï¿½ aberto, reduzindo sobreposiï¿½ï¿½o visual.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar visualmente o submenu lateral no navegador.

## Refino de contraste do submenu e remocao do logout da rail

- O painel contextual do `frontend-react` recebeu contraste visual maior, com fundo branco opaco e sombra mais perceptï¿½vel.
- O botï¿½o `Sair` foi removido da rail lateral inferior esquerda.
- O logout da topbar foi preservado.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar no navegador a solidez visual do painel e o comportamento do menu do usuï¿½rio.

## Dashboard inicial do frontend-react no estilo EasyDental

- A tela inicial do `frontend-react` foi aproximada do painel inicial do EasyDental com faixa operacional, abas e miolo de avisos.
- O `Dashboard` continua levando para `Inï¿½cio`.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar visualmente a leitura da nova tela inicial e, se necessï¿½rio, ajustar densidade e responsividade.

## Correï¿½ï¿½o do render do Dashboard / Quadro de avisos

- O `frontend-react` passou a renderizar um mï¿½dulo prï¿½prio de `Dashboard / Quadro de avisos` no `/app`.
- A tela deixou de depender de hover na lateral para aparecer.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar o fluxo inicial e o retorno pelo botï¿½o `Dashboard` da toolbar superior.

## Correï¿½ï¿½o do Dashboard inicial sem depender de hover

- O estado inicial do workspace foi fixado em `dashboard` com fallback seguro.
- O botï¿½o `Dashboard` passou a reforï¿½ar explicitamente a mesma tela inicial.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar no navegador o carregamento imediato do dashboard e o retorno pelo botï¿½o.

## Correï¿½ï¿½o da visibilidade do dashboard no workspace

- O workspace passou a ocupar explicitamente a terceira coluna do grid do shell, evitando colapsar na coluna vazia quando o painel contextual nï¿½o estï¿½ aberto.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar o carregamento imediato do Dashboard e o comportamento do painel contextual.

## Refino visual do Quadro de avisos no estilo EasyDental

- O Quadro de avisos foi compactado visualmente para se aproximar mais do EasyDental.
- O tï¿½tulo grande deixou de ocupar destaque no topo do conteï¿½do.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar visualmente a densidade da faixa operacional, abas e avisos.

## Barra turquesa e coluna lateral do dashboard

- A ï¿½rea inicial do `frontend-react` recebeu uma barra operacional turquesa mais forte.
- O dashboard passou a exibir uma coluna lateral fixa com cards de apoio e orientaï¿½ï¿½o.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar no navegador o encaixe visual e manter apenas refinamentos finos.

## Correï¿½ï¿½o da barra turquesa e do alinhamento do dashboard

- A barra operacional do dashboard foi tornada sï¿½lida e mais visï¿½vel logo abaixo da topbar.
- O dashboard deixou de parecer centralizado e passou a iniciar alinhado ï¿½ esquerda da ï¿½rea ï¿½til.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar no navegador a leitura final da faixa e do encaixe lateral.

## Refino do miolo do Quadro de avisos

- A saudaï¿½ï¿½o do `frontend-react` foi compactada para ficar mais prï¿½xima do EasyDental.
- Os avisos passaram a aparecer como barras brancas separadas e mais densas.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar a nova densidade do miolo esquerdo no navegador.

## Remoï¿½ï¿½o da coluna direita do Quadro de avisos

- Os cards informativos da direita foram removidos do dashboard.
- O miolo principal ficou em uma ï¿½nica coluna ampla e alinhada ï¿½ esquerda.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar o encaixe operacional final do quadro de avisos.

## Ampliaï¿½ï¿½o do miolo sem coluna direita

- O badge da barra turquesa foi removido.
- O bloco principal do quadro de avisos ficou mais largo e compacto.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar a leitura final do quadro com as barras de aviso mais amplas.

## Largura do miolo e barra integrada

- O quadro de avisos passou a ocupar mais da ï¿½rea ï¿½til do workspace.
- A barra turquesa ficou mais reta e integrada ao shell operacional.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar a leitura da barra e do miolo em telas largas.

## Refino de proporï¿½ï¿½o do quadro de avisos

- O miolo do quadro de avisos ganhou mais largura ï¿½til.
- As barras de aviso ficaram mais prï¿½ximas do padrï¿½o visual do EasyDental.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar o balanceamento final da faixa e das barras em desktop largo.

## Alinhamento final da barra turquesa

- A barra turquesa foi alinhada como faixa estrutural contï¿½nua do shell.
- O quadro de avisos recebeu um refinamento final de proporï¿½ï¿½o e densidade.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar a leitura final da faixa e do miolo em tela larga.

## Conexï¿½o da barra turquesa com a rail lateral

- A faixa horizontal ganhou uma continuidade visual na borda esquerda para eliminar a emenda com a rail.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar o canto de junï¿½ï¿½o entre rail e faixa em reload completo.

## Faixa operacional no shell

- A faixa turquesa operacional passou a ser tratada como parte do shell, acima do workspace.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar a uniï¿½o visual com a rail em tela larga.

## Faixa operacional e rail no mesmo nï¿½vel

- A rail lateral e a faixa operacional passaram a iniciar na mesma linha logo abaixo da topbar.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar a quina visual em reload completo do `/app`.

## Refino da quina entre rail e faixa operacional

- A quina entre a rail lateral e a faixa turquesa foi refinada no `frontend-react`.
- A junï¿½ï¿½o passou a parecer uma estrutura visual ï¿½nica em "L", sem degrau aparente.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar novamente o `/app` em reload completo.

## Quina real entre rail e faixa operacional

- A quina do shell ganhou uma cï¿½lula turquesa real na coluna da rail.
- A faixa operacional passou a continuar estruturalmente a partir desse canto.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar visualmente o canto em reload completo do `/app`.

## Ajuste do miolo e fechamento automï¿½tico do submenu

- O miolo do Quadro de avisos foi aproximado das abas no `frontend-react`.
- O submenu lateral/contextual passou a fechar sozinho ao sair da regiï¿½o combinada.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar o comportamento do mouse em `/app`.

## Remoï¿½ï¿½o do texto MENU CONTEXTUAL

- O texto `MENU CONTEXTUAL` foi removido do topo do painel contextual no `frontend-react`.
- O tï¿½tulo do grupo e o fechamento automï¿½tico foram preservados.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar visualmente o submenu lateral em `/app`.

## Refino dos ï¿½cones da rail no estilo EasyDental

- Os ï¿½cones da rail lateral foram aproximados do EasyDental no `frontend-react`.
- O visual de cards/botï¿½es modernos foi reduzido.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar a rail lateral em `/app`.

## Troca do desenho dos ï¿½cones da rail

- Os ï¿½cones da rail lateral passaram a usar desenhos semanticamente mais prï¿½ximos da referï¿½ncia EasyDental.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar visualmente os glyphs da rail em `/app`.

## ï¿½cones SVG locais para a rail

- A rail lateral passou a usar ï¿½cones SVG/React locais prï¿½prios no `frontend-react`.
- Os desenhos ficaram mais robustos e prï¿½ximos da leitura visual do EasyDental.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar visualmente os novos ï¿½cones em `/app`.

## Refino da presenï¿½a dos ï¿½cones da rail

- Os SVGs locais da rail foram aumentados e ganharam mais presenï¿½a visual no `frontend-react`.
- A leitura dos ï¿½cones ficou mais prï¿½xima da referï¿½ncia EasyDental.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar visualmente a rail em `/app`.

## Rail com icones semanticos prontos

- A rail lateral do `frontend-react` passou a usar icones prontos e semanticos do `@ant-design/icons`.
- Os SVGs locais da rail foram removidos.
- A ordem dos grupos, o hover e o fechamento por mouseleave foram preservados.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar visualmente a rail em `/app` e seguir apenas com ajustes finos, se necessï¿½rios.

## Topbar com icones semanticos prontos

- A barra horizontal superior do `frontend-react` passou a usar icones prontos e semanticos do `@ant-design/icons`.
- Os desenhos ficaram mais claros para cada aï¿½ï¿½o e mais prï¿½ximos da referencia visual enviada pelo usuï¿½rio.
- A ordem dos botï¿½es, os grupos e os separadores foram preservados.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar visualmente a topbar em `/app`.

## Refino dos desenhos dos icones da topbar

- A barra horizontal superior do `frontend-react` recebeu um segundo refinamento de desenho dos icones.
- Alguns sï¿½mbolos foram aproximados ainda mais da leitura semï¿½ntica da referï¿½ncia visual enviada.
- A ordem dos botï¿½es, os grupos e os separadores foram preservados.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar visualmente a topbar em `/app`.

## Contrato funcional da tela Preferï¿½ncias

- Foi criado o contrato funcional inicial da tela Preferï¿½ncias com base no vï¿½deo do EasyDental.
- A documentaï¿½ï¿½o registrou estrutura visual, abas, campos observados e pendï¿½ncias de mapeamento.
- Nenhum cï¿½digo foi alterado nesta etapa.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ mapear a tela em mais detalhe antes de qualquer implementaï¿½ï¿½o.

## Modal visual de Preferï¿½ncias

- O modal visual da tela Preferï¿½ncias foi implementado no `frontend-react` sem persistï¿½ncia.
- A abertura foi ligada ao item `Preferï¿½ncias` do menu do usuï¿½rio na topbar.
- A aba NFS-e foi mantida como pendï¿½ncia visual segura.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar o modal em `/app` e sï¿½ depois pensar em persistï¿½ncia.

## Refino visual do modal de Preferï¿½ncias

- O modal Preferï¿½ncias foi compactado para ficar mais denso e operacional.
- A aba Geral ficou menos espaï¿½ada e a ï¿½rea de avatar foi reduzida.
- As abas Ficha clï¿½nica e Orï¿½amento ganharam leitura mais prï¿½xima de formulï¿½rio desktop.
- A aba NFS-e permaneceu apenas como pendï¿½ncia visual.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar visualmente o modal compactado em `/app`.

## Refino de estilo desktop do modal de Preferï¿½ncias

- O modal Preferï¿½ncias recebeu um novo ajuste para ficar mais parecido com uma janela desktop clï¿½ssica.
- As abas ficaram mais simples e densas.
- A aba Geral, Ficha clï¿½nica e Orï¿½amento foram aproximadas ainda mais da referï¿½ncia operacional.
- A aba NFS-e permaneceu somente como pendï¿½ncia compacta.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ revalidar visualmente o modal em `/app`.

## Refino adicional de estilo desktop do modal de Preferï¿½ncias

- O modal Preferï¿½ncias recebeu um novo aperto visual para se aproximar ainda mais de uma janela desktop clï¿½ssica.
- A largura, os campos, os botï¿½es e as abas foram compactados novamente.
- A aba NFS-e continuou apenas como pendï¿½ncia visual.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar visualmente o novo aperto em `/app`.

## Redesenho campo a campo do modal de Preferï¿½ncias

- O modal Preferï¿½ncias foi redesenhado campo a campo com base nos prints do EasyDental.
- A aba NFS-e passou a exibir campos visuais reais da referï¿½ncia.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar o modal redesenhado em `/app`.

## Refino visual do modal de Preferï¿½ncias por print de referï¿½ncia

- O modal Preferï¿½ncias recebeu um novo ajuste fino com base direta nos prints do EasyDental.
- A aba Geral passou a aproximar melhor o bloco de identidade, o avatar e os campos centrais.
- A aba Ficha clï¿½nica ganhou listbox mais centralizada e leitura mais parecida com o layout legado.
- A aba Orï¿½amento e a aba NFS-e foram compactadas para reforï¿½ar o estilo de janela desktop clï¿½ssica.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ revalidar o modal em `/app` e seguir apenas com acabamento fino, se necessï¿½rio.

## Modal Preferï¿½ncias com tamanho estï¿½tico

- O modal Preferï¿½ncias passou a ter tamanho fixo e estrutura em flex column.
- As abas ficaram com geometria estï¿½vel e o conteï¿½do passou a rolar internamente quando necessï¿½rio.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar visualmente a troca de abas e, se necessï¿½rio, ajustar apenas microdetalhes de densidade.

## Refino interno da aba Geral das Preferï¿½ncias

- A aba Geral do modal Preferï¿½ncias foi aproximada do print do EasyDental sem alterar a geometria estï¿½vel jï¿½ conquistada.
- A composiï¿½ï¿½o da identidade, do avatar e dos campos centrais foi ajustada.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ comparar novamente com o print e repetir o mesmo padrï¿½o de refinamento nas demais abas, se necessï¿½rio.

## Refino da faixa inferior e grade do modal Preferï¿½ncias

- O modal Preferï¿½ncias recebeu faixa inferior fixa cinza e ajustes na grade clï¿½ssica da aba Geral.
- As tabs ficaram menos arredondadas e o avatar ganhou encaixe visual melhor.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar visualmente a nova faixa inferior e comparar os campos da aba Geral com os prints de referï¿½ncia.

## Correï¿½ï¿½o textual do modal Preferï¿½ncias

- Os textos quebrados/mojibake do modal Preferï¿½ncias e dos documentos da frente foram corrigidos para portuguï¿½s UTF-8.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ seguir apenas com ajustes visuais ou funcionais, se houver nova validaï¿½ï¿½o do usuï¿½rio.

## Grade e foto da aba Geral das Preferï¿½ncias

- A aba Geral recebeu nova separaï¿½ï¿½o entre formulï¿½rio e coluna da foto.
- Os campos passaram a respeitar largura controlada e a foto ficou totalmente encaixada.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prï¿½xima etapa sugerida ï¿½ validar visualmente a nova composiï¿½ï¿½o da aba Geral.

## Grid real da aba Geral das PreferÃªncias

- A aba Geral do modal PreferÃªncias recebeu uma grade real com coluna fixa de formulÃ¡rio e coluna fixa de foto.
- Os campos ficaram com largura controlada e a foto passou a manter a barra inferior totalmente visÃ­vel.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prÃ³xima etapa sugerida Ã© apenas microajustar alinhamentos, se o usuÃ¡rio trouxer nova comparaÃ§Ã£o visual.

## Aba Geral das PreferÃªncias - alinhamento dos dados de identidade

- Nome, CPF e CRO/UF passaram a usar a mesma grade clÃ¡ssica dos demais campos da aba Geral.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prÃ³xima etapa sugerida Ã© apenas validar visualmente o alinhamento final em `/app`.

## NFS-e compacta no modal PreferÃªncias

- A aba NFS-e foi compactada verticalmente sem mudar campos nem comportamento.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prÃ³xima etapa sugerida Ã© validar visualmente a aba NFS-e em `/app`.

## PreferÃªncias - remoÃ§Ã£o do texto auxiliar da NFS-e e reduÃ§Ã£o do modal

- O texto auxiliar da NFS-e foi removido e o modal ficou um pouco mais baixo.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prÃ³xima etapa sugerida Ã© validar visualmente o modal em `/app`.

## PreferÃªncias - ajuste das opÃ§Ãµes dos combos

- As listas visuais dos combos do modal PreferÃªncias foram ajustadas conforme o contrato funcional.
- O `frontend-react` segue isolado.
- O backend segue preservado.
- O frontend legado segue preservado.
- A prÃ³xima etapa sugerida Ã© validar os combos em `/app`.

- A frente FC2C-3 do `frontend-react` substituiu o odontograma CSS por composicao com assets locais do repositorio em `frontend-react/public/assets/fichaClinica/odontograma/`, preservando o shell da Ficha clinica e sem tocar em backend, banco ou regras operacionais.
- O refino fino posterior da FC2C-3 trocou a composicao para dentes isolados com faces repetidas e numeracao central, aproximando melhor o quadro do EasyDental Cloud sem introduzir logica clinica real.
- Proxima etapa recomendada: apenas comparacao visual fina e ajuste de proporcao, sem backend, banco, migration ou fluxo funcional novo.

## Medicao DOM do odontograma EasyDental Cloud

- Medicao estrutural concluida a partir do print de referencia e da sessao autenticada do EasyDental Cloud.
- Base de proporcao consolidada: quadro compacto, dentes em duas arcadas, duas linhas de faces, paleta logo abaixo e mensagem inferior ampla.
- O Brana Cloud atual ainda precisa reproduzir essa densidade visual no shell da `Ficha clinica`.
- Proxima etapa recomendada: ajuste visual do shell odontologico sem frontend, backend, banco ou migration nova.
- FC2C-6 aplicou as proporcoes medidas do EasyDental Cloud no odontograma do `frontend-react`.
- O shell visual ficou mais compacto, com densidade maior e sem backend/banco/migration.
- Proxima etapa recomendada: revisao visual fina do bloco odontologico e avaliacao do eventual fundo cinza dos BMPs.
- FC2C-7 converteu os dentes locais para PNG transparente em `frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/`, sem copiar assets do EasyDental Cloud.
- O `frontend-react` passou a consumir os PNGs limpos e o shell dos dentes foi neutralizado para eliminar a moldura cinza visivel.
- Proxima etapa recomendada: apenas validacao visual fina e, se necessario, novo ajuste de proporcao a partir da base limpa local.
- FC2C-8 realizou o polimento fino do odontograma no lado esquerdo da Ficha clinica.
- Os dentes ficaram levemente maiores, as faces mais suaves e a area inferior mais compacta, sem backend/banco/migration.
- Proxima etapa recomendada: validacao visual final e manutencao do escopo somente estetico.
- FC2C-9 refinou a barra horizontal de especialidades abaixo do odontograma na Ficha clinica.
- A faixa ficou mais compacta, rolavel visualmente e com destaque discreto para a especialidade ativa, sem backend/banco/migration.
- Proxima etapa recomendada: seguir apenas com polimento visual de superfÃ­cies adjacentes, sem introduzir fluxo funcional novo.
- FC2C-10 reorganizou a faixa de especialidades como scroller de blocos com icone acima do rotulo, usando assets locais do repositorio e sem backend/banco/migration.
- A barra passou a ficar mais proxima da densidade do EasyDental Cloud, com overflow horizontal e separacao visual mais tecnica.
- Proxima etapa recomendada: apenas comparacao visual fina e pequenos ajustes de espaco, sem mudar fluxo clinico.
- FC2C-11 corrigiu a estrutura da barra abaixo do odontograma.
- Separou procedimentos e especialidades.
- Sem backend/banco/migration.
- Sem copiar assets do Cloud.
- Proxima etapa recomendada: refinamento fino do alinhamento visual e do comportamento de rolagem.
- FC2C-12 implementou rolagem horizontal visual das barras abaixo do odontograma.
- As setas agora controlam os dois tracks locais.
- Sem backend/banco/migration.
- Proxima etapa recomendada: refinamento fino da navegacao e da densidade visual.
- FC2C-13 concluiu a compactacao visual do bloco esquerdo da Ficha clinica.
- O odontograma, as barras e a area de mensagem ficaram mais densos e proporcionais.
- Sem backend/banco/migration.
- Proxima etapa recomendada: nova comparacao visual fina, se o usuario trouxer outro print.
- FC2C-14 reduziu ainda mais a largura horizontal do bloco esquerdo da Ficha clinica.
- O conjunto ficou mais estreito, compacto e alinhado a referencia visual indicada.
- Sem backend/banco/migration.
- Proxima etapa recomendada: nova comparacao visual fina, se necessario.
- Refinamento adicional da FC2C-14 estreitou ainda mais o shell esquerdo para remover a ultima folga horizontal perceptivel.
- Sem backend/banco/migration.
- Proxima etapa recomendada: apenas comparacao visual fina com o print de referencia.
- Matriz de equivalencia da barra superior EasyDental x Brana criada em documento proprio.
- Sem implementacao.
- Proxima etapa recomendada: ajustar visualmente apenas os atalhos Paciente, Prontuario/Ficha clinica e Estoque, sem alterar rotas nem backend.
- Ajuste visual dos atalhos Paciente, Ficha clinica/Prontuario e Estoque aplicado no frontend-react.
- Sem backend/banco/migration.
- Proxima etapa recomendada: comparacao visual fina e, se necessario, microajustes de icone.
- Criacao e aplicacao de icones proprios da barra superior para Paciente, Ficha clinica/Prontuario e Estoque.
- Sem backend/banco/migration.
- Proxima etapa recomendada: validar visualmente a barra superior no navegador e seguir apenas com microajustes, se necessario.
- FC2C-15 criou icones vetoriais locais para a linha Cirur da barra interna da Ficha clinica.
- A categoria Cirur passou a renderizar Apicectomia, Cirurgia, Enxerto, Frenectomia, HemisecÃ§Ã£o, Retalho, Rizectomia e Ulectomia com componentes SVG internos.
- Sem backend, banco, migration, Tratamento ou painel lateral direito alterados.
- Proxima etapa recomendada: mapear as demais linhas da barra interna, se o inventario visual indicar lacunas.

## Frente validada: Tabelas Auxiliares no novo frontend React

- A frente de `Configuracao > Tabelas auxiliares` no novo frontend React do Brana Cloude foi validada e considerada fechada apos comparacao visual com o Terra Relva.
- O fechamento documental esta registrado em `docs/validacao_final_tabelas_auxiliares_frontend_react_brana_cloude.md`.
- O encerramento formal consolidado do modulo esta registrado em `docs/encerramento_formal_tabelas_auxiliares_brana_cloude.md`.
- Foram alinhados shell, submenu lateral interno, grid, cabecalho compartilhado, menu de filtro, modal e o botao `Salvar`, mantendo a paleta do Brana Cloude.
- A navegacao por teclado e o foco visivel foram tratados como ajuste final de usabilidade da mesma frente, sem abrir nova implementacao.
- Nao houve mudanca de backend, banco, migrations, regras de negocio ou novos endpoints.
- `Grupo de medicamento` foi auditado em frente separada e recebeu contrato proprio em `docs/contrato_implementacao_grupo_medicamento_frontend_react.md`; ele permanece fora do lote padrao de tabelas simples.

## Frente implementada: Situacao do paciente no novo frontend React

- Situacao do paciente foi implementada no novo frontend React como frente excepcional propria, seguindo o contrato de implementacao ja documentado.
- A validacao visual foi concluida no navegador com a frente aberta, modal especifico, campos corretos e sem regressao nas tabelas auxiliares consolidadas.
- Permanecem fora de escopo: Cor, Exibir anotacao no historico, qualquer campo herdado de Situacao do agendamento e qualquer regra nao confirmada.

## Frente auditada: Especialidades

- Especialidades foi auditada como frente excepcional propria no Brana Cloud.
- A referencia principal de modelagem foi o EDS70, com apoio do legado Brana Cloud.
- O contrato de implementacao devera tratar o combo Imagem como catalogo fixo por indice, salvo nova descoberta funcional.

## Frente auditada: Especialidades

- Especialidades foi auditada como frente excepcional propria e recebeu contrato proprio em `docs/contrato_implementacao_especialidades_frontend_react.md`.
- A implementacao futura deve respeitar o modal proprio, o campo Ordem, o combo Imagem e o checkbox Inativar especialidade.
- O combo Imagem deve permanecer como catalogo fixo por indice, salvo nova confirmacao funcional.

## Frente estrutural nova: Motivos de agendamento

- Motivos de agendamento foi auditado como frente especial propria no Brana Cloud.
- A tabela nao existia como frente propria no novo frontend React e nao pode ser tratada como tabela simples.
- O contrato tecnico-funcional ficou registrado em `docs/contrato_implementacao_motivos_agendamento_frontend_react.md`.
- A implementacao precisa preservar a regra de tipo, a paleta, o campo de compromisso produtivo e a persistencia propria.

## Frente nova consolidada: Procedimentos genÃ©ricos

- A auditoria consolidada da frente de Procedimentos genÃ©ricos foi registrada em `docs/contrato_implementacao_procedimentos_genericos_frontend_react.md`.
- O backend existente foi preservado nesta etapa.
- O novo frontend React jÃ¡ recebeu rota, listagem inicial, filtros de `Especialidades` e `Procedimentos`, barra de aÃ§Ãµes e status visual por bolinha.
- Os botÃµes `Fases` e `Materiais` ficaram em comportamento mÃ­nimo controlado, sem editor completo nesta etapa.
- A prÃ³xima etapa recomendada Ã© o detalhamento dos fluxos de ediÃ§Ã£o quando o contrato visual exigir.
## Frente pausada temporariamente: Procedimentos genericos

- O fechamento temporario da frente foi registrado em `docs/encerramento_temporario_procedimentos_genericos_frontend_react.md`.
- A frente ficou consolidada o suficiente para pausa controlada, com listagem, shell, filtros, modal principal, fases e materiais ja integrados no novo frontend React.
- O escopo atual nao abre nova funcionalidade e nao deve ser reativado sem nova prioridade ou novo contrato funcional.
- Retomadas futuras devem respeitar o shell compartilhado, o contrato auditado do EasyDental Desktop e os documentos ja produzidos nesta frente.

## Padrão visual compartilhado dos modulos administrativos do frontend React

- O padrão visual/estrutural dos modulos administrativos do novo frontend React foi formalizado em `docs/frontend_react_padrao_shell_modulos_administrativos.md`.
- O documento consolida o shell base com lateral + barra horizontal formando um `L`, a barra superior com acoes e filtros principais, o grid ocupando a largura util e o uso do `TableColumnFilterHeader` no padrao de `Tabelas Auxiliares`.
- A documentacao aponta `Tabelas Auxiliares` e `Procedimentos genéricos` como modulos de referencia atuais.
- O objetivo e evitar novos layouts paralelos, toolbars isoladas por pagina e filtros paralelos fora do shell compartilhado.

- A frente de mojibake dos procedimentos foi conclu?da para a tabela 11 (`UNIMED - ODONTO`), com preview validado, backup gerado em `backend/backups/mojibake_procedimentos/backup_tabela_11.json`, apply controlado de `114` registros e valida??o real em banco, API e navegador.

- O fechamento documental do Painel de Cadastro de Procedimentos foi consolidado no contrato da frente; a proxima etapa funcional permanece o Painel Financeiro, seguido de Materiais.
## Atualizacao recente

- O Painel Financeiro da frente `Tabelas -> Procedimentos` foi integrado no React com consumo oficial de `GET /procedimentos/dashboard`.
- A frente de Materiais segue como proxima etapa.
- A auditoria complementar de Materiais vinculados consolidou o contrato real de `procedimento_material`, com leitura composta por itens proprios e herdados, e confirmou que o React ainda deve tratar vinculo, edicao e desvinculo como fluxo proprio do modal.
- A nova auditoria da tabela `PARTICULAR` no EasyDental Desktop localizou a fonte fisica em `Y:\EDS70\Dados\Dist\TAB_PRC.raw` e `Y:\EDS70\Dados\Dist\TAB_PRC_ITEM.raw`, mas a leitura SQL autenticada do servidor legado continua pendente por limitação de driver/autenticacao; foram criados os contratos `docs/auditoria_sincronizacao_particular_easydental_desktop.md` e `docs/contrato_sincronizacao_particular_easydental_desktop.md` para a proxima etapa.
- O script de auditoria somente leitura `backend/scripts/extrair_particular_easydental_raw.py` foi criado para fechar o inventario fixo de `TAB_PRC.raw` e a inspeção estrutural de `TAB_PRC_ITEM.raw` sem tocar nas fontes.
- A frente de correcao textual da tabela `PARTICULAR` foi reaberta em modo preparatorio somente leitura para o campo `procedimento.nome`; o preview e o dry-run foram preparados em `docs/preview_correcao_textual_particular_operacional.json`, `docs/preview_correcao_textual_particular_operacional.csv` e `backend/scripts/preview_correcao_textual_particular_operacional.py`, com apply ainda bloqueado.
- A triagem da PARTICULAR foi promovida para um preview seguro com `106` casos corrigiveis e um arquivo separado de revisao manual com `63` divergencias, incluindo o bloqueado `Procedimento 5200`; os artefatos finais foram gerados em `docs/preview_correcao_textual_particular_segura.json`, `docs/preview_correcao_textual_particular_segura.csv`, `docs/revisao_manual_particular_divergencias_textuais.json` e `docs/revisao_manual_particular_divergencias_textuais.csv`.

## Atualizacao visual recente

- O Painel Financeiro da frente `Tabelas -> Procedimentos` voltou ao layout compacto de 3 colunas.
- O rastro tecnico visivel de origem oficial foi removido do modal.
- Os indicadores `Bom 30 a 40%` e `Bom 10 a 20%` permanecem com realce verde discreto.
- Backend, formulas e payloads nao foram alterados nesta consolidacao visual.

## Atualizacao recente do roadmap

- A engenharia reversa controlada de `TAB_PRC_ITEM.raw` foi concluida em leitura somente leitura.
- O parser deterministico da Particular passou a confirmar `NROTAB=1`, `NROPROCTAB` unico e nome UTF-16LE a partir do offset conhecido.
- O snapshot e o preview inicial foram gerados sem alterar RAW, banco, seed, frontend ou backend operacional.

## Correcao global da banda auxiliar do shell operacional

- A correção global da emenda visual foi encerrada no frontend React.
- A causa raiz confirmada foi o seletor `.auxiliary-shell-band` com `box-shadow: inset 0 -1px 0 var(--brana-divider)`.
- A propriedade foi removida com `box-shadow: none`, beneficiando os módulos operacionais que compartilham a banda auxiliar.
- O Dashboard permaneceu inalterado, pois não usa `.auxiliary-shell-band`.
- O risco de regressão é reintroduzir divisor, sombra ou borda inferior na banda auxiliar compartilhada.

## Atualizacao de fechamento parcial da Particular

- A auditoria do `TAB_PRC_ITEM.raw` foi corrigida para incluir registros com tag `00 00` que o parser inicial nao estava capturando.
- O inventario legivel da tabela `Particular` passou de `107` para `112` registros validos em `NROTAB=1`.
- O snapshot anterior de `107` era parcial e nao deve ser tratado como canonico.
- A divergencia de `336` itens no destino Brana permanece sem prova de origem fisica no RAW e continua fora do apply.
- O proximo passo tecnico e manter a auditoria em modo somente leitura ate descobrir uma fonte operacional adicional ou confirmar que os `336` pertencem apenas ao destino Brana.

## Atualizacao recente do submodal Vincular material

- O submodal foi redesenhado para seguir a referencia compacta do legado.
- A janela passou a usar coluna única com `Classificação`, `Material`, `Nome do material`, `Valor de custo unitário`, `Quantidade média utilizada` e `Valor de custo total`.
- `Relação` e `Preço R$` foram removidos apenas da apresentação deste submodal.
- A validação visual no navegador confirmou o layout menor e a permanência das regras funcionais.
- O ajuste pontual posterior padronizou cabeçalho, botões e valor inicial da quantidade para `0`, sem redesenhar novamente o modal.
## Atualizacao da frente PARTICULAR

- A nova etapa de reconciliação fechou o contrato seguro da PARTICULAR.
- Foram separados `167` registros confiáveis e `169` bloqueados para validação manual.
- O preview de apply ficou isolado do conjunto manual.
- Próxima fase recomendada: validação humana dos bloqueados e só depois qualquer decisão de apply.
- A validação dirigida dos `103` registros médios foi concluída sem promoções automáticas.
- O resultado final manteve `64` altos, `103` médios e `169` bloqueados, com apply ainda bloqueado.
- A exportação CSV do EasyDental foi auditada como nova evidência operacional, preservando o original na Área de Trabalho e reforçando o significado de `CODCONV` como código exibido no arquivo.
## 2026-07-14 - Procedimentos: validacao funcional dos campos monetarios

- A validacao funcional da correcao dos campos `Valor de repasse`, `Valor do paciente` e `Custo de laboratorio` foi concluida.
- Foi confirmada a persistencia real via `PUT /procedimentos/66927` e a reabertura do modal com formatacao `pt-BR`.
- Foi identificado e corrigido um problema de conversao no payload da pagina de Procedimentos que zerava `preco` ao reenviar valores com separador de milhar.
- O painel financeiro carregou com `GET /procedimentos/dashboard` e permaneceu sem usar `valor_repasse` no calculo do dashboard.
- Nenhum ajuste de backend, banco, migration ou endpoint estrutural foi necessario.
## Atualizacao de microetapa

- Microetapa complementar do modulo `Procedimentos` validada em navegador real: exclusao de vinculo proprio, recomposicao do material herdado, confirmacao de quantidade reaparecida e ausencia de duplicidade.
- Nenhuma implementacao de backend, banco ou migration foi necessaria.

## Confirmacao do botao de desvinculacao

- O modal React de confirmacao do botao `Desvincular material` foi validado com `Nao` e `Sim`.
- `Nao` nao dispara `DELETE`.
- `Sim` dispara exatamente um `DELETE` real e a grade permanece coerente com a recomposicao.

## Cenário anual no frontend React

- Estado atual: implementado.
- A feature foi adicionada em `frontend-react/src/features/cenarioAnual/`.
- O item `Cenário anual` foi exposto no submenu `Configuração`.
- A ordem textual dos submenus foi reorganizada de forma explícita, sem ordenação em runtime.
- Validação funcional completa no navegador ainda depende de execução manual nesta sessão.

## Etapa 4A do Cenário anual

- Fechamento funcional e preparação do salvamento: inventário de controles, confirmação de fórmulas, mapeamento do payload e documentação revisada.
- `Gravar` permanece desabilitado nesta fase.
- `POST /cenario` continua pendente para a Etapa 4B.

## Etapa 4B do Cenário anual

- Salvamento real implementado com `POST /cenario` e payload produzido por `buildCenarioAnualPayload(state)`.
- O botão `Gravar` passou a ter loading e bloqueio de clique duplo.
- `Cancelar` e `X` seguem sem persistência.
- A validação visual autenticada e a conferência pós-F5 permanecem como pendência operacional desta sessão.

## Etapa 4B.1 do Cenário anual

- Paridade funcional dos controles revisada nos campos numéricos que exibem spinbox no legado.
- O React passou a mostrar handlers de incremento/decremento nos campos equivalentes.
- A validação autenticada real ficou bloqueada pela tela de login do ambiente local nesta sessão.

## Etapa 4C.2 do Cenario anual

- A validacao isolada da `Comissao Dentista (%)` foi concluida em navegador autenticado local.
- O valor `cd` foi alterado de `20` para `21`, persistido com um unico `POST /cenario`, confirmado no `GET /cenario` e refletido no painel financeiro de `Procedimentos`.
- Em seguida, `cd` foi restaurado para `20`, com novo `POST /cenario`, novo `GET /cenario` e retorno do valor original no consumidor.
- Nenhum outro campo do Cenario anual foi alterado nesta rodada.

## Etapa 4C.3 do Cenario anual

- A validacao isolada do `Imposto de Renda (%)` foi concluida em navegador autenticado local.
- O valor `ir` foi alterado de `10` para `11`, persistido com um unico `POST /cenario`, confirmado no `GET /cenario` e refletido no painel financeiro de `Procedimentos`.
- Em seguida, `ir` foi restaurado para `10`, com novo `POST /cenario`, novo `GET /cenario` e retorno do valor original no consumidor.
- Nenhum outro campo do Cenario anual foi alterado nesta rodada.

## Etapa 4C.4 do Cenario anual

- A validacao isolada da `Taxa Cartao (%)` foi concluida em navegador autenticado local.
- O valor `cartao` foi alterado de `4` para `5`, persistido com um unico `POST /cenario`, confirmado no `GET /cenario` e refletido no painel financeiro de `Procedimentos`.
- Em seguida, `cartao` foi restaurado para `4`, com novo `POST /cenario`, novo `GET /cenario` e retorno do valor original no consumidor.
- Nenhum outro campo do Cenario anual foi alterado nesta rodada.

## Etapa 4C.5 do Cenario anual

- A validacao isolada de `gasto_anual_particular` foi concluida em navegador autenticado local.
- O valor `gasto_anual_particular` foi alterado de `71250` para `72250`, persistido com um unico `POST /cenario`, confirmado no `GET /cenario` e refletido no painel financeiro de `Procedimentos`.
- Foi identificado e corrigido um parser local do formulario financeiro que zerava o valor monetario ao salvar por nao remover o prefixo `R$` do campo formatado.
- Em seguida, `gasto_anual_particular` foi restaurado para `71250`, com novo `POST /cenario`, novo `GET /cenario` e retorno do baseline no consumidor.
- Nenhum outro campo do Cenario anual foi alterado nesta rodada.

## Etapa 4C.6 do Cenario anual

- A validacao isolada de `gasto_anual_empresa` foi concluida em navegador autenticado local.
- O valor `gasto_anual_empresa` foi alterado de `130000` para `131000`, persistido com um unico `POST /cenario`, confirmado no `GET /cenario` e refletido no painel financeiro de `Procedimentos`.
- O mesmo `parseMoney` corrigido para o campo monetario do formulario financeiro permaneceu valido para a clinica, preservando o valor numerico `131000` no payload.
- Em seguida, `gasto_anual_empresa` foi restaurado para `130000`, com novo `POST /cenario`, novo `GET /cenario` e retorno do baseline no consumidor.
- Nenhum outro campo do Cenario anual foi alterado nesta rodada.

## Etapa 4C.7 do Cenario anual

- A validacao isolada do `modo_horas` foi concluida em navegador autenticado local.
- A troca `Perfil Flexivel -> Perfil Fixo` atualizou `horas_ano` para `1680`, recarregou `cfph`/`cfpm`, persistiu com um unico `POST /cenario`, refletiu em `GET /cenario` e apareceu no `dashboard-preview` de Procedimentos com custo fixo e valor minimo maiores.
- A restauracao `Perfil Fixo -> Perfil Flexivel` voltou a produzir `horas_ano = 1449`, `cfph = 138.88888888888889` e `cfpm = 2.314814814814815`, com novo `POST /cenario`, novo `GET /cenario` e retorno ao baseline no consumidor.
- Os perfis fixo e flexivel permaneceram intactos, sem alteracao dos respectivos valores internos.
- Nenhum outro campo numerico foi alterado nesta rodada.

## Etapa 4C.7B do Cenario anual

- O ciclo bidirecional do `modo_horas` foi concluido exclusivamente pela interface autenticada.
- A troca `Perfil Flexivel -> Perfil Fixo` foi feita pelo combo real e persistida pelo botao `Gravar`, com um unico `POST /cenario` gerado pela aplicacao.
- A reabertura e o F5 confirmaram `modo_horas = Perfil Fixo`, `horas_ano = 1680`, `cfph = 119.79166666666667` e `cfpm = 1.996527777777778`.
- A volta `Perfil Fixo -> Perfil Flexivel` tambem foi feita pelo combo real e persistida pela UI, com um unico `POST /cenario` gerado pela aplicacao.
- A reabertura e o F5 confirmaram o retorno ao baseline `modo_horas = Perfil Flexivel`, `horas_ano = 1449`, `cfph = 138.88888888888889` e `cfpm = 2.314814814814815`.
- O `dashboard-preview` de Procedimentos voltou ao baseline apos a restauracao e nao houve uso de POST manual nesta rodada.

## Etapa 4C.8 do Cenario anual

- A validacao isolada de `turnos_flex["1"].dias` foi concluida em navegador autenticado local.
- A celula da Segunda-feira mudou de `30` para `31`, atualizando `horas_ano` para `1458`, `total_horas_flex` para `1458`, `total_minutos_flex` para `87480`, `total_turnos_flex` para `364.5`, `cfph` para `138.0315500685871` e `cfpm` para `2.300525834476452`.
- O `POST /cenario` foi gerado uma unica vez pela interface e o `dashboard-preview` de Procedimentos refletiu o novo custo fixo e o novo valor minimo.
- A restauracao `31 -> 30` tambem foi feita pela UI, com um unico `POST /cenario`, e o `GET /cenario` voltou ao baseline completo.
- A matriz flexivel permaneceu intacta nas demais celulas e chaves.

## Etapa 4C.9 do Cenario anual

- A validacao isolada de `turnos_flex["1"].manha` foi concluida em navegador autenticado local.
- A Segunda-feira passou de `4` para `5` horas da manha, elevando `total_horas_flex` para `1479`, `total_minutos_flex` para `88740`, `total_turnos_flex` para `369.75`, `horas_ano` para `1479`, `cfph` para `136.07167004732926` e `cfpm` para `2.2678611674554876`.
- O `POST /cenario` foi gerado uma unica vez pela interface e o `dashboard-preview` de Procedimentos refletiu o novo custo fixo e o novo valor minimo.
- A restauracao `5 -> 4` tambem foi feita pela UI, com um unico `POST /cenario`, e o `GET /cenario` voltou ao baseline completo.
- A matriz flexivel permaneceu intacta nas demais celulas e chaves.

## Etapa 4C.10 do Cenario anual

- A validacao isolada de `num_consultorios_flex` foi concluida em navegador autenticado local.
- O valor `1` passou para `2`, duplicando a capacidade flexivel para `total_horas_flex = 2898`, `total_minutos_flex = 173880`, `total_turnos_flex = 724.5`, `horas_ano = 2898`, `cfph = 69.44444444444444` e `cfpm = 1.1574074074074074`.
- O `POST /cenario` foi gerado uma unica vez pela interface e o `dashboard-preview` de Procedimentos refletiu o custo fixo e o valor minimo novos.
- A restauracao `2 -> 1` tambem foi feita pela UI, com um unico `POST /cenario`, e o `GET /cenario` voltou ao baseline completo.
- A matriz flexivel e o Perfil Fixo permaneceram intactos.

## Etapa 4C.11 do Cenario anual

- A validacao isolada de `num_consultorios_fixo` com o Perfil Flexivel ativo foi concluida em navegador autenticado local.
- O valor do Perfil Fixo mudou de `1` para `2`, elevando `total_horas_fixo` para `3360`, `total_minutos_fixo` para `201600` e `total_turnos_fixo` para `840`.
- Como o perfil ativo permaneceu `Perfil Flexivel`, `horas_ano`, `cfph`, `cfpm` e o `dashboard-preview` de Procedimentos permaneceram no baseline.
- A restauracao `2 -> 1` tambem foi feita pela UI, com um unico `POST /cenario`, e o `GET /cenario` voltou ao baseline completo.
- O Perfil Flexivel e a matriz flexivel permaneceram intactos.

## Etapa 4C.13E do Cenario anual

- Foi identificada uma mutacao local transitoria apos `Gravar` no frontend React do Cenário anual.
- O POST de salvamento retornava apenas `{ detail: "Cenario salvo com sucesso." }`, e a resposta nao podia ser tratada como cenário completo.
- A correcao aplicada no hook preserva o estado atual quando a resposta nao contem campos do cenário.
- O baseline persistido comprovado permanece `10,5 / 20 / 210 / 8 / 1` com `1680 / 100800 / 420`.
- A comparacao de Procedimentos continua pendente.

## 2026-07-16 - Cenario anual: consolidacao da propagacao comparativa em Procedimentos

- A propagacao comparativa em `Procedimentos` foi comprovada com o procedimento `1065 - ABERTURA IMPLANTE`, usando um request idempotente em cinco estados consecutivos do Cenario anual.
- Os estados A, B e C acompanharam corretamente as mudancas de `cfpm` do Cenario persistido, e as leituras D/B e E/A voltaram exatamente aos valores esperados.
- O backend de Procedimentos usa `custo_fph = cfpm * tempo`, `custo_proc = custo_fph + custo_material + custo_laboratorial` e recalcula `valor_minimo` a partir dos custos e percentuais aplicaveis.
- O baseline final do Cenario anual foi restaurado para `modo_horas = Perfil Flexivel`, `horas_ano = 1449`, `cfph = 138.88888888888889` e `cfpm = 2.314814814814815`.
- A Etapa 4C.13 foi consolidada como funcionalmente concluida do ponto de vista de integracao e documentacao; fechamento Git e commit seletivo seguem como pendencias operacionais.

## 2026-07-16 - Cenario anual: validacao dos fluxos de fechamento sem salvar

- A validacao autenticada real confirmou `Cancelar`, botao `X`, tecla `Esc` e clique fora do modal como caminhos de fechamento sem persistencia.
- O modal permanece configurado com `keyboard = true` e `maskClosable = true`, e `onCancel` encerra a pagina sem disparar `POST /api/cenario`.
- A alteracao temporaria de `ir` de `10` para `11` foi descartada em todos os quatro fluxos; a reabertura e o F5 retornaram ao baseline `ir = 10`.
- Nenhum caminho de fechamento contaminou outras abas, nao houve defaults `12 / 22 / 264`, e o preview de Procedimentos permaneceu coerente com o baseline.
- A Etapa 4C.14 fica documentada como validada funcionalmente, sem alteracao de codigo.

## 2026-07-16 - Cenario anual: validacao de erro no GET e no POST

- A validacao autenticada real confirmou erro controlado de GET em `GET /api/cenario` e erro controlado de POST em `POST /api/cenario`.
- No GET falho, o loading terminou, a UI apresentou erro sem cair em defaults, e a recuperacao posterior por remoção da interceptacao voltou ao baseline integral.
- No POST falho, o saving terminou, a UI exibiu erro sem sucesso falso, a alteracao `ir = 11` nao foi persistida, e a nova tentativa sem interceptacao salvou e restaurou corretamente o baseline.
- O preview de Procedimentos permaneceu coerente com o baseline final e nenhuma interceptacao persistiu apos o teste.
- A Etapa 4C.15 fica documentada como validada funcionalmente, sem alteracao de codigo.

- A Etapa 4C.15B foi validada por testes automatizados controlados do hook/API do Cenário anual, sem depender de interceptacao instavel no navegador.
- O GET falho terminou com loading encerrado, erro controlado e sem mutacao para defaults; a recuperacao posterior voltou ao baseline completo.
- O POST falho terminou com saving encerrado, sem sucesso falso e com preservacao do estado atual; a nova tentativa concluiu com sucesso.
- A API passou a registrar de forma reprodutivel os erros estruturados com detail, e o smoke normal no navegador permaneceu estavel após os testes.

- A Etapa 4C.16 foi validada com guarda de salvamento concorrente no hook do Cenário anual, testes automatizados e smoke normal autenticado.
- O duplo clique em Gravar passou a gerar um unico POST, sem sucesso duplicado, e a restauracao final voltou ao baseline `ir = 10`.
- O fluxo permaneceu sem alteracao de backend, banco ou Procedimentos.

- A Etapa 4C.17 foi validada com bloqueio de persistencia para campos invalidos, exibindo mensagem para `horas_atendimento_dia = 0`, sem `POST /api/cenario` e com restauracao do baseline apos correcao para `8`.
- A frente permaneceu com 17 testes aprovados e build aprovado, sem alteracao de backend, banco ou Procedimentos.

## 2026-07-20 - ADM React: navegacao lateral MASTER

- O Painel ADM passou a usar um agrupador proprio no rail lateral principal do frontend React.
- A regra de acesso foi centralizada em `is_master` vindo da sessao `/me`.
- O submenu ADM ficou restrito a Visão geral, Clínicas, Usuários, Cobranças e Auditoria.
- A navegação horizontal interna em pills deixou de ser a camada ativa do ADM.
- Dashboard funcional, tabelas, acoes administrativas, commit e push permanecem pendentes.

## 2026-07-20 - ADM React: correção da emenda visual em L

- A faixa superior do shell ADM passou a considerar a largura do submenu lateral aberto no cálculo de alinhamento.
- A correção foi aplicada no shell global, sem tocar em Materiais.
- A frente permanece pendente de validação visual manual no navegador.

## 2026-07-20 - ADM React: visão geral funcional inicial

- A visão geral funcional inicial foi criada em `frontend-react/src/features/admin/overview/OverviewPage.jsx`.
- O endpoint real usado é `GET /superadmin/overview`.
- A toolbar da visão geral ganhou o botão `Atualizar` com loading.
- Os KPIs e o resumo online são de leitura, sem cálculo duplicado no frontend.
- Clínicas, usuários, cobranças e auditoria seguem como próximas etapas.

## 2026-07-20 - ADM React: visão geral com barra global e tabela-resumo

- O botão `Atualizar` foi movido para a faixa horizontal global do ADM.
- O texto `Visão geral` deixou de ocupar a barra.
- A visão geral passou a exibir uma tabela-resumo com dez colunas abaixo dos cards.
- Os textos técnicos da interface foram removidos da experiência final.

## Atualizacao - ADM Visao geral - ultimo acesso

- Auditoria de ultimo acesso concluida: classificacao `D`, sem campo real previo em modelo, banco, sessao ou auditoria.
- Campo de ultimo acesso concluido: `usuarios.ultimo_login_em`, nullable, `TIMESTAMP WITH TIME ZONE`, sem default e sem backfill.
- Exibicao na tabela concluida: `GET /superadmin/overview` retorna `ultimo_acesso` para o usuario responsavel da clinica.
- Nao regressao de login coberta por testes automatizados: login valido, login invalido, renew e logout.
- Validacao runtime no navegador ainda deve ser repetida com credencial operacional, console e network.

## Atualizacao - ADM Visao geral - correcao UTF-8 e secoes provisorias

- Correcao UTF-8 da Visao geral concluida nos textos dos cards, tabela e fallbacks.
- Titulo da tabela removido.
- Secao provisoria `Atividade recente` removida da composicao ativa.
- Backend, banco e migration nao foram alterados nesta etapa.

## 2026-07-20 - ADM React: Clinicas fase 1 leitura

- `ADM -> Clinicas` ganhou a primeira implementacao modular somente leitura no frontend React.
- O modulo usa `GET /superadmin/clinicas` com Bearer token e sem operacoes de escrita.
- A toolbar global do ADM passou a aceitar controles da secao ativa e, em Clinicas, exibe a superficie administrativa visual à esquerda e a busca textual à direita.
- A tabela exibe `ID`, `Clinica`, `Usuarios`, `Plano`, `Trial ate` e `Status`, com selecao unica de linha.
- A limpeza posterior removeu da implementacao ativa os combos `Status`, `Ativo`, `Plano`, o botao `Limpar filtros`, estados, handlers, opcoes e CSS exclusivos; o service React envia somente `q` e `limit`, preservando o backend sem alteracao.
- Os controles `+Teste`, `Suspender`, `Demo`, `Mensal`, `Anual`, `Super Admin`, `Novo usuário` e `Excluir` foram adicionados apenas como botoes desabilitados, sem conectar escrita.
- A tabela de Clinicas foi padronizada pelo modelo de `Tabelas -> Servicos de Protetico`, usando `BranaTable`, `TableColumnFilterHeader`, ordenacao/filtro/visibilidade por coluna, linhas compactas, rolagem `480`, rodape integrado e botoes da toolbar com `auxiliary-shell-button`.
- O botao `Atualizar` foi removido da toolbar; o refetch interno permanece para carregamento, busca e mutacoes.
- `+Teste` passou a executar a acao real `PATCH /superadmin/clinicas/{id}/trial-extra` com Spin inicial `10`, limites `1..3650`, confirmacao, loading proprio, auditoria backend e recarga da listagem apos sucesso.
- Permanecem pendentes: suspensao/ativacao, Demo, Mensal, Anual, Super Admin, Novo usuario, exclusao, exportacao, validacao runtime autenticada, commit, push e AWS.
## Atualizacao recente - ADM Clinicas Suspender / Ativar

- `ADM -> Clinicas` agora possui a acao real `Suspender`/`Ativar` no frontend React, reutilizando `PATCH /superadmin/clinicas/{id}/status`.
- O fluxo usa modal controlado, motivo opcional, hook `useUpdateClinicStatus`, service `updateAdminClinicStatus`, loading separado e refetch apos sucesso.
- `+Teste` permanece funcional e separado.
- Demo, Mensal, Anual, Super Admin, Novo usuario e Excluir seguem pendentes.
- Sem backend novo, banco, migration, login, renew, logout, commit, push ou AWS.
- Correcao textual posterior removeu mojibake do modal `Suspender`/`Ativar` na fonte JSX e adicionou teste negativo de regressao.
- Nao marcar `Suspender`/`Ativar` como concluido ate validacao runtime funcional de suspensao e ativacao em sessao MASTER local segura.
## Atualizacao recente - ADM Clinicas Demo

- `Demo` foi implementado no React com endpoint legado `PATCH /superadmin/clinicas/{id}/plano`.
- Payload React: `{ plano: "DEMO", manter_ativo: true }`.
- Semantica documentada: altera plano/tipo de conta para Demo, reinicia trial padrao de 7 dias via backend, mantem/reativa a clinica e sincroniza assinatura.
- `+Teste` e `Suspender/Ativar` permanecem preservados.
- `Mensal`, `Anual`, `Super Admin`, `Novo usuario`, `Excluir`, commit, push e AWS permanecem pendentes.
- Nao marcar Demo como concluido operacionalmente ate validar runtime autenticado em ambiente local com clinica descartavel/local.

## Atualizacao recente - ADM Clinicas Mensal

- `Mensal` foi implementado no React com endpoint legado `PATCH /superadmin/clinicas/{id}/plano`.
- Payload React: `{ plano: "MENSAL", manter_ativo: true }`.
- Semantica documentada: altera plano/tipo de conta para Mensal, reinicia validade padrao de 30 dias via backend, mantem/reativa a clinica, atualiza `data_ativacao` e sincroniza assinatura.
- O endpoint nao cria boleto, Pix, checkout ou cobranca.
- `+Teste`, `Suspender/Ativar` e `Demo` permanecem preservados.
- `Anual`, `Super Admin`, `Novo usuario`, `Excluir`, commit, push e AWS permanecem pendentes.
- Nao marcar Mensal como concluido operacionalmente ate validar runtime autenticado em ambiente local com clinica descartavel/local.

## Atualizacao recente - ADM Clinicas Anual

- `Anual` foi implementado no React com endpoint legado `PATCH /superadmin/clinicas/{id}/plano`.
- Payload React: `{ plano: "ANUAL", manter_ativo: true }`.
- Semantica documentada: altera plano/tipo de conta para Anual, reinicia validade padrao de 365 dias via backend, mantem/reativa a clinica, atualiza `data_ativacao` e sincroniza assinatura.
- O endpoint nao cria boleto, Pix, checkout ou cobranca; apenas sincroniza assinatura derivada e `proxima_cobranca_em`.
- `+Teste`, `Suspender/Ativar`, `Demo` e `Mensal` permanecem preservados.
- `Super Admin`, `Novo usuario`, `Excluir`, commit, push e AWS permanecem pendentes.
- Nao marcar Anual como concluido operacionalmente ate validar runtime autenticado em ambiente local com clinica descartavel/local.

## Atualizacao recente - ADM Clinicas Super Admin

- `Super Admin` foi implementado no React com endpoint legado `PATCH /superadmin/clinicas/{id}/plano`.
- Classificacao: mudanca apenas de plano da clinica, nao promocao de usuario.
- Payload React: `{ plano: "SUPERADMIN", manter_ativo: true }`.
- Semantica documentada: altera plano/tipo de conta para Super Admin, reinicia validade padrao de 365 dias via backend, mantem/reativa a clinica, atualiza `data_ativacao` e sincroniza assinatura.
- O endpoint nao cria boleto, Pix, checkout ou cobranca e nao altera `is_admin`, `is_master` ou `is_superadmin` de usuario.
- `+Teste`, `Suspender/Ativar`, `Demo`, `Mensal` e `Anual` permanecem preservados.
- `Novo usuario`, `Excluir`, commit, push e AWS permanecem pendentes.
- Nao marcar Super Admin como concluido operacionalmente ate validar runtime autenticado em ambiente local com clinica descartavel/local.

## Atualizacao recente - Primeiro acesso React

- O primeiro acesso no frontend React foi implementado em feature modular `frontend-react/src/features/firstAccess/`.
- A rota dedicada e `/app/primeiro-acesso`.
- O guard global em `App.jsx` redireciona usuarios autenticados com `setup_completed === false` para a pagina de primeiro acesso antes de renderizar o shell.
- Usuarios com setup concluido nao permanecem na rota de setup e entram normalmente no sistema.
- A pagina reutiliza o endpoint existente `POST /auth/setup/complete`, enviando apenas `{ senha, confirma_senha }`.
- Apos sucesso, o fluxo chama `refreshSession()` e so libera entrada quando `/me` retorna `setup_completed === true`.
- Backend produtivo, banco, migration, signup publico, login, logout e renew foram preservados.
- `ADM -> Clinicas -> Nova conta` foi implementado no React/FastAPI em 2026-07-21, com endpoint Owner-only `POST /superadmin/clinicas/nova-conta` e reutilizacao do provisionamento completo do signup.
- O primeiro acesso React recebeu correcao incremental de orientacao em 2026-07-21 para explicitar que a senha interna nao substitui a senha de login.

## Atualizacao recente - ADM Usuarios Fase 1 leitura

- `ADM -> Usuarios` foi liberado no submenu React em 2026-07-21.
- A rota `/app/adm/usuarios` usa feature modular `frontend-react/src/features/admin/users/`.
- A tela consome somente `GET /superadmin/usuarios`.
- A entrega inclui toolbar de leitura, busca, tabela compacta, selecao unica, filtros, ordenacao, colunas visiveis, rodape e estados de loading/erro/vazio.
- Acoes mutaveis de usuarios permanecem pendentes e devem ser contratadas em fase propria: criar, editar, ativar/inativar, alternar admin, resetar senha e excluir.
- Nao houve alteracao de backend, banco, migration, AWS, primeiro acesso ou ADM Clinicas nesta fase.

## Atualizacao recente - ADM Usuarios contrato de toolbar

- A toolbar historica de `ADM -> Usuarios` foi auditada em 2026-07-21 sem alteracao funcional.
- O painel local da clinica (`/admin/users`) foi separado do painel global ADM (`/superadmin/usuarios`).
- A toolbar futura recomendada foi documentada em `docs/contrato_toolbar_adm_usuarios_react.md`.
- `Exportar CSV` ficou recomendado antes das mutacoes por ser read-only.

## Atualizacao recente - ADM Usuarios Exportar CSV

- Subetapa implementada em 2026-07-21: `Exportar CSV` na toolbar global de `/app/adm/usuarios`.
- A acao usa `GET /superadmin/usuarios/export.csv` com token Bearer no header e download por blob.
- O nome do arquivo vem do `Content-Disposition`, com fallback sanitizado `usuarios-adm-YYYY-MM-DD.csv`.
- A exportacao aplica a busca server-side atual (`q`) e nao altera selecao, filtros locais, ordenacao ou dados da tabela.
- Permanecem fora desta subetapa: novo administrador, alterar, ativar/inativar, alternar admin, redefinir senha, perfis e excluir.
- Primeira mutacao recontratada: `Novo usuario`, com modal minimo, conta ativa alvo, tipo oficial e backend derivando privilegios.
- `Excluir`, `Perfis` e `Alterar` amplo permanecem fora da proxima fase ate contrato especifico.

## Atualizacao recente - ADM Usuarios Novo usuario auditoria

- Auditoria tecnica e funcional concluida em 2026-07-21 para preparar `ADM -> Usuarios -> Novo usuario`.
- Documentos criados: `docs/auditoria_novo_usuario_adm_tipos_contas.md` e `docs/contrato_novo_usuario_adm_react.md`.
- O endpoint atual `POST /superadmin/usuarios` foi classificado como B: reutilizavel apenas com alteracao minima contratual.
- Pontos obrigatorios antes da implementacao: bloquear conta suspensa no backend, remover `ativar_clinica`, aceitar tipo oficial, derivar `is_admin`, criar com `setup_completed=False`, validar confirmacao de senha e generalizar o texto do primeiro acesso.
- Nenhum botao, modal, endpoint, schema, usuario, banco, commit ou push foi criado nesta auditoria.

## Atualizacao recente - ADM Usuarios Ver detalhes

- Subetapa read-only implementada em codigo em 2026-07-21: `Ver detalhes` na toolbar global de `/app/adm/usuarios`.
- A acao usa exclusivamente o usuario selecionado ja retornado por `GET /superadmin/usuarios`.
- Nao foi criado endpoint de detalhe e nao houve metodo mutavel.
- O modal `Detalhes do usuario` possui somente `Fechar`, exibe campos ausentes como `Nao disponivel` e mostra badge `Protegido` quando houver indicador confiavel.
- `Ver conta`, `Novo usuario`, editar, ativar/inativar, alternar perfil, resetar senha e excluir permanecem pendentes.
- Nao marcar como concluido operacionalmente ate validar runtime autenticado em `/app/adm/usuarios` nos temas claro e escuro.

## Atualizacao recente - ADM Usuarios Presenca online

- Auditoria tecnica concluida em 2026-07-22 para a futura coluna `Online` em `/app/adm/usuarios`.
- Documentos criados: `docs/auditoria_presenca_online_usuarios.md` e `docs/contrato_coluna_online_adm_usuarios.md`.
- Decisao: nao usar `Status`, token valido, `usuarios.online`, `usuarios.ultimo_login_em` nem `updated_at` cadastral como prova de online.
- Arquitetura recomendada para implementacao futura: `usuarios.last_seen_at`, janela de 3 minutos, throttle de 60 segundos por usuario e `is_online` calculado no backend.
- Fase 1 backend concluida em codigo em 2026-07-22: migration/manual schema aditivo para `usuarios.last_seen_at`, model, helper central com throttle de 60 segundos, integracao com login, Google OAuth, setup complete e requests autenticadas.
- A estrategia transacional usa sessao curta propria nas requests autenticadas para evitar commit da transacao funcional; login/setup usam a sessao atual ja com commit proprio.
- Fase 2 concluida em codigo em 2026-07-22: `GET /superadmin/usuarios` retorna `last_seen_at`/`is_online`, a tabela React exibe `Online` imediatamente apos `Status`, remove a coluna visual independente `Protecao`, preserva protecao no subtitulo/modal/badge/regras e adiciona filtro, ordenacao e tooltip.
- Runtime visual autenticado, commit, push e AWS permanecem pendentes ate validacao final operacional.

## Atualizacao recente - ADM Usuarios toolbar visual

- Correcao pontual em 2026-07-22: a toolbar de `/app/adm/usuarios` deixou de usar `Button` do Ant Design com icones nos controles de acao.
- `Atualizar`, `Exportar CSV` e `Ver detalhes` agora usam `auxiliary-shell-button` e o agrupador `materiais-estoque-toolbar-actions`, seguindo o padrao visual Brana dos modulos de tabelas.
- A busca permanece no grupo direito.
- `Ver detalhes` foi ajustado para resolver a selecao a partir da lista normalizada carregada e continuar abrindo o modal read-only sem endpoint novo.
- Backend, banco, presenca online, coluna `Online`, ADM Clinicas, Materiais, Medicamentos, commit, push e AWS nao foram alterados nesta correcao.

## Atualizacao recente - ADM Usuarios modal Ver detalhes compacto

- Correcao visual pontual em 2026-07-22: o modal `Detalhes do usuario` foi redimensionado de `760` para `660` e recebeu compactacao interna.
- Header, body, aviso `Protegido`, secoes, grade, linhas, labels, valores, badges, footer e botao `Fechar` foram reduzidos proporcionalmente.
- O body passou a ser rolavel internamente com `max-height` baseado em viewport e sem scroll horizontal.
- As secoes `Identificacao`, `Conta`, `Vinculos` e `Sistema`, a presenca online, a ultima atividade e a protecao foram preservadas.
- Backend, banco, endpoint, normalizador, toolbar, tabela, Exportar CSV, commit, push e AWS nao foram alterados nesta correcao.
- Segunda compactacao aplicada na mesma data: largura `660 -> 580`, `max-height 74vh -> 66vh`, celulas `5px 7px -> 3px 5px` e breakpoint especifico do modal em `760px`.
- Terceira correcao visual aplicada: largura `580 -> 680`, remocao do `66vh` baixo no desktop, body sem scroll forçado em desktop normal e ellipsis com tooltip para campos longos.
- Ajuste horizontal final aplicado: largura `680 -> 800`, proporcao `label 14% / valor 36%`, mantendo altura natural, `max-height`, overflow, header, body e footer inalterados.
- Correcao estrutural final aplicada: a grade visual do modal deixou de depender de `Descriptions` e passou a usar seis trilhas comuns, alinhando `Identificacao`, `Conta`, `Vinculos`, `Sistema`, `Ultimo acesso` e `Protecao` sem alterar o tamanho geral aprovado.
- Refinamento visual final aplicado: respiro uniforme de `8px` entre blocos e aumento controlado de 1px em labels/valores internos, preservando largura `800`, altura natural, grade de seis trilhas, responsividade, presenca online e protecao.
- Acao read-only `Ver conta` implementada: a toolbar de `/app/adm/usuarios` navega para `/app/adm/clinicas` com `clinica_id` via estado transitorio do `App.jsx`, e Clinicas seleciona a conta vinculada por ID exato sem mutacoes.

## Atualizacao recente - ADM Cobranca auditoria

- Auditoria documental e tecnica concluida em 2026-07-22 para iniciar `ADM -> Cobranca`.
- Documento criado: `docs/auditoria_adm_cobranca_react.md`.
- O dominio foi separado do financeiro operacional da clinica, conta corrente, fluxo de caixa, plano de contas, convenios/planos odontologicos e formas de cobranca de procedimentos.
- O legado usa `saCarregarCobrancas()` e `GET /superadmin/cobrancas?limit=80`, renderizando `ID`, `Clinica`, `Plano`, `Status`, `Valor`, `Origem` e `Data`.
- Backend reutilizavel confirmado: `GET /superadmin/cobrancas` com `_require_superadmin`, filtro opcional por `status` e `limit`.
- `GET /superadmin/assinaturas` foi classificado como visao complementar derivada para fase posterior.
- Primeira fase segura recomendada: tabela React read-only de cobrancas de plataforma, sem checkout, Pix, boleto, confirmacao de pagamento, sincronizacao Mercado Pago, webhook ou qualquer mutacao financeira.

## Atualizacao recente - ADM Cobrancas Fase 1 leitura

- Implementacao read-only concluida em codigo em 2026-07-22 para `/app/adm/cobrancas`.
- O submenu ADM habilita `Cobrancas`, preservando shell global em L e guard MASTER.
- A tela consome somente `GET /superadmin/cobrancas`, com service, hook, normalizer, formatters, tabela e toolbar modulares em `frontend-react/src/features/admin/billing/`.
- Entrega: `Atualizar`, `Buscar cobranca`, listagem real, selecao unica, filtros por coluna, ordenacao, controle de colunas visiveis, rodape e estados de loading/erro/vazio.
- A busca e local no frontend; nao foi criado parametro `q` no backend.
- Backend, banco, migration, checkout, Pix, boleto, confirmacao de pagamento, sincronizacao Mercado Pago, webhook, cancelamento, reembolso, modal de detalhes, CSV, commit, push e AWS permanecem fora desta rodada.

## Atualizacao recente - ADM Cobrancas correcao runtime visual

- Correcao pontual em 2026-07-22: `ADM -> Cobrancas` deixou de substituir a tabela por um card vazio quando o endpoint retorna zero registros.
- A tabela permanece renderizada com `ID`, `Clinica`, `Plano`, `Status`, `Valor`, `Origem` e `Data`.
- O vazio real usa `Nenhuma cobrança encontrada.` dentro do corpo da tabela.
- O vazio por busca/filtro usa `Nenhuma cobrança corresponde aos filtros aplicados.` e preserva o total carregado no rodape.
- Textos visiveis foram corrigidos para UTF-8 real, removendo escapes literais como `cobran\u00e7a` do runtime.
- Backend, endpoint, banco, migration, rota, menu, toolbar, shell, tema, commit, push e AWS nao foram alterados.
- Validacao visual autenticada automatizada ficou pendente nesta sessao porque o navegador controlavel nao possuia sessao MASTER/Owner e redirecionou para `/app/login`; a ferramenta bloqueou preparacao de sessao via URL `javascript:`.

## Atualizacao recente - ADM Cobrancas auditoria de dados vazios

- Auditoria curta, somente leitura, concluida em 2026-07-22 para explicar o estado vazio em runtime.
- `GET /superadmin/cobrancas?limit=80` retornou HTTP 200 com array vazio (`[]`) no banco local.
- `plataforma_cobrancas` possui 0 registros locais; `plataforma_assinaturas` possui dados de estado derivado, nao eventos de cobranca.
- As cobrancas sao criadas automaticamente pelos fluxos de licenca/checkout/pagamento em `licenca_routes.py` e `platform_admin_service.py`; nao foi encontrado seed/manual padrao.
- Proxima funcionalidade segura recomendada: `Ver conta`, usando `clinica_id` ja retornado pelo contrato quando houver registros.
- `Exportar CSV` pode ser feito client-side com o GET atual; `Ver detalhes` deve evitar `payload_json` ate contrato especifico.

## Atualizacao recente - ADM Cobrancas Ver conta

- Acao read-only `Ver conta` implementada em 2026-07-22 na toolbar de `/app/adm/cobrancas`.
- Toolbar da etapa: `Atualizar`, `Ver conta`, `Buscar cobranca`.
- O botao depende de selecao unica e de `clinica_id` valido no item selecionado.
- A navegacao usa `onAdminNavigate('adm-clinicas', { selectedClinicId })`, reaproveitando a selecao por ID exato ja existente em Clinicas.
- Nenhum backend, endpoint, banco, migration, checkout, webhook, status financeiro, valor, CSV, detalhes, commit, push ou AWS foi alterado nesta etapa.

## Atualizacao recente - ADM Cobrancas Exportar CSV

- Acao read-only `Exportar CSV` implementada em 2026-07-22 na toolbar de `/app/adm/cobrancas`.
- Toolbar da etapa: `Atualizar`, `Exportar CSV`, `Ver conta`, `Buscar cobranca`.
- A exportacao usa somente as linhas ja carregadas/visiveis no frontend e nao faz nova requisicao.
- Nenhum endpoint novo, backend, banco, migration, seed, checkout, webhook, assinatura, detalhe, acao mutavel, commit, push ou AWS foi adicionado.

## Atualizacao recente - ADM Cobrancas Ver detalhes

- Acao read-only `Ver detalhes` implementada em 2026-07-22 na toolbar de `/app/adm/cobrancas`.
- Toolbar da etapa: `Atualizar`, `Exportar CSV`, `Ver detalhes`, `Ver conta`, `Buscar cobranca`.
- O modal usa somente a linha selecionada ja carregada no frontend.
- Nao ha request adicional, endpoint novo, `payload_json`, backend, banco, migration, seed, checkout, webhook, pagamento, cancelamento, reembolso, commit, push ou AWS.
- Documento criado: `docs/implementacao_adm_cobrancas_ver_detalhes.md`.
## Atualizacao recente - ADM Auditoria auditoria inicial

- Auditoria documental e tecnica iniciada em 2026-07-23 para `ADM -> Auditoria`.
- O legado atual confirma tabela simples com cinco colunas e endpoint `GET /superadmin/auditoria?limit=80`.
- O banco possui a tabela `plataforma_auditoria` com `actor_user_id`, `actor_email`, `acao`, `alvo_tipo`, `alvo_id`, `detalhes_json`, `ip` e `criado_em`.
- O histórico operacional mostra eventos de clínicas, usuários, cobranças/licença e editor de textos/PDF.
- A fase inicial recomendada continua read-only, sem mutação, sem exclusão e sem limpeza de logs.

## Atualizacao recente - ADM Auditoria Fase 1 implementada

- A Fase 1 funcional foi implementada em 2026-07-23 no frontend React.
- A seção `Auditoria` foi habilitada no menu ADM.
- A toolbar atual ficou restrita a `Atualizar | Buscar evento`.
- O painel mantém tabela read-only compacta com cinco colunas, seleção única, filtros, ordenação, controle de colunas, rodapé, loading, vazio e erro.
- Exportação CSV, detalhes e navegação por alvo permanecem fora desta fase.

## Frente em documentacao - Conta corrente do cirurgião

- Documento dedicado criado em `docs/auditoria_conta_corrente_cirurgiao.md`.
- Contrato alvo documentado: `Lancamento.prestador_id -> PrestadorOdonto.id`.
- Estrategia aprovada: preservar `Lancamento`, preservar `conta`, adicionar futuramente `prestador_id` nullable e manter `CLINICA` sem prestador individual.
- Primeira entrega futura: somente a tela principal React, deixando `rcc-panel` e `rview-panel` para etapas posteriores.
