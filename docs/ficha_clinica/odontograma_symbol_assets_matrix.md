# FC4 — correlação individual do snapshot de símbolos

STATUS = COMPLETE (snapshot documental, não render integral).
CONTRACT_PRECEDENCE = P1.CLOSE: [contrato vigente](odontograma_contracts.md).
Matriz é snapshot documental, não contrato funcional concorrente. Notas P1.R1/P0
abaixo são históricas/superseded quanto a cobrança → painel e gaps anteriores
de Procedimentos. TIPMARCA determina alvo, TIPOCOBR é cobrança; símbolo é LIVE.
Não alterar IDs legados em PK web nem ampliar autorização de assets por esta nota.
Snapshot P0D preservado; recomendação de congelamento P0H é histórica superada.
Fonte: backend/scripts/easy_simbolos_catalogo_atual_snapshot.json; SHA-256: 4c452e5145145b853572af787cbc4fb10d014f4c520a3fe29cc8ab3b137a026f
ID é NROSIM legado, não PK web. TIPSIMB usa tiposim. Sem consulta DB. ICONE=preview/picker; BITMAP1/2/3=papéis declarados, não equivalência automática de ícone e símbolo aplicado.

| NROSIM | Descrição | TIPMARCA | TIPSIMB | FIELD | GRAPHIC_FILE | FILE_EXISTS | ASSET_ID / BRANA_PATH | MARKING_TARGET | COMPOSITION_ROLE | SAFE_TO_REUSE | CONFIDENCE |
|---|---|---:|---:|---|---|---|---|---|---|---|---|
| 1 | Coroa | 2 | 1 | icone | int_coroa.bmp | SIM | A0158 / frontend-react/public/assets/easy/int_coroa.bmp | elemento | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 1 | Coroa | 2 | 1 | bitmap1 | int_coroa.bmp | SIM | A0158 / frontend-react/public/assets/easy/int_coroa.bmp | elemento | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 2 | Restauração metálica-fundida | 2 | 1 | icone | int_bloco.bmp | SIM | A1087 / frontend-react/public/assets/easy/int_bloco.bmp | elemento | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 2 | Restauração metálica-fundida | 2 | 1 | bitmap1 | int_bloco.bmp | SIM | A1087 / frontend-react/public/assets/easy/int_bloco.bmp | elemento | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 3 | Selante | 2 | 1 | icone | int_selante.bmp | SIM | A0847 / frontend-react/public/assets/easy/int_selante.bmp | elemento | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 3 | Selante | 2 | 1 | bitmap1 | int_selante.bmp | SIM | A0847 / frontend-react/public/assets/easy/int_selante.bmp | elemento | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 4 | Restauração | 1 | 1 | icone | int_restaura.bmp | SIM | A0953 / frontend-react/public/assets/easy/int_restaura.bmp | faces | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 4 | Restauração | 1 | 1 | bitmap1 | int_restaura.bmp | SIM | A0953 / frontend-react/public/assets/easy/int_restaura.bmp | faces | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 5 | Prótese parcial fixa | 3 | 1 | icone | int_fixa.bmp | SIM | A0929 / frontend-react/public/assets/easy/int_fixa.bmp | trecho contíguo | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 5 | Prótese parcial fixa | 3 | 1 | bitmap1 | int_fixa.bmp | SIM | A0929 / frontend-react/public/assets/easy/int_fixa.bmp | trecho contíguo | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 6 | Prótese parcial removível | 6 | 1 | icone | int_movel.bmp | SIM | A0525 / frontend-react/public/assets/easy/int_movel.bmp | trechos por arcada sem lacunas | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 6 | Prótese parcial removível | 6 | 1 | bitmap1 | int_movel.bmp | SIM | A0525 / frontend-react/public/assets/easy/int_movel.bmp | trechos por arcada sem lacunas | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 7 | Prótese adesiva | 3 | 1 | icone | int_adesiva.bmp | SIM | A0276 / frontend-react/public/assets/easy/int_adesiva.bmp | trecho contíguo | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 7 | Prótese adesiva | 3 | 1 | bitmap1 | int_adesiva.bmp | SIM | A0276 / frontend-react/public/assets/easy/int_adesiva.bmp | trecho contíguo | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 8 | Profilaxia | 5 | 1 | icone | int_prof.bmp | SIM | A0789 / frontend-react/public/assets/easy/int_prof.bmp | área geral | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 8 | Profilaxia | 5 | 1 | bitmap1 | int_prof.bmp | SIM | A0789 / frontend-react/public/assets/easy/int_prof.bmp | área geral | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 9 | Implante | 2 | 1 | icone | int_implante.bmp | SIM | A1194 / frontend-react/public/assets/easy/int_implante.bmp | elemento | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 9 | Implante | 2 | 1 | bitmap1 | int_implante.bmp | SIM | A1194 / frontend-react/public/assets/easy/int_implante.bmp | elemento | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 10 | Consulta | 5 | 1 | icone | int_consulta.bmp | SIM | A0829 / frontend-react/public/assets/easy/int_consulta.bmp | área geral | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 10 | Consulta | 5 | 1 | bitmap1 | int_consulta.bmp | SIM | A0829 / frontend-react/public/assets/easy/int_consulta.bmp | área geral | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 11 | Raio X | 2 | 1 | icone | int_raiox.bmp | SIM | A0841 / frontend-react/public/assets/easy/int_raiox.bmp | elemento | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 11 | Raio X | 2 | 1 | bitmap1 | int_raiox.bmp | SIM | A0841 / frontend-react/public/assets/easy/int_raiox.bmp | elemento | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 12 | Tratamento de canal | 2 | 1 | icone | int_canal.bmp | SIM | A0184 / frontend-react/public/assets/easy/int_canal.bmp | elemento | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 12 | Tratamento de canal | 2 | 1 | bitmap1 | int_canal.bmp | SIM | A0184 / frontend-react/public/assets/easy/int_canal.bmp | elemento | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 13 | Exodontia | 2 | 1 | icone | int_boticao.bmp | SIM | A0873 / frontend-react/public/assets/easy/int_boticao.bmp | elemento | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 13 | Exodontia | 2 | 1 | bitmap1 | int_boticao.bmp | SIM | A0873 / frontend-react/public/assets/easy/int_boticao.bmp | elemento | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 14 | Núcleo | 2 | 1 | icone | int_nucleo.bmp | SIM | A0320 / frontend-react/public/assets/easy/int_nucleo.bmp | elemento | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 14 | Núcleo | 2 | 1 | bitmap1 | int_nucleo.bmp | SIM | A0320 / frontend-react/public/assets/easy/int_nucleo.bmp | elemento | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 15 | Apicectomia | 2 | 1 | icone | int_apicecto.bmp | SIM | A0344 / frontend-react/public/assets/easy/int_apicecto.bmp | elemento | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 15 | Apicectomia | 2 | 1 | bitmap1 | int_apicecto.bmp | SIM | A0344 / frontend-react/public/assets/easy/int_apicecto.bmp | elemento | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 16 | Gengivectomia | 3 | 1 | icone | int_gengivec.bmp | SIM | A0964 / frontend-react/public/assets/easy/int_gengivec.bmp | trecho contíguo | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 16 | Gengivectomia | 3 | 1 | bitmap1 | int_gengivec.bmp | SIM | A0964 / frontend-react/public/assets/easy/int_gengivec.bmp | trecho contíguo | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 17 | Retalho | 3 | 1 | icone | int_retalho.bmp | SIM | A0512 / frontend-react/public/assets/easy/int_retalho.bmp | trecho contíguo | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 17 | Retalho | 3 | 1 | bitmap1 | int_retalho.bmp | SIM | A0512 / frontend-react/public/assets/easy/int_retalho.bmp | trecho contíguo | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 18 | Raspagem para grupo de dentes | 3 | 1 | icone | int_raspagem.bmp | SIM | A0287 / frontend-react/public/assets/easy/int_raspagem.bmp | trecho contíguo | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 18 | Raspagem para grupo de dentes | 3 | 1 | bitmap1 | int_raspagem.bmp | SIM | A0287 / frontend-react/public/assets/easy/int_raspagem.bmp | trecho contíguo | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 19 | Mantenedor de espaço | 2 | 1 | icone | int_mantene.bmp | SIM | A0633 / frontend-react/public/assets/easy/int_mantene.bmp | elemento | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 19 | Mantenedor de espaço | 2 | 1 | bitmap1 | int_mantene.bmp | SIM | A0633 / frontend-react/public/assets/easy/int_mantene.bmp | elemento | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 20 | Aplicação de flúor | 5 | 1 | icone | int_fluor.bmp | SIM | A0145 / frontend-react/public/assets/easy/int_fluor.bmp | área geral | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 20 | Aplicação de flúor | 5 | 1 | bitmap1 | int_fluor.bmp | SIM | A0145 / frontend-react/public/assets/easy/int_fluor.bmp | área geral | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 21 | Bandagem | 6 | 1 | icone | int_banda.bmp | SIM | A0853 / frontend-react/public/assets/easy/int_banda.bmp | trechos por arcada sem lacunas | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 21 | Bandagem | 6 | 1 | bitmap1 | int_banda.bmp | SIM | A0853 / frontend-react/public/assets/easy/int_banda.bmp | trechos por arcada sem lacunas | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 22 | Bracket | 6 | 1 | icone | int_bracket.bmp | SIM | A0764 / frontend-react/public/assets/easy/int_bracket.bmp | trechos por arcada sem lacunas | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 22 | Bracket | 6 | 1 | bitmap1 | int_bracket.bmp | SIM | A0764 / frontend-react/public/assets/easy/int_bracket.bmp | trechos por arcada sem lacunas | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 23 | Manutenção | 5 | 1 | icone | int_manuten.bmp | SIM | A0179 / frontend-react/public/assets/easy/int_manuten.bmp | área geral | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 23 | Manutenção | 5 | 1 | bitmap1 | int_manuten.bmp | SIM | A0179 / frontend-react/public/assets/easy/int_manuten.bmp | área geral | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 24 | Prótese total | 4 | 1 | icone | int_total.bmp | SIM | A0358 / frontend-react/public/assets/easy/int_total.bmp | arcada | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 24 | Prótese total | 4 | 1 | bitmap1 | int_total.bmp | SIM | A0358 / frontend-react/public/assets/easy/int_total.bmp | arcada | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 25 | Enxerto | 3 | 1 | icone | int_enxerto.bmp | SIM | A0769 / frontend-react/public/assets/easy/int_enxerto.bmp | trecho contíguo | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 25 | Enxerto | 3 | 1 | bitmap1 | int_enxerto.bmp | SIM | A0769 / frontend-react/public/assets/easy/int_enxerto.bmp | trecho contíguo | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 26 | Frenectomia | 5 | 1 | icone | int_frenec.bmp | SIM | A0678 / frontend-react/public/assets/easy/int_frenec.bmp | área geral | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 26 | Frenectomia | 5 | 1 | bitmap1 | int_frenec.bmp | SIM | A0678 / frontend-react/public/assets/easy/int_frenec.bmp | área geral | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 27 | Raspagem para toda a boca | 5 | 1 | icone | int_raspger.bmp | SIM | A1213 / frontend-react/public/assets/easy/int_raspger.bmp | área geral | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 27 | Raspagem para toda a boca | 5 | 1 | bitmap1 | int_raspger.bmp | SIM | A1213 / frontend-react/public/assets/easy/int_raspger.bmp | área geral | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 28 | Ensino de higiene oral | 5 | 1 | icone | int_eho.bmp | SIM | A1004 / frontend-react/public/assets/easy/int_eho.bmp | área geral | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 28 | Ensino de higiene oral | 5 | 1 | bitmap1 | int_eho.bmp | SIM | A1004 / frontend-react/public/assets/easy/int_eho.bmp | área geral | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 29 | Provisório para grupo | 3 | 1 | icone | int_provgru.bmp | SIM | A0843 / frontend-react/public/assets/easy/int_provgru.bmp | trecho contíguo | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 29 | Provisório para grupo | 3 | 1 | bitmap1 | int_provgru.bmp | SIM | A0843 / frontend-react/public/assets/easy/int_provgru.bmp | trecho contíguo | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 30 | Provisório por elemento | 2 | 1 | icone | int_provele.bmp | SIM | A0117 / frontend-react/public/assets/easy/int_provele.bmp | elemento | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 30 | Provisório por elemento | 2 | 1 | bitmap1 | int_provele.bmp | SIM | A0117 / frontend-react/public/assets/easy/int_provele.bmp | elemento | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 31 | Branqueamento | 3 | 1 | icone | int_bran.bmp | SIM | A0076 / frontend-react/public/assets/easy/int_bran.bmp | trecho contíguo | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 31 | Branqueamento | 3 | 1 | bitmap1 | int_bran.bmp | SIM | A0076 / frontend-react/public/assets/easy/int_bran.bmp | trecho contíguo | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 32 | Ajustes gerais | 3 | 1 | icone | int_ajuste.bmp | SIM | A0944 / frontend-react/public/assets/easy/int_ajuste.bmp | trecho contíguo | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 32 | Ajustes gerais | 3 | 1 | bitmap1 | int_ajuste.bmp | SIM | A0944 / frontend-react/public/assets/easy/int_ajuste.bmp | trecho contíguo | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 33 | Raio X panorâmico | 5 | 1 | icone | int_panoram.bmp | SIM | A1048 / frontend-react/public/assets/easy/int_panoram.bmp | área geral | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 33 | Raio X panorâmico | 5 | 1 | bitmap1 | int_panoram.bmp | SIM | A1048 / frontend-react/public/assets/easy/int_panoram.bmp | área geral | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 34 | Raio X lateral | 5 | 1 | icone | int_lateral.bmp | SIM | A0863 / frontend-react/public/assets/easy/int_lateral.bmp | área geral | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 34 | Raio X lateral | 5 | 1 | bitmap1 | int_lateral.bmp | SIM | A0863 / frontend-react/public/assets/easy/int_lateral.bmp | área geral | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 35 | Raio X oclusal | 5 | 1 | icone | int_oclusal.bmp | SIM | A0546 / frontend-react/public/assets/easy/int_oclusal.bmp | área geral | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 35 | Raio X oclusal | 5 | 1 | bitmap1 | int_oclusal.bmp | SIM | A0546 / frontend-react/public/assets/easy/int_oclusal.bmp | área geral | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 36 | Raio X mão e punho | 5 | 1 | icone | int_maopunho.bmp | SIM | A0013 / frontend-react/public/assets/easy/int_maopunho.bmp | área geral | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 36 | Raio X mão e punho | 5 | 1 | bitmap1 | int_maopunho.bmp | SIM | A0013 / frontend-react/public/assets/easy/int_maopunho.bmp | área geral | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 37 | Placa de mordida | 5 | 1 | icone | int_mordida.bmp | SIM | A1066 / frontend-react/public/assets/easy/int_mordida.bmp | área geral | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 37 | Placa de mordida | 5 | 1 | bitmap1 | int_mordida.bmp | SIM | A1066 / frontend-react/public/assets/easy/int_mordida.bmp | área geral | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 38 | Raio X Bite-Wing | 3 | 1 | icone | int_byte.bmp | SIM | A0295 / frontend-react/public/assets/easy/int_byte.bmp | trecho contíguo | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 38 | Raio X Bite-Wing | 3 | 1 | bitmap1 | int_byte.bmp | SIM | A0295 / frontend-react/public/assets/easy/int_byte.bmp | trecho contíguo | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 39 | Faceta | 2 | 1 | icone | int_faceta.bmp | SIM | A0394 / frontend-react/public/assets/easy/int_faceta.bmp | elemento | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 39 | Faceta | 2 | 1 | bitmap1 | int_faceta.bmp | SIM | A0394 / frontend-react/public/assets/easy/int_faceta.bmp | elemento | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 40 | Emergência | 5 | 1 | icone | int_emerg.bmp | SIM | A0494 / frontend-react/public/assets/easy/int_emerg.bmp | área geral | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 40 | Emergência | 5 | 1 | bitmap1 | int_emerg.bmp | SIM | A0494 / frontend-react/public/assets/easy/int_emerg.bmp | área geral | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 41 | Modelo de estudo | 5 | 1 | icone | int_modelo.bmp | SIM | A0866 / frontend-react/public/assets/easy/int_modelo.bmp | área geral | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 41 | Modelo de estudo | 5 | 1 | bitmap1 | int_modelo.bmp | SIM | A0866 / frontend-react/public/assets/easy/int_modelo.bmp | área geral | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 42 | Reembasamento | 5 | 1 | icone | int_reemb.bmp | SIM | A0580 / frontend-react/public/assets/easy/int_reemb.bmp | área geral | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 42 | Reembasamento | 5 | 1 | bitmap1 | int_reemb.bmp | SIM | A0580 / frontend-react/public/assets/easy/int_reemb.bmp | área geral | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 43 | Fotos | 5 | 1 | icone | int_fotos.bmp | SIM | A0324 / frontend-react/public/assets/easy/int_fotos.bmp | área geral | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 43 | Fotos | 5 | 1 | bitmap1 | int_fotos.bmp | SIM | A0324 / frontend-react/public/assets/easy/int_fotos.bmp | área geral | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 44 | Desgaste seletivo | 5 | 1 | icone | int_desgas.bmp | SIM | A0848 / frontend-react/public/assets/easy/int_desgas.bmp | área geral | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 44 | Desgaste seletivo | 5 | 1 | bitmap1 | int_desgas.bmp | SIM | A0848 / frontend-react/public/assets/easy/int_desgas.bmp | área geral | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 45 | Cirurgia | 5 | 1 | icone | int_cirur.bmp | SIM | A0923 / frontend-react/public/assets/easy/int_cirur.bmp | área geral | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 45 | Cirurgia | 5 | 1 | bitmap1 | int_cirur.bmp | SIM | A0923 / frontend-react/public/assets/easy/int_cirur.bmp | área geral | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 46 | Hemisecção | 2 | 1 | icone | int_hemi.bmp | SIM | A0398 / frontend-react/public/assets/easy/int_hemi.bmp | elemento | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 46 | Hemisecção | 2 | 1 | bitmap1 | int_hemi.bmp | SIM | A0398 / frontend-react/public/assets/easy/int_hemi.bmp | elemento | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 47 | Rizectomia | 2 | 1 | icone | int_rizec.bmp | SIM | A0753 / frontend-react/public/assets/easy/int_rizec.bmp | elemento | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 47 | Rizectomia | 2 | 1 | bitmap1 | int_rizec.bmp | SIM | A0753 / frontend-react/public/assets/easy/int_rizec.bmp | elemento | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 48 | Pulpotomia | 2 | 1 | icone | int_pulpo.bmp | SIM | A0751 / frontend-react/public/assets/easy/int_pulpo.bmp | elemento | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 48 | Pulpotomia | 2 | 1 | bitmap1 | int_pulpo.bmp | SIM | A0751 / frontend-react/public/assets/easy/int_pulpo.bmp | elemento | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 49 | Aumento de coroa clínica | 2 | 1 | icone | int_aumen.bmp | SIM | A0337 / frontend-react/public/assets/easy/int_aumen.bmp | elemento | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 49 | Aumento de coroa clínica | 2 | 1 | bitmap1 | int_aumen.bmp | SIM | A0337 / frontend-react/public/assets/easy/int_aumen.bmp | elemento | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 50 | Tunelização | 2 | 1 | icone | int_tunel.bmp | SIM | A0307 / frontend-react/public/assets/easy/int_tunel.bmp | elemento | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 50 | Tunelização | 2 | 1 | bitmap1 | int_tunel.bmp | SIM | A0307 / frontend-react/public/assets/easy/int_tunel.bmp | elemento | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 51 | Ulectomia | 2 | 1 | icone | int_ulecto.bmp | SIM | A0157 / frontend-react/public/assets/easy/int_ulecto.bmp | elemento | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 51 | Ulectomia | 2 | 1 | bitmap1 | int_ulecto.bmp | SIM | A0157 / frontend-react/public/assets/easy/int_ulecto.bmp | elemento | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 52 | Attachment | 2 | 1 | icone | int_attach.bmp | SIM | A0340 / frontend-react/public/assets/easy/int_attach.bmp | elemento | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 52 | Attachment | 2 | 1 | bitmap1 | int_attach.bmp | SIM | A0340 / frontend-react/public/assets/easy/int_attach.bmp | elemento | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 53 | Capeamento | 2 | 1 | icone | int_capea.bmp | SIM | A1050 / frontend-react/public/assets/easy/int_capea.bmp | elemento | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 53 | Capeamento | 2 | 1 | bitmap1 | int_capea.bmp | SIM | A1050 / frontend-react/public/assets/easy/int_capea.bmp | elemento | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 54 | Perícia | 5 | 1 | icone | int_peric.bmp | SIM | A1141 / frontend-react/public/assets/easy/int_peric.bmp | área geral | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 54 | Perícia | 5 | 1 | bitmap1 | int_peric.bmp | SIM | A1141 / frontend-react/public/assets/easy/int_peric.bmp | área geral | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 55 | Controle de placa bacteriana | 5 | 1 | icone | int_placa.bmp | SIM | A0912 / frontend-react/public/assets/easy/int_placa.bmp | área geral | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 55 | Controle de placa bacteriana | 5 | 1 | bitmap1 | int_placa.bmp | SIM | A0912 / frontend-react/public/assets/easy/int_placa.bmp | área geral | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 56 | Prótese (diversos | 5 | 1 | icone | int_protese.bmp | SIM | A0357 / frontend-react/public/assets/easy/int_protese.bmp | área geral | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 56 | Prótese (diversos | 5 | 1 | bitmap1 | int_protese.bmp | SIM | A0357 / frontend-react/public/assets/easy/int_protese.bmp | área geral | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 57 | Símbolo genérico (dente | 2 | 1 | icone | sim_outras.bmp | SIM | A0934 / frontend-react/public/assets/Icones/sim_outras.bmp | elemento | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 57 | Símbolo genérico (dente | 2 | 1 | bitmap1 | sim_outras.bmp | SIM | A0934 / frontend-react/public/assets/Icones/sim_outras.bmp | elemento | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 58 | Símbolo genérico (grupo | 3 | 1 | icone | sim_outras.bmp | SIM | A0934 / frontend-react/public/assets/Icones/sim_outras.bmp | trecho contíguo | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 58 | Símbolo genérico (grupo | 3 | 1 | bitmap1 | sim_outras.bmp | SIM | A0934 / frontend-react/public/assets/Icones/sim_outras.bmp | trecho contíguo | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 59 | Polimento | 2 | 1 | icone | int_poli.bmp | SIM | A0759 / frontend-react/public/assets/easy/int_poli.bmp | elemento | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 59 | Polimento | 2 | 1 | bitmap1 | int_poli.bmp | SIM | A0759 / frontend-react/public/assets/easy/int_poli.bmp | elemento | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 60 | Dente semi-incluso | 2 | 1 | icone | dia_semi.bmp | SIM | A0765 / frontend-react/public/assets/easy/dia_semi.bmp | elemento | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 60 | Dente semi-incluso | 2 | 1 | bitmap1 | dia_semi.bmp | SIM | A0765 / frontend-react/public/assets/easy/dia_semi.bmp | elemento | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 61 | Dente incluso | 2 | 1 | icone | dia_incluso.bmp | SIM | A1028 / frontend-react/public/assets/easy/dia_incluso.bmp | elemento | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 61 | Dente incluso | 2 | 1 | bitmap1 | dia_incluso.bmp | SIM | A1028 / frontend-react/public/assets/easy/dia_incluso.bmp | elemento | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 62 | Dente incluso-impactado | 2 | 1 | icone | dia_impactado.bmp | SIM | A0133 / frontend-react/public/assets/easy/dia_impactado.bmp | elemento | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 62 | Dente incluso-impactado | 2 | 1 | bitmap1 | dia_impactado.bmp | SIM | A0133 / frontend-react/public/assets/easy/dia_impactado.bmp | elemento | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 63 | Descalcificação | 2 | 1 | icone | dia_descalcif.bmp | SIM | A0809 / frontend-react/public/assets/easy/dia_descalcif.bmp | elemento | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 63 | Descalcificação | 2 | 1 | bitmap1 | dia_descalcif.bmp | SIM | A0809 / frontend-react/public/assets/easy/dia_descalcif.bmp | elemento | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 64 | Migração distal | 2 | 1 | icone | dia_distal.bmp | SIM | A0708 / frontend-react/public/assets/easy/dia_distal.bmp | elemento | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 64 | Migração distal | 2 | 1 | bitmap1 | dia_distal.bmp | SIM | A0708 / frontend-react/public/assets/easy/dia_distal.bmp | elemento | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 65 | Migração mesial | 2 | 1 | icone | dia_mesial.bmp | SIM | A0311 / frontend-react/public/assets/easy/dia_mesial.bmp | elemento | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 65 | Migração mesial | 2 | 1 | bitmap1 | dia_mesial.bmp | SIM | A0311 / frontend-react/public/assets/easy/dia_mesial.bmp | elemento | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 66 | Erosão vestibular | 2 | 1 | icone | dia_erosao.bmp | SIM | A0779 / frontend-react/public/assets/easy/dia_erosao.bmp | elemento | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 66 | Erosão vestibular | 2 | 1 | bitmap1 | dia_erosao.bmp | SIM | A0779 / frontend-react/public/assets/easy/dia_erosao.bmp | elemento | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 67 | Extrusão | 2 | 1 | icone | dia_extrusao.bmp | SIM | A0148 / frontend-react/public/assets/easy/dia_extrusao.bmp | elemento | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 67 | Extrusão | 2 | 1 | bitmap1 | dia_extrusao.bmp | SIM | A0148 / frontend-react/public/assets/easy/dia_extrusao.bmp | elemento | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 68 | Intrusão | 2 | 1 | icone | dia_intrusao.bmp | SIM | A0461 / frontend-react/public/assets/easy/dia_intrusao.bmp | elemento | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 68 | Intrusão | 2 | 1 | bitmap1 | dia_intrusao.bmp | SIM | A0461 / frontend-react/public/assets/easy/dia_intrusao.bmp | elemento | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 69 | Fissura de esmalte | 2 | 1 | icone | dia_fissura.bmp | SIM | A0924 / frontend-react/public/assets/easy/dia_fissura.bmp | elemento | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 69 | Fissura de esmalte | 2 | 1 | bitmap1 | dia_fissura.bmp | SIM | A0924 / frontend-react/public/assets/easy/dia_fissura.bmp | elemento | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 70 | Fluorose | 2 | 1 | icone | dia_fluorose.bmp | SIM | A0022 / frontend-react/public/assets/easy/dia_fluorose.bmp | elemento | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 70 | Fluorose | 2 | 1 | bitmap1 | dia_fluorose.bmp | SIM | A0022 / frontend-react/public/assets/easy/dia_fluorose.bmp | elemento | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 71 | Giroversão | 2 | 1 | icone | dia_giroversao.bmp | SIM | A0470 / frontend-react/public/assets/easy/dia_giroversao.bmp | elemento | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 71 | Giroversão | 2 | 1 | bitmap1 | dia_giroversao.bmp | SIM | A0470 / frontend-react/public/assets/easy/dia_giroversao.bmp | elemento | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 72 | Lesão apical | 2 | 1 | icone | dia_lesao.bmp | SIM | A1113 / frontend-react/public/assets/easy/dia_lesao.bmp | elemento | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 72 | Lesão apical | 2 | 1 | bitmap1 | dia_lesao.bmp | SIM | A1113 / frontend-react/public/assets/easy/dia_lesao.bmp | elemento | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 73 | Fratura de raiz | 2 | 1 | icone | dia_fratura.bmp | SIM | A0726 / frontend-react/public/assets/easy/dia_fratura.bmp | elemento | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 73 | Fratura de raiz | 2 | 1 | bitmap1 | dia_fratura.bmp | SIM | A0726 / frontend-react/public/assets/easy/dia_fratura.bmp | elemento | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 74 | Trepanação | 2 | 1 | icone | dia_trepanacao.bmp | SIM | A0820 / frontend-react/public/assets/easy/dia_trepanacao.bmp | elemento | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 74 | Trepanação | 2 | 1 | bitmap1 | dia_trepanacao.bmp | SIM | A0820 / frontend-react/public/assets/easy/dia_trepanacao.bmp | elemento | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 75 | Ausência de raiz | 2 | 1 | icone | dia_ausraiz.bmp | SIM | A1025 / frontend-react/public/assets/easy/dia_ausraiz.bmp | elemento | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 75 | Ausência de raiz | 2 | 1 | bitmap1 | dia_ausraiz.bmp | SIM | A1025 / frontend-react/public/assets/easy/dia_ausraiz.bmp | elemento | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 76 | Ausência de coroa | 2 | 1 | icone | dia_auscoroa.bmp | SIM | A0356 / frontend-react/public/assets/easy/dia_auscoroa.bmp | elemento | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 76 | Ausência de coroa | 2 | 1 | bitmap1 | dia_auscoroa.bmp | SIM | A0356 / frontend-react/public/assets/easy/dia_auscoroa.bmp | elemento | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 77 | Restauração MOD | 1 | 1 | icone | int_restmod.bmp | SIM | A1161 / frontend-react/public/assets/easy/int_RestMOD.bmp | faces | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 77 | Restauração MOD | 1 | 1 | bitmap1 | int_restmod.bmp | SIM | A1161 / frontend-react/public/assets/easy/int_RestMOD.bmp | faces | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 78 | Restauração MO | 1 | 1 | icone | int_restmo.bmp | SIM | A0859 / frontend-react/public/assets/easy/int_RestMO.bmp | faces | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 78 | Restauração MO | 1 | 1 | bitmap1 | int_restmo.bmp | SIM | A0859 / frontend-react/public/assets/easy/int_RestMO.bmp | faces | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 79 | Restauração DO | 1 | 1 | icone | int_restdo.bmp | SIM | A0221 / frontend-react/public/assets/easy/int_RestDO.bmp | faces | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 79 | Restauração DO | 1 | 1 | bitmap1 | int_restdo.bmp | SIM | A0221 / frontend-react/public/assets/easy/int_RestDO.bmp | faces | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |
| 80 | Supra-numerário | 2 | 1 | icone | dia_supranum.bmp | SIM | A0058 / frontend-react/public/assets/easy/dia_supranum.bmp | elemento | preview/picker | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 80 | Supra-numerário | 2 | 1 | bitmap1 | dia_supranum.bmp | SIM | A0058 / frontend-react/public/assets/easy/dia_supranum.bmp | elemento | recurso declarado; compositor futuro | UNPROVEN | PROVEN no snapshot; efeito individual não inferido |
| 81 | Raspagem para arcada | 4 | 1 | icone | int_raspagem.bmp | SIM | A0287 / frontend-react/public/assets/easy/int_raspagem.bmp | arcada | preview/picker | SIM | PROVEN no snapshot; efeito individual não inferido |
| 81 | Raspagem para arcada | 4 | 1 | bitmap1 | int_raspagem.bmp | SIM | A0287 / frontend-react/public/assets/easy/int_raspagem.bmp | arcada | recurso declarado; compositor futuro | SIM | PROVEN no snapshot; efeito individual não inferido |

Símbolos=81; nomes gráficos únicos=79; referências ausentes=0.
SYMBOL_ASSET_MATRIX_STATUS=COMPLETE. Existência COMPLETE; composição clínica PARTIAL. Todos os alvos por TIPMARCA classificados. UNPROVEN de autorização não foi promovido a SIM.
Ver [mapa](odontograma_assets_map.md) para metadados/hash/aliases/callers.

## Continuidade P0H — snapshot documental versus aplicação clínica (histórico superado)

CURRENT_BASELINE = b47114f9cc60c54981391c7c23baa21d83a0aeb6.
As linhas, IDs, nomes, caminhos e autorização do snapshot P0D permanecem intactos:
81 símbolos, 79 nomes gráficos, 0 referências ausentes. Snapshot documental do
catálogo não equivale a snapshot persistido por intervenção.

LEGACY_EVIDENCE: SYMBOL_HISTORY_RULE=HYBRID; tipo aplicado sem snapshot explícito
completo. BRANA_ARCHITECTURE_RECOMMENDATION: preservar representação aplicada e
tipo de marcação na intervenção, mantendo referência ao catálogo separada.
P1 deve definir identidade/versionamento e read model para que alteração futura
do procedimento/símbolo não reinterprete silenciosamente a associação histórica.
Não é prova de preservação integral legado, escolha de schema ou novo renderer.

Autorização A/B/C/D não muda com essa recomendação. Categoria C/UNPROVEN não foi
promovida; ícone de picker não substitui recurso clínico composto. Primeira fase
visual FC4-P3, com aviso prévio e homologação manual; composição permanece futura.

## P1.R1 — simbolização obrigatória e catálogo LIVE

CURRENT_BASELINE_P1_R1 = 6e7cdd5de3551f4d1b120f5d0da579e364746d38.
EVIDENCE_TYPE = USER_MANUAL_RUNTIME_EVIDENCE D01/D03/D09/D10.
Snapshot P0D permanece intacto: 81 símbolos / 79 nomes gráficos / zero referências
ausentes. MARKING_TARGET registra TIPMARCA naquele snapshot; NÃO é algoritmo
suficiente para escolher painel operacional atual, que também depende da cobrança.
SAFE_TO_REUSE/C/UNPROVEN não mudam. Não reauditar ou liberar automaticamente assets.

PROCEDURE_SYMBOL_REQUIRED = SIM. VALID_PROCEDURE_WITHOUT_SYMBOL = NÃO.
BRANA_EXISTING_PROCEDURES_WITHOUT_SYMBOL = DATA_INTEGRITY_GAP.
Símbolo/descrição seguem cadastro vivo, inclusive em ocorrências já existentes;
valores paciente/repasse não seguem catálogo. Não usar esta matriz documental
como snapshot congelado de símbolo por intervenção. Versionar cache/manifest de
asset é técnico; o renderer resolve o símbolo atual, sem fallback inventado.

INTERVENTION_CLASS_SYMBOL_RENDER_TARGET = SIDE_PANEL.
ELEMENT_FACE_SYMBOL_RENDER_TARGET = ODONTOGRAM.
Unidades conscientes repetidas não se fundem; símbolos idênticos podem se sobrepor.
Cor vem de USER_PREFERENCE, não da situação como cor clínica fixa.
Tipos/alvos/faixas/faces aplicados ainda preservam identidade da seleção; mudança
de catálogo não reidentifica slot. Compatibilidade de troca de classificação/
TIPMARCA precisa validação técnica, não congelamento geral de nome/símbolo.

Auditoria de símbolos nulos e regularização são módulo separado Procedimentos,
NÃO iniciado. Primeira fase visual FC4-P3, avisar antes e homologar manualmente.
Referência vigente: [contratos](odontograma_contracts.md) e
[checkpoint P1.R1](../checkpoints/ficha_clinica_odontograma_fc4_p1_r1_checkpoint.md).
