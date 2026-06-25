# NFS-e compacta no modal Preferências

## Objetivo da etapa

Compactar verticalmente a aba NFS-e do modal de Preferências no `frontend-react`, reduzindo a distância entre os campos sem alterar a estrutura, os rótulos ou o comportamento.

## Problema validado pelo usuário

O usuário confirmou que a aba NFS-e já tinha os campos visuais corretos, mas estava com espaçamento vertical excessivo entre as linhas, deixando o conteúdo esticado demais.

## Arquivos lidos

- `frontend-react/src/features/preferencias/PreferenciasUsuarioModal.jsx`
- `frontend-react/src/features/preferencias/preferenciasUsuario.css`
- `docs/frontend_react_preferencias_redesenho_campo_a_campo.md`
- `docs/frontend_react_preferencias_refino_faixa_grade_modal.md`
- `docs/frontend_react_preferencias_aba_geral_alinha_dados.md`
- `docs/11_roadmap_desenvolvimento.md`

## Arquivos alterados

- `frontend-react/src/features/preferencias/preferenciasUsuario.css`
- `docs/frontend_react_preferencias_nfse_compacta.md`
- `docs/11_roadmap_desenvolvimento.md`

## Classes reais identificadas

- `preferencias-nfse-form`
- `preferencias-nfse-form .preferencias-form-row`
- `preferencias-nfse-form .preferencias-form-field .ant-input`
- `preferencias-nfse-form .preferencias-form-field .ant-input-number`
- `preferencias-nfse-form .preferencias-form-field .ant-input-affix-wrapper`
- `preferencias-nfse-help`

## Como a distância vertical foi reduzida

- A aba NFS-e passou a usar `display: flex` com `flex-direction: column`.
- O `gap` vertical do bloco foi reduzido.
- As linhas de formulário tiveram `margin-bottom` menor.
- O texto de ajuda ficou mais próximo dos campos.
- Os campos numéricos e de texto tiveram suas margens verticais zeradas para evitar espaçamento extra.

## Confirmações

- Os campos da NFS-e foram preservados.
- Os percentuais continuam com o símbolo `%`.
- A aba Geral não foi alterada.
- Ficha clínica não foi alterada.
- Orçamento não foi alterada.
- O rodapé cinza não foi alterado.
- O tamanho externo do modal não foi alterado nesta etapa.
- NFS-e continua sem lógica fiscal/API.
- Gravar preferências não salva e não chama API.
- Cancelar fecha o modal.
- Nenhuma API nova foi criada ou consumida.
- Nenhuma API de escrita foi usada.
- Backend não foi alterado.
- Frontend legado não foi alterado.
- Banco e migrations não foram alterados.

## Mojibake

- Não houve reintrodução de textos quebrados nos arquivos desta etapa.
- Foi feita verificação para evitar `Ãƒ`, `Ã‚` e `ï¿½` nos arquivos tocados.

## Resultado das buscas

- `Ãƒ`: sem ocorrências.
- `Ã‚`: sem ocorrências.
- `ï¿½`: sem ocorrências.

## Resultado do build

- `cd frontend-react`
- `npm.cmd run build`
- Build concluído com sucesso.
