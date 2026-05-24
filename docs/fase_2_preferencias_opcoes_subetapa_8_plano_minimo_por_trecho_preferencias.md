# Fase 2 - Preferencias e Opcoes do Sistema - Subetapa 8 - Plano cirurgico de implementacao minimo por linha/trecho

## Contexto
A Fase 2 continua em consolidacao documental por frente.

A frente anterior, Editor de texto, permanece pausada/consolidada apos o recorte Bootstrap/abertura e nao deve ser reaberta sem decisao explicita futura do usuario.

A frente atual continua sendo `Preferencias e Opcoes do Sistema`.

O recorte ainda sob estudo permanece sendo:

**Leitura isolada de preferencias de usuario sem escrita.**

## Classificacao multiarea
Classificacao confirmada: `configuracao comum`.

Nao implementar controle multiarea nesta etapa.

## Decisao herdada da Subetapa 7
A Subetapa 7 nao autorizou codigo.

O motivo herdado continua valido: `frontend/app.js` ainda concentra leitura, sincronizacao visual e outros fluxos compartilhados, o que impede a liberacao segura de um primeiro patch real sem um plano mais granular por linha/trecho.

## Objetivo desta Subetapa 8
Fechar o plano documental no nivel minimo possivel de linha/trecho para um futuro patch, apenas para leitura e sincronizacao visual, sem implementacao agora.

Esta etapa nao autoriza codigo novo.

## Arquivos lidos
### Documentos
- `docs/fase_2_preferencias_opcoes_subetapa_7_aprovacao_cirurgica_primeiro_patch.md`
- `docs/fase_2_preferencias_opcoes_subetapa_6_plano_cirurgico_final_leitura_usuario.md`
- `docs/fase_2_preferencias_opcoes_subetapa_5_plano_cirurgico_leitura_usuario.md`
- `docs/fase_2_preferencias_opcoes_subetapa_4_refinamento_blocos_seguros.md`
- `docs/fase_2_preferencias_opcoes_subetapa_3_isolamento_blocos_candidatos.md`
- `docs/fase_2_preferencias_opcoes_subetapa_2_mapeamento_tecnico.md`
- `docs/fase_2_preferencias_opcoes_subetapa_1_contrato_funcional.md`
- `docs/fase_2_reavaliacao_proxima_frente_pos_editor_texto.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/11_roadmap_desenvolvimento.md`

### Frontend
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/preferencias-opcoes-sistema.js`

## Funcoes analisadas em frontend/app.js
As funcoes abaixo foram analisadas por leitura, sem alteracao:

- `prefContextoPadrao`
- `prefResolverContexto`
- `prefContextoAtual`
- `prefValoresPadrao`
- `prefValoresPadraoModelos`
- `prefValoresPadraoAmbiente`
- `prefValoresPadraoDados`
- `prefValoresPadraoOdontograma`
- `prefSelecionarAba`
- `prefRenderCombos`
- `prefRenderCombosModelos`
- `prefRenderCombosDados`
- `prefEnsureUI`
- `prefCarregarDados`

Tambem foram confirmadas, como fora do recorte futuro:

- `prefSalvarGeral`
- `prefSalvarModelos`
- `prefSalvarAmbiente`
- `prefSalvarDados`
- `prefSalvarOdontograma`
- `sysOpt*`
- `protectedGrant*`
- funcoes de permissao
- funcoes de senha administrativa
- funcoes de backend
- funcoes de banco
- funcoes de relatarios/impressos
- funcoes de odontograma funcional
- funcoes de modelos funcional
- funcoes financeiras
- funcoes de seguranca

## Mapa minimo por funcao/trecho
### `prefContextoPadrao`
- Finalidade atual: define o contexto padrao da sessao.
- Participacao: leitura e definicao de contexto.
- Pode ser candidata a patch futuro: nao, salvo ajuste de delimitacao de leitura.
- Deve permanecer intocada: sim, neste momento.
- Risco: baixo, mas muito acoplada ao contexto global.
- Contencao: manter somente como origem do contexto de leitura.

### `prefResolverContexto`
- Finalidade atual: escolhe o contexto entre usuario alvo e contexto padrao.
- Participacao: leitura e selecao de contexto.
- Pode ser candidata a patch futuro: talvez, apenas se houver delimitacao minima de leitura.
- Deve permanecer intocada: sim, enquanto o patch nao estiver autorizado.
- Risco: medio, porque pode misturar usuario alvo e sessao.
- Contencao: nao ampliar para escrita nem para opcoes por clinica.

### `prefContextoAtual`
- Finalidade atual: retorna o contexto efetivo ja memorizado.
- Participacao: leitura/sincronizacao de estado.
- Pode ser candidata a patch futuro: nao, exceto se o patch precisar apenas consumir contexto.
- Deve permanecer intocada: sim.
- Risco: medio, porque e ponto de entrada de varias abas.
- Contencao: usar apenas para leitura.

### `prefValoresPadrao`
- Finalidade atual: fornece defaults da aba geral.
- Participacao: leitura/estado padrao.
- Pode ser candidata a patch futuro: nao, salvo ajuste de defaults sem escrita.
- Deve permanecer intocada: sim.
- Risco: baixo.
- Contencao: nao converter em fluxo de persistencia.

### `prefValoresPadraoModelos`
- Finalidade atual: carrega defaults de modelos via modulo passivo.
- Participacao: leitura/estado padrao.
- Pode ser candidata a patch futuro: nao, salvo ajuste visual minimo.
- Deve permanecer intocada: sim.
- Risco: baixo.
- Contencao: manter como apoio de leitura.

### `prefValoresPadraoAmbiente`
- Finalidade atual: produz defaults das secoes de ambiente.
- Participacao: leitura/estado padrao.
- Pode ser candidata a patch futuro: nao, porque ambiente tem muito comportamento visual.
- Deve permanecer intocada: sim.
- Risco: medio.
- Contencao: nao aproximar de salvamento ou de dialogo de fonte.

### `prefValoresPadraoDados`
- Finalidade atual: defaults dos dados do usuario.
- Participacao: leitura/estado padrao.
- Pode ser candidata a patch futuro: talvez, mas apenas em leitura.
- Deve permanecer intocada: sim.
- Risco: medio, por tocar dados pessoais do usuario.
- Contencao: nao misturar com dados de clinica.

### `prefValoresPadraoOdontograma`
- Finalidade atual: defaults do odontograma.
- Participacao: leitura/estado padrao.
- Pode ser candidata a patch futuro: nao neste recorte.
- Deve permanecer intocada: sim.
- Risco: alto por integracao externa ao bloco principal.
- Contencao: deixar fora do primeiro patch real.

### `prefSelecionarAba`
- Finalidade atual: alterna abas e atualiza mensagem de rodape.
- Participacao: sincronizacao visual.
- Pode ser candidata a patch futuro: sim, apenas para leitura/sincronizacao visual.
- Deve permanecer intocada: nao, se o patch futuro precisar limitar a visualizacao.
- Risco: medio, por ser ponto comum de varias abas.
- Contencao: evitar acoplar salvamento ou permissoes.

### `prefRenderCombos`
- Finalidade atual: preenche combos da aba geral.
- Participacao: renderizacao visual.
- Pode ser candidata a patch futuro: sim, se o patch permanecer somente visual.
- Deve permanecer intocada: nao necessariamente, se houver ajuste minimo de render.
- Risco: medio, porque depende de options carregadas do backend.
- Contencao: nao alterar payload nem destino de persistencia.

### `prefRenderCombosModelos`
- Finalidade atual: preenche combos da aba modelos.
- Participacao: renderizacao visual.
- Pode ser candidata a patch futuro: sim, somente se o patch continuar leitura/renderizacao.
- Deve permanecer intocada: preferencialmente sim, ate haver necessidade concreta.
- Risco: medio.
- Contencao: nao tocar em modelos funcionais nem em salvar.

### `prefRenderCombosDados`
- Finalidade atual: auxilia a renderizacao da aba dados do usuario.
- Participacao: renderizacao visual.
- Pode ser candidata a patch futuro: sim, apenas em leitura visual.
- Deve permanecer intocada: nao necessariamente, mas sem escrita.
- Risco: medio.
- Contencao: nao introduzir persistencia.

### `prefEnsureUI`
- Finalidade atual: monta a estrutura do modal e registra eventos.
- Participacao: organizacao visual e wiring de eventos.
- Pode ser candidata a patch futuro: talvez, somente se houver ajuste estrutural minimo.
- Deve permanecer intocada: preferencialmente sim nesta etapa.
- Risco: alto, pois e o ponto onde a tela se conecta a varios fluxos.
- Contencao: nao expandir para salvar, permissao ou opcoes por clinica.

### `prefCarregarDados`
- Finalidade atual: faz as leituras GET das preferencias e sincroniza o estado visual.
- Participacao: leitura e sincronizacao visual.
- Pode ser candidata a patch futuro: sim, e o principal ponto de analise por trecho.
- Deve permanecer intocada: ainda nao, ate autorizacao formal.
- Risco: alto, porque concentra os GETs, o contexto do usuario e a montanha de estados.
- Contencao: manter apenas leitura, sem PATCH, sem salvar e sem misturar clinica.

## Menor patch futuro possivel, se existir
Se um dia for autorizado, o menor patch futuro possivel ainda teria de ficar restrito a `frontend/app.js` e, idealmente, a um trecho muito curto ligado ao carregamento e a sincronizacao visual da leitura de preferencias de usuario.

Mesmo nesse caso, o patch nao pode tocar em salvamento, permissao, senha administrativa, backend, banco, endpoints novos, `sysOpt*`, `protectedGrant*`, relatorios, odontograma, modelos, financeiro, seguranca ou qualquer mistura usuario/clinica.

## Critrios para bloquear o patch futuro
Bloquear o patch se ocorrer qualquer um dos pontos abaixo:

- aparecer `PATCH`;
- aparecer `prefSalvar*`;
- aparecer `sysOpt*`;
- aparecer `protectedGrant*`;
- aparecer escrita em backend ou banco;
- aparecer dependencias com opcoes por clinica;
- aparecer dependencias com permissao ou senha administrativa;
- aparecer dependencias com relatorios, odontograma, modelos, financeiro ou seguranca;
- crescer demais o diff de `frontend/app.js`;
- deixar de ser apenas leitura/sincronizacao visual;
- misturar usuario e clinica no mesmo bloco.

## Critrios minimos para autorizar uma futura Subetapa 9 com codigo
Para autorizar uma futura Subetapa 9 com codigo, seria necessario cumprir tudo isto:

- classificacao confirmada como configuracao comum;
- recorte somente de leitura ou organizacao visual sem escrita;
- sem PATCH;
- sem salvamento;
- sem backend;
- sem banco;
- sem schema, migrations ou seeds;
- sem permissao sensivel;
- sem senha administrativa;
- sem opcoes por clinica;
- sem mistura usuario/clinica;
- sem relatorios/impressos, odontograma, modelos, financeiro ou seguranca;
- diff pequeno e auditavel;
- teste humano claro em `Preferencias e Opcoes do Sistema`.

Neste momento, esses criterios ainda nao estao suficientes para liberar codigo.

## Itens expressamente proibidos
- `prefSalvarGeral`
- `prefSalvarModelos`
- `prefSalvarAmbiente`
- `prefSalvarDados`
- `prefSalvarOdontograma`
- qualquer rotina `PATCH /preferences/*`
- qualquer rotina `requestJson("PATCH", ...)`
- qualquer rotina `sysOpt*`
- qualquer rotina de permissao
- qualquer rotina de senha administrativa
- qualquer rotina `protectedGrant*`
- qualquer rotina de backend
- qualquer rotina de banco
- qualquer rotina de relatorios/impressos
- qualquer rotina de odontograma funcional
- qualquer rotina de modelos funcional
- qualquer rotina financeira
- qualquer rotina de seguranca

## Garantias contra PATCH/salvamento
- O patch futuro, se algum dia existir, nao podera tocar em `prefSalvar*`.
- O patch futuro nao podera introduzir `requestJson("PATCH", ...)`.
- O patch futuro nao podera adicionar botao de salvar nem handler novo de persistencia.
- O patch futuro devera permanecer somente em leitura e sincronizacao visual.

## Garantias contra alteracao de backend/banco/endpoints
- Nao criar novos routers.
- Nao alterar rotas existentes.
- Nao criar endpoints novos.
- Nao alterar models.
- Nao alterar schema, migrations ou seeds.
- Nao tocar em `preferences_routes.py` nem em `system_options_routes.py` para escrita.
- Consumir apenas GETs ja existentes.

## Garantias contra permissoes/senha administrativa/opcoes por clinica
- Nao tocar em `menuActionAccessLevel`.
- Nao tocar em `menuEnsurePermission`.
- Nao tocar em `protectedPassDialog`, `unlockProtectedGrant` ou qualquer `protectedGrant*`.
- Nao tocar em `sysOpt*`.
- Nao tocar em `GET/PATCH /system-options`.
- Nao misturar usuario e clinica no mesmo patch.

## Blindagem textual/mojibake
Respeitar integralmente:

`docs/regras_blindagem_correcoes_textuais_mojibake.md`

Nenhuma correcao textual foi feita nesta etapa.

## Checks tecnicos executados
Checks de leitura e validacao executados:

- `git status --short`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules`
- `git diff -- backend`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/preferencias-opcoes-sistema.js`
- `git log --oneline -8`
- busca em `frontend/app.js` por `prefCarregarDados`, `prefEnsureUI`, `prefSelecionarAba`, `prefSalvar`, `PATCH`, `sysOpt` e `protectedGrant`

Resultado sintetico:

- os diffs de `frontend/app.js`, `frontend/index.html`, `frontend/js/modules` e `backend` permaneceram vazios;
- os checks de sintaxe em `frontend/app.js` e no modulo passivo de preferencias passaram;
- a busca em `frontend/app.js` confirmou a coexistencia de leitura, renderizacao, salvamento e fluxos compartilhados, reforcando o risco do patch.

## Plano de teste humano futuro
Antes e depois de qualquer alteracao funcional futura, o teste humano deve comecar em:

`Preferencias e Opcoes do Sistema`

Validar:

- abertura da tela;
- carregamento das abas;
- carregamento das preferencias do usuario;
- carregamento das opcoes por clinica apenas para garantir que nada quebrou;
- ausencia de salvamento acidental;
- ausencia de PATCH;
- permissao `configuracao`;
- senha administrativa quando aplicavel apenas para garantir que nada foi afetado;
- relatorios;
- odontograma;
- modelos;
- impressos;
- console sem erros.

## Decisao final da Subetapa 8
A decisao final e: **nao autoriza uma futura Subetapa 9 com codigo ainda**.

Motivo objetivo: `frontend/app.js` continua amplo e acoplado demais para fechar um patch pequeno, auditavel e sem risco de atravesar escrita, permissao ou fluxos compartilhados.

A recomendacao e manter a frente em refinamento documental antes de liberar qualquer alteracao funcional.

## Registro para roadmap
- A frente atual continua sendo `Preferencias e Opcoes do Sistema`.
- Editor de texto permanece pausado/consolidado.
- A Subetapa 8 foi criada como plano cirurgico de implementacao minimo por linha/trecho.
- A classificacao multiarea continua sendo `configuracao comum`.
- Esta etapa foi exclusivamente documental.
- Nenhum codigo foi alterado.
- Nenhum backend, banco, endpoint, permissao, sessao, clinica ou usuario foi alterado.
- Nenhum PATCH ou salvamento foi feito.
- A blindagem textual/mojibake foi respeitada.
- A decisao final permanece: nao autorizar ainda uma futura Subetapa 9 com codigo.

## Commit seletivo obrigatorio
- Somente este arquivo deve entrar no commit desta etapa.
- Nao usar `git add .`.
- Nao usar `git add docs/`.
- Usar git add seletivo somente para este arquivo.
- Confirmar antes do commit que nao ha alteracoes rastreadas indevidas.
- Confirmar depois do commit quais arquivos entraram.
