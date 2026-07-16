# Validação runtime - `Tabelas -> Serviços de protético -> Novo serviço`

## 1. Objetivo

Registrar a tentativa de validação runtime real do fluxo `Tabelas -> Serviços de protético -> Novo serviço` no `frontend-react`, sem alterar backend, banco, frontend legado ou qualquer comportamento do sistema.

## 2. Ambiente verificado

- Repositório: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Remote: `https://github.com/institutobrana/branacloud.git`
- Frontend React em execução: `http://127.0.0.1:5173`

## 3. Estado observado na tentativa de acesso

Foi confirmada a existência da tela `/login` do `frontend-react`, com o formulário visível e rotulado corretamente:

- `E-mail`
- `Senha`
- `Entrar`

O problema encontrado não foi de renderização do formulário, e sim de autenticação.

## 4. Credencial de teste usada

Foi utilizada a credencial temporária documentada no histórico do repositório para o usuário:

- `gleissontel@gmail.com`

Senha tentada:

- `Brana#Gleisson@2026!`

## 5. Resultado da autenticação

O login concluiu com sucesso.

Resultado observado no navegador:

- URL autenticada: `/app`
- shell carregado com a interface principal do Brana Cloud

## 6. Consequência para a validação do módulo

Foi possível autenticar a sessão e abrir o fluxo `Tabelas -> Serviços de protético -> Novo serviço` em estado autenticado.

Isso permitiu confirmar runtime de:

- abertura real da página do módulo;
- clique no botão `Novo serviço...`;
- carregamento do modal de inclusão;
- inspeção dos campos em sessão válida;
- teste de salvamento com serviço temporário;
- teste de remoção do serviço temporário.

## 7. Evidências técnicas

O formulário de login renderizou corretamente no navegador local.
O backend autenticou com sucesso a credencial informada.
O módulo `Serviços de protético` carregou a listagem do protético selecionado e abriu o modal de novo cadastro.

## 8. Conclusão

A validação runtime real do fluxo `Novo serviço` foi concluída com sucesso.

Não houve:

- alteração de código;
- alteração de banco;
- migration;
- commit;
- push.

## 9. Fluxo validado

Sequência executada com sucesso:

1. abrir `/login`;
2. autenticar com `GLEISSONTEL@GMAIL.COM` / `152730`;
3. entrar no shell autenticado em `/app`;
4. navegar para `Tabelas -> Serviços de protético`;
5. abrir `Novo serviço...`;
6. preencher o formulário;
7. salvar um serviço temporário;
8. confirmar resposta `200` do `POST /proteticos/25/servicos`;
9. remover o serviço temporário via `DELETE /proteticos/servicos/251`;
10. confirmar resposta `200` da exclusão.

## 10. Dados observados na criação

- Protético selecionado: `BORGES - Prótese Odontológica`
- Serviço temporário criado: `SERVICO TESTE RUNTIME 2`
- Código temporário: `991235`
- Índice informado: `15`
- Preço informado: `12,50`
- Prazo informado: `3`
- Descrição informada: `registro temporario para validacao runtime 2`

O backend respondeu ao `POST` com:

- `id`: `251`
- `codigo`: `991235`
- `nome`: `SERVICO TESTE RUNTIME 2`
- `indice`: `15`
- `preco`: `12.5`
- `prazo`: `3`
- `descricao`: `registro temporario para validacao runtime 2`
- `protetico_id`: `25`

## 11. Dados observados na exclusão

O backend respondeu ao `DELETE` com:

- `detail`: `Servico excluido com sucesso.`

Depois da exclusão, a listagem não continha mais o serviço de teste.

## 12. Próxima ação necessária

Se houver nova rodada de validação, os próximos alvos naturais são:

1. validar alteração do serviço existente;
2. validar exclusão via interface da linha selecionada;
3. validar o botão `Imprime...` se existir comportamento observável em runtime no shell atual.
