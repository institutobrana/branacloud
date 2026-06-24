# Frontend React - Modal Preferências com tamanho estático

## Objetivo da etapa

Fixar a geometria do modal Preferências para que ele mantenha largura, altura, rodapé e área de conteúdo estáveis ao alternar entre as abas `Geral`, `Ficha clínica`, `Orçamento` e `NFS-e`.

## Problema validado pelo usuário

O usuário informou que o modal ainda mudava de tamanho ao trocar entre as abas, o que não acontece no EasyDental.

## Causa técnica encontrada

A estrutura anterior ainda dependia parcialmente do conteúdo interno de cada aba para definir a geometria perceptível do modal. Isso fazia a altura útil e o encaixe visual variarem conforme a aba ativa.

## Arquivos lidos

- `docs/frontend_react_preferencias_redesenho_campo_a_campo.md`
- `docs/frontend_react_preferencias_usuario_contrato_funcional.md`
- `docs/frontend_react_preferencias_usuario_modal_visual.md`
- `docs/11_roadmap_desenvolvimento.md`
- `frontend-react/src/features/preferencias/PreferenciasUsuarioModal.jsx`
- `frontend-react/src/features/preferencias/preferenciasUsuario.css`

## Arquivos alterados

- `frontend-react/src/features/preferencias/PreferenciasUsuarioModal.jsx`
- `frontend-react/src/features/preferencias/preferenciasUsuario.css`
- `docs/11_roadmap_desenvolvimento.md`

## Como o modal passou a ter dimensão fixa

- O `Modal` recebeu largura controlada.
- O conteúdo externo passou a operar com altura fixa.
- O contêiner principal passou a usar `display: flex` em coluna.
- A janela externa ficou com altura estática.

## Como a área interna das abas foi fixada

- A área de conteúdo das abas recebeu altura fixa.
- O conteúdo das abas passou a ocupar um espaço interno estável.
- O overflow interno passou a ser tratado dentro da própria aba, sem crescer o modal.

## Como o rodapé foi travado na mesma posição

- O rodapé passou a permanecer no fim do bloco flex.
- O botão `Cancelar` e o botão `Gravar preferências` ficaram sempre no mesmo ponto visual.
- O rodapé não depende mais da altura do conteúdo ativo.

## Como as abas foram estabilizadas para não mudar tamanho

- As abas receberam largura mínima estável.
- As abas receberam altura fixa.
- O estado ativo não altera altura nem largura.
- O `box-sizing: border-box` foi aplicado para evitar variação por borda/padding.

## Confirmações funcionais

- Alternar abas não altera o tamanho do modal.
- Os campos das abas foram preservados.
- A aba NFS-e manteve os campos visuais do print.
- A aba NFS-e continua sem lógica fiscal ou API.
- `Gravar preferências` continua sem salvar e sem chamar API.
- `Cancelar` continua fechando o modal.
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

