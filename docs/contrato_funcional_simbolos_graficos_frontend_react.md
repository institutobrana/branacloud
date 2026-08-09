# Contrato Funcional - Símbolos Gráficos - Frontend React

## Objetivo
Consolidar o contrato funcional final e validado para a tela React de `Configurações > Símbolos gráficos`, cobrindo listagem, seleção, criação, alteração, exclusão e editor gráfico já homologados no frontend React.

## Estado funcional validado
- Rota final: `/app/configuracoes/simbolos-graficos`
- Toolbar final: `Novo`, `Altera` e `Elimina`
- Tabela principal com colunas `Nome` e `Especialidade`
- Seleção visual de linha única com primeira coluna indicando o item ativo
- O texto redundante `Selecionado: <nome>` não faz parte do contrato final
- A seleção alimenta diretamente os fluxos de `Altera` e `Elimina`

## Fluxo da tela principal

### Novo
- Abre o modal de criação de símbolo gráfico.
- Usa o editor gráfico e a biblioteca visual.
- Não persiste diretamente no backend.
- A persistência final ocorre apenas no `Ok` do modal pai.

### Altera
- Abre o modal de edição do símbolo selecionado.
- Hidrata o formulário com os dados da linha ativa.
- Preserva o desenho existente durante a edição.
- Não persiste diretamente no backend.
- A persistência final ocorre apenas no `Ok` do modal pai.

### Elimina
- Abre a confirmação de exclusão do símbolo selecionado.
- `Cancela` não executa mutação.
- O backend pode bloquear a exclusão de símbolos protegidos ou com vínculos.
- A tela deve tratar `404` e `409` como respostas esperadas de proteção/ausência.

## Tabela principal
- Colunas obrigatórias: `Nome` e `Especialidade`.
- Seleção: linha única ativa.
- Ordenação padrão: por `Nome`.
- Duplo clique: abre a edição do símbolo selecionado quando aplicável.
- Atualização: a lista é recarregada após operações de CRUD.
- O rodapé exibe contagem e estado de carregamento quando houver.

## Formulário de criação e edição

### Campos funcionais finais
- Nome
- Tipo
- Especialidade
- Forma de marcação
- Desenho
- Biblioteca
- Previews dentro da área de edição

### Campos comprovados pelo backend
- `descricao`
- `codigo`
- `especialidade`
- `tipo_simbolo`
- `tipo_marca`
- `sobreposicao`
- `icone`
- `bitmap1`
- `bitmap2`
- `bitmap3`
- `imagem_custom`

### Regras de validação
- `Nome` não pode ser vazio.
- `Especialidade` deve ser válida quando informada.
- `Forma de marcação` valida valores de `1` a `6`.
- `descricao` continua obrigatória no contrato do backend.
- `codigo` continua obrigatório para criação e edição de símbolo de usuário.
- `tipo_simbolo` e `tipo_marca` devem respeitar o catálogo e a validação da tela.

### Regras funcionais
- Símbolos de sistema não podem ser recriados manualmente.
- Símbolos de sistema não podem ser excluídos.
- Símbolos oficiais aceitam apenas alteração de nome e especialidade.
- O frontend não deve confiar em `clinica_id` vindo da interface.
- Toda operação deve ser filtrada por clínica via backend autenticado.
- Em edição, a biblioteca não pode substituir o desenho existente.
- O desenho original deve permanecer preservado até o `Salvar como` do editor e o `Ok` do modal pai.

## Editor gráfico

### Estrutura final
- Matrix 24x24.
- 576 células.
- Células quadradas.
- Conversão entre matrix e PNG/data URL.
- Interpretar pixels legados booleanos como preto quando necessário.

### Ferramentas
- `Lápis`
- `Borracha`
- `Desfazer`
- `Limpar`

### Paleta
- Paleta de 44 cores.
- A cor ativa deve ser preservada durante a pintura.

### Previews
- `Prévia 1x`
- `Prévia ampliada`
- Os previews ficam dentro da área de edição do desenho.
- Não existe mais um terceiro container funcional separado chamado `Quadro de Prévias` para esta frente.

### Botões do editor
- `Recarregar`
- `Salvar como`
- `Cancela`

### Semântica final dos botões
- `Recarregar` restaura `initialImage` e mantém o editor aberto.
- `Recarregar` não chama API e não persiste nada.
- `Salvar como` converte a matrix atual em PNG/data URL e chama `onConfirm(png)`.
- `Salvar como` não grava no backend por conta própria.
- `Cancela` fecha o editor sem persistência.

## Fluxo real de persistência
- Matrix -> PNG/data URL -> `Salvar como` -> `onConfirm(png)` -> modal pai -> `imagemCustom` -> `Ok` -> API.
- O `Ok` do modal pai é o comando real de persistência.
- No create, o backend usa `POST /cadastros/simbolos-graficos`.
- No edit, o backend usa `PUT /cadastros/simbolos-graficos/{id}`.

## Respostas esperadas
- `POST` retorna `id`, `codigo`, `descricao`.
- `PUT` retorna confirmação e dados básicos do item.
- `DELETE` retorna confirmação quando permitido.
- `400` cobre nome ausente, código ausente, duplicidades e regras de catálogo.
- `404` indica símbolo não encontrado na clínica.
- `409` indica tentativa de excluir símbolo de sistema.

## Dependências funcionais
- `GET /cadastros/simbolos-graficos`
- `GET /cadastros/simbolos-graficos?scope=procedimentos`
- `GET /cadastros/auxiliares?tipo=Especialidade`

## Observações finais
- O contrato acima registra o estado final homologado no frontend React.
- A listagem, a seleção, os modais e o editor foram validados em runtime e em testes.
- Não há lacuna funcional aberta para esta frente nesta etapa.

## Fontes base
- `docs/auditoria_simbolos_graficos_brana_cloud.md`
- `docs/auditoria_simbolos_graficos_easydental.md`
- `frontend-react/src/features/admin/clinics/ClinicsPage.jsx`
- `frontend-react/src/features/admin/clinics/components/ClinicsTable.jsx`
- `frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx`
- `frontend-react/src/features/medicamentos/MedicamentosPage.jsx`
- `backend/routes/cadastros_routes.py`
