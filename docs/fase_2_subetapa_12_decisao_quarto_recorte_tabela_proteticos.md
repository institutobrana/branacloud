# Fase 2 — Subetapa 12 — Decisão documental do quarto recorte mínimo da Tabela de protéticos

## 1. Contexto
Os helpers abaixo já foram isolados:

- `protNomeArquivoBase`;
- `protFormatoInfo`;
- `protCsvEsc`.

Esta etapa avalia o próximo candidato:

- `protPdfEscape`.

## 2. Estado atual
- `frontend/js/modules/tabela-proteticos-helpers.js` já existe.
- `protNomeArquivoBase` está isolado e validado.
- `protFormatoInfo` está isolado e validado.
- `protCsvEsc` está isolado e complementado documentalmente após a pendência da Subetapa 11.
- O próximo recorte, se aprovado, deve mover somente `protPdfEscape`.
- A Tabela de protéticos segue como primeira frente ativa da Fase 2.

## 3. Análise de `protPdfEscape`
- Responsabilidade aparente: escapar texto para sintaxe de PDF.
- Entradas esperadas: string de texto qualquer.
- Saída esperada: string escapada para PDF.
- Usa DOM: não.
- Chama backend: não.
- Altera estado global: não.
- Depende de cache global: não.
- Usa string visível: sim, pois protege o conteúdo textual do relatório em PDF.
- Risco textual/mojibake: baixo, mas presente por atuar diretamente em conteúdo textual exportado.
- Risco funcional: baixo.
- Relação com exportação PDF: direta; é o helper que protege a geração textual usada no PDF.
- Compatibilidade com o arquivo `tabela-proteticos-helpers.js`: alta; encaixa naturalmente no módulo já existente.
- Adequação como quarto recorte: boa.

## 4. Diferença entre `protPdfEscape` e recortes anteriores
Comparando `protPdfEscape` com os helpers já isolados:

- `protNomeArquivoBase` atua na normalização do nome do arquivo.
- `protFormatoInfo` atua no mapeamento de formato/extensão/MIME.
- `protCsvEsc` atua na proteção do conteúdo textual de exportação CSV.

`protPdfEscape` atua no conteúdo de exportação PDF.

Por isso, ele é mais sensível que helpers de nome/formato, mas ainda parece menor do que mover relatório completo, exportação completa ou envio de e-mail.

## 5. Riscos específicos
Riscos específicos identificados para `protPdfEscape`:

- alteração acidental de escape de caracteres;
- diferença no conteúdo final do PDF;
- quebra de caracteres especiais;
- risco textual/mojibake;
- impacto limitado ao PDF, se a assinatura e comportamento forem preservados;
- necessidade de testar exportação PDF após o recorte.

## 6. Decisão recomendada
**Opção A: recomendar `protPdfEscape` como quarto recorte funcional mínimo futuro.**

A recomendação é conservadora porque ainda limita o próximo passo a um único helper puro e isolado.

## 7. Justificativa da decisão
`protPdfEscape` deve avançar para recorte funcional porque:

- é helper pequeno;
- não usa DOM;
- não chama backend;
- não depende de estado/cache global;
- encaixa no arquivo de helpers já existente;
- ainda assim exige teste manual de PDF.

`protPdfEscape` não é tão sensível quanto relatório completo, exportação completa ou envio de e-mail, que continuam fora.

## 8. Blocos explicitamente fora do quarto recorte
Continuam fora do quarto recorte:

- `protServicoSelecionado`;
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

## 9. Contrato mínimo para futura Subetapa 13
A futura Subetapa 13 deverá:

- mover somente `protPdfEscape`;
- preservar assinatura;
- preservar retorno;
- preservar comportamento;
- não alterar strings visíveis;
- não alterar layout;
- não alterar backend;
- não alterar banco;
- não alterar endpoints;
- não mover outro helper junto;
- executar `node --check` nos arquivos envolvidos;
- fazer commit seletivo;
- exigir teste manual humano antes de próximo recorte;
- testar exportação PDF.

## 10. Onde testar futuramente
Após eventual quarto recorte funcional futuro, o usuário deve testar:

- abrir a Tabela de protéticos;
- listar protéticos;
- selecionar protético;
- abrir relatório;
- exportar relatório em PDF;
- conferir conteúdo do PDF exportado;
- conferir caracteres especiais no PDF;
- conferir nome do arquivo gerado;
- confirmar que exportações CSV e demais formatos continuam intactas;
- confirmar que criação, edição e exclusão continuam intactas;
- confirmar que não houve alteração textual visível;
- confirmar que agenda de contatos e controle de protéticos não foram afetados.

## 11. Registro para roadmap
- A Subetapa 12 decide documentalmente o quarto recorte mínimo.
- `protNomeArquivoBase`, `protFormatoInfo` e `protCsvEsc` já estão isolados.
- A pendência da Subetapa 11 foi complementada pela Subetapa 11B.
- O próximo recorte funcional futuro deve seguir a decisão desta etapa.
- Se aprovado, mover somente `protPdfEscape`.
- A Tabela de protéticos continua como primeira frente ativa da Fase 2.
- Próximos recortes devem permanecer pequenos, reversíveis, auditáveis e com teste humano.
- `protServicoSelecionado` continua fora por depender de cache/estado.
- Persistência, carga, relatório completo, e-mail, eventos, backend, banco e endpoints continuam fora.
- `Editor de texto`, `Ficha pessoal`, `Agenda`, `Conta corrente`, `Usuários/Login` e `Seeds/tabelas padrão` continuam fora desta frente.

## 12. Commit seletivo obrigatório
- Único arquivo que deve entrar no commit desta etapa: `docs/fase_2_subetapa_12_decisao_quarto_recorte_tabela_proteticos.md`
- Não usar `git add .`.
- Não usar `git add docs/`.
- Não incluir untracked antigos.
- Não incluir `frontend/app.js`.
- Não incluir `frontend/index.html`.
- Não incluir `frontend/js/modules`.
- Não incluir `backend`.
- Não incluir banco/schema/migrations/seeds/endpoints.
- Commit deve ser seletivo e auditado.

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
- O único arquivo criado/modificado nesta etapa foi `docs/fase_2_subetapa_12_decisao_quarto_recorte_tabela_proteticos.md`.
