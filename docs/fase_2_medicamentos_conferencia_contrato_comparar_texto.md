# Medicamentos - Conferencia do contrato de compararTextoMedicamento antes de implementacao

- Data: 26/05/2026
- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Objetivo: conferir o contrato documental de `compararTextoMedicamento(texto, termo)` antes de qualquer implementacao futura.

## Contexto

- O documento anterior foi [docs/fase_2_medicamentos_contrato_helper_leve_seguro.md](D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/fase_2_medicamentos_contrato_helper_leve_seguro.md).
- O commit anterior foi `d7eca7b6b9b517708569ff7b1df7fe784f90d0bd`.
- Medicamentos foi tratado como modulo especifico de area profissional.
- A etapa anterior recomendou `compararTextoMedicamento(texto, termo)` como proximo helper leve ou transformacao segura.

## Classificacao do modulo

- `Medicamentos` deve continuar sendo tratado como modulo especifico de area profissional.
- Esta classificacao nao altera permissoes, tenant, backend ou controle multiarea.
- A classificacao serve apenas para documentacao e orientacao futura.

## Contrato conferido

- O helper recomendado era `compararTextoMedicamento(texto, termo)`.
- A responsabilidade prevista era comparacao textual pura para apoio a busca/filtro local.
- A assinatura conceitual prevista era `compararTextoMedicamento(texto, termo)`.
- As entradas previstas eram `texto` e `termo`.
- A saida prevista era booleana.
- O fallback conceitual esperado deveria ser local e equivalente, sem alterar comportamento atual.

## Estado real dos helpers

- `compararTextoMedicamento(texto, termo)` ja existe em [frontend/js/modules/medicamentos.js](D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/js/modules/medicamentos.js).
- O helper esta em `ns.helpers`, dentro do namespace `window.BranaMedicamentosModule`.
- `normalizarTextoMedicamento(texto)` tambem existe.
- `validarGrupoMedicamento(grupo)` tambem existe.
- `validarNomeMedicamento(nome)` tambem existe.
- Esses helpers sao passivos.
- Esses helpers nao tocam DOM, `requestJson`, payload, salvamento, backend ou banco.

## Estado real do uso em frontend/app.js

- [frontend/app.js](D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js) nao usa `compararTextoMedicamento` atualmente.
- A busca/filtro de Medicamentos e realizada por chamada ao backend em `medicamentosCarregarLista()`, usando `grupo` e `nome`.
- A comparacao textual local nao esta aplicada hoje no fluxo principal.
- A unica delegacao observada em `app.js` para o modulo e a validacao de nome em `medicamentosSalvarModal()`, via `validarNomeMedicamento`.
- A futura delegacao de `compararTextoMedicamento(texto, termo)` reduziria pouco ou nada o volume atual de `app.js` neste momento; o ganho principal seria padronizacao de comportamento em eventual uso local futuro.

## Riscos especificos de Medicamentos

- Medicamentos possui risco funcional relevante em listagem, busca/filtro, cadastro, modal, Assistente de receitas, editor de textos/receitas, documento gerado, `requestJson`, payload, salvamento, endpoints e comportamento visual.
- Qualquer tentativa de trazer o helper para um fluxo novo precisa evitar impacto no Assistente de receitas, no editor e em documentos gerados.
- Como o helper ja existe, o risco agora nao esta na sua existencia, mas na ausencia de um consumidor local claro em `app.js`.

## Contrato funcional revisado

- `compararTextoMedicamento(texto, termo)` deve continuar como comparacao booleana, case-insensitive, com tratamento seguro de vazio/null/undefined.
- O contrato pode usar ou nao `normalizarTextoMedicamento`, desde que preserve o resultado esperado.
- O contrato deve preservar exatamente o comportamento atual e nao deve introduzir impacto em busca remota/backend.
- O contrato nao deve afetar o Assistente de receitas.

## Estrategia de fallback futura

- Fallback conceitual esperado:
  - `window.BranaMedicamentosModule?.helpers?.compararTextoMedicamento || fallbackLocalEquivalente`
- A forma exata de delegacao deve respeitar o namespace real e nao precisa ser implementada nesta etapa.

## Decisao conservadora

- **B. O contrato precisa de complemento documental antes de implementacao.**

## Justificativa tecnica

- O helper ja existe, mas [frontend/app.js](D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js) nao possui hoje um ponto local claro para delegacao de `compararTextoMedicamento`.
- A busca/listagem de Medicamentos continua dependente do backend, e o contrato nao deve induzir mudanca de arquitetura sem um consumidor local definido.
- Como Medicamentos ainda integra cadastro, modal, Assistente de receitas e editor de textos/receitas, qualquer implementacao futura deve nascer com contrato mais especifico de consumo.
- A decisao mais segura e registrar o contrato como conferido, mas pedir complemento documental antes de qualquer implementacao.

## Proxima subetapa recomendada

- `Medicamentos - Complemento documental do contrato de comparacao textual com consumidor local definido antes de implementar`

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

- Registrar no roadmap que foi feita a conferencia do contrato de `compararTextoMedicamento`.
- Registrar que Medicamentos segue como modulo especifico de area profissional.
- Registrar que o contrato precisa de complemento documental antes de implementacao.
- Registrar a proxima subetapa recomendada.
