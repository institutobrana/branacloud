# Contrato Funcional - Plano de Contas

## Objetivo

Registrar o contrato funcional confirmado para o frontend React do modulo `Plano de contas`.

Para a regra detalhada de exclusao e migracao, consultar [`docs/contrato_exclusao_migracao_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/contrato_exclusao_migracao_plano_de_contas.md).

## Estado atual do frontend

- A exclusão simples de categoria sem uso já está operacional no React.
- O caso `409` abre o modal de migração com destino elegível pré-selecionado.
- A seleção do destino e a reconciliação pós-sucesso seguem por ID, sem depender de índice.

## Escopo confirmado nesta etapa

- Rota: `/app/configuracoes/plano-de-contas`
- Tela com duas tabelas lado a lado: grupos e categorias
- Selecao de grupo controlando o painel de categorias
- Criacao de grupo
- Edicao de grupo
- Exclusao de grupo e categoria ainda fora do escopo desta etapa

## Dados confirmados

### Grupo

- `nome`
- `tipo`

### Categoria

- `nome`
- `tipo`
- `grupo_id`
- `tributavel`

## Acoes confirmadas

### `Novo grupo`

- Abre formulario de grupo.
- Exige `nome`.
- Exige `tipo`.
- Persiste via `POST /cadastros/grupos`.

### `Alterar`

- Nesta etapa, atua apenas sobre grupo.
- Reaproveita o mesmo formulario de inclusao.
- Persiste via `PUT /cadastros/grupos/{id}`.
- O alvo da alteracao deve ficar explicito no estado visual.

### `Nova categoria`

- Abre formulario de categoria.
- Exige `nome`.
- Exige `tipo`.
- Exige `grupo_id`.
- Exige `tributavel`.
- Persiste via `POST /cadastros/categorias`.

### `Alterar`

- Nesta etapa, atua sobre a categoria selecionada quando houver categoria ativa.
- Reaproveita o mesmo formulario de inclusao.
- Persiste via `PUT /cadastros/categorias/{id}`.
- O grupo da categoria pode ser alterado no proprio formulario.

## Comportamento apos salvar

- A lista e recarregada.
- A selecao do grupo novo ou editado e preservada quando possivel.
- O frontend nao e barreira de seguranca.

## Contrato tecnico confirmado

- POST envia apenas `{"nome": string, "tipo": string}`.
- PUT envia apenas `{"nome": string, "tipo": string}`.
- O `id` do PUT vem da selecao atual da linha.
- A resposta do POST retorna `id`, `nome`, `tipo` e `categorias: []`.
- A resposta do PUT retorna `{"detail": "Grupo atualizado."}`.
- `nome` vazio gera `400`.
- `tipo` e livre e e persistido como texto.
- Duplicidade de nome na mesma clinica gera `400`.
- O isolamento por clinica permanece no backend.

## Contrato tecnico de categoria confirmado

- POST envia apenas `{"nome": string, "tipo": string, "grupo_id": number, "tributavel": boolean}`.
- PUT envia apenas `{"nome": string, "tipo": string, "grupo_id": number, "tributavel": boolean}`.
- O `id` da categoria vai na URL do PUT.
- A resposta do POST retorna `id`, `nome`, `tipo`, `tributavel` e `grupo_id`.
- A resposta do PUT retorna `{"detail": "Categoria atualizada."}`.
- `nome` vazio gera `400`.
- `grupo_id` inexistente gera `404`.
- Duplicidade do nome dentro do mesmo grupo e mesma clínica gera `400`.
- `tributavel` é preservado como booleano.

## Validacao de persistencia

- A persistencia foi validada em teste backend isolado com SQLite em memoria.
- O teste comprova POST, GET, PUT e restauracao automatica por teardown.
- A base principal nao foi usada para registros descartaveis.

## Validacao de categoria

- A persistencia de categoria foi validada em teste backend isolado com SQLite em memoria.
- O teste comprova POST, PUT e isolamento por clínica e grupo.
- O frontend valida nome, tipo, grupo e tributavel antes do envio.

## Conclusao

O contrato funcional confirmado nesta fase e: menu existente, shell em `L`, duas tabelas lado a lado, selecao de grupo controlando categorias, criacao e edicao de grupo e categoria com persistencia confirmada em banco isolado e contrato real do backend atual.
