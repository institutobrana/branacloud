# Auditoria EasyDental virgem - Subetapa 8G - fechamento do contrato mestre revisado

## 1. Contexto
- Esta subetapa referencia as Subetapas 0 a 8F da frente "Auditoria comparativa EasyDental virgem x Brana Cloud - fechamento do contrato mestre revisado de novas contas".
- A Subetapa 8E criou o contrato mestre das tabelas e registros que nascerao em novas contas.
- A Subetapa 8F corrigiu a classificacao estrutural do contrato, separando melhor o que ja existe no Brana, o que falta e o que e apenas dado de uso.
- A 8G consolida a versao final revisada antes de qualquer implementacao.
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

## 3. Regra final do contrato mestre revisado
- Nao duplicar o que ja existe no Brana.
- Manter o equivalente Brana quando estiver adequado.
- Melhorar o equivalente Brana quando o EasyDental mostrar estrutura superior.
- Incluir apenas o que falta no Brana e e estrutural.
- Criar estrutura vazia ou equivalente runtime quando a tabela e necessaria, mas os dados sao de uso.
- Seedar apenas catalogos, lookups e configuracoes estruturais.
- Nao seedar dados de pacientes, agenda, financeiro, historico, logs, temporarios, respostas preenchidas ou uso real.
- Preservar assinatura digital e recursos proprios do Brana.
- Preservar modularizacao futura.

## 4. Fechamento por decisao

### A. Ja existe no Brana - manter, nao duplicar
- `CID_ITEM -> doenca_cid`
- `UNIDADE -> unidade_atendimento`
- `USUARIO -> usuarios`
- `PRESTADOR -> prestador_odonto`
- `TAB_PRC -> procedimento_tabela`
- `TAB_PRC_ITEM -> procedimento`
- `TAB_GEN_ITEM -> procedimento_generico`
- `TAB_GEN_ITEM_FASE -> procedimento_generico_fase`
- `TAB_GEN_ITEM_MAT -> procedimento_generico_material`
- `TAB_MAT -> lista_material`
- `TAB_MAT_ITEM -> material`
- `_TISS_TIPO_TABELA -> tiss_tipo_tabela`
- `ANAMNESE_QUEST -> anamnese_questionarios`
- `ANAMNESE_PERG -> anamnese_perguntas`
- `CONFIG_REPORT -> relatorio_config`
- `CONVENIO/PLANO -> convenio_odonto/plano_odonto`
- `TRATAMENTO -> tratamento`
- `SIS_PERFIL -> access_profile`
- catalogo simbolico -> `simbolo_grafico` / `simbolo_grafico_catalogo`

### B. Ja existe no Brana - melhorar equivalente existente
- matriz formal de acesso: `usuario_perfil_acesso` ou equivalente
- permissoes e perfis base
- `relatorio_config` / `CUSTOMPAGE` / `CUSTOMCONTROL`, se houver equivalente parcial
- `SISTEMA` / equivalente global
- materiais / repasses
- `PREST_ESP` / especialidades de prestador
- TISS / lookup de suporte
- ligacoes entre procedimentos, especialidades, simbolos e odontograma
- metadata da tabela Brana / Tabela Exemplo

### C. Falta no Brana - incluir tabela / equivalente futuro
- `CUSTOMPAGE`
- `CUSTOMCONTROL`
- `_TISS_REGIAO_PROCEDIMENTO`
- `_TISS_TIPO_ATENDIMENTO`
- `_TISS_TIPO_FATURAMENTO`
- `_STATUS_INTERV`
- `USUARIO_MODULO`
- `USUARIO_FUNCAO`
- `SIS_MODULO`
- `SIS_FUNCAO`
- `PREST_ESP`
- qualquer outro item que a 8F tenha deixado como equivalente futuro real

### D. Estrutura necessaria - nascer vazia ou equivalente runtime
- `INTERVENCAO`
- `DENTE`
- `ARCADA`
- `FACE`
- `HISTORICO`
- `ANAMNESE_RESP`
- `TRATAMENTO`
- `LANCAMENTO`
- `AGENDA`
- `PARCELA`
- `RECIBO`
- `RETORNO`

### E. Seed estrutural - nascer populada
- unidade `Principal / 0001`
- usuario system / `Clínica` `255`
- admin inicial / `Mestre` funcional `codigo=1`
- prestador sistemico / `Clínica` `255`
- perfis reservados
- matriz formal de acesso, se confirmada
- tabela Brana
- procedimentos canonicos
- procedimentos genericos
- CID, usando equivalente existente, sem duplicar
- especialidades
- fases / status
- simbolos odontologicos
- simbolos / anomalias
- anamnese questionarios / perguntas
- TISS tipo tabela
- lookups auxiliares estruturais
- configuracoes minimas

### F. Fora do nascimento - dados de uso / transacionais / logs / historicos / temporarios
- pacientes
- intervencoes realizadas
- historico clinico real
- agenda de atendimentos
- movimentacoes financeiras
- contas / parcelas / recibos de uso
- logs
- temporarios
- respostas preenchidas
- qualquer dado operacional / transacional de uso real

### G. Pendentes para contrato tecnico especifico
- se `CUSTOMPAGE` e `CUSTOMCONTROL` viram tabelas, equivalentes ou ficam so conceito
- como implementar `_TISS_REGIAO_PROCEDIMENTO` e demais TISS faltantes
- se `_STATUS_INTERV` vira tabela propria, enum ou modelo auxiliar
- como sincronizar `permissoes_json` com a matriz formal
- se `USUARIO_MODULO` / `USUARIO_FUNCAO` serao literais ou equivalentes funcionais
- unidade `Principal / 0001`: implementacao
- metadata Brana / Tabela Exemplo
- materiais / repasses: nascer vazios, zerados ou apenas estrutura
- setup opcional / reduzido

## 5. Tabelao final revisado

| grupo de decisao | modulo | tabela / conceito EasyDental | equivalente Brana | decisao final | escopo | nasce populada? | nasce vazia / equivalente? | nao duplica? | prioridade | proxima subetapa sugerida |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| manter | Clinica | `UNIDADE` / `Principal` | `unidade_atendimento` | manter e regular | por clinica | sim | nao | sim | alta | 8H - unidade Principal 0001 |
| manter | Usuarios | `USUARIO 1` / `Mestre` | `usuarios` | manter e regular | por clinica | sim | nao | sim | alta | 8H - unidade Principal 0001 |
| manter | Prestadores | `PRESTADOR 255` / `Clínica` | `prestador_odonto` | manter e regular | por clinica | sim | nao | sim | alta | 8H - unidade Principal 0001 |
| manter | Permissoes | `USUARIO_PERFIL` | `usuario_perfil_acesso` | manter equivalente e usar como fonte formal | por clinica | sim | nao | sim | alta | 8H - matriz formal |
| melhorar | Permissoes | `USUARIO_MODULO` / `USUARIO_FUNCAO` | `permissoes_json` / access profiles | melhorar equivalente existente ou contrato futuro | por clinica | nao | talvez | sim | media | 8H - matriz formal |
| manter | TISS | `_TISS_TIPO_TABELA` | `tiss_tipo_tabela` | manter e melhorar | global / por clinica | sim | nao | sim | alta | 8H - contrato tecnico TISS faltante |
| incluir | TISS | `_TISS_REGIAO_PROCEDIMENTO` | equivalente nao localizado | incluir equivalente futuro | global / por clinica | nao | sim | nao literal | media | 8H - contrato tecnico TISS faltante |
| incluir | TISS | `_TISS_TIPO_ATENDIMENTO` | `tratamento.tipo_atendimento_tiss_id` / equivalente futuro | incluir equivalente futuro | por clinica | nao | sim | nao literal | media | 8H - contrato tecnico TISS faltante |
| incluir | TISS | `_TISS_TIPO_FATURAMENTO` | `convenio_odonto.tipo_faturamento` / equivalente futuro | incluir equivalente futuro | por clinica | nao | sim | nao literal | media | 8H - contrato tecnico TISS faltante |
| incluir | Status | `_STATUS_INTERV` | equivalente nao localizado | incluir equivalente futuro | por clinica | nao | sim | nao literal | media | 8H - contrato tecnico status/fases |
| manter | Procedimentos | `TAB_PRC` / `TAB_PRC_ITEM` | `procedimento_tabela` / `procedimento` | manter equivalente existente | por clinica | sim | nao | sim | alta | 8H - metadata da tabela Brana |
| manter | Procedimentos | `TAB_GEN_ITEM*` | `procedimento_generico*` | manter equivalente existente | por clinica | sim | nao | sim | alta | 8H - metadata da tabela Brana |
| melhorar | Materiais / repasses | `TAB_MAT*` / `TAB_REPASSE` | `lista_material` / `material` / `prestador_*` | manter e melhorar | por clinica | parcial | sim | sim | media | 8H - materiais/repasses |
| manter | CID | `CID_ITEM` | `doenca_cid` | manter sem duplicar | por clinica | sim | nao | sim | alta | 8H - TISS e apoio clinico |
| manter | Anamnese | `ANAMNESE_QUEST` / `ANAMNESE_PERG` | `anamnese_questionarios` / `anamnese_perguntas` | manter equivalente existente | por clinica | sim | nao | sim | alta | 8H - estrutura vazia/runtime |
| manter | Relatorios/interface | `CONFIG_REPORT` | `relatorio_config` | manter equivalente existente | por clinica | sim | nao | sim | media | 8H - contrato tecnico interface |
| incluir | Relatorios/interface | `CUSTOMPAGE` / `CUSTOMCONTROL` | equivalente nao localizado | incluir equivalente futuro | por clinica | nao | sim | nao literal | media | 8H - contrato tecnico interface |
| manter | Configuracao global | `SISTEMA` | `preferences` / `system_options` | manter equivalente e melhorar | global | parcial | sim | sim | media | 8H - contrato tecnico configuracao |
| manter | Odontograma | `DENTE` / `ARCADA` / `FACE` | fluxo de odontograma / simbolos | manter como estrutura runtime vazia | por clinica | nao | sim | sim | media | 8H - contrato tecnico odontograma |
| manter | Runtime clinico | `INTERVENCAO` / `HISTORICO` | `tratamento` / fluxo clinico | manter como estrutura runtime vazia | por clinica | nao | sim | sim | media | 8H - contrato tecnico runtime |
| manter | Agenda | `AGENDA` | agenda_legado / configuracoes | manter vazio / nao seedar uso | por clinica | nao | sim | sim | media | 8H - setup opcional/reduzido |
| manter | Financeiro | `LANCAMENTO` / `PARCELA` / `RECIBO` / `RETORNO` | `lancamento` / fluxos financeiros | manter vazio / nao seedar uso | por clinica | nao | sim | sim | media | 8H - financeiro estrutural |

## 6. Fluxo final de nascimento de nova conta apos contrato revisado
- cria clinica / tenant
- cria unidade `Principal / 0001`
- cria usuario system / `Clínica` `255`
- cria admin inicial / `Mestre` funcional `codigo=1`
- cria prestador sistemico / `Clínica` `255`
- cria / vincula perfis e permissoes
- cria tabela Brana
- cria seeds odontologicos estruturais
- mantem estruturas runtime vazias
- preserva assinatura digital
- nao depende de setup para estrutura minima

## 7. Ordem futura de implementacao
1. Unidade `Principal / 0001`.
2. Matriz formal de permissoes.
3. Metadata da tabela Brana / Tabela Exemplo.
4. TISS faltantes.
5. Status / fases / intervencao.
6. `CUSTOMPAGE` / `CUSTOMCONTROL` ou equivalentes.
7. Materiais / repasses.
8. Protecoes contra exclusao.
9. Setup opcional / reduzido.

## 8. Primeira implementacao real recomendada
- Recomendacao: implementacao isolada da unidade `Principal / 0001`.
- Justificativa: e o item mais estrutural, mais verificavel e mais simples de isolar sem misturar permissao, layout, TISS ou financeiro.

## 9. Proxima subetapa recomendada
- Recomendacao: `EasyDental virgem - Subetapa 8H - implementacao isolada da unidade Principal 0001 apenas para novas contas`.
- Justificativa: com o contrato mestre revisado fechado, a proxima entrega mais segura e pequena e a primeira implementacao isolada da unidade formal de nascimento.

## 10. Plano de verificacao
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
