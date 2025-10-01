import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    // eslint-disable-next-line no-console
    console.log('AuthSuccess - URL search params:', searchParams.toString());
    // eslint-disable-next-line no-console
    console.log('AuthSuccess - user param:', userParam);
    if (userParam) {
      try {
        const parsedUserData = JSON.parse(decodeURIComponent(userParam));
        // eslint-disable-next-line no-console
        console.log('User data from URL:', parsedUserData);
        // Set user directly in context
        setUser(parsedUserData);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error parsing user data:', error);
        // Fallback to normal auth check
        checkAuthStatus();
      }
    } else {
      // eslint-disable-next-line no-console
      console.log('No user data in URL, checking auth status normally');
      // No user data in URL, check authentication status normally
      const checkAuth = async () => {
        await checkAuthStatus();
      };
      checkAuth();
    }
  }, [checkAuthStatus, setUser, searchParams]);

  const handleContinue = () => {
    window.location.href = '/';
  };

  return (
    <AuthSuccessContainer>
      <SuccessMessage>
        <h2>🎉 Login Successful!</h2>
        <p>
          Welcome to Country Explorer! You&apos;re now logged in.
        </p>
        <button
          type="button"
          onClick={handleContinue}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px',
          }}
        >
          Continue to Home
        </button>
      </SuccessMessage>
    </AuthSuccessContainer>
  );
};

export default AuthSuccess;
