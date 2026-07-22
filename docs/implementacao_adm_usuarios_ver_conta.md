# Implementacao ADM Usuarios - Ver conta

Data: 2026-07-22

## Escopo

Foi implementada a acao read-only `Ver conta` na toolbar global de `ADM -> Usuarios`.

A finalidade e permitir que o operador selecione um usuario na listagem global e navegue para `ADM -> Clinicas` com a clinica vinculada ja selecionada.

## Origem e destino

- Origem: `/app/adm/usuarios`.
- Destino: `/app/adm/clinicas`.
- Identificador usado: `clinica_id`, normalizado no frontend como `clinicaId`.

Nao sao usados nome da clinica, e-mail da clinica, posicao visual, indice da linha ou busca textual como criterio principal.

## Mecanismo de navegacao

Foi adotado o mecanismo de navegacao interno ja existente em `App.jsx`, com `onAdminNavigate('adm-clinicas', { selectedClinicId })`.

Justificativa:

- e navegacao interna React pelo controlador proprio do app;
- preserva o historico do navegador;
- nao expoe dado na URL;
- nao cria store global para uma necessidade pontual;
- usa exclusivamente o ID tecnico da clinica.

Ao consumir o estado em `ADM -> Clinicas`, a pagina chama `onConsumeNavigationState()` para limpar o estado transitorio e evitar reaplicacao em loops.

## Toolbar

Ordem final:

1. `Atualizar`
2. `Exportar CSV`
3. `Ver detalhes`
4. `Ver conta`
5. `Buscar usuario`

O botao `Ver conta` usa o mesmo padrao visual da toolbar atual:

- `button type="button"`;
- classe `auxiliary-shell-button`;
- sem icone;
- sem `Button` do Ant Design;
- mesmo agrupador `materiais-estoque-toolbar-actions admin-users-toolbar-actions`.

## Regras de habilitacao

- Sem selecao: desabilitado.
- Durante refresh: desabilitado.
- Usuario selecionado sem `clinica_id` valido: desabilitado.
- Usuario comum com `clinica_id`: habilitado.
- Administrador com `clinica_id`: habilitado.
- Usuario sistemico com `clinica_id`: habilitado.
- Owner com `clinica_id`: habilitado.

## Consumo em ADM Clinicas

`ClinicsPage` le `navigationState?.selectedClinicId`, aguarda a listagem carregar e procura a clinica por ID exato em `clinics.rows`.

Quando encontra:

- limpa filtros locais se eles ocultarem a linha alvo;
- preserva ordenacao e colunas visiveis;
- seleciona a linha com `clinics.setSelectedId(Number(selectedClinicId))`;
- limpa o state da navegacao para evitar repeticao.

Quando nao encontra:

- limpa selecao ativa;
- exibe a mensagem `A conta vinculada a este usuario nao foi encontrada.`;
- nao seleciona outra clinica;
- nao faz fallback por nome ou e-mail.

## Listagem

O limite padrao read-only de `GET /superadmin/clinicas` no frontend React foi elevado para `1000`, que e o maximo aceito pela rota atual, para reduzir o risco de a clinica vinculada nao estar carregada.

Nao foi criado endpoint novo.

## Fora do escopo

Nao foram implementados:

- Novo usuario;
- Alterar usuario;
- Ativar/Inativar;
- Redefinir senha;
- Perfis;
- Excluir usuario;
- mutacoes de clinica;
- backend novo;
- banco;
- migration;
- AWS.

## Validacao automatizada

Testes atualizados/criados cobrem:

- presenca e ordem do botao `Ver conta`;
- classe visual da toolbar;
- desabilitacao sem selecao ou sem `clinica_id`;
- uso de `clinica_id`;
- navegacao para `/app/adm/clinicas`;
- envio de `selectedClinicId` via estado transitorio do `App.jsx`;
- consumo em `ClinicsPage`;
- selecao por ID exato;
- limpeza de filtros locais conflitantes;
- tratamento de clinica nao encontrada;
- ausencia de `POST`, `PUT`, `PATCH` e `DELETE` na frente de Usuarios.

## Runtime

A validacao runtime autenticada local permanece pendente quando nao houver sessao MASTER/Owner ativa no navegador.

## Git

Sem commit e sem push nesta etapa.
