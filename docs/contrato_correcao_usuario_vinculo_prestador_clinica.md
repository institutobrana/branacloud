# Contrato - Correcao de vinculo de usuario ao prestador Clinica

## 1. Titulo
Contrato - Correcao de vinculo de usuario ao prestador Clinica

## 2. Contexto
- Relato do usuario: o combo do modulo Usuarios permite selecionar o prestador Clinica, mas o backend bloqueia o salvamento com a mensagem de reserva estrutural.
- Auditoria Brana: a regra e sensivel porque envolve cadastro, viculacao operacional, protecao estrutural e fluxo de salvamento.
- Comparacao EasyDental: a analise documental indica classificacao `EASY-A` e `REGRA-A + REGRA-F`.
- Conclusao funcional preliminar: a regra correta e permitir o vinculo operacional usuario -> prestador Clinica, mantendo a protecao estrutural do prestador Clinica.

## 3. Regra funcional definida
### Regra A - protecao estrutural do prestador Clinica
- nao excluir;
- nao transformar em prestador comum;
- nao alterar campos criticos;
- manter protecao sistemica.

### Regra B - associacao operacional de usuario ao prestador Clinica
- permitir que usuario comum/operacional seja vinculado ao prestador Clinica;
- permitir operacao pela agenda/conta da clinica;
- nao tratar esse vinculo como alteracao estrutural do prestador.

## 4. Ponto tecnico atual
- `backend/routes/user_admin_routes.py`
- helper `_load_prestador_from_same_clinic()`
- fluxos `admin_create_user` e `admin_update_user`
- helper `_apply_user_links()`

## 5. Fronteira permitida
A correcao futura pode:
- permitir `is_system_prestador` somente no contexto do vinculo `usuario.prestador_id`;
- manter a validacao de mesma clinica;
- manter a exigencia de prestador ativo se essa regra ja existir;
- manter a protecao estrutural em `Prestadores`;
- manter a protecao contra exclusao/edicao indevida do prestador Clinica;
- preservar o contrato atual de cadastro e edicao do usuario;
- manter o combo e o payload sem alteracao, se nao houver necessidade funcional futura.

## 6. Fronteira proibida
A correcao futura nao deve:
- alterar frontend;
- alterar combo;
- alterar payload;
- alterar banco;
- alterar seeds;
- alterar permissoes;
- alterar exclusao/edicao estrutural do prestador Clinica;
- alterar PostgreSQL;
- alterar textos/labels fora do escopo;
- abrir excecao ampla para outros fluxos estruturais.

## 7. Abordagem escolhida
- `USER-PREST-CONTRATO-B`

### Justificativa
- manter o helper atual de protecao estrutural intacto reduz risco;
- criar um helper separado para o vinculo operacional evita enfraquecer regras de exclusao/edicao do prestador Clinica;
- a separacao deixa claro o contrato entre protecao estrutural e vinculo operacional;
- reduz chance de impacto em fluxos futuros que tambem usem `_load_prestador_from_same_clinic()`.

## 8. Riscos e mitigacao
### Riscos
- liberar `is_system_prestador` de forma ampla demais;
- afetar exclusao/edicao do prestador Clinica;
- permitir prestador de outra clinica;
- afetar signup/seeds;
- alterar fluxo de criacao/edicao de usuario comum;
- mudar mensagens de erro de forma colateral.

### Mitigacao
- manter helper estrutural atual;
- criar helper separado apenas para o vinculo operacional;
- continuar filtrando por mesma clinica;
- manter protecao de outros fluxos em Prestadores;
- validar manualmente cria/edita usuario comum com prestador Clinica;
- validar que vinculo com outra clinica continua bloqueado.

## 9. Plano de implementacao futura
1. Criar helper especifico para vinculo operacional de usuario ao prestador Clinica.
2. Fazer admin_create_user e admin_update_user usarem o helper novo apenas para este caso.
3. Preservar o helper estrutural atual para usos que exigem protecao total.
4. Garantir mesma clinica e prestador ativo.
5. Evitar qualquer impacto em frontend, payload e banco fora do vinculo usuario.prestador_id.

## 10. Plano de testes futuros
- `python -m py_compile backend/routes/user_admin_routes.py`
- validacao de leitura dos endpoints envolvidos
- teste manual futuro no sistema:
  1. criar ou editar usuario comum;
  2. escolher prestador Clinica;
  3. salvar;
  4. confirmar sucesso;
  5. confirmar que o prestador Clinica continua protegido estruturalmente;
  6. confirmar que o usuario fica vinculado ao prestador Clinica;
  7. confirmar que prestador de outra clinica continua bloqueado;
  8. confirmar que IDs 13/17/18 continuam normais.

## 11. Confirmacoes de escopo
- nenhum codigo alterado;
- nenhum dado de banco alterado;
- `frontend/app.js` nao alterado;
- `frontend/index.html` nao alterado;
- `frontend/js/modules` nao alterado;
- backend nao alterado nesta etapa;
- `.env` nao alterado;
- banco/schema/migrations/seeds/endpoints nao alterados;
- PostgreSQL 18 nao excluido/desativado;
- backups preservados;
- blindagem textual/mojibake respeitada.

## 12. Registro para roadmap
- Contrato tecnico da correcao pequena do vinculo usuario -> prestador Clinica registrado como `USER-PREST-CONTRATO-B`.
- Proxima etapa recomendada: comparar EasyDental virgem antes de implementar, mantendo a protecao estrutural do prestador e a regra de vinculo operacional separadas.
