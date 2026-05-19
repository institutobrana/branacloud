# Subetapa 2N - Mapeamento de `procPreencherSelect`

## 1. Objetivo
Esta etapa e somente documental. O objetivo foi mapear exclusivamente o helper `procPreencherSelect` no modulo **Configuracoes > Tabelas > Intervencoes / Procedimentos...**, sem mover codigo e sem alterar comportamento.

## 2. Estado inicial
- Branch: `modularizacao-segura-fase-1`
- Ultimo commit consolidado e enviado: `1f205b7 Documenta mapeamento de procGarantirOpcaoSelect de Intervencoes`
- Status resumido: ha muitos arquivos `??` antigos em `docs/`; nenhum diff tracked ativo antes da criacao deste documento
- Diff inicial: vazio para tracked e vazio para staged

## 3. Historico dos helpers ja extraidos
- `procParse`
- `procFmtBr`
- `procFmtAuxLabel`
- `procFmtSimboloLabel`
- `procIndiceSiglaFromValor`

## 4. Escopo da 2N
Mapeamento exclusivo de `procPreencherSelect`, com foco em DOM/select, risco visual, relacao com `procSetSelectValue` e `procGarantirOpcaoSelect`, e impacto potencial em editor, filtros, modal, relatorio, tabela e Procedimentos Genéricos.

## 5. Definicao encontrada de `procPreencherSelect`
- Assinatura aproximada: `function procPreencherSelect(el,itens,{placeholder="Selecione...",valueFrom=(item)=>item?.id??"",labelFrom=(item)=>item?.descricao??item?.nome??item?.codigo??""}={})`
- Linha aproximada: `frontend/app.js:691`
- Corpo resumido: recebe um select, converte a lista para um array base, monta uma sequencia de `option` em HTML, adiciona opcionalmente um placeholder e define `el.innerHTML` com esse HTML.
- Recebe DOM/select: sim
- Recebe lista/array: sim
- Recebe valor selecionado: nao diretamente; normalmente o valor escolhido e aplicado depois por outro helper, como `procSetSelectValue`
- Limpa options existentes: sim, indiretamente ao substituir `innerHTML`
- Altera `innerHTML`: sim
- Cria option: sim
- Altera selected/value: nao diretamente, mas prepara o combo para selecao posterior
- Dispara evento: nao
- Depende de `procSetSelectValue`: nao diretamente
- Depende de `procGarantirOpcaoSelect`: nao diretamente
- Altera texto visivel: sim, ao renderizar os rotulos das opcoes e o placeholder

## 6. Chamadas encontradas
### 6.1. Preenchimento de especialidades do editor
- `frontend/app.js:693`
- Bloco chamador: `procPreencherEspecialidadesEditor`
- Contexto de uso: combo de especialidade no editor de procedimentos
- Select/campo afetado: `proc.cboEditorEspecialidade`
- Natureza do fluxo: editor

### 6.2. Carregamento de combos do editor
- `frontend/app.js:697`, `frontend/app.js:699`, `frontend/app.js:23330`, `frontend/app.js:23336`
- Bloco chamador: `procCarregarCombosEditor`
- Contexto de uso: carregamento de combos de genérico, simbolo e forma de cobranca
- Select/campos afetados: `proc.cboGenerico`, `proc.cboSimbolo`, `proc.cboCobranca`
- Natureza do fluxo: editor

### 6.3. Filtros e listagem
- `frontend/app.js:701`, `frontend/app.js:23355`
- Bloco chamador: `procCarregarFiltros`
- Contexto de uso: combo de tabela e especialidade no topo/filtro
- Select/campos afetados: `proc.cboTabela`, `proc.cboEspecialidade`
- Natureza do fluxo: filtro/listagem

### 6.4. Tabela modal
- `frontend/app.js:714`, `frontend/app.js:715`, `frontend/app.js:716`, `frontend/app.js:717`, `frontend/app.js:719`
- Blocos chamadores: rotinas `procTabelaPreencherOrigens`, `procTabelaPreencherIndices`, `procTabelaPreencherTiposTiss`, `procTabelaAtualizarFonte`, `procTabelaSalvarModal`
- Contexto de uso: modal de tabela
- Select/campos afetados: `procTabelaModal.cboOrigem`, `procTabelaModal.cboIndice`, `procTabelaModal.cboTipoTiss`, `procTabelaModal.cboFonte`
- Natureza do fluxo: modal/tabela

### 6.5. Vinculo de material
- `frontend/app.js:735`
- Bloco chamador: `procVinculaPrepararEdicao`
- Contexto de uso: combo de materiais vinculado ao procedimento
- Select/campo afetado: `proc.vinculaMateriais`
- Natureza do fluxo: vinculo/material

### 6.6. Painel e relatorio de precos / configuracoes relacionadas
- `frontend/app.js:2886`, `frontend/app.js:2893`, `frontend/app.js:2903`, `frontend/app.js:2906`, `frontend/app.js:2910`, `frontend/app.js:2914`, `frontend/app.js:2917`, `frontend/app.js:2920`
- Bloco chamador: configuracoes de sistema / combos auxiliares
- Contexto de uso: varios selects de configuracao
- Select/campos afetados: `sysOptCfg.cboFinTipoCobranca`, `sysOptCfg.cboFinCatOrto`, `sysOptCfg.cboDataFormato`, `sysOptCfg.cboAvCaptura`, `sysOptCfg.cboAvWord`, `sysOptCfg.cboAvEmail`
- Natureza do fluxo: configuracao/auxiliar

### 6.7. Procedimentos Genéricos
- `frontend/app.js:3643`, `frontend/app.js:4454`, `frontend/app.js:4590`, `frontend/app.js:4676`
- Blocos chamadores: rotinas do modulo `pgen`
- Contexto de uso: fase, materiais e simbolo do editor de Procedimentos Genéricos
- Select/campos afetados: `pgen.editorSimbolo`, `pgen.matLista`, `pgen.faseSelect`
- Natureza do fluxo: Procedimentos Genéricos

### 6.8. Editor principal de procedimentos
- `frontend/app.js:23331`, `frontend/app.js:23336`, `frontend/app.js:23354`, `frontend/app.js:23355`, `frontend/app.js:23356`, `frontend/app.js:23493`, `frontend/app.js:23494`, `frontend/app.js:23495`
- Blocos chamadores: `procAplicarDadosEditor`, `procCarregarCombosEditor`, `procCarregarFiltros`
- Contexto de uso: preenchimento inicial do editor, especialidade, genérico, simbolo e cobranca
- Select/campos afetados: `proc.cboGenerico`, `proc.cboEditorEspecialidade`, `proc.cboSimbolo`, `proc.cboCobranca`
- Natureza do fluxo: editor

## 7. Relacao com `procSetSelectValue`
- `procPreencherSelect` nao chama `procSetSelectValue` diretamente
- O uso comum e sequencial: primeiro `procPreencherSelect` monta as options; depois `procSetSelectValue` seleciona o valor
- Risco de mover um sem o outro: alto para regressao visual, pois o select pode ficar com valor inicial incorreto ou sem selecao esperada

## 8. Relacao com `procGarantirOpcaoSelect`
- Uso conjunto frequente: `procPreencherSelect` monta a lista base e `procGarantirOpcaoSelect` entra quando precisa manter um valor fora da lista
- Se um fluxo usar `procPreencherSelect` e depois garantir valor ausente, ha risco de a `option` dinamica ser perdida na proxima recriacao do `innerHTML`
- Em fluxos com valor legado ou selecionado fora do cadastro, os dois helpers se complementam

## 9. Risco visual
- Risco visual principal: limpeza e recriacao de options
- Impacto em combos `Selecione...`: sim, o placeholder e renderizado pelo helper
- Impacto em valores ausentes: sim, o combo pode nao oferecer o valor salvo sem complemento de outro helper
- Impacto em selects de editor/filtro/modal/relatorio: alto, porque o helper e usado em varias telas e combos importantes
- Risco de texto visual/mojibake: existe se uma label vier quebrada da origem, mas nesta etapa nao corrigimos nada

## 10. Relacao com procedimento_generico_id
- Toca diretamente o select de genérico no editor
- Aparece no fluxo que define e preserva `procedimento_generico_id`
- Pode afetar heranca de materiais de forma indireta porque o select de genérico e o gatilho visual para a base herdada

## 11. Relacao com materiais/vinculos
- Toca diretamente o combo de materiais no fluxo de vinculo
- Aparece em tela relacionada a vinculo e edicao de material
- Risco indireto: a selecao de genérico influencia a visualizacao de materiais herdados/proprios, mesmo que o helper em si nao calcule heranca

## 12. Relacao com payload/salvamento
- Nao monta payload diretamente
- Nao salva diretamente
- Entretanto, os valores preenchidos no DOM podem ser lidos depois por rotinas de payload e salvamento
- Portanto o risco e indireto, mas real: o helper nao grava, mas pode influenciar o que o usuario ve e o que a gravacao posterior le

## 13. Relacao com forma_cobranca
- Aparece no combo de cobranca do editor
- Pode afetar a disponibilidade visual de uma forma de cobranca no DOM
- Nao altera `procNormalizarFormaCobranca` nem `procNormalizarFormaCobrancaV2`

## 14. Relacao com preco/custo/repasse/reajuste
- Nao toca diretamente em preco, custo, repasse ou recalculo
- Nao participa do preview/aplicacao de reajuste
- O risco e apenas indireto por participar de telas que tambem mostram esses dados

## 15. Classificacao final
- Classificacao: **cautela**
- Motivo: e um helper pequeno, mas de alto uso visual e com impacto amplo em varios selects. Nao e candidato seguro para extracao funcional imediata sem uma etapa propria de teste visual.

## 16. Recomendacao objetiva
- Manter `procPreencherSelect` em `frontend/app.js` por enquanto
- Nao mover nesta etapa
- Se um dia for extraido, isso deve ocorrer em subetapa propria, com teste visual forte em editor, filtros, modal, relatorio e Procedimentos Genéricos

## 17. Roteiro futuro de testes manuais caso um dia o helper seja movido
1. Abrir `Configurações > Tabelas > Intervenções / Procedimentos...`
2. Testar carregamento inicial dos selects
3. Abrir a listagem
4. Abrir um procedimento existente
5. Verificar selects do editor
6. Verificar combos com valor existente
7. Verificar combos com valor ausente
8. Testar `Selecione...`
9. Testar filtro/listagem
10. Testar tabela/modal/relatorio, se aplicavel
11. Testar vinculo com Procedimento Genérico
12. Trocar Procedimento Genérico e confirmar herdados/proprios
13. Conferir materiais proprios e herdados apenas visualmente
14. Confirmar que payload nao muda
15. Confirmar que salvamento nao muda
16. Confirmar que custos/reajuste nao mudam

## 18. Confirmações finais de segurança
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
