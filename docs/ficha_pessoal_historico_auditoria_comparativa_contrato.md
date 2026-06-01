# Ficha Pessoal - Historico - Auditoria comparativa EasyDental x Brana Cloud

## 1. Motivo da nova frente

A aba Historico da Ficha Pessoal no Brana Cloud ja possui um esqueleto funcional conservador, com selecao, insercao, edicao, eliminacao, propriedades da linha e integracao com Grava. A partir daqui, a prioridade passa a ser comparar em detalhe o comportamento real do EasyDental com o que o Brana Cloud ja reproduz, para fechar diferencas finas com base em evidencia e nao em suposicao.

## 2. Regra da frente

Esta frente e documental e investigativa.

- Nao corrige comportamento por si so.
- Nao altera backend.
- Nao altera banco.
- Nao altera schema, migration, seed ou endpoint.
- Nao mistura auditoria com microajuste funcional.
- Nao abre correcoes fora do backlog explicitamente priorizado depois da comparacao.

## 3. Fontes de verdade

As fontes de verdade desta frente sao:

- EasyDental real, observado a partir das fontes informadas pelo usuario.
- Brana Cloud atual, com foco em `frontend/js/modules/ficha-pessoal-aba-historico.js` e no fluxo atual do `Grava`.
- Documentacao de auditoria anterior da frente.
- Roadmap vivo em `docs/11_roadmap_desenvolvimento.md`.

Fontes de investigacao informadas pelo usuario:

- `\\Dell_servidor\\c\\EDS70`
- `D:\\BRANA ARQUIVOS\\PROJETO_PRECIFICACAO_LEGADO\\Dados`

## 4. Escopo completo da auditoria

A auditoria futura deve cobrir, no minimo, as camadas abaixo:

### 4.1 Camada visual

- layout geral da aba
- grade
- cabecalhos
- botoes
- rotulos
- selecao visual
- estados de edicao
- modal ou janela de Propriedades da linha

### 4.2 Camada de interacao

- clique
- duplo clique
- selecao
- foco
- TAB
- Shift+TAB
- ENTER
- ESC
- setas
- comportamento do modal com teclado

### 4.3 Camada de regra funcional

- inserir
- editar
- eliminar
- propriedades da linha
- obrigatoriedade de campos
- preenchimentos automaticos
- comportamento sem selecao
- comportamento apos salvar/cancelar

### 4.4 Camada de origem dos dados

- se Cirurgiao e texto livre, combo ou alimentado de cadastro
- se Regiao e texto livre, lista fixa ou vem de outro modulo
- se Descricao/Historico e texto livre ou depende de procedimento
- se ha vinculos com prestadores, procedimentos ou outros modulos

### 4.5 Camada de persistencia

- como o EasyDental grava
- quando a linha passa a existir de verdade
- como reabre
- se ha datas sistemicas
- se ha metadados por linha

### 4.6 Camada de dependencias cruzadas

- prestadores
- procedimentos
- prontuario
- paciente
- outras tabelas auxiliares
- campos internos

## 5. Perguntas obrigatorias que a auditoria precisa responder

- Como exatamente funciona a aba Historico no EasyDental, passo a passo?
- Quais campos sao livres, quais sao combos e quais dependem de outro cadastro?
- O botao Inserir linha faz exatamente o que, em que ordem, com que foco e com quais valores padrao?
- O botao Edita linha faz exatamente o que?
- O botao Elimina linha pede confirmacao ou nao?
- O botao Propriedades da linha mostra quais campos reais?
- Cor de fundo, Data de insercao e Data de atualizacao existem de verdade no armazenamento ou so na UI?
- De onde vem Cirurgiao, Regiao e Descricao?
- Como o historico se relaciona com pacientes e outros modulos no EasyDental?
- O que o Brana ja reproduz corretamente?
- O que o Brana reproduz parcialmente?
- O que ainda diverge com impacto alto?
- O que diverge com impacto baixo?
- Quais diferencas exigem apenas frontend?
- Quais diferencas exigiriam mudanca estrutural futura?

## 6. Ordem segura das proximas subetapas

1. Etapa A: contrato da auditoria
2. Etapa B: engenharia reversa do EasyDental
3. Etapa C: comparacao funcional detalhada EasyDental x Brana
4. Etapa D: matriz de diferencas e priorizacao
5. Etapa E: microajustes finos controlados
6. Etapa F: validacao manual final da comparacao

## 7. Critrios para transformar diferencas em backlog

Uma diferenca so vira backlog de correcao quando:

- tiver evidencias suficientes de tela, comportamento ou dado;
- estiver classificada por impacto;
- estiver associada a um caminho tecnico seguro;
- nao depender de suposicao nao verificada;
- nao conflitar com a blindagem textual/mojibake;
- nao exigir alteracao estrutural sem justificativa;
- estiver separada em item pequeno e executavel.

## 8. Regras da auditoria

- Documentar antes de alterar.
- Comparar antes de corrigir.
- Registrar evidencias antes de concluir.
- Nao misturar o trabalho de auditoria com correcao de codigo.
- Manter o backlog visivel e priorizado.
- Manter o escopo da frente isolado da Anamnese e de outras telas.

## 9. O que ja existe no Brana Cloud

A aba Historico ja possui:

- modulo proprio em `frontend/js/modules/ficha-pessoal-aba-historico.js`
- selecao de linha
- inserir linha
- TAB / Shift+TAB
- ENTER / ESC
- integracao com Grava via `extra.historico_aba`
- editar linha
- eliminar linha
- propriedades da linha funcional/conservadora

## 10. O que a auditoria deve produzir

- mapa de diferencas visuais
- mapa de diferencas funcionais
- mapa de diferencas de origem de dados
- mapa de diferencas de persistencia
- lista de pontos que exigem apenas frontend
- lista de pontos que exigem mudanca estrutural futura
- backlog priorizado de microajustes

## 11. Encaminhamento seguro

Esta frente abre a etapa documental da auditoria comparativa. Depois dela, a sequencia segura e:

1. engenharia reversa do EasyDental
2. comparacao funcional detalhada
3. matriz de diferencas
4. backlog priorizado
5. microajustes finos controlados

## 12. Confirmacao final

Este contrato nao altera o comportamento do sistema. Ele apenas organiza a investigacao comparativa entre EasyDental e Brana Cloud para a aba Historico.
