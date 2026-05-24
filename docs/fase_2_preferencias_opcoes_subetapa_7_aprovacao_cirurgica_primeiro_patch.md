# Fase 2 - Preferencias e Opcoes do Sistema - Subetapa 7 - Aprovacao cirurgica final antes do primeiro patch

## 1. Contexto da Fase 2
A Fase 2 continua em evolucao com modularizacao e consolidacao documental por frente.

A frente anterior, Editor de texto, permanece pausada/consolidada apos o recorte Bootstrap/abertura e nao deve ser reaberta sem decisao explicita futura do usuario.

## 2. Frente atual e classificacao confirmada
A frente atual continua sendo `Preferencias e Opcoes do Sistema`.

A classificacao multiárea foi confirmada pelo usuario como `configuracao comum`.

Essa confirmacao continua sendo obrigatoria porque o bloco escolhido e um bloco de configuracao comum e nao deve ser tratado como area profissional especifica.

## 3. Referencias de consolidacao anterior
- Commit `3f2b255` - Consolida recorte bootstrap do editor.
- Commit `c94b8cd` - Reavalia proxima frente apos editor.
- Subetapa 1 concluida no commit `7764e9b` - Documenta contrato funcional de preferencias.
- Subetapa 2 concluida no commit `f7f9b22` - Mapeia tecnicamente preferencias e opcoes.
- Subetapa 3 concluida no commit `db2d646` - Isola blocos candidatos de preferencias.
- Subetapa 4 concluida no commit `a6ddf57` - Refina blocos seguros de preferencias.
- Subetapa 5 concluida no commit `7ad78c8` - Planeja recorte de leitura de preferencias.
- Subetapa 6 concluida no commit `8f2838a` - Fecha plano cirurgico de leitura de preferencias.

## 4. Arquivos lidos
### Documentos
- `docs/fase_2_preferencias_opcoes_subetapa_6_plano_cirurgico_final_leitura_usuario.md`
- `docs/fase_2_preferencias_opcoes_subetapa_5_plano_cirurgico_leitura_usuario.md`
- `docs/fase_2_preferencias_opcoes_subetapa_4_refinamento_blocos_seguros.md`
- `docs/fase_2_preferencias_opcoes_subetapa_3_isolamento_blocos_candidatos.md`
- `docs/fase_2_preferencias_opcoes_subetapa_2_mapeamento_tecnico.md`
- `docs/fase_2_preferencias_opcoes_subetapa_1_contrato_funcional.md`
- `docs/fase_2_reavaliacao_proxima_frente_pos_editor_texto.md`
- `docs/fase_2_editor_texto_subetapa_7_consolidacao_recorte_bootstrap.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/11_roadmap_desenvolvimento.md`

### Backend
- `backend/routes/preferences_routes.py`
- `backend/models/usuario.py`
- `backend/security/dependencies.py`
- `backend/security/permissions.py`

### Frontend
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `frontend/js/modules`

## 5. Recorte sob aprovacao
O recorte sob aprovacao continua sendo:

**Leitura isolada de preferencias de usuario sem escrita.**

## 6. Decisao cirurgica final
A decisao cirurgica final, neste momento, e: **nao autorizar a proxima subetapa com codigo ainda**.

### Motivo exato
Apesar de o candidato continuar sendo o mais conservador, a leitura tecnica mostra que o fluxo ainda esta concentrado em `frontend/app.js`, com varias abas, estados e sincronizacoes compartilhados. Isso faz com que o menor patch real ainda nao esteja fechado o suficiente para ser autorizado sem um plano cirurgico mais granular de linha/trecho.

## 7. Menor patch permitido, se um dia for autorizado
Se futuramente houver autorizacao, o menor patch permitido teria que ser:

- somente em `frontend/app.js`;
- somente para leitura e sincronizacao visual;
- sem `PATCH`;
- sem salvamento;
- sem backend;
- sem banco;
- sem schema;
- sem migrations;
- sem seeds;
- sem permissao sensivel;
- sem senha administrativa;
- sem opcoes por clinica;
- sem mistura usuario/clinica;
- sem relatorios/impressos;
- sem odontograma;
- sem modelos;
- sem financeiro;
- sem seguranca;
- sem texto/mojibake.

### O que entraria
- leitura dos payloads ja existentes;
- sincronizacao visual da tela;
- eventual ajuste visual minimo da aba, se estritamente necessario.

### O que nao entraria
- qualquer salvamento;
- qualquer PATCH;
- qualquer alteracao em backend;
- qualquer alteracao em banco ou seeds;
- qualquer alteracao em rotas;
- qualquer alteracao em opcoes por clinica;
- qualquer alteracao em permissao ou senha administrativa;
- qualquer alteracao em relatorios, odontograma, modelos, financeiro ou seguranca.

### Funcoes possiveis
- `prefCarregarDados`
- `prefEnsureUI`
- `prefSelecionarAba`
- `prefContextoPadrao`
- `prefResolverContexto`
- `prefContextoAtual`
- `prefValoresPadrao`
- `prefValoresPadraoModelos`
- `prefValoresPadraoAmbiente`
- `prefValoresPadraoDados`
- `prefValoresPadraoOdontograma`
- `prefRenderCombos`
- `prefRenderCombosModelos`
- `prefRenderCombosDados`

### Funcoes proibidas
- `prefSalvarGeral`
- `prefSalvarModelos`
- `prefSalvarAmbiente`
- `prefSalvarDados`
- `prefSalvarOdontograma`
- qualquer `PATCH /preferences/*`
- qualquer rotina `requestJson("PATCH", ...)`
- qualquer rotina `sysOpt*`
- qualquer rotina de permissao
- qualquer rotina de senha administrativa
- qualquer rotina `protectedGrant*`
- qualquer rotina de backend novo
- qualquer rotina de banco
- qualquer rotina de relatorios/impressos
- qualquer rotina de odontograma funcional
- qualquer rotina de modelos funcional
- qualquer rotina financeira
- qualquer rotina de seguranca

### Arquivo permitido
- `frontend/app.js`, somente se inevitavel e com diff minimo

### Arquivos proibidos
- `frontend/index.html`
- `frontend/js/modules`
- `backend`
- banco
- schema
- migrations
- seeds
- endpoints
- `storage/modelos`

### Endpoints GET apenas por consumo
- `GET /preferences/general`
- `GET /preferences/models`
- `GET /preferences/environment`
- `GET /preferences/user-data`
- `GET /preferences/odontogram`
- `GET /preferences/report-config`

## 8. Como garantir que nao havera PATCH / salvamento
- o patch futuro nao pode tocar em `prefSalvar*`;
- o patch futuro nao pode introduzir `requestJson("PATCH", ...)`;
- o patch futuro nao pode incluir botao de salvar;
- o patch futuro nao pode alterar handlers de persistencia;
- o patch futuro deve ficar restrito a leitura e sincronizacao visual.

## 9. Como garantir que backend / banco / endpoints nao serao alterados
- o patch futuro nao pode criar novos routers;
- o patch futuro nao pode alterar rotas existentes;
- o patch futuro nao pode introduzir novos endpoints;
- o patch futuro nao pode alterar models ou colunas;
- o patch futuro nao pode alterar schema, migrations ou seeds;
- o patch futuro nao pode tocar em `preferences_routes.py` nem em `system_options_routes.py` para escrita;
- o patch futuro deve consumir apenas GETs ja existentes.

## 10. Como garantir que permissoes / senha administrativa / opcoes por clinica ficam fora
- nao tocar em `menuActionAccessLevel` como regra nova;
- nao tocar em `menuEnsurePermission` como regra nova;
- nao tocar em `protectedPassDialog`, `unlockProtectedGrant` ou qualquer `protectedGrant*`;
- nao tocar em `sysOpt*`;
- nao tocar em `GET/PATCH /system-options`;
- nao misturar usuario e clinica no mesmo patch.

## 11. Riscos finais do primeiro patch real
- o maior risco ainda e o acoplamento de `frontend/app.js`;
- o patch pode escorregar para escrita se a leitura estiver muito junto de salvar;
- o patch pode tocar mais abas do que o necessario;
- o patch pode acabar levando contexto de usuario e sincronizacao visual em um mesmo bloco;
- o patch pode ser pequeno no codigo, mas grande no efeito se nao estiver extremamente bem delimitado.

## 12. Medidas finais de contenção
- manter o patch apenas em leitura e sincronizacao visual;
- nao misturar com qualquer persistencia;
- nao incluir permissao nem senha administrativa;
- nao incluir `system-options`;
- nao incluir relatorios/impressos, odontograma, modelos, financeiro ou seguranca;
- nao incluir arquivo novo se nao for absolutamente necessario;
- manter o diff reversivel por inspeccao manual;
- parar imediatamente se o diff crescer.

## 13. Checks tecnicos obrigatorios para a futura alteracao real
Se algum dia houver codigo, deverao ser executados:

- `git status --short`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules`
- `git diff -- backend`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/preferencias-opcoes-sistema.js`, se esse arquivo for alterado
- busca no diff por `PATCH`
- busca no diff por `prefSalvar`
- busca no diff por `sysOpt`
- busca no diff por `protectedGrant`
- confirmacao de que nenhum endpoint backend foi alterado
- confirmacao de que nenhum arquivo de banco/schema/migrations/seeds foi alterado

## 14. Plano de teste humano obrigatorio
Antes e depois de qualquer alteracao funcional futura, o teste humano deve comecar em:

`Preferências e Opções do Sistema`

E validar:
- abertura da tela;
- carregamento das abas;
- carregamento das preferencias do usuario;
- carregamento das opcoes por clinica apenas para garantir que nada quebrou;
- ausencia de salvamento acidental;
- ausencia de PATCH;
- permissao configuracao;
- senha administrativa quando aplicavel apenas para garantir que nada foi afetado;
- relatorios;
- odontograma;
- modelos;
- impressos;
- console sem erros.

## 15. Estrategia de interrupcao
Se o diff crescer alem do minimo, a estrategia correta e interromper o recorte, voltar ao plano documental e reescrever o contrato antes de qualquer commit funcional.

Nao se deve tentar "forcar" o patch em tamanho maior apenas para cumprir uma etapa.

## 16. Proxima subetapa recomendada
A recomendacao e manter a frente em controle documental e, antes de qualquer patch, produzir um plano cirurgico de implementacao minima por linha/trecho, caso o usuario queira avancar no futuro.

## 17. Confirmacoes
- Editor de texto permanece pausado/consolidado;
- a frente atual continua sendo Preferencias e Opcoes do Sistema;
- a classificacao multiárea foi confirmada pelo usuario como configuracao comum;
- nenhum codigo foi alterado nesta etapa;
- nenhum backend, banco, endpoint, permissao, sessao, clinica ou usuario foi alterado;
- nenhuma correcao textual ou de mojibake foi feita.

## Registro para roadmap
- A frente atual continua sendo Preferencias e Opcoes do Sistema.
- Editor de texto permanece pausado/consolidado.
- A Subetapa 1 foi concluida no commit `7764e9b`.
- A Subetapa 2 foi concluida no commit `f7f9b22`.
- A Subetapa 3 foi concluida no commit `db2d646`.
- A Subetapa 4 foi concluida no commit `a6ddf57`.
- A Subetapa 5 foi concluida no commit `7ad78c8`.
- A Subetapa 6 foi concluida no commit `8f2838a`.
- Esta Subetapa 7 cria a aprovacao cirurgica final antes do primeiro patch.
- O candidato escolhido e leitura isolada de preferencias de usuario sem escrita.
- A classificacao multiárea foi confirmada pelo usuario como configuracao comum.
- Nenhum codigo foi alterado.
- Nenhum comportamento foi alterado.
- Nenhuma correcao textual/mojibake foi feita.
- Nenhum backend, banco, endpoint, permissao, sessao, clinica ou usuario foi alterado.
- A decisao final sobre autorizar ou nao a proxima subetapa com codigo foi registrada explicitamente.

## Commit seletivo obrigatorio
- Somente o arquivo `docs/fase_2_preferencias_opcoes_subetapa_7_aprovacao_cirurgica_primeiro_patch.md` deve entrar no commit.
- Nao usar `git add .`.
- Nao usar `git add docs/`.
- Usar `git add` seletivo somente para o arquivo criado.
- Confirmar antes do commit que nao ha alteracoes rastreadas indevidas.
- Confirmar depois do commit quais arquivos entraram.
