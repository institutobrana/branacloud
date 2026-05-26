# Auditoria EasyDental virgem - Subetapa 8C - baseline da conta nova existente ID 16

## 1. Contexto
- Esta subetapa referencia as Subetapas 0 a 8B da frente "Auditoria comparativa EasyDental virgem x Brana Cloud - fechamento final do contrato de usuarios/prestadores e matriz de seeds para novas contas".
- Esta etapa nao cria nova conta.
- A conta existente usada como baseline real e a ID 16 / `institutobrana@gmail.com`.
- Nao ha implementacao nesta etapa.
- A finalidade e comparar o nascimento atual do Brana com o contrato fechado.

## 2. Conferencia Git da Subetapa 8B
- Hash real da 8B: nao existe commit proprio da 8B no historico atual.
- O hash `9f97e5096040630d24e2a14f60c5be83bb429ac0` e o commit da Subetapa 8A, portanto o hash informado anteriormente para a 8B estava repetido por engano.
- O documento da 8B ainda aparece no workspace, mas nao entrou em um commit proprio da 8B neste historico.
- Nao houve push de um commit proprio da 8B.

## 3. Seguranca e limites
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

## 4. Metodo
- Ferramentas: `git status --short`, `git log --oneline -10`, `git show --stat --oneline HEAD`, `git log --oneline -- docs/...8b...`, leitura de arquivos do projeto e consultas somente leitura no PostgreSQL do Brana via `.venv\Scripts\python.exe`.
- As consultas foram somente `SELECT`.
- A base foi lida pelo `DATABASE_URL` local em `backend/.env`.
- Dados pessoais foram mascarados quando nao eram estruturais.

## 5. Baseline - clinica/tenant
- Clinica ID 16.
- Nome: `Tel`.
- E-mail: `institutobrana@gmail.com`.
- Tipo de conta: `DEMO 7 dias`.
- Trial ate: `2026-05-30 20:22:03.437607`.
- Ativa: sim.
- Data de ativacao: nula.
- `nome_tabela_procedimentos`: `Tabela Exemplo`.
- `opcoes_sistema_json`: nulo.
- Assinatura de plataforma:
  - existe em `plataforma_assinaturas`;
  - plano `DEMO`;
  - status `trial`;
  - bloqueada: nao.
- `assinaturas` nao possui registro para a clinica.
- Comparacao com contrato: a conta nasce aberta e em trial, mas ainda conserva um nome legado em `nome_tabela_procedimentos`.

## 6. Baseline - usuarios
- Total na clinica 16: 3 usuarios.
- Usuario 36:
  - codigo 255;
  - nome estrutural `Clinica` (mascarado no relatorio);
  - tipo_usuario `Clínica`;
  - `is_system_user = true`;
  - `is_admin = false`;
  - `setup_completed = true`;
  - `prestador_id = 22`;
  - `unidade_atendimento_id = null`.
- Usuario 37:
  - codigo 1;
  - nome do titular mascarado;
  - tipo_usuario `Clínica`;
  - `is_system_user = false`;
  - `is_admin = true`;
  - `setup_completed = true`;
  - `prestador_id = null`;
  - `unidade_atendimento_id = null`.
- Usuario 38:
  - codigo 256;
  - nome mascarado;
  - tipo_usuario `Dentista (CD)`;
  - `is_system_user = false`;
  - `is_admin = false`;
  - `setup_completed = false`;
  - `prestador_id = null`;
  - `unidade_atendimento_id = null`.
- Permissoes:
  - os 3 usuarios possuem `permissoes_json`;
  - todos compartilham as mesmas 9 chaves de topo: agenda, anamnese, configuracao, financeiro, materiais, prestadores, procedimentos, relatorios, usuarios;
  - o payload nao e identico entre eles, mas a estrutura de categoria e a mesma.
- Comparacao com contrato:
  - admin inicial existe;
  - usuario sistemico 255 existe;
  - cobertura ampla de permissoes existe;
  - nao ha `usuario_perfil_acesso`;
  - nao ha unidade vinculada.

## 7. Baseline - prestadores
- Total na clinica 16: 1 prestador.
- Prestador 22:
  - `source_id = 255`;
  - `usuario_id = 36`;
  - codigo `001`;
  - nome estrutural `Clinica` (mascarado no relatorio);
  - tipo_prestador `Clínica odontológica`;
  - `is_system_prestador = true`;
  - `executa_procedimento = true`;
  - `inativo = false`.
- Comparacao com contrato:
  - o prestador sistêmico/reservado existe;
  - esta ligado ao usuario sistemico 255;
  - os campos de sistema estao coerentes com o contrato;
  - nao ha prestador adicional para a unidade, porque a unidade nao existe.

## 8. Baseline - unidade
- Total na clinica 16: 0 unidades de atendimento.
- Nao ha unidade inicial cadastrada.
- Nenhum usuario possui `unidade_atendimento_id`.
- Comparacao com contrato:
  - este e o principal desvio estrutural do baseline;
  - a conta nasce sem unidade inicial, apesar de nascer com usuario e prestador estruturais.

## 9. Baseline - perfis/permissoes
- `access_profile` na clinica 16: 10 registros.
- Perfis reservados presentes:
  - Agenda de horarios
  - Controle de estoque
  - Controle de protetico
  - Controle de recibos
  - Creditos na conta corrente
  - Debitos na conta corrente
  - Intervencoes
  - Pacientes
  - Relatorios estatisticos
  - Relatorios financeiros
- `usuario_perfil_acesso`: 0 registros.
- Comparacao com contrato:
  - perfis reservados existem;
  - a matriz de vinculo usuario/perfil nao foi materializada;
  - o acesso operativo parece seguir via JSON de permissoes e nao via tabela de vinculo.

## 10. Baseline - tabela privada Brana/PARTICULAR
- `procedimento_tabela` na clinica 16: 2 registros.
- Tabela 73:
  - codigo `1`;
  - nome `Tabela Exemplo`;
  - `fonte_pagadora = particular`;
  - 56 procedimentos;
  - todos os 56 com preco, custo e repasse zerados;
  - sem generico, simbolo ou preferido.
- Tabela 74:
  - codigo `4`;
  - nome `Brana`;
  - `fonte_pagadora = particular`;
  - 336 procedimentos;
  - todos os 336 com preco, custo e repasse zerados;
  - sem generico, simbolo ou preferido.
- `lista_material`:
  - 1 lista;
  - nome `Tabela Brana`;
  - 244 materiais.
- Comparacao com contrato:
  - a tabela privada Brana ja existe;
  - nao ha PARTICULAR nesta conta;
  - existe convivencia com o nome legado `Tabela Exemplo` em paralelo;
  - a conta nao esta seedada com preco comercial indevido.

## 11. Baseline - seeds odontologicos

| Grupo | Esperado pelo contrato | Encontrado na conta 16 | Status | Observacao |
| --- | --- | --- | --- | --- |
| CID | sim | `doenca_cid` com 14486 | conforme | base clinica ampla |
| Tabela generica | sim | `procedimento_generico` com 591 | conforme/parcial | todos sem especialidade/simbolo |
| Procedimentos canonicos | sim | `procedimento` com 392 | conforme/parcial | 336 Brana + 56 Tabela Exemplo |
| Procedimentos genericos | sim | `procedimento_generico` com 591 | conforme/parcial | catalogo amplo, sem enriquecimento extra |
| Especialidades | sim | `convenio_odonto`/`plano_odonto` e auxiliares | parcial | lookup presente, sem unidade/perfil |
| Fases de procedimento | sim | `procedimento_generico_fase` 4 / `procedimento_fase` 1 | parcial | estrutura ainda pequena |
| Status de intervencao | sim | lookups auxiliares e catalogos | parcial | precisa confirmacao fina por tabela |
| Simbolos odontologicos | sim | `simbolo_grafico_catalogo` 138 | conforme/parcial | catalogo forte, ativo |
| Simbolos/anomalias | sim | `simbolo_grafico_catalogo` 138 | conforme/parcial | mesmo catalogo cobre uso estrutural |
| Anamnese base | sim | 3 questionarios / 41 perguntas | conforme | respostas quase vazias |
| Materiais estruturais | sim | `lista_material` 1 / `material` 244 | conforme | lista Brana pronta |
| Repasses estruturais | pendente | `prestador_comissao_odonto` 0 | ausente | nenhum seed de repasse |
| TISS/regioes/tipo de tabela | pendente | `procedimento_tabela` com `tipo_tiss_id` | parcial | precisa decisao fina |
| Lookups auxiliares | sim | `item_auxiliar` 1226 | conforme | alta volumetria estrutural |
| Relatorios/interface/formularios | sim | `relatorio_config` 0 | ausente | ainda nao nasce por conta |
| Assinatura digital | sim | assinatura digital preservada no codigo; `assinaturas` 0 | parcial | nao ha registro local, mas o recurso existe |

### 11.1 Tabelas e fluxos com volume relevante
- `procedimento_material`: 6281.
- `procedimento_generico_material`: 1746.
- `procedimento_generico_fase`: 4.
- `procedimento_fase`: 1.
- `anamnese_respostas`: 1.
- `plataforma_auditoria`: 57 global.
- `plataforma_cobrancas`: 0.

### 11.2 Procedimentos
- `procedimento` total: 392.
- `procedimento` com `procedimento_generico_id`, `especialidade`, `simbolo_grafico`, `preco`, `custo` ou `valor_repasse` preenchidos: 0.
- Isso indica que o catalogo nasceu, mas ainda esta sem enriquecimento de ligacoes finas.

### 11.3 Procedimentos genericos
- `procedimento_generico` total: 591.
- Nenhum registro com especialidade, simbolo ou inativo.
- O catalogo existe, mas ainda esta em estado estrutural simples.

### 11.4 Anamnese
- `anamnese_questionarios`: 3.
  - Principal
  - Implante
  - Ficha complementar
- `anamnese_perguntas`: 41.
- `anamnese_respostas`: 1.
- Comparacao com contrato:
  - questionarios e perguntas nascem;
  - respostas nao devem ser seed de nascimento.

## 12. Baseline - setup
- `setup_completed`:
  - usuario 36: true;
  - usuario 37: true;
  - usuario 38: false.
- A conta 16 nao parece depender da tela de setup para uso basico do sistema.
- Comparacao com contrato:
  - condiz com a regra de nascer pronta;
  - o setup nao aparece como bloqueador da estrutura minima.

## 13. Baseline - protecoes
- Registros com flag estrutural encontrada:
  - usuario 36: `is_system_user = true`;
  - prestador 22: `is_system_prestador = true`;
  - `access_profile`: todos reservados = true;
  - `plataforma_assinaturas`: bloqueada false.
- Registros sem protecao estrutural clara:
  - unidade: nao existe;
  - `usuario_perfil_acesso`: nao existe;
  - `relatorio_config`: nao existe;
  - `assinaturas`: nao existe.
- Risco de exclusao indevida:
  - baixo para o usuario/prestador sistemicos enquanto as flags forem respeitadas;
  - alto para a unidade, porque ela nem nasceu;
  - medio para a tabela Brana, porque existe mas tambem convive com o legado `Tabela Exemplo`.

## 14. Comparativo contrato x conta ID 16

| Item do contrato | Esperado | Encontrado na conta 16 | Status | Risco | Acao futura sugerida |
| --- | --- | --- | --- | --- | --- |
| Clinica/tenant | conta pronta, trial, ativa | sim | conforme | baixo | manter |
| Usuario admin inicial | existe e e protegido | sim, codigo 1 / admin | conforme | medio se perder permissao | proteger acesso total |
| Usuario sistemico/Mestre | existe ou equivalente | sim, usuario 36 / codigo 255 | conforme | medio | manter protegido |
| Prestador sistemico/Clinica | existe e e protegido | sim, prestador 22 / source_id 255 | conforme | medio | manter protegido |
| Unidade inicial | deve existir | nao existe | ausente | alto | criar em subetapa futura |
| Perfis base | devem nascer | sim, 10 perfis reservados | conforme | medio | manter e vincular |
| Matriz de acesso | deve nascer | `permissoes_json` existe; `usuario_perfil_acesso` nao | parcial | medio | decidir modelo final |
| Tabela Brana | deve nascer | sim, 336 proced. | conforme | baixo | manter |
| PARTICULAR legada | deve ficar em contas antigas | nao apareceu nesta conta | conforme | baixo | nao migrar legado |
| CID | deve nascer | sim | conforme | baixo | manter |
| Tabela generica | deve nascer | sim | conforme | baixo | manter |
| Procedimentos canonicos | devem nascer | sim | conforme | baixo | manter |
| Especialidades | devem nascer | sim | parcial | medio | enriquecer se necessario |
| Fases/status | devem nascer | existe, mas parcial | parcial | medio | ampliar |
| Simbolos | devem nascer | sim | conforme | baixo | manter |
| Anamnese | deve nascer preenchida | sim | conforme | baixo | manter |
| Materiais | devem nascer estruturados | sim | conforme | baixo | manter |
| Repasses | depende de contrato | ausente | pendente | medio | definir contrato tecnico |
| Relatorios/interface | deveriam existir | ausente como relatorio_config | ausente | medio | decidir seed minimo |
| Assinatura digital | deve ser preservada | recurso existe; assinatura local 0 | parcial | medio | validar fluxo real |

## 15. Achados principais
- O que ja nasce corretamente:
  - clinica ativa em trial;
  - usuario admin inicial;
  - usuario sistemico 255;
  - prestador sistemico 255;
  - tabela Brana;
  - CID;
  - procedimentos genericos e canonicos;
  - anamnese;
  - materiais;
  - lookups auxiliares;
  - simbolos grafico-odontologicos.
- O que nasce diferente:
  - nao ha unidade;
  - nao ha usuario_perfil_acesso;
  - o nome legado `Tabela Exemplo` continua presente na metadado da clinica;
  - o catalogo de procedimentos nao esta enriquecido com genericos/simbolos/precos.
- O que falta:
  - unidade inicial;
  - matriz de vinculo usuario/perfil;
  - relatorio_config;
  - repasses;
  - assinatura local se isso for parte do contrato operacional;
  - definicao fina de status/fases.
- O que depende de setup:
  - nada estrutural essencial apareceu dependente da tela de setup.
- O que precisa de protecao:
  - usuario 36;
  - prestador 22;
  - tabela Brana;
  - perfis reservados;
  - eventualmente a futura unidade inicial.

## 16. Lacunas para implementacao futura
- Criar unidade inicial ou definir equivalente estrutural.
- Decidir se `usuario_perfil_acesso` deve ser seed de nascimento.
- Definir se `relatorio_config` deve nascer preenchido.
- Definir repasses estruturais.
- Definir melhor o tratamento do nome legado `Tabela Exemplo`.
- Confirmar se o admin inicial deve ser vinculado a prestador/unidade.

## 17. Conclusao
- A conta ID 16 confirma que o Brana ja nasce muito mais pronto do que a tela de setup sugeria.
- O diagnostico principal do contrato e confirmado: usuario sistemico, admin, prestador sistemico, seeds odontologicos e tabela Brana ja existem.
- O principal desvio estrutural e a ausencia de unidade inicial e de matriz formal de vinculos/perfis.
- O contrato esta pronto para primeira implementacao real, mas a primeira implementacao mais segura deve começar pela unidade inicial e pela matriz de perfis/permissoes, nao pela troca da tabela privada.

## 18. Proxima subetapa recomendada
`EasyDental virgem - Subetapa 8D - contrato tecnico da unidade inicial e matriz de perfis/permissoes para novas contas, sem implementacao`

### Justificativa
- O baseline mostrou que a tabela Brana ja nasce.
- O maior gap estrutural remanescente e a unidade inicial, alem da formalizacao da matriz de acesso.
- Isso e mais critico do que voltar a discutir a tabela privada.

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
- A conta ID 16 nao foi alterada.
- Nenhuma conta existente foi alterada.
- A tela de setup nao foi alterada.
- Dados sensiveis nao foram expostos.
- A blindagem textual/mojibake foi respeitada.

## 21. Correcao posterior - usuario criado manualmente
- O USUARIO 38 foi observado no baseline, mas o usuario informou posteriormente que ele foi criado manualmente apos a criacao da conta e depois removido.
- Portanto, o USUARIO 38 nao deve ser considerado parte do nascimento padrao da conta 16.
- A leitura correta do baseline do nascimento padrao passa a considerar apenas o USUARIO 36 como usuario estrutural/system, o USUARIO 37 como admin inicial e o PRESTADOR 22 como prestador sistemico/reservado vinculado ao usuario estrutural.
- A existencia da tabela Brana, dos perfis reservados e dos seeds odontologicos permanece valida.
- A ausencia de unidade formal continua sendo lacuna valida.
- A ausencia de `usuario_perfil_acesso` formal continua sendo lacuna valida.
- A coexistencia de metadata legada "Tabela Exemplo" com Brana continua sendo lacuna valida.
- Esta correcao e somente documental e nao altera a conta 16.
