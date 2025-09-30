import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import axios from '../config/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking auth status...');
      const response = await axios.get('/api/auth/status');
      console.log('Auth status response:', response.data);

      if (response.data.authenticated) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = (provider) => {
    window.location.href = `/api/auth/${provider}`;
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {});
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails on server, clear local state
      setUser(null);
    }
  };

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    checkAuthStatus,
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
