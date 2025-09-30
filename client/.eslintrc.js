module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    'airbnb',
    'airbnb/hooks'
  ],
  rules: {
    // Allow console.log in development
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    
    // Allow unused vars that start with underscore
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    
    // Allow JSX in .js files
    'react/jsx-filename-extension': ['error', { 'extensions': ['.js', '.jsx'] }],
    
    // Allow prop-types to be missing (using TypeScript-like props)
    'react/prop-types': 'off',
    
    // Allow default props
    'react/require-default-props': 'off',
    
    // Allow arrow functions in components
    'react/function-component-definition': 'off',
    
    // Allow any prop spreading
    'react/jsx-props-no-spreading': 'off',
    
    // Allow default exports
    'import/prefer-default-export': 'off',
    
    // Allow named exports
    'import/no-named-as-default': 'off',
    
    // Allow dependencies in useEffect
    'react-hooks/exhaustive-deps': 'warn',
    
    // Allow any in JSX
    'react/jsx-no-bind': 'off',
    
    // Allow any HTML attributes
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    
    // Allow any anchor tags
    'jsx-a11y/anchor-is-valid': 'off',
    
    // Line ending rules
    'linebreak-style': ['error', 'unix']
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true
  }
};
