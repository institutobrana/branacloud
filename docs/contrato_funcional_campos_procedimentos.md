# Contrato funcional dos campos monetarios de Procedimentos

Documento complementar ao [contrato canônico de Procedimentos/Genéricos](contrato_edicao_procedimentos_roundtrip.md). Disposições anteriores conflitantes são **SUPERSEDED**; campos cadastrais são locais e valores válidos zero/false/limpeza persistem conforme o domínio.

## Campos abrangidos

- Valor de repasse
- Valor do paciente
- Custo de laboratorio

## Contrato validado

1. O usuario pode digitar os valores sem bloqueio durante a edicao.
2. A formatacao `pt-BR` ocorre ao sair do campo.
3. O salvamento envia numeros no payload.
4. A reabertura do modal apresenta os valores formatados.
5. Valores vazios nao viram `0,00` enquanto o usuario ainda esta digitando.
6. Ao salvar, vazio é zero no contrato numérico atual; zero explícito não é pedido de herança. Texto inválido/valor não finito bloqueia o save, sem conversão silenciosa para zero.
7. Tempo/laboratório e demais campos cadastrais são locais ao Procedimento concreto. Editar/zerar/limpar altera somente o registro editado; Genérico não propaga nem repõe valores, inclusive na criação/associação/troca. Campo omitido preserva. Ver [contrato definitivo R1.R2](contrato_edicao_procedimentos_roundtrip.md).

## Payload confirmado

- `preco`: numero
- `valor_repasse`: numero
- `custo_lab`: numero

## Regra de parse

O frontend deve aceitar:

- `100,50`
- `1.750,90`
- `245,30`

e converter corretamente para:

- `100.5`
- `1750.9`
- `245.3`

## Regra de persistencia

Os valores persistidos devem sobreviver a:

- gravacao;
- reabertura;
- nova edicao.

## Observacao tecnica

A conversao de monetarios no `PUT` deve usar o mesmo parser da hidratacao/formulario, evitando perda do campo `preco` quando houver separador de milhar.
O recálculo visual do Painel Financeiro deve vir do backend via `POST /procedimentos/dashboard-preview`, sem fórmula local no React.

## Regra de composição dinâmica dos materiais

- Herdado pertence ao Genérico atual e entra na composição/cálculo sem cópia permanente como próprio, inclusive após save/reabertura.
- Próprios permanecem na associação/troca; deduplicação por material_id e quantidade própria prevalecem. Ausência de badge não converte origem.
- Edição por código continua limitada à quantidade dos vínculos; nenhuma substituição arbitrária de material é adicionada nesta fase.
## Validacao complementar de recomposicao

No procedimento `66929 / TESTE HERANCA MATERIAL`:

- o DELETE de `00130` foi executado com sucesso;
- a leitura posterior voltou a mostrar `00130` como material herdado do generico `82`;
- a quantidade reaparecida foi `20`;
- a grade permaneceu sem duplicidade;
- o painel financeiro permaneceu coerente com a recomposicao;
- nenhum backend, banco ou migration foi alterado.
