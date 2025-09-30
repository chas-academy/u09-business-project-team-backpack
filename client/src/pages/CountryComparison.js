import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import axios from '../config/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const ComparisonContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const BackButton = styled(Link)`
  display: inline-block;
  margin-bottom: 20px;
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 16px;
`;

const SelectionSection = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SelectionTitle = styled.h3`
  margin-bottom: 15px;
  color: #333;
`;

const CountrySelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 10px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const CompareButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-right: 10px;
  
  &:hover {
    background: #0056b3;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const CountryCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CountryHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Flag = styled.img`
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 15px;
`;

const CountryName = styled.h2`
  color: #333;
  margin: 0;
`;

const ComparisonTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #eee;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 12px 0;
  font-weight: 600;
  color: #333;
  width: 40%;
`;

const TableCell = styled.td`
  padding: 12px 0;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const fetchCountries = async () => {
  const response = await axios.get('/api/countries');
  return response.data;
};

const fetchCountryByName = async (name) => {
  const response = await axios.get(`/api/countries/name/${encodeURIComponent(name)}`);
  return response.data;
};

const CountryComparison = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [comparisonCountries, setComparisonCountries] = useState([]);

  // Get countries from URL params
  const countryParams = searchParams.get('countries');
  const {
    data: countries,
    isLoading: countriesLoading,
    error: countriesError,
  } = useQuery('countries', fetchCountries, {
    enabled: !!user,
  });

  // Fetch comparison countries when URL params change
  const {
    isLoading: comparisonLoading,
    error: comparisonError,
  } = useQuery(
    ['comparison', countryParams],
    async () => {
      if (!countryParams) return [];
      const countryNames = countryParams.split(',');
      const promises = countryNames.map((name) => fetchCountryByName(name.trim()));
      return Promise.all(promises);
    },
    {
      enabled: !!countryParams && !!user,
      onSuccess: (data) => {
        setComparisonCountries(data);
      },
    },
  );

  useEffect(() => {
    if (countryParams) {
      const countryNames = countryParams.split(',');
      setSelectedCountries(countryNames.map((name) => name.trim()));
    }
  }, [countryParams]);

  const handleCountrySelect = (index, countryName) => {
    const newSelected = [...selectedCountries];
    newSelected[index] = countryName;
    setSelectedCountries(newSelected);
  };

  const handleCompare = () => {
    const validCountries = selectedCountries.filter((country) => country && country.trim());
    if (validCountries.length >= 2) {
      setSearchParams({ countries: validCountries.join(',') });
    }
  };

  const formatNumber = (num) => {
    if (!num) return 'N/A';
    return new Intl.NumberFormat().format(num);
  };

  const formatArea = (area) => {
    if (!area) return 'N/A';
    return `${formatNumber(area)} km²`;
  };

  const formatLanguages = (languages) => {
    if (!languages) return 'N/A';
    const languageNames = Object.values(languages).map((lang) => lang);
    return languageNames.length > 3
      ? `${languageNames.slice(0, 3).join(', ')} +${languageNames.length - 3} more`
      : languageNames.join(', ');
  };

  const formatCurrencies = (currencies) => {
    if (!currencies) return 'N/A';
    const currencyValues = Object.values(currencies).map((curr) => curr.name);
    return currencyValues.length > 2
      ? `${currencyValues.slice(0, 2).join(', ')} +${currencyValues.length - 2} more`
      : currencyValues.join(', ');
  };

  if (!user) {
    return (
      <ComparisonContainer>
        <BackButton to="/">← Back to Home</BackButton>
        <EmptyState>
          <h3>Please log in to use the comparison tool</h3>
          <p>Use the &quot;Login with Google&quot; button above to get started.</p>
        </EmptyState>
      </ComparisonContainer>
    );
  }

  if (countriesLoading) {
    return <LoadingSpinner />;
  }

  if (countriesError) {
    return <ErrorMessage message="Failed to load countries" />;
  }

  return (
    <ComparisonContainer>
      <Header>
        <BackButton to="/">← Back to Home</BackButton>
        <Title>Country Comparison Tool</Title>
        <Subtitle>Compare countries side-by-side to discover similarities and differences</Subtitle>
      </Header>

      <SelectionSection>
        <SelectionTitle>Select Countries to Compare (2-3 countries)</SelectionTitle>
        {[0, 1, 2].map((index) => (
          <CountrySelect
            key={index}
            value={selectedCountries[index] || ''}
            onChange={(e) => handleCountrySelect(index, e.target.value)}
          >
            <option value="">Select a country...</option>
            {countries?.map((country) => (
              <option key={country.name} value={country.name}>
                {country.name}
              </option>
            ))}
          </CountrySelect>
        ))}
        <div style={{ marginTop: '15px' }}>
          <CompareButton
            onClick={handleCompare}
            disabled={selectedCountries.filter((c) => c && c.trim()).length < 2}
          >
            Compare Countries
          </CompareButton>
        </div>
      </SelectionSection>

      {comparisonLoading && <LoadingSpinner />}

      {comparisonError && <ErrorMessage message="Failed to load comparison data" />}

      {comparisonCountries.length >= 2 && (
        <ComparisonGrid>
          {comparisonCountries.map((country) => (
            <CountryCard key={country.name}>
              <CountryHeader>
                <Flag src={country.flag} alt={`${country.name} flag`} />
                <CountryName>{country.name}</CountryName>
              </CountryHeader>

              <ComparisonTable>
                <tbody>
                  <TableRow>
                    <TableHeader>Official Name</TableHeader>
                    <TableCell>{country.officialName || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeader>Capital</TableHeader>
                    <TableCell>{country.capital?.join(', ') || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeader>Region</TableHeader>
                    <TableCell>{country.region || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeader>Subregion</TableHeader>
                    <TableCell>{country.subregion || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeader>Continents</TableHeader>
                    <TableCell>{country.continents?.join(', ') || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeader>Population</TableHeader>
                    <TableCell>{formatNumber(country.population)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeader>Area</TableHeader>
                    <TableCell>{formatArea(country.area)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeader>Languages</TableHeader>
                    <TableCell>{formatLanguages(country.languages)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeader>Currencies</TableHeader>
                    <TableCell>{formatCurrencies(country.currencies)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeader>ISO Codes</TableHeader>
                    <TableCell>
                      {country.cca2 && country.cca3 ? `${country.cca2}, ${country.cca3}` : 'N/A'}
                    </TableCell>
                  </TableRow>
                </tbody>
              </ComparisonTable>
            </CountryCard>
          ))}
        </ComparisonGrid>
      )}

      {!countryParams && (
        <EmptyState>
          <h3>Select countries to start comparing</h3>
          <p>Choose 2-3 countries from the dropdown menus above to see a detailed comparison.</p>
        </EmptyState>
      )}
    </ComparisonContainer>
  );
};

export default CountryComparison;
