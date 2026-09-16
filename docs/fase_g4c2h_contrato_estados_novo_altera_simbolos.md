# G.4C.2H - Contrato Novo versus Altera

## 1. Evidências
- print Novo;
- print Altera sistema;
- confirmação X;
- React atual.

## 2. Novo usuário
- tipo: Definido pelo usuário selecionado; Sistema visível e desabilitado;
- campos: Nome, Especialidade e Forma editáveis;
- biblioteca: habilitada, com seleção única e atualização do preview;
- desenho: inicialmente vazio;
- X: desabilitado sem desenho, habilitado com desenho;
- lápis: habilitado;
- ações: Ok depende da validação mínima; Cancela sempre habilitado.

## 3. Altera sistema
- tipo: Sistema selecionado; Definido pelo usuário desabilitado;
- campos: contrato visual observado como protegido para o símbolo oficial;
- biblioteca: somente exposição visual, sem presumir troca de base;
- desenho: preview oficial persistido;
- X: desabilitado;
- lápis: desabilitado;
- ações: Ok e Cancela preservados conforme modal oficial.

## 4. Altera usuário
- tipo: definido pelo registro de usuário, com possibilidade de edição controlada;
- campos: Nome, Especialidade e Forma permanecem editáveis conforme contrato do registro;
- biblioteca: mantida com seleção única e atualização do preview;
- desenho: recebe o desenho local persistido;
- X: habilitado quando houver desenho;
- lápis: habilitado;
- ações: Ok persiste e Cancela descarta o estado local.

## 5. Matriz final
| Controle | Novo usuário | Altera sistema | Altera usuário |
|---|---|---|---|
| Sistema | visível e desabilitado | selecionado e protegido | não selecionado |
| Definido pelo usuário | selecionado | desabilitado | selecionado ou protegido conforme origem |
| Nome | habilitado | protegido | habilitado |
| Especialidade | habilitado | protegido | habilitado |
| Forma | habilitado | protegido | habilitado |
| Biblioteca | habilitada | somente exposição visual | habilitada |
| Preview | dependente de desenho | oficial persistido | desenho local persistido |
| X | desabilitado sem desenho; habilitado com desenho | desabilitado | habilitado com desenho |
| Lápis | habilitado | desabilitado | habilitado |
| Ok | depende da validação mínima | confirma alterações permitidas | persiste alterações |
| Cancela | habilitado | habilitado | habilitado |

## 6. Divergências
- EasyDental: Altera sistema usa o modal para consulta ou alterações permitidas do símbolo oficial;
- legado: evidencia comportamento visual distinto para sistema e usuário;
- React atual: já homologa preview, X e lápis no contrato de `Altera`, mas o contrato visual final precisa ser consolidado com a aprovação do usuário.

## 7. Decisões pendentes do usuário
- Nome em sistema: confirmar se permanece protegido;
- Especialidade em sistema: confirmar se permanece protegida;
- Forma em sistema: confirmar se permanece protegida;
- Biblioteca em sistema: confirmar se é somente exposição visual;
- Ok em sistema: confirmar quais alterações podem persistir.

## 8. Micropassos
- H.1: aplicar somente os estados visuais e disabled do modo Altera sistema;
- H.2: aplicar comportamento do Altera usuário, caso exista diferença;
- G.4C.3: somente depois, carregar o desenho no editor para os fluxos em que o lápis é permitido.

## 9. Código
- código alterado: nenhum;
- testes alterados: nenhum;
- banco alterado: nenhum.
