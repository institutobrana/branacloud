# Auditoria do Bloco 04 - Contexto Clinico

## Contexto

Bloco auditado:
- contexto clinico lateral;
- paciente, tratamento, observacoes, imagens, documentos e agenda.

Referencia funcional:
- o bloco lateral deve refletir o mesmo paciente e o mesmo tratamento ativo do odontograma;
- estados vazios devem ser vazios de verdade, mas nao quando o caso piloto esta carregado.

## Evidencia observada

Com o paciente piloto `214` carregado e o odontograma aberto:

- o painel lateral ficou visivel;
- os campos laterais exibiram os estados padrao vazios:
  - `Sem paciente selecionado.`;
  - `Sem tratamento selecionado.`;
  - `Sem observações`;
  - `Sem imagens carregadas`;
  - `Sem documentos carregados`;
  - `Nenhuma agenda carregada.`;
- isso ocorreu mesmo com o tratamento piloto selecionado no odontograma central.

## Divergencia encontrada

O bloco de contexto nao sincronizou com o caso em uso:

- o paciente existe na tela, mas o contexto lateral nao o reconhece;
- o tratamento existe no seletor, mas o contexto lateral nao o reconhece;
- os estados vazios aparecem onde deveria haver o contexto real do piloto.

## Diagnostico

Status da auditoria:
- parcial

Classificacao:
- sincronia de contexto lateral

## Pendencia

É necessario sincronizar o estado do contexto lateral com:

- paciente em uso;
- tratamento selecionado;
- carregamento do odontograma;
- eventos de troca de paciente e troca de tratamento.

## Proxima acao sugerida

Auditar os blocos de procedimentos registrados e historico clinico para verificar se o mesmo problema afeta a parte inferior da tela.
