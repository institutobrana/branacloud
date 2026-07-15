# Auditoria da Regra de Exclusão e Migração - Plano de Contas

## Status da etapa

- Escopo: somente auditoria documental e técnica.
- Implementação: não realizada.
- Backend, banco, frontend legado e produção: não alterados nesta etapa.
- Conclusão de negócio: a regra foi reconstruída com evidência suficiente para categoria; para grupo, há bloqueio confirmado, mas não há migração equivalente confirmada.

## Contexto e restrições seguidas

- Branch observado: `modularizacao-segura-fase-1`.
- Remote observado: `origin` apontando para `https://github.com/institutobrana/branacloud.git`.
- O worktree estava sujo antes da etapa.
- Não houve commit, push, reset, limpeza do worktree ou alteração destrutiva.
- Não houve alteração de backend, banco, migration, seed, endpoint ou CRUD nesta etapa.

## Fontes consultadas

### Código atual

- [`backend/routes/cadastros_routes.py`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/routes/cadastros_routes.py)
- [`backend/models/financeiro.py`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/models/financeiro.py)
- [`backend/models/usuario.py`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/models/usuario.py)
- [`frontend/app.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js)
- [`frontend/index.html`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/index.html)

### Documentação interna

- [`docs/auditoria_plano_de_contas_frontend_legado.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_plano_de_contas_frontend_legado.md)
- [`docs/auditoria_plano_de_contas_easydental_desktop.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_plano_de_contas_easydental_desktop.md)
- [`docs/auditoria_padroes_react_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_padroes_react_plano_de_contas.md)
- [`docs/contrato_funcional_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/contrato_funcional_plano_de_contas.md)
- [`docs/mapeamento_dados_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/mapeamento_dados_plano_de_contas.md)
- [`docs/contrato_visual_plano_de_contas_frontend_react.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/contrato_visual_plano_de_contas_frontend_react.md)
- [`docs/roadmap_plano_de_contas_frontend_react.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/roadmap_plano_de_contas_frontend_react.md)
- [`docs/11_roadmap_desenvolvimento.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/11_roadmap_desenvolvimento.md)

### Histórico Git

- `git branch -a`
- `git tag --sort=-creatordate`
- `git log --all --oneline --decorate --grep="plano de contas" -i`
- `git log --all --oneline --decorate -S"migrar-e-excluir" -- backend frontend docs`
- `git log --all --oneline --decorate -S"Grupo exclui com confirmação" -S"Categoria exclui com confirmação" -S"migrar e excluir" -- docs/auditoria_padroes_react_plano_de_contas.md docs/auditoria_plano_de_contas_frontend_legado.md`

### Fontes locais externas

- `Y:\EDS70` foi citado nas auditorias históricas do EasyDental Desktop.
- `docs/auditoria_plano_de_contas_easydental_desktop.md` já consolida essa trilha como evidência documental.
- `docs/auditoria_seletiva_diff_plano_de_contas.md` não foi encontrado no repositório.

## Resumo executivo

O resultado mais importante é este:

- **Categoria financeira** tem regra clara de exclusão segura:
  - se não houver uso, exclui direto;
  - se houver uso por lançamentos, migra os lançamentos para outra categoria e depois exclui a origem.
- **Grupo financeiro** tem regra de bloqueio confirmada:
  - não pode ser excluído se ainda tiver categorias vinculadas;
  - não há evidência confirmada de migração automática de grupo no backend atual.

Portanto, a hipótese de que grupo e categoria compartilham a mesma lógica de exclusão/migração é falsa.

## Regra reconstruída

### Categoria financeira

Fluxo confirmado:

1. verificar se a categoria está em uso;
2. se não estiver em uso, permitir exclusão direta;
3. se estiver em uso, exigir seleção de categoria de destino;
4. migrar `Lancamento.categoria_id` para o destino;
5. excluir a categoria de origem.

### Grupo financeiro

Fluxo confirmado:

1. verificar se o grupo possui categorias vinculadas;
2. se possuir, bloquear a exclusão;
3. se não possuir, permitir exclusão direta;
4. não foi confirmada migração para um grupo de destino no backend atual;
5. não foi encontrado fluxo equivalente de “migrar e excluir grupo”.

## Perguntas respondidas

### 1. Existe regra histórica de exclusão protegida para categorias?

- **CONFIRMADO**
- Sim. O frontend legado e o backend atual mostram exclusão protegida por verificação de uso.

### 2. Existe regra histórica de migração antes da exclusão de categoria?

- **CONFIRMADO**
- Sim. Há endpoint explícito `POST /cadastros/categorias/{categoria_id}/migrar-e-excluir`.

### 3. A migração de categoria acontece antes ou depois da exclusão?

- **CONFIRMADO**
- Antes da exclusão. O backend atual atualiza os lançamentos e só depois apaga a categoria original.

### 4. O que dispara a migração de categoria?

- **CONFIRMADO**
- Categoria em uso por lançamentos.

### 5. O frontend legado pergunta primeiro se a categoria está em uso?

- **CONFIRMADO**
- Sim. Ele consulta `GET /cadastros/categorias/{id}/em-uso`.

### 6. O frontend legado possui seleção de categoria de destino?

- **CONFIRMADO**
- Sim. O fluxo de migração abre seleção de destino em modal.

### 7. O backend atual impede exclusão de categoria em uso sem migração?

- **CONFIRMADO**
- Sim. O `DELETE /cadastros/categorias/{id}` devolve 409 quando há lançamentos vinculados.

### 8. O backend atual permite excluir categoria sem uso?

- **CONFIRMADO**
- Sim. Nessa condição, o `DELETE` direto é aceito.

### 9. O grupo financeiro tem exclusão protegida?

- **CONFIRMADO**
- Sim. O backend impede a exclusão quando há categorias vinculadas.

### 10. O grupo financeiro tem migração equivalente à da categoria?

- **NÃO ENCONTRADO**
- Não há endpoint ou fluxo confirmado de migração de grupo.

### 11. O grupo financeiro pode ser excluído quando não possui categorias?

- **CONFIRMADO**
- Sim. O backend elimina o grupo nesse cenário.

### 12. O frontend legado prevê exclusão de grupo?

- **CONFIRMADO**
- Sim. Há `planoExcluirGrupo()` no shell legado.

### 13. O frontend legado prevê exclusão de categoria?

- **CONFIRMADO**
- Sim. Há `planoExcluirCategoria()` no shell legado.

### 14. A tela atual usa um contrato de duas tabelas?

- **CONFIRMADO**
- Sim. Grupo à esquerda e categorias do grupo à direita.

### 15. O contrato documental anterior já tratava categoria como entidade separada?

- **CONFIRMADO**
- Sim. O mapeamento de dados e o contrato funcional já separam `grupo` e `categoria`.

### 16. Há evidência de que categoria depende de lançamentos financeiros?

- **CONFIRMADO**
- Sim. `CategoriaFinanceira.lancamentos -> Lancamento` e o endpoint de `em-uso`.

### 17. Há evidência de que grupo depende de categorias vinculadas?

- **CONFIRMADO**
- Sim. O bloqueio de exclusão do grupo ocorre quando há categorias.

### 18. Há evidência de soft delete para grupo ou categoria?

- **NÃO ENCONTRADO**
- O fluxo observado é de hard delete com bloqueio e/ou migração.

### 19. A regra histórica é a mesma no EasyDental Desktop?

- **EVIDÊNCIA PARCIAL**
- Há evidência de estrutura própria e dependências, mas sem recuperar toda a tela/fluxo de UI legível.

### 20. O EasyDental Desktop confirma dependência de exclusão protegida?

- **CONFIRMADO**
- Sim. O material histórico aponta dependência em outras tabelas e conflito de FK.

### 21. Existe documentação anterior afirmando “grupo exclui com bloqueio”?

- **CONFIRMADO**
- Sim. A auditoria comparativa de padrões React registra esse comportamento como recomendação/contrato.

### 22. Existe documentação anterior afirmando “categoria exclui com migração quando em uso”?

- **CONFIRMADO**
- Sim. O frontend legado e a auditoria comparativa registram isso explicitamente.

### 23. O contrato visual do React já previa migração?

- **CONFIRMADO**
- Sim. O documento comparativo recomenda modal específico para migração.

### 24. A migração de categoria tem componente reutilizável pronto?

- **NÃO ENCONTRADO**
- A auditoria comparativa diz que não existe componente direto reutilizável no conjunto auditado.

### 25. A regra de exclusão de categoria é local da UI ou do backend?

- **CONFIRMADO**
- É do backend e da UI. A UI só antecipa e conduz o fluxo; a segurança real está no backend.

### 26. A regra de exclusão de grupo depende do frontend?

- **CONTRADIÇÃO**
- O frontend pode orientar o usuário, mas a proteção real vem do backend; o frontend não é a barreira de segurança.

### 27. Existe relação entre migração de categoria e `Lancamento`?

- **CONFIRMADO**
- Sim. A migração move `Lancamento.categoria_id` para o destino.

### 28. Existe relação entre exclusão de grupo e `Lancamento`?

- **EVIDÊNCIA PARCIAL**
- Indiretamente sim, porque categorias ligadas a lançamentos impedem o fluxo de remoção indireta do grupo, mas não há migração de grupo confirmada.

### 29. A exclusão de grupo pode apagar categorias automaticamente?

- **NÃO ENCONTRADO**
- O comportamento confirmado é o oposto: a presença de categorias bloqueia o delete.

### 30. A regra final pode ser aplicada agora sem nova descoberta?

- **CONFIRMADO PARA CATEGORIA**
- **NÃO CONFIRMADO PARA GRUPO COM MIGRAÇÃO**
- Categoria já está fechada.
- Grupo ainda precisa de decisão explícita se o produto deseja só bloquear ou também criar migração.

## Matriz de evidência por cenário

### Categoria não em uso

- **CONFIRMADO**
- Caminho: `GET em-uso` retorna falso, `DELETE` direto segue.

### Categoria em uso

- **CONFIRMADO**
- Caminho: `GET em-uso` retorna verdadeiro, modal pede destino e `POST .../migrar-e-excluir` executa migração.

### Grupo sem categorias

- **CONFIRMADO**
- Caminho: `DELETE /cadastros/grupos/{id}` pode concluir.

### Grupo com categorias

- **CONFIRMADO**
- Caminho: exclusão bloqueada com mensagem de categorias vinculadas.

### Grupo com categorias em uso

- **EVIDÊNCIA PARCIAL**
- A situação é compatível com bloqueio mais forte, mas não foi encontrada regra de migração de grupo.

## Conciliação entre fontes

### Backend atual

- É a fonte mais forte para a regra vigente.
- Confirma bloqueio de grupo e exclusão/migração de categoria.

### Frontend legado

- Confirma a experiência de usuário da categoria em uso.
- Confirma que o fluxo já existia no shell legado.

### EasyDental Desktop

- Confirma dependências estruturais no banco legado.
- Não fecha a camada visual por completo.

### Documentação React

- Confirma o contrato de duas tabelas e a necessidade de migração como padrão visual.

## Observações de risco

- Não existe prova documental de migração de grupo.
- A existência de fluxo de exclusão de grupo não autoriza inventar um fluxo de transferência.
- O contrato do grupo deve continuar como bloqueio até que haja evidência nova.
- Categoria não deve ser tratada como simples delete sem checar uso.
- A UI pode sugerir, mas o backend precisa continuar validando.

## Decisão prática para a etapa atual

- Encerrar a investigação com regra confirmada para categoria.
- Manter grupo somente com bloqueio de exclusão por enquanto.
- Não implementar migração de grupo sem evidência nova.
- Registrar no roadmap que a exclusão ainda está bloqueada no sentido de implementação funcional futura.

## Referências técnicas diretas

- `backend/routes/cadastros_routes.py`
  - `DELETE /cadastros/grupos/{grupo_id}`
  - `GET /cadastros/categorias/{categoria_id}/em-uso`
  - `DELETE /cadastros/categorias/{categoria_id}`
  - `POST /cadastros/categorias/{categoria_id}/migrar-e-excluir`
- `frontend/app.js`
  - `planoExcluirGrupo()`
  - `planoExcluirCategoria()`
  - `cadModalAbrir(...)`
- `docs/auditoria_plano_de_contas_frontend_legado.md`
  - confirma a trilha de exclusão protegida e migração de categoria
- `docs/auditoria_plano_de_contas_easydental_desktop.md`
  - confirma dependências de dados e bloqueios estruturais
- `docs/auditoria_padroes_react_plano_de_contas.md`
  - registra o padrão recomendado de exclusão e migração

## Conclusão final

A regra real do Brana Cloude para o Plano de Contas foi reconstruída assim:

- **Categoria financeira**
  - exclui direto se não estiver em uso;
  - se estiver em uso, migra lançamentos para outra categoria e depois exclui.
- **Grupo financeiro**
  - exclui apenas se não houver categorias vinculadas;
  - não existe migração de grupo confirmada no material auditado.

Isso significa que a proteção de exclusão já existe, mas a migração é um contrato confirmado apenas para categorias.

## Validação prática do modal de migração

### Runtime do Brana legado

- URL inicial usada: `http://192.168.3.41:8000/app`
- O modal foi aberto no runtime legado após autenticação já existente na sessão.
- O fluxo foi acionado a partir do menu `Configurações -> Plano de contas...`.

### Categoria de origem validada

- Grupo de origem: `Custo fixo pessoal`
- Categoria de origem: `Certificado digital - PESSOAL`
- Tipo da categoria de origem: `Saída`
- Categoria de origem em uso: sim, confirmado pela tela e pelo fluxo de migração.

### Título e texto do modal

- Título visível: `Cadastro`
- Texto principal visível:
  - `Categoria em uso: Certificado digital - PESSOAL`
  - `Migrar lançamentos para:`

### Campos e botões

- Campo visível:
  - `select#cad-dest`
- Botões visíveis:
  - `Ok`
  - `Cancela`
- Fechamento por `X` também presente no cabeçalho padrão do modal.

### Estado inicial do modal

- O `select` não abre vazio.
- Há seleção automática inicial.
- O valor inicial observado foi `261`, com texto `ABO`.
- O botão `Ok` está habilitado.

### Combo de destino observado

- O combo exibiu uma lista extensa de categorias da mesma clínica.
- A categoria de origem `Certificado digital - PESSOAL` não aparece no combo.
- Não há opção vazia.
- Não há agrupamento visual por grupo.
- O texto exibido em cada opção é somente o nome da categoria.
- Não há indicação visual de grupo ou tipo no texto da opção.

### Amostra do combo exibido

- `ABO`
- `Açougue`
- `APCD`
- `Automóvel`
- `Barbeiro`
- `Bombeiro`
- `Cofins`
- `Combustível`
- `Comissão / Benefícios`
- `Condomínio`
- `Contador`
- `CPFL - EMPRESA`
- `CPFL - PESSOAL`
- `CR Convênio`
- `CR Outros (Pessoal)`
- `CR Outros (Profissional)`
- `CR Paciente`
- `CRO`
- `Cursos treinamentos`
- `DB Convênio`
- `DB Juros/Multa`
- `DB Outros (Pessoal)`
- `DB Outros (Profissionais)`
- `DB Paciente`
- `Despesas de mercado`
- `Divulgação e marketing`
- `Equipamentos - EMPRESA`
- `Equipamentos - PESSOAL`
- `Escritório`
- `Farmácia`
- `FGTS`
- `Filho`
- `Financiamento - PESSOAL`
- `Gás`
- `Gastos com dental`
- `Gastos com protético`
- `GPS - EMPRESA`
- `GPS - PESSOAL`
- `Honorários`
- `Imposto de renda`
- `Investimento - EMPRESA`
- `Investimento - PESSOAL`
- `IPTU - EMPRESA`
- `IPTU - PESSOAL`
- `IPVA`
- `ISS`
- `Juros bancários - EMPRESA`
- `Juros bancários - PESSOAL`
- `Licença RX`
- `Licenciamento`
- `Lixo hospitalar`
- `Manutenção - EMPRESA`
- `Manutenção - PESSOAL`
- `Material de consumo`
- `Oficina / Manutenção`
- `Óptica`
- `Outros impostos diretos`
- `Outros impostos Indiretos`
- `Reformas - EMPRESA`
- `Reformas - PESSOAL`
- `Retirada de pró-labore`
- `Salão de beleza`
- `Salários`
- `Saúde`
- `Seguro automóvel`
- `SEMAE - EMPRESA`
- `SEMAE - PESSOAL`
- `Software`
- `Taxas bancárias - EMPRESA`
- `Taxas bancárias - PESSOAL`
- `Telefone e Internet - EMPRESA`
- `Telefone e Internet - PESSOAL`
- `Troca de óleo`
- `UNIMED - Convênio médico`
- `Vale transporte`
- `Viagens e lazer`
- `Vigilancia Sanitária`

### Regras confirmadas pelo runtime

- O combo contém categorias de outros grupos da mesma clínica.
- O combo contém categorias de tipos diferentes do nome da origem quando o cadastro assim existir na base.
- A própria origem foi removida da lista.
- Não há opção vazia.
- A seleção automática escolhe a primeira opção disponível.
- O modal permite avançar com um destino pré-selecionado.

### Regras confirmadas pelo código legado

- O código monta o combo com `gruposCache.flatMap(...)`.
- O filtro remove apenas a categoria de origem (`x.id !== c.id`).
- Não há filtro explícito por grupo.
- Não há filtro explícito por tipo.
- Não há filtro explícito por ativo/inativo.
- Não há filtro explícito por clínica além do que já vem carregado pelo backend da sessão.
- O mesmo fluxo envia `POST /cadastros/categorias/{c.id}/migrar-e-excluir` com payload `{"categoria_destino_id": destino}`.

### Regras ainda não confirmadas

- `NÃO CONFIRMADO` se o backend interno adicional exige mesma categoria de tipo como regra suplementar.
- `NÃO CONFIRMADO` se o backend valida destino igual à origem além do bloqueio visual.
- `NÃO CONFIRMADO` se há alguma divergência de dados entre modal e persistência futura no EasyDental.

### Conclusão prática

- Destino pode estar em outro grupo: `CONFIRMADO`
- Destino precisa ter o mesmo tipo: `NÃO CONFIRMADO`
- Categoria de origem é removida do combo: `CONFIRMADO`
- Categoria inativa aparece: `NÃO CONFIRMADO`
- Confirmação sem destino: `NÃO CONFIRMADO`, porque o combo já nasce com seleção válida
- Migração é feita por um único endpoint de exclusão com migração: `CONFIRMADO` no backend atual
