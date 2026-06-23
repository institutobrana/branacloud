const DEFAULT_API_BASE_URL = 'http://127.0.0.1:8000';
const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  DEFAULT_API_BASE_URL;

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  if (!response.ok) {
    const error = new Error((data && (data.detail || data.message)) || 'Falha na requisição de autenticação.');
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
