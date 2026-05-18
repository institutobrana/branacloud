# Auditoria ampliada: stash, branches, remoto e fluxo de materiais vinculados em Intervencoes / Procedimentos

## 1. Objetivo da auditoria ampliada
Investigar, em modo read-only, se existe no Git, no reflog, em stashes, em branches ou em documentos locais algum registro de uma versao anterior em que o fluxo de materiais vinculados em Intervencoes / Procedimentos funcionava corretamente, especialmente quanto a:
- duplo clique em material vinculado;
- modal completo "Vincular material";
- alerta "Tabela de procedimentos nao encontrada.";
- heranca de materiais do Procedimento Generico;
- atualizacao da grade ao trocar a combo Procedimento Generico.

## 2. Diretorio real de trabalho
`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Confirmacao de que nenhum codigo foi alterado
Nenhum arquivo funcional foi alterado nesta auditoria. A atividade foi apenas de leitura, consulta de historico e registro documental.

## 4. Confirmacao de que nao houve checkout, reset, restore, stash apply, stash pop, commit, push, pull, merge ou rebase
Nao houve uso de nenhuma operacao Git de alteracao de estado. Apenas comandos de leitura foram executados.

## 5. Branch atual
`modularizacao-segura-fase-1`

## 6. Branches locais encontradas
- `main`
- `modularizacao-segura-fase-1`

## 7. Branches remotas encontradas
Refs remotos locais observadas:
- `remotes/origin/main`
- `remotes/origin/modularizacao-segura-fase-1`

## 8. Remotos configurados
- `origin https://github.com/institutobrana/branacloud.git (fetch)`
- `origin https://github.com/institutobrana/branacloud.git (push)`

## 9. Stashes encontrados
- `stash@{0}: On main: Pendencias backend restantes antes da modularizacao`
- `stash@{1}: On main: Pendencias backend e docs antes da nova modularizacao`

## 10. Resumo de cada stash analisado
### stash@{0}
Contem alteracoes em `backend/routes/auth_routes.py`, `backend/routes/cadastros_routes.py`, `backend/routes/procedimentos_routes.py`, `backend/security/dependencies.py` e `backend/security/trial_middleware.py`. O stash mostra um conjunto grande de pendencias de backend e compatibilidade, incluindo ajustes de procedimentos, mas nao mostrou um historico claro de duplo clique abrindo modal completo para materiais vinculados.

### stash@{1}
Mostra o mesmo conjunto geral de arquivos e uma base semelhante de pendencias, com foco em backend e documentos. Tambem nao mostrou evidencias de um fluxo antigo de modal completo para edicao de vinculo por duplo clique.

## 11. Se algum stash contem alteracao relevante
Sim, os stashes contem alteracoes relevantes de backend e compatibilidade de procedimentos. Porem, nao encontrei neles a evidencia especifica de uma versao anterior completa do fluxo de materiais vinculados com modal completo no duplo clique.

## 12. Reflog analisado
O reflog local foi lido em modo read-only. Os marcos mais utilies foram:
- `2ee1e94` como HEAD atual observado;
- `38dae94` como entrada intermediaria recente;
- `f3cab35` como checkout historico de `main` para a branch modular;
- `1dc8b18` como etapa anterior;
- `c132c45` como commit inicial.

## 13. Eventos relevantes no reflog
- existe uma transicao historica de `main` para a branch modular;
- o HEAD atual segue em `2ee1e94`;
- nao apareceu no reflog um evento claro indicando uma restauracao antiga do modal completo de materiais vinculados.

## 14. Commits/refs analisados
- `c132c45`
- `1dc8b18`
- `f3cab35`
- `26dc1b9`
- `2ee1e94`
- `38dae94`
- `1daee32`
- `5513312`
- `faacccd`
- `21d5115`
- `49d1e41`
- `c5836ac`
- `b21da88`
- `fcc6b57`
- `18b25aa`
- `1f7ed77`
- `38bfc8a`
- `59da421`
- `8a1b799`
- `39330d3`
- `b415b5c`
- `ab102c8`
- `91b65e9`
- `45419a5`
- `795c664`
- `6b2ae0e`
- `7ea7c65`
- `eda2e54`
- `03f6556`
- `36d9539`
- `fd5129d`
- `e5a04fc`
- `46f49b9`

## 15. Arquivos locais/documentos encontrados com pistas
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_git_fluxo_materiais_vinculados_intervencoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_alerta_tabela_procedimentos_nao_encontrada_vinculo_material.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\registro_pendente_heranca_materiais_procedimento_generico_para_procedimento.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_regra_heranca_materiais_generico_para_procedimento.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_backend_heranca_materiais_generico_get_procedimento.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_frontend_combo_generico_atualiza_materiais_vinculados.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\frontend_auditoria_appjs.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_0_mapeamento_monolitico.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_2_fronteiras_contratos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_6_consolidacao_pos_integracao.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\procedimentos_genericos_subetapa_0_mapeamento_monolitico.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\procedimentos_genericos_subetapa_2_fronteiras_contratos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\procedimentos_genericos_correcao_valores_monetarios_dependencias.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\procedimentos_genericos_subetapa_5a_auditoria_payload_pgenpayloadfromstate.md`

## 16. Resultado da busca por "Tabela de procedimentos nao encontrada"
A string existe no codigo e foi localizada em `backend/routes/procedimentos_routes.py`, no helper `_load_tabela_or_404`. O alerta nasce do backend quando a tabela de procedimentos nao e resolvida para o fluxo atual.

## 17. Resultado da busca por "Informe a nova quantidade"
A string existe em `frontend/app.js`, no fluxo de `procEditarVinculoSelecionado()`. O duplo clique na grade de materiais vinculados chama essa funcao e, no historico acessivel, o comportamento e de prompt simples, nao de modal completo.

## 18. Resultado da busca por "Vincular material"
A expressao existe no fluxo de abertura do modal de vinculo para adicionar material. Contudo, nao encontrei no historico Git/stash/reflog acessivel evidencia de uma versao antiga em que o duplo clique em item vinculado abrisse esse modal completo como comportamento padrao.

## 19. Resultado da busca por "procEditarVinculoSelecionado"
A funcao aparece em `frontend/app.js` e e o ponto que hoje abre o prompt de quantidade. Nao foi encontrado um ponto historico claro, em commit ou stash, em que ela abrisse o modal completo de edicao.

## 20. Resultado da busca por "procConfirmarVinculo"
A funcao aparece no fluxo de adicao de vinculo e continua relacionada ao modal de inserir material. Ela nao mostrou, nas referencias analisadas, uma versao historica que resolva o duplo clique com modal completo.

## 21. Resultado da busca por "procRenderLinks"
A funcao foi encontrada como parte do fluxo de renderizacao da grade de materiais vinculados. A recomposicao recente da lista apoia a heranca de materiais, mas nao revelou um estado historico antigo de modal completo no duplo clique.

## 22. Resultado da busca por "procVincula"
A busca apontou para o conjunto do editor de procedimento/intervencao e para o fluxo de vinculos de materiais. O que apareceu de forma consistente foi o editor atual com prompt de quantidade na edicao, nao um modal completo recuperado do passado.

## 23. Resultado da busca por "materiais_vinculados"
A expressao aparece em frontend, backend e documentos. O backend atual passou a compor `materiais_vinculados` em memoria ao detalhar o procedimento, mas antes disso o retorno era mais restrito aos materiais diretos.

## 24. Resultado da busca por "procedimento_generico_id"
A expressao aparece em frontend, backend e documentos. O estado atual usa esse campo para compor materiais herdados do Procedimento Generico e para alimentar a atualizacao da lista quando a combo muda.

## 25. Resultado da busca por "_load_tabela_or_404"
O helper foi localizado em `backend/routes/procedimentos_routes.py` e e a origem direta do alerta de tabela nao encontrada no fluxo de material vinculado.

## 26. Se foi encontrado algum ponto em que o duplo clique abria modal completo
Nao. Nao encontrei evidencia confiavel, no Git/stash/reflog analisados, de uma versao historica em que o duplo clique em material vinculado abrisse o modal completo "Vincular material".

## 27. Se foi encontrado algum ponto em que o alerta de tabela estava corrigido
Nao encontrei evidencias historicas de uma correcao antiga ja consolidada. O alerta segue ligado ao helper `_load_tabela_or_404` e continua presente nos trechos historicos analisados.

## 28. Se foi encontrado algum ponto em que a heranca de materiais estava completa
A heranca completa apareceu no working tree atual, com composicao em memoria no backend e recomposicao no frontend, mas nao como um commit antigo claramente recuperado do historico principal.

## 29. Se foi encontrado algum ponto funcional nao commitado em stash/reflog
Nao encontrei ponto funcional nao commitado que mostre claramente o fluxo completo ideal com modal completo, sem alerta de tabela, e com heranca total mais duplo clique restaurado.

## 30. Hipotese final: onde provavelmente estava a correcao que o usuario lembra
A melhor hipotese e que o usuario lembra de uma combinacao de correcoes mais recentes e/ou locais do working tree atual, nao de um commit antigo plenamente recuperavel. A parte de heranca de materiais esta claramente refletida no estado atual, mas o duplo clique com modal completo nao apareceu no historico acessivel.

## 31. Se nao encontrou, dizer claramente que nao encontrou evidencia no Git/stash/branches analisados
Nao encontrei evidencia suficiente, no Git/stash/branches/reflog analisados, de uma versao anterior plenamente funcional que una:
- duplo clique abrindo modal completo;
- ausencia do alerta de tabela;
- heranca completa de materiais;
- troca da combo atualizando a grade imediatamente.

## 32. Proximo local recomendado para procurar, se nao encontrou
Se a versao correta existir, o proximo lugar mais provavel para procurar e algum backup local fora do historico Git principal, inclusive arquivos temporarios, exports, copias manuais ou pacotes de trabalho antigos dentro de `D:\BRANA ARQUIVOS\BRANA CLOUD`. Como esta auditoria foi apenas read-only, nao houve tentativa de restaura ao vivo.

## 33. Plano seguro de reconstrucao caso a versao correta nao seja encontrada
1. Manter o alerta de tabela como prioridade de validacao no backend.
2. Preservar a composicao de materiais herdados no `GET /procedimentos/{id}`.
3. Decidir separadamente se o duplo clique deve permanecer como prompt simples ou migrar para modal completo.
4. Evitar restaurar codigo antigo sem adaptar o contrato atual de materiais_vinculados.

## 34. Riscos de continuar corrigindo sem contrato funcional completo
- reintroduzir duplicidade de materiais;
- perder materiais proprios do procedimento;
- contaminar o Procedimento Generico;
- mascarar o erro de tabela nao encontrada;
- alterar custo ou quantidade sem contexto confiavel;
- regressao no fluxo de salvar e reabrir.

## 35. Recomendacao objetiva para a proxima etapa
Antes de qualquer nova mudanca funcional, fechar um contrato minimo de fluxo para o editor de materiais vinculados: origem da tabela, comportamento do duplo clique e atualizacao imediata da grade ao trocar o Procedimento Generico.
