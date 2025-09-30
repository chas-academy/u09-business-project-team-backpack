import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #343a40;
  color: white;
  padding: 40px 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
`;

const FooterSection = styled.div`
  h3 {
    margin-bottom: 16px;
    color: #fff;
  }
  
  p, a {
    color: #adb5bd;
    text-decoration: none;
    line-height: 1.6;
  }
  
  a:hover {
    color: #fff;
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  border-top: 1px solid #495057;
  text-align: center;
  color: #adb5bd;
`;

const Footer = () => (
  <FooterContainer>
    <FooterContent>
      <FooterSection>
        <h3>Country Explorer</h3>
        <p>
          Discover countries around the world, gather info and create your
          personal collections of favorite places.
        </p>
      </FooterSection>

      <FooterSection>
        <h3>Features</h3>
        <p>• Browse countries by region</p>
        <p>• Search country information</p>
        <p>• Save favorite countries</p>
        <p>• Create custom lists</p>
      </FooterSection>

      <FooterSection>
        <h3>Data Source</h3>
        <p>
          Country data provided by
          {' '}
          <a
            href="https://restcountries.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            REST Countries API
          </a>
        </p>
      </FooterSection>
    </FooterContent>

    <FooterBottom>
      <p>&copy; 2025 Country Explorer. Built with React, Node.js, and MongoDB.</p>
    </FooterBottom>
  </FooterContainer>
);

export default Footer;
