# Auditoria fina documental — usersOptions(), placeholders e estados vazios do modal de usuários

## Resumo executivo

`usersOptions()` é o gerador central de `<option>` para o modal de usuários. Ele não busca dados, não valida o backend e não persiste nada: recebe uma lista, o campo de valor, o campo de rótulo, o valor atualmente selecionado e um placeholder opcional, e devolve o HTML pronto do `<select>`.

Essa função é o último elo visual do contrato do modal antes da persistência. Por isso, os estados vazios e os valores ausentes no dataset importam muito: eles podem manter o modal funcional, mas também podem mascarar falta de dados reais da clínica.

## Escopo e branch

- Branch: `modularizacao-segura-fase-1`
- Etapa: exclusivamente documental e de leitura
- Sem alteração de código, payload, backend, banco, schema, migrations ou endpoints

## Arquivos analisados

- `frontend/app.js`
- Documentos de auditoria anteriores desta trilha
- `backend` apenas como contexto mínimo para os datasets abastecedores

## Papel de `usersOptions()`

`usersOptions(items, valueField, labelField, selectedValue, placeholder)`:

- recebe uma coleção de itens;
- lê um campo para o valor;
- lê um campo para o rótulo;
- compara o valor atual para marcar `selected`;
- inclui placeholder quando o argumento foi passado;
- retorna uma string com `<option>` concatenados.

### Comportamento direto

- se `placeholder !== undefined`, ele sempre cria uma opção vazia no início;
- se a lista estiver vazia, o retorno pode ser só o placeholder;
- se o item não tiver rótulo, o valor vira rótulo;
- se o valor atual não bater com nenhuma opção, nenhuma opção recebe `selected`.

## Placeholders, defaults e opções dos selects

| Select/campo | Placeholder/default | Fonte das opções | Caso vazio | Caso valor ausente | Risco | Observação |
|---|---|---|---|---|---|---|
| `usersModalTipo` | placeholder vazio (`""`) | `usersTiposCache` | fica com opção em branco ou sem opções úteis, dependendo do cache | cai para o placeholder vazio | médio | o tipo é o select mais sensível à filtragem de `Clínica` |
| `usersModalPrestador` | `<< Nenhum >>` | `usersPrestadoresLookup` | mantém placeholder de nenhum | valor antigo não selecionado, mantendo o placeholder | alto | evita seleção forçada quando o dataset não cobre o vínculo salvo |
| `usersModalUnidade` | `<< Nenhuma >>` | `usersUnidadesLookup` | mantém placeholder de nenhuma | valor antigo não selecionado, mantendo o placeholder | alto | mesmo comportamento do prestador |

## Regras de montagem das options

- `usersPopularModalCombos()` monta os selects chamando `usersOptions()`.
- `usersOptions()` percorre os itens na ordem recebida.
- O valor selecionado é comparado por igualdade textual simples.
- O label usa o campo indicado ou cai para o próprio valor.
- Os placeholders dos vínculos entram explicitamente como primeira option.

## Comportamento do modal com dataset vazio

### Tipo de usuário

- se `usersTiposCache` estiver vazio, o select pode ficar praticamente só com o placeholder vazio;
- o modal continua abrindo;
- isso não bloqueia a interface, mas reduz a utilidade do campo.

### Prestador e unidade

- se os datasets estiverem vazios, os selects continuam com `<< Nenhum >>` e `<< Nenhuma >>`;
- o modal permanece funcional;
- o usuário pode salvar sem vínculo, se o fluxo permitir.

## Comportamento do modal com valor atual ausente do dataset

- se o valor já persistido não existir mais na lista, `usersOptions()` não marca nada como selecionado;
- o select cai no placeholder ou no primeiro item disponível;
- isso pode fazer o vínculo parecer ausente mesmo quando o registro possui valor salvo;
- essa situação é visualmente aceita pela UI, mas é perigosa do ponto de vista operacional.

## Como tipo, prestador e unidade reagem nesses casos

- tipo: depende da lista filtrada de tipos de usuário e pode ficar reduzido a vazio;
- prestador: tende a cair para `<< Nenhum >>` quando o vínculo não é encontrado;
- unidade: tende a cair para `<< Nenhuma >>` quando o vínculo não é encontrado.

## Limite do contrato visual do modal

- `usersPreencherModal()` define o estado textual;
- `usersPopularModalCombos()` define o estado visual dos selects;
- `usersOptions()` fecha o contrato visual final;
- a persistência só começa depois, em `usersSalvarEstrutural()`.

## Riscos de mascarar ausência de dados reais

- o modal pode parecer “correto” mesmo quando o combo veio vazio;
- um vínculo antigo pode sumir visualmente sem sinalização forte;
- o usuário pode acreditar que não há vínculo salvo, quando na verdade o dataset não trouxe a opção;
- isso é especialmente sensível para prestador e unidade, que são partes relevantes do cadastro.

## Pontos mais frágeis

- dependencia de placeholder para manter a usabilidade;
- ausência de destaque quando o valor salvo não aparece no dataset;
- comparação textual simples de `selectedValue`;
- campo tipo sem placeholder explícito útil;
- possibilidade de dataset vazio parecer normal.

## Riscos críticos

- mascarar vínculo persistido como se ele não existisse;
- permitir abertura do modal em estado visualmente incompleto sem alerta;
- perder a confiança do usuário no vínculo de prestador/unidade;
- tratar ausência de dataset como ausência legítima de vínculo;
- confundir estado visual com estado persistido.

## O que não deve ser modularizado ainda

- `usersOptions()` isolada do contexto do modal;
- placeholders fora do contrato visual dos selects;
- selects de tipo/prestador/unidade separados da lógica de preenchimento;
- qualquer tentativa de separar essa microparte sem manter a relação com `usersPreencherModal()` e `usersPopularModalCombos()`.

## Avaliação explícita do domínio

O frontend administrativo de usuários já está maduro o suficiente para planejar a primeira separação real no futuro.

Mas, para execução funcional imediata, ainda não está maduro o bastante: a função de opções e os placeholders continuam sendo a última camada visual de um contrato que ainda depende de carregamento de combos, preenchimento do modal e persistência no mesmo fluxo.

## Próxima etapa recomendada

- Fechar a documentação do domínio administrativo de usuários com uma síntese de separação real planejada, sem executar modularização funcional ainda, usando os contratos já auditados como base.
