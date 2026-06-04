# Plano de subtarefas para implementação modular do odontograma Brana

## 1. Objetivo
Transformar a especificação modular do odontograma Brana em uma sequência de subtarefas técnicas pequenas, rastreáveis e seguras, evitando monolitos e preservando `frontend/app.js` fora do fluxo odontologico.

## 2. Princípios
- Cada subtarefa deve ter responsabilidade única.
- Cada entrega deve ser validável isoladamente.
- A ordem deve respeitar dependencias reais da tela principal odontologica.
- A escrita clinica fica para uma fase posterior.
- O modulo `Tratamento` e estrutural, mas ainda pode entrar em etapa separada.

## 3. Fase 0 - Preparação
### 3.1 Consolidar contratos e base de leitura
Subtarefas:
- revisar `backend/contracts/odontograma_contract.py`;
- revisar `backend/models/odontograma_model.py`;
- revisar `backend/schemas/odontograma_schema.py`;
- revisar `backend/repositories/odontograma_repository.py`;
- revisar `backend/services/odontograma_service.py`;
- revisar `backend/routes/odontograma_routes.py`.

Objetivo:
- garantir que a leitura atual permanece coesa antes de montar a nova tela principal.

Critério de aceite:
- endpoints de leitura continuam respondendo;
- nenhum comportamento de escrita e introduzido;
- os contratos continuam coerentes com o banco.

## 4. Fase 1 - Shell odontologica principal
### 4.1 Criar o host visual principal
Arquivos alvo:
- `frontend/js/modules/odontograma-v1-layout.js`
- `frontend/js/modules/odontograma-v1-shell.js`
- `frontend/js/modules/odontograma-v1.js`

Subtarefas:
- criar o esqueleto visual da tela odontológica principal;
- integrar menus globais e toolbar existente;
- reservar a área central para o odontograma;
- reservar painéis laterais e rodapé;
- manter `app.js` intacto.

Critério de aceite:
- a tela abre como shell odontologica modular;
- a arcada continua visivel em modo leitura;
- a composicao geral deixa de parecer um painel isolado.

## 5. Fase 2 - Busca de paciente
### 5.1 Campo de busca persistente
Arquivos alvo:
- `frontend/js/modules/odontograma-v1-paciente-search.js`
- `frontend/js/modules/odontograma-v1.js`

Subtarefas:
- criar campo de busca por código, primeiro nome e nome completo;
- conectar a busca à ficha do paciente;
- recuperar paciente sem depender do módulo Tratamento ainda;
- manter o estado vazio de forma segura.

Critério de aceite:
- localizar paciente por identificação ou nome;
- abrir o contexto odontologico do paciente sem erro;
- manter fallback quando não houver paciente válido.

## 6. Fase 3 - Contexto de tratamento
### 6.1 Estrutura de contexto odontológico
Arquivos alvo:
- `frontend/js/modules/odontograma-v1-treatment-context.js`
- backend complementar do módulo `Tratamento`, quando criado

Subtarefas:
- definir o lugar do tratamento na tela principal;
- preparar filtro/seleção de intervenções;
- manter a UI funcional em modo de referência vazia enquanto o módulo não existir.

Critério de aceite:
- a tela sustenta o estado sem tratamento;
- o layout reserva espaço para o fluxo futuro;
- nada depende de escrita.

## 7. Fase 4 - Arcada central
### 7.1 Refinar a área odontológica principal
Arquivos alvo:
- `frontend/js/modules/odontograma-v1-arcada-render.js`

Subtarefas:
- manter a geometria curvada da arcada;
- garantir leitura superior/inferior;
- preservar slots/dentes e fallback vazio;
- evitar importação direta de BMP legados;
- manter protagonista visual da arcada.

Critério de aceite:
- arcada superior e inferior continuam reconhecíveis;
- slots não quebram em estado vazio;
- a composição permanece clínica e legível.

## 8. Fase 5 - Procedimentos
### 8.1 Painel e lista de procedimentos
Arquivos alvo:
- `frontend/js/modules/odontograma-v1-procedures.js`

Subtarefas:
- exibir lista de procedimentos;
- manter leitura dos códigos e descrições;
- preparar vínculo visual com símbolos;
- não implementar escrita clínica.

Critério de aceite:
- lista aparece sem tratamento preenchido;
- a interface não depende do legado BMP;
- a camada de procedimentos não monopoliza a tela.

## 9. Fase 6 - Painéis laterais de contexto
### 9.1 Paciente, observações, imagens, documentos e agenda
Arquivos alvo:
- `frontend/js/modules/odontograma-v1-context-panels.js`

Subtarefas:
- distribuir o contexto em cards laterais;
- mapear paciente, tratamento, observações, imagens, documentos e agenda;
- manter a coluna lateral secundária em relação à arcada.

Critério de aceite:
- os cards coexistem sem competir com a arcada;
- a área lateral ajuda o contexto, nao ocupa a cena principal.

## 10. Fase 7 - Histórico inferior
### 10.1 Grade de histórico clínico
Arquivos alvo:
- `frontend/js/modules/odontograma-v1-history-grid.js`
- possivelmente reaproveitamento do padrão da ficha pessoal

Subtarefas:
- criar grade de 4 colunas;
- mostrar narrativa clínica e eventos;
- manter aparência de tabela clínica, nao de painel administrativo;
- preservar leitura em estado vazio.

Critério de aceite:
- a grade inferior aparece e se comporta como histórico;
- a estrutura suporta eventos de tratamento e observações.

## 11. Fase 8 - Integração fina
### 11.1 Orquestração final do módulo
Arquivos alvo:
- `frontend/js/modules/odontograma-v1.js`
- `frontend/index.html` apenas se precisar registrar novos módulos

Subtarefas:
- consolidar a orquestração da tela;
- ligar os módulos entre si;
- manter dependências explícitas;
- impedir que a lógica vire monolito;
- proteger `frontend/app.js`.

Critério de aceite:
- todos os módulos carregam de forma previsível;
- a tela principal odontológica abre com estado consistente;
- cada responsabilidade continua isolada.

## 12. Fase 9 - Módulo Tratamento
### 12.1 Implementação em trilha separada
Arquivos alvo:
- novo backend e frontend próprios do módulo `Tratamento`

Subtarefas:
- criar contratos próprios;
- criar leitura e, depois, escrita;
- conectar o paciente ao tratamento;
- só então ligar o tratamento ao odontograma principal.

Critério de aceite:
- o odontograma deixa de depender de suposições;
- o tratamento passa a ser uma camada explícita do sistema.

## 13. Sequência resumida de entrega
1. validar contratos e leitura atual;
2. criar shell odontologica;
3. criar busca de paciente;
4. criar contexto de tratamento;
5. refinar arcada central;
6. implementar procedimentos;
7. implementar painéis laterais;
8. implementar histórico inferior;
9. consolidar integração fina;
10. criar módulo Tratamento em trilha separada;
11. só depois pensar em escrita clínica.

## 14. O que deve ser evitado em todas as fases
- monolito em `app.js`;
- escrita antes da hora;
- mistura de responsabilidades em um arquivo único;
- importação direta dos BMPs do EasyDental para a UI final;
- acoplamento de tratamento, odontograma e histórico no mesmo bloco.

## 15. Registro para roadmap
- Plano de subtarefas de implementação do odontograma Brana definido para guiar a execução modular da tela principal odontológica, com ordem de arquivos, fases e critérios mínimos de aceite.
