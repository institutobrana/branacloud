# Continuidade - Origem dos simbolos graficos

Data: 2026-08-03

## Documento canonico da classificacao
- `docs/fase_g2b1b4_consolidacao_final_dry_run_origens.md`

## Documento canonico do plano de escrita
- `docs/fase_g2b1c0_plano_reversivel_backfill_origem.md`

## Banco
- tabela: `public.simbolo_grafico_catalogo`
- total: `1113`
- origem nula: `1113`
- origem preenchida: `0`

## Estado
- dry-run concluido;
- plano criado;
- backfill nao executado;
- `scope=grade` inexistente;
- React inalterado.

## Proxima etapa
- `G.2B.1C.3.1.1`;
- especificacao operacional da camada apply para ambiente isolado;
- modo padrao read-only;
- `--apply` proibido nesta etapa e na encerrada.

## Encerramento validado
- `G.2B.1C.2` concluiu a geracao do manifesto operacional real em dry-run;
- `G.2B.1C.2.1` concluiu a validacao final e o encerramento formal;
- `G.2B.1C.2.2` concluiu o complemento das provas negativas;
- `G.2B.1C.3.0` aprovou o plano documental de pre-aplicacao;
- `G.2B.1C.3.1.0` criou o contrato tecnico da camada apply;
- checksum, categorias, assinaturas e total foram confirmados em leitura;
- nenhuma escrita foi autorizada.

## Proibido
- UPDATE;
- execucao de apply;
- preenchimento de origem;
- scope=grade;
- React;
- POST;
- Altera;
- editor;
- Elimina.

## G.3A
- G.3A.1 validada em runtime por leitura de codigo, testes direcionados e build do frontend;
- backfill permanece congelado;
- a proxima etapa funcional segue para `G.3B` somente quando o fluxo de alteracao for solicitado.

## G.3B
- fluxo de alteracao implementado no frontend React do modulo `Configuracoes -> Simbolos graficos`;
- botao `Altera` agora recebe estado de selecao e aciona o editor compartilhado em modo de edicao;
- modal compartilhado preserva `origem` e carrega `codigo` / `imagem_custom` quando disponiveis no row resolvido;
- contrato tecnico validado por testes direcionados e `npm.cmd run build`;
- o backfill continua congelado e nao foi tocado nesta etapa.

## G.3C
- fluxo de exclusao implementado no frontend React do modulo `Configuracoes -> Simbolos graficos`;
- botao `Elimina` agora abre confirmacao objetiva com alvo carregado pelo ID selecionado;
- confirma ao endpoint real `DELETE /cadastros/simbolos-graficos/{id}`;
- trata `404` e `409` sem fechar indevidamente a confirmacao quando o backend bloquear;
- apos sucesso, recarrega a grade e limpa a selecao;
- fase aprovada tecnicamente por testes direcionados e build do frontend;
- runtime manual continua pendente, se solicitado.

## G.3D
- homologacao runtime do CRUD basico concluida com execucao assistida no navegador do fluxo `Configuracoes -> Simbolos graficos`;
- a criacao sem desenho persistiu no banco e confirmou o POST real da tela;
- foi detectado e corrigido um `500` de runtime por dependÃªncia de mapper SQLAlchemy nao carregada no backend deste fluxo;
- foi detectado e corrigido um segundo ponto de runtime: o fallback de `codigo` do create precisava respeitar o limite de 30 caracteres do schema;
- a exclusao foi validada no tenant correto apos o registro persistido ser atualizado e removido pela rota do modulo;
- `scope=grade` permanece fora de escopo;
- backfill continua congelado e nao foi reaberto por esta fase.

## G.3D.1
- refresh visual da grade apos create corrigido;
- a listagem `scope=catalogo` passou a incluir simbolos criados pelo usuario com `origem=simbolo_usuario`;
- o create passou a gravar `origem=simbolo_usuario`;
- o POST agora Ã© seguido por GET que devolve o mesmo ID, a linha entra no DOM e fica selecionada;
- `Altera` e `Elimina` passaram a funcionar pela interface no registro criado;
- um simbolo de teste foi removido pela propria UI ao final da validacao;
- a etapa seguinte volta a focar apenas em evolucao funcional incremental, sem backfill, apply ou `scope=grade`.

## G.3D.2
- CRUD visual homologado permanecia valido antes da limpeza;
- residuos de teste confirmados foram removidos pontualmente pelos IDs `1816`, `1817`, `1819`, `1820`, `1821` e `1822`;
- registros incertos foram preservados, sem limpeza ampla;
- nenhuma vinculacao foi encontrada na tabela `simbolo_grafico_catalogo`;
- o banco retornou ao total de `1113` registros, com `origem nula = 1113` e `origem preenchida = 0`;
- a proxima etapa segue para `G.3A`.

## G.3D.3
- a listagem voltou ao contrato estrito: 81 oficiais canonicos + simbolos explicitamente marcados como `simbolo_usuario`;
- `legacy_id IS NULL` deixou de ser criterio automatico de entrada na grade;
- registros tecnicos, seeds, fixtures e copias auxiliares passam a ficar fora da resposta quando nao forem usuarios explicitamente marcados;
- `Novo`, `Altera` e `Elimina` continuam como fluxos validos;
- backfill historico permanece congelado;
- a proxima etapa segue para `G.4A` apenas quando a grade for revalidada.

## G.4A
- editor React 15x15 implementado em primeira versao funcional;
- o modal compartilhado passou a abrir o editor, confirmar PNG e preservar o fluxo de Novo/Altera;
- a grade logica usa 225 celulas com pointer events, lapis, borracha, limpar, confirmar e cancelar;
- a persistencia de `imagem_custom` foi validada em runtime;
- a homologacao visual exigiu ajuste adicional de rodape, botoes, superficies e tema escuro;
- a proxima etapa fica em `G.4A.1` antes de qualquer avance para `G.4B`.

## G.4A.1
- ajuste visual final do modal de `Simbolos graficos` concluido;
- label `Especialidade` homologado sem o sufixo `(botao)`;
- `Sistema` permanece visivel e desabilitado, com `Definido pelo usuario` selecionado;
- a mensagem explicativa permanente foi removida;
- `Ok` e `Cancela` passaram para o rodape geral do modal, fora do painel direito;
- tema claro e tema escuro homologados no estado visual final;
- o editor 15x15 e `imagem_custom` permanecem preservados;
- testes direcionados e build do frontend foram aprovados;
- o ponto de regressao visual ficou documentado e a etapa `G.4A` pode ser considerada concluida;
- a proxima etapa funcional fica liberada para `G.4B`.

## G.4B
- biblioteca-base de simbolos concluida tecnicamente no modal React;
- selecao unica, destaque, preview, editor e limpeza local foram fechados no contrato do modal;
- a base estavel continua vindo do manifesto estatistico de 56 itens em `simboloGraficoEditorBaseLibrary.js`;
- `imagem_custom` continua com prioridade sobre a base selecionada;
- testes direcionados e build do frontend foram aprovados;
- runtime local completo nao foi concluido nesta rodada por bloqueio de autenticacao no preview;
- a fase foi registrada como concluida tecnicamente, com prÃ³xima etapa funcional liberada para `G.5` quando houver validacao runtime.

## G.4B.1
- o botao textual experimental `Limpar` foi removido do fluxo React;
- os contratos documentados de `X` e `Lápis` permaneceram preservados;
- a documentacao de fechamento foi atualizada para refletir a remocao estrita do texto;
- o teste direcionado foi ajustado e o build permaneceu aprovado;
- a continuidade segue em validacao funcional, sem avancar para `G.5` por esta intervencao.

## G.4B.2
- o `X` passou a abrir confirmacao propria e a remover apenas o desenho local associado quando confirmado;
- o `Lápis` passou a abrir o editor React 15x15 com a imagem atual prioritaria;
- a exclusao nao persiste antes do `Ok` do modal principal;
- o cancelamento da confirmacao preserva preview, biblioteca e estado local;
- os testes direcionados e o build permaneceram aprovados;
- a continuidade fica pronta para a proxima validacao funcional, sem retomar backfill ou `scope=grade`.

## G.4C
- G.4C.1 concluiu a normalizacao da especialidade no modal `Altera`;
- G.4C.2 concluiu a normalizacao do preview do desenho no modal `Altera`;
- a cadeia de imagem passou a usar URL normalizada antes do `src`;
- o editor 15x15 permaneceu preservado;
- a proxima etapa funcional continua em `G.4C.3`.

## G.4C.2F
- o preview do modal `Altera` foi corrigido com prova automatizada real no navegador;
- `Aplicação de flúor` passou a exibir a figura correta com `src` resolvível no runtime autenticado;
- `naturalWidth` e `naturalHeight` ficaram maiores que zero no `<img>` real;
- a especialidade permaneceu estabilizada e o editor 15x15 nao foi alterado;
- a continuação funcional segue para `G.4C.3` somente quando o usuário solicitar a próxima validação visual.

## G.4C.2H
- preview homologado tecnicamente permanece como base da consolidacao documental;
- contrato Novo versus Altera esta em consolidacao documental;
- implementacao funcional permanece bloqueada ate aprovacao explicita do usuario;
- a proxima etapa documental proposta e `G.4C.2H.1`, sem alterar codigo.
