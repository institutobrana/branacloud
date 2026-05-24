# Fase 2 — Subetapa 6 — Definição documental do segundo recorte mínimo da Tabela de protéticos

## 1. Contexto
A Subetapa 4 realizou o primeiro recorte funcional mínimo da Tabela de protéticos, movendo somente `protNomeArquivoBase`.

A Subetapa 5 validou esse recorte após teste humano sem erros.

Esta Subetapa 6 existe para decidir, com segurança, qual será o próximo helper a ser extraído, sem executar qualquer movimento de código neste momento.

## 2. Estado atual
- `protNomeArquivoBase` já está isolado em `frontend/js/modules/tabela-proteticos-helpers.js`.
- O teste humano pós-recorte não encontrou erros.
- Nenhum novo recorte deve acontecer sem decisão documental e commit seletivo.
- A Tabela de protéticos segue como primeira frente ativa da Fase 2.

## 3. Arquivos lidos
Arquivos consultados nesta leitura:

- `docs/fase_2_subetapa_3_isolamento_documental_primeiro_recorte_tabela_proteticos.md`
- `docs/fase_2_subetapa_4_primeiro_recorte_funcional_tabela_proteticos.md`
- `docs/fase_2_subetapa_5_validacao_pos_teste_primeiro_recorte_tabela_proteticos.md`
- `frontend/app.js`
- `frontend/js/modules/tabela-proteticos-helpers.js`

## 4. Analise dos candidatos

### 4.1. `protCsvEsc`
- Responsabilidade aparente: escapar valores para CSV.
- Entradas esperadas: qualquer valor convertido para string.
- Saida esperada: string segura para CSV, com aspas duplicadas quando necessario.
- Usa DOM: nao.
- Chama backend: nao.
- Altera estado global: nao.
- Depende de cache global: nao.
- Usa string visivel: sim, de forma indireta, porque lida com dados que aparecem em exportacao.
- Risco textual/mojibake: baixo, mas existe por atuar sobre texto de exportacao.
- Risco funcional: baixo.
- E helper puro: sim.
- E adequado para segundo recorte: sim, com boa seguranca.
- Observacao de compatibilidade: encaixa bem no arquivo `frontend/js/modules/tabela-proteticos-helpers.js` e nao exige DOM nem backend.

### 4.2. `protPdfEscape`
- Responsabilidade aparente: escapar texto para sintaxe de PDF.
- Entradas esperadas: string de texto qualquer.
- Saida esperada: string escapada para PDF.
- Usa DOM: nao.
- Chama backend: nao.
- Altera estado global: nao.
- Depende de cache global: nao.
- Usa string visivel: sim, pois protege o conteudo textual do relatorio em PDF.
- Risco textual/mojibake: baixo, mas mais sensivel que helpers puramente estruturais porque interfere no texto exportado.
- Risco funcional: baixo.
- E helper puro: sim.
- E adequado para segundo recorte: sim, mas depois de helpers ainda mais neutros se houver duvida.
- Observacao de compatibilidade: tambem cabe no novo arquivo de helpers, com impacto limitado ao fluxo de exportacao.

### 4.3. `protFormatoInfo`
- Responsabilidade aparente: mapear formato para extensao e MIME.
- Entradas esperadas: string de formato, como `PDF`, `HTML`, `RTF`, `XLS`, `TXT` ou `CSV`.
- Saida esperada: objeto com `ext` e `mime`.
- Usa DOM: nao.
- Chama backend: nao.
- Altera estado global: nao.
- Depende de cache global: nao.
- Usa string visivel: nao de forma relevante; trabalha com metadados de exportacao.
- Risco textual/mojibake: muito baixo.
- Risco funcional: baixo.
- E helper puro: sim.
- E adequado para segundo recorte: sim, e com menor risco que os demais por ser estrutural e nao alterar texto de saida.
- Observacao de compatibilidade: e o candidato mais facil de manter isolado no novo modulo sem afetar DOM, sessao ou backend.

### 4.4. `protServicoSelecionado` (comparacao cautelosa)
- Responsabilidade aparente: recuperar o servico selecionado a partir da cache atual.
- Entradas esperadas: nenhuma entrada direta; depende da selecao corrente.
- Saida esperada: objeto do servico selecionado ou `null`.
- Usa DOM: nao diretamente.
- Chama backend: nao.
- Altera estado global: nao diretamente, mas depende dele.
- Depende de cache global: sim, de `protServicosCache` e `protServicoSelecionadoId`.
- Usa string visivel: nao de forma relevante.
- Risco textual/mojibake: baixo.
- Risco funcional: medio, porque a funcao conversa com estado de selecao da tela.
- E helper puro: nao completamente, porque depende de estado global da interface.
- E adequado para segundo recorte: nao como primeira escolha, apenas como comparacao cautelosa.
- Observacao de compatibilidade: exige mais cuidado para nao introduzir regressao na selecao atual e no fluxo da tabela.

## 5. Comparacao tabular

| Funcao | Tipo | Dependencia de DOM | Dependencia de backend | Dependencia de estado/cache global | Risco textual | Risco funcional | Recomendacao |
|---|---|---|---|---|---|---|---|
| `protCsvEsc` | helper de escape CSV | nao | nao | nao | baixo | baixo | candidato possivel |
| `protPdfEscape` | helper de escape PDF | nao | nao | nao | baixo | baixo | candidato possivel |
| `protFormatoInfo` | helper de mapeamento | nao | nao | nao | muito baixo | baixo | **segundo recorte recomendado** |
| `protServicoSelecionado` | helper de selecao por cache | nao | nao | sim | baixo | medio | deixar para depois |

## 6. Escolha recomendada
A recomendacao conservadora para o segundo recorte funcional futuro e **somente `protFormatoInfo`**.

## 7. Justificativa do segundo recorte
`protFormatoInfo` e o helper mais adequado para a proxima etapa porque:

- e puro;
- nao usa DOM;
- nao chama backend;
- nao depende de estado ou cache global;
- nao interfere em salvar, excluir, carregar, eventos, permissao ou sessao;
- nao altera o texto de saida do relatorio, apenas informa extensao e MIME;
- cabe naturalmente no arquivo `frontend/js/modules/tabela-proteticos-helpers.js`.

Os outros candidatos ficam para depois porque:

- `protCsvEsc` ja atua sobre o conteudo exportado e mexe diretamente com texto de saida;
- `protPdfEscape` tambem atua em texto de exportacao e pode ser sensivel ao fluxo de relatorio;
- `protServicoSelecionado` depende de cache/estado da tela e e menos neutro que helpers puros.

## 8. Blocos explicitamente fora do segundo recorte
Continuam fora do segundo recorte:

- `protServicoSelecionado`, se nao for o escolhido;
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
- relatorio completo;
- envio de e-mail;
- eventos;
- permissoes;
- sessao/autenticacao;
- backend;
- banco;
- endpoints;
- textos visiveis.

## 9. Contrato minimo para a futura Subetapa 7
Se a Subetapa 7 for aprovada, ela devera:

- mover somente o helper escolhido;
- preservar assinatura;
- preservar retorno;
- preservar comportamento;
- nao alterar strings visiveis;
- nao alterar layout;
- nao alterar backend;
- nao alterar banco;
- nao alterar endpoints;
- nao mover outro helper junto;
- executar `node --check` nos arquivos envolvidos;
- fazer commit seletivo;
- exigir teste manual humano antes de qualquer proximo recorte.

## 10. Onde testar futuramente
Depois do segundo recorte funcional futuro, o usuario deve testar:

- abrir a Tabela de protéticos;
- listar protéticos;
- selecionar protético;
- abrir relatório;
- exportar relatório no formato relacionado ao helper movido, se aplicável;
- conferir o conteudo/arquivo exportado;
- conferir o nome do arquivo gerado;
- confirmar que criacao, edicao e exclusao continuam intactas;
- confirmar que nao houve alteracao textual visivel;
- confirmar que agenda de contatos e controle de protéticos nao foram afetados.

## 11. Registro para roadmap
- A Subetapa 6 define documentalmente o segundo recorte minimo.
- `protNomeArquivoBase` ja foi extraido e validado.
- O proximo recorte funcional futuro deve mover somente o helper escolhido nesta etapa.
- A Tabela de protéticos continua como primeira frente ativa da Fase 2.
- Proximos recortes devem permanecer pequenos, reversiveis, auditaveis e com teste humano.
- `Editor de texto`, `Ficha pessoal`, `Agenda`, `Conta corrente`, `Usuarios/Login` e `Seeds/tabelas padrao` continuam fora desta frente.

## 12. Commit seletivo obrigatorio
- Unico arquivo que deve entrar no commit desta etapa: `docs/fase_2_subetapa_6_definicao_segundo_recorte_minimo_tabela_proteticos.md`
- Nao usar `git add .`.
- Nao usar `git add docs/`.
- Nao incluir untracked antigos.
- Nao incluir `frontend/app.js`.
- Nao incluir `frontend/index.html`.
- Nao incluir `frontend/js/modules`.
- Nao incluir `backend`.
- Nao incluir banco/schema/migrations/seeds/endpoints.
- Commit deve ser seletivo e auditado.

## 13. Confirmacoes finais
- Esta etapa e documental.
- Nenhum codigo foi alterado.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foi alterado.
- `backend` nao foi alterado.
- banco, schema, migrations, seeds e endpoints nao foram alterados.
- Nenhum `UPDATE`, `DELETE` ou `INSERT` foi executado.
- Nenhum texto visivel, acento, label, mensagem, placeholder ou string foi corrigido.
- A blindagem textual/mojibake foi respeitada.
- Os untracked antigos foram preservados.
- O unico arquivo criado/modificado nesta etapa foi `docs/fase_2_subetapa_6_definicao_segundo_recorte_minimo_tabela_proteticos.md`.
