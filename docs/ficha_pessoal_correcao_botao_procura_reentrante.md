# Ficha Pessoal - Correcao do botao Procura reentrante

## Contexto
- A Ficha Pessoal vem sendo corrigida em subetapas pequenas para evitar regressao global.
- A aba `Anamnese` ja havia passado por limpeza visual recente e permaneceu fora desta rodada.
- O problema desta etapa e especifico do botao `Procura...` da Ficha Pessoal.

## Sintoma informado pelo usuario
- O botao `Procura...` funciona apenas uma vez.
- Depois que um paciente e selecionado, clicar de novo em `Procura...` nao reabre a pesquisa.
- Para voltar a funcionar, o usuario precisa fechar a Ficha Pessoal e abrir novamente.

## Estado esperado
- O botao `Procura...` deve funcionar toda vez que for clicado.
- Ele deve abrir a tela de pesquisa de pacientes repetidamente.
- O usuario deve conseguir trocar de paciente sem fechar a Ficha Pessoal.

## Arquivos investigados
- `frontend/app.js`
- `docs/ficha_pessoal_anamnese_limpeza_botao_quadros.md`
- `docs/ficha_pessoal_anamnese_correcao_tela_base_questionarios.md`
- `docs/ficha_pessoal_anotacoes_validacao_correcao_regressao_global.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/11_roadmap_desenvolvimento.md`

## Causa encontrada para o botao Procura funcionar apenas uma vez
- O handler do botao `Procura...` chamava primeiro `fichaAbrirPorCodigo(...)` quando o campo de codigo estava numerico.
- Depois de selecionar um paciente, o campo de codigo continuava numerico.
- Quando o codigo ja era o mesmo do paciente atual, `fichaAbrirPorCodigo(...)` retornava sem abrir nova pesquisa por causa do atalho interno `fichaCodigoUltimoResolvido`.
- Com isso, o fluxo de procura deixava de abrir o menu de pacientes e parecia travado.

## Correccao aplicada
- O botao `Procura...` passou a abrir sempre a tela de pesquisa de pacientes.
- A procura reusa `fichaMenuPacAbrir(...)` com o preenchimento atual do codigo apenas como filtro inicial.
- O atalho de abrir paciente por codigo ficou preservado para os fluxos de teclado/blur ja existentes.
- Nenhum backend, banco, payload, `requestJson` ou formato de salvamento foi alterado.

## Backup criado
- `backups_modularizacao/fase_2c/ficha_pessoal_correcao_botao_procura_reentrante/frontend/app.js`

## Confirmacoes de escopo
- `frontend/app.js` alterado somente no trecho necessario do botao Procura/Ficha Pessoal.
- `frontend/index.html` nao alterado.
- `frontend/js/modules` nao alterado.
- backend nao alterado.
- banco nao alterado.
- schema/migrations/seeds/endpoints nao alterados.
- `.env` nao alterado.
- `requestJson` nao alterado.
- payload nao alterado.
- formato de salvamento nao alterado.
- exclusao nao alterada.
- permissões nao alteradas.
- `Anamnese` nao alterada.
- combo `Questionario` nao alterada.
- `Anotacoes` nao alterada.
- `Historico` nao alterado.

## Como testar manualmente
1. Abrir o sistema.
2. Fazer login.
3. Confirmar que menus principais respondem.
4. Abrir `Ficha Pessoal`.
5. Clicar em `Procura...`.
6. Confirmar que a tela de pesquisa de pacientes abriu.
7. Selecionar um paciente.
8. Confirmar que a Ficha Pessoal carregou o paciente.
9. Clicar novamente em `Procura...` sem fechar a Ficha Pessoal.
10. Confirmar que a tela de pesquisa abriu novamente.
11. Selecionar outro paciente.
12. Confirmar que a Ficha Pessoal mudou para o segundo paciente.
13. Repetir `Procura...` mais uma vez, se possivel.
14. Confirmar que o botao continua funcionando.
15. Entrar em `Dados pessoais`.
16. Entrar em `Dados complementares`.
17. Entrar em `Anotacoes`.
18. Entrar em `Anamnese`.
19. Entrar em `Historico`.
20. Testar botao `Sair`.
21. Entrar novamente e confirmar que menus continuam funcionando.

## Riscos remanescentes
- O fluxo de pesquisa continua dependente da tela de menu de pacientes existente.
- A correccao evita o travamento do botao, mas nao altera a estrutura do menu de pacientes.
- Se houver nova regressao, o retorno pode ser feito pelo backup controlado criado nesta rodada.

## Plano de retorno manual usando backup
- Restaurar `frontend/app.js` a partir de `backups_modularizacao/fase_2c/ficha_pessoal_correcao_botao_procura_reentrante/frontend/app.js` se necessario.
- Revalidar o fluxo de login, abertura da Ficha Pessoal e repeticao do botao `Procura...`.

## Registro para roadmap
- Esta rodada registra a correcao do botao `Procura...` da Ficha Pessoal para funcionamento reentrante.
- O ajuste permite abrir a pesquisa de pacientes mais de uma vez sem fechar a Ficha Pessoal.
- A correcao foi feita sem alterar backend, banco, payload, `requestJson`, permissoes ou abas clinicas.
