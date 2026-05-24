# Fase 2 - Subetapa 4 - Primeiro recorte funcional mínimo da Tabela de protéticos

## 1. Contexto
Esta etapa executa o primeiro recorte funcional mínimo definido na Subetapa 3.

O helper `protNomeArquivoBase` foi isolado para um arquivo próprio, mantendo o comportamento esperado da Tabela de protéticos e preparando o próximo passo com a menor superficie possivel de risco.

Esta etapa e documental, tecnica e de auditoria do recorte minimo executado.

## 2. Escopo executado
Foi movida somente a funcao `protNomeArquivoBase`.

- Arquivo de origem: `frontend/app.js`
- Arquivo de destino: `frontend/js/modules/tabela-proteticos-helpers.js`
- Ajuste minimo em `frontend/app.js`: remocao da definicao local da funcao para manter o consumo pelo arquivo novo sem alterar o comportamento.
- `frontend/index.html`: alterado de forma minima para carregar o novo modulo antes de `app.js`.
- Motivo tecnico da abordagem: manter compatibilidade com o carregamento global existente, sem mexer em fluxo, DOM, backend ou regras de negocio.

## 3. Escopo nao executado
Nenhuma outra funcao da Tabela de protéticos foi movida.

Nao foram movidas:
- `protCsvEsc`;
- `protServicoSelecionado`;
- `protPdfEscape`;
- `protFormatoInfo`;
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
- `protVincularEventos`.

## 4. Arquivos alterados
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/tabela-proteticos-helpers.js`
- `docs/fase_2_subetapa_4_primeiro_recorte_funcional_tabela_proteticos.md`

## 5. Preservacao funcional
A assinatura, o retorno e o comportamento de `protNomeArquivoBase` foram preservados.

O helper continua gerando a base normalizada do nome do arquivo a partir do titulo informado, sem alterar o resultado esperado.

## 6. Blindagem textual/mojibake
Nenhum texto visivel, acento, label, mensagem, placeholder ou string visivel foi corrigido.

A blindagem textual/mojibake foi respeitada integralmente.

## 7. Checks executados
Checks executados nesta etapa:

- `node --check frontend/app.js` - OK, sem saida.
- `node --check frontend/js/modules/tabela-proteticos-helpers.js` - OK, sem saida.
- Auditoria visual de `frontend/index.html` por diff do trecho alterado: inclusao minima do novo script antes de `app.js`.

## 8. Teste manual obrigatorio antes de avancar
Antes de qualquer proximo recorte funcional, o sistema deve ser testado manualmente com:

- abrir a Tabela de protéticos;
- listar protéticos;
- selecionar protético;
- abrir relatorio;
- exportar relatorio em arquivo;
- conferir o nome do arquivo gerado;
- confirmar que criacao, edicao e exclusao continuam intactas;
- confirmar que nao houve alteracao textual visivel;
- confirmar que agenda de contatos e controle de protéticos nao foram afetados.

## 9. Registro para roadmap
- O primeiro recorte funcional da Fase 2 foi realizado.
- O helper `protNomeArquivoBase` agora esta isolado.
- A Tabela de protéticos continua como primeira frente ativa.
- Proximos recortes so devem ocorrer apos teste manual humano.
- Proximos candidatos possiveis continuam sendo `protCsvEsc`, `protPdfEscape`, `protFormatoInfo` ou `protServicoSelecionado`, mas nenhum foi movido nesta etapa.

## 10. Confirmacoes finais
- Esta etapa alterou somente os arquivos necessarios ao primeiro recorte minimo.
- Nenhuma funcao alem de `protNomeArquivoBase` foi movida.
- `frontend/app.js` foi alterado somente para remover/ajustar esse helper.
- `frontend/index.html` foi alterado somente para carregar o novo modulo.
- `frontend/js/modules/tabela-proteticos-helpers.js` foi criado.
- `backend` nao foi alterado.
- banco, schema, migrations, seeds e endpoints nao foram alterados.
- Nenhum `UPDATE`, `DELETE` ou `INSERT` foi executado.
- Nenhum texto visivel foi corrigido.
- A blindagem textual/mojibake foi respeitada.
- Os untracked antigos foram preservados.