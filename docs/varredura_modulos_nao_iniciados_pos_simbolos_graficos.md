# Varredura de módulos não iniciados pós-Símbolos Gráficos

## Objetivo

Registrar uma varredura documental conservadora para escolher o próximo módulo mais seguro para continuidade da modularização, comparando módulos ainda pouco trabalhados ou já iniciados de forma parcial, sem alterar qualquer código.

## Escopo

- Conferir o estado documental e o estado aparente dos módulos candidatos.
- Excluir módulos já considerados sensíveis ou já encerrados nesta rodada.
- Identificar o candidato mais conservador para uma futura Subetapa 0 documental.
- Não iniciar nenhuma extração funcional nesta etapa.

## Arquivos inspecionados

- `docs/`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/`
- `docs/recomendacao_proximo_modulo_pos_simbolos_graficos.md`
- `docs/recomendacao_proximo_modulo_pos_materiais.md`
- `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md`
- `docs/recomendacao_proximo_modulo_pos_convenios_planos.md`
- `docs/recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md`
- `docs/simbolos_graficos_retomada_pos_preferencias_estado_atual.md`

## Checks iniciais

- Branch atual: `modularizacao-segura-fase-1`.
- `HEAD` e `origin` no histórico recente apontam para `1bc82b1 Documenta helpers remanescentes de Simbolos Graficos`.
- Não havia diff rastreado funcional inesperado.
- `git diff --stat` e `git diff --cached --stat` estavam vazios.
- As pendências existentes em `docs/` são majoritariamente arquivos untracked preexistentes e não fazem parte desta varredura funcional.

## Contexto da decisão

O módulo `Símbolos Gráficos` já foi retomado e documentado, mas continua sensível por envolver modal, editor visual, preview, biblioteca, `postMessage` e fluxos de salvar/excluir. Ao mesmo tempo, o módulo `Preferências e Opções do Sistema` foi fechado e pausado após extrações pequenas e seguras.

Nesta rodada, a comparação foi feita apenas entre módulos ainda não avançados na sequência atual ou pouco trabalhados dentro da base documental disponível. A inspeção mostrou que os candidatos listados já possuem documentação e módulos JS próprios, então nenhum deles é realmente “novo”; a decisão é apenas escolher o menor risco entre os já iniciados.

## Módulos excluídos desta rodada

| Módulo | Motivo da exclusão |
|---|---|
| Intervenções / Procedimentos | Já foi pausado por risco; encosta em materiais, custos, payload, salvamento, Procedimentos Genéricos e reajustes. |
| Auxiliares / Tabelas auxiliares | Ciclo de helpers puros já encerrado. |
| Preferências e Opções do Sistema | Fechado e pausado nesta rodada. |
| Símbolos Gráficos | Já iniciado, retomado e documentado; risco visual/editor alto. |
| Índices financeiros / Cenário financeiro / reajuste / custos / preço / repasse | Risco financeiro e funcional elevado. |
| Agenda | Fluxo amplo, visual e dependente de datas/estado. |
| Editor de Textos | Histórico sensível e editor complexo. |
| Usuários / perfis / permissões / Superadmin / Licença | Risco de segurança e controle de acesso. |

## Módulos avaliados

| Módulo | Estado conhecido | Docs existentes | Módulo JS existente | Fronteira | Backend/API | Payload/salvamento | Risco | Recomendação |
|---|---|---|---|---|---|---|---|---|
| Plano de Contas | Já iniciado / parcial | Sim | Sim | Clara | Baixo a médio | Presente em partes | Baixo | Candidato secundário |
| Medicamentos | Já iniciado / parcial | Sim | Sim | Clara | Baixo a médio | Presente em partes | Baixo | Candidato secundário |
| Etiquetas | Já iniciado / parcial | Sim | Sim | Clara | Baixo a médio | Presente em partes | Baixo a médio | Candidato secundário |
| Prestadores | Já iniciado / parcial | Sim | Sim | Clara | Baixo | Limitado | Baixo | **Recomendado** |
| Anamnese | Já iniciado / parcial | Sim | Sim | Menos simples | Médio | Presente | Médio | Pausar nesta rodada |
| Convênios e Planos | Já iniciado / parcial | Sim | Sim | Média | Médio | Presente | Médio a alto | Pausar nesta rodada |
| Materiais | Já iniciado / parcial | Sim | Sim | Média | Médio | Presente | Alto | Pausar nesta rodada |
| Procedimentos Genéricos | Já iniciado / parcial | Sim | Sim | Média | Médio | Presente | Alto | Pausar nesta rodada |

## Análise dos candidatos principais

### Prestadores

O bloco de Prestadores aparece como o candidato mais conservador entre os avaliados. A fronteira é simples, o módulo JS já existe, a documentação anterior está consolidada e o helper passivo conhecido é pequeno. Não há sinal de dependência pesada de editor, agenda, custo, reajuste ou `postMessage`.

### Plano de Contas

Também é um candidato conservador, com namespace passivo e helpers já separados, mas o módulo já passou por ciclo documental mais amplo. Continua sendo seguro, embora menos minimalista do que Prestadores.

### Medicamentos

Tem fronteira relativamente clara e já possui helpers puros e namespace passivo. Ainda assim, é um pouco mais carregado do que Prestadores por depender de validação textual e fluxo de cadastro mais amplo.

### Etiquetas

É utilizável como próximo bloco, mas já demonstra mais helpers e mais variação interna de comportamento. Fica abaixo de Prestadores em simplicidade conservadora.

### Anamnese, Convênios e Planos, Materiais, Procedimentos Genéricos

Esses módulos são mais sensíveis. Anamnese já mostrou histórico de recuperação e material legado; Convênios e Planos toca regras amplas; Materiais e Procedimentos Genéricos se aproximam de vínculos, custo, preço e dependências de fluxo.

## Módulo recomendado

**Prestadores**

## Justificativa

- É o candidato mais simples entre os avaliados nesta varredura.
- Tem documentação anterior e módulo JS já existentes, sem precisar reiniciar o mapeamento cego.
- A fronteira aparente é clara e o risco de payload/salvamento é menor do que nos demais candidatos.
- Não há sinais de editor complexo, agenda, financeiro ou `postMessage`.
- Permite começar com uma **Subetapa 0 documental** sem mexer em comportamento.

## Candidatos secundários

- Plano de Contas
- Medicamentos
- Etiquetas

## Módulos descartados por risco

- Anamnese
- Convênios e Planos
- Materiais
- Procedimentos Genéricos

## Próxima etapa recomendada

**Subetapa 0 documental do módulo Prestadores**

Não iniciar alteração funcional direta.

## Cuidados para a próxima etapa

- Manter a blindagem textual / mojibake.
- Não alterar código, HTML, backend, banco ou endpoints.
- Não criar módulo JS ainda.
- Não mexer em payload, salvamento, permissões ou fluxos visuais.
- Não usar pastas proibidas como destino de documentação.
- Confirmar sempre se o módulo já existe antes de tratar como “novo”.

