# Auditoria EasyDental virgem - Subetapa 8T-C - confirmação no UNC principal de usuário, prestador, unidade e setup

## 1. Contexto

- A Subetapa 8T-B complementou a 8T com comparação direta, mas naquela sessão o UNC principal `\\Sonyvaio\c\EDS70` não estava acessível.
- Nesta 8T-C o UNC principal voltou a responder, permitindo confirmar diretamente os achados antes da 8U.
- Esta etapa é somente documental e investigativa.
- Não há implementação nesta etapa.

## 2. Segurança e limites

- Nenhum código foi alterado.
- Nenhum banco Brana foi alterado.
- Nenhum arquivo EasyDental foi alterado.
- Nenhuma query de escrita foi executada.
- Nenhuma conta foi criada ou excluída.
- O setup não foi alterado.
- A blindagem textual/mojibake foi respeitada.
- Não houve cópia de arquivo EasyDental para dentro do repositório.

## 3. Fonte EasyDental verificada

- Caminho: `\\Sonyvaio\c\EDS70`
- Situação nesta sessão: acessível.
- Método de leitura:
  - leitura somente leitura de arquivos binários do compartilhamento UNC;
  - inspeção de `Dados\Dist\USUARIO.raw`, `Dados\Dist\PRESTADOR.raw`, `Dados\Dist\UNIDADE.raw`, `Dados\Dist\_TIPO_USUARIO.raw`, `Dados\Dist\SISTEMA.raw`, `Dados\Dist\SIS_MODULO.raw`, `Dados\Dist\SIS_FUNCAO.raw`;
  - leitura de `Dados\eds70.sql` para layout estrutural de tabelas;
  - busca textual sem escrita, sem abertura de tela e sem consulta de alteração.
- Arquivos/tabelas consultados:
  - `Dados\Dist\USUARIO.raw`
  - `Dados\Dist\PRESTADOR.raw`
  - `Dados\Dist\UNIDADE.raw`
  - `Dados\Dist\_TIPO_USUARIO.raw`
  - `Dados\Dist\SISTEMA.raw`
  - `Dados\Dist\SIS_MODULO.raw`
  - `Dados\Dist\SIS_FUNCAO.raw`
  - `Dados\eds70.sql`
- Limitações:
  - `LOGON.raw` não foi encontrado no caminho consultado nesta sessão;
  - `USUARIO_PERFIL.raw`, `USUARIO_MODULO.raw` e `USUARIO_FUNCAO.raw` não estavam disponíveis como `.raw` no mesmo ponto consultado, então a confirmação do vínculo estrutural ficou apoiada no `eds70.sql` e nos contratos históricos da trilha;
  - a ausência de setup genérico obrigatório para todo usuário novo foi inferida pelo conjunto consultado, não por interação de tela.

## 4. Achados confirmados no UNC

- Mestre:
  - `USUARIO.raw` contém `Mestre`;
  - `PRESTADOR.raw` também contém `Mestre`;
  - isso confirma que o papel funcional de maior privilégio existe na fonte principal.
- Clínica:
  - `PRESTADOR.raw` contém `Clínica`;
  - `USUARIO.raw` também traz a referência estrutural equivalente;
  - isso confirma a preservação do prestador sistêmico literal.
- Dentista (CD):
  - `_TIPO_USUARIO.raw` contém `Dentista (CD)$Cirurgião dentista`;
  - o tipo existe na base principal exatamente como esperado.
- Principal / 0001:
  - `UNIDADE.raw` contém `0001` e `Principal`;
  - isso confirma a unidade base da conta.
- Vínculo usuário-unidade:
  - `eds70.sql` mostra `USUARIO` com as colunas `ID_PRESTADOR` e `ID_UNIDADE`;
  - a tabela `USUARIO` também possui `ALTERASENHA`;
  - isso confirma o vínculo estrutural do usuário com a unidade.
- ControleUsuarios=0:
  - `SISTEMA.raw` contém `ControleUsuarios=0`;
  - isso confirma o controle de usuários/senhas desativado no nascimento do legado.
- Auditoria=0:
  - `SISTEMA.raw` contém `Auditoria=0`;
  - isso confirma a auditoria desativada no nascimento do legado.
- Setup / usuário novo:
  - nos arquivos consultados não apareceu setup genérico obrigatório para todo usuário novo;
  - os arquivos de segurança consultados não trouxeram `setup` como mecanismo genérico persistente;
  - o que continua sustentado é o contrato de primeiro acesso do usuário inicial, não uma tela universal para qualquer usuário posterior.

## 5. Comparativo 8T-B x 8T-C

| Item | Achado 8T-B | Achado 8T-C | Status | Observação |
| --- | --- | --- | --- | --- |
| Mestre | Encontrado no mirror local e nos contratos históricos | Encontrado diretamente no UNC em `USUARIO.raw` e `PRESTADOR.raw` | Confirmado | A equivalência funcional continua válida |
| Clínica | Encontrado no mirror local e nos contratos históricos | Encontrado diretamente no UNC em `PRESTADOR.raw` e na referência estrutural de `USUARIO.raw` | Confirmado | O prestador sistêmico continua preservado |
| Dentista (CD) | Encontrado no mirror local em `_TIPO_USUARIO` | Encontrado diretamente no UNC em `_TIPO_USUARIO.raw` | Confirmado | O tipo existe na fonte principal |
| Principal / 0001 | Encontrado no mirror local em `UNIDADE.raw` | Encontrado diretamente no UNC em `UNIDADE.raw` | Confirmado | A unidade base está presente na fonte principal |
| Vínculo usuário-unidade | Inferido pelo mirror local e pelo layout conhecido | Confirmado por `eds70.sql` com `USUARIO.ID_UNIDADE` | Confirmado | O contrato estrutural fica mais forte com o SQL da fonte principal |
| ControleUsuarios=0 | Encontrado no mirror local em `SISTEMA.raw` | Encontrado diretamente no UNC em `SISTEMA.raw` | Confirmado | Mantém o estado desativado no nascimento |
| Auditoria=0 | Encontrado no mirror local em `SISTEMA.raw` | Encontrado diretamente no UNC em `SISTEMA.raw` | Confirmado | Mantém o estado desativado no nascimento |
| Setup para usuario novo | Não foi encontrado setup genérico obrigatório para todo usuário novo no mirror local | Não foi encontrado setup genérico obrigatório para todo usuário novo nos arquivos consultados no UNC | Confirmado por inferência | Continua valendo o contrato de setup só para o ADM inicial |

## 6. Contrato confirmado para Brana

- O usuário ADM inicial das novas contas deve nascer com Tipo de usuário = Dentista (CD).
- O usuário ADM deve ser associado ao prestador ADM/Mestre funcional.
- O usuário ADM deve ser associado à unidade Principal / 0001.
- O setup permanece para o primeiro acesso do ADM inicial.
- O setup não deve aparecer para usuários criados depois.
- Contas existentes não devem ser alteradas.

## 7. Impacto nas próximas subetapas

- A confirmação direta no UNC reforça que a regra da 8T/8T-B está correta para seguir para a 8U.
- A 8V continua separada e posterior, para tratar o comportamento do setup em usuários criados depois.
- `Opções do Sistema > Segurança` continua como frente posterior, sem mistura com esta validação.

## 8. Fora de escopo

- Implementação.
- Alterar backend.
- Alterar frontend.
- Alterar banco Brana.
- Alterar EasyDental.
- Criar conta.
- Excluir conta.
- Executar query de escrita.
- Alterar setup.
- Alterar senha interna.
- Alterar Opções do Sistema.
- Alterar usuários/prestadores no Brana.

## 9. Plano de verificação

- Somente este documento novo e o roadmap foram alterados.
- `frontend` não foi alterado.
- Backend não foi alterado.
- Banco/schema/migrations/seeds/endpoints não foram alterados.
- EasyDental não foi alterado.
- Nenhuma conta foi criada ou excluída.
- A blindagem textual/mojibake foi respeitada.
