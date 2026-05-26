# Auditoria EasyDental virgem - Subetapa 8M - correção das tabelas de procedimentos por tabela EasyDental

## 1. Contexto

- Referencia as Subetapas 8H, 8I, 8J, 8K e 8L.
- A Subetapa 8J implementou o nascimento das 10 tabelas de procedimentos/precos em novas contas.
- A Subetapa 8K confirmou a unidade Principal / 0001.
- A Subetapa 8L auditou setup, senha interna e Opcoes do Sistema, sem implementacao.
- O teste manual informado pelo usuario confirmou que a unidade Principal / 0001 nasceu corretamente, mas as tabelas de procedimentos nasceram com o seed errado.
- O erro textual da tela de setup foi identificado pelo usuario, mas fica fora do escopo desta subetapa.
- Esta etapa e documental e tecnica. Nao ha implementacao de codigo nesta entrega, porque a correção segura depende de um mapa por tabela que nao ficou totalmente verificavel com a fonte acessivel.

## 2. Falha encontrada

- As 10 tabelas de procedimentos/precos nasceram com os 336 itens da Brana replicados em todas elas.
- Isso esta errado.
- A regra correta e que Brana mantenha o seu proprio seed e que as tabelas herdadas nao sejam preenchidas com o catalogo Brana.
- A correção tambem nao pode inventar listas de procedimentos sem fonte verificavel.

## 3. EasyDental - dados usados

### 3.1 Acesso ao EasyDental

- O compartilhamento `\\\\Sonyvaio\\c\\EDS70` nao estava acessivel nesta sessao.
- Para leitura, foi possivel conectar diretamente ao banco `eds70` no servidor `DELL_SERVIDOR\\EDS70` com acesso somente leitura.
- A fonte viva acessivel nao expos as 9 tabelas nominais esperadas no contrato do Brana.

### 3.2 `TAB_PRC` encontrado no EasyDental vivo

Tabela `TAB_PRC` retornada na consulta de leitura:

| NROTAB | NOME | TIPO | NROIND | NROCONV | NROCRED | INATIVO | ID_TAB_PRC | ID_TIPO_TABELA |
| --- | --- | --- | ---: | --- | --- | ---: | ---: | --- |
| 1 | EASY - Particular | 1 | 255 |  |  | 0 | 1 |  |
| 5 | Caixa Econ. Federal | 2 | 1 |  |  | 0 | 5 |  |
| 10 | PARTICULAR | 1 | 255 |  |  | 0 | 10 |  |
| 11 | UNIMED-ODONTO | 2 | 3 |  |  | 0 | 11 | 9 |

### 3.3 Contagem de `TAB_PRC_ITEM` no EasyDental vivo

| NROTAB | NOME | QTD |
| --- | --- | ---: |
| 1 | EASY - Particular | 112 |
| 5 | Caixa Econ. Federal | 88 |
| 10 | PARTICULAR | 336 |
| 11 | UNIMED-ODONTO | 162 |

### 3.4 Campos essenciais observados em `TAB_PRC_ITEM`

- `NROTAB`
- `NROPROCTAB`
- `CODCONV`
- `DESCRICAO`
- `NROSIM`
- `ESPECIAL`
- `VALOR_REPASSE`
- `VALOR_PACIENTE`
- `TIPOCOBR`
- `OBSERV`
- `INATIVO`
- `MOSTRAR_SIMBOLO`
- `GARANTIA`
- `PREFERIDO`
- `ID_PRC_TAB`
- `ID_TAB_PRC`
- `ID_PRC_GEN`

### 3.5 Limitação técnica encontrada

- O EasyDental vivo acessivel nesta sessao mostra apenas 4 tabelas de procedimentos/precos.
- O contrato atual do Brana trabalha com 10 tabelas no nascimento da nova conta.
- O backup legado local revisado mostra 9 grupos de tabelas com contagens distintas, mas ainda nao oferece um mapeamento confiavel e fechado entre os nomes contratuais do Brana e as origens EasyDental.
- Portanto, nao havia base segura suficiente para inventar um mapa 1:1 das 9 tabelas herdadas.

## 4. Regra corrigida

- Brana deve continuar recebendo o seu seed canônico.
- As tabelas herdadas nao podem receber o seed Brana repetido.
- Os valores financeiros devem continuar sanitizados para zero/null conforme o modelo exigir.
- Tabela Exemplo continua fora do nascimento de novas contas.
- Contas existentes permanecem preservadas.
- A regra correta ficou validada como "nao replicar Brana em todas as tabelas", mas o mapa exato por tabela EasyDental ainda depende de fonte adicional ou de uma confirmacao contratual adicional.

## 5. Implementacao

- Nenhum arquivo de código foi alterado nesta subetapa, porque a correção completa depende de um mapa por tabela que nao ficou fechado com a fonte acessivel.
- O ponto de falha já foi isolado no seed atual: `backend/seeds/procedimentos_padrao.py` ainda replica `get_procedimentos_brana_padrao()` em todas as tabelas.
- A correção futura precisa separar explicitamente:
  - seed Brana;
  - seed das tabelas EasyDental herdadas;
  - sanitização de valores;
  - anti-duplicidade por clinica e tabela.
- Como nao havia mapa confiavel para todas as tabelas herdadas, nao foi feita uma correção incompleta.

## 6. Fora de escopo

- Unidade Principal / 0001.
- Setup.
- Erro textual da tela de setup.
- Senha interna.
- Opcoes do Sistema.
- Permissoes.
- TISS amplo.
- Frontend.
- Contas existentes.
- Conta ID 16.

## 7. Checks executados

- `git status --short`
- `git branch --show-current`
- `git log --oneline -6`
- leitura dos documentos de 8H, 8I, 8J, 8K e 8L
- leitura do seed atual em `backend/seeds/procedimentos_padrao.py`
- leitura do fluxo de signup em `backend/services/signup_service.py`
- leitura do migrador legado `backend/scripts/migrar_tabelas_procedimentos_easy.py`
- consulta somente leitura no EasyDental vivo via ODBC
- consulta somente leitura no backup legado local `D:\\BRANA ARQUIVOS\\PROJETO_PRECIFICACAO_LEGADO\\saas\\backend\\backups\\brana_saas_full_20260413_130945\\data\\procedimento.csv`

Resultado:
- foi confirmada a existencia de fontes distintas para procedimentos;
- foi confirmada a falha de replicacao da Brana em todas as tabelas;
- nao foi encontrado mapa verificavel suficiente para implementar a correção completa sem inventar semantica.

## 8. Teste manual obrigatorio

- Criar uma nova conta de teste limpa.
- Acessar como admin inicial.
- Abrir Intervencoes / Procedimentos.
- Verificar que a unidade Principal / 0001 continua correta.
- Verificar que nao existe Tabela Exemplo na nova conta.
- Verificar que Brana nao foi copiada como seed de todas as tabelas.
- Verificar se as tabelas herdadas passaram a usar os seeds corretos quando a correção futura existir.
- Confirmar que a conta ID 16 nao foi alterada.
- Confirmar que o setup ainda nao foi alterado nesta etapa.

## 9. Riscos e rollback

| Risco | Impacto | Mitigacao | Teste obrigatorio | Rollback |
| --- | --- | --- | --- | --- |
| Inventar o mapa de seeds por tabela | Alto | Nao implementar sem fonte fechada | Conferencia por tabela antes de qualquer escrita | Novo commit corretivo |
| Manter replicacao de Brana em todas as tabelas | Alto | Separar seed canônico e seed herdado | Validar contagem e nomes das tabelas | Novo commit corretivo |
| Alterar contas existentes por engano | Alto | Restricao apenas ao nascimento de novas contas | Validar conta nova e conta antiga | Novo commit corretivo |
| Misturar setup/unidade/permissoes nesta correção | Medio/alto | Escopo isolado | Revisao de diff | Novo commit corretivo |

## 10. Proxima subetapa recomendada

- Obter um mapa verificavel por tabela EasyDental para os seeds herdados, ou revisar o contrato das 9 tabelas contratadas antes de qualquer implementacao.
- Se o mapa vier fechado, a proxima etapa real pode ser a correção isolada do seed.
- Se o mapa nao vier, a correção deve permanecer bloqueada para nao inventar dados.

## 11. Plano de verificacao

- Nenhum código foi alterado nesta etapa.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foram alterados.
- Setup/senha interna/Opcoes do Sistema nao foram alterados.
- Unidade Principal / 0001 nao foi alterada.
- Permissoes/TISS nao foram alterados.
- Banco/schema/migrations nao foram alterados.
- Conta ID 16 nao foi alterada.
- Nenhuma conta foi criada automaticamente.
- EasyDental nao foi alterado.
- A blindagem textual/mojibake foi respeitada.
