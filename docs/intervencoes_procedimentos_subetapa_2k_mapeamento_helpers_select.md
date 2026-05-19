# Subetapa 2K - Mapeamento dos helpers de select em Intervencoes / Procedimentos

## 1. Objetivo
Esta etapa e somente documental. O objetivo e mapear os helpers de select do modulo Intervencoes / Procedimentos para decidir, com criterio conservador, se algum deles pode virar uma extracao funcional futura ou se devem permanecer no `frontend/app.js` por enquanto.

## 2. Estado inicial
- Branch: `modularizacao-segura-fase-1`
- Ultimo commit: `7b9b7a7 Documenta reavaliacao do proximo bloco de Intervencoes`
- Status resumido: muitos `??` antigos em `docs/`, sem arquivos staged
- Diff inicial: `git diff --stat` vazio e `git diff --cached --stat` vazio no inicio desta etapa

## 3. Historico dos helpers ja extraidos
Os helpers ja extraidos para `frontend/js/modules/intervencoes-procedimentos.js`, com wrappers compativeis no `frontend/app.js`, sao:
- `procParse`
- `procFmtBr`
- `procFmtAuxLabel`
- `procFmtSimboloLabel`
- `procIndiceSiglaFromValor`

## 4. Escopo da 2K
Esta subetapa documenta exclusivamente os helpers de select:
- `procSetSelectValue`
- `procGarantirOpcaoSelect`
- `procPreencherSelect`

Nao ha movimento de codigo nesta etapa.

## 5. Mapeamento de `procSetSelectValue`
- Assinatura atual: `const procSetSelectValue=(el,val)=>{...}`
- Localizacao aproximada: bloco de helpers do editor em `frontend/app.js`
- Responsabilidade aparente: ajustar o `value` do select para um valor existente, ou cair no primeiro option disponivel
- Dependencia de DOM: sim, depende de `el.options` e escreve em `el.value`
- Dependencia de select: sim, e generico, mas atua sempre em `select`
- Altera value: sim
- Adiciona option: nao
- Limpa/preenche opcoes: nao
- Dispara evento: nao explicitamente
- Altera estado global: nao diretamente
- Participa de payload: nao diretamente
- Participa de salvamento: nao diretamente, mas influencia campos que depois entram no payload
- Participa de materiais/vinculos: nao diretamente
- Participa de `procedimento_generico_id`: nao diretamente
- Participa de custos/reajuste: nao diretamente
- Chamadas observadas:
  - `procAplicarDadosEditor`
  - `procCarregarFiltros`
  - `procTabelaPreencherOrigens`
  - `procTabelaPreencherIndices`
  - `procTabelaPreencherTiposTiss`
  - `procTabelaAtualizarFonte`
  - `procTabelaSalvarModal`
  - `procRelatorio` e outros usos de selecao
- Risco de mover: medio
- Motivo do risco: corpo pequeno, mas usado em muitos pontos do editor e em tabelas auxiliares; pode alterar comportamento visual e selecao ativa
- Testes necessarios se houver extracao futura:
  - abrir editor com e sem generico
  - abrir tabela modal
  - abrir relatorio
  - conferir se selects continuam apontando para o valor correto
  - conferir console e selecao visual

## 6. Mapeamento de `procGarantirOpcaoSelect`
- Assinatura atual: `function procGarantirOpcaoSelect(el,valor,rotulo="")`
- Localizacao aproximada: bloco de helpers do editor em `frontend/app.js`
- Responsabilidade aparente: garantir que exista uma option para um valor atual antes de seleciona-lo
- Dependencia de DOM: sim, cria `option` e faz `appendChild`
- Dependencia de select: sim, atua em `select` generico
- Altera value: nao diretamente
- Adiciona option: sim
- Limpa/preenche opcoes: nao
- Dispara evento: nao explicitamente
- Altera estado global: nao diretamente
- Participa de payload: nao diretamente
- Participa de salvamento: nao diretamente, mas influencia o campo que depois pode ser salvo
- Participa de materiais/vinculos: nao diretamente
- Participa de `procedimento_generico_id`: sim, porque garante opcoes atuais em `cboGenerico`
- Participa de custos/reajuste: nao diretamente
- Chamadas observadas:
  - `procAplicarDadosEditor`
  - `procVinculaPrepararEdicao`
  - `procTabela` em fluxos de modal e edicao
  - blocos de simbolos e anamnese
- Risco de mover: medio
- Motivo do risco: mexe no DOM de forma direta e e chamado em muitos fluxos; erro aqui pode causar select sem valor ou opcoes duplicadas
- Testes necessarios se houver extracao futura:
  - abrir procedimento existente
  - verificar selecoes preservadas em generico, especialidade, simbolo e cobranca
  - testar edicao de vinculo
  - testar tabela modal

## 7. Mapeamento de `procPreencherSelect`
- Assinatura atual: `function procPreencherSelect(el,itens,{placeholder="Selecione...",valueFrom=(item)=>item?.id??"",labelFrom=(item)=>item?.descricao??item?.nome??item?.codigo??""}={})`
- Localizacao aproximada: bloco de helpers do editor em `frontend/app.js`
- Responsabilidade aparente: construir o HTML das options de um select a partir de uma lista
- Dependencia de DOM: sim, escreve em `el.innerHTML`
- Dependencia de select: sim, e o helper de preenchimento central do modulo
- Altera value: nao diretamente, mas altera o conteudo do select
- Adiciona option: sim, em massa
- Limpa/preenche opcoes: sim
- Dispara evento: nao explicitamente
- Altera estado global: nao diretamente
- Participa de payload: nao diretamente
- Participa de salvamento: nao diretamente, mas fornece as opcoes usadas pelo editor antes do save
- Participa de materiais/vinculos: nao diretamente
- Participa de `procedimento_generico_id`: sim, porque preenche `cboGenerico`
- Participa de custos/reajuste: nao diretamente
- Chamadas observadas:
  - `procPreencherEspecialidadesEditor`
  - `procCarregarCombosEditor`
  - `procCarregarFiltros`
  - `procTabelaPreencherOrigens`
  - `procTabelaPreencherIndices`
  - `procTabelaPreencherTiposTiss`
  - `procRelatorio`
  - blocos de simbolos, anamnese e outros formularios
- Risco de mover: medio
- Motivo do risco: e generico, pequeno e puro no sentido de nao fazer fetch/gravaacao, mas possui uso amplo em muitos combos e qualquer regressao afetaria bastante a tela
- Testes necessarios se houver extracao futura:
  - abrir editor
  - conferir populacao de genericos, simbolos e cobranca
  - abrir tabela modal
  - abrir relatorio
  - validar listas em fluxos de outros modulos que usam o mesmo helper

## 8. Relacao com DOM/select
Os tres helpers sao dependentes de DOM/select:
- `procSetSelectValue` muda o `value`
- `procGarantirOpcaoSelect` cria `option`
- `procPreencherSelect` reescreve `innerHTML`

Isso significa que eles nao sao candidatos tao puros quanto os helpers ja extraidos anteriormente. Mesmo sem rede ou gravacao, eles mexem diretamente na renderizacao de selects.

## 9. Relacao com payload/salvamento
Nao ha participacao direta na montagem de payload nem em `requestJson`. Porem:
- `procAplicarDadosEditor` usa esses helpers para preparar os campos antes da gravacao
- `procSalvar` le os valores que foram preenchidos nos selects

Conclusao: a relacao com payload e salvamento e indireta, mas real. O risco principal e visual/comportamental, com efeito possivel no valor efetivamente escolhido antes do save.

## 10. Relacao com materiais, vinculos e genericos
- Materiais: nao ha participacao direta
- Vinculos: nao ha participacao direta
- `procedimento_generico_id`: sim, porque `procGarantirOpcaoSelect` e `procPreencherSelect` alimentam `cboGenerico`
- `Procedimentos Genéricos`: sim, porque `procPreencherSelect` carrega a lista do generico

O risco aqui nao e de gravacao direta de materiais/vinculos, mas de afetar a selecao visual que o usuario leva para o save.

## 11. Relacao com custos e reajuste
- Custos: nao ha participacao direta
- Reajuste: nao ha participacao direta

Apenas o helper de select e usado em telas que tambem coexistem com outros fluxos do modulo, mas ele nao faz parte do calculo de reajuste nem dos totais.

## 12. Classificacao individual
- `procSetSelectValue`: cautela
- `procGarantirOpcaoSelect`: cautela
- `procPreencherSelect`: cautela

Motivo da classificacao:
- sao pequenos e nao fazem fetch
- mas dependem de DOM/select
- sao usados em muitos fluxos do modulo
- podem alterar a selecao visual de campos que depois entram em payload/salvamento

## 13. Candidato mais seguro, se existir
Entre os tres, o mais proximo de uma futura extracao seria `procSetSelectValue`, por ser o menor e o mais simples. Ainda assim, nesta altura ele continua em **cautela**, nao em "seguro", porque e usado de forma ampla e afeta diretamente a selecao visual.

## 14. Riscos encontrados
- alterar o option selecionado errado em selects amplamente usados
- perder selecao em generico, simbolo ou cobranca
- duplicar ou omitir opcoes legadas em selects
- mudar visualmente o estado do editor sem tocar no payload explicitamente
- gerar regressao pequena, mas espalhada, em varios pontos do modulo

## 15. Recomendacao objetiva da proxima etapa
Recomendacao conservadora: **C. Subetapa documental especifica sobre helpers de simbolo** nao e necessaria agora; o melhor proximo passo e **documentar mais** antes de mover qualquer helper de select.

Como proximo caminho, a recomendacao pratica e:
- manter os tres helpers em `frontend/app.js`
- registrar mais contexto se o time quiser extrair futuramente `procSetSelectValue`
- evitar extracao funcional ate existir um mapeamento ainda mais preciso dos fluxos que dependem desses helpers

## 16. Onde testar, caso a proxima etapa venha a ser funcional
Se uma futura subetapa funcional mexer nesses helpers, testar:
- Ctrl+F5
- abrir `Configuracoes > Tabelas > Intervencoes / Procedimentos...`
- abrir procedimento existente
- abrir procedimento com generico
- abrir procedimento sem generico
- conferir selecoes de generico, especialidade, simbolo e cobranca
- abrir tabela/modal relacionada e conferir selecoes
- abrir `% Reajusta tabela` apenas ate `Preview`, sem aplicar
- conferir console

## 17. Confirmacoes finais de seguranca
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

