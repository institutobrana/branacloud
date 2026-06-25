# Frontend React - Grade e foto da aba Geral das Preferências

## Objetivo da etapa

Refinar exclusivamente a aba Geral do modal Preferências, corrigindo a divisão entre formulário e foto/avatar, a largura dos campos e o encaixe da coluna direita, sem alterar comportamento ou outras abas.

## Problema validado pelo usuário

O usuário informou que os campos da aba Geral estavam largos demais, a textarea de apresentação ficou exageradamente larga, os selects invadiam a área reservada para a foto e os botões da foto estavam espremidos/cortados.

## Arquivos lidos

- `docs/frontend_react_preferencias_redesenho_campo_a_campo.md`
- `docs/frontend_react_preferencias_refino_faixa_grade_modal.md`
- `docs/frontend_react_preferencias_correcao_mojibake.md`
- `docs/11_roadmap_desenvolvimento.md`
- `frontend-react/src/features/preferencias/PreferenciasUsuarioModal.jsx`
- `frontend-react/src/features/preferencias/preferenciasUsuario.css`

## Arquivos alterados

- `frontend-react/src/features/preferencias/PreferenciasUsuarioModal.jsx`
- `frontend-react/src/features/preferencias/preferenciasUsuario.css`
- `docs/frontend_react_preferencias_aba_geral_grade_foto.md`
- `docs/11_roadmap_desenvolvimento.md`

## Como a aba Geral foi separada em formulário e coluna da foto

- A aba Geral mantém uma área principal de formulário à esquerda/centro.
- A coluna da foto permanece à direita, em espaço visual próprio.
- A divisão foi reforçada para impedir que os campos invadam a área da foto.

## Como a largura dos campos foi controlada

- Os campos passaram a usar largura controlada e alinhada à coluna do formulário.
- A textarea de apresentação deixou de atravessar a área da foto.
- Os selects ficaram mais largos que antes, mas sem invadir a coluna direita.

## Como labels e campos foram alinhados em grade clássica

- Labels seguem em coluna fixa à esquerda.
- Os campos começam sempre no mesmo eixo.
- A composição ficou mais parecida com formulário desktop clássico.

## Como a foto/avatar foi corrigida para não cortar

- A foto/avatar passou a usar moldura fixa e área própria.
- A barra inferior cinza continua inteira.
- Os botões Câmera e Upload ficaram visíveis por completo.

## Confirmações

- Câmera e Upload aparecem completos.
- Ficha clínica não foi alterada.
- Orçamento não foi alterado.
- NFS-e não foi alterada.
- NFS-e manteve os campos visuais do print.
- Não houve mojibake após a alteração.
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

