# Subetapa D1-F2 - assets locais do odontograma

## 1. Objetivo da subetapa
Esta subetapa criou um mapa tecnico dos assets locais do odontograma e passou o renderer visual isolado a usar BMPs que ja existem dentro do Brana Cloud.

O foco foi substituir a leitura totalmente cardizada por uma composicao visual baseada em imagens locais, sem copiar nada do EasyDental e sem abrir qualquer frente de backend.

## 2. Achado principal do inventario
O Brana Cloud ja possuía assets locais candidatos para o odontograma em:

- `D:\BRANA ARQUIVOS\BRANA CLOUD\assets\easy`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\assets\easy\dentes`

Os candidatos principais continuam sendo:

- `assets/easy/arc_superior_perm.bmp`
- `assets/easy/arc_inferior_perm.bmp`
- `assets/easy/arc_faces.bmp`
- `assets/easy/dentes/arc_dente11.bmp` a `arc_dente85.bmp`
- `assets/easy/cmd_odontograma.bmp`
- `assets/easy/cmd_historico.bmp`
- `assets/easy/cmd_anamnese.bmp`
- `assets/easy/cmd_calendario.bmp`

## 3. Arquivos criados
- `frontend/js/modules/tela-principal-odontologica-assets.js`
- `docs/easydental_tela_principal_odontologica_subetapa_d1f2_assets_locais_odontograma.md`

## 4. Arquivos alterados
- `frontend/js/modules/tela-principal-odontologica-estado.js`
- `frontend/js/modules/tela-principal-odontologica-odontograma.js`
- `frontend/js/modules/tela-principal-odontologica-layout.js`
- `frontend/js/modules/odontograma-v1.js`
- `docs/11_roadmap_desenvolvimento.md`

## 5. Mapa de assets criado
O novo modulo `frontend/js/modules/tela-principal-odontologica-assets.js` centraliza:

- caminho base dos assets locais;
- caminho da arcada superior;
- caminho da arcada inferior;
- caminho de `arc_faces.bmp`;
- mapa de dentes permanentes por numero;
- ordem dos dentes superiores;
- ordem dos dentes inferiores;
- validacao de numero de dente;
- resolucao do caminho da imagem por dente;
- metadados tecnicos do conjunto local.

### 5.1 Estrutura do mapa
- `CAMINHO_BASE_ASSETS = assets/easy`
- `CAMINHO_BASE_DENTES = assets/easy/dentes`
- `CAMINHO_ARCADA_SUPERIOR = assets/easy/arc_superior_perm.bmp`
- `CAMINHO_ARCADA_INFERIOR = assets/easy/arc_inferior_perm.bmp`
- `CAMINHO_ARC_FACES = assets/easy/arc_faces.bmp`
- `ORDEM_DENTES_SUPERIORES`
- `ORDEM_DENTES_INFERIORES`
- `MAPA_DENTES_PERMANENTES`

### 5.2 Funcao de resolucao principal
- `obterCaminhoImagemDentePermanente(numero)`

### 5.3 Funcao de validacao
- `validarNumeroDentePermanente(numero)`

## 6. Assets locais agora usados pelo renderer
O renderer isolado passou a usar:

- imagem da arcada superior;
- imagem da arcada inferior;
- imagem `arc_faces.bmp` como marcador visual auxiliar;
- imagens individuais dos dentes permanentes quando disponiveis no mapa local;
- legenda visual por status sem editar os BMPs.

## 7. Como o renderer passou a usar imagens locais
O renderer `frontend/js/modules/tela-principal-odontologica-odontograma.js` passou a:

- consultar o modulo de assets local;
- resolver o caminho da arcada superior e inferior;
- resolver o caminho da imagem de cada dente pelo numero FDI;
- renderizar cada dente com `img` local do Brana Cloud;
- manter o numero odontologico visivel;
- manter o status mockado em borda, chip e classe visual;
- manter a observacao curta em texto auxiliar;
- evitar canvas;
- evitar backend;
- evitar persistencia;
- evitar qualquer copia do EasyDental.

## 8. Limitações da composicao atual
- a posicao exata dos dentes ainda e uma aproximacao visual;
- os overlays mais precisos ficam para a proxima etapa;
- os arquivos `.dat` do legado ainda nao foram lidos nesta subetapa;
- o renderer ainda funciona como leitura visual isolada, nao como editor real;
- a composicao continua modular e sem monolito;
- a tela segue sem depender de `frontend/app.js` ou `frontend/index.html`.

## 9. Confirmacoes obrigatorias
- Nenhum asset do EasyDental foi copiado.
- Nenhum asset BMP foi alterado.
- Nenhum backend foi alterado.
- Nenhum banco, schema, migration, seed ou endpoint foi alterado.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- A Ficha Pessoal nao foi alterada.
- A aba Historico nao foi alterada.
- O botao Odontograma nao foi alterado funcionalmente.
- O fallback antigo nao foi removido.
- A implementacao antiga nao foi removida.
- A blindagem textual/mojibake foi respeitada.

## 10. Onde testar
- Abrir o Brana Cloud.
- Entrar no fluxo do odontograma isolado.
- Confirmar a arcada superior e inferior com imagens locais.
- Conferir se os dentes individuais aparecem com o arquivo BMP local correto.
- Verificar se o fallback antigo continua disponivel se o carregamento novo falhar.
- Conferir se o layout continua legivel em tela larga e em tela mais estreita.

## 11. Proxima etapa recomendada
Próxima etapa recomendada: D1-F3.

Foco sugerido:
- refinar posicionamento;
- refinar escala;
- refinar overlays da arcada;
- estudar os arquivos `arc_dente*.dat` em etapa propria, se necessario.

## 12. Registro para roadmap
- criado o mapa de assets locais do odontograma;
- renderer isolado passou a usar imagens locais do Brana Cloud;
- o EasyDental permaneceu apenas como referencia documental;
- nenhum backend ou banco foi alterado;
- fallback antigo permaneceu preservado;
- a proxima etapa recomendada foi registrada como D1-F3.
