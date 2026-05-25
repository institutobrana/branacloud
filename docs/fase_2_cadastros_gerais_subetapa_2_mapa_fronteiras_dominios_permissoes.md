# Fase 2 - Cadastros Gerais - Subetapa 2 - Mapa documental de fronteiras por dominio e dependencias de permissao

## 1. Contexto
Esta subetapa continua a frente `Cadastros Gerais` de forma exclusivamente documental.

O objetivo aqui nao e extrair funcao, nao e modularizar e nao e alterar comportamento. O foco e registrar as fronteiras internas do guarda-chuva `Cadastros Gerais`, separando dominios reais, dominios adjacentes e zonas de risco para orientar uma eventual etapa futura mais profunda.

Esta subetapa herda a classificacao multiarea da Subetapa 1: `mista`.

## 2. Documentos consultados
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_cadastros_gerais_subetapa_1_contrato_funcional_classificacao_multiarea.md`
- `docs/auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `backend/security/permissions.py`
- `backend/routes/cadastros_routes.py`
- `frontend/index.html`
- `frontend/app.js`
- `frontend/js/modules`

## 3. Confirmacao da Subetapa 1 e do commit `f975c920e298258d758b94fd5d8c9c32e0374644`
Confirmado:

- a Subetapa 1 foi concluida;
- o documento de contrato funcional e classificacao multiarea foi criado;
- o commit foi realizado com sucesso;
- o hash confirmado foi `f975c920e298258d758b94fd5d8c9c32e0374644`;
- a mensagem do commit foi `Documenta contrato funcional de cadastros gerais`.

Esta subetapa nao reabre nenhuma decisao funcional anterior.

## 4. Classificacao multiárea herdada
Classificacao herdada: `mista`.

Leitura aplicada nesta subetapa:

- existe um nucleo comum/core;
- existe um nucleo clinico/odontologico;
- existe uma camada mista e transversal;
- existem dominios adjacentes que nao devem entrar no primeiro recorte;
- existe dependencia forte de permissao e de rotas concentradoras.

## 5. Mapa de dominios de Cadastros Gerais

### 5.1 Dominios que realmente fazem parte do guarda-chuva
Os dominios abaixo fazem parte do guarda-chuva documental de `Cadastros Gerais` porque aparecem no mesmo bloco funcional do usuario, na mesma familia de menus ou no mesmo concentrador de backend:

- Auxiliares / Tabelas auxiliares
- Grupos
- Categorias
- Simbolos graficos
- Unidades de atendimento
- Pacientes / Ficha
- Procedimentos genericos
- CID
- Medicamentos
- Prestadores
- Convenios e planos
- Anamnese
- Plano de contas
- Etiquetas

### 5.2 Dominios que sao parte do guarda-chuva, mas nao sao bons candidatos para o primeiro recorte funcional
Os dominios abaixo tambem orbitam o mesmo ecossistema, mas apresentam acoplamento maior, transicao de contexto ou dependencia funcional mais sensivel:

- Pacientes / Ficha
- Procedimentos genericos
- Simbolos graficos
- Convenios e planos
- Prestadores
- Plano de contas
- Anamnese
- Medicamentos
- Etiquetas

## 6. Dominios adjacentes que NAO devem entrar no primeiro recorte
Os dominios abaixo sao adjacentes ao ecossistema, mas nao devem entrar no primeiro recorte funcional de `Cadastros Gerais`:

- Agenda
- Financeiro operacional
- Conta corrente
- Fluxo de caixa
- Indices financeiros
- Relatorios gerais
- Superadmin / plataforma
- Licenca e pagamentos
- Tratamentos / orcamentos
- Editor de textos
- Proteticos e controle protetico
- Controle de estoque
- Usuarios / perfis / permissões

Motivo: esses dominios trazem outras fronteiras de risco, dependencias transversais ou regras de permissao que podem deslocar o foco documental da frente.

## 7. Tabela de telas/menus visiveis ao usuario

| Dominio | Telas / menus visiveis | Observacao de fronteira |
|---|---|---|
| Auxiliares / Tabelas auxiliares | `Tabelas auxiliares...` | Entrada mais comum/core do bloco |
| Grupos / Categorias | Nao aparece como tela unica; aparece como parte do fluxo de classificacao e plano | Fortemente ligado a financeiro |
| Simbolos graficos | `Simbolos graficos...` | Misto, com peso odontologico |
| Unidades de atendimento | `Unidades de atendimento...` | Common/core com reflexos em outros modulos |
| Pacientes / Ficha | `Novo paciente...`, `Abre paciente...`, `Fecha paciente...`, `Ficha pessoal...`, `Ficha rapida...`, `Ficha de anamnese...`, `Ficha de historico...`, `Dados complementares...` | Grande fronteira clinica/transacional |
| Procedimentos genericos | `Procedimentos genericos...` | Alto acoplamento com procedimentos |
| CID | `Doencas (CID)...` | Clinico e transversal |
| Medicamentos | `Medicamentos...` | Adjacente ao fluxo clinico |
| Prestadores | `Prestadores...` | Adjacente a agenda, convenios e usuarios |
| Convenios e planos | `Convênios e planos...` | Mistura agenda, pacientes e financeiro |
| Anamnese | `Anamnese...` | Domínio clínico separado, mas integrado ao ecossistema |
| Plano de contas | `Plano de contas...` | Financeiro estrutural |
| Etiquetas | `Etiquetas...` | Relatorio/impressao, adjacente |
| Outros menus do mesmo ecossistema | `Controle de estoque...`, `Controle de protéticos...`, `Agendas...`, `Preferências...`, `Opções do sistema...` | Devem ser tratados como adjacentes nesta etapa |

## 8. Tabela de permissões por dominio

| Dominio | Permissao identificada | Tipo de dependencia | Observacao |
|---|---|---|---|
| Auxiliares / Tabelas auxiliares | `configuracao` | Direta | `cadastros_routes.py` usa `DEP_CONFIGURACAO` |
| Grupos / Categorias | `financeiro` | Direta | `cadastros_routes.py` usa `DEP_FINANCEIRO` |
| Simbolos graficos | `procedimentos` | Direta | `cadastros_routes.py` usa `DEP_PROCEDIMENTOS` |
| Unidades de atendimento | nao aparece como dependencia no trecho lido, mas se relaciona com `agenda` e `prestadores` | Indireta | Forte uso transversal |
| Pacientes / Ficha | `procedimentos` | Direta | No concentrador `cadastros_routes.py` |
| Procedimentos genericos | `procedimentos` | Direta | No concentrador `cadastros_routes.py` |
| CID | `anamnese` | Direta, em rota propria | Fora de `cadastros_routes.py`, mas parte do ecossistema |
| Medicamentos | `anamnese` | Direta, em rota propria | Adjacente ao fluxo clinico |
| Prestadores | `prestadores` | Direta, em rota propria | Adjacente ao cadastro e a agenda |
| Convenios e planos | `configuracao` | Direta, em rota propria | Adjacente a pacientes, agenda e financeiro |
| Anamnese | `anamnese` | Direta, em rota propria | Separado e clinico |
| Plano de contas | `financeiro` | Direta, em rota propria | Estrutural do dominio financeiro |
| Etiquetas | `relatorios` | Direta, em rota propria | Relacionado a impressao/relatorio |
| Agenda | `agenda` | Direta, em rota propria | Adjacente e sensivel |
| Financeiro operacional | `financeiro` | Direta | Altamente sensivel |
| Usuarios / perfis / permissoes | `usuarios` | Direta | Fora do primeiro recorte |

## 9. Tabela de frontend

| Prefixo / funcao em `frontend/app.js` | Módulo existente em `frontend/js/modules` | Risco de acoplamento |
|---|---|---|
| `aux*` | `auxiliares.js` | Baixo/médio, com dependencia de selects e configuracao |
| `plano*` | `plano-contas.js` | Alto, por cruzar financeiro e categorias |
| `simbolos*` | `simbolos-graficos.js` | Alto, por editor, biblioteca e modal |
| `unidade*` | `unidades.js` | Médio, por agenda, usuarios e prestadores |
| `ficha*` | nenhum modulo claro | Alto, por pacientes e dados clínicos |
| `pgen*` | `procedimentos-genericos.js` | Alto, por fases, materiais e persistencia |
| `cid*` | `cid.js` | Médio, por uso clinico e editor |
| `medicamentos*` | `medicamentos.js` | Médio, por uso clinico e assistentes |
| `prest*` | `prestadores.js` | Alto, por agenda, convenios e comissoes |
| `convPlan*` | `convenios-planos.js` | Alto, por agenda, pacientes e financeiro |
| `anamnese*` | `anamnese.js` | Alto, por paciente e respostas clinicas |
| `etq*` | `etiquetas.js` | Médio, por relatorios e layout |
| `pref*` / `sysOpt*` | `preferencias-opcoes-sistema.js` | Alto, por configuracao transversal |
| `materiais*` | `materiais.js` | Alto, por vinculos e custo |
| `proc*` | `intervencoes-procedimentos.js` | Critico, por tabela, custo, material e tratamento |

Observacao: varios desses prefixos ja estao fora do primeiro recorte documental de `Cadastros Gerais`, mas sao importantes para mapear o contorno do que nao deve ser tocado cedo demais.

## 10. Tabela de backend

| Rotas envolvidas | Arquivo principal | Risco de acoplamento |
|---|---|---|
| `/cadastros/auxiliares*` | `backend/routes/cadastros_routes.py` | Medio |
| `/cadastros/grupos*` e `/cadastros/categorias*` | `backend/routes/cadastros_routes.py` | Alto |
| `/cadastros/simbolos-graficos` | `backend/routes/cadastros_routes.py` | Alto |
| `/cadastros/pacientes*` | `backend/routes/cadastros_routes.py` | Critico |
| `/cadastros/procedimentos-genericos*` | `backend/routes/cadastros_routes.py` | Critico |
| `/cid` | `backend/routes/cid_routes.py` | Medio |
| `/medicamentos` | `backend/routes/medicamentos_routes.py` | Medio |
| `/cadastros/prestadores*` | `backend/routes/prestadores_routes.py` | Alto |
| `/cadastros/convenios-planos*` | `backend/routes/convenios_planos_routes.py` | Alto |
| `/anamnese*` | `backend/routes/anamnese_routes.py` | Alto |
| `/cadastros/unidades-atendimento*` | `backend/routes/unidades_atendimento_routes.py` | Medio |
| `/financeiro/*` e rotas de categorias/grupos | `backend/routes/financeiro_routes.py` e `backend/routes/cadastros_routes.py` | Critico |
| `/config/etiquetas` | `backend/routes/etiquetas_routes.py` | Medio |
| `/agenda-legado/*` e `/agenda-contatos/*` | `backend/routes/agenda_legado_routes.py` e `backend/routes/agenda_contatos_routes.py` | Critico |

## 11. Riscos tecnicos
- `backend/routes/cadastros_routes.py` mistura dominios com permissao diferente e nivel de risco diferente;
- `frontend/app.js` continua concentrando abertura, renderizacao, selecao, modal e persistencia;
- `frontend/js/modules` ajuda na passividade, mas nao resolve o acoplamento estrutural;
- `configuracao`, `procedimentos`, `financeiro`, `relatorios`, `agenda`, `prestadores`, `materiais` e `anamnese` convivem em torno do mesmo ecossistema;
- alterar um dominio adjacente cedo demais pode arrastar outros fluxos para o recorte;
- textos estranhos e mojibake que aparecam em arquivos lidos devem ser apenas registrados como pendencia futura;
- o bloco de pacientes/ficha e procedimentos genericos e o mais perigoso dentro do guarda-chuva atual;
- agenda, financeiro e editor de textos nao devem ser puxados para o mesmo recorte por causa do alto risco sistêmico.

## 12. Fronteiras proibidas para a proxima etapa
Na proxima subetapa documental ainda fica proibido:

- escolher helper para extrair;
- escolher patch;
- mudar comportamento;
- renomear menu;
- alterar permissao;
- criar controle multiárea;
- mover código entre arquivos;
- tocar em backend funcional;
- tocar em banco, schema, migrations ou seeds;
- misturar `Cadastros Gerais` com agenda, financeiro ou editor de textos;
- tratar pacientes/ficha como se fossem um recorte pequeno;
- tratar procedimentos genericos como se fossem um helper inocente.

## 13. Candidato documental recomendado para a proxima subetapa
O candidato documental mais seguro para uma proxima etapa mais profunda, ainda sem implementar codigo, e:

- `Auxiliares / Tabelas auxiliares`

Motivo:

- e o dominio mais proximo do nucleo common/core;
- ja possui modulo passivo separado em `frontend/js/modules/auxiliares.js`;
- tem dependencia clara e relativamente contida (`configuracao`);
- tende a ser menos perigoso do que pacientes, procedimentos genericos, financeiro ou agenda;
- pode servir como ponte para documentar fronteiras sem chamar fluxos clinicos ou financeiros mais pesados.

## 14. Onde testar futuramente quando houver alteracao real
Se alguma etapa futura virar alteracao real, os pontos de verificacao devem ser estes:

- abrir `Tabelas auxiliares...`;
- abrir `Plano de contas...`;
- abrir `Doencas (CID)...`;
- abrir `Unidades de atendimento...`;
- abrir `Procedimentos genericos...`;
- abrir `Simbolos graficos...`;
- abrir `Novo paciente...`;
- abrir `Convênios e planos...`;
- abrir `Prestadores...`;
- abrir `Medicamentos...`;
- abrir `Anamnese...`;
- confirmar que o menu correto continua abrindo a tela correta;
- confirmar console sem `ReferenceError`, `TypeError` ou regressao de abertura;
- confirmar que nenhuma permissão foi reclassificada por acidente.

## 15. Blindagem textual/mojibake
Esta subetapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nao houve correção textual, acento, label, placeholder ou string visivel.

Se algum texto estranho ou mojibake aparecer em arquivos lidos, ele deve permanecer apenas como risco documental e nao como alvo de correção nesta etapa.

## 16. Registro para roadmap
- A Subetapa 2 de `Cadastros Gerais` foi criada documentalmente.
- O mapa de fronteiras por dominio e permissao foi criado.
- Nenhum código foi alterado.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- A classificacao multiárea herdada permanece `mista`.
- A proxima subetapa recomendada e a continuidade documental do dominio `Auxiliares / Tabelas auxiliares`.
- O primeiro recorte funcional continua proibido nesta etapa.

## 17. Commit seletivo obrigatório
Se esta etapa permanecer restrita a este documento e, se necessario, ao roadmap, o commit deve ser seletivo.

Nao usar:

- `git add .`
- `git add docs/`
- qualquer forma de selecao ampla de arquivos

Usar apenas:

- `git add docs/fase_2_cadastros_gerais_subetapa_2_mapa_fronteiras_dominios_permissoes.md`
- se alterado, `git add docs/11_roadmap_desenvolvimento.md`

Depois:

- `git commit -m "Mapeia fronteiras de cadastros gerais"`
- `git push`

## 18. Observacao final
Esta subetapa e de fronteira documental.

Nenhum codigo foi alterado.
