# Símbolos Gráficos — Subetapa 8 — Helpers remanescentes da biblioteca

## Objetivo

Avaliar, de forma conservadora e somente documental, se os helpers remanescentes da biblioteca de `Símbolos Gráficos` são seguros para uma futura extração/delegação ao módulo passivo.

## Escopo

- Reavaliar exclusivamente `simbolosBibliotecaOculta` e `simbolosCompararBiblioteca`.
- Confirmar o estado atual do módulo e dos helpers já delegados.
- Registrar riscos e decidir se existe candidato seguro para próxima extração.
- Não mover código nesta etapa.

## Arquivos inspecionados

- `docs/simbolos_graficos_retomada_pos_preferencias_estado_atual.md`
- `docs/simbolos_graficos_subetapa_3_helpers_puros_passivos.md`
- `docs/simbolos_graficos_subetapa_7_consolidacao_helpers.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/js/modules/simbolos-graficos.js`
- `frontend/index.html`

## Checks iniciais

- Branch atual verificada: `modularizacao-segura-fase-1`.
- O commit `c6a2b27` aparece como HEAD desta linha de trabalho.
- `git status --short` mostra pendências preexistentes no repositório e o documento novo desta etapa.
- `git diff --stat` sem alterações novas de código nesta rodada documental.
- `git diff --cached --stat` sem diffs staged.
- Nenhum comando destrutivo ou de alteração de repositório foi executado.

## Base documental usada

- A retomada pós-Preferências confirmou que `Símbolos Gráficos` já é um módulo retomado, não um módulo novo.
- A Subetapa 3 consolidou helpers puros passivos no módulo.
- A Subetapa 7 consolidou a rodada dos helpers já delegados.
- A blindagem textual / mojibake continua obrigatória.

## Estado atual do módulo

Já estão delegados ao módulo passivo:

- `simbolosNormalizarTexto`
- `simbolosEhSistema`
- `simbolosImagemUrl`

O `frontend/app.js` continua com o restante do fluxo sensível:

- modal;
- editor tipo paint;
- preview;
- biblioteca visual;
- `postMessage`;
- salvar/excluir;
- manipulação de DOM;
- abertura/fechamento de editor.

## Helpers avaliados

| Helper | Linha aprox. | Papel | DOM | API/backend | Payload/salvamento | Estado global | Depende de helpers delegados | Risco | Classificação |
|---|---:|---|---|---|---|---|---|---|---|
| `simbolosBibliotecaOculta` | 23835 | Filtra itens ocultos da biblioteca por código | Não | Não | Não | Não | Indireta, via lista da biblioteca | Baixo | Candidato seguro |
| `simbolosCompararBiblioteca` | 23839 | Ordena biblioteca por código/descrição | Não | Não | Não | Não | Não depende de helpers delegados | Baixo | Candidato seguro |

## Análise de simbolosBibliotecaOculta

- Papel: ocultar itens fixos da biblioteca com base no `codigo`.
- DOM: não acessa DOM.
- API/backend: não chama API/back-end.
- Payload/salvamento: não monta payload e não salva.
- Estado global: não lê nem escreve estado global.
- Dependência de helpers delegados: não depende diretamente de `simbolosNormalizarTexto`, `simbolosEhSistema` ou `simbolosImagemUrl`.
- Dependência de fluxo sensível: depende apenas do formato da lista da biblioteca, não do modal/editor/postMessage.
- Strings visíveis/mojibake: usa códigos literais de imagem; não há correção textual envolvida.
- Extração literal: sim, pode ser copiado literalmente em etapa futura.
- Wrapper/fallback no `app.js`: sim, permite wrapper simples sem alterar chamadas.
- Risco de extração: baixo.
- Classificação: **candidato seguro**.

## Análise de simbolosCompararBiblioteca

- Papel: ordenar a biblioteca por código e descrição, com comparação textual determinística.
- DOM: não acessa DOM.
- API/backend: não chama API/back-end.
- Payload/salvamento: não monta payload e não salva.
- Estado global: não lê nem escreve estado global.
- Dependência de helpers delegados: não depende dos helpers já delegados.
- Dependência de fluxo sensível: afeta a ordenação da biblioteca visual, mas não toca modal/editor/postMessage/salvar/excluir.
- Strings visíveis/mojibake: usa `codigo` e `descricao` existentes como chaves de ordenação; não corrige nem altera texto.
- Extração literal: sim, pode ser copiado literalmente em etapa futura.
- Wrapper/fallback no `app.js`: sim, permite wrapper simples.
- Risco de extração: baixo, com cautela por impactar a ordem visual da biblioteca.
- Classificação: **candidato seguro**.

## Candidatos seguros

- `simbolosBibliotecaOculta`
- `simbolosCompararBiblioteca`

## Candidatos com cautela

- Nenhum dos dois ficou em cautela, mas `simbolosCompararBiblioteca` merece uma futura verificação visual por alterar ordenação da biblioteca.

## Proibidos por enquanto

- `simbolosAbrirModal`
- `simbolosFecharModal`
- `simbolosAbrirEditor`
- `simbolosFecharEditor`
- `simbolosEditorNotificar`
- `simbolosPersistirEdicao`
- `simbolosSalvarModal`
- `simbolosExcluirSelecionado`
- `simbolosExcluirModalAtual`
- `window.addEventListener("message", ...)`
- qualquer fluxo de editor
- qualquer fluxo de salvar/excluir
- qualquer manipulação de DOM
- qualquer comunicação com janela filha
- qualquer payload/API/backend
- qualquer correção textual/mojibake

## Estratégia futura recomendada

Se houver continuidade funcional mínima, a próxima extração mais conservadora é mover **um helper por vez**, começando por `simbolosBibliotecaOculta`, depois `simbolosCompararBiblioteca`, sempre com:

- cópia literal;
- exposição no namespace;
- wrapper/fallback no `app.js`;
- sem DOM;
- sem modal/editor;
- sem `postMessage`;
- sem payload/salvamento;
- sem alteração textual/mojibake.

## O que NÃO mover na próxima etapa

- `simbolosAbrirModal`
- `simbolosFecharModal`
- `simbolosAbrirEditor`
- `simbolosFecharEditor`
- `simbolosEditorNotificar`
- `simbolosPersistirEdicao`
- `simbolosSalvarModal`
- `simbolosExcluirSelecionado`
- `simbolosExcluirModalAtual`
- `window.addEventListener("message", ...)`
- qualquer fluxo de editor
- qualquer fluxo de salvar/excluir
- qualquer manipulação de DOM
- qualquer comunicação com janela filha
- qualquer payload/API/backend
- qualquer correção textual/mojibake

## Riscos remanescentes

- `simbolosCompararBiblioteca` altera a ordem da biblioteca, então o impacto visual precisa de conferência posterior.
- A biblioteca ainda depende do resto do fluxo de `Símbolos Gráficos`, que segue sensível.
- O editor/iframe continua sendo a parte de maior risco e permanece fora do escopo.

## Roteiro futuro de teste

Como esta etapa é documental, não há teste funcional no navegador.

Roteiro sugerido para uma futura subetapa funcional mínima:

1. `Ctrl+F5`.
2. Abrir `Símbolos Gráficos`.
3. Conferir abertura do modal.
4. Conferir biblioteca e preview sem salvar.
5. Não abrir editor tipo paint se a etapa futura não tocar editor.
6. Não salvar/excluir.
7. Verificar console.

## Próxima etapa recomendada

**Subetapa 9 funcional mínima — mover somente `simbolosBibliotecaOculta` com cópia literal e wrapper/fallback no `app.js`.**

Se houver necessidade de ainda menor impacto visual, `simbolosCompararBiblioteca` pode ficar para depois dessa etapa.

## Confirmação final

Nenhum código foi alterado nesta rodada documental. Não houve mudança em `frontend/app.js`, `frontend/index.html` ou no módulo passivo. Não houve alteração em backend, banco, payload, salvamento, permissões ou textos visíveis.
