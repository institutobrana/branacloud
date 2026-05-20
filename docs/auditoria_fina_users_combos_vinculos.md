# Auditoria fina documental — usersCarregarCombos() e datasets de vínculo de usuários

## Resumo executivo

`usersCarregarCombos()` é o carregador auxiliar que prepara o modal de novo/edição de usuários. Ele não carrega o cadastro completo nem as permissões; o papel dele é abastecer três datasets práticos para o formulário:

- tipos de usuário;
- prestadores;
- unidades de atendimento.

Na prática, esse carregamento sustenta o vínculo cadastral do usuário e o preenchimento de selects do modal. O fluxo é simples, mas crítico porque define o que o frontend consegue ou não consegue selecionar antes de salvar.

## Escopo e branch

- Branch: `modularizacao-segura-fase-1`
- Etapa: exclusivamente documental e de leitura
- Sem alteração de código, payload, backend, banco, schema, migrations ou endpoints

## Arquivos analisados

- `frontend/app.js`
- `backend/routes/cadastros_routes.py`
- `backend/routes/prestadores_routes.py`
- `backend/routes/unidades_atendimento_routes.py`
- `backend/routes/user_admin_routes.py` apenas para contexto
- Documentos de auditoria anteriores desta trilha

## Papel de `usersCarregarCombos()`

`usersCarregarCombos()` faz três requisições em paralelo e preenche caches locais usados pelo modal:

1. `GET /cadastros/auxiliares?tipo=Tipos de usuário`
2. `GET /cadastros/prestadores`
3. `GET /cadastros/unidades-atendimento/combos`

Depois disso, ele armazena:

- `usersTiposCache`
- `usersPrestadoresLookup`
- `usersUnidadesLookup`

## Datasets auxiliares identificados

| Dataset/combobox | Origem aparente | Endpoint/rota | Modal/campo dependente | Regra crítica | Risco | Observação |
|---|---|---|---|---|---|---|
| Tipos de usuário | `ItemAuxiliar` filtrado por tipo auxiliar | `GET /cadastros/auxiliares?tipo=Tipos de usuário` | `usersModalTipo` | remove vazios e remove o item normalizado como `clinica` | médio | alimenta o select de tipo de usuário no modal |
| Prestadores | lista de prestadores ativos/selecionáveis | `GET /cadastros/prestadores` | `usersModalPrestador` | mantém apenas itens com `row_id` ou `id` positivo | alto | é o vínculo principal do cadastro com o profissional |
| Unidades de atendimento | combos de unidades ativas da clínica | `GET /cadastros/unidades-atendimento/combos` | `usersModalUnidade` | mantém apenas itens com `row_id` ou `id` positivo | alto | é o vínculo principal do cadastro com a unidade |

## Fluxo de carregamento dos combos no novo/editar

### Sequência observada

1. `usersAbrirModalNovo()` chama `usersCarregarCombos()`.
2. `usersAbrirModalEditar()` também chama `usersCarregarCombos()`.
3. Depois do carregamento, o frontend chama `usersPreencherModal(user)`.
4. `usersPreencherModal()` aplica os valores de usuário e chama `usersPopularModalCombos(user)`.
5. `usersPopularModalCombos()` monta os `<option>` dos selects com a seleção atual.

### Contrato prático

- o modal só fica consistente depois que os três caches estão preenchidos;
- o código do usuário é tratado separadamente, mas os combos de tipo/vínculo precisam existir antes do preenchimento.

## Campos/modais que dependem desses datasets

- `usersModalTipo`
- `usersModalPrestador`
- `usersModalUnidade`
- o próprio modal de novo/edição de usuários

## Validações e fallbacks

- o carregador descarta tipos vazios;
- o carregador remove o tipo normalizado como `clinica`;
- prestadores e unidades só entram se tiverem `row_id` ou `id` positivo;
- `usersPopularModalCombos()` sempre adiciona opção vazia/placeholder para prestador e unidade;
- quando o usuário já tem vínculo, o select tenta manter a seleção atual;
- se o dataset vier vazio, o modal ainda abre, mas com as listas sem opções úteis além do placeholder.

## Endpoints/rotas que abastecem esses datasets

- `GET /cadastros/auxiliares?tipo=Tipos de usuário`
- `GET /cadastros/prestadores`
- `GET /cadastros/unidades-atendimento/combos`

### Observação de dependência

- o combo de tipos vem da área de `cadastros`;
- o combo de prestadores vem da rota própria de prestadores;
- o combo de unidades vem da rota de unidades de atendimento;
- todos pertencem ao contexto da mesma clínica via backend e auth já auditados em etapas anteriores.

## Onde termina cadastro puro e onde começam vínculos/perfis

- cadastro puro começa na identificação do usuário e nos campos básicos do modal;
- vínculo começa quando o modal passa a depender de `usersModalPrestador` e `usersModalUnidade`;
- perfil não é carregado por `usersCarregarCombos()`; o painel de perfis/permissões é outro fluxo;
- por isso, combos de vínculo são parte do cadastro, mas perfis e permissões já pertencem a outro subdomínio.

## Pontos mais frágeis

- o modal depende de três datasets distintos para ficar realmente utilizável;
- o tipo `clínica` é filtrado por regra textual e isso é um ponto sensível a mojibake;
- prestador e unidade podem ficar vazios e a UI ainda prossegue, o que pode esconder problema de dados da clínica;
- o mesmo modal mistura carregamento de combos, cadastro e vínculo em uma sequência curta;
- não há uma fronteira visual forte entre “combo carregado” e “campo validado”.

## Riscos críticos

- quebrar a seleção de tipo de usuário;
- permitir vínculo inválido com prestador ou unidade;
- perder a filtragem que remove `Clínica` da lista de tipos;
- gerar modal de usuário sem datasets e só descobrir a falha na hora do salvamento;
- confundir vínculo cadastral com permissões ou com a lógica de senha.

## O que não deve ser modularizado ainda

- `usersCarregarCombos()` como bloco isolado sem revisar o modal inteiro;
- os selects de tipo, prestador e unidade fora do contexto do cadastro;
- vínculo com prestador/unidade separado do modal principal sem nova auditoria;
- qualquer tentativa de mover o carregamento de combos antes de fechar o contrato de cadastro/edição.

## Lacunas restantes

- auditoria fina do comportamento de `usersPreencherModal()` em relação aos valores padrão;
- auditoria fina dos contratos de `usersOptions()` e dos placeholders;
- auditoria fina da origem completa dos tipos de usuário no backend de `cadastros`;
- auditoria fina da experiência quando um combo está vazio ou incompleto.

## Próxima auditoria fina recomendada

- Auditoria fina de `usersPreencherModal()` e `usersPopularModalCombos()`, para fechar o contrato de preenchimento do modal sem reabrir cadastro, permissões ou senha.
