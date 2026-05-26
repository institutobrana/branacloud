Auditoria EasyDental virgem - Subetapa 8J - implementacao das tabelas de procedimentos/precos

## Contexto

- Referencia as Subetapas 8H e 8I.
- A 8H corrigiu a lista nominal das tabelas de procedimentos/precos.
- A 8I fechou o contrato tecnico de implementacao.
- Esta 8J e a primeira implementacao isolada do nascimento das 10 tabelas de procedimentos/precos em novas contas Brana.
- O escopo e somente novas contas; contas existentes nao sao alteradas.

## Seguranca e limites

- Nenhum codigo fora do escopo foi alterado.
- Nenhum seed/migration foi alterado fora do necessario para esta implementacao.
- Nenhum banco foi alterado manualmente.
- Nenhuma query de escrita foi executada.
- Nenhum script SQL foi executado.
- Nenhuma conta foi criada automaticamente.
- A conta ID 16 nao foi alterada.
- Nenhuma conta existente foi alterada.
- A tela de setup nao foi alterada.
- A blindagem textual/mojibake foi respeitada.

## Escopo implementado

- 10 tabelas de procedimentos/precos passaram a nascer em novas contas.
- Brana passa a ser a tabela privada/padrao da nova conta.
- Tabela Exemplo nao nasce mais no fluxo de novas contas.
- Particular nasce como tabela herdada, mas nao como padrao.
- Os procedimentos canonicos foram replicados nas 10 tabelas.
- Os valores numericos foram sanitizados para zero e campos sem valor foram normalizados para null quando necessario.
- A regra anti-duplicidade foi aplicada no nascimento.

## Arquivos alterados

- `backend/services/signup_service.py` - integra o helper no fluxo de nascimento da nova conta e fixa Brana como tabela padrao/privada.
- `backend/seeds/procedimentos_padrao.py` - cria/garante as 10 tabelas e replica os procedimentos sanitizados.
- `backend/routes/procedimentos_routes.py` - ajusta a ordem de exibicao para refletir Brana primeiro e manter a sequencia contratual das tabelas.
- `docs/11_roadmap_desenvolvimento.md` - registra a execucao da subetapa e o resultado.

## Helper/idempotencia

- Helper criado: `_garantir_tabelas_procedimentos_iniciais(db, clinica_id)`.
- Ele fica em `backend/seeds/procedimentos_padrao.py`.
- A entrada esperada e `db` + `clinica_id`.
- O helper compara por clinica + nome/codigo normalizado e evita criar tabela duplicada.
- Se a tabela ja existir, ela e reaproveitada sem renomeacao automatica.
- Os procedimentos sao inseridos ou atualizados com payload sanitizado.
- Campos numericos de preco/valor/custo sao zerados.
- Campos de ausencia ficam como `null` quando apropriado.
- O helper nao mistura unidade, permissoes, TISS ou setup.
- O helper nao altera contas existentes.

## Fluxo de signup alterado

- O helper foi chamado no fluxo de `backend/services/signup_service.py`, apos a criacao da clinica e apos `seed_procedimentos_genericos(db, clinica.id)`.
- Esse ponto foi escolhido para garantir que a clinica ja exista e que os genericos estejam disponiveis antes de criar as tabelas de procedimentos/precos.
- O fluxo nao foi ampliado com regras de unidade, permissoes ou TISS.
- O fluxo nao passou a criar conta automaticamente para teste.

## Regra de dados

- Nasce Brana.
- Nascem Banco do Brasil, Banespa, Bradesco, Caixa Econ Federal, CNCC, Particular, Petrobras, Sindicato e Telebras.
- Brana fica como padrao/privada.
- Particular nasce como herdada, mas nao como padrao.
- Tabela Exemplo nao nasce.
- Procedimentos sao replicados nas 10 tabelas.
- Precos/valores/custos ficam sanitizados.
- Nao ha importacao de valores comerciais reais do EasyDental.

## Fora de escopo

- Unidade Principal / 0001.
- Permissoes e matriz formal.
- TISS.
- Setup.
- Frontend.
- Contas existentes.
- Conta ID 16.

## Checks executados

- `git status --short`
- `git diff --stat`
- `git diff -- backend/services/signup_service.py backend/seeds/procedimentos_padrao.py backend/routes/procedimentos_routes.py`
- `python -m py_compile backend/services/signup_service.py backend/seeds/procedimentos_padrao.py backend/routes/procedimentos_routes.py`

Resultado:
- Os checks sintaticos passaram.
- O diff ficou restrito ao escopo desta implementacao.

## Teste manual obrigatorio pelo usuario

- Criar uma nova conta de teste no fluxo SaaS.
- Entrar como admin inicial.
- Abrir a tela/menu de procedimentos/tabelas de preco.
- Verificar que existem exatamente:
  - Brana
  - Banco do Brasil
  - Banespa
  - Bradesco
  - Caixa Econ Federal
  - CNCC
  - Particular
  - Petrobras
  - Sindicato
  - Telebras
- Verificar que Brana aparece como padrao/privada.
- Verificar que Tabela Exemplo nao existe na nova conta.
- Verificar que Particular existe, mas nao e padrao.
- Verificar que os procedimentos existem nas tabelas.
- Verificar que os precos/valores estao sanitizados.
- Verificar que a conta ID 16 nao foi alterada.
- Se houver conta antiga disponivel, verificar que Tabela Exemplo legada continua la sem alteracao.

## Riscos e rollback

- Risco: duplicidade de tabela em nova conta.
  - Mitigacao: helper idempotente por clinica + nome/codigo.
  - Teste: criar nova conta duas vezes em ambiente seguro e verificar que nao duplica.
  - Rollback: novo commit corretivo.
- Risco: trazer valores comerciais indevidos.
  - Mitigacao: sanitizacao para zero/null.
  - Teste: inspecionar valores na nova conta.
  - Rollback: novo commit corretivo.
- Risco: `Tabela Exemplo` nascer por engano.
  - Mitigacao: remover caminho de nascimento no signup.
  - Teste: verificar ausencia em nova conta.
  - Rollback: novo commit corretivo.

## Proxima subetapa recomendada

- `EasyDental virgem - Subetapa 8K - validacao manual da nova conta apos implementacao das 10 tabelas`

## Plano de verificacao

- O codigo alterado ficou restrito ao escopo desta implementacao.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foram alterados.
- Unidade/permissoes/TISS/setup nao foram alterados.
- Banco/schema/migrations nao foram alterados.
- Nenhum arquivo do EasyDental foi alterado.
- Nenhuma conta foi criada automaticamente.
- A conta ID 16 nao foi alterada.
- A blindagem textual/mojibake foi respeitada.
