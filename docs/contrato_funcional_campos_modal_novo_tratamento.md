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
- fecha por `Ok`, `Cancela`, `X`, `ESC` e clique fora;
- nao grava dados;
- nao chama backend para persistencia.

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
| Inicio | input de data curto | data atual em `dd/mm/aaaa` | `todayBR()` no modulo visual, normalizado para exibição em `DD/MM/AAAA` | abre preenchido e selecionado ao abrir | esperado como data de inicio do novo tratamento | nenhuma persistencia; pode depender apenas de sessao/local quando houver regra futura | baixo para visual, medio se virar regra de negocio | apenas visual |
| Finalizacao | input de data curto | vazio | valor padrao vazio no modulo visual | abre vazio | esperado vazio na abertura | nenhuma no estado atual | baixo | apenas visual |
| Situacao | combo | `Aberto` | default fixo no modulo visual | abre com `Aberto` | esperado conforme layout documental; base atual sugere `Aberto` | pode depender de regras futuras de status | medio se regras de estado forem alteradas sem confirmacao | pendente de confirmacao do usuario |
| Tabela principal | combo | `PARTICULAR` | default fixo no modulo visual | abre com `PARTICULAR` | esperado como tabela principal da conta; doc cita `PARTICULAR` no layout | pode depender de tabela/convênio e de regra da clinica | medio se precisar mapear tabela real da conta | depende de tabela/convênio |
| Indice | combo | `R$` | default fixo no modulo visual | abre com `R$` | esperado como indice padrao da tela | pode depender de catalogo de indices | medio se houver regra de troca automatica | depende de tabela/convênio |
| Cirurgiao responsavel | combo | valor da sessao ou fallback `Tel` | `sessaoAtual.prestador_nome` / `apelido` / `nome`; fallback hardcoded | preenche com o melhor valor local e permite troca visual | doc indica que deve vir do prestador/usuario atual quando houver fonte segura | depende de sessao; pode depender do cadastro de prestadores | medio se a fonte real do prestador divergir do legado | depende de sessão |
| Unidade de atendimento | combo | valor da sessao ou fallback `Instituto Brana - Odontologia` | `sessaoAtual.unidade_atendimento_nome` / `clinica_nome` / `nome_clinica`; fallback hardcoded | preenche com unidade detectada ou fallback | doc indica que deve vir da clinica/unidade atual quando houver fonte segura | depende de sessao e da unidade ativa | medio se a unidade real nao coincidir com o fallback | depende de sessão |
| Observacoes | textarea | vazio | default vazio no modulo visual | permite texto livre | esperado como area de observacoes do tratamento | pode depender de persistencia futura, mas hoje e apenas visual | baixo para visual; alto se entrar em salvar sem contrato | apenas visual |
| Inclusao | input readonly com fundo ciano | vazio | default visual vazio no modulo | nao editavel | esperado como dado de auditoria visual; atualmente sem valor | dependera de persistencia real para ganhar data/hora | alto para preencher agora sem backend | depende de persistência real |
| Alteracao | input readonly com fundo ciano | vazio | default visual vazio no modulo | nao editavel | esperado como dado de auditoria visual; atualmente sem valor | dependera de persistencia real para ganhar data/hora | alto para preencher agora sem backend | depende de persistência real |
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
- `Inicio`, apenas se a formatacao visual precisar de ajuste fino.

## 7. Campos que dependem de paciente selecionado

- `Idade`

## 8. Campos que dependem de backend/banco

- `Inclusao`
- `Alteracao`
- `Cirurgiao responsavel`, se a fonte correta for a lista persistida do usuario/prestador;
- `Unidade de atendimento`, se a fonte correta for a unidade persistida da sessao;
- `Situacao`, se houver lista oficial vinda de backend em etapa futura;
- `Tabela principal`, se houver catalogo real por clinica;
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

## 11. Pendencias que precisam de resposta do usuario

- `Situacao` deve permanecer `Aberto` ou o EasyDental mostra outro estado inicial?
- `Cirurgiao responsavel` deve usar o nome do usuario logado, do prestador vinculado ou outro criterio?
- `Unidade de atendimento` deve usar a unidade da sessao, a primeira unidade da clinica ou outro valor?
- `Idade` deve ficar vazia enquanto nao houver paciente ou deve mostrar valor calculado?
- `Arcada predominante` deve manter `Copiar do tratamento anterior` como padrao ou existe outra opcao inicial no EasyDental?
- `Copiar intervencoes a realizar do tratamento anterior` deve iniciar marcada ou desmarcada?
- `Inclusao` e `Alteracao` devem exibir data/hora real ja na abertura ou permanecer vazias ate persistencia?
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
