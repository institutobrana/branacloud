# Validacao de materiais herdados em Procedimentos

Data: 2026-07-14

## Contexto

Esta validacao continha a frente de materiais herdados do modal de `Tabelas -> Procedimentos`.

## Resultado real observado

Nao foi encontrada, nesta base e neste fluxo, uma resposta real de `GET /api/procedimentos/{id}` contendo itens com:

- `origem = herdado`
- `herdado = true`

## Evidencia tecnica

Ao salvar um procedimento com `procedimento_generico_id` preenchido, o backend atual materializa os materiais do generico como `ProcedimentoMaterial` proprio da intervencao.

Trecho funcional verificado em `backend/routes/procedimentos_routes.py`:

- `_aplicar_heranca_procedimento_generico(...)`
- quando `sobrescrever_vinculos` e verdadeiro, a rotina apaga os vinculos locais e recria `ProcedimentoMaterial` a partir de `ProcedimentoGenericoMaterial`

Isso explica por que a leitura final do procedimento tecnico gravado nao devolveu linha marcada como herdada no payload.

## Procedimentos testados

- `66928` com `procedimento_generico_id = 82`
- `66929` com `procedimento_generico_id = 82`

## Conclusao

As protecoes visuais e de interacao para materiais herdados permanecem implementadas no frontend, mas a amostra real com `herdado = true` nao apareceu porque o backend atual materializa os materiais do generico no proprio procedimento ao salvar.

Na consolidacao posterior do React, a regra funcional foi ajustada para tratar `herdado` apenas como estado transitorio antes do save. Depois da materializacao e reabertura, o material volta a ser tratado como vínculo comum do procedimento, sem badge persistente e sem bloqueio permanente de alteraçao ou desvinculação.

## Proxima acao recomendada

Se a validacao precisar obrigatoriamente de linha `herdado = true` em leitura, sera necessario revisar o contrato backend de persistencia da heranca. Nesta etapa nenhuma alteracao adicional foi feita.

## Microetapa complementar validada

Em `66929 / TESTE HERANCA MATERIAL`, a exclusao real do vinculo proprio `00130` foi validada via `DELETE /api/procedimentos/66929/materiais-vinculados/por-codigo/00130`.

Depois do DELETE:

- o GET real de ` /api/procedimentos/66929` voltou a expor `00130` como heranca do generico `82`;
- a quantidade reaparecida foi `20`;
- a grade permaneceu com `17` itens, sem duplicidade;
- o painel financeiro do modal refletiu a recomposicao com os mesmos campos dinâmicos da tela;
- nenhum backend, banco ou migration foi alterado nesta verificacao.

## Confirmacao dos botoes do modal

Na validacao seguinte do mesmo fluxo:

- o botao `Nao` fechou o modal de confirmacao sem gerar `DELETE`;
- o botao `Sim` gerou exatamente uma chamada `DELETE /api/procedimentos/66929/materiais-vinculados/por-codigo/00130`;
- a grade permaneceu coerente durante a operacao;
- apos a resposta, o item voltou a ser exibido na composicao oficial do procedimento, sem duplicidade;
- a selecao da linha permaneceu coerente com o estado da grade.
