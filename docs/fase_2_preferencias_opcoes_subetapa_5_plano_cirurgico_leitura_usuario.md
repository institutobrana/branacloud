# Fase 2 - Preferencias e Opcoes do Sistema - Subetapa 5 - Plano cirurgico documental do primeiro recorte minimo

## 1. Contexto da Fase 2
A Fase 2 continua em evolucao com modularizacao e consolidacao documental por frente.

A frente anterior, Editor de texto, permanece pausada/consolidada apos o recorte Bootstrap/abertura e nao deve ser reaberta sem decisao explicita futura do usuario.

## 2. Frente atual e classificacao confirmada
A frente atual continua sendo `Preferencias e Opcoes do Sistema`.

A classificacao multiárea foi confirmada pelo usuario como `configuracao comum`.

Esta confirmacao e importante porque o primeiro recorte futuro somente pode ser avaliado com essa classificacao estabilizada e sem mistura com area profissional especifica.

## 3. Referencias de consolidacao anterior
- Commit `3f2b255` - Consolida recorte bootstrap do editor.
- Commit `c94b8cd` - Reavalia proxima frente apos editor.
- Subetapa 1 concluida no commit `7764e9b` - Documenta contrato funcional de preferencias.
- Subetapa 2 concluida no commit `f7f9b22` - Mapeia tecnicamente preferencias e opcoes.
- Subetapa 3 concluida no commit `db2d646` - Isola blocos candidatos de preferencias.
- Subetapa 4 concluida no commit `a6ddf57` - Refina blocos seguros de preferencias.

## 4. Arquivos lidos
### Documentos
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

## 5. Candidato escolhido para o primeiro recorte futuro
O candidato escolhido continua sendo:

**Leitura isolada de preferências de usuario sem escrita.**

## 6. Justificativa tecnica da escolha
Esse candidato segue sendo o mais conservador porque:

- fica do lado do usuario, nao da clinica;
- pode ser tratado como leitura sem PATCH;
- evita senha administrativa;
- evita permissao sensivel adicional alem do acesso global ja existente;
- evita mistura usuario/clinica;
- evita backend novo;
- evita banco;
- evita seeds;
- evita relatorios/impressos;
- evita odontograma;
- evita fluxo financeiro;
- evita seguranca;
- e o melhor ponto de partida para um eventual primeiro recorte minimo.

## 7. Escopo exato do futuro recorte
### O que entra
- leitura e apresentacao de preferencias de usuario;
- carregamento dos payloads existentes;
- sincronizacao visual da tela para mostrar o estado atual;
- eventual ajuste visual minimo da aba, se necessario para leitura.

### O que nao entra
- salvamento;
- PATCH;
- permissoes adicionais;
- senha administrativa;
- backend novo;
- banco novo;
- schema;
- migrations;
- seeds;
- opcoes por clinica;
- relatorios/impressos;
- odontograma;
- fluxo financeiro;
- seguranca;
- qualquer mistura usuario/clinica.

### Funcoes provaveis envolvidas
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

### Endpoints de leitura envolvidos
- `GET /preferences/general`
- `GET /preferences/models`
- `GET /preferences/environment`
- `GET /preferences/user-data`
- `GET /preferences/odontogram`
- `GET /preferences/report-config`

### Dados lidos
- `usuario.preferencias_usuario_json`
- `usuario.preferencias_impressora_json`

### Arquivos que poderiam ser alterados futuramente
- `frontend/app.js` somente se houver ajuste minimo de leitura/sincronizacao;
- possivelmente nenhum arquivo novo se o recorte continuar apenas de leitura.

### Arquivos que NAO devem ser alterados
- `frontend/index.html`
- `frontend/js/modules`
- `backend`
- banco
- schema
- migrations
- seeds
- endpoints
- `storage/modelos`

## 8. Separacao explicita por natureza do bloco
### Leitura
- `prefCarregarDados`
- `prefContextoPadrao`
- `prefResolverContexto`
- `prefContextoAtual`
- os GETs de preferencias

### Renderizacao visual
- `prefEnsureUI`
- `prefSelecionarAba`
- `prefRenderCombos`
- `prefRenderCombosModelos`
- `prefRenderCombosDados`
- sincronizacao de campos na tela

### Salvamento
- todos os `prefSalvar*`
- todos os `PATCH /preferences/*`

### Permissoes
- `menuActionAccessLevel`
- `menuEnsurePermission`
- grants protegidos
- `configuracao`

### Senha administrativa
- qualquer fluxo de desbloqueio protegido
- `protectedPassDialog`
- `unlockProtectedGrant`

### Clinica/opcoes do sistema
- `GET/PATCH /system-options`
- `sysOptCarregar`
- `sysOptSalvar`
- `sysOptEnsureUI`

### Backend
- qualquer codigo novo em routers, models ou dependencias

### Banco/seeds
- qualquer alteracao estrutural ou seed de dados

## 9. Riscos especificos do futuro patch
- mesmo um recorte de leitura pode ficar dependente de `app.js`, que concentra varios fluxos;
- risco de misturar leitura com sincronizacao visual de varias abas;
- risco de tocar contexto de usuario errado quando a tela pode abrir para usuario selecionado ou para sessao atual;
- risco de o plano escorregar para escrita se a leitura for acoplada a botoes de salvamento;
- risco de acoplar o recorte a UI auxiliar de ambiente, modelos ou odontograma sem necessidade;
- risco de confundir a linha entre renderizacao e persistencia.

## 10. Medidas de contenção
- restringir o primeiro recorte futuro apenas a leitura e apresentacao;
- nao incluir nenhum botao de salvamento;
- nao incluir nenhum PATCH;
- nao incluir senha administrativa;
- nao incluir `system-options`;
- nao incluir qualquer alteracao em `backend`;
- manter o recorte circunscrito a uma aba ou ao carregamento de um conjunto reduzido de dados;
- validar previamente qual usuario esta em contexto;
- evitar qualquer mistura entre usuario e clinica.

## 11. Comparacao entre o que entra e o que fica fora
### Entra no plano futuro
- leitura de preferencias de usuario;
- sincronizacao visual da tela;
- carregamento dos valores ja persistidos.

### Fica fora do plano futuro
- qualquer gravacao;
- qualquer PATCH;
- permissao `configuracao` como alteracao de regra;
- senha administrativa;
- opcoes por clinica;
- backend novo;
- banco novo;
- seeds;
- relatorios/impressos;
- odontograma;
- fluxo financeiro;
- seguranca.

## 12. Critérios mínimos para autorizar a próxima subetapa com código
Antes de qualquer subetapa com codigo, sera necessario confirmar:

- que o bloco continua sendo configuracao comum;
- que o recorte e somente leitura ou organizacao visual sem escrita;
- que nao ha PATCH;
- que nao ha senha administrativa;
- que nao ha backend novo;
- que nao ha banco novo;
- que nao ha mistura usuario/clinica;
- que o comportamento esperado foi descrito em detalhe;
- que o teste humano pode ser feito em Preferencias e Opcoes do Sistema sem afetar outras telas.

## 13. Checks técnicos obrigatórios para uma futura alteração real
Se algum dia houver codigo, deverao ser executados:

- `git status --short`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules`
- `git diff -- backend`
- `git diff -- docs/fase_2_preferencias_opcoes_subetapa_5_plano_cirurgico_leitura_usuario.md`
- validacao de leitura dos endpoints relevantes
- confirmacao de ausencia de `PATCH` no primeiro recorte
- confirmacao de ausencia de qualquer alteracao em permissao e senha administrativa

## 14. Plano de teste humano obrigatório após a futura alteração
Antes e depois de qualquer alteracao funcional futura, o teste humano deve comecar em:

`Preferências e Opções do Sistema`

E validar:
- abertura da tela;
- carregamento das abas;
- carregamento das preferencias do usuario;
- carregamento das opcoes por clinica, apenas para garantir que nada quebrou;
- ausencia de salvamento acidental;
- ausencia de PATCH;
- permissao configuracao;
- senha administrativa quando aplicavel, apenas para garantir que nada foi afetado;
- relatorios;
- odontograma;
- modelos;
- impressos.

## 15. Decisao documental
A decisao documental atual e:

**Nao autorizar a proxima subetapa com codigo ainda.**

Motivo: apesar de o candidato principal ser conservador, o recorte ainda depende de um frontend central bastante acoplado, e o plano precisa permanecer documental ate o fechamento cirurgico minimo ser validado com mais detalhes.

## 16. Proxima subetapa recomendada
Recomenda-se uma nova subetapa documental de plano cirurgico ainda mais detalhado, focada no desenho minimo de implementacao do candidato principal sem editar codigo.

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
- Esta Subetapa 5 cria o plano cirurgico documental do primeiro recorte minimo.
- O candidato escolhido e leitura isolada de preferencias de usuario sem escrita.
- A classificacao multiárea foi confirmada pelo usuario como configuracao comum.
- Nenhum codigo foi alterado.
- Nenhum comportamento foi alterado.
- Nenhuma correcao textual/mojibake foi feita.
- Nenhum backend, banco, endpoint, permissao, sessao, clinica ou usuario foi alterado.
- A decisao sobre autorizar ou nao uma proxima subetapa com codigo foi registrada explicitamente.

## Commit seletivo obrigatorio
- Somente o arquivo `docs/fase_2_preferencias_opcoes_subetapa_5_plano_cirurgico_leitura_usuario.md` deve entrar no commit.
- Nao usar `git add .`.
- Nao usar `git add docs/`.
- Usar `git add` seletivo somente para o arquivo criado.
- Confirmar antes do commit que nao ha alteracoes rastreadas indevidas.
- Confirmar depois do commit quais arquivos entraram.
