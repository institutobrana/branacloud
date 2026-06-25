# Aba Geral das Preferências - alinhamento dos dados de identidade

## Objetivo da etapa

Corrigir exclusivamente o alinhamento de Nome, CPF e CRO/UF na aba Geral do modal de Preferências do `frontend-react`, colocando essas três linhas na mesma grade clássica dos demais campos.

## Problema validado pelo usuário

O usuário confirmou que a aba Geral já estava melhor, com a foto/avatar encaixada e os campos mais controlados, mas observou que Nome, CPF e CRO/UF ainda apareciam em um bloco separado, centralizado e solto acima do formulário.

## Causa encontrada no JSX/CSS

O topo da aba Geral ainda usava um agrupamento visual próprio para a identidade, diferente da grade aplicada aos demais campos. Isso fazia Nome, CPF e CRO/UF parecerem desconectados da sequência de formulário.

## Classes reais identificadas

- `preferencias-form-row`
- `preferencias-form-label`
- `preferencias-form-field`
- `preferencias-form-value`
- `preferencias-geral-easy-layout`
- `preferencias-geral-form-area`
- `preferencias-geral-photo-area`
- `preferencias-general-form-fixed`

## Arquivos lidos

- `frontend-react/src/features/preferencias/PreferenciasUsuarioModal.jsx`
- `frontend-react/src/features/preferencias/preferenciasUsuario.css`
- `docs/frontend_react_preferencias_aba_geral_grid_real.md`
- `docs/frontend_react_preferencias_aba_geral_grade_foto.md`
- `docs/frontend_react_preferencias_refino_faixa_grade_modal.md`
- `docs/frontend_react_preferencias_redesenho_campo_a_campo.md`
- `docs/11_roadmap_desenvolvimento.md`

## Arquivos alterados

- `frontend-react/src/features/preferencias/PreferenciasUsuarioModal.jsx`
- `frontend-react/src/features/preferencias/preferenciasUsuario.css`
- `docs/frontend_react_preferencias_aba_geral_alinha_dados.md`
- `docs/11_roadmap_desenvolvimento.md`

## Como Nome/CPF/CRO/UF foram movidos para a mesma grade

- Nome, CPF e CRO/UF deixaram de usar um bloco visual separado.
- As três linhas passaram a usar `ClassicFormRow`, a mesma estrutura de linha usada pelos campos abaixo.
- Os valores passaram a ser renderizados como texto visual em `preferencias-form-value`, sem virar inputs.
- Isso colocou labels e valores no mesmo eixo da grade clássica do formulário.

## Confirmações visuais

- Nome, CPF e CRO/UF continuam texto visual e não inputs.
- Os valores começam no mesmo eixo dos campos Apresentação e demais selects.
- A foto/avatar continuou à direita.
- Câmera e Upload continuam completos.
- Ficha clínica não foi alterada.
- Orçamento não foi alterada.
- NFS-e não foi alterada.
- NFS-e manteve os campos visuais.
- O rodapé cinza não foi alterado.
- O modal continua com tamanho fixo entre abas.

## Mojibake

- Não houve reintrodução de textos quebrados nos arquivos desta etapa.
- Os textos de interface necessários permaneceram em português UTF-8.

## Resultado das buscas de encoding

- Busca por `Ãƒ`: sem ocorrências nos arquivos desta etapa.
- Busca por `Ã‚`: sem ocorrências nos arquivos desta etapa.
- Busca por `ï¿½`: sem ocorrências nos arquivos desta etapa.

## Resultado do build

- `cd frontend-react`
- `npm.cmd run build`
- Build concluído com sucesso.

## Próximo passo recomendado

Fazer a validação manual somente da aba Geral em `/app` para confirmar o alinhamento final antes de qualquer novo refinamento.
