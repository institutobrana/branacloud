# Fase 2 - Plano de Contas - Contrato documental do próximo helper ou transformação segura

- **Data:** 2026-05-25
- **Diretório:** `D:\BRANA ARQUIVOS\BRANA CLOUD`
- **Branch:** `modularizacao-segura-fase-1`

## Objetivo

Definir, por leitura documental, qual seria o próximo helper ou transformação segura no módulo `Plano de Contas` antes de qualquer implementação.

## Contexto

A etapa anterior comparou `Cadastros auxiliares`, `Medicamentos` e `Plano de Contas` e concluiu que:

- `Cadastros auxiliares` ficou em baixo/médio, mas sem novo alvo claramente isolado;
- `Medicamentos` ficou em baixo/médio, porém já muito consolidado e com ganho adicional limitado;
- `Plano de Contas` ficou em médio e foi o único com recorte ainda plausível;
- a recomendação foi não implementar agora;
- a recomendação foi criar primeiro um contrato documental para `Plano de Contas`.

## Classificacao do modulo

`Plano de Contas` deve ser tratado como módulo comum/core administrativo/transversal, e não como módulo específico de área profissional.

## Estado atual conhecido do Plano de Contas

### Código funcional

O fluxo principal continua em `frontend/app.js`, especialmente:

- `planoEnsureUI()`
- `planoAbrir()`
- `planoDialogGrupo(ed = null)`
- `planoDialogCategoria(ed = null)`
- `planoExcluirGrupo()`
- `planoExcluirCategoria()`
- `planoCarregar()`
- `planoRenderGrupos()`
- `planoRenderCats()`

### Módulo já existente

Existe módulo em:

- `frontend/js/modules/plano-contas.js`

Namespace exposto:

- `window.BranaPlanoContasModule`

Helpers atualmente existentes:

- `validarNomeGrupo(nome)`
- `validarNomeCategoria(nome)`
- `montarPayloadGrupo(nome, tipo)`
- `montarPayloadCategoria(nome, grupo_id, tipo, tributavel)`
- `getStatus()`
- `info()`

### Relação com o app

O `app.js` já usa o módulo de forma mínima e reversível nos dialogs:

- `planoDialogGrupo(ed = null)` usa `validarNomeGrupo` e `montarPayloadGrupo` com fallback local
- `planoDialogCategoria(ed = null)` usa `validarNomeCategoria` e `montarPayloadCategoria` com fallback local

### Scaffold compartilhado

O bloco de Plano de Contas compartilha scaffold com outras áreas administrativas:

- `cadModalAbrir()`
- `planoEnsureUI()`
- estrutura visual montada em `app.js`

## Mapa funcional do fluxo atual

O fluxo atual de Plano de Contas está dividido assim:

- abertura do painel: no `app.js`
- renderização de grupos e categorias: no `app.js`
- seleção visual: no `app.js`
- modais de grupo/categoria: no `app.js`
- validação textual mínima e montagem de payload: delegadas ao módulo passivo quando disponível
- salvamento e exclusão: no `app.js`
- DOM, eventos e estado visual: no `app.js`

## Partes proibidas para futura implementação

Ainda não devem ser mexidas:

- DOM
- renderização
- modal
- seleção visual
- eventos
- `requestJson`
- payload
- salvamento
- exclusão
- permissões
- backend
- banco
- endpoints

## Candidatos de recorte avaliados

### 1. `validarNomeGrupo(nome)`

**Responsabilidade**

- validar nome de grupo de forma puramente local.

**Entradas**

- `nome`

**Saídas**

- objeto de validação `{ ok, nome, mensagem }`

**Dependências**

- nenhuma dependencia de DOM, `requestJson`, payload, salvamento ou backend

**Toca DOM?**

- nao

**Toca `requestJson`?**

- nao

**Toca payload?**

- nao

**Toca salvamento?**

- nao

**Toca backend/banco?**

- nao

**Risco**

- baixo

**Ganho esperado**

- baixo a médio, porque reduz validação repetida no `app.js`

**Facilidade de teste manual**

- alta

**Adequado como próximo helper seguro?**

- sim, mas já está integrado; não é o próximo alvo novo

---

### 2. `validarNomeCategoria(nome)`

**Responsabilidade**

- validar nome de categoria de forma puramente local.

**Entradas**

- `nome`

**Saídas**

- objeto de validação `{ ok, nome, mensagem }`

**Dependências**

- nenhuma dependencia sensível

**Toca DOM?**

- nao

**Toca `requestJson`?**

- nao

**Toca payload?**

- nao

**Toca salvamento?**

- nao

**Toca backend/banco?**

- nao

**Risco**

- baixo

**Ganho esperado**

- baixo a médio

**Facilidade de teste manual**

- alta

**Adequado como próximo helper seguro?**

- sim, mas também já está integrado; não é novo alvo

---

### 3. `montarPayloadGrupo(nome, tipo)`

**Responsabilidade**

- montar payload simples para criação/edição de grupo.

**Entradas**

- `nome`
- `tipo`

**Saídas**

- objeto `{ nome, tipo }`

**Dependências**

- nenhuma dependencia de DOM

**Toca DOM?**

- nao

**Toca `requestJson`?**

- nao diretamente

**Toca payload?**

- sim, mas apenas construindo o payload

**Toca salvamento?**

- nao diretamente

**Toca backend/banco?**

- nao diretamente

**Risco**

- baixo/médio

**Ganho esperado**

- médio, porque remove duplicação do payload e reduz o peso do dialog no `app.js`

**Facilidade de teste manual**

- alta

**Adequado como próximo helper seguro?**

- sim, e é o candidato mais promissor para futura transformação segura

---

### 4. `montarPayloadCategoria(nome, grupo_id, tipo, tributavel)`

**Responsabilidade**

- montar payload simples para criação/edição de categoria.

**Entradas**

- `nome`
- `grupo_id`
- `tipo`
- `tributavel`

**Saídas**

- objeto `{ nome, grupo_id, tipo, tributavel }`

**Dependências**

- nenhuma dependencia de DOM

**Toca DOM?**

- nao

**Toca `requestJson`?**

- nao diretamente

**Toca payload?**

- sim, mas apenas construindo o payload

**Toca salvamento?**

- nao diretamente

**Toca backend/banco?**

- nao diretamente

**Risco**

- baixo/médio

**Ganho esperado**

- médio, porque reduz duplicação de payload e ajuda a manter os dialogs pequenos

**Facilidade de teste manual**

- alta

**Adequado como próximo helper seguro?**

- sim, junto com `montarPayloadGrupo`, mas ainda deve vir depois de contrato documental

## Comparação dos candidatos

| Candidato | Responsabilidade | Risco | Ganho esperado | Facilidade de teste | Observação |
|---|---|---:|---|---|---|
| `validarNomeGrupo` | validação local | baixo | baixo/médio | alta | já consolidado no módulo |
| `validarNomeCategoria` | validação local | baixo | baixo/médio | alta | já consolidado no módulo |
| `montarPayloadGrupo` | montagem de payload | baixo/médio | médio | alta | melhor próximo recorte seguro |
| `montarPayloadCategoria` | montagem de payload | baixo/médio | médio | alta | bom candidato, mas depende de contrato claro |

## Candidato recomendado

### Recomendação

O candidato mais seguro e mais útil para o próximo contrato é:

- `montarPayloadGrupo(nome, tipo)`

### Por que ele venceu

- é pequeno;
- é puramente transformacional;
- não precisa de DOM;
- não precisa de `requestJson`;
- não precisa de seletor visual;
- não mexe em backend, banco, permissões ou endpoints;
- reduz duplicação real no `app.js`;
- permite fallback local simples.

### Candidato secundário imediato

- `montarPayloadCategoria(nome, grupo_id, tipo, tributavel)`

### Observação conservadora

Ainda assim, a recomendação atual não é implementar já. O correto é primeiro manter o contrato documental e só depois decidir a extração mínima.

## Contrato funcional do candidato recomendado

### Assinatura conceitual sugerida

```js
montarPayloadGrupo(nome, tipo)
```

### O que entra

- nome bruto do grupo
- tipo bruto do grupo

### O que sai

- objeto normalizado com os campos necessários ao payload:
  - `nome`
  - `tipo`

### O que fica proibido na futura implementação

- tocar em DOM;
- tocar em `requestJson`;
- tocar em payload fora da montagem;
- tocar em salvamento;
- tocar em exclusão;
- tocar em permissões;
- tocar em backend/banco/endpoints;
- corrigir textos visíveis ou mojibake;
- alterar o comportamento do modal;
- alterar o comportamento visual da grade;
- alterar seleção ou abas.

### Delegação futura possível no `app.js`

Se houver implementação futura, os dialogs podem apenas delegar a montagem do payload, mantendo fallback local:

- `planoDialogGrupo(ed = null)`
- `planoDialogCategoria(ed = null)`

## Limites da futura implementação

- a implementação futura deverá ser pequena;
- a implementação futura deverá preservar comportamento;
- a implementação futura não poderá alterar texto visível;
- a implementação futura não poderá corrigir mojibake;
- a implementação futura não poderá alterar backend/banco/endpoints/permissões;
- a implementação futura não poderá alterar payload/salvamento/`requestJson`;
- a implementação futura deverá ter teste manual obrigatório antes de qualquer validação documental.

## Onde testar futuramente

Se houver implementação futura, o teste deve ocorrer em:

- `Cadastros > Plano de contas`
- abrir o painel
- validar a listagem atual
- validar criação de grupo
- validar edição de grupo
- validar criação de categoria
- validar edição de categoria
- validar campos visuais e comportamento atual do modal
- validar que payload/salvamento não foram alterados
- validar que nada mudou visualmente além da preservação do comportamento já existente

## Riscos remanescentes

- o fluxo principal ainda está em `frontend/app.js`;
- o scaffold compartilhado com outras áreas administrativas exige cautela;
- qualquer nova delegação deve preservar fallback local;
- se o próximo passo tocar em payload ou modal, a fronteira precisa estar bem escrita antes.

## Confirmação de que nenhuma alteração de código foi feita

- nenhuma alteração de código foi feita nesta etapa documental;
- nenhum arquivo funcional foi modificado;
- nenhum endpoint, payload, modal ou fluxo visual foi alterado.

## Confirmação de blindagem textual/mojibake

- a blindagem textual/mojibake foi respeitada;
- nenhum texto visível, acento, label, placeholder ou mensagem de interface foi corrigido;
- qualquer texto quebrado já observado deve permanecer apenas como pendência futura.

## Commit seletivo obrigatório

- revisar `git status --short` antes do commit;
- revisar `git diff -- docs/11_roadmap_desenvolvimento.md docs/fase_2_plano_contas_contrato_helper_seguro.md`;
- adicionar apenas os dois arquivos autorizados;
- executar commit seletivo e push da branch `modularizacao-segura-fase-1`.

## Registro para roadmap

- foi criado o contrato documental para o próximo helper/transformação segura de `Plano de Contas`;
- `Plano de Contas` foi tratado como módulo comum/core administrativo/transversal;
- o candidato mais promissor para futura implementação ficou sendo `montarPayloadGrupo(nome, tipo)`, com `montarPayloadCategoria` como secundário imediato;
- não houve alteração de código;
- a blindagem textual/mojibake foi respeitada;
- a próxima subetapa recomendada é a implementação mínima contratual de `montarPayloadGrupo` apenas após nova validação documental.
