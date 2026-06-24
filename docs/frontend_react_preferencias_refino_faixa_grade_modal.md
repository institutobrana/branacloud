# Frontend React - Refino da faixa inferior e grade do modal Preferências

## Objetivo da etapa

Aproximar o modal Preferências da janela desktop do EasyDental com faixa inferior fixa cinza, grade clássica na aba Geral, avatar encaixado e tabs menos arredondadas, preservando o tamanho fixo já estabilizado.

## Problema validado pelo usuário

O usuário informou que o modal ainda diferia da referência em pontos estruturais e visuais: faixa inferior fixa ausente, selects curtos demais, labels e campos sem grade clássica, avatar mal encaixado e abas arredondadas demais.

## Arquivos lidos

- `docs/frontend_react_preferencias_redesenho_campo_a_campo.md`
- `docs/frontend_react_preferencias_usuario_contrato_funcional.md`
- `docs/frontend_react_preferencias_usuario_modal_visual.md`
- `docs/frontend_react_preferencias_modal_tamanho_estatico.md`
- `docs/frontend_react_preferencias_aba_geral_refino_easydental.md`
- `docs/11_roadmap_desenvolvimento.md`
- `frontend-react/src/features/preferencias/PreferenciasUsuarioModal.jsx`
- `frontend-react/src/features/preferencias/preferenciasUsuario.css`

## Arquivos alterados

- `frontend-react/src/features/preferencias/PreferenciasUsuarioModal.jsx`
- `frontend-react/src/features/preferencias/preferenciasUsuario.css`
- `docs/11_roadmap_desenvolvimento.md`

## Como a faixa inferior fixa cinza foi criada

- Foi criado um rodapé interno fixo com fundo cinza claro.
- O rodapé ficou dentro da janela do modal, separado da área de conteúdo.
- A faixa permanece na mesma posição em todas as abas.

## Como os botões foram posicionados no rodapé fixo

- `Cancelar` e `Gravar preferências` ficaram alinhados à direita.
- Os botões permaneceram dentro da faixa inferior cinza.
- O comportamento dos botões foi preservado.

## Como os selects da aba Geral foram ampliados

- Os selects da aba Geral passaram a usar largura cheia dentro da coluna de formulário.
- Os campos ficaram mais próximos da largura da área de `Apresentação`.
- O bloco visual passou a lembrar melhor a composição clássica da referência.

## Como labels e campos foram alinhados em grade clássica

- Labels receberam largura de coluna fixa.
- Os campos passaram a iniciar sempre na mesma coluna.
- A aba Geral ficou com uma leitura de formulário desktop mais tradicional.

## Como a foto/avatar foi corrigida para não cortar

- A foto/avatar passou a ficar dentro de uma moldura fixa à direita.
- A barra inferior cinza foi presa ao mesmo bloco.
- O conjunto ficou mais encaixado e sem corte lateral.

## Como o arredondamento das abas foi reduzido

- As tabs passaram a usar cantos mais retos.
- A aba ativa ficou com aparência de aba de janela desktop.
- A variação visual entre ativa e inativa foi reduzida.

## Como foi preservado o tamanho fixo do modal entre abas

- O modal permaneceu com altura fixa.
- A área de conteúdo continua rolando internamente quando necessário.
- O rodapé não muda de lugar ao alternar as abas.

## Confirmações

- Os campos das abas foram preservados.
- A aba NFS-e manteve os campos visuais do print.
- A aba NFS-e continua sem lógica fiscal/API.
- `Gravar preferências` não salva e não chama API.
- `Cancelar` fecha o modal.
- Nenhuma API nova foi criada ou consumida.
- Nenhuma API de escrita foi usada.
- O backend não foi alterado.
- O frontend legado não foi alterado.
- O banco e migrations não foram alterados.
- O Dashboard foi preservado.
- `Cadastro -> Pacientes` foi preservado.
- Login/logout foram preservados.

## Resultado do build

- `cd frontend-react`
- `npm.cmd run build`
- Build concluído com sucesso.

