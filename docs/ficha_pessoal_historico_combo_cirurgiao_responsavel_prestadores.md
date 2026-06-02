# Ficha Pessoal - Historico - Correcao do combo Cirurgiao responsavel

## Objetivo
Garantir que o campo `Cirurgiao responsavel` da janela `Propriedades do historico` liste os prestadores da conta de forma visivel e utilizavel, preservando o comportamento ja validado de default, edicao e persistencia.

## O que foi corrigido
- O campo `Cirurgiao responsavel` deixou de ser um `input` com `datalist` e passou a ser um `select` populado com os prestadores da conta.
- A lista passa a abrir com os nomes carregados do catalogo de prestadores existente.
- O valor salvo continua sendo reconciliado pelo id quando houver correspondencia.
- Se o valor anterior nao estiver no catalogo, ele e preservado como opcao local para nao quebrar o estado atual.

## Arquivos alterados
- `frontend/js/modules/ficha-pessoal-aba-historico-propriedades-da-linha.js`
- `docs/11_roadmap_desenvolvimento.md`

## O que foi mantido igual
- Fluxo geral da aba Historico.
- Integracao com `extra.historico_aba`.
- Sem backend novo, schema novo, migration nova ou endpoint novo.
- O restante da janela permanece alinhado ao contrato visual ja validado.

## Limitacoes
- O combo agora privilegia a lista visivel de prestadores, como solicitado.
- Se o ambiente nao tiver prestadores carregados, a lista aparece vazia, o que reflete o estado real da conta.

## Riscos observados
- Se o catalogo vier vazio por permissao ou carga incompleta, o combo fica sem itens, mas isso e um espelho fiel da origem.
- O valor customizado anterior continua sendo preservado para nao quebrar linhas ja existentes.

## Como testar
1. Abrir Ficha Pessoal.
2. Selecionar um paciente.
3. Entrar na aba Historico.
4. Abrir `Propriedades da linha`.
5. Conferir se o combo `Cirurgiao responsavel` lista os prestadores da conta.
6. Escolher um prestador da lista.
7. Aplicar e gravar.
8. Reabrir o paciente e conferir se o valor permaneceu.

## Proxima subetapa recomendada
- Validacao manual do combo com a conta logada e, se necessario, ajuste fino de ordenacao/label dos prestadores.
