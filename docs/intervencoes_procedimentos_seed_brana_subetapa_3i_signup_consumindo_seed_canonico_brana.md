# Intervenções / Procedimentos / Seeds — Subetapa 3I — Signup consumindo seed canonico da Brana

## 1. Objetivo
Fazer o signup de novas contas consumir o seed canonico versionado da Brana, removendo a dependencia runtime da clinica 1/tabela 18 para o nascimento da tabela privada.

## 2. Contexto
A Subetapa 3H gerou o seed canonico proprio da Brana com 336 procedimentos, somente com `codigo` e `nome`, sem materiais, fases, composicoes ou `procedimento_generico_id`. Esta subetapa liga o signup a esse seed canonico.

## 3. Contrato 3G respeitado
O ajuste respeita o contrato consolidado:
- Brana deve ter seed canônico próprio;
- Brana deve ter 336 procedimentos;
- Brana deve conter somente código e nome no seed;
- Brana não deve trazer materiais vinculados;
- Brana não deve trazer fases;
- Brana não deve trazer composições;
- Brana não deve trazer `procedimento_generico_id`;
- Brana não deve trazer preço, custo, tempo, garantia, repasse ou observações;
- a clínica 1/tabela 18 pode ser fonte auditada, mas não dependência runtime.

## 4. Seed 3H consumido
O signup passa a consumir:
- `backend/seeds/procedimentos_brana.py`

O helper consumido retorna:
- `PROCEDIMENTOS_BRANA_PADRAO`
- cópia em memória via `get_procedimentos_brana_padrao()`

## 5. Arquivos consultados
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3g_contrato_seed_canonico_brana.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3h_seed_canonico_brana_336.md`
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/contrato_funcional_regras_materiais_genericos_intervencoes.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3e_diagnostico_pos_teste_manual.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3f_correcao_roteamento_brana.md`
- `docs/auditoria_seeds_novas_contas_procedimentos_materiais.md`
- `docs/seeds_particular_zerar_valores_financeiros_novas_contas.md`
- `docs/auditoria_origem_lista_materiais_troca_generico_intervencoes.md`
- `docs/auditoria_regra_heranca_materiais_generico_para_procedimento.md`
- `docs/decisao_tecnica_saneamento_vinculos_legados_materiais.md`

## 6. Arquivos alterados
- `backend/services/signup_service.py`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3i_signup_consumindo_seed_canonico_brana.md`

## 7. Explicação do fluxo antigo
Antes desta subetapa, a garantia da tabela privada ainda tinha uma trilha runtime legada que podia consultar a fonte auditada da clínica 1/tabela 18 quando o snapshot hospedado não estava disponível.

## 8. Explicação do fluxo novo
Agora o signup:
- importa o seed canônico da Brana a partir de `backend/seeds/procedimentos_brana.py`;
- deixa de depender runtime da clínica 1/tabela 18 para popular a Brana;
- mantém a `Tabela exemplo` separada;
- preserva a regra de idempotência por `clinica_id + tabela_id + codigo`.

## 9. Confirmação de remoção da dependência runtime da clínica 1/tabela 18
A dependência runtime da clínica 1/tabela 18 foi removida do nascimento da Brana. A fonte auditada segue existindo apenas como referência histórica e documental.

## 10. Confirmação de que Tabela exemplo e Brana ficam separadas
A `Tabela exemplo` continua usando seu seed próprio, enquanto a `Brana` passa a consumir o seed canônico versionado específico da Brana.

## 11. Confirmação de que Brana usa 336 itens do seed canônico
O seed canônico da Brana contém `336` itens e é o que passa a alimentar a tabela privada no signup.

## 12. Confirmação de que Brana usa somente código/nome + campos técnicos obrigatórios
O seed canônico da Brana contém somente `codigo` e `nome`. Na materialização do signup, os demais campos técnicos obrigatórios são preenchidos com defaults seguros, sem trazer dados sensíveis.

## 13. Confirmação de que não há materiais/fases/composições/procedimento_generico_id
O seed canônico não contém:
- materiais vinculados;
- fases;
- composições;
- `procedimento_generico_id`.

## 14. Confirmação de que não houve correção de mojibake
Nenhum texto foi corrigido nesta subetapa. O mojibake da fonte auditada foi apenas registrado.

## 15. Confirmação de que login/senha/perfis/frontend não foram alterados
Esta etapa não alterou login, senha interna, perfis de acesso, frontend ou fluxo de autenticação.

## 16. Checks executados
- `python -m py_compile backend\\seeds\\procedimentos_brana.py backend\\services\\signup_service.py backend\\seeds\\procedimentos_padrao.py`
- `python -m compileall backend`
- validação em memória do seed da Brana:
  - `336` itens;
  - somente `codigo` e `nome`;
  - nenhuma chave proibida;
  - nenhum código nulo;
  - nenhum nome nulo.

## 17. Próxima subetapa recomendada
Subetapa 3J — limpeza segura da clínica 15 contaminada e liberação do e-mail `institutobrana@gmail.com`, antes de novo teste manual limpo.

## 18. Onde testar depois
Depois da limpeza segura futura, criar nova conta com `institutobrana@gmail.com` e validar:
- nascimento sem erro 500;
- `Tabela exemplo` separada;
- `Brana` com 336 procedimentos;
- ausência de `PARTICULAR` na nova conta;
- ausência de materiais, fases, composições e `procedimento_generico_id` na Brana.
