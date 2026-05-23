# Intervenções / Procedimentos / Seeds — Subetapa 3H — Seed canônico Brana 336

## 1. Objetivo
Gerar, de forma controlada e versionada, o seed canônico próprio da Brana com 336 procedimentos, usando a fonte auditada somente para extrair `codigo` e `nome`, sem dependência runtime da clínica 1/tabela 18.

## 2. Contexto
A Subetapa 3E mostrou `Tabela exemplo = 681` e `Brana = 0` na clínica de teste `15`. A Subetapa 3F corrigiu parcialmente o roteamento. A Subetapa 3G consolidou o contrato: a Brana deve nascer sanitizada, sem materiais, fases, composições, `procedimento_generico_id` ou campos financeiros.

## 3. Contrato 3G respeitado
Esta subetapa respeita o contrato consolidado:
- Brana deve ter seed canônico próprio;
- Brana deve ter 336 procedimentos;
- Brana deve conter somente `codigo` e `nome` no seed canônico;
- Brana não deve ter materiais vinculados;
- Brana não deve ter fases;
- Brana não deve ter composições;
- Brana não deve ter `procedimento_generico_id`;
- Brana não deve nascer com preço, custo, tempo, garantia, repasse ou observações;
- a clínica 1/tabela 18 pode ser fonte auditada, mas não dependência runtime.

## 4. Fonte auditada usada
Fonte auditada lida somente por SELECT:
- clínica `1`
- tabela `18`
- código `4`

Quantidade encontrada:
- `336` procedimentos
- `33` vínculos de materiais

## 5. Confirmação de leitura somente por SELECT
A fonte auditada foi consultada apenas para leitura, sem gravação, sem update, sem delete e sem insert.

## 6. Validações feitas na fonte
Foram validadas:
- quantidade total de registros = `336`;
- códigos não nulos;
- nomes não nulos;
- unicidade de `codigo` dentro da fonte;
- unicidade exata de `codigo + nome` dentro da fonte.

Observação:
- houve mojibake/UTF-8 quebrado em nomes da fonte; isso foi apenas registrado e não corrigido.

## 7. Arquivo de seed canônico criado
Arquivo criado:
- `backend/seeds/procedimentos_brana.py`

Conteúdo do arquivo:
- `PROCEDIMENTOS_BRANA_PADRAO = [...]`
- `get_procedimentos_brana_padrao()`

## 8. Estrutura do seed
Cada item do seed canônico contém somente:
- `codigo`
- `nome`

O helper retornando a lista faz apenas cópia em memória e não acessa banco, arquivo externo, commit ou signup.

## 9. Confirmação de que o seed tem somente `codigo` e `nome`
Confirmado localmente:
- `336` itens;
- somente as chaves `codigo` e `nome`;
- nenhum item com campo nulo de código ou nome.

## 10. Confirmação de que não foram incluídos materiais vinculados
O arquivo criado não contém:
- materiais vinculados;
- `procedimento_material`;
- qualquer vínculo de materiais.

## 11. Confirmação de que não foram incluídas fases
O arquivo criado não contém:
- fases;
- `procedimento_fase`.

## 12. Confirmação de que não foram incluídas composições
O arquivo criado não contém:
- composições;
- listas compostas;
- herança pronta.

## 13. Confirmação de que não foi incluído `procedimento_generico_id`
O arquivo criado não contém:
- `procedimento_generico_id`;
- qualquer ponte de genérico.

## 14. Confirmação de que não foram incluídos preço/custo/tempo/garantia/repasse/observações
O arquivo criado não contém nenhum desses campos financeiros ou técnicos sensíveis.

## 15. Confirmação de que mojibake/UTF-8 não foi corrigido
Nenhum nome foi corrigido nesta subetapa. O mojibake da fonte auditada foi apenas observado.

## 16. Checks executados
- `python -m py_compile backend\\seeds\\procedimentos_brana.py backend\\services\\signup_service.py backend\\seeds\\procedimentos_padrao.py`
- `python -m compileall backend`
- validação local em memória:
  - 336 itens;
  - somente `codigo` e `nome`;
  - nenhum campo proibido;
  - nenhum código nulo;
  - nenhum nome nulo.

## 17. Arquivos alterados
- `backend/seeds/procedimentos_brana.py`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3h_seed_canonico_brana_336.md`

## 18. Próxima subetapa recomendada
Subetapa 3I — ajustar o signup para consumir o seed canônico `backend/seeds/procedimentos_brana.py`, removendo a dependência runtime da clínica 1/tabela 18, sem alterar contas existentes.
