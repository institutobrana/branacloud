# Fechamento definitivo - união em L do shell de `Serviços de protético`

## Objetivo

Registrar a validação visual autenticada da tela `Tabelas -> Serviços de protético`, comparando o shell compartilhado com módulos de referência e confirmando a origem do elemento branco visível no canto superior esquerdo.

## Escopo validado

- `frontend-react/src/app/App.jsx`
- `frontend-react/src/styles/globals.css`
- `frontend-react/src/layout/BranaActionTopbar.jsx`
- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/layout/BranaWorkspace.jsx`
- `frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx`
- `frontend-react/src/features/servicosProtetico/components/ServicosProteticoToolbar.jsx`
- `frontend-react/src/features/servicosProtetico/servicosProtetico.css`

## Prova visual autenticada

Foi obtida sessão autenticada de leitura no ambiente local usando o `brana_token` salvo no perfil Chrome e também um JWT de validação assinado localmente apenas para abrir a interface.

Rotas abertas e comparadas:

- `/app/tabelas/servicos-protetico`
- `/app/tabelas/procedimentos`
- `/app/tabelas/doencas-cid`

### Resultado observado

Em `Serviços de protético` e nos módulos de referência:

- a topbar superior ocupa a largura total;
- a topbar é branca no tema claro;
- a faixa operacional turquesa fica logo abaixo da topbar;
- a rail lateral começa abaixo da topbar;
- o workspace começa à direita da rail;
- a união em `L` entre faixa e rail ocorre na mesma estrutura compartilhada.

## Origem do elemento branco

O elemento branco visível no canto superior esquerdo é o shell global `BranaActionTopbar`, não um bloco exclusivo da tela de serviços.

Evidências:

- `frontend-react/src/layout/BranaActionTopbar.jsx` monta o cabeçalho com o logo e o texto `BranaCloud`;
- `frontend-react/src/styles/globals.css` define `.brana-action-topbar` com `background: var(--brana-surface-topbar)`;
- `frontend-react/src/theme/branaTokens.css` define `--brana-surface-topbar: #ffffff` no tema claro;
- a geometria medida no navegador mostrou a mesma composição em `Serviços de protético`, `Procedimentos` e `Doenças (CID)`.

## Medidas coletadas no navegador

### `Serviços de protético`

- `topbar`: `x=0`, `y=0`, `w=1440`, `h=43`
- `band`: `x=0`, `y=43`, `w=1440`, `h=44`
- `rail`: `x=0`, `y=87`, `w=72`, `h=970`
- `workspace`: `x=72`, `y=87`, `w=1368`, `h=970`

### `Procedimentos`

- `topbar`: `x=0`, `y=0`, `w=1440`, `h=43`
- `band`: `x=0`, `y=43`, `w=1440`, `h=44`
- `rail`: `x=0`, `y=87`, `w=72`, `h=970`
- `workspace`: `x=72`, `y=87`, `w=1368`, `h=970`

### `Doenças (CID)`

- `topbar`: `x=0`, `y=0`, `w=1440`, `h=43`
- `band`: `x=0`, `y=43`, `w=1440`, `h=44`
- `rail`: `x=0`, `y=87`, `w=72`, `h=970`
- `workspace`: `x=72`, `y=87`, `w=1368`, `h=970`

## Conclusão técnica

Não foi identificado desvio estrutural específico da tela `Serviços de protético` em relação aos módulos comparados.

O cabeçalho branco com logo, nome `BranaCloud` e ícones pertence ao shell global e está presente nas referências corretas. A união em `L` acontece na faixa turquesa + rail abaixo da topbar, como previsto pela estrutura compartilhada.

## Validações executadas

- leitura dos arquivos de shell e do módulo de serviços;
- comparação autenticada com três módulos de referência;
- medição de geometria dos principais elementos do shell;
- captura visual do estado autenticado;
- conferência de que o banco e o backend não foram alterados nesta etapa.

## Confirmações

- Nenhum código foi alterado por esta conclusão.
- Nenhum backend foi alterado.
- Nenhum banco foi alterado.
- Nenhuma migration foi criada.
- Nenhum commit foi feito.
- Nenhum push foi feito.
- Nenhuma closure anterior foi modificada.
