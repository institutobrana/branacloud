# Implementacao - ADM Usuarios - Exportacao CSV

Data: 2026-07-21

## Escopo

Implementada a acao read-only `Exportar CSV` na toolbar global de `ADM -> Usuarios` no frontend React.

Nao foram implementadas acoes mutaveis, modais de escrita, rotas novas, backend, banco, migrations ou alteracoes de autenticacao.

## Endpoint

- Metodo: `GET`.
- Caminho: `/superadmin/usuarios/export.csv`.
- Autenticacao: token Bearer enviado exclusivamente no header `Authorization`.
- Token em URL: proibido e nao utilizado.
- Content-Type esperado: `text/csv; charset=utf-8`.
- Nome de arquivo primario: `Content-Disposition` retornado pelo backend.
- Nome de arquivo fallback: `usuarios-adm-YYYY-MM-DD.csv`.

## Parametros aplicados

A tela React atual usa busca global server-side por `q`. A exportacao envia:

- `q`: busca atual confirmada pelo hook `useAdminUsers`;
- `limit`: `5000`, alinhado ao default do endpoint de exportacao.

Filtros locais por coluna, ordenacao local e selecao unica continuam preservados na tabela, mas nao sao enviados ao backend nesta etapa porque ainda nao existe mapeamento funcional contratado entre todos os filtros locais da tabela React e os parametros server-side do CSV.

## Arquitetura frontend

- Service: `frontend-react/src/features/admin/users/services/adminUsersApi.js`.
- Hook: `frontend-react/src/features/admin/users/hooks/useExportAdminUsersCsv.js`.
- Download seguro: `frontend-react/src/features/admin/users/utils/adminUsersCsvDownload.js`.
- Toolbar: `frontend-react/src/features/admin/users/components/UsersToolbarContent.jsx`.
- Integracao da pagina: `frontend-react/src/features/admin/users/UsersPage.jsx`.

## Regras de seguranca

- A chamada usa somente `GET`.
- O token nao e serializado em URL.
- Respostas `text/html` ou qualquer Content-Type inesperado sao rejeitadas.
- Blob vazio e rejeitado.
- Erros HTTP usam mensagem JSON do backend quando disponivel.
- O nome de arquivo e sanitizado para impedir path traversal, barras, caracteres de controle e extensao diferente de `.csv`.
- O botao possui loading proprio e trava contra duplo clique no hook.

## Dados exportados

O CSV e produzido pelo backend e pode conter dados pessoais como nome, email, email da clinica e CNPJ. Esta etapa nao altera colunas, delimitador ou conteudo do backend.

## Preservacoes

- Tabela de usuarios mantida.
- Filtros por coluna mantidos.
- Ordenacao mantida.
- Selecao mantida.
- Busca global mantida.
- Shell ADM em L mantido.
- Toolbar global mantida.
- Nenhuma acao mutavel foi criada.

## Validacao

- Testes unitarios/estruturais cobrem endpoint, GET autenticado, Content-Type, arquivo vazio, erro HTTP, sanitizacao de nome, ordem da toolbar, loading, trava de duplo clique e ausencia de metodos mutaveis.
- Build React deve permanecer verde antes de encerrar a etapa.
