# Especificacao (somente documental) - Reajuste de tabela de precos - Base Y:\EDS70

## 1. Resumo executivo

- No web atual, o botao `% Reajusta tabela...` existe e esta bindado, mas o handler `procReajustarTabela` e um stub (mensagem "em planejamento"), sem modal e sem endpoint dedicado.
- A investigacao profunda em `Y:\EDS70` recuperou evidencias reais do desktop (EasyDental/EDS70) dentro de `Y:\EDS70\EDS70.exe`, incluindo tela, opcoes, confirmacao e templates SQL de aplicacao.
- A implementacao futura no Brana Cloud deve seguir a **regra funcional** do EasyDental, mas com **seguranca adicional no web** (preview, confirmacao explicita, rollback planejado e escopo estrito por tabela).

## 2. Evidencia recuperada do EasyDental (Y:\EDS70)

Origem das evidencias:

- `Y:\EDS70\EDS70.exe` (strings extraidas em modo somente leitura; sem engenharia reversa invasiva)

Evidencias de UI (desktop):

- existe a tela/janela "Reajusta tabela de precos" (em strings aparece como `Reajusta tabela de preÃ§os` por encoding).
- opcoes de radio:
  - `Aumentar preÃ§os em`
  - `Diminuir preÃ§os em`
- campo de percentual:
  - identificador `mePercentual`
  - valor inicial `1,00`
- confirmacao antes de aplicar:
  - `Deseja realmente aumentar os precos da tabela ... em ... % ?`
  - `Deseja realmente diminuir os precos da tabela ... em ... % ?`

Evidencias de regra (templates SQL no executavel):

- tabela afetada: `TAB_PRC_ITEM`
- campos atualizados:
  - `VALOR_REPASSE`
  - `VALOR_PACIENTE`
- filtro/escopo:
  - `WHERE NROTAB = [pNrotab]` (tabela selecionada)
- formula (aumento/diminuicao) observada nas strings:
  - aumento: `VALOR_* = VALOR_* * ( [pValor] / 100 + 1 )`
  - diminuicao: `VALOR_* = VALOR_* * ( 1 - [pValor] / 100 )`

Observacao: tambem foi encontrado o indicio de comando/icone `Y:\EDS70\Icones\cmd_reajusta.bmp`, consistente com a existencia da acao no desktop.

## 3. Regra funcional inferida (baseada no achado)

Fluxo funcional (desktop -> comportamento esperado no web):

1. Usuario seleciona uma tabela de precos (ex.: PARTICULAR) no modulo de procedimentos/intervencoes.
2. Usuario clica em `% Reajusta tabela...`.
3. Sistema abre a tela/modal de reajuste identificando a tabela atual.
4. Usuario informa um percentual.
5. Usuario escolhe "Aumentar" ou "Diminuir".
6. Sistema pede confirmacao explicita ("Deseja realmente...").
7. Sistema aplica o reajuste **somente** nos itens da tabela selecionada.
8. Sistema recarrega a lista/visao da tabela apos aplicar.

## 4. Formula proposta (derivada do achado)

Definicoes:

- `percentual` = valor informado pelo usuario (ex.: 1,00)
- `fator_aumento` = `1 + (percentual / 100)`
- `fator_diminuicao` = `1 - (percentual / 100)`

Aplicacao por item da tabela selecionada:

- aumento:
  - `novo_valor = valor_atual * fator_aumento`
- diminuicao:
  - `novo_valor = valor_atual * fator_diminuicao`

No EasyDental, a evidencia indica aplicacao em dois campos:

- `VALOR_PACIENTE`
- `VALOR_REPASSE`

No Brana Cloud, a implementacao futura deve aplicar nos **campos equivalentes** (ver mapeamento necessario), mantendo o escopo `tabela selecionada`.

## 5. Pontos ainda nao confirmados (na evidencia atual)

- arredondamento exato do desktop (casas decimais, moeda, truncamento, etc.);
- tratamento de valor nulo/zero no desktop (atualiza? ignora?);
- existencia de preview no desktop (nao recuperado; no web e recomendado adicionar);
- existencia de rollback/log operacional no desktop (nao recuperado);
- se `pValor1` e `pValor2` eram sempre iguais (um unico percentual) ou se existiam percentuais distintos para `VALOR_PACIENTE` e `VALOR_REPASSE`.

## 6. Mapeamento necessario no Brana Cloud (nao presumir sem confirmar)

Objetivo: identificar equivalencias entre os campos desktop e os modelos/tabelas do Brana Cloud.

### 6.1 Equivalencias provaveis (candidatos) - precisam de confirmacao

Com base nos models atuais do backend:

- `TAB_PRC_ITEM` (EasyDental) -> candidato no Brana Cloud: tabela `procedimento` (model `Procedimento`)
  - evidencia: `backend/models/procedimento.py` define itens por `tabela_id` e `codigo`, com campos de preco/repasse.
- `NROTAB` (EasyDental) -> candidato no Brana Cloud: `procedimento.tabela_id` referenciando `procedimento_tabela.id`
  - evidencia: `backend/models/procedimento.py` tem `tabela_id`; `backend/models/procedimento_tabela.py` define `ProcedimentoTabela`.
- `VALOR_PACIENTE` (EasyDental) -> candidato no Brana Cloud: `procedimento.preco`
  - evidencia: `backend/models/procedimento.py` tem `preco`.
- `VALOR_REPASSE` (EasyDental) -> candidato no Brana Cloud: `procedimento.valor_repasse`
  - evidencia: `backend/models/procedimento.py` tem `valor_repasse`.

### 6.2 Itens a confirmar antes de qualquer implementacao

- se o campo `preco` representa o "valor paciente" equivalente em todas as tabelas;
- se existe alguma tabela intermediaria (por exemplo, precos por convenio/plano) que nao usa `procedimento.preco`;
- se existe regra por fonte pagadora (`procedimento_tabela.fonte_pagadora`) que muda o significado dos campos;
- se existe logica adicional no backend que recalcula custos/indices quando o preco muda.

## 7. Escopo futuro (restricoes obrigatorias)

Ao implementar no web, manter escopo estrito:

- reajustar somente precos da tabela selecionada;
- nao alterar materiais;
- nao alterar vinculos;
- nao alterar Procedimento Generico;
- nao alterar `procedimento_generico_id`;
- nao alterar regras de heranca/proprio/herdado;
- nao alterar custos de materiais;
- nao alterar calculo financeiro/custos fora do estritamente necessario;
- nao reabrir saneamento de vinculos legados.

## 8. Fluxo web recomendado (seguro)

Recomendacao de UX/fluxo (sem implementar agora):

- botao `% Reajusta tabela...` abre modal;
- modal mostra o nome da tabela atual (ex.: PARTICULAR);
- radio `Aumentar` e radio `Diminuir`;
- campo percentual (aceitar virgula decimal PT-BR);
- botao `Preview` (somente leitura, sem gravar);
- botao `Aplicar` somente apos preview;
- botao `Cancela`;
- confirmacao explicita antes de gravar (texto pode ser diferente do desktop; nao corrigir strings existentes agora).

## 9. Backend recomendado (seguro)

Recomendacao de arquitetura (sem implementar agora):

- endpoint de preview (somente leitura) por `tabela_id` + percentual + modo (aumentar/diminuir);
- endpoint de aplicacao real separado, com confirmacao explicita do usuario;
- ambos restritos a tabela selecionada (nunca multitab);
- preview retorna:
  - quantidade total de itens afetados;
  - amostra antes/depois (limite pequeno);
  - validacoes (percentual valido, nao negativo, etc.).
- aplicacao retorna:
  - quantidade atualizada;
  - identificador de operacao (se houver auditoria).

Se o padrao do projeto permitir, aplicar com transacao.

## 10. Seguranca obrigatoria (antes de aplicar em producao)

- preview obrigatorio antes de aplicar;
- confirmacao explicita;
- backup recomendado antes da primeira execucao real;
- teste em tabela de teste/ambiente de teste;
- impedir percentual invalido (ex.: < 0, ou absurdamente alto sem confirmacao extra);
- impedir resultado negativo;
- aceitar entrada com virgula decimal (ex.: `1,00`);
- nao aplicar se tabela nao estiver selecionada;
- nao aplicar em multiplas tabelas por acidente.

## 11. Subetapas futuras recomendadas (sem executar)

- Subetapa A (documental): mapear campos Brana Cloud equivalentes a `TAB_PRC_ITEM/NROTAB/VALOR_REPASSE/VALOR_PACIENTE` (confirmacao final).
- Subetapa B (frontend): implementar modal + fluxo de preview (sem gravacao).
- Subetapa C (backend): implementar endpoint de preview (somente leitura).
- Subetapa D (backend): implementar endpoint de aplicacao real (com confirmacao e transacao).
- Subetapa E (QA): testes manuais + documentacao de regressao.

## 12. Onde testar futuramente (apos implementacao segura)

Roteiro sugerido:

1. Abrir `Configuracoes > Tabelas > Intervencoes / Procedimentos...`.
2. Selecionar uma tabela de teste.
3. Anotar precos antes (amostra).
4. Abrir `% Reajusta tabela...`.
5. Cancelar (nenhuma mudanca).
6. Rodar preview (conferir amostra antes/depois e total afetado).
7. Aplicar somente em ambiente seguro.
8. Confirmar que outra tabela nao mudou.
9. Confirmar que materiais/genericos/vinculos nao mudaram.
10. Verificar console e rede.

## Referencias documentais

- `docs/investigacao_profunda_y_eds70_reajuste_tabela.md`
- `docs/investigacao_profunda_reajuste_tabela_easydental_legado.md`
- `docs/intervencoes_procedimentos_auditoria_legado_reajuste_tabela_precos.md`
- `docs/intervencoes_procedimentos_subetapa_0_mapeamento_monolitico.md`
- `docs/intervencoes_procedimentos_subetapa_0b_validacao_fluxos_sensiveis.md`
- `docs/intervencoes_procedimentos_subetapa_1_namespace_passivo.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- contrato de materiais/genericos/intervencoes: `docs/contrato_funcional_regras_materiais_genericos_intervencoes.md`

Observacao: o arquivo citado em algumas instrucoes como `docs/consolidacao_validacao_manual_regras_materiais_genericos_intervencoes.md` nao foi localizado neste workspace; por isso, a referencia de contrato usada aqui e o documento `contrato_funcional_...` acima.

