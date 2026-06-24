# Frontend React - Contrato funcional da tela Preferências

## 1. Objetivo do contrato

Este documento registra a tela Preferências observada no vídeo enviado pelo usuário, antes de qualquer implementação no `frontend-react`.

## 2. Origem da referência

A referência veio do vídeo da tela do EasyDental chamada **"Configurações e preferências de Gleisson Tel"**.

## 3. Escopo desta documentação

- Este é um contrato funcional inicial.
- Não é implementação.
- Não define persistência final.
- Não cria API.
- Não altera banco.
- Campos não vistos com segurança permanecem como pendência.

## 4. Estrutura visual do modal

- Modal central sobre o sistema.
- Fundo escurecido atrás do modal.
- Título no topo.
- Abas de navegação no corpo do modal.
- Botões inferiores de ação.

## 5. Abas

- Geral
- Ficha clínica
- Orçamento
- NFS-e

## 6. Aba Geral

Campos e áreas observados:

- foto/avatar do usuário;
- botões/ações de câmera ou upload, se aplicável;
- Nome;
- CPF;
- CRO;
- UF;
- Apresentação/CV resumido;
- Envio padrão para mensagens;
- Conta bancária padrão;
- Estoque padrão;
- Módulo de abertura.

Opções observadas no combo `Módulo de abertura`:

- Agenda diária;
- Agenda por unidade;
- Agenda semanal;
- Cadastro de pacientes;
- Contas a pagar;
- Contas a receber;
- Controle de estoque;
- Dashboard;
- Ficha clínica;
- Fluxo de caixa;
- Gerenciar tratamentos.

## 7. Aba Ficha clínica

Campos e áreas observados:

- Especialidade(s);
- botão Incluir;
- área ou lista grande para especialidades incluídas;
- opção `Abrir automaticamente painel de aceleradores`;
- opção `Solicitar assinatura eletrônica na finalização de procedimentos`.

Especialidades observadas no vídeo:

- Cirurgia;
- Dentística;
- Diagnóstico;
- Emergência;
- Endodontia;
- Estomatologia;
- Estética;
- Gerais;
- Harmonização Orofacial;
- Implantodontia;
- Odontologia Legal;
- Odontopediatria;
- Ortodontia;
- Ortopedia Funcional dos Maxilares.

## 8. Aba Orçamento

Campos e áreas observados:

- Modelo padrão de orçamentos;
- Mensagem para impressão;
- `Apresentar CPF/CNPJ`;
- `Apresentar CRO/UF`.

## 9. Aba NFS-e

- A aba existe.
- O conteúdo completo não foi identificado com segurança no vídeo atual.
- Esta parte precisa de novo vídeo ou print antes de implementar regras reais.

## 10. Regras funcionais observadas ou inferidas com cautela

Somente o que é seguro registrar:

- `Gravar preferências` sugere ação de persistência futura.
- `Cancelar` fecha sem salvar.
- Combos devem usar listas controladas.
- Campos devem ser carregados com preferências do usuário no futuro.

Não se inventa regra de banco nesta etapa.

## 11. Pendências de mapeamento

- conteúdo completo da aba NFS-e;
- opções completas dos combos;
- comportamento real do botão Gravar preferências;
- validações obrigatórias;
- origem dos dados de Conta bancária padrão;
- origem dos dados de Estoque padrão;
- origem dos modelos de orçamento;
- persistência e endpoints existentes ou futuros.

## 12. Estratégia segura de implementação futura

Sequência recomendada:

1. Criar modal visual sem persistência.
2. Ligar botão da topbar/menu para abrir modal.
3. Popular campos com placeholders seguros.
4. Mapear APIs existentes.
5. Persistência real apenas depois de contrato de dados.
6. Implementar aba NFS-e somente após novo mapeamento.

## 13. Restrições de segurança

- Não alterar backend nesta etapa.
- Não criar API.
- Não criar migration.
- Não gravar dados.
- Não consumir API nova.
- Não alterar login/logout.
- Não alterar Pacientes.
- Não alterar o shell já estabilizado.

## Confirmações

- Nenhum código foi alterado nesta etapa.
- `frontend-react/src` não foi alterado.
- O backend não foi alterado.
- O frontend legado não foi alterado.
- O banco e migrations não foram alterados.
- Nenhuma API nova foi criada ou consumida.
- Nenhuma API de escrita foi usada.

