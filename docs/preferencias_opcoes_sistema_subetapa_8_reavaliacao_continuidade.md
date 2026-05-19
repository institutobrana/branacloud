# Preferências e Opções do Sistema — Subetapa 8 — Reavaliação de continuidade

## Objetivo

Decidir, com base no estado real após a Subetapa 7, se o módulo `Preferências e Opções do Sistema` deve continuar com mais uma extração mínima ou se deve ser pausado nesta rodada.

## Escopo

- Reavaliar apenas os candidatos restantes no `frontend/app.js`.
- Confirmar o estado dos helpers já delegados ao módulo passivo.
- Registrar a decisão conservadora para a sequência da modularização.
- Preservar a blindagem textual / mojibake sem qualquer correção.

## Arquivos inspecionados

- `docs/preferencias_opcoes_sistema_subetapa_6_reavaliacao_proximo_default.md`
- `docs/preferencias_opcoes_sistema_subetapa_7_prefOdontoFindByLabel.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`

## Checks iniciais

- Branch atual verificada: `modularizacao-segura-fase-1`.
- O commit `0755eb4` aparece como HEAD desta linha de trabalho.
- `git status --short` mostra pendências preexistentes no repositório e o documento novo desta etapa.
- `git diff --stat` sem alterações novas de código nesta rodada documental.
- `git diff --cached --stat` sem diffs staged.
- Nenhum comando destrutivo ou de alteração de repositório foi executado.

## Base documental usada

- A Subetapa 6 reavaliou os candidatos restantes após `prefValoresPadraoModelos`.
- A Subetapa 7 efetivou a delegação de `prefOdontoFindByLabel` ao módulo passivo com wrapper/fallback no `app.js`.
- A blindagem textual / mojibake continua obrigatória: qualquer texto estranho deve seguir apenas como risco documental.

## Estado após Subetapa 7

- `prefOdontoNorm` já foi delegado ao módulo `frontend/js/modules/preferencias-opcoes-sistema.js`.
- `prefValoresPadraoModelos` já foi delegado ao módulo com wrapper/fallback no `frontend/app.js`.
- `prefOdontoFindByLabel` também já foi delegado ao módulo com wrapper/fallback no `frontend/app.js`.
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
- Não envolver strings visíveis sensíveis.
- Não envolver objeto grande demais de configuração visual/global.

## Funções reavaliadas

| Função | Linha aprox. | Tamanho | Papel | DOM | API/backend | Payload/salvamento | Estado global | Strings visíveis | Risco | Classificação |
|---|---:|---:|---|---|---|---|---|---|---|---|
| `prefValoresPadrao` | 2246 | Curta | Defaults gerais de preferências | Não | Não | Não | Não | Sim, há texto padrão interno | Médio/alto | Cautela |
| `prefValoresPadraoDados` | 2255 | Média | Defaults dos dados do usuário | Não | Não | Não | Não | Sim, contém `pais:"Brasil"` e campos textuais | Médio/alto | Cautela |
| `prefAmbEstiloPadrao` | 2253 | Curta | Default visual de ambiente | Não | Não | Não | Não | Sim, é configuração visual | Médio/alto | Cautela |
| `prefValoresPadraoAmbiente` | 2254 | Curta | Defaults do ambiente por seção | Não | Não | Não | Não | Sim, por depender de estilo visual | Alto | Cautela |
| `prefValoresPadraoOdontograma` | 2271 | Curta | Defaults do odontograma | Não | Não | Não | Não | Sim, cores e flags visuais | Alto | Cautela |
| `prefContextoPadrao` | 2242 | Curta | Contexto padrão da sessão | Não | Não | Não | **Sim** | Sim, monta apelido/nome | Alto | Cautela |
| `prefResolverContexto` | 2243 | Curta | Resolve contexto do usuário | Não | Não | Não | **Sim** | Sim, usa nome/apelido | Alto | Cautela |
| `prefContextoAtual` | 2244 | Muito curta | Fallback de contexto atual | Não | Não | Não | **Sim** | Não | Alto | Cautela |
| `prefTituloAtual` | 2245 | Curta | Título visível da janela | Não | Não | Não | **Sim** | **Sim** | Alto | Proibido por enquanto |

## Decisão recomendada

**Pausar o módulo Preferências e Opções do Sistema nesta rodada.**

Motivo:

- Os helpers puros menores já foram movidos: `prefOdontoNorm`, `prefValoresPadraoModelos` e `prefOdontoFindByLabel`.
- Os candidatos restantes são mais sensíveis e começam a tocar defaults globais, configuração visual, contexto de sessão e texto visível.
- `prefValoresPadrao`, `prefValoresPadraoDados`, `prefAmbEstiloPadrao`, `prefValoresPadraoAmbiente` e `prefValoresPadraoOdontograma` têm impacto maior do que os helpers já extraídos.
- `prefContextoPadrao`, `prefResolverContexto`, `prefContextoAtual` e `prefTituloAtual` estão mais próximos de estado global e de texto visível da interface.
- Neste ponto, insistir em nova extração aumentaria o risco sistêmico sem trazer o mesmo ganho de isolamento dos passos anteriores.

## Próximo candidato recomendado, se houver

- Não há candidato seguro que eu recomendaria para esta rodada.

## Candidatos possíveis, mas não agora

- `prefValoresPadrao`
- `prefValoresPadraoDados`

## Candidatos com cautela

- `prefAmbEstiloPadrao`
- `prefValoresPadraoAmbiente`
- `prefValoresPadraoOdontograma`
- `prefContextoPadrao`
- `prefResolverContexto`
- `prefContextoAtual`

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

## Recomendação de pausa

Recomendo pausar o módulo nesta rodada porque:

- os helpers puros menores e isoláveis já foram delegados;
- os candidatos restantes têm risco maior;
- os próximos blocos tocam defaults globais, visual, ambiente, odontograma ou contexto;
- payload, salvamento, backend e permissões continuam proibidos;
- é melhor preservar estabilidade e escolher outro módulo mais seguro.

## O que NÃO mover na próxima etapa

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

- Defaults globais podem afetar múltiplas telas.
- Ambiente e odontograma são áreas visuais e mais sensíveis.
- Contexto e título dependem de estado global e de texto visível.
- O módulo já entrou numa faixa de risco maior do que a das extrações anteriores.

## Roteiro futuro de teste

Como esta etapa é documental, não há teste funcional no navegador.

Antes de qualquer nova etapa funcional, os testes mínimos seriam:

1. `Ctrl+F5`.
2. Abrir `Preferências`.
3. Conferir abas sem salvar.
4. Conferir especialmente `Modelos` e `Odontograma`.
5. Abrir `Opções do sistema`.
6. Conferir carregamento sem salvar.
7. Verificar console.
8. Não executar salvamento real se a etapa futura só mover helper/default puro.

## Próxima etapa recomendada

**Subetapa 9 documental — fechamento/reavaliação do módulo Preferências e recomendação do próximo módulo mais seguro.**

## Confirmação final

Nenhum código foi alterado nesta rodada documental. Não houve mudança em `frontend/app.js`, `frontend/index.html` ou no módulo passivo. Não houve alteração em backend, banco, payload, salvamento, permissões ou textos visíveis.
