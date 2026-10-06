# Combo de símbolos de Procedimentos — P7A.R4 / fechamento P7A.R5

O catálogo de símbolos do Brana Cloude é compartilhado. O catálogo histórico
EasyDental contém 81 identidades; o combo homologado de Nova Intervenção /
Procedimento contém 63, obtidas por **ESPECIAL histórico <> 10**. Os 18 excluídos
são legacy 60–76 e 80. Essa classificação foi conciliada nominalmente com os
screenshots homologados em P7A.R2, sem diferenças de identidade.

Fonte de prova: `C:\Temp\Brana\EDS70_SYMBOL_AUDIT_P7A_R2\easy_combo_exact_set_p7a_r2.json`,
manifesto SHA-256 `461a098fbe7697a8c09d8eba2448503d607413d660c1a7c6b30db2e683a7a4f4`;
catálogo histórico completo preservado na evidência P7A.R1.

## Consulta contextual

`GET /cadastros/simbolos-graficos?scope=procedimentos-combo` mantém autenticação,
permissão e isolamento pela clínica do usuário. Aplica a classificação histórica
às identidades do catálogo oficial, sem deduplicação por bitmap ou código.
Não consulta o snapshot de procedimentos e não faz fallback para a biblioteca
inteira. Sem a fonte de identidades oficiais, retorna lista vazia.

A regra do combo é global e permanente para todas as clínicas atuais e futuras,
sem exceção ou lista de `clinic_id`. O tenant autenticado determina apenas quais
PKs locais podem ser retornadas, nunca quais identidades históricas são elegíveis.
Uma clínica futura com o catálogo homologado completo recebe as mesmas 63
identidades; o filtro não cria registros para suprir catálogos locais incompletos.

**Não usar `especialidade` local como substituto do ESPECIAL histórico:** seeds
anteriores normalizaram os 18 diagnósticos para especialidade 5 nas clínicas 4/15.
A materialização nominal da classificação histórica no scope evita incluir esses
itens indevidamente, sem alterar o catálogo nem seus campos.

O novo scope é opt-in para o modal React. O frontend legado também consome
`scope=procedimentos`, cuja lista ampla e contrato permanecem preservados para
não prejudicar a edição de referências históricas fora do conjunto homologado.
Não há mudança de writer legado ou do catálogo para acomodar o filtro.

Os scopes `procedimentos`, `catalogo`, `genericos`, `biblioteca`, `todos` e `amplo` permanecem
inalterados. O catálogo global e o acesso de outros contextos, incluindo
Odontograma, não são truncados. Novas identidades ou alterações desta classificação
exigem nova prova; símbolos auxiliares/personalizados não entram silenciosamente
no conjunto histórico homologado.

## Identidade e apresentação

57 = Símbolo genérico (dente); 58 = Símbolo genérico (grupo);
81 = Raspagem para arcada. Permanecem identidades distintas de quaisquer outros
símbolos, mesmo compartilhando resource (57/58 e 18/81).

Somente no scope `procedimentos-combo`, os rótulos 56/57/58 recuperam o parêntese final
removido pela sanitização histórica; 46 usa a transcrição homologada “Hemissecção”
(o screenshot/catálogo lê “Hemisecção”, alias explícito registrado em P7A.R2).
Nenhuma descrição persistida é alterada.

## Edição e falhas

O modal solicita o scope de Procedimentos. Uma referência existente fora dos 63
é mostrada como seleção atual, com aviso, sem virar opção de nova escolha.
Abrir/cancelar ou editar outro campo não limpa a referência nem modifica
`mostrar_simbolo`; apenas uma ação explícita no seletor troca/limpa o símbolo,
conforme o contrato atual (a obrigatoriedade ainda não foi implementada).

Falha de carregamento esvazia as opções e propaga o erro ao modal; não reutiliza
uma lista ampla anterior. Não há fallback de catálogo completo no frontend.
O cliente também rejeita uma resposta ampla de servidor antigo que ainda não
reconheça o novo scope, bem como identidades duplicadas. Esse guard não preenche
lacunas: clínicas de teste com catálogo incompleto recebem apenas seus itens
locais elegíveis, sem importar PK de outra clínica nem inventar registros.

P7A.R4/P7A.R5 não alteram procedimentos/catálogos, não aplicam os 192 dependentes
do 58 e não implementam FC4. Em P7A.R5, o usuário confirmou a homologação manual
do combo na clínica produtiva 1: **PASS**. Essa confirmação substitui a exigência
anterior de homologação na clínica 15; não é necessário novo login nessa clínica
para o fechamento. A homologação foi informada pelo usuário, não apresentada
como observação automatizada desta fase. Os 192 continuam congelados, e qualquer
aplicação ou retomada de FC4 depende de fase e autorização posteriores.
