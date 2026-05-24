Fase 2 — Editor de texto — Subetapa 6A — Correção controlada da abertura standalone após recorte Bootstrap

## Contexto
A Subetapa 6 introduziu o primeiro recorte real mínimo do Bootstrap/abertura do Editor de texto no commit `3d36720` (`Extrai bootstrap minimo do editor de texto`).
O teste humano posterior encontrou regressão na abertura standalone: ao acessar `http://127.0.0.1:8000/app?editor_textos=1`, a aba abria, mas a tela ficava vazia/cinza e o painel do Editor de textos não aparecia.

Esta Subetapa 6A corrige de forma controlada essa regressão, com escopo mínimo, para restaurar a abertura standalone sem avançar para novo recorte funcional.

## Classificação comum/core ou específica
Classificação preliminar mantida: `comum/core`.

Justificativa:
- o Editor de texto continua sendo transversal e reutilizável por várias áreas profissionais;
- não houve implementação de controle multiárea;
- não houve alteração de cadastro de clínica, permissões por área, perfis, seeds ou banco;
- qualquer decisão futura sobre multiárea continua dependente de documento próprio.

## Arquivos lidos
- `docs/fase_2_editor_texto_subetapa_6_primeiro_recorte_bootstrap.md`
- `docs/fase_2_editor_texto_subetapa_5_plano_cirurgico_bootstrap.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/editor_textos_bootstrap.js`

## Arquivos alterados
- `frontend/js/modules/editor_textos_bootstrap.js`
- `docs/fase_2_editor_texto_subetapa_6a_correcao_standalone_blank.md`

## Causa provável identificada
A regressão ocorreu porque o novo bootstrap extraído no commit `3d36720` passou a apenas consultar nós do DOM e injetar estilo, mas não recriou o shell HTML do Editor de texto antes das consultas.

Resultado prático:
- `editorTextosEnsureUI()` passou a depender de um painel que não estava presente na aba standalone;
- a abertura em `editor_textos=1` ficou sem a árvore DOM mínima do editor;
- o painel não pôde ser exibido, resultando na tela vazia/cinza.

## Descrição exata da correção
Foi adicionado em `frontend/js/modules/editor_textos_bootstrap.js` um helper de bootstrap do shell que:
- recria a estrutura DOM mínima do Editor de texto quando ela ainda não existe;
- insere o painel principal, toolbar, régua, área editável, status e modais básicos;
- preserva o fluxo existente de `editorTextosEnsureUI()` e `editorTextosAbrir()`;
- mantém a abertura standalone como foco da correção;
- não altera a lógica funcional de salvar, carregar, PDF, assinatura, assistentes ou backend.

## Confirmações desta correção
- `editorTextosAbrir()` permaneceu como ponto de orquestração.
- standalone/lock/heartbeat não foram alterados.
- listagem/modelos/campos/salvar/backend não foram alterados.
- PDF/assinatura/assistentes não foram alterados.
- textos visíveis/mojibake não foram alterados.
- backend/banco/endpoints não foram alterados.

## Riscos controlados
- risco de continuar sem DOM mínimo para o editor;
- risco de quebrar a abertura em `editor_textos=1`;
- risco de afetar a montagem da UI por dependência implícita do shell;
- risco de introduzir alteração textual indevida;
- risco de tocar em fluxo além do bootstrap/abertura.

## Checks executados
- `git log --oneline -7`
- `git status --short`
- inspeção de `git show --stat 3d36720`
- inspeção de `git show -- frontend/index.html`
- inspeção de `git show -- frontend/app.js`
- inspeção de `git show -- frontend/js/modules/editor_textos_bootstrap.js`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/editor_textos_bootstrap.js`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules/editor_textos_bootstrap.js`
- `git diff -- backend`
- `git diff -- docs/fase_2_editor_texto_subetapa_6a_correcao_standalone_blank.md`

## Plano de teste humano obrigatório
O teste humano deve começar em:

`Ferramentas > Editor de textos`

Depois validar também a abertura direta/standalone:

`http://127.0.0.1:8000/app?editor_textos=1`

Validações mínimas:
- a tela não fica vazia/cinza;
- o painel do Editor de textos carrega;
- o status inicial aparece;
- o console permanece sem erro;
- abertura de modelo;
- criação de novo texto/modelo;
- edição;
- salvar;
- salvar como;
- mesclagem;
- PDF/exportação;
- assinatura, se aplicável;
- assistentes, se aplicável.

## Próxima subetapa recomendada
Somente após novo teste humano bem-sucedido em `Ferramentas > Editor de textos` e em `app?editor_textos=1`, avaliar continuidade documental ou avanço mínimo adicional, sem saltar etapas.

## Registro para roadmap
- A frente atual continua sendo Editor de texto.
- A Subetapa 6 foi concluída no commit `3d36720`.
- O teste humano encontrou regressão na abertura standalone em `/app?editor_textos=1`.
- Esta Subetapa 6A corrige de forma controlada a tela vazia/cinza da abertura standalone.
- O Editor de texto continua classificado como comum/core.
- A correção não deve avançar novo recorte funcional.
- Nenhuma correção textual/mojibake foi feita.
- Backend, banco, endpoints, permissões, sessão, clínica e usuário não foram alterados.
- A próxima etapa só pode avançar depois de novo teste humano em `Ferramentas > Editor de textos` e em `/app?editor_textos=1`.

## Commit seletivo obrigatório
- Somente os arquivos alterados nesta correção devem entrar no commit.
- Não usar `git add .`.
- Não usar `git add docs/`.
- Usar `git add` seletivo.
- Confirmar antes do commit que não há alterações indevidas.
- Confirmar depois do commit quais arquivos entraram.
