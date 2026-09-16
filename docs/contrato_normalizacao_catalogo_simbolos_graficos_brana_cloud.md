# Contrato de normalizacao do catalogo de simbolos graficos

## 1. Problema comprovado

A auditoria anterior superestimou duplicidades ao agrupar `legacy_id NULL` como se fosse repeticao real. A validacao complementar mostrou:

- `legacy_id NULL` corresponde a um conjunto legitimo de registros sem identificador legado;
- ha duplicidades reais por `legacy_id` apenas dentro do subconjunto nao nulo;
- existem repeticoes legitimas por codigo, descricao e asset, decorrentes de escopos, origem de importacao e compatibilidade historica;
- os assets principais medidos entre `Y:\EDS70` e o React estao identicos nos casos amostrados.

## 2. Dados atuais

- total de registros em `simbolo_grafico_catalogo`: `559`
- `legacy_id` nao nulo: `320`
- `legacy_id` nulo: `239`
- `descricao` preenchida: `559`
- `imagem`/asset valido: `559`
- referencias em `procedimento`: `1029` linhas, `62` valores distintos
- referencias em `procedimento_generico`: `598` linhas, `61` valores distintos

## 3. Duplicidades reais

Consideradas reais apenas quando o valor analisado nao e `NULL` e ha mais de uma linha com a mesma chave dentro do mesmo recorte.

### 3.1 legacy_id

- duplicidades reais por `legacy_id` nao nulo: `81` grupos
- linhas repetidas acima do primeiro registro: `239`
- `legacy_id NULL` nao deve ser contado como duplicidade

### 3.2 codigo

- grupos repetidos por `codigo` normalizado: `138`
- linhas repetidas acima do primeiro registro: `421`

### 3.3 descricao

- grupos repetidos por `descricao` normalizada: `141`
- linhas repetidas acima do primeiro registro: `417`

## 4. Repeticoes legitimas

Os dados indicam que parte das repeticoes e legitima ou ao menos historicamente sustentada por:

- multiplos registros com o mesmo asset principal e mesma descricao;
- compatibilidade entre `_SIMBOLO_ODONTO` e catologo Brana;
- referencias de `procedimento` e `procedimento_generico` que apontam para o mesmo simbolo historico;
- registros sem `legacy_id`, que representam um subconjunto valido, e nao erro automatico.

## 5. Chave fisica

- `id` da tabela `simbolo_grafico_catalogo`

## 6. Chave logica

A chave logica nao deve ser apenas `legacy_id`, nem apenas `codigo`, nem apenas `descricao`.

Contrato recomendado para resolucao funcional:

- `legacy_id` quando presente;
- fallback para `codigo`;
- fallback para `descricao` apenas para exibicao, nao para identificacao principal.

## 7. Value do Select

Value tecnico recomendado para UI:

- `legacy_id` quando disponivel e valido;
- senao `codigo`.

Nao usar `descricao` como value.

## 8. Label

Label visual recomendado:

- `descricao`

Fallback de exibicao:

- `codigo`

## 9. Persistencia em Procedimentos

Contrato atual observado:

- `simbolo_grafico`
- `simbolo_grafico_legacy_id`

Conclusao:

- o procedimento possui informacao suficiente para resolver o simbolo correto quando `legacy_id` esta presente;
- quando apenas `simbolo_grafico` textual e persistido, a resolucao depende do catalogo e pode ficar menos deterministica se houver repeticoes de codigo.

## 10. Persistencia em Procedimentos genericos

Contrato atual observado:

- `simbolo_grafico`
- `simbolo_grafico_legacy_id` no payload e no frontend

Conclusao:

- o generico trabalha com o mesmo tipo de lookup e tem o mesmo risco de ambiguidade quando usa apenas texto sem chave estabilizada.

## 11. Regra de preview

Regra observada e sustentada:

1. `imagem_url`
2. `icone`
3. `bitmap1`
4. fallback de asset por nome

Nos simbolos amostrados, `BITMAP2` e `BITMAP3` nao sustentaram regra ativa.

## 12. Endpoint oficial

Endpoint oficial recomendado:

- `GET /cadastros/simbolos-graficos?scope=procedimentos`

Endpoint de apoio para genericos:

- `GET /cadastros/simbolos-graficos?scope=genericos`

Fallback legado:

- `GET /cadastros/auxiliares?tipo=Símbolo gráfico`

## 13. Compatibilidade legada

O contrato e compativel com:

- EasyDental desktop;
- legado web;
- Brana React atual.

Nos 10 assets amostrados, os arquivos entre `Y:\EDS70\Icones` e `frontend-react/public/assets/easy/` foram identicos em hash e dimensao.

## 14. Camada a ser corrigida

Decisao tecnica revisada apos validacao autenticada:

- **A** e a decisao final desta rodada: seguir com a implementacao do frontend React usando o contrato atual;
- **B** nao e necessaria nesta etapa, porque o backend autenticado ja entrega `scope=procedimentos` e `scope=genericos` com contratos validos para consumo;
- **C** nao e a proxima etapa, porque o foco atual nao e a tela administrativa de catalogo, e sim o consumo na frente `Procedimentos`;
- **D** fica descartada como decisao principal desta validacao, porque nao houve necessidade comprovada de normalizacao/importacao antes da tela consumidora.

Conclusao pratica:

- a proxima camada a implementar e o frontend consumidor, com lookup/preview ja existentes e sem inventar regra de backend.

## 15. Arquivos previstos

- `docs/auditoria_funcional_catalogo_simbolos_graficos_easydental_brana_cloud.md`
- `docs/contrato_normalizacao_catalogo_simbolos_graficos_brana_cloud.md`
- possivel ajuste futuro em docs de roadmap e contrato de implementacao das telas consumidoras

## 16. Banco previsto

Nesta etapa:

- nenhuma alteracao de banco;
- nenhuma migration;
- nenhuma constraint nova.

## 17. Necessidade ou nao de migration

- nao existe necessidade de migration para esta auditoria;
- qualquer correcao futura depende primeiro de confirmacao de regra e escopo.

## 18. Estrategia de rollback

Como nao houve implementacao, rollback nesta etapa nao se aplica.

Se houver implementacao futura, o rollback deve reverter apenas a camada alterada:

- importacao;
- backend de catalogo;
- mapeador frontend;
- ou assets.

## 19. Testes

Testes que sustentam o contrato:

- contagem SQL de `legacy_id` nulo e nao nulo;
- contagem de grupos repetidos nao nulos;
- leitura de amostras reais de 10 simbolos;
- comparacao de hash e dimensao dos assets;
- revisao dos mapeadores React.

## 20. Criterio de aceite

O contrato e considerado fechado quando:

- `legacy_id NULL` nao for mais tratado como duplicidade;
- valores duplicados forem classificados por chave e contexto;
- endpoint oficial estiver definido;
- o React souber escolher sem ambiguidade quando existir value duplicado;
- houver decisao clara sobre qual camada recebe a proxima correcao.

## 21. Decisao

Decisao tecnica final desta validacao autenticada:

- **A**: seguir com a implementacao do frontend React usando o contrato atual, sem alterar backend nesta etapa.

## 22. Proxima etapa exata

- implementar o consumo da tela `Procedimentos` com o contrato ja validado;
- manter o lookup do React preparado para resolver `legacy_id` quando existir e `codigo` como fallback;
- preservar o preview atual e evitar qualquer mudanca de backend enquanto a frente nao exigir nova regra comprovada;
- revalidar apenas se surgir novo caso de ambiguidade real no uso da tela.
