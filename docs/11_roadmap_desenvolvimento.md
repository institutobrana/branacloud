# COMO USAR ESTE ARQUIVO

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

## Estado validado recente

- Login, senha interna e perfis: validado manualmente.
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

## Proximas prioridades sugeridas

- Atualizar `README.md`, `README_WEB.md` e `backend/README.md` em trilha separada.
- Consolidar a documentacao por modulo sem misturar contratos vigentes com historico.
- Decidir o destino dos untracked antigos fora da trilha principal.
- Tratar mojibake/UTF-8 em trilha propria, sem misturar com correcoes funcionais.
- Retomar modularizacao/refatoracao somente depois da documentacao base estar consolidada.
- Revisar anamnese/SQLServer/restauracao em trilha separada.

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
- Principais achados sobre prestadores/profissionais: `PRESTADOR` e a tabela clara de prestador; `PREST_ESP` e a junção formal com especialidades; `PESSOAL` e amplo cadastro de pessoas com FK para prestador; `CCCIRURGIAO` e operacional com `ID_PRESTADOR` por nomenclatura.
- Principais achados sobre vinculos: `USUARIO_FUNCAO`, `USUARIO_MODULO` e `USUARIO_PERFIL` possuem FKs formais e representam os vinculos de acesso/perfil; `TMP_PARTICIPACAO` e auxiliar/temporaria sem FKs observadas.
- Nao houve implementacao.
- Nao houve alteracao no EasyDental.
- Proxima subetapa recomendada: `EasyDental virgem - Subetapa 3 - analise estrutural somente leitura de permissoes, perfis, modulos e funcoes`.

## Subetapa 3 da frente EasyDental virgem

- Subetapa executada: analise estrutural somente leitura de permissoes, perfis, modulos e funcoes.
- Tabelas analisadas: `SIS_FUNCAO`, `SIS_MODULO`, `SIS_PERFIL`, `USUARIO_FUNCAO`, `USUARIO_MODULO`, `USUARIO_PERFIL`, `USUARIO`, `_TIPO_USUARIO`, `PRESTADOR`, `UNIDADE`.
- Contagens registradas: `SIS_FUNCAO` 127, `SIS_MODULO` 52, `SIS_PERFIL` 10, `USUARIO_FUNCAO` 740, `USUARIO_MODULO` 312, `USUARIO_PERFIL` 184, `USUARIO` 7, `_TIPO_USUARIO` 10, `PRESTADOR` 5, `UNIDADE` 1.
- `SIS_PERFIL` nao apresenta um perfil nomeado explicitamente como administrador; os nomes sao funcionais, como `Pacientes`, `Intervenções`, `Agenda de horários`, `Controle de estoque` e relatórios.
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
- Proxima subetapa recomendada: `EasyDental virgem - Subetapa 5 - analise somente leitura de Intervenções/Procedimentos, seeds odontológicos e tabelas clínicas estruturais`.

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
- Foco documental: fechamento do papel de `Mestre` e `Clínica`, sem forcar conclusao literal onde a busca textual nao confirmou o termo `Mestre`.
- Resultado preliminar: `Clínica` foi localizada de forma literal em `USUARIO 255` / `PRESTADOR 255` / `UNIDADE 1`; `Mestre` permanece como papel admin-like inferido, com `USUARIO 1` como melhor equivalente funcional.
- Matriz completa EasyDental x Brana: classifica tabelas em manter Brana atual, regular no contrato, incluir no contrato de novas contas, melhorar equivalente existente, nao incluir ou deixar pendente.
- Regra reforcada: nao duplicar conceitos que ja existem no Brana; quando o EasyDental for melhor, registrar como melhoria do equivalente existente em vez de criar novo conceito.
- Regra reforcada: logs, historicos, transacionais e temporarios nao devem nascer como seed de novas contas.
- Nao houve implementacao.
- Nao houve alteracao no EasyDental.
- Nenhuma conta foi criada ou alterada.
- Proxima subetapa recomendada: `EasyDental virgem - Subetapa 8B - fechamento final do contrato de usuarios/prestadores e matriz de seeds para novas contas, sem implementacao`.

## Subetapa 8B da frente EasyDental virgem

- Subetapa executada: fechamento final do contrato de usuarios, prestadores e seeds, sem implementacao.
- Decisao final documental: `Clínica` permanece como papel estrutural literal (`USUARIO 255` / `PRESTADOR 255` / `UNIDADE 1`); `Mestre` permanece como admin-like inferido (`USUARIO 1` / `PRESTADOR 1`).
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
  - prestador Clínica correto;
  - prestador ADM/Mestre funcional correto;
  - prestador ADM com tipo Cirurgião dentista.
- Nova pendencia funcional registrada: o modulo Usuários ainda precisa nascer com Tipo de usuário = Dentista (CD), prestador associado = prestador ADM/Mestre funcional e unidade de atendimento = Principal / 0001.
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
  - `PRESTADOR.raw` e `USUARIO.raw` confirmam `Clínica` como referencia estrutural do legado.
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

- Subetapa executada: confirmação complementar no UNC principal sobre usuário, prestador, unidade e setup, sem implementação.
- Motivo da confirmação: a 8T-B usou mirror local porque o UNC principal não estava acessível naquela sessão; nesta sessão o UNC voltou a responder.
- Resultado do acesso ao UNC principal: acessível.
- Achados confirmados:
  - `Mestre` em `USUARIO.raw` e `PRESTADOR.raw`.
  - `Clínica` em `PRESTADOR.raw` e na referência estrutural da base.
  - `Dentista (CD)` em `_TIPO_USUARIO.raw`.
  - `Principal / 0001` em `UNIDADE.raw`.
  - `USUARIO.ID_UNIDADE` e `USUARIO.ID_PRESTADOR` no layout de `eds70.sql`.
  - `ControleUsuarios=0` e `Auditoria=0` em `SISTEMA.raw`.
  - ausência de setup genérico obrigatório para todo usuário novo nos arquivos consultados.
- Regra confirmada:
  - o usuário ADM inicial das novas contas deve nascer como `Dentista (CD)`;
  - deve apontar para o prestador ADM/Mestre funcional;
  - deve apontar para `Principal / 0001`;
  - setup continua apenas para o ADM inicial;
  - setup não deve aparecer para usuários criados depois.
- Próxima subetapa liberada: `8U`, mantendo `8V` separada e posterior.
- Não houve implementação.
- Nenhum código foi alterado.
- Nenhum banco foi alterado.
- Nenhum arquivo EasyDental foi alterado.
- Nenhuma conta foi criada ou excluída.
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
- A recomendacao para a proxima etapa passa a ser uma implementacao isolada de permissões padrao para usuarios novos, ou contrato complementar se ainda houver duvida.
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
- Os checks executados confirmaram `default_permissions()` para Dentista (CD), Clínica, Gerente administrativo, Funcionário(a) administrativo(a) e admin com os valores esperados.
- O comportamento do checkbox `Ativar controle de usuarios e senhas` foi preservado; esta etapa nao mudou seu default nem a sua persistencia.
- A validacao manual recomendada agora e criar um novo usuario nao-admin e conferir que os modulos comuns nascem livres, com `Usuarios` e `Opcoes do Sistema/Configuracao` protegidos.
- A proxima subetapa recomendada passa a ser a validacao manual da 8W-B.
- Confirmacao funcional: nenhuma conta foi criada automaticamente e nenhum acesso existente foi reescrito.
- A blindagem textual/mojibake foi respeitada.
## Subetapa 8U-C da frente EasyDental virgem

- Subetapa executada: validacao manual bem-sucedida da nova conta apos 8P/8K/8R/8U.
- Validacao informada pelo usuario: testes ok, conta criada corretamente e 8U-C considerada ok.
- Itens confirmados: `signup/confirm`, unidade `Principal / 0001`, tabelas da 8P, `Tabela Exemplo` ausente, `Brana` padrao/privada, prestador `Clínica`, prestador ADM/Mestre funcional, tipo `Cirurgiao dentista` no prestador ADM, usuario ADM como `Dentista (CD)`, vinculo ao prestador ADM e vinculo a unidade `Principal / 0001`.
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
  - abrir o modulo Usuários e confirmar `Dentista (CD)`, prestador ADM e unidade `Principal / 0001`;
  - abrir o modulo Prestadores e confirmar `Clínica` e o prestador ADM;
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

[Ã¢Å“â€] Fase 1 - Login por email e senha implementado em `POST /login`.
[Ã¢Å“â€] Fase 2 - JWT implementado em `backend/security/jwt_handler.py` usando `JWT_SECRET_KEY` obrigatoria.
[Ã¢Å“â€] Fase 3 - Endpoint `/me`, logout, setup inicial e validacao de usuario atual implementados.
[Ã¢Å“â€] Fase 4 - Cadastro com codigo, recuperacao de senha e Google OAuth presentes em `auth_routes.py`.
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

[Ã¢Å“â€] Fase 1 - CRUD administrativo de usuarios presente em `backend/routes/user_admin_routes.py`.
[Ã¢Å“â€] Fase 2 - Controle de perfis e vinculos presente em `access_profile.py` e `usuario_perfil_acesso.py`.
[Ã¢Å“â€] Fase 3 - Matriz de permissoes por modulo implementada em `backend/security/permissions.py`.
[Ã¢Å“â€] Fase 4 - Modulos protegidos com senha administrativa/grant temporario implementados em `dependencies.py`.
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

[Ã¢Å“â€] Fase 1 - Modelo `Paciente` implementado em `backend/models/paciente.py`.
[Ã¢Å“â€] Fase 2 - Rotas de pacientes implementadas em `backend/routes/cadastros_routes.py`.
[Ã¢Å“â€] Fase 3 - Frontend chama endpoints de pacientes em `frontend/app.js`.
[Ã¢Å“â€] Fase 4 - Filtros por `clinica_id` aparecem nas consultas principais.
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

[Ã¢Å“â€] Fase 1 - Auxiliares, grupos, categorias e simbolos graficos existem em `cadastros_routes.py`.
[Ã¢Å“â€] Fase 2 - Unidades de atendimento existem em `unidades_atendimento_routes.py`.
[Ã¢Å“â€] Fase 3 - CID existe em `cid_routes.py`.
[Ã¢Å“â€] Fase 4 - Frontend possui chamadas para cadastros e menus auxiliares.
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

[Ã¢Å“â€] Fase 1 - Eventos e bloqueios de agenda existem em `agenda_legado.py`.
[Ã¢Å“â€] Fase 2 - Rotas principais implementadas em `agenda_legado_routes.py`.
[Ã¢Å“â€] Fase 3 - Contatos de agenda implementados em `agenda_contatos_routes.py`.
[Ã¢Å“â€] Fase 4 - Frontend possui tela e chamadas para agenda, repeticao, combos e filtros.
[Ã¢Å“â€] Fase 5 - Integracao Google Calendar presente em rotas e servicos.
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

[Ã¢Å“â€] Fase 1 - Modelos financeiros existem em `backend/models/financeiro.py`.
[Ã¢Å“â€] Fase 2 - Lancamentos, categorias, formas de pagamento e situacoes existem em `financeiro_routes.py`.
[Ã¢Å“â€] Fase 3 - Relatorio de conta corrente e fluxo de caixa existem no backend e frontend.
[Ã¢Å“â€] Fase 4 - Indices financeiros e cotacoes existem em `indices_financeiros_routes.py`.
[Ã¢Å“â€] Fase 5 - Cenario financeiro existe em `cenario_routes.py`.
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

[Ã¢Å“â€] Fase 1 - Modelos de procedimento, fases, materiais e tabelas existem.
[Ã¢Å“â€] Fase 2 - CRUD de tabelas e procedimentos existe em `procedimentos_routes.py`.
[Ã¢Å“â€] Fase 3 - Procedimentos genericos existem em `cadastros_routes.py`.
[Ã¢Å“â€] Fase 4 - Dashboard e relatorio de tabela existem no backend/frontend.
[Ã¢Å“â€] Fase 5 - Vinculo de materiais a procedimentos existe.
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

[Ã¢Å“â€] Fase 1 - Modelo `Tratamento` existe em `backend/models/tratamento.py`.
[Ã¢Å“â€] Fase 2 - Rotas existem em `backend/routes/tratamentos_routes.py`.
[Ã¢Å“â€] Fase 3 - Combos de novo tratamento existem no backend.
[Ã¢Å“â€] Fase 4 - Frontend possui chamadas vinculadas ao contexto de paciente/procedimentos.
[ ] Fase 5 - Testar ciclo completo de tratamento por paciente e isolamento por clinica.

Proximo passo:

* Validar criacao de tratamento a partir de paciente real e confirmar vinculos com cirurgioes/prestadores.

Observacoes:

* Modulo depende de paciente, procedimentos e usuarios/prestadores.
* Usa permissao `procedimentos`.
* Deve manter filtro por `clinica_id` em todos os acessos.

---

## Modulo: Prestadores

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Modelos de prestadores existem em `prestador.py` e `prestador_odonto.py`.
[Ã¢Å“â€] Fase 2 - Rotas de prestadores existem em `prestadores_routes.py`.
[Ã¢Å“â€] Fase 3 - Credenciamentos e comissoes existem no backend.
[Ã¢Å“â€] Fase 4 - Frontend possui tela/chamadas para prestadores.
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

[Ã¢Å“â€] Fase 1 - Modelos `ConvenioOdonto`, `PlanoOdonto` e `CalendarioFaturamentoOdonto` existem.
[Ã¢Å“â€] Fase 2 - Rotas existem em `convenios_planos_routes.py`.
[Ã¢Å“â€] Fase 3 - Frontend possui chamadas para convenios, planos e calendario.
[Ã¢Å“â€] Fase 4 - Combos sao usados por pacientes/prestadores/agenda.
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

[Ã¢Å“â€] Fase 1 - Modelos `ListaMaterial` e `Material` existem.
[Ã¢Å“â€] Fase 2 - Rotas CRUD existem em `materiais_routes.py`.
[Ã¢Å“â€] Fase 3 - Frontend possui chamadas para listas, materiais e indices.
[Ã¢Å“â€] Fase 4 - Materiais vinculam com procedimentos.
[ ] Fase 5 - Testar vinculos antes de excluir materiais/listas.

Proximo passo:

* Criar validacao/teste para impedir quebra de procedimentos ao remover material em uso.

Observacoes:

* Modulo usa permissao `materiais`.
* Relaciona-se diretamente com procedimentos.

---

## Modulo: Medicamentos e Restricoes Terapeuticas

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Modelos `Medicamento` e `RestricaoTerapeutica` existem.
[Ã¢Å“â€] Fase 2 - Rotas CRUD e opcoes existem em `medicamentos_routes.py`.
[Ã¢Å“â€] Fase 3 - Frontend possui chamadas para medicamentos, grupos, apresentacoes e usos.
[Ã¢Å“â€] Fase 4 - Editor de textos consulta medicamentos para assistente de receitas.
[ ] Fase 5 - Testar integracao com receitas e filtros por clinica.

Proximo passo:

* Validar fluxo: cadastrar medicamento, listar no assistente de receitas e gerar documento.

Observacoes:

* Modulo usa permissao `anamnese` no router atual.
* Tem relacao com editor de textos e receitas.

---

## Modulo: Proteticos e Controle Protetico

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Modelos `Protetico`, `ServicoProtetico` e `ControleProtetico` existem.
[Ã¢Å“â€] Fase 2 - Rotas de proteticos existem em `proteticos_routes.py`.
[Ã¢Å“â€] Fase 3 - Rotas de controle existem em `controle_proteticos_routes.py`.
[Ã¢Å“â€] Fase 4 - Agenda contatos pode criar/usar proteticos.
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

[Ã¢Å“â€] Fase 1 - Questionarios e perguntas existem em `anamnese.py`.
[Ã¢Å“â€] Fase 2 - Respostas existem em `anamnese_resposta.py`.
[Ã¢Å“â€] Fase 3 - Rotas CRUD e respostas por paciente existem em `anamnese_routes.py`.
[Ã¢Å“â€] Fase 4 - Frontend possui chamadas para questionarios, perguntas e respostas.
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

[Ã¢Å“â€] Fase 1 - Modelos de documentos existem em `modelo_documento.py`.
[Ã¢Å“â€] Fase 2 - Rotas de editor/modelos/mesclagem existem em `editor_textos_routes.py`.
[Ã¢Å“â€] Fase 3 - Exportacao PDF existe em `editor_pdf_service.py`.
[Ã¢Å“â€] Fase 4 - Assinatura digital/local e preparacao para Acrobat existem.
[Ã¢Å“â€] Fase 5 - Assistentes de receita e atestado existem.
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
* FASE 6.2: modal de campos de mesclagem refinado com deduplicacao visual por alias historico (ex.: `Data.MêsExtenso` oculto em favor de `Data.MêsExt`), mantendo token principal de insercao e sem alterar a fonte primaria restaurada.
* FASE 6.2: coluna de descricao do modal passa a exibir rótulos amigaveis na categoria Data (`Ano atual`, `Data atual`, `Dia atual`, `Dia da semana`, `Mês atual`, `Mês por extenso`) e renderizacao visual da grade foi ajustada para melhorar leitura de Campo/Descricao.
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

[Ã¢Å“â€] Fase 1 - Modelos de etiqueta existem.
[Ã¢Å“â€] Fase 2 - Rotas de etiquetas existem em `etiquetas_routes.py`.
[Ã¢Å“â€] Fase 3 - Configuracao de relatorio existe em `relatorio_config.py` e `preferences_routes.py`.
[Ã¢Å“â€] Fase 4 - Envio de relatorio por email existe em `relatorios_routes.py`.
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

[Ã¢Å“â€] Fase 1 - Preferencias gerais, modelos, ambiente, dados do usuario, odontograma e relatorio existem.
[Ã¢Å“â€] Fase 2 - Rotas de preferencias existem em `preferences_routes.py`.
[Ã¢Å“â€] Fase 3 - Opcoes do sistema existem em `system_options_routes.py`.
[Ã¢Å“â€] Fase 4 - Frontend possui chamadas para salvar preferencias.
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

[Ã¢Å“â€] Fase 1 - Modelos de planos, assinaturas e plataforma existem.
[Ã¢Å“â€] Fase 2 - Rotas de licenca existem em `licenca_routes.py`.
[Ã¢Å“â€] Fase 3 - Checkout, confirmacao, sincronizacao e webhook Mercado Pago existem no codigo.
[Ã¢Å“â€] Fase 4 - Frontend possui chamadas para licenca e checkout.
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

[Ã¢Å“â€] Fase 1 - Rotas de overview, clinicas, usuarios, cobrancas, auditoria e assinaturas existem.
[Ã¢Å“â€] Fase 2 - Servico de administracao de plataforma existe em `platform_admin_service.py`.
[Ã¢Å“â€] Fase 3 - Frontend possui chamadas para `/superadmin/*`.
[Ã¢Å“â€] Fase 4 - Alteracoes de status/plano/trial e reset de senha existem no codigo.
[ ] Fase 5 - Testar autorizacao de superadmin e impedir acesso por admin comum.

Proximo passo:

* Criar teste de acesso: superadmin permitido, admin de clinica negado, usuario comum negado.

Observacoes:

* Modulo atravessa clinicas e e altamente sensivel.
* Nao alterar sem revisar regras em `security/superadmin.py` e `superadmin_routes.py`.

---

## Modulo: Frontend Web

Status: EM DESENVOLVIMENTO

Fases:

[Ã¢Å“â€] Fase 1 - Frontend estatico servido por `backend/main.py` em `/app` e `/frontend`.
[Ã¢Å“â€] Fase 2 - Login, token, chamadas autenticadas e varias telas operacionais existem em `frontend/app.js`.
[Ã¢Å“â€] Fase 3 - Arquivos auxiliares de prestadores, agenda, preferencias e dialogo de fonte existem.
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

[Ã¢Å“â€] Fase 1 - Conexao PostgreSQL implementada em `backend/database.py`.
[Ã¢Å“â€] Fase 2 - Modelos SQLAlchemy implementados em `backend/models/`.
[Ã¢Å“â€] Fase 3 - `Base.metadata.create_all` e hotfixes aditivos existem no startup.
[Ã¢Å“â€] Fase 4 - Bootstrap runtime existe em `runtime_bootstrap_service.py`.
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

[Ã¢Å“â€] Fase 1 - Email SMTP/Resend existe em `email_service.py`.
[Ã¢Å“â€] Fase 2 - Google OAuth/Calendar existe em `auth_routes.py` e `google_calendar_service.py`.
[Ã¢Å“â€] Fase 3 - Mercado Pago existe em `licenca_routes.py`.
[Ã¢Å“â€] Fase 4 - WhatsApp aparece no fluxo de avisos da agenda.
[Ã¢Å“â€] Fase 5 - Assinatura PDF possui variaveis e servico dedicados.
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
- A classificacao multiárea herdada permanece `mista`.
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
- Wrapper compatível preservado em `frontend/app.js`.
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
- Nao houve alteracao de frontend, backend, banco, schema, migrations, seeds, endpoints ou permissões.
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
- Nenhum arquivo de frontend, backend, banco, schema, migrations, seeds, endpoints, permissões, `package.json` ou configuracao foi alterado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e a implementacao minima do helper puro mais seguro, com validacao manual do fluxo de ambiente.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 4

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 4 foi concluida com implementacao minima do helper puro `prefAmbEstiloPadrao`.
- Os arquivos alterados foram `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_preferencias_configuracoes_subetapa_4_implementacao_pref_amb_estilo_padrao.md`.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissões foi alterado.
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
- Nenhum backend, banco, schema, migrations, seeds, endpoints, permissões, `frontend/index.html` ou configuracao foi alterado nesta validacao.
- A proxima subetapa recomendada e a implementacao minima do helper puro `prefValoresPadraoDados`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 5

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 5 foi concluida com implementacao minima do helper puro `prefValoresPadraoDados`.
- Os arquivos alterados foram `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_preferencias_configuracoes_subetapa_5_implementacao_pref_valores_padrao_dados.md`.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissões foi alterado.
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
- Nenhum backend, banco, schema, migrations, seeds, endpoints, permissões, `frontend/index.html` ou configuracao foi alterado nesta validacao.
- A proxima subetapa recomendada e a implementacao minima do helper puro `prefValoresPadraoOdontograma`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 6

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 6 foi concluida com implementacao minima do helper puro `prefValoresPadraoOdontograma`.
- Os arquivos alterados foram `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_preferencias_configuracoes_subetapa_6_implementacao_pref_valores_padrao_odontograma.md`.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissões foi alterado.
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
- Nenhum backend, banco, schema, migrations, seeds, endpoints, permissões, `frontend/index.html` ou configuracao foi alterado nesta validacao.
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
- Nenhum backend, banco, schema, migrations, seeds, endpoints, permissões, `frontend/index.html` ou configuracao foi alterado nesta etapa.
- A proxima subetapa recomendada e a implementacao minima do helper puro `prefAmbienteTextoExemplo`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 9

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 9 foi concluida com implementacao minima do helper puro `prefAmbienteTextoExemplo`.
- Os arquivos alterados foram `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_preferencias_configuracoes_subetapa_9_implementacao_pref_ambiente_texto_exemplo.md`.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissões foi alterado.
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
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissões foi alterado nesta validacao.
- A proxima subetapa recomendada e a implementacao minima do helper puro `prefAmbienteDialogoValor`.

## Atualizacao Preferencias / Configuracoes Comuns - Subetapa 11

- `Preferencias / Configuracoes comuns` continua tratada como `core / comum`.
- A Subetapa 11 foi concluida com implementacao minima do helper `prefAmbienteDialogoValor`.
- Os arquivos alterados foram `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_preferencias_configuracoes_subetapa_11_implementacao_pref_ambiente_dialogo_valor.md`.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissões foi alterado.
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
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissões foi alterado nesta validacao.
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
- Foram comparados `Ficha pessoal`, `Conta corrente`, `Relatorios`, `Indices financeiros`, `Cadastros auxiliares`, `Convênios e Planos`, `Plano de Contas`, `Medicamentos`, `Materiais`, `Procedimentos genericos`, `Tabela de servicos de protese / Tabela de proteticos`, `Etiquetas`, `Simbolos graficos` e outras frentes core/comum registradas no roadmap.
- A comparacao por risco concluiu que os blocos maiores e mais sensiveis permanecem acima do patamar ideal para uma nova extração minima controlada.
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
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissões foi alterado.
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
- Os candidatos comparados foram `Prestadores/prestFiltrarLista`, `Prestadores/prestRender`, `Prestadores/prestSelecionarLinha`, `Prestadores/prestAcoesPlaceholder`, blocos de `Cadastros auxiliares`, `Convênios e Planos`, `Relatorios`, `Agenda principal`, `Preferencias / Configuracoes comuns` e outros candidatos core/comum registrados no roadmap.
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
- Os candidatos comparados incluem `Prestadores/prestRender`, `Prestadores/prestSelecionarLinha`, `Prestadores/prestAcoesPlaceholder`, `Preferencias / Configuracoes comuns` remanescente, `Convênios e Planos`, `Relatorios`, `Etiquetas`, `Medicamentos`, `Plano de Contas`, `Materiais`, `Procedimentos genericos` e `Agenda principal` remanescente.
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
- Os candidatos avaliados foram `Cadastros auxiliares`, `Medicamentos`, `Etiquetas`, `Convênios e Planos`, `Relatorios` e `CID`.
- A classificacao multiarea resumida mostrou `Cadastros auxiliares` e `Etiquetas` como comuns/core administrativos/transversais, `Medicamentos` e `CID` como especificos de area profissional e `Convênios e Planos`/`Relatorios` como mistos ou de risco maior.
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
- Os candidatos avaliados foram `Cadastros auxiliares`, `Medicamentos`, `Etiquetas`, `Convênios e Planos` e um eventual outro bloco leve identificado no roadmap.
- A classificacao multiarea resumida apontou `Cadastros auxiliares` e `Etiquetas` como comuns/core administrativos/transversais, `Medicamentos` como especifico de area profissional e `Convênios e Planos` como misto/depende de contexto.
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
- Os candidatos avaliados foram `Cadastros auxiliares`, `Medicamentos`, `Convênios e Planos` e um eventual outro bloco leve identificado no roadmap.
- A classificacao multiarea resumida apontou `Cadastros auxiliares` como comum/core administrativo/transversal, `Medicamentos` como especifico de area profissional e `Convênios e Planos` como misto/depende de contexto.
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
  - sem permissões;
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
- A consolidacao de `Preferencias`, `Prestadores` e `Convênios e Planos` foi mantida como contexto, assim como a pausa sem implementacao de `Medicamentos` e `Ficha pessoal`.
- A auditoria leve do commit `09544fc6f89c5c1a3aed5b5c2098b2c4c414a3e7` foi registrada:
  - `git status --short` mostrou apenas untracked antigos em `docs/`, sem alteracao de codigo;
  - `git log --oneline -5` confirmou `09544fc` no historico recente;
  - `git show --name-only --stat --oneline 09544fc6f89c5c1a3aed5b5c2098b2c4c414a3e7` mostrou apenas `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2b_ficha_pessoal_contrato_profundo.md`;
  - a aparente indicacao visual de “4 arquivos editados” foi tratada como duplicidade de interface/summary, nao como alteracao real adicional.
- Os criterios adotados para a matriz foram: menor contato com backend, `requestJson`, payload, salvamento e exclusao; menor contato com permissoes; menor risco textual/mojibake; teste manual claro; rollback mental simples; ganho real de organizacao do `app.js`; contrato profundo objetivo; recorte medio pequeno.
- A frente recomendada ficou em `Conta corrente`, tratada como `comum/core transversal` e com contrato profundo obrigatorio antes de qualquer implementacao.
- `Preferências`, `Prestadores`, `Convênios e Planos`, `Medicamentos` e `Ficha pessoal` continuaram pausados, evitando reentrada em `sysOpt*`, `Odontograma`, modal, salvar, excluir, agenda, credenciamento, comissoes, calendario, `requestJson`, payload, pacientes, financeiro, recebimentos, procedimentos, permissões ou backend.
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

- A correção mínima da abertura da tela `Financeiro > Conta corrente` foi aplicada.
- A delegação para o módulo passivo foi temporariamente desativada em `app.js`, e `ccRenderTabela()` voltou a ser síncrona e autônoma.
- O módulo `frontend/js/modules/conta-corrente.js` foi preservado para futura integração mais segura, sem uso no bootstrap desta rodada.
- A correção não tocou `requestJson`, payload, salvamento, exclusão, backend, permissões, relatórios ou fluxos financeiros sensíveis.
- A validação do commit `beee5d7` continua dependendo de novo teste manual após esta correção.
- Nenhuma nova validação final foi registrada nesta etapa.
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
- O contexto ficou amarrado a nova matriz comparativa pos-Convênios e Planos, que recomendou `Medicamentos` como proxima frente apenas para contrato profundo.
- O mapa documental registrou funcoes de `app.js`, modulo existente, DOM, eventos, `requestJson`, payload, salvamento, exclusao, backend, endpoints e permissoes apenas por leitura.
- As areas proibidas permaneceram intocadas: backend, banco, endpoints, permissoes, `requestJson`, payload efetivo, salvamento, exclusao, validacoes criticas, vinculos com Assistente de receitas, editor, documento gerado, receituario, pacientes e atendimentos, alem de correcoes textuais e mojibake.
- Os candidatos avaliados nao liberaram recorte medio controlado realmente seguro; a recomendacao final foi nao implementar agora e abrir nova matriz ou escolher outra frente.
- O teste manual foi registrado apenas para uma futura decisao, sem executar nada nesta etapa.
- Nenhuma implementacao direta foi escolhida.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Nova matriz comparativa apos pausa de Medicamentos

- A nova matriz comparativa documental foi aberta apos o contrato profundo de `Medicamentos` concluir que nao existe recorte medio suficientemente seguro para implementacao agora.
- A consolidacao de `Preferências`, `Prestadores`, `Convênios e Planos` e `Medicamentos` foi mantida como contexto valido para a escolha da proxima frente.
- Os criterios adotados para a matriz foram: menor contato com backend, `requestJson`, payload, salvamento e exclusao; menor contato com permissoes; menor risco textual/mojibake; teste manual claro; rollback mental simples; ganho real de organizacao do `app.js`; contrato profundo objetivo; recorte medio pequeno.
- A frente recomendada ficou em `Ficha pessoal`, tratada como `comum/core transversal` e com contrato profundo obrigatorio antes de qualquer implementacao.
- `Preferências`, `Prestadores` e `Convênios e Planos` continuaram pausados por ja terem recortes validados e consolidados.
- `Medicamentos` continuou pausado porque o contrato profundo concluiu que nao ha recorte medio suficientemente seguro agora, devido ao acoplamento com Assistente de receitas, editor, documento gerado, receituario, `requestJson`, payload, salvamento, exclusao, endpoints, pacientes e atendimentos.
- Os demais candidatos foram relegados a segundo plano por risco funcional, sensibilidade financeira, acoplamento amplo ou menor clareza de teste.
- A proxima subetapa recomendada continua sendo apenas contrato profundo, sem implementacao direta.
- Os limites da Fase 2B continuam vigentes: sem backend, banco, endpoints, permissoes, `requestJson`, payload, salvamento, exclusao, `sysOpt*`, `Odontograma` ou correcao textual/mojibake.
- Nenhuma implementacao foi feita nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Convenios e Planos - Contrato profundo do primeiro recorte medio controlado

- O contrato profundo de `Convênios e Planos` foi criado como etapa exclusivamente documental da Fase 2B.
- A frente foi classificada como comum/core transversal.
- O contexto ficou amarrado a nova matriz comparativa pos-Prestadores, que recomendou `Convênios e Planos` como proxima frente apenas para contrato profundo.
- O mapa documental registrou funcoes de `app.js`, modulos existentes, DOM, eventos, `requestJson`, payload, salvamento, exclusao, backend, endpoints e permissoes apenas por leitura.
- As areas proibidas permaneceram intocadas: backend, banco, endpoints, permissoes, `requestJson`, payload efetivo, salvamento, exclusao, validacoes criticas, vinculos com pacientes, agenda, financeiro, recebimentos, procedimentos e prestadores, alem de correcoes textuais e mojibake.
- Foram avaliados candidatos pequenos de recorte medio controlado dentro de `Convênios e Planos`, com recomendacao futura para a renderizacao visual/local da lista principal e dos contadores.
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

- O teste funcional geral do commit `81379b6d2c9901ab0e77ab4bf6bf1f4e7da0bc8e` passou, mas foi observada uma regressao visual/textual na area de `Telefones` da modal de `Convênios e Planos`.
- O texto exibido em vermelho aparece como mojibake semelhante a `â˜...` no lugar de um simbolo/icone de telefone.
- A validacao pos-teste do commit `81379b6` continua bloqueada ate a analise conclusiva e eventual correcao futura.
- Foi aberta auditoria documental antes de qualquer correção.
- Nao houve validacao final nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Convenios e Planos - Correcao pontual do mojibake no icone de telefones

- A correção pontual foi aplicada somente no literal do ícone/símbolo de telefone da função `convPlanConvenioPhoneRowV2()` em `frontend/app.js`.
- O mojibake identificado `â˜Ž` foi substituido por `&#9742;`, mantendo a intencao visual sem depender de encoding ambíguo.
- A correção foi separada de qualquer refatoração ou ajuste de listas/contadores.
- `requestJson`, payload, salvamento, exclusão, backend, permissões e fluxos transversais permaneceram fora do escopo.
- A validação pós-teste do commit `81379b6` continua dependendo de novo teste manual após esta correção.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Convenios e Planos - Validacao pos-teste da lista principal e contadores

- A validacao pos-teste do commit `81379b6d2c9901ab0e77ab4bf6bf1f4e7da0bc8e` foi registrada.
- A auditoria documental `c7040a41b996935c01b3efdb7d90ce0d4e157299` confirmou que o mojibake da area de telefones era preexistente.
- A correção pontual `0c64ed30f06ab929a14515ce2b207ff27a0b9d94` foi validada depois do teste.
- O primeiro recorte medio controlado de `Convênios e Planos` foi validado com sucesso em teste manual.
- A separacao entre implementacao, auditoria e correção ficou preservada.
- `requestJson`, payload, salvamento, exclusão, backend, permissões e fluxos transversais permaneceram fora do escopo.
- Os limites da Fase 2B continuam vigentes.
- O proximo passo ainda nao foi escolhido nesta etapa e depende de nova escolha controlada.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Convenios e Planos - Consolidacao parcial apos primeiro recorte validado

- A consolidacao parcial do primeiro recorte medio validado em `Convênios e Planos` foi registrada como etapa exclusivamente documental.
- O recorte consolidado permaneceu sendo a lista principal e os contadores, com separacao clara entre `app.js` e modulo passivo.
- O teste manual passou apos a correção pontual do mojibake na area de telefones.
- A correção pontual foi mantida separada da refatoração da lista e dos contadores.
- O estado atual da frente foi documentado sem ampliar escopo para calendario, modais, salvar, excluir, `requestJson`, payload, backend ou permissões.
- Os limites da Fase 2B permanecem vigentes e a proxima subetapa recomendada é nova matriz comparativa documental.
- Nenhuma nova implementacao foi escolhida nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## Fase 2B - Nova matriz comparativa apos pausa de Convenios e Planos

- A nova matriz comparativa documental foi aberta apos a consolidacao parcial de `Convênios e Planos`.
- A consolidacao de `Preferências`, `Prestadores` e `Convênios e Planos` foi mantida como contexto valido para a escolha da proxima frente.
- Os criterios adotados para a matriz foram: menor contato com backend, `requestJson`, payload, salvamento e exclusao; menor contato com permissoes; menor risco textual/mojibake; teste manual claro; rollback mental simples; ganho real de organizacao do `app.js`; contrato profundo objetivo; recorte medio pequeno.
- A frente recomendada ficou em `Medicamentos`, tratada como `comum/core transversal` e com contrato profundo obrigatorio antes de qualquer implementacao.
- `Preferências`, `Prestadores` e `Convênios e Planos` continuaram pausados para evitar reentrada em `sysOpt*`, `Odontograma`, modal, salvar, excluir, agenda, credenciamento, comissoes, calendario, `requestJson`, payload, pacientes, financeiro, recebimentos, procedimentos, permissões ou backend.
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
- O prestador `Clínica` foi mantido como referencia documental para o prestador sistemico/reservado de codigo `255`.
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
- `Mestre` ID `1` segue como referencia documental do admin inicial e `Clínica` ID `255` segue como referencia documental do prestador/usuario sistemico.
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
- A revisao final preserva `Principal / 0001`, `Mestre` `1`, `Clínica` `255`, a tabela Brana, os equivalentes de CID, procedimentos, anamnese, TISS tipo tabela e a matriz formal de acesso quando confirmada.
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
- Por seguranca, nao foi feita correção incompleta nem inventado mapa de seeds por tabela.
- A correção permanece bloqueada ate existir um mapa confiavel por tabela EasyDental ou uma revisao contratual que feche a relacao entre os nomes do Brana e a origem de cada seed.
- Nenhuma conta existente foi alterada e nenhum arquivo de codigo foi modificado nesta revisao documental.
- A proxima etapa recomendada e obter o mapa verificavel antes de qualquer nova implementacao de seed por tabela.

## Subetapa 8N da frente EasyDental virgem

- Subetapa executada: mapa verificavel `TAB_PRC` / `TAB_PRC_ITEM` do EasyDental virgem com acesso restaurado ao caminho `\\\\Sonyvaio\\c\\EDS70`.
- O arquivo `TAB_PRC.raw` confirmou os 9 nomes contratuais da tabela de procedimentos/precos do EasyDental virgem: `Particular`, `Sindicato`, `Bradesco`, `Banco do Brasil`, `Caixa Econ. Federal`, `Banespa`, `Telebrás`, `Petrobrás` e `CNCC`.
- As divergencias em relacao ao contrato do Brana sao apenas ortograficas / de acentuacao em `Caixa Econ Federal`, `Petrobras` e `Telebras`.
- O arquivo `TAB_PRC_ITEM.raw` permaneceu acessivel, mas a contagem por tabela nao ficou fechada com seguranca nesta sessao.
- Fontes secundarias continuam divergentes e nao servem como substitutas da fonte virgem: o SQL vivo acessivel nesta maquina mostrou apenas 4 tabelas ativas e o backup legado local mostra grupos de tabela do legado Brana / conta antiga.
- Nao houve implementacao.
- Nenhuma conta foi criada ou alterada.
- A correção continua bloqueada ate a complementacao do mapa por tabela EasyDental.
- A proxima subetapa recomendada ficou em `EasyDental virgem - Subetapa 8O - complementacao da fonte/mapeamento TAB_PRC antes da correcao`.

## Subetapa 8O da frente EasyDental virgem

- Subetapa executada: complementacao do mapa verificavel de `TAB_PRC_ITEM` na fonte virgem `\\\\Sonyvaio\\c\\EDS70`.
- O arquivo `TAB_PRC_ITEM.raw` foi lido em modo somente leitura e revelou um mapa por tabela agora fechavel por `NROTAB` e `NROPROCTAB`.
- O conjunto nominal de `TAB_PRC` continuou confirmado e as nove tabelas herdadas do EasyDental ficaram assim mapeadas: `Particular`, `Sindicato`, `Bradesco`, `Banco do Brasil`, `Caixa Econ. Federal`, `Banespa`, `Telebrás`, `Petrobrás` e `CNCC`.
- As contagens verificadas em `TAB_PRC_ITEM` ficaram fechadas por tabela: `Particular 112`, `Sindicato 238`, `Bradesco 94`, `Banco do Brasil 188`, `Caixa Econ. Federal 88`, `Banespa 32`, `Telebrás 101`, `Petrobrás 174` e `CNCC 236`.
- Foi possivel extrair amostras seguras de itens por tabela sem expor dados sensiveis nem valores comerciais reais.
- Nao houve implementacao.
- Nenhuma conta foi criada ou alterada.
- O mapa passou a ser suficiente para a proxima correcao isolada do seed por tabela.
- A proxima subetapa recomendada ficou em `EasyDental virgem - Subetapa 8P - correcao isolada dos seeds por tabela EasyDental`.

## Subetapa 8P da frente EasyDental virgem

- Subetapa executada: correcao isolada dos seeds por tabela EasyDental.
- A falha da 8J foi corrigida para que `Brana` permaneça com seed proprio e as 9 tabelas herdadas recebam seus itens EasyDental respectivos.
- O mapa 8O foi aplicado: `Particular 112`, `Sindicato 238`, `Bradesco 94`, `Banco do Brasil 188`, `Caixa Econ. Federal 88`, `Banespa 32`, `Telebrás 101`, `Petrobrás 174` e `CNCC 236`.
- Os arquivos alterados foram `backend/seeds/procedimentos_padrao.py` e o novo `backend/seeds/procedimentos_easy_tabelas.py`.
- Os checks sintaticos foram executados com sucesso para os arquivos Python alterados.
- O teste manual continua sendo criar nova conta e verificar que as 9 tabelas herdadas nao herdam mais os 336 itens da Brana, mantendo `Tabela Exemplo` fora do nascimento e `Brana` como padrao/privada.
- O erro textual da tela de setup permanece fora do escopo e segue como pendencia separada.
- Nenhuma conta existente foi alterada.
- Nenhuma conta foi criada automaticamente.
- A proxima subetapa recomendada ficou em `EasyDental virgem - Subetapa 8Q - validacao manual da nova conta apos correcao dos seeds`.

## Subetapa 8Q da frente EasyDental virgem

- Subetapa executada: exclusao segura da conta de teste para liberar `institutobrana@gmail.com` e validar a trilha 8J/8K/8P.
- O e-mail alvo foi confirmado no banco como `institutobrana@gmail.com`, mas o ID informado pelo usuario como `17` nao bateu com a leitura; a conta correta confirmada por leitura foi a clínica `ID 8`.
- O procedimento aprovado encontrado foi o contrato central de exclusao segura com backup/export, dry-run e runner controlado.
- O dry-run foi executado com sucesso antes da exclusao real.
- A exclusao real foi executada uma unica vez com `--execute` e concluiu com sucesso, removendo a clinica `ID 8` e liberando o e-mail.
- A validacao pos-exclusao confirmou que nenhuma outra conta foi afetada.
- Os arquivos alterados foram o novo documento de exclusao segura e este roadmap.
- A próxima validacao manual recomendada passa a ser criar nova conta com `institutobrana@gmail.com` para conferir 8J/8K/8P.
- Nenhum código foi alterado.
- Nenhuma conta adicional foi criada ou alterada fora da exclusao segura documentada.

## Correção urgente de schema/login - `usuarios.senha_interna_hash`

- Foi diagnosticado erro de login `500` em `POST /login` causado por `psycopg2.errors.UndefinedColumn` na coluna `usuarios.senha_interna_hash`.
- O model de `Usuario` já esperava a coluna e o banco real estava sem ela.
- A correção aplicada foi idempotente: o startup HTTP passou a garantir `senha_interna_hash` e o script manual de compatibilidade também foi alinhado.
- As demais colunas conferidas em `usuarios` permaneceram presentes.
- Não houve alteração funcional em `setup`, senha interna, `Opções do Sistema`, frontend, seeds de procedimentos, unidade ou contas existentes.
- O login deve ser validado manualmente após reiniciar o backend e, se estiver normal, a próxima conta limpa pode ser criada com `institutobrana@gmail.com`.
- A próxima subetapa recomendada passa a ser a validação manual da nova conta após 8J/8K/8P.

## Correção urgente do signup - `PRIVATE_TABLE_NAME` ausente

- O `/signup/confirm` falhou com `NameError: name 'PRIVATE_TABLE_NAME' is not defined` em `backend/seeds/procedimentos_padrao.py`.
- A causa foi uma referência à tabela privada `Brana` sem constante definida no escopo do seed.
- A correção aplicada foi mínima: a constante local `PRIVATE_TABLE_NAME = "Brana"` foi definida no próprio arquivo do seed.
- A consulta segura ao banco para `institutobrana@gmail.com` não encontrou conta parcial em `clinicas` nem em `usuarios`.
- Os seeds da 8P foram preservados.
- Nenhuma conta foi criada automaticamente.
- O teste manual recomendado passa a ser tentar novamente criar uma conta limpa com `institutobrana@gmail.com` e validar 8J/8K/8P.

## Subetapa 8R da frente EasyDental virgem

- Execução da Subetapa 8R: o signup passou a criar, além do prestador sistêmico `Clínica`, um prestador ADM/Mestre funcional nas novas contas.
- A regra contratual adicionada foi: nome do prestador ADM vem do cadastro da conta, o tipo é `Cirurgião dentista` e o seed usa `source_id=1` com `codigo=002`.
- O helper de signup foi ajustado de forma idempotente para reaproveitar o prestador ADM quando a conta nova já tiver sido parcialmente construída.
- O prestador `Clínica` sistêmico foi preservado.
- O usuário admin inicial foi vinculado ao prestador ADM funcional.
- Não houve alteração em unidade Principal / 0001, 8P, setup, senha interna, permissões ou frontend.
- A consulta segura não encontrou conta parcial para `institutobrana@gmail.com` na etapa anterior, e a nova implementação não altera contas existentes.
- A próxima validação manual recomendada passa a ser abrir nova conta limpa e confirmar que o módulo Prestadores exibe `Clínica` e o prestador ADM com o nome do cadastro.
- Nenhuma conta foi criada automaticamente por esta correção.

## Exclusao segura bloqueada apos 8R

- O e-mail alvo `institutobrana@gmail.com` foi confirmado no banco como clínica `ID 11`, nao `25`.
- Foram revisados o contrato central de exclusao segura, as trilhas historicas e os documentos de exclusao anteriores.
- O runner seguro existente no repositório está travado para `clinica_id = 8`, então nao havia ferramenta aprovada para executar a exclusao da clínica 11 sem alterar código.
- Nao houve backup/export, dry-run ou exclusao real nesta etapa, porque a operacao ficou bloqueada por ausencia de runner seguro específico para `ID 11`.
- Nenhuma outra conta foi alterada, e 8P/8K/8R foram preservadas.
- A próxima etapa recomendada passa a ser aprovar ou criar um runner seguro específico para a clínica 11 antes de tentar qualquer exclusao.

## Subetapa 8S da frente EasyDental virgem

- Execução da Subetapa 8S: foi criado um runner seguro específico para a clínica 11, reaproveitando a trilha de exclusão segura já validada.
- O e-mail alvo `institutobrana@gmail.com` foi confirmado na clínica 11, e a hipótese `25` foi descartada como alvo.
- O backup/export somente leitura foi executado com sucesso e gerou o conjunto de arquivos de pré-exclusão da clínica 11.
- O dry-run foi executado com sucesso e confirmou alvo único, usuários vinculados, prestador, assinatura, `email_codes` e dependências.
- A exclusão real foi executada uma única vez com `--execute` e concluiu com sucesso.
- A clínica 11 foi removida e o e-mail foi liberado para nova conta limpa.
- Nenhuma outra conta foi afetada, e 8P/8K/8R foram preservadas.
- Os arquivos alterados foram o novo runner seguro da clínica 11, o backup/export da clínica 11, o novo documento da subetapa e este roadmap.
- A próxima validação manual recomendada passa a ser criar nova conta com `institutobrana@gmail.com` e validar 8P/8K/8R.
- Nenhuma conta foi criada automaticamente.

## Correção segura da exclusao de usuario no modulo Usuarios

- Foi auditado o fluxo do botao Excluir em `frontend/app.js`, que chama `DELETE /admin/users/{id}` e mostrava o alerta generico `Falha ao excluir usuario.`.
- O diagnostico confirmou que a rota `backend/routes/user_admin_routes.py` fazia `db.delete(usuario)` direto e quebrava quando o usuario ainda estava referenciado por `prestador_odonto.usuario_id`.
- A falha nao era geral para qualquer usuario: usuarios sem dependencia puderam ser excluidos em transacao descartavel, enquanto o usuario `37` da clinica 15 falhava por FK, e o usuario `36` nao falhava.
- A regra de seguranca foi reforcada para bloquear o ultimo admin, preservar a conta base `Clínica`/system user e manter o bloqueio do proprio usuario logado.
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

- Contrato documental aberto para o recorte remanescente de `Preferências / Configurações`.
- O módulo continua classificado como `comum/core`.
- O recorte recomendado é a sincronização visual básica da modal, com título e alternância de abas.
- Nenhuma implementação foi feita nesta etapa.
- Implementação mínima do recorte contratado concluída com delegação visual ao módulo passivo.
- Arquivos alterados: `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/fase_2b_preferencias_configuracoes_implementacao_sincronizacao_visual_modal.md`.
- Sem alteração em carregamento, payload, salvamento, `sysOpt*`, backend, banco, permissões ou seeds.
- Próxima etapa recomendada: validação manual pós-implementação.
- A blindagem textual/mojibake foi respeitada.
- Nenhum código foi alterado nesta etapa.
- O documento criado foi `docs/fase_2b_preferencias_configuracoes_contrato_recorte_remanescente.md`.
- A blindagem textual/mojibake foi respeitada.
- A próxima etapa recomendada, se o contrato continuar seguro, é a implementação mínima do recorte contratado.








