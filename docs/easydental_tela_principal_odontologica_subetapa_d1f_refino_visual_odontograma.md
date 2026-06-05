# Subetapa D1-F - refino visual odontologico da tela principal odontologica isolada

## 1. Objetivo da subetapa

Esta subetapa refinou a tela principal odontologica isolada para que ela passe a ler visualmente como um odontograma moderno, e nao como um painel tecnico generico.

O foco foi colocar as arcadas no centro da experiencia visual, mantendo a entrada isolada, o fallback legado e a trilha antiga sem alteracoes de risco.

## 2. Arquivos criados

- `frontend/js/modules/tela-principal-odontologica-odontograma.js`
- `docs/easydental_tela_principal_odontologica_subetapa_d1f_refino_visual_odontograma.md`

## 3. Arquivos alterados

- `frontend/js/modules/tela-principal-odontologica-estado.js`
- `frontend/js/modules/tela-principal-odontologica-layout.js`
- `frontend/js/modules/odontograma-v1.js`
- `docs/11_roadmap_desenvolvimento.md`

## 4. Confirmacoes

- o botao `Odontograma` nao foi desligado e continua usando a entrada isolada com fallback legado;
- a Ficha Pessoal nao foi alterada;
- a aba Historico nao foi alterada;
- `frontend/app.js` nao foi alterado;
- `frontend/index.html` nao foi alterado;
- backend nao foi alterado;
- banco, schema, migrations, seeds e endpoints nao foram alterados;
- nenhum asset foi alterado;
- nenhum arquivo do EasyDental foi alterado;
- nenhum arquivo do EasyDental foi copiado para o Brana Cloud;
- a implementacao antiga do odontograma nao foi removida;
- a blindagem textual/mojibake foi respeitada.

## 5. O que mudou no visual

- a area central passou a ser um odontograma propriamente dito, com arcadas superior e inferior;
- cada dente ganhou leitura visual propria, com numero, estado e observacao;
- o miolo da tela passou a usar um renderer dedicado de arcadas;
- a legenda de estados foi colocada junto do odontograma;
- o layout passou a dar mais peso visual ao odontograma e menos peso aos blocos auxiliares;
- procedimentos, atalhos, abas, agenda e historico ficaram como suporte ao redor da arcada.

## 6. Estado mockado ampliado

- arcada superior e arcada inferior passaram a existir como estruturas proprias;
- o estado agora oferece legenda de statuses odontologicos;
- o mock com paciente simulado continua separado do estado neutro sem paciente;
- o fallback de leitura continua possivel quando nao ha contexto real.

## 7. Modo de validacao

- abrir o Brana Cloud;
- entrar em `Ficha Pessoal > Historico`;
- clicar em `Odontograma`;
- conferir se a nova leitura visual apresenta arcadas superiores e inferiores;
- conferir se o fallback legado continua disponivel quando a entrada nova falhar.

## 8. Riscos remanescentes

- o renderer pode precisar de pequeno ajuste fino em responsividade em telas mais estreitas;
- o fallback legado continua necessario enquanto a entrada isolada nao for considerada fechada;
- a linha de historico continua sendo mockada nesta etapa.

## 9. Proxima etapa recomendada

Recomendo validar no navegador real com recarga limpa e, se necessario, fazer apenas ajuste fino visual no renderer de arcadas, sem tocar em backend, banco, `app.js` ou na implementacao antiga.
