# Contrato de implementacao - `Motivos de agendamento`

## 1. Objetivo

Implementar `Motivos de agendamento` no novo frontend React do Brana Cloud como frente especial propria, preservando o visual e a densidade estrutural ja consolidados na area de tabelas auxiliares.

## 2. Escopo funcional confirmado

### Modal

Campos confirmados:

- `Codigo`
- `Nome`
- `Descricao`
- `Tipo`
- `Cor`
- checkbox `Compromisso produtivo`

### Lista

Colunas confirmadas:

- `Codigo`
- `Nome`
- `Descricao`
- `Cor`
- `Bloqueio`
- `Status`

### Regras funcionais

- `Codigo` usa geracao automatica com prefixo `MA`
- `Tipo` aceita somente:
  - `agendamento`
  - `compromisso`
- quando `Tipo = agendamento`:
  - a paleta fica desabilitada
  - `Compromisso produtivo` fica desabilitado e falso
  - a cor fica nula
- quando `Tipo = compromisso`:
  - a paleta fica habilitada
  - `Compromisso produtivo` fica habilitado
  - a cor e obrigatoria

## 3. Reaproveitamento seguro

Pode ser reaproveitado:

- shell da tela de tabelas auxiliares
- submenu lateral interno
- tabela base e comportamento de selecao
- cabeçalho compartilhado de coluna
- menu de filtro
- visual geral do modal
- paleta cromatica de `Situação de agendamento`, enquanto a identidade visual do Brana Cloud for mantida

## 4. Comportamento proprio desta frente

Deve permanecer proprio de `Motivos de agendamento`:

- codigo automatico com prefixo `MA`
- campo `Tipo`
- regra dinamica entre `Tipo`, paleta e checkbox
- campo `Compromisso produtivo`
- coluna de bloqueio/cadeado
- persistencia em tabela especial propria

## 5. Dependencias preservadas

- backend com rota especial propria
- banco com tabela propria
- frontend React com aba propria no catalogo
- validacao de tipo e cor no contrato da API

## 6. Fora de escopo

- tratar como tabela simples
- usar `item_auxiliar`
- criar nova regra de negocio nao confirmada
- mudar backend generico de auxiliares simples
- mudar outras excecoes

## 7. Estrutura de banco e API

Foi adotado o contrato tecnico de uma tabela propria no backend com campos:

- `codigo`
- `nome`
- `descricao`
- `tipo`
- `cor`
- `compromisso_produtivo`
- `inativo`

Rotas previstas:

- `GET /cadastros/motivos-agendamento`
- `POST /cadastros/motivos-agendamento`
- `PUT /cadastros/motivos-agendamento/{id}`
- `PATCH /cadastros/motivos-agendamento/{id}/status`
- `GET /cadastros/motivos-agendamento/{id}/delete-check`
- `DELETE /cadastros/motivos-agendamento/{id}`
- `POST /cadastros/motivos-agendamento/{id}/replace-and-delete`

## 8. Proxima etapa recomendada

Validar a tela no navegador, corrigir apenas microajustes visuais se necessario e, se o comportamento estiver consistente, fechar a frente com commit seletivo e push.
