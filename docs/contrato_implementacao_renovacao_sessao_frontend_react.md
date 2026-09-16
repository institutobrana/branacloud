# Contrato de Implementacao - Renovacao de Sessao no Frontend React

## 1. Contexto

Este contrato documenta a frente de renovacao de sessao do Brana Cloude no frontend React. O objetivo e preparar a renovacao preventiva da autenticacao sem transformar o sistema em sessao server-side, sem refresh token e sem alterar o frontend legado nesta etapa.

O backend desta frente ja existe e foi implementado em:

- `backend/routes/auth_routes.py`
- `backend/security/dependencies.py`
- `backend/tests/test_auth_renew.py`

O endpoint confirmado e:

- `POST /auth/renew`

Este documento registra o que foi efetivamente comprovado no codigo atual e o que deve ser feito futuramente no React.

## 2. Documentos-base

Documentos lidos e usados como base:

- `docs/auditoria_sessao_autenticacao_renovacao_frontend_react.md`
- `docs/auditoria_fina_auth_me_grant_sessao.md`
- `docs/frontend_react_contrato_autenticacao.md`
- `docs/06_seguranca.md`
- `docs/00_master_guide.md`
- `docs/02_arquitetura.md`
- `docs/03_mapa_codigo.md`
- `docs/10_continuidade.md`

## 3. Estado Atual Confirmado

### 3.1 Diretorio e branch

- Diretorio real usado: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Remote: `origin https://github.com/institutobrana/branacloud.git`

### 3.2 Status inicial

O worktree ja estava sujo antes desta etapa, com alteracoes preexistentes em outras frentes. Esta etapa nao alterou nenhum arquivo alem deste contrato novo.

### 3.3 Caminho correto do repositorio

Os caminhos do projeto pertencem ao diretorio de `D:`. Nao foi identificada copia ativa em `C:\BRANA ARQUIVOS\BRANA CLOUD`.

### 3.4 Documento ausente confirmado

O arquivo agora criado nao existia antes desta etapa:

- `docs/contrato_implementacao_renovacao_sessao_frontend_react.md`

## 4. Backend Ja Implementado

O backend atualmente possui:

### Endpoint

- `POST /auth/renew`

### Autenticacao

- Bearer JWT obrigatorio
- validacao por `get_current_user()`
- token ausente, malformado, adulterado ou expirado nao e renovado

### Resposta de sucesso

```json
{
  "access_token": "<novo-jwt>",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### Validade

- 60 minutos
- `expires_in = 3600`
- algoritmo atual `HS256`
- mesmo mecanismo e segredo atuais do projeto

### Claims emitidos

- `user_id`
- `clinica_id`
- `is_admin`
- `exp`

Os valores sao reconstruidos a partir do contexto autenticado e do banco, e nao copiados cegamente de claims arbitrarios do token anterior.

### Estado atual consultado

- usuario recarregado do banco
- clinica validada no banco
- usuario e clinica precisam continuar validos conforme as regras atuais
- `is_admin` vem do estado atual do usuario
- token renovado e aceito por `/me`

### Campo `online`

O campo `online` representa estado operacional/presenca. Ele:

- nao e sessao server-side
- nao revoga JWT globalmente
- fechar o navegador nao atualiza automaticamente esse campo
- expirar JWT nao atualiza esse campo
- a renovacao nao depende de `online`
- logout continua alterando `online`, mas nao invalida criptograficamente tokens ja emitidos

### Setup

`/auth/renew` esta em `SETUP_ALLOWED_PATHS`. Isso:

- nao torna a rota publica
- nao remove a exigencia de JWT valido
- apenas impede que `setup_completed = false` bloqueie uma renovacao autenticada
- token ausente durante setup continua retornando `401`

## 5. Objetivo Funcional

O frontend React devera futuramente:

1. realizar login normalmente;
2. validar a sessao com `/me` no bootstrap;
3. iniciar renovacao somente depois da autenticacao ser confirmada;
4. solicitar renovacao preventiva enquanto a aplicacao estiver aberta;
5. permanecer autenticado durante uma jornada continua de trabalho;
6. renovar mesmo que o usuario permaneça parado na mesma tela;
7. parar naturalmente de renovar quando a aba, navegador ou computador forem encerrados;
8. permitir restauracao se o token ainda estiver valido ao reabrir;
9. exigir novo login se o token ja tiver expirado;
10. cancelar toda renovacao no logout;
11. nunca usar token eterno;
12. nunca renovar token ja expirado.

## 6. Nao Objetivos

Esta frente nao deve:

- criar refresh token
- criar sessao server-side
- criar migration
- alterar backend nesta etapa
- alterar frontend legado nesta etapa
- implementar renovacao global por interceptacao de todo `401`
- reenviar automaticamente `POST`, `PUT`, `PATCH` ou `DELETE`
- transformar `online` em mecanismo de revogacao criptografica

## 7. Arquitetura da Solucao

### 7.1 Visao geral

A estrategia definida e renovacao preventiva por timer, com apoio de eventos de visibilidade e sincronizacao entre abas.

### 7.2 Responsabilidades por camada

#### `authApi.js`

Responsavel por:

- chamar `POST /auth/renew`
- devolver contrato normalizado
- nao controlar timer
- nao controlar estado React

#### `authStorage.js`

Responsavel por:

- ler token
- gravar token
- remover token
- expor a chave usada pelo evento `storage`
- nao executar chamadas HTTP
- nao controlar timer

#### Novo modulo de renovacao

O contrato recomenda um modulo especifico, por exemplo:

- `authRenewalController.js`
- `authSessionRenewal.js`
- `useAuthRenewal.js`

Esse modulo deve concentrar:

- timer
- trava de chamada em andamento
- tentativas transitrias
- tratamento de foco/visibilidade
- invalidacao por geracao
- inicio e parada da renovacao

#### `AuthProvider.jsx`

Deve:

- fornecer estado autenticado
- iniciar o controlador depois de `/me`
- receber eventos de renovacao bem-sucedida
- encerrar o controlador no logout
- reagir a falha definitiva
- manter integracao minima

#### `api.js`

Nao deve receber refresh global de `401`.

#### `App.jsx`

Nao deve ser alterado sem necessidade comprovada.

## 8. Contrato do Endpoint

### Requisito central

`POST /auth/renew` deve renovar o token apenas quando o usuario ja estiver autenticado e o JWT ainda for valido.

### Regra de autenticacao

- token ausente: `401`
- token malformado: `401`
- token adulterado: `401`
- token expirado: `401`
- usuario inexistente: `401`
- usuario ou clinica invalidos/inativos: `403`, conforme a regra atual do backend

### Claims preservadas

A renovacao deve manter:

- `user_id`
- `clinica_id`
- `is_admin`
- `exp`

### Regras de seguranca

- nao aceitar claims enviados pelo cliente
- nao trocar usuario
- nao trocar clinica
- nao elevar `is_admin`
- nao copiar claims desconhecidos indiscriminadamente

## 9. Fluxo de Login

1. login devolve token;
2. token e salvo;
3. `/me` confirma a autenticacao;
4. o controlador de renovacao inicia;
5. a primeira renovacao e programada.

## 10. Fluxo de Renovacao

### 10.1 Renovacao bem-sucedida

1. o controlador confirma sessao ativa;
2. chama `/auth/renew`;
3. recebe novo token;
4. verifica se a geracao da sessao continua valida;
5. salva novo token;
6. mantem usuario autenticado;
7. reinicia o prazo de 15 minutos;
8. outras abas recebem evento de `storage`.

### 10.2 Renovacao falha definitiva

Tratada como perda de sessao:

- `401` no endpoint de renovacao
- token expirado
- token adulterado
- usuario inexistente
- autenticacao rejeitada

O tratamento deve:

- interromper timer
- impedir novas renovacoes
- limpar token
- limpar estado autenticado
- redirecionar controladamente para login
- impedir loops

### 10.3 Renovacao falha transitria

Nao deve encerrar a sessao imediatamente em:

- erro de rede
- timeout
- backend temporariamente indisponivel
- resposta `500`

O contrato preve:

- tentativas limitadas
- backoff curto
- nenhuma repeticao infinita
- nenhuma tentativa depois do vencimento real do token
- encerramento natural se nao houver tempo para renovar antes do vencimento

## 11. Fluxo de Logout

1. marcar geracao local como encerrada;
2. interromper timer;
3. remover listeners;
4. invalidar resposta pendente;
5. chamar logout atual;
6. remover token;
7. limpar estado;
8. impedir que resposta antiga restaure o token.

## 12. Bootstrap

O controlador de renovacao so pode iniciar quando:

- existir token armazenado
- `/me` tiver confirmado a autenticacao
- o usuario estiver em estado autenticado no `AuthProvider`

Se o token nao existir, o controlador nao inicia.

## 13. Validade e Intervalo

### Intervalo principal

- renovacao preventiva a cada 15 minutos
- JWT valido por 60 minutos
- o intervalo deve ser reiniciado apos renovacao bem-sucedida
- nao usar intervalo reduzido fixo no codigo de producao

### Regra de validade

- nunca renovar token ja expirado
- se o token ja expirou, a sessao deve encerrar

## 14. Tratamento de Falhas

### Falhas definitivas

- `401` na renovacao
- token expirado
- token adulterado
- usuario inexistente
- autenticacao rejeitada

### Falhas transitrias

- rede
- timeout
- indisponibilidade temporaria
- `500`

### Regras de encerramento

Encerrar renovacao quando:

- o usuario fizer logout
- a autenticacao for rejeitada definitivamente
- o provider for desmontado
- nao houver mais token
- a sessao local for encerrada por outra aba

## 15. Retomada e Segundo Plano

### Aba em segundo plano

O contrato recomenda nao confiar exclusivamente em `setInterval`.

Prever:

- listener unico de `visibilitychange`
- listener unico de `focus`, se necessario
- ao retornar ao primeiro plano, verificar necessidade de renovar ou revalidar
- se o token ja expirou, nao tentar `/auth/renew`
- evitar listeners duplicados
- limpar listeners no logout e no unmount

### Reabertura antes do vencimento

1. token ainda existe no `localStorage`;
2. `/me` valida;
3. sessao e restaurada;
4. controlador inicia novamente.

### Reabertura depois do vencimento

1. `/me` rejeita;
2. token e removido;
3. controlador nao inicia;
4. usuario e direcionado ao login.

### Retorno apos suspensao

- se o token estiver valido, renovar ou revalidar;
- se estiver expirado, nao renovar;
- exigir novo login;
- nao criar loop de chamadas.

## 16. Multiplas Abas

### Primeira versao

- usar o evento `storage`
- nao usar `BroadcastChannel`
- reconhecer atualizacao do token por outra aba
- reconhecer logout por outra aba
- evitar que token antigo sobrescreva token mais novo
- aceitar que duas abas possam iniciar chamadas proximas, mas proteger cada aba contra chamadas simultaneas internas
- documentar que nao existe trava distribuida perfeita entre abas nesta primeira versao

### Concorrencia por aba

Prever:

- somente uma renovacao em andamento
- promise compartilhada, mutex simples ou controle equivalente
- `requestId`, sequencia ou geracao de sessao
- resposta iniciada antes do logout nao pode restaurar autenticacao
- resposta antiga nao pode sobrescrever estado mais novo
- evitar atualizacao de estado depois do unmount

## 17. Concorrencia

O contrato exige controle local de concorrencia para impedir:

- multiplas renovacoes simultaneas na mesma aba
- sobrescrita de token novo por resposta antiga
- restauracao de sessao apos logout local

## 18. Seguranca

### Principios preservados

- segredo nao fica hardcoded
- JWT continua com algoritmo atual
- backend continua sendo a fonte de verdade de autenticacao
- frontend nao e barreira de seguranca

### Limites conhecidos

- nao existe refresh token
- nao existe revogacao global
- logout nao invalida criptograficamente o JWT ja emitido
- `localStorage` continua exposto a riscos de XSS
- abas compartilham o mesmo token

## 19. Modularizacao

### Responsabilidades pequenas

O documento recomenda separar o fluxo em componentes pequenos, com o controlador de renovacao isolado do provider.

### Regra pratica

Nao concentrar timer, listeners, chamadas HTTP e estado React em um unico arquivo grande.

## 20. Arquivos Previstas

Arquivos de referencia para a frente futura:

- `frontend-react/src/features/auth/AuthProvider.jsx`
- `frontend-react/src/features/auth/authApi.js`
- `frontend-react/src/features/auth/authStorage.js`
- `frontend-react/src/services/api.js`
- `frontend-react/src/app/App.jsx`

Arquivos novos provaveis:

- `frontend-react/src/features/auth/authRenewalController.js`
- `frontend-react/src/features/auth/authSessionRenewal.js`
- `frontend-react/src/features/auth/useAuthRenewal.js`

## 21. Etapas Futuras

### Etapa React 1

- implementar `renewAuthToken()` em `authApi.js`
- ajustar armazenamento somente se necessario
- criar controlador modular de renovacao
- testes unitarios isolados

### Etapa React 2

- integracao minima no `AuthProvider`
- inicio apos `/me`
- parada no logout
- falhas definitivas e transitrias

### Etapa React 3

- `visibilitychange`
- `focus`
- evento `storage`
- multiplas abas
- protecao contra resposta obsoleta

### Etapa de validacao

- navegador real
- mais de 60 minutos com valores locais reduzidos
- mesma tela sem interacao
- aba em segundo plano
- suspensao
- duas abas
- logout durante renovacao
- falha de rede
- backend indisponivel
- token expirado
- token adulterado
- reabertura antes e depois do vencimento

## 22. Critrios de Aceite

O contrato considera aceite quando houver:

- login funcional
- `/me` funcional
- logout funcional
- renovacao por mais de 60 minutos
- usuario parado na mesma tela ainda autenticado
- aba em segundo plano sem perda indevida
- navegador fechado interrompendo renovacao
- navegador reaberto restaurando apenas se o token ainda estiver valido
- computador suspenso sem token eterno
- duas abas sem loop
- falhas de rede sem logout imediato
- resposta pendente apos logout sem restaurar autenticacao
- ausencia de loop
- ausencia de token eterno
- ausencia de migration
- ausencia de alteracao no legado
- build React valido
- testes backend e frontend
- validacao real no navegador

## 23. Estrategia de Testes

O contrato preve validacao futura em:

- login
- `/me`
- logout
- renovacao
- token expirado
- token adulterado
- aba em segundo plano
- duas abas
- falha de rede
- backend indisponivel
- retomada antes e depois do vencimento

## 24. Rollback

Rollback previsto:

- remover ou desativar a integracao do controlador no provider
- manter login, `/me` e logout atuais
- parar de chamar `/auth/renew`
- endpoint pode permanecer sem uso ou ser removido depois
- nenhuma migration precisa ser revertida
- frontend legado nao e afetado
- nenhuma alteracao de banco e necessaria

## 25. Limitacoes

- nao existe refresh token
- nao existe revogacao global
- logout nao invalida JWT ja emitido no backend
- `localStorage` continua exposto a riscos de XSS
- abas compartilham o mesmo token
- suspensao superior a validade pode exigir novo login
- a solucao nao equivale a sessao server-side revogavel
- usuario desativado ou clinica inativa serao detectados na proxima renovacao ou chamada protegida
- frontend legado continuara expirando apos 60 minutos, pois nao sera alterado nesta primeira frente

## 26. Riscos Remanescentes

- chamadas simultaneas em duas abas
- resposta antiga sobrescrevendo token novo se o controle de geracao for incompleto
- loops de renovacao se falhas transitorias nao forem limitadas
- perda de sessao por suspensao longa
- inconsistencias de armazenamento entre abas

## 27. Decisoes Fechadas

- usar renovacao preventiva
- intervalo principal de 15 minutos
- JWT com 60 minutos
- nao usar refresh token
- nao usar sessao server-side
- nao usar interceptacao global de `401`
- nao reenviar automaticamente verbos de escrita
- usar `storage` na primeira versao para multiplas abas
- nao usar `BroadcastChannel`
- nao depender exclusivamente de `setInterval`
- manter o controlador separado do `AuthProvider`
- manter `api.js` sem refresh global
- nao alterar `App.jsx` sem necessidade comprovada

## 28. Pontos Ainda Pendentes de Validacao

- integracao real no React
- comportamento em navegador com aba em segundo plano
- comportamento apos suspensao do sistema
- sincronizacao entre multiplas abas
- controle de resposta obsoleta em cenarios concorrentes
- validacao visual da experiencia apos mais de 60 minutos
- verificacao de uso correto de listeners e limpeza no logout/unmount

## 29. Confirmacao Final

Este contrato documenta a frente de renovacao de sessao do React com base no codigo atualmente confirmado. Nenhum backend, frontend, banco, migration, teste ou configuracao foi alterado nesta etapa.
