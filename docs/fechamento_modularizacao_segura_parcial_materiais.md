# Fechamento da modularização segura parcial e conservadora do módulo Materiais

## 1. Objetivo
Registrar o fechamento documental da fase em que a modularização segura e conservadora do módulo Materiais foi concluída, com extração funcional mínima, delegação reversível de helper puro e sem qualquer alteração no fluxo sensível de vínculos, origem/herdado, backend ou banco.

## 2. Diretório real
`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Confirmação de fechamento documental
Este é um fechamento documental, sem alteração funcional, sem aplicação de patch, sem saneamento de dados, sem alteração de código e sem execução de escrita no banco.

## 4. Escopo deste fechamento
- Registrar o que foi modularizado com segurança
- Registrar o que permaneceu intencionalmente em `frontend/app.js`
- Consolidar a delegação mínima do helper puro `materiaisUniqueAuxDescricoes(arr)`
- Registrar a pendência separada dos vínculos legados de materiais
- Amarrar o estado final do contrato funcional e da regra de `Selecione...`

## 5. Fora de escopo
- Saneamento dos vínculos legados
- Limpeza de dados
- Alteração de backend, banco, schema, migrations ou endpoints
- Extração de blocos maiores do frontend
- Mudança de modal, cálculo, request, vinculação ou origem/herdado
- Execução de Git

## 6. Linha do tempo resumida da modularização de Materiais
1. Mapeamento monolítico do módulo Materiais
2. Namespace passivo em `frontend/js/modules/materiais.js`
3. Fronteiras e contratos do módulo
4. Consolidação do contrato funcional de Materiais / Procedimentos Genéricos / Intervenções
5. Subetapa backend com service de vínculos de materiais
6. Subetapa frontend de consumo de `origem` / `herdado`
7. Subetapa frontend de recomposição correta ao trocar Procedimento Genérico
8. Consolidação manual e checklist de regressão
9. Mapa de extração de funções
10. Retomada da modularização com foco em helpers puros
11. Subetapa funcional mínima de delegação do helper puro
12. Fechamento desta fase segura parcial/conservadora

## 7. Documentos de Materiais criados/analisados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_0_mapeamento_monolitico.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_1_namespace_passivo.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_2_fronteiras_contratos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\retomada_modularizacao_materiais_pos_consolidacao_vinculos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_mapa_extracao_funcoes_pos_vinculos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_funcional_minima_delegacao_helper_unique_aux.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\contrato_funcional_regras_materiais_genericos_intervencoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\consolidacao_validacao_manual_regras_materiais_genericos_intervencoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_origem_lista_materiais_troca_generico_intervencoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_arquitetura_origem_materiais_proprio_herdado.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_ampla_generico_selecione_materiais_residuais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\decisao_tecnica_saneamento_vinculos_legados_materiais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\validacao_manual_candidatos_saneamento_vinculos_legados_materiais.md`

## 8. Estado atual do módulo Materiais
O módulo Materiais chegou a um estado seguro parcial e conservador:
- o frontend ainda mantém o fluxo principal em `frontend/app.js`;
- o módulo `frontend/js/modules/materiais.js` já existe como namespace passivo com helper exportado;
- o backend de vínculos foi centralizado em `backend/services/vinculos_materiais.py`;
- a recomposição de materiais vinculados passou a respeitar `origem` e `herdado`;
- a troca de Procedimento Genérico foi preparada para preservar próprios e remover herdados antigos;
- a modularização segura possível foi concluída nesta fase, sem mover blocos de alto risco.

## 9. O que foi modularizado com segurança
O que foi modularizado nesta fase, com risco baixo e delegação reversível:
- o helper puro `materiaisUniqueAuxDescricoes(arr)` foi consolidado em `frontend/js/modules/materiais.js`;
- `frontend/app.js` passou a delegar para o helper do módulo quando disponível;
- o fallback local permaneceu preservado;
- a assinatura e o resultado da função permaneceram equivalentes.

## 10. O que ficou intencionalmente no `frontend/app.js`
Permaneceram no `frontend/app.js`, por serem blocos sensíveis, acoplados ou de risco alto:
- renderização de Materiais;
- carregamento assíncrono;
- modais de Materiais;
- cálculo financeiro;
- binds e eventos;
- fluxo de salvar;
- recomposição de vínculos;
- tratamento de `origem` / `herdado`;
- lógica ligada a Intervenções / Procedimentos e Procedimentos Genéricos.

## 11. Justificativa para não extrair blocos maiores
Os blocos maiores ficaram no `app.js` porque ainda possuem dependência forte de DOM, estado global, requests, modais, fluxo de salvar, vínculos e contrato funcional recém-estabilizado. Extrair mais agressivamente nesta fase aumentaria o risco de regressão sobre a regra de `Selecione...`, a preservação de próprios e o manejo de herdados.

## 12. Subetapa funcional mínima executada
A subetapa funcional mínima foi a delegação do helper puro `materiaisUniqueAuxDescricoes(arr)` para `frontend/js/modules/materiais.js`, com fallback local preservado e sem impacto no fluxo visual ou funcional.

## 13. Helper consolidado/delegado
`materiaisUniqueAuxDescricoes(arr)`

## 14. Como a delegação foi feita
`frontend/app.js` passou a procurar o helper em `window.BranaMateriaisModule.helpers.materiaisUniqueAuxDescricoes` quando disponível e, se não estiver disponível, mantém a implementação local/fallback original.

## 15. Confirmação de que a delegação foi mínima e reversível
Confirmado. A mudança foi limitada a um helper puro, com fallback local intacto, sem tocar em modal, cálculo, request, backend, vínculos ou origem/herdado.

## 16. Confirmação de que não houve alteração em backend, banco, endpoints, schema, migrations, vínculos, origem/herdado, modal, cálculo, requests e strings visíveis
Confirmado. Nada disso foi alterado nesta fase.

## 17. Estado do contrato funcional de vínculos
O contrato funcional permanece como fonte da verdade:
- materiais próprios da intervenção atual devem ser preservados;
- materiais herdados devem vir do Procedimento Genérico atualmente selecionado;
- a deduplicação é por `material_id`;
- em conflito, o próprio vence;
- lista vazia é resposta válida.

## 18. Regra atual consolidada para Procedimento Genérico e Intervenções
Regra consolidada:
- a lista final deve ser `próprios da Intervenção atual + herdados do Procedimento Genérico atual`;
- ao trocar o genérico, herdados antigos devem sair;
- ao escolher um genérico sem materiais, a herdada nova é vazia;
- ao salvar com `Selecione...`, `procedimento_generico_id` deve ficar nulo;
- materiais próprios reais permanecem; materiais herdados antigos não.

## 19. Regra nova documentada para a combo Procedimento Genérico em `Selecione...`
Quando a combo está em `Selecione...`:
- `procedimento_generico_id` deve ser tratado como `null`/vazio;
- nenhum material herdado deve ser carregado;
- a visualização deve remover herdados antigos;
- permanecem somente materiais próprios reais;
- se não houver próprios, a grade fica vazia;
- ao trocar de `Selecione...` para outro genérico, a composição volta a ser próprios atuais + herdados do novo genérico.

## 20. Registro da pendência dos vínculos legados
Os vínculos legados de materiais continuam pendentes de saneamento separado. Eles foram identificados como problema de dados e de origem histórica, não como falha da modularização em si.

## 21. Explicação clara da pendência
Os vínculos legados são um problema de dados/saneamento, não um problema de modularização. A modularização segura foi a parte possível de ser concluída nesta fase; a limpeza ou reclassificação de vínculos materializados permanece como uma fase futura separada, com backup, validação e confirmação explícita do usuário.

## 22. Documentos e auditorias que sustentam o fechamento
- Contrato funcional consolidado
- Auditorias de origem e arquitetura dos vínculos
- Subetapas 1, 2 e 3 da refatoração
- Consolidação manual e checklist obrigatório
- Auditoria ampla de `Selecione...`
- Decisão técnica de saneamento
- Validação manual dos candidatos

## 23. Riscos preservados
- materiais herdados antigos continuam presentes no banco como legado;
- o fallback conservador ainda existe para registros sem origem confiável;
- a limpeza de dados não foi realizada;
- uma correção de dados futura sem backup pode apagar material próprio real;
- o saneamento não faz parte da modularização concluída nesta fase.

## 24. Próxima etapa recomendada
Não iniciar nova correção funcional imediata. Se houver avanço, ele deve ser separado em uma fase própria para saneamento controlado dos vínculos legados, somente depois de confirmação explícita do usuário e com plano de backup e rollback.

## 25. Confirmação final
A modularização segura parcial/conservadora do módulo Materiais foi concluída nesta fase. O que restou fora dela é a pendência de dados legados, que deve seguir como tema separado de saneamento, não como continuação da modularização.

