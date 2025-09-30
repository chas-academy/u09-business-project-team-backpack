import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import AddToListModal from './AddToListModal';

const CardContainer = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const FlagImage = styled.div`
  width: 100%;
  height: 200px;
  background-image: url(${(props) => props.flagUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const CountryName = styled.h3`
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.3rem;
`;

const CountryDetails = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 12px;
  
  .detail-item {
    margin-bottom: 4px;
    
    .label {
      font-weight: 500;
      color: #555;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ViewButton = styled(Link)`
  display: inline-block;
  flex: 1;
  padding: 12px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  text-align: center;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const AddToListButton = styled.button`
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #218838;
  }
`;

const RemoveFromListButton = styled.button`
  padding: 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #c82333;
  }
`;

const CompareButton = styled.button`
  padding: 12px;
  background-color: #17a2b8;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #138496;
  }
`;

const CountryCard = ({
  country,
  userProfile,
  hideAddToList = false,
  onRemoveFromList,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAddToListModal, setShowAddToListModal] = useState(false);

  const handleCompare = () => {
    navigate(`/comparison?countries=${encodeURIComponent(country.name)}`);
  };

  const formatNumber = (num) => {
    if (!num) return 'N/A';
    return new Intl.NumberFormat().format(num);
  };

  const formatLanguages = (languages) => {
    if (!languages) return 'N/A';
    const langValues = Object.values(languages);
    return langValues.length > 2
      ? `${langValues.slice(0, 2).join(', ')} +${langValues.length - 2} more`
      : langValues.join(', ');
  };

  const formatArea = (area) => {
    if (!area) return 'N/A';
    return `${formatNumber(area)} km²`;
  };

  const formatCurrencies = (currencies) => {
    if (!currencies) return 'N/A';
    const currencyValues = Object.values(currencies).map((curr) => curr.name);
    return currencyValues.length > 2
      ? `${currencyValues.slice(0, 2).join(', ')} +${currencyValues.length - 2} more`
      : currencyValues.join(', ');
  };

  return (
    <CardContainer>
      <FlagImage flagUrl={country.flagPng} />
      <CardContent>
        <CountryName>{country.name}</CountryName>
        <CountryDetails>
          <div className="detail-item">
            <span className="label">Capital:</span>
            {' '}
            {country.capital?.join(', ') || 'N/A'}
          </div>
          <div className="detail-item">
            <span className="label">Region:</span>
            {' '}
            {country.region}
          </div>
          <div className="detail-item">
            <span className="label">Subregion:</span>
            {' '}
            {country.subregion || 'N/A'}
          </div>
          <div className="detail-item">
            <span className="label">Continents:</span>
            {' '}
            {country.continents?.join(', ') || 'N/A'}
          </div>
          <div className="detail-item">
            <span className="label">Area:</span>
            {' '}
            {formatArea(country.area)}
          </div>
          <div className="detail-item">
            <span className="label">Population:</span>
            {' '}
            {formatNumber(country.population)}
          </div>
          <div className="detail-item">
            <span className="label">Languages:</span>
            {' '}
            {formatLanguages(country.languages)}
          </div>
          <div className="detail-item">
            <span className="label">Currencies:</span>
            {' '}
            {formatCurrencies(country.currencies)}
          </div>
        </CountryDetails>
        <ButtonGroup>
          <ViewButton to={`/country/${encodeURIComponent(country.name)}`}>
            View Details
          </ViewButton>
          <CompareButton onClick={handleCompare}>
            Compare
          </CompareButton>
          {onRemoveFromList && (
            <RemoveFromListButton
              onClick={() => onRemoveFromList(country.cca2 || country.name, country.name)}
            >
              Remove from List
            </RemoveFromListButton>
          )}
          {user && !hideAddToList && (
            <AddToListButton onClick={() => {
              // console.log('Add to List button clicked!',
              //   { country: country.name, user: user.name });
              setShowAddToListModal(true);
            }}
            >
              Add to List
            </AddToListButton>
          )}
        </ButtonGroup>
      </CardContent>

      {!hideAddToList && (
        <AddToListModal
          isOpen={showAddToListModal}
          onClose={() => setShowAddToListModal(false)}
          country={country}
          userProfile={userProfile}
        />
      )}
    </CardContainer>
  );
};

export default CountryCard;
