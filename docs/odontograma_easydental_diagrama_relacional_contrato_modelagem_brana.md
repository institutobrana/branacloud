# Odontograma EasyDental - Diagrama relacional consolidado e contrato inicial de modelagem Brana

## 1. Objetivo

Consolidar, em formato documental, o diagrama relacional enxuto do odontograma EasyDental em uso e registrar um contrato inicial de modelagem futura para o odontograma do Brana Cloud.

## 2. Escopo

- Fonte principal consolidada: `docs/odontograma_easydental_auditoria_armazenamento_estados_cores_tabelas.md`
- Escopo funcional: odontograma
- Classificacao: modulo especifico de Odontologia
- Esta etapa e apenas documental

## 3. Confirmacao de etapa somente documental

- Nenhum codigo foi alterado
- Nenhum frontend foi alterado
- Nenhum backend foi alterado
- Nenhum banco foi alterado
- Nenhum seed foi alterado
- Nenhum arquivo do EasyDental foi alterado
- Nenhuma migration foi executada

## 4. Documentos de base consultados

- `docs/odontograma_easydental_auditoria_armazenamento_estados_cores_tabelas.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

Observacao:
- O documento de aprofundamento citado no pedido nao estava presente no workspace com o nome informado no momento desta consolidacao.
- A consolidacao foi feita com base no documento de auditoria ja existente e no roadmap.

## 5. Diagrama relacional textual

```text
PACIENTE (PESSOAL)
  └── TRATAMENTO
        ├── ARCADA
        │     └── slots/posicoes visuais da arcada
        │
        ├── INTERVENCAO
        │     ├── PRESTADOR
        │     ├── _STATUS_INTERV
        │     └── TAB_PRC_ITEM
        │           └── _SIMBOLO_ODONTO
        │
        ├── HISTORICO
        │     └── possivel vinculo com INTERVENCAO
        │
        ├── DENTE
        │
        └── FACE
```

### Leitura funcional em camadas

```text
Estrutura visual:
  TRATAMENTO -> ARCADA

Procedimentos:
  TRATAMENTO -> INTERVENCAO -> TAB_PRC_ITEM -> _SIMBOLO_ODONTO

Narrativa clinica:
  PACIENTE/TRATAMENTO/INTERVENCAO -> HISTORICO

Detalhamento anatomico:
  DENTE / FACE
```

## 6. Papel de cada tabela

| tabela | papel | observacao |
| --- | --- | --- |
| `PESSOAL` | paciente | entidade raiz do contexto observado |
| `TRATAMENTO` | tratamento/plano | pai de `ARCADA` e base do fluxo odontologico |
| `ARCADA` | slots visuais da arcada | 32 posicoes por tratamento; mais visual do que clinico puro |
| `INTERVENCAO` | execucao de procedimento | tabela central de registro de procedimentos |
| `TAB_PRC_ITEM` | catalogo de procedimento | define o item/procedimento e aponta para simbolo |
| `_SIMBOLO_ODONTO` | simbolo visual | define bitmap/icone/flags do desenho |
| `HISTORICO` | narrativa clinica/textual | receitas, observacoes e narrativa vinculada ao paciente/intervencao |
| `DENTE` | detalhamento por dente | importante para validar granularidade clinica |
| `FACE` | detalhamento por face | importante para validar granularidade anatomica |
| `_STATUS_INTERV` | status da intervencao | estado de execucao do procedimento |
| `_STATUS_PT` | status do tratamento | estado do tratamento/plano |
| `_TISS_REGIAO_PROCEDIMENTO` | regioes e marcacao | apoio para regiao/bitmask odontologica |

## 7. Fatos confirmados

- `ARCADA` possui 32 linhas no paciente 646.
- `ARCADA.NROTRA` referencia `TRATAMENTO.NROTRA`.
- `ARCADA.NRODEN` descreve a ordem dos slots visuais.
- `ARCADA.NROODONTO` mapeia a numeracao FDI da arcada.
- Existe pelo menos um slot especial com `NROODONTO = 0`.
- `INTERVENCAO` existe e esta populada na base.
- `INTERVENCAO` nao tinha linhas para o paciente 646 na fotografia consultada.
- `HISTORICO` no paciente 646 mostrou entradas textuais/receitas.
- `TAB_PRC_ITEM.NROSIM` referencia `_SIMBOLO_ODONTO.NROSIM`.
- `_SIMBOLO_ODONTO` usa `BITMAP1`, `BITMAP2`, `BITMAP3`, `ICONE`, `TIPMARCA`, `TIPSIMB`, `SOBREPOS` e `ESPECIAL`.
- Nao apareceu campo mestre unico de cor RGB para o odontograma.
- `DENTE` e `FACE` sao tabelas relevantes, mas nao trouxeram linhas para o paciente 646 nesta fotografia.

## 8. Inferencias seguras

- `ARCADA` e uma tabela de posicoes desenhaveis da arcada, nao apenas de dentes clinicos puros.
- `INTERVENCAO` e a tabela canonica de execucao de procedimento.
- `HISTORICO` e narrativa clinica/textual e pode ancorar uma intervencao, mas nao parece ser a tabela principal do procedimento.
- O desenho do odontograma e determinado por simbolos, bitmaps e flags, nao por uma cor RGB unica.
- `DENTE` e `FACE` devem servir para detalhamento anatomico e de marcaacao, mas precisam de validacao manual adicional.

## 9. O que o Brana deve evitar

- Nao misturar `ARCADA` com `INTERVENCAO`.
- Nao tratar `HISTORICO` como tabela principal de procedimento.
- Nao modelar cor como RGB simples sem validar simbolos e bitmaps.
- Nao assumir que `ARCADA` e dente clinico puro.
- Nao ignorar `DENTE` e `FACE`.

## 10. Proposta inicial de modelagem futura

### Estrutura de arcada e slots

- Tabela de arcada/slots por tratamento
- Guardar posicao, numero FDI, ordem visual, observacao e anomalias

### Procedimentos

- Tabela de intervencoes/procedimentos por tratamento
- Guardar paciente, tratamento, prestador, status, data, tabela de preco e regionamento

### Simbolos odontologicos

- Tabela de simbolos odontologicos
- Guardar bitmaps, icones, tipo de marca, sobreposicao e especialidade

### Faces e regioes

- Tabela de faces/regioes
- Guardar marcacoes anatomicas por dente/face e bitmasks de desenho

### Historico narrativo

- Tabela de historico narrativo
- Guardar observacoes, receitas, anexos textuais e relacao com intervencao

### Status de intervencao

- Tabela de status de intervencao
- Guardar estados como observada, realizar, realizada e correlatos

## 11. Riscos

- Tratar `ARCADA` como tabela clinica final pode gerar perda de significado visual.
- Ignorar `DENTE` e `FACE` pode deixar a modelagem futura sem granularidade anatmica.
- Assumir cor unica pode esconder o papel real dos bitmaps e simbolos.
- Reduzir `HISTORICO` a mero log pode quebrar a narrativa clinica.
- Recriar a estrutura sem validar a ligacao com `TRATAMENTO` e `TAB_PRC_ITEM` pode distorcer o fluxo legado.

## 12. Perguntas em aberto

- `STATORC` representa exatamente qual etapa visual ou comercial?
- `DENTE` e `FACE` passam a receber linhas em qual momento do fluxo?
- `HISTORICO` sempre referencia uma `INTERVENCAO` ou pode existir isolado?
- O simbolo visual vem do `ICONE` ou dos bitmaps associados?
- `ARCADA.ANOMALIAS` deve ser modelada como bitmask ou como entidade separada?
- Existe alguma regra de cor que nao apareceu na fotografia consultada?

## 13. Criterios minimos antes de codificar

- Confirmar a cardinalidade real entre `TRATAMENTO`, `ARCADA` e `INTERVENCAO`.
- Confirmar se `DENTE` e `FACE` sao persistencia obrigatoria ou apenas apoio visual.
- Confirmar o papel real de `HISTORICO` no fluxo do odontograma.
- Confirmar se o desenho usa somente simbolos/bitmaps ou tambem regras de cor adicionais.
- Confirmar se a modelagem futura precisa de uma tabela de regioes separada.
- Confirmar se os status de intervencao e tratamento precisam de tabela propria ou lookup reaproveitado.

## 14. Onde testar quando a implementacao futura existir

- Na tela do odontograma do EasyDental, comparando visualmente arcada, procedimentos, faces e historico.
- Na navegacao de paciente com tratamento ativo.
- Na grade inferior de procedimentos e seu reflexo na arcada.
- No fluxo de marcaacao por dente e por face.
- Em validacao manual de status de intervencao e tratamento.

## 15. Registro para roadmap

- Consolidacao do diagrama relacional do odontograma EasyDental realizada em etapa somente documental.
- Contrato inicial de modelagem futura para o odontograma Brana registrado sem implementacao.
- Modulo classificado como especifico de Odontologia.
- Nenhum codigo alterado.
- Nenhum banco alterado.
