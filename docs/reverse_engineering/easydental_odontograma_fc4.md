# FC4 — dossiê técnico EasyDental / odontograma

STATUS = P1_R1_MANUAL_EVIDENCE_RECONCILED_FOR_REVIEW
CURRENT_BASELINE_P1_R1 = 6e7cdd5de3551f4d1b120f5d0da579e364746d38.
Autoridade vigente posterior: seção 14 e contratos P1.R1. Seções 1–13 preservam
o estado P0D/P0H, inclusive inferências/propostas superadas, não normas conflitantes.
Baseline Brana: 1e8f31c2ce9e313a425bd4948b93dc8f01d120e1.
CANONICAL_FLOW_STATUS = PROVEN_WITH_NON_BLOCKING_GAPS.
Escopo P0D: preservação documental + revalidação direcionada; nenhuma gravação,
execução de binário, instrumentação nova, trace novo ou modificação de runtime.
CURRENT_BASELINE = b47114f9cc60c54981391c7c23baa21d83a0aeb6.
As seções 1–12 e apêndices preservam o dossiê P0D. A seção 13 registra a evolução
P0F/P0G/P0G.R1/P0G.R2 consolidada em P0H, sem nova execução dessas investigações.

## 1. Proveniência e confiança

Este dossiê preserva o conhecimento disponível das fases P0/P0A/P0B/R2/R3/R4/P0C
e do pedido P0D. Não afirma que todas as provas anteriores foram reexecutadas
nesta rodada. Informação de relatório anterior conserva essa origem e confiança.
P0B.R1 não dispõe de relatório exclusivo recuperado: não inventar detalhes.

PROVEN: evidência direta ou convergente identificada. STRONG: sequência técnica
forte, sem prometer caminhos universais. PARTIAL: candidato/limite explícito.
UNPROVEN: sem prova suficiente. Estar documentado não promove confiança.
Tipos: RUNTIME, USER_OBSERVATION, BINARY, RESOURCE, SQL, SCHEMA, DATA, LOG, MANUAL,
HISTORICAL_DOCUMENT, INFERENCE. Não transformar INFERENCE em contrato implementável.

## 2. Executável e identidade reproduzida em P0D

- SOURCE: C:\EDS70\EDS70.exe; FileVersion/ProductVersion: 7.6.0.1001; ProductName: EasyDental.
- SIZE: 13.543.424 bytes.
- SHA-256: 9e0dfd33d89dd62f08bdf6ad35f2cdbc79ae119fc32c84f035ba2ed50e6a54bb.
- PE Machine 0x014C: x86; ImageBase 0x400000; Delphi nativo/VCL.
- Sections (RVA / raw size): CODE 0x1000/6992384; DATA 0x6AD000/76800;
  BSS 0x6C0000/0; .idata 0x6C4000/18432; .tls 0x6C9000/0;
  .rdata 0x6CA000/512; .reloc 0x6CB000/475648; .rsrc 0x740000/5978624.
- 329 ocorrências de assinatura TPF0 (contagem de bytes, não afirmar 329 forms únicos).
- Imports pertinentes: EDCAP70.DLL, EDCAP70RTL.DLL, crp32dll.dll, EasyPhLb.dll,
  EasyCtrl.dll, GeraArqHTML; Win32 GDI/User32/Comctl32, OLE, Wininet/Wsock32.
  Importar DLL não prova papel clínico; inventário anterior não foi repetido.
- Ferramentas existentes P0D: Python, pefile, Pillow; capstone/distorm3/iced_x86
  não disponíveis nesse Python. Sem instalação. Leitura PE + bytes + decodificação
  pontual de operandos x86, não decompilação completa.

VA = endereço virtual com esse ImageBase; file offset é posição física. Nunca
subtrair ImageBase e chamar o resultado de file offset sem mapear a seção.

## 3. Fontes preservadas

| SOURCE | Tipo | Uso/limite |
|---|---|---|
| C:\EDS70\EDS70.exe | BINARY/RESOURCE/SQL | Executável revalidado; somente leitura |
| C:\EDS70\Help\Manual_EDS70_CAP_02.pdf | MANUAL | Fonte histórica R2–R4; 3.554.441 bytes, existência reconfirmada |
| C:\EDS70\Help\Manual_EDS70_CAP_05.pdf | MANUAL | Marcação/odontograma; 910.412 bytes, existência reconfirmada |
| C:\EDS70\eds70.dsn | Configuração | Conexão histórica comprovada; credenciais omitidas |
| C:\EDS70\Temp\INSPIRON-15_eds70.log | LOG | Fonte histórica; 293.118 bytes na verificação; não truncar/logar segredos |
| Y:\EDS70\Dados\eds70.sql | SCHEMA | DDL histórico; 106.681 bytes; não representa sozinho algoritmo |
| Y:\EDS70\Dados\eds75_*.sql | SCHEMA | Histórico de builds, não substituir schema vivo automaticamente |
| D:\BRANA ARQUIVOS\BRANA CLOUD ARQUIVO MORTO\EASYDENTAL_BACKUP_ATUAL | Histórico | Fonte externa anterior; não copiar backups ao repo |
| Arquivo Morto / candidatos pertinentes | HISTORICAL_DOCUMENT | Inventário pertinente encerrado na R4; sem nova varredura genérica |
| Relatos assistidos P0B/R2–R4 | USER_OBSERVATION | Slot vazio, multisseleção, modal e Grava esta/todas; sem inventar trace |

Builds presentes em Dados: eds75_build_0809_1..8.sql; 090415_1/2; 090505;
090514_1/2; 090617; 091123; 100115_1/2/3. Não executar esses scripts.

Instância anterior: PID 10732, C:\EDS70\EDS70.exe, janela EasyDental 7.6.
DSN apontava SQL Server / DELL_SERVIDOR\EDS70 / database eds70. Isso é evidência
histórica de conexão real, não nova verificação de PID ou login P0D. Usuário escolheu
registro para observação; dados pessoais/credenciais não reproduzidos aqui.
Falha de espaço PRIMARY na inserção USRLOG = KNOWN_ENVIRONMENT_CONDITION.
Não confundir audit write USRLOG com mutação clínica; não corrigir filegroup.

Snapshot anterior R4 preservado: catálogo válido sem NROSIM NULL/0/orphan, 698
itens de tabela e 81 símbolos na evidência relatada. Não é consulta DB atual P0D.
Dados históricos provaram relações, mas dados isolados não provam algoritmo.

## 4. Formulário de propriedades

Classe TfrPropriedadesInterv; resource TFRPROPRIEDADESINTERV, RT_RCDATA (10),
RVA 0xAD43C0, tamanho 7.231 bytes, prefixo TPF0. Reconfirmado em P0D.

Componentes reconfirmados por bytes do resource: btOk, btGravatodas, btCancela,
lcTabela, lcPrestador, lcIntervencao, lcStatus, roRegiao, meDatacad, meDatafin,
mmObserv, mePreco, cxOrcamento, meValorRepasse, pbSimbolo, roTimeStampIns,
roTimeStampUpd. O texto/modal anterior também contém tabela, cirurgião, intervenção,
região, situação, marcação, finalização, observações, inclusão e alteração.

| Método | VA | File offset | Origem/confiança |
|---|---|---|---|
| FormGravaTodasClick | 0x663D28 | 0x263128 | Handler literal no resource + R3/R4, PROVEN |
| FormOk | 0x663E44 | 0x263244 | Método/VMT da análise anterior, STRONG no call graph |
| FormCancel | 0x666A48 | 0x265E48 | Método anterior; não literal no resource, STRONG |
| pbSimboloPaint | 0x666A60 | 0x265E60 | Handler literal no resource, PROVEN |
| EscolheIntervencao | 0xA94138 | Referência VA | Análise anterior, STRONG |

FormOk/FormCancel não aparecerem literalmente nesse DFM não contradiz binding
herdado/método VMT. Não alegar que os quatro handlers foram lidos por nome no DFM.
pbSimboloPaint é preview do modal, não todo renderer odontológico.

## 5. Gravação e seleção interna

FormOk: entrada → validações → tratamento/intervenção → INSERT/UPDATE INTERVENCAO
→ writer de marcação → HISTORICO → transação → refresh → avanço/fechamento.
Referências preservadas: +0x3C2, +0x3C0, +0x56C; 0x6646DE, 0x66474C, 0x664777;
refresh 0xA94204. Esses offsets não foram renomeados por inferência P0D.

FormGravaTodasClick: índice atual/último → chamada VMT +0x134 (FormOk) → repetição.
Grava esta grava o contexto corrente e avança ao próximo marcado. Grava todas
reutiliza esse caminho. Transações de FormOk, não única transação externa provada.
Continuidade universal após erro não provada; não inventar comportamento.

Seleção interna: registros inline stride 12 bytes; slot inicial, final e flag
processado. +0x3D4 é índice/pointer corrente na análise; +0x3C8 último;
+0x3C4 delimita os trechos por arcada para Segmento. Referências:
dispatcher 0x66322C; flag processado 0x6645F4; construtor 0x662D08;
caller FormShow 0x661FDB; tabela de despacho 0x662D8E.

| Tipo | Entrada construtor | Persistência/render |
|---|---|---|
| FACE (1) | 0x662DAA | Writer FACE 0x6650AC; cinco flags |
| DENTE (2) | 0x662E2C | Elemento individual |
| GRUPO (3) | 0x662E95 | Runs contíguos, quebra em lacuna/16–17 |
| ARCADA (4) | 0x66312F | [1,16] / [17,32], um contexto por arcada |
| GERAL (5) | 0x663201 | Sem writer DENTE/FACE no caminho |
| SEGMENTO (6) | 0x662FBF–0x66312A | União de runs por arcada |

SEGMENTO: writer 0x6653D4 percorre os trechos do contexto sob mesmo NROINTPAC,
marca processados/avança até fronteira; referência adicional 0x665CEC.
Região 0xA9CB7C; resolução de numeração do tratamento 0xA9C490; fallback de
numeração referenciado em 0xA9D2E4. Não identificar slot com FDI automaticamente.
Grupo = uma intervenção por run; Segmento = uma por arcada com vários runs;
Arcada = uma por arcada completa, 16 associações DENTE. Lacunas de Segmento não
recebem associação/render. Geral não obriga DENTE/FACE.

## 6. Faces — prova binária reproduzida P0D

SHA do executável deve coincidir com seção 2 antes de reutilizar endereços.
FACE_SLOT_ORIENTATION_TABLE_STATUS = PROVEN.

Tabela em VA 0xABE080 (file offset 0x6BC680): cinco DWORDs little-endian:
0xA9D36C, 0xA9D398, 0xA9D3C4, 0xA9D3F0, 0xA9D41C.

| Campo | VA / file offset | 32 bytes ASCII |
|---|---|---|
| FACE1 | 0xA9D36C / 0x69C76C | VVVVVVVVVVVVVVVVLLLLLLLLLLLLLLLL |
| FACE2 | 0xA9D398 / 0x69C798 | MMMMMMMMDDDDDDDDMMMMMMMMDDDDDDDD |
| FACE3 | 0xA9D3C4 / 0x69C7C4 | PPPPPPPPPPPPPPPPVVVVVVVVVVVVVVVV |
| FACE4 | 0xA9D3F0 / 0x69C7F0 | DDDDDDDDMMMMMMMMDDDDDDDDMMMMMMMM |
| FACE5 | 0xA9D41C / 0x69C81C | OOOOOIIIIIIOOOOOOOOOOIIIIIIOOOOO |

V vestibular, L lingual, P palatina, M mesial, D distal, I incisal, O oclusal.
Tabela de faixas exata está no contrato. O teste P0D comparou as cinco sequências
com as 32 posições esperadas e obteve True. Converter 0xA9D440 (file 0x69C840):
bytes 8B 04 85 80 E0 AB 00 = MOV EAX,[EAX*4+0xABE080], selecionando a sequência;
busca caractere pelo slot (caminho de substring/cópia) dentro de loop de cinco
flags. Em 0x66339A, E8 A1 A0 43 00 decodifica CALL 0xA9D440.
Writer FACE 0x6650AC é referência de persistência anterior; não se encontrou CALL
direto ao converter no intervalo de 900 bytes examinado P0D. Não inventar esse CALL.

Reprodução somente leitura (não gera arquivo nem executa EXE):

```python
import pefile, struct, hashlib
data = open(r'C:\EDS70\EDS70.exe', 'rb').read()
assert hashlib.sha256(data).hexdigest() == '9e0dfd33d89dd62f08bdf6ad35f2cdbc79ae119fc32c84f035ba2ed50e6a54bb'
pe = pefile.PE(data=data)
def read_va(va, size):
    off = pe.get_offset_from_rva(va - pe.OPTIONAL_HEADER.ImageBase)
    return data[off:off + size]
ptrs = struct.unpack('<5I', read_va(0xABE080, 20))
expected = ['V'*16+'L'*16, 'M'*8+'D'*8+'M'*8+'D'*8,
            'P'*16+'V'*16, 'D'*8+'M'*8+'D'*8+'M'*8,
            'O'*5+'I'*6+'O'*10+'I'*6+'O'*5]
assert [read_va(p, 32).decode('ascii') for p in ptrs] == expected
assert bytes.fromhex('8b048580e0ab00') in read_va(0xA9D440, 150)
assert read_va(0x66339A, 5) == bytes.fromhex('e8a1a04300')
```

Importador Brana com conversão fixa FACE1..5 não é fonte dessa prova. Nenhum dado
importado foi corrigido; eventual compatibilidade é decisão futura de design.

## 7. Símbolos e render recuperado

INTERVENCAO.(NROTAB,NROINT) → TAB_PRC_ITEM.NROSIM → _SIMBOLO_ODONTO → TIPMARCA/
TIPSIMB → BITMAP1/BITMAP2/BITMAP3/ICONE → alvo → status/cor.
Schema de símbolo inclui descrição, especialidade, sobreposição e recursos.
TIPSIMB e TIPMARCA são conceitos distintos; ícone não é compositor clínico.

Referências: preparação recursos/DENTE 0x6654C8; pintura faces 0xA87D58;
refresh 0xA94204; arc_faces. Aplicação de cores/configurações:
Observada 0xA87F27/0xA87F55 (CorObserv); Realizar 0xA87F88/0xA87FB6
(CorRealizar); Realizada 0xA87FE6/0xA88014 (CorRealizado).
Defaults históricos verde/azul/vermelho; configuráveis.

FACE pinta faces; DENTE no elemento; GRUPO compõe run; SEGMENTO compõe seus runs
sem preencher gaps; ARCADA superior/inferior inteira; GERAL área geral da boca.
Detalhes de composição e bitmap pixel-a-pixel são não bloqueantes para contrato.
Próteses podem alterar aparência/ocultar base; não universalizar simples overlay
nem inventar mudança anatômica persistida por causa de um exemplo visual.

Símbolo inválido: lookup 0x550DE0 retorna -1; leitura 0x550E30 indexa registro
de 44 bytes. Análise R4 de 16 callers não mostrou fallback seguro universal.
Catálogo válido anterior sem referências nulas/zero/orphan. Não provocar inválido
em banco real. Gap não bloqueante fora do contrato válido; sem fallback inventado.

## 8. Orçamento, financeiro e histórico

TfrOrcamento.FormLoadData 0x783FC4: caminho em 0x784338–0x784339 descarta status
Observada; 0x784351–0x784353 descarta ORCAMENTO diferente de zero. Usa própria
INTERVENCAO; não INSERT financeiro imediato simplesmente por gravar intervenção.

Modal Financeiro: mePreco→VALOR_PACIENTE; meValorRepasse→VALOR_REPASSE;
meDataRepasse→DATA_REPASSE; cxOrcamento (“Não incluir”)→ORCAMENTO;
edGlosa→COD_GLOSA; edMsgAutorizacao→MSG_AUTOR. Aprovação posterior gera contextos
CCPACIENTE/parcelas separados. Não generalizar integração financeira além disso.

Histórico helper 0x665E20: situação 2 insere; edição atualiza data/auditoria;
situação diferente remove vínculo no caminho recuperado. Finalização adicional
0x668244: STATUS=2 + DATFIN + HISTORICO + refresh. Fases intermediárias podem
registrar histórico sem finalizar integralmente.

## 9. Exclusão, interrupção e cópia

Hard delete 0xA8A4B0; referências 0xA8A516–0xA8A53D; helper 0x524010 de
autorização/convênio. Limpezas CustomData/HISTORICO, cascade DENTE/FACE/HISTORICO,
refresh/auditoria. Há verificações de permissão, tratamento finalizado, orçamento
aprovado e situação realizada; não afirmar exclusão sempre permitida.

Orçamento consultado de INTERVENCAO perde item deletado; não há reversão automática
de parcelas comprovada. Aprovação/financeiro separado: risco deve aparecer no
futuro contrato de exclusão, não extrapolar toda contabilidade.

Não foi encontrada operação dedicada Interromper intervenção ou Repetir
intervenção no conjunto auditado dessa versão (forms/resources/status/manual/SQL).
Interromper é tratamento. “Repetir” encontrado na Agenda não prova ação clínica.
Conclusão negativa limitada à versão/conjunto auditado, não todas as versões.

Cópia: FormSaveRecord 0x65BFB0 → helper 0x65CC34 → INSERT SELECT INTERVENCAO/DENTE/
FACE de situação 3 para novo tratamento e novos IDs. Não copiar como feature
isolada de repetição de intervenção sem decisão futura explícita.

## 10. SQL embutido e schema

Offsets SQL abaixo são **file offsets**, recuperados novamente em P0D:

| Offset | Operação | Campos/efeito |
|---|---|---|
| 0x25C504 | INSERT INTERVENCAO SELECT | Cópia de tratamento; contexto, prestador, tabela/procedimento, valores e comissão |
| 0x263CA4 | INSERT INTERVENCAO VALUES | NROPAC,NROINTPAC,NROTRA,ID_PRESTADOR,NROTAB,NROINT,DATCAD,DATFIN,STATUS,ORCAMENTO,VALOR_PACIENTE,VALOR_REPASSE,DATA_REPASSE,COD_GLOSA,MSG_AUTOR,OBSERV,auditoria,índices/comissão |
| 0x261010 | INSERT DENTE VALUES | NROPAC,NROINTPAC,NRODEN,BITMAP |
| 0x25C768 | INSERT DENTE SELECT | Cópia das associações |
| 0x260F54 | INSERT FACE VALUES | NROPAC,NROINTPAC,NRODEN,FACE1..FACE5 |
| 0x25C7F4 | INSERT FACE SELECT | Cópia das flags |
| 0x2656AC | INSERT HISTORICO VALUES | REGISTRO,ID_PRESTADOR,NROPAC,NROINTPAC,DATA,DESCRICAO,NRODENTE,auditoria |
| 0x1D2F04 | INSERT HISTORICO VALUES | Outro caminho sem NROINTPAC listado; não universalizar |
| 0x68A048 | DELETE INTERVENCAO | SQL concatenado/contexto; não substituir por template inventado |
| 0x11AFDC | UPDATE INTERVENCAO | Valores/comissão por NROPAC/NROINTPAC; não único updater |

Quantidade encontrada por busca case-insensitive: INSERT INTERVENCAO=2,
UPDATE INTERVENCAO=7, DELETE INTERVENCAO=1, INSERT DENTE=2, INSERT FACE=2,
INSERT HISTORICO=5. Presença de SQL não prova caller ou execução runtime.
Textos completos dos templates selecionados ficam no apêndice gerado abaixo.

DDL histórico eds70.sql: ARCADA linha 135; DENTE 473; FACE 515; HISTORICO 527;
INTERVENCAO 543; _SIMBOLO_ODONTO 1403; _STATUS_INTERV 1440.
FK_DENTE_INTERVENCAO linha 2750; FK_FACE_INTERVENCAO 2814;
FK_HISTORICO_INTERVENCAO 2825; INTERVENCAO→status/prestador/TAB_PRC_ITEM/tratamento
no bloco 2860–2886. Tabelas relevantes adicionais: TRATAMENTO, TAB_PRC,
TAB_PRC_ITEM, TAB_GEN_ITEM, USRLOG, CCPACIENTE e ITEMPERIO (CREATE TABLE na linha 574,
reconfirmado em P0D). Modelo por contexto:
paciente NROPAC, tratamento NROTRA, intervenção NROINTPAC, procedimento NROTAB/NROINT,
slot NRODEN; FACE cinco flags. Schema sozinho não define cardinalidade de gravação.

Evidência anterior R4: triggers encontrados ligados a estoque/custo, não geração
financeira automática no fluxo intervenção; CCPACIENTE sem FK direto a intervenção
nesse recorte. Não declarar ausência universal de lógica em todas as versões.

## 11. Matriz de regras e confiança

| RULE_ID | RULE | EVIDENCE_TYPE / SOURCE | TECHNICAL_REFERENCE | CONFIDENCE | IMPLEMENTATION_IMPACT |
|---|---|---|---|---|---|
| R01 | Slot independente de imagem/FDI | USER_OBSERVATION + BINARY R2–R4 | Seleção/records | PROVEN anterior | Modelar identidade/hitbox |
| R02 | Desktop atalhos versus Cloud explícito | USER_OBSERVATION / MANUAL anterior | Referências separadas | STRONG | UX ainda não decidida |
| R03 | Seis marcações | RESOURCE/BINARY + código Brana | 0x662D8E | PROVEN anterior | Dispatcher/alvos |
| R04 | Grupo contíguo | BINARY/MANUAL R4 | 0x662E95 | PROVEN anterior | Uma por run |
| R05 | Segmento união por arcada | BINARY/MANUAL R4 | 0x662FBF,0x6653D4 | PROVEN anterior | Preservar gaps |
| R06 | Arcada 1–16/17–32 | BINARY/MANUAL R4 | 0x66312F | PROVEN anterior | Uma por arcada |
| R07 | FormOk fluxo principal | BINARY/SQL R3–R4 | 0x663E44 | STRONG | Transação por gravação |
| R08 | Grava todas reutiliza FormOk | RESOURCE/BINARY R3–R4 | 0x663D28,VMT+0x134 | PROVEN anterior | Sem atomicidade externa prometida |
| R09 | Faces por slot | BINARY P0D | 0xABE080/0xA9D440 | PROVEN revalidado | Orientação anatômica |
| R10 | Tratamento selecionado destino | BINARY/MANUAL anterior | NROTRA/modal | STRONG | Não usar filtro como destino |
| R11 | Status 1/2/3 e cores | SCHEMA/RESOURCE/BINARY anterior | CorObserv/Realizar/Realizado | PROVEN anterior | Sem Interrompida |
| R12 | Procedimento→símbolo | SCHEMA/BINARY + snapshot | NROSIM/TIPMARCA/TIPSIMB | PROVEN estrutural | Não usar nome como algoritmo |
| R13 | Render por alvo | BINARY/MANUAL R4 | 0x6654C8,0xA87D58 | STRONG | Contrato suficiente; pixel futuro |
| R14 | Símbolo inválido | BINARY/DATA anterior | 0x550DE0/0x550E30 | PARTIAL fora do válido | Não inventar fallback |
| R15 | Orçamento filtro | BINARY R4 | 0x783FC4,0x784338/351 | PROVEN anterior | Excluir Observada |
| R16 | Histórico/finalização | BINARY/SQL anterior | 0x665E20/0x668244 | STRONG | Limitar ao caminho |
| R17 | Hard delete | BINARY/SQL/SCHEMA anterior | 0xA8A4B0 | PROVEN anterior | Sem estorno presumido |
| R18 | Interrupt/repeat não dedicados | RESOURCE/MANUAL/SQL anterior | Conjunto auditado R4 | STRONG, versão limitada | Não inventar ações |
| R19 | Cópia situação 3 | BINARY/SQL anterior | 0x65BFB0→0x65CC34 | PROVEN anterior | Novo tratamento, não repeat isolado |
| R20 | Assets snapshot correlacionados | DATA/arquivo interno + metadados P0D | 81/79; hashes/callers | PROVEN documental | Matriz de autorização |
| R21 | Brana gaps e orçamento | CODE P0C/P0D | models/odontograma_model.py,orcamento_service.py | PROVEN estático | Design futuro; não corrigido |
| R22 | OWNER obrigatório | CODE/documentação FC3-D5 | Guard/domain | PROVEN homologado | Não reabrir D5 |

Os detalhes de runtime/manual/data/log anteriores são fontes de evidência histórica;
não foram inventados novos timestamps, traces ou dados pessoais para preencher
lacunas. ASSET authorization C é UNPROVEN documentado e não uma regra liberada.

## 12. Limites, exaustão e continuidade

R4 encerrou investigação pertinente com PROVEN_WITH_NON_BLOCKING_GAPS. Não reabrir
sem contradição objetiva. Persistem desenho gráfico fino, caso inválido fora do
catálogo e negativas limitadas à versão. Call graph STRONG não vira PROVEN por
transferência documental. Não instalar ferramentas para tornar esta fase implementação.

Brana: crosswalk completo no contrato; matrizes por hash e símbolo separadas.
Acervo já autorizado A/B e histórico C separados; autorização C não demonstrada
não é autorização negativa jurídica nem dispensa aprovação futura.
Retomada: [continuação](../ficha_clinica/odontograma_continuacao.md).

## 13. Evolução posterior — P0F/P0G/R1/R2 consolidada em P0H (registro histórico)

### Origem e limites

P0F = COMPLETE; P0G = PARTIAL investigativo; P0G.R1 = STOPPED sem mutação;
P0G.R2 = COMPLETE. Não confundir P0G.R1 com a referência anterior P0B.R1.
P0G.R1 confirmou processo existente, mas a janela não pôde ser inspecionada:
isso não significa ausência do runtime. Nenhuma gravação foi testada. P0G.R2
fechou o prestador por relato manual autorizado, não por screenshot automatizado
ou novo SELECT. P0H apenas incorpora esses resultados.

Referências estáticas abaixo são endereços VA no EDS70.exe identificado na seção 2,
não novos offsets de arquivo. Recuperação direcionada por leitura PE/desassemblagem
x86 não equivale a decompilação completa de todos os callers. Schemas alternativos
e validações históricas não provam o estado atual do banco produtivo.

### Prestador — contrato fechado, generalização STRONG

USER_OBSERVATION: usuário corrente Tel → cadastro vincula prestador Tel → modal
Propriedades da intervenção abriu com Cirurgião Tel, sem alterar o combo.
Nome é dado do caso, não default fixo.

Convergência BINARY/RESOURCE/SCHEMA: TEasyLookupPrestador em 0xAA5528–0xAA55D0
consulta o contexto do usuário para o default; lookup permite edição;
INTERVENCAO.ID_PRESTADOR é NOT NULL no DDL legado auditado; INSERT 0x6648A4 e
UPDATE 0x664B80 persistem ID_PRESTADOR. Default do usuário vinculado conforme
configuração = STRONG. Valor inicial do caso = USER_OBSERVATION. Não foi feita
correlação SQL independente nessa observação; não afirmar igualdade universal com
responsável do tratamento ou último prestador utilizado.

PROVIDER_REQUIRED=SIM; PROVIDER_NULL_ALLOWED=NÃO no legado; PROVIDER_EDITABLE=SIM;
PROVIDER_HISTORY_MODEL=ID/FK persistido, nome sem snapshot integral;
PROVIDER_CONTRACT_READY=SIM. No web, a FK opcional atual não implementa ainda a
obrigatoriedade do futuro comando; usuário/prestador precisam ser validados por tenant.

### Modal — valores observados, não defaults universais

USER_OBSERVATION: PARTICULAR; Cimentação de Coroa Total Definitiva; Região 41;
Realizar; Marcação 04/10/2026; Finalização vazia. Financeiro: paciente 150;
convênio 0,00; previsão vazia; Não incluir no orçamento desmarcado. Um alvo:
Grava esta habilitado, Grava todas desabilitado. GRAVA_TODAS_ENABLEMENT_RULE =
PARTIAL / NON_BLOCKING. Isso não determina toda a lógica de habilitação nem prova
persistência desses valores: não houve Grava esta/Grava todas nesse caso.

### Catálogo, valores e identidade histórica

LEGACY_EVIDENCE: consulta de edição 0x6618D0 lê valores próprios e NROSIM do
catálogo; helper 0x663BD8 obtém preço inicial; INSERT/UPDATE 0x6648A4/0x664B80
persistem valores da intervenção. Leituras 0xA8E2FC usam descrição/NROSIM atuais;
0xA8E3FC lê bitmap DENTE; cópia em 0xA83F46/0xA843BB preserva recurso associado;
0x6654C8 constrói chave de recurso. Orçamento 0x7B014C usa valores próprios e
referências de catálogo. Convergência: INTERVENTION_CATALOG_HISTORY_MODEL=HYBRID,
PRICE_HISTORY_RULE=valor próprio, SYMBOL_HISTORY_RULE=HYBRID (STRONG), sem prova
de snapshot explícito completo do tipo de marcação aplicado.

TECHNICAL_EXHAUSTION_FOR_CATALOG_POLICY = NÃO: caminhos recuperados são suficientes
para recomendar design conservador, não uma auditoria de todo comportamento
após mudança de catálogo. Não promover essa limitação a prova de catálogo sempre
vivo ou de snapshot integral. BRANA_ARCHITECTURE_RECOMMENDATION: híbrido explícito
com referência atual e representação aplicada separadas; detalhar versionamento em P1.

Renumeração: 0xA88A52/0xA88A83 atualizam ARCADA.NROODONTO sem reidentificar as
associações DENTE/FACE.NRODEN nesses caminhos. HISTORICAL_SLOT_IDENTITY_RULE=slot
lógico original; FDI/número exibido não são identidade (STRONG). Não extrapolar
remapeamento integral de imagens/textos históricos. Brana deve preservar slot
estável, número/FDI separados e condição do elemento na aplicação.

### Datas, histórico e unidade clínica

Semântica consolidada por forms, SQL e casos históricos: DATCAD marcação/entrada
clínica; DATFIN execução completa; TIME_STAMP_INS/UPD inclusão/alteração técnicas;
HISTORICO.DATA fase/evento realizado. DATE_SEMANTICS_READY=SIM.

Helper 0x665E20: situação 2 insere ao criar/entrar em Realizada (STRONG); situação
1/3 não cria nesse caminho (STRONG). UPDATE em 0x666045 modifica DATA/auditoria
quando permanece Realizada (SQL PROVEN); não comprova sincronização automática
de descrição/região/prestador. DELETE em 0x6661A8 remove vínculos ao sair de 2
para 1/3 (STRONG). Finalizador 0x668244 registra fase/histórico e, na finalização
completa, STATUS=2/DATFIN (STRONG). Hard delete/cascades relacionados são os
documentados nas seções 9–10 (PROVEN para vínculos auditados, não estorno financeiro).
Matriz por evento e limites em [contratos](../ficha_clinica/odontograma_contracts.md).

FormOk: início transacional 0x663F37; helper histórico chamado em 0x6646DE;
commit 0x6646FA / rollback 0x664708. Cadeia STRONG, sem provar propagação de erro
em todas as rotinas/lotes. HISTORY_TRANSACTION_BOUNDARY proposto para Brana:
intervenção + alvos + histórico automático numa unidade clínica atomicamente
consistente. Não converter requisito seguro em prova arquitetural total do legado.

Evidência DATA preservada, não reconsultada em P0H: casos de tratamentos 11, 638,
3025, 4035 e validação histórica em
[documento de dados](../odontograma_easydental_validacao_dente_face_status_intervencao.md).
Base histórica distinta do runtime atual. Suporta 0..N eventos/fases por
intervenção; não usar dados pessoais nem um único caso como regra universal.

### Financeiro e delete — limites separados do design

INTERVENCAO possui valores paciente/repasse, ORCAMENTO (“Não incluir”), glosa,
mensagem autorização e previsão repasse. Finalizador contém opção de lançamento
CCPACIENTE, inicialmente desmarcada no recurso recuperado, condicionada a permissão:
branch 0x668757 → seleção 0x668774 → INSERT 0x668803, commit 0x668B36.
Evidência STRONG de lançamento opcional; não é parcela automática pelo orçamento.

Delete 0xA8A4B0 contém verificações relativas a tratamento finalizado, orçamento
aprovado e permissões (0xA8A4E2/0xA8A516/0xA8A54A/0xA8A695). Não foi comprovado
estorno automático ou conjunto completo de restrições pós-pagamento/reconciliação.
DELETE_POLICY_REQUIRED_BEFORE_P1=NÃO; BLOCKING_BEFORE_DELETE_IMPLEMENTATION=SIM.
Bloqueio com lançamento/pagamento/reconciliação pendente é proposta Brana futura.

### Brana atual e requisitos futuros

[Modelo](../../backend/models/odontograma_model.py): DENTE/FACE por FDI sem alvo
slot próprio; sem tipo aplicado/faixas/representação histórica completos.
[Histórico](../../backend/models/historico_paciente.py): source_intervencao_id não
é vínculo FK web inequívoco; separar origem legado e vínculo da intervenção, 0..N.
[Serviço de orçamento](../../backend/services/orcamento_service.py): overrides
JSON/fallback ao catálogo e previsão de tratamento = PARCIAL; caminho de soma não
exclui explicitamente Observada. BUDGET_OBSERVED_MISMATCH=CONFIRMED;
FIX_TYPE_EXPECTED=SERVICE_RULE. Propriedades próprias continuam requerendo design.

Requisitos Brana, não LEGACY_EVIDENCE: BATCH_UNIT normalizada por marcação;
transação por unidade; BATCH_ON_ERROR=STOP proposto; resultados parciais; retry
só de falhas/pendentes. LEGACY_BATCH_ON_ERROR=UNPROVEN. Idempotência BOTH
(comando/unidade), identidade+payload no escopo clínica/paciente/tratamento/operação;
mesma identidade com payload diferente conflita. Versão esperada/CAS por
intervenção além do OWNER lease, locks quando financeiro compartilhado exigir.

TECHNICAL_BLOCKERS_BEFORE_P1=NENHUM; READY_FOR_FC4_P1=SIM — DESIGN SOMENTE.
P1 deve resolver alvos/faixas, histórico/proveniência/transações, financeiro,
catálogo/representação aplicada, idempotência, stale protection, comandos/read
model/erros e roundtrip, inclusive renumeração/mudança de catálogo. Política delete
fica bloqueante antes de implementá-lo; UX/hitboxes/composição/subset autorizado
e homologação manual antes de FC4-P3. Avisar o usuário antes da primeira fase visual.
Nenhuma nova capacidade, autorização de asset ou migration está implícita nisso.

## 14. P1.R1 — evidência manual posterior e reconciliação

CURRENT_BASELINE_P1_R1 = 6e7cdd5de3551f4d1b120f5d0da579e364746d38.
DOCUMENTATION_DATE = 2026-10-05; não presumir datas de execução dos testes.
EVIDENCE_TYPE = USER_MANUAL_RUNTIME_EVIDENCE.
Fonte: pedido FC4-ODONTOGRAMA-P1.R1, decisões manuais 1–10 e relatos adicionais.
O usuário informa testes e prints do EasyDental Desktop; a evidência é incorporada
como fornecida, não como teste/print capturado novamente pelo Codex. Não foram
entregues nesta rodada anexos de imagem identificáveis por caminho/hash; não
inventar IDs, timestamps, paciente, queries ou novas provas binárias. Não exigir
repetição desses testes. Credenciais/dados clínicos pessoais não são necessários.

Este adendo é posterior às seções 1–13 e aos apêndices preservados. Estes continuam
historicamente verdadeiros quanto ao que se sabia/propôs naquele momento; catálogo
HYBRID e proposta de congelamento não são normas vigentes depois desta evidência.
PROVEN_CONTRADICTION = SIM entre as propostas específicas P1 e D01/D03/D04/D05/
D08/D09 fornecidas agora; isso autoriza reconciliação dirigida, NÃO reauditoria geral.
Não promover retrospectivamente offsets/call graphs STRONG a PROVEN.

### Registro de evidência suficiente para continuidade

| ID | Ação/teste relatado pelo usuário | Resultado preservado / consequência canônica |
|---|---|---|
| D01 | Alterou cadastro do procedimento após aplicação | Nome/descrição/símbolo e dados cadastrais/visuais mudaram nas intervenções; valores paciente/repasse próprios não seguiram catálogo |
| D02 | Mudou representação do slot: outro dente, decíduo e sem dente | Intervenção permaneceu no mesmo lugar; slot estável, dentição mista e vazio suportados |
| D03 | Selecionou vários slots; gravou atual, cancelou depois; usou todas; comparou cobrança | Esta grava atual/avança/modal permanece e Cancelar não desfaz; todas confirma selecionados/fecha; Região só exibe; Intervenção não exige slot/não tem todas |
| D04 | Tentou cadastrar usuário sem prestador associado | Bloqueado: "Campo Associar a prestador não pode ser nulo."; default do prestador associado ao usuário corrente |
| D05 | Inclusão e mudança de Situação para Realizada; edição das datas | Marcação recebe data vigente; Finalização recebe data vigente ao Realizada; ambas editáveis, não timestamps técnicos |
| D06 | Observou valores e parcelamento de R$200,00 em três | Duas casas de negócio; 66,67/66,67/66,66 preservam total; precisão interna não demonstrada |
| D07 | Cadastrou/associou fases auxiliares via genérico e observou lifecycle | Fases reutilizáveis, exclusão em uso bloqueada; baixas geram histórico sem concluir; conclusão completa, reabertura, edição e exclusão têm efeitos distintos |
| D08 | Alterou/excluiu intervenções, reabriu orçamento, reaprovação com/sem pagamento | Pendência/aviso persistem até ajuste; pagamentos preservados; reaprovação recalcula débitos/reconcilia diferença; baixa clínica/cirurgião não muda; tratamento inteiro tem delete distinto |
| D09 | Verificou simbolização obrigatória e apresentação por cobrança | Não há procedimento válido sem símbolo; Elemento/Face no odontograma, Intervenção no quadro lateral direito |
| D10 | Confirmou inclusões conscientes repetidas e independência das ocorrências | Mesmo procedimento/slot permitido; orçamento/painel/editar/finalizar/excluir por ocorrência, símbolos podem se sobrepor; replay técnico não é nova intenção |

Detalhes D07: Tabelas Auxiliares → Fases de procedimento → associação no Procedimento
Genérico → procedimento da tabela → fases disponíveis na intervenção. Baixa de
fase cria histórico e continua Realizar, podendo repetir em datas diferentes.
Finaliza Toda ou Situação Realizada concluem. Voltar Realizada→Realizar remove
histórico automático correspondente. Editar finalizada permitido; delete remove
histórico automático relacionado, sem autorizar apagar narrativa manual.

Detalhes D08: antes de baixa, conta corrente anterior permanece até nova aprovação.
Depois de baixa, pago 2.000/orçamento 1.500 gera crédito paciente 500; pago
2.000/orçamento 2.500 gera débito restante 500. Excluir intervenção não remove baixa
realizada. Correção da baixa clínica/cirurgião é manual no módulo correspondente.
Tratamento inteiro remove conjunto relacionado conforme observado; não universalizar
escopo de baixa/todos módulos. Abrir/fechar tela/dispensar aviso não limpa pendência.

Evidência adicional: Preferências > Odontograma permite cores por usuário para
Anomalias/Observada/Realizada/A realizar (exemplo preto/verde/azul/vermelho, configuráveis),
especialidade/filtro mais utilizados e apresentação. Estado clínico guarda semântica,
não cor. Shell com 17 requisitos preservado nos [contratos](../ficha_clinica/odontograma_contracts.md).

### Evidência versus decisões técnicas Brana

D01–D10 são autoridade manual aceita, não propostas em aberto. Modelagem normalizada,
FK/proveniência, revisão financeira, CAS, ledger de comando/unidade, locks e política
de erro STOP são escolhas técnicas Brana ainda documentais. D10 preserva OWNER FC3-D5
e requisitos de idempotência/versão/auditoria; não é claim de que o EasyDental possui
ledger/CAS web. Aparência segue catálogo e paleta atuais; auditoria/manifest técnico
não substitui comportamento LIVE. Ausências de símbolo/vínculo no web são gaps,
não comportamentos legítimos do Desktop.

Relatório P1 original não foi arquivo implementado. O quadro OLD_PROPOSAL →
NEW_EVIDENCE → CORRECTED_DESIGN → IMPACT nos contratos preserva 8 contradições
corrigidas e 6 complementações não contadas como contradição.
P1_DESIGN_CONTRADICTIONS_FIXED = 8.
P1_DESIGN_REMAINING_CONTRADICTIONS = 0.
ROUNDTRIP_REVISED_STATUS = PASS, simulação conceitual A–U, sem banco/runtime.
DO_NOT_REOPEN = D01–D10 sem PROVEN_CONTRADICTION = SIM e prova objetiva.
Após checkpoint: PAUSE_FC4. Próximo módulo separado Procedimentos, NÃO iniciado.

## Apêndice A — SQL literal recuperado em P0D

Templates estáticos; somente leitura dos bytes. Sem execução SQL. Fragmento interrompido por controle/NUL é preservado como fragmento, sem completar concatenações por inferência. Espaços finais de linha foram normalizados para diff documental; o texto não é dump binário byte-a-byte.

### File offset 0x25c504

```sql
INSERT INTO INTERVENCAO ( NROPAC, NROINTPAC, NROTRA, ID_PRESTADOR, NROTAB, NROINT, VALOR_PACIENTE, VALOR_REPASSE, DATCAD, STATUS, OBSERV, ORCAMENTO, ID_INDICE_TAB, VALOR_TAB_REP, VALOR_TAB_PAC, VALOR_INDICE, VALOR_COMISSAO, ID_INDICE_COMISSAO, TIPO_COMISSAO ) SELECT NROPAC,
```

### File offset 0x263ca4

```sql
INSERT INTO INTERVENCAO ( NROPAC, NROINTPAC, NROTRA, ID_PRESTADOR, NROTAB, NROINT, DATCAD, DATFIN, STATUS, ORCAMENTO, VALOR_PACIENTE, VALOR_REPASSE, DATA_REPASSE, COD_GLOSA, MSG_AUTOR, OBSERV, TIME_STAMP_INS, USER_STAMP_INS, ID_INDICE_TAB, VALOR_TAB_REP, VALOR_TAB_PAC, VALOR_INDICE, VALOR_COMISSAO, ID_INDICE_COMISSAO, TIPO_COMISSAO ) VALUES ( [pNROPAC], [pNROINTPAC], [pNROTRA], [pID_PRESTADOR], [pNROTAB], [pNROINT], [pDATCAD], [pDATFIN], [pSTATUS], [pORCAMENTO], [pVALOR_PACIENTE], [pVALOR_REPASSE], [pDATA_REPASSE], [pCOD_GLOSA], [pMSG_AUTOR], [pOBSERV], [pTIME_STAMP], [pUSER_STAMP], [pID_INDICE_TAB], [pVALOR_TAB_REP], [pVALOR_TAB_PAC], [pVALOR_INDICE], [pVALOR_COMISSAO], [pID_INDICE_COMISSAO], [pTIPO_COMISSAO] )
```

### File offset 0xe0820

```sql
UPDATE INTERVENCAO SET ID_INDICE_COMISSAO = 255 WHERE VALOR_COMISSAO > 0
```

### File offset 0x11afdc

```sql
Update Intervencao set VALOR_PACIENTE = [pVALOR_PACIENTE], VALOR_REPASSE = [pVALOR_REPASSE], VALOR_COMISSAO = [pVALOR_COMISSAO], ID_INDICE_COMISSAO = [pID_INDICE_COMISSAO] where Nropac = [pNropac] and Nrointpac = [pNrointpac]
```

### File offset 0x122298

```sql
UPDATE INTERVENCAO SET VALOR_COMISSAO = [pVALOR_COMISSAO], ID_INDICE_COMISSAO = [pID_INDICE_COMISSAO], TIPO_COMISSAO = [pTIPO_COMISSAO] WHERE NROPAC = [pNROPAC] AND NROINTPAC = [pNROINTPAC]
```

### File offset 0x263f80

```sql
UPDATE INTERVENCAO SET ID_PRESTADOR = [pID_PRESTADOR], NROTAB = [pNROTAB], NROINT = [pNROINT], DATCAD = [pDATCAD], DATFIN = [pDATFIN], STATUS = [pSTATUS], ORCAMENTO = [pORCAMENTO], VALOR_PACIENTE = [pVALOR_PACIENTE], VALOR_REPASSE = [pVALOR_REPASSE], DATA_REPASSE = [pDATA_REPASSE], COD_GLOSA = [pCOD_GLOSA], MSG_AUTOR = [pMSG_AUTOR], OBSERV = [pOBSERV], TIME_STAMP_UPD = [pTIME_STAMP], USER_STAMP_UPD = [pUSER_STAMP], ID_INDICE_TAB = [pID_INDICE_TAB], VALOR_TAB_REP = [pVALOR_TAB_REP], VALOR_TAB_PAC = [pVALOR_TAB_PAC], VALOR_INDICE = [pVALOR_INDICE], VALOR_COMISSAO = [pVALOR_COMISSAO], ID_INDICE_COMISSAO = [pID_INDICE_COMISSAO], TIPO_COMISSAO = [pTIPO_COMISSAO] WHERE NROPAC = [pNROPAC] AND NROINTPAC = [pNROINTPAC]
```

### File offset 0x268094

```sql
Update Intervencao set Status = [pStatus], Datfin = [pDatfin], TIME_STAMP_UPD = [pTIME_STAMP_UPD], USER_STAMP_UPD = [pUSER_STAMP_UPD], ID_PRESTADOR = [pID_PRESTADOR], VALOR_COMISSAO = [pVALOR_COMISSAO], ID_INDICE_COMISSAO = [pID_INDICE_COMISSAO], TIPO_COMISSAO = [pTIPO_COMISSAO] where Nropac = [pNropac] and Nrointpac = [pNrointpac]
```

### File offset 0x54eca0

```sql
UPDATE INTERVENCAO SET CD_GUIA_TISS = [pCD_GUIA_TISS] WHERE NROPAC = [pNROPAC] AND NROTRA = [pNROTRA] AND NROINTPAC = [pNROINTPAC]
```

### File offset 0x69dbc0

```sql
UPDATE INTERVENCAO SET S_DENTES = [pS_DENTES], S_FACES = [pS_FACES] WHERE NROPAC = [pNROPAC] AND NROTRA = [pNROTRA] AND NROINTPAC = [pNROINTPAC]
```

### File offset 0x68a048

```sql
Delete from Intervencao where Nropac =
```

### File offset 0x25c768

```sql
INSERT INTO DENTE ( NROPAC, NROINTPAC, NRODEN, BITMAP ) SELECT NROPAC,
```

### File offset 0x261010

```sql
Insert into Dente ( Nropac, Nrointpac, Nroden, Bitmap ) values ( [pNropac], [pNrointpac], [pNroden], [pBitmap] )
```

### File offset 0x25c7f4

```sql
INSERT INTO FACE ( NROPAC, NROINTPAC, NRODEN, FACE1, FACE2, FACE3, FACE4, FACE5 ) SELECT NROPAC,
```

### File offset 0x260f54

```sql
Insert into Face ( Nropac, Nrointpac, Nroden, Face1, Face2, Face3, Face4, Face5 ) values ( [pNropac], [pNrointpac], [pNroden], [pFace1], [pFace2], [pFace3], [pFace4], [pFace5] )
```

### File offset 0x1d2f04

```sql
INSERT INTO HISTORICO ( REGISTRO, NROPAC, DATA, NRODENTE, DESCRICAO, ID_PRESTADOR, USER_STAMP_INS, TIME_STAMP_INS ) VALUES ( [pREGISTRO], [pNROPAC], [pDATA], [pNRODENTE], [pDESCRICAO], [pID_PRESTADOR], [pUSER_STAMP], [pTIME_STAMP] )
```

### File offset 0x2656ac

```sql
Insert into Historico ( REGISTRO, ID_PRESTADOR, Nropac, Nrointpac, Data, Descricao, Nrodente, USER_STAMP_INS, TIME_STAMP_INS ) values ( [pREGISTRO], [pID_PRESTADOR], [pNropac], [pNrointpac], [pData], [pDescricao], [pNrodente], [pUSER_STAMP_INS], [pTIME_STAMP_INS] )
```

### File offset 0x2682f8

```sql
INSERT INTO HISTORICO ( REGISTRO, Nropac, Nrointpac, Data, Descricao, Nrodente, ID_PRESTADOR, USER_STAMP_INS, TIME_STAMP_INS ) VALUES ( [pREGISTRO], [pNropac], [pNrointpac], [pData], [pDescricao], [pNrodente], [pID_PRESTADOR], [pUSER_STAMP_INS], [pTIME_STAMP_INS] )
```

### File offset 0x360fc8

```sql
INSERT INTO HISTORICO ( REGISTRO, NROPAC, DATA, DESCRICAO, ID_PRESTADOR, USER_STAMP_INS, TIME_STAMP_INS ) VALUES ( [pREGISTRO], [pNROPAC], [pDATA], [pDESCRICAO], [pID_PRESTADOR], [pUSER_STAMP_INS], [pTIME_STAMP_INS] )
```

### File offset 0x6a138c

```sql
INSERT INTO HISTORICO ( REGISTRO, NROPAC, DATA, DESCRICAO, ID_PRESTADOR, USER_STAMP_INS, TIME_STAMP_INS ) VALUES ( [pREGISTRO], [pNROPAC], [pDATA], [pDESCRICAO], [pID_PRESTADOR], [pUSER_STAMP_INS], [pTIME_STAMP_INS] )
```

### File offset 0x1d32ec

```sql
DELETE FROM HISTORICO WHERE REGISTRO =
```

### File offset 0x265980

```sql
Delete from Historico where Nropac = [pNropac] and Nrointpac = [pNrointpac]
```

### File offset 0x325c94

```sql
Delete from Historico where Nropac = [pNropac]
```

### File offset 0x682484

```sql
Delete from Historico where Nropac =
```

### File offset 0x68a1d0

```sql
Delete from Historico where Nropac =
```

## Apêndice B — documentação existente localizada

Inventário de descoberta, não alegação de leitura integral de todos os documentos. Documentos técnicos V1 anteriores são de leitura/legado; contrato operacional FC4 separado.

- docs/14_especificacao_tela_orcamento_easy_dental.md
- docs/15_plano_execucao_orcamento.md
- docs/16_checklist_execucao_orcamento.md
- docs/auditoria_biblioteca_editor_simbolos_graficos_easydental.md
- docs/auditoria_bloco_02_odontograma.md
- docs/auditoria_composicao_grade_simbolos_graficos_scope_biblioteca.md
- docs/auditoria_editor_legacy_web_simbolos_graficos.md
- docs/auditoria_funcional_catalogo_simbolos_graficos_easydental_brana_cloud.md
- docs/auditoria_integracao_editor_legacy_web_simbolos_graficos.md
- docs/auditoria_shell_visual_blocos_laterais_odontograma.md
- docs/auditoria_simbolos_graficos_brana_cloud.md
- docs/auditoria_simbolos_graficos_easydental.md
- docs/brana_odontograma_checklist_execucao_por_commit.md
- docs/brana_odontograma_especificacao_implementacao_modular.md
- docs/brana_odontograma_plano_subtarefas_implementacao.md
- docs/checkpoints/ficha_clinica_fc2_d2_r5_checkpoint.md
- docs/checkpoints/ficha_clinica_patient_lock_fc3_d1_checkpoint.md
- docs/checkpoints/ficha_clinica_patient_lock_fc3_d2_checkpoint.md
- docs/checkpoints/ficha_clinica_patient_lock_fc3_d3_checkpoint.md
- docs/checkpoints/ficha_clinica_patient_lock_fc3_d4_checkpoint.md
- docs/checkpoints/ficha_clinica_patient_lock_fc3_d5_checkpoint.md
- docs/checkpoints/ficha_clinica_patient_lock_fc3_d5_final_matrix.md
- docs/comparativo_simbolos_graficos_easydental_brana_cloud.md
- docs/continuidade_fases_origem_simbolos_graficos.md
- docs/contrato_exclusao_biblioteca_simbolos_graficos.md
- docs/contrato_funcional_grade_simbolos_graficos_pos_rollback.md
- docs/contrato_funcional_simbolos_graficos_frontend_react.md
- docs/contrato_normalizacao_catalogo_simbolos_graficos_brana_cloud.md
- docs/diagnostico_post_reload_lista_simbolos_graficos.md
- docs/easydental_investigacao_tela_principal_odontograma_y_eds70.md
- docs/easydental_tela_principal_odontograma_auditoria_prints_fontes_locais.md
- docs/easydental_tela_principal_odontograma_mapeamento_e_plano.md
- docs/easydental_tela_principal_odontologica_auditoria_implementacao_antiga_odontograma.md
- docs/easydental_tela_principal_odontologica_contrato_entrada_isolada_botao_odontograma.md
- docs/easydental_tela_principal_odontologica_inventario_assets_odontograma.md
- docs/easydental_tela_principal_odontologica_subetapa_d1f2_assets_locais_odontograma.md
- docs/easydental_tela_principal_odontologica_subetapa_d1f4_correcao_paths_assets_odontograma.md
- docs/easydental_tela_principal_odontologica_subetapa_d1f_refino_visual_odontograma.md
- docs/fase_2_preferencias_configuracoes_subetapa_6_implementacao_pref_valores_padrao_odontograma.md
- docs/fase_2_preferencias_configuracoes_subetapa_7_validacao_pref_valores_padrao_odontograma.md
- docs/fase_g3d_homologacao_runtime_crud_simbolos_graficos.md
- docs/fechamento_botao_excluir_biblioteca_simbolos_graficos.md
- docs/ficha_clinica_estado_atual.md
- docs/ficha_clinica_odontograma_estado_atual.md
- docs/ficha_clinica_odontograma_mapeamento_icones_intervencoes.md
- docs/ficha_clinica_odontograma_refino_visual_easy_referencia_assets.md
- docs/ficha_clinica_odontograma_refino_visual_residual_ordem_barras_toolbar.md
- docs/ficha_clinica_odontograma_toolbar_superior_refino_visual.md
- docs/frontend_react_ficha_clinica_analise_inicial_easy_dental.md
- docs/mapeamento_referencias_simbolos_graficos_frontend_react.md
- docs/matriz_origens_simbolos_graficos.md
- docs/modulos/simbolos_graficos_novo_auditoria_easydental.md
- docs/modulos/simbolos_graficos_novo_contrato_funcional.md
- docs/modulos/simbolos_graficos_novo_plano_implementacao.md
- docs/odontograma_assets_easy_auditoria.md
- docs/odontograma_assets_easy_inspecao_visual_bmps.md
- docs/odontograma_brana_contrato_minimo_implementacao_modular.md
- docs/odontograma_brana_contrato_modelagem_futura.md
- docs/odontograma_brana_contrato_tecnico_final_v1.md
- docs/odontograma_easydental_auditoria_armazenamento_estados_cores_tabelas.md
- docs/odontograma_easydental_diagrama_relacional_contrato_modelagem_brana.md
- docs/odontograma_easydental_diagramas_mermaid.md
- docs/odontograma_easydental_validacao_dente_face_status_intervencao.md
- docs/odontograma_v1_backend_contracts_models_schemas.md
- docs/odontograma_v1_backend_rotas_leitura_fechamento_commit.md
- docs/odontograma_v1_busca_paciente_modular.md
- docs/odontograma_v1_conferencia_pos_migration.md
- docs/odontograma_v1_fluxo_abertura_paciente_e_tela_vazia.md
- docs/odontograma_v1_frontend_bootstrap_leitura.md
- docs/odontograma_v1_migration_minima_contrato_execucao.md
- docs/odontograma_v1_refino_geometria_arcada_por_referencia_easy.md
- docs/odontograma_v1_refino_visual_arcada_leitura.md
- docs/odontograma_v1_reorganizacao_layout_clinico.md
- docs/odontograma_v1_shell_modularizacao.md
- docs/odontograma_v1_validacao_rotas_backend_leitura.md
- docs/plano_implementacao_simbolos_graficos_frontend_react.md
- docs/reavaliacao_pos_fechamento_simbolos_graficos_proximo_modulo.md
- docs/recomendacao_proximo_modulo_pos_simbolos_graficos.md
- docs/rollback_microetapa_d_para_marco_c_simbolos_graficos.md
- docs/rollback_simbolos_graficos_marco_estavel_2c_3_8_1.md
- docs/simbolos_graficos_retomada_pos_preferencias_estado_atual.md
- docs/simbolos_graficos_retomada_subetapa_0_diagnostico_validar_tipo_marca.md
- docs/simbolos_graficos_subetapa_0_mapeamento_monolitico.md
- docs/simbolos_graficos_subetapa_10_fechamento_pos_validar_tipo_marca.md
- docs/simbolos_graficos_subetapa_1_namespace_passivo.md
- docs/simbolos_graficos_subetapa_2_fronteiras_contratos.md
- docs/simbolos_graficos_subetapa_3_helpers_puros_passivos.md
- docs/simbolos_graficos_subetapa_4_integracao_helper_normalizar_texto.md
- docs/simbolos_graficos_subetapa_5_integracao_helper_eh_sistema.md
- docs/simbolos_graficos_subetapa_6_integracao_helper_url_imagem.md
- docs/simbolos_graficos_subetapa_7_consolidacao_helpers.md
- docs/simbolos_graficos_subetapa_8_biblioteca_helpers_remanescentes.md
- docs/simbolos_graficos_subetapa_8_documental_helpers_remanescentes.md
- docs/simbolos_graficos_subetapa_9_documental_validar_tipo_marca_simbolo.md
- docs/varredura_modulos_nao_iniciados_pos_simbolos_graficos.md
- docs/varredura_modulos_realmente_nao_iniciados_pos_simbolos_graficos.md
