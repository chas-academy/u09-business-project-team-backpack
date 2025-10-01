import React, { useEffect, useState } from 'react';
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
  const [status, setStatus] = useState('Processing...');
  const [userData, setUserDataState] = useState(null);

  useEffect(() => {
    // Check if user data is in URL params
    const userParam = searchParams.get('user');
    console.log('AuthSuccess - URL search params:', searchParams.toString());
    console.log('AuthSuccess - user param:', userParam);
    
    if (userParam) {
      try {
        const parsedUserData = JSON.parse(decodeURIComponent(userParam));
        console.log('User data from URL:', parsedUserData);
        
        // Set user directly in context
        setUser(parsedUserData);
        setUserDataState(parsedUserData);
        setStatus('✅ User data found and set! Click Continue to go home.');
      } catch (error) {
        console.error('Error parsing user data:', error);
        setStatus('❌ Error parsing user data. Click Continue to try normal auth.');
        // Fallback to normal auth check
        checkAuthStatus();
      }
    } else {
      console.log('No user data in URL, checking auth status normally');
      setStatus('❌ No user data in URL. Click Continue to try normal auth.');
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
        <p><strong>Status:</strong> {status}</p>
        {userData && (
          <div>
            <p><strong>User Data:</strong></p>
            <pre style={{ fontSize: '12px', background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>
        )}
        <button 
          onClick={handleContinue}
          style={{ 
            padding: '10px 20px', 
            fontSize: '16px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Continue to Home
        </button>
      </SuccessMessage>
    </AuthSuccessContainer>
  );
};

export default AuthSuccess;
