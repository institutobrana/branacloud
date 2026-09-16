# Microetapa D - POST basico do simbolo grafico

Data: 2026-08-03

## Escopo executado
- Reintroduzido o `POST` basico para `Configurações -> Símbolos gráficos -> Novo`.
- Mantido o payload minimo e permitido:
  - `descricao`
  - `codigo`
  - `especialidade`
  - `tipo_simbolo`
  - `tipo_marca`
- Mantido o fluxo simples de submissao com:
  - estado `submitting`
  - protecao contra duplo clique
  - exibicao de erro acessivel
  - mensagem de sucesso
  - fechamento do modal apos sucesso
  - reset do estado local e do hook
  - reload da tabela por callback existente

## O que nao entrou
- editor de desenho
- `imagem_custom`
- `bitmap2` / `bitmap3`
- sobreposicao
- upload
- exclusao funcional
- alteracao
- migration
- novo hook complexo de formulario

## Contrato confirmado
- Endpoint: `POST /cadastros/simbolos-graficos`
- O frontend nao envia `clinica_id` nem tenant manual.
- O modal permanece aberto em caso de erro.
- O `Ok` muda para `Salvando...` durante a requisicao.
- O `Cancela` e o X superior ficam bloqueados durante o envio para evitar estado inconsistente.

## Testes executados
- Cobertura do mapper de payload minimo.
- Cobertura do `POST` na API de simbolos graficos.
- Cobertura textual/estrutural do modal de criacao.

## Observacao
- Esta microetapa reaproxima o fluxo do comportamento historico simples, sem reativar os elementos editoriais ou de desenho avancado.

## Homologacao runtime
- A frente foi retomada com a sessao autenticada preservada.
- O contrato de leitura foi consolidado em `scope=biblioteca`.
- A grade inicial passou a ser entendida como biblioteca ativa da clinica, e nao como apenas o catalogo oficial.
- O fluxo Novo ficou pronto para validacao final de POST, reload, F5 e banco sem alterar a estrategia de leitura.
- A composicao de 143 registros foi confirmada como esperada nesta base.
- A confirmacao de ponta a ponta foi detalhada na documentacao posterior de D.5.
