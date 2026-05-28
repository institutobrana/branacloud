## Fase 2B - Retomada da validacao 8W-B de usuarios novos

### 1. Contexto

- A exclusao de usuario comum foi validada manualmente e nao bloqueia mais a trilha.
- A proxima etapa correta e retomar a validacao da 8W-B.
- Nao ha nova modularizacao nesta etapa.
- Nao ha nova implementacao nesta etapa.

### 2. Fontes consultadas

- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2b_validacao_manual_exclusao_usuario_comum_aprovada.md`
- `docs/fase_2b_auditoria_retomada_modularizacao_pos_correcao_exclusao_usuario.md`
- `docs/correcao_exclusao_usuario_modulo_usuarios.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/auditoria_easydental_virgem_subetapa_8vb_implementacao_setup_usuarios_posteriores.md`
- `docs/auditoria_easydental_virgem_subetapa_8wa_auditoria_permissoes_usuarios_novos.md`

### 3. Objetivo da 8W-B

- A 8W-B definiu o baseline de permissões de usuarios novos.
- O objetivo funcional e fazer usuarios novos nao-admin nascerem com acesso livre aos modulos comuns, mantendo `Usuarios` e `Opcoes do Sistema/Configuracao` protegidos por padrao.
- `is_admin=True` continua com tudo habilitado.
- O checkbox `ativar_controle_usuarios` fica fora do escopo desta retomada.

### 4. Regras funcionais vigentes

- Usuarios novos devem nascer com acesso livre aos modulos comuns.
- `Usuarios` deve continuar bloqueado/protegido por padrao.
- `Opcoes do Sistema/Configuracao` deve continuar bloqueado/protegido por padrao.
- O ADM pode ajustar permissões depois.
- Contas antigas nao devem ser alteradas.
- `ativar_controle_usuarios` nao deve ser mexido nesta etapa.
- A tabela PARTICULAR pode ter tratamento de nomenclatura em trilha futura, mas nao entra nesta retomada.

### 5. Checklist de validacao manual da 8W-B

A. Criar uma nova conta/clínica de teste, se aplicavel e seguro.  
B. Criar um usuario novo comum nessa conta/clínica.  
C. Entrar/logar com esse usuario novo.  
D. Confirmar que o usuario novo nao cai em setup inicial indevido.  
E. Confirmar que modulos comuns esperados ficam acessiveis.  
F. Confirmar que `Usuarios` permanece bloqueado/protegido.  
G. Confirmar que `Opcoes do Sistema/Configuracao` permanece bloqueado/protegido.  
H. Entrar como ADM.  
I. Ir ate a aba `Seguranca`.  
J. Confirmar o comportamento do checkbox da aba `Seguranca`:
   - se selecionado, permissões continuam controlaveis pelo ADM;
   - se desmarcado, o sistema libera tudo conforme a regra decidida e vigente.  
K. Confirmar que contas antigas nao foram alteradas.  
L. Confirmar que `ativar_controle_usuarios` nao foi mexido.  
M. Confirmar que a exclusao de usuario comum continua funcionando apos a validacao, se for seguro repetir.

### 6. Cenários de resultado

- **Cenário A - Validação aprovada:** se o usuario testar e confirmar que a 8W-B funciona, a proxima etapa passa a ser auditoria para retomar a escolha de novo modulo de modularizacao.
- **Cenário B - Falha em acesso livre de modulos comuns:** parar a modularizacao e abrir correcao especifica da 8W-B.
- **Cenário C - Falha em bloqueio de Usuarios ou Opcoes do Sistema:** parar a modularizacao e abrir correcao especifica de seguranca/permissoes.
- **Cenário D - Usuario novo cai em setup indevido:** parar a modularizacao e abrir correcao especifica de `setup_completed`.
- **Cenário E - Conta antiga foi alterada indevidamente:** parar a modularizacao e abrir auditoria/correcao de regressao.

### 7. Onde testar no sistema

- Cadastro/criacao de nova conta, se aplicavel.
- `Configuracao de usuarios do sistema`.
- Login com usuario novo.
- Menus comuns do sistema.
- `Usuarios`.
- `Opcoes do Sistema/Configuracao`.
- Aba `Seguranca`.

### 8. Confirmacoes de escopo

- Nenhum codigo alterado.
- `frontend/app.js` nao alterado.
- `frontend/index.html` nao alterado.
- `frontend/js/modules` nao alterado.
- Backend nao alterado.
- Banco/schema/migrations/seeds/endpoints nao alterados.
- Permissoes nao alteradas.
- Seeds nao alteradas.
- Blindagem textual/mojibake respeitada.

### 9. Proxima subetapa recomendada

- Depende do teste manual do usuario.
- Se aprovado, preparar auditoria para retomada da escolha de novo modulo.
- Se reprovado, abrir correcao especifica.

### 10. Registro para roadmap

- Retomada documental da validacao 8W-B apos validacao da exclusao de usuario comum.
- Checklist de validacao manual criado.
- Nenhuma implementacao feita.
- Nenhuma nova modularizacao iniciada.
- Documento criado para orientar o teste manual.
- Blindagem textual/mojibake respeitada.
- Proxima acao depende do teste manual da 8W-B.

