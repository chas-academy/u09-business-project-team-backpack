const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  githubId: {
    type: String,
    sparse: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String
  },
  favoriteCountries: [{
    countryCode: String,
    countryName: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  countryLists: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    countries: [{
      countryCode: String,
      countryName: String,
      addedAt: {
        type: Date,
        default: Date.now
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.countryLists.forEach(list => {
    if (list.isModified()) {
      list.updatedAt = new Date();
    }
  });
  next();
});

module.exports = mongoose.model('User', userSchema);
