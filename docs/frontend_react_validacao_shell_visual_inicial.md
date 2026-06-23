# Frontend React - Validação do Shell Visual Inicial

## Objetivo desta etapa

Refinar o shell visual inicial do `frontend-react\` para deixá-lo com aparência de software clínico / ERP, mantendo o frontend legado isolado e sem integrar backend real.

## Arquivos revisados

- `frontend-react/src/app/App.jsx`
- `frontend-react/src/layout/BranaShell.jsx`
- `frontend-react/src/layout/BranaSidebar.jsx`
- `frontend-react/src/layout/BranaTopbar.jsx`
- `frontend-react/src/features/home/HomePlaceholder.jsx`
- `frontend-react/src/theme/branaTheme.js`
- `frontend-react/src/theme/branaTokens.css`
- `frontend-react/src/styles/globals.css`
- `frontend-react/vite.config.js`
- `docs/11_roadmap_desenvolvimento.md`

## Melhorias feitas

- Menu lateral recebeu os itens visuais iniciais exigidos.
- Topbar foi simplificada para parecer interface de sistema.
- A tela inicial passou a mostrar o aviso de ambiente experimental isolado.
- Os cards dos módulos ficaram mais densos e alinhados com um shell de ERP.
- Foi adicionado o bloco de próximas etapas.
- O tema base ganhou ajustes para layout claro e verde Brana.
- O Vite recebeu split simples de `antd` e `vendor` para reduzir o risco do chunk único muito grande.

## Isolamento do frontend legado

- `frontend\` não foi alterado.
- `frontend\app.js` não foi alterado.
- `frontend\js\modules\` não foi alterado.

## Backend e banco

- `backend\` não foi alterado.
- Banco de dados não foi alterado.
- Migrations não foram alteradas.

## Resultado do build

`npm.cmd run build` executou com sucesso dentro de `frontend-react\`.

## Situação do warning de chunk grande

O warning permaneceu como risco técnico documentado. A tentativa de split manual foi considerada, mas foi descartada por gerar um aviso circular; por isso o Vite ficou com a configuração simples nesta etapa.

## Próximos passos recomendados

1. Criar uma tela de login experimental sem autenticação real.
2. Preparar contrato de integração com o backend atual.
3. Iniciar navegação básica entre placeholders de módulos.
