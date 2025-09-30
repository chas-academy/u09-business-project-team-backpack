import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from '../config/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import CountryListManager from '../components/CountryListManager';

const ProfileContainer = styled.div`
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 16px;
    color: #333;
  }

  .user-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 20px;
  }

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid #007bff;
  }

  .user-details {
    text-align: left;
  }

  .user-name {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
  }

  .user-email {
    color: #666;
    font-size: 1rem;
  }
`;

const Section = styled.section`
  margin-bottom: 40px;

  h2 {
    font-size: 1.8rem;
    margin-bottom: 20px;
    color: #333;
    border-bottom: 2px solid #007bff;
    padding-bottom: 8px;
  }
`;

const CountriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;

  h3 {
    margin-bottom: 16px;
    color: #333;
  }
`;

const DangerSection = styled.section`
  margin-top: 60px;
  padding: 30px;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;

  p {
    color: #744210;
    margin-bottom: 20px;
    line-height: 1.5;
  }
`;

const DeleteAccountButton = styled.button`
  background-color: #e53e3e;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;

  &:hover {
    background-color: #c53030;
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

const fetchUserProfile = async () => {
  const response = await axios.get('/api/users/profile');
  return response.data;
};

const removeFromFavorites = async (countryCode) => {
  const response = await axios.delete(`/api/users/favorites/${countryCode}`);
  return response.data;
};

const deleteAccount = async () => {
  const response = await axios.delete('/api/users/account');
  return response.data;
};

const Profile = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery(
    'userProfile',
    fetchUserProfile,
    {
      enabled: !!user,
    },
  );

  const removeFavoriteMutation = useMutation(removeFromFavorites, {
    onSuccess: () => {
      queryClient.invalidateQueries('userProfile');
    },
  });

  const deleteAccountMutation = useMutation(deleteAccount, {
    onSuccess: async () => {
      // Clear all queries and logout
      queryClient.clear();

      // Force logout and clear all authentication state
      await logout();

      // Clear any remaining cookies/localStorage
      document.cookie.split(';').forEach((c) => {
        document.cookie = `${c.replace(/^ +/, '').replace(/=.*/, '')}=;expires=${new Date().toUTCString()};path=/`;
      });

      // Clear localStorage as well
      localStorage.clear();
      sessionStorage.clear();

      // Redirect to home page with a message that they need to log in again
      window.location.href = 'http://localhost:3000/?message=account_deleted';
    },
  });

  const handleRemoveFavorite = (countryCode) => {
    removeFavoriteMutation.mutate(countryCode);
  };

  const handleDeleteAccount = () => {
    const confirmMessage = 'Are you sure you want to delete your account? This action cannot be undone and will permanently remove:\n\n• Your profile information\n• All favorite countries\n• All custom country lists\n• Your account data\n\nType "DELETE" to confirm:';

    // eslint-disable-next-line no-alert
    const userInput = window.prompt(confirmMessage);

    if (userInput === 'DELETE') {
      deleteAccountMutation.mutate();
    } else if (userInput !== null) {
      // eslint-disable-next-line no-alert
      alert('Account deletion cancelled. You must type "DELETE" exactly to confirm.');
    }
  };

  if (!user) {
    return (
      <ProfileContainer>
        <EmptyState>
          <h3>Please log in to view your profile</h3>
          <p>You need to be logged in to access your saved countries and lists.</p>
        </EmptyState>
      </ProfileContainer>
    );
  }

  if (isLoading) {
    return (
      <ProfileContainer>
        <LoadingSpinner />
      </ProfileContainer>
    );
  }

  if (error) {
    return (
      <ProfileContainer>
        <ErrorMessage message="Failed to load profile data." />
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <h1>My Profile</h1>
        <div className="user-info">
          {profile.avatar && (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="avatar"
            />
          )}
          <div className="user-details">
            <div className="user-name">{profile.name}</div>
            <div className="user-email">{profile.email}</div>
          </div>
        </div>
      </ProfileHeader>

      <Section>
        <h2>Favorite Countries</h2>
        {profile.favoriteCountries && profile.favoriteCountries.length > 0 ? (
          <CountriesGrid>
            {profile.favoriteCountries.map((favorite) => (
              <div key={favorite.countryCode} className="card">
                <div className="card-body">
                  <h3>{favorite.countryName}</h3>
                  <p>
                    Added:
                    {' '}
                    {new Date(favorite.addedAt).toLocaleDateString()}
                  </p>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveFavorite(favorite.countryCode)}
                    disabled={removeFavoriteMutation.isLoading}
                  >
                    Remove from Favorites
                  </button>
                </div>
              </div>
            ))}
          </CountriesGrid>
        ) : (
          <EmptyState>
            <h3>No favorite countries yet</h3>
            <p>Start exploring countries and add them to your favorites!</p>
            <Link to="/" className="btn">Explore Countries</Link>
          </EmptyState>
        )}
      </Section>

      <Section>
        <CountryListManager userProfile={profile} />
      </Section>

      <DangerSection>
        <p>
          Once you delete your account, there is no going back. Please be certain.
          This will permanently remove all your data including favorites, lists,
          and profile information.
        </p>
        <DeleteAccountButton
          onClick={handleDeleteAccount}
          disabled={deleteAccountMutation.isLoading}
        >
          {deleteAccountMutation.isLoading ? 'Deleting Account...' : 'Delete Account'}
        </DeleteAccountButton>
      </DangerSection>
    </ProfileContainer>
  );
};

export default Profile;
