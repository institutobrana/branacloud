# Política de importação RTF — Editor de Textos

analyze_rtf_capabilities(content) em backend/routes/editor_textos_routes.py
é a decisão central antes da conversão em memória pelo endpoint
POST /editor-textos/import/rtf. A política independe da extensão de origem;
RTF detectado dentro de .txt usa a mesma análise que .rtf.

## Classes e decisão

| Classe | Decisão | Contrato |
| --- | --- | --- |
| RTF_SAFE_TEXTUAL | Importar | Texto, parágrafos/quebras e tokens literais, sem controles não reconhecidos nem estruturas que o conversor descarte. |
| RTF_PARTIAL_FORMATTING | Importar com aviso | Conteúdo textual permanece; diferenças cosméticas conhecidas são enumeradas em cosmetic_loss_features e warnings. |
| RTF_UNSUPPORTED_STRUCTURED | Bloquear | Campo Word, tabela, imagem/objeto, lista, cabeçalho/rodapé, revisão ou conteúdo proprietário cuja semântica/estrutura o caminho atual não preserva. |
| RTF_INVALID | Rejeitar | Cabeçalho, agrupamento, escape, tamanho ou codificação inválidos/não suportados. |

Não se decide por substring solta: um scanner acompanha grupos, destinos,
escapes e palavras de controle. Campos são classificados pelo conteúdo de
fldinst (imagem vinculada, merge field, hyperlink, campo dinâmico ou
desconhecido); no caminho atual, todos continuam bloqueados porque o conversor
não preserva com fidelidade a semântica e o resultado desses campos.

## Recursos

| Recurso | Tratamento atual |
| --- | --- |
| Texto, \par, \line, Unicode e escapes CP-1252 | Preservados pelo conversor validado |
| Token literal <<...>> | Texto; não é confundido com campo RTF |
| \tab | Aproximado como espaço em HTML; aviso de perda de tab stop |
| Fonte/tamanho, cores/estilos inline, alinhamento, recuos/espaçamento, tabs, idioma/direção LTR, geometria física | Aviso de variação cosmética |
| Texto RTL, hidden/revision, recursos não reconhecidos | Bloqueio conservador |
| \field e instruções INCLUDEPICTURE, MERGEFIELD, HYPERLINK, campos dinâmicos/desconhecidos | Bloqueio; sem descarte silencioso |
| Tabelas (\trowd, \intbl, \cellx, \trgaph, \trleft, células/linhas) | Bloqueio |
| \pict, objetos, imagens vinculadas e conteúdo de imagem WPTools | Bloqueio |
| Listas, quebras/seções, cabeçalho/rodapé, notas e revisões | Bloqueio |
| Controle não reconhecido fora de destinos ignoráveis | Bloqueio conservador |

Na conversão de geometria para Oasis, as margens superior/inferior do RTF
definem a área do corpo. Como o importador não cria conteúdo de cabeçalho ou
rodapé, os offsets Oasis `header` e `footer` são zero; isso evita reservar a
maior parte ou toda a área útil em páginas pequenas (por exemplo, modelos de
etiqueta).

### Charset e codepage

`\fcharsetN` é metadado da fonte e não substitui a codepage ANSI do
documento. O conversor mantém o decode de escapes ANSI pela codepage do
documento (Windows-1252; `\ansicpg` diferente continua bloqueado) e aceita
os charsets de fonte conhecidos observados nos modelos EasyDental: 0, 1, 2,
161, 162, 163, 177, 178, 186, 204 e 238. Um `\fcharset` desconhecido ou
fonte selecionada sem charset verificável continua sendo rejeitado.

## Amostras reais auditadas

Em leitura somente, Agradecimento 1.txt foi classificado
RTF_PARTIAL_FORMATTING, importável com aviso e sem perda estrutural detectada.
Agradecimento 1.rtf foi classificado RTF_UNSUPPORTED_STRUCTURED: há imagem
vinculada por campo INCLUDEPICTURE, tabela, dados de imagem WPTools, listas e
cabeçalho/rodapé. O arquivo continua bloqueado. As versões compartilham tema,
mas os textos/tokens extraídos não são equivalentes byte a byte nem textualmente.

O filtro atual permanece .docx,.txt,.rtf; .mod segue excluído. Um arquivo
com extensão .txt cujo conteúdo seja RTF sempre passa pela mesma política RTF.
Nenhuma capacidade de importar tabelas, imagens, WPTools ou outros recursos
estruturais foi adicionada.
