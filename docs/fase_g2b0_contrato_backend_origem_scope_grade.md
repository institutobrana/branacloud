# Fase G.2B.0 - Contrato minimo de backend para origem e `scope=grade`

Data: 2026-08-03

## Resultado
- DOCUMENTACAO-CONTRATO DEFINIDA.
- IMPLEMENTACAO AINDA NAO AUTORIZADA.

## Objetivo
Definir o contrato minimo que o backend precisara expor para separar, sem heuristica no frontend, as origens dos simbolos graficos e liberar no futuro a composicao segura da grade principal com `scope=grade`.

## Continuidade
- coluna `origem` ja existe;
- classificacao historica foi consolidada em `docs/fase_g2b1b4_consolidacao_final_dry_run_origens.md`;
- plano reversivel foi criado em `docs/fase_g2b1c0_plano_reversivel_backfill_origem.md`;
- dados permanecem nulos no banco local;
- `scope=grade` ainda nao existe;
- React continua bloqueado para esta decisao;
- a proxima etapa e a implementacao do script sem aplicacao.

## Escopo desta fase
- somente documento de contrato;
- nenhuma alteracao de backend;
- nenhuma alteracao de banco;
- nenhuma migration;
- nenhum seed;
- nenhuma alteracao de frontend;
- nenhum teste;
- nenhum endpoint novo nesta rodada.

## Leitura consolidada do estado atual
- o endpoint atual de listagem e `/cadastros/simbolos-graficos`;
- `scope=catalogo` ja existe e filtra o catalogo oficial;
- `scope=biblioteca` existe no legado e no backend historico, mas mistura categorias e nao serve como contrato seguro de composicao;
- o backend usa `current_user.clinica_id` como filtro de tenant na listagem e nas operacoes mutaveis;
- o modelo `simbolo_grafico_catalogo` possui `clinica_id`, `legacy_id`, `codigo`, `descricao`, `tipo_simbolo`, `tipo_marca`, `bitmap1`, `bitmap2`, `bitmap3`, `icone`, `imagem_custom`, `sobreposicao` e `ativo`;
- o seed oficial deriva do snapshot EasyDental e usa `legacy_id > 0` para itens oficiais;
- o seed complementar inclui itens com `legacy_id = null`, que representam material extra, tecnico ou nao oficial e nao devem ser confundidos com catalogo oficial;
- o backend atual consegue reconhecer simbolo oficial por `legacy_id`, mas nao possui ainda um contrato unico e explicito de origem para todo o universo de registros.

## Problema contratual
Hoje o backend distingue parte do catalogo, mas nao publica um campo de origem suficientemente claro para separar com seguranca:
- catalogo oficial;
- simbolo de usuario;
- seed interno;
- teste ou fixture;
- copia tecnica;
- asset auxiliar;
- item por clinica.

Sem esse contrato, o frontend nao pode compor a grade principal com seguranca, porque a origem real de cada linha dependeria de heuristica.

## Contrato proposto para a origem
O backend futuro deve expor uma origem canonica para cada simbolo, armazenada no proprio registro ou derivada de campos persistentes com regra formal e unica.

### Categorias minimas
- `catalogo_oficial`: item vindo do snapshot oficial EasyDental, reconhecido por `legacy_id > 0` e mantido como sistema.
- `simbolo_usuario`: item criado pelo usuario da clinica, sem `legacy_id` oficial, com tenant proprio.
- `seed_interno`: item inserido por seed tecnico da aplicacao, mas nao pertencente ao catalogo oficial.
- `fixture_teste`: item de teste, auditoria ou massa auxiliar que nao deve compor a grade funcional.
- `copia_tecnica`: item derivado para apoio de migracao, espelhamento ou compatibilizacao.
- `asset_auxiliar`: entrada que existe apenas para servir bitmap, icone ou suporte visual.
- `indefinido`: estado proibido para a composicao da grade principal.

## Onde a origem deve viver
O contrato futuro deve escolher uma unica fonte de verdade para a origem:
- opcao preferencial: coluna explicita no modelo, por exemplo `origem`;
- opcao aceitavel: combinacao formal de `legacy_id`, `clinica_id`, `tipo_simbolo`, `imagem_custom` e uma marca tecnica adicional persistida;
- opcao nao aceitavel: inferencia apenas por nome de arquivo, quantidade de itens, scope legado ou ordem da lista.

## Contrato de `scope=grade`
`scope=grade` deve significar:
- retornar apenas os simbolos compativeis com a grade principal;
- excluir registros de origem indefinida;
- excluir itens de apoio tecnico;
- excluir seeds de teste e fixtures;
- preservar tenant;
- preservar ordenacao estavel;
- devolver um payload pronto para a tela sem heuristica adicional no frontend.

### Regras funcionais do `scope=grade`
- catalogo oficial entra se estiver marcado como compativel com grade;
- simbolo de usuario entra se pertencer a `current_user.clinica_id` e estiver classificado como usuario;
- seed tecnico entra somente se a regra de negocio declarar que ele e material valido para a grade;
- asset auxiliar nao entra, salvo se for explicitamente marcado como componente visual da grade;
- qualquer item sem origem definida nao entra.

## Contrato de resposta
O retorno futuro de `scope=grade` deve expor, no minimo:
- `id`;
- `legacy_id`;
- `codigo`;
- `descricao`;
- `especialidade`;
- `tipo_marca`;
- `tipo_simbolo`;
- `icone`;
- `bitmap1`;
- `bitmap2`;
- `bitmap3`;
- `imagem_custom`;
- `imagem_url`;
- `sobreposicao`;
- `ativo`;
- `clinica_id` quando aplicavel;
- `origem`;
- `eh_oficial`;
- `eh_usuario`;
- `eh_seed`;
- `pode_compor_grade`;

## Contrato de identidade
- `legacy_id` continua sendo a chave historica do EasyDental para o catalogo oficial.
- `codigo` continua sendo a chave visual/funcional do bitmap.
- `clinica_id` continua sendo o tenant de persistencia.
- o contrato futuro nao deve usar apenas `codigo` para decidir origem.
- registros com mesmo `codigo` mas origens distintas precisam de regra de desempate formal.

## Contrato de deduplicacao
- o backend deve ser o unico responsavel por deduplicar itens equivalentes no `scope=grade`;
- o frontend nao deve remover duplicados por conta propria;
- se dois registros colidirem em `codigo`, `descricao` ou bitmap, o backend deve declarar qual prevalece;
- `legacy_id` oficial tem prioridade sobre copia tecnica e sobre registros sem origem.

## Contrato de ordenacao
O `scope=grade` deve sair em ordem estavel e previsivel:
- primeiro, itens oficiais compativeis;
- depois, itens de usuario;
- depois, outros itens explicitamente compativeis;
- sempre com desempate por `descricao`, `codigo` e `id`;
- nunca depender da ordem fisica da tabela.

## Contrato para `imagem_custom`
- `imagem_custom` pode existir sem invalidar o item;
- `imagem_custom` nao define origem sozinho;
- `imagem_custom` pode ajudar a identificar item de usuario, mas nao pode ser o unico marcador;
- o campo precisa continuar no payload porque a fase posterior pode precisar do desenho tardio.

## Contrato para registros oficiais
- todo item oficial deve continuar rastreavel por `legacy_id`;
- o backend deve manter a ligacao com o snapshot oficial;
- um item oficial nao pode ser convertido em usuario pelo frontend;
- o campo de origem deve deixar isso explicito sem depender de heuristica.

## Contrato para simbolos de usuario
- o simbolo de usuario pertence a uma clinica;
- o simbolo de usuario precisa nascer com `clinica_id`;
- o simbolo de usuario nao deve reutilizar a mesma regra dos itens oficiais;
- um simbolo de usuario pode iniciar sem desenho final e completar depois;
- o `scope=grade` deve poder incluir esse item se ele for marcado como compativel.

## Contrato para seed interno
- seed interno nao e sinônimo de catalogo oficial;
- seed interno nao e sinônimo de simbolo de usuario;
- seed interno precisa de marca explicita;
- seed interno pode existir para apoio tecnico sem entrar na grade principal;
- se for compativel com a grade, isso precisa ser declarado no backend.

## Contrato para testes e copias tecnicas
- fixture de teste nao entra na grade;
- copia tecnica nao entra na grade, a menos que seja promovida por regra formal;
- asset auxiliar nao entra na grade como simbolo funcional;
- qualquer excecao precisa ser expressa por origem e permissao do backend.

## Necessidade de migration
- a fase futura provavelmente precisara de migration para registrar a origem de forma explicita;
- se houver backfill, ele deve classificar os registros existentes com base em regras auditaveis;
- o backfill nao deve depender apenas de nome de arquivo;
- nenhuma migracao deve ser executada nesta rodada.

## Futuro contrato de POST
- o POST futuro deve aceitar simbolo sem desenho final;
- o POST futuro deve aceitar classificacao de origem apenas onde isso for permitido;
- o POST futuro nao deve permitir forjar origem oficial;
- o POST futuro deve respeitar tenant e permissao;
- a reativacao do POST fica para fase posterior.

## Futuras acoes
- `Altera`: deve obedecer a origem ja persistida;
- `Elimina`: deve bloquear oficial e registrar regra de exclusao para nao oficiais;
- editor: deve ser consumido somente depois do contrato de origem existir;
- frontend React: deve passar a consumir `scope=grade` somente apos o backend expor esse contrato.

## Matriz minima de validacao futura
- lista com catalogo oficial apenas;
- lista com itens de usuario apenas;
- lista com mistura controlada e ordenacao estavel;
- tenant errado retorna vazio ou bloqueio;
- item indefinido nao aparece;
- item oficial nao pode ser excluido;
- item de usuario pode ser editado e excluido conforme regra;
- imagem ausente continua valida quando a origem permitir.

## Microplano
### G.2B.1
- criar modelo/coluna ou equivalente para origem;
- criar migration aditiva;
- definir constantes de origem.

### G.2B.2
- classificar os registros conhecidos;
- fazer backfill auditavel;
- separar catalogo oficial, usuario, seed interno e auxiliares.

### G.2B.3
- implementar `scope=grade` no backend;
- manter `catalogo` e `biblioteca` sem quebrar contratos antigos;
- adicionar resposta com origem e flags.

### G.2B.4
- validar runtime da API;
- conferir tenant;
- conferir ordenacao;
- conferir exclusao e edicao.

### G.2E.1
- consumir `scope=grade` no React;
- retirar heuristicas do frontend;
- manter o fluxo `Novo` em branco aprovado pela G.1E.

## Decisao
### APROVADO PARA G.2B.1A

Motivos:
- o campo pode ser adicionado de forma aditiva e nullable;
- o projeto ja mostra padrao de colunas simples com `nullable` explicito e indices pontuais;
- nao ha necessidade de decidir o backfill completo para criar o campo;
- `null` resolve com seguranca o estado ainda nao classificado;
- a classificacao completa pode ficar para o dry-run e para o backfill posterior.

### Diretriz de implementacao futura
- criar apenas o campo de origem no model e a migration aditiva;
- nao criar `scope=grade` ainda;
- nao alterar POST ainda;
- nao mover regra para frontend;
- nao endurecer `NOT NULL` nesta primeira etapa.

## Conclusao
O backend atual ja mostra sinais suficientes para reconhecer o catalogo oficial, mas ainda nao entrega um contrato seguro de origem para a grade principal. A fase correta e criar esse contrato primeiro. Somente depois o frontend podera consumir `scope=grade` sem heuristica.
