# Prestadores — Subetapa 6 — Análise documental de prestStatusHtml

## Objetivo

Documentar, de forma exclusivamente documental, a funcao `prestStatusHtml` dentro do modulo Prestadores, sem mover codigo e sem alterar qualquer comportamento funcional.

## Escopo

Esta etapa analisa apenas:

- onde `prestStatusHtml` e declarado;
- onde `prestStatusHtml` e chamado;
- que entradas ele recebe;
- que saida ele gera;
- se ha dependencia de DOM, estado global, cache, API, permissao, agenda, convenios ou comissoes;
- quais riscos visuais, textuais e funcionais existem;
- se e candidato futuro para extracao literal para `frontend/js/modules/prestadores.js`.

Nao houve alteracao de codigo, DOM, payload, backend, banco, endpoints, schema ou migrations.

## Arquivos inspecionados

- `frontend/app.js`
- `frontend/js/modules/prestadores.js`
- `docs/prestadores_subetapa_0_mapeamento_monolitico.md`
- `docs/prestadores_subetapa_2_fronteiras_contratos.md`
- `docs/prestadores_subetapa_4_integracao_prest_fmt_codigo.md`
- `docs/prestadores_subetapa_5_encerramento_ciclo.md`
- `docs/prestadores_retomada_pos_varredura_parciais_estado_atual.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Checks iniciais

- branch atual: `modularizacao-segura-fase-1`
- `git status --short` apresentou apenas pendencias nao relacionadas ja existentes no worktree
- `git log --oneline -6` mostrou `7f28ff9 Documenta retomada de Prestadores apos varredura` no topo
- `git diff --stat` estava vazio
- `git diff --cached --stat` estava vazio

## Localizacao da funcao prestStatusHtml

A funcao esta declarada em `frontend/app.js`, no bloco final de Prestadores:

- `frontend/app.js:23252`

Trecho observado:

- `function prestStatusHtml(ativo){return ativo?'<span style="color:#2fbf2f;font-size:14px;line-height:1;">â—</span>':'<span style="color:#d32f2f;font-size:14px;line-height:1;">â—</span>'}`

## Chamadas encontradas

A chamada funcional direta observada esta em:

- `frontend/app.js:23266`, dentro de `prestRender()`

Forma observada:

- `prestStatusHtml(item.ativo!==false)`

Referencias documentais anteriores que tambem citam a funcao:

- `docs/prestadores_subetapa_0_mapeamento_monolitico.md`
- `docs/prestadores_subetapa_2_fronteiras_contratos.md`
- `docs/prestadores_subetapa_5_encerramento_ciclo.md`

## Assinatura e entradas observadas

Assinatura observada:

- `prestStatusHtml(ativo)`

Entrada observada:

- `ativo` e passado como expressao booleana derivada de `item.ativo !== false`

Comportamento inferido a partir da chamada:

- `true` indica linha ativa;
- `false` indica linha inativa.

## Saida gerada pela funcao

A funcao retorna uma string HTML pronta para ser injetada na grade:

- um `<span>` inline;
- com `style` embutido;
- com cor verde quando `ativo` e verdadeiro;
- com cor vermelha quando `ativo` e falso;
- com um simbolo visual de marcador circular no conteudo.

O retorno e um fragmento HTML, nao um objeto, nao um nodo DOM e nao um dado estruturado.

## Dependencias identificadas

### DOM

Nao depende de DOM para calcular a saida. O DOM so entra depois, quando o retorno e inserido pela renderizacao da grade em `prestRender()`.

### Estado global / cache

Nao depende de `prestCfg`, `prestadoresCache`, `prestadorSelId` ou outro cache global para formar a string.

### Backend / API / banco

Nao faz chamada de rede, nao usa `requestJson`, nao usa `fetch` e nao consulta backend ou banco.

### Agenda / permissões / convênios / comissões

Nao depende desses dominios para calcular o retorno.

## Relação com DOM/UI

Embora a funcao seja pura no calculo, a saida dela e visual e diretamente consumida pela UI da grade de Prestadores.

Ou seja:

- ela nao manipula DOM;
- mas influencia o que o usuario ve;
- qualquer mudanca na string, no `style` ou no simbolo altera a aparencia da coluna de status.

## Relação com estado global/cache

A funcao em si nao consulta estado global.

O unico acoplamento indireto vem do ponto de chamada, porque `prestRender()` passa `item.ativo !== false` a partir da lista carregada em `prestadoresCache`.

## Relação com backend/API/banco

Nenhuma dependencia direta.

O valor de entrada vem de registros ja carregados por `prestCarregar()`, mas `prestStatusHtml` nao conhece endpoint, schema ou persistencia.

## Relação com agenda/permissoes/convênios/comissões

Nenhuma dependencia direta.

O helper nao usa regras de permissao, agenda, convenios ou comissoes.

## Avaliação de pureza

A funcao e, na pratica, um helper puro.

Motivos:

- recebe apenas um argumento;
- nao le DOM;
- nao escreve em DOM;
- nao le estado global;
- nao faz I/O;
- nao chama API;
- nao altera objetos externos;
- produz a mesma saida para a mesma entrada.

O unico ponto de atencao e que ela gera HTML inline com estilo embutido, entao a pureza e funcional, mas a saida e visualmente sensivel.

## Riscos de texto/mojibake

Existe risco documental porque o retorno contem um simbolo visual no HTML embutido e o texto observado no codigo e no terminal aparece com mojibake no ambiente.

Nao houve tentativa de correcao textual.

Risco principal:

- trocar o simbolo ou a codificacao pode mudar a aparencia da coluna de status e quebrar consistencia visual entre telas.

## Riscos visuais

- a cor verde/vermelha e fixa inline;
- o simbolo e parte da semantica visual;
- qualquer troca de `span`, `style`, cor ou simbolo pode alterar a leitura da grade;
- o status visual fica acoplado ao HTML gerado, nao a uma classe CSS reaproveitavel.

## Riscos funcionais

- alterar o retorno pode afetar a coluna de status na grade de Prestadores;
- qualquer mudanca de assinatura pode exigir ajuste em `prestRender()`;
- uma futura extracao literal precisa preservar exatamente a mesma saida para nao causar regressao visual.

## Classificação de segurança

Classificacao atual: **segura para analise documental, mas ainda sensivel para mudanca visual**.

Em termos de extracao futura:

- candidato bom para extracao literal;
- baixo risco de logica;
- risco moderado de regressao visual;
- risco baixo de integracao funcional, desde que a saida permaneça identica.

## Recomendação para próxima etapa

Se houver continuidade funcional, a proxima subetapa mais segura seria uma extracao literal de `prestStatusHtml` para o namespace passivo de `Prestadores`, preservando:

- mesma assinatura;
- mesma string retornada;
- mesma cor inline;
- mesmo simbolo visual;
- mesmo ponto de chamada em `prestRender()`.

Antes disso, esta etapa documental recomenda apenas revisar consumidores e confirmar que nao ha outro uso indireto fora de `prestRender()`.

## Roteiro de teste futuro, se houver extração funcional

Se a funcao for extraida futuramente, o teste minimo recomendado sera:

1. `Ctrl+F5`.
2. Abrir `Prestadores`.
3. Verificar se a coluna de status continua exibindo o mesmo indicador visual.
4. Conferir uma linha ativa e uma linha inativa.
5. Confirmar que nao houve mudanca de cor, simbolo ou alinhamento.
6. Verificar o console.
7. Confirmar que a grade continua carregando sem erro novo.

## Observação final

Esta subetapa nao alterou `frontend/app.js`, `frontend/index.html` nem `frontend/js/modules/prestadores.js`.
