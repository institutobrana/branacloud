# Fase 2 - Nova selecao documental de proximo bloco leve apos consolidacao de CID

- Data: 2026-05-25
- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`

## Objetivo

Fazer uma nova selecao documental de proximo bloco leve apos a consolidacao de CID, priorizando fronteiras claras, baixo risco e possibilidade de helper passivo com contrato antes de qualquer implementacao.

## Contexto

Esta etapa sucede a consolidacao documental de CID.

- `CID` ficou pausado/consolidado por ora.
- `compararTextoCid` foi consolidado no filtro local.
- O teste manual do usuario passou.
- O ganho obtido em CID foi arquitetural/de delegacao segura.
- Nao houve nova alteracao funcional na etapa de consolidacao.

## Frentes pausadas/consolidadas

Frentes que nao devem ser reabertas sem justificativa forte:

- Agenda de contatos;
- Agenda principal;
- Prestadores;
- Preferencias / Configuracoes comuns;
- Plano de Contas;
- CID.

## Candidatos avaliados

- Cadastros auxiliares;
- Medicamentos;
- Etiquetas;
- Convenios e Planos;
- Outro bloco leve identificado no roadmap: nenhum com fronteira mais clara do que os quatro acima nesta rodada.

## Classificacao multi-area resumida

- Cadastros auxiliares: comum/core administrativo/transversal.
- Medicamentos: especifico de area profissional.
- Etiquetas: comum/core administrativo/transversal.
- Convenios e Planos: misto/depende de contexto.

## Estado atual conhecido de cada candidato

### Cadastros auxiliares

- Existe modulo em `frontend/js/modules/auxiliares.js`.
- O fluxo ainda depende bastante de `frontend/app.js`.
- Ja teve etapas anteriores de modularizacao e encerramento de helpers.
- Esta parcialmente extraido e consolidado, mas ainda com scaffold compartilhado com Plano de Contas e uso de `cadModal`.
- Existem documentos anteriores relevantes de mapeamento, fronteiras, helpers puros e encerramento de ciclo.

### Medicamentos

- Existe modulo em `frontend/js/modules/medicamentos.js`.
- O fluxo ainda depende bastante de `frontend/app.js`.
- Ja teve ciclo anterior de helpers, validacao e encerramento.
- Esta parcialmente extraido e consolidado, com CRUD proprio, modal, filtros e carregamento remoto.
- Existem documentos anteriores relevantes de mapeamento, helpers textuais e encerramento de ciclo.

### Etiquetas

- Existe modulo em `frontend/js/modules/etiquetas.js`.
- O fluxo ainda depende de `frontend/app.js`, mas o modulo passivo ja cobre helpers puros e contratos.
- Ja teve etapas anteriores de mapeamento, namespace passivo, fronteiras, helpers puros, integracao e encerramento de ciclo.
- Esta mais madura em helpers puros do que os demais candidatos.
- Existem documentos anteriores relevantes de toda a sequencia de subetapas.

### Convenios e Planos

- Existe modulo em `frontend/js/modules/convenios-planos.js`.
- O fluxo ainda depende de `frontend/app.js`.
- Ja teve mini ciclo documental e fechamento.
- Continua mais sensivel por faturamento/calendario e scaffold compartilhado.
- Existem documentos anteriores relevantes de retoma, helpers, wrappers e fechamento.

## Possiveis recortes leves por candidato

### Cadastros auxiliares

- helpers puros de cor/apresentacao;
- normalizacoes locais;
- transformacoes de lista;
- validacoes simples sem DOM.

### Medicamentos

- normalizacoes textuais locais;
- comparacoes/filtros puros;
- validacoes pequenas de entrada;
- transformacoes de lista sem mexer no payload efetivo.

### Etiquetas

- `etqResolverArquivoPadrao(padraoId)`;
- `etqArquivosOrdenados()`;
- transformacoes puras de resolucao de padrao/arquivo;
- pequenos helpers de apoio sem DOM/requestJson/salvamento.

### Convenios e Planos

- normalizacoes textuais;
- validacoes pequenas;
- wrappers de fallback;
- recortes existem, mas o risco funcional e maior.

## Riscos por candidato

### Cadastros auxiliares

- DOM e modal comuns ao shell;
- scaffold compartilhado com Plano de Contas;
- uso de `cadModal`;
- risco de afetar rotas e dependencias auxiliares.

### Medicamentos

- DOM e modal;
- requestJson frequente;
- payload e salvamento;
- exclusao e duplo clique;
- risco de tocar em fluxo funcional ja validado.

### Etiquetas

- preview e modal proprios;
- impressao e selecao de padrao;
- risco baixo/medio se o recorte ficar restrito a helper puro.

### Convenios e Planos

- calendario/faturamento;
- modais e fluxo sensivel;
- risco maior do que parece na primeira leitura.

## Ganho esperado por candidato

### Cadastros auxiliares

- ganho real moderado, mas menor por causa do scaffold compartilhado;
- delegacao arquitetural possivel, porem menos limpa.

### Medicamentos

- ganho real moderado;
- delegacao segura possivel, mas o fluxo e mais pesado que Etiquetas.

### Etiquetas

- ganho real pequeno, mas util;
- delegacao arquitetural clara;
- boa reducao de ruido em `frontend/app.js` sem alterar comportamento.

### Convenios e Planos

- ganho real existe;
- porem o risco operacional e maior, entao nao compensa nesta rodada.

## Classificacao de risco

- Cadastros auxiliares: medio.
- Medicamentos: medio.
- Etiquetas: baixo/medio.
- Convenios e Planos: medio-alto.

## Comparacao final

- `Cadastros auxiliares` e comum/core administrativo, mas compartilha scaffold com Plano de Contas e nao e o bloco mais limpo nesta rodada.
- `Medicamentos` tem fronteira funcional clara, mas e mais pesado por CRUD, modal e `requestJson`.
- `Etiquetas` oferece o recorte leve mais bem isolado para uma nova decisao documental, com helper puro ainda delegavel e risco menor que os demais candidatos.
- `Convenios e Planos` continua mais sensivel por faturamento/calendario.

## Recomendacao escolhida

**C. Etiquetas como proxima frente documental.**

## Justificativa tecnica

`Etiquetas` e o melhor equilibrio entre risco baixo/medio, fronteira clara e possibilidade de um helper passivo futuro com contrato proprio. Os demais candidatos trazem mais acoplamento compartilhado, mais CRUD sensivel ou mais risco funcional. A escolha continua conservadora porque a recomendacao e primeiro documentar o contrato de um helper puro de apoio, sem implementar nada agora.

## Contrato futuro sugerido

O candidato mais promissor para a proxima decisao documental e `etqResolverArquivoPadrao(padraoId)` ou uma variacao equivalente de resolucao local de padrao/arquivo com fallback.

Assinatura conceitual sugerida:

`etqResolverArquivoPadrao(padraoId)`

Objetivo futuro:

- resolver o arquivo padrao de forma local e previsivel;
- manter comportamento atual;
- permanecer passivo;
- nao tocar em DOM, preview, modal, requestJson ou salvamento.

## Proxima subetapa recomendada

`Etiquetas - Contrato documental do proximo helper leve ou transformacao segura`.

## Onde testar futuramente se houver implementacao

Qualquer futura implementacao em Etiquetas deve ser testada em `Etiquetas / Configuracao de modelos de etiqueta`.

Teste futuro esperado:

- abrir a tela de Etiquetas;
- validar listagem;
- validar selecao;
- validar modal de edicao;
- validar preview;
- validar teste de impressao;
- confirmar console limpo;
- fazer regressao rapida em CID, Plano de Contas e Medicamentos;
- confirmar que nao houve mudanca visual nem comportamental.

## Confirmacao de que nenhuma alteracao de codigo foi feita

Esta etapa foi exclusivamente documental. Nenhum arquivo de codigo foi alterado.

## Confirmacao de blindagem textual/mojibake

Nao houve correcao de textos visiveis, acentos, labels, placeholders, mensagens de interface ou mojibake.

## Commit seletivo obrigatorio

Se houver commit nesta etapa, ele deve conter somente:

- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_nova_selecao_blocos_leves_pos_cid.md`

## Registro para roadmap

Registrar no roadmap que:

- CID foi consolidado/pausado por ora;
- foi realizada nova selecao documental de blocos leves;
- os candidatos avaliados foram Cadastros auxiliares, Medicamentos, Etiquetas e Convenios e Planos;
- a classificacao multi-area resumida foi registrada;
- a recomendacao escolhida foi Etiquetas;
- a proxima subetapa recomendada e contrato documental para um helper leve de Etiquetas;
- nao houve alteracao de codigo;
- a blindagem textual/mojibake foi respeitada.
