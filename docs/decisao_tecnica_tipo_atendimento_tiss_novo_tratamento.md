# Decisao tecnica - fonte do Tipo de atendimento (TISS) do modal `Novo tratamento`

## 1. Identificacao

Produto: Brana Cloude

Modulo: Tratamento

Tela: `Menu Tratamento -> Novo tratamento`

Area especifica: aba `Convenio`, combo `Tipo de atendimento (TISS)`

Natureza deste documento: decisao tecnica formal

Status: documental apenas

## 2. Decisao tomada

A fonte correta para o combo `Tipo de atendimento (TISS)` deve ser um **catalogo proprio no backend**, separado de `tiss_tipo_tabela`, com os cinco valores do EasyDental cadastrados de forma controlada.

Em termos práticos:

- nao usar `tiss_tipo_tabela` para este combo;
- nao deixar a lista hardcoded no frontend;
- nao depender de fallback visual genérico para representar o legado;
- manter a leitura no frontend como consumo passivo do payload do backend;
- manter o campo de persistencia de tratamento ja existente.

## 3. Nome tecnico recomendado da fonte

Nome recomendado para a nova fonte:

- `tiss_tipo_atendimento`

Nome recomendado para a funcao de leitura:

- `_listar_tipos_atendimento_tiss`

Nome recomendado para o payload do backend:

- `tipos_atendimento_tiss`

## 4. Justificativa da decisao

### 4.1 Diferenca conceitual

O EasyDental separa dois conceitos:

- `tipo de atendimento TISS`
- `tipo de tabela TISS`

O Brana Cloude hoje mistura esses conceitos ao usar `tiss_tipo_tabela` no combo errado.

### 4.2 Menor risco operacional

Um catalogo proprio no backend reduz risco porque:

- evita duplicacao de regra no frontend;
- permite validação e persistencia coerentes;
- deixa a fonte controlada em um unico ponto;
- preserva o payload do modal;
- facilita a equivalencia com o legado.

### 4.3 Compatibilidade futura

Como o campo de tratamento ja existe:

- `tipo_atendimento_tiss_id`
- `tipo_atendimento_tiss_nome`

a nova fonte encaixa sem precisar mudar a estrutura principal do tratamento.

## 5. Escopo da nova fonte

A nova fonte deve conter exatamente os itens observados no EasyDental:

1. `Tratamento Odontológico`
2. `Exame Radiológico`
3. `Ortodontia`
4. `Urgênica/Emergência`
5. `Auditoria`

Esses itens devem ser tratados como catalogo controlado, com possibilidade de expansao futura apenas se houver nova decisao documental.

## 6. Forma de armazenamento recomendada

A forma recomendada e:

- tabela propria no banco do Brana;
- seed aditivo para popular os cinco itens iniciais;
- leitura via backend com filtro e ordenacao controlados.

Motivos:

- o catalogo e pequeno;
- os itens sao estaveis;
- a lista precisa ser persistida e reutilizavel;
- o frontend nao deve manter lista fixa como fonte da verdade.

## 7. Fronteira tecnica da mudanca

### 7.1 Arquivos com impacto esperado

- `backend/routes/tratamentos_routes.py`
- novo model para `tiss_tipo_atendimento`, se necessario
- possivel seed ou script aditivo
- `frontend/js/modules/novo-tratamento-modal.js` apenas como consumidor

### 7.2 Arquivos que nao devem ser usados como fonte desta lista

- `backend/models/tiss_tipo_tabela.py`
- `frontend/js/modules/novo-tratamento-modal.js` como origem hardcoded
- qualquer fallback genérico que represente `Outras Tabelas`

## 8. Regras de implementacao derivadas da decisao

- a lista deve sair do backend;
- o frontend deve apenas renderizar o payload;
- o valor salvo deve continuar sendo persistido no tratamento;
- a reabertura deve continuar reconhecendo o valor salvo;
- o default deve ser definido com base no novo catalogo;
- nenhuma outra lista TISS deve ser alterada por efeito colateral.

## 9. Criterios de aceite desta decisao

Esta decisao so e considerada util se, depois da implementacao futura:

- o combo mostrar os cinco itens do EasyDental;
- a lista errada deixar de aparecer;
- o tratamento continuar gravando e reabrindo corretamente;
- o frontend nao precisar conhecer a origem interna do catalogo;
- a separacao entre `tipo de atendimento TISS` e `tipo de tabela TISS` ficar clara no codigo.

## 10. Riscos que esta decisao evita

- confusao semantica entre tabelas diferentes;
- hardcode duplicado no frontend;
- dependencia de fallback genérico;
- quebra de edicao por reuso de id errado;
- regressao em outros combos da aba `Convenio`.

## 11. Proximo passo recomendado

Depois desta decisao, o proximo passo tecnico seguro e:

1. criar a tabela/seed do novo catalogo;
2. adicionar a leitura no backend;
3. trocar somente o provedor de `tipos_tiss`/`tipos_atendimento_tiss`;
4. validar o combo no modal;
5. validar persistencia e reabertura;
6. registrar o resultado na documentacao de continuidade.
