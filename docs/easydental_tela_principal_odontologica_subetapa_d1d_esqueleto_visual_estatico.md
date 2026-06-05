# Subetapa D1-D - esqueleto visual estatico isolado da tela principal odontologica

## 1. Objetivo da subetapa

Esta subetapa registra a criacao do esqueleto visual estatico isolado da futura tela principal odontologica.

O trabalho reaproveitou a entrada minima da D1-C, mas ainda nao foi ligado ao botao `Odontograma`.

## 2. Arquivos criados

- `frontend/js/modules/tela-principal-odontologica-estado.js`
- `frontend/js/modules/tela-principal-odontologica-layout.js`
- `docs/easydental_tela_principal_odontologica_subetapa_d1d_esqueleto_visual_estatico.md`

## 3. Arquivos alterados

- `frontend/js/modules/tela-principal-odontologica-entrada.js`
- `docs/11_roadmap_desenvolvimento.md`

## 4. Confirmacoes

- o botao `Odontograma` nao foi ligado a esta entrada;
- a Ficha Pessoal nao foi alterada;
- a aba Historico nao foi alterada;
- `frontend/app.js` nao foi alterado;
- `frontend/index.html` nao foi alterado;
- backend nao foi alterado;
- banco, schema, migrations, seeds e endpoints nao foram alterados;
- nenhum asset foi alterado;
- nenhum arquivo do EasyDental foi alterado;
- nenhum arquivo do EasyDental foi copiado para o Brana Cloud;
- a implementacao antiga do odontograma nao foi removida;
- a blindagem textual/mojibake foi respeitada.

## 5. Estados mockados disponibilizados

### 5.1 Estado sem paciente

- paciente vazio e neutro;
- procedimentos mockados reduzidos;
- historico mockado reduzido;
- agenda mockada reduzida;
- odontograma mockado neutro;
- observacoes visuais indicando ausencia de paciente.

### 5.2 Estado com paciente simulado

- paciente fictício com codigo e nome simulados;
- procedimentos mockados completos;
- historico mockado completo;
- agenda mockada completa;
- odontograma mockado com estados visuais simulados;
- observacoes visuais indicando modo de leitura visual.

## 6. Regioes visuais renderizadas

O renderer isolado monta, de forma local e sem CSS global:

- cabecalho / shell visual;
- toolbar visual sem acoes reais;
- linha de paciente ativo;
- area de odontograma visual simplificado;
- lista de procedimentos mockada;
- atalhos laterais visuais sem acao;
- abas / resumos visuais;
- agenda resumida mockada;
- historico inferior mockado;
- rodape / status visual.

## 7. Assinatura de entrada

Assinatura operacional preservada e reaproveitada:

```js
abrirTelaPrincipalOdontologicaPorPaciente(contexto)
```

## 8. Como testar manualmente pelo console

Teste recomendado com container temporario:

```js
const c = document.createElement("div");
c.id = "teste-tela-odontologica-isolada";
document.body.appendChild(c);
window.abrirTelaPrincipalOdontologicaPorPaciente({
  origem: "ficha-pessoal-historico",
  modo: "visual-estatico",
  comPaciente: true,
  container: c
});
```

Resultado esperado:

- o container temporario recebe o esqueleto visual estatico;
- o restante da tela nao deve ser modificado;
- nao deve haver chamadas de backend;
- nao deve haver escrita de dados.

Se `comPaciente: true` for omitido, o mesmo teste renderiza o estado neutro sem paciente.

Teste com `document.body`:

```js
window.abrirTelaPrincipalOdontologicaPorPaciente({
  origem: "ficha-pessoal-historico",
  modo: "visual-estatico",
  container: document.body
});
```

Observacao:

- este teste substitui o conteudo visual do `body` apenas para a area controlada pelo modulo;
- deve ser usado somente em ambiente de teste.

## 9. Limitacoes explicitas

- nao existe ligação ao botao `Odontograma`;
- nao existe layout final;
- nao existe integracao com Ficha Pessoal;
- nao existe integracao com aba Historico;
- nao existe integracao com agenda real;
- nao existe integracao com procedimentos reais;
- nao existe integracao com backend;
- nao existe persistencia;
- nao existe uso de assets do EasyDental;
- nao existe depuracao de dados reais.

## 10. Riscos remanescentes

- risco de o esqueleto visual ganhar responsabilidade demais se a trilha nao for controlada;
- risco de conflito com a implementacao antiga se a entrada nova for ligada sem etapa intermediaria;
- risco de crescimento de `app.js` em etapa futura se a ponte final nao for pequena;
- risco de misturar estado mockado com dado real se a fronteira nao for mantida.

## 11. Onde testar futuramente

- no frontend local do Brana Cloud;
- com container temporario criado no console;
- com `document.body` apenas em ambiente de teste;
- validando que nenhum fluxo real foi afetado;
- validando que a Ficha Pessoal e o Odontograma antigo continuam funcionando.

## 12. Proxima etapa recomendada

Recomendo a Subetapa D1-E: adaptar o botao `Odontograma` para chamar a entrada isolada com fallback antigo preservado.

Justificativa:

- a entrada isolada e o esqueleto visual estatico ja existem;
- a menor evolucao util agora e colocar a nova entrada atras do botao, sem desligar o fluxo antigo;
- isso permite comparar os dois caminhos de forma controlada antes de remover a implementacao antiga.

## 13. Registro para roadmap

- criacao do esqueleto visual estatico isolado registrada;
- arquivos criados e alterados documentados;
- confirmacao de que o botao `Odontograma` ainda nao foi ligado ao novo fluxo;
- confirmacao de que a implementacao antiga nao foi removida;
- proxima etapa recomendada: D1-E, adaptacao do botao com fallback antigo preservado.
