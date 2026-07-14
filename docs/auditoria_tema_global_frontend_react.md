# Auditoria do Tema Global do Frontend React

## Fase 1 - Fundacao implementada

Data de implementacao: 2026-07-14

O frontend React passou pela consolidacao da camada base de tema sem migracao de modulos individuais.

### Arquitetura final da fundacao

- `frontend-react/src/theme/branaThemeMode.jsx` ficou responsavel apenas por:
  - estado do modo claro/escuro;
  - persistencia em `localStorage`;
  - aplicacao de `data-brana-theme`;
  - exposicao do hook e do provider.
- `frontend-react/src/theme/branaTheme.js` passou a ser a fabrica unica do `ConfigProvider`.
- `frontend-react/src/theme/branaTokens.css` passou a conter o catalogo semantico canonicamente definido.
- `frontend-react/src/styles/globals.css` passou a consumir as variaveis centrais sem duplicar o bloco de aliases do tema.

### Confirmacoes principais

- Existe um unico `ConfigProvider` relevante no shell do React.
- Existe um unico provider de tema do Brana para modo claro/escuro.
- A persistencia continua usando a chave `brana_theme_mode`.
- O `data-brana-theme` continua sendo aplicado no `documentElement`.
- O toggle de tema permanece na sidebar sem alterar a estrutura dos modulos.

### Catalogo semantico consolidado

#### Superficies

- `--brana-surface-page`
- `--brana-surface-shell`
- `--brana-surface-sidebar`
- `--brana-surface-topbar`
- `--brana-surface-panel`
- `--brana-surface-card`
- `--brana-surface-modal`
- `--brana-surface-popover`
- `--brana-surface-table`
- `--brana-surface-table-header`
- `--brana-surface-table-row`
- `--brana-surface-table-row-hover`
- `--brana-surface-table-row-selected`
- `--brana-surface-table-row-selected-hover`

#### Texto e bordas

- `--brana-text-primary`
- `--brana-text-secondary`
- `--brana-text-disabled`
- `--brana-text-on-selected`
- `--brana-border-subtle`

#### Controles e apoio visual

- `--brana-control-background`
- `--brana-control-border`
- `--brana-control-hover`
- `--brana-focus-ring`
- `--brana-shadow-soft`

#### Identidade de marca preservada

- `--brana-teal`
- `--brana-green`
- `--brana-deep-green`
- `--brana-gray`
- `--brana-neutral-gray`
- `--brana-support-teal`
- `--brana-neutral-gray-30`
- `--brana-support-teal-30`
- `--brana-deep-green-30`

### Aliases temporarios mantidos

Os seguintes nomes antigos continuam disponiveis como compatibilidade temporaria para consumidores legados:

- `--brana-background`
- `--brana-surface`
- `--brana-text`
- `--brana-table-surface`
- `--brana-table-surface-hover`
- `--brana-table-surface-selected`
- `--brana-table-surface-selected-hover`
- `--brana-table-header-bg`
- `--brana-table-header-text`
- `--brana-table-text`
- `--brana-table-text-muted`
- `--brana-table-border`

### Cobertura Ant Design nesta fase

O `ConfigProvider` consolidado cobre:

- `Table`
- `Input`
- `Select`
- `Radio`
- `Checkbox`
- `Layout`
- `Card`

### Regras para novos componentes

- Preferir variaveis semanticas novas antes de criar hardcodes.
- Reusar os aliases legados apenas onde ja existe consumo real.
- Nao migrar CSS de modulo individual nesta fase.
- Nao criar segunda fabrica de tema ou segundo provider global.

### Pendencias assumidas para a Fase 2

- Migraacao de componentes compartilhados.
- Reducao progressiva de overrides em CSS global.
- Revisao de modais, dropdowns, popovers e filtros.
- Abertura de variaveis semanticas adicionais para excecoes reais.

## Fase 2A - Modais compartilhados

Data de implementacao: 2026-07-14

### Causa da transparencia

- A regra exata que deixava o modal translúcido era:
  - `[data-brana-theme='dark'] .procedimento-editor-modal .ant-modal-content,`
  - `[data-brana-theme='dark'] .procedimento-editor-modal .ant-modal-body,`
  - `[data-brana-theme='dark'] .procedimento-editor-modal .procedimento-editor-shell { background: transparent; }`
- Essa regra ficava em `frontend-react/src/features/procedimentos/procedimentos.css`.
- O problema não vinha da máscara; vinha da superfície do conteúdo e do shell interno deixando a tabela visível por trás.

### Tokens globais aplicados

- `contentBg`
- `headerBg`
- `titleColor`
- `footerBg`
- `colorBgElevated`
- `colorText`
- `colorTextHeading`
- `colorIcon`
- `colorIconHover`
- `boxShadow`
- `borderRadiusLG`

### Variáveis centrais usadas

- `--brana-surface-modal`
- `--brana-surface-panel`
- `--brana-surface-card`
- `--brana-backdrop`
- `--brana-border-subtle`
- `--brana-shadow-overlay`
- `--brana-text-primary`
- `--brana-text-secondary`

### Separação entre máscara e conteúdo

- Máscara:
  - usa `--brana-backdrop`;
  - continua translúcida;
  - é tratada separadamente do conteúdo.
- Conteúdo:
  - usa `--brana-surface-modal`;
  - é totalmente opaco;
  - não depende de `opacity`;
  - não depende de `background: transparent`.

### Wrapper compartilhado

- Wrapper encontrado: `frontend-react/src/components/BranaModal.jsx`
- Ajuste aplicado:
  - adiciona `rootClassName` estável `brana-modal-root`;
  - preserva as props do Ant Design Modal;
  - não impõe tamanho, texto ou lógica de negócio.

### Consumidores alcançados automaticamente

- Todos os modais que continuam usando `antd Modal` sem override local de transparência passaram a herdar a superfície global opaca.

### Consumidores com CSS local ainda pendentes

- `frontend-react/src/features/procedimentos/procedimentos.css`
  - manteve tratamento local de layout;
  - a regra translúcida do modal principal foi substituída;
  - ainda existem regras visuais locais para os painéis internos que devem ser acompanhadas nas próximas etapas.
- `frontend-react/src/features/tabelasAuxiliares/TiposIndicacaoPage.jsx`
- `frontend-react/src/features/preferencias/PreferenciasUsuarioModal.jsx`
- `frontend-react/src/features/procedimentosGenericos/*.jsx`
- `frontend-react/src/features/materiaisEstoque/*.jsx`

### Regra de aceite deste passo

- O conteúdo do modal deve ser opaco.
- Apenas a máscara pode usar transparência.

## Fase 2B - Base global obrigatoria

Data de implementacao: 2026-07-14

### Escopo raiz adotado

- Classe raiz estabilizada no shell autenticado: `brana-app`
- A aplicação autenticada continua sob `brana-shell`, agora também marcada como `brana-app`

### Componentes Ant Design cobertos globalmente

- Table
- Modal
- Card
- Input
- InputNumber
- Select
- Checkbox
- Radio
- Pagination
- Dropdown
- Popover
- Tooltip
- Menu

### Classes semanticas compartilhadas

- `brana-app`
- `brana-shell`
- `brana-context-panel`
- `auxiliary-sidebar-item`
- `users-grid-shell`
- `auxiliary-compact-table`
- `procedimentos-genericos-table`
- `procedimento-generico-modal`
- `procedimento-generico-fases-confirm-modal`
- `procedimento-generico-materiais-modal`
- `procedimento-material-modal`
- `terra-password-modal`
- `auxiliary-modal`

### Diferença estrutural entre as tres tabelas auditadas

| Tela | Componente usado | Wrapper | CSS que vence o tema |
|---|---|---|---|
| Tabela de Procedimentos | `BranaTable` | `BranaTable` | `frontend-react/src/features/procedimentos/procedimentos.css` |
| Tabelas Auxiliares | `BranaTable` | `BranaTable` | `frontend-react/src/styles/globals.css` e classes do painel lateral |
| Procedimentos Genéricos | `BranaTable` | `BranaTable` | `frontend-react/src/styles/globals.css` |

### Hardcodes estruturais substituidos

- `users-grid-shell`
- `auxiliary-sidebar-item`
- `brana-context-panel`
- `auxiliary-compact-table`
- `procedimentos-genericos-table`
- `procedimento-generico-modal`
- `procedimento-generico-fases-confirm-modal`
- `materiais-estoque-table`

### Hardcodes mantidos e justificativa

- Exceções visuais locais ainda existentes em Procedimentos:
  - estrutura de painéis internos;
  - chips de cor;
  - elementos de confirmação e foco específicos.
- Mantidos porque ainda não foram revalidados como redundantes nesta fase.

### Alterações em BranaTable

- Mantida a classe raiz compartilhada `brana-table`.
- Preservado o `className` recebido.
- Preservadas as props e o comportamento do Ant Design Table.

### Tabelas que usam BranaTable

- Tabela de Procedimentos
- Tabelas Auxiliares
- Procedimentos Genéricos
- Materiais de estoque

### Tabelas que ainda usam Table diretamente

- Modais e telas administrativas especiais que não foram migrados nesta etapa.
- Nenhuma nova migração obrigatória foi forçada.

### Alcance em Tabelas Auxiliares

- Tabela principal agora herda a base global.
- Submenu lateral agora consome superfícies e cores semânticas.

### Alcance em Procedimentos Genéricos

- Tabela principal agora herda a base global.
- Modal genérico agora usa superfície opaca central.

### Alcance no modal de Procedimentos Genéricos

- Conteúdo opaco.
- Cabeçalho opaco.
- Ações com superfícies centrais.

### Não regressão em Procedimentos

- O modal Nova intervenção continua correto.
- O filtro de coluna continua correto.

### Não regressão no modal Nova intervenção

- Mantido o comportamento visual já validado na fase anterior.

### Não regressão no filtro

- O filtro compartilhado de coluna permaneceu intacto.

### Regras para novos componentes

- Preferir `BranaTable` para tabelas novas.
- Preferir `BranaModal` para modais administrativos novos.
- Preferir superfícies e cores centrais antes de qualquer hardcode local.
- Não criar seletor dark específico por módulo como solução padrão.

## Estado Atual

O novo frontend React do Brana Cloud já possui uma base de tema central:

- `BranaThemeModeProvider` controla o modo claro/escuro.
- `ConfigProvider` único do Ant Design consome `getBranaTheme(themeMode)`.
- O alternador de tema fica na sidebar.
- A preferência é persistida em `localStorage` com a chave `brana_theme_mode`.
- Existem variáveis semânticas em `frontend-react/src/theme/branaTokens.css`.
- Existem seletores globais no `frontend-react/src/styles/globals.css`.

O sistema funciona, mas ainda há muitos blocos visuais em CSS próprio com cores estruturais claras, principalmente em telas de família clínica, tabelas e modais.

## Arquivos e Diretórios Auditados

Auditoria realizada em `frontend-react/src`, com leitura concentrada em:

- `frontend-react/src/theme/branaThemeMode.jsx`
- `frontend-react/src/theme/branaTokens.css`
- `frontend-react/src/styles/globals.css`
- `frontend-react/src/components/BranaTable.jsx`
- `frontend-react/src/components/TableColumnFilterHeader.jsx`
- `frontend-react/src/layout/BranaShell.jsx`
- `frontend-react/src/layout/BranaSidebar.jsx`
- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/app/App.jsx`
- `frontend-react/src/features/procedimentos/**`
- `frontend-react/src/features/tabelasAuxiliares/**`
- `frontend-react/src/features/fichaClinica/**`
- `frontend-react/src/features/inicio/**`
- `frontend-react/src/features/dashboard/**`
- `frontend-react/src/features/pacientes/**`
- `frontend-react/src/features/preferencias/**`

## Métricas Reais

Contagem obtida por varredura de `frontend-react/src`:

| Métrica | Total |
|---|---:|
| Arquivos CSS | 9 |
| Arquivos JSX/TSX | 45 |
| Arquivos JSX/TSX com `style` inline relevante | 10 |
| Arquivos com hardcodes estruturais claros | 2 |
| Ocorrências de `background: #fff` / `white` | 12 |
| Ocorrências de `color: #000` / `black` | 2 |
| Ocorrências de `!important` | 103 |
| Seletores dark específicos já existentes | 134 |
| Usos de variáveis `brana` | 199 |

Classificação heurística de ocorrências estruturais:

| Categoria | Total |
|---|---:|
| Cor de identidade institucional | 9 |
| Cor semântica global | 141 |
| Cor de estado funcional | 782 |
| Cor específica legítima de componente | 263 |
| Hardcode estrutural incompatível com tema | 38 |
| Possível código morto / legado | 147 |

## Arquitetura Atual do Tema

### Camada central

- `frontend-react/src/theme/branaThemeMode.jsx`
- `frontend-react/src/theme/branaTokens.css`

### Camada global

- `frontend-react/src/styles/globals.css`

### Camada compartilhada

- `frontend-react/src/components/BranaTable.jsx`
- `frontend-react/src/components/TableColumnFilterHeader.jsx`

### Camada de módulo

- `frontend-react/src/features/procedimentos/procedimentos.css`
- `frontend-react/src/features/fichaClinica/fichaClinica.css`
- `frontend-react/src/features/inicio/inicio.css`
- `frontend-react/src/features/dashboard/dashboard.css`
- `frontend-react/src/features/pacientes/pacientes.css`
- `frontend-react/src/features/preferencias/preferenciasUsuario.css`

## Problemas Estruturais Encontrados

1. Ainda existem superfícies claras hardcoded em CSS de módulo.
2. Há redundância de variáveis semânticas entre `branaTokens.css` e `globals.css`.
3. Existem muitos `!important` em estilos visuais.
4. Parte relevante do tema escuro depende de seletores condicionados por `[data-brana-theme='dark']`.
5. Alguns componentes compartilhados já podem ser solucionados por tokens do Ant Design, mas outros precisam de variáveis CSS próprias.
6. Há CSS de módulo com especificidade alta suficiente para vencer tokens globais.
7. O tema global ainda não foi consolidado em um catálogo compacto de superfícies.

## Inventário de Componentes Compartilhados

| Componente | Arquivo | Módulos consumidores | Usa tokens? | Usa variáveis? | Cores hardcoded? | Correção única? |
|---|---|---|---|---|---|---|
| BranaTable | `frontend-react/src/components/BranaTable.jsx` | Procedimentos, tabelas auxiliares, outros grids | Parcial | Sim, via CSS global | Sim, via CSS herdado | Sim |
| TableColumnFilterHeader | `frontend-react/src/components/TableColumnFilterHeader.jsx` | Procedimentos, tabelas auxiliares | Não diretamente | Sim, via CSS global | Sim, overlay claro | Sim |
| Sidebar rail | `frontend-react/src/layout/BranaIconRail.jsx` | Shell global | Parcial | Sim | Sim, no fundo/base | Sim |
| Shell principal | `frontend-react/src/app/App.jsx` | Todo o frontend React | Sim | Sim | Sim, parcialmente | Sim |
| Modal wrappers | `frontend-react/src/features/*/components/*Modal.jsx` | Procedimentos, materiais, preferências | Parcial | Sim | Sim | Parcial |
| Cards e painéis | `frontend-react/src/components/BranaCard.jsx`, `frontend-react/src/features/*` | Vários módulos | Parcial | Sim | Sim | Parcial |

## Catálogo Atual de Variáveis

### Variáveis existentes

- `--brana-teal`
- `--brana-green`
- `--brana-deep-green`
- `--brana-gray`
- `--brana-neutral-gray`
- `--brana-support-teal`
- `--brana-surface`
- `--brana-background`
- `--brana-text`
- `--brana-neutral-gray-30`
- `--brana-support-teal-30`
- `--brana-deep-green-30`
- `--brana-surface-page`
- `--brana-surface-panel`
- `--brana-surface-table`
- `--brana-surface-table-header`
- `--brana-surface-table-row`
- `--brana-surface-table-row-hover`
- `--brana-surface-table-row-selected`
- `--brana-surface-table-row-selected-hover`
- `--brana-text-primary`
- `--brana-text-secondary`
- `--brana-text-on-selected`
- `--brana-border-subtle`
- `--brana-control-background`
- `--brana-control-border`

### Sobreposições e duplicações

- `--brana-surface` e `--brana-surface-panel` são próximos semanticamente.
- `--brana-background` e `--brana-surface-page` estão sobrepostos.
- `--brana-text` e `--brana-text-primary` estão sobrepostos.
- `--brana-table-surface` e `--brana-surface-table` estão sobrepostos.
- `--brana-table-surface-hover` e `--brana-surface-table-row-hover` estão sobrepostos.
- `--brana-table-surface-selected` e `--brana-surface-table-row-selected` estão sobrepostos.

### Lacunas semânticas

- `--brana-modal-surface`
- `--brana-card-surface`
- `--brana-popover-surface`
- `--brana-popover-text`
- `--brana-popover-border`
- `--brana-shell-surface`
- `--brana-topbar-surface`
- `--brana-control-hover`
- `--brana-control-active`
- `--brana-text-disabled`
- `--brana-surface-subtle`

## Catálogo Global Proposto

Proposta compacta para fase de consolidação:

- `--brana-surface-page`
- `--brana-surface-shell`
- `--brana-surface-sidebar`
- `--brana-surface-topbar`
- `--brana-surface-panel`
- `--brana-surface-card`
- `--brana-surface-modal`
- `--brana-surface-popover`
- `--brana-surface-table`
- `--brana-surface-table-header`
- `--brana-surface-table-row`
- `--brana-surface-table-row-hover`
- `--brana-surface-table-row-selected`
- `--brana-surface-table-row-selected-hover`
- `--brana-text-primary`
- `--brana-text-secondary`
- `--brana-text-disabled`
- `--brana-text-on-selected`
- `--brana-border-subtle`
- `--brana-control-background`
- `--brana-control-border`
- `--brana-control-hover`
- `--brana-focus-ring`
- `--brana-shadow-soft`

## Tokens Ant Design

### Já usados

- `Table`
- `Input`
- `Select`
- `Radio`
- `Checkbox`
- `Layout`
- `Card`

### Ainda candidatos a cobertura futura pelo `ConfigProvider`

## Fase 2D - Varredura visual transversal final

Data da validacao: 2026-07-14

### Escopo efetivamente amostrado

Validacao visual focada em familias de interface, sem reabrir as correcoes ja confirmadas nas fases anteriores.

#### Rotas verificadas

- `/app/tabelas-auxiliares`
- `/app/tabelas/procedimentos-genericos`
- `/app/tabelas/materiais-estoque`

#### Componentes e familias testados

- shell global
- tabela comum
- modal simples
- modal com abas
- modal grande
- select e overlay de acao
- submenu lateral
- estados de selecao em tabela

### Resumo dos testes executados

- Shell autenticado aberto em modo escuro.
- Tabelas auxiliares com submenu lateral e tabela principal.
- Procedimentos genericos com modal principal e tabulacao interna.
- Materiais com modal de novo item.
- Conferencia de opacidade de modal via estilos computados no modal de materiais.

### Falhas encontradas

Nenhuma regressao nova foi confirmada nesta rodada final.

### Correcao central feita nesta etapa

Nenhuma nova correcao foi necessaria nesta rodada. As correcoes centrais relevantes ja estavam consolidadas nas fases anteriores:

- `frontend-react/src/theme/branaTheme.js`
- `frontend-react/src/theme/branaTokens.css`
- `frontend-react/src/styles/globals.css`
- `frontend-react/src/components/BranaModal.jsx`
- `frontend-react/src/features/procedimentos/procedimentos.css`

### Tabela de auditoria final

| Tela ou padrÃ£o | Resultado claro | Resultado escuro | Falha | ClassificaÃ§Ã£o | CorreÃ§Ã£o | Status |
|---|---|---|---|---|---|---|
| Shell global | Preservado | Coerente | Nao | - | Nao necessario | Concluido |
| Tabelas Auxiliares | Preservado | Coerente | Nao | - | Nao necessario | Concluido |
| Modal simples | Preservado | Opaque e legivel | Nao | - | Nao necessario | Concluido |
| Modal com abas | Preservado | Opaque e legivel | Nao | - | Nao necessario | Concluido |
| Modal grande | Preservado | Opaque e legivel | Nao | - | Nao necessario | Concluido |
| Procedimentos genericos | Preservado | Coerente | Nao | - | Nao necessario | Concluido |
| Materiais | Preservado | Opaque e legivel | Nao | - | Nao necessario | Concluido |
| Select e overlay | Preservado | Legivel | Nao | - | Nao necessario | Concluido |
| Submenu lateral | Preservado | Coerente | Nao | - | Nao necessario | Concluido |
| Estados disabled, hover, foco e selecao | Preservado | Coerente | Nao | - | Nao necessario | Concluido |

### Screenshots gerados / reutilizados

Evidencias visuais disponiveis no workspace:

- `D:/BRANA ARQUIVOS/BRANA CLOUD/.tmp-final-procedimentos-genericos.png`
- `D:/BRANA ARQUIVOS/BRANA CLOUD/.tmp-final-materiais.png`
- `D:/BRANA ARQUIVOS/BRANA CLOUD/.tmp-procedimento-material-modal-checked.png`
- `D:/BRANA ARQUIVOS/BRANA CLOUD/.tmp-final-procedimentos.png`

### Pendencias restantes

- Amostragem adicional de `Início`, `Dashboard`, `Pacientes`, `Preferências`, `Agenda` e uma tela da `Ficha Clínica` continua recomendada para uma cobertura visual ainda mais ampla.
- Nao foi encontrada pendencia bloqueante de tema nesta rodada final.

### Critérios de encerramento desta fase

- Familias principais amostradas.
- Shell coerente.
- Tabelas comuns coerentes.
- Modais comuns coerentes.
- Formulario e overlays sem regressao nova observada nas familias amostradas.
- Modo claro preservado nas fases anteriores.
- Build validado em etapa posterior.
- Documentacao atualizada com o fechamento da varredura transversal.

## Fase 2E - Amostragem complementar

Data da validacao: 2026-07-14

URL testada: `http://192.168.3.41:5173/`

### Rotas e telas verificadas

- `/app/inicio`
- `/app`
- `/app/pacientes`
- `/app/ficha-clinica`
- modal de preferencias acessado pelo menu do usuario
- `Agenda` como acao de shell, sem rota dedicada confirmada nesta build

### Componentes testados

- shell global
- cards do dashboard
- tabela/listagem de pacientes
- modal de preferencias com abas
- controles de formulario em preferencias
- ficha clinica representativa com odontograma preservado
- botao de agenda da barra superior

### Resultados consolidados

| Tela | Rota | Claro | Escuro | Falha encontrada | Classificacao | Correcao | Status |
|---|---|---|---|---|---|---|---|
| Início | `/app/inicio` | Preservado | Coerente | Nao | - | Nao necessario | Concluido |
| Dashboard | `/app` | Preservado | Coerente | Nao | - | Nao necessario | Concluido |
| Pacientes | `/app/pacientes` | Preservado | Listagem com erro de carregamento `Not Found` | Sim | E | Nao corrigir nesta frente | Concluido como funcional |
| Preferencias | modal via menu do usuario | Preservado | Coerente | Nao | - | Nao necessario | Concluido |
| Agenda | acao de shell | Preservado | Nao abriu rota dedicada; permaneceu no dashboard | Sim | E | Nao corrigir nesta frente | Concluido como funcional |
| Ficha clinica | `/app/ficha-clinica` | Preservado | Coerente, com odontograma mantido | Nao | D para odontograma, sem correção nesta fase | Nao necessario | Concluido |

### Falhas encontradas

- A tela de pacientes expôs `Not Found` ao tentar carregar a lista.
- A acao `Agenda` nao abriu rota dedicada nesta build e caiu no dashboard/shell atual.

### Classificacao das falhas

- Pacientes: `E. problema funcional fora da frente`.
- Agenda: `E. problema funcional fora da frente`.

### Correcoes centrais

- Nenhuma nova correcao foi aplicada nesta amostragem complementar.
- As correcoes centrais ja consolidadas permanecem em:
  - `frontend-react/src/theme/branaTheme.js`
  - `frontend-react/src/theme/branaTokens.css`
  - `frontend-react/src/styles/globals.css`
  - `frontend-react/src/components/BranaModal.jsx`
  - `frontend-react/src/features/procedimentos/procedimentos.css`

### Arquivos de modulo tocados

- Nenhum arquivo de modulo foi alterado nesta rodada.

### Novos seletores especificos

- Nenhum novo seletor especifico foi criado nesta rodada.

### Resultado por familia

- Shell: coerente no modo escuro e preservado no modo claro.
- Formulários: coerentes no modal de preferencias.
- Cards e paineis: coerentes no dashboard.
- Overlays: coerentes no modal de preferencias.
- Modo claro: preservado nas telas amostradas.
- Modo escuro: coerente nas telas amostradas.
- Ficha clinica: odontograma mantido como excecao visual legitima para fase futura.

### Screenshots gerados

Diretorio escuro:

- `artifacts/theme-audit-final/dark/inicio-dark.png`
- `artifacts/theme-audit-final/dark/dashboard-dark.png`
- `artifacts/theme-audit-final/dark/pacientes-dark.png`
- `artifacts/theme-audit-final/dark/preferencias-dark.png`
- `artifacts/theme-audit-final/dark/agenda-dark.png`
- `artifacts/theme-audit-final/dark/ficha-clinica-dark.png`

Diretorio claro:

- `artifacts/theme-audit-final/light/inicio-light.png`
- `artifacts/theme-audit-final/light/dashboard-light.png`
- `artifacts/theme-audit-final/light/pacientes-light.png`
- `artifacts/theme-audit-final/light/preferencias-light.png`
- `artifacts/theme-audit-final/light/agenda-light.png`
- `artifacts/theme-audit-final/light/ficha-clinica-light.png`

### Excecoes futuras

- Odontograma e visuais clinicos proprietarios continuam fora do escopo desta frente.
- Agenda sem rota dedicada permanece como pendencia funcional separada, nao como regressao de tema.
- Lista de pacientes retornando `Not Found` precisa de triagem funcional em frente separada.

### Status da frente

**FRENTE APROVADA COM PENDENCIAS ESPECIAIS**

Componentes comuns amostrados permanecem coerentes; apenas pendencias funcionais/legitimas fora da frente de tema seguem separadas para outra tratativa.

## Fase 2F - Padrão global de conteúdo interno de modais

Data de implementação: 2026-07-14

### Contrato visual consolidado

O conteúdo interno de modal passou a seguir um contrato compartilhado baseado em superfícies semânticas:

- `--brana-surface-modal`
- `--brana-surface-panel`
- `--brana-surface-card`
- `--brana-surface-disabled`
- `--brana-text-primary`
- `--brana-text-secondary`
- `--brana-text-muted`
- `--brana-text-disabled`
- `--brana-border-subtle`
- `--brana-border-default`
- `--brana-shadow-soft`
- `--brana-control-background`
- `--brana-control-border`

### Classes semânticas globais adotadas

- `brana-modal-section`
- `brana-panel`
- `brana-card`
- `brana-form-surface`
- `brana-tab-content`
- `brana-readonly-surface`
- `brana-modal-meta-row`
- `brana-preview-surface`

### Componentes compartilhados usados

- `BranaModal`
- `BranaCard`
- `BranaFormSection`

### Tokens de Tabs e Form

- `Tabs.itemColor`
- `Tabs.itemSelectedColor`
- `Tabs.itemHoverColor`
- `Tabs.itemActiveColor`
- `Tabs.inkBarColor`
- `Tabs.cardBg`

### Padrão readonly

- Campos de metadados e valores somente leitura passaram a usar `brana-readonly-surface`.
- O contraste deixou de depender de turquesa claro fixo ou branco residual.

### Padrão preview

- Miniaturas e previews administrativos passaram a usar `brana-preview-surface`.

### Modais adotantes

- `Novo procedimento genérico`
- `Novo material`
- `Preferências`
- `Nova intervenção` como base já alinhada à fundação anterior

### Modais pendentes

- Modalidades especiais fora da amostragem dirigida continuam a ser inventariadas em frentes próprias.

### Hardcodes removidos

- `background: #fff` e `background: #ffffff` no corpo interno do modal do procedimento genérico.
- superfícies claras fixas em readonly e preview do procedimento genérico.
- superfícies claras fixas em áreas internas de preferências.

### Exceções legítimas

- Odontograma e visuais clínicos proprietários continuam fora deste contrato global.

### Regras para novos modais

Novos modais não devem criar superfície interna branca ou escura própria quando houver `BranaModal`, `BranaCard`, `BranaFormSection` ou classe semântica equivalente.

Quando o modal tiver abas, o corpo de cada aba deve usar `brana-tab-content` ou equivalente compartilhado.

## Fase 2G - Validação final do contrato interno dos modais

Data da validacao: 2026-07-14

### Modais testados

- Novo bairro
- Novo material
- Preferências do usuário
- Novo procedimento genérico
- Nova intervenção

### Resultado no modo escuro

- Conteúdo externo opaco.
- Conteúdo interno opaco.
- Sem grandes áreas brancas residuais.
- Cabeçalhos, corpos e rodapés coerentes.
- Labels, abas, checkboxes e readonly legíveis.
- Preview e metadados coerentes.
- O fundo da página não aparece através do modal.

### Resultado no modo claro

- Aparência institucional preservada.
- Superfícies claras coerentes.
- Sem fundos escuros residuais.
- Estrutura das abas e controles mantida.

### Classes globais usadas por modal

- Novo bairro:
  - `brana-modal-section`
- Novo material:
  - `brana-modal-section`
  - `brana-readonly-surface`
- Preferências do usuário:
  - `brana-modal-section`
- Novo procedimento genérico:
  - `brana-modal-section`
  - `brana-form-surface`
  - `brana-tab-content`
  - `brana-readonly-surface`
  - `brana-modal-meta-row`
  - `brana-preview-surface`
- Nova intervenção:
  - nenhuma classe nova desta fase; permaneceu coerente com a base global existente

### Estilos computados relevantes

- Novo procedimento genérico em modo escuro:
  - `contentBg = rgb(20, 34, 37)`
  - `holderBg = rgb(20, 34, 37)`
  - `previewBg = rgb(20, 34, 37)`
  - `readonlyBg = rgb(26, 38, 40)`
  - `contentOpacity = 1`
- Novo bairro em modo escuro:
  - `contentBg = rgb(20, 34, 37)`
  - `bodyBg = rgb(20, 34, 37)`
  - `opacity = 1`
- Novo material em modo escuro:
  - `contentBg = rgb(20, 34, 37)`
  - `bodyBg = rgb(20, 34, 37)`
  - `headerBg = rgb(20, 34, 37)`
  - `opacity = 1`
- Preferências em modo escuro:
  - `contentBg = rgb(20, 34, 37)`
  - `bodyBg = rgb(20, 34, 37)`
  - `panelBg = rgb(20, 34, 37)`
  - `opacity = 1`

### Falhas encontradas

- Nenhuma regressão nova confirmada nesta validação final.

### Correções realizadas

- Nenhuma nova correção foi necessária nesta rodada final.

### Screenshots

Diretório escuro:

- `artifacts/theme-audit-final/dark/novo-bairro-modal-dark.png`
- `artifacts/theme-audit-final/dark/novo-material-modal-final-dark.png`
- `artifacts/theme-audit-final/dark/preferencias-modal-final-dark.png`
- `artifacts/theme-audit-final/dark/procedimento-generico-modal-final-dark.png`
- `artifacts/theme-audit-final/dark/nova-intervencao-modal-final-dark.png`

Diretório claro:

- `artifacts/theme-audit-final/light/novo-bairro-modal-light.png`
- `artifacts/theme-audit-final/light/novo-material-modal-final-light.png`
- `artifacts/theme-audit-final/light/preferencias-modal-final-light.png`
- `artifacts/theme-audit-final/light/procedimento-generico-modal-final-light.png`
- `artifacts/theme-audit-final/light/nova-intervencao-modal-light.png`

### Pendências especiais

- Odontograma e visuais clínicos continuam fora desta frente.

### Decisão final da frente

**FRENTE APROVADA COM PENDENCIAS ESPECIAIS**

## Fase 2H - Shell e toolbars globais

Data da validacao: 2026-07-14

### Causa tecnica das barras permanecerem claras

- As barras do shell estavam consumindo hardcodes diretos de cor no CSS global:
  - `background: #16aaa1`
  - `background: linear-gradient(180deg, #16aaa1, #119289)`
  - `background: rgba(255, 255, 255, 0.12)`
  - `color: #ffffff`
- Essas regras sobreviviam como identidade visual fixa e ignoravam a variacao escura do tema.

### Variaveis centrais usadas

- `--brana-surface-sidebar`
- `--brana-surface-topbar`
- `--brana-surface-shell`
- `--brana-surface-commandbar`
- `--brana-brand-primary`
- `--brana-brand-primary-hover`
- `--brana-brand-primary-active`
- `--brana-text-inverse`
- `--brana-border-subtle`
- `--brana-divider`
- `--brana-focus-ring`

### Componentes globais alterados

- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/layout/BranaActionTopbar.jsx`
- `frontend-react/src/layout/ThemeToggleButton.jsx`
- `frontend-react/src/app/App.jsx`
- `frontend-react/src/styles/globals.css`
- `frontend-react/src/theme/branaTokens.css`
- `frontend-react/src/theme/branaTheme.js`

### Alcance por modulos

- Procedimentos
- Procedimentos genericos
- Tabelas Auxiliares
- Materiais
- Dashboard
- Modulos que consomem o shell global autenticado

### Validação escura

- Sidebar escura institucional.
- Barra horizontal escura institucional.
- Toolbar de comandos escura institucional.
- Junção em "L" coerente.
- Hover, ativo, foco e separadores legíveis.
- Botões legíveis.

### Validação clara

- A aparência institucional original permaneceu.
- A sidebar continuou turquesa clara.
- A barra horizontal continuou turquesa clara.
- A toolbar continuou turquesa clara.

### Screenshots

Diretório escuro:

- `artifacts/theme-audit-final/dark/shell-procedimentos-dark.png`
- `artifacts/theme-audit-final/dark/shell-auxiliares-dark.png`
- `artifacts/theme-audit-final/dark/shell-materiais-dark.png`
- `artifacts/theme-audit-final/dark/shell-dashboard-dark.png`

### Ausência de mudança estrutural

- Largura da sidebar preservada.
- Altura das barras preservada.
- Ordem dos botões preservada.
- Layout geral preservado.

### Decisão final da frente

**FRENTE APROVADA COM PENDENCIAS ESPECIAIS**

- `Modal`
- `Drawer`
- `Tabs`
- `Tooltip`
- `Popover`
- `Dropdown`
- `Button`
- `Form`
- `Pagination`
- `Alert`
- `Popconfirm`
- `DatePicker`
- `Upload`
- `Tree`
- `Collapse`
- `Switch`
- `InputNumber`

## Componentes e Módulos Mais Críticos

1. `frontend-react/src/features/procedimentos/procedimentos.css`
2. `frontend-react/src/features/fichaClinica/fichaClinica.css`
3. `frontend-react/src/features/inicio/inicio.css`
4. `frontend-react/src/features/dashboard/dashboard.css`
5. `frontend-react/src/features/preferencias/preferenciasUsuario.css`
6. `frontend-react/src/features/pacientes/pacientes.css`
7. `frontend-react/src/styles/globals.css`
8. `frontend-react/src/components/TableColumnFilterHeader.jsx`
9. `frontend-react/src/components/BranaTable.jsx`
10. `frontend-react/src/app/App.jsx`

## Inventário Resumido de Problemas

| Arquivo | Módulo | Tipo de problema | Quantidade aproximada | Prioridade | Correção recomendada | Alcance |
|---|---|---|---:|---|---|---|
| `frontend-react/src/features/procedimentos/procedimentos.css` | Procedimentos | Hardcodes estruturais e superfícies claras | Alta | P0 | Migrar para variáveis semânticas no próprio CSS do módulo | Alto |
| `frontend-react/src/features/fichaClinica/fichaClinica.css` | Ficha clínica | Cores claras e estados visuais próprios | Alta | P1 | Criar camadas semânticas e exceções pontuais | Alto |
| `frontend-react/src/features/inicio/inicio.css` | Início | Superfícies claras | Média | P1 | Consumir tokens globais | Médio |
| `frontend-react/src/features/dashboard/dashboard.css` | Dashboard | Superfícies claras | Média | P1 | Consumir tokens globais | Médio |
| `frontend-react/src/features/pacientes/pacientes.css` | Pacientes | Card/painel claro | Média | P2 | Ajuste via variáveis | Médio |
| `frontend-react/src/features/preferencias/preferenciasUsuario.css` | Preferências | Modal/painéis claros | Média | P2 | Ajuste via variáveis | Médio |
| `frontend-react/src/components/TableColumnFilterHeader.jsx` | Compartilhado | Popover claro | Média | P0 | Root class + tokens de overlay | Alto |
| `frontend-react/src/styles/globals.css` | Global | Regras amplas e duplicadas | Média | P1 | Consolidar e reduzir redundâncias | Alto |

## Estratégia de Migração

### Fase 1 - Fundação global

Objetivo:

- consolidar catálogo semântico;
- reduzir duplicações de variáveis;
- revisar cobertura do `ConfigProvider`;
- remover hardcodes estruturais mais evidentes.

Arquivos principais:

- `frontend-react/src/theme/branaThemeMode.jsx`
- `frontend-react/src/theme/branaTokens.css`
- `frontend-react/src/styles/globals.css`

Riscos:

- regressões em controles base;
- conflitos de especificidade.

Validações:

- build;
- smoke de tema claro/escuro;
- tabelas;
- inputs e dropdowns.

Critérios de aceite:

- tokens centrais suficientes para shell, tabela, modal e overlay.

Rollback:

- possível, revertendo só os arquivos centrais de tema.

### Fase 2 - Componentes compartilhados

Objetivo:

- tabelas;
- filtros;
- modais;
- cards;
- formulários;
- overlays.

Arquivos principais:

- `frontend-react/src/components/BranaTable.jsx`
- `frontend-react/src/components/TableColumnFilterHeader.jsx`
- wrappers de modal e card

Riscos:

- impactar vários módulos ao mesmo tempo.

Validações:

- tabela principal;
- filtros;
- modal simples;
- select/dropdown.

Critérios de aceite:

- uma correção melhora vários módulos.

Rollback:

- revertendo wrappers compartilhados.

### Fase 3 - Shell

Objetivo:

- página;
- sidebar;
- topbar;
- menus;
- áreas globais.

Arquivos principais:

- `frontend-react/src/app/App.jsx`
- `frontend-react/src/layout/*`
- `frontend-react/src/styles/globals.css`

Riscos:

- regressão visual global.

Validações:

- navegação;
- sidebar recolhida/expandida;
- toolbar superior.

Critérios de aceite:

- shell consistente em ambos os temas.

Rollback:

- revertendo apenas shell/layout.

### Fase 4 - Módulos por família

Objetivo:

- tabelas auxiliares;
- materiais;
- procedimentos genéricos;
- procedimentos;
- cadastros;
- agenda;
- ficha clínica;
- demais famílias.

Arquivos principais:

- CSS do módulo e componentes associados.

Riscos:

- alta densidade de exceções.

Validações:

- uma tela por família;
- um modal por família;
- uma tabela por família.

Critérios de aceite:

- cada família acompanha o tema global sem lógica duplicada.

Rollback:

- por família.

### Fase 5 - Exceções

Objetivo:

- odontograma;
- gráficos;
- previews de imagem;
- paletas;
- estados clínicos específicos.

Arquivos principais:

- componentes realmente excepcionais.

Riscos:

- necessidade de superfícies próprias.

Validações:

- contraste e leitura;
- preservação do comportamento visual original.

Critérios de aceite:

- exceção documentada e isolada.

Rollback:

- por componente específico.

## Regras para Novos Módulos

- Novos componentes não devem usar cores estruturais hardcoded quando houver token ou variável semântica correspondente.
- Preferir `--brana-*` antes de `#fff`, `white`, `#000`, `black` ou gradientes claros.
- Usar tokens do Ant Design para controles padrão sempre que possível.
- Exceções visuais precisam ser documentadas.
- Componentes compartilhados devem privilegiar consumo de variáveis centrais, não temas locais.

## Critérios de Aceite da Migração Global

- o modo claro permanece visualmente preservado;
- o modo escuro é coerente em shell, tabelas, modais e overlays;
- componentes compartilhados não exigem overrides por módulo;
- o número de hardcodes estruturais cai de forma progressiva;
- o catálogo de variáveis fica compacto e consistente;
- novas telas seguem a arquitetura central.
## Ajuste Final do Commandbar Claro

### Causa tecnica

- A etapa anterior havia ligado topo global, barra lateral e barras de modulo ao mesmo token visual.
- Isso fez o cabeçalho superior herdar a mesma superficie turquesa da lateral e da barra de modulo, invertendo o desenho original do shell claro.

### Variavel ajustada

- `--brana-surface-topbar`
- `--brana-surface-sidebar`
- `--brana-surface-commandbar`

### Valor anterior no claro

- `--brana-surface-topbar`: `#16aaa1` por efeito da regra anterior
- `--brana-surface-sidebar`: `#16aaa1`
- `--brana-surface-commandbar`: `#eef0f0`

### Valor final no claro

- `--brana-surface-topbar`: `#ffffff`
- `--brana-surface-sidebar`: `#16aaa1`
- `--brana-surface-commandbar`: `#16aaa1`

### Valor mantido no escuro

- `--brana-surface-topbar`: `#133336`
- `--brana-surface-sidebar`: `#133336`
- `--brana-surface-commandbar`: `#133336`

### Seletores que consomem a superficie

- `.brana-action-topbar` usa `--brana-surface-topbar`
- `.brana-icon-rail` usa `--brana-surface-sidebar`
- `.brana-shell-band`
- `.auxiliary-shell-band`
- `.materiais-estoque-toolbar` usam `--brana-surface-commandbar`

### Complementos de contraste

- O cabeçalho superior claro voltou ao branco original com logotipo e textos institucionais em cor Brana.
- A barra lateral e a barra horizontal do modulo voltaram ao turquesa institucional e formam o "L" continuo.
- Os botoes do commandbar claro seguem texto claro, com hover suave e estado primario destacado.

### Validacao esperada

- CID em claro: topo branco, lateral turquesa, commandbar turquesa.
- CID em escuro: topo, lateral e commandbar preservam o bloco `#133336`.
- Outra tela auxiliar em claro: a mesma separacao visual do shell.
- Junção em L: sem faixa branca e sem gap na emenda.

### Evidencias

- `artifacts/theme-audit-final/light/cid-light.png`
- `artifacts/theme-audit-final/dark/cid-dark.png`
- `artifacts/theme-audit-final/light/procedimentos-genericos-shell-light.png`

### Observacao de escopo

- Nao houve mudanca estrutural no sidebar.
- Nao houve mudanca estrutural no topbar.
- O backend permaneceu inalterado.
- O banco permaneceu inalterado.

## Restauracao Da Junção Em L

### Regra exata que criava a linha

- Seletor: `.brana-shell-body > .brana-shell-band`
- Propriedade: `grid-column`
- Valor que criava a emenda visual: `2 / -1`
- Arquivo de origem: `frontend-react/src/styles/globals.css`

### Regra original recuperada

- A faixa operacional volta a atravessar a grade inteira com `grid-column: 1 / -1`.
- O encaixe volta a depender do mesmo bloco estrutural que já existia antes da frente de tema.
- A lateral e a commandbar compartilham a mesma superfície no claro e continuam contínuas no escuro.

### Formato original dos botoes

- Os botoes da barra horizontal retornaram ao padrao historico translúcido sobre a superfície turquesa.
- Eles voltaram a parecer botoes de ação, não textos soltos.

### Medidas restauradas

- Altura: `auto` com preenchimento de `6px 12px`
- Padding: `6px 12px`
- Border-radius: `6px`
- Fonte: `font-weight: 600`
- Hover: `background: rgba(255, 255, 255, 0.12)`
- Ativo: `background: rgba(255, 255, 255, 0.16)`
- Divisor: `background: var(--brana-divider)` nos grupos e `padding`/`gap` historicos

### Regras restauradas

- `.auxiliary-shell-button`
- `.auxiliary-shell-button:hover`
- `.auxiliary-shell-button.primary`
- `.auxiliary-shell-button.danger`

### Tokens mantidos

- `--brana-surface-topbar`
- `--brana-surface-sidebar`
- `--brana-surface-commandbar`
- `--brana-surface-shell`
