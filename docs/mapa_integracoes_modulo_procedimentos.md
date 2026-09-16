# Mapa de integracoes do modulo Procedimentos

## Integracoes confirmadas

- `GET /procedimentos/dashboard`
- `POST /procedimentos/dashboard-preview`
- O campo `Rendimento %` no painel financeiro do React consome `rendimento_proc` explicitamente.
- `GET /cenario`
- `GET /procedimentos/filtros`
- `GET /procedimentos`
- `GET /procedimentos/{id}`
- O `Valor Minimo` depende dos percentuais do modulo financeiro `Cenario`, lidos via `GET /cenario`, e do preview oficial do backend.

## Observacao tecnica

O preview financeiro passou a usar a mesma regra oficial do backend em `_calcular_financeiro_dashboard(proc, cenario, custo_material)`, sem calculo local no React.

## Materiais

O preview aceita materiais enviados pelo modal em memoria, resolve o custo com base no backend e nao persiste nada.

## Materiais herdados no React

O frontend React trata o marcador `herdado` apenas como estado transitório antes do save. Depois da materialização e reabertura, os itens passam a ser tratados como vínculos comuns do procedimento, sem badge permanente e sem bloqueio permanente por origem.
## Microetapa complementar validada

Na validacao real do procedimento `66929 / TESTE HERANCA MATERIAL`:

- o DELETE de `00130` no vinculo proprio foi confirmado via navegador real;
- o GET posterior voltou a expor `00130` como material herdado do generico `82`;
- a quantidade reaparecida foi `20`;
- nao houve duplicidade de linha;
- o painel financeiro permaneceu consistente com a recomposicao;
- o genérico permaneceu intacto.
