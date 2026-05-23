# Clínica 10 - Exclusão segura - Etapa 1 - Diagnóstico somente leitura

## 1. Contexto

- Conta teste atual criada manualmente e usada nos testes de primeiro acesso/senha interna.
- E-mail esperado: `institutobrana@gmail.com`.
- A conta pode ter sido contaminada pelo comportamento anterior no qual a senha interna sobrescrevia a senha de login.
- O objetivo futuro e excluir essa conta com seguranca e depois recriar uma conta limpa.
- Nesta etapa foi seguido apenas o contrato oficial de exclusao segura, sem execucao real.

## 2. Contratos/documentos consultados

- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/clinica_8_exclusao_segura_etapa_1_diagnostico_somente_leitura.md`
- `docs/clinica_9_exclusao_segura_etapa_1_diagnostico_somente_leitura.md`
- `docs/clinica_9_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md`
- `docs/clinica_9_exclusao_segura_etapa_3_execucao_real_controlada.md`

## 3. Identidade confirmada

Banco confirmado por leitura:
- `current_database = brana_saas`

Identidade da conta:
- `clinica_id = 10`
- nome da clinica: `Tel`
- e-mail: `institutobrana@gmail.com`
- `tipo_conta = DEMO 7 dias`
- `ativo = true`
- `criado_em = 2026-05-23 07:19:42.711132-03:00`
- `trial_ate = 2026-05-30 10:19:42.715020`
- `nome_tabela_procedimentos = Tabela Exemplo`

Usuarios vinculados encontrados:
- `usuarios.id = 23`
- `usuarios.id = 24`
- `usuarios.id = 25`

Prestadores vinculados encontrados:
- `prestador_odonto.id = 15`
- `prestador_odonto.id = 16`

Assinatura/plano/cobranca:
- `assinaturas`: 0 linhas para `clinica_id = 10`
- `plataforma_assinaturas`: 0 linhas para `clinica_id = 10`
- `plataforma_cobrancas`: 0 linhas para `clinica_id = 10`

## 4. Diagnostico por grupo

### 4.1 Nucleo da clinica
- Clinica confirmada como teste manual.
- E-mail bate exatamente com `institutobrana@gmail.com`.
- Nao foi encontrado indício de outra clinica nessa identidade.

### 4.2 Usuarios

| id | codigo | nome | email | is_admin | is_system_user | setup_completed | forcar_troca_senha | senha_hash | senha_interna_hash |
| --- | ---: | --- | --- | --- | --- | --- | --- | --- | --- |
| 23 | 255 | Clínica | `clinica.255.c10@system.brana.local` | false | true | true | false | preenchido | vazio |
| 24 | 1 | Tel | `institutobrana@gmail.com` | true | false | true | false | preenchido | vazio |
| 25 | 256 | Jozicler Teodoro Sampaio | `joziclerteodorosampa.256.c10@local.brana` | false | false | false | false | preenchido | vazio |

Observacoes:
- `usuarios.id = 23` e o usuario sistema esperado.
- `usuarios.id = 24` e o admin/dono esperado.
- `usuarios.id = 25` e o outro usuario encontrado.
- `senha_hash` existe para os tres usuarios.
- `senha_interna_hash` ainda nao foi preenchido para nenhum dos tres.

### 4.3 Prestadores

| id | clinica_id | usuario_id | nome | codigo |
| --- | ---: | ---: | --- | --- |
| 15 | 10 | 23 | Clínica | 001 |
| 16 | 10 | 25 | Gleisson Tel | 002 |

Observacoes:
- o prestador sistema esperado esta vinculado ao usuario 23;
- o segundo prestador esta vinculado ao usuario 25;
- nao foi encontrado prestador extra alem destes dois.

### 4.4 Assinatura / cobranca
- `assinaturas`: vazio para a clinica 10.
- `plataforma_assinaturas`: vazio para a clinica 10.
- `plataforma_cobrancas`: vazio para a clinica 10.
- Nao foi encontrado dado de cobranca ativa ou pendente na leitura desta etapa.

### 4.5 access_profile

Contagem:
- `10` registros

Lista exata:
1. `Agenda de horarios`
2. `Controle de estoque`
3. `Controle de protetico`
4. `Controle de recibos`
5. `Creditos na conta corrente`
6. `Debitos na conta corrente`
7. `Intervencoes`
8. `Pacientes`
9. `Relatorios estatisticos`
10. `Relatorios financeiros`

Observacao:
- nao foi encontrada duplicidade.

### 4.6 usuario_perfil_acesso
- `0` registros para `clinica_id = 10`
- Nao foram encontrados vinculos para `usuarios.id = 23`, `24` ou `25`

### 4.7 etiqueta_modelo

Contagem:
- `8` registros

IDs e nomes:
- `91` - `Envelope1`
- `92` - `Envelope2`
- `93` - `Envelope3`
- `94` - `Pimaco completo (6080)`
- `95` - `Pimaco completo (6081)`
- `96` - `Pimaco completo (A4254)`
- `97` - `Pimaco completo (A4255)`
- `98` - `Pimaco completo (A4256)`

Observacao:
- `modelos_documento` e `etiqueta_padrao` sao catalogos globais/shared e nao devem ser apagados.

### 4.8 e-mail / email_codes
- `email_codes`: 1 registro para `institutobrana@gmail.com`
- `plataforma_auditoria`: nenhum registro encontrado para `institutobrana@gmail.com`
- O e-mail aparece tambem nos usuarios `id = 24` e no registro de `email_codes`.

### 4.9 Dados reais impeditivos

Zerados na leitura desta etapa:
- `pacientes`
- `tratamento`
- `lancamento`
- `agenda_legado_evento`
- `agenda_legado_bloqueio`
- `anamnese_respostas`
- `plataforma_cobrancas`

Conclusao:
- nao foram encontrados dados clinicos/financeiros reais que bloqueiem a exclusao.

### 4.10 Seeds / tabelas auxiliares

Registros encontrados para `clinica_id = 10` que parecem ser catalogos/seeds da nova conta:
- `anamnese_perguntas`: 41
- `anamnese_questionarios`: 3
- `categoria_financeira`: 86
- `convenio_odonto`: 10
- `doenca_cid`: 14486
- `grupo_financeiro`: 13
- `indice_financeiro`: 4
- `item_auxiliar`: 1226
- `lista_material`: 1
- `plano_odonto`: 10
- `procedimento`: 56
- `procedimento_generico`: 591
- `procedimento_tabela`: 2
- `simbolo_grafico_catalogo`: 138

Leitura interpretativa:
- estes dados indicam um conjunto de catálogos/seed de nova conta;
- nao foram classificados como impeditivos para a exclusao da conta teste.

### 4.11 Vinculos por usuario_id

- `usuario_id = 23`: vinculo encontrado em `prestador_odonto` (1)
- `usuario_id = 24`: nenhum vinculo relevante encontrado nas consultas de leitura
- `usuario_id = 25`: vinculo encontrado em `prestador_odonto` (1)

### 4.12 Vinculos por prestador_id

- `prestador_id = 15`: vinculo encontrado em `usuarios` (1)

### 4.13 FKs/constraints relevantes

Principais FKs mapeadas que importam para esta exclusao:
- `usuarios.clinica_id -> clinicas.id`
- `prestador_odonto.clinica_id -> clinicas.id`
- `prestador_odonto.usuario_id -> usuarios.id`
- `access_profile.clinica_id -> clinicas.id`
- `usuario_perfil_acesso.clinica_id -> clinicas.id`
- `usuario_perfil_acesso.usuario_id -> usuarios.id`
- `usuario_perfil_acesso.prestador_id -> prestador_odonto.id`
- `etiqueta_modelo.clinica_id -> clinicas.id`
- `assinaturas.clinica_id -> clinicas.id`
- `plataforma_assinaturas.clinica_id -> clinicas.id`
- `plataforma_cobrancas.clinica_id -> clinicas.id`
- `pacientes.clinica_id -> clinicas.id`
- `tratamento.clinica_id -> clinicas.id`
- `lancamento.clinica_id -> clinicas.id`

## 5. Dados impeditivos

Nao foram encontrados os dados impeditivos previstos no contrato:
- pacientes
- tratamentos
- lancamentos
- agenda
- cobrancas
- respostas de anamnese

O que existe e o seguinte:
- catalogos/seed da nova conta;
- usuarios;
- prestadores;
- access_profile;
- etiqueta_modelo;
- `email_codes`.

## 6. Vinculos inesperados

Nao foi encontrado vinculo inesperado que bloqueie a futura exclusao.

Observacoes de leitura:
- a conta tem dois prestadores vinculados, um deles com o usuario sistema e outro com o usuario 25;
- o e-mail esta presente em `usuarios.id = 24` e em `email_codes`;
- nao houve outro vinculo fora do esperado para a conta teste.

## 7. Riscos

Riscos identificados para a etapa futura de exclusao:
- remover sem backup/export antes do runner;
- tocar catalogos globais compartilhados por engano;
- apagar etiquetas/modelos globais que nao pertencem so a clinica 10;
- repetir `--execute` por engano;
- confundir dados seed da nova conta com dados reais de outra clinica;
- apagar vinculos de `usuarios` ou `prestador_odonto` sem validar IDs;
- ignorar o `email_codes` que ainda prende `institutobrana@gmail.com`.

## 8. Decisao vigente PARTICULAR -> Brana

- Para novas contas/clinicas, a tabela atualmente chamada PARTICULAR deve passar a nascer como Brana.
- Contas existentes podem manter PARTICULAR como esta.
- Nenhuma alteracao disso foi feita nesta etapa.

## 9. Proxima etapa recomendada

A conta 10 foi confirmada como conta de teste e nao apresentou dados reais impeditivos nas tabelas principais de exclusao.

Proxima etapa recomendada:
- Etapa 2 - criar/ajustar runner e backup/export da clinica 10 com dry-run, ainda sem executar `--execute`.

Se surgir qualquer duvida sobre algum catalogo ou vinculo inesperado, abrir auditoria especifica antes de seguir para runner.

## 10. Confirmacoes da etapa

- somente este documento foi criado;
- nenhum codigo foi alterado;
- banco nao foi alterado;
- nenhum DELETE/UPDATE/INSERT foi executado;
- nenhuma senha foi alterada;
- nenhum usuario foi alterado;
- nenhuma clinica foi excluida;
- nenhuma clinica foi criada;
- signup/seeds/access_profile nao foram alterados;
- Intervencoes/Procedimentos nao foi alterado;
- PARTICULAR/Brana nao foi alterado;
- frontend/backend nao foram alterados;
- pastas proibidas nao foram tocadas;
- blindagem textual/mojibake respeitada;
- sem git add/commit/push.
