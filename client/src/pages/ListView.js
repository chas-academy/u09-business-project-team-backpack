import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import axios from '../config/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import CountryCard from '../components/CountryCard';

const ListViewContainer = styled.div`
  padding: 40px 20px;
  max-width: 1200px;
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

const ListHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 8px;
    color: #333;
  }
  
  .list-description {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 20px;
    font-style: italic;
  }
  
  .list-stats {
    font-size: 1rem;
    color: #888;
  }
`;

const CountriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 40px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  
  h3 {
    margin-bottom: 16px;
    color: #333;
  }
`;

const fetchListDetails = async (listId) => {
  const response = await axios.get(`/api/users/lists/${listId}`);
  return response.data;
};

const fetchCountriesForList = async (countryCodes) => {
  if (!countryCodes || countryCodes.length === 0) {
    return [];
  }

  // Fetch all countries and filter by the ones in the list
  const response = await axios.get('/api/countries');
  const allCountries = response.data;

  // Filter countries that are in our list
  const isCountryInList = (country) => (
    countryCodes.includes(country.cca2) || countryCodes.includes(country.name)
  );
  const listCountries = allCountries.filter(isCountryInList);

  return listCountries;
};

const ListView = () => {
  const { listId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: listDetails,
    isLoading: listLoading,
    error: listError,
  } = useQuery(
    ['listDetails', listId],
    () => fetchListDetails(listId),
    {
      enabled: !!listId && !!user,
    },
  );

  const {
    data: countries,
    isLoading: countriesLoading,
    error: countriesError,
  } = useQuery(
    ['listCountries', listId, listDetails?.countries],
    () => fetchCountriesForList(listDetails?.countries?.map((c) => c.countryCode)),
    {
      enabled: !!listDetails?.countries && listDetails.countries.length > 0,
    },
  );

  const removeFromListMutation = useMutation(
    async ({ countryCode }) => {
      const response = await axios.delete(`/api/users/lists/${listId}/countries/${countryCode}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['listDetails', listId]);
        queryClient.invalidateQueries(['listCountries', listId]);
        queryClient.invalidateQueries('userProfile');
      },
    },
  );

  const handleRemoveFromList = (countryCode, countryName) => {
    if (window.confirm(`Are you sure you want to remove ${countryName} from this list?`)) {
      removeFromListMutation.mutate({ countryCode });
    }
  };

  const isLoading = listLoading || countriesLoading;
  const error = listError || countriesError;

  if (!user) {
    return (
      <ListViewContainer>
        <ErrorMessage message="Please log in to view lists." />
      </ListViewContainer>
    );
  }

  if (isLoading) {
    return (
      <ListViewContainer>
        <LoadingSpinner />
      </ListViewContainer>
    );
  }

  if (error) {
    return (
      <ListViewContainer>
        <ErrorMessage message="Failed to load list details." />
        <BackButton to="/profile">← Back to Profile</BackButton>
      </ListViewContainer>
    );
  }

  if (!listDetails) {
    return (
      <ListViewContainer>
        <ErrorMessage message="List not found." />
        <BackButton to="/profile">← Back to Profile</BackButton>
      </ListViewContainer>
    );
  }

  return (
    <ListViewContainer>
      <BackButton to="/profile">← Back to Profile</BackButton>

      <ListHeader>
        <h1>{listDetails.name}</h1>
        {listDetails.description && (
          <div className="list-description">{listDetails.description}</div>
        )}
        <div className="list-stats">
          {listDetails.countries.length}
          {' '}
          countries • Created
          {new Date(listDetails.createdAt).toLocaleDateString()}
        </div>
      </ListHeader>

      {countries && countries.length > 0 ? (
        <CountriesGrid>
          {countries.map((country) => (
            <CountryCard
              key={country.cca3}
              country={country}
              userProfile={null} // We don't need userProfile for this view
              hideAddToList // Hide the "Add to List" button
              onRemoveFromList={handleRemoveFromList} // Add remove functionality
            />
          ))}
        </CountriesGrid>
      ) : (
        <EmptyState>
          <h3>No countries in this list yet</h3>
          <p>Add some countries to this list to see them here!</p>
          <Link to="/" className="btn">Explore Countries</Link>
        </EmptyState>
      )}
    </ListViewContainer>
  );
};

export default ListView;
