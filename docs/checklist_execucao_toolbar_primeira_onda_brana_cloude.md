# Checklist operacional - Execucao da primeira onda da toolbar principal do Brana Cloude

## 1. Identificacao

Produto: Brana Cloude

Area: Shell principal / toolbar global

Base documental:

- `docs/contrato_tecnico_toolbar_principal_brana_cloude.md`
- `docs/inventario_toolbar_principal_brana_cloude.md`
- `docs/matriz_toolbar_principal_botoes_alvo_brana_cloude.md`
- `docs/plano_execucao_toolbar_principal_brana_cloude.md`
- `docs/contrato_toolbar_primeira_onda_brana_cloude.md`

Status: documental apenas.

## 2. Objetivo

Transformar a primeira onda da nova toolbar em um checklist operacional curto, rastreavel e seguro para uso na hora da implementacao futura.

Este documento nao implementa nada.

Este documento nao altera frontend, backend, banco ou permissao.

## 3. Preparacao antes de codificar

- [ ] Confirmar que o contrato tecnico da toolbar esta lido e vigente.
- [ ] Confirmar que o inventario da toolbar esta lido e vigente.
- [ ] Confirmar que a matriz de botoes alvo esta lida e vigente.
- [ ] Confirmar que o plano de execucao esta lido e vigente.
- [ ] Confirmar que a primeira onda esta travada apenas em cinco botoes.
- [ ] Confirmar que os assets da primeira onda ja existem no repositorio.
- [ ] Confirmar o ponto exato do frontend onde a toolbar sera isolada.
- [ ] Confirmar que a toolbar antiga sera mantida como fallback.

## 4. Checklist de implementacao

### 4.1 Estrutura

- [ ] Criar o componente isolado da nova toolbar.
- [ ] Preservar a toolbar antiga sem remoção.
- [ ] Inserir o ponto de ativacao/desativacao da nova toolbar.
- [ ] Usar somente assets locais ja confirmados.
- [ ] Manter a estrutura visual simples e controlada.

### 4.2 Primeira onda

- [ ] Novo paciente.
- [ ] Menu de pacientes.
- [ ] Novo tratamento.
- [ ] Agenda.
- [ ] Conta corrente.

### 4.3 Conexoes funcionais

- [ ] Novo paciente abre o fluxo atual sem regressao.
- [ ] Menu de pacientes abre o menu existente.
- [ ] Novo tratamento continua usando o gate de paciente em uso.
- [ ] Agenda abre o fluxo atual.
- [ ] Conta corrente abre o fluxo atual.

### 4.4 Protecoes obrigatorias

- [ ] Nao remover handlers antigos.
- [ ] Nao remover codigo morto nesta fase.
- [ ] Nao alterar backend.
- [ ] Nao alterar permissao.
- [ ] Nao alterar autenticacao.
- [ ] Nao alterar o fluxo de paciente em uso.

## 5. Checklist de validacao

### 5.1 Testes basicos

- [ ] Abrir a aplicacao sem erro.
- [ ] Verificar que a toolbar nova aparece.
- [ ] Verificar que a toolbar antiga ainda pode ser mantida como fallback.
- [ ] Abrir Novo paciente.
- [ ] Abrir Menu de pacientes.
- [ ] Abrir Novo tratamento.
- [ ] Abrir Agenda.
- [ ] Abrir Conta corrente.

### 5.2 Testes de contexto

- [ ] Testar com paciente em uso.
- [ ] Testar sem paciente em uso.
- [ ] Testar usuario logado normal.
- [ ] Testar usuario com permissao restrita, se aplicavel.

### 5.3 Testes de estabilidade

- [ ] Conferir console do navegador.
- [ ] Conferir comportamento apos refresh.
- [ ] Conferir comportamento apos troca de modulo.
- [ ] Conferir comportamento em largura reduzida da janela.

## 6. Checklist de commit e rollback

- [ ] Commit 1: componente isolado da toolbar nova.
- [ ] Commit 2: ligacao da primeira onda.
- [ ] Commit 3: ajuste visual e funcional fino.
- [ ] Commit 4: remocao da toolbar antiga apenas apos validacao.
- [ ] Manter rollback disponivel em qualquer etapa.
- [ ] Nao misturar a limpeza com a ativacao inicial.

## 7. Checklist de saida

- [ ] Confirmar que a toolbar nova funciona.
- [ ] Confirmar que a toolbar antiga pode ser removida com seguranca.
- [ ] Confirmar que a documentacao foi atualizada.
- [ ] Confirmar que nao ficou codigo morto critico sem analise.
- [ ] Confirmar que o estado do sistema continua recuperavel.

## 8. Conclusao

Este checklist e a versao operacional da primeira onda da toolbar.

Ele deve ser usado como guia de execucao, sem improviso, quando a implementacao for iniciada.
