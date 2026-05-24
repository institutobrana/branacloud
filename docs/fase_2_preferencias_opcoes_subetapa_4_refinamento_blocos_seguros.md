# Fase 2 - Preferencias e Opcoes do Sistema - Subetapa 4 - Refinamento documental dos blocos seguros

## 1. Contexto da Fase 2
A Fase 2 continua em evolucao com modularizacao e consolidacao documental por frente.

A frente anterior, Editor de texto, permanece pausada/consolidada apos o recorte Bootstrap/abertura e nao deve ser reaberta sem decisao explicita futura do usuario.

## 2. Frente atual e classificacao preliminar
A frente atual continua sendo `Preferencias e Opcoes do Sistema`.

A classificacao multiarea preliminar continua sendo `configuracao comum`.

Esta classificacao segue coerente com a dependencia de permissao `configuracao`, com a existencia de preferencias por usuario e opcoes por clinica, e com o fato de o modulo atravessar varios fluxos transversais da plataforma sem indicar uma especialidade profissional isolada.

## 3. Referencias de consolidacao anterior
- Commit `3f2b255` - Consolida recorte bootstrap do editor.
- Commit `c94b8cd` - Reavalia proxima frente apos editor.
- Subetapa 1 concluida no commit `7764e9b` - Documenta contrato funcional de preferencias.
- Subetapa 2 concluida no commit `f7f9b22` - Mapeia tecnicamente preferencias e opcoes.
- Subetapa 3 concluida no commit `db2d646` - Isola blocos candidatos de preferencias.

## 4. Arquivos lidos
### Documentos
- `docs/fase_2_preferencias_opcoes_subetapa_3_isolamento_blocos_candidatos.md`
- `docs/fase_2_preferencias_opcoes_subetapa_2_mapeamento_tecnico.md`
- `docs/fase_2_preferencias_opcoes_subetapa_1_contrato_funcional.md`
- `docs/fase_2_reavaliacao_proxima_frente_pos_editor_texto.md`
- `docs/fase_2_editor_texto_subetapa_7_consolidacao_recorte_bootstrap.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/11_roadmap_desenvolvimento.md`

### Backend
- `backend/routes/preferences_routes.py`
- `backend/routes/system_options_routes.py`
- `backend/models/clinica.py`
- `backend/models/usuario.py`
- `backend/security/dependencies.py`
- `backend/security/permissions.py`

### Frontend
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `frontend/js/modules`

## 5. Blocos seguros/candidatos reavaliados
Blocos reavaliados como mais seguros, com base no isolamento tecnico anterior:

- leitura isolada de preferencias de usuario sem escrita;
- leitura isolada de opcoes da clinica sem escrita;
- shell visual de uma aba especifica sem alterar persistencia;
- montagem de UI auxiliar sem mudar comportamento;
- shell visual de Preferencias;
- Aba Geral de Preferencias;
- carregamento de preferencias de usuario;
- Aba data de Opcoes do Sistema.

## 6. Refinamento tecnico dos blocos candidatos
### 6.1 Leitura isolada de preferencias de usuario sem escrita
- Responsabilidade atual: buscar e renderizar as preferencias do usuario sem gravar.
- Funcoes frontend provaveis: `prefCarregarDados`, `prefContextoAtual`, `prefValoresPadrao*`, `prefSincronizarUI`.
- Rotas/endpoints envolvidos: `GET /preferences/general`, `GET /preferences/models`, `GET /preferences/environment`, `GET /preferences/user-data`, `GET /preferences/odontogram`, `GET /preferences/report-config`.
- Dados lidos: `usuario.preferencias_usuario_json`, `usuario.preferencias_impressora_json`.
- Pertence ao usuario ou clinica: usuario.
- Dependencia de permissao `configuracao`: sim.
- Dependencia de senha administrativa: nao no fluxo de leitura, mas o acesso ainda e protegido.
- Dependencias de sessao/usuario/clinica/perfis: `sessaoAtual`, usuario alvo, perfis/grants protegidos.
- DOM/IDs/eventos envolvidos: `#config-preferencias-backdrop`, `#pref-*`, tabs, botao de abrir modal.
- Risco tecnico: medio.
- Risco de regressao: medio.
- Pode ser primeiro recorte futuro: sim, se ficar somente em leitura e shell visual.
- O que entraria: apenas carregamento e apresentacao de dados.
- O que ficaria fora: PATCH, salvamento, alteracao de cadastro, permissao, senha administrativa.
- Critérios de aceite: carregar valores corretos, nao alterar sessao, nao alterar persistencia.
- Teste humano: abrir Preferencias, validar os valores carregados e alternar abas.

### 6.2 Leitura isolada de opcoes da clinica sem escrita
- Responsabilidade atual: buscar e renderizar opcoes sistêmicas da clinica sem gravar.
- Funcoes frontend provaveis: `sysOptCarregar`, `sysOptEnsureUI`, `sysOptSelecionarAba`, `sysOptSyncUI`.
- Rotas/endpoints envolvidos: `GET /system-options`.
- Dados lidos: `clinica.opcoes_sistema_json`, `clinica.nome`, `clinica.cnpj`.
- Pertence ao usuario ou clinica: clinica.
- Dependencia de permissao `configuracao`: sim.
- Dependencia de senha administrativa: sim, quando o controle de usuarios esta habilitado, ainda que o fluxo de leitura deva ser validado com o acesso protegido.
- Dependencias de sessao/usuario/clinica/perfis: `sessaoAtual`, clinica atual, grant protegido, perfis.
- DOM/IDs/eventos envolvidos: `#config-opcoes-sistema-backdrop`, `#sysopt-*`, tabs, botao de abrir modal.
- Risco tecnico: alto.
- Risco de regressao: alto.
- Pode ser primeiro recorte futuro: somente com cautela, e menos seguro que leitura de preferencias de usuario.
- O que entraria: apenas carregamento e exibicao sem escrita.
- O que ficaria fora: PATCH, alteracao de clinica, alteracao de CNPJ/nome, fluxo de senha administrativa, permissao.
- Critérios de aceite: carregar valores da clinica correta e nao acionar escrita.
- Teste humano: abrir Opcoes do Sistema e validar a aba clinica em leitura.

### 6.3 Shell visual de uma aba especifica sem alterar persistencia
- Responsabilidade atual: montar abas, campos e layout.
- Funcoes frontend provaveis: `prefEnsureUI`, `prefSelecionarAba`, `sysOptEnsureUI`, `sysOptSelecionarAba`.
- Rotas/endpoints envolvidos: nenhum diretamente, salvo carregamento posterior.
- Dados lidos: depende da aba.
- Pertence ao usuario ou clinica: varia.
- Dependencia de permissao configuracao: sim para acesso ao modal.
- Dependencia de senha administrativa: no shell visual, nao necessariamente; depende do modulo pai.
- Dependencias de sessao/usuario/clinica/perfis: `sessaoAtual`, grant protegido, contexto atual.
- DOM/IDs/eventos envolvidos: backdrops, tabs, panes e botoes.
- Risco tecnico: medio/alto.
- Risco de regressao: medio/alto.
- Pode ser primeiro recorte futuro: sim, se a alteracao for apenas visual e sem salvar.
- O que entraria: estrutura da aba, sem persistencia.
- O que ficaria fora: carregamento complexo, PATCH, permissao, senha administrativa.
- Critérios de aceite: renderizacao correta sem alterar comportamento.
- Teste humano: abrir modal, trocar abas e confirmar que nada quebra.

### 6.4 Montagem de UI auxiliar sem mudar comportamento
- Responsabilidade atual: apoiar escolhas como dialogo de fonte, listas, previews e hints.
- Funcoes frontend provaveis: `prefAbrirDialogoFonteAmbiente`, `prefRenderCombos`, `sysOptRenderSelects`.
- Rotas/endpoints envolvidos: indiretos, conforme a aba.
- Dados lidos: conforme contexto.
- Pertence ao usuario ou clinica: varia.
- Dependencia de permissao configuracao: sim.
- Dependencia de senha administrativa: nao costuma ser o foco deste bloco.
- Dependencias de sessao/usuario/clinica/perfis: contexto ativo e grant protegido.
- DOM/IDs/eventos envolvidos: elementos auxiliares de fonte, listas e previews.
- Risco tecnico: medio.
- Risco de regressao: medio.
- Pode ser primeiro recorte futuro: sim, se for apenas montagem de UI.
- O que entraria: dialogos e widgets auxiliares.
- O que ficaria fora: escrita, validação persistente e backend.
- Critérios de aceite: UI auxiliar renderiza sem alterar dados.
- Teste humano: abrir, interagir e fechar sem efeitos colaterais.

### 6.5 Shell visual de Preferencias
- Responsabilidade atual: organizar a interface de preferencias do usuario.
- Funcoes frontend provaveis: `prefEnsureUI`, `prefAbrir`, `prefSelecionarAba`, `prefAtualizarTitulo`.
- Rotas/endpoints envolvidos: nenhum diretamente, a nao ser o carregamento posterior.
- Dados lidos: conforme as abas carregadas.
- Pertence ao usuario ou clinica: usuario.
- Dependencia de permissao configuracao: sim.
- Dependencia de senha administrativa: nao no shell visual em si.
- Dependencias de sessao/usuario/clinica/perfis: `sessaoAtual`, usuario alvo, grants protegidos.
- DOM/IDs/eventos envolvidos: `#config-preferencias-backdrop`, `#pref-*`.
- Risco tecnico: medio.
- Risco de regressao: medio.
- Pode ser primeiro recorte futuro: sim.
- O que entraria: apenas o contorno visual e a navegação interna.
- O que ficaria fora: salvamento e PATCH.
- Critérios de aceite: modal abre e tabs funcionam.
- Teste humano: abrir Preferencias e validar alternancia de abas.

### 6.6 Aba Geral de Preferencias
- Responsabilidade atual: preferencias gerais do usuario.
- Funcoes frontend provaveis: `prefRenderCombos`, `prefColetarPayload`, `prefSalvarGeral`.
- Rotas/endpoints envolvidos: `GET/PATCH /preferences/general`.
- Dados lidos: `usuario.preferencias_usuario_json`.
- Pertence ao usuario ou clinica: usuario.
- Dependencia de permissao configuracao: sim.
- Dependencia de senha administrativa: nao para leitura, sim para acesso global protegido.
- Dependencias de sessao/usuario/clinica/perfis: `sessaoAtual`, usuario alvo, perfis.
- DOM/IDs/eventos envolvidos: `#pref-geral-*`, tabs e botao Ok.
- Risco tecnico: medio.
- Risco de regressao: medio.
- Pode ser primeiro recorte futuro: leitura sim; escrita nao.
- O que entraria: apenas leitura e renderizacao.
- O que ficaria fora: PATCH, persistencia e alteracao de defaults.
- Critérios de aceite: valores carregados corretamente sem gravacao.
- Teste humano: abrir a aba Geral e conferir campos.

### 6.7 Carregamento de preferencias de usuario
- Responsabilidade atual: agregador sequencial de carregamento das abas de preferencias.
- Funcoes frontend provaveis: `prefCarregarDados`.
- Rotas/endpoints envolvidos: `GET /preferences/general`, `GET /preferences/models`, `GET /preferences/environment`, `GET /preferences/user-data`, `GET /preferences/odontogram`, `GET /preferences/report-config`.
- Dados lidos: JSONs e payloads do usuario.
- Pertence ao usuario ou clinica: usuario.
- Dependencia de permissao configuracao: sim.
- Dependencia de senha administrativa: nao no carregamento isolado.
- Dependencias de sessao/usuario/clinica/perfis: `sessaoAtual`, usuario alvo, grants protegidos.
- DOM/IDs/eventos envolvidos: backdrop de preferencias, mensagens de carregamento, tabs.
- Risco tecnico: medio.
- Risco de regressao: medio.
- Pode ser primeiro recorte futuro: sim, e o candidato mais conservador entre os de usuario.
- O que entraria: somente GETs, normalizacao e sincronizacao de UI.
- O que ficaria fora: qualquer PATCH.
- Critérios de aceite: nao alterar dados, nao acionar salvamento.
- Teste humano: abrir Preferencias e confirmar leitura completa.

### 6.8 Aba data de Opcoes do Sistema
- Responsabilidade atual: formatos de data, hora e calendario da clinica.
- Funcoes frontend provaveis: `sysOptRenderSelects`, `sysOptColetarPayload`, `sysOptSyncUI`.
- Rotas/endpoints envolvidos: `GET/PATCH /system-options`.
- Dados lidos: `clinica.opcoes_sistema_json`.
- Pertence ao usuario ou clinica: clinica.
- Dependencia de permissao configuracao: sim.
- Dependencia de senha administrativa: sim, quando o controle de usuarios estiver habilitado.
- Dependencias de sessao/usuario/clinica/perfis: `sessaoAtual`, clinica atual, admin, perfis.
- DOM/IDs/eventos envolvidos: `#sysopt-data-*`, tabs e inputs de tempo.
- Risco tecnico: medio.
- Risco de regressao: medio.
- Pode ser primeiro recorte futuro: apenas como leitura visual.
- O que entraria: exibicao e leitura dos formatos.
- O que ficaria fora: PATCH e regras protegidas.
- Critérios de aceite: dados exibidos corretamente e sem efeito colateral.
- Teste humano: abrir a aba Data e conferir campos.

## 7. Comparacao entre os blocos candidatos
### Mais seguros
1. Carregamento de preferencias de usuario sem escrita.
2. Shell visual de Preferencias.
3. Aba Geral de Preferencias em leitura.
4. Aba data de Opcoes do Sistema em leitura.

### Menos seguros
1. Leitura de opcoes da clinica sem escrita.
2. Shell visual de Opcoes do Sistema.
3. Aba Ambiental, Dados, Odontograma e Relatorios/Impressos.

### Menos indicados para primeiro recorte
- tudo que envolva salvamento;
- tudo que envolva PATCH;
- tudo que envolva permissao configuracao e senha administrativa no mesmo pacote;
- tudo que atravesse usuario e clinica ao mesmo tempo;
- tudo que toque relatorios, odontograma, financeiro e seguranca.

## 8. Escolha de candidato principal para possivel primeiro recorte futuro
O candidato principal mais seguro para um possivel primeiro recorte futuro e:

**Leitura isolada de preferencias de usuario sem escrita.**

## 9. Justificativa tecnica da escolha
Esse candidato e o mais conservador porque:

- fica do lado do usuario, nao da clinica;
- pode ser tratado como leitura sem PATCH;
- permite validar o contrato visual sem alterar persistencia;
- reduz o impacto sobre permissao, senha administrativa e seguranca;
- e o bloco que melhor preserva o principio de recorte minimo.

## 10. Escopo exato do possivel primeiro recorte futuro
### O que entraria
- somente leitura e apresentacao de preferencias de usuario;
- carregamento dos payloads existentes;
- eventual acomodacao visual da aba sem alterar dados.

### O que nao entraria
- PATCH;
- salvamento;
- permissao configuracao;
- senha administrativa;
- backend novo;
- alteracao de banco;
- seeds;
- relatorios/impressos;
- odontograma;
- fluxo financeiro;
- seguranca;
- qualquer mistura usuario/clinica.

### Arquivos que poderiam ser criados/alterados futuramente
- possivelmente apenas `frontend/app.js` se o contrato visual precisar de ajuste minimo;
- eventualmente nenhum arquivo novo se o recorte permanecer apenas documental.

### Funcoes provaveis envolvidas
- `prefCarregarDados`;
- `prefEnsureUI`;
- `prefSelecionarAba`;
- `prefSincronizarUI`.

### Rotas envolvidas
- `GET /preferences/general`;
- `GET /preferences/models`;
- `GET /preferences/environment`;
- `GET /preferences/user-data`;
- `GET /preferences/odontogram`;
- `GET /preferences/report-config`.

### Persistencia envolvida
- `usuario.preferencias_usuario_json`;
- `usuario.preferencias_impressora_json`.

## 11. Lista explicita do que nao deve ser tocado no primeiro recorte futuro
- salvamento;
- PATCH;
- permissões;
- senha administrativa;
- backend;
- banco;
- seeds;
- relatorios/impressos;
- odontograma;
- fluxo financeiro;
- seguranca;
- qualquer mistura usuario/clinica.

## 12. Criterios minimos para autorizar a futura alteracao de codigo
- confirmar a classificacao multiárea do bloco escolhido;
- confirmar que o bloco permanece apenas de leitura ou shell visual;
- confirmar que nao ha PATCH;
- confirmar que nao ha senha administrativa;
- confirmar que nao ha escrita em backend ou banco;
- confirmar que nao ha mistura usuario/clinica;
- definir o comportamento esperado antes do primeiro patch;
- validar manualmente a tela antes e depois.

## 13. Plano de teste humano obrigatorio
Antes de qualquer alteracao funcional futura, o teste humano deve comecar em:

`Preferencias e Opcoes do Sistema`

E validar, conforme o bloco:
- abertura da tela;
- carregamento das abas;
- preferencias do usuario;
- opcoes por clinica;
- salvamento das preferencias;
- salvamento das opcoes;
- permissao configuracao;
- senha administrativa quando aplicavel;
- relatorios;
- odontograma;
- modelos;
- impressos.

## 14. Decisao documental
Neste momento, a decisao documental e **nao autorizar ainda uma alteracao de codigo**.

A leitura indica que o bloco mais seguro e ainda mais prudente de ser tratado em uma etapa seguinte continua sendo documental, para fechar um plano cirurgico minimo antes de qualquer PATCH, escrita ou modificação do frontend.

## 15. Proxima subetapa recomendada
Recomenda-se uma nova subetapa **documental de plano cirurgico** antes de qualquer codigo, para:

- fechar o recorte minimo do candidato principal;
- registrar as funcoes e IDs exatos a serem tocados, se algum dia houver codigo;
- evitar mistura entre leitura, escrita e autorizacao no mesmo primeiro passo.

## 16. Confirmacoes
- Editor de texto permanece pausado/consolidado;
- a frente atual continua sendo Preferencias e Opcoes do Sistema;
- a classificacao preliminar continua sendo configuracao comum;
- nenhum codigo foi alterado nesta etapa;
- nenhum backend, banco, endpoint, permissao, sessao, clinica ou usuario foi alterado;
- nenhuma correcao textual ou de mojibake foi feita.

## Registro para roadmap
- A frente atual continua sendo Preferencias e Opcoes do Sistema.
- Editor de texto permanece pausado/consolidado.
- A Subetapa 1 foi concluida no commit `7764e9b`.
- A Subetapa 2 foi concluida no commit `f7f9b22`.
- A Subetapa 3 foi concluida no commit `db2d646`.
- Esta Subetapa 4 refina documentalmente os blocos mais seguros.
- A classificacao preliminar continua sendo configuracao comum.
- Nenhum codigo foi alterado.
- Nenhum comportamento foi alterado.
- Nenhuma correcao textual/mojibake foi feita.
- Nenhum backend, banco, endpoint, permissao, sessao, clinica ou usuario foi alterado.
- A decisao sobre autorizar ou nao uma proxima subetapa com codigo foi registrada explicitamente.
- Antes de iniciar qualquer recorte funcional futuro, o usuario devera confirmar novamente a classificacao multiarea do bloco escolhido, se houver duvida.

## Commit seletivo obrigatorio
- Somente o arquivo `docs/fase_2_preferencias_opcoes_subetapa_4_refinamento_blocos_seguros.md` deve entrar no commit.
- Nao usar `git add .`.
- Nao usar `git add docs/`.
- Usar `git add` seletivo somente para o arquivo criado.
- Confirmar antes do commit que nao ha alteracoes rastreadas indevidas.
- Confirmar depois do commit quais arquivos entraram.
