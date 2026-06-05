# Subetapa D1-C - entrada isolada minima da tela principal odontologica

## 1. Objetivo da subetapa

Esta subetapa registra a criacao do modulo minimo de contrato/entrada isolada da futura tela principal odontologica.

O foco foi criar a fronteira tecnica inicial sem ligar ao botao `Odontograma`, sem alterar a Ficha Pessoal, sem mexer no `app.js` e sem encostar na implementacao antiga.

## 2. Arquivos criados

- `frontend/js/modules/tela-principal-odontologica-contratos.js`
- `frontend/js/modules/tela-principal-odontologica-entrada.js`
- `docs/easydental_tela_principal_odontologica_subetapa_d1c_entrada_isolada_minima.md`

## 3. Confirmacoes

- o botao `Odontograma` nao foi ligado a este novo modulo;
- a Ficha Pessoal nao foi alterada;
- `frontend/app.js` nao foi alterado;
- backend nao foi alterado;
- banco, schema, migrations, seeds e endpoints nao foram alterados;
- nenhum asset foi alterado;
- nenhum arquivo do EasyDental foi alterado;
- nenhum arquivo do EasyDental foi copiado para o Brana Cloud;
- a implementacao antiga do odontograma nao foi removida;
- a blindagem textual/mojibake foi respeitada.

## 4. Assinatura da entrada criada

Assinatura funcional disponibilizada:

```js
abrirTelaPrincipalOdontologicaPorPaciente(contexto)
```

## 5. Contratos criados

### 5.1 `frontend/js/modules/tela-principal-odontologica-contratos.js`

Responsabilidades:

- declarar as origens suportadas;
- declarar os modos suportados;
- normalizar o contexto de entrada;
- validar o contexto minimo;
- manter fallback seguro.

Estruturas expostas:

- `ORIGENS_TELA_PRINCIPAL_ODONTOLOGICA`
- `MODOS_TELA_PRINCIPAL_ODONTOLOGICA`
- `normalizarContextoTelaPrincipalOdontologica(contexto)`
- `validarContextoTelaPrincipalOdontologica(contexto)`

Regras de contexto:

- `pacienteId`, `pacienteCodigo` e `pacienteNome` podem faltar;
- `origem` tem fallback para `ficha-pessoal-historico`;
- `modo` tem fallback para `visual-estatico`;
- `container` pode ser string ou elemento, mas a resolução concreta fica para a entrada;
- nenhum acesso a backend e nenhuma dependencia de Ficha Pessoal foram introduzidos.

### 5.2 `frontend/js/modules/tela-principal-odontologica-entrada.js`

Responsabilidades:

- normalizar o contexto recebido;
- validar o contexto;
- resolver container apenas quando informado;
- criar um marcador tecnico minimo quando houver container valido;
- devolver resultado previsivel e seguro.

Comportamento com container:

- se o container existir, a entrada cria apenas um marcador tecnico minimo;
- se a funcao for chamada novamente no mesmo container, o marcador tecnico anterior e substituido;
- nao ocorre duplicacao infinita de conteudo;
- nao ha tentativa de montar layout completo.

Comportamento sem container:

- retorna erro controlado;
- nao lança excecao nao tratada;
- nao altera a tela atual;
- nao interage com painéis globais.

Comportamento com e sem paciente:

- com paciente: o contexto e preservado no resultado, mas a entrada continua tecnica e minima;
- sem paciente: a entrada continua segura e retorna estado sem abrir dependencias reais.

## 6. Exposicao controlada

O modulo de entrada expôs a função `abrirTelaPrincipalOdontologicaPorPaciente` também em `window` e em `globalThis`, de forma compatível com o padrão atual do projeto.

Essa exposicao foi mantida como utilidade tecnica de teste, sem ligação ao botao `Odontograma` e sem event listener global.

## 7. Como testar manualmente

Se os módulos estiverem carregados no frontend, o teste manual pode ser feito pelo console:

```js
window.abrirTelaPrincipalOdontologicaPorPaciente({
  origem: "ficha-pessoal-historico",
  modo: "visual-estatico",
  container: document.body,
});
```

Retornos esperados:

- resultado com `ok: true` quando o container existir;
- resultado com `status: "entrada-isolada-minima"`;
- objeto com `contexto` normalizado;
- marcador tecnico inserido apenas no container indicado.

Teste sem container:

```js
window.abrirTelaPrincipalOdontologicaPorPaciente({ origem: "ficha-pessoal-historico" });
```

Retorno esperado:

- falha controlada com `status: "container-nao-encontrado"`;
- nenhum erro nao tratado.

## 8. Limitacoes explicitas

- nao existe layout visual completo nesta subetapa;
- nao existe ligação ao botão `Odontograma`;
- nao existe integracao com Ficha Pessoal;
- nao existe integracao com aba Historico;
- nao existe integracao com agenda;
- nao existe integracao com backend;
- nao existe persistencia;
- nao existe tratamento real de paciente;
- nao existe tratamento real de procedimentos;
- nao existe tratamento real de historico.

## 9. Riscos remanescentes

- risco de conflito com a trilha antiga se alguma etapa futura misturar as duas entradas;
- risco de duplicar responsabilidade se o novo contrato começar a crescer demais;
- risco de ampliar `app.js` se a ligação ao botao nao for feita com cuidado;
- risco de misturar marcador tecnico com layout real se a fronteira nao for mantida.

## 10. Proxima etapa recomendada

Recomendo a Subetapa D1-D: criar o esqueleto visual estatico isolado reaproveitando a entrada minima, ainda sem ligar ao botao.

Justificativa:

- a fronteira tecnica de entrada ja existe;
- o proximo passo seguro e validar a renderizacao isolada sem tocar no botao e sem desligar o fallback antigo;
- isso permite evoluir a tela sem aumentar o risco de quebra do fluxo atual.

## 11. Registro para roadmap

- criacao do modulo minimo de entrada isolada registrada;
- arquivos criados documentados;
- confirmacao de que o botao `Odontograma` ainda nao foi ligado ao novo modulo;
- confirmacao de que a implementacao antiga nao foi removida;
- proxima etapa recomendada: D1-D, esqueleto visual estatico isolado.
