# Retomada da modularizacao de Materiais apos consolidacao dos vinculos

## 1. Titulo

Retomada documental da modularizacao do modulo Materiais apos a consolidacao do fluxo de vinculos entre Materiais, Procedimentos Genericos e Intervencoes / Procedimentos.

## 2. Objetivo

Registrar o ponto exato em que a modularizacao de Materiais foi interrompida, consolidar o estado atual dos arquivos relacionados e definir a proxima subetapa segura sem alterar comportamento.

## 3. Diretorio real

`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 4. Confirmacao de que e retomada documental, sem alteracao funcional

Esta etapa e somente documental. Nenhum codigo funcional foi alterado.

## 5. Escopo

- Registrar o estado atual da modularizacao de Materiais.
- Identificar o que ja saiu do monolito e o que ainda permanece em `frontend/app.js`.
- Relacionar o modulo Materiais com Procedimentos Genericos, Intervencoes / Procedimentos e o service backend de vinculos.
- Referenciar o checklist obrigatorio de regressao para futuras alteracoes.
- Indicar a proxima subetapa mais segura, ainda sem executar qualquer refatoracao.

## 6. Fora de escopo

- Modularizar ainda.
- Mover helpers.
- Alterar `frontend/app.js`.
- Alterar `frontend/index.html`.
- Alterar `frontend/js/modules`.
- Alterar backend, banco, endpoints, schema, migrations ou CSS.
- Corrigir textos, labels, acentos ou mojibake.
- Executar Git ou rodar servidor.

## 7. Documentos analisados

- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\regras_blindagem_correcoes_textuais_mojibake.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_0_mapeamento_monolitico.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_1_namespace_passivo.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_2_fronteiras_contratos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\contrato_funcional_regras_materiais_genericos_intervencoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_origem_lista_materiais_troca_generico_intervencoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_arquitetura_origem_materiais_proprio_herdado.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_backend_subetapa_1_service_vinculos_materiais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_frontend_subetapa_2_consumo_origem_materiais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_frontend_subetapa_3_troca_generico_recompoe_materiais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\consolidacao_validacao_manual_regras_materiais_genericos_intervencoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_frontend_combo_generico_atualiza_materiais_vinculados.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_contaminacao_material_local_entre_intervencoes_mesmo_generico.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_backend_heranca_materiais_generico_get_procedimento.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_definitiva_pgen_falha_gravar_materiais.md`

## 8. Arquivos consultados somente em leitura

- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\index.html`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\procedimentos-genericos.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\services\vinculos_materiais.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\cadastros_routes.py`

## 9. Estado atual da modularizacao de Materiais

O modulo Materiais esta em estado hibrido:

- existe um namespace passivo em `frontend/js/modules/materiais.js`;
- existe um helper utilitario isolado fora do monolito;
- `frontend/app.js` continua concentrando o fluxo funcional principal de Materiais;
- o backend de vinculos de materiais foi centralizado em service propio;
- a modularizacao ainda nao foi concluida, mas o contrato funcional ja esta estabilizado.

## 10. Arquivos ja existentes relacionados a Materiais

- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\index.html`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\services\vinculos_materiais.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\cadastros_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_0_mapeamento_monolitico.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_1_namespace_passivo.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_2_fronteiras_contratos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_3_helper_unique_aux_descricoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_4_consolidacao_pos_helper.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_5_integracao_helper_unique_aux_descricoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_6_consolidacao_pos_integracao.md`

## 11. Funcoes/trechos de Materiais localizados em frontend/app.js

Os trechos e funcoes de Materiais ainda presentes em `frontend/app.js` incluem:

- `materiaisListaIdAtual`
- `materiaisListaAtual`
- `materiaisSetTotal`
- `materiaisSelecionar`
- `materiaisSelecionadoAtual`
- `materiaisLimparTabela`
- `materiaisRender`
- `materiaisFiltroClassificacaoAtual`
- `materiaisSetSelectValue`
- `materiaisUniqueAuxDescricoes`
- `materiaisCarregarAuxTipo`
- `materiaisCarregarFiltroClassificacao`
- `materiaisCarregarCombosModal`
- `materiaisCarregarIndicesTabela`
- `materiaisCarregarListas`
- `materiaisSetModalTab`
- `materiaisAbrir`
- `materiaisFecharModal`
- `materiaisAbrirModal`
- `materiaisSalvarModal`
- `materiaisCalcularCustoModal`
- `materiaisCriarTabela`
- `materiaisAlterarTabela`
- `materiaisExcluirTabela`
- `materiaisExcluirSelecionado`
- `materiaisTabelaSalvarModal`
- binds de eventos e inicializacao de tela de Materiais

Observacao: o monolito ainda concentra DOM, eventos, fetch/requestJson, modais, selecao de linha, calculos e payloads.

## 12. Funcoes/trechos de Materiais localizados em frontend/js/modules/materiais.js

O arquivo de modulo atualmente e passivo e expõe:

- `meta`
- `nome`
- `modulo`
- `versaoSubetapa`
- `status`
- `ativo`
- `controlaFluxo`
- `descricao`
- `riscosPreservados`
- `dependenciasDocumentais`
- `helpersCandidatosFuturos`
- `materiaisUniqueAuxDescricoes(arr)`
- `helpers.materiaisUniqueAuxDescricoes`
- `getInfo()`
- `info()`

Este arquivo nao contem DOM, eventos, fetch, requestJson, renderizacao nem alteracao de backend.

## 13. Relacao entre Materiais e Procedimentos Genericos

- Materiais vinculados ao Procedimento Generico alimentam a heranca visual e funcional nas Intervencoes / Procedimentos.
- O backend de leitura hoje ja centraliza a composicao e marca origem confiavel.
- O frontend ja preserva `origem` e `herdado`.
- A troca de Procedimento Generico usa a regra de recomposicao validada.

## 14. Relacao entre Materiais e Intervencoes / Procedimentos

- A lista final deve ser composta por materiais proprios da intervencao atual + materiais herdados do generico selecionado.
- Materiais proprios locais permanecem somente na intervencao atual.
- Materiais herdados antigos devem sair quando o generico muda.
- Lista vazia e resposta valida.

## 15. Relacao com backend/services/vinculos_materiais.py

- O service centraliza a composicao dos vinculos de materiais.
- Ele separa proprios e herdados em leitura.
- Ele marca `origem` e `herdado`.
- Ele deduplica por `material_id`.
- Ele preserva o proprio em caso de conflito.

## 16. Pontos protegidos pelo contrato funcional

- nao remover `origem`
- nao remover `herdado`
- nao depender apenas de heuristica por comparacao estrutural
- nao usar lista visual anterior como fonte da verdade
- nao manter herdados antigos ao trocar generico
- nao interpretar lista vazia como "manter anterior"
- nao copiar material proprio/local entre intervencoes ou para o generico
- nao criar autosave na troca da combo

## 17. Pontos que nao podem ser alterados sem checklist

- `frontend/app.js`
- `backend/services/vinculos_materiais.py`
- `backend/routes/procedimentos_routes.py`
- fluxo de salvar
- duplo clique/modal
- lista de materiais da intervencao
- troca de Procedimento Generico
- deduplicacao por `material_id`

## 18. Riscos de continuar a modularizacao de Materiais sem respeitar o contrato

- Reintroduzir heranca por heuristica.
- Repetir contaminação entre intervencoes.
- Perder origem confiavel no JSON.
- Manter herdados antigos quando o generico muda.
- Quebrar o fluxo de salvar ou o modal de edicao.
- Alterar textos ou strings visiveis por acidente.

## 19. Proxima subetapa mais segura recomendada

A proxima subetapa mais segura e ainda documental, antes de qualquer nova movimentacao funcional, deve ser:

- consolidar um mapa de funcoes candidatas a extracao;
- separar o que e helper puro do que e fluxo de tela;
- classificar dependencias que ainda permanecem em `app.js`;
- definir uma ordem minima e segura para futura extracao sem quebrar o contrato.

## 20. Justificativa da proxima subetapa

A modularizacao de Materiais ainda depende de pontos criticos no monolito. Antes de mover qualquer funcao, e mais seguro registrar um inventario preciso do que pode sair primeiro e do que deve permanecer ate haver cobertura suficiente de regressao.

## 21. Arquivos que a proxima subetapa podera alterar

Somente se houver ordem explicita e checklist completo:

- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`

## 22. Arquivos que a proxima subetapa nao podera alterar

- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\index.html`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\services\vinculos_materiais.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\cadastros_routes.py`
- banco, schema, migrations, CSS e endpoints novos

## 23. Checks recomendados para a proxima subetapa

- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\procedimentos-genericos.js`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\services\vinculos_materiais.py`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\cadastros_routes.py`

## 24. Onde testar antes da proxima alteracao

- Abrir Materiais.
- Abrir Procedimentos Genericos.
- Abrir Intervencoes / Procedimentos.
- Confirmar que a troca de Generico continua correta.
- Confirmar que generico sem materiais produz lista herdada vazia.
- Confirmar que nao ha contaminacao entre intervencoes.
- Confirmar que o duplo clique continua abrindo o modal completo.
- Confirmar console sem erro novo.

## 25. Onde testar depois da proxima alteracao

- Repetir o mesmo checklist de regressao completo registrado em `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\consolidacao_validacao_manual_regras_materiais_genericos_intervencoes.md`.

## 26. Confirmacao sobre Git

O uso de Git deve ficar para depois da conclusao e validacao da proxima subetapa funcional, salvo ordem explicita do usuario.

