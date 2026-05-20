# Varredura de `eds70.bak` e `eds70dat.mdf` - Anamnese clínica ID 1

## 1. Contexto

A conta `gleissontel@gmail.com` / `clinica_id 1` deveria ter os questionarios:

- Anamnese de Saude
- Anamnese pessoal
- Ficha complementar
- Implante
- Principal

No sistema atual a API autenticada retorna apenas `Principal`.

## 2. Objetivo

Executar uma varredura somente leitura em:

- `D:\\BRANA ARQUIVOS\\PROJETO_PRECIFICACAO_LEGADO\\Dados\\eds70.bak`
- `D:\\BRANA ARQUIVOS\\PROJETO_PRECIFICACAO_LEGADO\\Dados\\eds70dat.mdf`

para localizar os questionarios ausentes sem alterar nada.

## 3. Estado inicial do projeto atual

- Branch: `modularizacao-segura-fase-1`
- `git status --short`: apenas documentos `docs/*` untracked
- `git diff --stat`: vazio
- `git diff -- frontend/app.js`: vazio
- `git diff -- frontend/index.html`: vazio
- `node --check frontend/app.js`: OK

## 4. Arquivos analisados

- `D:\\BRANA ARQUIVOS\\PROJETO_PRECIFICACAO_LEGADO\\Dados\\eds70.bak`
- `D:\\BRANA ARQUIVOS\\PROJETO_PRECIFICACAO_LEGADO\\Dados\\eds70dat.mdf`

## 5. Evidencia de conteudo relevante

Os dois arquivos sao arquivos de banco SQL Server:

- `eds70.bak` inicia com a assinatura `TAPE`
- `eds70dat.mdf` apresenta assinatura de arquivo de dados SQL Server

Achados por busca binaria:

- `Principal`
- `Implante`
- `Ficha complementar`
- `Anamnese de Saude`
- `Anamnese pessoal`
- `gleissontel@gmail.com`

Ou seja, os dois arquivos contem, em strings internas, os cinco nomes esperados da lista de Anamnese.

## 6. Trechos encontrados

Trecho relevante encontrado no `.bak` e no `.mdf`:

- `Principal`
- `Implante`
- `Ficha complementar`
- `Anamnese de Saúde`
- `Anamnese pessoal`

Tambem foi localizada a conta:

- `gleissontel@gmail.com`

## 7. Interpretacao segura

O achado e forte evidência de que os questionarios ausentes existem nesse legado SQL Server, embutidos nos arquivos `eds70.bak` e `eds70dat.mdf`.

Pontos de cautela:

- a busca feita foi apenas por leitura de strings internas
- ainda nao foi feita restauracao, attach ou execucao de script
- ainda nao foi validado o schema relacional completo com consulta SQL real

Conclusao conservadora:

- existe base material no `eds70.bak` / `eds70dat.mdf` para restauracao controlada
- os quatro questionarios ausentes aparecem nessas fontes

## 8. Plano de restauracao segura

Sem alterar nada agora, o plano recomendado e:

1. manter o banco atual intacto
2. copiar os dois arquivos para uma area de trabalho de analise, se necessario, sem sobrescrever originais
3. abrir a fonte SQL Server em modo somente leitura numa instancia isolada de teste
4. identificar as tabelas exatas de `anamnese_questionarios`, `anamnese_perguntas` e `anamnese_respostas`
5. exportar apenas os registros da `clinica_id 1`
6. comparar com o banco atual
7. construir um `dry-run` de insercao dos quatro questionarios ausentes
8. inserir primeiro apenas os questionarios
9. inserir depois as perguntas na ordem original
10. nao importar respostas sem validacao explicita
11. validar `GET /anamnese/questionarios`
12. testar no navegador

## 9. Comparacao preliminar com o banco atual

Banco atual da clinica 1:

- apenas `Principal`
- `17` perguntas

Fonte `eds70.bak` / `eds70dat.mdf`:

- contem os cinco nomes esperados
- contem a conta `gleissontel@gmail.com`

Conclusao:

- o legado SQL Server e a fonte mais promissora encontrada ate agora

## 10. Riscos

- risco de restaurar em banco/clínica errada
- risco de duplicidade
- risco de perder ordem de perguntas
- risco de importar respostas sem mapeamento
- risco de alterar producao sem validar em ambiente isolado

## 11. O que nao foi alterado

Confirmado:

- `frontend/app.js` nao foi alterado
- `frontend/index.html` nao foi alterado
- backend nao foi alterado
- banco atual nao foi alterado
- banco legado nao foi alterado
- nenhum dado foi inserido
- nenhum dado foi atualizado
- nenhum dado foi apagado
- nenhum commit foi feito

## 12. Checks executados

- leitura dos tamanhos dos arquivos
- busca binaria em `eds70.bak`
- busca binaria em `eds70dat.mdf`
- validacao da assinatura inicial dos arquivos
- `node --check frontend/app.js`
- `git status --short`
- `git diff --stat`

## 13. Próximo passo recomendado

Agora existe base para uma restauracao controlada, mas o proximo passo correto ainda e diagnostico e exportacao em ambiente isolado, nao importacao direta no banco atual.

Proximo passo seguro:

1. montar uma instancia de teste/isolamento para o SQL Server legado
2. abrir `eds70.bak` / `eds70dat.mdf` somente leitura
3. exportar apenas a Anamnese da clinica 1
4. gerar script de `dry-run`
5. revisar antes de qualquer aplicacao no banco atual

