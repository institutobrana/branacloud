# Fechamento backend - `Serviços de protético` (código e descrição)

## 1. Objetivo

Registrar o fechamento da etapa de backend, banco e contrato de dados para a frente `Tabelas -> Serviços de protético`, com foco exclusivo em `codigo` e `descricao`, sem alterar frontend legado, frontend React ou comportamento visual.

## 2. Escopo

- Backend Python/FastAPI.
- Modelos SQLAlchemy.
- Rota de `proteticos`.
- Script aditivo de schema/backfill.
- Teste automatizado de validação.
- Documentação de acompanhamento.

## 3. Restrições desta etapa

- Nenhum frontend foi alterado nesta etapa.
- Nenhuma regra visual foi implementada.
- Nenhuma migration destrutiva foi criada.
- Nenhum dado foi apagado manualmente.
- Nenhum commit ou push foi feito.

## 4. Estado validado

- Branch de trabalho: `modularizacao-segura-fase-1`.
- Remote esperado: `https://github.com/institutobrana/branacloud.git`.
- O worktree já estava sujo por alterações preexistentes e permaneceu preservado.
- A etapa foi executada sem limpeza ou reversão de arquivos externos à frente.

## 5. O que foi implementado no backend

### 5.1 Modelo

Arquivo: [`backend/models/protetico.py`](../backend/models/protetico.py)

- `ServicoProtetico.codigo`
  - tipo: `String(30)`
  - nulável: sim
  - indexado: sim
  - significado: identificador textual do serviço, mantido como campo técnico novo
- `ServicoProtetico.descricao`
  - tipo: `Text`
  - nulável: sim
  - significado: observações/descrição multilinha do serviço
- `UniqueConstraint`
  - `(clinica_id, protetico_id, codigo)` com nome `uq_servico_protetico_clinica_protetico_codigo`
- a unicidade anterior por `(protetico_id, nome)` foi preservada.

### 5.2 Rota

Arquivo: [`backend/routes/proteticos_routes.py`](../backend/routes/proteticos_routes.py)

- O schema de entrada de serviço passou a aceitar:
  - `codigo: str | None`
  - `descricao: str | None`
- A serialização de listagem, criação e alteração passou a devolver:
  - `codigo`
  - `descricao`
  - os campos já existentes
- A normalização faz:
  - trim de `codigo`
  - trim de `descricao`
  - conversão de string vazia em `None`
- A regra de duplicidade de código ficou restrita ao par:
  - mesma clínica
  - mesmo protético
  - mesmo código
- Em conflito de unicidade, a API responde com `409`.
- O contrato antigo continua aceito:
  - payload sem `codigo`
  - payload sem `descricao`

### 5.3 Script aditivo

Arquivo: [`backend/scripts/migrar_servico_protetico_codigo_descricao.py`](../backend/scripts/migrar_servico_protetico_codigo_descricao.py)

- Garante a existência das colunas `codigo` e `descricao`.
- Faz backfill de `codigo` com o valor textual de `id` apenas quando o campo está nulo/vazio.
- Não sobrescreve códigos já preenchidos.
- Verifica duplicidades antes de consolidar o índice único.
- Cria o índice único `uq_servico_protetico_clinica_protetico_codigo` quando ausente.
- Inclui caminho de downgrade manual no caso de bancos que suportem `DROP COLUMN`.

### 5.4 Teste automatizado

Arquivo: [`backend/tests/test_servicos_protetico_codigo_descricao.py`](../backend/tests/test_servicos_protetico_codigo_descricao.py)

- Valida migração.
- Valida backfill.
- Valida leitura com `codigo` e `descricao`.
- Valida compatibilidade com payload antigo.
- Valida criação e edição com `codigo`.
- Valida duplicidade por protético/clínica.

## 6. Evidência da execução no banco local

O script aditivo foi executado com sucesso no PostgreSQL local de desenvolvimento, com o seguinte resumo:

- `columns_added`: `['codigo', 'descricao']`
- `backfill_rows`: `248`
- `duplicates_checked`: `True`
- `index_created`: `True`

Interpretação:

- existiam 248 serviços de protético sem `codigo` preenchido;
- todos receberam backfill com `codigo = id::text`;
- o índice único novo foi criado com sucesso;
- não houve sobrescrita de códigos existentes.

## 7. Contrato de dados confirmado

- `codigo`
  - texto/alfanumérico
  - até 30 caracteres
  - obrigatório no futuro do React, mas ainda opcional no backend durante a transição
  - preserva zeros à esquerda
  - não é gerado automaticamente pelo backend de forma permanente
  - o backfill inicial usa `id` como valor textual de transição
- `descricao`
  - texto livre
  - multilinha
  - opcional
  - sem máscara
- `prazo`
  - permanece inteiro
  - sem mudança visual nesta etapa
- `preco`
  - permanece com o rótulo `Preço`
  - sem mudança de contrato nesta etapa

## 8. Compatibilidade preservada

- A listagem continua funcionando com o contrato anterior.
- A criação continua aceitando payloads antigos.
- A edição continua aceitando payloads antigos.
- O frontend legado permanece intocado.
- O React permanece intocado nesta etapa.

## 9. Arquivos lidos para esta etapa

- [`backend/models/protetico.py`](../backend/models/protetico.py)
- [`backend/routes/proteticos_routes.py`](../backend/routes/proteticos_routes.py)
- [`backend/scripts/aplicar_compatibilidade_schema.py`](../backend/scripts/aplicar_compatibilidade_schema.py)
- [`backend/scripts/migrar_servico_protetico_codigo_descricao.py`](../backend/scripts/migrar_servico_protetico_codigo_descricao.py)
- [`backend/tests/test_servicos_protetico_codigo_descricao.py`](../backend/tests/test_servicos_protetico_codigo_descricao.py)
- [`docs/11_roadmap_desenvolvimento.md`](../docs/11_roadmap_desenvolvimento.md)

## 10. Validação executada

- Migração aditiva aplicada com sucesso no banco local.
- Teste automatizado criado para cobrir migração, leitura, criação e alteração.
- Durante a validação do teste, foi necessário importar `models.convenio_odonto` no arquivo de teste para completar a configuração dos mappers SQLAlchemy.

## 11. Riscos residuais

- O script aditivo não substitui uma migration formal do projeto, porque o repositório não usa Alembic nesta frente.
- O teste atual depende de imports de modelos relacionados para inicialização completa dos mappers.
- O contrato do `codigo` ainda precisa da implementação visual no frontend React para ficar plenamente utilizável.

## 12. Conclusão

A etapa de backend/banco para `Serviços de protético` foi fechada com `codigo` e `descricao` suportados no modelo, na rota e no schema aditivo, com backfill aplicado localmente e contrato compatível com payload antigo e novo. O próximo passo natural é a etapa de frontend React, sem reabrir backend nem banco.
