import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.div`
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const AboutHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 16px;
    color: #333;
  }
  
  p {
    font-size: 1.2rem;
    color: #666;
  }
`;

const Section = styled.section`
  margin-bottom: 40px;
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 16px;
    color: #333;
    border-bottom: 2px solid #007bff;
    padding-bottom: 8px;
  }
  
  p {
    line-height: 1.6;
    margin-bottom: 16px;
    color: #555;
  }
  
  ul {
    margin-left: 20px;
    margin-bottom: 16px;
    
    li {
      margin-bottom: 8px;
      color: #555;
    }
  }
`;

const TechStack = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
  
  .tech-item {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
    
    h3 {
      margin-bottom: 8px;
      color: #333;
    }
    
    p {
      color: #666;
      font-size: 0.9rem;
    }
  }
`;

const About = () => (
  <AboutContainer>
    <AboutHeader>
      <h1>About Country Explorer</h1>
      <p>
        Discover the world through our comprehensive country search platform
      </p>
    </AboutHeader>

    <Section>
      <h2>What is Country Explorer?</h2>
      <p>
        Country Explorer is a web application that allows users to discover and learn
        about countries around the world. Built as a school project, it demonstrates
        modern web development practices and provides an engaging way to explore
        global geography and culture.
      </p>
      <p>
        The application integrates with the REST Countries API to provide up-to-date
        information about countries, including their capitals, populations, currencies,
        languages, and more. Users can search, filter, and save their favorite countries
        for future reference.
      </p>
    </Section>

    <Section>
      <h2>Key Features</h2>
      <ul>
        <li>
          <strong>Country Discovery:</strong>
          {' '}
          Browse and search through countries worldwide
        </li>
        <li>
          <strong>Regional Filtering:</strong>
          {' '}
          Filter countries by continent or region
        </li>
        <li>
          <strong>Detailed Information:</strong>
          {' '}
          View comprehensive country data including flags, currencies, and languages
        </li>
        <li>
          <strong>User Authentication:</strong>
          {' '}
          Secure login with Google OAuth
        </li>
        <li>
          <strong>Personal Collections:</strong>
          {' '}
          Save favorite countries and create custom lists
        </li>
        <li>
          <strong>Mobile Responsive:</strong>
          {' '}
          Optimized for all device sizes
        </li>
        <li>
          <strong>Accessibility:</strong>
          {' '}
          Built with accessibility best practices
        </li>
      </ul>
    </Section>

    <Section>
      <h2>Technical Stack</h2>
      <TechStack>
        <div className="tech-item">
          <h3>Frontend</h3>
          <p>
            React 18 with modern hooks, React Router for navigation, and Styled Components for
            styling
          </p>
        </div>
        <div className="tech-item">
          <h3>Backend</h3>
          <p>Node.js with Express framework for RESTful API development</p>
        </div>
        <div className="tech-item">
          <h3>Database</h3>
          <p>MongoDB with Mongoose ODM for data persistence and user management</p>
        </div>
        <div className="tech-item">
          <h3>Authentication</h3>
          <p>Passport.js with Google OAuth strategy</p>
        </div>
        <div className="tech-item">
          <h3>External API</h3>
          <p>REST Countries API for comprehensive country data</p>
        </div>
        <div className="tech-item">
          <h3>Development</h3>
          <p>ESLint and Stylelint for code quality and consistency</p>
        </div>
      </TechStack>
    </Section>

    <Section>
      <h2>Project Goals</h2>
      <p>
        This project was created to demonstrate proficiency in full-stack web development,
        including modern JavaScript frameworks, API integration, user authentication,
        and database management. The application showcases:
      </p>
      <ul>
        <li>Clean, maintainable code following industry standards</li>
        <li>Responsive design principles and mobile-first approach</li>
        <li>Secure user authentication and session management</li>
        <li>Efficient data fetching and state management</li>
        <li>Accessibility considerations and inclusive design</li>
        <li>Comprehensive error handling and user feedback</li>
      </ul>
    </Section>

    <Section>
      <h2>Development</h2>
      <p>Developed by Gabriel Kereklidis Paulin</p>
    </Section>

    <Section>
      <h2>Data Source</h2>
      <p>
        Country information is provided by the
        {' '}
        <a
          href="https://restcountries.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          REST Countries API
        </a>
        , a free and open-source API that provides comprehensive data about countries
        worldwide. We are grateful for their excellent service and commitment to
        providing accurate, up-to-date information.
      </p>
    </Section>
  </AboutContainer>
);

export default About;
