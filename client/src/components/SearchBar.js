import React, { useState } from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
  
  &::placeholder {
    color: #6c757d;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 18px;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background-color: #f8f9fa;
    color: #333;
  }
`;

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    const { value } = e.target;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <SearchContainer>
      <SearchIcon>🔍</SearchIcon>
      <SearchInput
        type="text"
        placeholder="Search countries..."
        value={query}
        onChange={handleInputChange}
        aria-label="Search countries"
      />
      {query && (
        <ClearButton onClick={handleClear} aria-label="Clear search">
          ✕
        </ClearButton>
      )}
    </SearchContainer>
  );
};

export default SearchBar;
