# Ficha Pessoal - Historico - Etapa 8 - ENTER salva e abre nova linha

## Objetivo
Fazer o atalho `ENTER` na aba Historico usar o mesmo fluxo persistente do botao `Grava`, sem criar caminho novo de backend e sem afetar outras abas da Ficha Pessoal.

## Ajuste aplicado
- O `ENTER` continua confirmando a linha localmente.
- Antes de criar a nova linha vazia, o fluxo chama o mesmo salvamento da ficha usado pelo botao `Grava`.
- A nova linha so e criada depois de retorno de sucesso do salvamento.
- Se a gravacao falhar, a linha atual nao avanca para uma nova entrada como se o dado tivesse sido persistido.

## Arquivos alterados
- `frontend/js/modules/ficha-pessoal-aba-historico.js`
- `frontend/app.js`

## Decisao tecnica
- O metodo `fichaSalvarPaciente()` passou a retornar sucesso ou falha explicitamente.
- O handler de `ENTER` no Historico passou a aguardar esse retorno antes de abrir a nova linha.
- Nao houve alteracao em backend, schema, endpoint ou serializacao do envelope `extra.historico_aba`.

## Riscos observados
- Se o backend rejeitar a gravacao, a linha fica confirmada no DOM local, mas nao persistida, o que e coerente com o comportamento atual do botao `Grava` em caso de erro.
- O fluxo depende do mesmo salvamento central da ficha, o que e bom para consistencia, mas exige cuidado para nao introduzir novos controles paralelos no Historico.

## Como validar
1. Abrir um paciente com a aba Historico.
2. Preencher uma linha valida.
3. Pressionar `ENTER`.
4. Confirmar que a linha anterior foi salva sem precisar clicar em `Grava`.
5. Fechar e reabrir a ficha do mesmo paciente.
6. Confirmar que a linha permanece gravada.
7. Repetir com erro de validacao para confirmar que a nova linha nao e criada de forma indevida.

## Proxima subetapa recomendada
Proxima etapa sugerida: propriedades de linha com foco em refinamentos visuais e validacao contextual.
