import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from '../config/axios';
import { useAuth } from '../context/AuthContext';
import CountryCard from '../components/CountryCard';
import SearchBar from '../components/SearchBar';
import RegionFilter from '../components/RegionFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const HomeContainer = styled.div`
  padding: 40px 20px;
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: 60px;
  
  h1 {
    font-size: 3rem;
    margin-bottom: 16px;
    color: #333;
  }
  
  p {
    font-size: 1.2rem;
    color: #666;
    max-width: 600px;
    margin: 0 auto;
  }
  
  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
`;

const ControlsSection = styled.section`
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const CountriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 40px;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  
  h3 {
    margin-bottom: 16px;
    color: #333;
  }
`;

const fetchCountries = async (region = '') => {
  const url = region
    ? `/api/countries/region/${region}`
    : '/api/countries';
  const response = await axios.get(url);
  return response.data;
};

const searchCountries = async (query) => {
  const response = await axios.get(`/api/countries/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

const Notification = styled.div`
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  text-align: center;
`;

const Home = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [selectedRegion, setSelectedRegion] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Check if account was deleted
  const accountDeleted = searchParams.get('message') === 'account_deleted';

  const {
    data: countries,
    isLoading,
    error,
  } = useQuery(
    ['countries', selectedRegion],
    () => fetchCountries(selectedRegion),
    {
      enabled: !isSearching && !searchQuery && !!user,
    },
  );

  const {
    data: searchResults,
    isLoading: isSearchLoading,
  } = useQuery(
    ['search', searchQuery],
    () => searchCountries(searchQuery),
    {
      enabled: isSearching && searchQuery.length > 0 && !!user,
    },
  );

  const { data: userProfile } = useQuery(
    'userProfile',
    () => axios.get('/api/users/profile').then((res) => res.data),
    {
      enabled: !!user,
    },
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);
    if (query.length === 0) {
      setSelectedRegion('');
    }
  };

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    setIsSearching(false);
    setSearchQuery('');
  };

  const displayCountries = isSearching ? searchResults : countries;
  const isLoadingData = isLoading || isSearchLoading;

  if (error) {
    return (
      <HomeContainer>
        <ErrorMessage message="Failed to load countries. Please try again." />
      </HomeContainer>
    );
  }

  if (!user) {
    return (
      <HomeContainer>
        <HeroSection>
          <h1>Explore the World</h1>
          <p>
            Discover countries, learn about their cultures, and create your personal
            collections of favorite places around the globe.
          </p>
        </HeroSection>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <h3>Please log in to explore countries</h3>
          <p>Use the &quot;Login with Google&quot; button above to get started.</p>
        </div>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      {accountDeleted && (
        <Notification>
          Your account has been successfully deleted. Please log in again to continue.
        </Notification>
      )}
      <HeroSection>
        <h1>Explore the World</h1>
        <p>
          Discover countries, learn about their cultures, and create your personal
          collections of favorite places around the globe.
        </p>
      </HeroSection>

      <ControlsSection>
        <SearchBar onSearch={handleSearch} />
        <RegionFilter
          selectedRegion={selectedRegion}
          onRegionChange={handleRegionChange}
        />
      </ControlsSection>

      {isLoadingData ? (
        <LoadingSpinner />
      ) : (
        <>
          {displayCountries && displayCountries.length > 0 && (
            <CountriesGrid>
              {displayCountries.map((country) => (
                <CountryCard key={country.cca3} country={country} userProfile={userProfile} />
              ))}
            </CountriesGrid>
          )}
          {(!displayCountries || displayCountries.length === 0) && !isLoadingData && (
            <NoResults>
              <h3>No countries found</h3>
              <p>
                {isSearching
                  ? `No countries match your search for "${searchQuery}"`
                  : 'Try selecting a different region or search for a specific country'}
              </p>
            </NoResults>
          )}
        </>
      )}
    </HomeContainer>
  );
};

export default Home;
