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
      // eslint-disable-next-line no-console
      console.log('Checking auth status...');
      
      // Try the test endpoint first
      const testResponse = await axios.get('/api/auth/test-user');
      console.log('Test endpoint response:', testResponse.data);
      
      if (testResponse.data.success) {
        setUser(testResponse.data.user);
        return;
      }
      
      // Fallback to normal auth check
      const response = await axios.get('/api/auth/status');
      // eslint-disable-next-line no-console
      console.log('Auth status response:', response.data);

      if (response.data.authenticated) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
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
    window.location.href = `https://country-explorer-backend-acem.onrender.com/api/auth/${provider}`;
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {});
      setUser(null);
    } catch (error) {
      // eslint-disable-next-line no-console
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
    setUser,
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
