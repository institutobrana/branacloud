# Subetapa D1-F3 - composicao da arcada odontologica com assets locais

## 1. Objetivo da subetapa
Refinar o renderer visual do odontograma isolado para abandonar a aparencia de cards e passar a compor a arcada em cinco faixas clinicas alinhadas, usando somente assets locais do Brana Cloud.

## 2. Problema validado pelo usuario
Mesmo apos a Subetapa D1-F2, o odontograma ainda estava visualmente errado porque os dentes apareciam dentro de caixas/cards individuais.

Isso nao reproduzia a estrutura real do EasyDental e deixava a tela com leitura de painel tecnico, nao de odontograma clinico.

## 3. Referencia visual usada
A referencia principal desta etapa foi o print isolado do odontograma correto do EasyDental, cuja leitura visual se organiza em cinco faixas:

1. dentes superiores;
2. faces superiores;
3. numeracao central;
4. faces inferiores;
5. dentes inferiores.

## 4. Arquivos alterados
- `frontend/js/modules/tela-principal-odontologica-odontograma.js`
- `frontend/js/modules/tela-principal-odontologica-assets.js`
- `frontend/js/modules/tela-principal-odontologica-layout.js`
- `docs/easydental_tela_principal_odontologica_subetapa_d1f3_composicao_arcada_assets.md`
- `docs/11_roadmap_desenvolvimento.md`

## 5. Helpers novos ou ajustados no mapa de assets
O modulo `frontend/js/modules/tela-principal-odontologica-assets.js` passou a expor helpers pequenos de apoio para esta composicao:

- `obterAssetDente(numero)`
- `obterAssetFace()`
- `obterOrdemSuperiorOdontograma()`
- `obterOrdemInferiorOdontograma()`

O mapa continua exposto por numero de dente permanente e segue apontando para os BMPs locais ja existentes.

## 6. Como a nova composicao da arcada foi feita
O renderer do odontograma foi refatorado para usar uma estrutura clinica compacta, sem cards, organizada em um bloco unico com cinco faixas alinhadas em 16 posicoes:

- dentes superiores;
- faces superiores;
- numeracao central;
- faces inferiores;
- dentes inferiores.

O bloco central agora e montado com grid regular, sem caixas grandes por dente, e com separacao visual suave apenas para manter a leitura clinica.

## 7. Como arc_faces.bmp foi usado
O asset `assets/easy/arc_faces.bmp` passou a ser usado como imagem repetida nas faixas de faces superiores e inferiores.

O marcador de status ficou discreto sobre a face:

- neutro: sem marcador;
- observado: ponto vermelho discreto;
- restaurado: ponto verde discreto;
- programado: ponto amarelo discreto;
- ausente: ponto cinza discreto.

Nao houve edicao da imagem.

## 8. Como os dentes anatomicos foram usados
As imagens locais dos dentes foram usadas diretamente como elemento principal das faixas superior e inferior.

Foram mantidas as ordens permanentes corretas:

- superior: `18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28`
- inferior: `48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38`

As imagens ficaram sem cards, sem bordas retangulares grandes e sem textos longos dentro de cada dente.

## 9. Como a numeracao foi ajustada
A linha central agora exibe a numeracao visual:

`8, 7, 6, 5, 4, 3, 2, 1 | 1, 2, 3, 4, 5, 6, 7, 8`

O divisor central foi mantido de forma discreta para preservar a leitura do odontograma clinico.

## 10. Confirmacoes obrigatorias
- Nenhum asset foi copiado do EasyDental.
- Nenhum BMP foi alterado.
- Nenhum backend foi alterado.
- Nenhum banco, schema, migration, seed ou endpoint foi alterado.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- A Ficha Pessoal nao foi alterada.
- A aba Historico nao foi alterada.
- O botao Odontograma nao foi alterado.
- O fallback antigo nao foi removido.
- A implementacao antiga nao foi removida.
- A interceptacao global antiga nao foi removida.
- A blindagem textual/mojibake foi respeitada.

## 11. Limitacoes remanescentes
- A leitura visual ainda e mockada.
- A edicao real do odontograma continua fora desta etapa.
- O comportamento clinico real continua fora desta etapa.
- O posicionamento fino ainda pode precisar de refinamento posterior.
- O estudo dos arquivos `arc_dente*.dat` pode ajudar em uma proxima fase.

## 12. Onde testar
- Abrir o Brana Cloud.
- Entrar no fluxo isolado do odontograma.
- Conferir se a tela agora mostra cinco faixas alinhadas.
- Verificar se os dentes nao estao mais em cards.
- Confirmar a linha central `8..1 | 1..8`.
- Confirmar que as faces usam `arc_faces.bmp`.
- Conferir se o fallback antigo continua disponivel se a entrada nova falhar.

## 13. Proxima etapa recomendada
Próxima etapa recomendada: D1-F4.

Foco sugerido:

- refinar escala fina;
- refinar alinhamento das faixas;
- refinar marcacoes discretas;
- estudar os arquivos `arc_dente*.dat` em etapa propria, se necessario.

