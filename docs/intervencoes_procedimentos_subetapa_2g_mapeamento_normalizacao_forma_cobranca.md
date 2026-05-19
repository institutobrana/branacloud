# Subetapa 2G - Mapeamento de `procNormalizarFormaCobranca` e `procNormalizarFormaCobrancaV2`

## 1. Resumo executivo

A Subetapa 2F recomendou cautela. Esta etapa mapeia exclusivamente a normalizacao de forma de cobranca para entender onde ela e definida, onde e chamada e qual o impacto real no fluxo de edicao e salvamento.

Conclusao preliminar: as duas funcoes aparecem ligadas ao payload de salvamento e, por isso, ainda nao parecem candidatas seguras para extracao imediata.

## 2. Estado atual

- Branch: `modularizacao-segura-fase-1`
- Ultimo commit: `0abd0c5 Documenta avaliacao do proximo bloco seguro de Intervencoes`
- Status resumido: ha muitos `untracked` antigos em `docs/`; no estado documental desta avaliacao nao havia diff tracked novo antes da criacao deste documento.
- Confirmacao: havia ausencia de diff tracked antes da criacao deste documento, conforme o mapeamento documental.

## 3. Helpers ja extraidos

- `procParse`
- `procFmtBr`
- `procFmtAuxLabel`
- `procFmtSimboloLabel`

## 4. Mapa de `procNormalizarFormaCobranca`

- Definicao: em `frontend/app.js`, proximo da regiao de combinacoes e editor de procedimentos.
- Chamadas observadas: aparece no fluxo de preenchimento do editor e no fluxo de salvamento.
- Fluxos onde aparece:
  - abertura / preenchimento do editor;
  - montagem de payload de salvamento;
  - fluxo de criacao / alteracao.
- Afeta visual: de forma indireta, porque o valor normalizado entra no select e na representacao do formulario.
- Afeta payload: sim, porque o valor normalizado vai para `forma_cobranca` no objeto enviado ao backend.
- Risco: medio/alto.

### Uso observado

O helper aparece associado a `procAplicarDadosEditor` e `procSalvar`, e o valor normalizado eh usado tanto para a exibicao inicial quanto para a composicao do payload.

## 5. Mapa de `procNormalizarFormaCobrancaV2`

- Definicao: em `frontend/app.js`, junto da versao anterior, como variacao mais nova da mesma normalizacao.
- Chamadas observadas: tambem aparece nos fluxos de preenchimento do editor e de salvamento.
- Fluxos onde aparece:
  - abertura / preenchimento do editor;
  - montagem de payload de salvamento;
  - fluxo de criacao / alteracao.
- Afeta visual: de forma indireta, pelo valor mostrado/selecionado no formulario.
- Afeta payload: sim, porque tambem normaliza `forma_cobranca` no payload.
- Risco: medio/alto.

### Uso observado

Essa versao participa do fluxo mais recente do editor e do salvamento. Mesmo sem fazer fetch ou manipular DOM diretamente, ela pode alterar o valor persistido ao backend.

## 6. Comparacao entre as duas funcoes

- Ambas fazem normalizacao de textos de forma de cobranca.
- Ambas sao puras no sentido de nao fazerem fetch, DOM ou gravacao direta.
- Ambas influenciam o valor que pode ser enviado ao backend.
- `procNormalizarFormaCobrancaV2` parece ser a versao mais nova / predominante nas redefinicoes posteriores do bloco do editor.
- Existe indicio de uso legado e uso posterior coexistindo no arquivo, o que aumenta a cautela.
- Nao ha evidencia documental suficiente, nesta etapa, para afirmar que uma substitui a outra sem risco.

## 7. Avaliacao de risco

### `procNormalizarFormaCobranca`

- Risco: medio/alto
- Relacao com salvamento: direta
- Relacao com backend: direta, via payload
- Relacao com dados persistidos: direta

### `procNormalizarFormaCobrancaV2`

- Risco: medio/alto
- Relacao com salvamento: direta
- Relacao com backend: direta, via payload
- Relacao com dados persistidos: direta

## 8. Recomendacao objetiva

Recomendacao: **D) nao mover nenhuma ainda**.

Motivo:

- as funcoes estao ligadas ao payload de salvamento;
- podem alterar o valor persistido em `forma_cobranca`;
- ha coexistencia de versoes que sugere dependencia de compatibilidade;
- o ganho de modularizacao aqui e menor que o risco de regressao.

## 9. Se recomendar mover no futuro

Se uma futura subetapa decidir mover alguma normalizacao, ela deve:

- ser precedida por mapeamento adicional mais especifico;
- manter wrapper compativel no `app.js`;
- preservar assinatura e comportamento;
- ser testada manualmente em edicao, criacao e salvamento seguro;
- nao alterar textos visiveis;
- nao corrigir mojibake;
- nao mexer em materias, vinculos, genéricos, custos ou reajuste.

Arquivos potenciais de uma subetapa futura:

- `frontend/app.js`
- `frontend/js/modules/intervencoes-procedimentos.js`
- documento da futura subetapa

## 10. Blocos descartados por risco

- vinculos
- materiais
- `procedimento_generico_id`
- heranca
- salvamento amplo
- exclusao
- duplicidade
- reajuste
- backend / endpoints

## 11. Onde testar caso seja movido no futuro

- Ctrl+F5;
- abrir `Configurações > Tabelas > Intervenções / Procedimentos...`;
- abrir procedimento existente;
- verificar campo / forma de cobranca, se visivel;
- editar forma de cobranca sem salvar, se possivel;
- abrir procedimento com genérico;
- abrir procedimento sem genérico;
- conferir materiais proprios e herdados visualmente;
- se houver teste de salvamento em futura etapa, fazer somente em registro seguro;
- abrir `% Reajusta tabela...` apenas ate `Preview`;
- conferir console.

## 12. Recomendacao final

Manter `procNormalizarFormaCobranca` e `procNormalizarFormaCobrancaV2` no `app.js` por enquanto. A proxima etapa mais conservadora e continuar a documentacao ou procurar outro helper com menor risco.

