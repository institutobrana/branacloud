# Auditoria do alerta "Tabela de procedimentos nao encontrada" no vinculo de material

## 1. Objetivo da auditoria
Localizar a origem exata do alerta exibido ao confirmar, editar ou desvincular material no fluxo de Procedimentos / Intervencoes, sem alterar codigo funcional.

## 2. Diretorio real de trabalho
`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Confirmacoes obrigatorias
- Nenhum codigo funcional foi alterado nesta auditoria.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foi alterado.
- Backend, banco e endpoints nao foram alterados.
- A blindagem textual/mojibake foi respeitada.
- Nenhum texto visivel, acento, label, placeholder, mensagem ou string do sistema foi alterado.

## 4. Documentos analisados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\regras_blindagem_correcoes_textuais_mojibake.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\registro_pendente_heranca_materiais_procedimento_generico_para_procedimento.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_regra_heranca_materiais_generico_para_procedimento.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_backend_heranca_materiais_generico_get_procedimento.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_frontend_combo_generico_atualiza_materiais_vinculados.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_0_mapeamento_monolitico.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_2_fronteiras_contratos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_6_consolidacao_pos_integracao.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\procedimentos_genericos_subetapa_0_mapeamento_monolitico.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\procedimentos_genericos_subetapa_2_fronteiras_contratos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\procedimentos_genericos_correcao_valores_monetarios_dependencias.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\procedimentos_genericos_subetapa_5a_auditoria_payload_pgenpayloadfromstate.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\frontend_auditoria_appjs.md`

## 5. Documentos relacionados encontrados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\03_mapa_codigo.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\04_funcionalidades.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\07_fluxos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\10_continuidade.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\11_roadmap_desenvolvimento.md`

## 6. Documentos esperados nao encontrados
- Nao foi encontrado um documento especifico de planejamento para este alerta dentro de `docs`.

## 7. Arquivos frontend analisados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\index.html`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\procedimentos-genericos.js`

## 8. Arquivos backend analisados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento_generico.py`

## 9. Local exato da mensagem encontrada
A mensagem existe literalmente no backend em `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`, no helper `_load_tabela_or_404`.

Trecho funcional identificado:
- linha aproximada: `955`
- texto exato: `Tabela de procedimentos nao encontrada.`

## 10. Funcao que dispara a mensagem
O alerta nasce na funcao `_load_tabela_or_404(db, clinica_id, codigo)`, que levanta `HTTPException(status_code=404, detail="Tabela de procedimentos nao encontrada.")` quando nao encontra a tabela pedida.

## 11. Fluxo de usuario que chega nessa funcao
O usuario abre `Procedimentos / Intervencoes`, entra no modal `Vincular material`, seleciona um material, preenche custo e quantidade e confirma. O mesmo helper tambem e usado na edicao e no desvinculo de material.

## 12. Estado ou variavel ausente
O estado ausente e a tabela de procedimentos resolvida para o procedimento atual, isto e, o `tabela_id` esperado pelo backend quando ele tenta carregar a tabela ativa do procedimento.

## 13. Origem esperada desse estado
O valor deveria vir do proprio procedimento carregado no backend, via `proc.tabela_id`, e corresponder a um registro valido de tabela para a clinica atual.

## 14. Relacao com tabela de procedimentos
A mensagem nao indica um erro de material em si; ela indica que a tabela de procedimentos usada como contexto do vinculo nao foi localizada ou nao e valida para o procedimento corrente.

## 15. Relacao com material vinculado
O erro aparece exatamente no momento em que o sistema tenta confirmar, editar ou remover um vinculo de material, porque essas operacoes consultam a tabela atual antes de prosseguir.

## 16. Relacao com Procedimento Generico
A evidenca atual nao aponta o Procedimento Generico como causa direta do alerta. O problema central continua sendo a resolucao da tabela de procedimentos usada no fluxo de vinculo.

## 17. Relacao com a correcao recente da combo Procedimento Generico
A correcao recente da combo pode ter tornado o fluxo de edicao mais acessado, mas nao e a origem direta do alerta. O helper que dispara a mensagem esta no backend e depende do contexto da tabela do procedimento, nao da heranca de materiais.

## 18. Diagnostico provavel
O backend esta falhando ao resolver a tabela de procedimentos do procedimento atual no fluxo de vinculo de material. A falha pode ocorrer por `tabela_id` ausente, invalido, apontando para uma tabela inexistente ou fora da clinica corrente.

## 19. Local provavel da quebra
A quebra provavel esta em `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`, no helper `_load_tabela_or_404`, chamado pelos endpoints de material vinculado do procedimento.

## 20. Proposta conservadora de correcao futura, sem implementar
Antes de confirmar, editar ou desvincular material, preservar ou validar o contexto da tabela de procedimentos do editor. Se o procedimento nao tiver tabela valida, tratar a situacao de forma explicita e segura, sem tentar continuar com contexto incompleto.

## 21. Riscos de corrigir
- alterar validacoes de um fluxo ja existente;
- permitir vinculo com contexto incorreto;
- impactar custo ou relacao de material se a tabela errada for usada;
- mascarar um problema de integridade cadastral.

## 22. Checks executados
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js` - passou
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js` - passou
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\procedimentos-genericos.js` - passou
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py` - passou
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento.py` - passou
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento_generico.py` - passou

## 23. Onde testar depois da futura correcao
1. Fazer Ctrl+F5.
2. Abrir `Intervencoes / Procedimentos`.
3. Abrir um procedimento existente.
4. Abrir o modal `Vincular material`.
5. Adicionar material vinculado.
6. Editar material vinculado existente.
7. Desvincular material.
8. Trocar `Procedimento Generico` na combo.
9. Confirmar que materiais herdados mudam corretamente.
10. Adicionar material proprio apos trocar o generico.
11. Salvar e reabrir.
12. Confirmar que nao aparece `Tabela de procedimentos nao encontrada`.
13. Confirmar que custos permanecem corretos.
14. Confirmar que `Materiais` continua normal.
15. Confirmar que `Procedimentos Genericos` continua normal.
16. Confirmar console sem erro.

## 24. Recomendacao objetiva para a proxima etapa
Tratar a validacao do contexto da tabela de procedimentos no backend como prioridade, e depois revalidar o fluxo completo de vinculo de material no editor de `Procedimentos / Intervencoes`.
