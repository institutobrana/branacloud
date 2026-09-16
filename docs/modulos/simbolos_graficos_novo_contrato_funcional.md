# Contrato Funcional - Simbolos Graficos - Novo

## Objetivo
Definir o contrato funcional seguro para o modal `Configuracoes > Simbolos graficos > Novo`, com base nas evidencias do EasyDental Desktop, do Brana Cloud legado, do backend atual e do React atual.

## Autoridade
1. EasyDental Desktop
2. Brana Cloud legado
3. Backend atual
4. React atual

## Estados do fluxo
- fechado
- novo inicial
- biblioteca aberta
- desenho personalizado
- valido
- invalido
- salvando
- erro
- sucesso

## Titulo confirmado do modal
- `Edita simbolo grafico`

Observacao:
- O titulo visual do mock legado ja existe.
- A implementacao React pode adaptar a linguagem visual, mas nao deve alterar a semantica do fluxo.

## Campos do modal

### 1. Nome do simbolo
- Nome tecnico: `descricao`
- Obrigatorio: sim
- Tipo: texto curto
- Valor inicial: vazio
- Validacao:
  - nao pode ficar vazio
  - nao pode conter apenas espacos
- Persistencia: `descricao`

### 2. Tipo do simbolo
- Nome tecnico: `tipo_simbolo`
- Obrigatorio: sim no contrato funcional
- Tipo: seletor de opcao
- Valor inicial sugerido: `2` para novos simbolos do usuario
- Opcoes comprovadas funcionalmente:
  - Sistema
  - Definido pelo usuario
- Regra:
  - o tipo de sistema representa catalogo oficial
  - o tipo do usuario representa simbolo criado pela clinica/usuario

### 3. Especialidade
- Nome tecnico: `especialidade`
- Obrigatorio: nao comprovado como obrigatorio para criacao
- Tipo: seletor ou acao de selecao
- Valor inicial: vazio ou default do catalogo, dependendo do contrato final do fluxo
- Fonte:
  - catalogo de especialidades ativas do backend
  - snapshot EasyDental
- Persistencia: numero/codigo de especialidade

### 4. Forma de marcacao no odontograma
- Nome tecnico: `tipo_marca`
- Obrigatorio: sim como parte do contrato funcional
- Tipo: seletor
- Valor inicial: precisa seguir a regra do desktop/legado; na ausencia de prova final, nao assumir qualquer padrao visual
- Opcoes comprovadas no backend atual:
  - Face
  - Dente
  - Grupo
  - Arcada
  - Geral
  - Segmento

### 5. Desenho
- Nome tecnico: `bitmap1`, `bitmap2`, `bitmap3`, `icone`, `imagem_custom`
- Obrigatorio: nao comprovado como obrigatorio em todos os casos
- Tipo: preview + editor/biblioteca
- Valor inicial: vazio ou imagem base do catalogo, conforme tipo escolhido
- Persistencia:
  - `bitmap1`, `bitmap2`, `bitmap3`, `icone` quando o simbolo deriva de bitmap catalogado
  - `imagem_custom` quando o usuario salva um desenho proprio

### 6. Biblioteca de simbolos
- Nome tecnico: nao unico; depende do catalogo retornado pela API
- Obrigatorio: nao
- Tipo: grid/lista selecionavel
- Regra:
  - deve expor catalogo visual e permitir selecao de simbolo base
  - pode variar por tipo e por especialidade

### 7. Acoes de desenho
- Limpar desenho
- Editar/criar desenho

Essas acoes existem como evidencias visuais e como parte do contrato esperado, mas o comportamento final do desktop nao foi comprovado integralmente nesta rodada.

## Regras funcionais

### Sistema versus usuario
- `tipo_simbolo = 1` representa sistema/catalogo oficial.
- `tipo_simbolo = 2` representa simbolo de usuario/clinica.
- Simbolos de sistema nao podem ser excluidos.
- Simbolos de sistema sao derivados do catalogo oficial do EasyDental.

### Especialidade
- O contrato funcional aceita especialidade por codigo.
- O backend atual mapeia especialidades de `1..13`.
- O React atual ja resolve nomes de especialidade a partir do backend e de um mapa local.

### Forma de marcacao
- A forma de marcacao e funcional, nao apenas textual.
- Ela determina como o simbolo sera aplicado no odontograma.
- As labels hoje expostas pelo backend atual sao as bases a usar para o contrato:
  - Face
  - Dente
  - Grupo
  - Arcada
  - Geral
  - Segmento

### Desenho e biblioteca
- O desenho e um ativo funcional do simbolo.
- A biblioteca de simbolos deriva de bitmaps do acervo.
- O preview pode mostrar imagem base, bitmap ou imagem customizada.

## Contrato de validação

### Validacoes confirmadas
- `descricao` nao vazia
- `descricao` sem apenas espacos
- `codigo` ou base de identificacao obrigatoria no backend para simbolo de usuario
- `tipo_simbolo` dentro do conjunto permitido
- `tipo_marca` dentro do conjunto permitido
- bloqueio de exclusao de simbolo de sistema

### Validacoes ainda nao totalmente comprovadas
- tamanho maximo exato do nome no modal Novo
- obrigatoriedade estrita da especialidade
- obrigatoriedade estrita do desenho
- confirmacao de sobrescrita quando o usuario trocar imagem
- comportamento exato de limpar/excluir desenho

## Persistencia

### Backend atual
Rota:
- `POST /cadastros/simbolos-graficos`

Payload base confirmado pelo backend:
- `descricao`
- `legacy_id`
- `codigo`
- `especialidade`
- `tipo_simbolo`
- `tipo_marca`
- `sobreposicao`
- `icone`
- `bitmap1`
- `bitmap2`
- `bitmap3`
- `imagem_custom`

### Regras de retorno
- O backend retorna dados basicos do item criado.
- O frontend deve atualizar a lista e selecionar o item criado.

## Comportamento esperado do Novo

### Ao abrir
- mostrar modal limpo
- nao reaproveitar estado anterior
- focar o primeiro campo editavel

### Ao confirmar
- validar campos
- evitar dupla submissao
- persistir via POST existente
- fechar apenas apos sucesso
- recarregar tabela
- atualizar contador/rodape
- manter o questionario/shell selecionado

### Ao cancelar
- fechar sem persistir
- limpar estado local
- nao manter valores da abertura anterior

## Contrato do backend para o modal Novo

### Endpoint
- `POST /cadastros/simbolos-graficos`

### Autenticacao e tenant
- autenticado
- filtrado por `current_user.clinica_id`
- protegido por `require_module_access("procedimentos")`

### Respostas e erros
- `200/201`: sucesso com item criado
- `400`: validacao de payload, duplicidade ou regra de sistema
- `404`: simbolo inexistente na clinica
- `409`: exclusao bloqueada para simbolo de sistema

## Lacunas
- Nao foi comprovada a hierarquia exata entre biblioteca, editor e desenho custom no desktop original.
- Nao foi comprovado se o desktop permitia criar simbolo de sistema manualmente.
- Nao foi comprovado se o preview do desenho usa BMP puro, PNG convertido, data URI ou ambos.

## Decisao funcional recomendada
- Deve ser igual ao EasyDental:
  - semantica de sistema/usuario
  - catalogo oficial
  - tipo de marcacao funcional
  - relacao com especialidade e odontograma
  - protecao de simbolo de sistema
- Pode ser adaptado ao React:
  - layout do modal
  - componentes de biblioteca
  - acessibilidade
  - feedback visual
- Nao deve ser reproduzido:
  - dependencias obscuras do desktop
  - regras nao comprovadas
  - comportamento inseguro sem tenant
