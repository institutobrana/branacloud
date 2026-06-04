# Checklist de execução por commit da tela odontológica do Brana

## 1. Objetivo
Converter o plano de subtarefas do odontograma Brana em uma checklist prática de execução por commit, facilitando a implementação incremental, a validação técnica e a manutenção da modularização.

## 2. Regra central
- Cada commit deve alterar o menor número de arquivos possível.
- Cada commit precisa preservar funcionamento anterior.
- Nenhum passo deve concentrar responsabilidades em `frontend/app.js`.
- Escrita clínica continua fora do escopo até a base de leitura e shell estarem consolidadas.

## 3. Ordem operacional por commit

### Commit 1 - Blindagem da leitura atual
Objetivo:
- garantir que contratos, modelos, schemas, repositories, services e routes do odontograma continuam coesos.

Arquivos normalmente envolvidos:
- `backend/contracts/odontograma_contract.py`
- `backend/models/odontograma_model.py`
- `backend/schemas/odontograma_schema.py`
- `backend/repositories/odontograma_repository.py`
- `backend/services/odontograma_service.py`
- `backend/routes/odontograma_routes.py`

Validação obrigatória:
- `py_compile` ou importacao dos modulos;
- endpoints de leitura continuam respondendo;
- nenhuma escrita foi introduzida.

### Commit 2 - Shell odontologica
Objetivo:
- criar ou consolidar a moldura visual principal da tela odontologica.

Arquivos normalmente envolvidos:
- `frontend/js/modules/odontograma-v1-layout.js`
- `frontend/js/modules/odontograma-v1-shell.js`
- `frontend/js/modules/odontograma-v1.js`

Validação obrigatória:
- a tela abre;
- menus e toolbar continuam presentes;
- o odontograma segue em modo leitura;
- `frontend/app.js` não muda.

### Commit 3 - Busca de paciente
Objetivo:
- permitir localizar e abrir o paciente por código, primeiro nome ou nome completo.

Arquivos normalmente envolvidos:
- `frontend/js/modules/odontograma-v1-paciente-search.js`
- `frontend/js/modules/odontograma-v1.js`

Validação obrigatória:
- busca retorna paciente;
- contexto muda sem erro;
- fallback vazio continua estável.

### Commit 4 - Contexto de tratamento
Objetivo:
- reservar e preparar a camada de tratamento na tela principal.

Arquivos normalmente envolvidos:
- `frontend/js/modules/odontograma-v1-treatment-context.js`
- backend do módulo `Tratamento` quando existir

Validação obrigatória:
- tela continua funcionando sem tratamento;
- não há quebra em estado vazio;
- não há dependência de escrita.

### Commit 5 - Arcada central
Objetivo:
- manter e refinar a composição da arcada superior/inferior como área principal.

Arquivos normalmente envolvidos:
- `frontend/js/modules/odontograma-v1-arcada-render.js`

Validação obrigatória:
- arcada continua reconhecível;
- slots aparecem corretamente;
- fallback vazio permanece.

### Commit 6 - Procedimentos
Objetivo:
- exibir a lista de procedimentos e sua semântica visual.

Arquivos normalmente envolvidos:
- `frontend/js/modules/odontograma-v1-procedures.js`

Validação obrigatória:
- lista mostra procedimentos;
- não há escrita;
- a área principal não perde foco.

### Commit 7 - Paineis laterais
Objetivo:
- distribuir paciente, tratamento, observações, imagens, documentos e agenda em cards laterais.

Arquivos normalmente envolvidos:
- `frontend/js/modules/odontograma-v1-context-panels.js`

Validação obrigatória:
- os cards coexistem com a arcada;
- layout continua responsivo;
- sem monolito.

### Commit 8 - Histórico inferior
Objetivo:
- criar a grade inferior com quatro colunas, no padrão do EasyDental, mas modular.

Arquivos normalmente envolvidos:
- `frontend/js/modules/odontograma-v1-history-grid.js`

Validação obrigatória:
- grade aparece;
- leitura de histórico funciona;
- estado vazio não quebra a tela.

### Commit 9 - Integração fina
Objetivo:
- amarrar todos os módulos em um fluxo único, mantendo isolamento de responsabilidade.

Arquivos normalmente envolvidos:
- `frontend/js/modules/odontograma-v1.js`
- `frontend/index.html` apenas se o carregamento de módulos exigir

Validação obrigatória:
- todos os módulos carregam;
- a tela abre como shell odontológica;
- `frontend/app.js` continua intacto.

### Commit 10 - Módulo Tratamento
Objetivo:
- implementar o módulo `Tratamento` em trilha separada e só então integrar ao odontograma.

Arquivos normalmente envolvidos:
- novos arquivos do módulo `Tratamento` no backend e frontend

Validação obrigatória:
- o módulo de tratamento funciona isolado;
- o odontograma pode consumir o contexto sem acoplamento rígido.

## 4. Sequência resumida de commits
1. leitura e contratos
2. shell odontológica
3. busca de paciente
4. contexto de tratamento
5. arcada central
6. procedimentos
7. painéis laterais
8. histórico inferior
9. integração fina
10. módulo Tratamento

## 5. Critérios de pronto por commit
- não quebrar o passo anterior;
- manter `frontend/app.js` fora da solução;
- validar sem escrever no banco;
- deixar o código mais modular após o commit, não menos modular;
- registrar a mudança no roadmap/documentação.

## 6. O que não fazer
- juntar shell, busca, tratamento, odontograma, procedimentos e histórico em um único arquivo;
- depender de BMPs legados diretamente na UI final;
- criar comportamento de escrita antes do módulo Tratamento;
- ampliar escopo no mesmo commit sem justificativa.

## 7. Recomendação objetiva
- Executar a implementação nessa ordem de commit para garantir rastreabilidade, rollback simples e progresso incremental.

## 8. Registro para roadmap
- Checklist de execução por commit da tela odontológica do Brana registrada para apoiar a implementação incremental e impedir monolito.
