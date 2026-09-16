# Fase G.2B.1C.3.0 - Plano documental de pre-aplicacao, backup, rollback e ambiente isolado

Data: 2026-08-04

## 1. Resultado
- APROVADA PARA PLANEJAMENTO DOCUMENTAL;
- nenhuma escrita foi executada;
- `APPLY_ENABLED` nao foi alterado;
- nenhum teste de persistencia contra banco real foi executado.

## 2. Estado canonico da trilha
- classificacao historica consolidada: `docs/fase_g2b1b4_consolidacao_final_dry_run_origens.md`
- plano reversivel canônico: `docs/fase_g2b1c0_plano_reversivel_backfill_origem.md`
- script read-only: `docs/fase_g2b1c1_script_read_only_manifesto_testes.md`
- manifesto operacional: `docs/fase_g2b1c2_manifesto_operacional_dry_run_local.md`
- encerramento formal: `docs/fase_g2b1c21_encerramento_final_manifesto_operacional.md`
- provas negativas: `docs/fase_g2b1c22_complemento_provas_negativas_manifesto.md`

## 3. Inconsistencia textual registrada
- a mensagem de bloqueio do script ainda referencia `Fase G.2B.1C.1`;
- o bloqueio funcional esta correto;
- a referencia textual ficou desatualizada;
- a correção deve ocorrer em fase futura, junto da implementacao de escrita, sem liberar apply aqui.

## 4. Sequencia futura separada
### G.2B.1C.3.1 - Implementacao da camada apply
- implementar a escrita futura em ambiente controlado;
- manter apply real proibido nesta fase documental;
- corrigir a mensagem de fase desatualizada;
- implementar rollback transacional;
- implementar validacao de rowcount;
- proteger contra origem divergente.

### G.2B.1C.3.2 - Testes de persistencia em banco isolado
- criar ou restaurar banco descartavel;
- carregar fixture controlada;
- executar apply;
- validar commit;
- validar rollback;
- validar idempotencia;
- destruir apenas o ambiente criado.

### G.2B.1C.3.3 - Auditoria da implementacao de escrita
- revisar SQL;
- revisar transacao;
- revisar locks;
- revisar logs;
- revisar seguranca;
- revisar backup e rollback.

### G.2B.1C.4.0 - Plano de aplicacao no banco local autorizado
- planejamento documental apenas;
- snapshot;
- janela;
- comandos;
- criterios de interrupcao.

### G.2B.1C.4.1 - Aplicacao local
- somente apos autorizacao explicita;
- primeira escrita possivel em `brana_saas`.

## 5. Ambiente isolado
### Opcao preferencial
- banco PostgreSQL temporario com database separada;
- schema isolado;
- conexao sem credenciais reais;
- destruivel apos validacao.

### Alternativa aceitavel
- container PostgreSQL descartavel;
- volume temporario;
- sem acesso a dados operacionais;
- banco criado exclusivamente para testes.

### Opcao condicionada
- banco de teste ja existente somente se for comprovadamente isolado e restauravel;
- nunca usar ambiente com dados operacionais misturados.

## 6. Backup obrigatorio
- backup logico anterior a qualquer apply futuro;
- exportar `id`, `origem`, `legacy_id`, `clinica_id` e assinatura;
- guardar checksum e timestamp do backup;
- validar restauracao antes de liberar escrita.

## 7. Rollback
### Transacional
- a escrita futura deve ser atomica;
- qualquer divergencia deve reverter a transacao inteira.

### Posterior
- a reversao futura deve restaurar apenas o subconjunto previsto;
- a reversao deve ser idempotente;
- o plano deve gerar relatorio proprio.

## 8. Controle de concorrencia
- evitar corrida entre leitura e escrita;
- manter janela de aplicacao delimitada;
- exigir locks ou isolamento adequado para a operacao futura;
- recusar execucao se o estado do banco mudar antes do apply.

## 9. Gates de autorizacao
- manifesto canonico valido;
- checksum canonico valido;
- IDs unicos e sem lacunas estruturais;
- banco e schema esperados;
- backup validado;
- ambiente isolado aprovado;
- janela formal autorizada;
- confirmacao explicita antes de qualquer escrita.

## 10. Evidencias antes de tocar no banco local
- snapshot antes;
- checksum antes e depois;
- total por categoria;
- dry-run identico ao esperado;
- registro de validacao do ambiente;
- prova de restore do backup;
- registro de bloqueio da fase anterior.

## 11. Criterios de homologacao
- ambiente descartavel funcional;
- apply executa apenas no alvo isolado;
- commit e rollback observados;
- idempotencia confirmada;
- relatorios completos;
- nenhuma contaminacao no banco real.

## 12. Criterios para eventual producao
- homologacao integral concluida;
- rollback testado;
- backup testado;
- bloqueios de divergencia comprovados;
- janela operacional formal;
- autorizacao explicita do responsavel.

## 13. Separacao formal
- implementar apply nao e testar apply;
- testar apply nao e aplicar no banco autorizado;
- aplicar no banco autorizado nao pode ocorrer nesta fase;
- a escrita real continua fora do escopo atual.

## 14. Conclusao
- a fase `G.2B.1C.3.0` fica encerrada como plano documental;
- nenhuma implementacao foi iniciada;
- a trilha segue bloqueada para escrita real ate nova autorizacao.
