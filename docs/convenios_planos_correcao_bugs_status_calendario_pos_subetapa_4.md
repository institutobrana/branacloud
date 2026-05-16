# Convênios e Planos - Correção de bugs após a Subetapa 4

## 1. Bugs relatados
- A coluna `Status` das grades de convênios e planos exibia texto corrompido.
- Ao abrir a janela de `Nova data de faturamento`, aparecia um cabeçalho/barra solta duplicada no topo da tela.

## 2. Causa encontrada para a coluna Status corrompida
- A função local de status retornava um símbolo Unicode em vez de texto simples.
- O caractere estava sendo exibido com mojibake/encoding corrompido no navegador, gerando a saída estranha na grade.

## 3. Correção aplicada para a coluna Status
- A função `convPlanStatusDotV2` foi ajustada para retornar texto simples e estável:
  - `Ativo`
  - `Inativo`
- As grades de convênios e planos continuam com a mesma estrutura; somente o conteúdo textual da coluna foi estabilizado.

## 4. Causa encontrada para o cabeçalho/menu solto da Nova data de faturamento
- O `ensureModalChrome` estava sendo aplicado ao `backdrop` do calendário, em vez do modal interno.
- Isso fazia o chrome genérico de modal agir sobre o contêiner errado e produzir um cabeçalho extra/órfão no topo da tela.

## 5. Correção aplicada para o cabeçalho/menu solto
- O call-site foi ajustado para aplicar `ensureModalChrome` ao elemento modal interno da janela de calendário, e não ao backdrop.
- A janela `Nova data de faturamento` continua abrindo normalmente, sem alterar o fluxo de salvar ou os campos existentes.

## 6. Arquivos alterados
- `frontend/app.js`

## 7. Confirmação de que não houve nova modularização
- Esta etapa foi apenas correção pontual de bugs visuais/funcionais.
- Nenhuma nova helper foi criada.
- Nenhuma função foi movida para módulo.
- Nenhum contrato funcional foi ampliado.

## 8. Confirmação de que não foram alterados endpoints, backend, banco ou payloads
- Nenhum endpoint foi alterado.
- Nenhuma regra de backend foi alterada.
- Nenhuma tabela, índice ou estrutura de banco foi alterada.
- Nenhum payload foi alterado.

## 9. Confirmação de que não foram alterados clique, duplo clique, segundo clique rápido ou bindStandardGridActivation
- A seleção de linhas e a ativação por clique/duplo clique foram mantidas intactas.
- `bindStandardGridActivation` não foi alterado.

## 10. Confirmação de que nada foi salvo nas pastas legadas
- Nada foi salvo em:
  - `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO`
  - `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO`

## 11. Onde testar no navegador
- Abrir `Convênios e Planos`.
- Confirmar que a coluna `Status` mostra `Ativo` e `Inativo` nas grades de convênios e planos.
- Abrir `Calendário de faturamento` e depois `Novo...`.
- Confirmar que a janela `Nova data de faturamento` abre sem o cabeçalho solto duplicado no topo.
