# Contrato do Shell Operacional Odontológico do frontend React

## A) Objetivo

Definir a nova direção visual do shell do `frontend-react` como **Shell Operacional Odontológico**, com aparência mais próxima de software clínico desktop e menos parecida com dashboard administrativo genérico.

## B) Diagnóstico do layout atual

- O login e a sessão já estão funcionando.
- A tela `Início` abre corretamente.
- O botão `Sair` funciona.
- O layout atual está limpo e legível.
- Mesmo assim, o visual atual ainda lembra mais um dashboard administrativo do que um software odontológico operacional.

## C) Referência desejada

O modelo visual desejado reúne as seguintes características:

- toolbar lateral esquerda estreita
- ícones verticais
- toolbar horizontal superior
- botões de ação rápida no topo
- busca de paciente no topo
- área central de trabalho
- densidade maior de informação
- aparência de software clínico, ERP ou desktop
- menos dependência de cards grandes
- navegação rápida por ícones

## D) Estrutura visual futura sugerida

Layout alvo:

```text
BranaShell
  BranaIconRail        <- barra lateral estreita com ícones
  BranaWorkspace
    BranaActionTopbar  <- barra superior horizontal
    BranaContent       <- área da tela ativa
```

## E) Componentes futuros sugeridos

Documentar criação futura de:

- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/layout/BranaActionTopbar.jsx`
- `frontend-react/src/layout/BranaWorkspace.jsx`

Ou adaptação dos componentes atuais:

- `BranaShell.jsx`
- `BranaSidebar.jsx`
- `BranaTopbar.jsx`

## F) Barra lateral esquerda

A barra lateral deve ser estreita, com ícones e tooltip ou label curto.

Itens sugeridos:

- Início
- Pacientes
- Odontograma
- Tratamentos
- Agenda
- Financeiro
- Usuários
- Configurações
- Sair, se fizer sentido manter no topo ou rodapé

A barra lateral deve usar principalmente:

- `#00A79D`
- `#007B74`
- `#006838`

com contraste adequado.

## G) Toolbar superior horizontal

A toolbar superior deve conter ações rápidas, inicialmente visuais ou placeholders:

- Novo paciente
- Buscar paciente
- Novo tratamento
- Agenda
- Financeiro
- Relatórios/Documentos, se fizer sentido no futuro
- campo de busca: `Pesquisar paciente`

Importante:

- Nesta fase futura, os botões podem ser placeholders.
- Eles não devem abrir fluxos reais sem contrato.

## H) Área principal

A área central deve continuar mostrando a tela `Início` por enquanto, mas com moldura e layout mais operacionais:

- menos margem excessiva
- mais largura útil
- cards mais compactos
- visual de sistema
- sem perder legibilidade

## I) Regras de identidade visual

Usar os tokens oficiais da marca:

- `#00A79D` como cor principal de destaque
- `#006838` como verde institucional
- `#004B25` com moderação
- `#939598` e `#808285` como cinzas auxiliares
- `#007B74` como apoio

Não usar cores aleatórias fora da paleta, salvo neutros básicos para legibilidade.

## J) O que não implementar ainda

- não migrar odontograma
- não migrar pacientes
- não criar busca real de paciente
- não criar novo tratamento real
- não criar agenda real
- não consumir novas APIs
- não alterar backend
- não alterar banco
- não alterar frontend legado
- não criar permissões

## K) Estratégia segura de implementação futura

Etapas futuras sugeridas:

1. Contrato do Shell Operacional Odontológico
2. Refatorar `BranaShell` para barra lateral estreita + topbar horizontal, sem mudar funcionalidades
3. Ajustar a tela `Início` para o novo shell
4. Validar login, `/app` e `Sair` novamente
5. Só depois criar contrato da primeira tela funcional real, preferencialmente `Pacientes` somente leitura

## L) Critérios de aceite da futura implementação

A futura implementação será aceita se:

- login continuar funcionando
- `/app` abrir normalmente
- botão `Sair` continuar funcionando
- barra lateral estreita aparecer
- toolbar superior horizontal aparecer
- tela `Início` continuar acessível
- nenhuma API nova for consumida
- frontend legado não for alterado
- backend não for alterado
- build passar
- roadmap for atualizado

## M) Riscos

- quebrar o login recém-validado
- transformar toolbar em funcionalidade real sem contrato
- exagerar na quantidade de ícones
- perder legibilidade
- misturar visual de referência com regras de negócio ainda não migradas
- copiar EasyDental literalmente em vez de adaptar ao Brana Cloud

## Confirmações

- Nenhum código do `frontend-react` foi alterado nesta etapa.
- O frontend legado não foi alterado.
- O backend não foi alterado.
- O banco não foi alterado.
- As migrations não foram alteradas.
- Nenhuma dependência foi instalada.

