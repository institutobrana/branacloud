# Auditoria - possivel banco incorreto ou perda de persistencia apos reinicio do Unicorn

## 1. Contexto

- O usuario relatou que, apos reiniciar o Unicorn, percebeu ausencia de `Wilker@digitalprodutora.com.br`.
- Tambem relatou ausencia de uma conta criada em `27/05/2026`.
- O usuario observou que algumas configuracoes e checkboxes de contas existentes pareceram voltar ao estado antigo.
- As auditorias anteriores nao localizaram o alvo correto no banco atual.
- Esta etapa foi executada somente em modo leitura.

## 2. Escopo e proibicoes

- Nenhum codigo foi alterado.
- Nenhum dado de banco foi alterado.
- Nenhum backup foi restaurado.
- Nenhum script de escrita foi executado.
- Nao houve reinicio automatizado de servico.

## 3. Banco configurado pela aplicacao

- Arquivo de conexao: [`backend/database.py`](D:\BRANA ARQUIVOS\BRANA CLOUD\backend\database.py).
- O backend carrega [`backend/.env`](D:\BRANA ARQUIVOS\BRANA CLOUD\backend\.env) em `backend/main.py` antes de importar o banco.
- Variavel efetiva lida no arquivo local: `DATABASE_URL=postgresql://postgres:1234@localhost:5432/brana_saas`.
- Banco efetivo usado pela aplicacao local atual: `brana_saas` em PostgreSQL.
- O processo local em execucao foi observado como `uvicorn main:app --host 0.0.0.0 --port 8000 --reload` com Python do `venv` do proprio projeto.

## 4. Ambiente/Unicorn

- Foi encontrado processo `uvicorn`/`python` apontando para a arvore do projeto atual.
- O comando observado usa `D:\\BRANA ARQUIVOS\\BRANA CLOUD\\venv\\Scripts\\python.exe` e `uvicorn.exe` do proprio projeto.
- Nao foi encontrado `render.yaml` nem `Procfile` dentro deste workspace.
- Nao foi encontrado arquivo de servico systemd/docker equivalente dentro do repositório.
- O `backend/main.py` carrega `backend/.env` por caminho relativo ao proprio arquivo, o que reduz a dependencia do diretório atual.
- Nao ha evidencia, nesta leitura, de que o reinicio tenha trocado a URL de banco por configuracao externa visivel no repositorio.

## 5. Bancos e backups encontrados

- Bancos PostgreSQL disponiveis no servidor local:
  - `brana_saas`
  - `brana_saas_test`
  - `postgres`
- Arquivos de backup/copia encontrados em `backend/backups`:
  - 12 arquivos, todos ligados a backfills/anamnese.
  - Nao apareceram arquivos com marcadores de `Wilker`, `digitalprodutora.com.br` ou `2026-05-27`.
- Nao foram encontrados bancos locais do tipo `.db`/`.sqlite` dentro deste workspace atual que parecessem ser o banco vivo do Brana Cloud.
- Nao foi encontrado backup de banco com o alvo correto nesta trilha.

## 6. Resultado no banco atual

- Banco atual confirmado por leitura: `brana_saas`.
- `Wilker@digitalprodutora.com.br`:
  - nao encontrado em `usuarios`;
  - nao encontrado em `clinicas`;
  - nao encontrado em `prestador_odonto`;
  - nao encontrado em `usuario_perfil_acesso`;
  - nao encontrado em `access_profile`;
  - nao encontrado em `unidade_atendimento`;
  - nao encontrado em `plataforma_auditoria`;
  - contagem por `digitalprodutora.com.br` em `usuarios`: `0`.
- Conta criada em `27/05/2026`:
  - nao encontrada em `clinicas`.
  - nao apareceu evento correspondente em `plataforma_auditoria`.
- Clinica `ID 17`:
  - existe no banco atual;
  - nome: `Tel`;
  - e-mail: `institutobrana@gmail.com`;
  - `ativo = true`;
  - usuarios vinculados atuais: `39` e `40`.
- Ultimos identificadores:
  - maior `clinica_id`: `17`;
  - maior `usuario_id`: `40`.
- Ultimos registros:
  - a clinica mais recente no banco atual e `ID 17`, criada em `2026-05-26 18:32:17.857708-03:00`;
  - os usuarios mais recentes visiveis sao os da clinica `17` e usuarios antigos da clinica `1`.
- Auditoria:
  - o ultimo conjunto de eventos consultado nao mostra `digitalprodutora.com.br`;
  - o unico `Wilker` historico continua sendo o caso antigo `id = 3 / wilker1983@gmail.com`.
- Checkbox/configuracao:
  - `clinicas.opcoes_sistema_json` mostra `seguranca.ativar_controle_usuarios = true` para as clinicas `1` e `17`.
  - nao foi possivel comprovar, apenas por leitura, que houve reversao desse checkbox; o estado atual persistido aparece ligado.

## 7. Resultado em banco alternativo

- Banco alternativo consultado: `brana_saas_test`.
- Esse banco existe no mesmo servidor PostgreSQL local.
- Ele possui as tabelas principais esperadas.
- Resultado nesse banco:
  - nao encontrei `Wilker@digitalprodutora.com.br`;
  - nao encontrei `digitalprodutora.com.br`;
  - nao encontrei clinica de `27/05/2026`;
  - nao encontrei `clinica ID 17`;
  - nao encontrei marcadores de auditoria do alvo correto.
- Conclusao:
  - o banco alternativo nao contem os dados ausentes.

## 8. Logs de reinicio/persistencia

- Nao foram encontrados logs de runtime ou startup relevantes dentro do workspace atual.
- Nao foi encontrado `backend/backups/runtime_bootstrap_audit.jsonl` como evidência de execucao recente nesta arvore.
- Nao foram encontrados arquivos `*.log` relevantes no repositório para esta trilha.
- Portanto, nao houve confirmacao documental de erro de persistencia, rollback ou banco em modo somente leitura.

## 9. Hipoteses avaliadas

- Banco errado: avaliado, sem evidencia de troca.
- Banco restaurado: avaliado, sem evidencia de restore.
- Banco antigo: avaliado, sem evidencia de apontamento para banco historico.
- Caminho relativo: avaliado, mas `backend/main.py` aponta para `backend/.env` do proprio projeto.
- `.env` diferente: nao encontrado dentro do repositorio.
- Worktree/ambiente diferente: a worktree existe como copia de comparacao, mas tambem nao mostrou os alvos ausentes.
- Falha de persistencia: nao comprovada.
- Exclusao real: continua possivel como hipoteses externas, mas nao foi comprovada por esta auditoria de ambiente.

## 10. Classificacao final

- **BD-A** - Banco atual correto, dados realmente ausentes.
- **BD-G** - Sem indício de troca/rollback.

## 11. Conclusao

- O sistema local observado parece usar o banco esperado `brana_saas`.
- Nao foi encontrado outro banco com `Wilker@digitalprodutora.com.br` ou com a conta de `27/05/2026`.
- Nao ha indicio documental de rollback ou restauracao.
- Nao ha indicio documental de falha de persistencia do checkbox, apenas o estado atual persistido como `true` nas clinicas consultadas.
- Nao ha evidencia, nesta leitura, de exclusao real ligada a esta trilha de ambiente.
- Com o material atual, ainda e prudente manter a auditoria forense de exclusao/logs com identificadores mais precisos.

## 12. Proxima etapa recomendada

- Continuar a auditoria forense de exclusao/logs com identificadores mais precisos do alvo ausente.
- Se o sintoma de configuracao voltar a aparecer, auditar especificamente o salvamento do checkbox e a rota que persiste `clinicas.opcoes_sistema_json`.

## 13. Confirmacoes de escopo

- Nenhum codigo alterado.
- `frontend/app.js` nao alterado.
- `frontend/index.html` nao alterado.
- `frontend/js/modules` nao alterado.
- Backend nao alterado.
- Banco, schema, migrations, seeds e endpoints nao alterados.
- Dados do banco nao alterados.
- Permissoes e seeds nao alteradas.
- Blindagem textual/mojibake respeitada.

## 14. Registro para roadmap

- Auditoria tecnica de banco apos reinicio do Unicorn executada em leitura.
- Banco local observado: `brana_saas`.
- Banco alternativo consultado: `brana_saas_test`, sem os dados ausentes.
- Sem evidencia de troca/rollback.
- Classificacao final: `BD-A` e `BD-G`.
- Blindagem textual/mojibake respeitada.
