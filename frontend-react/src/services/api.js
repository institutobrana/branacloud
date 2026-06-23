// Base preparada para a integração futura com o backend.
// A API real será conectada em uma etapa posterior, após o shell e o login experimental.
export const API_BASE_URL = '';

export async function requestPlaceholder() {
  return Promise.resolve({ ok: true, message: 'API placeholder only' });
}
