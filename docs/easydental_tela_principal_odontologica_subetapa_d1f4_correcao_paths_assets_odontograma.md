# Subetapa D1-F4 - correcao dos paths publicos dos assets do odontograma

## 1. Objetivo da subetapa
Diagnosticar por que os BMPs locais do odontograma apareciam quebrados no navegador e corrigir apenas o caminho publico dos assets, preservando a composicao em cinco faixas criada na subetapa anterior.

## 2. Problema visual validado pelo usuario
A estrutura em cinco faixas apareceu, mas as imagens BMP nao renderizaram corretamente no navegador.

No print do usuario surgiram icones quebrados/miniaturas incorretas e o texto `Face`, em vez dos dentes anatomicos e das faces/oclusais corretas.

## 3. Causa encontrada
O frontend estava montando os arquivos como caminho relativo `assets/easy/...`, enquanto o backend do Brana Cloud monta a pasta local `assets/` em `/desktop-assets`.

Ou seja:

- o caminho no disco e `assets/easy/...`;
- o caminho publico correto no navegador e `/desktop-assets/easy/...`.

O erro nao estava na composicao em cinco faixas.
O erro estava no prefixo publico usado pelos helpers de assets.

## 4. Como o frontend serve os assets
O backend monta o diretorio local `assets/` em:

- `/desktop-assets`

Assim, qualquer asset local do Brana Cloud deve ser consumido no frontend por URL publica sob `/desktop-assets/...`, e nao por caminho relativo simples.

## 5. Arquivos alterados
- `frontend/js/modules/tela-principal-odontologica-assets.js`
- `frontend/js/modules/tela-principal-odontologica-odontograma.js`
- `docs/easydental_tela_principal_odontologica_subetapa_d1f4_correcao_paths_assets_odontograma.md`
- `docs/11_roadmap_desenvolvimento.md`

## 6. Paths antigos e paths corrigidos
### 6.1 Paths antigos
- `assets/easy/arc_faces.bmp`
- `assets/easy/arc_superior_perm.bmp`
- `assets/easy/arc_inferior_perm.bmp`
- `assets/easy/dentes/arc_dente18.bmp`
- `assets/easy/dentes/arc_dente17.bmp`
- `assets/easy/dentes/arc_dente11.bmp`
- `assets/easy/dentes/arc_dente21.bmp`
- `assets/easy/dentes/arc_dente48.bmp`
- `assets/easy/dentes/arc_dente31.bmp`

### 6.2 Paths corrigidos
- `/desktop-assets/easy/arc_faces.bmp`
- `/desktop-assets/easy/arc_superior_perm.bmp`
- `/desktop-assets/easy/arc_inferior_perm.bmp`
- `/desktop-assets/easy/dentes/arc_dente18.bmp`
- `/desktop-assets/easy/dentes/arc_dente17.bmp`
- `/desktop-assets/easy/dentes/arc_dente11.bmp`
- `/desktop-assets/easy/dentes/arc_dente21.bmp`
- `/desktop-assets/easy/dentes/arc_dente48.bmp`
- `/desktop-assets/easy/dentes/arc_dente31.bmp`

## 7. O que foi corrigido no mapa de assets
O modulo `frontend/js/modules/tela-principal-odontologica-assets.js` passou a expor URLs publicas no prefixo correto `/desktop-assets/easy/...`.

Helpers relevantes:

- `obterAssetFace()`
- `obterAssetDente(numero)`
- `obterCaminhoArcadaSuperior()`
- `obterCaminhoArcadaInferior()`

Os metadados do modulo passaram a deixar explicito tambem o caminho publico base.

## 8. O que foi ajustado no renderer
No renderer de odontograma, o fallback textual da face foi removido como texto visivel e a imagem da face passou a usar `alt=""`, para evitar que o navegador mostre literalmente `Face` como substituto visual.

Nao houve redesign.
Nao houve mudanca na composicao em cinco faixas.

## 9. Assets-chave validados em disco
Os arquivos abaixo foram confirmados fisicamente no disco:

- `D:\BRANA ARQUIVOS\BRANA CLOUD\assets\easy\arc_faces.bmp`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\assets\easy\arc_superior_perm.bmp`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\assets\easy\arc_inferior_perm.bmp`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\assets\easy\dentes\arc_dente18.bmp`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\assets\easy\dentes\arc_dente17.bmp`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\assets\easy\dentes\arc_dente11.bmp`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\assets\easy\dentes\arc_dente21.bmp`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\assets\easy\dentes\arc_dente48.bmp`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\assets\easy\dentes\arc_dente31.bmp`

## 10. URLs publicas candidatas para teste no navegador
As URLs candidatas que devem ser abertas diretamente no navegador sao:

- `/desktop-assets/easy/arc_faces.bmp`
- `/desktop-assets/easy/arc_superior_perm.bmp`
- `/desktop-assets/easy/arc_inferior_perm.bmp`
- `/desktop-assets/easy/dentes/arc_dente18.bmp`
- `/desktop-assets/easy/dentes/arc_dente17.bmp`
- `/desktop-assets/easy/dentes/arc_dente11.bmp`
- `/desktop-assets/easy/dentes/arc_dente21.bmp`
- `/desktop-assets/easy/dentes/arc_dente48.bmp`
- `/desktop-assets/easy/dentes/arc_dente31.bmp`

## 11. Confirmacoes obrigatorias
- Nenhum redesign visual foi feito.
- A estrutura em 5 faixas foi preservada.
- Nenhum asset foi alterado.
- Nenhum asset do EasyDental foi copiado.
- Nenhum arquivo do EasyDental foi alterado.
- Nenhum arquivo do EasyDental foi copiado para o Brana Cloud.
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

## 12. Limitacoes remanescentes
- A correcao aqui foi de caminho publico, nao de escala fina.
- A composicao visual continua mockada.
- O ajuste fino de alinhamento e espacamento fica para a proxima etapa.
- Se algum navegador ainda exibir cache antigo, pode ser necessario recarga dura.

## 13. Onde testar
- Abrir diretamente as URLs publicas candidatas acima.
- Abrir `Ficha Pessoal > Historico > Odontograma`.
- Confirmar que as imagens dos dentes e faces carregam pelo mount `/desktop-assets`.
- Confirmar que nao aparece texto `Face` como substituto visual.
- Confirmar que a estrutura em cinco faixas continua aparecendo.

## 14. Proxima etapa recomendada
Próxima etapa recomendada: D1-F5.

Foco sugerido:

- ajuste fino de escala;
- ajuste fino de espaçamento;
- ajuste fino de alinhamento;
- consolidacao visual depois que o carregamento dos BMPs estiver correto no navegador.

