# Fase 2B - Organizacao da transicao para recortes medios controlados

- Data: 26/05/2026
- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Objetivo: organizar a transicao da Fase 2 de helpers leves para a Fase 2B de recortes medios controlados.

## Contexto

- A Fase 2 vinha priorizando helpers leves, passivos e de baixo risco.
- Nas ultimas etapas, foram consolidadas ou pausadas diversas frentes leves:
  - Prestadores;
  - Preferencias / Configuracoes comuns;
  - Plano de Contas;
  - CID;
  - Etiquetas;
  - Cadastros auxiliares;
  - Medicamentos em analise documental.
- A conferencia de Medicamentos mostrou que `compararTextoMedicamento(texto, termo)` ja existe, mas nao ha consumidor local claro em `frontend/app.js`.
- A busca/listagem de Medicamentos continua backend-driven.
- Os proximos ganhos reais agora exigem tocar partes de risco medio.
- Continuar procurando micro-helper tende a gerar pouco ganho.

## Conclusao da fase de helpers leves

- A busca por helpers leves chegou ao limite pratico.
- Muitos helpers passivos ja existem e estao consolidados.
- Alguns helpers nao possuem consumidor local claro.
- O ganho incremental de continuar procurando micro-helper se tornou pequeno.
- O proximo avanco deve ser organizado em recortes medios controlados.

## Diferenca entre Fase 2, Fase 2B e Fase 3

- Fase 2: helpers leves, passivos, baixo risco.
- Fase 2B: recortes medios controlados dentro do frontend, ainda sem backend, banco, payload ou salvamento.
- Fase 3: futura, para mudancas estruturais maiores, como backend, payload, permissoes, arquitetura ou fluxos completos.

## Definicao de recorte medio controlado

- Um recorte medio controlado pode envolver apenas uma area por vez, como:
  - renderizacao local;
  - montagem de HTML;
  - selecao visual simples;
  - preparacao de dados para tela;
  - abertura/fechamento de modal sem salvar;
  - organizacao de eventos sem mudar comportamento;
  - delegacao de parte visual para modulo;
  - processamento local antes de renderizar.

## O que continua proibido na Fase 2B

- backend;
- banco;
- endpoint;
- permissoes;
- payload efetivo;
- salvamento;
- `requestJson` critico;
- editor/documento gerado;
- financeiro;
- agenda ampla;
- correcao textual;
- mojibake;
- multiplos modulos na mesma etapa.

## Protocolo obrigatorio para qualquer recorte medio

Antes de implementar, exigir:

- contrato profundo;
- mapa de funcoes;
- mapa de DOM;
- mapa de eventos;
- mapa de `requestJson`/payload/salvamento, mesmo que seja para proibir alteracao;
- definicao exata do que sera movido;
- definicao exata do que ficara no `app.js`;
- fallback ou rollback mental;
- teste manual obrigatorio;
- validacao documental pos-teste;
- commit seletivo;
- registro no roadmap.

## Classificacao dos proximos candidatos

### Medicamentos

- Risco: medio-alto.
- Observacao: possui helper passivo, mas envolve Assistente de receitas, editor de textos/receitas e documento gerado; nao e a melhor primeira escolha de Fase 2B.

### Convênios e Planos

- Risco: medio-alto.
- Observacao: tem fronteira visual clara, mas ainda impacta convenio, plano e calendario de faturamento; exige muito cuidado com payload e persistencia futura.

### Relatorios

- Risco: alto.
- Observacao: tende a envolver fluxo de saida, filtros e possiveis dependencias cruzadas.

### Materiais

- Risco: alto.
- Observacao: muito ligado a listas, modais e dependencias de negocio.

### Procedimentos genericos

- Risco: alto.
- Observacao: costuma tocar payload, vinculos e fluxo amplo.

### Ficha pessoal

- Risco: medio-alto.
- Observacao: tem fronteira funcional, mas pode arrastar comportamento clinico e dados de paciente.

### Conta corrente

- Risco: medio-alto.
- Observacao: envolve fluxo financeiro e persistencia relevante.

### Indices financeiros

- Risco: medio-alto.
- Observacao: possui impacto financeiro e possivel dependencia de calculos/persistencia.

### Agenda principal remanescente

- Risco: medio-alto.
- Observacao: frontalmente visual e organizacional, mas ainda sensivel por eventos e fluxo de agenda.

### Preferencias remanescentes

- Risco: medio controlavel.
- Observacao: melhor equilibrio entre fronteira clara, modularizacao passiva ja existente e menor chance de tocar editor/receitas/financeiro.

### Prestadores remanescentes

- Risco: medio controlavel.
- Observacao: tambem e possivel, mas ja passou por ciclo medio controlado anterior e nao precisa ser a primeira escolha da Fase 2B.

## Recomendacao da primeira frente

- **Preferencias remanescentes**

## Justificativa tecnica

- E um bloco common/core administrativo/transversal.
- Tem fronteira visual e funcional relativamente clara.
- O modulo passivo ja existe e pode servir de base para contrato profundo.
- Evita, como primeira escolha, editor/documento gerado, assistente de receitas e fluxos financeiros mais sensiveis.
- Tem boa chance de produzir ganho real em `frontend/app.js` com risco controlado.

## Proxima subetapa recomendada

- `Preferencias remanescentes - Contrato profundo de recorte medio controlado`

## Riscos remanescentes

- `frontend/app.js` ainda concentra a maior parte do comportamento.
- Qualquer recorte medio pode acabar tocando DOM, eventos e modal.
- Se o contrato nao for profundo o suficiente, ha risco de expandir escopo sem necessidade.
- Ainda existe risco de encostar em salvamento/payload se o limite nao ficar bem definido.

## Confirmacao de que nenhuma alteracao de codigo foi feita

- Esta etapa foi exclusivamente documental.
- Nenhum arquivo de codigo foi alterado.

## Confirmacao de blindagem textual/mojibake

- A blindagem textual/mojibake foi respeitada.
- Nenhum texto visivel, acento, label, placeholder ou mensagem da interface foi corrigido.

## Commit seletivo obrigatorio

- Esta etapa deve ser registrada apenas com os documentos permitidos.
- Nao incluir arquivos de codigo no commit.

## Registro para roadmap

- Registrar o encerramento pratico da busca por helpers leves.
- Registrar a abertura e organizacao da Fase 2B.
- Registrar a diferenca entre Fase 2B e a futura Fase 3.
- Registrar o protocolo de recortes medios controlados.
- Registrar `Preferencias remanescentes` como primeira frente recomendada.
- Registrar a proxima subetapa recomendada.
