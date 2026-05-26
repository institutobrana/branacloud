# Auditoria EasyDental virgem — Subetapa 4 — clínica, unidade e configuração inicial

## 1. Contexto

- Referencia as Subetapas 0, 1, 2 e 3 da frente documental `Auditoria comparativa EasyDental virgem x Brana Cloud — usuários, prestadores, permissões e seeds iniciais`.
- A base analisada aqui continua sendo tratada como referencia da forma virgem do sistema, conforme definido pelo usuário.
- Mesmo com muitas tabelas populadas e muitos registros, isso pode representar seeds estruturais do proprio EasyDental.
- A divergencia documental entre o DSN externo `SONYVAIO\EDS70` e a leitura local em `INSPIRON-15\SQLEXPRESS` ja foi registrada nas subetapas anteriores.
- Esta etapa e somente leitura.

## 2. Segurança e limites

- Nenhuma query de escrita foi executada.
- Nenhum script `.sql` foi executado.
- Nao houve alteracao no EasyDental.
- Nao houve alteracao no Brana Cloud.
- Nenhum dado sensivel foi exposto.
- A blindagem textual/mojibake foi respeitada.
- As amostras foram mascaradas ou omitidas quando havia risco de identificar dados reais de clinica, usuario, documento ou licenca.

## 3. Tabelas analisadas

- `UNIDADE`
- `SISTEMA`
- `CONFIG_REPORT`
- `CUSTOMCONTROL`
- `CUSTOMPAGE`
- `AVISO`
- `_BANCO`
- `_CIDADE`
- `_ESTADO_CIVIL`
- `_TIPO_LOGRADOURO`
- `_TIPO_CONTATO`
- `_TIPO_APRESENTACAO`
- `_TIPO_INDICA`
- `USUARIO`
- `PRESTADOR`
- `USUARIO_PERFIL`
- `USUARIO_MODULO`
- `USUARIO_FUNCAO`

## 4. Existencia das tabelas candidatas

| tabela candidata | existe | observação |
| --- | --- | --- |
| `UNIDADE` | sim | tabela central de cadastro de unidade |
| `SISTEMA` | sim | registro unico de configuracao/identidade do sistema |
| `CONFIG_REPORT` | sim | configuracao de relatorios por usuario |
| `CUSTOMCONTROL` | sim | controles customizados de interface |
| `CUSTOMPAGE` | sim | paginas/formularios customizados |
| `AVISO` | sim | registros de aviso/agenda operacional |
| `_BANCO` | sim | lookup seed de bancos |
| `_CIDADE` | sim | lookup seed de cidades |
| `_ESTADO` | nao | nao encontrada no banco analisado |
| `_ESTADO_CIVIL` | sim | lookup seed de estado civil |
| `_TIPO_LOGRADOURO` | sim | lookup seed de tipo de logradouro |
| `_TIPO_CONTATO` | sim | lookup seed de tipo de contato |
| `_TIPO_APRESENTACAO` | sim | lookup seed de apresentacao/unidade de medida |
| `_TIPO_INDICA` | sim | lookup seed de origem/indicacao |
| `USUARIO` | sim | tabela central de acesso |
| `PRESTADOR` | sim | cadastro de prestador/profissional |
| `USUARIO_PERFIL` | sim | matriz de perfil por usuario/prestador |
| `USUARIO_MODULO` | sim | matriz de modulo por usuario |
| `USUARIO_FUNCAO` | sim | matriz de funcao por usuario |

## 5. Contagens

| tabela | quantidade de registros | status | observação preliminar |
| --- | ---: | --- | --- |
| `UNIDADE` | 1 | populada | unidade unica; forte indicio de unidade inicial estrutural |
| `SISTEMA` | 1 | populada | registro unico de identidade/configuracao/licenca do sistema |
| `CONFIG_REPORT` | 140 | populada | configuracoes de relatorios por usuario |
| `CUSTOMCONTROL` | 297 | populada | seeds de interface/controles personalizados |
| `CUSTOMPAGE` | 14 | populada | seeds de paginas/formularios personalizados |
| `AVISO` | 4 | populada | avisos/alertas operacionais com janela de data |
| `_BANCO` | 141 | populada | seed auxiliar de bancos |
| `_CIDADE` | 14 | populada | seed auxiliar de cidades |
| `_ESTADO_CIVIL` | 8 | populada | seed auxiliar de estado civil |
| `_TIPO_LOGRADOURO` | 124 | populada | seed auxiliar de logradouro |
| `_TIPO_CONTATO` | 5 | populada | seed auxiliar de tipo de contato |
| `_TIPO_APRESENTACAO` | 6 | populada | seed auxiliar de apresentacao |
| `_TIPO_INDICA` | 9 | populada | seed auxiliar de indicacao/origem |
| `USUARIO` | 7 | populada | usuarios estruturais e operacionais |
| `PRESTADOR` | 5 | populada | prestadores/profissionais estruturais |
| `USUARIO_PERFIL` | 184 | populada | matriz de perfil por usuario e prestador |
| `USUARIO_MODULO` | 312 | populada | matriz de modulo por usuario |
| `USUARIO_FUNCAO` | 740 | populada | matriz de funcao por usuario |

## 6. Estrutura de `UNIDADE`

- Colunas principais: `ID_UNIDADE`, `COD_UNIDADE`, `NOME`, `RAZAO`, `ID_TIPO_LOGRAD`, `ENDERECO`, `COMPLEM`, `NUMERO`, `BAIRRO`, `CIDADE`, `CEP`, `UF`, `CNPJ`, `INSC_EST`, `INSC_MUN`, `ID_TIPO_FONE1` a `ID_TIPO_FONE4`, `FONE1` a `FONE4`, `CONTATO1` a `CONTATO4`, `EMAIL`, `PREFAGENDA`, `INATIVO`, `QTD_SALA`, `TIME_STAMP_INS`, `USER_STAMP_INS`, `TIME_STAMP_UPD`, `USER_STAMP_UPD`.
- Chave primaria: `PK_UNIDADE` em `ID_UNIDADE`.
- Indices secundarios: nenhum adicional observado alem da PK.
- Foreign keys formais:
  - `USER_STAMP_INS -> USUARIO.NROUSR`
  - `USER_STAMP_UPD -> USUARIO.NROUSR`
- Campos relacionados a clinica/empresa/endereco/documento/configuracao: `COD_UNIDADE`, `NOME`, `RAZAO`, `CNPJ`, `INSC_EST`, `INSC_MUN`, `ENDERECO`, `COMPLEM`, `NUMERO`, `BAIRRO`, `CIDADE`, `CEP`, `UF`, `EMAIL`, `PREFAGENDA`, `QTD_SALA`.
- Amostra mascarada: existe um unico registro de unidade; os valores textuais sensiveis foram mascarados na consulta de apoio.
- Interpretacao cautelosa: sim, a unidade parece um registro estrutural inicial da instalacao.

## 7. Estrutura de `SISTEMA`

- Colunas principais: `IDENTBD`, `VERSAOBD`, `RELEASEBD`, `NOMEBD`, `PREFERENCIAS`, `GRIDX`, `GRIDY`, `FACESPERIO`, `CORRET1`, `CORRET2`, `CORSON1`, `CORSON2`, `CORFUNDO`, `PAUTA`, `CORFUNDOLINHA`, `CORLINHA`, `INDICEPLACA`, `LIC_CHAVE_SESSAO`, `LIC_SERVIDOR`, `LIC_TIME_STAMP`.
- Chave primaria: nenhuma observada.
- Indices secundarios: nenhum observado.
- Foreign keys formais: nenhuma observada.
- Campos relacionados a configuracao global, licenca, instalacao, parametros ou sistema: `IDENTBD`, `VERSAOBD`, `RELEASEBD`, `NOMEBD`, `PREFERENCIAS`, `GRIDX`, `GRIDY`, `FACESPERIO`, `CORRET*`, `CORSON*`, `CORFUNDO`, `PAUTA`, `CORFUNDOLINHA`, `CORLINHA`, `INDICEPLACA`, `LIC_CHAVE_SESSAO`, `LIC_SERVIDOR`, `LIC_TIME_STAMP`.
- Amostra mascarada: `IDENTBD=EDS`, `VERSAOBD=7`, `RELEASEBD=100115`, `NOMEBD=EDS70`; os campos de licenca foram tratados como presentes, com valores omitidos.
- Interpretacao cautelosa: sim, parece um registro estrutural interno do sistema, concentrando identidade da base, versao, parametros visuais e licenca/instalacao.

## 8. Estrutura de `CONFIG_REPORT`, `CUSTOMCONTROL` e `CUSTOMPAGE`

### `CONFIG_REPORT`

- Colunas principais: `ID_USUARIO`, `NOME_REL`, `SEQ`, `NOME_COLUNA`.
- Chave primaria: composta por `ID_USUARIO`, `NOME_REL`, `SEQ`, `NOME_COLUNA` (`PK_CONFIG_REPORT`).
- Indices secundarios: nenhum adicional observado alem da PK.
- Foreign key formal: `ID_USUARIO -> USUARIO.NROUSR`.
- Contagem: 140.
- Indicio de configuracao de relatorios: sim, a tabela registra colunas por relatorio e usuario.
- Seed de interface/relatorio: parece ser mais configuracao/personalizacao do que cadastro livre.
- Registros estruturais que nao devem ser excluidos: provavel, ao menos para manter relatorios e filtros por usuario.
- Amostra segura: relatorios como `frFiltroPaciente`, `rpAgendamento` e `rpContasReceber` aparecem para o usuario `1`.

### `CUSTOMCONTROL`

- Colunas principais: `NROCONTROLE`, `NROFORM`, `NROPAGINA`, `TIPO`, `CAPTION`, `NAOMOSTRAR`, `POSX`, `POSY`, `LARGCAPTION`, `LARGCONTROLE`, `ALTCONTROLE`, `ITENS`.
- Chave primaria: `PK__CUSTOMCONTROL__5070F446` em `NROCONTROLE`.
- Indices secundarios: nenhum adicional observado alem da PK.
- Foreign key formal: `NROFORM, NROPAGINA -> CUSTOMPAGE.NROFORM, CUSTOMPAGE.NROPAGINA`.
- Contagem: 297.
- Indicio de configuracao de tela/controle: sim, os campos de posicao, tamanho, caption e itens apontam para layout de interface.
- Seed de interface: forte indicio.
- Registros estruturais que nao devem ser excluidos: forte indicio.
- Amostra segura: captions como `Dor presente`, `Provocada`, `Frio`, `Calor`, `Dente "crescido"` e `Mucosa dolorida` mostram controles de formulários clinicos.

### `CUSTOMPAGE`

- Colunas principais: `NROFORM`, `NROPAGINA`, `CAPTION`.
- Chave primaria: composta por `NROFORM` e `NROPAGINA` (`PK__CUSTOMPAGE__5165187F`).
- Indices secundarios: nenhum adicional observado alem da PK.
- Contagem: 14.
- Indicio de configuracao de paginas/formularios: sim.
- Seed de interface: forte indicio.
- Registros estruturais que nao devem ser excluidos: forte indicio.
- Amostra segura: captions como `Semiologia`, `Vitalidade`, `Ex. radiográficos`, `Diagnóstico`, `Odontometria`, `T. Conservador`, `Pós-operatório` e `Livre`.

## 9. Estrutura de `AVISO`

- Colunas principais: `NROREGISTRO`, `NRODES`, `NROREM`, `DATAFIX`, `DATAREM`, `TEXTO`.
- Chave primaria: `PK__AVISO__47DBAE45` em `NROREGISTRO`.
- Indices secundarios: nenhum adicional observado alem da PK.
- Foreign keys formais: nenhuma observada.
- Contagem: 4.
- Finalidade aparente: avisos/alertas com janelas de data; pode ter uso operacional, de aviso ou lembrete.
- Registro estrutural ou operacional: parece mais operacional do que seed puro, mas deve ser tratado com cautela.
- Amostra segura: existem 4 registros com intervalos de datas; o texto nao foi reproduzido.

## 10. Estrutura das tabelas auxiliares com prefixo `_`

### `_BANCO`

- Colunas principais: `REGISTRO`, `CODIGO`, `NOME`, `RESERVADO`.
- Chave primaria: `PK__BANCO` em `REGISTRO`.
- Contagem: 141.
- Tipo de dado auxiliar: lookup de bancos.
- Seed estrutural: sim, claramente populada como tabela auxiliar do sistema.

### `_CIDADE`

- Colunas principais: `REGISTRO`, `CODIGO`, `NOME`, `UF`, `RESERVADO`.
- Chave primaria: `PK___CIDADE__6B24EA82` em `REGISTRO`.
- Contagem: 14.
- Tipo de dado auxiliar: lookup de cidades.
- Seed estrutural: sim.

### `_ESTADO_CIVIL`

- Colunas principais: `REGISTRO`, `CODIGO`, `NOME`, `RESERVADO`.
- Chave primaria: `PK___ESTADO_CIVIL__6E01572D` em `REGISTRO`.
- Contagem: 8.
- Tipo de dado auxiliar: lookup de estado civil.
- Seed estrutural: sim.

### `_TIPO_LOGRADOURO`

- Colunas principais: `REGISTRO`, `CODIGO`, `NOME`, `RESERVADO`.
- Chave primaria: `PK__TIPO_LOGRADOURO` em `REGISTRO`.
- Contagem: 124.
- Tipo de dado auxiliar: lookup de tipos de logradouro.
- Seed estrutural: sim.

### `_TIPO_CONTATO`

- Colunas principais: `REGISTRO`, `CODIGO`, `NOME`, `RESERVADO`.
- Chave primaria: `PK___TIPO_CONTATO__00200768` em `REGISTRO`.
- Contagem: 5.
- Tipo de dado auxiliar: lookup de tipo de contato.
- Seed estrutural: sim.

### `_TIPO_APRESENTACAO`

- Colunas principais: `REGISTRO`, `CODIGO`, `NOME`, `RESERVADO`.
- Chave primaria: `PK___TIPO_APRESENTAC__7F2BE32F` em `REGISTRO`.
- Contagem: 6.
- Tipo de dado auxiliar: lookup de apresentacao/unidade de medida.
- Seed estrutural: sim.

### `_TIPO_INDICA`

- Colunas principais: `REGISTRO`, `CODIGO`, `NOME`, `RESERVADO`.
- Chave primaria: `PK___TIPO_INDICA__01142BA1` em `REGISTRO`.
- Contagem: 9.
- Tipo de dado auxiliar: lookup de indicacao/origem/canal.
- Seed estrutural: sim.

## 11. Relação com `USUARIO`, `PRESTADOR` e permissões

- `UNIDADE` se liga formalmente a `USUARIO` pelos campos `USER_STAMP_INS` e `USER_STAMP_UPD`; o usuario ativo tambem referencia `UNIDADE` via `USUARIO.ID_UNIDADE`.
- `PRESTADOR` nao apresentou FK direta para `UNIDADE` nesta analise; o relacionamento parece ser indireto, via usuario e contexto operacional.
- `USUARIO_PERFIL`, `USUARIO_MODULO` e `USUARIO_FUNCAO` nao dependem formalmente de `UNIDADE`; a unidade aparece via `USUARIO`.
- `CONFIG_REPORT` depende formalmente de `USUARIO`, o que sugere configuracao por conta/usuário e possivelmente por contexto de unidade.
- `PRESTADOR` continua ligado ao usuario pela modelagem anterior da frente, mas nesta subetapa nao foi encontrada liga direta com `UNIDADE`.
- Nao houve dado sensivel reproduzido nessa relacao.

## 12. Relacionamentos formais encontrados

- `UNIDADE.USER_STAMP_INS -> USUARIO.NROUSR`
- `UNIDADE.USER_STAMP_UPD -> USUARIO.NROUSR`
- `CONFIG_REPORT.ID_USUARIO -> USUARIO.NROUSR`
- `CUSTOMCONTROL.NROFORM, CUSTOMCONTROL.NROPAGINA -> CUSTOMPAGE.NROFORM, CUSTOMPAGE.NROPAGINA`
- `USUARIO.TIPO -> _TIPO_USUARIO.REGISTRO`
- `USUARIO.ID_PRESTADOR -> PRESTADOR.ID_PRESTADOR`
- `USUARIO.ID_UNIDADE -> UNIDADE.ID_UNIDADE`
- `USUARIO_FUNCAO.ID_USUARIO -> USUARIO.NROUSR`
- `USUARIO_FUNCAO.ID_FUNCAO -> SIS_FUNCAO.ID_FUNCAO`
- `USUARIO_MODULO.ID_USUARIO -> USUARIO.NROUSR`
- `USUARIO_MODULO.ID_MODULO -> SIS_MODULO.ID_MODULO`
- `USUARIO_PERFIL.ID_USUARIO -> USUARIO.NROUSR`
- `USUARIO_PERFIL.ID_PRESTADOR -> PRESTADOR.ID_PRESTADOR`
- `USUARIO_PERFIL.ID_PERFIL -> SIS_PERFIL.ID_PERFIL`

## 13. Relacionamentos inferidos

- `UNIDADE` parece ser a unidade inicial da instalacao, dada a existencia de um unico registro.
- `SISTEMA` parece carregar identidade da base, preferencias e dados de licenca/instalacao, mas sem FK formal.
- `CONFIG_REPORT` parece configurar relatorios por usuario e provavelmente por perfil de uso.
- `CUSTOMCONTROL` e `CUSTOMPAGE` parecem formar a estrutura de layout de telas e formulários do sistema.
- As tabelas `_...` funcionam como seeds/lookup estruturais e nao como transacionais.
- `PRESTADOR` pode participar do contexto de unidade e acesso por meio de `USUARIO`, mas nao foi observada FK direta com `UNIDADE`.

## 14. Registros próprios/estruturais prováveis

- `UNIDADE` com um unico registro inicial.
- `SISTEMA` com um unico registro de identidade/configuracao/instalacao.
- `_BANCO`, `_CIDADE`, `_ESTADO_CIVIL`, `_TIPO_LOGRADOURO`, `_TIPO_CONTATO`, `_TIPO_APRESENTACAO`, `_TIPO_INDICA` como seeds auxiliares.
- `CONFIG_REPORT` como configuracao persistida de relatorios.
- `CUSTOMCONTROL` e `CUSTOMPAGE` como seeds de interface/layout.
- `USUARIO` e `PRESTADOR` como registros estruturais ja tratados nas subetapas anteriores, especialmente o usuario 1 de perfil amplo.
- `AVISO` como tabela pequena de alertas/avisos que deve ser revisada antes de qualquer exclusao.

## 15. Achados importantes

- Existe unidade inicial: sim, a tabela `UNIDADE` tem um unico registro.
- Existe configuracao global: sim, a tabela `SISTEMA` tem um unico registro com identidade, versao, preferencias e licenca.
- Existe clinica/empresa padrao: forte indicio sim, pela presenca de uma unica unidade registrada.
- As tabelas auxiliares principais nascem populadas.
- As configuracoes de relatorio e interface parecem obrigatorias para o funcionamento normal do sistema.
- Existem registros que parecem nao configuraveis pelo usuario final, principalmente `SISTEMA`, `UNIDADE`, `_...`, `CUSTOMPAGE` e `CUSTOMCONTROL`.
- Se o Brana Cloud nascer sem equivalentes, ha risco de tela vazia, identidade de instalacao incompleta, configuracao de relatorios perdida e regras de acesso inconsistente.

## 16. Impacto futuro provavel no Brana Cloud

- Nova conta Brana deve nascer com unidade inicial? Sim, fortemente indicado pela estrutura do EasyDental.
- Usuario/admin inicial deve estar vinculado a uma unidade? Sim, pelo menos via `USUARIO.ID_UNIDADE` e auditoria da unidade.
- Prestador inicial deve estar vinculado a uma unidade? Nao foi observada ligacao direta nesta subetapa, mas o contexto do usuario/prestador continua relevante.
- Seeds auxiliares devem nascer por conta? Sim, ao menos para garantias minimas de cadastro e lookup.
- Seeds globais do sistema devem existir? Sim, especialmente `SISTEMA`, `UNIDADE` e as tabelas `_...`.
- Registros devem ser protegidos contra exclusao? Sim, sobretudo seeds estruturais, layout e configuracao global.
- Configuracoes iniciais devem existir para evitar tela quebrada, menu vazio ou inconsistencias? Sim, principalmente `SISTEMA`, `UNIDADE`, `CONFIG_REPORT`, `CUSTOMPAGE` e `CUSTOMCONTROL`.

## 17. Limitacoes

- A identidade fisica da base ainda nao foi comprovada de forma plena como a pasta externa original.
- Algumas relacoes sao formais e outras apenas inferidas por nomenclatura ou contexto.
- Dados sensiveis foram mascarados ou omitidos.
- A conclusao definitiva sobre o nascimento da conta/clínica no Brana Cloud ainda depende de comparacao posterior com o proprio Brana.
- `_ESTADO` nao existe no banco analisado, portanto nao pode ser usado nesta subetapa.

## 18. Conclusao cautelosa

- O que ja pode ser afirmado:
  - existe uma unidade inicial unica;
  - existe um registro unico de sistema com identidade/versao/instalacao;
  - existem seeds auxiliares populados;
  - existem seeds de interface e relatorio;
  - `UNIDADE` e `USUARIO` se ligam formalmente por auditoria e identidade de unidade.

- O que ainda precisa ser investigado:
  - se a unidade unica e realmente a unidade obrigatoria de nascimento de uma nova conta;
  - se os registros de `SISTEMA` e das tabelas `CUSTOM*` devem ser copiados para o Brana como seeds;
  - se `AVISO` e seed estrutural ou apenas operacional;
  - como a modelagem do Brana deve espelhar essas dependencias sem criar rigidez excessiva.

- Como esta subetapa ajuda a futura regra de nascimento de nova conta/clínica no Brana Cloud:
  - mostra que a instalacao precisa nascer com identidade global, unidade inicial e lookups basicos;
  - indica que relatorios e interface podem depender de seeds de layout;
  - reforca que certos registros devem ser protegidos contra exclusao para evitar instalacao incompleta.

## 19. Próxima subetapa recomendada

- `EasyDental virgem — Subetapa 5 — análise somente leitura de Intervenções/Procedimentos, seeds odontológicos e tabelas clínicas estruturais`

## 20. Plano de testes e verificacao

- Somente o documento novo e o roadmap foram alterados.
- Nenhum codigo foi alterado.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foi alterado.
- `backend` nao foi alterado.
- `banco/schema/migrations/seeds/endpoints` nao foram alterados.
- Nenhum arquivo do EasyDental foi alterado.
- Nenhuma query de escrita foi executada.
- Nenhum script `.sql` foi executado.
- Nenhum dado sensivel foi exposto indevidamente.
- A blindagem textual/mojibake foi respeitada.
