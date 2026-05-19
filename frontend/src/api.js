const API_BASE_URL = 'http://localhost:8080/api';

async function request(path, { method = 'POST', payload, token } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(payload ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(payload ? { body: JSON.stringify(payload) } : {})
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export const api = {
  registerCandidate: (payload) => request('/candidate/register', { payload }),
  loginCandidate: (payload) => request('/candidate/login', { payload }),
  getCandidateProfile: (token) => request('/candidate/me', { method: 'GET', token }),
  registerEmployer: (payload) => request('/employer/register', { payload }),
  loginEmployer: (payload) => request('/employer/login', { payload }),
  getEmployerProfile: (token) => request('/employer/me', { method: 'GET', token })
};
