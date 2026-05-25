# Fase 2 - Comparacao documental restrita entre Cadastros auxiliares, Medicamentos e Plano de Contas

- **Data:** 2026-05-25
- **Diretório:** `D:\BRANA ARQUIVOS\BRANA CLOUD`
- **Branch:** `modularizacao-segura-fase-1`

## Objetivo

Comparar documentalmente `Cadastros auxiliares`, `Medicamentos` e `Plano de Contas` para decidir se algum deles oferece o próximo recorte de risco médio controlado mais seguro, sem alterar código.

## Contexto

A etapa anterior criou o documento:

- `docs/fase_2_nova_selecao_recorte_medio_pos_preferencias.md`

Commit anterior:

- `beb443aed967d5e5dde6a046a8e208afbafe498d`

Resultado da etapa anterior:

- `Preferências / Configurações comuns` foi consolidada novamente após validação de `prefAmbienteSecoesAtuais`.
- `Prestadores` permanece consolidado após validação de `prestFiltrarLista`.
- Nenhum novo candidato amplo apareceu com fronteira suficientemente segura.
- A recomendação registrada foi fazer uma comparação documental mais restrita entre `Cadastros auxiliares`, `Medicamentos` e `Plano de Contas`.

## Candidatos avaliados

### 1. Cadastros auxiliares

**Estado atual conhecido**

- já existe módulo em `frontend/js/modules/auxiliares.js`;
- o módulo é passivo e expõe `window.BranaAuxiliaresModule`;
- o histórico documental indica ciclo já consolidado;
- `frontend/app.js` ainda concentra o fluxo operacional principal;
- a frente não aparece como nova abertura clara, mas como família já muito documentada.

**Possíveis fronteiras pequenas ou médias**

- funções puras textuais e de normalização:
  - `auxTipoEh`
  - `auxNormalizarHexCor`
  - `auxCorrigirMojibake`
  - `auxCorApresentacaoNormLabelKey`
  - `auxCorApresentacaoHexPorLabel`
  - `auxCorApresentacaoCorLabel`
  - `auxCorApresentacaoOpcoesHtml`
- transformações internas sem DOM e sem `requestJson`
- preparações de dados e formatos visuais pequenos

**Riscos**

- o fluxo principal ainda está no `app.js`;
- há dependência indireta de apresentação e scaffold compartilhado;
- a maior parte do comportamento já foi documentada como ciclo consolidado;
- risco de reentrar em uma frente já encerrada em vez de abrir um novo recorte realmente útil.

**Ganho esperado**

- redução pontual de `frontend/app.js`;
- clareza arquitetural em helpers textuais e de apresentação;
- baixo risco se o recorte for só de função pura;
- rollback mental simples em caso de erro.

**Teste manual provável se houver implementação futura**

- abrir `Cadastros > Tabelas auxiliares`;
- validar cor, normalização e apresentação visual dos itens;
- confirmar que não houve regressão em seleção e lista.

**Classificação de risco**

- **baixo/médio**

**Aceitável como próximo recorte médio controlado?**

- não ainda como escolha imediata;
- faltou um recorte novo suficientemente isolado para justificar implementação já nesta rodada.

---

### 2. Medicamentos

**Estado atual conhecido**

- já existe módulo em `frontend/js/modules/medicamentos.js`;
- o módulo é passivo e expõe helpers simples;
- o ciclo documental anterior foi encerrado;
- `frontend/app.js` ainda concentra o fluxo funcional;
- não apareceu uma nova fronteira pequena claramente melhor que as demais.

**Possíveis fronteiras pequenas ou médias**

- normalização e validação textual:
  - `normalizarTextoMedicamento`
  - `validarNomeMedicamento`
  - `validarGrupoMedicamento`
  - `compararTextoMedicamento`
- transformações internas sem DOM
- verificações puras de texto

**Riscos**

- o módulo já está praticamente consolidado;
- a nova frente seria mais uma reentrada documental do que um recorte novo;
- eventual ampliação pode encostar em DOM, busca, filtros e persistencia;
- baixo ganho real adicional para a redução do `app.js`.

**Ganho esperado**

- pouca redução adicional de `app.js`;
- helper puro simples;
- risco baixo se restrito a texto, mas ganho limitado.

**Teste manual provável se houver implementação futura**

- abrir `Cadastro > Medicamentos`;
- validar lista, busca por nome e grupo;
- conferir mensagens e retorno visual sem erro.

**Classificação de risco**

- **baixo/médio**

**Aceitável como próximo recorte médio controlado?**

- nao como escolha imediata;
- o módulo já está muito próximo de consolidado e não mostrou um novo recorte claramente vencedor.

---

### 3. Plano de Contas

**Estado atual conhecido**

- já existe módulo em `frontend/js/modules/plano-contas.js`;
- o módulo é passivo;
- a trilha documental anterior encerrou o ciclo de helpers puros;
- `frontend/app.js` continua com os dialogs e parte da orquestração;
- há scaffold compartilhado com outras áreas administrativas.

**Possíveis fronteiras pequenas ou médias**

- validadores e montadores de payload:
  - `validarNomeGrupo`
  - `validarNomeCategoria`
  - `montarPayloadGrupo`
  - `montarPayloadCategoria`
- pequenas transformações de dados sem DOM

**Riscos**

- a área ainda toca payload e fluxo sensível de cadastro;
- há compartilhamento de scaffold e dependências de modal;
- o ganho arquitetural seria real, mas o risco de tocar em contratos de edição é maior que em Cadastros auxiliares e Medicamentos;
- existe maior chance de mexer em mensagens e dados persistidos.

**Ganho esperado**

- redução moderada de `frontend/app.js`;
- maior clareza em validação e montagem de payload;
- teste manual relativamente simples, mas o contrato precisa ser muito bem amarrado.

**Teste manual provável se houver implementação futura**

- abrir `Cadastros > Plano de contas`;
- testar criação/edição de grupo e categoria;
- confirmar validação de nome e preservação do comportamento atual.

**Classificação de risco**

- **médio**

**Aceitável como próximo recorte médio controlado?**

- talvez, mas ainda exige contrato documental mais específico antes de qualquer implementação.

## Comparacao por candidato

| Candidato | Estado atual | Possiveis fronteiras | Risco | Ganho no app.js | Teste futuro simples | Aceitavel agora? |
|---|---|---|---|---|---|---|
| Cadastros auxiliares | já modularizado, ciclo histórico consolidado | helpers textuais e de apresentação | baixo/médio | baixo a médio | sim | nao ainda |
| Medicamentos | já modularizado, ciclo encerrado | validadores e normalizadores textuais | baixo/médio | baixo | sim | nao |
| Plano de Contas | já modularizado, fluxo com dialogs/payload | validadores e montadores de payload | médio | médio | sim | talvez, com contrato antes |

## Recomendacao final

**Opcao E - Criar antes um contrato funcional documental do candidato mais promissor.**

### Candidato mais promissor

`Plano de Contas`

### Justificativa

- entre os três, é o único que ainda aparece com um recorte médio plausível sem parecer apenas reentrada em ciclo já encerrado;
- `Cadastros auxiliares` e `Medicamentos` estão mais próximos de ciclos já consolidados e não mostram um novo alvo pequeno suficientemente claro;
- `Plano de Contas` ainda pode oferecer um ganho real de redução em `frontend/app.js`, desde que o próximo passo seja apenas documental e com fronteira estreita;
- a escolha por contrato documental antes de codificar mantém a linha conservadora.

### Por que isso e seguro

- evita começar implementação sem a fronteira estar escrita;
- reduz o risco de tocar cedo em dialogs, payload e persistência;
- preserva rollback mental simples;
- mantém o escopo menor que uma retomada ampla de `Preferências`, `Prestadores` ou `Agenda principal`.

### Por que nao e trabalho pesado amplo

- a etapa recomendada é só documental;
- o contrato futuro pode ser limitado a poucos helpers puros;
- não há exigência de mexer em backend, banco, permissões ou módulos novos.

## Proxima subetapa recomendada

`Plano de Contas - Contrato documental do proximo helper ou transformacao segura`

## Onde testar futuramente se houver implementacao

- `Cadastros > Plano de contas`
- fluxo de criação/edição de grupo
- fluxo de criação/edição de categoria
- validação de nome
- preservação do comportamento atual do modal e do save

## Riscos remanescentes

- qualquer novo recorte ainda pode encostar em payload e modal;
- `Plano de Contas` compartilha scaffold com outras áreas administrativas;
- `Cadastros auxiliares` e `Medicamentos` não foram descartados para sempre, apenas não venceram esta comparação restrita;
- qualquer texto quebrado ou mojibake deve continuar apenas como pendência documental futura.

## Registro de blindagem textual/mojibake

Esta etapa foi exclusivamente documental. Nenhum texto visível, acento, label, placeholder ou mensagem de interface foi corrigido nesta entrega.

## Confirmacao de que nenhuma alteracao de codigo foi feita

- nenhum arquivo de código foi alterado nesta rodada;
- nenhuma alteração funcional foi aplicada;
- nenhuma função foi movida;
- nenhum endpoint, payload, módulo ou fluxo visual foi modificado.

## Commit seletivo obrigatório

- Revisar `git status --short` antes do commit;
- revisar `git diff -- docs/11_roadmap_desenvolvimento.md docs/fase_2_comparacao_restrita_cadastros_medicamentos_plano_contas.md`;
- fazer `git add` somente dos dois arquivos autorizados;
- executar `git commit` seletivo e `git push` da branch `modularizacao-segura-fase-1`.

## Registro para roadmap

- Esta comparação documental restrita entre `Cadastros auxiliares`, `Medicamentos` e `Plano de Contas` foi realizada.
- O candidato recomendado foi `Plano de Contas`, mas apenas para receber antes um contrato documental funcional.
- A próxima etapa não deve ser implementação imediata; deve ser contrato documental.
- Nenhum código foi alterado nesta etapa.
- A blindagem textual/mojibake foi respeitada.
