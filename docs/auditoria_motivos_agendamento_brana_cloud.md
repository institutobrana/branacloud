# Auditoria de `Motivos de agendamento` no Brana Cloud

## 1. Contexto

`Motivos de agendamento` e uma frente estrutural propria do Brana Cloud. Ela nao existia no catalogo simples atual do novo frontend React e nao podia ser tratada como tabela auxiliar simples reaproveitando `item_auxiliar`.

A referencia funcional principal foi o Terra Relva, onde a tabela especial existe com:

- `Codigo`
- `Nome`
- `Descricao`
- `Tipo`
- `Cor`
- checkbox `Compromisso produtivo`

## 2. Leitura tecnica no Brana Cloud

Foram auditados os pontos reais do projeto:

- `backend/routes/cadastros_routes.py`
- `backend/models/financeiro.py`
- `backend/scripts/sincronizar_auxiliares_easydental.py`
- `backend/scripts/aplicar_compatibilidade_schema.py`
- `frontend-react/src/features/tabelasAuxiliares/TiposIndicacaoPage.jsx`
- `frontend-react/src/features/tabelasAuxiliares/auxiliaresApi.js`
- `frontend-react/src/app/App.jsx`
- `frontend-react/src/styles/globals.css`
- `frontend/app.js`
- `frontend/js/modules/auxiliares.js`
- `docs/auditoria_situacao_agendamento_frontend_react.md`
- `docs/validacao_final_tabelas_auxiliares_frontend_react_brana_cloude.md`

## 3. Descoberta principal

O Brana Cloud nao possuia, antes desta frente, uma estrutura propria para `Motivos de agendamento`.

O modelo atual de `item_auxiliar` nao comportava de forma limpa os campos exigidos pela frente especial:

- `nome`
- `tipo`
- `cor`
- `compromisso_produtivo`

Tambem nao havia rota especial existente no Brana Cloud para essa tabela.

## 4. Fontes do Terra Relva

As referencias funcionais e estruturais usadas como contrato foram:

- `D:\TERRA RELVA APP\frontend-react\src\pages\admin\TabelasAuxiliaresPage.tsx`
- `D:\TERRA RELVA APP\backend\src\services\appointmentAuxiliaryTablesService.js`
- `D:\TERRA RELVA APP\frontend-react\src\services\auxiliaryTables\auxiliaryTablesApi.ts`
- `D:\TERRA RELVA APP\docs\contrato_modulo_tabelas_auxiliares.md`

## 5. Resultado da auditoria

A auditoria concluiu que `Motivos de agendamento` deve ser tratada como frente especial propria, com infraestrutura separada do bloco simples de auxiliares.

O comportamento confirmado e:

- lista propria em catalogo
- modal proprio
- codigo automatico com prefixo `MA`
- `Tipo` com valores `agendamento` e `compromisso`
- cor obrigatoria apenas para `compromisso`
- checkbox `Compromisso produtivo` habilitado apenas para `compromisso`
- coluna visual de bloqueio/cadeado na listagem
- status ativo/inativo preservado

## 6. Implementacao iniciada

Com base na auditoria, foi iniciada a implementacao da frente propria no Brana Cloud com:

- novo modelo persistido
- nova rota backend
- novo contrato de API no frontend React
- entrada propria no catalogo de tabelas auxiliares

## 7. Conclusao

`Motivos de agendamento` nao existia previamente como frente propria no Brana Cloud. A audicao confirmou que ela precisa de contrato e persistencia especificos, e nao de encaixe no lote das tabelas simples.
