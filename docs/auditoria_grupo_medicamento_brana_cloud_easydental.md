# Auditoria de `Grupo de medicamento` no Brana Cloud

## Contexto

Esta auditoria registra a leitura do legado do Brana Cloud e a comparação com o material acessível do EasyDental Desktop (`Y:\EDS70`) para entender como a tabela auxiliar `Grupo de medicamento` se comporta hoje e se ela pode ou nao ser tratada como tabela simples padrao.

O nome oficial do produto permanece **Brana Cloude**. Nesta frente, o codigo atual do Brana Cloud foi tratado como fonte da verdade para confirmar o comportamento real.

## Referencias lidas

### Brana Cloud

- `backend/routes/cadastros_routes.py`
- `backend/routes/medicamentos_routes.py`
- `backend/models/medicamento.py`
- `backend/models/financeiro.py`
- `backend/services/signup_service.py`
- `backend/scripts/sincronizar_auxiliares_easydental.py`
- `backend/scripts/migrar_medicamentos_easy_para_saas.py`
- `backend/routes/editor_textos_routes.py`
- `frontend/app.js`
- `frontend/js/modules/auxiliares.js`
- `frontend/js/modules/medicamentos.js`

### EasyDental Desktop / EDS70

- `Y:\EDS70\Help\Manual_EDS70_Completo.pdf`
- `Y:\EDS70\Help\Manual_EDS70_CAP_*.pdf`
- `Y:\EDS70\Textos\*.txt`, `*.doc`, `*.rtf`, `*.mod` quando acessiveis
- Estrutura e inventario do banco legados em material local do projeto, especialmente:
  - `backend\estrutura_eds70.txt`
  - `backend\estrutura_precificacao.txt`
  - `docs\migracao_executada_conta13_pg18_para_pg17.sql`

## Estrutura tecnica identificada

### Nome tecnico/estrutura da tabela

`Grupo de medicamento` nao aparece como um cadastro generico simples no codigo atual. Ele funciona como uma auxiliar especial ligada ao dominio de medicamentos e ao assistente de textos/prescricao.

No legado do Brana Cloud, o tipo e reconhecido por:

- `MEDICAMENTO_TIPO_AUX_GRUPO = "Grupo de medicamento"`
- tratamento especial em `_aux_tipo_match()`
- origem de dados em `ItemAuxiliar`
- consumo direto no modulo de medicamentos e no editor de textos

### Colunas que aparecem na grade

Na grade legado de auxiliares, os itens sao exibidos com:

- indice/ordem visual
- codigo
- descricao

No caso de `Grupo de medicamento`, a listagem acessivel no fluxo atual tambem retorna apenas:

- `id`
- `codigo`
- `descricao`

### Campos solicitados no modal

O modal de `Grupo de medicamento` pede apenas:

- `Descrição`

O `Código` nao e digitado como campo normal no modal desta frente; ele e gerado automaticamente.

### Como o codigo parece ser gerado hoje

A regra local observada em `frontend/app.js` gera o codigo automaticamente com base no maior valor numerico existente:

- varre `auxItensCache`
- considera somente codigos numericos
- calcula `maxNum + 1`
- preserva a largura minima de dois digitos
- usa preenchimento com zero a esquerda quando necessario

Em outras palavras, o codigo e **auto sequencial** e nao depende de preenchimento manual no modal.

## O que foi possivel confirmar com seguranca

1. `Grupo de medicamento` e um tipo de auxiliar oficialmente reconhecido pelo cadastro legado.
2. O fluxo nao se comporta como tabela simples padrao.
3. O modal e mais curto e especial do que os cadastros simples:
   - so pede descricao
   - o codigo e automatizado
4. A tabela e usada como base de apoio para o modulo de medicamentos.
5. Existe dependencia explicita no backend para consumir esta auxiliar:
   - `backend/routes/medicamentos_routes.py`
   - `backend/routes/editor_textos_routes.py`
6. O script de sincronizacao com EasyDental trata `Grupo de medicamento` como dado vindo de `DEF_GRUPO`.

## O que ficou inconclusivo

1. A confirmacao visual direta no material do EasyDental Desktop acessivel em `Y:\EDS70` ficou limitada.
2. O PDF/manual acessivel nao trouxe, nesta leitura local, uma prova de interface suficiente para comparar o modal completo com garantia visual absoluta.
3. A evidencia mais forte de EasyDental veio do script de sincronizacao e do mapeamento de banco, nao de uma captura visual direta do modal.

## Conclusao

`Grupo de medicamento` deve ser tratado como **frente especifica**, nao como tabela simples padrao.

Motivos:

- modal especial com somente descricao
- codigo gerado automaticamente
- dependencia forte do modulo de medicamentos
- papel de apoio em prescricao/textos
- fonte legada indica estrutura operacional distinta do CRUD simples consolidado para as demais auxiliares

## Documento orientador para a proxima etapa

Se esta frente for continuada, o proximo passo recomendado e:

1. manter `Grupo de medicamento` separado do lote de tabelas simples;
2. definir contrato proprio para o modal e para o consumo no modulo de medicamentos;
3. evitar duplicar o padrao simplificado ja aplicado em outras auxiliares;
4. validar com cuidado qualquer replica de comportamento no frontend novo antes de implementar.

## Fechamento

Esta etapa foi registrada apenas como auditoria/documentacao. Nao houve implementacao de interface, backend, banco ou migration.

## Atualizacao de conferência textual

### Fonte consultada em `Y:\\EDS70`

- `Y:\EDS70\Dados\eds70.sql`, onde a estrutura de `DEF_GRUPO` foi localizada.
- O retorno local do banco `brana_saas` confirma registros de `Grupo de medicamento` com grafia correta, incluindo acentos como em `Antihistamínicos`, `Corticosteróides`, `Antiarrítmicos`, `Bloqueadores de cálcio`, `Antineoplásicos` e `Antibióticos sistêmicos`.

### Diagnóstico da origem do problema

O dado persistido e a base de origem conferida em `Y:\EDS70` nao indicaram problema de texto no backend ou no banco. A correção aplicada nesta etapa foi no frontend, para garantir que os rótulos e placeholders relacionados a `Grupo de medicamento` e aos textos da grade fossem exibidos com acentuação correta.

### Situação após a correção

- backend e banco permaneceram inalterados;
- o modal proprio de `Grupo de medicamento` permaneceu curto e sem campo `Código`;
- a listagem passou a ser exibida com textos normalizados no frontend;
- a tabela simples `Tipos de indicação` foi revalidada sem regressão visual.
