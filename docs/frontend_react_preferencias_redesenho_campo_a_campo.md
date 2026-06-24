# Frontend React - Redesenho campo a campo do modal Preferências

## Objetivo da etapa

Redesenhar o modal Preferências de forma mais fiel aos prints do EasyDental, deixando-o mais parecido com uma janela desktop operacional e corrigindo especialmente a aba NFS-e com campos visuais reais.

## Validação do usuário

O usuário validou os prints e informou que o modal ainda estava muito diferente, principalmente na aba NFS-e.

## Arquivos lidos

- `docs/frontend_react_preferencias_usuario_contrato_funcional.md`
- `docs/frontend_react_preferencias_usuario_modal_visual.md`
- `docs/frontend_react_preferencias_refino_visual_modal.md`
- `docs/frontend_react_preferencias_refino_estilo_desktop.md`
- `docs/frontend_react_preferencias_refino_mais_desktop.md`
- `docs/11_roadmap_desenvolvimento.md`
- `frontend-react/src/features/preferencias/PreferenciasUsuarioModal.jsx`
- `frontend-react/src/features/preferencias/preferenciasUsuario.css`

## Arquivos alterados

- `frontend-react/src/features/preferencias/PreferenciasUsuarioModal.jsx`
- `frontend-react/src/features/preferencias/preferenciasUsuario.css`
- `docs/11_roadmap_desenvolvimento.md`

## Como o título foi centralizado

- O título do modal foi centralizado no cabeçalho.
- A cor turquesa foi mantida.
- O cabeçalho ganhou aparência mais próxima de janela clássica.

## Como a aba Geral foi redesenhada campo a campo

- Nome, CPF e CRO/UF passaram a ser texto visual, não inputs.
- A foto/avatar foi colocada à direita.
- A apresentação passou a usar linha própria com label à esquerda e campo à direita.
- Envio padrão, conta bancária, estoque e módulo de abertura passaram a seguir estrutura clássica de label e campo.

## Como Nome/CPF/CRO-UF foram tratados como texto visual

- Os dados foram exibidos como linhas informativas no topo da aba.
- Os valores ficaram ao lado dos rótulos.
- Essa composição ficou mais próxima do print do EasyDental.

## Como a foto/avatar foi posicionada à direita

- A foto foi movida para uma caixa vertical à direita.
- A caixa usa avatar, barra inferior discreta e botões visuais de câmera/upload.

## Como a aba Ficha clínica foi redesenhada

- A linha superior passou a ter label, select e ação Incluir na mesma faixa.
- A lista grande foi centralizada e formatada como listbox clássica.
- Os checkboxes ficaram abaixo com o rótulo `Ficha clínica:`.

## Como a aba Orçamento foi redesenhada

- O conteúdo foi reorganizado em linhas verticais com labels à esquerda e campos à direita.
- A assinatura de orçamento passou a ficar antes dos checkboxes.
- O espaço vazio foi reduzido.

## Como a aba NFS-e foi implementada visualmente

- A aba ganhou campos visuais reais conforme o print.
- Foram incluídos:
  - Código de cancelamento
  - Motivo de cancelamento
  - Valor alíquota ISS
  - Valor de dedução
  - Percentual sobre o valor bruto

## Confirmações sobre NFS-e

- NFS-e continua sem lógica fiscal.
- NFS-e continua sem API.
- NFS-e continua sem persistência.
- Nenhum campo novo inventado foi adicionado fora do print.

## Confirmações gerais

- `Gravar preferências` não salva e não chama API.
- `Cancelar` fecha o modal.
- Nenhuma API nova foi criada ou consumida.
- Nenhuma API de escrita foi usada.
- Backend não foi alterado.
- Frontend legado não foi alterado.
- Banco e migrations não foram alterados.
- Dashboard foi preservado.
- `Cadastro -> Pacientes` foi preservado.
- Login/logout foram preservados.

## Resultado do build

- `cd frontend-react`
- `npm.cmd run build`
- Build concluído com sucesso.
