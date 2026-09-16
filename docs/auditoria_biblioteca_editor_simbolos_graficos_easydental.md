# Auditoria da Biblioteca de símbolos do EasyDental

## 1. Resultado
- RELAÇÃO COMPROVADA.

## 2. Biblioteca do EasyDental
- Fonte: `Y:\EDS70` e, no projeto web, espelhamento parcial em `frontend-react/public/assets/easy/`.
- Arquivos: BMPs pequenos, majoritariamente monocromáticos, com prefixos como `int_`, `sim_`, `dia_`, `arc_`, `bot_`, `ico_`.
- Prefixos: indicam famílias funcionais, não somente símbolos clínicos persistidos.
- Quantidade: a biblioteca visual do Desktop é maior e mais diversa do que o catálogo de 81 itens do React.
- Formato: bitmap BMP.
- Dimensão: compacta, própria para grade de ícones.
- Aparência: glifos pequenos, geométricos, abstratos, com pouca ou nenhuma cor.

## 3. Comportamento
- Clique: seleciona um item da biblioteca.
- Seleção: destaca o item e atualiza o quadro `Desenho`.
- Desenho: recebe a imagem do item selecionado.
- Editar: não foi validado nesta rodada com execução completa no Desktop; há indicação documental de abertura de edição no fluxo legado, mas esta etapa permanece em lacuna.
- Limpar: remove a seleção/desenho.
- Substituição: a seleção anterior é substituída por outra nova.
- Combinação: não comprovada nesta rodada.

## 4. Persistência
- Campo principal no backend atual: `imagem_url`.
- Campos correlatos: `icone`, `bitmap1`, `bitmap2`, `bitmap3`, `imagem_custom`.
- Origem dos valores: nome físico do arquivo BMP ou URL derivada do asset.
- Referência ou cópia: no catálogo atual, o que aparece é referência a asset, não byte inline.
- Bitmaps: presentes como nomes físicos e como família de origem.
- Imagem custom: pode sobrescrever a imagem derivada do BMP.

## 5. Consumidores
- Odontograma: usa símbolos/ícones relacionados ao desenho clínico.
- Intervenções: consomem símbolos em contexto clínico.
- Demais módulos: procedimentos e fluxos legados referenciam símbolos por código/asset.
- Relação com `tipo_marca`: o payload e o backend associam a marcação aos tipos 1 a 6, mas a biblioteca-base do Desktop não foi provada como equivalente ao catálogo persistido.

## 6. Catálogo atual do React
- Endpoint: `GET /cadastros/simbolos-graficos?scope=catalogo`.
- Significado: catálogo oficial persistido, filtrado pelo snapshot EasyDental.
- Itens: 81 registros no payload autenticado validado.
- Finalidade: listagem de símbolos cadastrados, não biblioteca-base abstrata do editor.
- Diferença: o React atual renderiza símbolos clínicos/odontológicos coloridos e persistidos; o Desktop exibido no print usa glifos monocromáticos de biblioteca visual.

## 7. Comparação

| Tema | EasyDental | Brana legado | React atual | Contrato correto |
|---|---|---|---|---|
| fonte da biblioteca | biblioteca-base de glifos BMP | catálogo/seed de símbolos persistidos | catálogo oficial via `scope=catalogo` | biblioteca-base distinta do catálogo final |
| quantidade | maior e heterogênea | 81 no catálogo persistido ou subconjuntos | 81 no catálogo atual | depende do fluxo |
| aparência | monocromática, geométrica, abstrata | misturada ao legado persistido | colorida/clínica | separar biblioteca-base de símbolos persistidos |
| formato | BMP | BMP e referência derivada | BMP via asset publicado | asset consistente com o fluxo |
| identidade | item visual/ferramenta | item persistido/clínico | item persistido/clínico | preservar identidade funcional |
| seleção | atualiza desenho | atualiza desenho | atualiza preview e seleção | seleção deve refletir o desenho |
| efeito no desenho | alimenta quadro Desenho | alimenta desenho/preview | alimenta preview | não quebrar o preview |
| persistência | vínculo funcional ao símbolo | registro persistido | ainda sem persistência nesta rodada | não aplicável |
| consumidor | editor e fluxo de desenho | módulos clínicos | modal Novo | biblioteca-base não deve ser confundida com catálogo final |

## 8. Decisão
- C. O EasyDental utiliza biblioteca-base e catálogo final simultaneamente; o React implementou apenas um deles.

Justificativa:
- o print do Desktop mostra uma biblioteca visual diferente do catálogo clínico persistido;
- o backend/React atual expõe um catálogo oficial de símbolos cadastrados;
- o conjunto atual é compatível com símbolos persistidos e não com a biblioteca-base monocromática do editor.

## 9. Recomendações
- Recomendação futura: apresentar dois conjuntos separados no novo frontend.
- Um conjunto deve representar a biblioteca-base do editor.
- Outro conjunto deve representar o catálogo final/persistido usado em odontograma e módulos clínicos.

## 10. Evidências
- Print Desktop 1: biblioteca monocromática com glifos pequenos.
- Print React 1: grade colorida com símbolos odontológicos.
- Payload autenticado validado: 81 registros.
- Backend validado: `imagem_url` aponta para `/desktop-assets/easy/*.bmp` e responde `200 image/bmp` no servidor backend.
- Runtime validado: no React, o asset precisa ser servido via proxy do frontend como `/api/desktop-assets/easy/*.bmp` para renderizar.

## 11. Lacunas
- Inventário físico completo de `Y:\EDS70` não foi realizado nesta rodada.
- Execução segura do `EDS70.exe` não foi necessária para concluir a diferença estrutural.
- Relação exata de clique duplo, edição e combinação no Desktop permanece como lacuna para runtime futuro.

## 12. Git
- HEAD: `c3ea78b1d5f4b12c2a4e3d8269ae0251446f1a06`
- Branch: `modularizacao-segura-fase-1`
- Stage: não vazio por alterações preexistentes no worktree; nenhuma alteração desta auditoria foi staged.
- Commit: não criado.
- Push: não realizado.

## 13. Próxima etapa segura
- Fase 2C.3.2: corrigir a fonte da biblioteca, se o objetivo for alinhar o React ao contrato do EasyDental Desktop.
- Alternativamente, Fase 2C.4: manter o catálogo atual e avançar para validação local completa do formulário.

## 14. Atualizacao de implementacao
- Fase 2C.3.2 implementada com biblioteca-base estatica a partir de `frontend-react/public/assets/easy/`.
- O modal `Novo símbolo gráfico` passou a renderizar o manifesto `SIMBOLO_GRAFICO_EDITOR_BASE_LIBRARY`.
- O endpoint `GET /cadastros/simbolos-graficos?scope=catalogo` permanece preservado para consumidores clinicos.
- A fronteira aplicada e: biblioteca-base para o editor, catalogo clinico para listagens persistidas e fluxos funcionais.

## 15. Atualizacao Fase 2C.3.8
- Fonte definida pelo responsavel:
  - pasta: `assets\Icones`
  - padrao: `sim_*.bmp`
  - quantidade esperada: `56`
  - quantidade encontrada: `56`
- Ordem adotada nesta rodada:
  - ordem provisoria deterministica por nome, pendente de confirmacao visual do Desktop
- Exclusoes aplicadas ao manifesto:
  - `arc_*`
  - `avi_*`
  - `cmd_*`
  - `dia_*`
  - `esp_*`
  - `ico_*`
  - `int_*`
  - assets de `Bitmaps`
  - assets de `images`
  - arquivos soltos de `assets`
- Funcao local no modal:
  - grade compacta;
  - selecao unica;
  - preview local;
  - limpar local;
  - editar desabilitado;
  - ok desabilitado.
- Observacao: a lista de 261 itens nao e mais tratada como candidata valida ao modal.
