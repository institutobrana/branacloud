# Contrato da primeira tela piloto autenticada do frontend React

## Objetivo

Definir a primeira tela piloto autenticada do `frontend-react` como **Início / Painel Inicial**.

Esta tela será a primeira superfície autenticada da nova interface isolada do Brana Cloud e servirá como base de validação visual e de sessão antes da migração de áreas mais complexas.

## Por que essa tela vem antes do odontograma

Esta tela deve vir antes do Odontograma porque ela permite validar, com baixo risco:

- a sessão real já autenticada
- o shell autenticado do `frontend-react`
- a topbar e o menu lateral
- o padrão visual do novo frontend
- a navegação básica pós-login
- a disciplina de não mexer cedo demais em regra odontológica complexa
- a base estrutural para futuras telas

Assim, o projeto ganha uma primeira tela de produto com contrato claro sem misturar validação de UI com lógica odontológica crítica.

## Escopo da primeira implementação futura

A futura tela **Início / Painel Inicial** deve mostrar apenas dados seguros e simples, sem depender de APIs complexas novas.

Elementos sugeridos:

- título: `Início`
- saudação com nome, apelido ou e-mail do usuário logado, conforme retorno real do `/me`
- aviso discreto: `Frontend React em migracao controlada`
- cards de acesso:
  - Pacientes
  - Odontograma
  - Tratamentos
  - Agenda
  - Financeiro
  - Usuarios
- bloco `Status da sessao`
  - usuário autenticado
  - clínica/tenant, se disponível no `/me`
  - perfil/permissões, se disponíveis, apenas leitura
- bloco `Proximas telas da migracao`
  - Pacientes
  - Odontograma
  - Novo tratamento
  - Ficha pessoal

Regras importantes:

- nenhum dado sensível
- nenhum token exibido
- nenhuma consulta nova complexa
- nenhuma regra odontológica ainda

## Dados permitidos

A tela pode usar somente dados já disponíveis no `AuthProvider` após o `/me`:

- nome do usuário
- apelido do usuário
- e-mail do usuário
- clínica/tenant, se existir no retorno
- permissões/perfil, se já vierem no `/me`

Não inventar campos.
Não buscar dados novos ainda.

## Dados proibidos

Não exibir:

- `access_token`
- `Authorization`
- senha
- dados sensíveis
- dados clínicos reais
- pacientes
- tratamentos
- informações financeiras reais

## Regras visuais

A tela deve seguir o padrão **Brana Clinical Software UI**:

- Ant Design
- aparência de software/ERP
- cards compactos
- layout claro
- verde Brana como cor principal
- pouca animação
- visual profissional odontológico
- responsivo básico

## Estrutura futura sugerida

Quando a tela for implementada, a estrutura pode ser algo como:

- `frontend-react/src/features/inicio/InicioPage.jsx`
- `frontend-react/src/features/inicio/inicio.css`

Ou reaproveitar `HomePlaceholder`, se isso fizer mais sentido na etapa de implementação.

A decisão final deverá ser documentada na implementação.

## Regras de navegação futura

- `/app` deve abrir Início autenticado
- `/app/inicio` também pode abrir a mesma tela, se o roteamento simples permitir
- sem sessão, redirecionar para `/login`
- com sessão válida, permitir acesso

## O que não fazer na implementação futura

- não migrar odontograma
- não migrar pacientes
- não consumir lista de pacientes
- não criar dashboard financeiro real
- não criar permissões
- não criar endpoints
- não alterar backend
- não alterar frontend legado
- não alterar banco

## Critérios de aceite da futura implementação

A futura implementação será aceita se:

- build passar
- login continuar funcionando
- `/app` abrir a tela Início
- botão sair continuar funcionando
- frontend legado não for alterado
- backend não for alterado
- nenhum token ou senha for exibido
- roadmap for atualizado
- documentação da implementação for criada

## Riscos

- confundir a tela piloto com um dashboard real
- usar dados que ainda não têm contrato
- exibir dados sensíveis do `/me`
- começar odontograma cedo demais
- quebrar o fluxo de login já validado

## Próxima etapa recomendada

Implementar a tela **Início / Painel Inicial** autenticada seguindo este contrato, sem alterar backend e sem migrar tela odontológica ainda.
