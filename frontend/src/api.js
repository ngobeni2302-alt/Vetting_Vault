const API_BASE_URL = 'http://localhost:8080/api';

async function request(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export const api = {
  registerCandidate: (payload) => request('/candidate/register', payload),
  loginCandidate: (payload) => request('/candidate/login', payload),
  registerEmployer: (payload) => request('/employer/register', payload),
  loginEmployer: (payload) => request('/employer/login', payload)
};
