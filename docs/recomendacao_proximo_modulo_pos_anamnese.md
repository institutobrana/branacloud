# Recomendação do próximo módulo após Anamnese

## 1. Objetivo

Registrar, de forma exclusivamente documental, qual é o próximo módulo mais seguro para a continuidade da modularização conservadora depois do encerramento do mini ciclo de Anamnese.

Esta etapa não altera código, não cria módulo JS, não altera HTML, não altera backend, não altera banco e não mexe em comportamento funcional.

## 2. Estado resumido do ciclo de Anamnese

O mini ciclo de Anamnese foi encerrado nesta rodada com:

- subetapas documentais concluídas;
- wrappers mínimos criados e validados;
- fallback preservado;
- mensagens preservadas;
- payload preservado;
- `requestJson` preservado;
- `frontend/index.html` sem alteração;
- `frontend/js/modules/anamnese.js` sem alteração;
- backend, banco, schema, migrations e endpoints sem alteração.

Conclusão operacional:

- Anamnese deve permanecer pausada nesta rodada.
- Não há justificativa documental para reabrir o ciclo agora.

## 3. Arquivos e documentos consultados

Documentos de Anamnese consultados:

- `docs/anamnese_subetapa_0_retomada_estado_atual.md`
- `docs/anamnese_subetapa_1_documental_helpers_puros_existentes.md`
- `docs/anamnese_subetapa_2_documental_delegacao_controlada_appjs.md`
- `docs/anamnese_subetapa_3_wrapper_minimo_delegacao_controlada.md`
- `docs/anamnese_subetapa_4_validacao_wrappers_encerramento.md`

Documentos de recomendação e varredura consultados:

- `docs/medicamentos_fechamento_reavaliacao_proximo_modulo.md`
- `docs/recomendacao_proximo_modulo_pos_intervencoes_reavaliado.md`
- `docs/varredura_modulos_parciais_mais_seguros_pos_nao_iniciados.md`
- `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md`
- `docs/recomendacao_proximo_modulo_pos_prestadores.md`
- `docs/recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md`
- `docs/recomendacao_proximo_modulo_pos_simbolos_graficos.md`
- `docs/recomendacao_proximo_modulo_pos_convenios_planos.md`
- `docs/recomendacao_proximo_modulo_pos_auxiliares.md`
- `docs/recomendacao_proximo_modulo_pos_etiquetas.md`
- `docs/recomendacao_proximo_modulo_pos_materiais.md`
- `docs/recomendacao_proximo_modulo_pos_prestadores_reavaliado.md`
- `docs/recomendacao_proximo_modulo_pos_intervencoes_reavaliado.md`
- `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

Arquivos consultados no projeto:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/`

## 4. Checks iniciais

Checks executados no início desta etapa:

- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -10`

Estado observado:

- branch atual: `modularizacao-segura-fase-1`
- `git diff --stat`: vazio
- `git status --short`: somente pendências untracked preexistentes no worktree

## 5. Módulos avaliados

| Módulo | Situação atual conhecida | Já tem módulo JS | Já foi iniciado | Risco principal | Chance de helper puro seguro | Risco em payload/salvamento/backend | Risco de texto/mojibake | Recomendação |
|---|---|---|---|---|---|---|---|---|
| Etiquetas | Ciclo já encerrado em documentação anterior | Sim | Sim | Reabrir um ciclo já concluído sem ganho claro | Média | Baixo a médio | Baixo a médio | Pausar por enquanto |
| Plano de Contas | Ciclo já encerrado em documentação anterior | Sim | Sim | Reentrada desnecessária em módulo já consolidado | Média | Baixo a médio | Baixo a médio | Pausar por enquanto |
| Convênios e Planos | Módulo relevante, com histórico de duplo clique e escopo de faturamento/calendário | Sim | Sim | Duas grades, modais e dependências de faturamento | Média | Médio | Médio | **Avançar com cautela** |
| Preferências e Opções do Sistema | Ciclo fechado e pausado em documentação anterior | Sim | Sim | Bloco já fechado nesta rodada | Média | Médio | Médio | Pausar por enquanto |
| Auxiliares / Tabelas auxiliares | Ciclo de helpers puros já encerrado | Sim | Sim | Ciclo já consolidado | Baixa a média | Baixo a médio | Baixo a médio | Pausar por enquanto |
| Símbolos Gráficos | Módulo visual/editor sensível com biblioteca, preview e integração externa | Sim | Sim | Editor, `postMessage`, preview e modal visual | Média | Médio | Médio | Adiar por enquanto |
| Medicamentos | Pausado após ciclo seguro anterior | Sim | Sim | CRUD com persistência e validação textual | Baixa | Médio | Médio | Pausar por enquanto |
| Prestadores | Pausado após helpers seguros | Sim | Sim | UI, cache, seleção e fluxos sensíveis | Baixa a média | Médio | Médio | Pausar por enquanto |
| Anamnese | Mini ciclo encerrado nesta rodada; deve permanecer pausado | Sim | Sim | Fluxo clínico, paciente, questionários, perguntas e respostas | Média | Médio | Médio | Pausar por enquanto |
| Materiais | Muito amplo e acoplado | Sim | Sim | Lista, modal, índices e valores | Baixa | Alto | Médio | Descartar por enquanto |
| Procedimentos Genéricos | Muito acoplado a materiais e regras de negócio | Sim | Sim | Fluxo amplo e sensível | Baixa | Alto | Médio | Descartar por enquanto |
| Intervenções / Procedimentos | Já pausado por risco funcional, custos e reajustes | Sim | Sim | Materiais, vínculos, custos e reajustes | Baixa | Alto | Médio | Descartar por enquanto |
| Agenda | Fluxo operacional amplo e sensível | Sim | Sim | Muitos eventos, integrações e estado visual | Baixa | Alto | Médio | Descartar por enquanto |
| Editor de Textos | Editor complexo e muito sensível | Sim | Sim | DOM rico, imagens e múltiplos subfluxos | Baixa | Alto | Médio | Descartar por enquanto |
| Índices financeiros | Área financeira sensível | Sim | Sim | Cotações, exclusões e migrações | Baixa | Alto | Médio | Descartar por enquanto |
| Cenário financeiro | Área financeira acoplada a cálculos e contratos | Sim | Sim | Cálculo monetário sensível | Baixa | Alto | Médio | Descartar por enquanto |

## 6. Ranking dos módulos mais seguros

1. Convênios e Planos
2. Símbolos Gráficos
3. Prestadores
4. Medicamentos
5. Anamnese

Observação:

- os itens 3, 4 e 5 estão pausados ou encerrados nesta rodada, então não devem ser tratados como próximos alvos imediatos;
- os itens 1 e 2 são os únicos candidatos ainda razoáveis para uma retomada documental sem entrar de imediato em zonas de maior risco.

## 7. Módulo recomendado como próximo

**Convênios e Planos**

## 8. Justificativa curta

`Convênios e Planos` é a melhor escolha conservadora restante porque:

- tem fronteira funcional reconhecível;
- já existe módulo JS e base documental;
- não depende de editor visual, `postMessage` ou preview externo;
- é menos sensível que Agenda, Financeiro, Editor de Textos, Materiais e Procedimentos;
- permite uma Subetapa 0 documental sem alterar comportamento.

## 9. Módulos descartados por risco ou por estado

Descartados por risco técnico:

- Agenda
- Materiais
- Procedimentos Genéricos
- Intervenções / Procedimentos
- Editor de Textos
- Índices financeiros
- Cenário financeiro

Descartados por estado de ciclo já pausado/encerrado nesta rodada:

- Anamnese
- Medicamentos
- Prestadores
- Auxiliares / Tabelas auxiliares
- Preferências e Opções do Sistema
- Etiquetas
- Plano de Contas

## 10. Próxima etapa recomendada

**Convênios e Planos — Subetapa 0 — retomada documental e estado atual**

## 11. Escopo permitido da próxima etapa

- Ler arquivos do projeto.
- Consultar documentos anteriores em `docs/`.
- Consultar `frontend/app.js`, `frontend/index.html` e `frontend/js/modules/` apenas para leitura.
- Mapear o estado atual do módulo escolhido.
- Registrar fronteiras, estado, helpers candidatos e riscos.
- Criar apenas o documento da próxima subetapa.

## 12. Escopo proibido da próxima etapa

- Alterar código funcional.
- Alterar `frontend/app.js`.
- Alterar `frontend/index.html`.
- Alterar qualquer arquivo em `frontend/js/modules`.
- Alterar backend, banco, schema, migrations ou endpoints.
- Alterar payload, salvamento, exclusão, impressão, importação ou fluxo de paciente.
- Corrigir texto, acentos, labels, mensagens, placeholders, strings visíveis ou mojibake.

## 13. Observações de teste futuro

Se a recomendação for aceita e a próxima Subetapa 0 documental de `Convênios e Planos` for aberta, o teste manual futuro deve continuar conservador:

1. Fazer `Ctrl+F5`.
2. Abrir o sistema normalmente.
3. Abrir `Convênios e Planos`.
4. Confirmar carregamento da lista.
5. Abrir apenas visualização e navegação inicial.
6. Não salvar.
7. Não excluir.
8. Não alterar dados reais.
9. Verificar console do navegador.

## 14. Blindagem textual

A blindagem textual / mojibake foi respeitada integralmente.

- nenhum texto foi corrigido;
- nenhum acento foi corrigido;
- nenhuma mensagem visível foi alterada;
- nenhum label ou placeholder foi alterado.

## 15. Conclusão

O próximo módulo recomendado é `Convênios e Planos`, com início apenas por Subetapa 0 documental.
