# Fase 2 - Nova selecao documental de proximo bloco leve apos consolidacao de Cadastros auxiliares

- Data: 26/05/2026
- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Objetivo: registrar uma nova selecao documental de bloco leve apos a consolidacao de Cadastros auxiliares.

## Contexto

- A frente de Cadastros auxiliares acabou de ser pausada/consolidada por ora.
- O documento anterior foi [docs/fase_2_cadastros_auxiliares_consolidacao_pos_aux_normalizar_hex_cor.md](D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/fase_2_cadastros_auxiliares_consolidacao_pos_aux_normalizar_hex_cor.md).
- O commit anterior foi `9e6f9b2c3170ee333cc9ec0a080da559919ae3a5`.

## Frentes pausadas/consolidadas

- Agenda de contatos.
- Agenda principal.
- Prestadores.
- Preferencias / Configuracoes comuns.
- Plano de Contas.
- CID.
- Etiquetas.
- Cadastros auxiliares.

## Candidatos avaliados

### Medicamentos

- Classificacao multiarea: especifico de alguma area profissional.
- Estado atual conhecido: existe modulo e rotas no roadmap; o fluxo envolve medicamentos, grupos, apresentacoes, usos e integracao com editor de textos/receitas.
- Possiveis recortes leves: normalizacoes de lista, filtros locais, helpers puros para apresentacao/ordenacao de itens.
- Riscos: DOM, renderizacao, eventos, requestJson, payload, salvamento, permissao, backend/banco e integracao com editor de textos/receitas.
- Ganho esperado: moderado, com possibilidade de contrato documental previo e potencial de reduzir pequenos trechos de `frontend/app.js`.
- Classificacao de risco: medio.

### Convenios e Planos

- Classificacao multiarea: misto/depende de contexto.
- Estado atual conhecido: modulo em desenvolvimento com rotas, frontend e calendario; impacto em pacientes, prestadores, agenda e financeiro.
- Possiveis recortes leves: normalizacoes e filtros locais de listas/combos, helpers puros de apresentacao.
- Riscos: exclusoes, dependencias com prestadores/pacientes, impacto financeiro e de agenda, mais chances de fluxo compartilhado.
- Ganho esperado: real, mas com maior custo de validacao e fronteira mais sensivel.
- Classificacao de risco: medio-alto.

### Outro bloco leve identificado

- Nenhum bloco adicional foi considerado mais seguro do que Medicamentos ou Convenios e Planos nesta rodada.

## Comparacao final

- `Medicamentos` oferece melhor equilibrio entre fronteira clara, possibilidade de helper passivo e risco menor que `Convenios e Planos`.
- `Convenios e Planos` permanece mais sensivel por dependencias e impacto cruzado em varios fluxos.
- A selecao conservadora favorece `Medicamentos` como proxima frente documental.

## Recomendacao escolhida

- **A. Medicamentos como proxima frente documental.**

## Justificativa tecnica

- O bloco tem possibilidade de recortes leves e helpers passivos.
- O risco e menor que em `Convenios e Planos`.
- A fronteira e mais clara para um primeiro contrato documental.
- O ganho potencial e suficiente para justificar a proxima conferencia sem reabrir frentes pausadas.

## Proxima subetapa recomendada

- `Medicamentos - Contrato documental do proximo helper leve ou transformacao segura`.

## Onde testar futuramente

- Qualquer implementacao futura em Medicamentos deve ser testada em `Medicamentos / Assistente de receitas`, validando cadastro, listagem e integracao minima com o fluxo de receitas e documento gerado.

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

- Registrar no roadmap que `Cadastros auxiliares` foi consolidado/pausado por ora.
- Registrar que foi realizada nova selecao documental de blocos leves.
- Registrar os candidatos avaliados e a classificacao multiarea resumida.
- Registrar que `Medicamentos` foi a recomendacao escolhida.
- Registrar a proxima subetapa recomendada.
