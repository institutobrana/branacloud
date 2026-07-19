# Correcao do preview do simbolo grafico em Procedimentos

## Sintoma

No frontend React, em Tabelas -> Procedimentos -> Novo ou Alterar procedimento -> Painel de Cadastro, o preview do simbolo grafico podia exibir o icone de imagem quebrada do navegador.

Exemplo auditado:

- Simbolo: Cirurgia
- Arquivo: `int_cirur.bmp`
- URL errada reconstruida pelo React: `/assets/easy/int_cirur.bmp`
- Resultado da URL errada no dominio principal: `401`, `application/json`
- URL correta retornada pelo backend: `/desktop-assets/easy/int_cirur.bmp`
- Resultado da URL correta: `200`, `image/x-ms-bmp`

## Causa

A funcao `resolveProcedimentoSymbolPreviewCandidates(...)` descartava a URL publica valida retornada em `imagem_url` quando ela continha `/desktop-assets/easy/` e reconstruia caminhos em `/assets/...`. No dominio principal, esses caminhos nao sao o contrato publico dos assets do legado e podem cair em respostas autenticadas JSON.

## Correcao

A prioridade de candidatos passa a ser:

1. `imagem_url` publica valida fornecida pelo backend.
2. Fallback legado estavel em `/desktop-assets/easy/<arquivo>`.
3. Assets empacotados no React sob `/app/assets/...`, apenas como fallback posterior.

URLs publicas validas sao preservadas sem reescrita quando começam com:

- `/`
- `http://`
- `https://`
- `data:image/`
- `blob:`

## Fallback visual

O preview tenta os candidatos em sequencia. Se uma imagem falhar, o componente avanca para a proxima candidata. Se todas falharem ou nao houver arquivo, a tela mostra um placeholder controlado com `Sem imagem`, evitando o icone quebrado do navegador.

O texto alternativo da imagem usa o formato `Simbolo grafico: <descricao>`.

## Testes

Foram previstos e executados testes para:

- preservar `/desktop-assets/easy/int_cirur.bmp` como primeira candidata para Cirurgia;
- preservar URLs `https://`, `data:image/` e `blob:`;
- gerar fallback por `codigo` em `/desktop-assets/easy/`;
- remover duplicatas;
- ignorar campos vazios;
- nao gerar `/react/assets/`;
- nao trocar `/desktop-assets` por `/assets`;
- tentar candidatas em sequencia no componente;
- mostrar placeholder controlado.

## Escopo

Nao houve alteracao de backend, banco, migrations, RDS, ECS, ECR, DNS ou certificado.

## Publicacao futura

A publicacao AWS futura deve ser feita por novo build integrado frontend/backend, nova imagem ECR e nova revisao ECS.

O rollback futuro deve retornar para a task definition vigente no momento do deploy.
