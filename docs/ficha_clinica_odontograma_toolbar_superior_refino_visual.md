# Refinamento visual da barra superior do odontograma e lateral direita

## Barra ajustada

Ajuste realizado na barra superior de acoes do odontograma da Ficha Clinica no `frontend-react`.

## Escopo desta etapa combinada

- reposicionamento mais fiel da barra superior de icones;
- comportamento retratil da lateral direita com calendario.

## Segunda correcao de posicionamento

- Esta etapa registra a segunda correcao do posicionamento da barra superior.
- O ajuste anterior ainda deixava a barra deslocada demais para a esquerda.
- A nova regra de alinhamento deixou de usar o centro do board inteiro e passou a usar um deslocamento horizontal ancorado no miolo visual do odontograma.
- Em telas desktop, o primeiro icone passa a iniciar mais para a direita, evitando sobreposicao visual sobre os primeiros dentes da esquerda.

## Terceira correcao com print rosa

- Esta etapa registra uma terceira correcao porque a barra ainda permanecia muito a esquerda.
- A referencia principal passou a ser o print anotado em rosa.
- O criterio de posicionamento deixou de ser o miolo do odontograma e passou a mirar a faixa superior entre o fim visual do odontograma e o inicio do painel de Tratamento.
- Em desktop, o inicio da barra agora avanca para a direita ate a area indicada em rosa, sem invadir as abas do painel de Tratamento.

## Comportamento retratil da lateral direita

- A lateral direita passou a ter estado expandido/recolhido.
- Uma seta persistente fica acessivel no proprio painel para recolher e expandir.
- Quando recolhida, a coluna direita nao vira apenas uma alca minima: ela permanece como uma faixa turquesa estreita, com atalhos verticais visiveis, mais proxima do comportamento mostrado no video correto.
- Quando expandida, o calendario, status do paciente em uso, busca e acoes reaparecem no mesmo painel.
- O video correto usado como referencia foi `C:\\Users\\Tel\\Videos\\2026-06-30 06-01-19.mp4`, que mostrou a tela odontologica com a lateral recolhida em formato de trilho vertical.

## O que mudou

- A barra deixou de comecar no canto esquerdo absoluto do bloco.
- O conjunto agora fica centralizado dentro do board esquerdo do odontograma, mais proximo da posicao visual observada no EasyDental.
- Foram adicionados separadores visuais para aproximar a ordem:
  - novo
  - pesquisa
  - separador
  - filtro
  - selecao
  - trocar
  - separador
  - menu
  - financeiro
  - imprimir

## Icones encontrados e usados

- `ico_dashboard_novo.png`
- `ico_odontograma_toolbar_prc_lupa.png`
- `ico_filter.png`
- `ico_select.png`
- `ico_trocar.png`
- `ico_menu_odontograma.png`
- `ico_orcamento.png`
- `ico_odonto_imprime.png`

Todos foram usados a partir da base de assets do projeto e publicados em `frontend-react/public/assets/fichaClinica/toolbar/`.

## Icones nao encontrados

- Nenhum icone adicional especifico de dente/procedimento mais fiel do que `ico_select.png` e `ico_trocar.png` foi localizado com correspondencia segura de nome nesta etapa.

## Arquivos alterados

- `frontend-react/src/features/fichaClinica/FichaClinicaPage.jsx`
- `frontend-react/src/features/fichaClinica/fichaClinica.css`
- `frontend-react/public/assets/fichaClinica/toolbar/ico_odontograma_toolbar_prc_lupa.png`
- `assets/images/ico_seta_painel_lateral.png` foi reutilizado como referencia visual da seta
- `assets/images/ico_ficha_clinica_painel_calendario.svg`
- `assets/images/ico_ficha_clinica_painel_search.svg`
- `assets/images/ico_ficha_clinica_painel_novo.svg`

## Como validar visualmente

1. Abrir a Ficha Clinica/Odontograma.
2. Comparar com o print atual do Brana Cloud, com o print de referencia do EasyDental e com o print anotado em rosa.
3. Conferir que a barra superior foi deslocada mais para a direita do que na versao anterior.
4. Conferir que o inicio da barra cai aproximadamente na faixa rosa marcada.
5. Conferir que a barra nao fica mais sobre a extrema esquerda do odontograma.
6. Conferir que a barra continua fora do conteudo das abas de Tratamento.
7. Conferir a ordem visual: novo, pesquisa, separador, filtro, acoes centrais, separador, menu, financeiro, imprimir.
8. Conferir que odontograma, barras inferiores e painel de tratamento continuam alinhados.
9. Conferir que a seta da lateral direita recolhe e expande o painel sem perder o acesso ao controle.
10. Conferir que o calendario continua visivel quando expandido.
11. Conferir que, quando recolhida, a lateral continua aparecendo como trilho turquesa estreito com atalhos verticais visiveis.
