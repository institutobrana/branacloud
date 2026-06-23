# `frontend-react` - contrato da tela Pacientes somente leitura

## 1. Escopo da tela

Esta etapa define a primeira versão da tela **Pacientes** no `frontend-react` como uma tela **somente leitura**.

O objetivo é permitir:

- abrir a tela Pacientes dentro do shell atual;
- listar pacientes existentes;
- pesquisar e filtrar pacientes;
- selecionar um paciente;
- visualizar um resumo simples e somente leitura, se tecnicamente possível.

Esta primeira versão **não** permite cadastro, edição ou exclusão.

## 2. Referências usadas

- Auditoria do sistema odontologico externo como referência visual e funcional.
- Frontend legado e backend atual como fonte de verdade técnica.
- Shell operacional atual do `frontend-react` como base visual.

## 3. Regras de segurança

- Não alterar backend.
- Não alterar banco.
- Não criar endpoint.
- Não consumir endpoint não confirmado.
- Não copiar código, asset ou texto proprietário do sistema externo.
- Não exibir dados sensíveis além do necessário.
- Não registrar tokens, senhas ou logs sensíveis.

## 4. Layout esperado

- A tela deve abrir dentro do shell atual.
- A área central deve ser o workspace clínico.
- Deve existir um cabeçalho compacto com o título `Pacientes`.
- Deve existir um campo de busca/filtro.
- Deve existir uma lista ou tabela de pacientes.
- Pode existir um painel lateral ou área de resumo somente leitura, se tecnicamente viável.
- Os botões `Novo`, `Editar` e `Excluir` devem ficar desabilitados ou omitidos nesta primeira etapa.
- A interface não deve sugerir que o usuário pode salvar alterações.

## 5. Dados permitidos

Os campos a exibir devem ser limitados ao que já existir no backend ou no legado.

Campos candidatos:

- código / id;
- nome;
- telefone;
- celular;
- CPF apenas se já aparecer no legado e com cuidado;
- data de nascimento / idade;
- convênio;
- status;
- observações resumidas, se já existir.

Campos ainda incertos devem ser marcados como `confirmar no backend/legado`.

## 6. Comportamentos permitidos

- carregar lista;
- pesquisar;
- selecionar paciente;
- visualizar resumo;
- tratar estado vazio;
- tratar estado de erro;
- voltar para `Início`;
- manter o shell atual.

## 7. Comportamentos proibidos

- criar;
- editar;
- excluir;
- salvar;
- abrir odontograma;
- criar tratamento;
- alterar permissões;
- alterar dados.

## 8. Dependências técnicas a confirmar

- endpoints existentes;
- formato de resposta;
- autenticação via `/api`;
- proxy Vite;
- campos reais;
- paginação, se existir.

## 9. Plano de implementação futura em etapa pequena

Próxima etapa sugerida:

1. implementar a rota/tela Pacientes somente leitura no `frontend-react`;
2. consumir apenas API existente confirmada;
3. não alterar backend;
4. manter build e documentação próprios;
5. fazer commit seletivo apenas da mudança da tela.

## 10. Critérios de aceite da futura implementação

- A tela abre no shell.
- O login/logout continuam funcionando.
- O backend não é alterado.
- O banco não é alterado.
- Nenhum endpoint novo é criado.
- A lista de pacientes só aparece se o endpoint existente permitir.
- Não existe criação, edição ou exclusão.
- O build passa.

## 11. Auditoria técnica de leitura

### Endpoints de pacientes encontrados no backend

O backend já expõe uma família de endpoints relacionados a pacientes em `backend/routes/cadastros_routes.py`:

- `GET /pacientes`
- `GET /pacientes/proximo-codigo`
- `GET /pacientes/navegar`
- `GET /pacientes/por-codigo/{codigo}`
- `GET /pacientes/{paciente_id}`
- `POST /pacientes`
- `PUT /pacientes/{paciente_id}`
- `DELETE /pacientes/{paciente_id}`

O backend também já expõe endpoints de apoio que usam paciente como contexto:

- `GET /pacientes/menu-preferences`
- `PATCH /pacientes/menu-preferences`
- `GET /pacientes/menu-options`
- `GET /pacientes/menu`

### Arquivos de backend relacionados

- `backend/routes/cadastros_routes.py`
- `backend/models/paciente.py`
- `backend/routes/tratamentos_routes.py`
- `backend/routes/orcamento_routes.py`
- `backend/routes/anamnese_routes.py`
- `backend/routes/agenda_legado_routes.py`
- `backend/routes/quadro-de-avisos.py`

### Campos técnicos confirmados no backend

O modelo `Paciente` confirma, entre outros, estes campos:

- `id`
- `clinica_id`
- `codigo`
- `nome`
- `sobrenome`
- `nome_completo`
- `apelido`
- `sexo`
- `data_nascimento`
- `data_cadastro`
- `status`
- `inativo`
- `cpf`
- `rg`
- `cns`
- `correspondencia`
- `endereco`
- `complemento`
- `bairro`
- `cidade`
- `uf`
- `cep`
- `email`
- `tipo_fone1`
- `fone1`
- `tipo_fone2`
- `fone2`
- `tipo_fone3`
- `fone3`
- `tipo_fone4`
- `fone4`
- `tipo_indicacao`
- `indicado_por`
- `anotacoes`
- `id_convenio`
- `id_plano`
- `id_unidade`
- `tabela_codigo`
- `cod_prontuario`
- `matricula`
- `data_validade_plano`

### Campos retornados pela listagem pública do backend

O endpoint `GET /pacientes` já retorna, de forma resumida:

- `id`
- `codigo`
- `nome`
- `sobrenome`
- `nome_completo`
- `cpf`
- `fone1`
- `cidade`
- `status`
- `inativo`

### Consumo no frontend legado

O frontend legado já consome pacientes em múltiplos pontos, incluindo:

- `frontend/app.js`
- `frontend/js/modules/prontuario.js`
- `frontend/js/modules/odontograma-v1-paciente-search.js`
- `frontend/js/modules/odontograma-v1.js`
- `frontend/orcamento/orcamento.js`
- `frontend/orcamento/orcamento-api.js`
- `frontend/js/modules/ficha-pessoal-aba-anamnese.js`

Os caminhos observados incluem:

- `/cadastros/pacientes`
- `/cadastros/pacientes/por-codigo/{codigo}`
- `/cadastros/pacientes/{paciente_id}`
- `/cadastros/pacientes/menu`
- `/cadastros/pacientes/navegar`
- `/cadastros/pacientes/proximo-codigo`

### Nomes de campos já vistos no legado

Entre os nomes observados no frontend legado e no backend:

- `codigo`
- `nome`
- `sobrenome`
- `nome_completo`
- `cpf`
- `fone1`
- `cidade`
- `status`
- `inativo`
- `id_convenio`
- `id_plano`
- `cod_prontuario`

## 12. Próximo passo recomendado

A próxima etapa recomendada é implementar a tela **Pacientes somente leitura** no `frontend-react`, reaproveitando apenas os endpoints já confirmados acima, sem criar escrita, sem alterar backend e sem mexer no shell operacional.
