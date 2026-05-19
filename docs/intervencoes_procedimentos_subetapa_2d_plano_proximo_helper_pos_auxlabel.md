# Subetapa 2D - Plano do proximo helper seguro apos `procFmtAuxLabel`

## 1. Resumo executivo

A Subetapa 2C foi concluida e `procFmtAuxLabel` ja foi extraido para o modulo de Intervencoes / Procedimentos. Esta etapa escolhe o proximo helper seguro para futura extracao funcional, sem mover codigo ainda.

O candidato mais provavel continua sendo `procFmtSimboloLabel`, porque ele e pequeno, tem comportamento visual isolado e nao toca em materiais, vinculos, genérico, custos ou reajuste.

## 2. Estado atual

- Branch: `modularizacao-segura-fase-1`
- Ultimo commit: `a48906a Subetapa 2C: extrai procFmtAuxLabel para modulo de Intervencoes`
- Status resumido: ha muitos `untracked` antigos em `docs/`; nao ha diff tracked novo para esta etapa no momento da avaliacao documental.
- Confirmacao: o historico anterior ja havia mostrado ausencia de diff tracked antes da criacao deste documento.

## 3. Mapa resumido dos candidatos encontrados

### Candidatos pequenos

- `procFmtSimboloLabel`
- `procNormalizarFormaCobranca`
- `procNormalizarFormaCobrancaV2`

### Observacao

Entre os candidatos acima, `procFmtSimboloLabel` parece o melhor encaixe para a proxima extracao minima. As funcoes de normalizacao de forma de cobranca podem ter uso mais amplo e devem ser tratadas com mais cautela.

## 4. Bloco recomendado para proxima extracao

### Função recomendada

- `procFmtSimboloLabel`

### Localizacao aproximada

- `frontend/app.js`

### Motivo de seguranca

- e pequena;
- e predominantemente visual/pura;
- nao faz fetch;
- nao grava;
- nao abre modal;
- nao mexe com materiais, vinculos, genérico ou custos;
- nao participa do fluxo de reajuste de tabela;
- pode continuar com wrapper no `app.js` sem quebrar chamadas atuais.

### Por que nao mexe em dados

`procFmtSimboloLabel` atua como helper de formatacao de rótulo/simbolo e, por natureza, nao deveria alterar estado nem persistir informacao.

## 5. Blocos descartados por risco

- `procAtualizarMateriaisEditorVisualizacao`
- `procRecarregarLinks`
- `procAplicarDadosEditor`
- `procSalvar`
- `procExcluirSelecionado`
- `procEditarVinculoSelecionado`
- `procConfirmarVinculo`
- `procReajustePreview`
- `procReajusteAplicar`
- `procAtualizarFinanceiro`
- helpers de normalizacao que possam ter dependencia ampla demais, se confirmado no codigo

## 6. Plano da proxima subetapa funcional

- mover somente `procFmtSimboloLabel`;
- manter wrapper no `frontend/app.js`, se necessario;
- preservar assinatura e comportamento;
- nao alterar textos visiveis;
- nao corrigir mojibake;
- nao alterar backend;
- nao mexer em vinculos, materiais, genéricos, custos ou reajuste.

## 7. Checks obrigatorios da proxima subetapa

- `node --check frontend/app.js`
- `node --check frontend/js/modules/intervencoes-procedimentos.js`

## 8. Onde testar na proxima subetapa

- Ctrl+F5;
- abrir `Configuracoes > Tabelas > Intervencoes / Procedimentos...`;
- abrir listagem;
- abrir procedimento existente;
- abrir procedimento com genérico;
- abrir procedimento sem genérico;
- conferir visualmente labels e simbolos relacionados;
- conferir materiais proprios e herdados visualmente;
- abrir `% Reajusta tabela...` apenas ate `Preview`, sem aplicar;
- conferir console.

## 9. Recomendacao objetiva

O proximo helper a mover primeiro deve ser `procFmtSimboloLabel`.

Arquivos esperados na proxima subetapa funcional:

- `frontend/app.js`
- `frontend/js/modules/intervencoes-procedimentos.js`
- documento da futura subetapa funcional

Arquivos que nao devem ser alterados:

- `frontend/index.html`
- `backend`
- banco / schema / migrations
- fluxo de materiais, vinculos, genérico, custos e reajuste

