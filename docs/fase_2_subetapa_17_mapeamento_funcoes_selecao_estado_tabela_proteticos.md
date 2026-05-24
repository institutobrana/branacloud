# Fase 2 — Subetapa 17 — Mapeamento documental das funções dependentes de seleção/estado da Tabela de protéticos

## 1. Contexto
Os helpers puros já foram extraídos.

`protServicoSelecionado` não foi movido porque depende de cache/estado.

A Subetapa 16 recomendou nova análise documental antes de qualquer camada ou recorte funcional.

Esta etapa mapeia dependências antes de decidir se será seguro criar uma camada de seleção/estado.

## 2. Estado atual
- helpers já isolados em `frontend/js/modules/tabela-proteticos-helpers.js`;
- `protServicoSelecionado` ainda em `frontend/app.js`;
- possível arquivo futuro sugerido, sem criação:
  - `frontend/js/modules/tabela-proteticos-selecao-estado.js`;
- esta etapa não move código.

## 3. Variáveis/caches/estado relevantes

### `protServicosCache`
- Responsabilidade aparente: armazenar a lista atual de serviços do protético selecionado.
- Onde é lida: `protServicoSelecionado`, `protRelatorioRows`, `protRelatorioHtml`, `protRelatorioBlob`, `protRelatorioPdfBlob`, `protRelatorioCsv`, `protAbrirRelatorio`, `protRender`, `protExcluirServico`, `protEditarSelecionado`, `protSalvarModal`.
- Onde é alterada: `protCarregarServicos`.
- Funções que dependem dela: praticamente todo o fluxo da lista de serviços, relatório e exportação.
- Risco de mover função dependente sem encapsulamento: alto, porque a lista é o estado central do módulo de serviços.

### `protServicoSelecionadoId`
- Responsabilidade aparente: guardar o id do serviço atualmente selecionado na grade.
- Onde é lida: `protServicoSelecionado`, `protEditarSelecionado`, `protRender`, `protExcluirServico`, `protSelecionarLinha`.
- Onde é alterada: `protSelecionarLinha`, `protCarregarServicos`, `protExcluirCadastro` indiretamente ao recarregar contexto, e o fluxo de seleção da grid via evento.
- Funções que dependem dela: edição, exclusão, renderização da linha selecionada e consulta do item corrente.
- Risco de mover função dependente sem encapsulamento: alto, porque o id controla a seleção ativa e o item editado/excluído.

### `proteticosCache`
- Responsabilidade aparente: armazenar a lista atual de protéticos.
- Onde é lida: `protAbrirRelatorio`, `protCarregar`, `protEditarCadastro`, `protExcluirCadastro`, `protRender` indireto via combo/seleção.
- Onde é alterada: `protCarregar`.
- Funções que dependem dela: fluxo de carregamento, seleção do protético atual e relatório.
- Risco de mover função dependente sem encapsulamento: médio a alto, porque o cache define qual protético está em contexto.

### `proteticoSelecionadoId`
- Responsabilidade aparente: guardar o id do protético atualmente selecionado.
- Onde é lida: `protAbrirRelatorio`, `protAbrirModal`, `protCarregarServicos`, `protCarregar`, `protSalvarModal`, `protNovoCadastro`, `protEditarCadastro`, `protExcluirCadastro`, `protVincularEventos`.
- Onde é alterada: `protCarregar`, `protNovoCadastro`, `protEditarCadastro`, `protExcluirCadastro`, listener de `prot.cbo`.
- Funções que dependem dela: carregamento dos serviços, abertura de modal, criação/edição/exclusão do protético, relatório.
- Risco de mover função dependente sem encapsulamento: alto, porque é a seleção pai de todo o fluxo.

### `prot`
- Responsabilidade aparente: objeto de estado da UI da Tabela de protéticos e seus subfluxos.
- Onde é lida: praticamente todo o módulo `prot*`.
- Onde é alterada: `protEnsureUI` e funções que inicializam ou atualizam elementos de tela.
- Funções que dependem dela: quase toda a frente da Tabela de protéticos.
- Risco de mover função dependente sem encapsulamento: médio a alto, porque ele contém referencias de DOM, modal, relatório e exportação.

### `prot.relArquivoContext`
- Responsabilidade aparente: guardar contexto do relatório/exportação.
- Onde é lida: `protSelecionarDestinoRelatorio`, `protSalvarRelatorioArquivo`, `protAbrirRelatorioArquivo`.
- Onde é alterada: `protAbrirRelatorioArquivo`, `protFecharRelatorioArquivo`.
- Funções que dependem dela: exportação de relatório.
- Risco de mover função dependente sem encapsulamento: médio, porque mistura estado de exportação com a rotina de relatório.

### `prot.relArquivoFormato`
- Responsabilidade aparente: guardar o formato escolhido para exportação.
- Onde é lida: `protSelecionarDestinoRelatorio`, `protSalvarRelatorioArquivo`.
- Onde é alterada: `protAbrirRelatorioArquivo`, `protSelecionarDestinoRelatorio`.
- Funções que dependem dela: exportação e sugestão de nome do arquivo.
- Risco de mover função dependente sem encapsulamento: médio.

### `prot.relArquivoPath`
- Responsabilidade aparente: guardar o caminho/nome sugerido do arquivo.
- Onde é lida: `protSelecionarDestinoRelatorio`, `protSalvarRelatorioArquivo`.
- Onde é alterada: `protAbrirRelatorioArquivo`, `protSelecionarDestinoRelatorio`, `protFecharRelatorioArquivo`.
- Funções que dependem dela: escolha de destino e gravação do arquivo.
- Risco de mover função dependente sem encapsulamento: médio.

### `prot.relArquivoHandle`
- Responsabilidade aparente: manter o handle do arquivo selecionado pelo usuário.
- Onde é lida: `protSalvarRelatorioArquivo`.
- Onde é alterada: `protSelecionarDestinoRelatorio`, `protSalvarRelatorioArquivo`, `protFecharRelatorioArquivo`.
- Funções que dependem dela: exportação para arquivo local.
- Risco de mover função dependente sem encapsulamento: médio.

### `prot.relArquivoPickerWarned`
- Responsabilidade aparente: flag de aviso do picker de arquivo.
- Onde é lida: `protSelecionarDestinoRelatorio`.
- Onde é alterada: `protSelecionarDestinoRelatorio`.
- Funções que dependem dela: seletor de arquivo para relatório.
- Risco de mover função dependente sem encapsulamento: baixo a médio.

## 4. Funções diretamente ligadas à seleção/estado

### `protServicoSelecionado`
- Responsabilidade aparente: retornar o serviço atualmente selecionado.
- Entradas esperadas: nenhuma explícita.
- Saída esperada: item atual em `protServicosCache` ou `null`.
- Estado/cache lido: `protServicosCache`, `protServicoSelecionadoId`.
- Estado/cache alterado: não altera diretamente.
- DOM envolvido: não diretamente.
- Backend envolvido: não.
- Risco funcional: alto.
- Risco textual/mojibake: baixo diretamente, alto indiretamente se a seleção afetar o texto renderizado.
- Possibilidade de entrar em camada futura: sim, mas apenas se existir camada de seleção/estado.

### `protSelecionarLinha`
- Responsabilidade aparente: marcar a linha selecionada na grade de serviços.
- Entradas esperadas: uma linha `tr`.
- Saída esperada: nenhuma explícita.
- Estado/cache lido: `protServicoSelecionadoId`.
- Estado/cache alterado: `protServicoSelecionadoId`.
- DOM envolvido: sim, remove/adiciona classe `selected`.
- Backend envolvido: não.
- Risco funcional: alto, pois define a seleção corrente.
- Risco textual/mojibake: baixo.
- Possibilidade de entrar em camada futura: sim, como função de seleção/estado, mas com cautela por tocar DOM.

### `protEditarSelecionado`
- Responsabilidade aparente: abrir a edição do serviço atualmente selecionado.
- Entradas esperadas: nenhuma.
- Saída esperada: abertura de modal ou alerta.
- Estado/cache lido: `protServicosCache`, `protServicoSelecionadoId` via `protServicoSelecionado()`.
- Estado/cache alterado: não diretamente.
- DOM envolvido: sim, abre modal.
- Backend envolvido: não diretamente.
- Risco funcional: alto.
- Risco textual/mojibake: baixo diretamente.
- Possibilidade de entrar em camada futura: duvidosa; é mais consumidor de seleção do que seletor.

### `protCarregarServicos`
- Responsabilidade aparente: carregar a lista de serviços do protético selecionado.
- Entradas esperadas: nenhuma.
- Saída esperada: recarregar cache e renderizar.
- Estado/cache lido: `proteticoSelecionadoId`, `protServicoSelecionadoId`.
- Estado/cache alterado: `protServicosCache`, `protServicoSelecionadoId`.
- DOM envolvido: sim, via render.
- Backend envolvido: sim, `GET /proteticos/{id}/servicos`.
- Risco funcional: alto.
- Risco textual/mojibake: baixo diretamente, mas alto indiretamente pela renderização.
- Possibilidade de entrar em camada futura: não como foco principal; é carregador, não seletor.

### `protCarregar`
- Responsabilidade aparente: carregar protéticos e, em seguida, seus serviços.
- Entradas esperadas: nenhuma.
- Saída esperada: cache de protéticos atualizado e serviços recarregados.
- Estado/cache lido: `proteticoSelecionadoId`.
- Estado/cache alterado: `proteticosCache`, `proteticoSelecionadoId`.
- DOM envolvido: sim, combo de protéticos.
- Backend envolvido: sim, `GET /proteticos`.
- Risco funcional: alto.
- Risco textual/mojibake: baixo diretamente.
- Possibilidade de entrar em camada futura: não; é fluxo de carga.

### `protAbrir`
- Responsabilidade aparente: abrir o painel da Tabela de protéticos e disparar a carga.
- Entradas esperadas: nenhuma.
- Saída esperada: painel aberto.
- Estado/cache lido: indireto por `protCarregar`.
- Estado/cache alterado: indireto.
- DOM envolvido: sim.
- Backend envolvido: sim, via `protCarregar`.
- Risco funcional: alto.
- Risco textual/mojibake: baixo.
- Possibilidade de entrar em camada futura: não.

### `protAbrirModal`
- Responsabilidade aparente: abrir modal para novo serviço ou edição do serviço selecionado.
- Entradas esperadas: item opcional.
- Saída esperada: modal aberto com campos preenchidos.
- Estado/cache lido: `proteticoSelecionadoId`.
- Estado/cache alterado: `prot.modalBackdrop.dataset.editId`.
- DOM envolvido: sim.
- Backend envolvido: não.
- Risco funcional: alto.
- Risco textual/mojibake: baixo.
- Possibilidade de entrar em camada futura: não como camada de seleção; é UI de edição.

### `protSalvarModal`
- Responsabilidade aparente: salvar o serviço novo ou editado.
- Entradas esperadas: dados do modal.
- Saída esperada: gravação do serviço e recarga.
- Estado/cache lido: `proteticoSelecionadoId`, `prot.modalBackdrop.dataset.editId`.
- Estado/cache alterado: indiretamente via recarga.
- DOM envolvido: sim.
- Backend envolvido: sim, `POST/PUT /proteticos/.../servicos`.
- Risco funcional: alto.
- Risco textual/mojibake: baixo diretamente.
- Possibilidade de entrar em camada futura: não.

### `protExcluirServico`
- Responsabilidade aparente: excluir o serviço atualmente selecionado.
- Entradas esperadas: nenhuma.
- Saída esperada: exclusão e recarga.
- Estado/cache lido: `protServicoSelecionadoId` via `protServicoSelecionado()`.
- Estado/cache alterado: indireto via recarga.
- DOM envolvido: sim, confirmação.
- Backend envolvido: sim, `DELETE /proteticos/servicos/{id}`.
- Risco funcional: alto.
- Risco textual/mojibake: baixo diretamente.
- Possibilidade de entrar em camada futura: não.

### `protAbrirRelatorio`
- Responsabilidade aparente: montar a interface de relatório com protético/serviços atuais.
- Entradas esperadas: nenhuma.
- Saída esperada: relatório aberto.
- Estado/cache lido: `proteticosCache`, `proteticoSelecionadoId`.
- Estado/cache alterado: `prot.relTabela`, `prot.relTitulo`, `prot.relSaida`.
- DOM envolvido: sim.
- Backend envolvido: não diretamente.
- Risco funcional: médio a alto.
- Risco textual/mojibake: médio, pois o relatório depende de rótulos e conteúdo renderizado.
- Possibilidade de entrar em camada futura: não; é fluxo de relatório.

### `protAbrirRelatorioArquivo`
- Responsabilidade aparente: preparar a exportação/arquivo do relatório.
- Entradas esperadas: título e nome da tabela.
- Saída esperada: contexto do arquivo preenchido.
- Estado/cache lido: `prot.relArquivoContext`.
- Estado/cache alterado: `prot.relArquivoContext`, `prot.relArquivoFormato`, `prot.relArquivoPath`, `prot.relArquivoEmailCheck`.
- DOM envolvido: sim.
- Backend envolvido: não.
- Risco funcional: médio.
- Risco textual/mojibake: médio.
- Possibilidade de entrar em camada futura: não; é exportação.

### `protSelecionarDestinoRelatorio`
- Responsabilidade aparente: escolher sugerir/selecionar destino do arquivo.
- Entradas esperadas: nenhuma explícita.
- Saída esperada: nome/caminho sugerido e possível `window.showSaveFilePicker`.
- Estado/cache lido: `prot.relArquivoContext`, `prot.relArquivoPath`, `prot.relArquivoFormato`.
- Estado/cache alterado: `prot.relArquivoHandle`, `prot.relArquivoPath`, `prot.relArquivoFormato`, `prot.relArquivoPickerWarned`.
- DOM envolvido: sim.
- Backend envolvido: não.
- Risco funcional: médio.
- Risco textual/mojibake: médio, porque o nome final do arquivo pode mudar.
- Possibilidade de entrar em camada futura: não.

### `protSalvarRelatorioArquivo`
- Responsabilidade aparente: gerar e salvar/exportar o arquivo do relatório e, opcionalmente, enviar e-mail.
- Entradas esperadas: estado do formulário do relatório.
- Saída esperada: arquivo salvo e feedback em `footerMsg`.
- Estado/cache lido: `prot.relArquivoContext`, `prot.relArquivoFormato`, `prot.relArquivoPath`, `prot.relArquivoHandle`, `prot.relArquivoEmailCheck`, `prot.relArquivoEmail`, `prot.relArquivoAssunto`, `prot.relArquivoCorpo`.
- Estado/cache alterado: `prot.relArquivoHandle`, `prot.relArquivoContext`, `prot.relArquivoPath` indireto.
- DOM envolvido: sim.
- Backend envolvido: sim, quando dispara `protEnviarEmailRelatorio`.
- Risco funcional: alto.
- Risco textual/mojibake: alto, porque envolve conteúdo exportado e nome de arquivo.
- Possibilidade de entrar em camada futura: não.

### `protRelatorioRows`
- Responsabilidade aparente: transformar `protServicosCache` em linhas de relatório.
- Entradas esperadas: nenhuma.
- Saída esperada: array de linhas.
- Estado/cache lido: `protServicosCache`.
- Estado/cache alterado: não.
- DOM envolvido: não.
- Backend envolvido: não.
- Risco funcional: médio.
- Risco textual/mojibake: médio, porque alimenta todos os formatos de exportação.
- Possibilidade de entrar em camada futura: duvidosa; é mais de relatório do que de seleção.

### `protRelatorioBlob`
- Responsabilidade aparente: escolher o formato do blob exportado.
- Entradas esperadas: formato, título, nome da tabela e linhas.
- Saída esperada: `Blob`.
- Estado/cache lido: não diretamente.
- Estado/cache alterado: não.
- DOM envolvido: não.
- Backend envolvido: não.
- Risco funcional: médio.
- Risco textual/mojibake: médio.
- Possibilidade de entrar em camada futura: não; é report/export.

### `protRelatorioPdfBlob`
- Responsabilidade aparente: gerar o PDF de texto do relatório.
- Entradas esperadas: título, nome da tabela e linhas.
- Saída esperada: `Blob` PDF.
- Estado/cache lido: não diretamente, mas usa dados derivados de `protServicosCache`.
- Estado/cache alterado: não.
- DOM envolvido: não.
- Backend envolvido: não.
- Risco funcional: médio.
- Risco textual/mojibake: médio a alto, porque o escape de caracteres altera o conteúdo final do PDF.
- Possibilidade de entrar em camada futura: não; é geração de relatório.

### `protVincularEventos`
- Responsabilidade aparente: ligar eventos da tela.
- Entradas esperadas: nenhuma.
- Saída esperada: eventos conectados uma vez.
- Estado/cache lido: `prot` e seleção indireta.
- Estado/cache alterado: listeners de UI.
- DOM envolvido: sim.
- Backend envolvido: não diretamente.
- Risco funcional: alto.
- Risco textual/mojibake: baixo diretamente.
- Possibilidade de entrar em camada futura: não.

## 5. Funções que parecem fora da camada de seleção/estado
Mesmo relacionadas à Tabela de protéticos, estas funções não devem entrar numa camada de seleção/estado:

- `protSalvarModal`;
- `protExcluirServico`;
- `protCarregar`;
- `protAbrir`;
- `protAbrirRelatorio`;
- `protAbrirRelatorioArquivo`;
- `protSelecionarDestinoRelatorio`;
- `protSalvarRelatorioArquivo`;
- `protRelatorioBlob`;
- `protRelatorioPdfBlob`;
- `protVincularEventos`;
- qualquer função que dependa de `requestJson`;
- relatório completo;
- envio de e-mail;
- eventos complexos;
- permissões;
- sessão/autenticação.

## 6. Mapa de dependências

| Função | lê protServicosCache | altera protServicosCache | lê protServicoSelecionadoId | altera protServicoSelecionadoId | lê proteticosCache | lê/altera proteticoSelecionadoId | usa DOM | chama backend | risco | observação |
|---|---|---|---|---|---|---|---|---|---|---|
| `protServicoSelecionado` | sim | não | sim | não | não | não | não | não | alto | seletor puro de estado, mas dependente do cache |
| `protSelecionarLinha` | não | não | sim | sim | não | não | sim | não | alto | atualiza a seleção da linha |
| `protEditarSelecionado` | sim | não | sim | não | não | não | sim | não | alto | consumidor da seleção atual |
| `protCarregarServicos` | sim | sim | sim | sim | não | sim | sim | sim | alto | carrega serviços do protético atual |
| `protCarregar` | não | não | não | não | sim | sim | sim | sim | alto | carrega protéticos e redefine seleção |
| `protAbrir` | indireto | não | indireto | não | indireto | indireto | sim | sim | alto | abre o painel e dispara carga |
| `protAbrirModal` | não | não | não | não | não | sim | sim | não | alto | modal depende do protético selecionado |
| `protSalvarModal` | não | não | não | não | não | sim | sim | sim | alto | grava serviço no backend |
| `protExcluirServico` | sim | não | sim | não | não | não | sim | sim | alto | exclusão depende da seleção corrente |
| `protAbrirRelatorio` | sim | não | não | não | sim | sim | sim | não | médio/alto | monta relatório baseado no estado atual |
| `protRelatorioRows` | sim | não | não | não | não | não | não | não | médio | base de linhas do relatório |
| `protRelatorioPdfBlob` | indireto | não | não | não | não | não | não | não | médio | escape de conteúdo do PDF |
| `protSelecionarDestinoRelatorio` | não | não | não | não | não | não | sim | não | médio | sugere nome e destino do arquivo |
| `protSalvarRelatorioArquivo` | sim | não | não | não | não | não | sim | sim (e-mail opcional) | alto | exportação e envio em uma rotina só |
| `protVincularEventos` | indireto | não | indireto | não | indireto | indireto | sim | não | alto | conecta fluxo de UI |

## 7. Possível escopo de uma camada futura

### Candidatos prováveis
- `protServicoSelecionado`;
- funções pequenas de leitura de seleção;
- helpers que só consultem `protServicosCache` e `protServicoSelecionadoId` sem persistência.

### Candidatos duvidosos
- `protSelecionarLinha`;
- `protEditarSelecionado`;
- `protCarregarServicos`;
- `protAbrirRelatorio`;
- `protAbrirRelatorioArquivo`;
- `protSelecionarDestinoRelatorio`.

### Candidatos proibidos neste momento
- `protSalvarModal`;
- `protExcluirServico`;
- `protCarregar`;
- `protAbrir`;
- `protSalvarRelatorioArquivo`;
- `protVincularEventos`;
- qualquer rotina de backend, relatório completo ou e-mail.

## 8. Estratégia de compatibilidade futura

### Manter dependência global via `window`
- Vantagem: compatibilidade simples com `frontend/app.js`.
- Risco: mantém acoplamento global.
- Impacto em `app.js`: baixo.
- Compatibilidade com o padrão já usado nos helpers puros: alta.

### Passar caches/estado por parâmetro
- Vantagem: deixa a dependência explícita.
- Risco: exige ajustar chamadas e pode espalhar mudanças.
- Impacto em `app.js`: médio a alto.
- Compatibilidade com o padrão atual dos helpers puros: baixa.

### Criar funções de leitura sem alterar estado
- Vantagem: reduz risco de escrita acidental.
- Risco: não resolve sozinha a dependência estrutural.
- Impacto em `app.js`: médio.
- Compatibilidade com o padrão atual dos helpers puros: moderada.

### Criar camada só para getters
- Vantagem: separa leitura de seleção do restante.
- Risco: pode virar um meio-termo que ainda mantém acoplamento global.
- Impacto em `app.js`: baixo a médio.
- Compatibilidade com o padrão atual dos helpers puros: boa.

### Adiar qualquer extração
- Vantagem: risco imediato mínimo.
- Risco: posterga a organização da camada.
- Impacto em `app.js`: nenhum.
- Compatibilidade com o padrão atual dos helpers puros: total.

A alternativa mais conservadora, se uma futura extração acontecer, é manter compatibilidade global controlada, mas somente após contrato documental explícito.

## 9. Decisão recomendada
Opção B: fazer antes mais uma subetapa documental definindo contrato de interface da camada de seleção/estado.

## 10. Justificativa da decisão
Essa decisão é a mais segura porque:

- helpers puros já foram extraídos com sucesso;
- `protServicoSelecionado` depende de estado;
- mover sem contrato pode quebrar seleção/edição;
- criar módulo novo aumenta a superfície de integração;
- continuar refatorando sem teste automatizado específico aumenta o risco.

## 11. Contrato mínimo para eventual futura Subetapa 18
Se a próxima etapa for avançar funcionalmente, a Subetapa 18 deverá:

- criar somente `frontend/js/modules/tabela-proteticos-selecao-estado.js`;
- mover somente `protServicoSelecionado`;
- preservar assinatura;
- preservar retorno;
- preservar comportamento;
- preservar acesso a `protServicosCache` e `protServicoSelecionadoId`;
- não mover outras funções;
- não alterar backend;
- não alterar banco;
- não alterar endpoints;
- não alterar strings visíveis;
- executar `node --check`;
- fazer commit seletivo;
- exigir teste manual humano.

Se a próxima etapa for documental, a Subetapa 18 deverá ser documental de contrato de interface da camada de seleção/estado.

Se a frente for pausada, a Subetapa 18 deverá ser documental de fechamento parcial da frente.

## 12. Onde testar futuramente
Se houver eventual recorte futuro de seleção/estado, o usuário deverá testar:

- abrir a Tabela de protéticos;
- listar protéticos;
- selecionar protético;
- selecionar serviço;
- trocar seleção entre serviços;
- editar serviço selecionado;
- abrir modal de serviço;
- criar serviço;
- editar serviço;
- excluir serviço;
- abrir relatório;
- exportar relatórios;
- confirmar que criação, edição e exclusão de protético continuam intactas;
- confirmar que não houve alteração textual visível;
- confirmar que agenda de contatos e controle de protéticos não foram afetados.

## 13. Registro para roadmap
- A Subetapa 17 mapeia documentalmente funções dependentes de seleção/estado;
- helpers puros já extraídos permanecem isolados;
- `protServicoSelecionado` continua fora até decisão funcional própria;
- a decisão desta etapa deve definir se haverá avanço funcional, novo contrato documental ou pausa/consolidação;
- a Tabela de protéticos continua como primeira frente ativa da Fase 2;
- próximos passos devem permanecer pequenos, reversíveis, auditáveis e com teste humano;
- persistência, carga, relatório completo, e-mail, eventos, backend, banco e endpoints continuam fora;
- `Editor de texto`, `Ficha pessoal`, `Agenda`, `Conta corrente`, `Usuários/Login` e `Seeds/tabelas padrão` continuam fora desta frente.

## 14. Commit seletivo obrigatório
O único arquivo que deve entrar no commit desta etapa é:

- `docs/fase_2_subetapa_17_mapeamento_funcoes_selecao_estado_tabela_proteticos.md`

Não usar `git add .`.

Não usar `git add docs/`.

Não incluir untracked antigos.

Não incluir `frontend/app.js`.

Não incluir `frontend/index.html`.

Não incluir `frontend/js/modules`.

Não incluir `backend`.

Não incluir banco/schema/migrations/seeds/endpoints.

O commit deve ser seletivo e auditado.

## 15. Confirmações finais
- Esta etapa é documental.
- Nenhum código foi alterado.
- `frontend/app.js` não foi alterado.
- `frontend/index.html` não foi alterado.
- `frontend/js/modules` não foi alterado.
- `frontend/js/modules/tabela-proteticos-selecao-estado.js` não foi criado.
- backend não foi alterado.
- banco, schema, migrations, seeds e endpoints não foram alterados.
- Nenhum `UPDATE`, `DELETE` ou `INSERT` foi executado.
- Nenhum texto visível, acento, label, mensagem, placeholder ou string foi corrigido.
- A blindagem textual/mojibake foi respeitada.
- Os untracked antigos foram preservados.
- O único arquivo criado/modificado nesta etapa foi `docs/fase_2_subetapa_17_mapeamento_funcoes_selecao_estado_tabela_proteticos.md`.
