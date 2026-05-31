# Ficha pessoal - Implementacao da confirmacao local da Anamnese sem salvamento

## Contexto

A aba `Anamnese` da `Ficha pessoal` passou a contar com uma camada local de confirmacao de alteracoes para impedir saidas acidentais quando ha edicoes visuais pendentes.

O fluxo foi desenhado para manter o comportamento atual sem tocar em backend, banco, payload, `requestJson` ou formato de salvamento. A implementacao segue apenas com estado local e modal interno.

## Commit base da etapa

`34aa3228df79540d9719d73d44b3d70f47740b0e`

## Correcoes/ajustes aplicados

- adicionada detecao de estado alterado na aba `Anamnese`;
- criado confirm local com os botoes `Sim`, `Nao` e `Cancelar`;
- a mensagem exibida segue o contrato:
  - `Os dados foram alterados. Deseja gravá-los?`
- `Sim` nao grava nada nesta etapa e apenas informa que o salvamento ainda nao foi implementado;
- `Nao` descarta as alteracoes locais e permite prosseguir com a acao pendente;
- `Cancelar` mantem o usuario na aba `Anamnese`;
- a confirmacao passa a ser aplicada ao tentar sair da aba, trocar de paciente, usar `Procura...`, acionar `Novo`, `Fechar`, `Sair`, navegar entre pacientes ou trocar o questionario enquanto houver alteracoes pendentes;
- a modularizacao continua isolada no frontend, sem integrar a logica ao boot global.

## Confirmacoes de nao alteracao

- nenhum backend alterado;
- nenhum banco alterado;
- nenhum schema/migration/seed alterado;
- nenhum endpoint alterado;
- nenhum `.env` alterado;
- nenhum `requestJson` alterado;
- nenhum payload alterado;
- nenhum formato de salvamento alterado;
- nenhuma exclusao alterada;
- nenhuma permissao alterada.

## Arquivos tocados na entrega

- `frontend/js/modules/ficha-pessoal-aba-anamnese.js`
- `frontend/app.js`

## Backup controlado

O backup manual da etapa foi criado em:

- `backups_modularizacao/fase_2c/ficha_pessoal_anamnese_confirmacao_alteracoes_sem_salvamento/`

## Proxima recomendacao

A proxima subetapa, se autorizada, deve decidir se a Anamnese continua apenas com persistencia textual ou se tera persistencia estruturada por pergunta. Essa decisao deve ser tratada em contrato separado antes de qualquer novo ajuste de salvamento.
