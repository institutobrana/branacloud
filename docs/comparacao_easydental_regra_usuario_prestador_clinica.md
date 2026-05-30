# Comparação EasyDental - Regra de usuário vinculado ao prestador Clínica

## 1. Contexto

Esta comparação dá continuidade à auditoria anterior do Brana Cloud sobre a regra de associação entre usuário e prestador `Clínica`.

Na auditoria anterior, ficou confirmado que:

- o combo de prestador no módulo Usuários é montado no frontend;
- o frontend não remove `Clínica` do combo;
- o payload leva `prestador_row_id`;
- o bloqueio efetivo está no backend, em `_load_prestador_from_same_clinic()`;
- o helper rejeita o prestador sistêmico com a mensagem `Prestador base 'Clínica' é reservado.`;
- o bloqueio ocorre em `admin_create_user` e `admin_update_user`.

A hipótese funcional desta etapa era verificar, no EasyDental virgem, se usuários comuns podem ser vinculados ao prestador `Clínica` mantendo a proteção estrutural do prestador sistêmico.

## 2. Fonte EasyDental consultada

### Fontes locais verificadas

- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\Dados\eds70.sql`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\Dados\eds70.bak`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\Dados\eds70dat.mdf`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\Dados\Dist\USUARIO.raw`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\Dados\Dist\PRESTADOR.raw`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\Dados\Dist\UNIDADE.raw`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\Dados\Dist\SISTEMA.raw`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\Dados\Dist\_TIPO_USUARIO.raw`
- `D:\UTIL\EasyDental_7.6_BR\Readme.doc`

### Evidência de fonte virgem / limitação

- `Y:\EDS70` não estava acessível neste ambiente.
- A trilha documental já tratava `\\Sonyvaio\\c\\EDS70` como referência do EasyDental virgem.
- O mirror local em `PROJETO_PRECIFICACAO_LEGADO\Dados` foi legível em modo somente leitura e contém os artefatos necessários para comparação.
- A leitura não alterou nenhum arquivo EasyDental.

## 3. Tabelas/campos identificados

### EasyDental

- `PRESTADOR`
  - `ID_PRESTADOR`
  - `COD_PRESTADOR`
  - `ID_TIPO_PREST`
  - `NOME`
  - `INATIVO`
  - `EXECUTA_PROCEDIMENTO`
- `USUARIO`
  - `NROUSR`
  - `TIPO`
  - `APELIDO`
  - `NOME`
  - `INATIVO`
  - `SENHA`
  - `ID_PRESTADOR`
  - `ID_UNIDADE`
  - `ALTERASENHA`
- `USUARIO_PERFIL`
  - `ID_USUARIO`
  - `ID_PRESTADOR`
  - `ID_PERFIL`
- `USUARIO_MODULO`
  - `ID_USUARIO`
  - `ID_MODULO`
  - `NIVEL`
- `USUARIO_FUNCAO`
  - `ID_USUARIO`
  - `ID_FUNCAO`
  - `NIVEL`
- `_TIPO_USUARIO`
  - `REGISTRO`
  - `NOME`
  - `DESCRICAO`
  - `RESERVADO`
- `SISTEMA`
  - base de configuração/segurança; os documentos da trilha registram `ControleUsuarios=0` e `Auditoria=0` no nascimento.

### Brana Cloud

- `usuarios.prestador_id`
- `usuarios.unidade_atendimento_id`
- `prestador_odonto.is_system_prestador`
- `prestador_odonto.source_id`
- `usuario_perfil_acesso.prestador_id`

## 4. Evidências EasyDental

### 4.1 Existe prestador Clínica/base/sistema?

Sim.

Evidências:

- `docs/auditoria_easydental_virgem_subetapa_8tc_confirmacao_unc_usuario_prestador_setup.md` registra que `PRESTADOR.raw` contém `Clínica`.
- O mesmo documento registra que a equivalência estrutural de `Clínica` como prestador sistêmico foi confirmada.
- `docs/auditoria_easydental_virgem_subetapa_8tb_comparacao_direta_usuario_prestador_setup.md` confirma `Clínica` como prestador sistêmico literal do legado.

### 4.2 Como ele é identificado?

Identificação observada na trilha:

- nome: `Clínica`;
- referência estrutural: `PRESTADOR.raw` e `USUARIO.raw`;
- referência funcional: `USUARIO 255` / `PRESTADOR 255` nos documentos da trilha;
- unidade base: `0001` / `Principal`;
- proteção estrutural: preservado como prestador sistêmico literal.

### 4.3 Existe usuário/operador vinculado ao prestador Clínica?

Sim, a trilha documental confirma a associação estrutural do usuário com o prestador e a unidade no legado.

Evidências:

- `docs/auditoria_easydental_virgem_subetapa_8tc_confirmacao_unc_usuario_prestador_setup.md` registra que `USUARIO.raw` contém `Clínica`;
- o mesmo documento registra que `eds70.sql` mostra `USUARIO` com as colunas `ID_PRESTADOR` e `ID_UNIDADE`;
- a trilha 8TB/8TC trata `Clínica` como prestador sistêmico preservado e aponta o vínculo estrutural como parte do contrato legado.

### 4.4 O EasyDental permite que um usuário/operador comum seja vinculado ao prestador Clínica?

Evidência forte de que sim.

Motivos:

- `docs/auditoria_complementar_usuarios_permissoes_licenca_easydental.md` afirma que nem todo usuário precisa ser prestador e que alguns usuários podem ser vinculados a prestadores;
- o mesmo documento diz que o vínculo usuário/prestador define acesso ao contexto daquele prestador;
- a trilha 8TB/8TC confirma que `USUARIO` guarda o vínculo com prestador e unidade e que `Clínica` está presente em `USUARIO.raw`;
- o contrato funcional de novas contas também registra que usuários criados pelo ADM podem ser associados a um prestador principal.

### 4.5 O prestador Clínica aparece como opção de vínculo para usuário/operador?

Sim, pela documentação da trilha.

Evidências:

- `docs/auditoria_easydental_virgem_subetapa_8tb_comparacao_direta_usuario_prestador_setup.md` e `docs/auditoria_easydental_virgem_subetapa_8tc_confirmacao_unc_usuario_prestador_setup.md` mostram `Clínica` em `PRESTADOR.raw` e `USUARIO.raw`;
- o contrato funcional do Brana registra que o campo `Associar a prestador` define o prestador principal do usuário;
- a equivalência funcional entre o legado e o Brana exige que o prestador sistêmico apareça como opção operacional, ainda que protegido estruturalmente.

### 4.6 O prestador Clínica é protegido contra exclusão?

Sim.

Evidências:

- `docs/auditoria_complementar_usuarios_permissoes_licenca_easydental.md` afirma explicitamente que o prestador `Clínica` é estrutural e não pode ser apagado;
- `docs/auditoria_easydental_virgem_subetapa_8tb_comparacao_direta_usuario_prestador_setup.md` mantém a mesma leitura;
- a trilha EasyDental trata `Clínica` como prestador sistêmico preservado.

### 4.7 O prestador Clínica é protegido contra alteração estrutural?

Sim, pela leitura documental do legado.

Evidências:

- a trilha 8TB/8TC classifica `Clínica` como prestador sistêmico literal preservado;
- o contrato funcional do Brana mantém o prestador `Clínica` como estrutural/sistêmico e não apagável;
- o legado o trata como parte da base estrutural da conta.

### 4.8 O prestador Clínica é usado para agenda/conta da clínica?

Sim.

Evidências:

- `docs/auditoria_complementar_usuarios_permissoes_licenca_easydental.md` registra que o contexto do prestador pode incluir agenda, conta corrente e outros módulos relacionados;
- o mesmo documento afirma que o prestador `Clínica` tem `agenda_config_json` no Brana atual e é estruturalmente ligado à agenda/configuração;
- o contrato funcional registra que o prestador associado pode influenciar agenda, atendimento e conta corrente;
- a trilha EasyDental associa `Clínica` à base funcional da conta.

## 5. Comparação Brana x EasyDental

| Regra | Brana atual | EasyDental virgem | Conclusão |
| --- | --- | --- | --- |
| Prestador Clínica existe | Sim, `is_system_prestador=true`, `source_id=255` | Sim, `Clínica` aparece em `PRESTADOR.raw` e nos documentos da trilha | Equivalente |
| Prestador Clínica é protegido | Sim | Sim | Equivalente |
| Prestador Clínica pode ser excluído | Não | Não | Equivalente |
| Prestador Clínica pode ser alterado estruturalmente | Não | Não evidenciado como permitido; tratado como preservado | Equivalente funcional |
| Usuário pode vincular ao prestador Clínica | Não no CRUD atual, porque o backend bloqueia | Evidência forte de que sim, por `USUARIO.ID_PRESTADOR` e vínculo funcional legado | Divergência corrigível |
| Prestador Clínica aparece para vínculo | Sim no combo frontend, mas o backend bloqueia a seleção | Sim como parte do contrato legado de vínculo usuário/prestador | Divergência de implementação no Brana |
| Vínculo serve para agenda/conta da clínica | Sim, como intenção funcional | Sim, como herança funcional do legado | Equivalente funcional |

## 6. Conclusão

O EasyDental virgem favorece a leitura de que o prestador `Clínica` deve continuar protegido estruturalmente, mas o vínculo operacional de usuário ao prestador `Clínica` faz parte do contrato funcional do sistema.

Portanto:

- permitir o vínculo usuário -> prestador `Clínica` parece correto;
- manter a proteção estrutural do prestador `Clínica` também parece correto;
- o bloqueio backend atual do Brana aparenta ser restritivo demais para o contrato funcional observado no legado.

## 7. Classificação

- `EASY-A`
- `REGRA-A`
- `REGRA-F`

## 8. Próxima etapa recomendada

Abrir contrato de correção pequena no backend para permitir a associação usuário -> prestador `Clínica`, mantendo a proteção estrutural do prestador sistêmico e sem mexer no frontend se isso não for necessário.

## 9. Confirmações de escopo

- nenhum código alterado;
- nenhum dado de banco Brana alterado;
- nenhum dado EasyDental alterado;
- `frontend/app.js` não alterado;
- `frontend/index.html` não alterado;
- `frontend/js/modules` não alterado;
- backend não alterado;
- `.env` não alterado;
- banco/schema/migrations/seeds/endpoints não alterados;
- PostgreSQL 18 não excluído/desativado;
- backups preservados;
- blindagem textual/mojibake respeitada.

## 10. Registro para roadmap

Comparação concluída com fonte EasyDental virgem local somente leitura, reforçando que a regra correta é permitir o vínculo operacional do usuário ao prestador `Clínica` mantendo a proteção estrutural do prestador sistêmico.
