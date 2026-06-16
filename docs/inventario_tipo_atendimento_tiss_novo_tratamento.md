# Inventario de lacunas - Tipo de atendimento (TISS) do modal `Novo tratamento`

## 1. Objetivo

Listar, de forma operacional e segura, as lacunas entre o comportamento atual do Brana Cloude e o comportamento observado no EasyDental para o combo `Tipo de atendimento (TISS)` da aba `Convenio` do modal `Novo tratamento`.

Este documento nao implementa nada.

Este documento nao altera backend, frontend, banco, seeds, migrations ou regras de persistencia.

## 2. Origem da comparacao

### 2.1 EasyDental

Referencia observada:

- arquivo SQL: `Y:\EDS70\Dados\eds75_build_0809_2.sql`
- tabela legado: `_TISS_TIPO_ATENDIMENTO`

Valores observados:

- `Tratamento Odontológico`
- `Exame Radiológico`
- `Ortodontia`
- `Urgênica/Emergência`
- `Auditoria`

### 2.2 Brana Cloude

Arquivos e pontos atuais do Brana Cloude:

- `backend/routes/tratamentos_routes.py`
- `backend/models/tiss_tipo_tabela.py`
- `backend/models/tratamento.py`
- `frontend/js/modules/novo-tratamento-modal.js`

## 3. Resumo executivo

O Brana Cloude possui o campo de tratamento:

- `tipo_atendimento_tiss_id`
- `tipo_atendimento_tiss_nome`

Mas a fonte que alimenta o combo hoje nao corresponde ao catalogo legado ` _TISS_TIPO_ATENDIMENTO`.

Portanto, a lacuna principal nao e a ausencia do campo de persistencia.

A lacuna principal e a origem dos dados exibidos ao usuario.

## 4. Matriz de lacunas

### 4.1 Lacuna de origem de dados

- **Estado atual**: o combo usa uma lista derivada de `tiss_tipo_tabela`.
- **Estado desejado**: o combo deve usar uma lista equivalente a `_TISS_TIPO_ATENDIMENTO`.
- **Risco**: alto, porque os itens exibidos hoje nao batem com o legado.
- **Dependencia**: backend precisa expor a fonte correta.
- **Prioridade**: alta.

### 4.2 Lacuna de equivalencia semantica

- **Estado atual**: o nome do campo sugere `tipo de atendimento`, mas a lista atual representa `tipo de tabela`.
- **Estado desejado**: cada item deve refletir o significado clinico/operacional do legado.
- **Risco**: medio/alto, porque o usuario pode salvar um valor semanticamente errado.
- **Dependencia**: mapeamento claro entre id, codigo e nome.
- **Prioridade**: alta.

### 4.3 Lacuna de catalogo

- **Estado atual**: nao existe ainda um catalogo proprio no Brana para os cinco itens do legado.
- **Estado desejado**: catalogo proprio de `tipo de atendimento TISS`.
- **Risco**: alto, porque sem catalogo a origem continuara errada.
- **Dependencia**: definicao de tabela, seed ou service de catalogo.
- **Prioridade**: alta.

### 4.4 Lacuna de ordenacao

- **Estado atual**: a ordem atual pode seguir o id da tabela atual, que nao e a mesma ordem do legado.
- **Estado desejado**: ordem igual ao EasyDental.
- **Risco**: medio, porque ordem errada gera divergencia visual e funcional.
- **Dependencia**: backend precisa expor a lista ordenada corretamente.
- **Prioridade**: media.

### 4.5 Lacuna de valor padrao

- **Estado atual**: o modal pode cair em fallback da lista existente.
- **Estado desejado**: `Tratamento Odontológico` como padrao para novo tratamento, salvo regra de edicao.
- **Risco**: medio, porque o default errado induz cadastro inconsistente.
- **Dependencia**: regra de default no backend e no frontend.
- **Prioridade**: alta.

### 4.6 Lacuna de salvamento

- **Estado atual**: o tratamento grava `tipo_atendimento_tiss_id` e `tipo_atendimento_tiss_nome`.
- **Estado desejado**: continuar gravando esses campos, mas com a fonte correta.
- **Risco**: medio, porque mudar a origem sem preservar persistencia quebra edicao futura.
- **Dependencia**: manter contrato de payload e model.
- **Prioridade**: alta.

### 4.7 Lacuna de reabertura em edicao

- **Estado atual**: a tela precisa reabrir com o valor salvo, mas isso depende da coerencia do catalogo.
- **Estado desejado**: reabrir com o item certo, mesmo apos a mudanca de fonte.
- **Risco**: medio, por possivel incompatibilidade entre id antigo e catalogo novo.
- **Dependencia**: estrategia de compatibilidade ou resolucao por codigo/nome.
- **Prioridade**: alta.

### 4.8 Lacuna de separacao entre catálogos TISS

- **Estado atual**: `tiss_tipo_tabela` atende o fluxo de tipo de tabela.
- **Estado desejado**: `tipo de atendimento TISS` deve ter fonte propria e nao compartilhar o mesmo catalogo.
- **Risco**: alto, porque os dois conceitos sao distintos.
- **Dependencia**: definicao de fronteira entre os dois catalogos.
- **Prioridade**: alta.

### 4.9 Lacuna de testes

- **Estado atual**: nao existe validacao manual registrada para este campo especifico apos a mudanca.
- **Estado desejado**: teste local do combo, default, selecao e reabertura.
- **Risco**: alto, porque alteracao de combo sem teste costuma gerar regressao silenciosa.
- **Dependencia**: ambiente local autenticado.
- **Prioridade**: alta.

## 5. Mapa operacional por camada

### 5.1 Backend

Responsaveis potenciais:

- `backend/routes/tratamentos_routes.py`
- novo service ou helper para catalogo TISS de atendimento

Lacunas:

- falta fonte propria para o combo;
- falta separar a leitura de `tipo_atendimento_tiss` da leitura de `tipo_tiss` de tabela;
- falta definir se a origem sera tabela nova, seed ou lista fixa controlada.

### 5.2 Frontend

Responsavel atual:

- `frontend/js/modules/novo-tratamento-modal.js`

Lacunas:

- o modal consome o payload atual sem distinguir a origem semantica do combo;
- o modal depende do backend devolver a lista correta;
- o default visual precisa acompanhar a nova fonte.

### 5.3 Persistencia

Responsavel atual:

- `backend/models/tratamento.py`

Lacunas:

- o campo existe, mas a origem que o preenche precisa mudar;
- deve haver compatibilidade para edicao de tratamentos antigos e novos.

## 6. Dependencias verificadas

- paciente em uso;
- modal `Novo tratamento` ja existente;
- model de tratamento com campos de TISS;
- rota de filtros do tratamento;
- frontend que consome o payload do backend;
- catalogo legado `_TISS_TIPO_ATENDIMENTO`.

## 7. Dependencias ainda a decidir

- a nova fonte sera tabela, seed ou service?
- o catalogo tera codigos numericos iguais ao legado ou ids internos novos?
- a compatibilidade com tratamentos antigos sera por id, codigo ou nome?
- o default sera aplicado no backend, no frontend ou nos dois?
- a lista sera global ou por clinica?

## 8. Riscos operacionais

- confundir tipo de atendimento com tipo de tabela;
- quebrar edicao de tratamento ja salvo;
- duplicar a lista em backend e frontend;
- alterar o combo de forma ampla e afetar outros fluxos TISS;
- introduzir fallback errado quando a nova fonte ainda nao existir.

## 9. Sequencia segura recomendada

### Passo 1

Confirmar a fonte tecnica da nova lista.

### Passo 2

Criar a nova fonte sem mexer no comportamento de outros combos.

### Passo 3

Ajustar apenas a origem do combo `Tipo de atendimento (TISS)`.

### Passo 4

Validar default, ordem, selecao e persistencia.

### Passo 5

Reabrir um tratamento salvo e conferir se o valor aparece corretamente.

### Passo 6

Documentar o resultado e so depois considerar extensoes ou limpeza de legado.

## 10. Critério de aceite operacional

Este inventario so pode ser considerado fechado quando:

- o combo mostrar os cinco valores do legado;
- a origem nao for mais `tiss_tipo_tabela`;
- a selecao salva reaparecer corretamente;
- o default da nova criacao estiver correto;
- o modal continuar funcional;
- nenhum outro combo da aba `Convenio` mudar sem necessidade.

## 11. Fora de escopo

Ficam fora desta trilha:

- toolbar;
- aba `Principal`;
- odontograma;
- financeiro;
- agenda;
- editor de textos;
- qualquer refatoracao ampla do frontend.

## 12. Conclusao

O inventario mostra que a lacuna principal e a fonte de dados do combo.

O campo de tratamento ja existe.

O que falta e alinhar o Brana Cloude ao catalogo legado correto de `Tipo de atendimento (TISS)` com o menor impacto possivel.
