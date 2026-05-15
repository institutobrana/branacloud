# Anamnese - Subetapa 1 - Namespace passivo

## 1. Contexto

- A Subetapa 0 revisada foi concluída em `docs/anamnese_subetapa_0_revisada_pos_recuperacao_eds70.md`.
- Esta etapa cria apenas o namespace passivo do modulo Anamnese.
- `frontend/app.js` continua como fonte funcional da verdade.
- A modularizacao funcional ainda nao comecou.

## 2. Arquivos alterados

- `frontend/js/modules/anamnese.js`
- `frontend/index.html`
- `docs/anamnese_subetapa_1_namespace_passivo.md`

## 3. O que o módulo passivo contém

- `window.BranaAnamneseModule`
- `meta`
- `getInfo()`
- `getStatus()`
- `info()`
- `diagnostico`
- `funcoesMonoliticasMapeadas`
- `helpersCandidatosFuturos`
- `riscosConhecidos`
- `endpointsMapeados`
- `seedObrigatorio`
- `questionariosRecuperadosClinica1`

Conteudo documentado no namespace:

- modulo: `Anamnese`
- subetapa: `1`
- status: `passivo`
- ativo: `false`
- controlaFluxo: `false`
- diagnostico da origem e do fluxo ativo
- funcoes monoliticas mapeadas
- helpers candidatos futuros
- riscos conhecidos
- endpoints mapeados
- seed obrigatorio
- questionarios recuperados da clinica 1

## 4. O que o módulo NÃO faz

- nao usa DOM
- nao usa fetch
- nao usa requestJson
- nao registra eventos
- nao abre modal
- nao renderiza
- nao salva
- nao exclui
- nao renumera
- nao altera cache
- nao controla fluxo
- nao altera respostas de paciente
- nao mexe em seed obrigatorio

## 5. Alteração no index.html

- Foi adicionada apenas a carga do script passivo `frontend/js/modules/anamnese.js` antes de `frontend/app.js`.
- Nenhum outro comportamento foi alterado no HTML.

## 6. Confirmações de segurança

- `frontend/app.js` nao foi alterado.
- backend nao foi alterado.
- banco nao foi alterado.
- endpoints nao foram alterados.
- scripts de recuperacao/backfill nao foram alterados.
- `Principal` EDS70 de 35 perguntas nao foi tocado.
- resposta orfa nao foi tocada.
- respostas EDS70 nao foram migradas.

## 7. Checks executados

- `node --check frontend/app.js`
- `node --check frontend/js/modules/anamnese.js`
- `python -m py_compile backend/services/signup_service.py`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules/anamnese.js`
- `git diff --stat`
- `git status --short`

## 8. Como validar no console

Depois de `Ctrl+F5`, testar:

- `window.BranaAnamneseModule`
- `window.BranaAnamneseModule.getStatus()`
- `window.BranaAnamneseModule.getInfo()`

Resultado esperado:

- `status: "passivo"`
- `ativo: false`
- `controlaFluxo: false`
- sem erro no console

## 9. Onde testar no sistema

1. `Ctrl+F5`.
2. Entrar com `gleissontel@gmail.com`.
3. Abrir `Anamnese`.
4. Confirmar os 5 questionarios:
   - `Principal`
   - `Implante`
   - `Ficha complementar`
   - `Anamnese de Saúde`
   - `Anamnese pessoal`
5. Conferir quantidades:
   - `Principal`: 17
   - `Implante`: 12
   - `Ficha complementar`: 12
   - `Anamnese de Saúde`: 55
   - `Anamnese pessoal`: 16
6. Abrir ficha de paciente.
7. Validar fluxo de Anamnese/respostas.
8. Confirmar console sem `ReferenceError` ou `TypeError`.
9. Confirmar que `window.BranaAnamneseModule` existe e esta passivo.

## 10. Recomendação para próxima etapa

- Antes de extrair helpers funcionais, fazer a Subetapa 2 de fronteiras e contratos.
- Nao integrar helper ainda.
- Nao mexer em renderizacao/lista de questionarios.
- Nao tocar em modais ou respostas.

