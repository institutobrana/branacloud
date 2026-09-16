# Rollback D.R1 - Retorno ao marco estavel da Microetapa C

Data: 2026-08-03

## Resultado
- APROVADO.

## Motivo
- O usuario nao homologou o contrato visual final dos 143 itens.
- A integracao de POST da Microetapa D nao ficou como contrato seguro para o fluxo Novo.
- A frente voltou ao marco C, com mapper puro e sem API ativa no modal.

## Grade
- scope anterior: `biblioteca`
- scope restaurado: `catalogo`
- total runtime: contrato anterior visualmente conhecido
- GETs: sem reload de pos-POST
- tenant: preservado

## Modal
- Nome: funcional
- Especialidade: estavel
- Forma: estavel
- Biblioteca: 56 BMPs base
- selecao: funcional
- preview: funcional
- Ok: habilita apenas com formulario valido
- Excluir: desabilitado
- Editar: desabilitado
- Cancela: limpa e fecha

## Integracao removida
- POST: removido do fluxo ativo do modal
- submitting: removido
- erro: removido
- sucesso: removido
- fechamento: nao ocorre por sucesso
- reload: removido

## Mapper preservado
- arquivo: `frontend-react/src/features/simbolosGraficos/model/simboloGraficoCreateMapper.js`
- payload: mantido em memoria apenas
- clique local: chama somente o mapper
- API: nao acionada pelo modal

## Runtime
- grade: volta ao conjunto historicamente conhecido do marco C
- modal: estavel
- clique Ok: local apenas
- Network: sem POST do fluxo Novo
- Console: sem erros novos introduzidos por este rollback

## Testes
- atualizados para o marco C
- aprovados: pendente de execucao
- falhas: n/a

## Build
- resultado: pendente de execucao
- warnings: n/a
- erros: n/a

## Documentacao
- criada: `docs/rollback_microetapa_d_para_marco_c_simbolos_graficos.md`
- atualizada: `docs/fechamento_fluxo_novo_simbolo_grafico_basico.md`, `docs/homologacao_runtime_post_basico_simbolo_grafico.md`
- status do fluxo Novo: `NAO CONGELADO - RETORNADO AO MARCO C`

## Git
- HEAD inicial: `0abb0f94ae94a5e60026f253d5e82187183aa22c`
- HEAD final: `0abb0f94ae94a5e60026f253d5e82187183aa22c`
- Branch: `modularizacao-segura-fase-1`
- Stage inicial: sem stage desta rodada
- Stage final: sem stage desta rodada
- Commit: nao realizado
- Push: nao realizado

## Proxima etapa
- Somente depois da homologacao visual do rollback: iniciar a FASE G.0 do contrato funcional definitivo da grade.

## Atualizacao de continuidade - FASE G.0E
- A fase seguinte foi tratada como engenharia reversa funcional do EasyDental Desktop.
- Nao houve mudanca de codigo na Brana Cloud para esta leitura.
- O foco agora e documentar o contrato de `Novo` e `Altera` com simbolo que pode nascer sem desenho e receber arte depois.
- A retomada operacional do `POST` continua bloqueada ate contrato explicito.
