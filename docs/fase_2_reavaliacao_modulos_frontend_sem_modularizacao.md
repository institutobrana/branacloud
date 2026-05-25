# Fase 2 - Reavaliacao documental dos modulos frontend sem modularizacao real

## 1. Contexto
Esta etapa faz uma reavaliacao documental da continuidade da Fase 2 de modularizacao/refatoracao do frontend.

O foco mudou da trilha `Cadastros Gerais` para uma revisao mais ampla dos blocos ainda concentrados em `frontend/app.js` e que aparentam nao ter um modulo completo proprio em `frontend/js/modules`.

Decisao posterior do usuario registrada nesta etapa:

- todos os modulos da modularizacao/refatoracao devem ser tratados como `core / comum`;
- nao usar mais classificacao `especifico` / `misto` como criterio de conducao;
- nao implementar multiarea;
- nao criar flags multiarea;
- nao separar comportamento por area profissional nesta fase.

Esta etapa e exclusivamente documental.

## 2. Documentos consultados
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_cadastros_gerais_subetapa_1_contrato_funcional_classificacao_multiarea.md`
- `docs/fase_2_cadastros_gerais_subetapa_2_mapa_fronteiras_dominios_permissoes.md`
- `docs/auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 3. Confirmacao dos commits anteriores
Confirmado:

- `f975c920e298258d758b94fd5d8c9c32e0374644` - `Documenta contrato funcional de cadastros gerais`
- `e52a56e247e533597d78a914dd313984e8150826` - `Mapeia fronteiras de cadastros gerais`

Esses commits permanecem validos e nao sao reescritos por esta etapa.

## 4. Decisao posterior do usuario
A partir desta reavaliacao:

- todos os modulos sao tratados como `core / comum`;
- a conducao documental nao deve mais depender de classificacao por area profissional;
- nao ha autorizacao para implementar multiarea;
- nao ha autorizacao para flags multiarea;
- nao ha autorizacao para separar comportamento por area profissional.

## 5. Modulos ja existentes em `frontend/js/modules`
Arquivos atualmente presentes em `frontend/js/modules`:

- `anamnese.js`
- `auxiliares.js`
- `cid.js`
- `convenios-planos.js`
- `editor_textos_bootstrap.js`  [apoio parcial]
- `etiquetas.js`
- `intervencoes-procedimentos.js`
- `materiais.js`
- `medicamentos.js`
- `plano-contas.js`
- `preferencias-opcoes-sistema.js`
- `prestadores.js`
- `procedimentos-genericos.js`
- `simbolos-graficos.js`
- `tabela-proteticos-helpers.js`  [apoio parcial]
- `unidades.js`
- `users-admin-modal-visual.js`  [apoio parcial]

Observacao:

- `editor_textos_bootstrap.js`, `tabela-proteticos-helpers.js` e `users-admin-modal-visual.js` sao arquivos de apoio parcial, nao um modulo completo para os grandes dominios associados.

## 6. Modulos sem arquivo proprio completo em `frontend/js/modules`
Os dominios abaixo ainda aparecem concentrados em `frontend/app.js` sem um modulo completo proprio em `frontend/js/modules`:

- Autenticacao / login
- Agenda
- Agenda de contatos
- Agenda semanal
- Agenda legado
- Editor de textos
- Pacientes / ficha
- Conta corrente
- Fluxo de caixa
- Financeiro operacional
- Indicadores financeiros
- Cenário financeiro / dashboard
- Relatorios / configuracao de relatorios
- Superadmin / plataforma
- Tratamentos / orcamentos
- Protéticos / controle protetico

Observacao:

- alguns desses dominios possuem apenas apoio parcial em arquivos auxiliares, mas ainda nao possuem um modulo completo proprio.

## 7. Tabela comparativa dos modulos sem modularizacao real

| Módulo / dominio | Prefixos / funcoes em `frontend/app.js` | Presenca em `frontend/js/modules` | Backend / rotas relacionadas | Tipo de risco | Impacto esperado na reducao do `app.js` | Recomendacao |
|---|---|---|---|---|---|---|
| Editor de textos | `editorTextos*` (~393 funcoes) | Sem modulo completo; apenas `editor_textos_bootstrap.js` de apoio | `backend/routes/editor_textos_routes.py`, services PDF/modelos/assinatura | Critico | Muito alto | Pausar / estudar mais |
| Agenda | `agenda*`, `agendaSemana*`, `agendaLegado*` (~217 + 95 + 88 funcoes) | Sem modulo completo | `backend/routes/agenda_legado_routes.py` e `backend/routes/agenda_contatos_routes.py` | Critico | Muito alto | Pausar |
| Agenda de contatos | `agendaContatos*` (~33 funcoes) | Sem modulo completo | `backend/routes/agenda_contatos_routes.py` | Alto | Medio | Avancar com cautela |
| Pacientes / ficha | `ficha*`, `fichaAnamnese*` (~94 funcoes) | Sem modulo completo | `backend/routes/cadastros_routes.py`, `backend/routes/anamnese_routes.py`, `backend/routes/tratamentos_routes.py` | Critico | Alto | Pausar |
| Usuarios / perfis / permissoes | `users*` (~118 funcoes) | Sem modulo completo; apenas `users-admin-modal-visual.js` de apoio | `backend/routes/user_admin_routes.py`, `backend/security/permissions.py` | Critico | Alto | Pausar |
| Conta corrente | `cc*` (~22 funcoes) | Sem modulo completo | `backend/routes/financeiro_routes.py` | Critico | Medio | Pausar |
| Fluxo de caixa / financeiro | `fcx*` (~15), `dash*` (~18), `indices*` (~18), `cnfRelatorio*` (~36) | Sem modulo completo | `backend/routes/financeiro_routes.py`, `backend/routes/indices_financeiros_routes.py`, `backend/routes/cenario_routes.py` | Critico | Medio/alto | Pausar |
| Superadmin / plataforma | `sa*` (~63 funcoes) | Sem modulo completo | `backend/routes/superadmin_routes.py` | Critico | Alto | Pausar |
| Relatorios / configuracao de relatorios | `procRelatorio*` (~35), `cnfRelatorio*` (~36), `relatorio*` (~4) | Sem modulo completo | `backend/routes/relatorios_routes.py`, `backend/routes/preferences_routes.py`, `backend/routes/etiquetas_routes.py` | Alto | Medio | Estudar mais |
| Cenário financeiro / dashboard | `dash*` (~18) | Sem modulo completo | `backend/routes/cenario_routes.py`, `backend/routes/procedimentos_routes.py` | Critico | Medio | Pausar |
| Tratamentos / orcamentos | `tratamento*` (presenca visivel no menu e dependencias do app) | Sem modulo completo | `backend/routes/tratamentos_routes.py` | Critico | Alto | Pausar |
| Protéticos / controle protetico | `prot*`, `ctrlProt*` | Sem modulo completo; apenas `tabela-proteticos-helpers.js` de apoio | `backend/routes/proteticos_routes.py`, `backend/routes/controle_proteticos_routes.py` | Alto | Medio | Pausar / estudar mais |
| Indicadores financeiros | `indices*` (~18) | Sem modulo completo | `backend/routes/indices_financeiros_routes.py` | Critico | Medio | Pausar |
| Autenticacao / login | `login`, `signup`, `forgot`, `setup`, `carregarSessao` | Sem modulo completo | `backend/routes/auth_routes.py`, `backend/security/*` | Critico | Muito alto | Pausar |

## 8. Analise especifica dos exemplos citados pelo usuario

### Agenda
- Presenca no `app.js`: muito alta.
- Arquivo proprio em `frontend/js/modules`: nao.
- Risco: agenda com recorrencia, integracoes e calendario.
- Backend: `agenda_legado_routes.py` e `agenda_contatos_routes.py`.
- Conclusao: deve permanecer pausada por risco.

### Agenda de contatos
- Presenca no `app.js`: moderada.
- Arquivo proprio em `frontend/js/modules`: nao.
- Risco: adjacente a agenda, mas menor que o motor de recorrencia.
- Backend: `agenda_contatos_routes.py`.
- Conclusao: e o melhor candidato entre os exemplos citados para uma etapa documental mais profunda, ainda sem codigo.

### Ficha pessoal / Pacientes
- Presenca no `app.js`: alta.
- Arquivo proprio em `frontend/js/modules`: nao.
- Risco: dados clinicos, tenant, paciente, anamnese e tratamentos.
- Backend: `cadastros_routes.py`, `anamnese_routes.py`, `tratamentos_routes.py`.
- Conclusao: deve permanecer pausada por risco de tenant e exclusao/salvamento critico.

### Conta corrente
- Presenca no `app.js`: presente.
- Arquivo proprio em `frontend/js/modules`: nao.
- Risco: financeiro sensivel, lancamentos, exclusoes e saldos.
- Backend: `financeiro_routes.py`.
- Conclusao: deve permanecer pausada por risco financeiro.

### Fluxo de caixa / Financeiro
- Presenca no `app.js`: alta.
- Arquivo proprio em `frontend/js/modules`: nao.
- Risco: financeiro operacional, indices, dashboard, configuracao e relatorios.
- Backend: `financeiro_routes.py`, `indices_financeiros_routes.py`, `cenario_routes.py`.
- Conclusao: deve permanecer pausado por risco financeiro sensivel.

## 9. Modulos que devem ficar fora do proximo recorte por risco alto
Os modulos abaixo devem ficar fora do proximo recorte documental mais profundo:

- Autenticacao / login
- Usuarios / perfis / permissoes
- Financeiro operacional
- Conta corrente
- Fluxo de caixa
- Indicadores financeiros
- Agenda com recorrencia
- Pacientes / ficha
- Editor de textos
- Superadmin / plataforma
- Tratamentos / orcamentos
- Protéticos / controle protetico

Motivo:

- risco de tenant;
- risco de permissao;
- risco financeiro;
- risco de exclusao/salvamento critico;
- risco de integracao externa;
- risco de cursor/selecao/DOM rico;
- risco de impacto transversal no sistema inteiro.

## 10. Modulo recomendado para a proxima etapa documental
Modulo recomendado: `Agenda de contatos`.

## 11. Justificativa da recomendacao
`Agenda de contatos` e o melhor ponto de partida documental nesta reavaliacao porque:

- ainda esta concentrado em `frontend/app.js`;
- nao possui modulo completo proprio em `frontend/js/modules`;
- tem backend separado em `agenda_contatos_routes.py`;
- e menor que o motor principal de agenda;
- oferece impacto real na reducao do `app.js` sem exigir entrar de imediato no motor de recorrencia;
- permite documentar fronteiras antes de qualquer recorte mais perigoso.

## 12. Proxima subetapa recomendada
Fase 2 - Agenda de contatos - Subetapa 1 - Contrato funcional e fronteiras documentais

## 13. Onde testar futuramente quando houver alteracao real
Quando houver alteracao real, os pontos de validacao futuros devem ser estes:

- abrir `Agenda de contatos`;
- abrir `Agenda` e confirmar que a recorrencia nao foi afetada;
- abrir `Ficha pessoal / Pacientes`;
- abrir `Conta corrente`;
- abrir `Fluxo de caixa`;
- abrir `Relatorios`;
- abrir `Editor de textos`;
- abrir `Superadmin`;
- abrir `Usuarios`;
- confirmar console sem `ReferenceError`, `TypeError` ou regressao de abertura;
- confirmar que nenhuma permissao foi alterada;
- confirmar que os modulos pausados continuam pausados.

## 14. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nao houve correcao textual, acentuacao, label, placeholder, string visivel ou mojibake.

Se algum texto estranho ou acento incorreto aparecer nos arquivos lidos, ele deve ser tratado apenas como pendencia futura, sem correcao nesta etapa.

## 15. Registro para roadmap
- A reavaliacao documental dos modulos frontend sem modularizacao real foi concluida.
- A decisao do usuario de tratar todos os modulos como `core / comum` foi registrada.
- `Cadastros Gerais / Auxiliares` nao foi continuado nesta etapa.
- Nenhum codigo foi alterado.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- O proximo modulo recomendado e `Agenda de contatos`.
- A proxima subetapa recomendada e `Agenda de contatos - Subetapa 1 - Contrato funcional e fronteiras documentais`.

## 16. Commit seletivo obrigatorio
Se esta etapa permanecer restrita a este documento e, se necessario, ao roadmap, o commit deve ser seletivo.

Nao usar:

- `git add .`
- `git add docs/`
- qualquer forma de selecao ampla de arquivos

Usar apenas:

- `git add docs/fase_2_reavaliacao_modulos_frontend_sem_modularizacao.md`
- se alterado, `git add docs/11_roadmap_desenvolvimento.md`

Depois:

- `git commit -m "Reavalia modulos frontend sem modularizacao"`
- `git push`

## 17. Observacao final
Esta etapa e apenas uma reavaliacao documental.

Nenhum codigo foi alterado.
