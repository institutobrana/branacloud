# Intervencoes / Procedimentos - Subetapa 1 namespace passivo

## 1. Estado inicial do Git

- Branch: `modularizacao-segura-fase-1`
- Ultimo commit: `a18cb48 - Conclui modularizacao segura parcial de materiais`
- `git status --short`: havia pendencias untracked anteriores ja existentes; nenhuma foi alterada por esta etapa
- `git diff --stat`: vazio antes desta mudanca
- `git diff --cached --stat`: vazio antes desta mudanca

## 2. Arquivos alterados nesta subetapa

- `frontend/js/modules/intervencoes-procedimentos.js`
- `frontend/index.html`
- `docs/intervencoes_procedimentos_subetapa_1_namespace_passivo.md`

## 3. Confirmacao de isolamento

- `frontend/app.js` nao foi alterado
- backend nao foi alterado
- banco nao foi alterado
- schema nao foi alterado
- migrations nao foram alteradas
- endpoints nao foram alterados

## 4. Namespace passivo criado

O namespace `window.BranaIntervencoesProcedimentosModule` foi criado como passivo, com apenas manifest e contratos congelados.

Confirmacoes de passividade:

- sem mover funcoes
- sem extrair helpers
- sem delegar comportamento
- sem consumo pelo `app.js`
- sem alterar fluxo `proc*`
- sem alterar calculo financeiro
- sem alterar materiais
- sem alterar Procedimentos Genericos
- sem alterar tabelas, relatorio, modal ou eventos

## 5. Contratos preservados

Foram preservados por documento e por ausencia de mudanca funcional:

- materiais proprios e herdados
- troca de Procedimento Generico
- combo `Selecione...`
- deduplicacao por `material_id`
- proprio vence herdado
- duplo clique em material vinculado
- bloqueio de duplicidade
- quantidade fracionada em Procedimentos Genericos
- calculo financeiro intocado

## 6. Riscos para proximas etapas

- o modulo ainda esta profundamente acoplado ao monolito
- `frontend/app.js` segue como fonte funcional da verdade
- qualquer tentativa de mover logica antes de nova validacao pode quebrar heranca de materiais
- eventos de duplo clique e modal continuam sensiveis
- rotas e services continuam no backend monolitico

## 7. Onde testar no sistema antes de avancar

Depois de recarregar o navegador com Ctrl+F5, testar:

- abrir `Configuracoes > Tabelas > Intervencoes / Procedimentos...`
- confirmar que a tela abre
- confirmar que a lista principal carrega
- testar filtro e troca de tabela
- abrir novo procedimento
- abrir e alterar procedimento existente
- trocar Procedimento Generico
- selecionar `Selecione...` no combo de Procedimento Generico
- confirmar que materiais herdados saem e proprios reais permanecem
- vincular material
- editar material vinculado por duplo clique
- testar bloqueio de duplicidade
- abrir modal de tabela
- abrir relatorio de tabela de procedimentos
- verificar console do navegador
- verificar se nao houve erro de rede

## 8. Observacao de blindagem textual / mojibake

Nenhum texto funcional foi corrigido nesta etapa. Se houver texto corrompido, ele permanece apenas como risco documental.

## 9. Fechamento

Esta subetapa criou apenas um namespace passivo e um ajuste minimo de carregamento no HTML. Nenhum comportamento foi movido ou delegado.
