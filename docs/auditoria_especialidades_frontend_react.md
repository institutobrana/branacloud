# Auditoria funcional e técnica - Especialidades

## Contexto
`Especialidades` é uma frente excepcional própria do Brana Cloud. Ela não deve ser tratada como tabela auxiliar simples.

O modal do legado confirma os campos visíveis:

- `Código`
- `Descrição`
- `Ordem`
- combo `Imagem`
- checkbox `Inativar especialidade`

## Fontes consultadas
### Brana Cloud legado / backend
- `frontend/app.js`
- `frontend/js/modules/auxiliares.js`
- `backend/routes/cadastros_routes.py`

### Novo frontend React
- `frontend-react/src/features/tabelasAuxiliares/TiposIndicacaoPage.jsx`
- `frontend-react/src/features/tabelasAuxiliares/auxiliaresApi.js`
- `frontend-react/src/components/BranaTable.jsx`
- `frontend-react/src/styles/globals.css`

### EasyDental Desktop / EDS70
- `Y:\EDS70\Dados\eds70.sql`

## Achados no Brana Cloud legado
O modal da frente de `especialidade` é montado em `frontend/app.js` com:

- `Código`
- `Descrição`
- `Ordem`
- `Imagem`
- checkbox `Inativar especialidade`

O payload enviado pelo frontend legado usa:

- `tipo`
- `codigo`
- `descricao`
- `ordem`
- `imagem_indice`
- `inativo`

No backend, a listagem e gravação de auxiliares já expõem e persistem:

- `codigo`
- `descricao`
- `ordem`
- `imagem_indice`
- `inativo`
- `cor_apresentacao`
- `exibir_anotacao_historico`
- `mensagem_alerta`
- `desativar_paciente_sistema`

Também há rota específica de apoio:

- `GET /cadastros/auxiliares/especialidades-ativas`

Essa rota retorna uma lista com:

- `id`
- `codigo`
- `nome`
- `ordem`
- `imagem_indice`

## Achados no EDS70
A tabela estrutural equivalente é:

- `_ESPECIALIDADE`

Campos confirmados no dump:

- `REGISTRO`
- `CODIGO`
- `NOME`
- `RESERVADO`
- `ORDEM`
- `IMAGE_INDEX`
- `INATIVO`

## Como funciona o combo `Imagem`
O comportamento real encontrado não aponta para upload livre.

O combo `Imagem` no legado é alimentado por um catálogo fixo no frontend:

- `Dentística`
- `Prótese`
- `Endodontia`
- `Periodontia`
- `Gerais`
- `Cirurgia`
- `Ortodontia`
- `Prevenção`
- `Odontopediatria`
- `Diagnóstico`
- `Radiologia`
- `Estética`
- `Implantodontia`
- `Genérica`

O valor salvo é `imagem_indice`, e o frontend deriva a URL de visualização a partir desse índice.

## Diagnóstico funcional
`Especialidades` é uma exceção própria.

### Campos confirmados para a futura implementação
- `Código`
- `Descrição`
- `Ordem`
- `Imagem`
- `Inativar especialidade`

### Comportamentos confirmados
- `Ordem` é persistida como campo numérico opcional
- `Inativar especialidade` é persistido como booleano
- `Imagem` usa seleção por índice/catalogo fixo, não upload livre
- a frente depende de um modal específico
- a listagem precisa respeitar o vínculo com `imagem_indice`

## Limitações encontradas
- não foi encontrada, nesta rodada, documentação separada do EDS70 explicando o catálogo de imagens além da tabela `_ESPECIALIDADE`
- a confirmação do combo veio principalmente do dump SQL e do próprio frontend legado

## Recomendações
- abrir um contrato próprio de implementação para `Especialidades`
- manter o combo `Imagem` como catálogo fechado, salvo nova descoberta funcional
- verificar se o React futuro precisará de ajuste de backend para expor corretamente o catálogo de imagens, ou se a montagem poderá ser só de frontend
