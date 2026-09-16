# Contrato do Painel Financeiro de Procedimentos no frontend React

## 1. Objetivo

Fechar o contrato funcional e visual do painel financeiro do modal de Procedimentos no novo frontend React do Brana Cloude, usando o backend e o legado como fonte da verdade. Nesta etapa nao ha implementacao funcional no React.

## 2. Fonte oficial do calculo

- A fonte oficial do calculo e `backend/routes/procedimentos_routes.py`.
- A funcao central e `_calcular_financeiro_dashboard(proc, cenario, custo_material)`.
- O endpoint de consumo oficial ja existente e `GET /procedimentos/dashboard`.
- O frontend nao deve recriar as formulas de negocio quando o backend ja expuser o resultado.

## 3. Entrada de dados da funcao oficial

### Assinatura

`_calcular_financeiro_dashboard(proc: Procedimento, cenario: Cenario | None, custo_material: float) -> dict`

### Entradas lidas pela funcao

- `proc.preco`
- `proc.tempo`
- `proc.custo_lab`
- `cenario.cfpm`
- `cenario.ir`
- `cenario.cd`
- `cenario.cartao`
- `custo_material`

### Regras de normalizacao observadas no backend

- `None`, vazio e valores ausentes viram `0.0` por `float(x or 0)`.
- `tempo_grafico` usa `max(tempo, 30.0)`.
- Divisao por zero e protegida em `rendimento_proc`, `rendimento_3040`, `rendimento_1020` e `lucro_hora`.
- A funcao retorna `0.0` quando o denominador nao existe ou e zero.
- A funcao nao aplica arredondamento final; o arredondamento e responsabilidade de apresentacao.

## 4. Saida oficial do backend

O dict retornado por `_calcular_financeiro_dashboard()` contem:

- `id`
- `codigo`
- `nome`
- `preco`
- `tempo`
- `tempo_grafico`
- `lab`
- `custo_material`
- `custo_fph`
- `custo_proc`
- `ir`
- `cd`
- `cartao`
- `lucro_bruto`
- `lucro_liquido`
- `valor_minimo`
- `rendimento_proc`
- `rendimento_3040`
- `rendimento_1020`
- `rendimento`
- `lucro_hora`

### Mapeamento visual recomendado no React

| Campo visual | Chave backend | Origem | Observacao |
| --- | --- | --- | --- |
| CFPH | `custo_fph` | backend | custo por hora do procedimento |
| Mat. Consumo | `custo_material` | backend | custo total dos materiais vinculados |
| Custo R$ | `custo_proc` | backend | custo total do procedimento |
| Imposto | `ir` | backend | valor monetario calculado |
| Comissao CD | `cd` | backend | valor monetario calculado |
| Taxa Cartao | `cartao` | backend | valor monetario calculado |
| Valor Minimo | `valor_minimo` | backend | valor monetario minimo sugerido |
| Lucro Bruto | `lucro_bruto` | backend | preco menos custo total |
| Lucro Liquido | `lucro_liquido` | backend | lucro apos taxas |
| Rendimento % | `rendimento_proc` | backend | espelha o rendimento bruto oficial exposto pelo backend |
| Bom 30 a 40% | `rendimento_3040` | backend | indicador percentual |
| Bom 10 a 20% | `rendimento_1020` | backend | indicador percentual |
| Lucro por hora | `lucro_hora` | backend | valor por hora do procedimento |

## 5. Formulas confirmadas no backend

- `custo_fph = cfpm * tempo`
- `custo_proc = custo_fph + custo_material + lab`
- `valor_ir = preco * ir_pct / 100`
- `valor_cd = preco * cd_pct / 100`
- `valor_cartao = preco * cartao_pct / 100`
- `lucro_bruto = preco - custo_proc`
- `lucro_liquido = lucro_bruto - (valor_ir + valor_cd + valor_cartao)`
- `rendimento_proc = lucro_bruto * 100 / custo_proc` quando `custo_proc > 0`, senao `0.0`
- `rendimento_3040 = lucro_bruto * 100 / preco` quando `preco > 0`, senao `0.0`
- `rendimento_1020 = lucro_liquido * 100 / preco` quando `preco > 0`, senao `0.0`
- `rendimento = rendimento_1020`
- `lucro_hora = lucro_liquido * 60 / tempo` quando `tempo > 0`, senao `0.0`
- `valor_minimo = custo_proc + valor_ir + valor_cd + valor_cartao + (custo_proc * 10 / 100)`

## 6. Contrato visual do painel

### Estrutura

- Painel read-only no lado direito do modal de Procedimentos.
- Nao deve permitir edicao direta dos valores calculados.
- Nao deve duplicar formulas no React.
- Deve manter o visual compacto do modal, sem virar tela propria.

### Estados visuais

- Carregando: exibir estado neutro ate o backend responder.
- Erro: exibir mensagem curta e manter o modal utilizavel.
- Dados incompletos: exibir `0,00` ou `-` conforme o padrao do modulo, sem inventar calculo.

### Formato sugerido

- Valores monetarios: BRL com duas casas.
- Percentuais: percentual com duas casas.
- Numero de horas/tempo: conforme o padrao do restante do modal.

## 7. Fluxo de atualizacao

- Ao abrir o modal em modo novo ou alteracao, o painel financeiro deve pedir os dados ja calculados ao backend quando houver suporte de leitura.
- Ao mudar campos que afetam o calculo, o frontend deve apenas acionar recarga do dado oficial ou reaproveitar a resposta oficial, nao recomputar a formula no cliente.
- O painel deve atualizar sem recarregar a pagina inteira.
- O frontend nao deve disparar loop de requisicoes.

## 8. Dependencias funcionais

- Procedimento gravado ou em edicao.
- Tabela ativa.
- Cenario financeiro da clinica.
- Custo de materiais vinculados.
- Dados de tempo, preco e custo de laboratorio.

## 9. Contrato de consumo no React

- Reaproveitar o endpoint oficial existente.
- Criar separacao modular para busca/formatacao de dados financeiros.
- Nao duplicar formulas dentro de `ProcedimentoFinanceiroPanel.jsx`.
- Nao montar valores artificiais caso o backend nao tenha retornado o calculo.

## 10. Itens que permanecem fora do escopo

- Alterar backend.
- Alterar banco.
- Alterar formulas.
- Criar endpoint novo sem necessidade comprovada.
- Criar mock de calculo no frontend.

## 11. Conclusao

Ha informacao suficiente para implementar o painel financeiro no React consumindo a fonte oficial do backend. O contrato fecha as chaves visuais, as formulas, as regras de zero e a estrategia de apresentacao sem recalcular no cliente.
## 13. Status operacional

- Esta frente ja esta consumindo o dashboard oficial no React.
- A renderizacao do painel e read-only e nao recalcula formulas no cliente.
- O estado vazio em `Nova intervencao` permanece neutro.

## 14. Ajuste visual consolidado

- A apresentacao do Painel Financeiro foi consolidada em layout compacto de 3 colunas.
- O texto tecnico de origem oficial nao deve aparecer na interface do modal.
- Os indicadores `Bom 30 a 40%` e `Bom 10 a 20%` permanecem com destaque discreto em verde.
- Nenhuma formula, endpoint ou payload foi alterado nesta consolidacao visual.

## 15. Rastreabilidade do Valor Minimo

- Os percentuais de `ir`, `cd` e `cartao` chegam ao painel a partir de `GET /cenario`.
- O React nao envia esses percentuais no `POST /procedimentos/dashboard-preview`; o backend os busca pela `clinica_id`.
- O card `Valor Minimo` hoje reflete o resultado oficial do backend.
- A formula historica desejada para comparacao documental e:
  `custo_proc + (custo_proc * ir / 100) + (custo_proc * cd / 100) + (custo_proc * cartao / 100) + (custo_proc * 10 / 100)`
- O backend foi ajustado para reaplicar `ir`, `cd` e `cartao` sobre `custo_proc`, alinhando o `Valor Minimo` ao contrato historico.
