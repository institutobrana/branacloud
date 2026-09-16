# G.4C.2D - Diagnostico probatorio do preview

## 1. Resultado
- BLOQUEADA POR FALTA DE ACESSO AO RUNTIME AUTENTICADO.

## 2. Ambiente
- frontend: `http://127.0.0.1:5173/app`
- backend API: `http://127.0.0.1:8001`
- backend asset: `http://127.0.0.1:8000` e `http://127.0.0.1:8001`
- banco: `postgresql://postgres:1234@localhost:5432/brana_saas`
- tenant: `15`
- proxy: `vite.config.js` com proxy de `/api` para `http://localhost:8001`

## 2.1 Porta 5173
| Item | Valor |
|---|---|
| PID | `26148` |
| processo | `node.exe` |
| comando | `"node" "D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\node_modules\.bin\\..\vite\bin\vite.js" --host 0.0.0.0 --port 5173 --strictPort` |
| diretório | `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react` |
| início | `04/08/2026 13:13:56` |
| pertence ao projeto | sim |

## 2.2 Instrumentação
- presente no código-fonte local
- `__BRANA_SIMBOLO_PREVIEW_DIAGNOSTICO__`: presente
- `data-preview-symbol-id`: presente
- `data-preview-record-source`: presente
- `data-preview-resolved-source`: presente
- `data-preview-load-state`: presente
- `onLoad/onError`: presentes
- acesso direto ao arquivo fonte pelo servidor 5173: `404`

## 3. Evidencia probatoria
- Attachment, Coroa e Apicectomia possuem referencias de imagem no banco
- os arquivos fisicos existem
- as URLs diretas dos assets respondem `200 image/bmp`
- o processo correto da porta 5173 pertence ao `frontend-react` do repositório
- nao foi possivel observar o modal em uma sessao autenticada
- nao foram capturados:
  - objeto real entregue ao modal
  - `src` real do `<img>`
  - `Request URL` do navegador
  - `naturalWidth`
  - `naturalHeight`

## 4. Classificacao
- tipo: BLOQUEADA POR FALTA DE ACESSO AO RUNTIME AUTENTICADO
- justificativa: a origem de dados, o processo da porta 5173 e a instrumentacao local foram validados, mas a inspecao do modal autenticado e do `<img>` real nao foi obtida nesta fase

## 5. Arquivos potencialmente envolvidos
- `frontend-react/src/features/simbolosGraficos/components/SimboloGraficoCreateModal.jsx`
- `frontend-react/src/features/simbolosGraficos/model/simboloGraficoLibraryMapper.js`
- `frontend-react/src/features/simbolosGraficos/components/SimboloGraficoEspecialidadeField.jsx`
- `frontend-react/vite.config.js`
- `backend/main.py`
- `backend/routes/cadastros_routes.js`

## 6. Observacao
- nenhuma correcao funcional foi aplicada nesta fase
