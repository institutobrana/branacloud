# Fase G.2B.1B.4 - Consolidacao final do dry-run

Data: 2026-08-03

## 1. Resultado
- status: `BLOQUEADA PARA EXECUCAO DE BACKFILL; APROVADA APENAS PARA PLANEJAMENTO DOCUMENTAL`
- escopo desta fase: consolidacao read-only, validacao de artefatos e decisao formal por categoria
- nenhuma escrita foi realizada em banco, model, migration, seeds ou frontend

## 2. Banco
- tabela: `public.simbolo_grafico_catalogo`
- total: `1113`
- origem nula: `1113`
- origem preenchida: `0`
- escritas: `0`
- indice/scheme alterado nesta fase: `nao`

## 3. Evolucao dos dry-runs
- primeira execucao: revelou `seed_interno` e `catalogo_oficial`, mas ainda deixava casos sem prova suficiente
- reconciliacao: separou a leitura funcional dos `636` registros oficiais contra `81` `legacy_id` distintos
- amostragem: confirmou que os casos antes indefinidos precisavam de provas positivas adicionais
- resultado final: `636` `catalogo_oficial`, `464` `seed_interno`, `2` `fixture_teste`, `11` `asset_auxiliar`, `0` `indefinido`, `0` conflitos

## 4. Catalogo oficial
- itens funcionais: `81`
- linhas fisicas: `636`
- clinicas: `8`
- chave funcional: `legacy_id` + assinatura normalizada do snapshot oficial
- fonte: snapshot oficial do catalogo e repeticao por clinica no banco legado
- decisao: `autorizado para planejamento documental de backfill; nao autorizado para escrita nesta fase`

## 5. Seeds
- quantidade: `464`
- assinaturas: codigos tecnicos sem `legacy_id`, com assinatura normalizada e referencia no conjunto complementar
- fontes: seed complementar e classificacao deterministica do classificador de origem
- amostragem: validada por dry-run read-only e por testes unitarios associados
- falsos positivos: `0` confirmados no resultado final
- decisao: `autorizado para planejamento documental; backfill ainda nao executado`

## 6. Fixtures
- quantidade: `2`
- fontes: registros `sim_simb1.bmp` com descricao de teste manual em homologacao
- decisao: `autorizado apenas como categoria tecnica/teste; nao entra em backfill operacional da grade`

## 7. Assets auxiliares
- quantidade: `11`
- fontes: registros `sim_30.bmp` com `imagem_custom` presente
- decisao: `categoria tecnica comprovada; nao entra em backfill operacional da grade`

## 8. Usuarios
- quantidade: `0`
- motivo do resultado: nao apareceu prova inequívoca de criacao por usuario local no banco legado auditado; o fluxo React/POST ainda nao fornece evidência de persistencia de simbolo usuario
- decisao: `bloqueado`

## 9. Indefinidos
- quantidade anterior: `21`
- reclassificacao: os `21` registros anteriores foram absorvidos por categorias positivas comprovadas
- fontes: assinatura funcional, descricao de teste manual e evidencia de `imagem_custom`
- quantidade final: `0`

## 10. Conflitos
- quantidade: `0`
- tratamento: nenhum conflito permaneceu; o classificador prioriza evidencia forte e cai para `indefinido` apenas quando nao encontra prova suficiente

## 11. Classificador
- regras: `R001` catalogo oficial, `R002` seed interno, `R003` fixture de teste, `R004` asset auxiliar
- fallback: `indefinido`
- determinismo: o resultado final foi reproduzido de forma identica no dry-run e no resumo em JSON/CSV
- read-only: nenhuma rotina desta fase escreve em banco ou altera `origem`

## 12. Resultado final
- catalogo_oficial: `636`
- seed_interno: `464`
- fixture_teste: `2`
- asset_auxiliar: `11`
- simbolo_usuario: `0`
- copia_tecnica: `0`
- indefinido: `0`
- conflitos: `0`
- total: `1113`

## 13. Categorias autorizadas
- `catalogo_oficial`: `autorizado para planejamento documental`; fonte positiva: `legacy_id` + snapshot oficial; decisao: `nao executar backfill nesta fase`
- `seed_interno`: `autorizado para planejamento documental`; fonte positiva: assinatura tecnica complementar; decisao: `nao executar backfill nesta fase`
- `fixture_teste`: `bloqueado para backfill operacional`; fonte positiva: descricao de teste manual em homologacao; decisao: manter somente como evidencia tecnica
- `asset_auxiliar`: `bloqueado para backfill operacional`; fonte positiva: `imagem_custom` base64 em `sim_30.bmp`; decisao: manter somente como evidencia tecnica

## 14. Conclusao formal
- a trilha read-only foi consolidada com sucesso;
- os artefatos fecham em `1113` linhas e `0` registros indefinidos;
- a decisao formal e de bloqueio para execucao de backfill nesta rodada;
- a autorizacao atual e apenas para planejamento documental e eventual preparo futuro de subconjuntos, sem qualquer escrita.
