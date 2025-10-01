import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import axios from '../config/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import AddToListModal from '../components/AddToListModal';

const CountryDetailsContainer = styled.div`
  padding: 40px 20px;
  max-width: 1000px;
  margin: 0 auto;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #007bff;
  text-decoration: none;
  margin-bottom: 20px;
  font-weight: 500;
  
  &:hover {
    color: #0056b3;
  }
`;

const CountryHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FlagSection = styled.div`
  text-align: center;
  
  .flag {
    width: 100%;
    max-width: 400px;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const CountryInfo = styled.div`
  h1 {
    font-size: 2.5rem;
    margin-bottom: 8px;
    color: #333;
  }
  
  .official-name {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 20px;
    font-style: italic;
  }
  
  .actions {
    margin-top: 20px;
    
    button {
      margin-right: 12px;
    }
  }
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const DetailCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  h3 {
    margin-bottom: 16px;
    color: #333;
    border-bottom: 2px solid #007bff;
    padding-bottom: 8px;
  }
  
  .detail-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .label {
      font-weight: 500;
      color: #555;
    }
    
    .value {
      color: #333;
      text-align: right;
      max-width: 60%;
    }
  }
`;

const fetchCountry = async (name) => {
  const response = await axios.get(`/api/countries/name/${encodeURIComponent(name)}`);
  return response.data;
};

const addToFavorites = async (countryData) => {
  const response = await axios.post('/api/users/favorites', {
    countryCode: countryData.cca2 || countryData.name, // Use name as fallback if cca2 is missing
    countryName: countryData.name,
  });
  return response.data;
};

const removeFromFavorites = async (countryCode) => {
  const response = await axios.delete(`/api/users/favorites/${countryCode}`);
  return response.data;
};

const CountryDetails = () => {
  const { name } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAddToListModal, setShowAddToListModal] = useState(false);

  const handleCompare = () => {
    navigate(`/comparison?countries=${encodeURIComponent(name)}`);
  };

  const {
    data: country,
    isLoading,
    error,
  } = useQuery(
    ['country', name],
    () => fetchCountry(name),
    {
      enabled: !!name, // Remove !!user requirement
    },
  );

  const { data: userProfile } = useQuery(
    'userProfile',
    () => axios.get('/api/users/profile').then((res) => res.data),
    {
      enabled: !!user,
    },
  );

  const getCountryCode = (countryData) => countryData?.cca2 || countryData?.name;
  const isCountryInFavorites = (fav) => {
    if (!country) return false;
    return fav.countryCode === getCountryCode(country);
  };
  const isFavorite = userProfile?.favoriteCountries?.some(isCountryInFavorites);

  const addToFavoritesMutation = useMutation(addToFavorites, {
    onSuccess: () => {
      queryClient.invalidateQueries('userProfile');
    },
  });

  const removeFromFavoritesMutation = useMutation(removeFromFavorites, {
    onSuccess: () => {
      queryClient.invalidateQueries('userProfile');
    },
  });

  const handleAddToFavorites = () => {
    if (country) {
      addToFavoritesMutation.mutate(country);
    }
  };

  const handleRemoveFromFavorites = () => {
    if (country) {
      const countryCode = country.cca2 || country.name;
      removeFromFavoritesMutation.mutate(countryCode);
    }
  };

  if (isLoading) {
    return (
      <CountryDetailsContainer>
        <LoadingSpinner />
      </CountryDetailsContainer>
    );
  }

  if (error) {
    return (
      <CountryDetailsContainer>
        <ErrorMessage message="Country not found or failed to load." />
        <BackButton to="/">← Back to Countries</BackButton>
      </CountryDetailsContainer>
    );
  }

  if (!country) {
    return (
      <CountryDetailsContainer>
        <ErrorMessage message="Country not found." />
        <BackButton to="/">← Back to Countries</BackButton>
      </CountryDetailsContainer>
    );
  }

  const formatNumber = (num) => new Intl.NumberFormat().format(num);

  const formatArea = (area) => {
    if (!area) return 'N/A';
    return `${formatNumber(area)} km²`;
  };

  const formatLanguages = (languages) => {
    if (!languages) return 'N/A';
    return Object.values(languages).join(', ');
  };

  const formatCurrencies = (currencies) => {
    if (!currencies) return 'N/A';
    return Object.values(currencies).map((curr) => `${curr.name} (${curr.symbol})`).join(', ');
  };

  return (
    <CountryDetailsContainer>
      <BackButton to="/">← Back to Countries</BackButton>

      <CountryHeader>
        <FlagSection>
          <img
            src={country.flagPng}
            alt={`Flag of ${country.name}`}
            className="flag"
          />
        </FlagSection>

        <CountryInfo>
          <h1>{country.name}</h1>
          <div className="official-name">{country.officialName}</div>

          {user && (
            <div className="actions">
              {isFavorite ? (
                <button
                  type="button"
                  className="btn"
                  onClick={handleRemoveFromFavorites}
                  disabled={removeFromFavoritesMutation.isLoading}
                  style={{ backgroundColor: '#dc3545', color: 'white' }}
                >
                  {removeFromFavoritesMutation.isLoading ? 'Removing...' : 'Remove from Favorites'}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn"
                  onClick={handleAddToFavorites}
                  disabled={addToFavoritesMutation.isLoading}
                >
                  {addToFavoritesMutation.isLoading ? 'Adding...' : 'Add to Favorites'}
                </button>
              )}
              <button
                type="button"
                className="btn"
                onClick={() => setShowAddToListModal(true)}
                style={{ marginLeft: '12px' }}
              >
                Add to List
              </button>
              <button
                type="button"
                className="btn"
                onClick={handleCompare}
                style={{ marginLeft: '12px', backgroundColor: '#17a2b8', color: 'white' }}
              >
                Compare
              </button>
            </div>
          )}
        </CountryInfo>
      </CountryHeader>

      <DetailsGrid>
        <DetailCard>
          <h3>Basic Information</h3>
          <div className="detail-item">
            <span className="label">Capital</span>
            <span className="value">{country.capital?.join(', ') || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="label">Region</span>
            <span className="value">{country.region}</span>
          </div>
          <div className="detail-item">
            <span className="label">Subregion</span>
            <span className="value">{country.subregion || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="label">Continents</span>
            <span className="value">{country.continents?.join(', ')}</span>
          </div>
        </DetailCard>

        <DetailCard>
          <h3>Demographics</h3>
          <div className="detail-item">
            <span className="label">Population</span>
            <span className="value">{formatNumber(country.population)}</span>
          </div>
          <div className="detail-item">
            <span className="label">Area</span>
            <span className="value">{formatArea(country.area)}</span>
          </div>
          <div className="detail-item">
            <span className="label">Languages</span>
            <span className="value">{formatLanguages(country.languages)}</span>
          </div>
        </DetailCard>

        <DetailCard>
          <h3>Economy</h3>
          <div className="detail-item">
            <span className="label">Currencies</span>
            <span className="value">{formatCurrencies(country.currencies)}</span>
          </div>
        </DetailCard>

        <DetailCard>
          <h3>Codes</h3>
          <div className="detail-item">
            <span className="label">ISO 3166-1 alpha-2</span>
            <span className="value">{country.cca2 || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="label">ISO 3166-1 alpha-3</span>
            <span className="value">{country.cca3 || 'N/A'}</span>
          </div>
        </DetailCard>
      </DetailsGrid>

      <AddToListModal
        isOpen={showAddToListModal}
        onClose={() => setShowAddToListModal(false)}
        country={country}
        userProfile={userProfile}
      />
    </CountryDetailsContainer>
  );
};

export default CountryDetails;
