const API_BASE = 'http://localhost:8001/api';

class ApiService {
  getHeaders() {
    const token = localStorage.getItem('tl-token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  async request(endpoint, options = {}) {
    // If endpoint starts with /api, use it as is, otherwise append it
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : (endpoint.startsWith('/api') ? `http://localhost:8001${endpoint}` : `${API_BASE}${endpoint}`);

    const res = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!res.ok) {
      let errDetail = `API error ${res.status}`;
      try {
        const errData = await res.json();
        errDetail = errData.detail || errDetail;
      } catch (e) {}
      throw new Error(errDetail);
    }

    return res.json();
  }

  async get(endpoint) {
    return this.request(endpoint);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Auth specific
  async login(email, password) {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Login failed');
    }
    return res.json();
  }

  async register(name, email, password) {
    return this.post('/auth/register', { name, email, password });
  }

  // Analysis specific
  async analyze(text) {
    return this.request('http://localhost:8001/analyze', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }
}

export const api = new ApiService();
