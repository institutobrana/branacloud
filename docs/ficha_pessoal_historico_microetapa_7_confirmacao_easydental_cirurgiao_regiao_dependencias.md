# Ficha Pessoal - Historico - Microetapa 7 - confirmacao EasyDental de Cirurgiao, Regiao e dependencias

## Objetivo

Consolidar a leitura documental do EasyDental real sobre o campo de `Cirurgiao responsavel`, a possivel origem do combo ou da lista, a editabilidade do valor, o papel de `Regiao` e as dependencias com prestador, tratamento e paciente.

Esta microetapa e exclusivamente documental e investigativa. Nao altera frontend, backend, banco, schema, migration, seed, endpoint, model ou persistencia do Brana Cloud.

## Fontes investigadas

- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\Dados\eds70.sql`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\Dados\auxiliares_easydental_seed.json`
- `\\Dell_servidor\c\EDS70\Textos`
- `\\Dell_servidor\c\EDS70\Reports`
- `\\Dell_servidor\c\EDS70\Objetos`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\ficha_pessoal_historico_easydental_engenharia_reversa.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\ficha_pessoal_historico_easydental_vs_brana_comparativo_detalhado.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\ficha_pessoal_historico_microetapa_3_cirurgiao_regiao_auditoria.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\ficha_pessoal_historico_microetapa_4_contrato_local_origem_cirurgiao_regiao.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\ficha_pessoal_historico_microetapa_5_avaliacao_sugestao_local_cirurgiao_regiao.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\ficha_pessoal_historico_microetapa_6_reclassificacao_funcional_dependencias.md`

## O que foi confirmado no legado

### Tabela e dependencias base

- A tabela `HISTORICO` existe no EasyDental legado.
- A linha do historico pertence ao paciente via `HISTORICO.NROPAC -> PESSOAL.NROPAC`.
- A linha pode ficar vinculada a uma intervencao via `HISTORICO.NROINTPAC -> INTERVENCAO.NROINTPAC`.
- O profissional responsavel e modelado por `HISTORICO.ID_PRESTADOR -> PRESTADOR.ID_PRESTADOR`.
- Existe indice por paciente e data, o que reforca a leitura de consulta clinica por historico do paciente.

### Cirurgiao responsavel

- O mapeamento tecnico mais forte continua sendo `Cirurgiao responsavel -> ID_PRESTADOR`.
- A leitura funcional mais consistente e a de executante do procedimento.
- O usuario informou que ha muitos historicos com prestadores diferentes, o que reforca a ideia de um campo relacional e nao de texto livre isolado.

### Regiao

- O mapeamento tecnico mais forte continua sendo `Regiao -> NRODENTE`.
- O papel funcional segue ligado a uma estrutura odontologica curta, provavelmente relacionada ao dente/regiao do procedimento.

## O que nao foi confirmado nas fontes acessiveis

### Default ou auto-preenchimento

- Nao foi localizado, nas fontes legiveis acessiveis, um artefato visual que prove se `Cirurgiao responsavel` entra preenchido por default ao abrir a tela.
- Nao foi localizado, nas fontes legiveis acessiveis, um artefato visual que prove se o valor e herdado da intervencao, do prestador do atendimento ou de outro contexto.
- Portanto, o auto-preenchimento permanece como **nao confirmado**.

### Origem do combo ou lista

- Nao foi localizado, nas fontes legiveis acessiveis, o contrato visual da tela original que prove se `Cirurgiao responsavel` vem de combo, lookup, lista fixa ou texto livre assistido.
- Nao foi localizado, nas fontes legiveis acessiveis, o contrato visual da tela original que prove a origem de `Regiao`.
- Portanto, a origem visual do combo/lista permanece como **nao encontrada**.

### Editabilidade visual no EasyDental

- Nao foi localizado, nas fontes legiveis acessiveis, um artefato visual que prove a regra exata de edicao da linha de `Cirurgiao responsavel`.
- Nao foi localizado, nas fontes legiveis acessiveis, um artefato visual que prove a regra exata de edicao de `Regiao`.
- Portanto, a editabilidade visual exata do legado permanece como **nao encontrada** nas fontes consultadas.

## Leitura funcional mais segura

- `Cirurgiao responsavel` deve ser tratado como o campo do prestador/executante do procedimento.
- `Regiao` deve ser tratado como um campo odontologico dependente de validacao adicional.
- A dependencia com tratamento esta confirmada pela ligacao com `INTERVENCAO`.
- A dependencia com paciente esta confirmada pela ligacao com `PESSOAL`.
- A dependencia com prestador esta confirmada pela ligacao com `PRESTADOR`.

## Implicacoes para o Brana Cloud

- O Brana ja possui o Historico como grade local com `Data`, `Cirurgiao`, `Regiao` e `Descricao`.
- O Brana ainda nao comprovou, por fonte visual do EasyDental, a existencia de auto-preenchimento ou de combo externo para `Cirurgiao responsavel`.
- O Brana tambem nao comprovou a necessidade de um modulo externo especifico para `Regiao`, embora essa possibilidade permaneça em aberto.
- Se o usuario trouxer um novo modulo ou uma nova evidencia visual, o ciclo pode ser fechado com mais seguranca.

## Classificacao final desta microetapa

### Cirurgiao responsavel

- **Alvo funcional do legado: confirmado como prestador/executante**
- **Auto-preenchimento: nao confirmado**
- **Origem do combo/lista: nao encontrada**
- **Editabilidade visual exata no legado: nao encontrada**

### Regiao

- **Alvo funcional tecnico: fortemente provavel como NRODENTE**
- **Role funcional: ainda depende de confirmacao adicional**
- **Origem do combo/lista: nao encontrada**
- **Editabilidade visual exata no legado: nao encontrada**

### Dependencias

- **Paciente: confirmado**
- **Tratamento / intervencao: confirmado**
- **Prestador / executante: confirmado**
- **Modulo externo para Regiao: ainda em aberto**

## Recomendacao

- Comunicar ao usuario que `Cirurgiao responsavel` ja tem alvo funcional bastante claro no legado, mas que o auto-preenchimento e a origem visual do controle continuam sem prova acessivel.
- Comunicar ao usuario que `Regiao` segue dependente de validacao adicional e pode exigir novo modulo ou nova regra local.
- Se o usuario fornecer uma nova evidencia visual ou um modulo de apoio, abrir a proxima frente somente para fechar a dependencia pendente, sem mexer no restante do Historico.

## Confirmacao de ausencia de alteracao funcional

- Nao houve alteracao de selecao.
- Nao houve alteracao de inserir.
- Nao houve alteracao de editar.
- Nao houve alteracao de eliminar.
- Nao houve alteracao de `TAB` / `Shift+TAB`.
- Nao houve alteracao de `ENTER` / `ESC`.
- Nao houve alteracao da persistencia via `extra.historico_aba`.
- Nao houve alteracao do modal funcional de `Propriedades da linha`.

## Confirmacao de ausencia de alteracao de backend/banco

- Nao houve alteracao de backend.
- Nao houve alteracao de banco, schema, migration, seed ou endpoint.

## Como testar no sistema

1. Abrir a Ficha Pessoal.
2. Selecionar um paciente.
3. Entrar na aba Historico.
4. Conferir se o campo `Cirurgiao` continua representando o executante do procedimento.
5. Conferir se `Regiao` continua dependente de confirmacao adicional.
6. Validar se existe qualquer auto-preenchimento real no EasyDental para `Cirurgiao responsavel`.
7. Validar se a origem visual e de combo/lista da tela pode ser observada em nova evidencia.
8. Confirmar que nenhuma outra aba da Ficha Pessoal foi afetada.

## Conclusao

A leitura documental confirma com boa seguranca que `Cirurgiao responsavel` se relaciona ao prestador/executante e que a aba Historico depende de paciente, intervencao e prestador. O que ainda nao foi provado nas fontes acessiveis e o default/auto-preenchimento, a origem visual do controle e a forma exata de edicao no EasyDental real. `Regiao` segue com dependencia funcional em aberto e pode precisar de novo modulo ou nova evidencia para fechar a equivalencia.
