import { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('tl-token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('tl-token', token);
      fetchUser();
    } else {
      localStorage.removeItem('tl-token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const data = await api.get('/user/me');
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await api.login(email, password);
    setToken(data.access_token);
  };

  const register = async (name, email, password) => {
    const data = await api.register(name, email, password);
    setToken(data.access_token);
  };

  const logout = () => {
    setToken(null);
  };

  const updateApiKey = async (apiKey) => {
    await api.post('/user/api-key', { api_key: apiKey });
    await fetchUser(); // refresh user state
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateApiKey }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
