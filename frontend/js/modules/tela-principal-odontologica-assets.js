(function () {
  "use strict";

  const MODULE_NAME = "BranaTelaPrincipalOdontologicaAssets";
  const CAMINHO_BASE_ASSETS = "assets/easy";
  const CAMINHO_BASE_DENTES = "assets/easy/dentes";

  const CAMINHO_ARCADA_SUPERIOR = `${CAMINHO_BASE_ASSETS}/arc_superior_perm.bmp`;
  const CAMINHO_ARCADA_INFERIOR = `${CAMINHO_BASE_ASSETS}/arc_inferior_perm.bmp`;
  const CAMINHO_ARC_FACES = `${CAMINHO_BASE_ASSETS}/arc_faces.bmp`;

  const ORDEM_DENTES_SUPERIORES = Object.freeze(["18", "17", "16", "15", "14", "13", "12", "11", "21", "22", "23", "24", "25", "26", "27", "28"]);
  const ORDEM_DENTES_INFERIORES = Object.freeze(["48", "47", "46", "45", "44", "43", "42", "41", "31", "32", "33", "34", "35", "36", "37", "38"]);

  function normalizarNumeroDente(numero) {
    const valor = String(numero ?? "").trim();
    return /^\d{2}$/.test(valor) ? valor : "";
  }

  function criarMapaDentesPermanentes() {
    const mapa = {};
    const adicionar = (numero, arco, ordem) => {
      const chave = normalizarNumeroDente(numero);
      if (!chave) return;
      mapa[chave] = Object.freeze({
        numero: chave,
        arco,
        ordem,
        caminho: `${CAMINHO_BASE_DENTES}/arc_dente${chave}.bmp`,
        temImagem: true,
      });
    };

    ORDEM_DENTES_SUPERIORES.forEach((numero, indice) => adicionar(numero, "superior", indice + 1));
    ORDEM_DENTES_INFERIORES.forEach((numero, indice) => adicionar(numero, "inferior", indice + 1));

    return Object.freeze(mapa);
  }

  const MAPA_DENTES_PERMANENTES = criarMapaDentesPermanentes();

  function validarNumeroDentePermanente(numero) {
    const chave = normalizarNumeroDente(numero);
    return !!chave && Object.prototype.hasOwnProperty.call(MAPA_DENTES_PERMANENTES, chave);
  }

  function obterMetadadoDentePermanente(numero) {
    const chave = normalizarNumeroDente(numero);
    if (!chave) return null;
    return MAPA_DENTES_PERMANENTES[chave] || null;
  }

  function obterCaminhoImagemDentePermanente(numero) {
    const meta = obterMetadadoDentePermanente(numero);
    return meta ? meta.caminho : null;
  }

  function obterAssetDente(numero) {
    return obterCaminhoImagemDentePermanente(numero);
  }

  function obterCaminhoArcadaSuperior() {
    return CAMINHO_ARCADA_SUPERIOR;
  }

  function obterCaminhoArcadaInferior() {
    return CAMINHO_ARCADA_INFERIOR;
  }

  function obterCaminhoArcFaces() {
    return CAMINHO_ARC_FACES;
  }

  function obterAssetFace() {
    return obterCaminhoArcFaces();
  }

  function obterOrdemDentesSuperiores() {
    return ORDEM_DENTES_SUPERIORES.slice();
  }

  function obterOrdemDentesInferiores() {
    return ORDEM_DENTES_INFERIORES.slice();
  }

  function obterOrdemSuperiorOdontograma() {
    return obterOrdemDentesSuperiores();
  }

  function obterOrdemInferiorOdontograma() {
    return obterOrdemDentesInferiores();
  }

  function obterMapaDentesPermanentes() {
    return MAPA_DENTES_PERMANENTES;
  }

  function obterMetadadosAssetsOdontologicos() {
    return Object.freeze({
      baseAssets: CAMINHO_BASE_ASSETS,
      baseDentes: CAMINHO_BASE_DENTES,
      arcadaSuperior: CAMINHO_ARCADA_SUPERIOR,
      arcadaInferior: CAMINHO_ARCADA_INFERIOR,
      arcFaces: CAMINHO_ARC_FACES,
      mapaDentesPermanentes: MAPA_DENTES_PERMANENTES,
      ordemOdontogramaSuperior: ORDEM_DENTES_SUPERIORES,
      ordemOdontogramaInferior: ORDEM_DENTES_INFERIORES,
    });
  }

  const api = Object.freeze({
    MODULE_NAME,
    CAMINHO_BASE_ASSETS,
    CAMINHO_BASE_DENTES,
    CAMINHO_ARCADA_SUPERIOR,
    CAMINHO_ARCADA_INFERIOR,
    CAMINHO_ARC_FACES,
    ORDEM_DENTES_SUPERIORES,
    ORDEM_DENTES_INFERIORES,
    MAPA_DENTES_PERMANENTES,
    validarNumeroDentePermanente,
    obterMetadadoDentePermanente,
    obterCaminhoImagemDentePermanente,
    obterAssetDente,
    obterCaminhoArcadaSuperior,
    obterCaminhoArcadaInferior,
    obterCaminhoArcFaces,
    obterAssetFace,
    obterOrdemDentesSuperiores,
    obterOrdemDentesInferiores,
    obterOrdemSuperiorOdontograma,
    obterOrdemInferiorOdontograma,
    obterMapaDentesPermanentes,
    obterMetadadosAssetsOdontologicos,
  });

  if (typeof window !== "undefined") {
    window.BranaTelaPrincipalOdontologicaAssets = api;
  }

  if (typeof globalThis !== "undefined") {
    globalThis.BranaTelaPrincipalOdontologicaAssets = api;
  }
})();
