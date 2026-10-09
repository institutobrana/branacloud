# Contrato funcional - seeds de novas contas

## Finalidade
Contrato vigente de bootstrap de novas clínicas no Brana Cloude, consolidado em
SEEDS_BOOTSTRAP_R1B. Esta seção substitui os mínimos antigos de Procedimentos
e a antiga inclusão de Brana/336 descritos no histórico abaixo.

## Regra vigente — nove tabelas oficiais

NEW_CLINIC_STANDARD_TABLES = 9.
NEW_CLINIC_STANDARD_PROCEDURES = 1263.

Fonte ativa versionada: `backend/seeds/procedimentos_bootstrap_canonico.json`,
derivada da carga EasyDental 7.6 PROVEN_PRISTINE final e dos mapas EXACT R1A2/R1A3.
Nenhuma dependência runtime de arquivos locais EasyDental, da clínica 1 ou 4.

| Tabela | Procedimentos |
|---|---:|
| Particular | 112 |
| Sindicato | 238 |
| Bradesco | 94 |
| Banco do Brasil | 188 |
| Caixa Econ Federal | 88 |
| Banespa | 32 |
| Telebras | 101 |
| Petrobras | 174 |
| CNCC | 236 |

A tabela adicional Brana/336 não pertence ao bootstrap. Tabela Exemplo e tabelas
personalizadas não são copiadas. A lista de **Materiais** chamada Tabela Brana
é outro cadastro e não representa uma décima tabela de Procedimentos.

Todos os procedimentos nascem com Nome, Procedimento genérico, Especialidade,
Símbolo gráfico e Forma de cobrança válidos. Referências são resolvidas dentro
do tenant: código literal do Genérico, código de Especialidade e identidade
legada semântica + recurso do Símbolo. PKs são geradas pelo banco; não vêm do legado.
Cobrança segue o valor por registro comprovado (INTERVENCAO ou ELEMENTO_FACE),
não o default visual do formulário nem a posição de um combo.

Genéricos originais 0200–0206 são legítimos e distintos de 00200–00206 (HOF).
Seus nomes originais são preservados e suas listas iniciais de materiais/fases
são vazias, conforme prova da distribuição final. Particular/1012 usa o 0471
existente, sem rename, sobrescrita de descrição ou alteração de materiais/fases.
Caixa/5087 resolve o 0379 existente. Nenhum campo concreto é herdado do Genérico.

Símbolos 58 e 81 preservam identidades próprias, inclusive com bitmap igual a
57 e 18. Deduplicação por imagem/recurso é proibida para identidades legadas.
O combo contextual continua com os 63 aprovados por ESPECIAL histórico <> 10.
Mostrar símbolo permanece DEPRECATED_INTERNAL, sem poder funcional.

Opcionais: tempo, preço, custo, laboratório, lucro/hora, garantia e repasse = zero;
inativo/preferido = false; observações e datas históricas = NULL.
Não copiar personalizações, valores monetários, datas clínicas ou vínculos próprios.
Materiais efetivos = próprios + complementos dinâmicos do Genérico, sem duplicação,
com quantidade própria prevalecendo e sem materialização. Na primeira associação,
fases seguem o Genérico; os catálogos neutros iniciais não trazem fases/materiais.

Reaplicação do bootstrap de nascimento é insert-missing-only: não duplica e não
atualiza procedimentos, nomes/metadados de tabelas, símbolos válidos, campos
personalizados, materiais próprios ou fases existentes. Não é saneamento de dados.
Referência literal ausente/inválida bloqueia a criação e o signup faz rollback;
não usar zero-padding, primeiro item, valores aproximados ou fallback entre tenants.
Conflito de nome de tabela sob outro código exige revisão, não rename silencioso.

NEW_CLINIC_BOOTSTRAP e EXISTING_CLINIC_ALIGNMENT são operações separadas.
O contrato de nascimento não autoriza saneamento global. A autorização específica
R2B abaixo delimita o alinhamento das seis clínicas revisadas.
Clínica 1 permanece fora do alinhamento padrão; clínica 4 tem regra histórica
excepcional separada. Não há hardcode de clínica no bootstrap de nascimento.
Testes mutáveis somente em PostgreSQL descartável e storage temporário, sem
alterar .env, runtime oficial, clínicas reais ou criar migration.

Prova reproduzível: `.venv\Scripts\python.exe -B -m backend.tests.r1b_isolated_bootstrap_runner`.
O harness recusa a porta 55432 ocupada, cria container exclusivo PostgreSQL 16
somente em 127.0.0.1:55432, gera credenciais descartáveis, aplica o schema oficial
nesse alvo e executa o signup real em dois tenants sintéticos. Ao final remove
apenas seu container. Relatórios ficam em
`C:\Temp\Brana\SEEDS_BOOTSTRAP_R1B_IMPLEMENT_AND_ISOLATED_PROOF\`.
Nenhum segredo é persistido nos relatórios; o storage de modelos é temporário.

## Alinhamento controlado de existentes — R2B

Autorização explícita do usuário: clínicas 13, 15, 16, 17, 18 e 19 convergem para
9 tabelas/1263 procedimentos completos. Clínicas 1 e 4 ficam excluídas; a seleção
vem do manifesto revisado, não de exceções hardcoded no domínio/bootstrap novo.
Preencher somente obrigatórios ausentes/inválidos por chave canônica; preservar
valores válidos, símbolos e opcionais personalizados. Catálogos faltantes são
provisionados antes dos vínculos. Não materializar materiais nem mudar fases
sem regra provada; dependência inesperada bloqueia a transação.

Após completude, remover somente as seis Brana/336 e seus 2016 PKs revisados.
Os 562 extras protegidos apenas por símbolos não exigem migração; identidades do
catálogo permanecem. Não usar correspondências semânticas UNPROVEN para remapear.
Novas dependências clínicas/financeiras/históricas/próprias ou alteração dos
fingerprints revisados exigem STOP. Backup restaurável, prova descartável,
rollback verificado e regressão PASS são gates anteriores a qualquer DML.

GET/listagem não provisiona nem repara tabelas ou índices. Jobs automáticos de
recriação de Procedimentos foram retirados do registry. O campo legado
`nome_tabela_procedimentos` permanece fisicamente e pode conservar seu texto,
mas é interno/inerte: não escolhe tabela, default ou fallback de runtime e não
recria Brana. Nenhum valor arbitrário substitui Brana; nenhuma migration.
Escritas de compatibilidade em ações explícitas antigas não lhe devolvem poder
de seleção. Scripts históricos de reparo/compatibilidade não são o bootstrap
atual e não devem ser reaplicados como alinhamento.

Operador: `backend/scripts/alinhar_clinicas_procedimentos.py`, dry-run por padrão,
conexão explícita sem fallback. O caminho operacional oficial R4 exige
`--clinic-id <ID>`: exatamente uma das seis clínicas revisadas por execução,
em uma transação própria e atômica. IDs 1/4, IDs não autorizados, listas e modo
batch são recusados pela CLI antes da conexão. O planner batch remanescente
é somente interno, explicitamente habilitado em regressões do descartável.
Segunda passagem deve emitir zero DML antes do commit. Rollback restaura PKs e
valores do backup apenas se o post-state ainda coincide; não reverte sequences
nem sobrescreve edição interveniente. Evidências ficam fora do repositório.
PER_CLINIC_BACKUP_REQUIRED = SIM: backup scoped individual atualizado, checksum
individual e restauração/rollback individual comprovados antes de cada apply.
Nenhum backup monolítico é proteção suficiente para essa operação.
Harness: `python -B -m backend.tests.r2b_isolated_alignment_runner --out <provas>`;
para verificar um backup individual: `--verify-backup --clinic-id <ID>
--out <raiz-da-sequência>`, exclusivamente no descartável em 127.0.0.1:55432.
O harness recusa porta ocupada e remove apenas seu próprio container.

### Guard semântico de exclusão — R2B R3

O operador protege ID1/ID4 pelo snapshot versionado
`brana_procedimentos_scoped_guard_v1`, não pelo hash integral indiscriminado
do tenant. A única exclusão técnica comprovada é `usuarios.last_seen_at`,
presença autenticada usada no ADM Online, sem papel no alinhamento/FKs.
Nenhum timestamp de auditoria do domínio é omitido automaticamente.

O escopo inclui todos os campos/PKs dos Procedimentos (inclusive órfãos),
tabelas, Genéricos, símbolos, auxiliares, materiais/listas, fases, índices,
TISS, configurações pertinentes, relações diretas e fingerprints integrais
dos payloads históricos inspecionados. Rows são ordenadas deterministicamente;
mudança de schema, entidade, campo ou valor protegido bloqueia.

As seis clínicas aceitam somente o delta exato do manifesto; opcionais,
catálogos existentes, materiais/fases e configuração inerte permanecem.
Uma barreira positiva de SQL/tenant/PK/binds também rejeita DML nos excluídos,
inclusive UPDATE sem efeito. Novos PKs de catálogo são resolvidos por identidade
literal, nunca presumidos. A validação final inclui leitura independente READ
ONLY para detectar mutação concorrente não visível no snapshot REPEATABLE READ.

Snapshots scoped são evidência separada e versionada; o backup integral antigo
não é reinterpretado retroativamente. Apply exige backup/provas/checksums
atualizados, baseline scoped válido e todas as proteções anteriores.
Instalar/testar o guard não autoriza alinhamento produtivo nesta fase.

### Execução por clínica e guard entre etapas — R2B R4

Além de ID1/ID4, todos os outros cinco targets ficam protegidos integralmente
enquanto a clínica corrente é alinhada. O delta autorizado aplica-se somente
à clínica indicada. Falha em qualquer guard/validação antes do commit faz
rollback completo daquela clínica; nunca avança silenciosamente para a próxima.
Mudança detectada depois do commit exige STOP e revisão, não overwrite/rollback
cego de possíveis alterações intervenientes.

A primeira operação `--mode backup --clinic-id <ID> --start-sequence` cria o
baseline semântico da sequência fora do repo. Os backups seguintes usam a mesma
raiz `--out`, sem `--start-sequence`. O baseline só avança pelo delta validado do
apply; não pode ser substituído nem regenerado por conveniência entre etapas.
Backup existente não pode ser sobrescrito. Uma mudança real em qualquer clínica
entre etapas bloqueia a próxima operação; presença `usuarios.last_seen_at`
continua sendo a única exclusão volátil. Locks transacionais serializam os
operadores, sem alterar tenants não selecionados.

Após backup/restauração verificados e regressão atual PASS, `--mode apply`
exige o ACK destrutivo explícito existente. A validação inclui 9/1263, zero
incompletos/Brana/FKs pendentes, expected-diff, ID1/ID4 e os outros targets.
`--mode check --clinic-id <ID>` exige plano sem nenhuma alteração e executa
uma segunda passagem independente: DML = 0; não pode ser usado para alinhar.
Cada execução registra clinic_id, início, baseline, backup/checksum, linhas por
entidade, validação, segunda passagem e commit/rollback, sem credenciais.

Esta fase R4 implementa/prova somente no PostgreSQL descartável. Não abre
conexão produtiva, não altera clínica real e não autoriza retry produtivo.

## Exceção histórica ID4 — R2C R1

Somente o operador `backend/scripts/sanar_procedimentos_clinica4.py` pode fazer
o saneamento histórico expressamente autorizado da ID4. Não é regra global,
default de formulário, bootstrap de nova clínica ou alinhamento das seis clínicas.
O antigo sugerido 82/Consulta não é obrigatório nem autoriza criar catálogo.

Escolher Genérico ativo do próprio tenant, sem materiais e sem fases, pelo menor
código literal estável entre candidatos neutros. Ausência de candidato seguro exige
STOP para decisão. A escolha é um vínculo técnico histórico, não uma equivalência
clínica pelo nome. Somente materiais/fases são governados pelo Genérico; os demais
atributos dele não são copiados. Alterações futuras de sua composição podem afetar
os procedimentos vinculados e exigem a revisão funcional correspondente.

Preencher somente obrigatórios ausentes/inválidos: Genérico neutro selecionado,
Especialidade Gerais (05), símbolo Consulta (identidade 10 / int_consulta.bmp) e
cobrança INTERVENCAO. Nome nunca é inventado: ausência bloqueia toda a operação.
Valores válidos são preservados, inclusive quando diferem desses defaults.
Não alterar tabelas, catálogos, opcionais, mostrar_simbolo, materiais próprios,
fases existentes ou auditoria. Backfill direto não executa hooks de save/herança.

Uma transação exclusiva da ID4; backup scoped novo depois da prova isolada,
checksums e rollback restaurado no PostgreSQL descartável são obrigatórios.
Guard semântico protege integralmente ID1 e todas as demais clínicas; ID4 aceita
somente o delta exato de obrigatórios. Qualquer diferença faz rollback/STOP.
Segunda passagem exige zero DML. Vínculos de tabela legados já inválidos não são
remapeados/removidos por esta autorização; devem permanecer exatamente iguais,
sem novas referências inválidas, e ficam para auditoria separada. A completude
dos cinco obrigatórios não equivale ao saneamento desses vínculos estruturais.
A exceção não é importada por rotas/services/seeds.
Harness: `python -B -m backend.tests.r2c_isolated_id4_runner --out <artefatos>`;
`--verify-backup` prova o backup novo exclusivamente no container próprio 55432.
Os dados de Procedimentos/materiais são reproduzidos exatamente; payloads privados
não relacionados usam sentinelas no clone e guards before/after, não dados reais.

## Histórico SUPERSEDED — mínimos anteriores de Procedimentos

Os trechos anteriores abaixo são referência histórica; em qualquer conflito de
Procedimentos/Genéricos/fases/símbolos prevalece a seção vigente acima. Regras de
outros cadastros permanecem em seus contratos próprios. Os arquivos R2 de edição
não são alterados nesta consolidação do provisionamento.

Este documento define a regra futura desejada para o nascimento de novas contas e novas clinicas no Brana Cloud.

Ele nao implementa nada. Ele serve como contrato funcional antes de qualquer alteracao de codigo.

## Regra principal
Todas as novas contas/clinicas, inclusive contas demo/trial de 7 dias, devem nascer com seeds sanitizados.

Nao deve existir excecao para conta demo carregar:
- precos;
- custos;
- fases;
- materiais vinculados;
- composicoes prontas;
- heranca automatica pronta com dados sensiveis.

## Base documental
Este contrato foi elaborado com base na auditoria:
- `docs/auditoria_seeds_novas_contas_procedimentos_materiais.md`

## Escopo
Aplica-se apenas ao nascimento de novas contas e novas clinicas.

Nao trata de:
- alteracao de dados de clinicas existentes;
- atualizacao de cadastros ja criados;
- frontend;
- modularizacao;
- correcao textual/mojibake;
- migracoes;
- scripts de banco;
- rotina manual de backfill;
- alteracao de regra comercial da conta demo/trial para outros fluxos.

## Contrato de nascimento

### 1. Procedimentos
Novos procedimentos devem nascer mantendo somente:
- `codigo`, se existir;
- `nome`;
- campos obrigatorios tecnicos exigidos pelo schema, como `clinica_id` e `tabela_id`.

Nao devem nascer com:
- preco;
- custo;
- custo de material;
- custo de laboratorio;
- lucro;
- margem;
- tempo/duracao;
- garantia;
- valor de repasse;
- especialidade, se nao for obrigatoria;
- simbolo grafico, se nao for obrigatorio;
- observacoes;
- `procedimento_generico_id`;
- materiais vinculados;
- fases;
- composicao pronta;
- qualquer campo financeiro/tecnico nao obrigatorio.

### 1.1 Tabela PARTICULAR em novas contas
A tabela de preco `PARTICULAR` deve continuar sendo criada no nascimento de novas contas e pode continuar vindo com os 336 procedimentos esperados.

Para esses procedimentos da `PARTICULAR`, os campos financeiros devem nascer zerados:
- `preco = 0.0`;
- `custo = 0.0`;
- `custo_lab = 0.0`;
- `lucro_hora = 0.0`;
- `valor_repasse = 0.0`;
- `garantia_meses = 0`.

O campo `forma_cobranca` deve ser preservado.

Devem ser preservados tambem:
- `codigo`;
- `nome`;
- `clinica_id`;
- `tabela_id`;
- `procedimento_generico_id`;
- `simbolo_grafico`;
- `simbolo_grafico_legacy_id`;
- `mostrar_simbolo`;
- `preferido`;
- `inativo`.

Nao deve haver atualizacao retroativa de contas existentes.
Se o procedimento ja existir por `clinica_id + tabela_id + codigo`, o fluxo deve ignorar e nao atualizar.
Essa regra vale apenas para novos nascimentos de conta/clinica e nao deve sobrescrever valores reais editados por usuarios.

### 2. Materiais
Novos materiais devem nascer mantendo somente:
- `codigo`, se existir;
- `nome`;
- campos obrigatorios tecnicos exigidos pelo schema, como `lista_id`.

Nao devem nascer com:
- custo;
- preco;
- relacao;
- validade;
- unidade, se nao for obrigatoria;
- classificacao, se nao for obrigatoria;
- fabricante;
- estoque;
- qualquer campo financeiro/tecnico nao obrigatorio.

### 3. Procedimentos genericos
Novos procedimentos genericos devem nascer mantendo somente:
- `codigo`, se existir;
- `descricao`/`nome`;
- `clinica_id`;
- campos obrigatorios tecnicos exigidos pelo schema.

Nao devem nascer com:
- tempo;
- custo;
- peso;
- simbolo grafico, se nao for obrigatorio;
- especialidade, se nao for obrigatoria;
- observacoes;
- materiais vinculados;
- fases;
- composicoes;
- heranca automatica pronta.

### 4. Tabelas de vinculo/fase/composicao
Para novas contas, devem nascer vazias:
- `procedimento_material`;
- `procedimento_fase`;
- `procedimento_generico_material`;
- `procedimento_generico_fase`;
- tabelas equivalentes, se existirem.

Se algum vinculo for obrigatorio por schema, isso deve ser tratado como excecao tecnica documentada, com justificativa clara.

## Escopo negativo
Este contrato nao permite:
- alterar dados de clinicas existentes;
- executar `UPDATE`/`DELETE` em dados atuais;
- mexer em frontend;
- mexer em modularizacao;
- corrigir textos/mojibake;
- alterar a regra comercial da demo/trial de 7 dias;
- criar fluxo separado em que demo receba dados completos;
- criar excecao funcional que mantenha seeds sensiveis para qualquer conta nova.

## Plano de implementacao futura
Recomenda-se executar em subetapas pequenas e conservadoras:

### Subetapa 1A - procedimentos padrao
- reduzir o seed de procedimentos ao minimo funcional;
- manter apenas identificacao e campos tecnicos obrigatorios;
- nao afetar clinicas existentes.

### Subetapa 1B - signup_service se necessario
- ajustar apenas o ponto de nascimento de novas contas, se o seed sozinho nao bastar;
- manter o impacto restrito ao signup de novas contas;
- nao alterar fluxos de edicao nem retroalimentacao de dados existentes.

### Subetapa 2A - materiais
- sanitizar o seed de materiais para novos nascimentos;
- manter apenas identificacao e campos tecnicos obrigatorios.

### Subetapa 3A - procedimentos genericos
- sanitizar o seed de procedimentos genericos;
- nao carregar valores financeiros ou composicoes prontas.

### Subetapa 4A - impedir vinculos/fases/composicoes automaticas
- impedir que novas contas nascam com vinculos, fases ou composicoes automatizadas;
- impedir heranca sensivel no momento do nascimento da conta;
- manter a criacao manual posterior funcionando para edicao individual.

### Subetapa 5A - teste em ambiente seguro
- criar nova conta de teste em ambiente controlado;
- validar os cadastros nas telas de Procedimentos, Materiais e Procedimentos Genericos;
- confirmar ausencia de dados sensiveis no nascimento;
- validar edicao manual e reabertura sem erros.

## Excecoes tecnicas
Se algum campo sensivel for exigido pelo schema, a excecao deve ser:
- minima;
- documentada;
- justificada por obrigacao tecnica, nao comercial;
- limitada ao estritamente necessario para persistencia.

## Critério funcional final
Uma nova conta/clinca estara conforme este contrato quando:
- procedimentos nascerem sem campos financeiros e sem composicao herdada;
- materiais nascerem sem custo/preco/relacao sensiveis;
- procedimentos genericos nascerem sem fases, materiais ou heranca automatica pronta;
- tabelas de vinculo/composicao/fase estiverem vazias no nascimento;
- a conta demo/trial seguir exatamente o mesmo padrao sanitizado das demais novas contas.

## Confirmacoes finais
- Este documento e somente um contrato funcional.
- Este documento nao altera codigo.
- Este documento nao altera seeds.
- Este documento nao altera banco.
- Este documento nao altera frontend.
- Este documento nao altera rotas.
- Este documento nao altera comportamento.
