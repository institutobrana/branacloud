# Intervenções / Procedimentos — Retomada pós-Prestadores — Estado atual

## Objetivo
Registrar, de forma exclusivamente documental, o estado atual do módulo Intervenções / Procedimentos após a recomendação pós-Prestadores, para decidir se ainda existe algum helper pequeno, puro e seguro para futura extração ou se o módulo deve permanecer pausado nesta rodada.

## Escopo
- Reavaliar documentos anteriores e o estado atual do módulo.
- Confirmar o carregamento do módulo passivo em `frontend/index.html`.
- Verificar funções, wrappers e fallbacks relacionados em `frontend/app.js`.
- Identificar helpers já delegados, helpers de select já analisados e blocos proibidos nesta fase.
- Classificar riscos de materiais, vínculos, Procedimentos Genéricos, custos, preço, repasse e reajuste.

## Arquivos inspecionados
- `docs/intervencoes_procedimentos_subetapa_2o_fechamento_reavaliacao_modulo.md`
- `docs/intervencoes_procedimentos_subetapa_0_mapeamento_monolitico.md`
- `docs/intervencoes_procedimentos_subetapa_0b_validacao_fluxos_sensiveis.md`
- `docs/intervencoes_procedimentos_retomada_pos_prestadores_estado_atual.md`
- `docs/recomendacao_proximo_modulo_pos_prestadores_reavaliado.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/intervencoes-procedimentos.js`

## Checks iniciais
- `git branch --show-current`: `modularizacao-segura-fase-1`
- `git status --short`: havia apenas pendencias `??` ja existentes no worktree, sem alteracoes rastreadas nesta base
- `git log --oneline -10`: topo com `70c5bea Recomenda proximo modulo apos Prestadores`
- `git diff --stat`: vazio
- `git diff --cached --stat`: vazio
- `node --check frontend/app.js`: sem erro
- `node --check frontend/js/modules/intervencoes-procedimentos.js`: sem erro

## Base documental encontrada
| Documento | Papel aparente | Observacao |
|---|---|---|
| `docs/intervencoes_procedimentos_subetapa_0_mapeamento_monolitico.md` | Mapeamento inicial | Base historica da separacao de responsabilidades |
| `docs/intervencoes_procedimentos_subetapa_0b_validacao_fluxos_sensiveis.md` | Validacao de fluxos sensiveis | Marca os pontos de cautela ainda existentes |
| `docs/intervencoes_procedimentos_subetapa_2o_fechamento_reavaliacao_modulo.md` | Fechamento / reavaliacao | Consolida o ciclo anterior e lista helpers ja extraidos |
| `docs/recomendacao_proximo_modulo_pos_prestadores_reavaliado.md` | Recomendacao de prioridade | Define Intervenções / Procedimentos como próximo modulo conservador |

## Estado atual do módulo JS
O arquivo `frontend/js/modules/intervencoes-procedimentos.js` existe e permanece como modulo passivo. O namespace exposto e `window.BranaIntervencoesProcedimentosModule`, com `manifest` e `helpers`, e os helpers ja delegados incluem `procParse`, `procFmtBr`, `procFmtAuxLabel`, `procFmtSimboloLabel` e `procIndiceSiglaFromValor`.

## Estado atual do carregamento no index.html
O modulo e carregado em `frontend/index.html` antes de `frontend/app.js`, mantendo a disponibilidade do namespace passivo para os wrappers locais do monolito.

## Estado atual no frontend/app.js
O `frontend/app.js` ainda concentra a logica de UI e de select relacionada ao modulo. Os wrappers/fallbacks para helpers ja delegados continuam presentes, enquanto os helpers de select e os fluxos de tela permanecem no monolito.

## Helpers já movidos ou delegados
- `procParse`
- `procFmtBr`
- `procFmtAuxLabel`
- `procFmtSimboloLabel`
- `procIndiceSiglaFromValor`

## Wrappers/fallbacks existentes
- Wrappers em `app.js` para os helpers acima, com delegacao ao namespace passivo quando disponivel.
- Fallbacks locais mantidos para preservar comportamento em caso de ausencia do modulo.

## Funções ainda concentradas no app.js
- `procSetSelectValue`
- `procGarantirOpcaoSelect`
- `procPreencherSelect`
- Fluxos e pontos de acoplamento ligados a `procNormalizarFormaCobranca` e `procNormalizarFormaCobrancaV2`

## Helpers de select já analisados
- `procSetSelectValue`
- `procGarantirOpcaoSelect`
- `procPreencherSelect`

## Blocos proibidos nesta fase
- `procNormalizarFormaCobranca`
- `procNormalizarFormaCobrancaV2`
- payload
- salvamento
- materiais
- vínculos
- Procedimentos Genéricos
- herança de materiais
- `procedimento_generico_id`
- custos
- preço
- repasse
- reajuste

## Dependências identificadas
- Dependência de UI e seleções no `app.js`
- Dependência de carregamento passivo do modulo
- Dependencia indireta de fluxo visual do monolito para renderizacao e selecao

## Relação com materiais
A relacao com materiais permanece sensivel e nao deve ser tocada nesta fase. Os blocos ligados a heranca de materiais e ao comportamento de material/procedimento seguem fora de escopo.

## Relação com vínculos
Os vinculos continuam sendo area de risco, especialmente porque qualquer movimento prematuro pode alterar associacoes e fluxo de negocio.

## Relação com Procedimentos Genéricos
Procedimentos Genéricos segue como bloqueio explicitamente proibido nesta fase, inclusive o identificador `procedimento_generico_id`.

## Relação com custos/preço/repasse/reajuste
Custos, preço, repasse e reajuste continuam fora de escopo e representam risco funcional alto para qualquer extração nao puramente documental.

## Possíveis candidatos puros remanescentes
Nao foi identificado, nesta reavaliacao, um helper pequeno e claramente puro com relacao de entrada/saida suficientemente isolada para extração segura imediata.

## Funções com cautela
- `procSetSelectValue`
- `procGarantirOpcaoSelect`
- `procPreencherSelect`

## Funções que NÃO devem ser movidas agora
- `procNormalizarFormaCobranca`
- `procNormalizarFormaCobrancaV2`
- qualquer bloco de payload, salvamento, materiais, vínculos, custos, preço, repasse ou reajuste

## Riscos de texto/mojibake
As strings visiveis e rotulos do sistema estao protegidos pela blindagem textual. Nao deve haver qualquer correção de acentos, labels, mensagens, placeholders ou mojibake nesta rodada.

## Riscos funcionais
- Alteracao de selects pode quebrar fluxos de formulários.
- Mexer em blocos de normalização pode contaminar payload ou persistencia.
- Tocar em materiais, vínculos ou Procedimentos Genéricos pode abrir regressões amplas.

## Decisão recomendada
Pausar Intervenções / Procedimentos nesta rodada. O risco funcional ainda supera o ganho de uma nova extração imediata.

## Próxima etapa recomendada
Manter apenas reavaliacao documental futura, ou aguardar a identificacao de um helper verdadeiramente pequeno, puro e isolado antes de qualquer extração funcional.

## Roteiro de teste futuro, se houver extração funcional
1. Ctrl+F5.
2. Abrir a tela de Intervenções / Procedimentos.
3. Confirmar carregamento da listagem e selecao normal.
4. Verificar se a UI permanece igual ao estado anterior.
5. Evitar salvar, excluir ou acionar fluxos reais de materiais, vínculos, custos, preço, repasse ou reajuste.
6. Verificar o console do navegador.
