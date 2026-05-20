# Auditoria fina documental — Editor de Textos fora do pipeline de PDF

## 1. Resumo executivo

Esta auditoria fina cobre o restante do domínio Editor de Textos, excluindo o pipeline já auditado de exportação, preparação e assinatura de PDF. O foco aqui é o que sobra como editor funcional principal: abrir modelos, listar modelos, carregar campos de mesclagem, salvar conteúdo, renomear/excluir modelos, mesclar conteúdo com variáveis e interagir com os assistentes de receita e atestado.

A leitura consolidada mostra que existe um núcleo relativamente claro de “editor puro” para modelos de documento, mas esse núcleo ainda é misturado com assistentes clínicos, paciente, cirurgião e regras de mesclagem. O editor não é apenas um editor rico: ele também é um motor de modelos, merge e apoio clínico.

## 2. Escopo e branch

- Branch confirmada: `modularizacao-segura-fase-1`
- Projeto: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Etapa: exclusivamente documental e de leitura
- Nenhuma alteração de código foi feita

## 3. Arquivos analisados

Frontend:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules`
- `frontend/js/utils`

Backend:

- `backend/routes/editor_textos_routes.py`
- `backend/main.py`
- `backend/routes`

Contexto documental anterior:

- `docs/auditoria_fina_editor_textos_pdf_assinatura.md`
- `docs/auditoria_fina_requestjson_tipos_transporte.md`
- `docs/auditoria_fina_requestjson.md`
- `docs/auditoria_requestjson_categorias_uso.md`
- `docs/matriz_mestre_prioridade_risco_refatoracao.md`

## 4. Funções/blocos do frontend envolvidos

Blocos que pertencem ao editor fora do pipeline de PDF:

- `editorTextosAbrir()`
- `editorTextosAbrirEmAbaUnica()`
- `editorTextosIsStandaloneRequest()`
- `editorTextosIniciarLockStandalone()`
- `editorTextosCarregarModelos()`
- `editorTextosAbrirModelo()`
- `editorTextosAbrirModalAbrir()`
- `editorTextosAbrirModalNovo()`
- `editorTextosSalvarAtual()`
- `editorTextosSalvarComoAtual()`
- `editorTextosConteudoParaSalvar()`
- `editorTextosMesclarConteudoAtual()`
- `editorTextosCarregarCampos()`
- `editorTextosOpenContextoRenomearSelecionado()`
- `editorTextosOpenContextoExcluirSelecionado()`
- `editorTextosOpenContextoMostrarPropriedades()`
- `editorTextosRenderListaAbertura()`
- `editorTextosNovoDocumento()`
- `editorTextosAssistReceitasAbrir()` e fluxos de assistente correlatos
- `editorTextosAssistAtestadoAbrir()` e fluxos de assistente correlatos

## 5. Menus, telas, modais e ações identificados

### Menus / ações

- `abrir`
- `novo`
- `salvar`
- `salvar-como`
- `imprimir`
- `configurar-pagina`
- `configurar-impressora`
- `sair`
- `desfazer` / `refazer`
- formatação de texto e inserções: negrito, itálico, sublinhado, alinhamento, lista, imagem, tabela, mesclagem

### Telas / modais

- modal de abertura de modelo
- modal de novo documento / novo modelo
- modal de mesclagem de campos
- tela principal do editor
- modo standalone em aba única
- assistente de receitas
- assistente de atestado
- modais de imagem/tabela/página como apoio estrutural do editor

## 6. Fluxos principais do editor fora do pipeline de PDF

### 6.1 Abrir editor / abrir em aba única

1. `editorTextosAbrir()` inicializa a UI, esconde os demais painéis e carrega fontes, modelos e campos.
2. Quando a URL contém `editor_textos=1`, `editorTextosIsStandaloneRequest()` ativa o modo standalone.
3. Nesse modo, `editorTextosIniciarLockStandalone()` cria o lock local de aba única.
4. `editorTextosAbrirEmAbaUnica()` abre a mesma página com parâmetro de standalone.

### 6.2 Listar e abrir modelos

1. `editorTextosAbrirModalAbrir()` chama `editorTextosCarregarModelos()`.
2. `editorTextosCarregarModelos()` lista os modelos disponíveis.
3. O usuário seleciona um item na lista.
4. `editorTextosAbrirModelo()` carrega o conteúdo completo do modelo.

### 6.3 Novo modelo / salvar / salvar como

1. `editorTextosAbrirModalNovo()` abre a criação de novo documento.
2. `editorTextosSalvarAtual()` monta o payload atual do documento.
3. `editorTextosSalvarComoAtual()` força um novo nome e redireciona para `editorTextosSalvarAtual(true, nome)`.
4. O conteúdo é persistido no backend e o editor atualiza o estado local.

### 6.4 Mesclagem de campos

1. `editorTextosCarregarCampos()` busca a lista de campos de mesclagem.
2. `editorTextosMesclarConteudoAtual()` junta o conteúdo atual com os parâmetros de mesclagem.
3. Os assistentes de receita e atestado reutilizam essa capacidade de mesclar.

### 6.5 Renomear / excluir modelo

1. A lista de abertura oferece contexto para item selecionado.
2. O usuário pode renomear o modelo selecionado.
3. O usuário pode excluir modelo, com bloqueio para modelos de sistema.

## 7. Endpoints / rotas envolvidos

### Núcleo do editor

- `GET /editor-textos/modelos`
- `GET /editor-textos/modelos/{modelo_id}`
- `POST /editor-textos/modelos`
- `PUT /editor-textos/modelos/{modelo_id}`
- `PATCH /editor-textos/modelos/{modelo_id}/renomear`
- `DELETE /editor-textos/modelos/{modelo_id}`
- `GET /editor-textos/campos`
- `POST /editor-textos/mesclar`

### Assistentes misturados no domínio do editor

- `GET /editor-textos/assistente-receitas/contexto`
- `GET /editor-textos/assistente-receitas/medicamentos`
- `GET /editor-textos/assistente-atestado/contexto`
- `GET /editor-textos/assistente-atestado/motivos`
- `GET /editor-textos/assistente-atestado/cid`

### Correlatos de abertura / standalone

- fluxo local via `editor_textos=1` na URL, sem endpoint novo, mas com forte impacto na execução

## 8. Payloads aparentes principais

### Salvamento de modelo

- `nome`
- `conteudo`
- `conteudo_formato`
- `tipo_modelo`
- `extensao`
- `pagina_config`

### Mesclagem

- `conteudo`
- `conteudo_formato`
- `paciente_id`
- `cirurgiao_id`
- `extras`
- `preservar_nao_resolvido`

### Assistente de receitas

- parâmetros de query como `medicamentos_limit` e `paciente_id`

### Assistente de atestado

- query com `paciente_id`

## 9. Contratos frontend/backend mais rígidos

1. `GET /editor-textos/modelos` precisa devolver lista de modelos em formato que o frontend consiga ordenar e filtrar.
2. `GET /editor-textos/modelos/{id}` precisa devolver `nome`, `nome_arquivo`, `sistema`, `tipo_modelo`, `extensao`, `conteudo`, `conteudo_formato` e `pagina_config` compatíveis.
3. `POST/PUT /editor-textos/modelos` precisam aceitar o payload do documento e responder com o modelo persistido.
4. `GET /editor-textos/campos` precisa devolver campos e categorias suficientes para a UI de mesclagem.
5. `POST /editor-textos/mesclar` precisa devolver conteúdo final e formato final com preservação do que não foi resolvido.
6. Os assistentes precisam devolver listas e contexto clínico compatíveis com `paciente_id` e com o modelo selecionado.

## 10. Acoplamentos com permissões, sessão, tenant ou outros módulos

### Permissões / sessão

- O backend do editor depende de `get_current_user` e de `require_module_access("configuracao")` no router.
- O editor não é público; ele depende da sessão autenticada.
- O standalone local depende da sessão ativa para funcionar dentro da aplicação.

### Tenant / clínica

- O editor carrega e salva modelos por contexto de clínica.
- O comportamento do modelo atual e do fallback parece depender do escopo da clínica autenticada.

### Outros módulos

- Paciente: presente em `paciente_id` na mesclagem e nos assistentes.
- Cirurgião/prestador: presente em `cirurgiao_id` na mesclagem e nos assistentes.
- Medicamentos: presente no assistente de receitas.
- CID: presente no assistente de atestado.
- Modelo de documento: é o centro do persistir/abrir/listar.

## 11. Delimitação do que parece ser “editor puro”

Pelo que foi visto, o núcleo mais próximo de “editor puro” é:

- abrir o editor
- abrir/fechar modelos
- listar modelos
- criar, salvar, salvar como, renomear e excluir modelos
- carregar campos de mesclagem
- aplicar mesclagem ao conteúdo atual
- manter estado local de documento, formatação e seleção
- modo standalone de aba única

Esse é o eixo mais plausível para separação futura, desde que os assistentes sejam removidos do mesmo recorte.

## 12. Delimitação do que continua misturado com outros domínios

Ainda está misturado com:

- pacientes
- cirurgião/prestador
- medicamentos
- CID
- assistente de receitas
- assistente de atestado
- estado de clínica autenticada
- regras de modelos de sistema versus modelos da clínica

Ou seja: o editor puro existe, mas não está isolado do apoio clínico.

## 13. Pontos mais frágeis

- `editorTextosSalvarAtual()` porque decide entre POST e PUT, faz fallback e trata conflitos de nome.
- `editorTextosAbrirModelo()` porque a estrutura do modelo retornado é central para reconstruir a UI.
- `editorTextosMesclarConteudoAtual()` porque combina conteúdo, formato, paciente, cirurgião e extras.
- `editorTextosCarregarCampos()` porque define a base dos tokens de mesclagem.
- `editorTextosIniciarLockStandalone()` porque o modo de aba única depende de storage local e concorrência entre abas.
- `editorTextosAssistReceitas...` e `editorTextosAssistAtestado...` porque cruzam editor com dados clínicos e paciente.

## 14. Riscos críticos

- quebrar abertura ou salvamento de modelos
- perder compatibilidade entre conteúdo, formato e paginação
- quebrar a mesclagem e o uso de campos
- desalinhar o retorno do backend e impedir reconstrução do documento
- travar o modo standalone por problema no lock local
- confundir o que é modelo de sistema e o que é modelo da clínica
- afetar pacientes, receita ou atestado ao mexer em um editor que ainda está acoplado a esses domínios

## 15. O que não deve ser modularizado ainda

Não modularizar ainda:

- `editorTextosSalvarAtual()`
- `editorTextosSalvarComoAtual()`
- `editorTextosAbrirModelo()`
- `editorTextosCarregarModelos()`
- `editorTextosCarregarCampos()`
- `editorTextosMesclarConteudoAtual()`
- o lock standalone de aba única
- os assistentes de receitas e atestado enquanto continuarem dentro do mesmo pacote funcional
- qualquer separação do editor sem antes isolar o vínculo com paciente, cirurgião, medicamentos e CID

## 16. Lacunas restantes

Ainda faltam auditorias finas para:

- o restante das ferramentas visuais do editor não cobertas aqui
- a lógica de formatação rica e manipulação de DOM, se for candidata a refatoração futura
- as diferenças entre modelos de sistema e modelos de clínica em todos os caminhos de persistência
- os detalhes de compatibilidade do assistente de receitas e do assistente de atestado

## 17. Próxima auditoria fina recomendada

A próxima auditoria fina recomendada é separar o editor puro em si dos assistentes clínicos, ou seja: revisar apenas a parte de edição, listagem, carregamento e salvamento sem receitas, atestados, pacientes, medicamentos ou CID.

## 18. Conclusão

O Editor de Textos possui um núcleo funcional claro, mas ainda não está realmente isolado. A parte mais segura para futura separação é a de modelos e edição; a parte mais sensível e misturada continua sendo a dos assistentes clínicos. Por isso, esta área ainda deve permanecer congelada até o próximo recorte documental.
