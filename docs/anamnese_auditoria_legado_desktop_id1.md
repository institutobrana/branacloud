# Auditoria no legado desktop - Anamnese clínica ID 1

## 1. Contexto

A conta `gleissontel@gmail.com` / `clinica_id 1` deveria ter:

- Anamnese de Saude
- Anamnese pessoal
- Ficha complementar
- Implante
- Principal

No sistema atual, a conta continua retornando apenas `Principal`.

## 2. Objetivo

Fazer uma varredura somente leitura no legado desktop em:

`D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas`

para localizar qualquer fonte que ainda contenha os questionarios ausentes.

## 3. Estado inicial do projeto atual

- Branch: `modularizacao-segura-fase-1`
- `git status --short`: apenas documentos `docs/*` untracked
- `git diff --stat`: vazio
- `git diff -- frontend/app.js`: vazio
- `git diff -- frontend/index.html`: vazio
- `node --check frontend/app.js`: OK

## 4. Fontes do legado inventariadas

Fontes relevantes encontradas no legado:

- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\.env`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\estrutura.txt`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\main.py`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\brana_saas_full_20260313_234848.zip`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\brana_saas_full_20260330_204101.zip`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\brana_saas_full_20260330_204513.zip`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\brana_saas_full_20260413_130945.zip`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\brana_saas_to_render_20260406.zip`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\pre_delete_clinicas_2_5_20260413_142730.zip`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\brana_saas_full_20260313_234848\extra_files\dados.db`

## 5. Busca textual no legado

Termos pesquisados:

- `gleissontel@gmail.com`
- `Anamnese de Saúde`
- `Anamnese pessoal`
- `Ficha complementar`
- `Implante`
- `Principal`
- `anamnese_questionarios`
- `anamnese_perguntas`
- `anamnese_respostas`

Resultado:

- a conta `gleissontel@gmail.com` aparece em backups e scripts do legado
- `anamnese_questionarios`, `anamnese_perguntas` e `anamnese_respostas` aparecem em estrutura, código e metadados
- nao apareceu uma fonte com os quatro questionarios ausentes

## 6. Bancos SQLite/DB analisados

Banco SQLite localizado:

- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\brana_saas_full_20260313_234848\extra_files\dados.db`

Conclusao:

- contem apenas tabelas antigas de escritorio/financeiro/usuarios
- nao contem tabelas de Anamnese
- nao contem `anamnese_questionarios`, `anamnese_perguntas` ou `anamnese_respostas`

## 7. ZIPs/backups analisados

ZIPs analisados:

- `brana_saas_full_20260330_204101.zip`
- `brana_saas_full_20260330_204513.zip`
- `brana_saas_full_20260413_130945.zip`
- `brana_saas_to_render_20260406.zip`
- `pre_delete_clinicas_2_5_20260413_142730.zip`

Achado comum:

- todos trazem `anamnese_questionarios.csv`
- a `clinica_id 1` aparece sempre com apenas `Principal`
- os quatro nomes ausentes nao foram encontrados nesses backups acessiveis

## 8. Dados de Anamnese encontrados

Fonte mais clara localizada:

- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\brana_saas_full_20260413_130945.zip`

Questionario da clinica 1:

- `id_legado=2`
- `nome=Principal`
- `clinica_id_legado=1`

Perguntas encontradas:

- `17` perguntas
- textos correspondentes ao questionario `Principal`

Respostas:

- nao havia respostas exportaveis para a clinica 1 nessa extracao

Conclusao:

- nao foi localizado no legado auditado um conjunto com `Anamnese de Saude`, `Anamnese pessoal`, `Ficha complementar` e `Implante`

## 9. Comparacao com o banco atual

No banco atual da `clinica_id 1`:

- `anamnese_questionarios`: `1` item
- nome: `Principal`
- `anamnese_perguntas`: `17` perguntas

Comparacao:

- o legado auditado e o banco atual estao alinhados entre si para a clinica 1
- a fonte acessivel nao traz os questionarios ausentes

## 10. Arquivos de analise criados

Arquivos de apoio ja gerados no projeto atual:

- `docs/anamnese_legado_inventario_fontes_id1.txt`
- `docs/anamnese_legado_busca_textual_id1.txt`
- `docs/anamnese_legado_bancos_sqlite_id1.txt`
- `docs/anamnese_legado_dumps_sql_id1.txt`
- `docs/anamnese_legado_zips_id1.txt`
- `docs/anamnese_legado_extraido_questionarios_id1.csv`
- `docs/anamnese_legado_extraido_perguntas_id1.csv`
- `docs/anamnese_legado_extraido_respostas_id1.csv`

## 11. Plano de restauracao segura

Como a varredura nao encontrou a fonte com os quatro questionarios ausentes, o plano seguro e:

1. nao importar nada ainda
2. manter o banco atual intacto
3. procurar backup externo/manual adicional, se existir
4. se o usuario fornecer a fonte correta, refazer uma extracao controlada
5. comparar por `clinica_id` e nome antes de qualquer `INSERT`
6. inserir primeiro os questionarios ausentes
7. inserir depois as perguntas na ordem original
8. nao importar respostas sem validação explicita
9. validar o endpoint autenticado
10. testar no navegador

Se uma fonte confiavel aparecer futuramente, usar `dry-run` antes da execucao real e criar backup do banco atual antes de qualquer alteracao.

## 12. Riscos

- risco de inserir questionarios na clinica errada
- risco de duplicidade
- risco de quebrar a ordem das perguntas
- risco de perder vinculos com respostas
- risco de importar dados sensiveis sem validação

## 13. O que nao foi alterado

Confirmado:

- `frontend/app.js` nao foi alterado
- `frontend/index.html` nao foi alterado
- backend nao foi alterado
- banco atual nao foi alterado
- banco legado nao foi alterado
- endpoints nao foram alterados
- nenhum dado foi inserido
- nenhum dado foi atualizado
- nenhum dado foi apagado
- nenhum commit foi feito

## 14. Checks executados

- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `node --check frontend/app.js`
- inventario de fontes do legado
- busca textual ampla no legado
- leitura de ZIPs em modo leitura
- leitura de SQLite em modo leitura

## 15. Próximo passo recomendado

Nao ha base segura no legado auditado para restaurar os quatro questionarios ausentes.

Proximos passos possiveis:

- procurar outro backup externo/manual
- usar uma origem de producao/ambiente remoto, se existir e for diferente
- reconstruir manualmente os quatro questionarios faltantes, somente com autorização e conteudo validado

