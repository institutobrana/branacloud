# Contrato mestre dos campos de data do Brana Cloude

## 1. Proposito

Este documento fecha o contrato mestre dos campos de data usados no Brana Cloude e separa, de forma explicita, dois comportamentos que nao devem ser confundidos:

- campo de data generico;
- periodo de data composto por inicio e fim.

O objetivo e servir como referencia documental para futuras implementacoes em React, backend e testes, sem alterar nada nesta etapa.

## 2. Contrato do campo de data generico

O campo de data generico deve manter o comportamento confirmado em runtime no legado EasyDental e ser tratado como a referencia funcional alvo para inputs de data isolados.

### Regras funcionais

- Ao receber foco ou clique, o conteudo atual deve ser selecionado por completo.
- A digitacao substitui o valor anterior.
- `2` digitos devem completar dia no mes/ano correntes quando o contexto nao exigir mes/ano explicitos.
- `4` digitos devem ser interpretados como `DDMM` e completar com o ano corrente.
- `6` digitos devem ser interpretados como `DDMMYY` e normalizados visualmente para `DD/MM/AAAA`.
- A entrada tradicional `DD/MM/AAAA` continua valida.
- `Tab` encerra a edicao e confirma a entrada.
- Apenas datas reais sao validas; datas impossiveis devem ser rejeitadas.

### Comportamento esperado

- O valor final deve ser exibido com mascara de data legivel.
- O controle nao deve aceitar datas invalidas como se fossem validas.
- O comportamento de digitacao curta e de tabulacao deve ser previsivel e repetivel.

## 3. Contrato do periodo de data

O periodo de data e um contrato distinto do campo generico.

### Regras funcionais

- O periodo possui duas pontas: inicio e fim.
- O valor inicial padrao deve partir do primeiro dia do mes corrente.
- O valor final padrao deve partir da data atual.
- A semantica do periodo nao deve ser inferida a partir do contrato do campo generico.

### Observacao

O contrato de periodo pode usar os mesmos componentes visuais do campo generico, mas o comportamento funcional e diferente e deve ser documentado separadamente sempre que reaparecer em telas futuras.

## 4. Inventario React atualmente observado

Na frente `frontend-react/src/features/contaCorrenteCirurgiao/`, os pontos de uso atualmente relevantes para este contrato sao:

- `components/InsereLancamentoModal.jsx`: campos de data do lancamento e vencimento, com apoio de `dayjs`.
- `components/CriteriosGeraisTab.jsx`: filtros de periodo com `DatePicker` para inicio e fim.
- `components/PesquisaFluxoCaixaModal.jsx`: parametros de data usados no contrato de relatorio.

Esses pontos devem ser tratados como consumidores distintos do contrato mestre, nao como um unico comportamento.

## 5. Regras de reutilizacao futura

Quando a frente voltar a evoluir, o ideal e extrair um contrato unico de data que possa ser reutilizado por:

- inputs de data simples;
- campos de periodo;
- modais financeiros;
- relatorios;
- filtros de busca.

Mas essa unificacao ainda e futura. Nesta etapa, o documento apenas fixa a referencia funcional.

## 6. Relacao com a conta corrente do cirurgiao

Na frente de conta corrente do cirurgiao, o contrato de datas impacta principalmente:

- filtros por mes e ano;
- data de lancamento;
- data de vencimento;
- filtros de relatorio e consulta.

Esses usos devem manter consistencia visual e funcional com o contrato mestre aqui descrito.

## 7. Fechamento tecnico da frente DATA

Status consolidado na data desta etapa:

- parser reutilizavel implementado;
- consumidor 1 homologado: `Pesquisa fluxo de caixa -> Criterios gerais -> Periodo de vencimento / Periodo de lancamento`;
- consumidor 2 homologado: `Insere lancamento -> Vencimento / Data do lancamento`;
- selecao total ao foco e ao clique confirmada;
- entradas curtas `DD`, `DDMM`, `DDMMAA` e `DD/MM/YYYY` confirmadas;
- `Tab` normaliza com um unico avanco;
- `Shift+Tab` preservado no segundo consumidor;
- calendario preservado;
- payload preservado;
- defaults continuam responsabilidade da tela;
- o componente visual compartilhado ainda nao foi extraido.

Decisao arquitetural registrada:

- parser = reutilizavel;
- interacao = local aos consumidores;
- default = responsabilidade da tela;
- payload = responsabilidade da tela;
- componente compartilhado = adiado ate haver terceiro consumidor ou evidencia tecnica suficiente.
