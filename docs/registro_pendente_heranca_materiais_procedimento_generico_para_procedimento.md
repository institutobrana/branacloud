# Registro permanente da pendencia: heranca de materiais do Procedimento Generico para Procedimento/Intervencao

Data da identificacao: 2026-05-16

## 1. Contexto de descoberta
Esta pendencia foi identificada durante testes pos-ciclo de Materiais, em um ponto de dependencia cruzada entre:

- Materiais
- Procedimentos
- Procedimentos Genericos

O problema entrou no radar porque existe uma regra funcional historica esperada para a tela de Procedimentos / Intervencoes que depende diretamente do vinculo com Procedimentos Genericos.

## 2. Regra funcional esperada
A regra esperada e:

1. O Procedimento Generico possui materiais vinculados.
2. Na tela de Procedimentos / Intervencoes existe a combo `Procedimento Generico`.
3. Ao associar um Procedimento Generico a um Procedimento/Intervencao, os materiais do generico devem aparecer automaticamente no procedimento.
4. O usuario pode acrescentar materiais extras diretamente no Procedimento/Intervencao.
5. Esses materiais extras nao podem alterar o Procedimento Generico original.
6. A composicao final do Procedimento/Intervencao deve conter:
   - materiais herdados do Procedimento Generico;
   - materiais proprios adicionados localmente;
   - sem duplicidade indevida;
   - com custos corretos;
   - preferindo o material proprio do Procedimento/Intervencao quando houver conflito com o material herdado.

## 3. Exemplo conceitual
Exemplo conceitual esperado:

- um Procedimento Generico possui materiais vinculados;
- um Procedimento/Intervencao aponta para esse generico;
- os materiais do generico aparecem automaticamente no procedimento;
- o usuario adiciona um material extra apenas no procedimento;
- o generico original permanece intacto;
- o procedimento final exibe a composicao completa e sem duplicidade indevida.

## 4. Registro historico recuperado
O historico recuperado aponta para o campo/estrutura `materiais_vinculados` e para o endpoint `GET /procedimentos/{id}` como possivel ponto de composicao da lista final.

O comportamento historico suspeito era:

- buscar materiais proprios do Procedimento/Intervencao;
- buscar materiais herdados do Procedimento Generico associado;
- compor tudo em `materiais_vinculados`;
- deduplicar por `material_id`;
- quando houver conflito, preferir o material proprio do Procedimento/Intervencao;
- manter o Procedimento Generico intacto;
- permitir acrescimos locais sem contaminar o generico.

Tambem foi recuperada uma referencia historica ao exemplo `2080 -> 0082`.

## 5. Modulos envolvidos
Os modulos e areas envolvidos nesta pendencia sao:

- Materiais
- Procedimentos
- Procedimentos Genericos
- backend de procedimentos

## 6. Status
Status desta pendencia:

- pendente de auditoria/correcao;
- nao corrigida nesta etapa;
- documentada para retomada controlada futura.

## 7. Riscos
Riscos associados a nao corrigir a regra:

- custo incorreto;
- materiais nao herdados;
- duplicidade indevida;
- alteracao indevida do Procedimento Generico;
- quebra de Procedimentos;
- quebra de Procedimentos Genericos;
- inconsistencia no relatorio de intervencoes.

## 8. Melhor momento recomendado para tratar
O melhor momento recomendado para tratar esta pendencia e:

- antes de encerrar o ciclo de Materiais;
- antes de continuar novas modularizacoes;
- depois de uma auditoria sem alteracao;
- em uma etapa separada de correcao dirigida.

## 9. Observacao final
Este registro e permanente e nao aplica correcao funcional. Ele apenas formaliza a pendencia, o contexto e os riscos para que a resolucao futura seja feita com rastreabilidade.
