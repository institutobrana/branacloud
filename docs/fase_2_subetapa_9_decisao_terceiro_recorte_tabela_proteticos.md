# Fase 2 — Subetapa 9 — Decisão documental do terceiro recorte mínimo da Tabela de protéticos

## 1. Contexto
Os dois primeiros helpers da Tabela de protéticos já foram extraídos e validados:

- `protNomeArquivoBase`;
- `protFormatoInfo`.

Esta Subetapa 9 existe para decidir, com segurança, qual será o próximo helper a ser extraído, sem executar qualquer movimento de código neste momento.

## 2. Estado atual
- `frontend/js/modules/tabela-proteticos-helpers.js` já existe.
- `protNomeArquivoBase` está isolado e validado.
- `protFormatoInfo` está isolado e validado.
- O próximo recorte só deve mover um helper.
- A Tabela de protéticos segue como primeira frente ativa da Fase 2.

## 3. Análise de `protCsvEsc`
- Responsabilidade aparente: escapar valores para CSV.
- Entradas esperadas: qualquer valor convertido para string.
- Saída esperada: string segura para CSV, com aspas duplicadas quando necessário.
- Usa DOM: não.
- Chama backend: não.
- Altera estado global: não.
- Depende de cache global: não.
- Usa string visível: sim, de forma indireta, porque atua sobre dados exportados.
- Risco textual/mojibake: baixo.
- Risco funcional: baixo.
- Relação com exportação CSV: direta; é o helper que protege o conteúdo textual do CSV.
- Compatibilidade com o arquivo `tabela-proteticos-helpers.js`: alta; encaixa naturalmente no módulo já existente.
- Adequação como terceiro recorte: muito boa, por ser puro, pequeno e previsível.

## 4. Análise de `protPdfEscape`
- Responsabilidade aparente: escapar texto para sintaxe de PDF.
- Entradas esperadas: string de texto qualquer.
- Saída esperada: string escapada para PDF.
- Usa DOM: não.
- Chama backend: não.
- Altera estado global: não.
- Depende de cache global: não.
- Usa string visível: sim, pois protege o conteúdo textual do relatório em PDF.
- Risco textual/mojibake: baixo.
- Risco funcional: baixo.
- Relação com exportação PDF: direta; é o helper que protege a geração textual usada no PDF.
- Compatibilidade com o arquivo `tabela-proteticos-helpers.js`: alta; também cabe no módulo já existente.
- Adequação como terceiro recorte: boa, mas com impacto potencialmente mais sensível no fluxo de exportação do que o CSV.

## 5. Comparação tabular

| Função | Tipo de helper | Dependência de DOM | Dependência de backend | Dependência de estado/cache global | Risco textual/mojibake | Risco funcional | Área impactada | Recomendação |
|---|---|---|---|---|---|---|---|---|
| `protCsvEsc` | helper de escape CSV | não | não | não | baixo | baixo | exportação CSV | **terceiro recorte recomendado** |
| `protPdfEscape` | helper de escape PDF | não | não | não | baixo | baixo | exportação PDF | deixar para depois |

## 6. Escolha recomendada
A recomendação conservadora para o terceiro recorte funcional futuro é **somente `protCsvEsc`**.

## 7. Justificativa da escolha
`protCsvEsc` é o helper mais adequado para o próximo recorte porque:

- é puro;
- não usa DOM;
- não chama backend;
- não depende de estado ou cache global;
- tem menor complexidade estrutural;
- tem comportamento previsível;
- atua em um formato de exportação simples e fácil de auditar;
- encaixa naturalmente no arquivo `frontend/js/modules/tabela-proteticos-helpers.js`.

`protPdfEscape` deve ficar para depois porque o PDF é um fluxo de exportação mais sensível e mais propenso a exigir checagem adicional no conteúdo gerado.

## 8. Blocos explicitamente fora do terceiro recorte
Continuam fora do terceiro recorte:

- `protPdfEscape`;
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

## 9. Contrato mínimo para futura Subetapa 10
Se a Subetapa 10 for aprovada, ela deverá:

- mover somente o helper escolhido;
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
- exigir teste manual humano antes de próximo recorte.

## 10. Onde testar futuramente
Após o terceiro recorte funcional futuro, o usuário deve testar:

- abrir a Tabela de protéticos;
- listar protéticos;
- selecionar protético;
- abrir relatório;
- exportar no formato relacionado ao helper movido;
- conferir conteúdo/arquivo exportado;
- conferir nome do arquivo gerado;
- confirmar que criação, edição e exclusão continuam intactas;
- confirmar que não houve alteração textual visível;
- confirmar que agenda de contatos e controle de protéticos não foram afetados.

## 11. Registro para roadmap
- A Subetapa 9 decide documentalmente o terceiro recorte mínimo.
- `protNomeArquivoBase` e `protFormatoInfo` já estão isolados e validados.
- O próximo recorte funcional futuro deve mover somente o helper escolhido nesta etapa.
- A Tabela de protéticos continua como primeira frente ativa da Fase 2.
- Próximos recortes devem permanecer pequenos, reversíveis, auditáveis e com teste humano.
- `protServicoSelecionado` continua fora por depender de cache/estado.
- Persistência, carga, relatório completo, e-mail, eventos, backend, banco e endpoints continuam fora.
- `Editor de texto`, `Ficha pessoal`, `Agenda`, `Conta corrente`, `Usuários/Login` e `Seeds/tabelas padrão` continuam fora desta frente.

## 12. Commit seletivo obrigatório
- Único arquivo que deve entrar no commit desta etapa: `docs/fase_2_subetapa_9_decisao_terceiro_recorte_tabela_proteticos.md`
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
- O único arquivo criado/modificado nesta etapa foi `docs/fase_2_subetapa_9_decisao_terceiro_recorte_tabela_proteticos.md`.
