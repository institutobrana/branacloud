# Especificação de implementação modular da tela odontológica do Brana

## 1. Objetivo
Definir a ordem exata de arquivos, responsabilidades e sequência de entrega para a futura tela principal odontológica do Brana Cloud, usando a investigação do EasyDental como referencia funcional e sem reproduzir o legado de forma monolitica.

## 2. Princípios de arquitetura
- Modularizar por responsabilidade.
- Evitar concentrar comportamento em `frontend/app.js`.
- Separar shell, busca de paciente, contexto de tratamento, odontograma, procedimentos, contexto lateral e histórico.
- Tratar escrita como fase posterior, nao como prerequisito da shell.
- Reaproveitar contratos existentes quando possivel, sem criar acoplamento direto ao EasyDental.

## 3. Premissas confirmadas
- O Brana já tem parte da shell global e da toolbar base.
- O odontograma V1 já existe em modo de leitura.
- O módulo `Tratamento` ainda nao existe no Brana, mas e estrutural na tela alvo.
- A investigação do EasyDental mostrou que a tela principal odontologica e integrada, com menus, toolbar, busca de paciente, odontograma, procedimentos, contexto lateral e histórico inferior.

## 4. Ordem exata de entrega por camada

### 4.1 Backend base de dominio
Ordem sugerida:
1. `backend/contracts/odontograma_contract.py`
2. `backend/models/odontograma_model.py`
3. `backend/schemas/odontograma_schema.py`
4. `backend/repositories/odontograma_repository.py`
5. `backend/services/odontograma_service.py`
6. `backend/routes/odontograma_routes.py`

Responsabilidade:
- Definir contrato, estrutura, validacao, acesso a dados, orquestracao e exposicao HTTP da leitura do odontograma.

Estado atual:
- Arquivos acima ja existem e servem como base para evolucao futura.

### 4.2 Shell odontologica do frontend
Ordem sugerida:
1. `frontend/js/modules/odontograma-v1-layout.js`
2. `frontend/js/modules/odontograma-v1-shell.js`
3. `frontend/js/modules/odontograma-v1.js`

Responsabilidade:
- Criar e manter a moldura visual principal da area odontologica.
- Reusar menus globais e toolbar existentes.
- Orquestrar a montagem da tela sem centralizar logica em um unico arquivo global.

Observacao:
- `frontend/app.js` deve permanecer fora do fluxo odontologico.

### 4.3 Busca de paciente e contexto inicial
Ordem sugerida:
1. `frontend/js/modules/odontograma-v1-paciente-search.js`
2. `frontend/js/modules/odontograma-v1-treatment-context.js`

Responsabilidade:
- Localizar paciente por codigo, primeiro nome ou nome completo.
- Carregar a ficha odontologica do paciente.
- Preparar o contexto de tratamento, mesmo que inicialmente em leitura ou estado vazio.

Dependencias:
- `PESSOAL`
- `TRATAMENTO` quando existir
- rotas de leitura do odontograma

### 4.4 Odontograma central
Ordem sugerida:
1. `frontend/js/modules/odontograma-v1-arcada-render.js`

Responsabilidade:
- Desenhar a arcada superior e inferior.
- Manter a leitura de slots/dentes em composição clinica.
- Preservar fallback vazio.

Estado atual:
- Arquivo já existe e foi refinado por referencia visual dos BMPs do EasyDental.

### 4.5 Procedimentos e contexto lateral
Ordem sugerida:
1. `frontend/js/modules/odontograma-v1-procedures.js`
2. `frontend/js/modules/odontograma-v1-context-panels.js`

Responsabilidade:
- Mostrar lista/seleção de procedimentos.
- Exibir contexto lateral de paciente, tratamento, observações, imagens, documentos e agenda.

Dependencias:
- `TAB_PRC_ITEM`
- `_SIMBOLO_ODONTO`
- `AGENDA`
- `HISTORICO`
- futura leitura do módulo `Tratamento`

### 4.6 Histórico inferior
Ordem sugerida:
1. `frontend/js/modules/odontograma-v1-history-grid.js`

Responsabilidade:
- Renderizar a grade inferior com quatro colunas na linha do EasyDental.
- Mostrar narrativa clínica e eventos.
- Reaproveitar a logica visual de grade/tabela sem virar um painel monolitico.

Dependencias:
- `HISTORICO`
- `INTERVENCAO`
- `PESSOAL`

### 4.7 Registro de carregamento
Ordem sugerida:
1. `frontend/index.html`

Responsabilidade:
- Registrar os novos módulos na pagina principal, se o loader atual nao fizer isso automaticamente.
- Manter o carregamento modular e previsivel.

Observacao:
- A ativacao dos módulos deve acontecer por inclusao controlada, nao por reescrita geral.

## 5. Sequência de entrega recomendada

### Fase A - Fundacao de leitura
1. Manter os contratos backend atuais.
2. Garantir leitura do odontograma, status, arcada e intervenções.
3. Consolidar a shell odontologica atual.

### Fase B - Busca de paciente e contexto
1. Criar `odontograma-v1-paciente-search.js`.
2. Criar `odontograma-v1-treatment-context.js`.
3. Fazer a tela abrir diretamente a ficha odontologica do paciente.

### Fase C - Composicao central
1. Refinar ou manter `odontograma-v1-arcada-render.js`.
2. Garantir protagonismo visual da arcada.

### Fase D - Painéis de apoio
1. Criar `odontograma-v1-procedures.js`.
2. Criar `odontograma-v1-context-panels.js`.
3. Integrar `odontograma-v1-history-grid.js`.

### Fase E - Integração fina
1. Consolidar `odontograma-v1.js` como orquestrador.
2. Ajustar `frontend/index.html` apenas para registrar os módulos.
3. Manter `frontend/app.js` intacto.

### Fase F - Tratamento
1. Implementar o módulo `Tratamento` em sua própria trilha.
2. Integrar o tratamento ao odontograma.
3. Só então pensar em escrita clínica.

## 6. Responsabilidades por arquivo

### Backend
- `backend/contracts/odontograma_contract.py`: contratos de dados e respostas.
- `backend/models/odontograma_model.py`: mapeamento das entidades.
- `backend/schemas/odontograma_schema.py`: validação e shape dos payloads.
- `backend/repositories/odontograma_repository.py`: consultas e leitura da base.
- `backend/services/odontograma_service.py`: regras de negócio e orquestração.
- `backend/routes/odontograma_routes.py`: exposição HTTP.

### Frontend
- `frontend/js/modules/odontograma-v1-layout.js`: shell visual e layout principal.
- `frontend/js/modules/odontograma-v1-shell.js`: composição da tela odontológica principal.
- `frontend/js/modules/odontograma-v1-paciente-search.js`: busca/seleção de paciente.
- `frontend/js/modules/odontograma-v1-treatment-context.js`: contexto e tratamento.
- `frontend/js/modules/odontograma-v1-arcada-render.js`: desenho da arcada.
- `frontend/js/modules/odontograma-v1-procedures.js`: lista de procedimentos.
- `frontend/js/modules/odontograma-v1-context-panels.js`: cards laterais.
- `frontend/js/modules/odontograma-v1-history-grid.js`: grade inferior de histórico.
- `frontend/js/modules/odontograma-v1.js`: orquestração, eventos e bootstrap.

## 7. O que deve permanecer fora do monolito
- `frontend/app.js`
- escrita clínica
- edição de dente/face
- dependência direta dos BMPs legados
- lógica de tratamento dentro do odontograma
- rede de consultas e renderizações misturadas em um único arquivo

## 8. Ordem de implementação recomendada para a equipe
1. Finalizar a shell odontologica modular.
2. Implementar busca de paciente e contexto inicial.
3. Integrar o odontograma central como area dominante.
4. Acrescentar procedimentos e paineis laterais.
5. Fechar a grade de histórico.
6. Criar o módulo `Tratamento`.
7. Só depois iniciar escrita/edição.

## 9. Critérios mínimos de aceite
- A tela abre sem erro.
- A busca de paciente funciona.
- O odontograma continua em modo leitura.
- A arcada permanece o foco visual principal.
- Os paineis laterais e o histórico não quebram em estado vazio.
- `frontend/app.js` nao e alterado.
- Cada responsabilidade fica isolada no proprio módulo.

## 10. Recomendação objetiva
- A proxima implementacao deve começar pela shell odontologica e pela busca de paciente, porque sao os blocos que transformam o atual painel de odontograma em uma tela principal odontologica de verdade.

## 11. Registro para roadmap
- Especificação de implementação modular da tela odontológica do Brana concluída, com ordem de arquivos, responsabilidades e sequência de entrega definida para evitar monolito e preservar a modularização.
