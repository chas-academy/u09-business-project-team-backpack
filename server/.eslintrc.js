module.exports = {
  extends: [
    'airbnb-base'
  ],
  rules: {
    // Allow console.log in development
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    
    // Allow unused vars that start with underscore
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    
    // Allow require statements
    'import/no-commonjs': 'off',
    
    // Allow default exports
    'import/prefer-default-export': 'off',
    
    // Allow any in function parameters
    'no-param-reassign': ['error', { 'props': false }],
    
    // Allow any in arrow functions
    'arrow-body-style': 'off',
    
    // Allow any in function declarations
    'func-names': 'off',
    
    // Allow any in object destructuring
    'object-shorthand': 'off',
    
    // Allow any in array destructuring
    'prefer-destructuring': 'off',
    
    // Allow any in template literals
    'prefer-template': 'off',
    
    // Allow any in string concatenation
    'prefer-const': 'warn',
    
    // Allow any in variable declarations
    'no-var': 'error',
    
    // Allow any in function expressions
    'prefer-arrow-callback': 'off',
    
    // Line ending rules
    'linebreak-style': ['error', 'unix']
  },
  env: {
    node: true,
    es6: true,
    jest: true
  }
};
