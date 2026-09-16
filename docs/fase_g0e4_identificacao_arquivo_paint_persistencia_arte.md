# FASE G.0E.4 - Identificacao do arquivo do Paint e momento real da persistencia da arte

Data: 2026-08-03

## Status da rodada
- PARCIALMENTE EXECUTADA.
- O estado do cliente e dos diretórios foi inventariado.
- O arquivo real aberto pelo Paint ainda nao foi identificado com prova fechada nesta janela.

## Topologia confirmada
- Cliente interativo: `C:\EDS70\EDS70.exe`
- Compartilhamento e arquivos do servidor: `Y:\EDS70`
- Banco legado: `DELL_SERVIDOR\EDS70` / `EDS70`

## Estado prático atual
- O registro `TESTE EASYDENTAL SIMBOLO EM BR` ja existe.
- A tabela passou de 81 para 82.
- O registro nasceu sem desenho.
- O `Altera` reabriu o registro.
- O `Editar` abriu o Microsoft Paint.
- O Paint trabalhou com canvas de `15 x 15` pixels.
- O preview no EasyDental passou a mostrar um pequeno quadro branco.

## Processo observado
- `EDS70.exe` esta ativo.
- PID observado do cliente: `3392`.
- `mspaint.exe` nao estava visivel no instante da coleta de processos.
- Isso sugere que o editor pode ja ter sido fechado ou nao estava mais em primeiro plano no momento do snapshot.

## Inventário de arquivos recentes no cliente
### `C:\EDS70\Temp`
- `INSPIRON-15_eds70.log`
- `EDS70Tmp.ldb`
- `gerais.bmp`
- `arc_inferior.bmp`
- `arc_superior.bmp`
- `anexo.jpg`
- `EDS70Tmp.MDB`

### `C:\Users\Tel\AppData\Local\Temp`
- varios `.tmp` vazios recentes
- `~DFDD6C753BBDBC1361.TMP` com tamanho elevado e data mais antiga que a janela principal desta operacao
- nenhum candidato univoco confirmado como arquivo do Paint nesta coleta

### `Y:\EDS70\Temp`
- `EDS70Tmp.ldb`
- `DELL_SERVIDOR_eds70.log`
- `EasyBackup.CMP`
- logs estruturais de tabelas e dominio
- nenhum arquivo novo comprovadamente ligado ao clique `Editar` nesta coleta

## Banco
- Tentativa de consulta somente leitura com `sqlcmd` falhou.
- Motivo: o driver ODBC instalado nao suporta o SQL Server antigo do ambiente legado.
- Portanto, o momento da persistencia no banco nao foi fechado nesta subetapa.

## Arquivo do Paint
- Ainda nao foi possivel determinar com prova fechada:
  - caminho completo do documento aberto;
  - nome do arquivo;
  - se era temporario;
  - se residia em `C:`, `Y:` ou `%TEMP%`.
- Os candidatos observados ate aqui nao permitem conclusao segura.

## Momento real da persistencia
- Nao foi confirmado se a persistencia ocorre ao salvar no Paint, ao retornar ao EasyDental e clicar `Ok`, ou em ambos os momentos.
- O fluxo funcional indica dependencia da edicao minima no Paint e da confirmacao posterior no modal.
- A prova final ainda depende do próximo passo manual.

## Proxima acao assistida
Solicitar ao usuario exatamente:

`Faça apenas um pequeno ponto preto no canvas 15 x 15. Salve normalmente no Paint e feche o Paint. Não clique em Ok nem em Cancela no EasyDental. Avise quando o preview voltar ao modal.`

## Limite atual
- Nao alterar o codigo da Brana Cloud.
- Nao alterar banco manualmente.
- Nao reativar editor React.
- Nao iniciar POST no React.
