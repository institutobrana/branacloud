# Contrato de exclusao - Unidades de atendimento

## 1. Objetivo

Definir o contrato seguro para a futura implementacao da exclusao de `unidade_atendimento`, preservando isolamento por clinica, unidade principal, ultima unidade e referencias dependentes.

## 2. Situacao atual

- o backend agora executa exclusao com protecoes centrais;
- o frontend React passou a refletir o estado da selecao para habilitar `Elimina` apenas quando ha item selecionado;
- a protecao consolidada cobre unidade principal, ultima unidade e dependencias operacionais.

## 3. Regra mestra

**Nao excluir se houver qualquer risco de perda operacional ou historica.**

## 4. Identificador seguro da unidade principal

Usar a combinacao:

- `clinica_id`
- `source_id == 1`

Pistas auxiliares:

- `codigo == "0001"`
- `nome == "Principal"`

Mas esses dois ultimos nao devem ser usados sozinhos porque sao campos editaveis/historicamente normalizados.

## 5. Regras de protecao

| Situacao | Regra |
| -------- | ----- |
| Registro inexistente | retornar `404` |
| Unidade de outra clinica | retornar `404` ou `403`, seguindo o padrao do backend; preferencia por `404` para nao expor existencia |
| Unidade principal (`source_id=1`) | bloquear com `409` |
| Ultima unidade da clinica | bloquear com `409` |
| Usuarios vinculados | bloquear com `409` |
| Agenda futura ou historica | bloquear com `409` |
| Bloqueios de agenda | bloquear com `409` |
| Tratamentos ou outras referencias historicas | bloquear com `409` |
| Unidade inativa | aplicar as mesmas protecoes |
| Sem vinculos e nao principal | permitir a exclusao protegida |

## 6. Contrato implementado do backend

### Endpoint

`DELETE /cadastros/unidades-atendimento/{row_id}`

### Ordem de validacao

1. autenticar usuario;
2. validar permissao `configuracao`;
3. localizar por `id + clinica_id`;
4. se nao existir, retornar `404`;
5. se for `source_id == 1`, retornar `409`;
6. contar unidades da clinica; se for a ultima, retornar `409`;
7. verificar usuarios vinculados;
8. verificar agenda futura e agenda historica relevante;
9. verificar bloqueios;
10. verificar tratamentos e outras dependencias de uso real;
11. somente entao executar `db.delete` dentro de transacao;
12. confirmar `commit`;
13. em qualquer falha, fazer `rollback`.

### Estado validado

- `DELETE /cadastros/unidades-atendimento/{row_id}` passa por isolamento por `clinica_id`.
- `source_id == 1` bloqueia a unidade principal.
- a ultima unidade da clinica e bloqueada.
- usuarios, agenda, bloqueios e tratamentos impedem a exclusao.
- sucesso retorna `{"detail": "Unidade excluida."}`.

### Códigos HTTP recomendados

- `404` - unidade nao encontrada ou de outra clinica
- `409` - unidade principal protegida
- `409` - a clinica precisa manter pelo menos uma unidade
- `409` - unidade possui dependencias
- `200` ou `204` - exclusao realizada

### Mensagens recomendadas

- `Unidade nao encontrada.`
- `Unidade principal protegida.`
- `A clinica deve manter pelo menos uma unidade.`
- `A unidade possui usuarios vinculados.`
- `A unidade possui agenda ou bloqueios vinculados.`
- `A unidade possui dependencias em outros modulos.`
- `Unidade excluida com sucesso.` ou resposta vazia para `204`

## 7. Contrato implementado do frontend

- `Elimina` fica habilitado somente quando ha selecao valida, sem carregamento e sem exclusao em andamento;
- a confirmacao de exclusao abre em modal modular;
- o frontend nao decide sozinho se pode excluir: o backend continua sendo a autoridade final;
- se houver erro `409`, mostrar a mensagem do backend;
- se houver `404`, informar que o registro nao existe mais ou pertence a outra clinica;
- manter selecao coerente apos erro ou sucesso;
- nao fazer remocao otimista.

## 8. Diferenca entre inativar e excluir

- `inativar` deve permanecer como mecanismo seguro para ocultar unidade do uso corrente;
- `excluir` deve ser reservado para casos sem dependencia e apenas com bloqueio seguro;
- para a operacao corrente, a recomendacao e manter exclusao fisica apenas como ultima opcao, nunca como fluxo padrao.

## 9. Registros de teste locais

Os registros identificados na auditoria corretiva anterior seguem como dados locais e nao foram removidos nesta etapa:

- `id=11`, `codigo=0002`, `nome=Unidade Codex Teste`
- `id=12`, `codigo=0003`, `nome=Unidade Codex Teste Ajustada`
- `id=13`, `codigo=0004`, `nome=Unidade Codex Teste Criacao`

Contrato futuro de limpeza:

- remover apenas apos a exclusao protegida existir;
- executar somente se nao houver dependencias;
- registrar ids, comando e resultado;
- nunca usar a limpeza para validar o fluxo de exclusao do React antes do contrato backend estar fechado.

## 10. Testes futuros

### Backend

- unidade inexistente;
- outra clinica;
- principal protegida;
- ultima unidade;
- usuarios vinculados;
- agenda futura;
- agenda historica;
- bloqueios;
- tratamentos;
- unidade sem vinculos;
- rollback em erro.

### Frontend

- botao desabilitado sem selecao;
- confirmacao visivel quando liberar;
- cancelamento;
- sucesso;
- bloqueio por `409`;
- `404` de registro removido em outra aba;
- selecao mantida ou limpa conforme contrato;
- nenhuma exclusao otimista.

## 11. Critérios de aceite

1. Nenhuma unidade principal pode ser removida.
2. Nenhuma clinica pode ficar sem unidades.
3. Nenhuma dependencia operacional pode ser ignorada.
4. O frontend nao chama `DELETE` ate o backend ter protecao.
5. As mensagens do backend sao preservadas no React.
6. A auditoria e rastreavel por documento e teste.

## 12. Pendencias que exigem decisao

- manter exclusao fisica protegida ou migrar para exclusao logica;
- decidir se unidades sem dependencia poderao ser removidas no futuro;
- decidir se agenda historica deve bloquear para sempre ou apenas agenda ativa/futura.
