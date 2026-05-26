Auditoria EasyDental virgem - Subetapa 8H - contrato das tabelas de procedimentos/precos

## Contexto

- Referencias consideradas: Subetapas 5, 6, 8E, 8F e 8G.
- A Subetapa 8G fechou o contrato mestre revisado, mas a lista nominal de TAB_PRC precisava de correcao.
- A correcao desta etapa trata apenas do contrato das tabelas de procedimentos/precos para novas contas.
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

## Regra corrigida de TAB_PRC

No EasyDental virgem, a lista nominal correta de tabelas de procedimentos/precos que nascem como referencia estrutural e catalogo e:

- Banco do Brasil
- Banespa
- Bradesco
- Caixa Econ Federal
- CNCC
- Particular
- Petrobras
- Sindicato
- Telebras

## Regra nova para novas contas Brana

Novas contas Brana devem nascer com as 9 tabelas herdadas do EasyDental virgem abaixo, mais a tabela Brana:

1. Banco do Brasil
2. Banespa
3. Bradesco
4. Caixa Econ Federal
5. CNCC
6. Particular
7. Petrobras
8. Sindicato
9. Telebras
10. Brana

## Regra da tabela Brana

- Brana e a tabela privada/padrao da nova conta.
- Brana deve nascer em toda nova conta.
- Brana substitui a Tabela Exemplo no nascimento de novas contas.
- Brana nao renomeia nem substitui automaticamente tabelas em contas antigas.

## Regra da Tabela Exemplo

- Tabela Exemplo nao deve mais nascer em novas contas.
- Tabela Exemplo pode permanecer em contas antigas que ja a possuam.
- Nao deve haver migracao automatica nesta etapa.
- Qualquer limpeza futura exige contrato proprio.
- A conta 16 pode permanecer como baseline/legado, sem alteracao.

## Regra da tabela Particular

- Particular volta a fazer parte das tabelas herdadas do EasyDental virgem que devem nascer em novas contas.
- Particular nao e a tabela privada/padrao.
- Brana continua sendo a tabela privada/padrao do SaaS.
- Isso nao contradiz a preservacao de PARTICULAR em contas antigas.
- Aqui, Particular e tratado como tabela herdada/convenio/preco, distinta da tabela privada padrao.

## Regra de precos, custos e repasses

- Nao trazer preco comercial indevido do EasyDental.
- Se o modelo exigir preco, preferir zero, nulo ou valor sanitizado.
- Custos e repasses nao devem nascer como dado comercial real.
- A decisao exata sobre preco deve ficar explicita como fechada ou pendente.
- Se ainda houver pendencia, o contrato tecnico especifico deve vir antes de qualquer implementacao.

## Relacao com procedimentos

- As tabelas de procedimentos/precos precisam ter estrutura suficiente para receber os procedimentos correspondentes.
- As tabelas de procedimentos canonicos e genericos continuam sendo parte do nascimento estrutural.
- A diferenca entre tabela de preco e catalogo/procedimento canonico precisa ser preservada.
- A lista de procedimentos da Brana nao deve ser confundida com a lista de tabelas de preco.
- Se houver duvida sobre replicar os 336 procedimentos em todas as tabelas ou apenas na Brana, isso fica como pendencia critica.

## O que a 8H corrige na 8G

- TAB_PRC agora tem lista nominal corrigida.
- Novas contas passam a nascer com Brana + 9 tabelas herdadas do EasyDental.
- Tabela Exemplo sai do nascimento de novas contas.
- Particular entra como tabela herdada, mas nao como padrao privada.
- Precos, custos e repasses precisam regra sanitizada.

## Impacto no baseline da conta 16

- A conta 16 tem Brana.
- A conta 16 ainda tem Tabela Exemplo e metadata legada.
- A conta 16 nao deve ser alterada nesta etapa.
- A conta 16 continua servindo como baseline/legado para comparar o que deve mudar apenas nas novas contas.

## Arquivos provaveis para futura implementacao

- `backend/services/signup_service.py`
- `backend/seeds/procedimentos_brana.py`
- `backend/seeds/procedimentos_padrao.py`
- `backend/seeds/procedimentos_genericos.py`
- `backend/services/procedimentos_legado_service.py`
- `backend/models/procedimento_tabela.py`
- `backend/models/procedimento.py`
- `backend/models/clinica.py`

Observacao: qualquer implementacao futura deve preferir helper pequeno e idempotente, sem misturar unidade, permissoes, TISS e setup na mesma entrega.

## Regra anti-duplicidade

- Se a tabela ja existir na clinica, nao criar outra.
- O ajuste vale apenas para novas contas.
- Contas existentes ficam fora do escopo.
- Qualquer backfill futuro exige contrato proprio.

## Testes futuros obrigatorios

- Criar nova conta de teste.
- Verificar que nascem as 10 tabelas.
- Verificar que Brana e a tabela privada/padrao.
- Verificar que Tabela Exemplo nao nasce.
- Verificar que Particular nasce.
- Verificar que contas existentes nao mudam.
- Verificar os procedimentos em Brana.
- Verificar precos, custos e repasses conforme a regra sanitizada.
- Verificar os menus de procedimentos.
- Verificar que o setup nao cria essas tabelas.

## Riscos e mitigacao

| Risco | Impacto | Mitigacao | Teste obrigatorio | Rollback |
| --- | --- | --- | --- | --- |
| Duplicar tabelas em contas antigas | Bagunca o legado | Restringir a regra para novas contas | Criar e validar conta nova e conta antiga | Nao aplicar migracao automatica |
| Levar preco comercial do EasyDental | Exposicao indevida | Sanitizar preco/custo/repasse | Conferir valores zerados/nulos/sanitizados | Reverter seed/seed helper |
| Tratar Tabela Exemplo como padrao | Quebra de contrato | Fixar Brana como padrao privado | Validar tabela padrao na nova conta | Ajustar nome/codigo no helper |
| Replicar procedimentos em tabela errada | Catalogo inconsistente | Separar tabela de preco de catalogo | Conferir Brana e tabelas herdadas | Ajustar seed/relacao |

## Decisoes pendentes

- Os procedimentos devem nascer em todas as tabelas ou apenas em Brana?
- O preco deve ser zero, nulo ou sanitizado?
- Particular deve receber os mesmos itens da Brana?
- As tabelas herdadas devem ser visiveis ao usuario final?
- Qual e a ordem de exibicao?
- Qual e a tabela padrao inicial na metadata da clinica?

## Proxima subetapa recomendada

Recomendacao: `EasyDental virgem - Subetapa 8I - contrato tecnico de implementacao das 10 tabelas de procedimentos/precos, sem codigo`.

Justificativa: a 8H fecha a regra nominal e de contrato; o proximo passo mais seguro e detalhar a implementacao isolada das tabelas de procedimentos/precos, sem misturar unidade, permissoes, TISS ou setup.

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
