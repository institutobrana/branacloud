# Ficha Pessoal - Historico - Correcao cirurgica do combo Cirurgiao responsavel

## Objetivo
Ajustar somente o campo `Cirurgiao responsavel` da janela `Propriedades da linha` para que ele se comporte como combo nativo com lista visivel de prestadores da conta, sem mexer no restante da tela ou no fluxo do Historico.

## O que foi corrigido
- O campo `Cirurgiao responsavel` passou a usar `select` nativo, em vez de `input + datalist`.
- A lista foi populada com os prestadores do catalogo da conta.
- Os itens foram ordenados de forma mais legivel para aproximar a experiencia do legado.
- O valor salvo continua sendo reconciliado com o catalogo e com o ID do prestador quando existente.
- Se houver valor legado fora do catalogo, ele continua sendo preservado para nao quebrar linhas antigas.

## Arquivos alterados
- `frontend/js/modules/ficha-pessoal-aba-historico-propriedades-da-linha.js`
- `docs/11_roadmap_desenvolvimento.md`

## O que foi mantido igual
- Layout geral da janela.
- Campos Data, Regiao, Cor de fundo, Historico, Data de insercao e Data de atualizacao.
- Persistencia via `extra.historico_aba`.
- Sem backend novo, schema novo, migration nova ou endpoint novo.

## Limitacoes
- O combo segue o comportamento nativo do navegador/sistema, o mais proximo possivel do legado sem criar controle customizado arriscado.
- Pequenas variacoes visuais de fonte e lista podem existir por diferenças do ambiente.

## Riscos observados
- Se a conta nao tiver prestadores carregados, o combo fica vazio, o que reflete o estado real.
- A ordenacao pode variar se a origem vier com rótulos inconsistentes.

## Como testar
1. Abrir Ficha Pessoal.
2. Selecionar um paciente.
3. Entrar na aba Historico.
4. Abrir `Propriedades da linha`.
5. Conferir se `Cirurgiao responsavel` abre como combo e lista os prestadores da conta.
6. Escolher um prestador.
7. Aplicar e gravar.
8. Reabrir o paciente e confirmar persistencia.

## Proxima subetapa recomendada
- Validacao manual do combo na conta real e, se necessario, pequeno ajuste fino de rotulo ou ordenacao.
