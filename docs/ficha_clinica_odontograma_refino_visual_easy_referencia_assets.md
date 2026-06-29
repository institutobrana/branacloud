# Ficha clinica odontograma - refino visual por referencia EasyDental e assets proprios

## Objetivo da etapa

Ajustar visualmente a tela Ficha clinica/Odontograma do Brana Cloude para ficar mais proxima da referencia observada do EasyDental, sem copiar codigo, CSS ou imagens proprietarias.

## Referencia usada

A referencia privada/local do EasyDental foi usada apenas para consulta visual, estrutural e funcional:

- proporcao da topbar
- densidade do shell principal
- proximidade entre odontograma e painel de tratamento
- leitura do painel lateral direito
- ordem visual do odontograma, especialidades, abas Boca/Dente e painel inferior

Nenhum arquivo de `_referencias_privadas/` foi importado em runtime.

## Arquivos do Brana alterados

- `frontend-react/src/layout/BranaActionTopbar.jsx`
- `frontend-react/src/styles/globals.css`
- `frontend-react/src/features/fichaClinica/FichaClinicaPage.jsx`
- `frontend-react/src/features/fichaClinica/fichaClinica.css`

## Assets proprios usados

Foram usados assets proprios ja existentes no Brana, servidos pela pasta publica do frontend-react:

- `frontend-react/public/assets/fichaClinica/odontograma/dentes-limpos/*.png`
- `frontend-react/public/assets/fichaClinica/odontograma/arc_faces.bmp`
- `frontend-react/public/assets/fichaClinica/odontograma/especialidades/*.bmp`
- `frontend-react/public/assets/fichaClinica/odontograma/procedimentos/*.bmp`

Esses assets pertencem ao acervo proprio/local ja organizado da frente visual do Brana e nao foram lidos de `_referencias_privadas/` em runtime nesta etapa.

## Diferencas ajustadas

- barra superior compactada e sem a frase "Sistema de Gestao Odontologica."
- logo mais enxuto e mais proximo da esquerda
- toolbar superior com densidade mais tecnica
- rail lateral esquerda mantida em teal com leitura mais compacta
- odontograma ampliado para ocupar mais largura util
- coluna de Tratamento aproximada do odontograma
- barra de especialidades convertida para icone em cima e abreviacao abaixo
- bloco Boca/Dente reforcado com borda, altura e mensagem central
- painel lateral direito teal estreitado e calendario compactado
- textos e botoes do painel direito reduzidos para leitura mais proxima da referencia

## Pendencias visuais restantes

- ainda pode haver novo ajuste fino de largura entre odontograma e tabela de Tratamento em desktop muito largo
- a iconografia de algumas especialidades/procedimentos pode evoluir em etapa futura, caso o inventario proprio do Brana seja ampliado
- a area Financeiro/Timeline/Documentos/Anotacoes permanece visualmente preparada, mas ainda em modo placeholder

## Confirmacoes de seguranca e escopo

- EasyDental foi usado apenas como referencia privada/local
- nenhum codigo do EasyDental foi copiado
- nenhum CSS do EasyDental foi copiado
- nenhuma imagem do EasyDental foi copiada nesta etapa
- nenhum arquivo de `_referencias_privadas/` foi importado pelo frontend
