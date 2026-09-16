# Padronizacao da tabela ADM Clinicas pelo modelo Servicos de Protetico

## Objetivo

Registrar a padronizacao visual e estrutural da tabela `ADM -> Clinicas` no frontend React do Brana Cloude, usando como referencia direta a tabela de `Tabelas -> Servicos de Protetico`.

## Referencia aplicada

- Componente compartilhado de tabela: `frontend-react/src/components/BranaTable.jsx`.
- Cabecalho compartilhado com ordenacao, filtro por coluna e controle de visibilidade: `frontend-react/src/components/TableColumnFilterHeader.jsx`.
- Modelo visual comparado: `frontend-react/src/features/servicosProtetico/components/ServicosProteticoTable.jsx`.
- Toolbar comparada: `frontend-react/src/features/servicosProtetico/components/ServicosProteticoToolbar.jsx`.
- CSS compartilhado dos botoes: `frontend-react/src/styles/globals.css`.
- Altura de rolagem adotada: `480px`, via `ADMIN_CLINICS_TABLE_SCROLL_Y`.
- Linhas e cabecalhos compactos: `32px`.
- Rodape integrado ao frame da tabela, sem titulo intermediario e sem contador solto fora do bloco.

## Contrato visual da toolbar de referencia

- Componente usado: `button` HTML nativo.
- `size`: nao usa prop `size`; a densidade vem do CSS.
- `type`: atributo HTML `type="button"`.
- `className`: `auxiliary-shell-button`, com variacoes `primary` e `danger`.
- Container: `materiais-estoque-toolbar-actions servicos-protetico-toolbar-actions`.
- Altura minima: `28px`.
- Padding horizontal: `10px`.
- Gap entre botoes: `8px`.
- Border-radius: `8px` dentro do container de Materiais.
- Tipografia: `12px`, peso `600`, `line-height: 1`.
- Cor normal: texto `#ffffff`, fundo transparente.
- Hover: fundo `rgba(255, 255, 255, 0.12)`.
- Primario: fundo `rgba(255, 255, 255, 0.16)`.
- Disabled: preserva o mesmo elemento e dimensoes; nao conecta handler quando indisponivel.
- Perigo: usa `auxiliary-shell-button danger`, sem vermelho excessivo e sem chamada destrutiva em Clinicas.

## Aplicacao na toolbar de Clinicas

- `ClinicsToolbarContent.jsx` reutiliza `materiais-estoque-toolbar-actions` e `auxiliary-shell-button`.
- `Atualizar` foi removido da toolbar de Clinicas.
- `+Teste` usa `auxiliary-shell-button primary`, executa a acao real de prorrogar trial e bloqueia clique duplicado.
- `Suspender`, `Demo`, `Mensal`, `Anual`, `Super Admin`, `Novo usuario` e `Excluir` continuam desabilitados e sem escrita.
- `Excluir` usa `auxiliary-shell-button danger`.
- O campo numerico permanece `InputNumber`, compacto, alinhado em `28px`, com `min=1`, `max=3650`, `value=10`, `controls={false}` e vinculo com `+Teste`.
- A busca permanece `Input.Search` no grupo direito.

## Implementacao em ADM Clinicas

- `ClinicsTable.jsx` passou a renderizar `BranaTable` com `TableColumnFilterHeader` em todas as colunas finais.
- A selecao continua sendo unica por radio, preservando a coluna seletora como coluna tecnica nao ocultavel.
- As colunas de dados podem ser ocultadas pelo menu de cabecalho, mas a ultima coluna visivel fica protegida.
- Cada coluna final suporta ordenacao ascendente, descendente e filtro textual local.
- O processamento local fica isolado em `utils/adminClinicsTable.js`.
- O estado da tabela fica isolado em `hooks/useClinicsTableState.js`.

## Colunas padronizadas

- `ID`
- `Clinica`
- `Usuarios`
- `Plano`
- `Trial ate`
- `Status`

Larguras finais:

- `ID`: 76px.
- `Clinica`: 360px.
- `Usuarios`: 100px.
- `Plano`: 130px.
- `Trial ate`: 130px.
- `Status`: 120px.

Ordem dos checkboxes:

- `ID`
- `Clinica`
- `Usuarios`
- `Plano`
- `Trial ate`
- `Status`

## Limites desta fase

- A tabela permanece somente leitura.
- A unica escrita conectada nesta etapa e `PATCH /superadmin/clinicas/{id}/trial-extra` pelo botao `+Teste`.
- Nao ha restauracao dos combos antigos `Status`, `Ativo`, `Plano`.
- Nao ha botao `Limpar filtros` na toolbar global.
- A coluna `Acoes` continua fora desta fase.
- Backend, banco, autenticacao e endpoints nao foram alterados.

## Validacao esperada

- Header de cada coluna com dropdown de ordenacao/filtro/visibilidade.
- Selecao unica preservada por radio.
- Linhas compactas e rolagem vertical semelhantes a `Servicos de Protetico`.
- Rodape integrado informando quantidade visivel e total quando houver filtro.
- Toolbar de Clinicas preservada com controles administrativos desabilitados à esquerda e `Buscar clinica` à direita.
- Toolbar de Clinicas visualmente alinhada ao contrato de botoes de `Servicos de Protetico`.
- Ausencia de `POST`, `PUT`, `PATCH` e `DELETE` na feature de Clinicas.
