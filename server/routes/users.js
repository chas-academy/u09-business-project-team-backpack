const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'Authentication required' });
};

// Get user profile
router.get('/profile', requireAuth, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
    favoriteCountries: req.user.favoriteCountries,
    countryLists: req.user.countryLists,
    createdAt: req.user.createdAt,
    lastLogin: req.user.lastLogin
  });
});

// Add country to favorites
router.post('/favorites', requireAuth, async (req, res) => {
  try {
    const { countryCode, countryName } = req.body;
    
    if (!countryCode || !countryName) {
      return res.status(400).json({ message: 'Country code and name are required' });
    }
    
    // Check if country is already in favorites
    const existingFavorite = req.user.favoriteCountries.find(
      fav => fav.countryCode === countryCode
    );
    
    if (existingFavorite) {
      return res.status(400).json({ message: 'Country already in favorites' });
    }
    
    req.user.favoriteCountries.push({
      countryCode,
      countryName,
      addedAt: new Date()
    });
    
    await req.user.save();
    res.json({ message: 'Country added to favorites', favorites: req.user.favoriteCountries });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ message: 'Failed to add country to favorites' });
  }
});

// Remove country from favorites
router.delete('/favorites/:countryCode', requireAuth, async (req, res) => {
  try {
    const { countryCode } = req.params;
    
    req.user.favoriteCountries = req.user.favoriteCountries.filter(
      fav => fav.countryCode !== countryCode
    );
    
    await req.user.save();
    res.json({ message: 'Country removed from favorites', favorites: req.user.favoriteCountries });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ message: 'Failed to remove country from favorites' });
  }
});

// Get user's country lists
router.get('/lists', requireAuth, (req, res) => {
  res.json(req.user.countryLists);
});

// Get specific country list by ID
router.get('/lists/:listId', requireAuth, async (req, res) => {
  try {
    const { listId } = req.params;
    
    const list = req.user.countryLists.id(listId);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    
    res.json(list);
  } catch (error) {
    console.error('Error fetching list:', error);
    res.status(500).json({ message: 'Failed to fetch list' });
  }
});

// Create new country list
router.post('/lists', requireAuth, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'List name is required' });
    }
    
    // Check if list with same name already exists
    const existingList = req.user.countryLists.find(
      list => list.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingList) {
      return res.status(400).json({ message: 'List with this name already exists' });
    }
    
    const newList = {
      name,
      description: description || '',
      countries: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    req.user.countryLists.push(newList);
    await req.user.save();
    
    res.json({ message: 'List created successfully', list: newList });
  } catch (error) {
    console.error('Error creating list:', error);
    res.status(500).json({ message: 'Failed to create list' });
  }
});

// Update country list
router.put('/lists/:listId', requireAuth, async (req, res) => {
  try {
    const { listId } = req.params;
    const { name, description } = req.body;
    
    const list = req.user.countryLists.id(listId);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    
    if (name) list.name = name;
    if (description !== undefined) list.description = description;
    list.updatedAt = new Date();
    
    await req.user.save();
    res.json({ message: 'List updated successfully', list });
  } catch (error) {
    console.error('Error updating list:', error);
    res.status(500).json({ message: 'Failed to update list' });
  }
});

// Delete country list
router.delete('/lists/:listId', requireAuth, async (req, res) => {
  try {
    const { listId } = req.params;
    
    const list = req.user.countryLists.id(listId);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    
    req.user.countryLists.pull(listId);
    await req.user.save();
    
    res.json({ message: 'List deleted successfully' });
  } catch (error) {
    console.error('Error deleting list:', error);
    res.status(500).json({ message: 'Failed to delete list' });
  }
});

// Add country to list
router.post('/lists/:listId/countries', requireAuth, async (req, res) => {
  try {
    const { listId } = req.params;
    const { countryCode, countryName } = req.body;
    
    if (!countryCode || !countryName) {
      return res.status(400).json({ message: 'Country code and name are required' });
    }
    
    const list = req.user.countryLists.id(listId);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    
    // Check if country is already in list
    const existingCountry = list.countries.find(
      country => country.countryCode === countryCode
    );
    
    if (existingCountry) {
      return res.status(400).json({ message: 'Country already in list' });
    }
    
    list.countries.push({
      countryCode,
      countryName,
      addedAt: new Date()
    });
    list.updatedAt = new Date();
    
    await req.user.save();
    res.json({ message: 'Country added to list', list });
  } catch (error) {
    console.error('Error adding country to list:', error);
    res.status(500).json({ message: 'Failed to add country to list' });
  }
});

// Remove country from list
router.delete('/lists/:listId/countries/:countryCode', requireAuth, async (req, res) => {
  try {
    const { listId, countryCode } = req.params;
    
    const list = req.user.countryLists.id(listId);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    
    list.countries = list.countries.filter(
      country => country.countryCode !== countryCode
    );
    list.updatedAt = new Date();
    
    await req.user.save();
    res.json({ message: 'Country removed from list', list });
  } catch (error) {
    console.error('Error removing country from list:', error);
    res.status(500).json({ message: 'Failed to remove country from list' });
  }
});

// Delete user account
router.delete('/account', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Delete the user from the database
    await User.findByIdAndDelete(userId);
    
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Account deleted but session cleanup failed' });
      }
      
      res.clearCookie('connect.sid');
      res.json({ message: 'Account deleted successfully' });
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Failed to delete account' });
  }
});

module.exports = router;
