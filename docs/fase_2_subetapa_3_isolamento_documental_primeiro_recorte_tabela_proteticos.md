# Fase 2 - Subetapa 3 - Isolamento documental dos candidatos de menor risco da Tabela de proteticos

## 1. Contexto
Esta subetapa deriva do mapeamento tecnico da Subetapa 2 e serve para preparar o primeiro recorte minimo futuro da Tabela de proteticos, ainda sem execucao.

O objetivo e separar conceitualmente os candidatos mais seguros antes de qualquer movimentacao fisica de codigo.

Esta etapa e exclusivamente documental e de auditoria.

## 2. Arquivos lidos
Arquivos consultados nesta leitura:

- `docs/fase_2_subetapa_1_contrato_funcional_tabela_proteticos.md`
- `docs/fase_2_subetapa_2_mapeamento_tecnico_tabela_proteticos_app_js.md`
- `frontend/app.js`
- `frontend/index.html`
- `docs/modularizacao_segura_fase_1_fechamento_abertura_fase_2.md`
- `docs/fase_2_subetapa_0_comparacao_frentes_refatoracao_controlada.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 3. Objetivo do isolamento documental
O objetivo e separar, por analise documental, os helpers de menor risco antes de qualquer extracao fisica.

Neste ponto, o foco nao e mover codigo, e sim definir o menor recorte possivel com base em risco tecnico, risco funcional, dependencias globais e impacto textual.

## 4. Analise individual dos candidatos

### 4.1. `protNomeArquivoBase`
- Responsabilidade aparente: normalizar o nome base do arquivo do relatorio.
- Entradas esperadas: titulo textual do relatorio.
- Saida esperada: string limpa, em minusculas, sem acentos, sem caracteres especiais e com underscore como separador.
- Dependencias diretas: nenhuma alem de operacoes de string nativas.
- Dependencias globais: nenhuma.
- Altera DOM: nao.
- Chama backend: nao.
- Altera estado global: nao.
- Usa string visivel do sistema: sim, porque recebe o titulo do relatorio como entrada e o normaliza para uso em nome de arquivo.
- Risco de extraicao: baixo.
- Motivo para ser candidato ao primeiro recorte: e um helper puro, sem DOM, sem backend, sem sessao e sem dependencias funcionais pesadas. E o menor recorte reutilizavel e reversivel da superfice de relatorio.

### 4.2. `protCsvEsc`
- Responsabilidade aparente: escapar conteudo para CSV.
- Entradas esperadas: valor qualquer convertido para string.
- Saida esperada: string com aspas duplicadas e aspas externas quando houver caracteres reservados.
- Dependencias diretas: nenhuma alem de operacoes de string nativas.
- Dependencias globais: nenhuma.
- Altera DOM: nao.
- Chama backend: nao.
- Altera estado global: nao.
- Usa string visivel do sistema: sim, de forma indireta, porque e usado no conjunto de exportacao que inclui cabecalhos visiveis do relatorio.
- Risco de extraicao: baixo.
- Motivo para ser ou nao ser candidato ao primeiro recorte: e muito seguro tecnicamente, mas ja se conecta a uma rotina de exportacao. Pode entrar depois do primeiro helper, mas nao precisa entrar no primeiro recorte se a recomendacao for a mais conservadora possivel.

### 4.3. `protServicoSelecionado`
- Responsabilidade aparente: recuperar o servico atualmente selecionado a partir da cache local.
- Entradas esperadas: nenhuma entrada direta; depende da selecao global atual.
- Saida esperada: o objeto do servico selecionado ou `null`.
- Dependencias diretas: `protServicosCache`, `protServicoSelecionadoId`.
- Dependencias globais: cache da Tabela de proteticos.
- Altera DOM: nao.
- Chama backend: nao.
- Altera estado global: nao diretamente; apenas le o estado global de selecao.
- Usa string visivel do sistema: nao de forma relevante.
- Risco de extraicao: baixo/medio.
- Motivo para ser ou nao ser candidato ao primeiro recorte: e pequeno e isolado, mas esta ligado ao estado global da selecao da tela. E seguro, porem menos neutro que `protNomeArquivoBase` porque depende da cache e da identificacao do servico selecionado.

### 4.4. `protPdfEscape`
- Responsabilidade aparente: escapar texto para a geracao de PDF simples.
- Entradas esperadas: string de texto qualquer.
- Saida esperada: string escapada para a sintaxe de PDF.
- Dependencias diretas: nenhuma alem de operacoes de string nativas.
- Dependencias globais: nenhuma.
- Altera DOM: nao.
- Chama backend: nao.
- Altera estado global: nao.
- Usa string visivel do sistema: nao de forma relevante.
- Risco de extraicao: baixo.
- Motivo para ser ou nao ser candidato ao primeiro recorte: e extremamente pequeno e puro, mas pertence ao mesmo conjunto de helpers de exportacao. E seguro, embora a recomendacao conservadora ainda prefira iniciar apenas com `protNomeArquivoBase`.

### 4.5. `protFormatoInfo`
- Responsabilidade aparente: mapear formato escolhido para extensao e MIME.
- Entradas esperadas: string de formato, como `PDF`, `HTML`, `RTF`, `XLS`, `TXT` ou `CSV`.
- Saida esperada: objeto com `ext` e `mime`.
- Dependencias diretas: nenhuma.
- Dependencias globais: nenhuma.
- Altera DOM: nao.
- Chama backend: nao.
- Altera estado global: nao.
- Usa string visivel do sistema: nao de forma relevante.
- Risco de extraicao: baixo.
- Motivo para ser ou nao ser candidato ao primeiro recorte: e seguro e puro, mas sozinho nao traz valor funcional isolado para o menor recorte. Pode ser considerado depois, mas nao precisa entrar no primeiro movimento.

## 5. Comparacao entre os candidatos

| Funcao | Tipo de helper | Dependencia global | Dependencia de DOM | Dependencia de backend | Risco textual/mojibake | Risco funcional | Recomendacao |
|---|---|---|---|---|---|---|---|
| `protNomeArquivoBase` | helper puro de string | nao | nao | nao | baixo | baixo | primeiro recorte recomendado |
| `protCsvEsc` | helper de escape para exportacao | nao | nao | nao | baixo/medio | baixo | pode entrar depois |
| `protServicoSelecionado` | helper de selecao de cache | sim, cache de servicos | nao | nao | baixo | baixo/medio | candidato secundario |
| `protPdfEscape` | helper puro de escape | nao | nao | nao | baixo | baixo | pode entrar depois |
| `protFormatoInfo` | helper puro de mapeamento | nao | nao | nao | baixo | baixo | pode entrar depois |

## 6. Escolha do primeiro recorte recomendado
A recomendacao conservadora e: **somente `protNomeArquivoBase`**.

## 7. Justificativa da escolha
`protNomeArquivoBase` e o menor recorte mais reversivel porque:

- nao toca backend;
- nao toca DOM;
- nao altera o fluxo de salvar/excluir;
- nao mexe com relatorio completo;
- nao mexe com eventos;
- nao mexe com permissao;
- nao mexe com sessao;
- nao mexe com endpoint;
- nao altera a selecao principal da tela;
- nao precisa de estado global para funcionar;
- e util como helper isolado para o fluxo de nome de arquivo sem expandir a superficie funcional.

Mesmo `protCsvEsc`, `protServicoSelecionado`, `protPdfEscape` e `protFormatoInfo` sendo helpers relativamente seguros, adiciona-los agora deixaria o primeiro recorte menos minimalista do que o necessario.

## 8. Blocos explicitamente fora do primeiro recorte
Ficam fora do primeiro recorte:

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
- qualquer alteracao em backend;
- qualquer alteracao em banco;
- qualquer alteracao de endpoint;
- qualquer alteracao textual.

## 9. Arquivo futuro sugerido
Sugerido para uma futura organizacao de helpers da Tabela de proteticos, sem criacao nesta etapa:

- `frontend/js/modules/tabela-proteticos-helpers.js`

Este nome e apenas sugestivo. Nada deve ser criado agora.

## 10. Contrato minimo para futura extracao
Se a futura Subetapa 4 extrair o primeiro helper, ela devera respeitar pelo menos:

- preservar a assinatura da funcao;
- preservar o retorno;
- preservar o comportamento;
- nao alterar strings;
- nao alterar chamadas existentes alem do minimo necessario;
- manter compatibilidade global, se necessario;
- executar `node --check` nos arquivos envolvidos;
- testar manualmente o fluxo indicado antes de concluir.

## 11. Onde testar futuramente
Mesmo sendo um helper pequeno, a verificacao futura deve incluir:

- abrir a Tabela de proteticos;
- listar proteticos;
- selecionar protetico;
- abrir relatorio;
- exportar relatorio em arquivo;
- conferir nome de arquivo gerado, se aplicavel;
- confirmar que criacao, edicao e exclusao continuam intactas;
- confirmar que nao houve alteracao textual;
- confirmar que agenda de contatos e controle de proteticos nao foram afetados.

## 12. Registro para roadmap
- A Subetapa 3 isola documentalmente o primeiro recorte candidato.
- A Tabela de proteticos permanece como primeira frente ativa da Fase 2.
- O primeiro recorte funcional futuro deve ser minimo, reversivel e auditavel.
- O candidato preferencial e `protNomeArquivoBase`, salvo descoberta contraria.
- `Editor de texto`, `Ficha pessoal`, `Agenda`, `Conta corrente`, `Usuarios/Login` e `Seeds/tabelas padrao` continuam fora desta frente.

## 13. Confirmacoes finais obrigatorias
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
- Untracked antigos foram preservados.
- O unico arquivo criado/modificado nesta etapa foi `docs/fase_2_subetapa_3_isolamento_documental_primeiro_recorte_tabela_proteticos.md`.
