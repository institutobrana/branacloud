# Roteiro Operacional - Indices Financeiros

## 1. Objetivo

Definir o roteiro seguro de stage seletivo, inspeção de diff e validação futura para a implementação do modulo `Configuracoes -> Indices financeiros`.

## 2. Regras gerais

- Nao fazer `git add` agora.
- Nao fazer commit agora.
- Nao fazer push agora.
- Nao fazer deploy agora.
- Nao alterar codigo nesta etapa documental.
- Nao limpar o worktree.
- Nao usar este roteiro para misturar outras frentes.

## 3. Estado inicial que deve ser sempre conferido

- diretorio de trabalho;
- raiz real do repositório;
- branch;
- remote origin;
- HEAD completo;
- tracking branch;
- ahead/behind;
- `git status --short`;
- `git status --branch`;
- `git diff --cached --name-only`;
- arquivos untracked desta frente;
- status especifico dos quatro documentos de Indices financeiros.

## 4. Comandos de conferência

### Estado

- `git rev-parse --show-toplevel`
- `git branch --show-current`
- `git remote -v`
- `git rev-parse HEAD`
- `git status --short`
- `git status --branch`
- `git diff --cached --name-only`

### Arquivos desta frente

- `git status --short -- docs/plano_implementacao_indices_financeiros_frontend_react.md docs/matriz_testes_indices_financeiros_frontend_react.md docs/matriz_commits_seletivos_indices_financeiros.md docs/roteiro_operacional_indices_financeiros.md`

### Inspecao de diff

- `git diff -- <caminhos>`
- `git diff --check -- <caminhos>`
- `git diff --cached --check`
- `git diff --cached`

## 5. Regra para worktree sujo

- Preservar tudo integralmente.
- Nao tentar organizar ou limpar o status.
- Stage seletivo apenas por caminho.
- Se um arquivo compartilhado trouxer mudanças misturadas, parar e separar por hunk antes de qualquer stage.

## 6. Arquivos compartilhados de maior risco

- `frontend-react/src/app/App.jsx`
- `frontend-react/src/features/indicesFinanceiros/IndicesFinanceirosPage.jsx`
- `frontend-react/src/features/indicesFinanceiros/components/IndicesFinanceirosToolbar.jsx`
- `frontend-react/src/styles/globals.css`

Regra especifica:

- comparar somente hunks desta frente;
- nao usar `git add -p` sem controle claro se o arquivo estiver misturado;
- preferir patch seletivo ou stage por arquivo somente quando o arquivo contiver exclusivamente mudancas desta frente;
- se houver mistura, parar e elaborar estrategia especifica;
- nunca commitar alteracao alheia.

## 7. Sequencia operacional por etapa

### Etapa documental

1. registrar HEAD;
2. registrar branch;
3. registrar status;
4. confirmar stage vazio;
5. listar arquivos autorizados;
6. revisar documentos existentes;
7. confirmar inexistencia de equivalentes antes de criar novos;
8. ler conteudo;
9. procurar headings obrigatorios;
10. procurar mojibake;
11. procurar placeholders;
12. procurar inconsistencias de nomes;
13. confirmar que nenhum codigo foi alterado.

### Etapa futura de implementacao

1. registrar HEAD;
2. registrar branch;
3. registrar status;
4. confirmar stage vazio;
5. listar arquivos autorizados;
6. executar `git diff -- <caminhos>`;
7. revisar diff;
8. executar testes;
9. executar build;
10. usar `git add` apenas com caminhos explicitos;
11. revisar `git diff --cached`;
12. revisar `git diff --cached --check`;
13. confirmar ausencia de arquivos alheios;
14. criar commit somente se autorizado;
15. verificar HEAD;
16. verificar stage final;
17. nao fazer push sem autorizacao;
18. nao fazer deploy sem autorizacao.

## 8. Comandos seguros para Windows / PowerShell

- Preferir `npm.cmd` quando precisar de build ou testes em Node.
- Considerar que `npm.ps1` pode estar bloqueado.
- Usar caminhos absolutos ao conferir arquivos.
- Evitar shell misto ou redirecionamentos pouco claros.

## 9. Stage seletivo

### Quando usar stage por caminho

- arquivo novo e coeso;
- arquivo sem mistura de outra frente;
- arquivo de teste dedicado;
- helper puro isolado;
- api isolada.

### Quando nao usar stage por caminho

- arquivo compartilhado com varias frentes;
- arquivo que mistura shell global e CRUD;
- arquivo que mistura delete simples e migracao;
- arquivo que mistura import, handler e render inseparaveis.

### Quando usar corte manual

- `App.jsx`;
- `IndicesFinanceirosPage.jsx`;
- `IndicesFinanceirosToolbar.jsx`;
- `globals.css`.

## 10. Ordem operacional recomendada

1. validar arquivos novos;
2. validar diff por hunk em arquivos compartilhados;
3. stagear apenas arquivos coesos;
4. confirmar `git diff --cached --check`;
5. confirmar stage vazio fora da frente;
6. rodar testes previstos;
7. rodar build;
8. revisar resultado;
9. criar commit apenas se autorizado;
10. repetir a conferencia antes de qualquer etapa posterior.

## 11. Riscos especificos

- misturar Plano de contas com Indices financeiros;
- stagear codigo de outra frente por engano;
- usar `git add -p` sem verificar o hunk;
- esquecer arquivo untracked da frente;
- stagear roadmap oficial por acidente;
- perder selecao ao trocar indice ou cotacao;
- gravar calculo local indevido;
- ignorar 409 de migracao;
- fechar dialog em erro e perder contexto;
- tentar limpar o worktree.

## 12. Criterios de parada

Interromper imediatamente se:

- o arquivo alvo estiver misturado com outra frente;
- o hunk trouxer arquivo compartilhado sem corte seguro;
- o diff incluir alteracao nao autorizada;
- o stage mostrar arquivo alheio;
- o build quebrar por import ausente;
- o teste alvo depender de cenario ainda nao implementado.

## 13. Criterios de homologacao

### Tecnico

- testes passam;
- build passa;
- console sem erros criticos;
- rede sem regressao inesperada.

### Funcional

- seis acoes confirmadas;
- migracao funcional;
- reservados respeitados;
- selecao consistente;
- valor atual correto;
- vazio e erro visiveis.

### Visual

- barra em L;
- toolbar;
- duas tabelas empilhadas;
- tema;
- responsividade.

### Seguranca

- tenant nao manual;
- permissao respeitada;
- ausencia de `clinica_id` no frontend.

## 14. Roadmap futuro

Nao atualizar `docs/11_roadmap_desenvolvimento.md` nesta etapa.

Atualizacoes futuras devem ocorrer somente em:

- inicio formal da implementacao;
- conclusao da leitura;
- conclusao do CRUD;
- homologacao;
- encerramento.

## 15. Estado final esperado de stage

- stage vazio fora dos arquivos autorizados;
- nenhum codigo alheio stageado;
- nenhum commit, push ou deploy realizado sem autorização.

## 16. Conclusao

Este roteiro existe para manter a frente de `Indices financeiros` segura em ambiente sujo, com corte seletivo, diffs conferidos e commits futuros pequenos e rastreaveis.

## 17. Fechamento operacional desta rodada

Na rodada atual:

- nenhum `git add` foi executado;
- nenhum commit, push ou deploy foi executado;
- o stage permaneceu vazio;
- os diffs foram apenas auditados;
- os arquivos mistos foram identificados para stage parcial futuro;
- a frente de `SimboloGraficoCreateModal.jsx` permaneceu fora desta matriz de commit.
