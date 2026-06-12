# Correcao runtime - header de paciente em uso na tela principal

## 1. Objetivo da etapa

Corrigir a exibicao real do header de paciente em uso na tela principal do Brana Cloud, garantindo que a faixa apareca logo abaixo da toolbar e acima da area principal do workspace odontologico isolado.

## 2. Sintoma observado

O usuario relatou que a entrega anterior "nao mudou nada ainda". Na pratica, o header nao aparecia de forma util no runtime real da tela principal, ou permanecia em formato generico sem evidenciar numero e nome do paciente em uso.

## 3. Causa encontrada

A integracao anterior ficou acoplada ao shell antigo do `odontograma-v1`, enquanto o runtime real da tela principal usa o fluxo isolado de `tela-principal-odontologica-*`.

O layout real ja continha uma linha de paciente, mas ela ainda era renderizada como estado visual generico/mock e nao como header de paciente em uso com numero e nome visiveis.

## 4. Arquivos auditados

- `frontend/js/modules/paciente-em-uso-header.js`
- `frontend/js/modules/odontograma-v1.js`
- `frontend/js/modules/odontograma-v1-shell.js`
- `frontend/js/modules/odontograma-v1-paciente-search.js`
- `frontend/app.js`
- `frontend/js/modules/tela-principal-odontologica-contratos.js`
- `frontend/js/modules/tela-principal-odontologica-entrada.js`
- `frontend/js/modules/tela-principal-odontologica-estado.js`
- `frontend/js/modules/tela-principal-odontologica-layout.js`

## 5. Arquivos alterados

- `frontend/js/modules/tela-principal-odontologica-layout.js`
- `frontend/app.js`

## 6. Correcao aplicada

- A linha de paciente do layout isolado passou a usar um header compacto com identificador estavel.
- O cabeçalho agora exibe numero do paciente e nome do paciente em campos separados.
- O estado neutro mostra marcadores vazios/neutros quando nao ha paciente ativo.
- O fluxo legado da ficha passou a recarregar o helper de paciente em uso sob demanda para sincronizar a faixa quando o paciente muda.

## 7. Como a montagem passou a acontecer

1. O bootstrap da tela principal continua abrindo o layout isolado no workspace principal.
2. O layout renderiza a faixa de paciente em uso dentro da regiao superior da tela, logo abaixo da toolbar.
3. Quando o paciente muda pela ficha, o helper de paciente em uso e recarregado sob demanda e sincroniza o mesmo elemento no DOM.

## 8. Comportamento sem paciente ativo

- A faixa permanece visivel.
- O numero fica neutro.
- O nome fica neutro.
- A area principal do workspace continua carregando normalmente.

## 9. Comportamento com paciente ativo

- A faixa permanece visivel.
- O numero do paciente e exibido.
- O nome do paciente e exibido.
- A atualizacao ocorre sem converter a faixa em modal ou card separado.

## 10. Validacoes executadas

- `git status` inicial
- Auditoria de codigo dos arquivos obrigatorios
- `node --check` em:
  - `frontend/js/modules/tela-principal-odontologica-layout.js`
  - `frontend/app.js`
  - `frontend/js/modules/paciente-em-uso-header.js`
- Revisao de `git diff` dos arquivos desta etapa

## 11. Confirmacao de nao alteracao de backend/banco/migrations

Confirmado.

- Nenhum arquivo de backend foi alterado.
- Nenhum banco foi alterado.
- Nenhuma migration foi criada.
- Nenhuma seed foi criada.

## 12. Riscos remanescentes

- A validacao visual em navegador real ainda deve ser conferida na tela principal autenticada.
- Se algum outro fluxo abrir a mesma tela sem passar pelo fluxo legado da ficha, ele pode exigir revisao futura para manter a sincronizacao do header.
- O layout ainda compartilha parte de sua composicao com o estado visual isolado, entao futuras mudancas de renderizacao devem preservar o identificador estavel do header.

## 13. Proxima etapa recomendada

- Validar em runtime real a tela principal autenticada, confirmando o header sem paciente e com paciente ativo.
- Depois disso, continuar a trilha do fluxo `Menu de pacientes -> Ficha pessoal -> Novo tratamento` usando a faixa como evidencia visual do paciente em uso.

