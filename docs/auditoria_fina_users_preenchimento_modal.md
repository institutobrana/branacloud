# Auditoria fina documental — usersPreencherModal() e usersPopularModalCombos()

## Resumo executivo

`usersPreencherModal()` e `usersPopularModalCombos()` formam o contrato visual de preenchimento do modal de usuários. Elas não persistem dados, não validam o backend e não salvam nada sozinhas; o papel delas é tomar um objeto de usuário e transformar isso em estado visível no modal, com selects preenchidos pelos caches auxiliares.

Esse trecho é importante porque define a fronteira entre:

- dados que só aparecem no modal;
- dados que o usuário pode editar;
- dados de vínculo que vêm dos combos;
- dados que só serão persistidos depois, por `usersSalvarEstrutural()`.

## Escopo e branch

- Branch: `modularizacao-segura-fase-1`
- Etapa: exclusivamente documental e de leitura
- Sem alteração de código, payload, backend, banco, schema, migrations ou endpoints

## Arquivos analisados

- `frontend/app.js`
- `backend` apenas como contexto mínimo das rotas abastecedoras
- Documentos de auditoria anteriores desta trilha

## Papel de `usersPreencherModal()`

`usersPreencherModal(user=null)` recebe um objeto de usuário opcional. Quando o usuário existe, ele:

- preenche os campos textuais do modal;
- reflete estado de ativo/admin/troca de senha;
- limpa os campos de senha;
- sincroniza a visibilidade da senha atual;
- chama `usersPopularModalCombos(user)`.

### Campos afetados diretamente

- `usersModalNome`
- `usersModalApelido`
- `usersModalEmail`
- `usersModalAtivo`
- `usersModalAdmin`
- `usersModalForcarSenha`
- `usersModalSenhaAtual`
- `usersModalSenha`
- `usersModalConfirma`
- `usersModalShowSenha`

## Papel de `usersPopularModalCombos()`

`usersPopularModalCombos(user=null)` escreve os selects do modal a partir dos caches auxiliares já carregados.

### Selects afetados

- `usersModalTipo`
- `usersModalPrestador`
- `usersModalUnidade`

### Caches usados

- `usersTiposCache`
- `usersPrestadoresLookup`
- `usersUnidadesLookup`

## Campos do modal afetados por cada função

| Função | Campo/modal afetado | Dataset/cache usado | Regra crítica | Fallback | Risco | Observação |
|---|---|---|---|---|---|---|
| `usersPreencherModal()` | nome, apelido, e-mail, ativo, admin, forçar senha, senha atual, senha, confirmação, visor da senha | usa o objeto `user` recebido | limpa o formulário antes de abrir | valores vazios quando `user` é nulo | médio | prepara o estado visual do modal |
| `usersPopularModalCombos()` | tipo, prestador, unidade | `usersTiposCache`, `usersPrestadoresLookup`, `usersUnidadesLookup` | mantém seleção atual quando existe no objeto `user` | placeholders de nenhum/nenhuma | alto | é a parte que transforma cache em `<option>` |

## Uso de `usersTiposCache`, `usersPrestadoresLookup` e `usersUnidadesLookup`

- `usersTiposCache` alimenta o select de tipo de usuário.
- `usersPrestadoresLookup` alimenta o select de prestador.
- `usersUnidadesLookup` alimenta o select de unidade.
- O tipo `Clínica` já é filtrado antes de entrar no cache, então esse preenchimento recebe uma lista já higienizada.

## Fluxo de preenchimento para novo usuário

### Sequência observada

1. `usersAbrirModalNovo()` chama `usersCarregarCombos()`.
2. O código do usuário é sugerido separadamente.
3. `usersPreencherModal(null)` limpa o modal.
4. `usersPopularModalCombos(null)` monta os selects com placeholders.
5. O modal abre pronto para inclusão.

### Fallbacks no novo

- campos textuais começam vazios;
- select de tipo recebe a primeira opção disponível, se existir;
- prestador e unidade abrem com placeholder de nenhum/nenhuma.

## Fluxo de preenchimento para edição de usuário

### Sequência observada

1. `usersAbrirModalEditar()` chama `usersCarregarCombos()`.
2. O código é bloqueado para edição.
3. `usersPreencherModal(user)` copia os valores já persistidos.
4. `usersPopularModalCombos(user)` tenta selecionar as opções já vinculadas.
5. O modal abre em estado de edição.

### Fallbacks na edição

- se o valor atual existir no combo, ele é selecionado;
- se o valor não existir, o select cai no placeholder;
- a UI não quebra, mas o vínculo pode ficar visualmente vazio.

## Regras de tipo, prestador e unidade

- o tipo de usuário é carregado do dataset auxiliar e filtrado para remover `Clínica`;
- prestador e unidade precisam vir com identificador positivo;
- o select mantém o vínculo atual se o valor existir no conjunto carregado;
- os placeholders ajudam a evitar seleção acidental quando não há dataset útil.

## Placeholders, options, defaults e fallbacks

- `usersOptions()` gera `<option>` com seleção atual.
- para prestador, o placeholder é `<< Nenhum >>`.
- para unidade, o placeholder é `<< Nenhuma >>`.
- para tipo, não há placeholder explícito no carregamento atual, então o select usa a lista disponível.
- se o dataset estiver vazio, o modal continua abrindo, mas os selects ficam sem opções funcionais além do que já exista no DOM.

## Onde termina o preenchimento do modal e onde começa a persistência

- `usersPreencherModal()` e `usersPopularModalCombos()` só montam a interface;
- a persistência começa em `usersSalvarEstrutural()`;
- por isso, esta parte é segura para documentação, mas não isolável ainda como helper independente sem revisar o modal inteiro.

## Pontos mais frágeis

- dependência de três caches ao mesmo tempo;
- filtragem textual de `Clínica`;
- preenchimento de select sem fallback visual forte quando o valor atual não existe;
- mistura de dados cadastrais e vínculos no mesmo modal;
- dependência de `usersOptions()` para construir o HTML final dos selects.

## Riscos críticos

- abrir modal com selects vazios ou inconsistentes;
- perder a seleção atual de tipo, prestador ou unidade na edição;
- confundir valor não existente com ausência legítima de vínculo;
- quebrar o filtro de `Clínica` por normalização textual;
- mascarar problema de dataset como se fosse só um detalhe visual.

## O que não deve ser modularizado ainda

- `usersPreencherModal()` isolada de `usersPopularModalCombos()`;
- os selects de tipo, prestador e unidade fora do modal principal;
- o helper de opções sem o contexto do modal;
- a extração do preenchimento sem revisar criação/edição junto.

## Lacunas restantes

- auditoria fina de `usersOptions()` e do contrato dos placeholders;
- auditoria fina de `usersCarregarCombos()` no contexto do preenchimento;
- auditoria fina da renderização dos modais filhos quando o modal principal fica aberto;
- auditoria fina da experiência quando um valor persistido não existe mais no combo.

## Avaliação explícita do estágio do domínio

O domínio de usuários/admin está mais maduro do que no início da trilha e já permite imaginar uma primeira separação real no futuro, mas ainda não está pronto para modularização funcional imediata.

Motivo: o preenchimento do modal ainda depende de carregamento de combos, regras textuais, seleção visual e persistência no mesmo bloco de interface. A fronteira melhor documentada existe, mas ainda há acoplamento suficiente para exigir cautela.

## Próxima etapa recomendada

- Auditoria fina de `usersOptions()` e dos placeholders dos selects, para fechar o contrato visual do modal antes de qualquer tentativa real de separação.
