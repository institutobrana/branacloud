# Mapeamento de Referencias - Simbolos Graficos - Frontend React

## Objetivo
Mapear as referencias visuais, estruturais e comportamentais do novo frontend React que devem orientar a futura tela `Configuracoes > Simbolos graficos`.

## Premissas
- Esta frente nao implementa tela React.
- O codigo atual continua sendo a fonte da verdade.
- Tudo abaixo distingue entre fato comprovado, inferencia e lacuna.

## Referencias principais do novo frontend React

### 1. ADM -> Usuarios
- Arquivos principais:
  - `frontend-react/src/features/admin/clinics/ClinicsPage.jsx`
  - `frontend-react/src/features/admin/clinics/components/ClinicsTable.jsx`
  - `frontend-react/src/features/admin/clinics/components/ClinicsToolbarContent.jsx`
  - `frontend-react/src/features/admin/clinics/hooks/useClinicsTableState.js`
  - `frontend-react/src/features/admin/clinics/utils/adminClinicsTable.js`
- Fato comprovado:
  - Usa shell de modulo com tabela compacta.
  - Usa barra de acoes horizontal com grupos de botoes.
  - Usa filtragem/sort em tabela.
  - Usa contador/rodape de itens.
  - Usa componentes separados por responsabilidade.
- Inferencia:
  - E a melhor referencia visual para um modulo de configuracao com grade compacta e acoes principais.

### 2. Servicos de Protetico
- Arquivos principais:
  - `frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx`
  - `frontend-react/src/features/servicosProtetico/components/ServicosProteticoTable.jsx`
  - `frontend-react/src/features/servicosProtetico/components/ServicoProteticoModal.jsx`
- Fato comprovado:
  - Mantem pagina com tabela principal e modal separado.
  - Possui estado para criacao, edicao, exclusao e refresh.
  - Exibe filtros eacaoes em layout discreto.
- Inferencia:
  - Serve como referencia de separacao entre listagem e modal de manutencao.

### 3. Medicamentos
- Arquivos principais:
  - `frontend-react/src/features/medicamentos/MedicamentosPage.jsx`
  - `frontend-react/src/features/medicamentos/MedicamentosTable.jsx`
  - `frontend-react/src/features/medicamentos/useMedicamentos.js`
- Fato comprovado:
  - Modulariza pagina, tabela, hook e servicos.
  - Mantem area de listagem mais simples que telas historicas grandes.
- Inferencia:
  - E uma boa referencia para uma pagina administrativa enxuta.

### 4. Questionarios de anamnese
- Arquivos relevantes no app legado/React correlato:
  - `frontend-react/src/features/fichaClinica/FichaClinicaPage.jsx`
  - `frontend-react/src/features/doencasCid/DoencasCidPage.jsx`
  - documentos historicos de anamnese em `docs/`
- Fato comprovado:
  - Ha padrao de shell com tabela compacta e blocos funcionais separados.
- Inferencia:
  - Esses modulos ajudam a entender como a UI deve conviver com outros fluxos odontologicos sem virar monolito.

## Padrão de shell visual que deve orientar a futura tela

### Estrutura em "L"
- Evidencia forte em:
  - `frontend-react/src/layout/BranaActionTopbar.jsx`
  - `frontend-react/src/layout/BranaIconRail.jsx`
  - `frontend-react/src/layout/BranaContextPanel.jsx`
- Fato comprovado:
  - Existe rail lateral.
  - Existe topbar horizontal.
  - O app React usa composicao entre lateral e barra superior.
- Inferencia:
  - A futura tela de simbolos graficos deve encaixar nesse shell, com painel lateral e faixa horizontal unidas em "L".

### Tabela compacta
- Evidencia forte em:
  - `frontend-react/src/features/admin/clinics/components/ClinicsTable.jsx`
  - `frontend-react/src/features/doencasCid/components/DoencaCidTable.jsx`
  - `frontend-react/src/features/unidadesAtendimento/components/UnidadesAtendimentoTable.jsx`
- Fato comprovado:
  - As tabelas usam densidade compacta, colunas fixas e contagem de rodape.
- Inferencia:
  - A futura tabela de simbolos graficos deve seguir essa logica, com colunas `Nome` e `Especialidade`.

## Elementos de arquitetura que devem ser preservados
- Separacao entre:
  - pagina;
  - tabela;
  - toolbar;
  - API;
  - hooks;
  - formularios;
  - modais;
  - validacoes;
  - mappers;
  - testes.
- Fato comprovado:
  - O novo frontend ja segue esse estilo em varios modulos.

## Lacunas
- Nao foi encontrado ainda um modulo React especifico para `Simbolos graficos`.
- Nao foi implementada nenhuma rota React para este modulo.
- Nao foi validado layout visual final em tela real.

## Fontes lidas
- `frontend-react/src/features/admin/clinics/ClinicsPage.jsx`
- `frontend-react/src/features/admin/clinics/components/ClinicsTable.jsx`
- `frontend-react/src/features/admin/clinics/components/ClinicsToolbarContent.jsx`
- `frontend-react/src/features/admin/clinics/hooks/useClinicsTableState.js`
- `frontend-react/src/features/medicamentos/MedicamentosPage.jsx`
- `frontend-react/src/features/medicamentos/MedicamentosTable.jsx`
- `frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx`
- `frontend-react/src/features/unidadesAtendimento/UnidadesAtendimentoPage.jsx`
- `frontend-react/src/layout/BranaActionTopbar.jsx`
- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/layout/BranaContextPanel.jsx`
