# Contrato Funcional - Modal Novo Símbolo Gráfico React

## Objetivo
Registrar o contrato funcional final do modal de símbolo gráfico no React, já validado com edição, biblioteca, previews, editor interno e integração com o modal pai.

## Estado final do modal
- A tela `Novo` é um modal próprio.
- O modal carrega o conceito de cadastro gráfico rico.
- O fluxo de abertura e fechamento é controlado pela tela principal.
- O mesmo shell é reutilizado no modo de criação e no modo de alteração.
- O título funcional de referência permanece `Edita símbolo gráfico`.

## Campos do modal
- Nome do símbolo
- Tipo
- Especialidade
- Forma de marcação no odontograma
- Desenho
- Biblioteca visual de símbolos
- Área de desenho / preview

## Controles do modal
- Rádio para `Sistema`
- Rádio para `Definido pelo usuário`
- Combo de especialidade
- Combo de forma de marcação
- Biblioteca visual de símbolos
- Área de edição do desenho
- Botões `Ok` e `Cancela`

## Editor interno
- O editor gráfico é parte integrante do fluxo final.
- O editor permanece isolado do modal pai.
- A troca de dados entre modal e editor continua controlada por mensagem/props.
- O editor não pode salvar sem contexto do símbolo ativo.
- O editor devolve dados suficientes para atualizar o preview e preparar a persistência.

## Comportamento final

### Abertura
- O modal pode abrir vazio ou com defaults seguros.
- A biblioteca permanece visível.
- O preview inicial é consistente.
- O editor gráfico pode ser iniciado sem perda de contexto.

### Fechamento
- `Cancela` encerra sem gravação.
- O fechamento do editor não corrompe o modal principal.
- O overlay e o backdrop são limpos corretamente ao fechar.

### Persistência
- O frontend não confia em `clinica_id` vindo da interface.
- A persistência segue o contrato autenticado do backend.
- O cadastro respeita tipo do símbolo e especialidade resolvida.
- O resultado atualiza a lista do módulo após salvamento.

### Regras de negócio
- Símbolo de sistema e símbolo de usuário continuam semanticamente distintos.
- A especialidade continua sendo parte do contrato funcional.
- A biblioteca visual continua sendo parte da experiência mínima.
- O desenho continua fazendo parte da identidade do símbolo.

## Integração com o modal pai
- `Salvar como` entrega o PNG/data URL ao modal pai.
- O modal pai armazena a imagem em `imagemCustom`.
- O `Ok` do modal pai executa a persistência real.
- `Cancelar` descarta o estado temporário.

## Fora de escopo
- Reescrever backend.
- Alterar schema.
- Mudar contrato de persistência no servidor.
- Simplificar o editor para um formulário textual puro.

## Aprovação final
O modal estrutural do `Novo` fica aprovado para a implementação final em React, pois preserva:
- modal próprio;
- biblioteca e preview;
- editor isolado;
- especialidade e forma;
- separação entre sistema e usuário;
- contrato de autenticação e tenant do backend.

## Fontes de apoio
- `docs/auditoria_simbolos_graficos_brana_cloud.md`
- `docs/auditoria_fluxo_novo_simbolo_grafico_easydental.md`
- `docs/auditoria_fluxo_novo_simbolo_grafico_brana_legado.md`
- `docs/auditoria_editor_simbolo_grafico_postmessage.md`
