# Subetapa 2F - Avaliacao do proximo bloco seguro apos `procFmtSimboloLabel`

## 1. Resumo executivo

A Subetapa 2E foi concluida e os helpers de parse, formatacao e label ja foram extraidos para o modulo passivo. Esta etapa avalia, com cautela, se a normalizacao da forma de cobranca tambem e segura para a proxima extracao funcional.

Conclusao preliminar: por estar ligada ao fluxo de edicao e salvamento, a normalizacao de forma de cobranca deve ser tratada com mais conservadorismo do que os helpers puramente visuais.

## 2. Estado atual

- Branch: `modularizacao-segura-fase-1`
- Ultimo commit: `49db0a9 Subetapa 2E: extrai procFmtSimboloLabel para modulo de Intervencoes`
- Status resumido: ha muitos `untracked` antigos em `docs/`; no momento da avaliacao documental nao havia diff tracked novo alem do que ja estava em andamento no frontend.
- Confirmacao: havia ausencia de diff tracked antes da criacao deste documento, quando analisado no estado documental da etapa.

## 3. Helpers ja extraidos

- `procParse`
- `procFmtBr`
- `procFmtAuxLabel`
- `procFmtSimboloLabel`

## 4. Mapa dos candidatos

### `procNormalizarFormaCobranca`

- Localizacao aproximada: `frontend/app.js`
- Uso observado: aparece no fluxo de aplicacao dos dados do editor e no fluxo de salvamento.
- Natureza: utilitaria, mas com impacto potencial em payload.
- Possivel efeito: altera o valor enviado em `forma_cobranca` durante o salvamento.
- Risco: medio/alto, porque nao e apenas visual; toca o dado persistido.

### `procNormalizarFormaCobrancaV2`

- Localizacao aproximada: `frontend/app.js`
- Uso observado: tambem aparece no fluxo de aplicacao dos dados do editor e no fluxo de salvamento.
- Natureza: utilitaria, mas com impacto potencial em payload.
- Possivel efeito: altera o valor enviado em `forma_cobranca` durante o salvamento.
- Risco: medio/alto, com a mesma cautela do helper anterior.

### Observacao de uso

Os dois helpers aparecem em caminhos que preparam a UI e, principalmente, montam o payload de gravacao. Isso os torna menos seguros que helpers puramente visuais.

## 5. Avaliacao de risco

### `procNormalizarFormaCobranca`

- Risco: medio/alto
- Dependencias: campos do editor e payload de salvamento
- Toca dados antes do salvamento: sim, na normalizacao do valor que sera enviado
- Toca valores enviados ao backend: sim
- Aparece no fluxo de edicao: sim
- Aparece no fluxo de criacao: sim
- Aparece no fluxo de atualizacao visual: sim, indiretamente

### `procNormalizarFormaCobrancaV2`

- Risco: medio/alto
- Dependencias: campos do editor e payload de salvamento
- Toca dados antes do salvamento: sim, na normalizacao do valor que sera enviado
- Toca valores enviados ao backend: sim
- Aparece no fluxo de edicao: sim
- Aparece no fluxo de criacao: sim
- Aparece no fluxo de atualizacao visual: sim, indiretamente

## 6. Bloco recomendado para proxima extraicao

Recomendacao objetiva: **D) nao mover normalizacao ainda**.

Motivo:

- os helpers estao ligados ao payload de salvamento;
- a extracao anterior priorizou helpers puros e visuais;
- aqui ha risco maior de regressao funcional;
- a dupla de helpers sugere uma necessidade de reavaliacao mais especifica antes de separar codigo.

## 7. Justificativa

Nao parece seguro mover `procNormalizarFormaCobranca` ou `procNormalizarFormaCobrancaV2` neste momento sem uma analise adicional do fluxo completo de gravacao.

Apesar de serem pequenos, eles podem influenciar diretamente o valor persistido em `forma_cobranca`, o que os aproxima do caminho de salvamento e aumenta o risco de regressao. Um wrapper no `app.js` ate ajudaria na compatibilidade, mas nao elimina o risco funcional do helper em si.

## 8. Blocos descartados por risco

- vinculos
- materiais
- `procedimento_generico_id`
- heranca
- salvamento
- exclusao
- duplicidade
- reajuste
- backend / endpoints
- normalizacao ampla sem mapeamento mais detalhado

## 9. Plano da proxima subetapa funcional, se houver

Se a normalizacao for movida no futuro, deve-se:

- mover somente o helper recomendado, se vier a ser aprovado;
- manter wrapper no `app.js`;
- preservar assinatura;
- preservar comportamento;
- nao alterar textos visiveis;
- nao corrigir mojibake;
- nao alterar backend;
- nao mexer em vinculos, materiais, genéricos, custos ou reajuste;
- nao mexer em salvamento sem uma prova clara de seguranca.

## 10. Checks obrigatorios da proxima subetapa

- `node --check frontend/app.js`
- `node --check frontend/js/modules/intervencoes-procedimentos.js`

## 11. Onde testar na proxima subetapa

- Ctrl+F5;
- abrir `Configurações > Tabelas > Intervenções / Procedimentos...`;
- abrir listagem;
- abrir procedimento existente;
- observar forma de cobranca, se visivel;
- abrir procedimento com genérico;
- abrir procedimento sem genérico;
- conferir materiais proprios/herdados visualmente;
- nao salvar se a subetapa nao exigir;
- abrir `% Reajusta tabela...` apenas ate `Preview`, sem aplicar;
- conferir console.

## 12. Recomendacao objetiva

Recomendacao final: **pausar antes de mover qualquer helper de normalizacao de forma de cobranca**.

Arquivos que seriam alterados numa futura subetapa funcional:

- `frontend/app.js`
- `frontend/js/modules/intervencoes-procedimentos.js`
- documento da futura subetapa

Arquivos que nao devem ser alterados nesta fase:

- `frontend/index.html`
- backend
- banco / schema / migrations
- fluxo de materiais, vinculos, genéricos, custos e reajuste

