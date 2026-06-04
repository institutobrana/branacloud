# Inspeção visual controlada dos BMPs do `assets/easy` para odontograma

## 1. Objetivo
Inspecionar visualmente os BMPs mais promissores do diretório `D:\BRANA ARQUIVOS\BRANA CLOUD\assets\easy` para orientar a próxima evolução visual do odontograma Brana, sem acoplamento direto ao legado.

## 2. Escopo
- Inspeção somente leitura e visual dos arquivos selecionados.
- Foco em arcada, dentes, faces, símbolos e ícones de intervenção.
- Sem alteração de código, banco, frontend, backend ou assets.

## 3. Confirmacao de etapa somente leitura
Esta etapa foi executada apenas para leitura/inspeção. Nenhum BMP foi copiado, convertido, movido, renomeado ou editado.

## 4. BMPs inspecionados

### 4.1 Arcada
- `assets/easy/arc_superior_perm.bmp`
- `assets/easy/arc_inferior_perm.bmp`
- `assets/easy/arc_faces.bmp`

### 4.2 Dentes
- `assets/easy/dentes/arc_dente11.bmp`
- `assets/easy/dentes/arc_dente21.bmp`
- `assets/easy/dentes/arc_dente31.bmp`
- `assets/easy/dentes/arc_dente41.bmp`

### 4.3 Símbolos
- `assets/easy/sim_default.bmp`
- `assets/easy/sim_face.bmp`
- `assets/easy/sim_face_40.bmp`
- `assets/easy/sim_prov.bmp`
- `assets/easy/sim_bra.bmp`
- `assets/easy/sim_simb1.bmp`
- `assets/easy/sim_simb2.bmp`
- `assets/easy/sim_simb8.bmp`
- `assets/easy/sim_simb14.bmp`
- `assets/easy/sim_simb28.bmp`
- `assets/easy/sim_simb30.bmp`
- `assets/easy/sim_simb36.bmp`

### 4.4 Intervenções / ícones
- `assets/easy/int_coroa.bmp`
- `assets/easy/int_implante.bmp`
- `assets/easy/int_fixa.bmp`
- `assets/easy/int_nucleo.bmp`
- `assets/easy/int_oclusal.bmp`
- `assets/easy/int_raiox.bmp`
- `assets/easy/int_pulpo.bmp`
- `assets/easy/int_canal.bmp`
- `assets/easy/int_protese.bmp`
- `assets/easy/int_total.bmp`
- `assets/easy/int_selante.bmp`

## 5. Achados por grupo

### 5.1 Arcada
Fatos visuais confirmados:
- `arc_superior_perm.bmp` mostra uma arcada superior completa com 16 posições dentarias visiveis em linha.
- `arc_inferior_perm.bmp` mostra uma arcada inferior completa com 16 posicoes dentarias visiveis em linha.
- Os dois arquivos repetem a estrutura de dentes desenhados em linha horizontal, com aspecto de diagrama odontologico completo.
- `arc_faces.bmp` e um grafismo muito pequeno, aparentemente um marcador/legenda de face, nao uma arcada completa.

Hipotese de uso:
- `arc_superior_perm.bmp` e `arc_inferior_perm.bmp` sao os melhores candidatos para orientar a distribuicao geral do odontograma.
- `arc_faces.bmp` parece mais util como referencia de legenda ou marcador auxiliar do que como elemento principal de V1.

### 5.2 Dentes
Fatos visuais confirmados:
- Os arquivos `arc_dente11.bmp`, `arc_dente21.bmp`, `arc_dente31.bmp` e `arc_dente41.bmp` mostram um unico dente isolado, em orientacao vertical, com silhueta simples e tamanho compacto.
- O conjunto observado sugere repeticao do mesmo estilo visual para quadrantes diferentes.
- A linguagem visual e clinica, mas ainda simples e de baixa resolucao.

Hipotese de uso:
- Esses dentes sao bons candidatos para inspirar proporcao, silhueta e alinhamento da V1.
- O conjunto pode orientar a leitura anatomica sem exigir replica direta do bitmap.

### 5.3 Faces
Fatos visuais confirmados:
- `sim_face.bmp` e `sim_face_40.bmp` mostram um pictograma muito pequeno de face.
- `arc_faces.bmp` tambem parece associado a faces, mas em formato de referencia/legenda.

Hipotese de uso:
- `sim_face*` pode ser usado futuramente como referencia de marcador/estado por face.
- Para a V1, a face deve permanecer secundaria.

### 5.4 Símbolos
Fatos visuais confirmados:
- `sim_default.bmp`, `sim_prov.bmp` e `sim_bra.bmp` sao simbolos muito pequenos, monocromáticos ou de baixa complexidade visual.
- `sim_simb1.bmp`, `sim_simb2.bmp`, `sim_simb8.bmp`, `sim_simb14.bmp`, `sim_simb28.bmp`, `sim_simb30.bmp` e `sim_simb36.bmp` mostram pequenos glyphs/markups simples, como quadrados, setas e marcas de estado.
- O conjunto sugere uma biblioteca de marcadores visuais, nao de imagens anatomicas.

Hipotese de uso:
- Os `sim_*` podem inspirar a camada de estados e marcadores da V2.
- Na V1, sao mais uteis como referencia de semantica do que como asset direto.

### 5.5 Intervenções / ícones
Fatos visuais confirmados:
- `int_coroa.bmp`, `int_implante.bmp`, `int_fixa.bmp`, `int_nucleo.bmp`, `int_oclusal.bmp`, `int_raiox.bmp`, `int_pulpo.bmp`, `int_canal.bmp`, `int_protese.bmp`, `int_total.bmp` e `int_selante.bmp` sao icones de 24x24 com simbologia clinica clara.
- Os desenhos sao legiveis, mas permanecem em estilo legado e relativamente pequeno.

Hipotese de uso:
- O grupo `int_*` pode orientar a comunicacao visual de procedimentos e estados na etapa futura.
- Para a V1, pode servir como mapa semantico, mas nao e necessario reproduzi-lo integralmente.

## 6. Fatos visuais confirmados
- O acervo inspecionado e totalmente BMP.
- A arcada superior e inferior aparecem como compostos completos e diretamente alinhados ao conceito de odontograma.
- Os dentes isolados mostram silhueta clinica consistente e ordenacao por quadrante.
- Os simbolos sao pequenos e abstratos, com baixa riqueza anatomica.
- Os icones de intervencao sao mais semanticos do que anatomicos.

## 7. Hipoteses de reaproveitamento
- `arc_superior_perm.bmp` e `arc_inferior_perm.bmp` podem orientar o layout geral da arcada.
- `arc_denteXX.bmp` pode orientar o desenho e a proporcao dos dentes.
- `sim_*` pode orientar estados e marcadores.
- `int_*` pode orientar a linguagem visual de procedimentos.

## 8. O que pode orientar a V1
- Estrutura horizontal da arcada superior e inferior.
- Silhueta vertical dos dentes isolados.
- Uso de marcadores pequenos para estados basicos.
- Organizacao semantica das intervencoes por categoria visual.

## 9. O que deve ficar para V2 ou fase futura
- A maior parte dos `sim_*`.
- A biblioteca completa de `int_*`.
- Refinos de estado por face.
- Eventual tentativa de reproduzir a linguagem visual do legado BMP de forma mais fiel.

## 10. O que nao vale usar
- `cmd_*` como base visual do odontograma.
- Icones gerais de interface como referencia principal da arcada.
- Reproducao literal dos BMPs como se fossem componentes finalizados da V1.

## 11. Riscos de acoplamento ao legado
- O uso direto dos BMPs pode prender o Brana ao tamanho, proporcao e linguagem visual do EasyDental.
- A identidade visual da V1 pode ficar excessivamente dependente de assets raster antigos.
- Há risco de a interface parecer uma copia, em vez de uma evolucao propria.

## 12. Recomendacao objetiva para a proxima subetapa
- Usar os BMPs apenas como referencia de proporcao, sem acoplar os arquivos legados diretamente.
- Evoluir primeiro a composicao da arcada e a distribuicao dos dentes.
- Deixar `sim_*` e `int_*` para uma etapa posterior de refinamento semantico.

## 13. Registro para roadmap
- Inspecao visual controlada dos BMPs de `assets/easy` concluida para orientar a evolucao visual do odontograma Brana.
- Conclusao operacional: ha material visual suficiente para apoiar a proxima etapa, mas o reaproveitamento direto dos BMPs deve ser evitado na V1.
