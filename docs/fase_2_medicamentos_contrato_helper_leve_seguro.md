# Medicamentos - Contrato documental do proximo helper leve ou transformacao segura

- Data: 26/05/2026
- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Objetivo: registrar o contrato documental do proximo helper leve ou transformacao segura em Medicamentos.

## Contexto

- A etapa anterior fez a selecao documental de bloco leve apos a consolidacao de Cadastros auxiliares.
- O documento anterior foi [docs/fase_2_nova_selecao_blocos_leves_pos_cadastros_auxiliares.md](D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/fase_2_nova_selecao_blocos_leves_pos_cadastros_auxiliares.md).
- O commit anterior foi `4833f77d0a66e2b6f3f68865b5ab77685b530d2c`.
- Medicamentos foi a frente recomendada como proxima.

## Classificacao do modulo

- `Medicamentos` deve ser tratado como modulo especifico de area profissional.
- Esta classificacao nao altera permissoes, tenant, backend ou controle multiarea.
- A classificacao serve apenas para documentacao e orientacao futura.

## Estado atual conhecido de Medicamentos

- O codigo relacionado a Medicamentos esta concentrado em [frontend/app.js](D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js) e [frontend/js/modules/medicamentos.js](D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/js/modules/medicamentos.js).
- O modulo JS existe em [frontend/js/modules/medicamentos.js](D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/js/modules/medicamentos.js).
- O namespace real e `window.BranaMedicamentosModule`.
- `frontend/app.js` ainda concentra UI, DOM, lista, modal, filtros, cache, selecao, salvamento, exclusao e integracao com receitas/prescricoes, impressao, editor de textos e anamnese.
- Ha cadastro, listagem e busca/filtro por grupo e nome via request ao backend.
- Ha integracao com o Assistente de receitas.
- Ha integracao com o editor de textos/receitas.
- Ha modal.
- Ha `requestJson`.
- Ha payload e salvamento.
- Ha dependencia de backend/endpoints.
- Ha relacao com documentos gerados pelo assistente de receitas.

## Mapa funcional do fluxo atual

- `medicamentosAbrir()`
- `medicamentosEnsureUI()`
- `medicamentosSelecionado()`
- `medicamentosSelecionarLinha(tr)`
- `medicamentosRender()`
- `medicamentosSetSelectOptions(select, itens, placeholder)`
- `medicamentosAplicarTab(tab)`
- `medicamentosLimparModal()`
- `medicamentosAplicarModalDados(item)`
- `medicamentosCarregarFiltrosGrupo()`
- `medicamentosCarregarLista()`
- `medicamentosCarregarCombosModal()`
- `medicamentosFecharModal()`
- `medicamentosAbrirModal(modo)`
- `medicamentosPayloadModal()`
- `medicamentosSalvarModal()`
- `medicamentosExcluirSelecionado()`
- `medicamentosExcluirNoModal()`
- `medicamentosVincularEventos()`

## Partes proibidas para futura implementacao imediata

- DOM
- renderizacao
- modal
- selecao visual
- eventos
- editor de texto
- Assistente de receitas
- geracao de documento
- `requestJson`
- payload efetivo
- salvamento
- backend
- banco
- endpoints
- permissoes
- textos visiveis
- mojibake

## Candidatos de recorte leve

### `compararTextoMedicamento(texto, termo)`

- Responsabilidade: comparacao textual pura para apoio a busca/filtro local.
- Entradas: texto e termo.
- Saidas: booleano.
- Dependencias: normalizacao textual interna do modulo.
- Toca DOM: nao.
- Toca editor/receitas: nao.
- Toca modal: nao.
- Toca `requestJson`: nao.
- Toca payload: nao.
- Toca salvamento: nao.
- Toca backend/banco: nao.
- Risco: baixo.
- Ganho esperado: clareza de contrato textual e possibilidade de delegacao segura se surgir filtro local.
- Facilidade de teste manual: alta.

### `normalizarTextoMedicamento(texto)`

- Responsabilidade: normalizacao textual simples.
- Entradas: texto bruto.
- Saidas: texto trimado.
- Dependencias: nenhuma externa.
- Toca DOM: nao.
- Toca editor/receitas: nao.
- Toca modal: nao.
- Toca `requestJson`: nao.
- Toca payload: nao.
- Toca salvamento: nao.
- Toca backend/banco: nao.
- Risco: baixo.
- Ganho esperado: reutilizacao de trim/normalizacao em pontos futuros.
- Facilidade de teste manual: alta.

### `validarGrupoMedicamento(grupo)`

- Responsabilidade: validacao e normalizacao simples de grupo.
- Entradas: grupo bruto.
- Saidas: objeto com `ok` e `grupo`.
- Dependencias: `normalizarTextoMedicamento`.
- Toca DOM: nao.
- Toca editor/receitas: nao.
- Toca modal: nao.
- Toca `requestJson`: nao.
- Toca payload: nao.
- Toca salvamento: nao.
- Toca backend/banco: nao.
- Risco: baixo.
- Ganho esperado: padronizacao de validacao textual.
- Facilidade de teste manual: alta.

## Comparacao dos candidatos

- `compararTextoMedicamento(texto, termo)` e o recorte mais util para uma eventual busca/filtro local futuro.
- `normalizarTextoMedicamento(texto)` e `validarGrupoMedicamento(grupo)` sao puros, mas ja servem como base interna e trazem ganho menor para esta rodada.
- O bloco nao apresenta hoje um ponto claro de filtragem local no `app.js` para delegacao imediata; a consolidação documental e a melhor escolha antes de qualquer implementacao futura.

## Candidato recomendado

- **`compararTextoMedicamento(texto, termo)`**

## Contrato funcional do candidato recomendado

- A futura implementacao deve aceitar `texto` e `termo`.
- A saida deve ser booleana.
- O comportamento esperado e de comparacao textual case-insensitive com normalizacao local.
- Valores vazios, nulos ou undefined devem resultar em comparacao vazia segura.
- A implementacao nao deve alterar o comportamento dos filtros de lista, do modal ou do assistente de receitas.
- A implementacao nao deve mexer em `requestJson`, payload, salvamento, backend ou banco.

## Assinatura conceitual sugerida

- `compararTextoMedicamento(texto, termo)`

## Limites da futura implementacao

- Futura implementacao pequena.
- Helper passivo.
- Comportamento preservado.
- Sem texto visivel.
- Sem correcao de mojibake.
- Sem backend/banco/endpoints/permissoes.
- Sem payload/salvamento/requestJson.
- Sem DOM/renderizacao/modal/selecao visual/eventos.
- Sem mexer em Assistente de receitas, editor de texto ou documento gerado.
- Teste manual obrigatorio antes de validacao documental.

## Riscos remanescentes

- `frontend/app.js` ainda concentra o fluxo principal de Medicamentos.
- Integracao com Assistente de receitas e editor de textos aumenta a sensibilidade do bloco.
- Futuras mudancas de comparacao textual podem alterar busca ou ordenacao se o contrato nao for preservado.
- Qualquer nova extracao precisa de contrato proprio.

## Onde testar futuramente se houver implementacao

- Qualquer implementacao futura em Medicamentos deve ser testada em `Medicamentos / Assistente de receitas`.

## Confirmacao de que nenhuma alteracao de codigo foi feita

- Esta etapa foi exclusivamente documental.
- Nenhum arquivo de codigo foi alterado.

## Confirmacao de blindagem textual/mojibake

- A blindagem textual/mojibake foi respeitada.
- Nenhum texto visivel, acento, label, placeholder ou mensagem da interface foi corrigido.

## Commit seletivo obrigatorio

- Esta etapa deve ser registrada apenas com os documentos permitidos.
- Nao incluir arquivos de codigo no commit.

## Registro para roadmap

- Registrar no roadmap que Medicamentos foi escolhido para contrato documental.
- Registrar que Medicamentos e um modulo especifico de area profissional.
- Registrar o candidato recomendado, a saber `compararTextoMedicamento(texto, termo)`.
- Registrar que nenhuma alteracao de codigo foi feita.
- Registrar a proxima subetapa recomendada.
