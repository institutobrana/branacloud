# Ficha Pessoal - Historico - Etapa 3 - selecao / linha ativa

## Objetivo
Registrar a introducao da selecao local da linha ativa na aba Historico, preparando a base para as proximas operacoes por linha sem criar persistencia nova.

## Escopo aplicado
- Seleção local de linha adicionada em `frontend/js/modules/ficha-pessoal-aba-historico.js`.
- Destaque visual discreto para a linha ativa.
- Preparacao de helper local para obter a linha atualmente selecionada.
- Nenhuma alteracao em backend, banco ou HTML de carregamento.

## Como a selecao foi estruturada
- A aba Historico passou a manter um estado local simples para a linha selecionada.
- O `tbody` da grade recebeu um listener unico de clique.
- Ao clicar em uma linha, a selecao anterior e limpa e a nova linha recebe destaque.
- A selecao se desfaz quando a grade e limpa.
- Ao inserir uma nova linha provisoria, a linha criada passa a ser selecionada de forma local.

## Como a linha ativa é destacada
- A linha selecionada recebe uma classe visual discreta.
- O destaque usa cor de fundo suave e contorno interno leve.
- O comportamento visual foi mantido estável e simples, sem inventar estados futuros.

## O que foi deixado para etapas futuras
- Persistencia nova.
- Integracao com `Grava`.
- `TAB`, `ENTER` e `ESC`.
- Propriedades da linha funcional.
- Ediçao completa por celula.
- Inserir, Edita e Elimina linha como fluxo real definitivo.

## Confirmacoes
- Nao houve alteracao de banco.
- Nao houve alteracao de backend.
- Nao houve alteracao de endpoints.
- Nao houve alteracao de models, schema, migrations ou seeds.
- A blindagem textual/mojibake foi respeitada.

## Riscos observados
- A selecao ainda e local e depende do DOM da grade atual.
- O comportamento dos botoes continua provisório em termos funcionais.
- As proximas etapas precisam preservar a separacao entre visual e persistencia.

## Como testar no sistema
1. Abrir Ficha Pessoal.
2. Selecionar um paciente.
3. Entrar na aba Historico.
4. Confirmar que a grade abre normalmente.
5. Clicar em diferentes linhas da grade.
6. Confirmar se a linha clicada fica visualmente destacada.
7. Confirmar se ao clicar em outra linha a selecao muda corretamente.
8. Confirmar se os botoes continuam aparecendo sem quebrar a tela.
9. Confirmar que nenhuma outra aba da Ficha Pessoal foi afetada.

## Proxima subetapa recomendada
Proxima etapa sugerida: Inserir linha.
