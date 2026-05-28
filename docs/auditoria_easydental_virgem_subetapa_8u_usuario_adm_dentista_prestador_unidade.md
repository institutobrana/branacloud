# Auditoria EasyDental virgem - Subetapa 8U - usuÃ¡rio ADM com Dentista (CD), prestador ADM e unidade Principal

## 1. Contexto

- A Subetapa 8T registrou a validacao manual da nova conta e fechou o contrato preliminar para o usuario ADM inicial.
- A Subetapa 8T-B complementou a leitura com mirror local, reforcando os achados de usuario, prestador, unidade e setup.
- A Subetapa 8T-C confirmou diretamente no UNC principal `\\Sonyvaio\c\EDS70` que `Mestre`, `Clínica`, `Dentista (CD)`, `Principal / 0001`, `ControleUsuarios=0` e `Auditoria=0` existem na fonte principal.
- Esta 8U implementa apenas o nascimento do usuario ADM inicial das novas contas.
- A regra de setup para usuarios posteriores continua fora do escopo e fica para a 8V.

## 2. Regra implementada

- O `tipo_usuario` do usuario ADM inicial passa a nascer como `Dentista (CD)`.
- O `prestador_id` do usuario ADM inicial passa a apontar para o prestador ADM/Mestre funcional.
- A `unidade_atendimento_id` do usuario ADM inicial passa a apontar para a unidade `Principal / 0001`.
- A regra vale somente para novas contas.
- Contas existentes permanecem preservadas.

## 3. Diagnostico tecnico

- Antes desta subetapa, o usuario ADM inicial nascia com `tipo_usuario="ClÃ­nica"`, o que nao representava o combo observado no modulo UsuÃ¡rios.
- O fluxo foi ajustado em `backend/services/signup_service.py`, no bloco de criacao da nova conta SaaS.
- O valor anterior de `tipo_usuario` era `ClÃ­nica`.
- O novo valor tecnico aplicado para `tipo_usuario` Ã© `Dentista (CD)`.
- O prestador ADM foi localizado por `clinica_id` e `source_id=1`, com `codigo=002`, `tipo_prestador="Cirurgião dentista"` e reaproveitamento idempotente quando o registro ja existe.
- A unidade `Principal / 0001` foi localizada por `clinica_id` e `source_id=1`, com `codigo="0001"` e `nome="Principal"`, tambem de forma idempotente.
- O vinculo do usuario ADM com prestador e unidade foi aplicado apos `db.flush()` do usuario, usando o helper compartilhado de links do modulo de usuarios.
- Para manter permissao e selecao do combo coerentes com o valor novo, `backend/security/permissions.py` foi ajustado para reconhecer `Dentista (CD)` como tipo de usuario dentista.

## 4. Implementacao

- Arquivos alterados:
  - `backend/services/signup_service.py`
  - `backend/security/permissions.py`
- Funcoes alteradas:
  - `criar_conta_saas`
  - `normalize_tipo_usuario`
- Regra anti-duplicidade:
  - o prestador ADM/Mestre funcional continua sendo buscado por `clinica_id` + `source_id=1`;
  - a unidade Principal continua sendo buscada por `clinica_id` + `source_id=1`;
  - o helper de links reaproveita os registros encontrados;
  - nenhuma unidade nova e nenhum prestador novo sao criados se o registro funcional ja existir.
- Preservacao de contas existentes:
  - o ajuste vale apenas para a criacao de novas contas;
  - o contrato de update de usuarios existentes nao foi alterado;
  - setup e Opcoes do Sistema nao foram tocados.

## 5. Fora de escopo

- Setup para usuarios posteriores.
- Opcoes do Sistema.
- Senha interna.
- Senha de login SaaS.
- Permissoes.
- TISS.
- Tabelas de procedimentos.
- Unidade Principal / 0001 como criacao.
- Frontend.
- Contas existentes.
- Correcao textual da tela de setup.

## 6. Checks executados

- `python -m py_compile backend/services/signup_service.py backend/security/permissions.py`
- `python -c "import sys; sys.path.insert(0, r'"'"'D:\\BRANA ARQUIVOS\\BRANA CLOUD\\backend'"'"'); from services import signup_service; print('"'"'ok'"'"')"`
- Resultado dos checks:
  - compilacao Python sem erro para os dois arquivos alterados;
  - import seguro do `signup_service` concluido com sucesso;
  - nenhuma conta foi criada automaticamente durante os checks.

## 7. Teste manual obrigatorio

- Criar nova conta limpa.
- Abrir o modulo Usuários.
- Verificar que o usuario ADM aparece com `Tipo de usuário = Dentista (CD)`.
- Verificar que `Associar a prestador` aponta para o prestador ADM/Mestre funcional.
- Verificar que `Unidade de atendimento` aponta para `Principal / 0001`.
- Abrir o modulo Prestadores e verificar que existem `Clínica` e o prestador ADM.
- Verificar que o prestador ADM segue como `Cirurgião dentista`.
- Verificar que as tabelas de procedimentos continuam corretas.
- Verificar que `Tabela Exemplo` nao nasce.
- Verificar que o setup continua aparecendo para o ADM inicial.
- Verificar que o setup para usuarios criados depois ainda sera tratado na 8V.

## 8. Riscos e rollback

- Risco de o combo nao selecionar `Dentista (CD)` se o valor tecnico nao bater com a descricao do auxiliar.
- Risco de a permissao do usuario dentista ficar incoerente se a normalizacao nao reconhecer o novo valor.
- Risco de a unidade nao aparecer se a vinculacao apos o `flush` falhar.
- Risco de a conta de teste ficar com dados parciais se a criacao for interrompida no meio.
- Rollback por novo commit revertendo apenas esta alteracao.
- Conta de teste incorreta deve ser excluida por procedimento seguro, nao por remoÃ§ao manual improvisada.

## 9. Proxima subetapa recomendada

- 8U-validaÃ§Ã£o manual, se necessario, para confirmar o combo do modulo Usuários.
- 8V para impedir que o setup apareca para usuarios criados posteriormente.
- Nao tratar Opcoes do Sistema ainda.
