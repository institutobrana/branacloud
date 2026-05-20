# Investigacao profunda (somente leitura) - reajuste de tabela / EasyDental / legado desktop

## 1) Resumo executivo

Esta investigacao (somente leitura) procurou evidencias de implementacao real do recurso `% Reajusta tabela...` (reajuste de tabela de precos, aumento/diminuicao por percentual) no Brana Cloud atual, no projeto legado e em uma distribuicao local do EasyDental 7.6.

Conclusao: **regra nao recuperada** nas fontes acessiveis. No web atual e no legado consultado, o botao existe e o bind existe, mas o handler e um **stub** (mensagem "em planejamento"), sem modal e sem endpoint dedicado. No EasyDental 7.6 local, foram encontrados scripts SQL e binarios, mas nao apareceu tela/formulario legivel nem string clara que comprove uma janela "Reajusta tabela de precos"; o que apareceu com clareza foi uma stored procedure voltada a **material** (`sp_AtualizaPrecoMaterial`) e triggers de recalculo de custo, nao um reajuste massivo de precos de procedimentos/tabelas.

## 2) Caminhos investigados (somente leitura)

- Brana Cloud atual: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Legado: `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO`
- Legado dados: `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\Dados`
- EasyDental (drive): `Y:\EDS70` (nao disponivel neste ambiente)
- EasyDental (instalacao local): `D:\UTIL\EasyDental_7.6_BR`

## 3) Limitacoes da investigacao

- O caminho `Y:\EDS70` **nao esta montado/disponivel** neste ambiente (Test-Path retornou False), portanto nao foi possivel varrer essa fonte.
- Nao foi executada engenharia reversa em `.exe/.dll` (somente leitura de metadados basicos e busca em arquivos textuais). Sem uma ferramenta de "strings" aprovada/garantida e sem entrar em analise invasiva, a investigacao de textos dentro de binarios ficou limitada.
- Arquivos com possivel conteudo sensivel (pacientes/CPF/telefone/endereco) nao foram reproduzidos no relatorio; apenas seria registrado como "contém dados sensiveis" caso surgisse (na amostra analisada aqui, nao foi necessario).

## 4) Tipos de arquivos encontrados (visao rapida por caminho)

### 4.1) `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO` (top extensoes)

Indicativo de um codigo-base com muito Python/Qt/artefatos:

- `.py` (17905), `.pyc` (17603), sem extensao (5853), `.pyi` (2820), `.qml` (2286)
- tambem aparecem `.dll`, `.exe`, `.csv`, `.txt`, `.md`, `.html`, `.js`, `.json`, etc.

### 4.2) `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\Dados` (extensoes)

- `.raw` (48), `.sql` (21), `.bak` (1), `.mdf` (1), `.ldf` (1), `.db` (1), `.json` (1), `.csv` (2)

### 4.3) `D:\UTIL\EasyDental_7.6_BR` (top extensoes)

- `.bmp` (2636), `.dll` (200), `.exe` (69), `.sql` (60), `.txt` (33), `.ini` (5), `.reg` (5)
- existem tambem `.mdf` (3) e `.ldf` (3), alem de arquivos de instalacao (MSI/MSP/CAB etc).

## 5) Achados no Brana Cloud atual

### 5.1) Botao, id, bind e stub (evidencias)

- `frontend/index.html:2972`: botao `% Reajusta tabela...` com id `proc-btn-reajuste`.
- `frontend/app.js:28`: referencia `btnReajuste: document.getElementById("proc-btn-reajuste")`.
- `frontend/app.js:23356`: bind `addEventListener("click", procReajustarTabela)`.
- `frontend/app.js:739`: `procReajustarTabela()` e um stub (apenas mensagem "reajuste de tabela em planejamento.").

### 5.2) Modal e endpoint

- Nao foram encontrados indicios de modal web funcional de reajuste (nem chrome/backdrop dedicado).
- Nao foram encontrados endpoints backend especificos para reajuste de tabela.

### 5.3) Model/campo de preco em backend (para referencia futura)

- `backend/models/procedimento.py:17`: existe o campo `preco` no model `Procedimento` (coluna `Float`).

Observacao: a existencia do campo por si so nao prova uma rotina massiva de reajuste; apenas indica onde o preco do procedimento e representado no backend.

## 6) Achados no legado `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO`

### 6.1) Stub no "legado" acessivel (evidencias)

Dentro do legado consultado, ha um bundle `saas\frontend` que espelha o web atual:

- `...\saas\frontend\index.html:2972`: botao `% Reajusta tabela...` com id `proc-btn-reajuste`.
- `...\saas\frontend\app.js:737`: `procReajustarTabela()` como stub (mensagem "em planejamento").
- `...\saas\frontend\app.js:23054`: bind do click para `procReajustarTabela`.

Tambem existem dumps/artefatos de debug no legado (`output\_tmp_front_script.js`, `tmp_front_debug*`, etc.) que repetem o mesmo stub.

### 6.2) Referencia administrativa/funcional (permissoes / funcoes)

Foram encontradas referencias ao recurso como permissao/funcao:

- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\permissoes_eds70.txt:55`: `- Reajustar tabela`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\sis_funcao.csv:50`: `"49","27","Reajustar tabela","1"`

Interpretacao: existe a nocao de "funcao" chamada `Reajustar tabela` na camada de permissao/menus, mas **nao foi encontrada** (neste legado acessivel) a tela/formulario e a rotina de execucao do reajuste em si.

## 7) Achados no legado dados `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\Dados`

Foi localizada uma base de scripts SQL semelhante aos do EasyDental local:

- `...\Dados\eds70_build_0603.sql:113`: update de custo de material (`tab_mat_item.valor_custo`).
- `...\Dados\eds70.sql:3629`: update de custo de material (`tab_mat_item.valor_custo`).

Nao foram encontrados, nesta varredura por termos, scripts com strings claras do tipo "Reajusta tabela" / "Aumentar precos em" / "Diminuir precos em" focados em tabela de procedimentos.

## 8) Achados em `Y:\EDS70`

- **Nao investigado**: caminho indisponivel neste ambiente (drive nao montado).

## 9) Achados na instalacao local `D:\UTIL\EasyDental_7.6_BR`

### 9.1) Evidencias em SQL

O que apareceu com clareza nos scripts do EasyDental local:

- `...\eds70.sql:3517`: `CREATE PROCEDURE dbo.sp_AtualizaPrecoMaterial`
- `...\eds70.sql:3724/3751/3779`: triggers `tg_RecalculaCustoProcedimento_*` (recalculo de custo ligado a materiais/tabelas de itens)

Trechos relevantes do `eds70.sql` mostram que a rotina `sp_AtualizaPrecoMaterial` atualiza custo em `tab_mat_item` (materiais) e que ha triggers de recalculo de custo de procedimento com base em itens de materiais.

O que **nao** apareceu claramente nesta busca:

- uma stored procedure nominalmente ligada a "reajuste de tabela de precos" de procedimentos (ex.: `sp_ReajustaTabela`, `sp_ReajustePrecoProcedimento`, etc.);
- strings de UI ("Reajusta tabela de precos", "Aumentar precos em", "Diminuir precos em") em arquivos textuais do EasyDental local.

### 9.2) Binarios (somente metadados, sem engenharia reversa)

Foi possivel ver a existencia de binarios do EasyDental (ex.: `EDS70.exe`, `EDUTL70.exe`, varias DLLs) e a existencia de bancos `.mdf/.ldf` na distribuicao. Nao foi feita inspecao de strings internas de binarios nesta etapa.

## 10) Evidencias coletadas (amostra objetiva)

Brana Cloud:

- `frontend/index.html:2972`: `<button id="proc-btn-reajuste" ...>% Reajusta tabela...</button>`
- `frontend/app.js:739`: `function procReajustarTabela(){footerMsg.textContent="Procedimentos: reajuste de tabela em planejamento."}`
- `frontend/app.js:23356`: `addEventListener("click",procReajustarTabela)`
- `backend/models/procedimento.py:17`: `preco = Column(Float, default=0)`

Legado:

- `...\permissoes_eds70.txt:55`: `Reajustar tabela`
- `...\sis_funcao.csv:50`: `"49","27","Reajustar tabela","1"`
- `...\saas\frontend\app.js:737`: stub `procReajustarTabela` igual ao web

EasyDental local:

- `...\eds70.sql:3517`: `CREATE PROCEDURE dbo.sp_AtualizaPrecoMaterial`

## 11) Tela funcional encontrada?

Nao. Nesta investigacao, **nao foi localizada** uma tela/formulario legivel (DFM/FRM/PAS/VB/etc.) nem um modal web funcional que implemente a janela "Reajusta tabela de precos" com opcoes de aumentar/diminuir percentual.

## 12) Se encontrou apenas stub / permissao

- Web atual: stub confirmado.
- Legado acessivel: stub confirmado (espelha o web).
- Legado/permissoes: referencia de permissao/funcao `Reajustar tabela` confirmada.

## 13) Conclusao

**Regra nao recuperada** com as fontes acessiveis nesta etapa.

O que existe e comprovavel:

- botao + bind + stub no web/legado;
- referencia administrativa "Reajustar tabela";
- no EasyDental local, scripts SQL e rotinas voltadas a preco/custo de **materiais**, mas nao a um reajuste massivo de precos de tabela de procedimentos encontrado por string/assinatura obvia.

## 14) Recomendacao objetiva (sem implementar agora)

1. Se a intencao e recuperar o comportamento "real" do desktop, a proxima etapa deve ser **buscar outra fonte do desktop** (ex.: instalacao/arquivos do cliente antigo, fontes Delphi/VB/Access, ou um dump de help/menus do EDS70) ou montar o `Y:\EDS70` para varredura.
2. Se nao houver regra recuperavel, implementar no web apenas em subetapa separada, com:
   - endpoint backend de **preview** (somente leitura) retornando impacto (quantos procedimentos, antes/depois por item) antes de aplicar;
   - confirmacao explicita e logging/rollback planejado;
   - testes manuais obrigatorios para tabela correta, arredondamento, nulo/zero e cancelamento.

## 15) Proxima subetapa sugerida

- Subetapa documental curta: "inventario de fontes desktop adicionais" + tentativa de disponibilizar `Y:\EDS70` (sem alterar nada), ou apontar onde o executavel desktop guarda recursos/menus (se existir arquivo `.ini/.cfg` ou base local de menus).

## 16) Onde testar futuramente (quando houver implementacao segura)

- `Configuracoes > Tabelas > Intervencoes / Procedimentos...`
- Testar abrir o modal, cancelar sem efeito, fazer preview, aplicar reajuste em tabela selecionada, validar recarga da lista, e revisar console/rede.

