# Correcao - Redimensionamento do modal Detalhes do usuario

Data: 2026-07-22

## Escopo

Correcao exclusivamente visual no modal `ADM -> Usuarios -> Ver detalhes`.

Nao foram alterados backend, banco, migration, endpoint, normalizador, selecao, toolbar, tabela, coluna `Online`, exportacao CSV, autenticacao, AWS, commit ou push.

## Modal auditado

Arquivo principal:

- `frontend-react/src/features/admin/users/components/UserDetailsModal.jsx`

CSS:

- `frontend-react/src/features/admin/admin.css`

Referencias compactas avaliadas:

- `frontend-react/src/features/unidadesAtendimento/components/UnidadeAtendimentoModal.jsx`
- `frontend-react/src/features/unidadesAtendimento/unidadesAtendimento.css`
- `frontend-react/src/features/servicosProtetico/components/ServicoProteticoModal.jsx`
- `frontend-react/src/features/servicosProtetico/servicosProtetico.css`
- regras globais de modais em `frontend-react/src/styles/globals.css`

## Dimensoes anteriores

Origem encontrada:

- largura externa: `width={760}` em `UserDetailsModal.jsx`;
- `min-width`: nao definido no componente;
- `max-width`: nao definido no componente;
- altura fixa: nao definida;
- `max-height`: nao definido no componente;
- body: apenas `padding-top: 10px` em `admin.css`, herdando paddings padrao do Ant Design;
- header/footer: herdados do Ant Design;
- gap entre secoes: `14px`;
- gap interno da secao: `8px`;
- aviso protegido: `padding: 10px 12px`, `gap: 8px`, `margin-bottom: 14px`;
- grade: `Descriptions` com `column={2}`, herdando padding/line-height do Ant Design;
- scroll interno: nao definido no modal especifico;
- breakpoint: inexistente para o modal de detalhes.

## Dimensoes novas

Aplicado:

- largura React: `width={660}`;
- largura CSS: `width: min(660px, calc(100vw - 32px))`;
- `max-height` do conteudo do modal: `74vh`;
- body rolavel: `max-height: calc(74vh - 94px)`, `overflow-y: auto`, `overflow-x: hidden`;
- header: `padding: 8px 16px 4px`;
- titulo: `18px`, `line-height: 1.15`;
- close nativo: area reduzida para `28px`;
- footer: `padding: 6px 12px 8px`;
- botao `Fechar`: `size="small"`, `height: 26px`, fonte `12px`;
- aviso protegido: `padding: 6px 8px`, `gap: 6px`, `margin-bottom: 8px`;
- badge: fonte `11px`, altura minima `20px`;
- secoes: `gap: 8px`;
- titulos de secao: `15px`, `line-height: 1.15`;
- gap interno de secao: `4px`;
- celulas da grade: `padding: 5px 7px`, `line-height: 1.2`;
- labels: `12px`, largura alvo `112px`;
- valores: `13px`, quebra controlada com `overflow-wrap: anywhere`;
- grid desktop/tablet: duas colunas por `column={{ xs: 1, sm: 1, md: 2 }}`;
- breakpoint ate `900px`: modal com `width: calc(100vw - 20px)`, altura maxima `82vh`, body rolavel e layout em uma coluna.

## Conteudo preservado

As secoes seguem preservadas:

- Identificacao;
- Conta;
- Vinculos;
- Sistema.

Os campos continuam vindo de `buildAdminUserDetailsSections(user)` e nenhum campo foi removido, unido ou reordenado.

Preservado:

- badge `Protegido`;
- usuario sistemico;
- conta proprietaria;
- presenca `Online`;
- ultima atividade;
- campos ausentes como `Nao disponivel`;
- modal somente leitura;
- fechamento por botao, close nativo e Escape do Ant Design.

## Tema e acessibilidade

A correcao reutiliza tokens existentes:

- `var(--brana-surface-card)`;
- `var(--brana-border-subtle)`;
- `var(--brana-text-secondary)`;
- `var(--brana-text-primary)`.

Nao houve hardcode de bloco branco para modo escuro. Header, body e footer continuam herdando as regras globais de modal para claro/escuro.

## Testes

Atualizado:

- `frontend-react/tests/adminUsersDetails.test.js`

Cobertura adicionada:

- largura compacta;
- max-height;
- body rolavel;
- header/footer compactos;
- aviso protegido compacto;
- grade compacta;
- duas colunas em desktop;
- uma coluna no breakpoint;
- ausencia de acoes mutaveis;
- preservacao de conteudo read-only.

## Runtime

A validacao runtime autenticada ainda depende de sessao MASTER acessivel no navegador local. A implementacao foi preparada para validacao visual em `/app/adm/usuarios`, selecionando um usuario comum e um usuario sistemico/protegido.

Nao houve request novo para abrir detalhes; o modal continua usando dados ja carregados pela listagem.

## Git

Sem commit e sem push nesta correcao.

## Segunda compactacao visual

Em 2026-07-22, foi aplicada uma segunda etapa de compactacao porque o modal ainda era percebido como grande.

Dimensoes alteradas:

- largura React: de `660` para `580`;
- largura CSS: de `width: min(660px, calc(100vw - 32px))` para `width: min(580px, calc(100vw - 24px))`;
- `max-height`: de `74vh` para `66vh`;
- body: de `max-height: calc(74vh - 94px)` para `max-height: calc(66vh - 78px)`;
- padding do body: de `6px 12px 8px` para `5px 9px 6px`;
- header: de `8px 16px 4px` para `6px 12px 3px`;
- titulo: de `18px` para `17px`;
- footer: de `6px 12px 8px` para `4px 9px 6px`;
- botao `Fechar`: de `26px` para `24px`;
- aviso `Protegido`: de `6px 8px` para `4px 6px`;
- gap entre secoes: de `8px` para `6px`;
- gap interno de secao: de `4px` para `3px`;
- titulos de secao: de `15px` para `14px`;
- celulas: de `5px 7px` para `3px 5px`;
- labels: de `12px` para `11px`, largura alvo de `112px` para `98px`;
- valores: de `13px` para `12px`;
- breakpoint do modal: separado em `760px`, com largura `calc(100vw - 16px)`.

Preservado:

- todas as secoes;
- todos os campos;
- duas colunas no desktop;
- uma coluna em telas menores;
- body rolavel;
- ausencia de scroll horizontal;
- tema claro/escuro por tokens;
- fechamento por botao, close nativo e Escape;
- ausencia de request adicional.

## Terceira correcao visual - remover scroll no desktop

Em 2026-07-22, foi aplicada uma terceira correcao visual porque a segunda compactacao deixou o modal estreito e gerou scrollbar interna em desktop normal.

Problema observado:

- largura `580px` reduzia demais os valores;
- `max-height: 66vh` forçava rolagem;
- `overflow-wrap: anywhere` quebrava e-mail, clinica, plano, trial e ultima atividade em varias linhas;
- as secoes `Vinculos` e `Sistema` podiam ficar abaixo da area visivel.

Ajuste aplicado:

- largura React: de `580` para `680`;
- largura CSS: de `width: min(580px, calc(100vw - 24px))` para `width: min(680px, calc(100vw - 24px))`;
- `max-height` desktop: de `66vh` para `calc(100vh - 24px)`;
- body desktop: removido `max-height` fixo e `overflow-y: auto`; agora usa altura natural com `overflow-y: visible`;
- header: `4px 10px 2px`, titulo `16px`;
- footer: `3px 8px 4px`, botao `Fechar` com `22px`;
- aviso `Protegido`: `3px 5px`, texto em uma linha com ellipsis e tooltip;
- secoes: gap `4px`;
- titulos: `13px`, `line-height: 1`;
- celulas: `2px 4px`, `line-height: 1.05`;
- labels: `10px`, proporcao de coluna `16%`;
- valores: `11px`, proporcao de coluna `34%`;
- removido `overflow-wrap: anywhere` global dos valores;
- campos longos recebem ellipsis com tooltip:
  - e-mail;
  - clinica;
  - e-mail da clinica;
  - plano;
  - trial;
  - ultima atividade.

Responsividade:

- desktop normal: sem scrollbar interna esperada;
- breakpoint `760px`: largura `calc(100vw - 16px)`, `max-height: calc(100vh - 16px)` e scroll vertical interno permitido;
- scroll horizontal continua bloqueado.

Sem commit e sem push nesta terceira correcao.

## Ajuste visual final - distribuicao horizontal

Em 2026-07-22, foi aplicado o ajuste visual final solicitado para melhorar a distribuicao horizontal sem alterar a altura aprovada.

Problema restante:

- largura `680px` ainda deixava alguns labels e valores apertados;
- `E-mail`, `E-mail da clinica`, `Ultimo acesso` e datas podiam ficar estreitos;
- a secao `Sistema` ficava mal distribuida horizontalmente.

Ajuste aplicado:

- largura React: de `680` para `800`;
- largura CSS: de `width: min(680px, calc(100vw - 24px))` para `width: min(800px, calc(100vw - 24px))`;
- distribuicao das colunas: de `label 16% / valor 34%` para `label 14% / valor 36%`;
- ellipsis e tooltips de campos longos foram preservados;
- `overflow-wrap: anywhere` permanece removido dos valores.

Preservado sem alteracao nesta etapa:

- altura natural;
- `max-height: calc(100vh - 24px)`;
- desktop sem `overflow-y` forcado;
- fallback mobile com scroll interno;
- header;
- body vertical;
- footer;
- padding vertical;
- altura das linhas;
- tamanho das fontes;
- ordem e quantidade de campos.

Sem commit e sem push nesta etapa.

## Ajuste visual final - respiro entre blocos

Em 2026-07-22, foi aplicado um refinamento visual final sobre o modal ja aprovado.

Ajuste aplicado:

- espacamento uniforme entre secoes alterado de `4px` para `8px`;
- distancia interna entre titulo da secao e sua propria grade preservada em `2px`;
- labels internos alterados de `10px` para `11px`;
- valores internos alterados de `11px` para `12px`;
- titulos das secoes preservados em `13px`;
- titulo do modal, header, body, footer e botao `Fechar` preservados.

Preservado:

- largura React `800`;
- `width: min(800px, calc(100vw - 24px))`;
- altura natural;
- `max-height: calc(100vh - 24px)`;
- grade comum de seis trilhas;
- `grid-template-columns`;
- alinhamento horizontal;
- ordem e quantidade de campos;
- presenca online;
- protecao;
- responsividade e breakpoint `760px`;
- ausencia de scroll horizontal;
- desktop sem scroll vertical forcado.

Sem commit e sem push nesta etapa.

## Correcao estrutural final - grade comum de seis trilhas

Em 2026-07-22, foi aplicada uma correcao estrutural final sem alterar a largura geral aprovada de `800px` e sem alterar a altura natural do modal.

Problema encontrado:

- a grade anterior ainda dependia de `Descriptions` do Ant Design com duas colunas por linha;
- cada secao podia distribuir pares de rotulo/valor de forma diferente;
- a secao `Sistema`, com tres datas e `Protecao`, deixava `Ultimo acesso` e o valor `Nao disponivel` comprimidos em coluna estreita;
- a linha `Protecao | Proprietario/Padrao/Sistema` nao seguia a mesma regua visual das secoes anteriores.

Ajuste aplicado:

- `UserDetailsModal.jsx` passou a renderizar uma grade propria por secao;
- a regra comum usa seis trilhas horizontais: `Rotulo 1 | Valor 1 | Rotulo 2 | Valor 2 | Rotulo 3 | Valor 3`;
- o CSS usa `grid-template-columns` com tres pares repetidos: rotulo `12%` e valor aproximadamente `21.33%`;
- todos os blocos, incluindo `Sistema`, passam a compartilhar as mesmas divisoes verticais;
- no mobile, a grade retorna para um par por linha por meio do breakpoint existente de `760px`.

Preservado:

- largura React `800`;
- `width: min(800px, calc(100vw - 24px))`;
- altura natural;
- `max-height: calc(100vh - 24px)`;
- `overflow-y: visible` no desktop;
- fallback mobile com `overflow-y: auto`;
- header, body, footer, padding vertical, altura das linhas e tamanho das fontes;
- campos, secoes, presenca online, protecao, ellipsis e tooltips.

Sem commit e sem push nesta etapa.
