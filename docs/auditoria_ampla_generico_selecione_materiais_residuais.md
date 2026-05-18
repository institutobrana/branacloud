# Auditoria ampla: combo Procedimento Genérico em `Selecione...` e materiais residuais / materialização legada

## 1. Objetivo
Documentar, em modo somente leitura, a regra de `Selecione...` no fluxo de Intervenções / Procedimentos, com foco no caso principal de reprodução no procedimento `5000` da tabela `Particular` e na varredura de outros procedimentos com `procedimento_generico_id` nulo/vazio e materiais vinculados residuais.

O objetivo desta auditoria não é corrigir nada ainda, mas responder se o problema é:
- dado legado específico;
- regra incompleta no frontend;
- regra incompleta no backend;
- materialização herdada antiga;
- ou combinação desses fatores.

## 2. Diretório real
`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Confirmação de auditoria documental
Esta é uma auditoria documental, sem alteração funcional, sem aplicação de patch, sem limpeza de dados, sem migração e sem modificação de código.

## 4. Escopo
- Regra da combo Procedimento Genérico quando está em `Selecione...`
- Caso específico do procedimento/intervenção `5000`
- Varredura ampla de outros procedimentos/intervenções com `procedimento_generico_id` nulo/vazio e materiais vinculados
- Relação com materialização legada e resíduos de herança
- Relação entre frontend, backend e dados persistidos

## 5. Fora de escopo
- Corrigir comportamento
- Alterar código
- Alterar frontend/app.js
- Alterar frontend/js/modules/materiais.js
- Alterar backend
- Alterar banco, schema, migration ou endpoints
- Limpar dados legados

## 6. Relato do usuário
O usuário relatou, na tabela `Particular`, o procedimento/intervenção código `5000` com nome exibido `Adequao de meio bucal`. A combo Procedimento Genérico aparece como `Selecione...`, mas a grade de materiais vinculados continua exibindo materiais.

O usuário informou ainda que esse procedimento já esteve vinculado ao Procedimento Genérico código `00205 - Botox`. Em testes anteriores, a combo foi trocada para `Selecione...` e salva. Ao reabrir, a combo permaneceu em `Selecione...`, porém os materiais seguiram aparecendo. Quando o usuário escolheu outro Procedimento Genérico, como `00001 - Abertura e drenagem cirúrgica de abscesso`, a lista não trocou corretamente nesse procedimento `5000`.

## 7. Regra nova proposta para `Selecione...`
Quando a combo Procedimento Genérico estiver em `Selecione...`:
- considerar `procedimento_generico_id` como `null`/vazio;
- não buscar materiais herdados de nenhum genérico;
- remover todos os materiais herdados da visualização;
- preservar somente materiais próprios reais da intervenção atual;
- se não houver materiais próprios reais, a grade deve ficar vazia;
- lista vazia é resposta válida;
- ao salvar com `Selecione...`, o procedimento não deve permanecer associado ao genérico anterior;
- ao trocar de `Selecione...` para outro genérico, a grade deve ser recomposta com:
  - materiais próprios reais da intervenção atual
  - + materiais herdados do novo genérico selecionado.

## 8. Diferença entre `genérico sem materiais` e `Selecione...`
- `genérico sem materiais`: existe `procedimento_generico_id`, mas o genérico não possui materiais vinculados.
- `Selecione...`: não existe `procedimento_generico_id`.

Nos dois casos, o resultado esperado para herdados é `[]`. A diferença é só conceitual e de persistência: no primeiro há um genérico selecionado; no segundo não há nenhum genérico selecionado.

## 9. Documentos analisados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\contrato_funcional_regras_materiais_genericos_intervencoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\consolidacao_validacao_manual_regras_materiais_genericos_intervencoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_backend_subetapa_1_service_vinculos_materiais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_frontend_subetapa_2_consumo_origem_materiais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_frontend_subetapa_3_troca_generico_recompoe_materiais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_funcional_minima_delegacao_helper_unique_aux.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_mapa_extracao_funcoes_pos_vinculos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\retomada_modularizacao_materiais_pos_consolidacao_vinculos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\regras_blindagem_correcoes_textuais_mojibake.md`

## 10. Arquivos consultados somente em leitura
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\services\vinculos_materiais.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\cadastros_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento_generico.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\procedimentos-genericos.js`

## 11. Consultas SELECT executadas
Foram executadas consultas em modo leitura contra o PostgreSQL local configurado em `backend/.env`, cobrindo:
- o procedimento `5000`;
- seus vínculos diretos de materiais;
- o Procedimento Genérico `00205 - Botox` em suas ocorrências;
- a varredura de procedimentos com `procedimento_generico_id` nulo/vazio e materiais vinculados;
- a varredura de procedimentos com `procedimento_generico_id` preenchido e materiais diretos.

## 12. Resultado do caso 5000
Foram encontradas **duas** linhas de procedimento com código `5000` na tabela `Particular`:

| id interno | código | nome | procedimento_generico_id | tabela | materiais |
| --- | ---: | --- | --- | --- | ---: |
| 40595 | 5000 | `Adequao de meio bucal` | null | PARTICULAR | 18 |
| 41267 | 5000 | `AdequaÆo de meio bucal` | null | PARTICULAR | 0 |

O caso principal de reprodução é o `id 40595`.

### Materiais diretos do 5000
O procedimento `40595` tem 18 vínculos diretos, com 17 materiais únicos e uma duplicidade do material `3365`:
- `00130` Álcool 70% (`material_id 3355`)
- `00160` Algodão Hidrófilo 500mg (`3358`)
- `01000` Babador Descartável (`3365`) em duas linhas, com quantidades diferentes
- `02511` BOTOX (`3434`)
- `02830` Copo Descartável Café CONSULTÓRIO (`3445`)
- `06050` Gorro Branco com Elástico (`3481`)
- `06070` Guardanapo de Papel Grande - Pacote com 100 unidad (`3482`)
- `10210` Luva de Procedimento (`3517`)
- `11020` Máscara com Elastico (`3518`)
- `15000` BARREIRA - Saquinho de Juju (canetas) - Pacote com (`3556`)
- `15010` BARREIRA - Saquinho para Refletor - Pacote com 150 (`3557`)
- `15020` BARREIRA - Saco Hamburguer 22x17 - Pacote com 100 (`3558`)
- `15030` BARREIRA - Saquinho para Óculos - Pacote com 100 u (`3559`)
- `15090` Seringa Descartável - 3ml (`3562`)
- `15100` Seringa Descartável - 1ml (`3563`)
- `17000` Vaselina Líquida (`3577`)
- `17010` Vaselina Sólida (`3578`)

### Comparação com `00205 - Botox`
Os registros do Procedimento Genérico `00205 - Botox` consultados na base mostram duas ocorrências com 17 materiais e uma ocorrência vazia:
- `id 614` com 17 materiais
- `id 628` com 17 materiais
- `id 669` com 0 materiais

O conjunto de códigos, nomes e quantidades do procedimento `5000` coincide com o footprint do `00205 - Botox` em `614`, com a diferença de uma duplicidade adicional de `Babador Descartável` (`material_id 3365`) no `5000`.

Isso é forte indício de **materialização legada** de materiais herdados que passaram a ficar salvos como vínculos diretos do procedimento.

## 13. Resultado da varredura ampla
### Procedimentos com `procedimento_generico_id` nulo/vazio e materiais vinculados
- **224 procedimentos distintos**
- **6249 vínculos de materiais** no total

### Distribuição por tabela
| tabela | procedimentos distintos | vínculos de materiais |
| --- | ---: | ---: |
| sem nome resolvido na consulta | 112 | 3060 |
| Tabela Exemplo | 111 | 3171 |
| PARTICULAR | 1 | 18 |

O caso `5000` é, portanto, apenas o caso principal de reprodução, não o único caso com essa condição.

### Amostra representativa dos casos encontrados
Os casos consultados mostram grande repetição por tabelas e clones de cadastro, por exemplo:
- `ABERTURA IMPLANTE` (`codigo 1`)
- `AUMENTO DE COROA CLINICA` (`codigo 2`)
- `BIOMATERIAL` (`codigo 3`)
- `BOTOX` (`codigo 4`)
- `CIMENTAÇÃO AD.` (`codigo 5`)
- `CONSULTA INICIAL` (`codigo 12`)
- `COROA ZIRCONIA` (`codigo 17`)
- `E-MAX INLAY-ONLAY` (`codigo 18`)
- `ENDO INCISIVOS` (`codigo 19`)
- `ENDO MOLAR` (`codigo 20`)
- `ENDO PRÉ` (`codigo 21`)
- `IMPLANTE+PROTOCOLO` (`codigo 31`)
- `PRÓTESE FIXA ADESIVA` (`codigo 48`)
- `RASPAGEM` (`codigo 52`)
- `RESTAURAÇÃO 2` (`codigo 56`)

Esses exemplos aparecem em mais de uma linha interna e em mais de uma tabela, o que reforça a presença de dados legados e clones cadastrais.

### Procedimentos com genérico preenchido e materiais diretos
- **3 procedimentos distintos**
- **33 vínculos de materiais**

Distribuição por tabela:
| tabela | procedimentos distintos | vínculos de materiais |
| --- | ---: | ---: |
| PARTICULAR | 2 | 16 |
| Tabela Exemplo | 1 | 17 |

Exemplos encontrados:
- `CONSULTA INICIAL` (`codigo 12`, `procedimento_generico_id 82`, `17` materiais)
- `Alinhadores Estéticos` (`codigo 323`, `procedimento_generico_id 6`, `15` materiais)
- `Ajuste oclusal - (por sesso)` (`codigo 5010`, `procedimento_generico_id 6`, `1` material)

Isso não prova, por si só, erro, porque procedimentos com genérico podem ter materiais próprios reais; mas é um ponto de atenção para futura distinção entre próprio e herdado.

## 14. Fluxo frontend ao selecionar `Selecione...`
No frontend atual:
- a combo é exibida como vazia/placeholder quando `procedimento_generico_id` é nulo;
- `procAplicarDadosEditor(data)` converte `procedimento_generico_id` nulo em valor vazio (`""`);
- `procSalvar()` envia `procedimento_generico_id: null` quando o valor do combo está vazio;
- `procAtualizarMateriaisEditorVisualizacao()` usa o valor atual da combo para recompor a grade;
- `procComporMateriaisEditorPorGenerico()` trata o genérico visual como `0` quando a combo está vazia, então não busca herdados novos.

O ponto crítico é que qualquer material persistido como vínculo direto do procedimento é tratado como material próprio e permanece na recomposição.

## 15. Fluxo frontend ao sair de `Selecione...` para outro genérico
Quando o usuário escolhe outro genérico:
- o frontend recompõe os materiais;
- tenta preservar os próprios reais da intervenção atual;
- remove os herdados antigos;
- busca os herdados do novo genérico;
- renderiza novamente a grade.

Esse fluxo está correto para dados bem classificados. O problema aparece quando os vínculos já persistidos são herança antiga materializada como se fossem próprios, porque eles passam a ser preservados como próprios.

## 16. Fluxo backend ao salvar `procedimento_generico_id` nulo/vazio
O backend, em modo leitura e gravação:
- normaliza `procedimento_generico_id` vazio como `None`;
- ao salvar sem genérico, persiste `procedimento_generico_id = NULL`;
- ao detalhar um procedimento, compõe `materiais_vinculados` a partir dos vínculos diretos do procedimento mais os materiais herdados do genérico atual;
- quando o genérico é nulo, a lista herdada fica vazia.

Ou seja: o backend zera corretamente a FK do genérico, mas não apaga vínculos diretos antigos já existentes.

## 17. Origem provável dos materiais residuais no procedimento 5000
A origem provável é **materialização legada** de materiais herdados de `00205 - Botox` que ficaram gravados como vínculos diretos do procedimento.

Isso é sustentado por:
- `procedimento_generico_id = null` no `5000`;
- materiais diretos persistidos na tabela de vínculos;
- footprint de materiais equivalente ao Botox `00205`;
- duplicidade adicional de `Babador Descartável`, sugerindo mistura de dado legado com edição posterior.

## 18. Origem provável dos materiais residuais em outros casos
A varredura ampla mostrou 224 procedimentos distintos com `procedimento_generico_id` nulo/vazio e materiais vinculados.

A origem provável, em parte desses casos, é a mesma:
- material herdado antigo materializado como próprio;
- clones de cadastro;
- ou procedimentos realmente próprios, sem marcador confiável para separar as situações.

Sem um marcador explícito por vínculo, não dá para distinguir com segurança todos os casos apenas pela leitura atual.

## 19. Há indício de materialização legada?
Sim, o indício é forte.

O caso `5000` coincide muito de perto com o conjunto de materiais do `00205 - Botox`. Isso sugere que o procedimento passou por herança e os materiais herdados foram materializados como vínculos diretos.

## 20. Os materiais do 5000 coincidem com o antigo genérico 00205 - Botox?
Sim, em termos de códigos, nomes e quantidades do catálogo de materiais.

O principal desvio observado é a duplicidade extra de `Babador Descartável` no `5000`.

## 21. Onde a regra atual é insuficiente
A regra atual é insuficiente porque:
- `Selecione...` é tratado como `procedimento_generico_id = null`, mas os vínculos diretos antigos continuam existindo;
- o frontend consegue recompor a visualização, mas não consegue distinguir com segurança material próprio real de material herdado materializado quando o dado legado já está gravado como próprio;
- o backend zera o genérico, mas não faz saneamento dos vínculos diretos residuais;
- não há marcador confiável de origem no vínculo persistido antigo.

## 22. Hipóteses confirmadas
- **Hipótese A**: confirmada. O procedimento `5000` tem materiais herdados antigos materializados como próprios no banco.
- **Hipótese B**: confirmada parcialmente. O backend zera o `procedimento_generico_id`, mas os vínculos diretos materializados permanecem.
- **Hipótese C**: confirmada como efeito operacional. O frontend preserva o que está gravado como próprio.
- **Hipótese D**: confirmada. A regra `Selecione...` não estava explicitamente tratada como uma classe própria de estado em termos de saneamento de vínculos legados.
- **Hipótese F**: descartada como explicação única. Não parece ser só o `5000`.
- **Hipótese G**: confirmada. O problema é geral, mas o `5000` é o caso mais visível e mais fácil de reproduzir.
- **Hipótese H**: confirmada. Existem outros procedimentos/intervenções com `procedimento_generico_id` vazio/nulo e materiais vinculados.

## 23. Hipóteses descartadas
- Não parece ser apenas um bug visual do frontend.
- Não parece ser apenas um caso isolado do `5000`.
- Não parece ser apenas uma falha de seleção da combo sem qualquer componente de legado.

## 24. Diagnóstico provável
O diagnóstico mais provável é uma combinação de fatores:
1. o procedimento `5000` foi desassociado do genérico;
2. os vínculos diretos herdados permanecem gravados como se fossem próprios;
3. o frontend e o backend atuais preservam esses vínculos porque não possuem um marcador histórico confiável para separar próprio de herdado legado;
4. a regra `Selecione...` está correta no plano de `procedimento_generico_id`, mas insuficiente para limpar ou reinterpretar os vínculos residuais já persistidos.

## 25. Menor correção futura recomendada
A menor correção futura segura não deve ser uma limpeza ampla imediata.

Recomendação:
- criar uma etapa separada de classificação dos vínculos legados;
- definir claramente quais vínculos são próprios reais e quais são herança materializada;
- só depois aplicar correção pontual ou plano controlado de saneamento, com backup e auditoria própria;
- em paralelo, manter a leitura do frontend/backend respeitando `Selecione...` como ausência de genérico.

## 26. Tipo de correção futura mais provável
A correção futura mais provável deve ser uma **combinação**:
- ajuste de regra/contrato para leitura e recomposição;
- eventual saneamento controlado de dados;
- etapa separada de validação por caso.

Não é seguro concluir, a partir desta auditoria, que a solução seja apenas frontend ou apenas backend.

## 27. Riscos de limpar dados diretamente
- apagar materiais próprios reais por engano;
- remover vínculos úteis de outros procedimentos;
- perder histórico;
- quebrar procedimentos com genérico preenchido que usam materiais próprios legítimos;
- afetar casos duplicados/clones de cadastro.

## 28. Riscos de corrigir só no frontend
- o banco continuará com vínculos residuais materializados;
- a inconsciência voltará em reabertura ou em rotinas de leitura;
- o problema fica mascarado, não resolvido.

## 29. Riscos de corrigir só no backend
- se o backend não souber distinguir vínculo próprio real de herança materializada, pode apagar dados válidos;
- se apenas alterar a composição, o legado persistido continua podendo contaminar outras rotinas.

## 30. Checklist de teste obrigatório para o caso 5000
Antes de qualquer futura correção, testar:
1. Abrir o procedimento/intervenção `5000`.
2. Confirmar que a combo está em `Selecione...`.
3. Confirmar se a grade mostra materiais residuais.
4. Trocar para o genérico `00001 - Abertura e drenagem cirúrgica de abscesso`.
5. Confirmar se a grade recompõe corretamente.
6. Trocar novamente para `Selecione...`.
7. Confirmar se os herdados antigos somem e só permanecem próprios reais, se existirem.
8. Salvar e reabrir.
9. Confirmar se `procedimento_generico_id` fica nulo e se os vínculos residuais permanecem ou não, conforme a regra futura definida.

## 31. Checklist de teste obrigatório para outros casos encontrados
Repetir o teste anterior em pelo menos:
- um caso da `Tabela Exemplo`;
- um caso da tabela sem nome resolvido na consulta;
- um caso com genérico preenchido e materiais diretos;
- um caso com materiais e sem genérico diferente do `5000`.

## 32. Próxima etapa recomendada
A próxima etapa recomendada é uma etapa separada de decisão técnica para saneamento/classificação dos vínculos legados, antes de qualquer correção funcional ampla.

Se houver correção, ela deve vir acompanhada de:
- validação por SELECT;
- critérios explícitos de preservação de materiais próprios;
- risco documentado para os demais 223 procedimentos sem genérico e com materiais;
- e checklist completo de regressão antes e depois.

