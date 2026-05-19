# Preferências e Opções do Sistema — Subetapa 4 — Reavaliação do próximo helper

## Objetivo

Reavaliar, após a Subetapa 3 funcional mínima, qual é o próximo helper/default puro mais seguro do bloco de `Preferências e Opções do Sistema`, sem mover código nesta etapa.

## Escopo

- Reanalisar os candidatos restantes no `frontend/app.js`.
- Confirmar o estado do helper já delegado `prefOdontoNorm`.
- Escolher apenas um próximo candidato, se houver base segura suficiente.
- Manter a blindagem textual / mojibake sem qualquer correção.

## Arquivos inspecionados

- `docs/preferencias_opcoes_sistema_subetapa_2_candidatos_helpers_defaults_puros.md`
- `docs/preferencias_opcoes_sistema_subetapa_3_prefOdontoNorm.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`

## Checks iniciais

- Branch atual verificada: `modularizacao-segura-fase-1`.
- O commit `4a401f8` aparece como HEAD desta linha de trabalho.
- `git status --short` mostra pendências preexistentes no repositório e os arquivos já alterados em etapa anterior.
- `git diff --stat` sem alterações novas de código nesta rodada documental.
- `git diff --cached --stat` sem diffs staged.
- Nenhum comando destrutivo ou de alteração de repositório foi executado.

## Base documental usada

- A Subetapa 2 classificou os candidatos puros, com `prefOdontoNorm` já listado entre os seguros.
- A Subetapa 3 efetivou a delegação de `prefOdontoNorm` ao módulo passivo com wrapper/fallback no `app.js`.
- A blindagem textual / mojibake continua válida: qualquer texto estranho deve seguir apenas como risco documental.

## Estado após Subetapa 3

- `prefOdontoNorm` já foi delegado ao módulo `frontend/js/modules/preferencias-opcoes-sistema.js`.
- O `frontend/app.js` mantém wrapper/fallback conservador para o mesmo nome.
- As chamadas de `prefOdontoFindByLabel` continuam preservadas e dependem do wrapper, sem mudança de contrato.
- O restante do bloco de Preferências segue concentrado no `app.js` e não foi movido.

## Critérios de reavaliação

- Não acessar DOM.
- Não chamar `fetch` / API.
- Não salvar.
- Não montar payload.
- Não alterar estado global.
- Não depender de função visual.
- Não registrar evento.
- Poder ser copiado literalmente.
- Permitir wrapper/fallback no `app.js`.
- Ter escopo pequeno e baixo impacto sistêmico.

## Funções reavaliadas

| Função | Linha aprox. | Tamanho | Papel | DOM | API/backend | Payload/salvamento | Estado global | Strings visíveis | Risco | Classificação |
|---|---:|---:|---|---|---|---|---|---|---|---|
| `prefValoresPadrao` | 2246 | Curta | Defaults gerais de preferências | Não | Não | Não | Não | Sim, há texto padrão interno | Médio | Candidato possível, mas não agora |
| `prefValoresPadraoModelos` | 2247 | Curta | Defaults dos modelos | Não | Não | Não | Não | Não | Baixo | **Próximo candidato recomendado** |
| `prefAmbEstiloPadrao` | 2249 | Curta | Default visual de ambiente | Não | Não | Não | Não | Sim, é configuração visual | Médio | Cautela |
| `prefValoresPadraoAmbiente` | 2250 | Curta | Defaults do ambiente por seção | Não | Não | Não | Não | Sim, por depender de estilo visual | Médio | Cautela |
| `prefValoresPadraoDados` | 2251 | Média | Defaults dos dados do usuário | Não | Não | Não | Não | Sim, contém `pais:"Brasil"` e campos textuais | Médio | Candidato possível, mas não agora |
| `prefValoresPadraoOdontograma` | 2267 | Curta | Defaults do odontograma | Não | Não | Não | Não | Sim, cores e flags visuais | Médio/alto | Cautela |
| `prefOdontoFindByLabel` | 2460 | Curta | Busca item da paleta por label | Não | Não | Não | Não | Sim, depende de labels da paleta | Médio | Cautela |
| `prefContextoPadrao` | 2242 | Curta | Contexto padrão da sessão | Não | Não | Não | **Sim** | Sim, monta apelido/nome | Médio | Cautela |
| `prefResolverContexto` | 2243 | Curta | Resolve contexto do usuário | Não | Não | Não | **Sim** | Sim, usa nome/apelido | Médio | Cautela |
| `prefContextoAtual` | 2244 | Muito curta | Fallback de contexto atual | Não | Não | Não | **Sim** | Não | Médio | Cautela |
| `prefTituloAtual` | 2245 | Curta | Título visível da janela | Não | Não | Não | **Sim** | **Sim** | Alto | Proibido por enquanto |

## Próximo candidato recomendado

**`prefValoresPadraoModelos`**

Motivo:

- É curto.
- Retorna apenas um objeto literal com `null` em IDs de modelos.
- Não acessa DOM, API, payload ou salvamento.
- Não lê nem escreve estado global.
- Não depende de função visual.
- Não contém strings visíveis.
- É mais simples e menos sensível que os demais defaults do bloco.

## Candidatos possíveis, mas não agora

- `prefValoresPadrao`
- `prefValoresPadraoDados`
- `prefOdontoFindByLabel`

Esses ainda são plausíveis como helpers puros, mas têm mais chance de influenciar comportamento agregado, texto interno ou dependências indiretas do fluxo de Preferências.

## Candidatos com cautela

- `prefAmbEstiloPadrao`
- `prefValoresPadraoAmbiente`
- `prefValoresPadraoOdontograma`
- `prefContextoPadrao`
- `prefResolverContexto`
- `prefContextoAtual`

Motivo:

- Uns influenciam aparência e configuração visual.
- Outros dependem de contexto de sessão ou de usuário.
- Todos ainda merecem uma conferência adicional antes de qualquer etapa funcional.

## Proibidos por enquanto

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
- DOM
- abertura/fechamento
- payload
- salvamento
- backend/API
- permissões
- handlers
- dispatcher
- menus
- strings visíveis
- mojibake

## O que NÃO mover na próxima etapa funcional

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
- DOM
- abertura/fechamento
- payload
- salvamento
- backend/API
- permissões
- handlers
- dispatcher
- menus
- strings visíveis
- mojibake

## Riscos remanescentes

- `prefValoresPadraoModelos` é seguro, mas ainda vale manter wrapper/fallback se for extraído.
- `prefValoresPadrao` e `prefValoresPadraoDados` têm mais peso semântico e podem afetar telas inteiras.
- Defaults de ambiente e odontograma são mais sensíveis por envolverem configuração visual.
- O bloco ainda possui dependências de contexto e de texto visível que devem continuar fora de qualquer extração mínima.

## Roteiro futuro de teste

Como esta etapa é documental, não há teste funcional no navegador.

Roteiro sugerido para uma eventual Subetapa 5 funcional mínima:

1. `Ctrl+F5`.
2. Abrir `Preferências`.
3. Conferir abas sem salvar.
4. Conferir especialmente a área afetada pelo helper escolhido.
5. Abrir `Opções do sistema`.
6. Conferir carregamento sem salvar.
7. Verificar console.
8. Não executar salvamento real se a etapa futura só mover helper puro.

## Próxima etapa recomendada

**Subetapa 5 funcional mínima — mover somente `prefValoresPadraoModelos` com cópia literal e wrapper/fallback no `app.js`.**

Se a validação humana ou o teste de console mostrar qualquer regressão, a alternativa conservadora é voltar para nova etapa documental e não avançar a extração.

## Confirmação final

Nenhum código foi alterado nesta rodada documental. Não houve mudança em `frontend/app.js`, `frontend/index.html` ou no módulo passivo. Não houve alteração em backend, banco, payload, salvamento, permissões ou textos visíveis.
