# Varredura complementar — módulos realmente não iniciados pós-Símbolos Gráficos

## Objetivo

Separar com mais rigor os módulos realmente não iniciados dos módulos já iniciados/parciais, pausados ou proibidos nesta rodada, para evitar uma recomendação incorreta como ocorreu na varredura anterior.

## Escopo

- Reavaliar os módulos da lista principal.
- Excluir módulos já documentados ou já com módulo JS.
- Identificar se existe algum módulo realmente não iniciado com risco aceitável.
- Se não houver, registrar a ausência e recomendar a alternativa mais conservadora.

## Arquivos inspecionados

- `docs/`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/`
- `docs/varredura_modulos_nao_iniciados_pos_simbolos_graficos.md`
- `docs/recomendacao_proximo_modulo_pos_simbolos_graficos.md`
- `docs/recomendacao_proximo_modulo_pos_materiais.md`
- `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md`
- `docs/recomendacao_proximo_modulo_pos_convenios_planos.md`
- `docs/recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md`

## Checks iniciais

- Branch atual: `modularizacao-segura-fase-1`.
- O histórico recente indica `a3fb603` como commit de consolidação da varredura anterior.
- Não havia diff funcional inesperado.
- `git diff --stat` e `git diff --cached --stat` estavam vazios.
- O repositório já apresentava várias pendências untracked em `docs/`, preexistentes e fora do escopo desta varredura.

## Contexto da correção da varredura anterior

A varredura anterior sugeriu `Prestadores`, mas a própria checagem confirmou que `Prestadores` já possui documentação específica e módulo JS existente. Portanto, `Prestadores` não deve ser tratado como módulo realmente não iniciado.

## Critério rígido de “realmente não iniciado”

Um módulo só entra nessa categoria quando:

1. não existe módulo JS correspondente em `frontend/js/modules`;
2. não existem documentos específicos em `docs`;
3. não há subetapa anterior registrada;
4. não há retomada/recomendação prévia do módulo como etapa em andamento.

Se houver documentação ou módulo JS, o bloco é classificado como **já iniciado/parcial**.

## Módulos já iniciados/parciais

| Módulo | Evidência encontrada | Classificação |
|---|---|---|
| Plano de Contas | Módulo JS existe e há sequência documental de subetapas | Já iniciado/parcial |
| Medicamentos | Módulo JS existe e há sequência documental de subetapas | Já iniciado/parcial |
| Etiquetas | Módulo JS existe e há sequência documental de subetapas | Já iniciado/parcial |
| Prestadores | Módulo JS existe e há sequência documental de subetapas | Já iniciado/parcial |
| Anamnese | Módulo JS existe e há sequência documental extensa | Já iniciado/parcial |
| Convênios e Planos | Módulo JS existe e há sequência documental de subetapas | Já iniciado/parcial |
| Materiais | Há documentação anterior e histórico de análise no projeto | Já iniciado/parcial |
| Procedimentos Genéricos | Há documentação anterior e histórico de análise no projeto | Já iniciado/parcial |

## Módulos pausados/proibidos nesta rodada

| Módulo | Motivo |
|---|---|
| Intervenções / Procedimentos | Já pausado por risco de materiais, custos, payload, salvamento e reajustes. |
| Auxiliares / Tabelas auxiliares | Ciclo de helpers puros já encerrado. |
| Preferências e Opções do Sistema | Rodada já fechada e pausada. |
| Símbolos Gráficos | Módulo sensível com modal, editor, preview, biblioteca e `postMessage`. |
| Índices financeiros / Cenário financeiro | Risco financeiro e sistêmico elevado. |
| Agenda | Fluxo amplo, visual e dependente de datas/estado. |
| Editor de Textos | Editor complexo e sensível. |
| Usuários / perfis / permissões / Superadmin / Licença | Risco de segurança, controle de acesso e permissões. |

## Módulos realmente não iniciados encontrados

| Módulo | Evidência de ausência de docs/módulo JS | Fronteira | Risco | Observação |
|---|---|---|---|---|
| Nenhum módulo confirmado | Após a correção da varredura anterior, nenhum candidato da lista principal satisfez os critérios rígidos | N/A | N/A | Não foi encontrado módulo realmente não iniciado com base segura suficiente. |

## Módulos avaliados

| Módulo | Estado | Docs existentes | Módulo JS existente | Fronteira | Backend/API | Payload/salvamento | Risco | Recomendação |
|---|---|---|---|---|---|---|---|---|
| Plano de Contas | Já iniciado/parcial | Sim | Sim | Clara | Baixo a médio | Presente em partes | Baixo | Já iniciado/parcial |
| Medicamentos | Já iniciado/parcial | Sim | Sim | Clara | Baixo a médio | Presente em partes | Baixo | Já iniciado/parcial |
| Etiquetas | Já iniciado/parcial | Sim | Sim | Clara | Baixo a médio | Presente em partes | Baixo a médio | Já iniciado/parcial |
| Prestadores | Já iniciado/parcial | Sim | Sim | Clara | Baixo | Limitado | Já iniciado/parcial |
| Anamnese | Já iniciado/parcial | Sim | Sim | Menos simples | Médio | Presente | Já iniciado/parcial |
| Convênios e Planos | Já iniciado/parcial | Sim | Sim | Média | Médio | Presente | Já iniciado/parcial |
| Materiais | Já iniciado/parcial | Sim | Sim | Média | Médio | Presente | Já iniciado/parcial |
| Procedimentos Genéricos | Já iniciado/parcial | Sim | Sim | Média | Médio | Presente | Já iniciado/parcial |

## Análise dos candidatos realmente não iniciados

Não houve candidato realmente não iniciado confirmado. A lista principal já possui documentação anterior, módulo JS próprio ou histórico de retomada em todos os casos avaliados.

## Módulo recomendado

**Nenhum módulo realmente não iniciado foi considerado seguro sem nova análise.**

## Justificativa

- A correção da varredura anterior mostrou que `Prestadores` não era realmente novo.
- Os módulos restantes da lista já apresentam evidência de início parcial por documentação e/ou módulo JS.
- Não foi encontrado, nesta rodada, um módulo “limpo” o bastante para ser tratado como realmente não iniciado e ao mesmo tempo seguro.
- Forçar uma escolha agora aumentaria o risco de repetir uma classificação incorreta.

## Candidatos secundários

- Nenhum candidato realmente não iniciado confirmado.

## Módulos descartados por risco

- Intervenções / Procedimentos
- Auxiliares / Tabelas auxiliares
- Preferências e Opções do Sistema
- Símbolos Gráficos
- Índices financeiros
- Cenário financeiro
- Agenda
- Editor de Textos
- Usuários / perfis / permissões
- Superadmin
- Licença

## Próxima etapa recomendada

**Subetapa documental de pausa / rechecagem ampla da base**, em vez de nova subetapa funcional.

Não recomendar alteração funcional direta enquanto não aparecer um módulo realmente não iniciado com base clara e menor risco.

## Cuidados para a próxima etapa

- Manter blindagem textual / mojibake.
- Não alterar código.
- Não criar módulo JS ainda.
- Não mexer em backend, banco ou endpoints.
- Não mexer em payload ou salvamento.
- Não usar pastas proibidas como destino de documentação.

