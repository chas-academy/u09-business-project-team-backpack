import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from '../config/axios';

const ListManagerContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    margin: 0;
    color: #333;
  }
`;

const ListForm = styled.form`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  
  input {
    flex: 1;
    padding: 12px;
    border: 2px solid #e9ecef;
    border-radius: 6px;
    font-size: 16px;
    
    &:focus {
      outline: none;
      border-color: #007bff;
    }
  }
`;

const ListsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ListCard = styled.div`
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  transition: border-color 0.2s ease;
  
  &:hover {
    border-color: #007bff;
  }
  
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    h4 {
      margin: 0;
      color: #333;
      font-size: 1.1rem;
    }
    
    .list-actions {
      display: flex;
      gap: 8px;
    }
  }
  
  .list-description {
    color: #666;
    margin-bottom: 16px;
    font-size: 0.9rem;
  }
  
  .list-countries {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
    
    .country-tag {
      background: #e9ecef;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      color: #495057;
      display: flex;
      align-items: center;
      gap: 4px;
      
      .remove-btn {
        background: none;
        border: none;
        color: #dc3545;
        cursor: pointer;
        font-size: 0.9rem;
        padding: 0;
        margin-left: 4px;
        line-height: 1;
        
        &:hover {
          color: #c82333;
        }
      }
    }
  }
  
  .list-stats {
    margin-top: 12px;
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 16px;
  }
  
  .view-list-btn {
    width: 100%;
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: #0056b3;
    }
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s ease;
  
  &.btn-primary {
    background-color: #007bff;
    color: white;
    
    &:hover {
      background-color: #0056b3;
    }
  }
  
  &.btn-secondary {
    background-color: #6c757d;
    color: white;
    
    &:hover {
      background-color: #545b62;
    }
  }
  
  &.btn-danger {
    background-color: #dc3545;
    color: white;
    
    &:hover {
      background-color: #c82333;
    }
  }
  
  &.btn-sm {
    padding: 4px 8px;
    font-size: 12px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  
  h4 {
    margin-bottom: 12px;
    color: #333;
  }
`;

const CountryListManager = ({ userProfile }) => {
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [editingList, setEditingList] = useState(null);
  const [editListName, setEditListName] = useState('');
  const [editListDescription, setEditListDescription] = useState('');

  const queryClient = useQueryClient();

  const createListMutation = useMutation(
    async (listData) => {
      const response = await axios.post('/api/users/lists', listData, {
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userProfile');
        setNewListName('');
        setNewListDescription('');
      },
    },
  );

  const updateListMutation = useMutation(
    async ({ listId, listData }) => {
      const response = await axios.put(`/api/users/lists/${listId}`, listData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userProfile');
        setEditingList(null);
        setEditListName('');
        setEditListDescription('');
      },
    },
  );

  const deleteListMutation = useMutation(
    async (listId) => {
      const response = await axios.delete(`/api/users/lists/${listId}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userProfile');
      },
    },
  );

  const removeCountryMutation = useMutation(
    async ({ listId, countryCode }) => {
      const response = await axios.delete(`/api/users/lists/${listId}/countries/${countryCode}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userProfile');
      },
    },
  );

  const handleCreateList = (e) => {
    e.preventDefault();
    if (newListName.trim()) {
      createListMutation.mutate({
        name: newListName.trim(),
        description: newListDescription.trim(),
      });
    }
  };

  const handleEditList = (list) => {
    // eslint-disable-next-line no-underscore-dangle
    setEditingList(list._id);
    setEditListName(list.name);
    setEditListDescription(list.description || '');
  };

  const handleUpdateList = (e) => {
    e.preventDefault();
    if (editListName.trim()) {
      updateListMutation.mutate({
        listId: editingList,
        listData: {
          name: editListName.trim(),
          description: editListDescription.trim(),
        },
      });
    }
  };

  const handleDeleteList = (listId) => {
    if (window.confirm('Are you sure you want to delete this list? This action cannot be undone.')) {
      deleteListMutation.mutate(listId);
    }
  };

  const handleRemoveCountry = (listId, countryCode, countryName) => {
    if (window.confirm(`Are you sure you want to remove ${countryName} from this list?`)) {
      removeCountryMutation.mutate({ listId, countryCode });
    }
  };

  const cancelEdit = () => {
    setEditingList(null);
    setEditListName('');
    setEditListDescription('');
  };

  return (
    <ListManagerContainer>
      <ListHeader>
        <h3>My Country Lists</h3>
        <span>
          {userProfile?.countryLists?.length || 0}
          {' '}
          lists
        </span>
      </ListHeader>

      <ListForm onSubmit={handleCreateList}>
        <input
          type="text"
          placeholder="List name..."
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={newListDescription}
          onChange={(e) => setNewListDescription(e.target.value)}
        />
        <Button
          type="submit"
          className="btn-primary"
          disabled={createListMutation.isLoading}
        >
          {createListMutation.isLoading ? 'Creating...' : 'Create List'}
        </Button>
      </ListForm>

      {userProfile?.countryLists && userProfile.countryLists.length > 0 ? (
        <ListsGrid>
          {userProfile.countryLists.map((list) => (
            // eslint-disable-next-line no-underscore-dangle
            <ListCard key={list._id}>
              {/* eslint-disable-next-line no-underscore-dangle */}
              {editingList === list._id ? (
                <form onSubmit={handleUpdateList}>
                  <input
                    type="text"
                    value={editListName}
                    onChange={(e) => setEditListName(e.target.value)}
                    className="form-control"
                    style={{ marginBottom: '8px', width: '100%', padding: '8px' }}
                    required
                  />
                  <input
                    type="text"
                    value={editListDescription}
                    onChange={(e) => setEditListDescription(e.target.value)}
                    className="form-control"
                    style={{ marginBottom: '12px', width: '100%', padding: '8px' }}
                    placeholder="Description"
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button type="submit" className="btn-primary btn-sm">
                      Save
                    </Button>
                    <Button type="button" onClick={cancelEdit} className="btn-secondary btn-sm">
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="list-header">
                    <h4>{list.name}</h4>
                    <div className="list-actions">
                      <Button
                        onClick={() => handleEditList(list)}
                        className="btn-secondary btn-sm"
                      >
                        Edit
                      </Button>
                      <Button
                        // eslint-disable-next-line no-underscore-dangle
                        onClick={() => handleDeleteList(list._id)}
                        className="btn-danger btn-sm"
                        disabled={deleteListMutation.isLoading}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  {list.description && (
                    <div className="list-description">{list.description}</div>
                  )}

                  <div className="list-countries">
                    {list.countries.map((country) => (
                      <span key={country.countryCode} className="country-tag">
                        {country.countryName}
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => handleRemoveCountry(
                            list._id, // eslint-disable-line no-underscore-dangle
                            country.countryCode,
                            country.countryName,
                          )}
                          disabled={removeCountryMutation.isLoading}
                          title={`Remove ${country.countryName} from list`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="list-stats">
                    {list.countries.length}
                    {' '}
                    countries • Created
                    {' '}
                    {new Date(list.createdAt).toLocaleDateString()}
                  </div>

                  <Link
                    // eslint-disable-next-line no-underscore-dangle
                    to={`/list/${list._id}`}
                    className="view-list-btn"
                  >
                    View List
                  </Link>
                </>
              )}
            </ListCard>
          ))}
        </ListsGrid>
      ) : (
        <EmptyState>
          <h4>No lists yet</h4>
          <p>Create your first country list to start organizing your favorite countries!</p>
        </EmptyState>
      )}
    </ListManagerContainer>
  );
};

export default CountryListManager;
