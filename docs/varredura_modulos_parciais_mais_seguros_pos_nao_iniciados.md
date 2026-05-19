# Varredura comparativa — módulos parciais mais seguros

## Objetivo

Comparar os módulos já iniciados/parciais para escolher o próximo módulo mais seguro para retomada documental, sem tratá-los como novos e sem iniciar qualquer modularização funcional.

## Escopo

- Reavaliar apenas os módulos já iniciados/parciais.
- Excluir módulos já pausados, proibidos ou de alto risco.
- Identificar o módulo parcial com menor risco para retomada documental.
- Não mover código nesta etapa.

## Arquivos inspecionados

- `docs/`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/`
- `docs/varredura_modulos_nao_iniciados_pos_simbolos_graficos.md`
- `docs/varredura_modulos_realmente_nao_iniciados_pos_simbolos_graficos.md`

## Checks iniciais

- Branch atual: `modularizacao-segura-fase-1`.
- O commit recente de referência no histórico é `b8a33ff Reavalia modulos realmente nao iniciados`.
- Não havia diff funcional inesperado.
- `git diff --stat` e `git diff --cached --stat` estavam vazios.

## Contexto

A varredura anterior confirmou que não existia, com base segura, um módulo realmente não iniciado para recomendar. Com isso, a decisão passa a ser entre módulos já iniciados/parciais, escolhendo o menor risco e evitando reiniciar blocos já documentados como se fossem novos.

## Módulos excluídos desta rodada

| Módulo | Motivo |
|---|---|
| Intervenções / Procedimentos | Já pausado por risco funcional, materiais, custos e reajustes. |
| Auxiliares / Tabelas auxiliares | Ciclo de helpers puros já encerrado. |
| Preferências e Opções do Sistema | Rodada fechada e pausada. |
| Símbolos Gráficos | Módulo sensível com modal, editor, preview, biblioteca e `postMessage`. |
| Índices financeiros / Cenário financeiro | Alto risco financeiro e sistêmico. |
| Agenda | Fluxo amplo, visual e dependente de datas/estado. |
| Editor de Textos | Editor complexo e sensível. |
| Usuários / perfis / permissões / Superadmin / Licença | Risco de segurança e permissões. |
| Reajuste / custos / preço / repasse | Risco financeiro direto. |

## Módulos parciais avaliados

| Módulo | Estado parcial | Docs existentes | Módulo JS | Backend/API | Payload/salvamento | Risco | Recomendação |
|---|---|---|---|---|---|---|---|---|
| Plano de Contas | Já iniciado/parcial | Sim | Sim | Médio | Presente em partes | Baixo | Candidato secundário |
| Medicamentos | Já iniciado/parcial | Sim | Sim | Médio | Presente em partes | Baixo | Candidato secundário |
| Etiquetas | Já iniciado/parcial | Sim | Sim | Médio | Presente em partes | Baixo a médio | Candidato secundário |
| Prestadores | Já iniciado/parcial | Sim | Sim | Baixo | Limitado | Baixo | **Melhor candidato** |
| Anamnese | Já iniciado/parcial | Sim | Sim | Médio | Presente | Médio | Cautela |
| Convênios e Planos | Já iniciado/parcial | Sim | Sim | Médio | Presente | Médio a alto | Cautela |
| Materiais | Já iniciado/parcial | Sim | Sim | Médio | Presente | Alto | Excluir nesta rodada |
| Procedimentos Genéricos | Já iniciado/parcial | Sim | Sim | Médio | Presente | Alto | Excluir nesta rodada |

## Análise dos candidatos principais

### Prestadores

É o módulo parcial mais conservador da lista. A fronteira é simples, a documentação já existe, o módulo JS está presente e não há indício de dependência pesada de editor, agenda, `postMessage`, financeiro ou salvamento complexo.

### Plano de Contas

Também é um candidato seguro, com namespace passivo e helpers pequenos, mas a documentação e o escopo já são mais amplos do que em Prestadores.

### Medicamentos

Tem fronteira clara e módulo passivo, porém ainda envolve validação textual e fluxo de cadastro mais amplo do que Prestadores.

### Etiquetas

É um candidato possível, mas com maior variação interna de helpers e comportamento visual do que os anteriores.

### Anamnese, Convênios e Planos

São módulos parciais válidos, mas com risco superior por envolverem regras mais amplas, dependência de dados e maior chance de regressão sistêmica.

### Materiais, Procedimentos Genéricos

Esses dois ficam mais arriscados por proximidade com materiais, vínculos, payload e fluxos de negócio sensíveis.

## Melhor candidato recomendado

**Prestadores**

## Justificativa

- É o módulo parcial mais simples entre os avaliados.
- Já tem documentação e módulo JS próprio, então não há risco de tratá-lo como novo.
- A fronteira visual e funcional é mais clara.
- O risco de payload, salvamento, editor, agenda e financeiro é menor do que nos demais candidatos.
- Permite uma retomada documental antes de qualquer passo funcional.

## Candidatos secundários

- Plano de Contas
- Medicamentos

## Módulos com cautela

- Etiquetas
- Anamnese
- Convênios e Planos

## Módulos descartados por risco

- Materiais
- Procedimentos Genéricos

## Próxima etapa recomendada

**Retomada documental do módulo Prestadores**

Não recomendar alteração funcional direta.

## Cuidados para a próxima etapa

- Manter blindagem textual / mojibake.
- Não alterar código.
- Não criar módulo JS novo sem confirmar o estado atual.
- Não mexer em backend, banco ou endpoints.
- Não mexer em payload ou salvamento.
- Não mexer em pastas proibidas.
- Conferir docs e módulo existente antes de qualquer nova subetapa.

