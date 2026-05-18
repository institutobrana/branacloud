# Decisão técnica: saneamento controlado de vínculos legados de materiais

## 1. Objetivo
Definir, em modo somente leitura, critérios objetivos e conservadores para identificar vínculos legados de materiais, produzir um preview de saneamento e preparar uma futura etapa separada de backup + correção controlada, sem apagar nada agora.

Esta decisão parte da auditoria ampla do caso `Selecione...` e dos materiais residuais / materialização legada observados em Intervenções / Procedimentos.

## 2. Diretório real
`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Confirmação de etapa documental/decisória
Esta é uma etapa documental e decisória, sem alteração funcional, sem aplicação de patch, sem limpeza de dados e sem modificação de banco ou código.

## 4. Escopo
- Definir critérios fortes, médios e fracos para identificar vínculo legado
- Gerar um preview conservador de saneamento
- Separar casos seguros, casos para revisão manual e casos não saneáveis automaticamente
- Destacar o caso `5000` da tabela `PARTICULAR`
- Definir plano mínimo de backup para uma futura correção controlada

## 5. Fora de escopo
- Apagar dados
- Alterar código
- Alterar banco, schema, migration ou endpoints
- Corrigir comportamento
- Alterar frontend/app.js
- Alterar frontend/js/modules/materiais.js
- Alterar frontend/js/modules/procedimentos-genericos.js
- Alterar backend

## 6. Documentos analisados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\regras_blindagem_correcoes_textuais_mojibake.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\contrato_funcional_regras_materiais_genericos_intervencoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\consolidacao_validacao_manual_regras_materiais_genericos_intervencoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_ampla_generico_selecione_materiais_residuais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_origem_lista_materiais_troca_generico_intervencoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_arquitetura_origem_materiais_proprio_herdado.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_backend_subetapa_1_service_vinculos_materiais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_frontend_subetapa_2_consumo_origem_materiais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_frontend_subetapa_3_troca_generico_recompoe_materiais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_funcional_minima_delegacao_helper_unique_aux.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_mapa_extracao_funcoes_pos_vinculos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\retomada_modularizacao_materiais_pos_consolidacao_vinculos.md`

## 7. Arquivos consultados somente em leitura
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\services\vinculos_materiais.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\cadastros_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento_generico.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\procedimentos-genericos.js`

## 8. Consultas SELECT executadas
Foram executadas consultas de leitura no PostgreSQL local configurado em `backend/.env` para:
- localizar o procedimento `5000`;
- listar seus vínculos diretos;
- comparar o footprint com os genéricos `00205 - Botox`;
- localizar todos os procedimentos com `procedimento_generico_id` nulo/vazio e materiais vinculados;
- localizar procedimentos com `procedimento_generico_id` preenchido e materiais diretos;
- medir o percentual de match por footprint e gerar o preview por categoria.

## 9. Contexto da auditoria ampla
A auditoria ampla anterior mostrou que o problema não é isolado:
- o caso `5000` é o caso principal de reprodução;
- o `5000` mantém materiais vinculados apesar de estar com `procedimento_generico_id = null`;
- o footprint de materiais do `5000` coincide fortemente com o antigo genérico `00205 - Botox`;
- a varredura ampla identificou `224` procedimentos distintos com `procedimento_generico_id` nulo/vazio e materiais vinculados;
- esses procedimentos somam `6249` vínculos.

## 10. Regra da combo `Selecione...`
Quando a combo Procedimento Genérico estiver em `Selecione...`:
- considerar `procedimento_generico_id` como `null`/vazio;
- não buscar materiais herdados de nenhum genérico;
- remover todos os materiais herdados da visualização;
- preservar somente materiais próprios reais da intervenção atual;
- se não houver materiais próprios reais, a grade deve ficar vazia;
- lista vazia é resposta válida;
- ao salvar com `Selecione...`, o procedimento não deve permanecer associado ao genérico anterior;
- ao trocar de `Selecione...` para outro genérico, a grade deve ser recomposta com próprios reais + herdados do novo genérico.

## 11. Diferença entre `Selecione...` e genérico sem materiais
- `Selecione...`: não existe `procedimento_generico_id`.
- `genérico sem materiais`: existe `procedimento_generico_id`, mas o genérico não tem materiais.

Nos dois casos, o resultado esperado para herdados é `[]`. A diferença é de estado: um tem genérico escolhido e sem materiais; o outro não tem genérico algum.

## 12. Problema de materialização legada
O caso `5000` indica fortemente que materiais herdados antigos foram materializados como vínculos diretos do procedimento.

Isso acontece porque:
- o `procedimento_generico_id` atual está nulo;
- os vínculos diretos permanecem;
- o footprint dos materiais coincide com `00205 - Botox`;
- existe duplicidade interna de `Babador Descartável`, algo que não combina com um cadastro manual limpo;
- o frontend e o backend atuais preservam esses vínculos porque eles já estão gravados como próprios.

## 13. Critérios fortes para identificar legado provável
Um vínculo ou conjunto pode ser considerado legado provável quando vários destes pontos se confirmam:
- `procedimento_generico_id` nulo/vazio;
- existem vínculos diretos de materiais;
- o conjunto coincide fortemente com um genérico conhecido;
- o footprint bate por `material_id`, `código`, `quantidade`, `custo`, `relacao` e `custo_total` derivado;
- há duplicidade interna sem sentido para material próprio;
- não há evidência de material local individualizado;
- há histórico provável de ter sido salvo com genérico e depois zerado para `Selecione...`.

## 14. Critérios médios para revisão manual
Devem ir para revisão manual quando houver:
- `procedimento_generico_id` nulo/vazio;
- materiais vinculados diretos;
- match parcial com algum genérico;
- materiais extras que não aparecem no genérico;
- diferenças de quantidade ou custo;
- provável mistura de próprio real + herdado materializado;
- tabela/descrição que não permite identificação clara;
- múltiplos genéricos possíveis.

## 15. Critérios fracos que não podem justificar limpeza
Não limpar automaticamente apenas porque:
- `procedimento_generico_id` está nulo/vazio;
- existe material vinculado direto;
- o material também existe em algum genérico;
- o nome do procedimento parece semelhante;
- a tabela está sem nome resolvido;
- não há histórico suficiente.

Esses casos devem permanecer intocados ou ir para revisão manual.

## 16. Método de comparação por footprint
O footprint usado na decisão foi comparado principalmente por:
- `material_id`;
- `quantidade`;
- coerência com `material.codigo`, `material.custo`, `material.relacao` e `custo_total` derivado.

Observação importante: as tabelas de vínculo (`procedimento_material` e `procedimento_generico_material`) armazenam nativamente apenas `material_id` e `quantidade`. Os campos de custo, relação e custo_total foram usados como validação derivada via junção com a tabela `material`, e não como colunas próprias do vínculo.

## 17. Resultado do preview de saneamento
### Resumo numérico
| categoria | quantidade |
| --- | ---: |
| seguro provável | 23 |
| revisão manual | 99 |
| não saneável automaticamente | 102 |

### Leitura do preview
- `23` casos apresentam footprint exato e sem duplicidade, portanto são os candidatos mais seguros para uma futura etapa controlada.
- `99` casos exigem revisão manual por match parcial, duplicidade, divergência de quantidade ou ambiguidades.
- `102` casos não têm match claro o suficiente para qualquer saneamento automático responsável.

### Principais candidatos a saneamento futuro
- `ENDO MOLAR`
- `ENDO PRÉ`
- `PRÓTESE FIXA ADESIVA`
- `PPF PROV LAB`
- `TRAÇÃO ORTO`
- `CLAREAMENTO CASEIRO`
- `PRÓTESE TOTAL`
- `PLACA DE MORDIDA`
- `CIMENTAÇÃO COROA T`
- `INSTRUÇÃO HIG`
- `PREENCHEDOR`

### Principais casos para revisão manual
- `5000 / Adequao de meio bucal` em `PARTICULAR`
- `IMPLANTE+PROTOCOLO`
- `RESTAURAÇÃO 2`
- `PRÓTESE FIXA ADESIVA`
- `PT IMEDIADA`
- `REEMBASAMENTO REPARO`
- `COROA ZIRCONIA`
- `E-MAX INLAY-ONLAY`
- `ENDO INCISIVOS`
- `INLAY-ONLAY`
- `PPF MPSI`
- `PRÓTESE PROTOCOLO`
- `COROA SOB IMP`
- `RASPAGEM`

### Principais casos não saneáveis automaticamente
- `IMPLANTE+PROTOCOLO` sem footprint claro
- `RESTAURAÇÃO 2` sem footprint claro
- `PRÓTESE FIXA ADESIVA` sem footprint claro
- `PT IMEDIADA` sem footprint claro
- `REEMBASAMENTO REPARO` sem footprint claro
- `COROA ZIRCONIA` sem footprint claro
- `E-MAX INLAY-ONLAY` sem footprint claro
- `ENDO INCISIVOS` sem footprint claro
- `ENDO MOLAR` sem footprint claro
- `ENDO PRÉ` sem footprint claro

## 18. Total de procedimentos analisados
- `224` procedimentos distintos com `procedimento_generico_id` nulo/vazio e materiais vinculados
- `3` procedimentos distintos com `procedimento_generico_id` preenchido e materiais diretos, como referência de comparação

## 19. Total de vínculos analisados
- `6249` vínculos nos procedimentos com `procedimento_generico_id` nulo/vazio
- `33` vínculos nos procedimentos com `procedimento_generico_id` preenchido e materiais diretos, para comparação

## 20. Caso 5000 em destaque
O caso `5000` foi classificado como **revisão manual obrigatória**, não como saneamento automático.

Detalhe principal:
- procedimento interno `40595`
- código `5000`
- tabela `PARTICULAR`
- `procedimento_generico_id = null`
- `18` vínculos diretos
- `17` materiais únicos
- `1` duplicidade interna de `Babador Descartável`
- footprint fortemente compatível com o genérico `00205 - Botox`

### Conclusão do 5000
O `5000` é o melhor indício de materialização legada, mas não deve ser apagado automaticamente porque a duplicidade interna já o tira da categoria de saneamento seguro.

## 21. Lista resumida dos principais candidatos a saneamento futuro
Os melhores candidatos são os casos da categoria `seguro provável`, em especial:
- `ENDO MOLAR`
- `ENDO PRÉ`
- `PRÓTESE FIXA ADESIVA`
- `PPF PROV LAB`
- `TRAÇÃO ORTO`
- `CLAREAMENTO CASEIRO`
- `PRÓTESE TOTAL`
- `PLACA DE MORDIDA`
- `CIMENTAÇÃO COROA T`
- `INSTRUÇÃO HIG`
- `PREENCHEDOR`

## 22. Lista resumida dos principais casos que exigem revisão manual
Os casos mais críticos para revisão manual incluem:
- `5000 / Adequao de meio bucal`
- `IMPLANTE+PROTOCOLO`
- `RESTAURAÇÃO 2`
- `PRÓTESE FIXA ADESIVA`
- `PT IMEDIADA`
- `REEMBASAMENTO REPARO`
- `COROA ZIRCONIA`
- `E-MAX INLAY-ONLAY`
- `ENDO INCISIVOS`
- `INLAY-ONLAY`
- `PPF MPSI`
- `PRÓTESE PROTOCOLO`
- `COROA SOB IMP`
- `RASPAGEM`

## 23. Riscos de limpeza direta
- apagar materiais próprios reais por engano;
- remover vínculos úteis de outros procedimentos;
- perder histórico;
- quebrar procedimentos com genérico preenchido que usam materiais próprios legítimos;
- afetar clones cadastrais e tabelas repetidas.

## 24. Riscos de corrigir só frontend
- o banco continuará com vínculos residuais materializados;
- o problema pode voltar em reabertura ou em rotinas de leitura;
- o legado fica mascarado, não resolvido.

## 25. Riscos de corrigir só backend
- sem distinguir origem real e herança materializada, o backend pode apagar dados válidos;
- se só mudar composição, o legado persistido continua contaminando outras rotinas.

## 26. Riscos de deixar legado sem tratar
- a tela continua confusa para `Selecione...`;
- a manutenção futura fica insegura;
- o problema pode reaparecer em outros fluxos;
- a base mantém falsos próprios que parecem herdados.

## 27. Plano mínimo de backup futuro
Antes de qualquer correção real, o mínimo seguro seria:
1. Exportar a tabela de procedimentos afetados.
2. Exportar a tabela de vínculos de materiais afetados.
3. Exportar os IDs dos vínculos candidatos a saneamento.
4. Exportar relatório antes/depois.
5. Criar script reversível ou SQL de rollback.
6. Validar em cópia/ambiente de teste antes de produção.
7. Nunca limpar dados sem confirmação explícita do usuário.

## 28. Opções futuras avaliadas
- **Opção A**: saneamento pontual do caso `5000`
- **Opção B**: saneamento controlado dos casos com match forte
- **Opção C**: não limpar banco agora e corrigir backend/frontend para mascarar legados
- **Opção D**: criar campo/metadata de origem via migration futura
- **Opção E**: criar etapa de revisão manual no sistema

## 29. Recomendação técnica
A recomendação mais conservadora e segura é:
- não apagar nada agora;
- tratar primeiro os casos de revisão manual e os casos de saneamento provável com critérios verificáveis;
- reservar a limpeza ampla para uma etapa separada, com backup, validação e rollback;
- evitar qualquer ação automática sobre os `102` casos sem match claro.

## 30. Menor próxima etapa segura
A menor próxima etapa segura é uma etapa separada de classificação detalhada dos casos `seguro provável` e `revisão manual`, com revisão humana antes de qualquer ação de escrita.

## 31. Checklist de validação futura
Antes de qualquer futura correção, validar:
1. Abrir o procedimento/intervenção `5000`.
2. Confirmar a situação atual dos vínculos.
3. Validar um caso de cada tabela com match forte.
4. Validar um caso de match parcial.
5. Validar um caso sem match claro.
6. Confirmar que `Selecione...` continua significando `procedimento_generico_id = null`.
7. Confirmar que herdados antigos não permanecem após trocar o genérico.
8. Confirmar que próprios reais continuam preservados.
9. Reabrir após qualquer teste de escrita em ambiente controlado.

## 32. Confirmação de que nenhuma limpeza foi executada
Confirmado. Nenhuma limpeza de dados foi executada nesta etapa.

## 33. Confirmação de que nenhum UPDATE/DELETE/ALTER foi executado
Confirmado. Nenhum `UPDATE`, `DELETE` ou `ALTER` foi executado.

