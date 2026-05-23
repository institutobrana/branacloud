# Intervencoes / Procedimentos - Subetapa 0B documental

## 1. Objetivo

Registrar um roteiro de validacao manual dos fluxos sensiveis do modulo Intervencoes / Procedimentos antes de qualquer namespace passivo ou extracao de helper.

Esta etapa e somente documental. Nao altera codigo, nao altera backend, nao altera banco e nao altera textos funcionais.

## 2. Contexto de base

- Diretorio real: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch esperada: `modularizacao-segura-fase-1`
- Ultimo commit consolidado: `a18cb48 - Conclui modularizacao segura parcial de materiais`
- Documento base da subetapa 0: `docs/intervencoes_procedimentos_subetapa_0_mapeamento_monolitico.md`

## 3. Estado Git observado

Fotografia documental observada no inicio desta subetapa:

- `git branch --show-current`: `modularizacao-segura-fase-1`
- `git status --short`: havia somente pendencias untracked ja existentes no repositorio; nenhuma delas foi tocada por esta etapa
- `git diff --stat`: vazio no tree versionado
- `git diff --cached --stat`: vazio

Observacao: se houver qualquer arquivo novo ou alterado alem deste documento e do documento base ja existente, isso deve ser apenas registrado como risco documental. Nao mexer.

## 4. Regra de blindagem textual

Seguir a regra de blindagem textual / mojibake em:

- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

Consequencia pratica desta subetapa:

- nao corrigir labels
- nao corrigir mensagens
- nao corrigir placeholders
- nao corrigir textos de interface
- nao corrigir mojibake
- se aparecer problema textual, registrar apenas como risco documental

## 5. Fluxos sensiveis a validar manualmente

### 5.1 Abertura e fechamento da tela

Roteiro:

- abrir `Configuracoes > Tabelas > Intervencoes / Procedimentos...`
- confirmar que a tela abre normalmente
- confirmar que o painel principal aparece sem travar a UI
- fechar a tela pelo mecanismo normal do proprio modulo
- confirmar ausencia de erro novo no console do navegador

Criticos:

- abertura nao pode quebrar a tela principal
- fechamento nao pode deixar overlay preso
- nao deve haver erro de DOM, bind ou request

### 5.2 Lista principal

Roteiro:

- confirmar carregamento inicial da lista
- aplicar filtro de busca
- trocar de tabela
- selecionar um item na grade
- dar duplo clique na grade principal
- clicar em `Novo`
- clicar em `Alterar`
- usar `Excluir` somente como roteiro de validacao visual, sem executar exclusao real de dados sensiveis

Criticos:

- lista precisa responder a filtro e troca de tabela
- selecao deve refletir o item correto
- duplo clique deve abrir o editor do item selecionado
- botao `Novo` nao pode herdar estado indevido
- botao `Alterar` precisa respeitar o item ativo
- exclusao deve ser observada apenas como comportamento de UI e confirmacao, sem executar limpeza de dados legados

### 5.3 Editor de procedimento / intervencao

Roteiro:

- abrir um novo procedimento
- abrir um procedimento existente
- conferir campos principais
- salvar
- cancelar ou fechar
- observar se textos visiveis permanecem inalterados

Criticos:

- abertura do editor nao pode corromper a lista
- salvamento nao pode apagar materiais proprios
- cancelamento nao pode alterar estado persistido
- o editor nao deve introduzir texto novo nem corrigir texto ja existente

### 5.4 Procedimento Generico

Roteiro:

- selecionar um Procedimento Generico
- trocar para outro Procedimento Generico
- trocar para `Selecione...`
- confirmar comportamento do `procedimento_generico_id`
- confirmar que herdados antigos saem
- confirmar que proprios reais permanecem
- confirmar que lista vazia e valida quando nao houver proprios

Criticos:

- `Selecione...` deve deixar `procedimento_generico_id` nulo ou vazio
- herdados antigos nao podem permanecer
- materiais proprios reais nao podem ser perdidos
- se nao houver proprios, a grade vazia e aceitavel
- troca de generico nao pode misturar heranca antiga com a nova

### 5.5 Materiais vinculados

Roteiro:

- validar materiais proprios
- validar materiais herdados
- confirmar que o proprio vence sobre o herdado
- confirmar deduplicacao por `material_id`
- vincular material
- editar material vinculado
- desvincular material proprio
- dar duplo clique na grade de materiais
- confirmar bloqueio de duplicidade com o modal proprio do sistema
- nao reabrir saneamento de vinculos legados nesta etapa

Criticos:

- itens proprios devem ter precedencia sobre herdados
- deduplicacao nao pode duplicar o mesmo `material_id`
- vincular e editar nao podem alterar o grupo herdado indevidamente
- desvincular nao pode remover proprios reais de forma involuntaria
- o modal de duplicidade deve ser apenas o bloqueio de sistema esperado, nao um caminho de saneamento

### 5.6 Relacao com Procedimentos Genericos

Roteiro:

- observar heranca de materiais
- trocar o generico e conferir recomposicao
- preservar proprios
- validar comportamento quando o generico nao tem materiais
- registrar que o bloco continua acoplado ao `frontend/app.js`

Criticos:

- recomposicao deve refletir o generico atual
- proprios devem sobreviver a troca
- um generico sem materiais deve produzir heranca vazia
- nao extrair nada ainda enquanto essa dependencia permanecer sensivel

### 5.7 Tabelas de procedimento

Roteiro:

- trocar tabela
- validar tabela Particular
- validar outras tabelas existentes
- abrir o modal de tabela
- variar fonte convênio / particular
- observar relacao com Convenios e Planos

Criticos:

- troca de tabela nao pode quebrar lista nem edicao
- tabela Particular precisa continuar funcional
- o modal nao pode inverter fonte ou credenciamento de forma indevida
- qualquer regressao aqui impacta tabelas, convênios e relatorios

### 5.8 Relatorio de tabela de procedimentos

Roteiro:

- abrir o relatorio
- testar filtros
- observar renderizacao
- conferir se a tabela do relatorio obedece o contexto da tabela e do procedimento

Criticos:

- relatorio nao pode depender de estado quebrado da lista
- nao pode quebrar por tabela ou generico ausente
- erros de renderizacao precisam ser tratados como bloqueio para a proxima subetapa

### 5.9 Calculo financeiro / custos

Roteiro:

- apenas identificar pontos de calculo para validacao manual
- nao alterar formulas
- nao alterar helpers de calculo
- observar `procFmtMoeda`, `procParse`, `toFloat`, `procCenario` e funcoes semelhantes se aparecerem no fluxo

Criticos:

- qualquer erro de calculo e bloqueio
- qualquer divergencia de custo material, custo de laboratorio ou lucro e bloqueio
- nao mexer em calculo nesta etapa

### 5.10 Eventos

Roteiro:

- validar eventos de clique
- validar eventos de duplo clique
- validar eventos de troca de combo
- validar eventos de modal
- observar possiveis overrides ou reaplicacoes tardias de funcoes
- marcar pontos que nao devem ser extraidos sem teste especifico

Criticos:

- evento errado pode abrir editor indevido
- duplo clique nao pode parar de funcionar
- troca de combo nao pode deixar estado incoerente
- modais nao podem ficar presos por override tardio

### 5.11 Console e rede

Roteiro:

- abrir o console do navegador
- observar se existe erro novo ao abrir a tela
- observar falhas de requisicao
- observar mensagens de rede que indiquem endpoint quebrado
- nao alterar endpoints

Criticos:

- qualquer erro novo no console e bloqueio
- qualquer falha de request no fluxo principal e bloqueio
- esta etapa e visual e documental, nao corretiva

## 6. Criterios de aprovacao para avancar ao namespace passivo

Antes de qualquer namespace passivo, a validacao manual deve confirmar:

- a tela abre
- a lista carrega
- os filtros funcionam
- `Novo` e `Alterar` abrem o editor
- a troca de generico recompoe materiais corretamente
- `Selecione...` remove herdados
- proprios permanecem
- a duplicidade e bloqueada
- o duplo clique funciona
- o relatorio abre
- nao ha erro novo no console

Se todos esses pontos se mantiverem estaveis, a proxima subetapa pode ser namespace passivo, mas ainda vazio ou com estrutura sem comportamento.

## 7. Criterios de bloqueio

Bloquear a proxima etapa se ocorrer qualquer um dos seguintes:

- erro ao abrir a tela
- material herdado contaminando outro procedimento
- material proprio indo para Procedimento Generico
- troca de generico preservando herdados antigos indevidamente
- `Selecione...` mantendo herdados
- erro de calculo
- erro de duplo clique
- erro no relatorio
- erro textual ou mojibake identificado como risco, sem correcao nesta etapa

## 8. Recomendacao objetiva da proxima subetapa

Recomendacao: sim, apos esta validacao manual, pode-se seguir para namespace passivo, desde que ele seja vazio ou contenha apenas manifesto / estrutura sem comportamento, sem mover fluxo e sem tocar em funcoes sensiveis.

Se qualquer criterio de bloqueio aparecer, a proxima acao nao deve ser namespace passivo. Nesse caso, a documentacao adicional recomendada e uma auditoria pontual do fluxo que falhou, com captura do ponto exato, sem alterar codigo.

## 9. Onde testar no sistema

Testar em:

- `Configuracoes > Tabelas > Intervencoes / Procedimentos...`

Pontos a observar no navegador:

- abertura e fechamento da tela
- filtro e troca de tabela
- abertura de novo e edicao
- troca de Procedimento Generico
- composicao de materiais
- modais de tabela e de vinculo
- relatorio
- console e rede

## 10. Fechamento

Este documento registra a validacao manual planejada dos fluxos sensiveis do modulo Intervencoes / Procedimentos. Ele nao altera comportamento, nao corrige textos e nao inicia a modularizacao ainda.
