# FC4 — mapa individual de assets odontológicos

STATUS = COMPLETE: inventário classificado, não autorização universal/render implementado.
Baseline: 1e8f31c2ce9e313a425bd4948b93dc8f01d120e1. Deduplicação SHA-256 por bytes. Nenhuma cópia externa.

## Escopo e convenções

Famílias prioritárias: dentes-limpos, dentes BMP, Dentes2d/3d, arc_faces/arcadas, especialidades/procedimentos/toolbar, assets/Icones, arc_* e gráficos do snapshot. Sem storage clínico/dependências/builds.
A=caller React oficial; B=acervo próprio/local documentado em docs/ficha_clinica_odontograma_refino_visual_easy_referencia_assets.md; C=histórico sem autorização demonstrada; D=terceiro confirmado (nenhum novo incorporado). SAFE_TO_REUSE=SIM somente no PATH autorizado A/B, não licença de diretório.
Callers literais são candidatos, não resolução comprovada para cada alias. NOT_DETECTED não exclui callers dinâmicos. LEGACY_FAMILY_CANDIDATE não afirma que todo arc_* seja usado pelo resolver.
CLINICAL_ROLE: TOOTH_IMAGE=base/variante; FACE_IMAGE=base visual, não hitbox; ARCH_IMAGE=arcada; PROCEDURE_SYMBOL=candidato de símbolo; PROCEDURE_ICON=ícone/picker, não desenho clínico; TOOLBAR_ICON=comando; UNKNOWN=sem regra atribuída.
STATUS_USAGE (todos)=renderer clínico React futuro, sem recoloração presumida. SLOT_USAGE (TOOTH_IMAGE)=FDI no nome, não identidade de slot; demais=TIPMARCA/contexto. FACE_USAGE (FACE_IMAGE)=base visual, hitbox/overlay separados; demais=sem uso por face inferido.
EVIDENCE (todos)=metadados binários + inspeção literal/dinâmica de source + snapshot, conforme relações. CONFIDENCE (todos)=metadados PROVEN; vínculo do snapshot PROVEN como dado documental; papel pelo nome PARTIAL. A/B/C tem evidência específica na coluna.
ALPHA mede canal/transparência disponível, não máscara clínica. Tamanho em bytes. RELATED contém NROSIM/TIPMARCA/TIPSIMB/FIELD. NONE significa sem vínculo no snapshot, não ausência universal.

Arquivos físicos=2147; únicos=1213; SAFE_TO_REUSE=SIM=181.

## Callers indexados

- C754 = CATALOG_PREVIEW
- C753 = DYNAMIC_TEETH_LEGACY
- C752 = DYNAMIC_TEETH_REACT
- C755 = LEGACY_FAMILY_CANDIDATE
- C365 = frontend-react/src/features/fichaClinica/FichaClinicaPage.jsx
- C449 = frontend-react/src/features/pacientes/components/fichaPessoal/anamnese/AnamneseQuestionCard.jsx
- C546 = frontend-react/src/features/procedimentos/procedimentosEditorMappers.js
- C553 = frontend-react/src/features/procedimentosGenericos/ProcedimentoGenericoMateriaisModal.jsx
- C555 = frontend-react/src/features/procedimentosGenericos/ProcedimentoGenericoModal.jsx
- C616 = frontend-react/src/features/simbolosGraficos/model/simboloGraficoEditorBaseLibrary.js
- C693 = frontend/app.js
- C706 = frontend/js/modules/ficha-pessoal-aba-anamnese.js
- C708 = frontend/js/modules/ficha-pessoal-aba-historico.js
- C715 = frontend/js/modules/odontograma-v1-arcada-render.js
- C728 = frontend/js/modules/simbolos-graficos.js
- C730 = frontend/js/modules/toolbar-principal-primeira-onda.js

DYNAMIC_TEETH_REACT=FichaClinicaPage.jsx/arc_dente{FDI}.png; DYNAMIC_TEETH_LEGACY=odontograma-v1-arcada-render.js/arc_dente{FDI}.bmp; CATALOG_PREVIEW=simboloGraficoLibraryMapper.js e procedimentosEditorMappers.js (catálogo, não render clínico); LEGACY_FAMILY_CANDIDATE=resolver de famílias no módulo legado (verificação específica futura).

## Matriz individual

| ASSET_ID | PATH | HASH SHA256 | FORMAT | WIDTH | HEIGHT | ALPHA | SIZE | FAMILY | CURRENT_CALLER | LEGACY_CALLER | RELATED | CATEGORY | SAFE_TO_REUSE | EVIDENCE_AUTH |
|---|---|---|---|---:|---:|---|---:|---|---|---|---|---|---|---|
| A0001 | frontend-react/public/assets/easy/cmd_down.bmp | 0067316ca2a3c0f1bf0a27d9d126f9083aeec921b9140876d9803662b2d0c773 | BMP | 23 | 14 | False | 286 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0002 | frontend-react/public/assets/easy/cmd_fonte.bmp | 006a6f865dc6934ff7f3adf90596fd2deea6c301c5cbef7e7960370f4acf6f55 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0003 | frontend-react/public/assets/Icones/sim_face.bmp | 007ba176bf502258d39c13e276c0ea35f57d7ab47b774c81e7f7b74fb657a622 | BMP | 15 | 15 | False | 122 | PROCEDURE_SYMBOL | C365,C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0004 | assets/Bitmaps/arc_fixa3_13.bmp | 007c6fb67982df72ce2e40c4643e8c547ee4668d3b17782a9fb334bcd18137ed | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0005 | assets/Bitmaps/arc_nucleo_22.bmp | 00a00d0590038b3ba2b0597dc0b5f9d96392e6b1a2718084f4696fb6689220b0 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0006 | frontend-react/public/assets/easy/esp_Endodontia.bmp | 00f9916aec17b61da611fd63a965b8080043cc781a7043417ea796536cc65dda | BMP | 40 | 25 | False | 3054 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | assets/easy do React |
| A0007 | assets/Bitmaps/Dentes2d/arc_dente18a.bmp | 0107bdcff3659979d0045b3ac7de592cd8ec94b53b2a61cdf0710e4876bc683d | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0008 | frontend-react/public/assets/easy/cmd_etiqueta.bmp | 0135f72e4f9e3b765a137e6204b5d4dc41c578bde638434ea366681c607fb289 | BMP | 22 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0009 | assets/Bitmaps/arc_trep_37.bmp | 013b273604624f74e52d26ac1a3902d4d27935ca8fdf7ecd1e9c5ef869d6e591 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0010 | assets/Bitmaps/Dentes2d/arc_dente15.bmp | 01582716fb425bdd3fc89d4f158b2db199b89e6b29c71aa573462aeeb8dedebb | BMP | 32 | 70 | False | 6774 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0011 | assets/Bitmaps/arc_fixa2_44.bmp | 021813cda4cb6ff937fa71242204f4ec2acd56ee60ceabed380aee458d6e8d98 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0012 | frontend-react/public/assets/Icones/sim_simb30.bmp | 02563947b36d41bd52dddf1575af00b88a4216603b1361f31d4281ff77a34108 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0013 | frontend-react/public/assets/easy/int_maopunho.bmp | 02b302687846b01ba41effaa73466446fb2363f1f8a3eb8fd16a840050965fda | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 36/5/1/bitmap1;36/5/1/icone | A | SIM | assets/easy do React |
| A0014 | frontend-react/public/assets/Icones/sim_simb12.bmp | 02b7dea1a3bbf36db3b3613df90d8d2841a5b8b31f0efd1ef05411a76741c04e | BMP | 15 | 15 | False | 122 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0015 | assets/Bitmaps/arc_canal_15.bmp | 02de3f8bfb058513343ef6b26e0e4832a6793aadbe1fe3560daa6014f61bcb8f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0016 | assets/Bitmaps/arc_enxerto_s.bmp | 035f1762197c3b9c473ff274f438110668cb84401d81eeb1561b38b10e767496 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0017 | frontend-react/public/assets/easy/ico_dedo.bmp | 03abf29f678a2b627d873b101b314aa679a7f1242a31ab1b64a29ac67f40c300 | BMP | 17 | 10 | False | 238 | TOOLBAR_ICON | C449 | C706 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0018 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente34.png | 03c215a32f86665a17b6434986b265465c3743997a6a67c2013647197456d8eb | PNG | 32 | 70 | True | 1016 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0019 | assets/Bitmaps/arc_descal_45.bmp | 03efa908b8a29d764e7525c4be1dac38d8f20c71ae7e59705b4e6e00d738f635 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0020 | frontend-react/public/assets/easy/cmd_last.bmp | 03f6070791f58068f0e428a29267153b4ee7302f0ffe927f3ea6ce6aa1cea59f | BMP | 16 | 21 | False | 286 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0021 | assets/Bitmaps/arc_capeamento_28.bmp | 047bbd05c055126ec521a2ba655374936f62b2aa6f777f3bcd6c2c8a0f8eaa3e | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0022 | frontend-react/public/assets/easy/dia_fluorose.bmp | 04911f1791f98f4d7fc52e1667f0f8315c5533be528a1a2116365aa1743d8619 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 70/2/1/bitmap1;70/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0023 | assets/Bitmaps/arc_canal_74.bmp | 049d16cae18d7976d334a6b581b5ce2851ad0d4889bb8d9d9dbd96bbb3de9932 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0024 | assets/Bitmaps/Dentes3d/arc_dente52.bmp | 04be1b0fd0c34a4b333eab9676abf9e4872b9c8117fcd03f29544c15cc4ae5e6 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0025 | assets/Bitmaps/arc_fissu_31.bmp | 0500ceca162c802b6ec1382ccb61582788b906ec4af7794be3f732cc1b2e8c7d | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0026 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_generico01.bmp | 05249f5ce5ec094fb63240c697c45f42f246cbe094586ab3c48ff7577ef5d7db | PNG | 24 | 24 | True | 19635 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0027 | frontend-react/public/assets/Icones/sim_raiox.bmp | 0528e2faa0f9a60ccbe1168e94f53ac1df4c04b8088c9be60030d65977595402 | BMP | 15 | 15 | False | 122 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0028 | frontend-react/public/assets/Icones/sim_default.bmp | 052999ff4c4d180d113686e5942b84db59a73d89a4d702a22fb882d70535c3f7 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693,C728 | NONE | A | SIM | biblioteca-base |
| A0029 | assets/Bitmaps/arc_bloco_26.bmp | 052c08903398683447b6828707b92eba44cb21f053fb3f4815cecae842057967 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0030 | assets/Bitmaps/arc_descal_43.bmp | 052e6f5db690aeeecd4d726e2f584db863bebdd7583c14626d7cd072b5c522d4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0031 | assets/Bitmaps/arc_fixa2_13.bmp | 05786b29476f72cb00da831db9add2a5642a105ad74dc57bc2f05af0fa98ef4c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0032 | assets/Bitmaps/arc_capeamento_37.bmp | 05b0ee1ea493773800b0d0da0112559a7b2645f6a5c91ffa50dd11aa0753a856 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0033 | assets/Bitmaps/arc_bandagem_11.bmp | 05c60976a1cf5445cdcadb0e5b3d1e36da1fe32022595687e55fae5134c73351 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0034 | assets/Bitmaps/arc_bandagem_36.bmp | 05fc791477d392263a1f0b7bb681b3dc38d7d8a9ccffb08ee98c4ae2f01710f2 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0035 | assets/Bitmaps/arc_canal_51.bmp | 0626580b0ae5bacad793ed6c23af759a482fca0b18eb5b9dccc43c614ab1a285 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0036 | assets/Bitmaps/arc_erosao_23.bmp | 0688d47acdef84f711bfd692b51ea97255fd6c726932420e8eb3b16f483b9b5e | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0037 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente43.png | 06a3368f94f8c54a0fd7358201791390426f0987cf6fcd8a42f2f4bc03bda2ef | PNG | 32 | 70 | True | 1131 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0038 | assets/Bitmaps/arc_fixa3_16.bmp | 06c32c14fc6499afca166a5518a35f9253fe1bbbb51e815552ee3de6529044bc | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0039 | assets/Bitmaps/Dentes2d/arc_dente25.bmp | 06c94b7935b53c7cb7ea64edffa8c6b21a778a0116030f3c43ae8df26fabd54c | BMP | 32 | 70 | False | 6774 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0040 | frontend-react/public/assets/easy/cmd_avisos.bmp | 06de5b03034c0d03f9036df32c4b0cab49f7cd1d99214ea0df38b123d77a70f9 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0041 | assets/Bitmaps/arc_bloco_62.bmp | 06fecad4a82e3c340629d504416348a922f78d0f9db3e89a76c990d2af042467 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0042 | assets/Bitmaps/arc_facet_41.bmp | 0769c2c7f653a834ab1207310611a29fcf015c6306c62a9cf660f9e07ace3214 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0043 | assets/Bitmaps/arc_facet_43.bmp | 077e1f07e26f05807877a62b006ea3791022ed7815a7807d13c71e8a94579fdb | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0044 | assets/Bitmaps/arc_bloco_41.bmp | 083a7bc14d4663204209cd136d3ebc7a88c4ef98c908fa5053473b3bd107e4bf | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0045 | frontend-react/public/assets/easy/cmd_setapreview2.bmp | 084c229136fb63c26936cf345bbf6998f8d5ae2c4a26714353d31f0225da3f7e | BMP | 15 | 15 | False | 238 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0046 | frontend-react/public/assets/easy/avi_estoque.bmp | 087494c0f7d8bf0d364e445950bed11680c1b97992e02358e9a35f6e11d9bd42 | BMP | 30 | 29 | False | 582 | UNKNOWN | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0047 | assets/Bitmaps/arc_bloco_14.bmp | 08b5ffcda037186943a99612ad0def562f9709346ac103fec853e14704a86ec9 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0048 | frontend-react/public/assets/easy/cmd_baixa.bmp | 08ecfd5680634b79f2a2c7cfb94c8585dc89a490925dcd0bcd77fecc40ede87d | BMP | 26 | 18 | False | 406 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0049 | assets/Bitmaps/arc_bloco_65.bmp | 08ff362b0fef6e6dffe4b0f907edc7ac5ee52c779e317eee414203713c39398f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0050 | assets/Bitmaps/arc_nucleo_32.bmp | 0909b8440f880a1c2921c2d346905b205d1cc4b9d2833073b158975ed4d909d8 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0051 | assets/Bitmaps/arc_rizectomia_17.bmp | 093c7cc0ccf2f8d370aff7c8a35485d1ceea348f6bc5635f6be36bbcd0933e20 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0052 | assets/Bitmaps/arc_total2_i.bmp | 094303f7ccf37c85f7280c3c29ffb3f0d664e94a3799851cfaf7a7234d45af96 | BMP | 32 | 70 | False | 1238 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0053 | assets/Bitmaps/Dentes2d/arc_dente73a.bmp | 09b590d38bb1ed646fb46bde67088f005cb81328e253184b703a419fdc459610 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0054 | assets/Bitmaps/Dentes2d/arc_dente44a.bmp | 09d35e0622f5f1fcf149493733c9ac5a7be2ed6097b685633ee32a1002ffbbb9 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0055 | assets/Bitmaps/arc_facet_42.bmp | 0a33f8ecfec4159a8d40392552fb248716caf1839d143e3540e7c4b8e6e0d548 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0056 | assets/Bitmaps/arc_total2_s.bmp | 0a4daa4fca6cf9f37317cd222aac0de70729d9e6548203b3648a22b2fcb51b13 | BMP | 32 | 70 | False | 1238 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0057 | assets/Bitmaps/arc_fixa3_32.bmp | 0a6b739c6dd621db20644e678ed6ccbc43fb87e8e8f95c28ed94281fa6b333b5 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0058 | frontend-react/public/assets/easy/dia_supranum.bmp | 0aaa79657476e0de8e967aa303168c92cb1078c22c1a9d2c418bf729f5c0a403 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 80/2/1/bitmap1;80/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0059 | assets/Bitmaps/arc_erosao_22.bmp | 0b00b000b87b9fa2711860bb09503bc213d5d4749af7189ca90f27ffb30777a4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0060 | assets/Bitmaps/arc_bandagem_18.bmp | 0b2f7c9ad1dc254f9bae2fe85fc5f080eb81024c4e6e83eb025de5e7fd4734e1 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0061 | assets/Bitmaps/arc_facet_27.bmp | 0b2fd2391c22ed44916f364c162b47bfda865e50bc664083662de3a47b012672 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0062 | assets/Bitmaps/arc_nucleo_36.bmp | 0b515c1633c752ba80f0ddd59fd9d6a5b092d8a77dfe0d975c5adc09eecfc9be | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0063 | frontend-react/public/assets/Icones/sim_ajuste.bmp | 0b6270ff889badf8d05c468871c740f1036e33609a4df8abc840c16b790f3097 | BMP | 15 | 15 | False | 122 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0064 | assets/Bitmaps/arc_fixa3_24.bmp | 0b71a2674d2e6184636f9ce325e3c4b4aca3cc510dc7d578f9ef773ce26b9bd4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0065 | assets/Bitmaps/Dentes3d/arc_dente55.bmp | 0b79722749b2453904ce1a4566b20da90ea0df4092955314b324524e28fa979e | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0066 | assets/Bitmaps/arc_radi_14.bmp | 0ba523aa7eddd6a8f3af80ba432f24c3d332dc1f5f43c11a7dd6db4f4fbe0ffb | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0067 | assets/Bitmaps/arc_descal_38.bmp | 0bc05ec2792587c8eabe104dbffb00c016b61f986c26af02f13badafc5cdcdc3 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0068 | assets/Bitmaps/arc_descal_34.bmp | 0bee64b6c3072b5d993e89cbafb7f0adcdcdb9e34130c6389e625166e42361d6 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0069 | frontend-react/public/assets/easy/esp_Odontopediatria.bmp | 0c1ddf512cc6369893821a650cdfdb716fdaa371580ba3d17ea83df93061d1bb | BMP | 40 | 25 | False | 3054 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | assets/easy do React |
| A0070 | assets/Bitmaps/arc_bloco_75.bmp | 0c411c18affcc475b95c9f8812e02db636be82d2e5260e392ba5798c12833e6f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0071 | assets/Bitmaps/arc_fluor_47.bmp | 0c5c2d230d14ee91c9309cdc7d2e1405d77d43e40f482b21991a1c6f3109b95f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0072 | frontend-react/public/assets/easy/cmd_falar.bmp | 0c67067ac095fcc0c346057d76081e00029cbe221e47209f4680d60b397bec9f | BMP | 19 | 14 | False | 286 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0073 | assets/Bitmaps/Dentes2d/arc_dente32b.bmp | 0c858da9e552be27168801503f8b6c1fbd287d1be16e2598949efd30f2b8d5b6 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0074 | assets/Bitmaps/arc_canal_13.bmp | 0ced41c43ac6645ce4d19e1b93efd6b4b7d8d46d9eb243f02dae0e5b17877a1c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0075 | frontend-react/public/assets/fichaClinica/toolbar/ico_orcamento.png | 0cefc43ae6a5dad336028d1f65d06e6f5f1f05c95621c4ab24d4afff446fa2d4 | PNG | 24 | 24 | True | 532 | TOOLBAR_ICON | C365 | NOT_DETECTED | NONE | A | SIM | toolbar |
| A0076 | frontend-react/public/assets/easy/int_bran.bmp | 0d377bc06720960b8c47897c3f46eac5a373e23240a4af8370fd98f2fe74e2b7 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 31/3/1/bitmap1;31/3/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0077 | assets/Bitmaps/arc_lesao_12.bmp | 0d5028c05edaed4c76667d7bd2c8f6d70c8162fa0d41b83cce7b39ae8e60e3b2 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0078 | assets/Bitmaps/arc_descal_18.bmp | 0d75da78a8e1defd2a9c62bb6e364cdc375901f1031216ba3f86beb96bec43f7 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0079 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente14.png | 0d7f67dd08a0d295839ed0a490bef21099dda8c33a8f290fa3d2fab07815d052 | PNG | 32 | 70 | True | 1175 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0080 | assets/Bitmaps/arc_radi_17.bmp | 0dcbe584734f23539e13a02796efde3249eee0de57fc09b651fc397c5e714a46 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0081 | assets/Bitmaps/arc_descal_13.bmp | 0e9179542ed1aca6309fde79cc82b9a143a77bc2bdab68317082e92632adcf06 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0082 | assets/Bitmaps/Dentes2d/arc_dente35.bmp | 0ea8104b6971f4bd1560c59c0bcd55610a1341493e2111da847640436247fce9 | BMP | 32 | 70 | False | 6774 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0083 | frontend-react/public/assets/fichaClinica/toolbar/ico_odonto_imprime.png | 0eae2d39d5bc402f1e6c8ab3385d6261f43ed5591715f43f4bb86607b89de14a | PNG | 30 | 30 | True | 367 | TOOLBAR_ICON | C365 | NOT_DETECTED | NONE | A | SIM | toolbar |
| A0084 | assets/Bitmaps/arc_fluor_22.bmp | 0f31a857a74d6030f2d27db43ec37b36b29de48ae7a3925519fbf66291f544de | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0085 | assets/Bitmaps/arc_fixa2_37.bmp | 0f5fec587310b7f9547f6fa50f31c7fb7fd66584299d3bc9762d110a6708a87d | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0086 | frontend-react/public/assets/easy/esp_Gerais.bmp | 0fafb4ebc6a6ee93bbaec286ed01a4d5c702444b1ba8fbfbe09637e9595f3a3e | BMP | 40 | 25 | False | 3054 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | assets/easy do React |
| A0087 | assets/Bitmaps/arc_nucleo_72.bmp | 0fce2575a3ec9cf6e20c47c8ee870100d84849f219c77c628dde96804c3614ae | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0088 | assets/Bitmaps/arc_capeamento_47.bmp | 10bae48eade60f01a0e6e4359cf9f80c7d5b6033a2feb555c5b32cf5913e7ae4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0089 | assets/Bitmaps/arc_coroa_43.bmp | 10ce3a9cbb58d863f06cc60004b635c7da0dc655a34ad5aed0b17cc0e3582cf4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0090 | assets/Bitmaps/arc_erosao_14.bmp | 10ffb3f2107379a262475ddb2d44cc36643f226c3c0b28acb1851a845805a059 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0091 | assets/Bitmaps/Dentes2d/arc_dente38a.bmp | 1102b289de13937dbc1d826ccff30a1a89d53958b461f7b4aa161a9dcd880fbf | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0092 | assets/Bitmaps/arc_descal_37.bmp | 114335b15eafb7323d5d9d52f62e7fe9f46467b6f60024c0aecac8a14af1b7b1 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0093 | assets/Bitmaps/arc_radi_26.bmp | 114abdc66b39c5dc6a1871dc8cecdd643d442d40a61dc09043354836eba372fa | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0094 | assets/Bitmaps/arc_fixa2_46.bmp | 1166ac0060c094f6e7c97312f0ed6f258190ae8f5d23e7b472676b26e216a2c1 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0095 | assets/Bitmaps/Dentes2d/arc_dente14b.bmp | 11807f41e68638e5043f411ef0ef82181449d74af797a5c51d59b681bc8b116d | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0096 | assets/Bitmaps/arc_descal_46.bmp | 11ad16664c243c86ba04828b7db1c08eff2e65cdfaf8f5fb316d36eafdc7349d | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0097 | assets/Bitmaps/Dentes2d/arc_dente21b.bmp | 11c7809c837dd9daf65d9183fb614ece278025099d218cc165a747f2269f7a5a | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0098 | assets/Bitmaps/arc_fixa3_33.bmp | 1236c496ea7109cd28fd07996be399d520f8b0becf25d7663eeebceb650d894a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0099 | assets/Bitmaps/arc_fixa2_34.bmp | 12570edf7b604652b8c5c4af1d646ff93122a0df46a0d8b4c9099a9567d55b21 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0100 | assets/Bitmaps/Dentes2d/arc_dente11.bmp | 125e6ffb21938f09e3c4ae8c5ef0981973eac5242c5fb76fcc863227c768000d | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0101 | assets/Bitmaps/arc_fixa2_48.bmp | 12ddfb5d74f3cfb1eb5525399e31099de1f617fcfa30126321bc626e510eb5aa | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0102 | assets/Bitmaps/Dentes2d/arc_dente26a.bmp | 12e2dd15b92f0bf5a36f5de23f9570bfeed7f84a330ee534eb147cb50f6d568b | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0103 | assets/Bitmaps/arc_coroa_24.bmp | 130c2a4e7590862d48acf3f8d6ae3cde068ecc0845015f0597918e74e9711fa4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0104 | assets/Bitmaps/arc_canal_72.bmp | 13d07b26f819324ec83f7700a320aaa41786c25a417f289eb7a8d507bc1d17ba | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0105 | frontend-react/public/assets/Icones/sim_bra.bmp | 140c52a4428907b6ad48b3fabce7ef16188bb105311766bfcd9063d5c993cdb5 | BMP | 15 | 15 | False | 122 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0106 | assets/Bitmaps/arc_coroa_14.bmp | 145495d5b227f3623e63db9e2b18af53d66ca1120310efdf04e6765f18a07fc0 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0107 | assets/Bitmaps/arc_trep_38.bmp | 145604eea6fa4851d1aedc8b27c63bf256f1e3457f4782dfbe0760dc42999e38 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0108 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente27.png | 148e75b2940445039247c0bfaba013385ecddbf61b1aea8aabe115251ad54d8d | PNG | 32 | 70 | True | 1575 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0109 | frontend-react/public/assets/easy/cmd_receita.bmp | 14cf492e57909c91c71d805753f8625c8393b9d5b838588aeb27362e45975e07 | BMP | 21 | 19 | False | 346 | TOOLBAR_ICON | NOT_DETECTED | C730 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0110 | assets/Bitmaps/Dentes2d/arc_dente11b.bmp | 14f90c2c51d21a313bcbee3da671e1f75e8928a698be1721c68cc73f5660c2bd | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0111 | assets/Bitmaps/arc_canal_71.bmp | 1527eb382d402ac0f20f558e811ee7682b4e2c8ff3318a93239a884296021f7a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0112 | frontend-react/public/assets/easy/cmd_fichapes.bmp | 15b1e0268501a1e73ed657243f940d774d72f07aaf72e1cedaad965381b70d4a | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0113 | assets/Bitmaps/arc_facet_37.bmp | 15c879adac00bce50544902c217da2b73cea7c39807a741601e187b3db800e3c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0114 | assets/Bitmaps/arc_fissu_34.bmp | 15cea5857bdf8acbef895695f88e5daf1fcc51827fcbe9d07f36d1dd31973571 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0115 | assets/Bitmaps/arc_coroa_42.bmp | 15e9a1bb91a5454de059499d74f77ae60196ba4a184b8149835e28dfe1744a36 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0116 | assets/Bitmaps/arc_canal_75.bmp | 160126648cba1363c2d82dc4c43bdc7cb953161a932b40d80dbb906b5b90f96e | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0117 | frontend-react/public/assets/easy/int_provele.bmp | 160c11d45dced46350ff1b0d2530dda8ce6b88fc5fa22a7fcd9286807560500a | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 30/2/1/bitmap1;30/2/1/icone | A | SIM | assets/easy do React |
| A0118 | assets/Bitmaps/arc_fissu_12.bmp | 1615ad2a455564087f403e44f7828ce0c3698e385c87ba7d6819f44628569350 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0119 | frontend-react/public/assets/easy/cmd_novotra.bmp | 1633152f16f1629c91dbd38c24f1af91c46538a1dbd0e145cbe1e5dda78b21d3 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | C730 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0120 | assets/Bitmaps/arc_fixa1_48.bmp | 1633922ff3a2560254e4d05c241b34a8bab75fd65475de2fff2c4047813c5d45 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0121 | frontend-react/public/assets/easy/cmd_previous.bmp | 167dcec6f08c3b07ecd7c967b5259bb2702f6e755486cc96208f96234790b4dc | BMP | 14 | 21 | False | 286 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0122 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente46.bmp | 16ffa5fcc9f7fdc499a916d01d72ee1c3f7d651243848c2099af1ea0fd882383 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0123 | assets/Bitmaps/arc_fissu_42.bmp | 1704529dad7d722467e06dcb240bf57f73bb57c23e861e1a9b908d95acd95000 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0124 | assets/Bitmaps/arc_lesao_14.bmp | 176699a3b02340f549d7a3cf9e67aa099fc6e9d24952628fb4e108e735421715 | BMP | 33 | 70 | False | 622 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0125 | assets/Bitmaps/arc_fluor_31.bmp | 17865bcd7ac0766694a36cf4c4b4709df121678ce48b76fc3a2a726fa8ddde1d | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0126 | assets/Bitmaps/arc_bloco_17.bmp | 17bfa2b6f5f85f31ef7a829acb1907425da2409f9d0325f4c09f2e17e3f07ffb | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0127 | assets/Bitmaps/arc_descal_48.bmp | 180f1b79ed2c1174367e8e04cc8e4784fb2906cc02647a7d6966f8ee600e0dad | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0128 | assets/images/int_ulecto.bmp | 1815a33d7bd16eb704a80f44490a40d664879c79a0b2c7a343ccfe2a15506d39 | PNG | 24 | 24 | True | 2626 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 51/2/1/bitmap1;51/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0129 | assets/Bitmaps/arc_radi_18.bmp | 1892c455adc0c681b6ab6cf321d5a8815a7f1158b2681603b478d78c0ce85964 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0130 | assets/Bitmaps/arc_bandagem_37.bmp | 18a8b9d35a8b39b2f6dbc62ec5483ce4cbc0863a2783883af7feb490a3fcae83 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0131 | assets/Bitmaps/Dentes2d/arc_dente83.bmp | 18be12f93b2bf33413d6aba15d07764287c6531210b25424691d1ebacbd71f4b | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0132 | frontend-react/public/assets/Icones/sim_simb10.bmp | 18cf5ea10e6f50fcfa6f09f7fc4be3e648dca2fe1929c064d767423f794ac669 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0133 | frontend-react/public/assets/easy/dia_impactado.bmp | 18d4fb3399062a8c65f34bb83a0d58547f65b7917362ca6bc0230a58aedefa93 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 62/2/1/bitmap1;62/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0134 | assets/Bitmaps/arc_fissu_28.bmp | 18f49f8d8ecda0089d9f47817f33f469a126a1e58bc8fda49af748866c865eaa | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0135 | assets/Bitmaps/placa.bmp | 1947146f0824baa51147bfe5c53b6f16d64c69790309dce6721e8d99541c7f21 | BMP | 480 | 150 | False | 288054 | UNKNOWN | C365 | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0136 | assets/Bitmaps/arc_fissu_46.bmp | 19676fc2dde48d3b376af2c54d225e495e342545b01bd7fc72a8ff14d8137585 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0137 | assets/Bitmaps/arc_canal_83.bmp | 196c79c9d6ea324517918c09537aa68267eab0364823e168070cd87664e6cb16 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0138 | frontend-react/public/assets/Icones/sim_simb36.bmp | 19c0d5e1bccc158dcc58b33365964adef3e3a5b5b7db3977d6de7906bba73fe8 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0139 | frontend-react/public/assets/easy/cmd_imprime.bmp | 1a5cf1caddb38ac6863dd3141c8a5067f38a0c048c016618d871385c0343f56f | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0140 | frontend-react/public/assets/easy/ico_quest.bmp | 1a9796d7c582c320c2095ea230ffd5be4265ce0c8e74d649ad3c62257896673f | BMP | 45 | 50 | False | 1318 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0141 | assets/Bitmaps/arc_nucleo_73.bmp | 1aa6dc7294953339d02a8a0b2fad4666570e9485b69533cca266856d8721d9dd | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0142 | assets/Bitmaps/arc_nucleo_38.bmp | 1ac3262e9ad94a8145d06025d165450dfcce3eab014669998b3476cf0a3e57e0 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0143 | assets/Bitmaps/arc_lesao_28.bmp | 1b25f02548680acf4ff0eadc08c05813c7ee1dfd2abe2e739acfd1467b99b605 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0144 | assets/Bitmaps/arc_nucleo_71.bmp | 1b57e6078cefe26e1b322a00474f8e69898e49f707d56e734feca0fec15259ef | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0145 | frontend-react/public/assets/easy/int_fluor.bmp | 1bb79aa7ae9fba8662ad4dbd334392d2f69230e4b0d97e45539c9786a01aa7c3 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 20/5/1/bitmap1;20/5/1/icone | A | SIM | assets/easy do React |
| A0146 | assets/Bitmaps/arc_radi_24.bmp | 1beeae871049264f9587b1f5fd78886d2a38ba7e6b368235f4189d9df5be98db | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0147 | frontend-react/public/assets/easy/int_escova.bmp | 1c2ca4ed2fadbede883bc8dff1c8f473b80ef9c3b59c91079022b01155f835e5 | BMP | 25 | 36 | False | 694 | PROCEDURE_ICON | C365 | C693,C728 | NONE | A | SIM | assets/easy do React |
| A0148 | frontend-react/public/assets/easy/dia_extrusao.bmp | 1c5f78cbd2a9a240eb9c5cf2d5cc2c37c71f502dbb538b1b6030f61a5ac60d7d | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 67/2/1/bitmap1;67/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0149 | assets/Bitmaps/arc_trep_41.bmp | 1c7e63a34bd4af781985db8cd72428019d086f0aaa12d5f395dfc0c6b5a3586c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0150 | assets/Bitmaps/Dentes3d/arc_dente73.bmp | 1cde4f1ca1987107317104213a8d4c437222475da5557990d1be80820ab4c8b1 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0151 | frontend-react/public/assets/Icones/sim_simb33.bmp | 1cf32d0181e1695e8f5172bf581705b90f10a42c8f5481713108adc318553921 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0152 | assets/Bitmaps/arc_trep_21.bmp | 1cf89e9c91ad7365867aedfef85229e8b23fc871e49f76d8dd86be3eb4e1f467 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0153 | assets/Bitmaps/arc_apicecto_s.bmp | 1d3b2bbb09c39909b91b3a9d9e0e3a23d0e5ef6bd13e9835566062f8b6459413 | BMP | 32 | 70 | False | 1238 | PROCEDURE_SYMBOL | NOT_DETECTED | C755,C715 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0154 | assets/Bitmaps/arc_gengivecto_s.bmp | 1d51942ec7a272a8a89a90ebb17163e79b6fdd7133c027175fb7616b90f1f204 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0155 | assets/Bitmaps/arc_fixa2_26.bmp | 1df58a3f9f44d09a7004cff46daee44e95a9a0466e389ac95b6ed534f29fd3ae | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0156 | assets/Bitmaps/arc_canal_41.bmp | 1e2e3b94e8a7ff96da09298635e752380e039cc734ea75b112592bf1499da430 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0157 | frontend-react/public/assets/easy/int_ulecto.bmp | 1e369915c7399881571176b058980092589a3d621009555bea5c76daa1e58a6c | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 51/2/1/bitmap1;51/2/1/icone | A | SIM | assets/easy do React |
| A0158 | frontend-react/public/assets/easy/int_coroa.bmp | 1e3bc9f68e449760fddc98934526e1efe2c7499ba10dc613a98e99991fdddbbb | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 1/2/1/bitmap1;1/2/1/icone | A | SIM | assets/easy do React |
| A0159 | assets/images/int_apicecto.bmp | 1e4c540b25576c69093ef0b398fbefa1925e38adf4ef7f85bfb8bac5db9889ec | PNG | 24 | 24 | True | 2144 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 15/2/1/bitmap1;15/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0160 | assets/Bitmaps/arc_fixa3_25.bmp | 1e865d10d2c577b79776e89f0f17a792621ee2f755f96a98fb188434721331db | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0161 | frontend-react/public/assets/easy/avi_receber.bmp | 1ea16cc2d7e2f27677db81e80c44432fb85868b8e1021b4bf7ae3cd4a620b1b0 | BMP | 32 | 35 | False | 2198 | UNKNOWN | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0162 | assets/Bitmaps/arc_lesao_41.bmp | 1ecf22a7c948fff19e3b7dc597e0eb0ab0197fe6e3a01e893ca37587d37c5d3e | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0163 | assets/Bitmaps/arc_fixa1_22.bmp | 1ef18f38a767f6e0ea534bd6d72a934ebb93c3488b50f08aaf722e2868b387bd | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0164 | frontend-react/public/assets/easy/cmd_detalhes.bmp | 1ef9b27795f1c20b9dcf4aef63a315eb81761859c4d9c791da74ff29e5a08935 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | C730 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0165 | assets/Bitmaps/Dentes2d/arc_dente17.bmp | 1f0dd96b9ab2456311ec32404a90d809dd3046570d8b1afca173661e2e0afd28 | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0166 | assets/Bitmaps/Dentes3d/arc_dente61.bmp | 1f68cac671a529cd4ffd37bab1263ec8504371b2c724ab86ec5e7bb2c8808890 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0167 | assets/Bitmaps/arc_bloco_18.bmp | 1f8794c63eed476dbe11d6a30fe08378ae3dcecd472a27b5929715ae7b7960b7 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0168 | assets/Bitmaps/arc_remov3_s.bmp | 1fa4d06220287189b45bfb88a14579f1bebf8c94efa2933c953f09150a840f1e | BMP | 32 | 70 | False | 1238 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0169 | assets/Bitmaps/arc_bloco_28.bmp | 1fb84347037a63e4fb590c30bc009c98870e928bf4c802d8bf82fc7ffd4cb95f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0170 | assets/Bitmaps/arc_bloco_63.bmp | 1fc32b2f2edd2e2f73d0caa67006da0cb2bd5f71b299e2fef5165c68eb1ad37d | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0171 | assets/Bitmaps/arc_coroa_71.bmp | 1fd50ebc60c76172670de4b0c7a5519ddeaf56aced0c6a9aeaf446aa9d942877 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0172 | assets/Bitmaps/arc_coroa_51.bmp | 1ff86c899efb7ee0ae1ce44b002595ea053164cce3d2eb200819175cc8629822 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0173 | assets/Bitmaps/arc_rizectomia_47.bmp | 203fea110b2b01c5482522b733eb13224a0f5ed11a72f731056e25a1c91e6fae | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0174 | assets/Bitmaps/arc_nucleo_31.bmp | 20483bc4233c8920050aa75c659b5086b6f573ca60190bd15e143244e6eabbc6 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0175 | frontend-react/public/assets/easy/cmd_menupac.bmp | 20acb5aef38119c67eb945f44b3cf5fe98b0b352d512f9f4ade35282cd3a5ec5 | BMP | 21 | 19 | False | 346 | TOOLBAR_ICON | NOT_DETECTED | C730 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0176 | assets/Bitmaps/arc_nucleo_47.bmp | 20e1e188032359fd968b3972209cd697bbb1c5f0a856fd98cc8f784e8b1d2a57 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0177 | frontend-react/public/assets/easy/cmd_padrao.bmp | 210931992246be9bf72fb9d3e586219a75d9405395cea4779c59f50e0a41268b | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0178 | assets/Bitmaps/arc_remov2_i.bmp | 222ddc00d60eb28c38b295fbb33bf66ebdc78d6e232fb3fc536e24dd111fe29b | BMP | 32 | 70 | False | 1238 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0179 | frontend-react/public/assets/easy/int_manuten.bmp | 22658ff40b222051355f7fdb9a7b9d0578e7fe3f28268fb80b3fc9b2bce2c55e | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 23/5/1/bitmap1;23/5/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0180 | frontend-react/public/assets/easy/cmd_capture.bmp | 22b2c2997417ba9f98aebb2ba2211582f4f3d35c82ad57804585cd97a5d52148 | BMP | 21 | 20 | False | 358 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0181 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente24.bmp | 2307439416edee8541faccb9353157cac3ddc40688fd24e970a66abd3c3635e8 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0182 | assets/Bitmaps/arc_lesao_22.bmp | 23090f5b1d42480fd7d266b6ca2bdadc37552b732400011938ff90126879b183 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0183 | assets/Bitmaps/arc_fissu_45.bmp | 23a7c97f7ed3301ee741ff2d68e64fb37654780b4237c988eb90af92f43ecda9 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0184 | frontend-react/public/assets/easy/int_canal.bmp | 2409dd47cfa95e4bf8115197138d1caec8f22513c563fa2e03655eaabf8ed976 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 12/2/1/bitmap1;12/2/1/icone | A | SIM | assets/easy do React |
| A0185 | assets/Bitmaps/arc_fixa1_32.bmp | 2482990f0d260137fafa1625d8ae365272b7e6cd6eafeb7a5c5a2e437ea9b2fa | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0186 | frontend-react/public/assets/easy/arc_faces.bmp | 24b179c99bbc9d30a66864f2ec9b795b42d71fd08004c86ccd23946ae8956852 | BMP | 32 | 25 | False | 1878 | FACE_IMAGE | C365 | C755,C715 | NONE | A | SIM | assets/easy do React |
| A0187 | assets/Bitmaps/arc_fixa1_11.bmp | 24c44dbdd29c41aef77ae4c4746abe1d7dee6fc0de8b89a9f2b32debd24728e7 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0188 | assets/Bitmaps/arc_nucleo_51.bmp | 24f235a75d7d3ac59caa45293e6cc92d062fa00bf898fdba17e43a03acc07afa | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0189 | frontend-react/public/assets/easy/int_RestO.bmp | 25157dee398617a139e49ac9cef0a2fe91b417dd05bb8d34f065904aec41cee7 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | assets/easy do React |
| A0190 | frontend-react/public/assets/easy/cmd_reajusta.bmp | 252ef5b2ccd8d2ac2480bbb33f17f88085d41ffdf3bdc1fc85c012c2b027d787 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0191 | frontend-react/public/assets/easy/cmd_gravatodas.bmp | 255eb440dc3938a056c59d71d82cc209a1f061801cca8810d1344324366ddbe5 | BMP | 29 | 20 | False | 438 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0192 | assets/Bitmaps/arc_gengivecto_i.bmp | 2572d42eaca44a926c087093d53623540869dfaa230b739efbb736737ce43623 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0193 | assets/Bitmaps/arc_nucleo_17.bmp | 25e7cf472fc7e140f54d43c4a61dcefdfc4a7b784826101099682c603a0ce62c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0194 | assets/Bitmaps/arc_total3_s.bmp | 2612c2226eced7006f3c44b7ff5b858e0383b8db1f7c7fc74fddb854078fe093 | BMP | 32 | 70 | False | 1238 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0195 | assets/Bitmaps/Dentes2d/arc_dente53.bmp | 266c8a3e4b9a3808e3e69f2e8ac6b5406aa9dc5d4f947e89cccc9dc5fe5b64c1 | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0196 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente38.png | 26877f84cfb0e25309e1cffe2ef686a023652fb64d7a747ea4e71faeb19e0939 | PNG | 32 | 70 | True | 1300 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0197 | assets/Bitmaps/Dentes3d/arc_dente62.bmp | 2696ed125a40ccd9f51826056e6be8cf327372597bdeab58a2d390673160bb7d | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0198 | assets/Bitmaps/Dentes2d/arc_dente23b.bmp | 26bcb315233fa82907469d7003acc5691c1660d7fcc3fb0f5c589e39145a4cac | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0199 | assets/Bitmaps/arc_canal_33.bmp | 270fd7ec17eba0f9e2bd1f31d44a5219511a3fbefebd21178ffd4d3da9aa2331 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0200 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente48.bmp | 2754f8bbc72f0489684ca0493f2166f71d2d2d597dcd61330fa2879a32dad40d | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0201 | assets/Bitmaps/arc_fixa1_16.bmp | 2764ce27ab32524bf72f959dbd1b72ba7c9b640566f78c32d0c0551584e2dd35 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0202 | frontend-react/public/assets/Icones/sim_simb3.bmp | 27771d08557ffa870a93342f41b963290cb9b98529b84fbcfbbbeaed771be374 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0203 | assets/Bitmaps/Dentes3d/arc_dente71.bmp | 27affd44ec8a65cc2c528814be9d5f6bfa45f8beb78513fd17bd154baf825bb1 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0204 | assets/images/int_cirur.bmp | 27c18729d4cab952c99ba08503f5581570ab6ea7a81acccc118c221aae339d58 | PNG | 24 | 24 | True | 2644 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 45/5/1/bitmap1;45/5/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0205 | frontend-react/public/assets/easy/cmd_calendario.bmp | 2861f146bd0791fda8f5dd1da210e1cd2fff48c1b214d36a93d36dd63ade8124 | BMP | 18 | 17 | False | 322 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0206 | assets/Bitmaps/Dentes2d/arc_dente53a.bmp | 28664b3a5530e5664bf337f97e9fda95589fb2d7fd1cd9844bb8f5bb1fb41705 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0207 | assets/Bitmaps/arc_radi_23.bmp | 2866638b7a8c10e21b303f24fc9b9cf8144c86c4f58201e9210f5cdbb107253c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0208 | assets/Bitmaps/arc_extru_s.bmp | 286db73fc0e43ebb3b6e574c256df7514a6b02bdb408c6becae0b3e32cd4444a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0209 | assets/Bitmaps/arc_fixa1_26.bmp | 2874958a92da539495b9ce418119ac24e9ec00af314a6dd655e1217ad6967f55 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0210 | assets/Bitmaps/arc_erosao_16.bmp | 28a8fbb9afe1aa0034d2306449b2295c64977c11df01ff0dbb6de0bf331efc5d | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0211 | assets/Bitmaps/arc_fissu_11.bmp | 29001067479bf2708702c140b671a0a53fb6bcf0af0365adc09931820fc9d540 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0212 | assets/Bitmaps/arc_coroa_83.bmp | 29438399be0e11b8780d6858204c6fd59d53928f9ae770fe4f15e03cf97df45b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0213 | assets/Bitmaps/arc_nucleo_81.bmp | 2953b747cdd0e80136651a8a8b5d078163e33ecbab5cfe0497ff738e6ab97812 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0214 | assets/Bitmaps/arc_coroa_52.bmp | 295d73cac362ec9045d627a0a1d0db5ff7b42658ca6fe3d635f54c0a673a6abd | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0215 | assets/Bitmaps/arc_capeamento_11.bmp | 29c108bd96c8b03c1bbb41a98eeb0d0ade5f54d3b3d8313096ecf07f0f4f1f5e | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0216 | assets/Bitmaps/arc_bandagem_28.bmp | 29f5a236b2921a92879d0095ed8b964ecb4e02b5d584f304fd5ecb2db5d1209a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0217 | frontend-react/public/assets/Icones/sim_simb19.bmp | 29fc598346bd5eee34894447561ee3dbd2ec54db349adab1b51d14ebee91bac9 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0218 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente34.bmp | 2a7bb5632d7488c4ec481efd31a02bcfdc12bae50cc00fa5d83b2fbe5c56a6dd | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0219 | assets/Bitmaps/arc_canal_16.bmp | 2aac7cafd7e1c036ad9c003ee90cfd323e260eabcde8cb7ee576f721bf5829d5 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0220 | assets/Bitmaps/arc_canal_43.bmp | 2af9a2a70257c92348b465682cb2f6966b3a2c4154e905b2c9f0206054d74ac4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0221 | frontend-react/public/assets/easy/int_RestDO.bmp | 2affdace965328cc5ee8d0b3c0b65cff04918a39cb0faa25a292e60a75fd4e1d | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365,C546,C555 | NOT_DETECTED | 79/1/1/bitmap1;79/1/1/icone | A | SIM | assets/easy do React |
| A0222 | assets/Bitmaps/arc_descal_31.bmp | 2b23d19ece47ad121ffc724f17df9e1a2e9134f74cb89e5d6fce652da91a58c4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0223 | assets/Bitmaps/Dentes3d/arc_dente64.bmp | 2b2ed63148cc634c5c112f49031c1e76ad36af871da1ddcc5dbadddb9d43341b | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0224 | assets/Bitmaps/arc_fissu_26.bmp | 2b3bec21b6f5949a0336e562e48e7cdbbb1bfdcb99c5c0e449dfc48a61ade634 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0225 | assets/Bitmaps/arc_erosao_21.bmp | 2b4fd8dc4bde78b42e143574568858ad25f8035c76f71cfbc4e489897bb00e36 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0226 | assets/Bitmaps/arc_trep_44.bmp | 2b55c5d3a2d38be1140b39605f2012fdc86df6ca28656381d10dba42701be09d | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0227 | assets/Bitmaps/arc_fissu_23.bmp | 2b88549af1000c046375559bceaf40b8c31981acfbf3e9430c768f41750a83b7 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0228 | assets/Bitmaps/Dentes2d/arc_dente12.bmp | 2bb30a2bc1c9e243c5748f2a44f5e163b4825cae42ae540fb8abbb61cc1372ec | BMP | 32 | 70 | False | 6774 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0229 | assets/Bitmaps/arc_fixa3_12.bmp | 2c80829938388c1b684ab58a42dcc190c51ef22165bfc8ab07dcc2808d20fe75 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0230 | assets/Bitmaps/arc_rizectomia_45.bmp | 2ce88717ad6d7ca05d259114c33d8784bc1f1374dd44c1e2b6a80fe5f67c28b1 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0231 | assets/Bitmaps/arc_radi_16.bmp | 2d41cb9bf088026d6b94df28eaabb7beb061d911c19f5c1eb53f89edf1faf3d3 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0232 | frontend-react/public/assets/easy/cmd_filtra2.bmp | 2d488e107d43ed0306107468aab6ce0bc95f67dec324fea4925aa871c616249f | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0233 | assets/images/int_mordida.bmp | 2dc05496148af57962d9aec6823377f2823cbb79e64a64409d63be787f0037ad | PNG | 24 | 24 | True | 2616 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 37/5/1/bitmap1;37/5/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0234 | assets/Bitmaps/Dentes3d/arc_dente75.bmp | 2de7eae21ad465b3ecf67f007cb2c2d6767b8f0c33c12ff294352f5037f127bd | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0235 | frontend-react/public/assets/fichaClinica/toolbar/ico_dashboard_novo.png | 2e40eb1329e12736dfc25bcfb7a8d05d4413c2ae1e36a382d95123d08138e145 | PNG | 16 | 16 | True | 139 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0236 | assets/Bitmaps/arc_lesao_27.bmp | 2e506dd1456d100796246bbc29381d798b2010cc8046af368cab2252d02c5b2f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0237 | assets/Bitmaps/arc_fluor_46.bmp | 2e63743819ae3af8b5afcb469c41594b1e4624fdf7023b093301ce49e13db26e | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0238 | assets/Bitmaps/arc_nucleo_84.bmp | 2ee4570e199d1a2bdf24753eff059b2d9ad8c15f7d027515407b606223a34ea9 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0239 | assets/Bitmaps/arc_nucleo_35.bmp | 2ee8a34eac1f8fe90107eb2420252850a8c9875b2f5ddfcfc697f36326f93fc0 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0240 | assets/Bitmaps/arc_mantenedor_i.bmp | 2eefe732583e1f7219d64d916e5115db27481d0dbec2849aead0af45015fa0a8 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0241 | assets/Bitmaps/arc_fixa3_46.bmp | 2f05db394204932ed56f00bbcd3230148a99852413bbe9191ac104fe06d8b495 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0242 | frontend-react/public/assets/easy/cmd_convenio.bmp | 2f1478aae92cb2b3a6cd44305f020685d015582289743ece700da2e69920bc31 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0243 | assets/Bitmaps/arc_fixa3_47.bmp | 2f2ea4b1e39450db3fe24161b4f3e2fd7024b6cc96596e8bb37115070845ff14 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0244 | assets/Bitmaps/arc_facet_15.bmp | 2f3985af74d05fabeefbe5492dfed46c71951f922721992cf040eef9e7c0af9e | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0245 | frontend-react/public/assets/easy/esp_Periodontia.bmp | 2f956a8652999efd807216b5bf3abe7222c1326cc6ef5aeee6fa5fd18cd19938 | BMP | 100 | 25 | False | 7554 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | assets/easy do React |
| A0246 | assets/Bitmaps/arc_canal_65.bmp | 2fc5d83e13fd28eeb048e90c9d99a9301b3a993a5160e48329943b3a2632b0d2 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0247 | assets/Bitmaps/arc_rizectomia_15.bmp | 3031e51413ddbfc540111105b99a396190985aafc2081e8fe3c40d6f80927ff9 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0248 | assets/Bitmaps/arc_radi_41.bmp | 303b754131e4e9838ea3c6e149765f9aadebb4246301df39af0eb0649cc47c56 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0249 | assets/Bitmaps/arc_fissu_43.bmp | 304f1e7de258c24254fbe61c9e4bdea48edd42e4457fd1baf1145acc834d701c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0250 | assets/Bitmaps/arc_canal_48.bmp | 3068cc2d6b8e0f0e9e8c78f1e193a61998e9e9f63db6ea5f3baace6fc40f21aa | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0251 | assets/Bitmaps/arc_canal_17.bmp | 3093b952c9799792982667e3d8f28aa502f0405348341cb5bcd7dfad55e2c1af | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0252 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente17.bmp | 315065d716087353977cc27d3db5b23f4fa6a6dd1d9151db8b5cfc589dd6bc8e | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0253 | frontend-react/public/assets/Icones/sim_simb34.bmp | 31918dddabb15303b4ef657c47211e00ce10ea26e132363da1108045ed47b837 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0254 | assets/Bitmaps/arc_lesao_31.bmp | 31bf60d2089f29803639b637d274e30fcca262fcf866837392f60646bf7759cb | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0255 | assets/Bitmaps/arc_facet_14.bmp | 31d78ad0622f6f76b56aef84dd08a3e88c4d315a9329b552ab5cd6d7f812d45f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0256 | assets/Bitmaps/arc_intru_s.bmp | 323271d38857ed060cedbd0e26beaa99bbc7f3a0076f156dae417d86c3cc8e2f | BMP | 32 | 70 | False | 1238 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0257 | assets/Bitmaps/arc_fixa2_18.bmp | 32b55a95275ead3c1ccbba50719c86a04b70d0f8e1517dffe7ddade744af040f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0258 | assets/Bitmaps/arc_facet_34.bmp | 32fab157d9b87f832d7f597bfae0125e03d13f099821cd39b499550d02159a9f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0259 | assets/Bitmaps/Dentes2d/arc_dente82a.bmp | 332cfa2d3c98844ac2b1d9777a243c9fbd38f7e1c8c34b630417414a212b6c92 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0260 | assets/Bitmaps/arc_facet_32.bmp | 332d939c82d25ea6f40709a17309179abef19b84babc39ae1e14e60aed54fc6e | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0261 | assets/Bitmaps/arc_facet_12.bmp | 33c87e9b37624ee7735ce398cbbe7711dda0e676fea835e692b9dc6c672a42c4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0262 | assets/images/int_frenec.bmp | 33eca32816bcc956f851d6117728c3f6efdf34696ff21ab93bc7ad12aeb7ff48 | PNG | 24 | 24 | True | 2467 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 26/5/1/bitmap1;26/5/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0263 | assets/Bitmaps/arc_lesao_34.bmp | 341180613f7bc7b42ab49804b692e82e7a78f298908399e4ba4f81df4bd30cb1 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0264 | assets/Bitmaps/arc_canal_31.bmp | 34486d3043ee6faaced8e46674d390ee80a2d9db08dc9c4621853ddef3f2351d | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0265 | frontend-react/public/assets/easy/cmd_editaint.bmp | 3448c18a4daa0d98fa1b33c763f5e8fd87d3d90025962a02f948e0c730999285 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0266 | frontend-react/public/assets/Icones/sim_simb31.bmp | 3448dd262d6046a0404fed1805430c4d8181551db7bb07b092b79ef20869435a | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0267 | assets/Bitmaps/arc_fixa3_17.bmp | 34504e8c2c4fd5d66009225c38ba60ecd29687c848a6a34fc7f2caf390a928da | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0268 | frontend-react/public/assets/fichaClinica/toolbar/ico_trocar.png | 345e9627b3cf10e0809867885c4358b3e778bbfcbd98befdfcf50259af5faf78 | PNG | 30 | 30 | False | 263 | TOOLBAR_ICON | C365 | NOT_DETECTED | NONE | A | SIM | toolbar |
| A0269 | frontend-react/public/assets/easy/cmd_ccpac.bmp | 348cdb3f1eb6d498207cc369115dbac299d84d917e5a45ce7243cd77cf1403f1 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | C730 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0270 | assets/Bitmaps/arc_bandagem_14.bmp | 34b134d98bdcbf4148e262f40dbf7e1884bebd28f997c09551a4963103ed2ce0 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0271 | assets/Bitmaps/arc_capeamento_44.bmp | 34bb348f1d2bf5785a38a44a6a61d3a9b1038d41b7ac6e370d3006358cc17885 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0272 | assets/Bitmaps/arc_tunel_i.bmp | 353ca8abbeed453433d17a5302148c2e8c35210f04d44c12168080f76e74bf70 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0273 | assets/Bitmaps/Dentes2d/arc_dente46a.bmp | 3593f506f357d2945653be7c0abd7e4965ad62ff93e2710a992d0c229ba629b2 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0274 | frontend-react/public/assets/easy/cmd_first.bmp | 359d4ed6562bbcd5f93c333deffd56c065f6c8703853ec029a298e8941f01ec0 | BMP | 16 | 21 | False | 286 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0275 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente16.png | 35a542f2b87e49ff5b1eb241969dfc5404a0afd470ad899e73dc0a61c4aed486 | PNG | 32 | 70 | True | 1579 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0276 | frontend-react/public/assets/easy/int_adesiva.bmp | 35d7221c9488582febb808eb0a6235ca5ed3463ef654db60276d6fb33c3c93dd | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 7/3/1/bitmap1;7/3/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0277 | assets/Bitmaps/arc_fixa2_43.bmp | 365b0efe9efebbf7c4af504746d89c58e46e1d8d6dc5a6de58058ffc1f230442 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0278 | assets/Bitmaps/Dentes2d/arc_dente41.bmp | 374243d30233078f61be09f31abec4399ca1f6a4361bbbb5fb10c4950f440c71 | BMP | 32 | 70 | False | 6774 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0279 | frontend-react/public/assets/easy/int_remove.bmp | 37500a2f65d47a5dc1d2be9ce9952b0cfb7b08b80436c71aa45c2b2e0f80e7c4 | BMP | 23 | 36 | False | 550 | PROCEDURE_ICON | NOT_DETECTED | C693,C728 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0280 | assets/Bitmaps/arc_fixa3_22.bmp | 376079dd5d26c257ae73fac339dd7038f945e366b47065decd0a1c78c5d7029e | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0281 | assets/Bitmaps/arc_coroa_27.bmp | 37dbe2ff21387fd47bbd6f7aa89feaf82b3f798d347eeb0bfa2a977d92464656 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0282 | frontend-react/public/assets/easy/cmd_procura.bmp | 37fdee49c49daf14f4fa87f219bc0025475b65ed3cf7cf70f6b4ec5ed86ce3ad | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | C730 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0283 | assets/Bitmaps/Dentes2d/arc_dente75.bmp | 388e393f4f38d34eb2653d05bb063976323602095c46236b670362506063fab6 | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0284 | assets/Bitmaps/Dentes2d/arc_dente41b.bmp | 3894ae90d78f95f817cb87d868391d570a3dbad466664a7d961525616206ce60 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0285 | assets/Bitmaps/Dentes2d/arc_dente27.bmp | 389d15281509f3db2d1b6ff040951487f4d4875329b8ecd95e7c868aafe53ddb | BMP | 32 | 70 | False | 6774 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0286 | frontend-react/public/assets/Icones/sim_poli.bmp | 38bb57e5662e8cece03717dba6d7c2d7350332d7be51a307b1045a2c02a5d4df | BMP | 15 | 15 | False | 122 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0287 | frontend-react/public/assets/easy/int_raspagem.bmp | 38f0852efe8f8ad24be28ac27fe661fab74761b1108c65959b737a41466c9f46 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 18/3/1/bitmap1;18/3/1/icone;81/4/1/bitmap1;81/4/1/icone | A | SIM | assets/easy do React |
| A0288 | assets/Bitmaps/arc_radi_28.bmp | 3961c19dfee9c9cbc735b1d66b30adc9b6da9b510adbe6efdcea1fc280e8d369 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0289 | assets/Bitmaps/Dentes3d/arc_superior_mista.bmp | 3974cb831b8e5d5e7f55c145e1cd0926c611a5613c8024cf90ac1aa7f7dc5af1 | BMP | 512 | 96 | False | 196662 | ARCH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0290 | assets/Bitmaps/arc_fixa1_23.bmp | 398a398cff38b455e426443916378c668ff068d8f93c4dd1cee85676e4d6652f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0291 | assets/Bitmaps/Dentes2d/arc_dente52a.bmp | 39b1d9df13e45afc8497b371a948be54e7697e1ebc174cffdd0a4273301abac1 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0292 | assets/Bitmaps/arc_facet_11.bmp | 39d16200407e01a39c01c4c48d3442bd90e7f118fe310ac56e83fc6099356af2 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0293 | assets/Bitmaps/arc_nucleo_37.bmp | 3a497ae0760f45dad9d8c5e75d996f1b8a634a1396c585b0047275bb3c557171 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0294 | frontend-react/public/assets/easy/cmd_copiabkp.bmp | 3aa782442896991dd4b6bb1f4869771ca77de74543f0593cd93a56652a40758b | BMP | 42 | 40 | False | 2838 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0295 | frontend-react/public/assets/easy/int_byte.bmp | 3ad3eb3e299797fa6926a2d6a0655bac973e02c7fd39c3ddf3909d499cfecc77 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 38/3/1/bitmap1;38/3/1/icone | A | SIM | assets/easy do React |
| A0296 | assets/Bitmaps/arc_intru_i.bmp | 3ad6b4d56293812e859842c5a28023d0fc61ab04811e048e44a74c539678818b | BMP | 32 | 70 | False | 1238 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0297 | assets/Bitmaps/arc_coroa_63.bmp | 3adbdd0daf2e153526cf491024d7dff5892cbb1019a273376a34b16e12811624 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0298 | assets/Bitmaps/arc_descal_36.bmp | 3ae778250aa39dd152e86683b43bec1a67b934fd0a7d709c09e51ea4361bb5c3 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0299 | assets/Bitmaps/arc_canal_52.bmp | 3af087e5afa9b455145da450e8f5f7aeaeced9d24c8a606c5ea8f363514069af | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0300 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente31.bmp | 3af85b1baaa6ce47e9b1e7c0af67febab07354578457bc2b71dfe37f087dce2b | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0301 | assets/Bitmaps/arc_erosao_42.bmp | 3b8a37cb3aaf5fec56c061eabb6fdf12f95206e121e86dbb9c0a40840e828221 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0302 | assets/Bitmaps/arc_fissu_13.bmp | 3b9e0ecb7d7ba1366a3174358fda6c6aada716ae6a945b3743a76a5ef8d98fa8 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0303 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_generico03.bmp | 3c1c077dfcc7184771666022492aca39afbbc5364e74af7b1b57b254c524db91 | PNG | 24 | 24 | True | 19453 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0304 | assets/Bitmaps/arc_total1_i.bmp | 3c7b56168885761d0cdd5b651faa4852ac2d4738f4ff3202461cce60da61c8f1 | BMP | 32 | 70 | False | 1238 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0305 | assets/Bitmaps/arc_bandagem_13.bmp | 3d85cf9a2da10eb13264e336a24f0f84f9c8b492b231e425397b39d57a94d105 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0306 | assets/Bitmaps/arc_facet_17.bmp | 3dee5939ea4c5baf5a77e1fb877459bcc2b8f9839a09a8ae0561683c6d16b4b7 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0307 | frontend-react/public/assets/easy/int_tunel.bmp | 3e4137506c70693b34422d2cc8ad5da824f669f8e43088a4093ebb233e35e9cc | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 50/2/1/bitmap1;50/2/1/icone | A | SIM | assets/easy do React |
| A0308 | assets/images/ico_odontograma_toolbar_prc_favorito.png | 3e7424692d32ec7c0ce6c5b24e508acf4cd712144a9819267148f32cf98b9fd5 | PNG | 16 | 16 | True | 321 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0309 | assets/Bitmaps/Dentes2d/arc_dente35a.bmp | 3eaf756a16e1c0c859bd8340b39811f902bca744972e435fbf6a7553ea8ef5c0 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0310 | frontend-react/public/assets/easy/int_manut.bmp | 3ec83ed2b232ff784f066df5fd161ac180e5e9fd0c88f63b15a6934f6b97a27f | BMP | 25 | 36 | False | 2086 | PROCEDURE_ICON | NOT_DETECTED | C693,C728 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0311 | frontend-react/public/assets/easy/dia_mesial.bmp | 3f2a2e4fbd1f276ca9a92f446e8f15c6b04d4d495a3a23dc223395bf8cdce77d | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 65/2/1/bitmap1;65/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0312 | assets/Bitmaps/arc_girov_i.bmp | 3f51071bba866e8b7af4eee507f95e5a67994b6043a7370143c08891578dde15 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0313 | frontend-react/public/assets/easy/cmd_baixaest.bmp | 3f59d130bd49a9dd30b81173adc31bd86e5354dd3ce79a5266fd5ea681fc7d33 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0314 | assets/Bitmaps/arc_erosao_27.bmp | 3fc7ba88bba730f7975e87f01294c9e387966fef4cac4bd4cddc6e40cc294e14 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0315 | frontend-react/public/assets/easy/ico_debito.bmp | 4033482f4b49b7f4f64ac7aab2bcf10a39726ae016c4bf4ddba7e79b293c52f2 | BMP | 16 | 18 | False | 262 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0316 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente23.png | 408b26fc06a5af3c7e42d2d01786cca51bfcb3ebd9dd6856f4b9519fcd9c4440 | PNG | 32 | 70 | True | 1265 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0317 | frontend-react/public/assets/fichaClinica/icon_combo.png | 408fbe85c763f382c1bc4d62dc65bee961f3026d5ec354516b8c93e90ce235fc | PNG | 16 | 16 | True | 1054 | UNKNOWN | C365 | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0318 | assets/Bitmaps/arc_fluor_18.bmp | 40fb59e201ecbd0f317a4fbea88aa66f11e90d9b4f7ff5ba5e9e8f34d1bb429e | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0319 | assets/Bitmaps/arc_rizectomia_25.bmp | 41181aa8bf9a0cc1c5944a5e837b359524f64d4ba52e2b8c874dbf494d1711de | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0320 | frontend-react/public/assets/easy/int_nucleo.bmp | 41fc8d430e106791b952a5588f1fe18faed8b3c46660098f42e3dede93c7f395 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 14/2/1/bitmap1;14/2/1/icone | A | SIM | assets/easy do React |
| A0321 | assets/Bitmaps/arc_nucleo_65.bmp | 4212c961168bd4b4ab9d8052cc3555b263aed9b30ff02a80ab9bfb381d8417dd | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0322 | frontend-react/public/assets/fichaClinica/odontograma/especialidades/esp_Protese.bmp | 4261d644178a216866881c44a557a60b930f4e7a490703f82e3ffc95e73715e7 | BMP | 40 | 25 | False | 3054 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0323 | assets/Bitmaps/arc_facet_22.bmp | 426b0352847e51524cee5a46509a29db878cffb4091d0a46e507ec5858b98cb4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0324 | frontend-react/public/assets/easy/int_fotos.bmp | 42ada14c32e66e36c92a1c3c6b7c4568920accd414a4dd5b85b8fbc6dd5f3683 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 43/5/1/bitmap1;43/5/1/icone | A | SIM | assets/easy do React |
| A0325 | assets/Bitmaps/arc_bloco_11.bmp | 42f228ac3643414a9cd56b46c51058696b131b74ddb66b3a2f680c67732a70ed | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0326 | assets/Bitmaps/arc_canal_25.bmp | 4347f4f96b538f29b570727c542ef28e82b8661a24e5afad1b71568fa3f74ca5 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0327 | assets/Bitmaps/arc_nucleo_53.bmp | 4360f4b92262cd9a17196394872dc3d8960336a5d66dad366282f7d20fe981c5 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0328 | assets/Bitmaps/Dentes2d/arc_dente75a.bmp | 438aefec1e536f4d7f0f797cf5df5a8ed66c149849552095f76284535be86b00 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0329 | frontend-react/public/assets/fichaClinica/odontograma/especialidades/esp_Prevencao.bmp | 43e10168a87ef04c03d401bc8b898e030d381f5b84286e15934db6d6d95e6d5a | BMP | 40 | 25 | False | 3054 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0330 | assets/Bitmaps/Dentes2d/arc_dente22.bmp | 43ea637c73b87c68f40c156c6f903526ee25807d841e6cecae2478069fe7173b | BMP | 32 | 70 | False | 6774 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0331 | frontend-react/public/assets/easy/cmd_cnfindice.bmp | 43fb00f1c3d9790a65ec417ae4d0cacca3d9918a9c778cb0f104ab83be0d765f | BMP | 23 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | C730 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0332 | assets/Bitmaps/Dentes3d/arc_dente51.bmp | 447f151d7802addeb355a0099ba2697050df1dcbaeef423787265f936eece1d6 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0333 | frontend-react/public/assets/easy/cmd_nao.bmp | 44b31072b6e82d2d4abe7d40557c37c36590bf992ed75741cfe296df1fdfc517 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0334 | assets/Bitmaps/arc_fixa2_22.bmp | 454fbba93a09710b29ed8b698461ae86dafa50e2ea52bd4570db1bd9ebd4aa76 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0335 | assets/Bitmaps/arc_migdir.bmp | 459f5fad739a093512acacbb0f1b1662cc0e8c0a17e0d47260c2200593853560 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0336 | assets/Bitmaps/Dentes2d/arc_dente43.bmp | 45ad8b0ccdf5791bb2603d7cc97a507288eeacc25f86f057aab11d4dd4600b24 | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0337 | frontend-react/public/assets/easy/int_aumen.bmp | 4651700dc4d2bf90ba7b3a9b09709f3475c85a2350ecd72d7ecc9415982a5c06 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 49/2/1/bitmap1;49/2/1/icone | A | SIM | assets/easy do React |
| A0338 | assets/Bitmaps/arc_radi_32.bmp | 466e59bbe06ccd97e07efce4e086f5a05b651c29cbf69f353fb07de3a4c387af | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0339 | frontend-react/public/assets/easy/ico_alerta.bmp | 4687a99003b7b7e039002f651cb0012ce9fc92f344253aef94689a090a0e68b5 | BMP | 16 | 18 | False | 262 | TOOLBAR_ICON | NOT_DETECTED | C708 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0340 | frontend-react/public/assets/easy/int_attach.bmp | 47000802b38232c76c09f966144ce75af5995a0e5c001ea09aaf60caec2765e4 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 52/2/1/bitmap1;52/2/1/icone | A | SIM | assets/easy do React |
| A0341 | assets/Bitmaps/arc_descal_14.bmp | 4709deb96b0281525a00267e022280305b440f8bbff922240d8c5ee9341731f9 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0342 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente16.bmp | 475fffd31ab75a63652269da66ec220eedc47a73c9a37e1ee70494754d6cd0d9 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0343 | frontend-react/public/assets/easy/cmd_filtra.bmp | 477394d40c20f87291c828130347e1ab877ca93ac78069693cf6977646231854 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | C730 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0344 | frontend-react/public/assets/easy/int_apicecto.bmp | 479cb09dfb949b4d2e556fb66e186456c1280614034c6feb9da6fbb7bb585274 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 15/2/1/bitmap1;15/2/1/icone | A | SIM | assets/easy do React |
| A0345 | assets/Bitmaps/arc_descal_22.bmp | 47f11595a2f8cc47e0a498696734c8f5e8c24b6e21d37364c2d6c6e89c9f2303 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0346 | assets/Bitmaps/arc_nucleo_42.bmp | 484d36830462e258709c1c099fd9842e4d76e745c3db06e16feb67302da649e9 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0347 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente45.bmp | 48703a57c4ec6bb012954a3cf92f5dc9de507bedb4436fd6b6d7df3dab99bedb | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0348 | assets/Bitmaps/arc_lesao_25.bmp | 48a6310adb1dd352d16e94bd09806dda6d1a37baa956e07979cd448e072bdd53 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0349 | assets/Bitmaps/Dentes2d/arc_dente42a.bmp | 48c45d8aa5d3223611a8bc7aa1220c10ef4a9f29399d01ca573842b5901968b8 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0350 | assets/Bitmaps/arc_canal_73.bmp | 491d854bda5b45c67e5c124a51356a3e18858f23aa75582426c432bdcd833b0a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0351 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente44.png | 49cfa5cb15aae26ee2db8ef68ad97ef278942cc5fd64db8cef932c883e6b0a8b | PNG | 32 | 70 | True | 1022 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0352 | assets/Bitmaps/arc_radi_33.bmp | 4a2b3406d724c8d7e99301da821af7945fe8a27bbdd175703eb42352222ab8c0 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0353 | assets/Bitmaps/Dentes2d/arc_dente26.bmp | 4a3f34b66c1df260a8aae2e30f32f5abe35c1ec0b471138f9d8edcd9db46afe6 | BMP | 32 | 70 | False | 6774 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0354 | assets/Bitmaps/Dentes2d/arc_dente61.bmp | 4a771e24a1f9baf8a620c633e6a828ba82b9d3d6f6c02f8322eebe64849af7ac | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0355 | assets/Bitmaps/Dentes2d/arc_dente17a.bmp | 4a9011a150b40e22fec08758b5c126cb624c6f5bfa9506f25b46a4bd17ad56a3 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0356 | frontend-react/public/assets/easy/dia_auscoroa.bmp | 4af55560ffe1618cf4726e3e9e69999c702e654e0555461d600f2b1ad1383dd7 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 76/2/1/bitmap1;76/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0357 | frontend-react/public/assets/easy/int_protese.bmp | 4b7a858c017c764fa4ed073eb70f89a2b5e1f6facf77a12bd9239039d2c58c04 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 56/5/1/bitmap1;56/5/1/icone | A | SIM | assets/easy do React |
| A0358 | frontend-react/public/assets/easy/int_total.bmp | 4b825ff2e0391939000f28d9fd5636ea55587d5ee0365756042e896d721974b7 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 24/4/1/bitmap1;24/4/1/icone | A | SIM | assets/easy do React |
| A0359 | assets/Bitmaps/arc_canal_12.bmp | 4b9f7e39a949eb7fab856dda578ad605306125cc5dce2a8067664ee323d3de40 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0360 | assets/Bitmaps/arc_canal_18.bmp | 4bbf87551237c6406aeaf9cb2836ac6b7cb31e22a27643e36a4af69f900ab3d3 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0361 | assets/Bitmaps/arc_lesao_16.bmp | 4c148b666ed2aab75839f24de2e9bb6b84d22064db939c7efc7ba8f2f255fe7f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0362 | frontend-react/public/assets/easy/cmd_aviso.bmp | 4c39442bfcc5f9961267524cb6c2124b7bf5d9500fe5c8e8d590d35fd11da445 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0363 | assets/Bitmaps/arc_fissu_33.bmp | 4c645315bb7d65c4244be6bd9a03218a2fa00a8220e56867f828934f19c9fef4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0364 | frontend-react/public/assets/Icones/sim_face_40.bmp | 4c6a32e8834addca0286a52d0df91e2ba497ab97c34b8123c26e2137353fade5 | BMP | 12 | 12 | False | 110 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0365 | assets/Bitmaps/arc_bandagem_25.bmp | 4c82083a58a1e28643a0248660974a33180dc5b7eeb21ffb3873f7c8d66f7fc9 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0366 | frontend-react/public/assets/fichaClinica/odontograma/estetica.png | 4cbdefa5a573c64be59bd72b6de3da000a90a317854dd2eef4c6be02aeba49e5 | PNG | 124 | 124 | False | 20377 | UNKNOWN | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0367 | assets/Bitmaps/Dentes3d/arc_dente82.bmp | 4cdede5bce5d4a9636404bffa4c3382b2295805d8c25e348abd7d978c4d824b2 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0368 | frontend-react/public/assets/Icones/sim_simb25.bmp | 4cf954d880387ef21c0cb235c443cd792160730ee6ac0942ebff9ec2a5d5c655 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0369 | assets/Bitmaps/arc_radi_43.bmp | 4cff520208019c1a0b7d096a604f81dcfa669b26a60cf8b57230b3d613ae36a9 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0370 | assets/Bitmaps/arc_coroa_61.bmp | 4d01d393c9a2de1996026f00e9ebcdd7581fecbf0fb2a6eb3bb18c0a1d2ddf66 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0371 | assets/Bitmaps/arc_lesao_24.bmp | 4d4001449107d9e24b4e2d6f30f3b28237cf30281212d0cfda43efbb1a865bae | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0372 | assets/Bitmaps/arc_nucleo_61.bmp | 4d7b4019b66836f5decccdda9ac659f3300d83061b13bfa0cc30725972786e2d | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0373 | assets/Bitmaps/arc_radi_38.bmp | 4d7ffab7d558f5f2b1d8a235557776a5ba766f4312abc3d405e3ccdc072b2e65 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0374 | assets/Bitmaps/Dentes2d/arc_dente83a.bmp | 4defa15bc617cc0cc1e3a99d6258dea42ae857ba5d716e04bf8258580c3dadf9 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0375 | assets/Bitmaps/arc_bloco_53.bmp | 4e1d491d0a6a9c5ef9d2e9e7ecfd7ec7267ee6e95fd8fb3a58b5c4a900885681 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0376 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_biop_mand.png | 4e1e37af492cbdb700a030434f53d8bd9659d51aa113ee973c5c103e6f59e1b4 | PNG | 24 | 24 | True | 2677 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0377 | assets/Bitmaps/arc_rizectomia_24.bmp | 4e32cd8a4eac705da2ea48e411ff4a0368c6e5d6d0585a13fbcf4a9982c49cd4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0378 | assets/Icones/ico_alert.ico | 4e38a167fa3c13ce8ac78670bed5cdac8d4be739f9f4262c8444c9b7eadb53f8 | ICO | 48 | 48 | True | 9662 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0379 | assets/Bitmaps/arc_nucleo_52.bmp | 4e550022edb64a30b2c0c204f9bccf539a6389ef29b3a14a774878d4889367dc | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0380 | assets/Bitmaps/arc_apicecto_i.bmp | 4edf0c0aab3c2274307add3bf25fe9ac25fecd86d9e3c357981b99914aea81c3 | BMP | 32 | 70 | False | 1238 | PROCEDURE_SYMBOL | NOT_DETECTED | C755,C715 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0381 | assets/Bitmaps/arc_capeamento_21.bmp | 4f1972588af3a1277afa0b20ce6086f6c6ffa6156f72063bd6ef7fa4328a90b2 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0382 | assets/Bitmaps/arc_erosao_47.bmp | 4f20b7585628d17c2917200cff08d0791e7cdf54665c19d97526488dfbb97446 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0383 | assets/Bitmaps/arc_coroa_45.bmp | 4f625209916617d2dc3121f334106c21738f3a58ee5ee9e6f41304188756f0a9 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0384 | assets/Bitmaps/arc_fixa1_37.bmp | 4f86f203e476bb60594da7414d327e7114719f441b38f8f7504ca503bb030c44 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0385 | assets/Bitmaps/arc_erosao_41.bmp | 4fc365a94ec5b4555d58b41497f9976a3d0f3a4a541cf7468067c42d312d2a2a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0386 | assets/Bitmaps/arc_mantenedor_s.bmp | 4fe8d96e3c6e64eb768e05530a869a5e0c76f47177fe31f8da8120a7fbd62af7 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0387 | assets/Bitmaps/Dentes2d/arc_dente62.bmp | 502c7cf2325480c02558a4a6e5f782290a191fd4fda40caf8a668efa603ae7c5 | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0388 | frontend-react/public/assets/fichaClinica/odontograma/ciruriga.png | 5066425dd7460c7f4a29809c9dd213ba46a7e5878b6b50a61bf2c3c334d635bd | PNG | 124 | 124 | False | 20802 | UNKNOWN | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0389 | assets/Bitmaps/Dentes2d/arc_dente46.bmp | 5148364a511be7d5c318ec12dedfdf0fe980eaf739c9611a353d28b9048bedf5 | BMP | 32 | 70 | False | 6774 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0390 | frontend-react/public/assets/fichaClinica/toolbar/ico_menu_odontograma.png | 51715797e2b892ab144d906771ee34364daf0a45b708e1d9a36dd23812672528 | PNG | 16 | 16 | True | 105 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0391 | frontend-react/public/assets/Icones/sim_modelo.bmp | 51780800b0673f22ef310fd594c910efa17e7c0fa726f8b9940ca4fcdd873543 | BMP | 15 | 15 | False | 122 | PROCEDURE_SYMBOL | C616 | C693,C728 | NONE | A | SIM | biblioteca-base |
| A0392 | frontend-react/public/assets/fichaClinica/toolbar/ico_odontograma_toolbar_prc_pesquisa.png | 51c8076433f06aaa8b383a63413877fd355bf53c32999d4d2110c37dd3cbf4d2 | PNG | 16 | 16 | True | 105 | TOOLBAR_ICON | C365 | NOT_DETECTED | NONE | A | SIM | toolbar |
| A0393 | assets/Bitmaps/arc_capeamento_22.bmp | 51ed16fb69ead806ba5fce72f0985866686ebd5a0c65c2d4c76a6f81c2b28478 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0394 | frontend-react/public/assets/easy/int_faceta.bmp | 522fbcca1b24de7ea2f48e56f504f0506d2856c1a520c8db383e59be669fcef7 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 39/2/1/bitmap1;39/2/1/icone | A | SIM | assets/easy do React |
| A0395 | assets/Bitmaps/arc_facet_48.bmp | 524eef1081eeeec034ec53186dfea1daad5a218cbc91c8636c085dff932b6aa6 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0396 | assets/Bitmaps/arc_fixa3_36.bmp | 52a4dac34353e14db02be56a919b95263440247821b4b5a095271a6a1637281b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0397 | assets/Bitmaps/arc_capeamento_43.bmp | 52dae2cb58054971a247a739a2f09948f4ce61eefa752fb931383e37c71f901c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0398 | frontend-react/public/assets/easy/int_hemi.bmp | 52e0d281d5aff8e6549bfc2cbe4841d56eea910eb62071a67bb8ae26f0d44fdb | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 46/2/1/bitmap1;46/2/1/icone | A | SIM | assets/easy do React |
| A0399 | assets/Bitmaps/Dentes2d/arc_inferior_mista.bmp | 53068c2c27094f66c26117df3799af50fef107c6d420885d589c3df97593bf71 | BMP | 512 | 96 | False | 196662 | ARCH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0400 | assets/Bitmaps/arc_lesao_13.bmp | 53a83e8c128c5e5a8722ecd0d44cfad8f518c6374834250440e85722a5c329e0 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0401 | assets/Bitmaps/arc_rizectomia_26.bmp | 542a2e8c496efe95c5543d05e820801a01b32bd134d92efc34e17f2f11a88d18 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0402 | assets/Bitmaps/arc_coroa_41.bmp | 542cd98667a769def9374444a21fce1b0fa8cbd29dc87fdf9694debf6c4d9f7f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0403 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente36.png | 549e510bdf0dfb144695e25fa083a167a594e7f28d28d8d30e3d3b0233acb01e | PNG | 32 | 70 | True | 1487 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0404 | assets/Bitmaps/arc_coroa_17.bmp | 54a0b08643dfd06db5d0e97e99d5d08a874ca3e68153405223279a4e3ab4b9ea | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0405 | assets/Bitmaps/arc_descal_16.bmp | 54d7b592049a1ce200094e2a3a92dec583ad7c7a6fa5c3e95e2e241ac05c54e9 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0406 | assets/images/int_rizec.bmp | 557de36a462950ec5257b36298bce283a509aeffa9142fdb9b610311918e3b80 | PNG | 24 | 24 | True | 2190 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 47/2/1/bitmap1;47/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0407 | assets/Bitmaps/arc_canal_54.bmp | 5583d3c2a690f892ad9007a152691d63e6ea13b4c4de4b86132a213f2c6b33a1 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0408 | assets/Bitmaps/arc_coroa_73.bmp | 560ed2a8acbdc02a3a080de167ff90de6f6551981af4ba4777e568536d42be16 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0409 | assets/Bitmaps/arc_bandagem_34.bmp | 5689ab4b8b2a0f617700a3de03dd959ddc0d3566d2d854c38bcf5889ffadbafe | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0410 | assets/Bitmaps/arc_bloco_32.bmp | 569c8659de8888f19e48b872fcb921016f0c7f95b26250f24ef3b64284bfd78c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0411 | assets/Bitmaps/arc_lesao_18.bmp | 570f47408290d78118f91aa19c11b33d1fb13cc3e32f5f82f6a7b2c69b0a8dee | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0412 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente45.png | 572071a604b9bce26cb7d71eb5b3e1193479954f969779823fbf311e1981daa8 | PNG | 32 | 70 | True | 1098 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0413 | assets/Bitmaps/arc_fixa2_23.bmp | 5756aa6d39dc4fa8ca1b8ab0421200dd6ab57038c30f17cf8f2b92b63262ad8c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0414 | assets/Bitmaps/arc_canal_81.bmp | 5762ee62b8192d6d573598eb43a468bfbc19ac084312586d4cd4bca206d0a0b7 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0415 | frontend-react/public/assets/Icones/sim_simb21.bmp | 576c24d06ae0b705eb138baff721752290566e335c84f0a20aaf09156a2cd034 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0416 | assets/Bitmaps/arc_facet_35.bmp | 577e8695d656cb341241de70654f52b1cacf48dd86f741fba2bf511dd01970b3 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0417 | assets/Bitmaps/arc_supra_i.bmp | 57f0c320fbbb24e9b998513b552a5916e0bf14b717d7b065c97badaabf308886 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0418 | frontend-react/public/assets/easy/ico_check.bmp | 57f144640a7713974ab18ff3f7686d63b93cba2c9b02e320a26285356014399e | BMP | 16 | 15 | False | 238 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0419 | frontend-react/public/assets/fichaClinica/toolbar/ico_select.png | 57f3117db77ca5a5821417d088abecf30473adf1429d56a0d03b71a520c1460f | PNG | 30 | 30 | False | 263 | TOOLBAR_ICON | C365 | NOT_DETECTED | NONE | A | SIM | toolbar |
| A0420 | frontend-react/public/assets/Icones/sim_rx.bmp | 5845a2d50d1a7fb81a8cb37f368cdb736350be41b42d54b8095b5295022e4f3b | BMP | 15 | 15 | False | 122 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0421 | assets/Bitmaps/arc_nucleo_83.bmp | 58fcaf9cf3507c92963cd99cb08a4f20afbce9ff2349e2dd3f473e35670a17b2 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0422 | frontend-react/public/assets/easy/cmd_testa.bmp | 59cfbfbba6e01cf547fc29ea046bd10056d02a2e5b59580a9bade561b08491a5 | BMP | 24 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | C693 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0423 | assets/Bitmaps/arc_canal_32.bmp | 5a14206e74d9375b90e53edaecb69a62cfef45d40c26495d8f8bc1d4a3ca4c6c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0424 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente25.bmp | 5a365207cc3a1f874727978b01f0b8e6cbd19726f19b79ab96bcb901ec6fcf3e | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0425 | frontend-react/public/assets/easy/ico_foto.bmp | 5a5faa1e242ee1c8f2ab44f49fdf212c71b96f2979ccb7c8b47ed9c62d80dbd8 | BMP | 16 | 18 | False | 262 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0426 | frontend-react/public/assets/easy/cmd_campo.bmp | 5a806a15cb620fabd436727dc8b8140099ed48f974aacec3802a713167b5395a | BMP | 44 | 21 | False | 622 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0427 | assets/Bitmaps/arc_bloco_35.bmp | 5a92a7b66ca008b52a4ffec44c41f02d85beb21332cfd1dbc024046f70351536 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0428 | assets/Bitmaps/arc_fixa3_37.bmp | 5aadf37d380cb60401ed5e7bd0d05d9194be9bd90cf1f5a6e407de4a205e73b7 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0429 | assets/images/int_raspagem.bmp | 5aae018b066ff378a824a00adb4607424af6002c9923140357dba67be148541b | PNG | 24 | 24 | True | 2369 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 18/3/1/bitmap1;18/3/1/icone;81/4/1/bitmap1;81/4/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0430 | assets/Bitmaps/arc_facet_16.bmp | 5b024d3b024491523b8f7bc51d956c882f5073a033b7528ddab17317f5ae0796 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0431 | assets/Bitmaps/arc_trep_13.bmp | 5b219872801ed5d2b035785b31b661a49693cdf944eee76b43abf1697609e429 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0432 | frontend-react/public/assets/easy/cmd_bloqueia.bmp | 5b2867bd5f47200c0234d25c5249cbe3784a417a81c433dd437e32a243ca7656 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0433 | assets/Bitmaps/arc_bloco_24.bmp | 5b7a9b2f7b70d303668673428f9f5ef231e8ede1273e7958f80398a58c0f912c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0434 | assets/Bitmaps/arc_nucleo_18.bmp | 5b7e961cceb530221529b7b6fcbdd1e688d10f80c962a575d7ef253a7dc58db0 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0435 | assets/Bitmaps/arc_canal_47.bmp | 5bef89e0689710f159898baf1bce8a26c5cda95e6a731850cbb0c01bbc59e540 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0436 | assets/Bitmaps/Dentes3d/arc_dente65.bmp | 5bf499ba0edbef612efdac2a8c2021598c9a0701343eeb00c29e6fd7ca8403c4 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0437 | assets/Bitmaps/Dentes3d/arc_dente63.bmp | 5c1dc4e273d366b32bbdb22efba285c2c6281cc60b23be5783c79333697c77f9 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0438 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente15.png | 5c6d07b9abdf342d6fc22aa78495f554c47b13c3126ca241a0b04f77cb1330f3 | PNG | 32 | 70 | True | 1155 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0439 | assets/Bitmaps/arc_bloco_51.bmp | 5cc49de3d1484480fc182f830adf1e5871b7e6b761e24454a00968bfd601002a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0440 | assets/Bitmaps/arc_fluor_38.bmp | 5cd9321da8a28d5ee03c259c4f58f84e9d9929e46757e9ceabad3fc13dc222f5 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0441 | assets/Bitmaps/arc_bloco_72.bmp | 5d21c960a6a2e4f35054296fdac5fd38ce14f562d2af75ce95659e70147f8865 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0442 | assets/Bitmaps/arc_rizectomia_44.bmp | 5dbf7f37f540cc33e71b3a93b21e42724f1ddc58293af1450bacda13ca0901eb | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0443 | assets/Bitmaps/arc_radi_46.bmp | 5e41c95c16865e11bdeb2e4e30294b9839281498d516ae3c6b331185783785bc | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0444 | frontend-react/public/assets/Icones/sim_simb20.bmp | 5e5c1da17c3d926641bdb814e39e827a3ac13ca951971832757f5e5b7de57502 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0445 | assets/Bitmaps/Dentes2d/arc_dente74.bmp | 5e6347fbedc8e7ff5f963b1a4343a3e4a595f78e0e4fa6a87df263a8bb4445bf | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0446 | assets/Bitmaps/arc_capeamento_15.bmp | 5e6908a2a848f3229d6f37857082a53d7ab0cfcdcebd4f7493a45a614e139686 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0447 | assets/Bitmaps/arc_coroa_75.bmp | 5e7fbea32d9b1f2e697a894294f64e61cdc5d4e7b46632676e72c83f03013170 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0448 | assets/Bitmaps/arc_radi_21.bmp | 5e839acc7381f3d27cfedb2ca76af3137556cd54fb8671db3f9109d63cb22c83 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0449 | assets/Bitmaps/arc_facet_44.bmp | 5e8bbeba104f3db8435655b1cc66d153f7d5a3a543b2cff003470c2620595a49 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0450 | assets/Bitmaps/arc_nucleo_82.bmp | 5e8ca09bd6714b41503fcf9be6275f1ce92d4557bda205152f311f7f2c79b2c5 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0451 | assets/Bitmaps/Dentes2d/arc_dente28a.bmp | 5eb5ec5099afdbe631d4f41ad82c96e3d6a50c6f2649666c719afb572c838d33 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0452 | assets/Bitmaps/arc_trep_24.bmp | 5ec674e4d7e8de695dec06f76dec3a57edc59d79e84a89592be73d2a6db41d76 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0453 | assets/Bitmaps/arc_erosao_32.bmp | 5efc1edb076f5964c9ec8da049d37547f695154b02b7f2555d3b253611f91b45 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0454 | assets/Bitmaps/Dentes2d/arc_dente31b.bmp | 5f112ab5965a9366b3549ae274358ebd4ca7d1c58bbf58be51dad9b3511437a1 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0455 | frontend-react/public/assets/easy/arc_superior_perm_test.png | 5f18d4bbcaa3bf255558a38a2505f6840b1fd367876d435c94f044c5162fc9e7 | PNG | 512 | 96 | True | 16925 | ARCH_IMAGE | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0456 | assets/Bitmaps/arc_fissu_14.bmp | 5f211d14fc16ba9ac97b1560ac4fcac8441f0ed3f2706e531bfada58e6b00b2b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0457 | assets/Bitmaps/arc_lesao_33.bmp | 5f4edea54909584d88c21b9d33eeff6ed2ed4c91bcab9cb86c21bb45e98b34fd | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0458 | assets/Bitmaps/arc_canal_23.bmp | 5f863f7b13e477cf28177b6407955104db4b1a4f64f27ab56b786d84e0a806e7 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0459 | assets/Bitmaps/arc_bandagem_21.bmp | 5f8bed90e5c7eab844f9366ecebaa89f145b410d71814b0936981192378b8e33 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0460 | assets/Bitmaps/arc_nucleo_12.bmp | 5f9a81a5756f9f0b2502c107e3bd36c1012d71e61862660a1aecf994fad947e8 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0461 | frontend-react/public/assets/easy/dia_intrusao.bmp | 5fed5c57540cf5d4aecb34aed30e3cd47a26cc65e8b18f45e0354ea9d86ad1d2 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 68/2/1/bitmap1;68/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0462 | assets/Bitmaps/arc_fixa3_21.bmp | 60176cf49a5b45eac594428b962977d93c2200048addbbc7574a3af45543cc86 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0463 | assets/Bitmaps/arc_capeamento_33.bmp | 602cf22699584f13b21e2d5f0c7eb2ee99b9835a430f40b021dc3becefa8ca01 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0464 | frontend-react/public/assets/easy/avi_recados.bmp | 6065412283bdb273e3cdbdd01bc4e2992e3770b704f7ea0f05f5e6b6dd4f2d42 | BMP | 32 | 32 | False | 2102 | UNKNOWN | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0465 | assets/Bitmaps/arc_erosao_44.bmp | 60c051d5aa33aa737e17b2e716b74407c5f60bde7c043cf61be189d75f5376df | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0466 | assets/Bitmaps/Dentes2d/arc_dente71.bmp | 60dbc4e8b3049d570c2d08f526c0b1ebf58a4ca1ff0d1330bead2d01472dd0e8 | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0467 | assets/Bitmaps/Dentes2d/arc_dente63a.bmp | 60f9909eb8c7fa6f5513a678d944f75ca4745503557325fb257b6ab678960952 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0468 | assets/Bitmaps/arc_fissu_35.bmp | 6124696c2c3b13436b759c0bab879bebef1e811e6e269fc104862dc0767bceb6 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0469 | assets/Bitmaps/arc_radi_47.bmp | 6137abaf34536a8c8c6b8e4a80094e8faa8e9ef5ef89424d0139b90f3f9ba715 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0470 | frontend-react/public/assets/easy/dia_giroversao.bmp | 61561f12187c04e4d5a53a77719f8b1134372585cb280de4d2be69ec585910ee | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 71/2/1/bitmap1;71/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0471 | assets/Bitmaps/arc_nucleo_55.bmp | 619236d2ea9e7f1ee0a550be49f4adfeb3e93df266d800205be3e600174594fe | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0472 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente23.bmp | 61cf150f7cbc54bd937677ffeb108576bfdcdad9432cb9fcacc36320faffa2a6 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0473 | assets/Bitmaps/arc_canal_26.bmp | 624f961e7be965234b01f95e560842d7f2618084ddb68f6511f6273551108e97 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0474 | assets/Bitmaps/arc_lesao_46.bmp | 62b57f15bad85c59953a70082f2832595c3c53e064771111754a908e207b45fa | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0475 | assets/Bitmaps/arc_fissu_17.bmp | 62e3b1896041fbbec2a1114e72c70dab6099309ce827ca304b19253dd288fae6 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0476 | frontend-react/public/assets/Icones/sim_bra_40.bmp | 62f046b73fbf9497aebe81fe12a641446ebf72c7aa2d29c27346561861f0ec11 | BMP | 12 | 12 | False | 110 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0477 | assets/Bitmaps/Dentes2d/arc_dente33b.bmp | 633121cf2b96940cb67231dff70436c040d3cd3fc06b8eb3e072eb26a2b9f55c | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0478 | assets/Bitmaps/arc_fixa3_41.bmp | 637156fdeed5c790d63474e12329ded0b71efe268ecf939de741fcd5a45c5bc0 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0479 | assets/Bitmaps/arc_radi_42.bmp | 639ad31a26e2db7112215e33a11af97a9cb273734fe5a180c27eab3c4b702adf | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0480 | assets/Bitmaps/arc_fixa1_43.bmp | 63d11c8aa3d55b34efee7e8bfc904f617ec57f6f60b634b816be28bde288a4ed | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0481 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente42.png | 6429c1d94452b9557365e263f9d76ee709834e2ace61d2be2582126206982c38 | PNG | 32 | 70 | True | 933 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0482 | assets/Bitmaps/arc_lesao_38.bmp | 6469301347e7d90f102aa365cd1bb9e2e62846dded9c514b65689e2fa11b4242 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0483 | frontend-react/public/assets/Icones/sim_down.bmp | 6493d2e0d447deae1cda7f77e2c8f2acd3c4f350bfb03a78f203e4ccc1bd9189 | BMP | 15 | 15 | False | 122 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0484 | frontend-react/public/assets/Icones/sim_simb2.bmp | 64943543aefad87529363b807ec6462c554bd111b76424f006b4a17d8b05aada | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0485 | assets/Bitmaps/arc_fixa2_11.bmp | 64a4402aa6e61c8036d8d1bf9d6ea3c82d34d62348e11d0da85e4e8df094de27 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0486 | frontend-react/public/assets/fichaClinica/odontograma/especialidades/esp_Diagnostico.bmp | 64be3976880990795f7acca269fac0aaaafef9b4ea7e601dc46312fd78789a13 | BMP | 40 | 25 | False | 3054 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0487 | assets/Bitmaps/arc_facet_25.bmp | 64d9f0b84750ae5b14cc687b752744e5fa4092039cdfe3ce94cdbf3dd5a613fe | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0488 | assets/Bitmaps/arc_descal_44.bmp | 64dc624caaa9a16527794fa165b537f3c09fee05da3493e4372d9d1a69d22e36 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0489 | frontend-react/public/assets/easy/cmd_editor.bmp | 64e54acca1d450f5b500f5f0cced3b74a32643a3db8c9b27042f074195592cf0 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | C730 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0490 | frontend-react/public/assets/easy/cmd_agepes.bmp | 653a8e061722fbfa289a3272a154bea6af85b946a494f66ccab9ec13f280454f | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | C730 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0491 | frontend-react/public/assets/easy/ico_aniversario.bmp | 655a1d1b65a93772ae19f3a715606bfd80fa535292682cd4326bc6798a6d1232 | BMP | 16 | 18 | False | 262 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0492 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente26.png | 6586aa8d7303784b7707e2a5842e035bcfbfb64226fdbcf67c66ecf2fe478d38 | PNG | 32 | 70 | True | 1570 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0493 | assets/Bitmaps/arc_nucleo_11.bmp | 65b6432d10db8eaf767564f1e3fbcd091f3e399ee69abd0db5e2b04f6824b029 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0494 | frontend-react/public/assets/easy/int_emerg.bmp | 65d06c25440b6ef3554d79fb424b32403e4035c66adaa15fda04d829e9cb732a | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 40/5/1/bitmap1;40/5/1/icone | A | SIM | assets/easy do React |
| A0495 | assets/Bitmaps/arc_rizectomia_28.bmp | 660fceb3b1c858173b1db1e1b6448fc0adc90130d260fe282187801d8825f9ef | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0496 | assets/Bitmaps/Dentes2d/arc_dente42b.bmp | 6629463de7ff3a3347712aa1656d65b03197b2c21c26d3ffd07749386db21be3 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0497 | assets/Bitmaps/arc_fluor_36.bmp | 66636393d97b8be6fe26ebf6c1c898a34bcc85c538f15c8a7e0a56dad0df5b81 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0498 | assets/Bitmaps/arc_fissu_32.bmp | 66c3ab0a72deacad94a5aebeb57fb31f8f31d9ed0d28fd0f99dec3f6bd75511f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0499 | assets/Bitmaps/arc_trep_43.bmp | 66e7f991dc3038f9deb50b4ca8699eda44569a22389bb0170eeccff38a6937bb | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0500 | assets/Bitmaps/arc_coroa_23.bmp | 67062a8110b5745847a10fae98e34f18c8f3b7ab110c01a84b1f3d0ac36fd27b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0501 | assets/Bitmaps/Dentes2d/arc_dente32.bmp | 670b62991978a3b7b301e53b7169df1c14ec38abd4f5a3bbcf6c005529e6ba9e | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0502 | assets/Bitmaps/Dentes2d/arc_dente11a.bmp | 675cfdc504af440e244bd0724054c2ee50613daf156a692cc7548fe103327098 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0503 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente11.png | 67a56abe0bf92f473f8804936771dd55053637e4fb08a11fb36d5d5e301ae859 | PNG | 32 | 70 | True | 1314 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0504 | assets/Bitmaps/arc_capeamento_23.bmp | 67b1bfdd4968b14c63397d883f2655e393ab17a903464e5d1805a6a68855e1e9 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0505 | assets/Bitmaps/arc_fixa1_33.bmp | 67be07eb5d63099b7bd02ce66b7676bb59b6dd3040918b801cd20639f44d0267 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0506 | frontend-react/public/assets/Icones/sim_simb24.bmp | 67da0a837bef818d7f43208aad3c63d750617acbda4d05db87ebb4a193969c18 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0507 | assets/Bitmaps/Dentes2d/arc_dente21a.bmp | 6808fdbd3c7ecbbcce74c94687c6809bdcf173df205bcb13c0d38054c844752a | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0508 | assets/Bitmaps/arc_nucleo_43.bmp | 6826f6736f26c3745a22e1c752cb6b08ecbad85db4dfc226be8f23908bbdfae4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0509 | frontend-react/public/assets/Icones/sim_simb22.bmp | 68620440d0e234bc4c6157133bc20f51944b4b4c9581a4303e61185312087b15 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0510 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_torus_palat.png | 68822a99a581391ea4ea69f66a0eeed346049dc8e225a207ae5f943dc7558a3f | PNG | 24 | 24 | True | 2898 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0511 | assets/Bitmaps/Dentes3d/arc_inferior_mista.bmp | 6883f7a703d23f24e0e90365cd6fe8f50b2110269ff415fb5f1b1316f0eb524f | BMP | 512 | 96 | False | 196662 | ARCH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0512 | frontend-react/public/assets/easy/int_retalho.bmp | 688ae447158dc7b01507c74440e06ae1c3614f5488b4dadf02f755f61498a4a0 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 17/3/1/bitmap1;17/3/1/icone | A | SIM | assets/easy do React |
| A0513 | assets/Bitmaps/arc_lesao_45.bmp | 68ab4909e2c5be99304c63f47265bc324dc3d3a3a59080d7d90e2272f5733de9 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0514 | frontend-react/public/assets/easy/avi_validade.bmp | 68b0a91d9ca8fc329a90e8cdb992bd8138cd4c51064c4dd2939365a5ae9f9274 | BMP | 30 | 29 | False | 582 | UNKNOWN | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0515 | assets/Bitmaps/arc_trep_22.bmp | 690e7ede8ba5f7e526a215d7614e15c8ff4960027fc340bd98effb28b3f367f0 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0516 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente24.png | 692443246e42bdfaf520d3536978662a9e51d69b569ef26387c3a7562a2df62c | PNG | 32 | 70 | True | 1194 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0517 | assets/Bitmaps/arc_nucleo_34.bmp | 694dab02a0f00885b8d02f04e19b9c51595fd945c2f2cefd0cfafa9a3c6caebe | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0518 | assets/Bitmaps/arc_fixa2_31.bmp | 69ade02e2761a3d02c428a16d9cdaba5d68879737923708bef41370cd5de3055 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0519 | assets/Bitmaps/Dentes2d/arc_dente23a.bmp | 69eaddc6d38a7c70d3d82a5774532e125df882a044909a5e67bb233eae6bc387 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0520 | assets/Bitmaps/Dentes2d/arc_dente12a.bmp | 6a0252c59ae64da21365fb85b606ab70a55b9bebe01f9dbd77eaeb07f238f9d5 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0521 | assets/Bitmaps/arc_coroa_54.bmp | 6a94dddb771b01f11ed23265dfc4c6dae2a08e598c5ed14176d6ab5f63bb7859 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0522 | assets/Bitmaps/arc_facet_18.bmp | 6a96acedea2d143d048386b197ff4e9b73d53d1e6dcbc2679c37937a0a2c13ef | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0523 | assets/Bitmaps/arc_fixa2_21.bmp | 6ae9923827c0547c49d859b4c97170b548c8d659513b42a3b11956f24932d148 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0524 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_generico04.bmp | 6b2db4eb814817beb06096bda4638472dc8d401d4faaf442cfc73fab9411498e | PNG | 24 | 24 | True | 19370 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0525 | frontend-react/public/assets/easy/int_movel.bmp | 6b653a0082384ba81032e2c3f2b6a00a90575ec02405653aa1581343979c1eed | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 6/6/1/bitmap1;6/6/1/icone | A | SIM | assets/easy do React |
| A0526 | assets/Bitmaps/arc_bloco_42.bmp | 6bacd8b8cdd56d210cf5b382c48b7a073bcad89a2091af87a572de7b28988d55 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0527 | assets/Bitmaps/arc_erosao_13.bmp | 6c17f03225ca1f254acb5d527f7b75af829115de6e02d8fcde8aed49cde6b8b9 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0528 | assets/Bitmaps/Dentes2d/arc_dente81a.bmp | 6c7bfd3d54b716b8f986fc8cd8e79d8dddbde62c9d598d1996f6cc92117d76d5 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0529 | frontend-react/public/assets/easy/esp_Generico.bmp | 6ca86a0f8e2acf6760e78b7037c21d7d159d3eb01c6b05382bacd8333be07527 | BMP | 40 | 25 | False | 3054 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | assets/easy do React |
| A0530 | assets/Bitmaps/arc_bloco_21.bmp | 6cc0ae87177d5ec45f221bbc55e726a166f05dc5abfbdc045a7efe136b943236 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0531 | assets/Bitmaps/arc_erosao_12.bmp | 6cd71e366a0fa23b628676d521977d8cf6898800c87d99388cfa767d4fedf685 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0532 | assets/Bitmaps/arc_trep_32.bmp | 6d090bee17e17c0ea0b2b52b14378c1ccc24aab06a6df7f9f307b368326e2b78 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0533 | frontend-react/public/assets/easy/cmd_up.bmp | 6d15a18c09025d72dd315d828c70fd1f236975a1593297da37ff0d1ed1bf7622 | BMP | 25 | 14 | False | 342 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0534 | assets/Bitmaps/Dentes2d/arc_dente35b.bmp | 6d1bd59ba6486ca7bc327ac5f65bda3451d249610cee903cd2f05768b8d4f9b4 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0535 | frontend-react/public/assets/Icones/sim_simb28_40.bmp | 6d4c2e844b01e152eeb6cce39a6e79cfb571c1c29af1d2f96dc70a91bebcedee | BMP | 12 | 12 | False | 110 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0536 | frontend-react/public/assets/easy/cmd_retornasemana.bmp | 6d79f7ffe6b3efaada0dec6d4e0659876f1beedab27687fe0cae3cf029063072 | BMP | 11 | 16 | False | 246 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0537 | assets/Bitmaps/arc_trep_23.bmp | 6d7e2112259d3a830bb6d3737f3772ca7bbbf16fbb1dc3145763ff4a0bac9ce1 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0538 | assets/Bitmaps/Dentes2d/arc_dente65a.bmp | 6d80535e20ee9414e18aed1d01bebdc1b81c8d509a97391ab835fdbf0f4193d8 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0539 | assets/Bitmaps/Dentes3d/arc_inferior_dec.bmp | 6dbcdb1481381844b8eff8dd56f478358160ca625bd71c3ea65561fc1cfe1c7b | BMP | 512 | 96 | False | 196662 | ARCH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0540 | frontend-react/public/assets/easy/cmd_help.bmp | 6dc133b52144741d1e7d737892f0cea5146dc6b916192d4fa4d096ee953c9735 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | C730 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0541 | assets/Bitmaps/arc_bloco_55.bmp | 6dc82e9ead3ea7725a72868f62d2d21fc32acfe393d514eaf1a1d25d5a895e37 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0542 | assets/Bitmaps/arc_nucleo_75.bmp | 6ea66f60d9affe3525206f2dbfd87716cc6bbeafedd9ecc6fca93aa48101b2ee | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0543 | assets/Bitmaps/Dentes3d/arc_dente53.bmp | 6eb5baf259962999024f70893ff483e50eb6068518f68e431ccb1b0ac91e3123 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0544 | frontend-react/public/assets/easy/cmd_backup.bmp | 6ece0747824c5c1e3bf3514a291407f2a0702f6f7b0f3f8271d4ea54510625cb | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0545 | frontend-react/public/assets/easy/cmd_menuint.bmp | 6eebbfd2b5d832d9fb080dae5a81b8ae081107bb2db7c3e891121242870d3cba | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0546 | frontend-react/public/assets/easy/int_oclusal.bmp | 6efe68fd8a40079efdb3656b5406029c6914bbf8bd4dc9567cff0acef7a47b66 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 35/5/1/bitmap1;35/5/1/icone | A | SIM | assets/easy do React |
| A0547 | assets/Bitmaps/arc_fissu_21.bmp | 6f17fdd41e054b0c22ff7e9856f8229c44eee8bf1f7e578757f88145fb13cc8b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0548 | assets/Bitmaps/arc_canal_42.bmp | 6f76c31a8a49cf16b60550713d5f1fc8f2e5d3330405baa4167b8314633c7637 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0549 | assets/Bitmaps/arc_fixa3_23.bmp | 701fe50106d065cacc1b611a00e4b733d634ee0d8468f527e096c17ffef46d41 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0550 | assets/Bitmaps/arc_canal_38.bmp | 70e42127efb9303659edc4797249255d8843c82377c9113b5fed0e461538b3f3 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0551 | assets/Bitmaps/arc_nucleo_24.bmp | 70fb2b2565bc4eb42f94e810a06eb06d33d887cb8f0b0560f59fbf032e2f0c21 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0552 | assets/Bitmaps/Dentes2d/arc_dente64a.bmp | 717af3d3782197cee31a636b612b5cc1622d3ed96922a27dfccf68d1d87e75f8 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0553 | assets/Bitmaps/arc_fissu_25.bmp | 71cb057d1fc2fdea8c23ba787ca5276e0aded64d844fe5aabddd48c87e81ff0a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0554 | assets/Bitmaps/arc_nucleo_85.bmp | 71ee2f1cb373465ffd3a6f294b352c314d61b97710261d6006427da30c67d98d | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0555 | frontend-react/public/assets/easy/cmd_rapido.bmp | 72716465b2bfa0a9f4f5c543196c27a43ecd6b87bf07a9d947a8396f64317e47 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | C730 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0556 | assets/Bitmaps/arc_canal_45.bmp | 72b233565a8234cdd2aa0e406c1d8b71c53f400bc61df5105d1cb9636cc8fc7b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0557 | assets/Bitmaps/arc_erosao_34.bmp | 72bda318e05a0bba871718c13a9d1428f96f0b091104365fe2f31e789f66e68a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0558 | frontend-react/public/assets/easy/cmd_proxage.bmp | 7326c593c591f60baf28c4b207ae282ab4be3dd5dc49c88a3290daa62923b960 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0559 | assets/Bitmaps/Dentes2d/arc_dente13a.bmp | 73480fa404e23dae63200edb7e337165408cf4e4d5c8513e0074e53b5a8bfeb9 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0560 | assets/Bitmaps/Dentes3d/arc_dente54.bmp | 73a36c8d787558dcc33c5b29382962a8753e745d76f49405c48fc591b44c48ca | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0561 | frontend-react/public/assets/easy/cmd_fone.bmp | 73c13ab34fc7f938c71069419933c95229802534ac99cc16ac12f8451ae6779b | BMP | 18 | 14 | False | 286 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0562 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente11.bmp | 73f84efd30037de8a9fcea059d86e47e02fcdb9a330c679a2c2151a1fbd06d00 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0563 | assets/Bitmaps/arc_fixa2_32.bmp | 7400608dc65ca6719ba06fb408b6e6a4e48462f9884d659e8aaaa17ffbba1990 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0564 | assets/Bitmaps/arc_fluor_44.bmp | 740f9c41ec97cb191d135ff09bf4799f8a0589aabec4cebb1a00401f1466a96a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0565 | assets/Bitmaps/Dentes2d/arc_dente42.bmp | 743da41baf1633475599dc1b5d764d5313966843455e591fde4e2ae29f9e516b | BMP | 32 | 70 | False | 6774 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0566 | assets/Bitmaps/arc_capeamento_36.bmp | 747f27e077eeb3b3e15ceb9c15db973e28b96f60132f2fb05e67ecbced7e5258 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0567 | assets/Bitmaps/arc_fixa2_25.bmp | 759261d55ada079aee99552702111158ffce06f8fa6cfb3e399a349be2372aee | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0568 | assets/Bitmaps/arc_canal_14.bmp | 7601bf3456b8178e2297c4091fef8fbf69bf49b9830f0f51c279e28445c5879f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0569 | assets/Bitmaps/arc_erosao_18.bmp | 760e1d3e87d3719d9e9999327e9e880ce057542edd41829a9c9dc562d44cbfd6 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0570 | assets/Bitmaps/arc_ades_s.bmp | 768bb3bd6445237ef9e323e7eed6492c79157981a1e4ad0fa25615d63f0e5073 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0571 | assets/Bitmaps/Dentes2d/arc_dente24.bmp | 769c51d419b152294a3a0b5ff6ca6c4e3cb8d04dd503621eab18b51dfcd77b8b | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0572 | assets/Icones/ico_quest.ico | 76db21a910db65f83142de4c34dc2cf1df6432e9b514a643048053f84a024baf | ICO | 48 | 48 | True | 9662 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0573 | assets/Bitmaps/arc_fissu_44.bmp | 76db2edd2424fce8b46cd8497ebfa9e0a922c954632cfb28dcbfe54affddb5ca | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0574 | assets/Bitmaps/Dentes2d/arc_dente13.bmp | 77108e6f2aa772f1805670e0520d5f09eef81f06d6fa8765c37481320c9f95d4 | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0575 | assets/Bitmaps/arc_canal_34.bmp | 7717b08624ef04121eb3184fd6894cf796d659a4247cf56690ccf8093c03c1d2 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0576 | assets/Bitmaps/arc_bandagem_33.bmp | 77468f23ac15958f3d078ee2f1fe8a4c94aa0e860400fe08c180b2064fb279cf | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0577 | frontend-react/public/assets/easy/avi_retorno.bmp | 776ec67940f991d4549dd4b5c5180a0191fb2063c0ba808f6facbe7976cf4818 | BMP | 36 | 36 | False | 2374 | UNKNOWN | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0578 | assets/Bitmaps/Dentes2d/arc_dente44.bmp | 77ac3536db91307bfcf6c1e3a94bcc6b0220f43eb2ea500fb7c6563647755f7a | BMP | 32 | 70 | False | 6774 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0579 | assets/Bitmaps/arc_radi_37.bmp | 77c93fcbe99decf7bc931c16b71973f65a3767870c94d3a21c030fac1ead6c87 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0580 | frontend-react/public/assets/easy/int_reemb.bmp | 77da34f23455c00c537b9e51b7b0f6682c2378e31745d52b02e001df602402c8 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 42/5/1/bitmap1;42/5/1/icone | A | SIM | assets/easy do React |
| A0581 | frontend-react/public/assets/easy/cmd_lixo.bmp | 77e2127b75664401c15757b78278fe9ed02a48adae271716867bec824325b0ed | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | C553 | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0582 | assets/Bitmaps/Dentes2d/arc_dente45b.bmp | 77f734eadcacfc43200cc80353f2cadcb852a1211c942480dba898058658d414 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0583 | assets/Bitmaps/arc_fixa2_12.bmp | 78c3cd5dd7472f83c21b901185e94cf183a6baa6a922225d601a279fad395da1 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0584 | assets/Bitmaps/Dentes2d/arc_dente14.bmp | 78f5c8ce7208105e0bcdc8683ed2f924fa691ab22036539ee65bd4a72648028d | BMP | 32 | 70 | False | 6774 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0585 | assets/Bitmaps/arc_bandagem_12.bmp | 78fdb089aed8822d6fb8b5d5ad0e56c4b38ffa7dcb6da5e5390d7be9b9745b14 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0586 | assets/Bitmaps/arc_descal_35.bmp | 7905dea7899360b6a4cd7d7fe4c631387d708e1cc928d4af40bb4257191ac1ae | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0587 | assets/Bitmaps/arc_coroa_47.bmp | 791aa7da227fedd223439e98454313a2b0e1d1364058e8483ca4ee801dca30c4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0588 | assets/Bitmaps/arc_bandagem_48.bmp | 791dbf38691741e54f96ac253518dd8c2f6020e899646d2d90cfdff706e7112a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0589 | assets/Bitmaps/arc_coroa_64.bmp | 79479b8da15ba8f6c3a75b53573d4d27e456bffaf94310b3d42b2e53528dbd3a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0590 | assets/Bitmaps/Dentes2d/arc_dente36.bmp | 7980b94f1ad2d24b90960e994400aef9097b1e37af37183ef26f6f049844242d | BMP | 32 | 70 | False | 6774 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0591 | assets/Bitmaps/arc_fluor_34.bmp | 798af87793e662ecae182e6f3cf6343b57b04a7e5e2069df5c6c856136b33e52 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0592 | frontend-react/public/assets/easy/cmd_tela.bmp | 799b306bd755849ff3cd0b4e1b8a2f3231df83d2cf5fe9189e123c2fca992484 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | C730 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0593 | assets/Bitmaps/arc_trep_18.bmp | 79b58582c3faad54f994e4934c65ff08749f379842aff51dc4931c922b47a852 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0594 | assets/Bitmaps/arc_fixa1_12.bmp | 7a327e1da5101179a34e2959c667a4e5ae59940836a80733c2453ef28b3229ca | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0595 | assets/Bitmaps/arc_fixa1_21.bmp | 7a69192f662b4890d21f4fd19ff3e550760e5d3f1bea9304a4eed1b01afc3ecf | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0596 | assets/Bitmaps/arc_capeamento_24.bmp | 7a7e4cde171306a2c8400ea8ed7b6b2a064c0f7029b63af48e135a3d3a162df4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0597 | frontend-react/public/assets/easy/cmd_novo.bmp | 7a838ab9c260ca460fcdcaf3fe338e2df578a83dcb870005bdc1e5c72c9e5883 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | C553 | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0598 | assets/Bitmaps/arc_radi_27.bmp | 7ac74e59d5a6cdb6ac94d6b4684727788c0318550f0d7a6e7007ce587144e530 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0599 | assets/Bitmaps/arc_fixa1_31.bmp | 7ad8b1f1ae8dc9c13fc6eb6433e7b5f487fa12430fe076be5db970bd824ce033 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0600 | assets/Bitmaps/arc_fixa3_26.bmp | 7b21f45477b27509ab1db11e3d1abc224bb5b66fef25886dbea9f8e5807143e2 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0601 | assets/Bitmaps/arc_fixa1_28.bmp | 7b2a170ae0f2128e87bb416f4e7948e64b54a4f35508e7f71ad61a3936ee1e25 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0602 | assets/Bitmaps/Dentes3d/arc_dente81.bmp | 7b2d4550194d19a91d6388365f737fde6a444605fc08530cf4420bfa15ce7f53 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0603 | assets/Bitmaps/arc_coroa_22.bmp | 7b325a53f3073e396325eb4fc97b6a280ff0fcea9e0ee623382ab0211addd369 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0604 | assets/Bitmaps/arc_fluor_23.bmp | 7b875bf887467c500c41e3937a33d6494e75d08bd77fd5f65ceb97c5b315a505 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0605 | assets/Bitmaps/Dentes2d/arc_dente38.bmp | 7bee20d2edf32545e02ab895a77d7a3452f8c47e8988aaa11b41e8bc655d4e9b | BMP | 32 | 70 | False | 6774 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0606 | assets/Bitmaps/arc_bandagem_35.bmp | 7c0cd02896b197b6616e73c276c44db33a07088468f703ace289cebff9279b5a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0607 | assets/Bitmaps/arc_rizectomia_34.bmp | 7c1434d37a9be51b156aab101029a22b061d75c535ae9e952ddd05750210e8a9 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0608 | assets/Bitmaps/Dentes2d/arc_inferior_perm.bmp | 7c61dc11347717f3635e3f9487e52fe34fefa68b378cc1b68f6d448bbe74b33e | BMP | 512 | 96 | False | 196662 | ARCH_IMAGE | NOT_DETECTED | C755,C715 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0609 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente13.png | 7ca65598e33fb7d4814492c4306508901a0d1cc973b432e9b284a309dfb7b89d | PNG | 32 | 70 | True | 1266 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0610 | assets/Bitmaps/arc_fixa3_45.bmp | 7d4e2502c1d1659384f161a9f6b14d90e97a2746b230069b590edebd2aab6965 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0611 | assets/Bitmaps/arc_trep_35.bmp | 7dc9c1cb51fd00e65c3b34f2ed748eaae88f4f20c47f2d2ed4d6f62ee621cf0b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0612 | frontend-react/public/assets/Icones/sim_simb26.bmp | 7dea4bcfdf99bdfb438ed38477696199641b6847ad74c79998e0b8fa1c476dd8 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0613 | assets/Bitmaps/arc_descal_32.bmp | 7e0228229c9f586bcff832285971a1bf0c695ebe2afd7f85e4292ac440b3c20d | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0614 | frontend-react/public/assets/easy/cmd_distribui.bmp | 7e4c712d0a1e6f7fb900f5c8343d9b67e11adfd80160da18fb5dc171b16abe30 | BMP | 21 | 21 | False | 1582 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0615 | frontend-react/public/assets/fichaClinica/toolbar/ico_novo_paciente_transp.png | 7e58e95f120a0ef0e504fa52e36c354c524b171c8eb4ccd35bbab13eb3e4a6e0 | PNG | 24 | 24 | True | 436 | TOOLBAR_ICON | C365 | NOT_DETECTED | NONE | A | SIM | toolbar |
| A0616 | assets/Bitmaps/arc_bandagem_42.bmp | 7e91e9d78e66c3e660b20e5898d175b3fdd36f5f131eb342a4e17fd19dd22e54 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0617 | frontend-react/public/assets/easy/avi_pagar.bmp | 7ed0954ee1af97df1a5128fa1a8bee83f47851f09d4ebe5c4cf0c5b56c3d28eb | BMP | 32 | 35 | False | 2198 | UNKNOWN | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0618 | assets/Bitmaps/arc_implante_i.bmp | 7f0c4891e173bdf8c1b5985479d552a68b030570eb7fc3c4b1496d9b78c76f95 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0619 | assets/Bitmaps/arc_fluor_28.bmp | 7fc04d235637eaec6349dcfd883c91f1972cd5df0f55dcd79506668d3f414d83 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0620 | assets/Bitmaps/arc_descal_26.bmp | 8028bbf74d5c5f24f5fb7114a5aa1636b4830c0f7ec2a27786dce042e2bc79af | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0621 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente41.bmp | 80465cd2848a5332bb507369174ba37901a69327044a9529e736156cc8727837 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0622 | assets/Bitmaps/arc_erosao_11.bmp | 804edfb3ce7f97161f0e61dd2537b79dd50e41ae6a73b345f98f8b4ece43973b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0623 | assets/Bitmaps/Dentes2d/arc_dente82.bmp | 809e21b0401464f5e9ae64c0cbbcc6b473ad65ecf76094d8fb8665d3642830c3 | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0624 | assets/Bitmaps/arc_facet_47.bmp | 80bfbcb4b66ed0ff466233f16296da7e35755973c4d3b3520b3df82ea89c80d1 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0625 | assets/Bitmaps/arc_capeamento_18.bmp | 812339a203a80cb26506520fd031924744f842927a99c180f1d5d76b456f7f7f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0626 | assets/Bitmaps/arc_bloco_22.bmp | 815a4654f4f39389520521cb68c725608e1f0e9caf7c4cfa1c3afd760eb4320c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0627 | assets/Bitmaps/arc_nucleo_44.bmp | 81844bfb95379aaf971e03ed65a053777f442e220e58fefd4d7d877a16b01a17 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0628 | assets/Bitmaps/arc_fluor_27.bmp | 81bbc6aaa69ceae1761e6b94cf13e43fa6e2326eda20dc1c658da312a1b72245 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0629 | assets/Bitmaps/arc_bandagem_23.bmp | 81f253fcf99a7e704ee3c10919ba05cb0503ed709dab881504022c7a0d1367ad | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0630 | assets/Bitmaps/arc_bandagem_44.bmp | 82360926b8aa52110d905d34a114bd805613535dd20893bb5d1213ee9d72a30e | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0631 | assets/Bitmaps/arc_canal_55.bmp | 82b6267e3249ce31c549983d2df604dc306169adf5ec50d34d6d541f33908bdf | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0632 | frontend-react/public/assets/easy/cmd_compraest.bmp | 82f6415f3eeab4c8c63d55fe35612b4eef2f939ee750f251edfc372a91237a9c | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0633 | frontend-react/public/assets/easy/int_mantene.bmp | 831f7d1e1b06e329bc2912cfff22f645b1fe9ea948a9bb19f3d232c2a69674c1 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 19/2/1/bitmap1;19/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0634 | assets/Bitmaps/arc_fixa2_47.bmp | 837d85e270720366d8dc3e5bb81aaa4e34b57f8ffde94531efd8866877528b8c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0635 | assets/Bitmaps/arc_fixa3_18.bmp | 83935696e5129de38822aca0b953c48ba5046e0ed0c0249e0a3438d0bcd94fb8 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0636 | assets/Bitmaps/arc_bloco_33.bmp | 839d24b578f54f0721c336a8bdbf86a53ea05fbd38e8a3437c11fc2933363d7a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0637 | frontend-react/public/assets/easy/cmd_recibo.bmp | 83b44af08b0f770e7fd00c33b0f8f26ef0376939fd7b07682af4cc3527a285b8 | BMP | 23 | 20 | False | 358 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0638 | assets/Bitmaps/arc_trep_15.bmp | 843374ca98dbe63b7962516c15358d06588f0306edbf5ad343b0884399ae6bdc | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0639 | assets/Bitmaps/arc_fixa3_42.bmp | 843b4c6db401b7badd425019af16f0cee8d640ecc57a3949f1104ca38be6ebcd | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0640 | assets/Bitmaps/Dentes2d/arc_dente47a.bmp | 845e10c553b1b806fc14fc64ffe19caf9948f34ccdeba3fff9b81cd8b0d4a477 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0641 | assets/Bitmaps/arc_coroa_31.bmp | 846e2a955653aedc77962f15d1d2955be3628ec2421c120c9d89611e70630514 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0642 | assets/Bitmaps/arc_bloco_15.bmp | 849fb205b22011726f362c90c8d85069fda6cb8393ea37901fbff35633c00c09 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0643 | frontend-react/public/assets/easy/esp_Cirurgia.bmp | 84ae46055009858169fc3c48408c33df8bbd7d5f43278e74f70d90ded96241b2 | BMP | 40 | 25 | False | 3054 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | assets/easy do React |
| A0644 | assets/Bitmaps/arc_canal_44.bmp | 84dfcdddc1cbd577e28616fbc1ce6b48f820d4859782f72bb9e6372962b34608 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0645 | assets/Bitmaps/arc_coroa_37.bmp | 8501bc8490e59179a13525aea87f127906e532ee4decae936ef5c266c76e4799 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0646 | frontend-react/public/assets/Icones/sim_simb8_40.bmp | 8578bda759bee9925bc4d94bd862eac505b5d09bb381187ffa8c2b893a717edc | BMP | 12 | 12 | False | 110 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0647 | assets/Bitmaps/arc_bandagem_31.bmp | 85fd583ae46ada3282be411540dcbe31dd63fb6e04f973a0d3d4ab23bfb4050d | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0648 | assets/Bitmaps/arc_capeamento_38.bmp | 8619d5f9d5a66f2f827317517777da57841658daaa9161706c991f2a158ebea0 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0649 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente38.bmp | 867cc6ff1ef17a8916df40e59d46c8bebd8d4cae54d724ce424684d9f62e1ebb | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0650 | assets/Bitmaps/arc_fissu_47.bmp | 868e54f69e73e8be70febc16e7486d03fe687589e95110c95eac535290f5f168 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0651 | assets/Bitmaps/arc_nucleo_25.bmp | 868fd1952be70ed8a994c321db58d4e3db4901d7e0531ce0375fc3d74847cca3 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0652 | assets/Bitmaps/arc_nucleo_54.bmp | 86c9c6826dbfe651bd8bc0d1d1e73a7d9202894857c27732bb62274eda8ec99b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0653 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente13.bmp | 873ac81fee380065bcb6d52278ab929b545db4a26e7c570bfb9528cc75f13b41 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0654 | frontend-react/public/assets/fichaClinica/odontograma/dentistica.png | 879b83f0b11e5d9786708ed7a1520fb84bf7261b42269accb3f1c69c116ce1fc | PNG | 124 | 124 | False | 21658 | UNKNOWN | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0655 | assets/Bitmaps/Dentes2d/arc_dente71a.bmp | 87b171670e9b60bda2afe7ce4b2dd031a68b2c3908822da5e788cb47df4af917 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0656 | assets/Bitmaps/arc_fixa2_42.bmp | 87b5778c94e3823dcc429f090e8fc94bbed25330cd09cf215a53b44f56660c8a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0657 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente35.bmp | 87c3b4725ea8d8d4200feec1b9b0cb6955cdab1f8bbc2f477f8021d435a6dbe8 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0658 | frontend-react/public/assets/Icones/sim_ulec.bmp | 87d1b51426e8b51098fa80e4c0f81b80549bd638592d707137556a9645af6bf7 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0659 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente35.png | 87dcefa3709e4eb605f161c97f1063d6239cfa2ab7de046c155d2f901e6727b5 | PNG | 32 | 70 | True | 1102 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0660 | assets/images/int_hemi.bmp | 87ebfb008c8483ea3690fd847f3af7f80a01c064f7a7d5e947dd0c13b4cd60cc | PNG | 24 | 24 | True | 2309 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 46/2/1/bitmap1;46/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0661 | assets/Bitmaps/arc_canal_35.bmp | 884f8f6fcc6f18e43bc6aa6b06375b0d3955aa141a03475ee88facd508e0db4c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0662 | assets/Bitmaps/Dentes2d/arc_dente33.bmp | 886a7b8e6f5909a51af5f9cdad1019846a054ccc141004bcb652be136160610a | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0663 | frontend-react/public/assets/easy/cmd_remove.bmp | 888feafe0c097887c82b82848f2c56eae9653282671553e7daf35fcf4549da19 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | C730 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0664 | assets/Bitmaps/arc_trep_47.bmp | 88ad6d8c7f428920c29b5a875fa738ddbdabaf6a548ca54a7ff2426a7031d379 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0665 | assets/Bitmaps/arc_rizectomia_37.bmp | 88b7d9ba47ec5d5f53072cd8176db4ebce86bd5d8fffdaf9ec95dda85bd25fbf | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0666 | assets/Bitmaps/arc_bloco_81.bmp | 88cea9f7fac69dda8239c164555dd7465fd2bb91d02dabfb9711f6c816ced643 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0667 | assets/Bitmaps/arc_bloco_71.bmp | 88ef631e32bbcfa4134d0037ed254f485c0e0b0f5fc4c5544b3431d09324b331 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0668 | assets/Bitmaps/arc_fissu_27.bmp | 88f6a6a17f5783059b22e3f105c4e2e092ab36685b3a8763058baf7ddcd734b8 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0669 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente33.bmp | 8966f83ec4488c49e0fd903ea344bdee9360df7b77f17c69250c2eaf041e5db4 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0670 | assets/Bitmaps/arc_capeamento_46.bmp | 8994f3349c0b58280eac9f0218df622137efd83f3c27b9475bda969c206f663f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0671 | frontend-react/public/assets/fichaClinica/odontograma/especialidades/esp_Dentistica.bmp | 89a0177a8e68befd71b4c9a7138660b785fbc699ef3509d11fac30430578ac66 | BMP | 40 | 25 | False | 3054 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0672 | assets/Bitmaps/arc_lesao_43.bmp | 89a40f0a81dcb194818cf29301c539b1eb929a5de2eb2dd2206aa8772ac6af10 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0673 | assets/Bitmaps/arc_fixa1_47.bmp | 8a5f7c92d87545efb274b3e2dad74bc827bbfca6349dbb20037afe4bcb2de101 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0674 | assets/Bitmaps/Dentes2d/arc_dente45.bmp | 8a60f505bb32e5388f723bc7b3d4c879792f3c287dff48c19325e8d7148b26a3 | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0675 | assets/Bitmaps/Dentes2d/arc_dente14a.bmp | 8a997c883ac65eff92c50df140ac49d871005ea9d71028e09e315682b076fbad | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0676 | assets/Bitmaps/arc_canal_62.bmp | 8add74b5a5344a947087da6ec1d32db442cbd41fc81a842031bf07cd12598c9e | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0677 | frontend-react/public/assets/Icones/sim_simb18.bmp | 8adee7a3078f769debdf9a7accbd05426ad686d0e3d798ba617605dbeb0ef180 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0678 | frontend-react/public/assets/easy/int_frenec.bmp | 8b502962904fb5fc6e11a051f920ebfd2617b4de6fe8678c29bdc587103b4d57 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 26/5/1/bitmap1;26/5/1/icone | A | SIM | assets/easy do React |
| A0679 | frontend-react/public/assets/easy/cmd_restaurabkp.bmp | 8b6b21ca49635fa6de4a4fefb5845ffe18dfb9d313c88f6f06aaa05293f67a34 | BMP | 42 | 40 | False | 2838 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0680 | assets/Bitmaps/arc_radi_12.bmp | 8bc4f1629da48d7dc2f61df918feb789cbb226f16228fbee91b3759193a196c0 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0681 | assets/Bitmaps/arc_coroa_11.bmp | 8c12b8108d716cf46008cde632fc02425738e6cbdb0917c34531ba8e6896afb0 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0682 | assets/Bitmaps/arc_fluor_37.bmp | 8c1ea12ac1659f634f19ca8829596ee7558afb8738880cf651618dbc8c091083 | BMP | 33 | 71 | False | 630 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0683 | assets/Bitmaps/arc_fluor_15.bmp | 8c2240c19e70dcc9274873733a828e96f6635c0fabcb8c104b7e319dc9f24f9d | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0684 | assets/Bitmaps/arc_canal_24.bmp | 8c42f0096749993aa5889c2e97933ce75cd43bb2135498507a64d443e4265088 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0685 | assets/Bitmaps/arc_coroa_18.bmp | 8cac20183a763574e82fba80e381d674cc546237c974c27da5e29490c66e2175 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0686 | frontend-react/public/assets/easy/cmd_preferencias.bmp | 8d4f97a31d1837cd17bdd8adb3053a04cf7f93ad8eb08f026cd3ced34902179a | BMP | 18 | 18 | False | 334 | TOOLBAR_ICON | NOT_DETECTED | C730 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0687 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_aprof_vestib.png | 8d674c43217b25bec261788a5074d54444cb2870cfb9fee228555d0de80b183b | PNG | 24 | 24 | False | 2939 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0688 | assets/Bitmaps/arc_bloco_74.bmp | 8df176c9720a80bf8d1b36a0505ab0d836ba05994225c7cc07b82c4221575028 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0689 | assets/Bitmaps/arc_fluor_43.bmp | 8e5e1e965ca74870056162e252237a1d5e0e0286e143701e2ac5700be6c48b18 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0690 | assets/Bitmaps/arc_descal_27.bmp | 8e817071361da91fd8fa6611cbeb47e6b4c3791a56a74d9020e98f9d75af339b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0691 | assets/Bitmaps/arc_radi_48.bmp | 8ea8fc50e8af8bb9bf5ec8be851f40de84a42cb66f3e45403a6b0c796538636e | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0692 | assets/Bitmaps/arc_canal_28.bmp | 8ea97ee9971a788f4a54cca823a46126e03d452ba3bec4dc372db71d09f3c96f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0693 | frontend-react/public/assets/easy/cmd_valores.bmp | 8efaea78f702d6f809be9246bbf41412560190d484a7908e9f964a7706ef1751 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0694 | assets/Bitmaps/Dentes2d/arc_dente15a.bmp | 8f31c207783013e9e05beb5e9973b5aa2cb2910e1a96fa5fd394034cb81a9a16 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0695 | assets/Bitmaps/arc_fluor_48.bmp | 8f38d0f5c51b9fcc9e9eac130f8b8d834dc4382e0b1267bc441b6a8965cf182f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0696 | frontend-react/public/assets/easy/ico_check_prn.bmp | 8f45361a9efdfde0fa5af57770795e68d65f5c762b25ca4d7da68bda931c0093 | BMP | 16 | 15 | False | 238 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0697 | assets/Bitmaps/arc_bandagem_43.bmp | 8f4d5ea95f3cce2846bfe136da8147e126f37727ad95eee9aa9ade74b7791531 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0698 | assets/Bitmaps/arc_fluor_14.bmp | 8f77069df6ddf4ca274c7758cddcefa27c5e356b4a082e62f9906131d0677829 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0699 | frontend-react/public/assets/easy/cmd_next.bmp | 8f7e711e438b94ade9be60723aa634bc7f2c7c9f038871a81f22914b426100bb | BMP | 13 | 21 | False | 286 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0700 | assets/Bitmaps/arc_fixa3_35.bmp | 8fc4259bbf8d09f68e9194aa1cdfdeec1e95a3afd275ec124d14d73db5620298 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0701 | assets/Bitmaps/Dentes2d/arc_dente85.bmp | 900d3602ea7526fb743cffb4b618f0aa352f9bd5755d6093fd99c26024fb5717 | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0702 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente44.bmp | 9011210fb60967b537e07dad18234566a37666d411662d44d6c142caa411010c | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0703 | assets/Bitmaps/arc_capeamento_16.bmp | 9016f0ec25b8414655cedd738e13a269638cf8a03e40d3787a36e18ab4f015e1 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0704 | assets/Bitmaps/arc_nucleo_28.bmp | 905e021325e66415fb4f53b1b8d3c563a6d56d6d8e1464bf64cead29c0120d94 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0705 | assets/Bitmaps/arc_supra_s.bmp | 90b61c45de5bc40faff176b169fd19749c201d0e282a41e94c5ca7e77aa2012b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0706 | assets/Bitmaps/Dentes2d/arc_dente84a.bmp | 90b9b05229eb9d30121355f6473d45b5bcb034651d2f12eb7e0349cf7884efc2 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0707 | frontend-react/public/assets/fichaClinica/toolbar/ico_odontograma_toolbar_prc_lupa.png | 90f56ce24448fb20e25f72a03950dfdf95203f5cb90fd2d019ded8ae8b85a675 | PNG | 16 | 16 | True | 394 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0708 | frontend-react/public/assets/easy/dia_distal.bmp | 912c38138ebb42356fa088fcf43d80ecfc1a60f8fa7f8365781e3673b2dcb065 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 64/2/1/bitmap1;64/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0709 | assets/Bitmaps/arc_coroa_35.bmp | 914392cd9202392889cb115b9d8e91d49db478a88c69edebe8f67d1fc782daae | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0710 | frontend-react/public/assets/Icones/sim_simb8.bmp | 915861738be248182f7228b0283474a3b7796e2094b0baaaff4ff90d4eca31ca | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0711 | assets/Bitmaps/Dentes2d/arc_dente62a.bmp | 9163cc7e45b6914387246c0e2e9bb432f67fae1be502dc8d52499f9da5ecb189 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0712 | assets/Bitmaps/arc_fluor_25.bmp | 918375d0acb6b7eef3c35f2f590a2b7fb35d65744d23447b52faf402314b95f4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0713 | assets/Bitmaps/Dentes2d/arc_dente16a.bmp | 92308338698610a1288cc4ab0ab4bb227393f1023a7427f1e2ad2e86f88123d5 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0714 | assets/Bitmaps/Dentes2d/arc_dente44b.bmp | 927d8b9717a25f61d4a9d9bb22aef12209d1efdb4c11d30bb92e1886ae1521f8 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0715 | assets/Bitmaps/arc_bloco_54.bmp | 92c005e05ec43ab5b71522af3cdb77cca4e83daa3b926be4809f1a930841cd2a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0716 | assets/Bitmaps/arc_descal_12.bmp | 92c3b01c480a27d19a5e89e691f6e3d5a59f5f0a73afc1d4988dc9d648fd1843 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0717 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos.png | 92d20118ae32fe43e2dcddd49777228011876fb79d71fc2c5d01365333498fda | PNG | 124 | 124 | False | 17773 | UNKNOWN | NOT_DETECTED | C693 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0718 | assets/Bitmaps/arc_fixa1_44.bmp | 92f48ffa0b8c9b6a88eab28425eb23ecc44b5bd296883e5db6f9a3474506a3c4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0719 | assets/Bitmaps/Dentes3d/arc_dente85.bmp | 932199265dc8d06b05195aedd40154d9d8063bb719879252360d2cc4c54a4123 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0720 | assets/Bitmaps/arc_remov1_s.bmp | 93a63a2123d9f3fd9e25e78ca01701a15cdf3970a1e621fc98421618ebe2b079 | BMP | 32 | 70 | False | 1238 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0721 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente14.bmp | 93b4f09f2ee0503af5505ee01caea84ded360c18e203b69a8f3a5ea04da4c1d0 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0722 | assets/Bitmaps/arc_fluor_41.bmp | 93c6b8c9e070c278d6ed1c05405a497e57904b89bb88e64c30e3bb4c4bd7f7d5 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0723 | assets/Bitmaps/arc_nucleo_48.bmp | 93caa4d300ce7e55a5c2853cc07a825e83e990afb5f535e8a56f01a03623c5bb | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0724 | assets/Bitmaps/arc_fixa1_25.bmp | 93cc724b90cc0af35a2fcca0194b7d31514d7cfa8648eea59752bc9819394f3a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0725 | assets/Bitmaps/arc_bandagem_17.bmp | 93d2792c6f901d4e26aa11ec5d6ebc009bea33f0fd9eb203aa1a0505de9f3855 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0726 | frontend-react/public/assets/easy/dia_fratura.bmp | 940ad22f31290e113d5dc4c61f73f1d871fcfc041ded8486dab709d34f76ff9b | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 73/2/1/bitmap1;73/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0727 | assets/Bitmaps/arc_radi_31.bmp | 9464a1091af24a219d57fdbf224030b60c0b5a0f0ac07618655cf1322738d00a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0728 | assets/Bitmaps/arc_fixa1_45.bmp | 94880e85418211153352631b064f37821619f77368d3604f94c25c8c67e1b100 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0729 | assets/Bitmaps/arc_radi_13.bmp | 948bd87aaf5f8cf934f465276fa93b8db72af00b99f4ada0e98a9aef3100f7af | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0730 | assets/Bitmaps/arc_fixa2_38.bmp | 94be65b2b155ccdb21cb011ed15e5021d05ef16abb49d3bbf12524a57dcccd89 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0731 | frontend-react/public/assets/Icones/sim_simb16.bmp | 94ce5430fd4f807408efb649901bb4c7ebef969f701bcf81f37a85f6b4f501be | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0732 | assets/Bitmaps/arc_radi_36.bmp | 94e32c48e3b1e3265f527971828385bb621dd54bccece0758c537e99fb7e731f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0733 | assets/Bitmaps/arc_fixa1_13.bmp | 95335211c3a16dd3c48ea4539cefea382a2a7e456e141ab0114e00725a38b08d | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0734 | frontend-react/public/assets/Icones/sim_simb5.bmp | 954f8c83cb5c9c6ec775501a92f93134bc1de3c1426cae1fc553f91bcac05e67 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0735 | assets/Bitmaps/arc_trep_17.bmp | 95670cad758ec7c31f8e4056a4f7415801e30c0d1ca78d32e70bab58b1801294 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0736 | assets/Bitmaps/arc_canal_36.bmp | 95c06101c22f54cb921163e2072ed61025bd0bc05238e0c0352df55f8db0cc54 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0737 | assets/Bitmaps/arc_lesao_32.bmp | 95c68197895ae9e404888ae92110e03d2320508d389c484f0713975491600b84 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0738 | assets/Bitmaps/arc_radi_15.bmp | 95f34e2d524619332e8817836e74ef95f8d63ab34d82c4ced050b70d7c1bd2d9 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0739 | assets/Bitmaps/arc_fixa3_44.bmp | 961e0efeae0a3bde139bc1781edc3be19615e99c0a24f039f4c68d934a65345f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0740 | assets/Bitmaps/NotFound.bmp | 962116e8799d7d9159d394b731a36016abf90d6cb8628102c2cab57f22c3e98a | BMP | 60 | 45 | False | 1558 | UNKNOWN | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0741 | assets/Bitmaps/arc_coroa_74.bmp | 9635bdf127c5b595364753b95b246ff696c2ee63d2910842138744e9a0972627 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0742 | assets/Bitmaps/Dentes2d/arc_dente15b.bmp | 96454fa42ab62f8c63e8c0b15468365f3fa9ff3d855bb7ac0763d4ca41821928 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0743 | assets/Bitmaps/arc_coroa_44.bmp | 965b5016e69c310a29ec4f836b07578a473c6bf32996ea0d576b115c10e8408a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0744 | assets/Bitmaps/arc_nucleo_45.bmp | 96b49e63cc098904cf789268be99647b57b18761493939540105d70c79b0aad9 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0745 | frontend-react/public/assets/Icones/sim_byte.bmp | 9717ddddd673f86591b98b5ecea5043d5cf703d7c70f57b0d35a300097f675e1 | BMP | 15 | 15 | False | 122 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0746 | assets/Bitmaps/arc_canal_63.bmp | 9853629e1dec4e8c60a7ae41370436848c42f22cee4265d3ca8b6a50c4cfb576 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0747 | frontend-react/public/assets/easy/cmd_renumera.bmp | 988322e77f1cb578e4336cdfc9a6f02946d0070118fc5f589d275c6bf50a90f8 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0748 | assets/Bitmaps/arc_fixa2_14.bmp | 98ccbddeab962174335f14990f21f494d72f35ddbc2a6259feeec1b93206d299 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0749 | assets/Bitmaps/arc_descal_21.bmp | 98e31ed42ba4e45a9d56703cc9d8a0d6049a094d49164454485f04dac1a68151 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0750 | assets/Bitmaps/arc_fixa3_28.bmp | 991924baf6e73124a66e60a69b6dbe72d8cd44c8a8b31b14715fe8c7d75c755e | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0751 | frontend-react/public/assets/easy/int_pulpo.bmp | 99264b91b2882b8a17fb2974e4d2f362af155605b9d4dcf767961d65f68074b6 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 48/2/1/bitmap1;48/2/1/icone | A | SIM | assets/easy do React |
| A0752 | assets/Bitmaps/arc_coroa_84.bmp | 992902df0432f1d56c5e1ca00479e203da6469e6d747013f8c4b6279abcc9f8c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0753 | frontend-react/public/assets/easy/int_rizec.bmp | 9944d67785aac88d0f3881114d4ef6ad0cb1345f06c4b0a1f74fe5a098a07b14 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 47/2/1/bitmap1;47/2/1/icone | A | SIM | assets/easy do React |
| A0754 | assets/Bitmaps/arc_canal_53.bmp | 9979e3f7e6a5e6d7b41e8b4c0677b149a229b2833ca1c85c1defcb99a84e6f9d | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0755 | assets/Bitmaps/arc_nucleo_63.bmp | 99e4128e836e95ad1a46ab03b2dccd81dd1332305a1c8827ffd197aa8b476a29 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0756 | assets/Bitmaps/arc_bloco_46.bmp | 99f909f48a36082deb765dabdeeaf4ca9376432fb06ab1c86dbb5cfc7dfbe84e | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0757 | frontend-react/public/assets/easy/cmd_cccir.bmp | 99f92e42ca6e8f3b0b7fe199092f866cdf2739ad56515ea2f7e235a6e50982d5 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0758 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente21.png | 9a98a176a63275fdf15875442340af2160d4dd12dc9a12300832c0fc4e0e1c6b | PNG | 32 | 70 | True | 1296 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0759 | frontend-react/public/assets/easy/int_poli.bmp | 9acfa8a2816ca389c76d84bde4dee798843590e5c99c356c3e2fa710a8332973 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 59/2/1/bitmap1;59/2/1/icone | A | SIM | assets/easy do React |
| A0760 | assets/Bitmaps/arc_fixa2_33.bmp | 9b1612b8a4ab7dd4806840cf8f2e8d2e30634201e9a6d9dcdfdc963a36fafaaf | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0761 | frontend-react/public/assets/Icones/sim_simb13.bmp | 9b98b816ec4001262f5e682244c3c821bf5980579ca04c28deab27771966e2fc | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0762 | assets/Bitmaps/arc_bracket_s.bmp | 9bb77d2625e23dd7df173ae8409ffc819e06904b75b7b48babf8fa652ccbeedf | BMP | 32 | 70 | False | 1238 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0763 | frontend-react/public/assets/easy/cmd_detalhes2.bmp | 9c14bd11f56d56f2df70952d949383693ddba1329d8a4556dafa5674fbd4d9a2 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0764 | frontend-react/public/assets/easy/int_bracket.bmp | 9c269c533977a960c1b9bd0a302c4c14704522a56801d42202ca908f087983e6 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 22/6/1/bitmap1;22/6/1/icone | A | SIM | assets/easy do React |
| A0765 | frontend-react/public/assets/easy/dia_semi.bmp | 9c4c629058aa614fd22c34797f91a4b0becef777a5ecd99e512b64b2562fb589 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 60/2/1/bitmap1;60/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0766 | assets/Bitmaps/arc_canal_82.bmp | 9c4ecdd459fd40d1b14ae8509ac320271c7124ca317d8526e6e22cb12c4e9f71 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0767 | assets/Bitmaps/arc_fixa2_27.bmp | 9c5728634729d3eedb28ce7839f23f22d9b993a704ec6ae6a4c5185626f19e90 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0768 | assets/Bitmaps/arc_facet_24.bmp | 9cec669bc206426e887fa6f66157ca31aabc7a62deafbe0a8bbe5689af1ceafa | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0769 | frontend-react/public/assets/easy/int_enxerto.bmp | 9cecc4d16bfae383d125502ec824a95d4fa81e74bf5ba8eb797094fd9e26d587 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 25/3/1/bitmap1;25/3/1/icone | A | SIM | assets/easy do React |
| A0770 | assets/Bitmaps/arc_fixa2_35.bmp | 9d0dacac8e89224aeba3eb24b52b561f21c9983420a93ec3af37ab3ddb01223c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0771 | assets/Bitmaps/Dentes2d/arc_superior_perm.bmp | 9d5271a969274c64da7cef8d1ab780c2964a03ca27a8e8d1826aa55b73a8d160 | BMP | 512 | 96 | False | 196662 | ARCH_IMAGE | NOT_DETECTED | C755,C715 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0772 | assets/Bitmaps/arc_bandagem_26.bmp | 9d6bc42bc7f0894e4ec6c94ac844f026c9d9d5aeb4b872f25be0be0e8c1b2fdf | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0773 | frontend-react/public/assets/easy/avi_protetico.bmp | 9d781d5e1e1afbebe4268cc9789ba6cdc308a484dd9fd63e6dfb28ca050181cc | BMP | 30 | 29 | False | 582 | UNKNOWN | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0774 | assets/Bitmaps/Dentes2d/arc_dente65.bmp | 9d78b31b3189a0ee52a0c4e0ec2c26ce00ba898be6c944e4a476e2c50847f6eb | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0775 | frontend-react/public/assets/easy/cmd_novopac.bmp | 9d82af89d1a23fe75ba86c2d5d5f94de9aacd0290a76e65c2d5ee707f86182d8 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | C730 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0776 | frontend-react/public/assets/Icones/sim_simb4.bmp | 9db4de455d1dcb56b7ad0948e254eaf1cb0db93dc0b2651d42d7823c2eb0dac0 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0777 | assets/Bitmaps/arc_capeamento_25.bmp | 9dd36bb7654416a4a4e1dfa77f33fafb974d9d009de4d11d13b591c909c7b2ea | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0778 | assets/Bitmaps/arc_erosao_26.bmp | 9e42d8deff1747e6d71a72690274bb3cbb540b5ba77896d37ad8be54b71d7dcf | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0779 | frontend-react/public/assets/easy/dia_erosao.bmp | 9e5fbcd7f994c760a734d2e45948a1328790b8969eabb35217bb80aaba7a4a4b | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 66/2/1/bitmap1;66/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0780 | assets/Bitmaps/arc_nucleo_41.bmp | 9ebebfd3fcb51f42e93294e0efb8207ed84765bcf12f2f5cc31a0aca979963a4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0781 | assets/Bitmaps/arc_fluor_26.bmp | 9ec1d4667c20e897ee40681899e244d69c222e147ccbbf95af44f7a160e2d2ed | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0782 | assets/Bitmaps/arc_lesao_36.bmp | 9ecf0426c22846b79e86fa1992ff889d9f4b0cda061feddc86b0ffc05bc3f3ec | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0783 | frontend-react/public/assets/fichaClinica/odontograma/endodontia.png | 9ee68fd7845e7b6ae29a75ce7e0157ad0d078b41da120cc20507b88de77d8afb | PNG | 124 | 124 | False | 20135 | UNKNOWN | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0784 | assets/Bitmaps/arc_fissu_36.bmp | 9f5ec9c3808f9e398416b86c92f84b367ec043573787883ed9beffe915560012 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0785 | assets/Bitmaps/arc_bandagem_45.bmp | 9f965d51e27022c0db8e7dd37ec04643df19ff7d3a7f3be40eb5e791a3c955b2 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0786 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente33.png | 9fabbcf8c9501a252d377b8d9369ef012e7a6ac30a61191710a8eff55a5ac1d9 | PNG | 32 | 70 | True | 1127 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0787 | assets/Bitmaps/arc_coroa_15.bmp | 9fc52b03056aee8df4c7caa46d6e0f7e148977d4f7823596bd3b47bb4eef5fe7 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0788 | assets/Bitmaps/ger_consulta.bmp | 9fdf12599fbf3904b9b8485da421bf444573916cf0278709c274e4f493be74d5 | BMP | 24 | 24 | False | 1782 | PROCEDURE_SYMBOL | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0789 | frontend-react/public/assets/easy/int_prof.bmp | a07b6d13538d18b67654d8fc3d0cc8443ca6ce73d32834ddf85f6a789ddea9ef | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 8/5/1/bitmap1;8/5/1/icone | A | SIM | assets/easy do React |
| A0790 | assets/Bitmaps/arc_fixa2_28.bmp | a18cd213ad35db846c77c796d3a2b0320108d32e71be42d0f5c59f84e5294b12 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0791 | assets/Bitmaps/Dentes2d/arc_dente22a.bmp | a19bc0c5db8b97ab8d6f9dfcf6664611522897a86777256e9d308598b374b145 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0792 | assets/Bitmaps/arc_fixa1_14.bmp | a1b8faff63a5e7ad7fb1ab48c4126012dbc1c7cb9c73f3b1b0bb4401480ff0da | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0793 | assets/Bitmaps/arc_bloco_16.bmp | a1f6093e9fca87c664cb8d78c2683d631551c7936130d3c5190583022f5ffe43 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0794 | assets/Bitmaps/Dentes2d/arc_superior_dec.bmp | a1f767fb97b680646657375488b5a2f91c27317c861685a1f377381d5a6bb5eb | BMP | 512 | 96 | False | 196662 | ARCH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0795 | frontend-react/public/assets/easy/ico_calendario.bmp | a20109b2293a940292735bb973eb86a2ac86067d34fbd5ed2993da79f2dcf5f0 | BMP | 40 | 37 | False | 2558 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0796 | assets/Bitmaps/arc_bandagem_15.bmp | a206d1e4b87d7c849a177ce23c0f74a03da0577fd80ae75da171e623a7cfed47 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0797 | assets/Bitmaps/Dentes2d/arc_dente32a.bmp | a256bbd9c9f0cdd018c4c09df8ebb9679b78f36f3f0e8f32b3dab7ebc9b4fa92 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0798 | assets/Bitmaps/arc_capeamento_31.bmp | a283ef0474d3b570016796ec34f424718fc5693f71180c0dd8434d7c11b88ae6 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0799 | frontend-react/public/assets/easy/cmd_grava.bmp | a2a7d2e2ed486f1b34b79cacf15502e6c986e077b458cedc0a2c0edae94a95e0 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0800 | assets/Bitmaps/arc_fluor_32.bmp | a2e84a26fa318b97e0367f6a98a9ce6817593b272aaec99a258b1dd3b6bb0b03 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0801 | assets/Bitmaps/arc_coroa_25.bmp | a31839e23dae303afa3dc19d95326d255e419f283441c3979f750eaf88c9b96b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0802 | assets/Bitmaps/arc_descal_24.bmp | a33a28d98a8bd2b53a9d435819bf9e64dbf5d082c148915f9fb4c7a7a044c776 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0803 | assets/Bitmaps/Dentes2d/arc_dente55a.bmp | a33ed44abc4484ebbf098757791a540f1255f63e27bc55e504eef5bb39e5826b | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0804 | assets/Bitmaps/arc_bloco_45.bmp | a34a592d8eb38560c64ad070d9d73ae5b2e33a6dccf2d8f8f2ac0ae2c79c8a42 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0805 | assets/Bitmaps/arc_bloco_38.bmp | a3552e8589cff428cce0639ab4bc70a46240397bcf392286f7131f4448d416b4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0806 | frontend-react/public/assets/Icones/sim_simb29.bmp | a35ab269d3df61ed8ccaf6fdd5d2da997ca4a2bf69be6e63e4257202bd6bb2f6 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0807 | frontend-react/public/assets/Icones/sim_simb32.bmp | a38b8458011a7b88cad379b178440c24c9a5ea17e52c9b4d186cfed95bacf681 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0808 | assets/Bitmaps/arc_erosao_24.bmp | a39c71692fdf0dda76818329a8ab62d863f9fc3a84fbbd5830ef49d833200ddb | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0809 | frontend-react/public/assets/easy/dia_descalcif.bmp | a3a33b7657798b58483e029077d6aa24c5e83e4b210a7fa0d10a4af43bc6b105 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 63/2/1/bitmap1;63/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0810 | assets/Bitmaps/arc_rizectomia_35.bmp | a406e4d7ac434247250e506a7206f49074fe272487674a237162f03df88c6d8d | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0811 | assets/Bitmaps/arc_erosao_15.bmp | a429782e3f2de44d7c33c84ef816e627ec43e775bdf30487404c9cd190291bd8 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0812 | assets/Bitmaps/arc_nucleo_74.bmp | a44322819becbd5edab772e514bd2183fd78c2c356970f76c30e61a7571371a5 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0813 | assets/Bitmaps/arc_lesao_11.bmp | a492a5dd5bfa79e94ef82b9d01cb48afffd0d782344318e94c031d9610db614b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0814 | assets/Bitmaps/arc_descal_41.bmp | a51e8ab622cc093041a7eb1a6d1f38dd2db98b6aac545b3b78fec5930f39e157 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0815 | assets/Bitmaps/Dentes2d/arc_superior_mista.bmp | a5470559acfac3aa51290698fada6e7d9de349a572e5efda1573c00d5f1d2be2 | BMP | 512 | 96 | False | 196662 | ARCH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0816 | assets/Bitmaps/arc_fissu_24.bmp | a56425b40399d0bd651827de651f4a4d8239d309f2f1977506bfe417e4875495 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0817 | frontend-react/public/assets/Icones/sim_simb35.bmp | a566d742f93de7c32d9a3b0a6ca8a7238a03da58feb6adca369b662d08520742 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0818 | assets/Bitmaps/arc_aumento_i.bmp | a58ca814260990d0d9db51c721d8116fe177e32ff57c43fe7fd5605a87baffcc | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755,C715 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0819 | assets/Bitmaps/arc_capeamento_27.bmp | a5e75a876e9223c65d3722986cd8a851f9f7ce85c1b0ebb5e583ede1ba69dad6 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0820 | frontend-react/public/assets/easy/dia_trepanacao.bmp | a60e0d41befba3f7f439906d5d9a117605b53b493c6f80121c4d9b1ce91eed12 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 74/2/1/bitmap1;74/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0821 | assets/Bitmaps/Dentes2d/arc_dente34a.bmp | a63ad44ac9995aa793fb993025511d7325172088c693de7543785f29bc6e5156 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0822 | assets/Bitmaps/arc_fissu_18.bmp | a66d35eb1d24d0373f62b4be84b58cb80fed7ba5837d4b67f1524ea8c6c2ab10 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0823 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente12.bmp | a7d6251a9dd04e67aace03e2bf319bca49a56131be4a59a0decaa60d827188b1 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0824 | assets/Bitmaps/arc_lesao_37.bmp | a7f6d11c7a13d334d2899f23e34d961b18b9d23fba7624091cc64e2c5d7088e2 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0825 | assets/Bitmaps/arc_coroa_85.bmp | a871afc91ca17409ccffd1649ffd03a5796d76ef58f11adb70af304681c26983 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0826 | assets/Bitmaps/arc_fluor_12.bmp | a89ee7111977863233fe1c1e9591d1f04aaf0fcb504ec5899b5835b9070adcd6 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0827 | assets/Bitmaps/Dentes2d/arc_dente63.bmp | a8abe9fb7a1ad1799ffd177e2b3fa23849a626c0d9488eb17ef27ef90e8ae135 | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0828 | assets/Bitmaps/arc_canal_64.bmp | a8bc834894313e79634c6efbd65343f3510e836c05b3e9bd1f2dec79c21a763f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0829 | frontend-react/public/assets/easy/int_consulta.bmp | a8cd1138e4d8b0c2c3203f459728588635ef9e425a324da5983bcbe8a3337673 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 10/5/1/bitmap1;10/5/1/icone | A | SIM | assets/easy do React |
| A0830 | assets/Bitmaps/arc_coroa_16.bmp | a8ec21edd4965e1eb41986117bd3d0a3cee8a642bfbb14ea68c6b6fe1529eeae | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0831 | assets/Bitmaps/Dentes2d/arc_dente24a.bmp | a9902f5ae11a9d857575d738d8aa757244d03ecc7f8f0c7a86d0bd4318b8c4d8 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0832 | assets/Bitmaps/arc_facet_45.bmp | a9d96817eabe47cf7771c3b80c541ff0ac877e8cbda56c91401b785152fa43d8 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0833 | frontend-react/public/assets/Icones/sim_attach.bmp | a9d9a1d784370204b2f975f0ffb84d97b042fea66e3b746dce4c6be6c140f96d | BMP | 15 | 15 | False | 122 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0834 | assets/Bitmaps/arc_bloco_48.bmp | a9ebe0ff62e52b2073c8812c9826adcac0b7406b5ce7bcd54a66ec208557bad9 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0835 | assets/Bitmaps/arc_descal_15.bmp | aa2a9ee62dc0266b42302e6e5d7c7373004117dff5570bff5d1737682fb30135 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0836 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente12.png | aa348cd3617848e0c70e09274fb85a625c039c6333390cd642eb1a1bd72d46e8 | PNG | 32 | 70 | True | 1019 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0837 | frontend-react/public/assets/Icones/sim_simb15.bmp | ab0a7a12aea8658d6f8c48c780ed3fac97a88ac466ee9d89f7834497798ce38e | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0838 | assets/Bitmaps/arc_coroa_26.bmp | ab2abe06f678422fca1eae2dea98f9963b8adc2f23e4199ef2cb9fdaac72a1c8 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0839 | assets/Bitmaps/arc_fixa1_17.bmp | ab680ad4244da97a87e400bf37484d50e6ec4192260d12d3614c2d18be49ac3b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0840 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente42.bmp | ab81fcfbfdb3b87d002d744b486f12f2fbde66721a66d5f79391418040ac56c9 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0841 | frontend-react/public/assets/easy/int_raiox.bmp | ab99694da18d29c9557c37412a33608811841d8f554d1cf2a4d99d60373dee0c | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 11/2/1/bitmap1;11/2/1/icone | A | SIM | assets/easy do React |
| A0842 | assets/Bitmaps/arc_fluor_13.bmp | abd4861c31ce5956aeb2dce3ea91a807b6bb08707223aa32624e19a811278183 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0843 | frontend-react/public/assets/easy/int_provgru.bmp | ac3d7f99de34a5005c82dcb4595908a3c8fe207c6d004a914a928eed9b78046e | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 29/3/1/bitmap1;29/3/1/icone | A | SIM | assets/easy do React |
| A0844 | assets/Bitmaps/arc_fixa1_41.bmp | ac443fc938899f615dd813e8581156a5eedbc418238f4c425e922a262a2f3e20 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0845 | assets/Bitmaps/arc_extracao_s.bmp | ac7d0792b1ac83b985595fdf145f221eeb5eb6f822df2ffe8ae8cce004005afa | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0846 | frontend-react/public/assets/easy/avi_aniversariantes.bmp | acc2ef36f03e5f0636ee317a36d83d1ef3897ea917091e576105d2b97908fac5 | BMP | 30 | 29 | False | 2006 | UNKNOWN | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0847 | frontend-react/public/assets/easy/int_selante.bmp | ad21c8697b00078e45f88121645b41455f516813ab95b9acb7251055c2b631b4 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 3/2/1/bitmap1;3/2/1/icone | A | SIM | assets/easy do React |
| A0848 | frontend-react/public/assets/easy/int_desgas.bmp | ad259cd1b71f0252e34ece98758804ad63d7d06b95dfb7d42b7c09f4d4611e2f | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 44/5/1/bitmap1;44/5/1/icone | A | SIM | assets/easy do React |
| A0849 | assets/Bitmaps/arc_trep_25.bmp | ad7e4c280693e3a42dfa83383735a0ef2f096eeeef7d0c771f00200e0dd0fbd3 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0850 | assets/Bitmaps/arc_lesao_26.bmp | ad9d937dc595ac64519110bb7d33f2ed2016d014a3ebaac2d93aec2508a58cbf | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0851 | assets/Bitmaps/arc_bloco_52.bmp | add5414e0d5fa1b8f7dc19183f414f568328efa48f35f01d112efa1519010999 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0852 | assets/Bitmaps/arc_facet_31.bmp | ae18d7448bb6e33f57b91c9d06b6128a73f81830755cc1ddfb2323047accc09e | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0853 | frontend-react/public/assets/easy/int_banda.bmp | ae5da059dc1ce52002c9fbb965aa2584177c61519b9d487d4d8ed912aa375251 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 21/6/1/bitmap1;21/6/1/icone | A | SIM | assets/easy do React |
| A0854 | assets/Bitmaps/Dentes2d/arc_dente36a.bmp | ae6fa736578d5f59d964bc2eae35c3fee72226cf2496e9b0f57c8772ff1da561 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0855 | assets/Bitmaps/arc_radi_34.bmp | ae9b65818db6fab95500e92726559a9d0feb8d6f35edab51426820faa4af5879 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0856 | frontend-react/public/assets/Icones/sim_sel.bmp | aeba862249d155e7ddc3606f7582c6889b501b68d224d21f14e13278e6b5e569 | BMP | 15 | 15 | False | 122 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0857 | assets/Bitmaps/arc_fixa2_36.bmp | af7d633038b84040180a8d475c6642eab110d6a0348ee0c52e1be6846e4387ea | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0858 | frontend-react/public/assets/easy/arc_inferior_perm.bmp | af9384819e36b31ed0e0fc25520b39345479e6148926fb50f7585bccae212c72 | BMP | 512 | 96 | False | 196662 | ARCH_IMAGE | NOT_DETECTED | C755,C715 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0859 | frontend-react/public/assets/easy/int_RestMO.bmp | b00dfcc0931497b8b9bc596b0f1cb63a9e5bd5cf06c58a45ea46f758fdf16286 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365,C546,C555 | NOT_DETECTED | 78/1/1/bitmap1;78/1/1/icone | A | SIM | assets/easy do React |
| A0860 | assets/Bitmaps/arc_lesao_35.bmp | b05ad3f216779986905376f05bd04b9a4795ae4a166953e2d7e852362ddd5c10 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0861 | assets/Bitmaps/Dentes2d/arc_dente27a.bmp | b07bd0ad93cce2fb5fe98dcb3722f9b21d47207fbfd42e0eeb2ba9de0bbfb786 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0862 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente25.png | b09aefde13590bd1a7cb0c6391fa60e5a7cf7a501a26b0af9d0e549409062a6f | PNG | 32 | 70 | True | 1184 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0863 | frontend-react/public/assets/easy/int_lateral.bmp | b0cfa35498b6d51bcc2ff2c074efdf901738d7afb6f2bf0f494103d2ee09ac83 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 34/5/1/bitmap1;34/5/1/icone | A | SIM | assets/easy do React |
| A0864 | assets/Bitmaps/arc_bloco_61.bmp | b0de53c999f9f9ef53c59eef5b90f3bb41cb233a8d5d74ab80355a06d82b759c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0865 | assets/Bitmaps/arc_erosao_46.bmp | b0e96c1f585ffc0c488dea926547a576e45034f53df149d87cb3d222fd20e304 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0866 | frontend-react/public/assets/easy/int_modelo.bmp | b0f000e56d537eb2a056944313e4f1d5a76c8c32aac0e7bd26184f66cefb0178 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 41/5/1/bitmap1;41/5/1/icone | A | SIM | assets/easy do React |
| A0867 | frontend-react/public/assets/easy/ico_caution.bmp | b0f84e175cfb60e7625c1b582dc800e1abec8806c5f0be6957b20c15f613e35d | BMP | 45 | 50 | False | 1318 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0868 | assets/Bitmaps/arc_capeamento_14.bmp | b127ce245f8edbe673d96f9e9a04009aa21d499f8c60fee69350b87d91f2c469 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0869 | frontend-react/public/assets/easy/cmd_insere.bmp | b16218dc96adc0682ca1a5347d2aefdf95ba250aec8103cf9954ccabd90756a6 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | C730 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0870 | assets/Bitmaps/arc_rizectomia_16.bmp | b177695d52cf496bbbf76cc8b1d6c9599697bcee1bc47a818b19c70588103673 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0871 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente37.png | b1bf91f5b7030edaacecee00f5b0f3634259f285e94111460b9a6f3f6de10846 | PNG | 32 | 70 | True | 1466 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0872 | assets/Bitmaps/arc_lesao_21.bmp | b2261553796b56d227a6f7167a6616e34e7304edb5858d80001b94565d668948 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0873 | frontend-react/public/assets/easy/int_boticao.bmp | b23c254ad67ec7ea20a5881bcc9c80954bb17aac4a8d87c7b241b2a8700b932e | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 13/2/1/bitmap1;13/2/1/icone | A | SIM | assets/easy do React |
| A0874 | assets/Bitmaps/arc_trep_45.bmp | b27149af157a53943749da66307fd7b5310946e45d8bf4d6679afa1012abb5d1 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0875 | frontend-react/public/assets/easy/cmd_sim.bmp | b29eb80e5288879feef3ced855b59ec42b7336c11a1c6bacd95cfca20e58cddc | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0876 | assets/Bitmaps/arc_nucleo_21.bmp | b2b9e37552a83de62e318a770dcdddf2aedd48ada1bdc5f45826f73806aced81 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0877 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente21.bmp | b316959fa11658ca2b9c5e16fcc896ca170493c6f6685ced33910a2459c40956 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0878 | assets/Bitmaps/arc_fixa1_24.bmp | b33f88371c9cd25f9c4a4d77ae83756f37ffc313a264814aa35c9c11b293f02e | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0879 | assets/Bitmaps/Dentes2d/arc_dente18.bmp | b3bc52146989c367b006c92cc6e15e95b3d3352541effcace592631063a1c338 | BMP | 32 | 70 | False | 6774 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0880 | assets/Bitmaps/arc_erosao_35.bmp | b3e07cbb9b199842fb8c05fa257edd95d42a980c4a3af4e9135887f9e517f0c8 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0881 | assets/Bitmaps/arc_fixa1_18.bmp | b3f595655e184480608dfffeea781aa9dd76cec2c6432d934c3ff0a8a7fc9fcc | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0882 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente48.png | b4296487fc1ce4d7a24b6d3f8ffaf3ef0446c6d29bb3faa5e2cd852cc1f214de | PNG | 32 | 70 | True | 1306 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0883 | assets/Bitmaps/arc_facet_23.bmp | b43319f8dc39d9c69399cec85bb3b394281fc8c259a182e290adb4165e106928 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0884 | assets/Bitmaps/arc_fixa2_16.bmp | b43b5998b8ffcaa3072f454037444b7d47ae85e17cd8e6afe71e7d17efa0aebd | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0885 | assets/Bitmaps/arc_fixa3_27.bmp | b4848fee113f50c8caccd92af614c46c55e2f0621ad70bf8c8cf1d33bcff51a7 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0886 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_implante.bmp | b4d29c7aa149ff86fdf8a8a99a67e3fddeacb3b7409c5f137c5bda39d59e7737 | PNG | 24 | 24 | True | 1568 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 9/2/1/bitmap1;9/2/1/icone | A | SIM | caller público direto/dinâmico |
| A0887 | assets/Bitmaps/Dentes2d/arc_dente48.bmp | b4e12b3cdec3e0315ff8ea52256e98bf9089566ddf427e28e1bc339a09c3ec38 | BMP | 32 | 70 | False | 6774 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0888 | frontend-react/public/assets/easy/esp_Radiologia.bmp | b4f41ac71b80a9284b97c4b3c1af4791d020e38a1374d107dd21698f22bea011 | BMP | 40 | 25 | False | 3054 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | assets/easy do React |
| A0889 | frontend-react/public/assets/fichaClinica/toolbar/ico_ficha_pesquisar.png | b526621701c482dd348b426122b9289baec73fb742dd0a6e48555c555a0167ba | PNG | 24 | 24 | True | 615 | TOOLBAR_ICON | C365 | NOT_DETECTED | NONE | A | SIM | toolbar |
| A0890 | assets/Bitmaps/arc_trep_42.bmp | b58eb5976bbf75f1b5d191c905411aed9997f89e74a60c25f2b0106ae3efb97a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0891 | assets/Bitmaps/arc_raspagem_i.bmp | b6b183ba486e816680a01a62b12dd766a676c89d94b503c6718991faf1e2fa92 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0892 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente36.bmp | b6e34857c69d1ef7b41bb7ba5d1a7771e277819a91b6c6b48d754a9f02fbfe87 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0893 | assets/Bitmaps/arc_bandagem_22.bmp | b6f992de7db1f2f8c40f8d0a7ddbafb74a8d7a59ff1e4a5c0f6f311e842cbd3c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0894 | assets/Bitmaps/arc_capeamento_32.bmp | b7275ddc19036f05890c2edfcdacb4c7a11545be580e7bff0a8288a32e9743bb | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0895 | assets/Bitmaps/Dentes3d/arc_superior_dec.bmp | b734d2fdfa91453a91e8be659e179333fa3ae3217096608f1cf1633d787f8965 | BMP | 512 | 96 | False | 196662 | ARCH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0896 | assets/Bitmaps/arc_radi_25.bmp | b7843b988f248a08109545e551f886655fffcaaccbfff2404e31e37f70ed8fd3 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0897 | assets/Bitmaps/Dentes2d/arc_dente41a.bmp | b7d4179d8b86e0a835858c2f1f6f23e5996367c9dc61636ee9241da41eaf4bcb | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0898 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente37.bmp | b7e5858748d56f2643cb15c489723049313396a6ee65f802c0c014ea3314a2fa | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0899 | assets/Bitmaps/arc_fixa3_15.bmp | b7ffa9ed0a19adc2284793a47f30a243b78d490d9ba23ac6b7eaf1b375ecc8a7 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0900 | assets/Bitmaps/arc_coroa_55.bmp | b87e80ddeda7b5c4deef8434281a7b18e3ddd337c34525230b8720c864cbcd14 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0901 | assets/Bitmaps/arc_bloco_37.bmp | b88bb8488307a54d056fecc5be3b1431d600f201fb2554787ad0d3bf27d3abb8 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0902 | assets/Bitmaps/arc_rizectomia_18.bmp | b8e9ee959d698f3712ab0bab621ab3188df27e571c42b80c2d8794ee560c4d18 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0903 | assets/Bitmaps/arc_canal_21.bmp | b90799367b21b073eb2abe7290886e85130e8c7ef20eabaca83f4f3cf1840c37 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0904 | assets/Bitmaps/arc_bloco_36.bmp | b930ecf006487d586322b531275d8638a36ed57fd547bfa80d116079508972f1 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0905 | assets/Bitmaps/arc_bandagem_16.bmp | b93db84c3344db9696588db531f0bbad3ff3a20f708bb15bb59bf6448b294f2b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0906 | assets/Bitmaps/Dentes2d/arc_dente43b.bmp | b954c82a6abcc52b5c68e0aa337ecccc3e812e6bb39f3c7654d8c2897e6a8c44 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0907 | assets/Bitmaps/arc_canal_27.bmp | b990cf13b464b752a563b9fbe6da41dd2ec56ea44432649109845128a4412178 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0908 | assets/Bitmaps/Dentes3d/arc_dente84.bmp | b9c30f1aecde8141e7063a145efe574b6ad1260eb983bfa2ed4af7b655b1e0b9 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0909 | assets/Bitmaps/arc_capeamento_26.bmp | ba605aefb6d1a8eef4fb62a14a1a66317dcdc27b58d036dd7e2f225efca01762 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0910 | assets/Bitmaps/arc_bandagem_24.bmp | ba638cceb40464ff4dc84049f32499c912f996c1a84bff99bb4fffb2c17d7d9e | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0911 | frontend-react/public/assets/Icones/sim_simb17.bmp | ba8652d2109144cbeda90d29bc3e7141a29b2e3fa886c3dc4e233d1cd6b74988 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0912 | frontend-react/public/assets/easy/int_placa.bmp | bac5146caa98456f45174f4fcccdd23af9eb4c069b8582180314ba4daef45967 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 55/5/1/bitmap1;55/5/1/icone | A | SIM | assets/easy do React |
| A0913 | assets/Bitmaps/arc_nucleo_27.bmp | baeb78b7b89d1aa938a5c27626f8c347e59d8377e89051f8b2ca17f1e8dd0cb0 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0914 | assets/Bitmaps/arc_total1_s.bmp | baf6dcd4486cdb10cd94314c275a70a9eaaaa55b28bbd7b1fa0f7c83d94826d7 | BMP | 32 | 70 | False | 1238 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0915 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente46.png | bb0475bf0fbeba0e17bad73c58ee2a9808e563f770d6afb6ee53b18ede4ff08e | PNG | 32 | 70 | True | 1467 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0916 | assets/Bitmaps/arc_bloco_23.bmp | bb3c0cf0df1f7f0ad4365e278656f818705196208a79238a7b3036dd5e8ea78b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0917 | assets/Bitmaps/arc_fluor_11.bmp | bb64eb732a45acb92672956f818ed7e257850e77f0544cbdc08d605fdf9a8c02 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0918 | assets/Bitmaps/arc_bloco_82.bmp | bb748f24b4ed7f1cbcb9787bdbbf997a58bc3be3d67414c9b150fd3da567386c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0919 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente32.png | bbb4cc3e3061af9aeaf4d887ed4b3467ef72d7595b04b157a4bb7aa027a224b6 | PNG | 32 | 70 | True | 949 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0920 | assets/Bitmaps/arc_fixa2_24.bmp | bc35d1056d6fe27fd82409a4b92513a6a1bdf4101cbf82e8aadf37bb1eb7aad1 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0921 | assets/Bitmaps/arc_trep_11.bmp | bc773fc364334c2fa6150f13fe3eacfdfeb040861b7aefe2997597c763d10350 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0922 | frontend-react/public/assets/Icones/sim_prov.bmp | bca532583afee8413b474feb3eef99b66e24f5e6f4080a04007d311e2d801e12 | BMP | 15 | 15 | False | 122 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0923 | frontend-react/public/assets/easy/int_cirur.bmp | bce6cd0aa6124bfa999de16ad26aede6f79b46eeff2b09a072d897630b4790e3 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 45/5/1/bitmap1;45/5/1/icone | A | SIM | assets/easy do React |
| A0924 | frontend-react/public/assets/easy/dia_fissura.bmp | bd01201872254f7b11f0809580ec3aaa4f2cb3f14cd227477aeca1f1f9cb9f44 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 69/2/1/bitmap1;69/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A0925 | assets/Bitmaps/arc_facet_38.bmp | bd02ac801652763c90e3543dad57e10142706657a88a019e0f054f9e45f7229b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0926 | assets/Bitmaps/arc_migesq.bmp | bd0af0fa9d154468a1f94b69a98567a86efbe1a087f8dbde6007a8e440cb67a2 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0927 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente47.png | bd6ec7cdb8e84a5755480b86d046d694ebe18a2a67df50b7987c6cb30ce1ab55 | PNG | 32 | 70 | True | 1487 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0928 | assets/Bitmaps/arc_fixa3_43.bmp | bda3c0fc932a978ec78a2e2baeca7d1f677c61784ed99d318ed53c2e28813c9d | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0929 | frontend-react/public/assets/easy/int_fixa.bmp | bdbbd01534ebd4395d770ff51e785910ab6b6753a0a51cdeb0570b39d46dc12f | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 5/3/1/bitmap1;5/3/1/icone | A | SIM | assets/easy do React |
| A0930 | assets/Bitmaps/arc_coroa_82.bmp | bdbd805645c1ab81734622f63a1dd6bbc282dcabe3e77d031ab1067fee2df81d | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0931 | assets/Bitmaps/arc_fixa3_48.bmp | bdc3368f773c32a7f03eba6287d598c39170ceab978471730b2f388c4e4c14a1 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0932 | assets/Bitmaps/arc_fixa3_31.bmp | bdc5b42d21f1d038a3a40b956833f47ff14b8c989a55a7c003ab278aef8be5a4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0933 | assets/Bitmaps/arc_nucleo_62.bmp | bdf03faa4e5413bb9dc31b4b9a78b5b059046b6449aea9429fd8a57641e7fd83 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0934 | frontend-react/public/assets/Icones/sim_outras.bmp | be0ff1093863a13f139b7318a294896fc320fb9b8107a1ac3086e60dfdc51eae | BMP | 15 | 15 | False | 122 | PROCEDURE_SYMBOL | C754,C616 | C693 | 57/2/1/bitmap1;57/2/1/icone;58/3/1/bitmap1;58/3/1/icone | A | SIM | biblioteca-base |
| A0935 | frontend-react/public/assets/easy/cmd_avancasemana.bmp | bf06f238cb0e4713d30350fb7aa7741b1e561ae4692c2166a8f2698ec0419224 | BMP | 11 | 16 | False | 246 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0936 | assets/Bitmaps/arc_coroa_81.bmp | bf350df92c2edf3771f956c4fd1ec6881cb9c67a9e04ba7345dc16129c172817 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0937 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente41.png | bf791e1aad56bce334785be34f40725669e96f887bc23e0e9634f494d8ba59a9 | PNG | 32 | 70 | True | 815 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0938 | assets/Bitmaps/arc_fixa3_38.bmp | bf7c78076445049ba7c532bf54ae34ec3369635247e2f85a0d30e27c329d4b5e | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0939 | frontend-react/public/assets/Icones/sim_simb9.bmp | bfefa50f445bbe04e69059791727d838273adcd365484481bfcfa3655398c7d5 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0940 | assets/Bitmaps/arc_radi_11.bmp | bff41d77fc097540ad5f2a0027fad041d698c9d8c92369a9f7b9a09749a81b38 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0941 | assets/Bitmaps/arc_retalho_s.bmp | bff4acbc6b99c77cda10de0836db1a1d632bebd614677dcaa34960de1ddf2072 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0942 | assets/Bitmaps/arc_fixa1_15.bmp | c00ca0fbcca741a26aa7a3d7ecdce1397ab541536681480a3f9d35cc67df7ef0 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0943 | assets/Bitmaps/arc_coroa_32.bmp | c065643f35d2643cbf3d9c85071fe3552ee883c9103bf50c482f0eb074e1ae7d | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0944 | frontend-react/public/assets/easy/int_ajuste.bmp | c0d8cf069c26df8b7fd14c1ec65f1f4d5308018cdf5e41a0cd79f92711465d0e | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 32/3/1/bitmap1;32/3/1/icone | A | SIM | assets/easy do React |
| A0945 | assets/Bitmaps/arc_radi_35.bmp | c10fe952ed498e63b96c72e5ffc3c97608178e6a4f8e2bc4bb55d43e7a2ef5ca | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0946 | assets/Bitmaps/arc_coroa_38.bmp | c115fa9f035850c60b1ab7839348471b33747bf0ff5947b8441e6d554c39cd27 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0947 | assets/Bitmaps/Dentes2d/arc_dente51a.bmp | c13295070c5d7db8f597c9835103f6606f9c8e82d650fb877c1badd17607b510 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0948 | assets/Bitmaps/arc_coroa_12.bmp | c193a8e6236525fc8d4f6295884b15b6652ee09e7ff68588d235d634014ead68 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0949 | assets/Bitmaps/arc_fixa1_35.bmp | c1b25b09d2718b39b38b6cf27e671c3e7b69067bc5416d9e4bd7165d754bdd68 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0950 | assets/Bitmaps/Dentes2d/arc_dente52.bmp | c1ebafc5366d788c4a20961f3cc0fc33d0e49fedb602437f0e09e55290a8290c | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0951 | assets/Bitmaps/arc_canal_22.bmp | c1ecc3bfcf3c213e056bfaebf3c5f83006f43af2941ca0ff3fbc961465927fba | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0952 | frontend-react/public/assets/Icones/sim_simb23.bmp | c207935a81d11ca52a7b8a37ce8deff7e879efab47febf10ba3c74eb0f0be140 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0953 | frontend-react/public/assets/easy/int_restaura.bmp | c21c59dcd4154e2d4f88fd81caf6e513b2864c47190e94aa00eed371ad6dffc1 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 4/1/1/bitmap1;4/1/1/icone | A | SIM | assets/easy do React |
| A0954 | assets/Bitmaps/arc_trep_12.bmp | c2482468192478316560967f1e1f7db1c45637893c839c088c164680743a08a0 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0955 | assets/Bitmaps/arc_bloco_47.bmp | c26fc9b34361a77c42618a36a4a7b485f01dd4b7751e9c8ea5072530fd7541d5 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0956 | frontend-react/public/assets/easy/cmd_altera.bmp | c28007f5899f8a392e8aa18ab1c0eb184badf4a5e9b5e10a4ea4059563912c1d | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | C553 | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0957 | frontend-react/public/assets/Icones/sim_simb28.bmp | c2ac5b07d85bcb3bca8cceeed77ddf7c4e70b4abbe1f61645e35bfcc4e6f3982 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0958 | assets/Bitmaps/arc_trep_31.bmp | c2beed04a05c40e7ceaba31885e4ee40224fd461550d254f063fa058aeeafe18 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0959 | assets/Bitmaps/arc_bandagem_32.bmp | c30488d66433fd8b6131d0f755228994e0c307b8735d376695e8beffbb922bd3 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0960 | assets/Bitmaps/arc_capeamento_13.bmp | c32d34ecfc40ba9188f49013596271842f3cfd1049f507b2e2fcb88f6973235b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0961 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente22.bmp | c338472ca60c73c1473aaa0011b597fcf25686cf7b19983161adfda1197c2f1b | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0962 | assets/Bitmaps/arc_descal_33.bmp | c4329c482130430e648670af861b49a0c4979e9ae04c0a22defbda132361bbd1 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0963 | assets/Bitmaps/arc_facet_13.bmp | c51a61144483e18f0e3f7426ea1d6212cfca5f91ace504e1be40b1ab1d78317d | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0964 | frontend-react/public/assets/easy/int_gengivec.bmp | c53c1177402dfe0211a5d3b00d523ba2cefad9600f3c425081f6d36c683f45bc | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 16/3/1/bitmap1;16/3/1/icone | A | SIM | assets/easy do React |
| A0965 | frontend-react/public/assets/Icones/sim_simb27.bmp | c57ad3a25de0314a544afd0df0d61862b2a084303351e8ceb45f2f126560f99a | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0966 | assets/Bitmaps/arc_canal_46.bmp | c5bb7a80b1ee8fd35be93fe3ed47a76a018ad3e83797ee1c8aef965c204395c2 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0967 | frontend-react/public/assets/easy/cmd_cnfetiqueta.bmp | c5bdc3b06719dc35f17c99c3183f24554b72f58a46bb4fa6d03121002209d5bf | BMP | 22 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0968 | frontend-react/public/assets/easy/cmd_retornames.bmp | c60a5bd13a2c94d5e582524c133304cca0ee7c03ee2c1743ff0acbfb925c8a47 | BMP | 12 | 12 | False | 214 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0969 | assets/Bitmaps/arc_bloco_43.bmp | c62f597228a3c1ec453e040d314f502ae991485c22e1002e9cd0611f7831870a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0970 | assets/Bitmaps/arc_implante_s.bmp | c69559ea7d2db2cf978f8b7af7996716dc7b4e1bb5a8ce54f505d56684c5fb12 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0971 | assets/Bitmaps/arc_rizectomia_27.bmp | c6a5f6094f72d5ec46b60aeff32f0fa6d51f3d5f17d2d5a2ca94f8325c7157a1 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0972 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente28.bmp | c6caf3f05e41d82d243522ef9eb290c55ebca359117653f077dbc15c7b4a426a | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0973 | assets/Bitmaps/arc_fixa1_36.bmp | c6e6b98afb0cd032fb03cb943cb6ce677d72efaf7045702f93ecaafdcd01ec36 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0974 | assets/Bitmaps/Dentes2d/arc_dente23.bmp | c721a189306cac80eb8b0e9c6107b4e131601a594f43ceb77b47b0e347f55797 | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0975 | frontend-react/public/assets/easy/esp_Indefinido.bmp | c7f2a0e631cc7cc29f5d323312bc300c4a5b678d0ea7922b4f51378a575f422a | BMP | 40 | 25 | False | 3054 | PROCEDURE_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0976 | frontend-react/public/assets/easy/cmd_copia.bmp | c86b124e7e2c3a07d90b5f34496886873a2229eb95596ec024659e0c7f73578b | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | C730 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0977 | frontend-react/public/assets/Icones/sim_simb14.bmp | c8a801061d1bb7f9f1b9c815eacf5a239f0b24369bf0cd391e65c0a13e6a9e7f | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0978 | assets/Bitmaps/arc_radi_22.bmp | c8ad4bcf71d41b1655cfc2209fddd06df0f9d07b288bf73eea9d87ca69591481 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0979 | assets/Icones/ico_caution.ico | c8b79c50568a4e3c89d1c876c0f0a6bee3efbfd5d075168712d245a3c0672a50 | ICO | 48 | 48 | True | 9662 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0980 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente17.png | c8f76250bd1ea7a87176ad685ce700fb209f5dcdf93ac060f3c20f1a7793d38b | PNG | 32 | 70 | True | 1569 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0981 | assets/Bitmaps/Dentes2d/arc_dente22b.bmp | c8f91de879f6314a4a6f05b82cc1d2c7830de89cfd1ad4a0aecc52aff6716da7 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0982 | assets/Bitmaps/Dentes2d/arc_dente81.bmp | c95d011e70ab34b933f06079c9cf86954fa1759a36f484f663d09cf6cc05e47b | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0983 | assets/Bitmaps/arc_trep_27.bmp | c992cdde614ed123e9dbe37a6357f480b17b59f0fd6ddaa9b297d3d65d9005e0 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0984 | assets/Bitmaps/arc_descal_28.bmp | c9b0efd8593cb548adde7f462b3af7bf376dac5a8ab501f48fdd681b0b913a7e | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0985 | assets/Bitmaps/arc_erosao_25.bmp | ca30108e0cd5be5def6bf0e763bb683c50844dacb6ccd837340c9b5f90256042 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0986 | assets/Bitmaps/arc_fixa1_34.bmp | ca3d632e33e0bfcd1596db925f5a7ccd944d72ad00ce1bc33ba635ad3c97858e | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0987 | assets/Bitmaps/arc_nucleo_26.bmp | ca84d862b5fb25f917862b545f774944e13512a30ab13cdd3dbef6da7144103b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0988 | assets/Bitmaps/Dentes2d/arc_dente12b.bmp | cb08da04b1be0a323399e348b879c67b5c7136b3981c84fa683861443d982ce4 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0989 | frontend-react/public/assets/Icones/sim_simb1.bmp | cb2a3cd18919eb66842fb8bc3bb4d32836ab42f198d5b352bfb84bf658fd47fd | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A0990 | assets/Bitmaps/arc_erosao_17.bmp | cb581356096a91565750a0ee4e5c77e55d92d75c2e7b46322cd8fcbc7a215fb4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0991 | assets/Bitmaps/arc_fixa2_41.bmp | cbc718a19201254cbe50c2be359075f57b2a3559cb048d097564d86ddaa1fd1b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0992 | frontend-react/public/assets/fichaClinica/odontograma/gerais.png | cbeb36a43dcc9406864095756b87fe44742034da7d7995b2b6ffef8b20e9a324 | PNG | 124 | 124 | False | 21318 | UNKNOWN | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0993 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_biop_ling.png | cc02b167036cbf1c5024bdaef7cdd744d960af6fa9fb3a154c1baaffe688026f | PNG | 24 | 24 | True | 2953 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A0994 | assets/Bitmaps/arc_capeamento_42.bmp | cc9cd6a3923ff6d4d6e8b5292d8951f372505599685bc57260d21c5c519669e9 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0995 | assets/Bitmaps/arc_canal_84.bmp | cce6cc6f9e01a856e4aa9b4ad1774c39a4079eb63b976f7de6e0f2f1a910208b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0996 | frontend-react/public/assets/fichaClinica/odontograma/diagnostico.png | cd5019c0bbccb821dd7658a6a49b6fabf5439175bdaadfac8aa1fa9d87bc1d58 | PNG | 124 | 124 | False | 21742 | UNKNOWN | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A0997 | assets/Bitmaps/arc_nucleo_33.bmp | cd5d38cfbcc29df3102c18ae26ceefee544f270c160f0df0189d93d18b77050f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0998 | assets/Bitmaps/arc_coroa_65.bmp | cd7975464bfa7f005dc7bf49ae3fa76c87bcdcdde79c74e24048c7e921e316df | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A0999 | assets/Bitmaps/arc_lesao_23.bmp | cda764bba974816096cf03d6d490beb29c3e190f9a52e07cccb73b7f3e6a50c8 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1000 | assets/Bitmaps/arc_fissu_38.bmp | cdade4bf7eb3d84e9636f7d2b7cb2582be1388beee7835019676321e5caefafa | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1001 | assets/Bitmaps/arc_bandagem_41.bmp | ce845afe46b9e99356a73d8cecf2caa18d5c4498bf0f066fca09f6f53b99975b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1002 | assets/Bitmaps/arc_canal_61.bmp | ce92918d3c31b40b3e0286db0a136673acf6ed4d916dccf638b6c98fc4681ec8 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1003 | assets/Bitmaps/arc_bloco_12.bmp | cf277ed0c21c918f12b69b30eb40f84439876ac7f07d96646a63c83cd279df24 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1004 | frontend-react/public/assets/easy/int_eho.bmp | cf44af686352b43913c0f8c233952cff7ad76bf03d636ba243f4e9e823051c69 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 28/5/1/bitmap1;28/5/1/icone | C | UNPROVEN | autorização não demonstrada |
| A1005 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente43.bmp | d028bac16f5cb9f25dbbfca03af6240cdece2c36911333be677a7795ef7aede0 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1006 | assets/Bitmaps/arc_erosao_45.bmp | d0600da5d8b66e3226a065c592a78fd6b26b1106b4ca6da881026e0857c635fd | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1007 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente28.png | d09acde412fe588e28e2302ad413681c22c5e646402b64bdcf51aa1bcc2568da | PNG | 32 | 70 | True | 1220 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A1008 | assets/Bitmaps/Dentes2d/arc_dente47.bmp | d0d9879dba2598ac84c0c5a920f5b55a5bb72bffcd9e7db3fb78c45018590389 | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1009 | frontend-react/public/assets/Icones/sim_simb11.bmp | d0e385ca1273a27f435805f17bc3376ba3147ba84ff7bd0278f63aebe066b8cc | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A1010 | assets/Bitmaps/arc_total3_i.bmp | d1488c9e7d98bbbcb03fd05eb864a4287aee3a23e77ab5884a1762f9eda99976 | BMP | 32 | 70 | False | 1238 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1011 | assets/images/int_fluor.bmp | d1620b42ec302d08727d79802d909423db5883ce09730b855a84d58d7959ed7d | PNG | 24 | 24 | True | 2004 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 20/5/1/bitmap1;20/5/1/icone | C | UNPROVEN | autorização não demonstrada |
| A1012 | assets/Bitmaps/arc_fixa3_11.bmp | d18151431db89b202368929b262b2ebbcc55610deaea44d350642016830b22d2 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1013 | assets/Bitmaps/Dentes2d/arc_dente84.bmp | d1aa4dabe55c18ce0347b37f068ba68dda334ca1d6951e184e57a42492964e42 | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1014 | assets/Bitmaps/arc_aumento_s.bmp | d1c89eedd7891fda0db34e17f7a87fb91c29be94c418b38871af6b131de6a7ff | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755,C715 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1015 | assets/Bitmaps/arc_bloco_44.bmp | d1d3b456a5319cf437ac387ff2596ceb00cabb3d2b092b14d58a37cbc6ae3943 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1016 | assets/Bitmaps/Dentes2d/arc_dente21.bmp | d1e736c4287bfad38612e5f3e8f4b94d628c7c847f29112d75f87794be164e59 | BMP | 32 | 70 | False | 6774 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1017 | assets/Bitmaps/arc_canal_85.bmp | d22fc18f86a399d06fbb1528c4ab36cbda613a2dcf5179d593f9114fae73aca6 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1018 | assets/Bitmaps/arc_erosao_28.bmp | d353a87fc835f7f9b48fd5c77695852ef0b0c02e8e7a77dba03ce7bad61c48c2 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1019 | frontend-react/public/assets/easy/cmd_orcamento.bmp | d36415ea93db2d5d9e26fced257ff68520ea52219565ad8c3cdb6be7b21c2412 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A1020 | assets/images/int_enxerto.bmp | d36916a69f7b80bfb8695f267d3f2c27437bd62c6b34a8f6f274f6c7c4d95f43 | PNG | 24 | 24 | True | 2336 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 25/3/1/bitmap1;25/3/1/icone | C | UNPROVEN | autorização não demonstrada |
| A1021 | assets/Bitmaps/Dentes3d/arc_dente74.bmp | d3cdcfa4f35594482f1b6bc0d19a3c32619cd8cb4511aa844ba2e61e119ee18e | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1022 | frontend-react/public/assets/fichaClinica/toolbar/ico_filtro.PNG | d3e18c328dbdc43c38f315c8e9bc2e1910243ab26ef8c229cb66cf34f2d9d6dd | PNG | 30 | 30 | False | 240 | TOOLBAR_ICON | C365 | NOT_DETECTED | NONE | A | SIM | toolbar |
| A1023 | assets/Bitmaps/Dentes2d/arc_dente85a.bmp | d42e3a475a3ea343dacae6fa39a3260053007eb436248c007f0792e9c2a15780 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1024 | frontend-react/public/assets/easy/cmd_config.bmp | d4bd05895e4945d7be20071491d8eefa49ac3b5698a3afe2d78a76fc891b9a76 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | C730 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1025 | frontend-react/public/assets/easy/dia_ausraiz.bmp | d5425299714d38c2423d5f5bffbb92e7363a67a0d345ac6a5471a766ca97c767 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 75/2/1/bitmap1;75/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A1026 | frontend-react/public/assets/easy/cmd_gravaesta.bmp | d544c30f39c15432321fc5978d24000b877d7b47f056f7f81568cb753147fa56 | BMP | 20 | 20 | False | 358 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A1027 | assets/Bitmaps/arc_nucleo_23.bmp | d5a2edff667cff724beb29b3659acd091a142d9699cdc832e0e9747afa22592e | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1028 | frontend-react/public/assets/easy/dia_incluso.bmp | d5dbdb71c2f2c4591306ee6a279b2e6748f1e245f1549381ce4ab0a5ef73ad0b | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 61/2/1/bitmap1;61/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A1029 | assets/Bitmaps/arc_fluor_17.bmp | d6393e8b6f64011494322a017db5126f5385c05840cc7273f73b6ca662e05706 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1030 | assets/Bitmaps/Dentes2d/arc_dente43a.bmp | d64275edc839ff0462006f88ea0d3fcccc570407ac2d646db3b931802e598b53 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1031 | assets/Bitmaps/arc_nucleo_13.bmp | d648da4eff6629da9937d3ad499832c8fd33c350e8640fd7c1d4818479a52a2e | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1032 | frontend-react/public/assets/fichaClinica/toolbar/ico_filter.png | d67d2222550727b859d6f72f93bf9787a9f9ade043459aa9d4f398273c5f75b6 | PNG | 12 | 10 | True | 327 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A1033 | assets/Bitmaps/arc_nucleo_15.bmp | d683f6a224062b6d3597ae20559823199cc968288381a5b8e82625c4531e7665 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1034 | assets/Bitmaps/arc_descal_25.bmp | d693bac7e09a1dc49f41dcc466bc594fda8a43c4ff55e3da2feaf406d6a33829 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1035 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_boticao.bmp | d6e7eea6dceb310d73b6f742a1b374dc71fdd7db121f33e4a0cda25b781b9c76 | PNG | 24 | 24 | True | 1981 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 13/2/1/bitmap1;13/2/1/icone | A | SIM | caller público direto/dinâmico |
| A1036 | assets/Bitmaps/arc_lesao_47.bmp | d7165198a2716b4a562b5867580aa640bd8af6c40fda0239fe8eee8acab77831 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1037 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente15.bmp | d752d282cb5aa9cff27a2a32b2755a3cbbc7e1cc5701c36fc1fffbe1563ca7e4 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1038 | frontend-react/public/assets/easy/cmd_historico.bmp | d7d4428aa358373f91994d78591d6f26d606cccbb1657f8190e684983a3c6c9d | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A1039 | frontend-react/public/assets/easy/cmd_ok.bmp | d82ba1f887ed64d45c805f41d9f04b114dacbdfde84d729f6f8020436e70e14b | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A1040 | assets/Bitmaps/arc_radi_45.bmp | d82c7dc1228b5278f3f2e478c9ed6dd00aa248143e4f3f612c0c6d6459a768eb | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1041 | assets/Bitmaps/arc_tunel_s.bmp | d8381e1bf863c066641cc6047334ee30a19bd5e596d4213a045405212c34a9b0 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1042 | assets/Bitmaps/arc_erosao_37.bmp | d86847aae3bf33895b7365745fa7b59df1748ce1b11676bbf44b52b721fbf509 | BMP | 33 | 71 | False | 630 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1043 | assets/Bitmaps/arc_fixa1_46.bmp | d87b59567fa08ba00f4039213b58761d05f785c6113002605506301423eb27f5 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1044 | assets/Bitmaps/arc_fissu_22.bmp | d89961fb6f5048ae1ec9af2977980d093f31ac1200b4533b1672623b7849880a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1045 | assets/Bitmaps/Dentes2d/arc_dente45a.bmp | d8c9ccdd045186111425beff9d8358b755121cfea81be1f59915184bd558604d | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1046 | assets/Bitmaps/arc_erosao_38.bmp | d8f96fac1b829cf92723d23f8a76882c817b2bdd7d12f9e0f7943db180223ac4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1047 | assets/Bitmaps/arc_bloco_34.bmp | d953cc239e4d66ffe80634f78033833fd3b4fb7705dcd12a3216ba0fa6d6f187 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1048 | frontend-react/public/assets/easy/int_panoram.bmp | d98bdba756dbbcfdb3b321bc4229759789b0bd21fb080203451415dc629760d6 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 33/5/1/bitmap1;33/5/1/icone | A | SIM | assets/easy do React |
| A1049 | assets/Bitmaps/arc_erosao_48.bmp | d9a49a3d2f1be0afa0e52b2186b2f83889d0c9dc8d8fdba025ce30f65e4828eb | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1050 | frontend-react/public/assets/easy/int_capea.bmp | d9d2e4285e2ae12bc6505f9a0bce416fe2c44d7a9760d0d24ab3d0f3dd08b59c | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 53/2/1/bitmap1;53/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A1051 | assets/Bitmaps/arc_coroa_46.bmp | d9e5104da378b36ae2426c13d6ab4c5df8d0c9189e59b0011d24b1e6c81b3050 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1052 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente18.bmp | d9e7e1f05f84bc0a381a1db5a1817966e463befc2bcb438615e0c64b89f445c2 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1053 | assets/Bitmaps/arc_bloco_84.bmp | da75fc93561cc4e5ed80ec40232c04ae18b20a2ac8765fd1096fed95000b8a8f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1054 | assets/Bitmaps/arc_capeamento_48.bmp | da7f71cbc8c8f02d67b2b5ea718efedec6db20259250fc77ed0c8ce3d29e7a8a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1055 | assets/Bitmaps/arc_rizectomia_48.bmp | da8c727a6517568d886c9d7aa8cf2111b3ca40b55ce0479f386bfdd476a6072a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1056 | assets/Bitmaps/arc_coroa_28.bmp | daffabce2004a5be7ef0a174486af2a2bdfe6e11bf147333989e2646751a9df6 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1057 | frontend-react/public/assets/easy/cmd_anamnese.bmp | db523d2f74d55e6dfc4e704b6b8a0adfb075555d8ccfc182304f46eab5f8d9ed | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A1058 | assets/Bitmaps/arc_fluor_33.bmp | db574105f807a4f744813710774421739051b3f6efbc08c87ecf7a962376eea2 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1059 | assets/Bitmaps/arc_extracao_i.bmp | dbd784ff1f265c5bdb447c4e430c3511f88fa6e1c06cedb358ebfd044b0b729c | BMP | 32 | 70 | False | 1238 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1060 | frontend-react/public/assets/easy/cmd_maladir.bmp | dbe17e03a9d70e8cc36d6097aa2bccb7a4d77da1285e586d86fb4858c0bb93a5 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A1061 | assets/Bitmaps/arc_rizectomia_14.bmp | dc06c48adc2fa5663900bc3fe877a4e25c62b0e1cbb1dc4877c4542b11101f51 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1062 | assets/Bitmaps/arc_trep_14.bmp | dc2157be9c6a139ef16a6d5f38f66adf5991a26d7e3a6e20eead73baaecd447a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1063 | frontend-react/public/assets/easy/cmd_grafico.bmp | dc5e52e58edfdb51c1e6230d5eb51a717237ddfd4a140bf091640c38b01c2ad6 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A1064 | assets/Bitmaps/arc_bloco_83.bmp | dc6a9f072da786bd18d1e181b23e0ac715659c68fd8221b99cecf16357569383 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1065 | frontend-react/public/assets/easy/cmd_senha.bmp | dcb983d6043fe8f02cd4aa0b90d44771594c166fac076ab648dabf1604c35ed8 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A1066 | frontend-react/public/assets/easy/int_mordida.bmp | dcd488800b2023dff293d9d672ee2d7b6e2656b71ea64b2dadb906355af48c65 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 37/5/1/bitmap1;37/5/1/icone | A | SIM | assets/easy do React |
| A1067 | assets/Bitmaps/arc_coroa_36.bmp | dcdcc4a5151b0730de54823287d85917e6da8963f7597f232d1c4a05d0efb0aa | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1068 | assets/Bitmaps/arc_rizectomia_36.bmp | dce3e7a9be39f1cbc61f2fc489cbf15415c7c5b9c6511bc43446715794d983f4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1069 | assets/Bitmaps/arc_erosao_31.bmp | dd0084dc639175cfa01d6d92c8c42a6a100a6091f0ecf3e78431798980caa569 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1070 | assets/Bitmaps/arc_fixa2_15.bmp | dd54f458f75dbbde0c9acbf140230d97d81cf2d1c4ab2fc22cd655ff3239be13 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1071 | assets/Bitmaps/arc_hemi_i.bmp | dd8cc9e1e733848d8b735dca18665c0383cf29dcfc9d0ecadc04199ba6688eb0 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1072 | assets/Bitmaps/arc_fluor_24.bmp | dda263dff3710be612e3f99cefb0724efc4992af6b982c6661ae14aca0066bfe | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1073 | assets/Bitmaps/arc_fixa2_17.bmp | ddae6eb3a12e7ac2c5c4e6899f676282f7c928398bf5cb300a5011c118bd1c24 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1074 | assets/Bitmaps/arc_trep_34.bmp | de2f9344d135629ef4e7eb22c853ed162328ed756eef23662ac3fb5cdcd57158 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1075 | assets/Bitmaps/arc_trep_48.bmp | de39f00de60c391c9ecf803407f83e32c9e268af78f3cb22dd3e08408126adcc | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1076 | assets/Bitmaps/arc_trep_46.bmp | de576d03fbbc9b5786def0a07b52fe781cdf90cd3c090ab306e7e23cd024dff2 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1077 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_biop_maxila.png | de8a83fe9f8b5da916eb051dfd5a060ba2cae229445b940d04c136adcf9f834c | PNG | 24 | 24 | True | 2680 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A1078 | assets/Bitmaps/arc_fixa1_38.bmp | dea8a26504146896785de8833ef4469196586bfbd6de189204f72ed4ad1b16f3 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1079 | frontend-react/public/assets/easy/arc_superior_perm.bmp | dece5afbe1a3c5f92a6e628e1eff6a822468b1e8c9be7e605632b471576ec087 | BMP | 512 | 96 | False | 196662 | ARCH_IMAGE | NOT_DETECTED | C755,C715 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1080 | assets/Bitmaps/arc_facet_28.bmp | deedc5e63fd20781fffd4ab75677018ecb634910afdaf35bc5eda45980c3a927 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1081 | assets/Bitmaps/arc_coroa_13.bmp | df19cc7b4679a65fa72db4547c0a83546fceb610e2c8af81490b3313a2ee3eb4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1082 | assets/Bitmaps/Dentes2d/arc_dente74a.bmp | df292191295ac7e7e88451a85664670ecb0a2f097be7adede7eed43acffce3be | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1083 | assets/Bitmaps/arc_facet_21.bmp | df2eed269b1df3bf093c8d5597828536c9b5233f7bb2eaaddc6460dd8b42c26c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1084 | assets/Bitmaps/arc_nucleo_64.bmp | df69483ca2093446f5fa4575de4e8516688dc753c10f9b62c1dbdb066109e51c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1085 | assets/Bitmaps/arc_coroa_33.bmp | dfab73a1a04c4571ffe5b7f45df335487bee225c63ac0d73af51fef62c4b1152 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1086 | assets/Bitmaps/arc_remov2_s.bmp | dff4cb6efe9d26c8d5807ed7496b827644dd82ac7c4626e8d0948bdb48fd54dd | BMP | 32 | 70 | False | 1238 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1087 | frontend-react/public/assets/easy/int_bloco.bmp | e021d75b42f677ed7cd3e7aa7207e730d40e3e097fef08ffc36cca8ab5798af6 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 2/2/1/bitmap1;2/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A1088 | assets/Bitmaps/arc_ades_i.bmp | e0338bcc894cf7778ab9336a1ed0797046c3187a723962816353227f166c1e0b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1089 | assets/Bitmaps/arc_fixa3_14.bmp | e05f025a73fe0753fd4522fede84c0f06603d3b108b0a93fed5cb9edfe8a2798 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1090 | assets/Bitmaps/arc_fixa3_34.bmp | e0bb8df20439cd069e4d56a505dd945c166bd7078fc354cb1f008f41f0e33ba2 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1091 | assets/Bitmaps/arc_facet_46.bmp | e144011a9078be838aaaa49a59ebd784fb58c5705e46fafeb607101b3c86d703 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1092 | assets/Bitmaps/Dentes3d/arc_dente83.bmp | e15585bb7ba94e2adce2b9d4497ea4afc4d1bf5b36089d77617b9807edb72724 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1093 | assets/Bitmaps/arc_bracket_i.bmp | e16ea21d85504020c9f3137a2a2a8887c525e60d8394b3a9726279e3cd81f33b | BMP | 32 | 70 | False | 1238 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1094 | assets/Bitmaps/arc_bloco_27.bmp | e17433e84cd0e2da89dcaa4638b91716a779306131a9f64f7bbeef0adfdede5b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1095 | assets/Bitmaps/arc_fissu_37.bmp | e1bde6c150ea767b9951f9ffa454883d3747b5d322eba6d3b0badf83afc64093 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1096 | frontend-react/public/assets/easy/cmd_avancames.bmp | e20f0c49e407b9eccfe2f2e779a9f7da40aaa8efee2c192314c0b77065ea61d5 | BMP | 12 | 12 | False | 214 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A1097 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_torus_mand.png | e233a6886e45c87f8aac30be23febaa8eb2f3adf8c89225c1af62abf30e6d06e | PNG | 24 | 24 | True | 2991 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A1098 | assets/Bitmaps/arc_bloco_85.bmp | e2692c3822e9d44e30926ef82f63b58a189b4f80f7046301f54059b5de88d484 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1099 | assets/Bitmaps/arc_capeamento_34.bmp | e2d281336bddde8a91cf4d96ca51eec1be893c474e83a32166d44f996894d772 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1100 | assets/Bitmaps/arc_fluor_42.bmp | e2e31b2d3a6628b7626f28a94903efca8c87fd3e5a24ea2dd3448bfa03533946 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1101 | assets/Bitmaps/arc_bloco_25.bmp | e2ec8b0ad0132a28c014a95c6d8721ae98f23f75cc9e3ffee840d1d74bc1d334 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1102 | frontend-react/public/assets/fichaClinica/toolbar/ico_tabelas_auxiliares.PNG | e32aa28fd68c8cb27ea682ea98cc1de045b0faf7dea18cdb3951fcad50f7445c | PNG | 24 | 24 | True | 135 | TOOLBAR_ICON | C365 | NOT_DETECTED | NONE | A | SIM | toolbar |
| A1103 | assets/Bitmaps/arc_fissu_48.bmp | e34dc36ebeb5ed0a392e2f3963c11ca172b9fa3664a1a9fdbad23525d6a3c8c4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1104 | assets/Bitmaps/arc_fissu_15.bmp | e38a62d17c8b447b879703421826e596e512169cccd0b41fa6b54f28b877472d | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1105 | assets/Bitmaps/arc_coroa_53.bmp | e3c86ccb58422addc66cb6747b75b00d76520799d459b8899f4d595a107587ab | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1106 | assets/Bitmaps/arc_fluor_45.bmp | e435be1a665fab110ae581981d730210308ee07da0c2952e3a37c3d7c2c312ec | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1107 | assets/Bitmaps/Dentes2d/arc_dente64.bmp | e4b5c965a8d38c683816b674564b1b74f04ee54975a9b1a9761d1753d9fc8a9f | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1108 | assets/Bitmaps/arc_canal_11.bmp | e4dab289744d79db016f692f372263064e35906cb75eef15c28217d8ca732508 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1109 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_biop_labio.png | e594903a487c5bcb8871cd3925f00e9c55a3387e82a623088614b8be33240162 | PNG | 24 | 24 | True | 2816 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A1110 | assets/Bitmaps/arc_capeamento_12.bmp | e59cc00dfb4163af8f7996d4f7c3b02760d818c1b12777fabfeddfd25e7f83f1 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1111 | assets/Bitmaps/arc_fluor_16.bmp | e60e660ed6d48a2b667b358ab921d8d6017aa44771d1016d6fbe1a900aaf6af8 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1112 | assets/Bitmaps/arc_remov3_i.bmp | e6cd14ce1e33bb6e1e14f56e32a3dd385fbfa2bafeb1610a8bbb73087978467e | BMP | 32 | 70 | False | 1238 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1113 | frontend-react/public/assets/easy/dia_lesao.bmp | e71f14eca8d1c5c9ac3c8d1807ee6b4fdc8a1d998c281683fb7efd3328b21d55 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754 | NOT_DETECTED | 72/2/1/bitmap1;72/2/1/icone | C | UNPROVEN | autorização não demonstrada |
| A1114 | assets/Bitmaps/Dentes2d/arc_dente72.bmp | e72ba9c619fedb12980d51ea19dfc6907570431aab1609a41171bd1889e9e86c | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1115 | frontend-react/public/assets/easy/ico_alert.bmp | e75e86595365f6ce7eb0c0578539c8bb2e74f7df384781ee6c3cc9f08d8f8db2 | BMP | 45 | 50 | False | 1318 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A1116 | assets/Bitmaps/arc_facet_26.bmp | e766ba1efc88b20ab83de7f156e3a5277c2e48e57d0e85768cfaa0d2f0b4974c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1117 | assets/Bitmaps/Dentes2d/arc_dente28.bmp | e780d7397d956f777c27811e3ffa58f7c60c9a97e2a38b8a1e35430dbd1965cb | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1118 | assets/Bitmaps/arc_nucleo_14.bmp | e8123a54d6df63d303dff9340f1f64021e2dae54f375818d7182ae767d6b73f6 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1119 | assets/Bitmaps/arc_descal_42.bmp | e83af8c28e2ea08dc70f33012e0782513be790b429c7cc4f4d9d45bc00892507 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1120 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente31.png | e867112a01219db843f875ea781df17ca5c8a6681708180e867c8ee991db873e | PNG | 32 | 70 | True | 803 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A1121 | assets/Bitmaps/Dentes2d/arc_dente73.bmp | e88b395f6c85fe608964b78f19c7eb9e6adbb41621c6dbaa5c6769a8e7df62b1 | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1122 | assets/Bitmaps/arc_lesao_48.bmp | e8ab028cd9ab0b420a04fd0ef74442f1b3345b09a28830e9ccc229d95fb02607 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1123 | assets/Bitmaps/arc_descal_47.bmp | e8b50e915b7601ababc7b482503a61229bcb79d94b1f3e4fd1f65cb7561f129c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1124 | assets/Bitmaps/Dentes2d/arc_dente25b.bmp | e8dd9b1b80dc3409641bd2f0f1965c962e6a9f52509758b0ac629373b7a1c8bb | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1125 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente26.bmp | e8fd7c2c2dc348f8b3cd3f34705802dfacfb2308528bb35798c017d532602726 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1126 | assets/Bitmaps/arc_trep_26.bmp | e90e736af7bf990d1bd438460a33520f5860f1ecfae6c1f16d0fb9133a6b8f68 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1127 | assets/images/int_retalho.bmp | e9ba163e94ee56249091bc6b4765fd2ee443030183a7b52409bcd0fde5e93525 | PNG | 24 | 24 | True | 2387 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 17/3/1/bitmap1;17/3/1/icone | C | UNPROVEN | autorização não demonstrada |
| A1128 | frontend-react/public/assets/easy/ico_memo.bmp | e9d902c73877eb2d1397a0b9605a50768a01ea7f4c841d095649bd505401e591 | BMP | 16 | 18 | False | 262 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A1129 | assets/Bitmaps/arc_bandagem_46.bmp | ea6ed64bcba740aafacb6a600efb87b7634255cfa3ef450351021c88910c2260 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1130 | assets/Bitmaps/arc_fixa1_27.bmp | ea8883c43ffd02fcbd147c7c04374209fec535323affd429beed11b8729cce59 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1131 | assets/images/int_consulta.bmp | eb0a8fa8b084973d6f5c5bb7d7ede4210b8021114cf9ab81de8a0b3a500cde0f | PNG | 24 | 24 | True | 2252 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 10/5/1/bitmap1;10/5/1/icone | C | UNPROVEN | autorização não demonstrada |
| A1132 | assets/Bitmaps/arc_capeamento_35.bmp | eb210bd08e36fc61fe0d3b66b105d757db9c7a3da3cce47633eb57376633c9f4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1133 | assets/Bitmaps/arc_coroa_21.bmp | eb628388f5267e8437464da8934f1eed4924900389cc6528c6f936140fce1fb1 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1134 | assets/Bitmaps/arc_coroa_72.bmp | ebac422a449857e1d6298667c5cac0eaa5d21c3891e8f0a120f2a586a96a6966 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1135 | frontend-react/public/assets/easy/cmd_setapreview1.bmp | ec19d82b3b9cd4e309410a4b338c2b8da8d9911e231cc9ac67c74d9c0d5badef | BMP | 15 | 15 | False | 238 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A1136 | frontend-react/public/assets/easy/esp_Ortodontia.bmp | ec3ada339f6ea85f71b4f876ce6ce053b599e11c0a7c824b15fd058bc4ebe44e | BMP | 40 | 25 | False | 3054 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | assets/easy do React |
| A1137 | assets/Bitmaps/arc_trep_36.bmp | ec840611441f7f48bef518ac16d1bcd811a23e0521a8a7c0cc48b898ca8449e7 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1138 | assets/Bitmaps/arc_fluor_21.bmp | ecb9cdb98d72c624cec33e279175702f6c5eaa1f2b0d706cf54d9191a7c181f3 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1139 | assets/Bitmaps/arc_retalho_i.bmp | ed00f97801e1955364d2dbce84decebaa33a4d23042f85152352a79f8a3801a4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1140 | assets/Bitmaps/arc_descal_11.bmp | ed2fad72daeec7bd23f27314ee025cf2f22f01b9efd1af802fe3a71a03a945bf | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1141 | frontend-react/public/assets/easy/int_peric.bmp | ed729b585a4b850450a0e1b6436b38e94ffd334289028bc5d6ddf821d13f11c4 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 54/5/1/bitmap1;54/5/1/icone | A | SIM | assets/easy do React |
| A1142 | assets/Bitmaps/arc_descal_17.bmp | ed97ed9e3d9ffc6d797e80dbb517e68e2aae25143621f4fad9be8e03fe88ca86 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1143 | assets/Bitmaps/Dentes2d/arc_dente24b.bmp | ede26f2faf90567f0a2c33b12effaf1ddd476781c7052f9397e0e2e9ba599fe9 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1144 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_exostose_max.png | ee0f79221bc6404d58b9119f5c9617aea1946019e79814b47dcebddc35883015 | PNG | 24 | 24 | True | 2900 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A1145 | assets/Bitmaps/arc_raspagem_s.bmp | ee12b8f8c3999d651e37e7c311c8cfd0ac965fe4ab30c3667503a95a3262c3e9 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1146 | assets/Bitmaps/Dentes2d/arc_dente54a.bmp | ee3a296ecf315e91866c23b2eb6ccf450109d6d7c91aa71bc823e57200511ea2 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1147 | frontend-react/public/assets/Icones/sim_simb6.bmp | ee82bc013a5cdb758c32919082858c63b35730c177e34c3f81c302833206dfd7 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A1148 | frontend-react/public/assets/easy/esp_Implantodontia.bmp | eed6ebcce45dc6ec97b14a208be8a72ef0efff421b2bcdd414eef44bca175a8b | BMP | 40 | 25 | False | 3054 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | assets/easy do React |
| A1149 | assets/Bitmaps/arc_facet_33.bmp | eeec187636485feb18ba34dde12e85afdca9af27f363b449d19f35ffdddf3b51 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1150 | assets/Bitmaps/arc_bloco_64.bmp | ef2bbe3a6e2686f3f722a924927965d9a2de023ed11bb22d812c6717c2f21a79 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1151 | frontend-react/public/assets/easy/cmd_contato.bmp | efce9048b24fe5473c57e8a2cedeae2b267d1641ad37a6a441c5ae832c0026d3 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A1152 | assets/Bitmaps/arc_bloco_31.bmp | efd094e9bcb2f216b0488652c511241c08f37fb1b77ebbf8a3de65f6c1934238 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1153 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_generico02.bmp | efdbb62568bd2dc96e8bcad3c27d425cfa466b4b431827156d5cadf9598a3f67 | PNG | 24 | 24 | True | 19545 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A1154 | assets/Bitmaps/Dentes2d/arc_dente51.bmp | f030657ae4b4a0f4fe19ee12267753b004f7408f3553a9103d4013ef3260c140 | BMP | 32 | 70 | False | 6774 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1155 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente18.png | f036d4ab131df740a786bcbb2e90057ac8684322b167c58c1a8e252ef5402439 | PNG | 32 | 70 | True | 1239 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A1156 | assets/Bitmaps/arc_extru_i.bmp | f1238f15d2780ea7b38993d7a878867a46fe5b264aac8bab0ca5ffd339a90f08 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1157 | assets/Bitmaps/Dentes2d/arc_dente25a.bmp | f1726b06a57c376c8f2fa91f41b242658eb34d56ede733261d01e70f9a1ea25a | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1158 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente22.png | f1d98c4804af609e5d9d242af877c04ab2f7f6d835acf3060d9e340f5f98df5b | PNG | 32 | 70 | True | 1056 | TOOTH_IMAGE | C752 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A1159 | assets/Bitmaps/Dentes2d/arc_dente37a.bmp | f1f26d62ff35a5898ef9561d10028a81f624b5c29a796d5c887b3162ff637c0b | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1160 | assets/Bitmaps/arc_coroa_48.bmp | f20f8d4fc1427254011372fd6168050b7d4e4ff0c47dedb193b8c0ed0fb16ab2 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1161 | frontend-react/public/assets/easy/int_RestMOD.bmp | f23303a7baaf640e12f08a7094ca8d4ddf2809c04107003cc4385fd79665ceeb | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365,C546,C555 | NOT_DETECTED | 77/1/1/bitmap1;77/1/1/icone | A | SIM | assets/easy do React |
| A1162 | assets/Bitmaps/arc_fixa2_45.bmp | f32c0d6a35a34d4eb44ea0dc2339bd32dd512d5e242cd92b75dd956dd562b328 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1163 | frontend-react/public/assets/Icones/sim_30.bmp | f38d40c772347c7364643c4847a5348765c6b705fdc9aaf207c72d024e5dd7f8 | BMP | 15 | 15 | False | 122 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A1164 | assets/Bitmaps/arc_coroa_34.bmp | f409e5113be5a9da271662f43b7a16dcf9913f9ef8555f06e5fc51aa92ee4260 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1165 | assets/Bitmaps/Dentes2d/arc_dente61a.bmp | f4f9dd9e8f0b86994fcb1946aef0b59ee3d6f03053a1b641b2b497af53b64226 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1166 | assets/Bitmaps/arc_rizectomia_46.bmp | f5700b5eb0a68e157fedb30213a89dfdc8a2fe362f81df870025b1bc660ba8d8 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1167 | frontend-react/public/assets/easy/ico_dedoanamnese.bmp | f5bac8091aa51ecf0a71b29e87abd3d0653e2335d6adc7841f8147fd1d936a31 | BMP | 17 | 10 | False | 238 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A1168 | frontend-react/public/assets/easy/cmd_finalizaint.bmp | f5c69e787157155b392d437320036406f1b6f0e38a322a2dcec368341a04fb8e | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A1169 | assets/Bitmaps/Dentes2d/arc_dente33a.bmp | f5ce64d90b9417e5197edf1dd8610149b2848daa181ed14c3158135d4cf2094f | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1170 | assets/Bitmaps/Dentes2d/arc_dente72a.bmp | f60a44a2ff19c8fb10867d593c9d7fc3269873bc3ffc16d4d6defcdf87f7de4f | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1171 | assets/Bitmaps/arc_erosao_36.bmp | f652b7aafc9be6102ebf6d9748a504e114c7f5fe6ad63daaa1a5c4a78bacec1f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1172 | assets/Bitmaps/Dentes2d/arc_dente16.bmp | f65cdc269e65f99537e28c207735d5573b8f4f027b23ef9247de8b5b1ea8a01d | BMP | 32 | 70 | False | 6774 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1173 | assets/Bitmaps/arc_remov1_i.bmp | f67650736e90d2e605a1cff2814c9076ad0d3b71e5291a21d01dd49a2ec2da65 | BMP | 32 | 70 | False | 1238 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1174 | assets/Bitmaps/arc_bloco_13.bmp | f72db578f67588c50c5e61058dfa57cfe907955ed19eab5634dcfb1d62cf54dd | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1175 | frontend-react/public/assets/easy/cmd_verificabkp.bmp | f7472eb4d44ce327f0c0bbd32a8d301d8c6b60cbe3638b7de32a70d63f6f15b3 | BMP | 42 | 40 | False | 2838 | TOOLBAR_ICON | NOT_DETECTED | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A1176 | assets/Bitmaps/Dentes2d/arc_dente13b.bmp | f79fea4e4fa599d61c5090b575b2f66dab53b2a8276d122fe5324db00be84c73 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1177 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente27.bmp | f7fb1658026cdfd807cbfced2d432b009c673c624a93a52492babb7f31575a81 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1178 | assets/Bitmaps/Dentes2d/arc_dente54.bmp | f811b91dd2968502405c2cb61f324988d49b97d55e947ef14982a64788b6193c | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1179 | assets/Bitmaps/arc_nucleo_46.bmp | f835abe5633412fd14d24757d18fe151fb7f74ba7a1c845f82c185910e02d519 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1180 | assets/Bitmaps/arc_fixa1_42.bmp | f87033e72824c49488290306c17c92138496921101e8238c0814a0d373eca15f | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1181 | frontend-react/public/assets/Icones/sim_simb7.bmp | f8de7fdf9bf21463c22dba41236340b4d873f97b2a1e3476bc4bcc624ec55e99 | BMP | 14 | 14 | False | 118 | PROCEDURE_SYMBOL | C616 | C693 | NONE | A | SIM | biblioteca-base |
| A1182 | assets/Bitmaps/arc_capeamento_17.bmp | f99ee1ca658e41bf264e6396a103951e77e5110a9273e4352a9924ebffba9465 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1183 | assets/Bitmaps/arc_canal_37.bmp | f9c0b6196ef1b3e4d3c2462045ada425f9396590c8a26c1c4a7a7af26829ff6c | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1184 | assets/Bitmaps/arc_descal_23.bmp | f9eb9a2fff250a27f3fbe388dc406869524352ddf6c66e4f309b67cd78f3c1df | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1185 | assets/Bitmaps/Dentes2d/arc_dente37.bmp | fa4235d29648bc8c579a582294a3ed06f561d7e0d46094381fe3756070b92670 | BMP | 32 | 70 | False | 6774 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1186 | assets/Bitmaps/arc_rizectomia_38.bmp | fa60b28509df5df13b94803af8daf18ac28c03b086592126ff2b2b0b23c4ca3b | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1187 | assets/Bitmaps/arc_nucleo_16.bmp | fa62ee1a744efa84bb3ba5e10a235caa4f2062a328bf66af06f57fba51ec81b4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1188 | assets/Bitmaps/Dentes2d/arc_dente55.bmp | fa7e8a4232ba3418102a145db716f508b30115d45919db7824d488bfe63af5ac | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1189 | assets/Bitmaps/arc_erosao_43.bmp | fa85b9fb7f6607a5c19622f7d319cbaf970028cef75e7e904758ba628f55bd37 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1190 | assets/Bitmaps/arc_coroa_62.bmp | fae0b402b485fdf274494f2c500f075eb5a0c685d6d23923d6d8e16a907cc7fe | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1191 | assets/Bitmaps/Dentes2d/arc_dente31a.bmp | fae0f03ac92ab9aaf2b9b804db46b39a41b03bb97ff3da8efad813056158e68f | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1192 | frontend-react/public/assets/fichaClinica/odontograma/especialidades/esp_Estetica.bmp | fb2e8d9c8b166335eb52860ff0a17e0276dfd21df6d40c0ea2c933cd313fcaf9 | BMP | 40 | 25 | False | 3054 | PROCEDURE_ICON | C365 | NOT_DETECTED | NONE | A | SIM | caller público direto/dinâmico |
| A1193 | assets/Bitmaps/arc_trep_33.bmp | fb7398031c487f81dbef62ee57782491e1b1db8274476129dda74ece59250da4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1194 | frontend-react/public/assets/easy/int_implante.bmp | fc193976cfe7b709cf4282faec9cb13ab46dc6d9a9bad329d0a0444c7373f9d9 | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 9/2/1/bitmap1;9/2/1/icone | A | SIM | assets/easy do React |
| A1195 | assets/Bitmaps/Dentes2d/arc_dente31.bmp | fc51c54f48143067816888efa15cfb4fd03c1becc9f4e47119c6e52191e8deb5 | BMP | 32 | 70 | False | 3318 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1196 | assets/Bitmaps/arc_bloco_73.bmp | fd1cb5d614808febb64c35605cf4aa63dad3edc12be49efbc884de5875a3a484 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1197 | assets/Bitmaps/Dentes2d/arc_dente34.bmp | fd33d0636e417320969359e2e88607d6dd374b5dfec0bac2a674545a2bed3eba | BMP | 32 | 70 | False | 6774 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1198 | assets/Bitmaps/Dentes2d/arc_inferior_dec.bmp | fd4555717680ce657fd0a78ab150ac73d51b98051bbf76f11b9d1bcc8f06b46e | BMP | 512 | 96 | False | 196662 | ARCH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1199 | assets/Bitmaps/arc_trep_28.bmp | fd4a85b42eb28d10b7fb8805b44b9c5db68c9259f74976eb607b3be8020fd22a | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1200 | assets/Bitmaps/arc_enxerto_i.bmp | fd55fff640bea8b6ff39a06935d3ac198028250c3b6d58cbebc160d466a06497 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1201 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente47.bmp | fe20984066f8c84783719de33382b6036c5a11dc1b7448e80ff8c38c8d470383 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1202 | assets/Bitmaps/arc_fluor_35.bmp | fe3035aea9dd5f92de9d094d408f16300f79c108fb55d174580a66ecd51c48a4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1203 | assets/Bitmaps/arc_facet_36.bmp | fe55e6af94a119111888ce9d07a0383f07fca9d839668323b5a78242e65a23a9 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1204 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente32.bmp | fe9d955e129840b8323282d7d230619f219b9085fe003a80aa10da2c4fa132a7 | BMP | 32 | 70 | False | 4536 | TOOTH_IMAGE | NOT_DETECTED | C753,C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1205 | frontend-react/public/assets/easy/cmd_odontograma.bmp | fea0734fb134376077be6a0605834569fb8624ecaabffe4a60305bb88e786fad | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | NOT_DETECTED | C730 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1206 | assets/Bitmaps/Dentes2d/arc_dente34b.bmp | fef5c563f0ed65fa79af827b6e774b3baf10a9d6854e0aea253ba6448415c281 | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1207 | frontend-react/public/assets/easy/cmd_cancela.bmp | ff02d7b1ca6683736589d3591418fa51bebd086fc0f894189cb181bc1c786509 | BMP | 21 | 21 | False | 370 | TOOLBAR_ICON | C553 | NOT_DETECTED | NONE | C | UNPROVEN | autorização não demonstrada |
| A1208 | assets/Bitmaps/arc_erosao_33.bmp | ff425e85888e4f2f6fc4f594c5bf242a0d73c7fcf0d38cd8e6d01b958782fc34 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1209 | assets/Bitmaps/arc_fissu_16.bmp | ff728ca3dd25f724ecbf8ad69ef8cfca76210021996c0f8b7c7fafd4264c8e53 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1210 | assets/Bitmaps/Dentes2d/arc_dente48a.bmp | ff8ab75ee148ab2dba10048844bb136cf84a10169ce44dee093940884f9174ef | BMP | 32 | 70 | False | 1238 | TOOTH_IMAGE | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1211 | assets/Bitmaps/arc_trep_16.bmp | ffb0da2862c6f6e10bb643351ef1a75b77c4a5aa57fad0930d48c449590183e8 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1212 | assets/Bitmaps/arc_capeamento_45.bmp | ffeb1951f0cd61cfaadb802d9bfb44c696c464587ae05d3f728f1fbcd0c779c4 | BMP | 32 | 70 | False | 342 | PROCEDURE_SYMBOL | NOT_DETECTED | C755 | NONE | C | UNPROVEN | autorização não demonstrada |
| A1213 | frontend-react/public/assets/easy/int_raspger.bmp | fff6b6c382f5d12ae6715d432204a38b5e839ad1ce80a0c6225477f8ccdd7c7f | BMP | 24 | 24 | False | 1784 | PROCEDURE_ICON | C754,C365 | NOT_DETECTED | 27/5/1/bitmap1;27/5/1/icone | A | SIM | assets/easy do React |

## Aliases físicos por hash

Cada linha abaixo remete à única linha acima; não promove autorização dos aliases históricos.

| ASSET_ID | PATHS |
|---|---|
| A0001 | frontend-react/public/assets/easy/cmd_down.bmp; assets/Icones/cmd_down.bmp; assets/easy/cmd_down.bmp |
| A0002 | frontend-react/public/assets/easy/cmd_fonte.bmp; assets/Icones/cmd_fonte.bmp; assets/easy/cmd_fonte.bmp |
| A0003 | frontend-react/public/assets/Icones/sim_face.bmp; frontend-react/public/assets/easy/sim_face.bmp; assets/Icones/sim_face.bmp; assets/easy/sim_face.bmp |
| A0004 | assets/Bitmaps/arc_fixa3_13.bmp |
| A0005 | assets/Bitmaps/arc_nucleo_22.bmp |
| A0006 | frontend-react/public/assets/easy/esp_Endodontia.bmp; frontend-react/public/assets/fichaClinica/odontograma/especialidades/esp_Endodontia.bmp; assets/Icones/esp_Endodontia.bmp; assets/easy/esp_Endodontia.bmp |
| A0007 | assets/Bitmaps/Dentes2d/arc_dente18a.bmp; assets/Bitmaps/Dentes2d/arc_dente18b.bmp; assets/Bitmaps/arc_dente18a.bmp; assets/Bitmaps/arc_dente18b.bmp |
| A0008 | frontend-react/public/assets/easy/cmd_etiqueta.bmp; assets/Icones/cmd_etiqueta.bmp; assets/easy/cmd_etiqueta.bmp |
| A0009 | assets/Bitmaps/arc_trep_37.bmp |
| A0010 | assets/Bitmaps/Dentes2d/arc_dente15.bmp |
| A0011 | assets/Bitmaps/arc_fixa2_44.bmp |
| A0012 | frontend-react/public/assets/Icones/sim_simb30.bmp; frontend-react/public/assets/easy/sim_simb30.bmp; assets/Icones/sim_simb30.bmp; assets/easy/sim_simb30.bmp |
| A0013 | frontend-react/public/assets/easy/int_maopunho.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_maopunho.bmp; assets/Bitmaps/ger_maopunho.bmp; assets/Icones/int_maopunho.bmp; assets/easy/int_maopunho.bmp |
| A0014 | frontend-react/public/assets/Icones/sim_simb12.bmp; frontend-react/public/assets/easy/sim_simb12.bmp; assets/Icones/sim_simb12.bmp; assets/easy/sim_simb12.bmp |
| A0015 | assets/Bitmaps/arc_canal_15.bmp |
| A0016 | assets/Bitmaps/arc_enxerto_s.bmp |
| A0017 | frontend-react/public/assets/easy/ico_dedo.bmp; assets/Icones/ico_dedo.bmp; assets/easy/ico_dedo.bmp |
| A0018 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente34.png |
| A0019 | assets/Bitmaps/arc_descal_45.bmp |
| A0020 | frontend-react/public/assets/easy/cmd_last.bmp; assets/Icones/cmd_last.bmp; assets/easy/cmd_last.bmp |
| A0021 | assets/Bitmaps/arc_capeamento_28.bmp |
| A0022 | frontend-react/public/assets/easy/dia_fluorose.bmp; assets/Icones/dia_fluorose.bmp; assets/easy/dia_fluorose.bmp |
| A0023 | assets/Bitmaps/arc_canal_74.bmp |
| A0024 | assets/Bitmaps/Dentes3d/arc_dente52.bmp; assets/Bitmaps/arc_dente52.bmp; assets/easy/dentes/arc_dente52.bmp |
| A0025 | assets/Bitmaps/arc_fissu_31.bmp; assets/Bitmaps/arc_fissu_41.bmp |
| A0026 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_generico01.bmp; assets/images/int_generico01.bmp |
| A0027 | frontend-react/public/assets/Icones/sim_raiox.bmp; frontend-react/public/assets/easy/sim_raiox.bmp; assets/Icones/sim_raiox.bmp; assets/easy/sim_raiox.bmp |
| A0028 | frontend-react/public/assets/Icones/sim_default.bmp; frontend-react/public/assets/easy/sim_default.bmp; assets/Icones/sim_default.bmp; assets/easy/sim_default.bmp |
| A0029 | assets/Bitmaps/arc_bloco_26.bmp |
| A0030 | assets/Bitmaps/arc_descal_43.bmp |
| A0031 | assets/Bitmaps/arc_fixa2_13.bmp |
| A0032 | assets/Bitmaps/arc_capeamento_37.bmp |
| A0033 | assets/Bitmaps/arc_bandagem_11.bmp |
| A0034 | assets/Bitmaps/arc_bandagem_36.bmp |
| A0035 | assets/Bitmaps/arc_canal_51.bmp |
| A0036 | assets/Bitmaps/arc_erosao_23.bmp |
| A0037 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente43.png |
| A0038 | assets/Bitmaps/arc_fixa3_16.bmp |
| A0039 | assets/Bitmaps/Dentes2d/arc_dente25.bmp |
| A0040 | frontend-react/public/assets/easy/cmd_avisos.bmp; assets/Icones/cmd_avisos.bmp; assets/easy/cmd_avisos.bmp |
| A0041 | assets/Bitmaps/arc_bloco_62.bmp |
| A0042 | assets/Bitmaps/arc_facet_41.bmp |
| A0043 | assets/Bitmaps/arc_facet_43.bmp |
| A0044 | assets/Bitmaps/arc_bloco_41.bmp |
| A0045 | frontend-react/public/assets/easy/cmd_setapreview2.bmp; assets/Icones/cmd_setapreview2.bmp; assets/easy/cmd_setapreview2.bmp |
| A0046 | frontend-react/public/assets/easy/avi_estoque.bmp; assets/Icones/avi_estoque.bmp; assets/easy/avi_estoque.bmp |
| A0047 | assets/Bitmaps/arc_bloco_14.bmp |
| A0048 | frontend-react/public/assets/easy/cmd_baixa.bmp; assets/Icones/cmd_baixa.bmp; assets/easy/cmd_baixa.bmp |
| A0049 | assets/Bitmaps/arc_bloco_65.bmp |
| A0050 | assets/Bitmaps/arc_nucleo_32.bmp |
| A0051 | assets/Bitmaps/arc_rizectomia_17.bmp |
| A0052 | assets/Bitmaps/arc_total2_i.bmp |
| A0053 | assets/Bitmaps/Dentes2d/arc_dente73a.bmp; assets/Bitmaps/arc_dente73a.bmp |
| A0054 | assets/Bitmaps/Dentes2d/arc_dente44a.bmp; assets/Bitmaps/arc_dente44a.bmp |
| A0055 | assets/Bitmaps/arc_facet_42.bmp |
| A0056 | assets/Bitmaps/arc_total2_s.bmp |
| A0057 | assets/Bitmaps/arc_fixa3_32.bmp |
| A0058 | frontend-react/public/assets/easy/dia_supranum.bmp; assets/Icones/dia_supranum.bmp; assets/easy/dia_supranum.bmp |
| A0059 | assets/Bitmaps/arc_erosao_22.bmp |
| A0060 | assets/Bitmaps/arc_bandagem_18.bmp |
| A0061 | assets/Bitmaps/arc_facet_27.bmp |
| A0062 | assets/Bitmaps/arc_nucleo_36.bmp |
| A0063 | frontend-react/public/assets/Icones/sim_ajuste.bmp; frontend-react/public/assets/easy/sim_ajuste.bmp; assets/Icones/sim_ajuste.bmp; assets/easy/sim_ajuste.bmp |
| A0064 | assets/Bitmaps/arc_fixa3_24.bmp |
| A0065 | assets/Bitmaps/Dentes3d/arc_dente55.bmp; assets/Bitmaps/arc_dente55.bmp; assets/easy/dentes/arc_dente55.bmp |
| A0066 | assets/Bitmaps/arc_radi_14.bmp |
| A0067 | assets/Bitmaps/arc_descal_38.bmp |
| A0068 | assets/Bitmaps/arc_descal_34.bmp |
| A0069 | frontend-react/public/assets/easy/esp_Odontopediatria.bmp; frontend-react/public/assets/fichaClinica/odontograma/especialidades/esp_Odontopediatria.bmp; assets/Icones/esp_Odontopediatria.bmp; assets/easy/esp_Odontopediatria.bmp |
| A0070 | assets/Bitmaps/arc_bloco_75.bmp |
| A0071 | assets/Bitmaps/arc_fluor_47.bmp |
| A0072 | frontend-react/public/assets/easy/cmd_falar.bmp; assets/Icones/cmd_falar.bmp; assets/easy/cmd_falar.bmp |
| A0073 | assets/Bitmaps/Dentes2d/arc_dente32b.bmp; assets/Bitmaps/arc_dente32b.bmp |
| A0074 | assets/Bitmaps/arc_canal_13.bmp |
| A0075 | frontend-react/public/assets/fichaClinica/toolbar/ico_orcamento.png |
| A0076 | frontend-react/public/assets/easy/int_bran.bmp; assets/Icones/int_bran.bmp; assets/easy/int_bran.bmp |
| A0077 | assets/Bitmaps/arc_lesao_12.bmp |
| A0078 | assets/Bitmaps/arc_descal_18.bmp |
| A0079 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente14.png |
| A0080 | assets/Bitmaps/arc_radi_17.bmp |
| A0081 | assets/Bitmaps/arc_descal_13.bmp |
| A0082 | assets/Bitmaps/Dentes2d/arc_dente35.bmp |
| A0083 | frontend-react/public/assets/fichaClinica/toolbar/ico_odonto_imprime.png; assets/images/ico_odonto_imprime.png |
| A0084 | assets/Bitmaps/arc_fluor_22.bmp |
| A0085 | assets/Bitmaps/arc_fixa2_37.bmp |
| A0086 | frontend-react/public/assets/easy/esp_Gerais.bmp; frontend-react/public/assets/fichaClinica/odontograma/especialidades/esp_Gerais.bmp; assets/Icones/esp_Gerais.bmp; assets/easy/esp_Gerais.bmp |
| A0087 | assets/Bitmaps/arc_nucleo_72.bmp |
| A0088 | assets/Bitmaps/arc_capeamento_47.bmp |
| A0089 | assets/Bitmaps/arc_coroa_43.bmp |
| A0090 | assets/Bitmaps/arc_erosao_14.bmp |
| A0091 | assets/Bitmaps/Dentes2d/arc_dente38a.bmp; assets/Bitmaps/Dentes2d/arc_dente38b.bmp; assets/Bitmaps/arc_dente38a.bmp; assets/Bitmaps/arc_dente38b.bmp |
| A0092 | assets/Bitmaps/arc_descal_37.bmp |
| A0093 | assets/Bitmaps/arc_radi_26.bmp |
| A0094 | assets/Bitmaps/arc_fixa2_46.bmp |
| A0095 | assets/Bitmaps/Dentes2d/arc_dente14b.bmp; assets/Bitmaps/arc_dente14b.bmp |
| A0096 | assets/Bitmaps/arc_descal_46.bmp |
| A0097 | assets/Bitmaps/Dentes2d/arc_dente21b.bmp; assets/Bitmaps/arc_dente21b.bmp |
| A0098 | assets/Bitmaps/arc_fixa3_33.bmp |
| A0099 | assets/Bitmaps/arc_fixa2_34.bmp |
| A0100 | assets/Bitmaps/Dentes2d/arc_dente11.bmp |
| A0101 | assets/Bitmaps/arc_fixa2_48.bmp |
| A0102 | assets/Bitmaps/Dentes2d/arc_dente26a.bmp; assets/Bitmaps/Dentes2d/arc_dente26b.bmp; assets/Bitmaps/arc_dente26a.bmp; assets/Bitmaps/arc_dente26b.bmp |
| A0103 | assets/Bitmaps/arc_coroa_24.bmp |
| A0104 | assets/Bitmaps/arc_canal_72.bmp |
| A0105 | frontend-react/public/assets/Icones/sim_bra.bmp; frontend-react/public/assets/easy/sim_bra.bmp; assets/Icones/sim_bra.bmp; assets/easy/sim_bra.bmp |
| A0106 | assets/Bitmaps/arc_coroa_14.bmp |
| A0107 | assets/Bitmaps/arc_trep_38.bmp |
| A0108 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente27.png |
| A0109 | frontend-react/public/assets/easy/cmd_receita.bmp; assets/Icones/cmd_receita.bmp; assets/easy/cmd_receita.bmp |
| A0110 | assets/Bitmaps/Dentes2d/arc_dente11b.bmp; assets/Bitmaps/arc_dente11b.bmp |
| A0111 | assets/Bitmaps/arc_canal_71.bmp |
| A0112 | frontend-react/public/assets/easy/cmd_fichapes.bmp; assets/Icones/cmd_fichapes.bmp; assets/easy/cmd_fichapes.bmp |
| A0113 | assets/Bitmaps/arc_facet_37.bmp |
| A0114 | assets/Bitmaps/arc_fissu_34.bmp |
| A0115 | assets/Bitmaps/arc_coroa_42.bmp |
| A0116 | assets/Bitmaps/arc_canal_75.bmp |
| A0117 | frontend-react/public/assets/easy/int_provele.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_provele.bmp; assets/Icones/int_provele.bmp; assets/easy/int_provele.bmp |
| A0118 | assets/Bitmaps/arc_fissu_12.bmp |
| A0119 | frontend-react/public/assets/easy/cmd_novotra.bmp; assets/Icones/cmd_novotra.bmp; assets/easy/cmd_novotra.bmp |
| A0120 | assets/Bitmaps/arc_fixa1_48.bmp |
| A0121 | frontend-react/public/assets/easy/cmd_previous.bmp; assets/Icones/cmd_previous.bmp; assets/easy/cmd_previous.bmp |
| A0122 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente46.bmp; assets/Bitmaps/Dentes3d/arc_dente46.bmp; assets/Bitmaps/arc_dente46.bmp; assets/easy/dentes/arc_dente46.bmp |
| A0123 | assets/Bitmaps/arc_fissu_42.bmp |
| A0124 | assets/Bitmaps/arc_lesao_14.bmp |
| A0125 | assets/Bitmaps/arc_fluor_31.bmp |
| A0126 | assets/Bitmaps/arc_bloco_17.bmp |
| A0127 | assets/Bitmaps/arc_descal_48.bmp |
| A0128 | assets/images/int_ulecto.bmp |
| A0129 | assets/Bitmaps/arc_radi_18.bmp |
| A0130 | assets/Bitmaps/arc_bandagem_37.bmp; assets/Bitmaps/arc_bandagem_38.bmp; assets/Bitmaps/arc_bandagem_47.bmp |
| A0131 | assets/Bitmaps/Dentes2d/arc_dente83.bmp |
| A0132 | frontend-react/public/assets/Icones/sim_simb10.bmp; frontend-react/public/assets/easy/sim_simb10.bmp; assets/Icones/sim_simb10.bmp; assets/easy/sim_simb10.bmp |
| A0133 | frontend-react/public/assets/easy/dia_impactado.bmp; assets/Icones/dia_impactado.bmp; assets/easy/dia_impactado.bmp |
| A0134 | assets/Bitmaps/arc_fissu_28.bmp |
| A0135 | assets/Bitmaps/placa.bmp |
| A0136 | assets/Bitmaps/arc_fissu_46.bmp |
| A0137 | assets/Bitmaps/arc_canal_83.bmp |
| A0138 | frontend-react/public/assets/Icones/sim_simb36.bmp; frontend-react/public/assets/easy/sim_simb36.bmp; assets/Icones/sim_simb36.bmp; assets/easy/sim_simb36.bmp |
| A0139 | frontend-react/public/assets/easy/cmd_imprime.bmp; assets/Icones/cmd_imprime.bmp; assets/easy/cmd_imprime.bmp |
| A0140 | frontend-react/public/assets/easy/ico_quest.bmp; assets/Icones/ico_quest.bmp; assets/easy/ico_quest.bmp |
| A0141 | assets/Bitmaps/arc_nucleo_73.bmp |
| A0142 | assets/Bitmaps/arc_nucleo_38.bmp |
| A0143 | assets/Bitmaps/arc_lesao_28.bmp |
| A0144 | assets/Bitmaps/arc_nucleo_71.bmp |
| A0145 | frontend-react/public/assets/easy/int_fluor.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_fluor.bmp; assets/Bitmaps/ger_fluor.bmp; assets/Icones/int_fluor.bmp; assets/easy/int_fluor.bmp |
| A0146 | assets/Bitmaps/arc_radi_24.bmp |
| A0147 | frontend-react/public/assets/easy/int_escova.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_escova.bmp; assets/Icones/int_escova.bmp; assets/easy/int_escova.bmp |
| A0148 | frontend-react/public/assets/easy/dia_extrusao.bmp; assets/Icones/dia_extrusao.bmp; assets/easy/dia_extrusao.bmp |
| A0149 | assets/Bitmaps/arc_trep_41.bmp |
| A0150 | assets/Bitmaps/Dentes3d/arc_dente73.bmp; assets/Bitmaps/arc_dente73.bmp; assets/easy/dentes/arc_dente73.bmp |
| A0151 | frontend-react/public/assets/Icones/sim_simb33.bmp; frontend-react/public/assets/easy/sim_simb33.bmp; assets/Icones/sim_simb33.bmp; assets/easy/sim_simb33.bmp |
| A0152 | assets/Bitmaps/arc_trep_21.bmp |
| A0153 | assets/Bitmaps/arc_apicecto_s.bmp |
| A0154 | assets/Bitmaps/arc_gengivecto_s.bmp |
| A0155 | assets/Bitmaps/arc_fixa2_26.bmp |
| A0156 | assets/Bitmaps/arc_canal_41.bmp |
| A0157 | frontend-react/public/assets/easy/int_ulecto.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_ulecto.bmp; assets/Icones/int_ulecto.bmp; assets/easy/int_ulecto.bmp |
| A0158 | frontend-react/public/assets/easy/int_coroa.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_coroa.bmp; assets/Icones/int_coroa.bmp; assets/easy/int_coroa.bmp |
| A0159 | assets/images/int_apicecto.bmp |
| A0160 | assets/Bitmaps/arc_fixa3_25.bmp |
| A0161 | frontend-react/public/assets/easy/avi_receber.bmp; assets/Icones/avi_receber.bmp; assets/easy/avi_receber.bmp |
| A0162 | assets/Bitmaps/arc_lesao_41.bmp; assets/Bitmaps/arc_lesao_42.bmp |
| A0163 | assets/Bitmaps/arc_fixa1_22.bmp |
| A0164 | frontend-react/public/assets/easy/cmd_detalhes.bmp; assets/Icones/cmd_detalhes.bmp; assets/easy/cmd_detalhes.bmp |
| A0165 | assets/Bitmaps/Dentes2d/arc_dente17.bmp |
| A0166 | assets/Bitmaps/Dentes3d/arc_dente61.bmp; assets/Bitmaps/arc_dente61.bmp; assets/easy/dentes/arc_dente61.bmp |
| A0167 | assets/Bitmaps/arc_bloco_18.bmp |
| A0168 | assets/Bitmaps/arc_remov3_s.bmp |
| A0169 | assets/Bitmaps/arc_bloco_28.bmp |
| A0170 | assets/Bitmaps/arc_bloco_63.bmp |
| A0171 | assets/Bitmaps/arc_coroa_71.bmp |
| A0172 | assets/Bitmaps/arc_coroa_51.bmp |
| A0173 | assets/Bitmaps/arc_rizectomia_47.bmp |
| A0174 | assets/Bitmaps/arc_nucleo_31.bmp |
| A0175 | frontend-react/public/assets/easy/cmd_menupac.bmp; assets/Icones/cmd_menupac.bmp; assets/easy/cmd_menupac.bmp |
| A0176 | assets/Bitmaps/arc_nucleo_47.bmp |
| A0177 | frontend-react/public/assets/easy/cmd_padrao.bmp; assets/Icones/cmd_padrao.bmp; assets/easy/cmd_padrao.bmp |
| A0178 | assets/Bitmaps/arc_remov2_i.bmp |
| A0179 | frontend-react/public/assets/easy/int_manuten.bmp; assets/Bitmaps/ger_manutencao.bmp; assets/Icones/int_manuten.bmp; assets/easy/int_manuten.bmp |
| A0180 | frontend-react/public/assets/easy/cmd_capture.bmp; assets/Icones/cmd_capture.bmp; assets/easy/cmd_capture.bmp |
| A0181 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente24.bmp; assets/Bitmaps/Dentes3d/arc_dente24.bmp; assets/Bitmaps/arc_dente24.bmp; assets/easy/dentes/arc_dente24.bmp |
| A0182 | assets/Bitmaps/arc_lesao_22.bmp |
| A0183 | assets/Bitmaps/arc_fissu_45.bmp |
| A0184 | frontend-react/public/assets/easy/int_canal.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_canal.bmp; assets/Icones/int_canal.bmp; assets/easy/int_canal.bmp |
| A0185 | assets/Bitmaps/arc_fixa1_32.bmp |
| A0186 | frontend-react/public/assets/easy/arc_faces.bmp; frontend-react/public/assets/fichaClinica/odontograma/arc_faces.bmp; assets/Bitmaps/arc_faces.bmp; assets/easy/arc_faces.bmp |
| A0187 | assets/Bitmaps/arc_fixa1_11.bmp |
| A0188 | assets/Bitmaps/arc_nucleo_51.bmp |
| A0189 | frontend-react/public/assets/easy/int_RestO.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_RestO.bmp; assets/Icones/int_RestO.bmp; assets/easy/int_RestO.bmp |
| A0190 | frontend-react/public/assets/easy/cmd_reajusta.bmp; assets/Icones/cmd_reajusta.bmp; assets/easy/cmd_reajusta.bmp |
| A0191 | frontend-react/public/assets/easy/cmd_gravatodas.bmp; assets/Icones/cmd_gravatodas.bmp; assets/easy/cmd_gravatodas.bmp |
| A0192 | assets/Bitmaps/arc_gengivecto_i.bmp |
| A0193 | assets/Bitmaps/arc_nucleo_17.bmp |
| A0194 | assets/Bitmaps/arc_total3_s.bmp |
| A0195 | assets/Bitmaps/Dentes2d/arc_dente53.bmp |
| A0196 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente38.png |
| A0197 | assets/Bitmaps/Dentes3d/arc_dente62.bmp; assets/Bitmaps/arc_dente62.bmp; assets/easy/dentes/arc_dente62.bmp |
| A0198 | assets/Bitmaps/Dentes2d/arc_dente23b.bmp; assets/Bitmaps/arc_dente23b.bmp |
| A0199 | assets/Bitmaps/arc_canal_33.bmp |
| A0200 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente48.bmp; assets/Bitmaps/Dentes3d/arc_dente48.bmp; assets/Bitmaps/arc_dente48.bmp; assets/easy/dentes/arc_dente48.bmp |
| A0201 | assets/Bitmaps/arc_fixa1_16.bmp |
| A0202 | frontend-react/public/assets/Icones/sim_simb3.bmp; frontend-react/public/assets/easy/sim_simb3.bmp; assets/Icones/sim_simb3.bmp; assets/easy/sim_simb3.bmp |
| A0203 | assets/Bitmaps/Dentes3d/arc_dente71.bmp; assets/Bitmaps/Dentes3d/arc_dente72.bmp; assets/Bitmaps/arc_dente71.bmp; assets/Bitmaps/arc_dente72.bmp; assets/easy/dentes/arc_dente71.bmp; assets/easy/dentes/arc_dente72.bmp |
| A0204 | assets/images/int_cirur.bmp |
| A0205 | frontend-react/public/assets/easy/cmd_calendario.bmp; assets/Icones/cmd_calendario.bmp; assets/easy/cmd_calendario.bmp |
| A0206 | assets/Bitmaps/Dentes2d/arc_dente53a.bmp; assets/Bitmaps/arc_dente53a.bmp |
| A0207 | assets/Bitmaps/arc_radi_23.bmp |
| A0208 | assets/Bitmaps/arc_extru_s.bmp |
| A0209 | assets/Bitmaps/arc_fixa1_26.bmp |
| A0210 | assets/Bitmaps/arc_erosao_16.bmp |
| A0211 | assets/Bitmaps/arc_fissu_11.bmp |
| A0212 | assets/Bitmaps/arc_coroa_83.bmp |
| A0213 | assets/Bitmaps/arc_nucleo_81.bmp |
| A0214 | assets/Bitmaps/arc_coroa_52.bmp |
| A0215 | assets/Bitmaps/arc_capeamento_11.bmp |
| A0216 | assets/Bitmaps/arc_bandagem_28.bmp |
| A0217 | frontend-react/public/assets/Icones/sim_simb19.bmp; frontend-react/public/assets/easy/sim_simb19.bmp; assets/Icones/sim_simb19.bmp; assets/easy/sim_simb19.bmp |
| A0218 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente34.bmp; assets/Bitmaps/Dentes3d/arc_dente34.bmp; assets/Bitmaps/arc_dente34.bmp; assets/easy/dentes/arc_dente34.bmp |
| A0219 | assets/Bitmaps/arc_canal_16.bmp |
| A0220 | assets/Bitmaps/arc_canal_43.bmp |
| A0221 | frontend-react/public/assets/easy/int_RestDO.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_RestDO.bmp; assets/Icones/int_RestDO.bmp; assets/easy/int_RestDO.bmp |
| A0222 | assets/Bitmaps/arc_descal_31.bmp |
| A0223 | assets/Bitmaps/Dentes3d/arc_dente64.bmp; assets/Bitmaps/arc_dente64.bmp; assets/easy/dentes/arc_dente64.bmp |
| A0224 | assets/Bitmaps/arc_fissu_26.bmp |
| A0225 | assets/Bitmaps/arc_erosao_21.bmp |
| A0226 | assets/Bitmaps/arc_trep_44.bmp |
| A0227 | assets/Bitmaps/arc_fissu_23.bmp |
| A0228 | assets/Bitmaps/Dentes2d/arc_dente12.bmp |
| A0229 | assets/Bitmaps/arc_fixa3_12.bmp |
| A0230 | assets/Bitmaps/arc_rizectomia_45.bmp |
| A0231 | assets/Bitmaps/arc_radi_16.bmp |
| A0232 | frontend-react/public/assets/easy/cmd_filtra2.bmp; assets/Icones/cmd_filtra2.bmp; assets/easy/cmd_filtra2.bmp |
| A0233 | assets/images/int_mordida.bmp |
| A0234 | assets/Bitmaps/Dentes3d/arc_dente75.bmp; assets/Bitmaps/arc_dente75.bmp; assets/easy/dentes/arc_dente75.bmp |
| A0235 | frontend-react/public/assets/fichaClinica/toolbar/ico_dashboard_novo.png |
| A0236 | assets/Bitmaps/arc_lesao_27.bmp |
| A0237 | assets/Bitmaps/arc_fluor_46.bmp |
| A0238 | assets/Bitmaps/arc_nucleo_84.bmp |
| A0239 | assets/Bitmaps/arc_nucleo_35.bmp |
| A0240 | assets/Bitmaps/arc_mantenedor_i.bmp |
| A0241 | assets/Bitmaps/arc_fixa3_46.bmp |
| A0242 | frontend-react/public/assets/easy/cmd_convenio.bmp; assets/Icones/cmd_convenio.bmp; assets/easy/cmd_convenio.bmp |
| A0243 | assets/Bitmaps/arc_fixa3_47.bmp |
| A0244 | assets/Bitmaps/arc_facet_15.bmp |
| A0245 | frontend-react/public/assets/easy/esp_Periodontia.bmp; frontend-react/public/assets/fichaClinica/odontograma/especialidades/esp_Periodontia.bmp; assets/Icones/esp_Periodontia.bmp; assets/easy/esp_Periodontia.bmp |
| A0246 | assets/Bitmaps/arc_canal_65.bmp |
| A0247 | assets/Bitmaps/arc_rizectomia_15.bmp |
| A0248 | assets/Bitmaps/arc_radi_41.bmp |
| A0249 | assets/Bitmaps/arc_fissu_43.bmp |
| A0250 | assets/Bitmaps/arc_canal_48.bmp |
| A0251 | assets/Bitmaps/arc_canal_17.bmp |
| A0252 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente17.bmp; assets/Bitmaps/Dentes3d/arc_dente17.bmp; assets/Bitmaps/arc_dente17.bmp; assets/easy/dentes/arc_dente17.bmp |
| A0253 | frontend-react/public/assets/Icones/sim_simb34.bmp; frontend-react/public/assets/easy/sim_simb34.bmp; assets/Icones/sim_simb34.bmp; assets/easy/sim_simb34.bmp |
| A0254 | assets/Bitmaps/arc_lesao_31.bmp |
| A0255 | assets/Bitmaps/arc_facet_14.bmp |
| A0256 | assets/Bitmaps/arc_intru_s.bmp |
| A0257 | assets/Bitmaps/arc_fixa2_18.bmp |
| A0258 | assets/Bitmaps/arc_facet_34.bmp |
| A0259 | assets/Bitmaps/Dentes2d/arc_dente82a.bmp; assets/Bitmaps/arc_dente82a.bmp |
| A0260 | assets/Bitmaps/arc_facet_32.bmp |
| A0261 | assets/Bitmaps/arc_facet_12.bmp |
| A0262 | assets/images/int_frenec.bmp |
| A0263 | assets/Bitmaps/arc_lesao_34.bmp |
| A0264 | assets/Bitmaps/arc_canal_31.bmp |
| A0265 | frontend-react/public/assets/easy/cmd_editaint.bmp; assets/Icones/cmd_editaint.bmp; assets/easy/cmd_editaint.bmp |
| A0266 | frontend-react/public/assets/Icones/sim_simb31.bmp; frontend-react/public/assets/easy/sim_simb31.bmp; assets/Icones/sim_simb31.bmp; assets/easy/sim_simb31.bmp |
| A0267 | assets/Bitmaps/arc_fixa3_17.bmp |
| A0268 | frontend-react/public/assets/fichaClinica/toolbar/ico_trocar.png |
| A0269 | frontend-react/public/assets/easy/cmd_ccpac.bmp; assets/Icones/cmd_ccpac.bmp; assets/easy/cmd_ccpac.bmp |
| A0270 | assets/Bitmaps/arc_bandagem_14.bmp |
| A0271 | assets/Bitmaps/arc_capeamento_44.bmp |
| A0272 | assets/Bitmaps/arc_tunel_i.bmp |
| A0273 | assets/Bitmaps/Dentes2d/arc_dente46a.bmp; assets/Bitmaps/Dentes2d/arc_dente46b.bmp; assets/Bitmaps/arc_dente46a.bmp; assets/Bitmaps/arc_dente46b.bmp |
| A0274 | frontend-react/public/assets/easy/cmd_first.bmp; assets/Icones/cmd_first.bmp; assets/easy/cmd_first.bmp |
| A0275 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente16.png |
| A0276 | frontend-react/public/assets/easy/int_adesiva.bmp; assets/Icones/int_adesiva.bmp; assets/easy/int_adesiva.bmp |
| A0277 | assets/Bitmaps/arc_fixa2_43.bmp |
| A0278 | assets/Bitmaps/Dentes2d/arc_dente41.bmp |
| A0279 | frontend-react/public/assets/easy/int_remove.bmp; assets/Icones/int_remove.bmp; assets/easy/int_remove.bmp |
| A0280 | assets/Bitmaps/arc_fixa3_22.bmp |
| A0281 | assets/Bitmaps/arc_coroa_27.bmp |
| A0282 | frontend-react/public/assets/easy/cmd_procura.bmp; assets/Icones/cmd_procura.bmp; assets/easy/cmd_procura.bmp |
| A0283 | assets/Bitmaps/Dentes2d/arc_dente75.bmp |
| A0284 | assets/Bitmaps/Dentes2d/arc_dente41b.bmp; assets/Bitmaps/arc_dente41b.bmp |
| A0285 | assets/Bitmaps/Dentes2d/arc_dente27.bmp |
| A0286 | frontend-react/public/assets/Icones/sim_poli.bmp; frontend-react/public/assets/easy/sim_poli.bmp; assets/Icones/sim_poli.bmp; assets/easy/sim_poli.bmp |
| A0287 | frontend-react/public/assets/easy/int_raspagem.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_raspagem.bmp; assets/Icones/int_raspagem.bmp; assets/easy/int_raspagem.bmp |
| A0288 | assets/Bitmaps/arc_radi_28.bmp |
| A0289 | assets/Bitmaps/Dentes3d/arc_superior_mista.bmp; assets/Bitmaps/arc_superior_mista.bmp |
| A0290 | assets/Bitmaps/arc_fixa1_23.bmp |
| A0291 | assets/Bitmaps/Dentes2d/arc_dente52a.bmp; assets/Bitmaps/arc_dente52a.bmp |
| A0292 | assets/Bitmaps/arc_facet_11.bmp |
| A0293 | assets/Bitmaps/arc_nucleo_37.bmp |
| A0294 | frontend-react/public/assets/easy/cmd_copiabkp.bmp; assets/Icones/cmd_copiabkp.bmp; assets/easy/cmd_copiabkp.bmp |
| A0295 | frontend-react/public/assets/easy/int_byte.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_byte.bmp; assets/Icones/int_byte.bmp; assets/easy/int_byte.bmp |
| A0296 | assets/Bitmaps/arc_intru_i.bmp |
| A0297 | assets/Bitmaps/arc_coroa_63.bmp |
| A0298 | assets/Bitmaps/arc_descal_36.bmp |
| A0299 | assets/Bitmaps/arc_canal_52.bmp |
| A0300 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente31.bmp; assets/Bitmaps/Dentes3d/arc_dente31.bmp; assets/Bitmaps/arc_dente31.bmp; assets/easy/dentes/arc_dente31.bmp |
| A0301 | assets/Bitmaps/arc_erosao_42.bmp |
| A0302 | assets/Bitmaps/arc_fissu_13.bmp |
| A0303 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_generico03.bmp; assets/images/int_generico03.bmp |
| A0304 | assets/Bitmaps/arc_total1_i.bmp |
| A0305 | assets/Bitmaps/arc_bandagem_13.bmp |
| A0306 | assets/Bitmaps/arc_facet_17.bmp |
| A0307 | frontend-react/public/assets/easy/int_tunel.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_tunel.bmp; assets/Icones/int_tunel.bmp; assets/easy/int_tunel.bmp |
| A0308 | assets/images/ico_odontograma_toolbar_prc_favorito.png |
| A0309 | assets/Bitmaps/Dentes2d/arc_dente35a.bmp; assets/Bitmaps/arc_dente35a.bmp |
| A0310 | frontend-react/public/assets/easy/int_manut.bmp; assets/Icones/int_manut.bmp; assets/easy/int_manut.bmp |
| A0311 | frontend-react/public/assets/easy/dia_mesial.bmp; assets/Icones/dia_mesial.bmp; assets/easy/dia_mesial.bmp |
| A0312 | assets/Bitmaps/arc_girov_i.bmp; assets/Bitmaps/arc_girov_s.bmp |
| A0313 | frontend-react/public/assets/easy/cmd_baixaest.bmp; assets/Icones/cmd_baixaest.bmp; assets/easy/cmd_baixaest.bmp |
| A0314 | assets/Bitmaps/arc_erosao_27.bmp |
| A0315 | frontend-react/public/assets/easy/ico_debito.bmp; assets/Icones/ico_debito.bmp; assets/easy/ico_debito.bmp |
| A0316 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente23.png |
| A0317 | frontend-react/public/assets/fichaClinica/icon_combo.png |
| A0318 | assets/Bitmaps/arc_fluor_18.bmp |
| A0319 | assets/Bitmaps/arc_rizectomia_25.bmp |
| A0320 | frontend-react/public/assets/easy/int_nucleo.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_nucleo.bmp; assets/Icones/int_nucleo.bmp; assets/easy/int_nucleo.bmp |
| A0321 | assets/Bitmaps/arc_nucleo_65.bmp |
| A0322 | frontend-react/public/assets/fichaClinica/odontograma/especialidades/esp_Protese.bmp; frontend-react/public/assets/easy/esp_Prótese.bmp; assets/Icones/esp_Prótese.bmp; assets/easy/esp_Prótese.bmp |
| A0323 | assets/Bitmaps/arc_facet_22.bmp |
| A0324 | frontend-react/public/assets/easy/int_fotos.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_fotos.bmp; assets/Bitmaps/ger_fotos.bmp; assets/Icones/int_fotos.bmp; assets/easy/int_fotos.bmp |
| A0325 | assets/Bitmaps/arc_bloco_11.bmp |
| A0326 | assets/Bitmaps/arc_canal_25.bmp |
| A0327 | assets/Bitmaps/arc_nucleo_53.bmp |
| A0328 | assets/Bitmaps/Dentes2d/arc_dente75a.bmp; assets/Bitmaps/arc_dente75a.bmp |
| A0329 | frontend-react/public/assets/fichaClinica/odontograma/especialidades/esp_Prevencao.bmp; frontend-react/public/assets/easy/esp_Prevenção.bmp; assets/Icones/esp_Prevenção.bmp; assets/easy/esp_Prevenção.bmp |
| A0330 | assets/Bitmaps/Dentes2d/arc_dente22.bmp |
| A0331 | frontend-react/public/assets/easy/cmd_cnfindice.bmp; assets/Icones/cmd_cnfindice.bmp; assets/easy/cmd_cnfindice.bmp |
| A0332 | assets/Bitmaps/Dentes3d/arc_dente51.bmp; assets/Bitmaps/arc_dente51.bmp; assets/easy/dentes/arc_dente51.bmp |
| A0333 | frontend-react/public/assets/easy/cmd_nao.bmp; assets/Icones/cmd_nao.bmp; assets/easy/cmd_nao.bmp |
| A0334 | assets/Bitmaps/arc_fixa2_22.bmp |
| A0335 | assets/Bitmaps/arc_migdir.bmp |
| A0336 | assets/Bitmaps/Dentes2d/arc_dente43.bmp |
| A0337 | frontend-react/public/assets/easy/int_aumen.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_aumen.bmp; assets/Icones/int_aumen.bmp; assets/easy/int_aumen.bmp |
| A0338 | assets/Bitmaps/arc_radi_32.bmp |
| A0339 | frontend-react/public/assets/easy/ico_alerta.bmp; assets/Icones/ico_alerta.bmp; assets/easy/ico_alerta.bmp |
| A0340 | frontend-react/public/assets/easy/int_attach.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_attach.bmp; assets/Icones/int_attach.bmp; assets/easy/int_attach.bmp |
| A0341 | assets/Bitmaps/arc_descal_14.bmp |
| A0342 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente16.bmp; assets/Bitmaps/Dentes3d/arc_dente16.bmp; assets/Bitmaps/arc_dente16.bmp; assets/easy/dentes/arc_dente16.bmp |
| A0343 | frontend-react/public/assets/easy/cmd_filtra.bmp; assets/Icones/cmd_filtra.bmp; assets/easy/cmd_filtra.bmp |
| A0344 | frontend-react/public/assets/easy/int_apicecto.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_apicecto.bmp; assets/Icones/int_apicecto.bmp; assets/easy/int_apicecto.bmp |
| A0345 | assets/Bitmaps/arc_descal_22.bmp |
| A0346 | assets/Bitmaps/arc_nucleo_42.bmp |
| A0347 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente45.bmp; assets/Bitmaps/Dentes3d/arc_dente45.bmp; assets/Bitmaps/arc_dente45.bmp; assets/easy/dentes/arc_dente45.bmp |
| A0348 | assets/Bitmaps/arc_lesao_25.bmp |
| A0349 | assets/Bitmaps/Dentes2d/arc_dente42a.bmp; assets/Bitmaps/arc_dente42a.bmp |
| A0350 | assets/Bitmaps/arc_canal_73.bmp |
| A0351 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente44.png |
| A0352 | assets/Bitmaps/arc_radi_33.bmp |
| A0353 | assets/Bitmaps/Dentes2d/arc_dente26.bmp |
| A0354 | assets/Bitmaps/Dentes2d/arc_dente61.bmp |
| A0355 | assets/Bitmaps/Dentes2d/arc_dente17a.bmp; assets/Bitmaps/Dentes2d/arc_dente17b.bmp; assets/Bitmaps/arc_dente17a.bmp; assets/Bitmaps/arc_dente17b.bmp |
| A0356 | frontend-react/public/assets/easy/dia_auscoroa.bmp; assets/Icones/dia_auscoroa.bmp; assets/easy/dia_auscoroa.bmp |
| A0357 | frontend-react/public/assets/easy/int_protese.bmp; assets/Bitmaps/ger_protese.bmp; assets/Icones/int_protese.bmp; assets/easy/int_protese.bmp |
| A0358 | frontend-react/public/assets/easy/int_total.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_total.bmp; assets/Icones/int_total.bmp; assets/easy/int_total.bmp |
| A0359 | assets/Bitmaps/arc_canal_12.bmp |
| A0360 | assets/Bitmaps/arc_canal_18.bmp |
| A0361 | assets/Bitmaps/arc_lesao_16.bmp |
| A0362 | frontend-react/public/assets/easy/cmd_aviso.bmp; assets/Icones/cmd_aviso.bmp; assets/easy/cmd_aviso.bmp |
| A0363 | assets/Bitmaps/arc_fissu_33.bmp |
| A0364 | frontend-react/public/assets/Icones/sim_face_40.bmp; frontend-react/public/assets/easy/sim_face_40.bmp; assets/Icones/sim_face_40.bmp; assets/easy/sim_face_40.bmp |
| A0365 | assets/Bitmaps/arc_bandagem_25.bmp |
| A0366 | frontend-react/public/assets/fichaClinica/odontograma/estetica.png |
| A0367 | assets/Bitmaps/Dentes3d/arc_dente82.bmp; assets/Bitmaps/arc_dente82.bmp; assets/easy/dentes/arc_dente82.bmp |
| A0368 | frontend-react/public/assets/Icones/sim_simb25.bmp; frontend-react/public/assets/easy/sim_simb25.bmp; assets/Icones/sim_simb25.bmp; assets/easy/sim_simb25.bmp |
| A0369 | assets/Bitmaps/arc_radi_43.bmp |
| A0370 | assets/Bitmaps/arc_coroa_61.bmp |
| A0371 | assets/Bitmaps/arc_lesao_24.bmp |
| A0372 | assets/Bitmaps/arc_nucleo_61.bmp |
| A0373 | assets/Bitmaps/arc_radi_38.bmp |
| A0374 | assets/Bitmaps/Dentes2d/arc_dente83a.bmp; assets/Bitmaps/arc_dente83a.bmp |
| A0375 | assets/Bitmaps/arc_bloco_53.bmp |
| A0376 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_biop_mand.png; assets/images/int_biop_mand.png |
| A0377 | assets/Bitmaps/arc_rizectomia_24.bmp |
| A0378 | assets/Icones/ico_alert.ico |
| A0379 | assets/Bitmaps/arc_nucleo_52.bmp |
| A0380 | assets/Bitmaps/arc_apicecto_i.bmp |
| A0381 | assets/Bitmaps/arc_capeamento_21.bmp |
| A0382 | assets/Bitmaps/arc_erosao_47.bmp |
| A0383 | assets/Bitmaps/arc_coroa_45.bmp |
| A0384 | assets/Bitmaps/arc_fixa1_37.bmp |
| A0385 | assets/Bitmaps/arc_erosao_41.bmp |
| A0386 | assets/Bitmaps/arc_mantenedor_s.bmp |
| A0387 | assets/Bitmaps/Dentes2d/arc_dente62.bmp |
| A0388 | frontend-react/public/assets/fichaClinica/odontograma/ciruriga.png |
| A0389 | assets/Bitmaps/Dentes2d/arc_dente46.bmp |
| A0390 | frontend-react/public/assets/fichaClinica/toolbar/ico_menu_odontograma.png |
| A0391 | frontend-react/public/assets/Icones/sim_modelo.bmp; frontend-react/public/assets/easy/sim_modelo.bmp; assets/Icones/sim_modelo.bmp; assets/easy/sim_modelo.bmp |
| A0392 | frontend-react/public/assets/fichaClinica/toolbar/ico_odontograma_toolbar_prc_pesquisa.png; assets/images/ico_odontograma_toolbar_prc_pesquisa.png |
| A0393 | assets/Bitmaps/arc_capeamento_22.bmp |
| A0394 | frontend-react/public/assets/easy/int_faceta.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_faceta.bmp; assets/Icones/int_faceta.bmp; assets/easy/int_faceta.bmp |
| A0395 | assets/Bitmaps/arc_facet_48.bmp |
| A0396 | assets/Bitmaps/arc_fixa3_36.bmp |
| A0397 | assets/Bitmaps/arc_capeamento_43.bmp |
| A0398 | frontend-react/public/assets/easy/int_hemi.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_hemi.bmp; assets/Icones/int_hemi.bmp; assets/easy/int_hemi.bmp |
| A0399 | assets/Bitmaps/Dentes2d/arc_inferior_mista.bmp |
| A0400 | assets/Bitmaps/arc_lesao_13.bmp |
| A0401 | assets/Bitmaps/arc_rizectomia_26.bmp |
| A0402 | assets/Bitmaps/arc_coroa_41.bmp |
| A0403 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente36.png |
| A0404 | assets/Bitmaps/arc_coroa_17.bmp |
| A0405 | assets/Bitmaps/arc_descal_16.bmp |
| A0406 | assets/images/int_rizec.bmp |
| A0407 | assets/Bitmaps/arc_canal_54.bmp |
| A0408 | assets/Bitmaps/arc_coroa_73.bmp |
| A0409 | assets/Bitmaps/arc_bandagem_34.bmp |
| A0410 | assets/Bitmaps/arc_bloco_32.bmp |
| A0411 | assets/Bitmaps/arc_lesao_18.bmp |
| A0412 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente45.png |
| A0413 | assets/Bitmaps/arc_fixa2_23.bmp |
| A0414 | assets/Bitmaps/arc_canal_81.bmp |
| A0415 | frontend-react/public/assets/Icones/sim_simb21.bmp; frontend-react/public/assets/easy/sim_simb21.bmp; assets/Icones/sim_simb21.bmp; assets/easy/sim_simb21.bmp |
| A0416 | assets/Bitmaps/arc_facet_35.bmp |
| A0417 | assets/Bitmaps/arc_supra_i.bmp |
| A0418 | frontend-react/public/assets/easy/ico_check.bmp; assets/Icones/ico_check.bmp; assets/easy/ico_check.bmp |
| A0419 | frontend-react/public/assets/fichaClinica/toolbar/ico_select.png |
| A0420 | frontend-react/public/assets/Icones/sim_rx.bmp; frontend-react/public/assets/easy/sim_rx.bmp; assets/Icones/sim_rx.bmp; assets/easy/sim_rx.bmp |
| A0421 | assets/Bitmaps/arc_nucleo_83.bmp |
| A0422 | frontend-react/public/assets/easy/cmd_testa.bmp; assets/Icones/cmd_testa.bmp; assets/easy/cmd_testa.bmp |
| A0423 | assets/Bitmaps/arc_canal_32.bmp |
| A0424 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente25.bmp; assets/Bitmaps/Dentes3d/arc_dente25.bmp; assets/Bitmaps/arc_dente25.bmp; assets/easy/dentes/arc_dente25.bmp |
| A0425 | frontend-react/public/assets/easy/ico_foto.bmp; assets/Icones/ico_foto.bmp; assets/easy/ico_foto.bmp |
| A0426 | frontend-react/public/assets/easy/cmd_campo.bmp; assets/Icones/cmd_campo.bmp; assets/easy/cmd_campo.bmp |
| A0427 | assets/Bitmaps/arc_bloco_35.bmp |
| A0428 | assets/Bitmaps/arc_fixa3_37.bmp |
| A0429 | assets/images/int_raspagem.bmp |
| A0430 | assets/Bitmaps/arc_facet_16.bmp |
| A0431 | assets/Bitmaps/arc_trep_13.bmp |
| A0432 | frontend-react/public/assets/easy/cmd_bloqueia.bmp; assets/Icones/cmd_bloqueia.bmp; assets/easy/cmd_bloqueia.bmp |
| A0433 | assets/Bitmaps/arc_bloco_24.bmp |
| A0434 | assets/Bitmaps/arc_nucleo_18.bmp |
| A0435 | assets/Bitmaps/arc_canal_47.bmp |
| A0436 | assets/Bitmaps/Dentes3d/arc_dente65.bmp; assets/Bitmaps/arc_dente65.bmp; assets/easy/dentes/arc_dente65.bmp |
| A0437 | assets/Bitmaps/Dentes3d/arc_dente63.bmp; assets/Bitmaps/arc_dente63.bmp; assets/easy/dentes/arc_dente63.bmp |
| A0438 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente15.png |
| A0439 | assets/Bitmaps/arc_bloco_51.bmp |
| A0440 | assets/Bitmaps/arc_fluor_38.bmp |
| A0441 | assets/Bitmaps/arc_bloco_72.bmp |
| A0442 | assets/Bitmaps/arc_rizectomia_44.bmp |
| A0443 | assets/Bitmaps/arc_radi_46.bmp |
| A0444 | frontend-react/public/assets/Icones/sim_simb20.bmp; frontend-react/public/assets/easy/sim_simb20.bmp; assets/Icones/sim_simb20.bmp; assets/easy/sim_simb20.bmp |
| A0445 | assets/Bitmaps/Dentes2d/arc_dente74.bmp |
| A0446 | assets/Bitmaps/arc_capeamento_15.bmp |
| A0447 | assets/Bitmaps/arc_coroa_75.bmp |
| A0448 | assets/Bitmaps/arc_radi_21.bmp |
| A0449 | assets/Bitmaps/arc_facet_44.bmp |
| A0450 | assets/Bitmaps/arc_nucleo_82.bmp |
| A0451 | assets/Bitmaps/Dentes2d/arc_dente28a.bmp; assets/Bitmaps/Dentes2d/arc_dente28b.bmp; assets/Bitmaps/arc_dente28a.bmp; assets/Bitmaps/arc_dente28b.bmp |
| A0452 | assets/Bitmaps/arc_trep_24.bmp |
| A0453 | assets/Bitmaps/arc_erosao_32.bmp |
| A0454 | assets/Bitmaps/Dentes2d/arc_dente31b.bmp; assets/Bitmaps/arc_dente31b.bmp |
| A0455 | frontend-react/public/assets/easy/arc_superior_perm_test.png |
| A0456 | assets/Bitmaps/arc_fissu_14.bmp |
| A0457 | assets/Bitmaps/arc_lesao_33.bmp |
| A0458 | assets/Bitmaps/arc_canal_23.bmp |
| A0459 | assets/Bitmaps/arc_bandagem_21.bmp |
| A0460 | assets/Bitmaps/arc_nucleo_12.bmp |
| A0461 | frontend-react/public/assets/easy/dia_intrusao.bmp; assets/Icones/dia_intrusao.bmp; assets/easy/dia_intrusao.bmp |
| A0462 | assets/Bitmaps/arc_fixa3_21.bmp |
| A0463 | assets/Bitmaps/arc_capeamento_33.bmp |
| A0464 | frontend-react/public/assets/easy/avi_recados.bmp; assets/Icones/avi_recados.bmp; assets/easy/avi_recados.bmp |
| A0465 | assets/Bitmaps/arc_erosao_44.bmp |
| A0466 | assets/Bitmaps/Dentes2d/arc_dente71.bmp |
| A0467 | assets/Bitmaps/Dentes2d/arc_dente63a.bmp; assets/Bitmaps/arc_dente63a.bmp |
| A0468 | assets/Bitmaps/arc_fissu_35.bmp |
| A0469 | assets/Bitmaps/arc_radi_47.bmp |
| A0470 | frontend-react/public/assets/easy/dia_giroversao.bmp; assets/Icones/dia_giroversao.bmp; assets/easy/dia_giroversao.bmp |
| A0471 | assets/Bitmaps/arc_nucleo_55.bmp |
| A0472 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente23.bmp; assets/Bitmaps/Dentes3d/arc_dente23.bmp; assets/Bitmaps/arc_dente23.bmp; assets/easy/dentes/arc_dente23.bmp |
| A0473 | assets/Bitmaps/arc_canal_26.bmp |
| A0474 | assets/Bitmaps/arc_lesao_46.bmp |
| A0475 | assets/Bitmaps/arc_fissu_17.bmp |
| A0476 | frontend-react/public/assets/Icones/sim_bra_40.bmp; frontend-react/public/assets/easy/sim_bra_40.bmp; assets/Icones/sim_bra_40.bmp; assets/easy/sim_bra_40.bmp |
| A0477 | assets/Bitmaps/Dentes2d/arc_dente33b.bmp; assets/Bitmaps/arc_dente33b.bmp |
| A0478 | assets/Bitmaps/arc_fixa3_41.bmp |
| A0479 | assets/Bitmaps/arc_radi_42.bmp |
| A0480 | assets/Bitmaps/arc_fixa1_43.bmp |
| A0481 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente42.png |
| A0482 | assets/Bitmaps/arc_lesao_38.bmp |
| A0483 | frontend-react/public/assets/Icones/sim_down.bmp; frontend-react/public/assets/easy/sim_down.bmp; assets/Icones/sim_down.bmp; assets/easy/sim_down.bmp |
| A0484 | frontend-react/public/assets/Icones/sim_simb2.bmp; frontend-react/public/assets/easy/sim_simb2.bmp; assets/Icones/sim_simb2.bmp; assets/easy/sim_simb2.bmp |
| A0485 | assets/Bitmaps/arc_fixa2_11.bmp |
| A0486 | frontend-react/public/assets/fichaClinica/odontograma/especialidades/esp_Diagnostico.bmp; frontend-react/public/assets/easy/esp_Diagnóstico.bmp; assets/Icones/esp_Diagnóstico.bmp; assets/easy/esp_Diagnóstico.bmp |
| A0487 | assets/Bitmaps/arc_facet_25.bmp |
| A0488 | assets/Bitmaps/arc_descal_44.bmp |
| A0489 | frontend-react/public/assets/easy/cmd_editor.bmp; assets/Icones/cmd_editor.bmp; assets/easy/cmd_editor.bmp |
| A0490 | frontend-react/public/assets/easy/cmd_agepes.bmp; assets/Icones/cmd_agepes.bmp; assets/easy/cmd_agepes.bmp |
| A0491 | frontend-react/public/assets/easy/ico_aniversario.bmp; assets/Icones/ico_aniversario.bmp; assets/easy/ico_aniversario.bmp |
| A0492 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente26.png |
| A0493 | assets/Bitmaps/arc_nucleo_11.bmp |
| A0494 | frontend-react/public/assets/easy/int_emerg.bmp; frontend-react/public/assets/fichaClinica/odontograma/especialidades/int_emerg.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_emerg.bmp; assets/Bitmaps/ger_emergencia.bmp; assets/Icones/int_emerg.bmp; assets/easy/int_emerg.bmp |
| A0495 | assets/Bitmaps/arc_rizectomia_28.bmp |
| A0496 | assets/Bitmaps/Dentes2d/arc_dente42b.bmp; assets/Bitmaps/arc_dente42b.bmp |
| A0497 | assets/Bitmaps/arc_fluor_36.bmp |
| A0498 | assets/Bitmaps/arc_fissu_32.bmp |
| A0499 | assets/Bitmaps/arc_trep_43.bmp |
| A0500 | assets/Bitmaps/arc_coroa_23.bmp |
| A0501 | assets/Bitmaps/Dentes2d/arc_dente32.bmp |
| A0502 | assets/Bitmaps/Dentes2d/arc_dente11a.bmp; assets/Bitmaps/arc_dente11a.bmp |
| A0503 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente11.png |
| A0504 | assets/Bitmaps/arc_capeamento_23.bmp |
| A0505 | assets/Bitmaps/arc_fixa1_33.bmp |
| A0506 | frontend-react/public/assets/Icones/sim_simb24.bmp; frontend-react/public/assets/easy/sim_simb24.bmp; assets/Icones/sim_simb24.bmp; assets/easy/sim_simb24.bmp |
| A0507 | assets/Bitmaps/Dentes2d/arc_dente21a.bmp; assets/Bitmaps/arc_dente21a.bmp |
| A0508 | assets/Bitmaps/arc_nucleo_43.bmp |
| A0509 | frontend-react/public/assets/Icones/sim_simb22.bmp; frontend-react/public/assets/easy/sim_simb22.bmp; assets/Icones/sim_simb22.bmp; assets/easy/sim_simb22.bmp |
| A0510 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_torus_palat.png; assets/images/int_torus_palat.png |
| A0511 | assets/Bitmaps/Dentes3d/arc_inferior_mista.bmp; assets/Bitmaps/arc_inferior_mista.bmp |
| A0512 | frontend-react/public/assets/easy/int_retalho.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_retalho.bmp; assets/Icones/int_retalho.bmp; assets/easy/int_retalho.bmp |
| A0513 | assets/Bitmaps/arc_lesao_45.bmp |
| A0514 | frontend-react/public/assets/easy/avi_validade.bmp; assets/Icones/avi_validade.bmp; assets/easy/avi_validade.bmp |
| A0515 | assets/Bitmaps/arc_trep_22.bmp |
| A0516 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente24.png |
| A0517 | assets/Bitmaps/arc_nucleo_34.bmp |
| A0518 | assets/Bitmaps/arc_fixa2_31.bmp |
| A0519 | assets/Bitmaps/Dentes2d/arc_dente23a.bmp; assets/Bitmaps/arc_dente23a.bmp |
| A0520 | assets/Bitmaps/Dentes2d/arc_dente12a.bmp; assets/Bitmaps/arc_dente12a.bmp |
| A0521 | assets/Bitmaps/arc_coroa_54.bmp |
| A0522 | assets/Bitmaps/arc_facet_18.bmp |
| A0523 | assets/Bitmaps/arc_fixa2_21.bmp |
| A0524 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_generico04.bmp; assets/images/int_generico04.bmp |
| A0525 | frontend-react/public/assets/easy/int_movel.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_movel.bmp; assets/Icones/int_movel.bmp; assets/easy/int_movel.bmp |
| A0526 | assets/Bitmaps/arc_bloco_42.bmp |
| A0527 | assets/Bitmaps/arc_erosao_13.bmp |
| A0528 | assets/Bitmaps/Dentes2d/arc_dente81a.bmp; assets/Bitmaps/arc_dente81a.bmp |
| A0529 | frontend-react/public/assets/easy/esp_Generico.bmp; frontend-react/public/assets/fichaClinica/odontograma/especialidades/esp_Generico.bmp; assets/Icones/esp_Generico.bmp; assets/easy/esp_Generico.bmp |
| A0530 | assets/Bitmaps/arc_bloco_21.bmp |
| A0531 | assets/Bitmaps/arc_erosao_12.bmp |
| A0532 | assets/Bitmaps/arc_trep_32.bmp |
| A0533 | frontend-react/public/assets/easy/cmd_up.bmp; assets/Icones/cmd_up.bmp; assets/easy/cmd_up.bmp |
| A0534 | assets/Bitmaps/Dentes2d/arc_dente35b.bmp; assets/Bitmaps/arc_dente35b.bmp |
| A0535 | frontend-react/public/assets/Icones/sim_simb28_40.bmp; frontend-react/public/assets/easy/sim_simb28_40.bmp; assets/Icones/sim_simb28_40.bmp; assets/easy/sim_simb28_40.bmp |
| A0536 | frontend-react/public/assets/easy/cmd_retornasemana.bmp; assets/Icones/cmd_retornasemana.bmp; assets/easy/cmd_retornasemana.bmp |
| A0537 | assets/Bitmaps/arc_trep_23.bmp |
| A0538 | assets/Bitmaps/Dentes2d/arc_dente65a.bmp; assets/Bitmaps/arc_dente65a.bmp |
| A0539 | assets/Bitmaps/Dentes3d/arc_inferior_dec.bmp; assets/Bitmaps/arc_inferior_dec.bmp |
| A0540 | frontend-react/public/assets/easy/cmd_help.bmp; assets/Icones/cmd_help.bmp; assets/easy/cmd_help.bmp |
| A0541 | assets/Bitmaps/arc_bloco_55.bmp |
| A0542 | assets/Bitmaps/arc_nucleo_75.bmp |
| A0543 | assets/Bitmaps/Dentes3d/arc_dente53.bmp; assets/Bitmaps/arc_dente53.bmp; assets/easy/dentes/arc_dente53.bmp |
| A0544 | frontend-react/public/assets/easy/cmd_backup.bmp; assets/Icones/cmd_backup.bmp; assets/easy/cmd_backup.bmp |
| A0545 | frontend-react/public/assets/easy/cmd_menuint.bmp; assets/Icones/cmd_menuint.bmp; assets/easy/cmd_menuint.bmp |
| A0546 | frontend-react/public/assets/easy/int_oclusal.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_oclusal.bmp; assets/Bitmaps/ger_oclusal.bmp; assets/Icones/int_oclusal.bmp; assets/easy/int_oclusal.bmp |
| A0547 | assets/Bitmaps/arc_fissu_21.bmp |
| A0548 | assets/Bitmaps/arc_canal_42.bmp |
| A0549 | assets/Bitmaps/arc_fixa3_23.bmp |
| A0550 | assets/Bitmaps/arc_canal_38.bmp |
| A0551 | assets/Bitmaps/arc_nucleo_24.bmp |
| A0552 | assets/Bitmaps/Dentes2d/arc_dente64a.bmp; assets/Bitmaps/arc_dente64a.bmp |
| A0553 | assets/Bitmaps/arc_fissu_25.bmp |
| A0554 | assets/Bitmaps/arc_nucleo_85.bmp |
| A0555 | frontend-react/public/assets/easy/cmd_rapido.bmp; assets/Icones/cmd_rapido.bmp; assets/easy/cmd_rapido.bmp |
| A0556 | assets/Bitmaps/arc_canal_45.bmp |
| A0557 | assets/Bitmaps/arc_erosao_34.bmp |
| A0558 | frontend-react/public/assets/easy/cmd_proxage.bmp; assets/Icones/cmd_proxage.bmp; assets/easy/cmd_proxage.bmp |
| A0559 | assets/Bitmaps/Dentes2d/arc_dente13a.bmp; assets/Bitmaps/arc_dente13a.bmp |
| A0560 | assets/Bitmaps/Dentes3d/arc_dente54.bmp; assets/Bitmaps/arc_dente54.bmp; assets/easy/dentes/arc_dente54.bmp |
| A0561 | frontend-react/public/assets/easy/cmd_fone.bmp; assets/Icones/cmd_fone.bmp; assets/easy/cmd_fone.bmp |
| A0562 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente11.bmp; assets/Bitmaps/Dentes3d/arc_dente11.bmp; assets/Bitmaps/arc_dente11.bmp; assets/easy/dentes/arc_dente11.bmp |
| A0563 | assets/Bitmaps/arc_fixa2_32.bmp |
| A0564 | assets/Bitmaps/arc_fluor_44.bmp |
| A0565 | assets/Bitmaps/Dentes2d/arc_dente42.bmp |
| A0566 | assets/Bitmaps/arc_capeamento_36.bmp |
| A0567 | assets/Bitmaps/arc_fixa2_25.bmp |
| A0568 | assets/Bitmaps/arc_canal_14.bmp |
| A0569 | assets/Bitmaps/arc_erosao_18.bmp |
| A0570 | assets/Bitmaps/arc_ades_s.bmp |
| A0571 | assets/Bitmaps/Dentes2d/arc_dente24.bmp |
| A0572 | assets/Icones/ico_quest.ico |
| A0573 | assets/Bitmaps/arc_fissu_44.bmp |
| A0574 | assets/Bitmaps/Dentes2d/arc_dente13.bmp |
| A0575 | assets/Bitmaps/arc_canal_34.bmp |
| A0576 | assets/Bitmaps/arc_bandagem_33.bmp |
| A0577 | frontend-react/public/assets/easy/avi_retorno.bmp; assets/Icones/avi_retorno.bmp; assets/easy/avi_retorno.bmp |
| A0578 | assets/Bitmaps/Dentes2d/arc_dente44.bmp |
| A0579 | assets/Bitmaps/arc_radi_37.bmp |
| A0580 | frontend-react/public/assets/easy/int_reemb.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_reemb.bmp; assets/Bitmaps/ger_reembasa.bmp; assets/Icones/int_reemb.bmp; assets/easy/int_reemb.bmp |
| A0581 | frontend-react/public/assets/easy/cmd_lixo.bmp; assets/Icones/cmd_lixo.bmp; assets/easy/cmd_lixo.bmp |
| A0582 | assets/Bitmaps/Dentes2d/arc_dente45b.bmp; assets/Bitmaps/arc_dente45b.bmp |
| A0583 | assets/Bitmaps/arc_fixa2_12.bmp |
| A0584 | assets/Bitmaps/Dentes2d/arc_dente14.bmp |
| A0585 | assets/Bitmaps/arc_bandagem_12.bmp |
| A0586 | assets/Bitmaps/arc_descal_35.bmp |
| A0587 | assets/Bitmaps/arc_coroa_47.bmp |
| A0588 | assets/Bitmaps/arc_bandagem_48.bmp |
| A0589 | assets/Bitmaps/arc_coroa_64.bmp |
| A0590 | assets/Bitmaps/Dentes2d/arc_dente36.bmp |
| A0591 | assets/Bitmaps/arc_fluor_34.bmp |
| A0592 | frontend-react/public/assets/easy/cmd_tela.bmp; assets/Icones/cmd_tela.bmp; assets/easy/cmd_tela.bmp |
| A0593 | assets/Bitmaps/arc_trep_18.bmp |
| A0594 | assets/Bitmaps/arc_fixa1_12.bmp |
| A0595 | assets/Bitmaps/arc_fixa1_21.bmp |
| A0596 | assets/Bitmaps/arc_capeamento_24.bmp |
| A0597 | frontend-react/public/assets/easy/cmd_novo.bmp; assets/Icones/cmd_novo.bmp; assets/easy/cmd_novo.bmp |
| A0598 | assets/Bitmaps/arc_radi_27.bmp |
| A0599 | assets/Bitmaps/arc_fixa1_31.bmp |
| A0600 | assets/Bitmaps/arc_fixa3_26.bmp |
| A0601 | assets/Bitmaps/arc_fixa1_28.bmp |
| A0602 | assets/Bitmaps/Dentes3d/arc_dente81.bmp; assets/Bitmaps/arc_dente81.bmp; assets/easy/dentes/arc_dente81.bmp |
| A0603 | assets/Bitmaps/arc_coroa_22.bmp |
| A0604 | assets/Bitmaps/arc_fluor_23.bmp |
| A0605 | assets/Bitmaps/Dentes2d/arc_dente38.bmp |
| A0606 | assets/Bitmaps/arc_bandagem_35.bmp |
| A0607 | assets/Bitmaps/arc_rizectomia_34.bmp |
| A0608 | assets/Bitmaps/Dentes2d/arc_inferior_perm.bmp |
| A0609 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente13.png |
| A0610 | assets/Bitmaps/arc_fixa3_45.bmp |
| A0611 | assets/Bitmaps/arc_trep_35.bmp |
| A0612 | frontend-react/public/assets/Icones/sim_simb26.bmp; frontend-react/public/assets/easy/sim_simb26.bmp; assets/Icones/sim_simb26.bmp; assets/easy/sim_simb26.bmp |
| A0613 | assets/Bitmaps/arc_descal_32.bmp |
| A0614 | frontend-react/public/assets/easy/cmd_distribui.bmp; assets/Icones/cmd_distribui.bmp; assets/easy/cmd_distribui.bmp |
| A0615 | frontend-react/public/assets/fichaClinica/toolbar/ico_novo_paciente_transp.png |
| A0616 | assets/Bitmaps/arc_bandagem_42.bmp |
| A0617 | frontend-react/public/assets/easy/avi_pagar.bmp; assets/Icones/avi_pagar.bmp; assets/easy/avi_pagar.bmp |
| A0618 | assets/Bitmaps/arc_implante_i.bmp |
| A0619 | assets/Bitmaps/arc_fluor_28.bmp |
| A0620 | assets/Bitmaps/arc_descal_26.bmp |
| A0621 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente41.bmp; assets/Bitmaps/Dentes3d/arc_dente41.bmp; assets/Bitmaps/arc_dente41.bmp; assets/easy/dentes/arc_dente41.bmp |
| A0622 | assets/Bitmaps/arc_erosao_11.bmp |
| A0623 | assets/Bitmaps/Dentes2d/arc_dente82.bmp |
| A0624 | assets/Bitmaps/arc_facet_47.bmp |
| A0625 | assets/Bitmaps/arc_capeamento_18.bmp |
| A0626 | assets/Bitmaps/arc_bloco_22.bmp |
| A0627 | assets/Bitmaps/arc_nucleo_44.bmp |
| A0628 | assets/Bitmaps/arc_fluor_27.bmp |
| A0629 | assets/Bitmaps/arc_bandagem_23.bmp |
| A0630 | assets/Bitmaps/arc_bandagem_44.bmp |
| A0631 | assets/Bitmaps/arc_canal_55.bmp |
| A0632 | frontend-react/public/assets/easy/cmd_compraest.bmp; assets/Icones/cmd_compraest.bmp; assets/easy/cmd_compraest.bmp |
| A0633 | frontend-react/public/assets/easy/int_mantene.bmp; assets/Icones/int_mantene.bmp; assets/easy/int_mantene.bmp |
| A0634 | assets/Bitmaps/arc_fixa2_47.bmp |
| A0635 | assets/Bitmaps/arc_fixa3_18.bmp |
| A0636 | assets/Bitmaps/arc_bloco_33.bmp |
| A0637 | frontend-react/public/assets/easy/cmd_recibo.bmp; assets/Icones/cmd_recibo.bmp; assets/easy/cmd_recibo.bmp |
| A0638 | assets/Bitmaps/arc_trep_15.bmp |
| A0639 | assets/Bitmaps/arc_fixa3_42.bmp |
| A0640 | assets/Bitmaps/Dentes2d/arc_dente47a.bmp; assets/Bitmaps/Dentes2d/arc_dente47b.bmp; assets/Bitmaps/arc_dente47a.bmp; assets/Bitmaps/arc_dente47b.bmp |
| A0641 | assets/Bitmaps/arc_coroa_31.bmp |
| A0642 | assets/Bitmaps/arc_bloco_15.bmp |
| A0643 | frontend-react/public/assets/easy/esp_Cirurgia.bmp; frontend-react/public/assets/fichaClinica/odontograma/especialidades/esp_Cirurgia.bmp; assets/Icones/esp_Cirurgia.bmp; assets/easy/esp_Cirurgia.bmp |
| A0644 | assets/Bitmaps/arc_canal_44.bmp |
| A0645 | assets/Bitmaps/arc_coroa_37.bmp |
| A0646 | frontend-react/public/assets/Icones/sim_simb8_40.bmp; frontend-react/public/assets/easy/sim_simb8_40.bmp; assets/Icones/sim_simb8_40.bmp; assets/easy/sim_simb8_40.bmp |
| A0647 | assets/Bitmaps/arc_bandagem_31.bmp |
| A0648 | assets/Bitmaps/arc_capeamento_38.bmp |
| A0649 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente38.bmp; assets/Bitmaps/Dentes3d/arc_dente38.bmp; assets/Bitmaps/arc_dente38.bmp; assets/easy/dentes/arc_dente38.bmp |
| A0650 | assets/Bitmaps/arc_fissu_47.bmp |
| A0651 | assets/Bitmaps/arc_nucleo_25.bmp |
| A0652 | assets/Bitmaps/arc_nucleo_54.bmp |
| A0653 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente13.bmp; assets/Bitmaps/Dentes3d/arc_dente13.bmp; assets/Bitmaps/arc_dente13.bmp; assets/easy/dentes/arc_dente13.bmp |
| A0654 | frontend-react/public/assets/fichaClinica/odontograma/dentistica.png |
| A0655 | assets/Bitmaps/Dentes2d/arc_dente71a.bmp; assets/Bitmaps/arc_dente71a.bmp |
| A0656 | assets/Bitmaps/arc_fixa2_42.bmp |
| A0657 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente35.bmp; assets/Bitmaps/Dentes3d/arc_dente35.bmp; assets/Bitmaps/arc_dente35.bmp; assets/easy/dentes/arc_dente35.bmp |
| A0658 | frontend-react/public/assets/Icones/sim_ulec.bmp; frontend-react/public/assets/easy/sim_ulec.bmp; assets/Icones/sim_ulec.bmp; assets/easy/sim_ulec.bmp |
| A0659 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente35.png |
| A0660 | assets/images/int_hemi.bmp |
| A0661 | assets/Bitmaps/arc_canal_35.bmp |
| A0662 | assets/Bitmaps/Dentes2d/arc_dente33.bmp |
| A0663 | frontend-react/public/assets/easy/cmd_remove.bmp; assets/Icones/cmd_remove.bmp; assets/easy/cmd_remove.bmp |
| A0664 | assets/Bitmaps/arc_trep_47.bmp |
| A0665 | assets/Bitmaps/arc_rizectomia_37.bmp |
| A0666 | assets/Bitmaps/arc_bloco_81.bmp |
| A0667 | assets/Bitmaps/arc_bloco_71.bmp |
| A0668 | assets/Bitmaps/arc_fissu_27.bmp |
| A0669 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente33.bmp; assets/Bitmaps/Dentes3d/arc_dente33.bmp; assets/Bitmaps/arc_dente33.bmp; assets/easy/dentes/arc_dente33.bmp |
| A0670 | assets/Bitmaps/arc_capeamento_46.bmp |
| A0671 | frontend-react/public/assets/fichaClinica/odontograma/especialidades/esp_Dentistica.bmp; frontend-react/public/assets/easy/esp_Dentística.bmp; assets/Icones/esp_Dentística.bmp; assets/easy/esp_Dentística.bmp |
| A0672 | assets/Bitmaps/arc_lesao_43.bmp |
| A0673 | assets/Bitmaps/arc_fixa1_47.bmp |
| A0674 | assets/Bitmaps/Dentes2d/arc_dente45.bmp |
| A0675 | assets/Bitmaps/Dentes2d/arc_dente14a.bmp; assets/Bitmaps/arc_dente14a.bmp |
| A0676 | assets/Bitmaps/arc_canal_62.bmp |
| A0677 | frontend-react/public/assets/Icones/sim_simb18.bmp; frontend-react/public/assets/easy/sim_simb18.bmp; assets/Icones/sim_simb18.bmp; assets/easy/sim_simb18.bmp |
| A0678 | frontend-react/public/assets/easy/int_frenec.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_frenec.bmp; assets/Bitmaps/ger_frenectomia.bmp; assets/Icones/int_frenec.bmp; assets/easy/int_frenec.bmp |
| A0679 | frontend-react/public/assets/easy/cmd_restaurabkp.bmp; assets/Icones/cmd_restaurabkp.bmp; assets/easy/cmd_restaurabkp.bmp |
| A0680 | assets/Bitmaps/arc_radi_12.bmp |
| A0681 | assets/Bitmaps/arc_coroa_11.bmp |
| A0682 | assets/Bitmaps/arc_fluor_37.bmp |
| A0683 | assets/Bitmaps/arc_fluor_15.bmp |
| A0684 | assets/Bitmaps/arc_canal_24.bmp |
| A0685 | assets/Bitmaps/arc_coroa_18.bmp |
| A0686 | frontend-react/public/assets/easy/cmd_preferencias.bmp; assets/Icones/cmd_preferencias.bmp; assets/easy/cmd_preferencias.bmp |
| A0687 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_aprof_vestib.png; assets/images/int_aprof_vestib.png |
| A0688 | assets/Bitmaps/arc_bloco_74.bmp |
| A0689 | assets/Bitmaps/arc_fluor_43.bmp |
| A0690 | assets/Bitmaps/arc_descal_27.bmp |
| A0691 | assets/Bitmaps/arc_radi_48.bmp |
| A0692 | assets/Bitmaps/arc_canal_28.bmp |
| A0693 | frontend-react/public/assets/easy/cmd_valores.bmp; assets/Icones/cmd_valores.bmp; assets/easy/cmd_valores.bmp |
| A0694 | assets/Bitmaps/Dentes2d/arc_dente15a.bmp; assets/Bitmaps/arc_dente15a.bmp |
| A0695 | assets/Bitmaps/arc_fluor_48.bmp |
| A0696 | frontend-react/public/assets/easy/ico_check_prn.bmp; assets/Icones/ico_check_prn.bmp; assets/easy/ico_check_prn.bmp |
| A0697 | assets/Bitmaps/arc_bandagem_43.bmp |
| A0698 | assets/Bitmaps/arc_fluor_14.bmp |
| A0699 | frontend-react/public/assets/easy/cmd_next.bmp; assets/Icones/cmd_next.bmp; assets/easy/cmd_next.bmp |
| A0700 | assets/Bitmaps/arc_fixa3_35.bmp |
| A0701 | assets/Bitmaps/Dentes2d/arc_dente85.bmp |
| A0702 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente44.bmp; assets/Bitmaps/Dentes3d/arc_dente44.bmp; assets/Bitmaps/arc_dente44.bmp; assets/easy/dentes/arc_dente44.bmp |
| A0703 | assets/Bitmaps/arc_capeamento_16.bmp |
| A0704 | assets/Bitmaps/arc_nucleo_28.bmp |
| A0705 | assets/Bitmaps/arc_supra_s.bmp |
| A0706 | assets/Bitmaps/Dentes2d/arc_dente84a.bmp; assets/Bitmaps/arc_dente84a.bmp |
| A0707 | frontend-react/public/assets/fichaClinica/toolbar/ico_odontograma_toolbar_prc_lupa.png; assets/images/ico_odontograma_toolbar_prc_lupa.png |
| A0708 | frontend-react/public/assets/easy/dia_distal.bmp; assets/Icones/dia_distal.bmp; assets/easy/dia_distal.bmp |
| A0709 | assets/Bitmaps/arc_coroa_35.bmp |
| A0710 | frontend-react/public/assets/Icones/sim_simb8.bmp; frontend-react/public/assets/easy/sim_simb8.bmp; assets/Icones/sim_simb8.bmp; assets/easy/sim_simb8.bmp |
| A0711 | assets/Bitmaps/Dentes2d/arc_dente62a.bmp; assets/Bitmaps/arc_dente62a.bmp |
| A0712 | assets/Bitmaps/arc_fluor_25.bmp |
| A0713 | assets/Bitmaps/Dentes2d/arc_dente16a.bmp; assets/Bitmaps/Dentes2d/arc_dente16b.bmp; assets/Bitmaps/arc_dente16a.bmp; assets/Bitmaps/arc_dente16b.bmp |
| A0714 | assets/Bitmaps/Dentes2d/arc_dente44b.bmp; assets/Bitmaps/arc_dente44b.bmp |
| A0715 | assets/Bitmaps/arc_bloco_54.bmp |
| A0716 | assets/Bitmaps/arc_descal_12.bmp |
| A0717 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos.png |
| A0718 | assets/Bitmaps/arc_fixa1_44.bmp |
| A0719 | assets/Bitmaps/Dentes3d/arc_dente85.bmp; assets/Bitmaps/arc_dente85.bmp; assets/easy/dentes/arc_dente85.bmp |
| A0720 | assets/Bitmaps/arc_remov1_s.bmp |
| A0721 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente14.bmp; assets/Bitmaps/Dentes3d/arc_dente14.bmp; assets/Bitmaps/arc_dente14.bmp; assets/easy/dentes/arc_dente14.bmp |
| A0722 | assets/Bitmaps/arc_fluor_41.bmp |
| A0723 | assets/Bitmaps/arc_nucleo_48.bmp |
| A0724 | assets/Bitmaps/arc_fixa1_25.bmp |
| A0725 | assets/Bitmaps/arc_bandagem_17.bmp; assets/Bitmaps/arc_bandagem_27.bmp |
| A0726 | frontend-react/public/assets/easy/dia_fratura.bmp; assets/Icones/dia_fratura.bmp; assets/easy/dia_fratura.bmp |
| A0727 | assets/Bitmaps/arc_radi_31.bmp |
| A0728 | assets/Bitmaps/arc_fixa1_45.bmp |
| A0729 | assets/Bitmaps/arc_radi_13.bmp |
| A0730 | assets/Bitmaps/arc_fixa2_38.bmp |
| A0731 | frontend-react/public/assets/Icones/sim_simb16.bmp; frontend-react/public/assets/easy/sim_simb16.bmp; assets/Icones/sim_simb16.bmp; assets/easy/sim_simb16.bmp |
| A0732 | assets/Bitmaps/arc_radi_36.bmp |
| A0733 | assets/Bitmaps/arc_fixa1_13.bmp |
| A0734 | frontend-react/public/assets/Icones/sim_simb5.bmp; frontend-react/public/assets/easy/sim_simb5.bmp; assets/Icones/sim_simb5.bmp; assets/easy/sim_simb5.bmp |
| A0735 | assets/Bitmaps/arc_trep_17.bmp |
| A0736 | assets/Bitmaps/arc_canal_36.bmp |
| A0737 | assets/Bitmaps/arc_lesao_32.bmp; assets/Bitmaps/arc_lesao_44.bmp |
| A0738 | assets/Bitmaps/arc_radi_15.bmp |
| A0739 | assets/Bitmaps/arc_fixa3_44.bmp |
| A0740 | assets/Bitmaps/NotFound.bmp |
| A0741 | assets/Bitmaps/arc_coroa_74.bmp |
| A0742 | assets/Bitmaps/Dentes2d/arc_dente15b.bmp; assets/Bitmaps/arc_dente15b.bmp |
| A0743 | assets/Bitmaps/arc_coroa_44.bmp |
| A0744 | assets/Bitmaps/arc_nucleo_45.bmp |
| A0745 | frontend-react/public/assets/Icones/sim_byte.bmp; frontend-react/public/assets/easy/sim_byte.bmp; assets/Icones/sim_byte.bmp; assets/easy/sim_byte.bmp |
| A0746 | assets/Bitmaps/arc_canal_63.bmp |
| A0747 | frontend-react/public/assets/easy/cmd_renumera.bmp; assets/Icones/cmd_renumera.bmp; assets/easy/cmd_renumera.bmp |
| A0748 | assets/Bitmaps/arc_fixa2_14.bmp |
| A0749 | assets/Bitmaps/arc_descal_21.bmp |
| A0750 | assets/Bitmaps/arc_fixa3_28.bmp |
| A0751 | frontend-react/public/assets/easy/int_pulpo.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_pulpo.bmp; assets/Icones/int_pulpo.bmp; assets/easy/int_pulpo.bmp |
| A0752 | assets/Bitmaps/arc_coroa_84.bmp |
| A0753 | frontend-react/public/assets/easy/int_rizec.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_rizec.bmp; assets/Icones/int_rizec.bmp; assets/easy/int_rizec.bmp |
| A0754 | assets/Bitmaps/arc_canal_53.bmp |
| A0755 | assets/Bitmaps/arc_nucleo_63.bmp |
| A0756 | assets/Bitmaps/arc_bloco_46.bmp |
| A0757 | frontend-react/public/assets/easy/cmd_cccir.bmp; assets/Icones/cmd_cccir.bmp; assets/easy/cmd_cccir.bmp |
| A0758 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente21.png |
| A0759 | frontend-react/public/assets/easy/int_poli.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_poli.bmp; assets/Icones/int_poli.bmp; assets/easy/int_poli.bmp |
| A0760 | assets/Bitmaps/arc_fixa2_33.bmp |
| A0761 | frontend-react/public/assets/Icones/sim_simb13.bmp; frontend-react/public/assets/easy/sim_simb13.bmp; assets/Icones/sim_simb13.bmp; assets/easy/sim_simb13.bmp |
| A0762 | assets/Bitmaps/arc_bracket_s.bmp |
| A0763 | frontend-react/public/assets/easy/cmd_detalhes2.bmp; assets/Icones/cmd_detalhes2.bmp; assets/easy/cmd_detalhes2.bmp |
| A0764 | frontend-react/public/assets/easy/int_bracket.bmp; frontend-react/public/assets/fichaClinica/odontograma/especialidades/int_bracket.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_bracket.bmp; assets/Icones/int_bracket.bmp; assets/easy/int_bracket.bmp |
| A0765 | frontend-react/public/assets/easy/dia_semi.bmp; assets/Icones/dia_semi.bmp; assets/easy/dia_semi.bmp |
| A0766 | assets/Bitmaps/arc_canal_82.bmp |
| A0767 | assets/Bitmaps/arc_fixa2_27.bmp |
| A0768 | assets/Bitmaps/arc_facet_24.bmp |
| A0769 | frontend-react/public/assets/easy/int_enxerto.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_enxerto.bmp; assets/Icones/int_enxerto.bmp; assets/easy/int_enxerto.bmp |
| A0770 | assets/Bitmaps/arc_fixa2_35.bmp |
| A0771 | assets/Bitmaps/Dentes2d/arc_superior_perm.bmp |
| A0772 | assets/Bitmaps/arc_bandagem_26.bmp |
| A0773 | frontend-react/public/assets/easy/avi_protetico.bmp; assets/Icones/avi_protetico.bmp; assets/easy/avi_protetico.bmp |
| A0774 | assets/Bitmaps/Dentes2d/arc_dente65.bmp |
| A0775 | frontend-react/public/assets/easy/cmd_novopac.bmp; assets/Icones/cmd_novopac.bmp; assets/easy/cmd_novopac.bmp |
| A0776 | frontend-react/public/assets/Icones/sim_simb4.bmp; frontend-react/public/assets/easy/sim_simb4.bmp; assets/Icones/sim_simb4.bmp; assets/easy/sim_simb4.bmp |
| A0777 | assets/Bitmaps/arc_capeamento_25.bmp |
| A0778 | assets/Bitmaps/arc_erosao_26.bmp |
| A0779 | frontend-react/public/assets/easy/dia_erosao.bmp; assets/Icones/dia_erosao.bmp; assets/easy/dia_erosao.bmp |
| A0780 | assets/Bitmaps/arc_nucleo_41.bmp |
| A0781 | assets/Bitmaps/arc_fluor_26.bmp |
| A0782 | assets/Bitmaps/arc_lesao_36.bmp |
| A0783 | frontend-react/public/assets/fichaClinica/odontograma/endodontia.png |
| A0784 | assets/Bitmaps/arc_fissu_36.bmp |
| A0785 | assets/Bitmaps/arc_bandagem_45.bmp |
| A0786 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente33.png |
| A0787 | assets/Bitmaps/arc_coroa_15.bmp |
| A0788 | assets/Bitmaps/ger_consulta.bmp |
| A0789 | frontend-react/public/assets/easy/int_prof.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_prof.bmp; assets/Bitmaps/ger_profilaxia.bmp; assets/Icones/int_prof.bmp; assets/easy/int_prof.bmp |
| A0790 | assets/Bitmaps/arc_fixa2_28.bmp |
| A0791 | assets/Bitmaps/Dentes2d/arc_dente22a.bmp; assets/Bitmaps/arc_dente22a.bmp |
| A0792 | assets/Bitmaps/arc_fixa1_14.bmp |
| A0793 | assets/Bitmaps/arc_bloco_16.bmp |
| A0794 | assets/Bitmaps/Dentes2d/arc_superior_dec.bmp |
| A0795 | frontend-react/public/assets/easy/ico_calendario.bmp; assets/Icones/ico_calendario.bmp; assets/easy/ico_calendario.bmp |
| A0796 | assets/Bitmaps/arc_bandagem_15.bmp |
| A0797 | assets/Bitmaps/Dentes2d/arc_dente32a.bmp; assets/Bitmaps/arc_dente32a.bmp |
| A0798 | assets/Bitmaps/arc_capeamento_31.bmp; assets/Bitmaps/arc_capeamento_41.bmp |
| A0799 | frontend-react/public/assets/easy/cmd_grava.bmp; assets/Icones/cmd_grava.bmp; assets/easy/cmd_grava.bmp |
| A0800 | assets/Bitmaps/arc_fluor_32.bmp |
| A0801 | assets/Bitmaps/arc_coroa_25.bmp |
| A0802 | assets/Bitmaps/arc_descal_24.bmp |
| A0803 | assets/Bitmaps/Dentes2d/arc_dente55a.bmp; assets/Bitmaps/arc_dente55a.bmp |
| A0804 | assets/Bitmaps/arc_bloco_45.bmp |
| A0805 | assets/Bitmaps/arc_bloco_38.bmp |
| A0806 | frontend-react/public/assets/Icones/sim_simb29.bmp; frontend-react/public/assets/easy/sim_simb29.bmp; assets/Icones/sim_simb29.bmp; assets/easy/sim_simb29.bmp |
| A0807 | frontend-react/public/assets/Icones/sim_simb32.bmp; frontend-react/public/assets/easy/sim_simb32.bmp; assets/Icones/sim_simb32.bmp; assets/easy/sim_simb32.bmp |
| A0808 | assets/Bitmaps/arc_erosao_24.bmp |
| A0809 | frontend-react/public/assets/easy/dia_descalcif.bmp; assets/Icones/dia_descalcif.bmp; assets/easy/dia_descalcif.bmp |
| A0810 | assets/Bitmaps/arc_rizectomia_35.bmp |
| A0811 | assets/Bitmaps/arc_erosao_15.bmp |
| A0812 | assets/Bitmaps/arc_nucleo_74.bmp |
| A0813 | assets/Bitmaps/arc_lesao_11.bmp; assets/Bitmaps/arc_lesao_15.bmp; assets/Bitmaps/arc_lesao_17.bmp |
| A0814 | assets/Bitmaps/arc_descal_41.bmp |
| A0815 | assets/Bitmaps/Dentes2d/arc_superior_mista.bmp |
| A0816 | assets/Bitmaps/arc_fissu_24.bmp |
| A0817 | frontend-react/public/assets/Icones/sim_simb35.bmp; frontend-react/public/assets/easy/sim_simb35.bmp; assets/Icones/sim_simb35.bmp; assets/easy/sim_simb35.bmp |
| A0818 | assets/Bitmaps/arc_aumento_i.bmp |
| A0819 | assets/Bitmaps/arc_capeamento_27.bmp |
| A0820 | frontend-react/public/assets/easy/dia_trepanacao.bmp; assets/Icones/dia_trepanacao.bmp; assets/easy/dia_trepanacao.bmp |
| A0821 | assets/Bitmaps/Dentes2d/arc_dente34a.bmp; assets/Bitmaps/arc_dente34a.bmp |
| A0822 | assets/Bitmaps/arc_fissu_18.bmp |
| A0823 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente12.bmp; assets/Bitmaps/Dentes3d/arc_dente12.bmp; assets/Bitmaps/arc_dente12.bmp; assets/easy/dentes/arc_dente12.bmp |
| A0824 | assets/Bitmaps/arc_lesao_37.bmp |
| A0825 | assets/Bitmaps/arc_coroa_85.bmp |
| A0826 | assets/Bitmaps/arc_fluor_12.bmp |
| A0827 | assets/Bitmaps/Dentes2d/arc_dente63.bmp |
| A0828 | assets/Bitmaps/arc_canal_64.bmp |
| A0829 | frontend-react/public/assets/easy/int_consulta.bmp; frontend-react/public/assets/fichaClinica/odontograma/especialidades/int_consulta.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_consulta.bmp; assets/Icones/int_consulta.bmp; assets/easy/int_consulta.bmp |
| A0830 | assets/Bitmaps/arc_coroa_16.bmp |
| A0831 | assets/Bitmaps/Dentes2d/arc_dente24a.bmp; assets/Bitmaps/arc_dente24a.bmp |
| A0832 | assets/Bitmaps/arc_facet_45.bmp |
| A0833 | frontend-react/public/assets/Icones/sim_attach.bmp; frontend-react/public/assets/easy/sim_attach.bmp; assets/Icones/sim_attach.bmp; assets/easy/sim_attach.bmp |
| A0834 | assets/Bitmaps/arc_bloco_48.bmp |
| A0835 | assets/Bitmaps/arc_descal_15.bmp |
| A0836 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente12.png |
| A0837 | frontend-react/public/assets/Icones/sim_simb15.bmp; frontend-react/public/assets/easy/sim_simb15.bmp; assets/Icones/sim_simb15.bmp; assets/easy/sim_simb15.bmp |
| A0838 | assets/Bitmaps/arc_coroa_26.bmp |
| A0839 | assets/Bitmaps/arc_fixa1_17.bmp |
| A0840 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente42.bmp; assets/Bitmaps/Dentes3d/arc_dente42.bmp; assets/Bitmaps/arc_dente42.bmp; assets/easy/dentes/arc_dente42.bmp |
| A0841 | frontend-react/public/assets/easy/int_raiox.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_raiox.bmp; assets/Icones/int_raiox.bmp; assets/easy/int_raiox.bmp |
| A0842 | assets/Bitmaps/arc_fluor_13.bmp |
| A0843 | frontend-react/public/assets/easy/int_provgru.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_provgru.bmp; assets/Icones/int_provgru.bmp; assets/easy/int_provgru.bmp |
| A0844 | assets/Bitmaps/arc_fixa1_41.bmp |
| A0845 | assets/Bitmaps/arc_extracao_s.bmp |
| A0846 | frontend-react/public/assets/easy/avi_aniversariantes.bmp; assets/Icones/avi_aniversariantes.bmp; assets/easy/avi_aniversariantes.bmp |
| A0847 | frontend-react/public/assets/easy/int_selante.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_selante.bmp; assets/Icones/int_selante.bmp; assets/easy/int_selante.bmp |
| A0848 | frontend-react/public/assets/easy/int_desgas.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_desgas.bmp; assets/Bitmaps/ger_desgaste.bmp; assets/Icones/int_desgas.bmp; assets/easy/int_desgas.bmp |
| A0849 | assets/Bitmaps/arc_trep_25.bmp |
| A0850 | assets/Bitmaps/arc_lesao_26.bmp |
| A0851 | assets/Bitmaps/arc_bloco_52.bmp |
| A0852 | assets/Bitmaps/arc_facet_31.bmp |
| A0853 | frontend-react/public/assets/easy/int_banda.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_banda.bmp; assets/Icones/int_banda.bmp; assets/easy/int_banda.bmp |
| A0854 | assets/Bitmaps/Dentes2d/arc_dente36a.bmp; assets/Bitmaps/Dentes2d/arc_dente36b.bmp; assets/Bitmaps/arc_dente36a.bmp; assets/Bitmaps/arc_dente36b.bmp |
| A0855 | assets/Bitmaps/arc_radi_34.bmp |
| A0856 | frontend-react/public/assets/Icones/sim_sel.bmp; frontend-react/public/assets/easy/sim_sel.bmp; assets/Icones/sim_sel.bmp; assets/easy/sim_sel.bmp |
| A0857 | assets/Bitmaps/arc_fixa2_36.bmp |
| A0858 | frontend-react/public/assets/easy/arc_inferior_perm.bmp; assets/Bitmaps/Dentes3d/arc_inferior_perm.bmp; assets/Bitmaps/arc_inferior_perm.bmp; assets/easy/arc_inferior_perm.bmp |
| A0859 | frontend-react/public/assets/easy/int_RestMO.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_RestMO.bmp; assets/Icones/int_RestMO.bmp; assets/easy/int_RestMO.bmp |
| A0860 | assets/Bitmaps/arc_lesao_35.bmp |
| A0861 | assets/Bitmaps/Dentes2d/arc_dente27a.bmp; assets/Bitmaps/Dentes2d/arc_dente27b.bmp; assets/Bitmaps/arc_dente27a.bmp; assets/Bitmaps/arc_dente27b.bmp |
| A0862 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente25.png |
| A0863 | frontend-react/public/assets/easy/int_lateral.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_lateral.bmp; assets/Bitmaps/ger_lateral.bmp; assets/Icones/int_lateral.bmp; assets/easy/int_lateral.bmp |
| A0864 | assets/Bitmaps/arc_bloco_61.bmp |
| A0865 | assets/Bitmaps/arc_erosao_46.bmp |
| A0866 | frontend-react/public/assets/easy/int_modelo.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_modelo.bmp; assets/Bitmaps/ger_modelo.bmp; assets/Icones/int_modelo.bmp; assets/easy/int_modelo.bmp |
| A0867 | frontend-react/public/assets/easy/ico_caution.bmp; assets/Icones/ico_caution.bmp; assets/easy/ico_caution.bmp |
| A0868 | assets/Bitmaps/arc_capeamento_14.bmp |
| A0869 | frontend-react/public/assets/easy/cmd_insere.bmp; assets/Icones/cmd_insere.bmp; assets/easy/cmd_insere.bmp |
| A0870 | assets/Bitmaps/arc_rizectomia_16.bmp |
| A0871 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente37.png |
| A0872 | assets/Bitmaps/arc_lesao_21.bmp |
| A0873 | frontend-react/public/assets/easy/int_boticao.bmp; assets/Icones/int_boticao.bmp; assets/easy/int_boticao.bmp |
| A0874 | assets/Bitmaps/arc_trep_45.bmp |
| A0875 | frontend-react/public/assets/easy/cmd_sim.bmp; assets/Icones/cmd_sim.bmp; assets/easy/cmd_sim.bmp |
| A0876 | assets/Bitmaps/arc_nucleo_21.bmp |
| A0877 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente21.bmp; assets/Bitmaps/Dentes3d/arc_dente21.bmp; assets/Bitmaps/arc_dente21.bmp; assets/easy/dentes/arc_dente21.bmp |
| A0878 | assets/Bitmaps/arc_fixa1_24.bmp |
| A0879 | assets/Bitmaps/Dentes2d/arc_dente18.bmp |
| A0880 | assets/Bitmaps/arc_erosao_35.bmp |
| A0881 | assets/Bitmaps/arc_fixa1_18.bmp |
| A0882 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente48.png |
| A0883 | assets/Bitmaps/arc_facet_23.bmp |
| A0884 | assets/Bitmaps/arc_fixa2_16.bmp |
| A0885 | assets/Bitmaps/arc_fixa3_27.bmp |
| A0886 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_implante.bmp; assets/images/int_implante.bmp |
| A0887 | assets/Bitmaps/Dentes2d/arc_dente48.bmp |
| A0888 | frontend-react/public/assets/easy/esp_Radiologia.bmp; frontend-react/public/assets/fichaClinica/odontograma/especialidades/esp_Radiologia.bmp; assets/Icones/esp_Radiologia.bmp; assets/easy/esp_Radiologia.bmp |
| A0889 | frontend-react/public/assets/fichaClinica/toolbar/ico_ficha_pesquisar.png |
| A0890 | assets/Bitmaps/arc_trep_42.bmp |
| A0891 | assets/Bitmaps/arc_raspagem_i.bmp |
| A0892 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente36.bmp; assets/Bitmaps/Dentes3d/arc_dente36.bmp; assets/Bitmaps/arc_dente36.bmp; assets/easy/dentes/arc_dente36.bmp |
| A0893 | assets/Bitmaps/arc_bandagem_22.bmp |
| A0894 | assets/Bitmaps/arc_capeamento_32.bmp |
| A0895 | assets/Bitmaps/Dentes3d/arc_superior_dec.bmp; assets/Bitmaps/arc_superior_dec.bmp |
| A0896 | assets/Bitmaps/arc_radi_25.bmp |
| A0897 | assets/Bitmaps/Dentes2d/arc_dente41a.bmp; assets/Bitmaps/arc_dente41a.bmp |
| A0898 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente37.bmp; assets/Bitmaps/Dentes3d/arc_dente37.bmp; assets/Bitmaps/arc_dente37.bmp; assets/easy/dentes/arc_dente37.bmp |
| A0899 | assets/Bitmaps/arc_fixa3_15.bmp |
| A0900 | assets/Bitmaps/arc_coroa_55.bmp |
| A0901 | assets/Bitmaps/arc_bloco_37.bmp |
| A0902 | assets/Bitmaps/arc_rizectomia_18.bmp |
| A0903 | assets/Bitmaps/arc_canal_21.bmp |
| A0904 | assets/Bitmaps/arc_bloco_36.bmp |
| A0905 | assets/Bitmaps/arc_bandagem_16.bmp |
| A0906 | assets/Bitmaps/Dentes2d/arc_dente43b.bmp; assets/Bitmaps/arc_dente43b.bmp |
| A0907 | assets/Bitmaps/arc_canal_27.bmp |
| A0908 | assets/Bitmaps/Dentes3d/arc_dente84.bmp; assets/Bitmaps/arc_dente84.bmp; assets/easy/dentes/arc_dente84.bmp |
| A0909 | assets/Bitmaps/arc_capeamento_26.bmp |
| A0910 | assets/Bitmaps/arc_bandagem_24.bmp |
| A0911 | frontend-react/public/assets/Icones/sim_simb17.bmp; frontend-react/public/assets/easy/sim_simb17.bmp; assets/Icones/sim_simb17.bmp; assets/easy/sim_simb17.bmp |
| A0912 | frontend-react/public/assets/easy/int_placa.bmp; assets/Bitmaps/ger_placa.bmp; assets/Icones/int_placa.bmp; assets/easy/int_placa.bmp |
| A0913 | assets/Bitmaps/arc_nucleo_27.bmp |
| A0914 | assets/Bitmaps/arc_total1_s.bmp |
| A0915 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente46.png |
| A0916 | assets/Bitmaps/arc_bloco_23.bmp |
| A0917 | assets/Bitmaps/arc_fluor_11.bmp |
| A0918 | assets/Bitmaps/arc_bloco_82.bmp |
| A0919 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente32.png |
| A0920 | assets/Bitmaps/arc_fixa2_24.bmp |
| A0921 | assets/Bitmaps/arc_trep_11.bmp |
| A0922 | frontend-react/public/assets/Icones/sim_prov.bmp; frontend-react/public/assets/easy/sim_prov.bmp; assets/Icones/sim_prov.bmp; assets/easy/sim_prov.bmp |
| A0923 | frontend-react/public/assets/easy/int_cirur.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_cirur.bmp; assets/Bitmaps/ger_cirurgia.bmp; assets/Icones/int_cirur.bmp; assets/easy/int_cirur.bmp |
| A0924 | frontend-react/public/assets/easy/dia_fissura.bmp; assets/Icones/dia_fissura.bmp; assets/easy/dia_fissura.bmp |
| A0925 | assets/Bitmaps/arc_facet_38.bmp |
| A0926 | assets/Bitmaps/arc_migesq.bmp |
| A0927 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente47.png |
| A0928 | assets/Bitmaps/arc_fixa3_43.bmp |
| A0929 | frontend-react/public/assets/easy/int_fixa.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_fixa.bmp; assets/Icones/int_fixa.bmp; assets/easy/int_fixa.bmp |
| A0930 | assets/Bitmaps/arc_coroa_82.bmp |
| A0931 | assets/Bitmaps/arc_fixa3_48.bmp |
| A0932 | assets/Bitmaps/arc_fixa3_31.bmp |
| A0933 | assets/Bitmaps/arc_nucleo_62.bmp |
| A0934 | frontend-react/public/assets/Icones/sim_outras.bmp; frontend-react/public/assets/easy/sim_outras.bmp; assets/Icones/sim_outras.bmp; assets/easy/sim_outras.bmp |
| A0935 | frontend-react/public/assets/easy/cmd_avancasemana.bmp; assets/Icones/cmd_avancasemana.bmp; assets/easy/cmd_avancasemana.bmp |
| A0936 | assets/Bitmaps/arc_coroa_81.bmp |
| A0937 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente41.png |
| A0938 | assets/Bitmaps/arc_fixa3_38.bmp |
| A0939 | frontend-react/public/assets/Icones/sim_simb9.bmp; frontend-react/public/assets/easy/sim_simb9.bmp; assets/Icones/sim_simb9.bmp; assets/easy/sim_simb9.bmp |
| A0940 | assets/Bitmaps/arc_radi_11.bmp |
| A0941 | assets/Bitmaps/arc_retalho_s.bmp |
| A0942 | assets/Bitmaps/arc_fixa1_15.bmp |
| A0943 | assets/Bitmaps/arc_coroa_32.bmp |
| A0944 | frontend-react/public/assets/easy/int_ajuste.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_ajuste.bmp; assets/Icones/int_ajuste.bmp; assets/easy/int_ajuste.bmp |
| A0945 | assets/Bitmaps/arc_radi_35.bmp; assets/Bitmaps/arc_radi_44.bmp |
| A0946 | assets/Bitmaps/arc_coroa_38.bmp |
| A0947 | assets/Bitmaps/Dentes2d/arc_dente51a.bmp; assets/Bitmaps/arc_dente51a.bmp |
| A0948 | assets/Bitmaps/arc_coroa_12.bmp |
| A0949 | assets/Bitmaps/arc_fixa1_35.bmp |
| A0950 | assets/Bitmaps/Dentes2d/arc_dente52.bmp |
| A0951 | assets/Bitmaps/arc_canal_22.bmp |
| A0952 | frontend-react/public/assets/Icones/sim_simb23.bmp; frontend-react/public/assets/easy/sim_simb23.bmp; assets/Icones/sim_simb23.bmp; assets/easy/sim_simb23.bmp |
| A0953 | frontend-react/public/assets/easy/int_restaura.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_restaura.bmp; assets/Icones/int_restaura.bmp; assets/easy/int_restaura.bmp |
| A0954 | assets/Bitmaps/arc_trep_12.bmp |
| A0955 | assets/Bitmaps/arc_bloco_47.bmp |
| A0956 | frontend-react/public/assets/easy/cmd_altera.bmp; assets/Icones/cmd_altera.bmp; assets/easy/cmd_altera.bmp |
| A0957 | frontend-react/public/assets/Icones/sim_simb28.bmp; frontend-react/public/assets/easy/sim_simb28.bmp; assets/Icones/sim_simb28.bmp; assets/easy/sim_simb28.bmp |
| A0958 | assets/Bitmaps/arc_trep_31.bmp |
| A0959 | assets/Bitmaps/arc_bandagem_32.bmp |
| A0960 | assets/Bitmaps/arc_capeamento_13.bmp |
| A0961 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente22.bmp; assets/Bitmaps/Dentes3d/arc_dente22.bmp; assets/Bitmaps/arc_dente22.bmp; assets/easy/dentes/arc_dente22.bmp |
| A0962 | assets/Bitmaps/arc_descal_33.bmp |
| A0963 | assets/Bitmaps/arc_facet_13.bmp |
| A0964 | frontend-react/public/assets/easy/int_gengivec.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_gengivec.bmp; assets/Icones/int_gengivec.bmp; assets/easy/int_gengivec.bmp |
| A0965 | frontend-react/public/assets/Icones/sim_simb27.bmp; frontend-react/public/assets/easy/sim_simb27.bmp; assets/Icones/sim_simb27.bmp; assets/easy/sim_simb27.bmp |
| A0966 | assets/Bitmaps/arc_canal_46.bmp |
| A0967 | frontend-react/public/assets/easy/cmd_cnfetiqueta.bmp; assets/Icones/cmd_cnfetiqueta.bmp; assets/easy/cmd_cnfetiqueta.bmp |
| A0968 | frontend-react/public/assets/easy/cmd_retornames.bmp; assets/Icones/cmd_retornames.bmp; assets/easy/cmd_retornames.bmp |
| A0969 | assets/Bitmaps/arc_bloco_43.bmp |
| A0970 | assets/Bitmaps/arc_implante_s.bmp |
| A0971 | assets/Bitmaps/arc_rizectomia_27.bmp |
| A0972 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente28.bmp; assets/Bitmaps/Dentes3d/arc_dente28.bmp; assets/Bitmaps/arc_dente28.bmp; assets/easy/dentes/arc_dente28.bmp |
| A0973 | assets/Bitmaps/arc_fixa1_36.bmp |
| A0974 | assets/Bitmaps/Dentes2d/arc_dente23.bmp |
| A0975 | frontend-react/public/assets/easy/esp_Indefinido.bmp; assets/Icones/esp_Indefinido.bmp; assets/easy/esp_Indefinido.bmp |
| A0976 | frontend-react/public/assets/easy/cmd_copia.bmp; assets/Icones/cmd_copia.bmp; assets/easy/cmd_copia.bmp |
| A0977 | frontend-react/public/assets/Icones/sim_simb14.bmp; frontend-react/public/assets/easy/sim_simb14.bmp; assets/Icones/sim_simb14.bmp; assets/easy/sim_simb14.bmp |
| A0978 | assets/Bitmaps/arc_radi_22.bmp |
| A0979 | assets/Icones/ico_caution.ico |
| A0980 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente17.png |
| A0981 | assets/Bitmaps/Dentes2d/arc_dente22b.bmp; assets/Bitmaps/arc_dente22b.bmp |
| A0982 | assets/Bitmaps/Dentes2d/arc_dente81.bmp |
| A0983 | assets/Bitmaps/arc_trep_27.bmp |
| A0984 | assets/Bitmaps/arc_descal_28.bmp |
| A0985 | assets/Bitmaps/arc_erosao_25.bmp |
| A0986 | assets/Bitmaps/arc_fixa1_34.bmp |
| A0987 | assets/Bitmaps/arc_nucleo_26.bmp |
| A0988 | assets/Bitmaps/Dentes2d/arc_dente12b.bmp; assets/Bitmaps/arc_dente12b.bmp |
| A0989 | frontend-react/public/assets/Icones/sim_simb1.bmp; frontend-react/public/assets/easy/sim_simb1.bmp; assets/Icones/sim_simb1.bmp; assets/easy/sim_simb1.bmp |
| A0990 | assets/Bitmaps/arc_erosao_17.bmp |
| A0991 | assets/Bitmaps/arc_fixa2_41.bmp |
| A0992 | frontend-react/public/assets/fichaClinica/odontograma/gerais.png |
| A0993 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_biop_ling.png; assets/images/int_biop_ling.png |
| A0994 | assets/Bitmaps/arc_capeamento_42.bmp |
| A0995 | assets/Bitmaps/arc_canal_84.bmp |
| A0996 | frontend-react/public/assets/fichaClinica/odontograma/diagnostico.png |
| A0997 | assets/Bitmaps/arc_nucleo_33.bmp |
| A0998 | assets/Bitmaps/arc_coroa_65.bmp |
| A0999 | assets/Bitmaps/arc_lesao_23.bmp |
| A1000 | assets/Bitmaps/arc_fissu_38.bmp |
| A1001 | assets/Bitmaps/arc_bandagem_41.bmp |
| A1002 | assets/Bitmaps/arc_canal_61.bmp |
| A1003 | assets/Bitmaps/arc_bloco_12.bmp |
| A1004 | frontend-react/public/assets/easy/int_eho.bmp; assets/Bitmaps/ger_eho.bmp; assets/Icones/int_eho.bmp; assets/easy/int_eho.bmp |
| A1005 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente43.bmp; assets/Bitmaps/Dentes3d/arc_dente43.bmp; assets/Bitmaps/arc_dente43.bmp; assets/easy/dentes/arc_dente43.bmp |
| A1006 | assets/Bitmaps/arc_erosao_45.bmp |
| A1007 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente28.png |
| A1008 | assets/Bitmaps/Dentes2d/arc_dente47.bmp |
| A1009 | frontend-react/public/assets/Icones/sim_simb11.bmp; frontend-react/public/assets/easy/sim_simb11.bmp; assets/Icones/sim_simb11.bmp; assets/easy/sim_simb11.bmp |
| A1010 | assets/Bitmaps/arc_total3_i.bmp |
| A1011 | assets/images/int_fluor.bmp |
| A1012 | assets/Bitmaps/arc_fixa3_11.bmp |
| A1013 | assets/Bitmaps/Dentes2d/arc_dente84.bmp |
| A1014 | assets/Bitmaps/arc_aumento_s.bmp |
| A1015 | assets/Bitmaps/arc_bloco_44.bmp |
| A1016 | assets/Bitmaps/Dentes2d/arc_dente21.bmp |
| A1017 | assets/Bitmaps/arc_canal_85.bmp |
| A1018 | assets/Bitmaps/arc_erosao_28.bmp |
| A1019 | frontend-react/public/assets/easy/cmd_orcamento.bmp; assets/Icones/cmd_orcamento.bmp; assets/easy/cmd_orcamento.bmp |
| A1020 | assets/images/int_enxerto.bmp |
| A1021 | assets/Bitmaps/Dentes3d/arc_dente74.bmp; assets/Bitmaps/arc_dente74.bmp; assets/easy/dentes/arc_dente74.bmp |
| A1022 | frontend-react/public/assets/fichaClinica/toolbar/ico_filtro.PNG |
| A1023 | assets/Bitmaps/Dentes2d/arc_dente85a.bmp; assets/Bitmaps/arc_dente85a.bmp |
| A1024 | frontend-react/public/assets/easy/cmd_config.bmp; assets/Icones/cmd_config.bmp; assets/easy/cmd_config.bmp |
| A1025 | frontend-react/public/assets/easy/dia_ausraiz.bmp; assets/Icones/dia_ausraiz.bmp; assets/easy/dia_ausraiz.bmp |
| A1026 | frontend-react/public/assets/easy/cmd_gravaesta.bmp; assets/Icones/cmd_gravaesta.bmp; assets/easy/cmd_gravaesta.bmp |
| A1027 | assets/Bitmaps/arc_nucleo_23.bmp |
| A1028 | frontend-react/public/assets/easy/dia_incluso.bmp; assets/Icones/dia_incluso.bmp; assets/easy/dia_incluso.bmp |
| A1029 | assets/Bitmaps/arc_fluor_17.bmp |
| A1030 | assets/Bitmaps/Dentes2d/arc_dente43a.bmp; assets/Bitmaps/arc_dente43a.bmp |
| A1031 | assets/Bitmaps/arc_nucleo_13.bmp |
| A1032 | frontend-react/public/assets/fichaClinica/toolbar/ico_filter.png |
| A1033 | assets/Bitmaps/arc_nucleo_15.bmp |
| A1034 | assets/Bitmaps/arc_descal_25.bmp |
| A1035 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_boticao.bmp; assets/images/int_boticao.bmp |
| A1036 | assets/Bitmaps/arc_lesao_47.bmp |
| A1037 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente15.bmp; assets/Bitmaps/Dentes3d/arc_dente15.bmp; assets/Bitmaps/arc_dente15.bmp; assets/easy/dentes/arc_dente15.bmp |
| A1038 | frontend-react/public/assets/easy/cmd_historico.bmp; assets/Icones/cmd_historico.bmp; assets/easy/cmd_historico.bmp |
| A1039 | frontend-react/public/assets/easy/cmd_ok.bmp; assets/Icones/cmd_ok.bmp; assets/easy/cmd_ok.bmp |
| A1040 | assets/Bitmaps/arc_radi_45.bmp |
| A1041 | assets/Bitmaps/arc_tunel_s.bmp |
| A1042 | assets/Bitmaps/arc_erosao_37.bmp |
| A1043 | assets/Bitmaps/arc_fixa1_46.bmp |
| A1044 | assets/Bitmaps/arc_fissu_22.bmp |
| A1045 | assets/Bitmaps/Dentes2d/arc_dente45a.bmp; assets/Bitmaps/arc_dente45a.bmp |
| A1046 | assets/Bitmaps/arc_erosao_38.bmp |
| A1047 | assets/Bitmaps/arc_bloco_34.bmp |
| A1048 | frontend-react/public/assets/easy/int_panoram.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_panoram.bmp; assets/Bitmaps/ger_panoramica.bmp; assets/Icones/int_panoram.bmp; assets/easy/int_panoram.bmp |
| A1049 | assets/Bitmaps/arc_erosao_48.bmp |
| A1050 | frontend-react/public/assets/easy/int_capea.bmp; assets/Icones/int_capea.bmp; assets/easy/int_capea.bmp |
| A1051 | assets/Bitmaps/arc_coroa_46.bmp |
| A1052 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente18.bmp; assets/Bitmaps/Dentes3d/arc_dente18.bmp; assets/Bitmaps/arc_dente18.bmp; assets/easy/dentes/arc_dente18.bmp |
| A1053 | assets/Bitmaps/arc_bloco_84.bmp |
| A1054 | assets/Bitmaps/arc_capeamento_48.bmp |
| A1055 | assets/Bitmaps/arc_rizectomia_48.bmp |
| A1056 | assets/Bitmaps/arc_coroa_28.bmp |
| A1057 | frontend-react/public/assets/easy/cmd_anamnese.bmp; assets/Icones/cmd_anamnese.bmp; assets/easy/cmd_anamnese.bmp |
| A1058 | assets/Bitmaps/arc_fluor_33.bmp |
| A1059 | assets/Bitmaps/arc_extracao_i.bmp |
| A1060 | frontend-react/public/assets/easy/cmd_maladir.bmp; assets/Icones/cmd_maladir.bmp; assets/easy/cmd_maladir.bmp |
| A1061 | assets/Bitmaps/arc_rizectomia_14.bmp |
| A1062 | assets/Bitmaps/arc_trep_14.bmp |
| A1063 | frontend-react/public/assets/easy/cmd_grafico.bmp; assets/Icones/cmd_grafico.bmp; assets/easy/cmd_grafico.bmp |
| A1064 | assets/Bitmaps/arc_bloco_83.bmp |
| A1065 | frontend-react/public/assets/easy/cmd_senha.bmp; assets/Icones/cmd_senha.bmp; assets/easy/cmd_senha.bmp |
| A1066 | frontend-react/public/assets/easy/int_mordida.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_mordida.bmp; assets/Bitmaps/ger_mordida.bmp; assets/Icones/int_mordida.bmp; assets/easy/int_mordida.bmp |
| A1067 | assets/Bitmaps/arc_coroa_36.bmp |
| A1068 | assets/Bitmaps/arc_rizectomia_36.bmp |
| A1069 | assets/Bitmaps/arc_erosao_31.bmp |
| A1070 | assets/Bitmaps/arc_fixa2_15.bmp |
| A1071 | assets/Bitmaps/arc_hemi_i.bmp; assets/Bitmaps/arc_hemi_s.bmp |
| A1072 | assets/Bitmaps/arc_fluor_24.bmp |
| A1073 | assets/Bitmaps/arc_fixa2_17.bmp |
| A1074 | assets/Bitmaps/arc_trep_34.bmp |
| A1075 | assets/Bitmaps/arc_trep_48.bmp |
| A1076 | assets/Bitmaps/arc_trep_46.bmp |
| A1077 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_biop_maxila.png; assets/images/int_biop_maxila.png |
| A1078 | assets/Bitmaps/arc_fixa1_38.bmp |
| A1079 | frontend-react/public/assets/easy/arc_superior_perm.bmp; assets/Bitmaps/Dentes3d/arc_superior_perm.bmp; assets/Bitmaps/arc_superior_perm.bmp; assets/easy/arc_superior_perm.bmp |
| A1080 | assets/Bitmaps/arc_facet_28.bmp |
| A1081 | assets/Bitmaps/arc_coroa_13.bmp |
| A1082 | assets/Bitmaps/Dentes2d/arc_dente74a.bmp; assets/Bitmaps/arc_dente74a.bmp |
| A1083 | assets/Bitmaps/arc_facet_21.bmp |
| A1084 | assets/Bitmaps/arc_nucleo_64.bmp |
| A1085 | assets/Bitmaps/arc_coroa_33.bmp |
| A1086 | assets/Bitmaps/arc_remov2_s.bmp |
| A1087 | frontend-react/public/assets/easy/int_bloco.bmp; assets/Icones/int_bloco.bmp; assets/easy/int_bloco.bmp |
| A1088 | assets/Bitmaps/arc_ades_i.bmp |
| A1089 | assets/Bitmaps/arc_fixa3_14.bmp |
| A1090 | assets/Bitmaps/arc_fixa3_34.bmp |
| A1091 | assets/Bitmaps/arc_facet_46.bmp |
| A1092 | assets/Bitmaps/Dentes3d/arc_dente83.bmp; assets/Bitmaps/arc_dente83.bmp; assets/easy/dentes/arc_dente83.bmp |
| A1093 | assets/Bitmaps/arc_bracket_i.bmp |
| A1094 | assets/Bitmaps/arc_bloco_27.bmp |
| A1095 | assets/Bitmaps/arc_fissu_37.bmp |
| A1096 | frontend-react/public/assets/easy/cmd_avancames.bmp; assets/Icones/cmd_avancames.bmp; assets/easy/cmd_avancames.bmp |
| A1097 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_torus_mand.png; assets/images/int_torus_mand.png |
| A1098 | assets/Bitmaps/arc_bloco_85.bmp |
| A1099 | assets/Bitmaps/arc_capeamento_34.bmp |
| A1100 | assets/Bitmaps/arc_fluor_42.bmp |
| A1101 | assets/Bitmaps/arc_bloco_25.bmp |
| A1102 | frontend-react/public/assets/fichaClinica/toolbar/ico_tabelas_auxiliares.PNG |
| A1103 | assets/Bitmaps/arc_fissu_48.bmp |
| A1104 | assets/Bitmaps/arc_fissu_15.bmp |
| A1105 | assets/Bitmaps/arc_coroa_53.bmp |
| A1106 | assets/Bitmaps/arc_fluor_45.bmp |
| A1107 | assets/Bitmaps/Dentes2d/arc_dente64.bmp |
| A1108 | assets/Bitmaps/arc_canal_11.bmp |
| A1109 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_biop_labio.png; assets/images/int_biop_labio.png |
| A1110 | assets/Bitmaps/arc_capeamento_12.bmp |
| A1111 | assets/Bitmaps/arc_fluor_16.bmp |
| A1112 | assets/Bitmaps/arc_remov3_i.bmp |
| A1113 | frontend-react/public/assets/easy/dia_lesao.bmp; assets/Icones/dia_lesao.bmp; assets/easy/dia_lesao.bmp |
| A1114 | assets/Bitmaps/Dentes2d/arc_dente72.bmp |
| A1115 | frontend-react/public/assets/easy/ico_alert.bmp; assets/Icones/ico_alert.bmp; assets/easy/ico_alert.bmp |
| A1116 | assets/Bitmaps/arc_facet_26.bmp |
| A1117 | assets/Bitmaps/Dentes2d/arc_dente28.bmp |
| A1118 | assets/Bitmaps/arc_nucleo_14.bmp |
| A1119 | assets/Bitmaps/arc_descal_42.bmp |
| A1120 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente31.png |
| A1121 | assets/Bitmaps/Dentes2d/arc_dente73.bmp |
| A1122 | assets/Bitmaps/arc_lesao_48.bmp |
| A1123 | assets/Bitmaps/arc_descal_47.bmp |
| A1124 | assets/Bitmaps/Dentes2d/arc_dente25b.bmp; assets/Bitmaps/arc_dente25b.bmp |
| A1125 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente26.bmp; assets/Bitmaps/Dentes3d/arc_dente26.bmp; assets/Bitmaps/arc_dente26.bmp; assets/easy/dentes/arc_dente26.bmp |
| A1126 | assets/Bitmaps/arc_trep_26.bmp |
| A1127 | assets/images/int_retalho.bmp |
| A1128 | frontend-react/public/assets/easy/ico_memo.bmp; assets/Icones/ico_memo.bmp; assets/easy/ico_memo.bmp |
| A1129 | assets/Bitmaps/arc_bandagem_46.bmp |
| A1130 | assets/Bitmaps/arc_fixa1_27.bmp |
| A1131 | assets/images/int_consulta.bmp |
| A1132 | assets/Bitmaps/arc_capeamento_35.bmp |
| A1133 | assets/Bitmaps/arc_coroa_21.bmp |
| A1134 | assets/Bitmaps/arc_coroa_72.bmp |
| A1135 | frontend-react/public/assets/easy/cmd_setapreview1.bmp; assets/Icones/cmd_setapreview1.bmp; assets/easy/cmd_setapreview1.bmp |
| A1136 | frontend-react/public/assets/easy/esp_Ortodontia.bmp; frontend-react/public/assets/fichaClinica/odontograma/especialidades/esp_Ortodontia.bmp; assets/Icones/esp_Ortodontia.bmp; assets/easy/esp_Ortodontia.bmp |
| A1137 | assets/Bitmaps/arc_trep_36.bmp |
| A1138 | assets/Bitmaps/arc_fluor_21.bmp |
| A1139 | assets/Bitmaps/arc_retalho_i.bmp |
| A1140 | assets/Bitmaps/arc_descal_11.bmp |
| A1141 | frontend-react/public/assets/easy/int_peric.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_peric.bmp; assets/Bitmaps/ger_pericia.bmp; assets/Icones/int_peric.bmp; assets/easy/int_peric.bmp |
| A1142 | assets/Bitmaps/arc_descal_17.bmp |
| A1143 | assets/Bitmaps/Dentes2d/arc_dente24b.bmp; assets/Bitmaps/arc_dente24b.bmp |
| A1144 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_exostose_max.png; assets/images/int_exostose_max.png |
| A1145 | assets/Bitmaps/arc_raspagem_s.bmp |
| A1146 | assets/Bitmaps/Dentes2d/arc_dente54a.bmp; assets/Bitmaps/arc_dente54a.bmp |
| A1147 | frontend-react/public/assets/Icones/sim_simb6.bmp; frontend-react/public/assets/easy/sim_simb6.bmp; assets/Icones/sim_simb6.bmp; assets/easy/sim_simb6.bmp |
| A1148 | frontend-react/public/assets/easy/esp_Implantodontia.bmp; frontend-react/public/assets/fichaClinica/odontograma/especialidades/esp_Implantodontia.bmp; assets/Icones/esp_Implantodontia.bmp; assets/easy/esp_Implantodontia.bmp |
| A1149 | assets/Bitmaps/arc_facet_33.bmp |
| A1150 | assets/Bitmaps/arc_bloco_64.bmp |
| A1151 | frontend-react/public/assets/easy/cmd_contato.bmp; assets/Icones/cmd_contato.bmp; assets/easy/cmd_contato.bmp |
| A1152 | assets/Bitmaps/arc_bloco_31.bmp |
| A1153 | frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_generico02.bmp; assets/images/int_generico02.bmp |
| A1154 | assets/Bitmaps/Dentes2d/arc_dente51.bmp |
| A1155 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente18.png |
| A1156 | assets/Bitmaps/arc_extru_i.bmp |
| A1157 | assets/Bitmaps/Dentes2d/arc_dente25a.bmp; assets/Bitmaps/arc_dente25a.bmp |
| A1158 | frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/arc_dente22.png |
| A1159 | assets/Bitmaps/Dentes2d/arc_dente37a.bmp; assets/Bitmaps/Dentes2d/arc_dente37b.bmp; assets/Bitmaps/arc_dente37a.bmp; assets/Bitmaps/arc_dente37b.bmp |
| A1160 | assets/Bitmaps/arc_coroa_48.bmp |
| A1161 | frontend-react/public/assets/easy/int_RestMOD.bmp; frontend-react/public/assets/fichaClinica/odontograma/procedimentos/int_RestMOD.bmp; assets/Icones/int_RestMOD.bmp; assets/easy/int_RestMOD.bmp |
| A1162 | assets/Bitmaps/arc_fixa2_45.bmp |
| A1163 | frontend-react/public/assets/Icones/sim_30.bmp; frontend-react/public/assets/easy/sim_30.bmp; assets/Icones/sim_30.bmp; assets/easy/sim_30.bmp |
| A1164 | assets/Bitmaps/arc_coroa_34.bmp |
| A1165 | assets/Bitmaps/Dentes2d/arc_dente61a.bmp; assets/Bitmaps/arc_dente61a.bmp |
| A1166 | assets/Bitmaps/arc_rizectomia_46.bmp |
| A1167 | frontend-react/public/assets/easy/ico_dedoanamnese.bmp; assets/Icones/ico_dedoanamnese.bmp; assets/easy/ico_dedoanamnese.bmp |
| A1168 | frontend-react/public/assets/easy/cmd_finalizaint.bmp; assets/Icones/cmd_finalizaint.bmp; assets/easy/cmd_finalizaint.bmp |
| A1169 | assets/Bitmaps/Dentes2d/arc_dente33a.bmp; assets/Bitmaps/arc_dente33a.bmp |
| A1170 | assets/Bitmaps/Dentes2d/arc_dente72a.bmp; assets/Bitmaps/arc_dente72a.bmp |
| A1171 | assets/Bitmaps/arc_erosao_36.bmp |
| A1172 | assets/Bitmaps/Dentes2d/arc_dente16.bmp |
| A1173 | assets/Bitmaps/arc_remov1_i.bmp |
| A1174 | assets/Bitmaps/arc_bloco_13.bmp |
| A1175 | frontend-react/public/assets/easy/cmd_verificabkp.bmp; assets/Icones/cmd_verificabkp.bmp; assets/easy/cmd_verificabkp.bmp |
| A1176 | assets/Bitmaps/Dentes2d/arc_dente13b.bmp; assets/Bitmaps/arc_dente13b.bmp |
| A1177 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente27.bmp; assets/Bitmaps/Dentes3d/arc_dente27.bmp; assets/Bitmaps/arc_dente27.bmp; assets/easy/dentes/arc_dente27.bmp |
| A1178 | assets/Bitmaps/Dentes2d/arc_dente54.bmp |
| A1179 | assets/Bitmaps/arc_nucleo_46.bmp |
| A1180 | assets/Bitmaps/arc_fixa1_42.bmp |
| A1181 | frontend-react/public/assets/Icones/sim_simb7.bmp; frontend-react/public/assets/easy/sim_simb7.bmp; assets/Icones/sim_simb7.bmp; assets/easy/sim_simb7.bmp |
| A1182 | assets/Bitmaps/arc_capeamento_17.bmp |
| A1183 | assets/Bitmaps/arc_canal_37.bmp |
| A1184 | assets/Bitmaps/arc_descal_23.bmp |
| A1185 | assets/Bitmaps/Dentes2d/arc_dente37.bmp |
| A1186 | assets/Bitmaps/arc_rizectomia_38.bmp |
| A1187 | assets/Bitmaps/arc_nucleo_16.bmp |
| A1188 | assets/Bitmaps/Dentes2d/arc_dente55.bmp |
| A1189 | assets/Bitmaps/arc_erosao_43.bmp |
| A1190 | assets/Bitmaps/arc_coroa_62.bmp |
| A1191 | assets/Bitmaps/Dentes2d/arc_dente31a.bmp; assets/Bitmaps/arc_dente31a.bmp |
| A1192 | frontend-react/public/assets/fichaClinica/odontograma/especialidades/esp_Estetica.bmp; frontend-react/public/assets/easy/esp_Estética.bmp; assets/Icones/esp_Estética.bmp; assets/easy/esp_Estética.bmp |
| A1193 | assets/Bitmaps/arc_trep_33.bmp |
| A1194 | frontend-react/public/assets/easy/int_implante.bmp; assets/Icones/int_implante.bmp; assets/easy/int_implante.bmp |
| A1195 | assets/Bitmaps/Dentes2d/arc_dente31.bmp |
| A1196 | assets/Bitmaps/arc_bloco_73.bmp |
| A1197 | assets/Bitmaps/Dentes2d/arc_dente34.bmp |
| A1198 | assets/Bitmaps/Dentes2d/arc_inferior_dec.bmp |
| A1199 | assets/Bitmaps/arc_trep_28.bmp |
| A1200 | assets/Bitmaps/arc_enxerto_i.bmp |
| A1201 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente47.bmp; assets/Bitmaps/Dentes3d/arc_dente47.bmp; assets/Bitmaps/arc_dente47.bmp; assets/easy/dentes/arc_dente47.bmp |
| A1202 | assets/Bitmaps/arc_fluor_35.bmp |
| A1203 | assets/Bitmaps/arc_facet_36.bmp |
| A1204 | frontend-react/public/assets/fichaClinica/odontograma/dentes/arc_dente32.bmp; assets/Bitmaps/Dentes3d/arc_dente32.bmp; assets/Bitmaps/arc_dente32.bmp; assets/easy/dentes/arc_dente32.bmp |
| A1205 | frontend-react/public/assets/easy/cmd_odontograma.bmp; assets/Icones/cmd_odontograma.bmp; assets/easy/cmd_odontograma.bmp |
| A1206 | assets/Bitmaps/Dentes2d/arc_dente34b.bmp; assets/Bitmaps/arc_dente34b.bmp |
| A1207 | frontend-react/public/assets/easy/cmd_cancela.bmp; assets/Icones/cmd_cancela.bmp; assets/easy/cmd_cancela.bmp |
| A1208 | assets/Bitmaps/arc_erosao_33.bmp |
| A1209 | assets/Bitmaps/arc_fissu_16.bmp |
| A1210 | assets/Bitmaps/Dentes2d/arc_dente48a.bmp; assets/Bitmaps/Dentes2d/arc_dente48b.bmp; assets/Bitmaps/arc_dente48a.bmp; assets/Bitmaps/arc_dente48b.bmp |
| A1211 | assets/Bitmaps/arc_trep_16.bmp |
| A1212 | assets/Bitmaps/arc_capeamento_45.bmp |
| A1213 | frontend-react/public/assets/easy/int_raspger.bmp; assets/Bitmaps/ger_raspagem.bmp; assets/Icones/int_raspger.bmp; assets/easy/int_raspger.bmp |

## Slot, faces e composição

STATIC_CURRENT_MAPPING: superior 18 17 16 15 14 13 12 11 21 22 23 24 25 26 27 28; inferior 48 47 46 45 44 43 42 41 31 32 33 34 35 36 37 38.
React: arc_dente{FDI}.png em dentes-limpos. Não é DYNAMIC_SLOT_CONTRACT. Slot vazio mantém identidade/hitbox; imagem opcional.
arc_faces.bmp e variantes estão na matriz por hash: base visual, não contrato de anatomia/hitbox/pintura.
Camadas propostas: slot/hitbox → base → dente opcional → faces → símbolo/TIPMARCA → status/cor → seleção. BMP opaco requer compositor/máscara próprios.
UNUSED_ODONTOGRAM_ASSETS: candidatos Dentes3d/variantes/arc_* sem integração clínica React; NOT_DETECTED não prova ausência de uso dinâmico.
BRANA_VISUAL_COMPOSITION_CAPABILITY=PARCIAL; ASSETS_SUFFICIENT_TO_MATCH_DESKTOP=PARCIAL.
ASSET_GAPS=nenhuma referência gráfica ausente no snapshot; máscaras/cobertura integral não prometidas.
COMPOSITION_RULE_GAPS=hitboxes, máscaras/recoloração e compositor ainda futuros.
AUTHORIZATION_GAPS=Categoria C/UNPROVEN explicitamente classificada; não bloqueia documentação, mas bloqueia escolha desses arquivos sem autorização.
Ver [símbolos](odontograma_symbol_assets_matrix.md) e [contratos](odontograma_contracts.md).
