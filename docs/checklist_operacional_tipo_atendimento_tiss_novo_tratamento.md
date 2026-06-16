# Checklist operacional - Tipo de atendimento (TISS) do modal `Novo tratamento`

## 1. Identificacao

Produto: Brana Cloude

Modulo: Tratamento

Tela: `Menu Tratamento -> Novo tratamento`

Area: aba `Convenio`, combo `Tipo de atendimento (TISS)`

Natureza deste documento: checklist operacional de implementacao segura

Status: documental e preparatorio

## 2. Objetivo do checklist

Este checklist transforma a ordem de execucao em passos praticos, pequenos e verificaveis.

O foco e corrigir a origem do combo `Tipo de atendimento (TISS)` com o menor risco possivel, sem regredir outros combos da aba `Convenio` e sem alterar a aba `Principal`.

## 3. Documentos que precisam ser respeitados antes de executar

- `docs/contrato_tecnico_tipo_atendimento_tiss_novo_tratamento.md`
- `docs/inventario_tipo_atendimento_tiss_novo_tratamento.md`
- `docs/ordem_execucao_tipo_atendimento_tiss_novo_tratamento.md`
- `docs/contrato_layout_comportamento_tela_novo_tratamento.md`
- `docs/contrato_tecnico_modulo_tratamento.md`

Este checklist nao substitui nenhum deles.

## 4. Escopo permitido

- identificar a fronteira tecnica atual do combo;
- criar uma fonte propria para `tipo de atendimento TISS`, se necessario;
- trocar apenas a origem do combo no backend;
- manter o frontend como consumidor da lista;
- validar persistencia e reabertura;
- registrar riscos e pendencias.

## 5. Escopo proibido

- alterar a toolbar;
- alterar a aba `Principal`;
- alterar odontograma;
- alterar financeiro;
- alterar agenda;
- criar backend novo sem necessidade;
- refatorar `frontend/app.js` de forma ampla;
- usar `tiss_tipo_tabela` como se fosse o mesmo conceito do legado;
- mudar o payload inteiro do modal sem justificativa.

## 6. Checklist de execucao

### 6.1 Preparacao e confirmacao de fronteira

- confirmar o contrato tecnico do TISS;
- confirmar o inventario de lacunas;
- confirmar a ordem de execucao;
- localizar onde o backend monta `tipos_tiss`;
- localizar onde o frontend consome `payload.tipos_tiss`;
- confirmar que o tratamento ja possui `tipo_atendimento_tiss_id` e `tipo_atendimento_tiss_nome`.

Teste esperado:

- o ponto de troca fica claro;
- nenhuma mudanca ainda em runtime;
- a origem atual da lista fica documentada.

### 6.2 Definir a fonte correta

- decidir como o Brana Cloude representara o catalogo legado de atendimento TISS;
- escolher entre tabela propria, seed controlada ou service de catalogo;
- evitar reaproveitar `tiss_tipo_tabela`;
- fechar a lista dos cinco valores do legado.

Teste esperado:

- existe uma decisao tecnica unica para a origem;
- os cinco itens ficam definidos sem ambiguidade;
- a fonte nova nao conflita com o tipo de tabela TISS.

### 6.3 Criar a fonte sem plugar a tela ainda

- criar a fonte de dados em backend de forma aditiva;
- manter a tela usando o comportamento antigo por enquanto;
- expor os cinco itens do legado no backend;
- validar a ordenacao da lista;
- manter a persistencia ainda inalterada.

Teste esperado:

- o backend retorna os cinco itens corretos;
- a aplicacao continua abrindo normalmente;
- nenhum outro combo muda.

### 6.4 Trocar apenas a origem do combo

- substituir apenas o provedor de `tipos_tiss` na rota de filtros do tratamento;
- manter o formato do payload estavel;
- evitar mudancas paralelas em outros campos da aba `Convenio`;
- manter o frontend consumindo a lista sem suposicao errada.

Teste esperado:

- o combo mostra os cinco itens do legado;
- a lista errada deixa de aparecer;
- os demais campos da aba `Convenio` continuam iguais.

### 6.5 Validar persistencia e reabertura

- salvar um tratamento usando o novo combo;
- reabrir o mesmo tratamento;
- conferir `tipo_atendimento_tiss_id`;
- conferir `tipo_atendimento_tiss_nome`;
- confirmar que o default de novo tratamento continua correto.

Teste esperado:

- o valor salvo reaparece corretamente;
- a edicao funciona sem perda de compatibilidade;
- o default novo continua previsivel.

### 6.6 Validacao manual final

- abrir a aplicacao autenticada;
- abrir `Tratamento -> Novo tratamento`;
- ir para a aba `Convenio`;
- conferir o combo;
- testar selecao de item;
- salvar;
- reabrir;
- conferir o valor persistido;
- revisar o console do navegador.

Teste esperado:

- nenhum erro novo;
- nenhum desvio visual relevante;
- o combo fica equivalente ao legado para este campo.

## 7. Criterio para liberar a proxima etapa

So avancar quando:

- a lista correta estiver no combo;
- a persistencia estiver confirmada;
- a reabertura estiver correta;
- nenhum outro combo relevante tiver sido alterado;
- o console do navegador estiver limpo nos caminhos testados.

## 8. Sinal de alerta

Se qualquer item abaixo acontecer, a execucao deve parar:

- o combo continuar mostrando a lista errada;
- o valor salvo nao reaparecer;
- outro combo da aba `Convenio` mudar sem necessidade;
- o modal nao abrir;
- o console acusar erro novo;
- a origem ficar ambigua entre `tipo_tiss` e `tipo_tiss_tabela`.

## 9. Resultado esperado deste checklist

Ao final desta trilha, o combo `Tipo de atendimento (TISS)` deve:

- usar a origem correta;
- mostrar exatamente os cinco valores do EasyDental;
- continuar salvando e reabrindo corretamente;
- nao afetar outros comportamentos do modal;
- ficar pronto para consolidacao documental futura.
