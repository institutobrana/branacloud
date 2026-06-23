# Frontend React - Criacao do Esqueleto Inicial

## Objetivo desta etapa

Criar a pasta isolada `frontend-react\` com um esqueleto inicial em React + Vite + Ant Design, mantendo o frontend legado preservado.

## Pasta criada

```text
frontend-react\
```

## Dependencias instaladas

As dependencias do novo frontend foram instaladas apenas dentro de `frontend-react\`.

Pacotes principais:

- `react`
- `react-dom`
- `vite`
- `antd`
- `@ant-design/icons`
- `dayjs`

## Estrutura criada

```text
frontend-react\
  index.html
  package.json
  vite.config.js
  README.md
  src\
    app\
      App.jsx
      routes.jsx
    layout\
      BranaShell.jsx
      BranaSidebar.jsx
      BranaTopbar.jsx
    theme\
      branaTheme.js
      branaTokens.css
    components\
      BranaPageHeader.jsx
      BranaCard.jsx
      BranaTable.jsx
      BranaModal.jsx
      BranaFormSection.jsx
    features\
      home\
        HomePlaceholder.jsx
      pacientes\
      odontograma\
      tratamentos\
      agenda\
      financeiro\
      usuarios\
    services\
      api.js
    styles\
      globals.css
```

## Isolamento do frontend legado

- `frontend\` nao foi alterado.
- `frontend\app.js` nao foi alterado.
- `frontend\js\modules\` nao foi alterado.
- O novo frontend ficou isolado em `frontend-react\`.

## Backend e banco

- `backend\` nao foi alterado.
- Banco de dados nao foi alterado.
- Migrations nao foram alteradas.

## Como rodar

Dentro de `frontend-react\`:

```powershell
npm install
npm run build
npm run dev
```

## Próximos passos recomendados

1. Validar a tela placeholder no navegador.
2. Ajustar shell visual se necessario.
3. Criar a tela de login experimental.
4. Conectar a navegacao inicial sem tocar no frontend legado.
