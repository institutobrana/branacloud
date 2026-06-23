# `frontend-react` - shell com topbar full-width

## Escopo da etapa

Esta etapa reorganiza apenas o layout do shell do `frontend-react`, sem alterar backend, banco, migrations, permissões ou o frontend legado.

## Problema visual corrigido

- A hierarquia visual estava invertida.
- A lateral nascia desde o topo e competia com a barra superior.
- O workspace ficou comprimido e com quebra visual indesejada.
- O painel contextual ficava preso aberto por mais tempo do que o desejado.

## Nova hierarquia do shell

O shell passou a seguir esta ordem visual:

1. `BranaActionTopbar` no topo, ocupando a largura total.
2. Abaixo dela, o bloco operacional com:
   - rail lateral esquerda;
   - painel contextual opcional;
   - workspace principal.

## Topbar full-width

- A topbar agora ocupa toda a largura da janela.
- Ela fica acima da rail e do workspace.
- Mantém marca, toolbar por ícones, busca e menu do usuário.

## Lateral abaixo da topbar

- A rail começa abaixo da topbar.
- O painel contextual também começa abaixo da topbar.
- A lateral não cobre nem ultrapassa a barra superior.

## Workspace corrigido

- O workspace passou a começar abaixo da topbar.
- O conteúdo ganhou `min-width: 0` no encaixe principal para evitar compressão extrema.
- O texto da tela `Início` deixa de sofrer o empilhamento vertical provocado pela hierarquia anterior.

## Painel contextual

- O painel continua abrindo ao selecionar grupo na rail.
- O painel fecha pelo botão `X`.
- O painel também fecha ao sair com o mouse da região combinada da rail + painel.
- Enquanto o mouse estiver sobre rail ou painel, ele permanece aberto.
- Ao trocar de grupo, o conteúdo continua sendo atualizado.
- `Cadastro -> Pacientes` continua abrindo a tela somente leitura e fechando o painel.

## Confirmações de segurança

- Nenhum backend foi alterado.
- Nenhum frontend legado foi alterado.
- Nenhum banco foi alterado.
- Nenhuma migration foi alterada.
- Nenhum endpoint novo foi criado.
- Nenhuma API nova foi consumida.
- Nenhuma API de escrita foi usada.
- Nenhuma senha, token, cookie ou `Authorization` completo foi registrado.

## Limitações

- Esta etapa não implementa novas telas reais.
- Esta etapa não altera a lógica de pacientes além do encaixe visual já contratado.
- Esta etapa não cria novos fluxos funcionais.

## Próximos passos

- Validar visualmente o shell em `http://localhost:5173/app`.
- Ajustar finamente alturas e espaçamentos, se necessário.
- Só depois avançar para a próxima frente funcional contratada.
