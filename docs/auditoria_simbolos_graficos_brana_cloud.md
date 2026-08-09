# Auditoria - Símbolos Gráficos - Brana Cloud

## Escopo
Auditoria da frente de símbolos gráficos no Brana Cloud, cobrindo frontend legado, backend, modelagem, servicos, regras de acesso e o estado final consolidado no frontend React.

## Resumo executivo
- O módulo existe e é funcional no legado.
- O backend expõe o catálogo e as operações de CRUD.
- O frontend React da frente foi concluído, validado em runtime e homologado em testes.
- A tela principal, os modais e o editor gráfico final já estão alinhados ao contrato funcional aprovado.

## Evidências históricas

### Frontend legado
- `frontend/index.html` expõe o menu de símbolos gráficos.
- `frontend/js/modules/simbolos-graficos.js` mantém helpers puros e namespace passivo.
- `frontend/app.js` consome a listagem e executa as operações de CRUD do fluxo legado.

### Backend
- `backend/routes/cadastros_routes.py` expõe:
  - `GET /cadastros/simbolos-graficos`
  - `POST /cadastros/simbolos-graficos`
  - `PUT /cadastros/simbolos-graficos/{simbolo_id}`
  - `DELETE /cadastros/simbolos-graficos/{simbolo_id}`
- `backend/models/simbolo_grafico.py` mantém a tabela `simbolo_grafico_catalogo`.
- `backend/services/simbolos_service.py` mantém o catálogo oficial e os seeds por clínica.

### Contrato de dados
- O backend usa `descricao`, `codigo`, `especialidade`, `tipo_simbolo`, `tipo_marca`, `sobreposicao`, `icone`, `bitmap1`, `bitmap2`, `bitmap3` e `imagem_custom`.
- A listagem filtra por clínica autenticada.
- O `DELETE` é físico.
- Símbolos oficiais possuem restrições próprias de alteração e exclusão.

## Estado final validado no frontend React
- A frente de símbolos gráficos foi concluída no frontend React.
- A listagem usa `Nome` e `Especialidade`.
- A seleção é visual, de linha única, e alimenta `Altera` e `Elimina`.
- O texto redundante `Selecionado: <nome>` foi removido.
- A toolbar final expõe `Novo`, `Altera` e `Elimina`.
- O modal de criação/alteração integra biblioteca, formulário, previews e editor.
- O editor final opera com matrix 24x24, 576 células, paleta de 44 cores e ferramentas `Lápis`, `Borracha`, `Desfazer` e `Limpar`.
- Os previews finais são `Prévia 1x` e `Prévia ampliada`, posicionados dentro da área de edição do desenho.
- Os botões do editor são `Recarregar`, `Salvar como` e `Cancela`.
- `Recarregar` restaura `initialImage` e não persiste nada.
- `Salvar como` exporta a matrix atual para PNG/data URL e chama o modal pai.
- O `Ok` do modal pai é o comando real de persistência.
- `Cancela` encerra o editor sem gravar.
- O fluxo de alteração preserva o desenho e atualiza a tabela após o PUT.
- O fluxo de exclusão trata confirmação, cancelamento e respostas `404`/`409` corretamente.

## Validações realizadas
- Runtime do editor e dos modais concluído.
- Testes frontend aprovados.
- Build frontend aprovado.
- Diferenças textuais com mojibake anterior foram corrigidas nos pontos validados.

## Lacunas
- Nenhuma lacuna funcional aberta para a frente validada.
- As próximas evoluções devem ocorrer em frente separada, se houver.

## Fontes lidas
- `frontend/index.html`
- `frontend/app.js`
- `frontend/js/modules/simbolos-graficos.js`
- `backend/routes/cadastros_routes.py`
- `backend/models/simbolo_grafico.py`
- `backend/services/simbolos_service.py`
- `backend/services/signup_service.py`
- `backend/services/schema_deployment/compatibility.py`
