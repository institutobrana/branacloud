# Implementacao visual do modal `Novo tratamento`

## 1. Identificacao

Produto: Brana Cloude

Modulo: Tratamento

Tela: `Menu Tratamento -> Novo tratamento`

Natureza desta entrega: implementacao visual isolada, sem persistencia.

Status: concluida nesta etapa.

## 2. Objetivo

Registrar a entrega do modal visual do `Novo tratamento` em estilo classico Windows/EasyDental, com abertura pelo menu do frontend e sem acao de gravação.

Esta etapa existe para aproximar a interface do legado e preparar o fechamento futuro das lacunas de convenio, comportamento e persistencia.

## 3. Escopo entregue

- acao `Tratamento -> Novo tratamento` abre um modal dedicado;
- modal com abas `Principal` e `Convenio`;
- estrutura visual separada do fluxo principal;
- botao `Ok` apenas fecha a janela;
- botao `Cancela` fecha a janela;
- tecla `ESC` fecha a janela;
- clique no fundo da janela tambem fecha;
- nenhuma escrita em banco ou backend;
- nenhuma criacao real de tratamento.

## 4. Arquivos envolvidos

- `frontend/js/modules/novo-tratamento-modal.js`
- `frontend/index.html`
- `frontend/app.js`
- `docs/11_roadmap_desenvolvimento.md`

## 5. Estrutura visual da aba Principal

Campos e blocos visualmente reproduzidos:

- `Data Inicio`;
- `Data Finalizacao`;
- `Situacao`;
- `Tabela principal`;
- `Indice`;
- `Cirurgiao responsavel`;
- `Unidade de atendimento`;
- `Observacoes`;
- campos de auditoria `Inclusao` e `Alteracao`;
- bloco `Novo tratamento`;
- campo `Idade`;
- combo `Arcada predominante`;
- checkbox `Copiar intervencoes a realizar do tratamento anterior`.

## 6. Estrutura visual da aba Convenio

Campos visualmente expostos na aba `Convenio`:

- `Convenio`;
- `Tipo de atendimento (TISS)`;
- `Cirurgiao contratado`;
- `Cirurgiao solicitante`;
- `Cirurgiao executante`;
- `Sinais clinicos doenca periodontal`;
- `Alteracao dos tecidos moles`;
- `N da guia de tratamento`;
- `Data da autorizacao`;
- `Senha de autorizacao`;
- `Validade da senha`.

## 7. Comportamento funcional entregue

- abertura por menu com o mesmo ponto de entrada da interface;
- modal centralizado com chrome simples e visual classico;
- mudanca de aba interna sem sair da janela;
- campos populados com defaults visuais quando o modal abre;
- fechamento sem persistencia ao confirmar ou cancelar;
- foco inicial no campo de data de inicio.

## 8. O que nao foi implementado

- nao houve salvamento de tratamento;
- nao houve integracao com banco;
- nao houve chamada de backend;
- nao houve vinculacao com fluxo real de odontograma;
- nao houve vinculacao com financeiro;
- nao houve vinculacao com autorizacao real;
- nao houve alteracao de schema;
- nao houve migration;
- nao houve seed.

## 9. Dependencias consideradas

- menu `Tratamento` existente no frontend;
- contexto de usuario logado para defaults de prestador e unidade;
- contrato tecnico do modulo tratamento;
- contrato de layout/comportamento da tela `Novo tratamento`.

## 10. Validacoes realizadas

- verificado o ponto do menu `tratamento-novo` em `frontend/app.js`;
- verificado o include de scripts em `frontend/index.html`;
- criado modulo isolado para o modal;
- mantida a regra de nao salvar nada na etapa atual;
- roadmap atualizado com o estado da entrega.

## 11. Pendencias remanescentes

- fechar o contrato fino da aba `Convenio`;
- mapear origem real de cada combo e valor padrao;
- definir regra exata de copia do tratamento anterior;
- validar comportamento com paciente ativo e sem paciente;
- definir criterio de aceite visual para equivalencia com o EasyDental.

## 12. Riscos remanescentes

- divergencia visual fina em relacao ao legado;
- dependencia de defaults de sessao para campos do topo;
- ambiguidade dos campos de convenio enquanto a camada funcional nao estiver fechada;
- risco de misturar a janela visual com persistencia antes da fase certa.

## 13. Proximo passo recomendado

Antes de qualquer persistencia real, o proximo passo deve ser a validacao manual da janela visual e o fechamento da matriz de lacunas do `Convenio`, com foco em:

- origem dos dados;
- comportamento por campo;
- regra de copia;
- regra de cancelamento;
- regra de abertura com e sem paciente.
