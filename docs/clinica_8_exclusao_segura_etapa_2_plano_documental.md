# Clínica 8 — Exclusão segura — Etapa 2 — Plano documental de exclusão segura

## 1. Objetivo da Etapa 2
Documentar um plano seguro para a futura exclusão da clínica 8, vinculada ao e-mail `institutobrana@gmail.com`, usando como base o diagnóstico somente leitura da Etapa 1.

Esta etapa não executa exclusão, não altera o banco e não cria runner. O foco é definir ordem, backups, validações, riscos e critérios objetivos para a próxima fase.

## 2. Decisão de negócio consolidada
- A clínica 8 é uma conta de teste.
- A clínica 8 não será saneada/corrigida.
- A estratégia passa a ser a exclusão segura da conta/clínica de teste ID 8.
- O objetivo final é liberar o e-mail `institutobrana@gmail.com` para um novo cadastro limpo futuro.

## 3. Escopo
Esta etapa é exclusivamente documental.

Não há:
- alteração de banco;
- alteração de código;
- runner;
- script de exclusão;
- exclusão real;
- correção de access_profile;
- correção de signup;
- correção de usuários;
- correção de frontend;
- correção de backend.

## 4. Entidades raiz da exclusão futura
Entidades que precisam ser consideradas como núcleo da limpeza futura, sempre com validação prévia:
- `clinicas.id = 8`
- `usuarios.id = 19`
- `usuarios.id = 20`
- `prestador_odonto.id = 13`
- `plataforma_assinaturas.id = 11`
- `access_profile` da clínica 8
- demais registros diretamente vinculados à clínica 8 por `clinica_id`

Observação importante:
- a exclusão não deve ser guiada por nome, descrição ou grafia;
- a exclusão deve ser guiada por `clinica_id`, `usuario_id`, `prestador_id` e IDs previamente validados.

## 5. Grupos de tabelas que devem ser removidos no futuro, se confirmado
### 5.1 Assinatura / licença trial
- `plataforma_assinaturas`
- `assinaturas`, se houver registros futuros ou remanescentes
- `plataforma_cobrancas`, se aparecerem cobranças vinculadas

### 5.2 Vínculos usuário / prestador
- `prestador_odonto`
- tabelas filhas de prestador, se existirem futuramente
- dependências indiretas por `usuario_id = 19` e `usuario_id = 20`

### 5.3 Perfis / permissões
- `access_profile`
- `usuario_perfil_acesso`, se vier a existir em novo ciclo

### 5.4 Cadastros auxiliares exclusivos da clínica
- `convenio_odonto`
- `plano_odonto`
- `grupo_financeiro`
- `categoria_financeira`
- `indice_financeiro`
- `item_auxiliar`
- `simbolo_grafico_catalogo`
- `doenca_cid`

### 5.5 Cadastros clínicos
- `procedimento_tabela`
- `procedimento_generico`
- `procedimento`
- `procedimento_material`
- `procedimento_fase`
- `procedimento_generico_fase`
- `procedimento_generico_material`

### 5.6 Materiais
- `lista_material`
- `material`

### 5.7 Anamnese
- `anamnese_questionarios`
- `anamnese_perguntas`
- `anamnese_respostas`, se vier a existir

### 5.8 Configurações / preferências
- `cenario`
- `relatorio_config`
- `unidade_atendimento`, se aparecer em novo ciclo

### 5.9 Usuários
- `usuarios.id = 19`
- `usuarios.id = 20`

### 5.10 Clínica
- `clinicas.id = 8` por último

## 6. Grupos e tabelas que NÃO devem ser removidos sem confirmação adicional
Os itens abaixo não podem ser tratados como dados exclusivos da clínica 8 sem prova adicional:
- qualquer tabela sem `clinica_id = 8`
- qualquer registro de outra clínica
- qualquer registro encontrado apenas por nome, descrição ou grafia
- qualquer tabela com vínculo compartilhado entre clínicas 1, 4 e 8
- `modelos_documento`
- `etiqueta_padrao`
- `planos`
- `tiss_tipo_tabela`
- outros catálogos globais ou semi-globais equivalentes
- qualquer dado cuja exclusividade não tenha sido comprovada por consulta direta

## 7. Proposta de ordem futura de exclusão
Ordem documental sugerida, sem execução:

1. Remover folhas mais internas e dependências sem filhos, se existirem.
2. Remover vínculos intermediários de apoio.
3. Remover tabelas filhas de `procedimento`, `procedimento_generico`, `material`, `anamnese_questionarios`, `indice_financeiro` e `prestador_odonto`.
4. Remover registros de configuração e permissões ligados à clínica.
5. Remover cadastros auxiliares exclusivos da clínica.
6. Remover cadastros clínicos principais.
7. Remover o prestador vinculado ao usuário sistema.
8. Remover os usuários `19` e `20`.
9. Remover a assinatura/plataforma associada.
10. Remover a clínica 8 por último.

Justificativa:
- a maior parte das tabelas raiz usa FK `NO ACTION`;
- a remoção em ordem de folhas para raiz reduz bloqueio por FK;
- `prestador_odonto.usuario_id -> usuarios.id` exige atenção porque o usuário sistema não deve sair antes do prestador;
- tabelas compartilhadas não podem ser tratadas como limpeza da clínica 8.

## 8. Plano de backup obrigatório antes da execução real
Antes de qualquer execução real, produzir backups lógicos e evidências de leitura para:
- linhas da clínica 8;
- usuários `19` e `20`;
- prestador `13`;
- `plataforma_assinaturas.id = 11`;
- `access_profile` da clínica 8;
- tabelas volumosas vinculadas a `clinica_id = 8`;
- contagens pré-exclusão por tabela;
- consultas que demonstrem ausência ou presença de dependências;
- qualquer ramo que venha a crescer entre esta etapa e a execução real.

Recomendação documental:
- salvar os backups em local do projeto;
- não salvar em pastas proibidas;
- manter o material de backup separado por data e etapa.

## 9. Plano de validação antes da execução real
Imediatamente antes de qualquer exclusão real, revalidar:
- `current_database`;
- branch atual;
- que `clinica_id = 8` continua sendo `Instituto Brana`;
- que o e-mail continua sendo `institutobrana@gmail.com`;
- que os usuários `19` e `20` continuam sendo os mesmos;
- que o prestador `13` continua sendo o mesmo;
- que não há pacientes, tratamentos, lançamentos, agenda e cobranças reais ligados à clínica;
- que `email_codes` continua sem prender o e-mail;
- que `plataforma_auditoria` continua sem prender o e-mail;
- quantidade por tabela imediatamente antes da exclusão;
- eventuais novos vínculos que possam ter surgido entre a Etapa 1 e a execução real.

## 10. Plano de validação pós-exclusão futura
Após a exclusão futura, os SELECTs devem confirmar:
- `clinica_id = 8` sem linhas nas tabelas alvo;
- `usuarios.id IN (19, 20)` sem dependências remanescentes nas tabelas do escopo;
- `prestador_id = 13` sem dependências remanescentes;
- `institutobrana@gmail.com` sem vínculo em autenticação/usuários;
- `clinicas.id = 8` inexistente;
- nenhuma clínica 1 ou 4 afetada;
- novo cadastro com `institutobrana@gmail.com` possível em etapa posterior.

Observação:
- `plataforma_auditoria` pode ser preservada se a estratégia de retenção de auditoria assim exigir, desde que isso fique decidido antes da execução real.

## 11. Critérios de segurança para a próxima etapa
Qualquer runner futuro de exclusão controlada deve obedecer:
- `clinica_id` explícito;
- e-mail esperado explícito;
- `--execute` obrigatório para exclusão real;
- dry-run como padrão;
- validação de `current_database`;
- validação do nome e do e-mail da clínica;
- uso de transação;
- rollback em erro;
- impressão de contagens antes e depois;
- proibição de apagar dados compartilhados;
- proibição de executar no import;
- travas para impedir execução fora do contexto da clínica 8.

## 12. Recomendação da Etapa 3
Na próxima etapa, criar um runner/script de exclusão controlada, ainda sem execução real.

Esse runner deve nascer com:
- dry-run por padrão;
- travas fortes de segurança;
- validação de banco, clínica e e-mail;
- exigência de `--execute` para exclusão real;
- ausência de execução automática no import.

## 13. Confirmações finais
- Somente `docs/clinica_8_exclusao_segura_etapa_2_plano_documental.md` foi criado/modificado nesta etapa.
- Esta etapa foi somente documental.
- Nada foi excluído.
- O banco não foi alterado.
- Nenhum código foi alterado.
- Não houve `git add`, `commit` ou `push`.
- Não houve runner.
- Não houve script novo.
- A blindagem textual/mojibake foi respeitada.
- As pastas proibidas não foram tocadas.
