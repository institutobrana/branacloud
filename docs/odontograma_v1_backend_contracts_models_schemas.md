# Odontograma Brana - Contracts, models e schemas backend da V1

## 1. Objetivo da subetapa

Criar a camada minima de backend estrutural de leitura da V1 do odontograma Brana, sem rotas, sem frontend e sem service funcional completo.

## 2. Escopo exato

- criar contracts de leitura
- criar models ORM das tabelas da V1
- criar schemas de leitura/serializacao/validacao
- manter modularizacao explicita
- nao criar rotas
- nao criar endpoints
- nao criar tela
- nao alterar frontend
- nao mexer em `app.js`
- nao criar service amplo

## 3. Arquivos backend criados/alterados

Arquivos novos desta subetapa:

- `backend/contracts/odontograma_contract.py`
- `backend/models/odontograma_model.py`
- `backend/schemas/odontograma_schema.py`

Arquivos de apoio desta subetapa:

- `docs/odontograma_v1_backend_contracts_models_schemas.md`
- `docs/11_roadmap_desenvolvimento.md`

## 4. Estrutura modular adotada

- `contracts` para tipagem e contrato interno de leitura
- `models` para representacao ORM das tabelas da V1
- `schemas` para serializacao e validacao de respostas futuras

## 5. Contracts criados

- status de intervencao
- slot da arcada
- dente da intervencao
- face opcional da intervencao
- intervencao consolidada
- resumo de leitura do odontograma

## 6. Models criados

- `OdontogramaIntervencaoStatus`
- `OdontogramaArcadaSlot`
- `OdontogramaIntervencao`
- `OdontogramaDente`
- `OdontogramaFace`

Os models espelham as tabelas criadas pela migration minima da V1 e mantem relacoes basicas com `clinicas`, `pacientes`, `tratamento`, `prestador_odonto` e `procedimento`.

## 7. Schemas criados

- `OdontogramaIntervencaoStatusSchema`
- `OdontogramaArcadaSlotSchema`
- `OdontogramaDenteSchema`
- `OdontogramaFaceSchema`
- `OdontogramaIntervencaoSchema`
- `OdontogramaResumoSchema`
- `OdontogramaListaStatusResponse`
- `OdontogramaResumoResponse`

## 8. O que ficou de fora

- rotas HTTP
- endpoints
- APIRouter
- service de negocio completo
- frontend
- `app.js`
- telas novas
- escrita no banco
- importacao de bitmap legado

## 9. Onde testar antes da proxima subetapa

Antes de seguir para rotas, testar:

- importacao dos tres arquivos backend novos
- compilacao de sintaxe
- compatibilidade dos models com a migration ja existente
- compatibilidade dos schemas com os campos minimos da V1
- ausencia de alteracao em frontend e `app.js`
- ausencia de endpoint ou tela nova

## 10. Registro para roadmap

- camada backend estrutural de leitura do odontograma V1 criada
- contracts, models e schemas adicionados
- sem rotas nesta etapa
- sem frontend nesta etapa
- modularizacao preservada
- proxima subetapa sugerida: rotas backend de leitura
