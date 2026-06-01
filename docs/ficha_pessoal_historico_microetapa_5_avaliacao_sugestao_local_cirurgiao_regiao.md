# Ficha Pessoal - Historico - Microetapa 5 - avaliacao de sugestao local nao vinculante para Cirurgiao e Regiao

## Objetivo

Avaliacao curta e documental sobre a eventual introducao de uma sugestao ou lista local nao vinculante para `Cirurgiao` e `Regiao`, sem transformar os campos em combo obrigatorio e sem integracao externa.

Esta microetapa nao altera frontend, backend, banco, schema, migration, seed, endpoint ou modelo.

## Base usada

- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/ficha_pessoal_historico_priorizacao_diferencas_backlog.md`
- `docs/ficha_pessoal_historico_microetapa_3_cirurgiao_regiao_auditoria.md`
- `docs/ficha_pessoal_historico_microetapa_4_contrato_local_origem_cirurgiao_regiao.md`
- `docs/ficha_pessoal_historico_easydental_engenharia_reversa.md`
- `docs/ficha_pessoal_historico_easydental_vs_brana_comparativo_detalhado.md`
- `frontend/js/modules/ficha-pessoal-aba-historico.js`
- `frontend/app.js`

## Beneficio potencial de uma sugestao local para Cirurgiao

- Pode acelerar preenchimentos repetitivos quando o usuario repete nomes muito usados na propria aba.
- Pode reduzir digitação manual em linhas sucessivas sem obrigar o uso de um cadastro externo.
- Pode ajudar a manter consistencia de grafia em nomes digitados muitas vezes.

## Beneficio potencial de uma sugestao local para Regiao

- Pode reduzir repeticao de valores curtos e recorrentes.
- Pode ajudar a manter uniformidade entre pequenas regioes/dentes mais usados na pratica.
- Pode facilitar o uso rapido sem impor lookup formal.

## Riscos de implementar cedo demais

- Pode confundir o usuario se a sugestao parecer um combo ou uma regra obrigatoria.
- Pode introduzir complexidade visual e de teclado sem ganho proporcional.
- Pode exigir logica de coleta de sugestoes recentes, deduplicacao e exibicao, sem que exista prova suficiente de necessidade real.
- Pode tensionar a simplicidade atual da aba, que hoje permanece totalmente textual e direta.

## Menor desenho seguro possivel

1. Manter textual por enquanto.
2. Se houver nova evidencia de ganho real, considerar apenas sugestao visual opcional, sem obrigatoriedade.
3. Deixar autocomplete simples local apenas como hipotese futura, depois de mais validacao pratica.

## Origem mais segura para uma eventual lista local

- A fonte mais conservadora seria, no futuro, observar os valores mais usados ja digitados na propria aba.
- Mesmo assim, isso ainda precisaria de filtro e validacao para nao contaminar o fluxo com uma lista irrelevante.
- Neste momento, a recomendacao mais segura e nao criar lista nem sugestao ainda.

## Recomendacao final

**Recomendacao: manter textual por enquanto.**

Motivos:

- o contrato local ja deixou claro que `Cirurgiao` e `Regiao` sao textuais e locais;
- o fluxo atual esta funcional e previsivel;
- o ganho de uma sugestao nao vinculante ainda nao e suficientemente comprovado;
- o risco de adicionar mais interface e mais regras e maior do que o beneficio imediato.

## Confirmacao de ausencia de mudanca funcional

- Nao houve alteracao de selecao.
- Nao houve alteracao de inserir.
- Nao houve alteracao de editar.
- Nao houve alteracao de eliminar.
- Nao houve alteracao de `TAB` / `Shift+TAB`.
- Nao houve alteracao de `ENTER` / `ESC`.
- Nao houve alteracao da persistencia via `extra.historico_aba`.
- Nao houve alteracao do modal funcional de `Propriedades da linha`.

## Confirmacao de ausencia de alteracao de backend/banco

- Nao houve alteracao de backend.
- Nao houve alteracao de banco, schema, migration, seed ou endpoint.

## Como testar no sistema

1. Abrir Ficha Pessoal.
2. Selecionar um paciente.
3. Entrar na aba Historico.
4. Inserir ou editar uma linha.
5. Conferir que `Cirurgiao` e `Regiao` continuam funcionando exatamente como antes.
6. Abrir `Propriedades da linha`.
7. Confirmar que nao houve mudanca perceptivel no comportamento.
8. Gravar e reabrir o paciente.
9. Confirmar que a reaplicacao continua funcionando.
10. Confirmar que nenhuma outra aba da Ficha Pessoal foi afetada.

## Proxima microetapa recomendada

Manter os campos textuais por enquanto. Se surgir nova evidencia pratica de repeticao ou beneficio real, reavaliar a ideia de sugestao local opcional e nao vinculante.

## Conclusao

A analise nao encontrou ganho prático suficiente para justificar uma sugestao local nesta fase. O caminho mais seguro e manter `Cirurgiao` e `Regiao` textuais, sem adicionar complexidade prematura.
