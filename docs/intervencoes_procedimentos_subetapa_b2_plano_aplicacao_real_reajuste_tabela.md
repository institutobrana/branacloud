# Subetapa B2 (Documental) - Plano de Aplicacao Real do Reajuste de Tabela (com confirmacao)

Data: 2026-05-18

## 1) Resumo Executivo

- A Subetapa B1 foi concluida, testada e consolidada em commit (`0755bc6 Subetapa B1: preview reajuste de tabela sem gravacao`).
- B1 entrega: modal + Preview (sem gravacao) e endpoint GET `/procedimentos/tabelas/reajuste-preview`.
- Esta Subetapa B2 e SOMENTE DOCUMENTAL: define um plano tecnico seguro para futura aplicacao real (gravacao) do reajuste de tabela.
- A aplicacao real (B2 funcional) NAO deve reutilizar o endpoint de preview e NAO deve permitir gravacao sem confirmacao explicita e sem transacao.

## 2) Estado Inicial do Git (somente leitura)

- Branch: `modularizacao-segura-fase-1`
- Ultimos commits (topo):

```
0755bc6 Subetapa B1: preview reajuste de tabela sem gravacao
a18cb48 Conclui modularizacao segura parcial de materiais
...
```

- `git status --short`: existem muitos untracked preexistentes (pendencias antigas). Nenhum arquivo tracked aparece modificado nesta etapa documental.
- `git diff --stat`: (vazio)
- `git diff --cached --stat`: (vazio)

## 3) Escopo da B2 Futura (Aplicacao Real)

Escopo estrito e obrigatorio:

- Aplicar reajuste somente na tabela selecionada (por `tabela_id`).
- Alterar somente:
  - `procedimento.preco`
  - `procedimento.valor_repasse`
- Regra do EasyDental (recuperada parcialmente):
  - aumentar: `novo = atual * (1 + percentual/100)`
  - diminuir: `novo = atual * (1 - percentual/100)`
- Restricao por tabela:
  - `WHERE procedimento.tabela_id = :tabela_id`

## 4) Fora de Escopo (B2 Futura)

Nao deve ser alterado por B2:

- Materiais / vinculos / heranca de materiais.
- `procedimento_generico_id` e qualquer fluxo de Procedimentos Genericos.
- Custos:
  - custo de material
  - custo de laboratorio (`custo_lab`)
  - qualquer campo/rotina de calculo de custos
- Saneamento de vinculos legados.
- Alteracao em massa em multiplas tabelas.
- Aplicacao por filtro (nao confirmado no EasyDental) - nao implementar sem nova decisao/documento.

## 5) Endpoint Futuro Proposto (Aplicacao Real)

Criar endpoint separado do preview.

Sugestao:

- `POST /procedimentos/tabelas/reajuste-aplicar`

Entrada (payload JSON) sugerida:

```json
{
  "tabela_id": "<id>" ,
  "modo": "aumentar|diminuir",
  "percentual": "1,00",
  "confirmar": true,
  "preview_hash": "<opcional>"
}
```

Regras do endpoint:

- Nunca aceitar gravacao via GET.
- Validar novamente (sempre): `tabela_id`, `modo`, `percentual`.
- Rejeitar se `confirmar != true`.
- Rejeitar se `tabela` estiver inativa.
- Restricao: atuar somente em `procedimento` com `tabela_id` informado.

Saida (resposta) sugerida:

```json
{
  "tabela": {"id": 1, "nome": "PARTICULAR"},
  "modo": "aumentar",
  "percentual": 1.0,
  "fator": 1.01,
  "total_afetado": 123,
  "amostra": [
    {"id": 10, "codigo": 1000, "preco_before": 100, "preco_after": 101, "valor_repasse_before": 0, "valor_repasse_after": 0}
  ]
}
```

Observacao:

- `preview_hash` e opcional: pode ser um hash calculado no preview para reduzir risco de aplicacao em parametros diferentes do preview.
- Se o projeto ja tiver padrao de idempotencia/auditoria, alinhar com o padrao existente.

## 6) Confirmacao Explicita (Frontend + Backend)

Frontend (UI):

- Exigir que o usuario execute Preview antes.
- Botao "Aplicar" deve permanecer oculto/desabilitado ate existir Preview valido (tabela_id + modo + percentual validados).
- Antes de aplicar, mostrar confirmacao forte (modal/confirm):
  - "Esta acao alterara precos da tabela selecionada. Deseja realmente continuar?"
- A UI NAO deve virar identica ao EasyDental; manter Preview como melhoria de seguranca.

Backend:

- Exigir `confirmar=true`.
- Validar novamente todos os parametros.
- Nao confiar em valores do frontend sem revalidacao.

## 7) Seguranca de Banco / Transacao

Requisitos:

- Usar transacao.
- Executar UPDATE somente em registros com `procedimento.tabela_id = :tabela_id`.
- Alterar somente `preco` e `valor_repasse`.
- Em erro, rollback.
- Retornar `total_afetado`.

Recomendacao adicional (controle de concorrencia):

- Opcional: lock por tabela_id durante a aplicacao (para evitar concorrencia com outra aplicacao simultanea).

## 8) Estrategia de Rollback / Auditoria

Como a B2 envolve alteracao em massa, precisa de plano de rollback e auditoria.

Opcoes (documentar e decidir antes de codar):

1. Snapshot em memoria + retorno de amostra:
   - antes do UPDATE, fazer SELECT dos ids e valores atuais (pelo menos para amostra).
   - retornar amostra before/after.
   - Limite: nao garante rollback completo.

2. Snapshot completo (recomendado para primeira execucao real):
   - gerar uma lista completa dos registros afetados e seus valores anteriores.
   - armazenar em log/auditoria (se existir tabela/padrao) OU export controlado em arquivo (se houver politica para isso).
   - permitir futura rotina de rollback guiada por operador.

3. Tabela de auditoria (se existir padrao no projeto):
   - registrar operacao: quem, quando, tabela_id, percentual, modo, quantidade.
   - registrar before/after por id (ideal para rollback).

Se nao existir padrao de auditoria no projeto:

- registrar como risco e condicionar a aplicacao real a um procedimento operacional (backup + aprovacao humana).

## 9) Nulos e Zeros (decisao obrigatoria antes de implementar)

Proposta conservadora:

- Se `preco` for NULL: manter NULL (nao transformar em 0).
- Se `valor_repasse` for NULL: manter NULL.
- Se for 0: permanecer 0 (0 * fator = 0).

Observacao:

- Confirmar se no Brana Cloud estes campos sao Float e se aparecem como 0 em vez de NULL; alinhar comportamento com a realidade do banco/model.

## 10) Arredondamento / Precisao

Risco conhecido: arredondamento exato do desktop nao foi recuperado.

Plano recomendado:

- Calcular com Decimal no backend e arredondar para 2 casas (regra explicita) antes de persistir.
- Evitar float na etapa de calculo.
- Documentar claramente a regra de arredondamento adotada (ex.: half-up) antes da gravacao.

Observacao:

- Se o banco for Numeric/Decimal, preferir manter Numeric no caminho completo.
- Se o model for Float, arredondar antes de atribuir.

## 11) UI Futura (B2 Funcional)

- Manter o modal atual da B1.
- Manter Preview como melhoria de seguranca.
- Adicionar botao Aplicar somente apos Preview.
- Ao aplicar, exibir confirmacao explicita e, se possivel, um resumo:
  - tabela
  - modo
  - percentual
  - total de itens afetados

Nao alterar textos existentes fora do necessario (blindagem mojibake).

## 12) Testes Obrigatorios Futuros (antes de liberar B2 funcional)

1. Usar tabela de teste.
2. Anotar valores antes (amostra).
3. Executar Preview.
4. Aplicar percentual pequeno (ex.: 1%).
5. Confirmar que valores mudaram somente naquela tabela.
6. Confirmar que outra tabela nao mudou.
7. Confirmar que materiais/genéricos/vinculos nao mudaram.
8. Testar cancelar (nao aplica).
9. Testar percentual invalido (negativo, texto, muito alto).
10. Testar diminuir garantindo que nao gere valores negativos.
11. Verificar console e rede.

## 13) Riscos (B2)

- Alteracao em massa irreversivel sem rollback.
- Aplicar em tabela errada.
- Arredondamento divergente do desktop.
- Tratamento incorreto de NULL/0.
- Aplicacao sem backup em tabela real.
- Confusao entre preco (paciente) e repasse.

## 14) Recomendacao Objetiva (proxima subetapa)

Recomendacao conservadora:

- Criar uma Subetapa B2A (ainda funcional, mas controlada) com:
  - endpoint POST de aplicacao real protegido por confirmacao forte;
  - exigencia de preview anterior;
  - transacao;
  - retorno de resumo + amostra;
  - e procedimento operacional de backup.

Somente depois:

- liberar o botao Aplicar para ambientes mais sensiveis.

## 15) Referencias

- `docs/intervencoes_procedimentos_subetapa_b1_reajuste_tabela_preview_sem_gravacao.md`
- `docs/investigacao_profunda_y_eds70_reajuste_tabela.md`
- `docs/intervencoes_procedimentos_especificacao_reajuste_tabela_precos_y_eds70.md`
- `docs/intervencoes_procedimentos_mapeamento_equivalencias_reajuste_tabela_y_eds70.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/fechamento_modularizacao_segura_parcial_materiais.md`
- `docs/contrato_funcional_regras_materiais_genericos_intervencoes.md`

Observacao:

- O arquivo citado em algumas instrucoes como `docs/consolidacao_validacao_manual_regras_materiais_genericos_intervencoes.md` nao foi localizado neste workspace no momento desta subetapa documental.
