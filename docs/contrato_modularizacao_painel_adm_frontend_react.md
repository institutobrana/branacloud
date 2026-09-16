# Contrato de modularizacao do Painel ADM no frontend React

## 1. Identificacao

- Projeto: Brana Cloude
- Frente: Integracao e migracao modular do Painel ADM para o frontend React
- Status: documental, sem implementacao funcional
- Fonte de referencia: auditoria tecnica do painel ADM legado e estrutura real do React

## 2. Contexto

O painel administrativo atual existe no frontend legado em `frontend/app.js` e `frontend/index.html`, com blocos distintos de usuarios, superadmin, opcoes do sistema e areas adjacentes. O novo React nao deve reproduzir esse monolito nem depender do DOM legado.

## 3. Decisao arquitetural

O Painel ADM do React sera uma feature propria, modular, protegida e extensivel, com navegacao interna, layout dedicado e separacao clara entre roteamento, autorizacao, servicos, hooks, seções e testes.

## 4. Objetivo

Definir o contrato tecnico para construir no React um novo modulo ADM moderno e separado, reaproveitando apenas o que for seguro do backend e do contrato funcional ja existente.

## 5. Escopo

- Criacao da fundacao ADM React.
- Item `ADM` no menu do topo.
- Rota protegida propria do ADM.
- Layout administrativo dedicado.
- Navegacao interna por seções.
- Reaproveitamento controlado de endpoints existentes.
- Contratos de autorizacao frontend e backend.
- Matriz de testes da fundacao.

## 6. Fora do escopo

- Nao abrir o painel administrativo legado como solucao definitiva.
- Nao copiar `frontend/app.js` para o React.
- Nao criar iframe.
- Nao criar endpoints novos agora.
- Nao alterar backend, banco, autenticacao ou permissoes nesta etapa.
- Nao migrar todo o conteudo administrativo em uma unica entrega.

## 7. Inventario funcional resumido

Funcionalidades legadas identificadas para futura migracao modular:

- Usuarios da clinica.
- Painel ADM da plataforma.
- Opcoes do sistema.
- Licenca e plano.
- Preferencias relacionadas ao contexto administrativo.

## 8. Principios de modularizacao

- Um arquivo, uma responsabilidade principal.
- Autorizacao nao repetida manualmente em toda tela.
- `services` para acesso HTTP.
- `hooks` para estado reutilizavel e autorizacao.
- Seções isoladas por dominio.
- Componentes compartilhados apenas quando houver reutilizacao real.
- Backend continua como fonte de verdade para regras criticas.

## 9. Arquitetura proposta

O ADM React deve seguir a organizacao real de `frontend-react/src/features`, com uma feature propria, por exemplo:

```text
frontend-react/src/features/admin/
  AdminRoutes.jsx
  AdminLayout.jsx
  AdminHomePage.jsx
  components/
  hooks/
  services/
  utils/
  sections/
  tests/
```

Os nomes podem ser ajustados para o padrao real do projeto, mas a separacao de responsabilidades deve permanecer.

## 10. Organizacao de diretorios

Estrutura candidata:

- `frontend-react/src/features/admin/AdminRoutes.jsx`
- `frontend-react/src/features/admin/AdminLayout.jsx`
- `frontend-react/src/features/admin/AdminHomePage.jsx`
- `frontend-react/src/features/admin/components/`
- `frontend-react/src/features/admin/hooks/`
- `frontend-react/src/features/admin/services/`
- `frontend-react/src/features/admin/utils/`
- `frontend-react/src/features/admin/sections/`
- `frontend-react/src/features/admin/tests/`

## 11. Responsabilidades dos componentes

- `App.jsx`: registrar apenas a entrada principal ou composicao minima.
- `AdminRoutes`: coordenar as rotas filhas.
- `AdminLayout`: fornecer shell administrativo, estados vazios e de erro.
- `AdminNavigation`: fornecer navegacao entre areas.
- `AdminHomePage`: apresentar landing page administrativa e atalhos.
- `sections/*`: conter cada area funcional real.
- `services/*`: encapsular chamadas HTTP.
- `hooks/*`: encapsular autorizacao, estados e efeitos reutilizaveis.

## 12. Roteamento

A rota administrativa deve ser propria do React, permanecer dentro do frontend, permitir refresh e nao depender do legado nem de query string para conceder acesso.

Contrato conceitual:

- requer sessao autenticada;
- requer permissao administrativa;
- responde com tela de acesso negado para `403`;
- responde com necessidade de login para `401`;
- usa base path atual do React;
- funciona localmente e na AWS;
- nao carrega o painel legado.

## 13. Layout administrativo

O ADM React deve ter um layout proprio com:

- cabecalho da area;
- navegacao interna;
- conteudo principal;
- loading;
- empty state;
- error state;
- access denied;
- retorno ao shell principal.

Nao deve recriar o shell inteiro do app quando uma composicao menor for suficiente.

## 14. Navegacao

- Navegacao interna por rotas filhas.
- Menu do usuario no canto superior direito abre o ADM principal.
- Navegacao por teclado deve funcionar.
- O retorno ao shell principal deve ser claro e acessivel.

## 15. Autorizacao frontend

Regra visual conservadora:

- mostrar o item `ADM` apenas para usuarios que o backend ja exponha como aptos, preferencialmente via `/me`;
- nao usar comparacao direta de e-mail como regra principal;
- nao confiar em esconder item como defesa de seguranca;
- tratar `is_admin` e `is_superadmin` como sinais de interface, nunca como unica autorizacao final.

## 16. Autorizacao backend

O backend continua sendo a fonte final de autorizacao.

Regras observadas na auditoria:

- `get_current_user`
- `is_owner_email`
- `is_platform_superadmin_user`
- `require_module_access`
- `require_admin_password_if_user_control_enabled`
- `is_admin`
- `is_superadmin`

O contrato nao cria nova fonte concorrente de permissao.

## 17. Servicos de API

Os services do ADM React devem:

- encapsular `fetch`;
- centralizar headers de auth;
- padronizar erro `401` e `403`;
- evitar chamadas HTTP espalhadas em componentes;
- reaproveitar endpoints existentes quando o contrato for seguro.

## 18. Hooks

Hooks esperados:

- hook de autorizacao administrativa;
- hook de carregamento do contexto ADM;
- hook de navegacao de seções;
- hook de estado de lista/detalhe;
- hook de persistencia de filtros ou preferencias quando houver justificativa.

## 19. Componentes compartilhados

Criar componentes compartilhados apenas para reutilizacao real, por exemplo:

- tabela padrao;
- formulario padrao;
- shell de erro;
- shell de carregamento;
- confirmacao de acao perigosa;
- breadcrumb ou header de area.

## 20. Divisao por modulos

Modulos reais a considerar:

- Usuarios
- Superadmin da plataforma
- Configuracoes do sistema
- Licenca e plano
- Preferencias administrativas

Nao inventar modulos sem evidencia no legado.

## 21. Estrategia incremental

### Fase 1: fundacao do ADM React

- item ADM no menu;
- rota protegida;
- layout;
- pagina inicial;
- navegacao interna;
- autorizacao;
- estados de `401` e `403`;
- testes da fundacao.

### Fase 2 em diante: um modulo por vez

Para cada modulo:

1. auditoria detalhada
2. contrato especifico
3. API/service
4. pagina
5. componentes
6. testes
7. documentacao
8. validacao local
9. commit seletivo

## 22. Contrato da fundacao

A fundacao ADM React deve conter somente o necessario para:

- entrar no modulo;
- proteger o acesso;
- mostrar landing page ou dashboard inicial;
- expor navegacao para as seções reais;
- tratar `401` e `403`;
- respeitar tema, acessibilidade e responsividade.

Nao deve fingir ter todos os modulos prontos.

## 23. Contrato dos modulos posteriores

Cada modulo posterior deve nascer com:

- contrato funcional proprio;
- service proprio ou compartilhado com justificativa;
- hooks locais quando houver estado complexo;
- testes dedicados;
- documentacao do dominio;
- validacao local antes de commit seletivo.

## 24. Matriz de endpoints

Classificacao de endpoints do legado:

### Reutilizavel sem alteracao

- `GET /me`
- `POST /login`
- `POST /logout`
- `POST /auth/renew`

### Reutilizavel com ajuste pequeno

- `/admin/users/*`
- `/superadmin/*`
- `/system-options`

### Inadequado para consumo direto pelo React

- rotas que dependem fortemente do DOM ou do estado global do `app.js`

### Sem protecao suficiente

- qualquer endpoint que nao tiver filtro de autenticacao, permissao ou contexto correto ao ser reavaliado em futuras fases

### Acoplado ao legado

- funcoes e fluxos que exigem `sessaoAtual`, caches globais ou manipulacao de DOM do `frontend/app.js`

### Necessita endpoint novo

- somente se uma area futura do ADM exigir contrato explicitamente mais limpo do que o legado oferece

## 25. Matriz de testes

### Fundacao

1. MASTER ADM ve o item.
2. Usuario comum nao ve.
3. Usuario comum acessando a rota diretamente recebe acesso negado.
4. Usuario administrativo autorizado abre o modulo.
5. Token invalido resulta em `401`.
6. Usuario autenticado sem permissao resulta em `403`.
7. Atualizacao direta da rota funciona.
8. Logout bloqueia novo acesso.
9. Tema claro funciona.
10. Tema escuro funciona.
11. Navegacao por teclado funciona.
12. Build React passa.
13. Testes existentes nao regridem.
14. Nenhuma funcao do `app.js` e chamada.
15. Nenhuma pagina legado e carregada.
16. Nenhum token aparece na URL.

### Modulos posteriores

Cada modulo deve ter testes proprios de leitura, criacao, alteracao, exclusao e autorizacao conforme escopo.

## 26. Criterios de aceite

- O ADM e uma feature propria do React.
- A rota e protegida e recarregavel.
- O menu do topo abre o modulo certo.
- O backend segue sendo a fonte final de autorizacao.
- Nao existe acoplamento ao legado.
- Nao existe monolito administrativo em um unico componente.

## 27. Criterios de qualidade modular

- Cada arquivo possui responsabilidade clara.
- Nao existe componente administrativo central excessivamente grande.
- A API nao fica espalhada pelas paginas.
- A autorizacao nao e repetida manualmente em toda tela.
- As rotas filhas ficam fora do `App.jsx` principal.
- As seções nao conhecem detalhes internos umas das outras.
- Nenhum codigo legado e copiado sem adaptacao arquitetural.
- Nenhuma regra critica existe apenas no navegador.
- Cada modulo pode ser testado isoladamente.
- Cada modulo pode ser migrado e publicado separadamente.
- O codigo segue o padrao ja existente no frontend React.

## 28. Riscos

- Repetir monolito em React.
- Copiar dependencia de DOM do legado.
- Criar uma fonte paralela de permissao.
- Permitir que regra de e-mail vire criterio unico no React.
- Expor rotas sem protecao real.

## 29. Bloqueadores

- Falta de acordo sobre o contrato de autorizacao fina.
- Possivel necessidade de pequenos ajustes backend em areas especificas.
- Risco de divergencia entre o que o legado mostra e o que o backend realmente permite.

## 30. Estrategia de rollback

- Cada fase deve ter entrega isolada.
- Commit seletivo por unidade coerente.
- Se a fundacao falhar, reverter apenas a feature ADM sem tocar no resto do React.
- Nao misturar com outras frentes.

## 31. Estrategia de commits

- Commit 1: fundacao do modulo ADM React.
- Commit 2: primeiro modulo administrativo funcional.
- Commit 3+: modulos seguintes individualmente.

Nao criar um commit gigante com toda a migracao.

## 32. GitHub e AWS

- O contrato deve funcionar localmente e na AWS.
- A rota deve respeitar o base path do React.
- O item ADM deve continuar acessivel apos refresh.
- Publicacao deve ocorrer depois de validacao local.

## 33. Desativacao futura do legado

O painel ADM legado so deve ser desativado depois de paridade comprovada no React, com testes, validacao e aceite documental.

## 34. Confirmacao de ausencia de implementacao

Este contrato e apenas documental. Nenhum componente React, rota, endpoint, middleware, migracao ou ajuste funcional foi implementado nesta etapa.
