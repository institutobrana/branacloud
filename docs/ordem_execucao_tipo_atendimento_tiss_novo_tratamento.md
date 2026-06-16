# Ordem de execucao - Tipo de atendimento (TISS) do modal `Novo tratamento`

## 1. Identificacao

Produto: Brana Cloude

Modulo: Tratamento

Tela: `Menu Tratamento -> Novo tratamento`

Area: aba `Convenio`, combo `Tipo de atendimento (TISS)`

Natureza deste documento: ordem tecnica de execucao

Status: documental apenas

## 2. Objetivo da ordem

Esta ordem existe para quebrar a correcao do combo `Tipo de atendimento (TISS)` em passos pequenos, verificaveis e reversiveis antes de qualquer implementacao.

O foco e trocar a origem dos itens sem regredir os demais combos da aba `Convenio`, sem afetar a aba `Principal` e sem mexer em outros modulos do sistema.

## 3. Documentos que precisam ser respeitados antes de executar

- `docs/contrato_tecnico_tipo_atendimento_tiss_novo_tratamento.md`
- `docs/inventario_tipo_atendimento_tiss_novo_tratamento.md`
- `docs/contrato_layout_comportamento_tela_novo_tratamento.md`
- `docs/contrato_tecnico_modulo_tratamento.md`

Esta ordem nao substitui nenhum deles.

Ela apenas organiza o passo a passo recomendado.

## 4. Ordem de execucao proposta

### Subetapa 1 - confirmar a fronteira tecnica atual

Objetivo:

- localizar exatamente onde o backend monta `tipos_tiss`;
- localizar exatamente onde o frontend consome `payload.tipos_tiss`;
- confirmar que o tratamento ja possui `tipo_atendimento_tiss_id` e `tipo_atendimento_tiss_nome`;
- confirmar que nao existe ainda uma fonte propria equivalente a `_TISS_TIPO_ATENDIMENTO`.

Arquivos esperados para a implementacao futura:

- `backend/routes/tratamentos_routes.py`
- `backend/models/tratamento.py`
- `frontend/js/modules/novo-tratamento-modal.js`

Teste esperado depois desta subetapa:

- conseguir explicar, sem ambiguidade, de onde sai a lista atual;
- conseguir apontar o ponto exato de troca sem alterar comportamento;
- confirmar que a implementacao ainda nao mudou nada em runtime.

### Subetapa 2 - definir a fonte correta do catalogo

Objetivo:

- decidir como o Brana Cloude vai representar a lista legada de atendimento TISS;
- fechar se a origem sera tabela propria, seed controlada ou service de catalogo;
- evitar reaproveitar `tiss_tipo_tabela` por engano.

Arquivos esperados para a implementacao futura:

- `backend/models/`
- `backend/scripts/`
- `backend/routes/tratamentos_routes.py`
- possivel novo service de catalogo, se necessario

Teste esperado depois desta subetapa:

- existir uma decisao tecnica unica para a fonte;
- ficar claro como cada um dos cinco itens sera identificado;
- nao haver duplicidade de semantica com `tiss_tipo_tabela`.

### Subetapa 3 - criar a fonte do catalogo sem plugar na tela ainda

Objetivo:

- criar a fonte nova de forma aditiva e isolada;
- garantir que a lista do legado esteja disponivel no backend antes de trocar o consumo do frontend;
- nao mexer ainda na tela do modal.

Arquivos esperados para a implementacao futura:

- `backend/models/`
- `backend/scripts/`
- `backend/routes/tratamentos_routes.py`

Teste esperado depois desta subetapa:

- a nova fonte retornar os cinco itens do legado;
- a ordenacao refletir o comportamento esperado;
- o backend expor os dados sem afetar outras listas TISS;
- o app continuar abrindo normalmente.

### Subetapa 4 - trocar apenas a origem do combo no backend

Objetivo:

- substituir o provedor de `tipos_tiss` na rota de filtros do tratamento;
- manter o formato do payload o mais estavel possivel;
- nao alterar o restante do modal.

Arquivos esperados para a implementacao futura:

- `backend/routes/tratamentos_routes.py`

Teste esperado depois desta subetapa:

- a rota de filtros devolver a lista nova do tipo de atendimento TISS;
- o frontend continuar recebendo `payload.tipos_tiss` sem quebrar;
- outros combos continuarem intactos;
- a tela abrir sem erro.

### Subetapa 5 - ajustar o frontend para consumir sem suposicao errada

Objetivo:

- garantir que o modal apenas renderize a lista recebida;
- evitar fallback indevido para `tiss_tipo_tabela`;
- manter o default visual correto.

Arquivos esperados para a implementacao futura:

- `frontend/js/modules/novo-tratamento-modal.js`

Teste esperado depois desta subetapa:

- o combo exibir exatamente os cinco itens do legado;
- o primeiro item/padrao esperado aparecer ao abrir um novo tratamento;
- a troca manual de item funcionar;
- nenhum outro combo da aba `Convenio` mudar.

### Subetapa 6 - validar persistencia e reabertura

Objetivo:

- confirmar que o valor selecionado continua sendo salvo em `tipo_atendimento_tiss_id` e `tipo_atendimento_tiss_nome`;
- confirmar que a edicao reabre com o valor correto;
- confirmar que o tratamento antigo nao perde compatibilidade.

Arquivos esperados para a implementacao futura:

- `backend/routes/tratamentos_routes.py`
- `backend/models/tratamento.py`
- `frontend/js/modules/novo-tratamento-modal.js`

Teste esperado depois desta subetapa:

- salvar um tratamento com o novo tipo de atendimento;
- reabrir o mesmo tratamento;
- ver o valor reaparecer corretamente;
- confirmar que o default de novo cadastro nao foi afetado.

### Subetapa 7 - validacao manual final em sessao autenticada

Objetivo:

- validar o fluxo completo em ambiente local autenticado;
- conferir o combo, o default, a edicao e a reabertura;
- confirmar ausencia de regressao em campos correlatos.

Arquivos esperados para a implementacao futura:

- todos os afetados nas subetapas anteriores

Teste esperado depois desta subetapa:

- abrir o modal `Novo tratamento`;
- navegar para a aba `Convenio`;
- ver o combo correto;
- selecionar outro item;
- salvar;
- reabrir e conferir o valor persistido;
- confirmar que os outros combos TISS continuam intactos.

## 5. Sequencia recomendada de validacao

Depois de cada subetapa, a validacao minima deve seguir esta ordem:

1. abrir a aplicacao;
2. confirmar login;
3. abrir `Tratamento -> Novo tratamento`;
4. validar a aba `Convenio`;
5. testar o combo `Tipo de atendimento (TISS)`;
6. conferir o console do navegador;
7. seguir apenas se a etapa anterior estiver estável.

## 6. O que nao pode acontecer durante esta correcao

- reutilizar `tiss_tipo_tabela` como se fosse o mesmo conceito;
- alterar o payload inteiro do modal sem necessidade;
- mexer em outros combos da aba `Convenio`;
- mexer na aba `Principal`;
- refatorar `frontend/app.js` por oportunidade;
- criar backend novo desnecessario;
- misturar esta trilha com toolbar, odontograma ou editor de textos;
- considerar a correcao concluida sem teste manual real.

## 7. Criterio para passar de uma subetapa para a seguinte

So avancar quando:

- a tela continuar abrindo;
- o comportamento anterior estiver preservado;
- o teste esperado da subetapa tiver sido executado;
- nenhuma regressao funcional tiver surgido;
- o fallback existente continuar controlado enquanto a transicao nao estiver completa.

## 8. Resultado esperado desta ordem

Ao final desta sequencia, o combo `Tipo de atendimento (TISS)` deve:

- usar a origem correta;
- mostrar os cinco itens do legado;
- manter persistencia consistente;
- reabrir com o valor salvo;
- nao afetar outros campos da aba `Convenio`;
- ficar pronto para consolidacao documental posterior.
