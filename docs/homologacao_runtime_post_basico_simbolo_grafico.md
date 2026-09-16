# Homologacao runtime do POST basico de simbolos graficos

Data: 2026-08-03

## Resultado
- Auditoria de runtime e composicao da grade fechada.
- A homologacao D nao foi concluida como contrato visual final.
- A integracao de POST foi desativada do fluxo ativo do modal no rollback ao marco C.
- `scope=biblioteca` nao ficou aprovado como contrato visual final do usuario.
- A nova retomada passa a depender de contrato fechado da grade.

## Ambiente
- frontend: `http://192.168.3.41:5173/app/`
- backend: ambiente local/homologacao do projeto
- sessao: autenticada
- banco: consultado diretamente para medir a composicao da grade

## Modal
- Especialidade: DentÃ­stica
- selecao: `sim_simb1`
- preview: visivel
- Ok: habilitado antes do envio
- X: desabilitado
- Editar: desabilitado

## Payload
- descricao: `TESTE SIMBOLO REACT MICROETAPA D1 2026-08-02 00:00`
- codigo: `sim_simb1.bmp`
- especialidade: tecnico da especialidade selecionada
- tipo_simbolo: `2`
- tipo_marca: `2`
- campos omitidos: `imagem_custom`, `imagemCustom`, `icone`, `bitmap1`, `bitmap2`, `bitmap3`, `imagem_url`, `sobreposicao`, `clinica_id`, `tenantId`, `userId`, `legacy_id`

## POST
- endpoint esperado: `POST /cadastros/simbolos-graficos`
- status: validado indiretamente pela persistencia observada na base e pela recarga da grade
- duplo envio: nao observado visualmente

## Banco
- tabela: `simbolo_grafico_catalogo`
- clinica observada: `clinica_id = 1`
- total de ativos na grade: `143`
- com `legacy_id`: `81`
- sem `legacy_id`: `62`
- duplicidade ativa no recorte medido: `0`
- composicao dos 62: `59` biblioteca-base/seed, `2` testes ativos, `1` copia/seed de simbolo oficial

## Reload e tabela
- reload: realizado
- registro novo: permaneceu na grade observada
- composicao: catalogo oficial + biblioteca local da clinica
- contrato observado: `scope=biblioteca`

## Reset
- reabertura: nao reexecutada nesta rodada apos o fechamento
- Nome: nao revalidado
- Especialidade: nao revalidada
- Forma: nao revalidada
- selecao: nao revalidada
- preview: nao revalidado
- Ok: nao revalidado

## Erro e retry
- modal: fechou apos o envio
- estado: sem erro visivel no modal
- mensagem: sem erro visivel
- reload: confirmou persistencia
- retry: nao necessario nesta rodada

## Console e Network
- erros: nao relevantes para a auditoria funcional
- warnings: os warnings de `antd` continuam preexistentes
- GETs: nao detalhados por DevTools, mas a grade foi confirmada via leitura da base e runtime
- POSTs: nao reinspecionados em profundidade nesta rodada
- outras mutacoes: nao observadas

## Testes
- total: 4 suites validando API, modal, mapeamento e roteamento
- aprovados: 4
- falhas: 0

## Build
- resultado: executado e aprovado
- warnings: apenas aviso de chunk acima de 500 kB
- erros: nenhum

## Registro de teste
- nome: TESTE SIMBOLO REACT MICROETAPA D1 2026-08-02 00:00
- id: nao confirmado na tela
- permanece: confirmado na grade observada e na consulta de banco
- remocao futura: usar fluxo oficial `Elimina`

## Git
- HEAD: `0abb0f94ae94a5e60026f253d5e82187183aa22c`
- Branch: `modularizacao-segura-fase-1`
- Stage inicial: sem alteracoes de git executadas nesta rodada
- Stage final: sem alteracoes de git executadas nesta rodada
- Commit: nao realizado
- Push: nao realizado

## Proxima etapa
- Encerrar a frente de auditoria de `scope=biblioteca` e seguir somente se surgir novo sintoma funcional ou de seguranca.
