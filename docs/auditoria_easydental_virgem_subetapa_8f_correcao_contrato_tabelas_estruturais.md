# Auditoria EasyDental virgem - Subetapa 8F - correcao do contrato de tabelas estruturais

## 1. Contexto
- Esta subetapa referencia as Subetapas 0 a 8E da frente "Auditoria comparativa EasyDental virgem x Brana Cloud - correcao do contrato mestre de tabelas estruturais de novas contas".
- A Subetapa 8E consolidou o contrato mestre das tabelas e registros que nascem em novas contas, mas a leitura posterior mostrou que ainda havia classificacao incompleta em tabelas estruturais relevantes.
- A correcao pedida pelo usuario e conceitual: nao duplicar o que ja existe no Brana; trazer ou planejar apenas o que falta e e estrutural; nao seedar dados de uso.
- O EasyDental continua sendo referencia forte de estrutura de nascimento, mas nao como copia cega.
- Esta etapa e 100% documental.
- Nao ha implementacao nesta etapa.

## 2. Seguranca e limites
- Nenhum codigo foi alterado.
- Nenhum seed ou migration foi alterado.
- Nenhum banco foi alterado.
- Nenhuma query de escrita foi executada.
- Nenhum script SQL foi executado.
- Nenhuma conta foi criada.
- A conta ID 16 nao foi alterada.
- Nenhuma conta existente foi alterada.
- A tela de setup nao foi alterada.
- A blindagem textual/mojibake foi respeitada.

## 3. Regra corrigida do contrato
- Tabela ou conceito ja existente no Brana nao deve ser duplicado.
- Se ja existe e esta adequado: manter.
- Se ja existe e o EasyDental mostra estrutura melhor: melhorar o equivalente existente.
- Se nao existe no Brana e e estrutural: incluir no contrato como equivalente futuro ou nova tabela.
- Se e dado de uso, transacional, historico, log, temporario ou resposta preenchida: nao seedar dados.
- Tabela estrutural pode existir vazia.
- Seed estrutural pode nascer populado.
- Logs, historicos, temporarios e transacionais ficam fora do nascimento.

## 4. Matriz revisada de classificacao

| tabela EasyDental | modulo | tipo no EasyDental | equivalente Brana | existe no Brana? | decisao revisada | justificativa | impacto se faltar | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `UNIDADE` | Clinica / tenant | estrutura | `unidade_atendimento` | sim | manter Brana e regular seed `Principal / 0001` | unidade base ja existe como tabela | conta nova sem unidade formal | seed de nascimento, nao duplicacao |
| `USUARIO` | Usuarios | estrutura/seed | `usuarios` | sim | manter Brana e regular nascimento do admin/system | papel estrutural ja existe | conta pode nascer bloqueada | USUARIO 38 continua fora do nascimento padrao |
| `PRESTADOR` | Prestadores | estrutura/seed | `prestador_odonto` | sim | manter Brana e regular prestador sistemico | papel estrutural ja existe | conta sem prestador base | referencia `Clínica` 255 e `Mestre` 1 |
| `SISTEMA` | Configuracao global | estrutura | `preferences` / `system_options` | parcial | manter equivalente e melhorar | nao ha literal identica | config global difusa | nao duplicar tabela literal |
| `SIS_PERFIL` | Perfis/permissoes | seed estrutural | `access_profile` | parcial | manter equivalente e melhorar | Brana ja tem perfil reservado | matrizes divergentes | fonte de verdade precisa ficar clara |
| `SIS_MODULO` | Perfis/permissoes | seed estrutural | permissions schema / `access_profile` | parcial | melhorar equivalente | equivalente existe no codigo | menus/permissoes inconsistentes | sem duplicacao literal |
| `SIS_FUNCAO` | Perfis/permissoes | seed estrutural | permissions schema / `access_profile` | parcial | melhorar equivalente | equivalente existe no codigo | permissao ampla pode falhar | sem duplicacao literal |
| `USUARIO_PERFIL` | Vinculo usuario/perfil | matriz formal | `usuario_perfil_acesso` | sim | manter e usar como matriz formal | existe e e crucial | admin sem vinculo formal | nascimento deve criar linhas formais |
| `USUARIO_MODULO` | Permissoes | matriz formal | `permissoes_json` / access profiles | nao literal | incluir como equivalente futuro se necessario | hoje e contratual/codigo | dupla verdade se ficar solto | evitar duplicar se nao houver necessidade |
| `USUARIO_FUNCAO` | Permissoes | matriz formal | `permissoes_json` / access profiles | nao literal | incluir como equivalente futuro se necessario | hoje e contratual/codigo | dupla verdade se ficar solto | evitar duplicar se nao houver necessidade |
| `CONFIG_REPORT` | Relatorios/interface | seed estrutural | `relatorio_config` | sim | manter e melhorar | existe equivalente persistido | relatorio sem base | seed de interface, nao dado de uso |
| `CUSTOMPAGE` | Relatorios/interface/formularios | seed estrutural | equivalente nao localizado | nao literal | incluir equivalente futuro | EasyDental possui layout persistido | formulario sem estrutura | nao seedar conteudo de uso |
| `CUSTOMCONTROL` | Relatorios/interface/formularios | seed estrutural | equivalente nao localizado | nao literal | incluir equivalente futuro | EasyDental possui controles persistidos | formulario sem controles | nao seedar conteudo de uso |
| `TAB_PRC` | Tabela privada | estrutura/seed | `procedimento_tabela` | sim | manter Brana e regular | equivalente literal ja existe | sem tabela privada padrao | nao duplicar `PARTICULAR` em conta nova |
| `TAB_PRC_ITEM` | Procedimentos canonicos | estrutura/seed | `procedimento` | sim | manter Brana e melhorar se preciso | catalogo principal ja existe | sem catalogo padrao | seed estrutural, preco pode ser zero |
| `TAB_GEN_ITEM` | Procedimentos genericos | estrutura/seed | `procedimento_generico` | sim | manter Brana e melhorar se preciso | equivalente literal ja existe | sem base generica | seed estrutural |
| `TAB_GEN_ITEM_FASE` | Procedimentos genericos | estrutura/seed | `procedimento_generico_fase` | sim | manter Brana e melhorar se preciso | equivalente literal ja existe | sem fluxo generico | seed estrutural |
| `TAB_GEN_ITEM_MAT` | Materiais/procedimentos | estrutura/seed | `procedimento_generico_material` | sim | manter Brana e melhorar se preciso | equivalente literal ja existe | sem insumo generico | seed estrutural |
| `TAB_MAT` | Materiais | estrutura/seed | `lista_material` | sim | manter Brana e melhorar se preciso | catalogo de materiais ja existe | sem estrutura de material | nao seedar custo comercial indevido |
| `TAB_MAT_ITEM` | Materiais | estrutura/seed | `material` | sim | manter Brana e melhorar se preciso | itens de material ja existem | sem itens de material | pode nascer com zeros/estrutura |
| `TAB_PRT_ITEM` | Procedimentos / tabela auxiliar | estrutura | equivalente nao localizado com clareza | parcial | incluir equivalente futuro ou manter como contrato pendente | existe como conceito estrutural no legado | lacuna de modelagem | nao confundir com dados de uso |
| `TAB_REPASSE` | Custos/repasses | estrutura/seed | `prestador_comissao_odonto` / `prestador_credenciamento_odonto` | parcial | manter equivalente e melhorar | conceito existe no Brana, embora modelagem seja diferente | repasse sem estrutura | dados comerciais nao devem nascer preenchidos |
| `CID_ITEM` | CID | seed estrutural | `doenca_cid` | sim | manter Brana e melhorar se necessario | CID ja existe no Brana | duplicacao indevida | exemplo obrigatorio de nao duplicar |
| `_ESPECIALIDADE` | Especialidades | lookup/seed | `item_auxiliar` tipo especialidade / campos de prestador | parcial | manter equivalente e melhorar | conceito existe no Brana | especialidade sem base | nao duplicar literal se equivalencia servir |
| `_FASE_PROCEDIMENTO` | Fases/status | lookup/seed | `procedimento_fase` / `procedimento_generico_fase` | sim/parcial | manter e melhorar | equivalente funcional existe | fluxo clinico sem fase | seed estrutural |
| `_STATUS_INTERV` | Fases/status | lookup/seed | equivalente nao localizado | nao literal | incluir equivalente futuro | status estrutural do fluxo clinico | intervencao sem status | pendente de definicao fina |
| `_SIMBOLO_ODONTO` | Simbolos/odontograma | seed estrutural | `simbolo_grafico` / `simbolo_grafico_catalogo` | parcial | manter e melhorar | catalogo simbolico existe | odontograma sem simbolos | nao duplicar catalogo literal se ja atende |
| `_SIMBOLO_ANOMALIA` | Simbolos/odontograma | seed estrutural | `simbolo_grafico` / catalogo simbolico | parcial | manter e melhorar | catalogo simbolico existe | anomalia sem catalogo | pode exigir ajuste de cobertura |
| `_TISS_REGIAO_PROCEDIMENTO` | TISS | lookup estrutural | equivalente nao localizado | nao literal | incluir equivalente futuro | lookup estrutural do legado | TISS sem regiao | nao e dado de uso |
| `_TISS_TIPO_TABELA` | TISS | lookup estrutural | `tiss_tipo_tabela` | sim | manter Brana e melhorar se necessario | equivalente literal existe | TISS sem tipo de tabela | exemplo de estrutura ja coberta |
| `_TISS_CBOS` | TISS | lookup estrutural | `item_auxiliar` tipo `CBO-S` / campo `cbos` do prestador | parcial | manter equivalente e nao duplicar | conceito existe funcionalmente | TISS sem CBOS | pode ficar como lookup de apoio |
| `_TISS_TIPO_ATENDIMENTO` | TISS | lookup estrutural | `tratamento.tipo_atendimento_tiss_id` / equivalente futuro | parcial | incluir equivalente futuro se necessario | existe campo, nao tabela literal | TISS sem tipo de atendimento | depende de contrato tecnico final |
| `_TISS_TIPO_FATURAMENTO` | TISS | lookup estrutural | `convenio_odonto.tipo_faturamento` / equivalente futuro | parcial | incluir equivalente futuro se necessario | existe campo, nao tabela literal | TISS sem tipo de faturamento | depende de contrato tecnico final |
| `ANAMNESE_QUEST` | Anamnese | seed estrutural | `anamnese_questionarios` | sim | manter Brana e melhorar se necessario | equivalente literal existe | anamnese sem base | deve nascer populado |
| `ANAMNESE_PERG` | Anamnese | seed estrutural | `anamnese_perguntas` | sim | manter Brana e melhorar se necessario | equivalente literal existe | anamnese sem perguntas | deve nascer populado |
| `ANAMNESE_RESP` | Anamnese | transacional | `anamnese_respostas` | sim | nao seedar dados de uso | resposta e dado de uso | baseline poluido por uso | pode existir vazio no nascimento |
| `TRATAMENTO` | Agenda/clinico runtime | transacional | `tratamento` | sim | manter equivalente e nao seedar uso | registro de atendimento real | conta nasce com tratamento real indevido | deve nascer vazio |
| `AGENDA` / legado de agenda | Agenda | transacional | `agenda_legado_evento` / `agenda_legado_bloqueio` | parcial | nao seedar dados de uso | agenda e fluxo operativo | agenda falsa no nascimento | configuracoes podem existir |
| `GRUPO_FINANCEIRO` | Financeiro | estrutura | `grupo_financeiro` | sim | manter Brana e regular se preciso | lookup/estrutura financeira existe | financeiro sem base | nao seedar lancamentos |
| `CATEGORIA_FINANCEIRA` | Financeiro | estrutura | `categoria_financeira` | sim | manter Brana e regular se preciso | lookup/estrutura financeira existe | categorias sem grupo | nao seedar movimentos |
| `LANCAMENTO` | Financeiro | transacional | `lancamento` | sim | nao seedar dados de uso | movimento real de caixa | conta nasce com financeiro falso | deve nascer vazio |

## 5. Seccao TISS

| tabela TISS EasyDental | funcao provavel | equivalente Brana | decisao revisada | nasce populada/vazia/equivalente/pendente | justificativa |
| --- | --- | --- | --- | --- | --- |
| `_TISS_REGIAO_PROCEDIMENTO` | regiao/procedimento para faturamento TISS | equivalente nao localizado | incluir equivalente futuro | vazia/equivalente | lookup estrutural do legado, nao dado de uso |
| `_TISS_TIPO_TABELA` | tipo de tabela TISS | `tiss_tipo_tabela` | manter Brana | populada como lookup | equivalente literal ja existe no Brana |
| `_TISS_CBOS` | catalogo CBOS / suporte TISS | `item_auxiliar` tipo `CBO-S` + campo `cbos` do prestador | manter equivalente e nao duplicar | equivalente | Brana ja possui suporte funcional para CBOS |
| `_TISS_TIPO_ATENDIMENTO` | tipo de atendimento TISS | `tratamento.tipo_atendimento_tiss_id` / equivalente futuro | incluir equivalente futuro se necessario | pendente | campo ja existe, mas literal nao foi localizado |
| `_TISS_TIPO_FATURAMENTO` | tipo de faturamento TISS | `convenio_odonto.tipo_faturamento` / equivalente futuro | incluir equivalente futuro se necessario | pendente | campo ja existe, mas literal nao foi localizado |

## 6. Seccao Intervencoes / Procedimentos

| tabela EasyDental | decisao estrutural | equivalente Brana | observacao |
| --- | --- | --- | --- |
| `INTERVENCAO` | estrutura runtime, nao seed de uso | `tratamento` + `procedimento` + `procedimento_generico` + fases | nao duplicar literal se a malha atual cobrir o fluxo; se precisar de tabela futura, ela deve nascer vazia |
| `DENTE` | estrutura odontografica runtime | fluxo de odontograma / estado clinico | nao seedar pacientes ou intervencoes reais |
| `ARCADA` | estrutura odontografica runtime | fluxo de odontograma / tratamento | nao seedar dados de atendimento |
| `FACE` | estrutura odontografica runtime | simbolos/odontograma | nao seedar dados de uso |
| `HISTORICO` | historico clinico/transacional | nenhuma duplicacao literal | fica fora do seed; se existir como storage, nasce vazio |
| `TAB_PRC` | estrutura/catalogo | `procedimento_tabela` | manter equivalente existente |
| `TAB_PRC_ITEM` | catalogo de procedimentos | `procedimento` | manter equivalente existente |
| `TAB_GEN_ITEM` | catalogo generico | `procedimento_generico` | manter equivalente existente |
| `TAB_GEN_ITEM_FASE` | fases de catalogo generico | `procedimento_generico_fase` | manter equivalente existente |
| `TAB_GEN_ITEM_MAT` | material do catalogo generico | `procedimento_generico_material` | manter equivalente existente |
| `TAB_MAT` | catalogo de materiais | `lista_material` | manter equivalente existente |
| `TAB_MAT_ITEM` | itens de material | `material` | manter equivalente existente |
| `TAB_PRT_ITEM` | item relacional do processo | equivalente nao localizado com clareza | contrato pendente, mas nao e dado de uso |
| `TAB_REPASSE` | repasse/custos de prestador | `prestador_comissao_odonto` / `prestador_credenciamento_odonto` | manter equivalente e melhorar se necessario |
| `_FASE_PROCEDIMENTO` | fase estrutural | `procedimento_fase` / `procedimento_generico_fase` | manter e melhorar |
| `_STATUS_INTERV` | status do fluxo clinico | equivalente nao localizado | incluir equivalente futuro ou lookup estrutural |

## 7. Seccao Odontograma
- `DENTE`, `ARCADA` e `FACE` sao estruturas do odontograma e nao dados de uso.
- O Brana nao deve duplicar registros de paciente ou intervencao como seed.
- `simbolo_grafico` e `simbolo_grafico_catalogo` cobrem a funcao estrutural de `_SIMBOLO_ODONTO` e parte de `_SIMBOLO_ANOMALIA`.
- Se houver necessidade de tabela literal futura para odontograma, ela deve nascer vazia e com contrato proprio.

## 8. Seccao Procedimentos / Tabelas / Materiais / Repasses
- `TAB_PRC`, `TAB_PRC_ITEM`, `TAB_GEN_ITEM`, `TAB_GEN_ITEM_FASE`, `TAB_GEN_ITEM_MAT`, `TAB_MAT`, `TAB_MAT_ITEM` e `TAB_REPASSE` ja possuem equivalentes no Brana.
- O EasyDental ajuda a validar se a modelagem do Brana esta completa, mas nao autoriza duplicacao literal.
- Preco, custo e repasse comercial nao devem nascer como dado operacional indevido.
- A tabela pode nascer vazia de valores ou com zeros estruturais, conforme o contrato tecnico futuro.

## 9. Seccao CID
- `CID_ITEM` ja existe no Brana como `doenca_cid`.
- Nao duplicar.
- Manter ou melhorar o equivalente existente conforme cobertura e cadastro.

## 10. Seccao Anamnese
- `ANAMNESE_QUEST` e `ANAMNESE_PERG` sao estrutura/seed e devem nascer populadas.
- `ANAMNESE_RESP` e dado de uso e nao deve nascer como seed.
- O Brana ja possui equivalente persistido para a estrutura de anamnese.

## 11. Seccao agenda / financeiro / logs
- Agenda operacional nao nasce populada.
- Financeiro transacional nao nasce populado.
- Logs, historicos e temporarios nao nascem.
- Estruturas de apoio podem existir, mas sem dados de uso.

## 12. Tabelas que faltam no Brana e devem entrar no contrato
| tabela/conceito | modulo | por que falta | por que e estrutural | sugestao | prioridade |
| --- | --- | --- | --- | --- | --- |
| `CUSTOMPAGE` | relatorios/interface/formularios | nao foi localizado modelo literal | layout/formulario e parte do nascimento estrutural | novo equivalente futuro | alta |
| `CUSTOMCONTROL` | relatorios/interface/formularios | nao foi localizado modelo literal | controles de formulario e parte do nascimento estrutural | novo equivalente futuro | alta |
| `_TISS_REGIAO_PROCEDIMENTO` | TISS | nao foi localizado modelo literal | lookup TISS estrutural | novo equivalente futuro | media |
| `_STATUS_INTERV` | fases/status | nao foi localizado modelo literal | status clinico estrutural | novo lookup ou mapeamento | media |
| `USUARIO_MODULO` | permissoes | nao foi localizado modelo literal | matriz formal de acesso | equivalencia futura se necessario | media |
| `USUARIO_FUNCAO` | permissoes | nao foi localizado modelo literal | matriz formal de acesso | equivalencia futura se necessario | media |
| `SIS_PERFIL` | permissoes | nao foi localizado modelo literal | conceito de perfil base | equivalencia via `access_profile` | media |
| `SIS_MODULO` | permissoes | nao foi localizado modelo literal | conceito de modulo | equivalencia via schema atual | media |
| `SIS_FUNCAO` | permissoes | nao foi localizado modelo literal | conceito de funcao | equivalencia via schema atual | media |
| `PREST_ESP` | prestadores | nao foi localizado modelo literal | especialidades de prestador | equivalencia via `prestador_odonto` / `item_auxiliar` | media |

## 13. Tabelas que ja existem no Brana e nao devem duplicar
| EasyDental | Brana | decisao | observacao |
| --- | --- | --- | --- |
| `CID_ITEM` | `doenca_cid` | manter ou melhorar | exemplo obrigatorio de nao duplicar |
| `UNIDADE` | `unidade_atendimento` | manter ou melhorar | novas contas devem nascer com `Principal / 0001` |
| `USUARIO` | `usuarios` | manter ou melhorar | nascimento do admin/system ja existe |
| `PRESTADOR` | `prestador_odonto` | manter ou melhorar | prestador sistemico/reservado ja existe |
| `TAB_PRC` | `procedimento_tabela` | manter ou melhorar | tabela privada ja existe |
| `TAB_PRC_ITEM` | `procedimento` | manter ou melhorar | catalogo principal ja existe |
| `TAB_GEN_ITEM` | `procedimento_generico` | manter ou melhorar | catalogo generico ja existe |
| `TAB_GEN_ITEM_FASE` | `procedimento_generico_fase` | manter ou melhorar | fases ja existem |
| `TAB_GEN_ITEM_MAT` | `procedimento_generico_material` | manter ou melhorar | materiais por generico ja existem |
| `TAB_MAT` | `lista_material` | manter ou melhorar | lista/catalogo ja existe |
| `TAB_MAT_ITEM` | `material` | manter ou melhorar | item material ja existe |
| `_TISS_TIPO_TABELA` | `tiss_tipo_tabela` | manter ou melhorar | TISS ja existe literal |
| `ANAMNESE_QUEST` | `anamnese_questionarios` | manter ou melhorar | seed estrutural ja existe |
| `ANAMNESE_PERG` | `anamnese_perguntas` | manter ou melhorar | seed estrutural ja existe |
| `ANAMNESE_RESP` | `anamnese_respostas` | manter equivalente | resposta e uso, nao seed |
| `CONFIG_REPORT` | `relatorio_config` | manter ou melhorar | equivalente persistido ja existe |
| `SISTEMA` | `preferences` / `system_options` | manter ou melhorar | equivalente funcional ja existe |
| `_SIMBOLO_ODONTO` / `_SIMBOLO_ANOMALIA` | `simbolo_grafico` / catalogo | manter ou melhorar | catalogo simbolico ja existe |
| `CONVENIO` / `PLANO` | `convenio_odonto` / `plano_odonto` | manter ou melhorar | equivalente existe no Brana |
| `TRATAMENTO` | `tratamento` | manter equivalente | runtime clinico ja existe |

## 14. Tabelas que existem no EasyDental mas so devem nascer vazias ou como equivalentes
| tabela EasyDental | porque nao deve nascer populada | como deve ser tratada |
| --- | --- | --- |
| `INTERVENCAO` | e registro de uso clinico real | pode existir como estrutura vazia ou ser coberto por equivalente atual |
| `DENTE` | e estrutura runtime do odontograma | nao seedar intervencoes/pacientes |
| `ARCADA` | e estrutura runtime do odontograma | nao seedar pacientes ou tratamentos |
| `FACE` | e estrutura runtime do odontograma | nao seedar faces de atendimento |
| `HISTORICO` | e historico/log de uso | nao seedar historicos reais |
| `ANAMNESE_RESP` | e resposta preenchida pelo usuario | nasce vazia, nunca com respostas reais |
| `TRATAMENTO` | e dado de uso clinico | nasce vazio se a estrutura existir |
| `LANCAMENTO` | e movimento financeiro | nasce vazio |
| `AGENDA` | e dado operacional | nasce vazia |
| `PARCELA` / `RECIBO` / `RETORNO` | e movimento financeiro/transacional | nao seedar |

## 15. Tabelas / dados que nao devem vir
- Pacientes.
- Intervencoes realizadas.
- Historico clinico real.
- Agenda de atendimentos.
- Movimentacoes financeiras.
- Contas, parcelas e recibos.
- Logs.
- Temporarios.
- Respostas preenchidas de anamnese.
- Qualquer dado operacional/transacional de uso real.

## 16. Correcoes necessarias no contrato mestre 8E
- O bloco TISS da 8E deve ser reinterpretado como combinacao de `existente no Brana`, `equivalente futuro` e `lookup estrutural`, nao como simples pendencia generica.
- `CID` permanece como exemplo de nao duplicacao.
- `INTERVENCAO`, `DENTE`, `ARCADA`, `FACE` e `HISTORICO` devem ser tratados como estrutura runtime ou vazio, nao como seed de uso.
- `CUSTOMPAGE` e `CUSTOMCONTROL` precisam aparecer como estrutura/interface contratual, mesmo sem equivalente literal localizado.
- `USUARIO_PERFIL_ACESSO` e `access_profile` devem ser tratados como equivalentes Brana ja existentes, nao como lacuna.
- `TAB_PRC*`, `TAB_GEN_*`, `TAB_MAT*`, `TAB_REPASSE` e `ANAMNESE_*` devem ficar separados entre equivalente existente e dado de uso.

## 17. Tabelao final revisado
| modulo | tabela/conceito EasyDental | existe no Brana? | decisao final revisada | nasce em nova conta como tabela/equivalente? | nasce populada? | nasce vazia? | nao nasce dado de uso? | prioridade | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Clinica | `UNIDADE` / `Principal` | sim | manter e regular | sim | sim | nao | sim | alta | `Principal / 0001` |
| Usuarios | `USUARIO 1` / `Mestre` | sim | manter e regular | sim | sim | nao | sim | alta | admin inicial `codigo=1` |
| Prestadores | `PRESTADOR 255` / `Clínica` | sim | manter e regular | sim | sim | nao | sim | alta | prestador sistemico/reservado |
| Permissoes | `USUARIO_PERFIL` | sim | manter equivalente e usar como fonte formal | sim | sim | nao | sim | alta | matriz formal obrigatoria |
| Permissoes | `USUARIO_MODULO` / `USUARIO_FUNCAO` | nao literal | equivalente futuro ou schema atual | talvez | nao | talvez | sim | media | evitar dupla verdade |
| TISS | `_TISS_TIPO_TABELA` | sim | manter e melhorar | sim | sim | nao | sim | alta | lookup estrutural |
| TISS | `_TISS_REGIAO_PROCEDIMENTO` | nao literal | incluir equivalente futuro | talvez | nao | talvez | sim | media | lookup estrutural |
| TISS | `_TISS_CBOS` | parcial | manter equivalente e nao duplicar | sim | sim | nao | sim | media | via `item_auxiliar`/CBOS |
| TISS | `_TISS_TIPO_ATENDIMENTO` | parcial | equivalente futuro | talvez | nao | talvez | sim | media | depende de contrato tecnico |
| TISS | `_TISS_TIPO_FATURAMENTO` | parcial | equivalente futuro | talvez | nao | talvez | sim | media | depende de contrato tecnico |
| Procedimentos | `TAB_PRC` / `TAB_PRC_ITEM` | sim | manter e melhorar | sim | sim | nao | sim | alta | tabela privada / catalogo |
| Procedimentos | `TAB_GEN_ITEM*` | sim | manter e melhorar | sim | sim | nao | sim | alta | catalogo generico |
| Materiais | `TAB_MAT*` | sim | manter e melhorar | sim | sim | nao | sim | media | catalogo de materiais |
| Repasses | `TAB_REPASSE` | parcial | manter equivalente e melhorar | sim | nao | sim | sim | media | nao seedar dados comerciais |
| CID | `CID_ITEM` | sim | manter ou melhorar | sim | sim | nao | sim | alta | nao duplicar |
| Especialidades | `_ESPECIALIDADE` | parcial | manter equivalente e melhorar | sim | sim | nao | sim | media | uso de lookup/brana |
| Fases/status | `_FASE_PROCEDIMENTO`, `_STATUS_INTERV` | parcial | manter + incluir equivalente faltante | sim | parcial | sim | sim | media | `STATUS_INTERV` segue pendente |
| Simbolos | `_SIMBOLO_ODONTO`, `_SIMBOLO_ANOMALIA` | parcial | manter e melhorar | sim | sim | nao | sim | alta | catalogo grafico |
| Odontograma | `DENTE`, `ARCADA`, `FACE` | nao literal | equivalente estrutural futuro | talvez | nao | talvez | sim | media | nao seedar pacientes |
| Anamnese | `ANAMNESE_QUEST`, `ANAMNESE_PERG` | sim | manter e melhorar | sim | sim | nao | sim | alta | seed estrutural |
| Anamnese | `ANAMNESE_RESP` | sim | nao seedar dados de uso | sim | nao | sim | sim | media | resposta e transacional |
| Agenda | `AGENDA` / legado | parcial | nao seedar dados de uso | sim | nao | sim | sim | media | runtime operacional |
| Financeiro | `GRUPO_FINANCEIRO`, `CATEGORIA_FINANCEIRA`, `LANCAMENTO` | sim | manter estrutura e nao seedar lancamentos | sim | parcial | sim | sim | media | movimentos ficam vazios |
| Relatorios/interface | `CONFIG_REPORT`, `CUSTOMPAGE`, `CUSTOMCONTROL` | parcial | manter e planejar equivalentes | parcial | parcial | sim | sim | alta | interface precisa de contrato proprio |
| Configuracao global | `SISTEMA` | parcial | manter equivalente e melhorar | parcial | parcial | sim | sim | alta | preferences/system_options |
| Tratamento | `TRATAMENTO` | sim | manter equivalente e nao seedar uso | sim | nao | sim | sim | media | runtime clinico |

## 18. Proxima subetapa recomendada
- Recomendacao: `EasyDental virgem - Subetapa 8G - fechamento do contrato mestre revisado`.
- Justificativa: a 8F corrige a classificacao estrutural, mas ainda existem pontos equivalentes que podem precisar fechamento fino, especialmente entre literal, equivalente funcional e futura tabela propria.

## 19. Plano de verificacao
- Somente o documento novo e o roadmap foram alterados.
- Nenhum codigo foi alterado.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foram alterados.
- `backend` nao foi alterado.
- `banco/schema/migrations/seeds/endpoints` nao foram alterados.
- Nenhum arquivo do EasyDental foi alterado.
- Nenhum script SQL foi executado.
- Nenhuma query de escrita foi executada.
- Nenhuma conta foi criada.
- A conta ID 16 nao foi alterada.
- Nenhuma conta existente foi alterada.
- A tela de setup nao foi alterada.
- Dados sensiveis nao foram expostos.
- A blindagem textual/mojibake foi respeitada.
