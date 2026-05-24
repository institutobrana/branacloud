# Fase 2 - Editor de texto - Subetapa 4 - Preparacao documental do primeiro recorte minimo

## 1. Contexto da Fase 2
A Fase 2 continua apos o fechamento parcial da frente Tabela de proteticos e apos a correcao de trilha documentada em torno do commit `ae98032`.

A trilha correta permanece voltada para o Editor de texto, que segue como a proxima frente recomendada da Fase 2.

Esta subetapa e exclusivamente documental e prepara o primeiro recorte minimo futuro antes de qualquer mudanca de codigo, recorte ou modularizacao.

## 2. Frente atual
Frente atual: Editor de texto.

## 3. Tabela de proteticos permanece pausada/consolidada
A Tabela de proteticos permanece pausada/consolidada e nao deve ser reaberta por esta etapa.

Essa frente continua fora do escopo funcional desta subetapa.

## 4. Classificacao comum/core ou especifica
Classificacao preliminar mantida: comum/core.

Justificativa: o Editor de texto continua parecendo transversal e reutilizavel por varias areas profissionais.

Nesta etapa nao sera implementado controle multiarea.

Nao serao alteradas permissoes, perfis, areas profissionais, seeds ou banco.

Qualquer mudanca futura relacionada a multiarea exigira decisao documental propria.

## 5. Referencia a Subetapa 1
A Subetapa 1 foi concluida corretamente no documento:

- `docs/fase_2_editor_texto_subetapa_1_contrato_funcional.md`

Commit de referencia:

- `4839177` - `Documenta contrato funcional do editor de texto`

## 6. Referencia a Subetapa 2
A Subetapa 2 foi concluida corretamente no documento:

- `docs/fase_2_editor_texto_subetapa_2_mapeamento_tecnico.md`

Commit de referencia:

- `32ade5b` - `Mapeia tecnicamente editor de texto`

## 7. Referencia a Subetapa 3
A Subetapa 3 foi concluida corretamente no documento:

- `docs/fase_2_editor_texto_subetapa_3_isolamento_blocos_candidatos.md`

Commit de referencia:

- `8214557` - `Isola blocos candidatos do editor de texto`

## 8. Arquivos lidos

### 8.1 Frontend
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules`

### 8.2 Backend
- `backend/routes/editor_textos_routes.py`
- `backend/main.py`
- `backend/security/permissions.py`

### 8.3 Docs
- `docs/fase_2_editor_texto_subetapa_1_contrato_funcional.md`
- `docs/fase_2_editor_texto_subetapa_2_mapeamento_tecnico.md`
- `docs/fase_2_editor_texto_subetapa_3_isolamento_blocos_candidatos.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/auditoria_fina_editor_textos_editor_puro.md`
- `docs/auditoria_fina_editor_textos_resto_domino.md`
- `docs/auditoria_fina_editor_textos_pdf_assinatura.md`

## 9. Reavaliacao dos candidatos mais seguros da Subetapa 3
Os candidatos mais seguros registrados na Subetapa 3 foram reavaliados como:

- Bootstrap/abertura do Editor de texto
- Listagem/abertura de modelos
- Criar novo texto/modelo
- Mesclagem de campos

Reavaliacao conservadora:

- Bootstrap/abertura do Editor de texto: segue como o candidato mais seguro para o primeiro recorte minimo futuro, desde que o recorte permaneça apenas na orquestracao de entrada e nao atravesse para lock, documento, salvar ou backend.
- Listagem/abertura de modelos: ainda e um bom candidato, mas depende de filtros, carregamento e interacao com lista.
- Criar novo texto/modelo: e viavel, mas se apoia em estado inicial e fluxos de escolha de tipo.
- Mesclagem de campos: e relativamente delimitada, mas ja toca conteudo aplicado ao documento e interacao com variaveis.

## 10. Candidato principal escolhido para primeiro recorte futuro
Candidato principal escolhido: Bootstrap/abertura do Editor de texto.

## 11. Justificativa tecnica da escolha
O Bootstrap/abertura do Editor de texto foi escolhido por ser o ponto mais perifrico e mais adequado para um primeiro recorte minimo.

Ele e o bloco que:

- recebe a acao de entrada do menu;
- identifica se a abertura deve ser standalone;
- prepara a UI basica do editor;
- conduz a navegacao inicial sem tocar diretamente em salvar, PDF, assinatura, model model, cursor ou texto editado;
- permite um recorte futuro de menor superficie do que os blocos de persistencia e edicao rica.

Mesmo assim, esta subetapa registra uma cautela importante: se a abertura continuar dependente demais de globais sensiveis, do shell principal ou de interacoes com lock/heartbeat, a implementacao ainda nao deve ser autorizada e uma nova subetapa documental devera ser criada.

## 12. Escopo exato do futuro recorte

### 12.1 O que entra
O futuro recorte real, se autorizado depois de nova validacao, pode incluir apenas a orquestracao minima de entrada do Editor de texto:

- disparo da abertura pelo menu;
- reconhecimento da rota/parametro de entrada do editor;
- preparacao da estrutura visual minima do painel;
- inicializacao basica da tela de abertura;
- separacao do fluxo de bootstrapping da massa principal do `frontend/app.js`, se isso puder ser feito sem expandir o escopo.

### 12.2 O que nao entra
O futuro recorte real nao deve incluir:

- modo standalone, aba unica, lock e heartbeat;
- toolbar, menus e comandos de formatacao;
- modelo estrutural/document model;
- area contenteditable, cursor, selecao e sincronizacao;
- listagem de modelos;
- abertura de modelos;
- criar novo texto/modelo;
- salvar, salvar como, renomear e excluir;
- mesclagem de campos;
- tabelas;
- imagens;
- regua/layout/configuracao de pagina;
- impressao/exportacao/PDF;
- assinatura/PDF/ponte local;
- assistente de receitas;
- assistente de atestados;
- backend/endpoints;
- permissao, sessao, clinica, usuario;
- qualquer correcao textual, label, placeholder, mensagem visivel ou mojibake.

### 12.3 Funcoes provaveis envolvidas
Funcoes que provavelmente ficariam no eixo do recorte futuro, sem autorizacao de implementacao nesta etapa:

- `editorTextosEnsureUI`
- `editorTextosAbrir`
- `editorTextosAbrirEmAbaUnica`
- `editorTextosIsStandaloneRequest`
- `editorTextosBuildStandaloneUrl`
- `editorTextosAplicarModoStandalone`

### 12.4 Dependencias esperadas
Dependencias esperadas para esse futuro recorte:

- menu do `frontend/index.html`;
- referencias basicas de DOM no `frontend/app.js`;
- estado minimo do shell do frontend;
- leitura de parametro de entrada do editor;
- sem dependencias novas de backend, banco ou permissao.

### 12.5 Arquivos que poderiam ser criados ou alterados em etapa futura
Em uma etapa futura autorizada, poderiam ser avaliados:

- `frontend/app.js`, com separacao minima do bloco de bootstrap;
- eventualmente um helper novo em `frontend/js/modules`, somente se o bootstrap puder ser isolado sem abrir dependencia adicional;
- eventualmente ajustes documentais correlatos, se o recorte exigir registro da nova fronteira.

## 13. Lista explicita do que NAO deve ser tocado no primeiro recorte real
Nao deve ser tocado no primeiro recorte real:

- salvar;
- salvar como;
- renomear;
- excluir;
- PDF;
- exportacao;
- assinatura;
- contenteditable;
- cursor;
- selecao;
- tabela;
- imagem;
- regua;
- layout;
- configuracao de pagina;
- backend;
- endpoints;
- permissao;
- sessao;
- clinica;
- usuario;
- qualquer texto visivel;
- qualquer string com risco de mojibake;
- qualquer regra de multiarea.

## 14. Riscos especificos do recorte escolhido
Mesmo o bootstrap/abertura tem riscos especificos:

- dependencias ocultas de globais no `frontend/app.js`;
- acoplamento com o shell principal do frontend;
- abertura standalone que tambem toca lock/heartbeat;
- quebra do fluxo de inicializacao da interface;
- quebra de navegacao por menu;
- regressao de visibilidade do painel inicial;
- impacto indireto em carregamento de modelos e em status da tela;
- risco textual/mojibake por ser um caminho que conversa com labels e mensagens.

## 15. Medidas de contencao para esses riscos
Para conter esses riscos, o recorte futuro precisa observar:

- delimitacao extrema do bloco antes de mover qualquer linha;
- leitura de dependencias globais antes de qualquer patch;
- manter lock/heartbeat fora do primeiro recorte;
- evitar tocar em carregamento de modelos, salvar ou backend;
- preservar textos e labels sem correcao textual;
- fazer o recorte somente com commit seletivo e leitura de diff antes do commit;
- se houver qualquer duvida sobre dependencia global sensivel, interromper e criar nova etapa documental.

## 16. Critrios minimos para autorizar a futura alteracao de codigo
Antes de qualquer alteracao de codigo, o recorte futuro precisa atender, no minimo, a estes criterios:

- bloco bootstrap isolado com responsabilidade curta e legivel;
- ausencia de dependencia oculta em save, document model, PDF ou assinatura;
- ausencia de dependencia em backend/endpoints;
- ausencia de dependencia em permissao, sessao ou clinica;
- ausencia de impacto em textarea/contenteditable e cursor;
- lista clara de entradas e saidas do bloco;
- teste humano definido para abertura real do editor;
- diff pequeno e auditavel;
- commit seletivo unico e rastreavel;
- confirmacao documental de que nenhuma string visivel sera corrigida.

## 17. Plano de teste humano obrigatorio
Antes de aprovar o futuro recorte, o teste humano obrigatorio deve comecar em:

Ferramentas > Editor de textos

E validar:

- abertura do Editor de textos pelo menu;
- painel principal carregado;
- status inicial visivel;
- modo standalone, mesmo que nao seja parte do primeiro recorte;
- abertura de modelo;
- criacao de novo texto/modelo;
- edicao;
- salvar;
- salvar como;
- renomear;
- excluir quando permitido;
- mesclagem de campos;
- formatacao;
- imagens;
- tabela;
- regua;
- layout/configuracao de pagina;
- impressao/exportacao/PDF;
- assinatura/PDF/ponte local;
- assistente de receitas;
- assistente de atestados;
- uso em prontuario/documentos/modelos, se aplicavel.

## 18. Estrategia de rollback manual conceitual
Se o futuro recorte introduzir regressao, a estrategia conceitual de rollback deve ser manual e controlada, sem usar `reset`, `revert`, `restore` ou `clean`.

O retorno deve seguir esta logica:

- identificar o arquivo e o bloco afetado;
- desfazer somente a alteracao do recorte aprovado;
- preservar o restante da documentacao e o que ja estiver validado;
- registrar o motivo da reversao em documento proprio;
- repetir o teste humano de abertura do Editor de textos antes de qualquer novo passo.

## 19. Proxima subetapa recomendada
Se a leitura futura confirmar que o bootstrap permanece o recorte minimo mais seguro, a proxima subetapa deve ser documental e focada em delimitar o primeiro recorte tecnico com ainda mais precisao.

Se o bootstrap continuar dependente demais de globais sensiveis, a proxima subetapa recomendada deve ser novamente documental, sem autorizacao de codigo.

## Registro para roadmap
- A frente atual continua sendo Editor de texto.
- Tabela de proteticos permanece pausada/consolidada.
- A Subetapa 1 foi concluida no commit `4839177`.
- A Subetapa 2 foi concluida no commit `32ade5b`.
- A Subetapa 3 foi concluida no commit `8214557`.
- Esta Subetapa 4 prepara documentalmente o primeiro recorte minimo.
- O Editor de texto continua classificado preliminarmente como comum/core.
- Nenhum codigo foi alterado.
- Nenhum comportamento foi alterado.
- Nenhuma correcao textual/mojibake foi feita.
- O primeiro recorte real futuro so podera ocorrer se o escopo ficar restrito e testavel.
- Agenda, Conta corrente, Usuarios/Login, Seeds/tabelas padrao e Ficha pessoal continuam fora desta frente.

## Commit seletivo obrigatorio
- Somente o arquivo `docs/fase_2_editor_texto_subetapa_4_preparacao_primeiro_recorte.md` deve entrar no commit.
- Nao usar `git add .`
- Nao usar `git add docs/`
- Usar `git add` seletivo somente para o arquivo criado.
- Confirmar antes do commit que nao ha alteracoes rastreadas indevidas.
- Confirmar depois do commit quais arquivos entraram.

## 20. Confirmacoes finais
Esta etapa e documental.

Nenhum codigo foi alterado.

`frontend/app.js` nao foi alterado.

`frontend/index.html` nao foi alterado.

`frontend/js/modules` nao foi alterado.

`backend` nao foi alterado.

`banco`, `schema`, `migrations`, `seeds` e `endpoints` nao foram alterados.

Nenhum `UPDATE`, `DELETE` ou `INSERT` foi executado.

Nenhum `reset`, `revert`, `restore` ou `clean` foi executado.

Nenhum texto visivel, acento, label, mensagem, placeholder ou string foi corrigido.

A blindagem textual/mojibake foi respeitada.

Os untracked antigos foram preservados.

O unico arquivo criado/modificado nesta etapa foi:

- `docs/fase_2_editor_texto_subetapa_4_preparacao_primeiro_recorte.md`
