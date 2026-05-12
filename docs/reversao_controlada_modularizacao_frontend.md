# Reversão Controlada da Modularização do Frontend

## Situação Encontrada
O frontend entrou em estado híbrido depois das modularizações:
- `frontend/app.js` havia recebido muitos overrides e pontes de compatibilidade.
- `frontend/index.html` estava carregando módulos extraídos e patches auxiliares.
- O resultado era quebra generalizada de módulos e regressões no shell compartilhado.

O diagnóstico de Git mostrou que o repositório local não tinha um commit funcional anterior à modularização. O histórico disponível mostrava apenas o commit inicial.

## Fonte Usada para Restauração
Foi usada a base monolítica do legado:
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\frontend\app.js`

Essa foi a fonte funcional mais confiável disponível para restaurar o shell do frontend.

## Backup Realizado Antes de Alterar
Foi criado o backup local:
- `D:\BRANA ARQUIVOS\BRANA CLOUD\_BACKUP_ESTADO_MODULARIZACAO_QUEBRADA_20260511`

Arquivos copiados para o backup:
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/`
- `frontend/prestadores_override.js`
- `frontend/prestadores_agenda_hotfix.js`
- `frontend/prestadores_agenda_apresentacao_patch.js`
- `frontend/prestadores_agenda_refino.js`
- `frontend/prestadores_agenda_fonte_color_patch.js`
- `frontend/prestadores_agenda_utf_fix.js`
- `docs/frontend_auditoria_fase_1_shell_compartilhado.md`
- `docs/frontend_auditoria_pos_fase_1_restauro_abertura_e_globais.md`
- documentos de modularização recentes e auditorias correlatas em `docs/`

## Arquivos Alterados
- `frontend/app.js`
- `frontend/index.html`

## O Que Foi Restaurado
1. `frontend/app.js`
   - Substituído pela versão monolítica do legado.
2. `frontend/index.html`
   - Removidos os `<script>` dos módulos modularizados e dos patches auxiliares.
   - Mantido apenas o carregamento do `app.js` para voltar a depender da base monolítica.

## Arquivos Preservados
- `frontend/js/modules/` foi preservado integralmente.
- Os arquivos de patches e documentos de modularização também foram preservados no backup.
- Nenhum backend, endpoint ou regra de negócio foi alterado nesta etapa.

## Se `frontend/js/modules/` Foi Mantido
Sim. A pasta foi mantida no repositório e também copiada para o backup.
Ela deixou de ser dependência ativa do `index.html`, mas continua disponível como referência para o recomeço posterior.

## Diferença Geral Entre o `app.js` Restaurado e o `app.js` Quebrado
O `app.js` quebrado era um shell híbrido, com:
- dispatcher parcial,
- overrides de compatibilidade,
- módulos extraídos coexistindo com globals antigos,
- dependência de arquivos auxiliares e patches.

O `app.js` restaurado volta a ser uma base monolítica do legado, sem a camada híbrida da modularização recente.

## Riscos Remanescentes
- O `index.html` atual foi simplificado para voltar a depender do `app.js` monolítico; qualquer script auxiliar ainda necessário teria de ser reavaliado depois.
- A pasta `frontend/js/modules/` continua no projeto e pode ser reaproveitada mais tarde, mas não deve ser misturada de volta sem um plano de reintrodução controlado.
- Há risco residual apenas de ajustes de compatibilidade visual ou de carregamento no navegador, que agora precisam ser testados no ambiente real.

## Próximos Testes Manuais
1. Fazer `Ctrl+F5` para limpar cache.
2. Testar login.
3. Testar os menus principais do shell.
4. Abrir `Cadastro > Unidades de atendimento`.
5. Abrir `Agenda > Agenda do dia` e `Agenda > Agenda da semana`.
6. Testar `Medicamentos`, `Materiais`, `Convênios e planos`, `CID`, `Símbolos gráficos`, `Procedimentos` e `Financeiro`.

## Validação
- `node --check frontend/app.js` -> OK

