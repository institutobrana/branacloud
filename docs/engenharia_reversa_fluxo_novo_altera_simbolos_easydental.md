# Engenharia reversa funcional - Fluxo Novo e Altera - Simbolos graficos - EasyDental Desktop

Data: 2026-08-03

## Escopo
Esta nota registra o comportamento funcional observado e validado no fluxo `Configuracoes -> Simbolos graficos -> Novo` e no retorno em `Altera` no EasyDental Desktop.

## Premissas desta fase
- Nao ha alteracao de codigo na Brana Cloud nesta rodada.
- Nao ha reativacao de `POST`.
- Nao ha mudanca de schema, migration, cleanup ou mapper.
- O objetivo e registrar o contrato funcional do desktop para orientar a proxima reativacao controlada.

## Evidencia direta confirmada em cliente C:
- A tabela inicial exibiu 81 simbolos.
- O modal `Novo` foi aberto no cliente `C:\EDS70\EDS70.exe`.
- O campo `Nome` recebeu o texto `TESTE EASYDENTAL SIMBOLO EM BR`.
- Nenhum simbolo da biblioteca foi selecionado.
- O preview permaneceu vazio.
- O botao `Ok` habilitou mesmo sem desenho.
- Ao confirmar, apareceu a mensagem informativa sobre associar o novo simbolo a uma intervencao no modulo `Configura - Tabelas de precos`.
- Depois da confirmacao, o modal fechou.
- A tabela passou de 81 para 82 simbolos.
- A nova linha apareceu em ordem alfabetica.
- A especialidade exibida foi `Dentística`.
- O simbolo entrou sem desenho final.

## Evidencia direta no fluxo `Altera`
- Ao selecionar a nova linha e clicar `Altera`, o nome foi carregado.
- O tipo carregado foi `Definido pelo usuário`.
- A especialidade carregada foi `Dentística`.
- A forma carregada foi `Dente`.
- O preview permaneceu vazio.
- O botao `Editar` ficou disponivel.
- Ao clicar `Editar`, o editor externo abriu o Microsoft Paint.
- O titulo do Paint foi `Imagem de Bitmap in EasyDental 6.0 - Paint`.
- O canvas observado era de `15 x 15` pixels.
- O EasyDental passou a exibir um pequeno quadro branco no preview.

## O que a interface mostra no estado inicial
- A janela de edicao de simbolo grafico abre com titulo de edicao.
- O formulario possui campos de nome, especialidade, forma de marcacao e tipo do simbolo.
- Existe uma biblioteca visual de simbolos.
- Existe uma area de desenho/preview.
- O estado inicial observado para um item sem desenho e a ausencia de imagem aplicada no quadro de desenho.

## Contrato funcional do `Novo`
### Sequencia observada
1. O usuario entra no fluxo de novo simbolo.
2. A tela abre com os campos principais vazios ou aguardando selecao.
3. O usuario digita o nome.
4. A biblioteca pode permanecer sem selecao.
5. A persistencia nao e concluida no momento da simples abertura do modal.
6. O registro passa a existir como entidade funcional quando o fluxo de confirmacao conclui a gravacao.

### O que importa no contrato
- O nome do simbolo e parte obrigatoria do cadastro.
- A especialidade participa da identidade do item.
- A forma de marcacao no odontograma continua sendo parte do contrato visual e funcional.
- O tipo do simbolo separa simbolo de sistema e simbolo definido pelo usuario.
- O desenho nao e um adorno: ele compoe o cadastro, mas pode iniciar em branco.

## Contrato do estado sem imagem
- O registro pode nascer sem desenho aplicado.
- A grade nao depende de haver imagem pronta no instante inicial.
- O item sem desenho continua sendo um simbolo valido para a lista e para edicao posterior.
- O campo visual de desenho fica como area vazia ate o usuario aplicar ou editar a arte.

## Persistencia do `Novo`
### O que foi confirmado
- O desktop separa a entrada do usuario e a confirmacao de gravacao.
- A persistencia efetiva ocorre na confirmacao final do fluxo, nao na simples selecao de biblioteca.
- O mesmo item pode ser criado primeiro com representacao minima e depois receber refinamento visual.

### O que nao foi confirmado integralmente
- Qual query exata o Delphi usava.
- Se havia escrita separada de metadados e desenho em momentos distintos.
- Se a confirmacao do desenho gravava bitmap, texto de imagem ou ambos.

## Contrato do `Altera`
### Caso de item sem desenho
- Ao entrar em `Altera` para um item sem desenho, o formulario abriu preservando os campos ja conhecidos.
- O estado visual continuou compativel com um desenho em branco.
- A edicao posterior permitiu completar a imagem sem destruir o cadastro base.

### Caso de item com desenho posterior
- Quando o simbolo recebe desenho depois, a alteracao atualiza a representacao visual do mesmo registro.
- O contrato funcional indica persistencia incremental da arte sem trocar a identidade do simbolo.

## Diferenca entre `Sistema` e `Definido pelo usuario`
- `Sistema` representa item oficial do catalogo.
- `Definido pelo usuario` representa item editavel e controlado pelo usuario.
- A distinção interfere na forma como a biblioteca e a edicao sao apresentadas.
- O contrato observado sugere que o simbolo de sistema segue prioridade e origem diferentes do simbolo customizado.

## O que o Brana Cloud deve registrar quando a futura reativacao ocorrer
- Registro novo pode nascer sem desenho.
- Registro alterado pode permanecer sem desenho ate edicao posterior.
- O campo de desenho deve aceitar preenchimento tardio.
- A lista deve refletir um item novo mesmo quando a imagem ainda nao existe.
- A representacao de sistema e usuario precisa continuar separada.

## O que precisaria estar pronto antes de reativar `POST`
- Contrato de payload para simbolo sem desenho.
- Contrato de payload para simbolo com desenho tardio.
- Contrato de edicao de item ja persistido sem imagem.
- Contrato visual da grade depois da gravacao.
- Contrato da biblioteca para simbolos de sistema e de usuario.

## Fatos observados para a implementacao futura
- O `Ok` habilitou sem dependencia de selecao previa da biblioteca.
- O aviso informativo apos salvar faz parte do contrato funcional.
- A linha nova apareceu imediatamente na grade apos o fechamento do modal.
- O `Altera` sobre item sem arte abriu o editor externo.
- O editor visual legado abriu o Microsoft Paint.
- O canvas observado no Paint foi de `15 x 15` pixels.
- O EasyDental passou a exibir um pequeno quadro branco no preview.

## Lacunas restantes
- Nao foi validado o detalhe estrutural do armazenamento interno do EasyDental.
- Nao foi confirmado se a persistencia da arte ocorria em campo unico ou em dupla representacao.
- Nao foi confirmado o ponto exato em que a tela passa de branco para preenchida ao salvar.

## Conclusao
O fluxo do EasyDental Desktop mostra que `Novo` e `Altera` aceitam a existencia de um simbolo cuja arte ainda nao esta pronta, com preenchimento posterior possivel. Isso sustenta o contrato de que o Brana Cloud pode representar o cadastro minimo primeiro e a imagem depois, desde que a reativacao do `POST` seja feita com contrato explicito e sem assumir persistencia imediata de desenho.
