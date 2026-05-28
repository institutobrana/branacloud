# Correcao urgente do signup apos 8U - NameError `_apply_user_links`

## 1. Contexto

- A Subetapa 8U ajustou o nascimento do usuario ADM inicial para `Dentista (CD)`, com prestador ADM/Mestre funcional e unidade Principal / 0001.
- A validacao manual da nova conta falhou em `/signup/confirm` com erro 500.
- O erro observado no CMD foi `NameError: name '_apply_user_links' is not defined`.
- O problema apareceu no fluxo de criacao da conta, no ponto em que o signup tentava aplicar os vinculos do usuario ADM inicial.

## 2. Causa encontrada

- A chamada `_apply_user_links(db, usuario_admin, prestador_adm, unidade_principal)` existia no fluxo, mas a funcao nao estava definida no escopo de `backend/services/signup_service.py`.
- Nao havia helper equivalente com o mesmo efeito para ser reutilizado de forma direta.
- A intencao do trecho era apenas amarrar o usuario ADM inicial ao prestador ADM/Mestre funcional e a unidade Principal / 0001, preservando o tipo tecnico de usuario da 8U.

## 3. Correcao aplicada

- Foi criado um helper local minimo em `backend/services/signup_service.py` com o nome `_apply_user_links`.
- O helper apenas aplica, se necessario:
  - `usuario.prestador_id = prestador.id`
  - `usuario.unidade_atendimento_id = unidade.id`
  - `usuario.tipo_usuario = Dentista (CD)`
- A correcao preserva o fluxo da 8U e nao altera setup, senha interna, Opcoes do Sistema, frontend, seeds ou contas existentes.

## 4. Arquivos alterados

- `backend/services/signup_service.py`
- `docs/correcao_signup_apply_user_links_apos_8u.md`
- `docs/11_roadmap_desenvolvimento.md`

## 5. Conta parcial de `institutobrana@gmail.com`

- Foi feita verificacao somente leitura apos o erro.
- Resultado encontrado: nao houve conta parcial persistida para `institutobrana@gmail.com`.
- A tentativa falhada nao deixou clinica, usuarios, prestadores ou unidade residuais no banco.
- Foi encontrado apenas um registro residual de `email_codes` para `institutobrana@gmail.com`, sem conta associada.

## 6. Checks executados

Comandos executados:
```powershell
python -m py_compile backend/services/signup_service.py backend/security/permissions.py
.\.venv\Scripts\python.exe -c "import sys; sys.path.insert(0, r'D:\\BRANA ARQUIVOS\\BRANA CLOUD\\backend'); from services import signup_service; print('ok')"
```

Resultado:
- compilacao Python concluida com sucesso;
- import seguro de `services.signup_service` concluido com sucesso;
- nenhuma conta foi criada automaticamente durante a correcao.

## 7. Onde testar manualmente

- Criar novamente uma nova conta limpa com `institutobrana@gmail.com`.
- Verificar no modulo Usuarios:
  - `Tipo de usuario = Dentista (CD)`;
  - associacao ao prestador ADM/Mestre funcional;
  - unidade de atendimento `Principal / 0001`.
- Verificar que o modulo Prestadores continua com `Clínica` e o prestador ADM.
- Verificar que `Tabela Exemplo` nao nasce.
- Verificar que o setup continua aparecendo para o ADM inicial, como previsto pela 8U.

## 8. Fora de escopo

- setup para usuarios posteriores;
- Opcoes do Sistema;
- senha interna;
- senha de login SaaS;
- permissoes;
- TISS;
- tabelas de procedimentos;
- unidade Principal / 0001 como regra de criacao;
- frontend;
- contas existentes;
- correcao textual da tela de setup.

## 9. Riscos e rollback

- Risco principal: nome tecnico do tipo de usuario ficar divergente do valor esperado pelo combo.
- Risco secundario: o helper ser chamado fora do ponto correto do fluxo.
- Rollback: novo commit revertendo apenas esta pequena correcao, se necessario.
- Como nao houve conta parcial, nao houve necessidade de exclusao segura adicional nesta etapa.

## 10. Proxima subetapa recomendada

- Repetir o teste manual de criacao limpa com `institutobrana@gmail.com` para validar 8P, 8K, 8R e 8U apos a correcao.
- Se a criacao voltar a falhar por outro motivo, abrir nova correcao pontual sem ampliar o escopo.
