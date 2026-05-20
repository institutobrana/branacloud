# Recomendação do próximo módulo após retomada de Prestadores

## Objetivo
Registrar, de forma exclusivamente documental, qual e o proximo modulo mais seguro para a continuidade da modularizacao conservadora apos a retomada documental de Prestadores concluir que o modulo deve permanecer pausado nesta rodada.

## Estado final de Prestadores
Prestadores continua sendo um modulo parcial ja iniciado, com `frontend/js/modules/prestadores.js`, namespace `window.BranaPrestadoresModule` e helpers delegados `prestFmtCodigo` e `prestStatusHtml`. A retomada documental mostrou que o restante do bloco ainda esta concentrado em UI, renderizacao, selecao, cache, carregamento, `requestJson`, agenda, convenios e comissoes, entao a decisao conservadora foi mantê-lo pausado nesta rodada.

## Por que Prestadores deve permanecer pausado nesta rodada
- os helpers pequenos e seguros ja foram extraidos;
- o restante depende de `prestCfg`, `prestadoresCache` e `prestadorSelId`;
- a grade e a selecao continuam centralizadas em `prestRender` e `prestSelecionarLinha`;
- `prestCarregar` ainda depende de `requestJson`;
- os botões de agenda, convênios e comissões permanecem como fluxos sensíveis;
- qualquer avanço agora aumentaria risco de regressão visual e de seleção sem ganho proporcional.

## Documentos consultados
- `docs/prestadores_subetapa_0_retomada_estado_atual.md`
- `docs/prestadores_retomada_pos_varredura_parciais_estado_atual.md`
- `docs/prestadores_subetapa_0_mapeamento_monolitico.md`
- `docs/prestadores_subetapa_1_namespace_passivo.md`
- `docs/prestadores_subetapa_2_fronteiras_contratos.md`
- `docs/prestadores_subetapa_3_helper_prest_fmt_codigo.md`
- `docs/prestadores_subetapa_4_integracao_prest_fmt_codigo.md`
- `docs/prestadores_subetapa_5_encerramento_ciclo.md`
- `docs/prestadores_subetapa_6_documental_prest_status_html.md`
- `docs/prestadores_subetapa_7_integracao_prest_status_html.md`
- `docs/prestadores_subetapa_8_reavaliacao_pos_prest_status_html.md`
- `docs/convenios_planos_subetapa_13_fechamento_mini_ciclo_recomendacao_proximo_modulo.md`
- `docs/recomendacao_proximo_modulo_pos_intervencoes_reavaliado.md`
- `docs/recomendacao_proximo_modulo_pos_prestadores.md`
- `docs/recomendacao_proximo_modulo_pos_anamnese.md`
- `docs/recomendacao_proximo_modulo_pos_convenios_planos.md`
- `docs/recomendacao_proximo_modulo_pos_materiais.md`
- `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md`
- `docs/recomendacao_proximo_modulo_pos_simbolos_graficos.md`
- `docs/varredura_modulos_parciais_mais_seguros_pos_nao_iniciados.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Módulos avaliados
- Etiquetas
- Plano de Contas
- Preferências e Opções do Sistema
- Auxiliares / Tabelas auxiliares
- Símbolos Gráficos
- Medicamentos
- Prestadores
- Anamnese
- Materiais
- Procedimentos Genéricos
- Intervenções / Procedimentos
- Convênios e Planos
- Agenda
- Editor de Textos
- Índices financeiros
- Cenário financeiro

## Módulos que devem permanecer pausados
- Prestadores
- Medicamentos
- Convênios e Planos
- Anamnese
- Auxiliares / Tabelas auxiliares
- Preferências e Opções do Sistema
- Etiquetas
- Plano de Contas
- Intervenções / Procedimentos
- Materiais
- Procedimentos Genéricos
- Agenda
- Editor de Textos
- Índices financeiros
- Cenário financeiro

## Módulos descartados por risco
- Intervenções / Procedimentos, por materiais, vínculos, custos, preço, repasse e reajuste
- Materiais, por volume, listas, índices e dependencia de negocio sensivel
- Procedimentos Genéricos, por risco de vinculo e acoplamento com procedimentos/materiais
- Agenda, por eventos, integrações e estado visual amplo
- Editor de Textos, por editor rico, preview, imagem e superfice de regressao alta
- Índices financeiros, por exclusões, migracoes e impacto monetario
- Cenário financeiro, por cálculos e regras monetarias sensíveis
- Prestadores, como novo alvo, porque ja foi retomado documentalmente e ficou pausado nesta rodada
- Medicamentos, como novo alvo, porque o proprio fechamento documental concluiu pausa nesta rodada
- Convênios e Planos, como novo alvo, porque o mini ciclo também foi encerrado nesta rodada

## Candidatos secundários
- Símbolos Gráficos
- Anamnese

## Próximo módulo recomendado
**Símbolos Gráficos**

## Justificativa curta
`Símbolos Gráficos` e o próximo módulo mais seguro entre os remanescentes porque ainda tem fronteira funcional clara, módulo JS passivo já existente, documentação extensa e helpers puros remanescentes identificados, sem tocar de imediato em agenda, financeiro, custos ou procedimentos genericos.

## Justificativa técnica
- existe `frontend/js/modules/simbolos-graficos.js`;
- existe namespace passivo `window.BranaSimbolosGraficosModule`;
- helpers puros já delegados e remanescentes estão bem documentados;
- o risco visual/editor existe, mas é mais isolável do que o acoplamento clínico, financeiro ou de agenda;
- a documentação já mapeou o que deve ficar fora de qualquer avanço imediato;
- o próximo passo pode começar com uma etapa documental específica antes de qualquer movimento funcional.

## Riscos conhecidos do módulo recomendado
- editor visual e preview;
- `postMessage` e janela filha;
- modal e biblioteca visual;
- possibilidade de regressão na ordenação/visibilidade da biblioteca;
- fluxo sensível de salvar/excluir ainda existente no monólito;
- risco textual/mojibake em strings históricas, que não deve ser corrigido nesta rodada.

## Por que os demais candidatos foram descartados
- `Prestadores`: já retomado e pausado por UI, cache, seleção e `requestJson`;
- `Medicamentos`: o fechamento documental já concluiu pausa nesta rodada;
- `Convênios e Planos`: também teve mini ciclo encerrado nesta rodada;
- `Anamnese`: ainda é sensível por paciente, questionários, respostas e persistência clínica;
- `Etiquetas`, `Plano de Contas`, `Auxiliares / Tabelas auxiliares`, `Preferências e Opções do Sistema`: ciclos já encerrados ou pausados;
- `Materiais`, `Procedimentos Genéricos`, `Intervenções / Procedimentos`, `Agenda`, `Editor de Textos`, `Índices financeiros`, `Cenário financeiro`: risco alto demais.

## Primeira etapa recomendada
**Subetapa 8 documental específica dos helpers remanescentes de Símbolos Gráficos**

Se a continuidade funcional vier depois, ela deve seguir o caminho já documentado para o modulo:
- validar os helpers remanescentes um por um;
- manter wrapper/fallback conservador;
- não tocar em modal, editor, preview, `postMessage`, salvamento ou exclusão nesta etapa inicial.

## A próxima etapa deve ser documental
Sim. A próxima etapa para o módulo escolhido deve começar por documentação, sem alterar código, HTML funcional, backend, banco, schema, migrations ou endpoints.

## Checks executados
- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -12`

## Status final do git
No fim desta etapa, o repositório permaneceu com pendências `??` preexistentes no worktree e sem diffs rastreados novos, além deste próprio documento enquanto ele não for commitado.

