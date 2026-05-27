# Correção signup — PRIVATE_TABLE_NAME ausente após 8P

## Contexto

- Após a correção da Subetapa 8P, o login de contas antigas voltou a funcionar.
- A criação de nova conta falhou em `/signup/confirm`.
- O erro observado foi `NameError: name 'PRIVATE_TABLE_NAME' is not defined`.
- O traceback apontou `backend/routes/auth_routes.py`, `backend/services/signup_service.py` e `backend/seeds/procedimentos_padrao.py`.

## Causa encontrada

- Em `backend/seeds/procedimentos_padrao.py`, o helper `_garantir_tabelas_procedimentos_iniciais` comparava o nome da tabela com `PRIVATE_TABLE_NAME`.
- O arquivo não possuía essa constante no seu próprio escopo.
- O restante do seed da 8P permaneceu válido; a falha foi apenas a referência não definida.

## Correção aplicada

- Arquivo alterado:
  - `backend/seeds/procedimentos_padrao.py`
- Método usado:
  - definição local da constante `PRIVATE_TABLE_NAME = "Brana"`.
- A correção é mínima e conservadora.
- Não houve alteração na lógica dos seeds da 8P.
- Não houve mudança de nomes de tabelas.

## Conta parcial

- Consulta segura no banco para `institutobrana@gmail.com` retornou zero linhas em:
  - `clinicas`
  - `usuarios` por e-mail
  - `usuarios` vinculados à clínica do e-mail
- Conclusão: não foi encontrada conta parcial para `institutobrana@gmail.com`.
- O rollback/transação parece ter preservado o banco.

## Segurança

- Nenhuma conta foi criada automaticamente nesta correção.
- Nenhuma senha foi alterada.
- Nenhuma conta existente foi modificada.
- `frontend`, `setup`, senha interna, `Opções do Sistema`, unidade Principal / 0001, permissões, TISS e migrations ficaram fora do escopo.

## Checks executados

- `git status --short`
- `git grep -n "PRIVATE_TABLE_NAME|TABELA_BRANA|BRANA_TABLE_NAME|PROCEDIMENTO_TABELA_PRIVADA|Tabela Brana|Brana" backend/seeds backend/services backend/routes backend/models`
- `python -m py_compile backend/seeds/procedimentos_padrao.py backend/seeds/procedimentos_easy_tabelas.py`
- Validação de importação do seed por leitura no ambiente Python do projeto.
- Consulta segura ao banco para confirmar ausência de conta parcial.

## Onde testar

- Tentar novamente criar nova conta limpa com `institutobrana@gmail.com`.
- Validar o fluxo `/signup/confirm`.
- Confirmar que a nova conta nasce com 8J/8K/8P corretas.

## Fora de escopo

- Alterações de setup/senha interna.
- Correção textual da tela de setup.
- Unidade Principal / 0001.
- Seeds de procedimentos além da correção da constante ausente.
- Frontend.
- Permissões.
- TISS.
- Banco/schema/migrations.

## Riscos e rollback

- Risco: a constante ter sido corrigida de forma errada e quebrar novamente o seed.
- Mitigação: correção local e explícita com o mesmo nome lógico usado pelo projeto, `Brana`.
- Rollback: novo commit revertendo apenas esta alteração.
- Não foi necessário excluir conta parcial, porque nenhuma foi encontrada.

## Próxima subetapa recomendada

- Tentar novamente criar uma conta limpa com `institutobrana@gmail.com` e validar 8J/8K/8P.
