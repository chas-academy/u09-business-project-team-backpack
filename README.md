# Country Explorer 🌍

A web application for exploring countries around the world, built with React, Node.js, and MongoDB.

## Features

- Browse and search countries worldwide
- Filter by region/continent
- Save favorite countries (requires login)
- Create custom country lists
- Detailed country information (flags, currencies, languages)
- Google OAuth authentication
- Mobile responsive design

## Quick Start

1. **Install dependencies**
   ```bash
   npm run install-all
   ```

2. **Setup environment**
   ```bash
   cp server/env.example server/.env
   ```
   Update `server/.env` with your MongoDB URI and Google OAuth credentials.

3. **Start the application**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5001

## Tech Stack

- **Frontend**: React 18, React Router, Styled Components
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js with Google OAuth
- **Data Source**: REST Countries API

## Project Structure

```
├── client/          # React frontend
├── server/          # Node.js backend
└── package.json     # Root package.json
```

## API Endpoints

- `GET /api/countries` - Get all countries
- `GET /api/countries/search?q=query` - Search countries
- `GET /api/users/profile` - Get user profile
- `POST /api/users/favorites` - Add to favorites
- `POST /api/users/lists` - Create country list

## What problem does this codebase solve?

This codebase solves the problem of fragmented and hard-to-access country information. Instead of having to search multiple different websites to get complete information about countries, Country Explorer provides:

- **Centralized information source** - All country information in one place
- **Personal collections** - Users can save their favorite countries and create custom lists
- **Search and filtering functions** - Easy to find specific countries or regions
- **Updated data** - Information from REST Countries API that stays current
- **User-friendly interface** - Intuitive design for all age groups

## Usage Example

**Scenario: A user wants to plan a trip to the Nordic countries**

1. **Explore countries**
   - User opens Country Explorer on the homepage
   - Sees all countries in a grid view with flags and basic information

2. **Search for specific countries**
   - Types "Sweden" in the search field
   - Gets immediate results with Sweden and similar countries

3. **Filter by region**
   - Selects "Europe" in the region filter
   - Sees all European countries, including the Nordic ones

4. **Get detailed information**
   - Clicks on Sweden to see detailed information
   - Reads about capital (Stockholm), population, currency (SEK), languages

5. **Save favorites (after login)**
   - Logs in with Google
   - Clicks "Add to Favorites" on Sweden
   - Also adds Norway and Denmark

6. **Create a travel list**
   - Goes to their profile
   - Creates a new list: "Nordic Trip"
   - Adds Sweden, Norway and Denmark to the list
   - Can later return and see their planned trip

7. **Compare countries**
   - Clicks the "Compare" button on Sweden
   - Adds Norway and Denmark for comparison
   - Sees side-by-side comparison of population, area, currencies and languages
   - Can easily choose which countries to compare

## Additional Documentation and Reference Materials

- **REST Countries API**: https://restcountries.com - Source for all country information
- **React Documentation**: https://reactjs.org/docs - Frontend framework
- **Express.js Guide**: https://expressjs.com/guide - Backend framework
- **MongoDB Manual**: https://docs.mongodb.com - Database documentation
- **Passport.js Documentation**: http://www.passportjs.org/docs - Authentication
- **Styled Components**: https://styled-components.com/docs - CSS-in-JS library

## Development

Developed by Gabriel Kereklidis Paulin