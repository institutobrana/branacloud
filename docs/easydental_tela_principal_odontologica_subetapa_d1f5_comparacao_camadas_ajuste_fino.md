# Subetapa D1-F5 - comparacao das camadas do odontograma e ajuste fino

## 1. Objetivo da subetapa
Executar uma auditoria comparativa das camadas visuais do odontograma isolado do Brana Cloud contra o EasyDental, validando antes de qualquer reducao ou reposicionamento o papel de cada camada relevante e aplicando apenas um ajuste fino de composicao quando houver evidenca suficiente.

## 2. Problema validado pelo usuario
O usuario confirmou que os BMPs agora carregam no navegador, mas a composicao ainda apresenta:
- sensacao de sobreposicao / fundo fantasma;
- diferenca relevante em relacao ao EasyDental;
- dentes, faces e numeracao ainda pedindo alinhamento e compactacao.

## 3. Documentos consultados
Consultados em leitura:
- `docs/easydental_tela_principal_odontologica_inventario_assets_odontograma.md`
- `docs/easydental_tela_principal_odontologica_subetapa_d1f2_assets_locais_odontograma.md`
- `docs/easydental_tela_principal_odontologica_subetapa_d1f3_composicao_arcada_assets.md`
- `docs/easydental_tela_principal_odontologica_subetapa_d1f4_correcao_paths_assets_odontograma.md`
- `docs/easydental_tela_principal_odontologica_inventario_fontes_easydental.md`
- `docs/easydental_tela_principal_odontologica_auditoria_implementacao_antiga_odontograma.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 4. Se foi necessario consultar a raiz do EasyDental
Os documentos consultados ja bastavam para decidir o ajuste principal, mas a raiz do EasyDental foi conferida em modo somente leitura para confirmar a familia de camadas e seus papeis:
- `Y:\EDS70\Bitmaps\Dentes2d`
- `Y:\EDS70\Bitmaps`
- `Y:\EDS70\Objetos`

## 5. Camadas auditadas
Camadas e elementos verificados:
- dentes superiores;
- faces superiores;
- numeracao central;
- faces inferiores;
- dentes inferiores;
- `arc_superior_perm.bmp`;
- `arc_inferior_perm.bmp`;
- `arc_faces.bmp`;
- possiveis fundos / slots;
- marcadores de status;
- espacos e alinhamentos.

## 6. O que foi confirmado como correto
- A estrutura em 5 faixas foi mantida e continua coerente com a leitura odontologica.
- Os dentes permanentes continuam carregando pelos paths publicos corretos em `/desktop-assets/easy/dentes/...`.
- `arc_faces.bmp` continua sendo usado como camada de face / oclusal auxiliar.
- A entrada isolada continua retornando `ok: true`.
- O fallback antigo continua preservado.

## 7. O que foi confirmado como incorreto ou excessivo
- O underlay das arcadas (`arc_superior_perm.bmp` / `arc_inferior_perm.bmp`) estava visivel demais e reforcava a sensacao de fantasma por duplicar a leitura dos dentes.
- O espaco vertical dos blocos ainda estava um pouco aberto para a composicao esperada.
- As faces estavam corretas como ideia, mas podiam ficar um pouco mais discretas.

## 8. O que foi mantido
- As 5 faixas do odontograma.
- Os BMPs locais do Brana Cloud.
- A sequencia de dentes e a numeracao central.
- O renderer isolado e a trilha de fallback.
- A camada de arcada base como apoio, nao como removida.

## 9. O que foi ajustado
No arquivo `frontend/js/modules/tela-principal-odontologica-odontograma.js`:
- reducao da opacidade do underlay das arcadas;
- compactacao vertical da moldura do odontograma;
- reducao dos gaps entre faixas;
- reducao das alturas minimas dos blocos de dentes, faces e numeracao;
- reducao discreta do tamanho visual das faces e dos marcadores;
- marcacao do backdrop como decorativo para evitar leitura semantica desnecessaria.

## 10. O que foi reduzido ou ocultado
- O fundo fantasma gerado pelo underlay das arcadas foi reduzido, nao removido.
- O backdrop das arcadas foi mantido, mas em opacidade bem menor.
- O texto de substituicao visual da face continuou oculto.

## 11. O que nao foi removido por falta de evidenca
- `arc_superior_perm.bmp` nao foi removido porque os registros e a comparacao indicam que ele funciona como arcada base estrutural.
- `arc_inferior_perm.bmp` nao foi removido pelo mesmo motivo.
- `arc_faces.bmp` nao foi removido porque aparece como camada auxiliar coerente com a leitura odontologica.
- Nenhuma camada foi desativada de forma definitiva sem evidenca suficiente.

## 12. Limitacoes remanescentes
- A composicao ainda e mockada e nao representa a semantica clinica real completa do EasyDental.
- Os arquivos `arc_dente*.dat` ainda podem trazer informacao de overlay / posicionamento mais fiel.
- O ajuste atual e conservador e nao substitui uma validacao visual final em navegador real.

## 13. Confirmacoes obrigatorias
- Nao copiou assets.
- Nao alterou assets.
- Nao alterou backend.
- Nao alterou banco, schema, migrations, seeds ou endpoints.
- Nao alterou `frontend/app.js`.
- Nao alterou `frontend/index.html`.
- Nao alterou Ficha Pessoal.
- Nao alterou aba Historico.
- Nao alterou o botao Odontograma.
- Nao removeu o fallback antigo.
- Nao removeu a implementacao antiga.
- Nao removeu a interceptacao global antiga.
- A blindagem textual / mojibake foi respeitada.

## 14. Onde testar
- Abrir `Ficha Pessoal > Historico > Odontograma`.
- Verificar se a composicao ficou mais compacta.
- Verificar se a sensacao de fantasma reduziu.
- Verificar se os dentes continuam carregando pelos paths publicos corretos.
- Verificar se a estrutura em 5 faixas continua preservada.

## 15. Proxima etapa recomendada
Se ainda for necessario aprofundar a fidelidade de posicionamento, a proxima etapa recomendada e D1-F6, com estudo tecnico dos arquivos `arc_dente*.dat` para overlay e posicao mais fiel.
