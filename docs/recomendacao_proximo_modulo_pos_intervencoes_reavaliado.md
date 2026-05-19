# Recomendação do próximo módulo após Intervenções / Procedimentos — Reavaliação conservadora

## Objetivo
Registrar, de forma exclusivamente documental, qual módulo parcial parece mais seguro para a próxima retomada após a pausa de Intervenções / Procedimentos, sem alterar código, comportamento, textos visíveis ou mojibake.

## Escopo
- Reavaliar os módulos parciais e candidatos remanescentes mais citados nas varreduras anteriores.
- Comparar risco de frontend, payload, salvamento, backend, banco, custos, reajustes e editor visual.
- Escolher um próximo módulo conservador, se houver, ou indicar pausa se o risco continuar alto demais.

## Arquivos inspecionados
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/intervencoes_procedimentos_retomada_pos_prestadores_estado_atual.md`
- `docs/recomendacao_proximo_modulo_pos_prestadores_reavaliado.md`
- `docs/recomendacao_proximo_modulo_pos_convenios_planos.md`
- `docs/recomendacao_proximo_modulo_pos_materiais.md`
- `docs/recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md`
- `docs/recomendacao_proximo_modulo_pos_simbolos_graficos.md`
- `docs/varredura_modulos_nao_iniciados_pos_simbolos_graficos.md`
- `docs/varredura_modulos_parciais_mais_seguros_pos_nao_iniciados.md`
- `docs/varredura_proximo_modulo_pos_intervencoes_auxiliares.md`
- `docs/varredura_proximo_modulo_pos_medicamentos.md`
- `docs/varredura_proximo_modulo_pos_plano_contas.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules`

## Checks iniciais
- `git branch --show-current`: `modularizacao-segura-fase-1`
- `git status --short`: havia apenas pendencias `??` preexistentes no worktree, sem alteracoes rastreadas nesta base
- `git log --oneline -10`: topo com `6bf6f6d Documenta retomada de Intervencoes apos Prestadores`
- `git diff --stat`: vazio
- `git diff --cached --stat`: vazio
- `node --check frontend/app.js`: sem erro

## Contexto da pausa de Intervenções / Procedimentos
Intervenções / Procedimentos foi retomado documentalmente e pausado novamente porque nao apareceu um helper pequeno e claramente puro para extração imediata. Os helpers remanescentes de select seguem com cautela, a normalizacao de forma de cobranca continua sensivel e os blocos de payload, salvamento, materiais, vinculos, Procedimentos Genéricos, custos, preço, repasse e reajuste seguem fora de escopo.

## Módulos avaliados
- Símbolos Gráficos
- Anamnese
- Convênios e Planos
- Medicamentos
- Plano de Contas
- Etiquetas
- Materiais
- Procedimentos Genéricos
- Preferências e Opções do Sistema
- Auxiliares / Tabelas auxiliares
- Prestadores
- Intervenções / Procedimentos

## Critérios de segurança
1. Fronteiras claras.
2. Menor dependência de payload/salvamento.
3. Menor risco de backend/banco.
4. Menor risco de materiais/custos/reajustes.
5. Menor risco de UI complexa.
6. Existência de helpers pequenos e puros.
7. Possibilidade de começar por Subetapa 0 documental.
8. Menor chance de mexer em texto/mojibake.

## Módulos descartados por risco
- Intervenções / Procedimentos
- Materiais
- Procedimentos Genéricos
- Preferências e Opções do Sistema
- Prestadores, como novo alvo, porque o ciclo já foi pausado/encerrado e nao deve ser tratado como modulo novo

## Módulos com cautela
- Símbolos Gráficos
- Anamnese
- Convênios e Planos
- Etiquetas
- Plano de Contas

## Candidatos secundários
- Símbolos Gráficos
- Etiquetas

## Próximo módulo recomendado
**Medicamentos**

## Justificativa da recomendação
Medicamentos parece ser o melhor próximo passo conservador entre os módulos ainda remanescentes porque:
- já é um módulo parcial conhecido;
- tem fronteira funcional mais legível do que Anamnese, Convênios e Planos e os blocos financeiros;
- nao encosta diretamente em materiais, vinculos, custos, preço, repasse ou reajuste;
- tende a ser mais previsível do que Símbolos Gráficos, que ainda traz risco visual/editor e integração de preview;
- permite começar por Subetapa 0 documental antes de qualquer extração funcional.

## Riscos conhecidos do módulo recomendado
- ainda envolve CRUD e persistência, então nao e um bloco trivial;
- pode ter validação textual e fluxo de cadastro mais amplo do que Prestadores;
- qualquer movimentação cedo demais pode afetar lista, modal, filtros ou eventos de tela;
- textos e labels herdados continuam protegidos pela blindagem textual, então nao devem ser corrigidos nesta fase.

## Primeira etapa recomendada
**Subetapa 0 documental de Medicamentos**

Recomendação de começo:
- mapear somente o bloco monolítico de Medicamentos em `frontend/app.js`;
- confirmar o carregamento do modulo JS existente, se houver;
- registrar DOM, eventos, estado global, API e riscos;
- nao mover codigo, helper, wrapper, payload ou salvamento.

## Limites obrigatórios da próxima etapa
- nao alterar `frontend/app.js`;
- nao alterar `frontend/index.html`;
- nao alterar `frontend/js/modules`;
- nao alterar backend, banco, schema, migrations ou endpoints;
- nao mexer em payload, salvamento, materiais, custos ou reajustes;
- nao corrigir texto, acentos, labels, mensagens, placeholders ou mojibake;
- nao tratar Prestadores ou Intervenções / Procedimentos como modulo novo.

## Confirmação de não alteração funcional
Esta etapa foi somente documental. Nenhum arquivo funcional foi alterado, nenhum fluxo foi executado e nenhuma mudança de comportamento foi feita no sistema.
