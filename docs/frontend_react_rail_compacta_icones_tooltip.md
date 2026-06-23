# `frontend-react` - rail compacta com ícones e tooltips

## Objetivo

Registrar a etapa visual em que a rail lateral do `frontend-react` foi compactada para funcionar como uma barra estreita de navegação por ícones, com rótulos visíveis apenas em tooltip.

## O que foi ajustado

- A largura da rail foi reduzida para manter um perfil compacto.
- Os itens de navegação deixaram de exibir texto fixo.
- Cada ação da rail passou a depender de tooltip para exibir o rótulo ao passar o mouse.
- O botão `Sair` ficou mais discreto, também como ícone com tooltip.
- A presença visual do verde foi reforçada na estrutura superior da rail, sem concentrar todo o peso visual no rodapé.

## Decisão visual

- A rail agora se comporta como uma barra operacional compacta.
- A leitura principal fica por conta dos ícones.
- Os tooltips preservam a identificação dos módulos sem ocupar largura permanente.
- O conjunto continua com aparência de software clínico/ERP, sem excesso decorativo.

## Arquivos alterados

- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/styles/globals.css`
- `docs/11_roadmap_desenvolvimento.md`

## Validação

- Build do `frontend-react` executado nesta etapa.
- Nenhuma alteração foi feita em backend.
- Nenhuma alteração foi feita no frontend legado.
- Nenhuma alteração foi feita em banco ou migrations.
- Nenhuma senha ou token foi registrada.

## Riscos remanescentes

- A densidade visual da rail pode exigir novo ajuste fino em resoluções menores.
- Caso o usuário queira mais distinção entre grupos, podemos adicionar micro-separadores sem voltar a ocupar espaço com texto fixo.

## Próximo passo recomendado

- Validar visualmente a rail em `http://localhost:5173/app` e, se aprovado, seguir para a próxima tela funcional planejada.
