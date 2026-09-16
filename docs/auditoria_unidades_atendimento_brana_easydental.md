# Auditoria tecnica - Unidades de atendimento - Brana Cloud x EasyDental Desktop

## 1. Objetivo e escopo

Esta auditoria consolida a varredura documental e tecnica do modulo Unidades de atendimento ja existente no Brana Cloud e no EasyDental Desktop.

Escopo desta fase:

- leitura e comparacao de documentos existentes;
- leitura de frontend legado;
- leitura de backend, modelos e rotas;
- leitura de referencias de banco e dependencias;
- investigacao somente leitura no diretório `Y:\EDS70`;
- comparacao tecnica com o EasyDental Desktop;
- proposta de contrato para o novo frontend React;
- proposta de divisao modular futura.

Fora de escopo nesta fase:

- qualquer implementacao no novo frontend React;
- qualquer ajuste funcional no backend;
- qualquer ajuste no frontend legado;
- qualquer alteracao de banco, seed, migration ou endpoint;
- qualquer commit ou push.

## 2. Seguranca inicial do repositório

Comandos executados antes da leitura:

```powershell
Set-Location 'D:\BRANA ARQUIVOS\BRANA CLOUD'
git branch --show-current
git rev-parse HEAD
git status --short
git diff --cached --name-only
git remote -v
```

Resultado observado:

- diretorio correto: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- branch atual: `modularizacao-segura-fase-1`
- HEAD inicial: `4c77e517716ab1c144de67bdde3885674fc0783a`
- worktree inicial: sujo, com varias alteracoes preexistentes fora desta frente
- stage inicial: vazio
- remote: `origin https://github.com/institutobrana/branacloud.git`

Observacao importante:

- havia muitas alteracoes preexistentes, inclusive em frontend, backend, docs e arquivos temporarios;
- nada foi revertido ou limpo;
- esta auditoria trabalhou apenas por leitura e documentos novos.

## 3. Documentacao anterior encontrada

Documentos ja existentes e relevantes:

- `docs/unidades_subetapa_0_mapeamento_monolitico.md`
- `docs/unidades_subetapa_1_estrutura_modular_controlada.md`
- `docs/unidades_subetapa_4_wrapper_status_html.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/auditoria_easydental_virgem_subetapa_4_clinica_unidade_configuracao.md`
- `docs/auditoria_easydental_virgem_subetapa_6_comparacao_seeds_brana.md`
- `docs/auditoria_easydental_virgem_subetapa_8e_contrato_mestre_tabelas_novas_contas.md`
- `docs/auditoria_easydental_virgem_subetapa_8f_correcao_contrato_tabelas_estruturais.md`
- `docs/auditoria_easydental_virgem_subetapa_8g_fechamento_contrato_mestre_revisado.md`
- `docs/auditoria_easydental_virgem_subetapa_8k_implementacao_unidade_principal.md`

Esses documentos ja cobriam parte da historia, mas nao consolidavam a cadeia completa do modulo com o estado atual do codigo, o banco e a comparacao funcional final.

## 4. Frontend legado

Arquivos principais:

- `frontend/index.html`
- `frontend/app.js`

Evidencias:

- menu em `frontend/index.html:2572` com `data-menu-action="cadastro-unidades-atendimento"` e texto `Unidades de atendimento...`;
- dispatch em `frontend/app.js:21945` mapeia `cadastro-unidades-atendimento` para o modulo `configuracao`;
- abertura em `frontend/app.js:22034` chama `unidadeAbrir()`.

### Lista

Colunas renderizadas:

1. Codigo
2. Nome da unidade
3. Telefone 1
4. Telefone 2
5. Status

Evidencia:

- `frontend/app.js:22414` monta a grade com essas cinco colunas.

### Acoes e eventos

- `Nova unidade...` abre modal vazio;
- `Altera...` exige selecao;
- `Elimina` exige selecao e confirmacao;
- `Fecha` oculta o painel e devolve ao `workspaceEmpty`;
- `Ok` salva;
- `Cancela` fecha modal;
- clique no backdrop fecha modal;
- botoes `WA` chamam o atalho de WhatsApp da ficha.

Evidencias:

- `frontend/app.js:22455` registra binds da grade e do modal;
- `frontend/app.js:22421` valida nome e chama `POST`/`PUT`;
- `frontend/app.js:22422` faz `DELETE` com confirmacao;
- `frontend/app.js:22424` fecha o painel.

### Mensagens

- sem selecao para edicao: `Selecione uma unidade.`
- sem selecao para exclusao: `Selecione uma unidade.`
- validacao obrigatoria: `Informe o nome da unidade.`
- erro de carregamento: `Falha ao carregar unidades de atendimento.`
- erro de salvamento: `Falha ao salvar unidade.`
- erro de exclusao: `Falha ao eliminar unidade.`
- sucesso de inclusao: `Unidade criada com sucesso.`
- sucesso de edicao: `Unidade alterada com sucesso.`
- sucesso de exclusao: `Unidade eliminada com sucesso.`

### Formulario completo

Campos presentes:

- codigo
- nome
- logradouro_tipo
- endereco
- numero
- complemento
- bairro
- cidade
- cep
- uf
- fone1_tipo
- fone1
- contato1
- fone2_tipo
- fone2
- contato2
- fone3_tipo
- fone3
- contato3
- fone4_tipo
- fone4
- contato4
- ativo via checkbox `Inativar unidade`
- inclusao
- alteracao

Campos que nao aparecem na grade:

- endereco e demais dados de localizacao;
- tipos e contatos dos telefones;
- auditoria textual de inclusao e alteracao.

### Comportamento de lista e selecao

- sem pesquisa e sem filtros de coluna no modulo legado;
- ordenacao tecnica por `source_id ASC, id ASC`;
- selecao unica;
- a primeira linha pode ser mantida como selecionada apos recarga se a selecao anterior desaparecer.

## 5. Backend

Arquivo principal:

- `backend/routes/unidades_atendimento_routes.py`

Contrato do router:

- prefixo: `/cadastros/unidades-atendimento`
- tag: `unidades-atendimento`
- dependencia: `require_module_access("configuracao")`

### Tabela de endpoints

| Metodo | Endpoint | Finalidade | Entrada | Saida | Validacoes | Dependencias |
| ------ | -------- | ---------- | ------- | ----- | ---------- | ------------ |
| GET | `/cadastros/unidades-atendimento` | listar unidades da clinica | usuario autenticado | `{"itens": [...]}` | autenticacao, modulo `configuracao`, filtro por `clinica_id` | `get_current_user`, `require_module_access`, `UnidadeAtendimento` |
| GET | `/cadastros/unidades-atendimento/combos` | listar unidades ativas para selects | usuario autenticado | lista de objetos `{id,row_id,nome,descricao}` | autenticacao, modulo `configuracao`, filtro por `clinica_id`, excluir inativos | `get_current_user`, `require_module_access`, `UnidadeAtendimento` |
| GET | `/cadastros/unidades-atendimento/proximo-codigo` | sugerir proximo codigo | usuario autenticado | `{"codigo": "0001"}` | autenticacao, modulo `configuracao`, maximo por clinica | `get_current_user`, `require_module_access`, `UnidadeAtendimento` |
| POST | `/cadastros/unidades-atendimento` | criar unidade | `UnidadePayload` | unidade criada em dict | autenticacao, modulo `configuracao`, `nome` obrigatorio, `qtd_sala` inteiro nao negativo | `get_current_user`, `require_module_access`, `UnidadePayload`, `UnidadeAtendimento` |
| PUT | `/cadastros/unidades-atendimento/{row_id}` | alterar unidade | `row_id` + `UnidadePayload` | unidade alterada em dict | autenticacao, modulo `configuracao`, busca por `id` e `clinica_id` | `get_current_user`, `require_module_access`, `UnidadeAtendimento` |
| DELETE | `/cadastros/unidades-atendimento/{row_id}` | excluir unidade | `row_id` | `{"detail": "Unidade excluida."}` | autenticacao, modulo `configuracao`, busca por `id` e `clinica_id` | `get_current_user`, `require_module_access`, `UnidadeAtendimento` |

### Regra de inclusao

- nome obrigatorio;
- codigo pode vir do usuario ou do endpoint de proximo codigo;
- `data_inclusao` ganha fallback para a data atual;
- grava sempre na clinica do usuario autenticado.

### Regra de alteracao

- unidade precisa pertencer a mesma clinica;
- `nome` continua obrigatorio;
- `data_alteracao` e atualizada se vier vazia no payload;
- recarga da lista ocorre apos salvar.

### Regra de exclusao

- exclusao fisica;
- sem bloqueio de dependencias no backend atual;
- sem regra de exclusao logica;
- sem bloqueio para a unica unidade no codigo atual.

## 6. Banco de dados

Tabela principal:

- nome fisico: `unidade_atendimento`

| Campo | Tipo | Obrigatorio | Padrao | Finalidade | Usado na lista | Usado no formulario |
| ----- | ---- | ----------: | ------ | ---------- | -------------: | ------------------: |
| `id` | `Integer` | sim | PK | identificador interno | sim | nao |
| `clinica_id` | `Integer` | sim | sem default | tenant | sim | nao |
| `source_id` | `Integer` | sim | sem default | chave de origem/ordem | sim | nao |
| `codigo` | `String(20)` | nao | vazio | codigo exibido | sim | sim |
| `nome` | `String(180)` | sim | vazio | nome da unidade | sim | sim |
| `logradouro_tipo` | `String(60)` | nao | vazio | tipo de logradouro | nao | sim |
| `endereco` | `String(180)` | nao | vazio | endereco | nao | sim |
| `numero` | `String(30)` | nao | vazio | numero | nao | sim |
| `complemento` | `String(120)` | nao | vazio | complemento | nao | sim |
| `bairro` | `String(120)` | nao | vazio | bairro | nao | sim |
| `cidade` | `String(120)` | nao | vazio | cidade | nao | sim |
| `cep` | `String(20)` | nao | vazio | CEP | nao | sim |
| `uf` | `String(10)` | nao | vazio | UF | nao | sim |
| `fone1_tipo` | `String(40)` | nao | vazio | tipo telefone 1 | nao | sim |
| `fone1` | `String(40)` | nao | vazio | telefone 1 | sim | sim |
| `contato1` | `String(120)` | nao | vazio | contato 1 | nao | sim |
| `fone2_tipo` | `String(40)` | nao | vazio | tipo telefone 2 | nao | sim |
| `fone2` | `String(40)` | nao | vazio | telefone 2 | sim | sim |
| `contato2` | `String(120)` | nao | vazio | contato 2 | nao | sim |
| `fone3_tipo` | `String(40)` | nao | vazio | tipo telefone 3 | nao | sim |
| `fone3` | `String(40)` | nao | vazio | telefone 3 | nao | sim |
| `contato3` | `String(120)` | nao | vazio | contato 3 | nao | sim |
| `fone4_tipo` | `String(40)` | nao | vazio | tipo telefone 4 | nao | sim |
| `fone4` | `String(40)` | nao | vazio | telefone 4 | nao | sim |
| `contato4` | `String(120)` | nao | vazio | contato 4 | nao | sim |
| `qtd_sala` | `Integer` | sim | `0` | quantidade de salas | nao | nao |
| `inativo` | `Boolean` | sim | `False` | status | sim | sim, por checkbox invertido |
| `data_inclusao` | `String(30)` | nao | vazio | auditoria de inclusao | nao | sim |
| `data_alteracao` | `String(30)` | nao | vazio | auditoria de alteracao | nao | sim |

Constraints e indices:

- PK em `id`;
- FK `clinica_id -> clinicas.id`;
- UniqueConstraint `uq_unidade_atendimento_clinica_source` em `(clinica_id, source_id)`;
- indices em `id`, `clinica_id` e `source_id` no model.

Schema aditivo:

- `backend/scripts/aplicar_compatibilidade_schema.py` garante `qtd_sala` e `usuarios.unidade_atendimento_id` se faltar.

Referencias inversas:

- `usuarios.unidade_atendimento_id`
- `agenda_legado_evento.id_unidade`
- `agenda_legado_bloqueio.id_unidade`
- tratamentos usam unidade em combos e defaults
- usuarios administrativos escolhem unidade via combo

## 7. Dependencias funcionais

Encontradas:

- usuarios;
- tratamentos;
- agenda;
- signup de novas contas;
- preferencias/contexto da sessao.

### Evidencias

- `backend/models/usuario.py` possui `unidade_atendimento_id`;
- `backend/routes/user_admin_routes.py` grava o vinculo do usuario com unidade;
- `backend/routes/tratamentos_routes.py` usa unidade ativa do usuario como default;
- `backend/routes/agenda_legado_routes.py` usa unidade em listagem e gravacao;
- `backend/services/signup_service.py` garante `Principal / 0001` em novas contas.

## 8. EasyDental Desktop

Diretorio investigado:

- `Y:\EDS70`

Metadados observados:

- executavel principal `EDS70.exe`;
- suporte legado em `EDCAP70.EXE`, `EDIMP70.exe`, `EDUTL70.exe`, `EDSSH70.exe`;
- pastas relevantes `Dados`, `Help`, `Icones`, `Objetos`, `Reports`, `Safe`, `Textos`, `TISS`.

Documento e subetapas anteriores ja registraram:

- `UNIDADE` como tabela estrutural com 1 registro na base virgem;
- `Principal / 0001` como contrato de nova conta;
- relacao da unidade com usuario e configuracao inicial.

Nao foi possivel confirmar, nesta leitura, o codigo-fonte textual completo do menu ou formulario do EasyDental. A comparacao usa a evidencia documental previa, nao descompilacao.

## 9. Comparacao

| Aspecto | EasyDental Desktop | Brana Cloud legado | Decisao para o novo React |
| ------- | ------------------ | ------------------ | ------------------------- |
| Localizacao no menu | `Cadastro -> Unidades de atendimento` | `Cadastro -> Unidades de atendimento...` | manter em `Configuracoes -> Unidades de atendimento` |
| Titulo da tela | `Unidades de atendimento` | `Unidades de atendimento` | manter igual |
| Acoes | Nova, Altera, Elimina, Fecha | Nova unidade..., Altera..., Elimina, Fecha | manter Nova, Altera, Elimina; Fecha pode ser do shell |
| Colunas | Codigo, Nome, Telefone 1, Telefone 2, Status | Codigo, Nome da unidade, Telefone 1, Telefone 2, Status | manter as 5 colunas |
| Campos do cadastro | endereco, telefones, contato, status, inclusao/alteracao | equivalente completo | manter todos os campos reais |
| Obrigatoriedade | nome | nome | manter obrigatorio apenas nome nesta fase |
| Telefone | nao confirmado com mascara textual nesta leitura | texto livre no legado web | nao inventar mascara sem contrato |
| Status | ativo/inativo estrutural | checkbox `Inativar unidade` | manter igual |
| Unidade principal | `Principal / 0001` | `Principal / 0001` no contrato atual | tratar como seed inicial da conta |
| Exclusao | protegida por contrato estrutural | exclusao fisica sem bloqueio duro na rota atual | decidir protecao antes de implementar |
| Impressao | nao confirmada nesta leitura | nao encontrada evidencia funcional | nao incluir sem evidencia |
| Pesquisa/filtro | nao confirmado | nao encontrado no legado web | nao criar por analogia |

## 10. Arquitetura modular recomendada

```text
frontend-react/src/features/unidadesAtendimento/
├── UnidadesAtendimentoPage.jsx
├── components/
│   ├── UnidadesAtendimentoToolbar.jsx
│   ├── UnidadesAtendimentoTable.jsx
│   ├── UnidadeAtendimentoModal.jsx
│   └── UnidadeAtendimentoDeleteDialog.jsx
├── hooks/
│   ├── useUnidadesAtendimento.js
│   └── useUnidadeAtendimentoForm.js
├── services/
│   └── unidadesAtendimentoApi.js
├── utils/
│   ├── unidadeAtendimentoMappers.js
│   └── unidadeAtendimentoValidation.js
└── constants/
    └── unidadeAtendimentoColumns.js
```

## 11. Rota e menu recomendados

- menu: `Configuracoes -> Unidades de atendimento`
- rota: `/app/configuracoes/unidades-atendimento`
- identificador: `unidades-atendimento`

## 12. Campos completos do futuro modal

| Campo | Componente sugerido | Obrigatorio | Validacao | Fonte da regra | Persistencia |
| ----- | ------------------- | ----------: | --------- | -------------- | ------------ |
| codigo | input texto | nao | maximo 20 | backend/model | `codigo` |
| nome | input texto | sim | nao vazio | backend/route | `nome` |
| logradouro_tipo | select | nao | opcional | legado/backend | `logradouro_tipo` |
| endereco | input texto | nao | maximo 180 | legado/backend | `endereco` |
| numero | input texto | nao | maximo 30 | legado/backend | `numero` |
| complemento | input texto | nao | maximo 120 | legado/backend | `complemento` |
| bairro | select ou input | nao | opcional | legado/backend | `bairro` |
| cidade | select ou input | nao | opcional | legado/backend | `cidade` |
| cep | input texto | nao | maximo 20 | legado/backend | `cep` |
| uf | select | nao | lista de UFs | legado/frontend | `uf` |
| fone1_tipo | select | nao | opcional | auxiliares | `fone1_tipo` |
| fone1 | input texto | nao | opcional | legado/backend | `fone1` |
| contato1 | input texto | nao | opcional | legado/backend | `contato1` |
| fone2_tipo | select | nao | opcional | auxiliares | `fone2_tipo` |
| fone2 | input texto | nao | opcional | legado/backend | `fone2` |
| contato2 | input texto | nao | opcional | legado/backend | `contato2` |
| fone3_tipo | select | nao | opcional | auxiliares | `fone3_tipo` |
| fone3 | input texto | nao | opcional | legado/backend | `fone3` |
| contato3 | input texto | nao | opcional | legado/backend | `contato3` |
| fone4_tipo | select | nao | opcional | auxiliares | `fone4_tipo` |
| fone4 | input texto | nao | opcional | legado/backend | `fone4` |
| contato4 | input texto | nao | opcional | legado/backend | `contato4` |
| ativo | checkbox | nao | booleano | backend/model | `inativo` invertido |
| inclusao | input texto curto | nao | `dd/mm/aaaa` | backend/route | `data_inclusao` |
| alteracao | input texto curto | nao | `dd/mm/aaaa` | backend/route | `data_alteracao` |

Campos imutaveis/tecnicos:

- `id`
- `clinica_id`
- `source_id`
- `criado_em`
- `atualizado_em`

## 13. Testes futuros

- menu correto;
- rota correta;
- shell em L;
- cinco colunas;
- lista carregada;
- estado vazio;
- erro de API;
- selecao unica;
- criacao;
- alteracao;
- exclusao;
- cancelamento;
- seguranca por tenant;
- modo claro e escuro.

## 14. Riscos e pendencias

- exclusao fisica sem bloqueio duro;
- ausencia de filtro/pesquisa no legado web;
- telefone sem mascara contratual clara;
- unidade unica protegida ou nao ainda e decisao pendente.

## 15. Conclusao

Ha informacao suficiente para iniciar a implementacao do contrato React, desde que as pendencias de exclusao/protecao da unidade unica e de telefone sejam decididas antes do primeiro commit de codigo.
