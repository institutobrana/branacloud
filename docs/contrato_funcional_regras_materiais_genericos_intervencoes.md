# Contrato Funcional: Regras de Materiais entre Procedimentos Genericos e Intervencoes

## 1. Objetivo
Estabelecer o contrato funcional obrigatorio para as regras de materiais entre:

- Procedimentos Genericos;
- Intervencoes / Procedimentos;
- materiais herdados;
- materiais proprios/locais;
- troca de Procedimento Generico;
- recomposicao da lista de materiais.

Este documento e somente documental. Ele nao altera comportamento funcional, nao corrige codigo e nao substitui validacao tecnica de implementacao. Ele existe para ser a fonte de verdade para qualquer correcao futura neste fluxo.

## 2. Diretorio real de trabalho
`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Confirmacao de contrato documental
Este arquivo registra um contrato funcional obrigatorio. Nenhuma regra aqui e uma implementacao. Nenhuma instrucoes abaixo autoriza alteracao de codigo por si so.

## 4. Escopo
Este contrato cobre:

- composicao da lista de materiais em Intervencoes / Procedimentos;
- heranca de materiais do Procedimento Generico;
- materiais proprios/locais da Intervencao;
- troca de Procedimento Generico;
- edicao de material no Genrico e na Intervencao;
- deduplicacao por `material_id`;
- snapshot e cache no frontend;
- recomposicao da grade ao trocar o generico;
- duplo clique, duplicidade e quantidade/spin como regras de comportamento esperado.

## 5. Fora de escopo
Ficam fora deste contrato:

- alteracao de schema;
- migration;
- banco de dados;
- novos endpoints;
- remocao de validacoes de clinica;
- alteracao de textos visiveis do sistema;
- correcao de mojibake;
- reescrita de modais;
- mudancas de CSS;
- atualizacao em massa de Intervencoes;
- copia de materiais para Intervencoes;
- qualquer correcao funcional fora das regras aqui registradas.

## 6. Definicoes

### 6.1 Procedimento Generico
Base/modelo funcional que pode possuir seus proprios materiais vinculados. Seus materiais sao a fonte herdavel para as Intervencoes / Procedimentos associados.

### 6.2 Intervencao / Procedimento
Entidade operacional que pode receber materiais proprios/locais e materiais herdados de um Procedimento Generico selecionado.

### 6.3 Material herdado
Material que pertence ao Procedimento Generico selecionado e e exibido na Intervencao por composicao, sem ser copiado como dado proprio da Intervencao.

### 6.4 Material proprio/local
Material adicionado ou alterado diretamente na Intervencao / Procedimento. Pertence somente a essa Intervencao.

### 6.5 Material visual
Item exibido na grade do frontend. Pode representar material proprio, herdado ou a composicao dos dois, desde que respeite o contrato.

### 6.6 Snapshot
Estado local guardado pelo frontend para reconstruir a visualizacao atual sem usar dados antigos indevidos.

### 6.7 Cache
Memoria local usada para evitar refetch desnecessario. Se existir, deve guardar somente dados do genrico correspondente e nunca misturar material local de Intervencao.

### 6.8 Composicao
Processo de montar a lista final da grade juntando:

- materiais proprios da Intervencao atual;
- materiais herdados do Procedimento Generico selecionado.

### 6.9 Deduplicacao
Regra que impede dois itens com o mesmo `material_id` na lista final. Em conflito, o material proprio da Intervencao atual tem prioridade.

## 7. Regra central da composicao
A lista de materiais de uma Intervencao / Procedimento deve ser sempre composta assim:

- materiais proprios da Intervencao / Procedimento atual;
- mais materiais herdados do Procedimento Generico atualmente selecionado.

Nunca deve entrar na lista final:

- material proprio de outra Intervencao;
- material herdado de Procedimento Generico anterior;
- material visual antigo;
- material de cache contaminado;
- material de snapshot que nao pertence a Intervencao ativa;
- material de Procedimento Generico que nao tem materiais;
- material local tratado como se fosse herdado.

## 8. Regra de lista vazia valida
Lista vazia e resposta valida.

Se o Procedimento Generico selecionado nao tiver materiais vinculados, a parte herdada da lista deve ficar vazia.

O sistema nao pode interpretar lista vazia como:

- manter a lista anterior;
- manter herdados antigos;
- reaproveitar cache velho;
- reaplicar snapshot de outra Intervencao.

## 9. Regras obrigatorias do contrato

### 9.1 Procedimento Generico como modelo/base
O Procedimento Generico e o modelo/base do fluxo. Ele pode ter materiais vinculados proprios.

### 9.2 Materiais do generico sao herdaveis
Os materiais do Procedimento Generico sao herdaveis pelas Intervencoes / Procedimentos que o usam.

### 9.3 Associacao de generico
Uma Intervencao / Procedimento pode ser associada a um Procedimento Generico.

### 9.4 Composicao ao associar
Ao associar um Procedimento Generico, a Intervencao deve receber os materiais do generico selecionado, somados aos materiais proprios ja existentes daquela Intervencao.

### 9.5 Troca de generico
Ao trocar o Procedimento Generico:

- os materiais herdados do generico anterior devem sair;
- os materiais herdados do novo generico devem entrar;
- os materiais proprios da Intervencao atual devem permanecer.

### 9.6 Generico sem materiais
Se o novo Procedimento Generico nao tiver materiais, nenhum material herdado deve aparecer.

### 9.7 Materiais proprios da Intervencao
Materiais proprios da Intervencao atual devem ser preservados ao trocar o generico.

### 9.8 Materiais de outra Intervencao
Materiais proprios de outra Intervencao nunca devem aparecer.

### 9.9 Material local pertence somente a sua Intervencao
Material adicionado dentro de uma Intervencao pertence somente aquela Intervencao.

### 9.10 Material local nao entra no generico
Material adicionado dentro de uma Intervencao nao pode ser adicionado ao Procedimento Generico.

### 9.11 Material local nao contamina outra Intervencao
Material adicionado dentro de uma Intervencao nao pode aparecer em outra Intervencao.

### 9.12 Alteracao no Procedimento Generico
Material alterado dentro do Procedimento Generico altera a base/modelo.

### 9.13 Reflexo por heranca
Alteracao feita no Procedimento Generico deve refletir nas Intervencoes associadas por heranca.

### 9.14 Sem copia em massa
Essa reflexo nao deve ser feita por copia em massa.

### 9.15 Sem atualizacao em massa nas Intervencoes
Nao deve haver atualizacao em massa nas Intervencoes quando o Generico muda.

### 9.16 Sem criacao automatica de material local
Nao deve criar material local automaticamente em Intervencoes.

### 9.17 Sem apagar materiais proprios
Nao deve apagar materiais proprios das Intervencoes.

### 9.18 Deduplicacao por material_id
A deduplicacao deve ser por `material_id`.

### 9.19 Prioridade do material proprio
Em conflito entre material proprio da Intervencao e material herdado do Generico, o material proprio da Intervencao atual deve prevalecer.

### 9.20 Recomposta do zero ao trocar generico
A grade da Intervencao deve ser recomposta do zero quando trocar/associar Procedimento Generico.

Recomposta do zero significa:

- identificar Intervencao ativa;
- identificar Procedimento Generico ativo;
- separar proprios da Intervencao ativa;
- descartar herdados anteriores;
- buscar herdados do novo Generico;
- se herdados vierem vazios, usar lista herdada vazia;
- montar proprios atuais + herdados atuais;
- renderizar.

### 9.21 Sem usar lista visual anterior como base
O sistema nao pode usar lista visual anterior como base da nova composicao.

### 9.22 Sem snapshot antigo sem validacao
O sistema nao pode usar snapshot antigo sem validar se pertence a Intervencao ativa.

### 9.23 Sem cache contaminado
O sistema nao pode usar cache de generico se ele estiver contaminado por material local.

### 9.24 Cache valido
Se usar cache de generico, esse cache deve conter apenas materiais do proprio Generico.

### 9.25 Ao abrir Intervencao existente
Ao abrir uma Intervencao ja existente, o estado anterior do editor deve ser descartado.

### 9.26 Ao abrir outra Intervencao
Ao abrir outra Intervencao, o estado da anterior deve ser limpo.

### 9.27 Troca de generico na mesma Intervencao
Ao trocar de Generico dentro da mesma Intervencao, apenas os herdados devem trocar; proprios da Intervencao atual devem permanecer.

### 9.28 Generico vazio
Ao escolher um Generico sem materiais, os herdados antigos devem ser removidos.

### 9.29 Intervencao sem proprios + Generico vazio
Se a Intervencao tambem nao tiver proprios, a grade deve ficar vazia.

### 9.30 Duplo clique
Duplo clique em material vinculado na Intervencao deve abrir o modal completo, nao prompt nativo.

### 9.31 Duplicidade
Tentativa de duplicidade deve ser bloqueada.

### 9.32 Mensagem de duplicidade
Mensagem de duplicidade deve usar modal proprio do sistema, nao alert nativo.

### 9.33 Quantidade / spin
Campo de quantidade no Procedimento Generico deve subir/descer de 1 em 1 na spin, mas aceitar digitacao fracionada.

### 9.34 Alteracao no Generico
A alteracao de material no Procedimento Generico deve gravar no vinculo do Generico.

### 9.35 Alteracao na Intervencao
A alteracao de material na Intervencao deve gravar somente naquela Intervencao.

### 9.36 Erro de tabela
O erro `Tabela de procedimentos nao encontrada.` nao pode aparecer em vinculo valido.

### 9.37 Erro de gravacao do generico
O erro `Falha ao gravar materiais do procedimento.` precisa ser tratado em correcao separada, mas sem violar este contrato.

## 10. Regras que nunca podem ser violadas

- material proprio da Intervencao atual nunca perde prioridade;
- material proprio de outra Intervencao nunca entra;
- material herdado antigo nunca permanece depois da troca do generico;
- lista vazia e valida quando o generico nao tem materiais;
- snapshot antigo nao pode substituir estado atual;
- cache contaminado nao pode orientar composicao;
- nenhuma correcao futura pode transformar material local em material herdado;
- nenhuma correcao futura pode transformar material herdado em material local;
- nenhuma correcao futura pode copiar materiais para Intervencoes em massa;
- nenhuma correcao futura pode apagar materiais proprios da Intervencao.

## 11. Cenarios de exemplo

### 11.1 Cenario 1 - Generico com materiais e Intervencao sem proprios
Procedimento Generico A:

- Material 1
- Material 2

Intervencao 1 sem materiais proprios associada ao Generico A deve mostrar:

- Material 1 herdado
- Material 2 herdado

### 11.2 Cenario 2 - Generico sem materiais e Intervencao sem proprios
Procedimento Generico B:

- nenhum material

Intervencao 1 sem materiais proprios associada ao Generico B deve mostrar:

- lista vazia

### 11.3 Cenario 3 - Trocar de Generico com materiais para Generico sem materiais
Intervencao 1 estava associada ao Generico A:

- Material 1 herdado
- Material 2 herdado

Usuario troca para Generico B, que nao tem materiais.

Resultado correto:

- remover Material 1 herdado;
- remover Material 2 herdado;
- grade vazia, se nao houver proprios.

### 11.4 Cenario 4 - Trocar de Generico preservando proprios
Intervencao 1:

- Material local X

Generico A:

- Material 1
- Material 2

Generico B:

- Material 3

Ao trocar de A para B, Intervencao 1 deve mostrar:

- Material local X
- Material 3 herdado

Nao deve mostrar:

- Material 1;
- Material 2.

### 11.5 Cenario 5 - Material local nao contamina Generico
Intervencao 1 associada ao Generico A:

- Material 1 herdado
- Material X local

Ao abrir Generico A no modulo Procedimentos Genericos, deve mostrar:

- Material 1

Nao deve mostrar:

- Material X

### 11.6 Cenario 6 - Material local nao contamina outra Intervencao
Intervencao 1 associada ao Generico A:

- Material 1 herdado
- Material X local

Intervencao 2 associada ao mesmo Generico A deve mostrar:

- Material 1 herdado

Nao deve mostrar:

- Material X

### 11.7 Cenario 7 - Alteracao no Generico reflete por heranca
Generico A:

- Material 1 quantidade 1

Intervencao 1 associada ao Generico A:

- Material 1 herdado quantidade 1
- Material X local

Se alterar no Generico A:

- Material 1 quantidade 2

Intervencao 1 deve passar a mostrar:

- Material 1 herdado quantidade 2
- Material X local

Sem copiar nada para Intervencao.

### 11.8 Cenario 8 - Conflito por material_id
Generico A:

- Material 1 quantidade 1

Intervencao 1 tem proprio:

- Material 1 quantidade 5

Resultado correto:

- Material 1 quantidade 5 como proprio da Intervencao.

O proprio da Intervencao atual prevalece.

### 11.9 Cenario 9 - Abrir Intervencao diferente
Ao fechar/sair da Intervencao 1 e abrir Intervencao 2, qualquer estado local da Intervencao 1 deve ser descartado, exceto se for buscado novamente como dado proprio da Intervencao 1.

### 11.10 Cenario 10 - Generico vazio apos generico com materiais
Se o usuario seleciona um Generico com materiais e depois troca para um Generico vazio, a lista herdada deve ser limpa.

O sistema nao pode manter a lista anterior.

## 12. Checklist obrigatorio antes de qualquer correcao futura

Antes de mudar qualquer comportamento deste dominio, validar:

1. qual tela esta sendo alterada;
2. se o problema esta no Procedimento Generico ou na Intervencao;
3. se a lista atual e proprio, herdado ou composicao;
4. se o snapshot pertence ao procedimento ativo;
5. se o cache contem apenas materiais do generico;
6. se a troca de generico limpa herdados antigos;
7. se o material proprio da Intervencao atual esta preservado;
8. se a deduplicacao por `material_id` continua correta;
9. se o modal de duplicidade e o modal de edicao continuam distintos;
10. se nenhuma correcao textual foi misturada com correcao funcional;
11. se nenhum dado de outra Intervencao esta entrando na composicao;
12. se nenhum material local esta sendo promovido a herdado.

## 13. Checklist obrigatorio depois de qualquer correcao futura

Depois de qualquer correcao neste fluxo, confirmar:

1. `Procedimentos Genericos` salva sem erro;
2. `Intervencoes / Procedimentos` continua abrindo e recompondo a lista;
3. troca de generico remove herdados antigos;
4. generico vazio gera lista herdada vazia;
5. material proprio da Intervencao atual permanece;
6. material de outra Intervencao nao aparece;
7. duplo clique continua abrindo modal completo;
8. duplicidade continua bloqueada;
9. mensagem de duplicidade continua no modal proprio;
10. spin/quantidade continuam coerentes;
11. console sem erro novo;
12. nenhum texto visivel foi alterado fora do contrato autorizado.

## 14. Pontos tecnicos que auditorias futuras devem investigar

- origem da lista visual atual;
- origem do snapshot local;
- origem do cache do generico;
- separacao entre material proprio e herdado;
- contrato de `GET /procedimentos/{id}`;
- contrato de `GET /cadastros/procedimentos-genericos/detalhe/{id}`;
- fluxo de `PUT /cadastros/procedimentos-genericos/{id}`;
- fluxo de `POST/PUT/DELETE` de vinculos em Intervencoes;
- consistencia de `material_id` entre frontend e backend;
- validacao de clinica;
- persistencia incremental vs. reconstrucao total;
- criterios de deduplicacao;
- criterios de priorizacao do material proprio.

## 15. Riscos de continuar corrigindo sem respeitar o contrato

- voltar a contaminar Intervencoes com material de outra Intervencao;
- manter herdados antigos ao trocar o generico;
- tratar lista vazia como se fosse erro;
- duplicar materiais por uso indevido de snapshot;
- apagar material proprio da Intervencao atual;
- material local passar a aparecer no Generico;
- ajustar a tela certa usando a fonte errada de dados;
- mascarar falhas reais de cadastro com fallback perigoso;
- quebrar heranca por composicao;
- reintroduzir o alerta de tabela ou falhas de gravacao em fluxos validos.

## 16. Proxima etapa recomendada
Auditar a origem da lista, sem alterar codigo, validando em leitura:

- de onde o frontend monta a lista atual;
- quando o snapshot e invalidado;
- quando o cache do generico e limpo;
- se a recomposicao usa a Intervencao ativa;
- se a lista herdada vem vazia quando o generico nao possui materiais;
- se a lista final respeita proprio + herdado somente da origem atual.

