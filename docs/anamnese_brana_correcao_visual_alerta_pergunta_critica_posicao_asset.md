# Anamnese - Correção visual do alerta crítico por pergunta

## Objetivo
Corrigir a apresentação visual do alerta crítico na aba clínica da Anamnese, reposicionando o ícone antes do número da questão e fazendo o sistema renderizar corretamente o asset `assets/easy/ico_dedo.bmp`.

## Contexto
Na etapa anterior, o alerta crítico por pergunta já estava funcionando logicamente, com reação em tempo real e sem alteração de persistência B2. O teste manual do usuário apontou dois problemas visuais:
- o ícone aparecia no canto superior direito do bloco da pergunta;
- o asset exibido era uma figura genérica, e não o bitmap correto do projeto.

## Commit validado
`f2fb1ac7f1d7b86465a1a3ac0426ae1b3ce45afd`

## Documento da implementação validada
`docs/anamnese_brana_implementacao_alerta_visual_pergunta_critica.md`

## Backup criado
`backups_modularizacao/fase_2c/anamnese_alerta_visual_icone_posicao_asset/`

## Arquivo alterado
- `frontend/js/modules/ficha-pessoal-aba-anamnese.js`

## Problemas reportados no teste manual
1. O ícone estava desalinhado, aparecendo no canto superior direito do card.
2. O bitmap correto não estava sendo renderizado; o navegador mostrava uma figura genérica.

## Causa encontrada para a posição errada
A grade do card de pergunta estava organizada com o alerta em coluna própria, mas o markup ainda montava o card na ordem `número -> texto -> alerta`, o que mantinha o ícone separado da posição visual desejada.

## Causa encontrada para o asset genérico
O `src` do ícone estava apontando para `/assets/easy/ico_dedo.bmp`, rota que não era o padrão de distribuição de imagens do projeto. O projeto já expõe assets gráficos via `/desktop-assets/easy/...`, então a imagem não estava sendo servida pelo caminho correto.

## Correção aplicada para posicionar o ícone antes do número
- a grade do card foi ajustada para colocar o alerta na primeira coluna;
- o markup do card foi reordenado para `alerta -> número -> texto`;
- o número da pergunta passou para a segunda coluna;
- o texto da pergunta permaneceu na terceira coluna;
- a lógica crítica em tempo real foi preservada.

## Correção aplicada para renderizar corretamente o `ico_dedo.bmp`
- o `src` foi trocado para `/desktop-assets/easy/ico_dedo.bmp`;
- o mesmo caminho passou a ser usado na renderização inicial e na atualização em tempo real do alerta;
- não houve troca de asset por conveniência.

## Confirmação de preservação da lógica crítica
- `TIPPER = 1` continua sem alerta visual;
- `TIPPER = 2` continua mostrando alerta quando a resposta é `sim`;
- `TIPPER = 3` continua mostrando alerta quando a resposta é `nao`;
- `tipo_resposta = 3` continua sem alerta visual nesta etapa;
- o comportamento em tempo real foi mantido;
- a recarga de respostas salvas e a troca de questionário/paciente continuam atendidas pela lógica já existente.

## Confirmação sobre `mensagem_alerta`
`mensagem_alerta` não foi exibida visualmente nesta etapa.

## Confirmação sobre B2 e persistência
O envelope B2 e a persistência não foram alterados.

## Riscos residuais
- o navegador pode depender da forma de servir BMP no ambiente local;
- a validação visual final ainda deve ser feita no sistema com perguntas críticas configuradas;
- se houver diferenças de roteamento em outro ambiente, o caminho do asset pode exigir revisão.

## Onde testar no sistema
1. Abrir o sistema.
2. Fazer login.
3. Ir em `Configuração -> Anamnese`.
4. Confirmar perguntas com `TIPPER = 1`, `TIPPER = 2` e `TIPPER = 3`.
5. Abrir `Ficha Pessoal`.
6. Selecionar um paciente.
7. Entrar na aba `Anamnese`.
8. Selecionar o questionário correspondente.
9. Confirmar que, quando a regra crítica é satisfeita, o ícone aparece antes do número da pergunta.
10. Confirmar que o ícone exibido é o dedo correto, não uma figura genérica.
11. Confirmar que, quando a resposta deixa de ser crítica, o ícone some.
12. Repetir para `TIPPER = 2` e `TIPPER = 3`.
13. Confirmar que `TIPPER = 1` nunca mostra ícone.
14. Salvar, sair da aba e voltar.
15. Confirmar que o ícone reaparece corretamente após recarregar.
16. Confirmar que o botão `Grava` continua funcionando.
17. Confirmar que não houve regressão visual/global.
