# Auditoria fina documental — Editor de Textos: núcleo de editor puro

## Resumo executivo

O núcleo de editor puro do Editor de Textos ainda está concentrado no `frontend/app.js`, com um conjunto relativamente estável de fluxos para abrir o editor, entrar em modo standalone, listar modelos, abrir um modelo, criar novo documento, salvar, salvar como, renomear, excluir e carregar campos de mesclagem.

Este recorte mostra que o editor puro tem fronteiras mais claras do que o domínio completo do Editor de Textos, mas ainda depende de regras de clínica versus sistema, principalmente na ordenação da lista, no bloqueio de exclusão de modelos de sistema e em fallback de salvamento quando há conflito entre modelo de sistema e modelo da clínica.

O backend correspondente está centralizado em `backend/routes/editor_textos_routes.py`, com proteção por `require_module_access("configuracao")` e uso de `get_current_user` para contexto autenticado e de clínica.

## Escopo e branch

- Branch: `modularizacao-segura-fase-1`
- Escopo: somente leitura e documentação
- Sem alterações de código, payload, backend, banco, schema, migrations ou endpoints

## Arquivos analisados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules`
- `frontend/js/utils`
- `backend/routes/editor_textos_routes.py`
- Documentos de auditoria anteriores desta trilha de refatoração

## Fluxos principais do editor puro

| Fluxo/área | Função/bloco | Endpoint/rota | Payload aparente | Regra clínica/sistema | Risco | Observação |
|---|---|---|---|---|---|---|
| Abertura do editor | `editorTextosAbrir()`, `editorTextosIsStandaloneRequest()`, `editorTextosAbrirEmAbaUnica()` | URL com `editor_textos=1` | Sem payload de API no arranque | Standalone força uma aba única e lock local | Médio | Ponto de entrada do editor puro; define estado inicial e visibilidade da UI |
| Modo standalone | `editorTextosIniciarLockStandalone()`, `editorTextosStorageOwnerChanged()`, `editorTextosPerderPosseStandalone()` | Storage local do navegador | Chave local de posse/heartbeat | Regra de aba única para evitar concorrência | Médio | Frágil por depender de storage e sincronização de janela |
| Listagem de modelos | `editorTextosCarregarModelos()`, `editorTextosRenderListaAbertura()` | `GET /editor-textos/modelos` | Sem payload de escrita; resposta com lista | Modelos de sistema aparecem primeiro | Médio | A ordem da lista é uma regra funcional, não só visual |
| Abrir modelo | `editorTextosAbrirModelo(modeloId)` | `GET /editor-textos/modelos/{modelo_id}` | `modelo_id` na rota | `sistema`, `tipo_modelo` e `extensao` orientam o estado | Alto | Recarrega o conteúdo completo e redefine o modelo atual |
| Novo documento/modelo | `editorTextosAbrirModalNovo()`, `editorTextosNovoDocumento()` | Sem rota direta até salvar | Estado local inicial do documento | Pode criar variante nova a partir do modelo atual | Médio | O “novo” prepara o editor; a persistência vem no salvar |
| Salvar | `editorTextosSalvarAtual()` | `POST /editor-textos/modelos` ou `PUT /editor-textos/modelos/{modelo_id}` | `nome`, `conteudo`, `conteudo_formato`, `tipo_modelo`, `extensao`, `pagina_config` | Se o modelo for de sistema, pode ocorrer fallback para modelo da clínica | Alto | É o maior ponto de contrato do editor puro |
| Salvar como | `editorTextosSalvarComoAtual()` | Normalmente `POST /editor-textos/modelos` | Mesmo payload do salvar, com novo nome | Pode gerar novo modelo sem apagar o original | Alto | Sensível a nome, tipo e origem do conteúdo |
| Renomear | `editorTextosOpenContextoRenomearSelecionado()` | `PATCH /editor-textos/modelos/{modelo_id}/renomear` | Novo nome do modelo | Regras de sistema e clínica influenciam o resultado | Médio | Contrato simples, mas dependente de consistência do cadastro |
| Excluir | `editorTextosOpenContextoExcluirSelecionado()` | `DELETE /editor-textos/modelos/{modelo_id}` | `modelo_id` na rota | Modelos de sistema não podem ser excluídos | Alto | Bloqueio de exclusão é uma regra crítica do domínio |
| Campos de mesclagem | `editorTextosCarregarCampos()` | `GET /editor-textos/campos` | Sem payload de escrita | Base de tokens e campos disponíveis ao editor | Médio | Alimenta o editor puro, mas também abre porta para domínios mistos |
| Mesclagem do conteúdo atual | `editorTextosMesclarConteudoAtual()` | `POST /editor-textos/mesclar` | `conteudo`, `conteudo_formato`, `extras`, `preservar_nao_resolvido` | Pode receber extras de clínica/paciente quando usado fora do editor puro | Alto | Fica na fronteira entre editor puro e assistentes clínicos |

## Fluxo de abertura e modo standalone

### Sequência observada

1. A abertura do editor passa por `editorTextosAbrir()`.
2. O modo standalone é detectado por `editorTextosIsStandaloneRequest()`.
3. Se necessário, `editorTextosAbrirEmAbaUnica()` abre o editor em uma janela nomeada.
4. O editor inicializa a UI, carrega modelos e campos e faz o ajuste de estado visual.
5. O lock local de standalone evita múltiplas abas concorrendo pelo mesmo estado.

### Pontos rígidos

- O parâmetro `editor_textos=1` é parte do contrato de entrada do editor standalone.
- O lock local e o heartbeat não são meros detalhes de interface; eles protegem a integridade do estado.
- A janela única é parte do comportamento funcional esperado.

## Fluxo de listagem e abertura de modelos

### Sequência observada

1. `editorTextosCarregarModelos()` consulta a lista de modelos.
2. `editorTextosRenderListaAbertura()` organiza a lista, priorizando modelos de sistema.
3. A seleção de um item chama `editorTextosAbrirModelo(modeloId)`.
4. O backend retorna o conteúdo, metadados, tipo e flags do modelo.
5. O frontend redefine estado, conteúdo atual e campos auxiliares do editor.

### Contratos rígidos

- A lista precisa vir em `data.itens`.
- O modelo aberto precisa devolver campos como `id`, `nome_arquivo`, `sistema`, `tipo_modelo`, `extensao`, `conteudo`, `conteudo_formato` e `pagina_config`.
- A ordenação com `sistema` primeiro é uma regra funcional, não opcional.

## Fluxo de novo, salvar e salvar como

### Sequência observada

1. O comando “novo” limpa o contexto de edição para um novo documento ou modelo.
2. O salvar coleta o conteúdo final com `editorTextosConteudoParaSalvar()`.
3. `editorTextosSalvarAtual()` decide entre `POST` e `PUT` conforme haja modelo existente.
4. `editorTextosSalvarComoAtual()` reutiliza o conteúdo e força novo nome.
5. Após sucesso, a lista é recarregada para refletir o estado persistido.

### Contratos rígidos

- O payload precisa carregar `nome`, `conteudo`, `conteudo_formato`, `tipo_modelo`, `extensao` e `pagina_config`.
- O backend precisa aceitar tanto criação quanto atualização sem quebrar o estado interno do editor.
- Se houver conflito com modelo de sistema, o fallback de salvamento precisa continuar consistente.

## Fluxo de renomear e excluir

### Sequência observada

1. O menu contextual chama o renomeio ou exclusão sobre o modelo selecionado.
2. Renomear usa `PATCH` no endpoint dedicado.
3. Excluir usa `DELETE` no endpoint dedicado.
4. Modelos de sistema não podem ser excluídos.

### Contratos rígidos

- O frontend não pode presumir que todo modelo é deletável.
- O backend precisa preservar a distinção entre sistema e clínica.
- Qualquer mudança nessa regra impacta diretamente a lista, a confirmação visual e o menu de ações.

## Fluxo de campos de mesclagem e mesclagem do conteúdo atual

### Sequência observada

1. `editorTextosCarregarCampos()` busca os campos disponíveis.
2. `editorTextosMesclarConteudoAtual()` monta o conteúdo para mesclagem.
3. O backend devolve o resultado mesclado.
4. O editor pode aplicar o conteúdo retornado ao documento atual.

### Delimitação do editor puro

- No editor puro, os campos de mesclagem representam a base estrutural do conteúdo.
- Quando entram `extras`, `paciente_id` ou `cirurgiao_id`, o fluxo já começa a cruzar com outros domínios.
- Por isso, essa função é um ponto de fronteira e não deve ser tratada como editor puro irrestrito.

## Endpoints e rotas envolvidos

- `GET /editor-textos/modelos`
- `GET /editor-textos/modelos/{modelo_id}`
- `POST /editor-textos/modelos`
- `PUT /editor-textos/modelos/{modelo_id}`
- `PATCH /editor-textos/modelos/{modelo_id}/renomear`
- `DELETE /editor-textos/modelos/{modelo_id}`
- `GET /editor-textos/campos`
- `POST /editor-textos/mesclar`

## Contratos frontend/backend mais rígidos

- Lista de modelos em `data.itens`
- Modelo aberto com metadados completos e conteúdo serializado
- Salvamento com payload que preserve `conteudo`, `conteudo_formato`, `tipo_modelo`, `extensao` e `pagina_config`
- Respeito ao atributo `sistema` para ordenação, exclusão e fallback
- Resposta de mesclagem consistente com o formato esperado pelo editor

## Regras de clínica versus sistema que afetam o editor puro

- Modelos de sistema aparecem primeiro na lista.
- Modelos de sistema não podem ser excluídos.
- O salvamento pode cair em fallback de modelo da clínica quando há conflito com um modelo de sistema.
- `tipo_modelo` e `sistema` orientam decisões do frontend antes de gravar.
- Essas regras são essenciais para o editor puro, mas não significam que o editor esteja isolado do restante do domínio documental.

## Pontos mais frágeis

- `editorTextosSalvarAtual()` por decidir criação, atualização e fallback de sistema.
- `editorTextosAbrirModelo()` por reconstituir o estado inteiro do editor a partir da resposta.
- `editorTextosMesclarConteudoAtual()` por tocar na fronteira entre editor puro e domínios mistos.
- `editorTextosIniciarLockStandalone()` por depender de armazenamento local e coordenação entre abas.
- A distinção entre sistema e clínica no salvar e no excluir.

## Riscos críticos

- Perder o vínculo entre lista, abertura e salvamento do modelo.
- Quebrar a regra de sistema versus clínica e gravar no local errado.
- Permitir exclusão indevida de modelos de sistema.
- Romper o modo standalone e gerar concorrência de abas.
- Alterar o contrato de conteúdo serializado e quebrar o carregamento do editor.

## O que não deve ser modularizado ainda

- Assistentes clínicos.
- Receitas.
- Atestados.
- Pacientes.
- Medicamentos.
- CID.
- Pipeline de PDF.
- Ponte local e certificado.
- Regras de fallback que dependem de sistema versus clínica sem auditoria adicional.

## Lacunas restantes

- Auditoria fina do toolbar e da serialização visual do editor puro.
- Auditoria fina do formato interno de `conteudo_formato`.
- Auditoria fina das transições entre modelo de sistema e modelo da clínica no salvamento.
- Auditoria fina das regras de mesclagem quando o editor puro recebe dados de fora.

## Próxima auditoria fina recomendada

- Auditoria fina do toolbar, da serialização estrutural do conteúdo e das regras de persistência visual do editor puro, mantendo fora os assistentes clínicos e o pipeline de PDF.
