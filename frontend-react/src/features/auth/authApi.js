import { buildApiUrl } from '../../services/api.js';

async function requestJson(path, options = {}) {
  let response;
  try {
    response = await fetch(buildApiUrl(path), options);
  } catch (err) {
    const error = new Error(`Falha de conexao com o servidor de autenticacao em ${buildApiUrl('/login')}.`);
    error.cause = err;
    throw error;
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const fallbackMessage =
      response.status === 401 || response.status === 400
        ? 'Credenciais invalidas ou login recusado.'
        : 'Falha na requisicao de autenticacao.';
    const error = new Error((data && (data.detail || data.message)) || fallbackMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function normalizeLoginCredentials(credentials = {}) {
  const email = String(credentials.email || credentials.username || '').trim();
  const password = String(credentials.senha || credentials.password || '').trim();
  return { email, password };
}

export async function login(credentials) {
  const { email, password } = normalizeLoginCredentials(credentials);
  const body = new URLSearchParams();
  body.append('username', email);
  body.append('password', password);

  const data = await requestJson('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  return {
    accessToken: String(data?.access_token || ''),
    tokenType: String(data?.token_type || 'bearer'),
  };
}

export async function getMe(token) {
  return requestJson('/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function logout(token) {
  return requestJson('/logout', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
