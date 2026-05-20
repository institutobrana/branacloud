# Planejamento da Subetapa 3A - Sanitizacao de Procedimentos Genericos

## Objetivo
Planejar a futura sanitizacao dos seeds de procedimentos genericos para novas contas/clinicas, inclusive DEMO/trial de 7 dias, de modo que nascam apenas com codigo, descricao e campos tecnicos obrigatorios do schema.

## Contratos seguidos
- [Contrato funcional dos seeds](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/contrato_seeds_novas_contas_minimos_nome_codigo.md)
- [Auditoria dos seeds](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/auditoria_seeds_novas_contas_procedimentos_materiais.md)
- [Documento da Subetapa 1A](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/seeds_procedimentos_subetapa_1a_sanitizacao_nome_codigo.md)
- [Documento da Subetapa 2A](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/seeds_materiais_subetapa_2a_sanitizacao_nome_codigo.md)
- [Planejamento da Subetapa 2A](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/seeds_materiais_subetapa_2a_planejamento_sanitizacao_nome_codigo.md)
- [Contrato funcional sobre vinculos/material/genericos/intervencoes](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/contrato_funcional_regras_materiais_genericos_intervencoes.md)
- [Blindagem textual/mojibake](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/regras_blindagem_correcoes_textuais_mojibake.md)

## Arquivos analisados
- `backend/seeds/procedimentos_genericos.py`
- `backend/services/signup_service.py`
- `backend/routes/cadastros_routes.py`
- `backend/routes/procedimentos_routes.py`
- `backend/services/procedimentos_legado_service.py`
- `backend/models/procedimento_generico.py`
- `backend/models/procedimento.py`
- `backend/models/material.py`
- `backend/services/vinculos_materiais.py`

## Fluxo atual de criacao em novas contas
- `criar_conta_saas()` chama `seed_procedimentos_genericos(db, clinica.id)`.
- A origem real dos dados e a lista estatica `PROCEDIMENTOS_GENERICOS_PADRAO` em `backend/seeds/procedimentos_genericos.py`.
- O ponto real de persistencia para o nascimento da conta e `seed_procedimentos_genericos(db, clinica_id)`.

## Origem real dos dados
- Lista estatica `PROCEDIMENTOS_GENERICOS_PADRAO` no proprio `backend/seeds/procedimentos_genericos.py`.
- Nao foi identificado fluxo de birth com dados hospedados, CSV, clinica modelo ou fallback separado fora desse seed para o nascimento das novas contas.

## Ponto real de persistencia
- `seed_procedimentos_genericos(db, clinica_id)` em `backend/seeds/procedimentos_genericos.py`.
- Este e o menor ponto seguro para a futura implementacao da Subetapa 3A.

## Campos obrigatorios
Conforme o schema, precisam permanecer:
- `codigo`
- `descricao`
- `clinica_id`
- campos tecnicos obrigatorios com default/constraint do modelo

## Campos que podem ser zerados, nulificados ou omitidos
- `tempo`
- `custo_lab`
- `peso`
- `especialidade`
- `simbolo_grafico`
- `observacoes`
- `data_inclusao`
- `data_alteracao`
- `mostrar_simbolo`
- `inativo`
- qualquer campo financeiro ou tecnico nao obrigatorio

## Campos que precisam permanecer
- `codigo`
- `descricao`
- `clinica_id`
- qualquer campo realmente obrigatorio por `NOT NULL`, FK, constraint ou default necessario para inserir e listar sem erro

## Vinculos, fases e heranca no nascimento
- Nao foram identificadas insercoes automaticas em `procedimento_generico_material` no birth flow.
- Nao foram identificadas insercoes automaticas em `procedimento_generico_fase` no birth flow.
- Nao foi identificado nascimento com composicoes prontas ou heranca pronta.
- A heranca e a sincronizacao posterior aparecem em rotinas manuais e de harmonizacao, nao no nascimento da conta.

## Menor ponto seguro de alteracao futura
- `backend/seeds/procedimentos_genericos.py`
- A sanitizacao no payload montado por `seed_procedimentos_genericos()` e suficiente para o nascimento de novas contas.

## Necessidade de alterar backend/seeds/procedimentos_genericos.py
- Sim.
- E o arquivo correto para a Subetapa 3A.
- Nao ha indicacao de que seja preciso alterar amplamente outros arquivos para o birth flow.

## Necessidade de alterar backend/services/signup_service.py
- Nao para esta Subetapa 3A.
- O signup apenas consome o seed; nao reintroduz campos no fluxo de nascimento observado.

## Subetapa 3B separada para vinculos/fases/composicoes
- Nao parece obrigatoria para o birth flow.
- So faria sentido se o objetivo posterior for endurecer tambem os caminhos manuais/legados de vinculos, fases, composicoes ou heranca.

## Riscos relacionados ao contrato de vinculos
- Alterar apenas o seed de procedimentos genericos nao deve quebrar o contrato de vinculos ja documentado.
- O risco funcional principal e que telas, calculos ou rotinas posteriores passem a exibir zero/ vazio ate o usuario preencher manualmente.
- Como os caminhos manuais nao foram alterados, os vinculos existentes em clinicas atuais permanecem fora desta etapa.

## Plano recomendado para a futura Subetapa 3A de implementacao
1. Sanitizar somente `backend/seeds/procedimentos_genericos.py`.
2. Preservar `codigo`, `descricao`, `clinica_id` e os campos tecnicos obrigatorios do schema.
3. Nulificar ou zerar os campos nao obrigatorios no payload de persistencia.
4. Nao tocar em rotas, models, schemas, frontend ou dados existentes.
5. Validar com `python -m py_compile backend/seeds/procedimentos_genericos.py`.
6. Testar depois em ambiente seguro criando uma nova conta/clincia de teste.

## Sequencia recomendada das proximas subetapas
- Subetapa 3A: sanitizar procedimentos genericos.
- Subetapa 3B: se necessario, endurecer caminhos manuais de vinculos de genericos.
- Subetapa 3C: se necessario, endurecer fases genericas.
- Subetapa 3D: validar eventual heranca para procedimentos normais.

## Checks executados
- `git branch --show-current`
- `git status --short` antes da criacao deste documento
- `git diff --stat` antes da criacao deste documento
- leitura dos arquivos e contratos listados acima

## Onde testar depois da implementacao futura
1. Criar nova conta/clincia de teste, inclusive DEMO/trial de 7 dias.
2. Abrir Procedimentos Genericos.
3. Confirmar que os genericos nasceram com codigo/descricao.
4. Confirmar que nao nasceram com tempo.
5. Confirmar que nao nasceram com custo/custo_lab.
6. Confirmar que nao nasceram com peso.
7. Confirmar que nao nasceram com simbolo grafico, especialidade ou observacoes, salvo se obrigatorios.
8. Confirmar que nao nasceram com materiais vinculados.
9. Confirmar que nao nasceram com fases vinculadas.
10. Confirmar que nao nasceram com composicoes/heranca pronta.
11. Editar manualmente um procedimento generico.
12. Informar valores manualmente.
13. Salvar.
14. Reabrir e confirmar persistencia.
15. Verificar Procedimentos para garantir que nao houve quebra por genrico sanitizado.
16. Verificar console do navegador sem erro.
17. Verificar backend sem erro.

## Arquivos alterados
- `backend/seeds/procedimentos_genericos.py`
- `docs/seeds_procedimentos_genericos_subetapa_3a_sanitizacao_nome_codigo.md`

## Justificativa tecnica
A lista estatica de procedimentos genericos continua sendo a fonte de verdade do birth flow, mas o payload de persistencia foi planejado para receber apenas os campos tecnicos obrigatorios e valores neutros nos campos nao obrigatorios. Isso evita que novas contas nascam com custos, peso, simbolos, observacoes ou herancas prontas.

## Confirmacoes finais de planejamento
- A alteracao vale para novas contas, inclusive DEMO/trial.
- Nao foram criados vinculos, fases ou composicoes nesta etapa.
- Nao houve alteracao de materiais, procedimentos, rotas manuais, frontend, banco ou dados existentes.
