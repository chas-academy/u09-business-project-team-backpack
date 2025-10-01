const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google OAuth routes
router.get('/google', (req, res, next) => {
  const options = {
    scope: ['profile', 'email']
  };
  
  // If prompt parameter is provided, add it to force account selection
  if (req.query.prompt) {
    options.prompt = req.query.prompt;
  }
  
  passport.authenticate('google', options)(req, res, next);
});

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      console.log('OAuth callback - User authenticated:', req.user);
      console.log('OAuth callback - SessionID:', req.sessionID);
      console.log('OAuth callback - Session:', req.session);
      
      // Update last login
      req.user.lastLogin = new Date();
      await req.user.save();
      
      console.log('User saved successfully');
      
      // Force session save and redirect with user data
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
        }
        console.log('Session saved, redirecting with user data...');
        
        // Redirect to frontend with user data in URL params
        const userData = encodeURIComponent(JSON.stringify({
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          avatar: req.user.avatar
        }));
        
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/success?user=${userData}`);
      });
    } catch (error) {
      console.error('Error in OAuth callback:', error);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/success`);
    }
  }
);

// GitHub OAuth routes
router.get('/github', passport.authenticate('github', {
  scope: ['user:email']
}));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Update last login
    req.user.lastLogin = new Date();
    req.user.save();
    
    // Redirect to frontend with success
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/success`);
  }
);

// Logout route
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  });
});

// Check authentication status
router.get('/status', (req, res) => {
  console.log('Auth status check - isAuthenticated:', req.isAuthenticated());
  console.log('Auth status check - user:', req.user);
  console.log('Auth status check - session:', req.session);
  console.log('Auth status check - sessionID:', req.sessionID);
  
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;
