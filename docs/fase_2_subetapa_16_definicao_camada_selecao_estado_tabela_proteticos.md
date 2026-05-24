# Fase 2 — Subetapa 16 — Definição documental da camada intermediária de seleção/estado da Tabela de protéticos

## 1. Contexto
Os helpers puros já foram extraídos para `frontend/js/modules/tabela-proteticos-helpers.js`.

`protServicoSelecionado` foi reavaliado na Subetapa 15.

A decisão foi não mover `protServicoSelecionado` diretamente.

Esta etapa define documentalmente uma camada intermediária para lidar com seleção/estado antes de qualquer recorte funcional.

## 2. Estado atual
- helpers puros já isolados;
- `protServicoSelecionado` ainda no `frontend/app.js`;
- dependências conhecidas:
  - `protServicosCache`;
  - `protServicoSelecionadoId`;
- risco de misturar helpers puros com helpers dependentes de estado;
- a Tabela de protéticos segue como primeira frente ativa da Fase 2.

## 3. Problema a resolver
`protServicoSelecionado` lida com seleção/estado e, por isso, não deve ser tratado como helper puro.

Há risco de extraí-lo para o arquivo atual de helpers sem uma separação conceitual.

## 4. Proposta de camada intermediária
Sugere-se, sem criar arquivo ainda, um possível arquivo futuro:

- `frontend/js/modules/tabela-proteticos-selecao-estado.js`

Esse arquivo, se criado em etapa futura, poderia abrigar funções ligadas a:

- consulta de seleção atual;
- helpers dependentes de cache/estado;
- funções de leitura de `protServicosCache`;
- funções de leitura de `protServicoSelecionadoId`;
- outras funções relacionadas à seleção, sem mexer em persistência/backend.

## 5. Escopo permitido para a camada futura
Uma futura camada de seleção/estado poderia, em tese, receber:

- `protServicoSelecionado`;
- outros helpers pequenos de leitura de seleção, se existirem e forem documentados antes.

Nenhuma função deve ser movida nesta etapa.

## 6. Escopo proibido para a camada futura
Continuam fora:

- salvar;
- editar;
- excluir;
- carregar;
- chamadas `requestJson`;
- backend;
- banco;
- endpoints;
- eventos complexos;
- relatório completo;
- envio de e-mail;
- permissões;
- sessão/autenticação;
- strings visíveis.

## 7. Análise de compatibilidade
Se `protServicoSelecionado` fosse movido no futuro, ele poderia acessar `protServicosCache` e `protServicoSelecionadoId` de diferentes formas:

- por acesso global direto;
- por exposição via `window`;
- por passagem explícita de parâmetros.

Vantagens e riscos:

- acesso global direto: simples, mas mantém forte acoplamento;
- exposição via `window`: preserva compatibilidade com `frontend/app.js`, porém continua acoplada ao estado global;
- passagem explícita de parâmetros: mais clara e testável, mas exigiria ajustes de chamadas e potencialmente maior impacto na integração.

A abordagem mais conservadora para manter compatibilidade com `frontend/app.js` é a exposição compatível com o padrão já usado pelos helpers atuais, sem alterar comportamento.

## 8. Decisão recomendada
Opção C: fazer uma nova subetapa documental mais detalhada mapeando todas as funções dependentes de seleção/estado antes de criar arquivo.

## 9. Justificativa da decisão
Essa opção é a mais segura porque:

- os helpers puros já foram extraídos com sucesso;
- `protServicoSelecionado` aumenta o risco por depender de estado;
- criar arquivo novo pode ser útil, mas também aumenta a superfície de integração;
- recortes funcionais devem permanecer pequenos e auditáveis.

## 10. Contrato mínimo para eventual futura Subetapa 17
Se houver recomendação de camada, a futura Subetapa 17 deverá:

- criar somente o arquivo de seleção/estado;
- mover somente `protServicoSelecionado`;
- preservar assinatura, retorno e comportamento;
- preservar acesso a `protServicosCache` e `protServicoSelecionadoId`;
- não mover outro helper;
- não alterar backend;
- não alterar banco;
- não alterar endpoints;
- não alterar strings visíveis;
- executar `node --check`;
- fazer commit seletivo;
- exigir teste manual humano.

Se a frente for pausada/consolidada, a futura Subetapa 17 deverá ser documental de fechamento/consolidação parcial da frente.

Se houver nova análise documental, a futura Subetapa 17 deverá mapear funções dependentes de seleção/estado.

## 11. Onde testar futuramente
Se houver eventual recorte futuro de `protServicoSelecionado`, o usuário deverá testar:

- abrir a Tabela de protéticos;
- listar protéticos;
- selecionar protético;
- selecionar serviço;
- trocar seleção entre serviços;
- editar serviço selecionado;
- abrir modal de serviço;
- abrir relatório;
- exportar relatórios;
- confirmar que criação, edição e exclusão continuam intactas;
- confirmar que não houve alteração textual visível;
- confirmar que agenda de contatos e controle de protéticos não foram afetados.

## 12. Registro para roadmap
- A Subetapa 16 define documentalmente uma possível camada de seleção/estado;
- helpers puros já extraídos permanecem isolados;
- `protServicoSelecionado` continua fora até decisão funcional própria;
- a decisão desta etapa define se haverá camada intermediária, pausa ou nova análise documental;
- a Tabela de protéticos continua como primeira frente ativa da Fase 2;
- próximos passos devem permanecer pequenos, reversíveis, auditáveis e com teste humano;
- persistência, carga, relatório completo, e-mail, eventos, backend, banco e endpoints continuam fora;
- `Editor de texto`, `Ficha pessoal`, `Agenda`, `Conta corrente`, `Usuários/Login` e `Seeds/tabelas padrão` continuam fora desta frente.

## 13. Commit seletivo obrigatório
O único arquivo que deve entrar no commit desta etapa é:

- `docs/fase_2_subetapa_16_definicao_camada_selecao_estado_tabela_proteticos.md`

Não usar `git add .`.

Não usar `git add docs/`.

Não incluir untracked antigos.

Não incluir `frontend/app.js`.

Não incluir `frontend/index.html`.

Não incluir `frontend/js/modules`.

Não incluir `backend`.

Não incluir banco/schema/migrations/seeds/endpoints.

O commit deve ser seletivo e auditado.

## 14. Confirmações finais
- Esta etapa é documental.
- Nenhum código foi alterado.
- `frontend/app.js` não foi alterado.
- `frontend/index.html` não foi alterado.
- `frontend/js/modules` não foi alterado.
- `backend` não foi alterado.
- banco, schema, migrations, seeds e endpoints não foram alterados.
- Nenhum `UPDATE`, `DELETE` ou `INSERT` foi executado.
- Nenhum texto visível, acento, label, mensagem, placeholder ou string foi corrigido.
- A blindagem textual/mojibake foi respeitada.
- Os untracked antigos foram preservados.
- O único arquivo criado/modificado nesta etapa foi `docs/fase_2_subetapa_16_definicao_camada_selecao_estado_tabela_proteticos.md`.
