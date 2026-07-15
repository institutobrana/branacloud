# Roadmap - Plano de Contas no Frontend React

## Objetivo

Registrar a sequencia segura de implementacao do modulo `Plano de contas` no React sem quebrar o contrato confirmado.

## Estado atual

- O shell e a rota do modulo ja estao integrados.
- A listagem de grupos e categorias ja usa o backend atual.
- A criacao e edicao de grupos foram implementadas de forma modular.
- A persistencia de grupos foi validada em teste backend isolado.
- A criacao e edicao de categorias foram implementadas de forma modular.
- A persistencia de categorias foi validada em teste backend isolado.
- A exclusao continua bloqueada como frente funcional futura: categoria depende de regra de uso/migracao e grupo depende de bloqueio por categorias vinculadas, sem migracao de grupo confirmada.
- A auditoria historica foi consolidada em contrato especifico de exclusao e migracao, sem transformar isso em implementacao ainda.

## Atualização de status

- O frontend React já implementa o modal de migração para o caso `409` de categoria em uso.
- A exclusão simples e a migração de categoria agora estão separadas em fluxos distintos e testados.
- A migração de grupo continua fora do contrato.
- A validacao pratica do modal legado fechou o comportamento de categoria em uso: destino pode estar em outro grupo, o combo nao mostra a origem e a operacao continua pendente de implementacao no React.
- O checklist tecnico de implementacao da futura exclusao de categoria foi criado como plano seguro para a proxima fase documental.

## O que permanece fora desta etapa

- CRUD de categorias
- Exclusao com migracao
- Alteracoes em backend, banco ou frontend legado
- Mudancas globais no shell fora do modulo
- Uso de base principal para dados descartaveis

## Estrutura modular adotada

- pagina orquestradora
- toolbar do shell
- painel de grupos
- tabela de grupos
- painel de categorias
- tabela de categorias
- modal de grupo
- camada de API
- mapeadores e selecao

## Validacoes previstas

- Carregamento inicial
- Criacao de grupo
- Edicao de grupo
- Preservacao de selecao apos salvar
- Bloqueio visual do alterar quando nenhum grupo e elegivel
- Trilha de eventos do shell mantida por padrao ja existente em outros modulos
- Criacao de categoria
- Edicao de categoria
- Preservacao de categoria apos salvar

## Validacao segura executada

- POST e PUT foram confirmados em backend isolado.
- O schema de teste foi criado apenas para `clinicas`, `usuarios` e `grupo_financeiro`.
- O teardown removeu os dados de teste ao final.
- A base principal nao recebeu dados descartaveis.
- POST e PUT de categoria foram confirmados em backend isolado.
- O schema de teste de categoria incluiu `categoria_financeira`.
- A regra de exclusao confirmada permanece distinta por entidade: categoria migra quando em uso; grupo apenas bloqueia quando ainda possui categorias.
- O contrato especifico de exclusao e migracao ja foi fechado documentalmente.
- As pendencias funcionais de destino de categoria ficaram resolvidas documentalmente; a implementacao continua pendente.
- O novo checklist serve como ponte entre o contrato e a futura implementacao.

## Conclusao

A etapa atual fecha o caminho minimo confirmado para `Novo grupo` e `Alterar grupo` no React. Os proximos passos devem seguir apenas depois de nova confirmacao para categorias e acoes destrutivas.

A trilha de exclusao segue como assunto de investigacao/documentacao porque a regra segura foi confirmada para categoria, mas nao existe migracao de grupo confirmada no material auditado.

O contrato funcional geral permanece inalterado, mas agora possui um contrato especifico para exclusao e migracao que serve como fonte de implementacao futura.
