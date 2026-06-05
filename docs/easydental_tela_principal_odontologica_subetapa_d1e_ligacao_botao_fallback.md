## Subetapa D1-E - Ligacao do botao Odontograma com fallback legado

### Objetivo
- Ligar o botao `Odontograma` da `Ficha Pessoal > aba Historico` a entrada isolada nova da tela odontologica.
- Preservar o fluxo legado como fallback imediato se a entrada nova nao estiver disponivel ou falhar.
- Manter a intercepcao global antiga ativa nesta etapa.

### Alteracao tecnica realizada
- A intercepcao do botao continua no modulo legado `frontend/js/modules/odontograma-v1.js`.
- O click agora tenta abrir `window.abrirTelaPrincipalOdontologicaPorPaciente(...)` primeiro.
- O contexto enviado usa origem `ficha-pessoal-historico` e modo `visual-estatico`.
- Um host isolado controlado foi criado no `body` com id `odonto-v1-entrada-isolada-host`.
- Se a entrada isolada nao existir, nao conseguir renderizar ou devolver erro, o fluxo volta para `openPanel()` do odontograma V1.

### Comportamento esperado
- Com a entrada isolada disponivel:
  - a tela odontologica nova deve abrir no host isolado
  - o fluxo legado nao deve assumir a abertura principal
- Sem a entrada isolada ou em falha:
  - o host isolado e removido
  - o odontograma V1 legado abre normalmente
- Nenhum backend, banco, asset ou arquivo do EasyDental foi alterado nesta etapa.

### Escopo preservado
- `frontend/app.js` nao foi alterado nesta subetapa.
- A implementacao antiga do odontograma permanece intacta.
- A intercepcao global antiga permanece ativa.
- O contrato de entrada isolada criado nas subetapas anteriores continua sendo o ponto novo de entrada.

### Validacao sugerida
- Clicar em `Odontograma` a partir da aba `Historico` com paciente carregado.
- Confirmar que a entrada nova abre no host isolado.
- Forcar indisponibilidade da entrada nova e confirmar que o fluxo legado abre como fallback.

### Proxima etapa recomendada
- Revisar o fechamento visual/saida da entrada isolada e, se necessario, preparar a migracao gradual do host para um ponto mais integrado da interface.
