# `frontend-react` - implementacao da tela Pacientes somente leitura

## Escopo implementado

A primeira tela real do `frontend-react` foi implementada como **Pacientes somente leitura** dentro do shell operacional atual.

O escopo entregue inclui:

- abertura da tela pelo ícone `Pacientes` da rail;
- listagem de pacientes em tabela;
- busca por texto;
- seleção de um paciente;
- painel de resumo somente leitura;
- estados de carregando, vazio e erro;
- retorno para `Início`.

## Endpoints GET usados

Foram usados apenas endpoints GET já existentes:

- `GET /pacientes`
- `GET /pacientes/{paciente_id}`

O consumo ocorre via proxy Vite existente em `/api`.

## Endpoints proibidos não usados

Não foram usados:

- `POST /pacientes`
- `PUT /pacientes/{paciente_id}`
- `DELETE /pacientes/{paciente_id}`
- `PATCH /pacientes/menu-preferences`
- qualquer outro endpoint de escrita

## Campos exibidos

### Tabela

- código;
- nome completo;
- telefone;
- cidade;
- status / inativo.

### Resumo somente leitura

- código;
- nome completo;
- CPF, quando disponível;
- telefone;
- cidade;
- status;
- convênio como `id_convenio`, quando disponível;
- plano como `id_plano`, quando disponível;
- `cod_prontuario`, quando disponível.

## Arquivos criados

- `frontend-react/src/features/pacientes/PacientesPage.jsx`
- `frontend-react/src/features/pacientes/pacientesApi.js`
- `frontend-react/src/features/pacientes/pacientes.css`

## Arquivos alterados

- `frontend-react/src/app/App.jsx`
- `docs/11_roadmap_desenvolvimento.md`

## Confirmações

- Não há criação de paciente.
- Não há edição de paciente.
- Não há exclusão de paciente.
- Não há odontograma.
- Não há tratamentos.
- Não há orçamento.
- O backend não foi alterado.
- O banco não foi alterado.
- As migrations não foram alteradas.
- Nenhum endpoint novo foi criado.
- Nenhuma API de escrita foi consumida.
- O frontend legado não foi alterado.

## Limitações conhecidas

- O resumo lateral depende dos campos disponíveis na resposta do backend.
- A busca está funcionando sobre o endpoint existente, mas a paginação não foi implementada.
- A tela ainda não abre odontograma nem tratamento a partir do paciente, por contrato.

## Próximos passos possíveis

- melhorar paginação, se necessário;
- adicionar ordenação visual;
- evoluir o resumo somente leitura com mais campos confirmados;
- criar a próxima tela funcional após Pacientes, sem abrir escrita.
