# Implementação do Shell Operacional Odontológico do frontend React

## Objetivo da etapa

Implementar o refino do shell operacional no `frontend-react`, criando uma estrutura visual mais próxima de software odontológico e desktop, com barra lateral estreita, toolbar superior horizontal e área central de trabalho, mantendo a tela `Início` como conteúdo autenticado.

## Contrato seguido

- [`docs/frontend_react_contrato_shell_operacional_odontologico.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\frontend_react_contrato_shell_operacional_odontologico.md)
- [`docs/frontend_react_tokens_marca_brana.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\frontend_react_tokens_marca_brana.md)
- [`docs/frontend_react_inicio_painel_inicial.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\frontend_react_inicio_painel_inicial.md)
- [`docs/frontend_react_validacao_final_login_real.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\frontend_react_validacao_final_login_real.md)

## Arquivos criados/alterados

- [`frontend-react/src/layout/BranaIconRail.jsx`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\layout\BranaIconRail.jsx)
- [`frontend-react/src/layout/BranaActionTopbar.jsx`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\layout\BranaActionTopbar.jsx)
- [`frontend-react/src/layout/BranaWorkspace.jsx`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\layout\BranaWorkspace.jsx)
- [`frontend-react/src/app/App.jsx`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\app\App.jsx)
- [`frontend-react/src/features/inicio/InicioPage.jsx`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\features\inicio\InicioPage.jsx)
- [`frontend-react/src/features/inicio/inicio.css`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\features\inicio\inicio.css)
- [`frontend-react/src/styles/globals.css`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\styles\globals.css)

## Componentes criados/adaptados

- `BranaIconRail`: barra lateral estreita com ícones, tooltip e item ativo visual.
- `BranaActionTopbar`: toolbar superior horizontal com ações rápidas em placeholder, busca visual e sessão do usuário.
- `BranaWorkspace`: invólucro da área central com topbar e conteúdo.
- `InicioPage`: recebeu moldura mais compacta e um bloco operacional de apoio.

## Como ficou a barra lateral estreita

- Largura aproximada de 72px.
- Ícones verticais com tooltip.
- Estado ativo destacado visualmente.
- Uso predominante da paleta Brana.
- Botão `Sair` mantido no rodapé do rail.

## Como ficou a toolbar superior

- Barra horizontal com busca `Pesquisar paciente`.
- Ações rápidas visuais: `Novo paciente`, `Buscar paciente`, `Novo tratamento`, `Agenda`, `Financeiro`, `Relatórios/Documentos`.
- Exibição do usuário logado.
- Botão `Sair` preservado.

## Quais ações são placeholders

- `Novo paciente`
- `Buscar paciente`
- `Novo tratamento`
- `Agenda`
- `Financeiro`
- `Relatórios/Documentos`
- campo `Pesquisar paciente`

Nenhuma dessas ações consome API nesta etapa.

## Tokens de marca usados

- `#00A79D`
- `#006838`
- `#004B25`
- `#939598`
- `#808285`
- `#007B74`

## Confirmações

- Nenhuma nova API foi consumida.
- Pacientes não foi migrado.
- Odontograma não foi migrado.
- O frontend legado não foi alterado.
- O backend não foi alterado.
- O banco não foi alterado.
- As migrations não foram alteradas.
- Nenhuma senha ou token foi exibida.

## Resultado do build

- `npm.cmd run build` em `frontend-react`: sucesso.
- O Vite gerou aviso de chunk grande, sem impedir a compilação.
- Não havia script de lint configurado no pacote.

## Próximos passos recomendados

- Validar manualmente o layout em `/app`.
- Confirmar que `Sair` continua funcionando.
- Avaliar se a próxima etapa deve apenas ajustar espaçamento/ícones ou iniciar o contrato de `Pacientes` em modo somente leitura.

