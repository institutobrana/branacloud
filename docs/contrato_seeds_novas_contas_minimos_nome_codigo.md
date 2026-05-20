# Contrato funcional - seeds de novas contas

## Finalidade
Este documento define a regra futura desejada para o nascimento de novas contas e novas clinicas no Brana Cloud.

Ele nao implementa nada. Ele serve como contrato funcional antes de qualquer alteracao de codigo.

## Regra principal
Todas as novas contas/clinicas, inclusive contas demo/trial de 7 dias, devem nascer com seeds sanitizados.

Nao deve existir excecao para conta demo carregar:
- precos;
- custos;
- fases;
- materiais vinculados;
- composicoes prontas;
- heranca automatica pronta com dados sensiveis.

## Base documental
Este contrato foi elaborado com base na auditoria:
- `docs/auditoria_seeds_novas_contas_procedimentos_materiais.md`

## Escopo
Aplica-se apenas ao nascimento de novas contas e novas clinicas.

Nao trata de:
- alteracao de dados de clinicas existentes;
- atualizacao de cadastros ja criados;
- frontend;
- modularizacao;
- correcao textual/mojibake;
- migracoes;
- scripts de banco;
- rotina manual de backfill;
- alteracao de regra comercial da conta demo/trial para outros fluxos.

## Contrato de nascimento

### 1. Procedimentos
Novos procedimentos devem nascer mantendo somente:
- `codigo`, se existir;
- `nome`;
- campos obrigatorios tecnicos exigidos pelo schema, como `clinica_id` e `tabela_id`.

Nao devem nascer com:
- preco;
- custo;
- custo de material;
- custo de laboratorio;
- lucro;
- margem;
- tempo/duracao;
- garantia;
- valor de repasse;
- especialidade, se nao for obrigatoria;
- simbolo grafico, se nao for obrigatorio;
- observacoes;
- `procedimento_generico_id`;
- materiais vinculados;
- fases;
- composicao pronta;
- qualquer campo financeiro/tecnico nao obrigatorio.

### 1.1 Tabela PARTICULAR em novas contas
A tabela de preco `PARTICULAR` deve continuar sendo criada no nascimento de novas contas e pode continuar vindo com os 336 procedimentos esperados.

Para esses procedimentos da `PARTICULAR`, os campos financeiros devem nascer zerados:
- `preco = 0.0`;
- `custo = 0.0`;
- `custo_lab = 0.0`;
- `lucro_hora = 0.0`;
- `valor_repasse = 0.0`;
- `garantia_meses = 0`.

O campo `forma_cobranca` deve ser preservado.

Devem ser preservados tambem:
- `codigo`;
- `nome`;
- `clinica_id`;
- `tabela_id`;
- `procedimento_generico_id`;
- `simbolo_grafico`;
- `simbolo_grafico_legacy_id`;
- `mostrar_simbolo`;
- `preferido`;
- `inativo`.

Nao deve haver atualizacao retroativa de contas existentes.
Se o procedimento ja existir por `clinica_id + tabela_id + codigo`, o fluxo deve ignorar e nao atualizar.
Essa regra vale apenas para novos nascimentos de conta/clinica e nao deve sobrescrever valores reais editados por usuarios.

### 2. Materiais
Novos materiais devem nascer mantendo somente:
- `codigo`, se existir;
- `nome`;
- campos obrigatorios tecnicos exigidos pelo schema, como `lista_id`.

Nao devem nascer com:
- custo;
- preco;
- relacao;
- validade;
- unidade, se nao for obrigatoria;
- classificacao, se nao for obrigatoria;
- fabricante;
- estoque;
- qualquer campo financeiro/tecnico nao obrigatorio.

### 3. Procedimentos genericos
Novos procedimentos genericos devem nascer mantendo somente:
- `codigo`, se existir;
- `descricao`/`nome`;
- `clinica_id`;
- campos obrigatorios tecnicos exigidos pelo schema.

Nao devem nascer com:
- tempo;
- custo;
- peso;
- simbolo grafico, se nao for obrigatorio;
- especialidade, se nao for obrigatoria;
- observacoes;
- materiais vinculados;
- fases;
- composicoes;
- heranca automatica pronta.

### 4. Tabelas de vinculo/fase/composicao
Para novas contas, devem nascer vazias:
- `procedimento_material`;
- `procedimento_fase`;
- `procedimento_generico_material`;
- `procedimento_generico_fase`;
- tabelas equivalentes, se existirem.

Se algum vinculo for obrigatorio por schema, isso deve ser tratado como excecao tecnica documentada, com justificativa clara.

## Escopo negativo
Este contrato nao permite:
- alterar dados de clinicas existentes;
- executar `UPDATE`/`DELETE` em dados atuais;
- mexer em frontend;
- mexer em modularizacao;
- corrigir textos/mojibake;
- alterar a regra comercial da demo/trial de 7 dias;
- criar fluxo separado em que demo receba dados completos;
- criar excecao funcional que mantenha seeds sensiveis para qualquer conta nova.

## Plano de implementacao futura
Recomenda-se executar em subetapas pequenas e conservadoras:

### Subetapa 1A - procedimentos padrao
- reduzir o seed de procedimentos ao minimo funcional;
- manter apenas identificacao e campos tecnicos obrigatorios;
- nao afetar clinicas existentes.

### Subetapa 1B - signup_service se necessario
- ajustar apenas o ponto de nascimento de novas contas, se o seed sozinho nao bastar;
- manter o impacto restrito ao signup de novas contas;
- nao alterar fluxos de edicao nem retroalimentacao de dados existentes.

### Subetapa 2A - materiais
- sanitizar o seed de materiais para novos nascimentos;
- manter apenas identificacao e campos tecnicos obrigatorios.

### Subetapa 3A - procedimentos genericos
- sanitizar o seed de procedimentos genericos;
- nao carregar valores financeiros ou composicoes prontas.

### Subetapa 4A - impedir vinculos/fases/composicoes automaticas
- impedir que novas contas nascam com vinculos, fases ou composicoes automatizadas;
- impedir heranca sensivel no momento do nascimento da conta;
- manter a criacao manual posterior funcionando para edicao individual.

### Subetapa 5A - teste em ambiente seguro
- criar nova conta de teste em ambiente controlado;
- validar os cadastros nas telas de Procedimentos, Materiais e Procedimentos Genericos;
- confirmar ausencia de dados sensiveis no nascimento;
- validar edicao manual e reabertura sem erros.

## Excecoes tecnicas
Se algum campo sensivel for exigido pelo schema, a excecao deve ser:
- minima;
- documentada;
- justificada por obrigacao tecnica, nao comercial;
- limitada ao estritamente necessario para persistencia.

## Critério funcional final
Uma nova conta/clinca estara conforme este contrato quando:
- procedimentos nascerem sem campos financeiros e sem composicao herdada;
- materiais nascerem sem custo/preco/relacao sensiveis;
- procedimentos genericos nascerem sem fases, materiais ou heranca automatica pronta;
- tabelas de vinculo/composicao/fase estiverem vazias no nascimento;
- a conta demo/trial seguir exatamente o mesmo padrao sanitizado das demais novas contas.

## Confirmacoes finais
- Este documento e somente um contrato funcional.
- Este documento nao altera codigo.
- Este documento nao altera seeds.
- Este documento nao altera banco.
- Este documento nao altera frontend.
- Este documento nao altera rotas.
- Este documento nao altera comportamento.
