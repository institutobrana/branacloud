# Intervenções / Procedimentos / Seeds — Subetapa 3F — Correção do roteamento da Brana

## 1. Objetivo
Separar de forma controlada o seed canônico da `Tabela exemplo` e o seed privado da `Brana` no nascimento de novas contas, evitando que os 336 procedimentos privados caiam na tabela errada.

## 2. Contexto da Subetapa 3E
A Subetapa 3E diagnosticou a clínica de teste `clinica_id = 15` com este resultado:
- `Tabela exemplo` com `681` procedimentos;
- `Brana` com `0` procedimentos;
- sem mistura entre clínicas;
- sem duplicidade real por `clinica_id + tabela_id + codigo`.

O problema foi identificado como falha de roteamento do seed, e não como violação clássica de unicidade.

## 3. Resumo do erro `Tabela exemplo = 681` e `Brana = 0`
O fluxo anterior ainda chamava a trilha ampliada de seed dentro da garantia de procedimentos da nova conta. Como o seed privado local não estava acessível neste checkout, o fallback caía para a trilha clínica ampla e o conteúdo era direcionado para a tabela errada.

## 4. Arquivos consultados
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_0_diagnostico.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_1_correcao_controlada.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_2_validacao_tecnica_sem_gravacao.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3a_correcao_duplicidade_signup.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3b_limpeza_email_codes_teste_abortado.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3b_c_auditoria_pos_execucao_email_codes.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3d_correcao_duplicidade_codigo_1010_signup.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3e_diagnostico_pos_teste_manual.md`
- `docs/auditoria_git_pos_problemas_1_2_pre_teste_manual.md`

## 5. Arquivos alterados
- `backend/services/signup_service.py`

## 6. Fonte encontrada dos 336 procedimentos
Foi encontrado fallback real no banco para a tabela privada antiga:
- clínica de origem: `clinica_id = 1`
- tabela de origem: `tabela_id = 18`
- código da tabela: `4`
- quantidade de procedimentos: `336`
- quantidade de vínculos de materiais: `33`

Os arquivos locais esperados para o seed privado (`Dados/particular_336_procedimentos.csv` e `scripts/easy_particular_atual_snapshot.json`) não estavam presentes neste checkout, então a nova lógica passou a usar o fallback controlado do banco quando o snapshot hospedado não existe.

## 7. Quantidade detectada na fonte dos 336
Quantidade detectada na fonte real do banco: `336` procedimentos.

## 8. Causa técnica identificada
A causa mais provável era o roteamento do seed:
- a `Tabela exemplo` ainda recebia a trilha ampliada indevida;
- a `Brana` ficava vazia porque o seed privado local não era encontrado;
- o fluxo de garantia de procedimentos precisava ser separado para não reutilizar o seed clínico amplo.

## 9. Correção aplicada
No fluxo de signup:
- `seed_procedimentos(db, clinica.id)` continua sendo o seed canônico da `Tabela exemplo`;
- `garantir_procedimentos_padrao_clinica(db, clinica.id)` deixou de chamar a trilha ampla;
- a garantia agora usa apenas a trilha privada da `Brana`;
- quando o snapshot hospedado não existe, a Brana passa a carregar o seed privado a partir da tabela privada existente no banco;
- `PRIVATE_TABLE_NAME` permanece `Brana`;
- `PRIVATE_TABLE_CODE` permanece `4`.

## 10. Como a correção separa Tabela exemplo e Brana
- `Tabela exemplo` fica restrita ao seed canônico local da aplicação;
- `Brana` recebe somente o seed privado;
- não há mais reaproveitamento da trilha clínica ampla dentro da garantia da Brana;
- os mapas de existência seguem separados por `clinica_id + tabela_id + codigo`.

## 11. Como a correção preserva contas existentes
A alteração ficou restrita ao nascimento de novas contas e não executa renomeação retroativa, nem update em massa, nem alteração de clínicas antigas.

## 12. Como a correção evita que Brana vá para Tabela exemplo
O ponto de garantia de procedimentos da nova conta deixou de chamar o carregamento amplo da tabela exemplo. Assim, os procedimentos privados não são mais direcionados para a tabela errada.

## 13. Como a correção evita Tabela exemplo inflada
A `Tabela exemplo` deixa de consumir a trilha ampliada e passa a depender somente do seed canônico próprio, evitando que a contagem 681 volte a aparecer por mistura de fontes.

## 14. Confirmação de que login/senha interna não foram alterados
Esta subetapa não alterou login, senha interna, perfis de acesso ou qualquer fluxo de autenticação.

## 15. Confirmação de que frontend não foi alterado
`frontend/app.js` e `frontend/index.html` não foram alterados nesta etapa.

## 16. Confirmação de que mojibake/UTF-8 não foi corrigido
Nenhum texto, label, nome visível ou mojibake foi corrigido nesta subetapa. A blindagem textual foi respeitada.

## 17. Checks executados
- `python -m py_compile backend\\services\\signup_service.py backend\\seeds\\procedimentos_padrao.py`
- `python -m compileall backend`

## 18. Onde testar manualmente depois
Depois de limpar a clínica de teste contaminada em etapa separada, o teste manual deve ser feito com `institutobrana@gmail.com` para validar:
- nascimento sem erro 500;
- login com senha de login;
- senha interna separada;
- nascimento de `Tabela exemplo` e `Brana`;
- ausência de `PARTICULAR`;
- `Tabela exemplo` sem a inflação de `681`;
- `Brana` com `336` procedimentos.

## 19. Próxima subetapa recomendada
Subetapa 3G — limpeza segura da clínica de teste 15 contaminada, em etapa separada, antes do novo teste manual.
