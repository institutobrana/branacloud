# Ficha Pessoal - Historico - Implementacao minima de Cirurgiao responsavel com login/prestador

## Objetivo da etapa
Implementar, de forma pequena, auditavel e reversivel, a integracao minima do campo `Cirurgiao responsavel` na aba `Historico` com o contexto de sessao do usuario e com o catalogo de prestadores ja existente.

## Arquivos alterados
- `frontend/js/modules/ficha-pessoal-aba-historico.js`
- `docs/11_roadmap_desenvolvimento.md`

## Como o catalogo de prestadores foi integrado
- A aba `Historico` passou a buscar o catalogo existente em `GET /cadastros/prestadores`.
- A consulta foi feita no proprio modulo da aba, sem criar endpoint novo.
- O catalogo foi normalizado localmente para uso no modal, na linha nova, na serializacao e na reaplicacao.
- O campo `Cirurgiao` no modal foi trocado para um input com `datalist`, o que funciona como combo com edicao manual.

## Como o default por `sessaoAtual.prestador_id` foi aplicado
- Ao inserir uma nova linha, o modulo consulta `sessaoAtual.prestador_id`.
- Se houver catalogo carregado, o valor inicial usa o prestador resolvido por esse id.
- Se o catalogo ainda nao estiver pronto, o modulo usa um fallback textual da sessao para nao perder o vinculo ate a reconciliacao.
- Quando o catalogo fica disponivel, as linhas visiveis sao reconciliadas para o nome exato do prestador.

## Como a editabilidade manual foi preservada
- O campo continua sendo um texto editavel no modal.
- O usuario pode digitar livremente, sem bloqueio para selecao apenas de uma lista fechada.
- O `datalist` apenas sugere itens do catalogo, sem impedir entrada manual.
- Se o texto final nao corresponder a nenhum prestador, o valor digitado continua sendo aceito como texto.

## Como a serializacao ficou compativel
- O envelope existente da aba `Historico` foi preservado.
- O formato atual de `rows[].cells` continua funcionando.
- Foram adicionados campos opcionais para apoiar a transicao: `cirurgiao_prestador_id` e `cirurgiao_prestador_nome`.
- Linhas antigas, sem esses campos, continuam sendo lidas normalmente pelo texto da celula.

## Como a reaplicacao ficou compativel
- Ao reabrir o paciente, a aba continua reconstruindo a grade a partir do envelope existente.
- Se vier id/nome do prestador, o modulo tenta resolver no catalogo e refletir o nome visivel correto.
- Se vier apenas texto antigo, o texto continua sendo reaplicado como antes.
- A reconciliacao posterior nao quebra linhas antigas e nao altera Regiao.

## O que ficou propositalmente fora desta primeira implementacao
- `Regiao`
- `Cor de fundo`
- `Data de insercao`
- `Data de atualizacao`
- Regra de tratamento/intervencao
- Novo schema
- Migration
- Endpoint novo
- Mudanca estrutural no backend

## Riscos observados
- Se a sessao ainda nao tiver o catalogo de prestadores carregado, o primeiro valor pode aparecer com fallback textual da sessao ate a reconciliacao.
- Nomes de prestadores iguais ou muito parecidos podem exigir observacao manual em casos raros.
- A persistencia continua textual na grade, com apoio adicional de id apenas para a transicao.

## Como testar no sistema
1. Fazer login com um contexto que tenha `prestador_id` na sessao.
2. Abrir Ficha Pessoal.
3. Selecionar um paciente.
4. Entrar na aba Historico.
5. Inserir uma nova linha.
6. Confirmar se `Cirurgiao` ja vem preenchido com o prestador da sessao, quando aplicavel.
7. Abrir `Propriedades da linha`.
8. Confirmar se `Cirurgiao` aparece com sugestao de catalogo e continua editavel.
9. Alterar manualmente o `Cirurgiao` para outro prestador.
10. Aplicar e conferir se a grade reflete o valor.
11. Clicar em `Grava`.
12. Fechar e reabrir a Ficha Pessoal do mesmo paciente.
13. Confirmar se o `Cirurgiao` escolhido permaneceu gravado.
14. Confirmar que `Regiao` continua como texto comum.
15. Confirmar que nenhuma outra aba da Ficha Pessoal foi afetada.

## Proxima subetapa recomendada
- Validacao funcional/manual desta integracao minima antes de qualquer expansao para `Regiao` ou para regras de tratamento/intervencao.
