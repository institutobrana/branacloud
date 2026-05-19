# Subetapa 2L - Mapeamento especifico de procSetSelectValue

## 1. Objetivo
Esta etapa e somente documental. O objetivo e detalhar exclusivamente o helper `procSetSelectValue`, com foco em uso, dependencia de DOM/select, risco visual e possibilidade futura de extracao. Nao ha movimento de codigo nesta etapa.

## 2. Estado inicial
- Branch: `modularizacao-segura-fase-1`
- Ultimo commit: `e81bbc2 Documenta mapeamento de helpers de select de Intervencoes`
- Status resumido: muitos `??` antigos em `docs/`, sem arquivos staged
- Diff inicial: `git diff --stat` vazio e `git diff --cached --stat` vazio no inicio desta etapa

## 3. Historico dos helpers ja extraidos
Os helpers ja extraidos para `frontend/js/modules/intervencoes-procedimentos.js`, com wrappers compativeis no `frontend/app.js`, sao:
- `procParse`
- `procFmtBr`
- `procFmtAuxLabel`
- `procFmtSimboloLabel`
- `procIndiceSiglaFromValor`

## 4. Escopo da 2L
Esta subetapa mapeia apenas:
- `procSetSelectValue`

Nao ha alteracao de comportamento, wrapper ou extracao funcional.

## 5. Definicao de `procSetSelectValue`
- Assinatura atual: `const procSetSelectValue=(el,val)=>{if(!el)return;const alvo=String(val??"");const ok=[...el.options].some(x=>x.value===alvo);el.value=ok?alvo:(el.options.length?el.options[0].value:"")};`
- Linha aproximada de definicao: `frontend/app.js`, por volta da linha 675
- Responsabilidade aparente: ajustar o `value` de um `select` para o valor desejado, ou cair para a primeira option disponivel quando o valor nao existe
- Recebe elemento ou identificador: recebe o elemento `select` diretamente, nao um identificador
- Depende de DOM: sim
- Altera value: sim
- Dispara evento: nao explicitamente
- Cria option: nao
- Limpa options: nao
- Chama `procGarantirOpcaoSelect`: nao
- Chama `procPreencherSelect`: nao
- E chamada por `procGarantirOpcaoSelect` ou `procPreencherSelect`: nao, nao ha evidencia disso

## 6. Chamadas encontradas
Chamadas diretas encontradas em `frontend/app.js`:
- `procAplicarDadosEditor` para:
  - `proc.cboGenerico`
  - `proc.cboEditorEspecialidade`
  - `proc.cboSimbolo`
  - `proc.cboCobranca`
- `procCarregarFiltros` para:
  - `proc.cboTabela`
  - `proc.cboEspecialidade`
- `procTabelaPreencherOrigens` para:
  - `procTabelaModal.cboOrigem`
- `procTabelaPreencherIndices` para:
  - `procTabelaModal.cboIndice`
- `procTabelaPreencherTiposTiss` para:
  - `procTabelaModal.cboTipoTiss`
- `procTabelaAtualizarFonte` para:
  - `procTabelaModal.cboIndice`
  - `procTabelaModal.cboTipoTiss`
- `procTabelaSalvarModal` para:
  - `proc.cboTabela`
- `procRelatorio` para:
  - `procRelatorio.cboTabela`
  - `procRelatorio.cboEspecialidade`

Essas chamadas mostram que o helper participa de varios fluxos de preenchimento visual do modulo, inclusive editor, tabela e relatorio.

## 7. Relacao com DOM/select
`procSetSelectValue` e um helper de DOM/select:
- le as options existentes
- compara os valores
- escreve em `el.value`
- pode cair para a primeira option

Portanto:
- nao e um helper puro no sentido estrito
- e pequeno, mas e sensivel a estado do select e ao conteudo previamente carregado

## 8. Relacao com `procGarantirOpcaoSelect`
- `procSetSelectValue` nao chama `procGarantirOpcaoSelect`
- ele costuma ser usado depois de `procGarantirOpcaoSelect` em fluxos como `procAplicarDadosEditor`
- a dupla garante que o valor exista e depois o seleciona

Conclusao:
- `procGarantirOpcaoSelect` prepara o DOM
- `procSetSelectValue` aplica a selecao final
- separar os dois sem contexto aumenta o risco de regressao visual

## 9. Relacao com `procPreencherSelect`
- `procSetSelectValue` nao chama `procPreencherSelect`
- e usado apos o preenchimento de selects em varios trechos

Conclusao:
- `procPreencherSelect` monta as options
- `procSetSelectValue` escolhe uma delas ou recai na primeira
- o comportamento conjunto e importante para o editor e para modais auxiliares

## 10. Relacao com payload/salvamento
`procSetSelectValue` nao monta payload nem chama `requestJson`.
Porem, ele influencia o valor visual selecionado em campos que depois sao lidos por:
- `procAplicarDadosEditor`
- `procSalvar`
- `procTabelaSalvarModal`

Conclusao:
- nao ha participacao direta em payload
- ha participacao indireta no valor que o usuario ve e, depois, no valor lido no salvamento

## 11. Relacao com materiais, vinculos e genéricos
- Materiais: nao ha relacao direta
- Vinculos: nao ha relacao direta
- `procedimento_generico_id`: sim, porque o helper seleciona o valor do `cboGenerico` em `procAplicarDadosEditor`
- `Procedimentos Genéricos`: sim, de forma indireta, porque o select do generico depende da lista carregada e da selecao final

## 12. Relacao com custos e reajuste
- Custos: nao ha relacao direta
- Reajuste: nao ha relacao direta

Mas o helper aparece em telas que coexistem com o fluxo de reajuste e com outros campos de calculo, entao o contexto geral do modulo continua exigindo cautela.

## 13. Relacao com `forma_cobranca`
Sim, existe relacao pratica:
- `procAplicarDadosEditor` usa `procSetSelectValue` para selecionar `proc.cboCobranca`
- `procSalvar` le o valor de `proc.cboCobranca`

Conclusao:
- o helper nao transforma `forma_cobranca`
- mas influencia qual valor fica efetivamente visivel/selecionado antes do save

## 14. Relacao com `procedimento_generico_id`
Sim:
- `procAplicarDadosEditor` usa `procSetSelectValue` em `proc.cboGenerico`
- isso influencia o valor visual da associacao com o procedimento generico

Conclusao:
- nao altera o campo persistido diretamente
- mas influencia a selecao que depois entra no fluxo de salvamento

## 15. Riscos visuais
Riscos visuais identificados:
- selecionar a option errada quando o valor nao existe
- cair na primeira option em selects com layout ou ordem sensivel
- mascarar a ausencia de option com fallback silencioso
- alterar a selecao visual de generico, especialidade, simbolo, cobranca, tabela ou relatorio

## 16. Riscos funcionais
Riscos funcionais identificados:
- mudar a selecao antes do usuario salvar
- influenciar, indiretamente, o valor lido por `procSalvar` ou `procTabelaSalvarModal`
- gerar regressao dificil de notar porque o helper parece simples, mas e usado em varios pontos

## 17. Classificacao final
Classificacao de `procSetSelectValue`: **cautela**

Motivos:
- e pequeno
- nao faz fetch
- nao cria payload
- nao grava diretamente
- mas depende de DOM/select
- e usado em muitos fluxos centrais do modulo
- pode alterar valor visual e, por consequencia, o valor salvo indiretamente

## 18. Candidato mais seguro, se existir
Se o time decidir testar uma extracao futura muito pequena, `procSetSelectValue` seria o candidato mais simples entre os helpers de select.

Mesmo assim, nesta fase a recomendacao continua sendo nao mover ainda, porque:
- o uso e amplo
- o impacto visual e direto
- o comportamento de fallback precisa ser mantido com muito cuidado

## 19. Recomendacao objetiva da proxima etapa
Recomendacao conservadora:
- manter `procSetSelectValue` em `frontend/app.js` por enquanto
- nao criar wrapper funcional agora
- documentar mais antes de qualquer extracao dos helpers de select

Se houver futura extracao funcional, a menor subetapa possivel seria mover somente este helper, sem tocar no restante do bloco de select, mas somente apos nova validacao visual.

## 20. Onde testar, caso uma etapa funcional futura venha a mover esse helper
Roteiro futuro sugerido:
1. Ctrl+F5
2. Abrir `Configuracoes > Tabelas > Intervencoes / Procedimentos...`
3. Abrir listagem
4. Abrir procedimento existente
5. Verificar selects preenchidos
6. Verificar procedimento com generico
7. Verificar procedimento sem generico
8. Testar combo `Selecione...` sem salvar
9. Verificar forma de cobranca, se o helper tocar esse campo
10. Verificar especialidade/tabela/simbolo/indice, se aplicavel
11. Conferir materiais proprios/herdados apenas visualmente
12. Abrir `% Reajusta tabela` e fazer `Preview` apenas
13. Nao aplicar reajuste real
14. Conferir console

## 21. Confirmacoes finais de seguranca
- Nenhum codigo foi alterado nesta etapa
- `frontend/app.js` nao foi alterado
- `frontend/index.html` nao foi alterado
- `frontend/js/modules/intervencoes-procedimentos.js` nao foi alterado
- Backend nao foi alterado
- Banco, schema, migrations e endpoints nao foram alterados
- Nao houve `UPDATE`, `DELETE` ou `INSERT`
- Nao houve reajuste real
- Nao houve `git add`, `git commit`, `git push`, `git clean`, `git reset` ou `git restore`
- Nao foi criado, editado, salvo ou documentado nada nas pastas proibidas
- A blindagem textual/mojibake foi respeitada

