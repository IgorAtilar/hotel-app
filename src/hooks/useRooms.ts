import { Room } from '@/types/rooms';
import { useQuery, UseQueryOptions } from 'react-query';
import { api } from '@/services/apiClient';

type Response = {
  rooms: Room[];
  count: number;
};

export const getRooms = async (): Promise<Response> => {
  const { data } = await api.get<Response>('rooms');

  return {
    rooms: data.rooms,
    count: data.count,
  };
};

export const useRooms = (options?: UseQueryOptions<Response>) => {
  return useQuery<Response>(['rooms'], getRooms, options);
};
