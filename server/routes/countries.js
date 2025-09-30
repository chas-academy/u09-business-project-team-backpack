const express = require('express');
const axios = require('axios');
const router = express.Router();

const REST_COUNTRIES_API = 'https://restcountries.com/v3.1';

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'Authentication required' });
};

// Get all countries
router.get('/', requireAuth, async (req, res) => {
  try {
    // Get basic country data
    const basicResponse = await axios.get(`${REST_COUNTRIES_API}/all?fields=name,capital,region,subregion,population,area,flags,cca2,cca3,continents`);
    
    // Get currencies data
    const currenciesResponse = await axios.get(`${REST_COUNTRIES_API}/all?fields=name,currencies`);
    
    // Get languages data
    const languagesResponse = await axios.get(`${REST_COUNTRIES_API}/all?fields=name,languages`);
    
    // Create lookup maps for currencies and languages
    const currenciesMap = new Map();
    currenciesResponse.data.forEach(country => {
      currenciesMap.set(country.name.common, country.currencies);
    });
    
    const languagesMap = new Map();
    languagesResponse.data.forEach(country => {
      languagesMap.set(country.name.common, country.languages);
    });
    
    // Merge all data
    const countries = basicResponse.data.map(country => ({
      name: country.name.common,
      officialName: country.name.official,
      capital: country.capital,
      region: country.region,
      subregion: country.subregion,
      population: country.population,
      area: country.area,
      flag: country.flags.svg,
      flagPng: country.flags.png,
      currencies: currenciesMap.get(country.name.common),
      languages: languagesMap.get(country.name.common),
      cca2: country.cca2,
      cca3: country.cca3,
      ccn3: country.ccn3,
      continents: country.continents,
      timezones: country.timezones,
      borders: country.borders
    }));
    
    res.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ message: 'Failed to fetch countries' });
  }
});

// Get country by name
router.get('/name/:name', requireAuth, async (req, res) => {
  try {
    const { name } = req.params;
    
    // Get basic country data
    const basicResponse = await axios.get(`${REST_COUNTRIES_API}/name/${name}?fields=name,capital,region,subregion,population,area,flags,cca2,cca3,continents`);
    
    if (basicResponse.data.length === 0) {
      return res.status(404).json({ message: 'Country not found' });
    }
    
    const country = basicResponse.data[0];
    
    // Get currencies and languages for this specific country
    const currenciesResponse = await axios.get(`${REST_COUNTRIES_API}/name/${name}?fields=name,currencies`);
    const languagesResponse = await axios.get(`${REST_COUNTRIES_API}/name/${name}?fields=name,languages`);
    
    const formattedCountry = {
      name: country.name.common,
      officialName: country.name.official,
      capital: country.capital,
      region: country.region,
      subregion: country.subregion,
      population: country.population,
      area: country.area,
      flag: country.flags.svg,
      flagPng: country.flags.png,
      currencies: currenciesResponse.data[0]?.currencies,
      languages: languagesResponse.data[0]?.languages,
      cca2: country.cca2,
      cca3: country.cca3,
      ccn3: country.ccn3,
      continents: country.continents,
      timezones: country.timezones,
      borders: country.borders
    };
    
    res.json(formattedCountry);
  } catch (error) {
    console.error('Error fetching country:', error);
    res.status(500).json({ message: 'Failed to fetch country' });
  }
});

// Get countries by region
router.get('/region/:region', requireAuth, async (req, res) => {
  try {
    const { region } = req.params;
    
    // Get basic country data
    const basicResponse = await axios.get(`${REST_COUNTRIES_API}/region/${region}?fields=name,capital,region,subregion,population,area,flags,cca2,cca3,continents`);
    
    // Get currencies data for all countries in this region
    const currenciesResponse = await axios.get(`${REST_COUNTRIES_API}/region/${region}?fields=name,currencies`);
    
    // Get languages data for all countries in this region
    const languagesResponse = await axios.get(`${REST_COUNTRIES_API}/region/${region}?fields=name,languages`);
    
    // Create lookup maps for currencies and languages
    const currenciesMap = new Map();
    currenciesResponse.data.forEach(country => {
      currenciesMap.set(country.name.common, country.currencies);
    });
    
    const languagesMap = new Map();
    languagesResponse.data.forEach(country => {
      languagesMap.set(country.name.common, country.languages);
    });
    
    // Merge all data
    const countries = basicResponse.data.map(country => ({
      name: country.name.common,
      officialName: country.name.official,
      capital: country.capital,
      region: country.region,
      subregion: country.subregion,
      population: country.population,
      area: country.area,
      flag: country.flags.svg,
      flagPng: country.flags.png,
      currencies: currenciesMap.get(country.name.common),
      languages: languagesMap.get(country.name.common),
      cca2: country.cca2,
      cca3: country.cca3,
      ccn3: country.ccn3,
      continents: country.continents,
      timezones: country.timezones,
      borders: country.borders
    }));
    
    res.json(countries);
  } catch (error) {
    console.error('Error fetching countries by region:', error);
    res.status(500).json({ message: 'Failed to fetch countries by region' });
  }
});

// Search countries
router.get('/search', requireAuth, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    // Get basic country data
    const basicResponse = await axios.get(`${REST_COUNTRIES_API}/name/${q}?fields=name,capital,region,subregion,population,area,flags,cca2,cca3,continents`);
    
    // Get currencies data for search results
    const currenciesResponse = await axios.get(`${REST_COUNTRIES_API}/name/${q}?fields=name,currencies`);
    
    // Get languages data for search results
    const languagesResponse = await axios.get(`${REST_COUNTRIES_API}/name/${q}?fields=name,languages`);
    
    // Create lookup maps for currencies and languages
    const currenciesMap = new Map();
    currenciesResponse.data.forEach(country => {
      currenciesMap.set(country.name.common, country.currencies);
    });
    
    const languagesMap = new Map();
    languagesResponse.data.forEach(country => {
      languagesMap.set(country.name.common, country.languages);
    });
    
    // Merge all data
    const countries = basicResponse.data.map(country => ({
      name: country.name.common,
      officialName: country.name.official,
      capital: country.capital,
      region: country.region,
      subregion: country.subregion,
      population: country.population,
      area: country.area,
      flag: country.flags.svg,
      flagPng: country.flags.png,
      currencies: currenciesMap.get(country.name.common),
      languages: languagesMap.get(country.name.common),
      cca2: country.cca2,
      cca3: country.cca3,
      ccn3: country.ccn3,
      continents: country.continents,
      timezones: country.timezones,
      borders: country.borders
    }));
    
    res.json(countries);
  } catch (error) {
    console.error('Error searching countries:', error);
    res.status(500).json({ message: 'Failed to search countries' });
  }
});

module.exports = router;
