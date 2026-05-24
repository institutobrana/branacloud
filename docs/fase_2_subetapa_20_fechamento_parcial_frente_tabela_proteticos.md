# Fase 2 — Subetapa 20 — Fechamento parcial da frente Tabela de protéticos

## 1. Contexto
A Tabela de protéticos foi a primeira frente ativa da Fase 2.

A frente passou por etapas documentais, recortes funcionais mínimos e validações.

Os helpers puros foram isolados com sucesso.

A frente será pausada/consolidada antes de qualquer recorte mais arriscado.

## 2. Objetivo do fechamento parcial
Consolidar:

- o que foi extraído;
- o que foi validado;
- o que ficou documentado;
- o que permanece fora;
- o que deve ser respeitado se a frente for retomada.

## 3. Helpers extraídos
Os seguintes helpers foram extraídos para `frontend/js/modules/tabela-proteticos-helpers.js`:

### `protNomeArquivoBase`
- Subetapa funcional correspondente: 4
- Commit: `069f3c7`
- Finalidade resumida: gerar base segura de nome de arquivo a partir do título.
- Validação/documentação posterior: validação humana na Subetapa 5.

### `protFormatoInfo`
- Subetapa funcional correspondente: 7
- Commit: `1aaf052`
- Finalidade resumida: mapear formato para extensão e MIME.
- Validação/documentação posterior: validação humana na Subetapa 8.

### `protCsvEsc`
- Subetapa funcional correspondente: 10
- Commit: `958a38c`
- Finalidade resumida: escapar valores para exportação CSV.
- Validação/documentação posterior: validação documental complementar nas Subetapas 11 e 11B.

### `protPdfEscape`
- Subetapa funcional correspondente: 13
- Commit: `4d8470b`
- Finalidade resumida: escapar texto para geração de PDF.
- Validação/documentação posterior: validação documental complementar nas Subetapas 14 e 14B.

## 4. Documentos e commits principais

| Subetapa | Tipo da etapa | Documento | Commit | Resumo |
|---|---|---|---|---|
| 1 | Contrato funcional | `docs/fase_2_subetapa_1_contrato_funcional_tabela_proteticos.md` | `2db91f9` | Define o funcionamento atual da Tabela de protéticos |
| 2 | Mapeamento técnico | `docs/fase_2_subetapa_2_mapeamento_tecnico_tabela_proteticos_app_js.md` | `572db49` | Mapeia funções e dependências no `app.js` |
| 3 | Isolamento documental | `docs/fase_2_subetapa_3_isolamento_documental_primeiro_recorte_tabela_proteticos.md` | `b2f1457` | Isola o primeiro recorte mínimo candidato |
| 4 | Recorte funcional | `docs/fase_2_subetapa_4_primeiro_recorte_funcional_tabela_proteticos.md` | `069f3c7` | Move `protNomeArquivoBase` |
| 5 | Validação humana | `docs/fase_2_subetapa_5_validacao_pos_teste_primeiro_recorte_tabela_proteticos.md` | `b6e98a5` | Valida o primeiro recorte após teste humano |
| 6 | Decisão documental | `docs/fase_2_subetapa_6_definicao_segundo_recorte_minimo_tabela_proteticos.md` | `4047aa8` | Define o segundo recorte mínimo |
| 7 | Recorte funcional | `docs/fase_2_subetapa_7_segundo_recorte_funcional_tabela_proteticos.md` | `1aaf052` | Move `protFormatoInfo` |
| 8 | Validação humana | `docs/fase_2_subetapa_8_validacao_pos_teste_segundo_recorte_tabela_proteticos.md` | `49a2362` | Valida o segundo recorte |
| 9 | Decisão documental | `docs/fase_2_subetapa_9_decisao_terceiro_recorte_tabela_proteticos.md` | `d15101c` | Define o terceiro recorte mínimo |
| 10 | Recorte funcional | `docs/fase_2_subetapa_10_terceiro_recorte_funcional_tabela_proteticos.md` | `958a38c` | Move `protCsvEsc` |
| 11 | Validação pós-teste | `docs/fase_2_subetapa_11_validacao_pos_teste_terceiro_recorte_tabela_proteticos.md` | `ca9e630` | Registra validação inicialmente pendente |
| 11B | Complementação documental | `docs/fase_2_subetapa_11b_complementacao_validacao_terceiro_recorte_tabela_proteticos.md` | `ba49e43` | Complementa a validação do terceiro recorte |
| 12 | Decisão documental | `docs/fase_2_subetapa_12_decisao_quarto_recorte_tabela_proteticos.md` | `b59b8a6` | Recomenda `protPdfEscape` |
| 13 | Recorte funcional | `docs/fase_2_subetapa_13_quarto_recorte_funcional_tabela_proteticos.md` | `4d8470b` | Move `protPdfEscape` |
| 14 | Validação pós-teste | `docs/fase_2_subetapa_14_validacao_pos_teste_quarto_recorte_tabela_proteticos.md` | `0d0d7e7` | Registra validação inicialmente pendente |
| 14B | Complementação documental | `docs/fase_2_subetapa_14b_complementacao_validacao_quarto_recorte_tabela_proteticos.md` | `07bb18d` | Complementa a validação do quarto recorte |
| 15 | Reavaliação documental | `docs/fase_2_subetapa_15_reavaliacao_documental_protServicoSelecionado.md` | `595dd31` | Decide não mover `protServicoSelecionado` agora |
| 16 | Definição documental | `docs/fase_2_subetapa_16_definicao_camada_selecao_estado_tabela_proteticos.md` | `2a79109` | Propõe camada intermediária de seleção/estado |
| 17 | Mapeamento documental | `docs/fase_2_subetapa_17_mapeamento_funcoes_selecao_estado_tabela_proteticos.md` | `c51e92b` | Mapeia funções dependentes de seleção/estado |
| 18 | Contrato de interface | `docs/fase_2_subetapa_18_contrato_interface_camada_selecao_estado_tabela_proteticos.md` | `8d78841` | Define interface futura de seleção/estado |
| 19 | Consolidação documental | `docs/fase_2_subetapa_19_consolidacao_interface_selecao_estado_tabela_proteticos.md` | `53f53f9` | Pausa/consolida a frente após helpers puros |
| 20 | Fechamento parcial | `docs/fase_2_subetapa_20_fechamento_parcial_frente_tabela_proteticos.md` | `a definir` | Fecha parcialmente a frente Tabela de protéticos |

## 5. Validações realizadas
- validação humana do primeiro recorte;
- validação humana do segundo recorte;
- complementação documental do terceiro recorte;
- complementação documental do quarto recorte;
- checks `node --check` executados nas etapas funcionais;
- limites das validações, especialmente ausência de testes automatizados específicos novos.

## 6. Decisão sobre `protServicoSelecionado`
`protServicoSelecionado` não foi movido.

Ele depende de `protServicosCache` e `protServicoSelecionadoId`.

É mais sensível que os helpers puros.

Não deve ser movido sem nova decisão documental futura.

Não deve ser misturado de forma precipitada com helpers puros.

## 7. Decisão sobre `tabela-proteticos-selecao-estado.js`
`frontend/js/modules/tabela-proteticos-selecao-estado.js` foi apenas sugerido.

O arquivo não foi criado.

A criação desse arquivo fica pausada.

Se for retomado no futuro, deve haver nova subetapa documental explícita antes de qualquer recorte funcional.

## 8. Escopo que permanece fora
Continuam fora:

- `protServicoSelecionado`;
- `protSelecionarLinha`;
- `protEditarSelecionado`;
- `protCarregarServicos`;
- `protCarregar`;
- `protAbrir`;
- `protAbrirModal`;
- `protSalvarModal`;
- `protExcluirServico`;
- `protRelatorioRows`;
- `protRelatorioPdfBlob`;
- `protVincularEventos`;
- salvar;
- editar;
- excluir;
- carregar;
- relatório completo;
- exportação completa;
- envio de e-mail;
- eventos;
- permissões;
- sessão/autenticação;
- backend;
- banco;
- endpoints;
- textos visíveis.

## 9. Estado final da frente
- frente Tabela de protéticos fica pausada/consolidada;
- não há novo recorte funcional autorizado;
- próximos passos nesta frente exigem nova decisão documental;
- os helpers puros ficam extraídos;
- `app.js` continua contendo fluxos mais acoplados;
- a modularização foi conservadora e parcial.

## 10. Onde testar se a frente for retomada
Se a frente for retomada, o usuário deve testar:

- abrir Tabela de protéticos;
- listar protéticos;
- selecionar protético;
- selecionar serviço;
- trocar seleção entre serviços;
- criar serviço;
- editar serviço;
- excluir serviço;
- criar protético;
- editar protético;
- excluir protético;
- abrir relatório;
- exportar CSV;
- exportar PDF;
- exportar demais formatos disponíveis;
- enviar relatório por e-mail, se aplicável;
- confirmar que não houve alteração textual visível;
- confirmar que agenda de contatos e controle de protéticos não foram afetados.

## 11. Recomendações para retomada futura
- não retomar por código diretamente;
- iniciar com nova subetapa documental;
- revalidar o estado atual do `app.js` antes de qualquer novo recorte;
- decidir novamente se vale mover `protServicoSelecionado`;
- considerar se é melhor fechar a frente e escolher outro módulo da Fase 2;
- manter padrão de recorte mínimo, commit seletivo e teste humano.

## 12. Registro para roadmap
- A Subetapa 20 fecha parcialmente a frente Tabela de protéticos;
- helpers puros extraídos permanecem isolados em `frontend/js/modules/tabela-proteticos-helpers.js`;
- `protServicoSelecionado` e funções dependentes de seleção/estado ficam fora;
- a camada `frontend/js/modules/tabela-proteticos-selecao-estado.js` não foi criada;
- a frente Tabela de protéticos fica pausada/consolidada;
- qualquer retomada exige nova decisão documental;
- nenhuma alteração adicional de backend, banco, endpoints, permissões, sessão ou textos foi feita;
- a Fase 2 pode avaliar próxima frente somente após este fechamento parcial;
- `Editor de texto`, `Ficha pessoal`, `Agenda`, `Conta corrente`, `Usuários/Login` e `Seeds/tabelas padrão` continuam fora da frente Tabela de protéticos.

## 13. Commit seletivo obrigatório
O único arquivo que deve entrar no commit desta etapa é:

- `docs/fase_2_subetapa_20_fechamento_parcial_frente_tabela_proteticos.md`

Não usar `git add .`.

Não usar `git add docs/`.

Não incluir untracked antigos.

Não incluir `frontend/app.js`.

Não incluir `frontend/index.html`.

Não incluir `frontend/js/modules`.

Não incluir `backend`.

Não incluir banco/schema/migrations/seeds/endpoints.

O commit deve ser seletivo e auditado.

## 14. Confirmações finais
- Esta etapa é documental.
- Nenhum código foi alterado.
- `frontend/app.js` não foi alterado.
- `frontend/index.html` não foi alterado.
- `frontend/js/modules` não foi alterado.
- `frontend/js/modules/tabela-proteticos-selecao-estado.js` não foi criado.
- backend não foi alterado.
- banco, schema, migrations, seeds e endpoints não foram alterados.
- Nenhum `UPDATE`, `DELETE` ou `INSERT` foi executado.
- Nenhum texto visível, acento, label, mensagem, placeholder ou string foi corrigido.
- A blindagem textual/mojibake foi respeitada.
- Os untracked antigos foram preservados.
- O único arquivo criado/modificado nesta etapa foi `docs/fase_2_subetapa_20_fechamento_parcial_frente_tabela_proteticos.md`.
