# Preferências e Opções do Sistema — Subetapa 9 — Fechamento e reavaliação do módulo

## Objetivo

Fechar a rodada de `Preferências e Opções do Sistema`, registrar o que foi feito e preservado, justificar a pausa do módulo nesta rodada e recomendar o próximo módulo mais seguro para a continuidade da modularização conservadora.

## Escopo

- Consolidar o histórico das subetapas desta rodada.
- Registrar os helpers/defaults já delegados.
- Registrar os itens que devem permanecer fora de nova extração agora.
- Reavaliar os próximos módulos candidatos com foco em risco e acoplamento.
- Preservar a blindagem textual / mojibake sem qualquer correção.

## Arquivos inspecionados

- `docs/preferencias_opcoes_sistema_subetapa_0_mapeamento_monolitico.md`
- `docs/preferencias_opcoes_sistema_subetapa_1_namespace_passivo.md`
- `docs/preferencias_opcoes_sistema_subetapa_2_candidatos_helpers_defaults_puros.md`
- `docs/preferencias_opcoes_sistema_subetapa_3_prefOdontoNorm.md`
- `docs/preferencias_opcoes_sistema_subetapa_4_reavaliacao_proximo_helper.md`
- `docs/preferencias_opcoes_sistema_subetapa_5_prefValoresPadraoModelos.md`
- `docs/preferencias_opcoes_sistema_subetapa_6_reavaliacao_proximo_default.md`
- `docs/preferencias_opcoes_sistema_subetapa_7_prefOdontoFindByLabel.md`
- `docs/preferencias_opcoes_sistema_subetapa_8_reavaliacao_continuidade.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `frontend/index.html`

## Checks iniciais

- Branch atual verificada: `modularizacao-segura-fase-1`.
- O commit `e551b42` aparece como HEAD desta linha de trabalho.
- `git status --short` mostra pendências preexistentes no repositório e o documento novo desta etapa.
- `git diff --stat` sem alterações novas de código nesta rodada documental.
- `git diff --cached --stat` sem diffs staged.
- Nenhum comando destrutivo ou de alteração de repositório foi executado.

## Base documental usada

- A Subetapa 0 mapeou o monólito de `Preferências`.
- A Subetapa 1 criou o namespace passivo e consolidou a presença do módulo.
- A Subetapa 2 classificou os candidatos puros e separou seguro, cautela e proibido.
- A Subetapa 3 delegou `prefOdontoNorm`.
- A Subetapa 5 delegou `prefValoresPadraoModelos`.
- A Subetapa 7 delegou `prefOdontoFindByLabel`.
- A Subetapa 8 concluiu que os candidatos restantes têm risco maior e recomendou pausa.
- A blindagem textual / mojibake continua obrigatória.

## Estado final da rodada de Preferências

- O módulo já passou pelo ciclo seguro de helpers puros menores.
- Os helpers mais isoláveis já foram extraídos com wrappers/fallbacks.
- O restante do bloco concentra defaults globais, configuração visual, contexto de sessão e texto visível.
- Não há, nesta rodada, um candidato restante que mantenha o mesmo nível de segurança dos helpers já movidos.

## Subetapas concluídas

| Subetapa | Documento/commit | Resultado |
|---|---|---|
| 0 | `docs/preferencias_opcoes_sistema_subetapa_0_mapeamento_monolitico.md` | Mapeamento monolítico do bloco |
| 1 | `docs/preferencias_opcoes_sistema_subetapa_1_namespace_passivo.md` / `5da5197` | Namespace passivo criado |
| 2 | `docs/preferencias_opcoes_sistema_subetapa_2_candidatos_helpers_defaults_puros.md` / `940f6b3` | Candidatos puros classificados |
| 3 | `docs/preferencias_opcoes_sistema_subetapa_3_prefOdontoNorm.md` / `4a401f8` | `prefOdontoNorm` delegado |
| 4 | `docs/preferencias_opcoes_sistema_subetapa_4_reavaliacao_proximo_helper.md` / `8d99be4` | Reavaliação do próximo helper |
| 5 | `docs/preferencias_opcoes_sistema_subetapa_5_prefValoresPadraoModelos.md` / `fcf6855` | `prefValoresPadraoModelos` delegado |
| 6 | `docs/preferencias_opcoes_sistema_subetapa_6_reavaliacao_proximo_default.md` / `7d651c1` | Reavaliação do próximo default |
| 7 | `docs/preferencias_opcoes_sistema_subetapa_7_prefOdontoFindByLabel.md` / `0755eb4` | `prefOdontoFindByLabel` delegado |
| 8 | `docs/preferencias_opcoes_sistema_subetapa_8_reavaliacao_continuidade.md` / `e551b42` | Continuidade reavaliada e pausa recomendada |

## Arquivos alterados nesta rodada

- Nenhum arquivo funcional foi alterado nesta subetapa.
- Foi criado apenas este documento de fechamento.

## Helpers/defaults delegados

- `prefOdontoNorm`
- `prefValoresPadraoModelos`
- `prefOdontoFindByLabel`

## Estratégia técnica usada

- Namespace passivo em `frontend/js/modules/preferencias-opcoes-sistema.js`.
- Wrappers/fallbacks conservadores mantidos em `frontend/app.js`.
- Cópias literais dos helpers delegados.
- Nenhuma chamada existente foi alterada.
- Nenhum comportamento real foi mexido fora da delegação dos helpers puros.

## O que foi preservado

- DOM.
- Abertura/fechamento.
- Payload.
- Salvamento.
- Backend/API.
- Permissões.
- `sysOpt*`.
- `frontend/index.html` após a Subetapa 1.
- CSS.
- Strings visíveis.
- Mojibake.
- Banco/schema/migrations/endpoints.

## Itens que NÃO devem ser movidos agora

- `prefValoresPadrao`
- `prefValoresPadraoDados`
- `prefAmbEstiloPadrao`
- `prefValoresPadraoAmbiente`
- `prefValoresPadraoOdontograma`
- `prefContextoPadrao`
- `prefResolverContexto`
- `prefContextoAtual`
- `prefTituloAtual`
- `prefAbrir`
- `prefEnsureUI`
- `prefSincronizarUI`
- `prefCarregarDados`
- `prefSalvarGeral`
- `prefSalvarModelos`
- `prefSalvarAmbiente`
- `prefSalvarDados`
- `prefSalvarOdontograma`
- `prefColetarPayload`
- `prefColetarPayloadModelos`
- `prefColetarPayloadAmbiente`
- `prefColetarPayloadDados`
- `prefColetarPayloadOdontograma`
- qualquer `sysOpt*`

Motivos:

- Risco visual.
- Risco de configuração global.
- Objetos grandes.
- Strings visíveis.
- Possível impacto sistêmico.
- Proximidade com payload/salvamento.
- Dependência de DOM/backend/API/permissões em partes próximas.

## Riscos remanescentes

- Defaults remanescentes podem alterar o estado global da interface.
- Ambiente e odontograma são áreas visuais e sensíveis.
- Contexto e título dependem de estado e texto visível.
- Avançar mais um passo no módulo aumentaria o risco sem o mesmo ganho de isolamento.

## Roteiro de teste recomendado

1. `Ctrl+F5`.
2. Abrir `Preferências`.
3. Conferir aba `Modelos` sem salvar.
4. Conferir aba `Odontograma` sem salvar.
5. Alternar demais abas sem salvar.
6. Fechar `Preferências`.
7. Abrir `Opções do sistema`.
8. Alternar abas sem salvar.
9. Fechar `Opções do sistema`.
10. Verificar console.
11. Não executar salvamento real como teste de modularização.

## Decisão de fechamento

**Pausar `Preferências e Opções do Sistema` nesta rodada.**

Motivo:

- Os helpers/defaults menores e mais seguros já foram delegados.
- Os restantes têm risco maior e menor benefício marginal.
- O bloco agora encosta em defaults globais, visual, ambiente, odontograma e contexto.
- Manter a pausa preserva a estabilidade antes de qualquer nova mudança funcional.

## Reavaliação de próximos módulos

| Módulo | Situação conhecida | Risco | Observação | Recomendação |
|---|---|---|---|---|
| `Símbolos Gráficos` | Fronteira visual mais clara, com chance de helpers simples | Baixo/médio | Boa candidata conservadora para nova análise documental | **Próximo módulo recomendado** |
| `Etiquetas` | Pode ter integração com impressão/modelos | Médio | Vale análise documental, mas antes de módulos mais críticos | Possível depois |
| `Prestadores` | Cadastro relativamente isolado | Médio | Bom candidato, mas pode depender de dados e formulários | Cautela |
| `Plano de Contas` | Pode tocar financeiro | Médio/alto | Só depois de validação documental mais forte | Cautela |
| `Anamnese` | Fluxo de questionários/dados clínicos | Alto | Área ampla e com mais dependências | Não agora |
| `Medicamentos` | Cadastro possivelmente isolado, mas com uso clínico | Médio | Exige conferência do acoplamento | Cautela |

## Próximo módulo recomendado

**Símbolos Gráficos**

Justificativa:

- Tende a ter fronteira visual clara.
- Pode oferecer helpers puros ou namespace passivo com menor impacto sistêmico.
- Parece menos acoplado a payload/salvamento do que módulos clínicos, financeiros ou de permissões.
- É uma próxima análise mais conservadora do que entrar em `Anamnese`, `Plano de Contas` ou `Usuários`.

## Próxima etapa recomendada

**Subetapa 0 documental do módulo `Símbolos Gráficos`.**

## Confirmação final

Nenhum código foi alterado nesta rodada documental. Não houve mudança em `frontend/app.js`, `frontend/index.html` ou no módulo passivo. Não houve alteração em backend, banco, payload, salvamento, permissões ou textos visíveis.
