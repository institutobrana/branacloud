# Auditoria fina documental — Editor de Textos: exportação, preparação e assinatura de PDF

## 1. Resumo executivo

Esta auditoria fina isola o subconjunto mais sensível do Editor de Textos: exportação de PDF, preparação de PDF para Acrobat/app local e assinatura de PDF via ponte local. Esses fluxos são especialmente frágeis porque combinam `requestJson()`, resposta binária, `FormData`, `rawBody`, headers implícitos e integração com um aplicativo/ponte externa.

A conclusão principal é que o Editor de Textos, neste recorte, não é apenas um editor com exportação. Ele funciona como um pipeline híbrido de documentos, arquivos binários e integração local. Qualquer mudança pequena pode quebrar exportação, assinatura, preparação ou o nome final do arquivo.

## 2. Escopo e branch

- Branch confirmada: `modularizacao-segura-fase-1`
- Projeto: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Etapa: exclusivamente documental e de leitura
- Nenhuma alteração de código foi feita

## 3. Arquivos analisados

Frontend e editor de textos:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules`
- `frontend/js/utils`

Backend e contratos correlatos:

- `backend/routes`
- `backend/main.py`
- `backend/routes/editor_textos_routes.py` se existir como rota específica ou equivalente dentro das rotas de editor
- arquivos correlatos de `backend` ligados ao editor, PDF e processamento de documentos

Documentos anteriores usados apenas como contexto:

- `docs/auditoria_fina_requestjson.md`
- `docs/auditoria_fina_requestjson_tipos_transporte.md`
- `docs/auditoria_requestjson_categorias_uso.md`
- `docs/matriz_mestre_prioridade_risco_refatoracao.md`

## 4. Funções/blocos do frontend envolvidos

Os blocos diretamente envolvidos nestes fluxos são:

- `editorTextosExportarPdfAtual()`
- `editorTextosPrepararPdfNoAppPdf()`
- `editorTextosAssinarPdfViaPonteLocal()`
- `editorTextosExportarPdf` ou fluxo interno equivalente que monta o payload de exportação
- `editorTextosAbrirModalAssinarPdf()` como origem da execução da assinatura
- `editorTextosBaixarBlob()` como etapa auxiliar de saída do PDF assinado
- `editorTextosPerguntarAbrirPdfGerado()` e fluxos de confirmação para abertura local
- handlers de menu que disparam `exportar-pdf` e `assinar-pdf`

## 5. Fluxo sequencial da exportação de PDF

### 5.1 Entrada

1. O usuário aciona o menu ou ação `exportar-pdf`.
2. O frontend chama `editorTextosExportarPdfAtual()`.
3. A função monta o payload de exportação com o conteúdo atual do documento e metadados relevantes.

### 5.2 Transporte e retorno

1. O frontend chama `POST /editor-textos/exportar-pdf` via `requestJson()`.
2. O transporte usa `responseType: "blob"`.
3. O backend deve devolver um PDF binário em `Blob`.
4. O frontend lê `X-Generated-Filename` quando disponível para montar o nome final do arquivo.
5. Se o cabeçalho não existir, usa um nome de fallback baseado no documento.
6. O fluxo de exportação retorna um objeto com `blob`, `fileName` e `payload`.

### 5.3 Saída

- O blob pode ser salvo em arquivo local ou baixado conforme a UI e o navegador.
- O retorno é consumido por fluxos subsequentes de assinatura ou abertura local.

## 6. Fluxo sequencial da preparação de PDF

### 6.1 Entrada

1. Após a exportação, o usuário pode optar por abrir o PDF no aplicativo local.
2. O frontend chama `editorTextosPrepararPdfNoAppPdf(blob, nomeArquivo)`.
3. A função exige que o primeiro argumento seja um `Blob` válido.

### 6.2 Transporte

1. Um `FormData` é criado.
2. O arquivo PDF é anexado como `pdf_file`.
3. O nome do documento é anexado como `document_name`.
4. A requisição é enviada com `requestJson()` usando `rawBody: formData`.
5. O endpoint envolvido é `POST /editor-textos/preparar-pdf-acrobat`.

### 6.3 Retorno esperado

- A resposta não é um JSON comum qualquer; ela precisa trazer dados suficientes para abrir o PDF preparado no aplicativo local.
- O frontend espera campos que permitam recuperar o caminho ou o identificador do arquivo preparado.
- No fluxo atual, o frontend lê `file_path` do retorno para abrir o arquivo preparado.

## 7. Fluxo sequencial da assinatura de PDF via ponte local

### 7.1 Entrada

1. O usuário aciona a assinatura de PDF.
2. O frontend chama `editorTextosAssinarPdfViaPonteLocal({ usarAtual, pdfFile, fieldName })`.
3. O fluxo verifica se existe certificado/ponte local selecionada.
4. Se não houver certificado, a função lança erro antes de chamar o backend.

### 7.2 Transporte

1. O fluxo constrói um `FormData` com o PDF e metadados da assinatura.
2. Se houver hint de assinatura, ele é serializado e enviado também.
3. A chamada usa `POST /editor-textos/assinar-pdf`.
4. A requisição passa por `requestJson()` com `rawBody: formData` e `responseType: "blob"`.

### 7.3 Saída

1. O backend deve devolver um blob com o PDF assinado.
2. O frontend baixa o blob com `editorTextosBaixarBlob()`.
3. O texto de status informa sucesso na assinatura.
4. O modal de assinatura é fechado ao final.

## 8. Endpoints / rotas envolvidos

- `POST /editor-textos/exportar-pdf`
- `POST /editor-textos/preparar-pdf-acrobat`
- `POST /editor-textos/assinar-pdf`
- `POST /editor-textos/registrar-assinatura-local` como apoio correlato, não como fluxo principal desta auditoria

## 9. Tipo de transporte usado em cada fluxo

### Exportação de PDF

- `requestJson()` com `responseType: "blob"`
- payload JSON de exportação
- retorno binário em `Blob`
- uso de `X-Generated-Filename` no header de resposta

### Preparação de PDF

- `requestJson()` com `rawBody: FormData`
- corpo multipart/form-data
- retorno orientado a arquivo preparado para abertura local

### Assinatura de PDF via ponte local

- `requestJson()` com `rawBody: FormData`
- `responseType: "blob"`
- retorno binário com PDF assinado
- integração com aplicação/ponte local por meio de certificado instalado no Windows

## 10. Payloads aparentes envolvidos

### Exportação

- conteúdo do documento atual
- título/identificação do documento
- opção de assinatura ou campos derivados da interface
- metadados de origem, quando aplicáveis

### Preparação para Acrobat/app local

- `pdf_file`
- `document_name`

### Assinatura via ponte local

- PDF a assinar
- `signature_box_hint_json`, quando disponível
- metadados de certificação/ponte local
- identificador do certificado/Thumbprint da sessão local

## 11. Respostas aparentes esperadas

### Exportação

- `Blob` binário
- cabeçalho `X-Generated-Filename` opcional
- `detail` em caso de erro

### Preparação

- objeto de retorno com dados do arquivo preparado
- campo `file_path` ou equivalente para abrir no aplicativo local
- `detail` em erro

### Assinatura

- `Blob` binário com o PDF assinado
- eventualmente metadados adicionais de retorno, mas o foco é o blob
- `detail` em erro

## 12. Pontos de contrato rígido

1. O endpoint de exportação precisa responder como `blob`.
2. O cabeçalho `X-Generated-Filename` é parte do contrato prático do nome do arquivo.
3. O endpoint de preparação precisa aceitar `FormData` via `rawBody`.
4. O endpoint de assinatura precisa aceitar `FormData` via `rawBody` e devolver `blob`.
5. O frontend espera que o PDF exportado seja reutilizável no fluxo seguinte de preparação/assinatura.
6. O fluxo de assinatura depende de certificado/ponte local já selecionado.
7. O retorno de preparação precisa ser suficiente para abrir o arquivo preparado no app local.

## 13. Pontos mais frágeis

- qualquer mudança em `responseType: "blob"`
- qualquer mudança em `rawBody`/`FormData`
- qualquer mudança no header `X-Generated-Filename`
- qualquer mudança no shape do retorno da preparação
- qualquer mudança no blob retornado pela assinatura
- qualquer mudança na ponte local ou no certificado selecionado
- qualquer mudança no nome dos campos do formulário multipart
- qualquer mudança na forma de serializar o hint de assinatura

## 14. Riscos críticos

- exportação gerar arquivo vazio ou inválido
- PDF preparado não abrir no aplicativo local
- assinatura local falhar por incompatibilidade com a ponte Windows
- frontend perder o nome correto do arquivo final
- backend mudar o conteúdo retornado e quebrar o download/binário
- contrato multipart não ser aceito pelo backend
- usuário ficar sem feedback útil sobre erro binário ou de ponte

## 15. O que não deve ser modularizado ainda

Não modularizar ainda:

- `editorTextosExportarPdfAtual()`
- `editorTextosPrepararPdfNoAppPdf()`
- `editorTextosAssinarPdfViaPonteLocal()`
- `editorTextosBaixarBlob()` enquanto faz parte do fluxo de assinatura/exportação
- contratos `Blob`, `FormData`, `rawBody` e `responseType: "blob"`
- integração com ponte local e certificado instalado
- o cabeçalho `X-Generated-Filename`
- qualquer reutilização prematura desses trechos em helper novo

## 16. Lacunas restantes

Ainda faltam auditorias finas para:

- o restante do editor de textos fora do fluxo de PDF
- possíveis caminhos de impressão/exportação alternativa
- a ponte local completa e seus contratos auxiliares
- eventual integração com assinatura externa ou campos de assinatura adicionais
- rotas backend específicas do editor que não apareçam neste recorte

## 17. Próxima auditoria fina recomendada

A próxima auditoria fina recomendada é o inventário separado do restante do Editor de Textos fora do pipeline de PDF, para separar o que é editor puro do que é exportação/assinatura/ponte local.

## 18. Conclusão

Este subdomínio deve permanecer congelado. Ele concentra transportes binários, multipart, contrato de nome de arquivo e integração com ponte local. É um dos pontos com menor tolerância a mudanças no sistema inteiro.
