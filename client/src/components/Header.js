import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
  text-decoration: none;

  &:hover {
    color: #0056b3;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
  }

  &.active {
    background-color: #007bff;
    color: white;
  }
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const UserName = styled.span`
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;

  &:hover {
    color: #dc3545;
  }
`;

const GoogleLoginButton = styled.button`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">🌍 Country Explorer</Logo>

        <NavLinks>
          <NavLink
            to="/"
            className={location.pathname === '/' ? 'active' : ''}
          >
            Explore
          </NavLink>

          <NavLink
            to="/comparison"
            className={location.pathname === '/comparison' ? 'active' : ''}
          >
            Compare
          </NavLink>

          {user && (
            <NavLink
              to="/profile"
              className={location.pathname === '/profile' ? 'active' : ''}
            >
              Profile
            </NavLink>
          )}

          <NavLink
            to="/about"
            className={location.pathname === '/about' ? 'active' : ''}
          >
            About
          </NavLink>

          <AuthSection>
            {user ? (
              <UserInfo>
                {user.avatar && <Avatar src={user.avatar} alt={user.name} />}
                <UserName>{user.name}</UserName>
                <LogoutButton onClick={logout}>Logout</LogoutButton>
              </UserInfo>
            ) : (
              <GoogleLoginButton onClick={() => { window.location.href = 'http://localhost:5001/api/auth/google?prompt=select_account'; }}>
                Login with Google
              </GoogleLoginButton>
            )}
          </AuthSection>
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
