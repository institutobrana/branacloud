# Auditoria no legado - Anamnese clínica ID 1

## 1. Contexto

A conta `gleissontel@gmail.com` / `clinica_id 1` deveria ter:

- Anamnese de Saude
- Anamnese pessoal
- Ficha complementar
- Implante
- Principal

No banco atual ha apenas `Principal`.

## 2. Objetivo

Auditar o legado em:

`D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas`

para localizar os dados antigos perdidos de Anamnese da clinica 1.

## 3. Estado inicial do projeto atual

- Branch: `modularizacao-segura-fase-1`
- `git status --short`: apenas documentos `docs/*` untracked
- `git diff --stat`: vazio
- `git diff -- frontend/app.js`: vazio
- `git diff -- frontend/index.html`: vazio
- `node --check frontend/app.js`: OK

## 4. Fontes do legado inventariadas

Inventario de fontes relevantes no legado:

- arquivos inventariados: `435`
- bancos SQLite/DB encontrados: `1`
- ZIPs relevantes com Anamnese: `5`
- dumps SQL com achados relevantes de Anamnese: nenhum localizado
- CSVs/JSON/TXT/MD/JS/HTML com termos de Anamnese e conta: varios, principalmente docs, scripts e backups

Fontes vistas no legado:

- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\.env`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\brana_saas_full_20260313_234848.zip`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\brana_saas_full_20260330_204101.zip`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\brana_saas_full_20260330_204513.zip`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\brana_saas_full_20260413_130945.zip`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\brana_saas_to_render_20260406.zip`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\pre_delete_clinicas_2_5_20260413_142730.zip`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\brana_saas_full_20260313_234848\extra_files\dados.db`

Observacao:

- `backend/.env` foi inventariado, mas nenhum segredo foi exposto no relatorio.

## 5. Busca textual no legado

Termos pesquisados:

- `gleissontel@gmail.com`
- `Anamnese de Saude`
- `Anamnese pessoal`
- `Ficha complementar`
- `Implante`
- `Principal`
- `anamnese_questionarios`
- `anamnese_perguntas`
- `anamnese_respostas`

Resultado:

- a conta `gleissontel@gmail.com` aparece em varios arquivos de configuracao, scripts e backups
- os termos de Anamnese aparecem em estruturas, scripts e backups
- nao foi encontrada fonte textual confiavel com os quatro questionarios ausentes
- as referencias encontradas em `estrutura.txt`, `main.py` e backups indicam schema, backup ou conteudo de `Principal`, nao um conjunto com os cinco questionarios

## 6. Bancos SQLite/DB analisados

Banco SQLite localizado:

- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\brana_saas_full_20260313_234848\extra_files\dados.db`

Tabelas relevantes:

- `usuarios`
- diversas tabelas financeiras e de procedimentos

Conclusao:

- nao contem tabelas de Anamnese
- nao contem `anamnese_questionarios`
- nao contem `anamnese_perguntas`
- nao contem `anamnese_respostas`

## 7. Dumps SQL analisados

Nao foi localizado dump SQL com registros de `anamnese_questionarios`, `anamnese_perguntas` ou `anamnese_respostas` contendo os cinco questionarios esperados.

O arquivo `backend/main.py` do legado possui trechos de migracao/alteracao de schema para `anamnese_perguntas`, mas isso nao equivale a fonte de dados perdida.

## 8. ZIPs/backups analisados

ZIPs analisados com dados de Anamnese:

- `brana_saas_full_20260330_204101.zip`
- `brana_saas_full_20260330_204513.zip`
- `brana_saas_full_20260413_130945.zip`
- `brana_saas_to_render_20260406.zip`
- `pre_delete_clinicas_2_5_20260413_142730.zip`

Pasta temporaria usada:

- nao foi necessario extrair por cima do projeto
- a leitura foi feita de forma segura, apenas em modo leitura dentro dos ZIPs

Achado comum em todos os ZIPs:

- `anamnese_questionarios.csv` existe
- a clinica 1 aparece com apenas `Principal`
- os nomes `Anamnese de Saude`, `Anamnese pessoal`, `Ficha complementar` e `Implante` nao apareceram como questionarios nesses backups acessiveis

## 9. Dados de Anamnese encontrados

Fonte mais clara localizada para a clinica 1:

- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\brana_saas_full_20260413_130945.zip`

Questionario extraido para clinica 1:

- `id_legado=2`
- `nome=Principal`
- `clinica_id_legado=1`
- `ativo=True`
- `ordem=1`

Perguntas extraidas para esse questionario:

- `17` perguntas
- ordem de `1` a `17`
- textos correspondentes ao questionario de anamnese basico de `Principal`

Respostas:

- nao havia respostas a exportar nessa extracao

Conclusao:

- nao foram localizados os quatro questionarios ausentes no legado auditado
- a fonte encontrada para a clinica 1 replica apenas o estado com `Principal`

## 10. Comparacao com banco atual

Banco atual para `clinica_id 1`:

- `anamnese_questionarios`: `1` item
- nome encontrado: `Principal`
- `anamnese_perguntas`: `17` perguntas vinculadas ao questionario `Principal`

Comparacao:

- banco atual e legado acessivel estao consistentes entre si para a clinica 1
- nao houve evidencia de que `Anamnese de Saude`, `Anamnese pessoal`, `Ficha complementar` ou `Implante` existam em outra fonte do legado auditado
- nao existe, no material consultado, base segura para restaurar os quatro questionarios ausentes

## 11. Arquivos extraidos para analise

Arquivos criados no projeto atual:

- `docs/anamnese_legado_extraido_questionarios_id1.csv`
- `docs/anamnese_legado_extraido_perguntas_id1.csv`
- `docs/anamnese_legado_extraido_respostas_id1.csv`

Esses arquivos contem apenas o recorte da clinica 1 encontrado no legado auditado.

## 12. Plano de restauracao recomendado

Como nao foi encontrada fonte confiavel dos quatro questionarios ausentes:

1. nao importar nada agora
2. procurar backup externo/manual adicional, se existir
3. se o usuario autorizar, reconstruir manualmente os quatro questionarios faltantes com validacao posterior
4. somente depois pensar em insercao controlada no banco atual

Se uma fonte confiavel aparecer no futuro, o plano seguro deve incluir:

1. backup completo do banco atual
2. export atual das tabelas de Anamnese da clinica 1
3. insercao dos questionarios ausentes
4. remapeamento dos ids legados para ids atuais, se necessario
5. insercao das perguntas relacionadas
6. nao importar respostas clinicas sem validacao explicita
7. validacao via `GET /anamnese/questionarios`
8. teste no navegador
9. script com dry-run antes da execucao real
10. commit somente depois dos testes

## 13. Riscos

- risco de importar dados para a clinica errada
- risco de duplicidade
- risco de perder vinculos de perguntas e respostas
- risco de importar respostas sensiveis sem validacao
- necessidade de backup antes de qualquer `INSERT`

## 14. O que nao foi alterado

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

## 15. Checks executados

- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `node --check frontend/app.js`
- inventario de fontes do legado
- busca textual ampla no legado
- leitura de ZIPs do legado em modo leitura
- leitura do SQLite `dados.db` em modo leitura

## 16. Proximo passo recomendado

Nao ha base segura no legado auditado para restaurar os quatro questionarios ausentes.

Proximos caminhos possiveis:

- procurar outro backup externo/manual
- validar um ambiente de producao/Render/Supabase, se existir e for diferente do legado local
- reconstruir manualmente os quatro questionarios ausentes com conteudo fornecido ou autorizado pelo usuario

