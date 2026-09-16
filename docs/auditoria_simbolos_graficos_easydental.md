# Auditoria - Simbolos Graficos - EasyDental Desktop

## Escopo
Levantamento do menu `Configuracoes > Simbolos graficos` na base EasyDental Desktop localizada em `Y:\EDS70`.

## Metodologia
- Busca por nomes de bitmap, mensagens e estruturas SQL.
- Leitura dos arquivos textuais acessiveis.
- Catalogacao de assets `.bmp` e scripts SQL disponiveis.
- Quando o arquivo era binario ou a tela nao estava exposta como texto, a conclusao foi marcada como inferencia ou lacuna.

## Evidencias de menu e tela

### Menus e recursos
- Fato comprovado:
  - existem bitmaps dedicados ao dominio em `Y:\EDS70\Icones\`
  - o nome `cmd_grafico.bmp` sugere acao associada a grafico/simbolo
  - o catalogo visual vive em `Y:\EDS70\Icones\sim_*.bmp`, `int_*.bmp`, `esp_*.bmp`
- Fato comprovado:
  - o projeto contem o arquivo `Y:\EDS70\Dados\Dist\_SIMBOLO_ODONTO.raw`
  - o projeto contem `Y:\EDS70\Dados\eds70.sql` com tabela `_ESPECIALIDADE` e referencias a especialidades ligadas a simbolos

### Tela/editor
- Fato comprovado:
  - existe um mock local em Brana Cloud chamado `frontend/mock_simbolo_editor.html`
  - o titulo dele e `Edita simbolo grafico`
  - ele contem:
    - nome do simbolo
    - especialidade
    - forma de marcacao no odontograma
    - ferramentas de desenho
    - paleta
    - area de edicao em pixel
    - previas 1x e ampliada
    - botoes de salvar, salvar como e cancelar
- Inferencia:
  - esse mock representa a camada visual esperada do editor grafico, mas nao substitui a analise do Delphi/desktop original.

## Estrutura de dados encontrada

### Especialidades
- `Y:\EDS70\Dados\eds70.sql`
  - cria tabela `_ESPECIALIDADE`
  - define relacionamento com campos `ID_ESPECIALIDADE`
  - aponta uso de especialidade em tabelas ligadas a simbolos e procedimentos

### Simbolos
- `Y:\EDS70\Dados\Dist\_SIMBOLO_ODONTO.raw`
  - evidenciado como fonte bruta do catalogo
  - lido indiretamente pelo backend Brana Cloud em `backend/services/simbolos_service.py`
- `Y:\EDS70\Temp\_SIMBOLO_ODONTO.log`
  - reforca a existencia do fluxo de processamento do catalogo

### Bitmaps
- `Y:\EDS70\Bitmaps\`
  - contem familias de imagens:
    - `arc_*.bmp`
    - `ger_*.bmp`
    - `int_*.bmp`
    - `sim_*.bmp`
    - `esp_*.bmp`
    - `Dentes2d\*.bmp`
    - `Dentes3d\*.bmp`
- Fato comprovado:
  - existem varios arquivos diretamente correlatos ao dominio odontologico e aos simbolos graficos.

## Mensagens e validacoes

### Mensagens do desktop
Arquivo:
- `Y:\EDS70\Mensagens.txt`

Mensagens relevantes:
- `OD013`
  - indica que tabela nao contem intervencoes cadastradas para o simbolo
  - sugere dependencia entre simbolo e procedimentos/intervencoes
- `OD029`
  - indica bloqueio quando uma intervencao esta protegida por cirurgiao
- `OD030`
  - indica outra forma de protecao por cirurgiao
- `FP001`
  - valida formato Windows BMP para foto

### Validacoes inferidas a partir das mensagens
- simbolo tem relacao com:
  - odontograma
  - intervencoes
  - tabelas de precos
  - protecao por cirurgiao
- preview e editacao parecem depender de BMP valido.

## Relacao com especialidade e odontograma

### Especialidades observadas em assets
- `esp_Cirurgia.bmp`
- `esp_Dentística.bmp`
- `esp_Diagnóstico.bmp`
- `esp_Endodontia.bmp`
- `esp_Estética.bmp`
- `esp_Generico.bmp`
- `esp_Gerais.bmp`
- `esp_Implantodontia.bmp`
- `esp_Odontopediatria.bmp`
- `esp_Ortodontia.bmp`
- `esp_Periodontia.bmp`
- `esp_Prevenção.bmp`
- `esp_Prótese.bmp`
- `esp_Radiologia.bmp`

### Simbolos observados em assets
- `sim_default.bmp`
- `sim_modelo.bmp`
- `sim_face.bmp`
- `sim_outras.bmp`
- `sim_prov.bmp`
- `sim_raiox.bmp`
- dezenas de `sim_simb*.bmp`

### Intervencoes e arcadas
- `int_*.bmp`:
  - `int_adesiva.bmp`
  - `int_bracket.bmp`
  - `int_coroa.bmp`
  - `int_implante.bmp`
  - `int_manut.bmp`
  - `int_modelo.bmp`
  - `int_oclusal.bmp`
  - `int_protese.bmp`
  - `int_raspagem.bmp`
  - `int_remove.bmp`
  - e muitos outros
- `arc_*.bmp`:
  - muitos desenhos por dente/arcada

## Formas, campos e controles inferidos
### Campos vistos no mock
- Nome do simbolo
- Especialidade
- Forma de marcacao no odontograma
- Lapis
- Borracha
- Desfazer
- Limpar
- Carregar X
- Carregar Bracket
- Tela vazia
- Salvar desenho
- Salvar como
- Cancela edicao

### Controles que parecem existir no fluxo desktop
- combo de especialidade
- combo de forma de marcacao
- area de desenho pixelado
- preview em dois tamanhos
- botoes de salvar e cancelar

## Lacunas
- Nao foi encontrado o fonte Delphi do formulario original nesta varredura textual.
- Nao foi possivel confirmar nome real da unit, form, grid, handler ou query sem os fontes do desktop.
- Nao foi possível validar atalhos de teclado, duplo clique ou ordem de tab do desktop original.
- Nao foi possivel confirmar se o editor grafico era formulario separado, modal ou componente interno.

## Fontes lidas
- `Y:\EDS70\Dados\eds70.sql`
- `Y:\EDS70\Dados\Dist\_SIMBOLO_ODONTO.raw`
- `Y:\EDS70\Mensagens.txt`
- `Y:\EDS70\Temp\_SIMBOLO_ODONTO.log`
- `Y:\EDS70\Icones\`
- `Y:\EDS70\Bitmaps\`
- `frontend/mock_simbolo_editor.html`
