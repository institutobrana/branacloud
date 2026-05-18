# Fechamento Documental - Ciclo do Reajuste de Tabela de Precos

Data: 2026-05-18

## 1) Resumo Executivo

- O ciclo funcional do botao `% Reajusta tabela...` foi concluido.
- As subetapas B1 (Preview sem gravacao) e B2A (Aplicacao real com confirmacao) foram testadas pelo usuario, com retorno: **"TESTES PASSARAM TODOS"**.
- O ciclo passou a ter:
  - Preview com amostra antes/depois (melhoria de seguranca no Brana Cloud);
  - Aplicacao real com confirmacao explicita e transacao.
- Os commits de B1 e B2A foram consolidados e enviados ao GitHub pelo usuario:
  - `0755bc6 Subetapa B1: preview reajuste de tabela sem gravacao`
  - `5e96bdd Subetapa B2A: aplicar reajuste de tabela com confirmacao`

## 2) Origem da Regra (EasyDental - Y:\\EDS70)

Fonte documental principal:

- `docs/investigacao_profunda_y_eds70_reajuste_tabela.md`

Regra recuperada (parcialmente) do desktop (via evidencias em `Y:\\EDS70\\EDS70.exe`):

- existe a tela "Reajusta tabela de precos";
- opcoes:
  - Aumentar precos em
  - Diminuir precos em
- percentual default `1,00`;
- confirmacao antes de aplicar ("Deseja realmente ...");
- tabela afetada: `TAB_PRC_ITEM`;
- campos atualizados: `VALOR_PACIENTE` e `VALOR_REPASSE`;
- filtro por tabela: `WHERE NROTAB = [pNrotab]`.

## 3) Equivalencias no Brana Cloud

Fonte documental:

- `docs/intervencoes_procedimentos_mapeamento_equivalencias_reajuste_tabela_y_eds70.md`

Equivalencias mapeadas:

- `TAB_PRC_ITEM` -> `Procedimento`
- `NROTAB` -> `procedimento.tabela_id`
- `VALOR_PACIENTE` -> `procedimento.preco`
- `VALOR_REPASSE` -> `procedimento.valor_repasse`

## 4) B1 - Preview Sem Gravacao

Fonte documental:

- `docs/intervencoes_procedimentos_subetapa_b1_reajuste_tabela_preview_sem_gravacao.md`

Entregas B1:

- modal de reajuste no frontend;
- endpoint de preview:
  - `GET /procedimentos/tabelas/reajuste-preview`
- calcula antes/depois em memoria e retorna:
  - total
  - amostra
- nenhuma gravacao no banco (sem UPDATE/DELETE/INSERT);
- commit:
  - `0755bc6 Subetapa B1: preview reajuste de tabela sem gravacao`.

## 5) B2A - Aplicacao Real com Confirmacao

Fonte documental:

- `docs/intervencoes_procedimentos_subetapa_b2a_aplicacao_real_reajuste_tabela_confirmacao.md`

Entregas B2A:

- endpoint separado para aplicacao real:
  - `POST /procedimentos/tabelas/reajuste-aplicar`
- confirmacao explicita:
  - backend exige `confirmar=true`;
  - frontend exibe confirmacao forte antes de enviar o POST;
- Preview continua obrigatorio:
  - botao Aplicar habilita somente apos Preview valido;
  - se percentual/modo/tabela mudar, Aplicar e desabilitado ate novo Preview;
- transacao/rollback;
- escopo estrito:
  - altera somente `procedimento.preco` e `procedimento.valor_repasse`;
  - filtra estritamente por `tabela_id`;
- commit:
  - `5e96bdd Subetapa B2A: aplicar reajuste de tabela com confirmacao`.

## 6) Decisao de UX (Brana Cloud x EasyDental)

- O EasyDental nao tinha a tabela de Preview visual no fluxo.
- O Brana Cloud manteve a tabela de Preview como **melhoria de seguranca**.
- O usuario aprovou manter esse Preview adicional (nao buscar identidade visual com o desktop).

## 7) Contratos Preservados (Escopo Restrito)

Confirmado como preservado no ciclo de reajuste:

- nao altera materiais;
- nao altera vinculos de materiais;
- nao altera `procedimento_generico_id`;
- nao altera Procedimentos Genericos;
- nao altera custos de materiais;
- nao altera custo laboratorio;
- nao reabre saneamento de vinculos legados.

## 8) Testes Realizados (Usuario)

Segundo o usuario, os testes do ciclo passaram:

- modal abre;
- preview funciona e mostra amostra antes/depois;
- Aplicar habilita somente apos Preview valido;
- confirmacao forte aparece antes de aplicar;
- aplicacao real funcionou em tabela segura;
- somente a tabela selecionada foi alterada;
- materiais/genericos/vinculos permaneceram iguais;
- "TESTES PASSARAM TODOS".

## 9) Estado Atual (Expectativa de Repositorio)

- B1 e B2A estao consolidadas e enviadas ao GitHub.
- Esperado apos consolidacao:
  - `git diff --stat` vazio
  - `git diff --cached --stat` vazio
- Existem pendencias untracked antigas (fora deste ciclo) e elas nao pertencem a este fechamento.

### Estado (capturado nesta sessao - somente leitura)

- Branch: `modularizacao-segura-fase-1`
- Commits recentes:

```
5e96bdd Subetapa B2A: aplicar reajuste de tabela com confirmacao
0755bc6 Subetapa B1: preview reajuste de tabela sem gravacao
```

- `git diff --stat`: (vazio)
- `git diff --cached --stat`: (vazio)

## 10) Riscos Remanescentes

- Uso indevido em tabela real sem backup/procedimento operacional.
- Arredondamento financeiro: regra do desktop nao foi 100% recuperada; no web a regra precisa estar explicitamente documentada.
- Aplicacao em massa: risco operacional por volume e escolha de tabela errada.
- Necessidade de treinamento do usuario (operacao potencialmente irreversivel sem auditoria formal completa).
- Possivel necessidade futura de log/auditoria formal (registro de before/after) para rollback assistido.

## 11) Onde Testar Novamente (Se Necessario)

1. Abrir: Configuracoes > Tabelas > Intervencoes / Procedimentos...
2. Selecionar tabela segura.
3. Clicar `% Reajusta tabela...`.
4. Executar Preview e conferir amostra antes/depois.
5. Aplicar (somente em ambiente seguro) e confirmar a mensagem forte.
6. Verificar:
   - somente a tabela selecionada mudou;
   - outra tabela nao mudou;
   - materiais/genericos/vinculos nao mudaram.

## 12) Proxima Recomendacao

Nao mexer mais no reajuste agora. Proximas opcoes (fora deste ciclo):

1. Organizar documentos pendentes de Intervencoes / Procedimentos (em etapa separada).
2. Commitar separadamente o namespace passivo (Subetapa 1) se for desejado.
3. Retomar modularizacao conservadora do modulo Intervencoes / Procedimentos.
4. Tratar pendencias antigas de Anamnese/restauracao em etapa separada, sem misturar com este ciclo.

