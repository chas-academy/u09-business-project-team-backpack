import React from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FilterLabel = styled.label`
  font-weight: 500;
  color: #333;
  white-space: nowrap;
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const RegionFilter = ({ selectedRegion, onRegionChange }) => {
  const regions = [
    { value: '', label: 'All Regions' },
    { value: 'Africa', label: 'Africa' },
    { value: 'Americas', label: 'Americas' },
    { value: 'Asia', label: 'Asia' },
    { value: 'Europe', label: 'Europe' },
    { value: 'Oceania', label: 'Oceania' },
  ];

  return (
    <FilterContainer>
      <FilterLabel htmlFor="region-filter">Filter by Region:</FilterLabel>
      <FilterSelect
        id="region-filter"
        value={selectedRegion}
        onChange={(e) => onRegionChange(e.target.value)}
        aria-label="Filter countries by region"
      >
        {regions.map((region) => (
          <option key={region.value} value={region.value}>
            {region.label}
          </option>
        ))}
      </FilterSelect>
    </FilterContainer>
  );
};

export default RegionFilter;
