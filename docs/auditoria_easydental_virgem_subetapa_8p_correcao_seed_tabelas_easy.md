Auditoria EasyDental virgem — Subetapa 8P — correção dos seeds por tabela EasyDental

## Contexto

- Referencia as Subetapas 8J, 8M, 8N e 8O.
- A 8J implementou as 10 tabelas de procedimentos/preços para novas contas, mas o teste manual revelou a falha de replicar os 336 itens da tabela Brana nas 9 tabelas herdadas.
- A 8M registrou a falha e bloqueou correção sem mapa verificável.
- A 8N confirmou os nomes nominais de `TAB_PRC` no EasyDental virgem.
- A 8O fechou o mapa de `TAB_PRC_ITEM` por tabela com confiança alta.
- Esta etapa corrige o seed de forma isolada, sem mexer em setup, senha interna, unidade, permissões, TISS ou frontend.

## Falha corrigida

- A falha era a replicação indevida dos 336 procedimentos da Brana em todas as tabelas herdadas.
- A regra correta é: Brana recebe seed Brana; as 9 tabelas EasyDental recebem seus próprios itens EasyDental.
- `Tabela Exemplo` continua fora do nascimento de novas contas.
- `Particular` nasce como tabela herdada, mas não como padrão/privada.

## Mapa EasyDental aplicado

| Tabela Brana/contratual | Nome original EasyDental | NROTAB | Quantidade esperada | Fonte | Observação |
|---|---|---:|---:|---|---|
| Brana | Brana | - | seed Brana atual | Brana Cloud | Mantida como seed próprio |
| Banco do Brasil | Banco do Brasil | 4 | 188 | EasyDental virgem | Seed próprio da tabela |
| Banespa | Banespa | 6 | 32 | EasyDental virgem | Seed próprio da tabela |
| Bradesco | Bradesco | 3 | 94 | EasyDental virgem | Seed próprio da tabela |
| Caixa Econ Federal | Caixa Econ. Federal | 5 | 88 | EasyDental virgem | Nome contratual sem ponto final |
| CNCC | CNCC | 9 | 236 | EasyDental virgem | Seed próprio da tabela |
| Particular | Particular | 1 | 112 | EasyDental virgem | Tabela herdada, não padrão |
| Petrobras | Petrobrás | 8 | 174 | EasyDental virgem | Nome contratual sem acento |
| Sindicato | Sindicato | 2 | 238 | EasyDental virgem | Seed próprio da tabela |
| Telebras | Telebrás | 7 | 101 | EasyDental virgem | Nome contratual sem acento |

## Implementação

- Arquivos alterados:
  - `backend/seeds/procedimentos_padrao.py`
  - `backend/seeds/procedimentos_easy_tabelas.py`
- Helper/funções alteradas:
  - `_garantir_tabelas_procedimentos_iniciais(db, clinica_id)`
  - `get_procedimentos_easy_por_tabela()`
  - `get_procedimentos_easy_por_tabela_nome(nome)`
- Onde ficou o seed por tabela:
  - `backend/seeds/procedimentos_easy_tabelas.py` concentra o seed EasyDental por tabela em estrutura pequena e isolada.
- Como Brana foi separada das 9 tabelas EasyDental:
  - `Brana` continua usando `get_procedimentos_brana_padrao()`.
  - As demais tabelas usam o seed EasyDental correspondente por nome contratual.
- Como Tabela Exemplo permanece fora:
  - a rotina de nascimento não cria `Tabela Exemplo`.
- Como valores foram sanitizados:
  - o sanitizador existente continua zerando campos monetários/repasse nas novas contas.
- Como anti-duplicidade funciona:
  - a lógica segue idempotente por clínica + tabela + código normalizado do item, sem duplicar itens ou tabelas já existentes.

## Fora de escopo

- Unidade `Principal / 0001`.
- Setup.
- Erro textual da tela de setup.
- Senha interna.
- Opções do Sistema.
- Permissões.
- TISS amplo.
- Frontend.
- Contas existentes.
- Conta ID 16.

## Checks executados

- `python -m py_compile backend/seeds/procedimentos_padrao.py backend/seeds/procedimentos_easy_tabelas.py`
- Verificação programática das contagens do seed EasyDental importado:
  - Particular 112
  - Sindicato 238
  - Bradesco 94
  - Banco do Brasil 188
  - Caixa Econ Federal 88
  - Banespa 32
  - Telebras 101
  - Petrobras 174
  - CNCC 236
  - total 1263

## Teste manual obrigatório

- Criar uma nova conta de teste limpa.
- Acessar como admin inicial.
- Abrir `Intervenções / Procedimentos`.
- Verificar as 10 tabelas:
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
- Confirmar que as contagens esperadas nas 9 tabelas EasyDental são:
  - Particular: 112
  - Sindicato: 238
  - Bradesco: 94
  - Banco do Brasil: 188
  - Caixa Econ Federal: 88
  - Banespa: 32
  - Telebras: 101
  - Petrobras: 174
  - CNCC: 236
- Confirmar que as 9 tabelas não têm 336 itens iguais à Brana.
- Confirmar que `Tabela Exemplo` não nasce.
- Confirmar que Brana é padrão/privada.
- Confirmar que os preços/valores estão sanitizados.
- Confirmar que `Principal / 0001` continua correta.
- Confirmar que a conta ID 16 não foi alterada.
- Confirmar que o setup ainda não foi alterado.

## Riscos e rollback

- Risco de nome contratual divergente: mitigado pelo mapa fechado da 8O.
- Risco de duplicidade em novas contas: mitigado pelo helper idempotente.
- Risco de trazer valor comercial indevido: mitigado pela sanitização.
- Rollback previsto por novo commit, sem usar reset/clean/restore destrutivo.
- Se uma conta de teste ficar incorreta, deve ser descartada por procedimento seguro próprio.

## Próxima subetapa recomendada

- `EasyDental virgem - Subetapa 8Q - validacao manual da nova conta apos correcao dos seeds`

## Plano de verificação

- Somente este documento novo e o roadmap foram alterados.
- Nenhum código fora do seed foi alterado.
- `frontend/app.js` não foi alterado.
- `frontend/index.html` não foi alterado.
- `frontend/js/modules` não foram alterados.
- `backend` fora do seed não foi alterado.
- `banco/schema/migrations/seeds/endpoints` não foram alterados fora do escopo.
- `conta ID 16` não foi alterada.
- Nenhuma conta foi criada automaticamente.
- EasyDental não foi alterado.
- A blindagem textual/mojibake foi respeitada.
