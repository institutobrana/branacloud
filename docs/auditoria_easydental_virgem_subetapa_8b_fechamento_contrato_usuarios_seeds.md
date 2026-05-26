# Auditoria EasyDental virgem - Subetapa 8B - fechamento do contrato de usuarios, prestadores e seeds

## 1. Contexto
- Esta subetapa referencia as Subetapas 0 a 8A da frente "Auditoria comparativa EasyDental virgem x Brana Cloud - fechamento final do contrato de usuarios/prestadores e matriz de seeds para novas contas".
- Esta etapa fecha documentalmente o contrato antes de baseline e teste.
- Nao ha implementacao nesta etapa.
- O foco e novas contas SaaS.

## 2. Seguranca e limites
- Nenhum codigo foi alterado.
- Nenhum seed ou migration foi alterado.
- Nenhum banco foi alterado.
- Nenhum script SQL foi executado.
- Nenhum arquivo EasyDental foi alterado.
- Nenhuma conta foi criada.
- Nenhuma conta existente foi alterada.
- A tela de setup nao foi alterada.
- A blindagem textual/mojibake foi respeitada.

## 3. Premissas finais do contrato
- Novas contas Brana devem nascer prontas e abertas.
- O setup nao deve ser responsavel por criar estrutura minima.
- Contas existentes preservam legado.
- PARTICULAR permanece em contas existentes.
- Brana e a tabela privada padrao para novas contas.
- Brana nao deve duplicar o que ja existe.
- EasyDental e referencia forte para seeds estruturais, mas nao copia cega.
- Logs, historicos e dados transacionais nao devem virar seed.
- Registros estruturais devem ser protegidos.
- Assinatura digital e recursos proprios do Brana devem ser preservados.

## 4. Fechamento - Mestre e Clinica

### 4.1 Clinica no EasyDental
- `USUARIO` `NROUSR=255` / `TIPO=255`
- `PRESTADOR` `ID=255` / `COD=001`
- `UNIDADE` `ID=1`
- Interpretacao: papel estrutural literal de clinica/base da instalacao.

### 4.2 Mestre no EasyDental
- Nao localizado literalmente.
- Inferido funcionalmente como `USUARIO NROUSR=1` / `PRESTADOR ID=1` com permissoes amplas.
- Interpretacao: papel admin-like de dono/operador central, ainda pendente de mapeamento literal.

### 4.3 Equivalencia Brana
- Clinica = `system user 255` + `system prestador 255`, salvo revisao futura.
- Mestre = admin inicial `codigo=1` / `is_admin=True`, salvo revisao futura.

### 4.4 Regras
- Ambos os papeis devem existir em novas contas.
- Ambos devem ser protegidos contra exclusao indevida.
- O admin inicial nao pode perder acesso total.
- O prestador sistemico nao pode ser excluido por usuario comum.
- Alteracoes permitidas devem ser definidas por contrato tecnico futuro.

## 5. Contrato final - usuarios

| Usuario | Nome esperado | Codigo esperado | Papel | Permissoes | Vinculo clinica | Vinculo unidade | Vinculo prestador | Editavel? | Excluivel? | Protegido? | Pendencias |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Usuario admin inicial | usuario inicial/admin | `1` | admin/owner | cobertura ampla | sim | provavel | provavel | parcial | nao | sim | regras finas de UI/perfis |
| Usuario sist emico | `Clínica` | `255` | papel estrutural base | acesso reservado/estrutural | sim | sim | sim | parcial | nao | sim | visibilidade final |
| Usuario comum posterior | nome definido pelo usuario | sequencial | operador da conta | conforme perfil | sim | opcional | opcional | sim | sim, se permitido | nao, por padrao | matriz por perfil |

## 6. Contrato final - prestadores

| Prestador | Nome esperado | Codigo esperado | source_id | is_system_prestador | Tipo | executa_procedimento | inativo | Vinculo usuario/admin | Vinculo unidade | Editavel? | Excluivel? | Visivel na interface? | Protegido? | Pendencias |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Prestador sistemico/reservado | `Clínica` | `001` | `255` | sim | clinica odontologica | sim, se mantido | nao, se mantido | sim | sim | parcial | nao | pendente de decisao | sim | regra final de exibicao |
| Prestador comum posterior | nome definido pelo usuario | sequencial | nao sistemico | nao | conforme cadastro | conforme fluxo | conforme cadastro | opcional | sim | sim | sim, se permitido | sim | regras de agenda/relacao |

## 7. Contrato final - unidade
- A unidade inicial ou estrutura equivalente deve nascer.
- Nome esperado: unidade base da conta ou padrao do tenant.
- Deve vincular clinica, admin e, se adotado, prestador sistemico.
- Deve ser editavel parcialmente.
- Se for a unica, deve ser protegida contra exclusao.
- A unidade e parte estrutural do nascimento e nao depende da tela de setup.
- Pendencia: definir se a unidade e obrigatoria ou equivalente opcional na arquitetura Brana.

## 8. Contrato final - permissoes/perfis
- Perfis base que nascem: perfis funcionais da conta, em cobertura suficiente para nao bloquear a abertura da conta.
- Matriz de acesso que nasce: `USUARIO_PERFIL`, `USUARIO_MODULO`, `USUARIO_FUNCAO` como referencia funcional, ou equivalente Brana.
- Permissoes admin: cobertura ampla para usuario inicial.
- Estrutural: perfis base, usuario inicial e prestador sistemico.
- Configuravel depois: vinculos finos por modulo/perfil/usuario.
- Relacao com modelo Brana atual: manter o modelo atual quando ja existir, e melhorar onde o EasyDental for superior em organizacao estrutural.
- Relacao com EasyDental `SIS_*` e `USUARIO_*`: usar como referencia forte de nascimento, sem duplicacao cega.
- Decisao: manter modelo Brana e melhorar com referencia EasyDental, sem criar duplicidade desnecessaria.

## 9. Contrato final - tabela Brana/PARTICULAR
- Novas contas nascem com tabela privada Brana.
- Contas existentes mantem PARTICULAR.
- Nao migrar automaticamente.
- `PRIVATE_TABLE_NAME = "PARTICULAR"` deve permanecer como contrato tecnico futuro do legado.
- Preco ainda pode ficar pendente, se nao decidido no contrato tecnico.
- Testes obrigatorios futuros: nova conta deve nascer com Brana; conta legada deve continuar com PARTICULAR.

## 10. Matriz de seeds obrigatorios para novas contas

| Grupo | Nasce em nova conta? | Ja existe no Brana? | Decisao | Fonte EasyDental | Fonte Brana | Observacao |
| --- | --- | --- | --- | --- | --- | --- |
| CID | sim | sim/parcial | incluir e melhorar | `CID_ITEM` | `DoencaCid` | base clinica |
| Tabela generica | sim | sim/parcial | incluir e melhorar | `TAB_GEN_ITEM` | `ProcedimentoGenerico` | seed estrutural |
| Procedimentos canonicos | sim | sim/parcial | incluir e melhorar | `TAB_PRC_ITEM` | `Procedimento` | nova conta precisa nascer completa |
| Procedimentos genericos | sim | sim/parcial | incluir e melhorar | `TAB_GEN_ITEM` | `ProcedimentoGenerico` | nao duplicar |
| Tabela Brana | sim | sim | incluir | `TAB_PRC` | `ProcedimentoTabela` | apenas novas contas |
| Especialidades | sim | sim/parcial | incluir e regular | `_ESPECIALIDADE` | modelos de especialidade | base estrutural |
| Fases de procedimento | sim | parcial | incluir | `_FASE_PROCEDIMENTO` | catalogos auxiliares | fluxo clinico |
| Status de intervencao | sim | parcial | incluir | `_STATUS_INTERV` | catalogos auxiliares | fluxo clinico |
| Simbolos odontologicos | sim | parcial | incluir | `_SIMBOLO_ODONTO` | simbolos | odontograma |
| Simbolos/anomalias | sim | parcial | incluir | `_SIMBOLO_ANOMALIA` | simbolos | odontograma |
| Anamnese questionarios/perguntas | sim | sim/parcial | incluir e melhorar | `ANAMNESE_QUEST` / `ANAMNESE_PERG` | anamnese | precisa nascer preenchido |
| Materiais estruturais | pendente | parcial | pendente | `TAB_MAT` / `TAB_MAT_ITEM` | materiais | nao seedar preco indevido |
| Repasses estruturais | pendente | parcial | pendente | `TAB_REPASSE` | repasses | tratar com cautela |
| TISS/regioes/tipo de tabela | pendente | parcial | regular | `_TISS_*` | TISS | depende de contrato futuro |
| Relatorios/interface/formularios | sim | parcial | regular | `CONFIG_REPORT`, `CUSTOMPAGE`, `CUSTOMCONTROL` | preferencias/relatorios | seeds de UI |
| Configuracoes globais | sim | parcial | regular | `SISTEMA` | preferences/system_options | decidir persistencia global |
| Lookups auxiliares | sim | parcial | regular | `_TIPO_*`, `_BANCO`, `_CIDADE`, `_UNID_MEDIDA` etc. | cadastros auxiliares | suporte de cadastro |
| Assinatura digital | sim | sim | manter | recurso proprio Brana | assinatura | nao existe no EasyDental |

## 11. O que deve ser incluido no contrato de novas contas
- Usuario admin inicial.
- Usuario sistemico/base `Clínica`, se mantido pelo contrato.
- Prestador sistemico/reservado `Clínica`.
- Unidade inicial ou estrutura equivalente.
- Tabela Brana como tabela privada de novas contas.
- Perfis base e matriz inicial de acesso.
- CID.
- Tabela generica.
- Procedimentos canonicos e genericos.
- Especialidades.
- Fases/status.
- Simbolos odontologicos e anomalias.
- Anamnese base.
- Lookups auxiliares de cadastro.
- Configuracoes globais minimas.

## 12. O que deve melhorar equivalente existente
- `SISTEMA`/preferences/system_options.
- `SIS_PERFIL`, `SIS_MODULO`, `SIS_FUNCAO`.
- `USUARIO_PERFIL`, `USUARIO_MODULO`, `USUARIO_FUNCAO`.
- `CID_ITEM` via `DoencaCid`.
- `TAB_PRC*`.
- `TAB_GEN_*`.
- `TAB_MAT*`.
- `CONFIG_REPORT`.
- `CUSTOMPAGE`.
- `CUSTOMCONTROL`.
- `CONVENIO`/`PLANO`.
- `ANAMNESE_*`.

## 13. O que fica fora do nascimento
- `USRLOG`.
- `LOGON`.
- `HISTORICO`.
- `INTERVENCAO`.
- `DENTE`.
- `ARCADA`.
- `FACE`.
- `CCPACIENTE`.
- `CCCIRURGIAO`.
- `AGENDA`.
- `AGENDA_BLOQUEIO`.
- `DEL_AGENDA`.
- `ESTOQUE_MOV`.
- `EXAMEPERIO`.
- `ITEMPERIO`.
- `PARCELA`.
- `RECIBO`.
- `RETORNO`.
- `SLIDE_SHOW`.
- `SLIDE_SHOW_ITEM`.
- `TMP_*`.
- qualquer artefato operacional, historico ou temporario.

## 14. Pendencias antes da implementacao

| Pergunta | Risco | Sugestao de decisao | Etapa futura |
| --- | --- | --- | --- |
| `Mestre` vira usuario sistemico ou admin inicial? | duplicar papel | tratar como admin inicial, salvo revisao futura | 8C / contrato tecnico |
| `Clínica` vira prestador sistemico, unidade ou outro papel? | conflito de papal | tratar como usuario+prestador estrutural | 8C / contrato tecnico |
| Prestador sistemico aparece na interface? | usuario pode tentar mexer | decidir visibilidade parcial | contrato tecnico |
| Admin inicial pode alterar o prestador sistemico? | perda de integridade | permitir apenas alteracoes limitadas | contrato tecnico |
| Unidade inicial e obrigatoria? | conta nascer incompleta | recomendo sim para novas contas | 8C / baseline |
| Tabela Brana nasce com preco zero, sem preco ou preco padrao? | preco indevido | pendente de contrato comercial | contrato tecnico |
| Quais tabelas odontologicas sao estrutura e quais transacionais? | seed errado | manter apenas estrutura no seed | 8C / baseline |
| Quais tabelas de anamnese nascem preenchidas? | fluxos vazios | questionarios/perguntas sim, respostas nao | contrato tecnico |
| Quais tabelas financeiras/agenda nascem vazias? | historico indevido | devem nascer vazias | contrato tecnico |
| Quais tabelas sao globais e quais por clinica? | inconsistencias multi-tenant | definir por contrato | contrato tecnico |

## 15. Fluxo final de nascimento de nova conta

| Ordem | Acao | Entidade criada | Nome/codigo esperado | Protegido? | Depende de setup? | Observacao |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Criar conta SaaS | clinica/tenant | nome da clinica | sim | nao | ponto de partida |
| 2 | Criar usuario admin inicial | usuario | `1` | sim | nao | acesso amplo |
| 3 | Criar usuario sist emico base | usuario reservado | `255` | sim | nao | papel `Clínica` |
| 4 | Criar prestador sistemico | prestador | `001` / `255` | sim | nao | nao excluir |
| 5 | Criar unidade inicial | unidade | padrao do tenant | sim | nao | se contrato aprovar |
| 6 | Criar perfis base | perfis | baseline inicial | sim | nao | evita menu vazio |
| 7 | Aplicar matriz de permissoes | permissoes | admin amplo | sim | nao | conta pronta |
| 8 | Criar tabela Brana | tabela privada | Brana | sim | nao | apenas novas contas |
| 9 | Criar seeds estruturais odontologicos | CID, genericos, canonicos, especialidades, fases, status, simbolos, anamnese | catalogos base | sim | nao | estrutura minima |
| 10 | Carregar configuracoes globais minimas | sistema/preferences | defaults | sim | nao | evitar tela quebrada |
| 11 | Expor fluxo ao usuario | interface pronta | conta aberta | sim | nao | setup nao cria estrutura minima |

## 16. Critérios para considerar o contrato pronto para baseline/teste
- Usuario admin inicial definido.
- Papel `Clínica` mapeado e protegido.
- Prestador sistemico definido e protegido.
- Unidade inicial definida ou decidida como equivalente.
- Tabela Brana definida para novas contas.
- Seeds obrigatorios definidos.
- Tabelas transacionais/log/historico fora do seed.
- Regra de preservacao de contas legadas fechada.
- Setup nao responsavel pela estrutura minima.
- Assinatura digital preservada.

## 17. Proxima subetapa recomendada
`EasyDental virgem - Subetapa 8C - baseline documental e teste manual da criacao de conta atual, sem alteracao de codigo`

## 18. Justificativa
- O contrato ficou suficientemente fechado para ir a baseline/teste.
- Persistem apenas ajustes pontuais de contrato tecnico, nao de estrutura documental principal.
- A etapa seguinte pode confirmar se a criacao atual de conta respeita o contrato antes de qualquer implementacao.

## 19. Plano de verificacao
- Somente o documento novo e o roadmap foram alterados.
- Nenhum codigo foi alterado.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foi alterado.
- `backend` nao foi alterado.
- `banco/schema/migrations/seeds/endpoints` nao foram alterados.
- Nenhum arquivo do EasyDental foi alterado.
- Nenhum script SQL foi executado.
- Nenhuma query de escrita foi executada.
- Nenhuma conta foi criada.
- Nenhuma conta existente foi alterada.
- A tela de setup nao foi alterada.
- Nenhum dado sensivel foi exposto.
- A blindagem textual/mojibake foi respeitada.
