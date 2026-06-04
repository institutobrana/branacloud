# Odontograma V1 - Bootstrap Frontend de Leitura

## 1. Objetivo

Documentar a primeira camada frontend do odontograma V1, limitada a bootstrap, consumo de API, estado local e renderizacao basica em leitura.

## 2. Escopo

- Novo painel frontend do odontograma V1.
- Leitura de paciente, tratamentos, status e resumo do odontograma.
- Renderizacao basica de arcada, intervencoes e legenda de status.
- Sem escrita.
- Sem alteracao de `app.js`.

## 3. Confirmacao de etapa

Etapa somente de leitura e renderizacao frontend.
Nao foram criadas rotas novas, migrations novas, telas novas de escrita ou qualquer fluxo de alteracao de dados.

## 4. Ambiente usado

- Projeto: Brana Cloud
- Diretório: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Backend local: `http://127.0.0.1:8000`
- Usuario de teste: `user_id = 1`
- JWT: token local assinado com `JWT_SECRET_KEY` do ambiente
- DOM de teste: `jsdom` em ambiente Node local temporario

## 5. Arquivos de frontend ajustados

- `frontend/js/modules/odontograma-v1.js`
- `frontend/index.html`

## 6. Comandos usados para validar

- `node --check frontend/js/modules/odontograma-v1.js`
- DOM simulado em Node com `jsdom`
- `GET /cadastros/pacientes/1`
- `GET /tratamentos/paciente/1`
- `GET /odontograma/status`
- `GET /odontograma/resumo?clinica_id=1&paciente_id=1&tratamento_id=1`

## 7. Resultado por etapa

- O painel `odontograma-panel` foi criado e aberto com sucesso.
- O clique no botao `ficha-btn-odontograma` foi interceptado pelo modulo novo.
- A leitura de paciente carregou com sucesso.
- O backend nao retornou tratamentos cadastrados para o paciente de teste.
- O painel usou leitura de referencia vazia com `tratamento_id = 1`.
- `status_lookup` retornou 3 itens.
- `resumo.contagem_intervencoes` retornou `0`.
- A arcada nao trouxe slots neste recorte.
- As intervencoes nao trouxeram itens neste recorte.

## 8. Estrutura dos JSONs retornados

- `GET /odontograma/status`
  - `itens: []` com 3 registros de status
- `GET /tratamentos/paciente/:id`
  - `paciente_id`
  - `total`
  - `selecionado_id`
  - `tratamentos`
- `GET /odontograma/resumo`
  - `resumo.paciente_id`
  - `resumo.tratamento_id`
  - `resumo.contagem_intervencoes`
  - `resumo.arcada_slots`
  - `resumo.status_lookup`
  - `resumo.intervencoes`

## 9. Confirmacao de ausencia de escrita

- Nenhum `INSERT` foi executado por esta subetapa.
- Nenhum `UPDATE` foi executado por esta subetapa.
- Nenhum `DELETE` foi executado por esta subetapa.
- Nenhuma migracao foi criada.
- Nenhum dado foi alterado.

## 10. Confirmacao de nao impacto em `app.js`

- `frontend/app.js` nao foi alterado.
- A integracao foi feita por modulo novo e por inclusao controlada de script em `frontend/index.html`.

## 11. Problemas encontrados

- O banco local nao possui tratamentos cadastrados para os pacientes consultados neste recorte.
- Para manter a validacao do fluxo visual, o modulo usa uma referencia vazia com `tratamento_id = 1`.
- O rótulo do paciente pode refletir o nome completo vindo do backend, que neste ambiente aparece com duplicacao cosmetica de sobrenome.

## 12. Onde conferir antes da proxima subetapa

- Abrir o painel do odontograma pela ficha de paciente.
- Confirmar que o painel abre em leitura.
- Confirmar que a legenda de status mostra 3 itens.
- Confirmar que o resumo mostra leitura vazia quando nao ha tratamentos cadastrados.
- Confirmar que `frontend/app.js` continua intacto.

## 13. Registro para roadmap

- Bootstrap frontend do odontograma V1 documentado.
- Leitura basica do painel validada com backend real e fallback de referencia vazia.
- Proxima subetapa recomendada: acabamento visual minimo ou seletor de tratamento quando houver dados reais.
