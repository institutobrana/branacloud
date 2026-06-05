# Inventario tecnico somente leitura das fontes locais do EasyDental para a futura tela principal odontologica

## 1. Objetivo
Este documento registra o inventario tecnico somente leitura das fontes locais do EasyDental relacionadas a futura tela principal odontologica.

Esta e uma etapa documental.
Nenhuma implementacao foi iniciada.
Nenhum arquivo do EasyDental foi copiado, alterado ou executado.

## 2. Fontes consultadas

| Caminho | Existe | Acessivel | Pastas principais vistas | Tipos de arquivos identificados | Limitacoes observadas | Confirmacao |
|---|---|---|---|---|---|---|
| `D:\UTIL\EasyDental_7.6_BR` | Sim | Sim | `CEP`, `CRACK`, `EDS75_Client`, `EDS75_Server`, `MSDE`, `Suporte`, `Update` | `.inf`, `.iso`, `.txt`, `.doc`, `.exe`, e em subpastas `.dll`, `.ini`, `.reg`, `.mdb`, `.bmp`, `.jpg`, `.avi` | Nenhuma limitacao de leitura observada; o conteudo aparenta ser pacote de instalacao/distribuicao e suporte | Somente leitura |
| `Y:\EDS70` | Sim | Sim | `Bitmaps`, `Dados`, `Fotos`, `Help`, `Icones`, `Import`, `MSDE`, `Objetos`, `Outbox`, `Reports`, `Safe`, `Slide`, `Temp`, `Textos`, `TISS` | `.dsn`, `.mdf`, `.ldf`, `.bak`, `.sql`, `.raw`, `.bmp`, `.jpg`, `.png`, `.wav`, `.exe`, `.dll`, `.reg`, `.txt`, `.rtf`, `.doc`, `.docx`, `.pdf`, `.fr3`, `.log`, `.mdb`, `.dat`, `.mod`, `.ini`, `.avi` | Nenhuma limitacao de leitura observada; o conteudo aparenta ser base viva/legada com dados, objetos, relatorios e recursos de interface | Somente leitura |

### 2.1 Contexto documental previo ja registrado
- `docs/easydental_tela_principal_odontograma_auditoria_prints_fontes_locais.md`
- `docs/easydental_tela_principal_odontologica_contrato_funcional.md`
- `docs/easydental_tela_principal_odontologica_inventario_brana_atual.md`
- `docs/easydental_investigacao_tela_principal_odontograma_y_eds70.md`

## 3. Inventario de pastas relevantes

### 3.1 `D:\UTIL\EasyDental_7.6_BR`

| Pasta | Caminho | Tipo provavel de conteudo | Relacao provavel com a tela principal odontologica | Risco de uso futuro | Recomendacao |
|---|---|---|---|---|---|
| `CEP` | `D:\UTIL\EasyDental_7.6_BR\CEP` | Base auxiliar de CEP/enderecos em formato Access/compactado (`autocep.mdb`, `autocep.rar`, `cep.rar`) | Pode apoiar cadastro e busca de endereco, mas nao e bloco central da tela | Medio | Somente referencia |
| `CRACK` | `D:\UTIL\EasyDental_7.6_BR\CRACK` | Arquivos nao confiaveis/nao oficiais do pacote de distribuicao | Nao deve ser usado para a tela principal nem para qualquer migracao | Muito alto | Nao usar |
| `EDS75_Client` | `D:\UTIL\EasyDental_7.6_BR\EDS75_Client` | Pacote cliente com executavel, DLLs, instalacao e copia da pasta `EDS70` | Ajuda a entender empacotamento e dependencias de runtime, nao o layout funcional direto | Alto | Estudar depois |
| `EDS75_Server` | `D:\UTIL\EasyDental_7.6_BR\EDS75_Server` | Pacote servidor com instalador, DLLs, runtime, `EDS70` e suporte a MSDE | Pode explicar implantacao e topologia do sistema legado | Alto | Estudar depois |
| `MSDE` | `D:\UTIL\EasyDental_7.6_BR\MSDE` | Instalacao do SQL Server MSDE e suporte de setup | Relevante apenas para entender a base historica de banco | Alto | Somente referencia |
| `Suporte` | `D:\UTIL\EasyDental_7.6_BR\Suporte` | Ferramentas e prerequisitos auxiliares | Pode esclarecer dependencias de instalacao, nao a tela em si | Medio | Somente referencia |
| `Update` | `D:\UTIL\EasyDental_7.6_BR\Update` | Pacote de atualizacao do EasyDental | Pode indicar ciclo de manutencao e distribuicao | Medio | Somente referencia |

### 3.2 `Y:\EDS70`

| Pasta | Caminho | Tipo provavel de conteudo | Relacao provavel com a tela principal odontologica | Risco de uso futuro | Recomendacao |
|---|---|---|---|---|---|
| `Bitmaps` | `Y:\EDS70\Bitmaps` | Bitmaps de arcada, dentes, simbolos e marcadores visuais | Relacao visual direta com odontograma, regioes e estados | Alto | Somente referencia visual/conceitual |
| `Dados` | `Y:\EDS70\Dados` | Banco, scripts SQL, backups e exportacoes de tabelas | Relevancia tecnica alta para persistencia, tabelas e estrutura de dados | Alto | Nao usar/copiar |
| `Fotos` | `Y:\EDS70\Fotos` | Fotos de pacientes e imagens clinicas | Pode apoiar area de imagens da tela principal, mas e dado sensivel | Alto | Somente referencia |
| `Help` | `Y:\EDS70\Help` | Manuais PDF | Pode ajudar a entender fluxos e terminologia | Baixo/medio | Somente referencia |
| `Icones` | `Y:\EDS70\Icones` | Icones de toolbar, atalhos e acoes rapidas | Relacao direta com barra de ferramentas e atalhos laterais | Alto | Somente referencia visual |
| `Import` | `Y:\EDS70\Import` | Arquivos de importacao, DSN antigo e bases vazias | Ajuda a entender rotinas de migracao e compatibilidade | Alto | Nao usar/copiar |
| `MSDE` | `Y:\EDS70\MSDE` | Instalador e componentes do MSDE | Indica dependencias de banco legadas | Alto | Somente referencia |
| `Objetos` | `Y:\EDS70\Objetos` | Objetos/definicoes de arcada e dente em `.dat` | Forte relacao com o desenho do odontograma | Muito alto | Somente referencia funcional |
| `Outbox` | `Y:\EDS70\Outbox` | Saidas geradas, como PDF de orcamento | Relacao com documentos enviados/gerados pelo sistema | Medio | Somente referencia |
| `Reports` | `Y:\EDS70\Reports` | Templates de relatorio, incluindo TISS | Relacao com impressos e saidas formais | Alto | Somente referencia |
| `Safe` | `Y:\EDS70\Safe` | Backup/safe copy e arquivo temporario MDB | Relacao com preservacao e recuperacao, nao com a tela | Alto | Nao usar/copiar |
| `Slide` | `Y:\EDS70\Slide` | Pagina HTML simples de slide/apresentacao | Baixa relacao com a tela principal; pode ser apenas material acessorio | Baixo | Somente referencia |
| `Temp` | `Y:\EDS70\Temp` | Logs, imagens temporarias e bases temporarias | Pode revelar fluxo interno, mas e area transitória | Alto | Nao usar |
| `Textos` | `Y:\EDS70\Textos` | Modelos, cartas, contratos, mensagens e textos operacionais | Pode apoiar observacoes, documentos e textos de apoio na tela | Medio/alto | Somente referencia funcional |
| `TISS` | `Y:\EDS70\TISS` | Pasta presente sem arquivo visivel no levantamento | Pode abrigar material de padronizacao/faturamento futuro | Medio | Somente referencia |

## 4. Inventario de arquivos tecnicos

### 4.1 Conexao e banco
| Extensao | Localizacao | Funcao provavel | Utilidade futura | Restricao de uso | Recomendacao |
|---|---|---|---|---|---|
| `.dsn` | `Y:\EDS70\eds70.dsn`, `Y:\EDS70\Import\eds60.dsn`, `Y:\EDS70\Import\eds60q.dsn` | Conexao ODBC para SQL Server / importacao | Alta para entender conexao historica | Nao abrir em modo de escrita; nao alterar DSN | Apenas documentar |
| `.mdf` | `Y:\EDS70\Dados\eds70dat.mdf` | Arquivo principal do banco SQL Server | Alta para persistencia legada | Nao anexar, editar ou copiar | Apenas documentar |
| `.ldf` | `Y:\EDS70\Dados\eds70log.ldf` | Log do banco SQL Server | Alta para persistencia legada | Nao anexar, editar ou copiar | Apenas documentar |
| `.bak` | `Y:\EDS70\Dados\eds70.bak`, `Y:\EDS70\Safe\Easy.BKP` | Backup do banco/base | Alta para auditoria documental | Nao restaurar nem copiar | Apenas documentar |
| `.mdb` | `D:\UTIL\EasyDental_7.6_BR\CEP\autocep.mdb`, `Y:\EDS70\Import\EDS60_Vazio.mdb`, `Y:\EDS70\Import\EDS60Q_Vazio.mdb`, `Y:\EDS70\Safe\EDS70Tmp.MDB` | Banco Access/Jet auxiliar ou base vazia de importacao | Media/alta, apenas como referencia de compatibilidade | Nao abrir para alteracao; nao exportar conteudo | Apenas documentar |

### 4.2 Scripts, definicoes e importacao
| Extensao | Localizacao | Funcao provavel | Utilidade futura | Restricao de uso | Recomendacao |
|---|---|---|---|---|---|
| `.sql` | `Y:\EDS70\Dados\eds70.sql`, `Y:\EDS70\Dados\eds70_build_*.sql`, `Y:\EDS70\Dados\eds75_build_*.sql` | Scripts de criacao/ajuste de schema e rotinas | Alta para entender o banco legado | Nao executar em escrita; nao reaplicar sem contrato | Apenas documentar |
| `.raw` | `Y:\EDS70\Dados\Dist\*.raw` | Exportacao estruturada de tabelas/cadastros | Muito alta para inventario de dados | Nao converter para escrita ou migracao automatica | Apenas documentar |
| `.ini` | `D:\UTIL\EasyDental_7.6_BR\MSDE\setup.ini`, `Y:\EDS70\MSDE\setup.ini` | Configuracao de instalacao | Media para entender empacotamento | Nao editar | Apenas documentar |
| `.reg` | `Y:\EDS70\firewall.reg`, `Y:\EDS70\Jet.REG` | Ajustes de registro/ambiente | Media para instalacao legada | Nao importar sem avaliacao | Apenas documentar |
| `.ini/.inf` | `D:\UTIL\EasyDental_7.6_BR\Autorun.inf`, `Y:\EDS70\MSDE\autorun.inf` | Inicializacao do instalador | Baixa/medio | Nao modificar | Apenas documentar |

### 4.3 Relatorios, documentos e textos
| Extensao | Localizacao | Funcao provavel | Utilidade futura | Restricao de uso | Recomendacao |
|---|---|---|---|---|---|
| `.fr3` | `Y:\EDS70\Reports\TISS_*.fr3` | Templates de relatorio FastReport | Alta para entender relatorios TISS e impressos | Nao copiar nem editar | Apenas documentar |
| `.pdf` | `Y:\EDS70\Help\Manual_EDS70_*.pdf`, `Y:\EDS70\Outbox\Orcamento.pdf` | Manual de uso e saida documentada | Media/alta para navegacao funcional | Nao alterar | Apenas documentar |
| `.rtf` | `Y:\EDS70\Textos\*.rtf` | Modelos de cartas, contratos e mensagens | Alta para textos de apoio e documentos | Nao usar como base copiavel | Apenas documentar |
| `.doc/.docx` | `D:\UTIL\EasyDental_7.6_BR\Readme.doc`, `Y:\EDS70\Textos\*.doc`, `Y:\EDS70\Textos\*.docx` | Documentacao e modelos editaveis | Media/alta para contexto funcional | Nao alterar | Apenas documentar |
| `.txt` | `D:\UTIL\EasyDental_7.6_BR\Instalação.txt`, `Y:\EDS70\Mensagens.txt`, `Y:\EDS70\Mesclagem.txt`, `Y:\EDS70\Textos\*.txt` | Instrucoes e mensagens | Media | Nao transformar em regra funcional sem validacao | Apenas documentar |
| `.mod` | `Y:\EDS70\Textos\*.mod` | Modelos de textos/rotinas de correspondencia | Media | Nao reutilizar diretamente | Apenas documentar |

### 4.4 Imagens, icones e objetos
| Extensao | Localizacao | Funcao provavel | Utilidade futura | Restricao de uso | Recomendacao |
|---|---|---|---|---|---|
| `.bmp` | `Y:\EDS70\Bitmaps\*.bmp`, `Y:\EDS70\Icones\*.bmp`, `D:\UTIL\EasyDental_7.6_BR\EDS75_Client\EDS70\Logo2.bmp`, `Logo3.bmp` | Arcadas, dentes, simbolos e icones | Muito alta para referencia visual | Nao copiar para o Brana Cloud | Somente referencia visual |
| `.jpg` | `Y:\EDS70\splash_eds76.jpg`, `splash_edc76.jpg`, `Y:\EDS70\Fotos\*.jpg` | Splash e fotos clinicas/pacientes | Media/alta | Nao copiar ou reutilizar como asset | Somente referencia |
| `.png` | `Y:\EDS70\Fotos\*.png` | Imagens de paciente | Alta, mas sensivel | Nao copiar | Somente referencia |
| `.avi` | `Y:\EDS70\Wait.avi`, `Y:\EDS70\Alarme.wav` | Midia de espera/alerta | Baixa/medio | Nao copiar | Somente referencia |
| `.dat` | `Y:\EDS70\Objetos\arc_dente*.dat` | Definicoes de objetos da arcada/dente | Muito alta para odontograma | Nao copiar nem converter diretamente | Somente referencia funcional |

### 4.5 Executaveis e bibliotecas
| Extensao | Localizacao | Funcao provavel | Utilidade futura | Restricao de uso | Recomendacao |
|---|---|---|---|---|---|
| `.exe` | `D:\UTIL\EasyDental_7.6_BR\setup.exe`, `D:\UTIL\EasyDental_7.6_BR\MSDE\setup.exe`, `Y:\EDS70\EDS70.exe`, `EDCAP70.EXE`, `EDSSH70.exe`, `EDUTL70.exe`, `EDIMP70.exe`, `EDBKP70.exe` e outros | Executaveis principais e utilitarios | Alta para entender topologia, mas nao para reaproveitamento direto | Nao executar rotinas de instalacao ou alteracao | Apenas documentar |
| `.dll` | Varios em `Y:\EDS70` e `D:\UTIL\EasyDental_7.6_BR\EDS75_*` | Bibliotecas de suporte, imagem, runtime e interfaces | Media/alta para compatibilidade historica | Nao copiar nem usar como dependencia do Brana Cloud | Apenas documentar |
| `.rll`/`.msm`/`.msp` | `Y:\EDS70\MSDE` e instaladores correlatos | Componentes de instalacao | Baixa/medio | Nao usar para alterar ambiente | Apenas documentar |
| `.wav` | `Y:\EDS70\Alarme.wav` | Som de alerta | Baixa | Nao copiar sem analise propria | Apenas documentar |

## 5. Relacao com a tela principal odontologica

| Bloco do contrato funcional | Ha indicio nas fontes EasyDental | Tipo do achado | Pode ajudar como referencia? | Restricao de uso/copia |
|---|---|---|---|---|
| Menu superior | Sim | Visual + tecnico | Sim, como guia de shell | Nao copiar icones ou estrutura proprietaria |
| Toolbar superior | Sim | Visual + assets (`Icones`, `Bitmaps`, `cmd_*.bmp`) | Sim, como referencia de densidade e acao | Nao copiar assets |
| Campo paciente ativo | Sim | Tecnico + funcional (`STATUS_PACIENTE`, `USUARIO`, fluxos de paciente) | Sim | Nao transpor sem contrato proprio |
| Odontograma | Sim | Visual + tecnico (`Bitmaps`, `Objetos`, `arc_*.dat`, `raw`) | Sim, como referencia funcional e geometrica | Nao copiar assets nem estruturas proprietarias |
| Filtro de intervencoes/tratamento | Sim | Tecnico + funcional (`_STATUS_INTERV`, `TAB_PRC_ITEM`, `TAB_GEN_ITEM`) | Sim | Nao usar como regra final sem contrato |
| Lista/tabela de procedimentos | Sim | Tecnico + dados + relatorios | Sim | Nao importar tabelas ou seeds do legado |
| Historico inferior | Sim | Tecnico + funcional (`HISTORICO`, `cmd_historico.bmp`, textos/relatorios) | Sim | Nao replicar layout ou dados proprietarios |
| Atalhos laterais | Sim | Visual + icones (`cmd_odontograma.bmp`, `cmd_anamnese.bmp`, `cmd_historico.bmp`, `cmd_calendario.bmp`) | Sim | Nao copiar assets |
| Abas/resumos: Paciente, Tratamento, Observacoes, Imagens, Documentos, Agenda | Sim | Visual + tecnico + documentos | Sim | Nao reproduzir sem modularizacao propria |
| Agenda resumida do dia | Sim | Visual + tecnico (`_STATUS_AGENDA`, `cmd_calendario.bmp`, `cmd_avancasemana.bmp`, `cmd_avancames.bmp`) | Sim | Nao acoplar diretamente sem contrato de agenda |
| Procedimentos/tabelas | Sim | Dados + scripts + raw exports | Sim | Nao copiar seeds, tabelas ou scripts de escrita |
| Persistencia futura | Sim | Banco + DSN + backups + MSDE | Sim, apenas como referencia tecnica | Nao usar/copiar sem contrato tecnico proprio |

## 6. Banco de dados e arquivos de dados

### 6.1 Confirmacoes tecnicas observadas
- O arquivo `Y:\EDS70\eds70.dsn` indica conexao ODBC para `SQL Server`.
- O DSN aponta para `SERVER=DELL_SERVIDOR\EDS70`, `DATABASE=eds70` e `UID=easy`.
- Os arquivos `Y:\EDS70\Dados\eds70dat.mdf` e `Y:\EDS70\Dados\eds70log.ldf` confirmam base SQL Server com arquivo de dados e log.
- O arquivo `Y:\EDS70\Dados\eds70.bak` indica backup da base.
- O diretorio `Y:\EDS70\MSDE` indica dependencia de instalacao MSDE/SQL Server legado.
- O pacote `D:\UTIL\EasyDental_7.6_BR\MSDE` reforca a existencia de instalador e componentes de banco legado.

### 6.2 Inventario resumido por tipo de base
| Tipo | Arquivos observados | Relação provavel | Restricao |
|---|---|---|---|
| SQL Server / MSDE | `eds70.dsn`, `eds70dat.mdf`, `eds70log.ldf`, `eds70.bak`, `MSDE\*` | Base principal do EasyDental legado | Nao abrir em escrita, nao anexar, nao restaurar, nao exportar |
| Access / Jet | `autocep.mdb`, `EDS60_Vazio.mdb`, `EDS60Q_Vazio.mdb`, `EDS70Tmp.MDB` | Bases auxiliares, importacao ou dados temporarios | Nao copiar nem alterar |
| Exportacao estruturada | `Dados\Dist\*.raw` | Dump/extração controlada de tabelas e seeds | Nao converter para escrita ou migracao direta |
| Textual/configuracao de banco | `setup.ini`, `autorun.inf`, `Jet.REG`, `firewall.reg` | Configuracao e instalacao | Nao editar sem necessidade documentada |

### 6.3 Contexto documental ja conhecido
Este inventario complementa as leituras anteriores da base `EDS70` ja registradas em documentos da trilha, sem repetir operacao destrutiva, sem exportar dados e sem abrir caminho para escrita.

## 7. Assets, icones e bitmaps

### 7.1 Elementos visuais identificados
- `Y:\EDS70\Bitmaps\arc_*.bmp`
- `Y:\EDS70\Bitmaps\ger_fotos.bmp`
- `Y:\EDS70\Icones\cmd_odontograma.bmp`
- `Y:\EDS70\Icones\cmd_historico.bmp`
- `Y:\EDS70\Icones\cmd_anamnese.bmp`
- `Y:\EDS70\Icones\cmd_calendario.bmp`
- `Y:\EDS70\Icones\avi_*.bmp`
- `Y:\EDS70\Fotos\*.jpg`
- `Y:\EDS70\Fotos\*.png`
- `Y:\EDS70\Objetos\arc_dente*.dat`
- `Y:\EDS70\splash_eds76.jpg`
- `Y:\EDS70\splash_edc76.jpg`
- `Y:\EDS70\Temp\arc_inferior.bmp`
- `Y:\EDS70\Temp\arc_superior.bmp`

### 7.2 Observacao tecnica
Esses elementos servem como referencia visual, sem autorizacao para copia para o Brana Cloud.

### 7.3 Uso permitido no futuro
- referencia conceitual de densidade, ordem e semantica visual;
- referencia funcional para entender estados de arcada, atalhos e instrumentos;
- referencia de documentacao interna, quando juridicamente e tecnicamente adequado.

## 8. Riscos e restricoes
- risco de copiar material proprietario;
- risco de alterar arquivo do EasyDental sem querer;
- risco de confundir referencia visual com asset reutilizavel;
- risco de depender de estrutura interna do EasyDental;
- risco de mexer em banco, DSN, backup ou importacao legada;
- risco de misturar inventario com implementacao;
- risco de alterar textos, labels ou mojibake fora do escopo;
- risco de tratar `CRACK` ou artefatos de instalacao como fonte confiavel de produto;
- risco de transformar `Temp` e `Safe` em origem operacional, quando sao apenas material de apoio e resguardo.

## 9. Recomendacoes para uso futuro

### 9.1 Pode ser usado como referencia conceitual
- estrutura de instalacao (`EDS75_Client`, `EDS75_Server`, `MSDE`);
- manuais PDF;
- slides/intro `slide.htm`;
- organizacao geral de pastas;
- densidade visual da toolbar e do shell.

### 9.2 Pode ser usado como referencia funcional
- `Bitmaps`, `Icones`, `Objetos` e `arc_*.dat`;
- `cmd_odontograma.bmp`, `cmd_historico.bmp`, `cmd_anamnese.bmp`, `cmd_calendario.bmp`;
- `TAB_PRC.raw`, `TAB_PRC_ITEM.raw`, `TAB_GEN_ITEM.raw`;
- `ANAMNESE_*.raw`, `SIS_*.raw`, `_STATUS_*.raw`;
- `HISTORICO` e registros relacionados, por inferencia documental.

### 9.3 Deve ser apenas citado/documentado
- `eds70.dsn`;
- `eds70dat.mdf`;
- `eds70log.ldf`;
- `eds70.bak`;
- `autocep.mdb`;
- `EDS60_Vazio.mdb` e `EDS60Q_Vazio.mdb`;
- `TISS_*.fr3`;
- `Outbox\Orcamento.pdf`.

### 9.4 Nao deve ser usado/copiadamente
- qualquer asset visual do legado;
- qualquer arquivo de `Safe`;
- qualquer artefato de `CRACK`;
- scripts ou bases de importacao para escrita;
- dumps `raw` como se fossem fonte de implementacao direta.

### 9.5 Precisa de contrato tecnico proprio antes de qualquer uso
- persistencia;
- agenda resumida;
- odontograma editavel;
- historico inferior;
- lista/tabela de procedimentos;
- documentos e imagens;
- integracao com tratamento e paciente ativo.

## 10. Proxima etapa recomendada
Recomendo a Subetapa D preliminar: desenho tecnico do layout estatico sem implementacao.

Essa proxima etapa deve:
- definir onde a futura tela entra no Brana Cloud;
- listar os arquivos novos que seriam criados apenas em nivel de plano;
- listar os arquivos existentes que nao devem ser tocados;
- manter o escopo sem programar nada;
- preservar `frontend/app.js`, backend, banco, seeds, endpoints, agenda, ficha pessoal, odontograma e procedimentos fora da edicao.

## 11. Registro para roadmap
- foi criado o inventario tecnico somente leitura das fontes EasyDental;
- os caminhos consultados foram `D:\UTIL\EasyDental_7.6_BR` e `Y:\EDS70`;
- nenhuma alteracao foi feita nos arquivos do EasyDental;
- nenhum arquivo do EasyDental foi copiado para o Brana Cloud;
- a implementacao ainda nao comecou;
- a proxima etapa recomendada e a Subetapa D preliminar de layout estatico sem implementacao.
