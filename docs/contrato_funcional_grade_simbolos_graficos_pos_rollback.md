# Contrato funcional da grade de simbolos graficos pos rollback

Data: 2026-08-03

## Contexto
- A grade voltou ao marco C depois da reversao da Microetapa D.
- O contrato corrente permanece sem `POST` ativo no modal.
- A fase G.0E adiciona a leitura funcional do comportamento do EasyDental Desktop, sem alterar o runtime da Brana Cloud.

## Estado validado
- `scope=catalogo` continua como referencia da grade.
- A grade nao depende de POST para abrir ou listar o catalogo.
- O modal continua com validacao local.
- O desenho pode nao existir no momento da criacao do simbolo.

## O que a fase G.0E acrescenta
- O EasyDental admite simbolo sem desenho inicial.
- O fluxo `Altera` pode retomar um registro que nasceu em branco.
- A persistencia de desenho pode ocorrer depois da criacao base.
- Sistema e usuario continuam sendo contratos diferentes.

## Implicacao para a grade
- A grade precisa suportar item novo mesmo sem imagem completa.
- A representacao visual nao deve assumir desenho pronto no primeiro instante.
- O destino do simbolo e a lista, ainda que a imagem venha depois.

## Limite desta atualizacao
- Nao reativa `POST`.
- Nao altera mapper.
- Nao altera backend.
- Nao altera schema.

## Fechamento
O contrato da grade permanece estavel no marco C, mas agora passa a carregar a leitura funcional da fase G.0E: um simbolo pode entrar na grade em branco e receber desenho posteriormente sem trocar de identidade.
