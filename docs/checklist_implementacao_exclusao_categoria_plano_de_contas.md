# Checklist Técnico de Implementação - Exclusão de Categoria no Plano de Contas

## 1. Contexto

Este checklist prepara a futura implementação da exclusão de categorias financeiras no frontend React do Brana Cloud.

Baseia-se apenas em evidências já confirmadas:

- contrato documental fechado;
- validação prática do modal legado;
- backend atual já existente;
- migração de grupo fora do contrato.

## 2. Contratos confirmados

- Categoria sem uso exclui direto com confirmação.
- Categoria em uso abre modal de migração.
- O modal legado exibe apenas o nome da categoria no combo.
- O combo mostra destinos da mesma clínica.
- O destino pode estar em outro grupo.
- Não foi comprovada restrição por mesmo tipo.
- A origem é removida do combo.
- Não há opção vazia.
- Existe pré-seleção automática.
- Endpoint confirmado: `POST /cadastros/categorias/{categoria_id}/migrar-e-excluir`
- Payload confirmado: `{"categoria_destino_id": number}`
- Migração de grupo permanece fora do contrato.

## 3. Regras do combo

- Deve usar somente regras comprovadas.
- Destinos pertencem à mesma clínica.
- A origem não pode aparecer na lista.
- Outros grupos são permitidos.
- Não aplicar filtro frontend por mesmo tipo.
- Não exibir grupo ou tipo no texto da opção.
- Não inventar opção vazia.
- Preservar a ordenação observada ou a ordenação já devolvida pelo backend.
- Pré-selecionar a primeira opção elegível.

## 4. Endpoints

### Confirmados hoje

- `DELETE /cadastros/categorias/{categoria_id}`
- `POST /cadastros/categorias/{categoria_id}/migrar-e-excluir`
- `GET /cadastros/categorias/{categoria_id}/em-uso`

### Uso no checklist

- A implementação futura deve continuar respeitando o backend como autoridade final.
- Não criar endpoint novo sem necessidade.
- Não dividir a migração em múltiplas chamadas do frontend.

## 5. Payload

- O payload confirmado para migração é:

```json
{
  "categoria_destino_id": 0
}
```

- O frontend deve enviar somente esse campo.
- Não adicionar grupo, tipo, clínica ou metadados extras no payload de migração.

## 6. Arquitetura

### Recomendação

- `planoContasApi.js` deve centralizar as chamadas da categoria.
- Um modal próprio deve cuidar da seleção de destino.
- O hook principal deve orquestrar estado, loading, seleção e refresh.
- O backend continua validando elegibilidade e integridade.

### Princípio

- O frontend não resolve migração em sequência de requests manuais.
- A operação de migração deve permanecer atômica do ponto de vista do contrato.

## 7. Arquivos previstos

- `frontend-react/src/features/planoContas/planoContasApi.js`
- `frontend-react/src/features/planoContas/PlanoContasPage.jsx`
- `frontend-react/src/features/planoContas/hooks/usePlanoContas.js`
- `frontend-react/src/features/planoContas/hooks/usePlanoContasSelection.js`
- `frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx`
- `frontend-react/src/features/planoContas/components/PlanoContasCategoryModal.jsx`
- `frontend-react/src/features/planoContas/components/PlanoContasGroupsTable.jsx`
- `frontend-react/src/features/planoContas/components/PlanoContasCategoriesTable.jsx`

## 8. Componentes previstos

- `PlanoContasCategoryMigrationModal.jsx`

Responsabilidades:

- receber origem;
- receber grupo de origem;
- receber lista de destinos;
- remover a origem da lista;
- pré-selecionar o primeiro destino;
- bloquear confirmação sem destino;
- mostrar saving;
- permitir cancelar;
- não consultar APIs por conta própria, salvo contrato formal posterior.

## 9. Helpers previstos

- normalização de erro de categoria em uso;
- montagem segura do payload de migração;
- seleção do primeiro destino elegível;
- reconciliação pós-migração;
- reconciliação pós-exclusão.

## 10. Estados previstos

- carregando grupos;
- carregando categorias;
- selecionado categoria;
- selecionado grupo;
- migrando;
- excluindo;
- salvando;
- modal aberto;
- modal cancelado;
- erro backend;
- refresh pendente.

## 11. Regra da toolbar

- contexto `category` com categoria selecionada: `Eliminar` habilitado;
- sem seleção: `Eliminar` desabilitado;
- loading, saving, deleting ou migrating: `Eliminar` desabilitado;
- exclusão de grupo não entra nesta primeira frente;
- não misturar fluxo de grupo com fluxo de categoria.

## 12. Fluxo sem uso

1. usuário seleciona categoria;
2. contexto ativo é `category`;
3. clica `Eliminar`;
4. backend confirma ausência de uso;
5. confirmação simples acontece conforme contrato real;
6. categoria é excluída;
7. lista é recarregada;
8. grupo é preservado;
9. categoria removida é limpa;
10. fallback seguro é aplicado;
11. sucesso é exibido.

## 13. Fluxo em uso

1. usuário seleciona categoria;
2. clica `Eliminar`;
3. backend detecta uso ou frontend obtém a confirmação correspondente;
4. modal de migração abre;
5. origem aparece somente como leitura;
6. destinos elegíveis são carregados;
7. origem não aparece;
8. primeira opção é pré-selecionada;
9. usuário confirma;
10. enviar `POST /cadastros/categorias/{id}/migrar-e-excluir`;
11. bloquear segundo envio;
12. backend migra e exclui em transação;
13. frontend recarrega;
14. grupo pai permanece selecionado;
15. selecionar destino somente se o contrato futuro confirmar essa decisão;
16. mensagem de sucesso é exibida.

## 14. Modal

### Campos mínimos

- categoria em uso, somente leitura;
- label `Migrar lançamentos para:`;
- combo de destino;
- confirmar;
- cancelar.

### Regras

- mostrar somente o nome da categoria nas opções;
- não mostrar grupo nem tipo;
- bloquear confirmação se não houver destino;
- impedir duplo envio;
- permitir cancelar antes do request.

## 15. Destinos

- mesma clínica: `CONFIRMADO`
- origem removida: `CONFIRMADO`
- outros grupos permitidos: `CONFIRMADO`
- filtro frontend por mesmo tipo: `FORA DO CONTRATO`
- opção vazia: `FORA DO CONTRATO`
- pré-seleção da primeira opção: `CONFIRMADO`

## 16. Seleção

### Após exclusão sem uso

- preservar o grupo;
- limpar a categoria removida;
- aplicar fallback seguro se necessário.

### Após migração

- preservar o grupo atualmente selecionado se ainda existir;
- se o destino pertencer ao grupo atual, manter o grupo atual;
- se o destino pertencer a outro grupo, selecionar o grupo de destino e a categoria de destino;
- manter contexto `category`.

## 17. Erros

Planejar tratamento para:

- origem inexistente;
- destino inexistente;
- destino igual à origem;
- destino de outra clínica;
- destino removido durante o modal;
- categoria deixando de estar em uso;
- falha de rede;
- 400;
- 401;
- 403;
- 404;
- 409;
- 422;
- 500;
- rollback interno;
- refresh falhando depois do sucesso;
- duplo submit.

## 18. Concorrência

- origem removida por outro usuário;
- destino removido por outro usuário;
- novos vínculos criados enquanto o modal está aberto;
- resposta fora de ordem;
- request duplicado;
- falha parcial de atualização;
- exclusão falhando depois da migração.

## 19. Testes frontend

1. origem removida da lista;
2. outros grupos permitidos;
3. não filtra por tipo;
4. opção mostra apenas nome;
5. primeira opção pré-selecionada;
6. lista vazia bloqueia confirmar;
7. payload contém somente `categoria_destino_id`;
8. ID da origem vai na URL;
9. saving bloqueia duplo envio;
10. cancelar não envia request;
11. erro mantém modal aberto;
12. sucesso fecha modal;
13. refresh é executado;
14. seleção é reconciliada;
15. contexto de grupo não abre migração de categoria;
16. evento do shell é limpo;
17. rota diferente ignora a ação;
18. resposta inesperada não quebra a tela.

## 20. Testes backend

1. categoria sem uso exclui;
2. categoria em uso não exclui diretamente;
3. migração para categoria válida funciona;
4. origem é excluída;
5. destino permanece;
6. todos os vínculos confirmados mudam para o destino;
7. origem igual ao destino falha;
8. origem inexistente falha;
9. destino inexistente falha;
10. destino de outra clínica falha;
11. falha durante update provoca rollback;
12. falha durante exclusão provoca rollback;
13. request duplicado é tratado com segurança;
14. nenhuma base principal é usada.

## 21. Validação runtime

- abrir Plano de contas React;
- selecionar categoria sem uso;
- validar confirmação simples;
- cancelar;
- selecionar categoria em uso;
- abrir modal;
- conferir texto;
- conferir combo;
- conferir ausência da origem;
- conferir outros grupos;
- conferir pré-seleção;
- cancelar sem alteração;
- conferir tema claro;
- conferir tema escuro;
- conferir shell sem emenda.

## 22. Documentação

- manter este checklist como base de execução futura;
- referenciar o contrato específico;
- não sobrecarregar o contrato funcional geral;
- registrar divergências apenas se surgirem em nova validação.

## 23. Divisão por etapas

### ETAPA A

- confirmação final dos endpoints e respostas existentes.

### ETAPA B

- API frontend e helpers puros.

### ETAPA C

- exclusão de categoria sem uso.

### ETAPA D

- modal de migração sem persistência.

### ETAPA E

- integração do endpoint `migrar-e-excluir`.

### ETAPA F

- preservação e reconciliação de seleção.

### ETAPA G

- validação runtime e documentação.

## 24. Critérios de aceite

- checklist técnico criado;
- contrato do modal legado transcrito;
- regras do combo fechadas;
- endpoint registrado;
- payload registrado;
- ausência de filtro por mesmo tipo registrada;
- origem removida registrada;
- pré-seleção registrada;
- API planejada;
- modal planejado;
- toolbar planejada;
- fluxo sem uso definido;
- fluxo em uso definido;
- seleção pós-migração destacada;
- testes frontend listados;
- testes backend listados;
- validação runtime listada;
- etapas pequenas definidas;
- exclusão de grupo fora do escopo.

## 25. Itens fora do escopo

- botão Eliminar funcional;
- modal React implementado;
- endpoint novo;
- alteração no backend;
- alteração no banco;
- migration;
- teste de exclusão real;
- CSS novo;
- exclusão de grupo;
- commit;
- push.

## 26. Riscos

- tratar hipótese como requisito;
- inventar filtro por tipo;
- incluir grupo ou tipo no texto do combo sem evidência;
- dividir a migração em vários requests;
- misturar exclusão de grupo com categoria;
- deixar a seleção ao acaso.

## 27. Decisão ainda necessária

- decidir explicitamente a estratégia de seleção pós-migração quando o destino pertencer a outro grupo.

## Síntese final

Este checklist fecha o plano seguro para implementar, depois, apenas a exclusão de categoria no React, sem reabrir dúvidas já resolvidas pelo contrato e pela validação prática do legado.

## Atualização operacional

- O frontend React já implementa confirmação simples para categoria sem uso.
- O frontend React já abre modal de migração quando o DELETE retorna `409`.
- A origem fica em leitura, a primeira opção elegível é pré-selecionada e o POST usa `categoria_destino_id`.
- A reconciliação pós-sucesso preserva a seleção por ID e mantém o contexto `category`.
