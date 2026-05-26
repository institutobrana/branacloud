# Auditoria EasyDental virgem — Subetapa 8A — decisão de tabelas, usuários e prestadores para novas contas Brana

## 1. Contexto
- Esta subetapa referencia as Subetapas 0 a 8 da frente "Auditoria comparativa EasyDental virgem x Brana Cloud — atualização do contrato de nascimento de novas contas Brana".
- A Subetapa 8 atualizou o contrato, mas ainda faltava fechar o mapa detalhado de tabelas e o bloco específico de usuários/prestadores.
- O objetivo agora é decidir o que será mantido, regulado, incluído, melhorado, descartado ou deixado pendente no contrato de novas contas.
- O EasyDental continua sendo a referência forte de nascimento estrutural.
- O Brana não deve duplicar tabelas ou conceitos que já existem; quando houver equivalente, a tendência é manter o Brana atual ou melhorar o equivalente existente.
- O que for operacional, histórico, log, transacional ou legado desktop incompatível com SaaS não deve virar seed de nascimento.
- Não há implementação nesta etapa.

## 2. Segurança e limites
- Nenhum código foi alterado.
- Nenhum seed ou migration foi alterado.
- Nenhum banco foi alterado.
- Nenhum script SQL foi executado.
- Nenhum arquivo do EasyDental foi alterado.
- Nenhuma conta foi criada.
- Nenhuma conta existente foi alterada.
- A tela de setup não foi alterada.
- A blindagem textual/mojibake foi respeitada.

## 3. Premissa de decisão
- Novas contas devem nascer com contrato novo.
- Contas existentes preservam o legado.
- O EasyDental é referência forte de nascimento estrutural.
- O Brana não deve duplicar o que já existe.
- O Brana pode melhorar equivalentes existentes quando o EasyDental for mais completo ou mais seguro.
- Nem tudo do EasyDental entra no contrato do Brana.
- Logs, históricos, operações, uso e dados transacionais não devem ser seed de nova conta.

## 4. Bloco A — análise Mestre/Clínica

### 4.1 Resultado da busca documental/textual
- A palavra `Clínica` foi localizada literalmente em registros centrais do EasyDental.
- A palavra `Mestre` não apareceu literalmente nas consultas textuais amplas já realizadas; o mapeamento exato permanece pendente.
- O papel estrutural que mais se aproxima de `Mestre` é o usuário admin-like com cobertura ampla de permissões.

### 4.2 Registros centrais localizados

| Papel | Tabela | ID / código | Nome / apelido | Tipo | Vínculos relevantes | Indício estrutural | Observação |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Clínica | `USUARIO` | `NROUSR=255`, `TIPO=255` | `Clínica` | usuário de sistema | `ID_PRESTADOR=255`, `ID_UNIDADE=1`, presença em `USUARIO_PERFIL` | muito forte | conta base protegida, sem sinal de uso operacional comum |
| Clínica | `PRESTADOR` | `ID_PRESTADOR=255`, `COD_PRESTADOR=001` | `Clínica` | prestador estrutural | vínculo com `USUARIO 255`, `PREST_ESP` e cadastros correlatos | muito forte | candidato claro a prestador sistemico/reservado |
| Clínica | `UNIDADE` | `ID_UNIDADE=1` | `Instituto Brana - Odontologia` / `Principal` | unidade estrutural | `USUARIO.ID_UNIDADE=1` | muito forte | unidade inicial estrutural da instalação |
| Mestre provável | `USUARIO` | `NROUSR=1` | `Gleisson Tel` | usuário admin-like | cobertura ampla em `USUARIO_MODULO`, `USUARIO_FUNCAO` e perfis | forte, mas inferido | não há literal `Mestre`; papel estrutural provável |
| Mestre provável | `PRESTADOR` | `ID_PRESTADOR=1`, `COD_PRESTADOR=002` | `Gleisson Tel` | prestador operacional central | associado ao usuário 1 | forte, mas inferido | não é o sistema reservado; parece o “dono/admin” funcional |

### 4.3 Restrições e vínculos observados
- `USUARIO 255` aparece em perfis e acesso, mas não se mostrou como o mais amplo nos módulos/funções extraídos.
- `USUARIO 1` aparece com cobertura muito ampla de módulos, funções e perfis, o que reforça o papel admin-like.
- O conjunto `USUARIO 255` + `PRESTADOR 255` é o melhor equivalente literal de `Clínica`.
- O conjunto `USUARIO 1` + `PRESTADOR 1` é o melhor equivalente funcional de `Mestre` até nova validação.
- Os dados sensíveis exibidos pelas consultas foram mascarados na documentação; não houve exposição de senha, hash, documento, licença ou token.

## 5. Bloco A — decisão para Brana
- `Clínica` equivale ao par estrutural já observado no Brana: `system user 255` + `system prestador 255`, com proteção forte contra exclusão e edição total.
- `Mestre` equivale preliminarmente ao usuário admin inicial do Brana (`codigo=1`, `is_admin=True`), com cobertura ampla e proteção contra perda total de acesso.
- O Brana não precisa de um “Mestre” literal se o papel já estiver coberto pelo admin inicial.
- O prestador sistemico/reservado continua adequado como papel estrutural separado da clínica/tenant.
- O admin inicial deve continuar editável apenas parcialmente e protegido contra exclusão/perda total de acesso.
- O prestador sistemico deve ser parcialmente editável, mas não excluível por fluxo comum.
- A equivalência literal de `Clínica` deve ser protegida; a equivalência funcional de `Mestre` deve ser mantida como admin inicial/owner-like.

## 6. Bloco B — matriz completa EasyDental x Brana

### Legenda rápida
- `Tipo`: `seed estrutural`, `configuração`, `lookup`, `operacional`, `log`, `histórico`, `transacional`, `pendente`
- `Decisão`: `manter Brana atual`, `regular`, `incluir no contrato`, `melhorar equivalente existente`, `não incluir`, `pendente`
- `Equiv. Brana`: `sim`, `parcial`, `não localizado`

### 6.1 Núcleo de usuários, prestadores, permissões e sistema

| Tabela EasyDental | Registros | Estado | Função provável | Tipo | Equiv. Brana | Decisão | Risco se faltar | Observação |
| --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| `USUARIO` | 7 | populada | login, identidade, senha, preferência, vínculo com unidade/prestador | seed estrutural | sim (`Usuario` / signup) | manter Brana atual | nova conta sem usuário inicial | papel central do nascimento |
| `PRESTADOR` | 5 | populada | prestador clínico/estrutural | seed estrutural | sim (`PrestadorOdonto`) | manter Brana atual | prestador reserv ado ausente | `Clínica` 255 é literal |
| `PESSOAL` | 1623 | populada | cadastro pessoal amplo | operacional / cadastro | parcial | melhorar equivalente existente | cadastro humano incompleto | não parece seed de nascimento |
| `PREST_ESP` | 27 | populada | ponte prestador x especialidade | seed estrutural | parcial | regular | especialidade sem vínculo | contrato por prestador |
| `_TIPO_USUARIO` | 10 | populada | tipos de usuário do sistema | lookup | sim | regular | combos vazios / tipos sem base | contém `255 Clínica` |
| `USUARIO_PERFIL` | 184 | populada | vínculo usuário/perfil/prestador | seed estrutural | parcial | melhorar equivalente existente | acesso sem perfil funcional | matriz de acesso base |
| `USUARIO_MODULO` | 312 | populada | vínculo usuário x módulo | seed estrutural | parcial | melhorar equivalente existente | menu bloqueado ou vazio | complementa perfis |
| `USUARIO_FUNCAO` | 740 | populada | vínculo usuário x função | seed estrutural | parcial | melhorar equivalente existente | granularidade de permissão perdida | admin-like 1 cobre tudo |
| `UNIDADE` | 1 | populada | unidade/filial base | seed estrutural | sim (`UnidadeAtendimento`) | manter Brana atual | nova conta sem unidade base | unidade única protegida |
| `SISTEMA` | 1 | populada | configuração global/instalação | configuração | parcial | regular | ausência de identidade global | Brana não tem literal claro |
| `SIS_PERFIL` | 10 | populada | perfis funcionais de acesso | seed estrutural | parcial | melhorar equivalente existente | menus/perfis quebrados | não há perfil “Administrador” |
| `SIS_MODULO` | 52 | populada | módulos funcionais | seed estrutural | parcial | melhorar equivalente existente | módulo sem seed | `PERMITE_SENHA` relevante |
| `SIS_FUNCAO` | 127 | populada | funções por módulo | seed estrutural | parcial | melhorar equivalente existente | função sem regra | ligada a `SIS_MODULO` |
| `LOGON` | 0 | vazia | sessão/licença/logon | log / operacional | não localizado | não incluir | sem efeito de nascimento | tabela vazia no virgem |

### 6.2 Clínica, agenda, relatórios, interface, procedimentos e odontologia

| Tabela EasyDental | Registros | Estado | Função provável | Tipo | Equiv. Brana | Decisão | Risco se faltar | Observação |
| --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| `CONFIG_REPORT` | 140 | populada | preferências de relatório por usuário | configuração | parcial | regular | relatório sem padrão por usuário | seed de interface/relatório |
| `CUSTOMPAGE` | 14 | populada | páginas/formulários customizados | seed estrutural | parcial | regular | formulário clínico quebrado | seed de UI clínica |
| `CUSTOMCONTROL` | 297 | populada | controles/layout de formulário | seed estrutural | parcial | regular | formulário sem controles | seed de UI |
| `CUSTOMDATA` | 35 | populada | dados customizados de interface | operacional / configuração | não localizado | pendente | perda de comportamento customizado | provável legado específico |
| `CUSTOMMEMO` | 1 | populada | memo customizado | operacional / configuração | não localizado | pendente | perda de conteúdo customizado | muito específico |
| `AVISO` | 4 | populada | avisos internos | operacional | parcial | não incluir | aviso transiente sem valor de seed | não parece seed de nascimento |
| `AGENDA` | 13806 | populada | agenda/compromissos | transacional | parcial | não incluir | agenda histórica como seed | nasce vazia ou mínima no SaaS |
| `AGENDA_BLOQUEIO` | 0 | vazia | bloqueio de agenda | operacional | parcial | não incluir | regra de bloqueio sem necessidade de seed | vazio no virgem |
| `CALENDARIO_FAT` | 0 | vazia | calendário financeiro | operacional | não localizado | não incluir | sem impacto de nascimento | vazio no virgem |
| `CATALOGO` | 292 | populada | catálogo geral de itens | lookup / configuração | parcial | regular | catálogo incompleto | precisa validação de equivalência |
| `CCCIRURGIAO` | 15381 | populada | histórico clínico do cirurgião | transacional | parcial | não incluir | dado clínico histórico como seed | não deve nascer como seed |
| `CCPACIENTE` | 16328 | populada | dados do paciente por contexto clínico | transacional | parcial | não incluir | paciente histórico como seed | operacional/transacional |
| `CID_ITEM` | 14486 | populada | catálogo de CID | seed estrutural | sim (`DoencaCid` / `cid_routes`) | melhorar equivalente existente | CID sem base | deve existir como catálogo |
| `COMPROMISSO` | 3 | populada | compromisso geral | operacional | não localizado | não incluir | rotina operacional sem seed | não é base de nova conta |
| `_COMPROMISSO` | 3 | populada | lookup de compromisso | lookup | não localizado | pendente | sem clareza de uso no SaaS | revisar se é realmente necessário |
| `CONVENIO` | 10 | populada | convênios | seed estrutural | sim (`convenio_odonto`) | melhorar equivalente existente | convênio sem base | já existe no Brana em outro modelo |
| `CONTATO` | 107 | populada | contatos | operacional / cadastro | parcial | regular | contato sem base de cadastro | útil, mas não seed obrigatório |
| `COTACAO` | 1 | populada | cotação | operacional/comercial | não localizado | não incluir | dado comercial indevido | não seedar |
| `CREDENCIAMENTO` | 0 | vazia | credenciamento | operacional/comercial | não localizado | não incluir | fluxo comercial sem seed | vazio no virgem |
| `CTRLPROTETICO` | 1559 | populada | controle protético | operacional clínico | não localizado | pendente | módulo específico sem mapeamento | potencial legado |
| `CUSTO_FIXO_ITEM` | 1 | populada | custo fixo | financeiro/comercial | parcial | não incluir | preço/custo indevido | tratar como dado comercial |
| `DEL_AGENDA` | 8475 | populada | agenda deletada/arquivo | log / histórico | não localizado | não incluir | lixo histórico como seed | claro candidato a exclusão do contrato |
| `DENTE` | 22892 | populada | elemento odontográfico | transacional/odontograma | parcial | não incluir | seed de atendimento histórico | estrutura runtime, não seed |
| `ESTOQUE_LOCAL` | 4 | populada | locais de estoque | operacional | parcial | regular | estoque sem base estrutural | pode existir como módulo |
| `ESTOQUE_MOV` | 0 | vazia | movimento de estoque | transacional | parcial | não incluir | movimento histórico como seed | vazio no virgem |
| `EXAMEPERIO` | 8 | populada | exame periodontal | transacional | não localizado | não incluir | exame histórico como seed | pode ter modelo próprio |
| `FACE` | 2827 | populada | faces por intervenção | transacional/odontograma | não localizado | não incluir | dados clínicos de uso como seed | runtime odontológico |
| `HISTORICO` | 38413 | populada | histórico clínico/operacional | log / histórico | parcial | não incluir | histórico como seed | fortemente transacional |
| `INTERVENCAO` | 16386 | populada | intervenção/procedimento clínico | transacional | parcial | melhorar equivalente existente | seed de atendimento indevido | estrutura clínica runtime |
| `ITEMPERIO` | 153 | populada | item periodontal | transacional | não localizado | não incluir | dado clínico de uso | não seedar |
| `PARCELA` | 8693 | populada | parcelas financeiras | transacional | parcial | não incluir | financeiro histórico como seed | nasce vazia |
| `PLACA` | 3 | populada | placa/oclusão | operacional clínico | não localizado | não incluir | dado clínico específico | muito legado/uso |
| `PLANO` | 10 | populada | plano/convenio | seed estrutural | sim (planos/convenios) | melhorar equivalente existente | plano sem base | já há equivalente em Brana |
| `RECIBO` | 964 | populada | recibos | transacional/financeiro | parcial | não incluir | histórico financeiro como seed | nasce vazio |
| `REST_TERAPEUTICA` | 1 | populada | restauração terapêutica | operacional clínico | não localizado | não incluir | item clínico pontual | não seedar |
| `RETORNO` | 145 | populada | retornos | operacional/transacional | parcial | não incluir | retorno histórico como seed | pode existir como fluxo |
| `SLIDE_SHOW` | 0 | vazia | apresentação/slide interno | operacional | não localizado | não incluir | sem utilidade para nascimento | vazio no virgem |
| `SLIDE_SHOW_ITEM` | 0 | vazia | itens do slide show | operacional | não localizado | não incluir | sem utilidade para nascimento | vazio no virgem |
| `SIS_RPT` | 3 | populada | relatórios internos | configuração / relatório | parcial | regular | relatórios sem base | complementar a `CONFIG_REPORT` |
| `TRATAMENTO` | 3837 | populada | tratamento clínico | transacional | parcial | não incluir | tratamento histórico como seed | fluxo runtime |
| `TRATAMENTO_COMISSAO` | 17 | populada | comissão de tratamento | transacional/comercial | não localizado | não incluir | comissões seedadas indevidamente | dado operacional |
| `TAB_PRC` | 4 | populada | tabela privada/tabela de preço | seed estrutural | sim (`procedimento_tabela`) | incluir no contrato | sem tabela privada de nova conta | aqui entra a regra Brana |
| `TAB_PRC_ITEM` | 698 | populada | itens da tabela privada | seed estrutural | sim (`procedimento`) | incluir no contrato | sem catálogo de procedimentos | procedimento base |
| `TAB_PRT_ITEM` | 248 | populada | itens protético/relacionados | operacional/estrutura | não localizado | pendente | depende do módulo protético | avaliar antes de incluir |
| `TAB_REPASSE` | 2 | populada | repasse | seed estrutural/comercial | parcial | pendente | repasse sem regra | cuidado com valores |
| `ANAMNESE_QUEST` | 5 | populada | questionários de anamnese | seed estrutural | sim (`anamnese_questionario`) | incluir no contrato | anamnese inicial ausente | deve nascer preenchido |
| `ANAMNESE_PERG` | 130 | populada | perguntas de anamnese | seed estrutural | sim (`anamnese_pergunta`) | incluir no contrato | anamnese sem perguntas | deve nascer preenchido |
| `ANAMNESE_RESP` | 15429 | populada | respostas de anamnese | transacional | parcial | não incluir | respostas históricas como seed | não seedar |
| `ARCADA` | 121266 | populada | arcadas/odontograma | transacional/odontograma | parcial | não incluir | odontograma histórico como seed | runtime odontológico |
| `DEF_GRUPO` | 164 | populada | grupos default | lookup/configuração | não localizado | regular | defaults ausentes | revisar se Brana já cobre |
| `DEF_ITEM` | 67 | populada | itens default | lookup/configuração | não localizado | regular | defaults ausentes | revisar se Brana já cobre |

### 6.3 Tabelas auxiliares, lookups e seeds estruturais de apoio

| Tabela EasyDental | Registros | Estado | Função provável | Tipo | Equiv. Brana | Decisão | Risco se faltar | Observação |
| --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| `_BAIRRO` | 359 | populada | bairros | lookup | não localizado | regular | endereço sem base normalizada | pode ser free-text no Brana |
| `_BANCO` | 141 | populada | bancos | lookup | não localizado | regular | financeiro sem base de escolha | provável lookup opcional |
| `_CIDADE` | 14 | populada | cidades | lookup | parcial | regular | endereço com normalização fraca | já há uso por texto no Brana |
| `_COMPROMISSO` | 3 | populada | compromissos | lookup | não localizado | pendente | pouca clareza de uso | revisar com cautela |
| `_ESPECIALIDADE` | 14 | populada | especialidades | seed estrutural | sim (especialidades) | incluir no contrato | especialidade sem base | alta prioridade |
| `_ESTADO_CIVIL` | 8 | populada | estado civil | lookup | não localizado | regular | cadastro pessoal incompleto | normalização opcional |
| `_FABRICANTE` | 119 | populada | fabricantes | lookup / cadastro | parcial | regular | material sem fabricante | vincula materiais |
| `_FASE_PROCEDIMENTO` | 7 | populada | fases de procedimento | seed estrutural | sim | incluir no contrato | fluxo clínico sem fase | alta prioridade |
| `_GRUPO_CONTA` | 36 | populada | grupos de contas | lookup/financeiro | não localizado | pendente | contabilidade sem base | avaliar só se necessário |
| `_INDICE` | 4 | populada | índices | lookup/configuração | parcial | regular | parâmetros de cálculo sem base | presente no fluxo de procedimentos |
| `_MODELO_ETIQUETA` | 9 | populada | modelo de etiqueta | configuração | não localizado | pendente | etiquetas sem padrão | provável UI/relatório |
| `_MOTIVO_ATESTADO` | 4 | populada | motivo de atestado | lookup | não localizado | regular | atestado sem motivo base | pode ser opcional |
| `_MOTIVO_RETORNO` | 2 | populada | motivo de retorno | lookup | não localizado | regular | retorno sem motivo base | opcional |
| `_PADRAO_ETIQUETA` | 8 | populada | padrão de etiqueta | configuração | não localizado | pendente | etiqueta sem padrão | UI/relatório |
| `_PALAVRA_CHAVE` | 4 | populada | palavras-chave | lookup | não localizado | pendente | pesquisa/etiquetas sem base | sem equivalência clara |
| `_PLANO_CONTA` | 85 | populada | plano de contas | lookup/financeiro | parcial | regular | financeiro sem classificação | relevante se financeiro nascer |
| `_PREFIXO_PESSOA` | 4 | populada | prefixos de pessoa | lookup | não localizado | pendente | cadastro sem normalização | baixo impacto |
| `_SIMBOLO_ANOMALIA` | 18 | populada | símbolos/anomalias | seed estrutural | sim | incluir no contrato | anomalia sem catálogo | alta prioridade |
| `_SIMBOLO_ODONTO` | 81 | populada | símbolos odontológicos | seed estrutural | sim | incluir no contrato | odontograma sem símbolos | alta prioridade |
| `_STATUS_AGENDA` | 15 | populada | status de agenda | lookup | parcial | regular | agenda sem status | útil se agenda for seedada |
| `_STATUS_CCCIR` | 2 | populada | status cirúrgico | lookup | parcial | regular | cirurgia sem status | específico |
| `_STATUS_INTERV` | 3 | populada | status de intervenção | seed estrutural | sim | incluir no contrato | intervenção sem status | alta prioridade |
| `_STATUS_PACIENTE` | 4 | populada | status do paciente | lookup | parcial | regular | paciente sem status | deve existir se fluxo usar |
| `_STATUS_PT` | 3 | populada | status protético/terapêutico | lookup | parcial | regular | fluxo sem status | específico |
| `_TIPO_APRESENTACAO` | 6 | populada | tipo de apresentação | lookup | não localizado | regular | UI/fluxo sem base | opcional |
| `_TIPO_COBRANCA` | 1 | populada | tipo de cobrança | lookup/financeiro | parcial | regular | cobrança sem base | pequeno mas estrutural |
| `_TIPO_CONTATO` | 5 | populada | tipo de contato | lookup | parcial | regular | contato sem normalização | útil em cadastros |
| `_TIPO_INDICA` | 9 | populada | tipo de indicação | lookup | não localizado | regular | origem/indicação sem base | opcional |
| `_TIPO_LOGRADOURO` | 124 | populada | tipo de logradouro | lookup | parcial | regular | endereço sem normalização | padrão de cadastro |
| `_TIPO_MAT` | 4 | populada | tipo de material | lookup | sim | regular | material sem classificação | vincula catálogo |
| `_TIPO_PAGTO` | 13 | populada | tipo de pagamento | lookup/financeiro | parcial | regular | financeiro sem base | importante se financeiro nascer |
| `_TIPO_PREST` | 5 | populada | tipo de prestador | lookup | sim | regular | prestador sem classificação | importante |
| `_TIPO_USO` | 7 | populada | tipo de uso | lookup | não localizado | regular | especificação sem base | opcional |
| `_TIPO_USUARIO` | 10 | populada | tipos de usuário | lookup | sim | regular | usuário sem tipagem | já acima, reforço estrutural |
| `_TISS_CBOS` | 10 | populada | CBOS/TISS | lookup | parcial | pendente | integração TISS sem base | só se TISS for contrato |
| `_TISS_REGIAO_PROCEDIMENTO` | 56 | populada | região de procedimento TISS | lookup | parcial | pendente | TISS sem região | específico |
| `_TISS_TIPO_ATENDIMENTO` | 5 | populada | tipo de atendimento TISS | lookup | parcial | pendente | TISS sem base | específico |
| `_TISS_TIPO_FATURAMENTO` | 2 | populada | tipo de faturamento TISS | lookup | parcial | pendente | faturamento sem base | específico |
| `_TISS_TIPO_TABELA` | 21 | populada | tipo de tabela TISS | lookup | sim/parcial | regular | integração TISS inconsistente | já aparece em Brana via TissTipoTabela |
| `_UNID_MEDIDA` | 23 | populada | unidades de medida | lookup | parcial | regular | material sem unidade | importante em materiais |

### 6.4 Tabelas operacionais, logs, históricos e famílias temporárias

| Tabela EasyDental | Registros | Estado | Função provável | Tipo | Equiv. Brana | Decisão | Risco se faltar | Observação |
| --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| `USRLOG` | 166051 | populada | log de uso/sessão | log / histórico | não localizado | não incluir | log como seed gera ruído | claramente operacional |
| `LOG_DOCUMENTO` | 1190 | populada | log de documentos | log | não localizado | não incluir | histórico de auditoria como seed | não seedar |
| `LOGON` | 0 | vazia | sessão/logon | log | não localizado | não incluir | vazio no virgem | já tratado acima como vazia |
| `DEL_AGENDA` | 8475 | populada | agenda removida | log / histórico | não localizado | não incluir | exclusões históricas como seed | operacional |
| `TMP_ABC` | 40 | populada | temporária de apoio | temporária | não localizado | não incluir | tabela de trabalho como seed | legado técnico |
| `TMP_CONTAS` | 0 | vazia | temporária de apoio | temporária | não localizado | não incluir | tabela de trabalho como seed | legado técnico |
| `TMP_ESTOQUE` | 10 | populada | temporária de apoio | temporária | não localizado | não incluir | tabela de trabalho como seed | legado técnico |
| `TMP_LUCRATIVIDADEPORINTERVENCAO_INSPIRON_20231129144357` | 19 | populada | derivação de análise | temporária | não localizado | não incluir | artefato de trabalho como seed | família temporária |
| `TMP_LUCRATIVIDADEPORINTERVENCAO_INSPIRON_20231129162012` | 22 | populada | derivação de análise | temporária | não localizado | não incluir | artefato de trabalho como seed | família temporária |
| `TMP_MALADIRETA` | 0 | vazia | mala direta temporária | temporária | não localizado | não incluir | artefato de trabalho | sem valor de nascimento |
| `TMP_PARTICIPACAO` | 1 | populada | participação temporária | temporária | não localizado | não incluir | artefato de trabalho | não seedar |
| `TMP_USRLOG_DELL_SERVIDOR_20220413094717` | 90 | populada | extração temporal de log | temporária | não localizado | não incluir | artefato de trabalho como seed | família temporária |
| `TMP_USRLOG_DELL_SERVIDOR_20220418132154` | 14 | populada | extração temporal de log | temporária | não localizado | não incluir | artefato de trabalho como seed | família temporária |
| `TMP_USRLOG_DELL_SERVIDOR_20221110112249` | 88 | populada | extração temporal de log | temporária | não localizado | não incluir | artefato de trabalho como seed | família temporária |
| `TMP_USRLOG_DELL_SERVIDOR_20221111071246` | 53 | populada | extração temporal de log | temporária | não localizado | não incluir | artefato de trabalho como seed | família temporária |
| `TMP_USRLOG_DELL_SERVIDOR_20221117080413` | 11 | populada | extração temporal de log | temporária | não localizado | não incluir | artefato de trabalho como seed | família temporária |
| `TMP_USRLOG_DELL_SERVIDOR_20221117170948` | 74 | populada | extração temporal de log | temporária | não localizado | não incluir | artefato de trabalho como seed | família temporária |
| `TMP_USRLOG_DELL_SERVIDOR_20221124111336` | 33 | populada | extração temporal de log | temporária | não localizado | não incluir | artefato de trabalho como seed | família temporária |
| `TMP_USRLOG_DELL_SERVIDOR_20231123133224` | 123 | populada | extração temporal de log | temporária | não localizado | não incluir | artefato de trabalho como seed | família temporária |
| `TMP_USRLOG_INSPIRON_1525_20211011120634` | 92 | populada | extração temporal de log | temporária | não localizado | não incluir | artefato de trabalho como seed | família temporária |
| `TMP_USRLOG_INSPIRON_20220315180154` | 183 | populada | extração temporal de log | temporária | não localizado | não incluir | artefato de trabalho como seed | família temporária |
| `TMP_USRLOG_INSPIRON_20220413090026` | 84 | populada | extração temporal de log | temporária | não localizado | não incluir | artefato de trabalho como seed | família temporária |
| `TMP_USRLOG_INSPIRON_20220419095840` | 65 | populada | extração temporal de log | temporária | não localizado | não incluir | artefato de trabalho como seed | família temporária |
| `TMP_USRLOG_INSPIRON_20221110093615` | 2583 | populada | extração temporal de log | temporária | não localizado | não incluir | artefato de trabalho como seed | família temporária |

## 7. Resumo por decisão

### 7.1 Manter Brana atual
- `USUARIO`
- `PRESTADOR`
- `UNIDADE`
- `CONVENIO`
- `PLANO`

### 7.2 Regular no contrato
- `SISTEMA`
- `SIS_PERFIL`
- `SIS_MODULO`
- `SIS_FUNCAO`
- `USUARIO_PERFIL`
- `USUARIO_MODULO`
- `USUARIO_FUNCAO`
- `CONFIG_REPORT`
- `CUSTOMPAGE`
- `CUSTOMCONTROL`
- `CONTATO`
- `SIS_RPT`
- `TAB_REPASSE`
- `TISS_*`
- `TIPO_*`
- `STATUS_*`
- `UNID_MEDIDA`

### 7.3 Incluir no contrato de novas contas
- `TAB_PRC`
- `TAB_PRC_ITEM`
- `TAB_GEN_ITEM`
- `TAB_GEN_ITEM_FASE`
- `TAB_GEN_ITEM_MAT`
- `TAB_MAT`
- `TAB_MAT_ITEM`
- `ANAMNESE_QUEST`
- `ANAMNESE_PERG`
- `_ESPECIALIDADE`
- `_FASE_PROCEDIMENTO`
- `_STATUS_INTERV`
- `_SIMBOLO_ODONTO`
- `_SIMBOLO_ANOMALIA`
- `USUARIO` admin inicial
- `PRESTADOR` sistêmico/reservado
- `UNIDADE` inicial
- `tabela Brana` para novas contas

### 7.4 Melhorar equivalente existente
- `SIS_*`
- `USUARIO_*`
- `CID_ITEM`
- `TAB_PRC*`
- `TAB_GEN_*`
- `TAB_MAT*`
- `CONVENIO`
- `PLANO`
- `ANAMNESE_*`
- `CONFIG_REPORT`
- `CUSTOMPAGE`
- `CUSTOMCONTROL`

### 7.5 Não incluir
- `USRLOG`
- `LOGON`
- `HISTORICO`
- `INTERVENCAO`
- `DENTE`
- `ARCADA`
- `FACE`
- `CCPACIENTE`
- `CCCIRURGIAO`
- `AGENDA`
- `AGENDA_BLOQUEIO`
- `CALENDARIO_FAT`
- `DEL_AGENDA`
- `ESTOQUE_MOV`
- `EXAMEPERIO`
- `ITEMPERIO`
- `PARCELA`
- `RECIBO`
- `RETORNO`
- `SLIDE_SHOW`
- `SLIDE_SHOW_ITEM`
- `TMP_*`

### 7.6 Pendente
- `Mestre` literal como papel de sistema
- `_COMPROMISSO`
- `CATALOGO`
- `CTRLPROTETICO`
- `CREDENCIAMENTO`
- `COTACAO`
- `CUSTO_FIXO_ITEM`
- `PLACA`
- `REST_TERAPEUTICA`
- `CUSTOMDATA`
- `CUSTOMMEMO`

## 8. Tabelas de alta prioridade para nova conta
- `USUARIO`
- `PRESTADOR`
- `PESSOAL`
- `PREST_ESP`
- `_TIPO_USUARIO`
- `USUARIO_PERFIL`
- `USUARIO_MODULO`
- `USUARIO_FUNCAO`
- `UNIDADE`
- `SISTEMA`
- `SIS_PERFIL`
- `SIS_MODULO`
- `SIS_FUNCAO`
- `CID_ITEM`
- `TAB_PRC`
- `TAB_PRC_ITEM`
- `TAB_GEN_ITEM`
- `TAB_GEN_ITEM_FASE`
- `TAB_GEN_ITEM_MAT`
- `TAB_MAT`
- `TAB_MAT_ITEM`
- `TAB_REPASSE`
- `_ESPECIALIDADE`
- `_FASE_PROCEDIMENTO`
- `_STATUS_INTERV`
- `_SIMBOLO_ODONTO`
- `_SIMBOLO_ANOMALIA`
- `ANAMNESE_QUEST`
- `ANAMNESE_PERG`
- `CUSTOMPAGE`
- `CUSTOMCONTROL`

## 9. Tabelas que provavelmente não devem nascer como seed
- `USRLOG`
- `LOGON`
- `HISTORICO`
- `INTERVENCAO`
- `DENTE`
- `ARCADA`
- `FACE`
- `CCPACIENTE`
- `CCCIRURGIAO`
- `AGENDA`
- `ANAMNESE_RESP`
- `DEL_AGENDA`
- `ESTOQUE_MOV`
- `EXAMEPERIO`
- `ITEMPERIO`
- `PARCELA`
- `RECIBO`
- `RETORNO`
- `SLIDE_SHOW`
- `SLIDE_SHOW_ITEM`
- `TMP_*`

## 10. Contrato atualizado — decisão preliminar para novas contas
- O que definitivamente deve nascer: `USUARIO`, `PRESTADOR` sistêmico, `UNIDADE`, perfis base, matriz de permissões, tabela Brana, catálogo clínico base, CID, especialidades, fases/status, símbolos, anamnese base e configuração mínima de conta.
- O que deve nascer se confirmado por contrato técnico: `SISTEMA`, configuração global persistida, materiais estruturais, repasses estruturais, lookup seeds específicos e eventuais equivalentes de interface/relatório.
- O que não deve nascer como seed: logs, históricos, movimentos financeiros, agendamentos históricos, respostas de anamnese, intervenções já realizadas e quaisquer artefatos temporários.
- O que deve ser protegido: usuário admin inicial, prestador sistêmico/reservado, unidade inicial única, tabela privada padrão, perfis base e registros estruturais do sistema.
- O que deve ser melhorado no Brana: a definição de equivalência para `SISTEMA`, `SIS_*`, `USUARIO_*`, `TAB_PRC*`, `TAB_GEN_*`, `TAB_MAT*`, `CONFIG_REPORT`, `CUSTOMPAGE` e `CUSTOMCONTROL`.
- O que ainda está pendente: o mapeamento literal de `Mestre`, a decisão final sobre preço da tabela Brana, a política de materiais/repasses e a política final da tela de setup.

## 11. Relatório do fluxo de nascimento revisado

| Etapa | Entidade / regra | Nome esperado | Tabela/modelo Brana | Referência EasyDental | Decisão | Protegido? | Editável? | Observação |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Clínica/tenant | Conta SaaS | nome da clínica/tenant | `Clinica` | `UNIDADE` / `SISTEMA` | deve nascer | sim | parcial | base da conta |
| Usuário admin inicial | admin/owner | usuário inicial | `Usuario` | `USUARIO 1` (inferido) | deve nascer | sim | parcial | acesso amplo |
| Eventual usuário sistêmico | papel estrutural | `Clínica` | `Usuario` reservado | `USUARIO 255` | deve nascer | sim | parcial | papel base protegido |
| Prestador sistêmico/reservado | prestador base | `Clínica` | `PrestadorOdonto` | `PRESTADOR 255` | deve nascer | sim | parcial | não excluir |
| Unidade inicial | unidade/filial | unidade inicial | `UnidadeAtendimento` | `UNIDADE 1` | deve nascer | sim | parcial | se contrato aprovar |
| Perfis base | perfis funcionais | perfis base | `AccessProfile` | `SIS_PERFIL` | deve nascer | sim | sim | sem menu vazio |
| Permissões admin | cobertura ampla | acesso completo inicial | `permissoes_json` / vínculos | `USUARIO_*` | deve nascer | sim | parcial | admin não bloqueado |
| Tabela privada | tabela de preço | Brana | `ProcedimentoTabela` | `TAB_PRC` / `TAB_PRC_ITEM` | deve nascer | sim | sim | só novas contas |
| CID | catálogo clínico | CID | `DoencaCid` | `CID_ITEM` | deve nascer | sim | sim | base clínica |
| Tabela genérica | procedimentos genéricos | procedimentos genéricos | `ProcedimentoGenerico` | `TAB_GEN_ITEM` | deve nascer | sim | sim | seed estrutural |
| Procedimentos canônicos | procedimentos base | procedimentos canônicos | `Procedimento` | `TAB_PRC_ITEM` | deve nascer | sim | sim | seed estrutural |
| Especialidades | taxonomia clínica | especialidades | `ItemAuxiliar`/equivalente | `_ESPECIALIDADE` | deve nascer | sim | sim | base clínica |
| Fases/status | fluxo clínico | fases/status | catálogo auxiliar | `_FASE_PROCEDIMENTO` / `_STATUS_INTERV` | deve nascer | sim | sim | processo clínico |
| Símbolos | odontograma | símbolos odontológicos | catálogo de símbolos | `_SIMBOLO_*` | deve nascer | sim | sim | odontologia |
| Anamnese | questionários e perguntas | anamnese base | modelos de anamnese | `ANAMNESE_QUEST` / `ANAMNESE_PERG` | deve nascer | sim | sim | precisa vir preenchido |
| Materiais | catálogo material | materiais | `Material` / `lista_material` | `TAB_MAT` / `TAB_MAT_ITEM` | pendente | sim | sim | evitar preço indevido |
| Repasses | regra de repasse | repasses | regra de repasse | `TAB_REPASSE` | pendente | sim | sim | tratar com cautela |
| Assinatura digital | recurso próprio Brana | assinatura digital | recursos próprios | inexistente no EasyDental | deve permanecer | sim | sim | não bloquear |
| Setup | setup inicial | setup opcional/reduzido | fluxo de setup | não é seed do EasyDental | não deve criar estrutura mínima | não | não | candidata a dispensa futura |

## 12. Lacunas a resolver antes de implementação
- `Mestre` deve virar usuário sistêmico ou admin inicial no Brana?
- `Clínica` deve virar prestador sistêmico, unidade ou outro papel?
- O prestador sistêmico aparece na interface?
- O admin inicial pode alterar o prestador sistêmico?
- A unidade inicial será obrigatória?
- A tabela Brana nasce com preço zero, sem preço ou preço padrão?
- Quais tabelas de odontograma são só estrutura e quais são transacionais?
- Quais tabelas de anamnese devem nascer preenchidas?
- Quais tabelas financeiras/agenda devem nascer vazias?
- Quais tabelas devem ser globais e quais por clínica?

## 13. Próxima subetapa recomendada
`EasyDental virgem — Subetapa 8B — fechamento final do contrato de usuários/prestadores e matriz de seeds para novas contas, sem implementação`

## 14. Justificativa da próxima subetapa
- A Subetapa 8A fecha o mapa de decisão e a leitura estrutural dos papéis centrais.
- A Subetapa 8B pode então consolidar baseline documental e, se necessário, preparar um teste manual de criação de conta atual sem alterar código.
- A prioridade continua sendo fechar contrato antes de qualquer implementação.

## 15. Plano de verificação
- Somente o documento novo e o roadmap foram alterados.
- Nenhum código foi alterado.
- `frontend/app.js` não foi alterado.
- `frontend/index.html` não foi alterado.
- `frontend/js/modules` não foi alterado.
- `backend` não foi alterado.
- `banco/schema/migrations/seeds/endpoints` não foram alterados.
- Nenhum arquivo do EasyDental foi alterado.
- Nenhum script SQL foi executado.
- Nenhuma query de escrita foi executada.
- Nenhuma conta foi criada.
- Nenhuma conta existente foi alterada.
- A tela de setup não foi alterada.
- Nenhum dado sensível foi exposto.
- A blindagem textual/mojibake foi respeitada.
