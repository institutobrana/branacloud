# Fechamento DC.CLOSE.1 — Dados complementares da Ficha Pessoal

Data: 2026-08-26
Produto: Brana Cloude
Escopo: `Cadastro -> Pacientes -> Ficha Pessoal -> Dados complementares`

## Veredito

A aba foi implementada, integrada ao estado central da Ficha e homologada pelo usuário em runtime. Esta documentação encerra a frente sem nova alteração funcional. EasyDental permanece como referência futura de paridade.

## Arquitetura e controles

A aba preserva o grid desktop de 12 colunas e a ordem legada: identificação/responsabilidade; unidade e cirurgião; dados familiares; identificação complementar; dados profissionais; endereço comercial; quatro palavras-chave; e as flags Público para a clínica e Titular da família.

Os 29 controles homologados são: Prontuário (`matricula`); Titular/responsável (`extra.responsavel`); CPF do responsável (`extra.cpf_responsavel`); Unidade (`extra.unidade_atendimento`); Cirurgião (`extra.cirurgiao_responsavel`); Nome do pai (`extra.nome_pai`); Nome da mãe (`extra.nome_mae`); Estado civil (`extra.estado_civil_comp`); Nome do cônjuge (`extra.nome_conjuge`); CPF do cônjuge (`extra.cpf_conjuge`); Profissão do cônjuge (`extra.profissao_conjuge`); Apelido (`extra.apelido`); Naturalidade (`extra.naturalidade`); Nacionalidade (`extra.nacionalidade`); Profissão (`extra.profissao`); Local de trabalho (`extra.local_trabalho`); Horário de trabalho (`extra.horario_trab`); Endereço comercial (`extra.end_tra`); Complemento (`extra.com_tra`); Bairro (`extra.bai_tra`); Cidade (`extra.cid_tra`); CEP (`extra.cep_tra`); UF (`extra.est_tra`); Palavras-chave 1 a 4 (`extra.palavra_chave_1` a `extra.palavra_chave_4`); Público (`extra.publico`); e Titular (`extra.titular`).

Textos são livres e hidratam ausentes como `""`; flags são booleanas e hidratam ausentes como `false`. Não foram introduzidas validações, máscaras ou vínculos novos.

## Catálogos e preservação

Unidade e Cirurgião mantêm valores textuais. Estado civil, Bairro, Cidade e Palavra-chave reutilizam os auxiliares oficiais. UF usa a lista fixa da Ficha. Valores históricos fora dos catálogos são exibidos e preservados sem substituição automática, sem duplicação artificial e sem perda; palavras-chave aceitam limpeza por `allowClear`/X e retornam ao estado vazio (`""`).

## CEP comercial

O CEP comercial reutiliza a regra homologada de CEP da Ficha e preenche somente o endereço comercial: `end_tra`, `bai_tra`, `cid_tra` e `est_tra`, preservando edição manual e isolamento do endereço residencial. A resposta externa não é persistida.

## Autocomplete e CPF

Responsável, pai, mãe e cônjuge continuam campos textuais livres. As sugestões usam o sobrenome completo da Ficha, sem parsing, e a seleção copia apenas `nome_completo`. Não há FK nem ID persistido. Na seleção de responsável, o CPF cadastrado é copiado para `extra.cpf_responsavel`; edição manual segue o validador reutilizado de Dados pessoais. A regra não reconstitui vínculos ao reabrir a ficha.

## Grava global e round-trip

Não existe botão de gravação próprio. A aba participa do `Grava` global da Ficha. `matricula` é enviado na coluna direta; os complementares seguem em `extra`; `horario_trabalho` não é utilizado. O backend existente aplica `_merge_extra_payload()`, preservando chaves desconhecidas e tratando `null` como remoção apenas quando explicitamente enviado. A homologação do usuário confirmou persistência, reabertura e round-trip dos valores, inclusive valores históricos fora de catálogo e limpeza das palavras-chave.

## Implementação e arquivos da frente

Arquivos específicos:

- `frontend-react/src/features/pacientes/components/fichaPessoal/dadosComplementares/DadosComplementaresTab.jsx`
- `frontend-react/src/features/pacientes/components/fichaPessoal/dadosComplementares/DadosComplementaresField.jsx`
- `frontend-react/src/features/pacientes/components/fichaPessoal/dadosComplementares/dadosComplementaresOptions.js`
- `frontend-react/src/features/pacientes/components/fichaPessoal/dadosComplementares/dadosComplementares.test.js`

Integrações compartilhadas da Ficha:

- `FichaPessoalModal.jsx`
- `useFichaPessoalForm.js`
- `fichaPessoalApi.js`
- `fichaPessoal.css`

O diretório congelado do Histórico não foi alterado nesta frente de fechamento.

## Verificações

- Testes focais Dados complementares + Histórico: **14 PASS / 0 FAIL**.
- Teste backend existente de sugestões por sobrenome: **5 PASS / 0 FAIL**.
- Suíte combinada anteriormente registrada para busca por sobrenome e Histórico: **12 PASS / 0 FAIL**.
- `npm run build`: **PASS**; apenas aviso não bloqueante de tamanho de chunks.
- `git diff --check`: será registrado no commit de fechamento.
- Runtime: **PASS conforme homologação manual do usuário** para paciente existente, Novo cadastro, catálogos, CEP, autocompletes, CPF, Grava, reabertura e limpeza das palavras-chave. Não houve nova escrita manual nesta etapa documental.

## Pendências futuras, fora do fechamento

- eventual modernização dos vínculos familiares, sem criar FK nesta frente;
- eventual normalização de Unidade e Cirurgião para IDs;
- estudo futuro da relação entre `Paciente.apelido` e `extra.apelido`;
- paridade adicional com EasyDental.

Essas pendências não bloqueiam a aba homologada atual.

## Âncora

Commit funcional de fechamento: `437b4efd5976a123f6686b72a1951968f896c6fa`.

Tag anotada local: `anchor-pacientes-dados-complementares-react-homologado-2026-08-26`.

O commit documental final registra esta referência. Push, AWS, deploy, banco e EasyDental permanecem fora do escopo.
