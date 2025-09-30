import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import About from './pages/About';
import CountryDetails from './pages/CountryDetails';
import AuthSuccess from './pages/AuthSuccess';
import ListView from './pages/ListView';
import CountryComparison from './pages/CountryComparison';
import { AuthProvider } from './context/AuthContext';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 80px; /* Account for fixed header */
`;

function App() {
  return (
    <AuthProvider>
      <AppContainer>
        <Header />
        <MainContent>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/country/:name" element={<CountryDetails />} />
            <Route path="/list/:listId" element={<ListView />} />
            <Route path="/comparison" element={<CountryComparison />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
          </Routes>
        </MainContent>
        <Footer />
      </AppContainer>
    </AuthProvider>
  );
}

export default App;
