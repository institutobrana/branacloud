# Auditoria de assets do `assets/easy` para odontograma

## 1. Objetivo
Verificar se o diretório local `D:\BRANA ARQUIVOS\BRANA CLOUD\assets\easy` contém símbolos, imagens, sprites ou outros assets visuais que possam orientar a evolução visual futura do odontograma Brana.

## 2. Escopo
- Auditoria somente leitura do conteúdo visual existente em `assets/easy`.
- Classificacao conservadora dos arquivos como potenciais assets odontologicos, icones de interface ou recursos gerais do legado.
- Sem alterar codigo, banco, frontend, backend, migrations ou os proprios arquivos de asset.

## 3. Confirmacao de etapa somente leitura
Esta etapa foi executada apenas como auditoria. Nenhum arquivo foi movido, renomeado, copiado, convertido ou editado.

## 4. Caminho auditado
- `D:\BRANA ARQUIVOS\BRANA CLOUD\assets\easy`

## 5. Estrutura de pastas
- Total de arquivos encontrados: `313`
- Extensao unica observada: `.bmp`
- Pastas encontradas:
  - raiz de `assets/easy`: `261` arquivos
  - subpasta `dentes`: `52` arquivos

## 6. Extensoes encontradas
- `.bmp` בלבד

## 7. Assets potencialmente uteis ao odontograma

### 7.1 Mais promissores para leitura visual da arcada
- `dentes\arc_dente11.bmp` a `dentes\arc_dente18.bmp`
- `dentes\arc_dente21.bmp` a `dentes\arc_dente28.bmp`
- `dentes\arc_dente31.bmp` a `dentes\arc_dente38.bmp`
- `dentes\arc_dente41.bmp` a `dentes\arc_dente48.bmp`
- `dentes\arc_dente51.bmp` a `dentes\arc_dente55.bmp`
- `dentes\arc_dente61.bmp` a `dentes\arc_dente65.bmp`
- `dentes\arc_dente71.bmp` a `dentes\arc_dente75.bmp`
- `dentes\arc_dente81.bmp` a `dentes\arc_dente85.bmp`
- `arc_superior_perm.bmp`
- `arc_inferior_perm.bmp`
- `arc_faces.bmp`

### 7.2 Símbolos e estados visuais
- `sim_default.bmp`
- `sim_face.bmp`
- `sim_face_40.bmp`
- `sim_prov.bmp`
- `sim_simb1.bmp` a `sim_simb36.bmp`
- `sim_bra.bmp`, `sim_bra_40.bmp`
- `sim_rx.bmp`, `sim_raiox.bmp`
- `sim_ajuste.bmp`, `sim_attach.bmp`, `sim_modelo.bmp`, `sim_poli.bmp`, `sim_sel.bmp`, `sim_ulec.bmp`

### 7.3 Icones de intervencao e procedimentos
- `int_coroa.bmp`
- `int_implante.bmp`
- `int_fixa.bmp`
- `int_nucleo.bmp`
- `int_oclusal.bmp`
- `int_raiox.bmp`
- `int_pulpo.bmp`
- `int_canal.bmp`
- `int_protese.bmp`
- `int_total.bmp`
- `int_selante.bmp`
- `int_raspagem.bmp`
- `int_restaura.bmp`
- `int_modelo.bmp`
- `int_panoram.bmp`
- `int_fotos.bmp`

### 7.4 Icones gerais de interface com possivel uso auxiliar
- `cmd_odontograma.bmp`
- `cmd_procura.bmp`
- `cmd_imprime.bmp`
- `cmd_grava.bmp`
- `cmd_novo.bmp`
- `cmd_altera.bmp`
- `cmd_cancela.bmp`
- `cmd_lixo.bmp`
- `cmd_help.bmp`
- `ico_alert.bmp`
- `ico_alerta.bmp`
- `ico_check.bmp`
- `ico_check_prn.bmp`
- `ico_foto.bmp`
- `ico_quest.bmp`

## 8. Fatos confirmados
- Todo o acervo auditado usa formato `.bmp`.
- A maior parte dos arquivos esta na raiz de `assets/easy`.
- A subpasta `dentes` concentra 52 arquivos com numeracao odontologica clara.
- O prefixo `arc_` aparece em arquivos diretamente ligados a arcada e faces.
- O prefixo `sim_` aparece em arquivos de simbolos/estados visuais.
- O prefixo `int_` aparece em arquivos de intervencao/procedimento.
- O prefixo `cmd_` aparece em icones de comando de interface.
- Nao foram encontrados, nesta auditoria, arquivos em `png`, `jpg`, `svg`, `ico`, `webp` ou outros formatos nao-BMP.

## 9. Hipoteses de uso
- `arc_denteXX.bmp` parecem ser os melhores candidatos para visualizacao de dentes ou slots da arcada.
- `arc_superior_perm.bmp` e `arc_inferior_perm.bmp` parecem representar arcadas superior e inferior do legado.
- `arc_faces.bmp` parece servir como referencia de faces ou mapa facial.
- `sim_*` parece conter simbolos pequenos para estados, marcadores ou desenhos clinicos.
- `int_*` parece conter icones ligados a procedimentos/intervencoes.
- `cmd_odontograma.bmp` parece ser um atalho visual ou botao especifico do modulo odontograma.

## 10. Riscos de reaproveitamento
- O acervo e quase inteiramente legado e em BMP, entao o reaproveitamento direto pode acoplar o Brana ao visual do EasyDental.
- Alguns arquivos podem depender de tamanhos fixos, paleta antiga ou composicao grafica especifica do sistema legado.
- O uso direto pode reduzir flexibilidade de responsividade, temas e acessibilidade.
- Nem todo arquivo com nome promissor deve ser assumido como pronto para uso sem inspeção visual individual.

## 11. Recomendacao para a proxima subetapa
- Usar apenas os assets mais promissores como referencia visual, sem importacao direta de massa.
- Priorizar uma leitura visual da arcada com `arc_denteXX.bmp`, `arc_superior_perm.bmp`, `arc_inferior_perm.bmp` e `arc_faces.bmp`.
- Tratar `sim_*` e `int_*` como candidatos para refinamento posterior, depois de validacao visual individual.
- Evitar acoplamento imediato ao legado BMP na V1, mantendo a arquitetura modular atual.

## 12. Registro para roadmap
- Auditoria documental do diretorio `assets/easy` concluida para orientar a evolucao visual do odontograma Brana.
- Resultado principal: ha acervo visual suficiente para inspirar a proxima subetapa, mas com risco relevante de acoplamento ao legado BMP.
