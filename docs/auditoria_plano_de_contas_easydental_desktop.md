# Auditoria - Plano de Contas no EasyDental Desktop

## Escopo

Auditoria documental do módulo `Configurações -> Plano de contas` no EasyDental Desktop.

## Fonte local usada

- `Y:\EDS70`

## Arquivos e evidências encontradas

- `Y:\EDS70\Dados\Dist\PLANO.raw`
- `Y:\EDS70\Dados\Dist\DEF_GRUPO.raw`
- `Y:\EDS70\Dados\Dist\_GRUPO_CONTA.raw`
- `Y:\EDS70\Dados\Dist\_PLANO_CONTA.raw`
- `Y:\EDS70\Temp\PLANO.log`
- `Y:\EDS70\Temp\DEF_GRUPO.log`
- `Y:\EDS70\Temp\_GRUPO_CONTA.log`
- `Y:\EDS70\Temp\_PLANO_CONTA.log`
- `Y:\EDS70\Dados\eds70.sql`
- `Y:\EDS70\Dados\eds75_build_0809_1.sql`
- `Y:\EDS70\Dados\eds75_build_0809_5.sql`
- `Y:\EDS70\Dados\eds75_build_0809_7.sql`
- `Y:\EDS70\Dados\eds75_build_090415_1.sql`
- `Y:\EDS70\Dados\eds75_build_090415_2.sql`
- `Y:\EDS70\Temp\DELL_SERVIDOR_eds70.log`

## Evidências confirmadas

- `PLANO.raw` existe e contém registros de contas do plano.
- `DEF_GRUPO.raw` existe e contém grupos financeiros.
- `_GRUPO_CONTA.raw` existe e contém vínculo entre grupos e contas.
- `_PLANO_CONTA.raw` existe e contém estrutura de contas do plano.
- Os logs de cópia indicam contagens:
  - `PLANO.log`: `9 rows copied`
  - `DEF_GRUPO.log`: `164 rows copied`
  - `_GRUPO_CONTA.log`: `30 rows copied`
  - `_PLANO_CONTA.log`: `43 rows copied`
- Os arquivos SQL de `eds70.sql` e builds antigos mostram as tabelas:
  - `DEF_GRUPO`
  - `PLANO`
  - `_GRUPO_CONTA`
  - `_PLANO_CONTA`

## Estrutura técnica observada

- `DEF_GRUPO`
  - tabela de grupos
  - chave primária em `NROGRUPO`
- `PLANO`
  - tabela de contas
  - chave primária em `NROPLAN`
- `_GRUPO_CONTA`
  - tabela de relação entre grupo financeiro e conta
  - PK em `NROGRUPOFIN`
- `_PLANO_CONTA`
  - tabela de contas detalhadas do plano
  - PK em `NROCATFIN`
  - FK para `_GRUPO_CONTA` em `NROGRUPOFIN`

## Campos e indícios úteis

- `PLANO.raw` mostra códigos como `001`, `002`, `003` e o texto `Principal`.
- `DEF_GRUPO.raw` mostra descrições de grupos como:
  - `Broncodilatadores`
  - `Antihistamínicos`
  - `Antigripais`
  - `Mucolíticos`
  - `Expectorantes`
- `_GRUPO_CONTA.raw` mostra categorias financeiras como:
  - `Recebimentos particulares`
  - `Recebimentos de convênio`
  - `Outros recebimentos profissionais`
  - `Gastos com dentista`
  - `Retiradas de pró-labore`
- `_PLANO_CONTA.raw` mostra contas como:
  - `Gastos com dental`
  - `DB Outros (Pessoal)`
  - `Gastos com protético`
  - `DB Paciente`
  - `DB Convênio`
  - `CR Paciente`
  - `CR Convênio`
  - `DB Juros/...`

## Dependências observadas no banco legado

- Há referência explícita em `Y:\EDS70\Temp\DELL_SERVIDOR_eds70.log` de consultas que usam `_PLANO_CONTA` com `CCCIRURGIAO`.
- Há conflito de FK registrado entre `CCCIRURGIAO` e `_PLANO_CONTA` no log.
- Isso confirma uso do plano em lançamentos/contas de cirurgião e em consultas de contas a receber.

## O que ficou confirmado

- O desktop legado tem fonte própria para grupos e contas do plano.
- O banco legado usa tabelas separadas para grupo e conta.
- O relacionamento de conta com grupo existe por FK.
- A exclusão é protegida por dependência em outras tabelas.

## O que ficou NÃO CONFIRMADO

- Não foi possível confirmar a tela principal por arquivos DFM/PAS, pois não foram localizados nesses caminhos.
- Não foi confirmado o significado visual dos ícones de cadeado e indicador verde.
- Não foi confirmado o comportamento de expansão/recolhimento da interface a partir de código fonte legível.
- Não foi confirmado se a tela usa sete colunas exatamente como na referência visual.
- Não foi confirmado se as ações `Detalhes`, `Preferências` e `Imprimir` existem como botões nessa implementação desktop sem abrir os binários.

## Conclusão

O EasyDental Desktop possui evidência forte do módulo de Plano de Contas em tabelas e arquivos de dados/dumps SQL, mas a camada de interface ainda não foi totalmente recuperada por fonte legível. A trilha documental confirma que o banco e os arquivos de distribuição sustentam grupos, contas e vínculos.
