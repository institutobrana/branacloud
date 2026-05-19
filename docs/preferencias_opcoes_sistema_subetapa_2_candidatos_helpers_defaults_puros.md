# Preferências e Opções do Sistema — Subetapa 2 — Candidatos a helpers/defaults puros

## Objetivo

Documentar, sem alterar comportamento, quais funções de `frontend/app.js` podem ser consideradas candidatas futuras para extração conservadora como helpers/defaults puros do módulo `Preferências e Opções do Sistema`.

Esta etapa é somente documental. Não houve movimentação de código, não houve criação de módulo novo e não houve qualquer alteração em payload, salvamento, backend, banco, permissões ou textos visíveis.

## Escopo

- Revalidar o estado atual do módulo passivo `frontend/js/modules/preferencias-opcoes-sistema.js`.
- Identificar funções puras, funções com cautela e funções proibidas por enquanto.
- Propor uma ordem conservadora para eventual etapa funcional mínima futura.
- Preservar a blindagem textual / mojibake: nada foi corrigido nesta etapa.

## Arquivos inspecionados

- `docs/preferencias_opcoes_sistema_subetapa_0_mapeamento_monolitico.md`
- `docs/preferencias_opcoes_sistema_subetapa_1_namespace_passivo.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `frontend/index.html`

## Checks iniciais

- Branch atual verificada: `modularizacao-segura-fase-1`.
- Histórico local verificado: `5da5197` aparece como commit mais recente na linha de trabalho desta rodada.
- `git diff --stat` sem diffs rastreados.
- `git diff --cached --stat` sem diffs staged.
- `git status --short` com pendências preexistentes fora do escopo desta etapa documental.
- Nenhum comando destrutivo ou de alteração de repositório foi executado.

## Base documental usada

- A Subetapa 0 já havia feito o mapeamento monolítico do bloco.
- A Subetapa 1 já havia criado o namespace passivo.
- O arquivo do módulo passivo confirma que o comportamento foi apenas encapsulado em metadata, sem migração funcional.
- A blindagem textual / mojibake permanece obrigatória; qualquer texto estranho encontrado deve ser tratado apenas como risco documental.

## Critérios de classificação

**Candidato seguro**

- Não acessa DOM.
- Não chama `fetch` / `requestJson`.
- Não salva dados.
- Não monta payload.
- Não altera estado global.
- Não depende de função visual.
- Não altera texto visível.
- Pode ser copiado literalmente sem mudar comportamento.
- Pode receber wrapper/fallback no `app.js` numa etapa futura.

**Candidato com cautela**

- Lê estado global.
- Depende de contexto atual.
- Retorna textos usados na interface.
- Retorna objetos grandes de configuração.
- Pode impactar aparência global.
- Depende de outros defaults ainda concentrados no `app.js`.

**Proibido por enquanto**

- Usa DOM.
- Chama backend/API.
- Salva dados.
- Monta payload.
- Altera permissões.
- Altera abertura/fechamento.
- Altera sincronização visual.
- Pode mudar comportamento global do sistema.

## Funções analisadas

| Função | Linha aprox. | Papel | DOM | API/backend | Payload/salvamento | Estado global | Strings visíveis | Classificação | Estratégia futura |
|---|---:|---|---|---|---|---|---|---|---|
| `prefContextoPadrao` | 2242 | Monta contexto padrão a partir de `sessaoAtual` | Não | Não | Não | Sim | Sim, mas internas | Candidato com cautela | Manter no `app.js` até haver wrapper claro |
| `prefResolverContexto` | 2243 | Resolve contexto de usuário ou fallback padrão | Não | Não | Não | Sim | Sim, mas internas | Candidato com cautela | Documentar mais antes |
| `prefContextoAtual` | 2244 | Retorna contexto vigente de `prefCfg` ou fallback | Não | Não | Não | Sim | Não | Candidato com cautela | Manter no `app.js` por dependência de estado |
| `prefTituloAtual` | 2245 | Monta título da janela de preferências | Não | Não | Não | Sim | Sim | Candidato com cautela | Não mover ainda; depende de contexto e texto visível |
| `prefValoresPadrao` | 2246 | Defaults gerais do bloco de preferências | Não | Não | Não | Não | Não visíveis | Candidato seguro | Mover como cópia literal com wrapper/fallback futuro |
| `prefValoresPadraoModelos` | 2247 | Defaults dos modelos | Não | Não | Não | Não | Não visíveis | Candidato seguro | Mover como cópia literal com wrapper/fallback futuro |
| `prefAmbEstiloPadrao` | 2249 | Default de estilo de ambiente | Não | Não | Não | Não | Sim, mas internos de configuração | Candidato seguro | Cópia literal conservadora, com validação posterior |
| `prefValoresPadraoAmbiente` | 2250 | Defaults do ambiente por seção | Não | Não | Não | Não | Não visíveis | Candidato seguro | Cópia literal com wrapper/fallback futuro |
| `prefValoresPadraoDados` | 2251 | Defaults dos dados do usuário | Não | Não | Não | Não | Não visíveis | Candidato seguro | Cópia literal com wrapper/fallback futuro |
| `prefValoresPadraoOdontograma` | 2267 | Defaults do odontograma | Não | Não | Não | Não | Sim, mas internos de configuração | Candidato seguro | Cópia literal com wrapper/fallback futuro |
| `prefOdontoNorm` | 2455 | Normalização de texto para busca/igualdade | Não | Não | Não | Não | Não | Candidato seguro | Melhor primeira candidata funcional, se ainda precisar de etapa mínima |
| `prefOdontoFindByLabel` | 2456 | Busca item da paleta por label normalizado | Não | Não | Não | Não | Sim, na paleta | Candidato com cautela | Documentar mais antes; depende de palette estática e labels |
| `prefAbrir` | 2851 | Abertura da janela de preferências | Sim indireto via UI | Sim | Sim | Sim | Sim | Proibido por enquanto | Não mover |
| `prefEnsureUI` | 2644 | Montagem/garantia da UI | Sim | Não | Não | Sim | Sim | Proibido por enquanto | Não mover |
| `prefSincronizarUI` | 2541 | Sincroniza estado com controles | Sim | Não | Não | Sim | Sim | Proibido por enquanto | Não mover |
| `prefCarregarDados` | 2638 | Carrega dados por API | Não direto, mas opera UI | Sim | Sim implícito | Sim | Sim | Proibido por enquanto | Não mover |
| `prefSalvarGeral` | 2639 | Salva preferências gerais | Sim | Sim | Sim | Sim | Sim | Proibido por enquanto | Não mover |
| `prefSalvarModelos` | 2640 | Salva modelos | Sim | Sim | Sim | Sim | Sim | Proibido por enquanto | Não mover |
| `prefSalvarAmbiente` | 2641 | Salva ambiente | Sim | Sim | Sim | Sim | Sim | Proibido por enquanto | Não mover |
| `prefSalvarDados` | 2642 | Salva dados do usuário | Sim | Sim | Sim | Sim | Sim | Proibido por enquanto | Não mover |
| `prefSalvarOdontograma` | 2643 | Salva odontograma | Sim | Sim | Sim | Sim | Sim | Proibido por enquanto | Não mover |
| `prefColetarPayload` | 2614 | Monta payload geral | Não direto, mas usa estado da UI | Não | Sim | Sim | Sim | Proibido por enquanto | Não mover |
| `prefColetarPayloadModelos` | 2615 | Monta payload de modelos | Não direto, mas usa estado da UI | Não | Sim | Sim | Sim | Proibido por enquanto | Não mover |
| `prefColetarPayloadAmbiente` | 2616 | Monta payload de ambiente | Não direto, mas usa estado da UI | Não | Sim | Sim | Sim | Proibido por enquanto | Não mover |
| `prefColetarPayloadDados` | 2617 | Monta payload de dados | Não direto, mas usa estado da UI | Não | Sim | Sim | Sim | Proibido por enquanto | Não mover |
| `prefColetarPayloadOdontograma` | 2637 | Monta payload de odontograma | Não direto, mas usa estado da UI | Não | Sim | Sim | Sim | Proibido por enquanto | Não mover |
| `sysOptSelecionarAba` | 2853 | Troca abas e footer | Sim | Não | Não | Sim | Sim | Proibido por enquanto | Não mover |
| `sysOptRenderSelects` | 2868 | Preenche selects dinâmicos | Sim | Não direto, mas depende de dados | Não | Sim | Sim | Proibido por enquanto | Não mover |
| `sysOptSyncUI` | 2924 | Sincroniza tela de opções | Sim | Não | Não | Sim | Sim | Proibido por enquanto | Não mover |
| `sysOptColetarPayload` | 2991 | Monta payload de sistema | Sim | Não direto | Sim | Sim | Sim | Proibido por enquanto | Não mover |
| `sysOptCarregar` | 3048 | Busca opções no backend | Não direto, mas opera UI | Sim | Sim implícito | Sim | Sim | Proibido por enquanto | Não mover |
| `sysOptSalvar` | 3061 | Salva opções do sistema | Sim | Sim | Sim | Sim | Sim | Proibido por enquanto | Não mover |
| `sysOptFechar` | 3081 | Fecha painel | Sim | Não | Não | Sim | Sim | Proibido por enquanto | Não mover |
| `sysOptAbrir` | 3089 | Abre painel | Sim | Sim indireto | Sim indireto | Sim | Sim | Proibido por enquanto | Não mover |
| `sysOptEnsureUI` | 3097 | Garante/instala UI | Sim | Não | Não | Sim | Sim | Proibido por enquanto | Não mover |

## Candidatos seguros

- `prefOdontoNorm`
- `prefValoresPadrao`
- `prefValoresPadraoModelos`
- `prefAmbEstiloPadrao`
- `prefValoresPadraoAmbiente`
- `prefValoresPadraoDados`
- `prefValoresPadraoOdontograma`

Leitura conservadora: são funções puras, sem DOM, sem API, sem salvamento e sem alteração de estado global. O risco principal é apenas o de extração prematura sem wrapper/fallback, não de mudança funcional imediata.

## Candidatos com cautela

- `prefContextoPadrao`
- `prefResolverContexto`
- `prefContextoAtual`
- `prefTituloAtual`
- `prefOdontoFindByLabel`

Motivo da cautela: dependem de contexto atual, de texto visível, ou de tabelas/labels que participam da UI. São estáveis no comportamento observado, mas ainda não são os melhores primeiros alvos para extração.

## Proibidos por enquanto

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
- `sysOptSelecionarAba`
- `sysOptRenderSelects`
- `sysOptSyncUI`
- `sysOptColetarPayload`
- `sysOptCarregar`
- `sysOptSalvar`
- `sysOptFechar`
- `sysOptAbrir`
- `sysOptEnsureUI`

Motivo: essas funções já encostam em DOM, fluxo de abertura/fechamento, sincronização visual, payload, salvamento ou API/backend.

## Ordem futura recomendada de extração

1. `prefOdontoNorm`, se a próxima etapa funcional mínima precisar de um helper isolado e realmente puro.
2. `prefValoresPadrao`, `prefValoresPadraoModelos` e `prefValoresPadraoDados`, como defaults literais e isolados.
3. `prefAmbEstiloPadrao` e `prefValoresPadraoAmbiente`, somente com wrapper/fallback claro para evitar alteração de aparência global.
4. `prefValoresPadraoOdontograma`, após comparação literal com o comportamento atual.
5. `prefContextoPadrao` e `prefResolverContexto`, apenas se houver necessidade de reordenar o fluxo de contexto com risco controlado.
6. `prefTituloAtual`, por último, porque já participa diretamente do texto visível da janela.

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
- qualquer `sysOpt*` com DOM/API/payload/salvamento
- abertura/fechamento
- permissões
- backend/API
- handlers
- dispatcher
- menus
- strings visíveis
- mojibake

## Riscos remanescentes

- Risco visual: defaults de ambiente e odontograma podem afetar a aparência e a leitura de estado da interface.
- Risco textual / mojibake: já existem textos visivelmente degradados no bloco de opções do sistema; não devem ser corrigidos nesta etapa.
- Risco de payload: qualquer ponte prematura com `prefColetarPayload*` ou `sysOptColetarPayload` muda o contrato de envio.
- Risco de salvamento: `prefSalvar*` e `sysOptSalvar` já estão acoplados à persistência.
- Risco backend / banco: o bloco de opções do sistema trabalha com endpoints e estrutura de valores já consolidados.
- Risco de dependência cruzada: `prefContexto*` e `prefTituloAtual` ainda dependem de estado e de texto de interface.

## Roteiro futuro de teste

Como esta etapa é documental, não há teste funcional no navegador.

Roteiro sugerido para uma eventual Subetapa 3 funcional mínima:

1. `Ctrl+F5`.
2. Abrir `Preferências`.
3. Conferir abas sem salvar.
4. Abrir `Opções do sistema`.
5. Conferir abas sem salvar.
6. Verificar console.
7. Não executar salvamento real se a etapa futura mover apenas helper puro.

## Próxima etapa recomendada

Recomendação conservadora: **Subetapa 3 funcional mínima apenas para um helper puro isolado**, com preferência para `prefOdontoNorm` ou, se houver justificativa documental adicional, um dos defaults literais mais simples.

Se a intenção for manter o risco ainda menor, a alternativa segura é fazer antes mais uma etapa documental curta para confirmar wrappers/fallbacks e a posição exata de cada consumo.

## Confirmação final

Nenhuma alteração funcional foi feita nesta etapa. Nenhum arquivo de código, HTML, backend, banco, migration, endpoint, payload ou salvamento foi alterado.
