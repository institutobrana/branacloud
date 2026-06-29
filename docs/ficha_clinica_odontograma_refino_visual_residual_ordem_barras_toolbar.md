# Ficha clinica odontograma - correcao residual de ordem das barras e toolbar

## Problema encontrado

A etapa visual anterior aproximou o shell da Ficha clinica da referencia observada no EasyDental, mas deixou tres desvios principais:

- a barra de procedimentos ficou dentro do painel `Boca`, fora da ordem correta
- a toolbar superior do odontograma ficou menos fiel ao topo horizontal esperado
- o quadro do odontograma ficou alto demais, com espaco branco vertical sobrando

## Ordem correta das barras

A ordem corrigida nesta etapa ficou assim:

1. toolbar horizontal do odontograma acima do quadro dos dentes
2. quadro do odontograma
3. barra de icones/procedimentos odontologicos
4. barra de especialidades
5. abas `Boca` e `Dente`
6. painel de mensagem inferior

## Arquivos alterados

- `frontend-react/src/features/fichaClinica/FichaClinicaPage.jsx`
- `frontend-react/src/features/fichaClinica/fichaClinica.css`

## Assets proprios usados

Assets copiados de `assets/images` para `frontend-react/public/assets/fichaClinica/toolbar/`:

- `ico_dashboard_novo.png`
- `ico_odontograma_toolbar_prc_pesquisa.png`
- `ico_filter.png`
- `ico_select.png`
- `ico_trocar.png`
- `ico_menu_odontograma.png`
- `ico_orcamento.png`
- `ico_odonto_imprime.png`

Assets proprios ja publicados e mantidos:

- `frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/*.png`
- `frontend-react/public/assets/fichaClinica/odontograma/arc_faces.bmp`
- `frontend-react/public/assets/fichaClinica/odontograma/especialidades/*.bmp`
- `frontend-react/public/assets/fichaClinica/odontograma/procedimentos/*.bmp`

## Confirmacao sobre a referencia EasyDental

EasyDental foi usado apenas como referencia privada/local para observacao visual, estrutural e funcional.

- nenhum codigo foi copiado
- nenhum CSS foi copiado
- nenhuma imagem foi importada de `_referencias_privadas`

## Pendencias restantes

- ainda pode haver microajuste fino de espacamento no desktop largo, se uma nova comparacao visual indicar necessidade
- o painel direito de Tratamento nao foi refeito nesta etapa; apenas foi preservado o alinhamento geral
