# Ficha Pessoal - Anamnese - Revisao do dry-run populacional do questionario Principal antes da migracao

## 1. Objetivo
- Revisar documentalmente os CSV/JSON do dry-run populacional da Anamnese EasyDental para decidir se o questionario Principal da clinica ID 1 precisa ser completado/importado antes de qualquer migracao real de respostas.
- Confirmar se a estrutura atual do Brana Cloud suporta a migracao sem perda de dados ou se existe lacuna estrutural que bloqueia a escrita.
- Registrar evidencias somente leitura, sem migracao, sem escrita e sem alteracao funcional.

## 2. Contexto
- O dry-run populacional foi executado em modo somente leitura sobre `\Dell_servidor\c\EDS70` e comparado com a clinica ID 1 do Brana Cloud.
- O commit-base da auditoria populacional foi `92fd685`.
- O presente adendo responde especificamente a pergunta: o questionario Principal da clinica 1 precisa ser completado/importado antes de migrar respostas legadas?
- Gleisson Tel nao e a referencia de migracao do legado; a referencia continua sendo a populacao legada com anamnese preenchida.

## 3. Confirmacao de que nenhuma migracao foi executada
- Nao houve `INSERT`, `UPDATE`, `DELETE`, `ALTER`, `DROP` ou `TRUNCATE`.
- Nao houve escrita no EasyDental nem no Brana.
- Nao houve alteracao de codigo funcional, frontend, backend funcional, migrations, seeds, endpoints, `.env`, payload, formato de salvamento ou permissoes.

## 4. Arquivos revisados
- `docs/anamnese_easy_dell_servidor_adendo_dry_run_populacional_clinica_1.md`
- `docs/anamnese_easy_dell_servidor_matches_pacientes_clinica_1.csv`
- `docs/anamnese_easy_dell_servidor_respostas_candidatas_clinica_1.csv`
- `docs/anamnese_easy_dell_servidor_adendo_dry_run_populacional_clinica_1_summary.json`
- `docs/anamnese_easy_dell_servidor_auditoria_migracao_clinica_1.md`
- `docs/ficha_pessoal_anamnese_implementacao_tipo_resposta_manual_b.md`
- `docs/ficha_pessoal_anamnese_contrato_manual_easydental_fluxo_configuracao_clinica.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/anamnese_easy_dell_servidor_principal_perguntas_faltantes.csv`
- `docs/anamnese_easy_dell_servidor_principal_respostas_perguntas_faltantes.csv`

## 5. Resumo das contagens gerais
- EasyDental legado: 1627 pacientes totais; 305 pacientes com anamnese preenchida; 16102 respostas brutas; 1875 respostas com complemento.
- Brana Cloud clinica 1: 1627 pacientes; 5 questionarios; 112 perguntas; 15 respostas salvas; 1 paciente com respostas de Anamnese.
- Matching populacional: MATCH_ALTO 304; MATCH_MEDIO 0; MATCH_BAIXO 0; SEM_MATCH 1; DUPLICADO/CONFLITO 0.

## 6. Analise especifica do questionario Principal
- Respostas candidatas do Principal no dry-run: 35.
- Perguntas 1 a 17: 17 respostas candidatas; todas com correspondencia exata no Brana; 1 paciente afetado (ID `273`, `Joon Yun Lee Lee`).
- Perguntas 18 a 35: 18 respostas candidatas; sem correspondencia estrutural no Principal atual do Brana; 1 paciente afetado (ID `273`, `Joon Yun Lee Lee`).
- Complementos nas perguntas faltantes 18 a 35: 0.
- Respostas criticas ou mensagens de alerta nas perguntas faltantes 18 a 35: 18, todas com `legacy_mensagem_alerta` preenchida.
- Distribuicao da resposta no Principal legado: `2` = 32; `1` = 3.
- Distribuicao nas perguntas faltantes 18 a 35: `2` = 18; `1` = 0.
- Observacao de mapeamento: a pergunta 24 do Principal legado encontrou texto equivalente no Brana, mas em outro numero (`Brana pergunta 26`) e em outro contexto de mapeamento; isso nao resolve a ausencia estrutural do Principal atual com 17 perguntas.
- Numero de perguntas do Principal no legado: 35.
- Numero de perguntas do Principal no Brana: 17.
- Perguntas faltantes no Brana: 18.
- Numeracao do Principal legado: estavel e sequencial de 1 a 35.
- As primeiras 17 perguntas batem exatamente entre legado e Brana na comparacao por numero.
- A ausencia das perguntas 18 a 35 causaria perda de dados se migrassemos respostas agora, porque esses registros nao teriam destino estrutural seguro no Principal atual.

## 7. Analise dos outros quatro questionarios
- `Implante`: 12 perguntas no legado e 12 no Brana; cobertura estrutural completa.
- `Ficha complementar`: 12 perguntas no legado e 12 no Brana; cobertura estrutural completa.
- `Anamnese de Saude`: 55 perguntas no legado e 55 no Brana; cobertura estrutural completa.
- `Anamnese pessoal`: 16 perguntas no legado e 16 no Brana; cobertura estrutural completa.
- Esses quatro questionarios nao apresentam o mesmo bloqueio estrutural do Principal.

## 8. Analise de risco de migrar respostas antes de completar o Principal
- Risco de perda de historico: alto.
- Risco de criar pendencia clinica invisivel: alto.
- Risco de respostas ficarem sem destino seguro: alto.
- Risco de confusao entre mapeamento exato e mapeamento por texto equivalente em outro numero: medio/alto.

## 9. Analise de risco de completar o Principal atual
- Risco de alterar a tela atual usada pela clinica: medio.
- Risco de duplicar perguntas: baixo, se a operacao for de acrescimo controlado das 18 faltantes.
- Risco de alterar o comportamento dos pacientes/questionarios atuais: medio.
- Risco de quebrar compatibilidade com respostas ja existentes: baixo, se a regra de nao sobrescrita for respeitada.

## 10. Analise de risco de criar questionario paralelo
- Risco de duplicidade visual e conceitual: medio/alto.
- Risco de confundir operadores com dois "Principais": alto.
- Risco de dispersar respostas entre estruturas quase equivalentes: alto.
- Vantagem: preserva o questionario atual sem tocar nele, mas custa clareza operacional.

## 11. Regra de preservacao das 15 respostas atuais no Brana
- As 15 respostas ja existentes no Brana devem permanecer intactas.
- Nao sobrescrever respostas ja salvas.
- Nao renumerar ou mover respostas ja existentes sem contrato de escrita explicitamente aprovado.
- Nao apagar historico para ajustar estrutura.

## 12. Regra futura de nao sobrescrita
- Futuras migracoes devem aplicar `upsert` somente quando houver chave de correspondencia validada por paciente, questionario, numero de pergunta e tipo estrutural.
- Se houver conflito, a resposta antiga deve ser preservada e o caso deve ir para lista de revisao manual.
- Nunca substituir silenciosamente uma resposta do Brana por um valor do legado sem dry-run fechado.

## 13. Analise das opcoes ANAM-MIG-STRUCT-A/B/C/D/E
- `ANAM-MIG-STRUCT-A`: nao completar Principal agora. Seguro no curtissimo prazo, mas deixa 18 respostas sem destino estruturado e produz historico incompleto.
- `ANAM-MIG-STRUCT-B`: completar o Principal atual com as 18 perguntas faltantes. Preserva o questionario atual e permite migracao coerente do legado sem fragmentar o Principal.
- `ANAM-MIG-STRUCT-C`: criar um novo "Principal EasyDental legado". Preserva o Principal atual, mas introduz duplicidade conceitual e risco de confusao operacional.
- `ANAM-MIG-STRUCT-D`: importar toda a estrutura legada como paralela. E a opcao mais pesada e a mais propensa a duplicidade.
- `ANAM-MIG-STRUCT-E`: pausar migracao de respostas ate contrato estrutural completo. E a postura mais conservadora se a equipe ainda nao quiser mexer em estrutura.

## 14. Decisao recomendada
- `ANAM-MIG-STRUCT-B`.
- Motivo: o Principal do Brana ja existe, bate nas primeiras 17 perguntas e precisa apenas das 18 perguntas faltantes para evitar perda de dados e preservar um unico questionario coerente.

## 15. Proxima subetapa segura
- Abrir contrato estrutural especifico para acrescer as 18 perguntas faltantes ao Principal atual, sem migrar respostas ainda.
- Se a equipe optar por nao tocar na estrutura neste momento, manter a migracao de respostas totalmente pausada e documentada.

## 16. Conclusao
- A revisao documental dos CSV/JSON confirma que o questionario Principal e o unico bloqueio estrutural relevante antes da migracao de respostas.
- Os outros quatro questionarios estao estruturalmente completos no Brana.
- A decisao mais segura para preservar dados e historico e completar o Principal atual com as 18 perguntas faltantes antes de qualquer migracao real de respostas.
