# Inventario tecnico de assets do odontograma

## 1. Objetivo
Registrar, em modo somente leitura, quais assets de imagem e quais arquivos de objeto existem no Brana Cloud e no EasyDental para orientar a evolucao visual futura do odontograma, sem copiar, converter ou editar qualquer arquivo legado.

## 2. Escopo
- Auditoria documental e visual somente leitura.
- Foco em imagens, arcadas, dentes, icones de comando, simbolos e arquivos `.dat` associados ao modelo do odontograma.
- Nenhuma alteracao em codigo, frontend, backend, banco, migrations, seeds, endpoints ou arquivos do EasyDental.
- Nenhum asset do EasyDental foi copiado para o Brana Cloud.

## 3. Pastas consultadas
- `D:\BRANA ARQUIVOS\BRANA CLOUD\assets\easy`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\assets\easy\dentes`
- `Y:\EDS70\Bitmaps`
- `Y:\EDS70\Bitmaps\Dentes2d`
- `Y:\EDS70\Bitmaps\Dentes3d`
- `Y:\EDS70\Icones`
- `Y:\EDS70\Objetos`

## 4. Inventario do Brana Cloud

### 4.1 Volume encontrado
- Total de BMPs em `assets/easy`: `313`
- BMPs na raiz de `assets/easy`: `261`
- BMPs na subpasta `assets/easy\dentes`: `52`

### 4.2 Assets candidatos diretos para o odontograma
- `assets/easy/arc_superior_perm.bmp`
- `assets/easy/arc_inferior_perm.bmp`
- `assets/easy/arc_faces.bmp`
- `assets/easy/dentes/arc_dente11.bmp`
- `assets/easy/dentes/arc_dente12.bmp`
- `assets/easy/dentes/arc_dente13.bmp`
- `assets/easy/dentes/arc_dente14.bmp`
- `assets/easy/dentes/arc_dente15.bmp`
- `assets/easy/dentes/arc_dente16.bmp`
- `assets/easy/dentes/arc_dente17.bmp`
- `assets/easy/dentes/arc_dente18.bmp`
- `assets/easy/dentes/arc_dente21.bmp` a `arc_dente28.bmp`
- `assets/easy/dentes/arc_dente31.bmp` a `arc_dente38.bmp`
- `assets/easy/dentes/arc_dente41.bmp` a `arc_dente48.bmp`
- `assets/easy/dentes/arc_dente51.bmp` a `arc_dente55.bmp`
- `assets/easy/dentes/arc_dente61.bmp` a `arc_dente65.bmp`
- `assets/easy/dentes/arc_dente71.bmp` a `arc_dente75.bmp`
- `assets/easy/dentes/arc_dente81.bmp` a `arc_dente85.bmp`

### 4.3 Icones de comando que podem ajudar na navegacao visual
- `assets/easy/cmd_odontograma.bmp`
- `assets/easy/cmd_historico.bmp`
- `assets/easy/cmd_anamnese.bmp`
- `assets/easy/cmd_calendario.bmp`

### 4.4 Assets do Brana Cloud que ainda ficam como duvidosos
- `sim_*` em geral, por serem simbolos pequenos e abstratos.
- `int_*` em geral, por parecerem icones de intervencao/procedimento.
- Outros BMPs legados da raiz de `assets/easy` que podem representar estados, marcadores ou procedimentos, mas ainda pedem inspecao individual antes de qualquer uso tecnico.

## 5. Inventario do EasyDental

### 5.1 Volume encontrado
- Total de BMPs em `Y:\EDS70\Bitmaps`: `1058`
- BMPs em `Y:\EDS70\Bitmaps\Dentes2d`: `142`
- BMPs em `Y:\EDS70\Bitmaps\Dentes3d`: `58`
- BMPs em `Y:\EDS70\Icones`: `258`
- Arquivos `.dat` em `Y:\EDS70\Objetos\arc_dente*.dat`: `52`

### 5.2 Assets odontologicos principais
- `Y:\EDS70\Bitmaps\Dentes2d\arc_superior_perm.bmp`
- `Y:\EDS70\Bitmaps\Dentes2d\arc_inferior_perm.bmp`
- `Y:\EDS70\Bitmaps\Dentes2d\arc_faces.bmp`
- `Y:\EDS70\Bitmaps\Dentes2d\arc_dente11.bmp`
- `Y:\EDS70\Bitmaps\Dentes2d\arc_dente11a.bmp`
- `Y:\EDS70\Bitmaps\Dentes2d\arc_dente11b.bmp`
- `Y:\EDS70\Bitmaps\Dentes2d\arc_dente21.bmp` a `arc_dente28.bmp`
- `Y:\EDS70\Bitmaps\Dentes2d\arc_dente31.bmp` a `arc_dente38.bmp`
- `Y:\EDS70\Bitmaps\Dentes2d\arc_dente41.bmp` a `arc_dente48.bmp`
- `Y:\EDS70\Bitmaps\Dentes2d\arc_dente51.bmp` a `arc_dente55.bmp`
- `Y:\EDS70\Bitmaps\Dentes2d\arc_dente61.bmp` a `arc_dente65.bmp`
- `Y:\EDS70\Bitmaps\Dentes2d\arc_dente71.bmp` a `arc_dente75.bmp`
- `Y:\EDS70\Bitmaps\Dentes2d\arc_dente81.bmp` a `arc_dente85.bmp`
- `Y:\EDS70\Icones\cmd_odontograma.bmp`
- `Y:\EDS70\Icones\cmd_historico.bmp`
- `Y:\EDS70\Icones\cmd_anamnese.bmp`
- `Y:\EDS70\Icones\cmd_calendario.bmp`
- `Y:\EDS70\Objetos\arc_dente11.dat` a `arc_dente85.dat`

### 5.3 Estruturas legadas que devem ser tratadas como apoio, nao como copia direta
- `arc_bandagem_*`
- `arc_bloco_*`
- `arc_canal_*`
- `arc_capeamento_*`
- `arc_coroa_*`
- `arc_ades_*`
- `arc_apicecto_*`
- `arc_aumento_*`
- `arc_bracket_*`
- familias `sim_*`, `int_*` e demais marcadores clinicos ligados ao fluxo de intervencao

## 6. Dimensoes e caracteristicas visuais confirmadas

### 6.1 Brana Cloud
- `assets/easy/arc_superior_perm.bmp`: `512x96`, `Format32bppRgb`
- `assets/easy/arc_inferior_perm.bmp`: `512x96`, `Format32bppRgb`
- `assets/easy/arc_faces.bmp`: `32x25`, `Format8bppIndexed`
- `assets/easy/dentes/arc_dente11.bmp`: `32x70`, `Format32bppRgb`
- `assets/easy/cmd_odontograma.bmp`: `21x21`, `Format4bppIndexed`
- `assets/easy/cmd_historico.bmp`: `21x21`, `Format4bppIndexed`
- `assets/easy/cmd_anamnese.bmp`: `21x21`, `Format4bppIndexed`
- `assets/easy/cmd_calendario.bmp`: `18x17`, `Format4bppIndexed`

### 6.2 EasyDental
- `Y:\EDS70\Bitmaps\Dentes2d\arc_superior_perm.bmp`: `512x96`, `Format32bppRgb`
- `Y:\EDS70\Bitmaps\Dentes2d\arc_inferior_perm.bmp`: `512x96`, `Format32bppRgb`
- `Y:\EDS70\Bitmaps\Dentes2d\arc_dente11.bmp`: `32x70`, `Format8bppIndexed`
- `Y:\EDS70\Bitmaps\Dentes2d\arc_dente11a.bmp`: `32x70`, `Format4bppIndexed`
- `Y:\EDS70\Bitmaps\Dentes2d\arc_dente11b.bmp`: `32x70`, `Format4bppIndexed`
- `Y:\EDS70\Bitmaps\arc_faces.bmp`: `32x25`, `Format8bppIndexed`
- `Y:\EDS70\Icones\cmd_odontograma.bmp`: `21x21`, `Format4bppIndexed`
- `Y:\EDS70\Icones\cmd_historico.bmp`: `21x21`, `Format4bppIndexed`
- `Y:\EDS70\Icones\cmd_anamnese.bmp`: `21x21`, `Format4bppIndexed`
- `Y:\EDS70\Icones\cmd_calendario.bmp`: `18x17`, `Format4bppIndexed`

## 7. Leitura funcional dos grupos

### 7.1 Arcadas
- As imagens `arc_superior_perm.bmp` e `arc_inferior_perm.bmp` funcionam como arcadas completas.
- O tamanho `512x96` sugere faixa horizontal larga, adequada para composicao principal da arcada.
- O desenho confirma que a leitura odontologica correta e composta por uma estrutura horizontal limpa, nao por um mosaico aleatorio de dentes.

### 7.2 Dentes
- Os `arc_denteXX.bmp` representam dentes isolados.
- O tamanho `32x70` confirma proporcao vertical estreita, coerente com desenho individual de cada dente.
- A familia `arc_dente11` a `arc_dente85` cobre a nomenclatura esperada por quadrante e numero dental.

### 7.3 Faces e marcadores
- `arc_faces.bmp` e muito pequeno e parece servir como legenda, face ou marcador auxiliar.
- Os grupos `sim_*` e `int_*` parecem reforcar estados, simbolos e procedimentos, mas ainda nao devem ser tratados como base principal da arcada.

### 7.4 Objetos `.dat`
- Os `arc_dente*.dat` sugerem geometria, posicao, metadados ou configuracao do objeto dentario.
- O conjunto com 52 arquivos reforca que o odontograma legava dados visuais e estruturais separados.
- Esses arquivos sao essenciais para entender a composicao, mas nao devem ser copiados nem reinterpretados diretamente sem contrato tecnico proprio.

## 8. Relacao com a composicao correta do odontograma
- A composicao correta parece nascer da soma de quatro camadas:
- arcada base superior/inferior;
- dentes individuais por numero;
- marcadores/estados/procedimentos por cima da arcada;
- arquivos de objeto `.dat` como suporte estrutural.
- A comparacao com os assets do Brana Cloud mostra que o repositorio local ja possui um pacote candidato suficiente para orientar a futura composicao, sem depender de copiar o legado.

## 9. Comparacao com a implementacao atual D1-F
- A D1-F atual em Brana ja entrega uma leitura odontologica isolada, com renderer dedicado e arcadas mockadas.
- Porem, a D1-F ainda nao consome estes assets como fonte visual direta.
- A D1-F usa uma composicao funcional, mas simplificada, enquanto o inventario confirma que ha base visual suficiente para um refinamento posterior mais preciso.
- Este inventario nao muda a D1-F; apenas mostra o que existe para uma eventual D1-F2 ou equivalente.

## 10. Restricoes legais e tecnicas
- Nao copiar assets do EasyDental.
- Nao alterar arquivos legados do EasyDental.
- Nao depender do nome do arquivo como contrato funcional definitivo.
- Nao transformar a auditoria em implementacao.
- Nao acoplar a V1 a uma linguagem raster antiga sem decisao tecnica formal.
- Tratar os assets como referencia de proporcao, sem reproduzir o legado literalmente.

## 11. Proposta da proxima implementacao
- Usar este inventario para desenhar uma fase futura de refinamento visual, se e somente se houver contrato tecnico aprovado.
- Priorizar a leitura da arcada e dos dentes antes de qualquer camada de marcador.
- Decidir depois se a V1 vai apenas simular a leitura ou se vai absorver alguma semantica visual adicional.
- Manter o renderer atual modular e previsivel.

## 12. Onde testar depois
- Testar primeiro em ambiente local do Brana Cloud, abrindo a tela odontologica isolada.
- Conferir se a arcada continua legivel sem importar o legado BMP.
- Validar se a composicao futura respeita a proporcao de `512x96` para arcadas e `32x70` para dentes.
- Garantir que nenhum arquivo do EasyDental foi movido ou reutilizado sem autorizacao.

## 13. Registro para roadmap
- Inventario tecnico de assets do odontograma concluido.
- Brana Cloud ja possui candidatos locais de arcada, dentes e comandos visuais.
- EasyDental confirma a familia completa de arcadas, dentes, objetos `.dat`, simbolos e icones auxiliares.
- Resultado operacional: ha material suficiente para orientar uma futura refinacao visual, mas nao para importar o legado diretamente para a V1.
