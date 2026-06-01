# Ficha Pessoal - Anamnese - Contrato de escrita assistida do questionario Principal na clinica 1

## 1. Objetivo
- Definir o contrato seguro para a futura escrita assistida das respostas do questionario Principal na clinica 1.
- Registrar regras de dry-run, execute explicito, nao sobrescrita, backup, validacao e relatorio.
- Garantir que nenhuma escrita real seja executada nesta etapa contratual.

## 2. Contexto do dry-run aprovado
- O dry-run somente leitura das respostas do questionario Principal foi concluido e aprovado.
- O resultado aprovado foi `ANAM-MIG-PRINC-DRY-B`.
- O questionario Principal da clinica 1 agora possui 35 perguntas.
- Existe 1 paciente no legado com respostas no Principal: `Joon Yun Lee Lee`.
- O matching com o Brana e seguro.
- Existem 35 respostas candidatas do Principal.
- As 35 respostas possuem destino estrutural completo no Brana.
- Nao ha conflito com as 15 respostas atuais do Brana.
- O envelope B2 atual suporta essas respostas sem perda.

## 3. Escopo exato da futura escrita
- Um unico paciente legado.
- Um unico paciente Brana correspondente.
- Um unico questionario: `Principal`.
- 35 respostas candidatas no total.
- Escrita futura restrita a clinica ID 1.
- Escrita futura restrita ao paciente alvo aprovado no dry-run.

## 4. Paciente legado e paciente Brana no escopo
- Paciente legado: `273` - `Joon Yun Lee Lee`.
- Paciente Brana correspondente: `273` - `Joon Yun Lee Lee`.
- O paciente alvo permanece inequivoco para esta etapa.

## 5. Questionario no escopo
- Questionario: `Principal`.
- Questionario id no Brana: `2`.
- Numero de perguntas no Brana apos a expansao: `35`.

## 6. Total de respostas no escopo
- Total de respostas candidatas: `35`.
- Respostas com complemento: `0`.
- Respostas com mensagem_alerta: `33`.
- Distribuicao de `tipo_resposta` no legado: `1 = 27`, `2 = 6`, `3 = 2`.

## 7. Regras de conversao para envelope B2
- A escrita futura deve serializar cada resposta em envelope textual B2.
- O envelope deve registrar, no minimo, `versao`, `paciente_id`, `questionario_id`, `questionario_nome`, `pergunta_id`, `pergunta_texto`, `resposta` e `complemento`.
- `resposta` deve preservar os valores lidos do legado para o Principal.
- `complemento` deve ser preservado quando existir; neste caso, o dry-run aponta complemento zero, mas o contrato permanece apto a receber complemento em futuras extensoes.
- `tipo_pergunta` e `mensagem_alerta` continuam como atributos estruturais da pergunta e nao como obrigatorios do payload de resposta.

## 8. Regra de nao sobrescrita
- Nunca sobrescrever resposta ja existente.
- Nunca mesclar resposta nova em registro ja salvo sem autorizacao explicita.
- Se houver qualquer resposta do Principal ja existente para o paciente destino, abortar a escrita e registrar conflito.

## 9. Regra de abortar em conflito
- Abortar se existir qualquer resposta do Principal para o paciente destino.
- Abortar se o matching do paciente deixar de ser inequivoco.
- Abortar se o total esperado de 35 respostas mudar.
- Abortar se o questionario Principal da clinica 1 deixar de estar completo.
- Abortar se a estrutura da clinica 1 mudar entre o dry-run e a execucao real.

## 10. Regra de dry-run padr�o
- O modo padrao deve ser dry-run.
- Dry-run nao escreve no banco.
- Dry-run deve mostrar o plano completo antes de qualquer execucao real.
- Dry-run deve confirmar paciente, questionario, total de respostas, conflito zero e destino completo.

## 11. Regra de execute explicito
- A escrita real so pode ocorrer com flag explicita de execute.
- Execute sem flag nao deve escrever.
- Execute so pode ser aceito depois de dry-run aprovado e revalidado no momento da execucao.

## 12. Regra de backup obrigatorio antes da futura execucao real
- Deve haver backup obrigatorio da tabela de respostas da clinica 1 antes da execucao real.
- Deve haver backup do paciente alvo antes da execucao real.
- O backup deve ser feito antes de qualquer escrita.
- O backup deve permitir restauracao reprodutivel se houver falha parcial.

## 13. Regra de validacao antes e depois
- Validar antes: paciente, questionario, total esperado, ausencia de conflito, destino completo.
- Validar depois: total de respostas gravadas, preservacao do paciente, preservacao do questionario, nao sobrescrita e integridade do banco.
- Se houver divergencia entre dry-run e execute, abortar e registrar o motivo.

## 14. Regra de relatorio pos-execucao
- Deve haver relatorio pos-execucao.
- O relatorio deve registrar contagem final, ids gravados, verificacao de conflito e qualquer divergencia.
- O relatorio deve indicar origem da migracao mesmo sem alterar schema.

## 15. Riscos
- Sobrescrita de resposta existente: alto.
- Divergencia entre dry-run e execute: alto.
- Falha parcial durante a execucao: alto.
- Mudanca de ambiente antes da escrita: medio/alto.
- Alteracao da estrutura entre validacao e execucao: alto.

## 16. Analise das opcoes
- `ANAM-MIG-PRINC-WRITE-A`: conservadora demais para a etapa atual, pois adia indefinidamente a escrita assistida.
- `ANAM-MIG-PRINC-WRITE-B`: dry-run padrao, execute explicito, sem sobrescrita, abortando em qualquer conflito. E a opcao recomendada.
- `ANAM-MIG-PRINC-WRITE-C`: permite completar campos vazios em caso de conflito. Mais arriscada e nao recomendada agora.
- `ANAM-MIG-PRINC-WRITE-D`: escrita em lote para varios pacientes. Nao recomendada nesta fase.

## 17. Decisao recomendada
- `ANAM-MIG-PRINC-WRITE-B`.

## 18. Escopo permitido da futura implementacao
- Futuro script de escrita assistida controlada.
- Futuro backup antes da execucao.
- Futuro dry-run padrao e execute explicito.
- Futuro relatorio de execucao.
- Futura escrita restrita ao paciente `273` e ao questionario `Principal` na clinica 1.

## 19. Escopo proibido da futura implementacao
- Backend funcional novo.
- Banco novo.
- Migrations.
- Seeds.
- Endpoints novos.
- Alteracao em `frontend`.
- Alteracao em `.env`.
- Alteracao em payload de interfaces existentes.
- Alteracao em formato de salvamento fora do envelope B2 ja aprovado.
- Alteracao em arquivos do EasyDental.
- Escrita em lote para outros pacientes.

## 20. Proxima subetapa segura
- Abrir a escrita assistida do Principal em contrato separado, mantendo o paciente unico, o questionario unico e a regra de nao sobrescrita.

## 21. Conclusao
- O contrato de escrita assistida do Principal da clinica 1 pode seguir de forma segura apenas sob dry-run padrao e execute explicito.
- A decisao recomendada e `ANAM-MIG-PRINC-WRITE-B`.
- Nenhuma escrita real foi executada nesta etapa contratual.
