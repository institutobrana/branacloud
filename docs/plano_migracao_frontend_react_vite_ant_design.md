# Plano de Migracao do Frontend para React + Vite + Ant Design

## Objetivo desta etapa

Esta etapa e somente documental. O objetivo e registrar o planejamento tecnico para uma migracao futura, gradual e controlada do frontend legado do Brana Cloude para uma nova base em React + Vite + Ant Design.

Nesta fase:

- nao criar o projeto React ainda
- nao instalar dependencias
- nao alterar o frontend atual
- nao alterar backend
- nao alterar banco de dados
- nao iniciar migrations

## Decisao tecnica

O novo frontend sera construindo em React + Vite.

A biblioteca visual sugerida sera Ant Design.

O estilo visual planejado e de software odontologico profissional, com aparencia de sistema / ERP, e nao de site institucional.

O frontend atual continuara preservado enquanto a migracao nao estiver validada.

## Estrutura planejada

A nova base futura devera viver em:

```text
frontend-react\
```

Essa pasta deve ficar isolada do frontend legado para reduzir risco de regressao e permitir validacao por etapas.

## Regras de isolamento

- `frontend\` e legado e nao deve ser alterado durante a criacao inicial do `frontend-react\`.
- `frontend-react\` sera experimental e controlado ate validacao.
- `backend\` sera apenas consumido por API, nao reescrito nesta fase.
- Rotas existentes nao devem ser alteradas sem contrato proprio.
- Nenhuma regra odontologica ja validada deve ser recriada por suposicao.

## Estrategia de migracao gradual

A migracao futura deve seguir etapas pequenas e validaveis:

1. Documentar o plano da migracao.
2. Criar `frontend-react\` com React + Vite.
3. Instalar Ant Design e tema base Brana.
4. Criar o layout shell: menu lateral, topo e area principal.
5. Criar login consumindo o backend atual.
6. Criar a primeira tela piloto.
7. Migrar tela odontologica / odontograma por modulos.
8. Migrar Menu de pacientes.
9. Migrar Ficha pessoal.
10. Migrar Novo tratamento.
11. Validar equivalencia com o frontend antigo e com EasyDental.
12. Somente depois renomear `frontend\` para `frontend-legacy\` e `frontend-react\` para `frontend\`.

## Critérios de seguranca

Cada etapa futura deve manter:

- escopo pequeno
- documentacao propria
- atualizacao do roadmap
- validacao tecnica
- commit seletivo
- sem misturar frontend antigo com novo
- sem alterar backend sem necessidade
- sem alterar banco sem autorizacao

## Padrao visual planejado

Nome interno sugerido:

```text
Brana Clinical Software UI
```

Caracteristicas desejadas:

- layout claro
- menu lateral fixo
- topbar discreta
- tabelas fortes
- formularios alinhados
- abas em estilo software
- modais e drawers para acoes rapidas
- verde Brana como cor principal
- pouca animacao
- foco em produtividade clinica

## Estrutura futura sugerida do `frontend-react`

```text
frontend-react\
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

## Riscos conhecidos

- Codex misturar frontend antigo com novo
- alteracao acidental de `frontend\app.js`
- duplicacao de regras de negocio
- recriacao visual sem respeitar EasyDental
- quebra de login / sessao atual
- dependencias instaladas na raiz errada
- backend alterado sem contrato

## Decisao final desta etapa

Esta etapa e somente documental.

A criacao real da pasta `frontend-react\` sera feita em etapa posterior.

Nenhum codigo de producao deve ser alterado agora.
