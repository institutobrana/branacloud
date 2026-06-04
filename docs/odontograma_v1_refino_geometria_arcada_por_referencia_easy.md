# Refino da geometria da arcada V1 por referencia visual Easy

## 1. Objetivo
Refinar a geometria visual da arcada do odontograma Brana V1 usando os BMPs do legado Easy apenas como referencia de composicao, proporcao e leitura odontologica, sem importar os arquivos legados diretamente para a interface final.

## 2. Escopo
- Melhorar a composicao da arcada superior.
- Melhorar a composicao da arcada inferior.
- Tornar a distribuicao dos dentes/slots mais clinica.
- Preservar a leitura de status, intervencoes e fallback vazio.
- Manter a tela em modo somente leitura.

## 3. Confirmacao de etapa sem escrita
Esta etapa nao executou escrita em banco, nao criou migration, nao alterou assets e nao importou BMP legados para a UI final.

## 4. BMPs usados como referencia
- `assets/easy/arc_superior_perm.bmp`
- `assets/easy/arc_inferior_perm.bmp`
- `assets/easy/dentes/arc_dente11.bmp`
- `assets/easy/dentes/arc_dente21.bmp`
- `assets/easy/dentes/arc_dente31.bmp`
- `assets/easy/dentes/arc_dente41.bmp`
- `assets/easy/dentes/arc_dente16.bmp`
- `assets/easy/dentes/arc_dente26.bmp`
- `assets/easy/dentes/arc_dente36.bmp`
- `assets/easy/dentes/arc_dente46.bmp`

## 5. O que foi aproveitado como referencia visual
- A leitura superior e inferior como duas fileiras distintas.
- A impressao de arcada odontologica completa, com dentes distribuidos em linha clinica.
- A silhueta simples e consistente dos dentes individuais.
- A sensacao de fileira odontologica mais curvada e menos cartesiana.

## 6. O que foi explicitamente evitado para nao acoplar ao legado
- Importar BMP direto para a interface final.
- Tratar `sim_*` e `int_*` como base visual obrigatoria da V1.
- Copiar layout, dimensao ou composicao do EasyDental de forma literal.
- Dependencia estrutural de assets raster antigos para o funcionamento da tela.

## 7. Arquivos alterados
- `frontend/js/modules/odontograma-v1-arcada-render.js`
- `docs/odontograma_v1_refino_geometria_arcada_por_referencia_easy.md`
- `docs/11_roadmap_desenvolvimento.md`

## 8. Como a geometria da arcada foi refinada
- A arcada deixou de ser uma grade reta e passou a ser desenhada em dois canvases curvos, um para a leitura superior e outro para a inferior.
- Cada slot recebeu posicionamento absoluto com deslocamento horizontal proporcional e deslocamento vertical guiado por curva suave.
- A leitura da FDI ganhou destaque visual maior que a posicao cartesianamente numerica.
- A arcada passou a parecer mais com fileira odontologica clinica do que com uma grade de cards.

## 9. Como foi validado
- Validacao de sintaxe do modulo JS com `node --check`.
- Conferencia do diff para manter o escopo isolado no renderizador da arcada.
- Conferencia de que o restante da estrutura de leitura permaneceu inalterado.
- Validacao de que o fallback vazio e o contrato de entrada continuaram preservados.

## 10. Onde testar antes da proxima subetapa
- Abrir o Brana Cloud local.
- Entrar na ficha de um paciente com odontograma disponivel.
- Clicar em `Odontograma`.
- Conferir se a arcada superior e a inferior aparecem como fileiras curvadas.
- Conferir se as intervencoes e o fallback vazio continuam estaveis.
- Confirmar que `frontend/app.js` continua intacto.

## 11. Registro para roadmap
- Refino da geometria da arcada V1 registrado por referencia visual dos BMPs do Easy, sem importacao direta dos assets legados e sem escrita.
