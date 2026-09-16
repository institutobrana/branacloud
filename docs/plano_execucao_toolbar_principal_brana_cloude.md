# Plano de execucao segura - Toolbar principal do Brana Cloude

## 1. Identificacao

Produto: Brana Cloude

Area: Shell principal / toolbar global

Base documental:

- `docs/contrato_tecnico_toolbar_principal_brana_cloude.md`
- `docs/inventario_toolbar_principal_brana_cloude.md`
- `docs/matriz_toolbar_principal_botoes_alvo_brana_cloude.md`

Status: documental apenas.

## 2. Objetivo

Definir um roteiro de execucao segura, por etapas curtas, para substituir a toolbar atual do Brana Cloude por uma nova toolbar baseada em assets locais, com validacao gradual e rollback preservado.

Este documento nao implementa nada.

Este documento nao autoriza a remocao imediata da toolbar atual.

## 3. Principios de execucao

1. Mudar pouco por vez.
2. Validar antes de remover.
3. Preservar fallback ate o final.
4. Separar documento, implementacao e limpeza.
5. Manter commits pequenos e rastreaveis.
6. Nunca misturar a troca da toolbar com outras refatoracoes grandes.

## 4. Preparacao obrigatoria

Antes de qualquer implementacao, concluir:

- contrato tecnico da toolbar;
- inventario tecnico da toolbar;
- matriz de botoes alvo;
- confirmacao da ordem de entrada da primeira onda;
- confirmacao dos assets escolhidos;
- definicao do ponto exato no frontend onde a toolbar sera isolada.

## 5. Estrategia geral

### Fase 0 - congelamento de escopo

Objetivo:

- impedir que a troca da toolbar se misture com outros ajustes.

Acoes:

- manter a toolbar atual funcionando;
- nao remover handlers existentes;
- nao apagar codigo morto ainda;
- nao alterar backend;
- nao alterar permissao;
- nao alterar autenticacao;
- nao alterar o fluxo de paciente em uso.

### Fase 1 - componente isolado

Objetivo:

- criar a nova toolbar em componente isolado, sem substituir a antiga de imediato.

Acoes:

- montar a estrutura visual da toolbar nova;
- usar os assets locais ja confirmados;
- conectar apenas os botoes da primeira onda;
- manter a toolbar antiga intacta;
- expor um ponto claro de ativacao/desativacao.

### Fase 2 - conexao funcional minima

Objetivo:

- ligar cada botao da primeira onda a um handler real ou a um stub documentado.

Acoes:

- conectar novo paciente;
- conectar menu de pacientes;
- conectar novo tratamento;
- conectar agenda;
- conectar conta corrente;
- conectar preferencias;
- conectar historico/anamnese/odontograma/orcamento conforme ordem aprovada;
- validar permissao e estado de paciente em uso.

### Fase 3 - validacao manual

Objetivo:

- provar que a nova toolbar nao rompe os fluxos principais.

Acoes:

- abrir a aplicacao;
- testar login;
- testar troca de modulo;
- testar paciente em uso;
- testar novo tratamento;
- testar sair;
- testar console;
- testar responsividade minima;
- validar que a toolbar antiga ainda pode ser reativada se necessario.

### Fase 4 - corte controlado

Objetivo:

- remover a toolbar antiga e o codigo morto associado somente depois da validacao.

Acoes:

- remover markup antigo obsoleto;
- remover listeners duplicados;
- remover estilos nao usados;
- remover helpers mortos apenas apos confirmacao final;
- manter um commit separado para a limpeza.

## 6. Ordem recomendada de implementacao

### Primeira onda

1. Novo paciente
2. Menu de pacientes
3. Novo tratamento
4. Agenda
5. Conta corrente

### Segunda onda

6. Preferencias
7. Historico
8. Anamnese
9. Odontograma
10. Orcamento
11. Backup

### Terceira onda

12. Indices financeiros
13. Configuracoes
14. Ajuda
15. Sair
16. OK
17. Cancela

### Quarta onda

18. Tela
19. Inserir
20. Remover
21. Copiar
22. Filtrar
23. Procurar
24. Detalhes
25. Rapido

## 7. Estrategia de commits

### Commit 1

- adicionar componente isolado da nova toolbar;
- sem remover a toolbar antiga.

### Commit 2

- ligar a primeira onda de botoes;
- manter fallback.

### Commit 3

- validacao e ajustes visuais finos;
- sem limpeza agressiva.

### Commit 4

- remover toolbar antiga e codigo morto;
- somente apos validacao aprovada.

## 8. Matriz de testes

### Testes obrigatorios

- login;
- logout;
- paciente em uso;
- menu de pacientes;
- novo tratamento;
- conta corrente;
- agenda;
- preferencias;
- historico;
- backup;
- console sem erro;
- navegacao em tela grande e pequena.

### Testes de risco

- usuario sem permissao;
- usuario protegido;
- ausencia de paciente em uso;
- cancelamento de modal;
- reabertura apos troca de modulo;
- comportamento apos refresh do navegador.

## 9. Condicoes para avançar de fase

Somente avancar se:

- a fase anterior estiver funcional;
- nao houver regressao visual relevante;
- nao houver erro de console;
- o fallback ainda existir;
- a validacao manual tiver sido registrada.

## 10. Condicoes para rollback

Rollback imediato se:

- a toolbar nova quebrar a abertura da aplicacao;
- o menu principal perder funcionalidade;
- Novo tratamento deixar de abrir;
- paciente em uso for perdido;
- console mostrar erro estrutural;
- o comportamento da toolbar antiga for destruido antes do previsto.

## 11. Critérios de aceite final

A troca so pode ser declarada concluida quando:

- a toolbar nova estiver estavel;
- a toolbar antiga tiver sido removida com seguranca;
- os botoes da primeira onda estiverem funcionando;
- o inventario e o contrato estiverem atualizados;
- os commits estiverem separados por fase;
- o rollback estiver documentado.

## 12. Conclusao

O roteiro correto para a toolbar e inevitavelmente incremental.

Primeiro estabiliza.
Depois valida.
So entao limpa.

Essa ordem reduz o risco de regressao e preserva a capacidade de retorno ao estado atual.
