# FASE G.1E - APROVADA E HOMOLOGADA EM RUNTIME MANUAL

Data: 2026-08-03

## Objetivo
Registrar formalmente a homologacao tecnica e manual da Fase G.1E para o fluxo `Configuracoes -> Simbolos graficos -> Novo`, sem ampliar o contrato e sem iniciar persistencia.

## Escopo revisado
- `frontend-react/src/features/simbolosGraficos/components/SimboloGraficoCreateModal.jsx`
- `frontend-react/src/features/simbolosGraficos/model/simboloGraficoCreateMapper.js`
- `frontend-react/src/features/simbolosGraficos/model/simboloGraficoCreateValidation.js`
- `frontend-react/tests/simboloGraficoCreateModal.test.js`
- `frontend-react/tests/simbolosGraficosMapper.test.js`

## Status consolidado
- FASE G.1E - APROVADA E HOMOLOGADA EM RUNTIME MANUAL.

## Resultado da revisao
- Nao existe validade duplicada no delta revisado.
- Nao existe estado derivado persistido desnecessariamente no modal.
- Nao existe `useEffect` para controlar a validade.
- Nao existe exigencia residual de `fileName`.
- Nao existe exigencia residual de `imageUrl`.
- Nao existe exigencia residual de selecao da biblioteca para habilitar `Ok`.
- Nao existe import de API no modal revisado.
- Nao existe callback de criacao/persistencia no modal revisado.
- Nao existe fechamento automatico no `Ok`.
- Nao existe loading de submissao.
- Nao existe log de payload.
- Nao existe payload persistido em estado.

## Validacao
O validador local ficou restrito a:
- nome valido apos `trim`;
- especialidade valida;
- forma entre 1 e 6.

Casos confirmados:
- nome vazio invalido;
- somente espacos invalido;
- limite maximo respeitado;
- especialidade invalida rejeitada;
- forma invalida rejeitada;
- nenhuma imagem necessaria.

## Mapper
O mapper permanece puro e nao muta a entrada.

Confirmado:
- nao acessa React;
- nao acessa DOM;
- nao acessa API;
- nao acessa storage;
- nao gera log.

Contrato do draft/payload:
- `descricao` com `trim`;
- `especialidade` tecnica;
- `tipo_simbolo = 2`;
- `tipo_marca` tecnico;
- `codigo` ausente ou `null` conforme o estado de cadastro em branco.

Ausencias confirmadas no contrato revisado:
- `fileName` como obrigatorio;
- `imageUrl` como obrigatorio;
- `imagem_custom` como requisito para habilitar o fluxo;
- `image`;
- `dataUrl`;
- `bitmap`;
- `icone`;
- biblioteca completa;
- `tenant`;
- `clinica_id`;
- `userId`.

## Testes
Executados:
- `node --test frontend-react/tests/simboloGraficoCreateModal.test.js frontend-react/tests/simbolosGraficosMapper.test.js frontend-react/tests/simbolosGraficosApi.test.js frontend-react/tests/useSimbolosGraficosTableState.test.js frontend-react/tests/simbolosGraficosRouting.test.js`

Resultado:
- total: 33
- aprovados: 33
- falhas: 0
- duracao: aproximadamente 270 ms
- warnings: nenhum no conjunto de testes

## Build
Executado:
- `cmd /c "cd /d D:\\BRANA ARQUIVOS\\BRANA CLOUD\\frontend-react && npm.cmd run build"`

Resultado:
- exit code 0
- `dist` gerado
- warning de chunk grande no bundle final

## Runtime manual
Confirmado pelo usuario no navegador real:
- a grade abriu corretamente;
- o modal `Novo` abriu estavel;
- `Ok` iniciou desabilitado;
- nome valido habilitou `Ok` sem selecionar simbolo;
- preview vazio foi aceito;
- especialidade e forma permaneceram estaveis;
- clicar `Ok` nao fechou o modal;
- clicar `Ok` nao alterou a grade;
- nao houve criacao real;
- nao houve reload;
- `Cancela` limpou o estado;
- a reabertura veio limpa;
- selecao da biblioteca permaneceu opcional;
- o preview da selecao opcional continuou funcional;
- o comportamento ocorreu exatamente como previsto.

## Limitacao de automacao
- O Playwright nao conseguiu abrir o Chromium no ambiente.
- Houve tentativa de instalacao.
- A automacao visual nao foi usada como evidencia final.
- A homologacao foi realizada manualmente no navegador real pelo usuario.
- Essa substituicao foi suficiente porque o fluxo foi observado diretamente.

## Network e Console
- nao houve comportamento visivel de POST, criacao ou reload;
- Network e Console nao foram documentados por captura detalhada;
- nao foi relatado erro de Console;
- essa ausencia de captura nao bloqueia a fase porque testes, build e comportamento manual convergiram.

## Regressoes
Nao houve regressao funcional comprovada no delta revisado.

## Decisao
Contrato local de cadastro em branco mantido como valido na camada React.
Homologacao tecnica do codigo: aprovada.
Homologacao manual em runtime: aprovada pelo usuario.
Homologacao visual automatizada: nao concluida por limitacao do Playwright no ambiente.

## Relacao com o contrato geral
O comportamento sem desenho foi homologado no React, com validade e mapper aprovados e criacao ainda local. A persistencia continua para fase posterior.
