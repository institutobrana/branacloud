# Ficha Pessoal - Histórico: contrato e auditoria inicial

## 1. Objetivo
Registrar a auditoria inicial da aba **Histórico** da Ficha Pessoal, descrevendo como ela funciona hoje no Brana Cloud, quais arquivos/fluxos participam, quais modelos/endpoints existem ou não existem, e qual será o plano seguro de evolução por subetapas.

## 2. Classificação do módulo
O módulo **Histórico da Ficha Pessoal** é tratado como **módulo comum/core**.

## 3. Referência funcional do EasyDental
O comportamento alvo informado pelo usuário segue o EasyDental e usa como referência funcional:
- botões `Inserir linha`, `Edita linha`, `Elimina linha` e `Propriedades da linha`;
- tabela com 4 colunas: `Data`, `Cirurgião`, `Região` e `Descrição do procedimento`;
- fluxo de `ENTER`, `ESC` e `TAB`;
- integração com o botão geral `Grava` da Ficha Pessoal;
- janela de propriedades da linha com campos adicionais.

## 4. Estado atual da aba Histórico no Brana
Hoje a aba Histórico está montada em `frontend/app.js` e ainda está em estado **próximo de protótipo/tela local**:
- os botões disponíveis são `Novo historico`, `Altera historico`, `Elimina historico` e `Confirma`;
- a grade atual usa 4 colunas visuais: `Data`, `Cirurgiao`, `Regiao` e `Historico`;
- o botão `Novo historico` apenas insere uma linha no DOM com valores texto fixos e seleciona a aba Histórico;
- `Altera historico` e `Confirma` exibem mensagens de planejamento;
- `Elimina historico` remove a primeira linha exibida na tabela;
- não foi encontrado fluxo visual equivalente ao `Propriedades da linha` do EasyDental;
- não foi encontrado tratamento de `ENTER`, `ESC` ou `TAB` específico para edição de histórico;
- o botão `Grava` da Ficha Pessoal não está integrado a uma persistência real de histórico;
- a aba é liberada apenas quando há paciente válido, por meio do mesmo guard usado para Anamnese.

## 5. Arquivos analisados
- [`frontend/app.js`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\frontend\app.js)
- [`frontend/js/modules/ficha-pessoal-aba-anamnese.js`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\frontend\js\modules\ficha-pessoal-aba-anamnese.js)
- [`frontend/js/modules`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\frontend\js\modules)
- [`backend/models/paciente.py`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\backend\models\paciente.py)
- [`backend/models`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\backend\models)
- [`backend/routes/cadastros_routes.py`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\backend\routes\cadastros_routes.py)
- [`backend/routes`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\backend\routes)
- [`docs/11_roadmap_desenvolvimento.md`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\docs\11_roadmap_desenvolvimento.md)

## 6. Modelos, endpoints e fluxos encontrados
### Modelos
- [`backend/models/paciente.py`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\backend\models\paciente.py) representa o paciente e contém campos como `anotacoes`, mas não contém campo próprio de histórico clínico da aba.
- Não foi encontrado modelo dedicado à aba Histórico da Ficha Pessoal.

### Endpoints e fluxos
- A gravação da Ficha Pessoal usa o fluxo de paciente em `frontend/app.js`, por meio de `fichaSalvarPaciente()`.
- O payload do paciente é montado por `fichaPayloadAtual()`.
- O payload atual não inclui lista estruturada de histórico da aba.
- Não foi encontrado endpoint dedicado para persistência da aba Histórico da Ficha Pessoal.
- O `cadastro-ficha-historico` do menu está tratado como ação em planejamento, não como implementação persistente da aba.

## 7. Diferença entre Brana atual e EasyDental
### Brana atual
- botões diferentes dos botões do EasyDental;
- comportamento de inserção/eliminaçao ainda local e simplificado;
- ausência de fluxo equivalente a `Propriedades da linha`;
- ausência de edição por linha com atalhos `ENTER`, `ESC` e `TAB`;
- ausência de persistência estruturada específica da aba.

### EasyDental
- botões e fluxo de linha mais próximos de uma grade editável dedicada;
- navegação e confirmação por teclado;
- janela de propriedades da linha;
- salvamento integrado ao fluxo geral da Ficha Pessoal.

## 8. Riscos principais
- tentar migrar a aba inteira de uma vez;
- acoplar a UI nova ao `frontend/app.js` global sem modularização;
- introduzir persistência sem contrato de dados;
- misturar comportamento visual com alterações de backend antes de fechar o desenho;
- perder o alinhamento com o EasyDental por falta de subetapas pequenas.

## 9. Plano seguro de subetapas
1. Contrato/auditoria inicial da aba Histórico.
2. Modularização passiva inicial em `frontend/js/modules/ficha-pessoal-aba-historico.js`.
3. Alinhamento visual e revisão dos botões.
4. Seleção/linha ativa.
5. Inserir linha.
6. Navegação por `TAB`.
7. `ENTER` e `ESC`.
8. Integração com o botão `Grava`.
9. Editar linha.
10. Eliminar linha.
11. Propriedades da linha.
12. Validação final manual.

## 10. Futuro módulo previsto
A futura extração modular da aba deverá nascer em:
- [`frontend/js/modules/ficha-pessoal-aba-historico.js`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\frontend\js\modules\ficha-pessoal-aba-historico.js)

## 11. Subetapas em que será útil solicitar prints do EasyDental
- ajuste visual da aba;
- propriedades da linha;
- validação final antes de fechar o comportamento funcional.

## 12. Conclusão
A aba Histórico da Ficha Pessoal no Brana Cloud hoje está montada no `frontend/app.js`, com botões e grade local simples, sem um backend dedicado nem um módulo próprio ainda. A evolução correta deve ser conservadora, por subetapas pequenas, com futura modularização em `ficha-pessoal-aba-historico.js`, sem mexer em persistência até que o contrato de dados esteja fechado.
