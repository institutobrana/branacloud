# Contrato funcional dos campos do modal `Novo tratamento`

## 1. Objetivo

Registrar, campo por campo, o comportamento atual do modal `Novo tratamento` no Brana Cloude e o comportamento esperado do ponto de vista documental quando houver referencia disponivel do EasyDental.

Este documento nao implementa correcoes.
Este documento nao altera frontend, backend, banco, seeds, migrations ou persistencia.

## 2. Base documental usada

- `docs/contrato_tecnico_modulo_tratamento.md`
- `docs/contrato_layout_comportamento_tela_novo_tratamento.md`
- `docs/implementacao_visual_modal_novo_tratamento.md`
- `docs/validacao_visual_modal_novo_tratamento.md`
- `docs/11_roadmap_desenvolvimento.md`
- `frontend/js/modules/novo-tratamento-modal.js`
- `frontend/app.js`
- `frontend/index.html`

## 3. Estado atual do modal

O modal atual:

- abre pelo menu `Tratamento -> Novo tratamento`;
- exibe as abas `Principal` e `Convenio`;
- abre na aba `Principal` por padrao;
- centraliza a janela em estilo classico;
- usa valores padrao visuais definidos no modulo JS e, quando existe paciente em uso, carrega o payload de combos do backend para preencher os campos principais;
- abre com `Inclusao` e `Alteracao` vazios;
- grava/atualiza o tratamento pelo botao `Ok` quando ha paciente em uso;
- preenche `Inclusao` como `DD/MM/AAAA - apelido` na primeira gravacao;
- preenche `Alteracao` como `DD/MM/AAAA - apelido` nas gravacoes subsequentes do mesmo tratamento;
- fecha por `Cancela`, `X`, `ESC` e clique fora; o botao `Ok` executa a persistencia.

## 4. Lista de campos auditados

Campos da aba `Principal` auditados nesta etapa:

1. Inicio
2. Finalizacao
3. Situacao
4. Tabela principal
5. Indice
6. Cirurgiao responsavel
7. Unidade de atendimento
8. Observacoes
9. Inclusao
10. Alteracao
11. Idade
12. Arcada predominante
13. Copiar intervencoes a realizar do tratamento anterior
14. Botao Ok
15. Botao Cancela

## 5. Tabela campo por campo com comportamento atual x comportamento esperado

| Campo | Tipo visual atual | Valor atual no Brana | Origem atual do valor no Brana | Comportamento atual | Comportamento esperado conforme EasyDental / doc | Dependencia de dados ou backend | Risco de implementar agora | Classificacao |
|---|---|---|---|---|---|---|---|---|
| Inicio | campo de data com digitacao e calendario popup | data atual em `dd/mm/aaaa` | `todayBR()` no modulo visual, validado e exibido em `DD/MM/AAAA` | abre preenchido, aceita digitacao valida em `DD/MM/AAAA`, abre calendario por botao/F4/Alt+Seta para baixo e reverte valor invalido no blur | esperado como data de inicio do novo tratamento com comportamento de data real, nao apenas texto | nenhuma persistencia; pode depender apenas de sessao/local quando houver regra futura | baixo para visual, medio se virar regra de negocio | apenas visual |
| Finalizacao | campo de data com digitacao e calendario popup | vazio | valor padrao vazio no modulo visual | abre vazio, aceita digitacao valida em `DD/MM/AAAA`, abre calendario por botao/F4/Alt+Seta para baixo e reverte valor invalido no blur | esperado vazio na abertura, mas com comportamento de data real; quando `Situacao` vira `Finalizado`, recebe a data vigente | nenhuma no estado atual | baixo | apenas visual |
| Situacao | combo | `Aberto` | default fixo no modulo visual | abre com `Aberto` | esperado conforme layout documental; base atual sugere `Aberto`; lista `Aberto`, `Finalizado` e `Interrompido` | pode depender de regras futuras de status | medio se regras de estado forem alteradas sem confirmacao | pendente de confirmacao do usuario |
| Tabela principal | combo | preferencia do usuario no modulo Preferencias, com fallback `PARTICULAR` | `preferences/general.tabela_padrao_id` quando presente; fallback visual do modal | lista todas as tabelas disponiveis e abre com a tabela preferida do usuario | esperado como tabela principal da conta; doc cita `PARTICULAR` no layout, mas a preferencia do usuario define a selecao inicial | depende da preferencia geral do usuario e do catalogo de tabelas da clinica | medio se a preferencia estiver ausente ou apontar para tabela invalida | depende de tabela/convênio |
| Indice | combo | `R$`, `UHO`, `UPO`, `USO` | lista do modulo financeiro | abre com `R$` | esperado como indice padrao da tela e deve refletir os índices financeiros da clinica | pode depender de catalogo de indices | medio se houver regra de troca automatica | depende de tabela/convênio |
| Cirurgiao responsavel | combo | prestador ativo da clinica, com valor persistido por `usuario_id` quando houver vinculo ou por nome quando nao houver | catalogo de `Prestadores` ativos trazido do endpoint de combos; label prioriza `apelido`/`nome` | lista prestadores ativos com ou sem vinculo operacional e permite troca visual | doc indica que deve vir do prestador atual quando houver fonte segura | depende do cadastro de prestadores e do vinculo usuario/prestador apenas para preferencia do valor salvo | medio se existir regra futura de persistencia mais restritiva | depende de prestador ativo |
| Unidade de atendimento | combo | unidade ativa do cadastro, com preferencia pela unidade vinculada ao usuario atual | catalogo de `UnidadeAtendimento` ativas; valor inicial tenta seguir `usuario.unidade_atendimento_id` | lista somente unidades ativas cadastradas e permite troca visual | doc indica que deve vir da clinica/unidade atual quando houver fonte segura | depende do cadastro de unidades e do vinculo de unidade do usuario apenas para preferencia do valor salvo | medio se houver unidade ativa sem vinculacao no usuario | depende de unidade ativa |
| Observacoes | textarea | vazio | default vazio no modulo visual | permite texto livre | esperado como area de observacoes do tratamento | pode depender de persistencia futura, mas hoje e apenas visual | baixo para visual; alto se entrar em salvar sem contrato | apenas visual |
| Inclusao | input readonly com fundo ciano | vazio na abertura; apos `Ok` passa a `DD/MM/AAAA - apelido` | resposta de persistencia do tratamento | nao editavel | na primeira gravacao deve refletir a inclusao do tratamento | depende da resposta de gravacao | medio | auditavel e persistente |
| Alteracao | input readonly com fundo ciano | vazio na abertura; apos edicao e novo `Ok` passa a `DD/MM/AAAA - apelido` | resposta de atualizacao do tratamento | nao editavel | deve permanecer vazio ate haver alteracao posterior | depende da resposta de atualizacao | medio | auditavel e persistente |
| Idade | input readonly com fundo ciano | `64a 6m` | valor fixo no modulo visual | nao editavel | doc/layout indicam que deve ser calculada futuramente a partir do paciente | depende de paciente selecionado e da data de nascimento | alto se virar valor fixo fora do paciente | depende de paciente selecionado |
| Arcada predominante | combo | `Copiar do tratamento anterior` | default fixo no modulo visual | abre com valor unico documentado e aceita trocas visuais | layout documentado aponta esse texto como valor visual padrao | pode depender do tratamento anterior e da regra de arcada | medio se o comportamento real divergir | depende de tratamento anterior |
| Copiar intervencoes a realizar do tratamento anterior | checkbox | desmarcado | default falso no modulo visual | alterna estado visual apenas | esperado como copia do tratamento anterior, sem detalhes finos fechados ainda | depende de tratamento anterior e da regra de copia | alto se for ligado a copia real sem contrato final | depende de tratamento anterior |
| Botao Ok | botao | texto `Ok` | markup fixo | fecha a janela sem salvar | doc atual aceita comportamento neutro na etapa visual | nao deve depender de backend nesta fase | alto se tentar salvar sem contrato | depende de persistência real |
| Botao Cancela | botao | texto `Cancela` | markup fixo | fecha a janela sem salvar | esperado fechar sem salvar | nenhuma, deve permanecer sem persistencia | baixo | apenas visual |

## 6. Campos que podem ser corrigidos com baixo risco

- `Finalizacao`, se for apenas ajuste de valor padrao visual;
- `Observacoes`, se houver refinamento de altura ou espaco;
- `Botao Cancela`, se houver ajuste fino de posicao ou estilo;
- `Botao Ok`, desde que continue sem persistencia real;
- `Inicio`, apenas se a navegacao do calendario precisar de ajuste fino.

## 7. Campos que dependem de paciente selecionado

- `Idade`

## 8. Campos que dependem de backend/banco

- `Inclusao`
- `Alteracao`
- `Cirurgiao responsavel`, se a fonte correta envolver prestadores ativos sem vinculo usuario/prestador ou a regra de persistencia nome/id;
- `Unidade de atendimento`, se a fonte correta for a unidade ativa do cadastro ou a unidade vinculada ao usuario;
- `Situacao`, se houver lista oficial vinda de backend em etapa futura;
- `Tabela principal`, se houver catalogo real por clinica ou se a preferencia geral do usuario precisar ser respeitada;
- `Indice`, se houver catalogo real por clinica;
- `Botao Ok`, quando houver persistencia real.

## 9. Campos que dependem de tratamento anterior

- `Arcada predominante`
- `Copiar intervencoes a realizar do tratamento anterior`

## 10. Campos que dependem da aba Convenio

Nesta auditoria da aba Principal, os seguintes campos podem receber impacto indireto da aba Convenio em etapas futuras:

- `Situacao`
- `Tabela principal`
- `Indice`
- `Cirurgiao responsavel`
- `Unidade de atendimento`
- `Botao Ok`

Motivo:

- o fluxo de convenio pode alterar regras de autorizacao, tabela, indice, prestador e confirmacao de gravacao;
- a aba Convenio ainda nao foi fechada funcionalmente nesta etapa.

Observacao de criterio ja aplicado no modal:

- `Cirurgiao contratado`, `Cirurgiao solicitante` e `Cirurgiao executante` usam o mesmo catalogo de prestadores ativos da clinica, incluindo os que nao tem vinculo operacional com usuario.

## 11. Pendencias que precisam de resposta do usuario

- `Situacao` deve permanecer `Aberto` ou o EasyDental mostra outro estado inicial?
- `Cirurgiao responsavel` deve persistir nome quando nao houver `usuario_id` vinculado ou existe outra regra oficial?
- `Unidade de atendimento` deve listar apenas unidades ativas do cadastro e usar a unidade do usuario como padrao quando existir?
- `Idade` deve ficar vazia enquanto nao houver paciente ou deve mostrar valor calculado?
- `Arcada predominante` deve manter `Copiar do tratamento anterior` como padrao ou existe outra opcao inicial no EasyDental?
- `Copiar intervencoes a realizar do tratamento anterior` deve iniciar marcada ou desmarcada?
- `Inclusao` e `Alteracao` permanecem vazias na abertura e so recebem valor apos persistencia/atualizacao.
- `Botao Ok` deve continuar neutro nesta fase ou o usuario espera outra acao visual imediata?

## 12. Plano recomendado de implementacao em subetapas pequenas

1. Fechar as respostas do usuario para os campos pendentes.
2. Corrigir primeiro apenas os campos de baixo risco e sem persistencia.
3. Depois, ajustar campos dependentes de sessao.
4. Em seguida, fechar os campos dependentes de paciente.
5. Depois, revisar os campos dependentes de tratamento anterior.
6. Por fim, tratar os campos que dependem de backend/persistencia real.

## 13. Fora do escopo

- implementar salvamento real;
- implementar aba Convenio funcional;
- alterar backend;
- alterar banco;
- criar migration;
- criar seed;
- mexer em odontograma;
- mexer em ficha pessoal;
- mexer em financeiro;
- refatorar o modal.

## 14. Riscos

- normalizar cedo demais um valor que no EasyDental pode vir de outra fonte;
- misturar comportamento visual com persistencia real;
- fixar campo de sessao em valor errado para a clinica real;
- assumir comportamento de tratamento anterior sem confirmacao;
- transformar um campo apenas visual em regra de negocio sem contrato fechado.

## 15. Proxima etapa recomendada

Proxima etapa recomendada:

- correcao controlada por grupo de campos apos confirmacao do usuario, começando pelos campos de baixo risco e pelos que dependem apenas de sessao.
