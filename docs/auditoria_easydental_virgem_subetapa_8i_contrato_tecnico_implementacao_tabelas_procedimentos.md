Auditoria EasyDental virgem - Subetapa 8I - contrato tecnico de implementacao das tabelas de procedimentos/precos

## Contexto

- Referencias consideradas: Subetapas 5, 6, 8E, 8F, 8G e 8H.
- A Subetapa 8H corrigiu a lista nominal das tabelas de procedimentos/precos.
- Esta etapa prepara a implementacao futura das 10 tabelas de novas contas.
- Esta etapa nao implementa nada e nao altera contas existentes.

## Seguranca e limites

- Nenhum codigo foi alterado.
- Nenhum seed foi alterado.
- Nenhuma migration foi alterada.
- Nenhum banco foi alterado.
- Nenhuma query de escrita foi executada.
- Nenhum script SQL foi executado.
- Nenhuma conta foi criada.
- A conta ID 16 nao foi alterada.
- Nenhuma conta existente foi alterada.
- A tela de setup nao foi alterada.
- A blindagem textual/mojibake foi respeitada.

## Regra funcional final das 10 tabelas

Novas contas Brana devem nascer com as 10 tabelas abaixo:

- Banco do Brasil
- Banespa
- Bradesco
- Caixa Econ Federal
- CNCC
- Particular
- Petrobras
- Sindicato
- Telebras
- Brana

## Tabela padrao/privada

- Brana e a tabela privada/padrao da nova conta.
- Particular nasce como tabela herdada, mas nao padrao.
- As demais tabelas nascem como herdadas do EasyDental virgem.
- Tabela Exemplo nao nasce.

## Decisao tecnica sobre procedimentos

Decisao recomendada: **Opcao A - replicar os procedimentos em todas as 10 tabelas, com conteudo sanitizado para novas contas**.

Motivos:

- Mantem aderencia ao conceito de tabela de procedimentos/precos.
- Evita tabela vazia sem utilidade pratica nas tabelas herdadas.
- Preserva a separacao entre catalogo/procedimento e a tabela de preco.
- Facilita o uso imediato da nova conta sem exigir duplicacao posterior manual.

Impacto:

- Todas as 10 tabelas nascem com a estrutura de procedimentos correspondente.
- Os dados de uso real continuam fora.
- A replicacao deve respeitar a regra anti-duplicidade por tabela.

Risco:

- Duplicar procedimentos se a tabela ja existir ou se a conta antiga for tocada.

Mitigacao:

- Limitar a logica a novas contas.
- Comparar por `clinica_id` + nome normalizado/codigo.
- Nunca fazer backfill automatico em contas antigas.

## Decisao tecnica sobre precos

Decisao recomendada: **preco sanitizado para zero nos campos numericos, com nulo apenas onde o modelo exigir ausencia**.

Regras:

- Nao trazer preco comercial indevido.
- Nao trazer custos/repasses reais do EasyDental.
- Nao alterar contas existentes.
- Campos numericados devem nascer com zero quando o schema/modelo permitir.
- Campos que semanticamente representem ausencia podem nascer nulos quando necessario.

## Decisao tecnica sobre visibilidade

- As 10 tabelas devem aparecer para o usuario final como tabelas disponiveis da conta.
- Brana deve aparecer em primeiro ou como padrao/privada.
- A ordem sugerida de exibicao e: Brana, Banco do Brasil, Banespa, Bradesco, Caixa Econ Federal, CNCC, Particular, Petrobras, Sindicato, Telebras.
- Tabela Exemplo nao deve aparecer em novas contas.
- Contas antigas preservam o que ja existe.

## Decisao tecnica sobre metadata inicial

- O metadata inicial da clinica deve marcar Brana como tabela padrao/privada.
- A referencia inicial a Tabela Exemplo deve ser removida apenas no nascimento de novas contas.
- Nao deve haver metadata legada em novas contas.
- Contas antigas nao sao migradas automaticamente.

## Ponto de criacao no fluxo de signup

Funcao provavel: `backend/services/signup_service.py`.

Ponto recomendado:

- apos criar a clinica;
- apos criar o usuario system/admin/prestador estruturais;
- apos `seed_procedimentos_genericos(db, clinica.id)`;
- antes do restante da finalizacao do nascimento que dependa das tabelas de procedimentos/precos.

Justificativa:

- A tabela de procedimentos/precos depende do contexto da clinica ja existente.
- Os genericos precisam estar disponiveis para montar os procedimentos.
- O helper deve entrar em um ponto unico e previsivel do fluxo de signup.

## Helper e idempotencia

Helper recomendado: `_garantir_tabelas_procedimentos_iniciais(db, clinica_id)`.

Entrada esperada:

- `db`
- `clinica_id`

Saida esperada:

- garante as 10 tabelas iniciais;
- garante Brana como padrao/privada;
- nao duplica tabelas ja existentes;
- nao altera contas antigas.

Regra anti-duplicidade:

- comparar por `clinica_id` + nome normalizado e, quando aplicavel, codigo;
- nao criar se ja existir;
- nao renomear automaticamente o que ja existe;
- preservar a transacao e permitir rollback natural se a transacao falhar.

Nao misturar:

- unidade;
- permissoes;
- TISS;
- setup.

## Regra anti-duplicidade

- Comparar por `clinica_id` + nome normalizado.
- Nao criar se ja existir.
- Nao renomear automaticamente.
- Nao mexer em contas existentes.
- Backfill exige contrato proprio.

## Relacao com seeds existentes

- `backend/seeds/procedimentos_brana.py`: fonte principal para a tabela Brana.
- `backend/seeds/procedimentos_padrao.py`: deve ser refatorado para o nascimento das 10 tabelas, sem manter Tabela Exemplo como nascimento das novas contas.
- `backend/seeds/procedimentos_genericos.py`: fonte dos genericos/codigos base que alimentam os procedimentos.
- `backend/services/procedimentos_legado_service.py`: pode continuar servindo para separacao/ajuste de legado em contas existentes.

Diretriz:

- Brana recebe o seed principal.
- As tabelas herdadas recebem a mesma base de procedimentos com valores sanitizados, sem duplicar dados de uso.
- A fonte de legado nao deve ser usada para criar dados transacionais novos em conta antiga.

## Relacao com Tabela Exemplo

- Hoje, a referencia legada ainda existe no fluxo atual.
- A futura implementacao deve impedir o nascimento de Tabela Exemplo em novas contas.
- Contas antigas permanecem inalteradas.
- A verificacao deve confirmar que Tabela Exemplo nao nasce mais.

## Relacao com conta 16

- A conta 16 nao deve ser alterada.
- A conta 16 continua com Brana + Tabela Exemplo/metadata legada.
- A conta 16 serve como baseline do comportamento anterior.
- A validacao da futura implementacao deve ocorrer em nova conta de teste.

## Arquivos provaveis para futura implementacao

- `backend/services/signup_service.py`
- `backend/seeds/procedimentos_brana.py`
- `backend/seeds/procedimentos_padrao.py`
- `backend/seeds/procedimentos_genericos.py`
- `backend/services/procedimentos_legado_service.py`
- `backend/models/procedimento_tabela.py`
- `backend/models/procedimento.py`
- `backend/models/clinica.py`
- testes e documentos de validacao manual, se existirem

Reforcos:

- nao alterar frontend se nao for necessario;
- nao alterar `frontend/app.js`;
- nao misturar com unidade, permissoes, TISS ou setup.

## Testes futuros obrigatorios

- Criar nova conta de teste.
- Verificar exatamente 10 tabelas.
- Verificar nomes corretos.
- Verificar Brana como padrao/privada.
- Verificar Particular como herdada e nao padrao.
- Verificar Tabela Exemplo ausente.
- Verificar procedimentos conforme a decisao tecnica.
- Verificar precos conforme a decisao tecnica.
- Verificar menus de procedimentos.
- Verificar que setup nao cria essas tabelas.
- Verificar conta 16 sem alteracao.
- Verificar uma conta antiga sem alteracao.

## Riscos e mitigacao

| Risco | Impacto | Mitigacao | Teste obrigatorio | Rollback |
| --- | --- | --- | --- | --- |
| Duplicar tabelas em nova conta | Inconsistencia de nascimento | Helper idempotente por clinica e nome | Criar nova conta e conferir 10 tabelas | Novo commit corrigindo o helper |
| Levar preco comercial indevido | Exposicao de valor real | Sanitizar para zero/nulo | Conferir precos nas tabelas novas | Reverter seed/helper |
| Tabela Exemplo nascer por engano | Quebra de contrato | Remover caminho de nascimento | Validar ausencia de Tabela Exemplo | Ajustar fluxo do signup |
| Misturar com unidade/permissoes/TISS | Entrega acoplada | Contrato separado e helper isolado | Revisao do fluxo e testes manuais | Desacoplar em nova subetapa |

## Rollback previsto

- Rollback por novo commit.
- Se a nova conta de teste ficar incorreta, ela pode ser descartada/excluida por procedimento seguro proprio, sem usar reset/clean/restore destrutivo.
- Contas existentes nao sao afetadas.

## Decisoes pendentes finais

- Os procedimentos completos devem ser replicados em todas as tabelas ou apenas na Brana?
- O preco final deve ser zero ou nulo em quais colunas?
- Particular deve receber exatamente os mesmos itens da Brana?
- As tabelas herdadas devem ser exibidas ao usuario final na mesma ordem sempre?
- Qual tabela ficara na metadata inicial da clinica como padrao visual?

## Proxima subetapa recomendada

Recomendacao: `EasyDental virgem - Subetapa 8J - implementacao isolada das 10 tabelas de procedimentos/precos apenas para novas contas`.

Justificativa:

- A 8I fecha o contrato tecnico e define helper, regra de nascimento, visibilidade, metadata e rollback.
- A proxima etapa mais segura e executar a implementacao isolada, sem misturar unidade, permissoes, TISS ou setup.

## Plano de verificacao

- Somente o documento novo e o roadmap foram alterados.
- Nenhum codigo foi alterado.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foram alterados.
- `backend` nao foi alterado.
- `banco/schema/migrations/seeds/endpoints` nao foram alterados.
- Nenhum arquivo do EasyDental foi alterado.
- Nenhum script SQL foi executado.
- Nenhuma query de escrita foi executada.
- Nenhuma conta foi criada.
- A conta ID 16 nao foi alterada.
- Nenhuma conta existente foi alterada.
- A tela de setup nao foi alterada.
- Dados sensiveis nao foram expostos.
- A blindagem textual/mojibake foi respeitada.
