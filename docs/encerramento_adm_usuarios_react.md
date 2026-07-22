# Encerramento ADM Usuarios React

Data: 2026-07-22

## Escopo encerrado

A frente `ADM -> Usuarios` no frontend React fica temporariamente encerrada como painel global de supervisao, consulta, suporte e auditoria.

Funcionalidades consolidadas:

- rota `/app/adm/usuarios`;
- item de menu `ADM -> Usuarios`;
- shell global ADM em L, com rail e barra horizontal integrados;
- toolbar visual no padrao Brana Cloud;
- tabela compacta com dados reais de `/superadmin/usuarios`;
- busca backend;
- filtros por coluna;
- ordenacao;
- selecao unica;
- controle de colunas visiveis;
- rodape de tabela;
- botao `Atualizar`;
- botao `Exportar CSV`;
- botao `Ver detalhes`;
- botao `Ver conta`;
- coluna `Online` imediatamente apos `Status`;
- presenca online por `last_seen_at` e `is_online`;
- protecao de usuario sistemico preservada;
- modal `Ver detalhes` somente leitura, compactado e alinhado;
- navegacao `Ver conta` para `ADM -> Clinicas` por `clinica_id`.

## Decisoes funcionais

`ADM -> Usuarios` nao e o painel operacional de usuarios de uma clinica. Ele nao cria, altera, ativa, inativa, redefine senha, muda perfis ou exclui usuarios.

Responsabilidades externas:

- `Nova conta` cria a clinica e o administrador inicial;
- o administrador da clinica gerencia os usuarios da propria conta;
- `Esqueci minha senha` executa recuperacao de senha;
- exclusao de conta permanece pendente e fora de `ADM -> Usuarios`.

## Ver conta

O fluxo `Ver conta` usa exclusivamente `clinica_id` recebido da linha selecionada. O frontend nao procura conta por nome, email, indice visual ou texto aproximado.

O estado de navegacao e transitorio no `App.jsx`:

- origem: `/app/adm/usuarios`;
- destino: `/app/adm/clinicas`;
- payload: `{ selectedClinicId }`;
- consumo: `ClinicsPage` seleciona a clinica por ID exato e consome o estado uma unica vez.

## Ausencia de mutacoes

A frente encerrada nao adiciona POST, PUT, PATCH ou DELETE em `ADM -> Usuarios`.

As operacoes de escrita administrativas permanecem fora deste painel.

## Validacao

Validacoes automatizadas finais:

- testes ADM Usuarios;
- testes `Ver detalhes`;
- testes `Exportar CSV`;
- testes coluna `Online`;
- testes ADM Clinicas relacionados ao consumo de `selectedClinicId`;
- testes de rotas ADM;
- build do frontend React.

Validacao runtime final: aprovada pelo usuario em 2026-07-22.

## Estado documental

Roadmap, matriz de paridade e documentos funcionais foram atualizados para refletir que `ADM -> Usuarios` esta temporariamente concluido e que as acoes mutaveis permanecem fora do escopo.
