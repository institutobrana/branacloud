# CONTRATO OFICIAL — SHELL PADRÃO DOS MÓDULOS REACT DO BRANA CLOUD

**STATUS: CANÔNICO**
**Versão do contrato:** 1.0
**Última consolidação:** 2026-08-25

Este é o único contrato canônico do shell visual dos módulos React do Brana Cloud. Deve ser consultado sempre que uma feature nova precisar de rota, rail, banda horizontal, toolbar ou área de conteúdo dentro do shell global. Este documento prevalece sobre descrições paralelas do mesmo padrão.

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

## Contrato visual canônico

```text
HEADER GLOBAL
────────────────────────────────────────────────────────────

┌──────────────── BANDA HORIZONTAL DA FEATURE ──────────────
│
│
RAIL                  CONTEÚDO DA FEATURE
│
│
```

O header global branco, o rail lateral e a banda da feature são partes do shell. Rail e banda devem formar visualmente um L único, sem gap, deslocamento ou segunda barra. A banda ocupa a largura útil do shell e é o local oficial para comandos, filtros, combos, spinboxes e navegação da feature.

### Banda vazia

Sem comandos **não significa sem banda**. O contrato é:

```text
sem comandos = banda horizontal vazia, porém preservada
```

Uma banda vazia não pode colapsar em uma linha fina. O mecanismo compartilhado atual é `.auxiliary-shell-band-empty`, com `min-height: 44px`, derivado do padrão de aproximadamente 7px de padding superior + 30px de estrutura útil + 7px de padding inferior. Features não devem copiar `44px` em CSS próprio; devem reutilizar essa classe compartilhada ou a infraestrutura oficial equivalente.

## Elementos oficiais e responsabilidades

| Elemento | Arquivo | Responsabilidade |
|---|---|---|
| `App.jsx` | `frontend-react/src/app/App.jsx` | Resolve tela/rota, menu, active state e injeta a banda da feature no shell. |
| `BranaActionTopbar` | `frontend-react/src/layout/BranaActionTopbar.jsx` | Header global e ações globais da sessão. |
| `BranaIconRail` | `frontend-react/src/layout/BranaIconRail.jsx` | Rail lateral e grupos principais. |
| `BranaContextPanel` | `frontend-react/src/layout/BranaContextPanel.jsx` | Submenu/contexto do grupo ativo. |
| `BranaWorkspace` | `frontend-react/src/layout/BranaWorkspace.jsx` | Área onde o conteúdo da feature é montado. |
| `.brana-shell-band` | `frontend-react/src/styles/globals.css` | Base estrutural da banda. |
| `.auxiliary-shell-band` | `frontend-react/src/styles/globals.css` | Banda oficial de módulos auxiliares, com background, alinhamento e padding. |
| `.auxiliary-shell-band-empty` | `frontend-react/src/styles/globals.css` | Preserva a altura da banda quando não há comandos. |
| `auxiliaryTopBar` | `frontend-react/src/app/App.jsx` | Condições e composição das bandas das features. |

### Separação de responsabilidades

O shell global é responsável por header, rail, banda, geometria, L, offset do painel e posicionamento da workspace. A Page/feature é responsável somente pelo conteúdo funcional, grid, tabela, calendário, formulário, cards, modais e componentes próprios. A Page não controla a geometria global e não reconstrói o L.

Quando houver toolbar real, o fluxo será:

```text
App/Shell
  ↓
brana-shell-band / auxiliary-shell-band
  ↓
Toolbar da feature
```

A toolbar contém composição visual e callbacks. Fetch, regra de negócio e persistência ficam em hooks/services/API da feature. Nunca criar uma toolbar duplicada dentro da Page.

## Shell inicial vazio

Quando a solicitação for somente criar rota + shell, a área de conteúdo deve permanecer vazia. Não adicionar automaticamente título, subtítulo, “Em desenvolvimento”, card, calendário fake, tabela fake, dados fake ou placeholder grande.

O título `Agenda semanal` foi removido da implementação homologada da página vazia porque não faz parte do shell base. Um título só pode existir se fizer parte do desenho funcional aprovado da feature.

## Referências complementares homologadas

Há dois casos de referência para o mesmo contrato estrutural:

```text
Atendimento → Agenda semanal
  → banda oficial vazia, conteúdo vazio

Tabelas → Serviços de Protético
  → banda oficial com toolbar e comandos reais
```

A Agenda não é dona do contrato; ela é apenas a homologação recente do shell vazio. Serviços de Protético é a referência de banda com conteúdo.

## Como solicitar o Shell Padrão em novos módulos

Use exatamente a frase:

```text
Monte o shell padrão com barra horizontal para o módulo <NOME>.
```

Essa solicitação significa:

1. localizar e usar o mecanismo oficial de rota e menu;
2. integrar a feature ao shell global;
3. preservar header global e rail;
4. criar ou ativar a banda horizontal oficial;
5. manter a banda visível mesmo vazia;
6. garantir o L único;
7. manter a área de conteúdo vazia no shell inicial;
8. não criar título provisório;
9. não criar toolbar interna;
10. não implementar comandos ou funcionalidades não solicitados;
11. validar visualmente em runtime quando aplicável.

Se hoje for necessário adicionar uma condição em `auxiliaryTopBar`, ela deve ser localizada em `App.jsx`, como ocorre com as demais features. Não criar registry paralelo, novo sistema de roteamento ou geometria local.

## Checklist oficial de homologação

```text
[ ] Header global preservado
[ ] Rail lateral preservado
[ ] Banda horizontal visível
[ ] Banda com altura padrão
[ ] Banda vazia não colapsa
[ ] Rail + banda formam L único
[ ] Banda ocupa largura útil
[ ] Nenhuma toolbar interna duplicada
[ ] Área de conteúdo vazia no shell inicial
[ ] Nenhum título provisório
[ ] Nenhum dado fake
[ ] Nenhum CSS exclusivo desnecessário
[ ] Menu funciona
[ ] Rota funciona
[ ] Active state correto
[ ] Build passa
[ ] Runtime visual passa quando aplicável
[ ] Console sem erro novo relevante
[ ] Feature de referência não sofreu regressão
```

## Regras de CSS e evolução

- Preferir as classes globais oficiais do shell.
- Não reproduzir a geometria compartilhada em CSS de feature.
- Não usar `!important` ou hacks de posicionamento sem contrato explícito.
- Não alterar altura do rail ou da banda para acomodar uma feature.
- Não criar `height: 44px` específico de módulo.
- Se uma necessidade não couber no contrato, documentá-la antes de alterar o shell global.

## Dívida técnica registrada

O `auxiliaryTopBar` ainda é uma cadeia condicional em `App.jsx`. Esta Fase não cria registry nem refatora o App. Uma futura refatoração poderá centralizar o registro de bandas, desde que preserve este contrato e seja tratada como mudança arquitetural independente.

**CONTRATO SHELL PADRÃO = CANÔNICO**
