import { useMemo } from 'react';
import { useGetUserByIdQuery } from '@/features/chatApi';

// Hook to get participant info from participantIds
export const useParticipantInfo = (participantIds, currentUserId) => {
  // Get user info for each participant ID
  const userQueries = participantIds?.map(userId => 
    useGetUserByIdQuery(userId, { skip: !userId })
  ) || [];

  // Extract user data from queries
  const participants = useMemo(() => {
    if (!participantIds || !Array.isArray(participantIds)) return [];
    
    return participantIds.map((userId, index) => {
      const query = userQueries[index];
      if (!query || query.isLoading || query.error || !query.data) {
        return {
          id: userId,
          firstName: 'Loading...',
          lastName: '',
          username: `User${userId}`,
          email: `user${userId}@example.com`,
          avatarUrl: null,
          isOnline: false,
        };
      }
      
      return {
        id: userId,
        firstName: query.data.firstName || '',
        lastName: query.data.lastName || '',
        username: query.data.username || '',
        email: query.data.email || '',
        avatarUrl: query.data.avatarUrl || null,
        isOnline: query.data.isOnline || false,
      };
    });
  }, [participantIds, userQueries]);

  // Find the other participant (not current user)
  const otherParticipant = useMemo(() => {
    if (!currentUserId || !participants.length) return null;
    
    return participants.find(p => p.id !== currentUserId) || null;
  }, [participants, currentUserId]);

  // Check if all user queries are loaded
  const isLoading = userQueries.some(query => query.isLoading);
  const hasError = userQueries.some(query => query.error);

  return {
    participants,
    otherParticipant,
    isLoading,
    hasError,
  };
};
