# Recomendacao documental do proximo modulo apos Materiais

## 1. Objetivo
Analisar o estado atual do projeto apos o fechamento de Materiais, comparar os candidatos ainda concentrados em `frontend/app.js` e recomendar apenas um proximo modulo mais seguro para a proxima rodada de modularizacao.

## 2. Diretorio real
`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Branch atual
`modularizacao-segura-fase-1`

## 4. Ultimo commit confirmado
`a18cb48 - Conclui modularizacao segura parcial de materiais`

## 5. Confirmacao de analise documental
Esta e uma analise documental, sem alteracao funcional, sem commit, sem push, sem escrita em banco e sem modificacao de arquivos.

## 6. Escopo
- Avaliar o estado do `frontend/app.js` apos o fechamento de Materiais
- Comparar candidatos ainda grandes ou relevantes
- Medir risco tecnico, dependencias e fronteiras
- Escolher apenas um proximo modulo mais seguro
- Registrar a proxima subetapa recomendada sem alterar nada

## 7. Fora de escopo
- Alterar codigo
- Alterar `frontend/app.js`
- Alterar `frontend/index.html`
- Criar arquivo em `frontend/js/modules`
- Alterar backend, banco, models, routes ou services
- Alterar documentacao existente
- Corrigir texto
- Apagar, mover ou renomear arquivos
- Executar `git add`, `git commit`, `git push`, `git restore`, `git clean`, `git reset` ou `git stash`
- Rodar servidor
- Executar SQL, seed, importacao ou exportacao nova

## 8. Comandos de leitura executados
- `git branch --show-current`
- `git status --short`
- `git log --oneline -8`
- `git diff --stat`
- `git diff --cached --stat`
- `dir frontend\\js\\modules`
- `dir backend\\models`
- `dir backend\\routes`
- `dir backend\\services`
- `findstr /n /i "function proc procAbrir abrirProcedimentos Intervenções Procedimentos procedimentos_routes ProcedimentoTabela ProcedimentoGenerico" frontend\\app.js`
- `findstr /n /i "procedimento Procedimento ProcedimentoTabela procedimento_tabela generico material vinculo salvar atualizar detalhar aplicar_heranca" backend\\routes\\procedimentos_routes.py backend\\models\\procedimento.py backend\\models\\procedimento_tabela.py backend\\models\\procedimento_generico.py backend\\services\\vinculos_materiais.py`
- leitura de `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- leitura de `docs/fechamento_modularizacao_segura_parcial_materiais.md`
- leitura de `docs/plano_isolamento_pendencias_anamnese_restauracao.md`
- leitura de `docs/auditoria_pendencias_pos_commit_materiais.md`
- leitura de `docs/revisao_humana_md_anamnese_pendentes.md`
- leitura de `docs/recomendacao_proximo_modulo_pos_simbolos_graficos.md`
- leitura de `docs/recomendacao_proximo_modulo_pos_convenios_planos.md`
- leitura de `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md`
- leitura de `docs/recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md`

## 9. Estado do `git status --short` analisado
O status real analisado no inicio desta etapa mostrava `46` arquivos `??` untracked. Depois da criacao deste proprio documento, o working tree passa a `47` arquivos `??` untracked.

## 10. Estado do `git diff --stat`
Sem diferencas no tracked tree no momento da analise.

## 11. Estado do `git diff --cached --stat`
Sem arquivos staged no momento da analise.

## 12. Resumo do fechamento de Materiais
Materiais foi fechado documentalmente como modularizacao segura parcial/conservadora. O helper puro foi delegado de forma reversivel, o backend de vinculos ficou centralizado no service, e a pendencia dos vinculos legados ficou separada como problema de dados, nao como parte da modularizacao.

## 13. Resumo do isolamento das pendencias de Anamnese/restauracao
Os pendentes foram separados em documentos de Anamnese, restauracao, recomendacoes, mojibake e artefatos brutos. O isolamento documental deixou claro o que deve ficar fora do proximo commit e o que pode virar commit futuro separado.

## 14. Lista de candidatos avaliados
- Intervencoes / Procedimentos
- Prestadores
- Convenios e Planos
- Simbolos Graficos
- Agenda
- Editor de Textos
- Financeiro / Conta corrente / Cenário financeiro / custos
- Ficha pessoal / ficha clinica / paciente
- Anamnese

## 15. Tabela comparativa dos candidatos
| modulo | fronteira | tamanho estimado | acoplamento | risco | beneficio | recomendacao |
|---|---|---:|---|---|---|---|
| Intervencoes / Procedimentos | clara, com prefixo `proc*`, tela unica de configuracao de tabelas/procedimentos | alto | alto com materiais, genericos, tabelas, vinculos e financeiro | alto/moderado | alto, porque e a fronteira mais logica depois de Materiais | **escolhido, mas somente em Subetapa 0 documental** |
| Prestadores | clara, porem ciclo ja foi documentado e encerrado | medio | medio com convenios, agenda e perfis | medio | baixo neste momento, pois nao e o foco da rodada atual | fora da rodada / ciclo encerrado |
| Convenios e Planos | clara, mas ciclo ja foi documentado e encerrado | medio/alto | medio com ficha, agenda e faturamento | medio/alto | baixo neste momento | fora da rodada / ciclo encerrado |
| Simbolos Graficos | clara, porem ciclo ja foi documentado e encerrado | medio | medio com procedimentos e preview | medio/alto | baixo neste momento | fora da rodada / ciclo encerrado |
| Agenda | fragmentada e muito espalhada | alto | muito alto com paciente, prestador, unidade e integracoes | alto | pequeno | adiar |
| Editor de Textos | ampla e complexa | muito alto | muito alto com documentos, html e ferramentas | alto | pequeno | adiar |
| Financeiro / Conta corrente / Cenário financeiro | acoplamento muito sensivel | muito alto | muito alto com lancamentos, custos e calculos | muito alto | pequeno | adiar |
| Ficha pessoal / ficha clinica / paciente | muito ampla e clinica-central | muito alto | muito alto com dados clinicos e agenda | muito alto | pequeno | adiar |
| Anamnese | modularizacoes e pendencias documentais em andamento | medio | medio com questionarios, texto e recuperacao | medio | baixo neste momento por pendencias sensiveis isoladas | adiar |

## 16. Analise de Intervencoes / Procedimentos

### Nome funcional no sistema
Configurações > Tabelas > Intervenções / Procedimentos...

### Nome tecnico provavel no frontend
Bloco `proc*` no `frontend/app.js`, com tabela principal, editor, modal de tabelas e vinculos de materiais.

### Prefixo de funcoes
`proc*`

### Rota backend principal
`backend/routes/procedimentos_routes.py`

### Models relacionados
- `backend/models/procedimento.py`
- `backend/models/procedimento_tabela.py`
- `backend/models/procedimento_generico.py`

### Services relacionados
- `backend/services/vinculos_materiais.py`

### Dependencias com Materiais e Procedimentos Genéricos
- usa `procComporMateriaisEditorPorGenerico`
- usa `procAtualizarMateriaisEditorVisualizacao`
- usa `procRecarregarLinks`
- usa `procSalvar`
- usa `procAbrirEditor`
- usa `procRenderLinks`
- usa o combo de Procedimento Genérico
- conversa diretamente com materiais proprios/herdados
- usa `procedimento_generico_id` no editor e no save

### Riscos
- muitos eventos e binds
- tabela principal grande
- modal de tabela de procedimentos
- modal/fluxo de vinculos de materiais
- snapshot e recomposicao visual
- calculo financeiro e atualizacao de custos
- risco de mexer cedo em comportamento clinico e financeiro

### Beneficios
- fronteira funcional clara
- contexto tecnico recente de Materiais ainda esta fresco
- existe relacao natural com o service de vinculos
- possui prefixo coerente e dominio bem definido

### Decisao
E o melhor proximo candidato entre os que ainda estao realmente concentrados no `frontend/app.js`, mas deve comecar somente por Subetapa 0 documental.

## 17. Módulo recomendado como próximo
**Intervencoes / Procedimentos**

## 18. Justificativa curta
Entre os candidatos restantes, e o modulo com fronteira mais identificavel e com contexto tecnico mais fresco depois de Materiais e Procedimentos Genéricos. Os demais candidatos relevantes estao ou ja encerrados, ou sao mais sensiveis, mais amplos ou mais arriscados.

## 19. Módulos descartados por risco
- Agenda
- Editor de Textos
- Financeiro / Conta corrente / Cenário financeiro
- Ficha pessoal / ficha clinica / paciente
- Anamnese, por ainda ter pendencias documentais e artefatos sensiveis isolados

## 20. Próxima subetapa recomendada
Subetapa 0 documental de Intervencoes / Procedimentos:
- mapear o monolito
- identificar fronteiras
- localizar funcoes candidatas
- classificar risco
- nao mover codigo ainda

## 21. Se a recomendacao for Intervencoes / Procedimentos
- recomendar apenas Subetapa 0 documental
- nao recomendar extracao funcional imediata
- nao criar namespace ainda sem mapeamento

## 22. Confirmacao de ausencia de alteracoes de codigo
Nenhum codigo foi alterado.

## 23. Confirmacao de ausencia de alteracoes em frontend/app.js
`frontend/app.js` nao foi alterado.

## 24. Confirmacao de ausencia de alteracoes em frontend/index.html
`frontend/index.html` nao foi alterado.

## 25. Confirmacao de ausencia de alteracoes em frontend/js/modules
`frontend/js/modules` nao foi alterado.

## 26. Confirmacao de ausencia de alteracoes em backend
Backend nao foi alterado.

## 27. Confirmacao de ausencia de alteracoes em banco
Banco nao foi alterado.

## 28. Confirmacao de ausencia de git add
Nenhum `git add` foi executado.

## 29. Confirmacao de ausencia de commit
Nenhum `git commit` foi executado.

## 30. Confirmacao de ausencia de push
Nenhum `git push` foi executado.

## 31. Confirmacao de ausencia de alteracao em pendentes
Nenhum arquivo pendente foi apagado, movido ou renomeado.

## 32. Confirmacao de isolamento de diretorio
Nada foi criado, editado, salvo ou documentado fora de `D:\BRANA ARQUIVOS\BRANA CLOUD`.

## 33. Confirmacao de isolamento do legado
Nada foi criado, editado, salvo ou documentado em `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO`.

## 34. Confirmacao de isolamento do outro projeto
Nada foi criado, editado, salvo ou documentado em `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO`.

## 35. Confirmacao da blindagem textual/mojibake
A blindagem textual/mojibake foi respeitada; nenhum texto dos documentos analisados foi corrigido ou alterado.

## 36. Observacao sobre checks
Esta etapa e documental; checks de codigo nao se aplicam.
