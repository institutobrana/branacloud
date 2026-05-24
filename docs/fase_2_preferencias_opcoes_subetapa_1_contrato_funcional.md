# Fase 2 - Preferencias e Opcoes do Sistema - Subetapa 1 - Contrato funcional

## 1. Contexto da Fase 2
A Fase 2 continua em evolucao com modularizacao e consolidacao documental por frente.

A frente anterior, Editor de texto, foi pausada/consolidada apos o recorte Bootstrap/abertura e sua reavaliacao posterior.

## 2. Editor de texto pausado/consolidado
A frente Editor de texto ficou pausada/consolidada no commit `3f2b255`.

A reavaliacao da proxima frente foi registrada no commit `c94b8cd`, que recomendou Preferencias e Opcoes do Sistema como proxima frente conservadora.

## 3. Frente atual
A frente atual passa a ser `Preferencias e Opcoes do Sistema`.

## 4. Classificacao multiarea preliminar
A classificacao preliminar desta frente e `configuracao comum`.

## 5. Justificativa da classificacao
O modulo toca configuracoes de uso geral, preferencias por usuario, configuracoes por clinica e opcoes do sistema que atravessam varios fluxos, mas nao aparenta ser um modulo especifico de uma area profissional isolada.

Tambem ha forte dependencia da permissao `configuracao`, o que reforca a leitura de um modulo de configuracao comum da plataforma.

## 6. Escopo funcional conhecido ou inferido por leitura
Por leitura do backend e do frontend, o modulo parece controlar:

- preferencias gerais do usuario;
- preferencias de modelos padrao;
- preferencias de ambiente;
- dados cadastrais/preferenciais do usuario;
- preferencias do odontograma;
- configuracao de relatorio/impressos;
- opcoes sistêmicas por clinica;
- pontos de integracao com telas do frontend para Preferencias e Opcoes do Sistema.

## 7. Telas, menus, endpoints, rotas, funcoes e arquivos relacionados
### Frontend
- `frontend/index.html`
  - menu `config-preferencias`;
  - botao `users-btn-preferencias`;
  - script `frontend/js/modules/preferencias-opcoes-sistema.js`.
- `frontend/app.js`
  - abertura de `config-preferencias` e `config-opcoes-sistema`;
  - gerenciamento de backdrops e modais associados;
  - chamadas para carregar e salvar preferencias;
  - integracao com a toolbar e com o fluxo de configuracao.
- `frontend/js/modules/preferencias-opcoes-sistema.js`
  - modulo passivo com helpers de preferencias e utilitarios do odontograma.

### Backend
- `backend/routes/preferences_routes.py`
  - rotas `get_general_preferences` / `update_general_preferences`;
  - rotas `get_model_preferences` / `update_model_preferences`;
  - rotas `get_environment_preferences` / `update_environment_preferences`;
  - rotas `get_user_data_preferences` / `update_user_data_preferences`;
  - rotas `get_odontogram_preferences` / `update_odontogram_preferences`;
  - rota de configuracao de relatorio impressao.
- `backend/routes/system_options_routes.py`
  - rotas `obter_opcoes_sistema` / `atualizar_opcoes_sistema`.
- `backend/main.py`
  - inclusao dos routers de preferences e system-options.

### Arquivos de apoio identificados por leitura
- `backend/models/clinica.py`
- `backend/models/usuario.py`
- `backend/security/dependencies.py`
- `backend/security/permissions.py`

## 8. Dependencias identificadas
O modulo depende de:

- permissao `configuracao`;
- senha administrativa em cenarios onde o controle de usuarios esta habilitado por clinica;
- dados de `clinica.opcoes_sistema_json`;
- dados de `usuario.preferencias_usuario_json`;
- dados de `usuario.preferencias_impressora_json`;
- consultas e validacoes que cruzam clinica, usuario e configuracoes globais;
- frontend central em `frontend/app.js`, que centraliza abertura e salvamento de varias telas.

## 9. Riscos tecnicos
- alto acoplamento com o frontend central;
- risco de misturar preferencias por usuario com opcoes por clinica;
- risco de alterar permissao `configuracao` sem perceber impactos em outros modulos;
- risco de tocar em fluxos globais de configuracao e senha administrativa;
- risco de regressao em telas de configuracao ja existentes;
- risco de espalhar alteracoes por varios formulários e abas se nao houver contrato claro.

## 10. Riscos de regressao
- bloquear abertura de preferencias por problema de autorizacao;
- alterar comportamento de salvamento por usuario ou por clinica;
- quebrar a leitura de opcoes de sistema em outras telas;
- impactar preferencias de relatorio, odontograma ou modelos;
- confundir escopo entre configuracao comum e modulos especificos que consomem essas preferencias.

## 11. O que nao deve ser alterado sem contrato proprio
- regras de permissao e senha administrativa;
- backend de preferencias e opcoes de sistema sem mapeamento previo;
- armazenamento em `clinicas.opcoes_sistema_json`;
- armazenamento em `usuarios.preferencias_*_json`;
- telas e funcionalidades de relatorio, odontograma e modelos sem contrato especifico;
- qualquer comportamento de sistema global dependente de configuracao;
- backend, banco, schema, migrations, seeds e endpoints fora do contrato autorizado.

## 12. Criterios de aceite para futuras alteracoes
Antes de qualquer alteracao funcional futura, deve ficar claro:

- qual tela ou aba sera modificada;
- qual rota sera lida ou escrita;
- se a preferencia pertence ao usuario ou a clinica;
- se a alteracao exige permissao `configuracao`;
- se a alteracao precisa de senha administrativa;
- quais valores padrao devem permanecer intactos;
- quais impactos podem ocorrer em relatorio, odontograma, modelos ou outras telas;
- qual comportamento deve ser validado manualmente no navegador.

## 13. Plano conservador de proximas subetapas
1. Subetapa documental de mapeamento tecnico detalhado.
2. Subetapa documental de isolamento de blocos candidatos ao recorte.
3. Subetapa funcional minima apenas depois de contrato funcional e classificacao confirmada.

## 14. Onde testar futuramente
Antes de qualquer alteracao funcional futura, o usuario deve testar no sistema:

- abrir a tela de Preferencias;
- abrir a tela de Opcoes do Sistema;
- carregar preferencias gerais;
- carregar preferencias de modelos;
- carregar preferencias de ambiente;
- carregar preferencias de dados do usuario;
- carregar preferencias de odontograma;
- salvar cada aba/fase configuravel;
- validar permissao `configuracao`;
- validar comportamento com senha administrativa quando habilitada;
- confirmar que nada em editor, agenda, financeiro e demais modulos foi afetado.

## 15. Confirmacoes
- A frente Editor de texto esta pausada/consolidada;
- o contrato funcional desta frente nova e apenas documental;
- nenhum codigo foi alterado nesta etapa;
- nenhum backend, banco, endpoint, permissao, sessao, clinica ou usuario foi alterado;
- nenhuma correcao textual ampla ou de mojibake foi feita.

## 16. Registro para roadmap
- A frente Editor de texto foi pausada/consolidada apos o commit `3f2b255`.
- A reavaliacao pos-Editor recomendou Preferencias e Opcoes do Sistema no commit `c94b8cd`.
- Esta etapa inicia documentalmente a frente Preferencias e Opcoes do Sistema.
- A classificacao preliminar e configuracao comum.
- Nenhum codigo foi alterado.
- Nenhum backend, banco, endpoint, permissao, sessao, clinica ou usuario foi alterado.
- Nenhuma correcao textual ampla ou de mojibake foi feita.
- A proxima etapa deve continuar documental com mapeamento tecnico antes de qualquer recorte funcional.

## 17. Commit seletivo obrigatorio
- Somente o arquivo `docs/fase_2_preferencias_opcoes_subetapa_1_contrato_funcional.md` deve entrar no commit.
- Nao usar `git add .`.
- Nao usar `git add docs/`.
- Usar `git add` seletivo somente para o documento criado.
- Confirmar antes do commit que nao ha alteracoes rastreadas indevidas.
- Confirmar depois do commit quais arquivos entraram.
