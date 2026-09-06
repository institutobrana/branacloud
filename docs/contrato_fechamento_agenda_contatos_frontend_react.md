# Contrato final — Agenda de contatos no frontend React

## Estado

Este documento registra o estado final homologado do módulo Agenda de contatos.
Os documentos de subetapas anteriores permanecem históricos.

## Entrada e arquitetura

- Menu: `Atendimento` → `Agenda de contatos`.
- Rota: `/app/atendimento/agenda-contatos`.
- Implementação: `frontend-react/src/features/agendaContatos/`.
- O modal é reutilizado nos modos `Novo contato` e `Alterar contato`.
- A tabela contém as colunas `Nome`, `Tipo` e `Telefones`.

## Toolbar e listagem

A ordem da toolbar é: `Novo contato`, `Altera`, `Elimina`, `Imprime`,
`Relatório`, separador, filtro por tipo e pesquisa `Nome ou iniciais`.

A listagem suporta filtro por tipo, pesquisa textual sem distinção de maiúsculas
e minúsculas, contador da quantidade filtrada, seleção única e duplo clique para
abrir o mesmo fluxo de alteração do botão `Altera`.

`Imprime` e `Relatório` permanecem placeholders desabilitados. A decisão de
produto é `KEEP_PLACEHOLDER_UNTIL_USER_DEFINES`; não há contrato de impressão,
PDF ou relatório para este módulo.

## Modal e campos

O formulário possui 29 campos: 24 em Principal e 5 em Detalhes. `Novo` usa
`POST /agenda-contatos`; `Alterar` usa `PUT /agenda-contatos/{id}`; `Elimina`
usa `DELETE /agenda-contatos/{id}`.

Nome é obrigatório e não pode ser composto somente por espaços. Os builders e
validadores são compartilhados entre os modos.

## CEP e integrações

O CEP reutiliza o contrato da Ficha Pessoal: exibição `00000-000`, consulta
com oito dígitos em `GET /cadastros/cep/{cep}`, preenchimento de Endereço,
Bairro, Cidade e UF, sem preenchimento automático de Complemento.

A sincronização Contato ↔ Protetico permanece no backend; o frontend não cria,
vincula ou remove Protetico diretamente. WhatsApp e envelope de e-mail são
elementos visuais sem ação na Agenda.

## Apresentação e evidências

O modal segue o padrão de `Configuração → Preferências`: superfície clara
`#f5f0e6`, superfície escura `#142225` e tabs em formato card. Compactação,
light/dark e responsividade foram homologadas pelo usuário.

CREATE, UPDATE, DELETE, duplo clique e build foram homologados. Não há testes
automatizados específicos da feature (`AGENDA_CONTATOS_TESTS = NONE_EXIST`).
