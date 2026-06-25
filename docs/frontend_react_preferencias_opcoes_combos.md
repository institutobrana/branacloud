# Preferências - ajuste das opções dos combos

## Objetivo da etapa

Ajustar exclusivamente as listas de opções dos combos do modal Preferências para ficarem coerentes com o EasyDental e com o contrato funcional já documentado.

## Problema validado pelo usuário

O usuário informou que alguns combos do modal Preferências não exibiam os mesmos itens vistos no EasyDental, mesmo com o layout e o tamanho do modal já corretos.

## Arquivos lidos

- `docs/frontend_react_preferencias_usuario_contrato_funcional.md`
- `docs/frontend_react_preferencias_usuario_modal_visual.md`
- `docs/frontend_react_preferencias_redesenho_campo_a_campo.md`
- `docs/frontend_react_preferencias_nfse_compacta.md`
- `docs/frontend_react_preferencias_remove_texto_nfse_reduz_modal.md`
- `docs/11_roadmap_desenvolvimento.md`
- `frontend-react/src/features/preferencias/PreferenciasUsuarioModal.jsx`
- `frontend-react/src/features/preferencias/preferenciasUsuario.css`

## Arquivos alterados

- `frontend-react/src/features/preferencias/PreferenciasUsuarioModal.jsx`
- `docs/frontend_react_preferencias_opcoes_combos.md`
- `docs/11_roadmap_desenvolvimento.md`

## Combos encontrados

- Envio padrão para mensagens
- Conta bancária padrão
- Estoque padrão
- Módulo de abertura
- Especialidade(s)
- Modelo padrão de orçamentos

## Opções novas aplicadas

- Envio padrão para mensagens:
  - WhatsApp Web (apenas 1 envio)
  - E-mail
  - SMS
  - Nenhum
- Conta bancária padrão:
  - CX Gleisson Tel
  - Conta padrão
  - Nenhuma
- Estoque padrão:
  - Estoque padrão
  - Nenhum
- Módulo de abertura:
  - Agenda diária
  - Agenda por unidade
  - Agenda semanal
  - Cadastro de pacientes
  - Contas a pagar
  - Contas a receber
  - Controle de estoque
  - Dashboard
  - Ficha clínica
  - Fluxo de caixa
  - Gerenciar tratamentos
- Especialidade(s):
  - Cirurgia
  - Dentística
  - Diagnóstico
  - Emergência
  - Endodontia
  - Estomatologia
  - Estética
  - Gerais
  - Harmonização Orofacial
  - Implantodontia
  - Odontologia Legal
  - Odontopediatria
  - Ortodontia
  - Ortopedia Funcional dos Maxilares
- Modelo padrão de orçamentos:
  - Orçamento com odontograma
  - Orçamento simplificado
  - Orçamento detalhado

## Confirmações

- O ajuste foi apenas visual/estático.
- Nenhuma API nova foi criada ou consumida.
- Não houve persistência.
- O layout do modal não foi alterado intencionalmente.
- O tamanho fixo do modal foi preservado.
- A aba NFS-e manteve os campos visuais.
- `Gravar preferências` não salva e não chama API.
- `Cancelar` fecha o modal.
- O backend não foi alterado.
- O frontend legado não foi alterado.
- O banco e migrations não foram alterados.

## Mojibake

- Não houve reintrodução de textos quebrados.
- Foi feita verificação para evitar `Ãƒ`, `Ã‚` e `ï¿½` nos arquivos tocados.

## Resultado das buscas

- `Ãƒ`: sem ocorrências.
- `Ã‚`: sem ocorrências.
- `ï¿½`: sem ocorrências.

## Resultado do build

- `cd frontend-react`
- `npm.cmd run build`
- Build concluído com sucesso.
