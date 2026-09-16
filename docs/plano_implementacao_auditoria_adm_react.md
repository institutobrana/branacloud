# Plano de Implementação - ADM -> Auditoria React

## Etapa 0 - auditoria histórica e técnica

Concluir leitura do legado, Git, backend e banco. Esta etapa já foi iniciada e mostrou que o painel atual continua read-only e com cinco colunas.

## Etapa 1 - contrato de endpoint

Confirmar se o endpoint atual basta para a Fase 1 ou se detalhes adicionais serão necessários depois.

## Etapa 2 - rota, menu e shell

Conectar a tela React a `/app/adm/auditoria` com menu e guard já existentes.

## Etapa 3 - listagem read-only

Montar a tabela com:

- `ID`
- `Data`
- `Ação`
- `Autor`
- `Alvo`

## Etapa 4 - filtros e paginação

Adicionar filtros locais por coluna e avaliar paginação conforme volume.

## Etapa 5 - Exportar CSV

Implementar exportação somente leitura a partir dos dados já carregados.

## Etapa 6 - Ver detalhes

Implementar modal somente leitura apenas se a segurança do `detalhes_json` estiver clara e filtrada.

## Etapa 7 - Ver alvo, se viável

Avaliar navegação por `alvo_tipo` e `alvo_id` apenas se houver contrato confiável.

## Etapa 8 - testes e encerramento

Cobrir:

- rota;
- tabela;
- filtro;
- exportação;
- detalhe;
- proteção de campos proibidos.

## Etapa 9 - melhorias de backend/banco

Somente se a auditoria mostrar necessidade real:

- paginação server-side;
- `request_id`;
- `user_agent`;
- `before/after`;
- índices adicionais.

## Etapa 10 - AWS em momento separado

Qualquer entrega em AWS deve ser tratada em rodada separada, com contrato próprio.

## Prioridade recomendada

1. manter a auditoria read-only;
2. evitar mutações;
3. evitar exclusão;
4. evitar limpeza de logs;
5. preservar o legado enquanto a Fase 1 é fechada.
