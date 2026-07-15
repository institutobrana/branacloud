# Contrato de Exclusão e Migração - Plano de Contas

## 1. Objetivo

Definir, de forma fechada e verificável, as regras de exclusão e migração do `Plano de contas`, com foco nas entidades `Grupo financeiro` e `Categoria financeira`.

## 2. Escopo

- Aplica-se ao fluxo funcional do Plano de Contas.
- Cobre exclusão de categoria sem uso, exclusão de categoria em uso, exclusão de grupo vazio e bloqueio de grupo com categorias.
- Não define implementação de UI, backend ou banco.

## 3. Fontes

- [`docs/auditoria_regra_exclusao_migracao_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_regra_exclusao_migracao_plano_de_contas.md)
- [`docs/contrato_funcional_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/contrato_funcional_plano_de_contas.md)
- [`docs/mapeamento_dados_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/mapeamento_dados_plano_de_contas.md)
- [`docs/auditoria_plano_de_contas_frontend_legado.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_plano_de_contas_frontend_legado.md)
- [`docs/auditoria_plano_de_contas_easydental_desktop.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_plano_de_contas_easydental_desktop.md)
- [`backend/routes/cadastros_routes.py`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/routes/cadastros_routes.py)
- [`frontend/app.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js)

## 4. Terminologia

- `Grupo financeiro`: entidade pai do Plano de Contas.
- `Categoria financeira`: entidade filha do grupo.
- `Em uso`: categoria possui lançamentos vinculados.
- `Destino`: categoria escolhida para receber as referências migradas.
- `Mesmo grupo`: regra a confirmar apenas se explicitamente exigida pela implementação futura.

## 5. Entidades envolvidas

- `GrupoFinanceiro`
- `CategoriaFinanceira`
- `Lancamento`

## 6. Regra de categoria sem uso

- `CONFIRMADO`
- Pode ser excluída diretamente.
- Exige confirmação do usuário.
- A exclusão respeita clínica e permissão.
- A operação deve recarregar listas e preservar coerência de seleção.

## 7. Regra de categoria em uso

- `CONFIRMADO`
- Não pode ser simplesmente excluída.
- O usuário deve escolher uma categoria de destino.
- As referências confirmadas devem ser migradas para o destino.
- A categoria de origem só pode ser excluída depois da migração.
- A operação futura deve ser transacional.

## 8. Regra de grupo vazio

- `CONFIRMADO`
- Pode ser excluído mediante confirmação.

## 9. Regra de grupo com categorias

- `CONFIRMADO`
- A exclusão deve ser bloqueada.
- O usuário deve tratar as categorias primeiro.
- Não existe migração automática de grupo confirmada.

## 10. Migração de grupo não confirmada

- `FORA DO CONTRATO`
- Não encontrada no backend atual.
- Não encontrada no frontend legado auditado.
- Não encontrada na documentação auditada.
- Não faz parte da implementação futura aprovada nesta fase.

## 11. Permissões

- `CONFIRMADO`
- A operação deve respeitar a permissão do módulo financeiro.
- A UI não substitui a validação do backend.

## 12. Isolamento por clínica

- `CONFIRMADO`
- Toda operação deve respeitar `current_user.clinica_id`.
- Não aceitar clínica vinda do frontend como fonte de verdade.

## 13. Validações

- `CONFIRMADO`
- Validar uso da categoria antes da exclusão.
- Validar existência da categoria destino.
- Validar existência do grupo origem.
- Validar bloqueio de grupo com categorias.

## 14. Regras de destino

- `CONFIRMADO` para o que foi evidenciado.
- Destino deve existir e pertencer à mesma clínica.
- `NÃO CONFIRMADO` se o destino precisa obrigatoriamente estar no mesmo grupo.
- `NÃO CONFIRMADO` se o destino precisa obrigatoriamente ter o mesmo tipo.
- `NÃO CONFIRMADO` se o destino pode ser qualquer categoria da mesma clínica.
- `NÃO CONFIRMADO` para regras adicionais de duplicidade além das já tratadas pelo backend atual.

## 15. Ordem das operações

- Categoria sem uso:
  1. verificar uso;
  2. confirmar exclusão;
  3. excluir;
  4. recarregar.
- Categoria em uso:
  1. verificar uso;
  2. validar destino;
  3. migrar referências;
  4. excluir origem;
  5. recarregar.
- Grupo vazio:
  1. confirmar ausência de categorias;
  2. confirmar exclusão;
  3. excluir;
  4. recarregar.
- Grupo com categorias:
  1. detectar vínculo;
  2. bloquear;
  3. orientar tratamento das categorias.

## 16. Atomicidade

- `CONFIRMADO` para categoria em uso como requisito de contrato.
- A migração e a exclusão devem ocorrer como uma única operação lógica.
- O frontend não deve executar migração distribuída em múltiplas requisições manuais.

## 17. Rollback

- `CONFIRMADO` como requisito funcional.
- Qualquer falha deve preservar origem e referências.
- Falha parcial não deve produzir sucesso visual.

## 18. Mensagens esperadas

- Categoria sem uso: confirmação simples com nome da categoria.
- Categoria em uso: mensagem de uso, seleção de destino e aviso de migração.
- Grupo vazio: confirmação simples com nome do grupo.
- Grupo com categorias: mensagem de bloqueio orientando tratar categorias primeiro.

## 19. Estado da toolbar

- Contexto `category` com categoria selecionada: `Eliminar` habilitado.
- Contexto `group` com grupo selecionado: `Eliminar` habilitado, mas sujeito a bloqueio.
- Sem seleção: `Eliminar` desabilitado.
- Durante loading, saving, exclusão ou migração: ações conflitantes bloqueadas.

## 20. Comportamento dos modais

- Confirmação simples para categoria sem uso.
- Modal específico para categoria em uso com escolha de destino.
- Mensagem de bloqueio para grupo com categorias.
- Não reutilizar um único modal para funções diferentes sem contrato explícito.

## 21. Refresh

- Recarregar grupos e categorias ao final de operação concluída.
- Manter a lista coerente com o estado atual do backend.

## 22. Seleção após concluir

- Categoria sem uso excluída: limpar categoria removida e preservar grupo pai.
- Categoria em uso migrada: reconciliar seleção conforme contrato futuro.
- Grupo excluído: aplicar fallback seguro e limpar categoria ativa.

## 23. Erros

- Erros devem ser apresentados ao usuário sem afirmar sucesso.
- Falha de destino, falha de uso, falha de permissão ou falha de clínica devem bloquear a operação.

## 24. Concorrência

- `CONFIRMADO` como preocupação obrigatória.
- Prever origem removida por outro usuário, destino removido por outro usuário, novos vínculos e respostas fora de ordem.

## 31. Implementação React atual

- O modal de migração foi implementado no frontend React para o caso de `409`.
- A origem é exibida em leitura, sem edição de nome, grupo, tipo ou tributável.
- O combo remove a origem, preserva a ordem, mostra apenas o nome e pré-seleciona o primeiro destino elegível.
- O fluxo de confirmação usa `POST /cadastros/categorias/{categoria_id}/migrar-e-excluir` com `categoria_destino_id`.
- A seleção pós-sucesso é reconciliada por IDs, inclusive quando o destino pertence a outro grupo.

## 25. Critérios de aceite

- Categoria sem uso exclui.
- Categoria em uso exige destino.
- Grupo vazio exclui.
- Grupo com categorias bloqueia.
- Migração de grupo permanece fora do contrato.

## 26. Testes futuros

- Categoria sem uso exclui.
- Categoria em uso exige destino.
- Destino igual à origem falha.
- Destino de outra clínica falha.
- Migração preserva referências.
- Falhas produzem rollback.
- Grupo vazio exclui.
- Grupo com categorias bloqueia.
- Nenhuma migração de grupo ocorre.

## 27. Divisão de implementação

1. contrato backend e testes de uso da categoria;
2. exclusão de categoria sem uso;
3. migração transacional de categoria em uso;
4. integração frontend do fluxo de migração;
5. exclusão de grupo vazio;
6. bloqueio de grupo com categorias;
7. validação integrada e encerramento.

## 28. Itens fora do escopo

- Implementação do botão Eliminar.
- Implementação de modal.
- Implementação de endpoint.
- Alteração de frontend React.
- Alteração de backend.
- Alteração de banco.
- Migration.
- Teste de exclusão real.

## 29. Riscos

- Tratar hipótese como requisito.
- Reutilizar fluxo de grupo para categoria sem evidência.
- Implementar migração distribuída no frontend.
- Confundir bloqueio de grupo com migração de grupo.

## 30. Decisões futuras

- Reavaliar destino de categoria apenas se nova evidência surgir.
- Manter migração de grupo fora do contrato até decisão formal.
- Definir a estratégia de API somente quando a etapa de implementação for aberta.

## Síntese contratual

- Categoria sem uso: exclusão direta com confirmação.
- Categoria em uso: migração transacional para destino válido e exclusão da origem.
- Grupo vazio: exclusão direta com confirmação.
- Grupo com categorias: bloqueio.
- Migração de grupo: fora do contrato.

## Validação prática do modal de migração

### Runtime do Brana legado

- URL observada: `http://192.168.3.41:8000/app`
- O modal foi aberto no frontend legado, após autenticação.
- O fluxo foi acionado por `Configurações -> Plano de contas...`.

### Modal observado

- Título: `Cadastro`
- Texto visível:
  - `Categoria em uso: Certificado digital - PESSOAL`
  - `Migrar lançamentos para:`
- Botões:
  - `Ok`
  - `Cancela`
- Fechamento por `X` no cabeçalho padrão.

### Combo observado

- O combo inicia com seleção automática.
- Não existe opção vazia.
- O valor inicial observado foi `261` com texto `ABO`.
- O texto de cada item é somente o nome da categoria.
- Não há grupo, tipo ou hierarquia textual no item do combo.

### Regras de destino confirmadas pelo runtime

- Destino pode estar em outro grupo: `CONFIRMADO`
- Destino precisa ter o mesmo tipo: `NÃO CONFIRMADO`
- Categoria de origem é removida do combo: `CONFIRMADO`
- Há seleção automática: `CONFIRMADO`
- Confirmar sem escolher destino: `FORA DO CONTRATO`, porque não há estado vazio no combo observado

### Regras de destino confirmadas pelo código legado

- O combo é montado com `gruposCache.flatMap(g => g.categorias || [])`.
- O único filtro explícito é excluir a origem.
- Não há filtro por grupo.
- Não há filtro por tipo.
- Não há filtro por inativo.
- O payload de confirmação é `{"categoria_destino_id": destino}`.
- O endpoint usado é `POST /cadastros/categorias/{c.id}/migrar-e-excluir`.

### Comparação com o backend atual

- O backend atual segue a mesma lógica observada no legado para categoria.
- Não há validação adicional confirmada de mesmo grupo.
- Não há validação adicional confirmada de mesmo tipo.
- A exclusão de categoria em uso é feita junto da migração no mesmo fluxo de endpoint.

### Evidência consolidada

- O modal de migração existe.
- O combo inclui categorias de outros grupos da mesma clínica.
- O combo não apresenta a própria origem.
- O combo não exibe grupo ou tipo no texto.
- O fluxo não mostrou opção vazia.
- A seleção inicial é automática.
- A confirmação sem destino não foi observada como estado natural do modal.
