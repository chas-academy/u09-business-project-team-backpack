import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSearchParams } from 'react-router-dom';

const AuthSuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40px 20px;
  text-align: center;
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 20px;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  margin-bottom: 20px;
  max-width: 500px;
  
  h2 {
    margin-bottom: 12px;
    color: #155724;
  }
  
  p {
    margin: 0;
  }
`;

const AuthSuccess = () => {
  const { checkAuthStatus, setUser } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if user data is in URL params
    const userParam = searchParams.get('user');
    console.log('AuthSuccess - URL search params:', searchParams.toString());
    console.log('AuthSuccess - user param:', userParam);
    
    if (userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        console.log('User data from URL:', userData);
        
        // Set user directly in context
        setUser(userData);
        
        // Redirect to home page after a longer delay so we can see what's happening
        setTimeout(() => {
          window.location.href = '/';
        }, 10000); // 10 seconds instead of 2
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Fallback to normal auth check
        checkAuthStatus();
        setTimeout(() => {
          window.location.href = '/';
        }, 10000); // 10 seconds instead of 2
      }
    } else {
      console.log('No user data in URL, checking auth status normally');
      // No user data in URL, check authentication status normally
      const checkAuth = async () => {
        await checkAuthStatus();
        setTimeout(() => {
          window.location.href = '/';
        }, 10000); // 10 seconds instead of 2
      };
      checkAuth();
    }
  }, [checkAuthStatus, setUser, searchParams]);

  return (
    <AuthSuccessContainer>
      <SuccessMessage>
        <h2>🎉 Login Successful!</h2>
        <p>
          Welcome to Country Explorer! You&apos;re now logged in and can save your favorite
          countries.
        </p>
      </SuccessMessage>
      <LoadingSpinner />
      <p>Redirecting you to the home page...</p>
    </AuthSuccessContainer>
  );
};

export default AuthSuccess;
