# Fase 2 — Subetapa 15 — Reavaliação documental de protServicoSelecionado na Tabela de protéticos

## 1. Contexto
Os helpers puros já foram isolados:

- `protNomeArquivoBase`
- `protFormatoInfo`
- `protCsvEsc`
- `protPdfEscape`

`protServicoSelecionado` é diferente dos anteriores porque depende de cache/estado da tela.

## 2. Estado atual
- `frontend/js/modules/tabela-proteticos-helpers.js` já existe;
- os helpers puros anteriores estão isolados;
- o quarto recorte foi considerado validado documentalmente após a Subetapa 14B;
- a Tabela de protéticos segue como primeira frente ativa da Fase 2;
- `protServicoSelecionado` ainda está no `frontend/app.js`;
- esta etapa não move código.

## 3. Análise de `protServicoSelecionado`
- Responsabilidade aparente: retornar o serviço atualmente selecionado na Tabela de protéticos.
- Entradas esperadas: não recebe parâmetros; depende do estado global da seleção atual.
- Saída esperada: o item selecionado em `protServicosCache`, ou `null` quando não houver seleção válida.
- Usa DOM: não diretamente; consulta apenas estado/cache, embora o estado venha do fluxo da tela.
- Chama backend: não.
- Altera estado global: não altera diretamente, mas lê `protServicoSelecionadoId` e `protServicosCache`.
- Depende de cache global: sim.
- Caches/estados aparentes usados: `protServicosCache` e `protServicoSelecionadoId`.
- Usa string visível: não diretamente.
- Risco textual/mojibake: baixo diretamente, mas existe risco indireto se a seleção ou o texto renderizado depender desse item.
- Risco funcional: médio a alto, porque a função alimenta edição, exclusão e outras ações dependentes da seleção.
- Relação com seleção atual de protético/serviço: é o ponto de consulta do serviço corrente para a tela de protéticos.
- Compatibilidade com `frontend/js/modules/tabela-proteticos-helpers.js`: baixa para o padrão atual do arquivo, porque o arquivo já concentra helpers puros; esta função carrega dependência de estado.
- Adequação como próximo recorte: não é a melhor candidata imediata sem uma separação documental/estrutural anterior.

## 4. Comparação com helpers já extraídos
Comparando `protServicoSelecionado` com os helpers já extraídos:

- `protNomeArquivoBase`: helper puro de nome de arquivo, sem dependência de estado.
- `protFormatoInfo`: helper puro de formato/MIME, sem dependência de estado.
- `protCsvEsc`: helper puro de escape de CSV, sem dependência de estado.
- `protPdfEscape`: helper puro de escape de PDF, sem dependência de estado.

`protServicoSelecionado` é mais sensível porque depende de estado/caches.

O risco funcional é maior.

A extração exige mais cuidado com compatibilidade global.

## 5. Riscos específicos
- dependência de `protServicosCache`;
- dependência de `protServicoSelecionadoId`;
- possível impacto na seleção atual de serviço;
- risco de quebrar edição de serviço selecionado;
- risco de quebrar relatório/fluxos que dependem da seleção;
- risco de extração prematura para um arquivo de helpers puros;
- risco de misturar helpers puros com helpers dependentes de estado.

## 6. Decisão recomendada
Opção C: recomendar criar antes uma nova camada/arquivo específico para seletores/estado da Tabela de protéticos, ainda documentalmente, antes de mover `protServicoSelecionado`.

`protServicoSelecionado` não deve ser movido agora.

## 7. Justificativa da decisão
`protServicoSelecionado` não é um helper puro; ele depende de cache/estado e participa da seleção corrente da tela.

Os helpers puros já extraídos encerram um ciclo seguro para `frontend/js/modules/tabela-proteticos-helpers.js`.

Mover `protServicoSelecionado` para o mesmo arquivo aumentaria o acoplamento entre helpers puros e estado da tela.

A separação mais conservadora é documentar uma camada intermediária antes de qualquer recorte funcional.

Sugestão de arquivo futuro, sem criar ainda:

- `frontend/js/modules/tabela-proteticos-state.js`

Objetivo da separação: isolar seletores e estado da Tabela de protéticos antes de mover funções dependentes da seleção.

## 8. Blocos explicitamente fora de qualquer próximo recorte
Continuam fora:

- `protSalvarModal`;
- `protNovoCadastro`;
- `protEditarCadastro`;
- `protExcluirCadastro`;
- `protExcluirServico`;
- `protCarregar`;
- `protCarregarServicos`;
- `protExecutarRelatorio`;
- `protSalvarRelatorioArquivo`;
- `protEnviarEmailRelatorio`;
- `protSelecionarDestinoRelatorio`;
- `protAbrir`;
- `protVincularEventos`;
- relatório completo;
- envio de e-mail;
- eventos;
- permissões;
- sessão/autenticação;
- backend;
- banco;
- endpoints;
- textos visíveis.

## 9. Contrato mínimo para eventual futura Subetapa 16
Se `protServicoSelecionado` for recomendado em etapa futura, a Subetapa 16 deverá:

- mover somente `protServicoSelecionado`;
- preservar assinatura;
- preservar retorno;
- preservar comportamento;
- preservar acesso a caches/estado;
- não alterar strings visíveis;
- não alterar layout;
- não alterar backend;
- não alterar banco;
- não alterar endpoints;
- não mover outro helper junto;
- executar `node --check` nos arquivos envolvidos;
- fazer commit seletivo;
- exigir teste manual humano antes de próximo recorte.

Se `protServicoSelecionado` não for recomendado, a futura Subetapa 16 deverá ser documental de fechamento/consolidação parcial da frente ou nova avaliação arquitetural.

## 10. Onde testar futuramente
Se houver eventual recorte futuro de `protServicoSelecionado`, o usuário deverá testar:

- abrir a Tabela de protéticos;
- listar protéticos;
- selecionar protético;
- selecionar serviço;
- editar serviço selecionado;
- abrir modal de serviço;
- trocar seleção entre serviços;
- abrir relatório;
- exportar relatórios;
- confirmar que criação, edição e exclusão continuam intactas;
- confirmar que não houve alteração textual visível;
- confirmar que agenda de contatos e controle de protéticos não foram afetados.

## 11. Registro para roadmap
- A Subetapa 15 reavalia documentalmente `protServicoSelecionado`;
- helpers puros já extraídos permanecem isolados;
- `protServicoSelecionado` é mais sensível por depender de cache/estado;
- a decisão desta etapa deve definir se haverá próximo recorte funcional ou pausa/consolidação;
- a Tabela de protéticos continua como primeira frente ativa da Fase 2;
- próximos passos devem permanecer pequenos, reversíveis, auditáveis e com teste humano;
- persistência, carga, relatório completo, e-mail, eventos, backend, banco e endpoints continuam fora;
- `Editor de texto`, `Ficha pessoal`, `Agenda`, `Conta corrente`, `Usuários/Login` e `Seeds/tabelas padrão` continuam fora desta frente.

## 12. Commit seletivo obrigatório
O único arquivo que deve entrar no commit desta etapa é:

- `docs/fase_2_subetapa_15_reavaliacao_documental_protServicoSelecionado.md`

Não usar `git add .`.

Não usar `git add docs/`.

Não incluir untracked antigos.

Não incluir `frontend/app.js`.

Não incluir `frontend/index.html`.

Não incluir `frontend/js/modules`.

Não incluir `backend`.

Não incluir banco/schema/migrations/seeds/endpoints.

O commit deve ser seletivo e auditado.

## 13. Confirmações finais
- Esta etapa é documental.
- Nenhum código foi alterado.
- `frontend/app.js` não foi alterado.
- `frontend/index.html` não foi alterado.
- `frontend/js/modules` não foi alterado.
- `backend` não foi alterado.
- banco, schema, migrations, seeds e endpoints não foram alterados.
- Nenhum `UPDATE`, `DELETE` ou `INSERT` foi executado.
- Nenhum texto visível, acento, label, mensagem, placeholder ou string foi corrigido.
- A blindagem textual/mojibake foi respeitada.
- Os untracked antigos foram preservados.
- O único arquivo criado/modificado nesta etapa foi `docs/fase_2_subetapa_15_reavaliacao_documental_protServicoSelecionado.md`.
