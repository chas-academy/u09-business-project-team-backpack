import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 20px;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  margin: 20px 0;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const ErrorTitle = styled.h3`
  margin: 0 0 8px 0;
  color: #721c24;
`;

const ErrorText = styled.p`
  margin: 0;
  font-size: 16px;
`;

const ErrorMessage = ({ message, title = 'Something went wrong' }) => (
  <ErrorContainer>
    <ErrorIcon>⚠️</ErrorIcon>
    <ErrorTitle>{title}</ErrorTitle>
    <ErrorText>{message}</ErrorText>
  </ErrorContainer>
);

export default ErrorMessage;
