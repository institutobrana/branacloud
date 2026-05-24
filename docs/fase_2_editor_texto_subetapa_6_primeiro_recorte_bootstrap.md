# Fase 2 — Editor de texto — Subetapa 6 — Primeiro recorte real mínimo do Bootstrap/abertura

## Contexto
A Fase 2 segue concentrada no Editor de texto, tratado preliminarmente como módulo comum/core por ser transversal e reutilizável em várias áreas profissionais.

A frente Tabela de protéticos permanece pausada/consolidada.
A Subetapa 5 foi concluída no commit `08be4fe` e registrou o plano cirúrgico documental do recorte Bootstrap/abertura.

Esta subetapa executa o primeiro recorte real mínimo do Bootstrap/abertura do Editor de texto, com alteração de código extremamente pequena e controlada.

## Classificação comum/core ou específica
Classificação mantida: `comum/core`.

Justificativa: o Editor de texto continua sendo tratado como componente transversal, reutilizável e compartilhável entre áreas profissionais distintas.

Não houve implementação de controle multiárea.
Não houve alteração de cadastro de clínica, permissões por área, perfis, seeds ou banco.

## Objetivo do recorte real
Reduzir parte da massa de `frontend/app.js` extraindo apenas a montagem visual mínima e o shell DOM básico do Editor de texto para um módulo pequeno, preservando o comportamento atual.

O ponto de orquestração continua sendo `editorTextosAbrir()`.

## Arquivos lidos
- `docs/fase_2_editor_texto_subetapa_5_plano_cirurgico_bootstrap.md`
- `docs/fase_2_editor_texto_subetapa_4_preparacao_primeiro_recorte.md`
- `docs/fase_2_editor_texto_subetapa_3_isolamento_blocos_candidatos.md`
- `docs/fase_2_editor_texto_subetapa_2_mapeamento_tecnico.md`
- `docs/fase_2_editor_texto_subetapa_1_contrato_funcional.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/auditoria_fina_editor_textos_editor_puro.md`
- `docs/auditoria_fina_editor_textos_resto_domino.md`
- `docs/auditoria_fina_editor_textos_pdf_assinatura.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules`

## Arquivos alterados/criados
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/editor_textos_bootstrap.js`
- `docs/fase_2_editor_texto_subetapa_6_primeiro_recorte_bootstrap.md`

## O que foi extraído
Foi criado um módulo pequeno de bootstrap:
- `ensureStyle(doc)`, para garantir o shell visual do Editor de texto;
- `ensureUI(ctx)`, para localizar o DOM mínimo do Editor de texto e preparar os controles básicos;
- exportação via `window.BranaEditorTextosBootstrapModule`.

O módulo passou a concentrar a montagem visual mínima do Editor de texto, incluindo a inicialização dos controles de fonte, tamanho, cor e tipo de novo documento.

## O que permaneceu no `frontend/app.js`
O `frontend/app.js` continua como ponto central de orquestração.

Permaneceu nele:
- a entrada funcional do Editor de texto;
- a coordenação do fluxo amplo do editor;
- a manutenção das rotinas de abertura, navegação, toolbar e demais fluxos existentes;
- a chamada para o novo módulo de bootstrap;
- a ativação do document model no mesmo fluxo de inicialização.

## Confirmações funcionais
- `editorTextosAbrir()` permaneceu como ponto de orquestração.
- `standalone`, `lock` e `heartbeat` não foram alterados.
- `listagem`, `modelos`, `campos`, `salvar` e `backend` não foram alterados nesta subetapa.
- `PDF`, `assinatura` e `assistentes` não foram alterados.
- `textos visíveis`, `labels`, `placeholders` e `mojibake` não foram corrigidos nesta etapa.

## Riscos controlados
- risco de mover demais a responsabilidade de bootstrap;
- risco de depender de DOM não disponível no carregamento;
- risco de quebrar a abertura visual do Editor de texto;
- risco de quebrar a aparência do shell;
- risco de regressão por carga do módulo antes do `app.js`;
- risco de interferência em standalone/lock/heartbeat;
- risco de abrir espaço indevido para alterações em listagem, modelos, campos, salvar, PDF, assinatura, assistentes, permissões ou backend.

## Checks executados
- `node --check frontend/app.js`
- `node --check frontend/js/modules/editor_textos_bootstrap.js`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules`
- `git diff -- backend`

## Plano de teste humano obrigatório
Antes de qualquer próxima subetapa, o teste humano deve começar em:

`Ferramentas > Editor de textos`

Validações mínimas:
- abertura do Editor de textos pelo menu;
- painel principal carregado;
- status inicial visível;
- ausência de erro no console;
- modo standalone continua funcionando;
- abertura de modelo continua funcionando;
- criação de novo texto/modelo continua funcionando;
- edição continua funcionando;
- salvar continua funcionando;
- salvar como continua funcionando;
- renomear continua funcionando;
- excluir quando permitido continua funcionando;
- mesclagem de campos continua funcionando;
- formatação continua funcionando;
- imagens continuam funcionando;
- tabela continua funcionando;
- régua continua funcionando;
- layout/configuração de página continua funcionando;
- impressão/exportação/PDF continua funcionando;
- assinatura/PDF/ponte local continua funcionando;
- assistente de receitas continua funcionando;
- assistente de atestados continua funcionando;
- uso em prontuário/documentos/modelos continua funcionando, se aplicável.

## Próxima subetapa recomendada
A próxima ação deve ser o teste humano obrigatório em `Ferramentas > Editor de textos`.

Somente depois disso será possível avaliar qualquer novo recorte funcional.

## Registro para roadmap
- A frente atual continua sendo Editor de texto.
- Tabela de protéticos permanece pausada/consolidada.
- A Subetapa 5 foi concluída no commit `08be4fe`.
- Esta Subetapa 6 executa o primeiro recorte real mínimo do Bootstrap/abertura.
- O Editor de texto continua classificado preliminarmente como comum/core.
- O recorte ficou limitado ao bootstrap/shell visual mínimo.
- Nenhum comportamento funcional foi alterado intencionalmente.
- Nenhuma correção textual/mojibake foi feita.
- Standalone, lock/heartbeat, modelos, campos, salvar, backend, PDF, assinatura e assistentes ficaram fora do recorte.
- A próxima etapa só deve avançar depois de teste humano em `Ferramentas > Editor de textos`.
- Agenda, Conta corrente, Usuários/Login, Seeds/tabelas padrão e Ficha pessoal continuam fora desta frente.

## Commit seletivo obrigatório
- Somente os arquivos desta subetapa devem entrar no commit.
- Não usar `git add .`.
- Não usar `git add docs/`.
- Usar `git add` seletivo somente para os arquivos realmente alterados/criados nesta subetapa.
- Confirmar antes do commit que não há alterações rastreadas indevidas.
- Confirmar depois do commit quais arquivos entraram.

