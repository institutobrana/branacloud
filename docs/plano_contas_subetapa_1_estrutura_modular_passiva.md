# Plano de Contas - Subetapa 1: estrutura modular passiva

- Branch atual: `modularizacao-segura-fase-1`
- Status do working tree antes da etapa: não limpo; já havia `docs/plano_contas_subetapa_0_mapeamento_monolitico.md` como arquivo untracked antes desta alteração
- Arquivos analisados:
  - `frontend/app.js`
  - `frontend/index.html`
  - `frontend/js/modules/unidades.js`
  - `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
  - `docs/varredura_comparativa_primeiro_modulo_modularizacao.md`
  - `docs/unidades_subetapa_0_mapeamento_monolitico.md`
  - `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
  - `docs/plano_contas_subetapa_0_mapeamento_monolitico.md`
  - `docs/03_mapa_codigo.md`
  - `docs/04_funcionalidades.md`
  - `docs/07_fluxos.md`
  - `docs/10_continuidade.md`
- Documentos consultados:
  - `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
  - `docs/varredura_comparativa_primeiro_modulo_modularizacao.md`
  - `docs/unidades_subetapa_0_mapeamento_monolitico.md`
  - `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
  - `docs/plano_contas_subetapa_0_mapeamento_monolitico.md`
  - `docs/03_mapa_codigo.md`
  - `docs/04_funcionalidades.md`
  - `docs/07_fluxos.md`
  - `docs/10_continuidade.md`
- Arquivos criados:
  - `frontend/js/modules/plano-contas.js`
  - `docs/plano_contas_subetapa_1_estrutura_modular_passiva.md`
- Arquivos alterados:
  - `frontend/index.html`
- Confirmação de que não houve alteração funcional: confirmado; nenhum fluxo de Plano de Contas foi movido do monolito
- Confirmação de que `app.js` continua como fonte funcional da verdade: confirmado
- Confirmação de que nenhuma função de Plano de Contas foi movida: confirmado
- Confirmação de que nenhum endpoint foi alterado: confirmado
- Confirmação de que nenhum bind foi alterado: confirmado
- Confirmação de que `cadModal`, `aux` e shell não foram alterados: confirmado

## Estrutura criada no namespace passivo

- Namespace novo: `window.BranaPlanoContasModule`
- Contrato passivo criado:
  - `meta` com nome, versão, status e indicação de que o fluxo não é controlado pelo módulo
  - `status`
  - `ativo`
  - `controlaFluxo`
  - `getStatus()`
  - `info()`
- O módulo não chama `planoAbrir()`, `planoCarregar()`, `planoEnsureUI()` ou qualquer outro ponto funcional
- O módulo não faz query de DOM, não registra eventos e não faz fetch/API
- O módulo não sobrescreve funções globais funcionais existentes

## Ordem de carregamento no HTML

- `frontend/js/modules/unidades.js` continua carregado antes de `frontend/app.js`
- `frontend/js/modules/plano-contas.js` foi inserido antes de `frontend/app.js`
- `frontend/app.js` continua carregado como script funcional principal
- Cache-bust do `app.js` atualizado para `20260512-plano-contas-sub1`

## Resultado dos checks

- `node --check frontend/app.js`: sem erros
- `node --check frontend/js/modules/plano-contas.js`: sem erros

## Resumo do que ficou preservado

- `app.js` permanece como fonte funcional oficial
- A abertura de Plano de Contas continua no monolito
- A renderização continua no monolito
- A seleção continua no monolito
- O modal continua no monolito
- O salvar/excluir continua no monolito
- O dispatcher `action === "plano"` continua no monolito
- O scaffold compartilhado com `aux` continua no monolito
- O módulo de Unidades não foi reativado nem alterado
- O novo módulo de Plano de Contas ficou passivo e sem efeitos colaterais

## Riscos remanescentes

- O módulo de Plano de Contas ainda não possui helpers extraídos; isso é intencional nesta subetapa
- O fluxo de Plano de Contas depende fortemente de `planoEnsureUI()` e do scaffold compartilhado com `aux`, então qualquer extração futura deve ser feita com análise própria
- A ordem de carregamento do HTML precisa permanecer estável para não afetar a inicialização do shell

## Recomendação para a Subetapa 2

- Antes de mover qualquer lógica, fazer uma nova análise específica dos helpers puros candidatos e das dependências compartilhadas com `aux` e `cadModal`
- Não avançar para renderização, eventos, modal ou API sem um novo ciclo próprio

## Onde testar no navegador antes de prosseguir

1. Fazer `Ctrl+F5`
2. Abrir o sistema
3. Ir em `Cadastros > Plano de contas...`
4. Confirmar que o painel abre
5. Confirmar que os grupos carregam
6. Confirmar que as categorias carregam ao selecionar grupo
7. Clicar uma vez em grupo e categoria
8. Dar duplo clique em grupo e categoria
9. Testar `Novo grupo`
10. Testar `Alterar grupo`
11. Testar `Nova categoria`
12. Testar `Alterar categoria`
13. Testar `Excluir categoria`, inclusive se houver fluxo de migração
14. Fechar o painel
15. Abrir `Tabelas auxiliares`
16. Confirmar que `Auxiliares` abre normalmente
17. Confirmar console sem `ReferenceError`, `TypeError` ou erro novo

