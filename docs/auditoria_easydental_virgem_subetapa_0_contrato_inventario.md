# Auditoria EasyDental virgem — Subetapa 0 — contrato e inventário inicial

## 1. Contexto

- Fonte externa: `\\Sonyvaio\c\EDS70`
- Finalidade: auditoria documental inicial de uma instalacao virgem do EasyDental para orientar futuras decisoes do Brana Cloud sobre criacao de tabelas, nova conta/clinica, usuario inicial/admin, prestadores, vinculos, perfis, permissoes, seeds e configuracoes iniciais.
- Confirmacao de escopo: esta fonte deve ser tratada como somente leitura e nao deve ser alterada, importada, copiada para dentro do projeto ou usada para implementacao nesta subetapa.
- Confirmacao de separacao: esta frente documental e separada da Fase 2B de modularizacao frontend.

## 2. Objetivo

- Entender como o EasyDental virgem nasce estruturalmente.
- Preparar auditorias futuras sobre usuarios, prestadores, permissoes e seeds.
- Nao implementar nada nesta etapa.

## 3. Classificacao da frente

- Frente de auditoria comparativa externa.
- Impacto futuro esperado: core/comum do Brana Cloud.
- Sem alteracao funcional nesta etapa.

## 4. Inventario inicial da pasta

- Acessibilidade: a pasta `\\Sonyvaio\c\EDS70` esta acessivel a leitura.
- Estrutura principal encontrada:
  - `Bitmaps`
  - `Dados`
  - `Fotos`
  - `Help`
  - `Icones`
  - `Import`
  - `MSDE`
  - `Objetos`
  - `Outbox`
  - `Reports`
  - `Safe`
  - `Slide`
  - `Temp`
  - `Textos`
  - `TISS`
- Principais arquivos encontrados no topo:
  - `EDS70.exe`
  - `EDSQL70.exe`
  - `EDBKP70.exe`
  - `EDCAP70.EXE`
  - `EDIMP70.exe`
  - `EDIMP71.exe`
  - `EDIMP75.exe`
  - `EDSSH70.exe`
  - `EDUTL70.exe`
  - `SetupEx.exe`
  - `setup.exe`
  - `eds70.dsn`
  - `EDS70Tmp.MDB`
  - `EDS70Tmp.ldb`
  - `Jet.REG`
  - `firewall.reg`
  - `ED.LIC`
  - `ED.key`
  - `ED.ent`
  - `ED.rst`
  - `Microsoft.VC80.CRT.manifest`
- Extensoes relevantes:
  - `.mdf`
  - `.ldf`
  - `.sql`
  - `.dsn`
  - `.reg`
  - `.mdb`
  - `.ldb`
  - `.exe`
  - `.dll`
  - `.raw`
  - `.txt`
  - `.ini`
  - `.tmp`
  - `.manifest`
- Arquivos que parecem ser banco de dados:
  - `Dados\eds70dat.mdf`
  - `Dados\eds70log.ldf`
  - `EDS70Tmp.MDB`
  - `EDS70Tmp.ldb`
- Arquivos que parecem ser configuracao ou conexao:
  - `eds70.dsn`
  - `Jet.REG`
  - `firewall.reg`
  - `setup.ini`
  - `ED.41s`
  - `ED.key`
  - `ED.LIC`
  - `ED.ent`
  - `ED.rst`
- Arquivos que parecem ser executaveis ou ferramentas:
  - `EDS70.exe`
  - `EDSQL70.exe`
  - `EDBKP70.exe`
  - `EDCAP70.EXE`
  - `EDIMP70.exe`
  - `EDIMP71.exe`
  - `EDIMP75.exe`
  - `EDSSH70.exe`
  - `EDUTL70.exe`
  - `SetupEx.exe`
  - `setup.exe`
  - `Xck16db.exe`
- Limitacoes encontradas:
  - a listagem recursiva profunda na fonte externa pode ficar lenta e exigir timeouts maiores;
  - ainda nao foi feita abertura interativa de aplicativos nem consulta de tabelas;
  - nesta subetapa nao foram executados comandos que alterem estado.

## 5. Hipoteses tecnicas iniciais

- Tipo provavel de banco: Microsoft SQL Server, muito provavelmente uma instancia MSDE/SQL Server local ou dedicada.
- Indicios principais:
  - `eds70.dsn` informa `DRIVER=SQL Server`, `DATABASE=eds70`, `SERVER=SONYVAIO\EDS70` e `UID=easy`.
  - `Dados\eds70dat.mdf` e `Dados\eds70log.ldf` sugerem banco SQL Server com arquivos de dados e log.
  - `MSDE\setup.exe` e arquivos relacionados indicam distribuicao/instalacao do motor SQL.
  - `Jet.REG` existe como resquicio de configuracao/compatibilidade legada, mas nao altera o indicio principal de SQL Server.
- Como as tabelas talvez possam ser lidas em subetapa futura:
  - consulta somente leitura via ODBC/SQL Server com a conexao indicada no DSN;
  - leitura por ferramenta SQL dedicada, como SSMS ou utilitario equivalente, sem operacoes de escrita;
  - eventual uso de script de leitura com credenciais apropriadas, apenas para inventario de schema e contagem.
- Ferramentas que podem ser necessarias:
  - cliente ODBC ou SQL Server compativel;
  - ferramenta de consulta somente leitura;
  - leitura de arquivos `.sql` de build para entender criacao de estrutura;
  - eventualmente utilitarios antigos de SQL Server/MSDE para contexto historico, sempre sem escrita.
- Riscos de leitura indevida ou alteracao acidental:
  - abrir instaladores ou utilitarios antigos em modo interativo pode alterar configuracoes;
  - conexoes sem confirmacao de somente leitura podem permitir escrita acidental;
  - comandos de descoberta muito amplos podem ficar lentos na rede;
  - arquivos legados de suporte podem conter estados temporarios que nao devem ser tocados.

## 6. Perguntas que a auditoria completa devera responder futuramente

- Quais tabelas existem?
- Quais tabelas nascem vazias?
- Quais tabelas nascem populadas?
- Quais registros parecem estruturais do sistema?
- Quem e usuario?
- Quem e prestador?
- Usuario e prestador sao entidades separadas?
- Existe vinculo usuario/prestador?
- Existem perfis/permissoes padrao?
- Existe usuario admin inicial?
- Existem registros que nao devem ser excluidos?
- Existem tabelas auxiliares/seeds obrigatorias?
- Como nascem procedimentos, materiais, convenios e configuracoes?
- Como isso pode orientar a criacao de nova conta/clinica no Brana Cloud?

## 7. Fora de escopo

- Qualquer alteracao de codigo.
- Qualquer alteracao no banco Brana.
- Qualquer alteracao no EasyDental.
- Qualquer importacao.
- Qualquer correcao textual/mojibake.
- Qualquer decisao definitiva de implementacao.

## 8. Proxima subetapa recomendada

- `EasyDental virgem — Subetapa 1 — inventario somente leitura de tabelas e contagem de registros`

## 9. Plano de testes e verificacao

Como esta etapa e documental, a validacao esperada e:

- confirmar que somente este documento novo e o roadmap foram alterados;
- confirmar que nenhum codigo foi alterado;
- confirmar que nada da pasta EasyDental foi modificado;
- confirmar que `frontend/app.js` nao foi alterado;
- confirmar que `frontend/index.html` nao foi alterado;
- confirmar que `frontend/js/modules` nao foi alterado;
- confirmar que `backend` nao foi alterado;
- confirmar que `banco/schema/migrations/seeds/endpoints` nao foram alterados;
- confirmar que a blindagem textual/mojibake foi respeitada.
