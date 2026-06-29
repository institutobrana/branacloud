# Mapeamento de icones de intervencoes do odontograma

## Objetivo

Registrar o mapeamento seguro dos icones da barra superior da Ficha Clinica/Odontograma no `frontend-react`, usando a referencia privada do EasyDental apenas para descobrir nomes de arquivo e metadados.

## Regra de uso da referencia privada

- A referencia em `_referencias_privadas/easydental_top/top` foi usada somente para ler:
  - `id_especialidade`
  - `cd_especialidade`
  - `id_simbolo_odonto`
  - `tx_descricao`
  - `tx_nome_icone`
- Nenhuma imagem, CSS ou JavaScript do EasyDental foi copiado para runtime.
- Os arquivos publicados em `frontend-react/public/assets/fichaClinica/odontograma/procedimentos/` vieram exclusivamente de `assets/images`.

## Arquivos lidos na auditoria

- `_referencias_privadas/easydental_top/top/app.easydentalcloud.com.br/1_0_47_56/app/view/fichaClinica/ListEspecialidade.js`
- `_referencias_privadas/easydental_top/top/app.easydentalcloud.com.br/1_0_47_56/app/view/fichaClinica/ListOdontograma.js`
- `_referencias_privadas/easydental_top/top/app.easydentalcloud.com.br/1_0_47_56/app/control/Odontograma.js`
- `_referencias_privadas/easydental_top/top/app.easydentalcloud.com.br/1_0_47_56/Service.svc/simbolo_odonto.xml`
- `_referencias_privadas/easydental_top/top/app.easydentalcloud.com.br/1_0_47_56/Service.svc/especialidade/890.xml`

## Tabela de mapeamento

| Especialidade | Procedimento | Arquivo EasyDental | Arquivo Brana usado | Status |
| --- | --- | --- | --- | --- |
| Cirur | Apicectomia | `int_apicecto.bmp` | `int_apicecto.bmp` | encontrado exato |
| Cirur | Aprf./Aum. de vestibulo | `int_aprof_vestib.png` | `int_aprof_vestib.png` | encontrado exato |
| Cirur | Biopsia de labio | `int_biop_labio.png` | `int_biop_labio.png` | encontrado exato |
| Cirur | Biopsia de lingua | `int_biop_ling.png` | `int_biop_ling.png` | encontrado exato |
| Cirur | Biopsia de mandibula | `int_biop_mand.png` | `int_biop_mand.png` | encontrado exato |
| Cirur | Biopsia de maxila | `int_biop_maxila.png` | `int_biop_maxila.png` | encontrado exato |
| Cirur | Cirurgia | `int_cirur.bmp` | `int_cirur.bmp` | encontrado exato |
| Cirur | Cirurgia para exostose maxilar | `int_exostose_max.png` | `int_exostose_max.png` | encontrado exato |
| Cirur | Cirurgia para torus mandibular | `int_torus_mand.png` | `int_torus_mand.png` | encontrado exato |
| Cirur | Cirurgia para torus palatino | `int_torus_palat.png` | `int_torus_palat.png` | encontrado exato |
| Cirur | Exodontia | `int_boticao.bmp` | `int_boticao.bmp` | encontrado exato |
| Cirur | Hemisseccao | `int_hemi.bmp` | `int_hemi.bmp` | encontrado exato |
| Cirur | Implante | `int_implante.bmp` | `int_implante.bmp` | encontrado exato |
| Cirur | Rizectomia | `int_rizec.bmp` | `int_rizec.bmp` | encontrado exato |
| Dent | Generico 1 | `int_generico01.bmp` | `int_generico01.bmp` | encontrado exato |
| Dent | Generico 2 | `int_generico02.bmp` | `int_generico02.bmp` | encontrado exato |
| Dent | Generico 3 | `int_generico03.bmp` | `int_generico03.bmp` | encontrado exato |
| Dent | Generico 4 | `int_generico04.bmp` | `int_generico04.bmp` | encontrado exato |
| Geral | Consulta | `int_consulta.bmp` | `int_consulta.bmp` | encontrado exato |
| Orto | Placa de mordida | `int_mordida.bmp` | `int_mordida.bmp` | encontrado exato |
| Perio | Enxerto | `int_enxerto.bmp` | `int_enxerto.bmp` | encontrado exato |
| Perio | Frenectomia | `int_frenec.bmp` | `int_frenec.bmp` | encontrado exato |
| Perio | Raspagem para arcada | `int_raspagem.bmp` | `int_raspagem.bmp` | encontrado exato |
| Perio | Retalho | `int_retalho.bmp` | `int_retalho.bmp` | encontrado exato |
| Perio | Ulectomia | `int_ulecto.bmp` | `int_ulecto.bmp` | encontrado exato |
| Prev | Aplicacao de fluor | `int_fluor.bmp` | `int_fluor.bmp` | encontrado exato |

## Icones encontrados

- Total de icones EasyDental auditados no XML: `26`
- Correspondencias seguras em `assets/images`: `26`
- Correspondencias publicadas na tela: `26`

## Estrutura das barras

- Barra superior de intervencoes: usa somente `safeClinicProcedureItemsByCategory` no `FichaClinicaPage.jsx`.
- Barra inferior de especialidades: renderiza somente `category.label` em `ClinicSpecialtyButton`.
- Foram removidos da barra inferior os estilos residuais ligados a:
  - `.ficha-clinica-specialty-category-icon-wrap`
  - `.ficha-clinica-clinic-category-icon-image`
  - `.ficha-clinica-clinic-category-icon`
- A barra inferior tambem ficou com `background-image: none`, sem miniatura, sem pseudo-elemento grafico e sem renderer de imagem.

## Pendencias

- O XML extraido de `simbolo_odonto.xml` cobre somente icones das especialidades `Cirur`, `Dent`, `Geral`, `Orto`, `Perio` e `Prev`.
- As especialidades `Diag`, `Emer`, `Endo`, `Espec`, `Estet`, `Estom`, `HOF`, `Impla`, `OdPed`, `Ortop`, `Prot` e `Radio` ficaram sem simbolos auditados nesse material extraido.
- Para essas especialidades, a barra superior foi mantida em modo seguro com apenas o atalho de pesquisa, sem inventar icones.

## Arquivos alterados

- `frontend-react/src/features/fichaClinica/FichaClinicaPage.jsx`
- `frontend-react/src/features/fichaClinica/fichaClinica.css`
- `frontend-react/public/assets/fichaClinica/odontograma/procedimentos/`

## Confirmacoes

- Nenhuma imagem do EasyDental foi copiada.
- `_referencias_privadas` nao foi importada no frontend.
- O runtime continua usando somente assets proprios do Brana.
