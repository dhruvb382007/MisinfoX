import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
const API_BASE = `${API_URL}/api`;

class ApiService {
  getHeaders() {
    const token = localStorage.getItem('tl-token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : (endpoint.startsWith('/api') ? `${API_URL}${endpoint}` : `${API_BASE}${endpoint}`);

    const maxRetries = 3;
    const timeoutMs = 8000;
    let attempt = 0;
    let loadingToastId = null;

    while (attempt < maxRetries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const res = await fetch(url, {
          ...options,
          headers: {
            ...this.getHeaders(),
            ...options.headers,
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (loadingToastId) {
          toast.dismiss(loadingToastId);
          toast.success('Connected to backend!', { duration: 2000, id: 'backend-success' });
          loadingToastId = null;
        }

        if (!res.ok) {
          let errDetail = `API error ${res.status}`;
          try {
            const errData = await res.json();
            errDetail = errData.detail || errDetail;
          } catch (e) {}

          if (res.status === 401) {
            toast.error('Session expired. Please log in again.', { id: 'auth-error' });
            localStorage.removeItem('tl-token');
            window.location.href = '/login';
          } else if (res.status >= 500) {
            toast.error('Server error. Please try again later.', { id: 'server-error' });
          }

          throw new Error(errDetail);
        }

        return await res.json();
      } catch (err) {
        attempt++;
        
        const isNetworkError = err.name === 'AbortError' || err.message.includes('Failed to fetch') || err.message.includes('NetworkError');

        if (isNetworkError) {
          if (attempt === 1) {
            loadingToastId = toast.loading('Backend is waking up. Please wait...');
          }
          if (attempt >= maxRetries) {
            if (loadingToastId) toast.dismiss(loadingToastId);
            toast.error('Unable to connect to the server.', { id: 'conn-error' });
            throw new Error('Connection failed after multiple retries. Backend might be offline.');
          }
          // Wait before retrying
          await new Promise(r => setTimeout(r, 3000));
        } else {
          if (loadingToastId) toast.dismiss(loadingToastId);
          throw err;
        }
      }
    }
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

    try {
      const res = await this.request('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      return res;
    } catch (err) {
      toast.error(err.message || 'Login failed');
      throw err;
    }
  }

  async register(name, email, password) {
    try {
      const res = await this.post('/auth/register', { name, email, password });
      toast.success('Registration successful! Please log in.');
      return res;
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      throw err;
    }
  }

  // Analysis specific
  async analyze(text) {
    return this.request(`${API_URL}/analyze`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }
}

export const api = new ApiService();
