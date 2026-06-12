# Implementacao do gate de paciente em uso para `Novo tratamento`

## 1. Objetivo da etapa

Implementar somente o gate modular que decide o comportamento de `Tratamento -> Novo tratamento` com base na existencia, ou nao, de paciente em uso.

Esta etapa nao grava tratamento.
Esta etapa nao altera backend.
Esta etapa nao altera banco.
Esta etapa nao altera persistencia.

## 2. Contrato usado como base

- `docs/contrato_fluxo_novo_tratamento_paciente_em_uso.md`
- `docs/contrato_funcional_campos_modal_novo_tratamento.md`
- `docs/correcao_funcional_leve_campos_modal_novo_tratamento.md`
- `docs/implementacao_visual_modal_novo_tratamento.md`
- `docs/11_roadmap_desenvolvimento.md`

## 3. Arquivos analisados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/novo-tratamento-modal.js`
- `frontend/js/modules/novo-tratamento-paciente-gate.js`
- `frontend/js/modules/odontograma-v1.js`
- `frontend/js/modules/odontograma-v1-paciente-search.js`
- `frontend/js/modules/odontograma-v1-shell.js`

## 4. Forma encontrada de identificar paciente em uso

A forma mais segura encontrada nesta etapa foi combinar dois sinais existentes no frontend:

- `window.BranaOdontogramaV1Module.state.paciente`, quando o odontograma V1 ja tem um paciente carregado;
- `fichaPacienteAtualId`, como fallback global ja usado por outros fluxos da ficha.

O gate considera paciente em uso quando encontra um `id > 0` em uma dessas fontes.

## 5. Forma encontrada de abrir Menu de pacientes existente

O `Menu de pacientes` ja existente foi reaproveitado pelo helper:

- `fichaMenuPacAbrir("", { mode: "paciente" })`

Se o helper nao estiver disponivel, o gate registra `console.warn` e nao abre o modal de tratamento por engano.

## 6. Arquivos criados/alterados

### Criados

- `frontend/js/modules/novo-tratamento-paciente-gate.js`
- `docs/implementacao_gate_paciente_em_uso_novo_tratamento.md`

### Alterados

- `frontend/app.js`
- `docs/11_roadmap_desenvolvimento.md`

## 7. Comportamento implementado

- Se houver paciente em uso, `Tratamento -> Novo tratamento` abre o modal `Novo tratamento`.
- Se nao houver paciente em uso, `Tratamento -> Novo tratamento` abre o `Menu de pacientes`.
- O modal nao recebe dados de persistencia nesta etapa.
- O acionamento foi mantido minimo e isolado.
- O fluxo nao grava tratamento em nenhum momento.

## 8. Cenários testados

### Cenário sem paciente em uso

- O gate consulta o estado do odontograma e `fichaPacienteAtualId`.
- Sem paciente valido, chama `fichaMenuPacAbrir`.
- O modal `Novo tratamento` nao e aberto imediatamente.

### Cenário com paciente em uso

- O gate detecta paciente no estado do odontograma ou no contexto global da ficha.
- O modal `Novo tratamento` e aberto diretamente.

### Cenário com Menu de pacientes indisponível

- O gate nao tenta improvisar outro fluxo.
- Um aviso seguro e registrado no console.
- O modal nao e aberto sem paciente seguro.

## 9. Confirmacao de que nao ha gravacao real

Confirmado.

- o gate nao chama API de gravacao;
- o modal continua sem persistencia real;
- o botao `Ok` permanece sem salvar tratamento;
- nao ha qualquer escrita em banco ou backend.

## 10. Confirmacao de que backend, banco e migrations nao foram alterados

Confirmado.

- nenhum arquivo de backend foi alterado;
- nenhum banco foi alterado;
- nenhuma migration foi criada;
- nenhuma seed foi criada.

## 11. Limitacoes conhecidas

- o gate ainda depende de estados ja existentes no frontend;
- a deteccao de paciente em uso nao foi expandida para um helper central adicional alem do modulo novo;
- a etapa nao conecta automaticamente a selecao do Menu de pacientes a um prosseguimento imediato do modal;
- o campo `Idade` continua sem preenchimento dinamico;
- a aba `Convenio` continua sem nova regra funcional;
- o carregamento do gate depende de `import()` sob demanda no `frontend/app.js`;
- nao foi criada persistencia de tratamento.

## 12. Proxima etapa recomendada

Proxima etapa recomendada:

- validar o gate em runtime com e sem paciente em uso e, depois, fechar a origem de `Idade` a partir do paciente em uso ou corrigir os campos restantes do modal sem misturar persistencia.
