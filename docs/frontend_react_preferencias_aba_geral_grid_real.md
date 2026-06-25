# Grid real da aba Geral do modal Preferências

## Objetivo

Registrar o ajuste estrutural definitivo da aba Geral do modal de Preferências no `frontend-react`, travando a composição visual em uma grade real com coluna de formulário e coluna fixa de foto.

## Problema validado

O usuário informou que a tentativa anterior ainda deixava a aba Geral com variações visuais pequenas entre os campos e as abas, sem a sensação de uma janela desktop estável.

## Causa encontrada

A estrutura anterior ainda dependia demais de larguras fluidas do layout, o que permitia que os campos “escorressem” visualmente para perto da área da foto e que a aba continuasse parecendo solta em vez de organizada em blocos fixos.

## Ajuste aplicado

- A aba Geral passou a usar uma grade real com coluna de formulário e coluna de foto separadas.
- O formulário passou a respeitar largura fixa aproximada de 430px por campo.
- As linhas passaram a usar labels com largura estável para reproduzir melhor a organização clássica do EasyDental.
- A foto passou a ocupar uma caixa fixa, com barra inferior totalmente visível e ações inteiras.
- O tamanho do modal, o rodapé cinza, as demais abas e o comportamento dos botões foram preservados.

## Arquivos alterados

- `frontend-react/src/features/preferencias/PreferenciasUsuarioModal.jsx`
- `frontend-react/src/features/preferencias/preferenciasUsuario.css`
- `docs/11_roadmap_desenvolvimento.md`

## Validação de texto

- Foi feita a correção dos textos em português UTF-8 no arquivo do modal.
- Foi feita a checagem para evitar caracteres de mojibake nos arquivos tocados nesta etapa.

## Resultado esperado

- Aba Geral com aparência mais estável e mais próxima da referência desktop.
- Foto encaixada sem corte visual.
- Campos alinhados e contidos na mesma largura.

## Confirmações

- Frontend legado não foi alterado.
- Backend não foi alterado.
- Banco de dados não foi alterado.
- Migrations não foram alteradas.
- Nenhuma senha ou token foi registrado.

## Próximo passo recomendado

Se houver nova divergência visual, o próximo refinamento deve ser apenas de microalinhamento, sem alterar a geometria já estabilizada.
