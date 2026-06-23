# Início / Painel Inicial do frontend React

## Objetivo da etapa

Implementar a primeira tela autenticada do `frontend-react` como **Início / Painel Inicial**, usando a sessão real já validada e os tokens oficiais da marca Brana.

## Contrato seguido

- [`docs/frontend_react_contrato_primeira_tela_piloto_inicio.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\frontend_react_contrato_primeira_tela_piloto_inicio.md)
- [`docs/frontend_react_tokens_marca_brana.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\frontend_react_tokens_marca_brana.md)

## Tokens de marca usados

- `#00A79D`
- `#006838`
- `#004B25`
- `#939598`
- `#808285`
- `#007B74`

## Arquivos criados/alterados

- [`frontend-react/src/features/inicio/InicioPage.jsx`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\features\inicio\InicioPage.jsx)
- [`frontend-react/src/features/inicio/inicio.css`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\features\inicio\inicio.css)
- [`frontend-react/src/app/App.jsx`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\app\App.jsx)
- [`frontend-react/src/layout/BranaTopbar.jsx`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\layout\BranaTopbar.jsx)

## Dados usados do AuthProvider

- nome do usuário
- apelido do usuário
- e-mail do usuário
- `clinica_id`, quando disponível no `/me`
- `permissoes`, quando disponíveis no `/me`

## O que a tela exibe

- título `Início`
- subtítulo `Painel inicial do novo frontend React do Brana Cloud`
- saudação com nome, apelido ou e-mail do usuário
- aviso discreto de migração controlada
- cards de acesso
- bloco de status da sessão
- bloco de próximas telas da migração

## O que a tela não faz

- não exibe token
- não exibe senha
- não consome novas APIs
- não migra odontograma
- não migra pacientes
- não migra tratamentos
- não migra agenda
- não migra financeiro
- não implementa permissões

## Confirmações

- Nenhuma senha ou token foi exibida.
- Nenhuma nova API foi consumida.
- O frontend legado não foi alterado.
- O backend não foi alterado.
- O banco não foi alterado.

## Resultado do build

- `npm.cmd run build` em `frontend-react`: sucesso.

## Próximos passos recomendados

- Validar manualmente `/app` e `logout`.
- Depois, criar o contrato da primeira tela funcional real, preferencialmente `Pacientes` em modo somente leitura.
