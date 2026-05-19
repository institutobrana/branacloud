# Preferências e Opções do Sistema — Subetapa 6 — Reavaliação do próximo default

## Objetivo

Reavaliar, após a Subetapa 5 funcional mínima, qual é o próximo helper/default mais seguro do bloco de `Preferências e Opções do Sistema`, sem mover código nesta etapa.

## Escopo

- Reanalisar os candidatos restantes no `frontend/app.js`.
- Confirmar o estado dos helpers já delegados `prefOdontoNorm` e `prefValoresPadraoModelos`.
- Escolher apenas um próximo candidato funcional mínimo, se realmente existir.
- Manter a blindagem textual / mojibake sem qualquer correção.

## Arquivos inspecionados

- `docs/preferencias_opcoes_sistema_subetapa_4_reavaliacao_proximo_helper.md`
- `docs/preferencias_opcoes_sistema_subetapa_5_prefValoresPadraoModelos.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`

## Checks iniciais

- Branch atual verificada: `modularizacao-segura-fase-1`.
- O commit `fcf6855` aparece como HEAD desta linha de trabalho.
- `git status --short` mostra pendências preexistentes no repositório e o documento novo desta etapa.
- `git diff --stat` sem alterações novas de código nesta rodada documental.
- `git diff --cached --stat` sem diffs staged.
- Nenhum comando destrutivo ou de alteração de repositório foi executado.

## Base documental usada

- A Subetapa 4 reavaliou o conjunto remanescente e apontou `prefValoresPadraoModelos` como próximo alvo mais seguro.
- A Subetapa 5 efetivou a delegação de `prefValoresPadraoModelos` ao módulo passivo com wrapper/fallback no `app.js`.
- A blindagem textual / mojibake continua obrigatória: qualquer texto estranho deve seguir apenas como risco documental.

## Estado após Subetapa 5

- `prefOdontoNorm` já foi delegado ao módulo `frontend/js/modules/preferencias-opcoes-sistema.js`.
- `prefValoresPadraoModelos` também já foi delegado ao módulo com wrapper/fallback no `frontend/app.js`.
- O restante do bloco de Preferências segue concentrado no `app.js` e não foi movido.
- `prefOdontoFindByLabel` continua chamando `prefOdontoNorm`, mas ainda está no monólito.

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
- Não envolver textos visíveis que possam ser interpretados como correção textual.
- Não envolver objeto grande demais de configuração visual/global.

## Funções reavaliadas

| Função | Linha aprox. | Tamanho | Papel | DOM | API/backend | Payload/salvamento | Estado global | Strings visíveis | Risco | Classificação |
|---|---:|---:|---|---|---|---|---|---|---|---|
| `prefValoresPadrao` | 2246 | Curta | Defaults gerais de preferências | Não | Não | Não | Não | Sim, há texto padrão interno | Médio | Candidato possível, mas não agora |
| `prefValoresPadraoDados` | 2255 | Média | Defaults dos dados do usuário | Não | Não | Não | Não | Sim, contém `pais:"Brasil"` e campos textuais | Médio | Candidato possível, mas não agora |
| `prefOdontoFindByLabel` | 2464 | Curta | Busca item da paleta por label | Não | Não | Não | Não | Sim, usa labels da paleta | Baixo/médio | **Próximo candidato recomendado** |
| `prefAmbEstiloPadrao` | 2253 | Curta | Default visual de ambiente | Não | Não | Não | Não | Sim, é configuração visual | Médio | Cautela |
| `prefValoresPadraoAmbiente` | 2254 | Curta | Defaults do ambiente por seção | Não | Não | Não | Não | Sim, por depender de estilo visual | Médio | Cautela |
| `prefValoresPadraoOdontograma` | 2271 | Curta | Defaults do odontograma | Não | Não | Não | Não | Sim, cores e flags visuais | Médio/alto | Cautela |
| `prefContextoPadrao` | 2242 | Curta | Contexto padrão da sessão | Não | Não | Não | **Sim** | Sim, monta apelido/nome | Médio | Cautela |
| `prefResolverContexto` | 2243 | Curta | Resolve contexto do usuário | Não | Não | Não | **Sim** | Sim, usa nome/apelido | Médio | Cautela |
| `prefContextoAtual` | 2244 | Muito curta | Fallback de contexto atual | Não | Não | Não | **Sim** | Não | Médio | Cautela |
| `prefTituloAtual` | 2245 | Curta | Título visível da janela | Não | Não | Não | **Sim** | **Sim** | Alto | Proibido por enquanto |

## Próximo candidato recomendado

**`prefOdontoFindByLabel`**

Motivo:

- É curto.
- É puramente computacional.
- Não acessa DOM, API, payload ou salvamento.
- Não lê nem escreve estado global.
- Já depende de `prefOdontoNorm`, que foi delegado.
- O risco sistêmico é baixo porque a lógica é só busca em memória dentro da paleta.
- Entre os remanescentes, é o menor passo funcional com comportamento isolável.

## Candidatos possíveis, mas não agora

- `prefValoresPadrao`
- `prefValoresPadraoDados`

Esses ainda são plausíveis como helpers puros, mas têm mais peso semântico e mais chance de influenciar telas inteiras ou contexto de usuário, então ficam atrás de `prefOdontoFindByLabel`.

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

- `prefOdontoFindByLabel` usa labels da paleta, então ainda merece wrapper/fallback e uma verificação visual mínima antes de qualquer ampliação.
- `prefValoresPadrao` e `prefValoresPadraoDados` têm maior carga semântica e podem impactar várias telas.
- Defaults de ambiente e odontograma são mais sensíveis por envolverem configuração visual.
- O bloco ainda possui dependências de contexto e de texto visível que devem continuar fora de qualquer extração mínima.

## Roteiro futuro de teste

Como esta etapa é documental, não há teste funcional no navegador.

Roteiro sugerido para uma eventual Subetapa 7 funcional mínima:

1. `Ctrl+F5`.
2. Abrir `Preferências`.
3. Conferir abas sem salvar.
4. Conferir especialmente a área afetada pelo helper/default escolhido.
5. Abrir `Opções do sistema`.
6. Conferir carregamento sem salvar.
7. Verificar console.
8. Não executar salvamento real se a etapa futura só mover helper/default puro.

## Próxima etapa recomendada

**Subetapa 7 funcional mínima — mover somente `prefOdontoFindByLabel` com cópia literal e wrapper/fallback no `app.js`.**

Se a validação humana ou o teste de console mostrar qualquer regressão, a alternativa conservadora é pausar o módulo Preferências e criar um documento de fechamento/reavaliação.

## Confirmação final

Nenhum código foi alterado nesta rodada documental. Não houve mudança em `frontend/app.js`, `frontend/index.html` ou no módulo passivo. Não houve alteração em backend, banco, payload, salvamento, permissões ou textos visíveis.
