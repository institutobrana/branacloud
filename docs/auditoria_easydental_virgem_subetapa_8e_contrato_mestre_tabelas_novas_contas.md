# Auditoria EasyDental virgem - Subetapa 8E - contrato mestre de tabelas e registros de novas contas

## 1. Contexto
- Esta subetapa referencia as Subetapas 0 a 8D da frente "Auditoria comparativa EasyDental virgem x Brana Cloud - contrato mestre das tabelas e registros que nascerao em novas contas".
- A trilha documental ja foi corrigida nas Subetapas 8B, 8C e 8D.
- Esta etapa consolida o contrato mestre antes de qualquer implementacao.
- O objetivo e listar os modulos, tabelas, entidades e registros que devem ou nao nascer em novas contas Brana.
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

## 3. Premissas finais
- Novas contas devem nascer prontas e abertas.
- O setup nao cria a estrutura minima.
- Contas existentes preservam legado.
- Brana e a tabela privada padrao para novas contas.
- PARTICULAR permanece em contas existentes.
- A unidade inicial contratual e `Principal` / `0001`.
- `Mestre` ID `1` orienta o admin inicial.
- `Clínica` ID `255` orienta o prestador e o usuario sistemico.
- Registros estruturais devem ser protegidos.
- Logs, historicos e transacionais nao devem virar seed.
- O Brana nao deve duplicar o que ja existe.
- Se o Brana ja possui equivalente, o contrato manda manter ou melhorar, nao duplicar.
- A implementacao futura deve respeitar modularizacao segura.

## 4. Regra de classificacao

Classificacoes usadas neste contrato:
- `nasce obrigatoriamente`: deve ser seedado em toda nova conta.
- `nasce se confirmado por contrato tecnico`: depende de decisao futura formal.
- `ja existe no Brana e sera mantido`: existe e nao deve ser duplicado.
- `ja existe no Brana e sera melhorado`: existe, mas o EasyDental oferece referencia melhor.
- `nao nasce como seed`: e transacional, historico, log ou dado de uso.
- `pendente`: precisa de decisao futura.
- `global do sistema`: vale para todas as contas.
- `por clinica/tenant`: vale por conta.
- `configuravel pelo usuario`: pode ser alterado depois.
- `protegido contra exclusao`: nao pode ser removido sem regra explicita.

## 5. Contrato mestre por modulo

### A. Clinica / tenant / conta SaaS

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `UNIDADE` / clinica base | `clinica` / tenant | sim | sim | manter e regular | por clinica | parcialmente | sim | e a conta SaaS |
| `SISTEMA` | preferencias/system_options | se confirmado | parcial | melhorar equivalente | global do sistema | parcialmente | sim | registro global estrutural |
| meta de trial/ativo | campos da clinica | sim | sim | manter | por clinica | parcialmente | sim | conta pronta e aberta |
| assinatura digital compatibilidade | recurso propio Brana | sim | sim | manter | por clinica | nao | sim | nao existe no EasyDental |

### B. Unidade de atendimento

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `UNIDADE` / `Principal` | `unidade_atendimento` | sim | nao localizado como seed formal | incluir | por clinica | parcialmente | sim | unidade base obrigatoria |
| codigo `0001` | codigo da unidade | sim | nao localizado como seed formal | incluir | por clinica | nao | sim | referencia estrutural |
| unidade unica | unidade unica da conta | sim | parcial | incluir | por clinica | parcialmente | sim | nao excluir se for unica |
| vinculo com clinica/admin/prestador | relacao de contexto | sim | parcial | regular | por clinica | nao | sim | nao depender de setup |

### C. Usuarios

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `USUARIO 1` / `Mestre` | admin inicial | sim | sim | manter e regular | por clinica | parcialmente | sim | acesso amplo |
| `USUARIO 255` / `Clínica` | usuario system | sim | sim | manter e regular | por clinica | parcialmente | sim | papel estrutural |
| usuarios comuns | usuarios criados depois | nao por padrao | sim | nao nascer | por clinica | sim | nao | nascem por acao do usuario |
| `setup_completed` | flag de setup | sim | sim | manter | por clinica | nao | nao | nao cria estrutura minima |

### D. Prestadores

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `PRESTADOR 1` / `Mestre` | referencia admin/apoio | se confirmado | parcial | pendente | por clinica | parcialmente | sim | papel documental de referencia |
| `PRESTADOR 255` / `Clínica` | prestador sistemico/reservado | sim | sim | manter e regular | por clinica | parcialmente | sim | nao excluir por usuario comum |
| prestador comum | prestador do usuario | nao por padrao | sim | nao nascer | por clinica | sim | nao | criado depois pelo usuario |
| `PREST_ESP` | vinculacao especialidade-prestador | se confirmado | parcial | incluir | por clinica | sim | sim | estrutura relacional |

### E. Perfis / permissoes / matriz de acesso

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `SIS_PERFIL` | access_profile | sim | sim | manter e melhorar | por clinica | sim | sim | perfis reservados |
| `USUARIO_PERFIL` | usuario_perfil_acesso ou equivalente | sim | nao formal no baseline 16 | incluir | por clinica | sim | sim | matriz formal obrigatoria |
| `USUARIO_MODULO` | equivalente Brana | se confirmado | parcial | incluir se necessario | por clinica | sim | sim | evitar divergencia |
| `USUARIO_FUNCAO` | equivalente Brana | se confirmado | parcial | incluir se necessario | por clinica | sim | sim | cobertura ampla do admin |
| `permissoes_json` | permissao operacional | sim | sim | manter, mas nao como unica fonte | por clinica | sim | nao sozinho | nao basta sozinho |

### F. Tabela privada / tabelas de procedimentos

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `TAB_PRC` | `procedimento_tabela` | sim | sim | manter e regular | por clinica | parcialmente | sim | tabela privada Brana |
| `Brana` | tabela privada padrao | sim | sim | incluir | por clinica | nao | sim | padrao de novas contas |
| `PARTICULAR` | legado | nao para novas contas | sim em contas antigas | manter legado | por clinica | nao | sim | nao migrar automaticamente |
| `Tabela Exemplo` | metadata legada | nao como seed novo | sim como metadata | nao duplicar | por clinica | nao | nao | convivencia legada a tratar |
| quantidade de tabelas | seed minimo | sim | sim | manter | por clinica | parcialmente | sim | sem precificacao indevida |

### G. Procedimentos canonicos

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `TAB_PRC_ITEM` | `procedimento` | sim | sim | manter e melhorar | por clinica | sim | sim | catalogo canonico |
| procedimentos da tabela Brana | `procedimento` seed | sim | sim | incluir | por clinica | sim | sim | 336 procedimentos base |
| procedimentos com preco zero | seeds de nascimento | sim | sim | manter | por clinica | parcialmente | sim | evitar preco indevido |
| ligacoes de generico/especialidade/simbolo | relacoes de catalogo | se confirmado | parcial | melhorar | por clinica | sim | sim | contrato fino futuro |

### H. Procedimentos genericos

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `TAB_GEN_ITEM` | `procedimento_generico` | sim | sim | manter e melhorar | por clinica | sim | sim | catalogo generico |
| `TAB_GEN_ITEM_FASE` | fase generica | se confirmado | parcial | incluir | por clinica | sim | sim | fluxo clinico |
| `TAB_GEN_ITEM_MAT` | material generico | se confirmado | parcial | incluir | por clinica | sim | sim | ligacao estrutural |
| descricao/codigo | codigos genericos | sim | sim | manter | por clinica | sim | nao | sem historico transacional |

### I. CID

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CID_ITEM` | `doenca_cid` | sim | sim | manter e melhorar | global do sistema | nao | sim | seed clinico estrutural |
| codigo/nome CID | CID base | sim | sim | manter | global do sistema | nao | sim | nao e dado de uso |

### J. Especialidades

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `_ESPECIALIDADE` | especialidades | sim | sim/parcial | incluir e regular | global/por clinica | sim | sim | base estrutural |
| relacao com prestadores | `PREST_ESP` | se confirmado | parcial | incluir | por clinica | sim | sim | nao duplicar |

### K. Fases / status de procedimento e intervencao

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `_FASE_PROCEDIMENTO` | fase procedimento | se confirmado | parcial | incluir | global/por clinica | sim | sim | fluxo clinico |
| `_STATUS_INTERV` | status intervencao | se confirmado | parcial | incluir | global/por clinica | sim | sim | fluxo clinico |
| fases genericas | fases catalogo | se confirmado | parcial | incluir | por clinica | sim | sim | se o Brana precisar |

### L. Simbolos odontologicos / anomalias

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `_SIMBOLO_ODONTO` | simbolos odontologicos | sim | sim/parcial | manter e melhorar | global/por clinica | sim | sim | odontograma |
| `_SIMBOLO_ANOMALIA` | simbolos/anomalias | sim | sim/parcial | manter e melhorar | global/por clinica | sim | sim | odontograma |
| `simbolo_grafico_catalogo` | catalogo Brana | sim | sim | manter | por clinica | sim | sim | exemplos e rótulos |

### M. Odontograma / dente / face / arcada

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `DENTE` | dente/odontograma | nao como seed de uso | parcial | nao nascer como transacional | por clinica | nao | sim | estrutura historica/trabalho |
| `ARCADA` | arcada odontologica | nao como seed de uso | parcial | nao nascer como transacional | por clinica | nao | sim | estrutura visual/clinica |
| `FACE` | face odontologica | nao como seed de uso | parcial | nao nascer como transacional | por clinica | nao | sim | estrutura de intervencao |
| `INTERVENCAO` | intervencao | nao como seed de uso | sim | nao nascer como seed | por clinica | nao | sim | transacional, nao seed |

### N. Anamnese / questionarios / perguntas

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `ANAMNESE_QUEST` | questionarios | sim | sim/parcial | incluir e melhorar | por clinica | sim | sim | nascem |
| `ANAMNESE_PERG` | perguntas | sim | sim/parcial | incluir e melhorar | por clinica | sim | sim | nascem |
| `ANAMNESE_RESP` | respostas | nao | sim/operacional | nao nascer | por clinica | nao | nao | transacional |
| `custom form` | formulários de anamnese | se confirmado | parcial | pendente | por clinica | sim | sim | depende do modelo Brana |

### O. Materiais

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `TAB_MAT` | lista_material | se confirmado | sim | manter e regular | por clinica | sim | sim | catalogo estrutural |
| `TAB_MAT_ITEM` | material | se confirmado | sim | manter e regular | por clinica | sim | sim | itens de material |
| `TAB_GEN_ITEM_MAT` | ligacao material/procedimento | se confirmado | parcial | incluir | por clinica | sim | sim | estrutura relacional |
| valores/custos | custo/preco | pendente | parcial | pendente | por clinica | sim | sim | evitar preco indevido |

### P. Custos / repasses

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `TAB_REPASSE` | repasses | pendente | parcial | pendente | por clinica | sim | sim | estrutura sensivel |
| repasse/procedimento | regra de repasse | pendente | parcial | pendente | por clinica | sim | sim | nao seedar valor comercial |
| custo comercial | valores | nao como seed | parcial | nao nascer | por clinica | sim | nao | pode ficar vazio/zero |

### Q. Convenios / planos

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CONVENIO` | convenio_odonto | se confirmado | sim | manter e regular | por clinica | sim | sim | estrutural/comercial |
| `PLANO` | plano_odonto | se confirmado | sim | manter e regular | por clinica | sim | sim | estrutural/comercial |
| `Particular` | convenio/plano particular | sim/legado | sim | manter legado | por clinica | sim | sim | nao migrar contas antigas |

### R. TISS / regioes / tipo de tabela

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `_TISS_REGIAO_PROCEDIMENTO` | regiao TISS | se confirmado | parcial | regular | global/por clinica | sim | sim | lookup estrutural |
| `_TISS_TIPO_TABELA` | tipo TISS | se confirmado | parcial | regular | global/por clinica | sim | sim | lookup estrutural |

### S. Lookups auxiliares

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `_TIPO_USUARIO` | tipo_usuario | sim | sim | manter | global do sistema | nao | sim | seed estrutural |
| `_BANCO` | bancos | sim | sim/parcial | regular | global/por clinica | sim | sim | lookup |
| `_CIDADE` | cidades | sim | sim/parcial | regular | global/por clinica | sim | sim | lookup |
| `_ESTADO_CIVIL` | estado civil | sim | sim/parcial | regular | global/por clinica | sim | sim | lookup |
| `_TIPO_LOGRADOURO` | tipo logradouro | sim | sim/parcial | regular | global/por clinica | sim | sim | lookup |
| `_TIPO_CONTATO` | tipo contato | sim | sim/parcial | regular | global/por clinica | sim | sim | lookup |
| `_TIPO_APRESENTACAO` | tipo apresentacao | sim | sim/parcial | regular | global/por clinica | sim | sim | lookup |
| `_TIPO_INDICA` | tipo indica | sim | sim/parcial | regular | global/por clinica | sim | sim | lookup |
| `_UNID_MEDIDA` | unidade de medida | sim | sim/parcial | regular | global/por clinica | sim | sim | lookup |
| `item_auxiliar` | auxiliares variados | pendente | parcial | pendente | global/por clinica | sim | sim | avaliar caso a caso |

### T. Configuracao global / preferencias / sistema

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `SISTEMA` | preferences/system_options | se confirmado | parcial | regular | global do sistema | sim | sim | registro global |
| preferencias | preferences | sim | sim | manter | por clinica/global | sim | sim | nao depender de setup |
| opcoes do sistema | system_options | sim | sim | manter | global/por clinica | sim | sim | defaults da conta |

### U. Relatorios / interface / formularios

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CONFIG_REPORT` | relatorio_config | se confirmado | nao/0 no baseline 16 | incluir se houver contrato | por clinica | sim | sim | seeds de relatorio |
| `CUSTOMPAGE` | pages/formularios | sim | sim | manter e regular | por clinica | sim | sim | interface clinica |
| `CUSTOMCONTROL` | controls/formularios | sim | sim | manter e regular | por clinica | sim | sim | interface clinica |

### V. Agenda

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `AGENDA` | agenda | nao como transacional | sim | nao nascer como seed | por clinica | sim | nao | agenda nasce vazia |
| `AGENDA_BLOQUEIO` | bloqueios | nao como seed | parcial | nao nascer | por clinica | sim | nao | transacional |
| configuracoes de agenda | settings | se confirmado | parcial | pendente | por clinica | sim | sim | estrutural apenas se necessario |

### W. Financeiro

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CCPACIENTE` | financeiro/paciente | nao como seed | parcial | nao nascer | por clinica | sim | sim | transacional |
| `CCCIRURGIAO` | financeiro/profissional | nao como seed | parcial | nao nascer | por clinica | sim | sim | transacional |
| `PARCELA` | parcelas | nao como seed | parcial | nao nascer | por clinica | sim | nao | transacional |
| `RECIBO` | recibos | nao como seed | parcial | nao nascer | por clinica | sim | nao | transacional |
| `RETORNO` | retorno financeiro | nao como seed | parcial | nao nascer | por clinica | sim | nao | transacional |
| `grupo_financeiro` / `categoria_financeira` / `indice_financeiro` | grupos e indices | se confirmado | sim/parcial | regular | global/por clinica | sim | sim | estrutura, nao movimento |

### X. Assinatura digital e recursos proprios do Brana

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| assinatura digital | recurso proprio Brana | sim | sim | manter | por clinica | sim | sim | nao existe no EasyDental |
| `plataforma_assinaturas` | assinatura/plano | se confirmado | sim | manter | global/por clinica | sim | sim | compatibilidade do SaaS |
| `assinaturas` | registros de assinatura | nao como seed | sim/0 no baseline 16 | nao nascer como seed | por clinica | nao | sim | transacional do SaaS |

### Y. Setup

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `setup_completed` | flag de setup | sim | sim | manter | por clinica | nao | nao | nao cria estrutura minima |
| tela de setup | fluxo opcional | nao como criador de seed | sim | reduzir/dispensar futuramente | por clinica | sim | nao | nao remover nesta etapa |

### Z. Logs / historicos / temporarios / transacionais

| tabela/conceito EasyDental | equivalente Brana | nasce em nova conta? | ja existe no Brana? | decisao | escopo | configuravel? | protegido? | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `USRLOG` | log de usuario | nao | parcial | nao nascer | por clinica | nao | nao | log |
| `LOGON` | sessao/logon | nao | parcial | nao nascer | por clinica | nao | nao | log |
| `HISTORICO` | historico clinico | nao | parcial | nao nascer | por clinica | nao | nao | historico/transacional |
| `INTERVENCAO` | intervencao | nao | sim | nao nascer como seed | por clinica | nao | sim | transacional |
| `DENTE` | odontograma | nao | sim | nao nascer como seed | por clinica | nao | sim | historico de uso |
| `ARCADA` | odontograma | nao | sim | nao nascer como seed | por clinica | nao | sim | historico de uso |
| `FACE` | odontograma | nao | parcial | nao nascer como seed | por clinica | nao | sim | historico de uso |
| `TMP_*` | temporarios | nao | varios | nao nascer | global/por clinica | nao | nao | artefatos temporarios |
| `ANAMNESE_RESP` | respostas | nao | sim | nao nascer | por clinica | nao | nao | resposta transacional |

## 6. Tabelao final - tudo que nasce em nova conta

| modulo | tabela/conceito | nome esperado | codigo esperado | nasce? | escopo | protegido? | editavel? | status | observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Clinica/tenant | clinica | nome da conta | id da conta | sim | por clinica | sim | parcialmente | fechado | conta SaaS |
| Unidade | unidade_atendimento | Principal | 0001 | sim | por clinica | sim | parcialmente | fechado | unidade inicial |
| Usuarios | usuario | Mestre / system / admin | 1 / 255 | sim | por clinica | sim | parcialmente | fechado | admin e system |
| Prestadores | prestador | Mestre / Clinica | 1 / 255 | sim | por clinica | sim | parcialmente | fechado | sistema e apoio |
| Perfis | access_profile | reservados | variado | sim | por clinica | sim | sim | fechado | perfis base |
| Permissoes | usuario_perfil_acesso / equivalente | matriz formal | variado | sim | por clinica | sim | sim | fechado | nao depender de JSON sozinho |
| Tabela privada | procedimento_tabela | Brana | variado | sim | por clinica | sim | sim | fechado | nova conta |
| Procedimentos canonicos | procedimento | catalogo base | variado | sim | por clinica | sim | sim | fechado | seed odontologico |
| Procedimentos genericos | procedimento_generico | catalogo base | variado | sim | por clinica | sim | sim | fechado | seed odontologico |
| CID | doenca_cid | CID base | variado | sim | global | sim | nao | fechado | lookup clinico |
| Especialidades | especialidades | catalogo base | variado | sim | global/por clinica | sim | sim | fechado | referencia estrutural |
| Fases/status | fases/status | catalogo base | variado | sim | global/por clinica | sim | sim | fechado | fluxo clinico |
| Simbolos | simbolos odontologicos | catalogo base | variado | sim | global/por clinica | sim | sim | fechado | odontograma |
| Anamnese | questionarios/perguntas | catalogo base | variado | sim | por clinica | sim | sim | fechado | respostas nao |
| Materiais | lista/material | catalogo base | variado | se confirmado | por clinica | sim | sim | pendente | evitar preco indevido |
| Lookups | `_TIPO_*`, `_CIDADE`, `_BANCO`, `_UNID_MEDIDA` etc. | seeds auxiliares | variado | sim | global/por clinica | sim | nao | fechado | suporte de cadastro |
| Configuracao | sistema/preferences | defaults da conta | variado | se confirmado | global/por clinica | sim | sim | pendente | nao depender de setup |
| Relatorios/interface | config_report/custompage/customcontrol | seeds de UI | variado | sim/parcial | por clinica | sim | sim | fechado | interface minima |
| Assinatura digital | assinatura digital | compatibilidade SaaS | n/a | sim | por clinica | sim | sim | fechado | recurso proprio |

## 7. Tabelao final - tudo que nao nasce

| tabela/conceito | motivo | nasce vazia? | nao criar? | observacao |
| --- | --- | --- | --- | --- |
| `USRLOG` | log de uso | nao | sim | nao seedar |
| `LOGON` | sessao/log | nao | sim | nao seedar |
| `HISTORICO` | historico transacional | nao | sim | nao seedar |
| `INTERVENCAO` | movimento clinico | nao | sim | nao seedar |
| `DENTE` | registro historico/odontograma | nao | sim | nao seedar |
| `ARCADA` | registro historico/odontograma | nao | sim | nao seedar |
| `FACE` | registro historico/odontograma | nao | sim | nao seedar |
| `CCPACIENTE` | financeiro/transacional | nao | sim | nao seedar |
| `CCCIRURGIAO` | financeiro/transacional | nao | sim | nao seedar |
| `PARCELA` | financeiro/transacional | nao | sim | nao seedar |
| `RECIBO` | financeiro/transacional | nao | sim | nao seedar |
| `RETORNO` | financeiro/transacional | nao | sim | nao seedar |
| `AGENDA` | agenda de uso | nao | sim | fica vazia |
| `ANAMNESE_RESP` | respostas transacionais | nao | sim | nao seedar |
| `TMP_*` | temporarios | nao | sim | nao seedar |
| transacionais e historicos | uso posterior | nao | sim | seed apenas estrutura minima |

## 8. Pendencias finais antes de implementacao

| pergunta | impacto | sugestao | subetapa futura |
| --- | --- | --- | --- |
| `usuario_perfil_acesso` ou equivalente sera formal? | acesso seguro | sim, como fonte de verdade adicional | contrato tecnico de permissao |
| `Principal` / `0001` e fixo ou parametrizavel? | unidade inicial | fixo como referencia padrao, com contrato tecnico se variar | baseline/implementacao isolada |
| `Mestre` ID 1 e `Clínica` ID 255 sao papes separados ou vinculados? | consistencia estrutural | manter referencia documental e definir vinculos antes de codificar | contrato tecnico de usuarios/prestadores |
| `Brana` tera preco zero, sem preco ou preco padrao? | risco comercial | manter pendente ate contrato comercial | contrato tecnico de tabela privada |
| materiais e repasses nascem com estrutura ou vazios? | precificacao | pendente, com tendencia a estrutura vazia e zero | contrato tecnico de materiais/repasses |
| config global persistida nasce ou nao? | setup e defaults | nascer apenas se confirmado por contrato tecnico | contrato tecnico de sistema |
| agenda e financeiro nascem vazios ou com seeds auxiliares? | risco transacional | devem nascer vazios, salvo lookup estrutural | contrato tecnico especifico |

## 9. Ordem futura de implementacao
- Unidade `Principal` / `0001` apenas para novas contas.
- Matriz formal de permissoes.
- Tabela Brana e metadata legada.
- Seeds odontologicos faltantes.
- Protecao de registros estruturais.
- Setup opcional/reduzido.

## 10. Proxima subetapa recomendada
`EasyDental virgem - Subetapa 8F - baseline documental comparativa da conta atual contra o contrato mestre de novas contas, sem alteracao de codigo`

### Justificativa
- O contrato mestre agora delimita o que nasce, o que nao nasce, o que e pendente e o que precisa de protecao.
- A proxima etapa mais segura e comparar a conta atual contra esse contrato fechado antes de qualquer implementacao.
- Isso preserva modularizacao, evita mistura de escopos e deixa o contrato testavel.

## 11. Regra de modularizacao para futuras implementacoes
- Nenhuma implementacao futura deve aumentar `frontend/app.js` quando puder virar modulo.
- Nova logica frontend deve nascer em `frontend/js/modules/` sempre que possivel.
- Mudancas backend devem preferir helpers e services pequenos e isolados.
- Banco/schema/migrations/seeds/endpoints devem ter contrato proprio antes de qualquer alteracao.
- Contas existentes nao devem ser alteradas automaticamente.
- Novas regras devem valer primeiro apenas para novas contas.

## 12. Plano de verificacao
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
