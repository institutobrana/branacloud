# Objetivo
Corrigir o fluxo de abertura do Odontograma V1 para que a tela inicial abra vazia, sem herdar o paciente atual da ficha, e para que a busca de paciente selecione e abra o paciente de forma explicita.

# Escopo
- Etapa de correcao do fluxo de abertura.
- Somente frontend modular do odontograma.
- Sem escrita clinica.
- Sem alterar banco.
- Sem mexer em `frontend/app.js`.

# Confirmacao de etapa
Esta etapa ajusta a navegacao e o estado inicial do Odontograma V1 para ficar mais proximo da tela principal odontologica do EasyDental, mantendo a modularizacao.

# O que foi corrigido
- A tela deixa de herdar automaticamente `fichaPacienteAtualId` ao abrir.
- O Odontograma V1 agora abre sem paciente selecionado.
- A busca de paciente passa a notificar o modulo principal ao selecionar um resultado.
- Quando a busca retorna um unico paciente, ele e aberto automaticamente.
- O cabeçalho da tela passa a refletir apenas o paciente efetivamente selecionado.

# Validacao tecnica
- `node --check` nos modulos alterados.
- Simulacao em memoria do fluxo de abertura vazia e selecao de paciente.
- Confirmacao de que o estado do odontograma passa de vazio para paciente selecionado ao localizar um resultado unico.

# Impacto no layout
- A shell continua modular.
- A tela inicia sem paciente e sem tratamento selecionado.
- O comportamento fica mais proximo da tela principal do EasyDental, sem copiar o legado visual.

# Riscos e observacoes
- A tela ainda precisa de refinamento visual adicional para aproximar a distribuicao do EasyDental.
- O modulo Tratamento ainda nao existe no Brana, entao o fluxo completo continua limitado a leitura.

# Onde testar
- Abrir o Odontograma V1.
- Confirmar que ele inicia sem paciente.
- Buscar por codigo ou nome.
- Confirmar que um unico resultado abre o paciente e atualiza o cabecalho.
- Confirmar que `frontend/app.js` segue intacto.

# Registro para roadmap
A etapa registra a correcao do fluxo de abertura do paciente e da tela vazia inicial do Odontograma V1.
