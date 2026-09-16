# Implementacao de Nova conta em ADM Clinicas

Data: 2026-07-21

## Escopo

Esta etapa implementa a acao `ADM -> Clinicas -> Nova conta` no frontend React e no backend FastAPI.

## Contrato implementado

- Endpoint: `POST /superadmin/clinicas/nova-conta`.
- Acesso produtivo: somente Owner real via `is_owner_email(current_user.email)`.
- Payload aceito:
  - `nome_clinica`
  - `admin_nome`
  - `admin_email`
  - `admin_senha`
  - `admin_confirma_senha`
- Campos extras sao recusados pelo schema.
- O frontend envia somente estes cinco campos.

## Provisionamento

O backend passou a expor `provisionar_conta_saas`, reutilizando o fluxo de nascimento de conta do signup publico, mas permitindo separar:

- nome da clinica;
- nome do administrador inicial.

O wrapper `criar_conta_saas(db, nome, email, senha)` foi preservado e continua passando o mesmo nome para clinica e administrador, mantendo o comportamento do cadastro publico.

## Estado da conta criada

- Clinica ativa.
- Plano `DEMO 7 dias`.
- Validade inicial de 7 dias.
- Usuario sistemico protegido criado com codigo 255.
- Administrador inicial criado com codigo 1.
- `setup_completed=False` para o administrador inicial.
- Unidade principal `0001` / `Principal`.
- Prestadores, perfis, seeds e storage seguem o mesmo provisionamento do signup.

## Seguranca e sessao

- A acao nao cria token.
- A acao nao faz login automatico do administrador criado.
- A sessao Owner permanece intacta.
- O backend registra auditoria `clinica_nova_conta_create`.
- Em falha antes do sucesso, a transacao e revertida e o diretorio de storage da nova clinica e removido com validacao de caminho.

## Frontend

- O botao da toolbar passa a ser `Nova conta`.
- `Novo usuario` foi removido da toolbar de `ADM -> Clinicas`.
- O modal e controlado por estado React, sem `Modal.confirm`, `window.confirm`, `alert` ou `prompt`.
- Apos sucesso, a tabela e recarregada e a nova clinica e selecionada pelo `clinica_id` retornado.
- A exibicao do botao e condicionada a `user.is_master`; a protecao real permanece no backend.

## Itens preservados

- Acoes `+Teste`, `Suspender`, `Demo`, `Mensal`, `Anual`, `Super Admin` e `Excluir`.
- Busca textual de clinicas.
- Filtros antigos removidos continuam removidos.
- `ADM -> Usuarios` nao foi iniciado nesta etapa.
- Fluxo de primeiro acesso React permanece como caminho esperado para o administrador inicial concluir `setup_completed`.
