# Frontend React - Refino da tela Preferências para estilo desktop

## Objetivo da etapa

Aproximar o modal Preferências do `frontend-react` de uma janela desktop/ERP clássica, reduzindo a aparência moderna/SaaS e aumentando a densidade visual.

## Validação do usuário

O usuário informou que o modal ainda estava bem diferente da referência do EasyDental, mesmo após os refinos anteriores.

## Problemas visuais identificados

- Modal ainda com sensação moderna demais.
- Cantos muito arredondados.
- Abas ainda com leitura espaçada.
- Inputs, selects e textareas ainda altos demais.
- Labels ainda um pouco afastadas dos campos.
- Área de avatar ainda destacada.
- Ficha clínica ainda com sensação de bloco moderno.
- Orçamento ainda com espaço vazio perceptível.

## Arquivos lidos

- `docs/frontend_react_preferencias_usuario_contrato_funcional.md`
- `docs/frontend_react_preferencias_usuario_modal_visual.md`
- `docs/frontend_react_preferencias_refino_visual_modal.md`
- `docs/11_roadmap_desenvolvimento.md`
- `frontend-react/src/features/preferencias/PreferenciasUsuarioModal.jsx`
- `frontend-react/src/features/preferencias/preferenciasUsuario.css`

## Arquivos alterados

- `frontend-react/src/features/preferencias/PreferenciasUsuarioModal.jsx`
- `frontend-react/src/features/preferencias/preferenciasUsuario.css`
- `docs/11_roadmap_desenvolvimento.md`

## Como o modal ficou mais desktop/ERP

- Border-radius menor.
- Sombra mais parecida com janela clássica.
- Padding reduzido.
- Título, abas e corpo mais próximos.
- Rodapé mais curto e próximo do conteúdo.

## Como as abas foram refinadas

- Abas com visual mais clássico.
- Menos espaçamento entre guias.
- Aba ativa com destaque simples em turquesa.
- Linha inferior discreta.

## Como a aba Geral foi compactada

- Formulário ficou mais denso.
- Gaps entre linhas foram reduzidos.
- Campos ficaram menores e mais próximos.
- Layout em duas colunas foi preservado.

## Como a área de foto/avatar foi reduzida

- Avatar menor.
- Card menos destacado.
- Botões câmera/upload mais simples.

## Como a aba Ficha clínica ficou mais operacional

- Lista visual mais compacta.
- Botão Incluir preservado sem persistência.
- Checkboxes próximos da área principal.
- Menos sensação de card moderno.

## Como a aba Orçamento ficou menos vazia

- Campos e checkboxes aproximados.
- Espaço vazio reduzido.
- Rodapé mais próximo do conteúdo.

## Como a aba NFS-e foi mantida como pendência compacta

- A aba continua apenas com aviso de pendência.
- Não foram criados campos novos.
- Não foi adicionada lógica fiscal.

## Confirmações

- Não foram criados campos novos na NFS-e.
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
