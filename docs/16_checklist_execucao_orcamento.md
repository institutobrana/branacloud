# 16 - Checklist de Execucao por Onda - Modulo Orcamento

## Objetivo

Detalhar a sequencia pratica de implementacao do modulo Orcamento no Brana Cloude, com ondas pequenas, verificacoes minimas e pontos de parada seguros.

## Regras gerais

- Nao iniciar implementacao sem aviso previo ao usuario.
- Fazer backup/checkpoint antes da primeira alteracao de codigo.
- Executar uma onda por vez.
- Confirmar funcionalidade minima antes de avancar.
- Atualizar `docs/15_plano_execucao_orcamento.md` e `docs/11_roadmap_desenvolvimento.md` ao final de cada onda.
- Se aparecer regressao, interromper e registrar a causa antes de seguir.

## Onda 0 - Preparacao

### Objetivo

Preparar o terreno documental e tecnico antes de qualquer codificacao.

### Estado atual do workspace

- O worktree ja possui alteracoes preexistentes em outras trilhas do projeto.
- Essas alteracoes nao serao tocadas nesta frente sem orientacao explicita.
- O baseline do Orçamento deve ser tratado como checkpoint isolado antes da primeira alteracao real desta implementacao.

### Checklist

- Revisar `docs/14_especificacao_tela_orcamento_easy_dental.md`.
- Revisar `docs/15_plano_execucao_orcamento.md`.
- Confirmar que o escopo continua sem implementacao.
- Separar os arquivos-alvo da Fase 1.
- Definir o ponto de backup/checkpoint.

### Teste minimo

- Documento de plano e checklist coerentes entre si.
- Nenhuma mudanca de comportamento ainda.

### Ponto de parada

- Apos validacao documental e antes da primeira alteracao de codigo.

## Onda 1 - Base de backend

### Status atual

- Iniciada com checkpoint fisico em `backups_modularizacao/orcamento_onda1_pre_impl_20260617_121407`.
- Os arquivos novos do backend foram criados de forma isolada para o modulo Orcamento.
- Validacao runtime real concluida com login autentico e endpoints principais respondendo no ambiente local.

### Arquivos alvo

- `backend/schemas/orcamento_schema.py`
- `backend/services/orcamento_service.py`
- `backend/services/orcamento_financeiro_service.py`
- `backend/routes/orcamento_routes.py`

### Objetivo

Criar o contrato tecnico e a espinha dorsal do modulo sem expor ainda toda a UI final.

### Checklist

- Definir schemas de consulta, edicao, aprovacao e impressao.
- Criar servico principal de montagem do orcamento.
- Criar servico financeiro com funcoes isoladas.
- Publicar rotas principais com autenticao e permissao corretas.
- Garantir que o retorno seja consistente para uma unica tela de orcamento.

### Teste minimo

- A rota principal responde para paciente/tratamento validos.
- O payload contem os blocos esperados: grade, abas e parcelas.
- Um acesso sem autenticacao falha.
- Um acesso com contexto invalido nao cruza dados de outro tratamento.

### Ponto de parada

- Ao fechar a resposta principal do backend com contrato estavel.

### Risco principal

- Quebrar calculos, totals ou regras de aprovacao.

## Onda 2 - Estrutura de frontend

### Status preparatorio

- Iniciada com checkpoint fisico em `backups_modularizacao/orcamento_onda2_pre_impl_20260617_125540`.
- Os arquivos novos do frontend foram criados de forma isolada para o modulo Orcamento.
- O roteamento minimo no shell foi ligado ao novo modulo.
- A validacao de sintaxe terminou limpa.
- A validacao visual no browser local ficou pendente por timeout da sessao de browser nesta rodada.

### Arquivos alvo

- `frontend/orcamento/orcamento.js`
- `frontend/orcamento/orcamento-api.js`
- `frontend/orcamento/orcamento-state.js`
- `frontend/orcamento/orcamento-render.js`

### Objetivo

Criar a tela principal com estado e integracao minima ao backend.

### Checklist

- Criar a camada de API do modulo.
- Criar o estado local da tela.
- Criar a renderizacao inicial da grade principal.
- Criar as abas e a area lateral de parcelas.
- Garantir que o modulo nao dependa de logica espalhada em `frontend/app.js`.

### Teste minimo

- A tela abre com dados validos.
- A troca de tratamento atualiza o estado sem resetar a pagina.
- A grade principal e a lateral aparecem com dados coerentes.

### Ponto de parada

- Quando a tela principal estiver navegavel e visualmente consistente.

### Risco principal

- Estado desincronizado entre grade, abas e modal.

## Onda 3 - Modais centrais

### Arquivos alvo

- `frontend/orcamento/modals/propriedades-da-intervencao.js`
- `frontend/orcamento/modals/propriedades-da-intervencao-financeiro.js`
- `frontend/orcamento/modals/elimina-intervencao.js`
- `frontend/orcamento/modals/aprovacao-orcamento.js`
- `frontend/orcamento/modals/altera-parcela.js`

### Objetivo

Fechar as acoes mais sensiveis do fluxo financeiro e clinico.

### Checklist

- Implementar edicao da intervencao na aba principal.
- Implementar edicao financeira da intervencao.
- Implementar confirmacao de exclusao.
- Implementar aprovacao e fluxo para conta corrente.
- Implementar alteracao de parcela individual.

### Teste minimo

- `Grava esta` altera somente a intervencao atual.
- `Grava todas` atua apenas no tratamento corrente.
- `Nao incluir no orcamento` remove a intervencao do calculo sem apagar o tratamento.
- Aprovacao gera o evento esperado para a conta corrente.
- Alteracao de parcela atualiza o cronograma sem corromper o restante.

### Ponto de parada

- Ao validar que os modais centrais refletem o comportamento conhecido do EasyDental.

### Risco principal

- Alteracoes financeiras propagando efeitos incorretos para parcelas e conta corrente.

## Onda 4 - Impressao e fechamento

### Arquivos alvo

- `backend/services/orcamento_impressao_service.py`
- `frontend/orcamento/modals/impressao-tratamento.js`

### Objetivo

Fechar a saida impressa e os parametros finais do fluxo.

### Checklist

- Expor os parametros de impressao no backend.
- Montar o modal de impressao no frontend.
- Garantir que o modelo, titulo, observacoes e flags sejam transmitidos corretamente.
- Validar o caminho de saida/relatorio.

### Teste minimo

- A modal mostra os campos corretos.
- O payload de impressao traz os dados do tratamento ativo.
- A combinacao de flags nao quebra o relatorio.

### Ponto de parada

- Quando a impressao estiver funcional em pelo menos um fluxo feliz.

### Risco principal

- Desalinhamento entre configuracao visual e relatorio final.

## Onda 5 - Integracao do shell

### Arquivo alvo

- `frontend/app.js`

### Objetivo

Conectar o modulo sem reintroduzir monolito.

### Checklist

- Garantir que o `app.js` apenas roteie para o modulo.
- Evitar mover logica de negocio para o shell.
- Preservar outros fluxos do sistema.

### Teste minimo

- O modulo abre a partir do ponto de entrada esperado.
- Os fluxos existentes continuam funcionando.

### Ponto de parada

- Assim que a ligacao estiver limpa e minima.

### Risco principal

- Regressao ampla por alteracao indevida no ponto de entrada.

## Protocolo de checkpoint e commit

### Antes de começar

- Criar checkpoint/backup da base de trabalho.
- Registrar o estado atual da documentacao.
- Avisar o usuario antes da primeira mudanca.

### Durante a execucao

- Commit ao final de cada onda concluida.
- Nao acumular varias ondas em um unico commit.
- Se um teste falhar, parar e registrar o problema antes de prosseguir.

### Ao encerrar

- Atualizar `docs/15_plano_execucao_orcamento.md`.
- Atualizar `docs/11_roadmap_desenvolvimento.md`.
- Registrar o que ficou pendente.

## Critério de aceite geral

- O modulo Orcamento abre, carrega, edita, aprova e imprime sem acoplamento indevido ao monolito.
- Cada modal tem arquivo proprio e responsabilidade isolada.
- O comportamento funcional registrado na auditoria fica respeitado.
- O risco de regressao permanece controlado por etapas.
