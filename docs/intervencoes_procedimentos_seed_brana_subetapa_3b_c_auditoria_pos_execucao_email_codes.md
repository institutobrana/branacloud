# Interven??es / Procedimentos / Seeds ? Subetapa 3B-C ? Auditoria p?s-execu??o da limpeza de email_codes

## 1. Objetivo
Auditar, ap?s a execu??o j? conclu?da da Subetapa 3B, se a limpeza pontual de `email_codes` para `institutobrana@gmail.com` foi compat?vel com o contrato oficial de exclus?o segura e com as trilhas de exclus?o das cl?nicas 8, 9 e 10, sem repetir a limpeza, sem alterar banco e sem alterar c?digo.

## 2. Contexto real da a??o j? executada
A Subetapa 3B j? executou a limpeza operacional dos registros pendentes de `email_codes` do e-mail `institutobrana@gmail.com`.

Resultado j? informado da execu??o:
- n?o houve cria??o de conta nem cl?nica;
- n?o houve signup real;
- antes da limpeza existiam 3 registros em `email_codes` para `institutobrana@gmail.com`;
- IDs removidos: `22`, `23`, `24`;
- todos tinham `used = false`;
- filtro usado: `lower(email) = lower('institutobrana@gmail.com') AND used = false`;
- a execu??o real controlada removeu somente esses 3 registros;
- depois da limpeza:
  - `email_codes` pendentes para `institutobrana@gmail.com`: `0`;
  - total de `email_codes` para `institutobrana@gmail.com`: `0`;
  - cl?nica com esse e-mail: `0`;
  - usu?rio com esse e-mail: `0`;
  - `clinicas.id = 13`: `0`;
  - `usuarios` com `clinica_id = 13`: `0`;
  - `procedimento_tabela` com `clinica_id = 13`: `0`;
  - `procedimento` com `clinica_id = 13`: `0`;
  - `prestador_odonto` com `clinica_id = 13`: `0`;
- nenhuma cl?nica foi alterada;
- nenhum usu?rio foi alterado;
- `procedimento_tabela` e `procedimento` n?o foram alterados;
- nenhum c?digo foi alterado;
- documento j? criado: `docs/intervencoes_procedimentos_seed_brana_subetapa_3b_limpeza_email_codes_teste_abortado.md`.

## 3. Por que esta etapa ? p?s-execu??o e n?o nova limpeza
Esta subetapa n?o executa nova remo??o. Ela apenas confronta a a??o j? conclu?da com o contrato e com os padr?es documentais do projeto, para registrar se a limpeza pontual esteve dentro do escopo seguro.

## 4. Contratos e documentos consultados
Documentos consultados nesta auditoria:
- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/clinica_8_exclusao_segura_etapa_1_diagnostico_somente_leitura.md`
- `docs/clinica_8_exclusao_segura_etapa_2_plano_documental.md`
- `docs/clinica_8_exclusao_segura_etapa_3_runner_controlado_sem_execucao.md`
- `docs/clinica_8_exclusao_segura_etapa_4_dry_run_runner.md`
- `docs/clinica_8_exclusao_segura_etapa_5_backup_pre_exclusao.md`
- `docs/clinica_8_exclusao_segura_etapa_8_execucao_real_controlada.md`
- `docs/clinica_8_exclusao_segura_etapa_9_validacao_novo_cadastro_limpo.md`
- `docs/clinica_9_exclusao_segura_etapa_1_diagnostico_somente_leitura.md`
- `docs/clinica_9_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md`
- `docs/clinica_9_exclusao_segura_etapa_3_execucao_real_controlada.md`
- `docs/clinica_10_exclusao_segura_etapa_1_diagnostico_somente_leitura.md`
- `docs/clinica_10_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md`
- `docs/clinica_10_exclusao_segura_etapa_3_execucao_real_controlada.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3a_correcao_duplicidade_signup.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3b_limpeza_email_codes_teste_abortado.md`

## 5. Regras do contrato de exclus?o segura aplic?veis
Do contrato oficial, as regras aplic?veis ao caso foram:
- diagn?stico somente leitura antes da a??o;
- identifica??o exata do alvo;
- dry-run como padr?o;
- filtro restrito ao alvo exato;
- execu??o controlada;
- valida??o p?s-execu??o;
- documenta??o obrigat?ria;
- preserva??o de dados fora do escopo;
- execu??o ?nica;
- n?o repetir execu??o real em caso de d?vida;
- uso de transa??o quando houver execu??o real de exclus?o;
- respeito ? blindagem textual/mojibake.

## 6. Padr?es reaproveitados das exclus?es das cl?nicas 8, 9 e 10
Nas trilhas de exclus?o das cl?nicas 8, 9 e 10, o projeto j? tratou `email_codes` como parte relevante do estado que precisava ser liberado para reutilizar `institutobrana@gmail.com`.

Tamb?m ficou documentado nesses fluxos que:
- havia etapa de diagn?stico somente leitura;
- havia preparo com dry-run;
- havia backup/export quando a exclus?o era de cl?nica;
- havia execu??o controlada com `--execute` apenas em etapa autorizada;
- havia valida??o p?s-execu??o para confirmar libera??o do e-mail e aus?ncia de v?nculos residuais.

## 7. Diferen?a entre exclus?o de cl?nica e limpeza pontual de email_codes
Esta Subetapa 3B n?o foi exclus?o de cl?nica.

A diferen?a principal foi:
- n?o havia `clinicas.id = 13` persistido;
- n?o havia usu?rio persistido com `institutobrana@gmail.com`;
- n?o havia `procedimento_tabela`, `procedimento` ou `prestador_odonto` vinculados;
- o alvo era apenas `email_codes` pendentes com `used = false`.

Portanto, a a??o foi menor que uma exclus?o de cl?nica e n?o exigiu derrubar estruturas completas do tenant.

## 8. Confronto entre a execu??o realizada e o contrato
- alvo identificado: sim;
- leitura pr?via: sim;
- dry-run: sim, textual;
- execu??o restrita: sim;
- valida??o p?s-execu??o: sim;
- backup formal: n?o houve backup/export separado nesta limpeza pontual; para este caso, a rastreabilidade ficou apoiada na identifica??o exata dos IDs removidos e na documenta??o da execu??o j? realizada;
- altera??o fora do escopo: n?o;
- documenta??o: sim, no documento da Subetapa 3B e neste complemento.

## 9. Itens que foram atendidos
- identifica??o exata do alvo `email_codes`;
- filtro restrito ao e-mail `institutobrana@gmail.com`;
- remo??o somente dos registros pendentes `used = false`;
- confirma??o de que n?o havia cl?nica, usu?rio ou v?nculos residuais persistidos;
- valida??o p?s-execu??o mostrando o e-mail livre;
- preserva??o de todas as outras tabelas citadas no contrato;
- documenta??o do resultado.

## 10. Itens n?o aplic?veis ou parcialmente aplic?veis
- backup/export formal: n?o aplicado como em exclus?es de cl?nica, porque n?o havia entidade principal persistida para remover;
- `--execute`: n?o se aplica como nova a??o aqui, porque a execu??o real j? ocorreu na Subetapa 3B;
- transa??o/rollback/commit: n?o foram reexecutados nesta auditoria p?s-execu??o, apenas registrados como parte da execu??o j? descrita.

## 11. Riscos ou lacunas documentais remanescentes
Risco residual documental leve:
- a a??o foi pontual e restrita a `email_codes`, mas a consulta expl?cita aos contratos de exclus?o segura e ?s trilhas 8, 9 e 10 foi formalizada apenas nesta complementa??o p?s-execu??o.

Isso n?o altera o banco nem invalida a limpeza j? realizada; apenas registra a depend?ncia documental que faltava na resposta anterior.

## 12. Situa??o final de institutobrana@gmail.com
Conforme a Subetapa 3B j? validada:
- `email_codes` para `institutobrana@gmail.com`: `0` ap?s limpeza;
- cl?nica com esse e-mail: `0`;
- usu?rio com esse e-mail: `0`;
- `clinicas.id = 13`: `0`;
- e-mail livre para novo teste manual.

## 13. Onde testar manualmente antes de prosseguir
O pr?ximo teste deve ser manual pelo usu?rio.

Criar nova conta com `institutobrana@gmail.com` e validar:

Problema 1 ? login/senha interna/perfis:
- confirma??o de cadastro sem erro 500;
- login com senha de login;
- senha interna n?o entra no login comum;
- senha interna funciona em a??o sens?vel;
- nova cl?nica nasce com 10 perfis padr?o;
- tela Perfis de acesso abre;
- layout mostra Perfis em cima e Prestadores abaixo.

Problema 2 ? Interven??es / Procedimentos:
- m?dulo Interven??es / Procedimentos mostra Tabela exemplo;
- m?dulo Interven??es / Procedimentos mostra Brana;
- nova conta n?o mostra PARTICULAR;
- Brana cont?m 336 procedimentos.

## 14. Pr?xima subetapa recomendada
Subetapa 3C ? Registro documental do novo teste manual combinado dos Problemas 1 e 2, ap?s o usu?rio executar o cadastro manual.
