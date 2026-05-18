# Subetapa B2A (Funcional Controlada) - Aplicacao Real do Reajuste de Tabela (com confirmacao)

Data: 2026-05-18

## 1) Resumo

- B1 (ja consolidada): modal + Preview (sem gravacao) e endpoint `GET /procedimentos/tabelas/reajuste-preview`.
- B2 (documental): plano de aplicacao real com seguranca.
- Esta B2A implementa a aplicacao real **de forma controlada**:
  - endpoint separado (POST) para aplicar;
  - confirmacao explicita;
  - botao Aplicar desabilitado ate Preview valido;
  - transacao;
  - escopo estrito: somente `procedimento.preco` e `procedimento.valor_repasse` na tabela selecionada.

Importante:

- O Codex **nao executou reajuste real** durante o desenvolvimento.
- Nenhum UPDATE/DELETE/INSERT foi executado manualmente fora do endpoint implementado.

## 2) Estado Inicial do Git (somente leitura)

- Branch: `modularizacao-segura-fase-1`
- Ultimo commit consolidado: `0755bc6 Subetapa B1: preview reajuste de tabela sem gravacao`
- `git diff --cached --stat`: (vazio)

Observacao:

- Existem muitos arquivos untracked antigos (pendencias preexistentes) que nao fazem parte desta subetapa.

## 3) Arquivos Alterados (B2A)

- `backend/routes/procedimentos_routes.py`
- `frontend/app.js`
- `frontend/index.html`

Arquivo do namespace passivo nao alterado:

- `frontend/js/modules/intervencoes-procedimentos.js` (permaneceu passivo)

Documento criado nesta subetapa:

- `docs/intervencoes_procedimentos_subetapa_b2a_aplicacao_real_reajuste_tabela_confirmacao.md` (este arquivo)

## 4) Endpoint Criado (Aplicacao Real, Separado do Preview)

Preview (B1, permanece somente leitura):

- `GET /procedimentos/tabelas/reajuste-preview` (sem gravacao)

Aplicacao real (B2A, endpoint separado):

- `POST /procedimentos/tabelas/reajuste-aplicar`

Payload (JSON) esperado:

```json
{
  "tabela_id": "1",
  "modo": "aumentar|diminuir",
  "percentual": "1,00",
  "confirmar": true
}
```

Retorno (resumo):

- `tabela { id, codigo, nome, fonte_pagadora }`
- `modo`, `percentual`, `fator`
- `total_atualizado`
- `amostra[]` (ate 10 itens) com before/after de `preco` e `valor_repasse`

## 5) Diferenca Entre Preview e Aplicacao

- Preview (GET):
  - apenas calcula e retorna amostra/contagem;
  - nao grava nada.

- Aplicacao (POST):
  - valida novamente parametros e confirmacao;
  - executa transacao e grava somente os campos permitidos;
  - retorna resumo e amostra.

## 6) Validacoes Implementadas (Backend)

No `POST /procedimentos/tabelas/reajuste-aplicar`:

1. `tabela_id` obrigatorio e resolvido via `_resolver_tabela_id`.
2. Tabela deve existir e estar ativa (`_load_tabela_or_404` + `_validar_tabela_ativa`).
3. `modo` deve ser `aumentar` ou `diminuir`.
4. `percentual` obrigatorio, numerico, aceita virgula PT-BR.
5. `percentual > 0`.
6. Bloqueio de percentuais absurdos (`> 1000`).
7. `confirmar` deve ser `true` (confirmacao obrigatoria).
8. Fator nao pode ser negativo.
9. Bloqueio se a tabela nao tiver procedimentos (`total == 0`).
10. Bloqueio se houver valores negativos em `preco` ou `valor_repasse` na tabela (operacao bloqueada para nao mascarar dados ruins).

## 7) Transacao / Rollback

- A aplicacao real executa dentro de um bloco `try/except` com:
  - `db.commit()` ao final;
  - `db.rollback()` em caso de `SQLAlchemyError`.

Objetivo:

- se qualquer erro ocorrer, nenhuma atualizacao parcial deve ficar aplicada.

## 8) Tratamento de Nulos e Zeros

Decisao implementada:

- Se `procedimento.preco` for `NULL`: permanece `NULL` (nao vira 0).
- Se `procedimento.valor_repasse` for `NULL`: permanece `NULL`.
- Se valor for 0: continua 0 apos multiplicacao.

## 9) Arredondamento / Precisao

- Implementado calculo com `Decimal` e arredondamento explicito para 2 casas:
  - `quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)`
- O valor persistido e convertido para float somente apos o arredondamento (compatibilidade com o model atual).

Risco remanescente:

- regra exata de arredondamento do desktop nao foi recuperada 100% (B2A adotou regra explicita e documentada).

## 10) Garantia de Escopo (Contratos Preservados)

Confirmacoes:

- A aplicacao atua somente na tabela selecionada (filtro por `Procedimento.tabela_id`).
- Atualiza somente:
  - `procedimento.preco`
  - `procedimento.valor_repasse`
- Nao altera:
  - materiais
  - vinculos de materiais
  - `procedimento_generico_id`
  - Procedimentos Genericos
  - custos de material
  - custo laboratorio
  - saneamento de vinculos legados

## 11) Frontend (Botao Aplicar Controlado)

No modal existente:

- Preview permanece obrigatorio.
- O botao `Aplicar` inicia desabilitado.
- `Aplicar` so habilita apos Preview valido.
- Se percentual, modo (radio) ou tabela mudar apos Preview, o Preview e invalidado e o botao `Aplicar` volta a ficar desabilitado.
- Ao clicar `Aplicar`:
  - exibe confirmacao forte via `window.confirm(...)`;
  - envia POST para `/procedimentos/tabelas/reajuste-aplicar`;
  - ao sucesso, mostra resumo e recarrega a lista (`procCarregarLista()`).

## 12) Riscos Remanescentes

- Alteracao em massa exige procedimento operacional (backup/ambiente de teste antes do primeiro uso real).
- Volume: aplicacao real itera todos os procedimentos da tabela (pode ser pesado em tabelas grandes).
- Arredondamento do desktop: nao confirmado; B2A usa regra explicita de 2 casas.
- Se no EasyDental existia percentual separado para `VALOR_PACIENTE` e `VALOR_REPASSE` (pValor1/pValor2):
  - B2A aplica o mesmo percentual aos dois campos, alinhado ao fluxo atual do modal.

## 13) Onde Testar (Usuario - em tabela segura/de teste)

1. Garantir ambiente seguro (ou backup) antes do primeiro teste real.
2. Ctrl+F5.
3. Abrir: Configuracoes > Tabelas > Intervencoes / Procedimentos...
4. Selecionar tabela segura.
5. Anotar 2-3 precos antes.
6. Abrir `% Reajusta tabela...`.
7. Informar percentual pequeno (ex.: 1,00) e escolher aumentar/diminuir.
8. Clicar Preview e conferir amostra.
9. Confirmar que `Aplicar` so habilitou apos Preview.
10. Alterar percentual e confirmar que `Aplicar` desabilita ate novo Preview.
11. Clicar Cancela e confirmar que nada muda.
12. Rodar Preview novamente.
13. Clicar Aplicar.
14. Confirmar a mensagem forte.
15. Conferir que somente a tabela selecionada mudou.
16. Conferir que outra tabela nao mudou.
17. Conferir que materiais/genéricos/vinculos nao mudaram.
18. Verificar console e rede (GET preview + POST aplicar).

## 14) Blindagem Textual / Mojibake

- Nenhuma correcao textual global foi realizada.
- Se existir mojibake em strings novas/antigas, tratar como risco documental e corrigir apenas com autorizacao especifica.

## 15) Checks

Executar (obrigatorio apos mudancas):

```
node --check frontend/app.js
node --check frontend/js/modules/intervencoes-procedimentos.js
python -m py_compile backend/routes/procedimentos_routes.py
```

## 16) Observacao sobre documentos citados

- O arquivo citado em algumas instrucoes como `docs/consolidacao_validacao_manual_regras_materiais_genericos_intervencoes.md` nao foi localizado neste workspace no momento desta subetapa; os contratos foram considerados via documentos existentes (incluindo o contrato funcional de materiais/genericos/intervencoes).

