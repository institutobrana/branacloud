# Subetapa 2M - Mapeamento de `procGarantirOpcaoSelect`

## 1. Objetivo
Esta etapa e somente documental. O objetivo foi mapear exclusivamente o helper `procGarantirOpcaoSelect` no modulo **Configuracoes > Tabelas > Intervencoes / Procedimentos...**, sem mover codigo e sem alterar comportamento.

## 2. Estado inicial
- Branch: `modularizacao-segura-fase-1`
- Ultimo commit consolidado e enviado: `a0e9646 Documenta mapeamento de procSetSelectValue de Intervencoes`
- Status resumido: ha muitos arquivos `??` antigos em `docs/`; nenhum diff tracked ativo antes da criacao deste documento
- Diff inicial: vazio para tracked e vazio para staged

## 3. Historico dos helpers ja extraidos
- `procParse`
- `procFmtBr`
- `procFmtAuxLabel`
- `procFmtSimboloLabel`
- `procIndiceSiglaFromValor`

## 4. Escopo da 2M
Mapeamento exclusivo de `procGarantirOpcaoSelect`, com foco em DOM/select, risco visual, relacao com `procSetSelectValue` e `procPreencherSelect`, e impacto potencial em editor, filtros, modal, relatorio e fluxo de genérico/cobrança.

## 5. Definicao encontrada de `procGarantirOpcaoSelect`
- Assinatura aproximada: `function procGarantirOpcaoSelect(el,valor,rotulo="")`
- Linha aproximada: `frontend/app.js:692`
- Corpo resumido: normaliza `valor` como string, verifica se existe uma `option` com esse valor, e se nao existir cria uma nova `option` com o rotulo informado ou com o proprio valor. A nova `option` recebe `dataset.legacy="true"` e e anexada ao select.
- Recebe elemento select diretamente: sim
- Recebe value: sim
- Cria option: sim
- Altera selected/value: nao diretamente, mas prepara a `option` para que o valor possa ser selecionado em seguida por outro helper
- Altera texto visivel: sim, indiretamente, ao inserir o rotulo da `option`
- Usa `String`/`trim`: sim
- Depende de outros helpers: nao, e um helper autonomo de DOM/select

## 6. Chamadas encontradas
### 6.1. Fluxo do editor de procedimentos
- `frontend/app.js:698` e `frontend/app.js:700`
- Bloco chamador: `procAplicarDadosEditor`
- Contexto de uso: preenchimento do editor ao abrir/editar procedimento
- Select/campo afetado: `proc.cboGenerico`, `proc.cboEditorEspecialidade`, `proc.cboSimbolo`, `proc.cboCobranca`
- Natureza do fluxo: editor

### 6.2. Fluxo de vinculo de material
- `frontend/app.js:735`
- Bloco chamador: `procVinculaPrepararEdicao`
- Contexto de uso: edicao de vinculo ja existente
- Select/campo afetado: `proc.vinculaMateriais`
- Natureza do fluxo: modal/vinculo

### 6.3. Fluxo de carregamento de combos do editor
- `frontend/app.js:4459`, `frontend/app.js:4598`, `frontend/app.js:4695`
- Blocos chamadores: rotinas do modulo `pgen`
- Contexto de uso: preenchimento de selects do editor de Procedimentos Genericos
- Select/campos afetados: `pgen.faseSelect`, `pgen.matSelect`, `pgen.editorSimbolo`
- Natureza do fluxo: editor relacionado a Procedimentos Genericos

### 6.4. Fluxo de combinacoes e ajustes do editor
- `frontend/app.js:23331`, `frontend/app.js:23337`, `frontend/app.js:23514`, `frontend/app.js:23517`, `frontend/app.js:23520`, `frontend/app.js:23524`
- Blocos chamadores: `procAplicarDadosEditor` nas variantes atuais do arquivo
- Contexto de uso: preenchimento de `procedimento_generico_id`, simbolo grafico, forma de cobranca e select de especialidade
- Select/campos afetados: `proc.cboGenerico`, `proc.cboEditorEspecialidade`, `proc.cboSimbolo`, `proc.cboCobranca`
- Natureza do fluxo: editor com relacao a genérico, simbolo e cobranca

## 7. Relacao com `procSetSelectValue`
- `procSetSelectValue` nao chama `procGarantirOpcaoSelect`
- `procGarantirOpcaoSelect` nao chama `procSetSelectValue`
- Os dois costumam ser usados em sequencia: primeiro garante-se a `option`, depois o valor e selecionado
- Risco de mover um sem o outro: alto para regressao visual, porque o `value` pode deixar de existir no DOM antes da selecao

## 8. Relacao com `procPreencherSelect`
- Uso conjunto e frequente: `procPreencherSelect` monta as opcoes; `procGarantirOpcaoSelect` cria uma opcao adicional quando o valor atual nao existe na lista
- `procPreencherSelect` limpa/recria options; `procGarantirOpcaoSelect` preserva o valor ausente adicionando uma `option` legada
- Em fluxo real, `procPreencherSelect` e o preenchimento base, enquanto `procGarantirOpcaoSelect` age como compatibilidade para valor fora do cadastro atual

## 9. Relacao com DOM/select
- Dependencia direta de DOM/select: sim
- Atua diretamente sobre `el.options`, `document.createElement("option")`, `appendChild` e `dataset`
- Ha risco visual porque a `option` criada entra na lista exibida ao usuario
- Ha risco de valor selecionado porque a nova `option` e a base para o select aceitar um valor que nao estava na lista

## 10. Relacao com payload/salvamento
- Nao monta payload diretamente
- Nao salva diretamente
- Porem, o valor garantido no DOM pode ser lido depois por rotinas de payload e salvamento, especialmente no editor de procedimentos
- Portanto o risco e indireto, mas real: a funcao nao escreve no backend, mas pode influenciar o valor que o backend recebe

## 11. Relacao com materiais/vinculos/genéricos
- Materiais: nao mexe diretamente, mas aparece em fluxo de editor que pode coexistir com materiais e vinculos
- Vinculos: aparece diretamente em `procVinculaPrepararEdicao`, entao ha relacao de contexto com vinculos de materiais
- Procedimento_generico_id: sim, aparece no preenchimento do select do generico e em edicoes do editor
- Procedimentos Genericos: sim, aparece no fluxo de configuracao/editor associado a esse modulo
- Risco indireto: uma opcao garantida pode manter selecionado um valor legado do genérico ou do vinculo

## 12. Relacao com forma_cobranca
- Aparece no preenchimento do select de cobranca do editor
- Pode influenciar a exibição de um valor de forma de cobranca ausente da lista atual
- Nao altera `procNormalizarFormaCobranca` nem `procNormalizarFormaCobrancaV2`
- Mesmo assim, pode participar do fluxo visual que antecede o salvamento de `forma_cobranca`

## 13. Relacao com custos/reajuste
- Nao mexe diretamente em custos nem em reajuste
- Nao faz calculo de preco, repasse ou tabela
- Nao participa do preview/aplicacao de reajuste
- O risco aqui e apenas indireto por estar em rotinas de interface do modulo, nao por logica de custo

## 14. Classificacao final
- Classificacao: **cautela**
- Motivo: e um helper pequeno, mas depende de DOM/select e pode alterar o valor visualmente selecionado. Nao e o melhor candidato para extracao funcional imediata sem uma etapa propria de teste visual.

## 15. Recomendacao objetiva
- Manter `procGarantirOpcaoSelect` em `frontend/app.js` por enquanto
- Nao mover nesta etapa
- Se futuramente for extraido, isso deve acontecer em subetapa propria, junto com um teste visual forte dos selects do editor e dos fluxos relacionados

## 16. Roteiro futuro de testes manuais caso um dia o helper seja movido
1. Abrir `Configurações > Tabelas > Intervenções / Procedimentos...`
2. Abrir a listagem
3. Abrir um procedimento existente
4. Verificar selects preenchidos no editor
5. Verificar procedimento com genérico
6. Verificar procedimento sem genérico
7. Testar combo `Selecione...` sem salvar
8. Verificar forma de cobranca, se o helper tocar esse campo
9. Verificar especialidade, simbolo, indice ou tabela, se aplicavel
10. Conferir materiais proprios e herdados apenas visualmente
11. Abrir `% Reajusta tabela` e fazer apenas `Preview`
12. Nao aplicar reajuste real
13. Conferir console

## 17. Confirmações finais de segurança
- Nenhum codigo foi alterado nesta etapa
- `frontend/app.js` nao foi alterado
- `frontend/index.html` nao foi alterado
- `frontend/js/modules/intervencoes-procedimentos.js` nao foi alterado
- Backend nao foi alterado
- Banco/schema/migrations/endpoints nao foram alterados
- Nao houve `UPDATE/DELETE/INSERT`
- Nao houve execucao de reajuste real
- Nao houve `git add/commit/push/clean/reset/restore`
- Nada foi criado, editado, salvo ou documentado nas pastas proibidas
- Blindagem textual/mojibake foi respeitada
