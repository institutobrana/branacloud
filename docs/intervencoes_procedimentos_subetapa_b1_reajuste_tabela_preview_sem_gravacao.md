# Subetapa B1 — Reajuste de Tabela (Preview Sem Gravacao) — Fechamento Documental

Data: 2026-05-18

## 1) Contexto e Decisao

O botao `% Reajusta tabela...` existe na tela:

- Configuracoes > Tabelas > Intervencoes / Procedimentos...

Historicamente, no web, o bind existia mas a funcao associada era um stub sem modal funcional.

Nesta Subetapa B1 foi implementado:

- um **preview sem gravacao** (somente leitura) no backend;
- um **modal de reajuste + tabela de preview** no frontend;
- mantendo o botao **Preview** como recurso adicional de seguranca (nao existe no EasyDental, mas foi aceito pelo usuario).

Decisao do usuario:

- diferenca visual em relacao ao EasyDental foi aceita;
- a tabela de Preview deve ser mantida como seguranca adicional;
- B1 permanece **somente preview** (sem aplicacao real, sem UPDATE).

## 2) Estado Inicial do Git (no inicio do fechamento documental)

- Branch: `modularizacao-segura-fase-1`
- Ultimo commit: `a18cb48 Conclui modularizacao segura parcial de materiais`

### git status --short

```
 M backend/routes/procedimentos_routes.py
 M frontend/app.js
 M frontend/index.html
?? (diversos arquivos untracked preexistentes; nao alterados nesta etapa documental)
```

### git diff --stat

```
 backend/routes/procedimentos_routes.py | 92 ++++++++++++++++++++++++++++++++++
 frontend/app.js                        | 21 +++++---
 frontend/index.html                    | 44 ++++++++++++++++
 3 files changed, 150 insertions(+), 7 deletions(-)
```

### git diff --cached --stat

```
(vazio)
```

## 3) Arquivos Alterados na Subetapa B1

Arquivos modificados (B1):

- `backend/routes/procedimentos_routes.py`
- `frontend/app.js`
- `frontend/index.html`

Justificativa para alteracao em `frontend/index.html`:

- inclusao do markup do **modal de reajuste/preview** (backdrop + inputs + tabela de amostra);
- o preview exige elementos DOM fixos no HTML, seguindo o padrao do monolito.

## 4) Endpoint Criado (Somente Leitura)

Endpoint:

- `GET /procedimentos/tabelas/reajuste-preview`

Parametros (querystring):

- `tabela_id` (obrigatorio)
- `modo` (opcional): `aumentar` | `diminuir` (default `aumentar`)
- `percentual` (opcional): numero, aceita virgula PT-BR (ex: `1,00`) (default `0`)
- `limit` (opcional): limite da amostra (default `20`, clamp `1..50`)

Retorno (estrutura):

- `tabela`: `id`, `codigo`, `nome`, `fonte_pagadora`
- `modo`, `percentual`, `fator`
- `total`: total de procedimentos na tabela selecionada
- `amostra[]`: lista com itens contendo:
  - `id`, `codigo`, `nome`
  - `preco_before`, `preco_after`
  - `valor_repasse_before`, `valor_repasse_after`

Garantia de que e somente leitura:

- endpoint e **GET**;
- implementacao faz **SELECT + calculo** (sem UPDATE/DELETE/INSERT);
- nao existe botao "Aplicar" funcional e nao existe endpoint de aplicacao real nesta subetapa.

## 5) Confirmacoes de Escopo (B1)

- Nao existe aplicacao real (B2 nao implementada).
- Nao ha UPDATE/DELETE/INSERT.
- Nao ha botao Aplicar funcional.
- O botao Preview e intencional e deve ser mantido.
- Diferenca visual em relacao ao EasyDental foi aceita pelo usuario.

## 6) Namespace Passivo Preservado

- `frontend/js/modules/intervencoes-procedimentos.js` permaneceu passivo.
- Nenhuma funcao foi movida para o namespace.

## 7) Contratos Preservados (Nao Afetados Pela B1)

Nao houve alteracao em:

- materiais proprios/herdados;
- Procedimentos Genericos / procedimento_generico_id;
- vinculos de materiais;
- saneamento de vinculos legados;
- modais/fluxos de vincular material;
- calculo financeiro/custos (fora do preview de `preco` e `valor_repasse` exibido na amostra).

Backend foi alterado apenas para suportar o **preview**.

## 8) Checks Executados

```
node --check frontend/app.js
node --check frontend/js/modules/intervencoes-procedimentos.js
python -m py_compile backend/routes/procedimentos_routes.py
```

Resultado:

- OK (sem erros de sintaxe).

## 9) Riscos Remanescentes (Para B2 / Implementacao Real)

- Arredondamento: regra exata do desktop nao foi confirmada (casas/round/trunc).
- Valores nulos/zero: definir claramente se devem ser reajustados ou preservados.
- Aplicacao real futura exige:
  - confirmacao explicita do usuario;
  - transacao;
  - estrategia de rollback/log;
  - teste em tabela de teste;
  - impedir percentual invalido e preco negativo;
  - garantir que somente a tabela selecionada seja afetada.
- Se `VALOR_PACIENTE` e `VALOR_REPASSE` no EasyDental sempre recebem o mesmo percentual:
  - B1 aplica o mesmo fator aos dois campos (preview);
  - B2 deve confirmar essa regra antes de gravar.

## 10) Onde Testar no Sistema Antes de Avancar

1. Ctrl+F5 no navegador.
2. Abrir: Configuracoes > Tabelas > Intervencoes / Procedimentos...
3. Selecionar uma tabela (ex: PARTICULAR).
4. Clicar: `% Reajusta tabela...` (deve abrir modal).
5. Informar percentual e escolher Aumentar/Diminuir.
6. Clicar Preview.
7. Validar:
   - resumo mostra total + tamanho da amostra;
   - tabela lista Codigo/Nome/Preco antes/depois/Repasse antes/depois.
8. Validar que nao grava:
   - fechar modal;
   - abrir 1-2 procedimentos e confirmar valores inalterados.
9. Verificar console do navegador e aba Rede:
   - deve haver somente GET para `/procedimentos/tabelas/reajuste-preview`.

## 11) Confirmacoes de Restricoes (Fechamento Documental)

- Nenhum arquivo foi criado/editado/salvo/documentado em:
  - `Y:\EDS70`
  - `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO`
  - `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\Dados`
  - `D:\UTIL\EasyDental_7.6_BR`
  - `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO`
- Blindagem textual/mojibake foi respeitada (nenhuma "correcao textual" oportunista).

## 12) Estado Final do Git (apos criacao deste documento)

Observacao: este documento e o unico arquivo novo criado neste fechamento.

### git status --short

Resumo:

- Arquivos modificados (tracked): 3
- Arquivos untracked: 62 (preexistentes) + este documento

Trecho relevante:

```
 M backend/routes/procedimentos_routes.py
 M frontend/app.js
 M frontend/index.html
?? docs/intervencoes_procedimentos_subetapa_b1_reajuste_tabela_preview_sem_gravacao.md
?? (demais untracked preexistentes; nao alterados nesta etapa documental)
```

### git diff --stat

```
 backend/routes/procedimentos_routes.py | 92 ++++++++++++++++++++++++++++++++++
 frontend/app.js                        | 21 +++++---
 frontend/index.html                    | 44 ++++++++++++++++
 3 files changed, 150 insertions(+), 7 deletions(-)
```

### git diff --cached --stat

```
(vazio)
```
