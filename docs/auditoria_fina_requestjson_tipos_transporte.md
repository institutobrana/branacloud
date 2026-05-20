# Auditoria fina documental — usos especiais de requestJson() por tipo de transporte

## 1. Resumo executivo

Esta auditoria fina isola apenas os usos especiais de `requestJson()` no `frontend/app.js`, deixando de lado o grande volume de chamadas JSON simples. O foco aqui é transporte sensível: `blob`, `rawBody`, `FormData`, headers adicionais, retry protegido e os poucos fluxos de sessão que têm tratamento especial.

A leitura principal é que os casos especiais são poucos, mas concentram muito risco. Eles aparecem sobretudo em exportação/download, editor de textos, envio de arquivos, superadmin e proteção administrativa. Esses usos são os que mais sofrem quando o contrato de transporte muda.

## 2. Escopo e branch

- Branch confirmada: `modularizacao-segura-fase-1`
- Projeto: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Etapa: exclusivamente documental e de leitura
- Nenhuma alteração de código foi feita

## 3. Arquivos analisados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules`
- `frontend/js/utils`
- `backend/routes`
- Documentos anteriores de auditoria apenas como contexto

## 4. Critério de uso especial de transporte

Foram considerados usos especiais os trechos que apresentam pelo menos um destes sinais:

- `responseType: "blob"`
- `rawBody`
- `FormData`
- `responseType: "text"` ou `responseType: "raw"`
- headers adicionais além do fluxo padrão
- retry com `X-Protected-Grant`
- controle de sessão que sai do caminho mais comum de JSON simples
- chamadas que dependem de download/exportação em vez de listagem/gravação normal

## 5. Tabela consolidada dos usos especiais encontrados

| Categoria | Função/bloco | Rota aproximada | Transporte especial | Domínio | Risco | Observação |
|---|---|---|---|---|---|---|
| blob / download / exportação | `saExportarUsuariosCsv()` | `GET /superadmin/usuarios/export.csv?...` | `responseType: "blob"` | superadmin | Crítico | Exporta CSV e lê `content-disposition`; qualquer mudança de formato quebra o download |
| blob / download / exportação | `editorTextosExportarPdfAtual()` | `POST /editor-textos/exportar-pdf` | `responseType: "blob"` | editor de textos | Alto | Gera PDF binário; fluxo muito sensível a contrato de resposta |
| blob / download / exportação | `editorTextosPrepararPdfNoAppPdf()` | `POST /editor-textos/preparar-pdf-acrobat` | `rawBody` + resposta binária | editor de textos | Alto | Prepara PDF para abrir em aplicativo local; mistura arquivo e rede |
| blob / download / exportação | `editorTextosAssinarPdfViaPonteLocal()` | `POST /editor-textos/assinar-pdf` | `rawBody` + `responseType: "blob"` | editor de textos | Crítico | Assinatura de PDF com retorno binário; um contrato frágil e de alto impacto |
| rawBody | `protEnviarEmailRelatorio()` | `POST /relatorios/enviar-email` | `rawBody: FormData` | protéticos / relatórios | Alto | Envia arquivo anexado; depende de multipart/arquivo e de leitura correta do backend |
| rawBody | `editorTextosPrepararPdfNoAppPdf()` | `POST /editor-textos/preparar-pdf-acrobat` | `rawBody: FormData` | editor de textos | Alto | Junta PDF e metadados em formulário multipart |
| rawBody | `editorTextosAssinarPdfViaPonteLocal()` | `POST /editor-textos/assinar-pdf` | `rawBody: FormData` | editor de textos | Crítico | Assinatura local via ponte; falha pequena aqui costuma quebrar o fluxo inteiro |
| FormData | `protEnviarEmailRelatorio()` | `POST /relatorios/enviar-email` | `FormData` | relatórios / e-mail | Alto | O anexo é um arquivo binário; o contrato não é JSON simples |
| FormData | `editorTextosPrepararPdfNoAppPdf()` | `POST /editor-textos/preparar-pdf-acrobat` | `FormData` | editor de textos | Alto | Fluxo de preparação/ponte local com arquivo anexado |
| FormData | `editorTextosAssinarPdfViaPonteLocal()` | `POST /editor-textos/assinar-pdf` | `FormData` | editor de textos | Crítico | Usa múltiplos campos e arquivo assinado; muito sensível a quebra de contrato |
| FormData | Fluxos auxiliares de exportação/assinatura do editor | `POST /editor-textos/...` | `FormData` | editor de textos | Alto | Há mais de um trecho com formulário multipart no mesmo domínio |
| headers adicionais | Retry protegido via `requestJson()` | várias rotas protegidas | `X-Protected-Grant` | módulos protegidos | Crítico | Só entra após erro protegido e desbloqueio administrativo |
| headers adicionais | `unlockProtectedGrant()` | `POST /auth/protected/unlock` | `Authorization` + payload especial | auth / admin | Crítico | Contrato sensível de desbloqueio; depende de senha e sessão válidas |
| auth / sessão com tratamento especial | `carregarSessao()` | `GET /me` | `auth=true` | sessão / menu / permissões | Crítico | Não é binário, mas é o pivô que mantém o sistema vivo |
| auth / sessão com tratamento especial | `startSessionHeartbeat()` | `GET /me` | `auth=true` | sessão / heartbeat | Crítico | Revalida sessão periodicamente; se quebrar, o frontend fica instável |
| skipSessionGuard | Nenhum callsite explícito | - | - | - | - | O parâmetro existe no helper, mas não foi encontrado uso direto fora do próprio contrato |
| text / raw | Nenhum callsite explícito | - | - | - | - | O suporte existe em `requestJsonBase()`, mas não apareceu como uso especial documentável no `app.js` |

## 6. Categorias mínimas obrigatórias

### 6.1 blob / download / exportação

Encontrado em:

- `saExportarUsuariosCsv()`
- `editorTextosExportarPdfAtual()`
- `editorTextosAssinarPdfViaPonteLocal()`

Motivo aparente:

- exportação de arquivo binário
- download do navegador
- leitura de cabeçalho de nome de arquivo
- integração com fluxo de PDF/binário

Fragilidade:

- a resposta deixa de ser JSON simples
- qualquer troca de MIME type ou cabeçalho quebra o download
- o frontend depende de `Blob` e de nomes de arquivo derivados do backend

### 6.2 rawBody

Encontrado em:

- `protEnviarEmailRelatorio()`
- `editorTextosPrepararPdfNoAppPdf()`
- `editorTextosAssinarPdfViaPonteLocal()`

Motivo aparente:

- envio multipart/form-data
- anexos binários
- ponte local com arquivos PDF

Fragilidade:

- o helper precisa preservar o corpo cru
- o backend precisa aceitar multipart sem tentar tratar como JSON
- um ajuste no transporte quebra e-mail, assinatura ou preparação de PDF

### 6.3 FormData

Encontrado nos mesmos fluxos acima, com destaque para o editor de textos.

Motivo aparente:

- anexar PDF, nome de arquivo, assunto e corpo do e-mail
- transportar dados não serializáveis em JSON simples

Fragilidade:

- contrato binário/multipart muito sensível a pequenas mudanças
- erro no nome do campo ou no tipo de resposta derruba o fluxo inteiro

### 6.4 text / raw

Não foram encontrados callsites explícitos de `responseType: "text"` ou `responseType: "raw"` como uso especial documentável no `frontend/app.js` durante esta leitura.

Interpretação documental:

- o suporte existe no helper
- mas o app, neste recorte, usa principalmente `json`, `blob` e `rawBody`/`FormData`

### 6.5 headers adicionais

Encontrado em:

- retry protegido com `X-Protected-Grant`
- desbloqueio via `POST /auth/protected/unlock`

Motivo aparente:

- reexecutar chamadas protegidas sem pedir senha de novo
- validar o módulo e a clínica do grant

Fragilidade:

- se o header mudar, o retry falha
- se o backend mudar o formato do grant, o fluxo protegido quebra

### 6.6 grant protegido

Encontrado no caminho:

- `requestJson()`
- `ensureProtectedGrant()`
- `unlockProtectedGrant()`

Motivo aparente:

- habilitar módulos protegidos sem interromper o usuário

Fragilidade:

- depende de erro protegido bem formatado
- depende de sessão válida e senha administrativa correta
- depende de cache de grant por módulo

### 6.7 auth / sessão com tratamento especial

Encontrado em:

- `carregarSessao()` com `GET /me`
- `startSessionHeartbeat()` com `GET /me`

Motivo aparente:

- manter o sistema autenticado e o menu consistente
- renovar a leitura do perfil e da permissão

Fragilidade:

- se `/me` mudar de contrato, o frontend perde estado global
- se a sessão cair, o sistema volta para login/setup/erro

### 6.8 skipSessionGuard

Não há uso explícito encontrado no `frontend/app.js` além do parâmetro existir no helper.

## 7. Grupos mais frágeis

1. `editor de textos` com `blob` + `rawBody` + `FormData`
2. `superadmin` com exportação CSV em `blob`
3. `relatórios` com envio de e-mail de arquivo em `FormData`
4. retry protegido com `X-Protected-Grant`
5. fluxo de sessão com `GET /me`

## 8. Grupos ligados a exportação/download

- `saExportarUsuariosCsv()`
- `editorTextosExportarPdfAtual()`
- `editorTextosAssinarPdfViaPonteLocal()`
- `protSalvarRelatorioArquivo()` como fluxo adjacente de exportação, embora o transporte especial esteja no envio do e-mail do relatório

## 9. Grupos ligados a licença/admin/superadmin

- `saExportarUsuariosCsv()`
- retry protegido via grant
- `unlockProtectedGrant()`
- `carregarSessao()` e `startSessionHeartbeat()` como base da autorização administrativa

## 10. Grupos ligados a sessão/grant protegido

- `requestJson()` ao detectar erro protegido
- `ensureProtectedGrant()`
- `unlockProtectedGrant()`
- `carregarSessao()`
- `startSessionHeartbeat()`

## 11. Lacunas restantes

Ainda faltam auditorias finas para:

- chamadas especiais do editor de textos que não apareceram nesta leitura mas podem surgir em subfluxos novos
- possíveis novas exportações binárias em módulos clínicos ou financeiros
- eventuais usos de `responseType: "text"` ou `responseType: "raw"` caso passem a existir no futuro
- diferenciação entre casos de upload local, assinatura local e exportação remota do editor

## 12. O que não deve ser modularizado ainda

Não modularizar ainda:

- `requestJsonBase()`
- `requestJson()`
- exportações/downloads em `blob`
- `rawBody` e `FormData`
- retry protegido com `X-Protected-Grant`
- `GET /me` e o ciclo de sessão
- quaisquer fluxos do editor de textos que lidem com PDF, assinatura ou ponte local
- superadmin/exportação CSV até o contrato binário ficar estável

## 13. Próxima etapa documental recomendada

A próxima auditoria fina recomendada é uma leitura separada do editor de textos e de suas exportações/assinatura, porque esse é o maior bloco com transporte especial e risco de quebra de contrato.

## 14. Conclusão

Os usos especiais de `requestJson()` existem, mas estão concentrados em poucos pontos. Eles merecem congelamento documental porque combinam arquivo binário, multipart, headers adicionais e retry protegido. São exatamente os fluxos que menos toleram refatoração apressada.
