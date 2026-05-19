# Subetapa 2H - Varredura de helpers passivos restantes

## 1. Resumo executivo

Os helpers mais seguros e pequenos ja foram extraidos nas Subetapas 2A, 2C e 2E. A normalizacao de forma de cobranca foi recusada na Subetapa 2G por risco de payload e salvamento.

Esta etapa faz uma varredura conservadora para verificar se ainda existe algum helper pequeno, passivo e seguro para extracao futura. Resultado: ainda existe pelo menos um candidato bem isolado, mas a maior parte dos demais helpers restantes ja entra em DOM, fluxo amplo ou caminhos sensiveis.

## 2. Estado atual

- Branch: `modularizacao-segura-fase-1`
- Ultimo commit: `e3036ae Mapeia normalizacao de forma de cobranca em Intervencoes`
- Status resumido: ha muitos `untracked` antigos em `docs/`; nesta avaliacao documental nao havia diff tracked novo antes da criacao deste documento.
- Confirmacao: havia ausencia de diff tracked antes da criacao deste documento, conforme a leitura documental.

## 3. Helpers ja extraidos

- `procParse`
- `procFmtBr`
- `procFmtAuxLabel`
- `procFmtSimboloLabel`

## 4. Helpers/candidatos recusados ate agora

- `procNormalizarFormaCobranca`
- `procNormalizarFormaCobrancaV2`

Motivo da recusa:

- aparecem no fluxo de aplicacao de dados e de salvamento;
- podem alterar o payload enviado ao backend;
- tocam persistencia, nao apenas exibicao;
- por isso foram classificados como risco medio/alto.

## 5. Mapa de candidatos remanescentes

### Seguro

- `procIndiceSiglaFromValor`
  - Localizacao aproximada: `frontend/app.js`, na regiao dos helpers de tabela / indice.
  - Justificativa: eh pequeno, deterministico e nao faz fetch, nao grava e nao manipula backend.
  - Efeito: converte valor em sigla de indice; nao toca payload persistido.
  - Classificacao: **seguro**.

### Cautela

- `procSetSelectValue`
  - DOM simples, mas usado amplamente em selects.
  - Nao grava, porem impacta UI de varios fluxos.
  - Classificacao: **cautela**.

- `procGarantirOpcaoSelect`
  - DOM simples, append de option legacy.
  - Nao grava, mas altera opcoes do formulario.
  - Classificacao: **cautela**.

- `procPreencherSelect`
  - Monta HTML de selects.
  - Nao grava, mas tem uso amplo e pode afetar UI visivel.
  - Classificacao: **cautela**.

- `procBuscarSimbolo`
  - Pequeno e sem fetch, mas depende de cache global de simbolos.
  - Pode ser extraido, mas ja conversa com fluxo visual de simbolo.
  - Classificacao: **cautela**.

- `procSimboloDescricao`
  - Usa `procBuscarSimbolo` para compor texto exibido.
  - Pequeno, mas ainda ligado a fluxo visual.
  - Classificacao: **cautela**.

### Proibido agora

- `procAplicarDadosEditor`
- `procRecarregarLinks`
- `procAtualizarMateriaisEditorVisualizacao`
- `procSalvar`
- `procExcluirSelecionado`
- `procConfirmarVinculo`
- `procEditarVinculoSelecionado`
- `procReajustePreview`
- `procReajusteAplicar`
- `procAtualizarFinanceiro`
- `procCorrigirRotulosEditor`
- `procAtualizarPreviewSimbolo`
- `procCarregarCombosEditor`
- `procCarregarFiltros`
- `procRenderList`
- `procSelecionado`
- `procAbrirProcedimentos`
- qualquer helper de materiais, vinculos, genérico, herança, custos, reajuste ou payload persistido

## 6. Proximo helper recomendado, se houver

O melhor candidato remanescente e `procIndiceSiglaFromValor`.

- Localizacao aproximada: `frontend/app.js`
- Por que e seguro: e um helper pequeno, puro e deterministico.
- Por que nao toca payload: ele so converte valores de indice/sigla.
- Por que nao toca materiais/vinculos/genéricos/reajuste: nao faz parte desses fluxos.
- Wrapper no `app.js`: pode ser mantido sem alterar chamadas atuais, da mesma forma que os helpers extraidos anteriores.

## 7. Se houver proxima extracao funcional

Subetapa futura sugerida:

- mover somente `procIndiceSiglaFromValor`;
- manter wrapper compativel no `app.js`;
- preservar assinatura e comportamento;
- testar a conversao de valores de indice nas telas de tabela;
- nao tocar em payload, materiais, vinculos, genéricos ou reajuste.

Arquivos esperados:

- `frontend/app.js`
- `frontend/js/modules/intervencoes-procedimentos.js`
- documento da futura subetapa

## 8. Se nao houver helper seguro

Ainda nao e necessario encerrar o ciclo de helpers pequenos, porque `procIndiceSiglaFromValor` segue como candidato seguro e bem isolado.

Mesmo assim, depois dele, a tendencia e pausar helpers pequenos e reavaliar outro bloco mais estrutural, porque o restante fica cada vez mais DOM/fluxo amplo.

## 9. Blocos proibidos por risco

- materiais
- vinculos
- `procedimento_generico_id`
- heranca
- salvamento
- exclusao
- duplicidade
- reajuste
- backend/endpoints
- normalizacao de forma de cobranca

## 10. Plano da proxima subetapa

Se for seguir com helper funcional:

- mover `procIndiceSiglaFromValor`;
- manter wrapper no `app.js`;
- preservar comportamento;
- testar a tela e o select relacionado;
- nao alterar textos visiveis;
- nao corrigir mojibake;
- nao alterar backend;
- nao mexer em vinculos, materiais, genéricos, custos ou reajuste.

Se nao for seguir com helper funcional:

- criar nova etapa documental para escolher outro bloco;
- ou encerrar o ciclo de helpers pequenos e passar a um bloco estrutural diferente.

## 11. Onde testar se houver proximas extracoes

- Ctrl+F5;
- abrir `Configurações > Tabelas > Intervenções / Procedimentos...`;
- abrir listagem;
- abrir procedimento existente;
- abrir procedimento com genérico;
- abrir procedimento sem genérico;
- conferir materiais proprios/herdados visualmente;
- abrir `% Reajusta tabela...` apenas ate `Preview`;
- conferir console.

## 12. Recomendacao objetiva

Recomendacao final: **mover `procIndiceSiglaFromValor` na proxima subetapa funcional minima**. Depois disso, a revisao deve voltar a ser conservadora, porque os proximos helpers tendem a ficar mais ligados a DOM, selecoes e fluxos amplos.

