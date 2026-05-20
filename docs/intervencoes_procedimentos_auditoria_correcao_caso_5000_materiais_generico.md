# Intervencoes / Procedimentos - Auditoria de materiais fixos no caso 5000

## 1. Objetivo

Registrar a auditoria do caso `5000` da tabela `PARTICULAR`, apos a validacao de que a mudanca do combo de `Procedimento Generico` para `Selecione...` ainda nao produz, para esse registro, o efeito esperado pelo usuario final.

## 2. Estado inicial de referencia

- Branch: `modularizacao-segura-fase-1`
- Commit consolidado: `a18cb48 - Conclui modularizacao segura parcial de materiais`
- `git diff --stat` no inicio desta auditoria: mantinha somente alteracoes anteriores ja existentes no workspace
- `git diff --cached --stat`: vazio
- `git status --short`: mantinha pendencias untracked preexistentes e alteracoes anteriores nao relacionadas a esta auditoria

## 3. O que foi auditado

- `frontend/app.js`
- `backend/routes/procedimentos_routes.py`
- `backend/services/vinculos_materiais.py`
- `backend/models/procedimento.py`
- `backend/models/procedimento_generico.py`
- documentos de auditoria e consolidacao ja produzidos sobre Materiais, Procedimentos Genericos e Intervencoes

## 4. Resultado objetivo do caso 5000

### Identificacao encontrada

- Id interno principal: `40595`
- Codigo da intervencao/procedimento: `5000`
- Tabela: `PARTICULAR`
- `procedimento_generico_id`: `null`
- Vínculos diretos de materiais: `18`
- Materiais unicos: `17`
- Duplicidade interna: `1` item de `Babador Descartavel`

### Comparacao com o genérico legado

- O footprint dos materiais do `5000` coincide fortemente com o antigo genérico `00205 - Botox`
- A coincidencia foi considerada forte o bastante para classificar o caso como legado materializado, nao como um simples problema de recomposicao visual

## 5. Diagnostico tecnico

### O que o frontend faz hoje

- O editor usa o valor atual da combo de `Procedimento Generico` para recompor a grade.
- Quando a combo esta vazia, a recomposicao nao busca herdados novos.
- O frontend preserva o que esta gravado como vinculo direto do procedimento.

### O que o backend faz hoje

- O backend zera corretamente `procedimento_generico_id` quando o usuario salva `Selecione...`.
- O backend compoe `materiais_vinculados` com os vinculos diretos persistidos no procedimento mais os herdados do genérico atual.
- Se o procedimento esta sem genérico, a parte herdada fica vazia, mas os vinculos diretos permanecem.

### Conclusao do caso 5000

O comportamento observado no `5000` nao indica, por si so, uma falha de bind ou cache do frontend.
O caso aponta para **vínculos diretos ja materializados no banco como se fossem proprios**.

Em outras palavras:

- nao e apenas bug visual;
- nao e apenas bug de backend;
- nao e apenas dado isolado do frontend;
- e uma mistura de dado legado persistido com regra atual que respeita vinculos diretos existentes.

## 6. Separacao entre material proprio real e legado materializado

Pelo que foi auditado:

- materiais proprios reais devem permanecer quando a combo esta em `Selecione...`;
- materiais herdados antigos deveriam sair;
- no `5000`, os materiais que permanecem estao gravados como vinculos diretos;
- sem metadado confiavel de origem no vinculo historico, o sistema nao consegue provar que esses itens sao herdados antigos e nao proprios reais.

## 7. Auditoria ampla

Os documentos anteriores ja apontavam:

- `224` procedimentos distintos com `procedimento_generico_id` nulo/vazio e materiais vinculados;
- `6249` vinculos no total;
- `23` casos classificados como seguro provavel;
- `99` casos de revisao manual;
- `102` casos nao saneaveis automaticamente.

O `5000` esta dentro do grupo de **revisao manual obrigatoria**, nao do grupo seguro provavel.

## 8. Decisao tecnica desta etapa

Nao houve correcao funcional nesta etapa.

Motivo:

- qualquer tentativa de "limpar" apenas o `5000` ou os casos analogos sem classificar os vinculos legados poderia apagar materiais proprios reais;
- o problema principal aqui e de **classificacao/origem historica dos vinculos**, e nao um erro simples de UI;
- o saneamento amplo continua fora de escopo nesta fase;
- o reajuste de tabela nao foi tratado nesta etapa.

## 9. Recomendacao

A menor proxima etapa segura nao e mexer no fluxo visual de novo, e sim seguir para uma etapa separada de classificacao manual / saneamento controlado dos vinculos legados, com backup e rollback.

Se houver correcao funcional futura, ela deve vir acompanhada de:

- marcador confiavel de origem por vinculo ou outro metadado de classificacao;
- validacao humana do caso `5000`;
- analise dos demais casos com genérico nulo/vazio e materiais;
- checklist de regressao antes de qualquer escrita.

## 10. Confirmacoes

- Nenhum banco foi alterado.
- Nenhum schema foi alterado.
- Nenhuma migration foi alterada.
- Nenhum endpoint foi alterado.
- Nenhum `git add`, `git commit` ou `git push` foi executado.
- O namespace `frontend/js/modules/intervencoes-procedimentos.js` permaneceu passivo.
- Nenhuma funcao foi movida para o namespace.
- A blindagem textual/mojibake foi respeitada.

## 11. Onde testar

1. Fazer `Ctrl+F5`.
2. Abrir `Configuracoes > Tabelas > Intervencoes / Procedimentos...`.
3. Abrir a tabela `PARTICULAR`.
4. Abrir o procedimento `5000`.
5. Trocar `Procedimento Generico` para `Selecione...`.
6. Confirmar se os materiais permanecem.
7. Trocar para outro genérico com materiais.
8. Confirmar se a grade recomposta muda ou nao conforme o caso.
9. Verificar console e rede do navegador.

