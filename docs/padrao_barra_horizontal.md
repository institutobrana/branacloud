# Padrão de Barra Horizontal

Padrão oficial de integração da barra horizontal com a barra lateral no novo frontend React do Brana Cloud.

## Objetivo

Este documento registra o padrão visual e estrutural já validado para barras horizontais de módulos do novo frontend React.

O contrato central é:

- barra lateral;
- barra horizontal;
- L único e contínuo.

A referência visual principal é `Tabelas -> Serviços de Protético`.

A experiência de correção de `Financeiro -> Conta corrente do cirurgião` reforçou os limites desse contrato e deixou lições importantes para próximos módulos.

## Princípio central

O L pertence ao shell global.

A feature não é dona:

- da barra lateral;
- da banda horizontal;
- do offset do painel lateral;
- da geometria do L.

A feature é dona apenas:

- dos botões;
- dos filtros;
- do conteúdo específico da toolbar.

## Árvore de composição padrão

```text
App.jsx
  -> shell global
  -> BranaActionTopbar
  -> brana-shell-band / auxiliary-shell-band
  -> Toolbar da feature
  -> Actions + Filters

Page da feature
  -> conteúdo principal
```

A Page não deve renderizar novamente a toolbar.

## Responsabilidade do App.jsx

`App.jsx`:

- resolve a tela ativa;
- injeta a toolbar correta dentro da banda oficial;
- integra o painel lateral;
- não deve receber lógica de domínio da feature.

NÃO mover fetch, regras financeiras ou lógica de negócio para `App.jsx`.

## Responsabilidade da feature

A feature deve fornecer componentes modulares de toolbar, normalmente separados em:

- `components/NomeModuloToolbar.jsx`
- `components/NomeModuloFilters.jsx`

A toolbar deve conter somente composição visual e callbacks.

Não deve conter:

- fetch;
- regra de negócio pesada;
- tabela;
- modal inteiro;
- shell.

## Classes globais importantes

### `.brana-shell-band`

Faixa horizontal do shell. É a base estrutural onde a toolbar da feature é encaixada.

### `.auxiliary-shell-band`

Variação da banda global usada por módulos auxiliares. Mantém o mesmo papel de faixa oficial.

### `.brana-shell-body.has-panel`

Classe que ajusta a geometria quando o painel contextual está aberto.

### `.brana-action-topbar`

Topbar global do sistema. Não deve ser usada para lógica de domínio da feature.

### `.auxiliary-shell-button`

Padrão base de botões compactos usados em toolbars auxiliares.

## Formação do L

A formação do L ocorre no shell global.

Componentes responsáveis:

- rail lateral;
- banda horizontal;
- grid/offset do body;
- painel contextual;
- classe `.has-panel`.

NÃO criar CSS local da feature para reconstruir o L.

NÃO criar:

- `margin-left` manual;
- `left` manual;
- `position: absolute`;
- segunda sidebar;
- segunda topbar;
- background falso para completar o canto.

## Painel lateral aberto

Quando o painel contextual abre, a geometria deve ser resolvida pelo shell global.

A feature não deve reagir diretamente ao painel aberto com hacks próprios de posicionamento.

Use as regras globais existentes.

## Padrão dos botões

O padrão consolidado é:

- `button` nativo;
- classe `auxiliary-shell-button`;
- textos compactos;
- largura intrínseca ao conteúdo;
- sem width fixa sem necessidade.

Variantes usadas no projeto:

- `primary`
- `danger`

## Ícones

`auxiliary-shell-button` não adiciona ícones automaticamente.

Não existe `+` automático.

Ícones só devem aparecer se forem explicitamente incluídos no JSX.

Se o padrão de referência usa botão textual simples, não adicionar ícones apenas por estética.

Evitar regressões como:

- `+ Novo débito`
- `+ Novo crédito`

quando esse símbolo não faz parte do contrato visual.

## Densidade vertical

O padrão é compacto:

- banda global com padding vertical pequeno;
- botões com padding compacto;
- controles de toolbar com altura aproximada de 30px;
- alinhamento vertical central.

Não criar card ou container alto dentro da banda.

## Filtros inline

Padrão oficial:

```text
LABEL [CONTROLE]
```

E não:

```text
LABEL
[CONTROLE]
```

Exemplos:

- `Protético [combo]`
- `Mês [combo]`
- `Ano [spinbox]`
- `Cirurgião [combo]`
- `Filtro de visualização [combo]`

Isso mantém a barra fina.

## Cor dos labels

Labels dentro da faixa verde devem usar ou herdar texto inverso, preferencialmente:

- `var(--brana-text-inverse)`

Não criar cinza escuro sobre fundo verde.

## Altura dos controles

Referência consolidada:

- `30px`

para selects e inputs da toolbar quando compatível com o componente.

Não aplicar essa regra globalmente fora da toolbar.

## Larguras dos filtros

As larguras devem ser definidas por necessidade do conteúdo.

Exemplos de intenção:

- Mês: compacto
- Ano: compacto
- Cirurgião: intermediário
- Filtro de visualização: maior quando possuir opções longas

Não copiar cegamente a largura de Protético para outros filtros.

## Flex e quebra de linha

No desktop, a toolbar deve permanecer em uma única linha quando houver espaço operacional suficiente.

Regras típicas:

- grupo de ações: `nowrap`
- labels: `white-space: nowrap`

Os filtros podem ter larguras adaptadas, mas não devem aumentar verticalmente a banda sem necessidade.

## Não usar wrap como primeira solução

Não resolver falta de espaço automaticamente usando wrap, porque isso aumenta a altura da banda.

Antes de usar wrap, revisar:

- largura dos filtros;
- gaps;
- conteúdo;
- necessidade real.

## Combo com texto longo

Lição aprendida com o filtro de visualização:

- largura do wrapper e do Select precisam ser compatíveis;
- verificar `flex-shrink`;
- verificar `width` / `min-width` / `max-width`;
- não ajustar apenas `.ant-select` se o wrapper continuar limitando;
- validar valor fechado e dropdown aberto.

## Ant Design Select

Boas práticas locais:

- não alterar CSS global do Ant Design para resolver um único módulo;
- ajustar seletor local da feature;
- verificar `.ant-select`;
- verificar `.ant-select-selector`;
- verificar wrapper;
- verificar popup somente se necessário.

## Spinbox / InputNumber

Quando o contrato exigir spinbox, usar o componente apropriado como `InputNumber` ou equivalente já usado no projeto.

Não substituir por input visual simples.

## Divisor entre ações e filtros

Padrão:

```text
Ações
│
Filtros
```

O divisor deve:

- ficar após o último botão;
- ser visível;
- estar centralizado;
- não aumentar a altura da banda.

Não usar caractere `|` como texto se existe elemento ou classe própria.

## Padrão de modularização

- Toolbar: responsável pela composição.
- Filters: responsável pelos controles.
- Page: responsável pelo conteúdo principal.
- API / Hook: responsáveis pelos dados.
- App.jsx: responsável pela integração ao shell.

Não concentrar tudo em um único componente.

## Não fazer

- criar segunda toolbar;
- criar toolbar dentro da Page se o App já injeta uma;
- criar shell local;
- alterar `globals.css` para corrigir apenas uma feature;
- mexer em `BranaActionTopbar` para resolver um módulo;
- duplicar sidebar;
- usar `margin-left` ou `left` manual para formar L;
- adicionar ícones não previstos;
- criar wrap sem necessidade;
- colocar labels acima dos controles;
- alterar `App.jsx` com lógica de domínio;
- duplicar estado em toolbar e Page;
- usar CSS global para Select específico.

## Checklist para novo módulo

- [ ] Toolbar está dentro da banda oficial?
- [ ] Existe apenas uma toolbar?
- [ ] L é formado pelo shell?
- [ ] App injeta a toolbar?
- [ ] Page não renderiza outra toolbar?
- [ ] Botões usam `auxiliary-shell-button`?
- [ ] Ícones são explícitos?
- [ ] Labels são inline?
- [ ] Labels estão brancos?
- [ ] Controles estão compactos?
- [ ] Divider existe?
- [ ] Toolbar fica em uma linha?
- [ ] Painel aberto não quebra a faixa?
- [ ] Painel fechado não quebra a faixa?
- [ ] 1366x768 validado?
- [ ] 1920x1080 validado?
- [ ] Tema claro validado?
- [ ] Tema escuro validado?
- [ ] Runtime real validado?
- [ ] Screenshot obtido?

## Validação obrigatória em runtime

Build passar não é suficiente para alteração visual.

Sempre validar:

- tela autenticada;
- painel aberto;
- painel fechado;
- 1366x768;
- 1920x1080;
- claro;
- escuro;
- dropdowns;
- spinboxes;
- nenhuma toolbar duplicada;
- nenhum gap no L.

## Referência oficial

Referência visual primária:

- `Tabelas -> Serviços de Protético`

Outros módulos podem adaptar:

- quantidade de botões;
- textos;
- filtros;
- larguras.

Mas não devem alterar o contrato estrutural do shell.

## Lições aprendidas

- segunda toolbar causa regressão;
- shell local causa conflito;
- ícones adicionais mudam densidade;
- labels em coluna aumentam altura;
- wrappers de Select limitam largura;
- ajustes visuais sem runtime não são suficientes.

## Arquivos de referência

- `frontend-react/src/app/App.jsx`
- `frontend-react/src/layout/BranaActionTopbar.jsx`
- `frontend-react/src/styles/globals.css`
- `frontend-react/src/features/servicosProtetico/components/ServicosProteticoToolbar.jsx`
- `frontend-react/src/features/servicosProtetico/components/ProteticoSelect.jsx`
- `frontend-react/src/features/servicosProtetico/servicosProtetico.css`
