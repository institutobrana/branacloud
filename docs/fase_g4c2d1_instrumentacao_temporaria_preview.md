# G.4C.2D.1 - Instrumentacao temporaria do preview

## Objetivo
Instrumentar temporariamente o preview do modal Altera de Simbolos graficos, somente em DEV, para expor a cadeia real de dados quando o modal abrir.

## Arquivos instrumentados
- `frontend-react/src/features/simbolosGraficos/components/SimboloGraficoCreateModal.jsx`

## Dados expostos
- resumo seguro do registro em modo edit
- `resolverInput`
- `resolverOutput`
- `imgSrcAttribute`
- `imgCurrentSrc`
- `imgComplete`
- `imgNaturalWidth`
- `imgNaturalHeight`
- `imgLoadState`
- resumo abreviado de `imagemCustom` quando presente

## Protecao DEV
- toda a instrumentacao fica sob `import.meta.env.DEV`
- nao ha painel visual permanente
- nao ha alteracao da ordem de resolucao da imagem
- nao ha fallback novo
- nao ha chamada de API adicional

## Seguranca
- nao expõe token
- nao expõe cookie
- nao expõe senha
- nao expõe DSN
- nao expõe dados de paciente
- nao expõe base64 completo em atributo

## Testes
- `node --test frontend-react/tests/simboloGraficoCreateModal.test.js`
- `node --test frontend-react/tests/simboloGraficoPixelEditorUtils.test.js`

## Build
- `cmd /c npm.cmd run build`

## Passos para captura
1. reiniciar o Vite
2. abrir a sessao autenticada funcional
3. abrir `Configuracoes -> Simbolos graficos`
4. selecionar `Attachment`
5. clicar `Altera`
6. abrir o console
7. executar `window.__BRANA_SIMBOLO_PREVIEW_DIAGNOSTICO__()`
8. abrir `Network`
9. filtrar por `int_attach.bmp` ou `Img`
10. registrar `Request URL`, `Status`, `Content-Type` e `Remote Address`

## Nenhuma correcao aplicada
- esta microfase apenas prepara observabilidade do runtime autenticado
