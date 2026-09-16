# Contrato de exclusao da biblioteca de simbolos graficos

## 1. Objetivo
Documentar o contrato tecnico e o bloqueio definitivo para simbolos nativos da biblioteca, sem ativar exclusao nesta rodada.

## 2. Escopo funcional
- tela: `Configuracoes -> Simbolos graficos -> Novo`
- controle alvo: botao X do quadro `Desenho`
- comportamento esperado para os 56 itens atuais: permanecer desabilitado
- confirmacao: nao existe para simbolos nativos
- cancelamento: nao se aplica porque nao ha acao executavel

## 3. Texto funcional esperado
- estado sem selecao: `Selecione um símbolo excluível`
- estado com simbolo nativo selecionado: `Símbolos da biblioteca do sistema não podem ser excluídos`
- resultado positivo: nao existe para os itens nativos atuais
- resultado negativo: manter selecao e preview intactos

## 4. Fontes de verdade
- biblioteca base do editor React: `frontend-react/public/assets/Icones`
- mapeamento da biblioteca base: `frontend-react/src/features/simbolosGraficos/model/simboloGraficoEditorBaseLibrary.js`
- catalogo persistido: `backend/models/simbolo_grafico.py`
- seed e sincronizacao: `backend/services/simbolos_service.py`
- snapshot legado de simbolos: `backend/scripts/easy_simbolos_catalogo_atual_snapshot.json`

## 5. Modelo de dados envolvido
- tabela principal: `simbolo_grafico_catalogo`
- campos relevantes: `codigo`, `descricao`, `bitmap1`, `bitmap2`, `bitmap3`, `icone`, `imagem_custom`, `ativo`
- identificacao legado: `legacy_id`
- tenant: `clinica_id`

## 6. Requisitos de seguranca e multi-tenant
- qualquer operacao de exclusao deve respeitar `current_user.clinica_id`
- nenhuma exclusao pode depender de `clinica_id` vindo do frontend
- a rota deve exigir autenticacao e autorizacao do modulo correspondente
- a exclusao nao pode vazar para outras clinicas

## 7. Requisitos de storage
- a exclusao nativa nao existe para a biblioteca atual
- a origem do arquivo BMP e versionada/compilada no frontend
- `public` e `dist` nao sao storage editavel
- a operacao deve ter storage persistente proprio para existir no futuro

## 8. Fluxo tecnico minimo
1. selecionar simbolo nativo
2. manter X desabilitado
3. exibir motivo de bloqueio
4. preservar selecao e preview
5. impedir exclusao
6. registrar o bloqueio

## 9. Pendencias antes da implementacao
- definir storage persistente proprio para biblioteca de usuario, se houver futura necessidade
- mapear impacto em seed, cache e catalogo para a futura frente de itens de usuario
- definir endpoint e politica de auditoria apenas para a futura biblioteca excluivel
- definir estrategia de recuperacao para a futura frente

## 10. Status atual
- contrato registrado: sim
- exclusao implementada: nao
- botao X habilitado no React: nao
- endpoint DELETE criado para simbolos nativos: nao

## 11. Bloqueio
- a implementacao continua bloqueada para os itens nativos atuais
- uma futura biblioteca de usuario exige storage e contrato proprios
