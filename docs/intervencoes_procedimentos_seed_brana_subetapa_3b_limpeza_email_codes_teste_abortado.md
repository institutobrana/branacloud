# Interven??es / Procedimentos / Seeds ? Subetapa 3B ? Limpeza segura dos email_codes do teste abortado

## 1. Objetivo
Limpar somente os registros tempor?rios pendentes em `email_codes` do e-mail `institutobrana@gmail.com`, preparando o ambiente para novo teste manual sem criar conta, sem criar cl?nica e sem tocar em outras tabelas.

## 2. Contexto da falha anterior
Na Subetapa 3A, o teste manual com `institutobrana@gmail.com` falhou em `POST /signup/confirm` por duplicidade de procedimento. A conta n?o foi criada e a cl?nica 13 n?o permaneceu persistida.

## 3. Escopo permitido
- Consultar `email_codes` para `institutobrana@gmail.com`.
- Remover somente registros pendentes `used = false` desse e-mail, se confirmados como res?duo do teste abortado.
- Documentar a limpeza.

## 4. Itens explicitamente fora do escopo
- Criar conta.
- Criar cl?nica.
- Executar signup real.
- Confirmar c?digo.
- Alterar usu?rios, cl?nicas, `procedimento_tabela`, `procedimento`, `access_profile` ou outras tabelas.

## 5. Diagn?stico somente leitura antes da limpeza
- `email_codes` encontrados para `institutobrana@gmail.com`: 3
- IDs encontrados: [22, 23, 24]
- `used` por registro: [False, False, False]
- `created_at` / `expires_at` por registro: [{'id': 22, 'created_at': '2026-05-23 11:16:41.169092-03:00', 'expires_at': '2026-05-23 14:26:41.172608'}, {'id': 23, 'created_at': '2026-05-23 11:17:57.351873-03:00', 'expires_at': '2026-05-23 14:27:57.352473'}, {'id': 24, 'created_at': '2026-05-23 11:19:38.091162-03:00', 'expires_at': '2026-05-23 14:29:38.096257'}]
- Cl?nica com esse e-mail: 0 registro(s)
- Usu?rio com esse e-mail: 0 registro(s)
- `clinicas.id = 13`: 0 registro(s)
- `usuarios` com `clinica_id = 13`: 0 registro(s)
- `procedimento_tabela` com `clinica_id = 13`: 0 registro(s)
- `procedimento` com `clinica_id = 13`: 0 registro(s)
- `prestador_odonto` com `clinica_id = 13`: 0 registro(s)
- `access_profile` com `clinica_id = 13`: 0

## 6. Dry-run da limpeza
- Tabela alvo: `email_codes`
- Filtro exato: `lower(email) = lower('institutobrana@gmail.com') AND used = false`
- Quantidade prevista para remo??o: 3
- IDs previstos para remo??o: [22, 23, 24]
- Confirma??o: nenhuma outra tabela ser? alterada.

## 7. Execu??o controlada realizada
Execu??o realizada com sucesso; foram removidos somente os 3 registros pendentes de `email_codes` do e-mail `institutobrana@gmail.com`.

## 8. Valida??o ap?s a limpeza
- `email_codes` pendentes para `institutobrana@gmail.com` ap?s a limpeza: 0
- Total de `email_codes` para `institutobrana@gmail.com` ap?s a limpeza: 0
- Cl?nica com esse e-mail ap?s a limpeza: 0
- Usu?rio com esse e-mail ap?s a limpeza: 0
- `clinicas.id = 13` ap?s a limpeza: 0
- `usuarios` com `clinica_id = 13` ap?s a limpeza: 0
- `procedimento_tabela` com `clinica_id = 13` ap?s a limpeza: 0
- `procedimento` com `clinica_id = 13` ap?s a limpeza: 0
- `prestador_odonto` com `clinica_id = 13` ap?s a limpeza: 0

## 9. Garantia de que cl?nicas/usu?rios/procedimentos n?o foram alterados
A limpeza foi restrita a `email_codes` e n?o alterou `clinicas`, `usuarios`, `procedimento_tabela`, `procedimento`, `prestador_odonto` ou `access_profile`.

## 10. Situa??o final do e-mail institutobrana@gmail.com
O e-mail `institutobrana@gmail.com` ficou livre para novo teste manual, sem cl?nica/usu?rio persistidos e sem c?digos pendentes de signup.

## 11. Onde testar manualmente antes de prosseguir
O pr?ximo teste deve ser manual pelo usu?rio.
Criar nova conta com `institutobrana@gmail.com` e validar:
- confirma??o de cadastro sem erro 500;
- login com senha de login;
- senha interna n?o entra no login comum;
- senha interna funciona em a??o sens?vel;
- nova cl?nica nasce com 10 perfis padr?o;
- tela Perfis de acesso abre;
- layout mostra Perfis em cima e Prestadores abaixo;
- m?dulo Interven??es / Procedimentos mostra Tabela exemplo;
- m?dulo Interven??es / Procedimentos mostra Brana;
- nova conta n?o mostra PARTICULAR;
- Brana cont?m 336 procedimentos.

## 12. Pr?xima subetapa recomendada
Subetapa 3C ? Registro documental do novo teste manual combinado dos Problemas 1 e 2, ap?s o usu?rio executar o cadastro manual.
