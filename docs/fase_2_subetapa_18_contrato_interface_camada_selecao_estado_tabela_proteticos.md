# Fase 2 — Subetapa 18 — Contrato de interface da camada de seleção/estado da Tabela de protéticos

## 1. Contexto
Os helpers puros já foram extraídos.

`protServicoSelecionado` não foi movido por depender de cache/estado.

A Subetapa 17 recomendou definir contrato de interface antes de qualquer avanço funcional.

Esta etapa não cria módulo, não move função e não altera código.

## 2. Estado atual
- helpers já isolados em `frontend/js/modules/tabela-proteticos-helpers.js`;
- `protServicoSelecionado` ainda em `frontend/app.js`;
- arquivo futuro sugerido, sem criação:
  - `frontend/js/modules/tabela-proteticos-selecao-estado.js`;
- esta etapa é somente documental.

## 3. Objetivo do contrato de interface
O contrato deve definir como uma futura camada de seleção/estado se comunicaria com o estado ainda mantido no `app.js`, evitando:

- quebra de seleção atual;
- quebra de edição de serviço;
- quebra de relatório/exportação;
- mistura indevida com helpers puros;
- acoplamento oculto.

## 4. Estados e caches cobertos pelo contrato

### `protServicosCache`
- Responsabilidade aparente: manter a lista atual de serviços do protético selecionado.
- Forma de acesso futura recomendada: leitura controlada, preferencialmente sem mutação indireta pela camada nova.

### `protServicoSelecionadoId`
- Responsabilidade aparente: manter o id do serviço selecionado.
- Forma de acesso futura recomendada: leitura e atualização controladas, preservando compatibilidade com a seleção atual.

### `proteticosCache`
- Responsabilidade aparente: manter a lista atual de protéticos.
- Forma de acesso futura recomendada: leitura controlada apenas quando necessário para seleção atual.

### `proteticoSelecionadoId`
- Responsabilidade aparente: manter o id do protético selecionado.
- Forma de acesso futura recomendada: leitura e atualização controladas, preservando o fluxo atual.

### `prot`
- Responsabilidade aparente: concentrar referências de UI e estado da Tabela de protéticos.
- Forma de acesso futura recomendada: somente se necessário para ponte de compatibilidade, evitando dependência excessiva.

### Estados de relatório/arquivo
- `prot.relArquivoContext`
- `prot.relArquivoFormato`
- `prot.relArquivoPath`
- `prot.relArquivoHandle`
- `prot.relArquivoPickerWarned`

Esses estados ficam fora da camada inicial de seleção/estado.

## 5. Funções candidatas ao contrato

### Candidato inicial possível
- `protServicoSelecionado`

### Candidato futuro com cautela
- `protSelecionarLinha`
- `protEditarSelecionado`

### Fora da camada inicial
- `protCarregarServicos`
- `protCarregar`
- `protAbrirModal`
- `protSalvarModal`
- `protExcluirServico`
- `protRelatorioRows`
- `protVincularEventos`

## 6. Contrato mínimo proposto para `protServicoSelecionado`
- Assinatura atual esperada: sem parâmetros.
- Retorno esperado: item atual de `protServicosCache` ou `null`.
- Dependências atuais: `protServicosCache` e `protServicoSelecionadoId`.
- Dependências que devem continuar preservadas: cache atual e leitura da seleção atual.
- Como deverá acessar `protServicosCache`: leitura controlada.
- Como deverá acessar `protServicoSelecionadoId`: leitura controlada.
- Se deve manter leitura global: sim, como alternativa mais conservadora no curto prazo.
- Se deve receber parâmetros: não como primeira escolha, para evitar alteração de chamadas.
- Se deve ser exposto em `window`: apenas se a compatibilidade exigir, seguindo o padrão já usado nos helpers puros.
- Alternativa mais conservadora: manter compatibilidade global controlada, sem mudar as chamadas existentes.

## 7. Alternativas de interface

### Alternativa A: manter leitura global via `window` ou escopo global compatível
- Vantagem: máxima compatibilidade com `frontend/app.js`.
- Risco: mantém acoplamento global.
- Impacto em `frontend/app.js`: baixo.
- Impacto no novo arquivo futuro: baixo.
- Risco de regressão: menor no curto prazo.
- Compatibilidade com o padrão já usado nos helpers puros: alta.
- Recomendação: conservadora, mas ainda acoplada.

### Alternativa B: passar `protServicosCache` e `protServicoSelecionadoId` como parâmetros
- Vantagem: dependência explícita.
- Risco: exige alterar chamadas e pode espalhar mudanças.
- Impacto em `frontend/app.js`: médio a alto.
- Impacto no novo arquivo futuro: médio.
- Risco de regressão: médio.
- Compatibilidade com o padrão já usado nos helpers puros: baixa.
- Recomendação: só se houver contrato mais amplo e teste automático.

### Alternativa C: criar objeto adaptador/getters, por exemplo funções de leitura controlada
- Vantagem: separa leitura do estado sem expor tudo diretamente.
- Risco: adiciona uma camada intermediária e mais superfície de integração.
- Impacto em `frontend/app.js`: médio.
- Impacto no novo arquivo futuro: médio.
- Risco de regressão: médio.
- Compatibilidade com o padrão já usado nos helpers puros: moderada.
- Recomendação: boa para documentar, mas não para mover agora.

## 8. Interface recomendada
Recomenda-se, de forma conservadora, **não avançar funcionalmente ainda**.

A interface deve permanecer documentada como dependência global controlada, sem mover `protServicoSelecionado` nesta etapa.

Decisão respondida:

- a futura camada não deve depender de parâmetros nesta fase;
- a futura camada pode continuar dependendo de globais enquanto o contrato não estiver implementado;
- a função não deve ser exposta em `window` nesta etapa, porque nenhuma camada foi criada;
- a decisão não é começar com apenas `protServicoSelecionado`;
- não criar arquivo novo nesta etapa.

## 9. Escopo permitido para eventual futura Subetapa 19 funcional
Se houver avanço funcional futuro:

- criar somente `frontend/js/modules/tabela-proteticos-selecao-estado.js`;
- mover somente `protServicoSelecionado`;
- preservar assinatura, retorno e comportamento;
- preservar leitura de `protServicosCache`;
- preservar leitura de `protServicoSelecionadoId`;
- não mover `protSelecionarLinha`;
- não mover `protEditarSelecionado`;
- não mover salvar, excluir, carregar ou eventos;
- não alterar backend;
- não alterar banco;
- não alterar endpoints;
- não alterar strings visíveis;
- executar `node --check` nos arquivos envolvidos;
- fazer commit seletivo;
- exigir teste manual humano.

## 10. Escopo proibido para a futura camada inicial
Continuam fora:

- `protSelecionarLinha`, salvo decisão futura própria;
- `protEditarSelecionado`;
- `protCarregarServicos`;
- `protCarregar`;
- `protAbrir`;
- `protAbrirModal`;
- `protSalvarModal`;
- `protExcluirServico`;
- `protRelatorioRows`;
- `protRelatorioPdfBlob`;
- `protVincularEventos`;
- persistência;
- carga;
- relatório completo;
- exportação completa;
- envio de e-mail;
- eventos;
- permissões;
- sessão/autenticação;
- backend;
- banco;
- endpoints;
- textos visíveis.

## 11. Riscos e mitigação

### Riscos
- leitura incorreta de cache;
- seleção vazia;
- serviço selecionado inexistente;
- cache alterado após seleção;
- quebra de edição do serviço selecionado;
- quebra de exclusão do serviço selecionado;
- quebra de relatório por seleção incorreta;
- exposição global indevida;
- mistura com helpers puros.

### Mitigação
- mover um único helper;
- manter assinatura;
- manter fallback atual;
- não alterar callers;
- `node --check`;
- teste manual focado em seleção, edição e relatório.

## 12. Onde testar futuramente
Se houver futura extração de `protServicoSelecionado`, o usuário deverá testar:

- abrir a Tabela de protéticos;
- listar protéticos;
- selecionar protético;
- selecionar serviço;
- trocar seleção entre serviços;
- editar serviço selecionado;
- abrir modal de serviço;
- criar serviço;
- editar serviço;
- excluir serviço;
- abrir relatório;
- exportar relatórios;
- confirmar que criação, edição e exclusão de protético continuam intactas;
- confirmar que não houve alteração textual visível;
- confirmar que agenda de contatos e controle de protéticos não foram afetados.

## 13. Decisão recomendada
Opção C: recomendar mais uma subetapa documental antes do recorte funcional, se ainda houver acoplamento ou dúvidas.

## 14. Registro para roadmap
- A Subetapa 18 define o contrato de interface da camada de seleção/estado;
- helpers puros já extraídos permanecem isolados;
- `protServicoSelecionado` continua fora até eventual subetapa funcional própria;
- a decisão desta etapa define se haverá Subetapa 19 funcional, pausa ou nova documentação;
- a Tabela de protéticos continua como primeira frente ativa da Fase 2;
- próximos passos devem permanecer pequenos, reversíveis, auditáveis e com teste humano;
- persistência, carga, relatório completo, e-mail, eventos, backend, banco e endpoints continuam fora;
- `Editor de texto`, `Ficha pessoal`, `Agenda`, `Conta corrente`, `Usuários/Login` e `Seeds/tabelas padrão` continuam fora desta frente.

## 15. Commit seletivo obrigatório
O único arquivo que deve entrar no commit desta etapa é:

- `docs/fase_2_subetapa_18_contrato_interface_camada_selecao_estado_tabela_proteticos.md`

Não usar `git add .`.

Não usar `git add docs/`.

Não incluir untracked antigos.

Não incluir `frontend/app.js`.

Não incluir `frontend/index.html`.

Não incluir `frontend/js/modules`.

Não incluir `backend`.

Não incluir banco/schema/migrations/seeds/endpoints.

O commit deve ser seletivo e auditado.

## 16. Confirmações finais
- Esta etapa é documental.
- Nenhum código foi alterado.
- `frontend/app.js` não foi alterado.
- `frontend/index.html` não foi alterado.
- `frontend/js/modules` não foi alterado.
- `frontend/js/modules/tabela-proteticos-selecao-estado.js` não foi criado.
- backend não foi alterado.
- banco, schema, migrations, seeds e endpoints não foram alterados.
- Nenhum `UPDATE`, `DELETE` ou `INSERT` foi executado.
- Nenhum texto visível, acento, label, mensagem, placeholder ou string foi corrigido.
- A blindagem textual/mojibake foi respeitada.
- Os untracked antigos foram preservados.
- O único arquivo criado/modificado nesta etapa foi `docs/fase_2_subetapa_18_contrato_interface_camada_selecao_estado_tabela_proteticos.md`.
