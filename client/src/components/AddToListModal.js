import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import axios from '../config/axios';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    margin: 0;
    color: #333;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    
    &:hover {
      color: #333;
    }
  }
`;

const ListGrid = styled.div`
  display: grid;
  gap: 12px;
  margin-bottom: 20px;
`;

const ListItem = styled.div`
  border: 2px solid ${(props) => (props.selected ? '#007bff' : '#e9ecef')};
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  transition: border-color 0.2s ease;
  
  &:hover {
    border-color: #007bff;
  }
  
  .list-name {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }
  
  .list-description {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 8px;
  }
  
  .list-count {
    font-size: 0.8rem;
    color: #666;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s ease;
  
  &.btn-primary {
    background-color: #007bff;
    color: white;
    
    &:hover {
      background-color: #0056b3;
    }
    
    &:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
  }
  
  &.btn-secondary {
    background-color: #6c757d;
    color: white;
    
    &:hover {
      background-color: #545b62;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const AddToListModal = ({
  isOpen,
  onClose,
  country,
  userProfile,
}) => {
  const [selectedLists, setSelectedLists] = useState([]);
  const queryClient = useQueryClient();

  // console.log('AddToListModal props:', {
  //   isOpen,
  //   country: country?.name,
  //   userProfile: userProfile?.countryLists?.length,
  //   lists: userProfile?.countryLists?.map((l) => ({
  //     name: l.name,
  //     id: l._id,
  //   })),
  // });

  const addToListsMutation = useMutation(
    async ({ countryCode, countryName, listIds }) => {
      const promises = listIds.map((listId) => axios.post(`/api/users/lists/${listId}/countries`, {
        countryCode,
        countryName,
      }));
      await Promise.all(promises);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userProfile');
        onClose();
        setSelectedLists([]);
      },
    },
  );

  const handleListToggle = (listId) => {
    setSelectedLists((prev) => {
      if (prev.includes(listId)) {
        return prev.filter((id) => id !== listId);
      }
      return [...prev, listId];
    });
  };

  const handleAddToLists = () => {
    if (selectedLists.length > 0 && country) {
      addToListsMutation.mutate({
        countryCode: country.cca2 || country.name, // Use name as fallback if cca2 is missing
        countryName: country.name,
        listIds: selectedLists,
      });
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedLists([]);
  };

  if (!isOpen) {
    // console.log('Modal not open, returning null');
    return null;
  }

  // console.log('Modal is open, rendering modal...');
  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>
            Add
            {' '}
            {country?.name}
            {' '}
            to Lists
          </h3>
          <button type="button" className="close-btn" onClick={handleClose}>
            ×
          </button>
        </ModalHeader>

        {userProfile?.countryLists && userProfile.countryLists.length > 0 ? (
          <>
            <ListGrid>
              {userProfile.countryLists.map((list) => (
                // eslint-disable-next-line no-underscore-dangle
                <ListItem
                  // eslint-disable-next-line no-underscore-dangle
                  key={list._id}
                  // eslint-disable-next-line no-underscore-dangle
                  selected={selectedLists.includes(list._id)}
                  // eslint-disable-next-line no-underscore-dangle
                  onClick={() => handleListToggle(list._id)}
                >
                  <div className="list-name">{list.name}</div>
                  {list.description && (
                    <div className="list-description">{list.description}</div>
                  )}
                  <div className="list-count">
                    {list.countries.length}
                    {' '}
                    countries
                  </div>
                </ListItem>
              ))}
            </ListGrid>

            <ButtonGroup>
              <Button
                type="button"
                className="btn-secondary"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="btn-primary"
                onClick={handleAddToLists}
                disabled={selectedLists.length === 0 || addToListsMutation.isLoading}
              >
                {addToListsMutation.isLoading
                  ? 'Adding...'
                  : `Add to ${selectedLists.length} List${selectedLists.length !== 1 ? 's' : ''}`}
              </Button>
            </ButtonGroup>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <h4>No lists available</h4>
            <p>Create a list first to add countries to it.</p>
            <Button className="btn-secondary" onClick={handleClose}>
              Close
            </Button>
          </div>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddToListModal;
