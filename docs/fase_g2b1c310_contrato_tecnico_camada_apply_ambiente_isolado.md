# Fase G.2B.1C.3.1.0 - Contrato tecnico da camada apply para ambiente isolado

Data: 2026-08-04

## 1. Resultado
- APROVADA PARA CONTRATO DOCUMENTAL;
- nenhuma implementacao foi feita;
- `APPLY_ENABLED` nao foi alterado;
- nenhum teste de persistencia foi executado;
- nenhum banco isolado foi criado.

## 2. Escopo
Este contrato define a futura camada de escrita do backfill de origem de simbolos graficos em ambiente isolado. A escrita real continua proibida nesta fase.

## 3. Arquitetura interna
### 3.1 Camada de CLI
- recebe argumentos;
- valida flags e confirmacoes;
- seleciona modo;
- emite mensagens;
- retorna exit codes.

### 3.2 Camada de manifesto
- carrega o manifesto;
- valida schema estrutural;
- valida checksum;
- valida categorias;
- valida IDs;
- valida metadados obrigatorios.

### 3.3 Camada de snapshot
- consulta o estado atual do banco autorizado;
- calcula assinaturas atuais;
- compara banco e manifesto;
- gera o plano completo de escrita.

### 3.4 Camada de apply
- recebe apenas um plano previamente validado;
- executa updates parametrizados;
- valida rowcount;
- confirma contagens finais;
- decide commit ou rollback.

### 3.5 Camada de relatorio
- registra pre-condicoes;
- registra execucao;
- registra commit ou rollback;
- nao expõe segredos nem credenciais.

## 4. Responsabilidades
| Componente atual | Responsabilidade | Read-only | Futuro apply |
|---|---|---:|---:|
| `backend/scripts/backfill_origem_simbolos_graficos.py` | CLI, validacao de manifesto, leitura de snapshot, geracao de plano, bloqueio atual de apply | sim | sim |
| `compute_manifest_checksum()` | checksum canonico do manifesto | sim | sim |
| `build_record_signature()` | assinatura normalizada de cada linha | sim | sim |
| `validate_manifest()` | validacao estrutural e contratual do manifesto | sim | sim |
| `validate_database_state()` | snapshot do estado atual | sim | sim |
| `build_update_plan()` | comparacao banco versus manifesto | sim | sim |
| `dry_run_report()` | relatorio somente leitura | sim | sim |
| `optionally_apply()` | gate atual de bloqueio do apply | sim | sim, apos autorizacao futura |

## 5. Limites de seguranca
- o apply so pode existir com autorizacao explicita em tempo de execucao;
- o apply deve ser proibido fora do ambiente isolado;
- `brana_saas` operacional deve permanecer bloqueado nesta trilha;
- `prod` deve permanecer bloqueado;
- `hml` e `local` operacional nao podem ser usados para escrita desta frente;
- o manifesto deve ter checksum permitido;
- fixture de teste nao pode ser usada para escrita operacional.

## 6. Gates e flags
### 6.1 Gates independentes recomendados
- `APPLY_IMPLEMENTED`
- `APPLY_RUNTIME_AUTHORIZED`
- `ALLOWED_APPLY_ENVIRONMENTS`
- `ALLOWED_DATABASES`
- `ALLOWED_MANIFEST_CHECKSUMS`

### 6.2 Mecanismo de controle
- constante para habilitacao estrutural;
- variavel de ambiente para autorizacao temporaria;
- flag CLI para confirmacao textual;
- combinacao dos tres gates para execucao efetiva.

### 6.3 Regra de autorizacao
- codigo de apply pode existir sem ser executado;
- execucao so ocorre se todos os gates convergirem;
- a autorizacao deve falhar por bloqueio assim que um gate divergir.

## 7. Ambiente autorizado
- o unico ambiente futuro permitido para escrita inicial deve ser isolado;
- database deve ser temporario e explicitamente nomeado para teste;
- schema deve corresponder ao ambiente aprovado;
- o banco operacional `brana_saas` continua proibido nesta fase;
- `local`, `hml` e `prod` permanecem proibidos para apply real.

## 8. Validação previa total
Antes do primeiro `UPDATE`, o fluxo futuro deve validar:
1. manifesto;
2. checksum;
3. ambiente;
4. banco;
5. schema e tabela;
6. total;
7. estado de origem;
8. todos os IDs;
9. assinaturas;
10. missing;
11. conflitos;
12. estado parcial;
13. plano completo;
14. divergencia zero;
15. autorizacao de escrita.

## 9. SQL parametrizado
- toda escrita futura deve usar SQL parametrizado;
- nenhum valor do manifesto deve ser concatenado em SQL bruto;
- IDs, origens e assinaturas devem ser passados como parametros;
- o texto SQL deve permanecer estático e revisavel;
- qualquer lote deve preservar o mesmo contrato de bind.

## 10. Transacao
- abrir conexao controlada;
- iniciar transacao;
- aplicar modo restritivo;
- validar estado completo;
- executar updates somente apos todas as validacoes;
- validar rowcount final;
- commit apenas se tudo corresponder;
- rollback integral em qualquer erro.

## 11. Concorrencia
- a escrita futura deve evitar corrida entre snapshot e update;
- o estado lido deve ser protegido contra divergencia durante a execucao;
- locks ou isolamento transacional devem ser definidos antes do apply;
- qualquer mudanca externa que altere a base deve invalidar a execucao.

## 12. Rowcount
- cada update futuro deve ser conferido contra a expectativa do plano;
- rowcount menor ou maior do que o previsto deve gerar rollback;
- rowcount zero em item planejado deve ser tratado como divergencia;
- a validacao final deve fechar em contagem exata.

## 13. Commit e rollback
### 13.1 Commit
- somente apos validacao total do plano;
- somente se rowcount bater;
- somente se o estado final permanecer consistente.

### 13.2 Rollback
- qualquer falha deve reverter a transacao inteira;
- o rollback deve ser imediato e verificavel;
- nenhuma escrita parcial pode ser considerada aprovada.

## 14. Relatorios
- relatorio de pre-condicoes;
- relatorio de execucao;
- relatorio de divergencias;
- relatorio de commit ou rollback;
- relatorio final em JSON e resumo textual;
- sem segredos, tokens ou credenciais.

## 15. Idempotencia
- a primeira execucao pode preencher apenas o subconjunto previsto;
- a segunda execucao deve resultar em zero updates;
- o apply deve ser rerun-safe;
- qualquer divergencia de origem ja preenchida deve bloquear ou pular conforme contrato aprovado.

## 16. Estado parcial
- se o ambiente interromper no meio, a transacao deve reverter ou reportar estado claro;
- nunca considerar meia execucao como sucesso;
- nenhuma linha parcialmente escrita pode ficar sem rastreabilidade;
- o plano deve suportar retorno seguro sem ambiguidade.

## 17. Banco isolado
- usar database temporario ou container descartavel;
- restauracao e destruicao devem ser possiveis sem risco ao banco real;
- credenciais reais nao devem ser reutilizadas;
- o banco operacional deve permanecer fora do alcance da fase.

## 18. Testes obrigatorios
- dry-run sem escrita;
- apply em banco isolado;
- rollback em banco isolado;
- idempotencia em segunda execucao;
- rejeicao por checksum invalido;
- rejeicao por categoria invalida;
- rejeicao por ID duplicado;
- rejeicao por banco divergente;
- rejeicao por ambiente nao autorizado;
- rejeicao por rowcount divergente.

## 19. Arquivos permitidos
- `backend/scripts/backfill_origem_simbolos_graficos.py`
- helpers futuros do mesmo escopo, se necessários
- testes futuros do apply isolado
- documentacao desta trilha

## 20. Separacao formal
- implementar apply nao equivale a executar apply;
- testar apply nao equivale a autorizar banco operacional;
- aplicar no banco autorizado nao pertence a esta fase;
- a escrita real permanece fora do escopo atual.

## 21. Ponto de bloqueio atual
- o script atual ainda funciona como read-only;
- a mensagem de bloqueio do apply permanece desatualizada;
- isso e risco textual, nao permissao de escrita;
- a correção fica para fase futura de implementacao.

## 22. Conclusao
- a fase `G.2B.1C.3.1.0` fica encerrada como contrato tecnico;
- a camada apply futura foi definida em escopo, gates, validacoes, transacao, rollback e testes;
- nenhuma escrita foi autorizada ou executada.
