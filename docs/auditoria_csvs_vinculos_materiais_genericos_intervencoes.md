# Auditoria de CSVs de Vinculos entre Materiais, Genericos e Intervencoes

## 1. Objetivo
Auditar os dois CSVs untracked ligados a Materiais, Procedimentos Genericos e Intervencoes/Procedimentos, comparando-os com as versoes Markdown ja versionadas, para recomendar o destino seguro de cada arquivo sem alterar o repositorio.

## 2. Contexto
Esta auditoria acontece depois da organizacao da documentacao principal, da consolidacao dos contratos vigentes e da preservacao de documentos sensiveis de modulos. Os dois CSVs restantes sao evidencias tecnicas de casos especificos e precisam ser avaliados com cuidado porque tratam de vinculacao entre materiais, genericos e procedimentos.

## 3. Branch e estado Git
- Branch atual: `modularizacao-segura-fase-1`
- Estado observado no inicio: sem tracked modificados; apenas untracked antigos, incluindo os dois CSVs auditados.
- Ultimos commits recentes relevantes: `20e03c2`, `8968ded`, `6db88df`, `ceb9784`, `579a76d`, `0701705`, `a513b67`, `58c913d`, `680749d`, `9c4df78`.

## 4. Arquivos CSV auditados
- `docs/caso_5000_detalhamento_vinculos_materiais_vs_generico_00205.csv`
- `docs/relatorio_procedimentos_generico_nulo_com_materiais_vinculados.csv`

## 5. Arquivos Markdown comparados
- `docs/caso_5000_detalhamento_vinculos_materiais_vs_generico_00205.md`
- `docs/relatorio_procedimentos_generico_nulo_com_materiais_vinculados.md`

## 6. Metodologia de comparacao
Para cada CSV:
1. ler o conteudo bruto;
2. ler o Markdown correspondente;
3. comparar cobertura de dados, resumo, conclusao e campos tecnicos;
4. verificar se o Markdown ja preserva a evidencia principal e a decisao documental;
5. avaliar risco de perda de informacao se o CSV ficar fora do Git;
6. avaliar risco de ruido se o CSV for versionado agora.

## 7. Analise do CSV do caso 5000
### Resumo
O CSV traz o detalhamento linha a linha dos vinculos de materiais do procedimento `5000` na tabela `PARTICULAR`, com referencia ao generico provavel `00205 - Botox`.

### O que ele contem
- identificadores de procedimento, vinculo, material e generico;
- descricao do material;
- quantidade e unidade;
- origem atual no sistema;
- flag de existencia no footprint do `00205`;
- classificacao sugerida;
- observacao;
- coluna de decisao do usuario.

### Comparacao com o Markdown
O Markdown correspondente ja registra:
- resumo do caso;
- contagem de vinculos diretos;
- materiais unicos;
- comparacao com o generico `00205`;
- tabela detalhada dos vinculios;
- itens que parecem herdados antigos;
- itens que exigem revisao manual;
- recomendacao de nao sanear automaticamente;
- orientacao de teste futuro.

### Conclusao tecnica
O CSV nao adiciona nova regra funcional alem do que o Markdown ja preserva, mas funciona como evidencia bruta e reprodutivel da mesma analise.

### Risco de versionar agora
- duplicar um artefato ja bem documentado em Markdown;
- aumentar ruido documental sem acrescentar regra nova.

### Risco de nao versionar
- perder a forma bruta e machine-readable da evidencia.

### Recomendacao individual
**B. Manter fora por enquanto**, porque o Markdown versionado ja cobre o conteudo essencial e a regra pratica do caso 5000. Se houver necessidade futura de evidencia bruta para automacao ou forense documental, este CSV pode entrar em um commit historico separado.

## 8. Analise do CSV do relatorio de generico nulo
### Resumo
O CSV lista procedimentos, quantidades de vinculos de materiais, classificacao e generico provavel, destacando casos com `procedimento_generico_id` nulo e potencial saneamento futuro com backup.

### O que ele contem
- codigo e nome do procedimento;
- tabela;
- procedimento generico atual;
- quantidade de vinculos;
- materiais unicos;
- duplicidade;
- classificacao;
- generico provavel;
- observacao tecnica por linha.

### Comparacao com o Markdown
O Markdown correspondente ja preserva:
- o caso 5000 em destaque;
- o resumo do relatorio;
- a leitura dos grupos de casos;
- os criterios de classificacao;
- a conclusao de que nao ha saneamento em massa seguro nesta etapa;
- a recomendacao de revisao manual e backup antes de qualquer acao.

### Conclusao tecnica
O CSV e um espelho bruto do relatorio, mas nao introduz regra nova nem decisao diferente da ja documentada no Markdown.

### Risco de versionar agora
- duplicar um relatorio analitico ja coberto em Markdown;
- tornar o conjunto documental mais pesado sem ganho normativo.

### Risco de nao versionar
- perder o formato bruto da evidencia, caso seja necessario alimentar analises automaticas no futuro.

### Recomendacao individual
**B. Manter fora por enquanto**, porque o Markdown versionado ja cobre a analise, as conclusoes e as orientacoes operacionais.

## 9. Comparacao geral com os Markdown
Em ambos os casos, os Markdown:
- ja existem e estao versionados;
- preservam o resumo humano, a classificacao e a recomendacao;
- cobrem o conteudo funcional principal;
- funcionam como fonte documental leitura-primeiro.

Os CSVs:
- trazem a forma bruta, tecnica e mais facil de reprocessar;
- nao trazem regra nova que justifique commit imediato;
- sao uteis como evidencia, mas nao precisam entrar agora.

## 10. Impacto funcional
Os dois arquivos conversam diretamente com:
- Materiais;
- Procedimentos Genericos;
- Intervencoes / Procedimentos;
- origem / herdado;
- vinculios de materiais;
- saneamento legado;
- validacao de casos especificos como `5000` e `00205`.

Eles nao parecem tratar de login, senha interna, seeds de novas contas ou exclusao segura de clinicas. O foco e o saneamento documental/tecnico de relacao entre materiais e genericos.

## 11. Riscos de versionar
- criar duplicacao documental entre CSV e Markdown;
- espalhar o mesmo caso tecnico em multiplos formatos sem ganho normativo;
- aumentar o custo de manutencao e comparacao futura.

## 12. Riscos de nao versionar
- perder a forma bruta da evidencia;
- depender apenas do Markdown, que e suficiente para leitura humana, mas menos pratico para analise automatizada.

## 13. Recomendacao geral
Manter os dois CSVs fora do Git por enquanto, preservando como artefatos de trabalho, porque as versoes Markdown versionadas ja cobrem o conteudo relevante para a documentacao atual. Se houver necessidade futura de arquivo bruto para auditoria automatizada, eles podem ser trazidos em um commit historico separado, sem misturar com regras vigentes.

## 14. Confirmacao final
Nenhum CSV foi alterado, nenhum Markdown existente foi alterado e nada foi mudado alem deste relatorio novo.
