import axios from 'axios';

// Configure axios defaults
axios.defaults.withCredentials = true;

// Set base URL for API calls - use environment variable or fallback to localhost
const API_URL = process.env.REACT_APP_API_URL || 'https://country-explorer-backend-acem.onrender.com';
axios.defaults.baseURL = API_URL;

export default axios;
