# Fase 2 - Agenda de contatos - Subetapa 5 - Plano documental do primeiro recorte funcional minimo com helper visual puro

## 1. Contexto
Esta subetapa continua a documentacao do modulo `Agenda de contatos` dentro da Fase 2 de modularizacao/refatoracao conservadora do frontend.

O foco desta etapa e registrar um plano de primeiro recorte funcional minimo, mas ainda sem qualquer alteracao de codigo. O alvo documental mais seguro e o helper visual puro `agendaContatosTelefonesTexto`.

## 2. Documentos consultados
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_agenda_contatos_subetapa_1_contrato_funcional_fronteiras.md`
- `docs/fase_2_agenda_contatos_subetapa_2_mapa_dependencias_tenant.md`
- `docs/fase_2_agenda_contatos_subetapa_3_mapa_fluxo_listagem_filtros.md`
- `docs/fase_2_agenda_contatos_subetapa_4_mapa_apoio_visual_ui.md`
- `docs/fase_2_reavaliacao_modulos_frontend_sem_modularizacao.md`
- `docs/auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 3. Confirmacao do commit anterior
Commit anterior confirmado:
- `9c86b4f42400a4c26920788611a23aa0a80f88c3` - `Mapeia apoio visual de agenda contatos`

## 4. Diretriz core/comum
Nesta trilha, `Agenda de contatos` continua tratada como `core / comum`.

Reforcos obrigatorios:
- nao implementar multiarea
- nao criar flags multiarea
- nao separar comportamento por area profissional
- nao alterar permissao
- nao alterar backend, banco, endpoint ou frontend nesta etapa

## 5. Justificativa do primeiro recorte minimo
O helper `agendaContatosTelefonesTexto` e o ponto mais conservador para um primeiro recorte futuro porque:
- apenas formata texto para exibicao
- recebe um item e devolve uma string
- nao chama `requestJson`
- nao abre modal
- nao mexe em cache global
- nao altera selecao
- nao dispara eventos
- nao depende de renderizacao geral da tela

Esse perfil reduz risco e permite testar o caminho de extracao sem tocar no fluxo maior de listagem, filtros ou apoio de carregamento.

## 6. Funcao principal candidata
Funcao principal candidata para o primeiro helper puro:
- `agendaContatosTelefonesTexto`

## 7. Contrato de entrada e saida de `agendaContatosTelefonesTexto`
### Entrada
- recebe um `item`
- o `item` pode ser nulo, indefinido ou um objeto incompleto
- o helper le os campos:
  - `tel1_tipo`
  - `tel1`
  - `tel2_tipo`
  - `tel2`
  - `tel3_tipo`
  - `tel3`
  - `tel4_tipo`
  - `tel4`

### Saida
- devolve uma string unica com os telefones encontrados
- separa os pares com ` / `
- quando o tipo existe, retorna `tipo fone`
- quando o tipo nao existe, retorna apenas o numero
- quando nao ha telefone, retorna string vazia

### Contrato funcional preservado
- manter ordem dos telefones
- manter omissao de campos vazios
- manter concatenacao simples
- manter formato compativel com o uso atual na grade

## 8. Dependencias inexistentes ou existentes
### DOM
- inexistente no helper puro
- `agendaContatosTelefonesTexto` nao precisa de DOM

### requestJson
- inexistente no helper puro
- `agendaContatosTelefonesTexto` nao faz chamada de rede

### cache global
- inexistente no helper puro
- `agendaContatosTelefonesTexto` nao le nem escreve `agendaContatosCache`, `agendaContatosTiposCache`, `agendaContatosEspecialidadesCache` ou `agendaContatosSelId`

### estado global
- inexistente no helper puro
- o helper nao depende de selecao, modal ou contexto mutavel

### modal
- inexistente no helper puro

### eventos
- inexistente no helper puro

### selecao
- inexistente no helper puro

## 9. Cenarios de entrada que devem ser preservados
- contato sem telefone
- contato com telefone principal
- contato com telefone residencial
- contato com telefone comercial
- contato com telefone celular
- contato com lista de telefones preenchida em mais de um campo
- campos vazios
- campos nulos
- campos ausentes
- formatos ja existentes no `app.js`

## 10. Novo arquivo futuro sugerido em `frontend/js/modules`, sem criar ainda
Arquivo sugerido para futura extracao:
- `frontend/js/modules/agenda-contatos-telefones.js`

Esse nome e apenas documental neste momento.

## 11. Namespace futuro sugerido, sem criar ainda
Namespace sugerido para futura organizacao:
- `agendaContatos`

Possivel helper interno futuro:
- `agendaContatos.telefonesTexto`

## 12. Plano de chamada futura a partir de `frontend/app.js`
Plano documental para uso futuro:
- `agendaContatosRender` deve continuar chamando o helper para montar a coluna de telefones
- o `app.js` pode manter um wrapper temporario enquanto a extracao for validada
- a chamada futura deve preservar a assinatura observada hoje, sem mudar comportamento

## 13. Wrappers/fallbacks que devem permanecer em `frontend/app.js`
Enquanto a extracao nao for implementada, o `app.js` deve continuar sendo o ponto de orquestracao da tela, mantendo:
- montagem da grade
- filtragem
- atualizacao de contadores
- selecao de linha
- conexao com o fluxo maior de agenda de contatos

Para o helper puro, o wrapper mais provavel no `app.js` e apenas a chamada indireta usada pela renderizacao da lista.

## 14. Funcoes expressamente fora do primeiro patch
Nao entram no primeiro patch:
- `agendaContatosFiltrar`
- `agendaContatosAtualizarFiltroTipos`
- `agendaContatosRender`
- `agendaContatosCarregarTipos`
- `agendaContatosCarregarEspecialidades`
- `agendaContatosCarregarAuxiliares`
- `agendaContatosCarregar`
- `agendaContatosAbrir`
- `agendaContatosVincularEventos`
- `agendaContatosPreencherModal`
- `agendaContatosAbrirModal`
- `agendaContatosFecharModal`
- `agendaContatosMontarPayload`
- `agendaContatosSalvarModal`
- `agendaContatosExcluir`

## 15. Checks tecnicos obrigatorios para futura implementacao
Caso a autorizacao de codigo venha depois, os checks minimos devem incluir:
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules`
- `git diff -- backend`
- `git diff -- docs/11_roadmap_desenvolvimento.md`
- `git status --short`
- validacao manual da coluna de telefones na tela
- comparacao do texto exibido antes e depois da extracao
- verificacao de ausencia de regressao no filtro e na selecao

## 16. Onde testar futuramente quando houver alteracao real
- abrir `Agenda de contatos`
- conferir a grade/lista
- comparar exibicao da coluna de telefones
- validar contatos sem telefone
- validar contatos com multiplos telefones
- validar retorno visual sem erros no console

## 17. Decisao: proxima subetapa pode ou nao ser implementacao minima
A decisao documental desta subetapa e:
- sim, o proximo passo pode ser uma implementacao minima, mas somente do helper visual puro `agendaContatosTelefonesTexto`
- os demais pontos do fluxo ainda merecem documentacao ou permanecem fora do primeiro patch

## 18. Proxima subetapa recomendada
Proxima subetapa recomendada:
- `Agenda de contatos - Subetapa 6 - Implementacao minima do helper visual puro`

## 19. Blindagem textual/mojibake
Esta etapa respeita integralmente a blindagem textual/mojibake.

Nao foram feitas correcoes em:
- textos visiveis
- acentos
- labels
- placeholders
- strings de interface
- mojibake

Qualquer texto estranho observado deve permanecer apenas como pendencia futura, sem correcao nesta etapa.

## 20. Registro para roadmap
- Subetapa 5 de `Agenda de contatos` criada documentalmente
- plano do primeiro recorte funcional minimo registrado
- modulo mantido como `core / comum`
- nenhuma alteracao de codigo
- nenhuma alteracao de backend, banco, endpoint ou permissao
- proxima subetapa recomendada: `Agenda de contatos - Subetapa 6 - Implementacao minima do helper visual puro`

## 21. Commit seletivo obrigatorio
Se e somente se a etapa ficar restrita a este documento novo e, se necessario, ao roadmap:
- usar apenas `git add docs/fase_2_agenda_contatos_subetapa_5_plano_primeiro_recorte_helper_visual.md`
- se houver alteracao de roadmap, adicionar apenas `docs/11_roadmap_desenvolvimento.md`
- depois executar `git commit -m "Planeja primeiro recorte de agenda contatos"`
- em seguida executar `git push`

