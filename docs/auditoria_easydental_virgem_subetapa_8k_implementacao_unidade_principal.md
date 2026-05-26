Auditoria EasyDental virgem - Subetapa 8K - implementacao da unidade Principal 0001

## Contexto

- Referencia as Subetapas 8D, 8G e 8J.
- A implementacao desta subetapa e isolada.
- O escopo e somente novas contas.
- Contas existentes nao sao alteradas.
- As tabelas de procedimentos/precos da 8J nao foram mexidas novamente.

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

- Unidade Principal / 0001 foi criada/garantida para novas contas.
- A implementacao e idempotente.
- A implementacao evita duplicidade por clinica.
- Contas existentes permanecem preservadas.

## Arquivos alterados

- `backend/services/signup_service.py` - cria/garante a unidade Principal / 0001 no fluxo de signup de novas contas.
- `docs/11_roadmap_desenvolvimento.md` - registra a execucao da subetapa e o resultado.

## Helper/idempotencia

- Helper criado: `_garantir_unidade_principal_clinica(db, clinica_id)`.
- Ele fica em `backend/services/signup_service.py`.
- O helper procura unidades existentes da clinica e considera como correspondencia valida qualquer registro com `source_id=1`, `codigo=0001` ou `nome=Principal`.
- Se encontrar uma unidade existente, reaproveita sem renomear e sem excluir.
- Se nao encontrar, cria a unidade com `clinica_id`, `source_id=1`, `codigo=0001`, `nome=Principal`, `qtd_sala=0`, `inativo=False` e `data_inclusao` neutra.
- O helper nao mexe em usuarios, prestadores, permissoes, TISS ou setup.

## Fluxo de signup alterado

- O helper foi chamado em `backend/services/signup_service.py` logo apos a criacao da clinica e antes do restante do fechamento do nascimento.
- Esse ponto foi escolhido para garantir que a unidade exista cedo no nascimento da nova conta.
- O fluxo nao foi ampliado com regras de permissao, TISS ou setup.
- O fluxo nao interfere na implementacao das 10 tabelas de procedimentos/precos da 8J.

## Regra de dados da unidade

- Nome: `Principal`.
- Codigo: `0001`.
- Unidade nasce ativa.
- Nao preenche endereco, telefone ou campos opcionais sem necessidade.
- Nao inventa dados pessoais.
- Nao marca campos extras fora do modelo.

## Fora de escopo

- Mestre.
- Clinica.
- Usuario system.
- Admin inicial.
- Prestador sistemico.
- Permissoes/matriz formal.
- TISS.
- Setup.
- Frontend.
- Tabelas de procedimentos/precos da 8J.
- Contas existentes.
- Conta ID 16.

## Checks executados

- `git status --short`
- `git diff --stat`
- `git diff -- backend/services/signup_service.py`
- `python -m py_compile backend/services/signup_service.py`

Resultado:
- Os checks sintaticos passaram.
- O diff ficou restrito ao escopo desta implementacao.

## Teste manual obrigatorio pelo usuario

- Criar nova conta de teste no fluxo SaaS.
- Acessar como admin inicial.
- Abrir menu/tela de Unidade de atendimento, se existir.
- Verificar que existe unidade:
  - Nome: `Principal`
  - Codigo: `0001`
- Verificar que nao existem unidades duplicadas.
- Verificar que a conta abre normalmente.
- Verificar que a tela de setup nao foi responsavel por criar a unidade.
- Verificar que as 10 tabelas de procedimentos/precos da 8J continuam nascendo corretamente:
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
- Verificar que Tabela Exemplo nao nasce.
- Verificar que conta ID 16 nao foi alterada.
- Se houver conta antiga disponivel, verificar que permanece sem alteracao.

## Riscos e rollback

- Risco: duplicidade de unidade na nova conta.
  - Mitigacao: helper idempotente por clinica.
  - Teste: criar nova conta e verificar apenas uma unidade Principal / 0001.
  - Rollback: novo commit corretivo.
- Risco: unidade nascer com dados indevidos.
  - Mitigacao: preencher apenas campos minimos.
  - Teste: inspecionar a unidade na nova conta.
  - Rollback: novo commit corretivo.

## Proxima subetapa recomendada

- `EasyDental virgem - Subetapa 8L - validacao manual da nova conta apos unidade + 10 tabelas`

## Plano de verificacao

- O codigo alterado ficou restrito ao escopo desta implementacao.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foram alterados.
- As tabelas de procedimentos/precos da 8J nao foram alteradas novamente.
- Permissoes/TISS/setup nao foram alterados.
- Banco/schema/migrations nao foram alterados.
- Nenhum arquivo do EasyDental foi alterado.
- Nenhuma conta foi criada automaticamente.
- A conta ID 16 nao foi alterada.
- A blindagem textual/mojibake foi respeitada.
