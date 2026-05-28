# Fase 2B - Auditoria para escolha do proximo modulo pos-validacao 8W-B

## 1. Contexto

- A exclusao de usuario comum ja foi validada manualmente.
- A validacao manual da 8W-B foi aprovada pelo usuario.
- A trilha esta liberada para auditar o proximo modulo ou recorte de modularizacao/refatoracao.
- Nenhuma implementacao foi feita nesta etapa.
- Nenhuma nova modularizacao foi iniciada nesta etapa.

## 2. Fontes consultadas

- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2b_validacao_8w_b_usuarios_novos_aprovada.md`
- `docs/fase_2b_retomada_validacao_8w_b_usuarios_novos.md`
- `docs/fase_2b_validacao_manual_exclusao_usuario_comum_aprovada.md`
- `docs/fase_2b_auditoria_retomada_modularizacao_pos_correcao_exclusao_usuario.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- Documentos recentes de Fase 2 e Fase 2B sobre `Preferencias / Configuracoes`, `Cadastros auxiliares`, `Prestadores`, `Medicamentos`, `Ficha pessoal`, `Conta corrente`, `Convenios e Planos`, `Relatorios`, `Indices financeiros`, `Agenda principal`, `Tabela de proteticos`, `Usuarios/Admin`, `Editor de texto`, `Etiquetas` e `Plano de contas`.
- `frontend/app.js`
- Inventario de `frontend/js/modules/*`

## 3. Estado Git

- Branch: `modularizacao-segura-fase-1`.
- Commit mais recente informado e presente no historico: `e286373`.
- Status inicial: sem tracked modificados desta etapa; havia apenas untracked antigos preservados em `docs/` e `storage/modelos/clinicas/15/`.
- A validacao da 8W-B ja estava registrada como aprovada.
- O roadmap ja apontava para auditoria de escolha do proximo modulo.

## 4. Estado dos monolitos

- `frontend/app.js` tem cerca de `24.252` linhas e `1.778.569` bytes.
- O arquivo continua concentrando a orquestracao global de login, permissoes, modulos, modais, menus e fallback de tela.
- Blocos grandes ainda presentes no monolito incluem:
  - `sysOptCarregar/sysOptSalvar/sysOptEnsureUI/sysOptAbrir` em torno de `3143-3448`;
  - `prestEnsureUI/prestAbrir` em torno de `22462-22499`;
  - `unidadeEnsureUIBaseV3/unidadeAbrir` em torno de `22501-22509`;
  - `simbolos*` em torno de `22882-23305`;
  - `anamnese*` em torno de `23343-23870`;
  - `medicamentos*` em torno de `23894-24343`;
  - o eixo de usuarios/admin, permissoes, menus e limpeza de sessao ainda e grande e continua acoplado ao restante da UI.
- O inventario de `frontend/js/modules` mostra modularizacao ja iniciada, mas ainda parcial em varios pontos.

## 5. Modulos existentes

- `frontend/js/modules/users-admin-modal-visual.js`
- `frontend/js/modules/unidades.js`
- `frontend/js/modules/tabela-proteticos-helpers.js`
- `frontend/js/modules/simbolos-graficos.js`
- `frontend/js/modules/procedimentos-genericos.js`
- `frontend/js/modules/prestadores.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `frontend/js/modules/plano-contas.js`
- `frontend/js/modules/medicamentos.js`
- `frontend/js/modules/materiais.js`
- `frontend/js/modules/intervencoes-procedimentos.js`
- `frontend/js/modules/etiquetas.js`
- `frontend/js/modules/editor_textos_bootstrap.js`
- `frontend/js/modules/convenios-planos.js`
- `frontend/js/modules/cid.js`
- `frontend/js/modules/auxiliares.js`
- `frontend/js/modules/anamnese.js`
- `frontend/js/modules/agenda-principal-semana-utils.js`
- `frontend/js/modules/agenda-principal-legado-utils.js`
- `frontend/js/modules/agenda-contatos-telefones.js`
- `frontend/js/modules/agenda-contatos-listagem.js`

## 6. Modulos parcialmente extraidos

- `Preferencias / Configuracoes` continua com bloco relevante em `app.js`, mas ja possui `frontend/js/modules/preferencias-opcoes-sistema.js` e pontes de integracao.
- `Prestadores` ja possui `frontend/js/modules/prestadores.js`, mas a superficie remanescente ainda e sensivel.
- `Convenios e Planos` ja possui `frontend/js/modules/convenios-planos.js`, com integracao ainda parcial.
- `Medicamentos` ja possui `frontend/js/modules/medicamentos.js`, mas ainda concentra editor, lista, filtros e persistencia.
- `Anamnese` e `Simbolos graficos` ja possuem modulos dedicados, com pontes ainda ativas em `app.js`.
- `Agenda principal` esta fatiada em utilitarios, mas nao em um bloco unico pequeno.
- `Usuarios/Admin` ja tem `frontend/js/modules/users-admin-modal-visual.js`, porem o fluxo segue altamente centralizado.
- `Unidades`, `Plano de contas`, `Etiquetas`, `CID`, `Materiais` e `Procedimentos genericos` tambem ja estao parcialmente externalizados.

## 7. Mapa de risco por frente

| Frente | Estado atual | Classificacao multiarea | Risco | Dependencia backend | Dependencia banco/seeds/permissoes | Funcoes grandes em `app.js` | Modulo parcial em `frontend/js/modules` | Ganho esperado | Recorte pequeno e reversivel | Contrato profundo antes? | Recomendacao |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Preferencias / Configuracoes | candidata | comum/core | medio | sim | medio | sim, `sysOpt*` e `prefCfg` | sim, `preferencias-opcoes-sistema.js` | alto | sim | sim, mas ja com base documental boa | avancar agora |
| Cadastros auxiliares | candidata | comum/core | baixo-medio | baixo-medio | baixo | sim, `aux` e helpers | sim, `auxiliares.js` | medio | sim | sim | so documentar |
| Prestadores | pausada | mista | medio-alto | sim | medio-alto | sim, `prestCfg` e fluxos adjacentes | sim, `prestadores.js` | medio-alto | sim | sim | pausar |
| Medicamentos | pausada | mista | alto | sim | alto | sim, `medicamentosCfg` | sim, `medicamentos.js` | medio | limitado | sim | pausar |
| Ficha pessoal | pausada | mista | alto | sim | alto | sim, eixo `ficha` | nao dedicado claro | medio | limitado | sim | pausar |
| Conta corrente | pausada | comum/core | alto | sim | alto | sim, eixo `cc/rcc/fcx` | nao dedicado claro | medio | limitado | sim | pausar |
| Convenios e Planos | pausada | comum/core | medio-alto | sim | medio-alto | sim, `convPlanCfg` | sim, `convenios-planos.js` | medio-alto | sim | sim | pausar |
| Relatorios | proibida sem nova etapa | comum/core | critico | sim | alto | sim, `procRelatorio`, `dash` e routing | nao dedicado claro | alto | nao claro | sim | so documentar |
| Indices financeiros | pausada | comum/core | alto | sim | alto | sim, `sysOpt` e fluxo financeiro | nao dedicado claro | medio | limitado | sim | pausar |
| Agenda principal | proibida sem contrato | mista | critico | sim | alto | sim, `agendaContatos/agendaLegado/agendaSemana` | sim, utils de agenda | alto | nao claro | sim | proibido sem contrato |
| Tabela de proteticos | pausada | especifica de area profissional | medio-alto | sim | medio-alto | sim, `prot/ctrlProt` | sim, `tabela-proteticos-helpers.js` | medio | sim | sim | pausar |
| Usuarios/Admin | validada e pausada | mista / plataforma | critico | sim | alto | sim, `usersPerm/usersPerf` e area de seguranca | sim, `users-admin-modal-visual.js` | alto | limitado | sim | proibido sem novo contrato |
| Editor de texto | consolidada | comum/core | medio | medio | baixo-medio | sim, `editorTextosCfg` | sim, `editor_textos_bootstrap.js` | medio | sim | nao agora | pausar |
| Etiquetas | candidata secundaria | comum/core | medio | sim | medio | sim, `labels/config-etiquetas` | sim, `etiquetas.js` | medio | sim | sim | so documentar |
| Plano de contas | candidata secundaria | comum/core financeiro | medio-alto | sim | medio-alto | sim, `plano` | sim, `plano-contas.js` | medio | sim | sim | so documentar |

## 8. Riscos e bloqueios

- `Usuarios/Admin`, `Agenda principal`, `Relatorios` e as areas financeiras mais sensiveis continuam bloqueadas para qualquer implementacao sem novo contrato.
- `Prestadores`, `Medicamentos`, `Ficha pessoal`, `Conta corrente`, `Convenios e Planos`, `Indices financeiros` e `Tabela de proteticos` seguem como frentes pausadas ou com risco medio/alto.
- `Editor de texto` permanece consolidado e nao deve ser reaberto como proxima frente.
- A blindagem textual/mojibake continua obrigatoria; nenhuma correcao textual ampla foi feita nesta etapa.

## 9. Decisao conservadora

- **Opcao A**: existe um proximo modulo claramente mais seguro.
- O proximo modulo recomendado e `Preferencias / Configuracoes`.
- O primeiro recorte documental recomendado e o bloco remanescente de `Preferencias`, com fronteira clara contra `sysOpt*`, `Odontograma`, permissoes, payload e salvamento amplo.

## 10. Proxima subetapa recomendada

- Abrir um contrato documental do bloco remanescente de `Preferencias / Configuracoes`, priorizando um recorte pequeno e reversivel e deixando fora login, permissoes, usuarios, signup e seeds.

## 11. Onde testar futuramente

- Tela `Preferencias`.
- Tela `Opcoes do Sistema`.
- Dialogos e abas de configuracao ligados a `sysOpt*`.
- Validacao visual do estado das configuracoes e do fluxo de abertura/fechamento dos dialogs.

## 12. Confirmacoes de escopo

- Nenhum codigo foi alterado.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foi alterado.
- Backend nao foi alterado.
- Banco/schema/migrations/seeds/endpoints nao foram alterados.
- Permissoes nao foram alteradas.
- Seeds nao foram alteradas.
- A blindagem textual/mojibake foi respeitada.

## 13. Registro para roadmap

- Auditoria pos-validacao da 8W-B executada.
- Exclusao de usuario comum e 8W-B permanecem validadas.
- Nenhuma implementacao foi feita.
- Nenhuma nova modularizacao foi iniciada.
- Matriz comparativa de frentes candidatas criada.
- Decisao conservadora tomada: Opcao A.
- Proxima subetapa recomendada: contrato documental do bloco remanescente de Preferencias / Configuracoes.
- Documento criado para consolidar a auditoria.
- Blindagem textual/mojibake respeitada.
