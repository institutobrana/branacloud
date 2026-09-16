# Ordem de execucao - Onda 1 da extracao da tela principal e da faixa de paciente em uso

## 1. Identificacao

Produto: Brana Cloude

Area: Tela principal / contexto de paciente em uso

Natureza deste documento: ordem tecnica de execucao

Status: documental apenas

## 2. Objetivo da ordem

Esta ordem existe para quebrar a Onda 1 em passos pequenos e verificaveis antes de qualquer implementacao.

O foco e manter o comportamento atual estavel enquanto a responsabilidade da tela principal sai do monolito de forma gradual.

## 3. Documentos que precisam ser respeitados antes de executar

- `docs/contrato_tecnico_extracao_tela_principal_paciente_em_uso.md`
- `docs/inventario_extracao_tela_principal_paciente_em_uso.md`
- `docs/contrato_implementacao_onda1_tela_principal_paciente_em_uso.md`

Esta ordem nao substitui nenhum deles.

Ela apenas organiza o passo a passo recomendado.

## 4. Ordem de execucao proposta

### Subetapa 1 - estabilizar a fronteira documental da tela principal

Objetivo:

- confirmar que a fronteira da Onda 1 ficou restrita a `frontend/js/modules/prontuario.js`;
- manter `frontend/js/modules/paciente-em-uso-header.js` como apoio temporario;
- manter `frontend/app.js` apenas como fachada minima;
- nao abrir backend novo nesta etapa.

Arquivos esperados para a implementacao futura:

- `frontend/js/modules/prontuario.js`
- `frontend/js/modules/paciente-em-uso-header.js`
- `frontend/app.js`
- `frontend/index.html`

Teste esperado depois desta subetapa:

- abrir a aplicacao sem alterar a experiencia atual;
- confirmar que a tela principal continua abrindo normalmente;
- confirmar que ainda existe um ponto claro de montagem para a faixa de paciente em uso;
- confirmar que nao houve criacao de rota nova nem mudanca de banco.

### Subetapa 2 - montar a entrada visual minima da tela principal

Objetivo:

- criar a entrada visual inicial do modulo novo sem assumir ainda a logica de lookup;
- garantir que o modulo novo possa nascer sem quebrar o fluxo legado;
- manter o helper atual como motor visual temporario.

Arquivos esperados para a implementacao futura:

- `frontend/js/modules/prontuario.js`
- `frontend/js/modules/paciente-em-uso-header.js`

Teste esperado depois desta subetapa:

- abrir a tela principal com a faixa de paciente ainda visivel;
- confirmar que o layout nao empurra nem esconde a toolbar;
- confirmar que a tela nao depende de recarregar a pagina para aparecer;
- conferir o console do navegador para ausencia de erro novo na montagem.

### Subetapa 3 - ligar apenas a leitura do paciente em uso

Objetivo:

- fazer o modulo novo apenas ler o paciente ja existente na sessao;
- sincronizar o estado visual com o paciente atual;
- nao criar ainda edicao, troca ou persistencia nova.

Arquivos esperados para a implementacao futura:

- `frontend/js/modules/prontuario.js`
- `frontend/js/modules/paciente-em-uso-header.js`
- `frontend/app.js`

Teste esperado depois desta subetapa:

- com paciente em uso, a faixa deve mostrar codigo e nome corretamente;
- sem paciente em uso, a faixa deve continuar vazia ou em estado neutro sem quebrar a tela;
- trocar de contexto de paciente deve refletir na faixa sem exigir reload manual;
- o fluxo `Tratamento -> Novo tratamento` deve continuar recebendo o mesmo contexto.

### Subetapa 4 - ligar o lookup por codigo com Enter e Tab

Objetivo:

- usar o endpoint existente de lookup por codigo de paciente;
- disparar a busca apenas quando o usuario confirmar com `Enter` ou `Tab`;
- preservar o fallback para menu de pacientes quando nao houver paciente valido.

Arquivos esperados para a implementacao futura:

- `frontend/js/modules/prontuario.js`
- `backend/routes/cadastros_routes.py`
- `frontend/app.js`

Teste esperado depois desta subetapa:

- digitar um codigo valido e pressionar `Enter` ou `Tab` deve localizar o paciente;
- digitar um codigo invalido nao deve quebrar o fluxo;
- o menu de pacientes deve continuar sendo alternativa segura;
- o paciente encontrado deve virar o paciente em uso da sessao.

### Subetapa 5 - validar a integracao com Novo tratamento

Objetivo:

- confirmar que o paciente em uso alimenta o gate de `Tratamento -> Novo tratamento`;
- evitar duplicacao de regra entre a tela principal e o modal de tratamento;
- manter o modal atual funcionando com o contexto resolvido.

Arquivos esperados para a implementacao futura:

- `frontend/js/modules/novo-tratamento-paciente-gate.js`
- `frontend/js/modules/novo-tratamento-modal.js`
- `frontend/js/modules/prontuario.js`

Teste esperado depois desta subetapa:

- com paciente em uso, abrir `Novo tratamento` deve usar o paciente ativo;
- sem paciente em uso, o sistema deve seguir o fallback para menu de pacientes;
- nenhuma regressao deve aparecer no modal ja existente;
- o paciente ativo deve continuar consistente apos abrir e fechar a janela.

### Subetapa 6 - limpeza controlada e confirmacao de estabilizacao

Objetivo:

- revisar se o `app.js` deixou de carregar responsabilidade desnecessaria;
- confirmar que o fallback ainda existe;
- deixar claro o que pode ser removido depois e o que ainda deve permanecer.

Arquivos esperados para a implementacao futura:

- `frontend/app.js`
- `frontend/js/modules/prontuario.js`
- `frontend/js/modules/paciente-em-uso-header.js`

Teste esperado depois desta subetapa:

- reabrir a aplicacao apos refresh e confirmar comportamento igual ao esperado;
- navegar entre telas sem perder o paciente em uso;
- confirmar que nao surgiram dependencias circulares;
- confirmar que nao houve quebra do fluxo de logout, toolbar ou workspace.

## 5. Sequencia recomendada de validacao

Depois de cada subetapa, a validacao minima deve seguir esta ordem:

1. abrir a aplicacao;
2. confirmar a tela principal;
3. confirmar a faixa de paciente em uso;
4. testar o gatilho de `Novo tratamento`;
5. conferir o console do navegador;
6. validar o caminho de fallback antes de seguir.

## 6. O que nao pode acontecer durante esta Onda 1

- criar backend novo sem necessidade real;
- mover responsabilidade demais para `app.js`;
- remover o fallback antes da hora;
- duplicar estado de paciente em mais de um lugar;
- misturar esta ordem com mudanca de toolbar, odontograma ou editor de textos;
- considerar a Onda 1 concluida sem teste manual real.

## 7. Criterio para passar de uma subetapa para a seguinte

So avancar quando:

- a tela continuar abrindo;
- o comportamento anterior estiver preservado;
- o teste esperado da subetapa tiver sido executado;
- nenhuma regressao funcional tiver surgido;
- o fallback ainda existir e ainda funcionar.

## 8. Resultado esperado desta ordem

Ao final desta sequencia, a Onda 1 deve ter:

- fronteira tecnica clara;
- subetapas pequenas e seguras;
- teste esperado definido em cada passo;
- caminho de rollback ainda disponivel;
- base pronta para a proxima onda sem improviso.
