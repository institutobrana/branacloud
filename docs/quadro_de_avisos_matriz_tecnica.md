# Quadro de avisos - Matriz tecnica

## Objetivo
Registrar, de forma objetiva, o contrato tecnico da tela `Agenda -> Quadro de avisos` com a origem de cada campo, a consulta associada, o comportamento observado ou esperado e as dependencias ja confirmadas.

## Matriz

| Campo | Origem | Tabela/consulta | Comportamento | Dependencia |
|---|---|---|---|---|
| Menu `Agenda -> Quadro de avisos...` | `frontend/index.html` | Handler `agenda-avisos` em `frontend/app.js` | Abre a tela modal sobre o workspace principal | Permissao de agenda e modulo carregado no frontend |
| `Exibir quadro de avisos na abertura` | `backend/routes/preferences_routes.py` + preferencias do usuario | `GET /preferences/general` e `usuario.preferencias_usuario_json["geral"].exibir_quadro_avisos` | Se marcado, abre a tela logo apos o login | Sessao autenticada, preferencia salva por usuario |
| Botao `Afixa` | Barra superior da tela | `backend/routes/quadro-de-avisos.py` -> `POST /agenda-legado/quadro-avisos/avisos` | Abre o modal `Novo aviso` e grava um registro persistido com `afixado_em`, `remover_em`, `destinatario_id`, `remetente_id` e `texto` | Sessao autenticada, usuarios ativos da mesma clinica, tabela `quadro_avisos` |
| Botao `Procura` | Barra superior da tela | `backend/routes/quadro-de-avisos.py` -> `GET /agenda-legado/quadro-avisos/avisos` | Abre o modal `Menu de avisos` com a lista dos avisos do usuario (remetente ou destinatario), permitindo novo, alterar e eliminar | Sessao autenticada, tabela `quadro_avisos`, filtro por clinica e usuario |
| Botao `Imprime` | Barra superior da tela | Impressao da composicao semanal do quadro | Deve gerar impressao do conteudo exibido | Navegador/print CSS e dados carregados |
| Botao `Fecha` | Barra superior da tela | Controle do modal | Fecha a tela e retorna ao workspace principal | Estado do modal somente no frontend |
| `Contas a pagar na semana` | Financeiro | `backend/models/financeiro.py::Lancamento` filtrado por `clinica_id`, tipo de saida e vencimento na semana | Lista despesas da semana e soma total | Financeiro por clinica, parser de datas e formato monetario |
| `Contas a receber na semana` | Financeiro | `backend/models/financeiro.py::Lancamento` filtrado por `clinica_id`, tipo de entrada e vencimento na semana | Lista recebimentos da semana; a descricao exibida vem do historico/descritivo do lancamento e pode refletir o paciente quando preenchido assim | Financeiro por clinica, parser de datas e formato monetario |
| `Aniversariantes da semana` | Cadastro de pacientes | `backend/models/paciente.py::Paciente.data_nascimento` | Lista pacientes com aniversario dentro da janela semanal | Cadastro de pacientes ativo por clinica |
| `Retornos no mes` | Controle de retornos / tratamento / ficha | Nao houve origem persistida confiavel confirmada no codigo atual | Deve mostrar retornos do mes, mas hoje fica como pendencia tecnica | Falta mapear a origem real do legado |

## Pendencias tecnicas confirmadas

- `Retornos no mes` continua sem origem segura no Brana Cloude.
- O backend novo deve permanecer guardado por `clinica_id` e usuario autenticado.

## Observacao de engenharia reversa

No EasyDental, o manual e as evidencias binarias apontam que o quadro mistura aviso fixo, financeiro semanal, aniversarios e retornos. No codigo atual do Brana Cloude, financeiro, pacientes, preferencia de abertura e o fluxo de avisos ficaram mapeados; o bloco `Retornos no mes` segue pendente.
