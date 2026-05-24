function protNomeArquivoBase(titulo){const base=String(titulo||"relatorio_protetico").trim()||"relatorio_protetico";const limpo=base.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9_-]+/g,"_").replace(/_+/g,"_").replace(/^_+|_+$/g,"").toLowerCase();return limpo||"relatorio_protetico"}
function protFormatoInfo(formato){const f=String(formato||"").toUpperCase();if(f==="HTML")return{ext:"html",mime:"text/html"};if(f==="RTF")return{ext:"rtf",mime:"application/rtf"};if(f==="XLS")return{ext:"xls",mime:"application/vnd.ms-excel"};if(f==="TXT")return{ext:"txt",mime:"text/plain"};if(f==="CSV")return{ext:"csv",mime:"text/csv"};return{ext:"pdf",mime:"application/pdf"}}
function protCsvEsc(v){const s=String(v??'');return /[;"\n\r]/.test(s)?`"${s.replace(/"/g,'""')}"`:s}
if(typeof window!=="undefined")window.protNomeArquivoBase=protNomeArquivoBase;
if(typeof window!=="undefined")window.protFormatoInfo=protFormatoInfo;
if(typeof window!=="undefined")window.protCsvEsc=protCsvEsc;