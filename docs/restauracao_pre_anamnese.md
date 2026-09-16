# Restauração para ponto anterior à modularização de Anamnese

## 1. Contexto
Houve regressão funcional na lista de Questionários de Anamnese. A restauração foi feita de forma conservadora para voltar ao ponto anterior ao início da modularização de Anamnese, sem alterar backend, banco ou endpoints.

## 2. Sintoma
A lista passou a mostrar apenas "Principal", quando deveria mostrar também:

- Anamnese de Saúde
- Anamnese pessoal
- Ficha complementar
- Implante
- Principal

## 3. Ponto de restauração identificado
O ponto de restauração identificado foi o `HEAD` atual, porque as alterações relacionadas a Anamnese estavam sem commit.

## 4. Arquivos revertidos/removidos
Arquivos restaurados ou apagados:

- `frontend/js/modules/anamnese.js`
- `docs/anamnese_subetapa_0_mapeamento_monolitico.md`
- `docs/anamnese_subetapa_1_namespace_passivo.md`
- `docs/anamnese_regressao_subetapa_1_namespace_passivo.md`

Arquivos de apoio preservados:

- `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md`

## 5. Arquivos preservados
Confirmado nesta restauração:

- `frontend/app.js` não foi alterado nesta restauração final
- backend não foi alterado
- banco não foi alterado
- endpoints não foram alterados

## 6. Checks executados
```text
node --check frontend/app.js
git status --short
git diff --stat
git diff -- frontend/index.html
git diff -- frontend/app.js
```

## 7. Estado final do Git
```text
?? docs/restauracao_pre_anamnese.md
?? docs/restauracao_pre_anamnese_diff_antes.patch
?? docs/restauracao_pre_anamnese_diff_stat_antes.txt
?? docs/restauracao_pre_anamnese_status_antes.txt
?? docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md
```

## 8. Onde testar agora
1. Fazer Ctrl+F5.
2. Abrir o sistema.
3. Abrir o módulo Anamnese.
4. Abrir a lista de Questionários.
5. Confirmar que voltaram a aparecer:
   - Anamnese de Saúde
   - Anamnese pessoal
   - Ficha complementar
   - Implante
   - Principal
6. Selecionar cada questionário.
7. Confirmar que as perguntas aparecem corretamente.
8. Abrir ficha de paciente.
9. Validar a aba/fluxo de Anamnese na ficha.
10. Confirmar console sem `ReferenceError` ou `TypeError`.

## 9. Recomendação
Não retomar modularização de Anamnese ainda. Se a restauração resolver, a próxima etapa deve ser auditoria da causa da regressão antes de qualquer novo arquivo JS ou alteração no `index.html`.

## 10. Confirmação final
- `frontend/app.js` não foi alterado
- `frontend/index.html` voltou ao estado anterior, se aplicável
- `frontend/js/modules/anamnese.js` foi removido
- backend não foi alterado
- banco não foi alterado
- endpoints não foram alterados
- nenhuma lógica funcional foi alterada
- nenhum commit foi feito
