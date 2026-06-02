# Ficha Pessoal - Historico - Refatoracao da tela Propriedades da linha

## Objetivo da etapa
Extrair a tela `Propriedades da linha` para um modulo proprio no frontend, preservando o comportamento validado anteriormente e mantendo o modulo principal da aba Historico apenas como orquestrador da grade e da linha selecionada.

## Arquivos alterados / criados
- `frontend/js/modules/ficha-pessoal-aba-historico.js`
- `frontend/js/modules/ficha-pessoal-aba-historico-propriedades-da-linha.js`
- `frontend/index.html`
- `docs/11_roadmap_desenvolvimento.md`

## O que foi extraido do modulo principal
- Montagem do modal.
- Preenchimento dos campos do modal.
- Datalist / sugestoes de prestadores.
- Leitura e normalizacao dos campos do modal.
- Aplicacao e cancelamento da janela.
- Handlers locais de `Enter` e `Escape`.
- Controle visual e operacional do `Cirurgiao responsavel` dentro da janela.

## O que ficou no modulo principal
- Grade da aba Historico.
- Selecao de linha.
- Insercao, edicao e exclusao.
- Navegacao por teclado da grade.
- Serializacao e reaplicacao do envelope `extra.historico_aba`.
- Orquestracao para abrir o novo modulo de propriedades.
- Default e reconciliacao do Cirurgiao responsavel ligados ao contexto de sessao e ao catalogo de prestadores.

## Como o novo modulo foi integrado
- O novo arquivo foi carregado antes do modulo principal no `frontend/index.html`.
- O modulo principal passou a criar uma ponte pequena para o novo modulo por meio de uma factory exposta em `window`.
- O novo modulo recebe dependencias explicitas do modulo principal para evitar acoplamento circular.
- A tela continua sendo aberta pela acao da grade, mas a montagem e a edicao visual ficaram isoladas no modulo novo.

## Separacao equivalente no backend
- Nenhuma separacao adicional foi necessaria nesta primeira refatoracao.
- O envelope atual `source_payload` / `extra.historico_aba` foi preservado integralmente.
- Nao houve nova rota, nao houve nova migration, nao houve novo schema e nao houve novo modelo de persistencia.
- A normalizacao do envelope segue no fluxo atual; nesta fase nao havia ganho tecnico real em criar helper/service novo no backend.

## Como o comportamento foi preservado
- O contrato funcional da tela continua o mesmo para todos os campos.
- `Cirurgiao responsavel` continua respeitando o comportamento ja validado.
- `Aplicar`, `Cancelar`, `X` e `Escape` continuam funcionando.
- A serializacao e a reaplicacao continuam compatíveis com o envelope atual.
- A integracao com `Grava` permanece no fluxo atual.

## Riscos observados
- A introducao de um novo modulo exige manter os contratos de dependencias pequenos e bem definidos.
- Se a ponte entre os modulos crescer demais, a separacao pode voltar a virar acoplamento disfarçado.
- O backend ainda permanece sem helper dedicado porque nao houve necessidade funcional real nesta fase.

## Como testar no sistema
1. Abrir Ficha Pessoal.
2. Selecionar um paciente.
3. Entrar na aba Historico.
4. Selecionar uma linha e abrir `Propriedades da linha`.
5. Confirmar que todos os campos continuam aparecendo:
   - Data
   - Cirurgiao responsavel
   - Regiao
   - Cor de fundo
   - Historico
   - Data de insercao
   - Data de atualizacao
6. Confirmar que `Aplicar`, `Cancelar`, `X` e `Escape` continuam funcionando.
7. Confirmar que `Cirurgiao` continua respeitando o comportamento ja validado.
8. Alterar valores, gravar e reabrir o paciente.
9. Confirmar que a tela continua funcional apos a refatoracao.
10. Confirmar que nenhuma outra aba da Ficha Pessoal foi afetada.

## Proxima subetapa recomendada
- Validacao manual completa da tela refatorada e, se necessario, refinamentos pequenos de integracao entre o modulo principal e o modulo novo.
