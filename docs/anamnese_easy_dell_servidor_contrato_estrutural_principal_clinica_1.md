# Ficha Pessoal - Anamnese - Contrato estrutural do questionario Principal na clinica 1

## 1. Objetivo
- Definir o contrato estrutural mais seguro para completar o questionario Principal atual da clinica 1 antes de qualquer migracao de respostas.
- Confirmar se e possivel acrescentar as 18 perguntas faltantes do legado sem quebrar as 17 perguntas existentes.
- Registrar o que deve ser preservado, o que pode ser acrescentado e o que continua proibido nesta fase.

## 2. Contexto e base documental utilizada
- Base legada EasyDental auditada em modo somente leitura: `\Dell_servidor\c\EDS70`.
- Base Brana Cloud analisada em modo somente leitura: clinica ID 1.
- Base documental: `docs/anamnese_easy_dell_servidor_revisao_dry_run_principal_antes_migracao.md`, `docs/anamnese_easy_dell_servidor_principal_perguntas_faltantes.csv`, `docs/anamnese_easy_dell_servidor_principal_respostas_perguntas_faltantes.csv`, `docs/anamnese_easy_dell_servidor_adendo_dry_run_populacional_clinica_1.md`, `docs/anamnese_easy_dell_servidor_adendo_dry_run_populacional_clinica_1_summary.json`, `docs/anamnese_easy_dell_servidor_auditoria_migracao_clinica_1.md`, `docs/ficha_pessoal_anamnese_implementacao_tipo_resposta_manual_b.md`, `docs/ficha_pessoal_anamnese_contrato_manual_easydental_fluxo_configuracao_clinica.md` e `docs/11_roadmap_desenvolvimento.md`.
- Nenhuma migracao foi executada nesta etapa.

## 3. Confirmacao de que nenhuma escrita foi executada
- Nao houve `INSERT`, `UPDATE`, `DELETE`, `ALTER`, `DROP` ou `TRUNCATE`.
- Nao houve alteracao em frontend, backend funcional, banco, migrations, seeds, endpoints, `.env`, payload, formato de salvamento, permissoes ou arquivos do EasyDental.

## 4. Estado atual do questionario Principal no legado
- O questionario Principal legado possui 35 perguntas.
- As perguntas 18 a 35 existem no legado com numero estavel e sequencial.
- As perguntas faltantes possuem texto, tipo_pergunta, tipo_resposta e mensagem_alerta suficientes para uso em contrato estrutural futuro.
- O dry-run populacional mostrou 35 respostas candidatas no Principal, todas pertencentes ao mesmo paciente legado (`Joon Yun Lee Lee`).
- Das 35 respostas candidatas, 18 estao na faixa 18 a 35 e possuem alerta preenchido.

## 5. Estado atual do questionario Principal na clinica 1
- O questionario Principal atual da clinica 1 possui 17 perguntas.
- As 17 perguntas atuais devem ser preservadas integralmente.
- O fluxo da aba Anamnese e o modulo Configuracao -> Anamnese ja trabalham com esse Principal atual sem regressao funcional conhecida.
- As 15 respostas ja existentes no Brana devem ser preservadas sem sobrescrita.

## 6. Comparacao detalhada entre perguntas 1..17
- As perguntas 1..17 do legado e do Brana batem por numero.
- O texto bate exatamente nas 17 posicoes comparadas.
- O tipo_pergunta bate nas 17 posicoes comparadas.
- O tipo_resposta bate em parte das 17 posicoes comparadas, com divergencias pontuais ja conhecidas no historico documental.
- A mensagem_alerta bate em parte das 17 posicoes comparadas, com divergencias pontuais ja conhecidas no historico documental.
- Nao foi encontrada divergencia grave que obrigue ajuste antes do acrescimo das 18 faltantes.
- A estrutura atual das 17 perguntas deve ser preservada como base do Principal da clinica 1.

## 7. Comparacao detalhada das perguntas 18..35 faltantes
- As perguntas 18..35 existem no legado com numero estavel de 18 a 35.
- Todas as 18 respostas candidatas desta faixa pertencem ao mesmo paciente legado.
- Nenhuma destas 18 perguntas existe hoje no Principal atual da clinica 1.
- Todas as 18 perguntas possuem mensagem_alerta preenchida no legado.
- O acrcimo destas perguntas ao Principal atual pode ser feito sem renumerar as 17 existentes, desde que o contrato preserve a ordem 1..35.
- Ha uma equivalencia textual isolada na pergunta 24 do legado, que encontra texto semelhante no Brana em outro numero, mas isso nao substitui o acrescimo estrutural.

## 8. Analise de duplicidade/colisao semantica
- Nao houve duplicidade grave comprovada entre as perguntas 1..17.
- As perguntas 18..35 nao colidem semanticamente com a estrutura atual do Principal, desde que sejam acrescentadas no final do fluxo 1..35.
- Existe risco de confusao se for criado um questionario paralelo com nome semelhante ao Principal.
- O caminho mais seguro, neste momento, e completar o Principal atual e nao criar um paralelo.

## 9. Analise de risco
### Aba clinica
- Risco medio de a aba Anamnese precisar recarregar a estrutura apos o acrescimo.
- Risco baixo de quebra se a ordenacao 1..35 for preservada.

### Modulo Configuracao
- Risco medio de a tela de configuracao exibir o Principal com 35 perguntas em vez de 17.
- O modulo ja trabalha com lista de perguntas e nao depende de novo backend para essa decisao contratual.

### Respostas ja existentes
- Risco baixo se houver preservacao explicita das 15 respostas atuais.
- Risco alto se houver qualquer sobrescrita silenciosa.

### Ordem e numeracao
- Risco baixo se a ordem 1..35 for mantida exatamente como no legado.
- Risco medio/alto se houver renumeracao manual.

### tipo_pergunta
- Deve ser copiado do legado para as perguntas novas.
- Risco medio se for simplificado ou inferido manualmente.

### tipo_resposta
- Deve ser copiado do legado para as perguntas novas.
- Risco medio/alto se houver conversao sem validacao por pergunta.

### mensagem_alerta
- Deve ser copiada do legado para as perguntas novas.
- Risco alto se for ignorada ou reescrita.

## 10. Regra de preservacao das 15 respostas atuais
- As 15 respostas atuais da clinica 1 devem permanecer intocadas.
- Nao sobrescrever respostas ja existentes.
- Nao mover respostas para outro questionario sem contrato explicito.
- Nao apagar historico para adaptar a estrutura.

## 11. Regra de nao sobrescrita futura
- Qualquer futura escrita deve usar correspondencia validada por paciente, questionario, numero da pergunta e origem legada.
- Se houver conflito, preservar o dado atual e registrar para revisao manual.
- Nao substituir silenciosamente dado do Brana por dado do legado.

## 12. Analise das opcoes ANAM-MIG-STRUCT-B1 / B2 / C / E
- `ANAM-MIG-STRUCT-B1`: acrescentar perguntas 18 a 35 no Principal atual, preservando 1 a 17. E o caminho preferencial e o que melhor atende a preservacao de historico.
- `ANAM-MIG-STRUCT-B2`: acrescentar as faltantes, mas tambem corrigir divergencias nas 17 iniciais. Nao ha divergencia grave comprovada que justifique esse caminho agora.
- `ANAM-MIG-STRUCT-C`: criar um questionario paralelo "Principal EasyDental legado". Preserva o atual, mas cria duplicidade conceitual.
- `ANAM-MIG-STRUCT-E`: pausar tudo ate um contrato estrutural mais amplo. E conservador demais para o estado atual, porque a falta estrutural foi bem delimitada.

## 13. Decisao recomendada
- `ANAM-MIG-STRUCT-B1`.
- Motivo: as 17 perguntas atuais batem suficientemente bem para serem preservadas, e as 18 faltantes podem ser acrescentadas sem renumerar, sem criar paralelo e sem migrar respostas ainda.

## 14. Escopo permitido da futura implementacao estrutural
- Acrescentar as 18 perguntas faltantes ao questionario Principal atual da clinica 1.
- Preservar a ordem 1..35.
- Copiar `tipo_pergunta`, `tipo_resposta` e `mensagem_alerta` do legado para as perguntas novas.
- Manter as 17 perguntas atuais intactas.
- Manter as 15 respostas existentes intactas.
- Registrar origem legada das perguntas novas, se necessario, em contrato futuro.

## 15. Escopo proibido da futura implementacao estrutural
- Migrar respostas agora.
- Renumerar as 17 perguntas existentes.
- Criar questionario paralelo sem necessidade comprovada.
- Alterar frontend funcional, backend funcional, banco, migrations, seeds, endpoints, `.env`, payload ou formato de salvamento.
- Normalizar textos do legado fora do escopo.
- Sobrescrever respostas atuais.

## 16. Proxima subetapa segura
- Abrir contrato de escrita estrutural controlada para acrescer as 18 perguntas faltantes ao Principal atual, sem migrar respostas.
- Depois disso, executar novo dry-run somente leitura das respostas do Principal antes de qualquer migracao real.

## 17. Conclusao
- O questionario Principal atual da clinica 1 pode ser completado de forma segura com as 18 perguntas faltantes do legado, sem necessidade comprovada de questionario paralelo.
- A decisao mais segura neste momento e `ANAM-MIG-STRUCT-B1`.
- Nenhuma escrita foi executada nesta etapa.
